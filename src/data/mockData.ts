export type InstitutionType = 'government' | 'ngo' | 'private' | 'research' | 'community' | 'donor';
export type ProjectStatus = 'active' | 'delayed' | 'blocked' | 'completed' | 'unassigned';
export type RoleType = 'R' | 'A' | 'C' | 'I' | 'F' | 'D' | 'V' | null;
export type EdgeStatus = 'healthy' | 'delayed' | 'blocked' | 'inactive';
export type RelationshipType = 'funding' | 'operational' | 'data_sharing' | 'policy_oversight' | 'research' | 'community_engagement' | 'infrastructure';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  type: InstitutionType;
  sector: string;
  jurisdiction: string;
  coordinationScore: number;
  responseLatency: number; // days
  activeProjects: number;
  deliveryScore: number;
  mandate: string;
}

export interface Project {
  id: string;
  name: string;
  type: string;
  region: string;
  status: ProjectStatus;
  riskScore: number;
  progress: number;
  startDate: string;
  endDate: string;
  leadInstitution: string;
  description: string;
}

export interface CollaborationEdge {
  source: string;
  target: string;
  relationshipType: RelationshipType;
  intensity: number;
  status: EdgeStatus;
  lastInteraction: string;
}

export interface RACIEntry {
  projectId: string;
  institutionId: string;
  role: RoleType;
}

export interface TimelinePhase {
  id: string;
  projectId: string;
  name: string;
  institutionId: string;
  startDate: string;
  endDate: string;
  actualEnd?: string;
  status: ProjectStatus;
  dependsOn?: string;
}

export interface AccountabilityAlert {
  id: string;
  severity: AlertSeverity;
  message: string;
  projectId?: string;
  institutionId?: string;
  daysOverdue?: number;
  timestamp: string;
  type: 'missing_owner' | 'overdue' | 'stalled' | 'blocker' | 'slippage' | 'no_reporting';
}

