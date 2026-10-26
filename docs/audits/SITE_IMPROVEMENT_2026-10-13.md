# Site improvement audit, 2026-10-13

Read-only audit of mythcorp.org and `mythcorp-gen2`, run from
`docs/plans/SITE_AUDIT_ROUNDTRIP_2026-10-13-prompt.md`. No application,
config or backlog file was changed. Evidence lives in the session scratchpad
(`$SCRATCH` below is
`/private/tmp/claude-501/-Users-weiwei-code-mythcorp-gen2/fa9cbd70-b6af-43cd-ac79-a6fa9e619334/scratchpad`),
outside the repo, and is cited by path.

## 1. Verdict

The public site is healthy at the foundation: `npm run check` and the
44-test local e2e gate pass, both public pages load with no page errors at
desktop and phone sizes in both schemes, keyboard and reduced-motion use work,
and the specimen now reaches a throttled phone about 2 s sooner than on
10-08. The most important verified problems are about sharing, not spectacle.
The paper (the link most likely to be pasted into LinkedIn) has no preview
image (F1). Image-host view and delete links already out in the world
redirect to the holding page (F2). The paper's headline repair number is
presented as current without the source's own caveat (F3). On phones, one of
the four Installation scenes never draws a readable title (F4). Recommended
next move: ship F1 and F2 together as one small metadata and allowlist change,
then a paper v2.9 accuracy pass. Nothing found should block the current
public surface. F2 and the lock findings in section 7 should be fixed before
any further unlock.

## 2. Scope and baseline

- **Repo:** branch `main`, HEAD `049edb1` (2026-10-09). The tree was dirty
  only with the three untracked `docs/plans/SITE_AUDIT_ROUNDTRIP_*` files and
  was identical after the checks ran. Node 22.23.3, npm 10.9.9. The repo pins
  no runtime version; CI uses Node 22.
- **Checks run:**
  - `npm run check` passed in 44.5 s (`$SCRATCH/evidence/npm-check.log`).
  - `npm run build` then `PLAYWRIGHT_SERVER=start PLAYWRIGHT_CHANNEL=chrome
    npm run test:smoke`: 44 of 44 passed in 3.9 min with no reruns, at a load
    average of 13 to 15 (`$SCRATCH/evidence/smoke.log`).
- **Public surfaces verified on production:** `/` and
  `/wc/papers/ai-cybercrime`, checked in:
  - the desktop app's built-in Chromium pane at 1440x900 (dark and light),
    768x1024 and 390x844/375x812 (dark; paper also light);
  - Playwright Chrome against production for the WebGL-disabled,
    reduced-motion and throttled-load passes (`$SCRATCH/measure.mjs`,
    `$SCRATCH/measure-cached.mjs`);
  - curl for status, headers, metadata, robots, sitemap and the share card.
- **Locked surfaces:** inspected from source only. No local unlocked build was
  browsed (see section 7 and section 11).
- **Governing docs read:** CLAUDE.md, DESIGN.md, MAP.md, README.md, STATUS.md
  (2026-10-08 to 10-09 entries), BACKLOG.md, `docs/audits/AI_TELLS_2026-10-07.md`
  and `docs/audits/FRONT_PAGE_PERF_2026-10-08.md`.
- **Delegated passes:** three read-only subagents covered paper integrity,
  locked-surface inventory and repo health. Their reports are in
  `$SCRATCH/evidence/{paper-integrity,locked-surfaces,repo-health}.md`.
  Claims from them that drive a finding were spot-checked by hand; see each
  finding.

**Supplied context versus reality**

| Supplied claim | Reality |
|---|---|
| Lock in `src/siteLock.ts`, public `/` and the paper | Confirmed. `SITE_LOCKED` is a build-time flag (`siteLock.ts:3`); the only open page is the paper, matched exactly (`siteLock.ts:6-11`). Other page paths get a 307 to `/`. |
| Locked routes include an image-upload host | The upload API and `i.mythcorp.org` still work, but the view (`/a/<id>`) and delete (`/d/<token>`) pages are locked too. See F2. |
| Local preview unlocks with `NEXT_PUBLIC_SITE_UNLOCK=1` | True for the routes, but the global unlock would hold the paper behind the plain-mode screen. See section 7, L1. Traced in source, not run. |
| `/?banner=linkedin` | Still owned and exported: MAP.md:9, 200 in production, Banner link present at 1440 and hidden at 390. |
| CI uses `npm run check` | True (`.github/workflows/ci.yml`). README.md "CI" still says no workflow is tracked. |
| Lighter 3D model, committed share card | True: `spectre.glb` is 556,148 bytes in production; `/share/mythcorp-card.png` is 200, 1200x630, 110,559 bytes. |

