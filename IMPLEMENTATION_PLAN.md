# Implementation Plan — Fortune 500 & Big Tech Intelligence Dashboard

## Project Overview
Transform the existing "Top 100 AI Companies" dashboard into a **Fortune 500 & Big Tech Intelligence Dashboard** tracking Fortune 500 enterprises + leading AI companies (Amazon, Google/Alphabet, NVIDIA, Microsoft, Apple, Meta, OpenAI, Anthropic, xAI, etc.).

---

## Current Project State Assessment

### ✅ **COMPLETED (Approx. 55% of total work)**

| Category | Component | Status | Details |
|----------|-----------|--------|---------|
| **Project Setup** | Vite + React 19 + TypeScript + Tailwind v4 | ✅ Done | `package.json`, `vite.config.ts`, `tsconfig.json` |
| **Design System** | CSS tokens (`src/styles/tokens.css`) | ✅ Done | OKLCH colors, typography, spacing, focus states, reduced motion |
| **Data Layer (Frontend)** | `src/data/companies.ts` | ✅ Done | 100 companies, sectors, regions, TypeScript types, SECTORS/REGIONS constants |
| **Filtering Hook** | `src/hooks/useFilters.ts` | ✅ Done | URL-synced filters (query, sectors, regions, status), sorting, pagination logic |
| **Filter UI** | `src/components/FilterBar.tsx` | ✅ Done | Search, sector chips, region chips, status segmented control, reset, result count |
| **Directory Table** | `src/components/CompanyDirectory.tsx` | ✅ Done | Sortable columns, pagination (15/page), expandable rows, money/status cells |
| **KPI Strip** | `src/components/KpiStrip.tsx` | ✅ Done | 5 tiles: company count, total capital, countries, median founded, top sector |
| **Sector Chart** | `src/components/charts/SectorBar.tsx` | ✅ Done | Recharts vertical bar chart, categorical colors, tooltips |
| **Utilities** | `src/lib/format.ts`, `aggregate.ts`, `colors.ts` | ✅ Done | Currency/compact formatting, aggregations, sector color palette |
| **Build Pipeline Script** | `scripts/build-data.ts` | ✅ Partial | 100+ companies with rich data (market cap, funding, valuation, sources), **but schema differs from frontend** |

---

### ❌ **INCOMPLETE / MISMATCHED (Approx. 45% of total work)**

| Category | Component | Status | Gap |
|----------|-----------|--------|-----|
| **Main App** | `src/App.tsx` | ❌ **NOT DONE** | Still default Vite template; needs full dashboard composition |
| **Data Schema Alignment** | Frontend vs Build Script | ❌ **MISMATCHED** | Frontend: `valuationUSD`, `fundingRaisedUSD`, `employees: number\|null`, `status: 'public'\|'private'`<br>Build script: `valuationOrMarketCapUSD`, `fundingRaisedUSD`, `employees: number\|string`, `status: 'Public'\|'Private'\|'Acquired'\|'Defunct'`, plus `rank?`, `asOfDate`, `dataSource`, `valuationIsEstimate` |
| **Dataset Scope** | Company Coverage | ❌ **INCOMPLETE** | Current: ~100 AI-focused companies<br>Target: **Fortune 500 (500) + Big Tech/AI Leaders (~50) = ~550 companies** |
| **New Fields** | Revenue, Company Tier | ❌ **MISSING** | Need `revenueUSD` (Fortune 500 metric), `tier: 'fortune500'\|'big-tech'\|'ai-frontier'\|'unicorn'\|'public-large'\|'public-mid'` |
| **New Filters** | Tier Filter | ❌ **MISSING** | FilterBar needs tier chips; hook needs tier state |
| **KPI Updates** | Revenue Metrics | ❌ **MISSING** | Add total revenue, avg revenue, revenue per employee tiles |
| **Chart Updates** | Revenue/Market Cap by Sector | ❌ **MISSING** | SectorBar needs toggle: company count / total revenue / total market cap |
| **Data Export** | JSON/CSV Output | ❌ **NOT RUN** | `npm run build:data` not executed; no `data/companies.json` or `data/companies.csv` |
| **Tests** | Unit/Integration | ❌ **NONE** | No test files found |
| **CI/CD** | GitHub Actions | ❌ **NONE** | No workflow files |
| **Documentation** | README Sync | ⚠️ **OUTDATED** | README still says "Top 100 AI Companies" |

---

## Detailed Implementation Plan

---

### PHASE 1: Data Layer Unification & Expansion (Priority: CRITICAL)

