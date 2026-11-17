/**
 * ─────────────────────────────────────────────────────────────
 *  CALENDRIER DE L'AVENT — logique serveur (dates, ouverture)
 * ─────────────────────────────────────────────────────────────
 *  Le contenu des 24 portes se trouve dans `lib/advent-doors.ts`.
 *  Ce fichier ne contient que la mécanique :
 *
 *  - quel jour sommes-nous (toujours à l'heure de Genève, jamais
 *    à l'heure du téléphone du visiteur) ;
 *  - quelles portes sont ouvertes ;
 *  - ce que l'on a le droit d'envoyer au navigateur.
 *
 *  Règle d'or : le contenu d'une porte future ne quitte JAMAIS le
 *  serveur, et le code-barres d'un bon n'est envoyé que le jour
 *  où il est valable.
 */

import 'server-only';
import { ADVENT_DOORS } from './advent-doors';
import {
    ADVENT,
    type AdventClock,
    type AdventView,
    type DoorTone,
    type DoorView,
    type LockedDoorView,
    type RevealContent,
    type UnlockedDoorView,
} from './advent-shared';

/* ───────────────────────── Fuseau horaire ───────────────────────── */

const zoneParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: ADVENT.timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
});

function partsAt(epoch: number) {
    const map: Record<string, number> = {};
    for (const p of zoneParts.formatToParts(new Date(epoch))) {
        if (p.type !== 'literal') map[p.type] = Number(p.value);
    }
    return map as { year: number; month: number; day: number; hour: number; minute: number; second: number };
}

/** Décalage (ms) entre l'heure de Genève et UTC à un instant donné. */
function zoneOffsetMs(epoch: number): number {
    const p = partsAt(epoch);
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    return asUtc - Math.floor(epoch / 1000) * 1000;
}

/** Instant (UTC, ms) de minuit à Genève pour une date du calendrier. */
export function zonedMidnight(year: number, month: number, day: number): number {
    const guess = Date.UTC(year, month - 1, day, 0, 0, 0);
    const first = guess - zoneOffsetMs(guess);
    return guess - zoneOffsetMs(first);
}

/** Instant où la porte `day` se déverrouille (minuit à Genève). */
export function unlockAt(day: number): number {
    return zonedMidnight(ADVENT.year, 12, day);
}

/** Maintenant. Isolé ici pour garder les composants purs. */
export function currentEpoch(): number {
    return Date.now();
}

/* ───────────────────────────── Libellés ───────────────────────────── */

const longDate = new Intl.DateTimeFormat('fr-CH', {
    timeZone: ADVENT.timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
});

const shortDateFmt = new Intl.DateTimeFormat('fr-CH', {
    timeZone: ADVENT.timeZone,
    day: 'numeric',
    month: 'short',
});

function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/** « 1er décembre » plutôt que « 1 décembre » (usage français). */
function ordinalDay(text: string) {
    return text.replace(/\b1 /, '1er ');
}

export function doorDateLabel(day: number): string {
    // Midi : à l'abri de tout effet de bord de fuseau.
    const noon = zonedMidnight(ADVENT.year, 12, day) + 12 * 3600_000;
    return capitalize(ordinalDay(longDate.format(new Date(noon))));
}

export function doorShortDate(day: number): string {
    const noon = zonedMidnight(ADVENT.year, 12, day) + 12 * 3600_000;
    return ordinalDay(shortDateFmt.format(new Date(noon)));
}

/**
 * Typographie française : espaces insécables avant « : ; ! ? » et dans « »,
 * entre CHF et le montant, avant « % ». Le contenu reste lisible dans le code.
 */
export function typo(text: string): string {
    return text
        .replace(/ ([:;!?»%])/g, ' $1')
        .replace(/« /g, '« ')
        .replace(/\bCHF (\d)/g, 'CHF $1')
        .replace(/(\d) (CHF|cl|kg|mm|bar|°C|min)\b/g, '$1 $2');
}

const NO_TYPO_KEYS = new Set(['barcode', 'barcodeType', 'kind', 'icon', 'src', 'href', 'tone', 'state']);

function applyTypo<T>(value: T, key?: string): T {
    if (typeof value === 'string') {
        return (key && NO_TYPO_KEYS.has(key) ? value : typo(value)) as T;
    }
    if (Array.isArray(value)) return value.map((v) => applyTypo(v)) as T;
    if (value && typeof value === 'object') {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value)) out[k] = applyTypo(v, k);
        return out as T;
    }
    return value;
}

/* ───────────────────────── Couleurs des portes ───────────────────────── */

const TONES: DoorTone[] = ['pine', 'crimson', 'midnight', 'ochre', 'plum'];

/**
 * Alternance de couleurs en « diagonales » : deux portes voisines (à gauche,
 * en dessous, en 3, 4 ou 6 colonnes) n'ont jamais la même teinte.
 * La porte 24 reçoit une teinte dorée à part.
 */
