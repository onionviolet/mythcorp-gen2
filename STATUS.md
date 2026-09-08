# STATUS

## Lander copy cleanup, 2026-09-08

Removed the field interaction hint below Tune composition at the user's request.

## Click and tap response, 2026-09-08

Primary clicks now publish one bounded 620ms pulse through the shared pointer
store. A faint expanding ring and nearby DOM text erosion use the same radius
and progress. The ASCII field retains its existing press impulse. New taps
replace the pulse, with a 110ms cooldown; no growing effect queue or idle frame
loop is introduced. Touch release clears hover while letting the short pulse
finish. Blur and pointer leave cancel it.

Controls are excluded from both the new pulse and the existing field press
impulse, and receive a small active outline instead. Reduced-motion disables
the pulse and leaves control feedback static. Existing vendor model interaction
is unchanged; this pass does not add model-wide scattering or press-and-hold.

Validation: npm run check passed; pulse intensity and boundary assertions
passed. Browser inspection confirmed a visible ring and text disturbance,
then zero ring opacity after a scene control click, with no captured errors.
Physical touch and reduced-motion emulation remain unverified.

## Transparent Tune controls, 2026-09-08

Removed both the expanded Tune background and the readout gradient so the
spectre remains visible behind the controls. This supersedes the opaque
backdrop choice recorded in the earlier lander pass.

## Pending lander art direction, 2026-09-08

The pending lander is the preferred visual direction. This pass focuses on
that installation rather than extending the interior wireframe treatment.
Four named compositions now drive initial selection and the scene control:
Trace, Suspension, Drift and Surface. Each combines a deliberate model, message
and overlay within the existing noise budget. The old budgeted randomizer
remains available to its existing consumers; initial lander selection uses
the authored set. Individual controls remain under Tune composition, and
manual changes identify themselves as Custom.

Type resolves first, then the specimen, then the readout. This entrance uses
plain-specific CSS timing tokens with no entrance animation under reduced
motion. It does not claim to pause every existing canvas effect. The model
has more separation from the headline, the default readout is shorter, and
expanded tuning gets an opaque backdrop. Short viewports can scroll instead
of clipping the controls. Primary touch and pen release/cancel now clear the
shared text pointer, preventing a stale eroded spot after contact ends.

Validation includes the production check and the roll check, including new
assertions that the authored compositions are unique and within budget.
Browser checks exercised all four renderers, keyboard scene cycling, manual
Custom state, and light/dark layouts. Touch release is code-reviewed, not
physical-device verified. The entrance does not wait for model asset readiness;
a slow first fetch can still delay the specimen. No deployment or opening of
the held routes is included. Earlier interior edits remain local.

## Interior design pass, 2026-09-08

The simulation entry now uses an asymmetric editorial hero and a Three.js
orientation study instead of three equal stat cards. Its native range control
updates the actual model angle with keyboard and touch support. The canvas
renders on demand, caps DPR at 1.5, and has an interactive SVG fallback for
unavailable WebGL or a scene error. GSAP sequences the entry using theme timing
and reverts it on theme changes or reduced-motion preference changes. The
skyline is subdued in paper mode for readable dark text. No dependencies added.

The workshop promotes the existing AI cybercrime draft, with secondary rooms
reduced to a quieter directory. About now explains the project and links to
its actual work; a personal timeline remains pending real source material.

Validation: full lint, text policy, production build and TypeScript checks.
Browser inspection covered the rendered instrument in cyberpunk, luxury and
paper, keyboard angle updates, and mobile workshop and About at 390px. Plain
held-route and open contact behavior were also observed. The browser logged
Three.Clock deprecation warnings from the current renderer dependencies, with
no captured errors. Reduced-motion and WebGL failure branches were inspected
in code, not failure-injected. This is a local pass, not an award-readiness,
performance or full accessibility certification. The plain holding screen
continues to gate the interiors by design.


## Dependency upgrade, and `ink` cut for drawing nothing, 2026-09-05

**The stay-on-15 upgrade is done.** The binding constraint was that
`@opennextjs/cloudflare@1.20.6` needs `next >=15.5.24` and `wrangler
^4.125.0`, so the adapter could not move alone and Next could not move without
it. All three went together:

| | from | to |
|---|---|---|
| next | 15.3.3 | 15.5.25 |
| @opennextjs/cloudflare | 1.3.0 | 1.20.6 |
| wrangler | 4.92 | 4.129 |
| react, react-dom | 19.0.0 | 19.2.8 |
| three | 0.178 | 0.185.1 |
| @react-three/fiber, drei, postprocessing | | latest |
| tailwindcss, @tailwindcss/postcss | 4.1.x | 4.3.3 |
| gsap, tsx, @eslint/eslintrc, @types/react(-dom) | | latest |

Deliberately held, all majors with nothing forcing them: **typescript 5.8 (7.0
is the rewrite), eslint 9 (10), next 16, @types/node 24 (26)**. The repo's
pinning convention was preserved: exact for framework and toolchain, caret for
libraries.

Two notes for next time. npm now blocks install scripts, so `workerd` and
`esbuild` postinstalls did not run; that turned out not to matter because the
platform packages ship their binaries, and `wrangler --version` was checked
before trusting the deploy. And `npm run check` overwrites `.next` under a
running dev server, which is documented above and bit again here: the page went
blank and the fix is to restart dev, not to debug the page.

### `ink` is cut from the holding screen

It draws nothing. Ruled out one at a time: not the `three` upgrade (blank on
0.178 as well as 0.185, tested by pinning back), not the scheme (blank in light
and dark), not the viewport aspect (blank tall and wide), not screenshot scale,
and not `HoldStage`'s props, because it renders blank in `/wc/lab/canvas` too
under a completely different prop set. The GLB fetches 200 and nothing is
logged. It did render earlier the same day, so it is intermittent rather than
dead.

This is the **third** time this component has failed this way here: the file's
own comment already blamed the same silent failure for killing the ink
treatment of the message and the `etch` variant. A one in five chance of an
empty stage on the only page visitors can see is worse than four styles that
always work, so `ink` is out of `HOLD_STYLES`. `InkObject.tsx` stays vendored
and stays in the lab, which is where to debug it, and putting the string back
in `HOLD_STYLES` restores it.

Roll re-checked: 96 combinations, 61 reachable, budget never exceeded, nothing
starved. Cycling verified as particle, swarm, liquid, ascii.

### A gap in the earlier sweeps, worth naming

The 120-combination sweeps checked for thrown errors, error boundaries and
canvas count. `ink` passed all three while rendering a blank canvas, which is
exactly how it survived. Mounting is not rendering, and a sweep that cannot
see pixels cannot tell the difference.


## The catalogue is closed, and the readout is the console, 2026-09-05

**Fire, both of it, auditioned and cut.** `blaze` was vendored from the
registry for this and `flame-wrap` was already here.

- `edge` (`FlameWrap`) drew literally nothing, for a structural reason worth
  keeping: FlameWrap outlines an ELEMENT, and with no children there is no
  element to trace. It is a border effect, not a layer, and it was never going
  to work as one.
- `blaze` (`Blaze`) rendered, but monochrome fire is just moving grey specks,
  and this screen already has a better name for those: the `dust` message. It
  is the single strongest argument for ever allowing one hue into plain mode.
  Until that is a decision, it stays out. `Blaze.tsx` stays vendored and is
  recorded in the canvasui README so it is not a mystery later.

That closes the catalogue. Everything left in the registry either resamples the
page (`bend`, `cloth`, `peel`, `shatter`, `vhs`, `displacement`, `canvas`,
`particle-reveal`, `particle-scroll`) and so cannot work over a transparent
backdrop, or has already been tried.

**The pickers are gone and the readout is the console.** Fifteen buttons in
three rows sat under the model, and every one of them duplicated a line the
readout was already printing. On a phone they wrapped into a block taller than
the model itself. Now `render`, `words` and `over` are rows in the readout that
cycle when clicked, with a hint line underneath, and the whole bottom-left
block is empty space. The scheme picker stays where it was: light and dark is
the one control a visitor may actually go looking for.

One detail that would have shipped looking like a bug: browsers set
`text-transform: none` on form controls, so the three clickable values rendered
lowercase while every read-only value around them was caps. `uppercase` is
repeated on the button for that reason.

### A real hydration error, found and fixed

Wrapping the readout in `DisturbedText` broke hydration on every load, and the
cause is worth writing down because it is not obvious. One span per character
means that when text differs between server and client, the CHILD COUNT
differs, and `suppressHydrationWarning` covers text content but not structure.
The elapsed clock counts from module load, which on the server is process
start, so it routinely rendered a different number of characters. Adding the
attribute to the spans did nothing. The fix is that `DisturbedText` renders a
single plain text node until after hydration and only then splits into
characters, which makes the server and the first client pass identical by
construction.

### Verified

All **120** combinations, driven through the new cycling controls: 133
observations, 0 failures, 0 errors captured, every combination mounting at
least one canvas. A fresh tab loads with an empty console, which is how the
hydration fix was confirmed: console history survives same-tab navigation, so
a stale error there is not evidence of a live one.


## Four more auditioned, one kept, 2026-09-05

`HexFloat`, `Grid`, `Liquid` and `Laser` were wired as overlays and judged on
the real screen, same method as frost. One survived.

- **scan** (`Laser`), **kept**. A single beam with a soft bloom sweeping the
  lower third. Diegetic, quiet, and it reads as the screen measuring something,
  which is the register this page is already in.
- **grid** (`Grid`), cut. It maps the page onto 3D tiles, and with no page to
  map it fills them with flat tint: opaque grey rectangles sitting on the
  spectre and half the readout. The backdrop trap, a fourth time.
- **fluid** (`Liquid`), cut. It works and it is strongly cursor-driven, but it
  paints a milky smear over the readout at any strength worth having, and more
  importantly it competes with this theme's own ASCII fluid. We already have a
  fluid, it is ours, and it is the one with the story. Tunable if that changes.
- **tiles** (`HexFloat`), cut for redundancy rather than failure. It rendered
  fine, but dark and mostly at the edges, and it is hexagons, which `shield`
  already does better because its lattice actually lights under the cursor.

Six overlays now, all of which draw their own geometry. The roll re-checked:
120 combinations, 80 reachable, budget never exceeded, nothing starved, `none`
down to 40%.

**The whole matrix was swept again**, 5 styles x 4 messages x 6 overlays = 120,
every one driven through the real pickers: 120 tested, 0 failures, 0 errors
captured, every combination mounting at least one canvas. The sweep loses one
combination to a race if a timed-out call keeps running in the background, so
diff the tested set against the full list and retest the remainder, which is
what caught `particle/dust/drops` here.

The rule these auditions keep confirming, now written into `HoldOverlay.tsx`
with all five cut components named: on this screen only components that draw
their OWN geometry survive, because anything that samples or refracts its
backdrop has no backdrop to work with.


