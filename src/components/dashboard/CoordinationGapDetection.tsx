import { useMemo } from 'react';
import { projects, institutions, raciMatrix, collaborationEdges, timelinePhases, accountabilityAlerts } from '@/data/mockData';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, Users, GitBranch, TrendingDown, Zap, ArrowRight, Shield } from 'lucide-react';

interface GapFinding {
  id: string;
  type: 'missing_owner' | 'duplication' | 'overloaded' | 'isolated' | 'failure_risk' | 'weak_handoff';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
  affectedProjects?: string[];
  affectedInstitutions?: string[];
  confidence: number;
}

function detectGaps(): GapFinding[] {
  const findings: GapFinding[] = [];

  // 1. Missing owners: projects without A (Accountable) role
  projects.forEach(proj => {
    const entries = raciMatrix.filter(r => r.projectId === proj.id);
    const hasAccountable = entries.some(e => e.role === 'A');
    const hasResponsible = entries.some(e => e.role === 'R');
    if (!hasAccountable) {
      findings.push({
        id: `gap-no-accountable-${proj.id}`,
        type: 'missing_owner',
        severity: 'critical',
        title: `No accountable institution for "${proj.name}"`,
        description: `This project has ${entries.length} assigned roles but no single institution marked as Accountable (A). Without clear accountability, coordination failures cascade.`,
        recommendation: `Assign an accountable institution immediately. Recommended: ${institutions.find(i => i.id === proj.leadInstitution)?.shortName || 'the lead institution'} based on current project structure.`,
        affectedProjects: [proj.id],
        confidence: 95,
      });
    }
    if (!hasResponsible && proj.status !== 'completed') {
      findings.push({
        id: `gap-no-responsible-${proj.id}`,
        type: 'missing_owner',
        severity: 'critical',
        title: `No responsible executor for "${proj.name}"`,
        description: `No institution is marked as Responsible (R) for active delivery on this project.`,
        recommendation: `Identify and assign operational delivery partners with capacity in ${proj.region}.`,
        affectedProjects: [proj.id],
        confidence: 90,
      });
    }
  });

  // 2. Duplicated effort: multiple institutions with R on same project
  projects.forEach(proj => {
    const responsibles = raciMatrix.filter(r => r.projectId === proj.id && r.role === 'R');
    if (responsibles.length > 2) {
      const instNames = responsibles.map(r => institutions.find(i => i.id === r.institutionId)?.shortName).filter(Boolean);
      findings.push({
        id: `gap-duplication-${proj.id}`,
        type: 'duplication',
        severity: 'warning',
        title: `Potential duplication on "${proj.name}"`,
        description: `${responsibles.length} institutions (${instNames.join(', ')}) are all marked Responsible. This risks duplicated effort and unclear ownership of deliverables.`,
        recommendation: `Clarify scope boundaries between responsible parties. Consider elevating one to Accountable and narrowing others to specific sub-tasks.`,
        affectedProjects: [proj.id],
        affectedInstitutions: responsibles.map(r => r.institutionId),
        confidence: 72,
      });
    }
  });

  // 3. Overloaded institutions
  institutions.forEach(inst => {
    const projectCount = raciMatrix.filter(r => r.institutionId === inst.id && (r.role === 'R' || r.role === 'A')).length;
    if (projectCount >= 4 && inst.deliveryScore < 60) {
      findings.push({
        id: `gap-overload-${inst.id}`,
        type: 'overloaded',
        severity: 'warning',
        title: `${inst.shortName} is overloaded with low delivery`,
        description: `${inst.name} carries R/A responsibility on ${projectCount} projects but has a delivery score of only ${inst.deliveryScore}/100. Response latency: ${inst.responseLatency} days.`,
        recommendation: `Redistribute responsibility to partners with available capacity, or allocate additional resources to ${inst.shortName}.`,
        affectedInstitutions: [inst.id],
        confidence: 85,
      });
    }
  });

  // 4. Isolated institutions: no collaboration edges
  institutions.forEach(inst => {
    const connections = collaborationEdges.filter(e => e.source === inst.id || e.target === inst.id);
    const activeConnections = connections.filter(e => e.status !== 'inactive');
    if (activeConnections.length === 0) {
      findings.push({
        id: `gap-isolated-${inst.id}`,
        type: 'isolated',
        severity: 'info',
        title: `${inst.shortName} is isolated from active coordination`,
        description: `${inst.name} has no active collaboration edges. They may be listed as participants but are not actively coordinating.`,
        recommendation: `Verify whether ${inst.shortName} is still engaged. If so, formalize coordination channels.`,
        affectedInstitutions: [inst.id],
        confidence: 78,
      });
    }
  });

  // 5. Failure risk: blocked dependencies cascading
  const blockedPhases = timelinePhases.filter(tp => tp.status === 'blocked');
  blockedPhases.forEach(blocked => {
    const downstream = timelinePhases.filter(tp => tp.dependsOn === blocked.id);
    if (downstream.length > 0) {
      const proj = projects.find(p => p.id === blocked.projectId);
      const blockerInst = institutions.find(i => i.id === blocked.institutionId);
      findings.push({
        id: `gap-cascade-${blocked.id}`,
        type: 'failure_risk',
        severity: 'critical',
        title: `Cascading failure risk: ${blocked.name}`,
        description: `"${blocked.name}" in "${proj?.name}" is blocked at ${blockerInst?.shortName}. ${downstream.length} downstream phase(s) depend on this, creating a cascade risk.`,
        recommendation: `Escalate to ${blockerInst?.shortName} leadership. Consider parallel workstreams or interim measures to unblock.`,
        affectedProjects: [blocked.projectId],
        affectedInstitutions: [blocked.institutionId],
        confidence: 92,
      });
    }
  });

  // 6. Weak handoffs: delayed edges between institutions
  collaborationEdges.filter(e => e.status === 'delayed' || e.status === 'blocked').forEach(edge => {
    const sourceInst = institutions.find(i => i.id === edge.source);
    const targetInst = institutions.find(i => i.id === edge.target);
    if (sourceInst && targetInst) {
      findings.push({
        id: `gap-handoff-${edge.source}-${edge.target}`,
        type: 'weak_handoff',
        severity: edge.status === 'blocked' ? 'critical' : 'warning',
        title: `Weak handoff: ${sourceInst.shortName} → ${targetInst.shortName}`,
        description: `The ${edge.relationshipType.replace('_', ' ')} relationship between ${sourceInst.shortName} and ${targetInst.shortName} is ${edge.status}. Last interaction: ${edge.lastInteraction}.`,
        recommendation: `Schedule coordination meeting between ${sourceInst.shortName} and ${targetInst.shortName}. Establish clearer handoff protocols.`,
        affectedInstitutions: [edge.source, edge.target],
        confidence: 80,
      });
    }
  });

  return findings.sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });
}

