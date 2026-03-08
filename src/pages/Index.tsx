import { useState } from 'react';
import type { Institution } from '@/data/mockData';
import CoordinationSummaryBar from '@/components/dashboard/CoordinationSummaryBar';
import InstitutionNetworkGraph from '@/components/dashboard/InstitutionNetworkGraph';
import AccountabilityAlertsPanel from '@/components/dashboard/AccountabilityAlertsPanel';
import ProjectResponsibilityMatrix from '@/components/dashboard/ProjectResponsibilityMatrix';
import CoordinationTimeline from '@/components/dashboard/CoordinationTimeline';
import InstitutionDetailDrawer from '@/components/dashboard/InstitutionDetailDrawer';
import InstitutionsTable from '@/components/dashboard/InstitutionsTable';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { Shield, Signal } from 'lucide-react';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              <div>
                <h1 className="text-sm font-bold text-foreground tracking-tight">Atlas Sanctum</h1>
                <p className="text-[10px] text-muted-foreground">Institutional Coordination Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground border border-border rounded-md px-2 py-1">
              <Signal size={10} className="text-status-healthy" />
              <span className="font-mono">Live</span>
              <span className="text-[9px] opacity-60">Mar 8, 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-5 space-y-5">
        {/* Summary bar - always visible */}
        <CoordinationSummaryBar />

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <InstitutionNetworkGraph onSelectInstitution={setSelectedInstitution} />
              </div>
              <div className="lg:col-span-1 min-h-[400px]">
                <AccountabilityAlertsPanel />
              </div>
            </div>
            <ProjectResponsibilityMatrix />
            <CoordinationTimeline />
          </div>
        )}

        {activeTab === 'network' && (
          <div className="h-[calc(100vh-200px)]">
            <InstitutionNetworkGraph onSelectInstitution={setSelectedInstitution} />
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-5">
            <ProjectResponsibilityMatrix />
            <CoordinationTimeline />
          </div>
        )}

        {activeTab === 'accountability' && (
          <div className="max-w-3xl">
            <AccountabilityAlertsPanel />
          </div>
        )}

        {activeTab === 'institutions' && (
          <InstitutionsTable onSelectInstitution={setSelectedInstitution} />
        )}
      </main>

      {/* Detail drawer */}
      {selectedInstitution && (
        <InstitutionDetailDrawer
          institution={selectedInstitution}
          onClose={() => setSelectedInstitution(null)}
        />
      )}
    </div>
  );
};

export default Index;
