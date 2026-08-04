# 🧠 Codebase Build & Development Memory Log

This document records the builds, data compilation runs, and major development milestones/commits executed in this repository. Automatically updated on commits and builds.

---

## 🚀 Git Development History & Milestones

The following table details all the commits that have shaped the current codebase up to the present date (**2026-08-04**).

| Commit Hash | Date | Description | Author | Key Changes / Context |
| :--- | :--- | :--- | :--- | :--- |
| **`7da7946`** | 2026-08-04 | Configure .env file. | MaheshBoda-26 | Modified research.ts, memory.md, vercel.json |
| **`0f7174e`** | 2026-08-04 | Build an Agent mode Feature | MaheshBoda-26 | Modified memory.md |
| **`187208e`** | 2026-08-04 | Build an Agent mode Feature | MaheshBoda-26 | Modified .gitignore, research.ts, memory.md, package-lock.json + 8 more files |
| **`acbdad7`** | 2026-07-28 | feat: add memory log tracking and auto-update hook | Mahesh Boda | Modified memory.md, package.json, update-memory.cjs |
| **`2c44230`** | 2026-07-27 | perf: optimize LCP with lazy loading & manual chunking, update company dataset and rankings, and update README | Mahesh Boda | Modified companies.csv, companies.json, build-data.ts, App.tsx + 4 more files |
| **`ebbf758`** | 2026-07-27 | Update README.md | Mahesh Boda | Modified README.md |
| **`50755e2`** | 2026-07-26 | feat: overhaul UI/UX with futuristic theme, animated grid, and diagonal light pillar | Mahesh Boda | Modified MASTER.md, MASTER.md, index.html, package-lock.json + 17 more files |
| **`b05e429`** | 2026-07-25 | Update README.md | Mahesh Boda | Modified README.md |
| **`eeebe96`** | 2026-07-25 | feat: complete UI/UX overhaul using design-md, theme-factory, frontend-design, and canvas-design skills | Mahesh Boda | Modified LICENSE.txt, SKILL.md, DESIGN.md, index.html + 9 more files |
| **`25edce2`** | 2026-07-25 | feat: enhance research report dashboard, data pipeline, and project documentation | Mahesh Boda | Modified IDEA.md, IMPLEMENTATION_PLAN.md, README.md, companies.csv + 15 more files |
| **`24c3eb4`** | 2026-07-24 | Remove license section from README | Mahesh Boda | Modified README.md |
| **`f9e33f4`** | 2026-07-24 | docs: rewrite README with comprehensive project documentation | Mahesh Boda | Modified README.md |
| **`d79beaf`** | 2026-07-24 | Initial commit | Mahesh Boda | Modified .gitignore, .oxlintrc.json, README.md, index.html + 27 more files |

---

## 📊 Dataset Compilation Builds (`build-data`)

The dataset compilation is built via a TypeScript pipeline from `scripts/build-data.ts`.

- **Command**: `npx tsx scripts/build-data.ts`
- **Inputs**: Raw data array inside `scripts/build-data.ts`
- **Output Files**:
  - `data/companies.json` — Structured JSON array of companies sorted by rank/valuation (imported by the frontend application).
  - `data/companies.csv` — CSV format of the computed dataset for research and external usage.
- **Rules applied at build-time**:
  1. Computes synthetic rank based on `valuationOrMarketCapUSD` (descending), then funding raised (descending), then name.
  2. Ensures all coordinates and numerical fields (revenue, valuation, funding) conform to the `Company` type interface.

---

## ⚡ Production Frontend Builds (`npm run build`)

Compiles and optimizes the React 19 application for production.

- **Command**: `tsc -b && vite build`
- **Assets Bundles & Code Splitting**:

| Asset Path | Size | Description |
| :--- | :--- | :--- |
| `dist/assets/3d-graphics-C9vLFjqg.js` | `501.22 kB` | Three.js 3D graphics rendering library |
| `dist/assets/CompanyDirectory-CjGRtMfX.js` | `12.23 kB` | Interactive database directory components |
| `dist/assets/HeroCanvas-w70JUyAP.js` | `3.12 kB` | Interactive 3D background canvas |
| `dist/assets/agent-page-CIdPGQMV.css` | `264 Bytes` | Compiled application stylesheets |
| `dist/assets/agent-page-DP6yhQx0.js` | `75.53 kB` | Application code bundle / chunk |
| `dist/assets/charting-Cdbhe6hp.js` | `343.93 kB` | Recharts visualization library chunk |
| `dist/assets/charts-lKKLzFJg.js` | `3.6 kB` | Data visualization charting components |
| `dist/assets/index-NO7fuGHE.css` | `64.94 kB` | Compiled application stylesheets |
| `dist/assets/index-WOWUaH3U.js` | `81.29 kB` | Application code bundle / chunk |
| `dist/assets/react-vendor-DXKLa3wX.js` | `174.18 kB` | React core libraries vendor chunk |
| `dist/assets/rolldown-runtime-QTnfLwEv.js` | `694 Bytes` | Bundler runtime orchestrator |
| `dist/assets/ui-components-omXXWuqK.js` | `30.54 kB` | Application code bundle / chunk |
| `dist/favicon.svg` | `9.3 kB` | Static asset resource |
| `dist/icons.svg` | `4.91 kB` | Static asset resource |
| `dist/index.html` | `1.59 kB` | Entry HTML document |
