# Component Build Contract — Top 100 AI Companies Dashboard

All chart/table components receive **already-filtered** `Company[]` data.
They are presentational — no filter logic inside. Use Recharts for charts.

## Shared types & imports
```ts
import type { Company } from '../../data/companies';
import { formatCompactUSD, formatNumber, formatYear } from '../../lib/format';
import { colorForCategory, sectorColors, statusColor } from '../../lib/colors';
```

## Company shape
```ts
interface Company {
  rank: number; name: string; sector: string; subsector: string;
  hqCity: string; hqCountry: string; region: string;
  founded: number | null; fundingRaisedUSD: number | null; valuationUSD: number | null;
  employees: number | null; status: 'public' | 'private'; ticker: string | null;
  oneLineDescription: string; website: string; dataSource: string; valuationIsEstimate?: boolean;
}
```

## Design rules (MUST follow)
- Tailwind classes only. Use tokens: `bg-canvas`, `bg-surface`, `text-ink-700`, `border-ink-300`, `text-accent`.
- NO purple/indigo/violet. NO gradient text. NO `rounded-2xl` everywhere.
- WCAG 2.1 AA: text contrast ≥4.5:1, keyboard-accessible, ARIA labels on charts.
- Chart container: `className="bg-surface border border-ink-300 rounded-lg p-5"`.
- Each chart wrapped in a `<section aria-label="...">`.
- Recharts `Tooltip` styled with `contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-ink-300)', borderRadius: 6, fontSize: 12 }}`.
- Responsive: use `ResponsiveContainer width="100%" height={...}`.
- Numbers use `className="tnum"` (tabular-nums).

## Recharts v3 note
Recharts 3.x works like 2.x for our needs. Import from 'recharts':
`BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Treemap, PieChart, Pie, Legend`.
