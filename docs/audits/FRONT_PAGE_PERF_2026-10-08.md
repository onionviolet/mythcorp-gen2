# Front page performance on mid-tier phones, 2026-10-08

Question: does the Installation hold up on a mid-tier phone, especially in the
first few seconds, which carry most of the awe?

Short answer: the main thread is fine; the GPU and the network are not.
Under 4x CPU throttling no scene drops a frame on the main thread once loaded,
and the fixes below cut Signal's main-thread time by about a quarter. What a
mid-tier phone will feel is (1) the specimen arriving about 9 seconds after
navigation on slow 4G, because `spectre.glb` carries a 1 MB texture, and
(2) fill rate: three or four full-DPR canvases stacked on top of each other.
The halo `Laser` is the single most expensive layer and sits in a file this
track could not touch.

## Method

- Production build (`npm run build`, `next start -p 3203`) of this worktree,
  site locked as in production, so `/` is the held Installation.
- Headless Chrome via Playwright, 390x844 viewport, `deviceScaleFactor: 3`,
  `isMobile`, `hasTouch`, Android user agent, dark scheme, `?sun=noon`.
- CDP `Emulation.setCPUThrottlingRate` 4x on every pass.
- Load pass: cold context, CDP slow 4G (150 ms RTT, 1.6 Mbps down,
  750 kbps up). First meaningful frame is polled every 100 ms from the page:
  the specimen counts as drawn when more than 1% of a 48x48 downsample of its
  canvas is non-transparent (WebGL contexts forced to `preserveDrawingBuffer`
  by an init script, load pass only). The title counts as drawn when the
  dust canvas is non-empty (Signal), when the field canvas has message pixels
  (Suspension), or when the solid `[data-solid-label]` line has a box (Drift,
  Surface). The CSS entrance fade (240 ms delay, 900 ms) comes on top for the
  specimen. JS bytes are CDP `encodedDataLength` of every Script response.
- Runtime pass: no network throttling. Boot window = rAF deltas for the first
  7 s after `domcontentloaded`. Idle = 10 s of rAF deltas after that. Touch =
  5 s: a 2.5 s circular drag via `Input.dispatchTouchEvent`, then a 2.5 s
  still hold that triggers the gather. Long tasks via a buffered
  `PerformanceObserver`. Main-thread busy = delta of CDP `TaskDuration` over
  wall time (script = `ScriptDuration`).
- Hotspots: CDP `Profiler` (200 us sampling) over the touch window of the
  worst main-thread scene (Signal), and over the boot window of Suspension.
- Two GPU back ends, reported separately:
  - **Metal** (`--use-angle=metal`, Apple M5): the GPU is far stronger than a
    phone's, so this isolates main-thread cost. With 4x throttling it is the
    CPU-side proxy for a mid-tier phone.
  - **SwiftShader** (`--use-angle=swiftshader`): software GL on the CPU, not
    affected by the CPU throttle. Absolute numbers are pessimistic, often by
    an order of magnitude; use them only to rank scenes and settings by fill
    cost. Pixel read-back does not work under SwiftShader, so load timings
    come from the Metal pass.

Scripts and raw JSON: the perf track's scratch folder
(`measure.mjs`, `attrib.mjs`, `govcheck.mjs`, `results-*.json`,
`*.cpuprofile`). Not in the repo.

## Per-scene results, before fixes

Load pass (Metal, 4x CPU, slow 4G, cold cache). Times are ms from navigation
start, median of 3 runs.

| Scene | Specimen render | First paint | Title drawn | Specimen drawn | TBT first 10 s | Long tasks first 10 s | JS transferred | Total transferred |
|---|---|---|---|---|---|---|---|---|
| Signal | ascii + dust title (40k particles) | 4,088 | 4,963 | 9,107 | 491 | 8 | 523 KB | 1,774 KB |
| Suspension | particle (26k) + field words | 4,100 | 3,952 (1 run) | 9,330 | 573 | 7 | 523 KB | 1,733 KB |
| Drift | swarm (3.2k) + solid words + fog | 4,088 | 4,092 | 9,121 | 476 | 7 | 529 KB | 1,738 KB |
| Surface | liquid + solid words | 3,948 | 3,952 | 9,149 | 263 | 6 | 536 KB | 1,746 KB |

Runtime, Metal, 4x CPU. These rows come from the interleaved A/B run
(before, after, before, after, two runs each), because the machine was
shared with other tracks and an earlier sequential baseline read up to twice
as busy. Busy = main-thread task time as a share of wall time.

| Scene | Boot 0-7 s fps | Boot worst frame | Boot TBT | Idle fps | Idle busy | Touch fps | Touch busy |
|---|---|---|---|---|---|---|---|
| Signal | 55.7 | 167-183 ms | 151-175 | 60 | 9% | 60 | 27-28% |
| Suspension | 43-56 | 167-200 ms | 209-321 | 60 | 12-17% | 60 | 20-22% |
| Drift | 56 | 167-183 ms | 169-200 | 60 | 15-16% | 60 | 28-30% |
| Surface | 55-56 | 167 ms | 177-186 | 60 | 15-16% | 60 | 28-30% |

