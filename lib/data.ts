import { activePromotions } from './promotions';

export interface NavLink {
    href: string;
    label: string;
    /** Petit point orange pour signaler une nouveauté (ex. offre en cours). */
    highlight?: boolean;
    /** Met une icône cadeau devant le lien dans l'en-tête (calendrier de l'Avent). */
    gift?: boolean;
    /** Libellé plus long dans le menu mobile, où il y a la place (ex. « Calendrier de l’Avent »). */
    mobileLabel?: string;
    /**
     * Dans le menu horizontal, n'apparaît qu'à partir de 1280 px : en dessous, l'en-tête est déjà
     * plein et un 6e lien ferait passer les autres sur deux lignes. Reste dans le menu mobile.
     */
    hideBelowXl?: boolean;
}

// Le lien « Offres » apparaît tout seul tant qu'une offre est en cours (lib/promotions.ts),
// et disparaît dès qu'on la retire.
const offersLink: NavLink[] = activePromotions.length > 0 ? [{ href: '/offres', label: 'Offres', highlight: true, hideBelowXl: true }] : [];

export const links: NavLink[] = [
    { href: '/', label: 'Accueil' },
    { href: '/services', label: 'Services' },
    { href: '/shop', label: 'Le shop' },
    { href: '/lavage', label: 'Le lavage' },
    // Calendrier de l'Avent : retirer cette ligne après les fêtes (ou quand le calendrier est terminé).
    { href: '/calendrier-de-l-avent', label: 'Avent', mobileLabel: 'Calendrier de l’Avent', gift: true, hideBelowXl: true },
    ...offersLink,
    { href: '/contact', label: 'Contact' },
];
