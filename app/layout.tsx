import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL("https://station-maisonblanche.ch"),
  title: {
    default: "Station Maison-Blanche | Shell, Shop & Lavage à Chancy",
    template: "%s | Station Maison-Blanche",
  },
  description:
    "Station service Shell à Chancy. Épicerie ouverte 7j/7 de 06h00 à 20h00, carburants de qualité, lavage haute pression et aspirateurs.",
  keywords: [
    "station service",
    "Shell",
    "Chancy",
    "épicerie",
    "carburant",
    "lavage auto",
    "Maison Blanche",
  ],
  openGraph: {
    type: "website",
    locale: "fr_CH",
    url: "https://station-maisonblanche.ch",
    siteName: "Station Maison-Blanche",
    title: "Station Maison-Blanche | Shell, Shop & Lavage",
    description:
      "Station service Shell à Chancy. Épicerie ouverte 7j/7 de 06h00 à 20h00.",
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
        className={`${inter.variable} antialiased selection:bg-orange-500/30`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
