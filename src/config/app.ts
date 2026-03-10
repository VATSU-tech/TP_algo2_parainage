import type { Role, User } from "../types/app"; // Types pour sécuriser la config.

export const DIRECT_RATE = 0.05; // Taux de commission directe (5%).
export const INDIRECT_RATE = 0.01; // Taux de commission indirecte (1%).

// Comptes de démonstration (utilisés pour l'auth).
export const USERS: User[] = [
  { name: "Admin", email: "admin@demo.fr", role: "admin", password: "admin123" },
  { name: "Analyste", email: "analyste@demo.fr", role: "analyst", password: "analyst123" },
  { name: "Visiteur", email: "visiteur@demo.fr", role: "viewer", password: "viewer123" },
];

// Libellés lisibles pour l'affichage des rôles.
export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrateur",
  analyst: "Analyste",
  viewer: "Visiteur",
};

/*
Résumé pédagogique du fichier:
- Centralise la configuration: taux de commission, comptes de démo.
- Fournit aussi un mapping pour afficher des libellés de rôles.
*/
