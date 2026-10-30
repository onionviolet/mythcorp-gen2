# Ideaboard, 2026-10-26

Proposal, not an accepted decision. A palette, not a selection. Nothing here is
built, committed, pushed or deployed. Level of work: report-only for Part 1,
exploratory for Part 2. Written overnight by a Claude session under the
2026-10-26 coordinator pass; the repo's `AGENTS.md`, `CLAUDE.md`, `STATUS.md`
and `BACKLOG.md` outrank that prompt. No GitHub Issue was created, closed or
edited, the site lock is untouched, and no other file in this repo changed.

## Part 1. Status report

Measured 2026-10-26 in `~/code/mythcorp-gen2` on `main`: 2 commits ahead of
`origin/main` (`7e8b2a9` anomaly ledger, `ac51f98` specimen docent), 10 dirty
paths (3 modified: `AGENTS.md`, `CLAUDE.md`, `STATUS.md`; 7 untracked docs under
`docs/`, including the interactive archive audit this board extends).

### Top triaged BACKLOG item

"Retest the defensive plain-canvas release on the original affected Chrome
profile." Two baseline attempts did not reproduce the stale composition, so the
synchronous backing-store release is hardened but not a confirmed fix. It needs
Weibao's original profile; an agent cannot do it overnight.

### Open Issues that shipped work already covers

22 Issues are open (`gh issue list`). Checked against
git history and current files. No Issue was touched.

| Issue | Covering commit | Evidence and caveat |
|---|---|---|
| 13 Theme-aware Simulation control panel | `9e31d98` (2026-05-17) | `Simulation.tsx` has 0 hard-coded `bg-black/70` and 4 `themed-*` references today. STATUS records "closes Issue #13". The commit hash is the first one to add `themed-surface` to that file, not a quoted closing commit. |
| 16 Walkthrough `/wc/learn/3d-scene` | `37f5757` (2026-05-23) | Message says "closes #15, #16". `src/app/wc/learn/3d-scene/` exists. |
| 17 Build-time FMHY catalog fetch | `6f7f695` (2026-05-17), narrowed by `47a6b91` | `scripts/fetch-fmhy.ts` exists and `/fmhy` is a server component over a build-time snapshot. Caveat: it was later narrowed to the backup-sites page, so the Issue's "full catalog with search" is superseded, not literally done. |
| 19 Migrate `/animals` and `/og/*` to themed surfaces | `47a6b91` (2026-05-23) | `/og/chat` uses `themed-surface`. `/animals` later moved into the back room (`20b3cb8`) and no longer matches `themed-surface`; not re-verified. Partly covered. |
| 28 Custom domain | `5bbb659` (2026-07-25) | `layout.tsx` sets `metadataBase` to `https://mythcorp.org` and `wrangler.jsonc` serves `i.mythcorp.org`. The commit says the domain "was live all along". DNS and dashboard state are not visible from the repo. |

| 33 Pioneer Scholars paper continuation | `2313cbd`, `0166071`, `537e236`, `c732c97` (2026-10-08) | The Issue asks for chapters 3 and 5 to 8 as sections. The paper was since turned into acts and vignettes, with Methods, Limitations and disclosure studies. I did not map each named chapter to a section, so call it mostly covered. |

Likely obsolete by the September holding-page pivot, not verified one by one:
20, 21 and 22 name `LandingPage.tsx`, which no longer exists
(`NewLandingPage.tsx` and the plain rooms replaced it). 21 stays open in
practice: the 5.2 MB font is still referenced by `layout.tsx` and `hero-lab`.

Not covered, confirmed: 21 (`public/fonts/Inter_Bold.json` is still 5.2 MB).
No evidence of coverage found for 18 (no MDX in `package.json`), 24 (no
`viewTransition` in `next.config.ts`), 25 (no feed route) or 32 (no
`hardwareConcurrency` check in `src`). 23 had no git match; I did not exhaust it.
20, 22, 26, 27, 29 to 31, 33 and 34 were not individually audited.
40 and 41 are the live Ideaboard intake and stay open; no build exists for
either (STATUS records them as proposals).

