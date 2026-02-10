import type { Role, User } from "../types/app";

export const STORAGE_KEY = "tp-parrainage-data-v1";
export const AUTH_KEY = "tp-parrainage-auth-v1";

export const DIRECT_RATE = 0.05;
export const INDIRECT_RATE = 0.01;

export const USERS: User[] = [
  { name: "Admin", email: "admin@demo.fr", role: "admin", password: "admin123" },
  { name: "Analyste", email: "analyste@demo.fr", role: "analyst", password: "analyst123" },
  { name: "Visiteur", email: "visiteur@demo.fr", role: "viewer", password: "viewer123" },
];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Administrateur",
  analyst: "Analyste",
  viewer: "Visiteur",
};
