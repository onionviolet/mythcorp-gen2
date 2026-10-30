'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  SCHEME_ATTR, SCHEME_KEY, isSchemeChoice, resolveScheme,
  type Scheme, type SchemeChoice,
} from './holdScheme';

/**
 * Reads the stored choice back on mount, follows the system while the choice
 * is 'system', and writes the resolved value to <html> so the CSS and the
 * canvas components agree on which way round the ink goes.
 */
export function usePlainScheme(): {
  choice: SchemeChoice;
  scheme: Scheme;
  setChoice: (next: SchemeChoice) => void;
} {
  const [choice, setChoiceState] = useState<SchemeChoice>('system');
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SCHEME_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is read after hydration to match the server render
      if (isSchemeChoice(stored)) setChoiceState(stored);
    } catch {
      /* storage may be disabled; the system preference still works */
    }
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const scheme = resolveScheme(choice, prefersDark);

  useEffect(() => {
    document.documentElement.setAttribute(SCHEME_ATTR, scheme);
  }, [scheme]);

  const setChoice = useCallback((next: SchemeChoice) => {
    setChoiceState(next);
    try {
      window.localStorage.setItem(SCHEME_KEY, next);
    } catch {
      /* in-memory state still works */
    }
  }, []);

  return { choice, scheme, setChoice };
}

/**
 * Read-only counterpart for anything that needs to follow the scheme without
 * owning it. The resolved value already lives on <html>, written by the
 * pre-paint script and then by usePlainScheme, so this watches that attribute
 * rather than keeping a second copy of the decision.
 */
export function useResolvedScheme(): Scheme {
  const [scheme, setScheme] = useState<Scheme>('light');

  useEffect(() => {
    const root = document.documentElement;
    const read = () =>
      setScheme(root.getAttribute(SCHEME_ATTR) === 'dark' ? 'dark' : 'light');
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: [SCHEME_ATTR] });
    return () => observer.disconnect();
  }, []);

  return scheme;
}
