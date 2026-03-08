import { useMemo } from 'react';
import { institutions, raciMatrix, projects, collaborationEdges } from '@/data/mockData';
import { motion } from 'framer-motion';

interface FlowLink {
  source: string;
  target: string;
  value: number;
  projectNames: string[];
}

export default function FundFlowSankey() {
  const { nodes, links } = useMemo(() => {
    // Build fund flows: F-role institutions → lead institutions for each project
    const flowMap = new Map<string, FlowLink>();

    raciMatrix.filter(r => r.role === 'F').forEach(funder => {
      const proj = projects.find(p => p.id === funder.projectId);
      if (!proj || !proj.leadInstitution) return;
      const key = `${funder.institutionId}->${proj.leadInstitution}`;
      const existing = flowMap.get(key);
      if (existing) {
        existing.value += 1;
        existing.projectNames.push(proj.name);
      } else {
        flowMap.set(key, {
          source: funder.institutionId,
          target: proj.leadInstitution,
          value: 1,
          projectNames: [proj.name],
        });
      }
    });

    // Also add collaboration edges marked as 'funding'
    collaborationEdges.filter(e => e.relationshipType === 'funding').forEach(edge => {
      const key = `${edge.source}->${edge.target}`;
      if (!flowMap.has(key)) {
        flowMap.set(key, {
          source: edge.source,
          target: edge.target,
          value: Math.round(edge.intensity * 3),
          projectNames: [],
        });
      }
    });

    const links = Array.from(flowMap.values());
    const nodeIds = new Set<string>();
    links.forEach(l => { nodeIds.add(l.source); nodeIds.add(l.target); });
    const nodes = Array.from(nodeIds).map(id => institutions.find(i => i.id === id)!).filter(Boolean);

    return { nodes, links };
  }, []);

  // Layout: sources on left, targets on right
  const sourceIds = new Set(links.map(l => l.source));
  const targetIds = new Set(links.map(l => l.target));
  const pureTargets = Array.from(targetIds).filter(id => !sourceIds.has(id));
  const pureSources = Array.from(sourceIds);

  const leftNodes = nodes.filter(n => pureSources.includes(n.id));
  const rightNodes = nodes.filter(n => pureTargets.includes(n.id) || (!pureSources.includes(n.id)));
  // Ensure no duplicates
  const rightNodeIds = new Set(rightNodes.map(n => n.id));
  const finalLeft = leftNodes.filter(n => !rightNodeIds.has(n.id) || pureSources.includes(n.id));
  const finalRight = nodes.filter(n => !finalLeft.some(l => l.id === n.id));

  const svgW = 700, svgH = 320;
  const nodeW = 14;
  const leftX = 60, rightX = svgW - 80;

  const leftYStep = (svgH - 40) / Math.max(finalLeft.length, 1);
  const rightYStep = (svgH - 40) / Math.max(finalRight.length, 1);

  const nodeYMap: Record<string, number> = {};
  finalLeft.forEach((n, i) => { nodeYMap[n.id] = 30 + i * leftYStep; });
  finalRight.forEach((n, i) => { nodeYMap[n.id] = 30 + i * rightYStep; });

  const nodeXMap: Record<string, number> = {};
  finalLeft.forEach(n => { nodeXMap[n.id] = leftX; });
  finalRight.forEach(n => { nodeXMap[n.id] = rightX; });

  const maxValue = Math.max(...links.map(l => l.value), 1);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Fund Flow Diagram</h3>
        <p className="text-[10px] text-muted-foreground">Resource flows between funding institutions and implementing partners</p>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" style={{ minHeight: 280 }}>
          {/* Flow links */}
          {links.map((link, i) => {
            const sy = nodeYMap[link.source];
            const ty = nodeYMap[link.target];
            const sx = nodeXMap[link.source];
            const tx = nodeXMap[link.target];
            if (sy == null || ty == null) return null;
            const thickness = Math.max(2, (link.value / maxValue) * 18);
            const midX = (sx + tx) / 2;
            return (
              <motion.path
                key={i}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.35 }}
                transition={{ delay: i * 0.08, duration: 0.6 }}
                d={`M ${sx + nodeW} ${sy} C ${midX} ${sy}, ${midX} ${ty}, ${tx} ${ty}`}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth={thickness}
                strokeLinecap="round"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, i) => {
            const x = nodeXMap[node.id];
            const y = nodeYMap[node.id];
            if (x == null || y == null) return null;
            const isLeft = finalLeft.some(n => n.id === node.id);
            return (
              <g key={node.id}>
                <motion.rect
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.05 }}
                  x={x} y={y - 12} width={nodeW} height={24}
                  rx={3}
                  fill={node.type === 'donor' ? 'hsl(var(--status-healthy))' : 'hsl(var(--primary))'}
                  opacity={0.8}
                />
                <text
                  x={isLeft ? x - 6 : x + nodeW + 6}
                  y={y + 4}
                  textAnchor={isLeft ? 'end' : 'start'}
                  fill="hsl(var(--foreground))"
                  fontSize="10"
                  opacity={0.85}
                >
                  {node.shortName}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
