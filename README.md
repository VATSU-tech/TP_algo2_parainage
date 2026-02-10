# TP 3 Algorithmique 2 — Parrainage & Commissions

Application React + TypeScript (Vite) qui modélise un réseau de parrainage sous forme de graphe pondéré. Elle permet d’ajouter des clients, des relations parrain‑filleul, des achats, puis de calculer les commissions directes et indirectes via un parcours de graphe.

La date limite indiquée dans le PDF est le 10/03/2026.

## Objectif pédagogique
- Manipuler une base de données simple en mémoire (clients, relations, achats)
- Construire un graphe orienté pondéré
- Parcourir le graphe (BFS/DFS) pour calculer les commissions
- Proposer une interface graphique pour gérer et visualiser le réseau
- Identifier les clients les plus rentables

## Fonctionnalités principales
- Ajout de clients, relations, achats via formulaires
- Calcul des commissions directes (5%) et indirectes (1%)
- Sélection d’un parrain et affichage détaillé
- Graphe pondéré (SVG) + représentation textuelle
- Tables Clients / Relations / Achats
- Classement des clients les plus rentables
- Persistance locale via `localStorage`

## Règles de gestion
- Commission directe: 5% des achats du filleul direct
- Commission indirecte: 1% des achats des filleuls indirects (niveau 2+)
- Poids de l’arête parrain -> filleul: total achats du filleul × 5%

## Modèle de données (conceptuel)
- Client: id, nom, email, ville, date d’inscription
- Relation: id, parrainId, filleulId
- Achat: id, clientId, montant, date

## Calcul des commissions (algorithme)
- Construction d’une liste d’adjacence à partir des relations
- Parcours BFS/DFS depuis le parrain
- Niveau 1 = filleuls directs (taux 5%)
- Niveau 2+ = filleuls indirects (taux 1%)
- Somme des commissions directes et indirectes

La fonction clé est `getCommissionTotal(parrain)` dans `src/App.tsx`.

## Organisation de l’interface
- Bandeau d’introduction avec le contexte et les taux
- Cartes statistiques (clients, relations, achats, ventes réseau)
- Trois formulaires d’ajout (client, relation, achat)
- Bloc d’analyse des commissions pour un parrain choisi
- Graphe pondéré (SVG) et console textuelle
- Tables de données

## Données de démonstration
L’application charge un jeu de données de départ (plus de 8 clients, 10 relations, 15 achats). Ces données sont enregistrées dans `localStorage` et seront conservées entre les rechargements.

## Installation et usage
Prérequis:
- Node.js récent (18+ recommandé)
- npm

Commandes:
```bash
npm install
npm run dev
```

Build de production:
```bash
npm run build
npm run preview
```

## Réinitialiser les données
Deux options:
1. Supprimer la clé `tp-parrainage-data-v1` dans le `localStorage` du navigateur.
2. Ou vider complètement le `localStorage` via les DevTools.

Au prochain chargement, les données de démonstration seront rechargées.

## Paramètres configurables
Dans `src/App.tsx`:
- `DIRECT_RATE` pour le taux direct (par défaut 0.05)
- `INDIRECT_RATE` pour le taux indirect (par défaut 0.01)

## Structure du projet (extrait)
- `src/App.tsx` : logique principale, formulaires, calculs, rendu
- `src/sass/Style.scss` : styles globaux de l’UI
- `src/main.tsx` : point d’entrée React + router

## Améliorations possibles
- Remplacer la persistence `localStorage` par une vraie base (SQLite, Postgres, Supabase)
- Détection de cycles dans le graphe pour éviter des incohérences
- Ajout d’un historique d’achats par client
- Export PDF du rapport demandé dans le TP
- Visualisation avancée du graphe (D3, Cytoscape)
- Gestion des rôles (admin/étudiant) et authentification
- Tests unitaires sur le calcul des commissions
- Internationalisation (FR/EN)

## Dépannage rapide
- Si la page est blanche, vérifier la console et relancer `npm run dev`.
- Si des styles ne se chargent pas, vérifier `src/sass/Style.scss`.
- Si les données semblent “bloquées”, réinitialiser le `localStorage`.

## Auteur
- VATSU-tech

