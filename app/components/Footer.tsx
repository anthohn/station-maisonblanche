import Link from 'next/link';
import { MapPin, Phone, Mail, Clock3, ArrowRight, Facebook, Instagram } from 'lucide-react';

export default function FooterStation() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-slate-50 text-slate-500 border-t border-slate-200">
            <div className="container mx-auto px-6 py-16 md:py-20 max-w-7xl relative z-10">

                {/* --- GRILLE MODULAIRE --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">

                    {/* COLONNE 1 : Adresse Orange */}
                    <div className="bg-orange-500 p-8 md:p-10 rounded-[2rem] shadow-sm flex flex-col justify-between text-white">
                        <div>
                            <div className="bg-white/20 w-12 h-12 flex items-center justify-center rounded-2xl mb-6">
                                <MapPin size={24} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-medium mb-4">Adresse</h3>
                            <p className="text-orange-50 text-base leading-relaxed mb-8">
                                Route de Chancy 500<br />
                                1242 Chancy<br />
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
                                <a href="tel:+41216521361" className="flex items-center gap-4 text-slate-600 hover:text-orange-500 transition-colors">
                                    <div className="bg-orange-50 p-2.5 rounded-xl shrink-0"><Phone className="size-5 text-orange-500" /></div>
                                    <span className="font-medium text-base">+41 21 652 13 61</span>
                                </a>
                                <a href="mailto:contact@station-maisonblanche.ch" className="flex items-center gap-4 text-slate-600 hover:text-orange-500 transition-colors">
                                    <div className="bg-orange-50 p-2.5 rounded-xl shrink-0"><Mail className="size-5 text-orange-500" /></div>
                                    <span className="font-medium truncate text-base">contact@station-maisonblanche.ch</span>
                                </a>
                            </div>
                        </div>

                        {/* Réseaux sociaux */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-sm text-slate-500 mb-4">Rejoignez-nous</p>
                            <div className="flex gap-3">
                                <a href="https://www.facebook.com/profile.php?id=61580606409294" target="_blank" rel="noopener noreferrer" className="bg-orange-50 p-3.5 rounded-xl text-slate-600 hover:text-orange-500 hover:bg-orange-50 transition-colors shadow-xs">
                                    <Facebook size={20} className="text-orange-500" />
                                </a>
                                <a href="#" className="bg-orange-50 p-3.5 rounded-xl text-slate-600 hover:text-orange-500 hover:bg-orange-50 transition-colors shadow-xs">
                                    <Instagram size={20} className="text-orange-500" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* COLONNE 3 : Horaires & Navigation */}
                    <div className="flex flex-col gap-6">

                        {/* Bloc Horaires */}
                        <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                {/* <Clock3 size={18} className="text-[--color-brand-dark]" /> */}
                                <h3 className="text-lg font-medium text-[--color-brand-dark]">Horaires</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-slate-500">Shop (Lun–Ven)</span>
                                    <span className="font-medium text-slate-800">06:00 – 20:00</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                    <span className="text-slate-500">Shop (Sam–Dim)</span>
                                    <span className="font-medium text-slate-800">07:30 – 20:00</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-slate-500">Lavage</span>
                                    <span className="font-medium text-slate-800">06:00 – 22:00</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-slate-500">Carburant</span>
                                    <span className="font-medium text-orange-400">24h/24</span>
                                </div>
                            </div>
                        </div>

                        {/* Bloc Navigation (Clair et lisible) */}
                        <div className="bg-[--color-brand-dark] px-8 py-6 rounded-[2rem] shadow-sm flex-1 flex flex-col justify-center">
                            <div className="flex justify-between items-center">
                                <Link href="/services" className="text-slate-500 hover:text-orange-500 transition-colors text-sm font-medium">Services</Link>
                                <Link href="/shop" className="text-slate-500 hover:text-orange-500 transition-colors text-sm font-medium">Le Shop</Link>
                                <Link href="/lavage" className="text-slate-500 hover:text-orange-500 transition-colors text-sm font-medium">Lavage</Link>
                                <Link href="/contact" className="text-slate-500 hover:text-orange-500 transition-colors text-sm font-medium">Contact</Link>
                            </div>
                        </div>
                    </div>

                </div>

                {/* --- BARRE DE COPYRIGHT --- */}
                <div className="mt-16 pt-8 border-t border-slate-200 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p>© {currentYear} Station Maison Blanche SA. Tous droits réservés à Chancy (Genève).</p>
                    <div className="flex gap-6">
                        <Link href="/mentions-legales" className="hover:text-slate-600 transition-colors">Mentions Légales</Link>
                    </div>
                </div>
            </div>
        </footer >
    );
}