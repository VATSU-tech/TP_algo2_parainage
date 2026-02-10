import type { Client, Purchase, Relation } from "../types/app";
import { formatMoney } from "../utils/format";

type TablesSectionProps = {
  clients: Client[];
  relations: Relation[];
  purchases: Purchase[];
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
