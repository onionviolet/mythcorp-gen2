'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { pressWave } from './holdPress';
import type { PointerAt } from './holdPointer';
import { RAMP } from './asciiRender';
import { getPointer, getServerPointer, subscribePointer } from './holdPointer';
import { useReducedMotion } from './useReducedMotion';

/** Type the cursor erodes into the field's ramp (`asciiRender`), not the scramble charset. */
const ERODE = RAMP;

/** Reach is in characters, not pixels, so large and small type get the same bite. */
const REACH_IN_CHARS = 2.4;
// Floor so small text still gets a bite wider than one character.
const MIN_REACH = 32;
const MAX_REACH = 130;

/** A glyph holds its substitute for a few frames so the noise crawls, not boils. */
const HOLD_FRAMES = 4;

type Cell = { ch: string; heat: number };

/** Assumes monospace: one advance is the element width divided by its length. */
function erode(text: string, rect: DOMRect | null, x: number, y: number, tick: number, pulse?: PointerAt['pulse']): Cell[] {
  const plain = () => [...text].map((ch) => ({ ch, heat: 0 }));
  if (!rect || rect.width === 0) return plain();

  const advance = rect.width / text.length;
  const reach = Math.max(MIN_REACH, Math.min(MAX_REACH, advance * REACH_IN_CHARS));

  // Cheap rejection when the cursor is nowhere near.
  if (!pulse && (
    x < rect.left - reach || x > rect.right + reach
    || y < rect.top - reach || y > rect.bottom + reach
  )) return plain();

  const midY = rect.top + rect.height / 2;
  const out: Cell[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === ' ') { out.push({ ch, heat: 0 }); continue; }

    const midX = rect.left + advance * (i + 0.5);
    const d = Math.hypot(midX - x, midY - y);
    const wave = pulse ? pressWave(Math.hypot(midX - pulse.x, midY - pulse.y), pulse.progress) : 0;
    const heat = Math.max(0, 1 - d / reach, wave);
    if (!heat) { out.push({ ch, heat: 0 }); continue; }
    // Hotter cells go further down the ramp, toward the space at index 0.
    const depth = Math.floor((1 - heat) * (ERODE.length - 1));
    const jitter = Math.floor((tick + i * 7) / HOLD_FRAMES + i) % 3;
    const index = Math.max(0, Math.min(ERODE.length - 1, depth + jitter - 1));
    out.push({ ch: ERODE[index], heat });
  }

  return out;
}

/** `strength` caps how far a glyph fades; it always changes inside the reach. */
export const FULL = 1;
export const GENTLE = 0.4;

/** Plain text under reduced motion and on the server. The real string stays in
 * the DOM (sr-only) so assistive technology never reads the ramp glyphs. */
export function DisturbedText({
  text,
  className,
  strength = FULL,
  active = true,
}: {
  text: string;
  className?: string;
  strength?: number;
  active?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const tick = useRef(0);
  const pointer = useSyncExternalStore(subscribePointer, getPointer, getServerPointer);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  tick.current += 1;

  const calm = useReducedMotion();

  const cells = !active || (!pointer.active && !pointer.pulse) || calm
    ? [...text].map((ch) => ({ ch, heat: 0 }))
    : erode(text, ref.current?.getBoundingClientRect() ?? null, pointer.x, pointer.y, tick.current, pointer.pulse);

  // Plain text until hydrated: per-character spans change the child count, which
  // suppressHydrationWarning does not cover (the elapsed clock differs per render).
  if (!hydrated) {
    return <span className={className} suppressHydrationWarning>{text}</span>;
  }

  return (
    <span className={className} suppressHydrationWarning>
      <span className="sr-only" suppressHydrationWarning>{text}</span>
      <span ref={ref} aria-hidden suppressHydrationWarning>
        {cells.map((cell, i) => (
          <span
            key={i}
            style={cell.heat ? { opacity: 1 - cell.heat * 0.55 * strength } : undefined}
          >
            {cell.ch}
          </span>
        ))}
      </span>
    </span>
  );
}
