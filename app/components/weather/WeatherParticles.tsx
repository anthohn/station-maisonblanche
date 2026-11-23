'use client';

import { useEffect, useRef } from 'react';

/**
 * Pluie et neige, dessinées en canvas par-dessus toute la page (comme les feuilles d'automne).
 *
 * - Trois plans de profondeur : les gouttes et flocons lointains sont plus petits, plus lents et plus pâles.
 * - L'intensité (0 → 1) rejoint sa cible en douceur : une averse qui s'arrête s'éteint en une ou deux
 *   secondes, une bruine qui s'installe ne démarre pas d'un coup.
 * - Le vent incline la pluie et pousse la neige.
 * - Rien ne tourne quand il n'y a ni pluie ni neige, ni quand l'onglet est caché.
 * - Si l'appareil peine (moins de ~35 images/s pendant 2,5 s), le nombre de particules et la définition du
 *   canvas diminuent d'eux-mêmes : mieux vaut moins de gouttes qu'un site qui rame.
 * - Pas de montage du tout si l'utilisateur a demandé de réduire les animations (voir WeatherAtmosphere).
 */

interface Props {
    /** Intensité de la pluie, 0 → 1 */
    rain: number;
    /** Intensité de la neige, 0 → 1 */
    snow: number;
    /** Inclinaison du vent : décalage horizontal par pixel de chute (≈ ±0,5 au maximum) */
    slant: number;
}

const RAIN_MAX = 900;
const SNOW_MAX = 520;
const EASE_SECONDS = 1.8;
/** Niveaux d'allègement quand l'appareil peine : [part des particules, définition du canvas] */
const QUALITY_LEVELS = [
    [1, 1],
    [0.55, 0.8],
    [0.3, 0.6],
] as const;

/** Réglages par plan : [vitesse mini, vitesse maxi (px/s), épaisseur, opacité] */
const RAIN_LAYERS = [
    [620, 860, 0.8, 0.2],
    [980, 1260, 1.1, 0.32],
    [1380, 1760, 1.5, 0.46],
] as const;
/** Flocons : [rayon, opacité] pour les trois plans */
const SNOW_LAYERS = [
    [2.1, 0.55],
    [3.3, 0.78],
    [4.8, 0.95],
] as const;

function snowSprite(radius: number): HTMLCanvasElement {
    const size = Math.ceil(radius * 2 + 2);
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = size;
    const ctx = sprite.getContext('2d');
    if (ctx) {
        // Cœur blanc, bord bleuté très doux : le flocon se lit aussi bien sur la photo sombre que sur le fond blanc du site.
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.45, 'rgba(252,253,255,0.95)');
        gradient.addColorStop(0.75, 'rgba(206,219,237,0.6)');
        gradient.addColorStop(1, 'rgba(182,199,225,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
    }
    return sprite;
}

