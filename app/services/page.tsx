import type { Metadata } from "next";
import ServicesContent from "./ServicesContent";

export const metadata: Metadata = {
    title: "Nos Services — Carburant Shell 24h/24, Épicerie & Lavage Auto",
    description:
        "Découvrez tous les services de la Station-Service Maison-Blanche à Chancy (Genève) : carburants Shell V-Power et diesel disponibles 24h/24 et 7j/7, épicerie de proximité ouverte tous les jours, lavage haute pression en libre-service, borne de gonflage pneus et vente de gaz Vitogaz.",
    keywords: [
        "station service Chancy",
        "carburant Shell Genève",
        "Shell V-Power Chancy",
        "diesel Chancy",
        "essence 24h/24",
        "lavage auto Chancy",
        "épicerie Chancy",
        "borne gonflage pneus",
        "bouteille gaz Vitogaz",
        "station service ouverte dimanche",
        "Station-Service Maison-Blanche services",
    ],
    openGraph: {
        title: "Nos Services | Station-Service Maison-Blanche — Chancy, Genève",
        description:
            "Carburants Shell 24h/24, épicerie 7j/7, lavage haute pression et plus encore. Tout en un seul arrêt à Chancy.",
        url: "https://station-maisonblanche.ch/services",
        images: [
            {
                url: "/pompes0.jpg",
                width: 1200,
                height: 630,
                alt: "Pompes à essence Shell à la Station-Service Maison-Blanche, Chancy",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Nos Services | Station-Service Maison-Blanche — Chancy, Genève",
        description:
            "Carburants Shell 24h/24, épicerie 7j/7 et lavage haute pression à Chancy.",
        images: ["/pompes0.jpg"],
    },
    alternates: {
        canonical: "https://station-maisonblanche.ch/services",
    },
};

export default function ServicesPage() {
    return <ServicesContent />;
}