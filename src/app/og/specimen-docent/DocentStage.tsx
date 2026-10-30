'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import * as THREE from 'three';
import { useTheme, type ThemeName } from '../../contexts/ThemeContext';
import { useResolvedScheme } from '../../components/plain/usePlainScheme';
import { COLOR_TOKENS, readTokenHex } from '../../wc/lab/canvas/_components/tokenInk';
import type { TokenInk } from '../../wc/lab/canvas/_components/tokenInk';
import { fitSpectre } from '../spectreFit';
import { pickAttention } from './attention';
import type { AttentionInputs, AttentionSource } from './attention';

useGLTF.preload('/spectre.glb');

export type DocentTelemetry = {
  source: AttentionSource | 'rest';
  index: number | null;
  /** Total turn of the head from facing forward, degrees, viewer's right positive. */
  gaze: number;
  pitch: number;
  step: number;
};

/** The only clip in spectre.glb with length; the other three are empty or one frame. */
const REACTION_CLIP = 'Armature.002Action.002';
/** Neck chain from the body out, with each joint's share of the turn. */
const NECK_CHAIN: ReadonlyArray<[string, number]> = [
  ['neck_1', 0.3],
  ['neck_2', 0.3],
  ['hed', 0.4],
];
const HEAD_MAX_YAW = THREE.MathUtils.degToRad(55);
const MAX_PITCH = THREE.MathUtils.degToRad(22);
const HEAD_RATE = 4;
const BODY_RATE = 1.4;
/** Figures sit on the glass, so the gaze starts at the viewer and swings this far for a half-screen offset. */
const SWING = THREE.MathUtils.degToRad(95);
/** On phones the figures sit straight below the head, so a head-on look hides the head; turn it three-quarter. */
const NARROW_BIAS = THREE.MathUtils.degToRad(40);
const EMIT_EVERY_S = 0.12;
const CAMERA_AZIMUTH = THREE.MathUtils.degToRad(-18);
/** At rest the specimen stands three-quarter on, facing the viewer; reading turns it toward the column. */
const REST_YAW = THREE.MathUtils.degToRad(-10);
const CAMERA_ELEVATION = THREE.MathUtils.degToRad(5);

type Spring = { x: number; v: number };

function settle(spring: Spring, target: number, rate: number, dt: number) {
  const c1 = spring.x - target;
  const c2 = spring.v + rate * c1;
  const decay = Math.exp(-rate * dt);
  spring.x = target + (c1 + c2 * dt) * decay;
  spring.v = (c2 - rate * (c1 + c2 * dt)) * decay;
}

function useDocentInk(): { ink: TokenInk; theme: ThemeName } {
  const { theme } = useTheme();
  const scheme = useResolvedScheme();
  const [ink, setInk] = useState<TokenInk>({} as TokenInk);
  useEffect(() => {
    const next = {} as TokenInk;
    for (const t of COLOR_TOKENS) next[t.token] = readTokenHex(t.token);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- CSS tokens can only be read from the DOM after the theme has applied
    setInk(next);
  }, [theme, scheme]);
  return { ink, theme };
}

function bodyMaterial(theme: ThemeName, ink: TokenInk): THREE.Material {
  if (theme === 'luxury') {
    return new THREE.MeshPhysicalMaterial({ color: ink['--fg'], roughness: 0.18, metalness: 0.2, clearcoat: 1 });
  }
  if (theme === 'cyberpunk') {
    return new THREE.MeshLambertMaterial({
      color: ink['--fg'],
      emissive: ink['--accent'],
      emissiveIntensity: 0.22,
      flatShading: true,
    });
  }
  return new THREE.MeshLambertMaterial({ color: ink['--fg'], flatShading: true });
}

type SpecimenProps = {
  ink: TokenInk;
  theme: ThemeName;
  inputs: RefObject<AttentionInputs>;
  anchors: RefObject<Array<HTMLElement | null>>;
  stepFloat: RefObject<number>;
  reduced: boolean;
  reaction: number;
  onTelemetry: (t: DocentTelemetry) => void;
};

