'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Clock, Droplets, ShoppingBag, Zap } from 'lucide-react';

const services = [
    {
        id: 'carburant',
        icon: Zap,
        tag: 'Shell',
        title: 'Station Carburant',
        desc: 'Essence, Diesel et Shell V-Power disponibles à toute heure. Qualité Shell garantie.',
        features: ['Essence Sans-Plomb', 'Diesel', 'Shell V-Power', 'Lubrifiants'],
        href: '/carburant',
        accent: '#f97316',
        bgAccent: 'rgba(249,115,22,0.08)',
    },
    {
        id: 'shop',
        icon: ShoppingBag,
        tag: 'Épicerie',
        title: 'Shop de proximité',
        desc: 'Épicerie complète, petite restauration, café et snacks. Idéal pour vos courses rapides.',
        features: ['Épicerie du quotidien', 'Café & boissons', 'Sandwichs & snacks', 'Journaux'],
        href: '/carburant',
        accent: '#f59e0b',
        bgAccent: 'rgba(245,158,11,0.08)',
    },
    {
        id: 'lavage',
        icon: Droplets,
        tag: 'Libre-service',
        title: 'Lavage Auto',
        desc: 'Piste haute pression en libre-service et aspirateurs puissants disponibles sur place.',
        features: ['Haute pression', 'Mousse active', 'Rince-cire', 'Aspirateurs'],
        href: '/lavage',
        accent: '#0ea5e9',
        bgAccent: 'rgba(14,165,233,0.08)',
    },
];

export default function ServicesSection() {
    return (
        <section id="services" className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
                >
                    <div>
                        <p className="section-tag">Nos services</p>
                        <h2 className="text-4xl md:text-5xl font-semibold text-[--color-brand-dark] leading-tight max-w-lg">
                            Tout ce dont vous avez besoin.
                        </h2>
                    </div>
                    <p className="text-slate-500 max-w-sm text-base leading-relaxed">
                        Carburant, épicerie, lavage — la Station-Service Maison-Blanche couvre tous vos besoins en un seul arrêt.
                    </p>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((s, idx) => {
                        const Icon = s.icon;
                        return (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="card group p-8 flex flex-col"
                            >
                                {/* Icon */}
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                    style={{ background: s.bgAccent }}
                                >
                                    <Icon size={26} style={{ color: s.accent }} />
                                </div>

                                {/* Tag */}
                                <span
                                    className="text-xs font-bold uppercase tracking-widest mb-3"
                                    style={{ color: s.accent }}
                                >
                                    {s.tag}
                                </span>

                                <h3 className="text-xl font-bold text-[--color-brand-dark] mb-3">{s.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">{s.desc}</p>

                                {/* Feature chips */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {s.features.map((f) => (
                                        <span
                                            key={f}
                                            className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600"
                                        >
                                            {f}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    href={s.href}
                                    className="flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all"
                                    style={{ color: s.accent }}
                                >
                                    En savoir plus <ArrowRight size={16} />
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Hours banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 rounded-2xl bg-[--color-brand-dark] p-8 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
                            <Clock size={24} className="text-orange-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-xl">Shop ouvert tous les jours</h3>
                            <p className="text-slate-400 text-sm mt-0.5">Même les week-ends et jours fériés</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <p className="text-4xl font-black text-orange-400">06:00</p>
                            <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">Ouverture</p>
                        </div>
                        <div className="h-px w-12 bg-slate-700" />
                        <div className="text-center">
                            <p className="text-4xl font-black text-orange-400">20:00</p>
                            <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider">Fermeture</p>
                        </div>
                    </div>
                </motion.div>

                {/* Bento stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {[
                        { val: '24h/24', label: 'Carburant disponible' },
                        { val: '7j/7', label: 'Shop ouvert' },
                        { val: '3', label: 'Services sur place' },
                        { val: '100%', label: 'Enseigne Shell certifiée' },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="card p-6 text-center"
                        >
                            <p className="text-3xl font-black text-[--color-brand-dark]">{item.val}</p>
                            <p className="text-slate-500 text-sm mt-2">{item.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
