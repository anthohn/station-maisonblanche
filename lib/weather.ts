/**
 * Météo de la station : types, lecture des données Open-Meteo, libellés, saisons et
 * ambiances de démonstration. Aucun accès réseau ici : tout est pur et testable.
 *
 * Le site lit la météo à Chancy (coordonnées fixes de la station, pas la position du
 * visiteur : pas de demande d'autorisation, aucune donnée personnelle). Voir
 * app/api/meteo/route.ts pour la récupération et app/components/weather pour l'affichage.
 */

export const STATION = { lat: 46.1567, lon: 5.9874, timeZone: 'Europe/Zurich' } as const;

export const CONDITIONS = ['clear', 'partly', 'cloudy', 'fog', 'drizzle', 'rain', 'snow', 'storm'] as const;
export type Condition = (typeof CONDITIONS)[number];

/** Le temps à la station, en valeurs continues (0 → 1) pour pouvoir mélanger brume et bruine, par exemple. */
export interface Weather {
    /** °C, à 2 m du sol */
    temperature: number;
    /** Étiquette principale, pour le libellé */
    condition: Condition;
    /** Couverture nuageuse, 0 (ciel dégagé) → 1 (couvert) */
    cloud: number;
    /** Brouillard, 0 → 1 (1 = visibilité de quelques dizaines de mètres) */
    fog: number;
    /** Intensité de la pluie, 0 → 1 */
    rain: number;
    /** Intensité de la neige, 0 → 1 */
    snow: number;
    /** Vent moyen, km/h */
    wind: number;
    /** Direction d'où vient le vent, en degrés (0 = nord, 270 = ouest) */
    windDir: number;
    /** Instant de la mesure, en ms */
    at: number;
}

/** Ce que l'ambiance (lib/mood.ts) lit de la météo : tout sauf la mesure de température, qui ne sert qu'à la légende. */
export type Sky = Omit<Weather, 'at' | 'temperature'>;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const num = (x: unknown): number | null => (typeof x === 'number' && Number.isFinite(x) ? x : null);

/* ───────────────────────── Lecture d'Open-Meteo ───────────────────────── */

/** Variables demandées à Open-Meteo (« current »). */
export const OPEN_METEO_CURRENT = [
    'temperature_2m',
    'precipitation',
    'snowfall',
    'weather_code',
    'cloud_cover',
    'visibility',
    'wind_speed_10m',
    'wind_direction_10m',
] as const;

// Intensité de la précipitation selon le code météo OMM (WMO) : le code est la source la plus fiable
// pour savoir si c'est de la bruine, de la pluie ou de la neige ; la quantité mesurée ne fait que la renforcer.
const DRIZZLE_CODES: Record<number, number> = { 51: 0.22, 53: 0.34, 55: 0.48, 56: 0.3, 57: 0.45 };
const RAIN_CODES: Record<number, number> = { 61: 0.38, 63: 0.62, 65: 0.9, 66: 0.55, 67: 0.85, 80: 0.45, 81: 0.72, 82: 1 };
const SNOW_CODES: Record<number, number> = { 71: 0.3, 73: 0.55, 75: 0.9, 77: 0.28, 85: 0.5, 86: 0.9 };
const STORM_CODES = new Set([95, 96, 99]);
const FOG_CODES: Record<number, number> = { 45: 0.78, 48: 0.88 };
const CLOUD_BY_CODE: Record<number, number> = { 0: 0.05, 1: 0.25, 2: 0.55, 3: 0.92 };

/**
 * Transforme la réponse d'Open-Meteo (`current`) en `Weather`. Renvoie null si la réponse
 * est inexploitable : le site retombe alors sur une ambiance neutre, sans erreur.
 */
export function fromOpenMeteo(json: unknown, now: number = Date.now()): Weather | null {
    const current = (json as { current?: Record<string, unknown> } | null)?.current;
    if (!current || typeof current !== 'object') return null;

    const temperature = num(current.temperature_2m);
    const code = num(current.weather_code);
    if (temperature === null || code === null) return null;

    const precipitation = num(current.precipitation) ?? 0; // mm, cumul récent
    const snowfall = num(current.snowfall) ?? 0; // cm
    const visibility = num(current.visibility); // m
    const cloudCover = num(current.cloud_cover);
    const wind = Math.max(0, num(current.wind_speed_10m) ?? 0);
    const windDir = num(current.wind_direction_10m) ?? 270;

    // Nuages : mesure si on l'a, sinon déduit du code.
    const cloud = clamp01(cloudCover !== null ? cloudCover / 100 : (CLOUD_BY_CODE[code] ?? (code >= 45 ? 0.9 : 0.4)));

    // Brouillard : code 45/48, ou visibilité réellement basse.
    const fogFromVisibility = visibility !== null ? clamp01((1000 - visibility) / 900) : 0;
    const fog = clamp01(Math.max(FOG_CODES[code] ?? 0, fogFromVisibility));

    // Précipitations : code d'abord, quantité en renfort.
    const mmBoost = clamp01(1 - Math.exp(-precipitation / 1.6));
    let rain = Math.max(DRIZZLE_CODES[code] ?? 0, RAIN_CODES[code] ?? 0);
    let snow = SNOW_CODES[code] ?? 0;
    if (STORM_CODES.has(code)) rain = Math.max(rain, 0.9);
    if (snowfall > 0) snow = Math.max(snow, clamp01(1 - Math.exp(-snowfall / 0.8)));
    if (precipitation > 0 && snow === 0 && temperature > 1) rain = Math.max(rain, mmBoost * 0.9);
    rain = clamp01(rain);
    snow = clamp01(snow);

    let condition: Condition;
    if (STORM_CODES.has(code)) condition = 'storm';
    else if (snow >= 0.12) condition = 'snow';
    else if (rain >= 0.5) condition = 'rain';
    else if (fog >= 0.45) condition = 'fog';
    else if (rain >= 0.1) condition = 'drizzle';
    else if (cloud < 0.2) condition = 'clear';
    else if (cloud < 0.7) condition = 'partly';
    else condition = 'cloudy';

    return { temperature, condition, cloud, fog, rain, snow, wind, windDir, at: now };
}

