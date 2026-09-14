'use client';

import Link from 'next/link';
import { Walkthrough, Section, Code, Aside } from '../_components/Walkthrough';
import {
  APPLOADER_SNIPPET,
  SESSION_SNIPPET,
  BINARY_SNIPPET,
  PRELOAD_SNIPPET,
  REPLAY_SNIPPET,
} from './_snippets';

export default function LandingFlowWalkthrough() {
  return (
    <Walkthrough
      eyebrow="[ /wc/learn/landing-flow / wip ]"
      title="The cinematic boot flow"
      intro={
        <p>
          The homepage has two stages: a cyberpunk loading screen assembles
          binary digits into a 3D shape, then a warm Chicago skyline becomes
          the live homepage. A small boot gate owns the timing, the fade, and
          the session skip so those two rooms never compete on screen.
        </p>
      }
    >
      <Section title="One Canvas, then ordinary HTML">
        <p>
          Only <code className="font-mono text-[color:var(--accent-soft)]">LoadingScreen</code>{' '}
          mounts a React Three Fiber{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">&lt;Canvas&gt;</code>.
          The destination,{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">NewLandingPage</code>,
          uses HTML controls and a CSS-filtered skyline image. The swap is still
          mutually exclusive: the loading subtree unmounts before the homepage
          subtree mounts.
        </p>
        <p>
          <code className="font-mono text-[color:var(--accent-soft)]">AppLoader</code>{' '}
          holds the boot for 3.5 seconds. It first flips{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">isReady</code>{' '}
          to fade the loading screen over 600 ms, then flips{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">showChildren</code>{' '}
          to perform the actual React-tree swap.
        </p>
        <Code>{APPLOADER_SNIPPET}</Code>
        <Aside>
          The empty <code className="font-mono">onFinished</code> callback is
          intentional in the current wiring. Asset progress animates the boot
          scene, but the fixed window controls when the page advances.
        </Aside>
      </Section>

      <Section title="Run the live handoff">
        <p>
          The real sequence is the clearest demo. The query flag forces the boot
          even if this tab already carries the session marker.
        </p>
        <p>
          <Link href="/?boot=1" className="themed-button inline-block px-5 py-2.5 font-mono text-xs uppercase tracking-widest">
            replay the boot sequence
          </Link>
        </p>
      </Section>

      <Section title="Skip within a session">
        <p>
          On mount, <code className="font-mono text-[color:var(--accent-soft)]">AppLoader</code>{' '}
          checks <code className="font-mono text-[color:var(--accent-soft)]">sessionStorage</code>{' '}
          for <code className="font-mono text-[color:var(--accent-soft)]">mythcorp-booted=1</code>.
          A returning mount in the same tab jumps straight to the homepage. The{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">?boot</code>{' '}
          query bypasses that check for a deliberate replay.
        </p>
        <Code>{SESSION_SNIPPET}</Code>
        <Aside>
          Storage and URL access are guarded so a blocked browser API does not
          take down the homepage. If storage is unavailable, the boot simply
          runs without remembering the visit.
        </Aside>
      </Section>

      <Section title="LoadingScreen: shapes from binary digits">
        <p>
          The loading room renders 500 binary-digit components. Each digit is a{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">&lt;Text&gt;</code>{' '}
          mesh from <code className="font-mono text-[color:var(--accent-soft)]">@react-three/drei</code>{' '}
          and belongs to a sphere, cube, or torus chosen when the screen mounts.
        </p>
        <p>
          Every digit starts at five times its target position and lerps inward
          as <code className="font-mono text-[color:var(--accent-soft)]">useProgress()</code>{' '}
          moves toward 100. That value comes from drei&rsquo;s asset-loading queue.
          It drives the shape and progress readout, while the boot gate keeps
          the screen visible for the full cinematic window.
        </p>
        <Code>{BINARY_SNIPPET}</Code>
      </Section>

      <Section title="Prepare the destination early">
        <p>
          The root layout preloads the Chicago skyline before either stage
          renders. The request can run during the boot window, so the destination
          does not begin with an image waterfall when{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">NewLandingPage</code>{' '}
          mounts.
        </p>
        <Code>{PRELOAD_SNIPPET}</Code>
        <p>
          The landing room then composes{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">SkylineBackdrop</code>,{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">HeroTitle</code>,
          and the primary button as normal page content. Entering the 3D
          experience routes to <code className="font-mono text-[color:var(--accent-soft)]">/experience</code>.
        </p>
      </Section>

      <Section title="Replay without a page reload">
        <p>
          The homepage&rsquo;s corner rail offers the same replay in place. It clears
          the session marker and increments a key, which remounts{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">AppLoader</code>{' '}
          with fresh state. The two-stage sequence then follows the same path as
          a cold visit.
        </p>
        <Code>{REPLAY_SNIPPET}</Code>
      </Section>

      <Section title="Where to look">
        <ul className="list-inside list-disc space-y-1 break-all font-mono text-sm">
          <li><code>src/app/page.tsx</code>, boot timing, session skip, and replay</li>
          <li><code>src/app/components/LoadingScreen.tsx</code>, binary digit shapes</li>
          <li><code>src/app/components/NewLandingPage.tsx</code>, the warm homepage</li>
          <li><code>src/app/components/landing/</code>, skyline, title, and modals</li>
          <li><code>src/app/layout.tsx</code>, destination asset preloads</li>
        </ul>
      </Section>
    </Walkthrough>
  );
}
