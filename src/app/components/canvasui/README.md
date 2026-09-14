# canvasui, vendored

Third-party source from **Canvas UI** (github.com/DavidHDev/canvas-ui, canvasui.dev).
License: MIT + Commons Clause. Free in personal and commercial projects; the
clause only forbids selling the library itself. Nothing here is a runtime
dependency: Canvas UI ships components as source through a shadcn registry, so
`package.json` is untouched and each file is self-contained with zero imports
beyond React.

## Do not hand-edit

These files are regenerated, not maintained. To update or add one:

```
npx shadcn@latest add https://canvasui.dev/r/<name>-react.json
```

or fetch `https://canvasui.dev/r/<name>-react.json` and write the single file
in `files[0].content` here. The registry entry names the target path itself.

## What is vendored

Every file exports both a named and a default symbol of the same name, e.g.
`export function Frost` plus `export default Frost`. The **Needs** column is the
browser story, explained under "The browser caveat" below: *none* means the
effect draws its own geometry and every visitor sees it, *partial* means the
core runs everywhere but the good part wants the flag, *flag* means the thing is
inert without it.

| File | Registry entry | Needs | Effect |
|---|---|---|---|
| `Asciify.tsx` | `asciify-react` | partial | ASCII lens that follows the cursor |
| `AsciiObject.tsx` | `ascii-object-react` | none | A three.js object rendered as ASCII |
| `Clouds.tsx` | `clouds-react` | none | Drifting cloud deck with cast shadows |
| `DecryptReveal.tsx` | `decrypt-reveal-react` | flag | Page as cipher text, decodes around the cursor |
| `Droplets.tsx` | `droplets-react` | none | Rain on glass, with a wiper |
| `FlameWrap.tsx` | `flame-wrap-react` | none | Flames that lick around the content box |
| `Blaze.tsx` | `blaze-react` | Fire, sparks and smoke rising from the bottom edge | none |
| `ForceField.tsx` | `force-field-react` | none | Charged lattice over the content |
| `Frost.tsx` | `frost-react` | none | Ice creeping across the surface |
| `Glitch.tsx` | `glitch-react` | flag | Periodic tear and RGB split bursts |
| `GlyphRain.tsx` | `glyph-rain-react` | none | Falling glyph streams that light the page |
| `Grid.tsx` | `grid-react` | none | Content diced into tiles that lift and shade |
| `HexFloat.tsx` | `hex-float-react` | none | Raytraced hex tiles floating over the page |
| `InkObject.tsx` | `ink-object-react` | none | A three.js object in wet ink |
| `Laser.tsx` | `laser-react` | none | A scanning beam with heat and smoke |
| `Liquid.tsx` | `liquid-react` | none | Fluid simulation smeared over the page |
| `LiquidObject.tsx` | `liquid-object-react` | none | A three.js object as refracting liquid |
| `ParticleObject.tsx` | `particle-object-react` | none | A three.js object as a particle cloud |
| `RetroDither.tsx` | `retro-dither-react` | flag | Pixelate and quantize lens |

The registry has 35 React entries. The 17 not here, by the same column:

- **none**: `blaze` (fire, near enough to `FlameWrap` that we skipped it),
  `dithered-object` and `glass-object` (both pull `three` and its addon loaders,
  and the object family is already four deep here).
- **partial**: `ascii-sweep`, `bubble`, `glass`, `magnify`. All four fall back to
  a rim or an outline, which is the shape of the effect without the substance.
- **flag**: `bend`, `canvas`, `cloth`, `displacement`, `particle-reveal`,
  `particle-scroll`, `peel`, `shatter`, `vhs`. Each samples the page texture
  unconditionally, so without the flag they draw nothing at all.

Adding another is one command.

## One registry gap, patched by hand

