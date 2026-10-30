'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const QUIPS = [
  'thirty extra lives, redeemable nowhere',
  'classified as a feature',
  'you found it. nothing happens',
  'okay, that was kind of cool',
  'unlocked: a tiny burst of color',
];

type Bit = { tx: number; ty: number; r: number };

function makeConfetti(): Bit[] {
  return Array.from({ length: 24 }, (_, i) => {
    const angle = (i / 24) * Math.PI * 2;
    const dist = 180 + Math.random() * 120;
    return {
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist,
      r: (Math.random() - 0.5) * 720,
    };
  });
}

export function KonamiEgg() {
  const { cycleTheme } = useTheme();
  const [position, setPosition] = useState(0);
  const [show, setShow] = useState(false);
  const [quip, setQuip] = useState(QUIPS[0]);
  const [confetti, setConfetti] = useState<Bit[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't fire while user is typing in a form field.
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

      const expected = SEQUENCE[position];
      // Match arrow keys exactly; lowercase the letter keys.
      const got = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (got === expected) {
        const next = position + 1;
        if (next === SEQUENCE.length) {
          setPosition(0);
          setQuip(QUIPS[Math.floor(Math.random() * QUIPS.length)]);
          setConfetti(makeConfetti());
          setShow(true);
          cycleTheme();
        } else {
          setPosition(next);
        }
      } else {
        // Wrong key: reset, but if it's the start of the sequence count it.
        setPosition(got === SEQUENCE[0] ? 1 : 0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [position, cycleTheme]);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), 2800);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[9997] pointer-events-none flex items-center justify-center"
    >
      <style>{`
        @keyframes konamiBurst {
          0%   { opacity: 0; transform: scale(0.8); }
          15%  { opacity: 1; transform: scale(1.05); }
          75%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1); }
        }
        @keyframes konamiConfetti {
          0%   { opacity: 1; transform: translate(0, 0) rotate(0deg); }
          100% { opacity: 0; transform: translate(var(--tx), var(--ty)) rotate(var(--r)); }
        }
        .konami-card { animation: konamiBurst 2.6s ease-out forwards; }
        .konami-bit  { animation: konamiConfetti 2.4s cubic-bezier(0.2, 0.7, 0.2, 1) forwards; }
      `}</style>

      <div className="konami-card themed-surface px-6 py-4 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--accent)]">
          ↑↑↓↓←→←→ b a
        </p>
        <p className="mt-2 font-serif text-base sm:text-lg">{quip}</p>
        <p className="mt-1 text-xs text-[color:var(--fg-subtle)]">
          theme cycled forward as a thank you
        </p>
      </div>

      {confetti.map(({ tx, ty, r }, i) => {
        const colors = ['var(--accent)', 'var(--accent-soft)', 'var(--accent-warm)'];
        return (
          <span
            key={i}
            className="konami-bit absolute h-2 w-2 rounded-full"
            style={{
              background: colors[i % colors.length],
              boxShadow: '0 0 8px currentColor',
              ['--tx' as string]: `${tx}px`,
              ['--ty' as string]: `${ty}px`,
              ['--r' as string]: `${r}deg`,
            }}
          />
        );
      })}
    </div>
  );
}
