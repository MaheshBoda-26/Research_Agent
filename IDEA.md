An interactive research platform and dataset intelligence dashboard for tracking, analyzing, and visualizing Fortune 500 companies and leading big tech companies (Amazon, Google/Alphabet, NVIDIA, Microsoft, Apple, Meta, OpenAI, Anthropic, xAI, and other AI leaders).

- Comprehensive verified dataset spanning Fortune 500 enterprises and frontier AI companies across sectors: Cloud/Hyperscalers, AI Hardware & Semiconductors, Foundation Models, Enterprise AI, Consumer AI, Autonomous Systems, Cybersecurity, Developer Tools, Healthcare/Biotech, Financial Services, and more.
- Interactive multi-filter dashboard: filter by Sector, Region, Company Tier (Fortune 500, Big Tech, AI Frontier Labs, Unicorns), Status (Public/Private), and global search across names, subsectors, and HQ locations.
- Dynamic sorting and pagination: sort by Rank, Revenue, Market Cap/Valuation, Funding Raised, Employees, Founded Year, or Name with responsive pagination.
- Live KPI metrics strip: aggregated total market cap, total revenue, total venture funding, median/average valuation, employee counts, and active filter company counts.
- Sector analytics visualization: Recharts-powered sector distribution charts showing revenue share, market cap distribution, and company count across industry verticals.
- Verified dataset pipeline: TypeScript build script (scripts/build-data.ts) compiling raw verified dataset entries into typed JSON and CSV outputs with strict TypeScript contracts.
- Modern stack: React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Oxlint.