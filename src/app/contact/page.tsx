import { SiteHeader } from '../components/SiteHeader';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <main className="mx-auto grid max-w-5xl gap-10 px-6 pt-28 pb-20 md:grid-cols-[minmax(0,1fr)_12rem] md:items-start">
        <section>
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-[color:var(--accent)]">
            [ contact / wip ]
          </p>
          <h1 className="sr-only">Contact</h1>
          <div className="mt-8 flex flex-col gap-3 font-mono text-sm text-[color:var(--fg-muted)]">
            <a className="w-fit text-[color:var(--fg)] underline decoration-[color:var(--accent)] underline-offset-4 hover:text-[color:var(--accent)]" href="mailto:info@mythcorp.org">
              info@mythcorp.org
            </a>
            <a className="w-fit hover:text-[color:var(--accent)]" href="tel:+16767677676">
              (676) 767-7676
            </a>
            <p>Chicago, IL</p>
          </div>
        </section>

        <aside className="border-t border-[color:var(--border)] pt-4 font-mono text-xs leading-relaxed text-[color:var(--fg-subtle)] md:mt-16">
          <p className="text-[color:var(--accent-warm)]">STATUS: IN PROGRESS</p>
          <p className="mt-2">A small love letter to palindromes: 6767677676 reads the same on the way back.</p>
        </aside>
      </main>
    </div>
  );
}
