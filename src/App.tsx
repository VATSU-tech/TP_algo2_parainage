import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import "./sass/Style.scss";

type Client = {
  id: number;
  name: string;
  email: string;
  city: string;
  joinedAt: string;
};

type Relation = {
  id: number;
  parrainId: number;
  filleulId: number;
};

type Purchase = {
  id: number;
  clientId: number;
  amount: number;
  date: string;
};

type DataState = {
  clients: Client[];
  relations: Relation[];
  purchases: Purchase[];
};

const STORAGE_KEY = "tp-parrainage-data-v1";
const DIRECT_RATE = 0.05;
const INDIRECT_RATE = 0.01;

const seedData: DataState = {
  clients: [
    { id: 1, name: "Alice Martin", email: "alice@entreprise.fr", city: "Lyon", joinedAt: "2024-02-18" },
    { id: 2, name: "Bob Diallo", email: "bob@entreprise.fr", city: "Lille", joinedAt: "2024-03-02" },
    { id: 3, name: "Charlie Morel", email: "charlie@entreprise.fr", city: "Paris", joinedAt: "2024-03-15" },
    { id: 4, name: "David Kouam", email: "david@entreprise.fr", city: "Marseille", joinedAt: "2024-04-01" },
    { id: 5, name: "Eva Renaud", email: "eva@entreprise.fr", city: "Toulouse", joinedAt: "2024-04-12" },
    { id: 6, name: "Farid Ben", email: "farid@entreprise.fr", city: "Nice", joinedAt: "2024-05-01" },
    { id: 7, name: "Gaby Lemoine", email: "gaby@entreprise.fr", city: "Nantes", joinedAt: "2024-05-05" },
    { id: 8, name: "Hugo Durant", email: "hugo@entreprise.fr", city: "Rennes", joinedAt: "2024-05-09" },
    { id: 9, name: "Ines Valette", email: "ines@entreprise.fr", city: "Bordeaux", joinedAt: "2024-05-20" },
    { id: 10, name: "Jules Mahé", email: "jules@entreprise.fr", city: "Grenoble", joinedAt: "2024-06-03" },
    { id: 11, name: "Karim Roche", email: "karim@entreprise.fr", city: "Montpellier", joinedAt: "2024-06-15" },
  ],
  relations: [
    { id: 1, parrainId: 1, filleulId: 2 },
    { id: 2, parrainId: 1, filleulId: 3 },
    { id: 3, parrainId: 1, filleulId: 5 },
    { id: 4, parrainId: 2, filleulId: 4 },
    { id: 5, parrainId: 2, filleulId: 6 },
    { id: 6, parrainId: 3, filleulId: 7 },
    { id: 7, parrainId: 3, filleulId: 8 },
    { id: 8, parrainId: 5, filleulId: 9 },
    { id: 9, parrainId: 6, filleulId: 10 },
    { id: 10, parrainId: 8, filleulId: 11 },
  ],
  purchases: [
    { id: 1, clientId: 2, amount: 200, date: "2025-01-12" },
    { id: 2, clientId: 2, amount: 130, date: "2025-02-04" },
    { id: 3, clientId: 3, amount: 150, date: "2025-01-18" },
    { id: 4, clientId: 3, amount: 90, date: "2025-02-25" },
    { id: 5, clientId: 4, amount: 350, date: "2025-01-21" },
    { id: 6, clientId: 4, amount: 80, date: "2025-03-03" },
    { id: 7, clientId: 5, amount: 220, date: "2025-01-30" },
    { id: 8, clientId: 5, amount: 140, date: "2025-02-12" },
    { id: 9, clientId: 6, amount: 310, date: "2025-02-08" },
    { id: 10, clientId: 6, amount: 90, date: "2025-03-02" },
    { id: 11, clientId: 7, amount: 180, date: "2025-02-14" },
    { id: 12, clientId: 7, amount: 210, date: "2025-03-09" },
    { id: 13, clientId: 8, amount: 260, date: "2025-02-27" },
    { id: 14, clientId: 9, amount: 175, date: "2025-02-22" },
    { id: 15, clientId: 10, amount: 240, date: "2025-02-18" },
    { id: 16, clientId: 11, amount: 160, date: "2025-02-19" },
  ],
};

const formatMoney = (value: number) => `${value.toFixed(2)} $`;

const getNextId = (items: { id: number }[]) =>
  items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;

const buildAdjacency = (relations: Relation[]) => {
  const adjacency = new Map<number, number[]>();
  relations.forEach((relation) => {
    const list = adjacency.get(relation.parrainId) ?? [];
    list.push(relation.filleulId);
    adjacency.set(relation.parrainId, list);
  });
  return adjacency;
};

