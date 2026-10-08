export const DAY_MS = 86_400_000;

export const HORIZON_POINTS = [
  { date: '2025-03-19', minutes: 60, short: '~1 h', label: 'about 1 hour', lowerBound: false, source: 'metr-2025' },
  { date: '2026-01-29', minutes: 320, short: '320 min', label: '320 minutes', lowerBound: false, source: 'metr-2026-01' },
  { date: '2026-05-19', minutes: 960, short: '16 h+', label: 'over 16 hours, benchmark saturated', lowerBound: true, source: 'metr-2026-05' },
] as const;

export const DOUBLING_PRESETS = [
  { days: 89, label: 'since 2024' },
  { days: 131, label: 'since 2023' },
  { days: 196, label: 'whole record' },
] as const;

export const CENTRAL_DOUBLING_DAYS = 131;

export const HORIZON_THRESHOLDS = [
  { minutes: 8 * 60, label: 'work day (8 h)' },
  { minutes: 40 * 60, label: 'work week (40 h)' },
  { minutes: 167 * 60, label: 'work month (167 h)' },
] as const;

const ANCHOR = HORIZON_POINTS[HORIZON_POINTS.length - 1];
export const ANCHOR_TIME = Date.parse(ANCHOR.date);

export function projectedMinutes(time: number, doublingDays: number): number {
  return ANCHOR.minutes * 2 ** ((time - ANCHOR_TIME) / (doublingDays * DAY_MS));
}

export function crossingTime(minutes: number, doublingDays: number): number {
  return ANCHOR_TIME + Math.log2(minutes / ANCHOR.minutes) * doublingDays * DAY_MS;
}

export function monthLabel(time: number): string {
  return new Date(time).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

export function horizonLabel(minutes: number): string {
  const h = minutes / 60;
  if (h < 1.5) return `${Math.round(minutes)} min`;
  if (h < 16) return `${Math.round(h)} h`;
  if (h < 80) return `${(h / 8).toFixed(1)} work days`;
  if (h < 334) return `${(h / 40).toFixed(1)} work weeks`;
  if (h < 2004) return `${(h / 167).toFixed(1)} work months`;
  return 'beyond a work year';
}
