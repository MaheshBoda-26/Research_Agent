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
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="relative w-full max-w-lg bg-surface border-l border-white/10 shadow-2xl flex flex-col h-full z-10 animate-slideLeft">
        {/* Top Bar / Header */}
        <div className="p-6 border-b border-white/10 bg-surface-2/60 flex items-start justify-between">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-accent-050 text-accent border border-accent/30">
                Rank #{company.rank}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                  isPublic
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}
              >
                {company.status}
              </span>
              {company.ticker && (
                <span className="text-xs font-mono text-ink-500 bg-white/5 px-2 py-0.5 rounded">
                  ${company.ticker}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold font-display text-ink-900 mt-2">{company.name}</h2>
            <p className="text-xs text-accent font-medium">{company.sector} · {company.subsector}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-ink-500 hover:text-ink-900 hover:bg-white/10 transition-colors"
            aria-label="Close drawer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Description */}
          <div className="bg-surface-2/40 border border-white/5 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Overview</h3>
            <p className="text-sm text-ink-700 leading-relaxed">{company.oneLineDescription}</p>
          </div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-panel p-4 rounded-xl space-y-1">
              <span className="text-xs text-ink-500 block">Valuation / Market Cap</span>
              <span className="text-lg font-bold font-mono text-accent">
                {formatCompactUSD(company.valuationOrMarketCapUSD)}
              </span>
            </div>

            <div className="glass-panel p-4 rounded-xl space-y-1">
              <span className="text-xs text-ink-500 block">
                {isPublic ? 'Annual Revenue' : 'Funding Raised'}
              </span>
              <span className="text-lg font-bold font-mono text-ink-900">
                {isPublic
                  ? formatCompactUSD(company.revenueUSD)
                  : formatCompactUSD(company.fundingRaisedUSD)}
              </span>
            </div>

            <div className="glass-panel p-4 rounded-xl space-y-1">
              <span className="text-xs text-ink-500 block">Employees</span>
              <span className="text-sm font-semibold font-mono text-ink-900">
                {formatCompact(company.employees)}
              </span>
            </div>

            <div className="glass-panel p-4 rounded-xl space-y-1">
              <span className="text-xs text-ink-500 block">Founded</span>
              <span className="text-sm font-semibold font-mono text-ink-900">
                {formatNumber(company.founded)}
              </span>
            </div>
          </div>

          {/* Geography & HQ */}
          <div className="glass-panel p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-semibold text-ink-500 uppercase tracking-wider">Headquarters & Region</h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">Location:</span>
              <span className="font-medium text-ink-900">{company.hqCity}, {company.hqCountry}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-500">Global Region:</span>
              <span className="font-medium text-ink-900">{company.region}</span>
            </div>
          </div>

          {/* Attribution & As Of */}
          <div className="text-xs text-ink-500 bg-white/5 p-4 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span>Data Source:</span>
              <span className="text-ink-700 font-mono">{company.dataSource}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Snapshot Date:</span>
              <span className="text-ink-700 font-mono">{company.asOfDate}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/10 bg-surface-2/80 flex items-center gap-3">
          {onCompareToggle && (
            <button
              onClick={() => onCompareToggle(company)}
              className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                isComparing
                  ? 'bg-neon-magenta/20 text-neon-magenta border border-neon-magenta/40 hover:bg-neon-magenta/30'
                  : 'bg-white/10 text-ink-900 border border-white/10 hover:bg-white/20'
              }`}
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
            className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm bg-accent text-canvas hover:bg-accent-hover transition-colors flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
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