/* ───────────────────────── Libellés ───────────────────────── */

/** « 4 °C », avec le vrai signe moins et une espace insécable (typographie française). */
export function formatTemperature(temperature: number): string {
    const rounded = Math.round(temperature);
    return `${String(rounded).replace('-', '−')} °C`;
}

export function describe(weather: Weather, daylight: boolean): string {
    switch (weather.condition) {
        case 'clear':
            return daylight ? 'Ensoleillé' : 'Ciel dégagé';
        case 'partly':
            return daylight ? 'Éclaircies' : 'Ciel voilé';
        case 'cloudy':
            return weather.cloud > 0.9 ? 'Couvert' : 'Nuageux';
        case 'fog':
            return weather.fog > 0.75 ? 'Brouillard dense' : 'Brouillard';
        case 'drizzle':
            return 'Bruine';
        case 'rain':
            return weather.rain > 0.8 ? 'Forte pluie' : 'Pluie';
        case 'snow':
            return weather.snow > 0.8 ? 'Fortes chutes de neige' : 'Neige';
        case 'storm':
            return 'Orage';
    }
}

/* ───────────────────────── Saisons ───────────────────────── */

export type Season = 'winter' | 'spring' | 'summer' | 'autumn';

let monthFormat: Intl.DateTimeFormat | undefined;

/** Saison météorologique (l'automne va du 1er septembre au 30 novembre), à l'heure de Genève. */
export function seasonOf(date: Date = new Date()): Season {
    // Genève avance d'une ou deux heures sur UTC : jusqu'au 27 du mois, son mois est celui d'UTC. Intl (une dizaine de
    // millisecondes au premier appel de la page) ne sert donc que les derniers jours du mois, avec un formateur gardé.
    const month =
        date.getUTCDate() <= 27
            ? date.getUTCMonth() + 1
            : Number((monthFormat ??= new Intl.DateTimeFormat('en-GB', { timeZone: STATION.timeZone, month: 'numeric' })).format(date));
    if (month === 12 || month <= 2) return 'winter';
    if (month <= 5) return 'spring';
    if (month <= 8) return 'summer';
    return 'autumn';
}

/* ───────────────────────── Ambiances de démonstration ───────────────────────── */

export interface Preset {
    label: string;
    weather: Sky;
    /** Hauteur du soleil simulée, en degrés (45 = plein jour, 3 = heure dorée, −30 = nuit). */
    elevation: number;
    /** Force l'affichage des feuilles d'automne (sinon : selon la vraie saison). */
    leaves?: boolean;
}

const base = { fog: 0, rain: 0, snow: 0, wind: 8, windDir: 250 };

/**
 * Ambiances que l'on peut forcer avec `?meteo=pluie` (et `?heure=nuit`) pour montrer le site
 * sans attendre la bonne météo. Inoffensif : ça ne change que l'écran de celui qui l'utilise.
 */
export const PRESETS: Record<string, Preset> = {
    soleil: { label: 'Soleil', weather: { ...base, condition: 'clear', cloud: 0.04 }, elevation: 46 },
    eclaircies: { label: 'Éclaircies', weather: { ...base, condition: 'partly', cloud: 0.5, wind: 14 }, elevation: 34 },
    couvert: { label: 'Couvert', weather: { ...base, condition: 'cloudy', cloud: 0.97 }, elevation: 26 },
    brouillard: { label: 'Brouillard', weather: { ...base, condition: 'fog', cloud: 1, fog: 0.88, wind: 3 }, elevation: 14 },
    bruine: { label: 'Bruine', weather: { ...base, condition: 'drizzle', cloud: 0.95, rain: 0.22, wind: 9 }, elevation: 22 },
    pluie: { label: 'Pluie', weather: { ...base, condition: 'rain', cloud: 1, rain: 0.68, wind: 18, windDir: 245 }, elevation: 20 },
    orage: { label: 'Orage', weather: { ...base, condition: 'storm', cloud: 1, rain: 1, wind: 38, windDir: 235 }, elevation: 24 },
    neige: { label: 'Neige', weather: { ...base, condition: 'snow', cloud: 0.97, snow: 0.62, wind: 7 }, elevation: 20 },
    dore: { label: 'Heure dorée', weather: { ...base, condition: 'clear', cloud: 0.18 }, elevation: 3 },
    nuit: { label: 'Nuit', weather: { ...base, condition: 'clear', cloud: 0.1, wind: 5 }, elevation: -32 },
    automne: { label: 'Automne', weather: { ...base, condition: 'partly', cloud: 0.4, wind: 22 }, elevation: 28, leaves: true },
};

/** Heures simulables avec `?heure=` : hauteur du soleil (degrés). */
export const HOURS: Record<string, { label: string; elevation: number }> = {
    matin: { label: 'Matin', elevation: 22 },
    midi: { label: 'Midi', elevation: 46 },
    dore: { label: 'Heure dorée', elevation: 3 },
    bleue: { label: 'Heure bleue', elevation: -5 },
    nuit: { label: 'Nuit', elevation: -32 },
};
