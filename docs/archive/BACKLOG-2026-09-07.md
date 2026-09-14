# BACKLOG

Pre-formatted issues for the next session (mobile or desktop, you or a fresh agent). Each item is independent. Pick any.

To post all of these to GitHub Issues at once, run:

```powershell
gh auth login         # one time, opens a browser
./tools/post-backlog-to-issues.ps1
```

That script reads every `## #N, ...` heading in this file and creates one Issue per heading on `onionviolet/mythcorp-gen2`, applying the labels in the `**Labels:**` line.

---

## #2, /wc/about page (currently 404)

**Labels:** `content`, `next-up`

**Body:**

`/wc` has a card linking to `/wc/about` but the route doesn't exist. Either:
1. Build a real `/wc/about` page with a short bio + project history timeline.
2. Or remove the card from `src/app/wc/page.tsx`'s `sections` array.

Recommendation: build the page. Pattern after `/wc/papers` shape (eyebrow + heading + sections). Content: Will Chen (Weibao Chen), undergrad working on AI safety / cybersecurity adjacent stuff, why this site exists (sandbox + showcase), what's coming next.

---

## #3, Walkthrough: `/wc/learn/landing-flow`

**Labels:** `walkthrough`, `next-up`

**Body:**

Second annotated walkthrough at `src/app/wc/learn/landing-flow/page.tsx`. Subject: how the cinematic boot works.

Cover:
- `LoadingScreen` (cyberpunk binary digit shape) at `src/app/components/LoadingScreen.tsx`.
- `LandingPage` (3D MYTHCORP logo + spectre model) at `src/app/components/LandingPage.tsx`.
- `NewLandingPage` (luxury Chicago skyline reveal) at `src/app/components/NewLandingPage.tsx`.
- The handoff: `useGLTF.preload('/spectre.glb')` at module top, plus mutually-exclusive Canvas mounting in `AppLoader` (only one `<Canvas>` alive at a time, otherwise R3F crashes under StrictMode).
- The session-storage skip: boot only runs on first visit per session.

Use the `Walkthrough`/`Section`/`Code`/`Aside` helpers from `src/app/wc/learn/_components/Walkthrough.tsx`. Add `landing-flow` to `WALKTHROUGHS` in `src/app/wc/learn/page.tsx` and flip its `status` from `soon` to `ready`.

---

## #4, Walkthrough: `/wc/learn/3d-scene`

**Labels:** `walkthrough`, `next-up`

**Body:**

Third walkthrough at `src/app/wc/learn/3d-scene/page.tsx`. Subject: anatomy of `src/app/experience/Simulation.tsx`.

Cover:
- `<Canvas>` + R3F basics
- `ParticleField`: `BufferGeometry` + `Float32Array` for vertex positions and colors
- `Stars` count clamped at `MAX_STARS = 12000` with `STARS_PER_UNIT = 1200` (and *why*: original `5000 * settings.stars` could hit 25k particles)
- `Bloom` post-processing tuning (`luminanceThreshold`, `mipmapBlur`)
- The randomisable `DEFAULTS` settings object and `getRandomSettings()`

---

## #5, More figures for `/wc/papers/ai-cybercrime`

**Labels:** `paper`, `feature`

**Body:**

Two figures shipped (`<BarrierToEntry />`, `<CapabilityRamp />`). The paper has 4-6 more passages that map cleanly to interactive widgets:

- **Expert Debate quadrant**: 2x2 grid (LeCun / Altman / Whittaker / Hinton) with offensive vs defensive impact bars per quadrant. From Tables 6 and 7. Click to focus a quadrant and see argument detail.
- **Attack chain step-through**: a Stuxnet or Hong Kong CFO heist case study as a horizontal step diagram, with each step labeled "still requires human" / "AI does this now" / "AI will do this".
- **Governance trilemma triangle**: open-source vs regulation vs antitrust as a triangle with a draggable point that shows which threat surface each policy blend leaves open.
- **Stage-1-to-4 capability ladder**: vertical infographic of the technical hurdles (planning, error handling, memory, self-improvement, vulnerability discovery, cross-domain synthesis) as a ladder with current/projected positions marked.

Each new figure goes in `src/app/wc/papers/ai-cybercrime/_components/` and gets a `<Section>` in the main page. Keep the projection-vs-evidence visual distinction the reviewer asked for.

---

## #7, Wire MDX for `/wc/papers`

**Labels:** `paper`, `infra`

**Body:**

The first paper (`/wc/papers/ai-cybercrime`) is a TSX page right now. That's fine for figure-heavy pages with custom React widgets, but adding MDX support would make future papers easier to author (write `.mdx`, embed React components inline).

Steps:
- `npm install @next/mdx @mdx-js/react remark-gfm rehype-pretty-code shiki`
- Update `next.config.ts` with `pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx']` and the `withMDX` wrapper.
- Create `src/app/wc/papers/mdx-components.tsx` exporting `<Figure>`, `<Aside>`, `<Sandbox>` so embedded React/3D demos are easy.
- Verify it builds on Cloudflare Workers (`npm run preview`) before merging. Past us has been bitten by Node-only MDX plugins on the edge runtime.

---

## #8, Migrate `/animals` and remaining `/og/*` to themed surfaces

**Labels:** `polish`, `housekeeping`

**Body:**

Theme Tier 2 utilities (`themed-surface`, `themed-button`, `themed-pill`) now exist but `/animals`, `/og/chat`, and `/og/interactive` haven't been migrated. They still use hand-rolled `border border-[color:var(--border)] bg-[color:var(--bg-elevated)]` patterns.

Replace those with the utility classes so all themes get their proper design language (paper gets the hard-offset shadow, luxury gets glass blur, etc.).

---

## #9, Mobile QA pass

**Labels:** `polish`, `accessibility`

**Body:**

The site has been built with `sm:` breakpoints from day one, but never actually verified on a real phone. Open the deployed branch on iOS Safari and Chrome Android and check:

