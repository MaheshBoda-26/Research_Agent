import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Company } from '../../data/companies';
import { formatNumber, formatCompactUSD } from '../../lib/format';
import { sectorColors } from '../../lib/colors';
import { sumBy } from '../../lib/aggregate';

interface Props {
  companies: Company[];
}

type Metric = 'count' | 'revenue' | 'marketCap';

interface SectorRow {
  sector: string;
  value: number;
}

const TICK = { fill: 'var(--color-ink-500)', fontSize: 11 };
const AXIS_STROKE = 'var(--color-ink-300)';
const TOOLTIP_STYLE = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-ink-300)',
  borderRadius: 6,
  fontSize: 12,
  color: 'var(--color-ink-700)',
} as const;

const METRIC_LABELS: Record<Metric, string> = {
  count: 'Company Count',
  revenue: 'Total Revenue',
  marketCap: 'Market Cap / Valuation',
};

const METRIC_FORMATTERS: Record<Metric, (val: number) => string> = {
  count: (val) => `${formatNumber(val)} companies`,
  revenue: (val) => formatCompactUSD(val),
  marketCap: (val) => formatCompactUSD(val),
};

export function SectorBar({ companies }: Props) {
  const [metric, setMetric] = useState<Metric>('count');

  const data: SectorRow[] = useMemo(() => {
    if (metric === 'count') {
      const counts = new Map<string, number>();
      for (const c of companies) {
        counts.set(c.sector, (counts.get(c.sector) ?? 0) + 1);
      }
      return Array.from(counts, ([sector, count]) => ({ sector, value: count }))
        .sort((a, b) => b.value - a.value);
    }
    if (metric === 'revenue') {
      return sumBy(companies, (c) => c.sector, (c) => c.revenueUSD)
        .map(({ key, total }) => ({ sector: key, value: total }))
        .sort((a, b) => b.value - a.value);
    }
    // marketCap
    return sumBy(companies, (c) => c.sector, (c) => c.valuationOrMarketCapUSD)
      .map(({ key, total }) => ({ sector: key, value: total }))
      .sort((a, b) => b.value - a.value);
  }, [companies, metric]);

  const palette = sectorColors(data.length);

  return (
    <section aria-label={`Companies by sector - ${METRIC_LABELS[metric]}`}>
      <div className="bg-surface border border-ink-300 rounded-lg p-5 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-ink-900 mb-1">
              Sector Distribution
            </h2>
            <p className="text-xs text-ink-500">
              {METRIC_LABELS[metric]} across market sectors.
            </p>
          </div>
          <div className="flex gap-1" role="group" aria-label="Chart metric">
            {(['count', 'revenue', 'marketCap'] as Metric[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                aria-pressed={metric === m}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  metric === m
                    ? 'bg-accent text-white'
                    : 'bg-surface text-ink-700 hover:bg-surface-2 border border-ink-300'
                }`}
              >
                {m === 'count' ? 'Count' : m === 'revenue' ? 'Revenue' : 'Mkt Cap'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 32, bottom: 4, left: 8 }}
          >
            <XAxis
              type="number"
              stroke={AXIS_STROKE}
              tick={TICK}
              tickLine={false}
              axisLine={{ stroke: AXIS_STROKE }}
              allowDecimals={metric !== 'count'}
            />
            <YAxis
              type="category"
              dataKey="sector"
              stroke={AXIS_STROKE}
              tick={TICK}
              tickLine={false}
              axisLine={{ stroke: AXIS_STROKE }}
              width={130}
            />
            <Tooltip
              cursor={{ fill: 'var(--color-surface-2)' }}
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ color: 'var(--color-ink-900)' }}
              formatter={(value) => [
                METRIC_FORMATTERS[metric](Number(value)),
                METRIC_LABELS[metric],
              ]}
            />
            <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={26}>
              {data.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}