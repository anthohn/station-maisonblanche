import type { Mood } from '@/lib/mood';

/**
 * Pose une ambiance (lib/mood.ts) sur la page : variables CSS sur <html>, textures à charger,
 * vitesse et sens de dérive du brouillard.
 *
 * Soin particulier pour que tout apparaisse en fondu, jamais d'un coup : un calque à texture
 * (brouillard, ciel, enseigne…) n'est révélé qu'une fois sa texture chargée ; le reste (étalonnage
 * de la photo, lumière) est appliqué tout de suite.
 */

const TEXTURES = {
    fog: ['/weather/fog-a.webp', '/weather/fog-b.webp'],
    sky: ['/weather/sky-mask.webp'],
    shade: ['/weather/clouds.webp'],
    deck: ['/weather/sky-clouds.webp'],
    stars: ['/weather/stars.svg'],
    lights: ['/weather/sign-lit.webp'],
    windows: ['/weather/windows-lit.webp'],
    snow: ['/weather/snow-roof.webp'],
} as const;
type Need = keyof typeof TEXTURES;

/** Variables qui commandent un calque à texture, et ce dont il a besoin. */
const NEEDS_OF: Record<string, Need[]> = {
    '--wx-sky': ['sky'],
    '--wx-sky-clouds': ['sky', 'deck'],
    '--wx-stars': ['sky', 'stars'],
    '--wx-lights': ['lights'],
    '--wx-windows': ['windows'],
    '--wx-snowcover': ['snow'],
    '--wx-fog-a': ['fog'],
    '--wx-fog-b': ['fog'],
    '--wx-shade': ['shade', 'sky'],
};

/** Vitesse de chaque couche par rapport à la dérive de base (profondeur : le lointain bouge moins). */
const LAYER_SPEED: Record<string, number> = { 'fog-a': 1, 'fog-b': 0.68, clouds: 0.55, shade: 1.25 };

const loaded = new Set<Need>();
const loading = new Map<Need, Promise<void>>();

function load(need: Need): Promise<void> {
    let promise = loading.get(need);
    if (!promise) {
        promise = Promise.all(
            TEXTURES[need].map(
                (src) =>
                    new Promise<void>((resolve) => {
                        const image = new Image();
                        image.onload = image.onerror = () => resolve();
                        image.src = src;
                    }),
            ),
        ).then(() => {
            loaded.add(need);
        });
        loading.set(need, promise);
    }
    return promise;
}

let generation = 0;

export function applyMood(mood: Mood) {
    const root = document.documentElement;
    const mine = ++generation;
    const wanted = (Object.keys(mood.needs) as Need[]).filter((need) => mood.needs[need]);

    // Un calque dont la valeur est nulle (ou dont la texture est prête) peut être mis à jour sans attendre.
    const isReady = (name: string) => (NEEDS_OF[name] ?? []).every((need) => !mood.needs[need] || loaded.has(need));
    const entries = Object.entries(mood.vars);

    const reveal = (needs: Need[], variables: [string, string][]) => {
        // 1. on affiche les calques (opacité encore nulle) ; 2. on force le calcul des styles ; 3. on pose les
        // valeurs : le navigateur anime alors le passage de 0 à la valeur, au lieu de la montrer d'un coup.
        const tokens = new Set((root.dataset.wx ?? '').split(' ').filter(Boolean));
        needs.forEach((need) => tokens.add(need)); // on ne retire jamais un jeton : le calque fond vers 0 puis reste inerte
        root.dataset.wx = [...tokens].join(' ');
        void root.offsetWidth;
        for (const [name, value] of variables) root.style.setProperty(name, value);
        driftLayers(mood);
    };

    reveal(
        wanted.filter((need) => loaded.has(need)),
        entries.filter(([name]) => isReady(name)),
    );

    const pending = wanted.filter((need) => !loaded.has(need));
    if (pending.length) {
        const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2500));
        void Promise.race([Promise.all(pending.map(load)), timeout]).then(() => {
            if (mine !== generation) return; // une ambiance plus récente a pris le relais
            reveal(
                pending,
                entries.filter(([name]) => (NEEDS_OF[name] ?? []).some((need) => pending.includes(need))),
            );
        });
    }
}

/**
 * Règle sens et vitesse de la dérive avec l'API Web Animations : la vitesse change en douceur, sans saut
 * (changer la durée en CSS ferait sauter l'animation). Un sens inverse suppose que l'animation soit déjà
 * avancée : on la place donc 50 tuiles plus loin au départ (plusieurs heures de dérive dans chaque sens).
 */
function driftLayers(mood: Mood) {
    requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('.wx-drift').forEach((layer) => {
            const speed = LAYER_SPEED[layer.dataset.wxLayer ?? ''] ?? 1;
            // getAnimations() renvoie aussi les transitions CSS en cours (les fondus) : on ne garde que la dérive.
            const animations = layer.getAnimations().filter((a) => (a as CSSAnimation).animationName === 'wx-drift');
            for (const animation of animations) {
                if (!layer.dataset.wxStarted) animation.currentTime = 240_000 * 50;
                // L'animation fait glisser la couche vers la gauche : lue à l'envers, elle va vers la droite.
                animation.updatePlaybackRate(-mood.drift.direction * mood.drift.rate * speed);
            }
            if (animations.length) layer.dataset.wxStarted = '1';
        });
    });
}

/** Éclair d'orage : rejoue l'animation du calque « flash » (voir .wx-flash dans globals.css). */
export function flashLightning() {
    document.querySelectorAll<HTMLElement>('.wx-flash').forEach((flash) => {
        flash.classList.remove('is-on');
        void flash.offsetWidth;
        flash.classList.add('is-on');
        flash.addEventListener('animationend', () => flash.classList.remove('is-on'), { once: true });
    });
}
