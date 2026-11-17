/**
 * ─────────────────────────────────────────────────────────────
 *  CALENDRIER DE L'AVENT — LES 24 PORTES
 * ─────────────────────────────────────────────────────────────
 *  ⚠️  CONTENU D'EXEMPLE
 *  Tous les bons, prix, conditions et codes-barres ci-dessous sont
 *  des exemples pour la démonstration. Avant la mise en ligne :
 *
 *   1. remplacer chaque bon par une vraie offre du shop ;
 *   2. remplacer chaque `barcode` par le vrai code créé dans la caisse
 *      (un code par jour, avec sa date de validité côté caisse) ;
 *   3. mettre `sampleContent: false` dans `lib/advent-shared.ts`.
 *
 *  Comment modifier une porte : chaque porte est un bloc ci-dessous.
 *  - `day`   : numéro de la porte (1 à 24), la porte s'ouvre à minuit
 *              (heure de Genève) le jour correspondant de décembre ;
 *  - `hint`  : l'indice mystérieux, visible AVANT l'ouverture ;
 *  - `kind`  : le type de porte (voir `lib/advent-shared.ts` pour les champs) :
 *              coupon · tip · riddle · recipe · checklist · message · fact.
 *
 *  Typographie : écrire normalement (« Quoi ? » ou « 10 CHF »), les
 *  espaces insécables sont ajoutés automatiquement.
 */

import 'server-only';
import type { Door } from './advent-shared';

