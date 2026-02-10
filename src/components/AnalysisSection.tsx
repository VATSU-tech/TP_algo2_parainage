import type { Client, CommissionSummary } from "../types/app";
import { formatMoney } from "../utils/format";

type TopClient = {
  client: Client;
  total: number;
};

type AnalysisSectionProps = {
  clients: Client[];
  selectedClientId: number;
  selectedClient?: Client;
  selectedCommission: CommissionSummary;
  directNames: string[];
  indirectNames: string[];
  topClients: TopClient[];
  onClientSelect: (id: number) => void;
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
          <select value={selectedClientId} onChange={(event) => onClientSelect(Number(event.target.value))}>
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
            <p className="card__value">{selectedClient?.name ?? "-"}</p>
            <p className="card__hint">{selectedClient?.email}</p>
          </div>
          <div>
            <p className="card__label">Commission directe</p>
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
          {topClients.map(({ client, total }, index) => (
            <div key={client.id} className="rank-item">
              <span className="rank-index">{index + 1}</span>
              <div>
                <p>{client.name}</p>
                <span className="muted">{client.city}</span>
              </div>
              <span className="rank-value">{formatMoney(total)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
