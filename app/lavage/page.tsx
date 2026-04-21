import type { Metadata } from "next";
import LavageContent from "./LavageContent";

export const metadata: Metadata = {
    title: "Lavage Auto — Haute Pression & Aspirateurs en Libre-Service à Chancy",
    description:
        "Centre de lavage en libre-service à Chancy (Genève). 4 pistes haute pression avec 5 programmes (shampoing, brosse, rinçage, cire, eau déminéralisée). 4 postes d'aspiration industrielle abrités. Ouvert 7j/7 de 06h à 22h. Paiement par pièces, jetons ou carte bancaire.",
    keywords: [
        "lavage auto Chancy",
        "lavage haute pression Genève",
        "lavage libre-service",
        "aspirateur voiture Chancy",
        "station lavage Genève",
        "nettoyage voiture Chancy",
        "lavage auto 7j/7",
        "piste haute pression",
        "Station Maison Blanche lavage",
        "centre lavage Genève campagne",
    ],
    openGraph: {
        title: "Lavage Auto — Haute Pression & Aspirateurs | Station Maison-Blanche",
        description:
            "4 pistes haute pression et 4 postes d'aspiration en libre-service. Ouvert 7j/7 de 06h à 22h à Chancy, Genève.",
        url: "https://station-maisonblanche.ch/lavage",
        images: [
            {
                url: "/lavage.jpeg",
                width: 1200,
                height: 630,
                alt: "Pistes de lavage haute pression Station Maison-Blanche, Chancy",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Lavage Auto | Station Maison-Blanche — Chancy, Genève",
        description:
            "4 pistes haute pression, 5 programmes, aspirateurs industriels. Ouvert 7j/7 de 06h à 22h.",
        images: ["/lavage.jpeg"],
    },
    alternates: {
        canonical: "https://station-maisonblanche.ch/lavage",
    },
};

export default function LavagePage() {
    return <LavageContent />;
}