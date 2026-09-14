'use client';

import { Section, Code, Aside } from '../_components/Walkthrough';

/**
 * The Canvas UI half of the plain-mode walkthrough. It has its own content and
 * presentation responsibility.
 */
export function CanvasUiSections() {
  return (
    <>
      <Section title="Borrowing someone else's shaders">
        <p>
          The style picker on the holding screen runs{' '}
          <a
            href="https://canvasui.dev"
            className="text-[color:var(--accent)] underline underline-offset-4"
            target="_blank"
            rel="noreferrer noopener"
          >
            Canvas UI
          </a>
          , a library with two halves. Most of it reads your live DOM and
          redraws it inside a canvas, so a shader can run over real text that is
          still selectable. The half this screen uses does something simpler and
          far more portable: it loads a model and renders it into a scene of its
          own, touching the page not at all.
        </p>
        <p>
          It is not an npm dependency. Components ship as source through a
          shadcn registry, so each one arrives as a single self-contained file
          and <code className="font-mono">package.json</code> never changes.
          That is the whole install:
        </p>
        <Code>{`npx shadcn@latest add https://canvasui.dev/r/glyph-rain-react.json

# or just read files[0].content out of that JSON
# and write it yourself, which is what happened here`}</Code>
        <Aside>
          Several components (DecryptReveal, RetroDither, ForceField,
          ParticleObject, LiquidObject) import a{' '}
          <code className="font-mono">rect-cache</code> helper that no registry
          entry ships and that is not in the registry index, so installing them
          straight does not compile. It is 26 lines in the upstream repo at{' '}
          <code className="font-mono">src/lib/rect-cache.ts</code>, copied in by
          hand. Worth re-checking before updating them.
        </Aside>
      </Section>

      <Section title="The caveat that shaped the design, and the way out of it">
        <p>
          The half of the library that resamples the page depends on an
          experimental Chrome feature behind{' '}
          <code className="font-mono">chrome://flags/#canvas-draw-element</code>.
          Without the flag those components are inert: the children render as
          ordinary HTML and the effect does nothing. An earlier pass of this
          screen shipped six of them behind a picker that starred the four most
          visitors could not see, which is an honest label on a bad deal.
        </p>
        <p>
          The <code className="font-mono">*-object</code> family has no such
          gate, because it never reads the page. It loads a GLB and renders it
          into its own scene, which is ordinary WebGL, so it works in every
          browser. That is the whole reason the screen now runs one model in
          four styles rather than six effects over the DOM: every visitor sees
          the same thing.
        </p>
        <p>
          Three more were tried and cut. <em>Halftone</em>, <em>bayer</em> and{' '}
          <em>glass</em> quantize or refract whatever sits behind the model, and
          here that is transparency, so the spectre simply disappeared. Giving
          them an opaque backdrop fixes them and paints a rectangle across the
          middle of the field, which costs more than the styles are worth.
        </p>
        <p>
          The wordmark was never one of these. The theme&rsquo;s own ASCII field
          is plain 2D canvas with no feature gate, so <em>work in progress</em>{' '}
          renders for every visitor on every browser.
        </p>
      </Section>

      <Section title="Four styles, none of them in the bundle">
        <p>
          Each component is a megabyte of WebGL carrying its own copy of the
          loader stack. Imported normally they would land in the shared chunk
          and be paid for by every visitor to every page, including the three
          themes that never show them. They are dynamic imports instead, so the
          holding screen ships none of them until a style is picked, and the
          shared bundle stays at 101 kB.
        </p>
        <Code>{`const AsciiObject = dynamic(
  () => import('../canvasui/AsciiObject').then((m) => m.AsciiObject),
  { ssr: false },   // must be an inline literal
);`}</Code>
        <p>
          The options object has to be written inline.{' '}
          <code className="font-mono">next/dynamic</code> reads it at compile
          time, so hoisting <code className="font-mono">{'{ ssr: false }'}</code>{' '}
          into a shared constant fails the build with{' '}
          <code className="font-mono">
            next/dynamic options must be an object literal
          </code>
          . <code className="font-mono">ssr: false</code> is not optional here:
          every one of them reaches for a canvas on mount.
        </p>
        <p>
          Every option passed to them exists to drag the component back to
          monochrome. The library ships blue and neon by default, which is the
          one thing this theme cannot have.
        </p>
      </Section>
    </>
  );
}
