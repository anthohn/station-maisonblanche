/**
 * Tests de la météo : lecture d'Open-Meteo, saisons, soleil, ambiances de la page, lisibilité.
 *
 *   npm run test:meteo
 *
 * Node 22 ou plus : les fichiers TypeScript de lib/ sont lus directement (--experimental-strip-types).
 * Aucun accès réseau.
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { computeMood, PAGE_ALPHA_MAX } from '../../lib/mood.ts';
import { sunElevation } from '../../lib/sun.ts';
import { describe as describeWeather, formatTemperature, fromOpenMeteo, HOURS, PRESETS, seasonOf, STATION } from '../../lib/weather.ts';

// Réponse d'Open-Meteo (format documenté), modifiable champ par champ
const response = (current) => ({
    latitude: 46.15, longitude: 5.98, timezone: 'GMT',
    current: { time: '2026-11-23T13:15', interval: 900, temperature_2m: 6.1, relative_humidity_2m: 90, is_day: 1, precipitation: 0, rain: 0, showers: 0, snowfall: 0, weather_code: 0, cloud_cover: 10, visibility: 24000, wind_speed_10m: 6, wind_direction_10m: 240, ...current },
});
const read = (current) => fromOpenMeteo(response(current), 1);
const sky = (m, name) => parseFloat(m.vars[name]);
/** Ambiance d'une ambiance de démonstration, à sa propre hauteur de soleil (pas de copie du chiffre dans les tests). */
const preset = (name) => computeMood(PRESETS[name].weather, PRESETS[name].elevation);
/** Opacité d'une couleur `rgb(r g b / a)` posée par computeMood (voile de la page). */
const alphaOf = (m, name) => Number(m.vars[name].match(/\/ ([\d.]+)\)/)[1]);
/** Brume de la page au maximum : 30 % par brouillard seul, jusqu'à 38 % avec de la pluie par-dessus (0,3 × brouillard + 0,5 × 0,16 × pluie). */
const PAGE_FOG_MAX = 0.38;

describe('lecture d’Open-Meteo', () => {
    it('ciel dégagé, éclaircies, couvert', () => {
        assert.equal(read({ weather_code: 0, cloud_cover: 4 }).condition, 'clear');
        assert.equal(read({ weather_code: 2, cloud_cover: 55 }).condition, 'partly');
        assert.equal(read({ weather_code: 3, cloud_cover: 100 }).condition, 'cloudy');
    });
    it('brouillard : par le code, ou par une visibilité réellement basse (pas une simple brume)', () => {
        const dense = read({ weather_code: 45, cloud_cover: 100, visibility: 180 });
        assert.equal(dense.condition, 'fog'); assert.ok(dense.fog > 0.85);
        assert.equal(read({ weather_code: 3, cloud_cover: 100, visibility: 300 }).condition, 'fog');
        const haze = read({ weather_code: 3, cloud_cover: 90, visibility: 3000 });
        assert.equal(haze.fog, 0); assert.equal(haze.condition, 'cloudy');
    });
    it('bruine, pluie, averses, orage', () => {
        const drizzle = read({ weather_code: 53, cloud_cover: 100, precipitation: 0.1 });
        assert.equal(drizzle.condition, 'drizzle'); assert.ok(drizzle.rain > 0.3 && drizzle.rain < 0.5);
        assert.equal(read({ weather_code: 63, cloud_cover: 100, precipitation: 1.2 }).condition, 'rain');
        assert.ok(read({ weather_code: 65, cloud_cover: 100, precipitation: 3.2 }).rain >= 0.9);
        assert.equal(read({ weather_code: 81, cloud_cover: 90, precipitation: 0.9 }).condition, 'rain');
        const storm = read({ weather_code: 95, cloud_cover: 100, precipitation: 2 });
        assert.equal(storm.condition, 'storm'); assert.ok(storm.rain >= 0.9);
    });
    it('neige : pas de pluie en même temps', () => {
        const snow = read({ weather_code: 73, cloud_cover: 100, temperature_2m: -1.5, snowfall: 0.6 });
        assert.equal(snow.condition, 'snow'); assert.ok(snow.snow >= 0.55); assert.equal(snow.rain, 0);
    });
    it('la quantité mesurée renforce le code (couvert + 0,8 mm = bruine) ; nuages absents déduits du code', () => {
        assert.equal(read({ weather_code: 3, cloud_cover: 100, precipitation: 0.8 }).condition, 'drizzle');
        const w = read({ weather_code: 2, cloud_cover: undefined });
        assert.ok(w.cloud > 0.4 && w.cloud < 0.7);
    });
    it('le vent est conservé', () => {
        const w = read({ wind_speed_10m: 31, wind_direction_10m: 245 });
        assert.equal(w.wind, 31); assert.equal(w.windDir, 245);
    });
    it('une réponse inexploitable donne null, jamais une erreur', () => {
        for (const bad of [null, {}, { current: {} }, { current: { weather_code: 0 } }, { current: { temperature_2m: 5 } }, 'oups', { current: { temperature_2m: NaN, weather_code: 0 } }]) {
            assert.equal(fromOpenMeteo(bad), null);
        }
    });
    it('libellés et typographie française', () => {
        assert.equal(formatTemperature(4.4), '4 °C');
        assert.equal(formatTemperature(-2.4), '−2 °C');
        assert.equal(formatTemperature(-0.2), '0 °C'); // jamais « −0 °C »
        const clear = read({ weather_code: 0, cloud_cover: 4 });
        assert.equal(describeWeather(clear, true), 'Ensoleillé');
        assert.equal(describeWeather(clear, false), 'Ciel dégagé');
    });
});

