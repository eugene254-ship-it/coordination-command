import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Building2, DollarSign, XCircle, ChevronRight, Zap, Shield } from 'lucide-react';
import { institutions, projects, raciMatrix, collaborationEdges, timelinePhases } from '@/data/mockData';
import type { Institution, Project } from '@/data/mockData';

type SimulationType = 'institution_failure' | 'funder_withdrawal';

interface SimulationResult {
  affectedProjects: { project: Project; impact: 'critical' | 'high' | 'medium'; reason: string }[];
  exposedRegions: string[];
  cascadingFailures: string[];
  lostFunding: number;
  orphanedTasks: number;
}

function runSimulation(type: SimulationType, targetId: string): SimulationResult {
  const inst = institutions.find(i => i.id === targetId);
  if (!inst) return { affectedProjects: [], exposedRegions: [], cascadingFailures: [], lostFunding: 0, orphanedTasks: 0 };

  const roles = raciMatrix.filter(r => r.institutionId === targetId);
  const affectedProjectIds = [...new Set(roles.map(r => r.projectId))];
  const affectedProjects: SimulationResult['affectedProjects'] = [];

  for (const pid of affectedProjectIds) {
    const proj = projects.find(p => p.id === pid);
    if (!proj) continue;

    const role = roles.find(r => r.projectId === pid);
    let impact: 'critical' | 'high' | 'medium' = 'medium';
    let reason = '';

    if (type === 'institution_failure') {
      if (role?.role === 'A') {
        impact = 'critical';
        reason = `Loses accountable owner – no institution governs delivery`;
      } else if (role?.role === 'R') {
        impact = 'critical';
        reason = `Loses responsible executor – work stops immediately`;
      } else if (role?.role === 'F') {
        impact = 'high';
        reason = `Funding stream severed – financial continuity at risk`;
      } else if (role?.role === 'D') {
        impact = 'high';
        reason = `Data pipeline broken – dependent phases stall`;
      } else {
        impact = 'medium';
        reason = `Advisory/oversight gap – reduced coordination quality`;
      }
    } else {
      if (role?.role === 'F') {
        impact = 'critical';
        reason = `Primary funding withdrawn – project viability threatened`;
      } else {
        impact = 'medium';
        reason = `Indirect financial dependency affected`;
      }
    }

    affectedProjects.push({ project: proj, impact, reason });
  }

  const exposedRegions = [...new Set(affectedProjects.filter(a => a.impact === 'critical').map(a => a.project.region))];

  const phases = timelinePhases.filter(tp => tp.institutionId === targetId);
  const cascadingFailures: string[] = [];
  for (const phase of phases) {
    const downstream = timelinePhases.filter(tp => tp.dependsOn === phase.id);
    for (const ds of downstream) {
      const dsInst = institutions.find(i => i.id === ds.institutionId);
      cascadingFailures.push(`${phase.name} → ${ds.name} (${dsInst?.shortName || 'Unknown'})`);
    }
  }

  const edges = collaborationEdges.filter(e => e.source === targetId || e.target === targetId);
  const orphanedTasks = phases.length;
  const fundingRoles = roles.filter(r => r.role === 'F');

  return {
    affectedProjects: affectedProjects.sort((a, b) => {
      const order = { critical: 0, high: 1, medium: 2 };
      return order[a.impact] - order[b.impact];
    }),
    exposedRegions,
    cascadingFailures,
    lostFunding: type === 'funder_withdrawal' ? fundingRoles.length * 2.5 : 0,
    orphanedTasks,
  };
}

const impactColors = {
  critical: 'text-status-blocked bg-status-blocked/15 border-status-blocked/30',
  high: 'text-status-delayed bg-status-delayed/15 border-status-delayed/30',
  medium: 'text-status-active bg-status-active/15 border-status-active/30',
};

