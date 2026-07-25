import type { Company } from '../data/companies';
import { sum } from './format';

/** Group by a key and count, sorted descending by count. */
export function countBy<T>(items: T[], key: (item: T) => string): { key: string; count: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([k, count]) => ({ key: k, count }))
    .sort((a, b) => b.count - a.count);
}

/** Group by a key and sum a numeric field, sorted descending by sum. */
export function sumBy<T>(
  items: T[],
  key: (item: T) => string,
  value: (item: T) => number | null,
): { key: string; total: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const v = value(item);
    if (v === null) continue;
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + v);
  }
  return [...map.entries()]
    .map(([k, total]) => ({ key: k, total }))
    .sort((a, b) => b.total - a.total);
}

/** Unique values, preserving first-seen order. */
export function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

/** Total valuation/market cap across a set of companies (null-safe). */
export function totalCapital(companies: Company[]): number {
  return sum(companies.map((c) => c.valuationOrMarketCapUSD).filter((v): v is number => v !== null));
}

/** Total revenue across companies (null-safe). */
export function totalRevenue(companies: Company[]): number {
  return sum(companies.map((c) => c.revenueUSD).filter((v): v is number => v !== null));
}

/** Total funding raised across private companies (null-safe). */
export function totalFunding(companies: Company[]): number {
  return sum(
    companies
      .filter((c) => c.status === 'Private')
      .map((c) => c.fundingRaisedUSD)
      .filter((v): v is number => v !== null),
  );
}

export interface KpiSnapshot {
  companyCount: number;
  totalCapital: number;
  totalRevenue: number;
  totalFunding: number;
  countryCount: number;
  publicCount: number;
  privateCount: number;
  medianFounded: number | null;
  topSector: { sector: string; count: number } | null;
  tierCounts: Record<string, number>;
}

export function computeKpis(companies: Company[]): KpiSnapshot {
  const founded = companies.map((c) => c.founded).filter((v): v is number => v !== null);
  founded.sort((a, b) => a - b);
  let medianFounded: number | null = null;
  if (founded.length > 0) {
    const mid = Math.floor(founded.length / 2);
    medianFounded = founded.length % 2 !== 0 ? founded[mid] : founded[mid - 1];
  }

  const sectorCounts = countBy(companies, (c) => c.sector);
  const tierCounts: Record<string, number> = {};
  for (const c of companies) {
    tierCounts[c.tier] = (tierCounts[c.tier] ?? 0) + 1;
  }

  return {
    companyCount: companies.length,
    totalCapital: totalCapital(companies),
    totalRevenue: totalRevenue(companies),
    totalFunding: totalFunding(companies),
    countryCount: unique(companies.map((c) => c.hqCountry)).length,
    publicCount: companies.filter((c) => c.status === 'Public').length,
    privateCount: companies.filter((c) => c.status === 'Private').length,
    medianFounded,
    topSector: sectorCounts.length > 0 ? { sector: sectorCounts[0].key, count: sectorCounts[0].count } : null,
    tierCounts,
  };
}