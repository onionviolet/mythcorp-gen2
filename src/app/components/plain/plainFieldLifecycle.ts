const PLAIN_FIELD_SELECTOR = '[data-plain-field]';

export function releasePlainFieldCanvas() {
  const canvas = document.querySelector<HTMLCanvasElement>(PLAIN_FIELD_SELECTOR);
  if (!canvas) return;

  canvas.style.visibility = 'hidden';
  canvas.width = 0;
  canvas.height = 0;
}
