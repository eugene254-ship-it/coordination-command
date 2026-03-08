import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, FolderKanban, AlertTriangle, X, Command } from 'lucide-react';
import { institutions, projects, alerts } from '@/data/mockData';

interface SearchResult {
  id: string;
  type: 'institution' | 'project' | 'alert';
  title: string;
  subtitle: string;
  meta?: string;
}

function searchAll(query: string): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  institutions.forEach(inst => {
    if (inst.name.toLowerCase().includes(q) || inst.shortName.toLowerCase().includes(q) || inst.sector.toLowerCase().includes(q)) {
      results.push({
        id: inst.id,
        type: 'institution',
        title: inst.name,
        subtitle: `${inst.type} · ${inst.sector}`,
        meta: `Score: ${inst.coordinationScore}`,
      });
    }
  });

  projects.forEach(proj => {
    if (proj.name.toLowerCase().includes(q) || proj.type.toLowerCase().includes(q) || proj.region.toLowerCase().includes(q)) {
      results.push({
        id: proj.id,
        type: 'project',
        title: proj.name,
        subtitle: `${proj.type} · ${proj.region}`,
        meta: proj.status,
      });
    }
  });

  alerts.forEach(alert => {
    if (alert.message.toLowerCase().includes(q)) {
      results.push({
        id: alert.id,
        type: 'alert',
        title: alert.message.slice(0, 60) + (alert.message.length > 60 ? '…' : ''),
        subtitle: alert.type.replace(/_/g, ' '),
        meta: alert.severity,
      });
    }
  });

  return results.slice(0, 15);
}

const typeIcons = {
  institution: <Building2 size={14} />,
  project: <FolderKanban size={14} />,
  alert: <AlertTriangle size={14} />,
};

const typeColors = {
  institution: 'text-primary',
  project: 'text-status-healthy',
  alert: 'text-status-delayed',
};

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
  onSelectInstitution?: (id: string) => void;
  onSelectProject?: (id: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export default function GlobalSearch({ open, onClose, onSelectInstitution, onSelectProject, onNavigateTab }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = searchAll(query);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback((result: SearchResult) => {
    onClose();
    if (result.type === 'institution') {
      onNavigateTab?.('institutions');
    } else if (result.type === 'project') {
      onNavigateTab?.('projects');
    } else if (result.type === 'alert') {
      onNavigateTab?.('accountability');
    }
  }, [onClose, onNavigateTab]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-[560px]"
          >
            <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                <Search size={16} className="text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search institutions, projects, alerts…"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
                <kbd className="hidden sm:flex items-center gap-0.5 text-[9px] text-muted-foreground border border-border rounded px-1.5 py-0.5 font-mono">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-[360px] overflow-y-auto">
                {query && results.length === 0 && (
                  <div className="px-4 py-8 text-center text-[11px] text-muted-foreground">
                    No results for "{query}"
                  </div>
                )}

                {!query && (
                  <div className="px-4 py-6 text-center space-y-2">
                    <p className="text-[11px] text-muted-foreground">Type to search across all data</p>
                    <div className="flex items-center justify-center gap-3 text-[9px] text-muted-foreground/60">
                      <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5 font-mono">/</kbd> or <kbd className="border border-border rounded px-1 py-0.5 font-mono">⌘K</kbd> to open</span>
                      <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5 font-mono">↑↓</kbd> navigate</span>
                      <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1 py-0.5 font-mono">↵</kbd> select</span>
                    </div>
                  </div>
                )}

                {results.map((result, idx) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-4 py-2.5 flex items-center gap-3 transition-colors ${
                      idx === selectedIndex ? 'bg-primary/10' : 'hover:bg-muted/20'
                    }`}
                  >
                    <div className={`shrink-0 ${typeColors[result.type]}`}>
                      {typeIcons[result.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-medium text-foreground truncate">{result.title}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{result.subtitle}</div>
                    </div>
                    {result.meta && (
                      <span className="shrink-0 text-[9px] text-muted-foreground border border-border rounded px-1.5 py-0.5">
                        {result.meta}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Footer */}
              {query && results.length > 0 && (
                <div className="px-4 py-2 border-t border-border text-[9px] text-muted-foreground/60 flex items-center gap-2">
                  <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                  <span className="ml-auto">↵ to navigate to tab</span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
