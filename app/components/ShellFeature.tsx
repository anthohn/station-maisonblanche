'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ShellLogo from '@/app/components/ShellLogo';

/**
 * « Carburant Shell » : la vitrine des carburants, juste sous le haut de l'accueil.
 * Même vocabulaire que le reste du site : grande carte blanche arrondie, photo réelle de la
 * station, titre avec un mot surligné (comme « service » en haut de page), texte sobre.
 *
 * ⚠️ Texte sur la qualité : on ne dit pas « meilleure qualité » (affirmation comparative).
 * La phrase sur le nettoyage du moteur est attribuée à Shell (VPOWER_NOTE) : à faire
 * valider par Shell, ou à retirer (avec l'astérisque de « Shell V-Power »).
 */

const FUELS = [
    { name: 'Sans-plomb 95', tag: 'L’essence du quotidien' },
    { name: 'Shell V-Power*', tag: 'La gamme premium de Shell' },
    { name: 'Diesel', tag: 'Pour les longs trajets' },
];

const VPOWER_NOTE = '* Selon Shell, V-Power nettoie activement le moteur à chaque plein.';

export default function ShellFeature() {
    return (
        <section id="shell" className="container mx-auto max-w-7xl scroll-mt-28 px-6 pt-16 md:pt-20" aria-labelledby="shell-title">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className="grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm lg:grid-cols-2"
            >
                {/* Photo réelle de la station, avec le logo en pastille */}
                <div className="relative h-72 sm:h-96 lg:h-auto lg:min-h-[540px]">
                    <Image
                        src="/pompes-shell.jpg"
                        alt="Pompes Shell de la Station-Service Maison-Blanche à Chancy : enseigne Sans Plomb 95, V-Power et Diesel"
                        fill
                        className="object-cover object-[28%_50%]"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute bottom-5 left-5 grid h-24 w-24 place-items-center rounded-3xl bg-white shadow-xl shadow-black/20 sm:bottom-8 sm:left-8 sm:h-28 sm:w-28">
                        <ShellLogo className="h-14 w-auto sm:h-16" sizes="64px" />
                    </div>
                </div>

                <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">Carburant Shell</p>

                    <h2
                        id="shell-title"
                        className="mt-3 text-balance text-4xl font-medium leading-[1.08] tracking-tight text-[--color-brand-dark] md:text-5xl"
                    >
                        Le plein{' '}
                        <span className="whitespace-nowrap">
                            <span className="relative inline-block">
                                <span className="relative z-10">Shell</span>
                                <span aria-hidden="true" className="absolute bottom-1 left-0 h-3 w-full rounded-sm bg-[#FBCE07]/70" />
                            </span>
                            ,
                        </span>{' '}
                        à toute heure.
                    </h2>

                    <p className="mt-5 text-lg leading-relaxed text-slate-500">
                        Les carburants Shell sont disponibles 24h/24 et 7j/7 grâce à nos terminaux de paiement automatiques,
                        même quand le shop est fermé.
                    </p>

                    <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
                        {FUELS.map((fuel) => (
                            <li key={fuel.name} className="flex items-baseline justify-between gap-4 py-4">
                                <span className="font-medium text-[--color-brand-dark]">{fuel.name}</span>
                                <span className="text-right text-sm text-slate-500">{fuel.tag}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-3 text-xs leading-relaxed text-slate-400">{VPOWER_NOTE}</p>

                    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                        <Link href="/services" className="btn-primary max-sm:w-full max-sm:justify-center">
                            Voir nos carburants
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[--color-brand-dark] transition-colors hover:text-orange-500 max-sm:w-full max-sm:justify-center"
                        >
                            Nous trouver <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
