import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import JsonLd from "@/app/components/JsonLd";
import WeatherAtmosphere from "@/app/components/weather/WeatherAtmosphere";
import MobileContactBar from "@/app/components/MobileContactBar";
import OfferCard from "@/app/components/OfferCard";
import "./globals.css";
import "./components/weather/weather.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://station-maisonblanche.ch"),
  title: {
    default:
      "Station-Service Maison-Blanche | Station Shell, Épicerie & Lavage Auto à Chancy (GE)",
    template: "%s | Station-Service Maison-Blanche",
  },
  description:
    "Station service Shell à Chancy, Genève. Carburants Shell V-Power et diesel 24h/24, épicerie de proximité ouverte 7j/7 de 06h00 à 20h30, centre de lavage haute pression en libre-service et aspirateurs industriels. Attenant au Garage Maison Blanche — même propriétaire.",
  keywords: [
    "station service Chancy",
    "Shell Chancy",
    "station essence Genève",
    "carburant 24h/24",
    "Shell V-Power",
    "diesel Chancy",
    "épicerie Chancy",
    "épicerie ouverte dimanche Genève",
    "shop station service",
    "lavage auto Chancy",
    "lavage haute pression Genève",
    "aspirateur voiture",
    "station lavage libre-service",
    "Maison Blanche Chancy",
    "Station-Service Maison-Blanche",
    "garage Maison Blanche",
    "garage-maisonblanche.ch",
    "station service 1284 Chancy",
    "Route de Chancy 500",
    "borne gonflage pneus Chancy",
    "Vitogaz Chancy",
    "station service Genève campagne",
  ],
  authors: [{ name: "Station-Service Maison-Blanche SA" }],
  creator: "Station-Service Maison-Blanche SA",
  publisher: "Station-Service Maison-Blanche SA",
  category: "Station service",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_CH",
    url: "https://station-maisonblanche.ch",
    siteName: "Station-Service Maison-Blanche",
    title:
      "Station-Service Maison-Blanche | Shell, Épicerie & Lavage Auto à Chancy (GE)",
    description:
      "Station service Shell à Chancy, Genève. Carburants 24h/24, épicerie 7j/7 de 06h00 à 20h30, lavage haute pression en libre-service. Attenant au Garage Maison Blanche.",
    images: [
      {
        url: "/pompes0.jpg",
        width: 1200,
        height: 630,
        alt: "Station-Service Maison-Blanche — pompes Shell à Chancy, Genève",
      },
      {
        url: "/shop-accueil.jpg",
        width: 1200,
        height: 630,
        alt: "Shop et épicerie de la Station-Service Maison-Blanche",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Station-Service Maison-Blanche | Shell, Épicerie & Lavage à Chancy (GE)",
    description:
      "Carburants Shell 24h/24, épicerie 7j/7, lavage haute pression. Chancy, Genève.",
    images: ["/pompes0.jpg"],
  },
  alternates: {
    canonical: "https://station-maisonblanche.ch",
  },
};

// Le « pad » (barre d'aperçu météo) s'ouvre tout seul sur les aperçus Vercel et en développement, jamais en production
// (évalué à la compilation : chaque déploiement a sa propre valeur). Ailleurs : ?pad, ?meteo= ou ?heure= dans l'adresse.
const padByDefault = process.env.VERCEL_ENV === "preview" || process.env.NODE_ENV === "development";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased selection:bg-orange-500/30 flex flex-col min-h-screen`}
      >
        <JsonLd />

        <Header />
        {/* Météo en direct à Chancy : pluie, neige, feuilles d'automne, ambiance de la photo d'accueil */}
        <WeatherAtmosphere padByDefault={padByDefault} />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Carte « offre en cours » : glisse dans le coin une fois par jour (voir lib/promotions.ts) */}
        <OfferCard />

        {/* Le Toast en bas à droite */}
        {/* <SummerHoursToast /> */}

        {/* Barre d'action fixe mobile pour ajouter au contact & QR code */}
        <MobileContactBar />
      </body>
    </html>
  );
}