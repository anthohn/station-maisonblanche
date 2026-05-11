import type { Metadata } from "next";
import ShopContent from "./ShopContent";

export const metadata: Metadata = {
    title: "Le Shop — Épicerie 7j/7 ouverte de 06h à 20h à Chancy",
    description:
        "Épicerie indépendante ouverte 7 jours sur 7 à Chancy (Genève). Produits frais, café, viennoiseries, fleurs de saison, bouteilles de gaz Vitogaz, dépannage auto. Terrasse avec glaces Mövenpick. Paiement par carte, TWINT et espèces (CHF/EUR).",
    keywords: [
        "épicerie Chancy",
        "shop station service",
        "épicerie ouverte dimanche Genève",
        "produits frais Chancy",
        "café croissants station",
        "Vitogaz Chancy",
        "fleurs Chancy",
        "courses dépannage Genève",
        "shop 7j/7",
        "Station-Service Maison-Blanche shop",
    ],
    openGraph: {
        title: "Le Shop — Épicerie 7j/7 à Chancy | Station-Service Maison-Blanche",
        description:
            "Produits frais, café, fleurs et dépannage auto. Ouvert tous les jours de 06h à 20h à Chancy, Genève.",
        url: "https://station-maisonblanche.ch/shop",
        images: [
            {
                url: "/shop.jpg",
                width: 1200,
                height: 630,
                alt: "Intérieur du shop épicerie Station-Service Maison-Blanche à Chancy",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Le Shop — Épicerie 7j/7 à Chancy | Station-Service Maison-Blanche",
        description:
            "Produits frais, café, fleurs et dépannage auto. Ouvert tous les jours de 06h à 20h.",
        images: ["/shop.jpg"],
    },
    alternates: {
        canonical: "https://station-maisonblanche.ch/shop",
    },
};

export default function ShopPage() {
    return <ShopContent />;
}