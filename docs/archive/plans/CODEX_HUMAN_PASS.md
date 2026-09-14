# CODEX_HUMAN_PASS.md

> Direction update: the owner chose a **storefront vs workshop** approach. The execution plan is now `CODEX_BRIEF.md` (triage weak pages into `/og`, keep one mouse-reactive landing title). Task 1 and Task 2 below (rewrite `/about` and the hero in place) are SUPERSEDED. The **voice guide, the audit, and the Guardrails section here still apply.**

A scoped plan for codex to make MYTHCORP read as **made by a specific human**, not assembled by a machine. Read `DESIGN.md` and `CLAUDE.md` first; every task below stays inside those rules (theme tokens only, no em-dashes anywhere, files under ~250 lines, break the grid once per page, diegetic over decorative).

## The core idea

"More human" is not a new visual style. It is **evidence of a hand and a point of view**. Research on the current anti-AI-slop moment converges on four levers, all of which this site can pull without betraying the megacorp fiction:

1. **Intentional imperfection** with purpose (slight asymmetry, hand-set spacing, a wobble that is clearly a choice, not a bug).
2. **Real, specific content** (a real name, real dates, real numbers, real screenshots) instead of confident-but-empty placeholder prose.
3. **Warmth in voice** (first person, small admissions, in-world microcopy) over corporate neutrality.
4. **Motion and interaction that feel alive** (reacts to the cursor/scroll, honors reduced-motion), not decorative loops.

The generic-AI tell is the opposite of each: perfect centered symmetry, plausible filler copy, neutral third-person voice, and motion that plays the same regardless of the visitor. The site's own `DESIGN.md` already bans the visual half of this. This pass closes the gap on the **content and voice** half, and fixes the two pages that quietly fell back into the slop skeleton.

Sources that informed this framing are listed at the bottom.

## Audit: where the site currently reads as machine

Grounded in the current source, not hypothetical:

- **`src/app/about/page.tsx`** is the exact "centered hero" skeleton `DESIGN.md` bans: centered column, `[ ABOUT ]` caps label, one big serif line, a divider, a second paragraph. It is also written in neutral brand-voice ("MYTHCORP is a passion project") with no actual person in it. This is the single most machine-feeling page.
- **`src/app/components/NewLandingPage.tsx`** hero is perfectly centered with an `EST. 2024` rule flanked by two symmetric hairlines. The flanked-caps-divider is itself a common generated-hero motif. The self-aware alignment-grid egg is good and human; the surrounding composition undercuts it by being dead symmetric.
- **Voice drift**: `/about` says "Made in Chicago, with AI as a creative partner," which is honest and human, but it is the only sentence with a pulse and it is buried in the smallest, faintest text on the page.
- **No trace of the maker anywhere the visitor lands first**. The `/wc/*` section holds the real person; the public entry (`/`, `/about`) is all costume, no hand.

## Tasks for codex

Do these in order. Each is self-contained and shippable. Keep `npm run check` green after every task. Test every visual change in all three themes (cyberpunk, luxury, paper) as `DESIGN.md` requires.

### Task 1 — Rewrite `/about` so it stops being the slop skeleton
**File:** `src/app/about/page.tsx`

- Break the centered column. Use an asymmetric layout (left-weighted text, a readout or oversized number pinned off to one side) so it obeys the "break the grid once, on purpose" rule.
- Rewrite the copy in **first person, present tense**, with at least one concrete, specific, admittable detail (why it exists, what broke, what the author was avoiding). Keep it short and warm, never snarky. No em-dashes.
- Keep it diegetic: frame the bio as a personnel readout / "operator on file" panel rather than an About marketing block, so it fits the fiction while carrying a real human.
- Link out to `/wc/about` as "the person behind the desk" rather than a bare `/wc/learn` link.
- **Acceptance:** does not read as centered-hero; contains a real first-person voice; passes all three themes; no hardcoded colors.

### Task 2 — De-symmetrize the landing hero
**File:** `src/app/components/NewLandingPage.tsx` (and `landing/HeroTitle.tsx` if needed)

