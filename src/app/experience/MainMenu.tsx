'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { SkylineBackdrop } from '../components/landing/SkylineBackdrop';
import { useTheme } from '../contexts/ThemeContext';
import { SignalInstrument } from './instrument/SignalInstrument';

export function MainMenu({ onStart }: { onStart: () => void }) {
  const root = useRef<HTMLElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const duration = parseFloat(getComputedStyle(root.current!).getPropertyValue('--motion-base')) / 1000;
      if (!duration) return;
      gsap.from('[data-enter]', { y: 20, opacity: 0, duration: duration * 2, stagger: duration / 2, ease: theme === 'luxury' ? 'power3.out' : 'power1.out' });
    }, root);
    return () => media.revert();
  }, [theme]);

  return (
    <main ref={root} className="relative isolate min-h-screen overflow-hidden text-[color:var(--fg)]">
      <div className="absolute inset-0" style={{ opacity: theme === 'paper' ? 0.12 : theme === 'plain' ? 0 : 1 }}><SkylineBackdrop parallax={false} /></div>
      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-28 sm:px-10 lg:pt-40">
        <p data-enter className="font-mono text-xs tracking-[0.25em] text-[color:var(--accent)]">MYTHCORP / SIMULATION LAB / WIP</p>
        <div className="mt-8 grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <section data-enter>
            <h1 className="themed-heading text-6xl font-semibold leading-[0.96] tracking-tight sm:text-8xl">A little<br />world.<br /><span className="text-[color:var(--accent-soft)]">Your rules.</span></h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-[color:var(--fg-muted)]">A spectre, a star field, and a control panel. Step inside, change the variables, and see what happens.</p>
            <button onClick={onStart} className="themed-button mt-8 min-h-14 px-8 py-4 text-sm">Enter simulation <span aria-hidden="true">↗</span></button>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-[color:var(--fg-muted)]">Randomized on entry. Adjust the scene inside, or reset to its defaults. The full simulation uses WebGL.</p>
          </section>
          <div data-enter><SignalInstrument /></div>
        </div>
        <nav data-enter aria-label="Explore the lab" className="mt-16 grid gap-6 border-t border-[color:var(--border-strong)] pt-6 sm:grid-cols-2">
          <Link className="group py-3" href="/wc/learn/3d-scene"><span className="text-lg group-hover:text-[color:var(--accent)]">Open the machinery ↗</span><span className="mt-2 block text-sm text-[color:var(--fg-muted)]">A walkthrough of the scene, from model to controls.</span></Link>
          <Link className="group py-3" href="/wc/lab/canvas"><span className="text-lg group-hover:text-[color:var(--accent)]">Visit the canvas bench ↗</span><span className="mt-2 block text-sm text-[color:var(--fg-muted)]">Rendering experiments with their controls exposed.</span></Link>
        </nav>
      </div>
    </main>
  );
}
