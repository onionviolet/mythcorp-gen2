'use client';

/**
 * The anomaly ledger: counts the hidden behaviours the front page already
 * has, the first time a visitor finds each one. Each behaviour calls
 * `logAnomaly` at the moment it succeeds. Nothing is sent anywhere; the record
 * lives in this browser's localStorage, or for the session only when storage
 * is blocked.
 *
 * A prototype behind `?ledger=1`. Until a load has seen that flag this
 * session, every function here is a no-op that never touches storage, so the
 * live front page is unchanged.
 */

export const ANOMALIES = [
  { id: 'sweep', name: 'swept the day' },
  { id: 'surge', name: 'held the specimen', needsMotion: true },
  { id: 'scene', name: 'changed the scene' },
  { id: 'rewire', name: 'rewired a channel' },
  { id: 'operator', name: 'woke the operator' },
  { id: 'file', name: 'read a back room' },
  { id: 'rooms', name: 'walked every room' },
  { id: 'throw', name: 'threw a letter' },
] as const;

export type AnomalyId = (typeof ANOMALIES)[number]['id'];

export type LedgerState = {
  on: boolean;
  found: readonly AnomalyId[];
  announced: readonly AnomalyId[];
};

const STORAGE_KEY = 'mythcorp:anomalies';
const FLAG_KEY = 'mythcorp:ledger';
const ROOM_COUNT = 4;

const OFF: LedgerState = { on: false, found: [], announced: [] };

let state: LedgerState = OFF;
let rooms = new Set<string>();
let started = false;
const listeners = new Set<() => void>();

function readFlag(): boolean {
  const param = new URLSearchParams(window.location.search).get('ledger');
  try {
    if (param === '1') window.sessionStorage.setItem(FLAG_KEY, '1');
    if (param === '0') window.sessionStorage.removeItem(FLAG_KEY);
    return window.sessionStorage.getItem(FLAG_KEY) === '1';
  } catch {
    return param === '1';
  }
}

function isAnomaly(id: unknown): id is AnomalyId {
  return ANOMALIES.some(a => a.id === id);
}

function start() {
  if (started || typeof window === 'undefined') return;
  started = true;
  if (!readFlag()) return;
  let found: AnomalyId[] = [];
  let announced: AnomalyId[] = [];
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null') as
      { found?: unknown[]; announced?: unknown[]; rooms?: unknown[] } | null;
    found = (raw?.found ?? []).filter(isAnomaly);
    announced = (raw?.announced ?? []).filter(isAnomaly);
    rooms = new Set((raw?.rooms ?? []).filter((r): r is string => typeof r === 'string'));
  } catch {
    // Unreadable or blocked storage: start a session-only ledger.
  }
  state = { on: true, found, announced };
}

function commit(next: LedgerState) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      found: next.found, announced: next.announced, rooms: [...rooms],
    }));
  } catch {
    // Session-only when storage is blocked.
  }
  listeners.forEach(l => l());
}

export function logAnomaly(id: AnomalyId) {
  start();
  if (!state.on || state.found.includes(id)) return;
  commit({ ...state, found: [...state.found, id] });
}

/** Rooms are a set; walking all four is the find. */
export function noteRoom(room: string) {
  start();
  if (!state.on || rooms.has(room)) return;
  rooms.add(room);
  if (rooms.size >= ROOM_COUNT) logAnomaly('rooms');
  else commit(state);
}

export function markAnnounced(id: AnomalyId) {
  start();
  if (!state.on || state.announced.includes(id)) return;
  commit({ ...state, announced: [...state.announced, id] });
}

export function anomalyName(id: AnomalyId): string {
  return ANOMALIES.find(a => a.id === id)?.name ?? id;
}

/** Finds a visitor can reach: the hold is off under reduced motion. */
export function anomalyTotal(reducedMotion: boolean): number {
  return ANOMALIES.filter(a => !('needsMotion' in a) || !reducedMotion).length;
}

export function isLedgerOn(): boolean {
  start();
  return state.on;
}

export function subscribeLedger(listener: () => void) {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getLedger(): LedgerState {
  start();
  return state;
}

export function getServerLedger(): LedgerState {
  return OFF;
}
