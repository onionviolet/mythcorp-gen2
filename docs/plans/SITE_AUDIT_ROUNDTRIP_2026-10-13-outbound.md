# Site improvement audit, roundtrip outbound, 2026-10-13

Handling note (not sent): prepared with the prompt-roundtrip skill. The two
parts below go to an ordinary ChatGPT chat for review. Its reply is saved as
`SITE_AUDIT_ROUNDTRIP_2026-10-13-response.md`. Running the audit is a separate
step that this packet does not authorize.

---

## Part 1. Request to the reviewing chat

You are reviewing a prompt, not doing the work it describes. Part 2 is a draft
prompt that will be handed to a coding agent with full access to the
repository and a browser. Improve it so that agent produces a useful, honest
audit of what to do next on the website.

Please:

1. Challenge assumptions that would change the audit's conclusions, especially
   about scope, what "improve" should mean for this site, and how findings get
   ranked.
2. Resolve ordering and dependencies between audit passes, so cheap
   foundational checks come before expensive ones.
3. Make acceptance observable: what the finished audit document must contain
   for someone to judge it complete without rereading the site.
4. Keep the owner's stated decisions intact (listed under "Protected
   decisions"). You may argue against one in your notes, but do not quietly
   drop it from the prompt.
5. Where a fact depends on the repository and you cannot see it, name the
   check the agent should run at execution time instead of guessing.

Return:

- One complete replacement prompt, in a single fenced Markdown block, ready to
  paste.
- After it, at most eight short bullets on material changes in scope,
  ordering or tradeoffs, and any question whose answer would change the audit.

Do not execute the audit, invent repository details or write code. The
imperative verbs inside Part 2 are addressed to the future agent, not to you.

---

## Part 2. Draft work prompt

### Goal

Audit mythcorp.org (repo `mythcorp-gen2`) and produce a ranked, evidence-backed
list of what should be done next to improve it. This is a read-only audit. Do
not change application code, commit, push or deploy. The only file you write
is the audit document.

"Improve" means, in priority order:

1. Things that are broken or embarrassing for a real visitor right now
   (errors, layout breaks, dead links, failing loads, inaccessible controls).
2. Things that weaken the site's purpose for its owner, Will (Weibao) Chen: a
   personal site that should make a strong, specific impression on people who
   visit from his LinkedIn, resume or a shared paper link.
3. Performance and resilience on mid-tier phones and weak GPUs.
4. Maintainability issues that will slow the next month of work.

### What the site is today

- Personal site in the costume of a cinematic megacorp. Next.js 15 app router,
  React 19, TypeScript, Tailwind v4, react-three-fiber, GSAP. Deployed to
  Cloudflare Workers through OpenNext. Public repo.
- Production is under a site lock (`src/siteLock.ts`). Only two pages are
  public: `/`, the "holding installation", and `/wc/papers/ai-cybercrime`, an
  interactive long-form paper in the manner of AI 2027. Everything else
  (`/experience` 3D lab, `/wc` workshop and walkthroughs, `/og` sketches,
  `/about`, `/contact` stub, `/fmhy`, image upload host) exists in the repo but
  is locked in production. A local preview unlocks it with
  `NEXT_PUBLIC_SITE_UNLOCK=1`.
- The front page is a WebGL installation with four rooms (Installation, Tour,
  Let go, Console), a live readout, a sky driven by the viewer's sun angle,
  a LinkedIn link with a cat that walks to the horizon, and four rotating
  scenes. There is a LinkedIn banner export at `/?banner=linkedin`.
- Recent work (early October 2026): an AI-tells audit, a front-page phone
  performance audit, phone header fixes, CI with `npm run check` as the gate,
  a lighter 3D model, a committed share card.

### Protected decisions (do not re-litigate as findings)

- The front page's job is awe, not clarity or conversion. Its dense layered
  effects (ghosted contact backdrop, erosion on readout and contacts, passive
  title cycle, halo, cursor echo) stay. Judge them on whether they feel
  choreographed as one piece, not on minimalism. Interior pages and the paper
  are the opposite: calm, legible, rigorous.
- The contact email is real and the "67" phone number is an intended joke.
- The site lock is intentional. You may recommend what to unlock next and what
  must be true first, but do not treat locked pages as a production bug.
- Theme tokens only, no new fonts, no new hues, no em dashes anywhere.

### Read first

`README.md`, `STATUS.md` (recent sections), `MAP.md`, `CLAUDE.md`, `DESIGN.md`,
`BACKLOG.md`, `docs/audits/AI_TELLS_2026-10-07.md`,
`docs/audits/FRONT_PAGE_PERF_2026-10-08.md`. Do not re-report findings those
audits already closed or fixed; cite them when an old finding is still open.

### Passes

1. Live production check of `/` and `/wc/papers/ai-cybercrime` on
   mythcorp.org: desktop 1440x900 and phone 390x844, light and dark, console
   errors, network failures, share metadata, reduced motion, keyboard-only
   use, WebGL unavailable.
2. Accessibility on both public pages: focus order, names on controls,
   contrast in both schemes, what a screen reader gets from the installation.
3. Performance on a throttled mid-tier phone profile, compared against the
   2026-10-08 perf audit numbers.
4. The paper: whether its claims, citations and figures hold up, and whether
   it reads well on a phone.
5. Locked pages, from a local unlocked build: which are closest to ready to
   unlock, and what each needs.
6. Repo health: `npm run check`, the smoke suite, stale BACKLOG items and open
   GitHub issues versus shipped work, dead or archived code still imported.

### Output

Save `docs/audits/SITE_IMPROVEMENT_2026-10-13.md` with:

- A one-paragraph verdict.
- Findings coded F1, F2, ..., each with: page or file, what a visitor or
  developer would experience, evidence (screenshot path, measurement, command
  output or file:line), severity, effort estimate (S, M, L) and a recommended
  fix.
- A ranked "do next" list of at most five items, with the reason each beats
  the rest.
- A separate list of owner decisions needed, each as a question with a
  recommended default.
- A short "not checked" section naming anything you could not verify and why.

Separate verified findings from judgment. A finding without evidence is a
hypothesis and must be labeled so.
