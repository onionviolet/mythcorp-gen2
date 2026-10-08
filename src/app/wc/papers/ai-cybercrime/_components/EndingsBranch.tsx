'use client';

import { useState, type ReactNode } from 'react';
import { Cite, FigureCaption } from './PaperApparatus';

type Signpost = { watch: string; reading: ReactNode };

type Ending = {
  key: 'outrun' | 'pace';
  letter: 'A' | 'B';
  name: string;
  story: ReactNode;
  conditions: ReactNode[];
  signposts: Signpost[];
};

const ENDINGS: ReadonlyArray<Ending> = [
  {
    key: 'outrun',
    letter: 'A',
    name: 'Discovery outruns repair',
    story: (
      <>
        <p>
          By 2030 the count of known but unfixed flaws grows every quarter. Downloadable models find them as
          fast as gated ones did in 2026, and the people who patch are the same people as before. Attacks get
          cheaper and more frequent, and the damage lands on whoever patches slowest.
        </p>
        <p>
          Fraud grows on its own track. Impersonation never needed a software flaw, so nothing in this race
          slows it down.
        </p>
      </>
    ),
    conditions: [
      <>Expert-level models ship as open weights without safeguards that hold. Anthropic&rsquo;s tests on the September 2026 open model found its safeguards easy to get around.<Cite ids={['anthropic-2026-09']} /></>,
      <>Patching stays bound to human maintainers, the bottleneck Anthropic named in May 2026.<Cite ids={['glasswing-2026-05']} /></>,
      <>Most organizations do not adopt AI defenses, the divide the NCSC expected by 2027.<Cite ids={['ncsc-2025']} /></>,
    ],
    signposts: [
      { watch: 'CAISI open-weight lag shrinks toward zero', reading: <>about 4 months in Sep 2026<Cite ids={['caisi-2026-09']} /></> },
      { watch: 'Maintainers ask AI finders to slow down', reading: <>already reported in May 2026<Cite ids={['glasswing-2026-05']} /></> },
      { watch: 'Threat reports describe campaigns with no human decision points', reading: <>not yet; 4 to 6 human decisions in Nov 2025<Cite ids={['anthropic-2025-11']} /></> },
    ],
  },
  {
    key: 'pace',
    letter: 'B',
    name: 'Repair keeps pace',
    story: (
      <>
        <p>
          By 2030 AI patching is as cheap as AI discovery, and the backlog of easy flaws drains while the best
          finders are still mostly in defenders&rsquo; hands. Intrusion gets harder. Attackers who wanted cheap
          exploits find fewer of them.
        </p>
        <p>
          Fraud still grows. This ending protects software, and impersonation attacks people, so the fraud rows
          of Figure 2 stay where they are.
        </p>
      </>
    ),
    conditions: [
      <>Automated patching scales. DARPA&rsquo;s finalists patched 43 flaws at about $152 a task and released their systems as open source.<Cite ids={['aixcc-2025']} /></>,
      <>The gated head start lasts long enough to clear the backlog in widely used software.</>,
      <>Maintainers of shared code get money and tools, as in the open-source donations announced with Project Glasswing.<Cite ids={['glasswing-2026-04']} /></>,
    ],
    signposts: [
      { watch: 'Share of reported flaws that get patched rises', reading: <>75 of 530 in May 2026<Cite ids={['glasswing-2026-05']} /></> },
      { watch: 'Time from report to patch falls', reading: <>about two weeks on average in May 2026<Cite ids={['glasswing-2026-05']} /></> },
      { watch: 'AI-related losses grow slower than total losses', reading: <>first count: $893M of $20.877B for 2025<Cite ids={['ic3-2025']} /></> },
    ],
  },
];