## Erosion on every piece of text, and all 100 combinations tested, 2026-09-05

**The cursor now disturbs every string on the holding screen**, not just the
decorative three: the readout's labels and values, all four picker rows, and
the reachable contact links in the corner. The ink meter is passed through
untouched, because it is already glyphs rather than text.

Two things that had to be right before this was safe to turn on:

- **The real string is always in the DOM.** `DisturbedText` renders an
  `sr-only` copy and marks the eroded one `aria-hidden`. Without that, turning
  this on for the readout and the pickers would have handed a screen reader a
  mouthful of ramp glyphs, and `aria-pressed` on the picker buttons would have
  had nothing honest to name.
- **`strength` governs how far text may FADE, not whether it erodes.** The
  first version held the true character back until a cell was almost fully
  heated, which at the readout's 11px meant roughly one character in a line
  ever changed. It looked like it was working in code and did nothing on
  screen. Interactive text now erodes fully but barely fades, so a label is
  still readable with the cursor sitting on it. `MIN_REACH` also went to 32 so
  small text gets a bite about four characters wide instead of one.

**Every combination was tested, not sampled.** An in-page harness drove all
5 x 4 x 5 = 100 style, message and overlay combinations, clicking through the
real pickers and recording error-boundary state, mounted canvas count, and any
window error or `console.error`. Result: **100 tested, 0 failures, 0 errors
captured**, every combination mounting at least one canvas. Note for whoever
repeats this: a hidden Browser pane throttles `setTimeout` to about six seconds
per iteration, so front the tab first, which takes the whole sweep to about 18
seconds.

### Still open, and deliberately not done

Two requests were raised that fight `DESIGN.md` rather than fitting it, so they
are written down instead of shipped:

- **Colour after the first visit.** Plain mode is monochrome by definition and
  DESIGN.md forbids adding a hue. An in-keeping version exists (one accent, in
  exactly one place, on repeat visits only) but it is a deliberate change to
  the theme's identity and should be a decision, not a side effect.
- **Glow.** DESIGN.md bans glow outside cyberpunk and luxury. Worth knowing
  there is already a precedent: the rain overlay runs with `glow: 0.35` and a
  lit drop head, so the rule is already bent where a component draws its own
  light.


## Two more overlays, because ascii and ink can never answer the cursor, 2026-09-05

`AsciiObject` and `InkObject` contain **zero** references to the pointer. Not a
prop turned off, not a listener blocked by the fix above: the code does not
exist. So two of the five model styles can never respond to you, and no amount
of configuration changes that. Counted across the folder: ParticleObject 36,
LiquidObject 43, Frost 77, GlyphRain 23, ForceField 16, AsciiObject 0,
InkObject 0.

The fix is not to make the model react, it is to make sure something else on
screen does. Eight vendored components were sitting unused, offered only in the
lab and never on the holding screen. Three were auditioned as overlays:

- **fog** (`Clouds`), kept. Its own drifting geometry, monochrome, and the
  message and readout stay readable underneath.
- **drops** (`Droplets`), kept. Rain running down the screen, subtle, and the
  cursor clears a path through it.
- **frost** (`Frost`), cut, and this is the useful failure. It answers the
  cursor harder than anything else in the library and its whole mechanic is
  hovering to melt a hole through the ice. But it refracts what is behind it,
  and behind it here is transparency, so it rendered as a murky dark blob
  sitting on top of the spectre. That is the same failure that killed the
  dither and glass models earlier, which makes it three times. The rule now
  written into `HoldOverlay.tsx`: on this screen only components that draw
  their OWN geometry survive, because anything that samples or refracts its
  backdrop has no backdrop to work with.

Weights and the roll updated: 100 combinations, 65 reachable, budget never
exceeded, nothing starved. `none` fell from 55% to 44%, so a majority of visits
now carry an overlay, and every overlay is cursor-reactive. Between that, the
fluid field and the text erosion, an ascii or ink visit still has three things
that answer the pointer even though the model itself cannot.


## The cursor was never reaching the effects, 2026-09-05

Every vendored component on the holding screen binds its pointer listeners
inside its own subtree, and every one of them was mounted inside a
`pointer-events-none` wrapper. A canvas under a non-interactive parent never
receives a pointermove, so the half of each effect that responds to you had
been silently switched off since the day it was wired in.

What was dead, and where each one listens:

| Component | Listens on | What was lost |
|---|---|---|
| `ParticleObject` (spectre, and the `dust` message) | its own canvas | The cursor push. The cloud that is supposed to scatter under your hand just floated |
| `LiquidObject` | its own canvas | The drag through the fluid |
| `GlyphRain` | its own wrapper | `stir`, and the light it casts where you are |
| `ForceField` | its content div | `gridReveal="hover"`. Not a flourish: the lattice only lights where the cursor crosses it, so that was the entire mechanic |

`AsciiObject` and `InkObject` register no pointer listeners at all, so they stay
inert on purpose rather than by accident, and were left alone.

The fix is `pointer-events: auto` on the components themselves. A child of a
`none` parent is hit-tested again, so the interaction comes back without the
wrapper starting to swallow anything. Safe for the full-screen overlay too,
because it sits at `-z-10`: every picker and link is painted above it and is
hit first, so the overlay only picks up pointers over otherwise empty screen.

Worth noticing why this hid for so long. Nothing errored, nothing logged, and
each component still rendered and animated its idle state beautifully. The only
symptom was an absence, and the comments in `HoldStage` and `HoldMessage`
described the interaction as though it were working, which is the sort of thing
that reads as documentation and functions as a lie.

**Verified in the browser.** With `particle` selected, the cursor punches a
clean void through the cloud and it springs back over the following frames. The
shield's lattice now reads across the screen and responds. Both were confirmed
against a before shot with the pointer parked far away.


## Shipped, 2026-09-05

Deployed to Cloudflare. Version `527f5e3e-ed50-4600-81d4-5238dd0ce561`, live on
**https://mythcorp.org** and the workers.dev host. Verified live: 200 on both,
the origin trial meta tag present and matching `.env`, the pre-paint hold
script intact, and the holding screen rendering a budgeted roll.

**The origin trial token does not appear to do anything yet, and this is the
one thing to chase.** The tag ships correctly, but on the live site in Chrome
148.0.7778.280 `ctx.drawElementImage` and `canvas.requestPaint` still do not
exist, and neither does anything resembling them under another name. Three
candidate explanations are written up in `src/app/components/canvasui/
README.md`. The expensive one, and the one worth ruling out first, is that the
API was renamed when it changed in response to feedback (the trial was extended
for exactly that reason), which would mean `supportsHtmlInCanvas()` is probing
for names that no longer exist and will return false forever. Nothing is broken
either way: every affected component degrades, and nothing on the holding
screen needs the API.

### Dependencies, assessed but not touched

Deliberately not bundled into this deploy. The blocking fact is a coupling:
`@opennextjs/cloudflare@1.20.6` requires `next >=15.5.24 <16 || >=16.3.3` and
`wrangler ^4.125.0`, and we are on next 15.3.3, adapter 1.3.0 (seventeen minors
behind) and wrangler 4.92. So the adapter cannot be updated on its own, and
Next cannot be updated without it. Two coherent routes:

- **Stay on 15.** next 15.3.3 to 15.5.25, adapter to 1.20.6, wrangler to
  4.129. No framework majors, and it clears the adapter debt, which is the
  part that actually deploys this site.
- **Go to 16.** next 16.3.4 plus the same adapter and wrangler bumps, plus
  eslint-config-next 16. A framework major on a site that just shipped.

Checked and safe whenever they are done: three 0.178 to 0.185 (drei wants
>=0.159, fiber >=0.156), react 19.0.0 to 19.2.8 (fiber wants >=19 <19.3),
tailwind 4.1.1 to 4.3.3. Left out of any near-term batch: typescript 5.8 to 7.0
and eslint 9 to 10, both majors with nothing forcing them.


## The roll gets a noise budget, 2026-09-05

The per-visit combination was three independent dice, and nothing stopped them
landing on `rain` over `dust` over `swarm`: a full-screen glyph layer on top of
two separate particle systems, with the message somewhere underneath. Each is
good alone and the pile was noise.

`holdRoll.ts` now prices every option in visual noise, caps the total at 4, and
rolls in order of what the screen is for: the message first because it is the
only thing this page has to say, then the model, then the overlay, which is
decoration and gets whatever is left. The message is never quietened to afford
an overlay. `dust` (3) can now only appear with the cheapest model and no
overlay at all.

The cursor erosion is deliberately not in the budget: it is local to the
pointer and only happens while a hand is actively moving it.

**The first calibration was wrong, and reading it would not have told you.**
Pricing shield and rain a point higher each left the rain on two combinations
out of sixty, about a three percent chance, which is not a rarer effect but an
effect nobody would ever see. Budgets fail quietly in both directions, so
`scripts/check-hold-roll.ts` samples 20,000 rolls and fails the run if anything
exceeds the budget OR if any option drops below a 2% share. Current spread:
none 55%, shield 30%, rain 15%, the four messages about 25% each. Run it with
`npm run check:roll` after touching a weight.


## The type erodes under the cursor, 2026-09-05

The holding screen had one interactive surface, the fluid field, and everything
in front of it was inert type. Now the cursor disturbs the words too.

**One mechanism, three places.** `DisturbedText` takes a line of monospace and
erodes the characters near the pointer into the field's own ramp, fading them
as it goes so the field and the backdrop show through the holes. It is on the
wordmark, on the message when it is rendered as plain type, and on the large
contact backdrop. Deliberately NOT on the readout, whose whole claim is that
every number in it is measured, and not on the contact links, because
scrambling a phone number you are trying to click is a prank rather than a
feature.

**The ramp is the point.** It quantizes with `RAMP` from `asciiRender`, the
same table the fluid uses, rather than the noise charset in `useScramble`.
Those two effects say different things: the scramble is a word arriving, this
is a word being disturbed by the same fluid drawing the message behind it.
Sharing the ramp is what makes the second reading available. Index 0 of that
ramp is a space, which is what lets the hottest cells punch a real hole.

**Reach is measured in characters, not pixels.** The first version used a flat
110px radius, which took a bite out of the 8.5vw message but swallowed the
entire 12px wordmark: the big type read as disturbed and the small type read as
broken. Scaling the radius with the character advance gives both the same
cursor-sized bite and keeps the words legible either side of it, which matters
because one of them is the only thing this screen has to say.

**One listener, not seven.** `holdPointer.ts` is a small store: a single
`pointermove` listener, published on an animation frame rather than on the
event, since a fast mouse fires far more often than the screen refreshes. It
also publishes the pointer as GONE on `pointerleave` and `blur`, because a
merely stale position leaves the type eroded around wherever the cursor was
when it left, which reads as a rendering bug.

