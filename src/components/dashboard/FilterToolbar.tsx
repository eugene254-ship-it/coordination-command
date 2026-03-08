import { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterState {
  geography: string[];
  institutionType: string[];
  sector: string[];
  status: string[];
  riskLevel: string[];
  fundingSource: string[];
}

const emptyFilters: FilterState = {
  geography: [],
  institutionType: [],
  sector: [],
  status: [],
  riskLevel: [],
  fundingSource: [],
};

const filterOptions: Record<keyof FilterState, { label: string; options: string[] }> = {
  geography: {
    label: 'Geography',
    options: ['Nairobi Central', 'Nairobi South', 'Kibera', 'Mathare', 'Nairobi Metro', 'Greater Nairobi', 'National'],
  },
  institutionType: {
    label: 'Institution Type',
    options: ['Government', 'NGO', 'Private', 'Research', 'Community', 'Donor'],
  },
  sector: {
    label: 'Sector',
    options: ['Environment', 'Urban Planning', 'Disaster Response', 'Climate Finance', 'Construction', 'Water', 'Humanitarian'],
  },
  status: {
    label: 'Status',
    options: ['Active', 'Delayed', 'Blocked', 'Completed', 'Unassigned'],
  },
  riskLevel: {
    label: 'Risk Level',
    options: ['Critical (>75)', 'High (50-75)', 'Medium (25-50)', 'Low (<25)'],
  },
  fundingSource: {
    label: 'Funding Source',
    options: ['GCF', 'World Bank', 'AfDB', 'Oxfam', 'Government'],
  },
};

interface Props {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

function FilterDropdown({ filterKey, config, selected, onToggle }: {
  filterKey: string;
  config: { label: string; options: string[] };
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-[11px] transition-colors ${
          selected.length > 0
            ? 'border-primary/40 bg-primary/10 text-primary'
            : 'border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:border-border'
        }`}
      >
        <span>{config.label}</span>
        {selected.length > 0 && (
          <span className="bg-primary/20 text-primary px-1 rounded text-[9px] font-mono">{selected.length}</span>
        )}
        <ChevronDown size={10} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute top-full left-0 mt-1 z-50 min-w-[180px] rounded-md border border-border bg-popover shadow-lg p-1"
            >
              {config.options.map(option => (
                <button
                  key={option}
                  onClick={() => onToggle(option)}
                  className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded text-[11px] text-left transition-colors ${
                    selected.includes(option)
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-muted/50'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-sm border flex items-center justify-center ${
                    selected.includes(option) ? 'border-primary bg-primary' : 'border-border'
                  }`}>
                    {selected.includes(option) && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3 5.5L6.5 2" stroke="hsl(var(--primary-foreground))" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <span>{option}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterToolbar({ filters, onFiltersChange }: Props) {
  const activeCount = Object.values(filters).reduce((acc, arr) => acc + arr.length, 0);

  const toggleFilter = (key: keyof FilterState, value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  const clearAll = () => onFiltersChange(emptyFilters);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mr-1">
        <Filter size={12} />
        <span className="font-medium">Filters</span>
      </div>

      {(Object.entries(filterOptions) as [keyof FilterState, typeof filterOptions[keyof FilterState]][]).map(([key, config]) => (
        <FilterDropdown
          key={key}
          filterKey={key}
          config={config}
          selected={filters[key]}
          onToggle={(val) => toggleFilter(key, val)}
        />
      ))}

      {activeCount > 0 && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 px-2 py-1.5 rounded-md text-[10px] text-status-blocked hover:bg-status-blocked/10 transition-colors"
        >
          <X size={10} />
          Clear all ({activeCount})
        </button>
      )}
    </div>
  );
}

export { emptyFilters };
export type { FilterState as Filters };
