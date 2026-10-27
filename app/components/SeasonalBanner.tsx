'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

export default function SeasonalBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const isDismissed = localStorage.getItem('seasonal_banner_halloween_dismissed');
            if (!isDismissed) {
                const timer = setTimeout(() => setIsVisible(true), 80);
                return () => clearTimeout(timer);
            }
        } catch {
            const timer = setTimeout(() => setIsVisible(true), 80);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        try {
            localStorage.setItem('seasonal_banner_halloween_dismissed', 'true');
        } catch {
            // ignore
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.aside
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-amber-100 border-b border-orange-500/25 relative z-50 select-none"
                    aria-label="Annonce saisonnière"
                >
                    <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                        {/* Message central cliquable */}
                        <div className="flex-1 flex items-center justify-center gap-2 text-center">
                            <span className="text-base select-none">🍂</span>
                            <span className="text-amber-200/90 hidden sm:inline">
                                Spécial Automne au shop :
                            </span>
                            <span className="font-semibold text-white tracking-tight">
                                Votre sac à bonbons Haribo offert pour Halloween !
                            </span>
                            <Link
                                href="/promotions?promo=halloween"
                                className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-4 ml-1.5 transition-colors group cursor-pointer"
                            >
                                <span>Voir le bon</span>
                                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>

                        {/* Bouton fermeture discret */}
                        <button
                            onClick={handleDismiss}
                            className="p-1 rounded-full text-amber-200/60 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                            aria-label="Fermer l'annonce"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
