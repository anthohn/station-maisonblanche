'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Droplets, Sparkles, HandCoins, Clock3, Zap, MapPin } from 'lucide-react';
import lavage from '@/public/lavage.jpeg';

// Animation standard pour les éléments de la grille
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function LavageContent() {
    return (
        <main className="bg-slate-50 pt-32">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* --- HEADER --- */}
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
                        Pistes haute pression professionnelles et aspirateurs puissants. Tout l&apos;équipement nécessaire pour un nettoyage impeccable, intérieur comme extérieur.
                    </p>
                </motion.div>

                {/* --- GRILLE BENTO LAVAGE --- */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px]"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.1 } }
                    }}
                >

                    {/* 1. Grande Carte : Pistes HP */}
                    <motion.div variants={itemVariants} className="relative md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden shadow-sm group">
                        <Image
                            src={lavage}
                            alt="Pistes de lavage haute pression en libre-service à la Station-Service Maison-Blanche, Chancy, Genève"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h2 className="text-3xl font-medium mb-2">Lavage Haute Pression</h2>
                            <p className="text-white/80 max-w-sm">Une piste de lavage équipée d'une lance ergonomique pour un nettoyage précis et puissant.</p>
                        </div>
                    </motion.div>

                    {/* 2. Petite Carte : Programmes */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-sm flex flex-col justify-between border border-slate-100">
                        <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl">
                            <Sparkles size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-1">6 Programmes</h3>
                            <p className="text-slate-500 text-sm">Shampoing, Brosse, Rinçage, Cire de finition, Eau déminéralisée et Nettoyant Jantes.</p>
                        </div>
                    </motion.div>

                    {/* 3. Petite Carte : Paiement */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-sm flex flex-col justify-between border border-slate-100">
                        <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl">
                            <HandCoins size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-1">Paiement Facile</h3>
                            <p className="text-slate-500 text-sm">Acceptons pièces, jetons (disponibles au shop) et cartes bancaires.</p>
                        </div>
                    </motion.div>

                    {/* 4. Petite Carte : Horaires */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-sm flex flex-col justify-between border border-slate-100">
                        <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl">
                            <Clock3 size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-1">Large Amplitude</h3>
                            <p className="text-slate-500 text-sm">Nos installations de lavage sont accessibles 7j/7 de 06h à 22h.</p>
                        </div>
                    </motion.div>

                    {/* 5. Grande Carte : Aspirateurs */}
                    <motion.div variants={itemVariants} className="relative md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden shadow-sm group">
                        <Image
                            src="/aspirateur.jpeg"
                            alt="Zone aspirateurs industriels couverte, Station-Service Maison-Blanche Chancy"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <h2 className="text-3xl font-medium mb-2">Zone Aspirateur</h2>
                            <p className="text-white/80 max-w-sm">Un poste d&apos;aspiration abrité avec un long tuyau pour atteindre tous les recoins.</p>
                        </div>
                    </motion.div>

                    {/* 6. Petite Carte : Puissance Aspi */}
                    <motion.div variants={itemVariants} className="bg-white p-8 rounded-[2rem] shadow-sm flex flex-col justify-between border border-slate-100">
                        <div className="bg-orange-100 w-12 h-12 flex items-center justify-center rounded-2xl">
                            <Zap size={24} className="text-orange-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-1">Aspirateurs</h3>
                            <p className="text-slate-500 text-sm">Puissance d&apos;aspiration industrielle pour un intérieur impeccable.</p>
                        </div>
                    </motion.div>

                </motion.div>

                {/* --- CTA FINAL (Le bloc de conclusion) --- */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-24 bg-white p-12 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8"
                >
                    <div className="max-w-xl text-center md:text-left">
                        <h3 className="text-3xl font-medium text-[--color-brand-dark] mb-3">Votre voiture mérite le meilleur.</h3>
                        <p className="text-slate-500 text-lg">Passez nous voir à Chancy et redonnez tout son éclat à votre véhicule grâce à nos équipements professionnels.</p>
                    </div>
                    <a
                        href="https://maps.app.goo.gl/WKU8p8fe4wCEhn2t6"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-xl font-medium hover:bg-orange-600 transition-colors shrink-0"
                    >
                        <MapPin size={18} />
                        Itinéraire vers la station
                    </a>
                </motion.section>

            </div>
        </main>
    );
}
