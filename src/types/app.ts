export type Client = {
  id: number; // Identifiant unique.
  name: string; // Nom complet.
  email: string; // Email de contact.
  city: string; // Ville associée.
  joinedAt: string; // Date d'inscription (YYYY-MM-DD).
};

export type Relation = {
  id: number; // Identifiant unique de la relation.
  parrainId: number; // ID du parrain.
  filleulId: number; // ID du filleul.
};

export type Purchase = {
  id: number; // Identifiant unique de l'achat.
  clientId: number; // ID du client qui a acheté.
  amount: number; // Montant de l'achat.
  date: string; // Date de l'achat (YYYY-MM-DD).
};

export type DataState = {
  clients: Client[]; // Liste des clients.
  relations: Relation[]; // Liste des relations parrain/filleul.
  purchases: Purchase[]; // Liste des achats.
};

export type Role = "admin" | "analyst" | "viewer"; // Rôles possibles.

export type User = {
  name: string; // Nom de l'utilisateur.
  email: string; // Email de login.
  role: Role; // Niveau d'accès.
  password: string; // Mot de passe (démo).
};

export type AuthUser = Omit<User, "password">; // Version sans mot de passe pour l'état courant.

export type LoginFormState = {
  email: string; // Champ email saisi.
  password: string; // Champ mot de passe saisi.
};

export type ClientFormState = {
  name: string; // Champ nom client.
  email: string; // Champ email client.
  city: string; // Champ ville client.
  joinedAt: string; // Champ date d'inscription.
};

export type RelationFormState = {
  parrainId: number; // ID du parrain choisi.
  filleulId: number; // ID du filleul choisi.
};

export type PurchaseFormState = {
  clientId: number; // Client associé à l'achat.
  amount: string; // Montant saisi (string avant conversion).
  date: string; // Date saisie.
};

export type CommissionSummary = {
  direct: number[]; // IDs des filleuls directs.
  indirect: number[]; // IDs des filleuls indirects.
  total: number; // Total global (direct + indirect).
  directTotal: number; // Total commissions directes.
  indirectTotal: number; // Total commissions indirectes.
};

export type GraphEdge = Relation & {
  weight: number; // Poids de l'arête (commission directe liée au filleul).
};

export type GraphNodePosition = {
  id: number; // ID du client.
  x: number; // Coordonnée X pour le graphe.
  y: number; // Coordonnée Y pour le graphe.
};

/*
Résumé pédagogique du fichier:
- Ce fichier centralise tous les types TypeScript utilisés dans l'application.
- Chaque type décrit précisément la forme des données échangées entre composants.
*/