Monospace is load-bearing: one character's advance is the element's width over
its length, which holds at any tracking but breaks immediately on proportional
type. Every consumer is `font-mono`. Under prefers-reduced-motion, and on the
server, the text is returned untouched, so nothing moves for anyone who asked
for less and hydration is never at risk.

Also cleared the repo's one lint error while in the file: `document.fonts?.
ready.then(done) ?? done()` in `HoldMessage.tsx` was an unused expression, now
said out loud as an if/else. `src/app/components/plain/` is lint clean.

### Verified

Driven with real hovers at 800px. Cursor away leaves WORK IN / PROGRESS clean;
cursor on WORK gives `=:+% IN` and `@#%GRESS`, with IN and GRESS still legible.
The wordmark erodes about five characters around the pointer and settles back.
The contact backdrop erodes and recovers. `npm run check` green.

**A note for whoever verifies this next.** The Browser pane freezes
requestAnimationFrame whenever it is hidden, which stops this effect, the
scramble and the fluid field all at once, and makes a DOM read taken between
two forced frames look like a stuck or dead component. Two apparent bugs here
were that and nothing else. Force a frame (a screenshot or a real hover) in the
same batch as the read, or front the pane first.


## Canvas UI, four fronts at once, 2026-09-05

The vendored Canvas UI library had one consumer (the holding screen's style
picker) and no other way to see any of it. Four things landed together.

**The bench, `/wc/lab/canvas`.** Every vendored component, live, one at a time,
with its real props on sliders and the current props printed as copyable JSX.
The whole lab has exactly one list of component names in it,
`_components/manifest.ts`, so adding a component is one entry and nothing else.
That file is deliberately over the 250 line cap: it is one flat list, and
splitting it would mean two places to edit per component. Bundle discipline
held, `/wc/lab/canvas` is 12.5 kB and 117 kB first load with 20,800 lines of
WebGL behind it, because every component is a `next/dynamic` import with an
inline `{ ssr: false }` literal and the stage mounts exactly one at a time.

**Eight more components vendored**, chosen by reading each shader's fallback
branch rather than trusting the registry descriptions: Clouds, Droplets,
FlameWrap, Frost, Grid, HexFloat, Laser, Liquid. All eight are the kind that
draw their own geometry and so need no Chrome flag. Two corrections to what the
README used to claim, both verified in the source: **Asciify is not flag-gated
any more**, upstream added a DOM rasterizer fallback, and the four `*Object`
renderers never touched the API at all. The README now carries the
classification for all 18 plus the 17 still unvendored, so nobody re-derives it.

**The origin trial is live but unproven**, see the deploy note above. `layout.tsx` renders one
`<meta http-equiv="origin-trial">` per token in
`NEXT_PUBLIC_ORIGIN_TRIAL_TOKEN`, and a real token is now installed in a
committed `.env`. Decoded, it is `HTMLInCanvas` for `https://mythcorp.org:443`
with `isSubdomain: true`, so it covers `i.mythcorp.org` as well. Confirmed
end to end: the tag renders into all 50 prerendered pages.

`.env` is committed deliberately. An origin trial token is not a secret, it is
served to every visitor in the page source and is worthless off the origin it
names, and `NEXT_PUBLIC_*` is inlined at BUILD time, so a token living only in
a gitignored `.env.local` is a token the deployed site does not have.

**It expires 2026-10-20 and it will fail silently**, so a one-time reminder is
scheduled for 2026-10-06 (`mythcorp-origin-trial-renewal` under
`~/.claude/scheduled-tasks/`) carrying the full renewal procedure. Two origins
are still uncovered and each needs its own registration: the `*.workers.dev`
preview host, and `http://localhost:3000`, which is why the flag-gated
components still cannot be exercised on a dev server.

**The ASCII fluid got a press, and a real touch bug got fixed.** Pointer-down
now stamps a hollow vortex ring whose spin flips each press, so a second tap
unwinds the first instead of stacking. The bug underneath was worse than the
feature: `pointer()` turned every sample into a delta unconditionally, and
touch is discontinuous, so on a phone *every* gesture began by dumping a
full-screen shove into the field at a place the finger had never been. Desktop
hover hid it almost completely. Samples now only become deltas within 120 ms,
and a pointer that is down claims the field so a second finger cannot fight it.

### Decisions, so the next session does not re-litigate them

- **The bench is not in `PLAIN_OPEN_PREFIXES`.** It is held like every other
  `/wc/*` route and is viewed by switching off the plain theme. Opening it
  would make it one of a handful of publicly visible routes on a site that is
  otherwise holding, which is a product decision, not a lab one.
- **Vorticity confinement is kept, at `0.6`, and it is cheap only because of
  one line.** The `QUIET = 2e-4` early-out in `asciiVorticity.ts` skips the
  square root on cells whose curl is rounding error. Measured: 0.68 ms without
  it at 1080p against 0.095 ms with it on a quiet field, next to 0.83 ms for
  the existing advect pass. Caching `|curl|` into a second array was tried and
  was *slower*, so do not reach for it again. Set `vorticity: 0` in
  `PlainField.tsx` to A/B it at zero cost.
- **Colours in the bench are token pickers, not colour pickers.** The vendored
  defaults are blue (`[0.31, 0.54, 1]` and friends), which DESIGN.md forbids,
  and a literal would freeze the effect at whatever the theme was on mount. So
  a colour control holds a token name and `Stage` resolves it live.
- **`Grid.tsx` exports a symbol called `Grid`**, exactly the generic name
  CLAUDE.md warns against. It is vendored so it stays verbatim; the manifest
  aliases it to `TileGrid` at the import site instead.
- **The bench imports the flag probe from `plain/supportsHtmlInCanvas.ts`**
  rather than keeping its own copy. That file had gone unused when the holding
  screen stopped needing the flag; it has a consumer again.

### Verified, and not

`npm run check` green. Driven in the browser: the bench renders in cyberpunk
and paper, GlyphRain runs live over the sample subject with its text still
selectable, Laser renders in the theme accent rather than the vendored blue,
ParticleObject loads `spectre.glb`, and Glitch correctly shows the "running
inert" banner because this browser has no flag and no token. The press impulse
was confirmed firing by temporarily raising `PRESS_INK` and `PRESS_RADIUS`,
which made the disc obvious, then restoring both.

**Not verified, and worth an eye.** At the shipped `PRESS_INK = 0.34` a press
is close to invisible in a still frame; whether it reads well in motion is a
judgement a screenshot cannot make, and `PRESS_SWIRL` is the constant to raise
if it feels weak. Whether vorticity visibly earns its cost at `cell: 6` is the
same kind of call. Touch behaviour and the two-finger claim were reasoned
through and typechecked but never run on a real phone. Luxury theme was not
opened. And every click anywhere now fires a burst, including clicks on the
pickers and contact links, which reads as the field being alive but is a taste
call: the fix is a `e.target` check in `PlainField.tsx`.


## Admin panel removed, key management moved out of band, 2026-07-25
`/upload/admin` and `/api/admin/*` are gone. Not hidden, not gated: deleted.

**Why.** There was no rate limiting, lockout, attempt tracking, or challenge in front of the admin password. `verifyAdmin` was a constant-time compare and that was the entire gate, on six endpoints reachable directly with `curl`. Two consequences, and the second is the one that is easy to miss: a weak password was brute-forceable, AND every attempt costs a Worker request whether it succeeds or fails, so a sustained attack burns the 100k/day free tier and takes the site down regardless of whether it ever guesses right. Denial of wallet, not just credential risk.

Gating the page behind another password would not have helped. The page was a client-side form; the boundary was always the API route, and an attacker never loads the page.

**The model.** 0x0.st and catbox have no public admin panel: administration happens over SSH, out of band, on something that is not serving the website. The equivalent here is wrangler, authenticated by OAuth against the Cloudflare account. So the panel is gone and `scripts/manage-keys.mjs` replaces it:

```
node scripts/manage-keys.mjs mint <label>    mint a key, shown once
node scripts/manage-keys.mjs list            hashes, labels, dates
node scripts/manage-keys.mjs revoke <hash>   immediate, no redeploy
```

Objects are plain wrangler, no wrapper: `wrangler kv key list --binding UPLOADS_KV --remote` to see records, and `wrangler r2 object delete "real/<key>" --remote` to remove bytes. That one runs against the **gmail** account, not the worker's.

The script calls wrangler's JS entry with `execFileSync` and an argv array rather than going through `npx`. On Windows `npx.cmd` cannot be spawned without a shell, and using a shell would interpolate the label and hash through a command line, which is an injection hole in a script that exists to handle credentials.

**What went with it.** `createKey`, `listKeys`, `revokeKey` (keys.ts now only verifies, so the worker carries no key-minting capability at all), `listObjects` and `updateObjectEmbed` (objects.ts), `lib/upload/admin.ts`, and `ADMIN_PASSWORD` from the env type. `isEmbedAccent` was nearly deleted with them and is NOT dead: `/a/<id>` uses it to validate a stored accent before it reaches a meta tag, which is an injection guard. TypeScript caught that; the orphan-detection pass had missed it.

**Still live and unchanged:** uploading, `/a/<id>`, delete tokens, `/d/<token>`, and `i.mythcorp.org`. Saved embed titles and colors still RENDER, there is just no longer a UI that writes them.

**The secret is still set on the worker,** inert now that nothing reads it. `wrangler secret delete ADMIN_PASSWORD` clears it; leaving it costs nothing and makes restoring the panel easier.

Verified live: `/upload/admin` and both admin API routes 404, the upload path still works, and a minted key authenticates then stops the moment it is revoked.

## i.mythcorp.org, and the account split that shaped it, 2026-07-25
Uploads now hand back `https://i.mythcorp.org/<key>.png` instead of a `pub-*.r2.dev` URL. It is **not** an R2 custom domain, and that distinction is the whole story.

**The constraint.** An R2 custom domain requires the DNS zone and the bucket to be in the SAME Cloudflare account. Verified via the API rather than assumed: the `mythcorp.org` zone (`8716e277…`) is on the **mozmail** account `ba6ba228…`, alongside the worker and `UPLOADS_KV`. The `real` bucket is on the **gmail** account `6f1987…`, which is also the only account with R2 enabled at all; the mozmail account answers `Please enable R2 through the Cloudflare Dashboard`. So attaching the hostname to the bucket was impossible without migrating one of them. (`UPLOAD_PHASE23_BRIEF.md` recorded this split with the accounts the other way round, and named the domain `.dev`.)

**What was built instead.** `i.mythcorp.org` is a Workers Custom Domain on the existing worker, and the worker serves the bytes:

