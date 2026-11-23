#!/usr/bin/env python3
"""Calques de la photo d'accueil `public/shop-accueil.jpg` : masque du ciel, enseigne « Shop » et vitrines
allumées, neige sur le toit. Dépendances : numpy, Pillow.

    python3 scripts/weather/make_photo_overlays.py            # écrit dans public/weather
    python3 scripts/weather/make_photo_overlays.py --out DIR  # ailleurs (pour comparer)

ATTENTION : ces calques sont découpés d'après CETTE photo (couleurs, positions en pixels). Si la photo change,
il faut ajuster les seuils et les repères ci-dessous, puis la géométrie `.wx-lit`, `.wx-snow` de app/globals.css.
Chaque calque est exporté « recadré » à l'échelle indiquée ; sa position dans la page est en pourcentages de la
photo (voir les commentaires de globals.css).
"""
import argparse
import os
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

from noise import fractal

ROOT = Path(__file__).resolve().parents[2]
PHOTO = ROOT / "public" / "shop-accueil.jpg"  # 2400 x 1800

clamp = lambda x, lo=0.0, hi=1.0: np.clip(x, lo, hi)
smooth = lambda x, e0, e1: (lambda t: t * t * (3 - 2 * t))(clamp((x - e0) / (e1 - e0)))


def _img(mask):
    return Image.fromarray((mask * 255).astype(np.uint8))


def dilate(mask, k):
    return np.asarray(_img(mask).filter(ImageFilter.MaxFilter(k))) > 0


def erode(mask, k):
    return np.asarray(_img(mask).filter(ImageFilter.MinFilter(k))) > 0


def blur(mask, radius):
    return np.asarray(_img(clamp(mask)).filter(ImageFilter.GaussianBlur(radius))).astype(np.float32) / 255


def connected(seed, allowed):
    """Zone de `allowed` reliée à `seed` (gonflement pas à pas)."""
    region = seed.copy()
    for _ in range(4000):
        grown = dilate(region, 3) & allowed
        if grown.sum() == region.sum():
            break
        region = grown
    return region


# ───────────────────────── Masque du ciel ─────────────────────────
def sky_mask(out: Path):
    """Masque de transparence du ciel : permet de le remplacer (gris, doré, nuit) sans toucher aux arbres ni aux toits.

    Le cœur du ciel est détecté par seuils francs (bleu, nuages blancs) reliés au bord haut, plus les trouées de ciel
    enfermées dans les feuillages. Sur le pourtour (7 px), la part de ciel de chaque pixel est estimée en continu
    d'après son bleuté (démélange) : les branches fines gardent leur vraie forme, sans liseré ni angles.
    """
    w, h = 1200, 900
    a = np.asarray(Image.open(PHOTO).convert("RGB").resize((w, h), Image.LANCZOS)).astype(np.float32)
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    mx, mn = a.max(-1), a.min(-1)
    V = mx / 255.0
    S = (mx - mn) / np.maximum(mx, 1)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)

    blue = (B - R > 20) & (B > 115) & (G > R + 2)
    cloud = (V > 0.78) & (B - R > -10) & (S < 0.32)
    cand = blue | cloud
    seed = np.zeros((h, w), bool)
    seed[0:3, :] = cand[0:3, :]
    region = connected(seed, cand)

    # Bleu franc et clair enfermé dans les feuillages (jamais le bleu du logo, à droite : x < 62 %)
    bright_blue = (B - R > 38) & (B > 150) & (G > R + 8) & (V > 0.62) & (yy < 0.56 * h) & (xx < 0.62 * w)
    strong = region | (bright_blue & ~region)
    strong |= cloud & dilate(strong, 11) & (yy < 0.56 * h)
    # Trouées dans la zone des arbres (à gauche, au-dessus du toit), jamais le crépi crème du mur
    trees = (xx < 0.47 * w) & (yy < 0.52 * h)
    strong |= trees & (((B - R > 25) & (V > 0.6)) | ((V > 0.72) & (S < 0.28) & (B - R > -8)))

    near = dilate(strong, 15)
    p_blue = clamp((B - R - 2) / 50.0)
    warm = smooth(B - R, -18, -6)  # écarte le crépi crème des murs
    p_cloud = clamp((V - 0.18) / 0.62) * (1 - smooth(S, 0.20, 0.38)) * warm
    p = np.maximum(p_blue, p_cloud) * near
    alpha = clamp(p * 1.25 - 0.04)
    alpha[strong & (p > 0.5)] = 1.0  # le cœur du ciel est franc
    mask = blur(alpha, 0.7)

    m = Image.fromarray((mask * 255 + 0.5).astype(np.uint8), "L").resize((1000, 750), Image.LANCZOS)
    rgba = Image.new("RGBA", (1000, 750), (0, 0, 0, 0))
    rgba.putalpha(m)
    rgba.save(out / "sky-mask.webp", "WEBP", quality=50, alpha_quality=55, method=6, exact=True)


