# PLAN, comprehensive improvement roadmap

Written 2026-07-21. This sequences the existing BACKLOG (plus repo-health findings) into phases ordered by leverage: protect the work first, build the safety net, then performance, reach, content, and finally one flagship. Each item cites its BACKLOG number where one exists. Work top to bottom; within a phase, items are independent.

## Phase 0, stabilize the repo (do first, this session)

The single biggest risk right now is not a missing feature, it is losing finished work.

1. **Get off the detached HEAD and commit batch 7.** HEAD is detached at `3eafa8f` with all of batch 7 uncommitted: the Simulation reset-aliasing fix, the FMHY orphan deletions, five new /wc/learn primitives, the build-a-playground walkthrough, snippet extractions, doc updates, and the untracked `DESIGN.md`. Create a branch (e.g. `batch-7-learn-interactive`), commit in logical chunks (bugfix, cleanup, learn upgrade, docs), run `npm run check`, then merge to `main`. Pushing to origin needs explicit user confirmation per CLAUDE.md.
2. **Reconcile `main` vs the detached line.** `main` and origin have moved independently before (batch 5 merge). Confirm `3eafa8f` contains everything on `origin/main` before fast-forwarding, so nothing regresses.
3. **Prune stale remote branches** (`chore/refresh-fmhy`, old `claude/*`, `copilot/*`) once their content is confirmed merged. Deletion of remote state needs user confirmation.

## Phase 1, safety net (infra that protects every future change)

4. **CI build guard (#70).** GitHub Actions: `npm ci && npm run check` on every PR, plus a guard against `bun.lock` reappearing. One job, node 20. Everything after this gets automatic verification.
5. **Playwright theme-bootstrap smoke test (#35).** The pre-paint script in `layout.tsx` is load-bearing and untested. One spec file, three themes, assert `dataset.theme` and first-paint background. Wire into CI as `npm run check:e2e`.
6. **Cloudflare branch preview deploys (#21).** Per-PR URLs make the mobile QA phase (below) trivial and de-risk every visual change.

## Phase 2, performance and delivery (biggest user-facing wins per hour)

7. **Subset `Inter_Bold.json` (#12).** 5.2MB font for 8 unique characters ("MYTHCORP"). Subsetting drops ~5MB off first boot. Best effort-to-impact ratio in the whole backlog.
8. **Self-host /animals clips (#68).** Kills the Giphy hotlink dependency, the attribution requirement (#67), and the silent-degradation failure mode. Serve `.webm` with `.mp4` fallback from `public/animals/`.
9. **Security headers (#33).** `public/_headers` with CSP (permissive enough for R3F), HSTS, nosniff, referrer and permissions policies. Validate with securityheaders.com after deploy.
10. **Per-route OG images (#29).** Sharing any page currently gets a blank card. Start with `/` and `/wc`, then papers and walkthroughs. Verify `next/og` builds under OpenNext on Workers before merging.
11. **Cloudflare Web Analytics (#31).** Cookieless beacon, production-gated. Without it, all later polish effort is guessing about where traffic actually goes.

## Phase 3, reach and robustness (make the site work for everyone)

12. **One device-capability gate (#69).** `useDeviceCapability()` returning `{ reduceMotion, gpuTier, lowPower }`. Build this before the items that need it, so #10, #11, and every future heavy feature consult a single source of truth.
13. **3D mobile fallback (#10).** Consume the gate: drop particle counts and disable Bloom on low tiers, or offer a "render anyway" overlay.
14. **Mobile QA pass (#9).** Never verified on a real phone. Use the Phase 1 preview URLs on iOS Safari and Chrome Android; file findings as issues, fix in a follow-up.
15. **Accessibility pass (#11).** Extend `prefers-reduced-motion` to LoadingScreen, LandingPage, HelpDot, Konami egg, heading shadows. Keyboard nav through SiteHeader, focus rings, ARIA on figure controls, alt text on the skyline.

## Phase 4, content flywheel (the site's actual substance)

16. **More figures for the ai-cybercrime paper (#5).** Expert-debate quadrant and attack-chain step-through first; they map most directly to existing tables.
17. **Paper continuation (#14).** Convert the remaining chapters (pre-AI baseline, present landscape, future horizon, countermeasures, conclusion), tightening prose against the original.
18. **Reading-time + last-updated stamps (#37)** and **print stylesheet (#38).** Small trust signals for the papers; both are an afternoon combined.
19. **`/wc/now` page (#36).** Cheapest recurring content surface; keeps the site visibly alive between larger pieces.
20. **Another /og ramble.** The Calhoun and Doubt essays are the strongest recent additions (documentary-to-essay with an interactive payoff). Continue the vein; each new ramble should ship with at least one interactive figure.

## Phase 5, one flagship wow (pick one, plan as its own arc)

Per the IDEABOARD's own rule: a flagship, not all of them. Recommended sequence:

21. **Warm-up: ASCII / halftone post-process pass (#64).** Small-medium scope, best effort-to-wow ratio, slots into the existing postprocessing pipeline as a MainMenu toggle.
22. **Flagship SELECTED (2026-07-23): Author the fourth theme (#72).** A `/wc/learn/theme-lab` page where the visitor builds a full fourth theme live, the whole site restyles, and they save + share it. Chosen over the scrollytelling paper because it is the whole-page evolution of the batch-7 `TokenPlayground` work, ties deepest into the site's own architecture (the token system IS the design language), and ends in a shareable artifact. Full spec: `FLAGSHIP_FOURTH_THEME.md`. This is Weibao's hand-built lane, not a Codex task. Alternate flagships parked on the self-modifying ideaboard (#73 to #75).
23. **Prior flagship candidate (not chosen): scrollytelling cybercrime paper (#59).** Still strong, kept as the next arc: reuses GSAP, elevates the strongest existing content, drives the Phase 4 figures. GPGPU morph (#58) and the drivable portfolio (#55) are more spectacular but do not feed the content flywheel.

## Explicitly deferred (do not pick up without a reason)

- **Sandpack (#39)**: deferred by decision, custom playgrounds won.
- **MDX (#7)**: only when the third paper is being authored; TSX pages are fine at current volume.
- **Multiplayer items (#18, #47, #48)**: build the Durable Object layer once, and only when there is a concrete first consumer.
- **Chomik (#23), GitHub profile page (#27)**: separate projects, not site improvements.

## Standing rules that apply to every phase

- `npm run check` green before every commit; verify visual work in all three themes (DESIGN.md checklist).
- No em-dashes anywhere. Theme tokens only, no hard-coded colors. Files stay under ~250 lines.
- Update STATUS.md at the end of each session; update MAP.md when routes or structure shift.
