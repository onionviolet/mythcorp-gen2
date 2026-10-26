# Site improvement audit, executable prompt, 2026-10-13

Reconciled from ChatGPT's replacement prompt
(`SITE_AUDIT_ROUNDTRIP_2026-10-13-response.md`) against the outbound packet
and the repo. Changes from the returned text:

- Em dashes replaced (repo rule, and the prompt itself bans them).
- `/ ?banner=linkedin` typo fixed; nested route list re-indented.
- Added the repo's known e2e gate and flake behavior from STATUS 2026-10-09,
  so the agent does not misreport load-induced WebGL timing failures.
- Named where evidence goes (session scratchpad, outside the repo).
- Kept the reviewer's default on its open question: the paper's integrity
  competes for the same top-five slots as site work.

Paste everything below the line into the agent that runs the audit.

---

# Site improvement audit, mythcorp-gen2

## Role and authorization

Audit `mythcorp-gen2` / mythcorp.org and produce a decision-ready, evidence-backed recommendation for what should be done next.

This is an **audit and prioritization task, not implementation authorization**.

You may:
- inspect the repository and git state;
- run existing read-only checks, tests and local builds/previews;
- inspect production and a locally unlocked build;
- use browser/devtools, accessibility tools and performance tooling;
- research external sources when needed to verify the public paper;
- write the audit document named below.

You may not:
- change application/source/configuration files;
- implement fixes;
- commit, push or deploy;
- modify GitHub issues or project state;
- rewrite existing audits or backlog files;
- create additional work-product files beyond the audit document unless a tool necessarily emits temporary screenshots/traces/results used as audit evidence.

Preserve existing uncommitted work. If running a command could mutate tracked files, generated assets or dependencies, inspect what it does first and use a non-mutating alternative where practical.

The only intentional repository write is:

`docs/audits/SITE_IMPROVEMENT_2026-10-13.md`

Temporary audit artifacts may remain outside tracked source or in an already-established ignored audit-artifact location if the repository defines one. Do not invent a new evidence-storage convention without need.

Keep screenshots, traces and measurement output in your session scratchpad, outside the repository, and cite them by path. `npm run check` and builds write ignored output; that is expected.

---

## Goal

Determine the **highest-value next work for the website**, not merely everything that could be improved.

The finished audit must let the owner answer, without rereading the whole repository or site:

1. What is actually broken or materially weak now?
2. Which findings are new versus already known?
3. What should be done next, in what order, and why?
4. Which work should explicitly wait?
5. Which locked area, if any, is closest to deserving production exposure?
6. Which conclusions are verified, which are judgment calls, and which remain unknown?

Do not optimize for finding many issues. Optimize for finding evidence that changes priorities.

---

## What "improve" means

Use this priority order, but do **not** treat it as a mechanical severity score. A finding ranks highly only when its impact is material to the actual site and the proposed work is justified relative to alternatives.

### P0. Public breakage or serious visitor harm
Errors, failed loads, layout breakage, unusable interactions, dead destinations, inaccessible essential controls, serious metadata/share failures, or failure modes that make either public experience visibly broken.

### P1. Failure of the site's intended effect
Anything that materially weakens the site's purpose for Will (Weibao) Chen: a personal site intended to leave a strong, specific impression on visitors arriving from LinkedIn, a resume or a shared paper link.

For the front page, this means whether its intended spectacle feels deliberate, coherent and trustworthy, **not** whether it follows conventional landing-page conversion advice.

For the paper, this means whether it feels calm, credible, legible and rigorous enough to be shared as serious work.

### P2. Real-device performance, accessibility and resilience
Problems that substantially affect mid-tier phones, weak GPUs, reduced-motion users, keyboard users, assistive-technology users, WebGL failure paths or unreliable networks.

Accessibility problems that prevent use can rise to P0/P1; do not automatically place all accessibility findings below visual issues.

### P3. Near-term maintainability
Repository or architectural problems likely to waste meaningful time, create regressions, or obstruct the next month of work.

Pure cleanup with no credible near-term consequence should not outrank visible or user-affecting work.

### Ranking rule

For every candidate that might enter the final top five, consider:

