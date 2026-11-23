import { NextResponse } from 'next/server';
import { fromOpenMeteo, OPEN_METEO_CURRENT, STATION } from '@/lib/weather';

/**
 * Météo actuelle à la station, lue chez Open-Meteo (open-meteo.com) et ramenée à ce dont le site
 * a besoin (voir lib/weather.ts). Les visiteurs ne parlent jamais directement à Open-Meteo :
 *  - la réponse est gardée 10 minutes côté serveur (`revalidate`) et par le CDN (`s-maxage`),
 *    donc Open-Meteo reçoit au plus quelques requêtes par heure, quel que soit le nombre de visiteurs ;
 *  - aucune donnée du visiteur ne part vers un service tiers.
 *
 * Réglages facultatifs (variables d'environnement) :
 *  - OPEN_METEO_API_KEY : clé d'un abonnement Open-Meteo (usage commercial), utilisée avec
 *    customer-api.open-meteo.com ;
 *  - OPEN_METEO_URL : autre point d'accès (Open-Meteo peut être hébergé soi-même).
 *
 * En cas d'échec (service injoignable, réponse inattendue), on répond quand même 200 avec
 * `{ weather: null }` : le site garde alors son ambiance neutre, sans erreur visible.
 */

const FRESH_SECONDS = 600;
const TIMEOUT_MS = 6000;

function upstreamUrl(): string {
    const key = process.env.OPEN_METEO_API_KEY;
    const base =
        process.env.OPEN_METEO_URL ??
        (key ? 'https://customer-api.open-meteo.com/v1/forecast' : 'https://api.open-meteo.com/v1/forecast');
    const url = new URL(base);
    url.searchParams.set('latitude', String(STATION.lat));
    url.searchParams.set('longitude', String(STATION.lon));
    url.searchParams.set('current', OPEN_METEO_CURRENT.join(','));
    url.searchParams.set('wind_speed_unit', 'kmh');
    url.searchParams.set('timezone', 'GMT');
    if (key) url.searchParams.set('apikey', key);
    return url.toString();
}

export async function GET() {
    try {
        const response = await fetch(upstreamUrl(), {
            next: { revalidate: FRESH_SECONDS },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!response.ok) throw new Error(`Open-Meteo a répondu ${response.status}`);

        const weather = fromOpenMeteo(await response.json());
        if (!weather) throw new Error('Réponse Open-Meteo inexploitable');

        return NextResponse.json(
            { weather },
            { headers: { 'Cache-Control': `public, max-age=60, s-maxage=${FRESH_SECONDS}, stale-while-revalidate=300` } },
        );
    } catch (error) {
        console.error('Météo indisponible :', error instanceof Error ? error.message : error);
        return NextResponse.json({ weather: null }, { headers: { 'Cache-Control': 'public, max-age=30, s-maxage=60' } });
    }
}
