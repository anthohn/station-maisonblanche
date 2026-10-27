export interface Promotion {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    originalPrice: string;
    promoPrice: string;
    savings?: string;
    barcode: string; // Code caisse (8 chiffres ou EAN-13)
    ean13Code?: string; // Rétrocompatibilité
    barcodeType?: 'code128' | 'ean13';
    badge: string;
    category: 'shop' | 'service' | 'lavage';
    imageSrc: string;
    imageAlt: string;
    validityNotice: string;
    terms?: string;
}

export const activePromotions: Promotion[] = [
    {
        id: 'halloween',
        title: 'Votre Sac à Bonbons Offert',
        subtitle: 'Pour l\'achat de 2 paquets Haribo 175g (dont 1 Halloween)',
        description: 'Pour l\'achat d\'un paquet Haribo 175g Halloween + un paquet Haribo 175g au choix, repartez avec votre sac à bonbons d\'Halloween offert lors de votre passage en caisse !',
        originalPrice: 'Valeur CHF 0.00',
        promoPrice: 'Offert',
        savings: '1 sac offert',
        barcode: '15935764',
        ean13Code: '15935764',
        barcodeType: 'code128',
        badge: 'Spécial Halloween 🎃',
        category: 'shop',
        imageSrc: '/halloween-promo.jpg',
        imageAlt: 'Sacs à bonbons d\'Halloween et bonbons Haribo au shop de la Station Maison-Blanche',
        validityNotice: 'Valable tous les jours au shop jusqu\'au 31 octobre (dans la limite des stocks disponibles).',
        terms: 'Offre valable pour l\'achat simultané d\'un paquet Haribo 175g Halloween et d\'un paquet Haribo 175g au choix. Présentez ce code-barres lors de votre passage en caisse.'
    }
    /*
    {
        id: 'formula-cafe-croissant',
        title: 'Formule Matin Café + Croissant',
        subtitle: 'Pour bien démarrer la journée',
        description: 'Bénéficiez de la formule petit-déjeuner comprenant un café chaud et un croissant frais du jour à tarif réduit sur présentation de ce coupon à la caisse du shop.',
        originalPrice: '3.90 CHF',
        promoPrice: '3.50 CHF',
        barcode: '761000000350',
        ean13Code: '761000000350',
        barcodeType: 'ean13',
        badge: 'Offre Spéciale',
        category: 'shop',
        imageSrc: '/formula-cafe-croissant-v2.jpeg',
        imageAlt: 'Formule petit-déjeuner café chaud et croissant frais Station Maison-Blanche',
        validityNotice: 'Valable tous les jours durant les heures d\'ouverture du shop.',
        terms: 'Offre valable pour 1 formule par passage en caisse sur présentation du code-barres sur smartphone.'
    }
    */
];
