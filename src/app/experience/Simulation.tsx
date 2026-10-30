'use client';

// Walkthrough: /wc/learn/3d-scene

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useState, useRef, useMemo } from 'react'
import { PerspectiveCamera, useGLTF, Image, Stars } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Group, Points, Vector3 } from 'three'
import { useTheme, type ThemeName } from '../contexts/ThemeContext'

// Preload once for the session, cached for both this scene and the
// boot-time landing logo, so route changes don't refetch the model.
useGLTF.preload('/spectre.glb');

const MAX_STARS = 12000;
const STARS_PER_UNIT = 1200;

// Per-theme canvas backdrop so the scene doesn't flash hard black on the
// warm `paper` theme or the muted `luxury` theme.
const BACKDROP_BY_THEME: Record<ThemeName, string> = {
  cyberpunk: '#000008',
  luxury:    '#0c0a14',
  paper:     '#f3ebdb',
  plain:     '#ffffff',
};

// --- Prop Interfaces ---
interface ModelProps {
  position: number[];
  rotationSpeed: number;
  color: string;
}
interface HelicopterProps {
  scale: number;
  lerpFactor: number;
}
interface CombinedInputProps {
  label: string;
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  min: number;
  max: number;
  step: number;
}
interface SimulationProps {
  onExit: () => void;
}

const DEFAULTS = {
    rotationSpeed: 0.2,
    position: [0, 0, 0],
    color: '#00ffff',
    glowIntensity: 0.5,
    stars: 1,
    showHelicopter: false,
    heliScale: 1.5,
    heliSmoothness: 0.1,
    showAxis: true,
};

// Fresh clone every call. `setSettings(DEFAULTS)` used to share the
// module-level `DEFAULTS.position` array by reference, so editing a position
// slider mutated the defaults, and a second reset was a no-op (React bailed
// out on the same object). Cloning the array fixes both.
const getDefaultSettings = () => ({ ...DEFAULTS, position: [...DEFAULTS.position] });

const getRandomSettings = () => ({
  rotationSpeed: Math.random() * 2,
  position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10],
  color: `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`,
  glowIntensity: Math.random() * 2,
  stars: Math.random() * 5,
  showHelicopter: Math.random() > 0.5,
  heliScale: Math.random() * 4.5 + 0.5,
  heliSmoothness: Math.random() * 0.19 + 0.01,
  showAxis: Math.random() > 0.5,
});

// ===================================================================
// === 3D MODEL COMPONENTS ===
// ===================================================================

function Model({ position, rotationSpeed, color }: ModelProps) {
  const { scene } = useGLTF('/spectre.glb')
  const modelRef = useRef<Group>(null!)

  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += delta * rotationSpeed
      modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    }
  })

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={1.5} position={position}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          toneMapped={false}
          roughness={0.2}
          metalness={0.8}
        />
      </primitive>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.02, 8, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[2.5, 0.015, 8, 100]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
    </group>
  )
}

function makeParticles(particleCount: number) {
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    colors[i * 3] = Math.random() * 0.5 + 0.5
    colors[i * 3 + 1] = Math.random() * 0.5 + 0.5
    colors[i * 3 + 2] = 1
  }

  return { positions, colors }
}

