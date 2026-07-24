import { useMemo } from 'react';
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
import { formatNumber } from '../../lib/format';
import { sectorColors } from '../../lib/colors';

interface Props {
  companies: Company[];
}

interface SectorRow {
  sector: string;
  count: number;
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

export function SectorBar({ companies }: Props) {
  const data: SectorRow[] = useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of companies) {
      counts.set(c.sector, (counts.get(c.sector) ?? 0) + 1);
    }
    return Array.from(counts, ([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count);
  }, [companies]);

  const palette = sectorColors(data.length);

  return (
    <section aria-label="Companies by sector">
      <div className="bg-surface border border-ink-300 rounded-lg p-5 h-full flex flex-col">
        <h2 className="text-sm font-semibold text-ink-900 mb-1">
          Companies by sector
        </h2>
        <p className="text-xs text-ink-500 mb-4">
          Distribution of the 100 companies across market sectors.
        </p>
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
              allowDecimals={false}
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
                `${formatNumber(Number(value))} companies`,
                'Count',
              ]}
            />
            <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={26}>
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
