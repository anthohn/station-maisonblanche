#!/usr/bin/env python3
"""Textures de la météo qui ne dépendent PAS de la photo d'accueil : brouillard, ombres de nuages,
mottelage du ciel couvert, étoiles. Dépendances : numpy, Pillow.

    python3 scripts/weather/make_textures.py            # écrit dans public/weather
    python3 scripts/weather/make_textures.py --out DIR  # ailleurs (pour comparer)

Tout est déterministe (graines fixes) : relancer le script redonne les mêmes fichiers.
"""
import argparse
import os
import random
from pathlib import Path

import numpy as np
from PIL import Image

from noise import fractal, save_alpha, smooth

ROOT = Path(__file__).resolve().parents[2]


def main(out: Path):
    out.mkdir(parents=True, exist_ok=True)

    # Profondeur : la brume est entière jusqu'à 45 % de la hauteur, puis s'allège jusqu'à 26 % au premier plan.
    # (Cuit dans la texture : un masque CSS sur une couche qui bouge coûterait cher à chaque image.)
    y = np.linspace(0, 1, 512)[:, None]
    fade = np.where(y < 0.45, 1.0, 1.0 - (y - 0.45) / 0.55 * 0.74)

    # Brume fine : volutes douces et effilées
    n = fractal(1024, 512, [(1.5, 1.0), (2.1, 0.8)], cutoff=0.10, seed=11)
    save_alpha(smooth(n, 0.22, 0.92) * 0.95 * fade, (238, 242, 247), out / "fog-a.webp")

    # Brume large : masses lentes
    n = fractal(1024, 512, [(1.3, 1.0), (1.9, 0.9)], cutoff=0.045, seed=29, hp=0.004)
    save_alpha(smooth(n, 0.18, 0.95) * fade, (232, 237, 243), out / "fog-b.webp")

    # Brume de la page entière : mêmes masses que fog-b mais d'un gris bleuté, posée en multiplication sur la page
    # (une brume blanche resterait invisible sur un fond blanc)
    n = fractal(1024, 512, [(1.3, 1.0), (1.9, 0.9)], cutoff=0.045, seed=29, hp=0.004)
    page_fade = np.where(y < 0.4, 1.0, 1.0 - (y - 0.4) / 0.6)  # jusqu'à zéro en bas : pas d'arête visible où la couche s'arrête
    save_alpha(smooth(n, 0.18, 0.95) * page_fade, (150, 162, 178), out / "fog-page.webp")

    # Ombres de nuages (façade, par temps à éclaircies) : plaques moyennes à bord très doux
    n = fractal(1024, 512, [(1.2, 1.0), (1.8, 0.35)], cutoff=0.0115, seed=47, hp=0.0032)
    save_alpha(smooth(n, 0.42, 0.80) * 0.92, (16, 24, 42), out / "clouds.webp")

    # Mottelage du ciel couvert : gris autour de 0,5, utilisé en fusion « soft-light » sur le dégradé du ciel
    n = fractal(1024, 512, [(1.35, 1.0), (1.9, 0.75), (2.4, 0.35)], cutoff=0.075, seed=5, ax=2.4, hp=0.004)
    g = 0.5 + (smooth(n, 0.08, 0.92) - 0.5) * 0.66
    Image.fromarray((g * 255).astype(np.uint8), "L").convert("RGB").save(out / "sky-clouds.webp", "WEBP", quality=62, method=6)

    # Étoiles : champ clairsemé (54 étoiles) sur la partie « ciel » de la photo (56 % de sa hauteur)
    random.seed(7)
    width, height, stars = 1000, 420, []
    while len(stars) < 54:
        x, y_ = random.uniform(8, width - 8), random.uniform(6, height - 10)
        if all((x - a) ** 2 + (y_ - b) ** 2 > 46**2 for a, b, _, _ in stars):
            r = random.choice([0.7, 0.8, 0.9, 1.0, 1.1, 1.25, 1.5, 1.8]) if random.random() > 0.12 else random.choice([1.95, 2.2])
            o = round(random.uniform(0.35, 0.95) if r < 1.9 else 1, 2)
            stars.append((round(x, 1), round(y_, 1), r, o))
    colors = ["#ffffff", "#f3f6ff", "#dbe6ff", "#fff6e6"]
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" width="{width}" height="{height}">']
    for i, (x, y_, r, o) in enumerate(stars):
        if r >= 1.9:  # les plus brillantes ont un halo très discret
            svg.append(f'<circle cx="{x}" cy="{y_}" r="{r * 2.6:.1f}" fill="{colors[i % 4]}" opacity="0.06"/>')
        svg.append(f'<circle cx="{x}" cy="{y_}" r="{r}" fill="{colors[i % 4]}" opacity="{o}"/>')
    svg.append("</svg>")
    (out / "stars.svg").write_text("\n".join(svg))

    for name in ("fog-a.webp", "fog-b.webp", "fog-page.webp", "clouds.webp", "sky-clouds.webp", "stars.svg"):
        print(f"{name:16s} {os.path.getsize(out / name) // 1024:3d} Ko")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", type=Path, default=ROOT / "public" / "weather")
    main(parser.parse_args().out)
