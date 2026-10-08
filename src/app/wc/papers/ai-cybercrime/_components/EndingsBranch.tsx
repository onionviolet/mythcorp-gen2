'use client';

import { useState, type ReactNode } from 'react';
import { Cite, FigureCaption } from './PaperApparatus';
import {
  MEASURED_AT,
  MEASURED_DAYS,
  MODEL_END,
  START_BACKLOG,
  START_FIXED_PER_MONTH,
  START_FOUND_PER_MONTH,
  crossoverTime,
  runBacklog,
  type BacklogRates,
} from './backlogModel';
import { useFigureWidth } from './useFigureWidth';
import { FIGURE } from './figureNumbers';

type Signpost = { watch: string; reading: ReactNode };

type Ending = {
  key: 'outrun' | 'pace';
  rates: BacklogRates;
  letter: 'A' | 'B';
  name: string;
  story: ReactNode;
  conditions: ReactNode[];
  signposts: Signpost[];
};

const ENDINGS: ReadonlyArray<Ending> = [
  {
    key: 'outrun',
    rates: { discoveryGrowth: 4, repairGrowth: 1.5 },
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
    rates: { discoveryGrowth: 2, repairGrowth: 8 },
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
          of Figure {FIGURE.barrier} stay where they are.
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

const HEIGHT = 260;
const PAD = { l: 52, r: 14, t: 16, b: 26 };
const X0 = Date.parse('2026-01-01');
const X1 = Date.parse('2031-01-01');
const Y_MIN = 10;
const Y_MAX = 10_000_000;
const Y_TICKS = [10, 1_000, 100_000, 10_000_000];

const r2 = (n: number) => Math.round(n * 100) / 100;
const fmtCount = (n: number) => {
  if (n < 10) return 'under 10';
  const rounded = Number(n.toPrecision(2));
  return `about ${rounded.toLocaleString('en-US')}`;
};
const monthOf = (t: number) => new Date(t).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const tickLabel = (n: number) => (n >= 1_000_000 ? `${n / 1_000_000}M` : n >= 1_000 ? `${n / 1_000}k` : `${n}`);

function RateSlider({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between font-mono text-[11px] text-[color:var(--fg-muted)]">
        {label} <span className="text-[color:var(--accent)]">×{value} a year</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-[color:var(--accent)]"
      />
    </label>
  );
}

export function EndingsBranch() {
  const [pick, setPick] = useState<Ending['key']>('outrun');
  const [rates, setRates] = useState<BacklogRates>(ENDINGS[0].rates);
  const [ref, width] = useFigureWidth();
  const ending = ENDINGS.find((e) => e.key === pick)!;
  const isPreset = ENDINGS.find((e) => e.rates.discoveryGrowth === rates.discoveryGrowth && e.rates.repairGrowth === rates.repairGrowth);

  const choose = (e: Ending) => { setPick(e.key); setRates(e.rates); };

  const x = (t: number) => r2(PAD.l + ((t - X0) / (X1 - X0)) * (width - PAD.l - PAD.r));
  const y = (n: number) => {
    const v = Math.log10(Math.min(Y_MAX, Math.max(Y_MIN, n)));
    return r2(PAD.t + (1 - (v - Math.log10(Y_MIN)) / (Math.log10(Y_MAX) - Math.log10(Y_MIN))) * (HEIGHT - PAD.t - PAD.b));
  };
  const path = (pts: ReturnType<typeof runBacklog>) => `M${pts.map((p) => `${x(p.time)},${y(p.backlog)}`).join(' L')}`;

  const run = runBacklog(rates);
  const last = run[run.length - 1];
  const peak = run.reduce((a, p) => (p.backlog > a.backlog ? p : a), run[0]);
  const cross = crossoverTime(run);
  const years = [2026, 2027, 2028, 2029, 2030, 2031];

  return (
    <figure className="mt-8">
      <div className="themed-surface p-4 sm:p-5">
        <div role="radiogroup" aria-label="Ending presets" className="flex flex-wrap gap-2 font-mono text-xs">
          {ENDINGS.map((e) => (
            <button
              key={e.key}
              type="button"
              role="radio"
              aria-checked={pick === e.key}
              onClick={() => choose(e)}
              className={[
                'min-h-9 border px-3 text-left transition-colors',
                pick === e.key
                  ? 'border-[color:var(--accent)] text-[color:var(--accent)]'
                  : 'border-[color:var(--border)] text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]',
              ].join(' ')}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {e.letter} · {e.name}
            </button>
          ))}
          {!isPreset && (
            <span className="flex min-h-9 items-center px-2 text-[color:var(--fg-subtle)]">your own rates</span>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <RateSlider label="Discovery grows" value={rates.discoveryGrowth} min={1} max={8} onChange={(v) => setRates((r) => ({ ...r, discoveryGrowth: v }))} />
          <RateSlider label="Repair grows" value={rates.repairGrowth} min={1} max={10} onChange={(v) => setRates((r) => ({ ...r, repairGrowth: v }))} />
        </div>

        <p className="mt-4 font-mono text-[10px] text-[color:var(--fg-subtle)]">flaws waiting for a patch, log scale</p>
        <div ref={ref} className="mt-1 w-full">
          <svg
            width={width}
            height={HEIGHT}
            role="img"
            aria-label={`Backlog of unpatched flaws. Measured: ${START_BACKLOG} in May 2026. Projection at discovery times ${rates.discoveryGrowth} and repair times ${rates.repairGrowth} a year ends 2030 at ${fmtCount(last.backlog)}.`}
            className="block"
          >
            <defs>
              <clipPath id="backlog-plot">
                <rect x={PAD.l} y={PAD.t} width={Math.max(0, width - PAD.l - PAD.r)} height={HEIGHT - PAD.t - PAD.b} />
              </clipPath>
            </defs>
            {Y_TICKS.map((n) => (
              <g key={n}>
                <line x1={PAD.l} x2={width - PAD.r} y1={y(n)} y2={y(n)} style={{ stroke: 'var(--border)' }} />
                <text x={PAD.l - 6} y={y(n) + 3} textAnchor="end" fontSize={10} style={{ fill: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>
                  {n === Y_MIN ? '≤10' : tickLabel(n)}
                </text>
              </g>
            ))}
            {years.map((yr) => (
              <text key={yr} x={x(Date.parse(`${yr}-01-01`))} y={HEIGHT - 8} textAnchor={yr === 2031 ? 'end' : 'middle'} fontSize={10} style={{ fill: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>
                {yr}
              </text>
            ))}
            <g clipPath="url(#backlog-plot)">
              {ENDINGS.filter((e) => e.rates !== rates).map((e) => (
                <g key={e.key}>
                  <path d={path(runBacklog(e.rates))} fill="none" strokeWidth={1} strokeDasharray="2 4" style={{ stroke: 'var(--fg-subtle)' }} />
                </g>
              ))}
              <path d={path(run)} fill="none" strokeWidth={2} strokeDasharray="6 4" style={{ stroke: 'var(--accent)' }} />
            </g>
            {ENDINGS.filter((e) => e.rates !== rates).map((e) => {
              const end = runBacklog(e.rates).at(-1)!;
              return (
                <text key={e.key} x={width - PAD.r - 2} y={y(end.backlog) + (end.backlog < 100 ? -6 : 12)} textAnchor="end" fontSize={10} style={{ fill: 'var(--fg-subtle)', fontFamily: 'var(--font-mono)' }}>
                  {e.letter}
                </text>
              );
            })}
            <line x1={x(MEASURED_AT)} x2={x(MEASURED_AT)} y1={PAD.t} y2={HEIGHT - PAD.b} style={{ stroke: 'var(--fg-muted)' }} strokeDasharray="1 3" />
            <text x={x(MEASURED_AT) + 4} y={PAD.t + 10} fontSize={10} style={{ fill: 'var(--fg-muted)', fontFamily: 'var(--font-mono)' }}>forecast →</text>
            <circle cx={x(MEASURED_AT)} cy={y(START_BACKLOG)} r={5} style={{ fill: 'var(--fg)' }} />
            <text x={x(MEASURED_AT) + 8} y={y(START_BACKLOG) + 16} fontSize={10} style={{ fill: 'var(--fg)', fontFamily: 'var(--font-mono)' }}>
              {START_BACKLOG} measured
            </text>
          </svg>
        </div>

        <dl className="mt-3 grid gap-2 font-mono text-xs sm:grid-cols-3" aria-live="polite">
          <div><dt className="text-[color:var(--fg-subtle)]">end of 2030</dt><dd className="text-[color:var(--accent)]">{fmtCount(last.backlog)} waiting</dd></div>
          <div><dt className="text-[color:var(--fg-subtle)]">peak</dt><dd className="text-[color:var(--fg)]">{fmtCount(peak.backlog)}, {monthOf(peak.time)}</dd></div>
          <div><dt className="text-[color:var(--fg-subtle)]">repair passes discovery</dt><dd className="text-[color:var(--fg)]">{cross ? monthOf(cross) : 'not by 2030'}</dd></div>
        </dl>

        <div className="mt-4 border-t border-dashed border-[color:var(--accent)] pt-3 text-[11px] leading-relaxed text-[color:var(--fg-muted)]">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)]">assumptions, all mine</p>
          <ul className="mt-1 space-y-1">
            <li>Start: {START_BACKLOG} waiting (530 reported minus 75 patched, measured {new Date(MEASURED_AT).toISOString().slice(0, 10)}). Starting rates of about {Math.round(START_FOUND_PER_MONTH)} found and {Math.round(START_FIXED_PER_MONTH)} fixed a month spread those counts over the {MEASURED_DAYS} days since the program launched.</li>
            <li>Both rates grow by a fixed factor each year, set by the sliders. Ending A uses ×4 and ×1.5, Ending B ×2 and ×8. No source measures either growth rate.</li>
            <li>
              For scale only, two independent rates from other pipelines: CVE submissions grew about ×1.3 a year from 2020
              to 2025 (my arithmetic from NIST&rsquo;s 263%),<Cite ids={['nist-nvd-2026']} /> and flaws added to CISA&rsquo;s
              exploited catalog went from 186 in 2024 to 245 in 2025, also about ×1.3.<Cite ids={['cisa-kev-2026']} /> Neither
              counts this queue. A research preprint cites industry data that companies close a median 15.5% of their open flaws a month,<Cite ids={['jacobs-2023']} /> but that is deployment at companies, not patch-writing by maintainers. I found no source that measures how fast repair grows, so the sliders stay my guesses.
            </li>
            <li>
              The model counts every flaw alike. In practice only a small, partly predictable share gets exploited, 3.7% of
              flaws published in 2016 to 2018 within a year,<Cite ids={['epss-2021']} /> so a growing queue does less harm if
              the dangerous few are fixed first. Repair is partly a sorting problem, which this model leaves out.
            </li>
            <li>Scope is one program&rsquo;s open-source queue, not all software. Nothing leaves the queue except a patch, until {new Date(MODEL_END).getUTCFullYear()}.</li>
          </ul>
        </div>

        <div className="mt-6 space-y-4">
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
        n={FIGURE.backlog}
        claim="The queue of unpatched flaws only shrinks once repair catches up with discovery, and in May 2026 only about one in seven reported flaws had a patch. On the Ending A rates, which are my guesses, the model passes a million waiting by the end of 2030; on the Ending B rates it peaks in the low thousands in late 2027 and then clears. The shape matters more than the totals. Both endings are settings of this one model. Fraud sits outside it, because fraud does not need a software flaw."
        source={<>one measured point, Anthropic&rsquo;s Project Glasswing update<Cite ids={['glasswing-2026-05']} />. Everything right of it is my projection.</>}
      />
    </figure>
  );
}
