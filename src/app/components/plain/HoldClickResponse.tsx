'use client';

import { useEffect, useRef, useState } from 'react';
import { getPointer, subscribePointer } from './holdPointer';
import { PRESS_DURATION, PRESS_RADIUS } from './holdPress';
import { reportVisibleClick } from './fieldActivity';

const MAX_WAVES = 4;
type Wave = { id: number; x: number; y: number; started: number };

export function HoldClickResponse() {
  const [waves, setWaves] = useState<Wave[]>([]);
  const nextId = useRef(0);
  const previousProgress = useRef<number | null>(null);
  const waveCount = useRef(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const now = performance.now();
      setWaves(current => {
        const remaining = current.filter(wave => now - wave.started < PRESS_DURATION);
        waveCount.current = remaining.length;
        return remaining;
      });
      if (waveCount.current) frame = requestAnimationFrame(update);
      else frame = 0;
    };
    const unsubscribe = subscribePointer(() => {
      const { pulse } = getPointer();
      if (!pulse) { previousProgress.current = null; return; }
      const isNewPulse = previousProgress.current === null || pulse.progress < previousProgress.current - 0.05;
      previousProgress.current = pulse.progress;
      if (!isNewPulse) return;
      reportVisibleClick();
      setWaves(current => [...current, {
        id: nextId.current++, x: pulse.x, y: pulse.y, started: performance.now(),
      }].slice(-MAX_WAVES));
      waveCount.current = Math.min(MAX_WAVES, waveCount.current + 1);
      if (!frame) frame = requestAnimationFrame(update);
    });
    return () => { unsubscribe(); cancelAnimationFrame(frame); };
  }, []);

  return <>{waves.map(wave => <WaveRing key={wave.id} wave={wave} />)}</>;
}

function WaveRing({ wave }: { wave: Wave }) {
  const elapsed = Math.min(1, (performance.now() - wave.started) / PRESS_DURATION);
  const radius = 12 + PRESS_RADIUS * elapsed;
  return <div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-20 rounded-full border border-[color:var(--fg)]" style={{
    width: radius * 2, height: radius * 2,
    transform: `translate(${wave.x - radius}px, ${wave.y - radius}px)`,
    opacity: 0.22 * (1 - elapsed),
  }} />;
}
