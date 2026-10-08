import type { ReactNode } from 'react';
import { Cite } from './PaperApparatus';
import type { PaperSourceId } from './paperSources';

export type Vignette = { when: string; body: ReactNode; builtFrom: PaperSourceId[] };

export function StoryVignette({ vignette }: { vignette: Vignette }) {
  return (
    <details
      data-vignette
      className="group border-[3px] border-double border-[color:var(--fg-subtle)] px-4 py-3 print:hidden sm:px-5"
      style={{ borderRadius: 'var(--radius)' }}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]">
        <span aria-hidden className="inline-block w-3 transition-transform group-open:rotate-90">›</span>
        Illustrative scenario (fictional) · {vignette.when}
      </summary>
      <div className="mt-3 space-y-2 font-serif text-[1.05rem] italic leading-relaxed text-[color:var(--fg)]">{vignette.body}</div>
      <p className="mt-3 font-mono text-[10px] text-[color:var(--fg-subtle)]">
        Composite characters, not real people. Built only from the cited facts of this stage:
        <Cite ids={vignette.builtFrom} />
      </p>
    </details>
  );
}
