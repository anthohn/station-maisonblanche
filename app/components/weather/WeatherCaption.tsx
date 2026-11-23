'use client';

import { useMemo } from 'react';
import { deriveAmbience } from './ambience';
import { useWeatherStore } from './weather-store';

/**
 * Légende de la photo : le temps qu'il fait à la station, en une ligne, sans décor.
 * Elle n'apparaît que si l'on connaît vraiment la météo (ou en mode aperçu, où elle le dit).
 */
export default function WeatherCaption() {
    const snapshot = useWeatherStore();
    const caption = useMemo(() => deriveAmbience(snapshot)?.caption ?? null, [snapshot]);

    return (
        <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-linear-to-t from-slate-950/60 to-transparent px-4 pb-3.5 pt-14 transition-opacity duration-1000 lg:px-5 lg:pb-4 ${caption ? 'opacity-100' : 'opacity-0'}`}
        >
            <p className="text-[11px] font-semibold uppercase tracking-wider text-white/70">
                {caption?.preview ? 'Aperçu' : 'À la station, en ce moment'}
            </p>
            <p className="mt-0.5 text-base font-semibold text-white lg:text-lg">{caption?.text}</p>
        </div>
    );
}