- **impact**: who is affected and how badly;
- **reach**: production/public, likely-to-unlock soon, or dormant;
- **confidence**: verified evidence versus inference;
- **effort**: S / M / L;
- **dependency value**: whether it unblocks several other improvements;
- **regression/risk reduction**;
- **distinctiveness value**: whether it strengthens or damages the intended identity of the site.

Do not pretend these factors reduce to an exact mathematical truth. Use them to make tradeoffs explicit.

A broad aesthetic preference, speculative cleanup or dormant-page issue should not outrank a verified public problem merely because it is easier to describe.

---

## Supplied context: verify consequential repository-dependent claims

The following is supplied context, not a substitute for inspecting the live repository.

- `mythcorp-gen2` is described as a Next.js 15 App Router / React 19 / TypeScript / Tailwind v4 site using react-three-fiber and GSAP, deployed to Cloudflare Workers through OpenNext.
- Production is described as gated by `src/siteLock.ts`.
- The public production surface is described as:
  - `/`, the holding installation;
  - `/wc/papers/ai-cybercrime`, an interactive long-form paper styled in the spirit of AI 2027.
- Other routes described as present but production-locked include `/experience`, `/wc`, walkthroughs, `/og`, `/about`, a `/contact` stub, `/fmhy`, and an image-upload host.
- Local preview is described as unlockable with `NEXT_PUBLIC_SITE_UNLOCK=1`.
- The front page is described as a WebGL installation with four rooms, live readout, sun-angle-driven sky, LinkedIn/cat interaction, rotating scenes and `/?banner=linkedin`.
- Recent work is described as including an AI-tells audit, front-page phone-performance audit, phone-header fixes, CI using `npm run check`, a lighter 3D model and a committed share card.

Before relying on any consequential detail above, confirm it from the current repository, production behavior or project documentation. If reality differs, record the discrepancy rather than silently adapting the supplied story.

---

## Protected decisions

These are owner decisions. **Do not re-litigate them as findings or quietly optimize them away.**

- The front page's job is **awe, not clarity or conversion**.
- Its dense layered effects, including the ghosted contact backdrop, readout/contact erosion, passive title cycle, halo and cursor echo, stay. Judge whether the effects feel choreographed as one composition, not whether the page would be cleaner with them removed.
- Interior pages and the paper intentionally take the opposite posture: calm, legible and rigorous.
- The contact email is real.
- The `"67"` phone number is an intentional joke.
- The site lock is intentional. Locked pages are not production bugs. You may recommend what to unlock next and define prerequisites for doing so.
- Use theme tokens only.
- No new fonts.
- No new hues.
- No em dashes anywhere.
- Existing project rules in `CLAUDE.md`, `DESIGN.md` and `MAP.md` remain authoritative where they impose additional constraints.

If evidence gives a strong reason to reconsider a protected decision, put that argument only in **Owner decisions**, clearly labeled as a proposed reconsideration. Do not disguise it as an ordinary defect.

---

## Phase 0. Establish the current truth cheaply

Do this before browser-heavy or research-heavy work.

### 0.1 Read governing material

Read first, in this order:

1. `CLAUDE.md`
2. `DESIGN.md`
3. `MAP.md`

Then read:

- `README.md`
- recent/relevant sections of `STATUS.md`
- `BACKLOG.md`
- `docs/audits/AI_TELLS_2026-10-07.md`
- `docs/audits/FRONT_PAGE_PERF_2026-10-08.md`

Also inspect any directly referenced owner documents needed to understand current route ownership, testing or audit conventions.

Extract, before auditing:
- current hard constraints;
- intended public surface;
- already-closed findings;
- still-open findings;
- existing performance baselines;
- commands/tests the repository itself treats as authoritative.

Do not re-report a prior issue as new merely because you can reproduce its description. Determine whether it is:
- fixed/closed;
- still open and independently reconfirmed;
- superseded;
- unverifiable.

### 0.2 Establish repository state

Record enough state to make the audit reproducible:
- current branch and HEAD;
- whether the tree is dirty;
- relevant runtime/package-manager versions if the repository specifies them;
- whether the expected public and locked routes still exist;
- whether the documented unlock mechanism still behaves as described.

Do not alter or clean a dirty tree.

