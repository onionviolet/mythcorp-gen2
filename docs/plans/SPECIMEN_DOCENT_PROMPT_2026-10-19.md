# Specimen docent: scrollytelling prompt, 2026-10-19

A ready-to-run brief for an `/og` study where the spectre watches the Tour as
you scroll. Below it: what the strongest Opus 5.5 builds teach, and what else
this repo could try. These are proposals, not accepted decisions.

## The prompt

Paste this into a fresh session at high effort. It assumes the session reads
CLAUDE.md, DESIGN.md and MAP.md first, so it does not restate theme or font rules.

```text
Build an /og study at src/app/og/specimen-docent/ called "Specimen docent".
Do not touch the front page, TourRoom or HoldInstallation. Do not ask
questions; make reasonable calls and record them in the sketch's blurb.

Premise, in one sentence: the specimen is a docent standing at the edge of the
Tour, and as you scroll it turns to look at whatever you are reading.

Read first: DESIGN.md (whole file, especially "Keeping the front page's
coolness", the spectacle budgets and the Installation section),
src/app/og/specimen-story/ (reuse useStoryScroll and the stage loader rather
than writing a new scroll engine), src/app/components/plain/rooms/TourRoom.tsx
and rooms/tour/ (reuse the four acts and their figures as content),
src/app/components/plain/HoldInstallation.tsx and holdModels.ts (how the
specimen already turns toward the pointer).

The one memorable thing: the specimen's attention. Everything else stays quiet.

Behavior, in order of priority:
1. Attention target. One function picks where the specimen looks: the pointer
   when it moved in the last 1.5s, else the active act's figure, else straight
   ahead. Drive the head bone (find it in the GLB skeleton) with a damped
   look-at clamped to a believable neck range, and let the body yaw follow
   with lag only when the head hits its clamp. If the skeleton has no usable
   head bone, fall back to whole-body yaw and say so.
2. Scroll beats. Native scroll, sticky stage, no wheel hijacking, no Lenis.
   Between acts the specimen's gaze travels with the fractional step value
   from useStoryScroll, so scrolling slowly makes it look slowly.
3. Reactions. The GLB has four animation clips nobody plays yet. List them,
   then use at most two as punctuation: one when the reader reaches the open
   paper (the one door that is open), one at the end. If a clip looks wrong on
   this rig, skip it and record why.
4. Interaction loop. Touching a figure (the paper's dumbbells, the star
   slider) makes the specimen glance at it, so the visitor's input has a
   visible consequence on the creature, not just the chart.

Layout: desktop puts the stage on the left third, bleeding past its column
(that is the page's one compositional oddity), acts on the right. Phone puts
a short stage pinned at top and acts below; the specimen must stay visible
and must not cover act text. Title and readout keep the --bg knockout stroke.

Readout (diegetic, real values only): ATTENTION <act name or "you">, GAZE
<head yaw in degrees>, STEP <fractional step to 2 places>.

Themes: test cyberpunk, luxury, paper and plain, light and dark. The specimen
uses the Installation's per-theme treatment; the gaze line, if you draw one,
is a graphite dotted rule on paper and emitted light in dark, never a glow on
paper.

Quiet fallbacks: prefers-reduced-motion snaps gaze per act with no travel and
plays no clips. No WebGL shows a still of the specimen per act. Keyboard: the
acts are focusable and focus counts as the attention target.

Do not: add a fourth hue, new fonts, hard-coded colours, inline global
keyframes, particle backgrounds, scroll-reveal fade-ups on every block, or a
second spectacle. Do not add copy explaining that the specimen is watching.

Done means: npm run check passes; you have screenshotted 1440x900 and 390x844
in two themes each and critiqued them against this brief; gaze tracks act 1
to 4 and the pointer in the browser preview; reduced-motion and phone layouts
verified. Add the route to MAP.md, a line in the /og index, and a STATUS entry.
Then stop and report what you cut and why. Do not promote it to the front page.
```

## What the best Opus 5.5 builds teach

Sources are community posts unless noted; one-shot claims are self-reported and
several admit follow-up passes.

- **One signature, everything else quiet.** Muzli's three demos each name a
  single memorable moment (a WebGL tide that drains as you scroll; a scrubbable
  title sequence; a springy player). Their prompts follow a fixed order:
  deliverable, audience, mood plus a "not" clause, the one memorable thing,
  sections, motion spec with named libraries, quality bar, output limits, and a
  "do not use" ban list. [Muzli](https://muz.li/blog/claude-opus-5-5-for-designers/)
- **The input is the explanation.** The lens lab (turn a focus ring, watch the
  focal plane move) and the data center (overload a rack, watch heat leave the
  roof) are the strongest entries because a control causes a physical
  consequence. That is DESIGN.md's "inputs create visible consequences" rule.
  [showcase list](https://github.com/OpenVGLab/awesome-opus5.5-frontend-showcases)
- **Scale as story.** Anthropic's Oct 3 thread reportedly featured a site that
  flies from outside the Milky Way down to Jupiter's moons. Prompts unpublished.
  [explainx summary](https://explainx.ai/blog/claude-opus-5-5-community-showcase-watermill-jupiter-water-2026)
- **Short brief, long leash, verify the finish.** The Invisible Cities build used
  three lines (task, no questions, a 6 hour budget) and six subagents. It stopped
  at about half the budget, so "done" needs a concrete checklist, not a time.
  [Quesma](https://quesma.com/blog/invisible-cities-one-shot/)
- **Scroll as rooms, not reveals.** The scroll-driven Three.js sites people cite
  move a camera between staged places: Cartier's six alcoves, Primland's terrain
  flythrough, Sleep Well's narrative beats.
  [Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026)
- **Self-critique with screenshots.** Every useful write-up has the agent
  screenshot desktop and phone and compare against the brief. This repo already
  has the browser pane and e2e for that.

## What else MYTHCORP could do

Ranked by fit with the rooms and the spectacle budget.

- **O1 Specimen docent** (the prompt above). Generalizes the existing pointer
  turn into one attention system, which the Installation could later reuse for
  the cursor echo and the cat.
- **O2 Scroll is time.** In a calm interior page, scrolling scrubs Chicago's day
  the way the horizon drag already does: the essay reads at dawn and ends at
  night. The readout shows the real clock it is simulating.
- **O3 Scale descent for the simulation lab.** A Jupiter-style dive from the
  whole star field down to one star, as the continuous route into
  `/experience` that BACKLOG already lists. Use the move-the-world trick to
  avoid float precision problems.
- **O4 Inline-updating paper.** The cybercrime paper's prose numbers change as
  the reader drags the rubric, Ladder of Abstraction style (already in BACKLOG).
  Quietest option, highest rigor.
- **O5 POV flip.** One act where the camera moves behind the specimen's eyes and
  you see the Tour as it does. Strong, but it spends the page's spectacle, so
  only as an `/og` follow-up to O1.

## Risks

- **R1** Orbit still breaks on phones; the docent must be designed phone-first.
- **R2** CI runners have no GPU, so gaze tests need position checks with
  generous waits, like the cat spec.
- **R3** The clips are untested on this rig and may look like a game asset,
  which DESIGN.md already rejected for the textured skin.
- **R4** Unrelated but due: the Chrome origin-trial token in `.env` expires
  2026-10-20.
