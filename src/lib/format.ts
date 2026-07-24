/**
 * Formatting utilities — shared across charts, KPIs, and the table.
 * All money is sourced in USD.
 */

const THIN = '\u202f'; // narrow no-break space, groups thousands readably

export function formatUSD(value: number | null | undefined, digits = 0): string {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: value >= 1_000_000 ? 'compact' : 'standard',
    maximumFractionDigits: digits,
  });
}

/**
 * Compact money tuned for the AI sector's wide range ($100M → $3T).
 * 1_000_000_000 → "$1.0B", 3_200_000_000_000 → "$3.2T"
 */
export function formatCompactUSD(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000_000) return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  if (abs >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `$${(value / 1_000_000).toFixed(0)}M`;
  if (abs >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return value.toLocaleString('en-US').replace(/,/g, THIN);
}

/** Compact employee headcount: 1500000 → "1.5M" */
export function formatCompact(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(value);
}

export function formatYear(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return String(value);
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].filter((v): v is number => v !== null).sort((a, b) => a - b);
  if (sorted.length === 0) return null;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + (v || 0), 0);
}
