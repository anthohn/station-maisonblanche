'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, QrCode, Share2, Check } from 'lucide-react';
import QRCode from 'qrcode';
import Image from 'next/image';

interface QrCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function QrCodeModal({ isOpen, onClose }: QrCodeModalProps) {
    const [qrDataUrl, setQrDataUrl] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

    useEffect(() => {
        if (!isOpen) return;

        const vcardUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/api/vcard`
            : 'https://station-maisonblanche.ch/api/vcard';

        QRCode.toDataURL(vcardUrl, {
            width: 320,
            margin: 2,
            color: {
                dark: '#0f172a',
                light: '#ffffff',
            },
            errorCorrectionLevel: 'H',
        })
            .then((url) => setQrDataUrl(url))
            .catch((err) => console.error('Error generating QR code:', err));
    }, [isOpen]);

    const handleShare = async () => {
        const vcardUrl = `${window.location.origin}/api/vcard`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Station-Service Maison-Blanche S.A.',
                    text: 'Scannez ou téléchargez la fiche de contact de la Station Maison-Blanche',
                    url: vcardUrl,
                });
            } catch {
                // Share cancelled
            }
        } else {
            await navigator.clipboard.writeText(vcardUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-sm bg-white rounded-[2rem] p-6 sm:p-8 shadow-2xl z-10 border border-slate-200 overflow-hidden text-center"
                    >
                        {/* Header Close */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors cursor-pointer"
                            aria-label="Fermer"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col items-center">
                            {/* Logo Badge */}
                            <div className="w-14 h-14 relative bg-orange-50 rounded-2xl p-2.5 shadow-sm border border-orange-100 mb-3 flex items-center justify-center">
                                <Image
                                    src="/logo-station.png"
                                    alt="Logo Station Maison-Blanche"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>

                            <h3 className="text-xl font-semibold text-slate-900 mb-1">Ajouter aux contacts</h3>
                            <p className="text-xs text-slate-500 mb-6 max-w-xs leading-relaxed">
                                Scannez ce QR Code avec l&apos;appareil photo de votre smartphone pour enregistrer la station.
                            </p>

                            {/* QR Code Container with Center Logo overlay */}
                            <div className="relative w-60 h-60 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center mb-6">
                                {qrDataUrl ? (
                                    <>
                                        <img src={qrDataUrl} alt="QR Code VCard Station Maison-Blanche" className="w-full h-full rounded-xl" />
                                        <div className="absolute w-11 h-11 bg-white rounded-xl shadow-md p-1.5 flex items-center justify-center border border-slate-100">
                                            <Image
                                                src="/logo-station.png"
                                                alt="Logo Center"
                                                width={26}
                                                height={26}
                                                className="object-contain"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <QrCode className="animate-pulse" size={32} />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="w-full space-y-2.5">
                                <a
                                    href="/api/vcard"
                                    className="w-full py-3.5 px-4 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                                >
                                    <UserPlus size={16} />
                                    Ajouter aux contacts
                                </a>

                                <button
                                    onClick={handleShare}
                                    className="w-full py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200 cursor-pointer"
                                >
                                    {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
                                    {copied ? 'Lien copié dans le presse-papier !' : 'Partager le contact'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
