import { projects } from '@/data/mockData';
import type { ProjectStatus } from '@/data/mockData';
import { motion } from 'framer-motion';

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: 'Active', color: 'hsl(var(--status-active))' },
  delayed: { label: 'Delayed', color: 'hsl(var(--status-delayed))' },
  blocked: { label: 'Blocked', color: 'hsl(var(--status-blocked))' },
  completed: { label: 'Completed', color: 'hsl(var(--status-healthy))' },
  unassigned: { label: 'Unassigned', color: 'hsl(var(--status-inactive))' },
};

export default function ProjectHealthBars() {
  const statusCounts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<ProjectStatus, number>);

  const total = projects.length;

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Project Health Summary</h3>
        <p className="text-[10px] text-muted-foreground">{total} projects across all sectors</p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Stacked bar */}
        <div className="flex h-6 rounded-md overflow-hidden border border-border/50">
          {(Object.entries(statusConfig) as [ProjectStatus, typeof statusConfig[ProjectStatus]][]).map(([status, cfg]) => {
            const count = statusCounts[status] || 0;
            const pct = (count / total) * 100;
            if (pct === 0) return null;
            return (
              <motion.div
                key={status}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center text-[9px] font-mono font-bold"
                style={{ backgroundColor: cfg.color, color: 'hsl(var(--background))' }}
                title={`${cfg.label}: ${count}`}
              >
                {pct > 10 && count}
              </motion.div>
            );
          })}
        </div>

        {/* Legend + per-status breakdown */}
        <div className="grid grid-cols-5 gap-2">
          {(Object.entries(statusConfig) as [ProjectStatus, typeof statusConfig[ProjectStatus]][]).map(([status, cfg]) => {
            const count = statusCounts[status] || 0;
            return (
              <div key={status} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                  <span className="text-[9px] text-muted-foreground">{cfg.label}</span>
                </div>
                <span className="text-lg font-bold font-mono-data text-foreground">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Per-project bars */}
        <div className="space-y-1.5 mt-2">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-2"
            >
              <span className="text-[10px] text-muted-foreground w-[140px] truncate" title={proj.name}>{proj.name}</span>
              <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${proj.progress}%` }}
                  transition={{ duration: 0.8, delay: i * 0.04 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: statusConfig[proj.status].color }}
                />
              </div>
              <span className="text-[9px] font-mono text-muted-foreground w-8 text-right">{proj.progress}%</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
