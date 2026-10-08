'use client';

import { useState } from 'react';
import { Cite } from './PaperApparatus';
import type { PaperSourceId } from './paperSources';

export const BARRIER_RUBRIC = [
  { key: 'skill', short: 'no specialty', question: 'Can someone without the specialty produce the core work (the lure, the code, the fake face or voice)?' },
  { key: 'time', short: 'days', question: 'Can it be prepared in days rather than months?' },
  { key: 'tools', short: 'tools on offer', question: 'Are ready-to-use tools openly available or sold?' },
  { key: 'scale', short: 'one to many', question: 'Can one person run it against many targets?' },
  { key: 'blind', short: 'works blind', question: 'Does it work even if the operator does not understand why it works?' },
] as const;

type Answers = readonly [boolean, boolean, boolean, boolean, boolean];

type BarrierRow = {
  label: string;
  pre: Answers;
  post: Answers;
  reasoning: string;
  evidence: PaperSourceId[];
};

const Y = true;
const N = false;

const ROWS: ReadonlyArray<BarrierRow> = [
  {
    label: 'Targeted phishing',
    pre: [N, Y, Y, N, Y],
    post: [Y, Y, Y, Y, Y],
    reasoning: 'Before 2023 the part that took skill was a fluent, personal lure in the target\'s language, written one at a time. Models write those in bulk, which the NCSC flagged in 2024 and the FBI describes in 2025 complaints.',
    evidence: ['ncsc-2024', 'ic3-2025'],
  },
  {
    label: 'Voice or video impersonation',
    pre: [N, N, N, N, N],
    post: [Y, Y, Y, N, Y],
    reasoning: 'The Hong Kong fraud used public video of real executives. The FBI now reports cloned voices in distress scams and deepfaked endorsements in investment fraud. Each call still targets one victim at a time, so I leave scale unchecked.',
    evidence: ['hk-2024', 'ic3-2025'],
  },
  {
    label: 'Build a ransomware variant',
    pre: [N, N, N, Y, N],
    post: [Y, N, Y, Y, Y],
    reasoning: 'Anthropic describes a seller who appeared unable to build working malware without AI. Google documents an underground market for AI tools. No report says how long it takes, so I leave time unchecked.',
    evidence: ['anthropic-2025-08', 'gtig-2025-11'],
  },
  {
    label: 'Fake remote-worker identity',
    pre: [N, N, N, N, N],
    post: [Y, N, Y, N, Y],
    reasoning: 'Anthropic reports North Korean operatives without basic coding skills passing technical interviews with AI help. The FBI sees deepfaked job interviews. Each hire is still a separate, slow deception.',
    evidence: ['anthropic-2025-08', 'ic3-2025'],
  },
  {
    label: 'Intrude on and extort many organizations',
    pre: [N, N, N, N, N],
    post: [N, N, N, Y, N],
    reasoning: 'One actor used an AI agent against at least 17 organizations, and a state group let AI do most of an espionage campaign. Neither report describes the operator as a novice. Scale moved; on the public record the skill gate has not.',
    evidence: ['anthropic-2025-08', 'anthropic-2025-11'],
  },
  {
    label: 'Find and exploit an unknown flaw',
    pre: [N, N, N, N, N],
    post: [N, N, Y, N, N],
    reasoning: 'Expert-level vulnerability work exists at the frontier but is held back from public release. A downloadable model about four months behind appeared in September 2026, so tools are now on offer. Success rates reported for it are still low, and I know of no public case of a non-expert using it.',
    evidence: ['mythos-2026-04', 'caisi-2026-09', 'anthropic-2026-09'],
  },
];

const score = (a: Answers) => a.filter(Boolean).length * 2;

const OPENED_MIN_RISE = 4;

const GROUPS = [
  { key: 'opened', title: 'Opened up', note: `rose ${OPENED_MIN_RISE} points or more` },
  { key: 'gated', title: 'Still gated', note: `rose less than ${OPENED_MIN_RISE} points` },
] as const;

const groupOf = (r: BarrierRow) => (score(r.post) - score(r.pre) >= OPENED_MIN_RISE ? 'opened' : 'gated');

const SORTED = [...ROWS].sort((a, b) => score(b.post) - score(a.post) || score(b.post) - score(b.pre) - (score(a.post) - score(a.pre)));

function AnswerStrip({ answers, label }: { answers: Answers; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="w-16 shrink-0 font-mono text-[10px] text-[color:var(--fg-subtle)]">{label}</span>
      <span className="flex gap-1" aria-label={`${label}: ${answers.map((a, k) => `Q${k + 1} ${a ? 'yes' : 'no'}`).join(', ')}`}>
        {answers.map((a, k) => (
          <span
            key={k}
            className={`grid h-4 w-4 place-items-center border font-mono text-[8px] ${a ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--bg)]' : 'border-[color:var(--border)] text-[color:var(--fg-subtle)]'}`}
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            {k + 1}
          </span>
        ))}
      </span>
    </span>
  );
}

function Dumbbell({ pre, post }: { pre: number; post: number }) {
  return (
    <span aria-hidden className="relative block h-5">
      <span className="absolute inset-x-0 top-1/2 h-px bg-[color:var(--border)]" />
      {[0, 5, 10].map((t) => (
        <span key={t} className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-[color:var(--border)]" style={{ left: `${t * 10}%` }} />
      ))}
      <span
        className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-[color:var(--accent)]"
        style={{ left: `${pre * 10}%`, width: `${(post - pre) * 10}%`, opacity: 0.6 }}
      />
      <span
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[color:var(--fg-muted)] bg-[color:var(--bg)]"
        style={{ left: `${pre * 10}%` }}
      />
      <span
        className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--accent)]"
        style={{ left: `${post * 10}%` }}
      />
    </span>
  );
}

