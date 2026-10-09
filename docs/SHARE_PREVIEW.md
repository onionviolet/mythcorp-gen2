# Share preview, 2026-10-08

`/opengraph-image` renders a 1200x630 monochrome PNG for both Open Graph and
Twitter. Root metadata uses `https://mythcorp.org` by default, or the existing
`NEXT_PUBLIC_SITE_URL` override. Only that exact extensionless image path was
added to `isRequiredSiteRequest`; the middleware still locks other pages.

## Rendering and cache

The daily composition comes from `dailyComposition`. Its dust treatment changes
between Signal, Suspension, Drift and Surface; this is a share-card interpretation
of those scenes, not a screenshot of their live renderers. Chicago's solar
position sets the specimen's lighting and the halo height. A shared card cannot
know the viewer's location, so its halo also uses Chicago.

The card is static: it is drawn once at build for `SHARE_IMAGE_MOMENT`
(17:00 Chicago, a low key light and a visible halo), labelled with the scene
and CHICAGO but no clock. The first deploy rendered it per request and every
request on production failed with Cloudflare error 1102 (Worker exceeded
resource limits), although local Workers preview, which has no CPU cap,
rendered it. A per-hour card would need pre-rendered variants or a cache
binding; `shareImage(now, { timeless: false })` still draws one.

OpenNext 1.20.6 explicitly supports the ImageResponse library: its installed
`dist/cli/build/patches/ast/patch-vercel-og-library.js` discovers the traced
`@vercel/og/index.node.js`, copies the edge library, rewrites imports, and embeds
the fallback font. `bundle-server.js` keeps the OG library when used. The route
uses the default Node runtime, which the adapter transforms for Workers; no
`runtime = 'edge'`, new dependency or deployment-config change is needed.

## Assets

`node scripts/generate-share-spectre.mjs` rebuilds the dust surface samples from
`public/spectre.glb`. Like `spectreFit.ts`, it clones the skinned mesh, updates its
bones and measures posed bounds. It strips textures for offline raycasting.
The same generator snapshots the existing plain dark theme tokens from
`globals.css`; ImageResponse cannot resolve browser CSS custom properties.

`shareFont.json` embeds the existing Geist Mono family's regular TTF, avoiding
runtime font fetches or filesystem assumptions in Workers. Source: Google's
[Geist Mono font endpoint](https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400),
resolved to `https://fonts.gstatic.com/s/geistmono/v6/or3yQ6H-1_WfwkMZI_qYPLs1a-t7PU0AbeE9KJ5T.ttf`.
Its SIL Open Font License is alongside it. No additional font family is used.

## Verification

Dev and local Workers both returned 1200x630 PNGs at 79,263 bytes, with the
cache directives above. Workers home HTML contains absolute mythcorp.org OG
and Twitter image URLs. Next dev uses localhost for its generated OG URL.
Excluded lock paths still redirect. All four daily treatments stayed below
94 KB, same-hour renders matched byte for byte, and day/night renders differed.
`npm run check` and the OpenNext build passed. Headless Chrome aborted at
launch with SIGABRT, so browser screenshots remain unverified. Full results
are recorded in the 2026-10-08 share-preview STATUS entry.
PNG files, fetched home HTML, logs and the headless Chrome and HTTP probe scripts
live in the assigned `scratchpad/og` folder outside the repository. Local
preview is evidence for the Workers runtime, not a deployment.
