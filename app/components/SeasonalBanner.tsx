'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { activePromotions } from '@/lib/promotions';

/**
 * Bande d'annonce sous la barre de navigation (visible sur toutes les pages, fermable).
 *
 * - S'il y a une offre en cours (voir lib/promotions.ts), elle est annoncée ici.
 * - Sinon, on retrouve l'annonce habituelle : les chips Zweifel « Aromat ».
 *
 * Fermeture : l'annonce Zweifel est mémorisée dans le navigateur (une fois fermée, elle ne revient
 * plus). L'offre en cours, elle, n'est PAS mémorisée : la croix la ferme pour la visite en cours,
 * et elle revient au rechargement de la page (F5) ou à la visite suivante.
 */

interface Announcement {
    storageKey: string;
    ariaLabel: string;
    icon: React.ReactNode;
    label: string;
    textLong: string;
    textShort: string;
    href: string;
    linkLabel: string;
    /** Version courte du lien, pour les petits écrans. */
    linkLabelShort?: string;
    /** true : une fois fermée avec la croix, l'annonce ne revient plus. false : elle revient au rechargement. */
    rememberDismiss: boolean;
}

const ZWEIFEL: Announcement = {
    storageKey: 'banner_zweifel_aromat_dismissed',
    ariaLabel: 'Annonce nouveauté shop',
    icon: (
        <Image
            src="/zweifel-logo.svg"
            alt="Logo Zweifel"
            width={18}
            height={18}
            className="rounded-full object-contain shrink-0"
        />
    ),
    label: 'Exclusivité au Shop :',
    textLong: 'Les célèbres chips Zweifel « Aromat » sont de retour !',
    textShort: 'Zweifel « Aromat » de retour !',
    href: '/shop#zweifel',
    linkLabel: 'Découvrir',
    rememberDismiss: true,
};

function getAnnouncement(): Announcement {
    const promo = activePromotions.find((p) => p.bannerText);
    if (!promo || !promo.bannerText) return ZWEIFEL;

    return {
        storageKey: `banner_promo_${promo.id}_dismissed`,
        ariaLabel: 'Annonce offre en cours',
        // Émoji mandarine : prend le dessin natif de l'appareil (Apple sur iPhone/Mac, etc.).
        icon: (
            <span aria-hidden="true" className="shrink-0 text-base leading-none">
                🍊
            </span>
        ),
        label: 'En ce moment :',
        textLong: promo.bannerText,
        textShort: promo.bannerTextShort ?? promo.bannerText,
        href: '/offres',
        linkLabel: 'Voir l’offre',
        linkLabelShort: 'Voir',
        rememberDismiss: false,
    };
}

const ANNOUNCEMENT = getAnnouncement();

export default function SeasonalBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (ANNOUNCEMENT.rememberDismiss) {
            try {
                if (localStorage.getItem(ANNOUNCEMENT.storageKey)) return;
            } catch {
                // stockage indisponible (navigation privée) : on affiche l'annonce
            }
        }
        const timer = setTimeout(() => setIsVisible(true), 80);
        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        if (!ANNOUNCEMENT.rememberDismiss) return;
        try {
            localStorage.setItem(ANNOUNCEMENT.storageKey, 'true');
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
                    className="overflow-hidden bg-gradient-to-r from-stone-900 via-orange-950 to-stone-900 text-amber-100 border-t border-orange-500/25 shadow-md relative z-50 select-none"
                    aria-label={ANNOUNCEMENT.ariaLabel}
                >
                    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
                        {/* Message central cliquable */}
                        <div className="flex-1 min-w-0 flex items-center justify-center gap-2 text-center whitespace-nowrap">
                            {ANNOUNCEMENT.icon}
                            <span className="text-orange-300 font-semibold hidden sm:inline">
                                {ANNOUNCEMENT.label}
                            </span>
                            <span className="min-w-0 truncate text-[11px] min-[360px]:text-xs font-semibold text-white tracking-tight sm:hidden">
                                {ANNOUNCEMENT.textShort}
                            </span>
                            <span className="font-semibold text-white tracking-tight hidden sm:inline">
                                {ANNOUNCEMENT.textLong}
                            </span>
                            <Link
                                href={ANNOUNCEMENT.href}
                                className="inline-flex items-center gap-1 text-orange-400 hover:text-orange-300 font-semibold underline underline-offset-4 ml-1.5 transition-colors group cursor-pointer shrink-0"
                            >
                                <span className="sm:hidden max-[339px]:hidden">{ANNOUNCEMENT.linkLabelShort ?? ANNOUNCEMENT.linkLabel}</span>
                                <span className="hidden sm:inline">{ANNOUNCEMENT.linkLabel}</span>
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
