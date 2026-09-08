'use client';

// Walkthrough: /wc/learn/plain-mode

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { isHoldControl } from './holdPress';
import { createAsciiFluid } from './asciiFluid';
import { renderTextMask } from './textMask';
import { isHeld } from './holdState';
import { publishMetrics, resetMetrics } from './fieldMetrics';
import { useResolvedScheme } from './usePlainScheme';
import {
  MESSAGE_LINES, getMessageStyle, getServerMessageStyle, subscribeMessageStyle,
} from './messageStore';

/**
 * What decides the line break is not the grid's aspect, it is how many cells
 * each character gets. A letter drawn in ASCII needs roughly eight cells
 * across before it reads as a letter rather than a smudge, and one 16-glyph
 * line only clears that on a very wide grid. Breaking to two lines halves the
 * longest run and doubles the cells per character.
 */
const MIN_CELLS_PER_CHAR = 8;

function holdLines(cols: number, rows: number): string[] {
  const usable = cols * 0.46;
  const oneLine = usable / 'WORK IN PROGRESS'.length;
  if (oneLine >= MIN_CELLS_PER_CHAR && rows > 26) return ['WORK IN PROGRESS'];
  return [...MESSAGE_LINES];
}

/**
 * The one ornament plain mode allows. On a held route it also carries the
 * message: the words are dye in the field rather than DOM text, so they
 * smear when you push through them and re-ink themselves afterwards.
 */
export function PlainField() {
  const { theme } = useTheme();
  const pathname = usePathname() ?? '/';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scheme = useResolvedScheme();
  const messageStyle = useSyncExternalStore(
    subscribeMessageStyle, getMessageStyle, getServerMessageStyle,
  );
  const active = theme === 'plain';
  const held = isHeld(theme, pathname);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rootStyle = window.getComputedStyle(document.documentElement);
    const ink = rootStyle.getPropertyValue('--plain-ink').trim() || '#111111';
    const fontFamily = window.getComputedStyle(canvas).fontFamily || 'monospace';

    const field = createAsciiFluid(canvas, {
      ink,
      ambient: true,
      cell: 6,
      sourceHold: 0.95,
      vorticity: 0.6,
      onMetrics: publishMetrics,
      source: held && messageStyle === 'field'
        ? (cols, rows) =>
            renderTextMask(holdLines(cols, rows), cols, rows, {
              fontFamily,
              centre: 0.24,
              fill: 0.46,
            })
        : undefined,
    });

    // All four go on window, because the canvas is pointer-events-none and so
    // never receives anything itself. The id is forwarded on every one of them:
    // it is what lets the field tell a drag apart from a finger landing in a
    // new place, and what stops a second finger fighting the first.
    const onMove = (e: PointerEvent) => field.pointer(e.clientX, e.clientY, e.pointerId);
    const onDown = (e: PointerEvent) => {
      if (e.isPrimary && e.button === 0 && !isHoldControl(e.target)) field.press(e.clientX, e.clientY, e.pointerId);
    };
    const onUp = (e: PointerEvent) => field.release(e.pointerId);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      field.destroy();
      resetMetrics();
    };
    // scheme is in here because the ink colour is read once, off the CSS
    // variable, when the field is built. Without it a light/dark switch leaves
    // the glyphs the previous scheme's colour, which on white is invisible.
  }, [active, held, scheme, messageStyle]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ fontFamily: 'var(--font-geist-mono), ui-monospace, monospace' }}
    />
  );
}
