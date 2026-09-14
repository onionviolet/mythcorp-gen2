'use client';

export type FieldActivity = {
  level: number;
  state: 'calm' | 'active' | 'surge';
};

const EMPTY: FieldActivity = { level: 0, state: 'calm' };
const RELEASE_MS = 1200;
const ATTACK_MS = 45;
const FULL_SPEED_PX_PER_MS = 1.1;
const TICK_MS = 60;

let level = 0;
let updatedAt = 0;
let current = EMPTY;
let timer: ReturnType<typeof setTimeout> | null = null;
const actorSamples = new Map<string, { x: number; y: number; at: number }>();
const listeners = new Set<() => void>();

function stateFor(next: number): FieldActivity['state'] {
  if (next >= 0.65) return 'surge';
  if (next >= 0.05) return 'active';
  return 'calm';
}

function publish(next: number) {
  const rounded = Math.round(Math.max(0, Math.min(1, next)) * 100) / 100;
  const state = stateFor(rounded);
  if (rounded === current.level && state === current.state) return;
  current = { level: rounded, state };
  listeners.forEach((listener) => listener());
}

function release(now: number) {
  if (updatedAt) level *= Math.exp(-Math.max(0, now - updatedAt) / RELEASE_MS);
  updatedAt = now;
}

function decay() {
  timer = null;
  if (level <= 0) return;
  release(performance.now());
  if (level < 0.005) level = 0;
  publish(level);
  if (level > 0) timer = setTimeout(decay, TICK_MS);
}

export function reportVisibleMovement(
  actor: 'cat' | 'cursor-echo',
  x: number,
  y: number,
  now = performance.now(),
) {
  const previous = actorSamples.get(actor);
  actorSamples.set(actor, { x, y, at: now });
  if (!previous) {
    return;
  }

  const elapsed = Math.max(1, now - previous.at);
  const distance = Math.hypot(x - previous.x, y - previous.y);
  release(now);
  const target = Math.min(1, distance / elapsed / FULL_SPEED_PX_PER_MS);
  const attack = 1 - Math.exp(-Math.min(80, Math.max(16, elapsed)) / ATTACK_MS);
  const response = target >= level ? attack : attack * 0.22;
  level += (target - level) * response;
  publish(level);
  if (timer) clearTimeout(timer);
  timer = setTimeout(decay, TICK_MS);
}

export function reportVisibleClick() {
  const now = performance.now();
  release(now);
  level = Math.max(level, 0.78);
  publish(level);
  if (timer) clearTimeout(timer);
  timer = setTimeout(decay, TICK_MS);
}

function stop() {
  if (timer) clearTimeout(timer);
  timer = null;
  level = 0;
  updatedAt = 0;
  actorSamples.clear();
  current = EMPTY;
}

export function subscribeFieldActivity(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) stop();
  };
}

export function getFieldActivity(): FieldActivity {
  return current;
}

export function getServerFieldActivity(): FieldActivity {
  return EMPTY;
}
