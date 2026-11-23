'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import AutumnLeaves from '@/app/components/AutumnLeaves';
import { deriveAmbience } from './ambience';
import { applyMood, flashLightning } from './apply-mood';
import WeatherParticles from './WeatherParticles';
import WeatherPreviewBar from './WeatherPreviewBar';
import { startWeatherStore, useWeatherStore } from './weather-store';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function useReducedMotion(): boolean {
    return useSyncExternalStore(
        (notify) => {
            const query = window.matchMedia(REDUCED_MOTION);
            query.addEventListener('change', notify);
            return () => query.removeEventListener('change', notify);
        },
        () => window.matchMedia(REDUCED_MOTION).matches,
        () => true, // par prudence tant qu'on ne sait pas : ni particules ni feuilles
    );
}

/**
 * Chef d'orchestre de la météo en direct. Monté une fois dans le layout :
 *  - lance la lecture de la météo (weather-store) ;
 *  - transforme météo + position du soleil en ambiance (ambience, lib/mood) et la pose sur la page ;
 *  - affiche la pluie, la neige et, en automne, les feuilles (qui remplacent l'ancien affichage permanent) ;
 *  - déclenche les éclairs en cas d'orage ;
 *  - propose la barre d'aperçu quand on la demande (?meteo=, ?heure=).
 * Le calque de la photo d'accueil, lui, est dans HeroPhoto.tsx ; la légende dans WeatherCaption.tsx.
 */
export default function WeatherAtmosphere() {
    const snapshot = useWeatherStore();
    const reducedMotion = useReducedMotion();
    const ambience = useMemo(() => deriveAmbience(snapshot), [snapshot]);

    useEffect(() => {
        startWeatherStore();
    }, []);

    useEffect(() => {
        if (ambience) applyMood(ambience.mood);
    }, [ambience]);

    const storm = ambience?.mood.storm ?? false;
    useEffect(() => {
        if (!storm || reducedMotion) return;
        let timer: ReturnType<typeof setTimeout>;
        const next = (delay: number) => {
            timer = setTimeout(() => {
                if (!document.hidden) flashLightning();
                next(9000 + Math.random() * 14000);
            }, delay);
        };
        next(2500 + Math.random() * 3000);
        return () => clearTimeout(timer);
    }, [storm, reducedMotion]);

    if (!ambience) return null;
    const { mood, leaves } = ambience;

    return (
        <>
            {!reducedMotion && <WeatherParticles rain={mood.particles.rain} snow={mood.particles.snow} slant={mood.particles.slant} />}
            {!reducedMotion && leaves && (
                // La nuit, les feuilles s'éteignent avec le jour.
                <div style={{ opacity: 0.35 + 0.65 * mood.lum, transition: 'opacity 2.4s ease' }}>
                    <AutumnLeaves />
                </div>
            )}
            <WeatherPreviewBar />
        </>
    );
}
