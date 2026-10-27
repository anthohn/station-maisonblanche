'use client';

import { motion } from 'framer-motion';

// Formes vectorielles détaillées et botaniques
const LEAF_MAPLE =
    'M14 2C15.2 4.5 17.5 5.5 20 4.5C18.8 7 21.2 9.2 24.5 9.2C22.2 11.5 23.5 13.8 26 15C22.5 16.2 21.2 18.5 22.5 22C19 20.8 16.5 22 15.2 25.5C14 23.2 14 20.8 12.8 20.8C11.5 20.8 11.5 23.2 10.2 25.5C9 22 6.5 20.8 3 22C4.2 18.5 3 16.2 -0.5 15C2 13.8 3.2 11.5 1 9.2C4.2 9.2 6.8 7 5.5 4.5C8 5.5 10.2 4.5 11.5 2L12.8 0L14 2Z';

const LEAF_OAK =
    'M12 0C14.5 2.5 18 3.8 17 7.5C19.5 8.8 22 12.5 19.5 16.2C22 18.8 20.8 22.5 17 25C14.5 27.5 13.2 31.2 12 32.5C10.8 31.2 9.5 27.5 7 25C3.2 22.5 2 18.8 4.5 16.2C2 12.5 4.5 8.8 7 7.5C6 3.8 9.5 2.5 12 0Z';

const LEAF_BEECH =
    'M12 0C18 6 21.5 14.5 19 21.5C17 27.5 13.2 31 12 32.5C10.8 31 7 27.5 5 21.5C2.5 14.5 6 6 12 0Z';

interface LeafConfig {
    id: number;
    isForeground: boolean; // Avant-plan net ou arrière-plan flou
    left: number; // Position X en %
    size: number;
    color: string;
    path: string;
    viewBox: string;
    duration: number;
    delay: number;
    sway: number;
    rotateStart: number;
    blur?: string;
    opacityRange: number[];
}

const LEAF_COLLECTION: LeafConfig[] = [
    // --- PREMIER PLAN (Nettes, généreuses, éclatantes) ---
    {
        id: 1,
        isForeground: true,
        left: 6,
        size: 42,
        color: '#EA580C', // Orange chaud vibrant
        path: LEAF_MAPLE,
        viewBox: '0 0 26 26',
        duration: 14,
        delay: 0,
        sway: 55,
        rotateStart: 15,
        opacityRange: [0, 0.85, 0.85, 0],
    },
    {
        id: 2,
        isForeground: true,
        left: 32,
        size: 38,
        color: '#DC2626', // Rouge écarlate d'érable
        path: LEAF_MAPLE,
        viewBox: '0 0 26 26',
        duration: 16,
        delay: 3,
        sway: -45,
        rotateStart: -35,
        opacityRange: [0, 0.8, 0.8, 0],
    },
    {
        id: 3,
        isForeground: true,
        left: 58,
        size: 44,
        color: '#D97706', // Ambre doré riche
        path: LEAF_OAK,
        viewBox: '0 0 24 33',
        duration: 15,
        delay: 6,
        sway: 50,
        rotateStart: 45,
        opacityRange: [0, 0.85, 0.85, 0],
    },
    {
        id: 4,
        isForeground: true,
        left: 78,
        size: 40,
        color: '#F97316', // Orange flamboyant
        path: LEAF_BEECH,
        viewBox: '0 0 24 33',
        duration: 13,
        delay: 1.5,
        sway: -50,
        rotateStart: -20,
        opacityRange: [0, 0.8, 0.8, 0],
    },
    {
        id: 5,
        isForeground: true,
        left: 92,
        size: 36,
        color: '#C2410C', // Rouille cuivrée
        path: LEAF_MAPLE,
        viewBox: '0 0 26 26',
        duration: 17,
        delay: 4.5,
        sway: 40,
        rotateStart: 25,
        opacityRange: [0, 0.8, 0.8, 0],
    },

    // --- ARRIÈRE-PLAN (Plus petites, plus lentes, avec flou cinématographique) ---
    {
        id: 6,
        isForeground: false,
        left: 18,
        size: 24,
        color: '#B45309',
        path: LEAF_OAK,
        viewBox: '0 0 24 33',
        duration: 22,
        delay: 1,
        sway: -30,
        rotateStart: -45,
        blur: 'blur(1.8px)',
        opacityRange: [0, 0.45, 0.45, 0],
    },
    {
        id: 7,
        isForeground: false,
        left: 45,
        size: 20,
        color: '#92400E',
        path: LEAF_BEECH,
        viewBox: '0 0 24 33',
        duration: 25,
        delay: 5,
        sway: 35,
        rotateStart: 30,
        blur: 'blur(1.5px)',
        opacityRange: [0, 0.4, 0.4, 0],
    },
    {
        id: 8,
        isForeground: false,
        left: 70,
        size: 26,
        color: '#B45309',
        path: LEAF_MAPLE,
        viewBox: '0 0 26 26',
        duration: 21,
        delay: 8,
        sway: -35,
        rotateStart: -15,
        blur: 'blur(2px)',
        opacityRange: [0, 0.45, 0.45, 0],
    },
    {
        id: 9,
        isForeground: false,
        left: 84,
        size: 22,
        color: '#78350F',
        path: LEAF_OAK,
        viewBox: '0 0 24 33',
        duration: 24,
        delay: 3.5,
        sway: 25,
        rotateStart: 50,
        blur: 'blur(1.5px)',
        opacityRange: [0, 0.4, 0.4, 0],
    },
];

export default function AutumnLeaves() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none select-none z-30 overflow-hidden"
        >
            {LEAF_COLLECTION.map((leaf) => (
                <motion.div
                    key={leaf.id}
                    className="absolute top-0 pointer-events-none select-none will-change-transform"
                    style={{
                        left: `${leaf.left}%`,
                        width: leaf.size,
                        height: leaf.size,
                        filter: leaf.blur ? `${leaf.blur} drop-shadow(0 2px 4px rgba(0,0,0,0.12))` : 'drop-shadow(0 4px 6px rgba(0,0,0,0.14))',
                    }}
                    initial={{
                        y: -70,
                        x: 0,
                        rotate: leaf.rotateStart,
                        opacity: 0,
                    }}
                    animate={{
                        y: ['-8vh', '108vh'],
                        x: [0, leaf.sway, -leaf.sway * 0.6, leaf.sway * 0.8, 0],
                        rotate: [leaf.rotateStart, leaf.rotateStart + 180, leaf.rotateStart + 360],
                        opacity: leaf.opacityRange,
                    }}
                    transition={{
                        duration: leaf.duration,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: leaf.delay,
                    }}
                >
                    <svg
                        viewBox={leaf.viewBox}
                        width="100%"
                        height="100%"
                        className="overflow-visible"
                    >
                        <path
                            d={leaf.path}
                            fill={leaf.color}
                        />
                    </svg>
                </motion.div>
            ))}
        </div>
    );
}