## Part 2. Ideaboard

### Inventory (read-only, 2026-10-26)

| Project | Dirty | Last commit | Owner's top entry |
|---|---|---|---|
| OOPS (`yet-another-idle-rpg`, branch `master`) | 751 | `97e2e45a3` 10-26, compact reply mode for the game MCP | `PROJECT.md`: quality floor AD43, effect-first UI descriptions adopted into the normal app; description source still local and uncommitted |
| Lumen (`main`) | 110 | `1f3d546` 10-17, schema v2 storage results | `PROJECT.md`: E1 to E8 delivery sits uncommitted in the tree; `ROADMAP.md` has the feature-scout reconciliation |
| Neutron (`codex/absorb-upstream-2026-10-26`) | 2 | `ed41ded` 10-26, merge of upstream NotProton 1.2.0 | `NEUTRON.md` "Current build"; repo is private, upstream fork is public |
| Boring Notch (`main`) | 8 | `a78ed7e` 10-20, upstream absorb | `HANDOFF.md`: four-tab notch (Home, Shelf, Today, D-hall) |
| Anki fork (`weibao/absorb-2026-10-26`) | 4 | `3708a62fb` 10-26, upstream/main merge | `FORK.md`: FSRS7/RWKV import plus "Mark for repair" and Study tools |
| Province War (`claude/cow-parity`) | 611 | `7e661376` 10-14 | Out of scope until its third-party assets are separated |
| Gandalf Local (outputs folder, clean) | 0 | `af09cd2` | `README.md` and `docs/VALIDATION.md`: seven levels on local Ollama, 23 controlled tests, level 1 and 2 reached in the browser, no full seven-level human playthrough |

### What the owners already say

- Projects story (10-22): O1 "play first, story second", O2 fork comparison as
  a proof control, O3 "how OOPS is made" in `/wc/learn`. Lead OOPS with a
  click-to-load iframe on a separate origin. No company role-play.
- Interactive archive audit (10-26): rank 1 is an object cabinet, rank 2 an
  editorial story with one proof control. A1: compare three-object cabinet and
  direct page with identical Gandalf content. P1 to P2.5 define the gates.
- Cool-sites plan: one borrowed principle per room, rooms stay few. Rooms
  available today: Installation, Tour, Console, Let go, `/experience`, the
  open paper, `/wc/learn`, and the `/og` back room.
- Project_Brainstorm §4a (workshop-familiar companion) is a desktop companion.
  It says Mythcorp's project-story plan owns site exploration. Not a visitor
  candidate here.
- Game_Idea_Bank (grand strategy from Beyond All Reason to Stellaris, life
  sim, AI and DNA) holds banked ideas with no playable slice near the site;
  none becomes a candidate tonight.

### Exclusions that stand

Flight Lab, God's Eye View, GearScope out. Province War out until separated
from third-party assets. No company role-play. No learner data. No unpublished
cyber-team documents. `docs/` content is not served, but static files in
`public/` are (the lock allows any path with a file extension), so no
candidate may stage private material in `public/` even while held.

### Candidates, ranked

Ranking is by how much a visitor can do or watch per unit of gate, not by
quality. Effort is relative.

**C1. Gandalf Local, direct story page with a scripted defense control**
- Room: `/og` study first, later its own project page (one room, one principle:
  a choice makes a defense visible as a pass or a block).
- State label: in progress (local app playable; the web page is a proposal).
- Control that proves the claim: pick a defense level (2, 3 or 4), pick one of
  three authored guesses, see whether the exact-match filter, the AI reader or
  nothing catches it. Labeled "Scripted illustration, no live AI".
