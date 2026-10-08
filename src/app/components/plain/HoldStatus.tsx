'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import { DisturbedText, GENTLE } from './DisturbedText';
import styles from './HoldStatus.module.css';
import {
  getMetrics,
  getServerMetrics,
  subscribeMetrics,
} from './fieldMetrics';
import {
  getFieldActivity,
  getServerFieldActivity,
  subscribeFieldActivity,
} from './fieldActivity';

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
const READOUT_PREFERENCE_KEY = 'mythcorp:hold-readout';

/** Module scope, so switching style (which remounts the panel) does not
 *  restart the clock. It is time on the page, not time since this mount. */
const OPENED_AT = Date.now();

/**
 * The readout. Every number here is measured rather than decorative: the grid
 * really is that size, the activity meter reflects the visible fake cursor,
 * cat and click rings, and the clock really is how long you have been on the page.
 */
export function HoldStatus({
  style, scheme, message, overlay, onCycle, scene, onScene, model, onModel, nextValues,
}: {
  style: string; scheme: string; message: string; overlay: string;
  scene?: string; onScene?: () => void;
  model?: string; onModel?: () => void;
  nextValues?: { scene?: string; model?: string; render?: string; words?: string; over?: string };
  /** Given a row, advance it to the next option. Rows without one stay read-only. */
  onCycle?: { render: () => void; words: () => void; over: () => void };
}) {
  const metrics = useSyncExternalStore(subscribeMetrics, getMetrics, getServerMetrics);
  const activity = useSyncExternalStore(
    subscribeFieldActivity, getFieldActivity, getServerFieldActivity,
  );
  const elapsed = useElapsed();
  const wide = useSyncExternalStore(subscribeWide, getWide, () => false);
  const [expandedChoice, setExpandedChoice] = useState<boolean | null>(null);
  const [hoveredHint, setHoveredHint] = useState<ReadoutHint | null>(null);
  const [focusedHint, setFocusedHint] = useState<ReadoutHint | null>(null);
  const expanded = expandedChoice ?? wide;
  const controlsId = useId();
  const preferenceSet = useRef(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(READOUT_PREFERENCE_KEY);
      if (!preferenceSet.current && (stored === 'full' || stored === 'compact')) {
        setExpandedChoice(stored === 'full');
      }
    } catch {
      // Storage can be unavailable in private or embedded browsing contexts.
    }
  }, []);

  const toggleExpanded = () => {
    preferenceSet.current = true;
    const next = !expanded;
    setExpandedChoice(next);
    setHoveredHint(null);
    setFocusedHint(null);
    try {
      window.localStorage.setItem(READOUT_PREFERENCE_KEY, next ? 'full' : 'compact');
    } catch {
      // The viewport default remains available when storage is denied.
    }
  };

  const hintValues: Record<string, string | undefined> = {
    scene: nextValues?.scene,
    specimen: nextValues?.model,
    render: nextValues?.render,
    words: nextValues?.words,
    over: nextValues?.over,
  };
  const activeHint = hoveredHint ?? focusedHint;
  const hintValue = activeHint && (expanded || activeHint === 'scene') ? hintValues[activeHint] : undefined;

  const bar = (cells: number) => {
    const filled = Math.round(activity.level * cells);
    return '#'.repeat(filled) + '.'.repeat(cells - filled);
  };

  return (
    <div className="flex flex-col gap-2" data-readout={expanded ? 'full' : 'compact'}>
    <dl id={controlsId} className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 font-mono text-[11px]
                   uppercase tracking-[0.12em] text-[color:var(--fg-muted)]
                   sm:gap-x-6 sm:tracking-[0.18em]">
      <Row label="status" value="building" />
      <Row label="elapsed" value={elapsed} hideOnShort />
      <Row label="grid" value={metrics.cols ? `${metrics.cols} x ${metrics.rows} cells` : 'idle'} hideOnShort />
      <Row label="scene" value={scene ?? style} onCycle={onScene} nextValue={nextValues?.scene} onHoverHint={setHoveredHint} onFocusHint={setFocusedHint} />
      {expanded && <>
        {model && <Row label="specimen" value={model} onCycle={onModel} nextValue={nextValues?.model} onHoverHint={setHoveredHint} onFocusHint={setFocusedHint} />}
        <Row label="render" value={style} onCycle={onCycle?.render} nextValue={nextValues?.render} onHoverHint={setHoveredHint} onFocusHint={setFocusedHint} />
        <Row label="scheme" value={scheme} />
        <Row label="words" value={message} onCycle={onCycle?.words} nextValue={nextValues?.words} onHoverHint={setHoveredHint} onFocusHint={setFocusedHint} />
        <Row label="halo" value="active" />
        <Row label="over" value={overlay} onCycle={onCycle?.over} nextValue={nextValues?.over} onHoverHint={setHoveredHint} onFocusHint={setFocusedHint} />
      </>}
      <Row
        label="movement"
        value={
          <span
            className="text-[color:var(--fg)]"
            data-field-activity={activity.state}
            data-movement-level={activity.level}
            aria-label={`Movement ${activity.state}`}
          >
            <span className="sm:hidden" aria-hidden>[{bar(BAR_CELLS_NARROW)}]</span>
            <span className="hidden sm:inline" aria-hidden>[{bar(BAR_CELLS_WIDE)}]</span>
            {' '}{activity.state}
          </span>
        }
      />
    </dl>
    <p aria-hidden className={styles.hintLine} data-readout-hint={hintValue ? activeHint : undefined}>
      {hintValue ? `next: ${hintValue}` : '\u00a0'}
    </p>
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={controlsId}
      onClick={toggleExpanded}
      className="min-h-11 w-fit py-2 font-mono text-[11px] text-[color:var(--fg-muted)]
                 underline-offset-4 hover:text-[color:var(--fg)] hover:underline"
    >
      {expanded ? 'Compact readout' : 'Full readout'} <span aria-hidden>{expanded ? '−' : '+'}</span>
    </button>
    </div>
  );
}

