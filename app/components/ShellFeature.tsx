'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ShellLogo from '@/app/components/ShellLogo';

/**
 * « Carburant Shell » : une carte large, sous les trois piliers de l'accueil.
 * Elle reprend exactement le modèle de ces trois cartes : photo réelle de la station, voile
 * sombre, pastille en haut à gauche (ici le logo Shell), titre, une phrase et un lien.
 *
 * Volontairement sobre : pas de phrase sur la « qualité » des carburants (affirmation
 * comparative, à n'écrire que si Shell la fournit et la valide).
 */
export default function ShellFeature() {
    return (
        <section id="shell" className="container mx-auto mt-24 max-w-7xl scroll-mt-28 px-6" aria-labelledby="shell-title">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className="group relative h-[380px] overflow-hidden rounded-[2rem] text-white shadow-sm"
            >
                <Image
                    src="/pompes-bande.jpg"
                    alt="Pompes Shell de la Station-Service Maison-Blanche à Chancy : enseigne Sans Plomb 95, V-Power et Diesel"
                    fill
                    className="object-cover object-[34%_50%] transition-transform duration-700 group-hover:scale-105 md:object-center"
                    sizes="(max-width: 1280px) 100vw, 1232px"
                />
                {/* Voile sombre : en bas sur mobile, à gauche sur grand écran (le texte reste lisible) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 md:bg-gradient-to-r md:from-black/80 md:via-black/45 md:to-transparent" />

                <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-lg shadow-black/30">
                        <ShellLogo className="h-9 w-auto" sizes="48px" />
                    </div>

                    <div className="max-w-xl">
                        <h2 id="shell-title" className="mb-2 text-balance text-3xl font-medium md:text-4xl">
                            Le plein Shell, à toute heure.
                        </h2>
                        <p className="mb-4 text-sm text-white/80 md:text-base">
                            Sans-plomb 95, V-Power et diesel, disponibles 24h/24 et 7j/7 grâce à nos terminaux de paiement automatiques.
                        </p>
                        <Link
                            href="/services"
                            className="inline-flex items-center text-sm font-medium text-white transition-colors hover:text-orange-500"
                        >
                            Voir nos carburants <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