function Specimen({ ink, theme, inputs, anchors, stepFloat, reduced, reaction, onTelemetry }: SpecimenProps) {
  const { scene, animations } = useGLTF('/spectre.glb');
  const { camera, gl } = useThree();
  const body = useRef<THREE.Group>(null);

  const rig = useMemo(() => {
    const { model, size, center } = fitSpectre(scene);
    const meshes: THREE.Mesh[] = [];
    const bones = new Map<string, THREE.Bone>();
    model.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.frustumCulled = false;
        meshes.push(mesh);
      }
      if ((node as THREE.Bone).isBone) bones.set(node.name, node as THREE.Bone);
    });
    const chain = NECK_CHAIN.map(([name, share]) => {
      const bone = bones.get(name);
      return bone ? { bone, share, rest: bone.quaternion.clone() } : null;
    }).filter((j): j is { bone: THREE.Bone; share: number; rest: THREE.Quaternion } => j !== null);
    const rest = [...bones.values()].map((b) => ({
      bone: b,
      p: b.position.clone(),
      q: b.quaternion.clone(),
      s: b.scale.clone(),
    }));
    const mixer = new THREE.AnimationMixer(model);
    const clip = animations.find((a) => a.name === REACTION_CLIP) ?? null;
    return {
      model,
      meshes,
      chain,
      rest,
      mixer,
      clip,
      scale: 1 / (size.y || 1),
      offset: center.multiplyScalar(-1).toArray() as [number, number, number],
    };
  }, [scene, animations]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && rig.chain.length < NECK_CHAIN.length) {
      console.warn('[specimen-docent] neck chain incomplete; found', rig.chain.map((j) => j.bone.name));
    }
  }, [rig]);

  const material = useMemo(() => bodyMaterial(theme, ink), [theme, ink]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability -- three.js meshes are swapped imperatively
    for (const mesh of rig.meshes) mesh.material = material;
    return () => material.dispose();
  }, [rig, material]);

  const playing = useRef<THREE.AnimationAction | null>(null);
  useEffect(() => {
    if (!reaction || reduced || !rig.clip) return;
    const action = rig.mixer.clipAction(rig.clip);
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = false;
    action.play();
    playing.current = action;
    const onFinished = () => {
      action.stop();
      playing.current = null;
      for (const r of rig.rest) {
        r.bone.position.copy(r.p);
        r.bone.quaternion.copy(r.q);
        r.bone.scale.copy(r.s);
      }
    };
    rig.mixer.addEventListener('finished', onFinished);
    return () => rig.mixer.removeEventListener('finished', onFinished);
  }, [reaction, reduced, rig]);

  const springs = useRef({ head: { x: 0, v: 0 }, pitch: { x: 0, v: 0 }, body: { x: REST_YAW, v: 0 } });
  const snapKey = useRef('');
  const sinceEmit = useRef(0);
  const scratch = useMemo(
    () => ({
      ndc: new THREE.Vector3(),
      head: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      axis: new THREE.Vector3(),
      qYaw: new THREE.Quaternion(),
      qPitch: new THREE.Quaternion(),
      qWorld: new THREE.Quaternion(),
      qParent: new THREE.Quaternion(),
      qParentInv: new THREE.Quaternion(),
    }),
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = springs.current;
    const v = scratch;

    for (const j of rig.chain) j.bone.quaternion.copy(j.rest);
    if (playing.current) rig.mixer.update(dt);

    const step = stepFloat.current ?? 0;
    const attention = inputs.current
      ? pickAttention(inputs.current, anchors.current ?? [], step, performance.now())
      : null;

    let yawTarget = REST_YAW;
    let pitchTarget = 0;
    const headBone = rig.chain[rig.chain.length - 1]?.bone;
    if (attention && headBone) {
      const rect = gl.domElement.getBoundingClientRect();
      headBone.getWorldPosition(v.head);
      const toCamera = Math.atan2(camera.position.x - v.head.x, camera.position.z - v.head.z);
      v.ndc.copy(v.head).project(camera);
      const headX = rect.left + ((v.ndc.x + 1) / 2) * rect.width;
      const headY = rect.top + ((1 - v.ndc.y) / 2) * rect.height;
      const dx = THREE.MathUtils.clamp((attention.x - headX) / (window.innerWidth / 2), -1, 1);
      const dy = THREE.MathUtils.clamp((headY - attention.y) / (window.innerHeight / 2), -1, 1);
      yawTarget = toCamera + dx * SWING + (rect.width < 768 ? NARROW_BIAS : 0);
      pitchTarget = dy * MAX_PITCH;
    }
    const bodyTarget = yawTarget - THREE.MathUtils.clamp(yawTarget - REST_YAW, -HEAD_MAX_YAW, HEAD_MAX_YAW);

    if (reduced) {
      const key = attention ? `${attention.source}:${attention.index}` : 'rest';
      if (key !== snapKey.current) {
        snapKey.current = key;
        s.body.x = bodyTarget;
        s.head.x = yawTarget - bodyTarget;
        s.pitch.x = pitchTarget;
      }
    } else {
      settle(s.body, bodyTarget, BODY_RATE, dt);
      settle(s.head, THREE.MathUtils.clamp(yawTarget - s.body.x, -HEAD_MAX_YAW, HEAD_MAX_YAW), HEAD_RATE, dt);
      settle(s.pitch, pitchTarget, HEAD_RATE, dt);
    }

    if (body.current) body.current.rotation.y = s.body.x;

    let turned = s.body.x;
    for (const j of rig.chain) {
      const parent = j.bone.parent;
      if (!parent) continue;
      parent.updateWorldMatrix(true, false);
      parent.getWorldQuaternion(v.qParent);
      v.qParentInv.copy(v.qParent).invert();
      turned += s.head.x * j.share;
      v.qYaw.setFromAxisAngle(v.up, s.head.x * j.share);
      v.axis.set(Math.cos(turned), 0, -Math.sin(turned));
      v.qPitch.setFromAxisAngle(v.axis, -s.pitch.x * j.share);
      v.qWorld.multiplyQuaternions(v.qPitch, v.qYaw);
      v.qWorld.premultiply(v.qParentInv).multiply(v.qParent);
      j.bone.quaternion.premultiply(v.qWorld);
    }

    sinceEmit.current += delta;
    if (sinceEmit.current >= EMIT_EVERY_S) {
      sinceEmit.current = 0;
      onTelemetry({
        source: attention?.source ?? 'rest',
        index: attention?.index ?? null,
        gaze: THREE.MathUtils.radToDeg(s.body.x + s.head.x - REST_YAW),
        pitch: THREE.MathUtils.radToDeg(s.pitch.x),
        step,
      });
    }
  });

  return (
    <group ref={body}>
      <group scale={rig.scale}>
        <primitive object={rig.model} position={rig.offset} />
      </group>
    </group>
  );
}

