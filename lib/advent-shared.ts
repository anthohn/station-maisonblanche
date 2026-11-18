/**
 * ─────────────────────────────────────────────────────────────
 *  CALENDRIER DE L'AVENT — configuration et types PARTAGÉS
 * ─────────────────────────────────────────────────────────────
 *  Ce fichier est volontairement « sans danger » : il ne contient ni
 *  le contenu des portes, ni les codes-barres, ni la logique de dates.
 *  Les composants du navigateur peuvent l'importer librement.
 *
 *  Tout ce qui touche au contenu secret vit dans `lib/advent.ts` et
 *  `lib/advent-doors.ts`, protégés par `server-only` : une importation
 *  par erreur depuis le navigateur fait échouer le build.
 */

/* ─────────────────────────── Configuration ─────────────────────────── */

export const ADVENT = {
    /** Année du calendrier. À changer chaque année avec le contenu des portes. */
    year: 2026,
    firstDay: 1,
    lastDay: 24,
    timeZone: 'Europe/Zurich',
    path: '/calendrier-de-l-avent',
    reminderPath: '/api/avent/rappel.ics',
    /**
     * ⚠️ true tant que `advent-doors.ts` contient du contenu d'EXEMPLE.
     * Marque chaque code-barres affiché comme « Code d'exemple · non valable
     * en caisse » : filet de sécurité contre un faux code pris pour un vrai.
     * Passer à false uniquement quand les vrais bons et les vrais
     * codes-barres de la caisse ont été saisis.
     */
    sampleContent: true,
} as const;

/* ───────────────────────────── Types ───────────────────────────── */

export type DoorIcon =
    | 'coffee' | 'croissant' | 'cookie' | 'candy' | 'gift' | 'flower' | 'wine' | 'soup'
    | 'droplets' | 'gauge' | 'battery' | 'moon' | 'snowflake' | 'fuel'
    | 'puzzle' | 'heart' | 'compass' | 'checklist' | 'partyPopper' | 'sandwich';

export type DoorTone = 'pine' | 'crimson' | 'midnight' | 'ochre' | 'plum' | 'gold';

export interface DoorCta {
    label: string;
    href: string;
    external?: boolean;
}

interface DoorBase {
    day: number;
    /** Titre révélé à l'ouverture. */
    title: string;
    /** Petit indice mystérieux affiché tant que la porte est verrouillée. */
    hint: string;
    icon: DoorIcon;
}

export interface CouponDoor extends DoorBase {
    kind: 'coupon';
    /** Valeur mise en avant : « Offert », « −20 % », « 2.90 CHF »… */
    value: string;
    summary: string;
    /** Code caisse (8 chiffres = Code 128, ou EAN-13). */
    barcode: string;
    barcodeType?: 'code128' | 'ean13';
    conditions: string;
    image?: { src: string; alt: string };
}

export interface TipDoor extends DoorBase {
    kind: 'tip';
    body: string[];
    rememberTitle?: string;
    remember?: string[];
    cta?: DoorCta;
}

export interface RiddleDoor extends DoorBase {
    kind: 'riddle';
    question: string;
    answer: string;
    aside?: string;
}

export interface RecipeDoor extends DoorBase {
    kind: 'recipe';
    intro: string;
    ingredients: string[];
    steps: string[];
    note?: string;
}

export interface ChecklistDoor extends DoorBase {
    kind: 'checklist';
    intro: string;
    items: string[];
    outro: string;
}

export interface MessageDoor extends DoorBase {
    kind: 'message';
    body: string[];
    signature?: string;
}

export interface FactDoor extends DoorBase {
    kind: 'fact';
    stat: string;
    statLabel: string;
    body: string[];
}

export type Door =
    | CouponDoor
    | TipDoor
    | RiddleDoor
    | RecipeDoor
    | ChecklistDoor
    | MessageDoor
    | FactDoor;

interface DoorViewBase {
    day: number;
    tone: DoorTone;
    /** « Samedi 12 décembre » */
    dateLabel: string;
    /** « 12 déc. » */
    shortDate: string;
}

export interface LockedDoorView extends DoorViewBase {
    state: 'locked';
    hint: string;
}

/** La porte du jour : la seule dont le contenu est envoyé au navigateur. */
export interface TodayDoorView extends DoorViewBase {
    state: 'today';
    content: Door;
}

/**
 * Une porte dont le jour est passé : elle ne s'ouvre plus. Son contenu
 * (offre, conseil, devinette…) n'est pas envoyé au navigateur.
 */
export interface PastDoorView extends DoorViewBase {
    state: 'past';
}

export type DoorView = LockedDoorView | TodayDoorView | PastDoorView;

export type AdventPhase = 'before' | 'running' | 'after';

export interface AdventClock {
    phase: AdventPhase;
    /** Numéro de la porte du jour (1–24), ou null avant/après le calendrier. */
    todayDay: number | null;
    todayLabel: string | null;
    /** Instant de référence du serveur (ms). Sert à recaler l'horloge du client. */
    serverNow: number;
    /** Prochain déverrouillage (ms), ou null quand tout est ouvert. */
    nextUnlockAt: number | null;
    /** Numéro de la prochaine porte à déverrouiller. */
    nextDay: number | null;
    /** Date d'ouverture de la porte 1, pour le compte à rebours initial. */
    startsAt: number;
}

export interface AdventView {
    clock: AdventClock;
    doors: DoorView[];
}
