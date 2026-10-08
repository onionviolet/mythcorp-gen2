import { Cite } from './PaperApparatus';

export function PaperInSixty() {
  return (
    <section aria-labelledby="sixty-title" className="themed-surface mt-10 p-5 sm:p-6">
      <p id="sixty-title" className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
        the paper in 60 seconds
      </p>
      <p className="mt-3 font-serif text-lg leading-snug text-[color:var(--fg)] sm:text-xl">
        AI is moving the hard part of cybercrime from skill to access, for the second time, into a repair window that
        was already closing, so whether fixing can speed up as fast as AI speeds up finding decides 2027 to 2030.
      </p>
      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <dt className="font-serif text-3xl text-[color:var(--fg)]">63 → &minus;7</dt>
          <dd className="mt-1 text-xs leading-relaxed text-[color:var(--fg-muted)]">
            average days from a patch&rsquo;s release to the first observed exploitation of its flaw, 2018 to 2019 and then 2025, from two
            Mandiant reports<Cite ids={['gtte-2024', 'mtrends-2026']} />
          </dd>
        </div>
        <div>
          <dt className="font-serif text-3xl text-[color:var(--fg)]">75 of 530</dt>
          <dd className="mt-1 text-xs leading-relaxed text-[color:var(--fg-muted)]">
            serious AI-found flaws sent to open-source maintainers that had a patch, May 2026<Cite ids={['glasswing-2026-05']} />
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
