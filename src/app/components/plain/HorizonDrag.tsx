'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { getSkyOffset, setSkyOffset, skyNow, subscribeSkyOffset } from './skyTime';
import { chicagoClock } from './chicagoTime';
import { useReducedMotion } from './useReducedMotion';
import { useViewerHorizon } from './sky/sunLight';

const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const RETURN_MS = 1200;
/** Keyboard sweeps wait this long after the last key before easing home. */
const KEY_SETTLE_MS = 1500;
/** The Halo's resting `offset` before the viewer's sun is known. */
const HALO_LINE_PX = 160;
const BAND_PX = 64;

function formatOffset(ms: number): string {
  const minutes = Math.round(Math.abs(ms) / 60_000);
  const sign = ms < 0 ? '−' : '+';
  return `${sign}${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`;
}

function clampOffset(ms: number): number {
  return Math.max(-DAY_MS, Math.min(DAY_MS, ms));
}

/**
 * An invisible band over the Halo. Dragging it sweeps the sky clock: one
 * viewport width is a day, rightward is later. Letting go eases the clock
 * back to now.
 */
export function HorizonDrag() {
  const reducedMotion = useReducedMotion();
  const haloLine = useViewerHorizon()?.offset ?? HALO_LINE_PX;
  const offset = useSyncExternalStore(subscribeSkyOffset, getSkyOffset, () => 0);
  const [dragging, setDragging] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hintX, setHintX] = useState<number | null>(null);
  const drag = useRef<{ id: number; startX: number; startOffset: number } | null>(null);
  const returnFrame = useRef(0);
  const keyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopReturn = () => {
    if (returnFrame.current) cancelAnimationFrame(returnFrame.current);
    returnFrame.current = 0;
    if (keyTimer.current) clearTimeout(keyTimer.current);
    keyTimer.current = null;
  };

  const returnHome = () => {
    stopReturn();
    const from = getSkyOffset();
    if (reducedMotion || from === 0) { setSkyOffset(0); return; }
    const started = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / RETURN_MS);
      setSkyOffset(t >= 1 ? 0 : from * (1 - t) ** 3);
      returnFrame.current = t < 1 ? requestAnimationFrame(tick) : 0;
    };
    returnFrame.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => {
    cancelAnimationFrame(returnFrame.current);
    if (keyTimer.current) clearTimeout(keyTimer.current);
    setSkyOffset(0);
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    stopReturn();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* pointer already gone */ }
    drag.current = { id: e.pointerId, startX: e.clientX, startOffset: getSkyOffset() };
    setDragging(true);
    setHintX(e.clientX);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current || current.id !== e.pointerId) return;
    const dx = e.clientX - current.startX;
    setSkyOffset(clampOffset(current.startOffset + (dx / window.innerWidth) * DAY_MS));
    setHintX(e.clientX);
  };

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    returnHome();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? HOUR_MS
      : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -HOUR_MS : 0;
    if (e.key === 'Home') { e.preventDefault(); returnHome(); return; }
    if (!step) return;
    e.preventDefault();
    stopReturn();
    setSkyOffset(clampOffset(getSkyOffset() + step));
    setHintX(null);
    keyTimer.current = setTimeout(returnHome, KEY_SETTLE_MS);
  };

  const lit = dragging || focused;
  const showHint = dragging || offset !== 0 || focused;
  const minutes = Math.round(offset / 60_000);

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Sweep the time of day"
      aria-orientation="horizontal"
      aria-valuemin={-24 * 60}
      aria-valuemax={24 * 60}
      aria-valuenow={minutes}
      aria-valuetext={focused ? `${formatOffset(offset)}, ${chicagoClock(skyNow())} Chicago` : formatOffset(offset)}
      data-horizon-drag={dragging ? 'dragging' : 'idle'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onLostPointerCapture={onPointerEnd}
      onKeyDown={onKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => { setFocused(false); if (!drag.current) returnHome(); }}
      className={`group absolute inset-x-0 select-none outline-none ${dragging ? 'cursor-grabbing' : 'cursor-ew-resize'}`}
      style={{ bottom: haloLine - BAND_PX / 2, height: BAND_PX, touchAction: 'pan-y' }}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-1/2 h-px bg-[color:var(--fg)] transition-opacity duration-300 ${lit ? 'opacity-40' : 'opacity-0 group-hover:opacity-20'}`}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute bottom-full mb-1 -translate-x-1/2 max-sm:!left-12 whitespace-nowrap font-mono text-[11px] tabular-nums text-[color:var(--fg-muted)] transition-opacity duration-300 ${showHint ? 'opacity-100' : 'opacity-0'}`}
        style={{ left: hintX === null ? '50%' : `clamp(3rem, ${hintX}px, calc(100% - 3rem))` }}
      >
        {formatOffset(offset)}
      </span>
    </div>
  );
}
