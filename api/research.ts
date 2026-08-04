import type { ResearchReport, TopicRequest } from '../src/types/research.js';

export const config = { maxDuration: 30 };

const PROVIDERS = [
  {
    name: 'openrouter' as const,
    url: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: process.env.OPENROUTER_API_KEY,
    model: 'openai/gpt-oss-20b:free',
  },
  {
    name: 'nvidia' as const,
    url: 'https://integrate.api.nvidia.com/v1/chat/completions',
    apiKey: process.env.NVIDIA_API_KEY,
    model: 'meta/llama-3.3-70b-instruct',
  },
];

function getPrimaryFirst() {
  const preferred = process.env.LLM_PROVIDER === 'nvidia' ? 'nvidia' : 'openrouter';
  const primary = PROVIDERS.find((p) => p.name === preferred);
  const secondary = PROVIDERS.find((p) => p.name !== preferred);
  return [primary, secondary].filter(Boolean) as typeof PROVIDERS;
}

function stripFences(text: string): string {
  return text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
}

function validateReport(raw: unknown, allowedUrls: string[]): ResearchReport | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;

  if (typeof r.topic !== 'string' || r.topic.length < 3) return null;
  if (typeof r.summary !== 'string' || r.summary.length < 10) return null;
  if (!Array.isArray(r.keyFacts) || r.keyFacts.some((k) => typeof k !== 'string')) return null;
  if (!Array.isArray(r.sections) || r.sections.length < 1) return null;
  if (!Array.isArray(r.sources) || r.sources.length < 1) return null;
  if (!Array.isArray(r.stats)) return null;

  const sections = r.sections as Array<Record<string, unknown>>;
  const sources = r.sources as Array<Record<string, unknown>>;

  const sourceIdSet = new Set(sources.map((_s, i) => i + 1));
  const allowedUrlSet = new Set(allowedUrls);

  for (const s of sections) {
    if (typeof s.heading !== 'string' || typeof s.body !== 'string') return null;
    if (s.bullets !== undefined && (!Array.isArray(s.bullets) || s.bullets.some((b) => typeof b !== 'string'))) return null;
    if (!Array.isArray(s.sourceIds) || s.sourceIds.length === 0) return null;
    for (const id of s.sourceIds) {
      if (typeof id !== 'number' || !sourceIdSet.has(id)) return null;
    }
  }

  for (const s of sources) {
    if (typeof s.title !== 'string' || typeof s.url !== 'string') return null;
    if (!allowedUrlSet.has(s.url)) return null;
  }

  return {
    topic: r.topic,
    summary: r.summary,
    keyFacts: r.keyFacts as string[],
    sections: sections.map((s) => ({
      heading: s.heading as string,
      body: s.body as string,
      bullets: s.bullets as string[] | undefined,
      sourceIds: s.sourceIds as number[],
    })),
    sources: sources.map((s, i) => ({
      id: i + 1,
      title: s.title as string,
      url: s.url as string,
      domain: new URL(s.url as string).hostname,
      snippet: '',
    })),
    stats: (r.stats as Array<Record<string, unknown>>).map((s) => ({
      label: typeof s.label === 'string' ? s.label : '',
      value: typeof s.value === 'string' ? s.value : '',
    })),
    generatedAt: '',
    provider: 'openrouter',
    searchQuery: '',
  };
}

async function callProvider(
  provider: { name: 'openrouter' | 'nvidia'; url: string; apiKey: string | undefined; model: string },
  prompt: string,
  allowedUrls: string[]
): Promise<ResearchReport | null> {
  if (!provider.apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const res = await fetch(provider.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`${provider.name} error ${res.status}:`, text);
      return null;
    }

    const data: { choices?: Array<{ message?: { content?: string } }> } = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const cleaned = stripFences(content);
    let parsed: unknown;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return null;
    }

    const validated = validateReport(parsed, allowedUrls);
    return validated;
  } catch (err) {
    clearTimeout(timeout);
    console.error(`${provider.name} request failed:`, err);
    return null;
  }
}

