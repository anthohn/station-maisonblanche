'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Coffee, CreditCard, ShoppingBag, HeartHandshake, MapPin, Sun, ArrowRight } from 'lucide-react';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ShopContent() {
    return (
        <main className="min-h-screen bg-slate-50 pt-20 sm:pt-24 md:pt-24 pb-24">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* --- HEADER SIMPLE (Aligné avec les autres pages) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-medium text-[--color-brand-dark] tracking-tight mb-6">
                        Bien plus qu&apos;une <span className="text-orange-500">simple station.</span>
                    </h1>
                    <p className="text-xl text-slate-500 leading-relaxed">
                        Faites le plein de bons produits. Notre shop vous accueille tous les jours pour vos courses d&apos;appoint, vos envies gourmandes et le dépannage auto.
                    </p>
                </motion.div>

                {/* --- ARRIVAGE EXCLUSIF : CHIPS ZWEIFEL AROMAT --- */}
                <motion.section
                    id="zweifel"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1 }}
                    className="mb-14 scroll-mt-28 bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 rounded-[2rem] p-6 sm:p-8 md:py-7 md:px-10 text-white shadow-xl shadow-orange-500/15 relative overflow-hidden"
                >
                    {/* Effets lumineux subtils en arrière-plan */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                    <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-300/20 rounded-full blur-2xl pointer-events-none -mb-20" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-10">
                        {/* Colonne Gauche : Présentation */}
                        <div className="flex-1 flex flex-col justify-center">
                            {/* Badge Édition Limitée avec le logo officiel Zweifel */}
                            <div className="mb-3">
                                <span className="bg-white/20 backdrop-blur-md text-white text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full inline-flex items-center gap-2 shadow-xs border border-white/25">
                                    <Image
                                        src="/zweifel-logo.svg"
                                        alt="Logo Zweifel"
                                        width={18}
                                        height={18}
                                        className="rounded-full object-contain shrink-0"
                                    />
                                    <span>Édition Limitée</span>
                                </span>
                            </div>

                            {/* Titre percutant */}
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 leading-[1.15]">
                                Les chips Zweifel « Aromat » sont de retour !
                            </h2>

                            {/* Description */}
                            <p className="text-orange-50 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                                C&apos;est le grand retour du classique le plus attendu : l&apos;association culte des chips croustillantes Zweifel et de la saveur inimitable du Knorr Aromat. Retrouvez-les dès maintenant en exclusivité dans votre shop à Chancy !
                            </p>

                            {/* Action : Itinéraire vers la boutique */}
                            <div>
                                <a
                                    href="https://maps.app.goo.gl/WKU8p8fe4wCEhn2t6"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 active:scale-98 font-semibold text-sm px-5 py-2.5 sm:py-3 rounded-xl shadow-lg transition-all"
                                >
                                    <MapPin size={16} />
                                    <span>Venir au Shop (Chancy)</span>
                                    <ArrowRight size={15} />
                                </a>
                            </div>
                        </div>

                        {/* Colonne Droite : Visuel compact */}
                        <div className="w-full lg:w-auto flex justify-center shrink-0">
                            <div className="relative w-full max-w-xs sm:w-[280px] md:w-[320px] h-[220px] sm:h-[260px] md:h-[280px] rounded-2xl overflow-hidden shadow-xl border-2 sm:border-4 border-white/25 group">
                                <Image
                                    src="/zweifel.jpeg"
                                    alt="Chips Zweifel Aromat en rayon au shop de la Station-Service Maison-Blanche à Chancy"
                                    fill
                                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 320px"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* --- GRILLE BENTO SHOP (3 colonnes x 4 rangées) --- */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[240px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >

                    {/* 1. Grande Carte : Fleurs & Région (Haut Gauche - 2x2) */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 md:col-span-2 md:row-span-2 flex flex-col overflow-hidden group">
                        <div className="relative h-52 md:h-[55%] w-full overflow-hidden shrink-0">
                            <Image src="/IMG_6700.JPEG" alt="Fleurs et plantes de saison en vente à la Station-Service Maison-Blanche, Chancy" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-6 md:px-10 md:py-8 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl shrink-0 transition-colors group-hover:bg-orange-100">
                                    <HeartHandshake size={24} className="text-orange-500" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-medium text-[--color-brand-dark]">Boutique & Fleurs</h2>
                            </div>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                Un accueil chaleureux et des produits sélectionnés pour vous. Retrouvez nos compositions florales de saison et locales, idéales pour offrir ou vous faire plaisir.
                            </p>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed mt-2">
                                Vous avez la possibilité de réserver votre bouquet et de commander chez nous votre composition personnalisée.
                            </p>
                        </div>
                    </motion.div>

                    {/* 2. Petite Carte : Café & Boulangerie */}
                    <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-row md:flex-col items-center md:items-start md:justify-between gap-4 border border-slate-100 group">
                        <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl shrink-0 transition-colors group-hover:bg-orange-100">
                            <Coffee size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-1">Café & Viennoiseries</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Le repaire des lève-tôt. Café chaud et croissants frais dès 06h00.</p>
                        </div>
                    </motion.div>

                    {/* 3. Petite Carte : Moyens de paiement */}
                    <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] shadow-sm flex flex-row md:flex-col items-center md:items-start md:justify-between gap-4 border border-slate-100 group">
                        <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl shrink-0">
                            <CreditCard size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-1">Paiements acceptés</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">Cartes bancaires, TWINT et espèces (CHF/EUR).</p>
                        </div>
                    </motion.div>

                    {/* 4. Carte Terrasse (Bas Gauche - 1x2 sur desktop) */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 md:col-span-1 md:row-span-2 flex flex-col overflow-hidden group">
                        <div className="relative h-48 md:h-[50%] w-full overflow-hidden shrink-0">
                            <Image src="/terrasse.jpg" alt="Terrasse agréable pour déguster glaces, viennoiseries et café à la Station-Service Maison-Blanche, Chancy" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                            <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl mb-3 transition-colors group-hover:bg-orange-100">
                                <Sun size={24} className="text-orange-500" />
                            </div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-2">Espace Détente</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Pour une pause agréable, installez-vous sur notre terrasse. Dégustez une glace, un café frais, votre sandwich ou une viennoiserie.
                            </p>
                        </div>
                    </motion.div>

                    {/* 5. Carte Gaz & Dépannage */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 md:col-span-2 flex flex-col sm:flex-row overflow-hidden group">
                        <div className="relative h-48 sm:h-full sm:w-1/3 overflow-hidden shrink-0">
                            <Image src="/bunker 1.JPG" alt="Dépannage gaz bouteilles Vitogaz et charbon de bois, Station-Service Maison-Blanche Chancy" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-6 md:px-10 flex-1 flex flex-col justify-center">
                            <h3 className="text-xl md:text-2xl font-medium text-[--color-brand-dark] mb-2">Gaz & Auto-Shop</h3>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                Votre boutique par excellence. Charbon de bois, bouteilles de gaz, lave-glace et huiles Shell. L&apos;essentiel, toujours disponible.
                            </p>
                        </div>
                    </motion.div>

                    {/* 6. Grande Carte Horizontale : Épicerie générale (Tout en bas à droite - 2x1) */}
                    <motion.div variants={itemVariants} className="bg-white p-8 md:px-10 rounded-[2rem] shadow-sm border border-slate-100 md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center gap-6 group">
                        <div className="bg-orange-100 w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl transition-colors group-hover:bg-orange-100">
                            <ShoppingBag size={28} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl md:text-2xl font-medium text-[--color-brand-dark] mb-2">Épicerie & Frais</h3>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                Un rayon frais bien approvisionné, des snacks et des boissons. Tous les produits de première nécessité à portée de main, proches de chez vous.
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