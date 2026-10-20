/** Where the specimen should look, decided in priority order: a figure the
 *  visitor just touched, the mouse if it moved recently, a focused act, and
 *  otherwise the figure the reading line is passing. The page writes the
 *  inputs; the stage reads `pickAttention` every frame. */

export const POINTER_FRESH_MS = 1500;
export const GLANCE_MS = 2000;

export type AttentionInputs = {
  pointer: { x: number; y: number; at: number };
  /** The control the visitor just touched inside a figure, so the glance lands on it. */
  glance: { index: number; until: number; target: HTMLElement | null } | null;
  focusIndex: number | null;
};

export type AttentionSource = 'glance' | 'pointer' | 'focus' | 'scroll';

export type Attention = {
  source: AttentionSource;
  /** Act index the gaze belongs to, or null when it is the pointer. */
  index: number | null;
  /** Viewport point to look at, in CSS pixels. */
  x: number;
  y: number;
};

export function createAttentionInputs(): AttentionInputs {
  return { pointer: { x: 0, y: 0, at: -Infinity }, glance: null, focusIndex: null };
}

function centreOf(el: HTMLElement | null | undefined) {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + Math.min(r.height / 2, window.innerHeight * 0.35) };
}

export function pickAttention(
  inputs: AttentionInputs,
  anchors: ReadonlyArray<HTMLElement | null>,
  stepFloat: number,
  now: number,
): Attention | null {
  const { glance, pointer, focusIndex } = inputs;
  if (glance && glance.until > now) {
    const c = centreOf(glance.target) ?? centreOf(anchors[glance.index]);
    if (c) return { source: 'glance', index: glance.index, ...c };
  }
  if (now - pointer.at < POINTER_FRESH_MS) {
    return { source: 'pointer', index: null, x: pointer.x, y: pointer.y };
  }
  if (focusIndex !== null) {
    const c = centreOf(anchors[focusIndex]);
    if (c) return { source: 'focus', index: focusIndex, ...c };
  }
  const last = anchors.length - 1;
  const lo = Math.max(0, Math.min(last, Math.floor(stepFloat)));
  const hi = Math.min(last, lo + 1);
  const a = centreOf(anchors[lo]);
  const b = centreOf(anchors[hi]);
  if (!a) return null;
  const t = b && hi !== lo ? Math.max(0, Math.min(1, stepFloat - lo)) : 0;
  const to = b ?? a;
  return {
    source: 'scroll',
    index: t < 0.5 ? lo : hi,
    x: a.x + (to.x - a.x) * t,
    y: a.y + (to.y - a.y) * t,
  };
}
