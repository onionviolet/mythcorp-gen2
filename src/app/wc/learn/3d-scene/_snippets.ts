// Snippet strings for the 3d-scene walkthrough, separate from the page's
// presentation and live MiniStarField demo.

export const CANVAS_SNIPPET = `<Canvas
  gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
  dpr={[1, 2]}
>
  {/* All R3F components live inside <Canvas> */}
  <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={55} />
  <Model ... />
  <Stars ... />
</Canvas>`;

export const PARTICLE_SNIPPET = `const particles = useMemo(() => {
  const positions = new Float32Array(particleCount * 3); // [x,y,z, x,y,z, ...]
  const colors    = new Float32Array(particleCount * 3); // [r,g,b, r,g,b, ...]

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    colors[i * 3]        = Math.random() * 0.5 + 0.5; // r
    colors[i * 3 + 1]    = Math.random() * 0.5 + 0.5; // g
    colors[i * 3 + 2]    = 1;                           // b (always full)
  }
  return { positions, colors };
}, []);

return (
  <points ref={meshRef}>
    <bufferGeometry>
      <bufferAttribute attach="attributes-position" count={particleCount}
        args={[particles.positions, 3]} />
      <bufferAttribute attach="attributes-color" count={particleCount}
        args={[particles.colors, 3]} />
    </bufferGeometry>
    <pointsMaterial size={0.05} vertexColors transparent opacity={0.6} />
  </points>
);`;

export const STARS_SNIPPET = `const MAX_STARS = 12000;
const STARS_PER_UNIT = 1200;

// Inside <Canvas>:
<Stars
  radius={100}
  depth={50}
  count={Math.min(Math.round(STARS_PER_UNIT * settings.stars), MAX_STARS)}
  factor={4 * settings.stars}
  saturation={0}
  fade
  speed={1}
/>`;

export const BLOOM_SNIPPET = `<EffectComposer>
  <Bloom
    intensity={settings.glowIntensity}  // slider: 0 to 3
    luminanceThreshold={0.1}            // pixels brighter than 10% trigger glow
    luminanceSmoothing={0.2}            // soft edge around the threshold
    mipmapBlur                          // cheaper, smoother multi-scale blur
    radius={0.85}                       // how far the glow bleeds outward
  />
</EffectComposer>`;

export const DEFAULTS_SNIPPET = `const DEFAULTS = {
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

const getRandomSettings = () => ({
  rotationSpeed: Math.random() * 2,
  position: [(Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10],
  color: '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6,'0'),
  glowIntensity: Math.random() * 2,
  stars: Math.random() * 5,
  showHelicopter: Math.random() > 0.5,
  heliScale: Math.random() * 4.5 + 0.5,
  heliSmoothness: Math.random() * 0.19 + 0.01,
  showAxis: Math.random() > 0.5,
});

// State is seeded with a random config, not DEFAULTS:
const [settings, setSettings] = useState(() => getRandomSettings());`;

export const BACKDROP_SNIPPET = `const BACKDROP_BY_THEME: Record<ThemeName, string> = {
  cyberpunk: '#000008', // near-black with a faint blue cast
  luxury:    '#0c0a14', // dark purple-grey
  paper:     '#f3ebdb', // warm off-white matching the CSS background
};

// Inside Simulation, consumed by the active theme from context:
const { theme } = useTheme();
const backdrop = BACKDROP_BY_THEME[theme];

// Then inside <Canvas>:
<color attach="background" args={[backdrop]} />`;

// The reset-aliasing bug, before and after. Highlighted line numbers are
// 1-based against this string.
export const RESET_BUG_SNIPPET = `// The bug: reset hands setState the SAME array every time.
const resetToDefaults = () => setSettings(DEFAULTS);
// Edit a Position slider and it mutates DEFAULTS.position in place,
// because handlePositionChange copies the object but shares the array.
// Reset twice and React bails out: same object reference, no re-render.

// The fix: clone the object AND its position array on every reset.
const getDefaultSettings = () => ({ ...DEFAULTS, position: [...DEFAULTS.position] });
const resetToDefaults = () => setSettings(getDefaultSettings());`;
