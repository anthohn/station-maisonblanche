import Link from 'next/link';
import Image from 'next/image';
import logo from '@/public/logo-station.png';
import { MapPin, Phone, Mail, Clock3, Facebook, Instagram, Building, ArrowRight, Droplets } from 'lucide-react';

export default function FooterStation() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Instagram, href: '#', label: 'Instagram' },
    ];

    const navLinks = [
        { name: 'Accueil', href: '/' },
        { name: 'Services', href: '/services' },
        { name: 'Le shop', href: '/shop' },
        { name: 'Le lavage', href: '/lavage' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <footer className="w-full bg-slate-50 text-slate-500 border-t border-slate-200">
            <div className="container mx-auto px-6 py-16 md:py-20 max-w-7xl relative z-10">

                {/* --- GRILLE MODULAIRE (style Bento clair) --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">

                    {/* COLONNE 1 : Identité & Synergie */}
                    <div className="flex flex-col gap-8">

                        {/* Module Identité de la Station */}
                        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <Image src={logo} alt="Station Maison Blanche Logo" width={60} height={60} />
                                <span className="text-xl font-medium tracking-tight text-[--color-brand-dark]">Station Maison Blanche</span>
                            </div>
                            <p className="text-slate-500 leading-relaxed max-w-sm mb-8">
                                Votre station-service Shell de proximité à <span className="text-orange-500 font-medium">Chancy</span>. Épicerie de qualité ouverte 7j/7, carburants et centre de lavage moderne.
                            </p>

                            {/* Réseaux sociaux */}
                            <div className="flex gap-4 pt-2">
                                {socialLinks.map((social) => (
                                    <Link
                                        key={social.label}
                                        href={social.href}
                                        className="group flex items-center justify-center size-10 rounded-xl bg-slate-100 hover:bg-orange-100 transition-colors"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <social.icon className="size-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Module Synergie : Cross-selling Garage (Gardé sombre pour trancher) */}
                        <div className="bg-[--color-brand-dark] p-8 rounded-4xlxt-white shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="bg-white/10 w-12 h-12 flex items-center justify-center rounded-2xl mb-5">
                                    <Building className="size-6 text-orange-100" />
                                </div>
                                <h4 className="text-xl font-medium mb-3">Besoin d'un mécanicien ?</h4>
                                <p className="text-white/80 mb-6 text-sm">Découvrez l'expertise de notre Garage partenaire, situé juste à côté.</p>
                            </div>
                            <Link href="https://garage-maisonblanche.ch" className="inline-flex items-center text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors" target="_blank">
                                Visiter le site du Garage <ArrowRight size={16} className="ml-1" />
                            </Link>
                        </div>
                    </div>

                    {/* COLONNE 2 : Informations et Horaires */}
                    <div className="flex flex-col gap-8 bg-white p-8 md:p-10 rounded-4xl border border-slate-100 shadow-sm lg:col-span-1">

                        {/* Infos Contact */}
                        <div>
                            <h4 className="text-xs font-semibold text-orange-500 mb-6 uppercase tracking-wider">Informations</h4>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-50 p-2 rounded-lg shrink-0 mt-[-4px]">
                                        <MapPin className="size-5 text-orange-500" />
                                    </div>
                                    <p className="text-slate-600 text-base leading-relaxed">Route de Chancy 500<br />1242 Chancy, Suisse</p>
                                </div>
                                <Link href="tel:+41216521361" className="flex items-center gap-4 text-slate-600 hover:text-orange-500 transition-colors text-base font-medium">
                                    <div className="bg-orange-50 p-2 rounded-lg shrink-0">
                                        <Phone className="size-5 text-orange-500" />
                                    </div>
                                    +41 21 652 13 61
                                </Link>
                                <Link href="mailto:contact@station-maisonblanche.ch" className="flex items-center gap-4 text-slate-600 hover:text-orange-500 transition-colors break-all">
                                    <div className="bg-orange-50 p-2 rounded-lg shrink-0">
                                        <Mail className="size-5 text-orange-500" />
                                    </div>
                                    contact@station-maisonblanche.ch
                                </Link>
                            </div>
                        </div>

                        {/* Horaires */}
                        <div className="pt-8 mt-8 border-t border-slate-100">
                            <h4 className="text-base font-medium text-[--color-brand-dark] mb-5 flex items-center gap-2">
                                <Clock3 size={18} className="text-orange-500" /> Horaires de la Station
                            </h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                                    <span className="text-slate-500">Lun – Dim (Shop)</span>
                                    <span className="font-medium text-[--color-brand-dark]">06:00 – 20:00</span>
                                </div>
                                <div className="flex justify-between items-center py-2.5 border-b border-slate-50">
                                    <span className="text-slate-500">Centre de Lavage</span>
                                    <span className="font-medium text-[--color-brand-dark]">06:00 – 22:00</span>
                                </div>
                                {/* Bloc Carburant */}
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mt-4 flex justify-between items-center">
                                    <span className="text-orange-800 font-medium">Carburant Shell</span>
                                    <span className="font-bold text-orange-600 text-base">24h/24</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLONNE 3 : Navigation & Partnership */}
                    <div className="flex flex-col gap-8">

                        {/* Module Navigation */}
                        <div className="bg-slate-100 p-8 rounded-4xl border border-slate-200">
                            <h4 className="text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">Notre Station</h4>
                            <ul className="space-y-4">
                                {navLinks.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-[--color-brand-dark] font-medium hover:text-orange-500 transition-colors text-base flex items-center justify-between group">
                                            {link.name} <ArrowRight size={16} className="text-slate-300 group-hover:text-orange-400 transition-colors" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Module Shell */}
                        <div className="bg-white border border-slate-100 shadow-sm rounded-4xl p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-yellow-50 p-2 rounded-xl">
                                    <Droplets size={24} className="text-yellow-500" />
                                </div>
                                <h4 className="text-base font-medium text-[--color-brand-dark]">Enseigne Agréée Shell</h4>
                            </div>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Nous vous garantissons des carburants de qualité supérieure et un service conforme aux standards internationaux.
                            </p>
                        </div>
                    </div>

                </div>

                {/* --- BARRE DE COPYRIGHT --- */}
                <div className="mt-16 md:mt-20 pt-10 border-t border-slate-200 text-xs text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-6">
                    <p>&copy; {currentYear} Station Maison Blanche SA. Tous droits réservés à Chancy (Genève).</p>
                    <div className="flex gap-6">
                        <Link href="/mentions-legales" className="hover:text-slate-600 transition-colors">Mentions Légales</Link>
                        <Link href="/politique-cookies" className="hover:text-slate-600 transition-colors">Politique de Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}