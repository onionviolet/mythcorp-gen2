# Specimen docent prompt vs the published field, 2026-10-20

Compares the fenced brief in `SPECIMEN_DOCENT_PROMPT_2026-10-19.md` with the
strongest published prompts for ambitious interactive, scrollytelling and 3D
web builds, mostly run on Claude Opus 5.5. It ends with a revised brief. These
are proposals, not accepted decisions.

The short version: our brief is already in the top tier on premise, scope
fences and repo delegation. Its weak spots all show up in what the 2026-10-20
build had to cut (see STATUS): it stated asset facts it had not checked, it
never worked out the phone geometry, it gave no cut order, and its "done"
leaned on open-ended critique instead of checks a run can pass or fail.

## Sources and how much to trust them

"Result seen" means I read a description of the output from the author, not
just the prompt. X returned HTTP 402 to automated fetches, so prompt text for
the X posts comes from the TripoGrowthLab mirror, which links each original.

| Source | Prompt text | Result seen | One-shot claim |
|---|---|---|---|
| [Muzli, Petras Baukys, 2026-09-28](https://muz.li/blog/claude-opus-5-5-for-designers/): three demos (Lenn site, Offset title sequence, Hummock player) plus a fill-in brief template | Full, in the post | Yes, with run notes | "One prompt, no notes", but each ran under a standing check-and-fix instruction and took 2 to 4 self-correction rounds (Lenn: about 80 min, four rounds) |
| [Quesma, Piotr Migdał, 2026-10-07](https://quesma.com/blog/invisible-cities-one-shot/): Invisible Cities in three.js | Full, two sentences | Yes | Self-described one-shot. Opus ran 1 h 25 min with six subagents and, by its own account, used about half the 6 h budget. No verification step is described |
| [Anthropic frontend-design skill](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md), [frontend aesthetics cookbook](https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics), [Prompting Claude Opus 5.5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5), [Prompting Claude Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5) | Guidance, not a build prompt | n/a | n/a |
| [MengTo, scroll-world-storytelling demo PROMPT.md](https://github.com/MengTo/Skills/blob/main/agent-skills/web-design/scroll-world-storytelling/demo/PROMPT.md) | Full | No (demo files exist, not inspected) | None. No target model named |
| [Jelly Press, Vib3Coded, 2026-09-30](https://x.com/vib3coded/status/2105353559327887843) (text via [mirror](https://github.com/TripoGrowthLab/awesome-opus-5-5-prompts)) | Full, very long | No, the result is a video in the post, not inspected | None |
| [Earth Atlas: The Living Planet, Gadgetify](https://x.com/Gdgtify/status/2104837836507955401) (text via [mirror](https://github.com/TripoGrowthLab/awesome-opus-5-5-prompts)) | Full, very long | No, not inspected | None |
| [AI orb UI motion for Claude Code, leolee, 2026-09-27](https://x.com/listudio/status/2104162483888062945) (text via [mirror](https://github.com/TripoGrowthLab/awesome-opus-5-5-prompts)) | Full, very long | No, not inspected | None |
| [Data center to atom, Crane](https://x.com/Cranefomo/status/2104223449849761837) (text via [mirror](https://github.com/TripoGrowthLab/awesome-opus-5-5-prompts)) | Full, three sentences | No, not inspected | None |

Results without prompts, so they are not in the comparison:

- Ryan Sael's [lens lab](https://x.com/RyanSael/status/2102591147927654847) and
  [data center](https://x.com/RyanSael/status/2102740041621762166). The
  [OpenVGLab list](https://github.com/OpenVGLab/awesome-opus5.5-frontend-showcases)
  tags both as one-shot ("一次生成"), but that is the list's wording; it
  publishes no prompt or author quote. Our 10-19 brief leaned on these two, so
  that lesson rests on outcomes only.
- Every's [golf game](https://every.to/vibe-check/vibe-check-opus-5-5-is-pulling-our-codex-converts-back-to-claude)
  (Katie Parrott, 2026-09-22): seven self-organized agents, 1 h 52 min, which
  ended when access ran out rather than when the work was done.
- [Martin8O/Website](https://github.com/Martin8O/Website): a Claude Code
  scrollytelling site with a GLB 3D layer over a 2D story that is "always the
  complete fallback", 411 unit tests on the pure scroll math, and ADRs. The
  prompt backlog is private, but the structure is the closest real match to
  this repo.

Corrections to the 10-19 brief's reference section: Quesma describes no
screenshot or self-critique step, so "every useful write-up has the agent
screenshot desktop and phone" overstates it. The Muzli builds did, because the
author added a standing instruction to check in a browser and fix at least
twice.

## Comparison

Cells are short paraphrases. "None" means the prompt does not address it.

| Point | Ours (10-19) | Muzli | Quesma | Anthropic | MengTo | Jelly Press | Earth Atlas | AI orb |
|---|---|---|---|---|---|---|---|---|
| Premise clarity | One sentence | Client, audience, mood plus a "not" clause | One line | Ground it in the subject; propose one if missing | Reduce the story to 5 to 7 beats first | Named concept paragraph | Long "ambition" section | One paragraph, with the orb named as the star |
| One signature moment | Named: the attention | Named "one memorable thing" field | None | "Spend your boldness in one place" | One final CTA, pick one render mode | Implicit (the burst) | Many reveals, no single one | Named: the orb as continuity element |
| Interaction spec | Priority list, glance on touch | Hummock: 1:1 tracking, fling by release speed | None | Motion that shows what changed is welcome | One CTA | Very detailed: picking, grab radius, throw velocity, keyboard map | Detailed per tool | Drag math with rubber-band formula |
| Motion spec | Damped look-at, clamps, no numbers | Named libraries; Hummock asks for a settling, interruptible spring and a 10% slow-mo switch (the run then chose 0.52 s, 0.76 damping) | None | One orchestrated moment | Native reversible scroll only | Physics constants and ranges | Bounded smooth camera | Beat grid, damping at least 0.72, closed-form springs |
| Ban list | Repo-specific | Concrete list, extended after each try | None | Concrete list; the 5.5 guide says name patterns, not "avoid generic" | None | None | No dashboard cards, no neon | Named bans incl. bouncy easing, glow on chrome |
| Fallbacks and a11y | Reduced motion, no-WebGL stills, keyboard focus | Reduced motion, phone | None | Floor: mobile, focus, reduced motion, contrast | Reduced motion, mobile | "Never goes blank", role=meter, focus-visible, keyboard | Touch, keyboard, reduced motion, scope tradeoff order | None |
| Verification loop | Two viewports, two themes, critique vs brief | Screenshot 1440 and 390 at three depths, name 3 weakest, fix only those | Author review | Screenshot and remove something; 5 and 5.5 guides warn generic "verify" instructions over-verify | Desktop, 390, reduced motion, reverse scroll, console | No console errors | Named invariants; "show actual results", no hard-coded "passed" | Contact sheet of one frame per beat before the full render |
| Done criteria | Checklist plus report cuts | "Works on a phone", a feature-worthy bar | Time budget | Quality floor | Checklist | Quality bar list | User-story sentence of everything that must work | Render specs |
| Time and effort | "High effort", no budget | Fresh session, run notes | 6 h budget, used about half | 5.5 default is medium; time budgets are advisory and runs finish early | None | None | None | None |
| Delegation to repo docs | Heavy: DESIGN, CLAUDE, MAP, reuse named files | Suggests CLAUDE.md rules | None | Skill is the doc | Delegates to a skill | None, single file | None, single file | None, single file |

## What ours does better

- **B1 Premise in one sentence.** Only Quesma is as terse, and it has nothing
  else. The long prompts bury their premise under feature lists.
- **B2 Reuse over invention.** It names the scroll engine, loader, rooms and
  pointer code to reuse. Every single-file prompt rebuilds from zero.
- **B3 Native scroll, no Lenis.** Muzli's Lenn brief and its wiring snippet use Lenis;
  ours keeps reversible native scroll, which MengTo also insists on.
- **B4 Diegetic readout of real values.** Earth Atlas is the only other prompt
  that separates measured from illustrated; ours does it in three fields.
- **B5 Scope fences and "record what you cut".** No published prompt fences
  off files or asks for a cut log. This is why the 10-20 run was honest about
  its gaps.
- **B6 Bans tied to house rules.** The 5.5 guide says vague "avoid generic"
  lines just swap one default for another
  ([Frontend design defaults](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5#frontend-design-defaults));
  ours names the specific patterns DESIGN.md already rejects.

One deliberate override: the Anthropic skill bans mono data labels and caps
eyebrows. Our readout uses both, because DESIGN.md makes mono the voice of
readouts and allows one caps label per section; the readout as a whole is
that one caps element. Keep it.

## Gaps, traced to the 10-20 build

- **G1 It asserted asset facts.** The brief said the GLB has "four animation
  clips nobody plays yet". Only one has any length, so the two reactions
  became one. Better: a step-zero audit (clips with durations, bone chain,
  bounding box) and branches written in advance, which is how MengTo makes the
  model pick a render mode before code.
- **G2 Phone geometry was never worked out.** The brief said where the stage
  pins but not what the phone layout must achieve. The figures sit straight
  below the head, so on phones the gaze became mostly a nod. Better: state the
  goal (act changes read as a head turn) and make the run sketch target
  positions at 390x844 before building.
- **G3 No cut order.** The no-WebGL stills were dropped, leaving text only,
  which DESIGN.md's "quiet fallback that preserves the idea" does not meet.
  Earth Atlas says which journey to finish first if scope forces a tradeoff;
  ours should rank its must-haves.
- **G4 The theme matrix was loose.** "Two themes each" let plain on an open
  route, and light versus dark, go unchecked. Better: name the exact
  theme by viewport combinations.
- **G5 No test for the attention logic.** R2 already said CI has no GPU, yet
  no spec was added. The priority choice in `pickAttention` (`attention.ts`)
  needs no WebGL: it takes inputs, anchor elements, the step and a timestamp,
  and only reads the anchors' rects. So a page-level spec with stub anchors
  and fixed timestamps can test it, the way Martin8O tests its scroll math.
  Playwright is already set up (`test:smoke`, `tests/e2e`, with its own
  `webServer`), so this needs no new dependency.
- **G6 "Critique against this brief" is open-ended.** The Opus 5 guide says
  generic verify or re-check instructions cause over-verification
  ([Task scope and over-verification](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5#task-scope-and-over-verification)),
  while the 5.5 guide recommends stating the completion condition up front
  ([Unattended agentic runs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5#unattended-agentic-runs)).
  So swap open critique for checkable criteria, plus one bounded pass: Muzli's
  "name the three weakest elements, fix them, touch nothing else", and the AI
  orb prompt's contact sheet of fixed frames.
- **G7 No numbers for motion.** "Damped look-at clamped to a believable neck
  range" leaves feel to chance. The AI orb prompt states its springs as
  numbers, and Muzli's Hummock run wrote its chosen spring values into the
  report. Ours should make the run pick damping, clamps and the body-follow
  threshold, then record them so the next pass can tune from a baseline.
- **G8 No plan before code.** The Anthropic skill plans first, MengTo writes a
  beat ledger, and DESIGN.md already says to plan a timeline in words. Ours
  jumps from priorities to code.

Not gaps: dropping the gaze line was the right cut (it would be a second
effect), and "high effort" with no time budget is fine. The 5.5 guide says
time budgets are advisory and runs finish early
([Time signals](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5#time-signals-for-multi-agent-harnesses)),
which matches Quesma stopping at half its 6 h. A completion condition is the
better stop rule.

## Revised brief

Standalone, same target path. It works for a rebuild or a second pass on the
existing study: facts learned at ac51f98 are stated as known so a rerun does
not rediscover them, and the audit overrides them if they have changed.

```text
Build or revise the /og study at src/app/og/specimen-docent/, "Specimen
docent". If the folder exists, revise it in place. Do not touch the front
page, TourRoom, HoldInstallation or holdModels.ts. Do not ask questions; make
reasonable calls and record them in the sketch's blurb and STATUS.

Premise, in one sentence: the specimen is a docent standing at the edge of the
Tour, and as you scroll it turns to look at whatever you are reading.

The one memorable thing: the specimen's attention. Removing it should make the
page mean less, not just look calmer. Everything else stays quiet.

Read first: DESIGN.md (whole file, especially "Keeping the front page's
coolness", the spectacle budgets and the Installation section), the STATUS
entry "/og/specimen-docent study, 2026-10-20", src/app/og/specimen-story/
(reuse useStoryScroll and the stage loader), src/app/components/plain/rooms/
TourRoom.tsx and rooms/tour/ (reuse the four acts and their figures),
src/app/components/plain/HoldInstallation.tsx and holdModels.ts (how the
specimen turns toward the pointer).

Step 0, audit before design. List the GLB's clips with duration and keyframe
count, the bone chain from root to head, and the model's bounding box. Known
as of ac51f98: one usable clip (Armature.002Action.002, a 2.9s paw lift), the
other three empty or one frame; the neck chain is neck_1, neck_2, hed after
GLTFLoader renaming; the body is about 2.3 units long and 0.9 tall. If the
audit disagrees, trust the audit. Branches: no usable clip means no
reactions; one means a single reaction when the paper figure comes into view;
two or more allows a second at the end. No head bone means whole-body yaw.

Plan in words before code, in your first progress update: the attention
priority table, and a beat sheet per act (what the reader sees, where the
specimen looks, the readout values). Pick numbers for gaze damping, neck yaw
and pitch clamps, the body-follow threshold and the glance length, and record
them in STATUS.

Behavior, in order of priority:
1. Attention. One pure function picks the target: a figure control touched in
   the last 2s, else the pointer if it moved in the last 1.5s, else a
   keyboard-focused act, else the figure crossing the reading line, else
   straight ahead. Split the turn across the neck chain; the body follows
   with lag only past the neck clamp.
2. Scroll beats. Native scroll, sticky stage, no wheel hijacking, no Lenis.
   Gaze travel follows useStoryScroll's fractional step, so slow scrolling
   makes it look slowly.
3. Interaction. Touching a figure control (the paper's dumbbells, the star
   slider) makes the specimen glance at that control.
4. Reactions, per the step 0 branch.

Layout: desktop puts the stage in the left third with the specimen bleeding
past its column (the page's one oddity), acts on the right. Phone pins a short
stage at top with acts below; the specimen stays visible and never covers act
text. The phone goal is that changing acts reads as a head turn, not only a
nod. Before building it, sketch where each act's target sits relative to the
head at 390x844 and choose a framing that gives visible yaw between acts.
Record the measured yaw per act at both viewports in STATUS.

Readout (diegetic, real values only): ATTENTION <act name or "you">, GAZE
<head yaw in degrees>, STEP <fractional step to 2 places>. Title and readout
keep the --bg knockout stroke. The readout is mono with caps keys on
purpose; as a whole it is this section's one caps element.

Themes: the specimen uses the Installation's per-theme treatment. No gaze
line; it would be a second effect.

Fallbacks: prefers-reduced-motion snaps gaze per act with no travel and plays
no clips. No WebGL shows one still of the specimen per act, looking at that
act and captured per theme, so the idea survives without the canvas. Acts are focusable and focus
counts as attention.

If scope forces a tradeoff, finish in this order and drop from the bottom,
recording each drop: (1) attention, scroll gaze, reduced motion, keyboard;
(2) phone composition; (3) the figure glance; (4) no-WebGL stills;
(5) the reaction clip.

Do not: add a fourth hue, new fonts, hard-coded colours, inline global
keyframes, particle backgrounds, scroll-reveal fade-ups on every block, or a
second spectacle. Do not add copy explaining that the specimen is watching.

Test: one Playwright spec in tests/e2e/ (no new dependency). It checks the
attention priority order and pointer staleness with stub anchor elements and
fixed timestamps, then loads the route with reduced motion and checks that
ATTENTION changes per act on scroll, with generous waits because CI has no
GPU.

Done means all of these are true:
- npm run check and the new spec pass.
- Screenshots at 1440x900 and 390x844 in paper light, cyberpunk dark, luxury
  dark, and plain light and dark on an open route (the unlocked dev server).
- A contact sheet per viewport in one theme: each act's settled frame plus
  one mid-transition frame. In every frame the specimen is visible, no act
  text is covered, and the readout matches where it looks.
- One pass naming the three weakest elements across the sheets, fixed, with
  nothing else touched.
- STATUS records the audit, the chosen numbers, the per-act yaw, every cut
  with its reason, and a "not checked" line.
- MAP.md has the route, the /og index has a line, STATUS has the entry.
Then stop and report. Do not promote it to the front page.
```

What changed against the 10-19 brief: G1 became step 0, G2 the phone goal and
sketch, G3 the cut order, G4 the named matrix, G5 the test, G6 and G7 the
contact sheet, the bounded pass and the recorded numbers, G8 the plan in
words. Everything B1 to B6 credits is kept, at roughly the same length.
