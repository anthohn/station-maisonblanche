import { useSyncExternalStore } from 'react';
import { CONDITIONS, HOURS, PRESETS, type Condition, type Sky, type Weather } from '@/lib/weather';

/**
 * Données météo côté navigateur : la météo réelle (lue sur /api/meteo, renouvelée toutes les 10 minutes)
 * et, si on le demande, un aperçu (`?meteo=pluie`, `?heure=nuit`) pour montrer le site sous un autre temps.
 *
 * Tout est facultatif : sans données, le site garde son ambiance neutre (le soleil, lui, est calculé sur place).
 */

/** Aperçu choisi : clés de PRESETS et de HOURS (lib/weather.ts). */
export interface Preview {
    meteo: string | null;
    heure: string | null;
}

export interface WeatherSnapshot {
    /** Météo réelle à la station ; null tant qu'on ne la connaît pas ou si le service est indisponible. */
    weather: Weather | null;
    /** Aperçu demandé ; null en temps normal. */
    preview: Preview | null;
    /** Heure courante (ms), remise à jour chaque minute : le soleil avance. 0 tant que la page n'est pas prête. */
    now: number;
    /** Effets météo de la page (voile, brume, pluie, neige, feuilles) : le visiteur peut les suspendre (pied de page). */
    effects: boolean;
}

// Côté serveur et au premier rendu, rien ne dépend de la météo : l'hydratation reste identique.
const SERVER_SNAPSHOT: WeatherSnapshot = { weather: null, preview: null, now: 0, effects: true };
let snapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();

function update(patch: Partial<WeatherSnapshot>) {
    snapshot = { ...snapshot, ...patch };
    listeners.forEach((listener) => listener());
}

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = () => snapshot;
const getServerSnapshot = () => SERVER_SNAPSHOT;

