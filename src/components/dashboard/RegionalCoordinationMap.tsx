import { useState } from 'react';
import { projects, institutions, raciMatrix } from '@/data/mockData';
import type { Institution } from '@/data/mockData';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Users, Layers } from 'lucide-react';

interface Props {
  onSelectInstitution?: (inst: Institution) => void;
}

// Nairobi regions with approximate SVG coordinates
const regions = [
  { id: 'nairobi-central', name: 'Nairobi Central', x: 340, y: 220, w: 120, h: 90, path: 'M300,180 L420,180 L440,210 L430,280 L310,280 L290,240 Z' },
  { id: 'nairobi-south', name: 'Nairobi South', x: 320, y: 330, w: 140, h: 80, path: 'M280,300 L440,300 L460,340 L440,390 L280,390 L260,350 Z' },
  { id: 'kibera', name: 'Kibera', x: 220, y: 280, w: 80, h: 60, path: 'M190,260 L270,260 L280,290 L270,330 L190,330 L180,295 Z' },
  { id: 'mathare', name: 'Mathare', x: 420, y: 150, w: 90, h: 65, path: 'M390,130 L480,130 L490,155 L480,200 L390,200 L380,170 Z' },
  { id: 'nairobi-metro', name: 'Nairobi Metro', x: 280, y: 120, w: 160, h: 70, path: 'M220,90 L440,90 L460,120 L440,170 L220,170 L200,130 Z' },
  { id: 'greater-nairobi', name: 'Greater Nairobi', x: 180, y: 180, w: 100, h: 90, path: 'M140,160 L230,160 L240,200 L230,260 L140,260 L130,210 Z' },
  { id: 'national', name: 'National (HQ)', x: 500, y: 250, w: 100, h: 70, path: 'M470,230 L560,230 L570,260 L560,310 L470,310 L460,270 Z' },
];

const regionNameMap: Record<string, string> = {
  'Nairobi Central': 'nairobi-central',
  'Nairobi South': 'nairobi-south',
  'Kibera': 'kibera',
  'Mathare': 'mathare',
  'Nairobi Metro': 'nairobi-metro',
  'Greater Nairobi': 'greater-nairobi',
  'National': 'national',
};

function getRegionStats(regionName: string) {
  const regionProjects = projects.filter(p => {
    const mapped = regionNameMap[p.region];
    return mapped === regionName;
  });
  const instIds = new Set<string>();
  regionProjects.forEach(p => {
    raciMatrix.filter(r => r.projectId === p.id).forEach(r => instIds.add(r.institutionId));
    if (p.leadInstitution) instIds.add(p.leadInstitution);
  });
  const blocked = regionProjects.filter(p => p.status === 'blocked' || p.status === 'unassigned').length;
  const delayed = regionProjects.filter(p => p.status === 'delayed').length;
  return {
    projectCount: regionProjects.length,
    institutionCount: instIds.size,
    blockedCount: blocked,
    delayedCount: delayed,
    riskLevel: blocked > 0 ? 'critical' : delayed > 0 ? 'warning' : regionProjects.length === 0 ? 'gap' : 'healthy',
    projects: regionProjects,
  };
}

const riskColors = {
  critical: 'hsl(var(--status-blocked))',
  warning: 'hsl(var(--status-delayed))',
  healthy: 'hsl(var(--status-healthy))',
  gap: 'hsl(var(--status-inactive))',
};

const riskFill = {
  critical: 'hsl(0 72% 55% / 0.25)',
  warning: 'hsl(38 92% 55% / 0.15)',
  healthy: 'hsl(160 72% 42% / 0.12)',
  gap: 'hsl(222 15% 35% / 0.15)',
};

