import type { Mood } from '@/lib/mood';

/**
 * Pose une ambiance (lib/mood.ts) sur la page : variables CSS sur <html>, texture de brume à charger,
 * vitesse et sens de dérive de la brume.
 *
 * Soin particulier pour que tout apparaisse en fondu, jamais d'un coup : la brume (qui a une texture)
 * n'est révélée qu'une fois sa texture chargée ; le voile de lumière est appliqué tout de suite.
 */

const FOG_TEXTURE = '/weather/fog-page.webp';
const FOG_VAR = '--wx-page-fog';

/** Vitesse de la brume par rapport à la dérive de base. */
const FOG_SPEED = 0.8;

/** Quand le système demande moins d'animations, la brume ne fait plus que flotter. */
const CALM_FACTOR = 0.2;

let fogLoaded = false;
let fogLoading: Promise<void> | undefined;

function loadFog(): Promise<void> {
    if (!fogLoading) {
        fogLoading = new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = image.onerror = () => resolve();
            image.src = FOG_TEXTURE;
        }).then(() => {
            fogLoaded = true;
        });
    }
    return fogLoading;
}

let generation = 0;

export function applyMood(mood: Mood, calm = false) {
    const root = document.documentElement;
    const mine = ++generation;
    const variables = Object.entries(mood.vars);
    const waitForFog = mood.needs.pagefog && !fogLoaded; // seule la brume attend sa texture

    const reveal = (fog: boolean, entries: [string, string][]) => {
        // 1. on affiche le calque (opacité encore nulle) ; 2. on force le calcul des styles ; 3. on pose les
        // valeurs : le navigateur anime alors le passage de 0 à la valeur, au lieu de la montrer d'un coup.
        if (fog) root.dataset.wx = 'pagefog'; // jamais retiré : le calque fond vers 0 puis reste inerte
        void root.offsetWidth;
        for (const [name, value] of entries) root.style.setProperty(name, value);
        driftLayers(mood, calm);
    };

    reveal(mood.needs.pagefog && fogLoaded, waitForFog ? variables.filter(([name]) => name !== FOG_VAR) : variables);

    if (waitForFog) {
        const timeout = new Promise<void>((resolve) => setTimeout(resolve, 2500));
        void Promise.race([loadFog(), timeout]).then(() => {
            if (mine !== generation) return; // une ambiance plus récente a pris le relais
            reveal(true, variables.filter(([name]) => name === FOG_VAR));
        });
    }
}

/**
 * Règle sens et vitesse de la dérive avec l'API Web Animations : la vitesse change en douceur, sans saut
 * (changer la durée en CSS ferait sauter l'animation). Un sens inverse suppose que l'animation soit déjà
 * avancée : on la place donc 50 tuiles plus loin au départ (plusieurs heures de dérive dans chaque sens).
 */
let driftFrame = 0;

function driftLayers(mood: Mood, calm: boolean) {
    // Un seul réglage en attente, le dernier : dans un onglet caché les images ne s'affichent pas, et les réglages s'empileraient.
    cancelAnimationFrame(driftFrame);
    driftFrame = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>('.wx-drift').forEach((layer) => {
            // getAnimations() renvoie aussi les transitions CSS en cours (les fondus) : on ne garde que la dérive.
            const animations = layer.getAnimations().filter((a) => (a as CSSAnimation).animationName === 'wx-drift');
            for (const animation of animations) {
                if (!layer.dataset.wxStarted) animation.currentTime = 240_000 * 50;
                // L'animation fait glisser la couche vers la gauche : lue à l'envers, elle va vers la droite.
                animation.updatePlaybackRate(-mood.drift.direction * mood.drift.rate * FOG_SPEED * (calm ? CALM_FACTOR : 1));
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
