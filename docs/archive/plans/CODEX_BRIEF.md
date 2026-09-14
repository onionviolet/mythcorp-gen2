# CODEX_BRIEF.md

Direct handoff for codex. Strategy: **storefront vs workshop**. Keep a clean, intentional main site with ONE living signature (the mouse-reactive title). Slim the thin pages down to honest WIP-flagged stubs instead of deleting them, park the genuinely off-brand page into `/og`, and soft-hide `/og` so rough drafts do not shape first impressions or search. `CODEX_HUMAN_PASS.md` still holds for the **voice guide** and **guardrails**; its Task 1 and Task 2 are SUPERSEDED by this file.

## The decisions (from the site owner)

- WIP home: **extend `/og`**, no separate `/wip`.
- Landing: **keep one mouse-reactive title** as the signature. Move the experimental wavy-title-with-3D-model composition into `/og`.
- `/about` and `/contact`: **stay live but slim**, flagged as WIP. Keep the `(676) 767-7676` palindrome joke and the email on contact.
- `/animals`: **fully parked** into `/og` (rebuild later).
- `/og` access: **soft-hidden**. Reachable by URL, `noindex`, reached through one subtle in-world door, NOT password-gated, NOT removed. Gate by sensitivity, not by unfinished-ness.
- Images: **skip now.** Future direction is cute anime / animal art; when that happens it must be licensed or clearly attributed (no stock-slop), likely scoped to `/og`.

## Before you start

1. Read `DESIGN.md`, `CLAUDE.md`, `MAP.md`, and the voice guide + guardrails in `CODEX_HUMAN_PASS.md`.
2. Hard rules: theme tokens only (no hex/rgb in components), **no em-dashes** anywhere, files under ~250 lines, every component transforms across cyberpunk / luxury / paper.
3. `npm run check` must be green before each commit. Commit per task.
4. Moving a route is structural. Do Task 2 (parking `/animals`) only after confirming the plan; if unconfirmed when you start, stop and ask.

## Page disposition

| Page | Action |
|---|---|
| `/` | KEEP. One mouse-reactive title (Task 4). Experimental title-with-model composition extracted to `/og` (Task 3). |
| `/about` | SLIM + WIP. Cut the centered-hero slop skeleton down to a basic honest stub that reads as work-in-progress (Task 1). Stays in nav. |
| `/contact` | SLIM + WIP. Keep the 6767 palindrome joke + email, flag as WIP, drop the dead centered-hero framing (Task 1). Stays in nav. |
| `/animals` | PARK into `/og` as a `parked` sketch (Task 2). Rebuild later, likely with the future anime/animal art. |
| `/experience`, all `/wc/*`, `/fmhy`, `/upload*`, `/api/*` | KEEP untouched. |
| `/og/*` existing (`doubt`, `calhoun`, `interactive`, `chat`) | KEEP, now soft-hidden (Task 5). |

---

## Task 1 — Slim `/about` and `/contact` into honest WIP stubs

**Files:** `src/app/about/page.tsx`, `src/app/contact/page.tsx`.

Steps:
1. `/about`: replace the banned centered-hero skeleton with a short, basic, first-person stub in the site voice that openly says it is a work in progress and will grow. Keep it small on purpose. A small in-world "WIP" marker is good (reuse `<DraftBanner />` or a lighter inline marker). One real specific line beats three neutral ones. No em-dashes.
2. `/contact`: keep `info@mythcorp.com`, `(676) 767-7676`, `Chicago, IL`, and the palindrome love-letter aside (that joke is the human bit). Reframe so it reads as an intentional parked page, not an empty stub. Flag WIP the same way as `/about`.
3. Both keep `<SiteHeader />` and the `bg-[color:var(--bg)] text-[color:var(--fg)]` wrapper. Tokens only. Break the centered symmetry per DESIGN.md where it is cheap to do so.

Check: neither page reads as the centered slop skeleton; both are honestly flagged WIP; 6767 joke intact; all three themes verified; no hex codes.

---

## Task 2 — Park `/animals` into `/og` with a `parked` status

**Files:** `src/app/og/page.tsx`, `src/app/animals/` -> `src/app/og/animals/`, `src/app/components/SiteHeader.tsx`, `src/app/sitemap.ts`, `MAP.md`.

Steps:
1. In `src/app/og/page.tsx`, extend `Sketch.status` from `'sketch' | 'graduated'` to `'sketch' | 'graduated' | 'parked'`. Give `parked` its own badge styling (tokens only, transforms across all three themes). `parked` = "was live, pulled back to rebuild."
2. Move `src/app/animals/page.tsx` to `src/app/og/animals/page.tsx`. Fix the `SiteHeader` import depth. Mount `<DraftBanner />`.
3. Add a `SKETCHES` entry, `status: 'parked'`, honest blurb (what it was, why parked, that the rebuild swaps the GIPHY embeds for licensed cute anime / animal art). Note: the moved page still has emoji-in-headings, which DESIGN.md bans; that is acceptable while it sits parked in `/og`, and gets fixed on rebuild. Do not spend time polishing it now.
4. In `SiteHeader.tsx`, remove `/animals` from `MENU_LINKS`. Leave `/about` and `/contact` in nav (they stay live). See Task 5 for whether `/og` stays in the menu.
5. In `src/app/sitemap.ts`, drop `/animals`, add `/og/animals` only if `/og` is being indexed (it is not; see Task 5, so just drop `/animals`).
6. Grep for links to `/animals` and repoint to `/og/animals`.
7. Update `MAP.md` routes table.

