'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';

/**
 * Diaporama de la photo d'accueil : un fondu enchaîné doux entre trois vues de la station.
 *
 * - La boîte (taille, coins, ombre) est définie par le parent : ici, on remplit simplement l'espace.
 * - Seule la 1re photo se charge au départ (c'est elle qui compte pour la vitesse d'affichage) ;
 *   les deux autres arrivent un instant après.
 * - Pause automatique : focus clavier, doigt posé, onglet masqué. Pas de pause au simple survol de la
 *   souris ni après un clic : le diaporama continue tout seul, que le curseur soit sur la photo ou non.
 * - Si l'utilisateur a demandé de réduire les animations : pas de défilement automatique ni de zoom
 *   (la 1re photo reste fixe ; les points permettent de changer).
 * - Balayage au doigt (gauche/droite) sur mobile.
 *
 * Pour changer les photos : modifier `SLIDES` ci-dessous (3 photos paysage conseillées, déposées dans /public/accueil).
 *
 * ⚠️ Vie privée : les photos de /public/accueil sont des COPIES de vos originaux, avec les plaques
 * d'immatriculation floutées (et redimensionnées à 2400 px). Avant d'ajouter une photo, vérifier qu'aucune
 * plaque ni visage n'est lisible, et la flouter si besoin.
 */

const SLIDES = [
    {
        src: '/accueil/shop.jpg',
        alt: 'Shop et épicerie de proximité à la Station-Service Maison-Blanche, Chancy, Genève',
    },
    {
        src: '/accueil/pompes.jpg',
        alt: 'Pompes à carburant Shell sous l’auvent en bois de la Station-Service Maison-Blanche, Chancy',
    },
    {
        src: '/accueil/devanture.jpg',
        alt: 'Devanture du shop avec son enseigne « Shop », à la Station-Service Maison-Blanche, Chancy',
    },
];

/** Durée d'affichage de chaque photo (ms), fondu compris. */
const INTERVAL = 6000;
/** Distance minimale (px) d'un balayage pour changer de photo. */
const SWIPE_DISTANCE = 40;

/* ───── Préférences du système, lues sans décalage d'hydratation ───── */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(notify: () => void) {
    const media = window.matchMedia(REDUCED_MOTION);
    media.addEventListener('change', notify);
    return () => media.removeEventListener('change', notify);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

function subscribeVisibility(notify: () => void) {
    document.addEventListener('visibilitychange', notify);
    return () => document.removeEventListener('visibilitychange', notify);
}
const getHidden = () => document.hidden;

const getFalse = () => false;

export default function HeroSlideshow() {
    const [index, setIndex] = useState(0);
    const [ready, setReady] = useState(false); // les photos 2 et 3 ne se chargent qu'après la première
    const [armed, setArmed] = useState(false); // déclenche le zoom lent de la photo affichée
    const [touching, setTouching] = useState(false);
    const [focused, setFocused] = useState(false);
    const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getFalse);
    const tabHidden = useSyncExternalStore(subscribeVisibility, getHidden, getFalse);
    const swipe = useRef<{ x: number; y: number } | null>(null);

    const count = SLIDES.length;
    const paused = touching || focused || tabHidden || reducedMotion;

    // Les photos 2 et 3 arrivent un peu après la première, pour ne pas ralentir l'affichage de la page.
    useEffect(() => {
        const id = window.setTimeout(() => setReady(true), 1800);
        return () => window.clearTimeout(id);
    }, []);

    // Le zoom de la 1re photo ne démarre qu'après le premier affichage (sinon elle apparaîtrait déjà zoomée).
    useEffect(() => {
        const id = requestAnimationFrame(() => requestAnimationFrame(() => setArmed(true)));
        return () => cancelAnimationFrame(id);
    }, []);

    // Défilement automatique : une photo toutes les INTERVAL ms, sauf en pause.
    useEffect(() => {
        if (!ready || paused) return;
        const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), INTERVAL);
        return () => window.clearTimeout(id);
    }, [index, ready, paused, count]);

    const goTo = (target: number) => setIndex(((target % count) + count) % count);

    return (
        <div
            className="absolute inset-0 touch-pan-y select-none"
            role="region"
            aria-roledescription="carrousel"
            aria-label="Photos de la station"
            // Pause seulement pour le focus CLAVIER (:focus-visible). Un clic de souris donne aussi le focus
            // à un bouton : ça ne doit surtout pas figer le diaporama.
            onFocus={(e) => setFocused(e.target.matches(':focus-visible'))}
            onBlur={() => setFocused(false)}
            onPointerDown={(e) => {
                swipe.current = { x: e.clientX, y: e.clientY };
                if (e.pointerType === 'touch') setTouching(true);
            }}
            onPointerUp={(e) => {
                const start = swipe.current;
                swipe.current = null;
                setTouching(false);
                if (!start) return;
                const dx = e.clientX - start.x;
                const dy = e.clientY - start.y;
                // Un vrai balayage horizontal (pas un simple défilement de la page vers le bas).
                if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
                    goTo(dx < 0 ? index + 1 : index - 1);
                }
            }}
            onPointerCancel={() => {
                swipe.current = null;
                setTouching(false);
            }}
        >
            {SLIDES.map((slide, i) => {
                if (i > 0 && !ready) return null;
                const active = i === index;
                return (
                    <div
                        key={slide.src}
                        aria-hidden={!active}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${active ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            src={slide.src}
                            alt={slide.alt}
                            fill
                            className={`object-cover hero-slide ${armed && active ? 'is-zooming' : ''}`}
                            priority={i === 0}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            draggable={false}
                        />
                    </div>
                );
            })}

            {/* Points : une pastille orange allongée pour la photo affichée, comme les accents orange du site */}
            {ready && (
                <div role="group" aria-label="Choisir une photo" className="absolute inset-x-0 bottom-2 z-10 flex justify-center">
                    {SLIDES.map((slide, i) => (
                        <button
                            key={slide.src}
                            type="button"
                            onClick={() => goTo(i)}
                            aria-label={`Afficher la photo ${i + 1} sur ${count}`}
                            aria-current={i === index}
                            className="group grid h-8 w-7 cursor-pointer place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-orange-400"
                        >
                            <span
                                className={`block h-2 rounded-full shadow-sm transition-all duration-300 ${
                                    i === index ? 'w-6 bg-orange-500' : 'w-2 bg-white/85 group-hover:bg-white'
                                }`}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
