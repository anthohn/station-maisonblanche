'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Gift } from 'lucide-react';
import StringLights from '@/app/components/advent/StringLights';
import { fraunces } from '@/app/components/advent/font';
import '@/app/calendrier-de-l-avent/advent.css';

/**
 * Carte d'annonce du calendrier de l'Avent pour la page d'accueil.
 * Purement décorative côté portes : le vrai contenu reste derrière /calendrier-de-l-avent.
 */

// Mêmes teintes que sur la page du calendrier pour les portes 1 à 6.
const TEASER_DOORS = [
    { day: 1, tone: 'midnight', open: true },
    { day: 2, tone: 'plum' },
    { day: 3, tone: 'crimson' },
    { day: 4, tone: 'ochre' },
    { day: 5, tone: 'pine' },
    { day: 6, tone: 'midnight' },
] as const;

export default function AdventTeaser() {
    return (
        <section className="container mx-auto max-w-7xl px-6 pt-16" aria-labelledby="advent-teaser-title">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`${fraunces.variable} adv-night group relative isolate overflow-hidden rounded-[2rem] shadow-xl shadow-slate-900/15`}
            >
                <div aria-hidden="true" className="adv-bokeh pointer-events-none absolute inset-0">
                    <span className="-left-16 top-10 h-64 w-64 bg-amber-500/35" />
                    <span className="-right-10 bottom-0 h-72 w-72 bg-indigo-500/30" style={{ animationDelay: '-7s' }} />
                </div>
                <StringLights />

                <div className="relative z-10 grid items-center gap-10 px-7 pb-10 pt-20 md:grid-cols-[1.15fr_1fr] md:gap-14 md:px-14 md:pb-14 md:pt-24">
                    <div>
                        <p className="mb-3 text-[12.5px] font-semibold uppercase tracking-[0.2em] text-amber-300">
                            Du 1<sup>er</sup> au 24 décembre
                        </p>
                        <h2
                            id="advent-teaser-title"
                            className="adv-serif text-balance text-4xl font-medium leading-[1.08] tracking-tight text-white md:text-5xl"
                        >
                            Chaque matin,{' '}
                            <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-orange-400 bg-clip-text text-transparent">
                                une porte s’ouvre.
                            </span>
                        </h2>
                        <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300 md:text-lg">
                            Notre calendrier de l’Avent vous réserve une surprise par jour jusqu’à Noël : bons gourmands à
                            scanner en caisse, conseils d’hiver, devinettes…
                        </p>
                        <Link
                            href="/calendrier-de-l-avent"
                            className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-gradient-to-b from-amber-300 to-amber-400 px-6 py-3.5 text-sm font-bold text-amber-950 shadow-lg shadow-amber-500/25 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200"
                        >
                            <Gift size={18} aria-hidden="true" />
                            Ouvrir le calendrier
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </Link>
                    </div>

                    {/* Aperçu décoratif des premières portes */}
                    <div aria-hidden="true" className="mx-auto grid w-full max-w-xs grid-cols-3 gap-3 md:max-w-sm md:gap-4">
                        {TEASER_DOORS.map((door) => (
                            <div
                                key={door.day}
                                data-tone={door.tone}
                                className="relative aspect-[4/5] overflow-hidden rounded-xl shadow-lg shadow-black/40 transition-transform duration-500 group-hover:-translate-y-1"
                                style={{
                                    background:
                                        'open' in door
                                            ? 'radial-gradient(90% 80% at 40% 55%, #fff2b8 0%, #fbbf24 38%, #c2620a 100%)'
                                            : 'radial-gradient(120% 90% at 20% 0%, rgba(255,255,255,0.28) 0%, transparent 55%), linear-gradient(158deg, var(--door-a), var(--door-b))',
                                    transitionDelay: `${door.day * 40}ms`,
                                }}
                            >
                                {'open' in door ? (
                                    <span className="absolute inset-0 grid place-items-center text-amber-900">
                                        <span className="grid aspect-square w-[46%] place-items-center rounded-full bg-white/45">
                                            <Gift size="58%" strokeWidth={1.7} />
                                        </span>
                                    </span>
                                ) : (
                                    <>
                                        <span className="absolute inset-[7%] rounded-lg border border-white/22" />
                                        <span className="adv-serif absolute inset-0 grid place-items-center text-4xl font-semibold text-amber-50 [text-shadow:0_1px_0_rgba(0,0,0,0.35)] md:text-5xl">
                                            {door.day}
                                        </span>
                                        <span className="absolute right-[11%] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber-300 shadow" />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