#### 1.1 Align TypeScript Interfaces
- **File**: `src/data/companies.ts` AND `scripts/build-data.ts`
- **Action**: Create single source of truth interface in shared location (e.g., `src/types/company.ts`)
- **Target Schema**:
```typescript
export type CompanyTier = 'fortune500' | 'big-tech' | 'ai-frontier' | 'unicorn' | 'public-large' | 'public-mid';
export type CompanyStatus = 'Public' | 'Private' | 'Acquired' | 'Defunct';
export type Region = 'North America' | 'Europe' | 'Asia-Pacific' | 'Middle East' | 'Latin America' | 'Africa';

export interface Company {
  rank: number;                    // Fortune 500 rank OR synthetic rank
  name: string;
  sector: Sector;
  subsector: string;
  hqCity: string;
  hqCountry: string;
  region: Region;
  founded: number;
  revenueUSD: number | null;       // NEW: Fortune 500 revenue
  fundingRaisedUSD: number | null; // Private companies
  valuationOrMarketCapUSD: number | null;
  employees: number | null;
  status: CompanyStatus;
  tier: CompanyTier;               // NEW: classification
  ticker: string | null;
  oneLineDescription: string;
  website: string;
  dataSource: string;
  asOfDate: string;                // YYYY-MM-DD
}
```

#### 1.2 Expand Dataset to ~550 Companies
- **Fortune 500** (500 companies): Revenue, market cap, employees, sector, HQ, founded year founded year
  - Source: Fortune 500 2024/2025 list (public)
  - Focus: All sectors, not just tech
- **Big Tech / AI Leaders** (~50 additional): NVIDIA, Microsoft, Apple, Alphabet, Amazon, Meta, OpenAI, Anthropic, xAI, TSMC, ASML, Broadcom, Oracle, AMD, Palantir, Databricks, Scale AI, Mistral, Cohere, Perplexity, etc.
  - Some overlap with Fortune 500 — deduplicate by name
- **Data Sources**: Yahoo Finance, companiesmarketcap.com, SEC filings, Crunchbase, Bloomberg, Reuters, company press releases

#### 1.3 Execute Build Script & Generate Outputs
```bash
npx tsx scripts/build-data.ts
```
- Output: `data/companies.json`, `data/companies.csv`
- Frontend imports `data/companies.json` directly (update `src/data/companies.ts` to re-export)

#### 1.4 Add Revenue Field to Frontend Data
- Update `src/data/companies.ts` to include `revenueUSD`
- Update `Company` interface in `src/data/companies.ts` to match unified schema

---

### PHASE 2: Dashboard Composition & App Shell (Priority: HIGH)

#### 2.1 Replace `src/App.tsx` with Real Dashboard
**Layout Structure**:
```
App.tsx
├── Header (title, subtitle, last-updated)
├── Main Grid (CSS Grid / Flex)
│   ├── Sidebar (FilterBar) — 280px fixed, sticky top
│   └── Content Area
│       ├── KpiStrip (full width)
│       ├── SectorBar + SectorRevenueChart (side by side on lg)
│       └── CompanyDirectory (full width, grows)
└── Footer (data sources, methodology link)
```

#### 2.2 Responsive Behavior
- `< 768px`: FilterBar collapses into accordion/drawer
- `768–1024px`: Sidebar + content stack
- `> 1024px`: Side-by-side

---

### PHASE 3: Feature Enhancements (Priority: HIGH)

#### 3.1 Tier Filter in FilterBar
- Add `tiers: CompanyTier[]` to `FilterState` in `useFilters.ts`
- Add tier chips in `FilterBar.tsx` (Fortune 500, Big Tech, AI Frontier, Unicorn, Public Large, Public Mid)
- Color-code tiers (distinct from sector colors)

#### 3.2 Revenue Sorting & Display
- Add `revenueUSD` to `SortField` type
- Add `DEFAULT_DIR.revenueUSD = 'desc'`
- Update `CompanyDirectory.tsx` MoneyCell to show revenue for public companies
- Add "Revenue" column header (toggle with Valuation?)

#### 3.3 Enhanced KPI Strip
Add tiles:
- **Total Revenue** (formatCompactUSD)
- **Avg Revenue / Company**
- **Revenue per Employee** (median)
- **Public vs Private Count**
- **Fortune 500 Count**

#### 3.4 Dual-Metric Sector Chart
- Extend `SectorBar.tsx` with prop `metric: 'count' | 'revenue' | 'marketCap'`
- Add toggle buttons in chart header
- Compute sector aggregates in `aggregate.ts`

---

### PHASE 4: Data Quality & Polish (Priority: MEDIUM)

#### 4.1 Data Validation Script
- Add validation in `build-data.ts`: no null ranks, unique names, valid regions/sectors, revenue ≥ 0
- Log warnings for missing revenue on Fortune 500 entries

#### 4.2 Source Attribution UI
- Show `dataSource` and `asOfDate` in expanded company row (already in `CompanyDirectory.tsx`)
- Add "Methodology" modal/page

#### 4.3 Loading & Error States
- Suspense boundary for data load
- Error fallback with retry button

#### 4.4 Accessibility Audit
- Table headers, ARIA labels, focus management, color contrast (tokens.css already OK)

---

### PHASE 5: Testing & CI/CD (Priority: MEDIUM)

#### 5.1 Unit Tests (Vitest + React Testing Library)
- `useFilters.ts` — filter/sort/pagination logic
- `aggregate.ts` — KPI calculations
- `format.ts` — currency/compact formatting edge cases
- `CompanyDirectory.tsx` — render, sort, paginate, expand

