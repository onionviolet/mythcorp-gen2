# Next session — start here

You (the next agent, possibly on a phone via `claude.ai/code`) are picking this up from a previous instance. The previous instance ran long; this file is the cold-start handoff.

## In one sentence

A Next.js 15 personal site for Will (Weibao) Chen — themed cinematic landing, 3D experience scene, a `/wc` workshop with annotated walkthroughs and an interactive paper, plus an `/og` workshop floor for sketches. The next chunk of work is queued as 22 GitHub Issues you can claim.

## Read in this order, stop when you have what you need

1. **`STATUS.md`** (60 sec) — what shipped most recently and what's next.
2. **`MAP.md`** (60 sec) — the file index. Where every route and component lives.
3. **`CLAUDE.md`** (60 sec) — conventions. Most importantly: **no em-dashes anywhere** (saved to project memory under `~/.claude/projects/<this>/memory/feedback_no_emdashes.md`).
4. **`BACKLOG.md`** (skim) — 22 Issues with full bodies. Same content lives at https://github.com/onionviolet/mythcorp-gen2/issues now.
5. **This file** — for the inspiration + design ethos that the other docs don't capture.

That's <5 minutes to be fully oriented.

## What this site is trying to be

A small, hand-crafted personal site built like an art project, not a résumé. Three competing identities were unified:

- **Cyberpunk MYTHCORP** (the original look) is the boot sequence and one of three swappable themes.
- **Aspirational luxury** ("DISCOVER YOUR POTENTIAL", Chicago skyline) is what the boot reveals on the home page.
- **Whimsical-warm** is the underlying tone everywhere else: friendly microcopy, a floating `?` help dot, easter eggs that point you somewhere useful instead of sassing you.

The theme switcher (top right of every page) flips colors AND design language. Three themes:

| Theme | Surface style | Borders | Shadow | Buttons | Vibe |
|---|---|---|---|---|---|
| `cyberpunk` | matte | 1px neon | inset glow | sharp, fast | terminal |
| `luxury` | glass-morphism | gradient hairline | soft drop + glow | gradient pill | golden hour |
| `paper` | flat warm | hard 1px | hard offset (3px 3px 0) | hard rect | stamped on a desk |

## Inspiration (steal these patterns, do not copy verbatim)

### The "interactive paper" north star

The reason `/wc/papers/ai-cybercrime` exists in the form it does. Each is a different point on the spectrum.

