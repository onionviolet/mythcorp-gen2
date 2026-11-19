# Installation critique, 2026-11-19

*Type: proposal. Audience: Weibao and agents. Nothing here is built or accepted.*

Prompted by a screenshot of the Surface scene (liquid render, solid words) at
night, plus a local dev pass on `codex/checkpoint-research-2026-10-26`. Several
cuts below reverse the owner decision of 2026-10-08 recorded in
`docs/audits/AI_TELLS_2026-10-07.md` (contact backdrop, solid passive cycle,
readout rows restored for awe). Each one needs an explicit yes.

The live screenshot still shows `info@mythcorp.com`; the repo says `.org`
(RT2). Production is stale because `npm run deploy` is blocked on the
OpenNext and Next 15 issue in STATUS.

## Why Surface looks weak

- F1. **Sticker outline.** `.solidText` paints a 0.07em `--bg` stroke under
  each glyph (DESIGN.md "extend the knockout"). Over a white body it becomes a
  thick black cartoon outline on only the letters the body crosses ("WO",
  "PROGRE"), so the type looks like two different fonts.
- F2. **Four layers at equal weight in one spot.** Title, white body, ghosted
  contact backdrop (5.5% opacity, `HoldContact`) and, below about 900px tall,
  the readout all stack over the torso. Nothing is clearly in front.
- F3. **The words say nothing.** "WORK IN PROGRESS" is the most generic line
  on the page, at the largest size on the page.
- F4. **The body floats.** No contact shadow or ground; the gaze rig plus
  turntable often freeze it mid-lean, which reads as a bad pose, not a look.
- F5. **The readout is a settings panel.** 14 rows; half are config enums
  (`WORDS SOLID`, `HALO ACTIVE`, `OVER NONE`, `RENDER LIQUID`) rather than
  measurements. DESIGN.md wants readouts that look measured.
- F6. **Spectacle budget is over.** Halo, overlay, message cycle, backdrop,
  readout, cat, LinkedIn echo and gather all run at once against "one
  spectacle per page".

## Title options

- O1. **Title in the 3D scene (recommended for Surface).** drei `<Text>`
  (troika SDF, already installed via drei) placed between the body's head and
  legs in depth, so the head passes in front of "WORK IN" and the legs behind
  "PROGRESS". Classic magazine-cover masthead overlap; real occlusion replaces
  the knockout. Cost: needs a Geist Mono TTF/WOFF reachable by troika, text
  per renderer (liquid is easy; ascii and swarm need their own pass), and the
  gather scatter must move into the scene.
- O2. **`mix-blend-mode: difference`.** CSS only, monochrome-native: letters
  invert where they cross the body. Risk: `isolation: isolate` on
  `.solidLine` and the `entrance` wrappers' stacking contexts likely make it
  blend against nothing; the faceted greys give mid-grey letters. Worth a
  20-minute test, not a commitment.
- O3. **No DOM title in Surface.** The body is the message there; words stay
  in the scenes that draw them as field or dust. Cheapest, removes F1 and F2
  at once.
- O4. **New copy.** Replace "WORK IN PROGRESS" with an in-world line (a
  specimen label, a name and one current interest, per BACKLOG Q2). Bigger
  lever than any treatment and combinable with O1 to O3.

## Installation, ranked cuts and adds

1. A1. Withdrawn 2026-11-19: Weibao keeps the faint contact backdrop.
2. A2. Ground the specimen: drei `ContactShadows` under the body, driven by
   the Chicago sun direction that `specimenPose` already computes.
3. A3. Readout to 6 measured rows by default (status, Chicago, sun, you,
   specimen, movement); config rows move behind "Full readout".
4. A4. Drop the solid passive weight and scan cycle (reverses 2026-10-08);
   keep pointer response and gather.
5. A5. Clamp the gaze rig's lean so the rest pose always faces camera
   cleanly; turntable resumes from a neutral angle.

Further, lower priority: depth of field from `@react-three/postprocessing`
(installed) to separate body from title; GSAP SplitText for the scatter (now
free with GSAP 3.13+, verify license and bundle before adding); the gravity
mode stays in `/og` per BACKLOG.

## Libraries

Already installed and unused on the lander: drei `Text`, `ContactShadows`,
`AccumulativeShadows`, `MeshTransmissionMaterial`; postprocessing DoF, noise,
chromatic aberration (monochrome-safe only). No new dependency is needed for
O1, A2 or DoF. Any new one goes in STATUS "Decisions worth remembering".

## Process

Prototype the chosen title option in `/og` first (DESIGN.md reference intake).
A change away from the knockout rule needs a DESIGN.md edit at the same time.
Check all four themes and plain light and dark before promotion.

## Follow-up, 2026-11-19: why the solid words feel cheaper

Weibao clarified the complaint: the faint text stays and the title options
are liked; the problem is that the `solid` words look less impressive than the
other scenes' words.

- F7. **Solid is the only words treatment not made of the scene's medium.**
  Field words are dye in the fluid (`textMask.ts`), dust words are the
  spectre's own particles (`ParticleObject` fed the `messageImage` PNG),
  decode scrambles. Solid is DOM Geist Mono with a CSS pulse, so it reads as a
  label laid on the installation rather than part of it. It is also the words
  for two of four scenes (Drift, Surface), so half of all rotations show it.

