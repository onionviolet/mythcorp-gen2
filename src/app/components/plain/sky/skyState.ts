import { skyNow, subscribeSkyOffset } from '../skyTime';
import { moonPhase, siteFromSun, solarPosition } from './solarPosition';

export const CHICAGO_SITE = { lat: 41.88, lon: -87.63 } as const;

export type SkyState = { elevation: number; azimuth: number; moonPhase: number };

export const SUN_PINS = {
  dawn: { elevation: 3, azimuth: 95, moonPhase: 0.5 },
  noon: { elevation: 62, azimuth: 180, moonPhase: 0.5 },
  dusk: { elevation: 1, azimuth: 265, moonPhase: 0.5 },
  night: { elevation: -30, azimuth: 330, moonPhase: 0.5 },
} as const satisfies Record<string, SkyState>;

export type SunPinName = keyof typeof SUN_PINS;

let pinRead = false;
let pin: SkyState | null = null;

/** `?sun=dawn|noon|dusk|night` pins both suns, like `?scene=` pins a scene. */
export function sunPin(): SkyState | null {
  if (!pinRead && typeof window !== 'undefined') {
    pinRead = true;
    const name = new URLSearchParams(window.location.search).get('sun');
    pin = name && Object.hasOwn(SUN_PINS, name) ? SUN_PINS[name as SunPinName] : null;
  }
  return pin;
}

function skyAt(now: Date, lat: number, lon: number): SkyState {
  return sunPin() ?? { ...solarPosition(now, lat, lon), moonPhase: moonPhase(now) };
}

export function chicagoSky(now: Date = skyNow()): SkyState {
  return skyAt(now, CHICAGO_SITE.lat, CHICAGO_SITE.lon);
}

type ViewerSite = { lat: number; lon: number; timeZone: string };

let site: ViewerSite | null = null;
let refineStarted = false;
const siteListeners = new Set<() => void>();

/** First guess with no network: the browser's zone, its standard UTC offset
 *  as a longitude, latitude 40. */
function guessSite(): ViewerSite {
  let timeZone = 'UTC';
  try { timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch {}
  const year = new Date().getFullYear();
  const standardOffset = Math.max(
    new Date(year, 0, 1).getTimezoneOffset(),
    new Date(year, 6, 1).getTimezoneOffset(),
  );
  return { lat: 40, lon: Math.max(-180, Math.min(180, -standardOffset / 4)), timeZone };
}

function viewerSite(): ViewerSite {
  site ??= guessSite();
  return site;
}

type SkyReply = { elevation?: unknown; azimuth?: unknown; timezone?: unknown };

/** Asks `/api/sky` once. The reply carries only a rounded sun and a zone; the
 *  coarse site recovered from it lives in memory and is never sent anywhere. */
function refineViewerSite() {
  if (refineStarted || typeof window === 'undefined' || sunPin()) return;
  refineStarted = true;
  const askedAt = new Date();
  fetch('/api/sky', { cache: 'no-store' })
    .then(response => response.ok ? response.json() as Promise<SkyReply> : null)
    .then(reply => {
      if (!reply || typeof reply.elevation !== 'number' || typeof reply.azimuth !== 'number') return;
      const guess = viewerSite();
      const found = siteFromSun(askedAt, { elevation: reply.elevation, azimuth: reply.azimuth }, guess.lat);
      const timeZone = typeof reply.timezone === 'string' && validZone(reply.timezone) ? reply.timezone : guess.timeZone;
      site = found ? { ...found, timeZone } : { ...guess, timeZone };
      for (const listener of siteListeners) listener();
    })
    .catch(() => {});
}

function validZone(zone: string): boolean {
  try { new Intl.DateTimeFormat('en-US', { timeZone: zone }); return true; } catch { return false; }
}

export function viewerSky(now: Date = skyNow()): SkyState {
  const { lat, lon } = viewerSite();
  return skyAt(now, lat, lon);
}

export function viewerTimeZone(): string {
  return viewerSite().timeZone;
}

/** Fires on each sky minute, on a horizon drag and when the viewer's site
 *  is refined. The first subscriber starts the refinement. */
export function subscribeSky(listener: () => void): () => void {
  siteListeners.add(listener);
  refineViewerSite();
  const offOffset = subscribeSkyOffset(listener);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    timer = setTimeout(() => { listener(); schedule(); }, 60_000 - (Date.now() % 60_000) + 50);
  };
  schedule();
  document.addEventListener('visibilitychange', listener);
  return () => {
    siteListeners.delete(listener);
    offOffset();
    if (timer) clearTimeout(timer);
    document.removeEventListener('visibilitychange', listener);
  };
}

const clockFormats = new Map<string, Intl.DateTimeFormat>();

export function zoneClock(now: Date, timeZone: string): string {
  let format = clockFormats.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    clockFormats.set(timeZone, format);
  }
  const parts: Record<string, string> = {};
  for (const part of format.formatToParts(now)) parts[part.type] = part.value;
  return `${parts.hour}:${parts.minute}`;
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'] as const;

function degrees(value: number): string {
  const rounded = Math.round(value);
  return `${rounded < 0 ? '−' : ''}${Math.abs(rounded)}°`;
}

/** The light word: a compass point by day, dawn or dusk in twilight, night below. */
export function skyWord(sky: SkyState): string {
  if (sky.elevation >= 6) return COMPASS[Math.round(sky.azimuth / 45) % 8];
  if (sky.elevation > -6) return sky.azimuth < 180 ? 'dawn' : 'dusk';
  return 'night';
}

/** `38° S`, `2° dusk`, `−12° night`. */
export function sunReading(sky: SkyState): string {
  return `${degrees(sky.elevation)} ${skyWord(sky)}`;
}

/** `14:05 38°`, `19:02 dusk`, `04:20 night`. */
export function viewerReading(now: Date = skyNow()): string {
  const sky = viewerSky(now);
  const clock = zoneClock(now, viewerTimeZone());
  return sky.elevation >= 6 ? `${clock} ${degrees(sky.elevation)}` : `${clock} ${skyWord(sky)}`;
}
