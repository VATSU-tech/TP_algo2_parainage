type HeroProps = {
  directRate: number; // Taux direct (ex: 0.05).
  indirectRate: number; // Taux indirect (ex: 0.01).
  deadlineLabel: string; // Texte de date limite.
  onExport: () => void; // Callback export PDF.
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
        {/* Affichage des taux en pourcentage */}
        <div className="chip">Commission directe {directRate * 100}%</div>
        <div className="chip chip--ghost">Commission indirecte {indirectRate * 100}%</div>
        <div className="chip chip--dark">Date limite: {deadlineLabel}</div>
        {/* Bouton d'export PDF */}
        <button type="button" className="button button--primary" onClick={onExport}>
          Exporter PDF
        </button>
      </div>
    </header>
  );
}

/*
Résumé pédagogique du composant:
- Affiche l'en-tête de la page avec titre, description et métadonnées.
- Les taux sont convertis en pourcentage pour l'affichage.
- Le bouton déclenche l'export PDF via onExport.
*/
