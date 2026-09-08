# Repo Map

Single-screen index of where things live. Read this first; grep second.

## Routes

| Route | File | Purpose |
|---|---|---|
| `/` | `src/app/page.tsx` | Cinematic boot: LoadingScreen → LandingPage → NewLandingPage |
| `/experience` | `src/app/experience/page.tsx` | 3D simulation lab (menu + Simulation) |
| `/og/animals` | `src/app/og/animals/page.tsx` | Parked animal intermission, queued for a licensed-art rebuild |
| `/about` | `src/app/about/page.tsx` | Short "what is this" page |
| `/contact` | `src/app/contact/page.tsx` | ComingSoon stub (no real form yet) |
| `/wc` | `src/app/wc/page.tsx` | Personal section index |
| `/wc/about` | `src/app/wc/about/page.tsx` | Bio, timeline, links |
| `/wc/papers` | `src/app/wc/papers/page.tsx` | Long-form / paper list |
| `/wc/learn` | `src/app/wc/learn/page.tsx` | Walkthroughs index |
| `/wc/learn/theme-system` | `src/app/wc/learn/theme-system/page.tsx` | First annotated walkthrough |
| `/wc/learn/landing-flow` | `src/app/wc/learn/landing-flow/page.tsx` | Landing boot-flow walkthrough |
| `/wc/learn/plain-mode` | `src/app/wc/learn/plain-mode/page.tsx` | Plain theme + ASCII fluid walkthrough |
| `/wc/learn/3d-scene` | `src/app/wc/learn/3d-scene/page.tsx` | Simulation 3D-scene walkthrough (live mini star field + reset-bug diff) |
| `/wc/learn/build-a-playground` | `src/app/wc/learn/build-a-playground/page.tsx` | How the live demos are built: DemoPanel, TokenPlayground, the ssr:false canvas pattern, each embedded as its own example |
| `/wc/lab/canvas` | `src/app/wc/lab/canvas/page.tsx` | The canvas bench: every vendored Canvas UI component, live, with its props on sliders |
| `/fmhy` | `src/app/fmhy/page.tsx` | FMHY backup-sites directory, sourced from fmhy/edit backups.md |
| `/og` | `src/app/og/page.tsx` | "Back-room sketches" index |
| `/og/calhoun` | `src/app/og/calhoun/page.tsx` | Ramble on Universe 25 + Merchant of Doubt. Links to `/experience?mode=calhoun` |
| `/og/doubt` | `src/app/og/doubt/page.tsx` | Ramble on manufactured doubt + the solar/EV progress curves. Interactive figures in `_components/ProgressFigures.tsx` |
| `/og/interactive` | `src/app/og/interactive/page.tsx` | CSS-only isometric WIP type |
| `/og/hero-lab` | `src/app/og/hero-lab/page.tsx` | Experimental title and model composition |
| `/upload` | `src/app/upload/page.tsx` | Drag-drop image/GIF uploader. POSTs to `/api/upload` with a Bearer key, shows the returned public link |
| `POST /api/upload` | `src/app/api/upload/route.ts` | Auth -> validate -> caps -> store. Returns `{ url, viewUrl }`. Bytes go to R2 (account B) via S3 |
| `/a/[id]` | `src/app/a/[id]/page.tsx` | Public image view with safe OpenGraph metadata and direct link. Extensionless id, noindex, embeds still unfurl |
| `/i/[key]` | `src/app/i/[key]/page.tsx` | Legacy view route, 308s to `/a/[id]`. Kept so already-shared links survive |
| `/d/[token]` | `src/app/d/[token]/page.tsx` | Delete-token confirm page. Renders read-only, the delete is a POST from `DeleteConfirm.tsx` |
| `POST /api/delete` | `src/app/api/delete/route.ts` | Redeems a delete token. POST only, so unfurlers and prefetch cannot destroy an image |
| `/og/chat` | `src/app/og/chat/page.tsx` | Local-only chat sandbox |
| 404 | `src/app/not-found.tsx` | Whimsical 404 |
| error | `src/app/error.tsx` | Themed route error boundary (reset button) |
| fatal | `src/app/global-error.tsx` | Layout-level fallback (own html/body, inline styles, no theme tokens) |
| `/sitemap.xml` | `src/app/sitemap.ts` | Generated sitemap. Route list is hand-maintained, add new pages here. |
| `i.mythcorp.org/<key>` | `src/middleware.ts` + `src/app/api/img/[key]/route.ts` | Image host. Host-header rewrite to a route that streams the object out of R2 over S3. Not an R2 custom domain: the bucket is in another Cloudflare account. |
| `/robots.txt` | `src/app/robots.ts` | Allow-all, points at the sitemap. Base URL via `NEXT_PUBLIC_SITE_URL` (default `mythcorp.org`, the live custom domain). |

