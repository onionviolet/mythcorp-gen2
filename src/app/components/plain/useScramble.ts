'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const CHARSET = '<>/\\[]{}=+*#%$&@01';

/**
 * Ideaboard #65. Resolves text out of glyph noise, one character at a time.
 * Each character gets its own start frame, so the word settles left to right
 * instead of snapping. Returns the target text unchanged under
 * prefers-reduced-motion, and on the server, so it never breaks hydration.
 */
export function useScramble(text: string, { active = true, frames = 26 } = {}) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!active || reducedMotion) { setOut(text); return; }

    let frame = 0;
    // Stagger: character i is still noise until frame i * step.
    const step = text.length ? frames / (text.length * 1.6) : 1;

    const tick = () => {
      let done = true;
      let next = '';
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') { next += ' '; continue; }
        if (frame >= i * step + step) {
          next += text[i];
        } else {
          done = false;
          next += CHARSET[Math.floor(Math.random() * CHARSET.length)];
        }
      }
      setOut(next);
      frame += 1;
      if (!done) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [text, active, frames, reducedMotion]);

  return out;
}
