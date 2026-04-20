'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Coffee, CreditCard, ShoppingBag, Store, HeartHandshake, MapPin, Sun } from 'lucide-react';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* --- HERO SECTION --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full h-[400px] md:h-[500px] rounded-[2rem] overflow-hidden mb-12 shadow-sm group"
                >
                    <div className="absolute inset-0">
                        <Image src="/shop.jpg" alt="Extérieur du Shop Maison Blanche" fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                    </div>
                    <div className="absolute inset-0 bg-black/10 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full max-w-3xl z-10">
                        <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                            <Store size={16} />
                            Épicerie Indépendante
                        </div>
                        <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tight mb-4">
                            Bien plus qu'une simple station.
                        </h1>
                        <p className="text-lg text-white/90">
                            Faites le plein de bons produits. Notre shop vous accueille tous les jours pour vos courses d'appoint, vos envies gourmandes et le dépannage auto.
                        </p>
                    </div>
                </motion.div>

                {/* --- CHIFFRES CLÉS --- */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap justify-between md:justify-start gap-8 md:gap-24 mb-20 px-4 md:px-8 border-b border-slate-200 pb-12"
                >
                    <div>
                        <p className="text-3xl md:text-4xl font-medium text-[--color-brand-dark]">7j/7</p>
                        <p className="text-sm text-slate-500 mt-1">Ouvert tous les jours</p>
                    </div>
                    <div>
                        <p className="text-3xl md:text-4xl font-medium text-[--color-brand-dark]">06h-20h</p>
                        <p className="text-sm text-slate-500 mt-1">Horaires extra-larges</p>
                    </div>
                    <div>
                        <p className="text-3xl md:text-4xl font-medium text-[--color-brand-dark]">100%</p>
                        <p className="text-sm text-slate-500 mt-1">Indépendant & Local</p>
                    </div>
                </motion.div>

                {/* --- GRILLE BENTO SHOP (3 colonnes x 4 rangées) --- */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >

                    {/* 1. Grande Carte : Fleurs & Région (Haut Gauche - 2x2) */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 md:col-span-2 md:row-span-2 flex flex-col overflow-hidden group">
                        <div className="relative h-[55%] w-full overflow-hidden shrink-0">
                            <Image src="/IMG_6698.JPEG" alt="Plantes et fleurs à la Station" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-8 md:px-10 md:py-8 flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-orange-50 w-12 h-12 flex items-center justify-center rounded-2xl transition-colors group-hover:bg-orange-100">
                                    <HeartHandshake size={24} className="text-orange-500" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-medium text-[--color-brand-dark]">Boutique & Fleurs</h2>
                            </div>
                            <p className="text-slate-500 max-w-md text-base leading-relaxed">
                                Un accueil chaleureux et des produits sélectionnés pour vous. Retrouvez nos compositions florales de saison, idéales pour offrir ou décorer, ainsi qu'une sélection de spécialités locales.
                            </p>
                        </div>
                    </motion.div>

                    {/* 2. Petite Carte : Café & Boulangerie (Haut Droite) */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-sm flex flex-col justify-between border border-slate-100 group">
                        <div className="bg-orange-50 w-12 h-12 flex items-center justify-center rounded-2xl transition-colors group-hover:bg-orange-100">
                            <Coffee size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-2">Café & Viennoiseries</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Le repaire des lève-tôt. Café chaud et croissants frais dès 6h00.</p>
                        </div>
                    </motion.div>

                    {/* 3. Petite Carte : Moyens de paiement (Milieu Droite) */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-sm flex flex-col justify-between border border-slate-100 group">
                        <div className="bg-slate-50 w-12 h-12 flex items-center justify-center rounded-2xl transition-colors group-hover:bg-slate-100">
                            <CreditCard size={24} className="text-slate-600" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-2">Paiements acceptés</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Cartes bancaires, TWINT et espèces (CHF/EUR).</p>
                        </div>
                    </motion.div>

                    {/* 4. Nouvelle Carte Verticale : La Terrasse (Bas Gauche - 1x2) */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 md:col-span-1 md:row-span-2 flex flex-col overflow-hidden group">
                        {/* Format Portrait : la photo prend la moitié de la hauteur */}
                        <div className="relative h-[50%] w-full overflow-hidden shrink-0">
                            <Image src="/terrasse.jpg" alt="Terrasse ensoleillée Mövenpick" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-8 flex-1 flex flex-col justify-center">
                            <div className="bg-orange-50 w-12 h-12 flex items-center justify-center rounded-2xl mb-4 transition-colors group-hover:bg-orange-100">
                                <Sun size={24} className="text-orange-500" />
                            </div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-2">Espace Détente</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Profitez d'une pause ensoleillée. Installez-vous sur notre terrasse pour déguster une glace Mövenpick ou un café frais.
                            </p>
                        </div>
                    </motion.div>

                    {/* 5. Grande Carte Horizontale : Bunker Dépannage (Bas Milieu/Droite - 2x1) */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 md:col-span-2 flex flex-col sm:flex-row overflow-hidden group">
                        <div className="relative h-48 sm:h-full sm:w-1/3 overflow-hidden shrink-0">
                            <Image src="/bunker 1.JPG" alt="Dépannage gaz et charbon" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-8 md:px-10 flex-1 flex flex-col justify-center">
                            <h3 className="text-xl md:text-2xl font-medium text-[--color-brand-dark] mb-3">Gaz, Gril & Auto</h3>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                Le dépannage par excellence. Charbon de bois pour l'été, bouteilles Vitogaz, lave-glace et huiles. L'essentiel, toujours disponible.
                            </p>
                        </div>
                    </motion.div>

                    {/* 6. Grande Carte Horizontale : Épicerie générale (Tout en bas à droite - 2x1) */}
                    <motion.div variants={itemVariants} className="bg-white p-8 md:px-10 rounded-[2rem] shadow-sm border border-slate-100 md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                        <div className="bg-orange-50 w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl transition-colors group-hover:bg-orange-100">
                            <ShoppingBag size={28} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-medium text-[--color-brand-dark] mb-2">Épicerie & Frais</h3>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                Un rayon frais bien approvisionné, des snacks et des boissons froides pour vos trajets. Tous les produits de première nécessité pour vous dépanner.
                            </p>
                        </div>
                    </motion.div>

                </motion.div>

                {/* --- CTA FINAL --- */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    <div className="max-w-xl text-center md:text-left">
                        <h3 className="text-3xl font-medium text-[--color-brand-dark] mb-3">Une petite faim ?</h3>
                        <p className="text-slate-500 text-lg">Passez faire un tour en boutique. Il y a toujours un café chaud et un sourire qui vous attendent.</p>
                    </div>
                    <a
                        href="https://maps.app.goo.gl/WKU8p8fe4wCEhn2t6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-medium hover:bg-orange-600 transition-colors shrink-0"
                    >
                        <MapPin size={18} />
                        Itinéraire vers le Shop
                    </a>
                </motion.section>

            </div>
        </main>
    );
}