`/og/*` houses unfinished ideas kept on purpose, labelled with `<DraftBanner />`. The `/og` index also lists graduated sketches (e.g. `/fmhy` used to live at `/og/fmhy` before getting a real implementation).

## Shared components

| File | Used by |
|---|---|
| `src/app/components/SiteHeader.tsx` | Every page header, single source of truth |
| `src/app/components/ThemeSwitcher.tsx` | SiteHeader + ThemeSystem walkthrough |
| `src/app/components/Modal.tsx` | LandingModals + any future modal needs |
| `src/app/components/ComingSoon.tsx` | `/contact` and any future stub route |
| `src/app/components/HelpDot.tsx` | Mounted globally in `layout.tsx`, floating "?" |
| `src/app/components/DraftBanner.tsx` | Used by `/og/*` pages to flag "this is a sketch" |
| `src/app/components/landing/SkylineBackdrop.tsx` | NewLandingPage + experience MainMenu |
| `src/app/components/landing/HeroTitle.tsx` | NewLandingPage |
| `src/app/components/landing/LandingModals.tsx` | NewLandingPage |
| `src/app/components/LoadingScreen.tsx` | Boot sequence (page.tsx) |
| `src/app/components/NewLandingPage.tsx` | The luxury reveal (page.tsx) |
| `src/app/components/_archive/` | Superseded components, imported by nothing. `LandingPage.tsx` (the old two-stage boot title card) lives here |
| `src/app/components/landing/_archive/` | Same idea for landing pieces. Holds `EnterBanner.tsx` |
| `src/app/fmhy/_archive/` | The pre-pivot full-mirror browse UI (`CategoryNav`, `SearchBox`, the category index). Imported by nothing |
| `src/app/wc/learn/_components/Walkthrough.tsx` | Layout + helpers (`Walkthrough`, `Section`, `Code`, `Aside`) for `/wc/learn/*` pages. `Code` takes optional `filename` + `highlight?: number[]` |
| `src/app/fmhy/_data/backup-sites.json` | FMHY backup-sites snapshot, the only data `/fmhy` reads |
| `scripts/fetch-fmhy.ts` | Fetches `docs/other/backups.md` from fmhy/edit and outputs `backup-sites.json`. Runs via `npm run fetch:fmhy` |

## Canvas bench

| File | Purpose |
|---|---|
| `src/app/wc/lab/canvas/page.tsx` | Route shell, header and intro |
| `src/app/wc/lab/canvas/_components/manifest.ts` | **The only list of component names in the lab.** One entry per vendored component: loader, blurb, flag answer, prop schema, reduced-motion set. Over the file cap on purpose, so adding a component is one edit in one place |
| `src/app/wc/lab/canvas/_components/CanvasLab.tsx` | Orchestrator: selection, per-entry prop state, probes |
| `src/app/wc/lab/canvas/_components/Roster.tsx` | The component list, marks entries inert in this browser |
| `src/app/wc/lab/canvas/_components/Stage.tsx` | Mounts exactly one component, resolves colour tokens |
| `src/app/wc/lab/canvas/_components/SampleSubject.tsx` | The live DOM the page effects resample |
| `src/app/wc/lab/canvas/_components/ControlPanel.tsx` | Schema-driven inputs |
| `src/app/wc/lab/canvas/_components/PropSnippet.tsx` | The current props as copyable JSX |
| `src/app/wc/lab/canvas/_components/StageReadout.tsx` | Mounted / subject / api / motion / chunk readout |
| `src/app/wc/lab/canvas/_components/tokenInk.ts` | Theme token to hex or `[r, g, b]`, re-resolved on every theme change |
| `src/app/wc/lab/canvas/_components/browserProbes.ts` | Reduced-motion hook, and the flag probe re-exported from `plain/` |

