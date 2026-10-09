/** The installation's clock for sky purposes: real time plus an offset the
 *  visitor can sweep by dragging the horizon. The readout's Chicago clock and
 *  the sun both read `skyNow()`, so a drag time-lapses everything together.
 *  Release eases the offset back to zero. */
let offsetMs = 0;
const listeners = new Set<() => void>();

export function skyNow(): Date {
  return new Date(Date.now() + offsetMs);
}

export function getSkyOffset(): number {
  return offsetMs;
}

export function setSkyOffset(ms: number): void {
  if (ms === offsetMs) return;
  offsetMs = ms;
  for (const listener of listeners) listener();
}

export function subscribeSkyOffset(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
