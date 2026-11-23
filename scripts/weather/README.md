# Scripts de la météo

Outils de développement, sans effet sur le site en ligne. Explication générale de la fonctionnalité : `app/components/weather/README.md`.

## Tests

```bash
npm run test:meteo                       # lecture d'Open-Meteo, ambiances, horaires du shop, soleil (Node 22+, sans réseau)
npm run build && npm run test:meteo:route  # la route /api/meteo de bout en bout, contre un faux Open-Meteo
```

## Régénérer les images de `public/weather`

Python 3 avec `numpy` et `Pillow` (`pip install numpy pillow`). Tout est déterministe : relancer un script redonne exactement les mêmes fichiers.

```bash
python3 scripts/weather/make_textures.py        # brouillard (photo et page), ombres de nuages, ciel couvert, étoiles
python3 scripts/weather/make_photo_overlays.py  # masque du ciel, enseigne et vitrines allumées, neige sur le toit
```

Les textures (`make_textures.py`) ne dépendent pas de la photo. Les calques de `make_photo_overlays.py` sont **découpés d'après `public/shop-accueil.jpg`** (seuils de couleur, repères en pixels) : si la photo d'accueil change, il faut les ajuster, relancer le script, et vérifier la géométrie `.wx-lit` / `.wx-snow` de `app/globals.css`.