# ───────────────────────── Enseigne et vitrines allumées ─────────────────────────
def lights(out: Path):
    """Enseigne « Shop » allumée (caisson rétro-éclairé + halo sur la façade) et vitrines éclairées de l'intérieur.

    On garde le relief de la photo : l'enseigne est la photo éclaircie et saturée, découpée sur sa forme réelle
    (détectée par ses couleurs) ; les vitrines sont la photo ramenée à une échelle de jaunes chauds.
    Zone exportée : x 500..1820, y 560..1440 (pixels de la photo), à l'échelle 0,6.
    """
    a = np.asarray(Image.open(PHOTO).convert("RGB")).astype(np.float32)
    h, w = a.shape[:2]
    R, G, B = a[..., 0], a[..., 1], a[..., 2]
    x0, y0, x1, y1 = 500, 560, 1820, 1440
    scale = 0.6
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)

    def save(rgb, alpha, name):
        sub = np.dstack([rgb[y0:y1, x0:x1], alpha[y0:y1, x0:x1, None] * 255]).astype(np.uint8)
        img = Image.fromarray(sub, "RGBA").resize((int((x1 - x0) * scale), int((y1 - y0) * scale)), Image.LANCZOS)
        img.save(out / name, "WEBP", quality=84, alpha_quality=100, method=6, exact=True)

    # — Enseigne : forme réelle (jaune + rouge, lettres comprises)
    yellow = (R > 120) & (B < 0.24 * R) & (G > 0.58 * R) & (G < 0.9 * R)
    red = (R > 100) & (R - G > 85) & (B < 0.2 * R + 8) & (G < 0.2 * R + 10)
    m = yellow | red
    zone = np.zeros_like(m)
    zone[880:1160, 800:1520] = True
    m &= zone
    m = erode(dilate(m, 31), 31)  # ferme les lettres « Shop »
    m = erode(m, 3)  # rogne la frange de bois
    sign = blur(m.astype(np.float32), 1.1)

    lit = clamp(np.power(a / 255.0, 0.74) * np.array([1.42, 1.24, 1.30], np.float32)) * 255
    cx, cy = (839 + 1495) / 2, (959 + 1093) / 2  # centre du caisson : un peu plus lumineux
    rad = np.sqrt(((xx - cx) / 340) ** 2 + ((yy - cy) / 120) ** 2)
    lit = clamp(lit + (1 - clamp(rad))[..., None] * np.array([16, 12, 4], np.float32), 0, 255)

    halo = 1 - (1 - blur(sign, 26) * 0.50) * (1 - blur(sign, 95) * 0.34)  # lueur serrée + lueur large
    warm = np.array([255, 196, 84], np.float32)
    sign_rgb = lit * sign[..., None] + warm * (1 - sign[..., None])
    alpha = clamp(np.maximum(sign, halo * (1 - sign)))  # opaque sur l'enseigne, halo ailleurs
    rgb = np.where(sign[..., None] > 0.02, sign_rgb, warm[None, None, :] * np.ones((h, w, 1), np.float32))
    save(rgb, alpha, "sign-lit.webp")

    # — Vitrines et porte vitrée (rectangles en pixels de la photo)
    win = np.zeros((h, w), np.float32)
    for (rx0, ry0, rx1, ry1) in [(1004, 1116, 1094, 1346), (1100, 1116, 1246, 1350), (1296, 1116, 1452, 1384)]:
        win[ry0:ry1, rx0:rx1] = 1
    win = blur(win, 1.6)
    lum = (0.3 * R + 0.59 * G + 0.11 * B) / 255
    t = clamp(0.30 + 3.0 * lum) ** 0.9
    t = np.where((xx > 1290) & (xx < 1460), t * 0.82, t)  # la porte, un peu plus sobre que les vitrines
    dark, light = np.array([96, 60, 26], np.float32), np.array([255, 228, 152], np.float32)
    glass = dark[None, None, :] * (1 - t[..., None]) + light[None, None, :] * t[..., None]
    spill = blur(win, 22) * 0.30
    alpha = clamp(np.maximum(win * 0.97, spill * (1 - win)))
    rgb = np.where(win[..., None] > 0.02, glass, np.array([255, 206, 120], np.float32)[None, None, :] * np.ones((h, w, 1), np.float32))
    save(rgb, alpha, "windows-lit.webp")


