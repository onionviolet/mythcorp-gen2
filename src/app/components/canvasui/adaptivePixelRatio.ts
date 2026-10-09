/** Pixel-ratio caps a struggling touch device steps down through, one at a time. */
const STEPS = [2, 1.5, 1.25] as const;
/** Frames judged together before a step. */
const WINDOW = 90;
/** A frame slower than this misses about 45fps. */
const SLOW_FRAME_MS = 22;
/** Share of slow frames in a window that triggers a step. */
const SLOW_SHARE = 0.6;
/** Asset parsing and first uploads make the opening frames slow on every device. */
const WARMUP_MS = 3000;
/** Longer gaps are a hidden tab or a paused loop, not rendering cost. */
const GAP_MS = 250;

export type PixelRatioGovernor = {
  ratio: () => number;
  /** Feed the raw time since the previous frame; true when the cap dropped and the caller should resize. */
  sample: (frameMs: number) => boolean;
};

/**
 * Specimen canvases render at the device pixel ratio, capped at 2. On a touch
 * device that cannot hold about 45fps the cap steps down to 1.5, then 1.25,
 * and never climbs back, so the image does not pump. Fine pointers never
 * change, so desktop keeps its exact look.
 */
export function createPixelRatioGovernor(): PixelRatioGovernor {
  const adaptive = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(pointer: coarse)').matches;
  const started = performance.now();
  let cap: number = STEPS[0];
  let frames = 0;
  let slow = 0;

  const ratio = () => Math.min(window.devicePixelRatio || 1, cap);

  return {
    ratio,
    sample(frameMs) {
      if (!adaptive || frameMs <= 0 || frameMs > GAP_MS) return false;
      if (performance.now() - started < WARMUP_MS) return false;
      frames++;
      if (frameMs > SLOW_FRAME_MS) slow++;
      if (frames < WINDOW) return false;
      const struggling = slow / frames > SLOW_SHARE;
      frames = 0;
      slow = 0;
      const next = STEPS.find(step => step < cap);
      if (!struggling || next === undefined) return false;
      const before = ratio();
      cap = next;
      return ratio() !== before;
    },
  };
}
