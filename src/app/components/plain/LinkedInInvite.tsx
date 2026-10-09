'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import type { CSSProperties } from 'react';
import styles from './LinkedInInvite.module.css';
import { reportVisibleMovement } from './fieldActivity';
import { HOLD_SCENE_CHANGE_EVENT } from './holdSceneEvents';
import { getGatherAmount, subscribeGather } from './holdGather';
import { chicagoSky, subscribeSky } from './sky/skyState';
import { setGazeLure } from './useSpecimenGaze';
import {
  easeSkyHome, easeSkyOffset, getSkyOffset, setSkyOffset, skyTouched, stopSkyEase,
} from './skyTime';
import {
  HORIZON_DEMO_NUDGE_MS, HORIZON_DEMO_PUSH_MS, horizonDemoPose, planHorizonDemo, smoothstep,
} from './catHorizonDemo';

const IDLE_DELAY = 5000;
const APPROACH_DURATION = 2400;
const GLOW_DISTANCE = 240;
const MAGNET_DELAY = 900;
const MAGNET_DURATION = 3200;
const PET_MARGIN = 8;
/** Matches `.pet`'s box; a coarse pointer gets the larger cat. */
const FINE_PET = { width: 20, height: 18 };
const COARSE_PET = { width: 24, height: 21 };
let petBox = FINE_PET;
/** A settled cat waits this long, with the mouse quiet, before its demo. */
const DEMO_SETTLE_DELAY = 2500;
const DEMO_POINTER_QUIET = 2000;
/** Touch has no follow, so the demo starts on a clock from load. */
const DEMO_TOUCH_DELAY = 4000;
const DEMO_POLL = 400;
/** Feet on the line: the body's bottom edge sits this far down the box. */
const PET_FOOT = 0.88;
let horizonDemoPlayed = false;
const POINTER_OFFSETS = [
  { x: 18, y: 18 }, { x: -38, y: 18 }, { x: 18, y: -36 }, { x: -38, y: -36 },
];
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, summary, [role="button"], [role="link"]';

type PetPhase = 'waiting' | 'approaching' | 'settled' | 'following' | 'demo';

/** Civil twilight: below this, Chicago is dark and a resting cat sleeps. */
const NIGHT_ELEVATION = -6;
/** Gather amount past which the cat crouches with its ears back. */
const CROUCH_GATHER = 0.4;

/** Chicago's sun as a tiny cast shadow, quantised so it only re-renders on a
 *  visible change. Longer when the sun is low, gone at night. */
function sunShadowKey(): string {
  const { elevation, azimuth } = chicagoSky();
  if (elevation <= 0) return '0|0|0';
  const length = Math.min(6, 1 / Math.tan(Math.max(elevation, 8) * Math.PI / 180));
  const x = Math.sin(azimuth * Math.PI / 180) * length;
  const strength = Math.min(1, elevation / 6);
  return `${Math.round(x * 2) / 2}|${Math.round(length * 0.6 * 2) / 2}|${Math.round(strength * 4) / 4}`;
}

function isNight(): boolean {
  return chicagoSky().elevation < NIGHT_ELEVATION;
}

function isCrouching(): boolean {
  return getGatherAmount() > CROUCH_GATHER;
}
type CursorMode = 'hidden' | 'pulling' | 'returning';
type MotionProfile = { reduced: boolean; canFollow: boolean };
type Point = { x: number; y: number };

function boxesOverlap(point: Point, rect: DOMRect) {
  return point.x < rect.right + PET_MARGIN && point.x + petBox.width > rect.left - PET_MARGIN
    && point.y < rect.bottom + PET_MARGIN && point.y + petBox.height > rect.top - PET_MARGIN;
}

function clampToViewport(point: Point): Point {
  return {
    x: Math.min(Math.max(PET_MARGIN, point.x), window.innerWidth - petBox.width - PET_MARGIN),
    y: Math.min(Math.max(PET_MARGIN, point.y), window.innerHeight - petBox.height - PET_MARGIN),
  };
}

