import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Network, FolderKanban, ShieldAlert, Map, Building2 } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'network', label: 'Network', icon: Network },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'accountability', label: 'Accountability', icon: ShieldAlert },
  { id: 'institutions', label: 'Institutions', icon: Building2 },
];

export default function DashboardTabs({ activeTab, onTabChange }: Props) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="bg-muted/50 border border-border h-9">
        {tabs.map(tab => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="text-[11px] gap-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
          >
            <tab.icon size={13} />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
