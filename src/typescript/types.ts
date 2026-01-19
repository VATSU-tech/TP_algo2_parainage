export type Client = {
    id: number;
    name: string;
};

export type Relation = {
    id: number;
    parrain_id: number;
    sheet_id: number;
};

export type Achat = {
    id: number;
    client_id: number;
    montatn: number;
    date_pay: string;
};

export type Graph = Record<number, Record<number, number>>;