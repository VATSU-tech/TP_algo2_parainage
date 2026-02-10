import type { Client, GraphEdge, GraphNodePosition } from "../types/app";

type NetworkGraphProps = {
  clients: Client[];
  edges: GraphEdge[];
  positions: GraphNodePosition[];
  selectedClientId: number;
  directIds: number[];
  indirectIds: number[];
};

export default function NetworkGraph({
  clients,
  edges,
  positions,
  selectedClientId,
  directIds,
  indirectIds,
}: NetworkGraphProps) {
  return (
    <svg viewBox="0 0 640 360" role="img">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#ff6b4a" />
        </marker>
      </defs>
      {edges.map((edge) => {
        const from = positions.find((node) => node.id === edge.parrainId);
        const to = positions.find((node) => node.id === edge.filleulId);
        if (!from || !to) return null;
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const isHighlighted = edge.parrainId === selectedClientId;
        return (
          <g key={edge.id}>
            <line
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isHighlighted ? "#ff6b4a" : "#c9c0b6"}
              strokeWidth={isHighlighted ? 2.6 : 1.6}
              markerEnd="url(#arrow)"
            />
            <rect x={midX - 16} y={midY - 10} width={40} height={18} rx={6} fill="#fff2ea" />
            <text x={midX + 4} y={midY + 3} fontSize="10" fill="#2b2119">
              {edge.weight.toFixed(0)}
            </text>
          </g>
        );
      })}
      {positions.map((node) => {
        const client = clients.find((item) => item.id === node.id);
        const isSelected = node.id === selectedClientId;
        const isDirect = directIds.includes(node.id);
        const isIndirect = indirectIds.includes(node.id);
        const fill = isSelected ? "#ff6b4a" : isDirect ? "#2e7d6e" : isIndirect ? "#6a5acd" : "#f5efe6";
        const textFill = isSelected ? "#fff" : "#2b2119";

        return (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r={18} fill={fill} stroke="#2b2119" strokeWidth="1" />
            <text x={node.x} y={node.y + 4} fontSize="10" textAnchor="middle" fill={textFill}>
              {client?.name.split(" ")[0] ?? node.id}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