Runtime, SwiftShader, 4x CPU (relative GPU cost, one run).

| Scene | Boot fps | Idle fps | Idle p50 frame | Touch fps |
|---|---|---|---|---|
| Signal | 6.3 | 13.6 | 67 ms | 12.6 |
| Suspension | 15.0 | 21.5 | 50 ms | 20.4 |
| Drift | 10.0 | 14.0 | 67 ms | 13.4 |
| Surface | 6.3 | 13.3 | 67 ms | 12.2 |

Layer attribution, SwiftShader, idle fps with one layer hidden
(`display: none`, which also stops that layer's loop):

| Scene | All layers | No halo `Laser` | No specimen | No title canvas | No ASCII field | DPR 1.5 everywhere | DPR 1 everywhere |
|---|---|---|---|---|---|---|---|
| Signal | 10.7 | 16.3 | 18.0 | 11.2 | 10.7 | 15.3 | 26.0 |
| Surface | 10.0 | 16.7 | 20.0 | n/a | 11.2 | 17.0 | n/a |
| Drift | 11.2 | 57.5 (halo and fog both hidden) | 11.7 | n/a | n/a | n/a | n/a |

## Findings

- **F1. The specimen arrives at about 9.1 to 9.3 s on slow 4G in every scene, 5 s after first paint.** `public/spectre.glb` is 1,190 KB, and 1,083 KB of it is one 2048x2048 RGBA PNG base-colour texture on a 1,792-vertex mesh. Every renderer forces monochrome, so the texture only feeds luminance. Serving a test GLB with the texture at 512x512 (275 KB total) through a Playwright route moved the specimen to **4.49 s** (Signal) and **4.48 s** (Surface), and the whole page from 1,774 KB to 935 KB. That is the largest win available and needs no code.
- **F2. Main thread is not the bottleneck once loaded.** With 4x throttling every scene holds 60 fps on Metal at idle and under drag and hold, with no long tasks. The heaviest window is Signal under touch, at about 28% busy before the fixes.
- **F3. The first second has 4 to 7 long tasks (hydration, chunk evaluation, model parse), up to 300 ms each at 4x.** They land in the first ~900 ms, before the specimen can show on a real network, so they cost little perceived awe. Suspension, Drift and Surface also mount Signal's `AsciiObject` first: `HoldInstallation` starts with `DEFAULT_HOLD_COMPOSITION` (Signal) and only switches to the cold scene in an effect, so `HoldStage` crossfades from an ASCII layer that is never seen. That costs an extra chunk (9 KB gz), a WebGL context, a GLB parse and an ASCII build during boot (visible in the boot profile as the `885` chunk).
- **F4. GPU fill is what will hurt on a phone.** SwiftShader ranks Signal, Drift and Surface at the same cost and Suspension cheapest. The halo `Laser` (full screen at DPR 2) and the specimen each cost about as much as everything else combined; in Drift the halo plus the fog overlay are almost the entire cost (11 to 57 fps when both are hidden). The ASCII field canvas and the dust title canvas are cheap. Device pixel ratio is the strongest lever: 1.5 everywhere gave +43% to +70%, 1 gave +143%.
- **F5. JS: 523 to 536 KB gzipped for `/`.** three.js core is about 235 KB of it and is needed. Two avoidable parts: `@react-three/fiber` (47 KB) and `troika-three-text` (28 KB) load because `src/app/page.tsx` imports `LoadingScreen` statically even though the locked build renders `null`; and the paper route's page chunk (41 KB) is prefetched by the paper link. On slow 4G both compete with the GLB.
- **F6. Main-thread hotspots (Signal, drag and hold, before fixes).** `ParticleObject` (the 40k-particle dust title) took about 17% of samples: the per-particle spring loop and `gatherJitter`, which recomputed three `Math.sin` hashes per particle per frame during a gather. Next were the ASCII fluid step (`asciiFluid.ts` advection, vorticity pass, bilinear `sample`) at about 8% and `fillText` from `asciiRender.ts` at 3%. `getBoundingClientRect` from the gaze and pointer paths was under 1%.
- **F7. Pausing is already handled.** Every renderer and the halo stop their loop through an `IntersectionObserver`; the field stops on `visibilitychange`; rAF does not fire in a hidden tab; the gaze and gather springs stop at rest.

## Fixes shipped in this pass

Files: `src/app/components/canvasui/ParticleObject.tsx`, `AsciiObject.tsx`,
`LiquidObject.tsx`, new `src/app/components/canvasui/adaptivePixelRatio.ts`.
Project edits inside the vendored renderers are marked `// perf`.

1. **Particle clouds sleep at rest.** When every particle is within 1e-4 of home and slower than 1e-3 units/s, and no pointer or gather change is live, `simulate` returns early and skips the position upload (480 KB per frame for the 40k title, 312 KB for the 26k specimen). The shader drift still animates, and any pointer, gather change or option change wakes the cloud. Output is the same to well under a pixel.
2. **Gather jitter is computed once per cloud**, not three `Math.sin` per particle per frame. Same values.
3. **Adaptive pixel ratio on struggling touch devices.** On a coarse pointer, after a 3 s warm-up, each 90-frame window with more than 60% of frames slower than 22 ms steps the specimen and title canvases' pixel-ratio cap from 2 to 1.5 to 1.25. It never climbs back, so the image does not pump. Fine pointers never change, so desktop renders exactly as before. The ASCII renderer keeps its CSS cell size because it already scales cells by the renderer's pixel ratio.

Before and after, interleaved A/B on the same machine, Metal, 4x CPU (two
rounds, two runs each, ranges are the round medians):

| Scene | Idle busy before | Idle busy after | Touch busy before | Touch busy after |
|---|---|---|---|---|
| Signal | 9% | 6-7% | 27-28% | 20-21% |
| Suspension | 12-17% | 10-11% | 20-22% | 19-21% |
| Drift | 15-16% | 15-16% | 28-30% | 29-30% |
| Surface | 15-16% | 15-17% | 28-30% | 28-29% |

Frame rate stayed at 60 fps in every cell, and boot numbers did not move
(the fixes do not touch boot). Drift and Surface do not change because their
specimens are the 3.2k swarm and the liquid; their title is DOM text.

Adaptive pixel ratio, SwiftShader (a stand-in for a phone that cannot hold
45 fps), 390x844 at DPR 3:

| Scene | t = 5 s | t = 10 s | t = 15 s | t = 20-30 s | Canvases at the end |
|---|---|---|---|---|---|
| Signal | 15.5 fps | 17.5 fps | 19 fps | 19-20 fps | specimen and title at 1.25, halo and field at 2 |
| Surface | n/a | n/a | n/a | 19.5-20 fps | specimen at 1.25 |

Same check on Metal at 390x844 (a capable phone) and at 1440x900 desktop:
every canvas stayed at 2.0 for 30 s, at 60 fps. In the A/B SwiftShader pass,
the touch window (after the step) went from 12.2-13.4 fps to 13.4-15.6 fps.
The gain is capped because the halo, which this track could not touch,
still renders at full DPR.

## Recommendations, ranked by expected impact

1. **Shrink the specimen texture (F1).** Re-export `spectre.glb` with the base colour at 512 px (or 1024 px if 512 looks soft on desktop), or as JPEG or WebP. Measured: specimen at 4.5 s instead of 9.1 s on slow 4G, page weight down 47%. Needs a desktop side-by-side before shipping; the texture uses `KHR_texture_transform` with a 15x scale, so check the ASCII and liquid renders for blur.
2. **Give the halo the same pixel-ratio governor (F4).** `Laser.tsx` was off limits this pass. It is a full-screen canvas at DPR 2 and the single most expensive layer; hiding it gave +52% to +67% on SwiftShader. Reusing `createPixelRatioGovernor()` there, and in the fog overlay in `HoldOverlay.tsx`, should roughly double the gain the specimen got. A soft glow loses less to a lower DPR than glyphs do.
3. **Start `HoldInstallation` on the cold composition (F3).** `HoldInstallation` only mounts on the client, so `useState(() => takeColdComposition().style)` (and the same for overlay) would skip the hidden ASCII layer on three of four scenes: one fewer WebGL context, GLB parse and ASCII build in the first second. Small diff, but it changes the cold-load path that `tests/e2e/holding-details.spec.ts` covers, so it belongs with the owner of those files.
4. **Stop shipping R3F and troika on the locked `/` (F5).** Load `UnlockedHomePage` (and so `LoadingScreen`) with `next/dynamic` in `src/app/page.tsx`, or split the locked page. Expected: about 75 KB gz less JS, about 0.4 s less contention on slow 4G. Also consider `prefetch={false}` on the paper link (41 KB).
5. **Cut the ASCII field's per-frame cost on coarse devices only if a real phone shows it.** `asciiFluid.ts` steps the full grid every frame (cell 6 px gives 65x88 on this phone) and `fillText`s each inked cell. It was about 10% of the busiest profile and cheap on the GPU. A `cell: 7` on coarse pointers would cut work by about 27% but changes the look; not worth it without a device trace.

## Caveats

- Headless Chrome on an Apple M5 with CPU throttling is not a phone. Metal hides GPU cost; SwiftShader exaggerates it and runs the GPU work on the CPU, outside the throttle. Treat the two as bounds and compare scenes and settings, not absolute fps.
- The machine was shared with other tracks during the runs (load average 7 to 10). Only the interleaved A/B is used for before and after claims. Main-thread busy numbers vary by a few points run to run.
- The load pass forces `preserveDrawingBuffer` for the pixel probe, which may slow those runs slightly. Runtime passes do not.
- Slow 4G is emulated by CDP throttling; real radio latency and TCP slow start are not modelled. HTTP compression comes from `next start`, not Cloudflare.
- The adaptive cap was verified on SwiftShader and Metal only, not on a real phone. It is conservative: it needs 3 s of warm-up and then 90 frames, most of them slow, before each step.
- No real-device trace. A WebPageTest or Chrome remote-debugging run on a mid-tier Android phone would confirm F4's ranking.
