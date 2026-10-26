# Bringing the projects into MYTHCORP, 2026-10-22

Proposal, not an accepted decision. Nothing here is built.

"OOP" in the request is read as **OOPS**, the Optimistic Progression Simulator
(`~/code/yet-another-idle-rpg`, `onionviolet/OOPS`), not object-oriented
programming. Revisions the same day: MYTHCORP is a name and a mood, not a
company to role-play; Flight Lab, God's Eye View and GearScope are out; show
the projects directly instead of only describing them.

## The story

The site already has a simulation lab (`/experience`) and a paper that
forecasts a field. The featured projects are simulations too, at different
scales, and each one is revised in the open.

| Scale | Project | What it simulates | What keeps it honest |
|---|---|---|---|
| A life | OOPS | Discovery and progression across distinct worlds | 2,516 passing tests, a dated checkpoint per release |
| A state | Province War | Provinces, roads and units in Alder Straits, 1911 | A playable solo campaign, 102 commits |
| A field | The AI cybercrime paper | How AI shifts offense and defense | Sources, amendments, two endings |

A second story sits under the first and is rarer: **how the work gets made.**
OOPS is one person directing many agent chats through written rules (the
`AGENT_USAGE_RULES` budget rules came from "75% of my tokens going through one
book"), dated dispatch checkpoints and quoted intent in `USER_VISION.md`. Few
developers show that process honestly. It suits `/wc/learn`, which already
exists for "how this was built".

## How other developers tell it

From memory of well-known examples, not re-checked in this pass, except where
the earlier scouting docs played them.

| Pattern | Who does it | What MYTHCORP takes |
|---|---|---|
| **The page is the product.** Visitors operate it before reading about it | ryOS (scouted F2), Sonner's docs page (scouted F1) | Playable OOPS above the fold, story below |
| **One control proves the claim** | manraj.me NoStep slider (played) | The fork comparison below |
| **Devlog of dated progress, failures included** | Lucas Pope's TIGSource devlogs, Factorio Friday Facts | The checkpoints already exist; pick five and show the GIF or screenshot for each |
| **Postmortem: what went right, what went wrong** | Game Developer postmortems | One honest "what broke" per project (the temp-folder purge, the token blowout) |
| **Status labels on unfinished work** | Maggie Appleton's growth stages, Gwern's status and confidence tags | Each project carries a plain state: playable, in progress, proposal. Matches the site's `/og` draft labels |
| **A /now line** | Derek Sivers' now pages | One dated line on what each project is doing this week, kept by hand |

What they share: show the thing first, date the claims, and admit the
failures. None of them use a project grid.

## Showing the projects directly

### OOPS (ready, with care)

- **Hosting.** Vanilla JS, a 6.4 MB `dist/bundle.js` plus HTML and CSS; no
  build server needed. It fetches `private_packs/manifest.json` and treats a
  404 as "no packs", so a public deploy that never copies `private_packs/`
  works as-is (checked in the bundle).
- **Where.** A separate origin, for example the repo's own GitHub Pages or an
  `oops.` subdomain, embedded with an iframe that only loads on click. A
  separate origin keeps OOPS saves (`localStorage`, `save_key`,
  `yairpg.opening.v1`) apart from MYTHCORP's (`mythcorp:anomalies`), and keeps
  the 6.4 MB off the front-page budget. A subdomain on this Worker is a
  `wrangler.jsonc` production change and needs your yes; GitHub Pages does
  not touch this repo.
- **A good first minute.** An idle game opened cold shows its least
  interesting part. Offer two doors: start fresh, or load a curated save that
  drops the visitor mid-world with a home and gear already built. The save
  import path exists (`skip_live_import`); the curated save would need to be
  made and checked.
- **Phones.** Layout acceptance was recorded at 1920x1080, 1800x1040 and
  1536x864 only. Treat phones as unknown: show a short recorded clip or the
  scripted log vignette there, with a "best on desktop" line.
- **Credit.** Miktaew's MIT notice and the inkjs notice already ship in
  `dist/`; the page also credits Yet Another Idle RPG and Proto23 in words.
- **Repo homepage.** `onionviolet/OOPS` still lists Miktaew's upstream game as
  its homepage. Fixing that is a change in the OOPS repo, not here.

### Province War (not ready to publish)

- The repo is private and its `web/assets` is 329 MB, of which 302 MB is
  `reference-archive`, alongside `cow-faction-emblems-v1`, `cow-ui-imagery-v1`
  and `wiki-icons-v1` folders. Publishing a build would publish other games'
  art. A public build needs an original-assets-only manifest first, the same
  call the site already made for `/og/animals`.
- Until then, show it through recorded clips or screenshots of original
  assets only, and the proof control (cut a road, watch a stack reroute)
  rebuilt with the site's own drawing.
- Its design story is the distance from reference to original:
  `RULES_PROVENANCE.md` cites public wikis for the mechanics it studied. Show
  that lineage with links, never extracted assets.

### The paper

Already public and interactive. Its project entry points to it.

## Options, ranked

**O1 Play first, story second (recommended).** One page per project. Top: the
project itself (OOPS iframe on click, Province War clips), with a status label
and a dated /now line. Below: one proof control, five dated devlog entries
with images, one "what broke" note, credit. Reached from a plain index. Build
the OOPS page first as an `/og` study. Why: it does what the referenced
developers do, it needs no copy-heavy explainer, and OOPS is publishable now.

**O2 Fork comparison as OOPS's proof control.** A fork's story is what
changed. One control flips the same screen between upstream Yet Another Idle
RPG and OOPS (inventory, gear, homes). The matched Proto23 comparison on
2026-10-21 already did this work in the OOPS repo; check what screenshots it
saved before taking new ones.

**O3 "How OOPS is made" walkthrough.** A `/wc/learn` page on directing agent
chats with rules, checkpoints and budgets, with the real numbers and the
failures. Unusual and true; it also explains why the repo reads the way it
does.

**O4 Console doors, cheapest step.** `open oops` and `cat province-war` in the
Console room print the status line and link out. Useful as a teaser while O1
is built.

**O5 Revisions as material.** OOPS's checkpoint history drawn as geometry in
`/experience`. Highest cost, competes with the boot sequence for spectacle.

## Constraints

- **R1 Publication line.** `private_packs/`, the book-world life material,
  the loose ChatGPT image in OOPS, and Province War's reference and
  third-party asset folders never ship.
- **R2 Site lock.** `src/siteLock.ts` keeps everything but `/` and the paper
  private. A project page stays locked until you add it to
  `LOCKED_OPEN_PATHS`. An OOPS build on its own origin is outside the lock, so
  publishing it is its own decision.
- **R3 Themes.** The iframe content keeps OOPS's own look. Only the frame,
  status line and devlog around it follow the four themes; that is the one
  accepted exception to DESIGN.md's rule.
- **R4 Performance.** Nothing heavy loads until the visitor clicks play.
- **R5 Honest labels.** Clips are labeled as recordings, curated saves as
  prepared, phone views as fallbacks.

## Open questions

- **Q1** Publish a playable OOPS build (GitHub Pages or a subdomain), or keep
  it to clips for now?
- **Q2** Is the how-it's-made story (O3) something you want public?
- **Q3** Anything else beside OOPS and Province War? Not yet judged: the Anki
  FSRS7 fork, Idea Trace, the modular PC case.

## October 26 intake: broader style audit and project lineup

Weibao requested a dedicated MYTHCORP chat to audit unusual interactive styles, including evanciao-inspired low-poly environments, old-web interfaces and exploratory project archives, plus other useful directions. This is authorization for research and a saved audit, not a selected redesign or deployment. Preserve the earlier decision: MYTHCORP is a name and mood, not a company to role-play. The archivist/workshop metaphor from the brainstorm is only an option, and must be compared with the site's existing specimen, rooms and direct project presentation.

**Content direction:** feature the Gandalf AI recreation for learning/outreach and OOPS, then make room for future projects. “OOP” means OOPS here. Gandalf reference: https://github.com/onionviolet/gandalf-local; current work and validation notes live at `/Users/weiwei/Documents/Codex/2026-10-25/gandalf-game-research/outputs/gandalf-local`. Treat its local Ollama requirement separately from a public site demo: compare an accurately labeled recorded example, a scripted illustration and an external repository/setup link before proposing hosted inference. Verify current project states before writing public claims. This addition does not remove the previously proposed Province War entry or accept it for publication.

The audit should compare low-poly dioramas, object-based archives, retro desktop/terminal interfaces, editorial project stories with working controls, and other distinct styles supported by inspected examples. Rank mechanisms by what they let visitors understand or do. Include phone/touch and keyboard operation, reduced motion, direct links, a fast reading route, loading/maintenance costs and the existing site lock. Separate tasteful interaction from decoration that obstructs the projects.

A possible first study is one desk or cabinet with three objects and one complete project story. Compare it with a direct project page using the same content before recommending implementation. Each future entry should support a useful experience, a short explanation, source/credit, dated status and an honest account of what Weibao changed. The companion could share an original visual asset someday, but neither project depends on the other.

Source leads: https://www.youtube.com/@evanciao/videos; https://www.youtube.com/watch?v=bvBH7ma7Gvk; https://evanciao.itch.io/poison-tree; https://evanciao.itch.io/yiku-advanced-retro-anime-girl. Video-list inspection and creator project pages informed the brainstorm; complete videos were not reviewed. Recheck sources in the audit and broaden beyond this creator.
