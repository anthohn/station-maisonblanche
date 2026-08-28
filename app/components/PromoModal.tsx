'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Promotion } from '@/lib/promotions';
import Ean13BarcodeSvg from './Ean13BarcodeSvg';

interface PromoModalProps {
    promotion: Promotion | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function PromoModal({ promotion, isOpen, onClose }: PromoModalProps) {
    if (!promotion) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop sombre flouté */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/70 backdrop-blur-md"
                    />

                    {/* Modal Content - Blanc pur haute luminosité */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] p-6 sm:p-8 shadow-2xl z-10 border border-slate-200 overflow-hidden text-center my-auto"
                    >
                        {/* Bouton Fermer */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                            aria-label="Fermer"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center">
                            {/* Logo & Badge */}
                            <div className="w-14 h-14 relative bg-orange-50 rounded-2xl p-2.5 shadow-sm border border-orange-100 mb-3 flex items-center justify-center">
                                <Image
                                    src="/logo-station.png"
                                    alt="Logo Station Maison-Blanche"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-1 leading-snug">
                                {promotion.title}
                            </h3>

                            {/* Tarification */}
                            <div className="flex items-center justify-center gap-3 my-3">
                                <span className="text-3xl font-extrabold text-orange-500">
                                    {promotion.promoPrice}
                                </span>
                                <span className="text-base text-slate-400 line-through">
                                    {promotion.originalPrice}
                                </span>
                            </div>

                            <p className="text-xs text-slate-500 mb-5 leading-relaxed max-w-xs">
                                Présentez ce code-barres lors de votre passage à la caisse du shop.
                            </p>

                            {/* Zone Code-Barres EAN-13 (Contraste maximal pour douchette caisse) */}
                            <div className="w-full bg-white p-4 rounded-2xl border-2 border-slate-300 shadow-sm flex flex-col items-center justify-center mb-5">
                                <Ean13BarcodeSvg code={promotion.ean13Code} width={280} height={120} />
                            </div>

                            {/* Modalités & Renseignements */}
                            <div className="w-full bg-slate-50 rounded-2xl p-3 text-[11px] text-slate-500 text-center">
                                <p className="font-semibold text-slate-700 mb-0.5">{promotion.validityNotice}</p>
                                <p className="opacity-80">{promotion.terms}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
