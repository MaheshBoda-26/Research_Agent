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
            <mark key={i} className="bg-accent/30 text-accent font-semibold px-0.5 rounded">
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
    <div className="glass-panel rounded-2xl p-6 space-y-6">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
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
          <div className="flex items-center bg-surface-2/60 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'table' ? 'bg-accent text-canvas shadow' : 'text-ink-500 hover:text-ink-900'
              }`}
              title="Table View"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'cards' ? 'bg-accent text-canvas shadow' : 'text-ink-500 hover:text-ink-900'
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
            className="bg-surface-2/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-ink-900 focus:outline-none focus:border-accent cursor-pointer"
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
        <div className="py-12 text-center space-y-3">
          <div className="text-3xl">🔍</div>
          <h3 className="text-base font-semibold text-ink-900">No matching companies found</h3>
          <p className="text-xs text-ink-500">Try adjusting your search queries or filter selections.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* Dense Table View */
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-ink-500 font-semibold uppercase tracking-wider">
                <th className="p-3 w-10 text-center">Compare</th>
                <th className="p-3 cursor-pointer hover:text-ink-900" onClick={() => handleSort('rank')}>
                  Rank {getSortIcon('rank')}
                </th>
                <th className="p-3 cursor-pointer hover:text-ink-900" onClick={() => handleSort('name')}>
                  Company {getSortIcon('name')}
                </th>
                <th className="p-3 cursor-pointer hover:text-ink-900" onClick={() => handleSort('sector')}>
                  Sector {getSortIcon('sector')}
                </th>
                <th className="p-3 cursor-pointer hover:text-ink-900 text-right" onClick={() => handleSort('valuationOrMarketCapUSD')}>
                  Market Cap / Val {getSortIcon('valuationOrMarketCapUSD')}
                </th>
                <th className="p-3 cursor-pointer hover:text-ink-900 text-right" onClick={() => handleSort('revenueUSD')}>
                  Revenue / Funding {getSortIcon('revenueUSD')}
                </th>
                <th className="p-3 cursor-pointer hover:text-ink-900 text-right" onClick={() => handleSort('employees')}>
                  Employees {getSortIcon('employees')}
                </th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {paginatedCompanies.map((c) => {
                const isComparing = comparingCompanies.some((item) => item.name === c.name);
                const isPublic = c.status === 'Public';

                return (
                  <tr
                    key={c.name}
                    className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    onClick={() => onSelectCompany(c)}
                  >
                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isComparing}
                        onChange={() => onToggleCompare(c)}
                        className="rounded accent-accent cursor-pointer w-4 h-4"
                      />
                    </td>
                    <td className="p-3 font-mono font-semibold text-accent">#{c.rank}</td>
                    <td className="p-3 font-medium text-ink-900 group-hover:text-accent transition-colors">
                      <div className="font-bold text-sm">{highlightMatch(c.name, searchQuery)}</div>
                      <div className="text-[11px] text-ink-500 truncate max-w-xs">{c.oneLineDescription}</div>
                    </td>
                    <td className="p-3 text-ink-700">
                      <div className="font-medium">{c.sector}</div>
                      <div className="text-[11px] text-ink-500">{c.subsector}</div>
                    </td>
                    <td className="p-3 text-right tnum font-bold text-accent">
                      {formatCompactUSD(c.valuationOrMarketCapUSD)}
                    </td>
                    <td className="p-3 text-right tnum text-ink-700">
                      {isPublic ? formatCompactUSD(c.revenueUSD) : formatCompactUSD(c.fundingRaisedUSD)}
                    </td>
                    <td className="p-3 text-right tnum text-ink-500">
                      {formatCompact(c.employees)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isPublic
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedCompanies.map((c) => {
            const isComparing = comparingCompanies.some((item) => item.name === c.name);
            const isPublic = c.status === 'Public';

            return (
              <div
                key={c.name}
                onClick={() => onSelectCompany(c)}
                className="glass-panel-interactive rounded-xl p-4 flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-accent bg-accent-050 px-2 py-0.5 rounded">
                      #{c.rank}
                    </span>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isComparing}
                        onChange={() => onToggleCompare(c)}
                        className="rounded accent-accent cursor-pointer"
                      />
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          isPublic
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-display text-ink-900 group-hover:text-accent transition-colors">
                      {highlightMatch(c.name, searchQuery)}
                    </h3>
                    <p className="text-xs text-ink-500 font-medium">{c.sector} · {c.subsector}</p>
                  </div>

                  <p className="text-xs text-ink-700 line-clamp-2">{c.oneLineDescription}</p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-ink-500 block">Valuation / Cap</span>
                    <span className="font-bold font-mono text-accent">{formatCompactUSD(c.valuationOrMarketCapUSD)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-ink-500 block">HQ</span>
                    <span className="font-medium text-ink-900">{c.hqCity}, {c.hqCountry}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-white/10 text-xs text-ink-500">
          <div>
            Showing <span className="font-mono text-ink-900">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-mono text-ink-900">{Math.min(currentPage * pageSize, companies.length)}</span> of{' '}
            <span className="font-mono text-accent font-bold">{companies.length}</span> companies
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-surface-2/60 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
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
                  className={`w-8 h-8 rounded-lg font-mono font-medium transition-all ${
                    currentPage === pageNum
                      ? 'bg-accent text-canvas font-bold shadow'
                      : 'bg-surface-2/60 text-ink-500 hover:text-ink-900 border border-white/5'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-surface-2/60 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