## 3. Previous-audit reconciliation

| Prior item | Current state | Evidence | Effect on this audit |
|---|---|---|---|
| Perf F1: specimen at about 9.1 s on slow 4G, 1 MB texture | Partially fixed | Texture cut to 1024 px. The specimen now draws at a median of 6.96 s (Signal) and 7.1 s (Surface, Drift) by the same method (table in F6). | Movement is real, but the 4.5 s achievable with 512 px was not taken (STATUS 10-09 judged 512 too soft on Surface). |
| Perf F3/rec 3: non-Signal scenes boot through a hidden ASCII layer | Reconfirmed open | `HoldInstallation.tsx:47-48`, switch at `:61-67`. Production requests `spectre.glb` twice on Surface and Drift; the second is a revalidation because the file is served `max-age=0, must-revalidate`. | Part of F6 |
| Perf F5/rec 4: R3F and troika shipped to locked `/` | Reconfirmed open | `src/app/page.tsx:7-8` still imports `LoadingScreen` statically. JS on `/` is now 571 to 585 KB, against 523 to 536 KB on 10-08 (different server, see F6). | Part of F6 |
| Perf rec 2: pixel-ratio governor for halo and fog | Reconfirmed open | `Laser.tsx:459`, `Clouds.tsx:443` still use a fixed DPR cap of 2 | Deferred (section 9) |
| AI_TELLS visual F3: DOM cannot carry the premise without WebGL | Reconfirmed open | WebGL-disabled screenshots (F5) | F5 |
| AI_TELLS copy F2: console promises unavailable rooms | Partially fixed | The Console room is lock-aware; the global `TerminalOverlay` (mounted on every page, `layout.tsx:120`) still lists 15 routes, mostly locked (`TerminalOverlay.tsx:15-19`), and robots.txt points visitors to it | F7 |
| AI_TELLS copy F4 to F6: paper scores, survey mapping, unbounded claims | Fixed, one leftover each | Rubric published and labelled as author's ratings; `CapabilityRamp.tsx` removed; "orders of magnitude" gone. Leftovers: "six attacks" at `page.tsx:218` and the thesis stated as fact in `PaperInSixty.tsx:10-11` | F3 |
| AI_TELLS copy F8 to F11, F21; visual F4, F13 to F16 | Unchanged, locked only | `wc/about/page.tsx:6-9,62`, `wc/learn/page.tsx:18,32`, `layout.tsx:43,46` | Section 7 gates only |
| AI_TELLS Q2: visible name on the front page | Still an open owner question | Nothing in source; the only person name on `/` is none (LinkedIn link name is "Operator profile: 0w0") | Section 10 |
| DESIGN 2026-09-07: plain-to-themed compositor residue | Unverifiable | Only reachable when unlocked; BACKLOG already lists the retest | Not re-tested |

## 4. Findings

### F1. The paper's link preview has no image

- **Status:** Verified
- **Area:** `src/app/wc/papers/ai-cybercrime/layout.tsx:7-13`, root metadata
  `src/app/layout.tsx:29-47`
- **Audience:** anyone who sees the paper link posted on LinkedIn, Slack,
  iMessage, X or email. The paper is the link most likely to be shared
  directly.
- **Observed consequence:** production paper HTML has `og:title`,
  `og:description` and `og:type=article` but no `og:image`, and
  `twitter:card` is `summary`. The paper's `openGraph` and `twitter` objects
  replace the root ones wholesale (Next.js merges metadata per top-level key),
  so the committed share card is dropped. LinkedIn renders an imageless link.
  Neither public page emits `<link rel="canonical">` or `og:url`.
- **Evidence:** `$SCRATCH/evidence/prod_wc_papers_ai-cybercrime.html`
  (`grep og:image` returns nothing); `$SCRATCH/evidence/prod_.html` has the
  card. Source lines above.
- **Priority:** P0 (serious share failure on the public paper)
- **Confidence:** High for the missing tags. How LinkedIn renders it was
  inferred, not observed in Post Inspector.
- **Effort:** S
- **Dependency:** none. The image choice could be the existing card or a
  paper-specific card; the existing card is enough to close this.
- **Recommended response:** add `images` to the paper layout's `openGraph`
  and `twitter`, switch to `summary_large_image`, and set `alternates.canonical`
  for both public pages. Extend `tests/e2e/holding-details.spec.ts`' OG
  assertion (line 223) to the paper.
- **Acceptance:** `curl -s https://mythcorp.org/wc/papers/ai-cybercrime | grep -c og:image`
  is at least 1. LinkedIn Post Inspector shows a large image for the paper
  URL. An e2e test covers it.

### F2. Shared image links and delete links redirect to the holding page

