import { PATCH_TALLY } from './PatchTally';

export const PROGRAM_START = Date.parse('2026-04-07');
export const MEASURED_AT = Date.parse(PATCH_TALLY.asOf);
export const MODEL_END = Date.parse('2030-12-31');

const DAY_MS = 86_400_000;
const MONTH_DAYS = 30.44;
const MEASURED_MONTHS = (MEASURED_AT - PROGRAM_START) / DAY_MS / MONTH_DAYS;

export const START_BACKLOG = PATCH_TALLY.reported - PATCH_TALLY.patched;
export const START_FOUND_PER_MONTH = PATCH_TALLY.reported / MEASURED_MONTHS;
export const START_FIXED_PER_MONTH = PATCH_TALLY.patched / MEASURED_MONTHS;
export const MEASURED_DAYS = Math.round((MEASURED_AT - PROGRAM_START) / DAY_MS);

export type BacklogRates = { discoveryGrowth: number; repairGrowth: number };

export type BacklogPoint = { time: number; backlog: number; found: number; fixed: number };

export function runBacklog({ discoveryGrowth, repairGrowth }: BacklogRates): BacklogPoint[] {
  const points: BacklogPoint[] = [];
  let backlog = START_BACKLOG;
  const months = Math.floor((MODEL_END - MEASURED_AT) / DAY_MS / MONTH_DAYS);
  for (let m = 0; m <= months; m++) {
    const found = START_FOUND_PER_MONTH * discoveryGrowth ** (m / 12);
    const fixed = START_FIXED_PER_MONTH * repairGrowth ** (m / 12);
    if (m > 0) backlog = Math.max(0, backlog + found - fixed);
    points.push({ time: MEASURED_AT + m * MONTH_DAYS * DAY_MS, backlog, found, fixed });
  }
  return points;
}

export function crossoverTime(points: BacklogPoint[]): number | null {
  const hit = points.find((p) => p.fixed >= p.found);
  return hit ? hit.time : null;
}
