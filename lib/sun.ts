/**
 * Position du soleil, calculée sur place (aucune API, aucune connexion).
 *
 * Algorithme du « NOAA Solar Calculator » : précis à une fraction de degré, très au-delà
 * de ce qu'il faut pour une ambiance. Il sert à savoir s'il fait jour, nuit, ou si c'est
 * l'heure dorée à Chancy, même quand le service météo est indisponible.
 */

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

const mod = (a: number, n: number) => ((a % n) + n) % n;

/** Réfraction de l'atmosphère (en degrés) : le soleil paraît un peu plus haut qu'il n'est. */
function refraction(elevation: number): number {
    if (elevation > 85) return 0;
    const t = Math.tan(elevation * RAD);
    let arcSeconds: number;
    if (elevation > 5) arcSeconds = 58.1 / t - 0.07 / t ** 3 + 0.000086 / t ** 5;
    else if (elevation > -0.575)
        arcSeconds = 1735 + elevation * (-518.2 + elevation * (103.4 + elevation * (-12.79 + elevation * 0.711)));
    else arcSeconds = -20.772 / t;
    return arcSeconds / 3600;
}

/**
 * Hauteur du soleil au-dessus de l'horizon, en degrés (négative la nuit), à un instant donné.
 * @param time instant en millisecondes (Date.now())
 * @param lat latitude en degrés (nord positif)
 * @param lon longitude en degrés (est positif)
 */
export function sunElevation(time: number, lat: number, lon: number): number {
    const jd = time / 86400000 + 2440587.5;
    const jc = (jd - 2451545) / 36525;

    const meanLong = mod(280.46646 + jc * (36000.76983 + jc * 0.0003032), 360);
    const meanAnomaly = 357.52911 + jc * (35999.05029 - 0.0001537 * jc);
    const eccentricity = 0.016708634 - jc * (0.000042037 + 0.0000001267 * jc);

    const centre =
        Math.sin(meanAnomaly * RAD) * (1.914602 - jc * (0.004817 + 0.000014 * jc)) +
        Math.sin(2 * meanAnomaly * RAD) * (0.019993 - 0.000101 * jc) +
        Math.sin(3 * meanAnomaly * RAD) * 0.000289;
    const trueLong = meanLong + centre;
    const omega = 125.04 - 1934.136 * jc;
    const apparentLong = trueLong - 0.00569 - 0.00478 * Math.sin(omega * RAD);

    const obliquity =
        23 +
        (26 + (21.448 - jc * (46.815 + jc * (0.00059 - jc * 0.001813))) / 60) / 60 +
        0.00256 * Math.cos(omega * RAD);
    const declination = Math.asin(Math.sin(obliquity * RAD) * Math.sin(apparentLong * RAD));

    const y = Math.tan((obliquity * RAD) / 2) ** 2;
    const equationOfTime =
        4 *
        DEG *
        (y * Math.sin(2 * meanLong * RAD) -
            2 * eccentricity * Math.sin(meanAnomaly * RAD) +
            4 * eccentricity * y * Math.sin(meanAnomaly * RAD) * Math.cos(2 * meanLong * RAD) -
            0.5 * y * y * Math.sin(4 * meanLong * RAD) -
            1.25 * eccentricity * eccentricity * Math.sin(2 * meanAnomaly * RAD));

    const minutesUtc = mod(time / 60000, 1440);
    const trueSolarTime = mod(minutesUtc + equationOfTime + 4 * lon, 1440);
    const hourAngle = trueSolarTime / 4 < 0 ? trueSolarTime / 4 + 180 : trueSolarTime / 4 - 180;

    const cosZenith =
        Math.sin(lat * RAD) * Math.sin(declination) +
        Math.cos(lat * RAD) * Math.cos(declination) * Math.cos(hourAngle * RAD);
    const elevation = 90 - Math.acos(Math.max(-1, Math.min(1, cosZenith))) * DEG;

    return elevation + refraction(elevation);
}
