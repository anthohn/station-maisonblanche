import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page non trouvée | Station-Service Maison-Blanche",
    description: "La page que vous recherchez n'existe pas ou a été déplacée.",
};

export default function NotFound() {
    return (
        <section className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-20 text-center">
            <h1 className="text-7xl font-bold text-gray-900 mb-4 tracking-tight">404</h1>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6">
                Oups ! Page introuvable
            </h2>

            <p className="text-gray-600 max-w-lg mx-auto mb-10 text-lg">
                Désolé, mais la page que vous recherchez n'existe pas. Elle a peut-être été déplacée, supprimée ou son nom a changé.
            </p>

            <Link
                href="/"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    ></path>
                </svg>
                Retour à l'accueil
            </Link>
        </section>
    );
}
