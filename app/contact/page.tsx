'use client';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* --- HEADER --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mb-16"
                >
                    <p className="text-orange-500 font-medium tracking-wide text-sm uppercase mb-3">Nous trouver</p>
                    <h1 className="text-4xl md:text-6xl font-medium text-[--color-brand-dark] tracking-tight mb-6">
                        Venez nous rendre visite.
                    </h1>
                    <p className="text-lg text-slate-500">
                        Route de Chancy 500, 1242 Chancy. Ouverts tous les jours de 06h00 à 20h00 — carburant disponible 24h/24.
                    </p>
                </motion.div>

                {/* --- LAYOUT BENTO CONTACT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COLONNE GAUCHE : INFOS (1 tiers) */}
                    <motion.div
                        className="flex flex-col gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    >

                        {/* Carte Adresse & Itinéraire (Orange) */}
                        <motion.div variants={itemVariants} className="bg-orange-500 p-8 rounded-4xl shadow-sm text-white flex flex-col justify-between">
                            <div>
                                <div className="bg-white/20 w-12 h-12 flex items-center justify-center rounded-2xl mb-6">
                                    <MapPin size={24} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-medium mb-2">Adresse</h3>
                                <p className="text-orange-50 mb-8">
                                    Route de Chancy 500<br />
                                    1242 Chancy<br />
                                    Suisse
                                </p>
                            </div>
                            <a
                                href="https://maps.google.com/?q=Route+de+Chancy+500,+1242+Chancy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-6 py-3 rounded-xl font-medium hover:bg-orange-50 transition-colors w-full"
                            >
                                Ouvrir dans Maps <ArrowRight size={18} />
                            </a>
                        </motion.div>

                        {/* Carte Contact Direct (Blanche) */}
                        <motion.div variants={itemVariants} className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-medium text-[--color-brand-dark] mb-6">Nous contacter</h3>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="bg-slate-50 w-10 h-10 flex items-center justify-center rounded-xl shrink-0">
                                    <Phone size={18} className="text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">Téléphone</p>
                                    <a href="tel:+41216521361" className="font-medium text-[--color-brand-dark] hover:text-orange-500 transition-colors">+41 21 652 13 61</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="bg-slate-50 w-10 h-10 flex items-center justify-center rounded-xl shrink-0">
                                    <Mail size={18} className="text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">E-mail</p>
                                    <a href="mailto:contact@station-maisonblanche.ch" className="font-medium text-[--color-brand-dark] hover:text-orange-500 transition-colors">contact@station-maisonblanche.ch</a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Carte Réseaux & Horaires (Gris clair) */}
                        <motion.div variants={itemVariants} className="bg-slate-100 p-8 rounded-4xl shadow-sm flex flex-col gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock size={18} className="text-[--color-brand-dark]" />
                                    <h3 className="text-lg font-medium text-[--color-brand-dark]">Horaires</h3>
                                </div>
                                <div className="flex justify-between text-slate-600 text-sm py-2 border-b border-slate-200">
                                    <span>Lundi – Dimanche</span>
                                    <span className="font-medium">06:00 – 20:00</span>
                                </div>
                                <div className="flex justify-between text-slate-600 text-sm py-2">
                                    <span>Carburant</span>
                                    <span className="font-medium text-orange-500">24h/24</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500 mb-3">Rejoignez-nous</p>
                                <div className="flex gap-3">
                                    <a href="#" className="bg-white p-3 rounded-xl text-[--color-brand-dark] hover:text-orange-500 transition-colors shadow-sm">
                                        <Facebook size={20} />
                                    </a>
                                    <a href="#" className="bg-white p-3 rounded-xl text-[--color-brand-dark] hover:text-orange-500 transition-colors shadow-sm">
                                        <Instagram size={20} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Carte Synergie Garage Maison Blanche (Bleu Sombre) */}
                        <motion.div variants={itemVariants} className="bg-[--color-brand-dark] p-8 rounded-4xl shadow-sm text-white">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-white/10 w-12 h-12 flex items-center justify-center rounded-2xl">
                                    <Wrench size={24} className="text-orange-100" />
                                </div>
                                <h3 className="text-xl font-medium">Besoin d'un mécanicien ?</h3>
                            </div>
                            <p className="text-white/80 text-sm mb-6">
                                Pour l'entretien, les réparations ou les pneus, découvrez l'expertise de notre garage partenaire, juste à côté.
                            </p>
                            <a href="https://garage-maisonblanche.ch" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors">
                                Visiter le site du Garage <ArrowRight size={16} className="ml-1" />
                            </a>
                        </motion.div>

                    </motion.div>

                    {/* COLONNE DROITE : LA CARTE (2 tiers) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2 h-[500px] lg:h-auto rounded-4xl overflow-hidden shadow-sm border border-slate-200 bg-white relative"
                    >
                        {/* Iframe Google Maps avec vos coordonnées */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2764.12345!2d5.973!3d46.148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbCsDA4JzUyLjgiTiA1wrA1OCcyMi44IkU!5e0!3m2!1sfr!2sch!4v1700000000000!5m2!1sfr!2sch"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        ></iframe>
                        {/* Note : J'ai mis une URL Google Maps générique centrée vers Chancy, pensez à remplacer l'attribut src par votre propre code d'intégration "Partager > Intégrer une carte" depuis Google Maps */}
                    </motion.div>

                </div>
            </div>
        </main>
    );
}