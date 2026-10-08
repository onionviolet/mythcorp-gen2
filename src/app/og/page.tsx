'use client';

import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';
import { SKETCHES, STATUS_CLASS } from './sketches';

export default function OgIndex() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-6 pt-24 pb-20">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /OG / wip ]
        </p>
        <h1 className="themed-heading mt-3 text-4xl font-semibold md:text-5xl">
          Back-room sketches
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-[color:var(--fg-muted)] md:text-lg">
          Pages that started as ideas and aren&rsquo;t finished. They live here on purpose,
          so they don&rsquo;t clutter the main map but don&rsquo;t get lost either.
        </p>
        <p className="mt-3 text-sm text-[color:var(--fg-muted)]">
          Prefer to wander?{' '}
          <Link href="/og/orbit" className="text-[color:var(--accent)] underline underline-offset-4">
            Browse them as an orbit
          </Link>
          .
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {SKETCHES.map((sketch) => (
            <li key={sketch.href}>
              <Link
                href={sketch.href}
                className="themed-surface themed-surface-interactive group block p-5"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
                    {sketch.label}
                  </p>
                  <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STATUS_CLASS[sketch.status]}`}>
                    {sketch.status}
                  </span>
                </div>
                <h2 className="mt-2 font-serif text-lg font-semibold transition-colors group-hover:text-[color:var(--accent-soft)]">
                  {sketch.title}
                </h2>
                <p className="mt-2 text-sm text-[color:var(--fg-muted)]">{sketch.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-xs text-[color:var(--fg-subtle)]">
          Back <Link href="/" className="text-[color:var(--accent)] underline underline-offset-4">home</Link>
        </p>
      </main>
    </div>
  );
}


