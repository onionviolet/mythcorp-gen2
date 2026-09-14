# Flagship spec: Author the fourth theme

Historical flagship candidate retained for a future decision. This is a **build spec for Weibao to hand-implement**, not a current Codex task. It is the whole-page evolution of `TokenPlayground`: a learning page where the visitor authors a complete fourth theme live, watches the entire site restyle, and saves and shares it.

Written 2026-07-23. No em-dashes, theme tokens only, `<SiteHeader />` never hand-rolled, `npm run check` green before commit, open a PR (never push main). Read DESIGN.md before any UI work.

## The idea in one line

The site's design language IS the theme token system. Let the visitor extend it: build a fourth theme, see the header, buttons, and cards move in real time, then keep it in the ThemeSwitcher and share it by URL. You learn the system by becoming an author in it.

## What already exists (build on it, do not re-invent)

- `src/app/contexts/ThemeContext.tsx`: `ThemeName = 'cyberpunk' | 'luxury' | 'paper'`, `STORAGE_KEY = 'mythcorp-theme'`, writes `document.documentElement.dataset.theme`, curtain transition, `useTheme()`.
- `src/app/components/ThemeSwitcher.tsx`: maps over `THEMES` (name/label/blurb), full + compact variants.
- `src/app/globals.css`: token values live in `[data-theme="..."]` blocks (`--accent`, `--fg`, `--bg`, `--surface-style`, `--radius`, `--surface-shadow`, `--motion-ease`, `--button-bg`, etc.).
- `src/app/layout.tsx`: a pre-paint bootstrap script reads `mythcorp-theme` from localStorage and stamps `data-theme` before first paint (the anti-flash guard).
- `src/app/wc/learn/_components/TokenPlayground.tsx`: the proven mechanism. Reads live values with `getComputedStyle`, writes overrides with `root.style.setProperty`, tracks every touched token in a ref, removes exactly those on reset / unmount / theme change. **The custom theme is this mechanism made persistent.**

## Architecture

### 1. A custom theme is a token map, not a CSS block

The three built-in themes are static `[data-theme]` blocks. The fourth is dynamic: a `Record<tokenName, value>` the visitor builds, persisted separately.

- New storage key `mythcorp-custom-theme` holding JSON: `{ base: ThemeName, tokens: Record<string,string> }`. `base` is which built-in it starts from (so unedited tokens inherit a coherent starting palette).
- Extend `ThemeName` to include `'custom'`. When `theme === 'custom'`: stamp `data-theme = base` for the inherited tokens, then apply the saved `tokens` map as inline `setProperty` overrides on `<html>` (exactly TokenPlayground's write path, but sourced from storage instead of live pickers).

### 2. The pre-paint bootstrap must learn the custom case

This is the one genuinely tricky part, and skipping it means a flash of the wrong theme on every load. The bootstrap script in `layout.tsx` currently reads one string. Extend it: if `mythcorp-theme === 'custom'`, also read `mythcorp-custom-theme`, stamp `data-theme = base`, and set each saved token inline on `documentElement.style` **before paint**. Keep it dependency-free inline JS (it runs before React).

### 3. The builder page: `/wc/learn/theme-lab`

A new walkthrough-style page that is itself the tool. Sections, each teaching one token group while editing it live:

- **Color** (`--accent`, `--accent-soft`, `--fg`, `--bg`, plus the muted/subtle ramp): color inputs, same opaque-hex laundering `TokenPlayground` already does.
- **Surface** (`--surface-style`, `--radius`, `--surface-shadow`): a small set of presets (matte / glass / flat) plus radius and shadow sliders, so the visitor sees the design-language axis, not just color.
- **Motion** (`--motion-ease`): a dropdown of easings with a live preview element that animates on change.
- **Type** (optional v2): display/body font pairing from the three already loaded (no new fonts, per CLAUDE.md).

Each edit writes through the same inline-override path and updates a live-preview strip showing real chrome (a header mock, a `themed-button`, a `themed-surface` card, an accent chip). Because the real page reads the same tokens, the entire page moves too, that is the payoff, keep it visible.

### 4. Save, reset, share

- **Save** writes the token map to `mythcorp-custom-theme`, sets `theme = 'custom'`, and the ThemeSwitcher gains a fourth "Yours" entry (only shown once a custom theme exists).
- **Reset** clears overrides (TokenPlayground's exact contract: remove only what was set) back to `base`.
- **Share** encodes `{ base, tokens }` as base64url JSON into `?t=...`. The page reads `?t=` on mount and loads it into the editor (preview only until Saved). Keep the payload small: only store tokens that differ from `base`.

### 5. ThemeSwitcher + type changes

- Add `'custom'` to `ThemeName` and an `isThemeName` update. Guard everything that assumes exactly three themes (the `cycleTheme` index math, the `THEME_GLYPH` record, `isThemeName` in ThemeContext).
- `THEMES` stays the three built-ins for cycling; the custom entry is appended conditionally in the switcher UI (glyph suggestion: a small star or pencil), not part of the Konami cycle.

## Guardrails specific to this build

- **No flash**: the bootstrap change (step 2) is load-bearing. Verify first-paint has the custom tokens with JS disabled-until-hydration (view-source the inline script, and test a hard reload while `theme === 'custom'`).
- **No corruption of the real theme**: follow TokenPlayground's ownership discipline. Only ever remove tokens you set. Never leave the site recolored after navigating away unless the visitor explicitly Saved.
- **Alpha tokens**: `<input type="color">` refuses alpha; `--border` / `--bg-elevated` carry alpha in some themes. Keep those out of the color pickers (or give them a text input), same call TokenPlayground already made.
- **Split by responsibility**: keep the route shell, control groups, preview, and state ownership separate when that makes their boundaries clearer. A cohesive long file is acceptable.
- **Register it**: add `theme-lab` to `WALKTHROUGHS` in `src/app/wc/learn/page.tsx`, add the route to MAP.md, drop a `// Walkthrough: /wc/learn/theme-lab` pointer atop `ThemeContext.tsx` (it already points at theme-system; this is a second, more advanced one, decide whether to co-list).
- **Accessibility**: every control keyboard-reachable and labeled, honor `prefers-reduced-motion` on the motion preview.

## Suggested build order (each a small PR)

1. `useCustomTheme` hook + storage schema + the `'custom'` type plumbing and guards. No UI. Prove it round-trips in the console.
2. Bootstrap script change + hard-reload no-flash verification.
3. The `/wc/learn/theme-lab` page with the Color group only, live preview strip, Save/Reset.
4. Surface + Motion groups.
5. URL share encode/decode.
6. ThemeSwitcher "Yours" entry.

Ship 1 to 3 as a usable core; 4 to 6 are the finish.

## Definition of done

Visitor can open `/wc/learn/theme-lab`, edit color + surface + motion, watch the whole site restyle, Save it, see it in the ThemeSwitcher, reload without a flash, and share a URL that reproduces it. `npm run check` green, verified in all three base themes.
