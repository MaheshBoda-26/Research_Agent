# 📊 Fortune 500 & Big Tech Intelligence Dashboard

An interactive research platform and dataset intelligence dashboard for tracking, analyzing, and visualizing **Fortune 500 companies** and **leading big tech / AI companies** (Amazon, Google/Alphabet, NVIDIA, Microsoft, Apple, Meta, OpenAI, Anthropic, xAI, and other AI leaders).

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Recharts**, this repository provides a verified dataset along with a fast, modern web UI for filtering, sorting, and analyzing global enterprise leaders across revenue, market capitalization, private valuation, funding raised, sector, region, and company tier.

---

## 🌟 Key Features

- 📊 **Verified Dataset**: Comprehensive data for Fortune 500 enterprises + frontier AI companies across sectors: Cloud/Hyperscalers, AI Hardware & Semiconductors, Foundation Models, Enterprise AI, Consumer AI, Autonomous Systems, Cybersecurity, Developer Tools, Healthcare/Biotech, Financial Services, and more.
- 🔍 **Interactive Multi-Filter**: Instantly filter companies by **Sector**, **Region**, **Company Tier** (Fortune 500, Big Tech, AI Frontier Labs, Unicorn, Public Large, Public Mid), **Status** (Public/Private/Acquired/Defunct), and global text search across names, subsectors, and HQ locations.
- ⚡ **Dynamic Sorting & Pagination**: Sort by **Rank**, **Revenue**, **Market Cap / Valuation**, **Funding Raised**, **Employees**, **Founded Year**, or **Name**. Includes responsive pagination with page jumpers.
- 📈 **KPI Metrics Strip**: Live aggregated financial metrics displaying total market cap/valuation, total revenue, total venture funding raised, company counts by tier, public vs private split, countries represented, median founding year, top sector, and top tier.
- 📉 **Sector Analytics Visualization**: Interactive Recharts-powered sector distribution charts with toggleable metrics: **Company Count**, **Total Revenue**, **Market Cap / Valuation**.
- 🛠️ **Data Build Pipeline**: Built-in TypeScript script (`scripts/build-data.ts`) that compiles raw verified dataset entries into consumable `JSON` and `CSV` files with strict TypeScript contracts.

---

## 📐 Project Structure

```
Research_report/
├── data/
│   ├── _raw/                   # Raw data inputs and source files
│   ├── companies.json          # Generated dataset (imported by frontend)
│   └── companies.csv           # Generated CSV export
├── public/                     # Static assets and SVG icons
├── scripts/
│   └── build-data.ts           # Dataset builder & schema generator script
├── src/
│   ├── assets/                 # Image assets and logos
│   ├── components/             # Core UI components
│   │   ├── CompanyDirectory.tsx# Directory table & paginated company list
│   │   ├── FilterBar.tsx       # Search, tier, sector, region, status filters
│   │   ├── KpiStrip.tsx        # Dynamic metric indicators
│   │   └── charts/
│   │       ├── SectorBar.tsx   # Recharts sector distribution chart (count/revenue/market cap)
│   │       └── chartContract.md# Chart styling guidelines & contract
│   ├── data/
│   │   └── companies.ts        # Re-exports generated dataset + types
│   ├── hooks/
│   │   └── useFilters.ts       # React custom hook for filtering, sorting & URL state
│   ├── lib/
│   │   ├── aggregate.ts        # Data aggregation & analytics helpers
│   │   ├── colors.ts           # Color mapping for sectors & charts
│   │   └── format.ts           # Currency and metric formatting utilities
│   ├── styles/
│   │   └── tokens.css          # Design system CSS custom properties (OKLCH)
│   ├── types/
│   │   └── company.ts          # Unified Company interface & type definitions
│   ├── App.tsx                 # Main application dashboard page
│   ├── index.css               # Global styles & Tailwind import
│   └── main.tsx                # Application entry point
├── .oxlintrc.json              # Oxlint linter configuration
├── index.html                  # HTML entry template
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── tsconfig.app.json           # App-specific TypeScript config
├── tsconfig.node.json          # Node/tooling TypeScript config
└── vite.config.ts              # Vite configuration
```

---

## 🚀 Tech Stack

- **Frontend Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build System**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Custom CSS Design System (`tokens.css`) using OKLCH color space
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Linting & Quality**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)
- **Routing**: [React Router v7](https://reactrouter.com/)

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MaheshBoda-26/Research_Agent.git
   cd Research_Agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running Locally

Start the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Compiling Dataset

To rebuild or recompile the raw data into formatted dataset outputs:
```bash
npx tsx scripts/build-data.ts
```
Outputs: `data/companies.json` and `data/companies.csv`

### Production Build

To create a production-ready optimized build:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

### Code Linting

Run Oxlint to check code quality:
```bash
npm run lint
```

---

## 📊 Data Schema & Methodology

Each company entry follows a strict TypeScript contract:

```typescript
export type CompanyTier = 
  | "fortune500" 
  | "big-tech" 
  | "ai-frontier" 
  | "unicorn" 
  | "public-large" 
  | "public-mid";

export type CompanyStatus = "Public" | "Private" | "Acquired" | "Defunct";

export type Region = 
  | "North America" 
  | "Europe" 
  | "Asia-Pacific" 
  | "Middle East" 
  | "Latin America" 
  | "Africa";

export type Sector = 
  | "Foundation Models"
  | "AI Infrastructure"
  | "Enterprise AI"
  | "Healthcare & Life Sciences"
  | "Fintech"
  | "Autonomous Systems & Robotics"
  | "Cybersecurity"
  | "Developer Tools"
  | "AI Hardware"
  | "Media & Creativity"
  | "Education"
  | "Other";

export interface Company {
  rank: number;                         // Fortune 500 rank OR synthetic rank by valuation
  name: string;
  sector: Sector;
  subsector: string;
  hqCity: string;
  hqCountry: string;
  region: Region;
  founded: number;
  revenueUSD: number | null;            // Fortune 500 revenue (public companies)
  fundingRaisedUSD: number | null;      // Private companies
  valuationOrMarketCapUSD: number | null;
  employees: number | null;
  status: CompanyStatus;
  tier: CompanyTier;                    // Classification tier
  ticker: string | null;
  oneLineDescription: string;
  website: string;
  dataSource: string;                   // Source attribution
  asOfDate: string;                     // YYYY-MM-DD snapshot date
}
```

**Methodology**
- **Snapshot anchor**: 2026-07-01. Headline figures (market caps, private valuations) web-verified via Yahoo Finance, companiesmarketcap.com, Crunchbase, Bloomberg, Reuters, SEC filings.
- **Revenue**: Fortune 500 2024/2025 reported revenue for public companies.
- **Ranking**: By `valuationOrMarketCapUSD` descending, then funding descending, then name. Field `rank` assigned at build time.
- **Private company valuations**: Based on latest disclosed funding round post-money valuations; labeled as estimates in `dataSource`.
- **Null policy**: Any figure that could not be verified is `null` (never invented).

---

## 🤝 Contributing

Contributions, feature suggestions, and dataset updates are welcome!
Feel free to open an **Issue** or submit a **Pull Request**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---
