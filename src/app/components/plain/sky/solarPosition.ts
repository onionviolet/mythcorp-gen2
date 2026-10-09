/** NOAA-style solar position, accurate to a fraction of a degree, no deps.
 *  Angles are degrees. Azimuth is clockwise from north. */
const RAD = Math.PI / 180;
const DAY_MS = 86_400_000;

export type SunPosition = { elevation: number; azimuth: number };

function solarTerms(date: Date): { decl: number; eqTime: number } {
  const t = (date.getTime() / DAY_MS + 2440587.5 - 2451545) / 36525;
  const l0 = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
  const m = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  const c = Math.sin(m * RAD) * (1.914602 - t * (0.004817 + 0.000014 * t))
    + Math.sin(2 * m * RAD) * (0.019993 - 0.000101 * t)
    + Math.sin(3 * m * RAD) * 0.000289;
  const omega = 125.04 - 1934.136 * t;
  const lambda = l0 + c - 0.00569 - 0.00478 * Math.sin(omega * RAD);
  const eps0 = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const eps = eps0 + 0.00256 * Math.cos(omega * RAD);
  const decl = Math.asin(Math.sin(eps * RAD) * Math.sin(lambda * RAD));
  const y = Math.tan((eps * RAD) / 2) ** 2;
  const eqTime = (4 / RAD) * (y * Math.sin(2 * l0 * RAD) - 2 * e * Math.sin(m * RAD)
    + 4 * e * y * Math.sin(m * RAD) * Math.cos(2 * l0 * RAD)
    - 0.5 * y * y * Math.sin(4 * l0 * RAD) - 1.25 * e * e * Math.sin(2 * m * RAD));
  return { decl, eqTime };
}

function utcMinutes(date: Date): number {
  return ((date.getTime() % DAY_MS) + DAY_MS) % DAY_MS / 60_000;
}

export function solarPosition(date: Date, lat: number, lon: number): SunPosition {
  const { decl, eqTime } = solarTerms(date);
  const hourAngle = ((utcMinutes(date) + eqTime + 4 * lon) / 4 - 180) * RAD;
  const phi = lat * RAD;
  const cosZenith = Math.sin(phi) * Math.sin(decl) + Math.cos(phi) * Math.cos(decl) * Math.cos(hourAngle);
  const elevation = 90 - Math.acos(Math.min(1, Math.max(-1, cosZenith))) / RAD;
  const azimuth = (Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(phi) - Math.tan(decl) * Math.cos(phi),
  ) / RAD + 540) % 360;
  return { elevation, azimuth };
}

/** Recovers a coarse site from one rounded sun reading, so the client can
 *  time-lapse a sun the server measured without ever being sent coordinates.
 *  Picks the latitude root nearest `nearLat`. Null when the reading is degenerate. */
export function siteFromSun(date: Date, sun: SunPosition, nearLat: number): { lat: number; lon: number } | null {
  const { decl, eqTime } = solarTerms(date);
  const h = sun.elevation * RAD;
  const az = sun.azimuth * RAD;
  const a = Math.sin(h);
  const b = Math.cos(h) * Math.cos(az);
  const r = Math.hypot(a, b);
  if (r < 1e-6 || Math.abs(Math.sin(decl) / r) > 1) return null;
  const base = Math.atan2(b, a);
  const s = Math.asin(Math.sin(decl) / r);
  const wrap = (x: number) => Math.atan2(Math.sin(x), Math.cos(x));
  const roots = [wrap(s - base), wrap(Math.PI - s - base)].filter(x => Math.abs(x) <= Math.PI / 2);
  if (roots.length === 0) return null;
  const phi = roots.reduce((best, x) => Math.abs(x / RAD - nearLat) < Math.abs(best / RAD - nearLat) ? x : best);
  const sinH = -Math.sin(az) * Math.cos(h) / Math.cos(decl);
  const cosH = (Math.sin(h) - Math.sin(phi) * Math.sin(decl)) / (Math.cos(phi) * Math.cos(decl));
  const hourAngle = Math.atan2(sinH, cosH) / RAD;
  const lon = ((hourAngle + 180) * 4 - utcMinutes(date) - eqTime) / 4;
  return { lat: phi / RAD, lon: ((lon + 540) % 360) - 180 };
}

const SYNODIC_DAYS = 29.530588853;
const NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);

/** 0 new, 0.5 full, back to 1. */
export function moonPhase(date: Date): number {
  const days = (date.getTime() - NEW_MOON_MS) / DAY_MS;
  return ((days / SYNODIC_DAYS) % 1 + 1) % 1;
}

/** Lit fraction of the disc, 0..1. */
export function moonIllumination(phase: number): number {
  return (1 - Math.cos(2 * Math.PI * phase)) / 2;
}
