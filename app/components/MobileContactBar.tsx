'use client';

import { useState } from 'react';
import { QrCode, Share2, UserPlus, Check } from 'lucide-react';
import QrCodeModal from './QrCodeModal';
import ContactCardModal from './ContactCardModal';

export default function MobileContactBar() {
    const [isQrOpen, setIsQrOpen] = useState<boolean>(false);
    const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);

    const handleShare = async () => {
        const vcardUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/api/vcard`
            : 'https://station-maisonblanche.ch/api/vcard';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Station-Service Maison-Blanche S.A.',
                    text: 'Contact et coordonnées de la Station-Service Maison-Blanche à Chancy',
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
        <>
            {/* Barre flottante mobile épurée & lumineuse */}
            <div className="fixed bottom-4 left-0 right-0 z-40 px-4 md:hidden pointer-events-none">
                <div className="mx-auto max-w-sm bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-full p-2 shadow-2xl shadow-slate-900/15 flex items-center justify-between gap-2 pointer-events-auto">
                    {/* QR Code Action */}
                    <button
                        onClick={() => setIsQrOpen(true)}
                        className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center border border-slate-200/80 transition-all shrink-0 cursor-pointer"
                        title="Afficher le QR Code"
                        aria-label="Afficher le QR Code"
                    >
                        <QrCode size={19} />
                    </button>

                    {/* Share Action */}
                    <button
                        onClick={handleShare}
                        className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center border border-slate-200/80 transition-all shrink-0 relative cursor-pointer"
                        title="Partager"
                        aria-label="Partager la fiche contact"
                    >
                        {copied ? <Check size={17} className="text-emerald-600" /> : <Share2 size={17} />}
                    </button>

                    {/* Primary Action Button: Ajouter aux contacts */}
                    <a
                        href="/api/vcard"
                        className="flex-1 h-11 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all px-4 cursor-pointer"
                    >
                        <UserPlus size={17} />
                        <span>Ajouter aux contacts</span>
                    </a>
                </div>
            </div>

            {/* Modals */}
            <QrCodeModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
            <ContactCardModal isOpen={isCardOpen} onClose={() => setIsCardOpen(false)} />
        </>
    );
}
