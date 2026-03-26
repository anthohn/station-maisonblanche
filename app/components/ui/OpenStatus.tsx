'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const OpenStatus = () => {
    const [isOpen, setIsOpen] = useState<boolean | null>(null);

    useEffect(() => {
        const checkStatus = () => {
            const now = new Date();
            const day = now.getDay();
            const hour = now.getHours();
            const minutes = now.getMinutes();
            const currentTimeInMinutes = hour * 60 + minutes;

            // Station Maison Blanche: Lun-Dim 06:00 - 20:00
            const openTime = 6 * 60;   // 360
            const closeTime = 20 * 60; // 1200

            const open = currentTimeInMinutes >= openTime && currentTimeInMinutes < closeTime;
            setIsOpen(open);
        };

        checkStatus();
        const interval = setInterval(checkStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    if (isOpen === null) return null;

    return (
        <div className="flex items-center space-x-2.5 bg-gray-50/50 border border-gray-100 rounded-full px-4 py-1.5 shadow-sm">
            <div className="relative flex h-2.5 w-2.5">
                <motion.span
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpen ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                />
                <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOpen ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                />
            </div>
            <span className={`text-sm font-bold tracking-wide transition-colors ${isOpen ? 'text-emerald-700' : 'text-rose-700'
                }`}>
                {isOpen ? 'OUVERT' : 'FERMÉ'}
            </span>
            <div className="h-3 w-px bg-gray-200 mx-1" />
            <span className="text-[11px] font-medium text-gray-400 font-mono">
                06:00–20:00
            </span>
        </div>
    );
};

export default OpenStatus;
