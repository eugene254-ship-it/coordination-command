import { useState } from 'react';
import { Download, Link2, FileText, Table2, Check, Copy, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { institutions, projects, raciMatrix, accountabilityAlerts, collaborationEdges } from '@/data/mockData';
import PdfExport from './PdfExport';

function generateCSV(type: 'institutions' | 'projects' | 'alerts' | 'matrix'): string {
  switch (type) {
    case 'institutions':
      const instHeaders = ['Name', 'Short Name', 'Type', 'Sector', 'Jurisdiction', 'Coordination Score', 'Delivery Score', 'Response Latency', 'Active Projects'];
      const instRows = institutions.map(i => [i.name, i.shortName, i.type, i.sector, i.jurisdiction, i.coordinationScore, i.deliveryScore, i.responseLatency, i.activeProjects].join(','));
      return [instHeaders.join(','), ...instRows].join('\n');

    case 'projects':
      const projHeaders = ['Name', 'Type', 'Region', 'Status', 'Risk Score', 'Progress', 'Start Date', 'End Date', 'Lead Institution'];
      const projRows = projects.map(p => {
        const lead = institutions.find(i => i.id === p.leadInstitution);
        return [p.name, p.type, p.region, p.status, p.riskScore, p.progress, p.startDate, p.endDate, lead?.shortName || 'Unassigned'].join(',');
      });
      return [projHeaders.join(','), ...projRows].join('\n');

    case 'alerts':
      const alertHeaders = ['Severity', 'Type', 'Message', 'Days Overdue', 'Timestamp'];
      const alertRows = accountabilityAlerts.map(a => [`"${a.severity}"`, `"${a.type}"`, `"${a.message}"`, a.daysOverdue || '', a.timestamp].join(','));
      return [alertHeaders.join(','), ...alertRows].join('\n');

    case 'matrix':
      const matrixHeaders = ['Project', 'Institution', 'Role'];
      const matrixRows = raciMatrix.map(r => {
        const proj = projects.find(p => p.id === r.projectId);
        const inst = institutions.find(i => i.id === r.institutionId);
        return [`"${proj?.name || r.projectId}"`, `"${inst?.shortName || r.institutionId}"`, r.role || ''].join(',');
      });
      return [matrixHeaders.join(','), ...matrixRows].join('\n');

    default:
      return '';
  }
}

function downloadCSV(type: 'institutions' | 'projects' | 'alerts' | 'matrix') {
  const csv = generateCSV(type);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `atlas-sanctum-${type}-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function generateReportHTML(): string {
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const critAlerts = accountabilityAlerts.filter(a => a.severity === 'critical');
  const delayedProjects = projects.filter(p => p.status === 'delayed' || p.status === 'blocked');

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Atlas Sanctum – Coordination Report</title>
<style>body{font-family:system-ui,sans-serif;max-width:900px;margin:0 auto;padding:40px;color:#1a1a2e;line-height:1.6}
h1{font-size:24px;border-bottom:2px solid #0891b2;padding-bottom:8px}h2{font-size:16px;margin-top:32px;color:#0891b2}
table{width:100%;border-collapse:collapse;margin:16px 0;font-size:13px}th,td{text-align:left;padding:8px 12px;border-bottom:1px solid #e5e7eb}
th{background:#f8fafc;font-weight:600}.critical{color:#dc2626;font-weight:600}.delayed{color:#d97706}
.metric{display:inline-block;text-align:center;padding:12px 24px;background:#f0fdfa;border-radius:8px;margin:4px}
.metric-value{font-size:28px;font-weight:700;color:#0891b2}.metric-label{font-size:11px;color:#64748b}</style></head>
<body><h1>Atlas Sanctum – Institutional Coordination Report</h1><p>Generated: ${now}</p>
<div style="display:flex;gap:8px;flex-wrap:wrap">
<div class="metric"><div class="metric-value">${institutions.length}</div><div class="metric-label">Institutions</div></div>
<div class="metric"><div class="metric-value">${projects.length}</div><div class="metric-label">Projects</div></div>
<div class="metric"><div class="metric-value">${critAlerts.length}</div><div class="metric-label">Critical Alerts</div></div>
<div class="metric"><div class="metric-value">${delayedProjects.length}</div><div class="metric-label">Delayed/Blocked</div></div>
</div>
<h2>Critical Alerts</h2><table><tr><th>Severity</th><th>Message</th></tr>
${critAlerts.map(a => `<tr><td class="critical">${a.severity.toUpperCase()}</td><td>${a.message}</td></tr>`).join('')}
</table>
<h2>Project Status</h2><table><tr><th>Project</th><th>Region</th><th>Status</th><th>Risk</th><th>Progress</th></tr>
${projects.map(p => `<tr><td>${p.name}</td><td>${p.region}</td><td class="${p.status === 'blocked' ? 'critical' : p.status === 'delayed' ? 'delayed' : ''}">${p.status}</td><td>${p.riskScore}</td><td>${p.progress}%</td></tr>`).join('')}
</table>
<h2>Institution Overview</h2><table><tr><th>Institution</th><th>Type</th><th>Coordination</th><th>Delivery</th><th>Response</th></tr>
${institutions.map(i => `<tr><td>${i.shortName} – ${i.name}</td><td>${i.type}</td><td>${i.coordinationScore}</td><td>${i.deliveryScore}</td><td>${i.responseLatency}d</td></tr>`).join('')}
</table>
<p style="margin-top:40px;font-size:11px;color:#94a3b8">Atlas Sanctum · Institutional Coordination Dashboard · Auto-generated report</p>
</body></html>`;
}

function downloadReport() {
  const html = generateReportHTML();
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `atlas-sanctum-report-${new Date().toISOString().split('T')[0]}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportSharePanel({ isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (type: 'institutions' | 'projects' | 'alerts' | 'matrix') => {
    setDownloading(type);
    setTimeout(() => {
      downloadCSV(type);
      setDownloading(null);
    }, 300);
  };

  const csvExports = [
    { type: 'institutions' as const, label: 'Institutions', count: institutions.length },
    { type: 'projects' as const, label: 'Projects', count: projects.length },
    { type: 'alerts' as const, label: 'Accountability Alerts', count: accountabilityAlerts.length },
    { type: 'matrix' as const, label: 'RACI Matrix', count: raciMatrix.length },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 z-50 w-[320px] rounded-lg border border-border bg-popover shadow-xl p-4"
          >
            <h4 className="text-[12px] font-semibold text-foreground mb-3">Export & Share</h4>

            {/* Share Link */}
            <div className="mb-4">
              <label className="text-[10px] text-muted-foreground mb-1.5 block font-medium">Dashboard Link</label>
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/30 text-[11px] text-foreground hover:bg-muted/50 transition-colors"
              >
                {copied ? <Check size={12} className="text-status-healthy" /> : <Link2 size={12} className="text-muted-foreground" />}
                <span className="flex-1 text-left truncate">{copied ? 'Copied to clipboard!' : 'Copy shareable link'}</span>
                {!copied && <Copy size={10} className="text-muted-foreground" />}
              </button>
            </div>

            {/* PDF Report */}
            <div className="mb-4">
              <label className="text-[10px] text-muted-foreground mb-1.5 block font-medium">Full Report</label>
              <button
                onClick={downloadReport}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md border border-primary/30 bg-primary/5 text-[11px] text-primary hover:bg-primary/10 transition-colors"
              >
                <FileText size={12} />
                <span className="flex-1 text-left">Download HTML Report</span>
                <Download size={10} />
              </button>
            </div>

            {/* CSV Exports */}
            <div>
              <label className="text-[10px] text-muted-foreground mb-1.5 block font-medium">CSV Data Export</label>
              <div className="space-y-1.5">
                {csvExports.map(exp => (
                  <button
                    key={exp.type}
                    onClick={() => handleDownload(exp.type)}
                    disabled={downloading === exp.type}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-muted/20 text-[11px] text-foreground hover:bg-muted/40 transition-colors disabled:opacity-50"
                  >
                    {downloading === exp.type ? <Loader2 size={12} className="animate-spin text-primary" /> : <Table2 size={12} className="text-muted-foreground" />}
                    <span className="flex-1 text-left">{exp.label}</span>
                    <span className="text-[9px] text-muted-foreground font-mono">{exp.count} rows</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
