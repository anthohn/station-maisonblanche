import type { Metadata } from 'next';
import { ADVENT } from '@/lib/advent-shared';
import { buildAdventView, currentEpoch, isAdventPreviewAllowed, parsePreview } from '@/lib/advent';
import { fraunces } from '@/app/components/advent/font';
import AdventCalendar from './AdventCalendar';
import './advent.css';

const title = `Calendrier de l’Avent ${ADVENT.year} : une surprise par jour jusqu’à Noël`;
const description =
    'Du 1er au 24 décembre, ouvrez chaque jour une porte du calendrier de l’Avent de la Station-Service Maison-Blanche à Chancy : bons gourmands à scanner en caisse, conseils d’hiver, devinettes et surprises.';

export const metadata: Metadata = {
    title,
    description,
    keywords: [
        'calendrier de l’Avent',
        'calendrier de l’Avent digital',
        'Avent Chancy',
        'Noël Genève',
        'offres Noël shop',
        'Station-Service Maison-Blanche',
    ],
    openGraph: {
        title,
        description,
        url: `https://station-maisonblanche.ch${ADVENT.path}`,
        type: 'website',
        locale: 'fr_CH',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: { canonical: `https://station-maisonblanche.ch${ADVENT.path}` },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/**
 * Page rendue à CHAQUE requête (elle lit `searchParams`) : « aujourd'hui » est
 * toujours calculé par le serveur, à l'heure de Genève. Changer la date de son
 * téléphone ne permet donc pas d'ouvrir les portes à l'avance.
 */
export default async function AdventPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;

    const previewAllowed = isAdventPreviewAllowed();
    const simulated = previewAllowed ? parsePreview(params) : null;
    const view = buildAdventView(simulated?.epoch ?? currentEpoch());

    return (
        <div className={fraunces.variable}>
            <AdventCalendar view={view} preview={previewAllowed} />
        </div>
    );
}
