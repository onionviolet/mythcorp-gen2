'use client';

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Turns the position of the text steps into a fractional step index. The
 * reading line sits at mid-screen on wide layouts and lower on phones, where
 * the stage covers the top of the screen. The value lives in a ref because the
 * camera reads it every frame; only the nearest whole step becomes state.
 */
export function useStoryScroll(stepRefs: RefObject<Array<HTMLElement | null>>) {
  const stepFloat = useRef(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const nodes = (stepRefs.current ?? []).filter((n): n is HTMLElement => n !== null);
      if (nodes.length === 0) return;
      const wide = window.matchMedia('(min-width: 768px)').matches;
      const line = window.innerHeight * (wide ? 0.5 : 0.74);
      const centers = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      let value = 0;
      const above = centers.findIndex((c) => c > line);
      if (above === 0) value = 0;
      else if (above > 0) {
        const i = above - 1;
        value = i + (line - centers[i]) / (centers[above] - centers[i]);
      } else value = centers.length - 1;
      stepFloat.current = value;
      setActiveStep(Math.round(value));
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [stepRefs]);

  return { stepFloat, activeStep };
}