export function EndingsBranch() {
  const [pick, setPick] = useState<Ending['key']>('outrun');
  const ending = ENDINGS.find((e) => e.key === pick)!;

  const branch = (e: Ending, d: string, ty: number) => {
    const on = e.key === pick;
    return (
      <g
        key={e.key}
        role="radio"
        aria-checked={on}
        aria-label={`Ending ${e.letter}: ${e.name}`}
        tabIndex={on ? 0 : -1}
        onClick={() => setPick(e.key)}
        onKeyDown={(k) => {
          if (k.key === 'Enter' || k.key === ' ') { k.preventDefault(); setPick(e.key); }
          if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(k.key)) {
            k.preventDefault();
            setPick(e.key === 'outrun' ? 'pace' : 'outrun');
          }
        }}
        className="cursor-pointer outline-none"
      >
        <path d={d} fill="none" strokeWidth={14} style={{ stroke: 'transparent' }} />
        <path d={d} fill="none" strokeWidth={on ? 2.5 : 1.5} strokeDasharray="6 4" style={{ stroke: on ? 'var(--accent)' : 'var(--fg-subtle)' }} />
        <circle cx={300} cy={ty} r={on ? 7 : 5} style={{ fill: on ? 'var(--accent)' : 'var(--bg)', stroke: on ? 'var(--accent)' : 'var(--fg-subtle)' }} strokeWidth={1.5} />
        <text x={306} y={ty < 70 ? ty - 12 : ty + 20} textAnchor="end" fontSize={12} style={{ fill: on ? 'var(--fg)' : 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>
          {e.letter} · {e.name}
        </text>
      </g>
    );
  };

  return (
    <figure className="mt-8">
      <div className="themed-surface p-4 sm:p-5">
        <svg viewBox="0 0 320 140" className="mx-auto block w-full max-w-md" role="radiogroup" aria-label="Choose an ending">
          <line x1={10} y1={70} x2={90} y2={70} strokeWidth={2} style={{ stroke: 'var(--fg)' }} />
          <circle cx={10} cy={70} r={4} style={{ fill: 'var(--fg)' }} />
          <text x={10} y={90} fontSize={10} style={{ fill: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>2026</text>
          <circle cx={90} cy={70} r={5} style={{ fill: 'var(--bg)', stroke: 'var(--accent)' }} strokeWidth={1.5} />
          <text x={90} y={90} fontSize={10} textAnchor="middle" style={{ fill: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>2028</text>
          {branch(ENDINGS[0], 'M90,70 C150,70 170,32 300,32', 32)}
          {branch(ENDINGS[1], 'M90,70 C150,70 170,108 300,108', 108)}
          <text x={306} y={74} fontSize={10} textAnchor="end" style={{ fill: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>2030</text>
        </svg>
        <div className="mt-3 flex flex-wrap justify-center gap-2 font-mono text-xs">
          {ENDINGS.map((e) => (
            <button
              key={e.key}
              type="button"
              aria-pressed={pick === e.key}
              onClick={() => setPick(e.key)}
              className={[
                'min-h-9 border px-3 transition-colors',
                pick === e.key
                  ? 'border-[color:var(--accent)] text-[color:var(--accent)]'
                  : 'border-[color:var(--border)] text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]',
              ].join(' ')}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              Ending {e.letter}
            </button>
          ))}
        </div>

        <div className="mt-5 space-y-4" aria-live="polite">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)]">forecast, 2029 to 2030</p>
          <h3 className="font-serif text-xl text-[color:var(--fg)]">Ending {ending.letter}: {ending.name}</h3>
          <div className="space-y-3 text-sm leading-relaxed text-[color:var(--fg-muted)]">{ending.story}</div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">What would lead here</p>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-[color:var(--fg-muted)]">
              {ending.conditions.map((c, i) => (
                <li key={i} className="flex gap-2"><span aria-hidden className="text-[color:var(--accent)]">›</span><span>{c}</span></li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]">Signposts to watch, with the latest reading</p>
            <ul className="mt-2 divide-y divide-[color:var(--border)] border-y border-[color:var(--border)] text-sm">
              {ending.signposts.map((s) => (
                <li key={s.watch} className="grid gap-1 py-2 sm:grid-cols-[1fr_auto] sm:gap-4">
                  <span className="text-[color:var(--fg)]">{s.watch}</span>
                  <span className="font-mono text-xs text-[color:var(--fg-muted)] sm:text-right">{s.reading}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <FigureCaption
        n={4}
        claim="Both endings share the same capability path. What separates them is whether patching scales as fast as discovery, and in both of them fraud keeps growing because it does not depend on software flaws."
        source="conditions and latest readings link to their sources. The endings themselves are forecasts."
      />
    </figure>
  );
}
