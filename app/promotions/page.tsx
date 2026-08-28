import { Metadata } from 'next';
import PromotionsContent from './PromotionsContent';

export const metadata: Metadata = {
    title: 'Bons Plans & Promotions | Station-Service Maison-Blanche',
    description: 'Découvrez nos offres promotionnelles exclusives à la Station Maison-Blanche à Chancy. Formule petit-déjeuner café et croissant à tarif réduit.',
};

export default function PromotionsPage() {
    return <PromotionsContent />;
}