export function useWeatherStore(): WeatherSnapshot {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/* ───────────────────────── Aperçu et « pad » (?meteo=, ?heure=, ?pad) ───────────────────────── */

const PAD_KEY = 'wx:pad'; // l'aperçu choisi (JSON), ou « closed » : le visiteur a fermé le pad pour cette visite

/** Le stockage du navigateur peut être bloqué (cookies refusés) : on ne s'y fie jamais pour l'essentiel. */
const safeStorage = (area: () => Storage) => ({
    get: (key: string) => {
        try {
            return area().getItem(key);
        } catch {
            return null;
        }
    },
    set: (key: string, value: string) => {
        try {
            area().setItem(key, value);
        } catch {
            /* sans stockage, le choix vaut pour la page en cours seulement */
        }
    },
    remove: (key: string) => {
        try {
            area().removeItem(key);
        } catch {
            /* idem */
        }
    },
});
/** Mémoire de la visite (jusqu'à la fermeture de l'onglet) et mémoire de l'appareil (d'une visite à l'autre). */
export const visit = safeStorage(() => sessionStorage);
const device = safeStorage(() => localStorage);

function cleanPreview(raw: { meteo?: unknown; heure?: unknown }): Preview {
    return {
        meteo: typeof raw.meteo === 'string' && Object.hasOwn(PRESETS, raw.meteo) ? raw.meteo : null,
        heure: typeof raw.heure === 'string' && Object.hasOwn(HOURS, raw.heure) ? raw.heure : null,
    };
}

function persistPreview(preview: Preview | null) {
    visit.set(PAD_KEY, preview ? JSON.stringify(preview) : 'closed');
}

/** Un temps ou une heure sont-ils imposés ? (un « pad » ouvert sans rien d'imposé montre la météo et l'heure réelles) */
export const isScenario = (preview: Preview | null): boolean => !!preview && (preview.meteo !== null || preview.heure !== null);

/**
 * Le « pad » (la barre d'aperçu) s'ouvre :
 *  - avec `?meteo=pluie` et/ou `?heure=nuit` : on impose un temps et/ou une heure ;
 *  - avec `?pad` : on l'ouvre sans rien imposer (météo et heure réelles) ;
 *  - tout seul sur les aperçus Vercel et en développement (`padByDefault`, voir app/layout.tsx), jamais en production.
 * Il reste ouvert pendant la visite (sessionStorage), page après page, jusqu'à « Quitter l'aperçu »
 * (il reste alors fermé pour la visite ; `?pad` le rouvre). `?meteo=live` le ferme aussi.
 */
function readPreview(padByDefault: boolean): Preview | null {
    const params = new URLSearchParams(window.location.search);
    if (params.get('meteo') === 'live') {
        persistPreview(null);
        return null;
    }
    const fromUrl = cleanPreview({ meteo: params.get('meteo'), heure: params.get('heure') });
    if (isScenario(fromUrl) || params.has('pad')) {
        persistPreview(fromUrl);
        return fromUrl;
    }
    const saved = visit.get(PAD_KEY);
    if (saved && saved !== 'closed') {
        try {
            return cleanPreview(JSON.parse(saved));
        } catch {
            visit.remove(PAD_KEY);
        }
    }
    return padByDefault && saved !== 'closed' ? { meteo: null, heure: null } : null;
}

export function setPreview(preview: Preview | null) {
    persistPreview(preview);
    update({ preview });
}

/** Ce que l'aperçu impose : météo, hauteur du soleil, feuilles (null = on garde le réel). */
export interface Simulation {
    weather: Sky | null;
    elevation: number | null;
    leaves: boolean | null;
}

export function resolvePreview(preview: Preview | null, live: Weather | null): Simulation | null {
    if (!preview) return null;
    const preset = preview.meteo ? PRESETS[preview.meteo] : null;
    const hour = preview.heure ? HOURS[preview.heure] : null;
    return {
        weather: preset ? preset.weather : live,
        elevation: hour?.elevation ?? preset?.elevation ?? null,
        leaves: preset?.leaves ?? null,
    };
}

/* ───────────────────────── Effets suspendus par le visiteur ───────────────────────── */

const EFFECTS_KEY = 'wx:effects';

const readEffects = (): boolean => device.get(EFFECTS_KEY) !== 'off';

/** Suspend ou rétablit les effets météo de la page (mémorisé). En aperçu (?meteo=), ils restent visibles. */
export function setEffects(on: boolean) {
    if (on) device.remove(EFFECTS_KEY);
    else device.set(EFFECTS_KEY, 'off');
    update({ effects: on });
}

/* ───────────────────────── Météo réelle ───────────────────────── */

const CACHE_KEY = 'wx:last';
const REFRESH_EVERY_MS = 10 * 60_000;
const CACHE_MAX_AGE_MS = 45 * 60_000; // on réutilise la dernière météo connue d'une visite à l'autre
const STALE_AFTER_MS = 90 * 60_000; // au-delà, on ne la présente plus comme actuelle

/** La réponse du serveur est vérifiée champ par champ : une donnée douteuse vaut « pas de donnée ». */
function parseWeather(raw: unknown): Weather | null {
    if (!raw || typeof raw !== 'object') return null;
    const w = raw as Record<string, unknown>;
    const numbers = ['temperature', 'cloud', 'fog', 'rain', 'snow', 'wind', 'windDir', 'at'].map((key) => w[key]);
    if (!numbers.every((value) => typeof value === 'number' && Number.isFinite(value))) return null;
    if (!CONDITIONS.includes(w.condition as Condition)) return null;
    return w as unknown as Weather;
}

const remember = (weather: Weather) => device.set(CACHE_KEY, JSON.stringify(weather));

function recall(): Weather | null {
    try {
        const saved = device.get(CACHE_KEY);
        const weather = saved ? parseWeather(JSON.parse(saved)) : null;
        return weather && Date.now() - weather.at < CACHE_MAX_AGE_MS ? weather : null;
    } catch {
        return null;
    }
}

let lastAttempt = 0;

async function refresh() {
    lastAttempt = Date.now();
    try {
        const response = await fetch('/api/meteo', { signal: AbortSignal.timeout(8000) });
        const weather = parseWeather((await response.json())?.weather);
        if (weather) {
            remember(weather);
            update({ weather });
            return;
        }
    } catch {
        /* hors ligne ou service lent : on garde la dernière météo connue, un temps */
    }
    if (snapshot.weather && Date.now() - snapshot.weather.at > STALE_AFTER_MS) update({ weather: null });
}

let started = false;

/** À appeler une fois, côté navigateur (WeatherAtmosphere). */
export function startWeatherStore(padByDefault = false) {
    if (started || typeof window === 'undefined') return;
    started = true;

    update({ preview: readPreview(padByDefault), weather: recall(), now: Date.now(), effects: readEffects() });
    void refresh();

    setInterval(() => update({ now: Date.now() }), 60_000);
    setInterval(() => {
        if (!document.hidden) void refresh();
    }, REFRESH_EVERY_MS);
    // Onglet resté en arrière-plan : on se remet à jour dès son retour.
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && Date.now() - lastAttempt > REFRESH_EVERY_MS) void refresh();
    });
}
