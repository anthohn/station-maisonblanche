# Météo en direct

Le site réagit au temps qu'il fait **à la station**, sur la page entière :
- toute la **page** prend la lumière du moment (un voile léger, plus marqué en haut comme un ciel), une brume dérive par-dessus, et pluie, neige ou feuilles d'automne tombent sur tout l'écran ; un éclair éclaircit la page en cas d'orage ;
- une légende sur la photo d'accueil dit la température et le temps (« 4 °C · Brouillard dense »).

**La photo d'accueil elle-même n'est jamais modifiée** : ni filtre, ni ciel remplacé, ni lumière ajoutée. Elle est exactement `public/shop-accueil.jpg`, quelle que soit la météo. Seules la légende (avec un léger dégradé sombre en bas pour rester lisible) et les particules (pluie, neige, feuilles) passent par-dessus.

Si la météo est indisponible, rien ne casse : le site garde son allure habituelle (la position du soleil, elle, est calculée sur place, donc le jour, la nuit et l'heure dorée restent justes).

## Comment ça marche

```
Open-Meteo ──► app/api/meteo/route.ts ──► weather-store.ts ──► ambience.ts ──► apply-mood.ts ──► variables CSS --wx-page-*
 (serveur)      lit, normalise, met en      lit toutes les      météo + soleil     pose les           lues par les calques
                cache 10 min                10 min, aperçu      → ambiance         variables et       (weather.css)
                                            ?meteo= / ?heure=   (lib/mood.ts)      charge la brume
```

- **`lib/weather.ts`** : lit la réponse d'Open-Meteo et la ramène à des valeurs continues (nuages, brouillard, pluie, neige de 0 à 1), libellés français, saisons, ambiances de démonstration.
- **`lib/sun.ts`** : hauteur du soleil à Chancy (algorithme NOAA), sans réseau.
- **`lib/mood.ts`** : fonction pure `computeMood(météo, hauteur du soleil)` → variables CSS et réglages des particules. **C'est ici qu'on règle l'allure** de chaque ambiance (teinte et intensité du voile de la page, force de la brume, quand la lueur dorée apparaît…).
- **`app/api/meteo/route.ts`** : le serveur interroge Open-Meteo avec les coordonnées de la station (pas celles du visiteur : aucune autorisation à demander, aucune donnée personnelle ne part chez un tiers). Réponse gardée 10 minutes (serveur et CDN) : Open-Meteo reçoit au plus quelques requêtes par heure, quel que soit le nombre de visiteurs. En cas d'échec : HTTP 200 `{ "weather": null }`.
- **`weather.css`** : tous les styles (importé par `app/layout.tsx`). Volontairement **hors de `globals.css`** : moins de conflits avec les branches qui modifient celui-ci.
- **`WeatherAtmosphere.tsx`** : chef d'orchestre (monté dans `app/layout.tsx`) : applique l'ambiance, dresse l'atmosphère de la page (voile et brume), déclenche les éclairs, surveille la fluidité.
- **`WeatherParticles.tsx`** : pluie, neige et feuilles d'automne en canvas (trois plans de profondeur, poussées par le même vent, plus présentes en haut de l'écran qu'en bas).
- **`WeatherToggle.tsx`** : le lien « Effets météo : activés / suspendus » du pied de page.
- **`WeatherCaption.tsx`** : la légende sur la photo. **`WeatherPreviewBar.tsx`** : la barre de démonstration (voir ci-dessous).

## Atmosphère de la page entière

Les sections du site ont des fonds opaques : un effet « derrière » le contenu serait invisible. L'atmosphère est donc **une couche fixe par-dessus le contenu**, qui ne gêne ni les clics ni la lecture. Ordre des couches : contenu (z ≤ 20) < voile et brume (22) < photo d'accueil (25) < pluie, neige, feuilles (30) < carte d'offre et barre mobile (40) < en-tête et fenêtres (50).

- **Voile de lumière** : doré au coucher du soleil, gris-bleu au couvert, plus sombre sous la pluie et l'orage, blanc froid sous la neige, bleu marine la nuit (pas de thème sombre : on doit pouvoir lire horaires et prix à toute heure). Plus marqué en haut de l'écran, effacé vers le bas.
- **Brume** : une texture grise (`public/weather/fog-page.webp`) qui dérive sur le haut de la page. Jamais plus de 40 % d'opacité (30 % par brouillard seul).
- **Lisibilité** : le voile et la brume sont posés en **multiplication** (`mix-blend-mode: multiply`, comme un filtre de lumière) : le fond et le texte s'assombrissent ensemble, ce qui conserve le contraste bien mieux qu'un voile classique. Opacité plafonnée (`PAGE_ALPHA_MAX` dans `lib/mood.ts`, 16 %). Les tests (`npm run test:meteo`) vérifient le contraste de couples de couleurs du site dans tous les états ; mesuré sur les pixels de la page d'accueil, le paragraphe d'introduction perd au plus 2 % de contraste. À noter : ce paragraphe (ardoise 500 sur crème) est déjà à 4,54:1 à l'origine, juste au-dessus du seuil de 4,5:1 ; pour avoir de la marge, passer ce gris en ardoise 600.
- **La photo d'accueil passe au-dessus du voile** (`z-[25]` dans `HeroSection.tsx`) : elle ne reçoit aucune teinte. Si l'on préfère que le voile la recouvre aussi, pour une page d'un seul tenant, il suffit de retirer ce `z-[25]` ; la photo ne serait alors teintée que par le voile (16 % au plus).

## Respect du visiteur

- **Mouvement réduit** (réglage du système) : on **adoucit au lieu de couper** : pluie, neige et feuilles à 40 % de densité et deux fois plus lentes, brume presque immobile, **pas d'éclairs**.
- **Pause** : le lien « Effets météo » du pied de page suspend voile, brume, pluie, neige, feuilles et dérive ; le choix est mémorisé.
- **Fluidité** : si, quand quelque chose bouge, l'appareil reste sous ~30 images/s (deux mesures de 2 s), la page retire d'elle-même le voile et la brume (`data-wx-lite`) ; des particules plus légères restent. Les particules s'allègent aussi seules. Mieux vaut moins d'atmosphère qu'un site qui rame.
- Quand un **temps ou une heure sont imposés** (`?meteo=`, `?heure=`), tout est toujours montré, malgré le mouvement réduit ou la pause : c'est une démonstration voulue. Un pad ouvert sans rien d'imposé montre la visite telle quelle.

Autres détails : tout apparaît en fondu (la brume n'est révélée qu'une fois sa texture chargée) ; rien n'est téléchargé par beau temps ; la brume dérive dans le sens du vent et change de vitesse sans à-coup.

> `app/components/AutumnLeaves.tsx` n'est plus utilisé : les feuilles sont dessinées par `WeatherParticles` (mêmes formes et mêmes couleurs, mais poussées par le vent réel, et tombant seulement en automne, par temps adapté). Le fichier est conservé tel quel.

## Le pad : voir une ambiance sans attendre le bon temps

Le **pad** (la barre d'aperçu, en bas à gauche) permet de passer d'une ambiance à l'autre d'un clic. Il n'existe que pour vous, jamais pour un visiteur normal :

- **sur les aperçus Vercel et en développement** (`next dev`), il s'ouvre tout seul : c'est décidé à la compilation d'après `VERCEL_ENV` (voir `app/layout.tsx`) ;
- **partout ailleurs, production comprise**, on l'ouvre avec un paramètre dans l'adresse :

| Adresse | Effet |
| --- | --- |
| `/?pad` | Ouvre le pad sans rien imposer (météo et heure réelles) |
| `/?meteo=pluie` | Impose un temps : `soleil`, `eclaircies`, `couvert`, `brouillard`, `bruine`, `pluie`, `orage`, `neige`, `dore`, `nuit`, `automne` |
| `/?heure=nuit` | Impose une heure : `matin`, `midi`, `dore`, `bleue`, `nuit` (météo réelle, heure simulée) |
| `/?meteo=neige&heure=matin` | Les deux |
| `/?meteo=live` | Ferme le pad |

Le pad reste ouvert pendant la visite, de page en page, jusqu'à « Quitter l'aperçu » (il reste alors fermé pour la visite ; `?pad` le rouvre). Quand un temps ou une heure sont imposés, la légende de la photo indique « Aperçu » (une simulation n'est jamais présentée comme la météo réelle) et tous les effets sont montrés, même avec le mouvement réduit ou la pause.

## Réglages (variables d'environnement, facultatives)

| Variable | Rôle |
| --- | --- |
| `OPEN_METEO_API_KEY` | Clé d'un abonnement Open-Meteo : la route utilise alors `customer-api.open-meteo.com`. |
| `OPEN_METEO_URL` | Autre point d'accès (Open-Meteo peut être hébergé soi-même, ou pointé vers un faux serveur pour des essais). |

## Licence et crédit : à lire avant la mise en production

- L'API gratuite d'Open-Meteo est réservée à un **usage non commercial**. Le site d'une entreprise relève en principe de l'usage commercial : il faut un abonnement (puis `OPEN_METEO_API_KEY`), héberger soi-même Open-Meteo, ou changer de source de données. Vérifier les conditions en vigueur sur <https://open-meteo.com/en/pricing> et <https://open-meteo.com/en/terms>.
- Les données sont sous licence **CC BY 4.0** : le crédit « Open-Meteo.com » est dans les mentions légales (`app/mentions-legales/page.tsx`). À conserver.
