# MYTHCORP

A small, hand-crafted personal site by Will (Weibao) Chen. Themed cinematic
landing, a 3D experience scene, a `/wc` workshop with annotated walkthroughs and
an interactive paper, plus an `/og` workshop floor for sketches and a `/fmhy`
local mirror.

## Agents start here

If you are picking this up in a new session, read these in order:

1. [STATUS.md](./STATUS.md), what shipped most recently.
2. [MAP.md](./MAP.md), the file index.
3. [CLAUDE.md](./CLAUDE.md), working conventions.
4. [DESIGN.md](./DESIGN.md), visual direction for UI work.
5. [BACKLOG.md](./BACKLOG.md), the small, triaged local queue.

That's under five minutes to be fully oriented.

### Hard rules

- **No em-dashes.** Code, copy, comments, commits, markdown. Use commas, periods,
  semicolons, parentheses, or restructure. Project memory enforces this.
- **Push to a branch, not main.** Cloudflare may auto-deploy on push to main.
  Open a PR with `gh pr create --base main`.
- **`npm run check` must stay green** before any commit.

## Stack

Next.js 15 (app router), React 19, TypeScript, Tailwind v4. 3D via
`@react-three/fiber` / drei / postprocessing. Animation via GSAP. Deployed to
Cloudflare Workers via `@opennextjs/cloudflare`.

## Dev

```bash
npm install
npx playwright install chromium # one-time browser install for smoke tests
npm run dev          # local dev server
npm run check        # lint + text policy + build + tsc, must stay green
npm run test:smoke   # focused Chromium route and behavior checks
npm run preview      # Cloudflare Workers simulated build
npm run deploy       # cloudflare workers deploy
npm run fetch:fmhy   # refresh the FMHY catalog snapshot
```

The repo includes an FMHY backup-sites directory at `/fmhy`. Its data is a
build-time snapshot of [github.com/fmhy/edit](https://github.com/fmhy/edit),
refreshed by running `npm run fetch:fmhy` and committing the diff.

## CI

No CI workflow is currently tracked. Run `npm run check` locally before every
commit. Restoring a PR build guard remains queued work.

## License

This repo is the source of [mythcorp.org](https://mythcorp.org) and is intentionally
public so the build can be picked up from any device. Code is unlicensed for reuse;
content (essays, paper text, designs) is the author's.
