'use client';

import { isHoldControl, PRESS_DURATION } from './holdPress';

/**
 * One pointer, many readers. Six or seven pieces of type on the holding screen
 * want to know where the cursor is, and giving each of them its own
 * `pointermove` listener and its own animation frame would be seven listeners
 * doing identical arithmetic sixty times a second.
 *
 * So the listener is here, once, and the position is published on a frame
 * rather than on the event: a fast mouse fires `pointermove` far more often
 * than the screen refreshes, and every one of those beyond the first per frame
 * is work nobody sees.
 */
export type PointerAt = { x: number; y: number; active: boolean; pulse?: { x: number; y: number; progress: number } };

const AWAY: PointerAt = { x: -9999, y: -9999, active: false };

let current: PointerAt = AWAY;
let pending: PointerAt | null = null;
let frame = 0;
let pulse: { x: number; y: number; started: number } | null = null;
let lastPress = -Infinity;
const listeners = new Set<() => void>();

function flush() {
  frame = 0;
  if (pulse && (performance.now() - pulse.started >= PRESS_DURATION || window.matchMedia('(prefers-reduced-motion: reduce)').matches)) pulse = null;
  const position = pending ?? current;
  current = { x: position.x, y: position.y, active: position.active,
    pulse: pulse ? { x: pulse.x, y: pulse.y, progress: (performance.now() - pulse.started) / PRESS_DURATION } : undefined };
  pending = null;
  listeners.forEach((l) => l());
  if (pulse) frame = requestAnimationFrame(flush);
}

function schedule(next: PointerAt) {
  pending = next;
  if (frame) return;
  frame = requestAnimationFrame(flush);
}

function onMove(e: PointerEvent) {
  if (!e.isPrimary) return;
  schedule({ x: e.clientX, y: e.clientY, active: true });
}

/**
 * A pointer that has left the window has to be published as gone, not merely
 * stale. Without this the type stays eroded around wherever the cursor was
 * when it crossed the edge, which reads as a rendering bug rather than as a
 * screen that responds to you.
 */
function onLeave() {
  pulse = null;
  schedule(AWAY);
}

function onRelease(e: PointerEvent) {
  if (e.isPrimary && e.pointerType !== 'mouse') schedule(AWAY);
}

function onPress(e: PointerEvent) {
  if (!e.isPrimary || e.button !== 0 || isHoldControl(e.target)) return;
  const now = performance.now();
  if (now - lastPress < 110) return;
  lastPress = now;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pulse = { x: e.clientX, y: e.clientY, started: now };
  }
  onMove(e);
}

function start() {
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onPress, { passive: true });
  window.addEventListener('pointerup', onRelease, { passive: true });
  window.addEventListener('pointercancel', onRelease, { passive: true });
  document.addEventListener('pointerleave', onLeave);
  window.addEventListener('blur', onLeave);
}

function stop() {
  window.removeEventListener('pointermove', onMove);
  window.removeEventListener('pointerdown', onPress);
  window.removeEventListener('pointerup', onRelease);
  window.removeEventListener('pointercancel', onRelease);
  document.removeEventListener('pointerleave', onLeave);
  window.removeEventListener('blur', onLeave);
  if (frame) cancelAnimationFrame(frame);
  frame = 0;
  pending = null;
  current = AWAY;
  pulse = null;
  lastPress = -Infinity;
}

/** Listeners are counted, so the window listener exists only while something reads it. */
export function subscribePointer(listener: () => void) {
  if (listeners.size === 0) start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stop();
  };
}

export function getPointer(): PointerAt {
  return current;
}

/** Must be a stable reference or useSyncExternalStore loops forever. */
export function getServerPointer(): PointerAt {
  return AWAY;
}
