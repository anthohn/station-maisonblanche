'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { Promotion } from '@/lib/promotions';
import BarcodeSvg from './BarcodeSvg';

interface PromoModalProps {
    promotion: Promotion | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function PromoModal({ promotion, isOpen, onClose }: PromoModalProps) {
    if (!promotion) return null;

    const isFreeOffer = promotion.promoPrice.toLowerCase().includes('offert');
    const barcodeCode = promotion.barcode || promotion.ean13Code || '15935764';

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
                        className="fixed inset-0 bg-slate-900/75 backdrop-blur-md"
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

                            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 mb-2">
                                {promotion.badge}
                            </span>

                            <h3 className="text-2xl font-bold text-slate-900 mb-1 leading-snug">
                                {promotion.title}
                            </h3>

                            {/* Tarification */}
                            {isFreeOffer ? (
                                <div className="flex flex-col items-center gap-1 my-3">
                                    <span className="text-3xl font-extrabold text-orange-500 tracking-wide uppercase">
                                        {promotion.promoPrice}
                                    </span>
                                    <span className="text-xs font-medium text-slate-600">
                                        Pour 1 Haribo Halloween + 1 au choix acheté
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-3 my-3">
                                    <span className="text-3xl font-extrabold text-orange-500">
                                        {promotion.promoPrice}
                                    </span>
                                    {promotion.originalPrice && (
                                        <span className="text-base text-slate-400 line-through">
                                            {promotion.originalPrice}
                                        </span>
                                    )}
                                </div>
                            )}

                            <p className="text-xs text-slate-500 mb-4 leading-relaxed max-w-xs">
                                Présentez ce code-barres directement à la caisse du shop de la station.
                            </p>

                            {/* Zone Code-Barres (Contraste maximal pour douchette caisse) */}
                            <div className="w-full bg-white p-4 sm:p-5 rounded-2xl border-2 border-slate-300 shadow-sm flex flex-col items-center justify-center mb-5">
                                <BarcodeSvg
                                    code={barcodeCode}
                                    type={promotion.barcodeType}
                                    width={290}
                                    height={125}
                                />
                            </div>

                            {/* Modalités & Renseignements */}
                            <div className="w-full bg-slate-50 rounded-2xl p-3.5 text-[11px] text-slate-500 text-center border border-slate-100">
                                <p className="font-semibold text-slate-700 mb-1">
                                    {promotion.validityNotice}
                                </p>
                                <p className="opacity-80 leading-relaxed">{promotion.terms}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