Check: `npm run check` green; grep finds no stale `/animals` links; `parked` badge transforms across all three themes; `/og` index shows the new card.

---

## Task 3 — Extract the experimental title-with-model composition into `/og`

**Files:** the experimental title component(s), `src/app/og/page.tsx`.

Steps:
1. Locate the wavy-title-with-3D-model-on-the-side experiment (the half-built landing variant). If it is entangled in the live landing, lift it into `src/app/og/hero-lab/page.tsx` with `<SiteHeader />` + `<DraftBanner />`.
2. Add an `/og` `SKETCHES` entry, `status: 'sketch'`, blurb describing it as a hero composition still being worked out.
3. Ensure the live landing no longer imports the extracted experiment (feeds Task 4).

Check: the experiment renders on its own `/og` page; the landing does not import it; `npm run check` green.

---

## Task 4 — One mouse-reactive title on the landing

**Files:** `src/app/components/NewLandingPage.tsx`, `src/app/components/landing/HeroTitle.tsx`.

Steps:
1. The landing keeps a single title as its signature. Give it a restrained pointer-parallax: the title and its glow shift a few pixels toward the cursor on `pointermove`, easing with `--motion-ease` / `--motion-fast` / `--motion-base`. This is the "title that moves with the mouse" the owner wants kept.
2. Gate behind `prefers-reduced-motion` so it disables cleanly (no parallax when reduced-motion is set).
3. Remove the mirrored `EST. 2024` twin-hairline block (lines ~54-60 of `NewLandingPage.tsx`). If you want a detail there, use ONE off-center readout, not two mirrored halves.
4. Keep the alignment-grid egg (⌘/ctrl + G) and `replay the boot sequence` working.

Check: title follows the cursor on desktop; fully static under reduced-motion; no jank on a mid-tier GPU; all three themes verified; landing no longer mirror-symmetric.

---

## Task 5 — Soft-hide `/og` (noindex, one subtle door, no gate)

**Files:** new `src/app/og/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/components/SiteHeader.tsx`.

The goal (state it in a comment): keep `/og` reachable by URL so the workshop stays visible, but keep rough drafts out of search and out of the primary path so they do not shape a first impression. This is a first-impression control, not a security control; nothing in `/og` is sensitive, so no auth. (Contrast: `/upload/admin` IS gated because it manages keys. Gate by sensitivity, not by unfinished-ness.)

Steps:
1. Add `src/app/og/layout.tsx` (server component) exporting `metadata` with `robots: { index: false, follow: false }`, so every `/og/*` page is noindexed. Keep it minimal, pass children through.
2. In `src/app/robots.ts`, add `disallow: ['/og']` (alongside the existing allow) so crawlers skip the back room. Do not disallow anything else.
3. In `src/app/sitemap.ts`, ensure no `/og/*` paths are listed.
4. In `SiteHeader.tsx`, decide the one door: either keep the single `/og` "Sketches" menu entry (acceptable, it is one unobtrusive link) or move discovery to a subtler in-world entry point. Do NOT surface individual `/og` pages in nav. One door total.

Check: viewing source on an `/og` page shows the noindex robots meta; `robots.txt` disallows `/og`; sitemap has no `/og` paths; `/og` still loads fine by URL; exactly one path to reach it.

---

## Task 6 — Voice consistency on what stays public

**Files:** `src/app/not-found.tsx`, `src/app/error.tsx`, `src/app/components/ComingSoon.tsx`.

Apply the voice guide in `CODEX_HUMAN_PASS.md`. The 404 and error boundary matter most; make them sound like one warm human wrote them. Keep reset/return affordances working. No em-dashes, no snark.

Check: no generic "Something went wrong" strings; consistent voice.

---

## Definition of done

- `/about` and `/contact` are slim, honest, WIP-flagged, still in nav, 6767 joke intact.
- `/animals` lives at `/og/animals` as a `parked` sketch with `<DraftBanner />`; nav / sitemap / `MAP.md` updated; grep finds no stale links.
- The experimental title-with-model composition lives on its own `/og` page; the live landing keeps a single mouse-reactive title, reduced-motion safe, no mirrored divider.
- `/og` is noindexed and disallowed in robots, reachable by exactly one door, not gated.
- `npm run check` green. `STATUS.md` notes what shipped, the parked-page rebuild intent, and the future anime/animal image direction.

## Guardrails (unchanged, do not violate)

- No new fonts, hues, hardcoded colors, or inline global keyframes (scope keyframes or put them in `globals.css`).
- No em-dashes. No glassmorphism outside luxury, no glow outside cyberpunk/luxury.
- Every touched component transforms across all three themes.
- No testimonials/pricing/logo-wall/feature-triplet sections.
- Files under ~250 lines; split into a feature folder if any climbs past.
- When the future image pass happens: real/licensed/attributed art only, no stock-slop, keep it scoped to the workshop.

## Suggested commit messages

```
copy: slim /about and /contact into honest WIP stubs, keep the 6767 joke
feat(og): add parked status, move /animals into the back room
refactor(og): extract the title-with-model hero experiment to a sketch page
feat(landing): keep a single mouse-reactive title, drop the mirrored divider
feat(og): noindex + robots-disallow the back room, one discovery door
copy: unify 404 / error / ComingSoon voice
```
