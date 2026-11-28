'use client';

import { useEffect, useRef } from 'react';

/**
 * Pluie, neige et feuilles d'automne, dessinées en canvas par-dessus toute la page.
 *
 * - Trois plans de profondeur : le lointain est plus petit, plus lent et plus pâle.
 * - L'intensité (0 → 1) rejoint sa cible en douceur : une averse qui s'arrête s'éteint en une ou deux
 *   secondes, une bruine qui s'installe ne démarre pas d'un coup.
 * - Le même vent incline la pluie, pousse la neige et fait dériver les feuilles.
 * - Plus présents en haut de l'écran qu'en bas (le ciel) : le texte du bas reste net.
 * - Mode adouci (le système demande moins d'animations) : 40 % des particules, deux fois plus lentes.
 * - Rien ne tourne quand il n'y a rien à montrer, ni quand l'onglet est caché.
 * - Si l'appareil peine (moins de ~35 images/s pendant 2,5 s), le nombre de particules et la définition du
 *   canvas diminuent d'eux-mêmes : mieux vaut moins de gouttes qu'un site qui rame.
 */

interface Props {
    /** Intensité de la pluie, 0 → 1 */
    rain: number;
    /** Intensité de la neige, 0 → 1 */
    snow: number;
    /** Feuilles d'automne, 0 ou 1 */
    leaves: number;
    /** Inclinaison du vent : décalage horizontal par pixel de chute (≈ ±0,5 au maximum) */
    slant: number;
    /** Luminosité générale, 0 → 1 : les feuilles s'éteignent avec le jour */
    lum: number;
    /** Le système demande moins d'animations : on adoucit */
    calm: boolean;
}

const RAIN_MAX = 900;
const SNOW_MAX = 520;
const LEAF_MAX = 14;
const EASE_SECONDS = 1.8;
const CALM_SHARE = 0.4; // part des particules en mode adouci
const CALM_MOTION = 0.5; // vitesse relative en mode adouci

/** Niveaux d'allègement quand l'appareil peine : [part des particules, définition du canvas] */
const QUALITY_LEVELS = [
    [1, 1],
    [0.55, 0.8],
    [0.3, 0.6],
] as const;

/** Réglages de la pluie par plan : [vitesse mini, vitesse maxi (px/s), épaisseur, opacité] */
const RAIN_LAYERS = [
    [620, 860, 0.8, 0.26],
    [980, 1260, 1.1, 0.4],
    [1380, 1760, 1.5, 0.56],
] as const;
/** Flocons : [rayon, opacité] pour les trois plans */
const SNOW_LAYERS = [
    [2.1, 0.55],
    [3.3, 0.78],
    [4.8, 0.95],
] as const;

/** Formes des feuilles (les mêmes que l'ancien AutumnLeaves) : érable, chêne, hêtre. */
const LEAF_SHAPES = [
    {
        path: 'M14 2C15.2 4.5 17.5 5.5 20 4.5C18.8 7 21.2 9.2 24.5 9.2C22.2 11.5 23.5 13.8 26 15C22.5 16.2 21.2 18.5 22.5 22C19 20.8 16.5 22 15.2 25.5C14 23.2 14 20.8 12.8 20.8C11.5 20.8 11.5 23.2 10.2 25.5C9 22 6.5 20.8 3 22C4.2 18.5 3 16.2 -0.5 15C2 13.8 3.2 11.5 1 9.2C4.2 9.2 6.8 7 5.5 4.5C8 5.5 10.2 4.5 11.5 2L12.8 0L14 2Z',
        width: 26,
        height: 26,
    },
    {
        path: 'M12 0C14.5 2.5 18 3.8 17 7.5C19.5 8.8 22 12.5 19.5 16.2C22 18.8 20.8 22.5 17 25C14.5 27.5 13.2 31.2 12 32.5C10.8 31.2 9.5 27.5 7 25C3.2 22.5 2 18.8 4.5 16.2C2 12.5 4.5 8.8 7 7.5C6 3.8 9.5 2.5 12 0Z',
        width: 24,
        height: 33,
    },
    {
        path: 'M12 0C18 6 21.5 14.5 19 21.5C17 27.5 13.2 31 12 32.5C10.8 31 7 27.5 5 21.5C2.5 14.5 6 6 12 0Z',
        width: 24,
        height: 33,
    },
] as const;
/** Couleurs d'automne : vives au premier plan, plus sourdes au loin. */
const LEAF_COLORS_NEAR = ['#EA580C', '#DC2626', '#D97706', '#F97316', '#C2410C'];
const LEAF_COLORS_FAR = ['#B45309', '#92400E', '#78350F'];
const LEAF_SPRITE_SIZE = 64;

