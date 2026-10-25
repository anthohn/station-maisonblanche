'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Barcode, ArrowRight, MapPin, Sparkles } from 'lucide-react';
import { activePromotions, Promotion } from '@/lib/promotions';
import PromoModal from '@/app/components/PromoModal';

function PromotionsInner() {
    const searchParams = useSearchParams();
    const promoQuery = searchParams.get('promo');

    // Dérivation propre pour initialiser la modale automatiquement selon l'URL
    const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(() => {
        if (!promoQuery) return null;
        return activePromotions.find((p) => p.id.toLowerCase() === promoQuery.toLowerCase()) || null;
    });

    // Synchronisation en cas de changement de paramètre sans navigation complète
    useEffect(() => {
        if (!promoQuery) return;
        const matched = activePromotions.find((p) => p.id.toLowerCase() === promoQuery.toLowerCase());
        if (matched) {
            const timer = setTimeout(() => setSelectedPromo(matched), 0);
            return () => clearTimeout(timer);
        }
    }, [promoQuery]);

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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold text-xs mb-4">
                        <Sparkles size={14} className="text-orange-500" />
                        <span>Bons plans en station</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-medium text-[--color-brand-dark] tracking-tight mb-6">
                        Nos offres <span className="text-orange-500">du moment.</span>
                    </h1>
                    <p className="text-xl text-slate-500 leading-relaxed">
                        Profitez de nos offres exclusives en boutique. Présentez simplement votre coupon digital lors de votre passage en caisse à la station.
                    </p>
                </motion.div>

                {/* --- GRILLE DES PROMOTIONS --- */}
                <div className="flex justify-center mb-16">
                    {activePromotions.map((promo, idx) => {
                        const isFree = promo.promoPrice.toLowerCase().includes('offert');

                        return (
                            <motion.div
                                key={promo.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="w-full max-w-md bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
                            >
                                {/* Image Header */}
                                <div className="relative h-64 w-full overflow-hidden shrink-0">
                                    <Image
                                        src={promo.imageSrc}
                                        alt={promo.imageAlt}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />

                                    {/* Badge Haut */}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-orange-500 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                                            {promo.badge}
                                        </span>
                                    </div>

                                    {/* Conteneur Prix sur l'image */}
                                    <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                        <div>
                                            <p className="text-white/80 text-xs uppercase font-medium tracking-wider">
                                                {isFree ? 'Cadeau boutique' : 'Prix spécial web'}
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-3xl font-extrabold text-white tracking-wide uppercase">
                                                    {promo.promoPrice}
                                                </span>
                                                {!isFree && promo.originalPrice && (
                                                    <span className="text-sm text-white/60 line-through">
                                                        {promo.originalPrice}
                                                    </span>
                                                )}
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
                                        <Barcode size={20} />
                                        <span>Afficher le code-barres en caisse</span>
                                        <ArrowRight size={16} className="ml-auto opacity-70" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
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
                            <h3 className="font-semibold text-lg text-slate-900 mb-2">Sélectionnez l&apos;offre</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Flashez le QR code en magasin ou choisissez l&apos;offre sur cette page.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                                2
                            </div>
                            <h3 className="font-semibold text-lg text-slate-900 mb-2">Affichez votre coupon</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Cliquez sur &quot;Afficher le code-barres&quot; pour ouvrir instantanément votre bon de caisse.
                            </p>
                        </div>

                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center font-bold text-xl mb-4 shadow-sm">
                                3
                            </div>
                            <h3 className="font-semibold text-lg text-slate-900 mb-2">Scannez en caisse</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Présentez l&apos;écran de votre smartphone au caissier lors de votre passage pour appliquer la gratuité.
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
                            Voir l&apos;itinéraire
                        </a>
                    </div>
                </motion.section>

            </div>

            {/* Modal de coupon caisse */}
            <PromoModal
                promotion={selectedPromo}
                isOpen={!!selectedPromo}
                onClose={() => setSelectedPromo(null)}
            />
        </main>
    );
}

export default function PromotionsContent() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-slate-50 pt-24 pb-24 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </main>
        }>
            <PromotionsInner />
        </Suspense>
    );
}
