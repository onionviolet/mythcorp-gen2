'use client';

import { useEffect, useRef, useState } from 'react';
import { SiteHeader } from '../components/SiteHeader';
import { MainMenu } from './MainMenu';
import { Simulation } from './Simulation';
import { CalhounSimulation } from './CalhounSimulation';

// Two distinct scenes share this route: the spectre 'simulation' and the
// separate Universe 25 'calhoun' behavioral sink. They never co-mount.
type View = 'menu' | 'simulation' | 'calhoun';

const FADE_MS = 420;

export default function ExperiencePage() {
  const [view, setView] = useState<View>('menu');
  const [mounted, setMounted] = useState<View>('menu');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Deep link: /experience?mode=calhoun drops straight into the behavioral sink.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'calhoun') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- URL is only readable after mount; reading it during render would break hydration
      setView('calhoun');
      setMounted('calhoun');
    }
  }, []);

  useEffect(() => {
    if (mounted === view) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setMounted(view);
      timer.current = null;
    }, FADE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [view, mounted]);

  const visible = view === mounted;

  return (
    <div className="relative min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">
      <SiteHeader tagline="SIMULATION LAB" />

      <div className="relative">
        {mounted === 'menu' && (
          <FadeBox visible={visible}>
            <MainMenu onStart={() => setView('simulation')} />
          </FadeBox>
        )}
        {mounted === 'simulation' && (
          <FadeBox visible={visible}>
            <Simulation onExit={() => setView('menu')} />
          </FadeBox>
        )}
        {mounted === 'calhoun' && (
          <FadeBox visible={visible}>
            <CalhounSimulation onExit={() => setView('menu')} />
          </FadeBox>
        )}
      </div>
    </div>
  );
}

function FadeBox({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms var(--motion-ease)`,
      }}
    >
      {children}
    </div>
  );
}
