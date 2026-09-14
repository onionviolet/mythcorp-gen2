'use client';

// Walkthrough: /wc/learn/theme-system

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { releasePlainFieldCanvas } from '../components/plain/plainFieldLifecycle';
import { SITE_LOCKED } from '../../siteLock';

export type ThemeName = 'cyberpunk' | 'luxury' | 'paper' | 'plain';

export const THEMES: ReadonlyArray<{
  name: ThemeName;
  label: string;
  blurb: string;
}> = [
  { name: 'cyberpunk', label: 'Cyberpunk', blurb: 'Neon, glow, the boot sequence.' },
  { name: 'luxury',    label: 'Luxury',    blurb: 'Warm midnight, cream, gold.' },
  { name: 'paper',     label: 'Paper',     blurb: 'Reading-room cream, serif.' },
  { name: 'plain',     label: 'Plain',     blurb: 'Black on white, and a live ASCII field.' },
];

const STORAGE_KEY = 'mythcorp-theme-v2';
const DEFAULT_THEME: ThemeName = 'plain';
// Total duration of the transition curtain (each half = 250ms).
const TRANSITION_HALF_MS = 260;

type ThemeCtx = {
  theme: ThemeName;
  /**
   * False until the stored theme has been read back on the client. Anything
   * that would otherwise act on the default theme for one frame (the plain
   * holding screen, for instance) must wait for this.
   */
  ready: boolean;
  setTheme: (next: ThemeName) => void;
  cycleTheme: () => void;
};

const Ctx = createContext<ThemeCtx | null>(null);

function isThemeName(value: unknown): value is ThemeName {
  return value === 'cyberpunk' || value === 'luxury'
    || value === 'paper' || value === 'plain';
}

export function ThemeProvider({
  initialTheme = DEFAULT_THEME,
  children,
}: {
  initialTheme?: ThemeName;
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeName>(SITE_LOCKED ? 'plain' : initialTheme);
  const [ready, setReady] = useState(false);
  // 'idle' | 'cover' (curtain at full opacity, theme swap moment) | 'reveal' (curtain fading away)
  const [phase, setPhase] = useState<'idle' | 'cover' | 'reveal'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (SITE_LOCKED) {
      setThemeState('plain');
      document.documentElement.dataset.theme = 'plain';
      setReady(true);
      requestAnimationFrame(() => {
        document.documentElement.classList.add('theme-ready');
      });
      return;
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isThemeName(stored)) {
        setThemeState(stored);
        document.documentElement.dataset.theme = stored;
      } else {
        document.documentElement.dataset.theme = initialTheme;
      }
    } catch {
      document.documentElement.dataset.theme = initialTheme;
    }
    setReady(true);
    requestAnimationFrame(() => {
      document.documentElement.classList.add('theme-ready');
    });
  }, [initialTheme]);

  const applyTheme = useCallback((next: ThemeName) => {
    if (next !== 'plain') releasePlainFieldCanvas();
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be disabled; in-memory state still works */
    }
    setThemeState(next);
  }, []);

  // Theme swap with a brief darkening curtain so the user isn't flashbanged
  // when going from a dark theme to the bright `paper` one (or back).
  const swapWithCurtain = useCallback((next: ThemeName) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const reduce = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce || theme === next) {
      applyTheme(next);
      return;
    }

    setPhase('cover');
    timeoutRef.current = setTimeout(() => {
      applyTheme(next);
      setPhase('reveal');
      timeoutRef.current = setTimeout(() => {
        setPhase('idle');
        timeoutRef.current = null;
      }, TRANSITION_HALF_MS);
    }, TRANSITION_HALF_MS);
  }, [theme, applyTheme]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const setTheme = useCallback((next: ThemeName) => {
    if (!SITE_LOCKED) swapWithCurtain(next);
  }, [swapWithCurtain]);

  const cycleTheme = useCallback(() => {
    if (SITE_LOCKED) return;
    const idx = THEMES.findIndex((t) => t.name === theme);
    const next = THEMES[(idx + 1) % THEMES.length].name;
    swapWithCurtain(next);
  }, [theme, swapWithCurtain]);

  const value = useMemo<ThemeCtx>(
    () => ({ theme, ready, setTheme, cycleTheme }),
    [theme, ready, setTheme, cycleTheme],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <ThemeCurtain phase={phase} />
    </Ctx.Provider>
  );
}

function ThemeCurtain({ phase }: { phase: 'idle' | 'cover' | 'reveal' }) {
  if (phase === 'idle') return null;
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{
        background: '#000',
        opacity: phase === 'cover' ? 0.78 : 0,
        transition: `opacity ${TRANSITION_HALF_MS}ms ease`,
      }}
    />
  );
}

export function useTheme(): ThemeCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
