import { ImageResponse } from 'next/og';
import { chicagoClock } from '../chicagoTime';
import { dailyComposition } from '../holdCompositions';
import { solarPosition } from '../sky/solarPosition';
import samples from './shareSpectre.json';
import font from './shareFont.json';
import ink from './sharePalette.json';

export const SHARE_IMAGE_ALT = 'WORK IN PROGRESS, a spectre made of dust above a thin halo line.';
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 };

export function shareImage(now = new Date()) {
  const hour = new Date(Math.floor(now.getTime() / 3_600_000) * 3_600_000);
  const scene = dailyComposition(hour);
  const sun = solarPosition(hour, 41.88, -87.63);
  const day = Math.min(1, Math.max(0, (sun.elevation + 8) / 12));
  const radians = Math.PI / 180;
  const light = [-Math.sin(sun.azimuth * radians), Math.sin(Math.max(-4, sun.elevation) * radians), 0.55];
  const length = Math.hypot(...light);
  const haloY = 505 - Math.max(-15, Math.min(65, sun.elevation)) * 1.35;
  const dust = samples.map(([x, y, nx, ny, nz], index) => {
    const lambert = Math.max(0, (nx * light[0] + ny * light[1] + nz * light[2]) / (100 * length));
    const scatter = scene.name === 'Drift' ? Math.sin(index * 19.7) * 3 : 0;
    const radius = scene.name === 'Surface' ? 2.5 : scene.name === 'Suspension' ? 1.3 : 1.8;
    return `<circle cx="${710 + x * 5.6 + scatter}" cy="${84 + y * 5.6}" r="${radius}" opacity="${(0.22 + 0.48 * day * lambert).toFixed(2)}"/>`;
  }).join('');
  const field = Array.from({ length: 380 }, (_, i) => {
    const x = (i * 131.71) % 1200;
    const y = (i * 79.31) % 630;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="0.7" opacity="0.15"/>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><g fill="${ink['--fg']}">${field}${dust}</g><path d="M0 ${haloY} Q600 ${haloY - 25} 1200 ${haloY}" fill="none" stroke="${ink['--fg']}" stroke-opacity="${0.2 + day * 0.3}" stroke-width="1.5"/></svg>`;
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: ink['--bg'], color: ink['--fg'], fontFamily: 'Geist Mono' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" src={`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`} width={1200} height={630} style={{ position: 'absolute', top: 0, left: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: 64, top: 54 }}>
        <div style={{ fontSize: 19, letterSpacing: 5 }}>MYTHCORP</div>
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 114, fontSize: 74, lineHeight: 1.08, letterSpacing: -4 }}>
          <div>WORK IN</div><div>PROGRESS</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 64, bottom: 52, fontSize: 18, color: ink['--fg-muted'] }}>Spend a moment here.</div>
      <div style={{ display: 'flex', position: 'absolute', right: 64, bottom: 52, fontSize: 14, color: ink['--fg-subtle'] }}>{scene.name.toUpperCase()} / CHICAGO {chicagoClock(hour)}</div>
    </div>,
    {
      ...SHARE_IMAGE_SIZE,
      fonts: [{ name: 'Geist Mono', data: Uint8Array.from(Buffer.from(font, 'base64')).buffer, style: 'normal', weight: 400 }],
      headers: { 'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=300' },
    },
  );
}
