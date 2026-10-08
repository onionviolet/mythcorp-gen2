'use client';

import { useState } from 'react';
import { Cite, FigureCaption } from './PaperApparatus';
import type { PaperSourceId } from './paperSources';

type Side = 'offense' | 'defense' | 'measure';

type EvidenceEvent = {
  date: string;
  side: Side;
  title: string;
  detail: string;
  source: PaperSourceId[];
};

export const EVIDENCE_EVENTS: ReadonlyArray<EvidenceEvent> = [
  {
    date: '2024-01-24', side: 'measure', title: 'UK NCSC near-term assessment',
    detail: 'Judges that AI will almost certainly increase the volume and impact of cyber attacks over two years, with the largest uplift going to less-skilled actors in phishing and social engineering, from a low base.',
    source: ['ncsc-2024'],
  },
  {
    date: '2024-02-05', side: 'offense', title: 'Hong Kong deepfake video call',
    detail: 'Police report a finance employee made 15 transfers totalling HK$200 million (about US$26 million) after a video call in which every participant except the victim was a deepfake of a colleague.',
    source: ['hk-2024'],
  },
  {
    date: '2024-02-14', side: 'offense', title: 'Microsoft and OpenAI name five state actors',
    detail: 'Groups linked to Russia, North Korea, Iran and China used language models for reconnaissance, coding help and language work. The report says it had not yet seen particularly novel AI-enabled techniques.',
    source: ['msft-2024'],
  },
  {
    date: '2024-11-01', side: 'defense', title: 'Big Sleep finds a real bug',
    detail: 'Google calls it the first public example of an AI agent finding a previously unknown exploitable memory-safety issue in widely used software. It was fixed before any release, so no users were exposed.',
    source: ['bigsleep-2024'],
  },
  {
    date: '2025-01-29', side: 'offense', title: 'Google: productivity, not new capability',
    detail: 'After reviewing state-backed misuse of Gemini, Google concludes attackers gained speed on ordinary tasks and did not gain breakthrough capabilities.',
    source: ['gtig-2025-01'],
  },
  {
    date: '2025-03-19', side: 'measure', title: 'METR measures task length',
    detail: 'The length of software task an AI agent completes half the time has doubled about every 7 months since 2019. The best model then managed tasks of about one hour.',
    source: ['metr-2025'],
  },
  {
    date: '2025-06-24', side: 'defense', title: 'Autonomous tester tops a bug-bounty leaderboard',
    detail: 'XBOW reports reaching first place on the HackerOne US leaderboard with nearly 1,060 submissions. Its staff reviewed every finding before filing, so this is not fully unsupervised.',
    source: ['xbow-2025'],
  },
  {
    date: '2025-08-08', side: 'defense', title: 'DARPA AI Cyber Challenge final',
    detail: 'Competing systems found 54 of 63 planted vulnerabilities (86%, up from 37% a year earlier) and patched 43, found 18 real ones nobody planted, and averaged about $152 per task.',
    source: ['aixcc-2025'],
  },
  {
    date: '2025-08-27', side: 'offense', title: 'Anthropic: AI runs an extortion campaign',
    detail: 'One actor used an AI coding agent across an extortion operation against at least 17 organizations. A separate actor who appeared unable to write malware alone sold AI-built ransomware for $400 to $1,200.',
    source: ['anthropic-2025-08'],
  },
  {
    date: '2025-11-05', side: 'offense', title: 'Google: malware that calls a model',
    detail: 'First observed malware that queries a language model while it runs, some of it in live operations, plus an underground market selling AI tools on subscription. Several families were still experimental.',
    source: ['gtig-2025-11'],
  },
  {
    date: '2025-11-13', side: 'offense', title: 'Anthropic: AI-orchestrated espionage',
    detail: 'A group assessed as Chinese state-sponsored used an AI agent for an estimated 80 to 90% of the campaign, with humans at 4 to 6 decision points. About 30 targets, a small number breached. The model sometimes invented credentials or overstated findings.',
    source: ['anthropic-2025-11'],
  },
  {
    date: '2026-01-29', side: 'measure', title: 'METR Time Horizon 1.1',
    detail: 'With a larger task suite, the doubling time is 196 days over the whole record, 131 days since 2023 and 89 days since 2024. The top measured model reached 320 minutes.',
    source: ['metr-2026-01'],
  },
  {
    date: '2026-04-07', side: 'defense', title: 'A frontier model kept behind a gate',
    detail: 'Anthropic withholds a model it says surpasses all but the most skilled humans at finding and exploiting software flaws, and gives it only to defenders. These are the developer\'s own claims.',
    source: ['glasswing-2026-04', 'mythos-2026-04'],
  },
  {
    date: '2026-04-16', side: 'offense', title: 'FBI counts AI-related complaints',
    detail: 'The FBI\'s first AI section: 22,364 complaints mentioning AI with $893 million in adjusted losses, out of $20.877 billion in all reported losses. It counts only what victims recognized.',
    source: ['ic3-2025'],
  },
  {
    date: '2026-05-22', side: 'defense', title: 'Finding outpaces fixing',
    detail: 'Partners report over 10,000 high or critical flaws in a month. Of 530 reported to open-source maintainers, 75 had patches. Anthropic names human capacity to triage and patch as the bottleneck.',
    source: ['glasswing-2026-05'],
  },
  {
    date: '2026-09-17', side: 'measure', title: 'Open weights about four months behind',
    detail: 'NIST\'s CAISI finds the most cyber-capable downloadable model to date trails the US frontier by about four months on its cyber benchmarks.',
    source: ['caisi-2026-09'],
  },
];

