# EXPLICATION — TP 3 Algorithmique 2 (Parrainage & Commissions)

Ce document explique chaque partie du projet, chaque composant, et chaque variable importante, pour que tu puisses expliquer totalement ce que fait l’application.

**Vue d’ensemble**
L’application est une SPA React + TypeScript (Vite). Elle modélise un réseau de parrainage comme un graphe orienté pondéré, calcule des commissions directes/indirectes, et affiche le réseau en 2D (SVG), 3D (Three.js) et en version textuelle. Les données sont persistées dans `localStorage`.

**Flux global des données**

1. `src/App.tsx` charge `localStorage` via `STORAGE_KEY`; sinon il utilise `seedData`.
2. L’état global `data` contient `clients`, `relations`, `purchases`.
3. Les dérivés (adjacency, commissions, top clients, etc.) sont calculés avec `useMemo`.
4. Les sections UI reçoivent ces dérivés via props, sans logique métier interne.
5. Toute action des formulaires met à jour `data` puis déclenche persistance + recalculs.

**Gestion des exports/imports entre composants**

- Composants React: export par défaut (`export default function ...`) puis import simple sans accolades.
- Config et utilitaires: exports nommés (`export const ...`) puis import avec accolades.
- Types TypeScript: exports nommés de types, importés avec `import type { ... }`.
- Les pages (Login, Profil, etc.) sont aussi des exports par défaut.
- Styles globaux: `src/App.tsx` importe `src/sass/Style.scss`.

**Point d’entrée et routage**

- `index.html` définit la page HTML, charge les polices, Font Awesome, et monte l’app via `src/main.tsx`.
- `src/main.tsx` crée le router (`createBrowserRouter`) et rend l’app dans `#root`.
- Routes: `/` (App), `/login`, `/inscription`, `/profil`, `*` (NotFound).

**Fichiers de configuration et tooling**

- `package.json` définit scripts Vite, dépendances React, Three.js, Tailwind, jsPDF.
- `vite.config.ts` active React plugin + Tailwind via `@tailwindcss/vite`.
- `tsconfig.json` référence `tsconfig.app.json` et `tsconfig.node.json`.
- `tsconfig.app.json` configure TypeScript pour l’app React.
- `tsconfig.node.json` configure TypeScript pour `vite.config.ts`.
- `eslint.config.js` active ESLint + TypeScript + React Hooks + React Refresh.

**Données et configuration métier**

- `src/config/app.ts` `STORAGE_KEY`: clé `localStorage` des données métier.
- `src/config/app.ts` `AUTH_KEY`: clé `localStorage` de l’utilisateur connecté.
- `src/config/app.ts` `DIRECT_RATE`: taux de commission directe (5%).
- `src/config/app.ts` `INDIRECT_RATE`: taux de commission indirecte (1%).
- `src/config/app.ts` `USERS`: comptes de démo (admin, analyst, viewer).
- `src/config/app.ts` `ROLE_LABELS`: libellés lisibles des rôles.
- `src/data/seed.ts` `seedData`: données initiales (clients, relations, achats).

**Types TypeScript**

- `src/types/app.ts` `Client`: id, name, email, city, joinedAt.
- `src/types/app.ts` `Relation`: id, parrainId, filleulId.
- `src/types/app.ts` `Purchase`: id, clientId, amount, date.
- `src/types/app.ts` `DataState`: clients, relations, purchases.
- `src/types/app.ts` `Role`: "admin" | "analyst" | "viewer".
- `src/types/app.ts` `User`: name, email, role, password.
- `src/types/app.ts` `AuthUser`: `User` sans `password`.
- `src/types/app.ts` `LoginFormState`: email, password.
- `src/types/app.ts` `ClientFormState`: name, email, city, joinedAt.
- `src/types/app.ts` `RelationFormState`: parrainId, filleulId.
- `src/types/app.ts` `PurchaseFormState`: clientId, amount, date.
- `src/types/app.ts` `CommissionSummary`: direct, indirect, total, directTotal, indirectTotal.
- `src/types/app.ts` `GraphEdge`: Relation + weight.
- `src/types/app.ts` `GraphNodePosition`: id, x, y.
- `src/typescript/types.ts` `Client`: id, name (legacy, snake_case ailleurs).
- `src/typescript/types.ts` `Relation`: id, parrain_id, sheet_id (legacy).
- `src/typescript/types.ts` `Achat`: id, client_id, montatn, date_pay (legacy).
- `src/typescript/types.ts` `Graph`: adjacency map legacy.
- `src/typescript/three.d.ts`: modules `three` et `OrbitControls` déclarés en `any`.

