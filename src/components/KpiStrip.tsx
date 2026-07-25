import type { KpiSnapshot } from '../lib/aggregate';
import { formatCompactUSD } from '../lib/format';

interface KpiStripProps {
  kpis: KpiSnapshot;
}

export function KpiStrip({ kpis }: KpiStripProps) {
  const publicPct = kpis.companyCount > 0 ? Math.round((kpis.publicCount / kpis.companyCount) * 100) : 0;
  const privatePct = 100 - publicPct;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Market Cap / Valuation */}
      <div className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all duration-300 pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
          <span className="font-medium uppercase tracking-wider">Total Market Cap / Val</span>
          <span className="p-1 rounded-md bg-accent/10 text-accent">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </span>
        </div>
        <div className="text-2xl font-bold font-mono text-accent tracking-tight">
          {formatCompactUSD(kpis.totalCapital)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-500 pt-2 border-t border-white/5">
          <span>Company Count:</span>
          <span className="font-mono text-ink-900 font-semibold">{kpis.companyCount} firms</span>
        </div>
      </div>

      {/* Total Revenue */}
      <div className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-emerald/10 rounded-full blur-2xl group-hover:bg-neon-emerald/20 transition-all duration-300 pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
          <span className="font-medium uppercase tracking-wider">Total Annual Revenue</span>
          <span className="p-1 rounded-md bg-neon-emerald/10 text-neon-emerald">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>
        <div className="text-2xl font-bold font-mono text-neon-emerald tracking-tight">
          {formatCompactUSD(kpis.totalRevenue)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-500 pt-2 border-t border-white/5">
          <span>Top Sector:</span>
          <span className="font-medium text-ink-900 truncate max-w-[120px]">
            {kpis.topSector ? kpis.topSector.sector : '—'}
          </span>
        </div>
      </div>

      {/* Venture Funding Raised */}
      <div className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-magenta/10 rounded-full blur-2xl group-hover:bg-neon-magenta/20 transition-all duration-300 pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
          <span className="font-medium uppercase tracking-wider">Venture Funding</span>
          <span className="p-1 rounded-md bg-neon-magenta/10 text-neon-magenta">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </span>
        </div>
        <div className="text-2xl font-bold font-mono text-neon-magenta tracking-tight">
          {formatCompactUSD(kpis.totalFunding)}
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-ink-500 pt-2 border-t border-white/5">
          <span>Countries Represented:</span>
          <span className="font-mono text-ink-900 font-semibold">{kpis.countryCount} countries</span>
        </div>
      </div>

      {/* Public vs Private Split */}
      <div className="glass-panel-interactive rounded-2xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-neon-amber/10 rounded-full blur-2xl group-hover:bg-neon-amber/20 transition-all duration-300 pointer-events-none" />
        <div className="flex items-center justify-between text-xs text-ink-500 mb-2">
          <span className="font-medium uppercase tracking-wider">Public vs Private</span>
          <span className="p-1 rounded-md bg-neon-amber/10 text-neon-amber">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            </svg>
          </span>
        </div>
        <div className="text-2xl font-bold font-mono text-ink-900 tracking-tight flex items-center gap-2">
          <span className="text-accent">{publicPct}%</span>
          <span className="text-xs text-ink-500 font-sans font-normal">Public</span>
          <span className="text-ink-500">/</span>
          <span className="text-neon-amber">{privatePct}%</span>
          <span className="text-xs text-ink-500 font-sans font-normal">Private</span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div style={{ width: `${publicPct}%` }} className="h-full bg-accent transition-all duration-500" />
          <div style={{ width: `${privatePct}%` }} className="h-full bg-neon-amber transition-all duration-500" />
        </div>
      </div>
    </div>
  );
}