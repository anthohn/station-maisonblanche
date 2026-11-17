import { Metadata } from 'next';
import { activePromotions } from '@/lib/promotions';
import PromotionsContent from './PromotionsContent';

// Les textes pour Google et les aperçus de partage suivent l'offre en cours (voir lib/promotions.ts).
// Sans offre : une description générale, sans jamais mentionner une opération terminée.
const offer = activePromotions[0];

const title = offer ? 'Offre du moment' : 'Offres & promotions';
const description =
    offer?.metaDescription ??
    'Retrouvez les offres et promotions de la Station-Service Maison-Blanche à Chancy, Genève : shop, carburant et lavage.';

export const metadata: Metadata = {
    title,
    description,
    openGraph: {
        title: `${title} | Station-Service Maison-Blanche`,
        description,
        url: 'https://station-maisonblanche.ch/promotions',
        type: 'website',
        locale: 'fr_CH',
        siteName: 'Station-Service Maison-Blanche',
        ...(offer && {
            images: [
                {
                    url: offer.imageSrc,
                    width: offer.imageWidth ?? 1200,
                    height: offer.imageHeight ?? 630,
                    alt: offer.imageAlt,
                },
            ],
        }),
    },
    alternates: {
        canonical: 'https://station-maisonblanche.ch/promotions',
    },
};

export default function PromotionsPage() {
    return <PromotionsContent />;
}
