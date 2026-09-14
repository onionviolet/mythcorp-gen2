'use client';

// Walkthrough: /wc/learn/landing-flow

import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoadingScreen } from './components/LoadingScreen';
import { NewLandingPage } from './components/NewLandingPage';

const LOADING_DURATION_MS = 3500;
const SESSION_BOOTED_KEY = 'mythcorp-booted';

/**
 * Holds the LoadingScreen on top of the rest of the app for a fixed
 * window, then unmounts it and mounts the children. The two are
 * mutually exclusive so only one R3F Canvas exists at a time.
 *
 * Boot sequence only runs on the first visit per browser session. If
 * sessionStorage says you've already booted once, we skip straight to
 * the children. Refreshing the page still re-runs boot only if you
 * close the tab in between.
 *
 */
function AppLoader({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [showChildren, setShowChildren] = useState(false);
  const [skipBoot, setSkipBoot] = useState<boolean | null>(null);

  // First mount: check sessionStorage for the booted flag. `?boot` (or a
  // replay, which remounts this component with the flag cleared) forces the
  // boot sequence to run again so the LoadingScreen can be appreciated past
  // the first visit.
  useEffect(() => {
    let forceBoot = false;
    try {
      forceBoot = new URLSearchParams(window.location.search).has('boot');
    } catch {
      /* ignore */
    }
    let alreadyBooted = false;
    if (!forceBoot) {
      try {
        alreadyBooted = sessionStorage.getItem(SESSION_BOOTED_KEY) === '1';
      } catch {
        // sessionStorage may be unavailable (private mode, etc.); fall through.
      }
    }
    setSkipBoot(alreadyBooted);
    if (alreadyBooted) {
      setIsReady(true);
      setShowChildren(true);
      return;
    }
    try {
      sessionStorage.setItem(SESSION_BOOTED_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  // Fixed window for the boot sequence. After it elapses, fade out the
  // LoadingScreen, then swap to children once the fade completes.
  useEffect(() => {
    if (skipBoot !== false) return;
    const fadeTimer = setTimeout(() => setIsReady(true), LOADING_DURATION_MS);
    return () => clearTimeout(fadeTimer);
  }, [skipBoot]);

  useEffect(() => {
    if (!isReady || skipBoot === true) return;
    const swapTimer = setTimeout(() => setShowChildren(true), 600);
    return () => clearTimeout(swapTimer);
  }, [isReady, skipBoot]);

  // Wait for sessionStorage check before rendering anything (avoids flash).
  if (skipBoot === null) return null;

  if (showChildren) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        opacity: isReady ? 0 : 1,
        transition: 'opacity 600ms ease',
        height: '100%',
        width: '100%',
      }}
    >
      <LoadingScreen onFinished={() => {}} />
    </div>
  );
}

/**
 * The cinematic entry: LoadingScreen (cyberpunk boot)
 *   to NewLandingPage (the warm reveal, DISCOVER YOUR POTENTIAL)
 *   to /experience (real route, full 3D scene)
 */
export default function HomePage() {
  const router = useRouter();
  
  // Bumping this remounts AppLoader; paired with clearing the session flag it
  // re-runs the full boot sequence in place.
  const [bootNonce, setBootNonce] = useState(0);

  const replayIntro = () => {
    try {
      sessionStorage.removeItem(SESSION_BOOTED_KEY);
    } catch {
      /* ignore */
    }
    setBootNonce((n) => n + 1);
  };

  return (
    <main className="h-screen w-screen bg-[color:var(--bg)]">
      <Suspense fallback={<LoadingScreen onFinished={() => {}} />}>
        <AppLoader key={bootNonce}>
          <NewLandingPage
            onEnterExperience={() => router.push('/experience')}
            onReplayIntro={replayIntro}
          />
        </AppLoader>
      </Suspense>
    </main>
  );
}


