'use client';

// Walkthrough: /og/calhoun
// A looping visualization of Calhoun's Universe 25: a population that blooms
// outward, crowds into a central "sink," sheds pale withdrawn "beautiful ones,"
// then dims to a still collapse before resetting. Phases A-D map to the paper.

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { Color, Points } from 'three';

export type SinkPhase = 'A' | 'B' | 'C' | 'D';

export interface SinkState {
  phase: SinkPhase;
  phaseName: string;
  population: number;
}

interface BehavioralSinkProps {
  color: string;
  onState?: (s: SinkState) => void;
}

const N = 600;
const CYCLE = 26; // seconds for one full A->D loop

const PHASE_NAME: Record<SinkPhase, string> = {
  A: 'Strive',
  B: 'Exploit',
  C: 'Stagnation',
  D: 'Death',
};

function phaseOf(t: number): SinkPhase {
  if (t < 0.15) return 'A';
  if (t < 0.45) return 'B';
  if (t < 0.7) return 'C';
  return 'D';
}

// Illustrative head-count tied to the published curve (founders -> ~2,200 -> die-off).
function populationOf(t: number): number {
  if (t < 0.15) return 8 + (t / 0.15) * 112; // 8 -> 120
  if (t < 0.45) return 120 + ((t - 0.15) / 0.3) * 2080; // 120 -> 2200
  if (t < 0.7) return 2200 - ((t - 0.45) / 0.25) * 120; // gentle plateau dip
  return Math.max(20, 2080 - ((t - 0.7) / 0.3) * 2040); // collapse -> ~40
}

// Spread radius of the live cloud per cycle position.
function radiusOf(t: number): number {
  if (t < 0.15) return 0.8 + (t / 0.15) * 1.2; // tight founders
  if (t < 0.45) return 2.0 + ((t - 0.15) / 0.3) * 4.0; // expand to ~6
  if (t < 0.7) return 6.0 - ((t - 0.45) / 0.25) * 3.5; // contract into the sink
  return 2.5 - ((t - 0.7) / 0.3) * 1.3; // dense, shrinking core
}

// Fraction of the population that withdraws to the outer shell (the beautiful ones).
function beautifulFracOf(t: number): number {
  if (t < 0.45) return 0;
  if (t < 0.7) return ((t - 0.45) / 0.25) * 0.25;
  return 0.25 + ((t - 0.7) / 0.3) * 0.2; // up to ~0.45
}

function makePoints() {
  const positions = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const dirs = new Float32Array(N * 3);
  const seeds = new Float32Array(N);
  const phaseOffsets = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    // Stable random unit direction per point.
    const u = Math.random() * 2 - 1;
    const theta = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    dirs[i * 3] = s * Math.cos(theta);
    dirs[i * 3 + 1] = s * Math.sin(theta);
    dirs[i * 3 + 2] = u;
    seeds[i] = Math.random();
    phaseOffsets[i] = Math.random() * Math.PI * 2;
    positions[i * 3] = dirs[i * 3] * 0.8;
    positions[i * 3 + 1] = dirs[i * 3 + 1] * 0.8;
    positions[i * 3 + 2] = dirs[i * 3 + 2] * 0.8;
  }
  return { positions, colors, dirs, seeds, phaseOffsets };
}

export function BehavioralSink({ color, onState }: BehavioralSinkProps) {
  const ref = useRef<Points>(null!);
  const lastReport = useRef(0);

  const { positions, colors, dirs, seeds, phaseOffsets } = useMemo(() => makePoints(), []);

  const base = useMemo(() => new Color(color), [color]);
  const pale = useMemo(() => new Color(color).lerp(new Color('#ffffff'), 0.7), [color]);
  const dead = useMemo(() => new Color('#3a3a44'), []);

  useFrame((state) => {
    const points = ref.current;
    if (!points) return;

    const elapsed = state.clock.elapsedTime;
    const t = (elapsed % CYCLE) / CYCLE;
    const phase = phaseOf(t);
    const radius = radiusOf(t);
    const beautifulFrac = beautifulFracOf(t);
    const dyingMix = phase === 'D' ? Math.min(1, (t - 0.7) / 0.3) : 0;
    const liveliness = phase === 'A' ? 0.4 : phase === 'B' ? 1 : phase === 'C' ? 0.45 : 0.08;

    const posAttr = points.geometry.attributes.position;
    const colAttr = points.geometry.attributes.color;
    const pos = posAttr.array as Float32Array;
    const col = colAttr.array as Float32Array;

    for (let i = 0; i < N; i++) {
      const ix = i * 3;
      const isBeautiful = seeds[i] < beautifulFrac;

      // Target radius: beautiful ones retreat to a quiet outer shell.
      const targetR = isBeautiful ? 7.2 + seeds[i] * 0.8 : radius;

      const jitter = isBeautiful
        ? 0
        : Math.sin(elapsed * (0.6 + seeds[i]) + phaseOffsets[i]) * 0.35 * liveliness;
      const r = targetR + jitter;

      const tx = dirs[ix] * r;
      const ty = dirs[ix + 1] * r;
      const tz = dirs[ix + 2] * r;

      // Ease toward target; beautiful/dying points settle (stop moving).
      const ease = isBeautiful ? 0.012 : 0.02 + 0.06 * liveliness;
      pos[ix] += (tx - pos[ix]) * ease;
      pos[ix + 1] += (ty - pos[ix + 1]) * ease;
      pos[ix + 2] += (tz - pos[ix + 2]) * ease;

      // Color: active -> base, withdrawn -> pale, whole field dims in death.
      let cr: number, cg: number, cb: number;
      if (isBeautiful) {
        cr = pale.r; cg = pale.g; cb = pale.b;
      } else {
        cr = base.r; cg = base.g; cb = base.b;
      }
      if (dyingMix > 0) {
        cr += (dead.r - cr) * dyingMix;
        cg += (dead.g - cg) * dyingMix;
        cb += (dead.b - cb) * dyingMix;
      }
      col[ix] = cr;
      col[ix + 1] = cg;
      col[ix + 2] = cb;
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    points.rotation.y = elapsed * 0.04;

    // Throttled state report for the DOM readout (~5/sec).
    if (onState && elapsed - lastReport.current > 0.2) {
      lastReport.current = elapsed;
      onState({ phase, phaseName: PHASE_NAME[phase], population: Math.round(populationOf(t)) });
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={N} args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" count={N} args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} vertexColors transparent opacity={0.92} sizeAttenuation />
    </points>
  );
}
