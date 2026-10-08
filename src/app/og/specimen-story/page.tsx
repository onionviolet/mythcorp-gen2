'use client';

import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { SiteHeader } from '../../components/SiteHeader';
import { DraftBanner } from '../../components/DraftBanner';
import { useReducedMotion } from '../../components/plain/useReducedMotion';
import { StageLoader, useWebglStatus } from './StageLoader';
import { StageReadout } from './StageReadout';
import { STORY_STEPS } from './storyData';
import { useStoryScroll } from './useStoryScroll';
import type { StageTelemetry } from './SpecimenStage';

const LINK_CLASS =
  'text-[color:var(--accent)] underline underline-offset-4 hover:text-[color:var(--accent-soft)]';

export default function SpecimenStoryPage() {
  const reduced = useReducedMotion();
  const webgl = useWebglStatus();
  const [stageFailed, setStageFailed] = useState(false);
  const [telemetry, setTelemetry] = useState<StageTelemetry | null>(null);
  const stepRefs = useRef<Array<HTMLElement | null>>([]);
  const { stepFloat, activeStep } = useStoryScroll(stepRefs);

  const showStage = webgl === 'ready' && !stageFailed;
  const handleFail = useCallback(() => setStageFailed(true), []);

  const jumpTo = (index: number) => {
    stepRefs.current[index]?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'center',
    });
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader />

      <header className="mx-auto max-w-5xl px-6 pt-24 pb-10">
        <DraftBanner note="A scrollytelling study. Scroll, and the camera walks around the spectre while the tour of the holding installation explains what you are looking at." />
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-[color:var(--accent)]">
          [ /OG · SCROLL STORY ]
        </p>
        <h1 className="themed-heading mt-3 text-5xl font-semibold md:text-7xl">
          How the specimen is kept
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[color:var(--fg-muted)]">
          Five acts on how the front page holding installation works, told from
          the inside. Every step of text moves the camera somewhere that
          matters for it.
        </p>
      </header>

      <div className="relative">
        <div
          className="sticky top-16 z-20 bg-[color:var(--bg)] md:top-0 md:z-0 md:h-screen"
          data-testid="specimen-story-stage"
        >
          <div className="relative h-[34vh] md:absolute md:inset-0 md:h-auto">
          <div className="absolute inset-0" aria-hidden="true">
            {showStage && (
              <StageLoader
                stepFloat={stepFloat}
                reduced={reduced}
                onTelemetry={setTelemetry}
                onFail={handleFail}
              />
            )}
          </div>

          {webgl === 'checking' && (
            <p className="absolute inset-0 grid place-items-center font-mono text-xs text-[color:var(--fg-subtle)]">
              booting stage...
            </p>
          )}
          {!showStage && webgl !== 'checking' && (
            <p className="absolute inset-x-6 top-1/3 max-w-xs font-mono text-xs leading-5 text-[color:var(--fg-muted)] md:left-[8%]">
              The stage could not start here, so there is no 3D view. The
              acts below tell the whole story, and each one lists the camera
              pose it would have used.
            </p>
          )}
          </div>

          <nav
            aria-label="Acts"
            className="absolute left-4 top-24 hidden gap-1 md:flex md:left-[6%]"
          >
            {STORY_STEPS.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => jumpTo(index)}
                aria-current={index === activeStep ? 'step' : undefined}
                aria-label={`Act ${step.tag}: ${step.title}`}
                className={`themed-pill min-h-11 min-w-11 px-2 font-mono text-xs ${
                  index === activeStep
                    ? 'text-[color:var(--accent)]'
                    : 'text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]'
                }`}
              >
                {step.tag}
              </button>
            ))}
          </nav>

          <div className="px-4 pb-3 pt-1 md:absolute md:bottom-10 md:left-[6%] md:right-auto md:p-0">
            <StageReadout step={activeStep} telemetry={showStage ? telemetry : null} reduced={reduced} />
          </div>
        </div>

        <div className="relative z-10 md:-mt-[100vh]">
          <div className="mx-auto max-w-5xl px-6">
            <div className="md:ml-auto md:w-5/12">
              {STORY_STEPS.map((step, index) => (
                <article
                  key={step.id}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  aria-labelledby={`story-${step.id}`}
                  className="flex min-h-[62vh] items-center py-10 md:min-h-[88vh]"
                >
                  <div
                    className={`bg-[color:var(--bg)]/85 py-4 motion-safe:transition-opacity motion-safe:duration-300 md:px-5 ${
                      index === activeStep ? 'opacity-100' : 'opacity-60'
                    }`}
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[color:var(--accent)]">
                      {step.kicker}
                    </p>
                    <h2
                      id={`story-${step.id}`}
                      className="themed-heading mt-2 text-2xl font-semibold md:text-4xl"
                    >
                      {step.title}
                    </h2>
                    <div className="mt-4 space-y-3 text-base leading-relaxed text-[color:var(--fg-muted)]">
                      {step.body.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                    {!showStage && (
                      <p className="mt-4 font-mono text-[11px] text-[color:var(--fg-subtle)]">
                        camera az {Math.round(((step.pose.azimuth % 360) + 360) % 360)}° el{' '}
                        {step.pose.elevation}° d {step.pose.distance.toFixed(1)}h
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-16">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-[color:var(--accent)]">
          colophon
        </p>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-[color:var(--fg-muted)]">
          <p>
            Styles shown on the stage are simple stand-in materials on the same
            model. The real ASCII, particle, swarm and liquid renderers run on
            the{' '}
            <Link href="/" className={LINK_CLASS}>
              front page
            </Link>
            , and{' '}
            <Link href="/wc/learn/plain-mode" className={LINK_CLASS}>
              the plain mode walkthrough
            </Link>{' '}
            goes deeper. Act 4 replays the actors in miniature, using the real
            movement thresholds and release time.
          </p>
          <p>
            Reference record. Sources:{' '}
            <a href="https://pudding.cool/" className={LINK_CLASS} rel="noreferrer">
              The Pudding
            </a>{' '}
            and{' '}
            <a href="https://distill.pub/" className={LINK_CLASS} rel="noreferrer">
              Distill
            </a>
            , plus the scroll-driven camera orbit in a 3D-site video tutorial.
            Lesson: pacing in acts, with a figure that answers the prose. Not
            copied: their palettes, type, publication chrome, assets, or the
            tutorial&rsquo;s centered hero, card spiral and stat row. Quiet
            form: the text column alone, with each act&rsquo;s camera pose
            printed beside it.
          </p>
        </div>
      </footer>
    </div>
  );
}