- **Status:** Verified
- **Area:** `src/siteLock.ts:6-18`, `src/middleware.ts`,
  `src/app/components/plain/holdState.ts:5-11,26-27`,
  `src/app/api/upload/route.ts:52-57`
- **Audience:** anyone holding a `mythcorp.org/a/<id>` view link or a
  `/d/<token>` delete link from the upload host. The audience is small but
  real, and these links were handed out as permanent.
- **Observed consequence:** `curl` on production returns 307 to `/` for
  `/a/<id>` and `/d/<token>`; `/i/<key>` 308s to `/a/...` and then 307s.
  `/api/upload` still returns both link kinds, so every new upload hands out
  two dead links. The image bytes on `i.mythcorp.org` still serve. The code
  says the opposite should hold: `holdState.ts:7-9` says a shared image
  resolving to a holding screen "would be a broken link". But while locked,
  `PLAIN_OPEN_PREFIXES` is ignored (`holdState.ts:26-27`), and the middleware
  only opens `LOCKED_OPEN_PATHS`.
- **Evidence:** curl output recorded in this session (307 with
  `redirect_url https://mythcorp.org/` for both paths). Not tested with a real
  object id, because none was available; the middleware redirects before
  the id is looked up, so the id does not matter.
- **Priority:** P0 for the affected audience (dead destinations)
- **Confidence:** High
- **Effort:** S
- **Dependency:** owner confirmation that the upload host is still in use
  (section 10, D3). If it is retired, the fix is to stop issuing the links
  instead.
- **Recommended response:** let the lock open prefix paths, and add `/a`,
  `/d` and `/i` as prefixes, keeping `/upload` locked if desired. Add an e2e
  test that `/a/<id>` does not redirect while locked.
- **Acceptance:** `curl -sI https://mythcorp.org/a/<real id>` returns 200 with
  its OpenGraph image; `/d/<token>` renders the confirm page; the smoke suite
  asserts both.

### F3. The paper's repair headline overstates how current and complete it is

- **Status:** Verified (in source and against the cited source). The newer
  dashboard figure came from the paper subagent and was not re-fetched by hand.
- **Area:** `/wc/papers/ai-cybercrime`. "75 of 530" appears at `page.tsx:88`,
  `PaperInSixty.tsx:22`, `PatchTally.tsx:6`, the falsification row at
  `page.tsx:815` (labelled "latest"), `EndingsBranch.tsx:116,276`,
  `scenarioChapters.tsx:169,212` and `EvidenceTimeline.tsx:91`, and it seeds
  the backlog model.
- **Audience:** security-literate readers arriving from LinkedIn, the readers
  most likely to click this citation.
- **Observed consequence:** the source
  (anthropic.com/research/glasswing-initial-update) gives the count with the
  caveat that it is early in the 90-day disclosure window, that more patches
  are expected soon, and that patches are likely undercounted. The paper
  omits all of that and calls the May figure "latest". Anthropic's disclosure
  dashboard (red.anthropic.com/2026/cvd, updated 2026-10-02) reports 6,157
  disclosed and 516 patched across all severities. That is not directly
  comparable, but it is a newer reading. Smaller defects in the same pass:
  - `page.tsx:218` says the 2025 paper "scored six attacks", while
    amendment A4 (`AmendmentsLog.tsx:85`) says five;
  - the abstract says the sources run 2009 to 2026, but Arora 2008 is cited;
  - Mandiant's "estimated" minus 7 days lost the word "estimated";
  - `PaperInSixty.tsx:10-11` states the thesis as fact where the abstract
    calls it a forecast.
- **Evidence:** `$SCRATCH/evidence/paper-integrity.md` (C1, P1 to P4). The
  `page.tsx:218` and "75 of 530" occurrences were re-grepped by hand.
- **Priority:** P1 (credibility of the paper as serious work)
- **Confidence:** High for the omitted caveat and the six/five contradiction;
  Medium for how to treat the dashboard number.
