type HeroProps = {
  directRate: number;
  indirectRate: number;
  deadlineLabel: string;
  onExport: () => void;
};

export default function Hero({ directRate, indirectRate, deadlineLabel, onExport }: HeroProps) {
  return (
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
        <div className="chip">Commission directe {directRate * 100}%</div>
        <div className="chip chip--ghost">Commission indirecte {indirectRate * 100}%</div>
        <div className="chip chip--dark">Date limite: {deadlineLabel}</div>
        <button type="button" className="button button--primary" onClick={onExport}>
          Exporter PDF
        </button>
      </div>
    </header>
  );
}
