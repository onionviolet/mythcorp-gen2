/** The cat's one wordless demonstration that the horizon can be swept: walk
 *  to the halo line, pad along it pushing time a little later, let go, walk
 *  home. Pure geometry and timing; LinkedInInvite owns the side effects. */

export type DemoPoint = { x: number; y: number };
export type HorizonDemoStage = 'out' | 'push' | 'hold' | 'release' | 'home' | 'done';
export type HorizonDemoPose = {
  point: DemoPoint;
  stage: HorizonDemoStage;
  gait: 'walk' | 'push' | 'sit';
  facing: 'left' | 'right';
};
export type HorizonDemoPlan = { start: DemoPoint; home: DemoPoint; fromX: number; toX: number };

/** How far the paw pushes the clock: later, the same way a rightward drag does. */
export const HORIZON_DEMO_NUDGE_MS = 30 * 60_000;
export const HORIZON_DEMO_PUSH_MS = 900;

const STAGES: ReadonlyArray<readonly [HorizonDemoStage, number]> = [
  ['out', 1500], ['push', HORIZON_DEMO_PUSH_MS], ['hold', 250], ['release', 300], ['home', 1400],
];
/** Prefer a spot this far left of home, then search outward for a clear one. */
const WANDER = 80;
const PAD = 26;
const SEARCH = 240;
const STEP = 8;
const PATH_SAMPLES = 10;

export function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function easeInOut(t: number): number {
  return 0.5 - Math.cos(Math.PI * t) / 2;
}

function quad(a: DemoPoint, c: DemoPoint, b: DemoPoint, t: number): DemoPoint {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
}

/** Leave sideways, arrive climbing: reads as a walk, not a slide. */
function outControl(start: DemoPoint, a: DemoPoint): DemoPoint {
  return { x: a.x + (start.x - a.x) * 0.35, y: start.y };
}

function homeControl(b: DemoPoint, home: DemoPoint): DemoPoint {
  return { x: b.x + (home.x - b.x) * 0.65, y: home.y };
}

/** Picks where on the line to walk to, or null when no clear stretch of the
 *  line exists near home. `isClear` keeps the whole path off every control. */
export function planHorizonDemo(
  start: DemoPoint,
  home: DemoPoint,
  lineTop: number,
  isClear: (point: DemoPoint) => boolean,
): HorizonDemoPlan | null {
  const preferred = home.x - WANDER;
  for (let shift = 0; shift <= SEARCH; shift += STEP) {
    for (const x of shift === 0 ? [preferred] : [preferred - shift, preferred + shift]) {
      const a = { x, y: lineTop };
      const b = { x: x + PAD, y: lineTop };
      if (!isClear(a) || !isClear(b) || !isClear({ x: x + PAD / 2, y: lineTop })) continue;
      const outC = outControl(start, a);
      const homeC = homeControl(b, home);
      let clear = true;
      for (let i = 1; i < PATH_SAMPLES && clear; i += 1) {
        const t = i / PATH_SAMPLES;
        clear = isClear(quad(start, outC, a, t)) && isClear(quad(b, homeC, home, t));
      }
      if (clear) return { start, home, fromX: x, toX: x + PAD };
    }
  }
  return null;
}

function stageAt(elapsed: number): { stage: HorizonDemoStage; progress: number } {
  let left = elapsed;
  for (const [stage, ms] of STAGES) {
    if (left < ms) return { stage, progress: Math.max(0, left / ms) };
    left -= ms;
  }
  return { stage: 'done', progress: 1 };
}

/** Where the cat is `elapsed` ms in. `lineTop` is read live, so the cat
 *  rides the halo as its own push moves it. */
export function horizonDemoPose(elapsed: number, plan: HorizonDemoPlan, lineTop: number): HorizonDemoPose {
  const { stage, progress } = stageAt(elapsed);
  const a = { x: plan.fromX, y: lineTop };
  const b = { x: plan.toX, y: lineTop };
  switch (stage) {
    case 'out':
      return {
        point: quad(plan.start, outControl(plan.start, a), a, easeInOut(progress)),
        stage, gait: 'walk', facing: a.x < plan.start.x ? 'left' : 'right',
      };
    case 'push':
      return {
        point: { x: a.x + (b.x - a.x) * easeInOut(progress), y: lineTop },
        stage, gait: 'push', facing: 'right',
      };
    case 'hold':
      return { point: b, stage, gait: 'push', facing: 'right' };
    case 'release':
      return { point: b, stage, gait: 'sit', facing: 'right' };
    case 'home':
      return {
        point: quad(b, homeControl(b, plan.home), plan.home, easeInOut(progress)),
        stage, gait: 'walk', facing: plan.home.x < b.x ? 'left' : 'right',
      };
    default:
      return { point: plan.home, stage, gait: 'sit', facing: 'right' };
  }
}
