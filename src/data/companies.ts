// Re-export types from unified source
export type { Company, CompanyTier, CompanyStatus, Region, Sector } from '../types/company';
export { SECTORS, REGIONS } from '../types/company';

// Import type for the JSON import
import type { Company } from '../types/company';

// Import generated dataset
import companiesData from '../../data/companies.json';

export const companies = companiesData as Company[];