## Learn primitives

The interactive figures embedded in `/wc/learn/*`. All `'use client'`, theme-token only, each carries a `// Walkthrough: /wc/learn/build-a-playground` pointer.

| File | Role |
|---|---|
| `src/app/wc/learn/_components/DemoPanel.tsx` | Layout shell: code left, live demo right at md+, stacked on mobile. Breaks out of the article's `max-w-2xl` into a centered band. Renders the "LIVE" pill |
| `src/app/wc/learn/_components/TokenPlayground.tsx` | Live-edits `--accent`/`--accent-soft`/`--fg`/`--bg` via inline `setProperty`. Tracks its overrides and clears them on reset/unmount/theme change. Never touches localStorage or `dataset.theme` |
| `src/app/wc/learn/_components/MiniStarField.tsx` | Self-contained R3F star field, `MINI_MAX_STARS = 3000`, theme-matched backdrop, no GLB/bloom |
| `src/app/wc/learn/_components/MiniStarFieldDemo.tsx` | Controls + `next/dynamic` `ssr:false` loader (height-matched skeleton) for MiniStarField. Reset uses the clone pattern |
| `src/app/wc/learn/_components/FlowStepper.tsx` | Interactive `loading -> landing -> entered` boot stepper (prev/next/auto-play), highlights matching snippet lines per step |
| `src/app/wc/learn/3d-scene/_snippets.ts` | Extracted snippet strings for the 3d-scene walkthrough (keeps the page under the line ceiling) |
| `src/app/wc/learn/landing-flow/_snippets.ts` | Extracted snippet strings for the landing-flow walkthrough |

## Upload feature

The "brains" live in `src/lib/upload/` (framework-agnostic). The `route.ts` files are thin wrappers that parse the request, call the lib, and format a response.

| File | Role |
|---|---|
| `src/lib/upload/env.ts` | `uploadEnv()` (Cloudflare bindings via `getCloudflareContext`), `LIMITS`, `ALLOWED` type map |
| `src/lib/upload/ids.ts` | 128-bit random object keys, 192-bit API keys (`mc_`), 128-bit delete tokens (`mcd_`), plus `objectId` / `isObjectId` for the extensionless public id |
| `src/lib/upload/hash.ts` | `sha256Hex`, shared by API keys and delete tokens. Both store the hash, never the raw secret |
| `src/lib/upload/destroy.ts` | The single teardown path (blob, KV record, token pointer, quota). Used by the admin and by a delete token |
| `src/lib/upload/r2.ts` | PUT/DELETE bytes to R2 account B over S3 (`aws4fetch`), `publicUrl()` |
| `src/lib/upload/keys.ts` | Per-person keys stored as SHA-256 hashes in KV. `verifyKey` / `createKey` / `listKeys` / `revokeKey` |
| `src/lib/upload/objects.ts` | Upload metadata index (who/when/size) as KV list-metadata |
| `src/lib/upload/validate.ts` | Size cap + magic-byte type sniff (ignores client Content-Type). No SVG (stored-XSS) |
| `src/lib/upload/caps.ts` | Daily per-user counter (KV TTL) + total-bytes ceiling. NB: KV increment is not atomic |

Config: KV binding `UPLOADS_KV` + public var `R2_PUBLIC_BASE_URL` in `wrangler.jsonc`; secrets (`R2_*`, `ADMIN_PASSWORD`) in `.dev.vars` locally / `wrangler secret put` in prod (template: `.dev.vars.example`; types: `src/cloudflare-secrets.d.ts`).

## 3D scene

