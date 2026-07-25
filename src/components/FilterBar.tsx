import { SECTORS, REGIONS, type CompanyTier } from '../data/companies';
import { toggle, type FilterState, type StatusFilter } from '../hooks/useFilters';

interface Props {
  filters: FilterState;
  filteredCount: number;
  totalCount: number;
  onChange: (patch: Partial<FilterState>) => void;
  onReset: () => void;
}

const STATUSES: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
];

const TIERS: { label: string; value: CompanyTier }[] = [
  { label: 'Fortune 500', value: 'fortune500' },
  { label: 'Big Tech', value: 'big-tech' },
  { label: 'AI Frontier', value: 'ai-frontier' },
  { label: 'Unicorn', value: 'unicorn' },
  { label: 'Public Large', value: 'public-large' },
  { label: 'Public Mid', value: 'public-mid' },
];

const anyFilterActive = (f: FilterState): boolean =>
  f.query.trim() !== '' || f.sectors.length > 0 || f.regions.length > 0 || f.status !== 'all' || f.tiers.length > 0;

const chipClass = (active: boolean) =>
  [
    'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
    'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent',
    active
      ? 'border-accent bg-accent text-white'
      : 'border-ink-300 bg-surface text-ink-700 hover:bg-surface-2',
  ].join(' ');

export function FilterBar({ filters, filteredCount, totalCount, onChange, onReset }: Props) {
  const showReset = anyFilterActive(filters);

  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative w-full">
        <label htmlFor="company-search" className="sr-only">
          Search companies
        </label>
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-ink-500">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="text-ink-500"
          >
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="m11 11 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <input
          id="company-search"
          type="text"
          value={filters.query}
          onChange={(e) => onChange({ query: e.target.value })}
          placeholder="Search 100 companies by name, sector, location…"
          className="w-full rounded-lg border border-ink-300 bg-surface py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-500 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
        />
      </div>

      {/* Sector chips */}
      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Filter by sector</legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Sectors">
          {SECTORS.map((sector) => {
            const active = filters.sectors.includes(sector);
            return (
              <button
                key={sector}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ sectors: toggle(filters.sectors, sector) })}
                className={chipClass(active)}
              >
                {sector}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Region chips */}
      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Filter by region</legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Regions">
          {REGIONS.map((region) => {
            const active = filters.regions.includes(region);
            return (
              <button
                key={region}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ regions: toggle(filters.regions, region) })}
                className={chipClass(active)}
              >
                {region}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Tier chips */}
      <fieldset className="flex flex-col gap-2">
        <legend className="sr-only">Filter by company tier</legend>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Tiers">
          {TIERS.map(({ label, value }) => {
            const active = filters.tiers.includes(value);
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ tiers: toggle(filters.tiers, value) })}
                className={chipClass(active)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Status segmented control + reset */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Company status"
          className="inline-flex overflow-hidden rounded-lg border border-ink-300"
        >
          {STATUSES.map(({ label, value }) => {
            const active = filters.status === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => onChange({ status: value })}
                className={[
                  'px-3 py-1.5 text-xs font-medium transition-colors',
                  'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent',
                  active
                    ? 'bg-accent text-white'
                    : 'bg-surface text-ink-700 hover:bg-surface-2',
                ].join(' ')}
              >
                {label}
              </button>
            );
          })}
        </div>

        {showReset && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-ink-700 transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M5 8a3 3 0 0 1 5.12-2.12L12 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 4.5V8H8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reset
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-ink-500 tnum">
        Showing <span className="font-medium text-ink-700">{filteredCount}</span> of{' '}
        <span className="font-medium text-ink-700">{totalCount}</span> companies
      </p>
    </div>
  );
}