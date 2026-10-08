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

export function BarrierToEntry({ figureNumber }: { figureNumber?: number } = {}) {
  const [mode, setMode] = useState<'pre' | 'post'>('post');
  const [open, setOpen] = useState<number | null>(null);

  return (
    <figure>
      <div className="themed-surface p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--accent-warm)]">
              author&rsquo;s ratings, not measurements
            </p>
            <p className="mt-1 text-xs text-[color:var(--fg-muted)]">
              score = 2 points per &ldquo;yes&rdquo; on the five questions below
            </p>
          </div>
          <div role="radiogroup" aria-label="Era" className="flex border border-[color:var(--border)] p-0.5 font-mono text-xs" style={{ borderRadius: 'var(--radius)' }}>
            {([['pre', 'before AI'], ['post', 'Oct 2026']] as const).map(([m, label]) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={mode === m}
                onClick={() => setMode(m)}
                className={[
                  'min-h-9 px-3 transition-colors',
                  mode === m
                    ? 'bg-[color:var(--accent)] text-[color:var(--bg)]'
                    : 'text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]',
                ].join(' ')}
                style={{ borderRadius: 'var(--radius-sm)' }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <ol className="mt-4 grid gap-1 text-[11px] leading-snug text-[color:var(--fg-subtle)] sm:grid-cols-2">
          {BARRIER_RUBRIC.map((q, i) => (
            <li key={q.key}><span className="font-mono text-[color:var(--fg-muted)]">Q{i + 1}</span> {q.question}</li>
          ))}
        </ol>

        <ul className="mt-5 flex flex-col gap-3">
          {ROWS.map((r, i) => {
            const answers = mode === 'pre' ? r.pre : r.post;
            const value = score(answers);
            const expanded = open === i;
            return (
              <li key={r.label} className="border-t border-[color:var(--border)] pt-3">
                <button
                  type="button"
                  onClick={() => setOpen(expanded ? null : i)}
                  aria-expanded={expanded}
                  className="block w-full text-left"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-serif text-sm text-[color:var(--fg)] sm:text-base">{r.label}</span>
                    <span className="font-mono text-xs text-[color:var(--fg-muted)]">{value}/10</span>
                  </span>
                  <span className="mt-2 flex items-center gap-3">
                    <span className="relative block h-1.5 flex-1 overflow-hidden bg-[color:var(--bg)]" style={{ borderRadius: 'var(--radius-sm)' }}>
                      <span
                        className="absolute inset-y-0 left-0 block motion-safe:transition-[width] motion-safe:duration-500"
                        style={{
                          width: `${value * 10}%`,
                          background: mode === 'pre' ? 'var(--fg-muted)' : 'var(--accent)',
                        }}
                      />
                    </span>
                    <span className="flex gap-1" aria-label={answers.map((a, k) => `Q${k + 1} ${a ? 'yes' : 'no'}`).join(', ')}>
                      {answers.map((a, k) => (
                        <span
                          key={k}
                          title={`Q${k + 1} ${BARRIER_RUBRIC[k].short}: ${a ? 'yes' : 'no'}`}
                          className={`grid h-4 w-4 place-items-center border font-mono text-[8px] ${a ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-[color:var(--bg)]' : 'border-[color:var(--border)] text-[color:var(--fg-subtle)]'}`}
                          style={{ borderRadius: 'var(--radius-sm)' }}
                        >
                          {k + 1}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="mt-1 block font-mono text-[10px] text-[color:var(--fg-subtle)]">
                    {expanded ? 'hide reasoning' : 'why these answers'}
                  </span>
                </button>
                {expanded && (
                  <p className="mt-2 text-xs leading-relaxed text-[color:var(--fg-muted)]">
                    {r.reasoning}
                    <Cite ids={r.evidence} />
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption className="mt-4 space-y-1 text-xs leading-relaxed text-[color:var(--fg-subtle)]">
        <p>
          {figureNumber != null && <span className="font-mono text-[color:var(--accent)]">Figure {figureNumber}. </span>}
          <span className="text-[color:var(--fg-muted)]">
            On this rubric, AI lowered the barrier most for attacks that are mainly writing and impersonation, and least for intrusion and vulnerability work.
          </span>
        </p>
        <p>
          <span className="font-mono">Data:</span> my yes or no answers to five questions. A score says how reachable an attack is for a non-expert, not how often it happens or how much it costs victims. Open a row for the reasoning and its sources.
        </p>
      </figcaption>
    </figure>
  );
}
