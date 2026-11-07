'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';

export default function SeasonalBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        try {
            const isDismissed = localStorage.getItem('banner_zweifel_aromat_dismissed');
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
            localStorage.setItem('banner_zweifel_aromat_dismissed', 'true');
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
                    className="overflow-hidden bg-gradient-to-r from-stone-900 via-orange-950 to-stone-900 text-amber-100 border-b border-orange-500/25 relative z-50 select-none"
                    aria-label="Annonce nouveauté shop"
                >
                    <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                        {/* Message central cliquable */}
                        <div className="flex-1 flex items-center justify-center gap-2 text-center">
                            <Image
                                src="/zweifel-logo.svg"
                                alt="Logo Zweifel"
                                width={18}
                                height={18}
                                className="rounded-full object-contain shrink-0"
                            />
                            <span className="text-orange-300 font-semibold hidden sm:inline">
                                Exclusivité au Shop :
                            </span>
                            <span className="font-semibold text-white tracking-tight sm:hidden">
                                Zweifel « Aromat » de retour !
                            </span>
                            <span className="font-semibold text-white tracking-tight hidden sm:inline">
                                Les célèbres chips Zweifel « Aromat » sont de retour !
                            </span>
                            <Link
                                href="/shop#zweifel"
                                className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-4 ml-1.5 transition-colors group cursor-pointer shrink-0"
                            >
                                <span>Découvrir</span>
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
