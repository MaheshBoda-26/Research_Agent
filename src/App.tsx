import { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { companies } from './data/companies';
import { FilterBar } from './components/FilterBar';
import { CompanyDirectory } from './components/CompanyDirectory';
import { KpiStrip } from './components/KpiStrip';
import { SectorBar } from './components/charts/SectorBar';
import { HeroCanvas } from './components/HeroCanvas';
import { CompanyDrawer } from './components/CompanyDrawer';
import { CompareDrawer } from './components/CompareDrawer';
import { applyFilters, sortCompanies, useUrlFilters, type SortState } from './hooks/useFilters';
import { computeKpis } from './lib/aggregate';
import type { Company } from './types/company';

function Dashboard() {
  const { filters, update, reset } = useUrlFilters();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [comparingCompanies, setComparingCompanies] = useState<Company[]>([]);

  const filteredCompanies = useMemo(() => applyFilters(companies, filters), [filters]);

  const [sort, setSort] = useState<SortState>({ field: 'rank', dir: 'asc' });

  const sortedCompanies = useMemo(
    () => sortCompanies(filteredCompanies, sort),
    [filteredCompanies, sort]
  );

  const kpis = useMemo(() => computeKpis(filteredCompanies), [filteredCompanies]);

  const handleToggleCompare = (company: Company) => {
    setComparingCompanies((prev) => {
      const exists = prev.some((c) => c.name === company.name);
      if (exists) {
        return prev.filter((c) => c.name !== company.name);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), company];
      }
      return [...prev, company];
    });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink-700 selection:bg-accent selection:text-canvas relative overflow-hidden">
      {/* Header Hero Section */}
      <header className="relative border-b border-white/10 glass-panel sticky top-0 z-30">
        <HeroCanvas />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-accent bg-accent-050 px-2.5 py-0.5 rounded-full border border-accent/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  Live Intelligence
                </span>
                <span className="text-xs text-ink-500 font-mono">Dataset 2026-07-01</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-ink-900 tracking-tight">
                Top 100 AI Companies <span className="text-accent">&</span> Market Radar
              </h1>
              <p className="text-xs sm:text-sm text-ink-500 max-w-2xl">
                Tracking market cap, revenue, funding, status, and sector breakdown for {companies.length} verified AI industry leaders.
              </p>
            </div>

            {/* Quick Stat Pill Header */}
            <div className="flex items-center gap-3">
              <div className="glass-panel px-4 py-2 rounded-xl text-right">
                <span className="text-[10px] text-ink-500 uppercase tracking-wider block">Total Market Value</span>
                <span className="text-sm font-bold font-mono text-accent">
                  ${(kpis.totalCapital / 1e12).toFixed(2)}T
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto hidden lg:block">
            <FilterBar
              filters={filters}
              filteredCount={filteredCompanies.length}
              totalCount={companies.length}
              onChange={update}
              onReset={reset}
            />
          </aside>

          {/* Mobile Filter Collapsible */}
          <div className="lg:hidden">
            <FilterBar
              filters={filters}
              filteredCount={filteredCompanies.length}
              totalCount={companies.length}
              onChange={update}
              onReset={reset}
            />
          </div>

          {/* Core Content Feed */}
          <div className="space-y-8 mt-6 lg:mt-0">
            {/* KPI Cards Strip */}
            <KpiStrip kpis={kpis} />

            {/* Sector Analytics Grid */}
            <SectorBar companies={filteredCompanies} />

            {/* Main Company Directory Table / Grid */}
            <CompanyDirectory
              companies={sortedCompanies}
              sort={sort}
              onSortChange={setSort}
              onSelectCompany={setSelectedCompany}
              comparingCompanies={comparingCompanies}
              onToggleCompare={handleToggleCompare}
              searchQuery={filters.query}
            />
          </div>
        </div>
      </main>

      {/* Company Detail Drawer */}
      <CompanyDrawer
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onCompareToggle={handleToggleCompare}
        isComparing={
          selectedCompany ? comparingCompanies.some((c) => c.name === selectedCompany.name) : false
        }
      />

      {/* Floating Comparison Drawer */}
      <CompareDrawer
        comparingCompanies={comparingCompanies}
        onRemove={(name) => setComparingCompanies((prev) => prev.filter((c) => c.name !== name))}
        onClear={() => setComparingCompanies([])}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 glass-panel mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-xs text-ink-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            Data Sources: Yahoo Finance, SEC filings, Crunchbase, Bloomberg, Reuters. Valuations post-money estimates.
          </p>
          <p className="font-mono text-ink-700">
            Designed with <span className="text-accent">OKLCH Dark Theme</span> · React 19 + Tailwind v4 + Recharts
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