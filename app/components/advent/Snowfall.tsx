'use client';

import { useEffect, useRef } from 'react';

interface Flake {
    x: number;
    y: number;
    r: number;
    speed: number;
    drift: number;
    phase: number;
    alpha: number;
}

/**
 * Neige douce dessinée sur un canvas.
 *
 * - Le canvas ne couvre que la zone visible (position: sticky), jamais toute
 *   la page : coût constant, quelle que soit la hauteur du calendrier.
 * - Trois profondeurs : les gros flocons tombent plus vite et sont plus nets.
 * - Se met en pause hors écran et onglet masqué.
 * - « Réduire les animations » : le balisage est TOUJOURS identique côté serveur
 *   et côté client (sinon React signale un désaccord d'hydratation). C'est le CSS
 *   (`.adv-snow`) qui masque le canvas, et l'effet qui n'anime rien.
 */
export default function Snowfall() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const media = window.matchMedia('(prefers-reduced-motion: reduce)');

        const start = () => {
            let width = 0;
            let height = 0;
            let flakes: Flake[] = [];
            let frame = 0;
            let last = 0;
            let onScreen = true;

            const spawn = (initial: boolean): Flake => {
                const depth = Math.random();
                return {
                    x: Math.random() * width,
                    y: initial ? Math.random() * height : -10,
                    r: 0.8 + depth * depth * 2.6,
                    speed: 14 + depth * 38,
                    drift: 6 + depth * 16,
                    phase: Math.random() * Math.PI * 2,
                    alpha: 0.35 + depth * 0.55,
                };
            };

            const resize = () => {
                const rect = canvas.getBoundingClientRect();
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                width = rect.width;
                height = rect.height;
                canvas.width = Math.round(width * dpr);
                canvas.height = Math.round(height * dpr);
                ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

                const target = Math.round(Math.min(120, Math.max(36, (width * height) / 13000)));
                if (flakes.length > target) flakes = flakes.slice(0, target);
                while (flakes.length < target) flakes.push(spawn(true));
            };

            const draw = (time: number) => {
                frame = requestAnimationFrame(draw);
                if (!onScreen || document.hidden) {
                    last = 0;
                    return;
                }
                const dt = last ? Math.min((time - last) / 1000, 0.05) : 0;
                last = time;

                ctx.clearRect(0, 0, width, height);
                for (let i = 0; i < flakes.length; i++) {
                    const f = flakes[i];
                    f.y += f.speed * dt;
                    f.x += Math.sin(time / 1700 + f.phase) * f.drift * dt;
                    if (f.y > height + 10) flakes[i] = spawn(false);
                    if (f.x < -10) f.x = width + 10;
                    else if (f.x > width + 10) f.x = -10;

                    ctx.beginPath();
                    ctx.fillStyle = `rgba(255,255,255,${f.alpha})`;
                    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
                    ctx.fill();
                }
            };

            resize();
            const resizeObserver = new ResizeObserver(resize);
            resizeObserver.observe(canvas);
            const visibilityObserver = new IntersectionObserver(([entry]) => {
                onScreen = entry.isIntersecting;
            });
            visibilityObserver.observe(canvas);
            frame = requestAnimationFrame(draw);

            return () => {
                cancelAnimationFrame(frame);
                resizeObserver.disconnect();
                visibilityObserver.disconnect();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            };
        };

        // On suit le réglage du système en direct : activer « réduire les animations » arrête la neige.
        let stop: (() => void) | undefined;
        const sync = () => {
            stop?.();
            stop = media.matches ? undefined : start();
        };
        sync();
        media.addEventListener('change', sync);

        return () => {
            media.removeEventListener('change', sync);
            stop?.();
        };
    }, []);

    return (
        <div aria-hidden="true" className="adv-snow pointer-events-none absolute inset-0 z-[5]">
            <canvas ref={canvasRef} className="sticky top-0 block h-svh w-full" />
        </div>
    );
}
