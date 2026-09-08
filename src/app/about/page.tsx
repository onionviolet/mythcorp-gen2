import Link from 'next/link';
import { SiteHeader } from '../components/SiteHeader';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto grid max-w-5xl gap-10 px-6 pt-28 pb-20 md:grid-cols-[minmax(0,1fr)_11rem] md:items-end">
        <section>
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
            [ about / wip ]
          </p>
          <h1 className="themed-heading mt-6 text-5xl leading-tight sm:text-7xl">The fiction is corporate.<br />The work is personal.</h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[color:var(--fg-muted)]">MYTHCORP is a personal site dressed as a cinematic megacorp. Behind the terminal: working papers, interactive experiments, and notes on how the whole thing is built.</p>
          <div className="mt-12 border-t border-[color:var(--border)] pt-6">
            <h2 className="text-xl font-semibold">The site is also the notebook.</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-[color:var(--fg-muted)]">The walkthroughs take apart real components from these rooms. The canvas bench keeps the controls visible. The papers stay open to revision.</p>
            <Link href="/wc" className="themed-button mt-6 inline-block px-6 py-3">Step into the workshop ↗</Link>
          </div>
        </section>

        <aside className="border-t border-[color:var(--border)] pt-4 font-mono text-xs leading-relaxed text-[color:var(--fg-subtle)] md:mb-3">
          <p className="text-[color:var(--accent-warm)]">STATUS: IN PROGRESS</p>
        </aside>
      </main>
    </div>
  );
}
