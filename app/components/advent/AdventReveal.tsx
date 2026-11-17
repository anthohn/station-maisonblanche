'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { ADVENT, type UnlockedDoorView } from '@/lib/advent-shared';
import DoorIcon from './DoorIcon';
import RevealBody from './RevealBodies';

interface AdventRevealProps {
    door: UnlockedDoorView | null;
    /** true la toute première fois qu'on ouvre cette porte : confettis. */
    celebrate: boolean;
    onClose: () => void;
}

const CONFETTI_COLORS = ['#fde047', '#fb923c', '#f87171', '#34d399', '#60a5fa', '#f9a8d4', '#ffffff'];

/** Éclat de confettis : trajectoires déterministes (aucun hasard au rendu). */
const CONFETTI = Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * Math.PI * 2 + (i % 3) * 0.21;
    const distance = 90 + ((i * 37) % 90);
    return {
        x: Math.cos(angle) * distance * 1.25,
        y: Math.sin(angle) * distance * 0.8 - 30,
        r: ((i * 53) % 540) - 270,
        d: (i % 7) * 0.035,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        round: i % 4 === 0,
    };
});

/**
 * Fenêtre de révélation. Utilise l'élément natif <dialog> : le navigateur gère
 * gratuitement le piège à focus, la touche Échap, l'inertie du reste de la page
 * et les lecteurs d'écran.
 */
export default function AdventReveal({ door, celebrate, onClose }: AdventRevealProps) {
    const ref = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (door && !dialog.open) dialog.showModal();
        if (!door && dialog.open) dialog.close();
    }, [door]);

    const content = door?.content;
    const image = content?.kind === 'coupon' ? content.image : undefined;
    const isLastDay = door?.day === ADVENT.lastDay;

    return (
        <dialog
            ref={ref}
            className="adv-dialog"
            aria-labelledby="adv-reveal-title"
            onClose={onClose}
            onClick={(event) => {
                // Un clic sur le fond (hors de la feuille) ferme la fenêtre.
                if (event.target === ref.current) ref.current?.close();
            }}
        >
            {door && content && (
                <div className="adv-sheet" data-tone={door.tone}>
                    {/* ── Plaque colorée ── */}
                    <div className="adv-plate">
                        {image && (
                            <>
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 520px) 94vw, 31rem"
                                    className="object-cover"
                                />
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 opacity-55 mix-blend-multiply"
                                    style={{ background: 'linear-gradient(155deg, var(--door-a), var(--door-b))' }}
                                />
                                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/20" />
                            </>
                        )}

                        <span className="absolute left-5 top-5 z-10 rounded-full bg-black/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                            Porte n°{door.day}
                        </span>

                        <button
                            type="button"
                            onClick={() => ref.current?.close()}
                            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            aria-label="Fermer"
                        >
                            <X size={19} aria-hidden="true" />
                        </button>

                        <div className="absolute inset-x-0 top-[46%] z-10 flex -translate-y-1/2 justify-center">
                            <span className="adv-medallion text-white">
                                <DoorIcon name={content.icon} size={30} strokeWidth={1.6} />
                            </span>
                        </div>

                        {content.kind === 'coupon' && (
                            <span className="adv-serif absolute bottom-8 right-5 z-10 rounded-full bg-amber-300 px-4 py-1.5 text-xl font-semibold text-amber-950 shadow-lg shadow-black/20">
                                {content.value}
                            </span>
                        )}

                        {celebrate && (
                            <div className="adv-confetti" aria-hidden="true">
                                {CONFETTI.map((c, i) => (
                                    <i
                                        key={i}
                                        style={
                                            {
                                                '--x': `${c.x.toFixed(0)}px`,
                                                '--y': `${c.y.toFixed(0)}px`,
                                                '--r': `${c.r}deg`,
                                                '--d': `${c.d}s`,
                                                background: c.color,
                                                borderRadius: c.round ? '9999px' : undefined,
                                                width: c.round ? 8 : undefined,
                                                height: c.round ? 8 : undefined,
                                            } as React.CSSProperties
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        {/* Congère de neige : la plaque se fond dans le contenu */}
                        <svg
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-[-1px] z-[5] h-7 w-full fill-white"
                            viewBox="0 0 400 28"
                            preserveAspectRatio="none"
                        >
                            <path d="M0 28V14C32 4 58 2 92 9s64 15 106 7 76-14 112-9 62 9 90 8V28Z" />
                        </svg>
                    </div>

                    {/* ── Contenu ── */}
                    <div className="px-6 pb-7 pt-4 sm:px-8">
                        <p className="text-[11.5px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                            {door.dateLabel}
                        </p>
                        <h2 id="adv-reveal-title" className="adv-serif mb-4 mt-1.5 text-[1.75rem] leading-[1.15] text-slate-900">
                            {content.title}
                        </h2>

                        <RevealBody key={door.day} content={content} dateLabel={door.dateLabel} />

                        {door.isToday && (
                            <p className="mt-6 border-t border-slate-100 pt-4 text-center text-xs text-slate-400">
                                {isLastDay
                                    ? 'Joyeux Noël, et rendez-vous l’an prochain !'
                                    : `Rendez-vous demain pour la porte n°${door.day + 1}`}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </dialog>
    );
}
