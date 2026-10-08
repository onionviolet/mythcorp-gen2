'use client';

import { FIGURE } from './figureNumbers';
import { useEffect, useRef, useState } from 'react';
import { ClaimTag, ForecastFrame, Supplement } from './PaperApparatus';
import { StoryVignette } from './StoryVignette';
import styles from './paperMotion.module.css';
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

const RIBBON_START = 2025;
const RIBBON_END = 2030;
const NOW_YEAR = 2026 + 9 / 12;
const AFTER_LAST_CHAPTER = 2030;

function YearRibbon({ pos }: { pos: number }) {
  const pct = (y: number) => Math.min(100, Math.max(0, ((y - RIBBON_START) / (RIBBON_END - RIBBON_START)) * 100));
  const solid = pct(Math.min(pos, NOW_YEAR));
  const dashed = pct(pos);
  return (
    <div aria-hidden className="mt-3">
      <div className="relative h-1.5 bg-[color:var(--border)]" style={{ borderRadius: 'var(--radius-sm)' }}>
        <span className="absolute inset-y-0 left-0 block bg-[color:var(--accent)]" style={{ width: `${solid}%` }} />
        {dashed > solid && (
          <span
            className="absolute inset-y-0 block border-y border-dashed border-[color:var(--accent)]"
            style={{ left: `${solid}%`, width: `${dashed - solid}%` }}
          />
        )}
        <span className="absolute -top-1 block h-3.5 w-px bg-[color:var(--fg)]" style={{ left: `${pct(NOW_YEAR)}%` }} />
      </div>
      <div className="relative mt-1 h-3 font-mono text-[9px] text-[color:var(--fg-subtle)]">
        {[2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
          <span key={y} className="absolute -translate-x-1/2" style={{ left: `${pct(y)}%` }}>{String(y).slice(2)}</span>
        ))}
      </div>
    </div>
  );
}

function ScenarioDashboard({ chapter, pos }: { chapter: ScenarioChapter; pos: number }) {
  return (
    <div className="themed-surface p-4" style={{ background: 'var(--bg-elevated)' }}>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--fg-subtle)]">scenario readout</p>
      <div key={chapter.id} className={styles.tick}>
        <p className="mt-2 font-serif text-2xl leading-tight text-[color:var(--fg)]">{chapter.when}</p>
        <p className="mt-1 text-sm text-[color:var(--fg-muted)]">
          Stage {chapter.stage}: {chapter.stageName}
        </p>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <ClaimTag kind={chapter.kind} />
        <span className="font-mono text-[10px] text-[color:var(--fg-subtle)]">confidence: {chapter.confidence}</span>
      </div>
      <YearRibbon pos={pos} />
      <p className="font-mono text-[9px] text-[color:var(--fg-subtle)]">solid to now (Oct 2026), dashed after</p>
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

function ScenarioStrip({ chapter, pos }: { chapter: ScenarioChapter; pos: number }) {
  return (
    <div
      className="border-b border-[color:var(--border)] px-1 py-2 backdrop-blur"
      style={{ background: 'color-mix(in oklab, var(--bg) 88%, transparent)' }}
    >
      <div key={chapter.id} className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${styles.tick}`}>
        <span className="font-mono text-xs text-[color:var(--fg)]">{chapter.when}</span>
        <span className="text-xs text-[color:var(--fg-muted)]">S{chapter.stage} {chapter.stageName}</span>
        <ClaimTag kind={chapter.kind} />
      </div>
      <YearRibbon pos={pos} />
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
  const vignette = chapter.vignette ? <div className="mb-6 mt-4"><StoryVignette vignette={chapter.vignette} /></div> : null;
  if (chapter.kind === 'forecast') {
    return (
      <>
      {vignette}
      <ForecastFrame label={`forecast, confidence ${chapter.confidence}`}>
        {chapter.body}
        <div className="pt-2">{facts}</div>
        {inference}
      </ForecastFrame>
      </>
    );
  }
  return (
    <div className="mt-4 space-y-4">
      {vignette}
      {chapter.body}
      <div className="pt-2">{facts}</div>
      {inference}
    </div>
  );
}

export function ScenarioSection() {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(SCENARIO_CHAPTERS[0].year);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const line = window.innerHeight * 0.45;
      const els = refs.current;
      let i = 0;
      for (let k = 0; k < els.length; k++) {
        const el = els[k];
        if (el && el.getBoundingClientRect().top <= line) i = k;
      }
      const el = els[i];
      const r = el?.getBoundingClientRect();
      const frac = r ? Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height))) : 0;
      const from = SCENARIO_CHAPTERS[i].year;
      const to = SCENARIO_CHAPTERS[i + 1]?.year ?? AFTER_LAST_CHAPTER;
      setActive(i);
      setPos(from + frac * (to - from));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const chapter = SCENARIO_CHAPTERS[active];

  return (
    <div className="relative mt-8 xl:-ml-[16rem] xl:grid xl:grid-cols-[14rem_minmax(0,1fr)] xl:gap-8">
      <aside aria-label="Scenario readout" className="hidden xl:block print:hidden">
        <div className="sticky top-24">
          <ScenarioDashboard chapter={chapter} pos={pos} />
        </div>
      </aside>

      <div>
        <div className="sticky top-[70px] z-20 -mx-1 mb-4 sm:top-[82px] xl:hidden print:hidden" role="region" aria-label="Scenario readout">
          <ScenarioStrip chapter={chapter} pos={pos} />
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
              <h4 id={`${c.id}-title`} className="mt-1 font-serif text-2xl font-semibold text-[color:var(--fg)]">
                Stage {c.stage}: {c.stageName}
              </h4>
              <ChapterBody chapter={c} />
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