# ───────────────────────── Neige sur le toit ─────────────────────────
def roof_snow(out: Path):
    """Neige sur le versant de tuiles : détecté par sa couleur (orange-brun, jamais l'enseigne), ombré d'après le relief
    réel de la photo, avec un bord d'égout légèrement irrégulier. Zone exportée : x 1080..2400, y 470..1340, échelle 0,6."""
    a = np.asarray(Image.open(PHOTO).convert("RGB")).astype(np.float32)
    h, w = a.shape[:2]
    R, G, B = a[..., 0], a[..., 1], a[..., 2]

    tile = (R > 80) & (R - G > 22) & (G - B > 0) & (B > 0.22 * R) & (B < 0.78 * R)
    zone = np.zeros_like(tile)
    zone[470:1340, 1080:2400] = True
    tile &= zone
    tile = erode(dilate(tile, 15), 15)  # ferme les joints sombres entre les tuiles
    tile = dilate(erode(tile, 5), 5)  # retire les grains isolés
    seed_y, seed_x = np.unravel_index(np.argmax(blur(tile.astype(np.float32), 40)), tile.shape)
    seed = np.zeros_like(tile)
    seed[seed_y, seed_x] = True
    roof = connected(seed, tile)

    roof_d = dilate(roof, 9)  # +4 px : la neige recouvre le liseré des tuiles et déborde un peu de l'égout
    dist, cur = np.zeros((h, w), np.float32), roof_d.copy()
    for _ in range(45):
        cur = erode(cur, 3)
        dist += cur
    noise = fractal(w // 2, h // 2, [(1.3, 1.0), (2.0, 0.6)], cutoff=0.06, seed=3)
    noise = np.asarray(Image.fromarray((noise * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)).astype(np.float32) / 255
    cover = blur(smooth(dist + (noise - 0.5) * 10, 0.5, 5.5) * roof_d.astype(np.float32), 1.2)

    lum = (0.3 * R + 0.59 * G + 0.11 * B) / 255
    relief = lum - blur(lum, 14)  # le relief des tuiles reste visible sous la neige
    t = clamp(0.74 + relief * 1.6 + (noise - 0.5) * 0.30)
    base, shade = np.array([247, 250, 254], np.float32), np.array([206, 220, 240], np.float32)
    rgb = shade[None, None, :] * (1 - t[..., None]) + base[None, None, :] * t[..., None]
    alpha = clamp(cover * 0.97)

    x0, y0, x1, y1, scale = 1080, 470, 2400, 1340, 0.6
    sub = np.dstack([rgb[y0:y1, x0:x1], alpha[y0:y1, x0:x1, None] * 255]).astype(np.uint8)
    img = Image.fromarray(sub, "RGBA").resize((int((x1 - x0) * scale), int((y1 - y0) * scale)), Image.LANCZOS)
    img.save(out / "snow-roof.webp", "WEBP", quality=84, alpha_quality=90, method=6, exact=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", type=Path, default=ROOT / "public" / "weather")
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)
    sky_mask(args.out)
    lights(args.out)
    roof_snow(args.out)
    for name in ("sky-mask.webp", "sign-lit.webp", "windows-lit.webp", "snow-roof.webp"):
        print(f"{name:18s} {os.path.getsize(args.out / name) // 1024:3d} Ko")
