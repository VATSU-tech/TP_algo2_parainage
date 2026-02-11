// Formate un nombre en chaîne monétaire avec 2 décimales.
export const formatMoney = (value: number) => `${value.toFixed(2)} $`;

// Calcule l'ID suivant à partir d'une liste d'objets { id }.
export const getNextId = (items: { id: number }[]) =>
  items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;

/*
Résumé pédagogique du fichier:
- Utilitaires simples: formatage monétaire et génération d'ID incrémental.
*/
