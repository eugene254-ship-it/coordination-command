import { summaryMetrics } from '@/data/mockData';
import { motion } from 'framer-motion';
import { AlertTriangle, Building2, FolderKanban, Clock, ShieldAlert, Target, Users, CheckCircle } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  suffix?: string;
}

const variantClasses = {
  default: 'border-border bg-card',
  success: 'border-status-healthy/30 bg-status-healthy/5',
  warning: 'border-status-delayed/30 bg-status-delayed/5',
  danger: 'border-status-blocked/30 bg-status-blocked/5',
};

const iconVariantClasses = {
  default: 'text-primary',
  success: 'text-status-healthy',
  warning: 'text-status-delayed',
  danger: 'text-status-blocked',
};

function MetricCard({ label, value, icon, variant = 'default', suffix }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${variantClasses[variant]}`}
    >
      <div className={`${iconVariantClasses[variant]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-mono text-lg font-semibold leading-tight text-foreground">
          {value}{suffix && <span className="text-xs text-muted-foreground ml-0.5">{suffix}</span>}
        </div>
        <div className="text-[11px] text-muted-foreground truncate">{label}</div>
      </div>
    </motion.div>
  );
}

export default function CoordinationSummaryBar() {
  const m = summaryMetrics;
  const riskVariant = m.coordinationRiskScore > 70 ? 'danger' : m.coordinationRiskScore > 50 ? 'warning' : 'success';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3">
      <MetricCard label="Active Institutions" value={m.totalInstitutions} icon={<Building2 size={18} />} />
      <MetricCard label="Cross-Sector Projects" value={m.activeCrossSectorProjects} icon={<FolderKanban size={18} />} />
      <MetricCard label="On Track" value={m.projectsOnTrack} icon={<CheckCircle size={18} />} variant="success" />
      <MetricCard label="Delayed" value={m.projectsDelayed} icon={<Clock size={18} />} variant="warning" />
      <MetricCard label="Unowned Tasks" value={m.unownedCriticalTasks} icon={<AlertTriangle size={18} />} variant="danger" />
      <MetricCard label="Risk Score" value={m.coordinationRiskScore} icon={<ShieldAlert size={18} />} variant={riskVariant} suffix="/100" />
      <MetricCard label="Avg Response" value={m.avgResponseLatency} icon={<Target size={18} />} variant="warning" suffix="d" />
      <MetricCard label="Accountability" value={m.accountabilityCoverage} icon={<Users size={18} />} variant={m.accountabilityCoverage < 80 ? 'warning' : 'success'} suffix="%" />
    </div>
  );
}
