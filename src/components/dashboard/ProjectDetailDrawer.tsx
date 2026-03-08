import type { Project } from '@/data/mockData';
import { institutions, raciMatrix, timelinePhases, collaborationEdges, accountabilityAlerts } from '@/data/mockData';
import { X, FolderKanban, Calendar, TrendingUp, AlertTriangle, ArrowRight, CheckCircle, Clock, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  project: Project | null;
  onClose: () => void;
}

const roleNames: Record<string, string> = {
  R: 'Responsible', A: 'Accountable', C: 'Consulted', I: 'Informed', F: 'Funding', D: 'Data Provider', V: 'Verification',
};

const statusClasses: Record<string, string> = {
  active: 'status-active',
  delayed: 'status-delayed',
  blocked: 'status-blocked',
  completed: 'status-healthy',
  unassigned: 'status-inactive',
};

function generateSummary(project: Project): string {
  const phases = timelinePhases.filter(tp => tp.projectId === project.id);
  const completedPhases = phases.filter(p => p.status === 'completed').length;
  const blockedPhases = phases.filter(p => p.status === 'blocked');
  const delayedPhases = phases.filter(p => p.status === 'delayed');
  const leadInst = institutions.find(i => i.id === project.leadInstitution);
  const entries = raciMatrix.filter(r => r.projectId === project.id);
  const responsibleInsts = entries.filter(r => r.role === 'R').map(r => institutions.find(i => i.id === r.institutionId)?.shortName).filter(Boolean);

  let summary = `${project.name} is ${project.progress}% complete.`;

  if (leadInst) summary += ` Led by ${leadInst.shortName}.`;
  if (responsibleInsts.length > 0) summary += ` ${responsibleInsts.join(' and ')} ${responsibleInsts.length > 1 ? 'are' : 'is'} actively responsible.`;
  if (blockedPhases.length > 0) {
    const blockerInst = institutions.find(i => i.id === blockedPhases[0].institutionId);
    summary += ` ${blockedPhases[0].name} is blocked${blockerInst ? ` at ${blockerInst.shortName}` : ''}.`;
  }
  if (delayedPhases.length > 0) {
    summary += ` ${delayedPhases.length} phase${delayedPhases.length > 1 ? 's' : ''} delayed.`;
  }

  const alerts = accountabilityAlerts.filter(a => a.projectId === project.id);
  if (alerts.length > 0) summary += ` ${alerts.length} accountability alert${alerts.length > 1 ? 's' : ''} active.`;

  return summary;
}

