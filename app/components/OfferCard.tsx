'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { activePromotions } from '@/lib/promotions';

/**
 * Petite carte qui glisse dans un coin de l'écran une fraction de seconde après l'arrivée sur
 * une page, pour annoncer l'offre en cours (voir lib/promotions.ts). Elle complète la
 * bande du haut.
 *
 * - Elle reste affichée, de page en page, tant que le visiteur n'a pas cliqué sur la croix.
 *   Une fois fermée, elle ne revient plus pour cette offre (une nouvelle offre la ramène).
 * - Jamais sur la page Offres (l'offre y est déjà), ni sur Contact (barre mobile en bas).
 * - Disparaît toute seule quand on retire l'offre de lib/promotions.ts.
 * - Tant qu'elle est affichée, le pied de page gagne de la place en bas (voir globals.css)
 *   pour qu'elle ne cache pas « Mentions légales ».
 */

const SHOW_DELAY_MS = 300;
const HIDDEN_ON = ['/offres', '/contact'];

const promo = activePromotions.find((p) => p.bannerText);
const storageKey = promo ? `offer_card_${promo.id}_closed` : '';

export default function OfferCard() {
    const pathname = usePathname();
    const reduceMotion = useReducedMotion();
    const [visible, setVisible] = useState(false);
    const shown = visible && !HIDDEN_ON.includes(pathname);

    useEffect(() => {
        if (!promo) return;

        // Déjà fermée par ce visiteur ? Alors elle ne revient pas.
        try {
            if (localStorage.getItem(storageKey)) return;
        } catch {
            // stockage indisponible (navigation privée) : on la montre
        }

        const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
        return () => clearTimeout(timer);
    }, []);

    // Prévient la page qu'une carte est affichée, pour laisser de la place sous le pied de page.
    useEffect(() => {
        document.documentElement.classList.toggle('has-offer-card', shown);
        return () => document.documentElement.classList.remove('has-offer-card');
    }, [shown]);

    if (!promo) return null;

    const dismiss = () => {
        setVisible(false);
        try {
            localStorage.setItem(storageKey, 'true');
        } catch {
            // ignore
        }
    };

    return (
        <AnimatePresence>
            {shown && (
                <motion.aside
                    aria-label="Offre en cours"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                    className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[22rem] lg:bottom-8 lg:right-8 lg:w-[27rem]"
                >
                    <div className="relative flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-white p-3 pr-10 shadow-xl shadow-slate-900/15 lg:gap-5 lg:rounded-3xl lg:p-4 lg:pr-12">
                        <Link
                            href="/offres"
                            tabIndex={-1}
                            aria-hidden="true"
                            className="relative block h-[4.7rem] w-[3.25rem] shrink-0 overflow-hidden rounded-lg ring-1 ring-slate-200 lg:h-[6.25rem] lg:w-[4.34rem] lg:rounded-xl"
                        >
                            <Image src={promo.imageSrc} alt="" fill sizes="70px" className="object-cover" />
                        </Link>

                        <div className="min-w-0">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-orange-500 lg:text-xs">En ce moment</p>
                            <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-800 lg:mt-1 lg:text-base">{promo.bannerText}</p>
                            <Link
                                href="/offres"
                                className="group mt-1.5 inline-flex items-center gap-1 text-[13px] font-semibold text-orange-600 transition-colors hover:text-orange-700 lg:mt-2 lg:text-sm"
                            >
                                Voir l’offre
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={dismiss}
                            className="absolute right-2 top-2 cursor-pointer rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                            aria-label="Fermer l’annonce"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
}