export const institutions: Institution[] = [
  { id: 'inst-1', name: 'Ministry of Environment & Forestry', shortName: 'MoEF', type: 'government', sector: 'Environment', jurisdiction: 'National', coordinationScore: 72, responseLatency: 4.2, activeProjects: 8, deliveryScore: 68, mandate: 'National environmental policy, climate adaptation oversight' },
  { id: 'inst-2', name: 'Nairobi County Government', shortName: 'NCG', type: 'government', sector: 'Urban Planning', jurisdiction: 'County', coordinationScore: 58, responseLatency: 8.1, activeProjects: 12, deliveryScore: 52, mandate: 'County-level infrastructure, service delivery, urban development' },
  { id: 'inst-3', name: 'Kenya Red Cross Society', shortName: 'KRCS', type: 'ngo', sector: 'Disaster Response', jurisdiction: 'National', coordinationScore: 85, responseLatency: 1.5, activeProjects: 6, deliveryScore: 88, mandate: 'Humanitarian response, disaster risk reduction, community resilience' },
  { id: 'inst-4', name: 'Green Climate Fund', shortName: 'GCF', type: 'donor', sector: 'Climate Finance', jurisdiction: 'International', coordinationScore: 78, responseLatency: 12.3, activeProjects: 4, deliveryScore: 75, mandate: 'Climate adaptation and mitigation financing' },
  { id: 'inst-5', name: 'University of Nairobi – CESED', shortName: 'UoN', type: 'research', sector: 'Climate Science', jurisdiction: 'National', coordinationScore: 70, responseLatency: 6.0, activeProjects: 5, deliveryScore: 82, mandate: 'Climate research, data analysis, early warning system development' },
  { id: 'inst-6', name: 'Kibera Community Development Trust', shortName: 'KCDT', type: 'community', sector: 'Community Dev', jurisdiction: 'Sub-county', coordinationScore: 64, responseLatency: 2.0, activeProjects: 3, deliveryScore: 71, mandate: 'Community-led development, local advocacy, grassroots mobilization' },
  { id: 'inst-7', name: 'SafariConstruct Ltd', shortName: 'SCL', type: 'private', sector: 'Construction', jurisdiction: 'National', coordinationScore: 55, responseLatency: 5.5, activeProjects: 4, deliveryScore: 60, mandate: 'Infrastructure construction, drainage systems, road works' },
  { id: 'inst-8', name: 'World Bank Kenya Office', shortName: 'WB', type: 'donor', sector: 'Development Finance', jurisdiction: 'International', coordinationScore: 80, responseLatency: 15.0, activeProjects: 7, deliveryScore: 76, mandate: 'Development lending, technical assistance, policy advisory' },
  { id: 'inst-9', name: 'National Disaster Management Authority', shortName: 'NDMA', type: 'government', sector: 'Disaster Mgmt', jurisdiction: 'National', coordinationScore: 62, responseLatency: 3.0, activeProjects: 9, deliveryScore: 58, mandate: 'Disaster preparedness, early warning coordination, emergency response' },
  { id: 'inst-10', name: 'Kenya Meteorological Department', shortName: 'KMD', type: 'government', sector: 'Meteorology', jurisdiction: 'National', coordinationScore: 74, responseLatency: 2.5, activeProjects: 3, deliveryScore: 80, mandate: 'Weather forecasting, climate data, flood early warning' },
  { id: 'inst-11', name: 'Athi Water Works Development Agency', shortName: 'AWWDA', type: 'government', sector: 'Water', jurisdiction: 'Regional', coordinationScore: 48, responseLatency: 11.0, activeProjects: 5, deliveryScore: 45, mandate: 'Water infrastructure, sewerage systems, flood drainage' },
  { id: 'inst-12', name: 'Oxfam Kenya', shortName: 'Oxfam', type: 'ngo', sector: 'Humanitarian', jurisdiction: 'National', coordinationScore: 82, responseLatency: 2.8, activeProjects: 4, deliveryScore: 84, mandate: 'Poverty reduction, community empowerment, climate justice' },
  { id: 'inst-13', name: 'African Development Bank', shortName: 'AfDB', type: 'donor', sector: 'Development Finance', jurisdiction: 'Continental', coordinationScore: 76, responseLatency: 18.0, activeProjects: 3, deliveryScore: 72, mandate: 'Infrastructure financing, regional integration, climate resilience' },
  { id: 'inst-14', name: 'Mathare Environmental Conservation Group', shortName: 'MECG', type: 'community', sector: 'Environment', jurisdiction: 'Sub-county', coordinationScore: 60, responseLatency: 1.8, activeProjects: 2, deliveryScore: 65, mandate: 'River cleanup, waste management, environmental advocacy' },
];

