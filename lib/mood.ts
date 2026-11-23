/**
 * De la météo et de la hauteur du soleil à l'ambiance de la photo d'accueil.
 *
 * `computeMood` est une fonction pure : mêmes entrées, mêmes sorties, aucun accès au navigateur.
 * Elle produit des variables CSS (`--wx-*`, posées sur <html> par WeatherAtmosphere) et les
 * réglages des particules (pluie, neige). Les calques eux-mêmes sont dans HeroWeather.tsx et
 * leur mise en forme dans app/globals.css (classes `.wx-*`).
 *
 * Tout est continu : un ciel à moitié couvert, une bruine qui devient pluie ou un coucher de
 * soleil sous la pluie sont des mélanges, pas des cas à part. Sans données météo (service
 * indisponible), on retombe sur un ciel dégagé : la position du soleil, elle, est calculée sur
 * place (lib/sun.ts), donc le jour, la nuit et l'heure dorée restent justes.
 */

import type { Weather } from './weather';

type RGB = [number, number, number];

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Marche douce de 0 à 1 entre e0 et e1 (e0 > e1 est permis : la marche descend). */
function smooth(e0: number, e1: number, x: number): number {
    const t = clamp01((x - e0) / (e1 - e0));
    return t * t * (3 - 2 * t);
}

const mix = (a: RGB, b: RGB, t: number): RGB => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const css = (c: RGB) => `rgb(${Math.round(c[0])} ${Math.round(c[1])} ${Math.round(c[2])})`;
const cssAlpha = (c: RGB, alpha: number) => `rgb(${Math.round(c[0])} ${Math.round(c[1])} ${Math.round(c[2])} / ${Number(alpha.toFixed(3))})`;

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
const num = (x: number, digits = 3) => String(Number(x.toFixed(digits)));

/** Interpolation linéaire entre des repères classés par hauteur du soleil. */
function along<T extends number[]>(stops: [number, T][], x: number): T {
    if (x <= stops[0][0]) return stops[0][1];
    for (let i = 1; i < stops.length; i++) {
        if (x <= stops[i][0]) {
            const [x0, a] = stops[i - 1];
            const [x1, b] = stops[i];
            const t = (x - x0) / (x1 - x0);
            return a.map((v, k) => lerp(v, b[k], t)) as T;
        }
    }
    return stops[stops.length - 1][1];
}

/* ─────────────── Couleurs ─────────────── */

/** Ciel dégagé : [hauteur du soleil, haut du ciel, horizon], du plein jour à la nuit. */
const SKY_CLEAR: [number, number[]][] = [
    [-18, [6, 10, 26, 14, 22, 48]],
    [-9, [14, 26, 62, 38, 54, 100]],
    [-4, [30, 52, 110, 118, 100, 142]],
    [0, [52, 82, 152, 242, 150, 108]],
    [4, [72, 114, 186, 255, 194, 140]],
    [10, [86, 138, 208, 206, 222, 238]],
    [24, [66, 126, 212, 150, 192, 236]],
];

/** Lumière sur la façade (multiplication) : blanche le jour, bleutée la nuit. */
const LIGHT: [number, number[]][] = [
    [-14, [88, 110, 176]],
    [-8, [118, 136, 190]],
    [-4, [158, 164, 204]],
    [0, [226, 204, 196]],
    [4, [255, 238, 218]],
    [10, [255, 255, 255]],
];

/* ─────────────── L'ambiance ─────────────── */

/** Opacité maximale du voile de la page (en haut de l'écran). Au-delà, le texte perd trop de contraste. */
export const PAGE_ALPHA_MAX = 0.16;

export interface Mood {
    /** Variables CSS à poser sur <html>. */
    vars: Record<string, string>;
    /** Calques à charger : un fond d'écran n'est téléchargé que si une règle CSS le demande. */
    needs: {
        fog: boolean;
        pagefog: boolean;
        sky: boolean;
        shade: boolean;
        deck: boolean;
        stars: boolean;
        lights: boolean;
        windows: boolean;
        snow: boolean;
    };
    /** Dérive du brouillard et des nuages : sens du vent (1 = vers la droite, −1 = vers la gauche) et vitesse relative (1 = vent faible). */
    drift: { direction: 1 | -1; rate: number };
    /** Particules : intensité 0 → 1 et inclinaison (vent). */
    particles: { rain: number; snow: number; slant: number };
    /** 0 = plein jour, 1 = nuit noire. */
    night: number;
    /** Le soleil est levé (pour dire « ensoleillé » ou « ciel dégagé »). */
    daylight: boolean;
    /** Orage : éclairs occasionnels. */
    storm: boolean;
    /** Luminosité générale, 0 → 1 (les feuilles et la légende s'y adaptent). */
    lum: number;
}

