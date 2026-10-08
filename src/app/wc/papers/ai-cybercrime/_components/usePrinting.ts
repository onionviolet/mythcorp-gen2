'use client';

import { useSyncExternalStore } from 'react';

let printing = false;
const listeners = new Set<() => void>();

function set(next: boolean) {
  if (printing === next) return;
  printing = next;
  for (const l of listeners) l();
}

let wired = false;
function wire() {
  if (wired || typeof window === 'undefined') return;
  wired = true;
  window.addEventListener('beforeprint', () => set(true));
  window.addEventListener('afterprint', () => set(false));
  const mq = window.matchMedia('print');
  mq.addEventListener('change', () => set(mq.matches));
  if (mq.matches) printing = true;
}

function subscribe(listener: () => void) {
  wire();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePrinting() {
  return useSyncExternalStore(subscribe, () => printing, () => false);
}