export const projects: Project[] = [
  { id: 'proj-1', name: 'Nairobi Basin Drainage Upgrade', type: 'Infrastructure', region: 'Nairobi Central', status: 'delayed', riskScore: 78, progress: 35, startDate: '2025-03-01', endDate: '2026-09-30', leadInstitution: 'inst-2', description: 'Major drainage infrastructure overhaul to reduce flood risk in central Nairobi basin' },
  { id: 'proj-2', name: 'Wetland Restoration – Nairobi Dam', type: 'Environmental', region: 'Nairobi South', status: 'active', riskScore: 42, progress: 62, startDate: '2025-01-15', endDate: '2026-06-30', leadInstitution: 'inst-1', description: 'Restoration of Nairobi Dam wetland ecosystem for flood attenuation and biodiversity' },
  { id: 'proj-3', name: 'Flood Early Warning System', type: 'Technology', region: 'Nairobi Metro', status: 'active', riskScore: 35, progress: 48, startDate: '2025-06-01', endDate: '2026-03-31', leadInstitution: 'inst-5', description: 'IoT-based early warning system integrating weather data, river gauges, and community alerts' },
  { id: 'proj-4', name: 'Kibera Flood Resilience Program', type: 'Community', region: 'Kibera', status: 'blocked', riskScore: 92, progress: 18, startDate: '2025-04-01', endDate: '2026-12-31', leadInstitution: 'inst-6', description: 'Community-led flood resilience building in Kibera informal settlement' },
  { id: 'proj-5', name: 'Climate Adaptation Finance Facility', type: 'Finance', region: 'National', status: 'active', riskScore: 28, progress: 72, startDate: '2024-09-01', endDate: '2026-03-31', leadInstitution: 'inst-4', description: 'Multi-donor climate adaptation funding mechanism for Kenya' },
  { id: 'proj-6', name: 'Mathare River Cleanup & Restoration', type: 'Environmental', region: 'Mathare', status: 'delayed', riskScore: 65, progress: 28, startDate: '2025-02-01', endDate: '2026-08-31', leadInstitution: 'inst-14', description: 'River restoration and waste management along Mathare River corridor' },
  { id: 'proj-7', name: 'Post-Flood Waste Management Protocol', type: 'Operations', region: 'Nairobi Metro', status: 'unassigned', riskScore: 88, progress: 0, startDate: '2025-08-01', endDate: '2026-06-30', leadInstitution: '', description: 'Coordinated waste removal and sanitation protocol following flood events' },
  { id: 'proj-8', name: 'Cross-County Flood Response Protocol', type: 'Policy', region: 'Greater Nairobi', status: 'delayed', riskScore: 71, progress: 40, startDate: '2025-05-01', endDate: '2026-04-30', leadInstitution: 'inst-9', description: 'Standardized flood response coordination across Nairobi and neighboring counties' },
];

export const collaborationEdges: CollaborationEdge[] = [
  { source: 'inst-1', target: 'inst-2', relationshipType: 'policy_oversight', intensity: 0.8, status: 'healthy', lastInteraction: '2026-03-05' },
  { source: 'inst-1', target: 'inst-4', relationshipType: 'funding', intensity: 0.7, status: 'healthy', lastInteraction: '2026-03-01' },
  { source: 'inst-2', target: 'inst-7', relationshipType: 'operational', intensity: 0.9, status: 'delayed', lastInteraction: '2026-02-18' },
  { source: 'inst-2', target: 'inst-11', relationshipType: 'infrastructure', intensity: 0.6, status: 'blocked', lastInteraction: '2026-01-25' },
  { source: 'inst-3', target: 'inst-9', relationshipType: 'operational', intensity: 0.85, status: 'healthy', lastInteraction: '2026-03-07' },
  { source: 'inst-3', target: 'inst-6', relationshipType: 'community_engagement', intensity: 0.7, status: 'healthy', lastInteraction: '2026-03-04' },
  { source: 'inst-4', target: 'inst-8', relationshipType: 'funding', intensity: 0.5, status: 'healthy', lastInteraction: '2026-02-20' },
  { source: 'inst-4', target: 'inst-13', relationshipType: 'funding', intensity: 0.4, status: 'inactive', lastInteraction: '2025-12-10' },
  { source: 'inst-5', target: 'inst-10', relationshipType: 'data_sharing', intensity: 0.9, status: 'healthy', lastInteraction: '2026-03-06' },
  { source: 'inst-5', target: 'inst-1', relationshipType: 'research', intensity: 0.6, status: 'delayed', lastInteraction: '2026-02-10' },
  { source: 'inst-6', target: 'inst-14', relationshipType: 'community_engagement', intensity: 0.75, status: 'healthy', lastInteraction: '2026-03-03' },
  { source: 'inst-6', target: 'inst-12', relationshipType: 'operational', intensity: 0.65, status: 'healthy', lastInteraction: '2026-02-28' },
  { source: 'inst-7', target: 'inst-11', relationshipType: 'infrastructure', intensity: 0.7, status: 'delayed', lastInteraction: '2026-02-05' },
  { source: 'inst-8', target: 'inst-2', relationshipType: 'funding', intensity: 0.8, status: 'healthy', lastInteraction: '2026-03-02' },
  { source: 'inst-8', target: 'inst-1', relationshipType: 'policy_oversight', intensity: 0.5, status: 'healthy', lastInteraction: '2026-02-25' },
  { source: 'inst-9', target: 'inst-10', relationshipType: 'data_sharing', intensity: 0.8, status: 'healthy', lastInteraction: '2026-03-07' },
  { source: 'inst-9', target: 'inst-2', relationshipType: 'operational', intensity: 0.6, status: 'delayed', lastInteraction: '2026-02-12' },
  { source: 'inst-12', target: 'inst-14', relationshipType: 'community_engagement', intensity: 0.55, status: 'healthy', lastInteraction: '2026-03-01' },
  { source: 'inst-13', target: 'inst-1', relationshipType: 'funding', intensity: 0.45, status: 'inactive', lastInteraction: '2025-11-30' },
];

