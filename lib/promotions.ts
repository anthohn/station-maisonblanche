export interface Promotion {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    originalPrice: string;
    promoPrice: string;
    savings?: string;
    ean13Code: string; // 12 ou 13 chiffres
    badge: string;
    category: 'shop' | 'service' | 'lavage';
    imageSrc: string;
    imageAlt: string;
    validityNotice: string;
    terms?: string;
}

export const activePromotions: Promotion[] = [
    {
        id: 'formula-cafe-croissant',
        title: 'Formule Matin Café + Croissant',
        subtitle: 'Pour bien démarrer la journée',
        description: 'Bénéficiez de la formule petit-déjeuner comprenant un café chaud et un croissant frais du jour à tarif réduit sur présentation de ce coupon à la caisse du shop.',
        originalPrice: '3.90 CHF',
        promoPrice: '3.50 CHF',
        ean13Code: '761000000350', // 12 chiffres (la clé EAN13 sera calculée automatiquement)
        badge: 'Offre Spéciale',
        category: 'shop',
        imageSrc: '/formula-cafe-croissant-v2.jpeg',
        imageAlt: 'Formule petit-déjeuner café chaud et croissant frais Station Maison-Blanche',
        validityNotice: 'Valable tous les jours durant les heures d\'ouverture du shop.',
        terms: 'Offre valable pour 1 formule par passage en caisse sur présentation du code-barres sur smartphone.'
    }
];
