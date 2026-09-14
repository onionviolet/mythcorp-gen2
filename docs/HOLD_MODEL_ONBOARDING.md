# Holding-stage model onboarding

`src/app/components/plain/holdModels.ts` is the only registry for holding-stage
models. It currently contains the locally hosted spectre and calibration assets.
Add a model only after its source and license are known.

1. Put the reviewed binary in `public/` and use a root-relative `.glb` path.
2. Add one entry to `HOLD_MODELS` with a unique id, `src`, and frame values.
   Start with the spectre frame, then tune scale and offsets in the held route.
3. Record the original source, license, and required credit in the entry. Do
   not use an asset whose permission or attribution is unknown.
4. Pass the id to `<HoldStage modelId="your-id" />`. Unknown ids resolve to
   `DEFAULT_HOLD_MODEL_ID`, so callers can safely keep an unavailable choice.
5. Check every renderer: ascii, particle, swarm, and liquid. Confirm the
   frame is readable on desktop and phone before making the id selectable.

The WIP lander's full readout cycles `HOLD_MODEL_IDS`, so registry entries become
available there automatically. Set `DEFAULT_HOLD_MODEL_ID` to change the cold
load and update the matching preload in `src/app/layout.tsx`. For a model that
requires public attribution, expose its recorded credit/source in the page
before shipping it; metadata stored only in this registry is not a visible credit.

The user's [guinea-pig example](https://sketchfab.com/3d-models/guinea-pig-afb20f05469e4be2b3a45ab4228a0da7)
is a future candidate, not an imported asset. This pass could not retrieve its
Sketchfab page, so no claim about its download availability or license is made.

If a selected model fails to load, `HoldStage` immediately renders the default
spectre and calls `onModelError` with the failed model. Use that callback to
reset a visible selection or report the failure. The callback does not claim
that the originally selected model loaded.

The current spectre file predates this registry and has no recorded external
provenance. Keep its metadata marked as unrecorded until the original source is
verified. No remote model URL, download, or renderer change is required for a
new local GLB.

`public/models/calibration.glb` is an owned, faceted calibration orb generated
by `node scripts/generate-hold-calibration-glb.mjs`. Regenerate it only through
that script so the checked-in binary remains deterministic.
