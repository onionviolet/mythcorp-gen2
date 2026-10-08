'use client';

import { FIGURE } from './figureNumbers';
import { useEffect, useRef, useState } from 'react';
import { ClaimTag, ForecastFrame, Supplement } from './PaperApparatus';
import {
  INDICATORS,
  SCENARIO_CHAPTERS,
  type IndicatorStatus,
  type ScenarioChapter,
} from './scenarioChapters';

function StatusMark({ status }: { status: IndicatorStatus }) {
  const cls =
    status === 'measured'
      ? 'border-[color:var(--fg-muted)] text-[color:var(--fg)]'
      : status === 'scenario'
        ? 'border-dashed border-[color:var(--accent)] text-[color:var(--accent)]'
        : 'border-dotted border-[color:var(--border-strong)] text-[color:var(--fg-subtle)]';
  return (
    <span className={`inline-block border px-1 font-mono text-[9px] uppercase tracking-widest ${cls}`} style={{ borderRadius: 'var(--radius-sm)' }}>
      {status}
    </span>
  );
}

function ScenarioDashboard({ chapter, index }: { chapter: ScenarioChapter; index: number }) {
  return (
    <div className="themed-surface p-4" style={{ background: 'var(--bg-elevated)' }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--fg-subtle)]">scenario readout</p>
      <p className="mt-2 font-serif text-2xl leading-tight text-[color:var(--fg)]">{chapter.when}</p>
      <p className="mt-1 text-sm text-[color:var(--fg-muted)]">
        Stage {chapter.stage}: {chapter.stageName}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <ClaimTag kind={chapter.kind} />
        <span className="font-mono text-[10px] text-[color:var(--fg-subtle)]">confidence: {chapter.confidence}</span>
      </div>
      <div aria-hidden className="mt-3 flex gap-1">
        {SCENARIO_CHAPTERS.map((c, i) => (
          <span
            key={c.id}
            className={`h-1 flex-1 ${i <= index ? 'bg-[color:var(--accent)]' : 'bg-[color:var(--border)]'}`}
            style={c.kind === 'forecast' && i <= index ? { opacity: 0.55 } : undefined}
          />
        ))}
      </div>
      <dl className="mt-4 space-y-3">
        {INDICATORS.map((ind) => {
          const r = chapter.readings[ind.key];
          return (
            <div key={ind.key}>
              <dt className="flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
                {ind.name} <StatusMark status={r.status} />
              </dt>
              <dd className="mt-0.5 text-sm text-[color:var(--fg)]">{r.value}</dd>
            </div>
          );
        })}
      </dl>
      <details className="mt-4 text-[11px] leading-relaxed text-[color:var(--fg-subtle)]">
        <summary className="cursor-pointer font-mono hover:text-[color:var(--fg)]">what these mean</summary>
        <ul className="mt-2 space-y-2">
          {INDICATORS.map((ind) => (
            <li key={ind.key}><span className="text-[color:var(--fg-muted)]">{ind.name}.</span> {ind.definition}</li>
          ))}
          <li>Scenario values after May 2026 extend METR&rsquo;s 131-day doubling from a 16-hour floor (Figure {FIGURE.horizon}).</li>
        </ul>
      </details>
    </div>
  );
}

function ScenarioStrip({ chapter }: { chapter: ScenarioChapter }) {
  return (
    <div
      className="border-b border-[color:var(--border)] px-1 py-2 backdrop-blur"
      style={{ background: 'color-mix(in oklab, var(--bg) 88%, transparent)' }}
    >
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-mono text-xs text-[color:var(--fg)]">{chapter.when}</span>
        <span className="text-xs text-[color:var(--fg-muted)]">S{chapter.stage} {chapter.stageName}</span>
        <ClaimTag kind={chapter.kind} />
      </div>
      <div className="mt-1 grid grid-cols-3 gap-2 font-mono text-[10px] leading-tight text-[color:var(--fg-subtle)]">
        {INDICATORS.map((ind) => {
          const r = chapter.readings[ind.key];
          return (
            <span key={ind.key} className="min-w-0">
              <span className="block">{ind.name}</span>
              <span className={`block break-words ${r.status === 'scenario' ? 'text-[color:var(--accent)]' : 'text-[color:var(--fg)]'}`}>{r.value}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ChapterBody({ chapter }: { chapter: ScenarioChapter }) {
  const facts = (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      {([
        ['Trigger', chapter.trigger],
        ['For attackers', chapter.attackers],
        ['For defenders', chapter.defenders],
        ['Confidence', chapter.confidence],
      ] as const).map(([k, v]) => (
        <div key={k}>
          <dt className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">{k}</dt>
          <dd className="mt-1 text-[color:var(--fg-muted)]">{v}</dd>
        </div>
      ))}
    </dl>
  );
  const inference = (
    <Supplement title={chapter.kind === 'forecast' ? 'How I get from the data to this forecast' : 'Why this counts as this stage'}>
      {chapter.inference}
    </Supplement>
  );
  if (chapter.kind === 'forecast') {
    return (
      <ForecastFrame label={`forecast, confidence ${chapter.confidence}`}>
        {chapter.body}
        <div className="pt-2">{facts}</div>
        {inference}
      </ForecastFrame>
    );
  }
  return (
    <div className="mt-4 space-y-4">
      {chapter.body}
      <div className="pt-2">{facts}</div>
      {inference}
    </div>
  );
}

export function ScenarioSection() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter((e): e is HTMLElement => e !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (hit) {
          const i = els.indexOf(hit.target as HTMLElement);
          if (i >= 0) setActive(i);
        }
      },
      { rootMargin: '-35% 0% -55% 0%', threshold: [0, 0.01] },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const chapter = SCENARIO_CHAPTERS[active];

  return (
    <div className="relative mt-8 xl:-ml-[16rem] xl:grid xl:grid-cols-[14rem_minmax(0,1fr)] xl:gap-8">
      <aside aria-label="Scenario readout" className="hidden xl:block">
        <div className="sticky top-24">
          <ScenarioDashboard chapter={chapter} index={active} />
        </div>
      </aside>

      <div>
        <div className="sticky top-[70px] z-20 -mx-1 mb-4 sm:top-[82px] xl:hidden" role="region" aria-label="Scenario readout">
          <ScenarioStrip chapter={chapter} />
        </div>
        <div className="space-y-16">
          {SCENARIO_CHAPTERS.map((c, i) => (
            <article
              key={c.id}
              id={c.id}
              ref={(el) => { refs.current[i] = el; }}
              aria-labelledby={`${c.id}-title`}
              className="scroll-mt-32"
            >
              <p className="font-mono text-xs text-[color:var(--accent)]">{c.when}</p>
              <h3 id={`${c.id}-title`} className="mt-1 font-serif text-2xl font-semibold text-[color:var(--fg)]">
                Stage {c.stage}: {c.stageName}
              </h3>
              <ChapterBody chapter={c} />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
