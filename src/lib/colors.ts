/**
 * Color helpers. Pulls the OKLCH categorical palette from CSS variables so
 * charts and UI stay in sync with the token layer.
 */

const CSS_VARS = [
  '--color-cat-0',
  '--color-cat-1',
  '--color-cat-2',
  '--color-cat-3',
  '--color-cat-4',
  '--color-cat-5',
  '--color-cat-6',
  '--color-cat-7',
  '--color-cat-8',
];

function readVar(name: string): string {
  if (typeof window === 'undefined') return '#0e7490';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#0e7490';
}

/** Deterministic color for a category string. Stable across renders. */
export function colorForCategory(category: string, index: number): string {
  const palette = CSS_VARS.map(readVar);
  return palette[index % palette.length];
}

export function sectorColors(count: number): string[] {
  const palette = CSS_VARS.map(readVar);
  return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
}

export function statusColor(status: 'public' | 'private'): string {
  return readVar(status === 'public' ? '--color-public' : '--color-private');
}
