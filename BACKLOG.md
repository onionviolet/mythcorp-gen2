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

## History

The previous mixed backlog is preserved at
`docs/archive/BACKLOG-2026-09-07.md`. It is useful for provenance, but many of
its entries have shipped or no longer match the repository.
