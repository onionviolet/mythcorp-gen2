'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { SiteHeader } from '../../components/SiteHeader';
import { DraftBanner } from '../../components/DraftBanner';
import { useReducedMotion } from '../../components/plain/useReducedMotion';
import { CalhounFigure, DoubtFigure, PaperFigure, StarFigure } from '../../components/plain/rooms/tour/tourFigures';
import { useWebglStatus } from '../specimen-story/StageLoader';
import { useStoryScroll } from '../specimen-story/useStoryScroll';
import { GLANCE_MS, createAttentionInputs } from './attention';
import { DocentLoader } from './DocentLoader';
import { DocentReadout } from './DocentReadout';
import { DOCENT_ACTS } from './docentData';
import type { DocentFigure } from './docentData';
import type { DocentTelemetry } from './DocentStage';

const LINK_CLASS =
  'text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]';
const KNOCKOUT = '[-webkit-text-stroke:3px_var(--bg)] [paint-order:stroke_fill]';

const FIGURES: Record<DocentFigure, () => ReactNode> = {
  paper: () => <PaperFigure />,
  doubt: () => <DoubtFigure />,
  calhoun: () => <CalhounFigure />,
  stars: () => <StarFigure />,
};

/** Mounts a figure once it is within a screen of view, like the Tour room does. */
function NearView({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '100% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref}>{near ? children : <div className="h-40" />}</div>;
}

export default function SpecimenDocentPage() {
  const reduced = useReducedMotion();
  const webgl = useWebglStatus();
  const [stageFailed, setStageFailed] = useState(false);
  const telemetrySink = useRef<(t: DocentTelemetry) => void>(() => {});
  const handleTelemetry = useCallback((t: DocentTelemetry) => telemetrySink.current(t), []);
  const [reaction, setReaction] = useState(0);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const anchors = useRef<Array<HTMLElement | null>>([]);
  const inputs = useRef(createAttentionInputs());
  const { stepFloat, activeStep } = useStoryScroll(stepRefs);

  const showStage = webgl === 'ready' && !stageFailed;
  const handleFail = useCallback(() => setStageFailed(true), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      inputs.current.pointer = { x: e.clientX, y: e.clientY, at: performance.now() };
    };
    const onLeave = () => {
      inputs.current.pointer.at = -Infinity;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const paper = anchors.current[0];
    if (!paper) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReaction((n) => n + 1);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(paper);
    return () => io.disconnect();
  }, []);

  const glance = (index: number, target: EventTarget) => {
    inputs.current.glance = {
      index,
      until: performance.now() + GLANCE_MS,
      target: target instanceof HTMLElement ? target : null,
    };
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <header className="relative z-10 mx-auto max-w-5xl px-6 pt-24 pb-10">
        <DraftBanner note="A scroll study. The specimen stands at the edge of the tour and looks at whatever you are reading." />
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">[ /OG · DOCENT ]</p>
        <h1 className={`themed-heading mt-3 text-5xl font-semibold md:text-7xl ${KNOCKOUT}`}>The docent</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[color:var(--fg-muted)]">
          The rooms behind the front page, walked through with company.
        </p>
      </header>

      <div className="relative">
        <div
          className="sticky top-16 z-20 bg-[color:var(--bg)] md:top-0 md:z-0 md:h-screen"
          data-testid="specimen-docent-stage"
        >
          <div className="relative h-[34vh] md:absolute md:inset-0 md:h-auto">
            <div className="absolute inset-0" aria-hidden="true">
              {showStage && (
                <DocentLoader
                  inputs={inputs}
                  anchors={anchors}
                  stepFloat={stepFloat}
                  reduced={reduced}
                  reaction={reaction}
                  onTelemetry={handleTelemetry}
                  onFail={handleFail}
                />
              )}
            </div>
            {!showStage && webgl !== 'checking' && (
              <p className="absolute inset-x-6 top-1/3 max-w-xs font-mono text-xs leading-5 text-[color:var(--fg-muted)] md:left-[8%]">
                The specimen could not be shown here. The tour below is complete without it.
              </p>
            )}
          </div>

          <DocentReadout sink={telemetrySink} activeStep={activeStep} live={showStage} />
        </div>

        <div className="relative z-10 md:-mt-[100vh]">
          <div className="px-6 md:ml-[38%] md:mr-[6%] md:max-w-3xl md:px-0">
            {DOCENT_ACTS.map((act, index) => (
              <article
                key={act.id}
                ref={(node) => {
                  stepRefs.current[index] = node;
                }}
                tabIndex={0}
                aria-labelledby={`docent-${act.id}`}
                onFocus={() => {
                  inputs.current.focusIndex = index;
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node | null)) inputs.current.focusIndex = null;
                }}
                className="flex min-h-[70vh] flex-col justify-center gap-6 py-12 outline-none focus-visible:ring-1 focus-visible:ring-[color:var(--accent)] md:min-h-[92vh]"
              >
                <div
                  ref={
                    act.figure
                      ? undefined
                      : (node) => {
                          anchors.current[index] = node;
                        }
                  }
                  className={`bg-[color:var(--bg)]/85 motion-safe:transition-opacity motion-safe:duration-300 ${
                    index === activeStep ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <p className="font-mono text-xs text-[color:var(--fg-subtle)]">
                    {index + 1} of {DOCENT_ACTS.length} · {act.status}
                  </p>
                  <h2 id={`docent-${act.id}`} className="mt-2 text-2xl text-[color:var(--fg)] sm:text-3xl">
                    {act.title}
                  </h2>
                  <div className="mt-3 max-w-xl space-y-2 text-sm leading-relaxed text-[color:var(--fg-muted)] sm:text-base">
                    {act.body.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                    {act.href && (
                      <p>
                        <Link href={act.href} className={LINK_CLASS}>
                          Read the paper →
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
                {act.figure && (
                  <div
                    ref={(node) => {
                      anchors.current[index] = node;
                    }}
                    role="group"
                    aria-label={act.figureLabel}
                    onPointerDownCapture={(e) => glance(index, e.target)}
                    onKeyDownCapture={(e) => glance(index, e.target)}
                    onInputCapture={(e) => glance(index, e.target)}
                    className="min-h-40 overflow-hidden border border-[color:var(--border)] bg-[color:var(--bg)]"
                  >
                    <NearView>{FIGURES[act.figure]()}</NearView>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>

      <footer className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-16 md:ml-[38%]">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[color:var(--accent)]">colophon</p>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[color:var(--fg-muted)]">
          <p>
            The specimen looks, in order, at a figure you just touched, your pointer if it moved in the last moment,
            an act you focused with the keyboard, and otherwise the figure the reading line is passing. The neck
            turns first; the body follows only when the neck runs out of range. The acts are the{' '}
            <Link href="/" className={LINK_CLASS}>
              front page
            </Link>{' '}
            Tour, with the same live figures.
          </p>
          <p>
            Brief: docs/plans/SPECIMEN_DOCENT_PROMPT_2026-10-19.md. Cuts: the brief allowed two reactions from the
            model&rsquo;s clips, but only one of its four clips has any length, so it plays once, when the paper comes
            into view. There is no still image of the specimen per act, so the no WebGL form is the text alone. No gaze
            line, which would have been a second effect.
          </p>
        </div>
      </footer>
    </div>
  );
}
