'use client';

import { useSyncExternalStore } from 'react';
import { supportsHtmlInCanvas } from '../../../../components/plain/supportsHtmlInCanvas';

/**
 * The flag probe is the plain theme's, not a second copy of it. That file was
 * written for the holding screen, went unused when the screen stopped needing
 * the flag, and is exactly the same twelve lines the lab needs, so the lab
 * imports it rather than carrying a duplicate that can drift.
 */
export { supportsHtmlInCanvas };

/**
 * Null until the probe has run. The roster reads three states, not two: we do
 * not know yet, supported, absent. Guessing during the first paint would flash
 * a wrong label at everyone.
 */
let htmlInCanvasProbe: boolean | undefined;
const noopSubscribe = () => () => {};
const readHtmlInCanvas = () => (htmlInCanvasProbe ??= supportsHtmlInCanvas());
const unknownHtmlInCanvas = () => null;

export function useHtmlInCanvas(): boolean | null {
  return useSyncExternalStore<boolean | null>(noopSubscribe, readHtmlInCanvas, unknownHtmlInCanvas);
}

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

const readReduced = () => window.matchMedia(REDUCED_QUERY).matches;
const serverReduced = () => false;

/** Live, because the setting can change while the page is open. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReduced, readReduced, serverReduced);
}
