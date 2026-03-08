import type { Institution } from '@/data/mockData';
import { projects, raciMatrix, collaborationEdges, institutions } from '@/data/mockData';
import { X, Building2, Target, Clock, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  institution: Institution | null;
  onClose: () => void;
}

const typeColors: Record<string, string> = {
  government: 'status-active',
  ngo: 'status-healthy',
  private: 'status-delayed',
  research: 'bg-[hsl(280,65%,55%)]/15 text-[hsl(280,65%,75%)] border-[hsl(280,65%,55%)]/30',
  community: 'bg-[hsl(330,65%,55%)]/15 text-[hsl(330,65%,75%)] border-[hsl(330,65%,55%)]/30',
  donor: 'status-healthy',
};

function MiniStat({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 px-3 py-2">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">{icon}<span className="text-[9px]">{label}</span></div>
      <div className="font-mono text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

export default function InstitutionDetailDrawer({ institution, onClose }: Props) {
  if (!institution) return null;

  const instProjects = raciMatrix
    .filter(r => r.institutionId === institution.id)
    .map(r => ({ ...r, project: projects.find(p => p.id === r.projectId)! }))
    .filter(r => r.project);

  const connections = collaborationEdges.filter(
    e => e.source === institution.id || e.target === institution.id
  );

  const partners = connections.map(e => {
    const partnerId = e.source === institution.id ? e.target : e.source;
    return { ...e, partner: institutions.find(i => i.id === partnerId)! };
  }).filter(c => c.partner);

  return (
    <>
      <div className="fixed inset-0 bg-background/60 z-40" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md z-50 border-l border-border bg-card overflow-y-auto scrollbar-thin"
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Building2 size={16} className="text-primary" />
                <span className={`text-[9px] px-1.5 py-0.5 rounded border capitalize ${typeColors[institution.type] || 'status-inactive'}`}>{institution.type}</span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">{institution.name}</h2>
              <p className="text-[11px] text-muted-foreground">{institution.jurisdiction} · {institution.sector}</p>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
              <X size={18} />
            </button>
          </div>

          {/* Mandate */}
          <p className="text-[12px] text-secondary-foreground mb-4 leading-relaxed">{institution.mandate}</p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <MiniStat label="Coordination Score" value={`${institution.coordinationScore}/100`} icon={<Target size={10} />} />
            <MiniStat label="Delivery Score" value={`${institution.deliveryScore}/100`} icon={<TrendingUp size={10} />} />
            <MiniStat label="Avg Response" value={`${institution.responseLatency}d`} icon={<Clock size={10} />} />
            <MiniStat label="Active Projects" value={institution.activeProjects} icon={<Users size={10} />} />
          </div>

          {/* Projects */}
          <div className="mb-5">
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Projects & Roles</h4>
            <div className="space-y-1.5">
              {instProjects.map(({ project, role }) => (
                <div key={project.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/30 border border-border/50">
                  <div>
                    <div className="text-[11px] font-medium text-foreground">{project.name}</div>
                    <div className="text-[9px] text-muted-foreground">{project.region}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border capitalize ${
                      project.status === 'active' ? 'status-active' :
                      project.status === 'delayed' ? 'status-delayed' :
                      project.status === 'blocked' ? 'status-blocked' :
                      project.status === 'completed' ? 'status-healthy' : 'status-inactive'
                    }`}>{project.status}</span>
                    {role && <span className="font-mono text-[10px] font-bold text-primary">{role}</span>}
                  </div>
                </div>
              ))}
              {instProjects.length === 0 && <p className="text-[11px] text-muted-foreground">No project assignments</p>}
            </div>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Connected Partners</h4>
            <div className="space-y-1.5">
              {partners.map(({ partner, relationshipType, status }) => (
                <div key={partner.id} className="flex items-center justify-between px-3 py-2 rounded-md bg-muted/30 border border-border/50">
                  <div>
                    <div className="text-[11px] font-medium text-foreground">{partner.shortName}</div>
                    <div className="text-[9px] text-muted-foreground capitalize">{relationshipType.replace('_', ' ')}</div>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border capitalize ${
                    status === 'healthy' ? 'status-healthy' :
                    status === 'delayed' ? 'status-delayed' :
                    status === 'blocked' ? 'status-blocked' : 'status-inactive'
                  }`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