- Presentation: "A revival of Lakera's original Gandalf, unofficial and
  unaffiliated" next to the title, with the link to Lakera's published defense
  progression. The current build keeps the original seven-defense progression,
  layout and recovered artwork as `THIRD_PARTY.md` documents, so future players
  get the experience the original gave. Original levels and art replace it one
  piece at a time, with the archive kept for reference.
- Hosting shapes: (a) workshop room, local Ollama, no API spend, which also
  gives the cyber team the tested platform its plan asks for; (b) public site,
  a Worker in front of a hosted model with per-IP rate limits, a daily spend
  cap and a kill switch. Only (a) is needed for the illustration page.
- Evidence: `docs/FIDELITY-2026-10-26.md` in the Gandalf Local folder maps each
  of the seven defenses to the README and archive, with a live replay of the
  eleven calibrate cases on `qwen3.8:27b` (24 of 24 tests, no technical errors,
  latency inflated by machine load). Its open gap: the Lakera credit sits in the
  footer only, so attribution is not yet close to the title.
- Depends on: the Gandalf Local repo, the A1 comparison if Weibao authorizes it.
- Gate today: site lock (`LOCKED_OPEN_PATHS`); for (b) API cost, abuse and the
  secret-word handling must live server side; for any public build the recovered
  Lakera images. See F1 below.

**C2. OOPS, click-to-load room on its own origin**
- Room: a project page in the `/og` study, reached from the Console (`open oops`).
- State: playable (the game), proposal (the room).
- Control: two doors, "start fresh" or "load the curated save", with the iframe
  fetching nothing until pressed.
- Depends on: a curated public-safe save (not yet made), GitHub Pages or an
  `oops.` origin, phone clip as the fallback.
- Gate: site lock; `private_packs/`, book-world material and the loose image
  never ship; a subdomain on this Worker is a `wrangler.jsonc` change (needs
  Weibao). The origin is separate, so publishing it is its own decision.

**C3. "How the work gets made", fork and agent process, in `/wc/learn`**
- Room: `/wc/learn`, which already exists for "how this was built".
- State: proposal.
- Control (one): a stepper through one dated OOPS checkpoint, a rule that was
  added after a real mistake, showing the mistake, the rule and the next run.
  A fork upstream-versus-fork slider (Boring Notch four-tab notch, or Anki
  "Mark for repair") is a later second room, not part of this slice.
- Depends on: picking one OOPS checkpoint, upstream licences read per fork.
  Neutron is private; use only what it shows about process, never its source.
- Gate: privacy. Boring Notch's Today and D-hall tabs show real to-dos, Canvas
  items and the school menu, and Anki shows his own cards, so any fork visual
  must use a synthetic Today snapshot and a demo deck. Also Weibao's yes that
  the process story is public (Q2 of the projects
  story is still open); site lock.

**C4. Tiny side-view rocket sandbox (new)**
- Room: `/og`, next to the gravity lab; one principle, "a slider makes a trajectory
  legible as change". Fits the rocketry team without exposing its documents.
- State: proposal.
- Control: four sliders (thrust, burn time, mass, drag) with a trail and a live
  altitude graph, and a reset.
- Depends on: nothing outside the repo; canvas 2D, no physics engine.
- Gate: site lock only. Reduced-motion form (static trajectory on slider
  change) is part of the first slice.

**C5. Lumen demo on synthetic fixtures only**
- Room: `/og` study; the audit's "editorial story with a proof control".
- State: proposal.
- Control: a question-quality knob on one synthetic source passage, showing a
  generated item before and after review.
- Depends on: Lumen's own synthetic verification artifacts (`PROJECT.md` says
  they were copied in) and a decision on which E1 to E8 piece is stable.
- Gate: Lumen has 110 uncommitted files and a live delivery in flight; no
  learner data ever; no live model call from the site.

