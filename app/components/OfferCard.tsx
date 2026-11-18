'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { activePromotions } from '@/lib/promotions';

/**
 * Petite carte qui glisse dans un coin de l'écran quelques secondes après l'arrivée
 * sur le site, pour annoncer l'offre en cours (voir lib/promotions.ts). Elle complète
 * la bande du haut : celle-ci reste en permanence, la carte se montre une fois.
 *
 * - Une seule fois par jour et par visiteur (on retient la date dans le navigateur).
 * - Jamais sur la page Offres (l'offre y est déjà), ni sur Contact (barre mobile en bas).
 * - Se ferme avec la croix ; disparaît toute seule quand on retire l'offre de lib/promotions.ts.
 */

const SHOW_DELAY_MS = 2000;
const HIDDEN_ON = ['/offres', '/contact'];

const promo = activePromotions.find((p) => p.bannerText);
const storageKey = promo ? `offer_card_${promo.id}_seen` : '';

/** Date du jour dans le navigateur du visiteur : « 2026-12-03 ». */
function today(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function remember() {
    try {
        localStorage.setItem(storageKey, today());
    } catch {
        // stockage indisponible (navigation privée) : tant pis, la carte se montrera à la prochaine visite
    }
}

export default function OfferCard() {
    const pathname = usePathname();
    const reduceMotion = useReducedMotion();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!promo) return;

        // Déjà vue aujourd'hui ? Alors rien.
        try {
            if (localStorage.getItem(storageKey) === today()) return;
        } catch {
            // on continue : sans stockage, la carte se montre à chaque visite
        }

        // Arrivé directement sur la page de l'offre : le visiteur la voit déjà, on n'insiste pas.
        if (HIDDEN_ON.includes(window.location.pathname)) {
            remember();
            return;
        }

        const timer = setTimeout(() => {
            setVisible(true);
            remember();
        }, SHOW_DELAY_MS);
        return () => clearTimeout(timer);
    }, []);

    if (!promo) return null;

    const close = () => setVisible(false);
    const hidden = HIDDEN_ON.includes(pathname);

    return (
        <AnimatePresence>
            {visible && !hidden && (
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
                            onClick={close}
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
                                onClick={close}
                                className="group mt-1.5 inline-flex items-center gap-1 text-[13px] font-semibold text-orange-600 transition-colors hover:text-orange-700 lg:mt-2 lg:text-sm"
                            >
                                Voir l’offre
                                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                            </Link>
                        </div>

                        <button
                            type="button"
                            onClick={close}
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
