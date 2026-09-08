'use client';

import { Canvas } from '@react-three/fiber';

export default function SignalScene({ angle, color }: { angle: number; color: string }) {
  return (
    <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 6.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
      <group rotation={[0.35, angle * Math.PI / 180, 0.2]}>
        <mesh>
          <icosahedronGeometry args={[1.35, 1]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.65} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.85, 0.008, 4, 96]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </group>
    </Canvas>
  );
}
