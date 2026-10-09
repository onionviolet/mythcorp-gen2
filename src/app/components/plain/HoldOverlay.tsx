'use client';

// Walkthrough: /wc/learn/plain-mode

import dynamic from 'next/dynamic';
import type { Scheme } from './holdScheme';
import { useViewerHorizon } from './sky/sunLight';

/** Full-screen canvas effects that draw their own geometry, layered over the field and under the chrome. */
const GlyphRain = dynamic(() => import('../canvasui/GlyphRain').then((m) => m.GlyphRain), { ssr: false });
const ForceField = dynamic(() => import('../canvasui/ForceField').then((m) => m.ForceField), { ssr: false });
const Clouds = dynamic(() => import('../canvasui/Clouds').then((m) => m.Clouds), { ssr: false });
const Droplets = dynamic(() => import('../canvasui/Droplets').then((m) => m.Droplets), { ssr: false });
const Laser = dynamic(() => import('../canvasui/Laser').then((m) => m.Laser), { ssr: false });

export const OVERLAY_STYLES = ['none', 'rain', 'shield', 'fog', 'drops', 'scan'] as const;

export type OverlayStyle = (typeof OVERLAY_STYLES)[number];

/** Overlays that sample or refract their backdrop render as murky blobs here (nothing is behind
 * them), so only effects that draw their own geometry belong in this list.
 * The layer is pointer-enabled at `-z-10`: the effects bind listeners in their own subtree,
 * and every picker and link above still gets hit first. */
const FILL = 'h-full w-full pointer-events-auto';

export function HoldOverlay({
  overlay,
  scheme,
}: {
  overlay: OverlayStyle;
  scheme: Scheme;
}) {
  if (overlay === 'none') return null;

  // Monochrome, and dark mode has to lift the ink off black rather than sink
  // it into the page.
  const ink: [number, number, number] = scheme === 'dark'
    ? [0.82, 0.82, 0.82]
    : [0.1, 0.1, 0.1];
  const edge: [number, number, number] = scheme === 'dark'
    ? [0.55, 0.55, 0.55]
    : [0.25, 0.25, 0.25];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" data-hold-overlay={overlay}>
      {overlay === 'rain' ? (
        <GlyphRain
          className={FILL}
          charset="01<>[]{}/\\=+*#%@ANDBUILDINGPROGRESS"
          cell={14}
          color={ink}
          headColor={scheme === 'dark' ? [1, 1, 1] : [0, 0, 0]}
          speed={0.2}
          density={0.14}
          trail={0.8}
          glow={0.35}
          mutate={0.6}
          flicker={0.12}
          layers={2}
          dim={0.06}
          light={0.5}
          lightRadius={200}
          relief={0.02}
          stir={0.8}
        >
          <></>
        </GlyphRain>
      ) : overlay === 'scan' ? (
        <SunHorizon ink={ink} />
      ) : overlay === 'fog' ? (
        <Clouds
          className={FILL}
          scale={1.4}
          speed={0.25}
          cover={0.35}
          density={2}
          shading={0.2}
          color={ink}
          opacity={0.3}
          shadow={0}
          wind={1.2}
          windRadius={420}
        >
          <></>
        </Clouds>
      ) : overlay === 'drops' ? (
        <Droplets
          className={FILL}
          intensity={0.35}
          speed={0.7}
          scale={0.5}
          refraction={0.35}
          fallSpeed={0.8}
          wiggle={1}
          staticDrops={0.3}
          interactive
          interactionRadius={0.3}
          interactionStrength={0.7}
          tint={ink}
          tintStrength={0.4}
        >
          <></>
        </Droplets>
      ) : (
        <ForceField
          className={FILL}
          shape="hexagon"
          color={ink}
          edgeColor={edge}
          opacity={0.7}
          cellScale={18}
          gridOpacity={0.16}
          gridReveal="hover"
          edgeGlow={0.15}
        >
          <></>
        </ForceField>
      )}
    </div>
  );
}

/** The halo line is the viewer's own sun: its height and brightness follow
 *  local solar elevation. Monochrome by rule, no warm accent. */
function SunHorizon({ ink }: { ink: [number, number, number] }) {
  const horizon = useViewerHorizon();
  return (
    <Laser
      className={FILL}
      speed={0.25}
      offset={horizon?.offset ?? 160}
      color={ink}
      thickness={horizon?.thickness ?? 4}
      core={horizon?.core ?? 0.8}
      radius={16}
      glow={horizon?.glow ?? 1.2}
      wave={8}
      width={0.6}
      flicker={0.15}
      heat={1}
      sparkle={0.2}
    >
      <></>
    </Laser>
  );
}