const typeIcons: Record<GapFinding['type'], typeof AlertTriangle> = {
  missing_owner: AlertTriangle,
  duplication: Users,
  overloaded: TrendingDown,
  isolated: Zap,
  failure_risk: GitBranch,
  weak_handoff: ArrowRight,
};

const severityStyles = {
  critical: 'border-status-blocked/30 bg-status-blocked/5',
  warning: 'border-status-delayed/30 bg-status-delayed/5',
  info: 'border-status-active/30 bg-status-active/5',
};

const severityIconColors = {
  critical: 'text-status-blocked',
  warning: 'text-status-delayed',
  info: 'text-status-active',
};

export default function CoordinationGapDetection() {
  const findings = useMemo(() => detectGaps(), []);
  const critical = findings.filter(f => f.severity === 'critical').length;
  const warnings = findings.filter(f => f.severity === 'warning').length;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Brain size={14} className="text-primary" />
              AI Coordination Gap Detection
            </h3>
            <p className="text-[10px] text-muted-foreground">Automated analysis of missing owners, duplicated efforts, and failure risks</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Shield size={10} className="text-status-blocked" />
              <span className="text-[10px] font-mono text-status-blocked">{critical} critical</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield size={10} className="text-status-delayed" />
              <span className="text-[10px] font-mono text-status-delayed">{warnings} warnings</span>
            </div>
            <span className="text-[9px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
              {findings.length} findings
            </span>
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
        {findings.map((finding, i) => {
          const Icon = typeIcons[finding.type];
          return (
            <motion.div
              key={finding.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`rounded-md border px-4 py-3 ${severityStyles[finding.severity]}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 ${severityIconColors[finding.severity]}`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[12px] font-semibold text-foreground">{finding.title}</span>
                    <span className="text-[8px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {finding.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-[11px] text-secondary-foreground leading-relaxed mb-2">{finding.description}</p>
                  <div className="rounded bg-primary/5 border border-primary/15 px-3 py-2">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Zap size={9} className="text-primary" />
                      <span className="text-[9px] font-semibold text-primary uppercase tracking-wider">Recommendation</span>
                    </div>
                    <p className="text-[11px] text-foreground leading-relaxed">{finding.recommendation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
