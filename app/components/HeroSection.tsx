'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';

const stats = [
    { value: '24h/24', label: 'Carburant disponible' },
    { value: '7j/7', label: 'Shop ouvert' },
    // { value: '06–20h', label: 'Horaires shop' },
];

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-white">
            {/* Subtle warm tint */}
            <div className="absolute inset-0 bg-linear-to-b from-orange-50/50 via-white to-white pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                    {/* Left — text content */}
                    <div>
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
                            className="text-lg md:text-xl text-slate-500 max-w-lg mb-10 leading-relaxed"
                        >
                            Épicerie de proximité, carburants Shell et lavage auto. Tout ce dont vous avez besoin, tous les jours de 06h à 20h.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.25 }}
                            className="flex flex-wrap gap-4 mb-14"
                        >
                            <a
                                href="https://maps.google.com/?q=Station+Maison-Blanche+Chancy+Geneve"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary"
                            >
                                <MapPin size={18} />
                                Itinéraire
                            </a>
                            <Link href="/services" className="btn-secondary">
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
                                <div key={s.label}>
                                    <p className="text-3xl md:text-4xl font-medium text-[--color-brand-dark]">{s.value}</p>
                                    <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right — shop image with border, radius, blur */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.65, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        {/* Image with slight blur */}
                        <div className="relative rounded-2xl overflow-hidden h-[520px] shadow-2xl">
                            <Image
                                src="/shop.JPG"
                                alt="Shop et épicerie de proximité à la Station Maison-Blanche, Chancy, Genève"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