export const ADVENT_DOORS: Door[] = [
    /* ─────────────── Mardi 1er décembre ─────────────── */
    {
        day: 1,
        kind: 'coupon',
        icon: 'coffee',
        hint: 'Ça chauffe, ça sent bon, et ça réveille.',
        title: 'Votre café d’ouverture',
        value: 'Offert',
        summary:
            'Pour démarrer décembre du bon pied : un café chaud offert à l’achat d’une viennoiserie au shop.',
        barcode: '00000001',
        conditions:
            '1 café offert pour 1 viennoiserie achetée. Un bon par passage en caisse, dans la limite des stocks disponibles.',
    },

    /* ─────────────── Mercredi 2 ─────────────── */
    {
        day: 2,
        kind: 'tip',
        icon: 'droplets',
        hint: 'Un liquide qui refuse de geler.',
        title: 'Un lave-glace qui n’a pas froid aux yeux',
        body: [
            'Un lave-glace d’été gèle dès que le thermomètre passe sous zéro : au premier coup de commande, votre pare-brise se couvre d’un voile blanc… au pire moment.',
            'Passez à un liquide d’hiver antigel avant la prochaine vague de froid, et évitez de le diluer avec de l’eau du robinet.',
        ],
        remember: [
            'Choisissez un liquide protégé jusqu’à −20 °C',
            'Vérifiez le niveau une fois par semaine',
            'Des balais d’essuie-glace fatigués laissent des traînées : changez-les à l’automne',
        ],
        cta: { label: 'Voir le shop', href: '/shop' },
    },

    /* ─────────────── Jeudi 3 ─────────────── */
    {
        day: 3,
        kind: 'riddle',
        icon: 'puzzle',
        hint: 'Une petite blague pour bien rouler.',
        title: 'Le comble du pompiste',
        question: 'Quel est le comble pour un pompiste ?',
        answer: 'Tomber en panne sèche !',
        aside: 'Chez nous, rassurez-vous : les pompes sont ouvertes 24h/24.',
    },

    /* ─────────────── Vendredi 4 ─────────────── */
    {
        day: 4,
        kind: 'coupon',
        icon: 'gift',
        hint: 'Croustillant, jaune, et plein d’attitude.',
        title: 'L’apéro du vendredi',
        value: '2e offert',
        summary:
            'Les célèbres chips Zweifel « Aromat » : un sachet acheté, le deuxième est offert. De quoi lancer le week-end.',
        barcode: '00000004',
        conditions:
            'Offre valable sur les sachets Zweifel « Aromat ». Un sachet offert par passage en caisse, dans la limite des stocks disponibles.',
        image: {
            src: '/zweifel.jpeg',
            alt: 'Présentoir de chips Zweifel « Aromat » au shop de la Station Maison-Blanche',
        },
    },

    /* ─────────────── Samedi 5 ─────────────── */
    {
        day: 5,
        kind: 'tip',
        icon: 'droplets',
        hint: 'Le sel de la route a un petit côté… mordant.',
        title: 'Après le sel, un bon rinçage',
        body: [
            'En hiver, les routes sont salées pour rester praticables. C’est très efficace contre le verglas, beaucoup moins sympathique pour la carrosserie et le dessous de caisse.',
            'Un rinçage à haute pression après les jours de salage empêche le sel de s’installer et de faire rouiller.',
        ],
        rememberTitle: 'Nos conseils',
        remember: [
            'Rincez surtout le bas de caisse et les passages de roues',
            'Par grand froid, essuyez les joints de portes pour qu’ils ne gèlent pas',
            'Un coup d’aspirateur sur les tapis : le sel entre aussi dans l’habitacle',
        ],
        cta: { label: 'Découvrir nos pistes de lavage', href: '/lavage' },
    },

    /* ─────────────── Dimanche 6 — Saint-Nicolas ─────────────── */
    {
        day: 6,
        kind: 'coupon',
        icon: 'candy',
        hint: 'Il est passé… et il a laissé quelque chose de doux.',
        title: 'Saint-Nicolas passe à la station',
        value: 'Offert',
        summary:
            'Un chocolat de Saint-Nicolas offert dès 10 CHF d’achat au shop. Pour les grands comme pour les petits.',
        barcode: '00000006',
        conditions:
            '1 chocolat offert par passage en caisse, dès 10 CHF d’achat (hors carburant). Dans la limite des stocks disponibles.',
    },

    /* ─────────────── Lundi 7 ─────────────── */
    {
        day: 7,
        kind: 'tip',
        icon: 'gauge',
        hint: 'Quatre rondelles de gomme, toute la différence.',
        title: 'Vos pneus, l’hiver, c’est du sérieux',
        body: [
            'Le minimum légal de profondeur de sculpture est de 1,6 mm. En hiver, les spécialistes recommandent d’en garder au moins 4 mm pour conserver de l’adhérence sur la neige fondue et le mouillé.',
            'La pression, elle, baisse avec le froid : comptez environ 0,1 bar de moins tous les 10 °C.',
        ],
        rememberTitle: 'À retenir',
        remember: [
            'Contrôlez la pression à froid, au moins une fois par mois',
            'Sculpture conseillée en hiver : 4 mm minimum',
            'Un pneu d’hiver porte le pictogramme montagne et flocon',
        ],
        cta: {
            label: 'Faire contrôler mes pneus au garage',
            href: 'https://garage-maisonblanche.ch',
            external: true,
        },
    },

    /* ─────────────── Mardi 8 ─────────────── */
    {
        day: 8,
        kind: 'coupon',
        icon: 'flower',
        hint: 'Quelques couleurs pour affronter le gris de décembre.',
        title: 'Un bouquet contre la grisaille',
        value: '−15 %',
        summary:
            'Offrez-vous (ou offrez) des fleurs de saison : 15 % de réduction sur une plante ou un bouquet au shop.',
        barcode: '00000008',
        conditions:
            '1 réduction par passage en caisse, sur une plante ou un bouquet au choix. Dans la limite des stocks disponibles.',
        image: {
            src: '/devanture.jpeg',
            alt: 'Fleurs de saison devant le shop de la Station Maison-Blanche',
        },
    },

    /* ─────────────── Mercredi 9 ─────────────── */
    {
        day: 9,
        kind: 'recipe',
        icon: 'wine',
        hint: 'Ça mijote, ça embaume la maison, ça se partage.',
        title: 'Le vin chaud en 10 minutes',
        intro: 'Pour 4 personnes, sans rien de compliqué.',
        ingredients: [
            '75 cl de vin rouge fruité',
            '1 orange non traitée, en rondelles',
            '3 cuillères à soupe de miel',
            '1 bâton de cannelle',
            '3 clous de girofle',
            '1 étoile de badiane (facultatif)',
        ],
        steps: [
            'Versez tous les ingrédients dans une casserole.',
            'Chauffez doucement 10 minutes, sans jamais laisser bouillir : l’alcool s’évaporerait… et le goût avec.',
            'Filtrez, servez dans de grandes tasses avec une rondelle d’orange.',
        ],
        note:
            'Version sans alcool : remplacez le vin par du jus de raisin ou de pomme et gardez les épices. C’est celle qu’on recommande aux conducteurs.',
    },

    /* ─────────────── Jeudi 10 ─────────────── */
    {
        day: 10,
        kind: 'riddle',
        icon: 'puzzle',
        hint: 'Il me manque une porte chaque jour.',
        title: 'Qui suis-je ?',
        question:
            'Je compte les jours à l’envers, je cache un petit cadeau derrière chaque porte, et en décembre, tout le monde me regarde chaque matin. Qui suis-je ?',
        answer: 'Le calendrier de l’Avent… et vous êtes en train de l’ouvrir !',
        aside: 'Plus que 14 portes avant Noël.',
    },

    /* ─────────────── Vendredi 11 ─────────────── */
    {
        day: 11,
        kind: 'coupon',
        icon: 'croissant',
        hint: 'Le petit-déjeuner des lève-tôt (et des autres).',
        title: 'La formule du matin',
        value: '2.90 CHF',
        summary:
            'Un café chaud et un croissant frais : la formule petit-déjeuner à 2.90 CHF au lieu de 3.90 CHF.',
        barcode: '00000011',
        conditions:
            '1 formule par passage en caisse, sur présentation du code-barres sur smartphone. Valable durant les heures d’ouverture du shop.',
        image: {
            src: '/formula-cafe-croissant-v2.jpeg',
            alt: 'Café chaud et croissant frais, la formule du matin de la Station Maison-Blanche',
        },
    },

    /* ─────────────── Samedi 12 — Escalade ─────────────── */
    {
        day: 12,
        kind: 'coupon',
        icon: 'soup',
        hint: 'Elle est en chocolat, et on la casse en famille.',
        title: 'Escalade : la marmite en chocolat',
        value: '−20 %',
        summary:
            'Pour la fête de l’Escalade, 20 % sur la mini-marmite en chocolat garnie de légumes en massepain. Et n’oubliez pas la phrase rituelle : « Ainsi périssent les ennemis de la République ! »',
        barcode: '00000012',
        conditions:
            '1 réduction par passage en caisse, sur une mini-marmite au choix. Dans la limite des stocks disponibles.',
    },

    /* ─────────────── Dimanche 13 ─────────────── */
    {
        day: 13,
        kind: 'message',
        icon: 'heart',
        hint: 'Quelques mots, pas de code-barres.',
        title: 'Une pensée pour celles et ceux qui veillent',
        body: [
            'Pendant que beaucoup se reposent, d’autres travaillent : soignants, chauffeurs, boulangers, agents de sécurité, parents au chevet d’un enfant malade…',
            'Si votre route passe par Chancy ce soir, sachez que la lumière de la station reste allumée et que les pompes sont ouvertes 24h/24.',
            'Merci de rouler prudemment, et de prendre soin de vous.',
        ],
        signature: 'L’équipe de la Station Maison-Blanche',
    },

    /* ─────────────── Lundi 14 ─────────────── */
    {
        day: 14,
        kind: 'tip',
        icon: 'battery',
        hint: 'Elle n’aime pas le froid, mais elle ne le dit pas.',
        title: 'Votre batterie et le thermomètre',
        body: [
            'Le froid réduit nettement la capacité d’une batterie, alors que le moteur demande plus d’énergie pour démarrer. Résultat : c’est souvent au premier vrai matin glacé qu’une batterie fatiguée rend les armes.',
            'Un démarreur qui peine, des phares qui faiblissent à l’arrêt : ce sont les signaux d’alerte.',
        ],
        remember: [
            'Une batterie de plus de 5 ans mérite un test avant l’hiver',
            'Coupez chauffage, radio et phares avant de démarrer',
            'Les très courts trajets ne la rechargent jamais complètement',
        ],
        cta: {
            label: 'Faire tester ma batterie au garage',
            href: 'https://garage-maisonblanche.ch',
            external: true,
        },
    },

    /* ─────────────── Mardi 15 ─────────────── */
    {
        day: 15,
        kind: 'coupon',
        icon: 'gift',
        hint: 'Il se cache dans un joli papier doré.',
        title: 'Un petit cadeau tout prêt',
        value: '−15 %',
        summary:
            'Une attention de dernière minute : 15 % de réduction sur les boîtes de chocolats Lindt Lindor du shop.',
        barcode: '00000015',
        conditions:
            '1 réduction par passage en caisse, sur une boîte de chocolats au choix. Dans la limite des stocks disponibles.',
    },

    /* ─────────────── Mercredi 16 ─────────────── */
    {
        day: 16,
        kind: 'fact',
        icon: 'compass',
        hint: 'Tout là-bas, tout à l’ouest.',
        title: 'À Chancy, la Suisse s’arrête',
        stat: 'Le plus à l’ouest',
        statLabel: 'de toute la Suisse',
        body: [
            'Saviez-vous que le point le plus occidental du pays se trouve sur la commune de Chancy ? Quand vous faites le plein chez nous, vous êtes littéralement au bout de la Suisse.',
            'La frontière française n’est qu’à quelques minutes d’ici : de quoi apprécier, au passage, la campagne genevoise.',
        ],
    },

    /* ─────────────── Jeudi 17 ─────────────── */
    {
        day: 17,
        kind: 'tip',
        icon: 'gift',
        hint: 'Pas le temps de chercher ? Nous si.',
        title: 'Trois cadeaux de dernière minute',
        body: [
            'Un oubli, un invité surprise, une envie de faire plaisir : le shop dépanne aussi pour les petites attentions, tous les jours, dès 06h00.',
        ],
        rememberTitle: 'Nos idées',
        remember: [
            'Une plante ou un bouquet de saison',
            'Une boîte de chocolats',
            'Un bon café et une viennoiserie à partager au bureau',
        ],
        cta: { label: 'Découvrir le shop', href: '/shop' },
    },

    /* ─────────────── Vendredi 18 ─────────────── */
    {
        day: 18,
        kind: 'coupon',
        icon: 'coffee',
        hint: 'Il fait chaud dans la tasse, et c’est offert.',
        title: 'Un chocolat chaud pour la route',
        value: 'Offert',
        summary:
            'Un chocolat chaud offert dès 15 CHF d’achat au shop. Idéal pour finir la semaine en douceur.',
        barcode: '00000018',
        conditions:
            '1 chocolat chaud par passage en caisse, dès 15 CHF d’achat (hors carburant). Dans la limite des stocks disponibles.',
    },

    /* ─────────────── Samedi 19 ─────────────── */
    {
        day: 19,
        kind: 'riddle',
        icon: 'snowflake',
        hint: 'Une devinette qui dégivre.',
        title: 'Qui suis-je ?',
        question:
            'Je n’ai ni flamme ni feu, mais je fais fondre le givre sur votre pare-brise. Je souffle chaud, mais je ne suis pas un dragon. Qui suis-je ?',
        answer: 'Le dégivrage de votre voiture !',
        aside:
            'Astuce : ne versez jamais d’eau chaude sur un pare-brise gelé, le choc thermique peut le fissurer. Un grattoir et un peu de patience font mieux l’affaire.',
    },

    /* ─────────────── Dimanche 20 — 4e dimanche de l'Avent ─────────────── */
    {
        day: 20,
        kind: 'coupon',
        icon: 'cookie',
        hint: 'Le dimanche, on prend son temps.',
        title: '4e dimanche de l’Avent',
        value: '4 pour 3',
        summary:
            'Quatre croissants achetés, trois payés : un dimanche matin gourmand, avant la dernière ligne droite avant Noël.',
        barcode: '00000020',
        conditions:
            'Offre valable sur les croissants nature, un lot de 4 par passage en caisse, dans la limite des stocks disponibles.',
    },

    /* ─────────────── Lundi 21 — Solstice ─────────────── */
    {
        day: 21,
        kind: 'tip',
        icon: 'moon',
        hint: 'La plus longue nuit de l’année.',
        title: 'Solstice : vos feux, c’est maintenant',
        body: [
            'Ce soir, c’est le solstice d’hiver : la journée la plus courte de l’année, et celle où l’on roule le plus souvent dans l’obscurité.',
            'Un phare grillé, des feux de croisement mal réglés, un feu stop qui ne s’allume pas : un contrôle d’une minute peut éviter un gros problème.',
        ],
        rememberTitle: 'Le tour de la voiture',
        remember: [
            'Testez feux de croisement, feux de route, clignotants et feux stop',
            'Nettoyez les optiques : la saleté de l’hiver réduit la portée de l’éclairage',
            'Remplacez les ampoules par paire pour un éclairage homogène',
        ],
    },

    /* ─────────────── Mardi 22 ─────────────── */
    {
        day: 22,
        kind: 'checklist',
        icon: 'checklist',
        hint: 'Les valises, c’est vous. Le reste, c’est nous.',
        title: 'Prêt pour la route des fêtes ?',
        intro: 'Avant de partir chez la famille ou à la montagne : 7 vérifications de 5 minutes.',
        items: [
            'Pression des pneus contrôlée (un peu plus si vous roulez chargé)',
            'Niveau d’huile et de liquide de refroidissement vérifiés',
            'Lave-glace d’hiver plein',
            'Vignette autoroutière valable',
            'Triangle de panne et gilet de sécurité à portée de main',
            'Chaînes ou chaussettes à neige si vous montez en station',
            'Plein fait, et de quoi grignoter pour la route',
        ],
        outro: 'Tout est coché ? Vous êtes prêt. Bonne route !',
    },

    /* ─────────────── Mercredi 23 ─────────────── */
    {
        day: 23,
        kind: 'coupon',
        icon: 'fuel',
        hint: 'Un plein de bonnes choses avant Noël.',
        title: 'Le plein, et un café offert',
        value: 'Offert',
        summary:
            'À deux jours de Noël, un café offert avec tout plein de carburant dès 40 CHF. Pour la route, ou pour tenir jusqu’au réveillon.',
        barcode: '00000023',
        conditions:
            '1 café offert par passage en caisse, pour un plein dès 40 CHF. Dans la limite des stocks disponibles.',
    },

    /* ─────────────── Jeudi 24 — Le grand final ─────────────── */
    {
        day: 24,
        kind: 'coupon',
        icon: 'partyPopper',
        hint: 'Le grand final. Chut.',
        title: 'Joyeux Noël de toute l’équipe !',
        value: 'Cadeau',
        summary:
            'Pour fêter Noël ensemble : une boîte de chocolats offerte dès 20 CHF d’achat au shop. Merci de nous avoir fait confiance cette année.',
        barcode: '00000024',
        conditions:
            '1 boîte de chocolats offerte par passage en caisse, dès 20 CHF d’achat (hors carburant). Dans la limite des stocks disponibles.',
    },
];