### 0.3 Run cheapest authoritative health checks

Identify the repository-defined commands before running them.

At minimum, where supported by current project instructions, inspect/run:
- `npm run check`;
- the existing smoke suite or its documented equivalent.

Known from `STATUS.md` (2026-10-09), verify it is still current: CI blocks only on `npm run check`; its Playwright run is informational because GPU-less runners flake on WebGL timing. The local pre-ship e2e gate is `npm run build`, then `PLAYWRIGHT_SERVER=start PLAYWRIGHT_CHANNEL=chrome npm run test:smoke`. Timing specs have failed under heavy machine load and passed on rerun, so rerun a failing spec before reporting it as a defect, and record the load if you can.

Do not invent a new test regime if existing project checks already answer the question.

If a check fails:
- capture the failure;
- determine whether it reflects current source, environment/tooling, or unrelated pre-existing dirty work;
- do not attempt to fix it.

### Phase 0 gate

Before proceeding to expensive audits, you should know:
- what production is intended to expose;
- what previous audits already established;
- whether the baseline project checks pass;
- what evidence could still change the priority order.

If a major foundational failure already clearly dominates the next-work decision, continue enough of the later passes to bound its impact and identify any other independent P0/P1 issue, but do not spend hours exhaustively cataloguing low-value findings.

---

## Phase 1. Public production smoke and failure modes

Audit the actual production versions of:

- `/`
- `/wc/papers/ai-cybercrime`

Use at least:
- desktop around `1440x900`;
- phone around `390x844`;
- both supported light/dark schemes where the page meaningfully varies by scheme.

Check first for high-value failures:

- initial load and hydration;
- visible runtime errors;
- browser console errors that correspond to real defects;
- failed/blocked network requests;
- broken images/media/assets;
- dead or incorrect destinations;
- gross layout overflow/occlusion;
- orientation/resizing failures where relevant;
- share/title/description/canonical/social metadata;
- the committed share-card behavior;
- `/?banner=linkedin` only if the current repository confirms it remains an owned/exported surface;
- reduced-motion behavior;
- keyboard-only operation;
- WebGL-disabled/unavailable behavior;
- obvious degraded-network resilience.

Distinguish:
- browser/tool noise;
- benign expected warnings;
- genuine visitor-visible failures.

Do not generate findings from console text alone when it has no observable consequence unless it indicates a credible resilience or maintenance risk.

---

## Phase 2. Accessibility and non-default use

Perform focused accessibility checks on both public pages.

At minimum inspect:

- logical keyboard/focus order;
- visible focus;
- accessible names/roles/states for actionable controls;
- traps or unreachable interactions;
- contrast where text or control meaning depends on it;
- reduced-motion behavior;
- meaningful structure for the paper;
- what assistive technology receives from the installation when the visual/WebGL experience cannot itself be perceived.

Use automated tooling as a detector, not as the conclusion. Verify material issues manually.

For the front-page installation, judge whether the nonvisual experience provides a coherent usable representation of what matters. Do **not** require a screen reader to reproduce decorative spectacle.

For every serious accessibility finding, state the actual lost task, missing information or barrier rather than merely quoting a rule.

---

## Phase 3. Performance and resilience

Only after confirming the current page and prior baseline.

Use the 2026-10-08 front-page performance audit to determine:
- what device/network methodology it used;
- which measurements are meaningfully comparable;
- which previously identified problems were supposed to be fixed.

Reproduce comparable measurements where practical on a throttled mid-tier-phone profile.

Separate:
- directly comparable regressions/improvements;
- new measurements using a different method;
- subjective smoothness observations.

Inspect the causes only deeply enough to recommend the next work. Do not perform a full optimization project.

Pay particular attention to:
- initial transfer/startup cost;
- CPU/main-thread pressure;
- GPU/WebGL pressure;
- interaction smoothness;
- long tasks;
- memory or repeated resource creation where observable;
- weak-GPU/WebGL failure behavior.

Do not declare a regression from unlike measurements.

---

## Phase 4. Paper integrity and reading experience

Audit `/wc/papers/ai-cybercrime` as both:
1. a public reading experience;
2. a piece of work the owner may send directly to another person.

### Reading experience

