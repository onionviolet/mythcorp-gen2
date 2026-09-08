'use client';

import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

const sections = [
  {
    href: '/wc/learn',
    label: 'LEARN',
    title: 'Annotated walkthroughs',
    blurb: 'Real components from this site, taken apart and explained.',
  },
  {
    href: '/wc/papers',
    label: 'PAPERS',
    title: 'Long-form writing',
    blurb: 'Living papers and essays. The first one is on AI + cybercrime capability.',
  },
  {
    href: '/wc/lab/canvas',
    label: 'LAB',
    title: 'The canvas bench',
    blurb: 'Every vendored Canvas UI component, live, with its props on sliders.',
  },
  {
    href: '/wc/about',
    label: 'ABOUT',
    title: 'Who, why',
    blurb: 'Background, timeline, and what comes next.',
  },
];

export default function WillIndex() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-6 pt-24 pb-20">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /wc / wip ]
        </p>
        <h1 className="themed-heading mt-3 text-5xl font-semibold md:text-7xl">
          A small back room
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          MYTHCORP is the front. This is where the personal stuff lives, papers,
          notes, walkthroughs of how the site itself works. If MYTHCORP is the
          theatre, /wc is the workshop behind it.
        </p>

        <Link href="/wc/papers/ai-cybercrime" className="themed-surface themed-surface-interactive mt-12 grid gap-8 p-7 sm:p-10 md:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-[color:var(--accent)]">ON THE DESK / LIVING PAPER</p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight sm:text-5xl">AI + cybercrime<br />capability</h2>
          </div>
          <div className="self-end">
            <p className="text-base leading-relaxed text-[color:var(--fg-muted)]">An evolving paper with interactive figures, evidence labels, and room for the argument to change.</p>
            <p className="mt-6 text-sm text-[color:var(--accent)]">Read the working draft ↗</p>
          </div>
        </Link>

        <div className="mt-10 grid gap-x-10 sm:grid-cols-2">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group block border-t border-[color:var(--border)] py-6"
            >
              {/* Each destination is itself WIP, so the card says so rather
                  than letting the page-level marker imply the index alone is
                  unfinished. */}
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
                {s.label}
                <span className="tracking-[0.28em] text-[color:var(--accent-warm)]">/ wip</span>
              </p>
              <h2 className="mt-2 font-serif text-xl font-semibold transition-colors
                             group-hover:text-[color:var(--accent-soft)]">
                {s.title}
              </h2>
              <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{s.blurb}</p>
            </Link>
          ))}
        </div>

        <p className="mt-12 text-xs text-[color:var(--fg-subtle)]">
          Tip: this section reads better in the <em>paper</em> theme, the switcher is in the top-right.
        </p>
      </main>
    </div>
  );
}
