import type { Client, Purchase, Relation } from "../types/app";

const RAW_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, "");

type ApiErrorResponse = {
  message?: string;
};

const toNumber = (value: unknown, fallback = 0) => {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const normalizeClient = (client: Client): Client => ({
  ...client,
  id: toNumber(client.id),
});

const normalizeRelation = (relation: Relation): Relation => ({
  ...relation,
  id: toNumber(relation.id),
  parrainId: toNumber(relation.parrainId),
  filleulId: toNumber(relation.filleulId),
});

const normalizePurchase = (purchase: Purchase): Purchase => ({
  ...purchase,
  id: toNumber(purchase.id),
  clientId: toNumber(purchase.clientId),
  amount: toNumber(purchase.amount),
});

const buildErrorMessage = async (response: Response) => {
  let message = `Erreur API (${response.status})`;
  try {
    const data = (await response.json()) as ApiErrorResponse;
    if (data?.message) {
      message = data.message;
    }
  } catch {
    // Ignore les erreurs de parsing JSON.
  }
  return message;
};

const apiFetch = async <T>(path: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new Error(await buildErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const fetchClients = async () => (await apiFetch<Client[]>("/clients")).map(normalizeClient);
export const fetchRelations = async () => (await apiFetch<Relation[]>("/relations")).map(normalizeRelation);
export const fetchPurchases = async () => (await apiFetch<Purchase[]>("/purchases")).map(normalizePurchase);

export const createClient = async (payload: Omit<Client, "id">) =>
  normalizeClient(
    await apiFetch<Client>("/clients", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  );

export const createRelation = async (payload: Omit<Relation, "id">) =>
  normalizeRelation(
    await apiFetch<Relation>("/relations", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  );

export const createPurchase = async (payload: Omit<Purchase, "id">) =>
  normalizePurchase(
    await apiFetch<Purchase>("/purchases", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  );

/*
Note: MySQL peut renvoyer les DECIMAL sous forme de string.
On normalise les champs numériques pour éviter les erreurs côté frontend.
*/
