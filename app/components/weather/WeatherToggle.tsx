'use client';

import { setEffects, useWeatherStore } from './weather-store';

/**
 * Lien du pied de page : le visiteur suspend (ou rétablit) les effets météo de la page, c'est-à-dire le voile,
 * la brume, la pluie, la neige et les feuilles. Son choix est mémorisé. La photo d'accueil garde son étalonnage,
 * qui est fixe. Voir WeatherAtmosphere.
 */
export default function WeatherToggle() {
    const { effects, now } = useWeatherStore();
    if (!now) return null; // avant que la page soit prête : rien (évite un décalage à l'hydratation)

    return (
        <button
            type="button"
            role="switch"
            aria-checked={effects}
            onClick={() => setEffects(!effects)}
            className="hover:text-slate-600 transition-colors"
        >
            Effets météo : {effects ? 'activés' : 'suspendus'}
        </button>
    );
}
