'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { useReducedMotion } from '../../components/plain/useReducedMotion';
import { SKETCHES, STATUS_CLASS } from '../sketches';
import type { Sketch } from '../sketches';

const SpectreCore = dynamic(() => import('./SpectreCore'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center font-mono text-xs text-[color:var(--fg-subtle)]">
      waking the spectre...
    </div>
  ),
});

const COUNT = SKETCHES.length;
const STEP_DEGREES = 360 / COUNT;
const RADIUS = 360;
const RISE = 74;
const SCROLL_PER_CARD_VH = 55;
const EASE = 0.14;

const clamp = (value: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, value));
const pad = (value: number, size: number) => String(value).padStart(size, '0');

type ViewMode = 'orbit' | 'list';

function useWebglSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const probe = document.createElement('canvas');
      setSupported(Boolean(probe.getContext('webgl2') || probe.getContext('webgl')));
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

export function OrbitGallery() {
  const reducedMotion = useReducedMotion();
  const webgl = useWebglSupport();
  const [chosen, setChosen] = useState<ViewMode | null>(null);
  const [active, setActive] = useState(0);

  const mode: ViewMode = webgl === false
    ? 'list'
    : chosen ?? (webgl && !reducedMotion ? 'orbit' : 'list');
  const scrollDriven = mode === 'orbit' && !reducedMotion;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const angleRef = useRef<HTMLSpanElement>(null);
  const activeRef = useRef(0);
  const currentU = useRef(0);
  const targetU = useRef(0);
  const frame = useRef(0);

  const paint = useCallback((u: number) => {
    for (let i = 0; i < COUNT; i += 1) {
      const card = cardRefs.current[i];
      if (!card) continue;
      const d = i - u;
      const theta = d * STEP_DEGREES;
      const rad = (theta * Math.PI) / 180;
      const x = RADIUS * Math.sin(rad);
      const z = RADIUS * (Math.cos(rad) - 1);
      const y = d * RISE;
      card.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${theta.toFixed(2)}deg)`;
      card.style.opacity = String(clamp(1 - (Math.abs(d) - 1.6) / 1.8, 0, 1));
      card.style.pointerEvents = Math.cos(rad) > 0.3 && Math.abs(d) < 2.6 ? 'auto' : 'none';
      card.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
    }
    if (angleRef.current) {
      const wrapped = ((u * STEP_DEGREES) % 360 + 360) % 360;
      angleRef.current.textContent = pad(Math.round(wrapped), 3);
    }
    const nearest = clamp(Math.round(u), 0, COUNT - 1);
    if (nearest !== activeRef.current) {
      activeRef.current = nearest;
      setActive(nearest);
    }
  }, []);

  const run = useCallback(() => {
    if (frame.current) return;
    const tick = () => {
      frame.current = 0;
      const gap = targetU.current - currentU.current;
      const settled = reducedMotion || Math.abs(gap) < 0.002;
      currentU.current = settled ? targetU.current : currentU.current + gap * EASE;
      paint(currentU.current);
      if (!settled) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }, [paint, reducedMotion]);

  const scrollProgress = useCallback(() => {
    const wrapper = wrapperRef.current;
    const stage = stageRef.current;
    if (!wrapper || !stage) return 0;
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    const range = wrapper.offsetHeight - stage.offsetHeight;
    if (range <= 0) return 0;
    return clamp((top - wrapper.getBoundingClientRect().top) / range, 0, 1);
  }, []);

  useEffect(() => {
    if (mode !== 'orbit') return undefined;
    const start = scrollDriven ? scrollProgress() * (COUNT - 1) : activeRef.current;
    currentU.current = start;
    targetU.current = start;
    paint(start);
    if (!scrollDriven) return undefined;
    const onScroll = () => {
      targetU.current = scrollProgress() * (COUNT - 1);
      run();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [mode, scrollDriven, paint, run, scrollProgress]);

  const goTo = useCallback((index: number) => {
    const next = clamp(index, 0, COUNT - 1);
    if (scrollDriven) {
      const wrapper = wrapperRef.current;
      const stage = stageRef.current;
      if (!wrapper || !stage) return;
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const range = wrapper.offsetHeight - stage.offsetHeight;
      const y = window.scrollY + wrapper.getBoundingClientRect().top - top + (next / (COUNT - 1)) * range;
      window.scrollTo({ top: y, behavior: 'smooth' });
      return;
    }
    targetU.current = next;
    run();
  }, [run, scrollDriven]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight';
    const back = event.key === 'ArrowUp' || event.key === 'ArrowLeft';
    const edge = event.key === 'Home' ? 0 : event.key === 'End' ? COUNT - 1 : null;
    if (!forward && !back && edge === null) return;
    event.preventDefault();
    const next = edge ?? clamp(activeRef.current + (forward ? 1 : -1), 0, COUNT - 1);
    cardRefs.current[next]?.focus({ preventScroll: true });
    goTo(next);
  };

  const current = SKETCHES[active];

  return (
    <section aria-label="Sketch index">
      <div className="mx-auto max-w-3xl px-6 pb-6">
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div role="group" aria-label="View" className="flex gap-2">
            {(['orbit', 'list'] as const).map((view) => (
              <button
                key={view}
                type="button"
                aria-pressed={mode === view}
                disabled={view === 'orbit' && webgl === false}
                onClick={() => setChosen(view)}
                className="themed-pill px-4 py-1.5 font-mono text-xs uppercase tracking-widest
                           text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]
                           aria-pressed:border-[color:var(--accent)] aria-pressed:text-[color:var(--accent)]
                           disabled:opacity-40"
              >
                {view} view
              </button>
            ))}
          </div>
          <p className="text-xs text-[color:var(--fg-subtle)]">
            {webgl === false
              ? 'WebGL is off here, so the orbit sits this one out.'
              : reducedMotion
                ? 'Reduced motion is on. The orbit steps instead of spinning.'
                : 'Scroll to turn the spiral. Arrow keys work too.'}
          </p>
        </div>
      </div>

      {mode === 'list' ? (
        <ListView />
      ) : (
        <div
          ref={wrapperRef}
          style={scrollDriven ? { height: `calc(${(COUNT - 1) * SCROLL_PER_CARD_VH}vh + 100vh - 5rem)` } : undefined}
        >
          <div
            ref={stageRef}
            onKeyDown={onKeyDown}
            className="relative h-[calc(100vh-5rem)] min-h-[520px] overflow-clip"
            style={scrollDriven ? { position: 'sticky', top: '5rem' } : undefined}
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              <SpectreCore spin={currentU} stepDegrees={STEP_DEGREES} settled={reducedMotion} index={active} />
            </div>

            <div className="absolute inset-0" style={{ perspective: '1300px' }}>
              <div
                className="absolute inset-0"
                style={{ transformStyle: 'preserve-3d', transform: 'translateY(9%) rotateX(-7deg)' }}
              >
                {SKETCHES.map((sketch, index) => (
                  <Link
                    key={sketch.href}
                    href={sketch.href}
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                    onFocus={() => goTo(index)}
                    data-current={index === active}
                    aria-current={index === active ? 'true' : undefined}
                    className="themed-surface group absolute left-1/2 top-1/2 block h-[230px] w-[min(280px,72vw)] p-5
                               outline-offset-4 focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]
                               data-[current=true]:outline data-[current=true]:outline-1 data-[current=true]:outline-[color:var(--accent)]"
                    style={{ backfaceVisibility: 'hidden', transition: 'none' }}
                  >
                    <CardFace sketch={sketch} index={index} />
                  </Link>
                ))}
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-x-4 gap-y-2 px-4 pb-4 pr-16">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--fg)] [text-shadow:0_0_6px_var(--bg)] sm:tracking-[0.3em]" aria-hidden>
                <span className="text-[color:var(--accent)]">{pad(active + 1, 2)}</span> / {pad(COUNT, 2)}
                {' '}
                <span className="ml-3">angle <span ref={angleRef}>000</span>&deg;</span>
              </p>
              <div className="pointer-events-auto flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => goTo(active - 1)}
                  disabled={active === 0}
                  className="themed-pill whitespace-nowrap px-3 py-1 font-mono text-xs text-[color:var(--fg)] hover:text-[color:var(--fg)] disabled:opacity-40"
                >
                  [ prev ]
                </button>
                <button
                  type="button"
                  onClick={() => goTo(active + 1)}
                  disabled={active === COUNT - 1}
                  className="themed-pill whitespace-nowrap px-3 py-1 font-mono text-xs text-[color:var(--fg)] hover:text-[color:var(--fg)] disabled:opacity-40"
                >
                  [ next ]
                </button>
              </div>
            </div>
            <p className="sr-only" aria-live="polite">
              {`Sketch ${active + 1} of ${COUNT}: ${current.title}`}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function CardFace({ sketch, index }: { sketch: Sketch; index: number }) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
          {pad(index + 1, 2)} {sketch.label}
        </p>
        <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${STATUS_CLASS[sketch.status]}`}>
          {sketch.status}
        </span>
      </div>
      <h2 className="mt-2 font-serif text-lg font-semibold transition-colors group-hover:text-[color:var(--accent-soft)] motion-reduce:transition-none">
        {sketch.title}
      </h2>
      <p className="mt-2 line-clamp-5 text-sm text-[color:var(--fg-muted)] opacity-0 transition-opacity group-data-[current=true]:opacity-100 motion-reduce:transition-none">
        {sketch.blurb}
      </p>
    </>
  );
}

function ListView() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-20">
      <ul className="grid gap-4 sm:grid-cols-2">
        {SKETCHES.map((sketch, index) => (
          <li key={sketch.href}>
            <Link
              href={sketch.href}
              className="themed-surface themed-surface-interactive group block p-5
                         outline-offset-4 focus-visible:outline-2 focus-visible:outline-[color:var(--accent)]"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
                  {pad(index + 1, 2)} {sketch.label}
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
    </div>
  );
}
