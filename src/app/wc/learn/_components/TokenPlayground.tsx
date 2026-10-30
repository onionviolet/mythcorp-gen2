'use client';

// Walkthrough: /wc/learn/build-a-playground

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

// Only opaque hex tokens live here. `<input type="color">` refuses anything
// with alpha, and `--border` / `--bg-elevated` carry alpha in some themes, so
// they stay out of the picker on purpose.
const EDITABLE = [
  { name: '--accent', label: 'Accent' },
  { name: '--accent-soft', label: 'Accent soft' },
  { name: '--fg', label: 'Foreground' },
  { name: '--bg', label: 'Background' },
] as const;

type TokenName = (typeof EDITABLE)[number]['name'];

// getComputedStyle hands back whatever form the stylesheet used (rgb(), hex,
// oklch()). The color input only speaks #rrggbb, so we launder the value
// through a canvas, which normalizes any opaque CSS color to hex.
function toHex(raw: string): string {
  if (typeof document === 'undefined') return '#000000';
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return '#000000';
  ctx.fillStyle = '#000000';
  ctx.fillStyle = raw.trim();
  const out = ctx.fillStyle;
  return out.startsWith('#') ? out : '#000000';
}

function readToken(name: TokenName): string {
  if (typeof window === 'undefined') return '#000000';
  return toHex(getComputedStyle(document.documentElement).getPropertyValue(name));
}

export function TokenPlayground() {
  const { theme } = useTheme();
  // Every token we have written an inline override for, so we can remove
  // exactly those and never touch anything we did not set.
  const dirty = useRef<Set<TokenName>>(new Set());
  const [values, setValues] = useState<Record<string, string>>({});

  // Seed the swatches from the live computed values. Re-seed on theme change
  // (after our overrides are cleared) so the pickers show the new base colors.
  const reseed = () => {
    const next: Record<string, string> = {};
    for (const t of EDITABLE) next[t.name] = readToken(t.name);
    setValues(next);
  };

  const clearOverrides = () => {
    const root = document.documentElement;
    for (const name of dirty.current) root.style.removeProperty(name);
    dirty.current.clear();
  };

  // Seed once on mount, and clear our inline overrides when the component
  // unmounts so navigating away never leaves the real site recolored.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- computed styles can only be read after mount
    reseed();
    return clearOverrides;
  }, []);

  // When the shared theme changes, drop our overrides (the inline style would
  // otherwise win over the new [data-theme] block and pin the old colors) and
  // re-seed from the fresh base palette.
  useEffect(() => {
    clearOverrides();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- re-seed from the fresh base palette once the theme has applied
    reseed();
  }, [theme]);

  const setToken = (name: TokenName, hex: string) => {
    document.documentElement.style.setProperty(name, hex);
    dirty.current.add(name);
    setValues((v) => ({ ...v, [name]: hex }));
  };

  const reset = () => {
    clearOverrides();
    reseed();
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-[11px] uppercase tracking-widest text-[color:var(--fg-subtle)]">
        Live tokens on <code>&lt;html&gt;</code>
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {EDITABLE.map((t) => (
          <label key={t.name} className="flex items-center gap-3 text-sm">
            <input
              type="color"
              value={values[t.name] ?? '#000000'}
              onChange={(e) => setToken(t.name, e.target.value)}
              aria-label={t.label}
              className="h-8 w-10 shrink-0 cursor-pointer rounded border
                         border-[color:var(--border)] bg-transparent"
            />
            <span className="flex flex-col">
              <span className="text-[color:var(--fg)]">{t.label}</span>
              <span className="font-mono text-[11px] text-[color:var(--fg-subtle)]">
                {t.name}
              </span>
            </span>
          </label>
        ))}
      </div>

      <div className="flex items-center gap-3 rounded-md border border-[color:var(--border)]
                      bg-[color:var(--bg)] p-3">
        <span className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs
                         font-semibold text-[color:var(--bg)]">
          Accent chip
        </span>
        <span className="text-sm text-[color:var(--fg-muted)]">
          Every element on this page reads the same tokens.
        </span>
      </div>

      <button
        onClick={reset}
        className="themed-pill self-start px-4 py-1.5 text-sm text-[color:var(--fg-muted)]
                   hover:text-[color:var(--fg)]"
      >
        [ ↺ reset tokens ]
      </button>
    </div>
  );
}
