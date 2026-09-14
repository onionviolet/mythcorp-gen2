# Landing hero: directions not taken

Banked 2026-07-25. The hero got a restraint pass instead of a redesign, on purpose: the cheapest way to find out whether the problem was the *composition* or just the noise sitting on top of it. These three are the redesigns that were on the table. They are written to be picked up cold, and to be built as parallel versions worth putting in front of people rather than as a single replacement.

## Why the restraint pass came first

The complaint was that the hero felt AI-generated. Three concrete causes, all removed without touching the layout:

1. **Nothing was primary.** Four uppercase letterspaced mono lines at a uniform `gap-10`, decreasing only in font size. `DESIGN.md` already bans this: "ALL-CAPS is a spice, not a system. One caps label per section at most."
2. **Instructions were used as decoration.** "PRESS ?/CTRL + G TO PEEK THE ALIGNMENT GRID" and "? REPLAY THE BOOT SEQUENCE" were body copy in the hero stack. They are hints. They now live in the bottom corner rail.
3. **A deliberate flaw read as a real one.** The "Signal acquired" line carried `self-start`, kicking it off-center, and clicking the headline opened a modal apologizing for it. Same failure as the old `/about` and `/contact` copy: the site narrating its own unfinishedness. A visitor reads sloppiness, not wit.

If the hero still feels generated after that, the problem IS the centered composition, and one of the below is the answer.

## A. Editorial grid, left-anchored

The recommended one, if the restraint pass is not enough.

Drop the centered column entirely. Anchor the title to a real grid: hairline rules dividing the viewport, a metadata rail running down the left edge carrying the Chicago/2024 signal line vertically, one loud primary action, generous asymmetric whitespace. Keyboard hints stay in the corner.

Why it works: asymmetry that is *disciplined* reads as designed by a person, because a generator defaults to symmetry. The grid has to be visible enough to look deliberate. Half-hearted asymmetry reads as a bug, which is the exact trap the misalignment gag fell into.

Watch for: the skyline photo fights a left-anchored composition, since its visual mass is centered. Either crop it or dim it further.

## B. Terminal console frame

Lean all the way into the MYTHCORP costume. Content sits inside a bordered rectangle with corner ticks and a labeled panel header (`// HERO_01`), monospace readouts pinned to the frame edges, the skyline visible through the frame rather than behind everything.

Why it works: it is the most distinctive option and the most on-brand with the boot sequence and the `/` terminal overlay.

Watch for: it fights the "aspirational luxury" half of the identity that the boot sequence *reveals*. `NEXT_SESSION.md` describes the boot as cyberpunk giving way to warm luxury. A terminal frame around the reveal undoes that arc. Worth building only if the luxury half is being retired.

## C. Split layout, title against a live panel

Title block takes the left half; the right half holds something live and pokeable: the pocket star field from `/wc/learn/3d-scene`, a scene preview, or a working readout.

Why it works: strongest "advanced" signal available, because it shows instead of telling. It also solves the hero's real content problem, which is that it currently asks you to go somewhere else to see anything happen.

Watch for: the most expensive of the three. Needs a genuine right-hand component, and a placeholder there would be worse than the current hero. Also the heaviest, and the landing page already mounts a 3D boot sequence.

## If these become feedback variants

The stated intent is to keep these as alternate versions to show people. Two notes for whoever builds that:

- Route them as `/og/hero-a`, `/og/hero-b`, `/og/hero-c` rather than a flag on `/`. `/og` is already the back room for unfinished ideas, the pattern exists, and it keeps the real landing page out of the experiment.
- Ask people which one they would *click*, not which one they *like*. Preference between hero designs is close to noise; behavior is not.
