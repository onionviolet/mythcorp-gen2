# STATUS

*Current state only. Replace a line when it changes; do not append dated sections. Session history goes to the top of [docs/STATUS_LOG.md](docs/STATUS_LOG.md) under a dated heading. Lasting decisions go in DESIGN.md (taste) or MAP.md (code). `npm run check` fails if this file passes 120 lines or gains a dated `##` heading.*

## Live site

- The site lock is active: `/` serves the plain holding installation, and only `LOCKED_OPEN_PATHS`, the upload links `/a/<id>` and `/d/<token>`, `/api/*` and static files stay reachable (`src/siteLock.ts`). New uploads are closed (`/api/upload` answers 410); existing image, view and delete links work. Lifting the lock is a separate decision for Weibao.
- Deploys go to Cloudflare Workers through `npm run deploy`. Deploying needs Weibao's yes.
- `npm run check` (lint, text policy, Next build, TypeScript) is the commit gate. The e2e suite on the production build is informational.

## Branch

Work since 2026-10-26 sits on `codex/checkpoint-research-2026-10-26`: the October 13 to 26 audits, scouting, the projects-story proposal and the [ideaboard](docs/plans/IDEABOARD_2026-10-26.md). Existing site code is unchanged by that research.

## Open decisions

1. **Projects on the site.** Recommended, not selected: privately compare a small object cabinet against a direct Gandalf project story with identical content, ordinary links and the clarity, access and load gates in [the archive audit](docs/audits/INTERACTIVE_PROJECT_ARCHIVE_2026-10-26.md). Projects are shown directly, without company role-play. OOPS can be hosted without `private_packs/`; Province War waits until its third-party assets are separated ([projects story](docs/plans/PROJECTS_STORY_2026-10-22.md)).
2. **Which OOPS feature or media is public-safe** to show.
3. **Whether a projects page opens past the lock**, and when.
4. **Fourth-theme flagship**: still wanted or not ([plan](docs/plans/FLAGSHIP_FOURTH_THEME.md)).

## Next work

The triaged queue is [BACKLOG.md](BACKLOG.md). The front of it today:

1. Retest the plain-canvas backing-store release on the original affected Chrome profile; a local build cannot close it.
2. Reconcile open GitHub Issues against shipped work.
3. Mobile, accessibility and performance passes on `/`, `/experience` and `/wc/papers/ai-cybercrime`.

## Known gaps

- `/og/orbit` breaks on phones.
- No low-power fallback for the 3D experience yet.
- Mobile behavior has not been checked on a real phone.

## Decisions worth remembering

- The theme system is four files; no `next-themes`. See `/wc/learn/theme-system`.
- `/wc/learn` interactivity uses hand-built primitives (DemoPanel, TokenPlayground, MiniStarField, FlowStepper), not Sandpack, so demos drive the real components.
- TokenPlayground sets CSS variables inline, tracks each one, and removes exactly those on reset, unmount and theme change. It writes no storage.
- `STARS_PER_UNIT = 1200` and `MAX_STARS = 12000` in Simulation. Benchmark before raising them.
- `HelpDot` lives in `layout.tsx`, not per page.
- FMHY: only `_data/backup-sites.json` remains, and `/fmhy` is a backup-sites directory.
- Unfinished ideas live in `/og`, soft-hidden from search but reachable by URL.

## Updating this file

- At the end of a session, edit the sections above so they are true, then add one dated entry to the top of `docs/STATUS_LOG.md` if the session needs a record.
- Open decisions and next work hold at most five items each.
- Link to the owner instead of restating it.
