'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ShellLogo from '@/app/components/ShellLogo';

/**
 * « Carburant Shell » : bandeau compact sous les trois piliers de l'accueil.
 * Même vocabulaire que le reste du site : carte blanche arrondie, vraie photo de la station,
 * titre avec un mot surligné (comme « service » en haut de page), texte sobre.
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
        <section id="shell" className="container mx-auto mt-24 max-w-7xl scroll-mt-28 px-6" aria-labelledby="shell-title">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className="grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm lg:grid-cols-[0.8fr_1.2fr]"
            >
                {/* Photo réelle de la station, avec le logo en pastille */}
                <div className="relative h-44 sm:h-52 lg:h-auto lg:min-h-[300px]">
                    <Image
                        src="/pompes-shell.jpg"
                        alt="Pompes Shell de la Station-Service Maison-Blanche à Chancy : enseigne Sans Plomb 95, V-Power et Diesel"
                        fill
                        className="object-cover object-[28%_45%]"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                    />
                    <div className="absolute bottom-4 left-4 grid h-16 w-16 place-items-center rounded-2xl bg-white shadow-lg shadow-black/20">
                        <ShellLogo className="h-9 w-auto" sizes="48px" />
                    </div>
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-8 lg:px-10 lg:py-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">Carburant Shell</p>

                    <h2
                        id="shell-title"
                        className="mt-2 text-balance text-3xl font-medium leading-[1.1] tracking-tight text-[--color-brand-dark] md:text-4xl"
                    >
                        Le plein{' '}
                        <span className="whitespace-nowrap">
                            <span className="relative inline-block">
                                <span className="relative z-10">Shell</span>
                                <span aria-hidden="true" className="absolute bottom-0.5 left-0 h-2.5 w-full rounded-sm bg-[#FBCE07]/70" />
                            </span>
                            ,
                        </span>{' '}
                        à toute heure.
                    </h2>

                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-500">
                        Disponibles 24h/24 et 7j/7 grâce à nos terminaux de paiement automatiques, même quand le shop est fermé.
                    </p>

                    <dl className="mt-5 grid grid-cols-1 divide-y divide-slate-200 border-y border-slate-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                        {FUELS.map((fuel) => (
                            <div
                                key={fuel.name}
                                className="flex items-baseline justify-between gap-3 py-2.5 sm:block sm:px-4 sm:py-3 sm:first:pl-0"
                            >
                                <dt className="text-sm font-medium text-[--color-brand-dark]">{fuel.name}</dt>
                                <dd className="text-[13px] leading-snug text-slate-500">{fuel.tag}</dd>
                            </div>
                        ))}
                    </dl>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-400">{VPOWER_NOTE}</p>

                    <Link
                        href="/services"
                        className="group mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-orange-600 transition-colors hover:text-orange-700"
                    >
                        Voir nos carburants
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
