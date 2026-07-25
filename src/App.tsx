import { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { companies } from './data/companies';
import { FilterBar } from './components/FilterBar';
import { CompanyDirectory } from './components/CompanyDirectory';
import { KpiStrip } from './components/KpiStrip';
import { SectorBar } from './components/charts/SectorBar';
import { applyFilters, sortCompanies, useUrlFilters, type SortState } from './hooks/useFilters';
import { computeKpis } from './lib/aggregate';

function Dashboard() {
  const { filters, update, reset } = useUrlFilters();

  const filteredCompanies = useMemo(() => applyFilters(companies, filters), [filters]);

  const [sort, setSort] = useState<SortState>({ field: 'rank', dir: 'asc' });

  const sortedCompanies = useMemo(
    () => sortCompanies(filteredCompanies, sort),
    [filteredCompanies, sort]
  );

  const kpis = useMemo(() => computeKpis(filteredCompanies), [filteredCompanies]);

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="border-b border-ink-300 bg-surface sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-ink-900">Fortune 500 & Big Tech Intelligence</h1>
              <p className="text-sm text-ink-500 mt-0.5">
                Interactive dashboard tracking {companies.length} companies across market cap, revenue, funding, and sector.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-ink-500">
              <span>Data as of 2026-07-01</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6">
          {/* Sidebar - Filters */}
          <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto hidden lg:block">
            <FilterBar
              filters={filters}
              filteredCount={filteredCompanies.length}
              totalCount={companies.length}
              onChange={update}
              onReset={reset}
            />
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden mb-6">
            <FilterBar
              filters={filters}
              filteredCount={filteredCompanies.length}
              totalCount={companies.length}
              onChange={update}
              onReset={reset}
            />
          </div>

          {/* Content Area */}
          <div className="space-y-6">
            {/* KPI Strip */}
            <KpiStrip kpis={kpis} />

            {/* Charts Row */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-6">
              <SectorBar companies={filteredCompanies} />
              <div className="bg-surface border border-ink-300 rounded-lg p-5">
                <h2 className="text-sm font-semibold text-ink-900 mb-3">Sector Breakdown</h2>
                <p className="text-xs text-ink-500 mb-4">
                  {filteredCompanies.length} companies across {new Set(filteredCompanies.map(c => c.sector)).size} sectors.
                </p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Array.from(
                    filteredCompanies.reduce((acc, c) => {
                      acc.set(c.sector, (acc.get(c.sector) ?? 0) + 1);
                      return acc;
                    }, new Map<string, number>())
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([sector, count]) => (
                      <div key={sector} className="flex items-center justify-between text-sm">
                        <span className="text-ink-700">{sector}</span>
                        <span className="tnum text-ink-500 font-medium">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Company Directory */}
            <CompanyDirectory
              companies={sortedCompanies}
              sort={sort}
              onSortChange={setSort}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink-300 bg-surface mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-xs text-ink-500">
          <p>
            Data sources: Public market data (Yahoo Finance, companiesmarketcap.com), SEC filings, Crunchbase, Bloomberg, Reuters, company press releases.
            Valuations for private companies are estimates based on latest funding rounds.
          </p>
          <p className="mt-2">
            Built with React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Oxlint.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}