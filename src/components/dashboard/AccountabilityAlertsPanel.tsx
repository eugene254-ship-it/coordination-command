import { useMemo } from 'react';
import { accountabilityAlerts as allAlerts } from '@/data/mockData';
import type { FilterState } from '@/components/dashboard/FilterToolbar';
import { filterAlerts, isFilterEmpty } from '@/lib/filterUtils';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';

const severityConfig = {
  critical: { icon: AlertTriangle, className: 'status-blocked border', dotColor: 'bg-status-blocked' },
  warning: { icon: AlertCircle, className: 'status-delayed border', dotColor: 'bg-status-delayed' },
  info: { icon: Info, className: 'status-active border', dotColor: 'bg-status-active' },
};

interface Props { filters?: FilterState; }

export default function AccountabilityAlertsPanel({ filters }: Props = {}) {
  const accountabilityAlerts = useMemo(() => filters && !isFilterEmpty(filters) ? filterAlerts(allAlerts, filters) : allAlerts, [filters]);
  const sorted = [...accountabilityAlerts].sort((a, b) => {
    const order = { critical: 0, warning: 1, info: 2 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="rounded-lg border border-border bg-card h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Accountability & Escalation</h3>
          <p className="text-[10px] text-muted-foreground">
            {accountabilityAlerts.filter(a => a.severity === 'critical').length} critical · {accountabilityAlerts.filter(a => a.severity === 'warning').length} warnings
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Clock size={12} />
          <span>Live</span>
          <span className="w-1.5 h-1.5 rounded-full bg-status-healthy animate-pulse-glow" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
        {sorted.map((alert, i) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-md px-3 py-2.5 text-[12px] leading-relaxed ${config.className}`}
            >
              <div className="flex items-start gap-2">
                <Icon size={14} className="mt-0.5 shrink-0" />
                <div>
                  <p>{alert.message}</p>
                  {alert.daysOverdue && (
                    <span className="font-mono text-[10px] mt-1 inline-block opacity-70">{alert.daysOverdue}d overdue</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
