'use client';

import { useEffect, type RefObject } from 'react';
import { getPointer, subscribePointer } from './holdPointer';
import { specimenPose } from './specimenPose';
import { useReducedMotion } from './useReducedMotion';

const MAX_YAW = (35 * Math.PI) / 180;
const MAX_PITCH = (15 * Math.PI) / 180;
/** Rad/s. Low values give the turn its weight; critical damping keeps it from overshooting. */
const TURN_RATE = 3;
const FACE_RATE = 2.2;
/** A released touch, or a cursor that left the window, holds its last point this long. */
const LINGER_MS = 3000;
const REST = 1e-4;

type Spring = { x: number; v: number };

/** Exact critically damped step, stable at any frame time. */
function settle(spring: Spring, target: number, rate: number, dt: number) {
  const c1 = spring.x - target;
  const c2 = spring.v + rate * c1;
  const decay = Math.exp(-rate * dt);
  spring.x = target + (c1 + c2 * dt) * decay;
  spring.v = (c2 - rate * (c1 + c2 * dt)) * decay;
}

function clamp(value: number) {
  return Math.max(-1, Math.min(1, value));
}

/**
 * Writes `specimenPose.gaze`: the specimen turns toward the pointer, measured
 * from the centre of `specimen` on screen. While engaged, `face` stops the
 * turntable and turns the model to the viewer; idle, the turntable returns.
 */
export function useSpecimenGaze(specimen: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const gaze = specimenPose.gaze;
    const reset = () => { gaze.yaw = 0; gaze.pitch = 0; gaze.face = 0; };
    reset();
    if (reducedMotion) return reset;

    const yaw: Spring = { x: 0, v: 0 };
    const pitch: Spring = { x: 0, v: 0 };
    const face: Spring = { x: 0, v: 0 };
    let aim = { x: 0, y: 0 };
    let lastSeen = -Infinity;
    let frame = 0;
    let lastTime = 0;

    const step = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.1) : 0;
      lastTime = time;
      const engaged = getPointer().active || performance.now() - lastSeen < LINGER_MS;
      settle(yaw, engaged ? aim.x * MAX_YAW : 0, TURN_RATE, dt);
      settle(pitch, engaged ? aim.y * MAX_PITCH : 0, TURN_RATE, dt);
      settle(face, engaged ? 1 : 0, FACE_RATE, dt);
      gaze.yaw = yaw.x;
      gaze.pitch = pitch.x;
      gaze.face = Math.max(0, Math.min(1, face.x));
      const resting = !engaged && [yaw, pitch, face].every(s => Math.abs(s.x) < REST && Math.abs(s.v) < REST);
      if (resting) {
        reset();
        frame = 0;
        lastTime = 0;
        return;
      }
      frame = requestAnimationFrame(step);
    };

    const unsubscribe = subscribePointer(() => {
      const pointer = getPointer();
      const box = specimen.current?.getBoundingClientRect();
      if (pointer.active && box) {
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height / 2;
        aim = {
          x: clamp((pointer.x - cx) / (window.innerWidth / 2)),
          y: clamp((cy - pointer.y) / (window.innerHeight / 2)),
        };
      }
      lastSeen = performance.now();
      if (!frame) frame = requestAnimationFrame(step);
    });

    return () => {
      unsubscribe();
      if (frame) cancelAnimationFrame(frame);
      reset();
    };
  }, [specimen, reducedMotion]);
}
