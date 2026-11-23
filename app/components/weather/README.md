# Météo en direct

L'accueil réagit au temps qu'il fait **à la station** : la photo du shop passe au brouillard, à la pluie, à la neige, à l'heure dorée ou à la nuit (l'enseigne « Shop » s'allume), de la pluie ou de la neige tombent sur le site, et une légende dit la température et le temps (« 4 °C · Brouillard dense »).

Si la météo est indisponible, rien ne casse : le site garde son allure habituelle (la position du soleil, elle, est calculée sur place, donc le jour, la nuit et l'heure dorée restent justes).

## Comment ça marche

```
Open-Meteo ──► app/api/meteo/route.ts ──► weather-store.ts ──► ambience.ts ──► apply-mood.ts ──► variables CSS --wx-*
 (serveur)      lit, normalise, met en      lit toutes les      météo + soleil     pose les           lues par les calques
                cache 10 min                10 min, aperçu      + horaires du      variables et       de HeroPhoto.tsx
                                            ?meteo= / ?heure=   shop → ambiance    charge les         (globals.css, .wx-*)
                                                                (lib/mood.ts)      textures
```

- **`lib/weather.ts`** : lit la réponse d'Open-Meteo et la ramène à des valeurs continues (nuages, brouillard, pluie, neige de 0 à 1), libellés français, saisons, horaires d'ouverture du shop, ambiances de démonstration.
- **`lib/sun.ts`** : hauteur du soleil à Chancy (algorithme NOAA), sans réseau.
- **`lib/mood.ts`** : fonction pure `computeMood(météo, hauteur du soleil, shop ouvert)` → variables CSS et réglages des particules. **C'est ici qu'on règle l'allure** de chaque ambiance (couleurs du ciel, force du brouillard, moment où l'enseigne s'allume…).
- **`app/api/meteo/route.ts`** : le serveur interroge Open-Meteo avec les coordonnées de la station (pas celles du visiteur : aucune autorisation à demander, aucune donnée personnelle ne part chez un tiers). Réponse gardée 10 minutes (serveur et CDN) : Open-Meteo reçoit au plus quelques requêtes par heure, quel que soit le nombre de visiteurs. En cas d'échec : HTTP 200 `{ "weather": null }`.
- **`HeroPhoto.tsx`** : la photo et ses calques (neige sur le toit, ombres de nuages, lumière, ciel remplacé, enseigne et vitrines allumées, brouillard, voile, éclair). Le balisage est identique pour tout le monde ; seules les variables CSS changent.
- **`WeatherAtmosphere.tsx`** : chef d'orchestre (monté dans `app/layout.tsx`) : applique l'ambiance, affiche pluie, neige et feuilles d'automne, déclenche les éclairs.
- **`WeatherParticles.tsx`** : pluie et neige en canvas (trois plans de profondeur, inclinées par le vent, s'allègent seules si l'appareil peine).
- **`WeatherCaption.tsx`** : la légende sur la photo.
- **`WeatherPreviewBar.tsx`** : la barre de démonstration (voir ci-dessous).

Détails soignés : tout apparaît en fondu (une texture n'est révélée qu'une fois chargée) ; rien n'est téléchargé par beau temps ; la brume dérive dans le sens du vent et change de vitesse sans à-coup ; les vitrines ne s'éclairent que **pendant les heures d'ouverture réelles** du shop (l'enseigne, elle, brille dès la tombée du jour) ; le mouvement réduit (`prefers-reduced-motion`) supprime particules, feuilles, dérive et éclairs.

## Voir une ambiance sans attendre le bon temps

Ajouter un paramètre à l'adresse (aucun effet pour les autres visiteurs, seulement sur votre écran) :

| Adresse | Effet |
| --- | --- |
| `/?meteo=pluie` | Temps : `soleil`, `eclaircies`, `couvert`, `brouillard`, `bruine`, `pluie`, `orage`, `neige`, `dore`, `nuit`, `automne` |
| `/?heure=nuit` | Heure : `matin`, `midi`, `dore`, `bleue`, `nuit` (météo réelle, heure simulée) |
| `/?meteo=neige&heure=matin` | Les deux |
| `/?meteo=live` | Retour à la météo réelle |

Une barre apparaît alors en bas à gauche pour changer d'ambiance d'un clic ; l'aperçu reste actif pendant la visite (de page en page) jusqu'à « Quitter l'aperçu ». La légende de la photo indique « Aperçu » : elle ne fait jamais passer une simulation pour la météo réelle.

## Réglages (variables d'environnement, facultatives)

| Variable | Rôle |
| --- | --- |
| `OPEN_METEO_API_KEY` | Clé d'un abonnement Open-Meteo : la route utilise alors `customer-api.open-meteo.com`. |
| `OPEN_METEO_URL` | Autre point d'accès (Open-Meteo peut être hébergé soi-même, ou pointé vers un faux serveur pour des essais). |

## Licence et crédit : à lire avant la mise en production

- L'API gratuite d'Open-Meteo est réservée à un **usage non commercial**. Le site d'une entreprise relève en principe de l'usage commercial : il faut un abonnement (puis `OPEN_METEO_API_KEY`), héberger soi-même Open-Meteo, ou changer de source de données. Vérifier les conditions en vigueur sur <https://open-meteo.com/en/pricing> et <https://open-meteo.com/en/terms>.
- Les données sont sous licence **CC BY 4.0** : le crédit « Open-Meteo.com » est dans les mentions légales (`app/mentions-legales/page.tsx`). À conserver.

## Les calques sont taillés pour la photo `public/shop-accueil.jpg`

Le masque du ciel, l'enseigne et les vitrines allumées, la neige sur le toit sont découpés **d'après cette photo précise** (`public/weather/sky-mask.webp`, `sign-lit.webp`, `windows-lit.webp`, `snow-roof.webp`) et placés en pourcentages de la photo (`globals.css`, `.wx-*`). Si la photo change, ces fichiers ne correspondent plus : il faut les régénérer (voir `scripts/weather/`), ou retirer le bloc `wx-box` de `HeroPhoto.tsx` pour ne garder que les particules et la légende. Les textures de brouillard et de nuages (`fog-a`, `fog-b`, `clouds`, `sky-clouds`, `stars.svg`) ne dépendent pas de la photo.