export default function ProjectDetailDrawer({ project, onClose }: Props) {
  if (!project) return null;

  const entries = raciMatrix.filter(r => r.projectId === project.id);
  const phases = timelinePhases.filter(tp => tp.projectId === project.id);
  const alerts = accountabilityAlerts.filter(a => a.projectId === project.id);
  const leadInst = institutions.find(i => i.id === project.leadInstitution);
  const summary = generateSummary(project);

  // Build dependency chain
  const dependencyChain = phases.filter(p => p.dependsOn).map(p => {
    const dep = phases.find(d => d.id === p.dependsOn);
    return { phase: p, dependsOnPhase: dep };
  });

  return (
    <>
      <div className="fixed inset-0 bg-background/60 z-40" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-lg z-50 border-l border-border bg-card overflow-y-auto scrollbar-thin"
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FolderKanban size={16} className="text-primary" />
                <span className={`text-[9px] px-1.5 py-0.5 rounded border capitalize ${statusClasses[project.status]}`}>{project.status}</span>
                <span className="text-[9px] text-muted-foreground">Risk: {project.riskScore}/100</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">{project.name}</h2>
              <p className="text-[11px] text-muted-foreground">{project.region} · {project.type}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
              <X size={18} />
            </button>
          </div>

          {/* Plain-English Summary */}
          <div className="rounded-md border border-primary/20 bg-primary/5 px-4 py-3 mb-5">
            <p className="text-[12px] text-foreground leading-relaxed">{summary}</p>
          </div>

          {/* Progress */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] text-muted-foreground">Overall Progress</span>
              <span className="font-mono text-sm font-semibold text-foreground">{project.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  project.progress >= 70 ? 'bg-status-healthy' : project.progress >= 40 ? 'bg-status-delayed' : 'bg-status-blocked'
                }`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[9px] text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar size={9} />{project.startDate}</span>
              <span className="flex items-center gap-1"><Calendar size={9} />{project.endDate}</span>
            </div>
          </div>

          {/* Key Actors */}
          <div className="mb-5">
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Institutional Roles</h4>
            <div className="space-y-1.5">
              {entries.map(entry => {
                const inst = institutions.find(i => i.id === entry.institutionId);
                if (!inst) return null;
                return (
                  <div key={entry.institutionId} className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/30 border border-border/50">
                    <div>
                      <div className="text-[11px] font-medium text-foreground">{inst.name}</div>
                      <div className="text-[9px] text-muted-foreground">{inst.type} · {inst.jurisdiction}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.role && (
                        <span className="text-[9px] px-2 py-0.5 rounded border bg-primary/10 text-primary border-primary/20 font-mono font-bold">
                          {entry.role} – {roleNames[entry.role]}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {project.leadInstitution && !entries.find(e => e.institutionId === project.leadInstitution) && leadInst && (
                <div className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/30 border border-border/50">
                  <div className="text-[11px] font-medium text-foreground">{leadInst.name}</div>
                  <span className="text-[9px] text-primary font-mono">Lead</span>
                </div>
              )}
            </div>
          </div>

          {/* Milestone Timeline */}
          <div className="mb-5">
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Clock size={11} /> Milestones
            </h4>
            <div className="space-y-0">
              {phases.map((phase, i) => {
                const inst = institutions.find(ins => ins.id === phase.institutionId);
                const isCompleted = phase.status === 'completed';
                const isBlocked = phase.status === 'blocked';
                const isDelayed = phase.status === 'delayed';
                return (
                  <div key={phase.id} className="flex gap-3">
                    {/* Timeline connector */}
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full border-2 ${
                        isCompleted ? 'bg-status-healthy border-status-healthy' :
                        isBlocked ? 'bg-status-blocked border-status-blocked' :
                        isDelayed ? 'bg-status-delayed border-status-delayed' :
                        'bg-status-active border-status-active'
                      }`} />
                      {i < phases.length - 1 && <div className="w-px flex-1 bg-border min-h-[24px]" />}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-foreground">{phase.name}</span>
                        <span className={`text-[8px] px-1 py-0.5 rounded border capitalize ${statusClasses[phase.status]}`}>{phase.status}</span>
                      </div>
                      <div className="text-[9px] text-muted-foreground mt-0.5">
                        {inst?.shortName} · {phase.startDate} → {phase.actualEnd || phase.endDate}
                        {phase.actualEnd && phase.actualEnd > phase.endDate && (
                          <span className="text-status-delayed ml-1">(late)</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dependency Chain */}
          {dependencyChain.length > 0 && (
            <div className="mb-5">
              <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GitBranch size={11} /> Dependencies
              </h4>
              <div className="space-y-1.5">
                {dependencyChain.map(({ phase, dependsOnPhase }) => {
                  const fromInst = dependsOnPhase ? institutions.find(i => i.id === dependsOnPhase.institutionId) : null;
                  const toInst = institutions.find(i => i.id === phase.institutionId);
                  return (
                    <div key={phase.id} className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted/20 border border-border/50 text-[10px]">
                      <span className="text-muted-foreground">{dependsOnPhase?.name} ({fromInst?.shortName})</span>
                      <ArrowRight size={10} className="text-primary shrink-0" />
                      <span className="text-foreground font-medium">{phase.name} ({toInst?.shortName})</span>
                      <span className={`text-[8px] px-1 py-0.5 rounded border capitalize ml-auto ${statusClasses[phase.status]}`}>{phase.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="mb-5">
              <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertTriangle size={11} /> Active Alerts
              </h4>
              <div className="space-y-1.5">
                {alerts.map(alert => (
                  <div key={alert.id} className={`rounded-md px-3 py-2 text-[11px] border ${
                    alert.severity === 'critical' ? 'status-blocked' :
                    alert.severity === 'warning' ? 'status-delayed' : 'status-active'
                  }`}>
                    {alert.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
            <p className="text-[12px] text-secondary-foreground leading-relaxed">{project.description}</p>
          </div>
        </div>
      </motion.div>
    </>
  );
}
