'use client';

import Link from 'next/link';
import { SiteHeader } from '../../components/SiteHeader';

const WALKTHROUGHS = [
  {
    slug: 'theme-system',
    title: 'A theme system from CSS variables',
    blurb:
      'Four swappable themes without a styling library. Then drag the swatches in the live token playground and recolor this page as you read.',
    status: 'ready',
  },
  {
    slug: 'plain-mode',
    title: 'Plain mode, and the field underneath it',
    blurb:
      'A theme that removes every ornament CSS can express, then puts back canvas: an ASCII fluid field carrying the wordmark, plus six Canvas UI shader effects over the live DOM.',
    status: 'ready',
  },
  {
    slug: 'landing-flow',
    title: 'The cinematic boot flow',
    blurb:
      'How LoadingScreen and NewLandingPage hand off without a flash, skip repeat boots in one tab, and replay the live two-stage sequence.',
    status: 'ready',
  },
  {
    slug: '3d-scene',
    title: 'Anatomy of the 3D experience',
    blurb:
      'BufferGeometry particles, bloom, and a randomizable settings object, with a pocket R3F canvas to drive and the reset-aliasing bug shown live.',
    status: 'ready',
  },
  {
    slug: 'build-a-playground',
    title: 'The playground that explains playgrounds',
    blurb:
      'The three pieces behind every live demo here: the side-by-side shell, the CSS-variable editor, and the ssr:false canvas pattern, each embedded as its own example.',
    status: 'ready',
  },
];

export default function LearnIndex() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pt-24 pb-20">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /wc/learn / wip ]
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
          Walkthroughs
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          Each walkthrough takes a real, live component from this site, shows
          you the code that powers it, and explains why it&rsquo;s built that
          way. The components on the page <em>are</em> the components you&rsquo;re
          reading about, change the theme and the examples change with you.
        </p>

        <ul className="mt-10 flex flex-col gap-4">
          {WALKTHROUGHS.map((w) => {
            const ready = w.status === 'ready';
            const cardClass =
              'block rounded-xl border border-[color:var(--border)] bg-[color:var(--bg-elevated)] p-5 transition-all';
            const interactive = ready
              ? 'hover:-translate-y-0.5 hover:border-[color:var(--border-strong)] hover:shadow-[0_8px_30px_-15px_var(--accent-glow)]'
              : 'opacity-70';
            const inner = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-serif text-lg font-semibold">{w.title}</h2>
                  <span
                    className={
                      ready
                        ? 'rounded-full border border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--accent)]'
                        : 'rounded-full border border-[color:var(--border)] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[color:var(--fg-subtle)]'
                    }
                  >
                    {w.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{w.blurb}</p>
              </>
            );
            return (
              <li key={w.slug}>
                {ready ? (
                  <Link href={`/wc/learn/${w.slug}`} className={`${cardClass} ${interactive}`}>
                    {inner}
                  </Link>
                ) : (
                  <div className={`${cardClass} ${interactive}`}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-xs text-[color:var(--fg-subtle)]">
          Back to <Link href="/wc" className="text-[color:var(--accent)] underline underline-offset-4">/wc</Link>
        </p>
      </main>
    </div>
  );
}
