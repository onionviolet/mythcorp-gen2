// Snippet strings for the landing-flow walkthrough, separate from the page's
// presentation.

export const APPLOADER_SNIPPET = `const LOADING_DURATION_MS = 3500;

function AppLoader({ children }) {
  const [isReady, setIsReady] = useState(false);
  const [showChildren, setShowChildren] = useState(false);
  const [skipBoot, setSkipBoot] = useState(null);

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

  if (skipBoot === null) return null;
  if (showChildren) return <>{children}</>;

  return (
    <div style={{ opacity: isReady ? 0 : 1, transition: 'opacity 600ms ease' }}>
      <LoadingScreen onFinished={() => {}} />
    </div>
  );
}`;

export const SESSION_SNIPPET = `useEffect(() => {
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
      /* fall through */
    }
  }

  setSkipBoot(alreadyBooted);
  if (alreadyBooted) {
    setIsReady(true);
    setShowChildren(true);
    return;
  }

  try { sessionStorage.setItem(SESSION_BOOTED_KEY, '1'); } catch { /* ignore */ }
}, []);`;

export const BINARY_SNIPPET = `// Inside BinaryDigit, position lerps from start to end each frame.
useFrame(() => {
  if (textRef.current) {
    textRef.current.position.lerpVectors(startPosition, endPosition, progress);
  }
});

// Start position is end * 5, so digits fly in from five times the distance.
const startPos = endPos.clone().multiplyScalar(5);`;

export const PRELOAD_SNIPPET = `<link
  rel="preload"
  href="/chicagoskyline.jpg"
  as="image"
/>`;

export const REPLAY_SNIPPET = `const [bootNonce, setBootNonce] = useState(0);

const replayIntro = () => {
  try {
    sessionStorage.removeItem(SESSION_BOOTED_KEY);
  } catch {
    /* ignore */
  }
  setBootNonce((n) => n + 1);
};

<AppLoader key={bootNonce}>
  <NewLandingPage
    onEnterExperience={() => router.push('/experience')}
    onReplayIntro={replayIntro}
  />
</AppLoader>`;
