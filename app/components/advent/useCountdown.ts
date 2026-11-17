'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

/** Une « horloge » qui bat chaque seconde, sans état local ni hydratation fragile. */
function subscribe(notify: () => void) {
    const id = window.setInterval(notify, 1000);
    return () => window.clearInterval(id);
}
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

/**
 * Temps restant (ms) avant `target`, en se fiant à l'horloge du SERVEUR.
 *
 * L'heure du téléphone du visiteur peut être fausse : on mesure son écart avec
 * l'heure du serveur au chargement et on le corrige. Renvoie `null` tant que la
 * page n'est pas prête (le texte du compte à rebours n'est donc jamais rendu
 * côté serveur, ce qui évite tout décalage d'hydratation).
 */
export function useCountdown(serverNow: number, target: number | null): number | null {
    const seconds = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
    const [offset, setOffset] = useState<number | null>(null);

    useEffect(() => {
        const id = window.setTimeout(() => setOffset(serverNow - Date.now()), 0);
        return () => window.clearTimeout(id);
    }, [serverNow]);

    if (seconds === null || offset === null || target === null) return null;
    return Math.max(0, target - (seconds * 1000 + offset));
}

export function splitDuration(ms: number) {
    const total = Math.floor(ms / 1000);
    return {
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60,
    };
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