1. `src/middleware.ts` keys off the Host header alone. A request to `i.mythcorp.org/<key>.png` rewrites to `/api/img/<key>`; everything else falls straight through. It is one string comparison because it runs on every request to the main site too, and a bug there takes down every route, not just images.
2. `/api/img/[key]` validates the key shape with the same `isObjectId` guard `/a/<id>` uses, since the key is attacker-controlled and gets interpolated into an S3 object path. It streams the body rather than buffering, sets content type from OUR allowlist rather than whatever R2 echoes back, and adds `nosniff` plus `X-Robots-Tag: noindex` to match the `/a` view page.
3. `getObject` in `lib/upload/r2.ts` reads over the signed S3 endpoint, the same cross-account mechanism `putObject` already used.

**Cache-Control is one hour, deliberately.** Content-addressed keys would justify a year, but delete tokens are a real feature and an image that kept serving from cache for months after deletion would make deletion a lie.

**The tradeoff accepted.** Image bytes pass through the Worker rather than R2's direct CDN path, so a cold view costs a Worker request plus an S3 fetch. Fine at present scale, and the reason to eventually enable R2 on the mozmail account and move the bucket: then the hostname attaches directly and the worker leaves the hot path. The old `pub-*.r2.dev` origin still resolves, so links already shared keep working.

**Verified live end to end:** uploaded through `mythcorp.org`, got an `i.mythcorp.org` URL back, fetched it byte-identical with the right headers, confirmed `og:image` on `/a/<id>` now points at the new host, deleted by token, confirmed 404. Root of `i.mythcorp.org` 308s to the main site rather than serving a gallery. Bad keys and traversal attempts 404. Main site unaffected: 11 routes sampled, all correct.

**One mess made and cleaned.** A test object uploaded through the LOCAL dev server wrote its bytes to the production bucket (`.dev.vars` points at the real R2) while its delete token went to LOCAL KV, so the production delete endpoint could not remove it. It was deleted directly with `wrangler r2 object delete`. Worth knowing: local dev writes real objects to the real bucket, and the production `stat:totalbytes` counter never saw them, so that counter can drift below actual usage by whatever local testing has uploaded.

## First deploy since May, 2026-07-25
The site is live at **https://mythcorp-gen2.7737w27qh.workers.dev**. Before this, the last deployment was 2026-05-24, which means the entire upload system had never existed in production. Four things had to be fixed to get a deploy out at all, and each would have blocked the next attempt too.

1. **`account_id` is now pinned in `wrangler.jsonc`.** Two Cloudflare accounts are authenticated on this machine, so wrangler refused to pick one in non-interactive mode and `npm run deploy` died before doing anything. Worth knowing which is which: the worker and `UPLOADS_KV` live on the `7737w27qh@mozmail.com` account, while the R2 bucket is on the `Wbchen17@gmail.com` one. That split is fine, because R2 is reached over the S3 API with access keys rather than a binding, but it is not guessable and cost real time to work out.
2. **`node_modules` was installed by pnpm in a repo whose tracked lockfile is `package-lock.json`.** The resulting `.pnpm` symlink farm is what OpenNext copies into its bundle, and esbuild cannot traverse it on Windows: `Cannot read directory ... Access is denied`, four times. The symlinks are created as FILE symlinks pointing at directories, which is why they read fine from PowerShell and fail under `scandir`. Fixed by `npm ci` for a flat install. If a future session sees those errors, check for `node_modules/.pnpm` before anything else.
3. **Stale build directories broke two more attempts** (`EBUSY: rmdir .open-next/assets`, `EPERM: scandir .next/standalone/node_modules/react`). Both are staleness wearing a permissions costume. `npm run clean` now runs ahead of `deploy`, `preview`, and `cf:build` via `scripts/clean-build-dirs.mjs`. That script uses `fs.rmSync` deliberately: PowerShell 5.1 can delete THROUGH a junction and take the real `node_modules` with it.
4. **`sitemap.ts` and `robots.ts` were advertising `mythcorp.dev`, which does not resolve.** Not a bad record, an NXDOMAIN. The live sitemap was a list of dead URLs and `robots.txt` pointed at a dead host. Both now fall back to the workers.dev origin. `NEXT_PUBLIC_SITE_URL` is inlined at BUILD time, so setting it as a worker var will not work; it has to be set for the build when BACKLOG #20 lands.

Also killed the three `react-hooks/exhaustive-deps` warnings in `useObjects.ts` by memoizing the `auth` object, which was rebuilding every render and making every callback below it unstable.

Verified live: all 13 sampled routes return 200 and an unknown path correctly 404s, including `/upload` and `/upload/admin`. Note that both returned 404 for roughly a minute immediately after deploy and then resolved on their own, so a 404 in the first minute after a deploy is propagation, not a routing bug. `robots.txt` and `sitemap.xml` confirmed serving the corrected origin.

**Production smoke test: passed, end to end.** The whole path now has receipts, not just a green build.

| Step | Result |
|---|---|
| Bogus upload key | 401, not 500, so the KV binding reads correctly |
| Multipart upload | 201 |
| Public R2 fetch | 200, `image/png`, 70 bytes, byte-exact |
| View page `/a/<id>` | 200 with `noindex, nofollow`, `og:image`, `twitter:card` all correct |
| `?format=text` | bare URL body, `x-url-delete` header |
| Delete by token, both objects | `{"ok":true}` |
| Both objects after delete | 404 from R2 |
| Replaying a used token | the not-found message, so a spent token cannot be probed |

That confirms the three things a green build could not: the worker reads its secrets, the KV binding works, and the cross-account R2 credentials are valid for both writes and deletes. Both test images and the test key were removed afterward, and the revoked key now 401s.

Two things learned doing it. **The production `ADMIN_PASSWORD` is not the one in `.dev.vars`**, which is correct (that file even says to pick a strong one before deploy) but means the local value cannot administer the live site. If it has been lost, `wrangler secret put ADMIN_PASSWORD` resets it. **A key can be minted without the admin password at all**, by writing `key:<sha256hex(raw)>` straight into `UPLOADS_KV` with wrangler, which is how this test authenticated. Worth knowing both as an escape hatch and as a reminder that anyone with wrangler access to that account is already past the admin gate.

## Upload intake and storage pressure, 2026-07-24
Closed both items the conventions pass left open, one by building it and one by deciding against it.

1. **`/api/upload` now takes multipart/form-data as well as raw binary.** `curl -F 'file=@x.png'` is the universal idiom and every long-standing host accepts it, so it is a first-class input rather than a special case. `src/lib/upload/body.ts` picks the path off Content-Type and both ends at the same ArrayBuffer, so `validateUpload` still sniffs real magic bytes and nothing downstream trusts a filename or a declared type. The file part is looked up by name (`file`, `image`, `upload`, `files[]`) and then by "first File in the form", so a client using its own field name works instead of failing for a cosmetic reason. A Content-Length check rejects an oversized body before it is buffered, but it is a courtesy only: the real byte length is still checked after buffering, because Content-Length is client-claimed. ShareX is unaffected, `Body: "Binary"` still hits the raw path.
2. **Nothing expires, and that is now the decision rather than the default.** Eviction, TTLs, and per-key quotas were all considered and rejected: a link shared in a group chat should still resolve a year later, which is the whole point of the host. The cost is that a full bucket is a manual chore, so the admin panel makes the chore visible early and easy to aim. The storage meter gained a warning band at 80 percent and a critical band at 95, each with the actual remaining space and what to do about it, and the object grid gained a newest/largest sort. Sorting by size is the part that makes clearing space targeted instead of a purge, since a handful of big objects is usually the entire problem. If this ever does need automatic reclamation, the object records already carry `size` and `uploadedAt`, so a sweep has what it needs.

3. **`?format=text` returns the bare URL, JSON stays the default.** Having taken curl's request convention it was inconsistent to ignore its response convention: 0x0.st and catbox both answer with a plain URL, which is what makes `curl ... | clip` a one-liner instead of a jq pipeline. The delete URL rides in an `x-url-delete` header, the way 0x0 uses `X-Token` and transfer.sh uses `X-Url-Delete`, because a plain-text body can only carry one thing. Text is opt-in rather than negotiated on `Accept`, which is the deliberate parting from those two: they are curl-first, this is ShareX-first, every issued `.sxcu` reads `{json:url}`, and `Accept: */*` would have flipped ShareX's output out from under it.

Verified at runtime, not just compiled. `scratchpad/test-upload.sh` mints a throwaway key and runs eight cases against a local dev server: `201 201 201 400 201 415 401 201` as expected, covering the named field, an odd field name, `file` winning over a junk part sent alongside it, no file part, the raw-binary regression, non-image bytes refused through the multipart path, no auth, and text mode returning one bare URL plus the delete header. `npm run check` green, 33 pages, TypeScript and ESLint clean.

Not verified: the meter bands, since local storage sits far below 80 percent and the panel is password-gated.

Two notes for whoever is next. The `.next` directory corrupted mid-session (`Cannot find module ./chunks/vendor-chunks/...`) after the disk filled and a production build ran under a live dev server; deleting `.next` and restarting fixed it, and the two should not share a directory concurrently. The Content-Length pre-check in `body.ts` looks like fat next to the real `file.size` check and is not: without it a large multipart body is fully buffered by `formData()` before anything can reject it, and a Worker has far less memory than Cloudflare's request-body limit.

Pre-existing and untouched: `useObjects.ts` throws three `react-hooks/exhaustive-deps` warnings because the `auth` object is rebuilt every render. Harmless today, worth folding into a `useMemo` next time that file is open.

## Upload conventions pass, 2026-07-24
Aligned the image host with what long-standing hosts do. Three decisions worth not re-litigating:

1. **The view page is `/a/<id>`, not `/i/<key>.png`.** An `i` host plus a file extension means raw bytes everywhere else on the internet, and `i.mythcorp.dev` is the planned R2 custom domain, so serving HTML from `/i/` was training people to expect the wrong thing. `/i/[key]` now 308s to the new route. The id is the object key minus its extension, looked up by KV prefix, and `isObjectId` hard-validates the 22-character shape first because an unvalidated prefix scan is an enumeration hole.
2. **Uploads return a delete token** (`mcd_`, hashed in KV, raw value shown once) alongside the direct and embed links, so a keyholder can remove their own image without an admin. Redeeming it is `POST /api/delete`; the `/d/<token>` page only renders. A GET must never delete, because link unfurlers and browser prefetch issue GETs and the first Discord preview would destroy the image. `.sxcu` now carries `DeletionURL` and `ThumbnailURL`.
3. **Assets are noindex, not robots-disallowed.** Discordbot and Twitterbot obey robots.txt but ignore the noindex meta tag, so a `Disallow: /a` would have killed rich embeds while doing nothing search engines would not do anyway. `/d` and `/upload` ARE disallowed. Delete pages should never be crawled at all.

Still open from the earlier review: `/api/upload` takes raw binary only, so the universal `curl -F 'file=@x.png'` idiom does not work, and nothing expires under the 9 GB ceiling.

