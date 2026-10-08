'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
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

/** Narrow screens get fewer meter cells: the wide bar overflows a phone. Both are rendered and CSS picks one, because a matchMedia hook can disagree with the CSS breakpoints. */
const BAR_CELLS_WIDE = 28;
const BAR_CELLS_NARROW = 14;
const READOUT_PREFERENCE_KEY = 'mythcorp:hold-readout';

/** Module scope, so switching style (which remounts the panel) does not
 *  restart the clock. It is time on the page, not time since this mount. */
const OPENED_AT = Date.now();

/** The readout. Values are measured: grid size, visible movement, time on page. */
export function HoldStatus({
  style, message, overlay, onCycle, scene, onScene, model, onModel, nextValues,
}: {
  style: string; message: string; overlay: string;
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
        <Row label="words" value={message} onCycle={onCycle?.words} nextValue={nextValues?.words} onHoverHint={setHoveredHint} onFocusHint={setFocusedHint} />
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

// Values are client state, so server text is a placeholder (hence suppressHydrationWarning).
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
        {label}
      </dt>
<dd data-short={hideOnShort || undefined} className="self-center whitespace-pre" suppressHydrationWarning>
        {onCycle && typeof value === 'string' ? (
          <button
            ref={control}
            type="button"
            onClick={activate}
            onMouseEnter={() => { onHoverHint?.(nextValue ? label : null); }}
            onMouseLeave={() => { onHoverHint?.(null); }}
            onFocus={() => { onFocusHint?.(nextValue ? label : null); }}
            onBlur={() => { onFocusHint?.(null); }}
            aria-label={`${label}, ${value}, activate to change`}
            aria-describedby={nextValue ? hintId : undefined}
            /* `uppercase` repeated: form controls reset text-transform. */
            className={`${styles.cycleControl} -mx-1 px-1 text-left uppercase underline-offset-4 transition-colors
                       hover:text-[color:var(--fg)] hover:underline
                       focus-visible:text-[color:var(--fg)] focus-visible:underline`}
          >
            {value}
            {nextValue && <>
              <span id={hintId} className="sr-only">Next value: {nextValue}</span>
            </>}
          </button>
        ) : typeof value === 'string' ? (
          value
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