- Replace the symmetric `EST. 2024` twin-hairline divider with a single, off-center diegetic detail (one readout, one asymmetric rule, or a corner-pinned label). One deliberate oddity, not two mirrored ones.
- Nudge the hero column off dead-center (small, intentional offset) so the composition has a hand in it. Keep it subtle; the boot sequence stays the spectacle ceiling.
- Preserve the alignment-grid egg and `replay the boot sequence` affordance.
- **Acceptance:** hero is no longer mirror-symmetric; still calm; reduced-motion respected; all three themes checked.

### Task 3 — Add a small "hand of the maker" signature primitive
**New file:** `src/app/components/MakersMark.tsx`

- A tiny, reusable, theme-token-only component: a single line of in-world microcopy that carries a real trace (for example a build note, a "last touched" stamp, or a one-line aside in the author's voice). It must transform across themes (per the one big rule), not look identical in all three.
- Mount it in one or two low-key spots (footer of `/about`, base of `/og` index) where a person would sign their work. Do not spray it everywhere; scarcity is the point.
- Keep it under ~60 lines. Add a `// Walkthrough:` pointer only if a walkthrough is written; otherwise no tutorial comment.
- **Acceptance:** greppable name, tokens only, visibly different per theme, used in at most two places.

### Task 4 — Warm up the highest-traffic microcopy
**Files:** `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/components/ComingSoon.tsx`, `/contact` stub

- Audit each user-facing string. Replace any neutral/system phrasing with short, in-world, first-person-adjacent warmth (the 404 and error boundary are where humans notice voice most). Keep it warm, never snarky, never long. No em-dashes.
- **Acceptance:** no generic "Something went wrong" style strings remain; each message sounds like the same person wrote it.

### Task 5 — Make one interaction react to the visitor
**File:** pick one existing surface (candidate: `SkylineBackdrop` or the hero) 

- Add a single, restrained cursor- or scroll-reactive motion using existing theme motion tokens (`--motion-ease` / `--motion-fast` / `--motion-base`). The point is that the page responds to *this* visitor, which reads as alive rather than pre-rendered.
- Must honor `prefers-reduced-motion` (`motion-safe:`), and must not touch the star-count clamp or the boot-sequence spectacle budget.
- **Acceptance:** motion reacts to input; disabled cleanly under reduced-motion; no dropped frames on mid-tier GPU; theme tokens only.

## Guardrails (do not violate)

- No new fonts, no new hues, no hardcoded colors, no inline global keyframes.
- No em-dashes in copy, code, comments, or this plan's follow-ups.
- No glassmorphism outside luxury, no glow outside cyberpunk/luxury.
- Every touched component must still transform across all three themes.
- Do not add a testimonials/pricing/logo-wall/feature-triplet section. The site has none and must never look like it might.
- Keep files under ~250 lines; split into a feature folder if any climbs past.
- `npm run check` must stay green. Update `MAP.md` if any route or shared component is added (Task 3).

## Out of scope for this pass

Handmade/hand-drawn illustration or paper-texture assets are on-trend for "human" design but conflict with this site's closed three-font, three-hue, diegetic system. Do not introduce them. The humanity here comes from **voice, asymmetry, real content, and responsiveness**, not from decoration.

## Research sources

- [Ditching Digital Perfection: Why Imperfect Design is Dominating 2025 (WE AND THE COLOR)](https://medium.com/we-and-the-color/ditching-digital-perfection-why-imperfect-design-is-dominating-2025-abd3d88c5979)
- [The creative value of imperfection in modern design (TMC)](https://wearetmc.com/insights/the-creative-value-of-imperfection-in-modern-design/)
- [21 Smart Tips to Make your Designs feel More human and real (Acodez)](https://acodez.in/tips-to-make-your-designs-feel-more-human-real/)
- [Why Brands are Moving Toward Authentic, Imperfect Design (Ideadesk)](https://ideadesk.co.uk/why-brands-are-moving-toward-authentic-imperfect-design/)
- [AI Slop Web Design: Spotting and Fixing Generic Websites (925 Studios)](https://www.925studios.co/blog/ai-slop-web-design-guide)
- [How to fix the 'AI-generated' look in your frontend (DEV)](https://dev.to/alanwest/how-to-fix-the-ai-generated-look-in-your-frontend-1ahh)
- [Why Your AI Keeps Building the Same Purple Gradient Website (prg.sh)](https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website)
