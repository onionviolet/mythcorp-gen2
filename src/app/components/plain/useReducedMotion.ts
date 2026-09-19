'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(listener: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener('change', listener);
  return () => media.removeEventListener('change', listener);
}

export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}