export function computeMood(weather: Omit<Weather, 'at'> | null, elevation: number, shopOpen = true): Mood {
    const w = weather ?? { temperature: 10, condition: 'clear' as const, cloud: 0, fog: 0, rain: 0, snow: 0, wind: 6, windDir: 250 };
    const cloud = clamp01(w.cloud);
    const fog = clamp01(w.fog);
    const rain = clamp01(w.rain);
    const snow = clamp01(w.snow);
    const storm = w.condition === 'storm';
    const e = elevation;

    // ── Le soleil ─────────────────────────────────────────
    const day = smooth(-6, 9, e); // 0 nuit → 1 jour
    const night = 1 - smooth(-11, -1, e);
    const gold = Math.exp(-(((e - 3.5) / 6.5) ** 2)) * (1 - 0.8 * smooth(0.3, 0.9, cloud)) * (1 - 0.7 * fog);

    // ── Le ciel et la couverture ──────────────────────────
    const shade = smooth(0.25, 1, cloud); // 0 ciel clair → 1 ciel couvert
    const dark = clamp01(0.75 * rain + (storm ? 0.3 : 0)); // pluie et orage assombrissent
    const lum = day * (1 - 0.5 * shade - 0.35 * dark - 0.25 * fog + 0.12 * snow);

    // ── Étalonnage de la photo (filtre CSS sur l'image) ───
    const bright = 1.02 - 0.12 * shade - 0.2 * dark - 0.04 * fog + 0.07 * snow - 0.02 * night - 0.03 * rain;
    const contrast = 1.03 - 0.11 * shade - 0.2 * fog + 0.16 * rain + 0.1 * night;
    const saturate = 1.06 + 0.1 * gold - 0.32 * shade - 0.3 * fog - 0.28 * snow + 0.16 * rain - 0.24 * night;
    const sepia = 0.16 * gold + 0.04 * fog;
    const hue = -6 * snow - 5 * night;
    const grade = `brightness(${num(bright)}) contrast(${num(contrast)}) saturate(${num(Math.max(0.2, saturate))}) sepia(${num(sepia)}) hue-rotate(${num(hue, 1)}deg)`;

    // ── Lumière sur la façade : blanche, dorée ou bleutée ─
    const light = along(LIGHT, e) as RGB;

    // ── Ciel remplacé (derrière : photo ; devant : nuages, étoiles) ──
    const skyBase = along(SKY_CLEAR, e);
    const clearTop = [skyBase[0], skyBase[1], skyBase[2]] as RGB;
    const clearBot = [skyBase[3], skyBase[4], skyBase[5]] as RGB;

    // Ciel couvert : gris clair, plus sombre sous la pluie, laiteux dans le brouillard et la neige.
    const dayLevel = smooth(-9, 10, e);
    let overTop: RGB = mix([166, 174, 184], [78, 84, 98], dark);
    let overBot: RGB = mix([214, 218, 224], [130, 136, 150], dark);
    overTop = mix(overTop, [192, 198, 208], snow * 0.7);
    overBot = mix(overBot, [228, 231, 236], snow * 0.7);
    overTop = mix(overTop, [208, 213, 218], fog * 0.85);
    overBot = mix(overBot, [226, 229, 232], fog * 0.9);
    // La nuit (ou la tombée du jour), le ciel couvert s'éteint ; au coucher du soleil, il garde un reflet orangé.
    const duskGlow = gold * 0.5;
    overTop = mix([22, 27, 40], overTop, dayLevel);
    overBot = mix([34, 40, 58], overBot, dayLevel);
    overBot = mix(overBot, [214, 170, 140], duskGlow * (1 - fog));

    const coverage = Math.max(smooth(0.3, 0.8, cloud), smooth(0.2, 0.6, fog));
    const skyTop = mix(clearTop, overTop, coverage);
    const skyBot = mix(clearBot, overBot, coverage);
    // Le ciel d'origine (bleu, avec ses nuages) ne reste que le jour par temps dégagé.
    const skyAlpha = Math.max(coverage, smooth(16, 7, e));
    const skyClouds = skyAlpha * smooth(0.3, 0.9, cloud) * (1 - 0.6 * fog) * (0.35 + 0.65 * dayLevel);
    const stars = smooth(-8, -16, e) * (1 - smooth(0.05, 0.6, cloud)) * (1 - fog);

    // ── Éclairage : l'enseigne s'allume quand il fait sombre ; les vitrines, seulement si le shop est ouvert ──
    const lights = smooth(0.62, 0.2, lum);
    const windows = shopOpen ? lights : 0;

    // ── Brume, brouillard, voile ──────────────────────────
    const lowMist = 0.16 * rain + 0.1 * snow;
    const fogA = clamp01(fog * 0.58 + lowMist);
    const fogB = clamp01(fog * 0.5 + 0.45 * lowMist);
    const fogLum = lerp(0.2, 1, dayLevel) * (1 - 0.2 * dark);
    const veil = clamp01(fog * 0.74 + snow * 0.16 + shade * 0.04 + rain * 0.06);
    const veilColor = mix([22, 28, 42], mix([206, 211, 216], [226, 229, 233], snow), dayLevel);

    // ── Ombres de nuages sur la façade (éclaircies) ───────
    const partly = smooth(0.12, 0.4, cloud) * (1 - smooth(0.62, 0.95, cloud)) * (1 - fog) * (1 - 0.6 * night);
    const shadows = partly * smooth(4, 14, e) * 0.55;

    // ── Neige sur le toit : seulement s'il neige vraiment et qu'il fait froid ──
    const snowCover = smooth(0.2, 0.5, snow) * smooth(4, 1, w.temperature);

    // ── Atmosphère de la page entière : un voile de lumière par-dessus le contenu (plus marqué en haut, comme le ciel)
    //    et une brume retenue. Posés en MULTIPLICATION (comme un filtre de lumière) : fond et texte s'assombrissent ensemble,
    //    le contraste est mieux conservé qu'avec un voile classique. Plafonné à 16 % (testé : weather.test.mjs). ──
    const blueHour = Math.exp(-(((e + 5) / 4) ** 2));
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

    // ── Lumière dorée ─────────────────────────────────────
    const warm = clamp01(gold * 0.55);

    // ── Vent : sens et vitesse de dérive ──────────────────
    const toEast = -Math.sin((w.windDir * Math.PI) / 180); // vent d'ouest (270°) → souffle vers l'est
    const direction: 1 | -1 = toEast >= 0 ? 1 : -1;
    const rate = clamp((w.wind + 6) / 14, 0.55, 2.4); // vent faible (8 km/h) ≈ 1 ; tempête ≈ 2,4

    // ── Particules ────────────────────────────────────────
    const slant = clamp(toEast * (w.wind / 55), -0.5, 0.5);

    const vars: Record<string, string> = {
        '--wx-grade': grade,
        '--wx-shade': num(shadows),
        '--wx-dim': css(light),
        '--wx-vignette': num(clamp01(0.55 * night + 0.25 * dark + 0.18 * fog * (1 - day))),
        '--wx-warm': num(warm),
        '--wx-sky': num(skyAlpha),
        '--wx-sky-top': css(skyTop),
        '--wx-sky-bot': css(skyBot),
        '--wx-sky-clouds': num(skyClouds),
        '--wx-stars': num(stars),
        '--wx-snowcover': num(snowCover),
        '--wx-lights': num(lights),
        '--wx-windows': num(windows),
        '--wx-fog-a': num(fogA),
        '--wx-fog-b': num(fogB),
        // La brume s'assombrit à la tombée du jour ; par jour clair, aucun filtre (un filtre inutile coûte à chaque image).
        '--wx-fog-filter': fogLum < 0.985 ? `brightness(${num(fogLum)})` : 'none',
        '--wx-veil': num(veil),
        '--wx-veil-color': css(veilColor),
        '--wx-page-top': cssAlpha(pageColor, pageAlpha),
        '--wx-page-bottom': cssAlpha(pageColor, pageAlpha * 0.3),
        '--wx-page-warm': cssAlpha([255, 176, 96], pageWarm),
        '--wx-page-fog': num(pageFog),
    };

    return {
        vars,
        needs: {
            fog: fogA > 0.02 || fogB > 0.02,
            pagefog: pageFog > 0.02,
            sky: skyAlpha > 0.02 || shadows > 0.02,
            shade: shadows > 0.02,
            deck: skyClouds > 0.02,
            stars: stars > 0.02,
            lights: lights > 0.02,
            windows: windows > 0.02,
            snow: snowCover > 0.02,
        },
        drift: { direction, rate },
        particles: { rain: rain > 0.03 ? rain : 0, snow: snow > 0.03 ? snow : 0, slant },
        night,
        daylight: e > -1,
        storm,
        lum: clamp01(lum),
    };
}

function clamp(x: number, lo: number, hi: number) {
    return Math.min(hi, Math.max(lo, x));
}