## Upload Phase 3b and 3c, 2026-07-24
Added admin rich-embed editing for image views. Embed title and description are trimmed and length-limited, accent colors require a six-digit hex value on write and before metadata emission, and the gallery editor saves through the admin-gated PATCH endpoint. Updated the public view to use the saved title, description, and theme color.

## Upload Phase 3a, 2026-07-24
Added the public `/i/[key]` image view. It reads the KV object record, returns a real 404 for unknown keys, and uses Next Metadata for escaped OpenGraph and Twitter image metadata pinned to the stored public URL. Upload responses now include a rich embed URL alongside the direct public link.

## Upload Phase 2b, 2026-07-24
Converted the admin object list into a responsive gallery. Added useObjects for loading and deletion, ObjectTile for thumbnails, public-link copy, and two-step inline deletion, plus a themed storage meter that switches to the warm accent at 80 percent. Production build and TypeScript checks pass.

## Upload Phase 2a, 2026-07-24
Split /upload into a thin page shell, DropConsole, UploadResult, and useUpload. Added fragment-only key prefill with URL stripping, paste-to-upload, accepted/rejected drag states, local object URL previews with cleanup, XHR byte progress and speed readout, and self-resetting public-link copy feedback. TypeScript passes. The Next build is currently blocked in this workspace because Wrangler cannot write its logs and registry under C:\Users\wayba\.wrangler, outside the writable workspace.

A short note for whoever (you, me, future-Claude on a different machine) picks this up next. Update at the end of each session.

## Last updated
2026-09-05 (fourth pass), **every visit now opens on a different combination, and the two flag-free Canvas UI effects came back as a layer.**

**Random opening combination.** On mount the screen rolls a spectre style, a message rendering and an overlay. It has to be an effect, not a render: rolling during render gives the server one answer and the client another, and the page flickers through the mismatch on its way to agreeing.

**The overlay, and why those two.** `GlyphRain` and `ForceField` were dropped when the screen stopped resampling the page, but they are the two components in that half of the library that draw their own geometry, so they need no Chrome flag and look the same for everyone. They are back in `HoldOverlay.tsx` as a full-screen layer over the field and under the chrome, which means they **compose** with whatever the spectre and the message are doing rather than replacing either. `over: none / rain / shield`.

**Five spectre styles.** `swarm` joins the four: the same particle cloud thinned from 26,000 to 3,200 and slowed until it only suggests a shape instead of holding one.

**Two variants were built and cut, which is now a pattern worth naming.** `matrix` (AsciiObject on a two-character ramp) never resolved into a figure at any exposure or cell size, and `etch` (InkObject opened right up) drew nothing at all, exactly the silent failure that killed the ink treatment of the message last pass. Both were parameter sets on components that demonstrably work here, so the lesson is not "that component is broken", it is that these components have narrow bands where they produce an image, and finding the edge costs more than the variant is worth. That is five cuts now on the same principle.

**PlainHold hit the file cap** at 230 lines, so the four control rows moved to `HoldPickers.tsx`. 116 and 126 lines now.

**Verification.** `npm run check` green, 31 pages, shared JS still 101 kB, since every heavy component is still a dynamic import. Driven in a real Chrome at 800x500: a fresh load opened on `swarm` + `shield` + `field` unprompted, four canvases live at once (field, spectre, words, overlay) with a clean console; `rain` and `shield` both draw and compose with `solid` words; dark mode inverts the overlay ink correctly rather than sinking it into the page.

### Previously

2026-09-05 (third pass), **the words can now be a particle cloud, because the object pipeline takes an image.**

**The trick worth remembering.** The `*-object` components do not only take a GLB. They `fetch(src)`, sniff the first bytes, and accept PNG, JPEG, WEBP, GIF and SVG as well, and a `data:` URI satisfies `fetch`. So `messageImage.ts` draws WORK IN PROGRESS to a canvas, hands over `toDataURL('image/png')`, and `ParticleObject` samples it into a cloud. The sampler keys on **alpha**, so the type is drawn solid white on transparent and the component tints it. No asset to ship, no second code path, and the words get the same cursor-scatter-and-spring the spectre has. This is the `dust` option under `words`.

The image has to be rasterized after `document.fonts.ready`, or the cloud is built from a fallback face rather than Geist Mono. It returns null until then, which is one empty frame instead of the wrong letterforms.

**`press` was built and cut.** The same PNG through `InkObject`, which traces contours and extrudes them, so it should have worked. It mounts, reports no error and draws nothing, with `threshold` and `depth` tuned as well as at their defaults. Not worth more time against a vendored component when `dust` already covers "the words, but alive". That makes three cuts now on the same principle: a button that does nothing is worse than a shorter list.

**Words options are now field, solid, decode, dust.**

**Verification.** `npm run check` green, 31 pages, shared JS still 101 kB. `dust` renders the message as a readable cloud at 800x500 in a real Chrome, three canvases live at once (field, spectre, words). **Not verified:** the cursor scatter. The Browser pane reports `document.hidden === true` even while it is compositing screenshots, so the WebGL loop is frozen on its last frame and synthetic pointer events change nothing. Rendering is confirmed; the interaction is the library's own and was taken on trust.

### Previously

2026-09-05 (second pass), **the message is readable now, and there are three ways to draw it.** The words had been turning to mush, and the cause was three separate bugs stacked on each other rather than a tuning problem.

**Why WORK IN PROGRESS fell apart.** (1) The mask was re-inked **additively** every frame, so dye climbed to the 1.4 ceiling, advection carried it into neighbouring cells, and the counters inside O, R and P filled until each letter was one solid block. It is a floor now: every masked cell is pinned to its own coverage, nothing accumulates. (2) A letter body still carried a range of dye values, so the ramp painted `.`, `-`, `=` and `@` inside a single stroke and the shape never resolved. The message is now its own pass in `asciiRender`, two levels only, body and edge, drawn over the field. (3) **A geometry bug that had been there since the beginning:** `renderTextMask` lays type out on square cells while the renderer draws cells at `CELL_ASPECT` 1.6, so every letter had been stretched 1.6x vertically. The mask now draws into a space `CELL_ASPECT` taller and squashes it back.

**And the constraint none of the tuning could beat.** An ASCII letter needs roughly eight cells across before it reads as a letter at all. `WORK IN PROGRESS` is 16 glyphs, so one line needs about 280 columns, which no ordinary viewport has at an 11px cell. Two things fixed it: the break rule is now cells-per-character rather than grid aspect (`MIN_CELLS_PER_CHAR`, falling back to `WORK IN` / `PROGRESS`), and the cell dropped from 11 to 6 so a letter can keep its cells while being physically small. Grid is 240 x 94 at 1440x900. Verify this at 1:1: a downscaled screenshot turns 6px glyphs into mush and reads as a bug that is not there.

**Three renderings of the message,** picked under `words`. `field` is the original, dye in the fluid. `solid` is crisp DOM type at 8.5vw, unmissable. `decode` is the same type re-scrambling out of noise every 5.2s through the existing `useScramble`, remounted by a key because that hook runs once per mount. `messageStore.ts` carries the choice, because the picker is on the holding screen and the field is in the layout, two siblings that never meet. It is named `messageStore` and not `holdMessage` because `holdMessage.ts` and `HoldMessage.tsx` differ only in case, which macOS resolves to the same file and TypeScript refuses.

**The cut styles stay cut, and now for a tested reason.** The suggestion was to put a light behind the model so halftone, bayer and glass would work. Tried it: lighting is not the problem. `DitheredObject` clears with alpha 0 when `background` is empty, and giving it any background sets alpha 1, so an inverted dither in light mode paints a solid grey rectangle over the middle of the field and the spectre is still not visible. Those three need an opaque panel, and the panel covers the message. Four transparent styles remain the right set.

**Verification.** `npm run check` green, 31 pages, shared JS 101 kB. Driven in a real Chrome at both 800x500 and 1440x900: the words read at both, `solid` and `decode` both render, and `decode` was confirmed to actually scramble by sampling the DOM (`PRO\/$*<`, `\@=@=+}@`) after patching rAF, since the pane's throttle stalls the loop.

### Previously

2026-09-05, **the holding screen is live on Cloudflare, and it is now one model in four styles with no way out of it.** Two sessions' worth of work landed: the deploy, then a rebuild of the screen itself.

**The deploy, and the build bug underneath it.** `npm run deploy` had been failing for everyone, not just here. `initOpenNextCloudflareForDev()` sat unguarded at the bottom of `next.config.ts`, and `next build` loads that config in more than one process, so two miniflare runtimes raced on the same `.wrangler/state` SQLite and the second died on `SQLITE_BUSY`. It is now gated to `NODE_ENV === 'development'`, which is what the function is for. Safe because nothing renders at build time that needs bindings: `uploadEnv()` is only called inside request handlers, and `/a/[id]`, `/i/[key]` and `/d/[token]` are all `force-dynamic`. Worth knowing: orphaned `workerd` processes outlive their `next dev` parent and keep the lock, and a killed run can leave the state in `SQLITE_BUSY_RECOVERY`, which only clears by moving `.wrangler/state` aside.

**What is live.** Version `0a3c17cc`, deployed from the `plain-mode` branch, which is **still unpushed**: production is running code that exists only on this laptop, and a deploy from `main` would revert it. `/` and `/wc` hold; `/contact` and `/upload` render.

**The screen is now the spectre, always.** The style picker used to swap six Canvas UI effects that resampled the live DOM. Four of the six needed `chrome://flags/#canvas-draw-element` and were inert for essentially every visitor, which the picker labelled honestly with asterisks but could not fix. The `*-object` family has no such gate: it loads a GLB and renders it into its own scene, ordinary WebGL, works everywhere. So `/spectre.glb` is on screen permanently and the picker changes how it is drawn: **ascii, ink, particle, liquid**. Background stays unset on all four, which the components read as transparent, so the fluid field keeps showing through.

**Three more were tried and cut, and the reason generalises.** `halftone`, `bayer` (DitheredObject) and `glass` (GlassObject) quantize or refract whatever sits behind the model. Behind the model here is transparency, so the spectre disappeared entirely. Giving them an opaque backdrop fixes them and paints a rectangle across the middle of the field, which costs more than the styles are worth. Their vendored files were deleted rather than left dead.

**No exits, by request.** The "leave plain mode" button, the CONTACT link into the site and the Chrome-flag footnote are all gone. The only reachable controls on the screen are the two pickers and a `mailto:`/`tel:` pair, verified by walking the DOM: everything else lives inside `#page-root`, which is `display: none`. The hidden terminal (press `/`) is the remaining way out, and it is deliberate.

**Contacts are the backdrop.** `HoldContact.tsx` sets the email, phone and city at 4.4vw and 5.5% opacity across the lower third, with the same three values repeated small and clickable in the corner. The backdrop copy is `aria-hidden` so a screen reader is handed the usable one. It sits low on purpose: the field draws WORK IN PROGRESS across the upper third, and when both were centred neither could be read.