export const raciMatrix: RACIEntry[] = [
  // Drainage Upgrade
  { projectId: 'proj-1', institutionId: 'inst-1', role: 'C' },
  { projectId: 'proj-1', institutionId: 'inst-2', role: 'A' },
  { projectId: 'proj-1', institutionId: 'inst-4', role: 'F' },
  { projectId: 'proj-1', institutionId: 'inst-7', role: 'R' },
  { projectId: 'proj-1', institutionId: 'inst-11', role: 'R' },
  { projectId: 'proj-1', institutionId: 'inst-8', role: 'F' },
  // Wetland Restoration
  { projectId: 'proj-2', institutionId: 'inst-1', role: 'A' },
  { projectId: 'proj-2', institutionId: 'inst-2', role: 'R' },
  { projectId: 'proj-2', institutionId: 'inst-4', role: 'F' },
  { projectId: 'proj-2', institutionId: 'inst-6', role: 'R' },
  { projectId: 'proj-2', institutionId: 'inst-5', role: 'D' },
  // Early Warning
  { projectId: 'proj-3', institutionId: 'inst-5', role: 'R' },
  { projectId: 'proj-3', institutionId: 'inst-10', role: 'D' },
  { projectId: 'proj-3', institutionId: 'inst-9', role: 'A' },
  { projectId: 'proj-3', institutionId: 'inst-3', role: 'I' },
  { projectId: 'proj-3', institutionId: 'inst-4', role: 'F' },
  // Kibera Resilience
  { projectId: 'proj-4', institutionId: 'inst-6', role: 'R' },
  { projectId: 'proj-4', institutionId: 'inst-3', role: 'R' },
  { projectId: 'proj-4', institutionId: 'inst-12', role: 'F' },
  { projectId: 'proj-4', institutionId: 'inst-2', role: 'C' },
  // Climate Finance
  { projectId: 'proj-5', institutionId: 'inst-4', role: 'A' },
  { projectId: 'proj-5', institutionId: 'inst-8', role: 'R' },
  { projectId: 'proj-5', institutionId: 'inst-13', role: 'F' },
  { projectId: 'proj-5', institutionId: 'inst-1', role: 'C' },
  // Mathare Cleanup
  { projectId: 'proj-6', institutionId: 'inst-14', role: 'R' },
  { projectId: 'proj-6', institutionId: 'inst-12', role: 'R' },
  { projectId: 'proj-6', institutionId: 'inst-2', role: 'A' },
  { projectId: 'proj-6', institutionId: 'inst-1', role: 'C' },
  // Post-Flood Waste - notably missing key roles
  { projectId: 'proj-7', institutionId: 'inst-2', role: 'C' },
  { projectId: 'proj-7', institutionId: 'inst-9', role: 'I' },
  // Cross-County Protocol
  { projectId: 'proj-8', institutionId: 'inst-9', role: 'A' },
  { projectId: 'proj-8', institutionId: 'inst-2', role: 'R' },
  { projectId: 'proj-8', institutionId: 'inst-3', role: 'R' },
  { projectId: 'proj-8', institutionId: 'inst-10', role: 'D' },
  { projectId: 'proj-8', institutionId: 'inst-1', role: 'V' },
];

