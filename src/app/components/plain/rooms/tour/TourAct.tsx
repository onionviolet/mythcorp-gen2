'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Finds the nearest ancestor that scrolls, so observers can use it as root. */
export function scrollParent(el: HTMLElement | null): HTMLElement | null {
  for (let p = el?.parentElement ?? null; p; p = p.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(p).overflowY)) return p;
  }
  return null;
}

/** Mounts children once the section is within a screen of view. */
function useNearView(ref: React.RefObject<HTMLElement | null>) {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setNear(true); io.disconnect(); } },
      { root: scrollParent(el), rootMargin: '100% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
  return near;
}

export type TourActProps = {
  n: number;
  total: number;
  title: string;
  status: string;
  children: ReactNode;
  figure: ReactNode;
  figureLabel: string;
};

export function TourAct({ n, total, title, status, children, figure, figureLabel }: TourActProps) {
  const ref = useRef<HTMLElement>(null);
  const near = useNearView(ref);
  return (
    <section
      ref={ref}
      data-act={n}
      aria-label={title}
      className="mx-auto flex min-h-[85%] w-full max-w-3xl flex-col justify-center gap-6 px-5 py-14 sm:px-8"
    >
      <div>
        <p className="font-mono text-xs text-[color:var(--fg-subtle)]">
          {n} of {total} · {status}
        </p>
        <h2 className="mt-2 text-2xl text-[color:var(--fg)] sm:text-3xl">{title}</h2>
        <div className="mt-3 max-w-xl space-y-2 text-sm leading-relaxed text-[color:var(--fg-muted)] sm:text-base">
          {children}
        </div>
      </div>
      <div role="group" aria-label={figureLabel} className="min-h-40 overflow-hidden border border-[color:var(--border)] bg-[color:var(--bg)]">
        {near ? figure : null}
      </div>
    </section>
  );
}
