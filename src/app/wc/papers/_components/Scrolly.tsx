'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduced(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener?.('change', onChange);
  return () => mq.removeEventListener?.('change', onChange);
}

const readReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const serverReduced = () => false;

export type ScrollyStep = {
  id: string;
  body: ReactNode;
};

interface ScrollyProps {
  figure: ReactNode;
  steps: ScrollyStep[];
  onActiveChange?: (index: number) => void;
}

export function Scrolly({ figure, steps, onActiveChange }: ScrollyProps) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduce = useSyncExternalStore(subscribeReduced, readReduced, serverReduced);

  useEffect(() => {
    if (reduce) return;
    const elements = stepRefs.current.filter((el): el is HTMLDivElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = elements.indexOf(visible[0].target as HTMLDivElement);
          if (idx >= 0 && idx !== active) {
            setActive(idx);
            onActiveChange?.(idx);
          }
        }
      },
      { rootMargin: '-40% 0% -40% 0%', threshold: [0, 0.5, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [active, onActiveChange, reduce, steps.length]);

  if (reduce) {
    return (
      <div className="mt-6 space-y-8">
        <div>{figure}</div>
        {steps.map((s, i) => (
          <div key={s.id} className="prose-style">
            <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent-soft)]">
              step {i + 1}
            </p>
            <div className="mt-2">{s.body}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-10">
      {/* Sticky figure (right column on desktop, top on mobile thanks to md:order) */}
      <div className="md:order-last">
        <div className="md:sticky md:top-28">
          {figure}
        </div>
      </div>

      {/* Scrolled prose */}
      <div className="space-y-24">
        {steps.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => { stepRefs.current[i] = el; }}
            className="min-h-[40vh]"
          >
            <p className={[
              'font-mono text-[10px] uppercase tracking-[0.4em] transition-colors',
              i === active ? 'text-[color:var(--accent)]' : 'text-[color:var(--fg-subtle)]',
            ].join(' ')}>
              step {i + 1} of {steps.length}
            </p>
            <div
              className="mt-3 transition-opacity"
              style={{ opacity: i === active ? 1 : 0.55 }}
            >
              {s.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
