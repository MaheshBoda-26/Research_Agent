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
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[90%] glass-panel rounded-2xl p-4 shadow-2xl border border-accent/40 flex items-center justify-between gap-4 animate-bounceIn">
        <div className="flex items-center gap-3 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-accent uppercase tracking-wider whitespace-nowrap">
            Comparing ({comparingCompanies.length}/4):
          </span>
          <div className="flex items-center gap-2">
            {comparingCompanies.map((c) => (
              <span
                key={c.name}
                className="text-xs font-medium text-ink-900 bg-surface-2/80 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 whitespace-nowrap"
              >
                {c.name}
                <button
                  onClick={() => onRemove(c.name)}
                  className="text-ink-500 hover:text-red-400 transition-colors"
                  aria-label={`Remove ${c.name}`}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-accent text-canvas hover:bg-accent-hover transition-colors shadow-md"
          >
            Compare View
          </button>
          <button
            onClick={onClear}
            className="px-2.5 py-1.5 rounded-lg text-xs text-ink-500 hover:text-ink-900 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Full Compare Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div className="relative w-full max-w-5xl bg-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-bold font-display text-ink-900">Side-by-Side Comparison</h2>
                <p className="text-xs text-ink-500">Comparing metrics across {comparingCompanies.length} companies.</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg text-ink-500 hover:text-ink-900 hover:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-3 text-xs text-ink-500 font-semibold uppercase">Metric</th>
                    {comparingCompanies.map((c) => (
                      <th key={c.name} className="p-3 min-w-[180px]">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink-900">{c.name}</span>
                          <button
                            onClick={() => onRemove(c.name)}
                            className="text-xs text-ink-500 hover:text-red-400"
                          >
                            Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono text-xs">
                  <tr>
                    <td className="p-3 font-sans font-medium text-ink-500">Rank</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-3 text-accent font-bold">#{c.rank}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-ink-500">Status</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-3 font-sans">{c.status}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-ink-500">Valuation / Market Cap</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-3 text-emerald-400 font-semibold">{formatCompactUSD(c.valuationOrMarketCapUSD)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-ink-500">Revenue / Funding</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-3 text-ink-900">
                        {c.status === 'Public'
                          ? formatCompactUSD(c.revenueUSD)
                          : formatCompactUSD(c.fundingRaisedUSD)}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-ink-500">Employees</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-3 text-ink-700">{formatCompact(c.employees)}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-ink-500">Sector</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-3 font-sans text-ink-700">{c.sector}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-medium text-ink-500">HQ Location</td>
                    {comparingCompanies.map((c) => (
                      <td key={c.name} className="p-3 font-sans text-ink-700">{c.hqCity}, {c.hqCountry}</td>
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
