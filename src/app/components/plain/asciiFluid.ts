// Walkthrough: /wc/learn/plain-mode

import { CELL_ASPECT, renderField, type RenderTarget } from './asciiRender';
import { createPointerTracker } from './asciiPointer';
import { createVorticityPass } from './asciiVorticity';
import { stampVortexRing } from './asciiVortexRing';
import {
  FLUID_DEFAULTS, DYE_CEILING, PRESS_RADIUS, PRESS_SWIRL, PRESS_PUSH, PRESS_INK,
  VORTICITY_CAP, type AsciiFluidOptions,
} from './asciiFluidOptions';

export type { AsciiFluidOptions } from './asciiFluidOptions';

type Field = Float32Array;

export function createAsciiFluid(canvas: HTMLCanvasElement, options: AsciiFluidOptions = {}) {
  const opts = { ...FLUID_DEFAULTS, ...options };
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return { destroy() {}, pointer() {}, press() {}, release() {}, restamp() {} };

  let cols = 0;
  let rows = 0;
  let dye: Field = new Float32Array(0);
  let dyeNext: Field = new Float32Array(0);
  let vx: Field = new Float32Array(0);
  let vy: Field = new Float32Array(0);
  let vxNext: Field = new Float32Array(0);
  let vyNext: Field = new Float32Array(0);
  let source: Field | null = null;
  let fontFamily = 'ui-monospace, monospace';
  let raf = 0;
  let running = false;
  let clock = 0;
  let sinceReport = 0;

  const tracker = createPointerTracker();
  const pointer = tracker.state;
  const confine = createVorticityPass();
  let spin = 1;
  const idx = (x: number, y: number) => y * cols + x;

  /** Client space to grid cells. Cells are CELL_ASPECT taller than they are wide. */
  function toGrid(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / opts.cell,
      y: (clientY - rect.top) / (opts.cell * CELL_ASPECT),
    };
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;

    // ctx.font does not resolve CSS custom properties, so read the family
    // the element actually computed to and hand the canvas a real stack.
    const computed = window.getComputedStyle(canvas).fontFamily;
    fontFamily = computed ? `${computed}, ui-monospace, monospace` : fontFamily;

    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.max(2, Math.ceil(w / opts.cell));
    rows = Math.max(2, Math.ceil(h / (opts.cell * CELL_ASPECT)));
    const n = cols * rows;
    dye = new Float32Array(n);
    dyeNext = new Float32Array(n);
    vx = new Float32Array(n);
    vy = new Float32Array(n);
    vxNext = new Float32Array(n);
    vyNext = new Float32Array(n);
    source = opts.source ? opts.source(cols, rows) : null;
  }

  /** Bilinear sample of a field at fractional grid coordinates. */
  function sample(field: Field, x: number, y: number): number {
    const cx = Math.min(cols - 1.001, Math.max(0, x));
    const cy = Math.min(rows - 1.001, Math.max(0, y));
    const x0 = Math.floor(cx);
    const y0 = Math.floor(cy);
    const fx = cx - x0;
    const fy = cy - y0;
    const x1 = Math.min(cols - 1, x0 + 1);
    const y1 = Math.min(rows - 1, y0 + 1);
    const a = field[idx(x0, y0)] * (1 - fx) + field[idx(x1, y0)] * fx;
    const b = field[idx(x0, y1)] * (1 - fx) + field[idx(x1, y1)] * fx;
    return a * (1 - fy) + b * fy;
  }

  function splat(px: number, py: number, radius: number, dyeAdd: number, fx: number, fy: number) {
    for (let y = Math.max(0, Math.floor(py - radius)); y <= Math.min(rows - 1, py + radius); y++) {
      for (let x = Math.max(0, Math.floor(px - radius)); x <= Math.min(cols - 1, px + radius); x++) {
        const d = Math.hypot(x - px, y - py);
        if (d > radius) continue;
        const falloff = 1 - d / radius;
        const i = idx(x, y);
        if (dyeAdd) dye[i] = Math.min(DYE_CEILING, dye[i] + falloff * dyeAdd);
        vx[i] += fx * falloff;
        vy[i] += fy * falloff;
      }
    }
  }

  function inject() {
    if (!pointer.active) return;
    const force = Math.min(6, Math.hypot(pointer.dx, pointer.dy));
    // A parked cursor must inject nothing, or the field never settles.
    if (force < 0.02) {
      pointer.dx = 0;
      pointer.dy = 0;
      return;
    }
    splat(pointer.x, pointer.y, 3, 0.06 + force * 0.16, pointer.dx * 0.55, pointer.dy * 0.55);
    // Consume the delta so one move is one push, not a held one.
    pointer.dx *= 0.55;
    pointer.dy *= 0.55;
  }

  /**
   * Two vortices wandering on incommensurable Lissajous paths. Their periods
   * do not share a common multiple, so the pattern never actually repeats.
   */
  function ambient() {
    if (!opts.ambient) return;
    clock += 0.006;
    for (let k = 0; k < 2; k++) {
      const p = clock * (k ? 0.73 : 1);
      const cx = (0.5 + 0.34 * Math.sin(p * 1.0 + k * 2.1)) * cols;
      const cy = (0.5 + 0.30 * Math.sin(p * 1.37 + k * 0.7)) * rows;
      const a = p * (k ? -1.9 : 1.3);
      splat(cx, cy, 7, 0, Math.cos(a) * 0.018, Math.sin(a) * 0.018);
    }
  }

  /**
   * One press, one ring. The spin flips every time so a second tap in the same
   * place unwinds the first rather than stacking on it, which is the difference
   * between a field that answers you and a field that just gets louder.
   */
  function burst(gx: number, gy: number) {
    if (opts.press <= 0) return;
    const radius = Math.max(4, Math.min(cols, rows * CELL_ASPECT) * PRESS_RADIUS);
    spin = -spin;
    stampVortexRing({
      dye, vx, vy, cols, rows,
      x: gx, y: gy, radius, spin,
      swirl: PRESS_SWIRL * opts.press,
      push: PRESS_PUSH * opts.press,
      ink: PRESS_INK * opts.press,
      ceiling: DYE_CEILING,
    });
  }

  /**
   * The press-and-hold gather: a sink at the specimen with a slight spiral, fed
   * by sparse dye at the rim so the inflow is visible as grain streaming in.
   */
  const PULL_ARMS = 7;
  let pullHold = 1;
  let pullTurn = 0;
  function gather() {
    const pull = opts.pull?.();
    const amount = pull ? Math.max(-0.3, Math.min(1, pull.amount)) : 0;
    pullHold = 1 - Math.max(0, amount) * 0.92;
    if (!pull || Math.abs(amount) < 0.004) return;
    const c = toGrid(pull.x, pull.y);
    const core = Math.max(3, Math.min(cols, rows * CELL_ASPECT) * 0.06);
    const force = amount * 0.075;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const dx = c.x - x;
        const dy = (c.y - y) * CELL_ASPECT;
        const d = Math.hypot(dx, dy) || 1;
        const f = force * Math.min(1, d / core) / d;
        const i = idx(x, y);
        vx[i] += (dx + dy * 0.35) * f;
        vy[i] += (dy - dx * 0.35) * f / CELL_ASPECT;
      }
    }
    if (amount <= 0) return;
    const reach = Math.hypot(cols, rows * CELL_ASPECT) * 0.42;
    pullTurn += 0.012;
    const seeds = Math.ceil(amount * 24);
    for (let k = 0; k < seeds; k++) {
      const a = (k % PULL_ARMS) * (Math.PI * 2 / PULL_ARMS) + pullTurn + (Math.random() - 0.5) * 0.18;
      const r = reach * (0.3 + 0.7 * Math.random());
      splat(c.x + Math.cos(a) * r, c.y + Math.sin(a) * r / CELL_ASPECT, 1.8, DYE_CEILING * amount, 0, 0);
    }
  }

  function step() {
    // Advect every field backwards along its own velocity, then blur the
    // result slightly. Tracing backwards can only read values that already
    // exist, which is what makes this unconditionally stable.
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = idx(x, y);
        const sx = x - vx[i];
        const sy = y - vy[i];
        dyeNext[i] = sample(dye, sx, sy) * opts.decay;
        vxNext[i] = sample(vx, sx, sy) * opts.decay;
        vyNext[i] = sample(vy, sx, sy) * opts.decay;
      }
    }
    for (let y = 1; y < rows - 1; y++) {
      for (let x = 1; x < cols - 1; x++) {
        const i = idx(x, y);
        const n = dyeNext[i - 1] + dyeNext[i + 1] + dyeNext[i - cols] + dyeNext[i + cols];
        dyeNext[i] = dyeNext[i] * 0.72 + n * 0.07;
      }
    }
    [dye, dyeNext] = [dyeNext, dye];
    [vx, vxNext] = [vxNext, vx];
    [vy, vyNext] = [vyNext, vy];

    // After the swap, so it acts on the velocity the next advection will read.
    confine(vx, vy, cols, rows, opts.vorticity, VORTICITY_CAP);

    // Re-ink the source last, as a floor rather than an addition. Adding a
    // constant every frame was what tore the message apart: the dye climbed to
    // the ceiling, advection carried it into neighbouring cells, and the
    // counters inside O, R and P filled in until every letter was one solid
    // block. Pinning each cell to its own coverage keeps the shapes, edges
    // included, while the pointer can still push dye above the floor.
    if (source) {
      for (let i = 0; i < dye.length; i++) {
        const floor = source[i] * opts.sourceHold * pullHold;
        if (floor > dye[i]) dye[i] = floor;
        else if (dye[i] > DYE_CEILING) dye[i] = DYE_CEILING;
      }
    }
  }

  const target = (): RenderTarget => ({ ctx: ctx!, cols, rows, cell: opts.cell, ink: opts.ink, fontFamily });

  function report() {
    if (!opts.onMetrics) return;
    // Every twelfth frame, so the panel updates about five times a second
    // rather than provoking sixty React renders.
    if (++sinceReport < 12) return;
    sinceReport = 0;
    let total = 0;
    for (let i = 0; i < dye.length; i++) total += dye[i];
    opts.onMetrics({ cols, rows, ink: dye.length ? total / dye.length : 0 });
  }

  function frame() {
    if (!running) return;
    inject();
    ambient();
    gather();
    step();
    renderField(dye, target(), canvas.clientWidth, canvas.clientHeight, source, pullHold);
    report();
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  function onVisibility() {
    // A hidden tab throttles rAF to a crawl anyway; stopping outright means
    // the field is not integrating garbage timesteps on return.
    if (document.hidden) stop();
    else start();
  }

  const onResize = () => resize();

  resize();
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibility);
  start();

  return {
    /**
     * Feed a client-space pointer position. Deltas become force. Pass the
     * PointerEvent's id if you have one: without it a finger lifting here and
     * landing there reads as one enormous drag.
     */
    pointer(clientX: number, clientY: number, pointerId?: number) {
      const g = toGrid(clientX, clientY);
      tracker.move(g.x, g.y, pointerId);
    },
    /** A press. Puts one rotating burst into the field and claims the pointer. */
    press(clientX: number, clientY: number, pointerId?: number) {
      const g = toGrid(clientX, clientY);
      if (tracker.press(g.x, g.y, pointerId)) burst(g.x, g.y);
    },
    /** Pointer up or cancelled. Drops the claim so the next touch starts clean. */
    release(pointerId?: number) {
      tracker.release(pointerId);
    },
    /** Rebuild the source mask, e.g. after the text it renders changes. */
    restamp() {
      source = opts.source ? opts.source(cols, rows) : null;
    },
    destroy() {
      stop();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
