'use client';

// Walkthrough: /wc/learn/build-a-playground

import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useRef } from 'react';
import { Mesh } from 'three';
import { useTheme, type ThemeName } from '../../../contexts/ThemeContext';

// The Simulation caps at 12000; this pocket version caps far lower so it can
// sit inside an article on a mid-tier laptop without stealing the frame budget
// from the real scene the reader might open next.
export const MINI_MAX_STARS = 3000;
export const MINI_STARS_PER_UNIT = 500;

// Match the canvas background to the page background per theme, the same move
// the full Simulation makes to kill the flash-of-black on route changes.
const BACKDROP_BY_THEME: Record<ThemeName, string> = {
  cyberpunk: '#000008',
  luxury: '#0c0a14',
  paper: '#f3ebdb',
  plain: '#ffffff',
};

export interface MiniStarSettings {
  stars: number;
  speed: number;
  color: string;
}

// A colored wireframe at the center gives the `color` control something
// visible to do; the stars stay desaturated so density reads clearly.
function SpinShape({ color }: { color: string }) {
  const ref = useRef<Mesh>(null!);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.5;
    ref.current.rotation.x += delta * 0.2;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.2, 0]} />
      <meshBasicMaterial color={color} wireframe toneMapped={false} />
    </mesh>
  );
}

export function MiniStarField({ settings, backdrop: backdropOverride }: { settings: MiniStarSettings; backdrop?: string }) {
  const { theme } = useTheme();
  const backdrop = backdropOverride ?? BACKDROP_BY_THEME[theme];
  const count = Math.min(
    Math.round(MINI_STARS_PER_UNIT * settings.stars),
    MINI_MAX_STARS,
  );

  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 60 }}>
      <color attach="background" args={[backdrop]} />
      <Stars
        radius={40}
        depth={30}
        count={count}
        factor={3 * settings.stars}
        saturation={0}
        fade
        speed={settings.speed}
      />
      <SpinShape color={settings.color} />
    </Canvas>
  );
}