### More options

- O5. **Liquid words for Surface (recommended).** Mount a second
  `LiquidObject` with `src` set to the `messageImage` PNG, the same way dust
  mounts a second `ParticleObject`. The cursor ripples letters and body in one
  material. No new dependency, no new font (the PNG uses `--font-mono`), and
  `LiquidObject` already consumes the gather, so press and hold keeps working.
- O6. **Ink words for Drift.** Vendored `InkObject` with the same PNG: words in
  wet ink inside the fog. Distinct from dust, which already owns particle
  words, so Drift should not get swarm words that duplicate Signal.
- O7. **Rule: words are made of the scene's medium.** Signal dust, Suspension
  field, Drift ink, Surface liquid. Keep `solid` only as the reduced-motion and
  WebGL-failure layer, which also serves the BACKLOG "static fallback" item.

### Account for now

- O1 with drei `Text3D` would use `Inter_Bold.json`, the only sanctioned 3D
  font, which changes the typeface from the mono every other scene uses.
  Troika `<Text>` needs a stable Geist Mono file in `public/`; `next/font`
  URLs are hashed. O5 avoids both.
- Each new message style needs a `MESSAGE_NOISE` entry for
  `scripts/check-hold-roll.ts` and must survive the readout's WORDS cycle over
  all four renders, or the cycle must skip pairings that fail.
- Each canvas word layer adds a WebGL context next to specimen, halo and
  overlay. The unresolved backing-store release item in BACKLOG makes this the
  main risk; measure against `docs/audits/FRONT_PAGE_PERF_2026-10-08.md`.
- Light scheme: liquid words must follow the body's rule (black faceted on
  paper, white on black), not a separate tint.
- Copy (O4) flows to every treatment for free because all of them rasterize
  `MESSAGE_LINES`.

### Later

- An `/og` bench rendering every words treatment over every render, for a
  side-by-side pick before promotion. Optional `?words=` pin for sharing.
- Unvendored Canvas UI `glass-object` (refraction) is a candidate for Surface
  words if O5's liquid reads too soft; it pulls `three` addon loaders.

## Follow-up, 2026-11-19: hero fonts

Weibao opened the font set for the hero words if a face looks good. This
reverses the closed three-font rule in DESIGN.md (Type, Hard bans) and
CLAUDE.md (Things to avoid); whichever face is chosen, both files change in
the same commit. Shortlist, all SIL OFL on Google Fonts unless noted, so one
`next/font/google` import covers DOM and the `messageImage` PNG path:

- T1. **Big Shoulders Display.** Condensed signage grotesk made for Chicago.
  The readout already runs on Chicago time and Chicago's sun, so the face has
  an in-world reason to exist. Extrudes cleanly.
- T2. **Martian Mono.** Mono with a width axis: stays in the family of the
  readout while letting the hero go ultra-wide.
- T3. **Recursive.** Variable `MONO` and `CASL` axes: the words can morph from
  strict mono toward loose casual, which literally performs "in progress".
  Axes animate only in DOM or a re-rasterized PNG, not in static 3D geometry.
- T4. **Unbounded** or **Syne ExtraBold.** Very wide, heavy display faces that
  look strongest as extruded 3D slabs.
- T5. **Departure Mono.** Pixel mono; pairs with the ASCII renderer and the
  terminal fiction. Not on Google Fonts; self-host from its OFL release.
- T6. **Cinzel in 3D.** Already the brand display face and needs no new font;
  the myth half of MYTHCORP. Risk: classical serif plus a dinosaur specimen
  can read as a museum poster rather than an installation.

Rejected: Monument Extended and similar "free for personal use" faces (license
does not cover a portfolio), and per-scene fonts (dilutes the one cinematic
jump DESIGN.md allows; pick one hero face for every treatment).

### Account for now (fonts)

- 3D text needs a static file in `public/`: TTF/OTF/WOFF for troika `<Text>`,
  or typeface JSON for `Text3D` (convert with facetype.js, or load TTF via
  three's `TTFLoader`). `next/font` URLs are hashed and not usable here.
- Late font load makes 3D words pop in on the first glance, which DESIGN.md
  says carries the awe. Preload the file and hold the words' entrance until it
  resolves, like `useMessageImage` waits on `document.fonts.ready`.
- `messageImage` reads `--font-mono`; a hero face needs its own token (for
  example `--font-hero`) so the readout and wordmark stay mono.
- Check every candidate in light and dark plain and in all four themes, at
  phone width where `8.5vw` lines get small.
- Material is as big a lever as the face: liquid (O5), glass
  (`MeshTransmissionMaterial`), matcap chrome, or edges-only wireframe for a
  blueprint look. Keep monochrome.

### Later (fonts)

- Add the shortlisted faces to the `/og` words bench so face, material and
  scene are compared together.
- Letters as rigid bodies the specimen can knock or stand on belongs to the
  BACKLOG gravity study, not the default page.
