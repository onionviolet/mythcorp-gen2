'use client';

import { useEffect } from 'react';
import { isHoldControl } from './holdPress';
import { specimenPose } from './specimenPose';
import { reportGather } from './fieldActivity';

/** A press shorter than this stays a click: ring only, no gather. */
export const GATHER_THRESHOLD_MS = 250;
/** Movement before the threshold is a scroll or a drag, not a hold. */
export const GATHER_SLOP_PX = 10;

/** Holding is critically damped (about 95% in at 1.5s); letting go is
 *  underdamped, so the installation overshoots a little past rest and settles
 *  in about 1.2s. */
const HOLD_SPRING = { omega: 3.2, zeta: 1 };
const RELEASE_SPRING = { omega: 6.2, zeta: 0.62 };

type Phase = 'idle' | 'pending' | 'holding';

export type GatherState = {
  /** Eased amount, 0 at rest, 1 gathered, briefly below 0 on the rebound. */
  amount: number;
  /** Client-space centre of the specimen, measured when the hold began. */
  x: number;
  y: number;
};

const state: GatherState = { amount: 0, x: 0, y: 0 };
let velocity = 0;
let phase: Phase = 'idle';
let pressId: number | null = null;
let pressAt = { x: 0, y: 0 };
let timer: ReturnType<typeof setTimeout> | null = null;
let frame = 0;
let lastTime = 0;
const listeners = new Set<() => void>();

/** Read by the field, the title and the renderers inside their own loops. */
export function getGather(): GatherState {
  return state;
}

export function getGatherAmount(): number {
  return state.amount;
}

export function getServerGatherAmount(): number {
  return 0;
}

export function subscribeGather(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function measureCentre() {
  const layer = document.querySelector('[data-specimen-layer]');
  const rect = layer?.getBoundingClientRect();
  if (rect && rect.width > 0 && rect.height > 0) {
    state.x = rect.left + rect.width / 2;
    state.y = rect.top + rect.height / 2;
  } else {
    state.x = window.innerWidth / 2;
    state.y = window.innerHeight / 2;
  }
}

function publish(amount: number) {
  state.amount = amount;
  specimenPose.gather = amount;
  reportGather(amount);
  listeners.forEach((l) => l());
}

function tick(time: number) {
  const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 1 / 60;
  lastTime = time;
  const target = phase === 'holding' ? 1 : 0;
  const { omega, zeta } = phase === 'holding' ? HOLD_SPRING : RELEASE_SPRING;
  velocity += (omega * omega * (target - state.amount) - 2 * zeta * omega * velocity) * dt;
  let amount = state.amount + velocity * dt;
  const settled = target === 0 && Math.abs(amount) < 0.002 && Math.abs(velocity) < 0.02;
  if (settled) {
    amount = 0;
    velocity = 0;
  }
  publish(amount);
  if (settled) {
    frame = 0;
    lastTime = 0;
    return;
  }
  frame = requestAnimationFrame(tick);
}

function animate() {
  if (!frame) frame = requestAnimationFrame(tick);
}

function clearTimer() {
  if (timer) clearTimeout(timer);
  timer = null;
}

function begin() {
  timer = null;
  if (phase !== 'pending') return;
  phase = 'holding';
  if (state.amount === 0) measureCentre();
  animate();
}

function end() {
  clearTimer();
  pressId = null;
  if (phase === 'holding') animate();
  phase = 'idle';
}

function onDown(e: PointerEvent) {
  if (!e.isPrimary || e.button !== 0 || isHoldControl(e.target)) return;
  clearTimer();
  phase = 'pending';
  pressId = e.pointerId;
  pressAt = { x: e.clientX, y: e.clientY };
  timer = setTimeout(begin, GATHER_THRESHOLD_MS);
}

function onMove(e: PointerEvent) {
  if (phase !== 'pending' || e.pointerId !== pressId) return;
  if (Math.hypot(e.clientX - pressAt.x, e.clientY - pressAt.y) > GATHER_SLOP_PX) end();
}

function onUp(e: PointerEvent) {
  if (e.pointerId === pressId) end();
}

/** A long press on a phone opens the callout menu; while a gather owns the press it should not. */
function onContextMenu(e: Event) {
  if (phase !== 'idle' && !isHoldControl(e.target)) e.preventDefault();
}

/**
 * Press and hold on empty field to pull the installation in toward the
 * specimen. Visitor-caused only, and off under reduced motion: a static
 * half-gathered state would read as a stuck frame rather than as calm.
 */
export function useHoldGather(reducedMotion: boolean) {
  useEffect(() => {
    if (reducedMotion) return;
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    window.addEventListener('blur', end);
    window.addEventListener('contextmenu', onContextMenu);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('blur', end);
      window.removeEventListener('contextmenu', onContextMenu);
      end();
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      velocity = 0;
      publish(0);
    };
  }, [reducedMotion]);
}
