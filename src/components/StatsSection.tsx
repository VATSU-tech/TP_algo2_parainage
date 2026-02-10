import { formatMoney } from "../utils/format";

type StatsSectionProps = {
  clientsCount: number;
  relationsCount: number;
  purchasesCount: number;
  totalNetworkSales: number;
};

export default function StatsSection({
  clientsCount,
  relationsCount,
  purchasesCount,
  totalNetworkSales,
}: StatsSectionProps) {
  return (
    <section className="grid grid--stats">
      <div className="card">
        <p className="card__label">Clients</p>
        <h2>{clientsCount}</h2>
        <p className="card__hint">Minimum requis: 8</p>
      </div>
      <div className="card">
        <p className="card__label">Relations</p>
        <h2>{relationsCount}</h2>
        <p className="card__hint">Minimum requis: 10</p>
      </div>
      <div className="card">
        <p className="card__label">Achats</p>
        <h2>{purchasesCount}</h2>
        <p className="card__hint">Minimum requis: 15</p>
      </div>
      <div className="card">
        <p className="card__label">Ventes réseau</p>
        <h2>{formatMoney(totalNetworkSales)}</h2>
        <p className="card__hint">Somme des achats enregistrés</p>
      </div>
    </section>
  );
}