function clearOfControls(point: Point) {
  return !Array.from(document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR))
    .some((element) => boxesOverlap(point, element.getBoundingClientRect()));
}

function restingPoint(invite: HTMLAnchorElement): Point {
  const rect = invite.getBoundingClientRect();
  const candidates = [
    { x: rect.left - petBox.width - PET_MARGIN, y: rect.top + (rect.height - petBox.height) / 2 },
    { x: rect.right + PET_MARGIN, y: rect.top + (rect.height - petBox.height) / 2 },
    { x: rect.left, y: rect.top - petBox.height - PET_MARGIN },
  ].map(clampToViewport);
  return candidates.find(clearOfControls) ?? candidates[0];
}

function inViewport(point: Point) {
  return point.x >= PET_MARGIN && point.y >= PET_MARGIN
    && point.x + petBox.width <= window.innerWidth - PET_MARGIN
    && point.y + petBox.height <= window.innerHeight - PET_MARGIN;
}

function demoSpotClear(point: Point) {
  return inViewport(point) && clearOfControls(point);
}

/** The halo line's client y, read from HorizonDrag's band, which sits on
 *  `useViewerHorizon().offset` above the lander's bottom edge. */
function horizonLineTop(): number | null {
  const band = document.querySelector<HTMLElement>('[data-horizon-drag]');
  const rect = band?.getBoundingClientRect();
  if (!rect || rect.height === 0) return null;
  return rect.top + rect.height / 2 - petBox.height * PET_FOOT;
}

function followerPoint(pointer: Point, invite: HTMLAnchorElement): Point {
  const candidates = POINTER_OFFSETS.map(({ x, y }) =>
    clampToViewport({ x: pointer.x + x, y: pointer.y + y }));
  return candidates.find(clearOfControls) ?? restingPoint(invite);
}

