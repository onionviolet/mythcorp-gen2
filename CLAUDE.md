# CLAUDE.md, conventions for agents working on this repo

Read **`MAP.md`** first for the file index. This file explains *how* to make changes once you know where to make them. For visual taste (what the site should feel like, what it never does), read **`DESIGN.md`** before any UI work.

## Stack quick-facts

- Next.js 15 app router, React 19, TypeScript, Tailwind v4 (PostCSS).
- 3D: `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`.
- Animation: `gsap`.
- Deployed to Cloudflare Workers via `@opennextjs/cloudflare`.
- `npm run dev` for local. `npm run check` is lint + text policy + build + tsc, and must stay green before commit.

## Style

- **No inline tutorial comments.** A single `// Walkthrough: /wc/learn/<slug>` pointer at the top of an interesting file is the only allowed teaching comment. Real explanations live on `/wc/learn/*` pages where they can include the live demo.
- **Split by responsibility, not line count.** Extract a feature when that gives it a clearer owner, isolates state, or makes the code easier to test and navigate. A cohesive long file is acceptable.
- **Co-locate.** A feature lives in one folder. Sibling helpers and types stay next to the component.
- **Greppable names.** Avoid generic `Container`, `Wrapper`, `Card`. Prefer `EnterBanner`, `LandingModals`, `WalkthroughSection`. Reduces grep noise; one search returns the consumer, not a dozen barrels.
- **No barrel re-exports across the codebase.** Optional inside a single feature folder, never repo-wide.

## Theme tokens (mandatory for any new visual code)

Hard-coded colours block theme switches. Always reach for variables:

```tsx
// ✗ Don't
<div className="bg-cyan-900 text-white border border-white/20">

// ✓ Do
<div className="bg-[color:var(--bg-elevated)] text-[color:var(--fg)]
                border border-[color:var(--border)]">
```

Available tokens: `--bg`, `--bg-elevated`, `--bg-overlay`, `--fg`, `--fg-muted`, `--fg-subtle`, `--accent`, `--accent-soft`, `--accent-warm`, `--accent-glow`, `--accent-glow-strong`, `--border`, `--border-strong`, `--font-display`, `--font-body`, `--font-mono`, plus `--skyline-tint-a` / `--skyline-tint-b` / `--skyline-blur` for landing backdrops.

Walkthrough: `/wc/learn/theme-system`.

## Adding a page

1. New route under `src/app/<route>/page.tsx` (or `src/app/wc/<route>/page.tsx` for personal stuff).
2. Wrap in `<div className="min-h-screen bg-[color:var(--bg)] text-[color:var(--fg)]">`.
3. Mount `<SiteHeader />` from `src/app/components/SiteHeader.tsx`, never hand-roll a header.
4. If the page is a stub, use `<ComingSoon>` instead.
5. Add it to **MAP.md**'s routes table.

## Adding a walkthrough

1. Create `src/app/wc/learn/<slug>/page.tsx`.
2. Use `Walkthrough`, `Section`, `Code`, `Aside` from `src/app/wc/learn/_components/Walkthrough.tsx`.
3. Add the slug + status to `WALKTHROUGHS` in `src/app/wc/learn/page.tsx`.
4. Drop a `// Walkthrough: /wc/learn/<slug>` pointer at the top of the source file the walkthrough explains.

## Working with the 3D scene

- Anything heavy (GLTF, custom fonts, big textures) → call `useGLTF.preload(...)` at module top, plus a `<link rel="preload" ...>` in `layout.tsx` head if it's session-critical.
- The Simulation uses a `STARS_PER_UNIT * settings.stars` count clamped at `MAX_STARS = 12000`. Don't remove the clamp, it's the only thing keeping mid-tier GPUs at 60fps when randomized.
- Match Canvas background to the page background with `<color attach="background" args={[...]} />` to kill flash-of-black during route changes.

## Cross-session continuity

- **`MAP.md`**, repo navigation. Update when structure shifts.
- **`CLAUDE.md`**, this file. Conventions and recipes.
- **`STATUS.md`**, what was last shipped, what's next. Update at the end of every session.

If you add a new tool, dependency, or architectural pattern that isn't obvious, write a short "decision" in `STATUS.md` so the next session doesn't re-litigate it.

## Things that need explicit user confirmation

- Deleting routes, files, or dependencies.
- `git push`, force-push, or anything that mutates remote state.
- Changes to `wrangler.jsonc`, deployment config, or `next.config.ts` that affect production.

## Things to avoid

- Inline `<style>` blocks defining new global keyframes, keep keyframes scoped or in `globals.css`.
- Adding state machines for pages with two states (use `useState<'a' | 'b'>` directly).
- Long snarky microcopy. Whimsical and warm > snarky.
- New fonts. We have three (Geist, Geist Mono, Cinzel) and `Inter_Bold.json` for 3D, that's enough.

## Quick verification before commit

```
npm run check
```

Must be green. If you can, also `npm run dev` and visit `/`, `/experience`, `/wc`, `/wc/learn/theme-system`, and trigger a 404, confirm theme switcher works on each.
