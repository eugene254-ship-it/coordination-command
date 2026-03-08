import { useMemo } from 'react';
import { timelinePhases as allPhases, projects as allProjects, institutions } from '@/data/mockData';
import type { ProjectStatus } from '@/data/mockData';
import type { FilterState } from '@/components/dashboard/FilterToolbar';
import { filterProjects, isFilterEmpty } from '@/lib/filterUtils';
import { motion } from 'framer-motion';

const statusColors: Record<ProjectStatus, string> = {
  active: 'hsl(210, 72%, 55%)',
  delayed: 'hsl(38, 92%, 55%)',
  blocked: 'hsl(0, 72%, 55%)',
  completed: 'hsl(160, 72%, 42%)',
  unassigned: 'hsl(222, 15%, 35%)',
};

const statusBg: Record<ProjectStatus, string> = {
  active: 'bg-status-active/20 border-status-active/40',
  delayed: 'bg-status-delayed/20 border-status-delayed/40',
  blocked: 'bg-status-blocked/20 border-status-blocked/40',
  completed: 'bg-status-healthy/20 border-status-healthy/40',
  unassigned: 'bg-muted border-border',
};

export default function CoordinationTimeline() {
  // Timeline from 2025-01 to 2027-01 (24 months)
  const startMonth = new Date('2025-01-01');
  const totalMonths = 24;
  const months = Array.from({ length: totalMonths }, (_, i) => {
    const d = new Date(startMonth);
    d.setMonth(d.getMonth() + i);
    return d;
  });

  const getPosition = (dateStr: string) => {
    const d = new Date(dateStr);
    const diff = (d.getTime() - startMonth.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
    return Math.max(0, Math.min(100, (diff / totalMonths) * 100));
  };

  // Group by project
  const projectGroups = projects.slice(0, 5).map(proj => ({
    project: proj,
    phases: timelinePhases.filter(tp => tp.projectId === proj.id),
  }));

  const now = new Date('2026-03-08');
  const nowPos = getPosition(now.toISOString());

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Coordination Timeline</h3>
        <p className="text-[10px] text-muted-foreground">Project phases, handoffs, and dependency tracking</p>
      </div>

      <div className="overflow-x-auto scrollbar-thin">
        <div className="min-w-[900px] px-4 py-3">
          {/* Month headers */}
          <div className="flex border-b border-border/50 pb-1 ml-[160px]">
            {months.map((m, i) => (
              <div key={i} className="flex-1 text-[9px] text-muted-foreground text-center font-mono">
                {m.toLocaleDateString('en', { month: 'short', year: '2-digit' })}
              </div>
            ))}
          </div>

          {/* Now indicator */}
          <div className="relative ml-[160px]" style={{ height: 0 }}>
            <div
              className="absolute top-0 w-px bg-primary/60 z-10"
              style={{ left: `${nowPos}%`, height: `${projectGroups.length * 80 + 20}px` }}
            />
            <div
              className="absolute -top-3 text-[8px] font-mono text-primary z-10 -translate-x-1/2"
              style={{ left: `${nowPos}%` }}
            >
              NOW
            </div>
          </div>

          {/* Project rows */}
          {projectGroups.map(({ project, phases }, gi) => (
            <div key={project.id} className="flex items-start mt-2">
              <div className="w-[160px] shrink-0 pr-3 pt-2">
                <div className="text-[11px] font-medium text-foreground truncate" title={project.name}>{project.name}</div>
                <div className="text-[9px] text-muted-foreground">{project.region}</div>
              </div>
              <div className="flex-1 relative" style={{ height: `${Math.max(phases.length, 1) * 24 + 8}px` }}>
                {phases.map((phase, pi) => {
                  const left = getPosition(phase.startDate);
                  const end = phase.actualEnd || phase.endDate;
                  const right = getPosition(end);
                  const width = Math.max(right - left, 1);
                  const inst = institutions.find(i => i.id === phase.institutionId);

                  return (
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ delay: gi * 0.05 + pi * 0.03 }}
                      className={`absolute h-5 rounded border text-[8px] flex items-center px-1.5 truncate origin-left ${statusBg[phase.status]}`}
                      style={{ left: `${left}%`, width: `${width}%`, top: `${pi * 24 + 4}px` }}
                      title={`${phase.name} (${inst?.shortName}) – ${phase.status}`}
                    >
                      <span className="truncate">
                        {inst?.shortName}: {phase.name}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50 ml-[160px]">
            {Object.entries(statusColors).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1">
                <div className="w-3 h-2 rounded-sm" style={{ backgroundColor: color, opacity: 0.6 }} />
                <span className="text-[9px] text-muted-foreground capitalize">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