describe('saisons (heure de Genève)', () => {
    for (const [iso, expected] of [
        ['2026-11-23T12:00:00Z', 'autumn'], ['2026-11-30T22:30:00Z', 'autumn'], ['2026-11-30T23:30:00Z', 'winter'],
        ['2026-12-01T12:00:00Z', 'winter'], ['2026-03-01T12:00:00Z', 'spring'], ['2026-08-31T23:30:00Z', 'autumn'], ['2026-07-14T12:00:00Z', 'summer'],
    ]) it(`${iso} → ${expected}`, () => assert.equal(seasonOf(new Date(iso)), expected));

    it('le raccourci UTC (jusqu’au 27) donne le même mois qu’Intl, toutes les 30 minutes sur trois ans', () => {
        const genevaMonth = new Intl.DateTimeFormat('en-GB', { timeZone: STATION.timeZone, month: 'numeric' });
        const seasonOfMonth = (m) => (m === 12 || m <= 2 ? 'winter' : m <= 5 ? 'spring' : m <= 8 ? 'summer' : 'autumn');
        const end = Date.UTC(2028, 0, 1);
        for (let t = Date.UTC(2025, 0, 1); t < end; t += 30 * 60000) assert.equal(seasonOf(new Date(t)), seasonOfMonth(Number(genevaMonth.format(t))), new Date(t).toISOString());
    });
});

describe('position du soleil à Chancy', () => {
    it('23 novembre : lever vers 07:49, coucher vers 16:57, hauteur maximale ≈ 23,5°', () => {
        const day = Date.UTC(2026, 10, 23);
        const at = (minutes) => sunElevation(day + minutes * 60000, STATION.lat, STATION.lon);
        let rise = null, set = null, max = -90;
        for (let m = 0; m < 1440; m++) {
            const e = at(m);
            max = Math.max(max, e);
            if (rise === null && e > -0.833) rise = m;
            if (rise !== null && set === null && e < -0.833) set = m;
        }
        const clock = (utcMinutes) => { const local = utcMinutes + 60; return `${String(Math.floor(local / 60)).padStart(2, '0')}:${String(local % 60).padStart(2, '0')}`; };
        assert.ok(Math.abs(rise - (6 * 60 + 49)) <= 4, `lever ${clock(rise)}`);
        assert.ok(Math.abs(set - (15 * 60 + 57)) <= 4, `coucher ${clock(set)}`);
        assert.ok(Math.abs(max - 23.5) < 1, `hauteur maximale ${max.toFixed(1)}°`);
    });
});

