/**
 * Tests de la météo : lecture d'Open-Meteo, ambiances, horaires du shop.
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
import { describe as describeWeather, formatTemperature, fromOpenMeteo, HOURS, PRESETS, seasonOf, shopIsOpen, STATION } from '../../lib/weather.ts';

// Réponse d'Open-Meteo (format documenté), modifiable champ par champ
const response = (current) => ({
    latitude: 46.15, longitude: 5.98, timezone: 'GMT',
    current: { time: '2026-11-23T13:15', interval: 900, temperature_2m: 6.1, relative_humidity_2m: 90, is_day: 1, precipitation: 0, rain: 0, showers: 0, snowfall: 0, weather_code: 0, cloud_cover: 10, visibility: 24000, wind_speed_10m: 6, wind_direction_10m: 240, ...current },
});
const read = (current) => fromOpenMeteo(response(current), 1);
const sky = (m, name) => parseFloat(m.vars[name]);

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
});

describe('horaires du shop (Genève, heure d’été comprise)', () => {
    for (const [iso, open, why] of [
        ['2026-11-23T04:59:00Z', false, 'lundi 05:59'], ['2026-11-23T05:00:00Z', true, 'lundi 06:00'],
        ['2026-11-23T19:29:00Z', true, 'lundi 20:29'], ['2026-11-23T19:30:00Z', false, 'lundi 20:30'],
        ['2026-11-28T05:30:00Z', false, 'samedi 06:30 (ouvre à 07:00)'], ['2026-11-28T06:00:00Z', true, 'samedi 07:00'],
        ['2026-11-29T06:15:00Z', false, 'dimanche 07:15 (ouvre à 07:30)'], ['2026-11-29T06:30:00Z', true, 'dimanche 07:30'],
        ['2026-07-15T04:00:00Z', true, 'mercredi 06:00, heure d’été'], ['2026-07-15T03:59:00Z', false, 'mercredi 05:59, heure d’été'],
    ]) it(`${why} → ${open ? 'ouvert' : 'fermé'}`, () => assert.equal(shopIsOpen(new Date(iso)), open));
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
    const OPACITIES = ['--wx-shade', '--wx-vignette', '--wx-warm', '--wx-sky', '--wx-sky-clouds', '--wx-stars', '--wx-windows', '--wx-snowcover', '--wx-fog-a', '--wx-fog-b', '--wx-veil', '--wx-page-fog'];

    it('toutes les opacités restent dans [0, 1], aucune valeur NaN, quelle que soit la combinaison', () => {
        let combinations = 0;
        for (const cloud of [0, 0.3, 0.6, 1]) for (const fog of [0, 0.5, 1]) for (const rain of [0, 0.4, 1]) for (const snow of [0, 0.5])
            for (const temperature of [-5, 5]) for (const elevation of [-40, -20, -10, -5, -1, 0, 3, 8, 15, 30, 60]) {
                if (rain && snow) continue;
                const mood = computeMood({ temperature, condition: 'cloudy', cloud, fog, rain, snow, wind: 12, windDir: 200 }, elevation);
                for (const name of OPACITIES) { const v = sky(mood, name); assert.ok(v >= 0 && v <= 1, `${name}=${v}`); }
                for (const [name, value] of Object.entries(mood.vars)) assert.ok(!/NaN|undefined|Infinity/.test(value), `${name}=${value}`);
                combinations++;
            }
        assert.ok(combinations > 500);
    });
    it('sans données par plein jour : la photo d’origine, rien d’ajouté', () => {
        const mood = computeMood(null, 46);
        assert.equal(sky(mood, '--wx-sky'), 0); assert.equal(sky(mood, '--wx-windows'), 0); assert.equal(sky(mood, '--wx-fog-a'), 0); assert.equal(mood.particles.rain, 0);
    });
    it('plein jour dégagé : rien ; nuit : vitrines éclairées, étoiles, ciel remplacé ; l’enseigne n’est jamais rétro-éclairée', () => {
        const noon = computeMood(PRESETS.soleil.weather, 46);
        assert.equal(sky(noon, '--wx-sky'), 0); assert.equal(sky(noon, '--wx-windows'), 0); assert.ok(sky(noon, '--wx-warm') < 0.01); assert.ok(noon.daylight);
        const night = computeMood(PRESETS.nuit.weather, -32);
        assert.ok(sky(night, '--wx-windows') > 0.99 && sky(night, '--wx-stars') > 0.9 && sky(night, '--wx-sky') === 1 && night.night > 0.99 && !night.daylight);
    });
    it('il n’y a plus de rétro-éclairage de l’enseigne : ni variable, ni calque, ni image', () => {
        for (const [, p] of Object.entries(PRESETS)) {
            const mood = computeMood(p.weather, p.elevation, true);
            assert.equal(mood.vars['--wx-lights'], undefined);
            assert.equal('lights' in mood.needs, false);
        }
    });
    it('les vitrines ne s’allument que si le shop est ouvert', () => {
        const closed = computeMood(PRESETS.nuit.weather, -32, false);
        const open = computeMood(PRESETS.nuit.weather, -32, true);
        assert.equal(sky(closed, '--wx-windows'), 0);
        assert.ok(sky(open, '--wx-windows') > 0.99);
    });
    it('brouillard, pluie, neige, heure dorée, éclaircies, orage : chacun produit les bons calques', () => {
        const fog = computeMood(PRESETS.brouillard.weather, 14);
        assert.ok(sky(fog, '--wx-fog-a') > 0.45 && sky(fog, '--wx-veil') > 0.6 && fog.needs.fog);
        const rain = computeMood(PRESETS.pluie.weather, 20);
        assert.ok(rain.particles.rain > 0.6 && rain.particles.snow === 0 && sky(rain, '--wx-sky') > 0.9);
        const snow = computeMood(PRESETS.neige.weather, 20);
        assert.ok(snow.particles.snow > 0.5 && snow.particles.rain === 0 && sky(snow, '--wx-snowcover') > 0.9 && snow.needs.snow);
        const gold = computeMood(PRESETS.dore.weather, 3);
        assert.ok(sky(gold, '--wx-warm') > 0.4 && sky(gold, '--wx-sky') > 0.8);
        const partly = computeMood(PRESETS.eclaircies.weather, 34);
        assert.ok(sky(partly, '--wx-shade') > 0.2 && partly.needs.shade);
        assert.ok(computeMood(PRESETS.orage.weather, 24).storm);
    });
    it('la neige ne couvre pas le toit quand il fait doux', () => {
        const mood = computeMood({ ...PRESETS.neige.weather, temperature: 6 }, 20);
        assert.equal(sky(mood, '--wx-snowcover'), 0);
    });
    it('la lumière évolue sans saut brutal quand le soleil se lève ou se couche', () => {
        let worst = 0, previous = computeMood(PRESETS.soleil.weather, -40);
        for (let e = -39.5; e <= 60; e += 0.5) {
            const mood = computeMood(PRESETS.soleil.weather, e);
            for (const name of ['--wx-sky', '--wx-windows', '--wx-warm', '--wx-stars', '--wx-vignette']) worst = Math.max(worst, Math.abs(sky(mood, name) - sky(previous, name)));
            previous = mood;
        }
        assert.ok(worst < 0.2, `variation maximale ${worst}`);
    });
    it('le vent d’ouest pousse brume et pluie vers la droite, le vent d’est vers la gauche', () => {
        assert.equal(computeMood({ ...PRESETS.pluie.weather, windDir: 270 }, 20).drift.direction, 1);
        assert.equal(computeMood({ ...PRESETS.pluie.weather, windDir: 90 }, 20).drift.direction, -1);
        assert.ok(computeMood({ ...PRESETS.pluie.weather, windDir: 270, wind: 30 }, 20).particles.slant > 0);
        assert.ok(computeMood({ ...PRESETS.pluie.weather, windDir: 90, wind: 30 }, 20).particles.slant < 0);
    });
    it('chaque heure et chaque ambiance de démonstration se calcule', () => {
        for (const hour of Object.values(HOURS)) assert.ok(computeMood(PRESETS.soleil.weather, hour.elevation, hour.open).vars['--wx-grade']);
        for (const preset of Object.values(PRESETS)) assert.ok(computeMood(preset.weather, preset.elevation, preset.open ?? true).vars['--wx-grade']);
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
    ...Object.entries(PRESETS).map(([name, p]) => [name, computeMood(p.weather, p.elevation, p.open ?? true)]),
    ...Object.entries(HOURS).map(([name, h]) => [`heure ${name}`, computeMood(PRESETS.soleil.weather, h.elevation, h.open)]),
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
        assert.equal(computeMood(PRESETS.soleil.weather, 46).needs.pagefog, false);
        assert.equal(computeMood(PRESETS.brouillard.weather, 14).needs.pagefog, true);
        assert.ok(sky(computeMood(PRESETS.brouillard.weather, 14), '--wx-page-fog') <= 0.3 + 1e-9);
    });
});

