import type { Client, Purchase, Relation } from "../types/app"; // Types pour les tableaux.
import { formatMoney } from "../utils/format"; // Formatage des montants.

type TablesSectionProps = {
  clients: Client[]; // Liste des clients.
  relations: Relation[]; // Liste des relations.
  purchases: Purchase[]; // Liste des achats.
};

export default function TablesSection({ clients, relations, purchases }: TablesSectionProps) {
  return (
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
            {/* Une ligne par client */}
            {clients.map((client) => (
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
            {/* On cherche les noms à partir des IDs pour un affichage lisible */}
            {relations.map((relation) => {
              const parrain = clients.find((client) => client.id === relation.parrainId);
              const filleul = clients.find((client) => client.id === relation.filleulId);
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
            {/* Une ligne par achat avec montant formaté */}
            {purchases.map((purchase) => {
              const client = clients.find((item) => item.id === purchase.clientId);
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
  );
}

/*
Résumé pédagogique du composant:
- Affiche 3 tableaux: clients, relations, achats.
- Les relations/achats traduisent les IDs en noms lisibles quand possible.
*/
