# Backlog

This is the small, triaged local queue. GitHub Issues are an intake surface and
currently include completed items that still need closing, so they are not the
source of truth for what to build next.

## Next audits

- Retest the defensive plain-canvas release on the original affected Chrome
  profile. Two baseline attempts did not reproduce the stale composition, so
  the synchronous backing-store release is hardened but not a confirmed fix.
- Reconcile open GitHub Issues against shipped work, then close or relabel stale
  issues.
- Run mobile, accessibility, and performance passes on `/`, `/experience`, and
  `/wc/papers/ai-cybercrime`.
- Give `/about` one concrete personal artifact or timeline fragment.

## Product work worth retaining

- Prototype a bounded gravity mode for the holding screen where selected words,
  glyphs or a specimen can fall and settle as real 3D bodies. Define the reset,
  collision bounds, reduced-motion form and low-power fallback before promoting
  it from `/og`; do not make the default page depend on a physics engine.
- Continue the AI cybercrime paper with additional interactive figures.
- Add a low-power fallback for the 3D experience.
- Decide whether the fourth-theme builder in
  `docs/plans/FLAGSHIP_FOURTH_THEME.md` is still a desired flagship.

## Styles of coolness, 2026-10-07

The front page now carries four styles as rooms (see DESIGN.md, Front-page
rooms). The `/og/specimen-story`, `/og/orbit` and `/og/gravity` studies that
preceded them stay in `/og`; orbit still breaks on phones. Further candidates, ranked:

- Shared daily room: seed the lander scene by date so every visitor sees the
  same scene today, as an alternative to the per-visitor reload rotation.
- Local-time lander: drive the scheme or Halo intensity by Chicago time and
  show it in the readout as a real value.
- Visit counter in the readout (`VISIT 04`), stored locally, never sent.
- Continuous route transition from the lander into `/experience`, in the
  Active Theory manner, with direct navigation preserved.
- Inline-updating figures for the cybercrime paper, in the Ladder of
  Abstraction manner, where a control changes the numbers in the prose.

## Front page next, 2026-10-07

From `docs/audits/AI_TELLS_2026-10-07.md`. Ranked; the first needs the
owner's input.

- A visible name with one current interest. (The contact email is real and
  the 67 phone number is an intended joke; leave both.)
- The operator's desk: open on one real working artifact with a signed note
  and annotations that reveal a draft excerpt.
- The specimen cabinet: the spectre with a museum label saying why it is here,
  one treatment control, settings in a drawer.
- Let go as a word game: visitors rearrange the fallen letters into a phrase
  worth keeping, instead of watching the same words collapse.
- Make every changeable readout value look changeable (persistent arrow or
  underline), separate from plain measurements.
- A static specimen image and visible caption when WebGL fails, so the DOM
  layer can carry the premise.

## History

The previous mixed backlog is preserved at
`docs/archive/BACKLOG-2026-09-07.md`. It is useful for provenance, but many of
its entries have shipped or no longer match the repository.