describe('ambiances (lib/mood.ts)', () => {
    it('toutes les valeurs restent bornées, aucune valeur NaN, quelle que soit la combinaison', () => {
        let combinations = 0;
        for (const cloud of [0, 0.3, 0.6, 1]) for (const fog of [0, 0.5, 1]) for (const rain of [0, 0.4, 1]) for (const snow of [0, 0.5])
            for (const elevation of [-40, -20, -10, -5, -1, 0, 3, 8, 15, 30, 60]) {
                if (rain && snow) continue;
                const mood = computeMood({ condition: 'cloudy', cloud, fog, rain, snow, wind: 12, windDir: 200 }, elevation);
                const fogVar = sky(mood, '--wx-page-fog');
                assert.ok(fogVar >= 0 && fogVar <= PAGE_FOG_MAX + 1e-9, `--wx-page-fog=${fogVar}`);
                for (const name of ['--wx-page-top', '--wx-page-bottom', '--wx-page-warm']) { const a = alphaOf(mood, name); assert.ok(a >= 0 && a <= PAGE_ALPHA_MAX + 1e-9, `${name}=${a}`); }
                for (const [name, value] of Object.entries(mood.vars)) assert.ok(!/NaN|undefined|Infinity/.test(value), `${name}=${value}`);
                for (const value of [mood.lum, mood.particles.rain, mood.particles.snow]) assert.ok(value >= 0 && value <= 1, `valeur ${value}`);
                combinations++;
            }
        assert.ok(combinations > 500);
    });
    it('la photo d’accueil n’est jamais touchée : seules des variables de la page, aucune texture de photo', () => {
        for (const [name, mood] of everyState()) {
            for (const variable of Object.keys(mood.vars)) assert.match(variable, /^--wx-page-/, `${name} : ${variable}`);
            assert.deepEqual(Object.keys(mood.needs), ['pagefog'], name);
        }
    });
    it('sans données par plein jour : ni voile, ni brume, ni particule', () => {
        const mood = computeMood(null, 46);
        assert.equal(alphaOf(mood, '--wx-page-top'), 0); assert.equal(sky(mood, '--wx-page-fog'), 0); assert.equal(mood.needs.pagefog, false);
        assert.equal(mood.particles.rain, 0); assert.equal(mood.particles.snow, 0); assert.equal(mood.storm, false);
    });
    it('plein jour dégagé : à peine un voile ; nuit : voile bleu marine, et le jour se lève bien', () => {
        const noon = preset('soleil');
        assert.ok(alphaOf(noon, '--wx-page-top') < 0.01 && alphaOf(noon, '--wx-page-warm') < 0.06 && noon.daylight);
        const night = preset('nuit');
        const { tint, alpha } = readVeil(night);
        assert.ok(alpha > 0.15 && tint[2] > tint[0] + 30 && !night.daylight && night.lum === 0);
    });
    it('brouillard, pluie, neige, heure dorée, éclaircies, orage : chacun produit l’atmosphère attendue', () => {
        const clear = alphaOf(preset('soleil'), '--wx-page-top');
        const fog = preset('brouillard');
        assert.ok(sky(fog, '--wx-page-fog') > 0.2 && fog.needs.pagefog && alphaOf(fog, '--wx-page-top') > clear + 0.1);
        const rain = preset('pluie');
        const drizzle = preset('bruine');
        assert.ok(drizzle.particles.rain > 0.15 && drizzle.particles.rain < rain.particles.rain);
        assert.ok(rain.particles.rain > 0.6 && rain.particles.snow === 0 && rain.needs.pagefog && alphaOf(rain, '--wx-page-top') > clear + 0.04);
        const snow = preset('neige');
        assert.ok(snow.particles.snow > 0.5 && snow.particles.rain === 0 && snow.needs.pagefog);
        const gold = preset('dore');
        assert.ok(alphaOf(gold, '--wx-page-warm') > 0.1);
        const partly = preset('eclaircies');
        assert.ok(alphaOf(partly, '--wx-page-top') < 0.05 && !partly.needs.pagefog);
        const storm = preset('orage');
        assert.ok(storm.storm && alphaOf(storm, '--wx-page-top') > alphaOf(rain, '--wx-page-top'));
    });
    it('la lumière évolue sans saut brutal quand le soleil se lève ou se couche', () => {
        let worst = 0, previous = computeMood(PRESETS.soleil.weather, -40);
        for (let e = -39.5; e <= 60; e += 0.5) {
            const mood = computeMood(PRESETS.soleil.weather, e);
            for (const name of ['--wx-page-top', '--wx-page-warm']) worst = Math.max(worst, Math.abs(alphaOf(mood, name) - alphaOf(previous, name)));
            worst = Math.max(worst, Math.abs(mood.lum - previous.lum));
            previous = mood;
        }
        assert.ok(worst < 0.1, `variation maximale ${worst}`);
    });
    it('le vent d’ouest pousse brume et pluie vers la droite, le vent d’est vers la gauche', () => {
        assert.equal(computeMood({ ...PRESETS.pluie.weather, windDir: 270 }, 20).drift.direction, 1);
        assert.equal(computeMood({ ...PRESETS.pluie.weather, windDir: 90 }, 20).drift.direction, -1);
        assert.ok(computeMood({ ...PRESETS.pluie.weather, windDir: 270, wind: 30 }, 20).particles.slant > 0);
        assert.ok(computeMood({ ...PRESETS.pluie.weather, windDir: 90, wind: 30 }, 20).particles.slant < 0);
    });
});

