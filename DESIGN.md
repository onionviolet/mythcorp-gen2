# DESIGN.md

What this site feels like, and what it never does. CLAUDE.md tells you *how* to build; this file tells you *what taste to build with*. When a visual decision isn't covered here, ask "would a fictional megacorp's internal terminal do this?" before "would a SaaS landing page do this?"

## What MYTHCORP is

A personal site wearing the costume of a cinematic megacorp. The fiction is the design system: you *boot into* the site, you *enter* the simulation lab, unfinished ideas live in a *back room* (`/og`), and a fake terminal opens on `/`. Every page should feel like a room inside that world, not a page on a portfolio template.

The tone is **whimsical and warm, played straight**. The corporation aesthetic is deadpan; the copy underneath it is human. Never snarky, never "quirky startup".

## The one big rule

**Themes are design languages, not palettes.** Cyberpunk, luxury, paper, and plain each define their own surface, motion, and interaction logic. Any new visual component must express itself through those tokens so it *transforms* across themes:

- **cyberpunk**: sharp corners (2-6px), neon edge glow, fast easing, terminal energy.
- **luxury**: big radii (up to 28px), glass blur, slow springy easing, gold on deep violet.
- **paper**: near-square corners, hard offset "stamped" shadows, presses and lifts, grain.
- **plain**: monochrome type, no ornamental CSS, ambient ASCII fluid, and utility
  exposed as a live system readout. Plain also acts as the site's holding mode.

If a component looks identical in all four themes, it is probably wrong. Test
all four before calling it done, including held and open-route behavior in plain.

## Type

Three fonts, closed set: **Cinzel** (display), **Geist** (body), **Geist Mono** (mono). Plus `Inter_Bold.json` for 3D text only.

- Cinzel is the brand. Use it for page titles and moments of ceremony, via `.themed-heading`. Don't dilute it onto every subhead.
- Make the scale jump big: display sizes should feel cinematic next to body text, not one notch up.
- Mono is for terminal, code, readouts, and data (phase readouts, star counts). Never decorative mono paragraphs.
- ALL-CAPS is a spice, not a system. One caps label per section at most.

## Color

Three hues per theme, already chosen: a dominant background family, a foreground family, and one accent (`--accent`, with `-soft` / `-warm` / `-glow` as its tints). **Never add a fourth hue to a page.** Extend with opacity and the existing tint tokens.

Hard bans:

