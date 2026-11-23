import Image from 'next/image';

/**
 * Photo d'accueil et ses calques météo. Le balisage est le même pour tout le monde (rendu serveur,
 * sans la moindre donnée) : seules les variables CSS posées sur <html> par WeatherAtmosphere changent
 * l'ambiance. Voir `.wx-*` dans globals.css et lib/mood.ts.
 *
 * Ordre des calques, du dessous au dessus : photo étalonnée → neige sur le toit → ombres de nuages → lumière du soleil
 * (dim, vignette, doré) → ciel remplacé → enseigne et vitrines allumées → brouillard → voile → éclair.
 */
export default function HeroPhoto() {
    return (
        <div className="wx-stage hero-zoom absolute inset-0">
            <Image
                src="/shop-accueil.jpg"
                alt="Shop et épicerie de proximité à la Station-Service Maison-Blanche, Chancy, Genève"
                fill
                className="wx-photo object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div aria-hidden="true" className="wx-box">
                <div className="wx-snow" />
                <div className="wx-shade">
                    <div className="wx-shade-texture wx-drift" data-wx-layer="shade" />
                </div>
                <div className="wx-dim" />
                <div className="wx-vignette" />
                <div className="wx-warm" />
                <div className="wx-sky">
                    <i className="wx-sky-clouds wx-drift" data-wx-layer="clouds" />
                </div>
                <div className="wx-lit wx-sign" />
                <div className="wx-lit wx-windows" />
                <div className="wx-fog wx-fog-b wx-drift" data-wx-layer="fog-b" />
                <div className="wx-fog wx-fog-a wx-drift" data-wx-layer="fog-a" />
                <div className="wx-veil" />
                <div className="wx-flash" />
            </div>
        </div>
    );
}