Check:
- phone layout and typography;
- figures/tables/media;
- anchors/navigation if present;
- citation usability;
- overflow;
- interaction behavior;
- focus/keyboard behavior relevant to the paper;
- whether decorative treatment interferes with rigorous reading.

### Claim and citation integrity

Do **not** turn this into an unbounded scholarly peer review.

First perform cheap structural checks:
- citations resolve;
- references correspond to claims;
- figures have understandable provenance/captions where expected;
- links are not dead or obviously mismatched;
- obvious internal contradictions or unsupported high-stakes claims.

Then externally verify only claims whose failure would materially damage credibility, especially:
- central thesis/supporting claims;
- surprising quantitative claims;
- claims prominently represented by figures;
- factual assertions likely to have changed since their cited source;
- citations that appear not to support the associated statement.

Record the scope sampled. Do not imply that every sentence was externally verified unless it was.

For external sources, prefer primary/authoritative material where available.

---

## Phase 5. Locked-surface readiness

Do not treat all locked routes as equal and do not exhaustively polish-audit dormant experiments.

First inventory the current locked surfaces from repository routing and `siteLock` behavior.

Then classify each meaningful locked surface into one of:

- **Near-term candidate**: plausible reason to expose soon.
- **Needs substantial work**: potentially useful, but not close.
- **Experiment/archive**: no current reason to spend production-readiness effort.
- **Unknown intent**: owner decision required.

Only perform detailed browser inspection of:
- the strongest near-term candidates;
- surfaces that project docs indicate are actively moving toward release;
- locked routes that share code with production and therefore can currently cause regressions.

For each plausible unlock candidate, state:
- intended visitor value;
- current readiness;
- blocking defects;
- dependencies;
- whether unlocking it would strengthen or dilute the current site's purpose;
- an observable "ready to unlock when..." gate.

Do not reward a page merely for being closest to technically functional. Strategic fit matters.

Do not author or redesign `/og/*`; treat those routes according to current project ownership/rules.

---

## Phase 6. Targeted repository health

Use the previous phases to guide repo inspection rather than performing generic cleanup archaeology.

Check:

- current `npm run check` / smoke results from Phase 0;
- whether BACKLOG entries relevant to current public or near-term work are stale, duplicated or already shipped;
- open GitHub issues versus current repository reality, if browser/repository access permits;
- dead/archived code **only where it is still imported, bundled, routed, tested, or confusing current ownership**;
- obvious ownership/structure problems likely to impede the next month of work.

Do not recommend removing dormant code merely because it exists.

Do not convert stylistic preferences into maintainability findings without showing their cost.

---

## Evidence discipline

Maintain a clear distinction among:

### Verified
Observed directly in production, local execution, current source, command output, measurement or authoritative external source.

### Inference / judgment
A reasoned product, design or engineering conclusion from verified facts.

### Hypothesis
Plausible but not adequately verified.

A hypothesis may appear in the report, but it cannot silently carry the same confidence as a verified defect.

For repository-dependent statements, cite current `file:line` evidence where practical.

For runtime findings, provide reproducible conditions and the relevant evidence artifact/measurement.

For external factual verification, cite the source sufficiently for another person to find it.

Do not manufacture screenshot paths, line numbers, measurements or command results.

---

## Deduplication against previous work

Before promoting any issue to a finding, determine whether the prior audits already covered it.

Label inherited findings as one of:

- **Reconfirmed open**
- **Regressed**
- **Partially fixed**
- **Superseded**

Do not spend report space restating closed findings except where necessary to explain current evidence or priority movement.

A useful result can be "the previous concern is now fixed." That should generally appear in validation/coverage rather than as a new defect.

---

## Priority synthesis

After all passes, build the candidate ranking from the evidence.

The final top-five list is a **work sequence**, not merely five independently sorted bugs.

Account for dependencies. For example, if item 2 only makes sense after item 1, say so; do not disguise dependency order as independent priority.

For each top-five item answer:

- What outcome changes?
- Who benefits?
- What evidence makes this worth doing now?
- Why does it outrank the strongest omitted alternative?
- What does it depend on?
- What size is it: S / M / L?
- What observable condition would let the owner say it is done?

