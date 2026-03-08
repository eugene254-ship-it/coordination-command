import { useState, useCallback } from 'react';
import type { Institution, Project } from '@/data/mockData';
import CoordinationSummaryBar from '@/components/dashboard/CoordinationSummaryBar';
import InstitutionNetworkGraph from '@/components/dashboard/InstitutionNetworkGraph';
import AccountabilityAlertsPanel from '@/components/dashboard/AccountabilityAlertsPanel';
import ProjectResponsibilityMatrix from '@/components/dashboard/ProjectResponsibilityMatrix';
import CoordinationTimeline from '@/components/dashboard/CoordinationTimeline';
import InstitutionDetailDrawer from '@/components/dashboard/InstitutionDetailDrawer';
import InstitutionsTable from '@/components/dashboard/InstitutionsTable';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import RegionalCoordinationMap from '@/components/dashboard/RegionalCoordinationMap';
import ProjectDetailDrawer from '@/components/dashboard/ProjectDetailDrawer';
import FilterToolbar, { emptyFilters } from '@/components/dashboard/FilterToolbar';
import type { FilterState } from '@/components/dashboard/FilterToolbar';
import CoordinationGapDetection from '@/components/dashboard/CoordinationGapDetection';
import FundFlowSankey from '@/components/dashboard/FundFlowSankey';
import ProjectHealthBars from '@/components/dashboard/ProjectHealthBars';
import DependencyInspector from '@/components/dashboard/DependencyInspector';
import CoordinationSimulation from '@/components/dashboard/CoordinationSimulation';
import InstitutionalTrustScores from '@/components/dashboard/InstitutionalTrustScores';
import ExportSharePanel from '@/components/dashboard/ExportSharePanel';
import GlobalSearch from '@/components/dashboard/GlobalSearch';
import { NotificationBell, useRealTimeEvents } from '@/components/dashboard/NotificationSystem';
import { useTheme } from '@/hooks/use-theme';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';
import { Shield, Signal, Download, Sun, Moon, Menu, X, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [exportOpen, setExportOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { events, unreadCount, isConnected, markAllRead, markRead } = useRealTimeEvents();

  useKeyboardShortcuts({
    onTabChange: setActiveTab,
    onToggleTheme: toggleTheme,
    onToggleNotifications: useCallback(() => setNotificationsOpen(p => !p), []),
    onToggleSearch: useCallback(() => setSearchOpen(p => !p), []),
    onCloseAll: useCallback(() => {
      setExportOpen(false);
      setMobileNavOpen(false);
      setSearchOpen(false);
      setNotificationsOpen(false);
      setSelectedInstitution(null);
      setSelectedProject(null);
    }, []),
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="flex items-center justify-between px-3 sm:px-5 py-3">
          {/* Logo + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden flex items-center justify-center w-8 h-8 rounded-md border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              {mobileNavOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-primary" />
              <div>
                <h1 className="text-sm font-bold text-foreground tracking-tight">Atlas Sanctum</h1>
                <p className="text-[10px] text-muted-foreground hidden sm:block">Institutional Coordination Dashboard</p>
              </div>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:flex items-center gap-4">
            <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
            </button>

            {/* Notifications */}
            <NotificationBell
              events={events}
              unreadCount={unreadCount}
              isConnected={isConnected}
              onMarkAllRead={markAllRead}
              onMarkRead={markRead}
            />

            {/* Export */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="flex items-center gap-1.5 text-[10px] text-muted-foreground border border-border rounded-md px-2.5 py-1.5 hover:text-foreground hover:border-primary/30 transition-colors"
              >
                <Download size={11} />
                <span className="hidden sm:inline">Export</span>
              </button>
              <ExportSharePanel isOpen={exportOpen} onClose={() => setExportOpen(false)} />
            </div>

            {/* Live Status */}
            <div className="hidden md:flex items-center gap-1.5 text-[10px] text-muted-foreground border border-border rounded-md px-2 py-1">
              <Signal size={10} className="text-status-healthy" />
              <span className="font-mono">Live</span>
              <span className="text-[9px] opacity-60">Mar 8, 2026</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileNavOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-card border-r border-border z-50 lg:hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Shield size={18} className="text-primary" />
                  <span className="text-sm font-bold text-foreground">Atlas Sanctum</span>
                </div>
              </div>
              <nav className="p-3 space-y-1">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'network', label: 'Network' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'accountability', label: 'Accountability' },
                  { id: 'regional', label: 'Regional' },
                  { id: 'institutions', label: 'Institutions' },
                  { id: 'ai-gaps', label: 'AI Gaps' },
                  { id: 'simulation', label: 'Simulation' },
                  { id: 'trust', label: 'Trust' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-md text-[12px] font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary border border-primary/30'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
              {/* Mobile Export */}
              <div className="p-3 border-t border-border mt-auto">
                <div className="relative">
                  <button
                    onClick={() => setExportOpen(!exportOpen)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md border border-border text-[12px] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Download size={12} />
                    Export & Share
                  </button>
                  <ExportSharePanel isOpen={exportOpen} onClose={() => setExportOpen(false)} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="p-3 sm:p-5 space-y-4">
        <CoordinationSummaryBar />
        <FilterToolbar filters={filters} onFiltersChange={setFilters} />

        {activeTab === 'overview' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <InstitutionNetworkGraph onSelectInstitution={setSelectedInstitution} filters={filters} />
              </div>
              <div className="lg:col-span-1 min-h-[300px] lg:min-h-[400px]">
                <AccountabilityAlertsPanel filters={filters} />
              </div>
            </div>
            <ProjectResponsibilityMatrix onSelectProject={setSelectedProject} filters={filters} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <FundFlowSankey />
              <ProjectHealthBars />
            </div>
            <CoordinationTimeline filters={filters} />
          </div>
        )}

        {activeTab === 'network' && (
          <div className="h-[calc(100vh-200px)]">
            <InstitutionNetworkGraph onSelectInstitution={setSelectedInstitution} filters={filters} />
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-5">
            <ProjectResponsibilityMatrix onSelectProject={setSelectedProject} filters={filters} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <FundFlowSankey />
              <ProjectHealthBars />
            </div>
            <CoordinationTimeline filters={filters} />
            <DependencyInspector />
          </div>
        )}

        {activeTab === 'accountability' && (
          <div className="space-y-5">
            <div className="max-w-3xl">
              <AccountabilityAlertsPanel filters={filters} />
            </div>
            <DependencyInspector />
          </div>
        )}

        {activeTab === 'regional' && (
          <RegionalCoordinationMap onSelectInstitution={setSelectedInstitution} />
        )}

        {activeTab === 'institutions' && (
          <InstitutionsTable onSelectInstitution={setSelectedInstitution} />
        )}

        {activeTab === 'ai-gaps' && (
          <CoordinationGapDetection />
        )}

        {activeTab === 'simulation' && (
          <CoordinationSimulation />
        )}

        {activeTab === 'trust' && (
          <InstitutionalTrustScores />
        )}
      </main>

      {selectedInstitution && (
        <InstitutionDetailDrawer
          institution={selectedInstitution}
          onClose={() => setSelectedInstitution(null)}
        />
      )}
      {selectedProject && (
        <ProjectDetailDrawer
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default Index;
