import type { Client, CommissionSummary } from "../types/app"; // Types métiers pour typer les props et éviter les erreurs de données.
import { formatMoney } from "../utils/format"; // Utilitaire d'affichage pour uniformiser le format monétaire.

type TopClient = {
  client: Client; // Données du client.
  total: number; // Montant total généré par ce client.
};

type AnalysisSectionProps = {
  clients: Client[]; // Liste complète des clients pour alimenter le select.
  selectedClientId: number; // Identifiant du client actuellement sélectionné dans le select.
  selectedClient?: Client; // Détails du client sélectionné (optionnel si pas encore choisi).
  selectedCommission: CommissionSummary; // Synthèse des commissions du client sélectionné.
  directNames: string[]; // Noms des filleuls directs (niveau 1).
  indirectNames: string[]; // Noms des filleuls indirects (niveau 2+).
  topClients: TopClient[]; // Classement des clients les plus rentables.
  onClientSelect: (id: number) => void; // Callback appelé quand l'utilisateur change la sélection.
};

export default function AnalysisSection({
  clients,
  selectedClientId,
  selectedClient,
  selectedCommission,
  directNames,
  indirectNames,
  topClients,
  onClientSelect,
}: AnalysisSectionProps) {
  return (
    <section className="grid grid--analysis">
      <div className="panel">
        <div className="panel__header">
          <h3>Analyse des commissions</h3>
          {/** Logique clé: on convertit la valeur du select (string) en number,
           * puis on remonte l'ID au parent via le callback. */}
          <select
            value={selectedClientId}
            onChange={(event) => onClientSelect(Number(event.target.value))}
          >
            {/** On génère une option par client pour permettre la sélection. */}
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <div className="stats-grid">
          <div>
            <p className="card__label">Parrain sélectionné</p>
            {/** Si aucun client n'est sélectionné, on affiche un tiret. */}
            <p className="card__value">{selectedClient?.name ?? "-"}</p>
            <p className="card__hint">{selectedClient?.email}</p>
          </div>
          <div>
            <p className="card__label">Commission directe</p>
            {/** formatMoney centralise la logique de formatage monétaire. */}
            <p className="card__value">{formatMoney(selectedCommission.directTotal)}</p>
            <p className="card__hint">{directNames.length} filleuls directs</p>
          </div>
          <div>
            <p className="card__label">Commission indirecte</p>
            <p className="card__value">{formatMoney(selectedCommission.indirectTotal)}</p>
            <p className="card__hint">{indirectNames.length} filleuls indirects</p>
          </div>
          <div>
            <p className="card__label">Total</p>
            <p className="card__value highlight">{formatMoney(selectedCommission.total)}</p>
            <p className="card__hint">Calculé via DFS/BFS</p>
          </div>
        </div>
        <div className="pill-grid">
          <div>
            <p className="pill-label">Directs</p>
            <div className="pill-list">
              {/** Logique: si la liste est non vide, on map en "pill"; sinon on affiche "Aucun". */}
              {directNames.length
                ? directNames.map((name) => (
                    <span key={name} className="pill">
                      {name}
                    </span>
                  ))
                : "Aucun"}
            </div>
          </div>
          <div>
            <p className="pill-label">Indirects</p>
            <div className="pill-list">
              {/** Même logique pour les filleuls indirects avec un style "ghost". */}
              {indirectNames.length
                ? indirectNames.map((name) => (
                    <span key={name} className="pill pill--ghost">
                      {name}
                    </span>
                  ))
                : "Aucun"}
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Clients les plus rentables</h3>
        <div className="rank-list">
          {/** Logique: on parcourt le classement et on affiche le rang (index + 1). */}
          {topClients.map(({ client, total }, index) => (
            <div key={client.id} className="rank-item">
              <span className="rank-index">{index + 1}</span>
              <div>
                <p>{client.name}</p>
                <span className="muted">{client.city}</span>
              </div>
              {/** On affiche le montant formaté pour chaque client du top. */}
              <span className="rank-value">{formatMoney(total)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/*
Résumé pédagogique du composant:
- Ce composant affiche une analyse de commissions pour un client sélectionné.
- Il reçoit toutes les données via les props (pas d'état local): clients, sélection actuelle,
  totaux de commissions, listes de filleuls, et classement des meilleurs clients.
- Le select en tête appelle onClientSelect pour remonter l'ID choisi au parent.
- La grille "stats" affiche les commissions directes/indirectes/total, avec formatMoney.
- Les sections "Directs" et "Indirects" utilisent une logique conditionnelle:
  si la liste est vide => "Aucun", sinon on map chaque nom en pill.
- Le bloc "Clients les plus rentables" map le classement et calcule le rang avec index + 1.
En bref: toute la logique est déclarative (JSX + map + ternaires) et la donnée vient du parent.
*/
