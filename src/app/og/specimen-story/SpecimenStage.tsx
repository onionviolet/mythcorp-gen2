'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject, RefObject } from 'react';
import * as THREE from 'three';
import { useTokenInk } from '../../wc/lab/canvas/_components/tokenInk';
import type { TokenInk } from '../../wc/lab/canvas/_components/tokenInk';
import { STORY_STEPS, blendAt } from './storyData';
import type { Treatment } from './storyData';
import { fitSpectre } from '../spectreFit';

useGLTF.preload('/spectre.glb');

export type StageTelemetry = {
  step: number;
  azimuth: number;
  elevation: number;
  distance: number;
  movement: number;
};

type StageState = {
  treatment: Treatment;
  field: number;
  actors: number;
  halo: number;
  movement: number;
};

const FLOOR_Y = -0.5;
const EMIT_EVERY_S = 0.12;
const RELEASE_S = 1.2;
const ATTACK_S = 0.045;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const toRad = (deg: number) => (deg * Math.PI) / 180;

function Specimen({ ink, state }: { ink: TokenInk; state: MutableRefObject<StageState> }) {
  const { scene } = useGLTF('/spectre.glb');
  const applied = useRef<Treatment | null>(null);

  const { model, scale, offset, meshes } = useMemo(() => {
    const { model, size, center } = fitSpectre(scene);
    const found: THREE.Mesh[] = [];
    model.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.frustumCulled = false;
        found.push(mesh);
      }
    });
    return {
      model,
      scale: 1 / (size.y || 1),
      offset: center.multiplyScalar(-1).toArray() as [number, number, number],
      meshes: found,
    };
  }, [scene]);

  const materials = useMemo(
    () => ({
      veil: new THREE.MeshBasicMaterial({ color: ink['--fg'], transparent: true, opacity: 0.2, depthWrite: false }),
      solid: new THREE.MeshStandardMaterial({ color: ink['--fg'], roughness: 0.78, metalness: 0 }),
      flat: new THREE.MeshLambertMaterial({ color: ink['--fg'], flatShading: true }),
      wire: new THREE.MeshBasicMaterial({ color: ink['--accent'], wireframe: true }),
      gloss: new THREE.MeshPhysicalMaterial({ color: ink['--fg'], roughness: 0.1, metalness: 0.15, clearcoat: 1 }),
    }),
    [ink],
  );

  useEffect(() => {
    applied.current = null;
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  useFrame(() => {
    const wanted = state.current.treatment;
    if (applied.current === wanted) return;
    applied.current = wanted;
    for (const mesh of meshes) mesh.material = materials[wanted];
  });

  return (
    <group scale={scale}>
      <primitive object={model} position={offset} />
    </group>
  );
}

const FIELD_N = 43;
const FIELD_SPACING = 0.16;

function FloorField({ ink, state, reduced }: { ink: TokenInk; state: MutableRefObject<StageState>; reduced: boolean }) {
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(FIELD_N * FIELD_N * 3);
    const half = ((FIELD_N - 1) * FIELD_SPACING) / 2;
    for (let i = 0; i < FIELD_N; i += 1) {
      for (let j = 0; j < FIELD_N; j += 1) {
        const k = (i * FIELD_N + j) * 3;
        positions[k] = i * FIELD_SPACING - half;
        positions[k + 1] = FLOOR_Y;
        positions[k + 2] = j * FIELD_SPACING - half;
      }
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  const material = useMemo(
    () => new THREE.PointsMaterial({ color: ink['--accent-soft'], size: 0.03, transparent: true, depthWrite: false }),
    [ink],
  );
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame(({ clock }) => {
    const t = reduced ? 2 : clock.elapsedTime;
    const weight = state.current.field;
    const attr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const amp = 0.012 + 0.05 * weight;
    for (let i = 0; i < FIELD_N * FIELD_N; i += 1) {
      const x = attr.getX(i);
      const z = attr.getZ(i);
      const r = Math.hypot(x, z);
      attr.setY(i, FLOOR_Y + amp * Math.sin(r * 6 - t * 1.7) * Math.exp(-r * 0.35));
    }
    attr.needsUpdate = true;
    material.opacity = 0.1 + 0.8 * weight;
    material.size = 0.022 + 0.022 * weight;
  });

  return <points geometry={geometry} material={material} />;
}

const LINK_POINT = new THREE.Vector3(1.5, FLOOR_Y + 0.03, -0.9);
const ECHO_START = new THREE.Vector3(-1.3, FLOOR_Y + 0.05, 1.0);
const RING_ORIGIN = new THREE.Vector3(-0.9, FLOOR_Y + 0.01, 0.55);
const CYCLE_S = 7;
const CLICK_PERIOD_S = 2.4;

function Actors({ ink, state, reduced }: { ink: TokenInk; state: MutableRefObject<StageState>; reduced: boolean }) {
  const root = useRef<THREE.Group>(null);
  const echo = useRef<THREE.Mesh>(null);
  const cat = useRef<THREE.Group>(null);
  const link = useRef<THREE.Mesh>(null);
  const rings = useRef<Array<THREE.Mesh | null>>([]);
  const memo = useRef({ level: 0, impulse: 0, lastRing: -1, echoPrev: new THREE.Vector3(), catPrev: new THREE.Vector3(), primed: false });

  const accent = useMemo(() => new THREE.MeshBasicMaterial({ color: ink['--accent'], transparent: true }), [ink]);
  const linkMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: ink['--accent-warm'], transparent: true, side: THREE.DoubleSide }), [ink]);
  const fg = useMemo(() => new THREE.MeshBasicMaterial({ color: ink['--fg'] }), [ink]);
  const ringMaterials = useMemo(
    () => [0, 1, 2].map(() => new THREE.MeshBasicMaterial({ color: ink['--accent'], transparent: true, side: THREE.DoubleSide, depthWrite: false })),
    [ink],
  );
  useEffect(() => () => { accent.dispose(); linkMaterial.dispose(); fg.dispose(); ringMaterials.forEach((m) => m.dispose()); }, [accent, linkMaterial, fg, ringMaterials]);

  useFrame(({ clock }, delta) => {
    const m = memo.current;
    const weight = state.current.actors;
    if (root.current) root.current.visible = weight > 0.02;
    if (weight <= 0.02) {
      m.level *= Math.exp(-delta / RELEASE_S);
      state.current.movement = m.level < 0.005 ? 0 : m.level;
      m.primed = false;
      return;
    }
    const t = reduced ? 3.1 : clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    rings.current.forEach((ring, k) => {
      if (!ring) return;
      const u = (t / CLICK_PERIOD_S + k / 3) % 1;
      ring.scale.setScalar(0.12 + u * 1.5);
      ringMaterials[k].opacity = (1 - u) * 0.85 * weight;
    });
    const clickIndex = Math.floor(t / CLICK_PERIOD_S);
    if (!reduced && clickIndex !== m.lastRing) {
      m.lastRing = clickIndex;
      m.impulse = 0.8;
    }

    const u = (t / CYCLE_S) % 1;
    const travel = clamp01(u / 0.7);
    const eased = travel * travel * (3 - 2 * travel);
    const echoPos = new THREE.Vector3().lerpVectors(ECHO_START, LINK_POINT, eased);
    echoPos.y += Math.sin(eased * Math.PI) * 0.12;
    echo.current?.position.copy(echoPos);
    if (echo.current) {
      echo.current.scale.setScalar(u < 0.9 ? 1 : 1 - (u - 0.9) * 10);
    }
    const catTarget = echoPos.clone().add(new THREE.Vector3(-0.28, -0.03, 0.18));
    if (cat.current) {
      if (!m.primed) cat.current.position.copy(catTarget);
      else if (reduced) cat.current.position.copy(catTarget);
      else cat.current.position.lerp(catTarget, 1 - Math.exp(-dt * 2.2));
      cat.current.rotation.y = Math.atan2(LINK_POINT.x - cat.current.position.x, LINK_POINT.z - cat.current.position.z);
    }

    if (!reduced && m.primed && dt > 0) {
      const echoSpeed = echoPos.distanceTo(m.echoPrev) / dt;
      const catSpeed = cat.current ? cat.current.position.distanceTo(m.catPrev) / dt : 0;
      m.impulse *= Math.exp(-dt / 0.25);
      const target = clamp01((echoSpeed + catSpeed) / 1.1 + m.impulse);
      if (target > m.level) m.level += (target - m.level) * (1 - Math.exp(-dt / ATTACK_S));
      else m.level *= Math.exp(-dt / RELEASE_S);
    }
    m.echoPrev.copy(echoPos);
    if (cat.current) m.catPrev.copy(cat.current.position);
    m.primed = true;
    state.current.movement = reduced ? 0 : m.level;

    if (link.current) {
      const proximity = clamp01(1 - echoPos.distanceTo(LINK_POINT) / 2.8);
      link.current.scale.setScalar(0.9 + proximity * 0.9);
      (link.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + 0.65 * proximity;
    }
  });

  return (
    <group ref={root} visible={false}>
      {[0, 1, 2].map((k) => (
        <mesh
          key={k}
          ref={(node) => { rings.current[k] = node; }}
          position={RING_ORIGIN}
          rotation={[-Math.PI / 2, 0, 0]}
          material={ringMaterials[k]}
        >
          <ringGeometry args={[0.9, 1, 56]} />
        </mesh>
      ))}
      <mesh ref={link} position={LINK_POINT} rotation={[-Math.PI / 2, 0, Math.PI / 4]} material={linkMaterial}>
        <ringGeometry args={[0.1, 0.14, 4]} />
      </mesh>
      <mesh ref={echo} material={accent}>
        <sphereGeometry args={[0.04, 16, 12]} />
      </mesh>
      <group ref={cat}>
        <mesh material={fg}>
          <sphereGeometry args={[0.05, 14, 10]} />
        </mesh>
        <mesh position={[-0.03, 0.06, 0.02]} material={fg}>
          <coneGeometry args={[0.02, 0.045, 4]} />
        </mesh>
        <mesh position={[0.03, 0.06, 0.02]} material={fg}>
          <coneGeometry args={[0.02, 0.045, 4]} />
        </mesh>
      </group>
    </group>
  );
}

