# 🎄 Calendrier de l'Avent

Page : **`/calendrier-de-l-avent`** — 24 portes, une qui s'ouvre chaque jour de décembre à minuit (heure de Genève).
Chaque porte cache un bon à scanner en caisse, un conseil d'hiver, une devinette, une recette, un message ou une anecdote.

## Voir le calendrier à une autre date (aperçu)

Ajouter `?jour=` à l'adresse pour « voyager dans le temps » :

| Adresse | Ce que l'on voit |
| --- | --- |
| `/calendrier-de-l-avent?jour=0` | La veille de l'ouverture (compte à rebours) |
| `/calendrier-de-l-avent?jour=12` | Le 12 décembre : portes 1 à 12 ouvertes, bon du jour avec code-barres |
| `/calendrier-de-l-avent?jour=24` | Le grand final |
| `/calendrier-de-l-avent?jour=25` | Après Noël : tout est refermé, les bons sont expirés |
| `/calendrier-de-l-avent?date=2026-12-07` | Même chose avec une date complète |

Une petite barre « Aperçu » apparaît en bas de l'écran pour avancer/reculer d'un jour et refermer toutes les portes.

**L'aperçu est désactivé sur le site public** (sinon n'importe qui pourrait ouvrir les portes à l'avance). Il fonctionne :

- en local (`npm run dev`) ;
- sur les déploiements de prévisualisation Vercel (`VERCEL_ENV=preview`) ;
- ou partout où la variable d'environnement `ADVENT_PREVIEW=true` est définie.

## Modifier le contenu

Tout se trouve dans **`lib/advent-doors.ts`** : un bloc par porte, avec le texte, l'indice mystérieux (`hint`, visible avant l'ouverture) et, pour les bons, le code-barres.
Les types de portes : `coupon`, `tip`, `riddle`, `recipe`, `checklist`, `message`, `fact` (champs décrits dans `lib/advent-shared.ts`).
Écrivez normalement : les espaces insécables (`?`, `!`, `:`, `CHF 10`…) sont ajoutés automatiquement.

## ⚠️ Avant la mise en ligne

Le contenu actuel est du **contenu d'exemple** : les offres, les prix et les codes-barres sont fictifs. Tant que `sampleContent` vaut `true`, la page affiche un bandeau « Démonstration » et chaque code-barres est marqué « non valable en caisse ».

1. Remplacer chaque bon par une vraie offre du shop.
2. Créer dans la caisse un code par jour (avec sa date de validité côté caisse) et le saisir dans `barcode`.
3. Passer `sampleContent` à `false` dans `lib/advent-shared.ts`.
4. Vérifier les textes (conseils, anecdote sur Chancy, horaires) et relire une dernière fois avec `?jour=1` … `?jour=24`.

## Après les fêtes

- Retirer la ligne « Avent » dans `lib/data.ts` (menu) et `<AdventTeaser />` dans `app/components/HomeRestOfPage.tsx` (accueil).
- L'an prochain : changer `ADVENT.year` dans `lib/advent-shared.ts` et renouveler `lib/advent-doors.ts`.

## Comment ça marche (et pourquoi on ne peut pas tricher)

- Le **serveur** décide quelles portes sont ouvertes, à l'heure de Genève. Changer la date de son téléphone ne sert à rien.
- Le contenu d'une porte future **n'est jamais envoyé au navigateur**, et le code-barres d'un bon n'est envoyé que **le jour où il est valable** (`lib/advent.ts`, protégé par `server-only`).
- À minuit, la page se met à jour toute seule chez les visiteurs qui l'ont laissée ouverte.
- Le navigateur retient simplement les portes déjà ouvertes (`localStorage`, aucune donnée personnelle).
- Le bouton « Rappel chaque matin » télécharge un événement d'agenda (`/api/avent/rappel.ics`) : un rappel à 07h30 du 1er au 24 décembre.
- Le lien partagé affiche une image de prévisualisation générée automatiquement (`opengraph-image.tsx`).

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
