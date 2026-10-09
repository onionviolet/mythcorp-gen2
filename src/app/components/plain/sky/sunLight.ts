'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { DEFAULT_SPECIMEN_POSE, specimenPose } from '../specimenPose';
import { moonIllumination } from './solarPosition';
import { chicagoSky, subscribeSky, viewerSky, type SkyState } from './skyState';

const RAD = Math.PI / 180;
const MOON_DIR: [number, number, number] = [0.38, 0.72, 0.58];
/** The sun's depth component is fixed toward the viewer: a visitor facing
 *  south would otherwise see the noon specimen lit only from behind. */
const SUN_DEPTH = 0.55;

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function normalize(v: [number, number, number]): [number, number, number] {
  const length = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / length, v[1] / length, v[2] / length];
}

/** View faces south: east is screen left, west screen right, a high sun a high light. */
export function writeSkyToPose(sky: SkyState): void {
  const el = Math.max(sky.elevation, -4) * RAD;
  const az = sky.azimuth * RAD;
  const sun = normalize([-Math.cos(el) * Math.sin(az), Math.sin(el), SUN_DEPTH]);
  const day = smoothstep(-8, 4, sky.elevation);
  const moon = 0.15 + 0.45 * moonIllumination(sky.moonPhase);
  specimenPose.key.dir = normalize([
    MOON_DIR[0] + (sun[0] - MOON_DIR[0]) * day,
    MOON_DIR[1] + (sun[1] - MOON_DIR[1]) * day,
    MOON_DIR[2] + (sun[2] - MOON_DIR[2]) * day,
  ]);
  specimenPose.key.intensity = moon + (1 - moon) * day;
  specimenPose.ambient = 0.28 + 0.17 * day;
}

/** Chicago's sun lights the specimen. Writes on each sky minute and on every
 *  horizon drag event; restores the neutral pose on unmount. */
export function useChicagoSunLight(): void {
  useEffect(() => {
    const write = () => writeSkyToPose(chicagoSky());
    write();
    const unsubscribe = subscribeSky(write);
    return () => {
      unsubscribe();
      specimenPose.key = structuredClone(DEFAULT_SPECIMEN_POSE.key);
      specimenPose.ambient = DEFAULT_SPECIMEN_POSE.ambient;
    };
  }, []);
}

export type HorizonLook = {
  offset: number;
  core: number;
  glow: number;
  thickness: number;
  /** Paper only: 0 is a solid rule, 1 a dotted one. */
  dash: number;
};

/** The viewer's sun as the halo line: highest and brightest at noon, a thin
 *  ember at dusk, nearly dark at night with a trace of moon. On paper the
 *  same sun is a graphite rule: heaviest at noon, a hairline at dusk, a
 *  dotted hairline at night. */
export function horizonFor(sky: SkyState, paper = false): HorizonLook {
  const el = Math.min(65, Math.max(-15, sky.elevation));
  const night = 0.02 + 0.04 * moonIllumination(sky.moonPhase);
  const brightness = el < 0
    ? night + (0.12 - night) * smoothstep(-12, 0, el)
    : 0.12 + 0.88 * smoothstep(0, 50, el);
  const offset = Math.round(110 + 190 * (el / 65));
  if (paper) {
    return {
      offset,
      core: 0.55 + 0.4 * brightness,
      glow: 0.6 * brightness,
      thickness: 1 + 1.5 * brightness,
      dash: 1 - smoothstep(0.07, 0.11, brightness),
    };
  }
  return {
    offset,
    core: 0.8 * brightness,
    glow: 1.2 * brightness,
    thickness: 1 + 3 * brightness,
    dash: 0,
  };
}

function horizonKey(): string {
  const sky = viewerSky();
  return `${Math.round(sky.elevation * 4) / 4}|${Math.round(sky.moonPhase * 50) / 50}`;
}

/** Re-renders only when the viewer's quarter-degree sun changes. */
export function useViewerHorizon(paper = false): HorizonLook | null {
  const key = useSyncExternalStore(subscribeSky, horizonKey, () => '');
  if (!key) return null;
  const [elevation, moonPhase] = key.split('|').map(Number);
  return horizonFor({ elevation, azimuth: 180, moonPhase }, paper);
}
