# Next 16 upgrade plan, 2026-10-29

Scope only. Nothing here has been installed, built or deployed. The plan is based on branch `claude/redteam-fixes-7b8e06` at 92ebb02 (Next 15.5.28, React 19.2.8, `@opennextjs/cloudflare` 1.20.6, wrangler 4.129.0).

Target: **Next 16.4.3** (`latest` on npm today), `eslint-config-next` 16.4.3, `@opennextjs/cloudflare` 1.20.14, wrangler 4.156.0.

## Executed 2026-10-29 (branch `claude/next16-upgrade-plan`, not pushed or deployed)

- `cd6e187` Step 1. On Next 15.5.28, `npm run cf:build` passed with no override flag, which confirms the O1 claim below.
- `be67567` Steps 2 and 3 as planned: next 16.4.3, React 19.3.1, fiber 9.8.2, drei 10.7.9, postprocessing 3.2.2. The build runs on Turbopack, with no `--webpack` fallback. The first build also changed `tsconfig.json` `jsx` from `preserve` to `react-jsx`, which C12 did not predict.
- `21d49df`, `1eda4ee`, `1ed600d` fix all 69 react-hooks v7 errors, so `84171b2` returns the four rules to their default errors. L2 was done after all, split across three parallel agents. Most hits are targeted disables with reasons. The real fixes:
  - module-level generators for the random 3D data, with the same draw frequency
  - `useSyncExternalStore` for WebGL and reduced-motion probes
  - SiteHeader closes the menu during render instead of in an effect
  - KonamiEgg confetti no longer re-randomizes mid-burst
- `58e4731` fixes a problem the plan missed. React 19.3 rendered the literal `<link rel="preload">` tags in `layout.tsx` twice, which failed `holding-details` "locked homepage loads its own assets". The layout now calls `preload()` from `react-dom`.
- Verification:
  - `npm run check` passes.
  - `npm run cf:build` passes. Its only warning is the expected middleware deprecation, with no Node-middleware warning.
  - The e2e suite passes 46 of 46 on the production build, run with `PLAYWRIGHT_CHANNEL=chrome` because the bundled Chromium is not installed here.
  - An earlier full run had 7 multi-minute timeouts. A rerun of the same two specs passed 25 of 25 after the preload fix. A 92ebb02 baseline of those specs also passed 25 of 25.
  - `npm audit --omit=dev` is down from 13 to 6. What remains is `fflate`, `glob` and `source-map-js`, all non-major `npm audit fix` items.
- Not done: the V4 manual pass on `npm run preview`, the post-2026-11-03 security re-pin, and the deploy, which needs Weibao's yes.

## Read this first: deploys can be unblocked without Next 16

`npm run deploy` fails because `@opennextjs/aws` 4.1.4 (pulled in by cloudflare 1.20.6) applies a flat two-year cutoff: Next 15 was released 2024-10-21, so it is refused from 2026-10-21.

`@opennextjs/aws` 4.1.12 replaced that check. The new rule in `dist/build/helper.js` is `if (!NEXT_RELEASE_DATES[major + 2]) return true`, so a major stays supported until the second next major (Next 17) exists. The OpenNext Cloudflare CHANGELOG for 1.20.13 says the same thing in words.

- **Minimum package: `@opennextjs/cloudflare` 1.20.13**, which pins aws 4.1.12. 1.20.12 is not enough; it pins aws 4.1.11, which still has the old check.
- 1.20.14 pins aws 4.1.13, has peer `next: ">=15.5.28 <16 || >=16.4.1"` and peer `wrangler: "^4.148.0"`. Next 15.5.28 satisfies it.
- The brief quoted the peer range as `>=15.5.24 <16 || >=16.3.3`. That is stale. 1.20.7 raised it to 15.5.26 / 16.3.6, 1.20.8 to 15.5.27 / 16.3.8, and 1.20.12 to 15.5.28 / 16.4.1.

Verification state: **read from published package source, not from a build.** The gate is `npm run cf:build` passing on 15.5.28 with no `--dangerouslyUseUnsupportedNextVersion` flag.

So the choice is between two paths:

| | O1: OpenNext bump only | O2: Next 16 (this plan) |
|---|---|---|
| Changes | 2 packages, no source | ~6 files plus packages |
| Unblocks deploy | Yes, until Next 17 ships | Yes |
| Clears `next`/`postcss` audit item | No | Yes |
| Effort | Under 1 hour | 4 to 6 hours (lint route L1) |
| Risk | Low | Medium: Turbopack builds, React 19.3 under R3F |

Step 1 below is O1. It is the first step of O2 anyway, because the Next 16 peer floor is `>=16.4.1` and needs the same OpenNext version. **It can ship as its own PR.**

## Timing

