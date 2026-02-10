export type Client = {
  id: number;
  name: string;
  email: string;
  city: string;
  joinedAt: string;
};

export type Relation = {
  id: number;
  parrainId: number;
  filleulId: number;
};

export type Purchase = {
  id: number;
  clientId: number;
  amount: number;
  date: string;
};

export type DataState = {
  clients: Client[];
  relations: Relation[];
  purchases: Purchase[];
};

export type Role = "admin" | "analyst" | "viewer";

export type User = {
  name: string;
  email: string;
  role: Role;
  password: string;
};

export type AuthUser = Omit<User, "password">;

export type LoginFormState = {
  email: string;
  password: string;
};

export type ClientFormState = {
  name: string;
  email: string;
  city: string;
  joinedAt: string;
};

export type RelationFormState = {
  parrainId: number;
  filleulId: number;
};

export type PurchaseFormState = {
  clientId: number;
  amount: string;
  date: string;
};

export type CommissionSummary = {
  direct: number[];
  indirect: number[];
  total: number;
  directTotal: number;
  indirectTotal: number;
};

export type GraphEdge = Relation & {
  weight: number;
};

export type GraphNodePosition = {
  id: number;
  x: number;
  y: number;
};
