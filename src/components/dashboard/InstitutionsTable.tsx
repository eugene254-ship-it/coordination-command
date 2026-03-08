import { institutions } from '@/data/mockData';
import type { Institution } from '@/data/mockData';
import { motion } from 'framer-motion';

interface Props {
  onSelectInstitution: (inst: Institution) => void;
}

const typeColors: Record<string, string> = {
  government: 'status-active',
  ngo: 'status-healthy',
  private: 'status-delayed',
  research: 'bg-[hsl(280,65%,55%)]/15 text-[hsl(280,65%,75%)] border-[hsl(280,65%,55%)]/30',
  community: 'bg-[hsl(330,65%,55%)]/15 text-[hsl(330,65%,75%)] border-[hsl(330,65%,55%)]/30',
  donor: 'status-healthy',
};

function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color = pct >= 75 ? 'bg-status-healthy' : pct >= 50 ? 'bg-status-delayed' : 'bg-status-blocked';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-[10px] text-muted-foreground">{value}</span>
    </div>
  );
}

export default function InstitutionsTable({ onSelectInstitution }: Props) {
  const sorted = [...institutions].sort((a, b) => b.coordinationScore - a.coordinationScore);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">All Institutions</h3>
        <p className="text-[10px] text-muted-foreground">{institutions.length} institutions · sorted by coordination score</p>
      </div>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="text-left px-3 py-2 font-medium">Institution</th>
              <th className="text-left px-3 py-2 font-medium">Type</th>
              <th className="text-left px-3 py-2 font-medium">Jurisdiction</th>
              <th className="text-left px-3 py-2 font-medium">Coordination</th>
              <th className="text-left px-3 py-2 font-medium">Delivery</th>
              <th className="text-center px-3 py-2 font-medium">Response</th>
              <th className="text-center px-3 py-2 font-medium">Projects</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((inst, i) => (
              <motion.tr
                key={inst.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => onSelectInstitution(inst)}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <td className="px-3 py-2.5">
                  <div className="font-medium text-foreground">{inst.shortName}</div>
                  <div className="text-[9px] text-muted-foreground truncate max-w-[200px]">{inst.name}</div>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border capitalize ${typeColors[inst.type]}`}>{inst.type}</span>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground">{inst.jurisdiction}</td>
                <td className="px-3 py-2.5"><ScoreBar value={inst.coordinationScore} /></td>
                <td className="px-3 py-2.5"><ScoreBar value={inst.deliveryScore} /></td>
                <td className="px-3 py-2.5 text-center font-mono text-muted-foreground">{inst.responseLatency}d</td>
                <td className="px-3 py-2.5 text-center font-mono text-foreground">{inst.activeProjects}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
