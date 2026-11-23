'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import HeroPhoto from '@/app/components/weather/HeroPhoto';
import WeatherCaption from '@/app/components/weather/WeatherCaption';

const stats = [
    { value: '24/24', label: 'Carburant disponible' },
    { value: '7/7', label: 'Shop ouvert' },
    // { value: '06–20h', label: 'Horaires shop' },
];

/*
 * Accueil.
 *
 * Grand écran (≥ 1024 px) : texte à gauche, photo à droite.
 * Mobile et tablette (< 1024 px) : la photo passe en premier (pleine largeur, collée sous l'en-tête),
 * puis le titre, le texte, les boutons et les chiffres clés, comme sur grand écran. L'ordre dans le
 * code reste « texte puis photo » (lecture, SEO) : seul l'ordre visuel change (`order-first`).
 */
export default function HeroSection() {
    return (
        <section className="relative pt-0 lg:pt-24 pb-12 lg:pb-20 overflow-hidden bg-white">
            {/* Dégradé chaleureux d'automne subtil */}
            <div className="absolute inset-0 bg-linear-to-b from-amber-100/35 via-orange-50/25 to-white pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10 items-center">

                    {/* Left — text content (sur mobile : sous la photo et ses cartes flottantes) */}
                    <div className="pt-7 lg:pt-0">
                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.05 }}
                            className="text-4xl md:text-6xl font-medium text-[--color-brand-dark] leading-[1.05] tracking-tight mb-6"
                        >
                            Votre station{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10 text-orange-500">service</span>
                                <span
                                    aria-hidden
                                    className="absolute bottom-1 left-0 w-full h-3 bg-orange-100 rounded-sm-z-0"
                                />
                            </span>
                            {' '}à Chancy.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.15 }}
                            className="text-lg md:text-xl text-slate-500 max-w-lg mb-8 lg:mb-10 leading-relaxed"
                        >
                            Épicerie de proximité, carburants Shell et lavage auto. Tout ce dont vous avez besoin, tous les jours de 06h00 à <span className="text-orange-500 font-semibold">20h30</span>.
                        </motion.p>

                        {/* CTAs : pleine largeur et empilés sur téléphone, côte à côte dès 640 px */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.25 }}
                            className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 mb-10 lg:mb-14"
                        >
                            <a
                                href="https://maps.google.com/?q=Station+Maison-Blanche+Chancy+Geneve"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary max-sm:w-full max-sm:justify-center"
                            >
                                <MapPin size={18} />
                                Itinéraire
                            </a>
                            <Link href="/services" className="btn-secondary max-sm:w-full max-sm:justify-center">
                                Nos services
                                <ArrowRight size={18} />
                            </Link>
                        </motion.div>

                        {/* Stats strip */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="border-t border-slate-200 pt-8 grid grid-cols-2 gap-6"
                        >
                            {stats.map((s) => (
                                <div key={s.label} className="text-center lg:text-left">
                                    <p className="text-3xl md:text-4xl font-medium text-[--color-brand-dark]">{s.value}</p>
                                    <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right — shop image. Mobile/tablette : en premier, pleine largeur, collée sous l'en-tête */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.65, delay: 0.2 }}
                        className="relative z-[25] order-first lg:order-none -mx-6 lg:mx-0"
                    >
                        <div className="relative w-full overflow-hidden lg:rounded-2xl aspect-[4/3] sm:aspect-auto sm:h-[400px] md:h-[440px] lg:h-[520px] shadow-xl lg:shadow-2xl">
                            {/* La photo et ses calques météo (ciel, brouillard, vitrines allumées…) : voir HeroPhoto.tsx */}
                            <HeroPhoto />
                            {/* Badge de lieu (mobile/tablette) : même style que les badges sur photo du reste du site */}
                            <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md lg:hidden">
                                <MapPin size={13} aria-hidden="true" />
                                Chancy, Genève
                            </div>
                            {/* Le temps qu'il fait à la station (apparaît quand la météo est connue) */}
                            <WeatherCaption />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
