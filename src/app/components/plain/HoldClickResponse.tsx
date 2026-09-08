'use client';

import { useEffect, useRef } from 'react';
import { getPointer, subscribePointer } from './holdPointer';
import { PRESS_RADIUS } from './holdPress';

export function HoldClickResponse() {
  const ring = useRef<HTMLDivElement>(null);
  useEffect(() => subscribePointer(() => {
    const node = ring.current;
    if (!node) return;
    const { pulse } = getPointer();
    if (!pulse) { node.style.opacity = '0'; return; }
    const radius = 12 + PRESS_RADIUS * pulse.progress;
    node.style.width = `${radius * 2}px`;
    node.style.height = `${radius * 2}px`;
    node.style.transform = `translate(${pulse.x - radius}px, ${pulse.y - radius}px)`;
    node.style.opacity = `${0.22 * (1 - pulse.progress)}`;
  }), []);

  return <div ref={ring} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-20 rounded-full border border-[color:var(--fg)] opacity-0" />;
}
