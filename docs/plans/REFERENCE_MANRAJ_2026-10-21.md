# Reference study: manraj.me, 2026-10-21

Source: [manraj.me](https://manraj.me/), Manraj Singh's portfolio. I studied it
in the browser pane at 1440x900 on 2026-10-21. I did not check phone or reduced
motion. These are proposals, not accepted decisions. The intake follows
DESIGN.md's reference protocol.

## What it does

- **N1 One particle body for the whole page.** The name is made of particles.
  As you scroll, the same cloud breaks apart and re-forms into each section's
  subject: a LiDAR room scan for NoStep, a calendar grid for Tartan, a waveform
  for Soundalike, the ScottyLabs dog under Work. Nothing reloads; the page reads
  as one object changing shape.
- **N2 One proof per project.** NoStep has a "same door, different angle"
  slider: drag the camera and the naive pixel estimate drifts (26.33 inches)
  while the rectified width holds at 32.00. The control argues the project's
  claim.
- **N3 A discovery ledger.** A "Discoveries 1/34" chip sits in the corner, and
  each hidden interaction fires a short toast ("Parted the cloud", "Saw the
  scan", "Picked up the ball"). Hidden play turns into something you can see
  and count.
- **N4 The name is a toy.** "Break my name" turns the name into Breakout
  bricks, with a high score and a play count (27,608 and 661 when I looked).
- **N5 Tune the radio.** A range slider labeled "Three stations hide on this
  band". Landing on a station reshapes the cloud and lights the title.
- **N6 Honest captions.** "Screens show sample data." "Any room scan you see
  here is a generated sample, not a real home."

## Intake (DESIGN.md protocol)

1. **Studied:** N1, the persistent cloud that re-forms per section, and N3,
   the discovery ledger.
2. **Visitor does:** scrolls; pokes at things.
3. **What changes:** the cloud takes the shape of whatever section you are in;
   the counter goes up and a toast names what you found.
4. **Meaning:** this is one continuous author, and the site rewards curiosity.
5. **MYTHCORP room:** the Tour (N1), and the Installation readout (N3).
6. **Quiet fallback:** for N1, a still of each act's shape; for N3, the ledger
   as a plain list in the console room.
7. **Do not copy:** black and orange, the huge grotesk name hero, Breakout,
   the radio, the toast wording, the leaderboard.

## What MYTHCORP could take

Ranked by fit with the rooms and the one-spectacle budget.

- **O1 The specimen dissolves into each act.** In the Tour, the spectre's
  particle body re-forms into each act's subject: the paper's dumbbell rows,
  the falling solar curve, the four colony phases, a star field. Then it
  gathers back into the specimen at the contact act. `ParticleObject` already
  samples both GLB and image or SVG sources into clouds, so the core is
  sampling two shapes to the same count and blending between them. Do this as
  an `/og` study first. It competes with the docent study for the same room,
  so pick one per page.
- **O2 An anomaly ledger in the readout.** A row such as `ANOMALIES 03 / 12`
  that counts the hidden behaviors the site already has: horizon drag, press
  and hold, the cat's demo, console commands, the scheme flip. Each find logs
  one in-world line. Keep it in localStorage and never send it. This builds no
  new rare events (DESIGN.md says not to); it makes the existing ones findable.
- **O3 Proof controls stay the standard.** N2 is DESIGN.md's Ciechanowski
  rule. The Tour figures already do this; the cybercrime paper's
  inline-updating figure in BACKLOG is the closest next step.
- **O4 Sample-data captions.** Wherever a figure or screen uses sample or
  approximate data, label it plainly, the way N6 does. This is cheap.

Skip: a server-side leaderboard (STATUS records skipping Worker storage
counters over billing), and Breakout, which the Let go room already covers.

## Risks

- **R1** Particle morphing is heavy on phones. Clamp the count the way the
  Simulation clamps stars, and give the narrow layout a lower budget.
- **R2** `ParticleObject`'s `sampleMesh` reads the raw position attribute once,
  with no skinning, so a head-bone gaze would not show in particle form. O1 and the docent's gaze do not
  combine for free.
- **R3** O2 must not turn into a checklist that nags. No progress bar and no
  "you missed some" prompts.
