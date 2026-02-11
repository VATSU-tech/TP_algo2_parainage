import type { Client, GraphEdge, GraphNodePosition, Relation } from "../types/app"; // Types du graphe.
import Graph3D from "./Graph3D"; // Graphe 3D (Three.js).
import NetworkGraph from "./NetworkGraph"; // Graphe 2D (SVG).

type GraphSectionProps = {
  clients: Client[]; // Liste des clients.
  relations: Relation[]; // Relations pour le graphe 3D.
  graphEdges: GraphEdge[]; // Arêtes pondérées pour le graphe 2D.
  graphPositions: GraphNodePosition[]; // Positions XY pour le graphe 2D.
  selectedClientId: number; // Client sélectionné.
  directIds: number[]; // IDs directs (mise en évidence).
  indirectIds: number[]; // IDs indirects (mise en évidence).
};

export default function GraphSection({
  clients,
  relations,
  graphEdges,
  graphPositions,
  selectedClientId,
  directIds,
  indirectIds,
}: GraphSectionProps) {
  return (
    <section className="grid grid--graph">
      <div className="panel panel--graph">
        <div className="panel__header">
          <h3>Graphe pondéré du réseau</h3>
          <span className="tag">Poids = achats du filleul × 5%</span>
        </div>
        {/* Graphe 2D SVG */}
        <NetworkGraph
          clients={clients}
          edges={graphEdges}
          positions={graphPositions}
          selectedClientId={selectedClientId}
          directIds={directIds}
          indirectIds={indirectIds}
        />
        <p className="legend">
          Couleurs: parrain sélectionné (orange), filleuls directs (vert), indirects (violet).
        </p>
      </div>

      <div className="panel panel--graph">
        <div className="panel__header">
          <h3>Graphe 3D interactif</h3>
          <span className="tag">Rotation / zoom</span>
        </div>
        {/* Graphe 3D Three.js */}
        <Graph3D
          clients={clients}
          relations={relations}
          selectedId={selectedClientId}
          directIds={directIds}
          indirectIds={indirectIds}
        />
        <p className="legend">Fais glisser pour tourner, molette pour zoomer.</p>
      </div>
    </section>
  );
}

/*
Résumé pédagogique du composant:
- GraphSection juxtapose deux vues: 2D (SVG) et 3D (Three.js).
- Les données de sélection (direct/indirect) servent à colorer les nœuds.
*/
