import { useMemo, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { companies } from './data/companies';
import { FilterBar } from './components/FilterBar';
import { KpiStrip } from './components/KpiStrip';
import { CompanyDrawer } from './components/CompanyDrawer';
import { CompareDrawer } from './components/CompareDrawer';
import { applyFilters, sortCompanies, useUrlFilters, type SortState } from './hooks/useFilters';
import { computeKpis } from './lib/aggregate';
import type { Company } from './types/company';
import { AnimatedGridPattern } from './components/animations/AnimatedGridPattern';
// Dynamically import heavy components
const LightPillar = lazy(() => import('./components/animations/LightPillar'));
const SectorBar = lazy(() => import('./components/charts/SectorBar'));
const HeroCanvas = lazy(() => import('./components/HeroCanvas'));
const CompanyDirectory = lazy(() => import('./components/CompanyDirectory'));
const AgentMode = lazy(() => import('./pages/AgentMode').then((m) => ({ default: m.AgentMode })));

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
      {/* ── Futuristic Animated Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Suspense fallback={<div className="w-full h-full bg-gradient-to-b from-orange-500/10 to-blue-500/10" />}>
          <LightPillar
            topColor="#F97316"
            bottomColor="#2563EB"
            intensity={1.0}
            rotationSpeed={0.2}
            glowAmount={0.005}
            pillarWidth={3.0}
            pillarHeight={0.4}
            noiseIntensity={0.5}
            pillarRotation={45}
            interactive={false}
            mixBlendMode="screen"
          />
        </Suspense>
      </div>
      <AnimatedGridPattern 
        className="text-accent/20"
        numSquares={150} 
        duration={5} 
        width={80} 
        height={80} 
      />

      {/* ── Header Hero Section ── */}
      <header className="relative border-b border-white/8 glass-panel sticky top-0 z-30">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-blue-500/10" />}>
          <HeroCanvas />
        </Suspense>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fadeInDown">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-accent bg-accent-050 px-2.5 py-1 rounded-full border border-accent/30 flex items-center gap-1.5 shadow-sm shadow-accent/10">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  Live Intelligence
                </span>
                <span className="text-xs text-ink-500 font-mono bg-white/5 px-2 py-0.5 rounded-md">
                  Dataset 2026-07-01
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-ink-900 tracking-tight">
                Top 100 AI Companies{' '}
                <span className="gradient-text">&amp;</span>{' '}
                Market Radar
              </h1>
              <p className="text-xs sm:text-sm text-ink-500 max-w-2xl leading-relaxed">
                Tracking market cap, revenue, funding, status, and sector breakdown for{' '}
                <span className="font-mono font-semibold text-accent">{companies.length}</span>{' '}
                verified AI industry leaders.
              </p>
            </div>

            {/* Quick Stat Pill Header */}
            <div className="flex items-center gap-3">
              <div className="glass-panel px-5 py-3 rounded-xl text-right glow-ring">
                <span className="text-[10px] text-ink-500 uppercase tracking-wider block font-semibold">
                  Total Market Value
                </span>
                <span className="text-base font-bold font-mono text-accent">
                  ${(kpis.totalCapital / 1e12).toFixed(2)}T
                </span>
              </div>
              <Link
                to="/agent"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold font-display uppercase tracking-wider text-accent bg-accent-050 border border-accent/30 hover:bg-accent/20 hover:shadow-[0_0_15px_oklch(0.72_0.19_220/0.3)] transition-all chip-transition"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Agent Mode
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Layout ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 relative z-10">
        <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-6">
          {/* Sidebar Filters */}
          <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto hidden lg:block animate-fadeInUp" style={{ animationDelay: '100ms' }}>
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
          <div className="space-y-6 mt-6 lg:mt-0">
            {/* KPI Cards Strip */}
            <KpiStrip kpis={kpis} />

            {/* Sector Analytics Grid */}
            <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
              <Suspense fallback={<div className="glass-panel rounded-xl p-5 shadow-xl h-[320px] flex items-center justify-center">
                <div className="animate-pulse text-ink-500">Loading analytics...</div>
              </div>}>
                <SectorBar companies={filteredCompanies} />
              </Suspense>
            </div>

            {/* Main Company Directory Table / Grid */}
            <div className="animate-fadeInUp" style={{ animationDelay: '400ms' }}>
              <Suspense fallback={<div className="glass-panel rounded-xl p-5 shadow-xl h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-ink-500">Loading directory...</div>
              </div>}>
                <CompanyDirectory
                  companies={sortedCompanies}
                  sort={sort}
                  onSortChange={setSort}
                  onSelectCompany={setSelectedCompany}
                  comparingCompanies={comparingCompanies}
                  onToggleCompare={handleToggleCompare}
                  searchQuery={filters.query}
                />
              </Suspense>
            </div>
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

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 glass-panel mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-xs text-ink-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            Data Sources: Yahoo Finance, SEC filings, Crunchbase, Bloomberg, Reuters. Valuations post-money estimates.
          </p>
          <p className="font-mono text-ink-700 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Designed with <span className="text-accent font-semibold">OKLCH Dark Theme</span> · React 19 + Tailwind v4 + Recharts
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
        <Route
          path="/agent"
          element={
            <Suspense fallback={
              <div className="min-h-screen bg-canvas flex items-center justify-center">
                <div className="glass-panel rounded-xl p-6 space-y-3 w-80">
                  <div className="shimmer h-4 rounded" />
                  <div className="shimmer h-4 rounded w-3/4" />
                  <div className="shimmer h-20 rounded" />
                </div>
              </div>
            }>
              <AgentMode />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}