const SYSTEM_PROMPT = `You are a senior research analyst. Produce a research report as JSON ONLY, with exactly this shape:
{
  "summary": string,
  "keyFacts": string[],
  "sections": [{ "heading": string, "body": string, "bullets"?: string[], "sourceIds": number[] }],
  "stats": [{ "label": string, "value": string }],
  "sources": [{ "title": string, "url": string }]
}
Hard rules:
- Base every claim ONLY on the provided search results. Never invent facts, URLs, or stats.
- Every url in "sources" must be copied verbatim from the provided search results.
- "sourceIds" in each section must be valid 1-based indexes into your "sources" array.
- 3-6 sections, 1-3 short paragraphs each.
- Today's date is ${new Date().toISOString().split('T')[0]}. Return the raw JSON object with no markdown fences and no commentary.`;

export async function POST(request: Request): Promise<Response> {
  let body: TopicRequest;
  try {
    body = await request.json() as TopicRequest;
  } catch {
    return Response.json(
      { ok: false, error: { code: 'INVALID_TOPIC', message: 'Invalid JSON body' } },
      { status: 400 }
    );
  }

  const topic = body.topic?.trim?.() ?? '';
  if (!topic || topic.length < 3 || topic.length > 120) {
    return Response.json(
      { ok: false, error: { code: 'INVALID_TOPIC', message: 'Topic must be 3-120 characters' } },
      { status: 400 }
    );
  }

  const tavilyKey = process.env.TAVILY_API_KEY;
  if (!tavilyKey) {
    return Response.json(
      { ok: false, error: { code: 'CONFIG', message: 'TAVILY_API_KEY not configured' } },
      { status: 500 }
    );
  }

  let tavilyResults: Array<{ title: string; url: string; content?: string; raw_content?: string }>;
  try {
    const tavilyController = new AbortController();
    const tavilyTimeout = setTimeout(() => tavilyController.abort(), 15_000);

    const tavilyRes = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tavilyKey}`,
      },
      body: JSON.stringify({
        query: topic,
        search_depth: 'advanced',
        include_raw_content: true,
        max_results: 8,
      }),
      signal: tavilyController.signal,
    });

    clearTimeout(tavilyTimeout);

    if (!tavilyRes.ok) {
      const text = await tavilyRes.text().catch(() => '');
      return Response.json(
        { ok: false, error: { code: 'SEARCH_FAILED', message: `Tavily error ${tavilyRes.status}: ${text}` } },
        { status: 502 }
      );
    }

    const tavilyData: { results?: Array<{ title: string; url: string; content?: string; raw_content?: string }> } = await tavilyRes.json() as { results?: Array<{ title: string; url: string; content?: string; raw_content?: string }> };
    tavilyResults = (tavilyData.results ?? []).slice(0, 8);

    if (tavilyResults.length === 0) {
      return Response.json(
        { ok: false, error: { code: 'EMPTY_RESULTS', message: 'No results found for topic' } },
        { status: 400 }
      );
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return Response.json(
      { ok: false, error: { code: 'SEARCH_FAILED', message: `Tavily request failed: ${msg}` } },
      { status: 502 }
    );
  }

  const allowedUrls = tavilyResults.map((r) => r.url);

  const promptSources = tavilyResults.map((r) => ({
    title: r.title,
    url: r.url,
    content: (r.content ?? '').slice(0, 1500),
    raw_content: (r.raw_content ?? '').slice(0, 6000),
  }));

  const providers = getPrimaryFirst().filter((p) => p.apiKey);
  if (providers.length === 0) {
    return Response.json(
      { ok: false, error: { code: 'CONFIG', message: 'No LLM provider keys configured' } },
      { status: 500 }
    );
  }

  let report: ResearchReport | null = null;
  let lastError: string | null = null;

  for (const provider of providers) {
    const candidate = await callProvider(provider, JSON.stringify(promptSources), allowedUrls);
    if (candidate) {
      report = candidate;
      break;
    }
    lastError = `${provider.name} failed`;
  }

  if (!report) {
    return Response.json(
      { ok: false, error: { code: 'SYNTHESIS_FAILED', message: `All LLM providers failed. Last: ${lastError}` } },
      { status: 502 }
    );
  }

  report.generatedAt = new Date().toISOString();
  report.provider = providers.find((p) => p.apiKey)?.name ?? 'openrouter';
  report.searchQuery = topic;
  report.sources = tavilyResults.map((r, i) => ({
    id: i + 1,
    title: r.title,
    url: r.url,
    domain: new URL(r.url).hostname,
    snippet: (r.content ?? '').slice(0, 200),
  }));

  return Response.json({ ok: true, report });
}