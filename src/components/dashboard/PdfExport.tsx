import { useRef, useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { institutions, projects, accountabilityAlerts, raciMatrix } from '@/data/mockData';

function buildPdfHtml(): string {
  const now = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const critAlerts = accountabilityAlerts.filter(a => a.severity === 'critical');
  const warnAlerts = accountabilityAlerts.filter(a => a.severity === 'warning');
  const delayedProjects = projects.filter(p => p.status === 'delayed' || p.status === 'blocked');
  const avgCoord = Math.round(institutions.reduce((s, i) => s + i.coordinationScore, 0) / institutions.length);
  const avgDelivery = Math.round(institutions.reduce((s, i) => s + i.deliveryScore, 0) / institutions.length);

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Atlas Sanctum – Coordination Report</title>
<style>
  @page {
    size: A4;
    margin: 20mm 15mm 25mm 15mm;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    color: #1a1a2e;
    font-size: 11px;
    line-height: 1.5;
    background: #fff;
  }

  /* Header */
  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 3px solid #0e7490;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }
  .report-header h1 {
    font-size: 22px;
    font-weight: 800;
    color: #0e7490;
    letter-spacing: -0.5px;
  }
  .report-header .subtitle {
    font-size: 10px;
    color: #64748b;
    margin-top: 2px;
  }
  .report-header .date {
    font-size: 10px;
    color: #64748b;
    text-align: right;
  }

  /* Metrics strip */
  .metrics {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .metric-card {
    flex: 1;
    min-width: 100px;
    text-align: center;
    padding: 10px 8px;
    background: #f0fdfa;
    border: 1px solid #ccfbf1;
    border-radius: 6px;
  }
  .metric-card .value {
    font-size: 24px;
    font-weight: 800;
    color: #0e7490;
  }
  .metric-card .label {
    font-size: 9px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }

  /* Sections */
  h2 {
    font-size: 14px;
    font-weight: 700;
    color: #0e7490;
    margin: 20px 0 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #e2e8f0;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px;
    font-size: 10px;
  }
  th {
    background: #f1f5f9;
    font-weight: 600;
    text-align: left;
    padding: 6px 8px;
    border-bottom: 2px solid #cbd5e1;
    color: #334155;
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  td {
    padding: 5px 8px;
    border-bottom: 1px solid #e2e8f0;
    vertical-align: top;
  }
  tr:nth-child(even) { background: #fafafa; }

  /* Status badges */
  .badge {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 9px;
    font-weight: 600;
  }
  .badge-critical { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .badge-warning { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
  .badge-active { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .badge-blocked { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .badge-delayed { background: #fffbeb; color: #d97706; border: 1px solid #fde68a; }
  .badge-completed { background: #f0f9ff; color: #0284c7; border: 1px solid #bae6fd; }
  .badge-unassigned { background: #f5f5f5; color: #737373; border: 1px solid #d4d4d4; }

  /* Progress bar */
  .progress-bar {
    width: 60px;
    height: 6px;
    background: #e2e8f0;
    border-radius: 3px;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
    margin-right: 4px;
  }
  .progress-fill {
    height: 100%;
    border-radius: 3px;
    background: #0e7490;
  }

  /* Footer */
  .report-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px 15mm;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    font-size: 8px;
    color: #94a3b8;
    background: #fff;
  }

  /* Page breaks */
  .page-break { page-break-before: always; }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<div class="report-header">
  <div>
    <h1>⛨ Atlas Sanctum</h1>
    <div class="subtitle">Institutional Coordination Dashboard – Full Report</div>
  </div>
  <div class="date">
    Generated: ${now}<br/>
    Confidential – Internal Use Only
  </div>
</div>

<div class="metrics">
  <div class="metric-card"><div class="value">${institutions.length}</div><div class="label">Institutions</div></div>
  <div class="metric-card"><div class="value">${projects.length}</div><div class="label">Projects</div></div>
  <div class="metric-card"><div class="value">${critAlerts.length}</div><div class="label">Critical Alerts</div></div>
  <div class="metric-card"><div class="value">${delayedProjects.length}</div><div class="label">At Risk</div></div>
  <div class="metric-card"><div class="value">${avgCoord}%</div><div class="label">Avg Coordination</div></div>
  <div class="metric-card"><div class="value">${avgDelivery}%</div><div class="label">Avg Delivery</div></div>
</div>

<h2>Critical Alerts (${critAlerts.length})</h2>
<table>
  <thead><tr><th>Severity</th><th>Type</th><th>Message</th><th>Overdue</th></tr></thead>
  <tbody>
    ${critAlerts.map(a => `<tr>
      <td><span class="badge badge-critical">${a.severity}</span></td>
      <td>${a.type}</td>
      <td>${a.message}</td>
      <td>${a.daysOverdue ? a.daysOverdue + 'd' : '—'}</td>
    </tr>`).join('')}
  </tbody>
</table>

<h2>Warnings (${warnAlerts.length})</h2>
<table>
  <thead><tr><th>Severity</th><th>Type</th><th>Message</th><th>Overdue</th></tr></thead>
  <tbody>
    ${warnAlerts.map(a => `<tr>
      <td><span class="badge badge-warning">${a.severity}</span></td>
      <td>${a.type}</td>
      <td>${a.message}</td>
      <td>${a.daysOverdue ? a.daysOverdue + 'd' : '—'}</td>
    </tr>`).join('')}
  </tbody>
</table>

<div class="page-break"></div>

<h2>Projects Overview (${projects.length})</h2>
<table>
  <thead><tr><th>Project</th><th>Type</th><th>Region</th><th>Status</th><th>Risk</th><th>Progress</th><th>Lead</th></tr></thead>
  <tbody>
    ${projects.map(p => {
      const lead = institutions.find(i => i.id === p.leadInstitution);
      return `<tr>
        <td style="font-weight:600">${p.name}</td>
        <td>${p.type}</td>
        <td>${p.region}</td>
        <td><span class="badge badge-${p.status}">${p.status}</span></td>
        <td>${p.riskScore}</td>
        <td><div class="progress-bar"><div class="progress-fill" style="width:${p.progress}%"></div></div>${p.progress}%</td>
        <td>${lead?.shortName || 'Unassigned'}</td>
      </tr>`;
    }).join('')}
  </tbody>
</table>

<div class="page-break"></div>

<h2>Institutions (${institutions.length})</h2>
<table>
  <thead><tr><th>Institution</th><th>Type</th><th>Sector</th><th>Jurisdiction</th><th>Coordination</th><th>Delivery</th><th>Response</th><th>Projects</th></tr></thead>
  <tbody>
    ${institutions.map(i => `<tr>
      <td style="font-weight:600">${i.shortName}<br/><span style="font-weight:400;color:#64748b">${i.name}</span></td>
      <td>${i.type}</td>
      <td>${i.sector}</td>
      <td>${i.jurisdiction}</td>
      <td>${i.coordinationScore}%</td>
      <td>${i.deliveryScore}%</td>
      <td>${i.responseLatency}d</td>
      <td>${i.activeProjects}</td>
    </tr>`).join('')}
  </tbody>
</table>

<h2>RACI Matrix</h2>
<table>
  <thead><tr><th>Project</th><th>Institution</th><th>Role</th></tr></thead>
  <tbody>
    ${raciMatrix.map(r => {
      const proj = projects.find(p => p.id === r.projectId);
      const inst = institutions.find(i => i.id === r.institutionId);
      return `<tr>
        <td>${proj?.name || r.projectId}</td>
        <td>${inst?.shortName || r.institutionId}</td>
        <td><strong>${r.role || '—'}</strong></td>
      </tr>`;
    }).join('')}
  </tbody>
</table>

<div class="report-footer">
  <span>Atlas Sanctum · Institutional Coordination Dashboard</span>
  <span>Confidential · Auto-generated ${now}</span>
</div>

</body>
</html>`;
}

interface Props {
  className?: string;
}

export default function PdfExport({ className }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [generating, setGenerating] = useState(false);

  const handleExport = () => {
    setGenerating(true);

    const html = buildPdfHtml();
    const iframe = iframeRef.current;
    if (!iframe) {
      setGenerating(false);
      return;
    }

    const doc = iframe.contentDocument;
    if (!doc) {
      setGenerating(false);
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    // Wait for render then print
    setTimeout(() => {
      iframe.contentWindow?.print();
      setGenerating(false);
    }, 500);
  };

  return (
    <>
      <button
        onClick={handleExport}
        disabled={generating}
        className={`flex items-center gap-2 px-3 py-2 rounded-md border border-primary/30 bg-primary/5 text-[11px] text-primary hover:bg-primary/10 transition-colors disabled:opacity-50 ${className || ''}`}
      >
        {generating ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <FileDown size={12} />
        )}
        <span className="flex-1 text-left">Export PDF Report</span>
      </button>
      <iframe
        ref={iframeRef}
        className="hidden"
        title="PDF Export"
        style={{ position: 'absolute', width: 0, height: 0, border: 'none' }}
      />
    </>
  );
}
