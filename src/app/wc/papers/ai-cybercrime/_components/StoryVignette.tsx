import type { ReactNode } from 'react';
import { Cite } from './PaperApparatus';
import type { PaperSourceId } from './paperSources';

export type Vignette = { when: string; body: ReactNode; builtFrom: PaperSourceId[] };

export function StoryVignette({ vignette }: { vignette: Vignette }) {
  return (
    <aside
      aria-label={`Fiction, ${vignette.when}`}
      className="relative border-[3px] border-double border-[color:var(--fg-subtle)] px-4 pb-4 pt-6 sm:px-5"
      style={{ borderRadius: 'var(--radius)' }}
    >
      <span className="absolute -top-2.5 left-4 bg-[color:var(--bg)] px-2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-muted)]">
        fiction · {vignette.when}
      </span>
      <div className="space-y-2 font-serif text-[1.05rem] italic leading-relaxed text-[color:var(--fg)]">{vignette.body}</div>
      <p className="mt-3 font-mono text-[10px] text-[color:var(--fg-subtle)]">
        Made-up people. Built only from the cited facts of this stage:
        <Cite ids={vignette.builtFrom} />
      </p>
    </aside>
  );
}
