# Contract — interactiveImage (hotspot)

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** This contract predates the 9-field format and uses the earlier 3-part subset (bar / copy standards / failure modes); it upgrades to all nine fields when next touched.

**Component:** `src/components/learning/InteractiveHotspotImage.jsx` ·
display type `interactiveImage` · functions: `teach-mechanism`, `apply` ·
interaction: `assessed`

## The bar

The four-humours hotspot in Episode 1
(`src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js`,
screen `id: 'four-humours-hotspot'`) is the standard. It works because:

- Every hotspot answers "what is this and why does it matter" in one tap:
  the `blood` hotspot's `description` ("Linked with warmth, energy and a
  cheerful personality. Too much blood could be blamed for fever or a red
  face.") gives meaning and consequence, and its `extraFact`
  ("bloodletting — cutting a vein or applying leeches — to 'restore
  balance'") gives the treatment logic and the exam-relevant detail. The
  component's `getDetailRows()` splits `description` into "Meaning" and
  "Believed effect" rows and renders `extraFact` as "Treatment logic" —
  so a two-sentence `description` plus one `extraFact` is the shape that
  actually fills the reveal card correctly.
- The two-phase flow (`viewMode: 'intro' → 'explore'`) gives orientation
  before interaction: the intro phase shows the full image with title and
  `introText` framing what the learner is about to explore, before any
  hotspot becomes tappable.
- The four hotspots (blood, phlegm, yellow bile, black bile) together
  resolve the unit's question — what the Four Humours theory claimed and
  why doctors believed it — no hotspot stands alone; Continue only
  unlocks once all four are visited (`allDone`).

## Copy standards

- Each hotspot's `description` should read as two sentences: what the
  thing is/means, then its believed effect — this is what
  `firstSentence()`/`secondSentence()` split into the "Meaning" and
  "Believed effect" rows.
- `extraFact` (or `treatmentLogic`) carries the exam-relevant detail — the
  "so what" of the hotspot, not a second trivia fact.
- `shortLabel` stays to 1–2 words — it renders as a content-width,
  non-wrapping overlay label next to the tap target.
- Plain language around the compulsory subject vocabulary, aiming for a
  reading age of 12; vocabulary explained on first use.

## Known failure modes

1. **Hotspots as decoration** — a tap reveals only a caption or label
   with no explanation of *why* the thing matters, turning the component
   into a labelling exercise instead of a teaching one.
2. **Unclear tap targets** — hotspot `x`/`y` coordinates placed on a
   visually ambiguous part of the image, or two hotspots close enough
   together that the 44px hit target overlaps, so the learner can't tell
   what they're about to tap before tapping it.
3. **Overlong hotspot text** — `description`/`extraFact` long enough that
   the reveal card (capped at `47vh`, scrollable) buries the point below
   the fold, or the inline label (`shortLabel || title`) is long enough
   to force a wrap it isn't designed to handle.

## Variants

- `variant="detail"` (default) — the bar above: one reveal card of labelled
  rows per hotspot (`description` → Meaning/Believed effect, `extraFact` →
  Treatment logic).
- `variant="reveal"` — each hotspot carries a `reveals: [{ text }]` array; the
  card pages through them (Next → … → "Mark explored →"), showing an
  `n / total` step counter and a segmented progress bar. A hotspot is only
  marked visited when its final reveal is reached. Absorbed from the former
  `InteractiveCollectionExplorer`; the old hardcoded five-beat phase labels
  are deliberately dropped.
- Optional `synthesis={ heading, points[], examTakeaway? }` — when supplied,
  a "collection complete" summary screen replaces the bare Continue once all
  hotspots are explored. Works with either variant.

Reveal-variant copy standard: each `reveals[i].text` is one self-contained
beat; order them narrative → explanation → exam relevance. Keep each beat to
1–3 sentences so the card (capped `47vh`) never buries the point.
