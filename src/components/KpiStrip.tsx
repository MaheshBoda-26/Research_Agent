import { formatCompactUSD } from '../lib/format';
import type { KpiSnapshot } from '../lib/aggregate';

interface Props {
  kpis: KpiSnapshot;
}

const tileBase = 'bg-surface border border-ink-300 rounded-lg p-4 min-w-0';

export function KpiStrip({ kpis }: Props) {
  return (
    <section aria-label="Key metrics" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {/* 1 — Companies tracked (plain count) */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900 tnum">{kpis.companyCount}</div>
        <div className="mt-1 text-xs text-ink-500">Companies tracked</div>
      </div>

      {/* 2 — Total capital (headline figure, accent tint) */}
      <div className={[tileBase, 'bg-accent-050 border-accent/30'].join(' ')}>
        <div className="text-2xl font-semibold text-ink-900 tnum">{formatCompactUSD(kpis.totalCapital)}</div>
        <div className="mt-1 text-xs text-ink-500">Combined market cap & valuation estimates</div>
      </div>

      {/* 3 — Total Revenue */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900 tnum">{formatCompactUSD(kpis.totalRevenue)}</div>
        <div className="mt-1 text-xs text-ink-500">Total revenue</div>
      </div>

      {/* 4 — Total funding raised */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900 tnum">{formatCompactUSD(kpis.totalFunding)}</div>
        <div className="mt-1 text-xs text-ink-500">Total venture funding raised (private)</div>
      </div>

      {/* 5 — Countries */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900 tnum">{kpis.countryCount}</div>
        <div className="mt-1 text-xs text-ink-500">Headquarters countries</div>
      </div>

      {/* 6 — Median founded */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900 tnum">{kpis.medianFounded ?? '—'}</div>
        <div className="mt-1 text-xs text-ink-500">Median founding year</div>
      </div>

      {/* 7 — Public count */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900 tnum">{kpis.publicCount}</div>
        <div className="mt-1 text-xs text-ink-500">Public companies</div>
      </div>

      {/* 8 — Private count */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900 tnum">{kpis.privateCount}</div>
        <div className="mt-1 text-xs text-ink-500">Private companies</div>
      </div>

      {/* 9 — Top sector */}
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

      {/* 10 — Top tier */}
      <div className={tileBase}>
        <div className="text-2xl font-semibold text-ink-900">
          {Object.entries(kpis.tierCounts).length > 0 ? (
            <span className="block truncate" title={Object.entries(kpis.tierCounts).sort((a, b) => b[1] - a[1])[0][0]}>
              {Object.entries(kpis.tierCounts).sort((a, b) => b[1] - a[1])[0][0].replace('-', ' ')}
              <span className="tnum text-ink-500">· {Object.entries(kpis.tierCounts).sort((a, b) => b[1] - a[1])[0][1]}</span>
            </span>
          ) : (
            '—'
          )}
        </div>
        <div className="mt-1 text-xs text-ink-500">Largest tier</div>
      </div>
    </section>
  );
}