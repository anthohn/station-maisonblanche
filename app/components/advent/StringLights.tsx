/**
 * Guirlande lumineuse qui court en haut de la page.
 * SVG pur, géométrie calculée une fois pour toutes (aucun hasard, aucun état).
 */

const WIDTH = 1200;
const HEIGHT = 74;
const SEGMENTS = 6;
const SEGMENT_W = WIDTH / SEGMENTS;
const BASE_Y = 6;
const SAG = 58; // profondeur du « ventre » de chaque arc
const BULBS_PER_SEGMENT = 4;
const COLORS = ['#fbbf24', '#fb923c', '#f87171', '#34d399', '#60a5fa', '#fde68a'];

/** Point d'une courbe de Bézier quadratique à l'instant t. */
function pointOnArc(segment: number, t: number) {
    const x0 = segment * SEGMENT_W;
    const x1 = x0 + SEGMENT_W / 2;
    const x2 = x0 + SEGMENT_W;
    const y0 = BASE_Y;
    const y1 = BASE_Y + SAG;
    const y2 = BASE_Y;
    const u = 1 - t;
    return {
        x: u * u * x0 + 2 * u * t * x1 + t * t * x2,
        y: u * u * y0 + 2 * u * t * y1 + t * t * y2,
    };
}

const WIRE = (() => {
    let d = `M0 ${BASE_Y}`;
    for (let s = 0; s < SEGMENTS; s++) {
        const x0 = s * SEGMENT_W;
        d += ` Q${x0 + SEGMENT_W / 2} ${BASE_Y + SAG} ${x0 + SEGMENT_W} ${BASE_Y}`;
    }
    return d;
})();

const BULBS = Array.from({ length: SEGMENTS * BULBS_PER_SEGMENT }, (_, i) => {
    const segment = Math.floor(i / BULBS_PER_SEGMENT);
    const t = ((i % BULBS_PER_SEGMENT) + 0.5) / BULBS_PER_SEGMENT;
    const { x, y } = pointOnArc(segment, t);
    return {
        x,
        y,
        color: COLORS[(i * 5) % COLORS.length],
        delay: -Number(((i * 0.73) % 3.4).toFixed(2)),
    };
});

export default function StringLights() {
    return (
        <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-10 w-full"
            style={{ height: HEIGHT }}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            preserveAspectRatio="xMidYMin slice"
        >
            <path d={WIRE} fill="none" stroke="#64748b" strokeOpacity="0.55" strokeWidth="1.8" strokeLinecap="round" />
            {BULBS.map((b, i) => (
                <g key={i} transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`}>
                    {/* Halo */}
                    <circle className="adv-halo" cy="12" r="17" fill={b.color} opacity="0.1" style={{ animationDelay: `${b.delay}s` }} />
                    <circle className="adv-halo" cy="12" r="10.5" fill={b.color} opacity="0.18" style={{ animationDelay: `${b.delay}s` }} />
                    {/* Culot + ampoule */}
                    <rect x="-2.4" y="-1" width="4.8" height="7.5" rx="1.1" fill="#94a3b8" fillOpacity="0.8" />
                    <ellipse className="adv-bulb" cy="12.5" rx="5" ry="7.4" fill={b.color} style={{ animationDelay: `${b.delay}s` }} />
                    <ellipse cx="-1.7" cy="9.6" rx="1.3" ry="2.3" fill="#fff" opacity="0.6" />
                </g>
            ))}
        </svg>
    );
}
