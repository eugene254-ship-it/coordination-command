import { useMemo, useState } from 'react';
import { timelinePhases, projects, institutions } from '@/data/mockData';
import type { TimelinePhase } from '@/data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, AlertTriangle, ChevronRight, Clock, Zap } from 'lucide-react';

interface DependencyChain {
  rootPhase: TimelinePhase;
  chain: TimelinePhase[];
  projectName: string;
  criticalPath: boolean;
  blockedCount: number;
  totalDelay: number;
}

function buildChains(): DependencyChain[] {
  const chains: DependencyChain[] = [];
  
  // Find root phases (no dependsOn)
  const roots = timelinePhases.filter(tp => !tp.dependsOn);
  
  roots.forEach(root => {
    const chain: TimelinePhase[] = [root];
    let current = root;
    let blockedCount = 0;
    let totalDelay = 0;

    // Walk downstream
    while (true) {
      const next = timelinePhases.find(tp => tp.dependsOn === current.id);
      if (!next) break;
      chain.push(next);
      if (next.status === 'blocked') blockedCount++;
      if (next.status === 'delayed') {
        totalDelay++;
      }
      current = next;
    }

    if (chain.length < 2) return; // Not interesting if single phase

    const proj = projects.find(p => p.id === root.projectId);
    const criticalPath = blockedCount > 0 || chain.some(p => p.status === 'blocked');

    chains.push({
      rootPhase: root,
      chain,
      projectName: proj?.name || 'Unknown',
      criticalPath,
      blockedCount,
      totalDelay,
    });
  });

  return chains.sort((a, b) => b.blockedCount - a.blockedCount || b.totalDelay - a.totalDelay);
}

const statusDot: Record<string, string> = {
  active: 'bg-[hsl(var(--status-active))]',
  delayed: 'bg-[hsl(var(--status-delayed))]',
  blocked: 'bg-[hsl(var(--status-blocked))]',
  completed: 'bg-[hsl(var(--status-healthy))]',
  unassigned: 'bg-[hsl(var(--status-inactive))]',
};

export default function DependencyInspector() {
  const chains = useMemo(() => buildChains(), []);
  const [expanded, setExpanded] = useState<string | null>(chains[0]?.rootPhase.id || null);
  const criticalChains = chains.filter(c => c.criticalPath);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <GitBranch size={14} className="text-primary" />
              Dependency Inspector
            </h3>
            <p className="text-[10px] text-muted-foreground">Traces blocked task chains and critical paths</p>
          </div>
          <div className="flex items-center gap-2">
            {criticalChains.length > 0 && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-[hsl(var(--status-blocked))] bg-[hsl(var(--status-blocked)/0.1)] px-2 py-0.5 rounded border border-[hsl(var(--status-blocked)/0.2)]">
                <AlertTriangle size={10} />
                {criticalChains.length} critical chain{criticalChains.length > 1 ? 's' : ''}
              </span>
            )}
            <span className="text-[9px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
              {chains.length} chains
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
        {chains.map((chain, ci) => {
          const isExpanded = expanded === chain.rootPhase.id;
          return (
            <motion.div
              key={chain.rootPhase.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.04 }}
              className={`rounded-md border ${chain.criticalPath ? 'border-[hsl(var(--status-blocked)/0.3)] bg-[hsl(var(--status-blocked)/0.03)]' : 'border-border bg-card'}`}
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : chain.rootPhase.id)}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/20 transition-colors rounded-md"
              >
                <ChevronRight
                  size={12}
                  className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-foreground truncate">{chain.projectName}</span>
                    {chain.criticalPath && (
                      <span className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[hsl(var(--status-blocked)/0.15)] text-[hsl(var(--status-blocked-foreground))] border border-[hsl(var(--status-blocked)/0.2)]">
                        Critical Path
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {chain.chain.length} phases · {chain.blockedCount} blocked · {chain.totalDelay} delayed
                  </span>
                </div>
                <div className="flex -space-x-0.5">
                  {chain.chain.map(phase => (
                    <div key={phase.id} className={`w-2 h-2 rounded-full border border-card ${statusDot[phase.status]}`} />
                  ))}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-3">
                      <div className="relative ml-3 pl-4 border-l-2 border-border space-y-0">
                        {chain.chain.map((phase, pi) => {
                          const inst = institutions.find(i => i.id === phase.institutionId);
                          const isBlocked = phase.status === 'blocked';
                          const isLast = pi === chain.chain.length - 1;
                          return (
                            <div key={phase.id} className="relative pb-4 last:pb-0">
                              {/* Connector dot */}
                              <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-card ${statusDot[phase.status]}`} />
                              
                              <div className={`rounded px-3 py-2 ${isBlocked ? 'bg-[hsl(var(--status-blocked)/0.08)] border border-[hsl(var(--status-blocked)/0.2)]' : 'bg-muted/30'}`}>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="text-[11px] font-medium text-foreground">{phase.name}</span>
                                  <span className={`text-[8px] font-mono px-1 py-0.5 rounded border ${
                                    phase.status === 'blocked' ? 'status-blocked' :
                                    phase.status === 'delayed' ? 'status-delayed' :
                                    phase.status === 'completed' ? 'status-healthy' :
                                    phase.status === 'active' ? 'status-active' : 'status-inactive'
                                  }`}>{phase.status}</span>
                                </div>
                                <div className="flex items-center gap-3 text-[9px] text-muted-foreground">
                                  <span>{inst?.shortName || 'Unassigned'}</span>
                                  <span className="flex items-center gap-0.5">
                                    <Clock size={8} />
                                    {phase.startDate} → {phase.actualEnd || phase.endDate}
                                  </span>
                                </div>
                                {isBlocked && (
                                  <div className="mt-1.5 flex items-center gap-1 text-[9px] text-[hsl(var(--status-blocked-foreground))]">
                                    <Zap size={9} />
                                    <span>Blocking {timelinePhases.filter(tp => tp.dependsOn === phase.id).length} downstream phase(s)</span>
                                  </div>
                                )}
                              </div>

                              {/* Dependency arrow */}
                              {!isLast && phase.dependsOn == null && chain.chain[pi + 1]?.dependsOn === phase.id && (
                                <div className="absolute -left-[15px] bottom-0 text-muted-foreground">
                                  <ChevronRight size={8} className="rotate-90" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
