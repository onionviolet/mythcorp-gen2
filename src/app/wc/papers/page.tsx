'use client';

import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';

const PAPERS = [
  {
    slug: 'ai-cybercrime',
    title: 'The AI-driven democratization of cybercrime',
    status: 'living draft',
    blurb:
      'The Pioneer Scholars 2025 paper, revised October 2026: a dated evidence record, a scenario from 2023 to 2030 with a live readout, two endings, and every number sourced or labelled as my estimate.',
    ready: true,
  },
];

export default function PapersIndex() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pt-24 pb-20">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /wc/papers / wip ]
        </p>
        <h1 className="themed-heading mt-3 text-4xl font-semibold md:text-5xl">
          Papers
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          Living documents. Expect them to grow, get rewritten, and occasionally
          spawn interactive demos.
        </p>

        <ul className="mt-10 flex flex-col gap-4">
          {PAPERS.map((p) => {
            const card = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-serif text-lg font-semibold sm:text-xl">
                    {p.title}
                  </h2>
                  <span className="themed-pill px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent-warm)]">
                    {p.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{p.blurb}</p>
                <p className="mt-4 font-mono text-xs text-[color:var(--fg-subtle)]">
                  /wc/papers/{p.slug}
                </p>
              </>
            );
            return (
              <li key={p.slug}>
                {p.ready ? (
                  <Link
                    href={`/wc/papers/${p.slug}`}
                    className="themed-surface themed-surface-interactive group block p-5"
                  >
                    {card}
                  </Link>
                ) : (
                  <div className="themed-surface p-5 opacity-70">{card}</div>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-xs text-[color:var(--fg-subtle)]">
          ← Back to <Link href="/wc" className="text-[color:var(--accent)] underline underline-offset-4">/wc</Link>
        </p>
      </main>
    </div>
  );
}
