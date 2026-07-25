import { useEffect } from 'react';
import type { Company } from '../types/company';
import { formatCompactUSD, formatCompact, formatNumber } from '../lib/format';

interface CompanyDrawerProps {
  company: Company | null;
  onClose: () => void;
  onCompareToggle?: (company: Company) => void;
  isComparing?: boolean;
}

export function CompanyDrawer({
  company,
  onClose,
  onCompareToggle,
  isComparing = false,
}: CompanyDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (company) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [company, onClose]);

  if (!company) return null;

  const isPublic = company.status === 'Public';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-canvas/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-lg bg-surface border-l border-white/10 shadow-2xl flex flex-col h-full z-10 animate-slideLeft">
        {/* Top Bar / Header */}
        <div className="p-6 border-b border-white/10 bg-surface-2/60 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 pr-4 relative z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-accent-050 text-accent border border-accent/30 shadow-[0_0_10px_oklch(0.72_0.19_220/0.1)]">
                Rank #{company.rank}
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                  isPublic
                    ? 'bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/30 shadow-[0_0_10px_oklch(0.75_0.20_155/0.2)]'
                    : 'bg-neon-amber/10 text-neon-amber border border-neon-amber/30 shadow-[0_0_10px_oklch(0.78_0.18_75/0.2)]'
                }`}
              >
                {company.status}
              </span>
              {company.ticker && (
                <span className="text-xs font-mono text-ink-500 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                  ${company.ticker}
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold font-display text-ink-900 mt-2 tracking-tight">{company.name}</h2>
            <p className="text-sm text-accent font-semibold">{company.sector} <span className="text-ink-500 font-normal">·</span> {company.subsector}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-white/10 transition-colors relative z-10 bg-surface-2 border border-white/5"
            aria-label="Close drawer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 stagger-children">
          {/* Description */}
          <div className="bg-surface-2/40 border border-white/5 rounded-2xl p-5 animate-fadeInUp">
            <h3 className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Company Overview
            </h3>
            <p className="text-sm text-ink-700 leading-relaxed">{company.oneLineDescription}</p>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-5 rounded-2xl space-y-1.5 animate-fadeInUp" style={{ animationDelay: '100ms' }}>
              <span className="text-[10px] text-ink-500 block uppercase tracking-wider font-semibold">Valuation / Market Cap</span>
              <span className="text-2xl font-bold font-mono text-accent">
                {formatCompactUSD(company.valuationOrMarketCapUSD)}
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl space-y-1.5 animate-fadeInUp" style={{ animationDelay: '150ms' }}>
              <span className="text-[10px] text-ink-500 block uppercase tracking-wider font-semibold">
                {isPublic ? 'Annual Revenue' : 'Funding Raised'}
              </span>
              <span className="text-2xl font-bold font-mono text-ink-900">
                {isPublic
                  ? formatCompactUSD(company.revenueUSD)
                  : formatCompactUSD(company.fundingRaisedUSD)}
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl space-y-1.5 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
              <span className="text-[10px] text-ink-500 block uppercase tracking-wider font-semibold">Global Workforce</span>
              <span className="text-lg font-bold font-mono text-ink-900">
                {formatCompact(company.employees)}
              </span>
            </div>

            <div className="glass-panel p-5 rounded-2xl space-y-1.5 animate-fadeInUp" style={{ animationDelay: '250ms' }}>
              <span className="text-[10px] text-ink-500 block uppercase tracking-wider font-semibold">Founded Year</span>
              <span className="text-lg font-bold font-mono text-ink-900">
                {formatNumber(company.founded)}
              </span>
            </div>
          </div>

          {/* Geography & HQ */}
          <div className="glass-panel p-5 rounded-2xl space-y-4 animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <h3 className="text-xs font-bold text-ink-500 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-magenta" />
              Headquarters & Region
            </h3>
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-sm pb-3 border-b border-white/5">
                <span className="text-ink-500 font-medium">Location:</span>
                <span className="font-bold text-ink-900">{company.hqCity}, {company.hqCountry}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500 font-medium">Global Region:</span>
                <span className="font-bold text-ink-900 bg-white/5 px-2 py-0.5 rounded">{company.region}</span>
              </div>
            </div>
          </div>

          {/* Attribution & As Of */}
          <div className="text-xs text-ink-500 bg-surface-2/30 border border-white/5 p-4 rounded-xl space-y-2 animate-fadeInUp" style={{ animationDelay: '350ms' }}>
            <div className="flex items-center justify-between">
              <span>Data Source:</span>
              <span className="text-ink-700 font-mono font-medium">{company.dataSource}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Snapshot Date:</span>
              <span className="text-ink-700 font-mono font-medium bg-white/5 px-1.5 rounded">{company.asOfDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-surface/90 backdrop-blur-xl flex items-center gap-3">
          {onCompareToggle && (
            <button
              onClick={() => onCompareToggle(company)}
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                isComparing
                  ? 'bg-neon-magenta/15 text-neon-magenta border border-neon-magenta/40 hover:bg-neon-magenta/25 shadow-[0_0_15px_oklch(0.68_0.24_315/0.2)]'
                  : 'bg-surface-2 text-ink-900 border border-white/10 hover:bg-white/10 hover:border-white/20'
              } chip-transition`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {isComparing ? 'Remove from Compare' : 'Add to Compare'}
            </button>
          )}

          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-3 rounded-xl font-bold text-sm bg-accent text-canvas hover:bg-accent-hover transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_oklch(0.72_0.19_220/0.4)] hover:shadow-[0_0_25px_oklch(0.72_0.19_220/0.6)] chip-transition"
          >
            Visit Website
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