/* ───────── Atmosphère de la page entière : le texte doit rester lisible ───────── */

// Le voile de la page est posé en MULTIPLICATION (mix-blend-mode: multiply, voir weather.css) : chaque couleur de la page
// (fond comme texte) est multipliée par la teinte du voile. On rejoue ici ce calcul pour des couples de couleurs du site.
const luminance = ([r, g, b]) => {
    const lin = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const contrast = (a, b) => {
    const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
};
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const multiply = (color, tint, alpha) => color.map((c, i) => c * (1 - alpha + alpha * (tint[i] / 255)));
const readVeil = (mood) => {
    const [, r, g, b, a] = mood.vars['--wx-page-top'].match(/rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)/);
    return { tint: [Number(r), Number(g), Number(b)], alpha: Number(a) };
};
const everyState = () => [
    ...Object.entries(PRESETS).map(([name, p]) => [name, computeMood(p.weather, p.elevation)]),
    ...Object.entries(HOURS).map(([name, h]) => [`heure ${name}`, computeMood(PRESETS.soleil.weather, h.elevation)]),
];

describe('lisibilité sous le voile de la page', () => {
    // [texte, fond, rapport minimal par rapport à l'origine, rapport absolu minimal]
    const PAIRS = {
        'titres (gris foncé sur blanc)': [hex('#1e293b'), [255, 255, 255], 0.5, 7],
        'texte courant (ardoise 600 sur blanc)': [hex('#475569'), [255, 255, 255], 0.7, 4.5],
        // Déjà à 4,54:1 à l'origine, juste au-dessus du seuil : aucun voile ne peut le garder au-dessus de 4,5.
        // On exige qu'il perde au plus 10 % (voir README : passer ce gris en ardoise 600 donnerait de la marge).
        'paragraphe d’accueil (ardoise 500 sur crème)': [hex('#64748b'), [255, 249, 238], 0.9, 0],
        'pied de page (ardoise 500 sur gris très clair)': [hex('#64748b'), hex('#f8fafc'), 0.9, 0],
    };

    it(`le voile ne dépasse jamais ${PAGE_ALPHA_MAX * 100} % d’opacité`, () => {
        for (const [name, mood] of everyState()) assert.ok(readVeil(mood).alpha <= PAGE_ALPHA_MAX + 1e-9, `${name} : ${readVeil(mood).alpha}`);
    });
    for (const [label, [text, background, minShare, minAbsolute]] of Object.entries(PAIRS)) {
        it(`${label} : contraste conservé dans tous les états`, () => {
            const original = contrast(text, background);
            for (const [name, mood] of everyState()) {
                const { tint, alpha } = readVeil(mood);
                const veiled = contrast(multiply(text, tint, alpha), multiply(background, tint, alpha));
                assert.ok(veiled >= original * minShare, `${name} : ${veiled.toFixed(2)} contre ${original.toFixed(2)} à l’origine`);
                assert.ok(veiled >= minAbsolute, `${name} : ${veiled.toFixed(2)} (minimum ${minAbsolute})`);
            }
        });
    }
    it('la brume de la page n’est chargée que s’il y a de la brume', () => {
        assert.equal(preset('soleil').needs.pagefog, false);
        assert.equal(preset('brouillard').needs.pagefog, true);
        assert.ok(sky(preset('brouillard'), '--wx-page-fog') <= 0.3 + 1e-9);
    });
});

