'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { ADVENT } from '@/lib/advent-shared';

/**
 * Mémorise, dans le navigateur du visiteur, les portes qu'il a déjà ouvertes.
 *
 * - Aucune donnée personnelle, aucun serveur : un simple `localStorage`.
 * - Fonctionne même si le stockage est bloqué (navigation privée) : la liste
 *   reste alors en mémoire pour la durée de la visite.
 * - `useSyncExternalStore` : pas de décalage à l'hydratation (le serveur rend
 *   « rien d'ouvert », le client corrige aussitôt) et synchronisation entre
 *   onglets.
 */

const STORAGE_KEY = `station-advent-${ADVENT.year}-opened`;

const listeners = new Set<() => void>();
let memory = '';

function read(): string {
    try {
        return window.localStorage.getItem(STORAGE_KEY) ?? memory;
    } catch {
        return memory;
    }
}

function write(value: string) {
    memory = value;
    try {
        window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
        /* stockage indisponible : on garde la valeur en mémoire */
    }
    listeners.forEach((notify) => notify());
}

function subscribe(notify: () => void) {
    listeners.add(notify);
    const onStorage = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY || event.key === null) notify();
    };
    window.addEventListener('storage', onStorage);
    return () => {
        listeners.delete(notify);
        window.removeEventListener('storage', onStorage);
    };
}

const getServerSnapshot = () => '';

/** « 1,5,12 » → {1, 5, 12}. Ignore tout ce qui n'est pas un numéro de porte valide. */
function parse(raw: string): Set<number> {
    return new Set(
        raw
            .split(',')
            .filter((part) => part.trim() !== '')
            .map(Number)
            .filter((n) => Number.isInteger(n) && n >= ADVENT.firstDay && n <= ADVENT.lastDay),
    );
}

export function useOpenedDoors() {
    const raw = useSyncExternalStore(subscribe, read, getServerSnapshot);

    const opened = useMemo<ReadonlySet<number>>(() => parse(raw), [raw]);

    const markOpened = useCallback((day: number) => {
        const current = parse(read());
        if (current.has(day)) return;
        current.add(day);
        write([...current].sort((a, b) => a - b).join(','));
    }, []);

    const reset = useCallback(() => write(''), []);

    return { opened, markOpened, reset };
}
