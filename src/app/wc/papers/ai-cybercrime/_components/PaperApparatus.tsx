'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { sourceById, sourceNumber, type PaperSourceId } from './paperSources';

export function Cite({ ids }: { ids: PaperSourceId[] }) {
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState<CSSProperties | null>(null);
  const [hasList, setHasList] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLSpanElement>(null);

  const toggle = () => {
    if (open) { setOpen(false); return; }
    const b = buttonRef.current?.getBoundingClientRect();
    if (b && window.matchMedia('(min-width: 1024px)').matches) {
      const width = 320;
      const left = Math.min(Math.max(16, b.left + b.width / 2 - width / 2), window.innerWidth - width - 16);
      const below = b.bottom + 8;
      setPlace(below + 220 < window.innerHeight ? { left, top: below, width } : { left, bottom: window.innerHeight - b.top + 8, width });
    } else {
      setPlace(null);
    }
    setHasList(document.getElementById('sources') !== null);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); } };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!buttonRef.current?.contains(t) && !panelRef.current?.contains(t)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('scroll', close, { passive: true });
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('scroll', close);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  const label = ids.map(sourceNumber).join(', ');

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Sources ${label}`}
        className="ml-0.5 align-super font-mono text-[0.65em] text-[color:var(--accent)] underline-offset-2 hover:underline focus-visible:underline"
      >
        [{label}]
      </button>
      {open && createPortal(
        <span
          ref={panelRef}
          id={panelId}
          role="note"
          className={`themed-surface fixed z-50 block p-4 text-left text-xs leading-relaxed text-[color:var(--fg-muted)] ${place ? '' : 'inset-x-4 bottom-4'}`}
          style={{ background: 'var(--bg-elevated)', ...place }}
        >
          {ids.map((id) => {
            const s = sourceById(id);
            return (
              <span key={id} className="mb-2 block last:mb-0">
                <span className="font-mono text-[color:var(--accent)]">[{sourceNumber(id)}]</span>{' '}
                <span className="text-[color:var(--fg)]">{s.author}.</span>{' '}
                <a href={s.url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-[color:var(--accent)]">
                  {s.title}
                </a>
                . <span className="font-mono">{s.date}</span>
                {s.kind === 'reporting' && <span> (news report of an official statement)</span>}
                {s.kind === 'preprint' && <span> (preprint, not peer reviewed)</span>}
                {s.kind === 'peer-reviewed' && <span> (peer reviewed{s.library ? ', read through a university library' : ''})</span>}
              </span>
            );
          })}
          {hasList && <a href="#sources" onClick={() => setOpen(false)} className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)] hover:text-[color:var(--accent)]">
            full reference list
          </a>}
        </span>,
        document.body,
      )}
    </>
  );
}

export function Supplement({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="group mt-4 border-t border-b border-[color:var(--border)] py-3 text-sm">
      <summary className="flex cursor-pointer list-none items-center gap-3 font-mono text-xs text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]">
        <span aria-hidden className="inline-block w-3 text-[color:var(--accent)] transition-transform group-open:rotate-90">›</span>
        {title}
      </summary>
      <div className="mt-3 space-y-3 leading-relaxed text-[color:var(--fg-muted)]">{children}</div>
    </details>
  );
}

export type ClaimKind = 'evidence' | 'forecast' | 'rating' | 'fiction';

export const CLAIM_LABEL: Record<ClaimKind, string> = {
  evidence: 'evidence',
  forecast: 'forecast',
  rating: 'my rating',
  fiction: 'fiction',
};

export function ClaimTag({ kind }: { kind: ClaimKind }) {
  return (
    <span
      className={[
        'inline-block whitespace-nowrap px-1.5 py-px font-mono text-[10px] uppercase tracking-widest',
        kind === 'evidence' && 'border border-[color:var(--fg-muted)] text-[color:var(--fg)]',
        kind === 'forecast' && 'border border-dashed border-[color:var(--accent)] text-[color:var(--accent)]',
        kind === 'rating' && 'border border-dotted border-[color:var(--accent-warm)] text-[color:var(--accent-warm)]',
        kind === 'fiction' && 'border-[3px] border-double border-[color:var(--fg-muted)] text-[color:var(--fg-muted)]',
      ].filter(Boolean).join(' ')}
      style={{ borderRadius: 'var(--radius-sm)' }}
    >
      {CLAIM_LABEL[kind]}
    </span>
  );
}

export function ForecastFrame({ children, label = 'forecast' }: { children: ReactNode; label?: string }) {
  return (
    <div
      className="relative mt-6 border border-dashed border-[color:var(--accent)] px-4 pb-4 pt-6 sm:px-5"
      style={{ borderRadius: 'var(--radius)' }}
    >
      <span
        className="absolute -top-2.5 left-4 bg-[color:var(--bg)] px-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)]"
      >
        {label}
      </span>
      <div className="space-y-3 text-[color:var(--fg-muted)]">{children}</div>
    </div>
  );
}

export function FigureCaption({ n, claim, source }: { n: number; claim: ReactNode; source: ReactNode }) {
  return (
    <figcaption className="mt-4 space-y-1 text-xs leading-relaxed text-[color:var(--fg-subtle)]">
      <p>
        <span className="font-mono text-[color:var(--accent)]">Figure {n}.</span>{' '}
        <span className="text-[color:var(--fg-muted)]">{claim}</span>
      </p>
      <p><span className="font-mono">Data:</span> {source}</p>
    </figcaption>
  );
}
