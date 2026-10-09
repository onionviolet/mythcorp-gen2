import { MESSAGE_LINES } from './messageStore';

export const LINKEDIN_BANNER_WIDTH = 1584;
export const LINKEDIN_BANNER_HEIGHT = 396;

export function drawLinkedInBanner(canvas: HTMLCanvasElement, fontFamily: string, paper: string, ink: string) {
  canvas.width = LINKEDIN_BANNER_WIDTH;
  canvas.height = LINKEDIN_BANNER_HEIGHT;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('This browser cannot draw the banner.');
  let seed = 17017;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `9px ${fontFamily}`;
  const glyphs = '.:+*';
  for (let u = 0; u <= 1; u += 0.009) {
    for (let v = -1; v <= 1; v += 0.055) {
      const width = 10 + 56 * Math.sin(Math.PI * u);
      const twist = u * Math.PI * 2.2;
      const x = 400 + 450 * u + v * width * Math.sin(twist);
      const y = 304 - 134 * u - 90 * Math.sin(Math.PI * u) + v * width * Math.cos(twist);
      if (random() < 0.13) continue;
      ctx.globalAlpha = (0.22 + 0.5 * (v + 1) / 2) * Math.sin(Math.PI * u * 0.88);
      ctx.fillText(glyphs[Math.floor(random() * glyphs.length)], x, y);
    }
  }
  ctx.font = `8px ${fontFamily}`;
  for (let i = 0; i < 1000; i++) {
    const x = 360 + random() * 1160;
    const y = 45 + random() * 310;
    const wave = 260 - 100 * Math.sin((x - 360) / 380);
    if (Math.abs(y - wave) > 18 + random() * 80) continue;
    ctx.globalAlpha = 0.05 + random() * 0.13;
    ctx.fillText(random() > 0.9 ? '+' : '.', x, y);
  }
  const mask = document.createElement('canvas');
  mask.width = canvas.width;
  mask.height = canvas.height;
  const text = mask.getContext('2d');
  if (!text) throw new Error('This browser cannot draw the lettering.');
  text.fillStyle = ink;
  text.font = `800 104px ${fontFamily}`;
  text.textAlign = 'left';
  text.textBaseline = 'middle';
  MESSAGE_LINES.forEach((line, index) => text.fillText(line, 906, 139 + index * 112));
  const pixels = text.getImageData(0, 0, mask.width, mask.height).data;
  ctx.font = `4px ${fontFamily}`;
  for (let y = 80; y < 314; y += 2) {
    for (let x = 896; x < 1525; x += 2) {
      if (pixels[(y * mask.width + x) * 4 + 3] < 100) continue;
      const erosion = 0.03 + 0.14 * Math.max(0, (1100 - x) / 204);
      if (random() < erosion) continue;
      ctx.globalAlpha = 0.76 + random() * 0.24;
      ctx.fillRect(x + random() * 0.5, y, 1.65, 1.65);
      if (random() < erosion * 0.7) {
        ctx.globalAlpha = 0.16;
        ctx.fillText('.', x - 10 - random() * 30, y + random() * 12);
      }
    }
  }
  ctx.globalAlpha = 0.8;
  ctx.font = `14px ${fontFamily}`;
  ctx.textAlign = 'left';
  ctx.fillText('M Y T H C O R P', 64, 50);
  ctx.globalAlpha = 0.65;
  ctx.font = `14px ${fontFamily}`;
  ctx.textAlign = 'right';
  ctx.fillText('mythcorp.org', 1518, 351);
  ctx.globalAlpha = 1;
}
