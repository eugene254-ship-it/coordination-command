import { projects, institutions, raciMatrix } from '@/data/mockData';
import type { RoleType, ProjectStatus } from '@/data/mockData';
import { motion } from 'framer-motion';

const roleLabels: Record<string, { label: string; className: string }> = {
  R: { label: 'R', className: 'bg-primary/20 text-primary border-primary/30' },
  A: { label: 'A', className: 'bg-[hsl(280,65%,60%)]/20 text-[hsl(280,65%,75%)] border-[hsl(280,65%,60%)]/30' },
  C: { label: 'C', className: 'bg-status-delayed/15 text-[hsl(38,80%,75%)] border-status-delayed/30' },
  I: { label: 'I', className: 'bg-muted text-muted-foreground border-border' },
  F: { label: 'F', className: 'bg-status-healthy/15 text-[hsl(160,72%,70%)] border-status-healthy/30' },
  D: { label: 'D', className: 'bg-status-active/15 text-[hsl(210,72%,75%)] border-status-active/30' },
  V: { label: 'V', className: 'bg-[hsl(330,65%,55%)]/15 text-[hsl(330,65%,75%)] border-[hsl(330,65%,55%)]/30' },
};

const statusBadge: Record<ProjectStatus, string> = {
  active: 'status-active',
  delayed: 'status-delayed',
  blocked: 'status-blocked',
  completed: 'status-healthy',
  unassigned: 'status-inactive',
};

function RoleCell({ role }: { role: RoleType }) {
  if (!role) return <td className="px-2 py-2 text-center"><span className="text-muted-foreground/30">—</span></td>;
  const config = roleLabels[role];
  return (
    <td className="px-2 py-2 text-center">
      <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-[11px] font-mono font-bold border ${config.className}`}>
        {config.label}
      </span>
    </td>
  );
}

export default function ProjectResponsibilityMatrix() {
  // Show a subset of institutions that appear in the matrix
  const activeInstIds = [...new Set(raciMatrix.map(e => e.institutionId))];
  const matrixInstitutions = institutions.filter(i => activeInstIds.includes(i.id));

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Project Responsibility Matrix</h3>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {Object.entries(roleLabels).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1">
              <span className={`inline-flex items-center justify-center w-4 h-4 rounded text-[8px] font-mono font-bold border ${val.className}`}>{val.label}</span>
              <span className="text-[9px] text-muted-foreground">
                {key === 'R' ? 'Responsible' : key === 'A' ? 'Accountable' : key === 'C' ? 'Consulted' : key === 'I' ? 'Informed' : key === 'F' ? 'Funding' : key === 'D' ? 'Data' : 'Verify'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-3 py-2 text-muted-foreground font-medium sticky left-0 bg-card z-10 min-w-[180px]">Project</th>
              <th className="px-2 py-2 text-muted-foreground font-medium text-center min-w-[40px]">Status</th>
              {matrixInstitutions.map(inst => (
                <th key={inst.id} className="px-2 py-2 text-muted-foreground font-medium text-center min-w-[50px]">
                  <span className="writing-mode-vertical" title={inst.name}>{inst.shortName}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map((proj, idx) => (
              <motion.tr
                key={proj.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.03 }}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                <td className="px-3 py-2 text-foreground font-medium sticky left-0 bg-card z-10">
                  <div className="truncate max-w-[180px]" title={proj.name}>{proj.name}</div>
                  <div className="text-[9px] text-muted-foreground">{proj.region}</div>
                </td>
                <td className="px-2 py-2 text-center">
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-medium border ${statusBadge[proj.status]}`}>
                    {proj.status}
                  </span>
                </td>
                {matrixInstitutions.map(inst => {
                  const entry = raciMatrix.find(r => r.projectId === proj.id && r.institutionId === inst.id);
                  return <RoleCell key={inst.id} role={entry?.role ?? null} />;
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
