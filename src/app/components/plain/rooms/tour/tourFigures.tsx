'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useReducedMotion } from '../../useReducedMotion';
import { SCHEME_INK } from '../../holdScheme';
import { useResolvedScheme } from '../../usePlainScheme';

const Pending = ({ label }: { label: string }) => (
  <p className="grid h-40 place-items-center font-mono text-xs text-[color:var(--fg-subtle)]">{label}</p>
);

export const PaperFigure = dynamic(
  () => import('../../../../wc/papers/ai-cybercrime/_components/BarrierToEntry').then(m => m.BarrierToEntry),
  { ssr: false, loading: () => <Pending label="loading figure" /> },
);

export const DoubtFigure = dynamic(
  () => import('../../../../og/doubt/_components/ProgressFigures').then(m => m.ProgressFigures),
  { ssr: false, loading: () => <Pending label="loading figure" /> },
);

const MiniStarField = dynamic(
  () => import('../../../../wc/learn/_components/MiniStarField').then(m => m.MiniStarField),
  { ssr: false, loading: () => <Pending label="loading canvas" /> },
);

// Same four phases as the Calhoun essay, small enough to step through here.
const PHASES = [
  { tag: 'A', name: 'Strive', note: 'The founders explore, claim ground, establish order.' },
  { tag: 'B', name: 'Exploit', note: 'Rapid growth. Social roles still have room for newcomers.' },
  { tag: 'C', name: 'Stagnation', note: 'Every niche is filled. The surplus has nowhere to fit, and withdraws.' },
  { tag: 'D', name: 'Death', note: 'A generation never learns courtship, conflict, or care. The colony quietly runs out.' },
] as const;

export function CalhounFigure() {
  const [i, setI] = useState(0);
  const phase = PHASES[i];
  return (
    <div className="p-5">
      <div role="group" aria-label="Phase" className="flex gap-2 font-mono text-xs">
        {PHASES.map((p, n) => (
          <button
            key={p.tag}
            type="button"
            onClick={() => setI(n)}
            aria-pressed={n === i}
            className={`min-h-11 min-w-11 border px-3 transition-colors ${
              n === i
                ? 'border-[color:var(--fg)] text-[color:var(--fg)]'
                : 'border-[color:var(--border)] text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]'
            }`}
          >
            {p.tag}
          </button>
        ))}
      </div>
      <p className="mt-4 text-lg text-[color:var(--fg)]">{phase.name}</p>
      <p aria-live="polite" className="mt-1 text-sm text-[color:var(--fg-muted)]">{phase.note}</p>
    </div>
  );
}

export function StarFigure() {
  const reduced = useReducedMotion();
  const ink = SCHEME_INK[useResolvedScheme()];
  const [on, setOn] = useState(false);
  const [stars, setStars] = useState(2);
  if (reduced && !on) {
    return (
      <div className="grid h-40 place-items-center">
        <button
          type="button"
          onClick={() => setOn(true)}
          className="min-h-11 border border-[color:var(--border)] px-4 py-2 font-mono text-xs text-[color:var(--fg-muted)] hover:text-[color:var(--fg)]"
        >
          start the stars
        </button>
      </div>
    );
  }
  return (
    <div>
      <div className="h-[260px]">
        <MiniStarField settings={{ stars, speed: reduced ? 0 : 1, color: ink.highlight }} backdrop={ink.paper} />
      </div>
      <label className="flex items-center gap-3 p-4 font-mono text-xs text-[color:var(--fg-muted)]">
        more stars
        <input
          type="range" min={0.5} max={5} step={0.5} value={stars}
          onChange={e => setStars(parseFloat(e.target.value))}
          className="w-full accent-[color:var(--fg)]"
        />
      </label>
    </div>
  );
}
