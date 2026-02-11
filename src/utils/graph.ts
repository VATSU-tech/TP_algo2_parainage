import type { CommissionSummary, Relation } from "../types/app"; // Types pour le graphe et la synthèse.

// Transforme une liste de relations en liste d'adjacence (Map parrain -> liste des filleuls).
export const buildAdjacency = (relations: Relation[]) => {
  const adjacency = new Map<number, number[]>();
  relations.forEach((relation) => {
    const list = adjacency.get(relation.parrainId) ?? [];
    list.push(relation.filleulId);
    adjacency.set(relation.parrainId, list);
  });
  return adjacency;
};

// Vérifie si ajouter une relation parrain->filleul créerait un cycle.
export const wouldCreateCycle = (
  parrainId: number,
  filleulId: number,
  adjacency: Map<number, number[]>
) => {
  // Cas trivial: un client ne peut pas être son propre parrain.
  if (parrainId === filleulId) return true;
  // DFS/BFS depuis le filleul: si on atteint le parrain, on crée un cycle.
  const stack = [filleulId];
  const visited = new Set<number>();
  while (stack.length) {
    const current = stack.pop();
    if (current === undefined) continue;
    if (current === parrainId) return true;
    if (visited.has(current)) continue;
    visited.add(current);
    const children = adjacency.get(current) ?? [];
    children.forEach((child) => {
      if (!visited.has(child)) stack.push(child);
    });
  }
  return false;
};

// Détection de cycle global dans le graphe via DFS (pile de récursion).
export const hasCycle = (adjacency: Map<number, number[]>) => {
  const visited = new Set<number>();
  const inStack = new Set<number>();

  // DFS récursif: si on revisite un nœud "en cours", il y a un cycle.
  const dfs = (node: number): boolean => {
    if (inStack.has(node)) return true;
    if (visited.has(node)) return false;
    visited.add(node);
    inStack.add(node);
    const children = adjacency.get(node) ?? [];
    for (const child of children) {
      if (dfs(child)) return true;
    }
    inStack.delete(node);
    return false;
  };

  // On teste chaque nœud racine potentiel.
  for (const node of adjacency.keys()) {
    if (dfs(node)) return true;
  }
  return false;
};

// Calcule les commissions directes et indirectes pour un parrain donné.
export const getCommissionTotal = (
  parrainId: number,
  adjacency: Map<number, number[]>,
  totalsByClient: Map<number, number>,
  directRate: number,
  indirectRate: number
): CommissionSummary => {
  // Listes d'IDs pour l'affichage.
  const direct: number[] = [];
  const indirect: number[] = [];
  // Set pour éviter les doublons.
  const visited = new Set<number>([parrainId]);
  // BFS: file contenant {id, depth} pour distinguer direct/indirect.
  const queue: Array<{ id: number; depth: number }> = [{ id: parrainId, depth: 0 }];
  let directTotal = 0;
  let indirectTotal = 0;

  while (queue.length) {
    const current = queue.shift();
    if (!current) continue;
    const children = adjacency.get(current.id) ?? [];

    children.forEach((childId) => {
      if (visited.has(childId)) return;
      visited.add(childId);

      const totalPurchases = totalsByClient.get(childId) ?? 0;
      // Si depth === 0, on est sur les filleuls directs.
      if (current.depth === 0) {
        direct.push(childId);
        directTotal += totalPurchases * directRate;
      } else {
        // Sinon, c'est indirect.
        indirect.push(childId);
        indirectTotal += totalPurchases * indirectRate;
      }
      // On continue le BFS en augmentant la profondeur.
      queue.push({ id: childId, depth: current.depth + 1 });
    });
  }

  // Synthèse finale.
  return {
    direct,
    indirect,
    total: directTotal + indirectTotal,
    directTotal,
    indirectTotal,
  };
};

/*
Résumé pédagogique du fichier:
- buildAdjacency: construit la structure Map parrain -> filleuls.
- wouldCreateCycle / hasCycle: empêchent les relations incohérentes dans le graphe.
- getCommissionTotal: parcourt le réseau en BFS pour calculer direct/indirect.
*/
