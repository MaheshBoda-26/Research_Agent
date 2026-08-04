export interface ResearchSource {
  id: number;
  title: string;
  url: string;
  domain: string;
  snippet: string;
}

export interface ReportSection {
  heading: string;
  body: string;
  bullets?: string[];
  sourceIds: number[];
}

export interface ResearchStat {
  label: string;
  value: string;
}

export interface ResearchReport {
  topic: string;
  summary: string;
  keyFacts: string[];
  sections: ReportSection[];
  sources: ResearchSource[];
  stats: ResearchStat[];
  generatedAt: string;
  provider: 'openrouter' | 'nvidia';
  searchQuery: string;
}

export interface TopicRequest {
  topic: string;
}

export interface ApiErrorBody {
  ok: false;
  error: { code: ApiErrorCode; message: string };
}

export type ApiErrorCode =
  | 'INVALID_TOPIC'
  | 'EMPTY_RESULTS'
  | 'SEARCH_FAILED'
  | 'SYNTHESIS_FAILED'
  | 'PARSE_FAILED'
  | 'CONFIG';

export type ResearchApiResponse =
  | { ok: true; report: ResearchReport }
  | ApiErrorBody;