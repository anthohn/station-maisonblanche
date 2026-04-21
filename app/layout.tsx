import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import JsonLd from "@/app/components/JsonLd";
import SummerHoursToast from "@/app/components/SummerHoursToast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://station-maisonblanche.ch"),
  title: {
    default:
      "Station Maison-Blanche | Station Shell, Épicerie & Lavage Auto à Chancy (GE)",
    template: "%s | Station Maison-Blanche",
  },
  description:
    "Station service Shell à Chancy, Genève. Carburants Shell V-Power et diesel 24h/24, épicerie de proximité ouverte 7j/7 de 06h à 20h, centre de lavage haute pression en libre-service et aspirateurs industriels. Attenant au Garage Maison Blanche — même propriétaire.",
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
    "Station Maison Blanche",
    "garage Maison Blanche",
    "garage-maisonblanche.ch",
    "station service 1242 Chancy",
    "Route de Chancy 500",
    "borne gonflage pneus Chancy",
    "Vitogaz Chancy",
    "station service Genève campagne",
  ],
  authors: [{ name: "Station Maison-Blanche SA" }],
  creator: "Station Maison-Blanche SA",
  publisher: "Station Maison-Blanche SA",
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
    siteName: "Station Maison-Blanche",
    title:
      "Station Maison-Blanche | Shell, Épicerie & Lavage Auto à Chancy (GE)",
    description:
      "Station service Shell à Chancy, Genève. Carburants 24h/24, épicerie 7j/7 de 06h à 20h, lavage haute pression en libre-service. Attenant au Garage Maison Blanche.",
    images: [
      {
        url: "/pompes0.jpg",
        width: 1200,
        height: 630,
        alt: "Station Maison-Blanche — pompes Shell à Chancy, Genève",
      },
      {
        url: "/shop.JPG",
        width: 1200,
        height: 630,
        alt: "Shop et épicerie de la Station Maison-Blanche",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Station Maison-Blanche | Shell, Épicerie & Lavage à Chancy (GE)",
    description:
      "Carburants Shell 24h/24, épicerie 7j/7, lavage haute pression. Chancy, Genève.",
    images: ["/pompes0.jpg"],
  },
  alternates: {
    canonical: "https://station-maisonblanche.ch",
  },
};

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

        {/* BANDEAU TOP BAR FIXE (Élégant et non-défilant) */}
        <div className="bg-orange-500 text-white text-center py-2 px-4 text-xs sm:text-sm flex justify-center items-center gap-2 relative z-50">
          <span aria-hidden="true">☀️</span>
          <p>
            <strong>Horaires d'été :</strong> Du 1er mai au 31 août, le shop reste ouvert jusqu'à <strong>21h00</strong>
          </p>
        </div>

        <Header />
        <main className="flex-1">{children}</main>
        <Footer />

        {/* Le Toast en bas à droite */}
        <SummerHoursToast />
      </body>
    </html>
  );
}