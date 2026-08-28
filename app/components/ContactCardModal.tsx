'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MapPin, Globe, Clock, UserPlus, QrCode, Share2, Check } from 'lucide-react';
import Image from 'next/image';
import QrCodeModal from './QrCodeModal';

interface ContactCardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ContactCardModal({ isOpen, onClose }: ContactCardModalProps) {
    const [showQrModal, setShowQrModal] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const handleShare = async () => {
        const vcardUrl = `${window.location.origin}/api/vcard`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Station Service Maison-Blanche S.A.',
                    text: 'Fiche de contact Station Service Maison-Blanche',
                    url: vcardUrl,
                });
            } catch {
                // User cancelled or failed
            }
        } else {
            await navigator.clipboard.writeText(vcardUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && !showQrModal && (
                    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />

                        {/* Modal sheet card (Lumineux & Épuré) */}
                        <motion.div
                            initial={{ opacity: 0, y: '100%' }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                            className="relative w-full max-w-lg bg-white text-slate-900 rounded-t-[2rem] sm:rounded-[2rem] shadow-2xl z-10 border border-slate-200 max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header avec bouton fermer & partager */}
                            <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur-md border-b border-slate-200">
                                <span className="section-tag mb-0">Fiche Contact Officielle</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleShare}
                                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                                        title="Partager"
                                    >
                                        {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
                                        aria-label="Fermer"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Profil Contact */}
                            <div className="p-6 md:p-8 text-center flex flex-col items-center">
                                {/* Avatar Logo avec anneau orange */}
                                <div className="relative w-20 h-20 rounded-2xl p-1 bg-orange-50 border border-orange-100 shadow-sm mb-4 flex items-center justify-center">
                                    <Image
                                        src="/logo-station.png"
                                        alt="Logo Station Service Maison-Blanche S.A."
                                        width={56}
                                        height={56}
                                        className="object-contain"
                                    />
                                </div>

                                <h2 className="text-2xl font-semibold text-[--color-brand-dark] tracking-tight mb-1">
                                    Station Service Maison-Blanche S.A.
                                </h2>
                                <p className="text-xs text-slate-500 mb-6 font-medium">
                                    Station Shell • Épicerie Shop • Lavage Haute Pression
                                </p>

                                {/* Raccourcis d'actions rapides (Design Boutons Épurés) */}
                                <div className="grid grid-cols-4 gap-3 w-full mb-6">
                                    <a
                                        href="tel:+41227561522"
                                        className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-orange-50 transition-all border border-slate-200/70 hover:border-orange-200 group cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <Phone size={18} />
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-700">Appeler</span>
                                    </a>

                                    <a
                                        href="mailto:contact@station-maisonblanche.ch"
                                        className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-orange-50 transition-all border border-slate-200/70 hover:border-orange-200 group cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <Mail size={18} />
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-700">Email</span>
                                    </a>

                                    <a
                                        href="https://maps.app.goo.gl/WKU8p8fe4wCEhn2t6"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-orange-50 transition-all border border-slate-200/70 hover:border-orange-200 group cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <MapPin size={18} />
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-700">Itinéraire</span>
                                    </a>

                                    <button
                                        onClick={() => setShowQrModal(true)}
                                        className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-orange-50 transition-all border border-slate-200/70 hover:border-orange-200 group cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <QrCode size={18} />
                                        </div>
                                        <span className="text-[11px] font-semibold text-slate-700">QR Code</span>
                                    </button>
                                </div>

                                {/* Liste des informations (Fond blanc/slate-50 avec bordure soignée) */}
                                <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl divide-y divide-slate-200/60 text-left mb-6 overflow-hidden">
                                    <div className="p-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                            <Phone size={15} className="text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Téléphone</p>
                                            <a href="tel:+41227561522" className="text-sm font-semibold text-slate-900 hover:text-orange-600 transition-colors block cursor-pointer">
                                                +41 22 756 15 22
                                            </a>
                                        </div>
                                    </div>

                                    <div className="p-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                            <Mail size={15} className="text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">E-mail</p>
                                            <a href="mailto:contact@station-maisonblanche.ch" className="text-sm font-semibold text-slate-900 hover:text-orange-600 transition-colors block cursor-pointer">
                                                contact@station-maisonblanche.ch
                                            </a>
                                        </div>
                                    </div>

                                    <div className="p-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                            <Globe size={15} className="text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Site internet</p>
                                            <a href="https://station-maisonblanche.ch" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-slate-900 hover:text-orange-600 transition-colors block cursor-pointer">
                                                https://station-maisonblanche.ch
                                            </a>
                                        </div>
                                    </div>

                                    <div className="p-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                            <MapPin size={15} className="text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Adresse</p>
                                            <p className="text-sm font-semibold text-slate-900">Route de Chancy 500, 1284 Chancy, Suisse</p>
                                        </div>
                                    </div>

                                    <div className="p-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                                            <Clock size={15} className="text-orange-500" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Horaires Épicerie (Shop)</p>
                                            <p className="text-sm font-semibold text-slate-900">
                                                Ouvert 7/7 de 06h00 à <span className="text-orange-500 font-bold">21h00</span>
                                            </p>
                                            <p className="text-xs text-slate-500 mt-0.5">Carburant Shell & Lavage : 24h/24</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Principale : Bouton Orange Pill Signature du site */}
                                <a
                                    href="/api/vcard"
                                    className="w-full py-4 px-6 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                                >
                                    <UserPlus size={19} />
                                    Ajouter aux contacts (.vcf)
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Modal QR Code */}
            <QrCodeModal isOpen={showQrModal} onClose={() => setShowQrModal(false)} />
        </>
    );
}