export const timelinePhases: TimelinePhase[] = [
  { id: 'tp-1', projectId: 'proj-1', name: 'Environmental Assessment', institutionId: 'inst-1', startDate: '2025-03-01', endDate: '2025-06-30', actualEnd: '2025-08-15', status: 'completed' },
  { id: 'tp-2', projectId: 'proj-1', name: 'Procurement & Contracting', institutionId: 'inst-2', startDate: '2025-07-01', endDate: '2025-09-30', status: 'blocked', dependsOn: 'tp-1' },
  { id: 'tp-3', projectId: 'proj-1', name: 'Drainage Construction Phase 1', institutionId: 'inst-7', startDate: '2025-10-01', endDate: '2026-03-31', status: 'delayed', dependsOn: 'tp-2' },
  { id: 'tp-4', projectId: 'proj-1', name: 'Drainage Construction Phase 2', institutionId: 'inst-7', startDate: '2026-04-01', endDate: '2026-09-30', status: 'active', dependsOn: 'tp-3' },
  { id: 'tp-5', projectId: 'proj-2', name: 'Baseline Ecological Survey', institutionId: 'inst-5', startDate: '2025-01-15', endDate: '2025-04-30', actualEnd: '2025-04-20', status: 'completed' },
  { id: 'tp-6', projectId: 'proj-2', name: 'Community Engagement', institutionId: 'inst-6', startDate: '2025-03-01', endDate: '2025-07-31', actualEnd: '2025-07-15', status: 'completed' },
  { id: 'tp-7', projectId: 'proj-2', name: 'Restoration Works', institutionId: 'inst-2', startDate: '2025-08-01', endDate: '2026-03-31', status: 'active' },
  { id: 'tp-8', projectId: 'proj-2', name: 'Monitoring & Evaluation', institutionId: 'inst-1', startDate: '2026-01-01', endDate: '2026-06-30', status: 'active', dependsOn: 'tp-7' },
  { id: 'tp-9', projectId: 'proj-3', name: 'Sensor Network Design', institutionId: 'inst-5', startDate: '2025-06-01', endDate: '2025-09-30', actualEnd: '2025-10-10', status: 'completed' },
  { id: 'tp-10', projectId: 'proj-3', name: 'Hardware Deployment', institutionId: 'inst-5', startDate: '2025-10-01', endDate: '2026-01-31', status: 'active', dependsOn: 'tp-9' },
  { id: 'tp-11', projectId: 'proj-3', name: 'Data Integration', institutionId: 'inst-10', startDate: '2025-12-01', endDate: '2026-02-28', status: 'active', dependsOn: 'tp-10' },
  { id: 'tp-12', projectId: 'proj-3', name: 'Community Alert System', institutionId: 'inst-3', startDate: '2026-01-01', endDate: '2026-03-31', status: 'active', dependsOn: 'tp-11' },
  { id: 'tp-13', projectId: 'proj-4', name: 'Community Needs Assessment', institutionId: 'inst-6', startDate: '2025-04-01', endDate: '2025-07-31', actualEnd: '2025-08-30', status: 'completed' },
  { id: 'tp-14', projectId: 'proj-4', name: 'Infrastructure Planning', institutionId: 'inst-2', startDate: '2025-08-01', endDate: '2025-12-31', status: 'blocked', dependsOn: 'tp-13' },
  { id: 'tp-15', projectId: 'proj-4', name: 'Implementation Phase 1', institutionId: 'inst-6', startDate: '2026-01-01', endDate: '2026-06-30', status: 'blocked', dependsOn: 'tp-14' },
];

