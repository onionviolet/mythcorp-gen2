# Upload feature, Phase 2 + 3 brief

Executor-agnostic (Codex or Claude). Whoever runs this OWNS the upload lane for
the duration: `src/app/upload/**`, `src/app/api/**`, `src/lib/upload/**`, and the
new view route below. Do not run two agents on these files at once.

Read first: `DESIGN.md`, `CLAUDE.md`, `MAP.md`, and `UPLOAD_UI_PLAN.md` (the
detailed Phase 1/2 plan). The feature is live and deployed; do not break it.

## Hard constraints (security + house style, do not weaken)
- Upload key lives in localStorage + `Authorization: Bearer` only. NEVER in a URL
  query string. A prefill link may use the fragment (`#key=`), read from
  `location.hash`, then strip it.
- Images are public-by-link. No "private" affordance we cannot enforce.
- Allowlist stays png/jpeg/gif/webp. No SVG ever. Server-side magic-byte sniff is
  the real gate.
- Theme tokens only (no hex/rgb in components), no em-dashes anywhere, files under
  ~250 lines (split into a feature folder if one climbs), every component
  transforms across cyberpunk / luxury / paper. No glow outside cyberpunk/luxury.
- `npm run check` green before every commit (build + tsc). Commit per task by
  explicit path (no `git add -A`). Wrangler is pinned at 4.113.0; do not revert.

---

## PHASE 2, upload UI polish

Source of truth: `UPLOAD_UI_PLAN.md`. Ship as two commits.

### 2a, the drop console (highest value)
Split `src/app/upload/page.tsx` before it outgrows 250 lines:
- `page.tsx` stays a thin shell (header, key input, layout).
- `upload/DropConsole.tsx`, drag zone + paste + preview + orchestration.
- `upload/UploadResult.tsx`, the result readout + copy.
- `upload/useUpload.ts`, the upload logic, status type, progress state.

Then add, all token-only:
- Paste-to-upload: a window `paste` listener that pulls the first `image/*` off
  `clipboardData.items`, guards the type, calls `upload(file)`. Do not fire when
  pasting into the key input.
- Three drag states (`'idle' | 'accept' | 'reject'`) from
  `dataTransfer.items[0].type`; accept uses `--accent`, reject uses `--accent-warm`.
- Instant thumbnail via `URL.createObjectURL`, `revokeObjectURL` on unmount/next.
- Determinate progress with speed: swap `fetch` for `XMLHttpRequest` so
  `upload.onprogress` gives loaded/total; render a mono readout + bar.
- Copy feedback that resets (setTimeout back to idle ~1400ms).
- Honest result readout: mono block, the public link (click-to-select) plus
  `PNG - 1920x1080 - 240 KB`. Label copy "public link".

Acceptance: paste a screenshot uploads it; drag states visibly differ; thumbnail
shows instantly; progress is determinate; copy resets; all three themes checked.

### 2b, the admin gallery grid
Turn `admin/ObjectsPanel.tsx` from a list into a grid. Split into
`ObjectsPanel.tsx` (fetch + usage meter + layout), `admin/ObjectTile.tsx` (one
card: thumbnail via the public URL, hover meta overlay, copy + inline two-step
delete), `admin/useObjects.ts`. Usage meter becomes a mono readout, fill shifts
to `--accent-warm` past ~80%. Warm empty state, never snarky.

---

## PHASE 3, Discord-native rich embeds (the differentiator)

Today a direct R2 link embeds inline in Discord (works). A RICH embed (colored
sidebar, title, description) needs Discord to read OpenGraph tags from an HTML
page. So we add a per-image view page and a small editor.

### 3a, the public view route
New route `src/app/i/[key]/page.tsx` (server component):
- Read the object record from KV by `key` (via `getCloudflareContext`). If it does
  not exist, return `notFound()` (404, do not leak).
- Emit OG tags with Next's `generateMetadata`, NOT hand-written `<meta>` strings.
  SECURITY: the Metadata API escapes values for you; hand-concatenating user text
  into HTML is a stored-XSS hole. Use the API so title/description are safe.
- `openGraph.images` and `twitter.image` MUST be pinned to `publicUrl(key)` from
  `src/lib/upload/r2.ts`. Never accept a user-supplied image URL (SSRF / abuse).
- `twitter.card = 'summary_large_image'` so the big card renders.
- The page body shows the image (`<img src={publicUrl(key)}>`) and the direct link.
- Return the view URL from `/api/upload` too, e.g. `{ url, viewUrl }`, so the
  result card can offer "direct link" and "rich embed link".

### 3b, per-image embed config
- Extend `ObjectRecord` in `src/lib/upload/objects.ts` with optional
  `embed?: { title?: string; description?: string; accent?: string }`.
- `theme-color` (the Discord sidebar accent) comes from `embed.accent`. SECURITY:
  validate `accent` with a strict `^#[0-9a-fA-F]{6}$` on write AND before emitting
  it; reject anything else. An unvalidated color string is an injection vector.
- Add an admin endpoint to set it: `PATCH /api/admin/objects` (admin-gated, same
  `verifyAdmin`) that updates the KV record's `embed` fields. Trim/limit lengths
  (title <= 120, description <= 300).

### 3c, the editor UI
In `ObjectTile` (or a small modal), an admin form: title, description, accent
color. Saves via the PATCH endpoint, then re-fetches. Keep it token-only and
under the line ceiling.

Acceptance: pasting an `/i/<key>` link in Discord shows a large-image card with
the set title/description and accent sidebar; unknown key 404s; a non-hex accent
is rejected; XSS attempt in title renders as inert text, not markup; all three
themes checked; `npm run check` green.

### Out of scope here (infra note, not code)
Custom domains: `mythcorp.dev` is in a different Cloudflare account (6f1987) than
the worker (ba6ba228), so a Workers custom domain cannot attach directly. An R2
custom domain for the IMAGES (e.g. `i.mythcorp.dev`) IS possible since the bucket
is in 6f1987. Decide later; the embed feature works on the workers.dev URL now.

## Suggested commits
```
feat(upload): drop console with paste-to-upload, preview, progress
feat(upload): admin gallery grid with per-tile actions
feat(upload): per-image view route with escaped OpenGraph embeds
feat(upload): admin embed editor (title, description, validated accent)
```

## Update on done
MAP.md routes table (`/i/[key]`), the "How to add X" note if relevant, and
STATUS.md. Delete the stale MAP EnterBanner row while you are in there.
