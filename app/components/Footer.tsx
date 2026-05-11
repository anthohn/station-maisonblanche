"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail, ArrowRight, Facebook, Instagram } from 'lucide-react';
export default function FooterStation() {
    const currentYear = new Date().getFullYear();
    const pathname = usePathname();
    return (
        <footer className="w-full bg-slate-50 text-slate-500">
            <div className="container mx-auto px-6 py-16 md:py-20 max-w-7xl relative z-10">

                {/* --- GRILLE MODULAIRE --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">

                    {/* COLONNE 1 : Adresse Orange */}
                    <div className="bg-orange-600 p-8 md:p-10 rounded-[2rem] shadow-sm flex flex-col justify-between text-white">
                        <div>
                            <div className="bg-white/20 w-12 h-12 flex items-center justify-center rounded-2xl mb-6">
                                <MapPin size={24} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-medium mb-4">Adresse</h3>
                            <p className="text-orange-50 text-base leading-relaxed mb-8">
                                Route de Chancy 500<br />
                                1284 Chancy<br />
                                Suisse
                            </p>
                        </div>
                        <a
                            href="https://maps.app.goo.gl/WKU8p8fe4wCEhn2t6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-6 py-3.5 rounded-xl font-medium hover:bg-orange-50 transition-colors w-full"
                        >
                            Ouvrir dans Maps <ArrowRight size={18} />
                        </a>
                    </div>

                    {/* COLONNE 2 : Contact & Réseaux Sociaux */}
                    <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-[--color-brand-dark] mb-6">Nous contacter</h3>
                            <div className="space-y-5">
                                <a href="tel:+41227561522" className="flex items-center gap-4 text-slate-600 hover:text-orange-500 transition-colors">
                                    <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl shrink-0"><Phone className="size-5 text-orange-500" /></div>
                                    <span className="font-medium text-base">+41 22 756 15 22</span>
                                </a>
                                <a href="mailto:contact@station-maisonblanche.ch" className="flex items-center gap-4 text-slate-600 hover:text-orange-500 transition-colors">
                                    <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl shrink-0"><Mail className="size-5 text-orange-500" /></div>
                                    <span className="font-medium truncate text-base">contact@station-maisonblanche.ch</span>
                                </a>
                            </div>
                        </div>

                        {/* Réseaux sociaux */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-sm text-slate-500 mb-4">Rejoignez-nous</p>
                            <div className="flex gap-3">
                                <a href="https://www.facebook.com/profile.php?id=61580606409294" target="_blank" rel="noopener noreferrer" aria-label="Notre page Facebook" className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl text-slate-600 transition-transform hover:scale-105">
                                    <Facebook size={20} className="text-orange-500" />
                                </a>
                                <a href="https://www.instagram.com/station_maisonblanche" target="_blank" rel="noopener noreferrer" aria-label="Notre page Instagram" className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl text-slate-600 transition-transform hover:scale-105">
                                    <Instagram size={20} className="text-orange-500" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* COLONNE 3 : Horaires & Navigation */}
                    <div className="flex flex-col gap-6">

                        {/* Bloc Horaires (100% Été) */}
                        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <h3 className="text-lg font-medium text-[--color-brand-dark]">Horaires</h3>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-slate-500">Shop (Lun–Ven)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Été</span>
                                        <span className="font-medium text-slate-800">06:00 – 21:00</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-slate-500">Shop (Samedi)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Été</span>
                                        <span className="font-medium text-slate-800">07:00 – 21:00</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-slate-200 pb-3 mb-2">
                                    <span className="text-slate-500">Shop (Dimanche)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-orange-100 text-orange-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Été</span>
                                        <span className="font-medium text-slate-800">07:30 – 21:00</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-slate-500">Lavage</span>
                                    <span className="font-medium text-slate-800">06:00 – 22:00</span>
                                </div>
                                <div className="flex justify-between items-center py-1">
                                    <span className="text-slate-500">Carburant</span>
                                    <span className="font-medium text-orange-500">24h/24</span>
                                </div>
                            </div>
                        </div>

                        {/* Bloc Navigation */}
                        <div className="bg-white px-8 py-6 rounded-[2rem] border border-slate-100 shadow-sm flex-1 flex flex-col justify-center">
                            <div className="flex flex-wrap justify-between items-center gap-2">
                                <Link href="/" className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-orange-500' : 'text-slate-600 hover:text-orange-500'}`}>Accueil</Link>
                                <Link href="/services" className={`text-sm font-medium transition-colors ${pathname === '/services' ? 'text-orange-500' : 'text-slate-600 hover:text-orange-500'}`}>Services</Link>
                                <Link href="/shop" className={`text-sm font-medium transition-colors ${pathname === '/shop' ? 'text-orange-500' : 'text-slate-600 hover:text-orange-500'}`}>Shop</Link>
                                <Link href="/lavage" className={`text-sm font-medium transition-colors ${pathname === '/lavage' ? 'text-orange-500' : 'text-slate-600 hover:text-orange-500'}`}>Lavage</Link>
                                <Link href="/contact" className={`text-sm font-medium transition-colors ${pathname === '/contact' ? 'text-orange-500' : 'text-slate-600 hover:text-orange-500'}`}>Contact</Link>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- BARRE DE COPYRIGHT --- */}
                <div className="mt-16 pt-8 border-t border-slate-200 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
                        <p>© {currentYear} Station-Service Maison-Blanche SA. Tous droits réservés à Chancy (Genève).</p>
                        <span className="hidden sm:inline text-slate-300">|</span>
                        <p>Réalisé par <a href="https://anthony-hohn.ch" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors font-medium">Anthony Höhn</a></p>
                    </div>
                    <div className="flex gap-6">
                        <Link href="/mentions-legales" className={`hover:text-slate-600 transition-colors ${pathname === '/mentions-legales' ? 'text-orange-500' : ''}`}>Mentions Légales</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}