function CameraFrame() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const wide = size.width >= 768;
    const aspect = size.width / Math.max(1, size.height);
    const dist = (wide ? 3.8 : 2.7) * Math.max(1, 1.5 / aspect);
    cam.position.set(
      Math.sin(CAMERA_AZIMUTH) * Math.cos(CAMERA_ELEVATION) * dist,
      Math.sin(CAMERA_ELEVATION) * dist,
      Math.cos(CAMERA_AZIMUTH) * Math.cos(CAMERA_ELEVATION) * dist,
    );
    cam.lookAt(0, 0, 0);
    if (wide) cam.setViewOffset(size.width, size.height, size.width * 0.32, 0, size.width, size.height);
    else cam.clearViewOffset();
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

export function DocentStage(props: Omit<SpecimenProps, 'ink' | 'theme'>) {
  const { ink, theme } = useDocentInk();
  if (!ink['--bg']) return null;
  return (
    <Canvas camera={{ fov: 38, near: 0.05, far: 40, position: [0, 0, 2] }} dpr={[1, 2]} gl={{ antialias: true }}>
      <color attach="background" args={[ink['--bg']]} />
      <ambientLight intensity={theme === 'luxury' ? 0.55 : 0.8} />
      <directionalLight position={[-1.2, 2.2, 2]} intensity={2.2} />
      <CameraFrame />
      <Specimen ink={ink} theme={theme} {...props} />
    </Canvas>
  );
}
