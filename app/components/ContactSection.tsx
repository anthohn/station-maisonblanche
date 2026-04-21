'use client';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaLocationDot } from 'react-icons/fa6';
import { Clock, ExternalLink } from 'lucide-react';

export default function ContactSection() {
    return (
        <section id="contact" className="py-24 bg-[--color-bg-subtle]">
            <div className="container mx-auto px-6 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-14 text-center"
                >
                    <p className="section-tag justify-center">Contact & Itinéraire</p>
                    <h2 className="text-4xl md:text-5xl font-semibold text-[--color-brand-dark] mb-4">
                        Venez nous rendre visite.
                    </h2>
                    <p className="text-slate-500 text-lg max-w-md mx-auto">
                        Retrouvez-nous facilement à Chancy — ouverts tous les jours de 06h00 à 20h00.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    {/* Left: info cards */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-2 space-y-4"
                    >
                        {[
                            {
                                icon: FaLocationDot,
                                title: 'Adresse',
                                content: 'Route de Chancy 500\n1242 Chancy, Suisse',
                                href: 'https://maps.google.com/?q=Route+d\'Oron+105+1010+Chancy',
                                linkLabel: 'Voir sur Maps',
                            },
                            {
                                icon: FaPhone,
                                title: 'Téléphone',
                                content: '+41 22 756 15 22',
                                href: 'tel:+41227561522',
                                linkLabel: 'Appeler',
                            },
                            {
                                icon: FaEnvelope,
                                title: 'E-mail',
                                content: 'contact@station-maisonblanche.ch',
                                href: 'mailto:contact@station-maisonblanche.ch',
                                linkLabel: 'Envoyer un mail',
                            },
                        ].map((item) => (
                            <div key={item.title} className="card p-5 flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 bg-orange-50">
                                    <item.icon className="text-orange-500 text-lg" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{item.title}</p>
                                    <p className="text-[--color-brand-dark] font-semibold text-sm whitespace-pre-line">{item.content}</p>
                                    <a
                                        href={item.href}
                                        target={item.href.startsWith('http') ? '_blank' : undefined}
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-orange-500 text-xs font-semibold mt-1.5 hover:underline"
                                    >
                                        {item.linkLabel} <ExternalLink size={11} />
                                    </a>
                                </div>
                            </div>
                        ))}

                        {/* Hours */}
                        <div className="card p-6 bg-[--color-brand-dark] border-transparent">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock size={20} className="text-orange-400" />
                                <h3 className="text-white font-bold">Horaires d'ouverture</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Lun – Dim (Shop)</span>
                                    <span className="text-white font-semibold">06:00 – 20:00</span>
                                </div>
                                <div className="border-t border-slate-700 pt-3 flex justify-between text-sm">
                                    <span className="text-slate-400">Carburant</span>
                                    <span className="text-orange-400 font-bold">24h/24</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Map */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-3 card overflow-hidden p-0 h-[440px]"
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2745.1234567890!2d6.673!3d46.534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478c2f0e3b9a1234%3A0x0!2sRoute+d'Oron+105%2C+1010+Chancy!5e0!3m2!1sfr!2sch!4v1000000000000"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Station Maison Blanche - Localisation"
                            className="w-full h-full"
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
