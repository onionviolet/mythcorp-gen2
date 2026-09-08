'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const SignalScene = dynamic(() => import('./SignalScene'), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

export function SignalInstrument() {
  const [angle, setAngle] = useState(30);
  const [color, setColor] = useState<string>();
  const [webgl, setWebgl] = useState(false);
  const root = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (root.current) setColor(getComputedStyle(root.current).color);
  }, [theme]);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    setWebgl(Boolean(context));
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  }, []);

  const fallback = <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
    <g fill="none" stroke="currentColor" transform={`rotate(${angle} 200 200)`}>
      <circle cx="200" cy="200" r="145" opacity=".4" />
      <ellipse cx="200" cy="200" rx="90" ry="145" />
      <path d="M200 55 325 270 75 270Z M200 345 75 130 325 130Z" />
    </g>
  </svg>;

  return (
    <figure ref={root} className="themed-surface relative w-full p-5 text-[color:var(--accent)] sm:p-8">
      <figcaption className="flex justify-between gap-4 font-mono text-xs">
        <span>01 / Orientation study</span><span>Y {String(angle).padStart(3, '0')}°</span>
      </figcaption>
      <div className="h-[280px] sm:h-[380px]" role="img" aria-label={`Wireframe study rotated ${angle} degrees around its vertical axis`}>
        {webgl && color ? <SceneBoundary fallback={fallback}><SignalScene angle={angle} color={color} /></SceneBoundary> : fallback}
      </div>
      <label htmlFor="signal-angle" className="flex justify-between text-sm text-[color:var(--fg)]">
        <span>Rotate the specimen</span><output htmlFor="signal-angle">{angle}°</output>
      </label>
      <input id="signal-angle" className="mt-4 min-h-6 w-full accent-[var(--accent)]" type="range" min="0" max="360" value={angle} onChange={event => setAngle(Number(event.target.value))} />
      <p className="mt-3 text-xs leading-relaxed text-[color:var(--fg-muted)]">A geometry study. Drag the dial, or use the arrow keys. The full scene lives one door over.</p>
    </figure>
  );
}
