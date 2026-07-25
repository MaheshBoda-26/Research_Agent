import { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import type { Company } from '../../types/company';

interface SectorBarProps {
  companies: Company[];
}

interface SectorData {
  sector: string;
  count: number;
  marketCap: number;
  revenue: number;
  funding: number;
}

const COLORS = [
  'oklch(0.72 0.19 220)', /* Cyan */
  'oklch(0.68 0.24 315)', /* Magenta */
  'oklch(0.75 0.20 155)', /* Emerald */
  'oklch(0.78 0.18 75)',  /* Amber */
  'oklch(0.65 0.22 285)', /* Violet */
  'oklch(0.72 0.18 190)', /* Azure */
  'oklch(0.70 0.22 340)', /* Rose */
  'oklch(0.74 0.19 130)', /* Lime */
  'oklch(0.66 0.18 45)',  /* Orange */
];

export function SectorBar({ companies }: SectorBarProps) {
  const data = useMemo(() => {
    const map = new Map<string, SectorData>();
    for (const c of companies) {
      const existing = map.get(c.sector) || {
        sector: c.sector,
        count: 0,
        marketCap: 0,
        revenue: 0,
        funding: 0,
      };
      existing.count += 1;
      existing.marketCap += c.valuationOrMarketCapUSD ?? 0;
      if (c.status === 'Public') {
        existing.revenue += c.revenueUSD ?? 0;
      } else {
        existing.funding += c.fundingRaisedUSD ?? 0;
      }
      map.set(c.sector, existing);
    }
    return Array.from(map.values()).sort((a, b) => b.marketCap - a.marketCap);
  }, [companies]);

  if (companies.length === 0) return null;

  return (
    <div className="glass-panel rounded-xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 border-b border-white/5 pb-3 relative z-10">
        <div>
          <h2 className="text-lg font-bold font-display text-ink-900 flex items-center gap-2">
            Sector Analytics
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          </h2>
          <p className="text-xs text-ink-500 mt-0.5">
            Market value distribution across top AI industry segments.
          </p>
        </div>
      </div>

      <div className="h-[320px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 15, right: 15, left: 15, bottom: 55 }}>
            <XAxis
              dataKey="sector"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'oklch(0.68 0.025 260)', fontSize: 10, fontFamily: 'Plus Jakarta Sans' }}
              dy={10}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis hide />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload as SectorData;
                return (
                  <div className="glass-panel rounded-xl p-4 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.5),0_0_15px_-5px_oklch(0.72_0.19_220/0.4)] border border-white/10 min-w-[200px] animate-scaleIn">
                    <div className="font-bold font-display text-ink-900 mb-2 pb-2 border-b border-white/10 flex items-center justify-between">
                      {d.sector}
                      <span className="text-[10px] font-mono bg-white/10 px-1.5 py-0.5 rounded">{d.count} firms</span>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-ink-500">Market Value</span>
                        <span className="font-mono font-bold text-accent">
                          ${(d.marketCap / 1e9).toFixed(1)}B
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-ink-500">Private Funding</span>
                        <span className="font-mono font-semibold text-ink-900">
                          ${(d.funding / 1e9).toFixed(1)}B
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-ink-500">Public Revenue</span>
                        <span className="font-mono font-semibold text-ink-900">
                          ${(d.revenue / 1e9).toFixed(1)}B
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar dataKey="marketCap" radius={[6, 6, 0, 0]} maxBarSize={60}>
              {data.map((_entry, index) => {
                const color = COLORS[index % COLORS.length];
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={color}
                    fillOpacity={0.8}
                    style={{
                      transition: 'all 0.3s ease',
                      filter: `drop-shadow(0 0 8px ${color.replace(')', ' / 0.4)')})`
                    }}
                    className="hover:opacity-100 hover:brightness-125 cursor-pointer"
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}