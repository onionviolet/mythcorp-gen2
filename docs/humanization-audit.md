# Humanization audit

Report only. No source copy was changed.

## Scope

Audited user-facing copy and adjacent copy-bearing source under `src/`.
The `/og/*` essays and `/wc/learn/theme-lab` flagship were excluded.
Generated data, dependencies, and static binary assets were also excluded.

The scan looked for uniform sentence length, hedging, signposting,
meta-commentary, em dashes, and spaced double hyphens. Candidate lines below
are quoted exactly as they appear in source, except the banned em dash is
written as the Unicode escape `\u2014` so this report does not introduce one.

## Candidates

| File | Exact line | Tell | Note |
| --- | --- | --- | --- |
| `src/app/about/page.tsx:29` | `Made in Chicago, with AI as a creative partner. The codebase is annotated for` | Meta-commentary | Describes how the site content is presented instead of staying with the subject. |
| `src/app/components/TerminalOverlay.tsx:91` | `print([{ kind: 'out', text: 'MYTHCORP, a personal site built as a sandbox. The codebase is annotated at /wc/learn. Front is theatre, /wc is the workshop.' }]);` | Meta-commentary | Calls attention to annotation and site structure from inside the experience. |
| `src/app/components/landing/LandingModals.tsx:76` | `where the components on this page are annotated and you can read how they work.` | Meta-commentary | Explains the page's explanatory machinery directly to the reader. |
| `src/app/wc/page.tsx:11` | `blurb: 'Real components from this site, taken apart and explained.',` | Meta-commentary | Frames the material by how it is explained rather than what it contains. |
| `src/app/wc/papers/ai-cybercrime/page.tsx:67` | `potentially superhuman attackers, anchored to a 2024 expert survey of` | Hedging | "Potentially" may be warranted by the forecast, but it is still a hedge worth reviewing. |
| `src/app/wc/papers/ai-cybercrime/page.tsx:68` | `2,000+ AI researchers (Grace et al.). The taxonomy is the spine; the` | Meta-commentary | Describes the document's internal construction. |
| `src/app/wc/papers/ai-cybercrime/page.tsx:95` | `Two structural points the paper keeps coming back to:` | Signposting | Announces the structure before presenting the claims. |
| `src/app/wc/papers/ai-cybercrime/page.tsx:115` | `The original paper was a first-time research project graded B+. The` | Meta-commentary | Discusses the paper's production and evaluation context. |
| `src/app/wc/papers/ai-cybercrime/page.tsx:123` | `Some sections restated each other. The web version is structured` | Uniform sentence length | Starts one of three consecutive reviewer notes with the same short verdict plus explanation rhythm. |
| `src/app/wc/papers/ai-cybercrime/page.tsx:128` | `Stages 3 and 4 were highly conjectural. Visualizations here mark` | Uniform sentence length | Repeats the short verdict plus explanation rhythm used by the surrounding notes. |
| `src/app/wc/papers/ai-cybercrime/page.tsx:134` | `Heavy reliance on secondary sources. Each figure is being paired` | Uniform sentence length | Completes a three-item cluster with nearly identical sentence cadence. |
| `src/app/wc/papers/ai-cybercrime/page.tsx:142` | `This page is the scaffold. Each section of the original paper will` | Meta-commentary | Talks about the page as a page and previews its construction. |
| `src/app/wc/learn/3d-scene/page.tsx:16` | `randomizes everything. This walkthrough covers the R3F primitives that` | Signposting | Explicitly previews what the walkthrough will cover. |
| `src/app/wc/learn/theme-system/page.tsx:40` | `<Section title="Step 1: define the tokens">` | Signposting | Begins a four-step sequence whose repeated labels make the structure unusually explicit. |
| `src/app/wc/learn/theme-system/page.tsx:120` | `<Section title="Where to look">` | Signposting | Uses a repeated navigation heading also found in other walkthroughs. |
| `src/app/wc/learn/theme-system/page.tsx:121` | `<p>The whole system is four files:</p>` | Signposting | Announces and counts the list that immediately follows. |
| `src/app/fmhy/_data/categories.ts:18` | `// hand-curated table in the mirror \u2014 everything else is auto-discovered.` | Em dash | The literal source character is an em dash. This is a code comment, not rendered copy, but it violates the repository-wide ban. |

## Scan result

No spaced double-hyphen occurrence was found in the audited scope.