const WIDE_QUERY = '(min-width: 1200px) and (min-height: 680px)';
function getWide() { return window.matchMedia(WIDE_QUERY).matches; }
function subscribeWide(listener: () => void) {
  const media = window.matchMedia(WIDE_QUERY);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}

/**
 * Every value in this panel is client state: the clock, the measured grid, the
 * visitor's own colour scheme. The server cannot know any of it, so the text it
 * renders is a placeholder by definition rather than a mismatch to fix.
 */
type ReadoutHint = string;

function Row({
  label, value, onCycle, nextValue, onHoverHint, onFocusHint, hideOnShort,
}: {
  label: string; value: React.ReactNode; onCycle?: () => void; nextValue?: string;
  onHoverHint?: (hint: ReadoutHint | null) => void;
  onFocusHint?: (hint: ReadoutHint | null) => void;
  hideOnShort?: boolean;
}) {
  const hintId = useId();
  const control = useRef<HTMLButtonElement>(null);
  const clearAcknowledgement = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => () => {
    if (clearAcknowledgement.current) clearTimeout(clearAcknowledgement.current);
  }, []);

  const activate = () => {
    const button = control.current;
    if (button) {
      button.removeAttribute('data-activated');
      void button.offsetWidth;
      button.dataset.activated = 'true';
      if (clearAcknowledgement.current) clearTimeout(clearAcknowledgement.current);
      clearAcknowledgement.current = setTimeout(() => {
        button.removeAttribute('data-activated');
      }, 620);
    }
    onCycle?.();
  };

  return (
    <>
      <dt data-short={hideOnShort || undefined} className="self-center text-[color:var(--fg-subtle)]">
        <DisturbedText text={label} strength={GENTLE} />
      </dt>
      {/* The meter is already glyphs and is not a string, so it is passed
          through untouched. Everything else in the readout is text and erodes
          like the rest of the screen. */}
      <dd data-short={hideOnShort || undefined} className="self-center whitespace-pre" suppressHydrationWarning>
        {onCycle && typeof value === 'string' ? (
          <button
            ref={control}
            type="button"
            onClick={activate}
            onMouseEnter={() => { setHovered(true); onHoverHint?.(nextValue ? label : null); }}
            onMouseLeave={() => { setHovered(false); onHoverHint?.(null); }}
            onFocus={() => { setFocused(true); onFocusHint?.(nextValue ? label : null); }}
            onBlur={() => { setFocused(false); onFocusHint?.(null); }}
            aria-label={`${label}, ${value}, activate to change`}
            aria-describedby={nextValue ? hintId : undefined}
            /* `uppercase` is repeated here on purpose: the browser's own
               stylesheet sets `text-transform: none` on form controls, so
               without it these three values render lowercase while every
               read-only value around them is caps, which reads as a bug
               rather than as an affordance. */
            className={`${styles.cycleControl} -mx-1 px-1 text-left uppercase underline-offset-4 transition-colors
                       hover:text-[color:var(--fg)] hover:underline
                       focus-visible:text-[color:var(--fg)] focus-visible:underline`}
          >
            <DisturbedText text={value} strength={GENTLE} active={!hovered && !focused} />
            {nextValue && <>
              <span id={hintId} className="sr-only">Next value: {nextValue}</span>
            </>}
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