export default function WeatherParticles({ rain, snow, slant }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const target = useRef({ rain: 0, snow: 0, slant: 0 });
    const wake = useRef<() => void>(() => {});

    useEffect(() => {
        target.current = { rain, snow, slant };
        wake.current();
    }, [rain, snow, slant]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        let width = 0;
        let height = 0;
        let level = 0;
        let slowSeconds = 0;
        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            // Définition raisonnable : la pluie et la neige sont douces, inutile de remplir des millions de pixels
            // (le canvas est étiré à la taille de l'écran par le navigateur).
            const quality =
                Math.min(window.devicePixelRatio || 1, 1.25) * (width * height > 1_200_000 ? 0.75 : 1) * QUALITY_LEVELS[level][1];
            canvas.width = Math.round(width * quality);
            canvas.height = Math.round(height * quality);
            ctx.setTransform(quality, 0, 0, quality, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        // ── Réserves de particules (allouées une fois) ──
        const rx = new Float32Array(RAIN_MAX);
        const ry = new Float32Array(RAIN_MAX);
        const rv = new Float32Array(RAIN_MAX);
        const rl = new Uint8Array(RAIN_MAX); // plan 0 (loin) → 2 (près)
        const sx = new Float32Array(SNOW_MAX);
        const sy = new Float32Array(SNOW_MAX);
        const sv = new Float32Array(SNOW_MAX);
        const sPhase = new Float32Array(SNOW_MAX);
        const sFreq = new Float32Array(SNOW_MAX);
        const sSway = new Float32Array(SNOW_MAX);
        const sl = new Uint8Array(SNOW_MAX);
        const sprites = SNOW_LAYERS.map(([radius]) => snowSprite(radius));

        const spanX = (s: number) => (s > 0 ? [-height * s, width] : [0, width - height * s]);
        const place = (i: number, s: number, anywhere: boolean) => {
            const [x0, x1] = spanX(s);
            rx[i] = x0 + Math.random() * (x1 - x0);
            ry[i] = anywhere ? Math.random() * height : -60 - Math.random() * height * 0.25;
        };
        for (let i = 0; i < RAIN_MAX; i++) {
            const layer = i % 3 === 2 ? 2 : i % 3;
            rl[i] = layer;
            const [lo, hi] = RAIN_LAYERS[layer];
            rv[i] = lo + Math.random() * (hi - lo);
            place(i, 0, true);
        }
        for (let i = 0; i < SNOW_MAX; i++) {
            const layer = i % 5 === 4 ? 2 : i % 5 < 2 ? 0 : 1;
            sl[i] = layer;
            sx[i] = Math.random() * width;
            sy[i] = Math.random() * height;
            sv[i] = 26 + layer * 22 + Math.random() * 24;
            sPhase[i] = Math.random() * Math.PI * 2;
            sFreq[i] = 0.5 + Math.random() * 1.1;
            sSway[i] = 8 + Math.random() * 20;
        }

        const current = { rain: 0, snow: 0 };
        let last = 0;
        let frameId = 0;
        let running = false;

        const frame = (time: number) => {
            const elapsed = (time - last) / 1000;
            const dt = Math.min(0.05, elapsed);
            last = time;
            // Suivi de la fluidité : une pause d'onglet (> 0,5 s) ne compte pas.
            if (elapsed > 0.03 && elapsed < 0.5) slowSeconds += elapsed;
            else slowSeconds = Math.max(0, slowSeconds - elapsed * 2);
            if (slowSeconds > 2.5 && level < QUALITY_LEVELS.length - 1) {
                level++;
                slowSeconds = 0;
                resize();
            }
            const goal = target.current;
            const ease = 1 - Math.exp(-dt / EASE_SECONDS);
            current.rain += (goal.rain - current.rain) * ease;
            current.snow += (goal.snow - current.snow) * ease;

            ctx.clearRect(0, 0, width, height);
            const area = width * height;
            const share = QUALITY_LEVELS[level][0];
            const rainCount = Math.round(Math.min(RAIN_MAX, area * 0.00052) * current.rain * share);
            const snowCount = Math.round(Math.min(SNOW_MAX, area * 0.0003) * current.snow * share);

            if (rainCount > 0) {
                const s = goal.slant;
                const norm = 1 / Math.sqrt(1 + s * s);
                const lengthScale = 0.55 + 0.45 * current.rain; // la bruine fait de courts traits, l'averse de longs
                const speedScale = 0.72 + 0.28 * current.rain;
                for (let layer = 0; layer < 3; layer++) {
                    const [, , lineWidth, alpha] = RAIN_LAYERS[layer];
                    ctx.beginPath();
                    for (let i = 0; i < rainCount; i++) {
                        if (rl[i] !== layer) continue;
                        const speed = rv[i] * speedScale;
                        const length = speed * 0.021 * lengthScale;
                        ry[i] += speed * dt;
                        rx[i] += speed * s * dt;
                        if (ry[i] - length > height || rx[i] > width + 60 || rx[i] < -60) place(i, s, false);
                        ctx.moveTo(rx[i], ry[i]);
                        ctx.lineTo(rx[i] - s * length * norm, ry[i] - length * norm);
                    }
                    ctx.strokeStyle = `rgba(112,136,170,${alpha * (0.55 + 0.45 * current.rain)})`;
                    ctx.lineWidth = lineWidth;
                    ctx.stroke();
                }
            }

            if (snowCount > 0) {
                const drift = goal.slant * 190;
                for (let i = 0; i < snowCount; i++) {
                    const layer = sl[i];
                    sPhase[i] += sFreq[i] * dt;
                    sx[i] += (drift + Math.cos(sPhase[i]) * sSway[i]) * dt;
                    sy[i] += sv[i] * dt * (0.8 + 0.4 * current.snow);
                    const [radius, alpha] = SNOW_LAYERS[layer];
                    if (sy[i] > height + radius) {
                        sy[i] = -radius;
                        sx[i] = Math.random() * width;
                    }
                    if (sx[i] < -20) sx[i] = width + 20;
                    else if (sx[i] > width + 20) sx[i] = -20;
                    ctx.globalAlpha = alpha;
                    ctx.drawImage(sprites[layer], sx[i] - radius, sy[i] - radius);
                }
                ctx.globalAlpha = 1;
            }

            if (current.rain < 0.004 && current.snow < 0.004 && goal.rain === 0 && goal.snow === 0) {
                running = false;
                ctx.clearRect(0, 0, width, height);
                return; // plus rien à animer : la boucle s'arrête jusqu'à la prochaine averse
            }
            frameId = requestAnimationFrame(frame);
        };

        const start = () => {
            if (running || document.hidden) return;
            running = true;
            last = performance.now();
            frameId = requestAnimationFrame(frame);
        };
        wake.current = start;

        const onVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(frameId);
                running = false;
            } else if (target.current.rain > 0 || target.current.snow > 0) {
                start();
            }
        };
        document.addEventListener('visibilitychange', onVisibility);
        start();

        return () => {
            cancelAnimationFrame(frameId);
            running = false;
            wake.current = () => {};
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', onVisibility);
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 h-full w-full" />;
}
