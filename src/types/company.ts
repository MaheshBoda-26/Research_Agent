// src/types/company.ts
export type CompanyTier = 
  | 'fortune500' 
  | 'big-tech' 
  | 'ai-frontier' 
  | 'unicorn' 
  | 'public-large' 
  | 'public-mid';

export type CompanyStatus = 'Public' | 'Private' | 'Acquired' | 'Defunct';

export type Region = 
  | 'North America' 
  | 'Europe' 
  | 'Asia-Pacific' 
  | 'Middle East' 
  | 'Latin America' 
  | 'Africa';

export type Sector = 
  | 'Foundation Models'
  | 'AI Infrastructure'
  | 'Enterprise AI'
  | 'Healthcare & Life Sciences'
  | 'Fintech'
  | 'Autonomous Systems & Robotics'
  | 'Cybersecurity'
  | 'Developer Tools'
  | 'AI Hardware'
  | 'Media & Creativity'
  | 'Education'
  | 'Other';

export interface Company {
  rank?: number;
  name: string;
  sector: Sector;
  subsector: string;
  hqCity: string;
  hqCountry: string;
  region: Region;
  founded: number;
  revenueUSD: number | null;
  fundingRaisedUSD: number | null;
  valuationOrMarketCapUSD: number | null;
  employees: number | null;
  status: CompanyStatus;
  tier: CompanyTier;
  ticker: string | null;
  oneLineDescription: string;
  website: string;
  dataSource: string;
  asOfDate: string; // YYYY-MM-DD
}

export const SECTORS: readonly Sector[] = [
  'Foundation Models',
  'AI Infrastructure',
  'Enterprise AI',
  'Healthcare & Life Sciences',
  'Fintech',
  'Autonomous Systems & Robotics',
  'Cybersecurity',
  'Developer Tools',
  'AI Hardware',
  'Media & Creativity',
  'Education',
  'Other',
] as const;

export const REGIONS: readonly Region[] = [
  'North America',
  'Europe',
  'Asia-Pacific',
  'Middle East',
  'Latin America',
  'Africa',
] as const;