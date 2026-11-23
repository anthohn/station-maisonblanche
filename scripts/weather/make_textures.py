#!/usr/bin/env python3
"""Texture de brume de la page entière (public/weather/fog-page.webp). Dépendances : numpy, Pillow.

    python3 scripts/weather/make_textures.py            # écrit dans public/weather
    python3 scripts/weather/make_textures.py --out DIR  # ailleurs (pour comparer)

Tout est déterministe (graine fixe) : relancer le script redonne le même fichier.
"""
import argparse
import os
from pathlib import Path

import numpy as np

from noise import fractal, save_alpha, smooth

ROOT = Path(__file__).resolve().parents[2]


def main(out: Path):
    out.mkdir(parents=True, exist_ok=True)

    # Brume de la page entière : masses lentes, d'un gris bleuté, posées en multiplication sur la page
    # (une brume blanche resterait invisible sur un fond blanc). Entière jusqu'à 40 % de la hauteur, puis
    # elle s'efface jusqu'à zéro en bas : pas d'arête visible où la couche s'arrête.
    y = np.linspace(0, 1, 512)[:, None]
    page_fade = np.where(y < 0.4, 1.0, 1.0 - (y - 0.4) / 0.6)
    n = fractal(1024, 512, [(1.3, 1.0), (1.9, 0.9)], cutoff=0.045, seed=29, hp=0.004)
    save_alpha(smooth(n, 0.18, 0.95) * page_fade, (150, 162, 178), out / "fog-page.webp")

    name = "fog-page.webp"
    print(f"{name:16s} {os.path.getsize(out / name) // 1024:3d} Ko")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", type=Path, default=ROOT / "public" / "weather")
    main(parser.parse_args().out)
