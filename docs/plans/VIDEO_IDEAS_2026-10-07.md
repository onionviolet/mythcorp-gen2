# Ideas from the Oni Ronin 3D-site tutorial, 2026-10-07

Status: proposals, not accepted decisions. Only O1 is built.

Source: MiladiCode, "Build a Stunning 3D Website with Claude Opus 5.5"
(https://www.youtube.com/watch?v=TnduiS4kyg8), its prompt PDF
(https://github.com/miladicode823-coder/Oni-Ronin) and the finished site
(https://fluffy-arithmetic-444cb3.netlify.app/). The transcript was not
retrievable; techniques come from the prompts and the live site.

## What the video actually does

1. A GLB character on a slow looping walk, with an aura.
2. A scroll-driven camera that orbits the character, starting at mid distance.
3. The headline sits behind the character, so the model occludes the type.
4. A scroll-driven spiral of 14 glass cards orbiting a central sword, descending
   in perspective, with hover states. Card art and loops are AI-generated.
5. An automated test pass (TestSprite) that finds issues for the agent to fix.

The site is a game landing page: centered hero, stat row, card gallery,
countdown, pre-order. DESIGN.md bans that skeleton. Take the mechanics, not
the page.

## Options, ranked

**O1. A new scene on every reload (built).** The lander rotates through its
four authored scenes per load instead of always opening on Signal. See STATUS.

**O2. Specimen in front of the words.** Technique 3. Let the spectre overlap
"WORK IN PROGRESS" so the model and the type share depth instead of stacking.
Cheap, high impact, stays inside the one-spectacle budget. Needs a mask or
z-order pass in `PlainHold` and checks at phone width.

**O3. Wake the spectre.** Technique 1. `public/spectre.glb` already has a
skin and four clips (`Armature.001Action`, `Armature.002Action.002`, plus two
armature tracks) that no code plays. Play one through drei `useAnimations` in
`HoldStage`, so the specimen breathes or moves instead of only turning.
Unknown: what the clips contain. Reduced motion holds a still pose.

**O4. The back-room spiral.** Technique 4, rebuilt in the fiction: `/og`
sketches as plain-ink cards orbiting the spectre, descending as you scroll,
each showing a real screenshot of that room (DESIGN bans stock and generated
filler). It also solves DESIGN priority 3 (`/wc` reads like a directory).
Build as an `/og` study first. Needs a keyboard and no-WebGL list fallback.

**O5. Scroll as camera, on a reading room.** Technique 2 belongs on
`/experience` or a paper, not the no-scroll lander. Example: the
cybercrime paper's figures orbit into view as sections arrive.

## Per-reload variety beyond O1

- Rotate the specimen too, once there are more than two models.
- A visit counter in the readout (`VISIT 04`). In-world, real value.
- A daily seed instead of per-visitor rotation, so everyone shares "today's
  room". Choose this over O1 if shared screenshots should match.

## Not worth taking

- AI-generated card art and loops: conflicts with real-content-only.
- TestSprite: the repo already has Playwright coverage for the lander.
- Glass cards: glassmorphism is luxury-only per DESIGN.md.
