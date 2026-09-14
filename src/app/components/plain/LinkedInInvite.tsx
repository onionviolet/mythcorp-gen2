'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './LinkedInInvite.module.css';

const IDLE_DELAY = 5000;
const APPROACH_DURATION = 2400;
const GLOW_DISTANCE = 240;
const MAGNET_DELAY = 900;
const MAGNET_DURATION = 3200;
const PET_WIDTH = 20;
const PET_HEIGHT = 18;
const PET_MARGIN = 8;
const POINTER_OFFSETS = [
  { x: 18, y: 18 }, { x: -38, y: 18 }, { x: 18, y: -36 }, { x: -38, y: -36 },
];
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, summary, [role="button"], [role="link"]';

type PetPhase = 'waiting' | 'approaching' | 'settled' | 'following';
type MotionProfile = { reduced: boolean; canFollow: boolean };
type Point = { x: number; y: number };

function boxesOverlap(point: Point, rect: DOMRect) {
  return point.x < rect.right + PET_MARGIN && point.x + PET_WIDTH > rect.left - PET_MARGIN
    && point.y < rect.bottom + PET_MARGIN && point.y + PET_HEIGHT > rect.top - PET_MARGIN;
}

function clampToViewport(point: Point): Point {
  return {
    x: Math.min(Math.max(PET_MARGIN, point.x), window.innerWidth - PET_WIDTH - PET_MARGIN),
    y: Math.min(Math.max(PET_MARGIN, point.y), window.innerHeight - PET_HEIGHT - PET_MARGIN),
  };
}

function clearOfControls(point: Point) {
  return !Array.from(document.querySelectorAll<HTMLElement>(INTERACTIVE_SELECTOR))
    .some((element) => boxesOverlap(point, element.getBoundingClientRect()));
}

function restingPoint(invite: HTMLAnchorElement): Point {
  const rect = invite.getBoundingClientRect();
  const candidates = [
    { x: rect.left - PET_WIDTH - PET_MARGIN, y: rect.top + (rect.height - PET_HEIGHT) / 2 },
    { x: rect.right + PET_MARGIN, y: rect.top + (rect.height - PET_HEIGHT) / 2 },
    { x: rect.left, y: rect.top - PET_HEIGHT - PET_MARGIN },
  ].map(clampToViewport);
  return candidates.find(clearOfControls) ?? candidates[0];
}

function followerPoint(pointer: Point, invite: HTMLAnchorElement): Point {
  const candidates = POINTER_OFFSETS.map(({ x, y }) =>
    clampToViewport({ x: pointer.x + x, y: pointer.y + y }));
  return candidates.find(clearOfControls) ?? restingPoint(invite);
}