`DecryptReveal`, `RetroDither`, `ForceField`, `Clouds`, `Droplets`, `Frost`,
`Grid` and `Liquid` all `import { createRectCache } from "../rect-cache"`, but
no registry entry ships that file and there is no `rect-cache` item in
`https://canvasui.dev/r/registry.json`. Installing any of them straight from the
registry therefore does not compile. The helper is 26 lines of cached
`getBoundingClientRect`, taken from the upstream repo at `src/lib/rect-cache.ts`
and written to `../rect-cache.ts` to match the import. Re-check whether the
registry ships it before updating those files. Nothing else vendored here
imports anything the registry does not ship.

## The browser caveat, which matters

The flagship trick is the **html-in-canvas** API: the component reads your live
DOM and redraws it, so text stays selectable and links stay clickable while a
shader runs over them. That API is an experimental Chrome feature behind
`chrome://flags/#canvas-draw-element`, or an origin trial token.

Every component detects support at runtime via its own `supportsHtmlInCanvas()`
and degrades. What survives the degrade is what the Needs column records:

- **none.** The shader takes a `uHasContent` uniform with a full branch for the
  zero case, so the clouds still drift, the flames still burn, the beam still
  scans. `GlyphRain` and `ForceField` are the originals here. The `*Object`
  files never touch the API at all, they render three.js into their own canvas.
- **partial.** `Asciify` keeps a hand-rolled DOM rasterizer and snapshots the
  subtree whenever it mutates, so the ASCII still forms, just from a stale still
  rather than a live frame.
- **flag.** `DecryptReveal`, `RetroDither` and `Glitch` sample the page texture
  unconditionally. Without the API they are inert and the content shows through
  unchanged.

So do not build a layout that only reads correctly with the flag on. The plain
theme's own ASCII field (`../plain/asciiFluid.ts`) is plain 2D canvas and runs
everywhere, which is why it carries the wordmark rather than one of these.

## Turning the flag-gated components on for everyone

The flag is not the only way in. `html-in-canvas` has a live Chrome origin
trial, which opts our own origins in for every Chrome visitor without asking
anyone to touch `chrome://flags`. Verified against the Chrome Platform Status
origin trials API on 2026-09-05: trial `html-in-canvas`, feature name
`HTMLInCanvas`, status ACTIVE, Chrome 148 through 154.

**A token is installed, and it is not yet known to work.** The committed `.env`
carries one for `https://mythcorp.org` with subdomain matching, so
`i.mythcorp.org` is covered too, and `src/app/layout.tsx` renders it as a
`<meta http-equiv="origin-trial">` on every page. That much is confirmed
against the deployed site.

What is NOT confirmed is that it turns the API on. Checked on the live site on
Chrome 148.0.7778.280 with the tag served: `ctx.drawElementImage` and
`canvas.requestPaint` do not exist, and nothing resembling them exists under
any other name. One of three things is true, and it is worth finding out which
before trusting the token: the trial is not honoured in that browser context,
that Chrome build predates the shipped API despite sitting inside the 148 to
154 window, or the API was renamed when it changed in response to feedback (the
trial was extended for exactly that reason) and `supportsHtmlInCanvas()` is
probing for names that no longer exist. The last one is the expensive one to
miss: the probe would return false forever and these components would look
permanently broken rather than merely switched off.

Three things to keep in mind.

1. **It expires 2026-10-20, and expiry is silent.** Nothing throws and nothing
   logs, the effects simply go inert again and read like a component
   regression. A one-time reminder is scheduled for 2026-10-06; renewal is at
   <https://developer.chrome.com/origintrials>. `NEXT_PUBLIC_*` is inlined at
   build time, so a new token needs a rebuild and redeploy, not just an edit.
2. **Two origins are still uncovered**, each needing its own registration: the
   `*.workers.dev` preview host, and `http://localhost:3000`. That second one
   is why these components are still inert on a dev server, so the degraded
   paths above are what you actually develop against.
3. **A trial is not a promise.** It has already been extended once, and when it
   ends the graceful degradation is load-bearing again. Non-Chrome visitors
   never get this at all.

## Repo conventions

These are vendored build artifacts, not code we maintain. Keep them close to
their upstream shape.