If fewer than five actions are well-supported, list fewer than five. Do not fill slots with weak work.

Also identify at least the strongest **deferred** candidate and explain why it should wait. This guards against a top five with no visible tradeoff.

---

## Required output

Write:

`docs/audits/SITE_IMPROVEMENT_2026-10-13.md`

The document must stand on its own.

Use the following structure.

# Site improvement audit, 2026-10-13

## 1. Verdict

One concise paragraph stating:
- overall state;
- most important verified problem or opportunity;
- the recommended next move;
- whether anything found should block further unlocks/releases.

## 2. Scope and baseline

Record:
- branch / HEAD;
- dirty-tree status without exposing irrelevant local content;
- public surfaces actually verified;
- local locked surfaces inspected;
- governing docs/audits used;
- checks run and their result;
- important differences between supplied context and current reality.

## 3. Previous-audit reconciliation

A compact table of materially relevant prior findings:

| Prior item | Current state | Evidence | Effect on this audit |
|---|---|---|---|

Include fixed items only where validating the fix materially matters.

## 4. Findings

Assign `F1`, `F2`, ... in **priority order**, not discovery order.

For every finding include:

- **Status:** Verified / Inference / Hypothesis
- **Area:** route, component or file
- **Audience:** who encounters it
- **Observed consequence:** what actually happens
- **Evidence:** screenshot/artifact, measurement, command output, URL condition or `file:line`
- **Priority:** P0 / P1 / P2 / P3
- **Confidence:** High / Medium / Low
- **Effort:** S / M / L
- **Dependency:** if any
- **Recommended response:** specific enough to act on, without implementing it
- **Acceptance:** observable condition proving the problem is resolved

Do not split one root cause into multiple findings merely to inflate the count.

## 5. Public-surface coverage

A compact matrix showing what was actually checked for each public page, including:

- desktop;
- phone;
- light/dark where relevant;
- keyboard;
- reduced motion;
- accessibility semantics;
- WebGL failure/degradation where relevant;
- console/network;
- metadata/share;
- performance where measured.

Use `checked / issue / not applicable / not verified` or another equally explicit notation.

This matrix is a completeness record, not a place to repeat full findings.

## 6. Paper verification scope

State:
- what citation/link checks were performed;
- which important claims/figures were externally sampled;
- what was not fact-checked;
- any credibility-affecting findings.

Do not imply exhaustive factual verification unless it actually occurred.

## 7. Locked-surface readiness

Provide a compact table:

| Surface | Classification | Visitor value | Main blockers | Unlock gate |
|---|---|---|---|---|

Then state which locked surface, if any, deserves the next unlock-focused work and why.

"None yet" is valid.

## 8. Ranked next work

At most five items.

For each include:
- linked finding(s);
- outcome;
- why now;
- dependencies/order;
- S/M/L effort;
- observable completion gate;
- why it beats the strongest competing work.

This section must be sufficient for the owner to choose the next task without reconstructing the audit.

## 9. Deliberately deferred

Name the strongest work that did **not** make the top list and explain why it should wait.

Include low-value cleanup themes if they were consciously excluded.

## 10. Owner decisions

Only decisions that genuinely require owner judgment.

For each:

**Question:** ...
**Why it changes the roadmap:** ...
**Recommended default:** ...

Do not turn ordinary engineering decisions into owner questions.

## 11. Not checked / uncertainty

Explicitly name:
- inaccessible environments;
- tools or modes not available;
- claims not externally verified;
- measurements that could not be reproduced comparably;
- hypotheses still needing evidence.

Explain what evidence would resolve each important unknown.

---

## Completion gate

The audit is complete only when another person can read **this document alone** and determine:

- what public behavior was tested;
- what repository baseline was established;
- what prior findings were reconciled rather than rediscovered;
- which findings are verified versus judgment/hypothesis;
- where the evidence is;
- how the locked surfaces compare;
- the paper-verification depth;
- the top next actions and their dependency order;
- why those actions outrank credible alternatives;
- what "done" means for each recommended action;
- what remains unknown.

Before finishing, check the audit itself for:
- unsupported claims;
- duplicated findings;
- recommendations that violate protected decisions;
- accidental implementation work;
- em dashes.

Do not implement any recommendation.
