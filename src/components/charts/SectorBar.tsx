import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { Company } from '../../types/company';
import { formatCompactUSD } from '../../lib/format';

interface SectorBarProps {
  companies: Company[];
}

type MetricType = 'count' | 'marketCap' | 'revenue' | 'funding';

const CATEGORICAL_COLORS = [
  'oklch(0.72 0.19 220)', // Cyan
  'oklch(0.68 0.24 315)', // Magenta
  'oklch(0.75 0.20 155)', // Emerald
  'oklch(0.78 0.18 75)',  // Amber
  'oklch(0.65 0.22 285)', // Violet
  'oklch(0.72 0.18 190)', // Azure
  'oklch(0.70 0.22 340)', // Rose
  'oklch(0.74 0.19 130)', // Lime
  'oklch(0.66 0.18 45)',  // Orange
];

export function SectorBar({ companies }: SectorBarProps) {
  const [metric, setMetric] = useState<MetricType>('marketCap');

  const chartData = useMemo(() => {
    const map = new Map<string, { count: number; marketCap: number; revenue: number; funding: number }>();

    for (const c of companies) {
      const current = map.get(c.sector) ?? { count: 0, marketCap: 0, revenue: 0, funding: 0 };
      current.count += 1;
      current.marketCap += c.valuationOrMarketCapUSD || 0;
      current.revenue += c.revenueUSD || 0;
      current.funding += c.fundingRaisedUSD || 0;
      map.set(c.sector, current);
    }

    return Array.from(map.entries())
      .map(([sector, values]) => ({
        sector,
        ...values,
      }))
      .sort((a, b) => b[metric] - a[metric]);
  }, [companies, metric]);

  const getMetricLabel = (m: MetricType) => {
    switch (m) {
      case 'count': return 'Firm Count';
      case 'marketCap': return 'Market Cap / Val';
      case 'revenue': return 'Total Revenue';
      case 'funding': return 'Venture Funding';
    }
  };

  const formatTooltipValue = (value: number) => {
    if (metric === 'count') return `${value} companies`;
    return formatCompactUSD(value);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-display text-ink-900">Sector Distribution</h2>
          <p className="text-xs text-ink-500">
            Breakdown across {chartData.length} active sectors.
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center gap-1 bg-surface-2/60 p-1 rounded-xl border border-white/5">
          {(['marketCap', 'revenue', 'funding', 'count'] as MetricType[]).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                metric === m
                  ? 'bg-accent text-canvas font-semibold shadow-md shadow-accent/20'
                  : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              {getMetricLabel(m)}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Bar Container */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 25 }}>
            <XAxis
              dataKey="sector"
              tick={{ fill: 'oklch(0.68 0.025 260)', fontSize: 10 }}
              interval={0}
              angle={-25}
              textAnchor="end"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'oklch(0.68 0.025 260)', fontSize: 10 }}
              tickFormatter={(v) => (metric === 'count' ? v : formatCompactUSD(v))}
              axisLine={false}
              tickLine={false}
              width={65}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass-panel p-3 rounded-xl border border-white/10 shadow-2xl text-xs space-y-1">
                      <div className="font-bold text-ink-900">{data.sector}</div>
                      <div className="text-accent font-mono">
                        {getMetricLabel(metric)}: <span className="font-bold">{formatTooltipValue(data[metric])}</span>
                      </div>
                      <div className="text-ink-500">
                        {data.count} firms in dataset
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey={metric} radius={[6, 6, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORICAL_COLORS[index % CATEGORICAL_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}