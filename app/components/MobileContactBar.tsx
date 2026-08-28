'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { QrCode, UserPlus } from 'lucide-react';
import QrCodeModal from './QrCodeModal';

export default function MobileContactBar() {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isQrOpen, setIsQrOpen] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || pathname !== '/contact') {
        return null;
    }

    const handleAddContact = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (typeof window !== 'undefined' && navigator.canShare) {
            try {
                const res = await fetch('/api/vcard');
                const vcardText = await res.text();
                const file = new File([vcardText], 'station-maisonblanche.vcf', { type: 'text/vcard' });
                if (navigator.canShare({ files: [file] })) {
                    e.preventDefault();
                    await navigator.share({
                        files: [file],
                        title: 'Station Service Maison-Blanche S.A.',
                    });
                }
            } catch {
                // Fallback direct navigation
            }
        }
    };

    return (
        <>
            {/* Barre flottante mobile épurée & lumineuse */}
            <div className="fixed bottom-4 left-0 right-0 z-40 px-4 md:hidden pointer-events-none">
                <div className="mx-auto max-w-sm bg-white/95 backdrop-blur-xl border border-slate-300 rounded-full p-2 shadow-2xl shadow-slate-900/15 flex items-center justify-between gap-2 pointer-events-auto">
                    {/* QR Code Action */}
                    <button
                        onClick={() => setIsQrOpen(true)}
                        className="w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 flex items-center justify-center border border-slate-200/80 transition-all shrink-0 cursor-pointer"
                        title="Afficher le QR Code"
                        aria-label="Afficher le QR Code"
                    >
                        <QrCode size={19} />
                    </button>

                    {/* Primary Action Button: Ajouter aux contacts */}
                    <a
                        href="/api/vcard"
                        onClick={handleAddContact}
                        className="flex-1 h-11 rounded-full bg-orange-500 hover:bg-orange-600 active:scale-98 text-white font-semibold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all px-4 cursor-pointer"
                    >
                        <UserPlus size={17} />
                        <span>Ajouter aux contacts</span>
                    </a>
                </div>
            </div>

            {/* Modals */}
            <QrCodeModal isOpen={isQrOpen} onClose={() => setIsQrOpen(false)} />
        </>
    );
}
