'use client';
import { motion } from 'framer-motion';
import { Phone, Mail, Wrench, ArrowRight } from 'lucide-react';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function ContactPage() {
    return (
        <main className="bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* --- HEADER --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl mb-12"
                >
                    <p className="text-orange-500 font-medium tracking-wide text-sm uppercase mb-3">Nous trouver</p>
                    <h1 className="text-4xl md:text-6xl font-medium text-[--color-brand-dark] tracking-tight mb-6">
                        Venez nous rendre visite.
                    </h1>
                    <p className="text-lg text-slate-500">
                        Passez nous voir à Chancy ou contactez-nous directement pour toute question.
                    </p>
                </motion.div>

                {/* --- LAYOUT BENTO CONTACT (Épuré) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COLONNE GAUCHE : INFOS DIRECTES (1 tiers) */}
                    <motion.div
                        className="flex flex-col gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                    >

                        {/* Carte Contact Direct (Blanche) */}
                        <motion.div variants={itemVariants} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 flex-1">
                            <h3 className="text-xl font-medium text-[--color-brand-dark] mb-8">Nous contacter</h3>

                            <div className="flex items-center gap-5 mb-8">
                                <div className="bg-orange-50 w-12 h-12 flex items-center justify-center rounded-2xl shrink-0">
                                    <Phone size={20} className="text-orange-500" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-sm text-slate-400 mb-1">Téléphone</p>
                                    <a href="tel:+41216521361" className="text-lg font-medium text-[--color-brand-dark] hover:text-orange-500 transition-colors block truncate">+41 21 652 13 61</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="bg-orange-50 w-12 h-12 flex items-center justify-center rounded-2xl shrink-0">
                                    <Mail size={20} className="text-orange-500" />
                                </div>
                                <div className="overflow-hidden w-full">
                                    <p className="text-sm text-slate-400 mb-1">E-mail</p>
                                    <a href="mailto:contact@station-maisonblanche.ch" title="contact@station-maisonblanche.ch" className="text-base font-medium text-[--color-brand-dark] hover:text-orange-500 transition-colors block truncate">
                                        contact@station-maisonblanche.ch
                                    </a>
                                </div>
                            </div>
                        </motion.div>

                        {/* Carte Synergie Garage (Blanche, calquée sur 'Nous Contacter') */}
                        <motion.div variants={itemVariants} className="bg-white p-8 md:p-10 rounded-[2rem] shadow-sm border border-slate-100 flex-1 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="bg-orange-50 w-12 h-12 flex items-center justify-center rounded-2xl shrink-0">
                                        <Wrench size={20} className="text-orange-500" />
                                    </div>
                                    <h3 className="text-xl font-medium text-[--color-brand-dark]">Besoin d'un mécanicien ?</h3>
                                </div>
                                <p className="text-slate-500 text-base leading-relaxed mb-8">
                                    Pour l'entretien, les réparations ou les pneus, découvrez l'expertise de notre garage partenaire, juste à côté.
                                </p>
                            </div>
                            <a
                                href="https://garage-maisonblanche.ch"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full gap-2 bg-slate-50 hover:bg-orange-50 text-[--color-brand-dark] hover:text-orange-600 px-6 py-4 rounded-xl font-medium transition-colors border border-slate-200 hover:border-orange-100"
                            >
                                Visiter le site du Garage <ArrowRight size={18} />
                            </a>
                        </motion.div>

                    </motion.div>

                    {/* COLONNE DROITE : LA CARTE GOOGLE MAPS (2 tiers) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2 h-[500px] lg:h-auto rounded-[2rem] overflow-hidden shadow-sm border border-slate-200 bg-white relative"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2763.7014972910897!2d5.987427575994064!3d46.156689886969644!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c87fabc861e13%3A0x2e523f818adbbf7!2sStation%20Maison%20Blanche%20SA!5e0!3m2!1sfr!2sit!4v1775029984316!5m2!1sfr!2sit"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="absolute inset-0"
                        ></iframe>
                    </motion.div>

                </div>
            </div>
        </main>
    );
}