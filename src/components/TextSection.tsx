type TextSectionProps = {
  adjacencyList: string; // Graphe sous forme de texte.
  cycleDetected: boolean; // Indique si un cycle est détecté.
};

export default function TextSection({ adjacencyList, cycleDetected }: TextSectionProps) {
  return (
    <section className="grid grid--text">
      <div className="panel">
        <h3>Représentation textuelle</h3>
        {/* Affichage brut du graphe sous forme de texte */}
        <pre className="console">{adjacencyList}</pre>
      </div>
      <div className="panel">
        <h3>Contrôle de cohérence</h3>
        {/* Message conditionnel selon la présence d'un cycle */}
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

/*
Résumé pédagogique du composant:
- Affiche le graphe en texte et un diagnostic de cohérence.
- Le style du message change selon cycleDetected.
*/
