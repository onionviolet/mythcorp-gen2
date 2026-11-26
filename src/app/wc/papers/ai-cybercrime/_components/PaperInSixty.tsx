import { Cite } from './PaperApparatus';

export function PaperInSixty() {
  return (
    <section aria-labelledby="sixty-title" className="themed-surface mt-10 p-5 sm:p-6">
      <p id="sixty-title" className="scroll-mt-28 font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
        the paper in 60 seconds
      </p>
      <p className="mt-3 font-serif text-lg leading-snug text-[color:var(--fg)] sm:text-xl">
        AI makes some kinds of cybercrime easier to attempt. My forecast for 2027 to 2030 turns on a different question:
        can the people fixing software keep pace with the people finding flaws?
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="font-serif text-3xl text-[color:var(--fg)]">A closing window</dt>
          <dd className="mt-1 text-xs leading-relaxed text-[color:var(--fg-muted)]">
            less time between a patch&rsquo;s release and first exploitation, already shrinking before AI agents. See
            section <a href="#repair" className="underline underline-offset-4">1.3</a>.
          </dd>
        </div>
        <div>
          <dt className="font-serif text-3xl text-[color:var(--fg)]">75 of 530</dt>
          <dd className="mt-1 text-xs leading-relaxed text-[color:var(--fg-muted)]">
            high- or critical-severity reports had a known patch in May 2026. Anthropic expected more patches and said it likely missed some.<Cite ids={['glasswing-2026-05']} />{' '}
            <a href="#am-10" className="underline underline-offset-4">What the count leaves out</a>
          </dd>
        </div>
        <div>
          <dt className="font-serif text-3xl text-[color:var(--fg)]">about 4%</dt>
          <dd className="mt-1 text-xs leading-relaxed text-[color:var(--fg-muted)]">
            of the losses reported to the FBI for 2025 that were tagged as AI-related, a floor<Cite ids={['ic3-2025']} />
          </dd>
        </div>
      </dl>
      <div className="mt-5 grid gap-2 border-t border-[color:var(--border)] pt-4 text-sm text-[color:var(--fg-muted)] sm:grid-cols-2">
        <p>
          <span className="font-mono text-xs text-[color:var(--accent)]">Ending A, forecast.</span> Discovery outruns repair: the
          queue of unfixed flaws grows every quarter, and whoever patches slowest pays.
        </p>
        <p>
          <span className="font-mono text-xs text-[color:var(--accent)]">Ending B, forecast.</span> Repair keeps pace: AI
          patching drains the backlog, intrusion gets harder, and fraud keeps growing anyway.
        </p>
      </div>
    </section>
  );
}
