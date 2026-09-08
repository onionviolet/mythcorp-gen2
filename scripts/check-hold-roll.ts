/**
 * Samples the holding screen's roll and asserts it stays inside its noise
 * budget. Run with `npm run check:roll`.
 *
 * This exists because a budget fails silently in both directions. Priced too
 * high and a combination nobody wants still appears; priced too low and an
 * effect is deleted by arithmetic rather than by a decision, which is what
 * happened to the rain on the first pass: it survived on two combinations out
 * of sixty and would simply never have been seen. Reading the weights does not
 * tell you either of those things. Counting the outcomes does.
 */
import { rollHold, HOLD_NOISE } from '../src/app/components/plain/holdRoll';
import { HOLD_COMPOSITIONS, compositionName } from '../src/app/components/plain/holdCompositions';

const STYLES = ['ascii', 'particle', 'swarm', 'liquid'] as const;
const MESSAGES = ['field', 'solid', 'decode', 'dust'] as const;
const OVERLAYS = ['none', 'rain', 'shield', 'fog', 'drops', 'scan'] as const;
const TOTAL = STYLES.length * MESSAGES.length * OVERLAYS.length;

/** Below this share of the space, an option is effectively unreachable. */
const MIN_SHARE = 0.02;
const SAMPLES = 20000;

const { MESSAGE_NOISE, STYLE_NOISE, OVERLAY_NOISE, BUDGET } = HOLD_NOISE;

const counts = new Map<string, number>();
const perOption = new Map<string, number>();
let worst = 0;
let over = 0;

for (let i = 0; i < SAMPLES; i++) {
  const r = rollHold(STYLES, MESSAGES, OVERLAYS);
  const cost = MESSAGE_NOISE[r.message] + STYLE_NOISE[r.style] + OVERLAY_NOISE[r.overlay];
  worst = Math.max(worst, cost);
  if (cost > BUDGET) over++;
  counts.set(`${r.message}/${r.style}/${r.overlay}`, 1);
  for (const o of [r.message, r.style, r.overlay]) {
    perOption.set(o, (perOption.get(o) ?? 0) + 1);
  }
}

const starved = [...STYLES, ...MESSAGES, ...OVERLAYS]
  .filter((o) => (perOption.get(o) ?? 0) / SAMPLES < MIN_SHARE);

console.log(`budget ${BUDGET}, worst observed ${worst}, over budget ${over}`);
console.log(`${counts.size} of ${TOTAL} combinations reachable`);
for (const o of [...perOption.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${o[0].padEnd(9)} ${((o[1] / SAMPLES) * 100).toFixed(1)}%`);
}

if (over > 0) {
  console.error(`\nFAIL: ${over} rolls exceeded the budget.`);
  process.exit(1);
}
if (starved.length) {
  console.error(`\nFAIL: unreachable in practice: ${starved.join(', ')}. `
    + 'Lower its cost or raise the budget, or drop the option on purpose.');
  process.exit(1);
}
console.log('\nOK');

const authoredKeys = new Set<string>();
for (const composition of HOLD_COMPOSITIONS) {
  const cost = MESSAGE_NOISE[composition.message] + STYLE_NOISE[composition.style] + OVERLAY_NOISE[composition.overlay];
  const key = `${composition.style}/${composition.message}/${composition.overlay}`;
  if (cost > BUDGET || authoredKeys.has(key) || compositionName(composition) !== composition.name) {
    throw new Error(`Invalid authored composition: ${composition.name}`);
  }
  authoredKeys.add(key);
}
if (compositionName({ style: 'ascii', message: 'dust', overlay: 'none' }) !== 'Custom') {
  throw new Error('Manual composition must remain identifiable as Custom');
}
console.log(`${authoredKeys.size} authored compositions: unique and within budget`);
