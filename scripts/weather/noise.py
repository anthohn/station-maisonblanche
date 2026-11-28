"""Bruit fractal périodique (sans couture) et petits outils communs aux scripts de génération."""
import numpy as np
from PIL import Image


def fractal(w, h, octaves, cutoff, seed, hp=0.0):
    """Bruit fractal PÉRIODIQUE (il se raccorde à lui-même), filtré dans le spectre.

    octaves : liste de (exposant, poids) ; cutoff : filtre passe-bas (plus petit = formes plus larges) ;
    hp : filtre passe-haut (retire les très grandes structures).
    Résultat normalisé entre 0 et 1.
    """
    rng = np.random.default_rng(seed)
    fy = np.fft.fftfreq(h)[:, None]
    fx = np.fft.fftfreq(w)[None, :]
    r = np.sqrt(fx ** 2 + fy ** 2)
    r[0, 0] = 1
    lowpass = np.exp(-(r / cutoff) ** 2)
    if hp:
        lowpass = lowpass * (1 - np.exp(-(r / hp) ** 2))
    out = np.zeros((h, w))
    for expo, weight in octaves:
        f = np.fft.fft2(rng.standard_normal((h, w)))
        f = f / (r ** expo) * lowpass
        f[0, 0] = 0
        n = np.real(np.fft.ifft2(f))
        out += weight * (n - n.mean()) / n.std()
    lo, hi = np.percentile(out, [2, 98])
    return np.clip((out - lo) / (hi - lo), 0, 1)


def smooth(x, a, b):
    t = np.clip((x - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)


def save_alpha(alpha, color, path, quality=70, alpha_quality=70):
    """Texture RGBA : une couleur unie, la forme est dans le canal alpha."""
    h, w = alpha.shape
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = color
    rgba[..., 3] = np.clip(alpha * 255, 0, 255).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(path, quality=quality, alpha_quality=alpha_quality, method=6)
