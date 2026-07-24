# 🤖 Research Agent — Top 100 AI Companies Intelligence Hub

An interactive research platform and dataset intelligence dashboard for tracking, analyzing, and visualizing the world's **Top 100 Artificial Intelligence Companies**.

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Recharts**, this repository provides a single source of truth dataset along with a fast, modern web UI for filtering, sorting, and analyzing global AI leaders across market capitalization, private valuation, funding raised, sector, and region.

---

## 🌟 Key Features

- 📊 **Verified Dataset**: Comprehensive data for top AI megacaps (Microsoft, NVIDIA, Apple, Alphabet, Meta), frontier model labs (OpenAI, Anthropic, xAI), hardware foundries (TSMC, ASML), and enterprise AI leaders.
- 🔍 **Interactive Multi-Filter**: Instantly filter companies by **Sector**, **Region**, **Status** (Public, Private, Acquired), and global text search across names, subsectors, and HQ countries.
- ⚡ **Dynamic Sorting & Pagination**: Sort by **Rank**, **Valuation / Market Cap**, **Funding Raised**, **Employees**, **Founded Year**, or **Name**. Includes responsive pagination with page jumpers.
- 📈 **KPI Metrics Strip**: Live aggregated financial metrics displaying total market capitalization/valuation, total venture funding raised, median/average valuation, and active filter company counts.
- 📉 **Sector Analytics Visualization**: Visual breakdown of market share and total valuation distributed across key AI sectors (Foundation Models, AI Hardware, AI Infrastructure, Enterprise AI, Biotech, etc.).
- 🛠️ **Data Build Pipeline**: Built-in TypeScript script (`scripts/build-data.ts`) that compiles raw verified dataset entries into consumable `JSON` and `CSV` files.

---

## 📐 Project Structure

```
Research_report/
├── data/
│   └── _raw/                   # Raw data inputs and source files
├── public/                     # Static assets and SVG icons
├── scripts/
│   └── build-data.ts           # Dataset builder & schema generator script
├── src/
│   ├── assets/                 # Image assets and logos
│   ├── components/             # Core UI components
│   │   ├── CompanyDirectory.tsx# Directory table & paginated company list
│   │   ├── FilterBar.tsx       # Search and drop-down filters
│   │   ├── KpiStrip.tsx        # Dynamic metric indicators
│   │   └── charts/
│   │       ├── SectorBar.tsx   # Recharts sector distribution chart
│   │       └── chartContract.md# Chart styling guidelines & contract
│   ├── data/
│   │   └── companies.ts        # Built TypeScript company dataset
│   ├── hooks/
│   │   └── useFilters.ts       # React custom hook for filtering & state
│   ├── lib/
│   │   ├── aggregate.ts        # Data aggregation & analytics helpers
│   │   ├── colors.ts           # Color mapping for sectors & charts
│   │   └── format.ts           # Currency and metric formatting utilities
│   ├── styles/
│   │   └── tokens.css          # Design system CSS custom properties
│   ├── App.tsx                 # Main application dashboard page
│   ├── index.css               # Global styles & Tailwind import
│   └── main.tsx                # Application entry point
├── .oxlintrc.json              # Oxlint linter configuration
├── index.html                  # HTML entry template
├── package.json                # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

---

## 🚀 Tech Stack

- **Frontend Core**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Build System**: [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), Custom CSS Design System (`tokens.css`)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Linting & Quality**: [Oxlint](https://oxc.rs/docs/guide/usage/linter.html)

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
  rank?: number;
  name: string;
  sector: Sector;
  subsector: string;
  hqCity: string;
  hqCountry: string;
  region: "North America" | "Europe" | "Asia-Pacific" | "Middle East" | "Latin America" | "Africa";
  founded: number;
  fundingRaisedUSD: number | null;
  valuationOrMarketCapUSD: number | null;
  employees: number | string;
  status: "Private" | "Public" | "Acquired" | "Defunct";
  ticker: string | null;
  oneLineDescription: string;
  website: string;
  dataSource: string;
  asOfDate: string; // YYYY-MM-DD
}
```

---

## 🤝 Contributing

Contributions, feature suggestions, and dataset updates are welcome!
Feel free to open an **Issue** or submit a **Pull Request**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature` & `git push origin feature/AmazingFeature`)
5. Open a Pull Request

---