const getCommissionTotal = (
  parrainId: number,
  adjacency: Map<number, number[]>,
  totalsByClient: Map<number, number>,
  directRate = DIRECT_RATE,
  indirectRate = INDIRECT_RATE
) => {
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

export default function App() {
  const [data, setData] = useState<DataState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as DataState;
    } catch (error) {
      console.warn("Impossible de charger la sauvegarde locale", error);
    }
    return seedData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const [selectedClientId, setSelectedClientId] = useState<number>(data.clients[0]?.id ?? 1);
  const [clientForm, setClientForm] = useState({ name: "", email: "", city: "", joinedAt: "" });
  const [relationForm, setRelationForm] = useState({ parrainId: data.clients[0]?.id ?? 1, filleulId: data.clients[1]?.id ?? 2 });
  const [purchaseForm, setPurchaseForm] = useState({ clientId: data.clients[0]?.id ?? 1, amount: "", date: "" });
  const [formMessage, setFormMessage] = useState<string>("");

  const totalsByClient = useMemo(() => {
    const totals = new Map<number, number>();
    data.purchases.forEach((purchase) => {
      totals.set(purchase.clientId, (totals.get(purchase.clientId) ?? 0) + purchase.amount);
    });
    return totals;
  }, [data.purchases]);

  const adjacency = useMemo(() => buildAdjacency(data.relations), [data.relations]);

  const selectedCommission = useMemo(
    () => getCommissionTotal(selectedClientId, adjacency, totalsByClient),
    [selectedClientId, adjacency, totalsByClient]
  );

  const graphEdges = useMemo(() => {
    return data.relations.map((relation) => ({
      ...relation,
      weight: (totalsByClient.get(relation.filleulId) ?? 0) * DIRECT_RATE,
    }));
  }, [data.relations, totalsByClient]);

  const graphPositions = useMemo(() => {
    const width = 640;
    const height = 360;
    const radius = 140;
    const centerX = width / 2;
    const centerY = height / 2;

    return data.clients.map((client, index) => {
      const angle = (index / data.clients.length) * Math.PI * 2 - Math.PI / 2;
      return {
        id: client.id,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [data.clients]);

  const topClients = useMemo(() => {
    return data.clients
      .map((client) => {
        const commission = getCommissionTotal(client.id, adjacency, totalsByClient);
        return {
          client,
          total: commission.total,
        };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [data.clients, adjacency, totalsByClient]);

  const adjacencyList = useMemo(() => {
    return data.clients
      .map((client) => {
        const children = data.relations.filter((relation) => relation.parrainId === client.id);
        if (!children.length) return `${client.name} -> (aucun filleul)`;
        const detail = children
          .map((relation) => {
            const child = data.clients.find((item) => item.id === relation.filleulId);
            const weight = (totalsByClient.get(relation.filleulId) ?? 0) * DIRECT_RATE;
            return `${child?.name ?? relation.filleulId} (${formatMoney(weight)})`;
          })
          .join(", ");
        return `${client.name} -> ${detail}`;
      })
      .join("\n");
  }, [data.clients, data.relations, totalsByClient]);

  const totalNetworkSales = useMemo(
    () => Array.from(totalsByClient.values()).reduce((sum, value) => sum + value, 0),
    [totalsByClient]
  );

  const handleClientSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormMessage("");

    if (!clientForm.name.trim() || !clientForm.email.trim()) {
      setFormMessage("Nom et email sont obligatoires pour ajouter un client.");
      return;
    }

    const newClient: Client = {
      id: getNextId(data.clients),
      name: clientForm.name.trim(),
      email: clientForm.email.trim(),
      city: clientForm.city.trim() || "Ville inconnue",
      joinedAt: clientForm.joinedAt || new Date().toISOString().slice(0, 10),
    };

    setData((prev) => ({
      ...prev,
      clients: [...prev.clients, newClient],
    }));

    setClientForm({ name: "", email: "", city: "", joinedAt: "" });
    setSelectedClientId(newClient.id);
  };

  const handleRelationSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormMessage("");

    if (relationForm.parrainId === relationForm.filleulId) {
      setFormMessage("Un client ne peut pas se parrainer lui-même.");
      return;
    }

    const exists = data.relations.some(
      (relation) =>
        relation.parrainId === relationForm.parrainId && relation.filleulId === relationForm.filleulId
    );

    if (exists) {
      setFormMessage("Cette relation existe déjà.");
      return;
    }

    const newRelation: Relation = {
      id: getNextId(data.relations),
      parrainId: relationForm.parrainId,
      filleulId: relationForm.filleulId,
    };

    setData((prev) => ({
      ...prev,
      relations: [...prev.relations, newRelation],
    }));
  };

  const handlePurchaseSubmit = (event: FormEvent) => {
    event.preventDefault();
    setFormMessage("");

    const amount = Number(purchaseForm.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      setFormMessage("Le montant doit être un nombre supérieur à 0.");
      return;
    }

    const newPurchase: Purchase = {
      id: getNextId(data.purchases),
      clientId: purchaseForm.clientId,
      amount,
      date: purchaseForm.date || new Date().toISOString().slice(0, 10),
    };

    setData((prev) => ({
      ...prev,
      purchases: [...prev.purchases, newPurchase],
    }));
    setPurchaseForm({ clientId: purchaseForm.clientId, amount: "", date: "" });
  };

  const selectedClient = data.clients.find((client) => client.id === selectedClientId);
  const directNames = selectedCommission.direct
    .map((id) => data.clients.find((client) => client.id === id)?.name ?? `#${id}`)
    .sort();
  const indirectNames = selectedCommission.indirect
    .map((id) => data.clients.find((client) => client.id === id)?.name ?? `#${id}`)
    .sort();

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="hero__eyebrow">TP 3 - Algorithmique 2</p>
          <h1>Gestion du parrainage et des commissions</h1>
          <p className="hero__subtitle">
            Réseau de clients, relations parrain-filleul, achats et commissions directes/indirectes,
            modélisés avec un graphe pondéré.
          </p>
        </div>
        <div className="hero__meta">
          <div className="chip">Commission directe {DIRECT_RATE * 100}%</div>
          <div className="chip chip--ghost">Commission indirecte {INDIRECT_RATE * 100}%</div>
          <div className="chip chip--dark">Date limite: 10/03/2026</div>
        </div>
      </header>

      <section className="grid grid--stats">
        <div className="card">
          <p className="card__label">Clients</p>
          <h2>{data.clients.length}</h2>
          <p className="card__hint">Minimum requis: 8</p>
        </div>
        <div className="card">
          <p className="card__label">Relations</p>
          <h2>{data.relations.length}</h2>
          <p className="card__hint">Minimum requis: 10</p>
        </div>
        <div className="card">
          <p className="card__label">Achats</p>
          <h2>{data.purchases.length}</h2>
          <p className="card__hint">Minimum requis: 15</p>
        </div>
        <div className="card">
          <p className="card__label">Ventes réseau</p>
          <h2>{formatMoney(totalNetworkSales)}</h2>
          <p className="card__hint">Somme des achats enregistrés</p>
        </div>
      </section>

      <section className="grid grid--forms">
        <div className="panel">
          <h3>Ajouter un client</h3>
          <form onSubmit={handleClientSubmit} className="form">
            <label>
              Nom complet
              <input
                value={clientForm.name}
                onChange={(event) => setClientForm({ ...clientForm, name: event.target.value })}
                placeholder="Ex: Amine Diallo"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={clientForm.email}
                onChange={(event) => setClientForm({ ...clientForm, email: event.target.value })}
                placeholder="prenom@entreprise.fr"
              />
            </label>
            <label>
              Ville
              <input
                value={clientForm.city}
                onChange={(event) => setClientForm({ ...clientForm, city: event.target.value })}
                placeholder="Ex: Paris"
              />
            </label>
            <label>
              Date d'inscription
              <input
                type="date"
                value={clientForm.joinedAt}
                onChange={(event) => setClientForm({ ...clientForm, joinedAt: event.target.value })}
              />
            </label>
            <button type="submit" className="button button--primary">
              Ajouter
            </button>
          </form>
        </div>

        <div className="panel">
          <h3>Ajouter une relation</h3>
          <form onSubmit={handleRelationSubmit} className="form">
            <label>
              Parrain
              <select
                value={relationForm.parrainId}
                onChange={(event) =>
                  setRelationForm({ ...relationForm, parrainId: Number(event.target.value) })
                }
              >
                {data.clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Filleul
              <select
                value={relationForm.filleulId}
                onChange={(event) =>
                  setRelationForm({ ...relationForm, filleulId: Number(event.target.value) })
                }
              >
                {data.clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className="button button--primary">
              Ajouter
            </button>
          </form>
        </div>

        <div className="panel">
          <h3>Ajouter un achat</h3>
          <form onSubmit={handlePurchaseSubmit} className="form">
            <label>
              Client
              <select
                value={purchaseForm.clientId}
                onChange={(event) =>
                  setPurchaseForm({ ...purchaseForm, clientId: Number(event.target.value) })
                }
              >
                {data.clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Montant ($)
              <input
                type="number"
                min="1"
                step="0.01"
                value={purchaseForm.amount}
                onChange={(event) => setPurchaseForm({ ...purchaseForm, amount: event.target.value })}
                placeholder="Ex: 250"
              />
            </label>
            <label>
              Date
              <input
                type="date"
                value={purchaseForm.date}
                onChange={(event) => setPurchaseForm({ ...purchaseForm, date: event.target.value })}
              />
            </label>
            <button type="submit" className="button button--primary">
              Ajouter
            </button>
          </form>
        </div>
      </section>

      {formMessage ? <p className="alert">{formMessage}</p> : null}

      <section className="grid grid--analysis">
        <div className="panel">
          <div className="panel__header">
            <h3>Analyse des commissions</h3>
            <select
              value={selectedClientId}
              onChange={(event) => setSelectedClientId(Number(event.target.value))}
            >
              {data.clients.map((client) => (
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

      <section className="grid grid--graph">
        <div className="panel panel--graph">
          <div className="panel__header">
            <h3>Graphe pondéré du réseau</h3>
            <span className="tag">Poids = achats du filleul × 5%</span>
          </div>
          <svg viewBox="0 0 640 360" role="img">
            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 z" fill="#ff6b4a" />
              </marker>
            </defs>
            {graphEdges.map((edge) => {
              const from = graphPositions.find((node) => node.id === edge.parrainId);
              const to = graphPositions.find((node) => node.id === edge.filleulId);
              if (!from || !to) return null;
              const midX = (from.x + to.x) / 2;
              const midY = (from.y + to.y) / 2;
              const isHighlighted = edge.parrainId === selectedClientId;
              return (
                <g key={edge.id}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke={isHighlighted ? "#ff6b4a" : "#c9c0b6"}
                    strokeWidth={isHighlighted ? 2.6 : 1.6}
                    markerEnd="url(#arrow)"
                  />
                  <rect x={midX - 16} y={midY - 10} width={40} height={18} rx={6} fill="#fff2ea" />
                  <text x={midX + 4} y={midY + 3} fontSize="10" fill="#2b2119">
                    {edge.weight.toFixed(0)}
                  </text>
                </g>
              );
            })}
            {graphPositions.map((node) => {
              const client = data.clients.find((item) => item.id === node.id);
              const isSelected = node.id === selectedClientId;
              const isDirect = selectedCommission.direct.includes(node.id);
              const isIndirect = selectedCommission.indirect.includes(node.id);
              const fill = isSelected ? "#ff6b4a" : isDirect ? "#2e7d6e" : isIndirect ? "#6a5acd" : "#f5efe6";
              const textFill = isSelected ? "#fff" : "#2b2119";

              return (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r={18} fill={fill} stroke="#2b2119" strokeWidth="1" />
                  <text x={node.x} y={node.y + 4} fontSize="10" textAnchor="middle" fill={textFill}>
                    {client?.name.split(" ")[0] ?? node.id}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="legend">
            Couleurs: parrain sélectionné (orange), filleuls directs (vert), indirects (violet).
          </p>
        </div>

        <div className="panel">
          <h3>Représentation textuelle</h3>
          <pre className="console">{adjacencyList}</pre>
        </div>
      </section>

      <section className="grid grid--tables">
        <div className="panel">
          <h3>Table Clients</h3>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Ville</th>
                <th>Inscription</th>
              </tr>
            </thead>
            <tbody>
              {data.clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.city}</td>
                  <td>{client.joinedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Table Relations</h3>
          <table>
            <thead>
              <tr>
                <th>Parrain</th>
                <th>Filleul</th>
              </tr>
            </thead>
            <tbody>
              {data.relations.map((relation) => {
                const parrain = data.clients.find((client) => client.id === relation.parrainId);
                const filleul = data.clients.find((client) => client.id === relation.filleulId);
                return (
                  <tr key={relation.id}>
                    <td>{parrain?.name ?? relation.parrainId}</td>
                    <td>{filleul?.name ?? relation.filleulId}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <h3>Table Achats</h3>
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Montant</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.purchases.map((purchase) => {
                const client = data.clients.find((item) => item.id === purchase.clientId);
                return (
                  <tr key={purchase.id}>
                    <td>{client?.name ?? purchase.clientId}</td>
                    <td>{formatMoney(purchase.amount)}</td>
                    <td>{purchase.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <footer className="footer">
        <p>
          Fonction clé: <code>getCommissionTotal(parrain)</code> calcule toutes les commissions directes et
          indirectes à partir du graphe.
        </p>
      </footer>
    </div>
  );
}
