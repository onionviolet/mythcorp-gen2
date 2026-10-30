'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  anomalyName, anomalyTotal, getLedger, getServerLedger, markAnnounced, subscribeLedger,
  type AnomalyId,
} from './anomalyLedger';
import { useReducedMotion } from './useReducedMotion';
import { useScramble } from './useScramble';

const REVEAL_MS = 1600;

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The readout's anomalies row. Shows the count; when a find has not been
 * announced yet (including finds made in another room), the value resolves
 * into its name for a moment, then settles back to the count. Under reduced
 * motion the name appears plainly, since useScramble returns it unchanged.
 */
export function useAnomalyReveal() {
  const ledger = useSyncExternalStore(subscribeLedger, getLedger, getServerLedger);
  const reducedMotion = useReducedMotion();
  const pending = ledger.found.find(id => !ledger.announced.includes(id)) ?? null;
  const [showing, setShowing] = useState<AnomalyId | null>(null);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (!pending) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- starts the timed reveal when a new find appears
    setShowing(pending);
    setAnnouncement(`Anomaly logged: ${anomalyName(pending)}.`);
    const timer = setTimeout(() => {
      setShowing(null);
      markAnnounced(pending);
    }, REVEAL_MS);
    return () => clearTimeout(timer);
  }, [pending]);

  const count = ledger.found.length;
  const settled = `${pad(count)} / ${pad(anomalyTotal(reducedMotion))}`;
  const value = useScramble(showing ? anomalyName(showing) : settled, { active: showing !== null });

  return { on: ledger.on, count, value, announcement };
}
