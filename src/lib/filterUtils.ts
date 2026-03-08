import type { FilterState } from '@/components/dashboard/FilterToolbar';
import type { Institution, Project, CollaborationEdge, AccountabilityAlert, TimelinePhase } from '@/data/mockData';
import { institutions, projects } from '@/data/mockData';

export function isFilterEmpty(filters: FilterState): boolean {
  return Object.values(filters).every(arr => arr.length === 0);
}

function matchInstitutionType(inst: Institution, filter: string[]): boolean {
  if (filter.length === 0) return true;
  return filter.some(f => f.toLowerCase() === inst.type);
}

function matchGeography(region: string, filter: string[]): boolean {
  if (filter.length === 0) return true;
  return filter.some(f => f.toLowerCase() === region.toLowerCase());
}

function matchSector(inst: Institution, filter: string[]): boolean {
  if (filter.length === 0) return true;
  return filter.some(f => inst.sector.toLowerCase().includes(f.toLowerCase()));
}

function matchStatus(status: string, filter: string[]): boolean {
  if (filter.length === 0) return true;
  return filter.some(f => f.toLowerCase() === status.toLowerCase());
}

function matchRiskLevel(riskScore: number, filter: string[]): boolean {
  if (filter.length === 0) return true;
  return filter.some(f => {
    if (f.includes('>75')) return riskScore > 75;
    if (f.includes('50-75')) return riskScore >= 50 && riskScore <= 75;
    if (f.includes('25-50')) return riskScore >= 25 && riskScore < 50;
    if (f.includes('<25')) return riskScore < 25;
    return false;
  });
}

function matchFundingSource(projectId: string, filter: string[], raciMatrix: { projectId: string; institutionId: string; role: string | null }[]): boolean {
  if (filter.length === 0) return true;
  const funders = raciMatrix.filter(r => r.projectId === projectId && r.role === 'F');
  const funderNames = funders.map(f => {
    const inst = institutions.find(i => i.id === f.institutionId);
    return inst?.shortName || '';
  });
  return filter.some(f => funderNames.some(fn => fn.toLowerCase().includes(f.toLowerCase())) ||
    (f === 'Government' && funders.some(fu => institutions.find(i => i.id === fu.institutionId)?.type === 'government')));
}

export function filterInstitutions(insts: Institution[], filters: FilterState): Institution[] {
  if (isFilterEmpty(filters)) return insts;
  return insts.filter(inst => {
    if (!matchInstitutionType(inst, filters.institutionType)) return false;
    if (!matchSector(inst, filters.sector)) return false;
    if (filters.geography.length > 0 && !matchGeography(inst.jurisdiction, filters.geography)) return false;
    return true;
  });
}

export function filterProjects(projs: Project[], filters: FilterState, raciMatrix: { projectId: string; institutionId: string; role: string | null }[] = []): Project[] {
  if (isFilterEmpty(filters)) return projs;
  return projs.filter(proj => {
    if (!matchGeography(proj.region, filters.geography)) return false;
    if (!matchStatus(proj.status, filters.status)) return false;
    if (!matchRiskLevel(proj.riskScore, filters.riskLevel)) return false;
    if (!matchFundingSource(proj.id, filters.fundingSource, raciMatrix)) return false;
    return true;
  });
}

export function filterEdges(edges: CollaborationEdge[], filteredInstIds: Set<string>): CollaborationEdge[] {
  if (filteredInstIds.size === 0) return edges;
  return edges.filter(e => filteredInstIds.has(e.source) && filteredInstIds.has(e.target));
}

export function filterAlerts(alerts: AccountabilityAlert[], filters: FilterState): AccountabilityAlert[] {
  if (isFilterEmpty(filters)) return alerts;
  const filteredProjIds = new Set(filterProjects(projects, filters).map(p => p.id));
  const filteredInstIds = new Set(filterInstitutions(institutions, filters).map(i => i.id));
  return alerts.filter(a => {
    if (a.projectId && !filteredProjIds.has(a.projectId)) return false;
    if (a.institutionId && !filteredInstIds.has(a.institutionId)) return false;
    return true;
  });
}

export function filterTimelinePhases(phases: TimelinePhase[], filteredProjIds: Set<string>): TimelinePhase[] {
  if (filteredProjIds.size === 0) return phases;
  return phases.filter(p => filteredProjIds.has(p.projectId));
}
