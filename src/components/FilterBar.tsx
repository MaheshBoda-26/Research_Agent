import { type FilterState, type StatusFilter, toggle } from '../hooks/useFilters';
import type { CompanyTier } from '../types/company';

interface FilterBarProps {
  filters: FilterState;
  filteredCount: number;
  totalCount: number;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

const SECTORS = [
  'Foundation Models',
  'AI Infrastructure',
  'Enterprise AI',
  'Semiconductors & Hardware',
  'Consumer & Productivity',
  'Autonomous Systems',
  'Healthcare & Bio',
  'Security & Safety',
  'Cloud & Data',
  'Other',
];

const TIERS: { id: CompanyTier; label: string }[] = [
  { id: 'fortune500', label: 'Fortune 500' },
  { id: 'big-tech', label: 'Big Tech' },
  { id: 'ai-frontier', label: 'AI Frontier Labs' },
  { id: 'unicorn', label: 'Unicorn' },
  { id: 'public-large', label: 'Public Large Cap' },
  { id: 'public-mid', label: 'Public Mid Cap' },
];

const REGIONS = [
  'North America',
  'Europe',
  'Asia-Pacific',
  'Middle East',
  'Latin America',
  'Africa',
];

const STATUSES: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All Statuses' },
  { id: 'public', label: 'Public' },
  { id: 'private', label: 'Private' },
];

export function FilterBar({
  filters,
  filteredCount,
  totalCount,
  onChange,
  onReset,
}: FilterBarProps) {
  const activeFilterCount =
    (filters.query ? 1 : 0) +
    (filters.sectors.length > 0 ? 1 : 0) +
    (filters.tiers.length > 0 ? 1 : 0) +
    (filters.regions.length > 0 ? 1 : 0) +
    (filters.status !== 'all' ? 1 : 0);

  return (
    <div className="glass-panel rounded-xl p-4 space-y-5 border border-white/10 bg-surface-1/40 shadow-xl relative z-20">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10 text-accent">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold font-display text-ink-900 uppercase tracking-wider">Filters</h2>
          {activeFilterCount > 0 && (
            <span className="text-xs font-mono font-bold bg-accent text-canvas px-2 py-0.5 rounded-full animate-pulse-glow">
              {activeFilterCount}
            </span>
          )}
        </div>

        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-accent hover:text-accent-hover font-medium transition-colors hover:underline"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold tracking-wider uppercase text-ink-500 block">Search Query</label>
        <div className="relative">
          <svg className="w-4 h-4 text-ink-500 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onChange({ query: e.target.value })}
            placeholder="Search name, HQ, subsector..."
            className="w-full bg-surface-1/40 border border-white/10 rounded-md pl-8 pr-7 py-1.5 text-xs text-ink-900 placeholder:text-ink-500 focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-colors shadow-inner"
          />
          {filters.query && (
            <button
              onClick={() => onChange({ query: '' })}
              aria-label="Clear search query"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 text-xs focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-sm p-0.5"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Sector Chips */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold tracking-wider uppercase text-ink-500 block">Sectors</label>
        <div className="flex flex-wrap gap-1.5">
          {SECTORS.map((s) => {
            const isSelected = filters.sectors.includes(s);
            return (
              <button
                key={s}
                onClick={() => onChange({ sectors: toggle(filters.sectors, s) })}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none border ${
                  isSelected
                    ? 'bg-accent/20 text-accent border-accent/40 shadow-[0_0_8px_rgba(59,130,246,0.15)] font-semibold'
                    : 'bg-surface-1/50 text-ink-400 hover:text-ink-900 border-white/10 hover:border-white/20 hover:bg-surface-2'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Company Tier Chips */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold tracking-wider uppercase text-ink-500 block">Company Tier</label>
        <div className="flex flex-wrap gap-1.5">
          {TIERS.map((t) => {
            const isSelected = filters.tiers.includes(t.id);
            return (
              <button
                key={t.id}
                onClick={() => onChange({ tiers: toggle(filters.tiers, t.id) })}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-neon-magenta focus-visible:outline-none border ${
                  isSelected
                    ? 'bg-neon-magenta/20 text-neon-magenta border-neon-magenta/40 shadow-[0_0_8px_rgba(236,72,153,0.15)] font-semibold'
                    : 'bg-surface-1/50 text-ink-400 hover:text-ink-900 border-white/10 hover:border-white/20 hover:bg-surface-2'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Region Chips */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold tracking-wider uppercase text-ink-500 block">Global Region</label>
        <div className="flex flex-wrap gap-1.5">
          {REGIONS.map((r) => {
            const isSelected = filters.regions.includes(r);
            return (
              <button
                key={r}
                onClick={() => onChange({ regions: toggle(filters.regions, r) })}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-neon-emerald focus-visible:outline-none border ${
                  isSelected
                    ? 'bg-neon-emerald/20 text-neon-emerald border-neon-emerald/40 shadow-[0_0_8px_rgba(16,185,129,0.15)] font-semibold'
                    : 'bg-surface-1/50 text-ink-400 hover:text-ink-900 border-white/10 hover:border-white/20 hover:bg-surface-2'
                }`}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold tracking-wider uppercase text-ink-500 block">Status</label>
        <div className="flex gap-1 bg-surface-1/40 p-1 rounded-lg border border-white/5">
          {STATUSES.map((st) => (
            <button
              key={st.id}
              onClick={() => onChange({ status: st.id })}
              className={`flex-1 py-1 rounded-md text-[11px] font-medium transition-all focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none ${
                filters.status === st.id
                  ? 'bg-surface-3 text-accent font-semibold shadow-sm border border-white/10'
                  : 'text-ink-500 hover:text-ink-900 hover:bg-surface-2/50 border border-transparent'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Matching Results Counter */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-ink-500">
        <span>Matching Firms:</span>
        <span className="font-mono font-bold text-accent text-sm">
          {filteredCount} / {totalCount}
        </span>
      </div>
    </div>
  );
}