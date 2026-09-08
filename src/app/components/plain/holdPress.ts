export const PRESS_DURATION = 620;
export const PRESS_RADIUS = 150;

export function isHoldControl(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest('button, a, input, select, textarea, summary, [role="button"]'));
}

export function pressWave(distance: number, progress: number): number {
  if (progress < 0 || progress >= 1) return 0;
  const radius = 12 + PRESS_RADIUS * progress;
  return Math.max(0, 1 - Math.abs(distance - radius) / 32) * (1 - progress);
}
