import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Activity, AlertTriangle, CheckCircle2, Clock, ChevronDown } from 'lucide-react';
import { institutions, projects } from '@/data/mockData';

export interface LiveEvent {
  id: string;
  type: 'alert' | 'status_change' | 'activity';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const eventTemplates: Omit<LiveEvent, 'id' | 'timestamp' | 'read'>[] = [
  { type: 'alert', severity: 'critical', title: 'New Blocker Detected', message: 'Ward 12 water supply project blocked by inter-agency dispute.' },
  { type: 'status_change', severity: 'warning', title: 'Project Status Changed', message: 'Mathare River Cleanup moved from Active to Delayed.' },
  { type: 'activity', severity: 'info', title: 'Institution Update', message: 'NDMA submitted quarterly coordination report.' },
  { type: 'status_change', severity: 'success', title: 'Milestone Completed', message: 'Wetland Restoration baseline survey phase completed on schedule.' },
  { type: 'alert', severity: 'warning', title: 'Response Latency Spike', message: 'Athi Water Works response time increased to 14 days.' },
  { type: 'activity', severity: 'info', title: 'New Collaboration', message: 'MoEF and UoN established data-sharing agreement for flood monitoring.' },
  { type: 'alert', severity: 'critical', title: 'Accountability Gap', message: 'Post-flood sanitation in Ward 3 has no assigned lead institution.' },
  { type: 'status_change', severity: 'success', title: 'Funding Released', message: 'GCF Phase 2 disbursement of $2.4M approved.' },
  { type: 'activity', severity: 'info', title: 'Coordination Meeting', message: 'Cross-county flood response protocol review scheduled for next week.' },
  { type: 'alert', severity: 'warning', title: 'Trust Score Drop', message: 'NCG trust score dropped below 50 — now rated D.' },
];

const severityIcons = {
  critical: <AlertTriangle size={12} />,
  warning: <Clock size={12} />,
  info: <Activity size={12} />,
  success: <CheckCircle2 size={12} />,
};

const severityStyles = {
  critical: 'text-status-blocked bg-status-blocked/10 border-status-blocked/30',
  warning: 'text-status-delayed bg-status-delayed/10 border-status-delayed/30',
  info: 'text-primary bg-primary/10 border-primary/30',
  success: 'text-status-healthy bg-status-healthy/10 border-status-healthy/30',
};

export function useRealTimeEvents() {
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

  const addEvent = useCallback(() => {
    const template = eventTemplates[indexRef.current % eventTemplates.length];
    indexRef.current += 1;
    const newEvent: LiveEvent = {
      ...template,
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date(),
      read: false,
    };
    setEvents(prev => [newEvent, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    // Initial events
    const initial: LiveEvent[] = eventTemplates.slice(0, 3).map((t, i) => ({
      ...t,
      id: `evt-init-${i}`,
      timestamp: new Date(Date.now() - (i + 1) * 60000 * (5 + i * 3)),
      read: i > 0,
    }));
    setEvents(initial);

    // Simulate real-time events every 15-30 seconds
    intervalRef.current = setInterval(() => {
      if (Math.random() > 0.3) addEvent();
    }, 18000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [addEvent]);

  const markAllRead = useCallback(() => {
    setEvents(prev => prev.map(e => ({ ...e, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, read: true } : e));
  }, []);

  const unreadCount = events.filter(e => !e.read).length;

  return { events, unreadCount, isConnected, markAllRead, markRead };
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

interface NotificationBellProps {
  events: LiveEvent[];
  unreadCount: number;
  isConnected: boolean;
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
}

export function NotificationBell({ events, unreadCount, isConnected, onMarkAllRead, onMarkRead }: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open && unreadCount > 0) onMarkAllRead(); }}
        className="relative flex items-center gap-1.5 text-[10px] text-muted-foreground border border-border rounded-md px-2.5 py-1.5 hover:text-foreground hover:border-primary/30 transition-colors"
      >
        <Bell size={11} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-status-blocked text-[8px] text-foreground font-bold flex items-center justify-center"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 z-50 w-[360px] max-h-[480px] rounded-lg border border-border bg-popover shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-[12px] font-semibold text-foreground">Notifications</h4>
                  <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-status-healthy animate-pulse-glow' : 'bg-status-blocked'}`} />
                </div>
                {events.some(e => !e.read) && (
                  <button onClick={onMarkAllRead} className="text-[9px] text-primary hover:underline">Mark all read</button>
                )}
              </div>

              {/* Events */}
              <div className="overflow-y-auto max-h-[400px] scrollbar-thin">
                {events.length === 0 ? (
                  <div className="px-4 py-8 text-center text-[11px] text-muted-foreground">No notifications yet</div>
                ) : (
                  events.map(event => (
                    <div
                      key={event.id}
                      onClick={() => onMarkRead(event.id)}
                      className={`px-4 py-3 border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer ${!event.read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 p-1 rounded border ${severityStyles[event.severity]}`}>
                          {severityIcons[event.severity]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium text-foreground">{event.title}</span>
                            {!event.read && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{event.message}</p>
                          <span className="text-[9px] text-muted-foreground/50 font-mono mt-1 block">{formatTime(event.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