const SIDE_LABEL: Record<Side, string> = { offense: 'offense', defense: 'defense', measure: 'measurement' };

function Mark({ side, active }: { side: Side; active: boolean }) {
  const size = active ? 'h-3.5 w-3.5' : 'h-2.5 w-2.5';
  if (side === 'offense') return <span className={`${size} block rounded-full bg-[color:var(--accent)]`} />;
  if (side === 'defense') return <span className={`${size} block rounded-full border-2 border-[color:var(--fg)]`} />;
  return <span className={`${size} block rotate-45 bg-[color:var(--fg-muted)]`} />;
}

export function EvidenceTimeline() {
  const [index, setIndex] = useState(EVIDENCE_EVENTS.length - 1);
  const [filter, setFilter] = useState<Side | 'all'>('all');
  const ev = EVIDENCE_EVENTS[index];
  const visible = (s: Side) => filter === 'all' || filter === s;

  const step = (dir: 1 | -1) => {
    let i = index;
    for (let n = 0; n < EVIDENCE_EVENTS.length; n++) {
      i = (i + dir + EVIDENCE_EVENTS.length) % EVIDENCE_EVENTS.length;
      if (visible(EVIDENCE_EVENTS[i].side)) { setIndex(i); return; }
    }
  };

  const years = ['2024', '2025', '2026'];

  return (
    <figure className="mt-8">
      <div className="themed-surface p-4 sm:p-5">
        <div role="radiogroup" aria-label="Show events" className="flex flex-wrap gap-2 font-mono text-[11px]">
          {(['all', 'offense', 'defense', 'measure'] as const).map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={filter === f}
              onClick={() => {
                setFilter(f);
                if (f !== 'all' && EVIDENCE_EVENTS[index].side !== f) {
                  const last = [...EVIDENCE_EVENTS].map((e, i) => [e, i] as const).reverse().find(([e]) => e.side === f);
                  if (last) setIndex(last[1]);
                }
              }}
              className={[
                'min-h-8 border px-2.5 transition-colors',
                filter === f
                  ? 'border-[color:var(--accent)] text-[color:var(--accent)]'
                  : 'border-[color:var(--border)] text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]',
              ].join(' ')}
              style={{ borderRadius: 'var(--radius-sm)' }}
            >
              {f === 'all' ? 'all' : SIDE_LABEL[f]}
            </button>
          ))}
        </div>

        <div className="mt-5">
          <div className="relative h-4 font-mono text-[10px] text-[color:var(--fg-subtle)]">
            {years.map((y) => {
              const first = EVIDENCE_EVENTS.findIndex((e) => e.date.startsWith(y));
              return (
                <span key={y} className="absolute top-0" style={{ left: `${(first / EVIDENCE_EVENTS.length) * 100}%` }}>
                  {y}
                </span>
              );
            })}
          </div>
          <div className="relative mt-1">
            <div aria-hidden className="absolute left-0 right-0 top-1/2 h-px bg-[color:var(--border)]" />
            {years.slice(1).map((y) => {
              const first = EVIDENCE_EVENTS.findIndex((e) => e.date.startsWith(y));
              return (
                <div
                  key={y}
                  aria-hidden
                  className="absolute inset-y-1 w-px bg-[color:var(--border-strong)]"
                  style={{ left: `${(first / EVIDENCE_EVENTS.length) * 100}%` }}
                />
              );
            })}
            <div className="relative flex" role="listbox" aria-label="Evidence events, oldest to newest">
              {EVIDENCE_EVENTS.map((e, i) => (
                <button
                  key={e.date + e.title}
                  type="button"
                  role="option"
                  aria-selected={i === index}
                  aria-label={`${e.date}, ${SIDE_LABEL[e.side]}: ${e.title}`}
                  onClick={() => setIndex(i)}
                  onKeyDown={(k) => {
                    if (k.key === 'ArrowRight') { k.preventDefault(); step(1); }
                    if (k.key === 'ArrowLeft') { k.preventDefault(); step(-1); }
                  }}
                  tabIndex={i === index ? 0 : -1}
                  className="grid h-10 min-w-0 flex-1 place-items-center transition-opacity"
                  style={{ opacity: visible(e.side) ? 1 : 0.18 }}
                >
                  <Mark side={e.side} active={i === index} />
                </button>
              ))}
            </div>
          </div>
          <p className="mt-1 font-mono text-[10px] text-[color:var(--fg-subtle)]">
            evenly spaced in date order, not to scale
          </p>
        </div>

        <div className="mt-4 min-h-[11rem]" aria-live="polite">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[color:var(--fg-subtle)]">
            <Mark side={ev.side} active={false} />
            <span>{ev.date}</span>
            <span>/ {SIDE_LABEL[ev.side]}</span>
          </div>
          <p className="mt-2 font-serif text-lg text-[color:var(--fg)]">{ev.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-[color:var(--fg-muted)]">
            {ev.detail}
            <Cite ids={ev.source} />
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <button type="button" onClick={() => step(-1)} className="min-h-10 px-3 font-mono text-xs text-[color:var(--fg-muted)] hover:text-[color:var(--accent)]">
            ‹ earlier
          </button>
          <span className="font-mono text-[10px] text-[color:var(--fg-subtle)]">{index + 1} / {EVIDENCE_EVENTS.length}</span>
          <button type="button" onClick={() => step(1)} className="min-h-10 px-3 font-mono text-xs text-[color:var(--fg-muted)] hover:text-[color:var(--accent)]">
            later ›
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-[color:var(--border)] pt-3 font-mono text-[10px] text-[color:var(--fg-subtle)]">
          {(['offense', 'defense', 'measure'] as const).map((s) => (
            <span key={s} className="flex items-center gap-1.5"><Mark side={s} active={false} /> {SIDE_LABEL[s]}</span>
          ))}
        </div>
      </div>
      <FigureCaption
        n={1}
        claim="Through January 2025 the public record describes AI as a speed-up for attackers who already existed. From August 2025 it describes AI carrying out most of an operation, and from April 2026 expert-level vulnerability work, so far behind access controls. Defensive results move on the same calendar."
        source="sixteen dated public reports, each linked from its entry. Reports from AI developers describe their own models and their own detections; nobody outside has audited them."
      />
    </figure>
  );
}