| File | Notes |
|---|---|
| `src/app/experience/Simulation.tsx` | Spectre scene. `useGLTF.preload('/spectre.glb')` at top. Stars capped at `MAX_STARS = 12000`. `getDefaultSettings()` clones `DEFAULTS.position` so reset never aliases the module-level array. |
| `src/app/experience/CalhounSimulation.tsx` | Separate Universe 25 scene (own Canvas, own controls + phase readout). Reached via `/experience?mode=calhoun` from the `/og/calhoun` CTA. Never co-mounts with `Simulation`. |
| `src/app/experience/BehavioralSink.tsx` | Looping Universe 25 point cloud (phases A-D), reports phase + pop via `onState`. Used only by `CalhounSimulation`. |
| `src/app/experience/MainMenu.tsx` | Entry card before Simulation |

`spectre.glb` is preloaded in `Simulation.tsx`. It used to be preloaded in `LandingPage.tsx` too, and the drei cache meant the fetch still happened once per session; that second call went away with the two-stage boot. `/wc/learn/landing-flow` still teaches the old arrangement.

## Theme system

Four files. All other components consume tokens via `var(--name)`.

| File | Role |
|---|---|
| `src/app/globals.css` | Token definitions for `cyberpunk`, `luxury`, `paper`, `plain` |
| `src/app/contexts/ThemeContext.tsx` | Provider, hook, localStorage |
| `src/app/components/ThemeSwitcher.tsx` | UI |
| `src/app/layout.tsx` | Pre-paint bootstrap script (no flash), mounts `PlainField` |
| `src/app/components/plain/PlainField.tsx` | Plain-theme canvas mount, pointer wiring, teardown |
| `src/app/components/plain/PlainHold.tsx` | The holding screen: wordmark, both pickers, contacts, sr-only heading. No exits |
| `src/app/components/plain/holdRoll.ts` | The per-visit combination, rolled inside a noise budget so effects cannot pile up. Checked by `npm run check:roll` |
| `src/app/components/plain/holdState.ts` | `PLAIN_OPEN_PREFIXES` allowlist, read by React and the pre-paint script |
| `src/app/components/plain/asciiFluid.ts` | The ASCII fluid solver, no React |
| `src/app/components/plain/asciiRender.ts` | Ramp quantizer, dye field to characters |
| `src/app/components/plain/textMask.ts` | Text to a per-cell coverage mask, supersampled |
| `src/app/components/plain/useScramble.ts` | Ideaboard #65, the decode effect |
| `src/app/components/plain/DisturbedText.tsx` | Type the cursor erodes into the field's ramp, so what is behind shows through the holes |
| `src/app/components/plain/holdPointer.ts` | One `pointermove` listener, published on a frame, read by every piece of disturbed type |
| `src/app/components/plain/HoldStage.tsx` | One model, four Canvas UI styles, dynamic-imported, monochrome options. `ink` was cut for drawing nothing, see the file |
| `src/app/components/plain/HoldOverlay.tsx` | Full-screen Canvas UI layer: `rain`, `shield`, `fog`, `drops`, `scan`. All draw their own geometry. Five more were auditioned and cut, each for a recorded reason, see the file |
| `src/app/components/plain/HoldPickers.tsx` | Just the scheme picker now. The style, message and overlay rows moved into the readout |
| `src/app/components/plain/HoldStatus.tsx` | Live readout, and the controls: render, words and over cycle when clicked |
| `src/app/components/plain/fieldMetrics.ts` | One-value store the field publishes to and the readout reads |
| `src/app/components/plain/holdScheme.ts` | Plain mode's own light/dark switch: key, attribute, ink colours |
| `src/app/components/plain/usePlainScheme.ts` | Owns the scheme (`usePlainScheme`) and follows it (`useResolvedScheme`) |
| `src/app/components/plain/HoldContact.tsx` | Contact details: the backdrop copy and the reachable copy |
| `src/app/components/plain/messageStore.ts` | Which rendering of the message is showing. Named to dodge a case clash with `HoldMessage.tsx` |
| `src/app/components/plain/HoldMessage.tsx` | The message renderings that are not the field: `solid`, `decode`, `dust` |
| `src/app/components/plain/messageImage.ts` | The message as a PNG data URL, so it can feed the object pipeline |
| `src/app/components/plain/supportsHtmlInCanvas.ts` | Chrome feature probe. The holding screen no longer needs it; `/wc/lab/canvas` imports it to label inert components |
| `src/app/components/canvasui/` | **Vendored** Canvas UI source, 18 components. See its README for the per-component flag classification; do not hand-edit |
| `src/app/components/rect-cache.ts` | Helper eight canvasui components import but the registry does not ship |
| `src/app/components/plain/asciiFluidOptions.ts` | The solver's public option type plus every press and vorticity tuning constant |
| `src/app/components/plain/asciiPointer.ts` | Pointer bookkeeping: id claiming, re-entry gating, press cooldown |
| `src/app/components/plain/asciiVortexRing.ts` | The pointer-down impulse, a hollow ring with an aspect-corrected radius |
| `src/app/components/plain/asciiVorticity.ts` | Vorticity confinement, with the quiet-cell early-out that makes it affordable |

