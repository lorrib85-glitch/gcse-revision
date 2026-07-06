# Contract — keyFigureReveal

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** This contract predates the 9-field format and uses the earlier 3-part subset (bar / copy standards / failure modes); it upgrades to all nine fields when next touched.

**Component:** `src/components/learning/KeyFigureReveal.jsx` · display type
`keyFigureReveal` · functions: `introduce-figure` · interaction: `reveal`

## The bar

The Hippocrates and Galen reveals in Episode 1
(`src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js`,
stages "Hippocrates" and "Galen") are the standard. They work because:

- A portrait hero (`block.portrait`, ~44vh) with a significance statement
  that frames the coming unit, not just the figure's biography —
  Galen's `role: 'Roman doctor and writer'` and the section content that
  follows immediately sets up why his ideas are about to matter for the
  rest of the episode.
- Each knowledge section carries exactly one idea, never a list: Galen's
  four sections are "Gladiators & dissection" (how he got his practical
  knowledge), "Theory of the four humours" (what he taught), "The
  squealing pig" (how he proved it), "Influence & lasting legacy" (why it
  mattered for 1,400 years) — four sections, the component's practical
  ceiling before swipe-fatigue sets in.
- A story detail makes the figure memorable rather than a fact list: "He
  performed a public demonstration, cutting the vocal cord nerves of a
  squealing pig mid-cry. The pig fell instantly silent. The crowd was
  stunned. Galen's reputation was made." — this single scene is what a
  learner will actually recall in the exam room, more than any date.

## Copy standards

- Lead with why the figure matters to the unit's dramatic question, not
  when they were born.
- Each section (`sections[]`) carries one idea in full sentences — 1–3
  `lines`, not a bullet dump.
- `takeaway` (final section) states the figure's lasting significance in
  one sentence, tied to a real consequence, not a vague "he was
  important."
- Plain language around the compulsory subject vocabulary, aiming for a
  reading age of 12; vocabulary explained on first use.

## Known failure modes

1. **CV-recitation** — sections reduced to born/died/wrote-this-book
   lists, with no explanation of why any of it matters to the unit's
   knowledge.
2. **Stakeless significance** — a `role` or opening line that states
   importance ("one of the most influential doctors in history") without
   ever cashing that out into a stake — what changed, who was affected,
   why it persisted.
3. **More than 4 knowledge sections** — pushes past the point where a
   learner will actually swipe through and read each one; content beyond
   4 ideas needs to be cut or moved to a later screen.
