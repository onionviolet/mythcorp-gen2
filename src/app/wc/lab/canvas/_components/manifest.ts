'use client';

import dynamic from 'next/dynamic';
import type { ComponentType, ReactNode } from 'react';
import type { ColorToken } from './tokenInk';

/**
 * The roster. One entry per vendored Canvas UI component, and an entry is the
 * only thing a new component needs: the loader, the blurb, the flag answer,
 * and a schema of the props worth turning. Nothing else in the lab has a list
 * of component names in it.
 *
 * To append one: copy the closest entry, point `Component` at the new file,
 * set `subject` and `needsHtmlInCanvas`, and describe its interesting props
 * with the num / bool / pick / col helpers below. Every default here is passed
 * explicitly, so the copyable snippet is always the whole truth about what the
 * stage is running. Where a default matches the vendored DEFAULTS block it is
 * copied from it; the charset presets deliberately do not.
 *
 * This stays as one flat registry so adding a component remains one edit in
 * one place.
 */

export type StageProps = Record<string, unknown> & {
  className?: string;
  children?: ReactNode;
};

export type StageComponent = ComponentType<StageProps>;

export type PropValue = number | boolean | string;

export type PropValues = Record<string, PropValue>;

export type PropSpec =
  | { kind: 'number'; name: string; label: string; def: number; min: number; max: number; step: number }
  | { kind: 'boolean'; name: string; label: string; def: boolean }
  | { kind: 'select'; name: string; label: string; def: string; options: ReadonlyArray<{ value: string; label: string }> }
  | { kind: 'color'; name: string; label: string; def: ColorToken; format: 'hex' | 'rgb01' };

export interface CanvasEntry {
  /** Slug used in the roster and the readout. */
  id: string;
  /** The exported symbol, shown verbatim so the snippet is copy-pasteable. */
  name: string;
  /** `page` wraps live DOM and resamples it. `object` renders a GLB. */
  subject: 'page' | 'object';
  /** True when the real effect is inert without the html-in-canvas API. */
  needsHtmlInCanvas: boolean;
  blurb: string;
  Component: StageComponent;
  props: ReadonlyArray<PropSpec>;
  /** Props forced on when the visitor asked for less motion. */
  calm?: PropValues;
}

const num = (
  name: string, label: string, def: number, min: number, max: number, step: number,
): PropSpec => ({ kind: 'number', name, label, def, min, max, step });

const bool = (name: string, label: string, def: boolean): PropSpec =>
  ({ kind: 'boolean', name, label, def });

const pick = (
  name: string, label: string, def: string, options: ReadonlyArray<{ value: string; label: string }>,
): PropSpec => ({ kind: 'select', name, label, def, options });

const col = (
  name: string, label: string, def: ColorToken, format: 'hex' | 'rgb01',
): PropSpec => ({ kind: 'color', name, label, def, format });

