import { formatCompactUSD } from '../lib/format';
import type { KpiSnapshot } from '../lib/aggregate';

interface Props {
  kpis: KpiSnapshot;
}

const tileBase =
  'bg-surface border border-ink-300 rounded-lg p-4 min-w-0';

export function KpiStrip({ kpis }: Props) {
  return (
    <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {/* 1 — Companies tracked (plain count) */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900 tnum">{kpis.companyCount}</div>
        <div className="mt-1 text-xs text-ink-500">Companies tracked</div>
      </div>

      {/* 2 — Total capital (headline figure, accent tint) */}
      <div
        className={[
          tileBase,
          'lg:col-span-1 bg-accent-050 border-accent/30',
        ].join(' ')}
      >
        <div className="text-2xl font-semibold text-ink-900 tnum">
          {formatCompactUSD(kpis.totalCapital)}
        </div>
        <div className="mt-1 text-xs text-ink-500">Combined market cap &amp; valuation</div>
        <div className="mt-0.5 text-[11px] text-ink-500/80">estimates</div>
      </div>

      {/* 3 — Countries */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900 tnum">{kpis.countryCount}</div>
        <div className="mt-1 text-xs text-ink-500">Headquarters countries</div>
      </div>

      {/* 4 — Median founded */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900 tnum">
          {kpis.medianFounded ?? '—'}
        </div>
        <div className="mt-1 text-xs text-ink-500">Median founding year</div>
      </div>

      {/* 5 — Top sector */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900">
          {kpis.topSector ? (
            <span className="block truncate" title={`${kpis.topSector.sector} · ${kpis.topSector.count}`}>
              {kpis.topSector.sector} <span className="tnum text-ink-500">· {kpis.topSector.count}</span>
            </span>
          ) : (
            '—'
          )}
        </div>
        <div className="mt-1 text-xs text-ink-500">Largest sector</div>
      </div>
    </section>
  );
}
