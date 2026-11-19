'use client';

import { DEFAULT_HOLD_COMPOSITION } from './holdCompositions';

/**
 * Which way the message is drawn. The picker lives on the holding screen and
 * the field lives in the layout, two siblings that never meet, so the choice
 * goes through a store rather than a prop. Same shape as fieldMetrics: one
 * value, a set of listeners, no context provider for a single enum.
 */
export const MESSAGE_STYLES = ['field', 'solid', 'decode', 'dust'] as const;

export type MessageStyle = (typeof MESSAGE_STYLES)[number];

/** What the WORDS row cycles through. `solid` and `decode` are plain DOM type
 *  and read as a label laid over the scene, so both are blocked from the cycle
 *  and from every authored scene (2026-11-19). They stay styles for a future
 *  fallback. */
const BLOCKED_MESSAGE_STYLES: readonly MessageStyle[] = ['solid', 'decode'];
export const MESSAGE_CYCLE = MESSAGE_STYLES.filter(
  (item) => !BLOCKED_MESSAGE_STYLES.includes(item),
);

export const MESSAGE_LINES = ['WORK IN', 'PROGRESS'] as const;

const DEFAULT: MessageStyle = DEFAULT_HOLD_COMPOSITION.message;

let current: MessageStyle = DEFAULT;
const listeners = new Set<() => void>();

export function setMessageStyle(next: MessageStyle) {
  if (next === current) return;
  current = next;
  listeners.forEach((l) => l());
}

export function subscribeMessageStyle(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getMessageStyle(): MessageStyle {
  return current;
}

/** Server snapshot. Must be a stable reference or React loops forever. */
export function getServerMessageStyle(): MessageStyle {
  return DEFAULT;
}