export const accountabilityAlerts: AccountabilityAlert[] = [
  { id: 'alert-1', severity: 'critical', message: '4 critical flood mitigation tasks have no accountable institution assigned.', projectId: 'proj-7', type: 'missing_owner', timestamp: '2026-03-08T06:00:00Z' },
  { id: 'alert-2', severity: 'critical', message: 'Permit approval for drainage construction has been unresolved for 21 days.', projectId: 'proj-1', institutionId: 'inst-2', daysOverdue: 21, type: 'stalled', timestamp: '2026-03-07T14:30:00Z' },
  { id: 'alert-3', severity: 'warning', message: 'Athi Water Works has missed 3 consecutive reporting cycles.', institutionId: 'inst-11', type: 'no_reporting', timestamp: '2026-03-06T09:00:00Z' },
  { id: 'alert-4', severity: 'critical', message: 'Kibera flood resilience program blocked: infrastructure planning stalled at county level.', projectId: 'proj-4', institutionId: 'inst-2', type: 'blocker', timestamp: '2026-03-07T11:00:00Z' },
  { id: 'alert-5', severity: 'warning', message: 'Contractor mobilization blocked by permit approval delay – cascading to Phase 2.', projectId: 'proj-1', institutionId: 'inst-7', type: 'blocker', daysOverdue: 14, timestamp: '2026-03-06T16:00:00Z' },
  { id: 'alert-6', severity: 'warning', message: 'Research partner delivered flood data, but policy action remains unassigned by MoEF.', projectId: 'proj-3', institutionId: 'inst-1', type: 'stalled', timestamp: '2026-03-05T10:00:00Z' },
  { id: 'alert-7', severity: 'critical', message: 'No institution assigned to post-flood waste removal in Ward 7 (Mathare).', type: 'missing_owner', timestamp: '2026-03-08T07:00:00Z' },
  { id: 'alert-8', severity: 'info', message: 'GCF disbursement Phase 2 pending environmental compliance approval – 8 days remaining.', projectId: 'proj-5', institutionId: 'inst-4', type: 'stalled', timestamp: '2026-03-07T08:00:00Z' },
  { id: 'alert-9', severity: 'warning', message: 'Nairobi County Government coordination score dropped 12 points in 30 days.', institutionId: 'inst-2', type: 'slippage', timestamp: '2026-03-06T12:00:00Z' },
  { id: 'alert-10', severity: 'info', message: 'Cross-county flood response protocol review delayed – NDMA awaiting county input.', projectId: 'proj-8', institutionId: 'inst-9', type: 'stalled', daysOverdue: 7, timestamp: '2026-03-05T15:00:00Z' },
];

// Summary metrics
export const summaryMetrics = {
  totalInstitutions: 14,
  activeCrossSectorProjects: 8,
  projectsOnTrack: 3,
  projectsDelayed: 3,
  projectsBlocked: 1,
  unownedCriticalTasks: 4,
  coordinationRiskScore: 67,
  avgResponseLatency: 6.8,
  accountabilityCoverage: 73,
};

// Network graph node positions (pre-computed for initial layout)
export const nodePositions: Record<string, { x: number; y: number }> = {
  'inst-1': { x: 400, y: 180 },
  'inst-2': { x: 320, y: 300 },
  'inst-3': { x: 550, y: 120 },
  'inst-4': { x: 200, y: 150 },
  'inst-5': { x: 500, y: 280 },
  'inst-6': { x: 450, y: 400 },
  'inst-7': { x: 220, y: 380 },
  'inst-8': { x: 120, y: 260 },
  'inst-9': { x: 600, y: 220 },
  'inst-10': { x: 620, y: 340 },
  'inst-11': { x: 180, y: 430 },
  'inst-12': { x: 520, y: 440 },
  'inst-13': { x: 100, y: 160 },
  'inst-14': { x: 420, y: 480 },
};