- Boot flow doesn't break (LoadingScreen + LandingPage 3D)
- Hamburger menu opens cleanly with one finger
- Theme switcher reachable
- `/wc/papers/ai-cybercrime` figures (BarrierToEntry, CapabilityRamp) work with touch
- Hero "DISCOVER YOUR POTENTIAL" doesn't wrap weirdly
- /experience MainMenu CTA is thumb-reachable
- /fmhy iframe behaves on mobile (likely doesn't render at all)

Document issues in a follow-up comment, fix in a follow-up PR.

---

## #10, 3D experience mobile fallback

**Labels:** `feature`, `performance`

**Body:**

`/experience` and `/` both render heavy R3F scenes that target desktop GPUs. On a low-end Android, the fan spins up immediately. Add a check (UA sniff or `navigator.hardwareConcurrency < 4`) and either:

1. Render a static screenshot of the scene with a "your device might not love this; tap to render anyway" overlay, or
2. Drop particle counts and disable `<Bloom>` postprocessing on mobile.

The MainMenu tease bar (`~12k particles`) becomes a knob, not just decoration.

---

## #11, Accessibility pass

**Labels:** `accessibility`, `polish`

**Body:**

`prefers-reduced-motion` is already honored for the theme transition curtain. Extend to:
- LoadingScreen 3D animation (skip the binary digit fly-in if reduce)
- LandingPage 3D logo (static pose if reduce)
- HelpDot panel entrance
- Konami egg confetti
- AnimatedHeading shadows
- Banner pulse glow

Also: keyboard navigation through the SiteHeader menu, focus rings everywhere, ARIA labels on the BarrierToEntry toggle and CapabilityRamp slider, alt text for the skyline image.

---

## #12, Subset `Inter_Bold.json`

**Labels:** `polish`, `performance`

**Body:**

`public/fonts/Inter_Bold.json` is 5.2MB but `<Text3D>` only renders the word "MYTHCORP" (8 unique characters). Use `facetype.js` to subset:

```bash
npx facetype.js Inter-Bold.ttf --chars MYTHCORP > public/fonts/Inter_Bold.json
```

Should drop ~5MB off the initial boot. Only `src/app/components/LandingPage.tsx` uses it.

---

## #13, Camera FOV polish: GSAP transition between routes

**Labels:** `polish`, `3d`

**Body:**

LandingPage and Simulation now both use `fov={55}` so there's no zoom snap, but the route change is still a hard cut. A GSAP-tween across the transition (fade out + slight zoom in + fade in new scene) would feel more cinematic.

Probably best wrapped in a `<RouteTransition>` HOC that uses Next.js's `useRouter` events.

---

## #14, Pioneer Scholars paper continuation

**Labels:** `paper`, `content`

**Body:**

`/wc/papers/ai-cybercrime` shipped sections 1, 2, "why this matters", "reviewer feedback", "where this goes next". The original paper has more chapters worth converting:

- **Pre-AI baseline** (Section 3): Table 1 details + nation-state resource framing
- **Present threat landscape** (Section 5): malware case studies (GoldFactory trojan, etc.) as small inline diagrams
- **Future horizon 2025-2030** (Section 6): per-stage hard requirements as a checklist visualization
- **Expert debate** (Section 7): tied to BACKLOG #5 expert-quadrant figure
- **Countermeasures** (Section 8): governance trilemma figure (also #5)
- **Conclusion**: short call-to-action paragraph

Each lands as a new `<Section>` in `src/app/wc/papers/ai-cybercrime/page.tsx`. Tighten the prose vs the original PDF.

---

## #15, Time-of-day auto theme

**Labels:** `feature`, `nice-to-have`

**Body:**

Add an "auto" theme option that picks based on local time:
- 06:00-11:00: `paper` (morning reading)
- 11:00-19:00: `luxury` (afternoon warmth)
- 19:00-06:00: `cyberpunk` (night)

Stored as `mythcorp-theme=auto` in localStorage. The ThemeSwitcher gets a fourth option "auto" with a sun/moon glyph that flips based on time.

---

## #16, View Transitions API for route changes

**Labels:** `feature`, `nice-to-have`

**Body:**

Next.js 15 has experimental View Transitions support. Enable it for cross-fade between routes (e.g. `/` to `/wc` or `/wc/papers/ai-cybercrime`). Combined with `view-transition-name` on the SiteHeader logo, the logo would morph instead of re-rendering.

Reference: https://nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition

---

## #17, RSS / Atom feed for `/wc/papers`

**Labels:** `feature`, `nice-to-have`

**Body:**

Add `/wc/papers/feed.xml` (or `.atom`) so people can subscribe. Static generation: read the `PAPERS` array, emit the feed at build time. Once MDX is wired (BACKLOG #7), each paper has a date + title + summary that maps cleanly to feed entries.

---

## #18, Real WebSocket chat (promote `/og/chat`)

**Labels:** `feature`, `nice-to-have`

**Body:**

`/og/chat` is a local-only chat sandbox. Wire a Cloudflare Durable Object (or Workers KV) backend so messages persist + sync across users. Then promote out of `/og`:

1. Move `src/app/og/chat` to `src/app/chat`.
2. Drop `<DraftBanner />` and the local-only label.
3. Update MAP.md routes table.
4. Remove from `SKETCHES` in `src/app/og/page.tsx`.

---

## #19, Visitor guestbook on `/wc/about`

**Labels:** `feature`, `nice-to-have`

**Body:**

After #2 (build the about page), add a tiny KV-backed comment/guestbook box at the bottom. Cloudflare Workers KV is free at small scale. Moderation: simple word filter + manual review.

---

## #20, Custom domain

**Labels:** `infra`, `nice-to-have`

**Body:**

**DONE, and it was done before anyone noticed (verified 2026-07-25).** The custom domain is **mythcorp.org**, live on Cloudflare and serving this worker. Every route, the upload API, and the WIP markers were confirmed against it. The confusion was that this repo said mythcorp**.dev** in README, MAP, and this item, and that domain is NXDOMAIN, so a pass in July "fixed" the sitemap and robots host to the workers.dev origin instead. Both now point at mythcorp.org.

Still open, split out of this item:

- `www.mythcorp.org` does not resolve. Anyone typing the www form gets nothing. One CNAME.
- The workers.dev origin still answers, so the same site is reachable on two hostnames. `robots.txt` now names mythcorp.org as `Host`, which is the cheap fix; setting `workers_dev: false` in `wrangler.jsonc` is the real one, at the cost of losing the fallback URL for testing.
- Bonus, unchanged: `wc.mythcorp.org` as an alias to `/wc/*`.

---

## #21, Cloudflare branch preview deploys

**Labels:** `infra`

**Body:**

Right now Cloudflare deploys only when `npm run deploy` is run manually. Configure Cloudflare Workers preview branch deploys so each PR gets its own URL. This makes mobile QA (BACKLOG #9) trivial: open the preview URL on a phone.

---

## #22, Cool-stuff sticky-note (low priority, future)

**Labels:** `nice-to-have`

**Body:**

Speculative ideas worth keeping around:

- **Reading log**: a `/wc/reads` page listing books / papers the author has been through, with a one-line take on each.
- **Page-level search** with Pagefind (works on static export, no backend).
- **Now-page** (à la sive.rs/now): what the author is currently working on, updated monthly.
- **3D scene presets** picker on /experience MainMenu (default / aurora / minimal / chaos).
- **Boot screen variety**: more loading shapes (helix, tunnel, particle storm) + per-theme variants (paper boot uses ink particles instead of cyan binary).
- **Spotify or Last.fm "now playing"** widget if the author has either.
- **GitHub contributions chart** auto-pulled to /wc/about.

---

## #23, Chomik: Digital Pet Hamster (standalone project or site feature)

**Labels:** `feature`, `fun`, `new-project`

**Body:**

A digital hamster (guinea pig? hamster? both?) that lives on the page and eats UI elements. Inspired by Desktop Goose, Shimeji, and the classic "neko" cat cursor chaser.

**Core concept:**
- A small animated sprite (pixel art or SVG) that roams around the viewport
- "Eats" UI elements it collides with: buttons, icons, nav items shrink/crumble/get chomped
- Gets fatter/happier as it eats more
- Poops little pellets after eating
- Falls asleep if idle, wakes up when the user interacts
- Has a small hunger meter; if not fed (no clicks/interaction) it starts nibbling on its own

**Scope options:**
1. **Site-wide overlay on mythcorp** -- toggled from a button in the footer or via easter egg (type "chomik"). Lives as a `<PetOverlay />` component that floats above all content with `pointer-events: none` except on the pet itself.
2. **Standalone GitHub repo** (`wchen17/chomik`) -- a tiny JS library anyone can drop onto a page. `<script src="chomik.js"></script>` and it just works. Has its own GitHub Pages demo site.
3. **Both** -- build standalone first, then embed it on mythcorp as a dependency.

**Technical approach (standalone):**
- Single `<canvas>` overlay, fixed position, full viewport
- Sprite sheet animation (walk, eat, sleep, poop, idle)
- Simple physics: gravity, ground = bottom of viewport, can climb on DOM elements
- DOM collision detection via `document.elementsFromPoint()` to find "edible" elements
- When eating: shrinks the target element with a CSS transition, plays chomp animation
- State machine: idle -> walking -> found-food -> eating -> satisfied -> walking -> sleepy -> sleeping
- Configurable: speed, appetite, which selectors are "edible", sprite theme

**For the GitHub Pages demo:**
- Landing page showing Chomik in action on a fake UI
- "Add to your site" instructions
- Configuration playground

---

## #24, Fake Terminal Overlay (press `/` anywhere)

**Labels:** `feature`, `easter-egg`

**Body:**

Press `/` anywhere on the site to open a translucent terminal overlay. It looks real but is purely cosmetic/fun -- no actual shell access.

**Behavior:**
- Slides down from top (or fades in) as a full-width panel, ~60% viewport height
- Monospace font, green-on-black or theme-appropriate (paper theme gets sepia terminal)
- Shows a fake prompt: `visitor@mythcorp ~ $`
- User can type anything. Responses are canned/funny:
  - `ls` -> lists the site routes
  - `cd /experience` -> actually navigates there
  - `whoami` -> "a curious visitor"
  - `sudo rm -rf /` -> "nice try. chomik has been alerted."
  - `help` -> lists available fake commands
  - `cat README` -> shows a short blurb about the site
  - `exit` or `Esc` -> closes the overlay
  - Anything else -> "command not found: <input>. try 'help'"
- History with up/down arrow keys
- Closes on `Esc` or clicking outside

**Implementation:**
- `src/app/components/TerminalOverlay.tsx` -- client component
- Mounted in the root layout, listens for `/` keydown (but not when an input is focused)
- Uses `useRouter()` for commands that navigate
- Store open/closed state in a context or simple useState in layout
- Theme-aware: cyberpunk gets green phosphor glow, luxury gets amber, paper gets typewriter feel

---

## #25, Fix /animals GIF content (quick)

**Labels:** `bug`, `content`

**Body:**

The Giphy URLs on `/animals` all return HTTP 200 but the GIF IDs were never verified to match their titles. "Happy Guinea Pig Munching Lettuce" probably shows something random. Fix:

1. Go to giphy.com, search for real guinea pig / hamster / bunny eating GIFs
2. Replace the 5 URLs with verified, correct ones
3. Or better: self-host 5-8 short `.webm` clips in `public/animals/` for reliability (no Giphy dependency, no hotlink breakage)
4. Consider adding more variety (10-15 clips) and a "favorites" localStorage feature

---

## #26, Comprehensive Simulator Upgrades

**Labels:** `feature`, `3d`

**Body:**

The `/experience` 3D scene is polished but could go deeper. Ideas for a "v2" pass:

**Scene presets:**
- Named presets on MainMenu: "Aurora" (greens/purples, slow drift), "Minimal" (white, few stars, no bloom), "Chaos" (max particles, fast rotation, strobing), "Deep Space" (dark blue, dense stars, no model)
- Save/load custom presets to localStorage
- Share presets via URL params (`/experience?preset=aurora`)

**New elements:**
- Audio-reactive mode: connects to mic or plays a built-in ambient track, particles pulse to frequency
- Environment options: nebula backdrop, grid floor, fog
- More models: allow switching between spectre.glb and 2-3 other models (geometric shapes, user's own upload via drag-and-drop)
- Particle behaviors: flocking, orbiting, exploding on click, trailing the cursor in 3D

**Controls polish:**
- Keyboard shortcuts (R = randomize, Space = pause rotation, 1-4 = presets)
- Screenshot button (exports canvas to PNG)
- Fullscreen toggle
- FPS counter (toggleable)

**Performance:**
- Auto-detect GPU tier and default to appropriate preset
- Progressive enhancement: start minimal, add bloom/particles as frame budget allows

---

## #27, GitHub Profile Page (wchen17.github.io)

**Labels:** `new-project`, `nice-to-have`

**Body:**

A personal GitHub Pages site at `wchen17.github.io` that serves as a landing/portfolio page. Could be:

1. **Minimal redirect** -- just points to mythcorp.org with a cool loading animation
2. **Standalone portfolio** -- separate from mythcorp, more professional/resume-oriented
3. **Project showcase** -- cards linking to repos (mythcorp, chomik, papers, etc.) with live previews

**If standalone:**
- Static HTML/CSS or a tiny Astro/Vite build
- Dark theme, terminal-inspired aesthetic
- Sections: intro, projects (with screenshots/demos), papers, contact
- GitHub contribution graph pulled via API
- Links to mythcorp.org for the full experience

**Repo:** `wchen17/wchen17.github.io` (or `wchen17/wchen17` for the profile README that shows on your GitHub profile page)

---

## #28, Site-wide Command Palette (Cmd+K / Ctrl+K)

**Labels:** `feature`, `nice-to-have`

**Body:**

In addition to (or instead of) the `/` terminal, a modern command palette like VS Code / Linear / Raycast:

- `Cmd+K` or `Ctrl+K` opens a search modal
- Fuzzy-matches all routes, actions, and theme options
- Items: "Go to /fmhy", "Go to /experience", "Switch to cyberpunk theme", "Open terminal", "Randomize simulation"
- Recent items shown by default
- Keyboard navigable (arrow keys + Enter)

Lighter than the terminal overlay, more "productivity tool" than "easter egg."

---

## #29, Per-route OG images via next/og on Workers

**Labels:** `feature`, `infra`, `seo`

**Body:**

No route has a real OpenGraph card. Sharing `/wc/papers/ai-cybercrime` on Slack/Twitter gets a blank rectangle. Add `src/app/<route>/opengraph-image.tsx` (Next 15 file convention) using `ImageResponse` from `next/og`. Verify it builds on Cloudflare Workers (some `@vercel/og` paths need `edge` runtime; the OpenNext shim should handle it but confirm).

Priorities:
1. `/` and `/wc` (site-level cards)
2. `/wc/papers/[slug]` (per-paper, pulls title + eyebrow)
3. `/fmhy/[category]` (per-category, pulls count + name)
4. `/wc/learn/[slug]` (per-walkthrough)

Use Cinzel for headings if it loads on the edge; otherwise fall back to system serif. Test with the Open Graph debugger.

---

## #30, sitemap.xml and robots.txt

**Labels:** `seo`, `infra`

**Body:**

Neither file exists. The FMHY mirror in particular is invisible to search because nothing tells Google the 22 category routes exist. Add:

- `src/app/sitemap.ts` enumerating all static routes plus the 22 FMHY categories, plus `/wc/papers/*` and `/wc/learn/*` entries.
- `src/app/robots.ts` allowing all, pointing to the sitemap.

Both are first-class Next 15 app-router conventions, no extra deps.

---

## #31, Cloudflare Web Analytics

**Labels:** `infra`, `nice-to-have`

**Body:**

The site has zero analytics. Cloudflare Web Analytics is free, cookieless, GDPR-friendly, and ships as a single beacon script. Add the snippet via `<Script strategy="afterInteractive">` in `layout.tsx`. Gate it behind `process.env.NODE_ENV === 'production'` so dev doesn't pollute numbers.

Goal: find out which `/og/*` sketches and walkthroughs actually get traffic, so polish effort can follow attention.

---

## #32, Themed error.tsx + global error boundary

**Labels:** `feature`, `polish`, `reliability`

**Body:**

R3F can crash on mid-tier GPUs (shader compile, out-of-memory, lost context). Right now that bubbles to Next's default white error screen, breaking immersion. Add:

- `src/app/error.tsx` with `<SiteHeader />`, theme tokens, a warm message, and a "reload" button.
- `src/app/global-error.tsx` for the layout-level fallback.
- Optional: a "tell me what broke" mailto/link that prefills the error stack.

Pattern after `not-found.tsx` for tone.

---

## #33, Security headers via _headers

**Labels:** `infra`, `security`

**Body:**

Workers currently serves no CSP, no HSTS, no `X-Content-Type-Options`. Add a `public/_headers` file (Cloudflare Pages/Workers reads it) with:

- `Content-Security-Policy` permissive enough for R3F (`'unsafe-eval'` for some drei paths, sigh), inline styles allowed for Tailwind JIT.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` denying camera/mic/geolocation.

Validate with securityheaders.com after deploy.

---

## #34, Cite-this buttons on papers

**Labels:** `paper`, `feature`

**Body:**

`/wc/papers/ai-cybercrime` has no citation export. Add a small `<CiteBox />` component at the bottom of each paper with copy buttons for BibTeX, APA, and a plain URL. Store the citation metadata next to the paper entry in `PAPERS` (author, year, title, venue if any).

Component lives at `src/app/wc/papers/_components/CiteBox.tsx` so future papers reuse it.

---

## #35, Playwright smoke test for theme bootstrap

**Labels:** `infra`, `testing`

**Body:**

The pre-paint theme bootstrap script in `layout.tsx` is load-bearing: if it breaks, the site flashes the wrong theme on every navigation. It currently has zero tests.

Add a minimal Playwright setup with one test that:
1. Sets `localStorage.mythcorp-theme = 'paper'` before page load.
2. Loads `/`.
3. Asserts `document.documentElement.dataset.theme === 'paper'` before any JS-hydrated component renders.
4. Asserts background color matches the paper token at first paint (no cyberpunk flash).

Repeat for `luxury` and `cyberpunk`. Run in CI via `npm run check:e2e`. Don't over-build the harness, one file in `tests/theme-bootstrap.spec.ts` is enough.

---

## #36, /wc/now page

**Labels:** `content`, `nice-to-have`

**Body:**

A sive.rs-style now-page: what is the author actively working on this month? Three or four bullets, dated. Updated monthly (or when it stops being true). Lives at `src/app/wc/now/page.tsx`.

Cheaper to build than `/wc/about` (#2) because there's no bio to write, just current state. Link from `/wc` index card.

Bonus: a `<NowBadge />` on `/wc` that shows the date stamp from the now-page, so visitors can see how stale it is.

---

## #37, Reading-time + last-updated stamps

**Labels:** `polish`, `content`

**Body:**

Papers and walkthroughs have no "X min read" or "updated YYYY-MM-DD" indicator. Both are tiny trust signals. Add:

- A `meta` field on each paper/walkthrough entry: `{ updated: '2026-05-06', readingMinutes: 12 }`.
- A small `<ArticleMeta />` component rendered under the heading.
- For reading time, just count words in the rendered content at build time (or hand-estimate, it's a handful of pages).

When MDX lands (#7), this becomes automatic via remark plugins.

---

## #38, Print stylesheet for papers

**Labels:** `polish`, `paper`

**Body:**

`/wc/papers/ai-cybercrime` is dense and people will want to PDF it. Right now `window.print()` gives a dark cyberpunk-themed mess. Add a `@media print` block in `globals.css` that:

- Forces white background, black text, no glow shadows.
- Hides `<SiteHeader />`, `<HelpDot />`, footer.
- Page-breaks before each `<Section>` heading.
- Strips bloom/glow from `themed-heading`.
- Shows full URLs after links: `a[href]::after { content: " (" attr(href) ")"; }`.

One block, scoped to `/wc/papers/*` via a body class added in that route's layout.

---

## #39, Interactive code blocks via Sandpack

**Status: DEFERRED BY DECISION (batch 7, 2026-07-21).** `/wc/learn` went the other way: hand-built playground primitives (DemoPanel, TokenPlayground, MiniStarField, FlowStepper) that drive the real components instead of a bundled sandbox. A demo wired to the actual component can't drift from it, weighs almost nothing, and needs no edge bundler. See STATUS "custom playgrounds over Sandpack." Not closed, since a true edit-arbitrary-code sandbox is still a distinct capability; but it is parked on purpose, not merely un-started.

**Labels:** `walkthrough`, `feature`, `teaching`

**Body:**

The `<Code>` helper in walkthroughs is static. The big differentiator for `/wc/learn` would be editable code that runs live. Wire CodeSandbox's Sandpack (`@codesandbox/sandpack-react`) so any `<Code interactive>` block becomes an editor + preview pane.

Use cases:
- Theme-system walkthrough: edit token values, see the surface react.
- 3D-scene walkthrough (#4): tweak `STARS_PER_UNIT`, see the particle field rebuild.
- A future "intro to R3F" concept page: edit a small scene live.

Sandpack ships its own bundler, so it works on Cloudflare Workers. Lazy-load it so walkthroughs without interactive blocks don't pay the bundle cost.

---

## #40, /wc/learn/concepts track

**Labels:** `walkthrough`, `content`

**Body:**

Walkthroughs explain *this file in this repo*. Concepts explain *the idea* independent of the repo. Add a parallel track at `src/app/wc/learn/concepts/<slug>/page.tsx` for short (5-10 min) explainers:

- `r3f-mental-model`: scene graph vs imperative three.js
- `ssg-vs-edge`: when to render where, with mythcorp examples
- `theme-tokens-vs-css-vars`: why tokens beat utility colors at scale
- `useGLTF-preload-order`: the StrictMode footgun and how to avoid it

Render both tracks on `/wc/learn` with a tab or filter. Different shape (shorter, more abstract) but reuses the `Walkthrough`/`Section`/`Code`/`Aside` primitives.

---

## #41, Diff-driven walkthrough format

**Partial (batch 7, 2026-07-21).** The new `Code` `highlight?: number[]` prop covers the cheap 80%: before/after code shown in one block with the changed lines tinted (used for the reset-bug diff in the 3d-scene walkthrough). The full `<DiffSlider before after />` with a scrub-wipe and pinned `<DiffNote>` line commentary is still open; the line-tint gets most of the teaching value without the build.

**Labels:** `walkthrough`, `feature`

**Body:**

Some refactors are best taught as before/after. `NewLandingPage.tsx` going from a 333-line monolith to 5 files under `src/app/components/landing/` is the canonical example.

Build a `<DiffSlider before={...} after={...} />` helper in `_components/` that:
- Shows the before file in one pane, after in another.
- A slider on top scrubs between them with a wipe or crossfade.
- Optional `<DiffNote at={lineNumber}>...</DiffNote>` children pin commentary to specific lines.

First use: `/wc/learn/landing-refactor`. Pulls double-duty as portfolio (here is how I think about file splits).

---

## #42, Mini 3D demos embedded in walkthroughs

**Status: DONE (batch 7, 2026-07-21).** `MiniStarField` + `MiniStarFieldDemo` ship in `src/app/wc/learn/_components/`, embedded in the 3d-scene walkthrough via a `DemoPanel`. Self-contained R3F, `MINI_MAX_STARS = 3000`, no bloom, lazy-loaded with `dynamic(..., { ssr: false })` behind a height-matched skeleton, exactly the shape this item asked for. The other two sketches (`<MiniBloom />`, `<MiniStarsClamp />`) are still open if wanted, but the pattern is proven.

**Labels:** `walkthrough`, `3d`

**Body:**

`/wc/learn/3d-scene` (BACKLOG #4) would be all prose if built today. The teaching value triples if each Section has a tiny self-contained Canvas demonstrating one concept:

- `<MiniParticles />`: just the BufferGeometry + vertex colors, 500 points, no bloom.
- `<MiniBloom />`: one glowing cube, with a slider for `luminanceThreshold`.
- `<MiniStarsClamp />`: a count slider that visualizes what 1k vs 12k vs 25k particles does to FPS.

Each is a `<Canvas style={{ height: 240 }}>` inside a walkthrough Section. Lazy-load via `dynamic(..., { ssr: false })` so the walkthrough index page isn't dragging R3F.

---

## #43, Walkthrough prereq DAG on /wc/learn

**Labels:** `walkthrough`, `polish`

**Body:**

Add a `prereqs: string[]` field to each entry in the `WALKTHROUGHS` array. Render a small DAG (or just an indented list grouped by depth) on `/wc/learn` so readers know what to read first.

Bonus: a "next up" link at the bottom of each walkthrough that recommends a downstream node from the graph. Pairs with #40 concepts so the graph spans both tracks.

---

## #44, Show-the-bug walkthrough pattern

**Status: DONE (batch 7, 2026-07-21).** First instance shipped in the 3d-scene walkthrough: the "Show the bug: reset that shares an array" section walks the `setSettings(DEFAULTS)` aliasing (edit a Position slider, mutate the module-level defaults; reset twice, React bails out) and its clone-pattern fix, using the new `Code` `highlight` prop for the before/after diff. Bug was fixed in `Simulation.tsx` the same session, so the walkthrough teaches a real one this repo shipped. The heavier live-crash variant (a `<BugDemo />` that mounts a second Canvas and throws into an error boundary) is still open if a fuller version is wanted.

**Labels:** `walkthrough`, `content`

**Body:**

A walkthrough format that opens with the broken behavior live on the page, then walks through diagnosing and fixing it. Higher engagement than starting from the solution.

Canonical first instance: the R3F double-Canvas StrictMode crash that drove the AppLoader's mutually-exclusive mounting (mentioned in BACKLOG #3). Title: `/wc/learn/the-strictmode-canvas-crash`.

Pattern:
1. Section 1: a deliberately-broken `<BugDemo />` that, on a click, mounts a second Canvas and crashes inside an error boundary. Visitor sees the crash live.
2. Section 2: stack trace explained.
3. Section 3: the fix (mutually-exclusive mounting), with the working `<FixedDemo />`.

---

## #45, Pagefind static search across FMHY + papers

**Labels:** `feature`, `performance`, `fmhy`

**Body:**

Listed as a low-priority bullet in #22, promote to its own item. Pagefind builds a static search index after `next build`, ships as a self-contained `pagefind/` directory, and runs entirely in the browser. No backend, works on Cloudflare Workers' static asset serving.

Setup:
1. `npm install -D pagefind`
2. Add `pagefind --site .vercel/output/static --output-path .vercel/output/static/pagefind` (or wherever OpenNext puts the static assets) to the build step.
3. Import the Pagefind UI in a new `<SiteSearch />` component, mount it in `SiteHeader` behind the existing search affordance.
4. Mark FMHY entries and paper sections with `data-pagefind-body` so the index excludes nav chrome.

Biggest win for the FMHY mirror: currently you can filter by category, but cannot search across all 22 categories at once.

---

## #46, Shiki + twoslash for typed code blocks

**Partial (batch 7, 2026-07-21).** The `Code` upgrade added a `filename` label strip and `highlight` line tinting with zero deps, the cheap slice of this item's value. Full syntax highlighting and twoslash type-on-hover still want `shiki`/`@shikijs/twoslash` (do after MDX #7, per the note below).

**Labels:** `walkthrough`, `polish`

**Body:**

`/wc/learn` ships static text in `<Code>` blocks. For a site whose pitch is "codebase as learning artefact," code blocks should hover TypeScript types like the playground does.

Use `shiki` with the `twoslash` transformer (`@shikijs/twoslash`). Walkthrough code blocks tagged with the `ts twoslash` language get full type info inline: hover any identifier to see its inferred type, see compile errors on `@errors:` lines.

Compatible with the planned MDX wiring (#7), so do this after #7 lands. Until then, ship a non-twoslash `shiki` upgrade to get prettier syntax highlighting for free.

---

## #47, tldraw scratchpad sketch

**Labels:** `feature`, `og`, `nice-to-have`

**Body:**

Add `/og/scratchpad` with an embedded tldraw canvas. The whole point of `/og/` is "rough ideas kept on purpose," and a shared whiteboard is the literal embodiment.

Two modes:
1. **Local-only**: state in localStorage, each visitor has their own scratch.
2. **Multiplayer**: tldraw's sync server (or a Cloudflare Durable Object hosting the room). Anyone visiting the page joins the same canvas.

Start with local-only. If it's fun, promote to multiplayer behind a "join room" button.

---

## #48, Live visitor cursors on the landing page

**Labels:** `feature`, `nice-to-have`, `multiplayer`

**Body:**

A Cloudflare Durable Object hosting one "room" that tracks `{ id, x, y, color }` for each connected visitor. Renders other visitors' cursors as small floating glyphs on the landing page. Low traffic so basically free.

Reuse the DO connection for #18 (chat) and #47 (multiplayer tldraw) so the realtime layer is built once.

Toggle off in `prefers-reduced-motion` and on the experience page (cursors fighting Canvas events is bad).

---

## #49, react-three/rapier physics on the simulation

**Labels:** `3d`, `feature`

**Body:**

Drop in `@react-three/rapier` and enable physics for the spectre model and an optional "throw cube at it" mode in `/experience`. Unlocks the "explode on click" idea from #26.

Mode toggle on the MainMenu: "Physics: on/off". When on:
- Spectre model becomes a `<RigidBody>`.
- Clicking the canvas spawns a small cube with a velocity vector aimed at the spectre.
- Cubes despawn after 10s or 50-count, whichever first.

Rapier is WASM, so verify it loads under the OpenNext edge runtime before merging.

---

## #50, Partytown for third-party scripts

**Labels:** `performance`, `nice-to-have`

**Body:**

If/when #31 (analytics) lands, also bring in `@builder.io/partytown` so the analytics beacon runs off-main-thread. The R3F frame budget is tight on mid-tier GPUs, and any blocking third-party JS shows up as jank.

Only worth doing once there is actually a third-party script to host. Until then, parked.

---

## #51, Workers AI summarize-paper button

**Labels:** `feature`, `paper`, `infra`

**Body:**

Bind `@cf/meta/llama-3.1-8b-instruct` (or whatever the current cheap Workers AI model is) and add a "summarize" button to each paper page. Click sends the rendered paper text to a Worker route, streams back a 3-bullet summary.

Why: demonstrates the Cloudflare stack end-to-end without leaving it. Also a useful affordance for the cybercrime paper, which is long.

Cache responses keyed by paper slug + content hash so repeated clicks are free.

---

## #52, Zod schema for FMHY parsed data

**Labels:** `fmhy`, `infra`, `reliability`

**Body:**

`scripts/fetch-fmhy.ts` hand-rolls regex to parse upstream markdown. When upstream changes shape (which they have, several times), the script silently produces garbage JSON and the bad data ships to the per-category routes.

Add `zod` schemas for the parsed structure (`Category`, `Section`, `Entry`, `ResourceLink`) and `.parse()` the script's output before writing files. Schema failure becomes a hard build error pointing at the exact category that broke.

Bonus: derive the TypeScript types in `_data/categories.ts` from the zod schema instead of hand-maintaining a parallel type.

---

## #53, Footnote helper for walkthroughs

**Labels:** `walkthrough`, `polish`

**Body:**

Walkthroughs reference other parts of the codebase and external links inline. Adding a footnote helper (`<Note id="1">...</Note>` in text, `<Footnotes>...</Footnotes>` at the bottom) would tighten the prose and let dense paragraphs stay readable.

Implement as two small helpers in `src/app/wc/learn/_components/Walkthrough.tsx`. Footnotes render as a numbered list at the page bottom, refs become clickable superscripts that scroll-jump.

---

## #54, Reading log at /wc/reads

**Labels:** `content`, `nice-to-have`

**Body:**

Promoted from #22's sticky-note list. A `/wc/reads` page listing books and papers the author has been through, each with a one-line take. Group by year. Pattern after `/wc/papers` shape: a `READS` array, simple card list.

Worth doing because it doubles as portfolio (taste signal) and as a low-stakes content treadmill for keeping the site alive between bigger pieces.

---

## #67, Giphy attribution + per-GIF source link on /animals

**Labels:** `content`, `legal`, `polish`

**Body:**

Giphy's developer terms require attribution: a visible "Powered by GIPHY" mark plus a link back to each GIF's source page. `/animals` currently shows only a generic "GIFs courtesy of GIPHY" line with no per-clip link. Store each clip's `giphy.com/gifs/<id>` URL alongside its entry, render a "view on GIPHY" link per clip, and add the attribution mark. The cleanest long-term fix is #68 (self-host), which removes the requirement entirely.

---

## #68, Self-host /animals clips (kill the hotlink dependency)

**Labels:** `content`, `reliability`, `performance`

**Body:**

`/animals` hotlinks `media.giphy.com` GIFs. Giphy can rotate IDs, rate-limit hotlinks, or pull media, at which point the page silently degrades to the "clip wandered off" fallback. Promote #25's option 3: download 5-8 short, verified clips into `public/animals/` as `.webm` (plus an `.mp4` fallback) and serve them with `<video autoplay loop muted playsinline>`. Removes the external dependency, the attribution requirement (#67), and the third-party bandwidth reliance. Bonus: webm is far smaller than the equivalent gif.

---

## #69, One device-capability gate (reduced-motion + GPU tier)

**Labels:** `infra`, `performance`, `accessibility`

**Body:**

Several items independently need to answer the same question: "should we run the heavy / animated thing?" (#10 3D mobile fallback, #11 reduced-motion a11y, #56 fluid, #57 raymarch, #63 audio-reactive). Build one `useDeviceCapability()` hook returning `{ reduceMotion, gpuTier, lowPower }` from `prefers-reduced-motion`, `navigator.hardwareConcurrency`, and an optional saved override, so every heavy feature consults a single source of truth instead of re-sniffing the environment in five places.

---

## #70, CI: guard the build on every PR

**Labels:** `infra`, `testing`

**Body:**

`npm run check` is the green-gate before commit, but nothing enforces it on pull requests. Add a GitHub Actions workflow that runs `npm ci && npm run check` on `pull_request`. Also guard against a stray `bun.lock` reappearing (the repo standardized on npm; `bun.lock` was removed). One job, `ubuntu-latest`, node 20, npm cache. Pairs with #21 (Cloudflare preview deploys) and #35 (Playwright smoke test) to round out the testing story.

---

## #71, /animals favorites via localStorage

**Labels:** `content`, `nice-to-have`, `fun`

**Body:**

Promote #25's tail. Let a visitor heart a clip; hearted clips sort to the front of the gallery and persist in `localStorage` under `mythcorp-animals-faves`. Tiny, warm, and gives the page a reason to revisit. Builds directly on the existing gallery thumbnail row.

---

# IDEABOARD, wow-tier web experiences

Not tidy issues, north stars. The bar for this section: a visitor should look at it and wonder *how was this made*. Everything below is buildable on the stack already installed (`@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`, `gsap`), so these are ambitious but not fantasy. Pick one as a flagship, not all of them. References name real creators/sites worth studying; search them, do not assume exact URLs.

---

## #55, Drivable 3D portfolio (steer a car between routes)

**Labels:** `ideaboard`, `wow`, `3d`, `feature`

**Body:**

The Bruno Simon classic: land in a low-poly 3D world and *drive a little car* around it. Each building, billboard, or arch is a route (`/experience`, `/wc/papers`, `/fmhy`). Driving into one navigates. The "how is this a website" reaction is the whole point.

How, on this stack: R3F scene + `@react-three/rapier` (already scoped in #49) for the car's vehicle controller and ground collision. WASD / touch joystick input. Honk = easter egg. Reuse the Chicago theme: the world is a stylized mini-Chicago block. Lazy-load behind a "enter the world" button so the normal site still loads fast.

Reference: Bruno Simon's personal site, the Three.js Journey "physics" lessons. Scope: large. This is a flagship, plan it as its own multi-session arc.

---

## #56, WebGL fluid cursor backdrop

**Labels:** `ideaboard`, `wow`, `shaders`

**Body:**

A real-time fluid simulation (Navier-Stokes) running behind the landing hero. The cursor smears luminous dye through it; it never repeats. People genuinely cannot tell if it is video or live.

How: GLSL ping-pong framebuffers (advection, divergence, pressure-solve, curl). Pavel Dobryakov's open-source WebGL-Fluid-Simulation is the canonical reference implementation to learn from and adapt. Tint the dye with `--accent` / `--accent-glow` per theme. Gate behind `prefers-reduced-motion` and a GPU-tier check (ties to #10).

Scope: medium. One full-screen shader component, no new deps (raw WebGL or a `shaderMaterial` on a fullscreen R3F plane).

---

## #57, Raymarched shader hero (SDF, no geometry)

**Labels:** `ideaboard`, `wow`, `shaders`

**Body:**

A hero background that is *one fragment shader on one quad*, raymarching signed distance fields: soft shadows, ambient occlusion, a slowly morphing metaball forming the MYTHCORP "M". The wow is that there is no mesh, it is pure math per pixel.

How: a `shaderMaterial` (drei) on a fullscreen plane, time uniform driven by `useFrame`. Study Shadertoy and Inigo Quilez's SDF / raymarching articles (iquilezles.org). Keep the march step count modest and add a quality knob for mobile.

Scope: medium. High learning value, pairs perfectly with a `/wc/learn/concepts` entry (#40) explaining how it works.

---

## #58, GPGPU particle morph (wordmark to skyline to spectre)

**Labels:** `ideaboard`, `wow`, `3d`, `performance`

**Body:**

A million+ particles simulated entirely on the GPU that *morph* between shapes: the MYTHCORP wordmark, the Chicago skyline silhouette, and a point-cloud sampled from `spectre.glb`. GSAP scrubs the morph; particles flow like a murmuration between targets.

How: FBO / GPGPU technique. Positions and velocities live in floating-point textures, updated by a simulation shader, rendered as `THREE.Points`. drei has helpers; the three.js GPGPU examples are the reference. Sample target positions by reading mesh vertices / rasterizing the wordmark to a point set. This is the natural "v2" of the existing `ParticleField` in `Simulation.tsx`.

Scope: large. The single most "how??" item here for a graphics-literate audience.

---

## #59, Scrollytelling: the cybercrime paper as a pinned 3D narrative

**Labels:** `ideaboard`, `wow`, `paper`, `3d`

**Body:**

Apple-product-page energy applied to `/wc/papers/ai-cybercrime`. A pinned full-bleed canvas stays fixed while you scroll; scroll progress scrubs a camera path and drives the existing figures (BarrierToEntry toggles pre/post-AI, CapabilityRamp advances its year) as narrative beats. The page reads itself as you scroll.

How: GSAP ScrollTrigger (gsap is already installed) with `pin: true` and `scrub`. Tie `scrollProgress` to figure state and an R3F camera rig. Honor `prefers-reduced-motion` by falling back to the current static stacked layout.

Scope: medium-large. Turns the flagship paper into a showpiece and doubles as a `/wc/learn` subject.

---

## #60, Procedurally generated Chicago skyline

**Labels:** `ideaboard`, `wow`, `3d`, `generative`

**Body:**

Replace the static skyline image with a *seeded, procedurally generated* skyline: building heights, window-light patterns, and parallax depth derived from a seed, so it is subtly different each visit (or per-day, tied to #15 time-of-day theme). Fog, drifting clouds, a sun/moon that tracks local time.

How: instanced meshes (`<Instances>` from drei) for buildings, a seeded PRNG for layout, emissive window textures or a shader for lit windows. Layered parallax on scroll. This leans directly into the existing MYTHCORP / Chicago brand.

Scope: medium.

---

## #61, Desktop-OS mode for /wc (windowing portfolio)

**Labels:** `ideaboard`, `wow`, `feature`

**Body:**

Render `/wc` as a fake operating system: a boot sequence, a desktop with draggable/resizable windows, a taskbar, a clock, a "start" menu. Each window is a section (papers, learn, reads, about). The kind of site people screenshot and share.

How: a window manager in React (drag via pointer events, z-index stacking, minimize/maximize). No 3D required, so it is mostly state and CSS. henry.codes and the windows93 genre are the references for tone and interaction polish. Theme-aware chrome (cyberpunk = CRT, paper = skeuomorphic manila, luxury = frosted glass).

Scope: large, but cleanly incremental (ship one draggable window first).

---

## #62, WebGL displacement image gallery

**Labels:** `ideaboard`, `wow`, `shaders`, `content`

**Body:**

An image gallery (good fit for #54 `/wc/reads` covers or paper figures) where transitions are GLSL displacement effects: images warp, ripple, and melt into each other on hover and drag. The Codrops tutorials (tympanus.net/codrops) are the reference vein for this whole genre.

How: textures on R3F planes with a displacement/curl shader driven by hover progress and pointer velocity. `gsap` tweens the progress uniform. Lazy-load so non-gallery pages do not pay the cost.

Scope: medium.

---

## #63, Audio-reactive simulation

**Labels:** `ideaboard`, `wow`, `3d`, `audio`

**Body:**

Promote the audio-reactive bullet from #26 to a flagship. The `/experience` particle field pulses, blooms, and recolors to live audio: either the mic or a built-in ambient track. Bass drives scale, highs drive sparkle, beat detection triggers bursts.

How: Web Audio `AnalyserNode` FFT, sampled each frame in `useFrame`, mapped onto particle size / bloom `intensity` / color. Tasteful default (built-in track), mic as opt-in with a permission prompt. Pairs with the existing `<Bloom>` postprocessing.

Scope: medium.

---

## #64, Live ASCII / halftone post-process pass

**Labels:** `ideaboard`, `wow`, `shaders`, `3d`

**Body:**

A postprocessing effect that renders the entire 3D scene as live ASCII characters or halftone dots, recomputed every frame. Cheap to add, disproportionately "wait, how?".

How: a custom effect in the existing `@react-three/postprocessing` pipeline (an `Effect` subclass with a fragment shader that quantizes luminance into a glyph atlas / dot pattern). Could be a toggle on the `/experience` MainMenu next to the theme presets (#26).

Scope: small-medium. The best effort-to-wow ratio in this section.

---

## #65, Text scramble / decode effect

**Labels:** `ideaboard`, `polish`, `easter-egg`

**Body:**

The cyberpunk "decode" animation: headings resolve from random glyph noise into the final text, character by character. Small, charming, very on-theme for the cyberpunk palette.

How: a tiny `useScramble` hook (no deps) that interpolates each character from a random charset to its target over a few hundred ms, respecting `prefers-reduced-motion`. Apply to `AnimatedHeading` and the SiteHeader wordmark on route change. Gate the heavier version to the cyberpunk theme.

Scope: small. Good warm-up before a bigger flagship.

---

## #66, Live GLSL playground walkthrough

**Labels:** `ideaboard`, `wow`, `walkthrough`, `teaching`

**Body:**

A `/wc/learn` page with an editable GLSL fragment shader and a live preview, so readers tweak the raymarched hero (#57) or fluid sim (#56) and watch it recompile in real time. The "codebase as a learning artefact" pitch, taken to its logical extreme.

How: a `<textarea>` (or CodeMirror) feeding a `shaderMaterial`, recompiling on change with error display. Lighter than the Sandpack idea (#39) because it only needs to compile a shader, not bundle JS. Pairs with #57 / #56 as their explainer pages.

Scope: medium.

---

# SELF-MODIFYING PAGES, meta-playground flagships

A sub-vein of the ideaboard: learning pages where changing something on the page changes the page itself. These are Weibao's hand-built lane (portfolio-voice + authorship), not Codex work. #72 is the selected Phase 5 flagship and has a full spec.

---

## #72, Author the fourth theme (SELECTED FLAGSHIP)

**Labels:** `ideaboard`, `wow`, `flagship`, `walkthrough`, `teaching`

**Body:**

A `/wc/learn/theme-lab` page where the visitor builds a complete fourth theme live (color, surface style, radius, shadow, motion), watches the entire site restyle in real time, saves it into the ThemeSwitcher as "Yours," and shares it by URL. The whole-page evolution of `TokenPlayground`: you learn the token system by becoming an author in it.

Full build spec (architecture, the pre-paint bootstrap change, save/share scheme, build order, DoD): `FLAGSHIP_FOURTH_THEME.md` at repo root. Scope: medium-large, sequenced as its own arc per PLAN Phase 5.

---

## #73, "This page is the playground"

**Labels:** `ideaboard`, `wow`, `walkthrough`, `teaching`

**Body:**

One page whose own layout, type scale, motion, and particle density are all live knobs, and the article you are reading is the thing you are editing. Broader than #72 but with a fuzzier payoff (no saved artifact). Would reuse the `DemoPanel` + inline-override pattern. Keep as a future idea unless it earns a sharper hook than #72's shareable theme.

---

## #74, Fork-this-component live diff

**Labels:** `ideaboard`, `walkthrough`, `teaching`

**Body:**

A page that shows a real component's source with a few parameters exposed as controls; editing a control rewrites the shown source AND the running demo in lockstep, so the code you read always matches the thing you see. A middle point between the current knob playgrounds and a full code editor (#39, parked), without a bundler. First subject: the `Simulation` `DEFAULTS` object.

---

## #75, Replay-the-bug interactive

**Labels:** `ideaboard`, `walkthrough`, `teaching`

**Body:**

Extend the batch-7 "show the bug" pattern (the reset-aliasing diff in `3d-scene`) into a live one: a toggle that runs the buggy version and the fixed version side by side on real state, so the reader triggers the bug themselves before seeing the fix. The self-modifying version of BACKLOG #44.
