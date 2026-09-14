# Upload feature UI redesign plan

A prioritized redesign of `/upload` and `/upload/admin` that fits the MYTHCORP house style. The lens throughout: this is a fictional megacorp's internal asset-ingest terminal, not a SaaS drop zone. Diegetic beats decorative. Every pattern transforms across cyberpunk / luxury / paper via existing tokens.

## Security constraints (do not weaken)
- Upload key stays in `localStorage` + `Authorization: Bearer` header only. Never in a URL query string. A future shareable prefill link puts the key in the fragment (`#key=`), which browsers never send to the server; read it from `location.hash`, then strip it.
- Uploaded images stay public-by-link. No "private" affordance that implies access control we do not have. Copy says "public link".
- `accept` stays `image/png,image/jpeg,image/gif,image/webp`. No SVG ever. The server-side magic-byte allowlist is the real gate; `accept` is only a hint.

## Patterns worth stealing (each with its soul note)
1. Paste-to-upload (Ctrl+V anywhere). Screenshot to link in one motion, the biggest "respects my time" moment a host has.
2. Three drag states (idle / file-hovering / wrong-type-hovering). The surface reacts like it has opinions about what you feed it.
3. Instant local thumbnail preview via `URL.createObjectURL`. Proof the machine caught your file the instant you let go.
4. Upload progress with bytes + speed + a bar. A real readout "measured by the simulation", not a spinner. Fits the diegetic rule.
5. One-click copy with a satisfying, self-resetting confirmation. The tiny dopamine tick that brings people back. Current copy state never resets; fix that.
6. Terminal/monospace result block with link, dimensions, size. Reads like console output from the ingest daemon.
7. Gallery grid with hover (thumbnail, meta overlay, quick copy + delete). Your uploads become a place you visit, not a list you scroll.
8. Empty-state personality. The room feels authored even when empty.
9. Keyboard shortcuts (/ focuses key, c copies last link, Enter opens picker). Signals a tool for someone who lives here.
10. Discord/OpenGraph embed correctness. The link looks intentional where these links are actually spent.
11. Terminal easter egg (curl one-liner / boot-style readout). Rewards the curious, ties into the site's fake-terminal fiction.

## Phase 1 - Quick wins
- **Split `upload/page.tsx` first** (it will blow past 250 lines). Into: `page.tsx` (thin shell), `DropConsole.tsx` (drag + paste + preview + orchestration), `UploadResult.tsx` (result readout + copy), `useUpload.ts` (upload logic, status type, progress).
- **Paste-to-upload**: `window` paste listener, pull first `image/*` off `clipboardData.items`, guard the type, call `upload(file)`. Hint line "or paste a screenshot (Ctrl V)".
- **Three drag states**: replace the `dragging` boolean with `'idle' | 'accept' | 'reject'`, inspect `dataTransfer.items[0].type` on dragover. accept -> `--accent`; reject -> `--accent-warm`, copy flips to "not an image I can take."
- **Instant thumbnail**: `createObjectURL` into an `<img>`, `revokeObjectURL` on unmount/next file. Dim it during upload with the bar over it.
- **Progress with speed**: swap `fetch` for `XMLHttpRequest` so `upload.onprogress` gives loaded/total; render `INGEST 4.2 / 25.0 MB 1.8 MB/s [######....]` in mono.
- **Copy feedback that resets**: on copy, set true then `setTimeout` false after ~1400ms.
- **Honest result readout**: mono block with the public link (click-to-select), plus `PNG - 1920x1080 - 240 KB`. Copy stays "public link".

## Phase 2 - Personal gallery grid (admin)
- Split `ObjectsPanel` into `ObjectsPanel.tsx` (fetch + usage meter + layout), `ObjectTile.tsx` (one card: thumbnail via public URL, hover overlay, copy + delete), `useObjects.ts` (fetch/delete/mb helper).
- Responsive grid (2 up mobile, 4 up desktop) of `.themed-surface` tiles, `aspect-square`, meta overlay fades in on hover. Interactive surfaces already lift/glow/float per theme for free.
- Usage meter upgraded to a mono readout; fill shifts to `--accent-warm` past ~80%.
- Delete confirmation: inline two-step ("Delete? / Cancel" for ~2s), no modal.
- Empty state with warmth: e.g. "The vault is empty. Feed it a screenshot." Never snarky.

## Phase 3 - Delight
- Motion timeline on successful upload (thumbnail settles, result tracks in from below, link flashes once). GSAP with `--motion-ease`; reduced-motion collapses to opacity fade.
- Keyboard shortcuts via a `useUploadHotkeys` hook (/ focus, c copy, Enter picker) with a faint hint row.
- Terminal-mode easter egg (backtick toggle) that prints the curl equivalent of the last upload with the key HARD-REDACTED (`Bearer mc_****`). Teaches the real API and reinforces "the key never travels in the open." Richly skinned only in cyberpunk.
- OpenGraph on the object route: `og:image`, width/height, title, and `theme-color` from `--accent` so Discord renders a clean large card.

## Guardrails (run before each phase ships)
- Zero hex/rgb in new components; tokens and `.themed-*` only.
- Looks deliberately different in cyberpunk, luxury, paper (check all three).
- No em-dashes. No fourth hue; `--accent-warm` is the only warning color.
- Every animation respects `prefers-reduced-motion`.
- Files under ~250 lines; split per the `src/app/components/landing/` folder pattern.
- `npm run check` green before commit. Update MAP.md for new routes. Note the XHR-for-progress decision in STATUS.md.

## Build order
1.6 and 1.3 (tiny, immediate feel) -> 1.1 split -> 1.2 / 1.4 / 1.5 / 1.7 -> Phase 2 grid -> Phase 3 delight. Ship Phase 1 as one PR, Phase 2 as another, Phase 3 piecemeal.

## Sources
Zipline (diced/zipline), Chibisafe, catbox/litterbox, 0x0.st, e-z.host, imgur, and Discord OpenGraph embed docs.