function ParticleField() {
  const meshRef = useRef<Points>(null)
  const particleCount = 1000

  const particles = useMemo(() => makeParticles(particleCount), [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          args={[particles.positions, 3]} />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          args={[particles.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} />
    </points>
  )
}

function Helicopter({ scale, lerpFactor }: HelicopterProps) {
  const ref = useRef<Group>(null!)
  const { viewport } = useThree()
  const target = new Vector3()

  useFrame((state) => {
    if (ref.current) {
      target.set((state.mouse.x * viewport.width) / 2, (state.mouse.y * viewport.height) / 2, 0)
      ref.current.position.lerp(target, lerpFactor)
    }
  })

  return (
    <group ref={ref}>
      {/* This is drei's <Image>, a textured plane in the 3D scene, not an
          <img>. jsx-a11y matches on the component name and cannot tell the
          difference; there is no alt text on a WebGL mesh to give it. */}
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image url="/heli.jpg" scale={scale} transparent />
    </group>
  )
}

// ===================================================================
// === UI COMPONENTS ===
// ===================================================================

function CombinedInput({ label, value, onChange, min, max, step }: CombinedInputProps) {
    return (
      <div className="flex flex-col mt-4">
        <label className="text-[color:var(--fg-muted)] text-sm mb-2 font-sans">
          {label}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer
                       accent-[color:var(--accent)]"
            style={{ background: 'color-mix(in srgb, var(--bg) 60%, transparent)' }}
          />
          <input
            type="number"
            step={step}
            value={value.toFixed ? value.toFixed(2) : value}
            onChange={onChange}
            className="w-20 bg-[color:var(--bg)] border border-[color:var(--border)]
                       text-[color:var(--fg)] p-1.5 text-sm text-center
                       rounded-[var(--radius-sm)] font-mono
                       focus:border-[color:var(--accent)] focus:outline-none"
          />
        </div>
      </div>
    )
}

// ===================================================================
// === MAIN SIMULATION COMPONENT ===
// ===================================================================
export function Simulation({ onExit }: SimulationProps) {
  const { theme } = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [settings, setSettings] = useState(() => getRandomSettings());

  const randomizeAll = () => setSettings(getRandomSettings());
  const resetToDefaults = () => setSettings(getDefaultSettings());

  const handleSettingChange = (key: keyof typeof DEFAULTS, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePositionChange = (axis: number, value: number) => {
    setSettings(prev => {
      const newPos = [...prev.position];
      newPos[axis] = value;
      return { ...prev, position: newPos };
    });
  };

  const backdrop = BACKDROP_BY_THEME[theme];

  return (
    <main className='h-screen w-screen bg-[color:var(--bg)] font-sans'>

      {/* Themed control panel. Anchors below the SiteHeader. */}
      <div className="themed-surface absolute left-4 top-20 z-10
                      w-80 max-h-[calc(100vh-6rem)] overflow-y-auto
                      text-[color:var(--fg)]">

        <div className="p-4">
          <h3 className="text-center font-mono tracking-widest text-base
                         text-[color:var(--accent)]
                         border-b border-[color:var(--border)] pb-3">
            [ SIM_CONTROLS ]
          </h3>

          <div className="flex flex-col mt-4">
            <label className="text-[color:var(--fg-muted)] text-sm mb-1 font-sans">
              Primary Color
            </label>
            <input
              type="text"
              value={settings.color}
              onChange={(e) => handleSettingChange('color', e.target.value)}
              className="mt-1 bg-[color:var(--bg)] border border-[color:var(--border)]
                         text-[color:var(--fg)] p-2 text-sm
                         rounded-[var(--radius-sm)] font-mono
                         focus:border-[color:var(--accent)] focus:outline-none"
            />
          </div>

          <CombinedInput
            label="Emission Intensity"
            value={settings.glowIntensity}
            onChange={(e) => handleSettingChange('glowIntensity', parseFloat(e.target.value))}
            min={0}
            max={3}
            step={0.1}
          />

          <CombinedInput
            label="Star Density"
            value={settings.stars}
            onChange={(e) => handleSettingChange('stars', parseFloat(e.target.value))}
            min={0}
            max={5}
            step={0.1}
          />

          <div className="border-t border-[color:var(--border)] pt-4 mt-4 space-y-2">
            <label className="flex items-center gap-3 text-[color:var(--fg-muted)] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showHelicopter}
                onChange={(e) => handleSettingChange('showHelicopter', e.target.checked)}
                className="w-4 h-4 accent-[color:var(--accent)]"
              />
              Enable Mouse Tracker
            </label>
            <label className="flex items-center gap-3 text-[color:var(--fg-muted)] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showAxis}
                onChange={(e) => handleSettingChange('showAxis', e.target.checked)}
                className="w-4 h-4 accent-[color:var(--accent)]"
              />
              Show XYZ Axis
            </label>
          </div>

          <div className="border-t border-[color:var(--border)] pt-4 mt-4">
              <label
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-[color:var(--accent)]
                           font-mono text-sm tracking-wider cursor-pointer"
              >
                <span>{showAdvanced ? '▼' : '▶'}</span>
                ADVANCED PARAMETERS
              </label>
              {showAdvanced && (
                <div className="pl-5 mt-4 border-l-2 border-[color:var(--border)]">
                    <CombinedInput label="Rotation Velocity" value={settings.rotationSpeed} onChange={(e) => handleSettingChange('rotationSpeed', parseFloat(e.target.value))} min={0} max={2} step={0.1}/>
                    <CombinedInput label="Position X" value={settings.position[0]} onChange={(e) => handlePositionChange(0, parseFloat(e.target.value))} min={-5} max={5} step={0.1}/>
                    <CombinedInput label="Position Y" value={settings.position[1]} onChange={(e) => handlePositionChange(1, parseFloat(e.target.value))} min={-5} max={5} step={0.1}/>
                    <CombinedInput label="Position Z" value={settings.position[2]} onChange={(e) => handlePositionChange(2, parseFloat(e.target.value))} min={-5} max={5} step={0.1}/>

                    <h4 className="mt-6 mb-2 pt-4 border-t border-[color:var(--border)]
                                   text-[color:var(--accent)] font-mono text-sm tracking-wider">
                      TRACKER CONFIG
                    </h4>
                    <CombinedInput label="Scale Factor" value={settings.heliScale} onChange={(e) => handleSettingChange('heliScale', parseFloat(e.target.value))} min={0.5} max={5} step={0.1}/>
                    <CombinedInput label="Response Time" value={settings.heliSmoothness} onChange={(e) => handleSettingChange('heliSmoothness', parseFloat(e.target.value))} min={0.01} max={0.2} step={0.01}/>
                </div>
              )}
          </div>

          <div className="mt-6 border-t border-[color:var(--border)] pt-4 flex flex-col gap-2">
            <button
              onClick={randomizeAll}
              className="themed-button w-full py-2 text-sm"
            >
              [ 🎲 RANDOMIZE ALL ]
            </button>
            <button
              onClick={resetToDefaults}
              className="themed-pill w-full py-2 text-sm
                         text-[color:var(--fg-muted)]
                         hover:text-[color:var(--fg)]"
            >
              [ ↺ RESET DEFAULTS ]
            </button>
            <button
              onClick={onExit}
              className="themed-pill w-full py-2 text-sm mt-2
                         text-[color:var(--accent-warm)]
                         hover:text-[color:var(--accent)]"
            >
              [ ← EXIT SIMULATION ]
            </button>
          </div>
        </div>
      </div>

      {/* --- 3D Canvas --- */}
      <Canvas
        gl={{
          alpha: false, antialias: true,
          preserveDrawingBuffer: false, powerPreference: "high-performance"
        }}
        dpr={[1, 2]}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={55} />
        <color attach="background" args={[backdrop]} />
        <Stars
          radius={100}
          depth={50}
          count={Math.min(Math.round(STARS_PER_UNIT * settings.stars), MAX_STARS)}
          factor={4 * settings.stars}
          saturation={0}
          fade
          speed={1}
        />
        <ParticleField />

        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00ffff" />
        <Model rotationSpeed={settings.rotationSpeed} position={settings.position} color={settings.color} />
        {settings.showHelicopter && <Helicopter scale={settings.heliScale} lerpFactor={settings.heliSmoothness} />}

        {settings.showAxis && <axesHelper args={[5]} />}

        <EffectComposer>
          <Bloom
            intensity={settings.glowIntensity}
            luminanceThreshold={0.1}
            luminanceSmoothing={0.2}
            mipmapBlur
            radius={0.85}
          />
        </EffectComposer>
      </Canvas>
    </main>
  )
}