function LinkedInPet({ phase, petRef }: {
  phase: PetPhase;
  petRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <span ref={petRef} aria-hidden data-linkedin-pet data-pet-phase={phase}
      className={`${styles.pet} ${styles[phase]}`}>
      <svg viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M4.5 13.5c0-4.15 3.1-7 8.2-7h4.2c3.7 0 6.6 2.2 6.6 5.5S20.7 17.5 17 17.5H9.8c-3.2 0-5.3-1.45-5.3-4Z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
        <path
          d="m7.25 7.1-.5-3.6 3.15 2.55M18.45 6.55l1.55-3.05.95 3.8M20.55 12.2h.01M14.35 12.2h.01M4.5 12.5c-1.5-.1-2.55-.75-3-1.8"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function MagneticCursor({ cursorRef, pulling }: {
  cursorRef: React.RefObject<HTMLSpanElement | null>;
  pulling: boolean;
}) {
  return (
    <span ref={cursorRef} aria-hidden data-magnetic-cursor
      className={`${styles.magneticCursor} ${pulling ? styles.pulling : ''}`}>
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
  const [pulling, setPulling] = useState(false);
  const [motionProfile, setMotionProfile] = useState<MotionProfile | null>(null);
  const inviteRef = useRef<HTMLAnchorElement>(null);
  const petRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const phaseRef = useRef<PetPhase>('waiting');
  const hasSettled = useRef(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateProfile = () => setMotionProfile({
      reduced: motionQuery.matches,
      canFollow: pointerQuery.matches,
    });
    updateProfile();
    motionQuery.addEventListener('change', updateProfile);
    pointerQuery.addEventListener('change', updateProfile);
    return () => {
      motionQuery.removeEventListener('change', updateProfile);
      pointerQuery.removeEventListener('change', updateProfile);
    };
  }, []);

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
    if (!motionProfile) return;
    let petFrame: number | undefined;
    let pullFrame: number | undefined;
    let pullTimer: number | undefined;
    let lastFrame = 0;
    let currentPoint: Point | null = null;
    let targetPoint: Point | null = null;
    let lastPointer: Point | null = null;
    let returning = false;

    const placePet = (point: Point) => petRef.current?.style.setProperty(
      'transform', `translate3d(${point.x}px, ${point.y}px, 0)`,
    );
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
      if (phaseRef.current === 'following') {
        phaseRef.current = 'settled';
        setPhase('settled');
      }
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

    const cancelPull = () => {
      window.clearTimeout(pullTimer);
      pullTimer = undefined;
      if (pullFrame !== undefined) window.cancelAnimationFrame(pullFrame);
      pullFrame = undefined;
      cursorRef.current?.style.removeProperty('transform');
      setPulling(false);
    };
    const startPull = () => {
      const invite = inviteRef.current;
      const cursor = cursorRef.current;
      if (!invite || !cursor || !lastPointer || motionProfile.reduced
          || !motionProfile.canFollow || document.visibilityState !== 'visible') return;
      const from = lastPointer;
      const rect = invite.getBoundingClientRect();
      const to = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      if (Math.hypot(to.x - from.x, to.y - from.y) < 12) return;
      const started = performance.now();
      setPulling(true);
      returnPet();
      const draw = (time: number) => {
        const progress = Math.min(1, (time - started) / MAGNET_DURATION);
        const eased = progress * progress * (3 - 2 * progress);
        const point = {
          x: from.x + (to.x - from.x) * eased,
          y: from.y + (to.y - from.y) * eased,
        };
        cursor.style.setProperty('transform', `translate3d(${point.x}px, ${point.y}px, 0)`);
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
    const parkAll = () => {
      cancelPull();
      settlePet();
      lastPointer = null;
      applyGlow(null);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || document.visibilityState !== 'visible') {
        parkAll();
        return;
      }
      const invite = inviteRef.current;
      if (!invite) return;
      cancelPull();
      lastPointer = { x: event.clientX, y: event.clientY };
      applyGlow(lastPointer);
      schedulePull();
      if (!motionProfile.canFollow || motionProfile.reduced
          || phaseRef.current === 'waiting' || phaseRef.current === 'approaching') return;
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
    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', parkAll);
    window.addEventListener('resize', parkAll);
    window.addEventListener('scroll', parkAll, { passive: true });
    return () => {
      stopPet();
      cancelPull();
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', parkAll);
      window.removeEventListener('resize', parkAll);
      window.removeEventListener('scroll', parkAll);
    };
  }, [motionProfile]);

  const pulseEnabled = motionProfile?.reduced === false;
  const following = phase === 'following' && motionProfile?.canFollow === true
    && !motionProfile.reduced;

  return (
    <a ref={inviteRef} href="https://www.linkedin.com/in/0w0/" target="_blank"
      rel="me noopener noreferrer" title="Operator profile: 0w0 (opens in a new tab)"
      data-linkedin-invite data-pointer-near={pointerNear ? 'true' : 'false'}
      data-pulse-enabled={pulseEnabled ? 'true' : 'false'}
      data-following={following ? 'true' : 'false'}
      data-magnetic-pull={pulling ? 'true' : 'false'}
      className={`${styles.invite} mb-2 flex min-h-11 w-fit items-center gap-3 px-3
                  text-[13px] normal-case font-medium tracking-normal text-[color:var(--fg)]`}>
      <LinkedInPet phase={phase} petRef={petRef} />
      <MagneticCursor cursorRef={cursorRef} pulling={pulling} />
      <span className={styles.linkedInMark} aria-hidden data-linkedin-mark>in</span>
      <span className={styles.label}>Find me on LinkedIn</span>
      <span className={styles.exitArrow} aria-hidden data-linkedin-arrow>↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
