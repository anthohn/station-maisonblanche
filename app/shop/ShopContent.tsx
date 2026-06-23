'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Coffee, CreditCard, ShoppingBag, HeartHandshake, MapPin, Sun, Icon } from 'lucide-react';

// soccerBall icon from @lucide/lab — copied directly, no extra install needed
const soccerBallIcon = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M11.9 6.7s-3 1.3-5 3.6c0 0 0 3.6 1.9 5.9 0 0 3.1.7 6.2 0 0 0 1.9-2.3 1.9-5.9 0 .1-2-2.3-5-3.6", key: "1mg18b" }],
    ["path", { d: "M11.9 6.7V2", key: "1t12cm" }],
    ["path", { d: "M16.9 10.4s3-1.4 4.5-1.6", key: "8aq2q9" }],
    ["path", { d: "M15 16.3s1.9 2.7 2.9 3.7", key: "volqrc" }],
    ["path", { d: "M8.8 16.3S6.9 19 6 20", key: "1atvv1" }],
    ["path", { d: "M2.6 8.7C4 9 7 10.4 7 10.4", key: "1uixp3" }],
] as Parameters<typeof Icon>[0]['iconNode'];

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ShopContent() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* --- HEADER SIMPLE (Aligné avec les autres pages) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-12"
                >
                    <h1 className="text-4xl md:text-6xl font-medium text-[--color-brand-dark] tracking-tight mb-6">
                        Bien plus qu'une <span className="text-orange-500">simple station.</span>
                    </h1>
                    <p className="text-xl text-slate-500 leading-relaxed">
                        Faites le plein de bons produits. Notre shop vous accueille tous les jours pour vos courses d'appoint, vos envies gourmandes et le dépannage auto.
                    </p>
                </motion.div>

                {/* --- CHIFFRES CLÉS --- */}
                {/* <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-wrap justify-between md:justify-start gap-8 md:gap-24 mb-16 px-4"
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
                </motion.div> */}

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
                                Un accueil chaleureux et des produits sélectionnés pour vous. Retrouvez nos compositions florales de saison, idéales pour offrir ou décorer, ainsi qu'une sélection de spécialités locales.
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
                            <Image src="/terrasse.jpg" alt="Terrasse ensoleillée avec glaces Mövenpick à la Station-Service Maison-Blanche, Chancy" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-6 flex flex-col justify-center">
                            <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl mb-3 transition-colors group-hover:bg-orange-100">
                                <Sun size={24} className="text-orange-500" />
                            </div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-2">Espace Détente</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                Profitez d'une pause ensoleillée. Installez-vous sur notre terrasse pour déguster une glace Mövenpick ou un café frais.
                            </p>
                        </div>
                    </motion.div>

                    {/* 5. Carte Gaz & Dépannage */}
                    <motion.div variants={itemVariants} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 md:col-span-2 flex flex-col sm:flex-row overflow-hidden group">
                        <div className="relative h-48 sm:h-full sm:w-1/3 overflow-hidden shrink-0">
                            <Image src="/bunker 1.JPG" alt="Dépannage gaz bouteilles Vitogaz et charbon de bois, Station-Service Maison-Blanche Chancy" fill className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="p-6 md:px-10 flex-1 flex flex-col justify-center">
                            <h3 className="text-xl md:text-2xl font-medium text-[--color-brand-dark] mb-2">Gaz, Gril & Auto</h3>
                            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                Le dépannage par excellence. Charbon de bois pour l'été, bouteilles Vitogaz, lave-glace et huiles. L'essentiel, toujours disponible.
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
                                Un rayon frais bien approvisionné, des snacks et des boissons froides pour vos trajets. Tous les produits de première nécessité pour vous dépanner.
                            </p>
                        </div>
                    </motion.div>

                </motion.div>

                {/* --- SECTION SPÉCIALE CDM 2026 --- */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-12 md:mt-16"
                >
                    {/* Grille principale : 1 colonne mobile, 2 colonnes desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start">

                        {/* COLONNE GAUCHE : bloc texte + photo paysage empilés */}
                        <div className="flex flex-col gap-6">

                            {/* Bloc texte */}
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="bg-emerald-100 w-14 h-14 flex items-center justify-center rounded-2xl shrink-0">
                                        <Icon iconNode={soccerBallIcon} size={28} className="text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-emerald-600 text-sm font-semibold uppercase tracking-widest mb-1">Coupe du Monde 2026</p>
                                        <h2 className="text-3xl md:text-4xl font-medium text-[--color-brand-dark] tracking-tight">
                                            Plateaux apéro <span className="text-emerald-600">stade de foot</span>
                                        </h2>
                                    </div>
                                </div>
                                <p className="text-lg text-slate-500 leading-relaxed">
                                    Pour animer vos soirées foot, nous avons composé des plateaux apéro sur le thème du stade de foot — idéals pour regarder les matchs entre amis ou en famille !
                                </p>
                                <div className="mt-5">
                                    <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-5 py-3 rounded-2xl text-sm font-medium">
                                        ✅ Disponibles en boutique
                                    </div>
                                </div>
                            </div>

                            {/* Photo PAYSAGE — 1600x1050 */}
                            <motion.div
                                variants={itemVariants}
                                className="relative rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group"
                            >
                                <Image
                                    src="/cdm-2026/PHOTO-2026-06-13-19-34-32.jpg"
                                    alt="Plateau apéro stade de foot Coupe du Monde 2026 - Station-Service Maison-Blanche"
                                    width={1600}
                                    height={1050}
                                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/50 to-transparent">
                                    <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/30">
                                        ⚽ Plateau Foot
                                    </span>
                                </div>
                            </motion.div>

                        </div>

                        {/* COLONNE DROITE : photo portrait — cachée sur mobile (déjà visible en pleine largeur via la colonne gauche empilée) */}
                        <motion.div
                            variants={itemVariants}
                            className="relative rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 group hidden md:block"
                        >
                            <Image
                                src="/cdm-2026/PHOTO-2026-06-13-19-34-32 (1).jpg"
                                alt="Présentoir plateaux apéro football avec boissons et snacks - Station-Service Maison-Blanche"
                                width={779}
                                height={1600}
                                className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/50 to-transparent">
                                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-xl border border-white/30">
                                    🏟️ Ambiance boutique
                                </span>
                            </div>
                        </motion.div>

                    </div>

                </motion.section>

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