**Utilitaires**

- `src/utils/format.ts` `formatMoney(value)`: formate en `"12.34 $"`.
- `src/utils/format.ts` `getNextId(items)`: calcule le prochain id.
- `src/utils/graph.ts` `buildAdjacency(relations)`: Map parrain -> filleuls.
- `src/utils/graph.ts` `wouldCreateCycle(parrainId, filleulId, adjacency)`: empêche les cycles.
- `src/utils/graph.ts` `hasCycle(adjacency)`: détecte un cycle global.
- `src/utils/graph.ts` `getCommissionTotal(...)`: BFS pour calculer direct/indirect.

**Composant principal: `src/App.tsx`**

Variables d’état (useState)

1. `data`: état global `DataState`, chargé depuis `localStorage` ou `seedData`.
2. `currentUser`: utilisateur connecté ou `null`.
3. `selectedClientId`: client analysé dans l’onglet commissions.
4. `clientForm`: `{ name, email, city, joinedAt }` pour le formulaire client.
5. `relationForm`: `{ parrainId, filleulId }` pour le formulaire relation.
6. `purchaseForm`: `{ clientId, amount, date }` pour le formulaire achat.
7. `formMessage`: message d’erreur/succès des formulaires.
8. `authMessage`: message d’erreur d’authentification.
9. `loginForm`: `{ email, password }` pour la connexion.

Variables dérivées (useMemo)

1. `totalsByClient`: `Map` clientId -> total achats.
2. `adjacency`: liste d’adjacence construite depuis les relations.
3. `selectedCommission`: `CommissionSummary` du client sélectionné.
4. `graphEdges`: arêtes pondérées (poids = achats filleul × `DIRECT_RATE`).
5. `graphPositions`: positions circulaires 2D des nœuds.
6. `topClients`: top 5 clients rentables par commission totale.
7. `adjacencyList`: version texte du graphe.
8. `totalNetworkSales`: somme de tous les achats.
9. `cycleDetected`: booléen de cohérence du graphe.

Autres variables locales

1. `selectedClient`: objet client correspondant à `selectedClientId`.
2. `isAdmin`: `currentUser?.role === "admin"`.
3. `directNames`: noms des filleuls directs (triés).
4. `indirectNames`: noms des filleuls indirects (triés).
5. `demoAccounts`: liste `email / password` dérivée de `USERS`.

Effets (useEffect)

1. Persistance automatique de `data` dans `localStorage` via `STORAGE_KEY`.
2. Persistance ou suppression de `currentUser` via `AUTH_KEY`.

Handlers majeurs

1. `handleLogin`: vérifie email + password dans `USERS`, puis fixe `currentUser`.
2. `handleLogout`: remet `currentUser` à `null`.
3. `handleExportPdf`: génère un PDF récapitulatif avec `jsPDF`.
4. `handleClientSubmit`: valide et ajoute un client.
5. `handleRelationSubmit`: valide et ajoute une relation sans cycle.
6. `handlePurchaseSubmit`: valide et ajoute un achat.

Rendu

- Enchaîne `Hero`, `AuthSection`, `StatsSection`, `FormsSection`, `AnalysisSection`, `GraphSection`, `TextSection`, `TablesSection`, `Footer`.

**Composants UI (par fichier)**