**Light and dark, and the bug that came with it.** Plain mode now carries its own scheme, separate from the site theme: `holdScheme.ts` holds the key and the resolved `data-plain-scheme` attribute, the pre-paint script resolves it before anything renders, and the picker offers system / light / dark. The bug: `PlainField` reads `--plain-ink` **once**, when it builds the field, so switching scheme left the glyphs the previous scheme's colour, which on white is invisible. Fixed by adding `useResolvedScheme()`, a read-only hook that watches the attribute with a MutationObserver, and putting `scheme` in the effect's dependencies so the field is rebuilt. Two hooks on purpose: one owner, many followers, rather than two writers of the same decision.

**Making WORK IN PROGRESS readable was mostly one number.** The words were being drowned, and the cause was not the mask, it was the renderer's floor. `FLOOR` was `0.045`, so the drift the ambient vortices smear across the whole grid drew as loudly as the message. At `0.3` only the re-inked source cells survive. Alongside it: `sourceGain` 0.014 to 0.045 so the words re-ink faster than they smear, ambient velocity 0.05 to 0.032, and the render alpha widened to `0.1 + v * 0.85` capped at 0.96, so background drift is fainter and inked cells are nearly solid.

**One real hydration bug fixed.** Every value in the readout is client state (the clock, the measured grid, the visitor's own scheme), so the server necessarily renders something else and React called it a mismatch. The `<dd>` now carries `suppressHydrationWarning`, which is the accurate statement rather than a silencer.

**Verification.** `npm run check` green, 31 pages, shared JS still 101 kB because all four styles are dynamic imports. Driven in a real Chrome at 1440x900: fresh visitor gets `data-theme=plain`, `data-hold=on`, `#page-root` `display: none`; all four styles render the model with no console errors; light and dark both correct including the field's ink; a clean tab loads with an empty console. **Harness note, cost real time:** the Browser pane reports `document.hidden`, and patching `hidden` plus `requestAnimationFrame` after load is not enough, because `running` is still true so `start()` returns early and the pending throttled frame never re-enters through the patched rAF. The field only comes back if you dispatch `visibilitychange` twice, hidden then visible. Also: the console buffer persists across navigations in a tab, so errors from a broken HMR state read as current. Two bugs were chased that way before opening a fresh tab settled it.

**Left undone on purpose:** `supportsHtmlInCanvas.ts` and the six page-resampling components (GlyphRain, Asciify, DecryptReveal, RetroDither, ForceField, Glitch) are now unused, about 5,000 lines. They are the previous owner's vendored work, not this session's, so they were left in place rather than deleted.

### Previously

2026-09-04 (branch `plain-mode`, fourth pass), **plain became the site's default theme, and the branch caught up to 121 commits of production work.** Two things happened, and the second one turned out to be the bigger job.

**The merge.** `plain-mode` branched off `3eafa8f` in May and had been sitting there while `origin/main` moved 121 commits ahead: the image-sharing product (`/upload`, `/a/[id]`, `/d/[token]`, `/i/[key]`, `src/lib/upload/*`, `src/middleware.ts` routing `i.mythcorp.org`), the Cloudflare deploy fix, the canonical host move to mythcorp.org, the admin-panel removal, the interactive `/wc/learn` primitives and `build-a-playground`. Deploying the branch as it stood would have reverted all of it. Merged `origin/main` in first: three conflicts (`MAP.md`, `STATUS.md`, `wc/learn/page.tsx`), all content-level, plus one real type error the merge exposed. `MiniStarField.tsx` arrived from the remote with a `Record<ThemeName, string>` backdrop map written before `plain` existed, so it was missing the key; it now gets `#ffffff`, matching what `Simulation.tsx` already does.

**The flip.** `DEFAULT_THEME` is `plain` and the pre-paint script defaults to it, so a first-time visitor lands on the holding screen. Returning visitors are held too, and the mechanism for that is a **versioned storage key**: `mythcorp-theme` became `mythcorp-theme-v2`, so an older stored `cyberpunk` is simply not read. Anyone who takes the "leave plain mode" exit writes their choice under the new key and keeps it. This is the cheapest way to hold everyone once without a separate acknowledgement flag.

**The allowlist had to grow, and this is the part worth remembering.** `PLAIN_OPEN_ROUTES` was an exact-match list holding only `/contact`. The remote's image product ships links that are already out in the world: `https://mythcorp.org/a/<id>` is what an upload hands back. Holding those would not have read as a tease, it would have read as a dead link. It is now `PLAIN_OPEN_PREFIXES = ['/contact', '/upload', '/a', '/d', '/i']`, and a prefix opens itself plus everything under it, which is what the dynamic segments need. The pre-paint script does the same prefix walk inline so the hold decision is identical before and after hydration. API routes were never affected: route handlers do not render the layout.

**Verification, and what could not be verified here.** `tsc` clean. **`npm run build` was never run**: this session had no outbound network (`github.com` and `api.cloudflare.com` both time out, and `next/font` cannot reach Google Fonts), so the build half of `npm run check` is unproven and the branch is unpushed and undeployed. Everything else was driven against the dev server. A fresh visitor with empty storage gets `data-theme=plain`, `data-hold=on`, `#page-root` computed `display: none`. A visitor holding a legacy `mythcorp-theme=cyberpunk` gets the same, confirming the key bump holds returning visitors. `/contact`, `/upload` and `/a/<id>` all render normally with no hold attribute; `/experience`, `/wc/learn/plain-mode` and `/og/calhoun` all hold. The field runs at 117 x 41 cells and inks to 56% with the three WORK / IN / PROGRESS blocks visible.

**A harness note that cost time.** The Browser pane tab reports `document.hidden === true`, and `asciiFluid` correctly stops on that. Patching `document.hidden` and `requestAnimationFrame` after load is not enough on its own: `running` is still true, so `start()` returns early and the pending throttled frame never re-enters through the patched rAF. The field only comes back if you dispatch `visibilitychange` twice, hidden then visible, so `stop()` runs before `start()`.

**Also worth deciding next session:** every route now serves its real HTML and then hides `#page-root` with CSS. The sitemap still advertises 26+ pages that a visitor cannot see. That is fine for a short hold and worth revisiting if it runs long.

### Previously

2026-09-04 (branch `plain-mode`, third pass), **the holding screen is now a live work-in-progress page with Canvas UI wired in.** Six components are vendored into `src/app/components/canvasui/` and switchable from a picker on the screen: rain, asciify, decrypt, dither, shield, glitch. The centre of the screen is a stage that the selected effect wraps; the wordmark, the CONTACT link and the picker sit outside it so nothing ever encrypts or dithers the navigation. A readout under the stage shows real measurements rather than decoration: grid size and mean dye come from the field itself through `fieldMetrics.ts`, and the clock is anchored to a module timestamp so switching effects does not restart it.

**On Canvas UI, correcting what the previous pass assumed.** It is not an npm dependency and adds nothing to `package.json`. Components ship as source through a shadcn registry, one self-contained file each, zero imports beyond React. `npx shadcn@latest add https://canvasui.dev/r/<name>-react.json`, or read `files[0].content` out of that JSON and write the file, which is what happened here so `shadcn init` never touched the repo. License is MIT + Commons Clause, which only forbids selling the library itself. **Registry gap worth remembering:** DecryptReveal, RetroDither and ForceField all import `../rect-cache`, which no registry entry ships and which is absent from `https://canvasui.dev/r/registry.json`, so installing them straight does not compile. The helper is 26 lines at `src/lib/rect-cache.ts` in the upstream repo, copied to `src/app/components/rect-cache.ts`.

**The constraint that shaped the layout.** The html-in-canvas API is behind `chrome://flags/#canvas-draw-element`. Rain and shield draw their own geometry and work everywhere; asciify, decrypt, dither and glitch resample the page and are inert without the flag. The picker runs the same probe the components do and stars the inert ones rather than offering dead buttons. This is why the wordmark stays on the theme's own 2D-canvas field: it has no feature gate and renders for everyone. All six are dynamic imports with an inline `{ ssr: false }`, so shared JS stayed at 101 kB and nothing loads until an effect is picked. `next/dynamic` rejects a hoisted options constant, which failed the build once before it was inlined.

**Verification.** `npm run check` green. Driven in a real Chrome: all six effects mount with no console errors, the CONTACT link stays hit-testable under every one of them, and the readout tracks the selection. GlyphRain measured at 4,363 non-empty pixels with max channel 26, which is the configured `[0.1, 0.1, 0.1]` ink, confirming the monochrome overrides land. The field still inks to ~82k pixels. Two browser-harness notes: a background tab reports `isIntersecting: false`, so GlyphRain never enters its loop and has to have `IntersectionObserver` stubbed to be tested headlessly, on top of the rAF pump the field already needed.

### Previously

2026-09-04 (branch `plain-mode`, second pass), **plain is now the site's holding mode, and the message is drawn by the simulation rather than written in the DOM.** Every route collapses to a work-in-progress screen; `PLAIN_OPEN_ROUTES` in `holdState.ts` is the allowlist and currently holds only `/contact`. The pre-paint script writes `data-hold` before anything renders and `[data-hold="on"] #page-root { display: none }` removes the content outright, so there is nothing to tab into and nothing for a screen reader to read. `layout.tsx` gained `#page-root` as the wrapper for everything the hold hides; the field, the hold chrome and the terminal sit outside it, and the terminal stays as an escape hatch alongside the explicit "leave plain mode" link.

**The words are dye.** `textMask.ts` renders the message to an offscreen canvas at 4x the grid, box-averages it to one value per cell, and `asciiFluid` adds that mask every frame instead of stamping once. Constant addition against constant decay settles at `gain / (1 - decay)`, about 1.07, so smeared letters heal back rather than blinking. Two vortices on Lissajous paths with no common period keep it moving when nobody touches it. The line breaks by grid aspect: one line on a wide desktop grid, three stacked when narrow. `asciiFluid` was split, with the ramp quantizer moving to `asciiRender.ts`, to stay under the 250-line rule. Also landed ideaboard #65 as `useScramble.ts`, used on the wordmark and on the contact link's hover.

**Three bugs found and fixed, two of them pre-existing and site-wide.** (1) **Every theme on this site was rendering in Times.** The Next font variables were on `<body>` while the theme tokens that reference them are declared on `<html>`, and a custom property resolves where it is declared, so `--font-display: var(--font-cinzel)` computed invalid at the root and inherited that invalidity everywhere. Moving the font classes to `<html>` fixed all four themes; Cinzel headings and Geist body text now actually render. (2) The holding screen flashed the real page: React does not know the stored theme until an effect runs, so for one frame it saw the default theme and cleared the attribute the pre-paint script had just set. `ThemeContext` now exposes `ready` and `PlainHold` waits for it. (3) The first pass's `body > *:not(canvas)` stacking rule also matched the hold layer and replaced its `fixed` with `relative`, collapsing it to a strip at the top; it is now scoped to `#page-root`.

**Verification.** `npm run check` green. Driven in a real Chrome: `/`, `/experience`, `/about` and `/wc/papers/ai-cybercrime` all hold with `#page-root` computed `display: none`, `/contact` renders normally, and the immediate-read probe that caught the flash now comes back clean on all four. The field inks up to a steady 80k painted pixels with no pointer input, and a column histogram of the strong ink shows the gaps between WORK, IN and PROGRESS. All four themes now report their intended font families. The "leave plain mode" link returns to cyberpunk and unmounts the hold. Both browser panes background-throttle rAF and timers, so the loop was driven by a manual frame pump.

**Note for the next session:** running `npm run build` overwrites `.next` and breaks an already-running `npm run dev` (its chunks start 404ing). Restart dev after any build.

2026-09-04 (branch `plain-mode`), **shipped a fourth theme, `plain`, and the ASCII fluid field under it.** `plain` sets every Tier-2 token to its null value (0 radius, no shadow, 0ms motion, mono for all three font slots, black on white) so the theme has no ornament CSS can express, then adds one: `src/app/components/plain/asciiFluid.ts`, a semi-Lagrangian advection field rendered as characters in a 2D canvas, stirred by the pointer. No pressure solve (the expensive half of a real fluid step), a four-neighbour blur for viscosity, 0.985 per-frame decay, a ten-step luminance ramp (`' .:-=+*#%@'`) plus alpha for the in-between levels. Cells under 0.045 are skipped, so an idle page draws nothing. `PlainField.tsx` mounts it globally, returns null on the other three themes, and never mounts under `prefers-reduced-motion`; the loop stops on `visibilitychange`. The canvas reads its ink from `--plain-ink` so the theme still owns the colour. Ideaboard #56 and #64 fed this, though it is a 2D-canvas take rather than the WebGL one those describe. Walkthrough at `/wc/learn/plain-mode`, registered in the learn index, sitemap (26 pages), and MAP.md.

**Two bugs caught during verification, both fixed.** (1) A parked cursor injected dye every frame, so the field never settled; injection is now gated on pointer delta. (2) `@theme inline` had `--font-mono: var(--font-mono)`, which is circular, so *every* `font-mono` utility on the site was silently falling back to serif. Now `var(--font-geist-mono)`. That one is pre-existing and site-wide, not plain-mode specific.

**Verification.** `npm run check` green, 26 static pages. The solver was probed headlessly in Node against a stub canvas (dye grows along a drag, decays to zero glyphs about 60 frames after input stops, 0.12 ms/frame for the solve at a 110x40 grid). The live page was then driven in a real Chrome: painted pixels went 40 to 5862 across a drag and back to 0 after settling, and the canvas font resolves to Geist Mono with equal `i`/`W` advance widths. Both checks needed a manual frame pump, since a background tab pauses rAF and the component correctly stops itself when `document.hidden`.
2026-07-21 (batch 7), **bugfixes, an interactive /wc/learn upgrade, and a humanizing copy pass.** Three workstreams. (1) Bugs: fixed the Simulation reset aliasing (`resetToDefaults` handed `setSettings` the module-level `DEFAULTS`, sharing `DEFAULTS.position` by reference, so editing a Position slider mutated the defaults and a second reset was a React bail-out; added `getDefaultSettings = () => ({ ...DEFAULTS, position: [...DEFAULTS.position] })` and reset through it; kept `DEFAULTS` for the `keyof` type and left the random-on-mount initial state alone). Deleted the FMHY orphans left over from the mirror pivot (`_components/CategoryNav`, `_components/SearchBox`, `_data/categories.ts`, `_data/index.json`, `_lib/types.ts`); verified `fmhy/page.tsx` imports only `SiteHeader` + `backup-sites.json` and `fetch-fmhy.ts` writes only `backup-sites.json` before removing. **Calhoun render CONFIRMED (the thing batch 4 could not verify):** drove `/experience?mode=calhoun` in the preview, the point cloud animated from phase A (tight founders) to phase B "Exploit" with population climbing to ~2,017 and the phase readout populating; no console errors; the `/og/calhoun` CTA links correctly to `/experience?mode=calhoun`. (The background-tab RAF throttle still freezes the frame loop and times out screenshots, but forward progress was captured across two reads, so the scene is confirmed working.) (2) `/wc/learn` is now interactive: five new primitives in `_components/` (DemoPanel, TokenPlayground, MiniStarField + MiniStarFieldDemo, FlowStepper) plus a `Code` upgrade (`filename` + `highlight?: number[]` line tinting). theme-system gained a live TokenPlayground ("now break it"), 3d-scene gained a pocket R3F star field and a show-the-bug diff of the exact reset aliasing above, landing-flow gained the FlowStepper, and a fourth walkthrough `/wc/learn/build-a-playground` documents the primitives by embedding each as its own live example. Snippet strings for 3d-scene and landing-flow were extracted to sibling `_snippets.ts` to stay under the ~250-line ceiling. Verified in-browser: TokenPlayground override sets an inline `--accent`, switching theme clears it and leaves localStorage holding only a valid theme; the mini canvas mounts via `ssr:false` with no hydration warnings; the highlight prop renders tinted lines. (3) Humanizing pass over site copy guided by the Weibao voice doc (v1.80) + Online Presence Strategy: the four AI tells (uniform sentence length, hedging, signposting, meta-commentary) and no em dashes. Finding: the existing copy was already written in-voice, so the honest pass left most of it alone rather than manufacturing changes. The one substantive fix was the stale `/og` FMHY blurb (it described "category links and a live embed" that the mirror pivot removed); the wc/learn blurbs were refreshed to sell the new interactivity. Both essays (`/og/calhoun`, `/og/doubt`) passed the four-tells checklist and were left intact. `npm run check` green, 26 pages.

2026-05-23 (batch 6), **shipped the Manufactured Doubt ramble + tied it to Calhoun, and fixed the build-script recursion.** New `/og/doubt` (DraftBanner, themed, no em-dashes): Merchant of Doubt playbook (doubt as the product, delay as the win condition) into the honest counter, the solar and EV learning curves that moved regardless. Two interactive figures in `src/app/og/doubt/_components/ProgressFigures.tsx`: a log-scale solar $/W curve (anchors ~$76.67/W 1977 to ~$0.11/W 2024, Swanson's law caption) with hover points, and an EV-share scrubber (2013 ~0.3% to 2024 ~21%, anchors approximate, in-between interpolated). Numbers verified via web search (Our World in Data / IRENA / Swanson's law; IEA Global EV Outlook) and labelled approximate, since the essay is about not being sloppy with data. Added a "Roles, not room" human-parallel section to `/og/calhoun` (abundance outpacing roles, the human echo of the beautiful ones, deliberately resisting the doomer reading) and cross-linked the two rambles both ways. Registered `/og/doubt` in the `/og` SKETCHES, sitemap (26 pages), and MAP.md. Also fixed the build script: the merge had left `build: opennextjs-cloudflare build`, which recurses (opennextjs-cloudflare runs `npm run build` internally), restored `build: next build --no-lint` and added a `cf:build` for the explicit worker build; deploy/preview already wrap opennextjs-cloudflare. `npm run check` green. Verified in-browser: both figures render (solar SVG polyline, EV slider at 21%), cross-links resolve, no console errors. (Figures are SVG/DOM, so they render even with the preview tab hidden, unlike the R3F Calhoun sim.)

2026-05-23 (batch 5), **merged the remote `cloudflare-fmhy-backup-fixes` line into the Calhoun work.** origin/main had diverged from `41e1340` with a parallel line (PR #37): FMHY narrowed to a backup-sites directory + server component, new `landing-flow` and `3d-scene` walkthroughs, a Cloudflare build-script fix, and removal of the GitHub Actions workflows + issue templates. Reconciled by merge, favoring the remote where the same feature was redone, keeping unique local work. Took: remote FMHY (`backup-sites.json`, `fetch-fmhy.ts` fetching `backups.md`, server-component `/fmhy`), remote `/wc/about` (server component with `metadata` + timeline + GitHub link), remote walkthroughs and the Cloudflare build fix, the workflow/template removals. Kept: the local `/animals` refresh (thumbnail gallery, graceful fallback, Giphy attribution), `sitemap.ts`/`robots.ts`, the error boundaries, the replayable boot + terminal overlay, and all the Calhoun work. The old `/fmhy/[category]` mirror stays deleted (local pivot), so its `_components`/`_data` helpers are now orphaned and pending cleanup.

2026-05-23 (batch 4), **shipped the Calhoun ramble + behavioral-sink sim mode.** New `/og/calhoun` sketch page (DraftBanner, themed, no em-dashes): Universe 25, the four phases A-D, the "beautiful ones," the popular overpopulation reading vs. the true meaning (roles run out, not space/food), then a Merchant of Doubt riff tying doubt-manufacturing and meaning-flattening together as the same move (cutting a claim loose from its evidence). CTA deep-links to `/experience?mode=calhoun`. New `src/app/experience/BehavioralSink.tsx`: a 600-point cloud that loops Calhoun's curve (bloom outward, crowd into a central sink, shed pale withdrawn "beautiful ones" to an outer shell, dim to a still collapse, reset over CYCLE=26s), reporting phase + illustrative population via an `onState` callback throttled to ~5/sec. Lives in its own scene, `src/app/experience/CalhounSimulation.tsx` (own Canvas, own controls + top-right A/B/C/D + pop readout), kept fully separate from the spectre `Simulation` (which is byte-identical to its pre-Calhoun form again). `experience/page.tsx` now has three distinct views (`menu` / `simulation` / `calhoun`) that never co-mount; it reads `?mode=calhoun` from `window.location` on mount and routes straight to the Calhoun scene (no Suspense boundary needed). (An earlier pass had Calhoun as a toggle inside `Simulation`; that was split out into its own scene.) Added to `/og` SKETCHES, sitemap (22 pages), MAP.md (routes + 3D scene tables). `npm run check` green. Verified in-browser: `/og/calhoun` renders (h1, 4 phase cards, correct CTA href, no console errors); `/experience?mode=calhoun` mounts the canvas with the Calhoun toggle pre-checked. NOTE: the live frame animation + phase readout could not be visually confirmed because the preview harness tab is hidden (`document.hidden=true` throttles requestAnimationFrame, so R3F's useFrame loop and the screenshot both stall). Logic and wiring verified; the readout is gated on `calhoun && sink` where `sink` is set from the frame loop, so it populates as soon as a real (visible) tab runs RAF.

2026-05-23, **post-pivot cleanup + /animals refresh + wow-tier ideaboard.** Removed dead `categoryBySlug()` (and its `Namespace` import) from `fmhy/_data/categories.ts`, left over from the dropped dynamic route. Dropped the unused `GH_TOKEN` env from `.github/workflows/refresh-fmhy.yml`. Marked the stale "PR 1: FMHY mirror" section below as SUPERSEDED so it stops reading as current. Rebuilt `/animals`: migrated to `themed-surface` / `themed-button` / `themed-pill` (BACKLOG #8), added a clickable thumbnail gallery, a graceful "clip wandered off" fallback on image error, and `motion-safe:` on the bounce. Replaced all 5 Giphy clips with content-verified ones (searched Giphy, matched by its own tags/slugs, confirmed each `media.giphy.com` URL returns 200 image/gif and renders in-browser); titles now match what the clips actually show. `npm run check` green. Added 5 practical backlog items #67-#71 (Giphy attribution, self-host clips, one device-capability gate, CI build-guard, /animals favorites) and a new **IDEABOARD** section (#55-#66): drivable 3D portfolio, WebGL fluid cursor, raymarched SDF hero, GPGPU particle morph, scrollytelling paper, procedural Chicago skyline, desktop-OS /wc, displacement gallery, audio-reactive sim, ASCII post-process, text-scramble, live GLSL playground. All buildable on the installed R3F/three/gsap stack.

2026-05-23 (batch 2), **shipped SEO + error boundaries + /wc/about + Giphy attribution.** Added `src/app/sitemap.ts` (hand-maintained route list, base URL via `NEXT_PUBLIC_SITE_URL`, default `mythcorp.dev` from README) and `src/app/robots.ts` (allow-all, points at sitemap). Verified `/sitemap.xml` serves valid XML and `/robots.txt` serves correct text against the dev server (BACKLOG #30). Added `src/app/error.tsx` (themed boundary with reset button + SiteHeader, console.error for field observability) and `src/app/global-error.tsx` (own html/body, inline styles since theme tokens are unavailable when the layout itself fails) (BACKLOG #32). Built the real `/wc/about` page (was a 404 linked from the /wc index), updated the /wc card blurb away from "Coming soon", and added it to the sitemap + MAP.md (BACKLOG #2). Added Giphy attribution to /animals: per-clip "View on GIPHY" source link + "Powered by GIPHY" mark, per their ToS (BACKLOG #67). `npm run check` green, 21 static pages. All four verified in-browser.

2026-05-23 (batch 3), **made the boot replayable + shipped the terminal overlay (#24).** The cinematic LoadingScreen (3D binary-shape boot) only ran once per session, so the effort was rarely seen. `src/app/page.tsx` now honors `?boot=1` (forceBoot in AppLoader) and exposes a `replayIntro()` that clears the `mythcorp-booted` session flag and bumps a `key` on AppLoader to remount + re-run the boot in place. `NewLandingPage` got an optional `onReplayIntro` prop and a "↻ replay the boot sequence" button in the hero. New `src/app/components/TerminalOverlay.tsx` mounted globally in `layout.tsx` (next to HelpDot/KonamiEgg): press `/` anywhere to open a theme-aware fake terminal with `help / ls / cd <route> / whoami / cat readme / theme [name] / boot / date / clear / exit`, command history (up/down), Esc / outside-click to close. `cd` and `boot` actually navigate (`boot` -> `/?boot=1`, tying the two features together). Verified in-browser: terminal opens on `/`, runs commands, switches theme (cyberpunk->luxury), errors on unknown; `?boot=1` confirmed to render the LoadingScreen. Replay button confirmed compiled into the `/` bundle (in-browser click-through blocked by the R3F+GSAP transition being hard to drive programmatically). `npm run check` green.

Previous: 2026-05-18, **pivoted `/fmhy` from full mirror to themed directory.** Per-category / per-post / per-other pages and their snapshot JSONs are gone. The index page keeps the search + category nav + highlight cards, but every card now opens the canonical page on fmhy.net in a new tab. Above the grid: a three-card "official mirrors" row (fmhy.net, fmhy.net/other/backups, github.com/fmhy/edit). Reason: deep-dive pages 404'd in production despite a clean local build, opennextjs static-asset routing for nested dynamic params turned out fragile, and FMHY already maintains a backups page. The honest framing ("here's the map, click through for the real thing") is better than a partially-broken mirror. Dropped routes: `/fmhy/[category]`, `/fmhy/other/[slug]`, `/fmhy/posts/[slug]`. Dropped components: `EntryRow`, `ProsePage`. Dropped dep: `marked`. `scripts/fetch-fmhy.ts` slimmed to only produce `index.json` (counts + 4 highlights per catalog). `.fmhy-prose` CSS block removed from globals.

Previous: 2026-05-06, FMHY mirror + /experience continuity polish landed on branch `claude/vigilant-golick-c8ff8d`. Closes Issue #18 (FMHY) and Issue #13 (Simulation theming).

## What just shipped (Cloudflare / FMHY backup fixes)

- **FMHY scope narrowed**: `/fmhy` is now a lightweight backup-sites directory sourced from
  `docs/other/backups.md` (14 sites, 2 groups). The old full-catalog mirror (30 categories,
  5MB+ JSON) was the primary Cloudflare build-weight concern.
- **`fmhy/page.tsx` converted to server component**: removes the `'use client'` directive and
  the 39KB `index.json` from the client JS bundle. `metadata` export now works correctly.
- **`scripts/fetch-fmhy.ts` simplified**: was fetching the entire FMHY docs tree via GitHub API
  (30+ files). Now only fetches `docs/other/backups.md` and outputs `backup-sites.json`.
- **`refresh-fmhy.yml` updated**: `add-paths` now tracks `backup-sites.json` only, and the
  workflow passes `GITHUB_TOKEN` to the fetch script for rate-limit headroom.
- **`/wc/about` page created** (closes issue #14): bio, timeline, GitHub link.
- **`/animals` themed surfaces** (issue #19): card uses `themed-surface themed-surface-interactive`,
  button uses `themed-button`, back link uses `themed-surface themed-surface-interactive`.
- **`/og/chat` themed surfaces** (issue #19): message container, send button, and attachment
  button migrated to `themed-surface` / `themed-button`.

UPDATE (batch 7, 2026-07-21): this is now fully resolved. The `/fmhy/[category]` routes were
removed in the pivot, and their orphaned helpers (`_components/CategoryNav`, `_components/SearchBox`,
`_data/categories.ts`, `_data/index.json`, `_lib/types.ts`) are now deleted. `/fmhy` reads only
`_data/backup-sites.json`. No `[category]` routes or per-category JSON remain.

## Previous: 2026-05-06, FMHY mirror + /experience continuity polish
(branch `claude/vigilant-golick-c8ff8d`, closes Issue #18 and Issue #13)

## What shipped in that session (PR 2: /experience continuity)

- `SiteHeader` is now mounted once at `src/app/experience/page.tsx` and stays visible across the menu/simulation crossfade.
- `MainMenu.tsx` no longer mounts its own SiteHeader.
- 420ms opacity crossfade between MainMenu and Simulation. Only one Canvas alive at a time (StrictMode constraint preserved).
- `Simulation.tsx` control panel migrated from hand-rolled colors to themed tokens.
- Canvas backdrop is theme-aware via `BACKDROP_BY_THEME`.
- Theme switcher reachable from inside Simulation.

## What just shipped (PR 1: FMHY mirror) [SUPERSEDED, see the 2026-05-23 merge above]

The deep-dive per-category / per-post pages and their per-category JSON files
described below no longer exist. `/fmhy` is now a backup-sites directory sourced
from `backups.md` via `backup-sites.json`. Kept for history.

- `scripts/fetch-fmhy.ts` + per-category JSON snapshot committed.
- `/fmhy` rewritten: hero + client-side search + theme-aware category chip filter + 22 themed cards.
- `/fmhy/[category]` pre-renders all 22 non-empty categories.

## Hard rules (saved to memory at ~/.claude/projects/<this-project>/memory/)

- **No em-dashes (--) anywhere.** Code, copy, comments, commits, markdown. Use commas, periods, semicolons, parentheses, or restructure.

## Next up

The full backlog is in `BACKLOG.md` (24+ items). High-leverage next steps:

1. **#13: Theme-aware Simulation control panel** (if not already done via PR 2 above).
2. **#15 / #16: Walkthroughs** (`landing-flow`, `3d-scene`).
3. **#30: More paper figures** for `ai-cybercrime`.
4. **#31: Mobile QA pass** (never verified on a real phone).
5. **#21: Subset `Inter_Bold.json`** (5.2MB font, only 8 chars needed).

## Decisions worth remembering

- **`PLAN.md` added (2026-07-21)**: sequences the backlog into phases (stabilize, safety net, performance, reach, content, one flagship). Pick work from it top to bottom; BACKLOG.md stays the item-level detail.

- **`DESIGN.md` added (2026-07-20)**: locks visual taste (theme-as-design-language rule, type/color limits, anti-generic bans, pre-ship checklist). Read it before any UI work; CLAUDE.md points to it.

- **No `next-themes`**: the theme system is four files. See `/wc/learn/theme-system`.
- **FMHY data**: only `_data/backup-sites.json` remains; the `[category]` routes and per-category JSON are gone (removed in the pivot, orphans deleted batch 7). `/fmhy` is a backup-sites directory.
- **Custom playgrounds over Sandpack (batch 7)**: `/wc/learn` interactivity is hand-built primitives (DemoPanel, TokenPlayground, MiniStarField, FlowStepper), not `@codesandbox/sandpack-react`. A live demo that drives the real component can't drift from it, weighs almost nothing, and needs no bundler on the edge. BACKLOG #39 (Sandpack) is deferred by this decision, not pending.
- **TokenPlayground override-and-clear model (batch 7)**: it edits real CSS variables via inline `setProperty` (which outranks the `[data-theme]` block), but tracks every token it sets in a ref and `removeProperty`s exactly those on reset, unmount, and theme change. It never writes localStorage or `dataset.theme`, so it can recolor the live page without corrupting the persisted theme.
- **Fourth walkthrough is self-referential (batch 7)**: `/wc/learn/build-a-playground` documents the playground primitives by embedding each as its own live example (the playground that explains playgrounds is itself a playground).
- **`STARS_PER_UNIT = 1200`, `MAX_STARS = 12000`** in Simulation. Don't lift without benchmarking.
- **`HelpDot` lives in `layout.tsx`**, not per page.

2026-07-23: Codex brief pass in progress. /about and /contact are slim WIP stubs. /animals is parked at /og/animals for a rebuild using licensed or clearly attributed cute anime or animal art instead of GIPHY embeds. /og is being soft-hidden from search while remaining reachable by URL.

## Codex brief completion, 2026-07-24
Completed the storefront/workshop cleanup: about and contact remain slim WIP pages, animals lives at `/og/animals` as a parked sketch, the hero experiment has its own `/og/hero-lab` route, and the landing keeps one reduced-motion-safe reactive title. The workshop is noindexed and disallowed in robots while remaining reachable through its single Sketches door. Repointed the experience palate-cleanser link and removed the stale EnterBanner map row.

