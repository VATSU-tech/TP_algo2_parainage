type TextSectionProps = {
  adjacencyList: string;
  cycleDetected: boolean;
};

export default function TextSection({ adjacencyList, cycleDetected }: TextSectionProps) {
  return (
    <section className="grid grid--text">
      <div className="panel">
        <h3>Représentation textuelle</h3>
        <pre className="console">{adjacencyList}</pre>
      </div>
      <div className="panel">
        <h3>Contrôle de cohérence</h3>
        <p className={`notice ${cycleDetected ? "notice--danger" : "notice--ok"}`}>
          {cycleDetected
            ? "Attention: un cycle existe dans le graphe actuel."
            : "Aucun cycle détecté. Le graphe est cohérent."}
        </p>
        <p className="muted">Les relations créant un cycle sont refusées à l'ajout.</p>
      </div>
    </section>
  );
}
