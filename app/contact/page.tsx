import type { Metadata } from "next";
import ContactContent from "./ContactContent";

export const metadata: Metadata = {
    title: "Contact & Accès — Route de Chancy 500, 1284 Chancy (GE)",
    description:
        "Contactez la Station-Service Maison-Blanche : Route de Chancy 500, 1284 Chancy, Genève. Téléphone : +41 22 756 15 22. Email : contact@station-maisonblanche.ch. Trouvez-nous facilement avec Google Maps. Garage Maison Blanche juste à côté pour vos besoins mécaniques.",
    keywords: [
        "contact station service Chancy",
        "adresse Station-Service Maison-Blanche",
        "Route de Chancy 500",
        "1284 Chancy",
        "station service Genève contact",
        "téléphone station Chancy",
        "garage Maison Blanche Chancy",
        "itinéraire Chancy",
        "horaires station Chancy",
    ],
    openGraph: {
        title: "Contact & Accès | Station-Service Maison-Blanche — Chancy, Genève",
        description:
            "Route de Chancy 500, 1284 Chancy. Tél: +41 22 756 15 22. Retrouvez-nous sur Google Maps.",
        url: "https://station-maisonblanche.ch/contact",
        images: [
            {
                url: "/devanture.jpeg",
                width: 1200,
                height: 630,
                alt: "Station-Service Maison-Blanche vue extérieure, Route de Chancy 500, Chancy",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Contact & Accès | Station-Service Maison-Blanche — Chancy, Genève",
        description:
            "Route de Chancy 500, 1284 Chancy. Tél: +41 22 756 15 22.",
        images: ["/devanture.jpeg"],
    },
    alternates: {
        canonical: "https://station-maisonblanche.ch/contact",
    },
};

export default function ContactPage() {
    return <ContactContent />;
}