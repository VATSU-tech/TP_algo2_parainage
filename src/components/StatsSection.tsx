import { formatMoney } from "../utils/format"; // Formatte les montants affichés.

type StatsSectionProps = {
  clientsCount: number; // Nombre total de clients.
  relationsCount: number; // Nombre total de relations.
  purchasesCount: number; // Nombre total d'achats.
  totalNetworkSales: number; // Somme des achats.
};

export default function StatsSection({
  clientsCount,
  relationsCount,
  purchasesCount,
  totalNetworkSales,
}: StatsSectionProps) {
  return (
    <section className="grid grid--stats">
      {/* Carte Clients */}
      <div className="card">
        <p className="card__label">Clients</p>
        <h2>{clientsCount}</h2>
        <p className="card__hint">Minimum requis: 8</p>
      </div>
      {/* Carte Relations */}
      <div className="card">
        <p className="card__label">Relations</p>
        <h2>{relationsCount}</h2>
        <p className="card__hint">Minimum requis: 10</p>
      </div>
      {/* Carte Achats */}
      <div className="card">
        <p className="card__label">Achats</p>
        <h2>{purchasesCount}</h2>
        <p className="card__hint">Minimum requis: 15</p>
      </div>
      {/* Carte Ventes réseau */}
      <div className="card">
        <p className="card__label">Ventes réseau</p>
        <h2>{formatMoney(totalNetworkSales)}</h2>
        <p className="card__hint">Somme des achats enregistrés</p>
      </div>
    </section>
  );
}

/*
Résumé pédagogique du composant:
- Affiche 4 indicateurs clés sous forme de cartes.
- Utilise formatMoney pour le total des ventes.
*/
