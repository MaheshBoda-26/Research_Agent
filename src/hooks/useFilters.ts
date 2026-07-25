import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Company } from '../data/companies';
import type { CompanyTier } from '../types/company';

export type StatusFilter = 'all' | 'public' | 'private';
export type SortField = 'rank' | 'name' | 'sector' | 'founded' | 'valuationOrMarketCapUSD' | 'revenueUSD' | 'fundingRaisedUSD' | 'employees';
export type SortDir = 'asc' | 'desc';

export interface FilterState {
  query: string;
  sectors: string[];
  regions: string[];
  status: StatusFilter;
  tiers: CompanyTier[];
}

export interface SortState {
  field: SortField;
  dir: SortDir;
}

const DEFAULT_FILTERS: FilterState = {
  query: '',
  sectors: [],
  regions: [],
  status: 'all',
  tiers: [],
};

/** Parse filter state from the URL search params (so filters are shareable). */
export function filtersFromParams(params: URLSearchParams): FilterState {
  const q = params.get('q') ?? '';
  const sectors = params.get('sectors')?.split(',').filter(Boolean) ?? [];
  const regions = params.get('regions')?.split(',').filter(Boolean) ?? [];
  const status = (params.get('status') as StatusFilter) ?? 'all';
  const tiers = params.get('tiers')?.split(',').filter(Boolean) as CompanyTier[] ?? [];
  return { query: q, sectors, regions, status, tiers };
}

export function filtersToParams(f: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (f.query) params.set('q', f.query);
  if (f.sectors.length) params.set('sectors', f.sectors.join(','));
  if (f.regions.length) params.set('regions', f.regions.join(','));
  if (f.status !== 'all') params.set('status', f.status);
  if (f.tiers.length) params.set('tiers', f.tiers.join(','));
  return params;
}

export function applyFilters(companies: Company[], f: FilterState): Company[] {
  const q = f.query.trim().toLowerCase();
  return companies.filter((c) => {
    if (f.status !== 'all' && c.status.toLowerCase() !== f.status) return false;
    if (f.sectors.length > 0 && !f.sectors.includes(c.sector)) return false;
    if (f.regions.length > 0 && !f.regions.includes(c.region)) return false;
    if (f.tiers.length > 0 && !f.tiers.includes(c.tier)) return false;
    if (q) {
      const haystack = `${c.name} ${c.subsector} ${c.sector} ${c.hqCity} ${c.hqCountry} ${c.oneLineDescription}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function sortCompanies(companies: Company[], sort: SortState): Company[] {
  const { field, dir } = sort;
  const factor = dir === 'asc' ? 1 : -1;
  return [...companies].sort((a, b) => {
    let av: string | number | null | undefined = a[field as keyof Company];
    let bv: string | number | null | undefined = b[field as keyof Company];

    if (field === 'revenueUSD') {
      av = a.status === 'Public' ? (a.revenueUSD ?? 0) : (a.fundingRaisedUSD ?? 0);
      bv = b.status === 'Public' ? (b.revenueUSD ?? 0) : (b.fundingRaisedUSD ?? 0);
    }

    if (av === null && bv === null) return 0;
    if (av === null) return 1; // nulls sort last regardless of dir
    if (bv === null) return -1;
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor;
    return String(av).localeCompare(String(bv)) * factor;
  });
}

/** Hook: filter state synced to the URL. */
export function useUrlFilters() {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => filtersFromParams(params), [params]);

  const update = useCallback(
    (patch: Partial<FilterState>) => {
      const next = { ...DEFAULT_FILTERS, ...filters, ...patch };
      setParams(filtersToParams(next), { replace: true });
    },
    [filters, setParams],
  );

  const reset = useCallback(() => setParams({}, { replace: true }), [setParams]);

  return { filters, update, reset };
}

/** Toggle a value in/out of an array — used for multi-select chips. */
export function toggle<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}