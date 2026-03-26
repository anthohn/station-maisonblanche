'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Droplets, Sparkles, HandCoins, Clock3, Zap, MapPin } from 'lucide-react';
import pompes0 from '@/public/pompes0.jpg';


// Animation standard pour les éléments de la grille
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function LavagePage() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* --- HEADER SIMPLE --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-16"
                >
                    <h1 className="text-4xl md:text-6xl font-medium text-[--color-brand-dark] tracking-tight mb-6">
                        Faites briller votre véhicule <span className="text-orange-500">en quelques minutes.</span>
                    </h1>
                    <p className="text-xl text-slate-500">
                        Pistes haute pression professionnelles et aspirateurs puissants. Tout l'équipement nécessaire pour un nettoyage impeccable, intérieur comme extérieur.
                    </p>
                </motion.div>

                {/* --- GRILLE BENTO LAVAGE (CORRIGÉE : 3 Colonnes, placement Tetris) --- */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >

                    {/* 1. Grande Carte : Pistes HP (Haut Gauche) */}
                    <motion.div variants={itemVariants} className="relative md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-sm group">
                        <Image
                            src={pompes0}
                            alt="Pistes de lavage haute pression Maison Blanche"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h2 className="text-3xl font-medium mb-2">Lavage Haute Pression</h2>
                            <p className="text-white/80 max-w-sm">4 pistes équipées de lances ergonomiques pour un nettoyage précis et puissant.</p>
                        </div>
                    </motion.div>

                    {/* 2. Petite Carte : Programmes (Haut Droite) */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-sm flex flex-col justify-between border border-slate-100">
                        <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl">
                            <Sparkles size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-1">5 Programmes</h3>
                            <p className="text-slate-500 text-sm">Shampoing, Brosse, Rinçage, Cire de finition et Eau déminéralisée.</p>
                        </div>
                    </motion.div>

                    {/* 3. Petite Carte : Paiement (Milieu Droite) */}
                    <motion.div variants={itemVariants} className="bg-[--color-brand-dark] p-8 rounded-3xl shadow-sm flex flex-col justify-between text-white">
                        <div className="bg-white/10 w-12 h-12 flex items-center justify-center rounded-2xl">
                            <HandCoins size={24} className="text-orange-100" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium mb-1">Paiement Facile</h3>
                            <p className="text-orange-100 text-sm">Acceptons pièces, jetons (disponibles au shop) et cartes bancaires.</p>
                        </div>
                    </motion.div>

                    {/* 4. Petite Carte : Horaires (Bas Gauche) */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-3xl shadow-sm flex flex-col justify-between border border-slate-100">
                        <div className="bg-slate-100 w-12 h-12 flex items-center justify-center rounded-2xl">
                            <Clock3 size={24} className="text-[--color-brand-dark]" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-1">Large Amplitude</h3>
                            <p className="text-slate-500 text-sm">Nos installations de lavage sont accessibles 7j/7 de 06h à 22h.</p>
                        </div>
                    </motion.div>

                    {/* 5. Grande Carte : Aspirateurs (Bas Droite - se placera automatiquement grâce à ses 2 colonnes) */}
                    <motion.div variants={itemVariants} className="relative md:col-span-2 md:row-span-2 rounded-3xl overflow-hidden shadow-sm group">
                        <Image
                            src="/lavage-aspi.jpg" // REMPLACEZ PAR VOTRE PHOTO D'ASPIRATEUR
                            alt="Zone aspirateurs Station Maison Blanche"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h2 className="text-3xl font-medium mb-2">Zone Aspirateurs</h2>
                            <p className="text-white/80 max-w-sm">4 postes d'aspiration abrités avec longs tuyaux pour atteindre tous les recoins.</p>
                        </div>
                    </motion.div>

                    {/* 6. Petite Carte : Puissance Aspi (Seule place restante : sous les horaires) */}
                    <motion.div variants={itemVariants} className="bg-orange-500 p-8 rounded-3xl shadow-sm flex flex-col justify-between text-white">
                        <div className="bg-white/20 w-12 h-12 flex items-center justify-center rounded-2xl">
                            <Zap size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium mb-1">Aspirateurs Turbo</h3>
                            <p className="text-orange-50 text-sm">Puissance d'aspiration industrielle pour un intérieur impeccable.</p>
                        </div>
                    </motion.div>

                </motion.div>

            </div>
        </main>
    );
}