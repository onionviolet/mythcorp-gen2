# Finding the coolest sites and absorbing them coherently, 2026-10-21

A plan for finding standout interactive sites, judging them by the taste in
DESIGN.md, and turning a few principles into MYTHCORP work without becoming a
collage. It works alongside DESIGN.md's reference field guide and intake
protocol; it doesn't replace them. The candidates below are leads, not
verdicts. This is a proposal, not an accepted decision.

## What the first sweep taught

Two research agents searched on 2026-10-21. Neither could run JavaScript, and
Codrops returned 403 to fetches, so most mechanics below are secondhand. The
only site actually played so far is manraj.me
([REFERENCE_MANRAJ_2026-10-21.md](REFERENCE_MANRAJ_2026-10-21.md)). Lesson:
**a site counts as studied only after someone plays it in a real browser.**
Search finds leads; the browser pane decides.

## The pipeline

1. **Source**, about an hour, cheap. Four lanes, 8 to 12 leads each:
   - Award galleries: Awwwards Sites of the Year and Developer Award, FWA.
   - Personal portfolios: creativedevjobs lists, Three.js forum showcase,
     Show HN.
   - Explorable essays: Simon Willison's
     [explorables tag](https://simonwillison.net/tags/explorables/).
   - Codrops case studies: read these in the browser pane, since fetches get a
     403. They name the live URL and explain the engineering.
2. **Play**, about 10 minutes a site, in the browser pane. Check desktop
   1440x900, phone 390x844, and reduced motion. Write the signature in one
   sentence: what the visitor does, what changes, what it means. Drop any site
   whose trick is smooth scroll plus fade-ups, or that you can't reach.
3. **Score** each survivor 0 to 2 on the eight rows below; 11 or more of 16
   moves on. The first five come from DESIGN.md's "Keeping the front page's
   coolness"; the last three are about fit.
4. **Distill** each survivor into one principle in a fixed form: "*input* makes
   *state* visible as *change*". Several sites usually share a principle;
   group them and name the group.
5. **Absorb**: assign each principle to at most one MYTHCORP room (rules
   below). Build it as an `/og` study, compare it side by side with its
   sources, and promote it only through DESIGN.md's lifecycle and promotion
   questions.

### Scoring rubric

| Row | 0 | 2 |
|---|---|---|
| Fiction | A template wearing a skin | You enter a world with its own rules |
| One idea | Many effects | One dominant mechanic you remember |
| Responds to you | Plays at you | Your input visibly changes state |
| Tech serves content | Effect for its own sake | Remove it and the meaning goes too |
| Restraint | Everything moves | The big moment stays big |
| Room fit | No MYTHCORP room wants it | A named room has a gap it fills |
| Our cost | New engine or heavy assets | Fits R3F, our particle and ASCII renderers |
| Quiet form | Breaks without WebGL or motion | Phone and reduced-motion forms keep the idea |

## Absorbing coherently

These rules keep the site one authored piece:

- **Borrow principles, never effects.** Every adoption is rebuilt from the
  principle in our fiction, tokens and themes, as DESIGN.md's intake already
  requires.
- **The specimen and the readout are the only carriers.** A new principle is
  expressed through the spectre, the field, the halo or a readout row. If it
  needs a new protagonist (a car, a planet, a character), it doesn't belong on
  a reading route.
- **One borrowed principle per room.** The spectacle budget is one per page; a
  second principle in the same room replaces the first or waits.
- **Themes must reinterpret it.** If the borrowed principle looks the same in
  cyberpunk, luxury, paper and plain, it isn't absorbed yet.
- **Keep a ledger.** In this file, record each principle with its sources, the
  room that owns it and its status (lead, played, study, promoted, cut, and
  why).

## Principles already visible (leads, mostly unplayed)

| Principle | Sources | Room it would serve | Status |
|---|---|---|---|
| **P1 One body carries the page.** Scroll changes the pose or shape of a persistent object, not the page | manraj.me (played, re-forms); ZERO (played, one hand re-posed per beat); drone.riotters.com (played, one drone re-posed per beat); Run Rob Run goo to cube ([Codrops](https://tympanus.net/codrops/2026/08/20/run-rob-run-building-a-music-reactive-goo-with-three-js-and-webgpu/)) | Tour: the specimen's particle body becomes each act's subject (O1 in the manraj study) | **confirmed**, 3 played |
| **P2 Hidden play becomes countable.** Finds are logged and named | manraj.me Discoveries 1/34 (played); Martin Laxenaire unlock percentage (played); ZERO XP counter (played) | Installation readout: anomaly ledger (O2). Count finds, never gate content behind them | **confirmed**, 3 played; prototype built behind `?ledger=1` on 2026-10-21 |
| **P3 A gesture opens the door.** The first act is a drawn input that seeds the visuals | ZERO (played): draw a zero and frost clears from the stroke | Installation first touch, or the console boot | 1 played, needs a second |
| **P4 Peel the medium.** A gesture reveals the layer under the finished object | Cartier (played, partly): the pointer brushes holes in the photo to show a pale layer beneath; Susurrus ([Codrops](https://tympanus.net/codrops/?p=113145)) unplayed | Themes as design languages: press and hold peels the specimen to its wireframe or blueprint | 1 partly played, plus one video (sketch to home, Opus 5.5 lane); needs a played second |
| **P5 Real data as material.** The work's own numbers become the object | Martin Laxenaire (seen in page text only: spheres sized by 174 invoices, confetti from GitHub stats; I did not reach the visuals) | Readouts and the Tour: commit history or paper figures as geometry | lead, visual unplayed |
| **P7 A diegetic spec dial.** A HUD under the object steps through real measured values as you scroll | drone.riotters.com (played: TECH, PRECISION and RANGE with plus or minus 2 cm, 5 returns, 450 m) | Already how our readout works; borrow the step-through for the Tour's act counter | 1 played |
| **P6 A control proves the claim** | manraj.me doorway slider (played) | Already DESIGN.md's Ciechanowski rule; the papers | adopted |

Watch but don't import: navigable game worlds (Thibault Introvigne, played and cut below; Messenger, the Awwwards Site of
the Year 2025; Prakash's island; Jay Ransijn; Weisdevice; Jordan Breton). They
are the strongest award winners, but DESIGN.md keeps reading routes from
becoming obstacle courses. Their lessons belong to `/experience`, if anywhere.

## First play list, ranked

Play these in the browser pane next, in this order. Each one tests a principle
above or could knock one out:

1. [martin-laxenaire.fr](https://martin-laxenaire.fr): P2 and P5 in one site.
2. [drone.riotters.com](https://drone.riotters.com/): P1 on a point cloud.
3. [Cartier Le Choeur des Pierres](https://www.cartier.com/en-fr/lechoeurdespierres): P4.
4. [thibault-introvigne.com](https://www.thibault-introvigne.com/): P2 as a collecting game.
5. ZERO: find the live URL from the Codrops article, then test P3.

Then: [messenger.abeto.co](https://messenger.abeto.co) as the bar for craft, and
[The Tie-break](https://thetiebreak.merci-michel.com/), whose mechanic is
unknown. Two explorable essays by Sam Rose for the papers lane:
[quantization](https://ngrok.com/blog/quantization) and
[prompt caching](https://ngrok.com/blog/prompt-caching/).

## Play log, 2026-10-21

All five played in the browser pane at 1440x900. The pane can't emulate
reduced motion, so the quiet-form row is judged from fallbacks seen or
documented, not tested. Phone at 375x812 was checked only on Martin Laxenaire.
Score order: fiction, one idea, responds, serves content, restraint, room
fit, our cost, quiet form.

| Site | Signature, as played | Scores | Total | Verdict |
|---|---|---|---|---|
| [why.zero.university](https://why.zero.university/) (ZERO) | Locked on arrival; "draw a zero" over frost. A closed circle clears the ice to "You Believed", then one green hand carries the scroll while an XP counter climbs (93 to 100) | 2 2 2 2 1 2 2 1 | **14** | Pass. P3, plus P1 and P2. Phone claim (60fps on a cheap Android) is the [case study](https://tympanus.net/codrops/2026/07/17/zero-the-engineering-behind-a-defiant-interactive-narrative/)'s, not tested |
| [drone.riotters.com](https://drone.riotters.com/) | One white drone is re-posed by scroll while a HUD dial below it steps through real specs; headline words fill in as you scroll | 1 2 1 2 2 2 2 1 | **13** | Pass. P1 by pose, not particles; adds P7 |
| [martin-laxenaire.fr](https://martin-laxenaire.fr) | "Slide to begin", then each section asks for a verb (drag left, click and hold, draw a line) and a toast unlocks the next; a corner percentage tracks it; "Unlock everything" skips the game | 1 2 2 2 1 2 1 1 | **12** | Pass. P2 by gating, which we would not copy; P5 in text. Loads on phone after about 14s |
| [Cartier, Le Choeur des Pierres](https://www.cartier.com/en-fr/lechoeurdespierres) | Two raw stones; hovering one blooms its colour, clicking it opens the finished necklace; the pointer then brushes a pale layer through the photograph | 2 1 2 1 2 1 1 1 | **11** | Pass, just. P4 only partly confirmed; the gouache drawing named in the case study was not seen |
| [thibault-introvigne.com](https://www.thibault-introvigne.com/) | Grass field, Enter, then a third-person character on an island moved by arrow keys, with an EXPERIENCE signpost | 2 1 2 1 1 0 0 0 | **7** | Cut. A navigable world, keyboard only; tapped keys barely moved the character, so the collectibles were not reached |

What changed: P1 and P2 now have three played sources each, so they are ready
for `/og` briefs. P3 and P4 each need one more played source. Thibault moves
to the watch-only list.

## Opus 5.5 community lane, 2026-10-21

Reddit blocked every fetch, so no Reddit posts were read. X posts mostly
blocked fetches too, but the browser pane opened Anthropic's
[favorites post](https://x.com/claudeai/status/2103515655760982273) of Sep 25
without a sign-in. Its picks are videos, so these are as described in the
posts, not played.

| Build | What the post shows | Principle | Use |
|---|---|---|---|
| Ryan Sael's lens lab, [lens.lab.sael.net](https://lens.lab.sael.net) (2.5M views on the quoted post) | Turn the focus ring and the glass elements shift the sharp plane through the scene. 1h26m one shot, $25.66 | P6 | The bar for a proof control; play it next |
| Techartist's sketch to home | One house in Three.js and TSL that grows through four stages: lines, massing, detail, finished | **P4**, a second source | Maps onto our themes as finish levels: plain lines, paper massing, cyberpunk detail, luxury finish |
| Victor M's galloping horse | 128x96 pixels in Canvas 2D, legs driven by inverse kinematics, all procedural in one HTML file | Craft bar | Reference for the cat's walk if it is ever redone procedurally |
| Paolo Rosson's DICOM jaw viewer | 800 raw scan files turned into a viewer from one prompt | P5 | Real data as material, personal and specific |
| hayashimon's mountain stream; onofumi's Osaka Castle | Water, light and moss all in code; the same castle made in Three.js and in Blender | Craft bar | No principle; skip |

Other leads from the search agent, all unopened or unverified:
- Senko's [vibecode-bench](https://senko.net/vibecode-bench) publishes Opus 5.5 game builds with their prompts as gists (a WW1 flight sim, a voxel game, an RTS). Useful as prompt references, but they are navigable games, so watch only.
- [Myriad Worlds](https://myriad-worlds.pages.dev/) is a seed-based procedural landscape with a cinematic tour key.
- riba2534's [demo repo](https://github.com/riba2534/claude-opus-5-5-demo) has 1.1k stars and one-sentence prompts.
- Unconfirmed: a pencil-sketch trebuchet simulator by Ben Poole (P6 in a paper look), an Antikythera mechanism game generated entirely at runtime, and a napkin-styled Claude Code UI by Kevin Ngo.

Net effect on the ledger: P4 gains a second source, but as a video, so it
still needs one played source. Nothing in this lane challenges P1 or P2.

## Briefs for the confirmed principles

Each brief applies the gaps from
[SPECIMEN_DOCENT_PROMPT_COMPARISON_2026-10-20.md](SPECIMEN_DOCENT_PROMPT_COMPARISON_2026-10-20.md):
inspect before assuming, plan before code, numbers for motion, a cut order, a
named theme matrix, and a test. Building either one needs a separate yes.

### P1 brief: `/og/specimen-figures`, the specimen becomes each act

Build an `/og` study where the spectre's particle body is the only figure in
the Tour, and it re-forms into each act's subject as you scroll. Paper: the
barrier rows, a pair of dots per attack joined by a line, before and after.
Doubt: the falling solar price curve. Universe 25: four clusters for phases A
to D, the last one thinning out. Lab: a loose star sphere. Contact: back into
the specimen. Every target is generated from the figure's real data, so P5
comes along for free. Export `ROWS` from `BarrierToEntry.tsx` and `SOLAR` from
`ProgressFigures.tsx` rather than copying numbers.

- **Step 0, inspect.** `ParticleObject`'s `sampleMesh` reads the raw position
  attribute once with no skinning, so sample the rest pose. Check whether it
  can be exported or needs a small extraction. Record the GLB's triangle count
  and pick a point count from it.
- **Plan before code.** Write the target shapes and the blend in words first,
  for example: "points travel along a slight curl, 600ms per act at full
  scroll speed, staggered by index".
- **Numbers.** 6000 points on desktop and 2500 below 768px, clamped like
  `MAX_STARS`. The morph is driven by the fractional step from
  `useStoryScroll`, so scrolling backwards un-morphs. Hold 60fps on the desktop
  GPU and record the phone frame time.
- **Layout.** Reuse the docent's sticky stage and act column. The live DOM
  figures stay below each act's text, because the particles echo the figure
  and don't replace its reading.
- **Cut order if time runs out:** first the curl path (use straight
  lerps), then the Universe 25 thinning, then the phone point count (drop to
  1500).
- **Themes:** points in `--fg` on paper and plain, emitted `--accent` on
  cyberpunk, warm gold `--accent-warm` with soft size falloff on luxury. Check
  light and dark plain on an open route.
- **Quiet forms:** reduced motion snaps to each act's shape with no travel. No
  WebGL shows the DOM figures alone.
- **Test:** a Playwright spec that scrolls to each act and asserts the
  readout's `FORM` row names that act's shape, with no WebGL timing
  assumptions.
- **Done:** `npm run check` passes, the test passes, there are screenshots at
  1440x900 and 390x844 in paper and cyberpunk, and MAP, the `/og` index and
  STATUS are updated. Stop and report what was cut.

### P2 brief: the anomaly ledger

Add a readout row to the Installation, `anomalies 03 / 12`, counting the
hidden behaviors the front page already has. It builds no new events. It makes
existing ones findable, warmly, with no nagging. Prototype it behind
`?ledger=1` so the live front page is unchanged until it is promoted.

- **Step 0, inspect.** List the behaviors from the code, not from memory. The
  candidates as of 2026-10-21: sweep the horizon, press and hold to surge,
  cycle the scene, render, words and over rows, flip the scheme, open the
  console through `0w0`, run a console command, visit all four rooms, throw a
  word in Let go, and pin `?sun=` or `?scene=` in the address. Drop any that
  fire by accident in normal use, and fix the denominator from what is left.
- **Events.** One small module next to `holdSceneEvents.ts` exports
  `logAnomaly(id)`, and each existing behavior calls it at the moment it
  succeeds. No polling.
- **Display.** When the count goes up, the row's value scrambles to the
  anomaly's in-world name for 1.6s using `useScramble`, then settles back to
  the count. No toast, no sound, no progress bar. On phones the row joins the
  short readout only after the first find.
- **Storage.** localStorage under one key, every read and write in try/catch,
  never sent anywhere. If storage is blocked, it counts for the session only.
- **Console.** An `anomalies` command lists the found names in the order they
  were found, and says nothing about the missing ones.
- **Quiet forms:** reduced motion skips the scramble and shows the name
  plainly. Screen readers get a polite live region announcing each new find
  once.
- **Test:** a Playwright spec triggers two behaviors (scheme flip, console
  open) and asserts the count and the console listing, then reloads and
  asserts the count persisted.
- **Done:** `npm run check` passes, the spec passes, the row is checked in all
  four themes, light and dark plain, and at 390x844, and STATUS records the
  list of anomalies and why each one counts.

## Done means

The first play list is played and scored, every principle in the table has at
least two played sources or is cut, and each principle with a room has a
one-paragraph `/og` brief. Building any study needs a separate yes.
