import { Fraunces } from 'next/font/google';

/**
 * Serif douce et chaleureuse pour les titres et les chiffres du calendrier.
 * Chargée une seule fois, partagée par la page du calendrier et le teaser de l'accueil.
 */
export const fraunces = Fraunces({
    subsets: ['latin'],
    variable: '--font-fraunces',
    axes: ['opsz', 'SOFT'],
    display: 'swap',
});
