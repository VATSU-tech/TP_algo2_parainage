export type Client = {
    id: number; // Identifiant client.
    name: string; // Nom du client.
};

export type Relation = {
    id: number; // Identifiant relation.
    parrain_id: number; // ID du parrain (snake_case dans ce fichier).
    sheet_id: number; // ID associé à la relation (source externe ?).
};

export type Achat = {
    id: number; // Identifiant achat.
    client_id: number; // ID du client.
    montatn: number; // Montant (typo conservée pour compatibilité).
    date_pay: string; // Date de paiement.
};

export type Graph = Record<number, Record<number, number>>; // Graphe pondéré (adjacence).

/*
Résumé pédagogique du fichier:
- Types alternatifs (snake_case) pour un modèle différent ou legacy.
- Décrit Client, Relation, Achat et un graphe pondéré.
*/
