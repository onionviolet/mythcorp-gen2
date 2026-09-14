'use client';

import { Walkthrough, Section, Code, Aside } from '../_components/Walkthrough';
import { DemoPanel } from '../_components/DemoPanel';
import { TokenPlayground } from '../_components/TokenPlayground';
import { MiniStarFieldDemo } from '../_components/MiniStarFieldDemo';

export default function BuildAPlaygroundWalkthrough() {
  return (
    <Walkthrough
      eyebrow="[ /wc/learn/build-a-playground / wip ]"
      title="The playground that explains playgrounds"
      intro={
        <p>
          The other walkthroughs let you poke the real site: recolor its tokens,
          then crank its star density. This one is about the three small pieces
          that make that possible, and it embeds each of them as it describes
          them. The demos on this page are the components on this page.
        </p>
      }
    >
      <Section title="DemoPanel: code on the left, life on the right">
        <p>
          Every live example sits in a{' '}
          <code className="font-mono text-[color:var(--accent-soft)]">DemoPanel</code>:
          a dumb layout shell that puts source beside a running demo on wide
          screens and stacks them on a phone. It carries no state and knows
          nothing about what it wraps, so the same shell holds a color picker, a
          3D canvas, or a stepper without changing.
        </p>
        <p>
          The one trick it does play is width. The reading column is{' '}
          <code className="font-mono">max-w-2xl</code>, too narrow for two useful
          panes, so DemoPanel breaks out to a wider centered band with a
          transform, leaving the article and the shared{' '}
          <code className="font-mono">Walkthrough</code> layout untouched.
        </p>
        <Code filename="DemoPanel.tsx" highlight={[1]}>{`<div className="md:relative md:left-1/2 md:w-[min(56rem,92vw)] md:-translate-x-1/2">
  <div className="grid gap-4 md:grid-cols-2 md:items-start">
    <div>{code}</div>
    <div className="relative ...">
      <span className="... LIVE pill ..." />
      {demo}
    </div>
  </div>
</div>`}</Code>
        <Aside>
          Breaking out with{' '}
          <code className="font-mono">left-1/2</code> +{' '}
          <code className="font-mono">-translate-x-1/2</code> keeps the band
          centered on the viewport regardless of the article&rsquo;s own width,
          so nothing upstream has to know the panel exists.
        </Aside>
      </Section>

      <Section title="TokenPlayground: edit the live CSS variables">
        <p>
          The theme system is nothing but CSS custom properties on{' '}
          <code className="font-mono">&lt;html&gt;</code>. That means a playground
          can edit the real ones. TokenPlayground reads the current values with{' '}
          <code className="font-mono">getComputedStyle</code>, then writes your
          picks back with{' '}
          <code className="font-mono">setProperty</code>. Drag a swatch and the
          whole page moves, because the whole page reads the same variables.
        </p>
        <DemoPanel
          code={
            <Code filename="TokenPlayground.tsx" highlight={[2, 6]}>{`// seed the pickers from the live values
const seed = getComputedStyle(root).getPropertyValue('--accent');

// on change, override the token inline (beats [data-theme])
function setToken(name, hex) {
  root.style.setProperty(name, hex);
  dirty.current.add(name);   // remember what we touched
}`}</Code>
          }
          demo={<TokenPlayground />}
        />
        <p>
          The dangerous version of this would leave the site recolored after you
          leave, or fight with the saved theme. TokenPlayground avoids that by
          being strict about ownership: it tracks every property it overrides in
          a ref and removes exactly those, never a token it did not set.
        </p>
        <Code filename="cleanup contract" highlight={[2, 3, 4]}>{`// clear our overrides on three triggers, and nothing else:
//   - Reset button
//   - unmount (navigating away)
//   - theme change (subscribed via useTheme)
for (const name of dirty.current) root.style.removeProperty(name);
dirty.current.clear();`}</Code>
        <Aside>
          It never writes <code className="font-mono">localStorage</code> and
          never sets <code className="font-mono">dataset.theme</code>. Switch
          themes from the header while your overrides are live and they clear
          themselves, so your persisted theme is always the real one.
        </Aside>
      </Section>

      <Section title="MiniStarField: an R3F canvas, loaded late">
        <p>
          The star field is a genuine React Three Fiber scene, just a small one:
          a fixed 280px canvas, a hard{' '}
          <code className="font-mono">MINI_MAX_STARS = 3000</code> clamp, a
          theme-matched background, and no GLB or bloom so there is nothing to
          preload. The interesting part is how it loads.
        </p>
        <DemoPanel
          label="R3F"
          code={
            <Code filename="MiniStarFieldDemo.tsx" highlight={[1, 2, 3]}>{`const MiniStarField = dynamic(
  () => import('./MiniStarField').then((m) => m.MiniStarField),
  { ssr: false, loading: () => <Skeleton h={280} /> },
);

// reset must not reuse one object reference twice
const getMiniDefaults = () => ({ ...MINI_DEFAULTS });`}</Code>
          }
          demo={<MiniStarFieldDemo />}
        />
        <p>
          R3F reaches for WebGL the moment it is imported, which the server
          cannot provide, so it loads through{' '}
          <code className="font-mono">next/dynamic</code> with{' '}
          <code className="font-mono">ssr: false</code>. The height-matched
          skeleton holds the layout so the article does not lurch when the canvas
          arrives. And the reset button spreads a fresh defaults object every
          time, the same discipline the full Simulation had to learn the hard
          way.
        </p>
      </Section>

      <Section title="The pattern underneath all three">
        <p>
          None of these use a sandbox library. There is no Sandpack, no bundled
          editor, no iframe. Each playground drives the actual component the page
          is built from, which is the whole point: the demo cannot drift from the
          real thing, because it is the real thing. The cost is that each one is
          hand-built, and the payoff is that they weigh almost nothing and always
          tell the truth.
        </p>
        <Aside>
          Want to add a live figure to a walkthrough? Write the interactive piece
          as a normal client component in{' '}
          <code className="font-mono">_components/</code>, drop it into a{' '}
          <code className="font-mono">DemoPanel</code> next to a{' '}
          <code className="font-mono">Code</code> block, and if it renders a
          canvas, load it with <code className="font-mono">ssr: false</code>.
          That is the entire recipe.
        </Aside>
      </Section>

      <Section title="Where to look">
        <ul className="list-inside list-disc space-y-1 break-all font-mono text-sm">
          <li><code>src/app/wc/learn/_components/DemoPanel.tsx</code>, the side-by-side shell</li>
          <li><code>src/app/wc/learn/_components/TokenPlayground.tsx</code>, live CSS-variable editor</li>
          <li><code>src/app/wc/learn/_components/MiniStarField.tsx</code>, the pocket R3F scene</li>
          <li><code>src/app/wc/learn/_components/MiniStarFieldDemo.tsx</code>, its controls + ssr:false loader</li>
          <li><code>src/app/wc/learn/_components/Walkthrough.tsx</code>, Code with filename + highlight</li>
        </ul>
      </Section>
    </Walkthrough>
  );
}
