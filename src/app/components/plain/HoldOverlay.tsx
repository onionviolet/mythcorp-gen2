'use client';

// Walkthrough: /wc/learn/plain-mode

import dynamic from 'next/dynamic';
import type { Scheme } from './holdScheme';

/**
 * The two Canvas UI effects that draw their own geometry rather than
 * resampling the page, which is why they are the only ones from that half of
 * the library that survive here: they need no Chrome flag and look the same
 * for everyone. They run as a full-screen layer over the field and under the
 * chrome, so they compose with whatever the spectre and the message are doing
 * instead of replacing either.
 */
const GlyphRain = dynamic(() => import('../canvasui/GlyphRain').then((m) => m.GlyphRain), { ssr: false });
const ForceField = dynamic(() => import('../canvasui/ForceField').then((m) => m.ForceField), { ssr: false });
const Clouds = dynamic(() => import('../canvasui/Clouds').then((m) => m.Clouds), { ssr: false });
const Droplets = dynamic(() => import('../canvasui/Droplets').then((m) => m.Droplets), { ssr: false });
const Laser = dynamic(() => import('../canvasui/Laser').then((m) => m.Laser), { ssr: false });

export const OVERLAY_STYLES = ['none', 'rain', 'shield', 'fog', 'drops', 'scan'] as const;

export type OverlayStyle = (typeof OVERLAY_STYLES)[number];

/**
 * Four more were auditioned the same way and cut, each for its own reason,
 * which is worth writing down so nobody spends the afternoon again:
 *
 * - `grid` (Grid) maps the page onto 3D tiles, and with no page to map it
 *   fills them with flat tint, so it rendered as opaque grey rectangles
 *   sitting on the spectre and half the readout. The backdrop trap again.
 * - `fluid` (Liquid) is a GPU fluid and works, but it paints a milky smear
 *   over the readout at any strength worth having, and more to the point it
 *   competes with this theme's own ASCII fluid. We already have a fluid, it is
 *   ours, and it is the one with the story. Tunable if that ever changes.
 * - `tiles` (HexFloat) rendered fine but dark and mostly at the edges, and it
 *   is hexagons, which `shield` already does and does better because its
 *   lattice actually lights under the cursor. Cut for redundancy, not failure.
 * - `blaze` (Blaze) and `edge` (FlameWrap), the two fire effects, close the
 *   catalogue out. `edge` drew literally nothing: FlameWrap outlines an
 *   ELEMENT, and with no children there is no element to trace, so it is a
 *   border effect rather than a layer. `blaze` worked but monochrome fire is
 *   just moving grey specks, which this screen already has a better name for:
 *   the `dust` message. It is the strongest argument for ever allowing one
 *   hue in plain mode, and until that is decided it stays out.
 * - `frost` (Frost) is below, and is the third time this exact trap has been
 *   walked into.
 *
 * Frost is worth writing down at length because it is the clearest case. It answers the cursor
 * harder than anything else in the library, 77 references to the pointer, and
 * hovering melts a hole through the ice that refreezes behind you. But it
 * refracts what is BEHIND it, and behind it here is transparency, so with
 * nothing to bend it renders as a murky dark blob sitting on top of the
 * spectre. Same failure as the dither and glass models in HoldStage. The rule
 * this keeps teaching: on this screen, only components that draw their own
 * geometry survive. Anything that samples or refracts its backdrop has no
 * backdrop to work with.
 *
 * All of these bind pointer listeners inside their own subtree, so the
 * `pointer-events-none` layer below was disabling the half of each effect that
 * responds to you: the rain's `stir`, and, more embarrassingly, the shield's
 * `gridReveal="hover"`, which means the lattice only lights where the cursor
 * crosses it. That one was not a missing flourish, it was the entire mechanic.
 *
 * Re-enabling hit testing here is safe because the layer sits at `-z-10`.
 * Anything painted above it, which is every picker and every link, is hit
 * first, and the overlay only picks up pointers over otherwise empty screen.
 */
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
        <Laser
          className={FILL}
          speed={0.25}
          offset={160}
          color={ink}
          thickness={4}
          core={0.8}
          radius={16}
          glow={1.2}
          wave={8}
          width={0.6}
          flicker={0.15}
          heat={1}
          sparkle={0.2}
        >
          <></>
        </Laser>
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
