'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Fuel, ShoppingBasket, Droplets, Wind, Flame } from 'lucide-react';
import pompes from '@/public/pompes0.jpg';
// import devanture from '@/public/devanture.jpeg';


export default function ServicesContent() {
    return (
        <main className="bg-slate-50 pt-32">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* En-tête de la page */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-20"
                >
                    <h1 className="text-4xl md:text-6xl font-medium text-[--color-brand-dark] tracking-tight mb-6">
                        Tous nos services <span className="text-orange-500">au même endroit.</span>
                    </h1>
                    <p className="text-xl text-slate-500">
                        De l&apos;essence 24h/24 au café chaud de 06h00, découvrez tout ce que la Station-Service Maison-Blanche met à votre disposition à Chancy.
                    </p>
                </motion.div>

                {/* --- BLOCS ALTERNÉS POUR LES PILIERS --- */}
                <div className="space-y-24">

                    {/* 1. Carburants */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    >
                        <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-sm">
                            <Image src={pompes} alt="Pompes à essence Shell V-Power et diesel à la Station-Service Maison-Blanche, Chancy, Genève" fill className="object-cover" priority />
                        </div>
                        <div className="lg:pl-10 shadow-sm bg-white rounded-[2rem] p-8 border border-slate-100">
                            <div className="bg-orange-100 w-14 h-14 flex items-center justify-center rounded-2xl mb-6">
                                <Fuel size={28} className="text-orange-500" />
                            </div>
                            <h2 className="text-3xl font-medium text-[--color-brand-dark] mb-4">Carburants Shell 24/7</h2>
                            <p className="text-slate-500 text-lg leading-relaxed mb-6">
                                Profitez de la qualité des carburants Shell à toute heure du jour et de la nuit. Nos pompes sont équipées de terminaux de paiement par carte de dernière génération pour un service rapide et sécurisé, même en dehors des heures d&apos;ouverture du shop.
                            </p>
                        </div>
                    </motion.div>

                    {/* 2. Le Shop (Image à droite sur desktop) */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    >
                        <div className="order-2 lg:order-1 lg:pr-10 shadow-sm bg-white rounded-[2rem] p-8 border border-slate-100">
                            <div className="bg-orange-100 w-14 h-14 flex items-center justify-center rounded-2xl mb-6">
                                <ShoppingBasket size={28} className="text-orange-500" />
                            </div>
                            <h2 className="text-3xl font-medium text-[--color-brand-dark] mb-4">Épicerie & Dépannage</h2>
                            <p className="text-slate-500 text-lg leading-relaxed mb-6">
                                Ouvert tous les jours de 06h à 20h. Que ce soit pour votre café du matin, un encas rapide à midi ou des courses de dépannage de dernière minute le dimanche, notre shop indépendant vous accueille avec le sourire.
                            </p>
                        </div>
                        <div className="order-1 lg:order-2 relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-sm">
                            <Image src="/devanture.jpeg" alt="Devanture et intérieur du shop épicerie Station-Service Maison-Blanche, Chancy" fill className="object-cover" />
                        </div>
                    </motion.div>

                    {/* 3. Lavage & Aspirateurs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
                    >
                        <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-sm">
                            <Image src="/lavage.jpeg" alt="Piste de lavage haute pression en libre-service, Station-Service Maison-Blanche Chancy" fill className="object-cover" />
                        </div>
                        <div className="lg:pl-10 shadow-sm bg-white rounded-[2rem] p-8 border border-slate-100">
                            <div className="bg-orange-100 w-14 h-14 flex items-center justify-center rounded-2xl mb-6">
                                <Droplets size={28} className="text-orange-500" />
                            </div>
                            <h2 className="text-3xl font-medium text-[--color-brand-dark] mb-4">Lavage Haute Pression</h2>
                            <p className="text-slate-500 text-lg leading-relaxed mb-6">
                                Prenez soin de votre véhicule avec nos pistes de lavage haute pression. Un équipement performant pour éliminer les saletés les plus tenaces, complété par nos zones d&apos;aspiration puissantes pour l&apos;intérieur de votre habitacle.
                            </p>
                        </div>
                    </motion.div>

                </div>

                {/* --- GRILLE BENTO : LES PETITS PLUS --- */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32"
                >
                    <h3 className="text-2xl font-medium text-[--color-brand-dark] mb-8">Et aussi sur place...</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Borne Pneus */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-start gap-6">
                            <div className="bg-orange-100 w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl">
                                <Wind size={24} className="text-orange-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-medium text-[--color-brand-dark] mb-2">Borne de gonflage</h4>
                                <p className="text-slate-500">
                                    Vérifiez et ajustez la pression de vos pneus en toute autonomie pour rouler en toute sécurité et réduire votre consommation.
                                </p>
                            </div>
                        </div>

                        {/* Gaz */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-start gap-6">
                            <div className="bg-orange-100 w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl">
                                <Flame size={24} className="text-orange-500" />
                            </div>
                            <div>
                                <h4 className="text-xl font-medium text-[--color-brand-dark] mb-2">Vente de gaz</h4>
                                <p className="text-slate-500">
                                    Bouteilles de gaz disponibles en différents formats pour vos barbecues, chauffages d&apos;appoint ou équipements professionnels.
                                </p>
                            </div>
                        </div>

                    </div>
                </motion.div>

            </div>
        </main>
    );
}