- **Effort:** S to M (copy across about eight places, plus deciding whether
  the backlog model's starting rate changes)
- **Dependency:** none
- **Recommended response:** a v2.9 amendment:
  - carry the source's timing caveat beside every "75 of 530";
  - relabel the falsification row "first reading, May 2026" and either add
    the October dashboard reading with its severity caveat or say why it is
    not comparable;
  - fix six to five, 2009 to 2008, and restore "estimated";
  - match the 60-second summary's verb to the abstract's;
  - log it in `AmendmentsLog.tsx`.
- **Acceptance:** no "75 of 530" without its timing caveat; the falsification
  row no longer claims "latest" for a superseded reading; `grep "six attacks"`
  returns nothing; a new amendment entry records the change.

### F4. On phones and tablets, the Suspension scene's title never becomes readable

- **Status:** Verified
- **Area:** `src/app/components/plain/PlainField.tsx:23-28,58,64-69`;
  `textMask.ts`
- **Audience:** phone and tablet visitors whose load lands on Suspension.
  Scenes rotate per load and the day's shared scene is fixed for everyone, so
  on Suspension's day it is every first phone visit. LinkedIn traffic skews
  to phones (inference).
- **Observed consequence:** at 390x844 and 768x1024, "WORK IN PROGRESS"
  renders as bands of `@`, `#` and `+` glyphs with no legible letterforms,
  still unreadable after 18 s. At 1440x900 the same scene draws large,
  readable ASCII letters. Signal (dust) and Drift and Surface (solid) are
  readable at 390. The field uses a fixed 6 px cell (`PlainField.tsx:58`, 65
  columns at 390 px) and fits the words to 46% of the columns
  (`:24`, `:68`), which leaves about 4 cells per letter.
- **Evidence:** built-in browser screenshots captured this session at 390,
  375, 768 and 1440 (`?scene=suspension`, dark). They are held by the desktop
  app session, not saved to `$SCRATCH`; reproduce with the URL condition.
- **Priority:** P1. The title is the composition's anchor, and an unreadable
  one reads as broken rather than eroded. Erosion is protected; illegibility
  at rest is not.
- **Confidence:** High
- **Effort:** M (look-sensitive; needs a visual pass in both schemes)
- **Dependency:** none
- **Recommended response:** below a column threshold, either draw the words
  with a smaller cell or larger mask fill on coarse or narrow screens, or let
  Suspension fall back to the dust or solid words that already work on
  phones. Keep pointer erosion.
- **Acceptance:** at 390x844 and 768x1024, in both schemes,
  `/?scene=suspension` shows "WORK IN PROGRESS" legibly within 5 s of
  load. An e2e or screenshot check pins it.

### F5. Without WebGL, the Installation has no subject and the readout misreports it

- **Status:** Verified. Reconfirmed open: AI_TELLS visual F3 and the BACKLOG
  "static specimen image" item.
- **Area:** `/`, `HoldStage`, `HoldMessage` (dust words), `HoldOverlay`
  (halo), `HoldStatus`
- **Audience:** visitors with WebGL blocked or failed (corporate policy,
  hardware acceleration off, GPU blocklist). The share is unknown.
- **Observed consequence:** with `--disable-webgl --disable-3d-apis`, at 1440
  and 390, the top half is empty: no specimen, no title (Signal's dust title
  is WebGL), and no halo. The readout still says `RENDER ASCII`, `HALO
  ACTIVE` and `GRID 240 X 94 CELLS`. There are no page errors, only six
  `THREE.WebGLRenderer` console errors. Contacts, LinkedIn and the paper link
  all remain usable.
- **Evidence:** `$SCRATCH/evidence/webgl-disabled-1440.png`,
  `webgl-disabled-390.png`, `measure-variants.json`
- **Priority:** P2
- **Confidence:** High for the behaviour, Low for how many visitors hit it
- **Effort:** M
- **Dependency:** none
- **Recommended response:** when context creation fails, show a static
  specimen still (a PNG rendered from the existing model, like the share
  card) and DOM title text, and report the fallback in the readout (for
  example `render still`).
- **Acceptance:** the WebGL-disabled run shows the title and a specimen
  image at 1440 and 390, and the readout does not claim a renderer that is
  not running.

### F6. The phone boot path still does avoidable work in the first seconds

- **Status:** Verified measurements. Comparability to 10-08 is partial (see
  below).
- **Area:** `src/app/page.tsx:7-8`, `HoldInstallation.tsx:47-48,61-67`,
  `spectre.glb` cache headers
- **Audience:** every phone visitor on a slow connection
- **Observed consequence:** see the table below.

  | Scene | Specimen drawn (ms) | First paint | TBT 10 s | JS KB | Total KB | GLB requests |
  |---|---|---|---|---|---|---|
  | Signal (3 runs, cache off) | 6,910 / 6,962 / 7,392 | about 1,000 | 325 to 1,609 | 571 | 1,274 | 1 |
  | Surface (2 runs, cache on) | 7,098 / 7,139 | about 1,000 | 438 to 639 | 585 | 1,247 | 2 |
  | Drift (2 runs, cache on) | 7,082 / 7,135 | about 1,010 | 523 to 885 | 577 | 1,239 | 2 |
  | 10-08 baseline, all scenes | 9,107 to 9,330 | 3,948 to 4,100 | 263 to 573 | 523 to 536 | 1,733 to 1,774 | n/a |

  Method: the 10-08 load pass in Playwright Chrome against production
  (Metal, 390x844 DPR 3, mobile and touch, Android UA, dark, `?sun=noon`, 4x
  CPU, CDP slow 4G at 150 ms, 1.6 Mbps down and 750 kbps up, cold context,
  forced `preserveDrawingBuffer`, and the same 48x48 opacity probe on
  `[data-specimen-layer] canvas`).
  `$SCRATCH/evidence/measure-load.json` and `measure-load-cached.json`.
  - Specimen timing is comparable and improved by about 2 s.
  - First paint is not comparable: 10-08 measured `next start` locally, and
    this run measured Cloudflare over the real network. The first Signal run
    also hit a high-load spike (TBT 1,609).
  - The JS byte growth (about +50 KB) may partly be compression differences
    between the two servers (inference).
  - Non-Signal scenes still request the GLB twice. The second request is a
    conditional revalidation (`cache-control: public, max-age=0,
    must-revalidate`), which costs a 150 ms round trip on this profile. It is
    not a second download.
- **Priority:** P2
- **Confidence:** High for the specimen numbers; Medium for attributing the
  remaining gap to the open recommendations
- **Effort:** S for each of perf recs 3 and 4; S to give `spectre.glb` a
  long immutable cache with a versioned filename
- **Dependency:** rec 3 changes the cold-load path covered by
  `tests/e2e/holding-details.spec.ts`; rerun the local gate.
- **Recommended response:** do perf rec 3 (start on the cold composition) and
  rec 4 (dynamic-import the unlocked home so R3F and troika leave `/`).
  Consider a hashed GLB filename with a long cache.
- **Acceptance:** rerunning `$SCRATCH/measure-cached.mjs` shows one GLB
  request per load and JS on `/` at or below the 10-08 figure, with the
  specimen median no worse than 7.0 s.

### F7. Outside the Console room, the site still advertises locked rooms

- **Status:** Verified
- **Area:** `src/app/sitemap.ts:20-34`, `src/app/robots.txt/route.ts:17-21`,
  `src/app/components/TerminalOverlay.tsx:15-19` (mounted on every page at
  `layout.tsx:120`)
- **Audience:** crawlers, plus curious visitors who follow robots.txt's
  invitation to the console
- **Observed consequence:**
  - The production sitemap lists 13 URLs; 11 of them 307 to `/`. Crawlers
    get redirect noise around the two pages that matter.
  - robots.txt tells visitors to open the console.
  - The global terminal's route list names 15 paths, most of them locked, so
    `cd` to them lands back on `/`. Its theme command reports the theme
    choices although the lock pins plain (source, from the subagent; not run
    by hand).
  - Unknown paths also 307 to `/`, so there is no 404 in production. That is
    consistent with the lock, and is noted, not flagged.
- **Evidence:** `curl https://mythcorp.org/sitemap.xml`; route probes in
  section 2; source lines above
- **Priority:** P2 (P3 for the sitemap alone)
- **Confidence:** High
- **Effort:** S
- **Dependency:** none
- **Recommended response:** build the sitemap from the lock (`LOCKED_OPEN_PATHS`
  plus `/` while locked), and have `TerminalOverlay` read the same lock
  state the Console room already uses.
- **Acceptance:** the production sitemap lists only 200 URLs; the global
  terminal's `ls` matches what a visitor can open.

### F8. Process signals are less trustworthy than they look

- **Status:** Verified
- **Area:** `.github/workflows/ci.yml`, README.md, MAP.md, GitHub issues
- **Audience:** the owner and the next agent session
- **Observed consequence:**
  - The latest main CI run (049edb1, run 38014141084) shows success, but it
    uploaded `playwright-traces`. `ci.yml` uploads that artifact only when
    `steps.e2e.outcome == 'failure'`, so e2e failed and nothing surfaced it.
    The local gate passed 44 of 44 today, so this is likely runner flake,
    but nobody would know if it were not.
  - README.md says no CI workflow exists.
  - MAP.md gives `spectre.glb` as 1.2 MB (it is 556 KB) and has no routes row
    for the public paper.
  - No "add a page" recipe mentions that new routes 307 to `/` under the lock.
  - Four of 22 open issues are already shipped (#13, #16, #17, #28).
  - The origin-trial token expiring 2026-10-20 probably changes nothing on
    the public pages, because the html-in-canvas consumers are locked
    (inference from source).
- **Evidence:** GitHub REST API for runs, jobs and artifacts (queried this
  session); `$SCRATCH/evidence/repo-health.md`
- **Priority:** P3
- **Confidence:** High
- **Effort:** S
- **Dependency:** none
- **Recommended response:** surface the e2e outcome as a job summary or a
  separate non-blocking job, so a red signal is visible without blocking.
  Correct README "CI", the MAP size and the paper row, and add the lock note
  to the "Adding a page" recipe. Close the four shipped issues (an owner
  action).
- **Acceptance:** a failing CI e2e run shows a visible warning on the run
  page; README, MAP and CLAUDE.md match the repo.

## 5. Public-surface coverage

`ok` checked, no material issue. `issue` checked, finding raised. `n/a` not
applicable. `nv` not verified.

| Check | `/` | `/wc/papers/ai-cybercrime` |
|---|---|---|
| Desktop 1440x900 | ok | ok |
| Phone 390x844 | issue (F4) | ok (no overflow, 37 mono chars a line) |
| Tablet 768x1024 | issue (F4) | nv |
| Light / dark | ok (desktop light, phone and desktop dark) | ok (phone light, desktop dark) |
| Keyboard | ok (all 18 controls reachable in order; `:focus-visible` rings on header, readout, links; slider lights on focus) | nv beyond anchors and rail |
| Reduced motion | ok (renders, no page errors; smoke covers it) | ok (0 running animations) |
| Accessibility semantics | ok, with notes: one h1 (sr-only), ghost backdrop `aria-hidden`, named controls, no landmarks. No visible or announced person name (section 10). | ok, with notes: one h1, 6 h2, 7 figures with 6 figcaptions, 2 `svg[role=img]`, no `<main>` |
| WebGL failure | issue (F5) | n/a |
| Console / network | ok (two three.js sigma warnings, one unused preload warning, all requests 200) | ok |
| Metadata / share | ok (card and twitter large image); no canonical (F1) | issue (F1) |
| Share card asset | ok (200, 1200x630, matches repo) | n/a |
| `/?banner=linkedin` | ok (200, owned per MAP) | n/a |
| Performance | measured (F6) | nv (391 KB HTML, not profiled) |
| Degraded network | slow 4G only (F6) | nv |
| Touch gestures on real device | nv | nv |

Contrast was not measured with a tool. The front page's low-contrast layers
are protected spectacle; the readout and contacts read clearly in every
screenshot taken.

## 6. Paper verification scope

- **Structural checks (all done):**
  - all 69 sources in `paperSources.ts` are cited and every citation
    resolves;
  - every source has a URL, and 57 have archive links;
  - figures 1 to 6 are numbered in order, each with a caption and a "Data:"
    line;
  - repeated numbers agree everywhere (63 days, minus 7 days, 75 of 530,
    about 4%, $820M, the CISA counts).
- **Links:**
  - 58 of 69 return 200;
  - 10 DOI publisher links return 403 to curl (bot walls; doi.org redirects
    correctly);
  - the FTC link 404s to curl, but its archived copy loads and contains the
    cited figures;
  - 20 of 57 archive links were confirmed before the archive rate-limited
    the checker; the other 37 are unchecked, not dead.
- **Claims sampled externally (16):**
  - Mandiant time-to-exploit, 2023 and 2026 reports
  - METR doubling times and data points
  - FBI IC3 totals
  - Chainalysis ransomware
  - NIST NVD backlog
  - CISA KEV counts (recomputed from the live feed)
  - The Hong Kong deepfake case
  - The Grace et al. survey
  - UK AISI trends
  - FTC fraud figures
  - The 12% versus 14% exploit result
  - Glasswing April and May

  13 were supported. 3 were partially supported:
  - "75 of 530" (F3);
  - the METR 16 h point, plotted at its publish date rather than its
    measurement window, which errs in the cautious direction;
  - Chainalysis's $820M, which the source expects to be revised to about
    $900M.
- **Not fact-checked:** Verizon DBIR, Tidelift, EPSS, Lohn, Li, Bilge, the
  six academic study rows, CrowdStrike, ENISA, the International AI Safety
  Report, AIxCC, AI Futures, and all paywalled sources. No source was opened
  in a real browser.
- **Credibility-affecting findings:** F3. Also Appendix B names the 2025
  reviewer and affiliation (`page.tsx:613-614`); see section 10, D4.

## 7. Locked-surface readiness

How the lock works: `SITE_LOCKED` is fixed at build time. Middleware 307s
every page path except `/` and the paper. `/_next/*`, `/api/*` and dotted
file paths pass, and `i.mythcorp.org` bypasses the lock. The client
`PlainHold` holds everything except the paper.

**L1 (Verified in source, not run):** flipping the global unlock would hide
the paper. Unlocked, the default theme is plain (`ThemeContext.tsx:32`), and
`isHeld` holds plain-theme paths outside `PLAIN_OPEN_PREFIXES`
(`holdState.ts:28-29`), which does not include the paper. Visitors with a
stored non-plain theme would also get the old "Discover Your Potential" boot
landing (`layout.tsx:43-46`). Unlock route by route through
`LOCKED_OPEN_PATHS`, never by the global switch.

**Shared code that can regress production today:**

- `BarrierToEntry`, `/og/doubt`'s `ProgressFigures` and `/wc/learn`'s
  `MiniStarField` render in the public Tour room (`tourFigures.tsx:13-26`).
- `/og/gravity`'s `letterSolver` drives Let go.
- `/og/sketches.ts` blurbs print in the Console.
- `SiteHeader` and `/wc/papers/_components` render on the paper.

| Surface | Classification | Visitor value | Main blockers | Unlock gate |
|---|---|---|---|---|
| `/og/doubt` | Near-term candidate | A second calm reading room; shows range beyond security; its figure already ships in the Tour | "Merchant of Doubt" should be plural (`:44,117`); undated "now" and unsourced series (AI_TELLS F12, `:80,116-118`); slogan ending (F16, `:105`); links to locked `/og/calhoun` and `/og` (`:96,123`); robots blocks `/og` | Copy fixed and sourced, served at a robots-allowed path, Tour links to it, added to `LOCKED_OPEN_PATHS` and the sitemap |
| `/wc/about` and `/about` | Needs substantial work | Highest value for a LinkedIn visitor ("who is this") | Date contradiction (F8, `wc/about/page.tsx:6-9`), stale theme count (`:62`), generic closing paragraph; two pages for one job | One merged page with real, owner-written content |
| `/wc/papers` index | Needs substantial work | Only useful with a second paper | One entry | A second piece exists |
| `/wc/learn` and walkthroughs | Needs substantial work | Shows engineering depth | Copy describes superseded code (F9 to F11, F17); theme demos cannot work under the lock | Walkthroughs rewritten against current code; the lock allows theme switching on those routes |
| `/experience` | Needs substantial work | The original spectacle | No low-power fallback (BACKLOG); "Discover Your Potential" metadata; competes with `/` for "spectacle" | Fallback exists; metadata rewritten; a reason to send visitors there |
| `/og/*` other sketches, `/wc/lab/canvas` | Experiment/archive | Workshop texture | Draft by design; `/og/orbit` breaks on phones | No production-readiness work |
| `/contact` | Unknown intent | Duplicates `CONTACT` | Its palindrome claim is false (6767677676 reversed is 6767767676) | Owner decides keep or drop |
| `/fmhy` | Unknown intent | Directory mirror | Data dated 2026-05-23; off-theme for the site's purpose | Owner decides |
| `/upload`, `/a`, `/d`, `/i` | Unknown intent for `/upload`; `/a`, `/d` should be open | Image host | F2 | F2 acceptance |

**Next unlock-focused work:** none yet. Fix F2 and F7 first, since they
already affect production. The strongest candidate after that is `/og/doubt`,
because it is a short copy job, it fits the calm-interior rule, and the Tour
already advertises it. `/wc/about` would matter more to a LinkedIn visitor,
but it needs content only the owner can write.

## 8. Ranked next work

1. **Fix the paper's share preview and add canonicals (F1).**
   - Outcome: every paper share on LinkedIn carries an image.
   - Why now: the paper is the public link with the most share traffic, and
     this is a one-file fix.
   - Order and effort: first, S. Can ship in the same PR as item 2.
   - Done when: production paper HTML has `og:image`; Post Inspector shows
     the card; an e2e test asserts it.
   - Beats the strongest alternative (F4) because every share is affected,
     at a fraction of the effort.
2. **Reopen `/a` and `/d` under the lock (F2).**
   - Outcome: links already handed out work again, and new uploads stop
     issuing dead ones.
   - Why now: verified breakage of a promise the code itself documents.
   - Order and effort: with item 1, S. Owner confirmation D3 first if the
     host might be retired.
   - Done when: `/a/<real id>` returns 200 with OG tags; `/d/<token>`
     renders; a smoke test covers both.
   - Beats F4 on certainty and cost, though F4 reaches more visitors.
3. **Paper v2.9 accuracy amendment (F3).**
   - Outcome: the headline number carries its source's caveat; the
     contradictions are gone.
   - Why now: a security reader who clicks the citation finds the omitted
     caveat in the cited paragraph, which damages the paper's main
     credibility claim.
   - Order and effort: independent, S to M.
   - Done when: F3's acceptance holds and the amendment is logged.
   - Beats F4 because the paper is shared as serious work, and rigor is its
     whole posture.
4. **Make Suspension's title legible on narrow screens (F4).**
   - Outcome: every phone load shows a readable title.
   - Why now: verified, and it affects one scene in four on the device class
     that LinkedIn traffic most likely uses.
   - Order and effort: independent, M.
   - Done when: Suspension is readable at 390 and 768 in both schemes, with
     a pinned check.
   - Beats F5 because far more visitors are on phones than lack WebGL.
5. **Trim the boot path (F6: perf recs 3 and 4, plus GLB caching).**
   - Outcome: one GLB request per load, about 75 KB less JS on `/`, and less
     contention in the first seconds that carry the awe.
   - Why now: both diffs are small and were already specified on 10-08.
   - Order and effort: after item 4 if both touch `HoldInstallation`.
     Otherwise independent. S each. Rerun the local e2e gate.
   - Done when: F6's acceptance holds.
   - Beats F5 because it reaches every phone visitor, not an unknown sliver.

## 9. Deliberately deferred

- **F5, WebGL-failure fallback.** This is the strongest deferred candidate.
  It is real and verified, but the affected share is unknown and probably
  small. It also needs a still image pipeline (M). Do it before any unlock
  that sends more traffic, or if Cloudflare Web Analytics (now emitting
  `/cdn-cgi/rum` beacons) shows meaningful non-WebGL traffic.
- **F7, lock-aware sitemap and terminal.** It is S, but it affects crawlers
  and curious console users rather than first impressions. Bundle it with
  the next lock change (item 2 is a natural place).
- **F8, CI visibility and docs drift.** It is cheap, and it is next in line
  for a quiet session. It changes no visitor experience.
- **Perf rec 2, halo and fog pixel-ratio governor.** It is valuable on weak
  phone GPUs, but there is no real-device trace. The 10-08 caveat still
  stands: get one device trace first.
- **Unlocking `/og/doubt`.** Wait until F2 and F7 land.
- **Excluded as low value now:** retiring `holdRoll.ts` and `check:roll`;
  unifying the three WebGL probes; the vendored-renderer edit markers; the
  locked-page copy findings beyond their unlock gates; and the 404 page,
  which the lock makes unreachable.

## 10. Owner decisions

**D1. Should the paper render in all-monospace while the site is locked?**
**Why it changes the roadmap:** the lock forces `data-theme=plain`, and
plain maps body, display and mono to Geist Mono (`globals.css:195`). So the
paper's `font-serif` display classes and body text are all Geist Mono, at
about 37 characters a line on a phone. DESIGN.md says mono is for readouts
and data and "never decorative mono paragraphs", and that the paper should be
calm and legible. No STATUS entry records choosing mono for the paper. If it
is not intended, it is a small, high-visibility change (existing Geist and
Cinzel, no new fonts) that would rank around item 3.
**Recommended default:** give the paper route Geist body and Cinzel display
tokens while locked, and keep mono for data, labels and figures.

**D2. A visible name on the front page (AI_TELLS Q2, still open).**
**Why it changes the roadmap:** nothing on `/` names Will (Weibao) Chen,
visibly or to a screen reader. The LinkedIn link is announced as "Operator
profile: 0w0". A visitor arriving from a resume cannot confirm they are in the
right place without clicking out. This does not ask to reduce the spectacle.
**Recommended default:** one quiet line with the name, in the existing
corner contact stack or the sr-only h1, and nothing more.

**D3. Is the image host still in service?**
**Why it changes the roadmap:** it decides whether F2 means reopening `/a`
and `/d`, or retiring link issuance.
**Recommended default:** reopen them. The code comment says those links are
already out in the world.

**D4. Has the 2025 reviewer agreed to be named in Appendix B?**
**Why it changes the roadmap:** if not, removing the name is a pre-share fix
for the paper.
**Recommended default:** keep the name only with confirmed consent.

## 11. Not checked / uncertainty

- **Real devices:** none. All phone results come from emulation (Metal hides
  GPU cost). A real mid-tier Android trace would settle F4's touch behaviour
  and perf rec 2.
- **Locally unlocked build:** not browsed. Locked-surface readiness is from
  source. L1 is a source trace and should be confirmed with
  `NEXT_PUBLIC_SITE_UNLOCK=1 npm run build && npm start` before any unlock
  plan.
- **LinkedIn rendering:** F1's visible effect was inferred from tags.
  LinkedIn Post Inspector needs a signed-in session.
- **Paper:** 16 claims were sampled and the rest were not fact-checked
  (section 6). 37 archive links are unchecked. The dashboard figure in F3
  was taken from the subagent and not re-fetched.
- **Comparability:** first paint and JS bytes differ from 10-08 by server
  and network path, not only by code. Machine load averages were 8 to 16
  during all runs.
- **Contrast:** not measured with a tool.
- **Screen readers:** no VoiceOver or NVDA run. Semantics come from the
  accessibility tree.
- **CI e2e failure on 049edb1:** inferred from the uploaded traces artifact;
  the traces themselves were not downloaded.
- **Upload links:** tested with synthetic ids only, because the middleware
  redirects before any lookup.