export default function RegionalCoordinationMap({ onSelectInstitution }: Props) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const selectedStats = selectedRegion ? getRegionStats(selectedRegion) : null;
  const selectedRegionData = regions.find(r => r.id === selectedRegion);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers size={14} className="text-primary" />
            Regional Coordination Map
          </h3>
          <p className="text-[10px] text-muted-foreground">Institutional coverage, project density, and service gaps across Nairobi</p>
        </div>
        <div className="flex items-center gap-3">
          {(['critical', 'warning', 'healthy', 'gap'] as const).map(level => (
            <div key={level} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm border" style={{ backgroundColor: riskFill[level], borderColor: riskColors[level] }} />
              <span className="text-[9px] text-muted-foreground capitalize">{level === 'gap' ? 'No Coverage' : level}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        {/* Map */}
        <div className="lg:col-span-2 relative min-h-[450px]">
          <svg viewBox="100 60 520 380" className="w-full h-full">
            {/* Grid lines for spatial feel */}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`vg-${i}`} x1={130 + i * 65} y1={70} x2={130 + i * 65} y2={420} stroke="hsl(222 30% 16%)" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <line key={`hg-${i}`} x1={110} y1={90 + i * 65} x2={590} y2={90 + i * 65} stroke="hsl(222 30% 16%)" strokeWidth={0.5} />
            ))}

            {/* Regions */}
            {regions.map(region => {
              const stats = getRegionStats(region.id);
              const isHovered = hoveredRegion === region.id;
              const isSelected = selectedRegion === region.id;

              return (
                <g key={region.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
                >
                  <path
                    d={region.path}
                    fill={riskFill[stats.riskLevel]}
                    stroke={isSelected ? 'hsl(var(--primary))' : riskColors[stats.riskLevel]}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1}
                    className="transition-all duration-200"
                  />
                  {/* Region label */}
                  <text
                    x={region.x + region.w / 2 - 30}
                    y={region.y + 15}
                    fill="hsl(210 30% 75%)"
                    fontSize="9"
                    fontFamily="Inter, sans-serif"
                    className="pointer-events-none"
                  >
                    {region.name}
                  </text>
                  {/* Stats */}
                  <text
                    x={region.x + region.w / 2 - 30}
                    y={region.y + 30}
                    fill="hsl(210 20% 55%)"
                    fontSize="8"
                    fontFamily="JetBrains Mono, monospace"
                    className="pointer-events-none"
                  >
                    {stats.projectCount} proj · {stats.institutionCount} inst
                  </text>
                  {/* Risk indicator */}
                  {stats.blockedCount > 0 && (
                    <g transform={`translate(${region.x + region.w - 15}, ${region.y - 5})`}>
                      <circle r={8} fill="hsl(0 72% 55% / 0.3)" stroke="hsl(0 72% 55%)" strokeWidth={1} />
                      <text x={0} y={4} textAnchor="middle" fill="hsl(0 72% 90%)" fontSize="8" fontWeight="bold">{stats.blockedCount}</text>
                    </g>
                  )}
                  {stats.riskLevel === 'gap' && (
                    <g transform={`translate(${region.x + region.w / 2 - 20}, ${region.y + 40})`}>
                      <text fill="hsl(222 15% 50%)" fontSize="8" fontStyle="italic">No active coverage</text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Institution pins on map */}
            {institutions.slice(0, 10).map((inst, i) => {
              const angle = (i / 10) * Math.PI * 2;
              const cx = 350 + Math.cos(angle) * 140;
              const cy = 240 + Math.sin(angle) * 110;
              return (
                <g key={inst.id} className="cursor-pointer" onClick={() => onSelectInstitution?.(inst)}>
                  <circle cx={cx} cy={cy} r={3} fill="hsl(var(--primary))" fillOpacity={0.6} />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Detail panel */}
        <div className="border-l border-border p-4 overflow-y-auto scrollbar-thin max-h-[450px]">
          {selectedRegion && selectedStats && selectedRegionData ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h4 className="text-sm font-semibold text-foreground mb-1">{selectedRegionData.name}</h4>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                  <div className="text-[9px] text-muted-foreground">Projects</div>
                  <div className="font-mono text-sm font-semibold text-foreground">{selectedStats.projectCount}</div>
                </div>
                <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                  <div className="text-[9px] text-muted-foreground">Institutions</div>
                  <div className="font-mono text-sm font-semibold text-foreground">{selectedStats.institutionCount}</div>
                </div>
                <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                  <div className="text-[9px] text-muted-foreground">Blocked</div>
                  <div className="font-mono text-sm font-semibold text-status-blocked">{selectedStats.blockedCount}</div>
                </div>
                <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
                  <div className="text-[9px] text-muted-foreground">Delayed</div>
                  <div className="font-mono text-sm font-semibold text-status-delayed">{selectedStats.delayedCount}</div>
                </div>
              </div>

              {selectedStats.projects.length > 0 ? (
                <div>
                  <h5 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Active Projects</h5>
                  <div className="space-y-1.5">
                    {selectedStats.projects.map(proj => (
                      <div key={proj.id} className="rounded-md border border-border/50 bg-muted/20 px-3 py-2">
                        <div className="text-[11px] font-medium text-foreground">{proj.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border capitalize ${
                            proj.status === 'active' ? 'status-active' :
                            proj.status === 'delayed' ? 'status-delayed' :
                            proj.status === 'blocked' ? 'status-blocked' :
                            proj.status === 'completed' ? 'status-healthy' : 'status-inactive'
                          }`}>{proj.status}</span>
                          <span className="text-[9px] text-muted-foreground">Risk: {proj.riskScore}/100</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <AlertTriangle size={20} className="text-status-inactive mb-2" />
                  <p className="text-[11px] text-muted-foreground">No active interventions in this area</p>
                  <p className="text-[9px] text-muted-foreground/70 mt-1">This region may need coordination attention</p>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MapPin size={24} className="text-muted-foreground/40 mb-3" />
              <p className="text-[11px] text-muted-foreground">Select a region on the map</p>
              <p className="text-[9px] text-muted-foreground/60 mt-1">Click to view institutional coverage and project details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
