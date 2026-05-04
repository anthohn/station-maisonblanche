'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun } from 'lucide-react';

export default function SummerHoursToast() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed bottom-6 right-6 z-50"
                >
                    <div className="bg-white px-6 py-4 rounded-full shadow-xl border border-slate-100 flex items-center gap-4">
                        <Sun size={22} className="text-orange-500 shrink-0" />

                        <p className="text-sm text-slate-700 font-medium">
                            Du 1er mai au 31 août, le shop est ouvert pour vous jusqu'à <span className="text-orange-500 font-bold">21h00</span>
                        </p>

                        {/* <div className="w-px h-5 bg-slate-200 mx-1 shrink-0"></div> */}

                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-slate-400 hover:text-slate-700 transition-colors shrink-0 cursor-pointer p-1 rounded-full hover:bg-slate-50"
                            aria-label="Fermer"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}