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

    const barcodeCode = promotion.barcode || promotion.ean13Code || '15935764';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Carte Coupon épurée */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 15 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-sm bg-white rounded-[2rem] p-6 sm:p-8 shadow-2xl z-10 border border-slate-200 overflow-hidden text-center my-auto"
                    >
                        {/* Bouton Fermer */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                            aria-label="Fermer"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col items-center">
                            {/* Logo Station */}
                            <div className="w-12 h-12 relative bg-orange-50 rounded-2xl p-2 border border-orange-100/80 mb-4 flex items-center justify-center">
                                <Image
                                    src="/logo-station.png"
                                    alt="Logo Station Maison-Blanche"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>

                            {/* Titre unique */}
                            <h3 className="text-xl font-semibold text-slate-900 tracking-tight mb-1.5">
                                {promotion.title}
                            </h3>

                            {/* Condition en une seule ligne */}
                            <p className="text-xs text-slate-500 max-w-xs leading-relaxed mb-6">
                                {promotion.subtitle || "Pour l'achat de 2 paquets Haribo 175g (dont 1 Halloween)"}
                            </p>

                            {/* Zone Code-Barres nette */}
                            <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center mb-6">
                                <BarcodeSvg
                                    code={barcodeCode}
                                    type={promotion.barcodeType}
                                    width={260}
                                    height={115}
                                />
                            </div>

                            {/* Mention discrète de bas de carte */}
                            <p className="text-[11px] text-slate-400">
                                À présenter en caisse • Jusqu&apos;au 31 octobre
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
