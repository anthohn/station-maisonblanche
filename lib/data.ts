import { activePromotions } from './promotions';

export interface NavLink {
    href: string;
    label: string;
    /** Petit point orange pour signaler une nouveauté (ex. offre en cours). */
    highlight?: boolean;
    /**
     * Dans le menu horizontal, n'apparaît qu'à partir de 1280 px : en dessous, l'en-tête est déjà
     * plein et un 6e lien ferait passer les autres sur deux lignes. Reste dans le menu mobile.
     */
    hideBelowXl?: boolean;
}

// Le lien « Offres » apparaît tout seul tant qu'une offre est en cours (lib/promotions.ts),
// et disparaît dès qu'on la retire.
const offersLink: NavLink[] = activePromotions.length > 0 ? [{ href: '/promotions', label: 'Offres', highlight: true, hideBelowXl: true }] : [];

export const links: NavLink[] = [
    { href: '/', label: 'Accueil' },
    { href: '/services', label: 'Services' },
    { href: '/shop', label: 'Le shop' },
    { href: '/lavage', label: 'Le lavage' },
    ...offersLink,
    { href: '/contact', label: 'Contact' },
];