const HALO_RADII = [0.78, 0.98, 1.3];

function Halo({ ink, state, reduced }: { ink: TokenInk; state: MutableRefObject<StageState>; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const materials = useMemo(
    () => HALO_RADII.map(() => new THREE.MeshBasicMaterial({ color: ink['--accent'], transparent: true, depthWrite: false })),
    [ink],
  );
  useEffect(() => () => materials.forEach((m) => m.dispose()), [materials]);

  useFrame(({ camera, clock }) => {
    const weight = state.current.halo;
    if (group.current) {
      group.current.quaternion.copy(camera.quaternion);
      const breathe = reduced ? 1 : 1 + Math.sin(clock.elapsedTime * 0.8) * 0.012;
      group.current.scale.setScalar(breathe);
    }
    materials.forEach((m, i) => {
      m.opacity = (0.1 + 0.7 * weight) * (1 - i * 0.22);
    });
  });

  return (
    <group ref={group}>
      {HALO_RADII.map((r, i) => (
        <mesh key={r} material={materials[i]}>
          <torusGeometry args={[r, 0.004, 6, 120]} />
        </mesh>
      ))}
    </group>
  );
}

function CameraRig({
  stepFloat,
  state,
  reduced,
  onTelemetry,
}: {
  stepFloat: RefObject<number>;
  state: MutableRefObject<StageState>;
  reduced: boolean;
  onTelemetry: (t: StageTelemetry) => void;
}) {
  const { camera, size } = useThree();
  const light = useRef<THREE.DirectionalLight>(null);
  const current = useRef({ az: 0, el: 0, dist: 0, ready: false });
  const sinceEmit = useRef(0);

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const wide = window.innerWidth >= 768;
    if (wide) cam.setViewOffset(size.width, size.height, size.width * 0.2, 0, size.width, size.height);
    else cam.clearViewOffset();
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useFrame((_, delta) => {
    const blend = blendAt(stepFloat.current ?? 0, reduced);
    const c = current.current;
    if (!c.ready || reduced) {
      c.az = blend.azimuth;
      c.el = blend.elevation;
      c.dist = blend.distance;
      c.ready = true;
    } else {
      const k = 1 - Math.exp(-Math.min(delta, 0.05) * 7);
      c.az += (blend.azimuth - c.az) * k;
      c.el += (blend.elevation - c.el) * k;
      c.dist += (blend.distance - c.dist) * k;
    }
    const az = toRad(c.az);
    const el = toRad(c.el);
    const aspect = size.width / Math.max(1, size.height);
    const dist = c.dist * Math.max(1, 2.3 / aspect);
    camera.position.set(
      Math.sin(az) * Math.cos(el) * dist,
      Math.sin(el) * dist,
      Math.cos(az) * Math.cos(el) * dist,
    );
    camera.lookAt(0, 0, 0);
    light.current?.position.set(camera.position.x + 1, camera.position.y + 2, camera.position.z + 1);

    const s = state.current;
    s.treatment = STORY_STEPS[blend.nearest].treatment;
    s.field = blend.field;
    s.actors = blend.actors;
    s.halo = blend.halo;

    sinceEmit.current += delta;
    if (sinceEmit.current >= EMIT_EVERY_S) {
      sinceEmit.current = 0;
      onTelemetry({
        step: blend.nearest,
        azimuth: ((c.az % 360) + 360) % 360,
        elevation: c.el,
        distance: c.dist,
        movement: s.movement,
      });
    }
  });

  return <directionalLight ref={light} intensity={2.4} />;
}

export function SpecimenStage({
  stepFloat,
  reduced,
  onTelemetry,
}: {
  stepFloat: RefObject<number>;
  reduced: boolean;
  onTelemetry: (t: StageTelemetry) => void;
}) {
  const ink = useTokenInk();
  const state = useRef<StageState>({ treatment: 'veil', field: 1, actors: 0, halo: 0.15, movement: 0 });
  if (!ink['--bg']) return null;

  return (
    <Canvas
      camera={{ fov: 38, near: 0.1, far: 60, position: [0, 1, 3] }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[ink['--bg']]} />
      <ambientLight intensity={0.75} />
      <CameraRig stepFloat={stepFloat} state={state} reduced={reduced} onTelemetry={onTelemetry} />
      <FloorField ink={ink} state={state} reduced={reduced} />
      <Halo ink={ink} state={state} reduced={reduced} />
      <Specimen ink={ink} state={state} />
      <Actors ink={ink} state={state} reduced={reduced} />
    </Canvas>
  );
}
