'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bell, Gift, MapPin, Share2, Sparkles } from 'lucide-react';
import { ADVENT, type AdventView, type TodayDoorView } from '@/lib/advent-shared';
import AdventDoor from '@/app/components/advent/AdventDoor';
import AdventReveal from '@/app/components/advent/AdventReveal';
import PreviewBar from '@/app/components/advent/PreviewBar';
import Snowfall from '@/app/components/advent/Snowfall';
import StringLights from '@/app/components/advent/StringLights';
import { pad2, splitDuration, useCountdown } from '@/app/components/advent/useCountdown';
import { useOpenedDoors } from '@/app/components/advent/useOpenedDoors';

interface AdventCalendarProps {
    view: AdventView;
    preview: boolean;
}

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] as const },
});

/* ─────────────────────────── Compte à rebours ─────────────────────────── */

function CountdownTiles({ remaining }: { remaining: number | null }) {
    const parts = remaining === null ? null : splitDuration(remaining);
    const tiles = [
        { label: 'jours', value: parts?.days },
        { label: 'heures', value: parts?.hours },
        { label: 'minutes', value: parts?.minutes },
        { label: 'secondes', value: parts?.seconds },
    ];
    return (
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3" role="timer" aria-label="Temps avant l’ouverture de la porte 1">
            {tiles.map((tile) => (
                <div key={tile.label} className="rounded-2xl border border-white/12 bg-white/[0.07] px-1 py-3 text-center">
                    <p className="adv-serif text-3xl leading-none tabular-nums text-amber-200 sm:text-4xl">
                        {tile.value === undefined ? '··' : pad2(tile.value)}
                    </p>
                    <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">{tile.label}</p>
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────── Page ─────────────────────────── */

export default function AdventCalendar({ view, preview }: AdventCalendarProps) {
    const { clock, doors } = view;
    const router = useRouter();
    const reduceMotion = useReducedMotion();
    const { opened, markOpened, reset } = useOpenedDoors();

    const [activeDay, setActiveDay] = useState<number | null>(null);
    const [celebrate, setCelebrate] = useState(false);
    const [shakeDay, setShakeDay] = useState<number | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [armed, setArmed] = useState(false);
    const timers = useRef<number[]>([]);

    // Les transitions des portes ne s'activent qu'une fois la page affichée :
    // les portes déjà ouvertes lors d'une visite précédente apparaissent ouvertes, sans animation.
    useEffect(() => {
        const id = requestAnimationFrame(() => requestAnimationFrame(() => setArmed(true)));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        const pending = timers.current;
        return () => pending.forEach((id) => window.clearTimeout(id));
    }, []);

    const later = useCallback((fn: () => void, ms: number) => {
        timers.current.push(window.setTimeout(fn, ms));
    }, []);

    const showToast = useCallback(
        (message: string) => {
            setToast(message);
            later(() => setToast((current) => (current === message ? null : current)), 4600);
        },
        [later],
    );

    // Au passage de minuit, on redemande l'état au serveur : la nouvelle porte s'ouvre toute seule.
    const remaining = useCountdown(clock.serverNow, clock.nextUnlockAt);
    const expired = remaining !== null && remaining <= 0;
    useEffect(() => {
        if (!expired) return;
        router.refresh();
        const id = window.setInterval(() => router.refresh(), 4000);
        return () => window.clearInterval(id);
    }, [expired, router]);

    /* ───── Actions ───── */

    const selectDoor = (day: number) => {
        const door = doors[day - 1];

        if (door.state === 'locked') {
            setShakeDay(day);
            later(() => setShakeDay((current) => (current === day ? null : current)), 600);
            showToast(`La porte ${day} s’ouvre le ${door.dateLabel.toLowerCase()}. Indice : ${door.hint}`);
            return;
        }

        if (door.state === 'past') {
            // Une porte dont le jour est passé ne s'ouvre plus : son contenu n'a jamais quitté le serveur.
            setShakeDay(day);
            later(() => setShakeDay((current) => (current === day ? null : current)), 600);
            showToast(
                clock.phase === 'after'
                    ? 'Le calendrier est terminé : rendez-vous l’an prochain !'
                    : `La porte ${day} n’est plus disponible : elle était à ouvrir le ${door.dateLabel.toLowerCase()}. Revenez chaque jour pour la surprise du jour !`,
            );
            return;
        }

        const firstTime = !opened.has(day);
        if (firstTime) markOpened(day);
        setCelebrate(firstTime);

        if (firstTime && !reduceMotion) {
            // On laisse le temps à la porte de s'ouvrir avant d'afficher la surprise.
            later(() => setActiveDay(day), 620);
        } else {
            setActiveDay(day);
        }
    };

    const share = async () => {
        const url = `${window.location.origin}${ADVENT.path}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: `Calendrier de l’Avent ${ADVENT.year} · Station Maison-Blanche`,
                    text: 'Une porte à ouvrir chaque jour jusqu’à Noël, à la Station Maison-Blanche.',
                    url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                showToast('Lien copié dans le presse-papiers');
            }
        } catch {
            /* partage annulé par l'utilisateur */
        }
    };

    /* ───── Valeurs dérivées ───── */

    const activeDoor: TodayDoorView | null =
        activeDay !== null && doors[activeDay - 1].state === 'today' ? (doors[activeDay - 1] as TodayDoorView) : null;

    // Portes que le visiteur a ouvertes le jour même (les portes à venir ne comptent pas).
    const openedCount = doors.filter((d) => d.state !== 'locked' && opened.has(d.day)).length;

    const todayOpened = clock.todayDay !== null && opened.has(clock.todayDay);
    const duration = remaining === null ? null : splitDuration(remaining);

    return (
        <>
            {/* ═════════════ Section nuit : héros + calendrier ═════════════ */}
            <section className="adv-night relative isolate overflow-hidden" aria-labelledby="adv-title">
                <div aria-hidden="true" className="adv-bokeh pointer-events-none absolute inset-0 z-0">
                    <span className="-left-20 top-40 h-72 w-72 bg-amber-500/40" />
                    <span className="-right-24 top-[34rem] h-80 w-80 bg-indigo-500/35" style={{ animationDelay: '-6s' }} />
                    <span className="left-1/3 bottom-24 h-72 w-72 bg-emerald-500/25" style={{ animationDelay: '-10s' }} />
                </div>

                <Snowfall />
                <StringLights />

                <div className="relative z-10">
                    {/* ───── Héros ───── */}
                    <div className="mx-auto max-w-4xl px-4 pb-10 pt-24 text-center sm:px-6 sm:pt-28">
                        <motion.p
                            {...fadeUp(0.05)}
                            className="mb-4 flex items-center justify-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.22em] text-amber-300"
                        >
                            <Sparkles size={15} aria-hidden="true" />
                            Calendrier de l’Avent {ADVENT.year}
                            <Sparkles size={15} aria-hidden="true" />
                        </motion.p>

                        <motion.h1
                            id="adv-title"
                            {...fadeUp(0.12)}
                            className="adv-serif text-balance text-[2.6rem] font-medium leading-[1.05] tracking-tight text-white sm:text-6xl"
                        >
                            <span className="block">Chaque matin,</span>
                            <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                                une porte s’ouvre
                            </span>{' '}
                            à&nbsp;la&nbsp;station.
                        </motion.h1>

                        <motion.p
                            {...fadeUp(0.2)}
                            className="mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed text-slate-300 sm:text-lg"
                        >
                            Du 1<sup>er</sup> au 24 décembre, une surprise par jour : bons gourmands à scanner en caisse,
                            conseils d’hiver, devinettes et petites attentions de l’équipe.
                        </motion.p>

                        {/* ───── Carte d'état ───── */}
                        <motion.div
                            {...fadeUp(0.3)}
                            className="mx-auto mt-9 max-w-xl rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-5 text-left shadow-2xl shadow-black/30 backdrop-blur-md sm:p-6"
                        >
                            {clock.phase === 'before' && (
                                <>
                                    <p className="mb-4 text-center text-sm text-slate-300">
                                        Ouverture le{' '}
                                        <strong className="font-semibold text-white">{doors[0].dateLabel}</strong>, à minuit.
                                    </p>
                                    <CountdownTiles remaining={remaining} />
                                </>
                            )}

                            {clock.phase === 'running' && clock.todayDay !== null && (
                                <>
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-300 sm:text-[11.5px] sm:tracking-[0.18em]">
                                                Aujourd’hui · {clock.todayLabel}
                                            </p>
                                            <p className="adv-serif mt-1 text-3xl leading-none text-white">
                                                Porte n°{clock.todayDay}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => selectDoor(clock.todayDay as number)}
                                            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-b from-amber-300 to-amber-400 px-5 py-3 text-sm font-bold text-amber-950 shadow-lg shadow-amber-500/30 transition-transform hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                                        >
                                            <Gift size={17} aria-hidden="true" />
                                            {todayOpened ? 'Revoir' : 'Ouvrir'}
                                        </button>
                                    </div>

                                    <div className="mt-5 flex items-center gap-[3px]" aria-hidden="true">
                                        {doors.map((d) => (
                                            <span
                                                key={d.day}
                                                className={`h-1.5 flex-1 rounded-full ${
                                                    opened.has(d.day) && d.state !== 'locked'
                                                        ? 'bg-amber-300'
                                                        : d.state === 'today'
                                                          ? 'bg-amber-300/35 ring-1 ring-amber-300/70'
                                                          : 'bg-white/12'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[13px] text-slate-400">
                                        <span>
                                            {openedCount === 0
                                                ? 'Aucune porte ouverte pour l’instant'
                                                : `${openedCount} porte${openedCount > 1 ? 's' : ''} ouverte${openedCount > 1 ? 's' : ''} sur ${ADVENT.lastDay}`}
                                        </span>
                                        {duration && clock.nextDay !== null && (
                                            <span role="timer" className="tabular-nums">
                                                Porte n°{clock.nextDay} dans{' '}
                                                <strong className="font-semibold text-slate-200">
                                                    {pad2(duration.days * 24 + duration.hours)}:{pad2(duration.minutes)}:{pad2(duration.seconds)}
                                                </strong>
                                            </span>
                                        )}
                                        {clock.nextDay === null && <span>C’est la dernière porte !</span>}
                                    </p>
                                </>
                            )}

                            {clock.phase === 'after' && (
                                <div className="text-center">
                                    <p className="adv-serif text-3xl text-white">Joyeux Noël !</p>
                                    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
                                        Le calendrier s’est refermé. Merci d’avoir ouvert les portes avec nous, et à l’année
                                        prochaine pour de nouvelles surprises !
                                    </p>
                                    <p className="mt-3 text-[13px] text-slate-400">
                                        {openedCount} porte{openedCount > 1 ? 's' : ''} ouverte{openedCount > 1 ? 's' : ''} sur {ADVENT.lastDay}
                                    </p>
                                </div>
                            )}
                        </motion.div>

                        {/* ───── Actions secondaires ───── */}
                        <motion.div {...fadeUp(0.4)} className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <a
                                href={ADVENT.reminderPath}
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                            >
                                <Bell size={16} className="text-amber-300" aria-hidden="true" />
                                Rappel chaque matin
                            </a>
                            <button
                                type="button"
                                onClick={share}
                                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 py-2.5 text-[13.5px] font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
                            >
                                <Share2 size={16} className="text-amber-300" aria-hidden="true" />
                                Partager
                            </button>
                        </motion.div>
                    </div>

                    {/* ───── Les 24 portes ───── */}
                    <div className="mx-auto max-w-5xl px-3 pb-24 sm:px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                            className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[2px] sm:p-6"
                        >
                            <div
                                className="adv-grid grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6"
                                data-armed={armed}
                                role="group"
                                aria-label="Les 24 portes du calendrier"
                            >
                                {doors.map((door) => (
                                    <AdventDoor
                                        key={door.day}
                                        view={door}
                                        opened={door.state !== 'locked' && opened.has(door.day)}
                                        shake={shakeDay === door.day}
                                        onSelect={selectDoor}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ═════════════ Comment ça marche ═════════════ */}
            <section className="bg-slate-50 pb-28 pt-16 sm:pt-20" aria-labelledby="adv-how">
                <div className="container mx-auto max-w-5xl px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-12"
                    >
                        <h2 id="adv-how" className="adv-serif mb-10 text-center text-3xl text-slate-900 md:text-4xl">
                            Comment ça marche ?
                        </h2>

                        <ol className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {[
                                {
                                    title: 'Ouvrez la porte du jour',
                                    text: 'Chaque jour de décembre, à minuit, une nouvelle porte se déverrouille. Touchez-la pour découvrir la surprise : elle n’est disponible que ce jour-là.',
                                },
                                {
                                    title: 'Affichez votre bon',
                                    text: 'Quand une porte cache un bon, son code-barres s’affiche sur votre smartphone. Il n’est valable que le jour même.',
                                },
                                {
                                    title: 'Scannez en caisse',
                                    text: 'Présentez simplement l’écran au shop lors de votre passage en caisse. C’est tout.',
                                },
                            ].map((step, i) => (
                                <li key={step.title} className="flex flex-col items-center p-2 text-center">
                                    <span className="adv-serif mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-orange-100 text-2xl text-orange-500 shadow-sm">
                                        {i + 1}
                                    </span>
                                    <h3 className="mb-2 text-lg font-semibold text-slate-900">{step.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-500">{step.text}</p>
                                </li>
                            ))}
                        </ol>

                        <details className="group mt-10 border-t border-slate-100 pt-6">
                            <summary className="cursor-pointer list-none text-sm font-semibold text-slate-700 transition-colors hover:text-orange-500">
                                Conditions des bons{' '}
                                <span className="font-normal text-slate-400 group-open:hidden">(afficher)</span>
                            </summary>
                            <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-slate-500">
                                <li>Chaque bon n’est valable que le jour indiqué, dans la limite des stocks disponibles.</li>
                                <li>Un bon par jour et par passage en caisse ; les offres ne sont pas cumulables entre elles.</li>
                                <li>Sauf mention contraire, les offres s’entendent hors carburant, au shop, aux heures d’ouverture.</li>
                                <li>Le code-barres est à présenter sur smartphone : pensez à augmenter la luminosité de l’écran.</li>
                            </ul>
                        </details>

                        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
                            <p className="text-sm text-slate-600">
                                Les offres sont valables au shop de la Station Maison-Blanche à Chancy.
                            </p>
                            <a
                                href="https://maps.app.goo.gl/WKU8p8fe4wCEhn2t6"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-500 transition-colors hover:text-orange-600"
                            >
                                <MapPin size={16} aria-hidden="true" />
                                Voir l’itinéraire
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═════════════ Fenêtre, message et aperçu ═════════════ */}
            <AdventReveal door={activeDoor} celebrate={celebrate} onClose={() => setActiveDay(null)} />

            <div className={`pointer-events-none fixed inset-x-0 z-40 flex justify-center px-4 ${preview ? 'bottom-20' : 'bottom-6'}`}>
                <AnimatePresence>
                    {toast && (
                        <motion.p
                            key={toast}
                            role="status"
                            initial={{ opacity: 0, y: 14, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.28 }}
                            className="pointer-events-auto max-w-sm rounded-2xl border border-white/15 bg-slate-900/95 px-4 py-3 text-center text-[13.5px] leading-snug text-white shadow-2xl shadow-black/40 backdrop-blur-md"
                        >
                            {toast}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            {preview && <PreviewBar clock={clock} onReset={reset} />}
        </>
    );
}