- `src/components/Hero.tsx` variables: `directRate` (taux direct), `indirectRate` (taux indirect), `onExport` (callback export PDF).
- `src/components/AuthSection.tsx` variables: `currentUser`, `roleLabels`, `authMessage`, `loginForm`, `onLoginSubmit`, `onLogout`, `onEmailChange`, `onPasswordChange`, `demoAccounts`.
- `src/components/AuthPanel.tsx` variables: `currentUser`, `roleLabels`, `authMessage`, `loginForm`, `onLoginSubmit`, `onLogout`, `onEmailChange`, `onPasswordChange`.
- `src/components/RolesPanel.tsx` variables: `demoAccounts` (liste des comptes de démo).
- `src/components/StatsSection.tsx` variables: `clientsCount`, `relationsCount`, `purchasesCount`, `totalNetworkSales`.
- `src/components/FormsSection.tsx` variables: `clients`, `isAdmin`, `formMessage`, `clientForm`, `relationForm`, `purchaseForm`, `onClientSubmit`, `onRelationSubmit`, `onPurchaseSubmit`, `onClientNameChange`, `onClientEmailChange`, `onClientCityChange`, `onClientJoinedAtChange`, `onRelationParrainChange`, `onRelationFilleulChange`, `onPurchaseClientChange`, `onPurchaseAmountChange`, `onPurchaseDateChange`.
- `src/components/AnalysisSection.tsx` variables: `clients`, `selectedClientId`, `selectedClient`, `selectedCommission`, `directNames`, `indirectNames`, `topClients`, `onClientSelect`.
- `src/components/GraphSection.tsx` variables: `clients`, `relations`, `graphEdges`, `graphPositions`, `selectedClientId`, `directIds`, `indirectIds`.
- `src/components/NetworkGraph.tsx` variables: `clients`, `edges`, `positions`, `selectedClientId`, `directIds`, `indirectIds`, plus variables locales `from`, `to`, `midX`, `midY`, `isHighlighted`, `fill`, `textFill`.
- `src/components/Graph3D.tsx` variables: `clients`, `relations`, `selectedId`, `directIds`, `indirectIds`, `containerRef`, `positions`, et variables locales `scene`, `camera`, `renderer`, `controls`, `group`, `lineMaterial`, `sphereGeometry`, `frameId`.
- `src/components/TextSection.tsx` variables: `adjacencyList`, `cycleDetected`.
- `src/components/TablesSection.tsx` variables: `clients`, `relations`, `purchases`.
- `src/components/Footer.tsx` variables: aucun.
- `src/components/Button1.tsx` variables: `text`, `page`.
- `src/components/Avatar.tsx` variables: aucun.
- `src/components/UserCard.tsx` variables: aucun.
- `src/components/navbar.tsx` variables: aucun, tout est statique hormis `NavLink`.
- `src/components/_input.tsx` variables: `placeholder`, `type`, `icon`, `required`.

**Pages**

- `src/pages/login.tsx` utilise `Input` + `Button1` pour un formulaire de connexion.
- `src/pages/Inscription.tsx` utilise plusieurs `Input` et un `Button1`.
- `src/pages/Profil.tsx` compose `Navbar` + `UserCard`.
- `src/pages/NotFound.tsx` affiche `Navbar` + message 404.

**Styles**

- `src/index.css` charge Tailwind et DaisyUI.
- `src/sass/Style.scss` définit le thème et les classes UI utilisées par l’app.
- `src/sass/_settings.scss` définit une police globale mais n’est pas importé actuellement.
- `src/sass/_component_button.scss` définit `.btn-1` mais n’est pas importé actuellement.

**Assets**

- `public/coin.svg` est utilisé comme favicon dans `index.html`.
- `src/assets/react.svg` n’est pas utilisé actuellement.

**Build / dossiers générés**

- `dist` contient la build de production générée par Vite.
- `node_modules` contient les dépendances installées.

Si tu veux, je peux aussi produire un diagramme d’architecture ou un schéma de flux des données.
