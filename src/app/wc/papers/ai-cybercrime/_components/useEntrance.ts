'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../../../components/plain/useReducedMotion';

export function useEntrance<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setEntered(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, threshold]);

  return { ref, pending: !reduced && !entered, animate: !reduced };
}
