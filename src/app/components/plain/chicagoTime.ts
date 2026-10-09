export const CHICAGO_TIME_ZONE = 'America/Chicago';

let dayFormat: Intl.DateTimeFormat | undefined;
let clockFormat: Intl.DateTimeFormat | undefined;

function parts(format: Intl.DateTimeFormat, now: Date): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of format.formatToParts(now)) out[part.type] = part.value;
  return out;
}

/** The calendar day in Chicago, as a stable key and a whole-day index. */
export function chicagoDay(now: Date): { key: string; index: number } {
  dayFormat ??= new Intl.DateTimeFormat('en-US', {
    timeZone: CHICAGO_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const p = parts(dayFormat, now);
  const y = Number(p.year);
  const m = Number(p.month);
  const d = Number(p.day);
  return {
    key: `${p.year}-${p.month}-${p.day}`,
    index: Math.floor(Date.UTC(y, m - 1, d) / 86_400_000),
  };
}

/** 24 hour HH:MM in Chicago. */
export function chicagoClock(now: Date): string {
  clockFormat ??= new Intl.DateTimeFormat('en-US', {
    timeZone: CHICAGO_TIME_ZONE, hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  const p = parts(clockFormat, now);
  return `${p.hour}:${p.minute}`;
}