- No purple-to-blue gradients. No lavender. No "AI slop" default palette anywhere.
- No hard-coded colors in components, ever. Tokens only (CLAUDE.md rule, repeated here because it's the whole ballgame).
- No pure `#000` / `#fff` surfaces; the themes already define depth.

## Surfaces and layout

- **Whitespace first, background shift second, elevation third, border last.** Reach for `.themed-surface` when you genuinely need a container, not to decorate.
- No nested cards. If a card contains a card, flatten one.
- No colored left-border accent strips on cards. It is the most reliable generic-AI tell.
- Break the grid once per page, on purpose: an off-center hero, an oversized number, a readout pinned to a corner, a 3D object bleeding past its column. One deliberate oddity beats ten polish passes.
- Never the slop skeleton (centered hero with badge, three feature cards, logo wall, FAQ). This site has no pricing page and no testimonials; it should never look like it might.

## Motion

- Motion is physics, per theme: cyberpunk snaps (120-200ms), luxury glides and overshoots (220-380ms), paper presses and lifts. Use `--motion-ease` / `--motion-fast` / `--motion-base`, never ad-hoc durations.
- Plan a timeline in words before writing GSAP ("header fades, then title tracks in, then banner slides"). "Add a cool animation" is banned as a brief.
- Every animation honors `prefers-reduced-motion` (`motion-safe:` in Tailwind).
- The boot sequence is the ceiling for spectacle. Interior pages stay calmer so the big moments stay big.

## The fiction, applied

- Diegetic beats decorative: prefer readouts, terminals, phase labels, and control panels over badges, blobs, and orbs. A stat should look *measured by the simulation*, not marketed.
- `/og` sketches are visibly rough on purpose (`<DraftBanner />`). Don't polish them into sameness; the draft-ness is the design.
- Microcopy is in-world and warm ("clip wandered off", "replay the boot sequence"). Short. Never snarky.
- Real content only: real figures with sourced numbers (see `/og/doubt`), real screenshots, no stock imagery, no placeholder lorem shipping to prod.

## Hard bans, collected

- Em-dashes. Anywhere. (Copy, code, comments, this file.)
- New fonts, new hues, hard-coded colors, inline global keyframes.
- Glassmorphism outside the luxury theme; glow outside cyberpunk/luxury except
  the two bounded plain-lander treatments specified below.
- Gradient orbs, floating blobs, marquee logo strips, emoji-as-icons in headings.
- Components that look the same in all four themes.

## Checklist before shipping visual work

1. Looks intentional in cyberpunk, luxury, paper, *and* plain. Check both a held
   route and an open route in plain.
2. Zero hex codes / rgb() in the component; tokens and themed utilities only.
3. Type scale has one clear cinematic jump; at most one caps label per section.
4. Contrast: body text readable in paper (light) as well as the dark themes.
5. One deliberate compositional oddity, and only one.
6. Motion uses theme tokens and respects reduced-motion.

## Keeping the front page's coolness

The front page is the experimental ceiling and the current work in progress. It
should set the level of authorship for the rest of the site without forcing
every room to reuse its effects.

Coolness here comes from five things:

- A strong fiction. Visitors enter a system rather than browse a template.
- One dominant idea per page.
- Interaction that responds to this visitor.
- Technical behavior that supports the atmosphere or the content.
- Restraint. Experiments are auditioned, measured, and cut when they do not earn
  their place.

Every important page gets one signature, not one canvas. A paper might connect
a control directly to its argument. A walkthrough might expose a live version
of the concept. An about page might reveal a personal artifact. FMHY might earn
its signature through unusually good retrieval. The implementation can be
quiet as long as the visitor can remember what only that room did.

Reuse the philosophy, not the visual effect:

- Inputs create visible consequences.
- Motion communicates state.
- Readouts display real values.
- Empty states remain authored.
- Lower-power and reduced-motion versions preserve the idea in a quieter form.
- Removing an effect should make the page less meaningful, not merely less busy.

### Spectacle budgets

- One spectacle per page.
- One primary interaction.
- One dominant animation rhythm.
- One accent family per theme.
- No effect without a content, state, or interaction role.
- Heavy routes need a quiet fallback.
- If a new signature makes an old flourish redundant, remove the flourish.

### Experiment lifecycle

Ideas move through `idea -> /og experiment -> tested candidate -> promoted
feature -> maintained system`.

An experiment graduates only when its purpose fits one sentence, it works with
touch and keyboard, it has a reduced-motion form, it survives every supported
theme, and it does not compete with the page's main content. Failed experiments
may remain in `/og` or the canvas lab with a short record of why they were cut.

## Reference field guide

These are technique donors, not visual templates. Study one interaction at a
time, name what makes it work, then rebuild the underlying principle in the
MYTHCORP fiction and token system.

### Interactive explanation

- [Bartosz Ciechanowski](https://ciechanow.ski/): every difficult claim earns a
  manipulable model. Absorb the tight loop between prose, control, and visible
  consequence. Best destination: papers and advanced walkthroughs. Do not copy
  the neutral scientific art direction.
- [Up and Down the Ladder of Abstraction](https://worrydream.com/LadderOfAbstraction/):
  one representation changes as the reader adjusts the abstraction level.
  Absorb shared state between prose and figure. Best destination: paper claims
  whose numbers can update inline.
- [Distill](https://distill.pub/): restrained interactive figures, captions
  with a thesis, and sidenotes that preserve reading flow. Best destination:
  `/wc/papers` and `/wc/learn`. Do not copy its publication chrome wholesale.
- [The Pudding](https://pudding.cool/): editorial pacing, clear acts, and
  visual evidence that arrives when the story needs it. Best destination: long
  papers and scrollytelling experiments. Avoid scroll effects that only reveal
  decoration.

### Playful systems

- [Nicky Case](https://ncase.me/): friendly visual language around serious
  systems, with learning produced by play. Best destination: policy tradeoffs,
  security models, and `/og` experiments.
- [Neal.fun](https://neal.fun/): one legible premise per experience, almost no
  onboarding, and immediate feedback. Best destination: small standalone
  interactives. Absorb the clarity, not the novelty churn.

### Navigable worlds

- [Bruno Simon](https://bruno-simon.com/): navigation itself is the portfolio's
  signature mechanic. Best destination: the simulation or a future spatial
  project browser. Do not turn ordinary reading routes into obstacle courses.
- [Active Theory](https://v5.activetheory.net/): cinematic transitions and
  project previews make the portfolio feel like one continuous world. Best
  destination: transitions between the boot, landing, and simulation. Preserve
  direct navigation and a non-WebGL fallback.

### Reference intake protocol

Before building from a reference, record:

1. The exact interaction or composition being studied.
2. What the visitor does.
3. What changes in response.
4. What meaning that change communicates.
5. Which MYTHCORP room could use the principle.
6. The quiet fallback.
7. What must not be copied, including palette, typography, wording, assets, and
   branded composition.

Build reference studies in `/og`, never directly on a public route. Compare the
study with the source side by side, then remove enough borrowed surface that the
result could only belong to MYTHCORP. Record the source link and the lesson in
the sketch's blurb or README.

### Promotion questions

Before a reference-inspired study graduates, ask:

1. What is this page's one memorable idea?
2. What does the visitor cause?
3. What real content or state does the effect expose?
4. Does the interaction still make sense without motion?
5. Is it legible and reachable on a phone?
6. Does each theme reinterpret it rather than merely recolor it?
7. Is any nearby effect now redundant?
8. Would removing it make the page less meaningful, or merely less busy?

## Current lander defaults, 2026-09-13

Cold visits begin with Halo: the ASCII spectre, dust lettering, and the scan
effect across the full screen. The scan remains active while the `over` control
adds one optional secondary background. Scene cycling remains available. The old
budgeted randomizer is retained for its existing consumers, not the cold load.

The expanded readout is the default at 1200px wide and 680px tall or larger.
It sits to the left of the specimen, where its exposed controls add character
without covering the model. Smaller screens begin compact; visitors can switch
either way. At short heights the compact view omits the clock and field size.
Expanded phone layouts scroll, preserving separate room for the specimen.

The readout's MOVEMENT bar measures pointer speed rather than average dye or
event count. Slow movement raises it gently, faster travel ramps it toward
SURGE, and an exponential release returns it through ACTIVE to CALM. Clicks do
not alter it. The grid size remains a separate GRID row. This keeps the label
and the measured input honest.

The user authorized bounded local exceptions to plain mode's no-glow rule: the
scan effect, a restrained pulse around the obvious LinkedIn link, and the decode
title's brief resolving sweep. The LinkedIn glow rises continuously across a
240px pointer-distance curve instead of switching at one threshold. The link is
a distinct bordered control with a compact `in` mark and one external arrow
inside the target. Arrow travel, a 22px accent core, the extra ring and a 52px
outer halo all rise along the same curve. It stays ordinary semantic HTML instead of wrapping
one link in a GPU effect whose fallback would add more complexity than meaning.
A tiny original cat crosses a visible part of the screen toward the link once
after five visible seconds, then follows a fine mouse pointer at a comfortable
offset. It eases back to the link over controls instead of teleporting. Touch
and reduced motion keep it static.

Browsers cannot move the visitor's real operating-system pointer. After a fine
pointer rests for 900ms, a decorative cursor echo slowly travels toward LinkedIn
and drives the same glow curve while the cat eases home beside it. Fresh movement
cancels the echo immediately, while click location and the real cursor stay
truthful. The close-range glow adds a second continuous ring and stronger halo,
so proximity changes brightness as well as size. The echo, cat and link cannot
click, navigate, move the visitor's pointer, or block a control. These exceptions
are specific to this installation.

Solid message mode retains the existing typeface but no longer behaves like a
static fallback. A restrained 12.8-second phase changes weight, tracking, glow,
outline and a clipped scan pass. Pointer disturbance still affects the letters.
Reduced motion preserves a crisp static outline without the passive cycle.

Models are selected through `holdModels.ts`; renderer treatments share the same
asset and framing. See `docs/HOLD_MODEL_ONBOARDING.md` before adding an asset.

## Historical visual audit, 2026-09-07

This dated audit preserves earlier desktop observations. Current lander
defaults are specified above; the interior findings remain the September 7
snapshot and should be refreshed before using them as current-state claims.

### Front page and plain holding mode

The current front page is a full-screen monochrome holding system, not the warm
skyline landing described in older project summaries. Its signature is the
whole composition: eroding ASCII type, a live fluid field, randomized render
and overlay treatments, a small scheme picker, clickable status values, and
contact information used as background structure.

It is the site's most distinctive room. It succeeds because the status readout
is real, the visitor can disturb the field, and the unfinished state is the
subject rather than an apology. It also carries deliberate risks: very low
contrast, no primary exit, tiny controls, and a density that should not spread
to reading pages. Treat it as an installation and spectacle ceiling, not as a
component library for the rest of the site.

### Interior hierarchy

- `/wc/papers/ai-cybercrime` is the strongest interior reference. Its large
  editorial title, sticky section rail, evidence labels, honest draft metadata,
  and interactive figures all reinforce the argument. Future content rooms
  should learn from its alignment between form and purpose.
- `/experience` has strong atmosphere, scale, and a clear transition into the
  simulation. Its entry screen currently uses a centered hero followed by three
  equal stat cards, the exact generic structure this document warns against.
  Keep the skyline and direct call to action, but let one live simulation signal
  replace the symmetrical feature summary when it next receives attention.
- `/wc` is legible and coherent, but four equal cards make the workshop feel
  like a directory rather than a place with a current obsession. A future pass
  should promote one active artifact and let the remaining destinations recede.
- `/about` is honestly marked in progress, but the very large empty field does
  not yet reveal a person, artifact, or useful system state. Its eventual
  signature should be specific and personal rather than another visual effect.

### Cross-theme observation

During this audit, switching from the plain holding mode to luxury left the old
ASCII holding composition visibly composited beneath interior pages in Chrome,
even after the DOM reported no remaining canvas. A clean tab eventually rendered
without the residue. Treat this as an observed transient transition defect to
reproduce outside the audit browser before diagnosing it. It is especially
harmful on `/wc` and `/experience`, where the ghosted contact type and status
readout compete with primary content.

### Immediate design priorities

1. Reproduce and remove the plain-to-themed compositor residue.
2. Replace the `/experience` three-card summary with one meaningful live signal.
3. Give `/wc` one promoted current artifact instead of four equal choices.
4. Give `/about` one concrete personal artifact or timeline fragment.
5. Preserve the cybercrime paper as the interior quality bar while improving
   its mobile rail, long-line reading behavior, and figure controls.
