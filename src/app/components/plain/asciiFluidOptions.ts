// Walkthrough: /wc/learn/plain-mode

/**
 * The dials for `createAsciiFluid`, and the tuned constants behind them.
 * They live next to the solver rather than inside it because the solver is
 * already at the size where one more block of prose pushes it past the file
 * cap, and because these are the numbers anyone actually comes here to change.
 */
export type AsciiFluidOptions = {
  /** Pixel size of one character cell at CSS scale. Smaller = denser, costlier. */
  cell?: number;
  /** Ink colour for the glyphs. Read from a CSS variable by the caller. */
  ink?: string;
  /**
   * Per-frame multiplier on dye and velocity. Below 1, so the field settles.
   * It also decides how far the message is allowed to bleed: the mask is a
   * strong constant source, so a slow decay lets advection carry letter dye
   * across the whole grid until nothing reads.
   */
  decay?: number;
  /** Low-amplitude wandering vortices, so an untouched field is still alive. */
  ambient?: boolean;
  /**
   * Called after every resize with the new grid. Return a per-cell mask to
   * re-ink every frame (this is how the wordmark survives being smeared),
   * or null for a field that only responds to the pointer.
   */
  source?: (cols: number, rows: number) => Float32Array | null;
  /**
   * How hard the source mask is held, 0 to 1. Every masked cell is pinned to
   * its own coverage value times this, so the ramp draws real letterforms
   * rather than a saturated block, and the pointer can still push extra dye
   * on top of them.
   */
  sourceHold?: number;
  /**
   * Scale on the pointer-down vortex ring. 0 disables the press entirely, so a
   * caller that never wires a pointerdown listener pays nothing either way.
   */
  press?: number;
  /**
   * Vorticity confinement strength. 0 skips the pass completely, which is the
   * default because it costs two extra sweeps of the whole grid.
   */
  vorticity?: number;
  /**
   * Read every frame. A positive amount draws the field in toward a client-space
   * point and loosens the source mask so its dye can follow; a negative amount
   * pushes outward. Null or 0 costs nothing.
   */
  pull?: () => { x: number; y: number; amount: number } | null;
  /** Called about five times a second with the grid size and mean dye. */
  onMetrics?: (m: { cols: number; rows: number; ink: number }) => void;
};

export const FLUID_DEFAULTS = {
  cell: 11,
  ink: '#111111',
  decay: 0.9,
  ambient: false,
  sourceHold: 0.3,
  press: 1,
  vorticity: 0,
};

/** The one value dye is allowed to reach. Every writer clamps to it. */
export const DYE_CEILING = 1.4;

/**
 * The press ring. The radius is a fraction of the shorter grid dimension, so
 * one press covers the same share of a phone as of a desktop instead of being
 * a pinprick on one and half the screen on the other. Swirl is the tangential
 * speed in cells per frame and is what you raise to make a press feel harder;
 * push only decides how fast the ring opens out; ink is the dye it drops, and
 * is deliberately the smallest of the three, since dye is the part that can
 * cover the message rather than move it.
 */
export const PRESS_RADIUS = 0.16;
export const PRESS_SWIRL = 0.95;
export const PRESS_PUSH = 0.3;
export const PRESS_INK = 0.34;

/**
 * Per-cell ceiling on the confinement force, and the reason confinement is
 * safe here. Velocity decays by `decay` every frame, so a bounded per-frame
 * addition of C settles at C / (1 - decay) rather than climbing without limit.
 * At the holding screen's 0.9 decay a cap of 0.02 is 0.2 cells per frame in the
 * very worst case, which is roughly where the ambient vortices already sit. So
 * the loudest thing confinement can do is hold the field at the liveliness it
 * had anyway, with the detail put back. That is deliberately conservative: the
 * message is dye, and dye that travels further before it decays below the
 * render floor is a wider halo around the letters.
 */
export const VORTICITY_CAP = 0.02;
