/**
 * De la météo et de la hauteur du soleil à l'atmosphère de la page.
 *
 * `computeMood` est une fonction pure : mêmes entrées, mêmes sorties, aucun accès au navigateur.
 * Elle produit des variables CSS (`--wx-page-*`, posées sur <html> par WeatherAtmosphere) et les
 * réglages des particules (pluie, neige, feuilles). Les calques eux-mêmes sont dans WeatherAtmosphere.tsx
 * et leur mise en forme dans weather.css (classes `.wx-*`). La photo d'accueil, elle, n'est jamais modifiée.
 *
 * Tout est continu : un ciel à moitié couvert, une bruine qui devient pluie ou un coucher de
 * soleil sous la pluie sont des mélanges, pas des cas à part. Sans données météo (service
 * indisponible), on retombe sur un ciel dégagé : la position du soleil, elle, est calculée sur
 * place (lib/sun.ts), donc le jour, la nuit et l'heure dorée restent justes.
 */

import type { Sky } from './weather';

type RGB = [number, number, number];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

/** Marche douce de 0 à 1 entre e0 et e1 (e0 > e1 est permis : la marche descend). */
function smooth(e0: number, e1: number, x: number): number {
    const t = clamp01((x - e0) / (e1 - e0));
    return t * t * (3 - 2 * t);
}

const num = (x: number, digits = 3) => String(Number(x.toFixed(digits)));
const cssAlpha = (c: RGB, alpha: number) => `rgb(${Math.round(c[0])} ${Math.round(c[1])} ${Math.round(c[2])} / ${num(alpha)})`;

/** Superpose des voiles colorés (couleur, opacité) comme le fait un navigateur ; l'opacité finale est plafonnée. */
function composite(layers: [RGB, number][], cap: number): [RGB, number] {
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    for (const [color, alpha] of layers) {
        const k = clamp01(alpha);
        const out = k + a * (1 - k);
        if (out <= 0) continue;
        r = (color[0] * k + r * a * (1 - k)) / out;
        g = (color[1] * k + g * a * (1 - k)) / out;
        b = (color[2] * k + b * a * (1 - k)) / out;
        a = out;
    }
    return [[r, g, b], Math.min(a, cap)];
}

/* ─────────────── L'ambiance ─────────────── */

/** Opacité maximale du voile de la page (en haut de l'écran). Au-delà, le texte perd trop de contraste. */
export const PAGE_ALPHA_MAX = 0.16;

export interface Mood {
    /** Variables CSS à poser sur <html>. */
    vars: Record<string, string>;
    /** Textures à charger : un fond d'écran n'est téléchargé que si une règle CSS le demande. */
    needs: { pagefog: boolean };
    /** Dérive de la brume : sens du vent (1 = vers la droite, −1 = vers la gauche) et vitesse relative (1 = vent faible). */
    drift: { direction: 1 | -1; rate: number };
    /** Particules : intensité 0 → 1 et inclinaison (vent). */
    particles: { rain: number; snow: number; slant: number };
    /** Le soleil est levé (pour dire « ensoleillé » ou « ciel dégagé »). */
    daylight: boolean;
    /** Orage : éclairs occasionnels. */
    storm: boolean;
    /** Luminosité générale, 0 → 1 (les feuilles s'y adaptent). */
    lum: number;
}

export function computeMood(weather: Sky | null, elevation: number): Mood {
    const w = weather ?? { condition: 'clear' as const, cloud: 0, fog: 0, rain: 0, snow: 0, wind: 6, windDir: 250 };
    const cloud = clamp01(w.cloud);
    const fog = clamp01(w.fog);
    const rain = clamp01(w.rain);
    const snow = clamp01(w.snow);
    const storm = w.condition === 'storm';
    const e = elevation;

    // ── Le soleil ─────────────────────────────────────────
    const day = smooth(-6, 9, e); // 0 nuit → 1 jour
    const night = 1 - smooth(-11, -1, e);
    const blueHour = Math.exp(-(((e + 5) / 4) ** 2));
    const gold = Math.exp(-(((e - 3.5) / 6.5) ** 2)) * (1 - 0.8 * smooth(0.3, 0.9, cloud)) * (1 - 0.7 * fog);

    // ── Le ciel et la couverture ──────────────────────────
    const shade = smooth(0.25, 1, cloud); // 0 ciel clair → 1 ciel couvert
    const dark = clamp01(0.75 * rain + (storm ? 0.3 : 0)); // pluie et orage assombrissent
    const lum = day * (1 - 0.5 * shade - 0.35 * dark - 0.25 * fog + 0.12 * snow);
    const lowMist = 0.16 * rain + 0.1 * snow;

    // ── Atmosphère de la page entière : un voile de lumière par-dessus le contenu (plus marqué en haut, comme le ciel)
    //    et une brume retenue. Posés en MULTIPLICATION (comme un filtre de lumière) : fond et texte s'assombrissent ensemble,
    //    le contraste est mieux conservé qu'avec un voile classique. Plafonné à 16 % (testé : weather.test.mjs). ──
    const [pageColor, pageAlpha] = composite(
        [
            [[116, 132, 154], 0.085 * shade], // couvert : gris-bleu
            [[58, 74, 102], 0.085 * dark + (storm ? 0.05 : 0)], // pluie et orage : plus sombre
            [[182, 192, 206], 0.2 * fog], // brouillard : lumière grise et diffuse
            [[224, 233, 247], 0.11 * snow], // neige : blanc froid
            [[16, 28, 72], 0.19 * night + 0.07 * blueHour], // nuit : bleu marine (pas de thème sombre : on lit toujours)
        ],
        PAGE_ALPHA_MAX,
    );
    const pageWarm = clamp01(0.04 * day * (1 - shade) * (1 - fog) + 0.12 * gold); // lueur du soleil, coin haut droit
    const pageFog = clamp01(0.3 * fog + 0.5 * lowMist);

    // ── Vent : sens et vitesse de dérive ──────────────────
    const toEast = -Math.sin((w.windDir * Math.PI) / 180); // vent d'ouest (270°) → souffle vers l'est
    const direction: 1 | -1 = toEast >= 0 ? 1 : -1;
    const rate = clamp((w.wind + 6) / 14, 0.55, 2.4); // vent faible (8 km/h) ≈ 1 ; tempête ≈ 2,4

    // ── Particules ────────────────────────────────────────
    const slant = clamp(toEast * (w.wind / 55), -0.5, 0.5);

    const vars: Record<string, string> = {
        '--wx-page-top': cssAlpha(pageColor, pageAlpha),
        '--wx-page-bottom': cssAlpha(pageColor, pageAlpha * 0.3),
        '--wx-page-warm': cssAlpha([255, 176, 96], pageWarm),
        '--wx-page-fog': num(pageFog),
    };

    return {
        vars,
        needs: { pagefog: pageFog > 0.02 },
        drift: { direction, rate },
        particles: { rain: rain > 0.03 ? rain : 0, snow: snow > 0.03 ? snow : 0, slant },
        daylight: e > -1,
        storm,
        lum: clamp01(lum),
    };
}
