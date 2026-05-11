import type { Metadata } from "next";
import LavageContent from "./LavageContent";

export const metadata: Metadata = {
    title: "Lavage Auto — Haute Pression & Aspirateurs en Libre-Service à Chancy",
    description:
        "Centre de lavage en libre-service à Chancy (Genève). Une piste haute pression avec 6 programmes (shampoing, brosse, rinçage, cire, eau déminéralisée). Un poste d'aspiration industrielle. Ouvert 7j/7 de 06h à 22h. Paiement par pièces, jetons ou carte bancaire.",
    keywords: [
        "lavage auto Chancy",
        "lavage haute pression Genève",
        "lavage libre-service",
        "aspirateur voiture Chancy",
        "station lavage Genève",
        "nettoyage voiture Chancy",
        "lavage auto 7j/7",
        "piste haute pression",
        "Station-Service Maison-Blanche lavage",
        "centre lavage Genève campagne",
    ],
    openGraph: {
        title: "Lavage Auto — Haute Pression & Aspirateurs | Station-Service Maison-Blanche",
        description:
            "Une piste haute pression et un poste d'aspiration en libre-service. Ouvert 7j/7 de 06h à 22h à Chancy, Genève.",
        url: "https://station-maisonblanche.ch/lavage",
        images: [
            {
                url: "/lavage.jpeg",
                width: 1200,
                height: 630,
                alt: "Pistes de lavage haute pression Station-Service Maison-Blanche, Chancy",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Lavage Auto | Station-Service Maison-Blanche — Chancy, Genève",
        description:
            "Une piste haute pression, 6 programmes, aspirateur industriel. Ouvert 7j/7 de 06h à 22h.",
        images: ["/lavage.jpeg"],
    },
    alternates: {
        canonical: "https://station-maisonblanche.ch/lavage",
    },
};

export default function LavagePage() {
    return <LavageContent />;
}