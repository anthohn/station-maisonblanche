# Scripts de la météo

Outils de développement, sans effet sur le site en ligne. Explication générale de la fonctionnalité : `app/components/weather/README.md`.

## Tests

```bash
npm run test:meteo                       # lecture d'Open-Meteo, ambiances, soleil, lisibilité (Node 22+, sans réseau)
npm run build && npm run test:meteo:route  # la route /api/meteo de bout en bout, contre un faux Open-Meteo
```

## Régénérer l'image de `public/weather`

Python 3 avec `numpy` et `Pillow` (`pip install numpy pillow`). Tout est déterministe : relancer le script redonne exactement le même fichier.

```bash
python3 scripts/weather/make_textures.py   # la brume de la page (fog-page.webp)
```

Cette texture ne dépend pas de la photo d'accueil, qui n'est jamais modifiée par la météo.
