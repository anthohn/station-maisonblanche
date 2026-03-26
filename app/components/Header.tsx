'use client'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { links } from "@/lib/data";
import Image from "next/image";
// import SantaHat from '@/public/santaHat.png'
import ModernButton from "@/app/components/ui/ModernButton";
// import OpenStatus from "@/app/components/ui/OpenStatus";

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Header full width fixed top */}
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.2,
                    duration: 0.4
                }}
            >
                <div className="bg-white/95 backdrop-blur-sm shadow-md border-b border-gray-200">
                    <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
                        {/* Section 1: Logo à gauche */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-3 text-black text-xl md:text-2xl font-semibold hover:text-gray-600 transition-colors relative">
                                <div className="relative">
                                    <Image
                                        src="/logo-station.png"
                                        alt="Logo Station Maison-Blanche"
                                        width={50}
                                        height={50}
                                        className="object-contain"
                                    />
                                    {/* <Image
                                        src={SantaHat}
                                        alt="Bonnet de Noel"
                                        width={40}
                                        height={40}
                                        className="absolute -top-4 -right-4 rotate-12 drop-shadow-sm pointer-events-none"
                                    /> */}
                                </div>
                                <span className="hidden sm:block">Station Maison-Blanche</span>
                                <span className="sm:hidden">Station Maison-Blanche</span>
                            </Link>
                        </div>

                        {/* Section 2: Navigation au centre (desktop) */}
                        <div className="hidden md:flex items-center space-x-8">
                            {links.map((link, idx) => (
                                <Link
                                    key={link.href + idx}
                                    href={link.href}
                                    className="text-gray-700 hover:text-orange-500 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        {/* Section 3: CTA à droite */}
                        <div className="flex items-center space-x-4">
                            {/* <div className="hidden sm:block">
                                <OpenStatus />
                            </div> */}

                            {/* <ModernButton
                                href="/contact"
                                size="sm"
                                className="text-sm"
                                showArrow={false}
                            >
                                Contact
                            </ModernButton> */}

                            {/* Hamburger Menu Button for mobile */}
                            <div className="flex md:hidden">
                                <button
                                    onClick={toggleMenu}
                                    className="relative w-8 h-8 flex items-center justify-center text-gray-700"
                                    aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
                                >
                                    <motion.span
                                        className="block absolute h-0.5 w-6 bg-gray-700"
                                        initial={false}
                                        animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -8 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.span
                                        className="block absolute h-0.5 w-6 bg-gray-700"
                                        initial={false}
                                        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.span
                                        className="block absolute h-0.5 w-6 bg-gray-700"
                                        initial={false}
                                        animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 8 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Menu mobile */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            className="md:hidden bg-white border-b border-gray-200 shadow-lg"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="px-6 py-4 space-y-3">
                                {links.map((link, idx) => (
                                    <Link
                                        key={link.href + idx}
                                        href={link.href}
                                        className="block text-gray-700 hover:text-[#303F9F] font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                                {/* OpenStatus in mobile menu since it's hidden in header for mobile */}
                                {/* <div className="pt-2 border-t border-gray-100">
                                    <OpenStatus />
                                </div> */}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
}