Next has a scheduled security release on **2026-11-03** covering seven medium vulnerabilities ([announcement](https://nextjs.org/blog/upcoming-nextjs-security-release-november-2026)). Whichever path is chosen, the version should be bumped to the patched release (16.4.x or a 15.5.x backport) once it is out. OpenNext has raised its peer floor after each security release (see the 1.20.8 and 1.20.12 entries above), so expect a matching cloudflare 1.20.15 or later. Step 1 can land now. If O2 is chosen, starting it after 2026-11-03 avoids doing the bump twice.

## Required changes

Codes: `C` = change, `R` = risk, `V` = verification.

### Step 1 (O1): OpenNext and wrangler, on Next 15.5.28

- **C1** `package.json`: `@opennextjs/cloudflare` `1.20.6` to `1.20.14` (exact pin, as now). `wrangler` `^4.129.0` to `^4.156.0`, which satisfies the new `^4.148.0` peer.
- **C2** `package-lock.json`: regenerate with `npm install`. Leave `wrangler.jsonc` alone. `compatibility_date` `2025-04-01` is not required to change; bumping it alters Workers runtime behavior and should be a separate decision.
- Gate: `npm run check`, then `npm run cf:build` with no override flag and no "not supported" error, then `npm run preview` and a request to `/`.

### Step 2: Next 16 packages

- **C3** `package.json`: `next` and `eslint-config-next` to `16.4.3` (or the 2026-11-03 patch).
- **C4** `package.json`: `@react-three/fiber` `^9.7.0` to `^9.8.2`. This is required, not optional. Next 16.4.3 runs the App Router on its vendored React (`next/dist/compiled/react` reports `19.3.0-canary-278794d7-20261002`). The locked fiber 9.7.0 declares peer `react >=19 <19.3`, and fiber's reconciler is tied to React internals. Fiber 9.8.0 and later declare `<19.4`.
- **C5** `package.json`: `react`, `react-dom` `19.2.8` to `19.3.1`, and `@types/react` / `@types/react-dom` to the matching latest. Recommended so the installed React matches what the App Router runs. Next's peer is `^19.0.0`; drei 10.7.9 (`^19`), postprocessing 3.2.2 (`^19.0.0`, fiber `>=9.7.0`) and fiber 9.8.2 (`<19.4`) all accept 19.3.1. Rejected alternative: stay on 19.2.8. It works for the App Router, but `tsx --test` and types would then exercise a different React than production.
- **C6** Optional in the same PR: drei `^10.7.9`, postprocessing `^3.2.2`. Peer-compatible minors. Leave `three` at 0.185.1.
- Unchanged and already compliant: Node 22 (CI and local, minimum 20.9), TypeScript 5.8.3 (minimum 5.1), ESLint 9.27.0 (`eslint-config-next` 16 needs `>=9`).

**Do not run `npx @next/codemod upgrade latest`.** It renames `middleware.ts` to `proxy.ts` (see C9). Do the bumps by hand, or run only the individual codemods needed.

### Step 3: scripts and config

- **C7** `package.json` scripts `build` and `prod`: remove `--no-lint`. `next build` in 16.4.3 no longer has that option (its commander definition has no `--no-lint` and no `allowUnknownOption`), so the flag is a hard error. This breaks more than it looks: OpenNext runs `npm run build` (`buildNextApp.js` defaults to `${packager} run build`), so `cf:build`, `deploy`, `preview`, CI's `npm run check`, and Playwright's `start` server all fail until it is removed. `next build` no longer lints, so nothing replaces it. `npm run lint` already calls the ESLint CLI directly and needs no change.
- **C8** `next.config.ts`: delete the `eslint: { ignoreDuringBuilds: true }` block. Next 16 removed the option, and `NextConfig` no longer types it, so `tsc` fails while it is there. Keep the `initOpenNextCloudflareForDev()` block as is; it already gates on `NODE_ENV`, which is what the guide recommends now that `process.argv` no longer contains `dev`.
- **C9** `src/middleware.ts`: **keep the file name, the `middleware` export and the edge runtime unchanged.** Next 16 deprecates `middleware` in favor of `proxy`, but `proxy` runs only on Node.js and cannot be configured. The upgrade guide says: "If you want to continue using the `edge` runtime, keep using `middleware`." The OpenNext Cloudflare docs say Node middleware is not supported, and the 1.20.14 build code warns that "Node.js middleware support is experimental in cloudflare, and not officially maintained by OpenNext maintainers." `src/securityHeaders.test.ts` and `src/siteLock.test.ts` also import `middleware` from `./middleware`. Expect a deprecation warning at build time; accept it. A future proxy move waits until OpenNext supports Node middleware on workerd.
- **C10** `eslint.config.mjs`: replace the `FlatCompat` setup. `eslint-config-next` 16 ships native flat configs at `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`, and the legacy `extends("next/core-web-vitals")` path is gone. New shape:
  ```js
  import nextVitals from "eslint-config-next/core-web-vitals";
  import nextTs from "eslint-config-next/typescript";
  export default [...nextVitals, ...nextTs, /* rule overrides, see C11 */];
  ```
  `@eslint/eslintrc` can then leave `devDependencies` (removing a dependency needs Weibao's yes per CLAUDE.md; ask in the PR).
- **C11** Lint rule decision, the largest effort item. See the next section.
- **C12** Expect the first `next build` / `next dev` to rewrite `next-env.d.ts` and add `.next/dev/types/**/*.ts` to `tsconfig.json` `include` (dev now outputs to `.next/dev`). Commit those generated edits; they are expected, not drift.

### Lint: the new react-hooks rules

`eslint-config-next` 16 spreads `eslint-plugin-react-hooks` v7's `recommended` rules, which add React Compiler checks as errors. I ran `eslint-config-next@16.4.3` with ESLint 9.27.0 from a scratch install against this repo's lint targets (repo untouched). The current v15 config lints clean. The v16 config reports **69 errors in 35 files**, all from four rules:

| Rule | Errors | Where it concentrates |
|---|---|---|
| `react-hooks/set-state-in-effect` | 27 | one per file across `plain/*`, pages, contexts |
| `react-hooks/purity` | 18 | `LoadingScreen.tsx` 6, `Simulation.tsx` 5, `BehavioralSink.tsx` 4, `KonamiEgg.tsx` 2 |
| `react-hooks/refs` | 13 | `DisturbedText.tsx` 7, `HorizonExtrapolator.tsx` 6 |
| `react-hooks/immutability` | 11 | `og/specimen-story/SpecimenStage.tsx` 7 |

- **L1 (recommended):** in C10, set those four rules to `"warn"`. Add one line under STATUS "Decisions worth remembering" saying they are warnings until fixed, and add a BACKLOG item to fix them file by file. Reason: the `purity` hits sit in 3D render code (`Math.random` during render in `Simulation.tsx` and `BehavioralSink.tsx`; `performance.now` in `HoldClickResponse.tsx`). Fixing them changes when random values are drawn, which can change what the scene looks like. An upgrade PR should not change behavior.
- **L2 (rejected for this PR):** fix all 69 in the upgrade PR. Adds roughly 4 to 8 hours and mixes visual risk into a dependency change.

### npm audit (`--omit=dev`)

Current: 13 advisories (1 critical, 9 high, 3 moderate). Attribution from `npm ls`:

| Advisory | Parent | Cleared by |
|---|---|---|
| `postcss` <=8.5.22 (high), `next` (moderate, via postcss) | `next` 15.5.x bundles postcss 8.4.31 | **Next 16 only.** 16.4.3 bundles postcss 8.5.23. Next 15.5.28 still pins 8.4.31. |
| `source-map-js` 1.2.1 | `next/node_modules/postcss` | Next 16 (same subtree) |
| `wrangler`, `miniflare`, `undici`, `sharp` (miniflare's) | wrangler 4.129.0 | Step 1 (wrangler `^4.156.0`) |
| `proxy-addr` (critical), `body-parser`, `qs` | `@opennextjs/aws` 4.1.4 via express 5.2.1 | Step 1 likely (new aws version); else `npm audit fix` |
| `brace-expansion`, `picomatch` | `@opennextjs/aws` / cloudflare deps (`glob`, `@node-minify`, `@dotenvx`) | Step 1 likely; else `npm audit fix` |
| `fflate` | drei via `three-stdlib`, `@types/three` | `npm audit fix` (non-major) |

So Next 16 is required only for the `postcss` pair. Everything else is Step 1 or a non-major `npm audit fix`. Rerun `npm audit --omit=dev` after each step and record the remaining count in the PR.

### Already compliant (no work)

- Async request APIs: every dynamic route already awaits `params` (`src/app/a/[id]/page.tsx`, `d/[token]/page.tsx`, `i/[key]/page.tsx`, `api/img/[key]/route.ts`). No `cookies()`, `headers()` or `draftMode()` calls in `src/`. `generateMetadata` in `/a/[id]` already awaits.
- No `next/image`, parallel routes, `opengraph-image`/`icon` generators, `generateSitemaps`, AMP, `serverRuntimeConfig`, `revalidateTag`, `unstable_` imports or custom `webpack` config. `src/app/sitemap.ts` takes no `id`.
- `export const dynamic` segment configs stay valid without `cacheComponents`. Do not enable `cacheComponents` or `reactCompiler` as part of this upgrade.
- `next/dynamic` with inline `{ ssr: false }` literals (canvas UI manifest, SignalScene, MiniStarField) works under Turbopack.
- `scroll-behavior`: no global smooth scrolling in `src/`, so the changed override default does not apply.

## Risks

- **R1 Turbopack becomes the production bundler.** `next build` now uses Turbopack by default. OpenNext Cloudflare 1.20.14 detects the bundler (`getBundlerRuntime` in `bundle-server.js`) and lists Turbopack as supported, but this repo has never built with it. Watch the R3F/drei/GLTF/Draco paths and the Tailwind v4 PostCSS step. Fallback: `next build --webpack` in the `build` script, recorded in STATUS decisions.
- **R2 React 19.3 under R3F.** C4 and C5 address the declared peer ranges. Runtime proof is the `/experience` and 3D-object pages actually rendering under Playwright's software WebGL and in a real browser.
- **R3 Middleware deprecation.** Edge middleware still works in 16.x but is deprecated with no removal version announced. Pin `next` exactly (already the convention) so a minor cannot surprise the site.
- **R4 New default prefetch behavior** (more, smaller prefetch requests). Low risk; worth a glance in the Network panel on `/` since the site lock redirects non-allowed paths.
- **R5 OpenNext floor moves again** after 2026-11-03. Cheap, but it means Step 1 may need a second patch bump.

## Effort

| Step | Estimate |
|---|---|
| Step 1 (O1) incl. cf:build and preview | 0.5 to 1 h |
| Step 2 and 3 edits (C3 to C12) with L1 | 1 to 2 h |
| Turbopack and R3F troubleshooting buffer | 0 to 2 h |
| Verification (below) | 1 to 1.5 h |
| **O2 total** | **about 3 to 6 h** (add 4 to 8 h for L2) |

## Verification route

Run in order; each is its own state (source edit, test slice, built, previewed, human-accepted, deployed).

- **V1** `npm run check` (lint, text policy, 11 unit tests, build, tsc). With L1 it should pass with warnings only.
- **V2** `npm run cf:build`. Check three things in the output: no "not supported" refusal; **no** "Node.js middleware support is experimental" warning (proves C9 kept edge middleware); and `.next/server/middleware-manifest.json` lists the middleware with the `matcher` from `src/middleware.ts`.
- **V3** e2e smoke against the production build: `npm run build`, then `PLAYWRIGHT_SERVER=start npm run test:smoke` (the four specs in `tests/e2e/`).
- **V4** `npm run preview` (wrangler local Workers runtime), then a manual pass:
  - `/`: daily scene loads, theme switcher works, response carries the `SECURITY_HEADERS` set.
  - `/experience` and `?mode=calhoun`: R3F scene renders, postprocessing works, no console errors from the reconciler.
  - `/wc/papers/ai-cybercrime`: Scrolly, RevealOnView and HorizonExtrapolator behave (all three files carry new lint warnings).
  - `/a/<id>` and `/d/<token>` for a known upload: page renders through the site lock; `i.mythcorp.org/<key>` rewrite serves bytes (send a `Host: i.mythcorp.org` request against preview).
  - A locked path returns the 307 to `/`; a missing route renders the 404.
- **V5** `npm audit --omit=dev`: confirm the `postcss` pair is gone and record what remains.
- **V6** Deploy: Weibao's yes required. After deploy, repeat the V4 header and `/a/<id>` checks on mythcorp.org.

## Sources

- Next 16 upgrade guide: https://nextjs.org/docs/app/guides/upgrading/version-16 (lastUpdated 2026-10-15)
- `proxy.js` reference, runtime and version history: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
- Next 16.4 release notes (React 19.3, Turbopack output changes): https://nextjs.org/blog/next-16-4
- November security release notice: https://nextjs.org/blog/upcoming-nextjs-security-release-november-2026
- OpenNext Cloudflare overview (supported versions, Node middleware unsupported): https://opennext.js.org/cloudflare
- OpenNext Cloudflare CHANGELOG 1.20.7 to 1.20.14: https://github.com/opennextjs/opennextjs-cloudflare/blob/main/packages/cloudflare/CHANGELOG.md
- Package source read via `npm pack`: `@opennextjs/aws` 4.1.4, 4.1.11, 4.1.12, 4.1.13 (`dist/build/helper.js`, `buildNextApp.js`); `@opennextjs/cloudflare` 1.20.14 (`dist/cli/build/build.js`, `bundle-node-middleware.js`, `bundle-server.js`); `next` 16.4.3 (`dist/bin/next`, `dist/compiled/react`); `eslint-config-next` 16.4.3 (`package.json` exports, `dist/index.js`).
- npm registry metadata (versions, peers, release times) queried 2026-10-29.