function snowSprite(radius: number): HTMLCanvasElement {
    const size = Math.ceil(radius * 2 + 2);
    const sprite = document.createElement('canvas');
    sprite.width = sprite.height = size;
    const ctx = sprite.getContext('2d');
    if (ctx) {
        // Cœur blanc, bord bleuté très doux : le flocon se lit aussi bien sur la photo que sur le fond blanc du site.
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

function leafSprite(shape: (typeof LEAF_SHAPES)[number], color: string): HTMLCanvasElement {
    const pad = 6; // marge pour l'ombre portée
    const k = LEAF_SPRITE_SIZE / Math.max(shape.width, shape.height);
    const sprite = document.createElement('canvas');
    sprite.width = Math.ceil(shape.width * k + pad * 2);
    sprite.height = Math.ceil(shape.height * k + pad * 2);
    const ctx = sprite.getContext('2d');
    if (ctx) {
        ctx.translate(pad, pad);
        ctx.scale(k, k);
        ctx.shadowColor = 'rgba(0,0,0,0.2)';
        ctx.shadowBlur = 5;
        ctx.shadowOffsetY = 2;
        ctx.fillStyle = color;
        ctx.fill(new Path2D(shape.path));
    }
    return sprite;
}

// Les sprites ne sont dessinées qu'à la première utilisation : par beau temps (la plupart des visites), rien n'est
// construit ni gardé en mémoire. Feuilles : une sprite par forme et par couleur, au premier plan (vives) et au loin (sourdes).
let snowSprites: HTMLCanvasElement[] | undefined;
let leafSprites: { near: HTMLCanvasElement[]; far: HTMLCanvasElement[] } | undefined;
const getSnowSprites = () => (snowSprites ??= SNOW_LAYERS.map(([radius]) => snowSprite(radius)));
const getLeafSprites = () =>
    (leafSprites ??= {
        near: LEAF_SHAPES.flatMap((shape) => LEAF_COLORS_NEAR.map((color) => leafSprite(shape, color))),
        far: LEAF_SHAPES.flatMap((shape) => LEAF_COLORS_FAR.map((color) => leafSprite(shape, color))),
    });

export default function WeatherParticles({ rain, snow, leaves, slant, lum, calm }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const target = useRef({ rain: 0, snow: 0, leaves: 0, slant: 0, lum: 1, calm: false });
    const wake = useRef<() => void>(() => {});

    useEffect(() => {
        target.current = { rain, snow, leaves, slant, lum, calm };
        wake.current();
    }, [rain, snow, leaves, slant, lum, calm]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        let width = 0;
        let height = 0;
        let level = 0;
        let slowSeconds = 0;
        let fade: CanvasGradient;
        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            // Définition raisonnable : tout ceci est doux, inutile de remplir des millions de pixels
            // (le canvas est étiré à la taille de l'écran par le navigateur).
            const quality =
                Math.min(window.devicePixelRatio || 1, 1.25) * (width * height > 1_200_000 ? 0.75 : 1) * QUALITY_LEVELS[level][1];
            canvas.width = Math.round(width * quality);
            canvas.height = Math.round(height * quality);
            ctx.setTransform(quality, 0, 0, quality, 0, 0);
            // Allègement vers le bas de l'écran : plus présent en haut (le ciel), presque effacé de moitié en bas
            fade = ctx.createLinearGradient(0, 0, 0, height);
            fade.addColorStop(0, 'rgba(0,0,0,0)');
            fade.addColorStop(1, 'rgba(0,0,0,0.5)');
        };
        resize();
        window.addEventListener('resize', resize);

        // ── Réserves de particules (allouées une fois) ──
        const rx = new Float32Array(RAIN_MAX);
        const ry = new Float32Array(RAIN_MAX);
        const rv = new Float32Array(RAIN_MAX);
        const sx = new Float32Array(SNOW_MAX);
        const sy = new Float32Array(SNOW_MAX);
        const sv = new Float32Array(SNOW_MAX);
        const sPhase = new Float32Array(SNOW_MAX);
        const sFreq = new Float32Array(SNOW_MAX);
        const sSway = new Float32Array(SNOW_MAX);
        const sl = new Uint8Array(SNOW_MAX);

        const lx = new Float32Array(LEAF_MAX);
        const ly = new Float32Array(LEAF_MAX);
        const lSize = new Float32Array(LEAF_MAX);
        const lVy = new Float32Array(LEAF_MAX);
        const lPhase = new Float32Array(LEAF_MAX);
        const lFreq = new Float32Array(LEAF_MAX);
        const lSway = new Float32Array(LEAF_MAX);
        const lAngle = new Float32Array(LEAF_MAX);
        const lSpin = new Float32Array(LEAF_MAX);
        const lAlpha = new Float32Array(LEAF_MAX);
        const lSprite: (HTMLCanvasElement | undefined)[] = []; // choisie au premier dessin de la feuille
        const leafSpriteOf = (i: number) => {
            const pool = getLeafSprites()[i % 5 < 3 ? 'near' : 'far'];
            return pool[Math.floor(Math.random() * pool.length)];
        };

        const spanX = (s: number) => (s > 0 ? [-height * s, width] : [0, width - height * s]);
        const place = (i: number, s: number, anywhere: boolean) => {
            const [x0, x1] = spanX(s);
            rx[i] = x0 + Math.random() * (x1 - x0);
            ry[i] = anywhere ? Math.random() * height : -60 - Math.random() * height * 0.25;
        };
        for (let i = 0; i < RAIN_MAX; i++) {
            const [lo, hi] = RAIN_LAYERS[i % 3]; // plan d'une goutte : i % 3, de 0 (loin) à 2 (près)
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
        for (let i = 0; i < LEAF_MAX; i++) {
            const near = i % 5 < 3;
            lSize[i] = near ? 36 + Math.random() * 10 : 18 + Math.random() * 8;
            lVy[i] = near ? 52 + Math.random() * 26 : 30 + Math.random() * 16;
            lSway[i] = near ? 38 + Math.random() * 24 : 22 + Math.random() * 14;
            lFreq[i] = 0.35 + Math.random() * 0.3;
            lPhase[i] = Math.random() * Math.PI * 2;
            lAngle[i] = Math.random() * Math.PI * 2;
            lSpin[i] = (Math.random() < 0.5 ? -1 : 1) * (0.3 + Math.random() * 0.6);
            lAlpha[i] = near ? 0.85 : 0.42;
            lx[i] = Math.random() * width;
            ly[i] = Math.random() * height;
        }

        const current = { rain: 0, snow: 0, leaves: 0 };
        let last = 0;
        let frameId = 0;
        let running = false;
        // Plus rien à montrer ni à éteindre : ni cible, ni reste visible. Alors aucune image n'est dessinée.
        const idle = () =>
            current.rain < 0.004 &&
            current.snow < 0.004 &&
            current.leaves < 0.004 &&
            target.current.rain === 0 &&
            target.current.snow === 0 &&
            target.current.leaves === 0;

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
            current.leaves += (goal.leaves - current.leaves) * ease;

            ctx.clearRect(0, 0, width, height);
            const area = width * height;
            const share = QUALITY_LEVELS[level][0] * (goal.calm ? CALM_SHARE : 1);
            const motion = goal.calm ? CALM_MOTION : 1;
            const rainCount = Math.round(Math.min(RAIN_MAX, area * 0.0006) * current.rain * share);
            const snowCount = Math.round(Math.min(SNOW_MAX, area * 0.0003) * current.snow * share);
            const leafCount = Math.round(LEAF_MAX * current.leaves * Math.max(share, 0.35));

            if (rainCount > 0) {
                const s = goal.slant;
                const norm = 1 / Math.sqrt(1 + s * s);
                const lengthScale = 0.55 + 0.45 * current.rain; // la bruine fait de courts traits, l'averse de longs
                const speedScale = (0.72 + 0.28 * current.rain) * motion;
                for (let layer = 0; layer < 3; layer++) {
                    const [, , lineWidth, alpha] = RAIN_LAYERS[layer];
                    ctx.beginPath();
                    for (let i = layer; i < rainCount; i += 3) {
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
                const sprites = getSnowSprites();
                const drift = goal.slant * 190 * motion;
                for (let i = 0; i < snowCount; i++) {
                    const layer = sl[i];
                    sPhase[i] += sFreq[i] * dt * motion;
                    sx[i] += (drift + Math.cos(sPhase[i]) * sSway[i] * motion) * dt;
                    sy[i] += sv[i] * dt * (0.8 + 0.4 * current.snow) * motion;
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

            if (leafCount > 0) {
                const drift = goal.slant * 220 * motion;
                const dim = 0.35 + 0.65 * goal.lum; // la nuit, les feuilles s'éteignent avec le jour
                for (let i = 0; i < leafCount; i++) {
                    lPhase[i] += lFreq[i] * dt * motion;
                    lx[i] += (drift + Math.cos(lPhase[i]) * lSway[i] * motion) * dt;
                    ly[i] += lVy[i] * dt * motion;
                    // Une feuille ne tourne pas à vitesse constante : elle vrille, puis se laisse porter
                    lAngle[i] += (lSpin[i] + Math.sin(lPhase[i] * 1.7) * 0.7) * dt * motion;
                    const size = lSize[i];
                    if (ly[i] > height + size) {
                        ly[i] = -size;
                        lx[i] = Math.random() * width;
                    }
                    if (lx[i] < -size) lx[i] = width + size;
                    else if (lx[i] > width + size) lx[i] = -size;
                    // Elle apparaît en haut et s'efface en bas, comme les anciennes feuilles
                    const visible = Math.min(1, (ly[i] + size) / 100, (height + size - ly[i]) / 140);
                    if (visible <= 0) continue;
                    const sprite = (lSprite[i] ??= leafSpriteOf(i));
                    const k = size / LEAF_SPRITE_SIZE;
                    ctx.globalAlpha = lAlpha[i] * visible * dim;
                    ctx.save();
                    ctx.translate(lx[i], ly[i]);
                    ctx.rotate(lAngle[i]);
                    ctx.drawImage(sprite, (-sprite.width * k) / 2, (-sprite.height * k) / 2, sprite.width * k, sprite.height * k);
                    ctx.restore();
                }
                ctx.globalAlpha = 1;
            }

            // Allègement vers le bas de l'écran
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = fade;
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = 'source-over';

            if (idle()) {
                running = false;
                ctx.clearRect(0, 0, width, height);
                return; // plus rien à animer : la boucle s'arrête jusqu'à la prochaine averse
            }
            frameId = requestAnimationFrame(frame);
        };

        const start = () => {
            if (running || document.hidden || idle()) return;
            running = true;
            last = performance.now();
            frameId = requestAnimationFrame(frame);
        };
        wake.current = start;

        const onVisibility = () => {
            if (document.hidden) {
                cancelAnimationFrame(frameId);
                running = false;
            } else {
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
