# Lander scene and discovery pass

User request: start with a halo below the spectre, support future replacement
models, reconsider the expanded readout, and make LinkedIn feel inviting with
a restrained glow or pet-like interaction. Smaller agents are authorized.

Integration owner and verifier: root agent. Work is local; no commits, pushes,
deployment, new dependencies, or changes to unrelated staged work.

## Continuation result

Date and scope: 2026-09-13, continued in the same dirty checkout with unrelated
work preserved. The scan now remains active beneath one optional secondary
overlay; Halo starts with no secondary layer. The mistaken ground ring and its
control are removed. The readout exposes both `scan active` and `over`.

The cat has a longer responsive path, a fixed 2.4 second travel phase, and a
bounded pointer-proximity response on the obvious LinkedIn link. A remote
LinkedIn preview was rejected because it would add unreliable auth/embedding
behavior and no additional verified profile data. The decode title now visibly
resolves itself with a restrained sweep. Quick clicks retain up to four bounded
waves at once.

Gravity mode and a cursor-following cat remain separate `/og`-sized experiments
in `BACKLOG.md`. They are not part of the default page. Final validation evidence
is recorded below after the production check and browser pass.

`npm run check` and `npm run check:roll` passed after integration. The production
browser showed scan alone and with rain, decode during glyph resolution and
after settling, the cat halfway through its longer route, the 128px pointer-near
link response, and three click rings alive together. Reduced motion produced no
click ring and left the cat static beside the link. At 390px the document had no
horizontal overflow and the expanded readout remained usable. No browser errors
were captured. Physical touch, screen-reader use and aesthetic acceptance remain
separate human checks. No commit, push or deployment was performed.

## Model lane

Builder: GPT-5.6 Terra, medium effort.

Own `HoldStage.tsx`, a new `holdModels.ts` registry, and a small model onboarding
guide under `docs/`. Add a typed, bounded registry for locally hosted GLB assets,
with the spectre as the default and per-model framing. Keep all four renderers
working and expose an optional model id prop with a safe unknown-id fallback.
Support a second registered asset without changing renderer internals. Do not
edit vendored Canvas UI, PlainHold, layout, composition files, or root docs.
Do not download the Sketchfab example: the request is future support.

Integration added an original calibration GLB and deterministic generator to
the model lane so a real second asset could be tested without a remote download.

Gate: focused lint/type evidence, all renderer branches use the resolved model,
unknown ids resolve to the default, and the guide names exact onboarding steps
plus source/license attribution fields. Report API and unresolved limitations.

## LinkedIn lane

Builder: GPT-5.6 Luna, medium effort.

Own `HoldContact.tsx` plus a co-located `LinkedInInvite.tsx` and CSS module.
Keep the obvious "Find me on LinkedIn" label, exact supplied profile URL and
44px target. Add a restrained monochrome halo and a tiny original pet silhouette
that makes one short approach toward the link after an idle delay, then settles.
It must never trigger a click, move the real pointer, or navigate. No perpetual
chase, sound, external assets, new dependency, or large overlay. Respect reduced
motion, stop timers when hidden/unmounted, keep the whole link usable on touch
and keyboard, and avoid obstructing other controls. The user's request authorizes
this small plain-theme glow exception. Do not edit PlainHold or shared CSS/docs.

Gate: focused lint, bounded lifecycle review, no synthetic click/navigation,
stable label and href, and static reduced-motion presentation. Root checks
desktop/mobile light/dark appearance and revises anything too distracting.

## Root lane

Own deterministic scene start and halo, layout and readout comparison, model
selection integration, shared docs, and production/browser verification.
The legacy screenshot informs the expanded controls; it is a visual reference,
not a request to restore title/model overlap or hide the professional link.

Gate: deterministic cold load, visible default halo, model swap/reset behavior,
expanded/compact controls, phone layout and keyboard/reduced-motion checks,
`npm run check`, and `npm run check:roll`. Record what was actually observed.

## Integration result

Completed locally on 2026-09-13. Both lanes passed focused lint/type checks;
the integrated production build, lint, text policy, TypeScript and composition
checks passed. Both GLBs rendered in ascii, particle, swarm and liquid. Blocking
the alternate GLB returned the control and scene to Spectre with an honest
status message. Cold reloads restored the Halo scene and default model.

The expanded readout is the default above 1200px wide and 680px tall; compact
is the default elsewhere. Screenshots covered wide desktop and 390px/320px
phones, both schemes, and the short phone's scrollable full readout. Keyboard
switching and halo toggling worked. Reduced motion kept the pet static; normal
motion reached the settled state after the idle interval. The final production
preview had no captured browser errors. Physical touch, screen-reader use and
human aesthetic acceptance are separate from these browser checks.

The Sketchfab example was not imported. A source/credit-aware registry and
`docs/HOLD_MODEL_ONBOARDING.md` provide the future replacement path. No commit,
push or deployment was performed.
