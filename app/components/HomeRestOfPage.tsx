'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBasket, Fuel, Droplets, ArrowRight, Wrench, MapPin } from 'lucide-react';

export default function HomeRestOfPage() {
    return (
        <div className="bg-slate-50 pb-24">

            {/* --- 1. LE TRIO BENTO (Les Piliers) --- */}
            <section className="container mx-auto px-6 max-w-7xl pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <h2 className="text-3xl md:text-5xl font-medium text-slate-900 tracking-tight mb-4">
                        L'essentiel, <span className="text-orange-500">sans compromis.</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl">
                        Explorez nos installations conçues pour vous faire gagner du temps au quotidien.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Carte 1 : Le Shop */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="relative h-[380px] rounded-[2rem] overflow-hidden group shadow-sm"
                    >
                        <Image src="/devanture.jpeg" alt="Devanture du shop épicerie Station Maison-Blanche à Chancy, Genève" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                        <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                            <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl">
                                <ShoppingBasket size={24} className="text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-medium text-white mb-2">Le Shop</h3>
                                <p className="text-white/80 text-sm mb-4 line-clamp-2">Épicerie, produits frais et locaux, café chaud. Ouvert de 6h à 20h tous les jours.</p>
                                <Link href="/shop" className="inline-flex items-center text-sm font-medium text-white hover:text-orange-500 transition-colors">
                                    Découvrir les rayons <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Carte 2 : Carburant */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="relative h-[380px] rounded-[2rem] overflow-hidden group shadow-sm text-white"
                    >
                        <Image src="/pompes0.jpg" alt="Pompes à carburant Shell V-Power et diesel, Station Maison-Blanche Chancy" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                        <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                            <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl">
                                <Fuel size={24} className="text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-medium mb-2">Carburant Shell</h3>
                                <p className="text-white/80 text-sm mb-4">La qualité Shell garantie, disponible 24h/24 et 7j/7 via nos terminaux de paiement automatiques.</p>
                                <Link href="/services" className="inline-flex items-center text-sm font-medium text-white hover:text-orange-500 transition-colors">
                                    Voir nos carburants <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Carte 3 : Lavage */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="relative h-[380px] rounded-[2rem] overflow-hidden group shadow-sm text-white"
                    >
                        <Image src="/lavage.jpeg" alt="Pistes de lavage haute pression en libre-service, Station Maison-Blanche Chancy" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

                        <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                            <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl">
                                <Droplets size={24} className="text-orange-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-medium mb-2">Lavage Auto</h3>
                                <p className="text-white/80 text-sm mb-4">Pistes haute pression et aspirateurs industriels pour faire briller votre véhicule en quelques minutes.</p>
                                <Link href="/lavage" className="inline-flex items-center text-sm font-medium text-white hover:text-orange-500 transition-colors">
                                    Voir les installations <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* --- 2. BANDEAU SYNERGIE GARAGE (Design Premium) --- */}
            <section className="container mx-auto px-6 max-w-7xl mt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-slate-100 rounded-[2rem] border border-slate-200 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm"
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="bg-white w-16 h-16 md:w-20 md:h-20 shrink-0 flex items-center justify-center rounded-2xl shadow-sm">
                            <Wrench size={32} className="text-orange-500" />
                        </div>
                        <div>
                            <p className="text-orange-500 font-medium text-sm tracking-wide uppercase mb-2">Le combo parfait</p>
                            <h3 className="text-2xl md:text-3xl font-medium text-slate-900 mb-2">
                                Station + Garage Maison Blanche
                            </h3>
                            <p className="text-slate-500 max-w-xl text-base leading-relaxed">
                                Au-delà du carburant, confiez-nous l'entretien complet de votre véhicule. Révisions, pneus, mécanique : découvrez l'expertise de notre garage multimarques attenant.
                            </p>
                        </div>
                    </div>
                    <a
                        href="https://garage-maisonblanche.ch"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-800 transition-colors w-full md:w-auto shadow-md"
                    >
                        Visiter le Garage <ArrowRight size={18} />
                    </a>
                </motion.div>
            </section>

            {/* --- 3. CALL TO ACTION EXPRESS --- */}
            <section className="container mx-auto px-6 max-w-7xl mt-24 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-orange-50 rounded-[2rem] p-12 md:p-20 shadow-sm"
                >
                    <h2 className="text-3xl md:text-4xl font-medium text-slate-900 mb-4">
                        Prêt à faire un arrêt ?
                    </h2>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                        Passez nous voir à Chancy. Un service rapide, de qualité, et toujours avec le sourire.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://maps.app.goo.gl/WKU8p8fe4wCEhn2t6"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-sm"
                        >
                            <MapPin size={18} />
                            Lancer l'itinéraire
                        </a>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-medium hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
                        >
                            Voir les horaires
                        </Link>
                    </div>
                </motion.div>
            </section>

        </div>
    );
}