function LinkedInPet({ phase, petRef, reactionActive, reactionSequence, onReactionEnd, asleep, crouching }: {
  phase: PetPhase;
  asleep: boolean;
  crouching: boolean;
  petRef: React.RefObject<HTMLSpanElement | null>;
  reactionActive: boolean;
  reactionSequence: number;
  onReactionEnd: () => void;
}) {
  return (
    <span ref={petRef} aria-hidden data-linkedin-pet data-pet-phase={phase}
      data-pet-reaction={reactionActive ? 'active' : 'idle'}
      data-pet-asleep={asleep ? 'true' : undefined}
      data-pet-crouch={crouching ? 'true' : undefined}
      className={`${styles.pet} ${styles[phase]}`}>
      <svg viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.5 13.5c0-4.15 3.1-7 8.2-7h4.2c3.7 0 6.6 2.2 6.6 5.5S20.7 17.5 17 17.5H9.8c-3.2 0-5.3-1.45-5.3-4Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <g key={reactionSequence} className={reactionActive ? styles.petReaction : undefined}
          onAnimationEnd={onReactionEnd}>
          <path d="m7.25 7.1-.5-3.6 3.15 2.55M18.45 6.55l1.55-3.05.95 3.8"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <path d={asleep
          ? 'M19.7 12.4c.4.35.9.35 1.3 0M13.5 12.4c.4.35.9.35 1.3 0M4.5 12.5c-1.5-.1-2.55-.75-3-1.8'
          : 'M20.55 12.2h.01M14.35 12.2h.01M4.5 12.5c-1.5-.1-2.55-.75-3-1.8'}
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path className={styles.petPaw} d="M21.6 17.1 25.9 18.7"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function MagneticCursor({ cursorRef, visible }: {
  cursorRef: React.RefObject<HTMLSpanElement | null>;
  visible: boolean;
}) {
  return (
    <span ref={cursorRef} aria-hidden data-magnetic-cursor
      className={`${styles.magneticCursor} ${visible ? styles.pulling : ''}`}>
      <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.5 1.5v14l4-3.6 3.2 6.6 2.5-1.25-3.15-6.45H14L1.5 1.5Z"
          fill="var(--bg)" stroke="currentColor" strokeWidth="1.25"
          strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function LinkedInInvite() {
  const [phase, setPhase] = useState<PetPhase>('waiting');
  const [pointerNear, setPointerNear] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('hidden');
  const [motionProfile, setMotionProfile] = useState<MotionProfile | null>(null);
  const [reactionActive, setReactionActive] = useState(false);
  const [reactionSequence, setReactionSequence] = useState(0);
  const inviteRef = useRef<HTMLAnchorElement>(null);
  const petRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<PetPhase>('waiting');
  const hasSettled = useRef(false);
  const settledAt = useRef(0);
  const night = useSyncExternalStore(subscribeSky, isNight, () => false);
  const crouching = useSyncExternalStore(subscribeGather, isCrouching, () => false);
  const shadow = useSyncExternalStore(subscribeSky, sunShadowKey, () => '0|0|0');

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const coarseQuery = window.matchMedia('(pointer: coarse)');
    const updateProfile = () => {
      petBox = coarseQuery.matches ? COARSE_PET : FINE_PET;
      setMotionProfile({ reduced: motionQuery.matches, canFollow: pointerQuery.matches });
    };
    updateProfile();
    motionQuery.addEventListener('change', updateProfile);
    pointerQuery.addEventListener('change', updateProfile);
    coarseQuery.addEventListener('change', updateProfile);
    return () => {
      motionQuery.removeEventListener('change', updateProfile);
      pointerQuery.removeEventListener('change', updateProfile);
      coarseQuery.removeEventListener('change', updateProfile);
    };
  }, []);

  useEffect(() => {
    if (phase === 'settled') settledAt.current = performance.now();
  }, [phase]);

  useEffect(() => {
    const resetReaction = () => setReactionActive(false);
    if (motionProfile?.reduced) resetReaction();
    const reactToSceneChange = () => {
      if (!motionProfile || motionProfile.reduced || document.visibilityState !== 'visible') {
        resetReaction();
        return;
      }
      setReactionSequence((current) => current + 1);
      setReactionActive(true);
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') resetReaction();
    };

    window.addEventListener(HOLD_SCENE_CHANGE_EVENT, reactToSceneChange);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener(HOLD_SCENE_CHANGE_EVENT, reactToSceneChange);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [motionProfile]);

  useEffect(() => {
    if (!crouching || !motionProfile || motionProfile.reduced) return;
    setReactionSequence((current) => current + 1);
    setReactionActive(true);
  }, [crouching, motionProfile]);

  useEffect(() => {
    if (!motionProfile) return;
    const settle = () => {
      hasSettled.current = true;
      phaseRef.current = 'settled';
      setPhase('settled');
    };
    if (motionProfile.reduced) {
      settle();
      return;
    }

    let idleTimer: number | undefined;
    let settleTimer: number | undefined;
    const schedule = () => {
      if (hasSettled.current || document.visibilityState !== 'visible') return;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        if (document.visibilityState === 'visible' && !hasSettled.current) {
          phaseRef.current = 'approaching';
          setPhase('approaching');
          settleTimer = window.setTimeout(settle, APPROACH_DURATION);
        }
      }, IDLE_DELAY);
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        window.clearTimeout(idleTimer);
        window.clearTimeout(settleTimer);
        if (phaseRef.current === 'approaching') settle();
      } else {
        schedule();
      }
    };
    schedule();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.clearTimeout(idleTimer);
      window.clearTimeout(settleTimer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [motionProfile]);

  useEffect(() => {
    if (phase !== 'approaching' || motionProfile?.reduced) return;
    let frame = 0;
    const sampleCat = (time: number) => {
      const rect = petRef.current?.getBoundingClientRect();
      if (rect) reportVisibleMovement('cat', rect.left, rect.top, time);
      frame = window.requestAnimationFrame(sampleCat);
    };
    frame = window.requestAnimationFrame(sampleCat);
    return () => window.cancelAnimationFrame(frame);
  }, [phase, motionProfile?.reduced]);

  useEffect(() => {
    if (!motionProfile) return;
    let petFrame: number | undefined;
    let pullFrame: number | undefined;
    let returnFrame: number | undefined;
    let pullTimer: number | undefined;
    let lastFrame = 0;
    let returnLastFrame = 0;
    let currentPoint: Point | null = null;
    let targetPoint: Point | null = null;
    let lastPointer: Point | null = null;
    let cursorPoint: Point | null = null;
    let cursorReturnTarget: Point | null = null;
    let returning = false;
    let demoFrame: number | undefined;
    let demoPoll: number | undefined;
    let lastMouseAt = -Infinity;

    const placePet = (point: Point) => {
      petRef.current?.style.setProperty('transform', `translate3d(${point.x}px, ${point.y}px, 0)`);
      reportVisibleMovement('cat', point.x, point.y);
    };
    const stopPet = () => {
      if (petFrame !== undefined) window.cancelAnimationFrame(petFrame);
      petFrame = undefined;
      lastFrame = 0;
    };
    const settlePet = () => {
      stopPet();
      targetPoint = null;
      currentPoint = null;
      returning = false;
      petRef.current?.style.removeProperty('transform');
      if (phaseRef.current === 'following' || phaseRef.current === 'demo') {
        phaseRef.current = 'settled';
        setPhase('settled');
      }
    };
    const setGait = (gait: string | null, facing: string | null) => {
      const pet = petRef.current;
      if (!pet) return;
      if (gait) pet.setAttribute('data-pet-gait', gait);
      else pet.removeAttribute('data-pet-gait');
      if (facing) pet.setAttribute('data-pet-facing', facing);
      else pet.removeAttribute('data-pet-facing');
    };

    const applyGlow = (point: Point | null) => {
      const invite = inviteRef.current;
      if (!invite) return;
      let strength = 0;
      if (point) {
        const rect = invite.getBoundingClientRect();
        const dx = Math.max(rect.left - point.x, 0, point.x - rect.right);
        const dy = Math.max(rect.top - point.y, 0, point.y - rect.bottom);
        const linear = Math.max(0, 1 - Math.hypot(dx, dy) / GLOW_DISTANCE);
        strength = linear * linear * (3 - 2 * linear);
      }
      invite.style.setProperty('--linkedin-glow-radius', `${14 + strength * 38}px`);
      invite.style.setProperty('--linkedin-glow-spread', `${-9 + strength * 8}px`);
      invite.style.setProperty('--linkedin-glow-core-radius', `${4 + strength * 18}px`);
      invite.style.setProperty('--linkedin-glow-core-spread', `${-4 + strength * 3}px`);
      invite.style.setProperty('--linkedin-glow-ring', `${strength * 3}px`);
      invite.style.setProperty('--linkedin-pulse-opacity', `${0.28 * (1 - strength * 0.86)}`);
      invite.style.setProperty('--linkedin-arrow-shift', `${strength * 4}px`);
      invite.setAttribute('data-proximity', strength.toFixed(3));
      const near = strength > 0.01;
      setPointerNear((current) => current === near ? current : near);
    };

    const hideCursor = () => {
      if (returnFrame !== undefined) window.cancelAnimationFrame(returnFrame);
      returnFrame = undefined;
      returnLastFrame = 0;
      cursorPoint = null;
      cursorReturnTarget = null;
      cursorRef.current?.style.removeProperty('transform');
      setGazeLure(null);
      setCursorMode('hidden');
    };
    const stopPull = () => {
      window.clearTimeout(pullTimer);
      pullTimer = undefined;
      if (pullFrame !== undefined) window.cancelAnimationFrame(pullFrame);
      pullFrame = undefined;
    };
    const returnCursor = (target: Point) => {
      stopPull();
      if (!cursorPoint) return;
      cursorReturnTarget = target;
      setGazeLure(null);
      setCursorMode('returning');
      if (returnFrame !== undefined) return;
      const drawReturn = (time: number) => {
        if (!cursorPoint || !cursorReturnTarget) {
          hideCursor();
          return;
        }
        const seconds = returnLastFrame ? Math.min((time - returnLastFrame) / 1000, 0.05) : 1 / 60;
        const ease = 1 - Math.exp(-3.2 * seconds);
        cursorPoint = {
          x: cursorPoint.x + (cursorReturnTarget.x - cursorPoint.x) * ease,
          y: cursorPoint.y + (cursorReturnTarget.y - cursorPoint.y) * ease,
        };
        cursorRef.current?.style.setProperty(
          'transform', `translate3d(${cursorPoint.x}px, ${cursorPoint.y}px, 0)`,
        );
        reportVisibleMovement('cursor-echo', cursorPoint.x, cursorPoint.y, time);
        applyGlow(cursorPoint);
        returnLastFrame = time;
        if (Math.hypot(
          cursorReturnTarget.x - cursorPoint.x,
          cursorReturnTarget.y - cursorPoint.y,
        ) > 1) {
          returnFrame = window.requestAnimationFrame(drawReturn);
        } else {
          const settledAt = cursorReturnTarget;
          hideCursor();
          applyGlow(settledAt);
        }
      };
      returnFrame = window.requestAnimationFrame(drawReturn);
    };
    const startPull = () => {
      const invite = inviteRef.current;
      const cursor = cursorRef.current;
      if (!invite || !cursor || !lastPointer || motionProfile.reduced
          || !motionProfile.canFollow || document.visibilityState !== 'visible') return;
      if (returnFrame !== undefined) window.cancelAnimationFrame(returnFrame);
      returnFrame = undefined;
      returnLastFrame = 0;
      const from = cursorPoint ?? lastPointer;
      const rect = invite.getBoundingClientRect();
      const to = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      if (Math.hypot(to.x - from.x, to.y - from.y) < 12) return;
      const started = performance.now();
      cursorPoint = from;
      cursorReturnTarget = null;
      setCursorMode('pulling');
      returnPet();
      const draw = (time: number) => {
        const progress = Math.min(1, (time - started) / MAGNET_DURATION);
        const eased = progress * progress * (3 - 2 * progress);
        const point = {
          x: from.x + (to.x - from.x) * eased,
          y: from.y + (to.y - from.y) * eased,
        };
        cursorPoint = point;
        cursor.style.setProperty('transform', `translate3d(${point.x}px, ${point.y}px, 0)`);
        setGazeLure(point);
        reportVisibleMovement('cursor-echo', point.x, point.y, time);
        applyGlow(point);
        if (progress < 1) pullFrame = window.requestAnimationFrame(draw);
        else pullFrame = undefined;
      };
      pullFrame = window.requestAnimationFrame(draw);
    };
    const schedulePull = () => {
      window.clearTimeout(pullTimer);
      pullTimer = window.setTimeout(startPull, MAGNET_DELAY);
    };

    const animatePet = (time: number) => {
      if (document.visibilityState !== 'visible' || !currentPoint || !targetPoint) {
        settlePet();
        return;
      }
      const seconds = lastFrame ? Math.min((time - lastFrame) / 1000, 0.05) : 1 / 60;
      const ease = 1 - Math.exp(-(returning ? 3.2 : 12) * seconds);
      const nextPoint = {
        x: currentPoint.x + (targetPoint.x - currentPoint.x) * ease,
        y: currentPoint.y + (targetPoint.y - currentPoint.y) * ease,
      };
      if (returning || clearOfControls(nextPoint)) currentPoint = nextPoint;
      placePet(currentPoint);
      lastFrame = time;
      if (Math.hypot(targetPoint.x - currentPoint.x, targetPoint.y - currentPoint.y) > 0.2) {
        petFrame = window.requestAnimationFrame(animatePet);
      } else if (returning) {
        settlePet();
      } else {
        currentPoint = targetPoint;
        placePet(currentPoint);
        stopPet();
      }
    };
    const moveToward = (point: Point) => {
      returning = false;
      targetPoint = point;
      if (!currentPoint) {
        currentPoint = point;
        placePet(point);
      }
      if (petFrame === undefined) petFrame = window.requestAnimationFrame(animatePet);
    };
    const returnPet = () => {
      const invite = inviteRef.current;
      if (!invite || phaseRef.current !== 'following' || !currentPoint) return;
      returning = true;
      targetPoint = restingPoint(invite);
      if (petFrame === undefined) petFrame = window.requestAnimationFrame(animatePet);
    };
    const endDemo = () => {
      if (demoFrame !== undefined) window.cancelAnimationFrame(demoFrame);
      demoFrame = undefined;
      window.removeEventListener('pointerdown', cancelDemo, true);
      window.removeEventListener('keydown', cancelDemo, true);
      setGait(null, null);
    };
    const cancelDemo = (event?: Event) => {
      if (demoFrame === undefined) return;
      endDemo();
      const target = event?.target instanceof Element ? event.target : null;
      const visible = document.visibilityState === 'visible';
      stopSkyEase();
      if (!visible) setSkyOffset(0);
      else if (!target?.closest('[data-horizon-drag]') && getSkyOffset() !== 0) easeSkyHome();
      const invite = inviteRef.current;
      if (!invite || !currentPoint || !visible) {
        settlePet();
        return;
      }
      returning = true;
      targetPoint = restingPoint(invite);
      if (petFrame === undefined) petFrame = window.requestAnimationFrame(animatePet);
    };
    const startDemo = () => {
      const invite = inviteRef.current;
      const pet = petRef.current;
      const lineTop = horizonLineTop();
      if (!invite || !pet || lineTop === null) return;
      const rect = pet.getBoundingClientRect();
      const start = { x: rect.left, y: rect.top };
      const plan = planHorizonDemo(start, restingPoint(invite), lineTop, demoSpotClear);
      if (!plan) return;
      horizonDemoPlayed = true;
      hasSettled.current = true;
      window.clearInterval(demoPoll);
      stopPet();
      returning = false;
      targetPoint = null;
      currentPoint = start;
      phaseRef.current = 'demo';
      flushSync(() => setPhase('demo'));
      placePet(start);
      window.addEventListener('pointerdown', cancelDemo, { capture: true, passive: true });
      window.addEventListener('keydown', cancelDemo, true);
      let elapsed = 0;
      let lastStep: number | undefined;
      let pushed = false;
      let released = false;
      const step = (time: number) => {
        elapsed += lastStep === undefined ? 0 : Math.min(time - lastStep, 50);
        lastStep = time;
        const pose = horizonDemoPose(elapsed, plan, horizonLineTop() ?? lineTop);
        if (pose.stage === 'done') {
          endDemo();
          settlePet();
          return;
        }
        if (pose.stage === 'push' && !pushed) {
          pushed = true;
          easeSkyOffset(HORIZON_DEMO_NUDGE_MS, HORIZON_DEMO_PUSH_MS, smoothstep);
        }
        if ((pose.stage === 'release' || pose.stage === 'home') && !released) {
          released = true;
          easeSkyHome();
        }
        currentPoint = pose.point;
        placePet(pose.point);
        setGait(pose.gait, pose.facing);
        demoFrame = window.requestAnimationFrame(step);
      };
      demoFrame = window.requestAnimationFrame(step);
    };
    const demoReady = () => {
      if (horizonDemoPlayed || motionProfile.reduced || demoFrame !== undefined
          || document.visibilityState !== 'visible' || skyTouched() || getGatherAmount() !== 0) return false;
      const now = performance.now();
      if (motionProfile.canFollow) {
        return phaseRef.current === 'settled' && now - settledAt.current >= DEMO_SETTLE_DELAY
          && now - lastMouseAt >= DEMO_POINTER_QUIET;
      }
      return (phaseRef.current === 'waiting' || phaseRef.current === 'settled') && now >= DEMO_TOUCH_DELAY;
    };

    const parkAll = (keepCat = false) => {
      cancelDemo();
      stopPull();
      hideCursor();
      if (!keepCat) settlePet();
      lastPointer = null;
      applyGlow(null);
    };
    const parkEverything = () => parkAll();
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || document.visibilityState !== 'visible') {
        parkAll(phaseRef.current === 'demo' && document.visibilityState === 'visible');
        return;
      }
      lastMouseAt = performance.now();
      const invite = inviteRef.current;
      if (!invite) return;
      const pointer = { x: event.clientX, y: event.clientY };
      if (cursorPoint) returnCursor(pointer);
      else stopPull();
      lastPointer = pointer;
      applyGlow(lastPointer);
      schedulePull();
      if (!motionProfile.canFollow || motionProfile.reduced || phaseRef.current === 'waiting'
          || phaseRef.current === 'approaching' || phaseRef.current === 'demo') return;
      const pointerTarget = event.target instanceof Element ? event.target : null;
      if (pointerTarget?.closest(INTERACTIVE_SELECTOR)) {
        returnPet();
        return;
      }
      if (phaseRef.current === 'settled') {
        phaseRef.current = 'following';
        setPhase('following');
        currentPoint = restingPoint(invite);
        placePet(currentPoint);
      }
      moveToward(followerPoint({ x: event.clientX, y: event.clientY }, invite));
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') parkAll();
    };
    if (!motionProfile.canFollow || motionProfile.reduced) parkAll();
    if (!motionProfile.reduced && !horizonDemoPlayed) {
      demoPoll = window.setInterval(() => {
        if (demoReady()) startDemo();
      }, DEMO_POLL);
    }
    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', parkEverything);
    window.addEventListener('resize', parkEverything);
    window.addEventListener('scroll', parkEverything, { passive: true });
    return () => {
      window.clearInterval(demoPoll);
      if (demoFrame !== undefined) {
        endDemo();
        stopSkyEase();
        setSkyOffset(0);
      }
      stopPet();
      stopPull();
      hideCursor();
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', parkEverything);
      window.removeEventListener('resize', parkEverything);
      window.removeEventListener('scroll', parkEverything);
    };
  }, [motionProfile]);

  const pulseEnabled = motionProfile?.reduced === false;
  const following = phase === 'following' && motionProfile?.canFollow === true
    && !motionProfile.reduced;
  const cursorVisible = cursorMode !== 'hidden';
  const [shadowX, shadowY, shadowStrength] = shadow.split('|').map(Number);
  const sunShadow = {
    '--sun-shadow-x': `${shadowX}px`,
    '--sun-shadow-y': `${shadowY}px`,
    '--sun-shadow-opacity': `${Math.round(shadowStrength * 35)}%`,
  } as CSSProperties;

  return (
    <a ref={inviteRef} href="https://www.linkedin.com/in/0w0/" target="_blank"
      rel="me noopener noreferrer" title="Operator profile: 0w0 (opens in a new tab)"
      data-linkedin-invite data-pointer-near={pointerNear ? 'true' : 'false'}
      data-pulse-enabled={pulseEnabled ? 'true' : 'false'}
      data-following={following ? 'true' : 'false'}
      data-magnetic-pull={cursorMode === 'pulling' ? 'true' : 'false'}
      data-magnetic-return={cursorMode === 'returning' ? 'true' : 'false'}
      style={sunShadow}
      className={`${styles.invite} mb-2 flex min-h-11 w-fit items-center gap-3 px-3
                  text-[13px] normal-case font-medium tracking-normal text-[color:var(--fg)]`}>
      <LinkedInPet
        phase={phase}
        petRef={petRef}
        reactionActive={reactionActive}
        reactionSequence={reactionSequence}
        onReactionEnd={() => setReactionActive(false)}
        asleep={night && phase === 'settled'}
        crouching={crouching && motionProfile?.reduced === false}
      />
      <MagneticCursor cursorRef={cursorRef} visible={cursorVisible} />
      <span className={styles.linkedInMark} aria-hidden data-linkedin-mark>in</span>
      <span className={styles.label}>Find me on LinkedIn</span>
      <span className={styles.exitArrow} aria-hidden data-linkedin-arrow>↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
