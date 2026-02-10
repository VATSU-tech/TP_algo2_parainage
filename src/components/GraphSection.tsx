import type { Client, GraphEdge, GraphNodePosition, Relation } from "../types/app";
import Graph3D from "./Graph3D";
import NetworkGraph from "./NetworkGraph";

type GraphSectionProps = {
  clients: Client[];
  relations: Relation[];
  graphEdges: GraphEdge[];
  graphPositions: GraphNodePosition[];
  selectedClientId: number;
  directIds: number[];
  indirectIds: number[];
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
