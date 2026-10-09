// Walkthrough: /wc/learn/plain-mode

/** Luminance ramp, sparse to dense. Index 0 is drawn as nothing. */
export const RAMP = ' .:-=+*#%@';

/** Cell height as a multiple of cell width, so glyphs are not squashed. */
export const CELL_ASPECT = 1.6;

/** Below this, a cell draws nothing, so an idle field costs almost no fills.
 *  It is also what makes the words readable: the vortices smear dye across the
 *  whole grid, and at a low floor that drift draws as loudly as the message.
 *  Cutting it here leaves the re-inked source cells standing alone. */
const FLOOR = 0.2;

/** Coverage above this is a letter body, below it a letter edge. */
const MESSAGE_BODY = 0.45;
const MESSAGE_EDGE = 0.18;

export type RenderTarget = {
  ctx: CanvasRenderingContext2D;
  cols: number;
  rows: number;
  cell: number;
  ink: string;
  fontFamily: string;
};

/**
 * Quantize a float dye field into characters. The ramp does the work a
 * gradient would do in a shader; alpha on top buys back the resolution
 * the ten-step ramp throws away.
 *
 * The message, if there is one, is drawn as its own pass on top. It used to be
 * dye like everything else, which read beautifully in a still frame and fell
 * apart in motion: a letter body carries a range of dye values, so the ramp
 * painted `.`, `-`, `=` and `@` inside one stroke and the shape never
 * resolved. Two levels, body and edge, is what makes it a letter rather than
 * a texture. The fluid still carries a soft echo of the words underneath.
 */
export function renderField(
  dye: Float32Array,
  t: RenderTarget,
  width: number,
  height: number,
  message?: Float32Array | null,
  messageHold = 1,
) {
  const { ctx, cols, rows, cell, ink, fontFamily } = t;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = ink;
  ctx.font = `${cell}px ${fontFamily}`;
  ctx.textBaseline = 'top';

  const last = RAMP.length - 1;
  const cellH = cell * CELL_ASPECT;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const v = dye[y * cols + x];
      if (v < FLOOR) continue;
      const level = Math.min(last, Math.floor(v * last) + 1);
      ctx.globalAlpha = Math.min(0.96, 0.1 + v * 0.85);
      ctx.fillText(RAMP[level], x * cell, y * cellH);
    }
  }

  if (message) drawMessage(message, t, messageHold);
  ctx.globalAlpha = 1;
}

function drawMessage(mask: Float32Array, t: RenderTarget, hold: number) {
  const { ctx, cols, rows, cell } = t;
  const cellH = cell * CELL_ASPECT;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const v = mask[y * cols + x] * hold;
      if (v < MESSAGE_EDGE) continue;
      const body = v >= MESSAGE_BODY;
      ctx.globalAlpha = body ? 0.95 : 0.45;
      ctx.fillText(body ? '@' : '+', x * cell, y * cellH);
    }
  }
}
