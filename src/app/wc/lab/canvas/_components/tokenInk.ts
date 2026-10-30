'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';

/**
 * Canvas UI components take colours as strings or as [r, g, b] tuples in the
 * 0 to 1 range. They never read CSS, so the page has to hand them a value.
 * Handing them a literal would freeze the effect at whatever the theme was on
 * mount, so instead every colour control picks a *token* and the real value is
 * resolved from the live computed style and re-resolved on every theme change.
 */
export const COLOR_TOKENS = [
  { token: '--fg', label: 'foreground' },
  { token: '--accent', label: 'accent' },
  { token: '--accent-soft', label: 'accent soft' },
  { token: '--accent-warm', label: 'accent warm' },
  { token: '--bg', label: 'background' },
] as const;

export type ColorToken = (typeof COLOR_TOKENS)[number]['token'];

export type TokenInk = Record<ColorToken, string>;

/**
 * Empty means "not resolved yet", which happens on the server and during the
 * first paint. Callers drop the prop rather than substituting a literal, so no
 * colour is ever written down in this folder.
 */
const UNRESOLVED = '';

// getComputedStyle returns whatever form the stylesheet used (hex, rgb(),
// oklch()). Painting it onto a 2D context normalizes any opaque CSS colour to
// #rrggbb, which is the only form the components understand. Same laundering
// trick as TokenPlayground.
function toHex(raw: string): string {
  if (typeof document === 'undefined') return UNRESOLVED;
  const ctx = document.createElement('canvas').getContext('2d');
  if (!ctx) return UNRESOLVED;
  ctx.fillStyle = raw.trim();
  const out = ctx.fillStyle;
  return typeof out === 'string' && out.startsWith('#') ? out : UNRESOLVED;
}

export function readTokenHex(token: ColorToken): string {
  if (typeof window === 'undefined') return UNRESOLVED;
  return toHex(getComputedStyle(document.documentElement).getPropertyValue(token));
}

/** #rrggbb to the [0, 1] triple the WebGL components want. */
export function hexToUnit(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16) || 0;
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function readAll(): TokenInk {
  const next = {} as TokenInk;
  for (const t of COLOR_TOKENS) next[t.token] = readTokenHex(t.token);
  return next;
}

/**
 * The whole palette, kept in step with the theme switcher. Seeded after mount
 * so the server and the first client render agree on the fallback.
 */
export function useTokenInk(): TokenInk {
  const { theme } = useTheme();
  const [ink, setInk] = useState<TokenInk>(() => {
    const seed = {} as TokenInk;
    for (const t of COLOR_TOKENS) seed[t.token] = UNRESOLVED;
    return seed;
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- CSS tokens can only be read from the DOM after the theme has applied
    setInk(readAll());
  }, [theme]);

  return ink;
}
