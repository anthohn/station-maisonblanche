/**
 * ─────────────────────────────────────────────────────────────
 *  OFFRES EN COURS — l'interrupteur de toutes les opérations promo
 * ─────────────────────────────────────────────────────────────
 *  Tout le site lit la liste `activePromotions` ci-dessous :
 *
 *   - la page /offres (carte de l'offre) ;
 *   - la bande d'annonce tout en haut (elle remplace celle de Zweifel) ;
 *   - le lien « Offres » du menu et du pied de page ;
 *   - le badge sur la carte « Carburant Shell » de l'accueil.
 *
 *  ▶ Pour ARRÊTER une offre : retirer son bloc de la liste (ou le mettre en
 *    commentaire) puis mettre en ligne. Tout disparaît d'un coup : la bande
 *    de Zweifel revient, le lien « Offres » disparaît du menu et la page
 *    /offres affiche « Aucune offre en cours ».
 *
 *  ▶ Pour LANCER une offre : ajouter un bloc.
 *    - Offre à scanner en caisse : renseigner `barcode` (+ prix éventuels).
 *    - Offre « affiche » sans code (ex. mandarine offerte) : `poster: true`,
 *      avec `imageWidth` / `imageHeight`, sans `barcode`.
 */

export interface Promotion {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    /** Prix : uniquement pour les offres avec un prix (coupons). */
    originalPrice?: string;
    promoPrice?: string;
    savings?: string;
    /** Code caisse (8 chiffres ou EAN-13). Sans code-barres : pas de bouton « Afficher le code-barres ». */
    barcode?: string;
    ean13Code?: string; // Rétrocompatibilité
    barcodeType?: 'code128' | 'ean13';
    badge: string;
    category: 'shop' | 'service' | 'lavage';
    imageSrc: string;
    imageAlt: string;
    /** Dimensions réelles de l'image : requises quand `poster` est vrai. */
    imageWidth?: number;
    imageHeight?: number;
    /** true : l'image est une affiche, montrée en entier (sans recadrage ni texte par-dessus). */
    poster?: boolean;
    /** Texte de la bande d'annonce tout en haut du site (version complète, puis version courte pour mobile). */
    bannerText?: string;
    bannerTextShort?: string;
    /** Description pour Google et les aperçus de partage de la page /offres. */
    metaDescription?: string;
    validityNotice: string;
    /** Date de fin affichée sur le coupon, ex. « 31 octobre ». Laisser vide pour une offre sans date de fin. */
    validUntil?: string;
    terms?: string;
}

export const activePromotions: Promotion[] = [
    {
        id: 'vitamines',
        title: 'Faites le plein de vitamines !',
        subtitle: '…et le plein de carburant',
        description:
            'En ce moment, pour chaque achat de carburant, une mandarine vous est offerte. À retirer à la caisse du shop, ouvert tous les jours de 06h00 à 20h30.',
        badge: 'En ce moment',
        category: 'shop',
        imageSrc: '/affiche-vitamines.jpg',
        imageAlt:
            'Affiche « Faites le plein de vitamines ! … et le plein de carburant » : une pompe Shell qui verse du jus d’orange sur une orange géante. Pour chaque achat de carburant, une mandarine vous est offerte. Offre ponctuelle.',
        imageWidth: 1000,
        imageHeight: 1440,
        poster: true,
        bannerText: 'Une mandarine offerte pour chaque achat de carburant !',
        bannerTextShort: 'À chaque plein, une mandarine offerte !',
        metaDescription:
            'En ce moment à la Station-Service Maison-Blanche, à Chancy : faites le plein de vitamines ! Pour chaque achat de carburant, une mandarine vous est offerte, à retirer à la caisse du shop.',
        validityNotice: 'Offre ponctuelle, valable en ce moment.',
    },
    /*
    // --- OFFRE HALLOWEEN (Conservée pour l'année prochaine) ---
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
        validUntil: '31 octobre',
        terms: 'Offre valable pour l\'achat simultané d\'un paquet Haribo 175g Halloween et d\'un paquet Haribo 175g au choix. Présentez ce code-barres lors de votre passage en caisse.'
    },
    */
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
