import { useState, useCallback } from 'react';
import { institutions, collaborationEdges, nodePositions } from '@/data/mockData';
import type { Institution, CollaborationEdge, InstitutionType, EdgeStatus } from '@/data/mockData';
import { motion } from 'framer-motion';

const typeColors: Record<InstitutionType, string> = {
  government: 'hsl(210, 72%, 55%)',
  ngo: 'hsl(160, 72%, 50%)',
  private: 'hsl(38, 80%, 55%)',
  research: 'hsl(280, 65%, 55%)',
  community: 'hsl(330, 65%, 55%)',
  donor: 'hsl(160, 72%, 42%)',
};

const edgeStatusColors: Record<EdgeStatus, string> = {
  healthy: 'hsl(160, 72%, 42%)',
  delayed: 'hsl(38, 92%, 55%)',
  blocked: 'hsl(0, 72%, 55%)',
  inactive: 'hsl(222, 15%, 35%)',
};

interface Props {
  onSelectInstitution?: (inst: Institution) => void;
}

export default function InstitutionNetworkGraph({ onSelectInstitution }: Props) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<CollaborationEdge | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const getNodeSize = useCallback((inst: Institution) => {
    return 12 + inst.activeProjects * 2;
  }, []);

  return (
    <div className="relative h-full min-h-[400px] rounded-lg border border-border bg-card overflow-hidden">
      <div className="absolute top-3 left-3 z-10">
        <h3 className="text-sm font-semibold text-foreground">Institutional Network</h3>
        <p className="text-[10px] text-muted-foreground">Click node for details · Hover edge for relationship</p>
      </div>

      {/* Legend */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        {(Object.entries(typeColors) as [InstitutionType, string][]).map(([type, color]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[9px] text-muted-foreground capitalize">{type}</span>
          </div>
        ))}
      </div>

      <svg viewBox="0 0 720 540" className="w-full h-full">
        {/* Edges */}
        {collaborationEdges.map((edge, i) => {
          const source = nodePositions[edge.source];
          const target = nodePositions[edge.target];
          if (!source || !target) return null;
          const isHovered = hoveredEdge === edge;
          return (
            <line
              key={i}
              x1={source.x} y1={source.y}
              x2={target.x} y2={target.y}
              stroke={edgeStatusColors[edge.status]}
              strokeWidth={isHovered ? edge.intensity * 4 + 2 : edge.intensity * 3}
              strokeOpacity={hoveredNode ? (edge.source === hoveredNode || edge.target === hoveredNode ? 0.8 : 0.1) : isHovered ? 1 : 0.4}
              strokeDasharray={edge.status === 'inactive' ? '4,4' : undefined}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={(e) => { setHoveredEdge(edge); setTooltipPos({ x: e.clientX, y: e.clientY }); }}
              onMouseLeave={() => setHoveredEdge(null)}
            />
          );
        })}

        {/* Nodes */}
        {institutions.map((inst) => {
          const pos = nodePositions[inst.id];
          if (!pos) return null;
          const size = getNodeSize(inst);
          const isHovered = hoveredNode === inst.id;
          const isConnected = hoveredNode ? collaborationEdges.some(e => (e.source === hoveredNode && e.target === inst.id) || (e.target === hoveredNode && e.source === inst.id)) : true;
          const dimmed = hoveredNode && hoveredNode !== inst.id && !isConnected;

          return (
            <g key={inst.id}
              className="cursor-pointer"
              onClick={() => onSelectInstitution?.(inst)}
              onMouseEnter={() => setHoveredNode(inst.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {isHovered && (
                <circle cx={pos.x} cy={pos.y} r={size + 6} fill={typeColors[inst.type]} fillOpacity={0.15} />
              )}
              <circle
                cx={pos.x} cy={pos.y} r={size}
                fill={typeColors[inst.type]}
                fillOpacity={dimmed ? 0.2 : 0.85}
                stroke={typeColors[inst.type]}
                strokeWidth={isHovered ? 2.5 : 1.5}
                strokeOpacity={dimmed ? 0.2 : 1}
                className="transition-all duration-200"
              />
              <text
                x={pos.x} y={pos.y + size + 14}
                textAnchor="middle"
                fill="hsl(210, 30%, 75%)"
                fontSize="10"
                fontFamily="Inter, sans-serif"
                opacity={dimmed ? 0.2 : 0.9}
                className="transition-opacity duration-200 pointer-events-none"
              >
                {inst.shortName}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Edge tooltip */}
      {hoveredEdge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed z-50 rounded-md border border-border bg-popover px-3 py-2 shadow-lg pointer-events-none"
          style={{ left: tooltipPos.x + 12, top: tooltipPos.y - 40 }}
        >
          <div className="text-[11px] font-medium text-foreground capitalize">
            {hoveredEdge.relationshipType.replace('_', ' ')}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-muted-foreground">
              {institutions.find(i => i.id === hoveredEdge.source)?.shortName} → {institutions.find(i => i.id === hoveredEdge.target)?.shortName}
            </span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
              hoveredEdge.status === 'healthy' ? 'status-healthy' :
              hoveredEdge.status === 'delayed' ? 'status-delayed' :
              hoveredEdge.status === 'blocked' ? 'status-blocked' : 'status-inactive'
            }`}>
              {hoveredEdge.status}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
