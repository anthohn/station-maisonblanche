'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Coffee, Wrench, CreditCard, ShoppingBag, Store, Clock, HeartHandshake } from 'lucide-react';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ShopPage() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* --- HERO SECTION (Inspiration Tennis) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full h-[400px] md:h-[500px] rounded-4xlerflow-hidden mb-12 shadow-sm"
                >
                    {/* Placeholder pour la grande photo de l'intérieur */}
                    <div className="absolute inset-0 bg-slate-800">
                        <Image src="/devanture.jpeg" alt="Intérieur du Shop Maison Blanche" fill className="object-cover opacity-60" priority />
                        {/* Note: Décommentez la ligne ci-dessus quand vous aurez la photo */}
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full max-w-3xl">
                        <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                            <Store size={16} />
                            Épicerie Indépendante
                        </div>
                        <h1 className="text-4xl md:text-6xl font-medium text-white tracking-tight mb-4">
                            Bien plus qu'une simple station.
                        </h1>
                        <p className="text-lg text-white/80">
                            Faites le plein de bons produits. Notre shop vous accueille tous les jours pour vos courses d'appoint, vos envies gourmandes et le dépannage auto.
                        </p>
                    </div>
                </motion.div>

                {/* --- CHIFFRES CLÉS (Barre minimaliste) --- */}
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

                {/* --- GRILLE BENTO SHOP (3 Colonnes Tetris) --- */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >

                    {/* 1. Grande Carte : Produits Locaux (Haut Gauche - 2x2) */}
                    <motion.div variants={itemVariants} className="relative md:col-span-2 md:row-span-2 rounded-4xl overflow-hidden shadow-sm group bg-slate-200">
                        {/* <Image src="/produits-locaux.jpg" alt="Produits Locaux" fill className="object-cover transition-transform duration-700 group-hover:scale-105" /> */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/10" />
                        <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-2xl">
                            <HeartHandshake size={24} className="text-white" />
                        </div>
                        <div className="absolute bottom-0 left-0 p-8 md:p-10 text-white">
                            <h2 className="text-3xl md:text-4xl font-medium mb-3">Produits de notre région</h2>
                            <p className="text-white/80 max-w-md text-lg">
                                Nous soutenons les artisans et producteurs locaux. Retrouvez une sélection de vins de Genève, de miel, de fromages et de spécialités du terroir chancyen.
                            </p>
                        </div>
                    </motion.div>

                    {/* 2. Petite Carte : Café & Boulangerie (Haut Droite) */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-4xl shadow-sm flex flex-col justify-between border border-slate-100">
                        <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl">
                            <Coffee size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-1">Café & Viennoiseries</h3>
                            <p className="text-slate-500 text-sm">Le repaire des lève-tôt. Café chaud et croissants frais dès 6h00 pour bien démarrer la journée.</p>
                        </div>
                    </motion.div>

                    {/* 3. Petite Carte : Entretien Auto (Milieu Droite) */}
                    <motion.div variants={itemVariants} className="bg-[--color-brand-dark] p-8 rounded-4xl shadow-sm flex flex-col justify-between text-white group cursor-pointer hover:bg-slate-800 transition-colors">
                        <div className="bg-white/10 w-12 h-12 flex items-center justify-center rounded-2xl">
                            <Wrench size={24} className="text-orange-100" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium mb-1">Rayon Auto</h3>
                            <p className="text-orange-100 text-sm mb-3">Huiles, lave-glace, balais d'essuie-glace. L'essentiel pour la route.</p>
                            <span className="text-xs text-orange-400 font-medium group-hover:underline">→ En lien avec notre Garage</span>
                        </div>
                    </motion.div>

                    {/* 4. Petite Carte : Moyens de paiement (Bas Gauche - 1x1) */}
                    <motion.div variants={itemVariants} className="bg-orange-500 p-8 rounded-4xl shadow-sm flex flex-col justify-between text-white">
                        <div className="bg-white/20 w-12 h-12 flex items-center justify-center rounded-2xl">
                            <CreditCard size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium mb-1">Paiements acceptés</h3>
                            <p className="text-orange-50 text-sm">Cartes bancaires (Visa, Mastercard, Maestro), TWINT et espèces (CHF/EUR).</p>
                        </div>
                    </motion.div>

                    {/* 5. Carte Moyenne : Alimentation générale (Bas Droite - 2x1) */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 flex flex-col justify-center md:col-span-2">
                        <div className="flex items-start gap-6">
                            <div className="bg-slate-100 w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl">
                                <ShoppingBag size={28} className="text-[--color-brand-dark]" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-medium text-[--color-brand-dark] mb-2">Alimentation & Frais</h3>
                                <p className="text-slate-500">
                                    Un rayon frais bien approvisionné, des boissons froides, des snacks pour vos trajets, et tous les produits de première nécessité pour vous dépanner, même le dimanche.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                </motion.div>

            </div>
        </main>
    );
}