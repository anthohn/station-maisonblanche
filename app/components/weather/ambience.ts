import { computeMood, type Mood } from '@/lib/mood';
import { sunElevation } from '@/lib/sun';
import { describe, formatTemperature, HOURS, PRESETS, seasonOf, shopIsOpen, STATION, type Weather } from '@/lib/weather';
import { isScenario, resolvePreview, type WeatherSnapshot } from './weather-store';

export interface Ambience {
    mood: Mood;
    /** Météo prise en compte (réelle ou d'aperçu) ; null si on ne la connaît pas. */
    weather: Omit<Weather, 'at'> | null;
    /** Faut-il des feuilles d'automne ? */
    leaves: boolean;
    /** Légende de la photo : null s'il n'y a rien d'honnête à afficher. */
    caption: { text: string; preview: boolean } | null;
}

/**
 * Tout ce que la page affiche découle de ce calcul : le magasin de données (météo réelle, aperçu, heure)
 * entre, une ambiance sort. Même fonction pour la photo, les particules, les feuilles et la légende.
 */
export function deriveAmbience(snapshot: WeatherSnapshot): Ambience | null {
    const { now, preview, weather: live } = snapshot;
    if (!now) return null; // serveur et premier rendu : rien à afficher

    const simulation = resolvePreview(preview, live);
    const weather = simulation ? simulation.weather : live;
    const elevation = simulation?.elevation ?? sunElevation(now, STATION.lat, STATION.lon);
    const open = simulation?.open ?? shopIsOpen(new Date(now));
    const mood = computeMood(weather, elevation, open);

    // Les feuilles tombent en automne, mais pas sous la neige, la forte pluie ou dans le brouillard dense.
    const autumn = simulation?.leaves ?? seasonOf(new Date(now)) === 'autumn';
    const leaves = autumn && !mood.particles.snow && (weather?.rain ?? 0) < 0.55 && (weather?.fog ?? 0) < 0.8;

    let caption: Ambience['caption'] = null;
    if (preview && isScenario(preview)) {
        const parts = [preview.meteo ? PRESETS[preview.meteo].label : null, preview.heure ? HOURS[preview.heure].label : null];
        caption = { text: parts.filter(Boolean).join(' · '), preview: true };
    } else if (live) {
        caption = { text: `${formatTemperature(live.temperature)} · ${describe(live, mood.daylight)}`, preview: false };
    }

    return { mood, weather, leaves, caption };
}
