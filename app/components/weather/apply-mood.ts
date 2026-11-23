import type { Mood } from '@/lib/mood';

/**
 * Pose une ambiance (lib/mood.ts) sur la page : variables CSS sur <html>, texture de brume à charger,
 * vitesse et sens de dérive de la brume.
 *
 * Soin particulier pour que tout apparaisse en fondu, jamais d'un coup : la brume (qui a une texture)
 * n'est révélée qu'une fois sa texture chargée ; le voile de lumière est appliqué tout de suite.
 */

const TEXTURES = {
    pagefog: ['/weather/fog-page.webp'],
} as const;
type Need = keyof typeof TEXTURES;

/** Variables qui commandent un calque à texture, et ce dont il a besoin. */
const NEEDS_OF: Record<string, Need[]> = {
    '--wx-page-fog': ['pagefog'],
};

/** Vitesse de chaque couche par rapport à la dérive de base. */
const LAYER_SPEED: Record<string, number> = { 'page-fog': 0.8 };

/** Quand le système demande moins d'animations, la brume ne fait plus que flotter. */
const CALM_FACTOR = 0.2;

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

export function applyMood(mood: Mood, calm = false) {
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
        driftLayers(mood, calm);
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
function driftLayers(mood: Mood, calm: boolean) {
    requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('.wx-drift').forEach((layer) => {
            const speed = LAYER_SPEED[layer.dataset.wxLayer ?? ''] ?? 1;
            // getAnimations() renvoie aussi les transitions CSS en cours (les fondus) : on ne garde que la dérive.
            const animations = layer.getAnimations().filter((a) => (a as CSSAnimation).animationName === 'wx-drift');
            for (const animation of animations) {
                if (!layer.dataset.wxStarted) animation.currentTime = 240_000 * 50;
                // L'animation fait glisser la couche vers la gauche : lue à l'envers, elle va vers la droite.
                animation.updatePlaybackRate(-mood.drift.direction * mood.drift.rate * speed * (calm ? CALM_FACTOR : 1));
            }
            if (animations.length) layer.dataset.wxStarted = '1';
        });
    });
}

/**
 * Éclair d'orage : lève un instant le voile de toute la page (elle s'éclaircit). Voir .wx-page-veil dans weather.css.
 */
export function flashLightning() {
    document.querySelectorAll<HTMLElement>('.wx-page-veil').forEach((element) => {
        element.classList.remove('is-flash');
        void element.offsetWidth;
        element.classList.add('is-flash');
        element.addEventListener('animationend', () => element.classList.remove('is-flash'), { once: true });
    });
}
