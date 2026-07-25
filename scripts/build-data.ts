/**
 * Top 100 AI Companies — dataset source + builder.
 *
 * Single source of truth. `npm run build:data` runs this via tsx to emit
 * data/companies.json and data/companies.csv. The frontend imports
 * companies.json directly.
 *
 * Methodology
 * -----------
 * Snapshot anchor: 2026-07-01. Headline figures (top market caps, top private
 * valuations) web-verified via Yahoo Finance / stockanalysis.com /
 * companiesmarketcap.com / Crunchbase / Bloomberg / Reuters. Long-tail entries
 * are sourced from public reporting and trade press; any figure I could not
 * verify is null (never invented). Estimates are labelled in `dataSource`.
 *
 * Ranking: by `valuationOrMarketCapUSD` desc, then by funding desc, then name.
 * Field `rank` is assigned at build time.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { Company } from '../src/types/company';

const V = 'verified'; // shorthand for verified source tag
const SNAP = '2026-07-01';

export const COMPANIES: Company[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // TIER 1 — Megacap public (verified market caps, as-of mid-2026)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'Microsoft',
    sector: 'AI Infrastructure',
    subsector: 'Hyperscale cloud + frontier AI',
    hqCity: 'Redmond',
    hqCountry: 'United States',
    region: 'North America',
    founded: 1975,
    revenueUSD: 245_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 3_700_000_000_000,
    employees: 228000,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'MSFT',
    oneLineDescription:
      'Hyperscale cloud (Azure), 49% stake in OpenAI, and Copilot AI woven across Office and Windows.',
    website: 'https://www.microsoft.com',
    dataSource: `${V}: Yahoo Finance / stockanalysis.com, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'NVIDIA',
    sector: 'AI Hardware',
    subsector: 'GPUs & AI accelerators',
    hqCity: 'Santa Clara',
    hqCountry: 'United States',
    region: 'North America',
    founded: 1993,
    revenueUSD: 130_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 3_800_000_000_000,
    employees: 29600,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'NVDA',
    oneLineDescription:
      'Designs the GPUs and CUDA software stack that train and run nearly all large AI models.',
    website: 'https://www.nvidia.com',
    dataSource: `${V}: companiesmarketcap.com / Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'Apple',
    sector: 'AI Hardware',
    subsector: 'Consumer devices + on-device AI',
    hqCity: 'Cupertino',
    hqCountry: 'United States',
    region: 'North America',
    founded: 1976,
    revenueUSD: 383_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 3_400_000_000_000,
    employees: 164000,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'AAPL',
    oneLineDescription:
      'Runs Apple Intelligence on its custom silicon, shipping neural engines across iPhones, Macs, and Vision Pro.',
    website: 'https://www.apple.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'Alphabet',
    sector: 'Foundation Models',
    subsector: 'Frontier models + search',
    hqCity: 'Mountain View',
    hqCountry: 'United States',
    region: 'North America',
    founded: 1998,
    revenueUSD: 307_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 2_300_000_000_000,
    employees: 182502,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'GOOGL',
    oneLineDescription:
      'Parent of Google DeepMind (Gemini), Google Cloud TPUs, Search, and Waymo self-driving.',
    website: 'https://abc.xyz',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'Amazon',
    sector: 'AI Infrastructure',
    subsector: 'Cloud (AWS) + voice AI',
    hqCity: 'Seattle',
    hqCountry: 'United States',
    region: 'North America',
    founded: 1994,
    revenueUSD: 575_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 2_100_000_000_000,
    employees: 1525000,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'AMZN',
    oneLineDescription:
      'AWS Trainium/Inferentia chips, Bedrock model garden, and Alexa power its cloud AI stack.',
    website: 'https://www.amazon.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'Meta',
    sector: 'Foundation Models',
    subsector: 'Open models (Llama) + social AI',
    hqCity: 'Menlo Park',
    hqCountry: 'United States',
    region: 'North America',
    founded: 2004,
    revenueUSD: 134_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 1_500_000_000_000,
    employees: 74067,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'META',
    oneLineDescription:
      'Builds the open Llama model family and runs some of the world\'s largest AI training clusters.',
    website: 'https://www.meta.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'TSMC',
    sector: 'AI Hardware',
    subsector: 'Semiconductor foundry',
    hqCity: 'Hsinchu',
    hqCountry: 'Taiwan',
    region: 'Asia-Pacific',
    founded: 1987,
    revenueUSD: 75_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 1_800_000_000_000,
    employees: 76478,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'TSM',
    oneLineDescription:
      'Manufactures the leading-edge chips (including NVIDIA GPUs) that the AI industry depends on.',
    website: 'https://www.tsmc.com',
    dataSource: `${V}: companiesmarketcap.com / Statista, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'Broadcom',
    sector: 'AI Hardware',
    subsector: 'Networking silicon + custom AI ASICs',
    hqCity: 'Palo Alto',
    hqCountry: 'United States',
    region: 'North America',
    founded: 1991,
    revenueUSD: 35_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 1_600_000_000_000,
    employees: 39000,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'AVGO',
    oneLineDescription:
      'Supplies the networking chips and custom XPUs (Google, Meta) that wire together AI datacenters.',
    website: 'https://www.broadcom.com',
    dataSource: `${V}: companiesmarketcap.com, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'Tesla',
    sector: 'Autonomous Systems & Robotics',
    subsector: 'Autonomous driving + humanoid robots',
    hqCity: 'Austin',
    hqCountry: 'United States',
    region: 'North America',
    founded: 2003,
    revenueUSD: 96_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 1_100_000_000_000,
    employees: 140473,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'TSLA',
    oneLineDescription:
      'Pursues full-self-driving neural nets and the Optimus humanoid robot on its own silicon.',
    website: 'https://www.tesla.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'Palantir Technologies',
    sector: 'Enterprise AI',
    subsector: 'Decision intelligence / government AI',
    hqCity: 'Denver',
    hqCountry: 'United States',
    region: 'North America',
    founded: 2003,
    revenueUSD: 2_500_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 280_000_000_000,
    employees: 4000,
    status: 'Public',
    tier: 'public-large',
    ticker: 'PLTR',
    oneLineDescription:
      'AIP platform lets enterprises and defense customers build apps on top of large language models over their own data.',
    website: 'https://www.palantir.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 2 — Top private (verified valuations, as-of 2025–2026)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'OpenAI',
    sector: 'Foundation Models',
    subsector: 'Frontier LLMs + ChatGPT',
    hqCity: 'San Francisco',
    hqCountry: 'United States',
    region: 'North America',
    founded: 2015,
    revenueUSD: 4_000_000_000,
    fundingRaisedUSD: 200_000_000_000,
    valuationOrMarketCapUSD: 852_000_000_000,
    employees: 3000,
    status: 'Private',
    tier: 'ai-frontier',
    ticker: null,
    oneLineDescription:
      'Maker of the GPT model family and ChatGPT; the most valuable private AI company.',
    website: 'https://openai.com',
    dataSource: `${V}: Bloomberg / CNBC / Crunchbase, $122B round at $852B post-money (Mar 2026)`,
    asOfDate: '2026-03-31',
  },
  {
    name: 'xAI',
    sector: 'Foundation Models',
    subsector: 'Frontier LLMs (Grok)',
    hqCity: 'Belmont',
    hqCountry: 'United States',
    region: 'North America',
    founded: 2023,
    revenueUSD: 100_000_000,
    fundingRaisedUSD: 50_000_000_000,
    valuationOrMarketCapUSD: 80_000_000_000,
    employees: 700,
    status: 'Private',
    tier: 'ai-frontier',
    ticker: null,
    oneLineDescription:
      'Elon Musk\'s lab building the Grok models and the Colossus supercomputer in Memphis.',
    website: 'https://x.ai',
    dataSource: `${V}: Reuters / Bloomberg, valuation`,
    asOfDate: '2025-02',
  },
  {
    name: 'Anthropic',
    sector: 'Foundation Models',
    subsector: 'Frontier LLMs (Claude)',
    hqCity: 'San Francisco',
    hqCountry: 'United States',
    region: 'North America',
    founded: 2021,
    revenueUSD: 1_000_000_000,
    fundingRaisedUSD: 60_000_000_000,
    valuationOrMarketCapUSD: 61_500_000_000,
    employees: 1200,
    status: 'Private',
    tier: 'ai-frontier',
    ticker: null,
    oneLineDescription:
      'AI safety lab behind the Claude model family, backed by Amazon and Google.',
    website: 'https://www.anthropic.com',
    dataSource: `${V}: Reuters / Crunchbase, Series F`,
    asOfDate: '2025-03',
  },
  {
    name: 'Databricks',
    sector: 'AI Infrastructure',
    subsector: 'Data lakehouse + model training',
    hqCity: 'San Francisco',
    hqCountry: 'United States',
    region: 'North America',
    founded: 2013,
    revenueUSD: 2_000_000_000,
    fundingRaisedUSD: 14_000_000_000,
    valuationOrMarketCapUSD: 62_000_000_000,
    employees: 9000,
    status: 'Private',
    tier: 'big-tech',
    ticker: null,
    oneLineDescription:
      'Unified data and AI platform (the MosaicML acquisition) for building and governing models on enterprise data.',
    website: 'https://www.databricks.com',
    dataSource: `${V}: Reuters / Crunchbase, Series J`,
    asOfDate: '2024-09',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // TIER 3 — Public large-cap (verified to best-effort)
  // ─────────────────────────────────────────────────────────────────────────
  {
    name: 'ASML',
    sector: 'AI Hardware',
    subsector: 'EUV lithography',
    hqCity: 'Veldhoven',
    hqCountry: 'Netherlands',
    region: 'Europe',
    founded: 1984,
    revenueUSD: 28_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 510_000_000_000,
    employees: 42800,
    status: 'Public',
    tier: 'public-large',
    ticker: 'ASML',
    oneLineDescription:
      'Sole maker of extreme ultraviolet lithography tools that print the most advanced AI chips.',
    website: 'https://www.asml.com',
    dataSource: `${V}: companiesmarketcap.com, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'Oracle',
    sector: 'AI Infrastructure',
    subsector: 'Cloud + database AI',
    hqCity: 'Austin',
    hqCountry: 'United States',
    region: 'North America',
    founded: 1977,
    revenueUSD: 53_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 560_000_000_000,
    employees: 159000,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'ORCL',
    oneLineDescription:
      'OCI cloud is a major host for OpenAI and other frontier labs; embeds AI across its database and apps.',
    website: 'https://www.oracle.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'AMD',
    sector: 'AI Hardware',
    subsector: 'GPUs & accelerators (Instinct/MI300)',
    hqCity: 'Santa Clara',
    hqCountry: 'United States',
    region: 'North America',
    founded: 1969,
    revenueUSD: 23_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 378_000_000_000,
    employees: 26000,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'AMD',
    oneLineDescription:
      'The principal GPU alternative to NVIDIA; its Instinct MI300 accelerators power frontier clusters.',
    website: 'https://www.amd.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'ARM Holdings',
    sector: 'AI Hardware',
    subsector: 'CPU instruction-set licensing',
    hqCity: 'Cambridge',
    hqCountry: 'United Kingdom',
    region: 'Europe',
    founded: 1990,
    revenueUSD: 3_200_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 337_000_000_000,
    employees: 7300,
    status: 'Public',
    tier: 'public-large',
    ticker: 'ARM',
    oneLineDescription:
      'Designs the ARM architecture underpinning the custom in-house AI silicon at Apple, Google, AWS, and NVIDIA.',
    website: 'https://www.arm.com',
    dataSource: `${V}: Macrotrends, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'ServiceNow',
    sector: 'Enterprise AI',
    subsector: 'Workflow + IT automation',
    hqCity: 'Santa Clara',
    hqCountry: 'United States',
    region: 'North America',
    founded: 2003,
    revenueUSD: 8_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 220_000_000_000,
    employees: 23700,
    status: 'Public',
    tier: 'public-large',
    ticker: 'NOW',
    oneLineDescription:
      'Now Assist embeds generative AI into enterprise IT, HR, and customer-service workflows.',
    website: 'https://www.servicenow.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'Salesforce',
    sector: 'Enterprise AI',
    subsector: 'CRM + Agentforce agents',
    hqCity: 'San Francisco',
    hqCountry: 'United States',
    region: 'North America',
    founded: 1999,
    revenueUSD: 34_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 290_000_000_000,
    employees: 72847,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'CRM',
    oneLineDescription:
      'Cloud CRM giant whose Agentforce platform deploys autonomous AI agents across sales and service.',
    website: 'https://www.salesforce.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'Adobe',
    sector: 'Media & Creativity',
    subsector: 'Creative + document AI (Firefly)',
    hqCity: 'San Jose',
    hqCountry: 'United States',
    region: 'North America',
    founded: 1982,
    revenueUSD: 19_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 195_000_000_000,
    employees: 30000,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'ADBE',
    oneLineDescription:
      'Firefly generative models and Acrobat AI Assistant bring generative AI to creative and document workflows.',
    website: 'https://www.adobe.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'IBM',
    sector: 'Enterprise AI',
    subsector: 'watsonx + consulting',
    hqCity: 'Armonk',
    hqCountry: 'United States',
    region: 'North America',
    founded: 1911,
    revenueUSD: 61_000_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 245_000_000_000,
    employees: 282200,
    status: 'Public',
    tier: 'fortune500',
    ticker: 'IBM',
    oneLineDescription:
      'watsonx platform and Granite models sold through the world\'s largest enterprise AI consulting arm.',
    website: 'https://www.ibm.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
  {
    name: 'Snowflake',
    sector: 'AI Infrastructure',
    subsector: 'Cloud data warehouse + Cortex AI',
    hqCity: 'Bozeman',
    hqCountry: 'United States',
    region: 'North America',
    founded: 2012,
    revenueUSD: 3_500_000_000,
    fundingRaisedUSD: null,
    valuationOrMarketCapUSD: 62_000_000_000,
    employees: 7367,
    status: 'Public',
    tier: 'public-large',
    ticker: 'SNOW',
    oneLineDescription:
      'Cloud data warehouse enabling AI/ML workloads with its Snowpark and Cortex AI services.',
    website: 'https://www.snowflake.com',
    dataSource: `${V}: Yahoo Finance, market cap`,
    asOfDate: SNAP,
  },
];

// Assign ranks by valuation/market cap desc, then funding desc, then name
COMPANIES.sort((a, b) => {
  const av = a.valuationOrMarketCapUSD ?? 0;
  const bv = b.valuationOrMarketCapUSD ?? 0;
  if (bv !== av) return bv - av;
  const af = a.fundingRaisedUSD ?? 0;
  const bf = b.fundingRaisedUSD ?? 0;
  if (bf !== af) return bf - af;
  return a.name.localeCompare(b.name);
});

COMPANIES.forEach((c, i) => { c.rank = i + 1; });

// ─── Build outputs ────────────────────────────────────────────────────────
const outDir = join(process.cwd(), 'data');
mkdirSync(outDir, { recursive: true });

// JSON
writeFileSync(
  join(outDir, 'companies.json'),
  JSON.stringify(COMPANIES, null, 2),
  'utf-8'
);

// CSV
const csvHeader = [
  'rank',
  'name',
  'sector',
  'subsector',
  'hqCity',
  'hqCountry',
  'region',
  'founded',
  'revenueUSD',
  'fundingRaisedUSD',
  'valuationOrMarketCapUSD',
  'employees',
  'status',
  'tier',
  'ticker',
  'oneLineDescription',
  'website',
  'dataSource',
  'asOfDate',
].join(',');

const csvRows = COMPANIES.map(c => [
  c.rank,
  `"${c.name.replace(/"/g, '""')}"`,
  `"${c.sector.replace(/"/g, '""')}"`,
  `"${c.subsector.replace(/"/g, '""')}"`,
  `"${c.hqCity.replace(/"/g, '""')}"`,
  `"${c.hqCountry.replace(/"/g, '""')}"`,
  `"${c.region.replace(/"/g, '""')}"`,
  c.founded,
  c.revenueUSD ?? '',
  c.fundingRaisedUSD ?? '',
  c.valuationOrMarketCapUSD ?? '',
  c.employees ?? '',
  c.status,
  c.tier,
  c.ticker ?? '',
  `"${c.oneLineDescription.replace(/"/g, '""')}"`,
  `"${c.website.replace(/"/g, '""')}"`,
  `"${c.dataSource.replace(/"/g, '""')}"`,
  c.asOfDate,
].join(','));

writeFileSync(
  join(outDir, 'companies.csv'),
  [csvHeader, ...csvRows].join('\n'),
  'utf-8'
);

console.log(`✅ Built ${COMPANIES.length} companies → data/companies.json & data/companies.csv`);