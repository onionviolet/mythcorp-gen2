import type { HoldRoll } from './holdRoll';

export const HOLD_COMPOSITIONS = [
  { name: 'Signal', style: 'ascii', message: 'dust', overlay: 'none' },
  { name: 'Suspension', style: 'particle', message: 'field', overlay: 'none' },
  { name: 'Drift', style: 'swarm', message: 'solid', overlay: 'fog' },
  { name: 'Surface', style: 'liquid', message: 'solid', overlay: 'none' },
] as const satisfies readonly (HoldRoll & { name: string })[];

export const DEFAULT_HOLD_COMPOSITION = HOLD_COMPOSITIONS[0];

export function compositionName(roll: HoldRoll): string {
  return HOLD_COMPOSITIONS.find(item => item.style === roll.style && item.message === roll.message && item.overlay === roll.overlay)?.name ?? 'Custom';
}

const COLD_SCENE_KEY = 'mythcorp:hold-cold-scene';

export type HoldComposition = (typeof HOLD_COMPOSITIONS)[number];

function compositionByName(name: string | null | undefined): HoldComposition | undefined {
  const wanted = name?.toLowerCase();
  return HOLD_COMPOSITIONS.find(item => item.name.toLowerCase() === wanted);
}

/** First visit opens on Signal. Each later load opens on the scene after the
 *  one the previous load opened on, so a reload always looks different and
 *  every scene gets its turn. `?scene=drift` pins one for sharing or tests.
 *  Blocked storage falls back to Signal. Picked once per page load, so a
 *  re-run effect or a theme round trip does not advance the rotation. */
let coldPick: HoldComposition | undefined;

export function takeColdComposition(): HoldComposition {
  coldPick ??= pickColdComposition();
  return coldPick;
}

function pickColdComposition(): HoldComposition {
  const pinned = compositionByName(new URLSearchParams(window.location.search).get('scene'));
  if (pinned) return pinned;
  try {
    const last = compositionByName(window.localStorage.getItem(COLD_SCENE_KEY));
    const composition = last
      ? HOLD_COMPOSITIONS[(HOLD_COMPOSITIONS.indexOf(last) + 1) % HOLD_COMPOSITIONS.length]
      : DEFAULT_HOLD_COMPOSITION;
    window.localStorage.setItem(COLD_SCENE_KEY, composition.name);
    return composition;
  } catch {
    return DEFAULT_HOLD_COMPOSITION;
  }
}
