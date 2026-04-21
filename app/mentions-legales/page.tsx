import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions Légales | Station Maison-Blanche",
    description: "Mentions légales et informations de contact de la Station Maison-Blanche SA, située à Chancy (Genève).",
    robots: {
        index: false,
        follow: true,
    },
};

export default function MentionsLegalesPage() {
    return (
        <main className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="bg-white p-10 md:p-14 rounded-[2rem] shadow-sm border border-slate-100">
                    <h1 className="text-3xl md:text-4xl font-medium text-[--color-brand-dark] tracking-tight mb-8">
                        Mentions légales
                    </h1>
                    
                    <div className="space-y-8 text-slate-600 leading-relaxed">
                        <section>
                            <h2 className="text-xl font-medium text-[--color-brand-dark] mb-3">
                                1. Éditeur du site
                            </h2>
                            <p>
                                Le présent site web est édité et géré par :<br />
                                <strong>Station Maison-Blanche SA</strong><br />
                                Route de Chancy 500<br />
                                1242 Chancy<br />
                                Suisse
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-medium text-[--color-brand-dark] mb-3">
                                2. Contact
                            </h2>
                            <p>
                                Pour toute question ou demande d'information, vous pouvez nous contacter :
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li><strong>Téléphone :</strong> <a href="tel:+41216521361" className="text-orange-500 hover:underline">+41 21 652 13 61</a></li>
                                <li><strong>Email :</strong> <a href="mailto:contact@station-maisonblanche.ch" className="text-orange-500 hover:underline">contact@station-maisonblanche.ch</a></li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-medium text-[--color-brand-dark] mb-3">
                                3. Hébergement
                            </h2>
                            <p>
                                L'hébergement du site est assuré dans un environnement sécurisé. 
                                Pour toute information concernant l'hébergement, veuillez nous contacter directement via les coordonnées figurant ci-dessus.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-medium text-[--color-brand-dark] mb-3">
                                4. Propriété intellectuelle
                            </h2>
                            <p>
                                L'ensemble du contenu de ce site (textes, images, logos, photographies, etc.) est protégé par le droit d'auteur.
                                Toute reproduction, modification, ou distribution totale ou partielle de ces éléments sans l'autorisation écrite préalable de Station Maison-Blanche SA est strictement interdite.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-medium text-[--color-brand-dark] mb-3">
                                5. Protection des données (RGPD / nLPD)
                            </h2>
                            <p>
                                Aucune donnée personnelle n'est collectée à votre insu sur le site. Les seules informations que nous pouvons être amenés à traiter sont celles que vous nous communiquez volontairement (par exemple via e-mail). Elles sont utilisées uniquement pour répondre à vos demandes et ne sont jamais cédées à des tiers.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
