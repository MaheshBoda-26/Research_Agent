import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResearch } from '../hooks/useResearch';
import LightPillar from '../components/animations/LightPillar';
import { AnimatedGridPattern } from '../components/animations/AnimatedGridPattern';

const SUGGESTIONS = [
  'AI in healthcare 2026',
  'Semiconductor supply chain',
  'Open-source LLM landscape',
  'Quantum computing commercialization',
  'Autonomous vehicle regulation',
];

const PROGRESS_STEPS = [
  { id: 'tavily', label: 'Scanning live web — Tavily' },
  { id: 'llm', label: 'Synthesizing report — LLM' },
];

export function AgentMode() {
  const navigate = useNavigate();
  const { topic, phase, report, error, history, research, cancel, clear } = useResearch();
  const [inputValue, setInputValue] = useState(topic);
  const [stage, setStage] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) research(inputValue.trim());
  };

  const handleSuggestion = (s: string) => {
    setInputValue(s);
    research(s);
  };

  const handleBack = () => navigate('/');

  const handleNewResearch = () => {
    clear();
    setInputValue('');
    setStage(0);
  };

  const handleRetry = () => {
    if (topic) research(topic);
  };

  const isActive = phase === 'researching' || phase === 'streaming';

  useEffect(() => {
    if (phase === 'researching' && stage === 0) {
      const t = setTimeout(() => setStage(1), 1500);
      return () => clearTimeout(t);
    }
  }, [phase, stage]);

  return (
    <div className="min-h-screen bg-canvas text-ink-700 selection:bg-accent selection:text-canvas relative overflow-hidden">
      {/* ── Futuristic Animated Background ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <LightPillar
          topColor="#F97316"
          bottomColor="#2563EB"
          intensity={0.8}
          rotationSpeed={0.15}
          glowAmount={0.004}
          pillarWidth={2.5}
          pillarHeight={0.35}
          noiseIntensity={0.4}
          pillarRotation={45}
          interactive={false}
          mixBlendMode="screen"
        />
      </div>
      <AnimatedGridPattern className="text-accent/15" numSquares={120} duration={6} width={80} height={80} />

      {/* ── Header ── */}
      <header className="relative border-b border-white/8 glass-panel sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fadeInDown">
            <Link
              to="/"
              onClick={handleBack}
              className="flex items-center gap-3 text-ink-900 hover:text-accent transition-colors group"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight">Agent Mode</span>
              <span className="flex items-center gap-1.5 ml-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span className="text-xs font-mono font-bold text-accent bg-accent-050 px-2 py-0.5 rounded-full border border-accent/30">LIVE</span>
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold font-display uppercase tracking-wider text-ink-500 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-ink-300 transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Hero Input */}
        <section className="stagger-children animate-fadeInUp">
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 glow-ring">
            <div className="space-y-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink-900">What should I research?</h2>
                <p className="mt-2 text-sm text-ink-500 max-w-2xl">Enter any topic — I'll scan the live web and synthesize a structured report with sources.</p>
              </div>

              <form onSubmit={handleSubmit} className="relative">
                <label htmlFor="topic-input" className="sr-only">Research topic</label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    id="topic-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g. AI in healthcare 2026, semiconductor supply chain, open-source LLM landscape..."
                    disabled={isActive}
                    className="w-full bg-surface-1/40 border border-white/10 rounded-xl pl-12 pr-16 py-4 sm:py-5 text-base sm:text-lg text-ink-900 placeholder:text-ink-500 focus:border-accent focus:ring-2 focus:ring-accent/20 focus:outline-none transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {inputValue && !isActive && (
                    <button
                      type="button"
                      onClick={() => setInputValue('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-600 transition-colors"
                      aria-label="Clear"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {isActive && (
                    <button
                      type="button"
                      onClick={cancel}
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 text-xs font-bold font-display uppercase tracking-wider text-neon-magenta bg-neon-magenta/10 border border-neon-magenta/30 rounded-lg hover:bg-neon-magenta/20 transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isActive}
                  className="mt-4 w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold font-display uppercase tracking-wider text-canvas bg-accent border border-accent/30 hover:bg-accent-hover hover:shadow-[0_0_20px_oklch(0.72_0.19_220/0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                >
                  {isActive ? 'Researching…' : 'Research'}
                </button>
              </form>

              {/* Suggestion chips */}
              {!topic && phase === 'idle' && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-ink-500 mr-2 self-center">Try:</span>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSuggestion(s)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium text-ink-700 bg-white/5 border border-white/10 hover:border-accent/50 hover:bg-accent/10 hover:text-accent transition-all chip-transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* History */}
              {history.length > 0 && phase === 'idle' && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-ink-500 mb-2">Recent:</p>
                  <div className="flex flex-wrap gap-2">
                    {history.slice(0, 5).map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleSuggestion(h)}
                        className="px-3 py-1 rounded-full text-xs font-medium text-ink-600 bg-white/5 border border-white/10 hover:border-accent/30 hover:bg-accent/10 hover:text-accent transition-all chip-transition truncate max-w-[180px]"
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Progress Panel */}
        {(phase === 'researching' || phase === 'streaming') && (
          <section className="stagger-children animate-fadeInUp">
            <div className="glass-panel rounded-2xl p-6 border border-white/10 glow-ring">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <div>
                  <p className="font-display font-bold text-lg text-ink-900">Researching <span className="text-accent">{topic}</span></p>
                  <p className="text-sm text-ink-500">This takes 15-30 seconds. Pulling live data and synthesizing…</p>
                </div>
              </div>

              <div className="space-y-4" role="status" aria-live="polite">
                {PROGRESS_STEPS.map((step, i) => {
                  const isCurrent = i === stage;
                  const isDone = i < stage;
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        isCurrent
                          ? 'bg-accent/5 border border-accent/30 animate-pulse-glow'
                          : isDone
                          ? 'bg-emerald/5 border border-emerald/30'
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-mono font-bold transition-all ${
                        isDone
                          ? 'bg-emerald text-canvas'
                          : isCurrent
                          ? 'bg-accent text-canvas animate-ping-ring'
                          : 'bg-white/10 text-ink-500'
                      }`}>
                        {isDone ? (
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${isDone ? 'text-emerald' : isCurrent ? 'text-accent' : 'text-ink-700'}`}>
                          {step.label}
                        </p>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isDone ? 'w-full bg-emerald' : isCurrent ? 'w-1/3 bg-accent animate-shimmer' : 'w-0'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Error State */}
        {error && phase === 'error' && (
          <section className="stagger-children animate-fadeInUp">
            <div className="glass-panel rounded-2xl p-6 border border-neon-magenta/30 glow-ring">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-neon-magenta/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-neon-magenta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-lg text-ink-900">Research failed</p>
                  <p className="mt-1 text-sm text-ink-600">{error.message}</p>
                  <p className="mt-2 text-xs font-mono text-neon-magenta">Code: {error.code}</p>
                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 rounded-lg text-sm font-bold font-display uppercase tracking-wider text-canvas bg-accent border border-accent/30 hover:bg-accent-hover transition-all"
                    >
                      Retry
                    </button>
                    <button
                      onClick={handleNewResearch}
                      className="px-4 py-2 rounded-lg text-sm font-bold font-display uppercase tracking-wider text-ink-700 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-ink-900 transition-all"
                    >
                      New Topic
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Report */}
        {report && phase === 'done' && (
          <section className="stagger-children animate-fadeInUp space-y-6">
            {/* Summary */}
            <div className="glass-panel rounded-2xl p-6 border border-white/10 glow-ring">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-ink-900 flex items-center gap-2">
                    Executive Summary
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  </h3>
                  <p className="mt-2 text-sm text-ink-700 leading-relaxed">{report.summary}</p>
                </div>
              </div>
            </div>

            {/* Key Facts */}
            {report.keyFacts.length > 0 && (
              <div className="glass-panel rounded-2xl p-6 border border-white/10 glow-ring">
                <h3 className="font-display text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
                  Key Facts
                  <span className="text-sm font-normal text-ink-500">({report.keyFacts.length})</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.keyFacts.map((fact, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-xs text-ink-700 bg-white/5 border border-white/10 hover:border-accent/30 hover:bg-accent/10 transition-all">
                      {fact}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Grid */}
            {report.stats.length > 0 && (
              <div className="glass-panel rounded-2xl p-6 border border-white/10 glow-ring">
                <h3 className="font-display text-lg font-bold text-ink-900 mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {report.stats.map((stat, i) => (
                    <div key={i} className="glass-panel-interactive p-5 rounded-2xl border border-white/10">
                      <p className="text-xs text-ink-500 uppercase tracking-wider font-medium mb-1">{stat.label}</p>
                      <p className="font-mono text-accent text-lg font-bold">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sections */}
            <div className="space-y-4">
              {report.sections.map((section, si) => (
                <article key={si} className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 glow-ring">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <span className="font-display font-bold text-accent text-sm">{si + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base sm:text-lg font-bold text-ink-900">{section.heading}</h3>
                      <p className="mt-2 text-sm text-ink-700 leading-relaxed">
                        {section.body}
                        {section.sourceIds.length > 0 && (
                          <span className="ml-1 flex items-center gap-0.5">
                            {section.sourceIds.map((id) => (
                              <a
                                key={id}
                                href={`#source-${id}`}
                                className="text-[10px] font-mono font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded border border-accent/30 hover:bg-accent/20 transition-all"
                              >
                                [{id}]
                              </a>
                            ))}
                          </span>
                        )}
                      </p>
                      {section.bullets && section.bullets.length > 0 && (
                        <ul className="mt-3 space-y-1.5 pl-4">
                          {section.bullets.map((bullet, bi) => (
                            <li key={bi} className="text-sm text-ink-700 leading-relaxed flex gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent/50 mt-2 flex-shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Sources */}
            <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 glow-ring">
              <h3 className="font-display text-lg font-bold text-ink-900 mb-4 flex items-center gap-2">
                Sources
                <span className="text-sm font-normal text-ink-500">({report.sources.length})</span>
              </h3>
              <ol className="space-y-3">
                {report.sources.map((source) => (
                  <li key={source.id} id={`source-${source.id}`} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent/30 hover:bg-accent/5 transition-all group">
                    <span className="w-7 h-7 rounded-full bg-accent/10 text-accent text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 border border-accent/30">
                      {source.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-sm text-ink-900 hover:text-accent transition-colors group-hover:underline pr-6"
                      >
                        {source.title}
                      </a>
                      <p className="mt-1 flex items-center gap-2 text-xs text-ink-500">
                        <span className="font-mono text-accent/80">{source.domain}</span>
                        <span className="w-1 h-1 rounded-full bg-ink-500/30" />
                        <span className="truncate max-w-xs">{source.snippet}</span>
                      </p>
                    </div>
                    <svg className="w-4 h-4 text-ink-400 group-hover:text-accent transition-colors flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </li>
                ))}
              </ol>
            </div>

            {/* Footer */}
            <div className="glass-panel rounded-2xl p-5 border border-white/10 glow-ring">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    report.provider === 'openrouter'
                      ? 'bg-accent/10 text-accent border border-accent/30'
                      : 'bg-emerald/10 text-emerald border border-emerald/30'
                  }`}>
                    {report.provider === 'openrouter' ? 'OpenRouter (gpt-4o-mini)' : 'NVIDIA NIM (Llama 3.3 70B)'}
                  </span>
                  <span className="text-xs text-ink-500 font-mono">
                    Generated {new Date(report.generatedAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleNewResearch}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold font-display uppercase tracking-wider text-canvas bg-accent border border-accent/30 hover:bg-accent-hover hover:shadow-[0_0_20px_oklch(0.72_0.19_220/0.4)] transition-all"
                >
                  New Research
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Empty / Idle state hint */}
        {!topic && phase === 'idle' && history.length === 0 && (
          <section className="stagger-children animate-fadeInUp">
            <div className="glass-panel rounded-2xl p-12 text-center border border-white/10">
              <svg className="w-16 h-16 mx-auto text-ink-500/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="font-display text-xl font-bold text-ink-900">Ready to research</h3>
              <p className="mt-2 text-sm text-ink-500 max-w-md mx-auto">Type a topic above and I'll scan the live web, synthesize findings, and deliver a structured report with citations.</p>
            </div>
          </section>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/8 glass-panel mt-16 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-xs text-ink-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            Live web research via Tavily · LLM synthesis via OpenRouter / NVIDIA NIM · Data never cached
          </p>
          <p className="font-mono text-ink-700 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Agent Mode · React 19 + Tailwind v4 + Vercel Functions
          </p>
        </div>
      </footer>
    </div>
  );
}