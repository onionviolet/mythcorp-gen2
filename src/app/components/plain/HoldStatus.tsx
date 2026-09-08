'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useState, useSyncExternalStore } from 'react';
import { DisturbedText, GENTLE } from './DisturbedText';
import {
  getMetrics,
  getServerMetrics,
  subscribeMetrics,
} from './fieldMetrics';

/**
 * The meter is by far the widest row: 28 cells plus the brackets and the
 * percentage is 36 mono characters, and at this tracking that alone is wider
 * than a phone. It used to push the whole grid past the viewport, and because
 * the readout is centred, both ends hung off: every label lost its first
 * letter and the percentage lost its last. Fewer cells is the honest fix. The
 * meter is measured, so its resolution can follow the room it has, where the
 * labels cannot lose letters and still read.
 *
 * Both widths are rendered and CSS picks one, rather than a matchMedia hook
 * choosing in JS. The hook version was written first and was wrong: the query
 * matched at desktop width while the DOM still held the narrow bar, because
 * the state only updates if a change event actually arrives. CSS has no such
 * gap, needs no listener, and cannot disagree with the tracking and gap rules
 * beside it, which are at the same breakpoint.
 */
const BAR_CELLS_WIDE = 28;
const BAR_CELLS_NARROW = 14;

/** Module scope, so switching style (which remounts the panel) does not
 *  restart the clock. It is time on the page, not time since this mount. */
const OPENED_AT = Date.now();

/**
 * The readout. Every number here is measured rather than decorative: the grid
 * really is that size, the meter really is the field's mean dye, and the clock
 * really is how long you have been on the page.
 */
export function HoldStatus({
  style, scheme, message, overlay, onCycle, scene, onScene,
}: {
  style: string; scheme: string; message: string; overlay: string;
  scene?: string; onScene?: () => void;
  /** Given a row, advance it to the next option. Rows without one stay read-only. */
  onCycle?: { render: () => void; words: () => void; over: () => void };
}) {
  const metrics = useSyncExternalStore(subscribeMetrics, getMetrics, getServerMetrics);
  const elapsed = useElapsed();

  // The meter reads low even when the screen looks busy, so give it a curve
  // that spends its range where the values actually live.
  const level = Math.min(1, Math.sqrt(metrics.ink * 6));
  const bar = (cells: number) => {
    const filled = Math.round(level * cells);
    return '#'.repeat(filled) + '.'.repeat(cells - filled);
  };

  return (
    <div className="flex flex-col gap-2">
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 font-mono text-[11px]
                   uppercase tracking-[0.12em] text-[color:var(--fg-muted)]
                   sm:gap-x-6 sm:tracking-[0.18em]">
      <Row label="status" value="building" />
      <Row label="elapsed" value={elapsed} />
      <Row label="field" value={metrics.cols ? `${metrics.cols} x ${metrics.rows} cells` : 'idle'} />
      <Row label="scene" value={scene ?? style} onCycle={onScene} />
      <Row
        label="ink"
        value={
          <span className="text-[color:var(--fg)]">
            <span className="sm:hidden" aria-hidden>[{bar(BAR_CELLS_NARROW)}]</span>
            <span className="hidden sm:inline" aria-hidden>[{bar(BAR_CELLS_WIDE)}]</span>
            {' '}{String(Math.round(level * 100)).padStart(3, ' ')}%
          </span>
        }
      />
    </dl>
    {onCycle && (
      <details className="font-mono text-[11px] text-[color:var(--fg-muted)]">
        <summary className="w-fit cursor-pointer py-3 tracking-[0.12em]">Tune composition</summary>
        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 pb-3 uppercase tracking-[0.12em]">
          <Row label="render" value={style} onCycle={onCycle.render} />
          <Row label="words" value={message} onCycle={onCycle.words} />
          <Row label="over" value={overlay} onCycle={onCycle.over} />
          <Row label="scheme" value={scheme} />
        </dl>
      </details>
    )}
    </div>
  );
}

/**
 * Every value in this panel is client state: the clock, the measured grid, the
 * visitor's own colour scheme. The server cannot know any of it, so the text it
 * renders is a placeholder by definition rather than a mismatch to fix.
 */
function Row({
  label, value, onCycle,
}: {
  label: string; value: React.ReactNode; onCycle?: () => void;
}) {
  return (
    <>
      <dt className="text-[color:var(--fg-subtle)]">
        <DisturbedText text={label} strength={GENTLE} />
      </dt>
      {/* The meter is already glyphs and is not a string, so it is passed
          through untouched. Everything else in the readout is text and erodes
          like the rest of the screen. */}
      <dd className="whitespace-pre" suppressHydrationWarning>
        {onCycle && typeof value === 'string' ? (
          <button
            type="button"
            onClick={onCycle}
            aria-label={`${label}, ${value}, activate to change`}
            /* `uppercase` is repeated here on purpose: the browser's own
               stylesheet sets `text-transform: none` on form controls, so
               without it these three values render lowercase while every
               read-only value around them is caps, which reads as a bug
               rather than as an affordance. */
            className="-mx-1 px-1 text-left uppercase underline-offset-4 transition-colors
                       hover:text-[color:var(--fg)] hover:underline
                       focus-visible:text-[color:var(--fg)] focus-visible:underline"
          >
            <DisturbedText text={value} strength={GENTLE} />
          </button>
        ) : typeof value === 'string' ? (
          <DisturbedText text={value} strength={GENTLE} />
        ) : value}
      </dd>
    </>
  );
}

/** mm:ss on the page. Ticks on a timer, not a frame loop. */
function useElapsed() {
  const [seconds, setSeconds] = useState(() => Math.floor((Date.now() - OPENED_AT) / 1000));
  useEffect(() => {
    const id = setInterval(
      () => setSeconds(Math.floor((Date.now() - OPENED_AT) / 1000)),
      1000,
    );
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
