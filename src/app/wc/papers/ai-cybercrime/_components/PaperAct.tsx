import type { ReactNode } from 'react';

export function PaperAct({ id, numeral, title, takeaway, children }: { id: string; numeral: string; title: string; takeaway: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-24 scroll-mt-24">
      <div className="border-t-2 border-[color:var(--fg)] pt-6">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">Part {numeral}</p>
        <h2 id={`${id}-title`} className="themed-heading mt-2 text-4xl font-bold leading-none sm:text-6xl">
          {title}
        </h2>
        <p className="mt-4 max-w-xl font-serif text-lg leading-snug text-[color:var(--fg-muted)] sm:text-xl">{takeaway}</p>
      </div>
      {children}
    </section>
  );
}