const RAMPS = [
  { value: 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ0123456789Z*+-<>¦=:.', label: 'katakana' },
  { value: '01', label: 'binary' },
  { value: 'MYTHCORP0123456789<>[]{}/\\=+*#%@', label: 'mythcorp' },
  { value: ' .:-=+*#%@', label: 'ramp' },
] as const;

// next/dynamic reads its options object at compile time, so every one of these
// literals has to be written out in full. Hoisting `{ ssr: false }` to a const
// fails the build. ssr:false because every one of them reaches for a canvas on
// mount, and
// each is roughly a megabyte of WebGL carrying its own loader stack, which is
// why the stage mounts exactly one at a time.
const load = {
  Asciify: dynamic(() => import('../../../../components/canvasui/Asciify').then((m) => m.Asciify), { ssr: false }),
  DecryptReveal: dynamic(() => import('../../../../components/canvasui/DecryptReveal').then((m) => m.DecryptReveal), { ssr: false }),
  GlyphRain: dynamic(() => import('../../../../components/canvasui/GlyphRain').then((m) => m.GlyphRain), { ssr: false }),
  RetroDither: dynamic(() => import('../../../../components/canvasui/RetroDither').then((m) => m.RetroDither), { ssr: false }),
  ForceField: dynamic(() => import('../../../../components/canvasui/ForceField').then((m) => m.ForceField), { ssr: false }),
  Glitch: dynamic(() => import('../../../../components/canvasui/Glitch').then((m) => m.Glitch), { ssr: false }),
  AsciiObject: dynamic(() => import('../../../../components/canvasui/AsciiObject').then((m) => m.AsciiObject), { ssr: false }),
  InkObject: dynamic(() => import('../../../../components/canvasui/InkObject').then((m) => m.InkObject), { ssr: false }),
  ParticleObject: dynamic(() => import('../../../../components/canvasui/ParticleObject').then((m) => m.ParticleObject), { ssr: false }),
  LiquidObject: dynamic(() => import('../../../../components/canvasui/LiquidObject').then((m) => m.LiquidObject), { ssr: false }),
  Clouds: dynamic(() => import('../../../../components/canvasui/Clouds').then((m) => m.Clouds), { ssr: false }),
  Droplets: dynamic(() => import('../../../../components/canvasui/Droplets').then((m) => m.Droplets), { ssr: false }),
  FlameWrap: dynamic(() => import('../../../../components/canvasui/FlameWrap').then((m) => m.FlameWrap), { ssr: false }),
  Frost: dynamic(() => import('../../../../components/canvasui/Frost').then((m) => m.Frost), { ssr: false }),
  // Vendored as `Grid`, which is exactly the generic name CLAUDE.md warns
  // against. The file stays verbatim, so the alias happens here instead.
  TileGrid: dynamic(() => import('../../../../components/canvasui/Grid').then((m) => m.Grid), { ssr: false }),
  HexFloat: dynamic(() => import('../../../../components/canvasui/HexFloat').then((m) => m.HexFloat), { ssr: false }),
  Laser: dynamic(() => import('../../../../components/canvasui/Laser').then((m) => m.Laser), { ssr: false }),
  Liquid: dynamic(() => import('../../../../components/canvasui/Liquid').then((m) => m.Liquid), { ssr: false }),
} as unknown as Record<string, StageComponent>;

/** Stillness for the object renderers, applied under reduced motion. */
const STILL: PropValues = { floatIntensity: 0, rotationIntensity: 0, autoRotate: false };

export const CANVAS_ENTRIES: ReadonlyArray<CanvasEntry> = [
  {
    id: 'asciify',
    name: 'Asciify',
    subject: 'page',
    needsHtmlInCanvas: true,
    blurb: 'An ascii lens that follows the cursor across whatever it is wrapping.',
    Component: load.Asciify,
    props: [
      num('scale', 'glyph pixel', 2, 1, 6, 1),
      num('spacing', 'spacing', 1, 0, 3, 1),
      pick('charset', 'ramp', 'ascii', [
        { value: 'ascii', label: 'ascii' },
        { value: 'blocks', label: 'blocks' },
        { value: 'binary', label: 'binary' },
      ]),
      num('radius', 'lens radius', 0.4, 0.1, 1, 0.05),
      num('strength', 'lens coverage', 1, 0, 1, 0.05),
      num('baseStrength', 'coverage outside', 0, 0, 1, 0.05),
      num('contrast', 'contrast', 1, 0.2, 3, 0.1),
      num('glow', 'phosphor glow', 0.75, 0, 1, 0.05),
      col('background', 'paper', '--bg', 'rgb01'),
      num('backgroundOpacity', 'paper opacity', 0, 0, 1, 0.05),
    ],
  },
  {
    id: 'decrypt-reveal',
    name: 'DecryptReveal',
    subject: 'page',
    needsHtmlInCanvas: true,
    blurb: 'The page held as cipher text, decoding in a circle around the cursor.',
    Component: load.DecryptReveal,
    props: [
      num('radius', 'decrypt radius', 400, 50, 800, 10),
      num('cell', 'cell height', 10, 4, 40, 1),
      num('colored', 'keeps page colour', 1, 0, 1, 0.05),
      col('color', 'cipher', '--accent', 'hex'),
      col('background', 'backdrop', '--bg', 'hex'),
      num('scramble', 'idle mutation', 0.1, 0, 1, 0.05),
      num('scrambleSpeed', 'mutations/sec', 6, 0, 30, 1),
      num('edgeGlow', 'wavefront glow', 2, 0, 3, 0.1),
      num('passthrough', 'page showing through', 0.15, 0, 1, 0.05),
    ],
    calm: { scramble: 0, edgeFlicker: 0 },
  },
  {
    id: 'glyph-rain',
    name: 'GlyphRain',
    subject: 'page',
    needsHtmlInCanvas: false,
    blurb: 'Falling glyph columns in their own canvas. Only the light they cast on the page needs the API.',
    Component: load.GlyphRain,
    props: [
      pick('charset', 'glyphs', RAMPS[0].value, RAMPS),
      num('cell', 'cell size', 15, 8, 64, 1),
      col('color', 'streaks', '--accent-soft', 'rgb01'),
      col('headColor', 'drop heads', '--accent', 'rgb01'),
      num('speed', 'fall speed', 0.2, 0.05, 3, 0.05),
      num('density', 'density', 0.15, 0, 1, 0.01),
      num('trail', 'trail length', 0.65, 0.2, 3, 0.05),
      num('glow', 'head glow', 1.75, 0, 3, 0.05),
      num('layers', 'parallax layers', 2, 1, 3, 1),
      num('dim', 'page dimming', 0.5, 0, 1, 0.05),
      num('light', 'light on the page', 2.8, 0, 3, 0.05),
      num('stir', 'cursor stir', 0.7, 0, 1, 0.05),
    ],
    calm: { speed: 0.06, flicker: 0, mutate: 0 },
  },
  {
    id: 'retro-dither',
    name: 'RetroDither',
    subject: 'page',
    needsHtmlInCanvas: true,
    blurb: 'A pixelate-and-quantize lens, with phosphor burn-in along the cursor path.',
    Component: load.RetroDither,
    props: [
      num('pixelSize', 'pixel size', 2, 1, 12, 1),
      num('levels', 'brightness levels', 4, 2, 8, 1),
      pick('pattern', 'pattern', 'bayer', [
        { value: 'bayer', label: 'bayer' },
        { value: 'halftone', label: 'halftone' },
        { value: 'hatch', label: 'hatch' },
        { value: 'dash', label: 'dash' },
      ]),
      col('darkColor', 'dark end', '--bg', 'rgb01'),
      col('lightColor', 'light end', '--fg', 'rgb01'),
      num('colorize', 'palette blend', 0.1, 0, 1, 0.05),
      num('contrast', 'contrast', 0.6, 0.2, 3, 0.1),
      num('strength', 'lens coverage', 0.75, 0, 1, 0.05),
      num('scanlines', 'scanlines', 0, 0, 1, 0.05),
      num('trail', 'burn-in', 0.4, 0, 1, 0.05),
    ],
    calm: { trail: 0, degauss: 0 },
  },
  {
    id: 'force-field',
    name: 'ForceField',
    subject: 'page',
    needsHtmlInCanvas: false,
    blurb: 'A charged lattice over the content. The lattice is its own geometry, the refraction is not.',
    Component: load.ForceField,
    props: [
      pick('shape', 'cell shape', 'hexagon', [
        { value: 'hexagon', label: 'hexagon' },
        { value: 'triangle', label: 'triangle' },
        { value: 'square', label: 'square' },
      ]),
      col('color', 'field', '--accent', 'rgb01'),
      col('edgeColor', 'edge glow', '--accent-soft', 'rgb01'),
      num('opacity', 'opacity', 0.9, 0, 1, 0.05),
      num('cellScale', 'cells across', 16, 4, 80, 1),
      num('gridOpacity', 'lattice brightness', 0.15, 0, 1, 0.01),
      pick('gridReveal', 'lattice shows', 'click', [
        { value: 'always', label: 'always' },
        { value: 'hover', label: 'on hover' },
        { value: 'click', label: 'on click' },
        { value: 'both', label: 'both' },
      ]),
      num('edgeGlow', 'screen-edge glow', 0.2, 0, 4, 0.1),
      num('grain', 'grain', 0.2, 0, 1, 0.05),
      num('haze', 'heat haze', 0.5, 0, 2, 0.05),
    ],
    calm: { haze: 0, flashSpeed: 0, flowSpeed: 0 },
  },
  {
    id: 'glitch',
    name: 'Glitch',
    subject: 'page',
    needsHtmlInCanvas: true,
    blurb: 'Periodic tear and RGB split. It has nothing to tear without a copy of the page.',
    Component: load.Glitch,
    props: [
      num('intensity', 'intensity', 1, 0, 2, 0.05),
      num('interval', 'seconds between', 3, 0, 10, 0.1),
      num('duration', 'burst length', 0.4, 0.05, 2, 0.05),
      num('slices', 'slices', 24, 4, 64, 1),
      num('shift', 'slice shift', 30, 0, 100, 1),
      num('rgbShift', 'rgb split', 4, 0, 20, 0.5),
      num('blocks', 'block corruption', 0.5, 0, 1, 0.05),
      num('noise', 'analog noise', 0.35, 0, 1, 0.05),
    ],
    calm: { intensity: 0.2, interval: 9, blocks: 0, noise: 0.1 },
  },
  {
    id: 'ascii-object',
    name: 'AsciiObject',
    subject: 'object',
    needsHtmlInCanvas: false,
    blurb: 'The model redrawn as characters, matched on shape rather than brightness alone.',
    Component: load.AsciiObject,
    props: [
      num('cellSize', 'cell height', 10, 4, 24, 1),
      num('cellAspect', 'cell aspect', 0.6, 0.35, 1.25, 0.05),
      pick('charset', 'characters', RAMPS[3].value, RAMPS),
      bool('colored', 'scene colour', false),
      col('color', 'characters', '--fg', 'hex'),
      col('highlight', 'ring light', '--accent', 'hex'),
      num('contrast', 'tone contrast', 1.5, 0.2, 3, 0.1),
      num('edgeContrast', 'edge snap', 3, 1, 6, 0.1),
      bool('invert', 'invert tones', false),
      num('scale', 'object scale', 3, 1, 5, 0.1),
    ],
    calm: STILL,
  },
  {
    id: 'ink-object',
    name: 'InkObject',
    subject: 'object',
    needsHtmlInCanvas: false,
    blurb: 'Hatched pen strokes that ride the depth buffer, so the lines wrap the form.',
    Component: load.InkObject,
    props: [
      col('inkColor', 'ink', '--fg', 'hex'),
      col('highlight', 'ring light', '--accent', 'hex'),
      num('lineSpacing', 'line spacing', 8, 3, 20, 1),
      num('strokeWeight', 'stroke weight', 1, 0, 1.5, 0.05),
      num('angle', 'stroke angle', 0, 0, 180, 5),
      num('bleed', 'ink bleed', 0.35, 0, 1, 0.05),
      num('grain', 'dry brush', 0.32, 0, 1, 0.05),
      num('contrast', 'tone ramp', 2.2, 0.5, 4, 0.1),
      num('threshold', 'ink threshold', 0.2, 0, 1, 0.02),
      bool('invert', 'ink the lights', false),
    ],
    calm: STILL,
  },
  {
    id: 'particle-object',
    name: 'ParticleObject',
    subject: 'object',
    needsHtmlInCanvas: false,
    blurb: 'The model rebuilt from points that flee the cursor and spring back home.',
    Component: load.ParticleObject,
    props: [
      num('count', 'particles', 14000, 500, 40000, 500),
      num('size', 'point size', 2.4, 0.5, 8, 0.1),
      num('sizeVariance', 'size variance', 0.6, 0, 1, 0.05),
      col('color', 'points', '--accent', 'hex'),
      num('radius', 'push radius', 110, 20, 400, 10),
      num('strength', 'push strength', 1, 0, 4, 0.1),
      num('swirl', 'swirl', 0.6, 0, 2, 0.05),
      num('spring', 'spring home', 1, 0.005, 2, 0.005),
      num('damping', 'damping', 0.35, 0, 1, 0.01),
      num('drift', 'idle shimmer', 0.6, 0, 2, 0.05),
    ],
    calm: { ...STILL, drift: 0 },
  },
  {
    id: 'liquid-object',
    name: 'LiquidObject',
    subject: 'object',
    needsHtmlInCanvas: false,
    blurb: 'The model read through moving liquid, dragged and refracted by the cursor.',
    Component: load.LiquidObject,
    props: [
      num('distortion', 'distortion', 2, 0, 6, 0.1),
      num('sheen', 'sheen', 1.6, 0, 4, 0.1),
      num('swirl', 'swirl', 0.5, 0, 2, 0.05),
      num('iridescence', 'iridescence', 1.5, 0, 3, 0.1),
      num('aberration', 'lens fringe', 0.75, 0, 3, 0.05),
      num('grain', 'grain', 1, 0, 2, 0.05),
      num('saturation', 'saturation', 1.2, 0, 2, 0.05),
      num('wobble', 'jelly wobble', 0, 0, 2, 0.05),
      col('tint', 'tint', '--accent-warm', 'hex'),
      col('highlight', 'ring light', '--fg', 'hex'),
    ],
    calm: { ...STILL, ambient: 0, splash: 0 },
  },
  {
    id: 'clouds',
    name: 'Clouds',
    subject: 'page',
    needsHtmlInCanvas: false,
    blurb: 'Procedural fog drifting over the content. The cursor parts it.',
    Component: load.Clouds,
    props: [
      num('scale', 'cloud scale', 1, 0.2, 3, 0.05),
      num('speed', 'drift speed', 0.6, 0, 2, 0.05),
      num('cover', 'coverage', 0.1, 0, 1, 0.01),
      num('density', 'density', 2.5, 0, 6, 0.1),
      num('shading', 'shading', 0.1, 0, 1, 0.05),
      num('opacity', 'opacity', 0.64, 0, 1, 0.02),
      col('color', 'cloud', '--fg', 'rgb01'),
      num('shadow', 'cast shadow', 0.06, 0, 1, 0.02),
      num('wind', 'cursor wind', 0.6, 0, 2, 0.05),
      num('windRadius', 'wind radius', 350, 50, 800, 10),
      num('fogBlur', 'fog blur', 0, 0, 1, 0.05),
    ],
    calm: { speed: 0, wind: 0 },
  },
  {
    id: 'droplets',
    name: 'Droplets',
    subject: 'page',
    needsHtmlInCanvas: false,
    blurb: 'Rain running down the glass. The drops are geometry, the refraction is not.',
    Component: load.Droplets,
    props: [
      num('intensity', 'rain intensity', 0.5, 0, 1, 0.02),
      num('speed', 'speed', 1, 0, 3, 0.05),
      num('scale', 'drop scale', 0.4, 0.1, 2, 0.05),
      num('dropWidth', 'drop width', 1, 0.2, 3, 0.05),
      num('dropLength', 'drop length', 1, 0.2, 3, 0.05),
      num('refraction', 'refraction', 0.2, 0, 1, 0.02),
      num('fallSpeed', 'fall speed', 1, 0, 3, 0.05),
      num('wiggle', 'wiggle', 1, 0, 3, 0.05),
      num('staticDrops', 'clinging drops', 0.2, 0, 1, 0.02),
      num('vignette', 'vignette', 0, 0, 1, 0.05),
      bool('interactive', 'cursor clears drops', true),
      col('tint', 'tint', '--accent-soft', 'rgb01'),
      num('tintStrength', 'tint strength', 0, 0, 1, 0.05),
    ],
    calm: { speed: 0, fallSpeed: 0, wiggle: 0 },
  },
  {
    id: 'flame-wrap',
    name: 'FlameWrap',
    subject: 'page',
    needsHtmlInCanvas: false,
    blurb: 'A border of fire aligned to the element it wraps. Flames, sparks and smoke are all its own.',
    Component: load.FlameWrap,
    props: [
      col('color', 'flame', '--accent-warm', 'rgb01'),
      num('intensity', 'intensity', 0.5, 0, 1, 0.02),
      num('height', 'flame height', 170, 20, 400, 10),
      num('spread', 'spread', 8, 0, 40, 1),
      num('radius', 'corner radius', 40, 0, 120, 2),
      num('speed', 'speed', 0.25, 0, 2, 0.05),
      num('turbulence', 'turbulence', 0.5, 0, 2, 0.05),
      num('sparks', 'sparks', 1.5, 0, 4, 0.1),
      num('rim', 'rim light', 2.5, 0, 6, 0.1),
      num('smoke', 'smoke', 1.5, 0, 4, 0.1),
      num('ember', 'ember glow', 2, 0, 5, 0.1),
      num('distortion', 'heat distortion', 10, 0, 30, 0.5),
    ],
    calm: { speed: 0.05, sparks: 0, turbulence: 0 },
  },
  {
    id: 'frost',
    name: 'Frost',
    subject: 'page',
    needsHtmlInCanvas: false,
    blurb: 'A frozen pane over the page. Hovering melts a hole through it, and it refreezes behind you.',
    Component: load.Frost,
    props: [
      num('frost', 'frost coverage', 0.05, 0, 1, 0.01),
      num('strength', 'strength', 0.7, 0, 2, 0.05),
      num('contrast', 'contrast', 3, 0.5, 6, 0.1),
      num('crispness', 'crispness', 1, 0, 3, 0.05),
      num('highlight', 'highlight', 0.3, 0, 1, 0.02),
      num('haze', 'haze', 0.5, 0, 1, 0.02),
      col('tintThin', 'thin ice', '--accent-soft', 'rgb01'),
      col('tintThick', 'thick ice', '--fg', 'rgb01'),
      num('tintStrength', 'tint strength', 0.3, 0, 1, 0.02),
      num('refraction', 'refraction', 1, 0, 3, 0.05),
      num('meltRadius', 'melt radius', 0.25, 0.05, 1, 0.01),
      num('meltStrength', 'melt strength', 0.75, 0, 1, 0.02),
      num('refreeze', 'refreeze speed', 2, 0, 6, 0.1),
      num('opacity', 'opacity', 0.6, 0, 1, 0.02),
      bool('meltEdges', 'melt at edges', true),
    ],
    calm: { shimmer: 0, introDuration: 0 },
  },
  {
    id: 'tile-grid',
    name: 'Grid',
    subject: 'page',
    needsHtmlInCanvas: false,
    blurb: 'The page split into 3D tiles that ripple in waves around the cursor.',
    Component: load.TileGrid,
    props: [
      num('tileSize', 'tile size', 150, 40, 400, 10),
      num('gap', 'gap', 0, 0, 24, 1),
      num('cornerRadius', 'corner radius', 0, 0, 40, 1),
      num('amplitude', 'wave amplitude', 2.5, 0, 8, 0.1),
      num('waveSpeed', 'wave speed', 0.5, 0, 3, 0.05),
      num('frequency', 'frequency', 12, 1, 40, 1),
      num('liftHeight', 'lift height', 60, 0, 200, 5),
      num('perspective', 'perspective', 1200, 200, 3000, 50),
      num('tilt', 'tilt', 1, 0, 4, 0.05),
      num('shading', 'shading', 0.05, 0, 1, 0.02),
      col('tint', 'tint', '--accent', 'rgb01'),
      num('tintStrength', 'tint strength', 0.1, 0, 1, 0.02),
      num('idleRipples', 'idle ripples', 0, 0, 2, 0.05),
    ],
    calm: { waveSpeed: 0, idleRipples: 0 },
  },
  {
    id: 'hex-float',
    name: 'HexFloat',
    subject: 'page',
    needsHtmlInCanvas: false,
    blurb: 'A floor of bevelled hex tiles leaning back in perspective, bobbing gently.',
    Component: load.HexFloat,
    props: [
      num('size', 'hex size', 160, 40, 400, 10),
      num('gap', 'gap', 0, 0, 20, 1),
      num('bevel', 'bevel', 1.5, 0, 5, 0.1),
      num('tilt', 'tilt', 24, 0, 60, 1),
      num('perspective', 'perspective', 0.5, 0, 2, 0.05),
      num('float', 'bob', 0, 0, 2, 0.05),
      num('speed', 'speed', 1, 0, 3, 0.05),
      num('shine', 'shine', 0.5, 0, 2, 0.05),
      num('lift', 'cursor lift', 0.1, 0, 1, 0.02),
      num('radius', 'cursor radius', 1200, 200, 3000, 50),
      num('iridescence', 'iridescence', 0, 0, 3, 0.05),
      num('grain', 'grain', 0.8, 0, 2, 0.05),
      col('gapColor', 'gap', '--bg', 'rgb01'),
    ],
    calm: { float: 0, speed: 0 },
  },
  {
    id: 'laser',
    name: 'Laser',
    subject: 'page',
    needsHtmlInCanvas: false,
    blurb: 'A beam that hides everything below it and prints new content as you scroll past.',
    Component: load.Laser,
    props: [
      num('speed', 'speed', 0.3, 0, 2, 0.05),
      num('offset', 'height off the floor', 140, 0, 500, 10),
      col('color', 'beam', '--accent', 'rgb01'),
      num('thickness', 'thickness', 6, 1, 30, 0.5),
      num('core', 'core brightness', 1, 0, 3, 0.05),
      num('radius', 'bloom radius', 20, 0, 80, 1),
      num('glow', 'glow', 2, 0, 5, 0.1),
      num('wave', 'wave', 10, 0, 40, 0.5),
      num('width', 'beam width', 0.55, 0.1, 1, 0.01),
      num('flicker', 'flicker', 0.2, 0, 1, 0.02),
      num('reveal', 'reveal distance', 400, 50, 900, 10),
      num('heat', 'heat', 1.5, 0, 4, 0.1),
      num('sparkle', 'sparkle', 0.25, 0, 1, 0.02),
    ],
    calm: { speed: 0, flicker: 0, sparkle: 0 },
  },
  {
    id: 'liquid',
    name: 'Liquid',
    subject: 'page',
    needsHtmlInCanvas: false,
    blurb: 'A pointer-driven GPU fluid over the page. The same idea as the plain field, on a shader.',
    Component: load.Liquid,
    props: [
      num('densityDissipation', 'dye dissipation', 0.96, 0.8, 1, 0.005),
      num('velocityDissipation', 'velocity dissipation', 1, 0.8, 1, 0.005),
      num('pressure', 'pressure', 0.8, 0, 1, 0.02),
      num('curl', 'curl', 1.9, 0, 6, 0.1),
      num('radius', 'splat radius', 0.3, 0.05, 1, 0.01),
      num('force', 'splat force', 1.1, 0, 4, 0.05),
      num('intensity', 'intensity', 2, 0, 5, 0.1),
      num('distortion', 'distortion', 0.4, 0, 2, 0.05),
      num('blend', 'blend', 5, 0, 10, 0.5),
      col('color', 'dye', '--accent', 'rgb01'),
      bool('rainbow', 'rainbow dye', false),
    ],
    calm: { force: 0, intensity: 0 },
  },
];

export function entryById(id: string): CanvasEntry | undefined {
  return CANVAS_ENTRIES.find((e) => e.id === id);
}

/**
 * Schema defaults, with the calm set folded in when the visitor asked for less
 * motion. Folding rather than forcing, so a slider the calm set touches is
 * still a live control and not a dead one.
 */
export function defaultsFor(entry: CanvasEntry, calm: boolean): PropValues {
  const out: PropValues = {};
  for (const spec of entry.props) {
    const quiet = calm ? entry.calm?.[spec.name] : undefined;
    out[spec.name] = quiet ?? spec.def;
  }
  return out;
}

/** The calm props with no control of their own. Always applied when calm. */
export function calmExtras(entry: CanvasEntry): PropValues {
  const named = new Set(entry.props.map((p) => p.name));
  const out: PropValues = {};
  for (const [key, value] of Object.entries(entry.calm ?? {})) {
    if (!named.has(key)) out[key] = value;
  }
  return out;
}
