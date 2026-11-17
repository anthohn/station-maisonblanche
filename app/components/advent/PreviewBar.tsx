'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, RotateCcw, X, Clapperboard } from 'lucide-react';
import { ADVENT, type AdventClock } from '@/lib/advent-shared';

interface PreviewBarProps {
    clock: AdventClock;
    onReset: () => void;
}

/**
 * Barre « machine à remonter le temps », réservée à l'aperçu (voir
 * `isAdventPreviewAllowed` dans lib/advent.ts). Elle permet de montrer le
 * calendrier à n'importe quelle date sans attendre décembre.
 * Elle n'apparaît jamais sur le site public.
 */
export default function PreviewBar({ clock, onReset }: PreviewBarProps) {
    // 0 = avant l'ouverture · 1–24 = portes · 25 = après Noël
    const index = clock.phase === 'before' ? 0 : clock.phase === 'after' ? ADVENT.lastDay + 1 : (clock.todayDay ?? 1);
    const label =
        clock.phase === 'before'
            ? 'Avant l’ouverture'
            : clock.phase === 'after'
              ? 'Après Noël'
              : clock.todayLabel;

    const step = (delta: number) => `${ADVENT.path}?jour=${index + delta}`;
    const atStart = index <= 0;
    const atEnd = index >= ADVENT.lastDay + 1;

    const button =
        'grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300';

    return (
        <div
            role="region"
            aria-label="Mode aperçu du calendrier"
            className="fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md items-center gap-2 rounded-full border border-white/15 bg-slate-950/90 p-1.5 pl-4 text-white shadow-2xl shadow-black/50 backdrop-blur-md"
        >
            <Clapperboard size={16} className="shrink-0 text-amber-300" aria-hidden="true" />

            <div className="min-w-0 flex-1 leading-tight">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">Aperçu</p>
                <p className="truncate text-[13px] font-medium">{label}</p>
            </div>

            {atStart ? (
                <span className={`${button} opacity-30`} aria-hidden="true">
                    <ChevronLeft size={18} />
                </span>
            ) : (
                <Link href={step(-1)} scroll={false} className={button} aria-label="Jour précédent">
                    <ChevronLeft size={18} />
                </Link>
            )}

            {atEnd ? (
                <span className={`${button} opacity-30`} aria-hidden="true">
                    <ChevronRight size={18} />
                </span>
            ) : (
                <Link href={step(1)} scroll={false} className={button} aria-label="Jour suivant">
                    <ChevronRight size={18} />
                </Link>
            )}

            <button type="button" onClick={onReset} className={button} aria-label="Refermer toutes les portes" title="Refermer toutes les portes">
                <RotateCcw size={16} />
            </button>

            <Link href={ADVENT.path} className={button} aria-label="Quitter l’aperçu" title="Quitter l’aperçu (date réelle)">
                <X size={17} />
            </Link>
        </div>
    );
}
