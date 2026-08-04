import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ResearchReport, ResearchApiResponse } from '../types/research';

export type ResearchPhase = 'idle' | 'researching' | 'streaming' | 'done' | 'error';

export function useResearch() {
  const [params, setParams] = useSearchParams();
  const [topic, setTopic] = useState(() => params.get('topic') ?? '');
  const [phase, setPhase] = useState<ResearchPhase>(params.get('topic') ? 'researching' : 'idle');
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const didAutoRun = useRef(false);

  const research = useCallback(async (topic: string) => {
    const trimmed = topic.trim();
    if (!trimmed) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setTopic(trimmed);
    setParams({ topic: trimmed }, { replace: true });
    setReport(null);
    setError(null);
    setPhase('researching');
    setHistory((h) => (h.includes(trimmed) ? h : [trimmed, ...h].slice(0, 10)));
    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: trimmed }),
        signal: controller.signal,
      });
      setPhase('streaming');
      const data = (await res.json()) as ResearchApiResponse;
      if (!res.ok || !data.ok) {
        setError(data.ok ? { code: 'UNKNOWN', message: 'Request failed' } : data.error);
        setPhase('error');
        return;
      }
      setReport(data.report);
      setPhase('done');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError({ code: 'NETWORK', message: 'Could not reach the research service.' });
      setPhase('error');
    }
  }, [setParams]);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setPhase((p) => (p === 'researching' || p === 'streaming' ? 'idle' : p));
  }, []);

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setParams({}, { replace: true });
    setReport(null);
    setError(null);
    setTopic('');
    setPhase('idle');
  }, [setParams]);

  useEffect(() => {
    const t = params.get('topic');
    if (t && !didAutoRun.current && phase === 'researching') {
      didAutoRun.current = true;
      void research(t);
    }
  }, [params, research, phase]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return { topic, phase, report, error, history, research, cancel, clear };
}