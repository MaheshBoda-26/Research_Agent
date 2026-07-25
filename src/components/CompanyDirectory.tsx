import { useState, useMemo } from 'react';
import type { Company } from '../types/company';
import type { SortState } from '../hooks/useFilters';
import { formatCompactUSD, formatCompact } from '../lib/format';

interface CompanyDirectoryProps {
  companies: Company[];
  sort: SortState;
  onSortChange: (sort: SortState) => void;
  onSelectCompany: (company: Company) => void;
  comparingCompanies: Company[];
  onToggleCompare: (company: Company) => void;
  searchQuery?: string;
}

export function CompanyDirectory({
  companies,
  sort,
  onSortChange,
  onSelectCompany,
  comparingCompanies,
  onToggleCompare,
  searchQuery = '',
}: CompanyDirectoryProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const totalPages = Math.ceil(companies.length / pageSize) || 1;
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return companies.slice(start, start + pageSize);
  }, [companies, currentPage, pageSize]);

  const handleSort = (field: SortState['field']) => {
    if (sort.field === field) {
      onSortChange({ field, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange({ field, dir: 'asc' });
    }
  };

  const getSortIcon = (field: SortState['field']) => {
    if (sort.field !== field) return <span className="opacity-20 ml-1">↕</span>;
    return <span className="text-accent ml-1 font-bold">{sort.dir === 'asc' ? '↑' : '↓'}</span>;
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-accent/30 text-accent font-semibold px-0.5 rounded shadow-[0_0_8px_oklch(0.72_0.19_220/0.4)]">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="glass-panel rounded-xl p-5 space-y-5 shadow-xl">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-3">
        <div>
          <h2 className="text-lg font-bold font-display text-ink-900 flex items-center gap-2">
            Company Directory
            <span className="text-xs font-mono font-normal text-accent bg-accent-050 px-2 py-0.5 rounded-full border border-accent/20">
              {companies.length} entries
            </span>
          </h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Click any row to inspect details or check the box to compare.
          </p>
        </div>

        {/* View Mode & Page Size Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-surface-2/60 p-1 rounded-xl border border-white/5 shadow-inner">
            <button
              onClick={() => setViewMode('table')}
              aria-label="Table View"
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table' ? 'bg-accent text-canvas shadow-md shadow-accent/20 scale-105' : 'text-ink-500 hover:text-ink-900 hover:bg-white/5'
              }`}
              title="Table View"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              aria-label="Cards Grid View"
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'cards' ? 'bg-accent text-canvas shadow-md shadow-accent/20 scale-105' : 'text-ink-500 hover:text-ink-900 hover:bg-white/5'
              }`}
              title="Cards Grid View"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            aria-label="Page size"
            className="bg-surface-2/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-ink-900 focus:outline-none focus:border-accent cursor-pointer hover:bg-surface-2 transition-colors"
          >
            <option value={15} className="bg-surface">15 / page</option>
            <option value={25} className="bg-surface">25 / page</option>
            <option value={50} className="bg-surface">50 / page</option>
            <option value={100} className="bg-surface">100 / page</option>
          </select>
        </div>
      </div>

      {/* Directory Content */}
      {companies.length === 0 ? (
        <div className="py-16 text-center space-y-4 animate-fadeIn">
          <div className="text-4xl">🔍</div>
          <h3 className="text-lg font-bold font-display text-ink-900">No matching companies found</h3>
          <p className="text-sm text-ink-500 max-w-md mx-auto">Try adjusting your search queries or filter selections to find what you're looking for.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* Dense Table View */
        <div className="overflow-x-auto animate-fadeIn">
          <table className="w-full text-left text-xs border-separate border-spacing-0">
            <thead>
              <tr className="text-ink-500 font-semibold uppercase tracking-wider bg-surface-2/40 whitespace-nowrap">
                <th className="p-3.5 w-[72px] text-center rounded-tl-xl border-b border-white/10">Compare</th>
                <th className="p-3.5 cursor-pointer hover:text-accent transition-colors border-b border-white/10" onClick={() => handleSort('rank')}>
                  Rank {getSortIcon('rank')}
                </th>
                <th className="p-3.5 cursor-pointer hover:text-accent transition-colors border-b border-white/10" onClick={() => handleSort('name')}>
                  Company {getSortIcon('name')}
                </th>
                <th className="p-3.5 cursor-pointer hover:text-accent transition-colors border-b border-white/10" onClick={() => handleSort('sector')}>
                  Sector {getSortIcon('sector')}
                </th>
                <th className="p-3.5 cursor-pointer hover:text-accent transition-colors text-right border-b border-white/10" onClick={() => handleSort('valuationOrMarketCapUSD')}>
                  Market Cap / Val {getSortIcon('valuationOrMarketCapUSD')}
                </th>
                <th className="p-3.5 cursor-pointer hover:text-accent transition-colors text-right border-b border-white/10" onClick={() => handleSort('revenueUSD')}>
                  Revenue / Funding {getSortIcon('revenueUSD')}
                </th>
                <th className="p-3.5 cursor-pointer hover:text-accent transition-colors text-right border-b border-white/10" onClick={() => handleSort('employees')}>
                  Employees {getSortIcon('employees')}
                </th>
                <th className="p-3.5 text-center rounded-tr-xl border-b border-white/10">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans stagger-children">
              {paginatedCompanies.map((c, i) => {
                const isComparing = comparingCompanies.some((item) => item.name === c.name);
                const isPublic = c.status === 'Public';

                return (
                  <tr
                    key={c.name}
                    tabIndex={0}
                    role="button"
                    className="row-hover-lift cursor-pointer group animate-fadeInUp focus:outline-none focus:ring-2 focus:ring-accent/50 align-top"
                    style={{ animationDelay: `${Math.min(i * 20, 250)}ms` }}
                    onClick={() => onSelectCompany(c)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectCompany(c);
                      }
                    }}
                  >
                    <td className="p-3.5 text-center align-top pt-4" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isComparing}
                        onChange={() => onToggleCompare(c)}
                        aria-label={`Compare ${c.name}`}
                        className="rounded bg-surface-2 border-white/10 accent-accent cursor-pointer w-4 h-4 transition-transform hover:scale-110"
                      />
                    </td>
                    <td className="p-3.5 font-mono font-semibold text-accent align-top whitespace-nowrap pt-4">#{c.rank}</td>
                    <td className="p-3.5 font-medium text-ink-900 group-hover:text-accent transition-colors align-top min-w-[220px]">
                      <div className="font-bold text-sm leading-tight">{highlightMatch(c.name, searchQuery)}</div>
                      <div className="text-[11px] text-ink-500 line-clamp-2 mt-0.5 max-w-sm leading-normal">{c.oneLineDescription}</div>
                    </td>
                    <td className="p-3.5 text-ink-700 align-top min-w-[150px]">
                      <div className="font-semibold text-xs leading-tight">{c.sector}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5 leading-normal">{c.subsector}</div>
                    </td>
                    <td className="p-3.5 text-right tnum font-bold text-accent align-top whitespace-nowrap pt-4 min-w-[120px]">
                      {formatCompactUSD(c.valuationOrMarketCapUSD)}
                    </td>
                    <td className="p-3.5 text-right tnum text-ink-700 align-top whitespace-nowrap pt-4 min-w-[120px]">
                      {isPublic ? formatCompactUSD(c.revenueUSD) : formatCompactUSD(c.fundingRaisedUSD)}
                    </td>
                    <td className="p-3.5 text-right tnum text-ink-500 align-top whitespace-nowrap pt-4 min-w-[90px]">
                      {formatCompact(c.employees)}
                    </td>
                    <td className="p-3.5 text-center align-top pt-3.5 min-w-[90px]">
                      <span
                        className={`inline-block text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                          isPublic
                            ? 'bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20 shadow-[0_0_10px_oklch(0.75_0.20_155/0.2)]'
                            : 'bg-neon-amber/10 text-neon-amber border border-neon-amber/20 shadow-[0_0_10px_oklch(0.78_0.18_75/0.2)]'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Visual Card Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {paginatedCompanies.map((c, i) => {
            const isComparing = comparingCompanies.some((item) => item.name === c.name);
            const isPublic = c.status === 'Public';

            return (
              <div
                key={c.name}
                tabIndex={0}
                role="button"
                onClick={() => onSelectCompany(c)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCompany(c);
                  }
                }}
                className="glass-panel-interactive rounded-xl p-5 flex flex-col justify-between space-y-4 cursor-pointer group animate-fadeInUp focus:outline-none focus:ring-2 focus:ring-accent/50"
                style={{ animationDelay: `${Math.min(i * 25, 250)}ms` }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-accent bg-accent-050 px-2.5 py-1 rounded-md border border-accent/20">
                      #{c.rank}
                    </span>
                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isComparing}
                        onChange={() => onToggleCompare(c)}
                        aria-label={`Compare ${c.name}`}
                        className="rounded bg-surface-2 border-white/10 accent-accent cursor-pointer transition-transform hover:scale-110"
                      />
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                          isPublic
                            ? 'bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20 shadow-[0_0_10px_oklch(0.75_0.20_155/0.2)]'
                            : 'bg-neon-amber/10 text-neon-amber border border-neon-amber/20 shadow-[0_0_10px_oklch(0.78_0.18_75/0.2)]'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-display text-ink-900 group-hover:text-accent transition-colors">
                      {highlightMatch(c.name, searchQuery)}
                    </h3>
                    <p className="text-xs text-ink-500 font-medium mt-0.5">{c.sector} · {c.subsector}</p>
                  </div>

                  <p className="text-sm text-ink-700 leading-relaxed line-clamp-2">{c.oneLineDescription}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs mt-auto">
                  <div>
                    <span className="text-[10px] text-ink-500 block font-medium uppercase tracking-wider mb-1">Valuation / Cap</span>
                    <span className="font-bold font-mono text-accent text-base">{formatCompactUSD(c.valuationOrMarketCapUSD)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-ink-500 block font-medium uppercase tracking-wider mb-1">HQ</span>
                    <span className="font-medium text-ink-900">{c.hqCity}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-white/10 text-xs text-ink-500">
          <div>
            Showing <span className="font-mono text-ink-900">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-mono text-ink-900">{Math.min(currentPage * pageSize, companies.length)}</span> of{' '}
            <span className="font-mono text-accent font-bold text-sm bg-accent/10 px-1.5 py-0.5 rounded">{companies.length}</span> companies
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 rounded-lg bg-surface-2/60 border border-white/10 hover:bg-white/10 hover:text-ink-900 disabled:opacity-30 disabled:pointer-events-none transition-colors font-medium"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 3 + i;
                if (pageNum > totalPages) pageNum = totalPages - (4 - i);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-lg font-mono font-medium transition-all ${
                    currentPage === pageNum
                      ? 'bg-accent text-canvas font-bold shadow-md shadow-accent/20 scale-105'
                      : 'bg-surface-2/60 text-ink-500 hover:text-ink-900 hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 rounded-lg bg-surface-2/60 border border-white/10 hover:bg-white/10 hover:text-ink-900 disabled:opacity-30 disabled:pointer-events-none transition-colors font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
