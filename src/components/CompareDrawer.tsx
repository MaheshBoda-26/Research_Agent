import { useState } from 'react';
import type { Company } from '../types/company';
import { formatCompactUSD, formatCompact } from '../lib/format';

interface CompareDrawerProps {
  comparingCompanies: Company[];
  onRemove: (companyId: string) => void;
  onClear: () => void;
}

export function CompareDrawer({ comparingCompanies, onRemove, onClear }: CompareDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (comparingCompanies.length === 0) return null;

  return (
    <>
      {/* Floating Bottom Bar Trigger */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[90%] glass-panel rounded-2xl p-4 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5),0_0_20px_-5px_oklch(0.72_0.19_220/0.3)] border border-accent/40 flex items-center justify-between gap-4 animate-bounceIn">
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <span className="text-xs font-bold text-accent uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            Compare ({comparingCompanies.length}/4)
          </span>
          <div className="flex items-center gap-2">
            {comparingCompanies.map((c, i) => (
              <span
                key={c.name}
                className="text-xs font-medium text-ink-900 bg-surface-2/90 px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2 whitespace-nowrap animate-scaleIn shadow-sm"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {c.name}
                <button
                  onClick={() => onRemove(c.name)}
                  className="text-ink-500 hover:text-red-400 hover:bg-white/10 p-0.5 rounded transition-colors"
                  aria-label={`Remove ${c.name}`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0 relative z-10 bg-canvas/40 backdrop-blur-md p-1 rounded-xl">
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-accent text-canvas hover:bg-accent-hover transition-all shadow-[0_0_15px_oklch(0.72_0.19_220/0.4)] hover:shadow-[0_0_20px_oklch(0.72_0.19_220/0.6)] chip-transition"
          >
            Compare View
          </button>
          <button
            onClick={onClear}
            className="px-3 py-2 rounded-lg text-xs font-medium text-ink-500 hover:text-ink-900 hover:bg-white/10 transition-colors chip-transition"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Full Compare Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-canvas/80 backdrop-blur-md animate-fadeIn"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-6xl glass-panel border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 p-0 animate-fadeInUp">
            
            {/* Modal Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/10 bg-surface-2/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-neon-magenta/5 pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold font-display text-ink-900 flex items-center gap-3">
                  Side-by-Side Analysis
                  <span className="text-xs font-mono font-medium bg-accent-050 text-accent px-2 py-0.5 rounded border border-accent/20">
                    {comparingCompanies.length} Firms
                  </span>
                </h2>
                <p className="text-sm text-ink-500 mt-1">Cross-referencing metrics, valuations, and sectors.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 rounded-xl text-ink-500 hover:text-ink-900 hover:bg-white/10 transition-colors relative z-10 bg-surface-2 border border-white/5"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto p-6 bg-surface/50">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-xs text-ink-500 font-bold uppercase tracking-wider w-40">Metric</th>
                    {comparingCompanies.map((c) => (
                      <th key={c.name} className="p-4 min-w-[220px] bg-surface-2/30 first-of-type:rounded-tl-xl last-of-type:rounded-tr-xl border-x border-white/5 relative group">
                        <div className="absolute inset-x-0 top-0 h-1 bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-extrabold font-display text-lg text-ink-900 block">{c.name}</span>
                            <span className="text-[10px] text-accent font-mono">#{c.rank} Global Rank</span>
                          </div>
                          <button
                            onClick={() => onRemove(c.name)}
                            className="p-1.5 rounded text-ink-500 hover:text-red-400 hover:bg-white/10 transition-colors"
                            title="Remove"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-sm">
                  
                  <tr className="row-hover-lift">
                    <td className="p-4 font-sans font-semibold text-ink-500">Status</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-4 font-sans border-x border-white/5 bg-surface-2/10">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          c.status === 'Public' ? 'bg-neon-emerald/10 text-neon-emerald' : 'bg-neon-amber/10 text-neon-amber'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="row-hover-lift">
                    <td className="p-4 font-sans font-semibold text-ink-500">Valuation / Cap</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-4 text-accent font-bold text-base border-x border-white/5 bg-surface-2/10">
                        {formatCompactUSD(c.valuationOrMarketCapUSD)}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="row-hover-lift">
                    <td className="p-4 font-sans font-semibold text-ink-500">Revenue / Funding</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-4 text-ink-900 font-bold border-x border-white/5 bg-surface-2/10">
                        {c.status === 'Public'
                          ? formatCompactUSD(c.revenueUSD)
                          : formatCompactUSD(c.fundingRaisedUSD)}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="row-hover-lift">
                    <td className="p-4 font-sans font-semibold text-ink-500">Employees</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-4 text-ink-700 font-bold border-x border-white/5 bg-surface-2/10">
                        {formatCompact(c.employees)}
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="row-hover-lift">
                    <td className="p-4 font-sans font-semibold text-ink-500">Sector</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-4 font-sans text-ink-900 font-medium border-x border-white/5 bg-surface-2/10">
                        {c.sector}
                        <span className="block text-[10px] text-ink-500 mt-0.5">{c.subsector}</span>
                      </td>
                    ))}
                  </tr>
                  
                  <tr className="row-hover-lift">
                    <td className="p-4 font-sans font-semibold text-ink-500">Location</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-4 font-sans text-ink-700 font-medium border-x border-white/5 bg-surface-2/10 rounded-b-xl">
                        {c.hqCity}, {c.hqCountry}
                      </td>
                    ))}
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
