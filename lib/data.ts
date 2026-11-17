export interface NavLink {
    href: string;
    label: string;
    /** Met le lien en valeur dans l'en-tête (icône cadeau). */
    highlight?: boolean;
}

export const links: NavLink[] = [
    { href: '/', label: 'Accueil' },
    { href: '/services', label: 'Services' },
    { href: '/shop', label: 'Le shop' },
    { href: '/lavage', label: 'Le lavage' },
    // Calendrier de l'Avent : retirer cette ligne après les fêtes (ou quand le calendrier est terminé).
    { href: '/calendrier-de-l-avent', label: 'Avent', highlight: true },
    // { href: '/promotions', label: 'Offres' }, // Réactivable lors des prochaines opérations promo
    { href: '/contact', label: 'Contact' },
];