export function BarrierToEntry({ figureNumber }: { figureNumber?: number } = {}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <figure>
      <div className="themed-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent-warm)]">
              author&rsquo;s ratings, not measurements
            </p>
            <p className="mt-1 text-xs text-[color:var(--fg-muted)]">
              how reachable each attack is for a non-expert, 0 to 10
            </p>
          </div>
          <div className="flex gap-4 font-mono text-[10px] text-[color:var(--fg-subtle)]">
            <span className="flex items-center gap-1.5">
              <span className="block h-3 w-3 rounded-full border-2 border-[color:var(--fg-muted)]" /> before AI
            </span>
            <span className="flex items-center gap-1.5">
              <span className="block h-3 w-3 rounded-full bg-[color:var(--accent)]" /> Oct 2026
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_2.5rem] gap-x-3 sm:grid-cols-[13rem_minmax(0,1fr)_2.5rem]">
          <span className="hidden sm:block" />
          <span className="relative block h-4 font-mono text-[10px] text-[color:var(--fg-subtle)]">
            {[0, 5, 10].map((t) => (
              <span key={t} className="absolute -translate-x-1/2" style={{ left: `${t * 10}%` }}>{t}</span>
            ))}
          </span>
          <span className="text-right font-mono text-[10px] text-[color:var(--fg-subtle)]">rise</span>
        </div>

        {GROUPS.map((g) => {
          const rows = SORTED.filter((r) => groupOf(r) === g.key);
          return (
            <div key={g.key} className="mt-4">
              <p className="flex items-baseline gap-2 border-b border-[color:var(--border-strong)] pb-1">
                <span className="font-serif text-sm text-[color:var(--fg)]">{g.title}</span>
                <span className="font-mono text-[10px] text-[color:var(--fg-subtle)]">{g.note}</span>
              </p>
              <ul>
                {rows.map((r) => {
                  const pre = score(r.pre);
                  const post = score(r.post);
                  const expanded = open === r.label;
                  return (
                    <li key={r.label} className="border-b border-[color:var(--border)]">
                      <button
                        type="button"
                        onClick={() => setOpen(expanded ? null : r.label)}
                        aria-expanded={expanded}
                        aria-label={`${r.label}: ${pre} before AI, ${post} in October 2026. ${expanded ? 'Hide' : 'Show'} reasoning.`}
                        className="grid w-full grid-cols-[minmax(0,1fr)_2.5rem] items-center gap-x-3 gap-y-1 py-2.5 text-left sm:grid-cols-[13rem_minmax(0,1fr)_2.5rem]"
                      >
                        <span className="col-span-2 flex items-baseline justify-between gap-2 sm:col-span-1">
                          <span className="text-sm text-[color:var(--fg)]">{r.label}</span>
                          <span aria-hidden className="font-mono text-[10px] text-[color:var(--fg-subtle)] sm:hidden">{expanded ? '−' : '+'}</span>
                        </span>
                        <Dumbbell pre={pre} post={post} />
                        <span className="text-right font-mono text-xs text-[color:var(--fg-muted)]">
                          +{post - pre}
                        </span>
                      </button>
                      {expanded && (
                        <div className="space-y-2 pb-3 sm:pl-[13.75rem]">
                          <p className="font-mono text-[11px] text-[color:var(--fg-muted)]">{pre} → {post}</p>
                          <AnswerStrip answers={r.pre} label="before AI" />
                          <AnswerStrip answers={r.post} label="Oct 2026" />
                          <p className="text-xs leading-relaxed text-[color:var(--fg-muted)]">
                            {r.reasoning}
                            <Cite ids={r.evidence} />
                          </p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}

        <details className="mt-4 text-[11px] leading-snug text-[color:var(--fg-subtle)]">
          <summary className="cursor-pointer font-mono hover:text-[color:var(--fg)]">the rubric: 2 points per yes</summary>
          <ol className="mt-2 grid gap-1 sm:grid-cols-2">
            {BARRIER_RUBRIC.map((q, i) => (
              <li key={q.key}><span className="font-mono text-[color:var(--fg-muted)]">Q{i + 1}</span> {q.question}</li>
            ))}
          </ol>
        </details>
        <p className="mt-2 font-mono text-[10px] text-[color:var(--fg-subtle)]">open a row for its answers, reasons and sources</p>
      </div>
      <figcaption className="mt-4 space-y-1 text-xs leading-relaxed text-[color:var(--fg-subtle)]">
        <p>
          {figureNumber != null && <span className="font-mono text-[color:var(--accent)]">Figure {figureNumber}. </span>}
          <span className="text-[color:var(--fg-muted)]">
            On this rubric, the four attacks whose core work is writing, faking a person or routine code rose 4 to 8 points. Intrusion and finding new flaws rose 2, because the capable models are still gated.
          </span>
        </p>
        <p>
          <span className="font-mono">Data:</span> my yes or no answers to five questions, 2 points per yes. A score says how reachable an attack is for a non-expert, not how often it happens or how much it costs victims. The 4-point line between the groups is my choice.
        </p>
      </figcaption>
    </figure>
  );
}