Walkthrough: `/wc/learn/theme-system`.

## Static assets

`public/`:
- `spectre.glb` (1.2MB), main 3D model
- `chicagoskyline.jpg`, landing backdrop
- `heli.jpg`, Simulation helicopter image
- `fonts/Inter_Bold.json` (5.2MB), for `<Text3D>`. Preloaded in `layout.tsx`.
- `*.svg` icons (Next.js defaults, mostly unused)

## How to add X

- **A new theme**: add `[data-theme="..."]` block in `globals.css`, append to `THEMES` in `ThemeContext.tsx`, update validator in `layout.tsx` bootstrap script.
- **A new walkthrough**: create `src/app/wc/learn/<slug>/page.tsx` using `Walkthrough` from `_components/`. Add to `WALKTHROUGHS` array in `src/app/wc/learn/page.tsx`.
- **A new paper**: add to `PAPERS` array in `src/app/wc/papers/page.tsx`. Create `src/app/wc/papers/<slug>/page.tsx` for the body.
- **A new stub page**: use `<ComingSoon>` from `src/app/components/ComingSoon.tsx`.
- **A new back-room sketch** (rough idea you want to keep): create `src/app/og/<slug>/page.tsx`, mount `<SiteHeader />` and `<DraftBanner />`, then add it to `SKETCHES` in `src/app/og/page.tsx`.
- **Promote a sketch out of `/og/`**: move the folder up, remove `<DraftBanner />`, drop it from `/og/page.tsx` SKETCHES, add to MAP.md routes table.
- **A new themed page**: add `<SiteHeader />` at top, use `bg-[color:var(--bg)]` and `text-[color:var(--fg)]`. Done.
- **A new upload validation rule / cap**: edit `src/lib/upload/validate.ts` (types, magic bytes) or `env.ts` `LIMITS` (sizes/quotas). The `route.ts` files stay untouched.
- **A new allowed image type**: add it to `ALLOWED` in `env.ts` AND a magic-byte branch in `validate.ts`. Never add `image/svg+xml` (executable, stored-XSS risk).
- **Give someone upload access**: `node scripts/manage-keys.mjs mint <their-name>`, then hand them the raw key (printed once). The admin panel was removed 2026-07-25; key management is out of band now, see STATUS.

## Build / dev

```
npm run dev      # local dev server
npm run check    # build + tsc
npm run deploy   # cloudflare workers
```

Tech: Next.js 15 (app router), React 19, R3F, drei, postprocessing, GSAP, Tailwind v4. Deployed to Cloudflare Workers via `@opennextjs/cloudflare`.

### Simulation entry instrument

- `src/app/experience/instrument/SignalInstrument.tsx`: accessible angle control, theme color resolution, WebGL probe and SVG fallback.
- `src/app/experience/instrument/SignalScene.tsx`: lazy-loaded, demand-rendered Three.js geometry study.

### Pending lander art direction

- `src/app/components/plain/holdCompositions.ts`: four authored starting compositions and current-scene naming.
- `src/app/components/plain/holdEntrance.module.css`: reduced-motion-aware entrance, focus treatment and short-viewport layout.

- `src/app/components/plain/holdPress.ts`: shared pulse dimensions, wave intensity and control-target exclusion.
- `src/app/components/plain/HoldClickResponse.tsx`: transient ring driven by the existing shared pointer subscription.
