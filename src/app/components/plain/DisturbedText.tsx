'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { pressWave } from './holdPress';
import type { PointerAt } from './holdPointer';
import { RAMP } from './asciiRender';
import { getPointer, getServerPointer, subscribePointer } from './holdPointer';

/**
 * Type you can push your hand through. The cursor erodes the characters it
 * passes over into the field's own ramp and fades them as it goes, so what is
 * behind the words shows through the holes.
 *
 * The ramp is deliberately the one `asciiRender` quantizes dye with, not the
 * scramble charset in `useScramble`. Those two effects say different things:
 * the scramble is a word arriving, and this is a word being disturbed by the
 * same fluid that is drawing the message behind it. Sharing the ramp is what
 * makes the second reading available at all.
 *
 * Index 0 of the ramp is a space, which is what makes the hottest cells punch
 * an actual hole rather than merely swapping one glyph for another.
 */
const ERODE = RAMP;

/**
 * The reach is measured in characters, not pixels. A fixed pixel radius looks
 * completely different at the two sizes this is used at: 110px takes a bite
 * out of the 8.5vw message but swallows the whole 12px wordmark, so the big
 * type reads as disturbed and the small type reads as broken. Scaling with the
 * character advance gives both the same cursor-sized bite, and keeps the words
 * legible either side of it, which matters because one of them is the only
 * thing this screen has to say.
 */
const REACH_IN_CHARS = 2.4;
// Small text needs a floor or the bite is a single character wide. At the
// readout's 11px this is about four characters, which reads as a disturbance
// rather than as a typo.
const MIN_REACH = 32;
const MAX_REACH = 130;

/**
 * Re-rolling every glyph every frame reads as static rather than as erosion.
 * A character holds its substitute for a few frames, keyed off its own index,
 * so the field of noise crawls instead of boiling.
 */
const HOLD_FRAMES = 4;

type Cell = { ch: string; heat: number };

/**
 * Monospace is doing real work here. Every consumer of this component is
 * `font-mono`, so one character's advance is the element's width divided by
 * its length, and that stays true whatever `letter-spacing` is set to, since
 * tracking adds the same amount to every advance. It would be wrong the moment
 * this was pointed at proportional type.
 */
function erode(text: string, rect: DOMRect | null, x: number, y: number, tick: number, pulse?: PointerAt['pulse']): Cell[] {
  const plain = () => [...text].map((ch) => ({ ch, heat: 0 }));
  if (!rect || rect.width === 0) return plain();

  const advance = rect.width / text.length;
  const reach = Math.max(MIN_REACH, Math.min(MAX_REACH, advance * REACH_IN_CHARS));

  // Cheap rejection. Most frames the cursor is nowhere near this line, and the
  // per-character loop below should not run at all for those.
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
    // Hotter cells reach further down the ramp, towards the space at index 0,
    // so erosion deepens into a hole at the centre instead of stopping at a
    // uniform smudge.
    const depth = Math.floor((1 - heat) * (ERODE.length - 1));
    const jitter = Math.floor((tick + i * 7) / HOLD_FRAMES + i) % 3;
    const index = Math.max(0, Math.min(ERODE.length - 1, depth + jitter - 1));
    out.push({ ch: ERODE[index], heat });
  }

  return out;
}

/**
 * How far a piece of text is allowed to FADE, not whether it erodes. Every
 * consumer erodes: that is the effect, and holding the true character back
 * until a cell was almost fully heated made the small text barely move at all,
 * because at 11px with a 24px reach that is about one character in the whole
 * line. So the glyph always changes inside the reach, and `strength` only
 * governs how far the character is allowed to fade out.
 *
 * Decoration fades most of the way, which is what lets the field show through.
 * Anything you are meant to read while the cursor is on it fades much less,
 * because the cursor sits on a control exactly when its label is needed, and
 * the real string is in the DOM for assistive technology either way.
 */
export const FULL = 1;
export const GENTLE = 0.4;

/**
 * Returns the target text untouched under prefers-reduced-motion and on the
 * server, so it never breaks hydration and never moves for anyone who asked
 * for less movement.
 *
 * The real string is always in the DOM for assistive technology, and only the
 * eroded copy is shown. Without that, turning this on for the readout and the
 * pickers would have handed a screen reader a mouthful of ramp glyphs.
 */
export function DisturbedText({
  text,
  className,
  strength = FULL,
}: {
  text: string;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const tick = useRef(0);
  const pointer = useSyncExternalStore(subscribePointer, getPointer, getServerPointer);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  tick.current += 1;

  const calm = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cells = (!pointer.active && !pointer.pulse) || calm
    ? [...text].map((ch) => ({ ch, heat: 0 }))
    : erode(text, ref.current?.getBoundingClientRect() ?? null, pointer.x, pointer.y, tick.current, pointer.pulse);

  /**
   * Plain text until after hydration, and this is not belt and braces, it is
   * the fix for a real error. One span per character means that when the text
   * differs between server and client the CHILD COUNT differs too, and
   * `suppressHydrationWarning` covers text content, not structure. The elapsed
   * clock counts from module load, which on the server is process start, so it
   * routinely renders a different number of characters and the readout threw a
   * hydration error on every single load. Rendering one text node first makes
   * the server and the first client pass identical by construction, and the
   * per-character version arrives on the next tick where nothing is comparing.
   */
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
