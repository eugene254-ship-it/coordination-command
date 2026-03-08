import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Clock, CheckCircle2, BarChart3, Handshake, Info } from 'lucide-react';
import { institutions, collaborationEdges, timelinePhases, accountabilityAlerts, raciMatrix } from '@/data/mockData';
import type { Institution } from '@/data/mockData';

interface TrustDimension {
  name: string;
  score: number;
  weight: number;
  icon: React.ReactNode;
  description: string;
}

interface TrustProfile {
  institution: Institution;
  overallScore: number;
  grade: string;
  dimensions: TrustDimension[];
}

function computeTrustProfile(inst: Institution): TrustProfile {
  // 1. Responsiveness (based on response latency - lower is better)
  const maxLatency = 20;
  const responsivenessScore = Math.max(0, Math.min(100, ((maxLatency - inst.responseLatency) / maxLatency) * 100));

  // 2. Follow-through (based on delivery score + project completion in timeline)
  const instPhases = timelinePhases.filter(tp => tp.institutionId === inst.id);
  const completedPhases = instPhases.filter(tp => tp.status === 'completed').length;
  const totalPhases = instPhases.length || 1;
  const completionRate = (completedPhases / totalPhases) * 100;
  const followThroughScore = (inst.deliveryScore * 0.6 + completionRate * 0.4);

  // 3. Update frequency (inverse of alerts about no-reporting + coordination score factor)
  const noReportAlerts = accountabilityAlerts.filter(a => a.institutionId === inst.id && a.type === 'no_reporting').length;
  const updateScore = Math.max(0, 100 - noReportAlerts * 30 + (inst.coordinationScore > 70 ? 10 : 0));

  // 4. Collaboration success (based on healthy edges vs total edges)
  const edges = collaborationEdges.filter(e => e.source === inst.id || e.target === inst.id);
  const healthyEdges = edges.filter(e => e.status === 'healthy').length;
  const totalEdges = edges.length || 1;
  const collabScore = (healthyEdges / totalEdges) * 100;

  const dimensions: TrustDimension[] = [
    { name: 'Responsiveness', score: Math.round(responsivenessScore), weight: 0.25, icon: <Clock size={12} />, description: `Avg response: ${inst.responseLatency}d` },
    { name: 'Follow-through', score: Math.round(followThroughScore), weight: 0.30, icon: <CheckCircle2 size={12} />, description: `${completedPhases}/${totalPhases} phases completed` },
    { name: 'Update Frequency', score: Math.round(Math.min(100, updateScore)), weight: 0.20, icon: <BarChart3 size={12} />, description: `${noReportAlerts} missed reporting cycles` },
    { name: 'Collaboration', score: Math.round(collabScore), weight: 0.25, icon: <Handshake size={12} />, description: `${healthyEdges}/${edges.length} healthy partnerships` },
  ];

  const overallScore = Math.round(dimensions.reduce((acc, d) => acc + d.score * d.weight, 0));

  const grade = overallScore >= 85 ? 'A' : overallScore >= 70 ? 'B' : overallScore >= 55 ? 'C' : overallScore >= 40 ? 'D' : 'F';

  return { institution: inst, overallScore, grade, dimensions };
}

const gradeColors: Record<string, string> = {
  A: 'text-status-healthy bg-status-healthy/15 border-status-healthy/30',
  B: 'text-primary bg-primary/15 border-primary/30',
  C: 'text-status-delayed bg-status-delayed/15 border-status-delayed/30',
  D: 'text-status-blocked bg-status-blocked/15 border-status-blocked/30',
  F: 'text-status-blocked bg-status-blocked/25 border-status-blocked/50',
};

function ScoreBar({ score, color }: { score: number; color?: string }) {
  const barColor = score >= 75 ? 'bg-status-healthy' : score >= 50 ? 'bg-status-delayed' : 'bg-status-blocked';
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`h-full rounded-full ${color || barColor}`}
        />
      </div>
      <span className="font-mono text-[10px] text-muted-foreground w-6 text-right">{score}</span>
    </div>
  );
}

function TrustCard({ profile, index }: { profile: TrustProfile; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="rounded-lg border border-border bg-card overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/20 transition-colors text-left"
      >
        <div className={`w-8 h-8 rounded-md flex items-center justify-center text-sm font-bold border ${gradeColors[profile.grade]}`}>
          {profile.grade}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-foreground">{profile.institution.shortName}</span>
            <span className="text-[9px] text-muted-foreground capitalize">{profile.institution.type}</span>
          </div>
          <div className="text-[9px] text-muted-foreground truncate">{profile.institution.name}</div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold font-mono text-foreground">{profile.overallScore}</div>
          <div className="text-[8px] text-muted-foreground">TRUST</div>
        </div>
        <ScoreBar score={profile.overallScore} />
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="border-t border-border/50 px-4 py-3 bg-muted/10"
        >
          <div className="grid grid-cols-2 gap-3">
            {profile.dimensions.map(dim => (
              <div key={dim.name} className="flex items-start gap-2">
                <div className="mt-0.5 text-muted-foreground">{dim.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-foreground">{dim.name}</span>
                    <span className="text-[9px] text-muted-foreground/60">×{dim.weight}</span>
                  </div>
                  <ScoreBar score={dim.score} />
                  <div className="text-[9px] text-muted-foreground/60 mt-0.5">{dim.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

import { useState } from 'react';

export default function InstitutionalTrustScores() {
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');

  const profiles = useMemo(() => {
    const all = institutions.map(computeTrustProfile);
    return sortBy === 'score'
      ? all.sort((a, b) => b.overallScore - a.overallScore)
      : all.sort((a, b) => a.institution.shortName.localeCompare(b.institution.shortName));
  }, [sortBy]);

  const avgScore = Math.round(profiles.reduce((acc, p) => acc + p.overallScore, 0) / profiles.length);
  const highTrust = profiles.filter(p => p.overallScore >= 70).length;
  const lowTrust = profiles.filter(p => p.overallScore < 50).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Institutional Trust Scores</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortBy('score')}
              className={`text-[10px] px-2 py-1 rounded border transition-colors ${sortBy === 'score' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
            >
              By Score
            </button>
            <button
              onClick={() => setSortBy('name')}
              className={`text-[10px] px-2 py-1 rounded border transition-colors ${sortBy === 'name' ? 'border-primary/40 bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
            >
              By Name
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <div className="text-2xl font-bold font-mono text-foreground">{avgScore}</div>
            <div className="text-[9px] text-muted-foreground">System Average</div>
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-status-healthy">{highTrust}</div>
            <div className="text-[9px] text-muted-foreground">High Trust</div>
          </div>
          <div>
            <div className="text-lg font-bold font-mono text-status-blocked">{lowTrust}</div>
            <div className="text-[9px] text-muted-foreground">Low Trust</div>
          </div>
          <div className="flex-1" />
          <div className="flex items-start gap-1.5 text-[9px] text-muted-foreground/60 max-w-[280px]">
            <Info size={10} className="shrink-0 mt-0.5" />
            <span>Scores computed from responsiveness, follow-through, update frequency, and collaboration health. Click any row to see breakdown.</span>
          </div>
        </div>
      </div>

      {/* Trust Cards */}
      <div className="space-y-2">
        {profiles.map((profile, i) => (
          <TrustCard key={profile.institution.id} profile={profile} index={i} />
        ))}
      </div>
    </div>
  );
}
