import type { HoldRoll } from './holdRoll';

export const HOLD_COMPOSITIONS = [
  { name: 'Trace', style: 'ascii', message: 'decode', overlay: 'shield' },
  { name: 'Suspension', style: 'particle', message: 'field', overlay: 'none' },
  { name: 'Drift', style: 'swarm', message: 'solid', overlay: 'fog' },
  { name: 'Surface', style: 'liquid', message: 'solid', overlay: 'none' },
] as const satisfies readonly (HoldRoll & { name: string })[];

export function compositionName(roll: HoldRoll): string {
  return HOLD_COMPOSITIONS.find(item => item.style === roll.style && item.message === roll.message && item.overlay === roll.overlay)?.name ?? 'Custom';
}
