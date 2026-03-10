import type { Client, Purchase, Relation } from "../types/app";

const RAW_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
const API_BASE_URL = RAW_BASE_URL.replace(/\/$/, "");

type ApiErrorResponse = {
  message?: string;
};

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

export const fetchClients = () => apiFetch<Client[]>("/clients");
export const fetchRelations = () => apiFetch<Relation[]>("/relations");
export const fetchPurchases = () => apiFetch<Purchase[]>("/purchases");

export const createClient = (payload: Omit<Client, "id">) =>
  apiFetch<Client>("/clients", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const createRelation = (payload: Omit<Relation, "id">) =>
  apiFetch<Relation>("/relations", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const createPurchase = (payload: Omit<Purchase, "id">) =>
  apiFetch<Purchase>("/purchases", {
    method: "POST",
    body: JSON.stringify(payload),
  });
