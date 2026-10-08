'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export const GLOSSARY = {
  cve: {
    term: 'CVE',
    body: 'A public ID number for a known software flaw, so everyone can refer to the same bug. Each one is listed in a shared database.',
  },
  kev: {
    term: 'KEV',
    body: 'CISA’s Known Exploited Vulnerabilities catalog: the US government’s list of flaws seen attacked in the wild. Each entry carries a deadline for federal agencies to fix it.',
  },
  epss: {
    term: 'EPSS',
    body: 'The Exploit Prediction Scoring System, a model that estimates how likely a published flaw is to be exploited, so defenders can fix the risky few first.',
  },
  exploit: {
    term: 'Exploit',
    body: 'A way of turning a software flaw into real access or control. Exploitation means using it against an actual system.',
  },
  zeroDay: {
    term: 'Zero-day',
    body: 'A flaw attackers use before its maker knows about it or has a fix, so defenders have had zero days to patch.',
  },
  openWeights: {
    term: 'Open weights',
    body: 'A model whose trained parameters anyone can download and run. Once released, its developer cannot add or enforce safeguards.',
  },
  timeHorizon: {
    term: 'Time horizon',
    body: 'METR’s measure of AI agents: the length of task, in skilled-human time, that an agent finishes half the time.',
  },
} as const;

export type GlossaryKey = keyof typeof GLOSSARY;

export function Term({ k, children }: { k: GlossaryKey; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState<CSSProperties | null>(null);
  const id = useId();
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLSpanElement>(null);
  const entry = GLOSSARY[k];

  const show = () => {
    const b = btn.current?.getBoundingClientRect();
    if (b && window.matchMedia('(min-width: 1024px)').matches) {
      const width = 288;
      const left = Math.min(Math.max(16, b.left + b.width / 2 - width / 2), window.innerWidth - width - 16);
      setPlace(b.bottom + 160 < window.innerHeight ? { left, top: b.bottom + 6, width } : { left, bottom: window.innerHeight - b.top + 6, width });
    } else {
      setPlace(null);
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus(); } };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!btn.current?.contains(t) && !panel.current?.contains(t)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', close, { passive: true });
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', close);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={show}
        onPointerEnter={(e) => { if (e.pointerType === 'mouse') show(); }}
        onPointerLeave={(e) => { if (e.pointerType === 'mouse') setOpen(false); }}
        className="cursor-help text-inherit underline decoration-[color:var(--fg-subtle)] decoration-dotted underline-offset-4 hover:decoration-[color:var(--accent)] focus-visible:decoration-[color:var(--accent)]"
      >
        {children}
      </button>
      {open && createPortal(
        <span
          ref={panel}
          id={id}
          role="note"
          className={`themed-surface fixed z-50 block p-3 text-left text-xs leading-relaxed text-[color:var(--fg-muted)] ${place ? '' : 'inset-x-4 bottom-4'}`}
          style={{ background: 'var(--bg-elevated)', ...place }}
        >
          <span className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg)]">{entry.term}</span>
          {entry.body}
        </span>,
        document.body,
      )}
    </>
  );
}