- **AI 2027 (ai-2027.com)** — closest tonal match. Scrollytelling AI-future scenarios with sticky charts, projection bands, restraint about speculation. Their approach to "evidence vs. extrapolation" is exactly what the paper's reviewer flagged needed in the original PDF, and what `<CapabilityRamp />` already attempts. Steal: muted-color "projected" stages, anchored citations, reluctance to overclaim.
- **bartosz.ciechanow.ski** — the gold standard for technical writing. Internal combustion, GPS, mechanical watch, light, gears. Pure CSS + custom JS, no React, every figure is a hand-rolled WebGL or canvas widget you can poke. Steal: every claim gets a widget. Headings are short. Figures are inline with the text, not floating.
- **Distill.pub** — archived but canonical for interactive ML. Steal: the "Aside" pattern (sidenotes that don't break flow), the way figures are captioned with their own thesis sentence.
- **Bret Victor's "Up and Down the Ladder of Abstraction"** (worrydream.com) — the OG. A figure where every parameter is draggable, and the prose updates as you drag. Steal: "the number that just changed in the chart is the same number you see in this sentence."
- **Nicky Case (ncase.me)** — "Crowds", "Evolution of Trust". Game-like explanations that make you build the intuition by playing. Steal: the visual style is friendly, almost children's-book, even when explaining game theory. Whimsical-warm at scale.
- **Stripe Press (press.stripe.com)** — typography envy. Less interactive but a high bar for craft. Steal: typography hierarchy (Cinzel for display, Geist for body, Geist Mono for code) is already aligned with this.
- **Quanta Magazine** — beautifully illustrated science journalism. Steal: diagrams are the centerpiece, prose explains the diagram, not the other way around.
- **Pudding.cool** — visual data journalism. Steal: pacing — long scrollers with clear acts, not a wall of text.

### The "personal site as art" north star

- **late.nz (Cabel Sasser)** — long-form personal posts treated like museum pieces. Polished without being precious.
- **Linear's marketing site** — premium feel without losing personality. The transition between sections is the thing.
- **Maciej Cegłowski's Idle Words** — small, confident, opinionated. Personal sites can have a voice.

## What's already shipped (don't redo this)

Run `git log --oneline main..HEAD` to see the full series. Highlights in chronological order:

1. **Site refresh sweep** — theme system Tier 1 (CSS vars + bootstrap script, no `next-themes` dep), cinematic boot flow (LoadingScreen → LandingPage → NewLandingPage), shared `<SiteHeader>`, `<ComingSoon>`, `<Modal>`, `<HelpDot>`, whimsical 404, `/wc` personal section scaffold, first walkthrough at `/wc/learn/theme-system`.
2. **Em-dash purge + QoL** — bulk removal of em-dashes (project memory rule), real hamburger dropdown, session-based loading-screen skip, theme-curtain transition (no flashbang).
3. **`/will` → `/wc` rename + real `/fmhy`** — initials handle, FMHY backup with curated category grid + iframe attempt with graceful fallback, redesigned `/experience` MainMenu, /og polish.
4. **Theme Tier 2** — full design-language swap. New tokens (`--surface-style`, `--radius`, `--surface-shadow`, `--motion-ease`, `--button-bg`) + utility classes (`.themed-surface`, `.themed-button`, `.themed-pill`, `.themed-heading`). Migrated Modal, ComingSoon, /wc, /og, /fmhy, MainMenu.
5. **`/wc/papers/ai-cybercrime`** — first interactive paper. Two figures (`<BarrierToEntry />` toggle, `<CapabilityRamp />` year scrubber). Honest reviewer-feedback section that names the B+ critique and explains how the web version answers each point.
6. **Konami code** (↑↑↓↓←→←→ b a) cycles theme + confetti. Camera FOV unified at 55° between landing and experience scenes.
7. **22 GitHub Issues + auto-post script** — every queued improvement is now an Issue (#13-#34 on https://github.com/onionviolet/mythcorp-gen2/issues), labeled, with full bodies. Re-run `./tools/post-backlog-to-issues.ps1` is safe (skips dupes).

## Where to start, by mood

- **"I have 30 minutes"** → Issue #1 (theme-aware Simulation panel) or #2 (build /wc/about page).
- **"I want to write something"** → Issue #3 or #4 (walkthroughs) or #14 (more paper sections).
- **"I want to make something pretty"** → Issue #5 (more paper figures) or #13 (GSAP route transition).
- **"I want to ship something useful"** → Issue #6 (build-time FMHY fetch) or #7 (MDX wiring).
- **"I want to make it work on my phone"** → Issue #9 (mobile QA), then #10 (3D mobile fallback).
- **"I want to mess with infra"** → Issue #20 (custom domain) or #21 (Cloudflare branch previews).

## Hard rules

1. **No em-dashes** anywhere — code, copy, comments, commits, markdown. The project memory at `~/.claude/projects/<this>/memory/feedback_no_emdashes.md` enforces this for future agents.
2. **`<SiteHeader>`, never hand-roll** a page header.
3. **Theme tokens, never hard-coded colors** — `bg-[color:var(--bg)]`, `text-[color:var(--fg)]`, etc. The walkthrough at `/wc/learn/theme-system` explains why.
4. **No inline tutorial comments** in source. A single `// Walkthrough: /wc/learn/<slug>` pointer is the only allowed teaching comment.
5. **Files ≤ ~250 lines.** Split when climbing past.
6. **Greppable component names** (`EnterBanner`, `LandingModals`, not `Container`).
7. **Don't push to main without explicit user OK** — Cloudflare may have Git integration enabled (auto-deploy on push to main). Open a PR instead: `gh pr create --base main`.

## Cross-machine workflow

- `git pull origin claude/vigilant-golick-c8ff8d` to grab the current branch.
- `npm install` if `node_modules` isn't there.
- `npm run dev` for local. `npm run check` is build + tsc, must stay green.
- `npm run preview` simulates the Cloudflare Workers build locally without deploying.
- From `claude.ai/code` on a phone: open the repo, point at the `claude/vigilant-golick-c8ff8d` branch, and read `STATUS.md` then this file.

## Cloud / mobile pickup

If you're an agent with no local checkout (just `claude.ai/code`, the GitHub
UI, and a Codespace), this works:

1. Open the repo at https://github.com/onionviolet/mythcorp-gen2 and switch the
   branch picker to `claude/vigilant-golick-c8ff8d`. Every doc and script is
   at the repo root.
2. Either start a Codespace (preinstalls Node + gh) or use `claude.ai/code`'s
   built-in environment.
3. `npm ci && npm run check` to confirm the build is green from your end.
4. To refresh the FMHY snapshot: `npm run fetch:fmhy && git add -p src/app/fmhy/_data && git commit -m "chore: refresh fmhy snapshot"`. Or trigger the
   `refresh-fmhy` GitHub Action manually from the Actions tab.
5. To bulk-post BACKLOG entries as new GitHub Issues: `npm run post:backlog`
   (cross-platform Node script; `gh auth login` once).
6. Push to `claude/vigilant-golick-c8ff8d` (or a sub-branch off it). Open a
   PR against `main` via `gh pr create --base main`. The PR template walks
   through the rules.

The `check` GitHub Actions workflow runs `npm run check` on every push and PR,
so you'll see green / red in the GitHub UI without having to build locally.

## Decisions you might be tempted to re-litigate (don't)

- **No `next-themes`** — the theme system is intentionally four files of plain CSS + React. See `/wc/learn/theme-system`.
- **No MDX yet** — TSX paper pages are fine for figure-heavy work. Adding `@next/mdx` is Issue #7, deferred to validate the Cloudflare Workers compat path first.
- **STARS_PER_UNIT = 1200, MAX_STARS = 12000** in `Simulation.tsx` — original `5000 * settings.stars` could hit 25k particles and tank mid-tier GPUs.
- **Single Canvas at a time** in `AppLoader` — mounting two simultaneously crashed under React StrictMode.
- **`HelpDot` and `KonamiEgg` live in `layout.tsx`**, not per page.

## When you're done with your chunk

- Update `STATUS.md` with what you shipped + what's next.
- Update `MAP.md` if structure shifted.
- Commit, push to the branch (NOT main without OK).
- Optionally close the GitHub Issue you just resolved.
- If you noticed something out-of-scope worth doing later, append to `BACKLOG.md` and re-run `./tools/post-backlog-to-issues.ps1` (it'll only post the new ones).