export default function CoordinationSimulation() {
  const [simType, setSimType] = useState<SimulationType>('institution_failure');
  const [selectedInst, setSelectedInst] = useState<string>('');
  const [hasRun, setHasRun] = useState(false);

  const filteredInstitutions = useMemo(() => {
    if (simType === 'funder_withdrawal') return institutions.filter(i => i.type === 'donor');
    return institutions;
  }, [simType]);

  const result = useMemo(() => {
    if (!selectedInst) return null;
    return runSimulation(simType, selectedInst);
  }, [simType, selectedInst]);

  const selectedInstData = institutions.find(i => i.id === selectedInst);

  return (
    <div className="space-y-5">
      {/* Simulation Controls */}
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={16} className="text-status-delayed" />
          <h3 className="text-sm font-semibold text-foreground">Coordination Simulation</h3>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-status-delayed/15 text-status-delayed border border-status-delayed/30 font-mono">WHAT-IF</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Simulation Type */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1.5 block font-medium">Scenario Type</label>
            <div className="flex gap-2">
              <button
                onClick={() => { setSimType('institution_failure'); setSelectedInst(''); setHasRun(false); }}
                className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-md border text-[11px] transition-colors ${
                  simType === 'institution_failure' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Building2 size={12} />
                Institution Failure
              </button>
              <button
                onClick={() => { setSimType('funder_withdrawal'); setSelectedInst(''); setHasRun(false); }}
                className={`flex-1 flex items-center gap-1.5 px-3 py-2 rounded-md border text-[11px] transition-colors ${
                  simType === 'funder_withdrawal' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground'
                }`}
              >
                <DollarSign size={12} />
                Funder Withdrawal
              </button>
            </div>
          </div>

          {/* Institution Selector */}
          <div>
            <label className="text-[10px] text-muted-foreground mb-1.5 block font-medium">
              {simType === 'funder_withdrawal' ? 'Select Funder' : 'Select Institution'}
            </label>
            <select
              value={selectedInst}
              onChange={(e) => { setSelectedInst(e.target.value); setHasRun(true); }}
              className="w-full px-3 py-2 rounded-md border border-border bg-muted/30 text-foreground text-[11px] focus:outline-none focus:border-primary/40"
            >
              <option value="">Choose an institution...</option>
              {filteredInstitutions.map(inst => (
                <option key={inst.id} value={inst.id}>{inst.shortName} – {inst.name}</option>
              ))}
            </select>
          </div>

          {/* Quick Stats */}
          {result && selectedInstData && (
            <div className="flex items-end gap-3">
              <div className="text-center">
                <div className="text-lg font-bold font-mono text-status-blocked">{result.affectedProjects.filter(a => a.impact === 'critical').length}</div>
                <div className="text-[9px] text-muted-foreground">Critical</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold font-mono text-status-delayed">{result.affectedProjects.filter(a => a.impact === 'high').length}</div>
                <div className="text-[9px] text-muted-foreground">High Risk</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold font-mono text-foreground">{result.cascadingFailures.length}</div>
                <div className="text-[9px] text-muted-foreground">Cascading</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence mode="wait">
        {result && selectedInstData && (
          <motion.div
            key={selectedInst}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Scenario Summary */}
            <div className="rounded-lg border border-status-blocked/30 bg-status-blocked/5 p-4">
              <div className="flex items-start gap-3">
                <XCircle size={18} className="text-status-blocked mt-0.5" />
                <div>
                  <h4 className="text-[12px] font-semibold text-foreground">
                    Scenario: {simType === 'institution_failure' ? `${selectedInstData.shortName} fails to deliver` : `${selectedInstData.shortName} withdraws funding`}
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {result.affectedProjects.length} projects affected · {result.exposedRegions.length} regions exposed · {result.orphanedTasks} timeline phases orphaned
                    {result.cascadingFailures.length > 0 && ` · ${result.cascadingFailures.length} cascading failures`}
                  </p>
                </div>
              </div>
            </div>

            {/* Affected Projects */}
            <div className="rounded-lg border border-border bg-card">
              <div className="px-4 py-3 border-b border-border">
                <h4 className="text-[12px] font-semibold text-foreground">Affected Projects</h4>
              </div>
              <div className="divide-y divide-border/50">
                {result.affectedProjects.map(({ project, impact, reason }) => (
                  <div key={project.id} className="px-4 py-3 flex items-start gap-3">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase shrink-0 mt-0.5 ${impactColors[impact]}`}>
                      {impact}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium text-foreground">{project.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{reason}</div>
                      <div className="text-[9px] text-muted-foreground/60 mt-1">Region: {project.region} · Progress: {project.progress}%</div>
                    </div>
                  </div>
                ))}
                {result.affectedProjects.length === 0 && (
                  <div className="px-4 py-8 text-center text-[11px] text-muted-foreground">No projects directly affected by this scenario.</div>
                )}
              </div>
            </div>

            {/* Cascading Failures & Exposed Regions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.cascadingFailures.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <h4 className="text-[12px] font-semibold text-foreground mb-3 flex items-center gap-1.5">
                    <ChevronRight size={12} className="text-status-blocked" />
                    Cascading Timeline Failures
                  </h4>
                  <div className="space-y-2">
                    {result.cascadingFailures.map((cf, i) => (
                      <div key={i} className="text-[10px] text-muted-foreground flex items-center gap-2">
                        <AlertTriangle size={10} className="text-status-delayed shrink-0" />
                        <span>{cf}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result.exposedRegions.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <h4 className="text-[12px] font-semibold text-foreground mb-3 flex items-center gap-1.5">
                    <Shield size={12} className="text-status-blocked" />
                    Exposed Regions
                  </h4>
                  <div className="space-y-2">
                    {result.exposedRegions.map((region, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <div className="w-2 h-2 rounded-full bg-status-blocked" />
                        <span className="text-foreground">{region}</span>
                        <span className="text-[9px] text-muted-foreground">– loses critical coordination coverage</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!hasRun && (
        <div className="rounded-lg border border-border/50 bg-card/50 p-12 text-center">
          <Zap size={32} className="mx-auto text-muted-foreground/30 mb-3" />
          <h4 className="text-[12px] font-medium text-muted-foreground">Select an institution to simulate</h4>
          <p className="text-[10px] text-muted-foreground/60 mt-1">See what projects become exposed if an institution fails to deliver or a funder withdraws.</p>
        </div>
      )}
    </div>
  );
}
