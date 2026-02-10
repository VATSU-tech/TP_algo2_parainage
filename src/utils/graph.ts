import type { CommissionSummary, Relation } from "../types/app";

export const buildAdjacency = (relations: Relation[]) => {
  const adjacency = new Map<number, number[]>();
  relations.forEach((relation) => {
    const list = adjacency.get(relation.parrainId) ?? [];
    list.push(relation.filleulId);
    adjacency.set(relation.parrainId, list);
  });
  return adjacency;
};

export const wouldCreateCycle = (
  parrainId: number,
  filleulId: number,
  adjacency: Map<number, number[]>
) => {
  if (parrainId === filleulId) return true;
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

export const hasCycle = (adjacency: Map<number, number[]>) => {
  const visited = new Set<number>();
  const inStack = new Set<number>();

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

  for (const node of adjacency.keys()) {
    if (dfs(node)) return true;
  }
  return false;
};

export const getCommissionTotal = (
  parrainId: number,
  adjacency: Map<number, number[]>,
  totalsByClient: Map<number, number>,
  directRate: number,
  indirectRate: number
): CommissionSummary => {
  const direct: number[] = [];
  const indirect: number[] = [];
  const visited = new Set<number>([parrainId]);
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
      if (current.depth === 0) {
        direct.push(childId);
        directTotal += totalPurchases * directRate;
      } else {
        indirect.push(childId);
        indirectTotal += totalPurchases * indirectRate;
      }
      queue.push({ id: childId, depth: current.depth + 1 });
    });
  }

  return {
    direct,
    indirect,
    total: directTotal + indirectTotal,
    directTotal,
    indirectTotal,
  };
};