export function toneFor(day: number): DoorTone {
    if (day === ADVENT.lastDay) return 'gold';
    return TONES[(day * 2) % TONES.length];
}

/* ─────────────────────────── Calcul de l'état ─────────────────────────── */

export function computeClock(now: number): AdventClock {
    const startsAt = unlockAt(ADVENT.firstDay);
    const endsAt = zonedMidnight(ADVENT.year, 12, ADVENT.lastDay + 1);

    if (now < startsAt) {
        return {
            phase: 'before',
            todayDay: null,
            todayLabel: null,
            serverNow: now,
            nextUnlockAt: startsAt,
            nextDay: ADVENT.firstDay,
            startsAt,
        };
    }

    if (now >= endsAt) {
        return {
            phase: 'after',
            todayDay: null,
            todayLabel: null,
            serverNow: now,
            nextUnlockAt: null,
            nextDay: null,
            startsAt,
        };
    }

    let todayDay: number = ADVENT.firstDay;
    for (let d = ADVENT.firstDay; d <= ADVENT.lastDay; d++) {
        if (now >= unlockAt(d)) todayDay = d;
    }
    const isLast = todayDay === ADVENT.lastDay;

    return {
        phase: 'running',
        todayDay,
        todayLabel: doorDateLabel(todayDay),
        serverNow: now,
        nextUnlockAt: isLast ? endsAt : unlockAt(todayDay + 1),
        // Après la porte 24, le prochain « événement » est la fermeture, pas une porte.
        nextDay: isLast ? null : todayDay + 1,
        startsAt,
    };
}

/**
 * Construit ce que le navigateur a le droit de voir pour l'instant `now`.
 * Aucune porte future n'est incluse, aucun code-barres passé non plus.
 */
export function buildAdventView(now: number): AdventView {
    const clock = computeClock(now);

    const doors: DoorView[] = ADVENT_DOORS.map((door): DoorView => {
        const day = door.day;
        const base = {
            day,
            tone: toneFor(day),
            dateLabel: doorDateLabel(day),
            shortDate: doorShortDate(day),
        };

        const isUnlocked = now >= unlockAt(day);
        if (!isUnlocked) {
            return applyTypo({ ...base, state: 'locked', hint: door.hint } as LockedDoorView);
        }

        const isToday = clock.phase === 'running' && clock.todayDay === day;

        let content: RevealContent;
        if (door.kind === 'coupon') {
            const { barcode, barcodeType, ...rest } = door;
            content = {
                ...rest,
                barcode: isToday ? barcode : null,
                barcodeType: isToday ? barcodeType : undefined,
                expired: !isToday,
            };
        } else {
            content = door;
        }

        return applyTypo({ ...base, state: 'unlocked', isToday, content } as UnlockedDoorView);
    });

    return { clock, doors };
}

/* ───────────────────────────── Mode aperçu ───────────────────────────── */

/**
 * Le mode aperçu permet de simuler une date (`?jour=12`) pour montrer le
 * calendrier avant décembre. Il est volontairement désactivé en production :
 * sinon n'importe qui pourrait ouvrir toutes les portes à l'avance.
 *
 * Actif si :
 *  - développement local (`npm run dev`) ;
 *  - déploiement de prévisualisation Vercel (VERCEL_ENV = preview) ;
 *  - ou variable d'environnement explicite ADVENT_PREVIEW=true.
 */
export function isAdventPreviewAllowed(): boolean {
    return (
        process.env.NODE_ENV === 'development' ||
        process.env.VERCEL_ENV === 'preview' ||
        process.env.ADVENT_PREVIEW === 'true'
    );
}

export interface PreviewSelection {
    /** Instant simulé (ms) : midi à Genève le jour demandé. */
    epoch: number;
}

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

/**
 * Lit `?jour=12` (décembre, 0 = 30 novembre) ou `?date=2026-12-12`
 * et renvoie un instant simulé à midi, heure de Genève.
 */
export function parsePreview(params: RawParams): PreviewSelection | null {
    const jour = first(params.jour);
    const date = first(params.date);

    if (jour !== undefined && /^\d{1,2}$/.test(jour)) {
        const day = Number(jour);
        if (day > 31) return null;
        const midnight = day === 0 ? zonedMidnight(ADVENT.year, 11, 30) : zonedMidnight(ADVENT.year, 12, day);
        return { epoch: midnight + 12 * 3600_000 };
    }

    if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [y, m, d] = date.split('-').map(Number);
        const valid = y === ADVENT.year && m >= 1 && m <= 12 && d >= 1 && d <= 31;
        if (!valid) return null;
        return { epoch: zonedMidnight(y, m, d) + 12 * 3600_000 };
    }

    return null;
}
