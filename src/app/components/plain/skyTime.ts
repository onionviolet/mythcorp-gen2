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

/** How long a released sweep takes to ease back to now. */
export const SKY_RETURN_MS = 1200;

let easeFrame = 0;
let touched = false;

/** One owner at a time: any new ease, or a visitor grabbing the horizon,
 *  stops the one in flight. */
export function stopSkyEase(): void {
  if (easeFrame) cancelAnimationFrame(easeFrame);
  easeFrame = 0;
}

export function easeSkyOffset(to: number, ms: number, curve: (t: number) => number): void {
  stopSkyEase();
  const from = offsetMs;
  if (from === to) return;
  const started = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - started) / ms);
    setSkyOffset(t >= 1 ? to : from + (to - from) * curve(t));
    easeFrame = t < 1 ? requestAnimationFrame(tick) : 0;
  };
  easeFrame = requestAnimationFrame(tick);
}

/** The release: a cubic ease-out back to the real time. */
export function easeSkyHome(): void {
  easeSkyOffset(0, SKY_RETURN_MS, (t) => 1 - (1 - t) ** 3);
}

/** Set once the visitor has swept the horizon themselves. */
export function markSkyTouched(): void {
  touched = true;
}

export function skyTouched(): boolean {
  return touched;
}
