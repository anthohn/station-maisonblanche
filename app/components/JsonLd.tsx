export default function JsonLd() {
    const gasStationSchema = {
        "@context": "https://schema.org",
        "@type": "GasStation",
        name: "Station-Service Maison-Blanche SA",
        alternateName: "Station-Service Maison-Blanche",
        url: "https://station-maisonblanche.ch",
        telephone: "+41227561522",
        email: "contact@station-maisonblanche.ch",
        image: "https://station-maisonblanche.ch/shop.JPG",
        logo: "https://station-maisonblanche.ch/logo-station.png",
        description:
            "Station service Shell à Chancy, Genève. Carburants Shell V-Power et diesel 24h/24, épicerie de proximité ouverte 7j/7 de 06h à 20h, lavage haute pression en libre-service et aspirateurs industriels. Même propriétaire que le Garage Maison Blanche attenant.",
        priceRange: "€€",
        currenciesAccepted: "CHF, EUR",
        paymentAccepted: "Cartes bancaires, TWINT, Espèces",
        address: {
            "@type": "PostalAddress",
            streetAddress: "Route de Chancy 500",
            addressLocality: "Chancy",
            postalCode: "1284",
            addressRegion: "Genève",
            addressCountry: "CH",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 46.1567,
            longitude: 5.9874,
        },
        hasMap: "https://maps.app.goo.gl/WKU8p8fe4wCEhn2t6",
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "06:00",
                closes: "20:00",
                description: "Shop / Épicerie",
            },
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Saturday",
                opens: "06:30",
                closes: "20:00",
                description: "Shop / Épicerie",
            },
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: "Sunday",
                opens: "07:00",
                closes: "20:00",
                description: "Shop / Épicerie",
            },
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
                opens: "00:00",
                closes: "23:59",
                description: "Pompes à carburant (24h/24)",
            },
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
                opens: "06:00",
                closes: "22:00",
                description: "Centre de lavage",
            },
        ],
        sameAs: [
            "https://www.facebook.com/profile.php?id=61580606409294",
            "https://www.instagram.com/station_maisonblanche",
        ],
        brand: {
            "@type": "Brand",
            name: "Shell",
        },
        department: [
            {
                "@type": "AutoRepair",
                name: "Garage Maison Blanche",
                url: "https://garage-maisonblanche.ch",
                description:
                    "Garage automobile multimarques attenant à la station. Révisions, mécanique générale, pneus et réparations. Même propriétaire que la Station-Service Maison-Blanche.",
                address: {
                    "@type": "PostalAddress",
                    streetAddress: "Route de Chancy 500",
                    addressLocality: "Chancy",
                    postalCode: "1284",
                    addressRegion: "Genève",
                    addressCountry: "CH",
                },
            },
        ],
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: "Services Station-Service Maison-Blanche",
            itemListElement: [
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Carburants Shell",
                        description:
                            "Essence Sans-Plomb, Diesel et Shell V-Power disponibles 24h/24 via terminaux de paiement automatiques.",
                    },
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Épicerie de proximité",
                        description:
                            "Produits frais, café, viennoiseries, snacks, boissons, journaux. Ouvert 7j/7.",
                    },
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Lavage haute pression",
                        description:
                            "1 piste haute pression en libre-service avec 6 programmes. Ouvert de 06h à 22h.",
                    },
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Aspirateurs industriels",
                        description:
                            "1 poste d'aspiration abrité avec puissance industrielle pour l'intérieur des véhicules.",
                    },
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Borne de gonflage pneus",
                        description:
                            "Vérification et ajustement de la pression des pneus en libre-service.",
                    },
                },
                {
                    "@type": "Offer",
                    itemOffered: {
                        "@type": "Service",
                        name: "Bouteilles de gaz Vitogaz",
                        description:
                            "Bouteilles de gaz disponibles en plusieurs formats pour barbecues et chauffages.",
                    },
                },
            ],
        },
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Accueil",
                item: "https://station-maisonblanche.ch",
            },
            {
                "@type": "ListItem",
                position: 2,
                name: "Services",
                item: "https://station-maisonblanche.ch/services",
            },
            {
                "@type": "ListItem",
                position: 3,
                name: "Le Shop",
                item: "https://station-maisonblanche.ch/shop",
            },
            {
                "@type": "ListItem",
                position: 4,
                name: "Lavage Auto",
                item: "https://station-maisonblanche.ch/lavage",
            },
            {
                "@type": "ListItem",
                position: 5,
                name: "Contact",
                item: "https://station-maisonblanche.ch/contact",
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(gasStationSchema),
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />
        </>
    );
}