#### 5.2 E2E Tests (Playwright)
- Load dashboard, apply filters, sort, paginate, expand row
- URL sync (shareable filter state)

#### 5.3 GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
- lint (oxlint)
- typecheck (tsc -b)
- test (vitest)
- build (vite build)
- build:data (tsx scripts/build-data.ts) — verify outputs exist
```

---

### PHASE 6: Documentation & Deploy (Priority: LOW)

#### 6.1 Update README
- Change title to "Fortune 500 & Big Tech Intelligence Dashboard"
- Update feature list, data schema, methodology
- Add screenshots

#### 6.2 Deploy Target
- Vercel / Netlify / GitHub Pages (static export via `vite build`)
- Add `vercel.json` or `netlify.toml` if needed

---

## Effort Estimate (Rough Person-Days)

| Phase | Tasks | Est. Days |
|-------|-------|-----------|
| 1. Data Unification & Expansion | Schema align, 550 companies research, build script | 8–12 |
| 2. App Shell & Dashboard | App.tsx layout, responsive sidebar, compose components | 2–3 |
| 3. Feature Enhancements | Tier filter, revenue sort, KPI tiles, dual-metric chart | 3–4 |
| 4. Data Quality & Polish | Validation, methodology, loading states, a11y | 2–3 |
| 5. Testing & CI | Unit + E2E tests, GitHub Actions | 2–3 |
| 6. Docs & Deploy | README, deploy config | 1 |
| **Total** | | **18–26 days** |

---

## Current Completion by Category

| Category | Completion | Notes |
|----------|------------|-------|
| Project Setup & Config | **100%** | |
| Design System / Tokens | **100%** | |
| Frontend Data Layer (100 AI cos) | **60%** | Schema mismatch; missing revenue, tier, 450+ companies |
| Build Script / Data Pipeline | **70%** | Rich data but wrong schema; not executed |
| Filtering & Sorting Logic | **90%** | Missing tier filter, revenue sort |
| Filter UI (FilterBar) | **80%** | Missing tier chips |
| Company Directory Table | **90%** | Missing revenue column, tier badge |
| KPI Strip | **50%** | Missing revenue KPIs, tier counts |
| Sector Visualization | **60%** | Single metric (count); needs revenue/market cap toggle |
| Main App Composition | **0%** | App.tsx is placeholder |
| Data Export (JSON/CSV) | **0%** | Not run |
| Tests | **0%** | None |
| CI/CD | **0%** | None |
| Documentation | **30%** | README outdated |

---

## Immediate Next Steps (Start Here)

1. **Create unified type definition** → `src/types/company.ts`
2. **Update `scripts/build-data.ts`** to emit unified schema + add Fortune 500 data
3. **Run `npx tsx scripts/build-data.ts`** → generate `data/companies.json`
4. **Update `src/data/companies.ts`** to import/export from generated JSON
5. **Replace `src/App.tsx`** with dashboard layout
6. **Add tier filter** to hook + FilterBar
7. **Add revenue field** to directory table + sorting
8. **Extend KpiStrip + SectorBar** for revenue metrics

---

## File Map for Changes

```
src/
├── types/
│   └── company.ts              ← NEW: unified Company interface
├── data/
│   └── companies.ts            ← UPDATE: re-export from data/companies.json + types
├── hooks/
│   └── useFilters.ts           ← UPDATE: add tier filter, revenue sort
├── components/
│   ├── FilterBar.tsx           ← UPDATE: tier chips
│   ├── CompanyDirectory.tsx    ← UPDATE: revenue column, tier badge
│   ├── KpiStrip.tsx            ← UPDATE: revenue KPIs
│   └── charts/
│       └── SectorBar.tsx       ← UPDATE: metric toggle (count/revenue/marketCap)
├── lib/
│   ├── aggregate.ts            ← UPDATE: sector revenue/marketCap aggregates
│   └── format.ts               ← (likely OK)
├── App.tsx                     ← REPLACE: full dashboard layout
├── main.tsx                    ← (OK)
└── styles/tokens.css           ← (OK)

scripts/
└── build-data.ts               ← MAJOR UPDATE: Fortune 500 + unified schema

data/
├── companies.json              ← GENERATED
├── companies.csv               ← GENERATED
└── _raw/                       ← (raw source files)

.github/workflows/
└── ci.yml                      ← NEW

README.md                       ← UPDATE
```

---

## Notes & Risks

- **Data Collection Risk**: Fortune 500 revenue data is public but gathering 500+ verified records is time-intensive. Consider staged rollout: launch with ~200 (top Fortune 100 + all Big Tech/AI), expand incrementally.
- **Schema Drift**: Keep `scripts/build-data.ts` and `src/types/company.ts` in sync — consider a shared package or codegen if this grows.
- **Bundle Size**: 550 companies in JSON ~200KB gzipped — acceptable for Vite. If larger, consider lazy-loading or pagination via API.
- **Ranking**: Fortune 500 uses revenue rank. AI companies use valuation rank. Dashboard should support both: show `rank` with tier context (e.g., "F500 #12" vs "AI #3").