'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import type { MutableRefObject } from 'react';
import * as THREE from 'three';
import { useTokenInk } from '../../wc/lab/canvas/_components/tokenInk';
import { fitSpectre } from '../spectreFit';

useGLTF.preload('/spectre.glb');

const MODEL_HEIGHT = 2.8;

function Spectre({
  spin,
  stepDegrees,
  ink,
}: {
  spin: MutableRefObject<number>;
  stepDegrees: number;
  ink: string;
}) {
  const { scene } = useGLTF('/spectre.glb');
  const group = useRef<THREE.Group>(null);

  const { model, material } = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    const { model, size, center } = fitSpectre(scene);
    model.traverse((node) => {
      const mesh = node as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.frustumCulled = false;
        mesh.material = material;
      }
    });
    const k = MODEL_HEIGHT / Math.max(size.y, 0.0001);
    model.scale.setScalar(k);
    model.position.copy(center).multiplyScalar(-k);
    return { model, material };
  }, [scene]);

  useEffect(() => {
    if (ink) material.color.set(ink);
  }, [ink, material]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y = -THREE.MathUtils.degToRad(spin.current * stepDegrees);
    }
  });

  return (
    <group ref={group}>
      <primitive object={model} />
    </group>
  );
}

function Redraw({ trigger }: { trigger: string }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [trigger, invalidate]);
  return null;
}

export default function SpectreCore({
  spin,
  stepDegrees,
  settled,
  index,
}: {
  spin: MutableRefObject<number>;
  stepDegrees: number;
  settled: boolean;
  index: number;
}) {
  const ink = useTokenInk();
  return (
    <Canvas
      frameloop={settled ? 'demand' : 'always'}
      camera={{ position: [0, 0, 8], fov: 34 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true }}
    >
      {ink['--bg'] && <color attach="background" args={[ink['--bg']]} />}
      <Redraw trigger={`${index}-${ink['--accent']}`} />
      <Spectre spin={spin} stepDegrees={stepDegrees} ink={ink['--accent']} />
    </Canvas>
  );
}
