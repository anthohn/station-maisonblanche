'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import { deriveAmbience } from './ambience';
import { applyMood, flashLightning } from './apply-mood';
import WeatherParticles from './WeatherParticles';
import WeatherPreviewBar from './WeatherPreviewBar';
import { isScenario, startWeatherStore, useWeatherStore } from './weather-store';

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function useReducedMotion(): boolean {
    return useSyncExternalStore(
        (notify) => {
            const query = window.matchMedia(REDUCED_MOTION);
            query.addEventListener('change', notify);
            return () => query.removeEventListener('change', notify);
        },
        () => window.matchMedia(REDUCED_MOTION).matches,
        () => true, // par prudence tant qu'on ne sait pas : on adoucit
    );
}

/**
 * Sécurité de fluidité : si, alors que quelque chose bouge (pluie, neige, feuilles, brume), l'appareil reste sous
 * ~30 images/s pendant deux mesures de 2 secondes, la page retire d'elle-même le voile et la brume (attribut
 * `data-wx-lite` : voir weather.css) ; des particules plus légères restent. Mieux vaut un peu moins d'atmosphère
 * qu'un site qui rame. Le choix vaut pour la visite (sessionStorage). Jamais en aperçu.
 */
const LITE_KEY = 'wx:lite';

function useFluidityGuard(watch: boolean) {
    useEffect(() => {
        const root = document.documentElement;
        try {
            if (sessionStorage.getItem(LITE_KEY)) root.setAttribute('data-wx-lite', '');
        } catch {
            /* stockage bloqué : la mesure suffit */
        }
        if (!watch || root.hasAttribute('data-wx-lite')) return;

        let frameId = 0;
        let windowStart = 0;
        let frames = 0;
        let slowWindows = 0;
        const tick = (time: number) => {
            if (document.hidden) {
                windowStart = 0;
                frames = 0;
            } else {
                if (!windowStart) windowStart = time;
                frames++;
                if (time - windowStart >= 2000) {
                    slowWindows = (frames * 1000) / (time - windowStart) < 30 ? slowWindows + 1 : 0;
                    windowStart = 0;
                    frames = 0;
                    if (slowWindows >= 2) {
                        root.setAttribute('data-wx-lite', '');
                        try {
                            sessionStorage.setItem(LITE_KEY, '1');
                        } catch {
                            /* sans importance */
                        }
                        return;
                    }
                }
            }
            frameId = requestAnimationFrame(tick);
        };
        const start = setTimeout(() => {
            frameId = requestAnimationFrame(tick);
        }, 3500); // on laisse d'abord la page s'installer (hydratation, images)
        return () => {
            clearTimeout(start);
            cancelAnimationFrame(frameId);
        };
    }, [watch]);
}

/**
 * Chef d'orchestre de la météo en direct. Monté une fois dans le layout :
 *  - lance la lecture de la météo (weather-store) ;
 *  - transforme météo + position du soleil en ambiance (ambience, lib/mood) et la pose sur la page ;
 *  - dresse l'atmosphère de la page entière : un voile de lumière et une brume par-dessus le contenu
 *    (ils ne gênent ni les clics ni la lecture), puis pluie, neige et feuilles d'automne ;
 *  - déclenche les éclairs en cas d'orage ;
 *  - propose le « pad » (la barre d'aperçu) : avec ?meteo=, ?heure= ou ?pad, et tout seul sur les aperçus Vercel
 *    (`padByDefault`, jamais en production).
 * La photo d'accueil n'est jamais modifiée par la météo ; la légende qui s'y pose est dans WeatherCaption.tsx.
 *
 * Respect du visiteur :
 *  - s'il a demandé moins d'animations (réglage du système), les effets sont adoucis (moins de particules, plus
 *    lentes, brume presque immobile, pas d'éclairs) plutôt que coupés ;
 *  - il peut tout suspendre avec le lien « Effets météo » du pied de page (WeatherToggle) ;
 *  - quand un temps ou une heure sont imposés (?meteo=, ?heure=), on montre tout : c'est une démonstration voulue.
 */
export default function WeatherAtmosphere({ padByDefault = false }: { padByDefault?: boolean }) {
    const snapshot = useWeatherStore();
    const reducedMotion = useReducedMotion();
    const ambience = useMemo(() => deriveAmbience(snapshot), [snapshot]);

    // Démonstration : un temps ou une heure imposés. Un pad ouvert sans rien d'imposé montre la visite telle quelle.
    const demo = isScenario(snapshot.preview);
    const paused = !snapshot.effects && !demo;
    const calm = reducedMotion && !demo;

    useEffect(() => {
        startWeatherStore(padByDefault);
    }, [padByDefault]);

    useEffect(() => {
        document.documentElement.toggleAttribute('data-wx-paused', paused);
    }, [paused]);

    useEffect(() => {
        if (ambience) applyMood(ambience.mood, calm);
    }, [ambience, calm]);

    const moving = !!ambience && (ambience.mood.particles.rain > 0 || ambience.mood.particles.snow > 0 || ambience.leaves || ambience.mood.needs.pagefog);
    useFluidityGuard(!paused && !demo && moving);

    const storm = ambience?.mood.storm ?? false;
    useEffect(() => {
        if (!storm || calm || paused) return;
        let timer: ReturnType<typeof setTimeout>;
        const next = (delay: number) => {
            timer = setTimeout(() => {
                if (!document.hidden) flashLightning();
                next(9000 + Math.random() * 14000);
            }, delay);
        };
        next(2500 + Math.random() * 3000);
        return () => clearTimeout(timer);
    }, [storm, calm, paused]);

    if (!ambience) return null;
    const { mood, leaves } = ambience;

    return (
        <>
            {!paused && (
                <div aria-hidden="true" className="wx-page">
                    <div className="wx-page-veil" />
                    <div className="wx-page-fogwrap">
                        <div className="wx-page-fog wx-drift" data-wx-layer="page-fog" />
                    </div>
                </div>
            )}
            {!paused && (
                <WeatherParticles
                    rain={mood.particles.rain}
                    snow={mood.particles.snow}
                    leaves={leaves ? 1 : 0}
                    slant={mood.particles.slant}
                    lum={mood.lum}
                    calm={calm}
                />
            )}
            <WeatherPreviewBar />
        </>
    );
}
