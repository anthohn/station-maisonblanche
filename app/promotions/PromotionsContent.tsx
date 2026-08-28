'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { QrCode, ArrowRight, MapPin } from 'lucide-react';
import { activePromotions, Promotion } from '@/lib/promotions';
import PromoModal from '@/app/components/PromoModal';

export default function PromotionsContent() {
    const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

    return (
        <main className="min-h-screen bg-slate-50 pt-20 sm:pt-24 md:pt-24 pb-24">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* --- HEADER DES OFFRES --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-medium text-[--color-brand-dark] tracking-tight mb-6">
                        Nos offres <span className="text-orange-500">du moment.</span>
                    </h1>
                    <p className="text-xl text-slate-500 leading-relaxed">
                        Retrouvez nos formules exclusives et profitez de réductions immédiates en présentations simples de votre coupon lors de votre passage en caisse.
                    </p>
                </motion.div>

                {/* --- GRILLE DES PROMOTIONS --- */}
                <div className="flex justify-center mb-16">
                    {activePromotions.map((promo, idx) => (
                        <motion.div
                            key={promo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="w-full max-w-md bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group"
                        >
                            {/* Image Header */}
                            <div className="relative h-60 w-full overflow-hidden shrink-0">
                                <Image
                                    src={promo.imageSrc}
                                    alt={promo.imageAlt}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                                {/* Badge Haut */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-orange-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md">
                                        {promo.badge}
                                    </span>
                                </div>

                                {/* Conteneur Prix sur l'image */}
                                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                    <div>
                                        <p className="text-white/80 text-xs uppercase font-medium tracking-wider">Prix spécial web</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-extrabold text-white">{promo.promoPrice}</span>
                                            <span className="text-sm text-white/60 line-through">{promo.originalPrice}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Corps de la carte */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                        {promo.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                        {promo.description}
                                    </p>
                                </div>

                                {/* Bouton Action Code-barres */}
                                <button
                                    onClick={() => setSelectedPromo(promo)}
                                    className="w-full py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                                >
                                    <QrCode size={19} />
                                    <span>Obtenir mon coupon caisse</span>
                                    <ArrowRight size={16} className="ml-auto opacity-70" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* --- COMMENT ÇA MARCHE ? --- */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-100 shadow-sm"
                >
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
                        Comment profiter de vos réductions ?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                                1
                            </div>
                            <h3 className="font-semibold text-lg text-slate-900 mb-2">Sélectionnez l'offre</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Choisissez la promotion souhaitée sur cette page avant ou pendant votre visite.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                                2
                            </div>
                            <h3 className="font-semibold text-lg text-slate-900 mb-2">Générez votre coupon</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Cliquez sur "Obtenir mon coupon" pour afficher votre code-barres EAN-13 dédié.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                                3
                            </div>
                            <h3 className="font-semibold text-lg text-slate-900 mb-2">Scannez en caisse</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Montrez l'écran de votre smartphone au caissier pour bénéficier de la réduction immédiate.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-slate-600 text-sm">
                            <span>Offres valables directement au Shop de la Station Maison-Blanche à Chancy.</span>
                        </div>
                        <a
                            href="https://maps.app.goo.gl/WKU8p8fe4wCEhn2t6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors uppercase tracking-wider shrink-0"
                        >
                            <MapPin size={16} />
                            Voir l'itinéraire
                        </a>
                    </div>
                </motion.section>

            </div>

            {/* Modal de scannage EAN-13 */}
            <PromoModal
                promotion={selectedPromo}
                isOpen={!!selectedPromo}
                onClose={() => setSelectedPromo(null)}
            />
        </main>
    );
}