**C6. A complete ten-minute narrative game (new)**
- Room: its own page eventually; start as a back-room study.
- State: proposal.
- Control: one choice that changes the single environment; one ending.
- Depends on: a script and an art direction nobody has chosen. Largest effort.
- Gate: site lock; authored assets must be original.

**C0. The A1 comparison (not a candidate, a method)**
Build the cabinet and the direct Gandalf page with identical copy in `/og`,
run the P2 gates, adopt only if the cabinet earns it. Needs Q2 below.

### Findings, risks and open decisions

- **F1.** The October 26 audit describes Gandalf Local as having "original
  code/art". The repo says otherwise, and it is already public: `origin/main`
  tracks the 8 recovered Lakera images (`public/artwork/original`) and 5 archived
  frontend files, and `THIRD_PARTY.md` records that permission to redistribute
  has not been established. Keeping the original experience now and replacing it
  later is Weibao's recorded direction, so this is a fact, not a question. The
  one Mythcorp rule that follows: recovered images never enter this repo's
  `public/`, because the lock serves any path with a file extension. A Mythcorp
  Gandalf page uses original art only, with Lakera credit next to the title.
- **F2.** Nothing in this pass changes the "single-origin static" assumption: a
  cabinet or direct page for Gandalf can ship with zero inference and no
  third-party images if the page uses `public/wizard.svg`-style original art.
- **R1.** Public hosting (b) of Gandalf is the only candidate that spends money.
  It needs its cap and kill switch designed before any code, and a decision on
  whether a public prompt-injection game is acceptable on a personal site.
- **R2.** OOPS stat claims in the October 22 story (2,516 tests) are stale; the
  October 26 receipt says 3,218. Any page must date its numbers.

### Q-codes for Weibao

- **Q1.** Authorize the A1 comparison (private `/og`, Gandalf, identical copy)?
  Recommended: yes, scripted illustration only, original art only.
- **Q2.** Is the how-it-is-made story (C3) something you want public?
- **Q3.** Which Issues to close (Part 1): 13, 16 and 28 look safe; 33 mostly;
  17 and 19 are partial; 20, 21, 22 may be obsolete by the pivot (relabel);
  40 and 41 stay open.

### Unsaved ideas, for Weibao to file

Found in chats; I did not find them in the vault owners I grepped (the vault
`plans/` folder, plus this repo's `docs/`).

| Idea | Chat and date | Note |
|---|---|---|
| Tiny side-view rocket physics sandbox: four sliders, a trail, an altitude graph | "Find project ideas from Evan Chao", 2026-10-26 | Now C4 above; no owner holds it |
| Complete ten-minute narrative game: one room, one character, one changing environment, one ending | Same chat, 2026-10-26 | Now C6; no owner holds it |

Titles were skimmed for the last fourteen days; chat bodies were not opened. I
grepped the vault `plans/` folder and the OOPS `docs/` folder. The Dan Salvato,
multiversal-scope and Saga of Gu chats are held by OOPS research docs
(`ENGINE_AWARE_CHEATS_SOURCES`, `USER_VISION`, `SAGA_OF_GU_SCOUT_2026-10-24`),
so they are not listed. "Improve Mythcorp storytelling and UI" (2026-10-23) maps
to the projects story's October 26 intake; I assume it is covered and did not
open it. Only the two Evan Ciao ideas are confirmed unsaved.

### More to consider, two rounds

Round 1 (before candidates), round 2 (on the finished list).
`sharpen` was not run: the brief already named files, checks and scope.

- ACT NOW: F1 above (audit text disagrees with the repo); the Gandalf credit
  is footer-only (fidelity note gap).
- ACCOUNT FOR NOW: static files in `public/` bypass the lock; fork visuals need
  synthetic data; a live-model Gandalf needs server-side words, rate limits and a
  spend cap before code; OOPS numbers must carry dates.
- LATER: a before/after revision view for OOPS; the fork slider as a second
  `/wc/learn` room; a recorded Gandalf run with transcript.
