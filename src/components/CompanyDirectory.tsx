import { useEffect, useState } from 'react';
import type { Company } from '../data/companies';
import type { SortState, SortField, SortDir } from '../hooks/useFilters';
import { formatCompactUSD, formatCompact, formatYear } from '../lib/format';

interface Props {
  companies: Company[];
  sort: SortState;
  onSortChange: (s: SortState) => void;
}

const PAGE_SIZE = 15;

/** Default direction when a column is clicked for the first time. */
const DEFAULT_DIR: Record<SortField, SortDir> = {
  rank: 'asc',
  name: 'asc',
  sector: 'asc',
  founded: 'desc',
  valuationUSD: 'desc',
  fundingRaisedUSD: 'desc',
  employees: 'desc',
};

type PageToken = number | 'gap';

/** Compact page list with ellipses for large totals. */
function getPageList(current: number, total: number): PageToken[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: PageToken[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('gap');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('gap');
  pages.push(total);
  return pages;
}

function SortHeader({
  field,
  label,
  sort,
  onSortChange,
}: {
  field: SortField;
  label: string;
  sort: SortState;
  onSortChange: (s: SortState) => void;
}) {
  const active = sort.field === field;
  const ariaSort: 'ascending' | 'descending' | 'none' = active
    ? sort.dir === 'asc'
      ? 'ascending'
      : 'descending'
    : 'none';

  const handleClick = () => {
    if (active) {
      onSortChange({ field, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange({ field, dir: DEFAULT_DIR[field] });
    }
  };

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className="bg-surface-2 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-ink-500"
    >
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1 -mx-0.5 px-0.5 hover:text-ink-700"
      >
        <span>{label}</span>
        {active && (
          <span aria-hidden="true" className="text-[10px] leading-none">
            {sort.dir === 'asc' ? '▲' : '▼'}
          </span>
        )}
      </button>
    </th>
  );
}

function StatusBadge({ status }: { status: 'public' | 'private' }) {
  if (status === 'public') {
    return (
      <span className="inline-flex items-center rounded-full bg-[var(--color-accent-050)] px-2 py-0.5 text-xs font-medium text-accent">
        Public
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-[oklch(0.95_0.05_35)] px-2 py-0.5 text-xs font-medium text-[oklch(0.42_0.15_35)]">
      Private
    </span>
  );
}

function MoneyCell({ company }: { company: Company }) {
  if (company.status === 'public') {
    return (
      <div>
        <div className="tnum text-ink-900">{formatCompactUSD(company.valuationUSD)}</div>
        <div className="text-[11px] text-ink-500">Mkt cap</div>
      </div>
    );
  }
  // Private: prefer funding raised, fall back to a valuation estimate, else dash.
  if (company.fundingRaisedUSD !== null) {
    return (
      <div>
        <div className="tnum text-ink-900">{formatCompactUSD(company.fundingRaisedUSD)}</div>
        <div className="text-[11px] text-ink-500">Funding</div>
      </div>
    );
  }
  if (company.valuationUSD !== null) {
    return (
      <div>
        <div className="tnum text-ink-900">{formatCompactUSD(company.valuationUSD)}</div>
        <div className="text-[11px] text-ink-500">Est. val.</div>
      </div>
    );
  }
  return <span className="tnum text-ink-500">—</span>;
}

export function CompanyDirectory({ companies, sort, onSortChange }: Props) {
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<number | null>(null);

  // Reset paging/expansion when the filtered set changes.
  useEffect(() => {
    setPage(1);
    setExpanded(null);
  }, [companies.length]);

  if (companies.length === 0) {
    return (
      <section aria-label="Company directory">
        <div className="bg-surface border border-ink-300 rounded-lg overflow-hidden">
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="text-ink-300"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M20 20l-3.5-3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="mt-3 text-sm text-ink-500">No companies match your filters.</p>
          </div>
        </div>
      </section>
    );
  }

  const totalPages = Math.max(1, Math.ceil(companies.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const endIdx = Math.min(startIdx + PAGE_SIZE, companies.length);
  const pageRows = companies.slice(startIdx, startIdx + PAGE_SIZE);
  const pageList = getPageList(safePage, totalPages);

  return (
    <section aria-label="Company directory">
      <div className="bg-surface border border-ink-300 rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <caption className="sr-only">
            Top 100 AI companies directory, sortable and paginated
          </caption>
          <thead>
            <tr>
              <SortHeader field="rank" label="#" sort={sort} onSortChange={onSortChange} />
              <SortHeader field="name" label="Company" sort={sort} onSortChange={onSortChange} />
              <SortHeader field="sector" label="Sector" sort={sort} onSortChange={onSortChange} />
              <th
                scope="col"
                className="bg-surface-2 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-ink-500"
              >
                HQ
              </th>
              <SortHeader field="founded" label="Founded" sort={sort} onSortChange={onSortChange} />
              <SortHeader
                field="valuationUSD"
                label="Valuation"
                sort={sort}
                onSortChange={onSortChange}
              />
              <SortHeader
                field="employees"
                label="Employees"
                sort={sort}
                onSortChange={onSortChange}
              />
              <th
                scope="col"
                className="bg-surface-2 px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-ink-500"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((c) => {
              const isOpen = expanded === c.rank;
              return (
                <BodyRows
                  key={c.rank}
                  company={c}
                  isOpen={isOpen}
                  onToggle={() => setExpanded(isOpen ? null : c.rank)}
                />
              );
            })}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-3 border-t border-ink-300 text-sm">
          <span className="text-ink-500 tnum">
            Showing {startIdx + 1}–{endIdx} of {companies.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 1}
              aria-label="Previous page"
              className="px-3 py-1.5 rounded border border-ink-300 hover:bg-surface-2 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Prev
            </button>
            {pageList.map((token, i) =>
              token === 'gap' ? (
                <span key={`gap-${i}`} className="px-1 text-ink-500" aria-hidden="true">
                  …
                </span>
              ) : (
                <button
                  key={token}
                  type="button"
                  onClick={() => setPage(token)}
                  aria-current={token === safePage ? 'page' : undefined}
                  className={
                    token === safePage
                      ? 'min-w-[2rem] px-2 py-1.5 rounded border border-accent bg-accent text-white font-medium'
                      : 'min-w-[2rem] px-2 py-1.5 rounded border border-ink-300 hover:bg-surface-2'
                  }
                >
                  {token}
                </button>
              ),
            )}
            <button
              type="button"
              onClick={() => setPage(safePage + 1)}
              disabled={safePage === totalPages}
              aria-label="Next page"
              className="px-3 py-1.5 rounded border border-ink-300 hover:bg-surface-2 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** A data row plus its conditional expanded detail row. */
function BodyRows({
  company: c,
  isOpen,
  onToggle,
}: {
  company: Company;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-t border-ink-300 hover:bg-surface-2">
        <td className="px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              aria-label={`Toggle details for ${c.name}`}
              className="inline-flex items-center justify-center rounded p-0.5 text-ink-500 hover:bg-surface hover:text-ink-700"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className={isOpen ? 'rotate-90' : ''}
                style={{ transition: 'transform 120ms ease' }}
              >
                <path
                  d="M7 5l6 5-6 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <span className="tnum text-ink-500">{c.rank}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-sm">
          <div className="font-medium text-ink-900">{c.name}</div>
          <div className="text-xs text-ink-500">{c.subsector}</div>
        </td>
        <td className="px-4 py-3 text-sm text-ink-700">{c.sector}</td>
        <td className="px-4 py-3 text-sm text-ink-700">
          <div>{c.hqCity}</div>
          <div className="text-xs text-ink-500">{c.hqCountry}</div>
        </td>
        <td className="px-4 py-3 text-sm tnum text-ink-700">{formatYear(c.founded)}</td>
        <td className="px-4 py-3 text-sm">
          <MoneyCell company={c} />
        </td>
        <td className="px-4 py-3 text-sm tnum text-ink-700">{formatCompact(c.employees)}</td>
        <td className="px-4 py-3 text-sm">
          <StatusBadge status={c.status} />
        </td>
      </tr>
      {isOpen && (
        <tr className="border-t border-ink-300 bg-surface-2">
          <td colSpan={8} className="px-4 py-4">
            <div className="space-y-2 text-sm">
              <p className="text-ink-700">{c.oneLineDescription}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-ink-500">
                <span>
                  Website:{' '}
                  <a
                    href={c.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-700 underline"
                  >
                    {c.website.replace(/^https?:\/\//, '')}
                  </a>
                </span>
                {c.ticker && (
                  <span>
                    Ticker:{' '}
                    <span className="tnum text-ink-700">{c.ticker}</span>
                  </span>
                )}
                <span>Source: {c.dataSource}</span>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
