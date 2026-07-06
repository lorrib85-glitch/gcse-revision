# Contract — MediaPlaceholder

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** Uses the 9-field format.

**Component:** `src/components/core/MediaPlaceholder.jsx` · intent: *reserve a
visual the author will supply*

## 1. Purpose

Reserve a well-shaped slot for an image or diagram the author has not yet
supplied, with a brief describing exactly what it should depict — so the real
asset drops in later without touching layout. Build sessions never generate
bespoke imagery; they reserve the space and its intent.

## 2. When to use

Whenever a screen genuinely needs a visual (an illustration, a diagram, a
photo) that does not already exist as an asset. This is the default and only
way a content build introduces a still visual.

## 3. When NOT to use

- **When the real asset already exists** — use it directly.
- **For an interactive or generated visual that is a component** — a tappable
  hotspot image is `interactiveImage`; a live diagram is its own component
  (e.g. `CircuitDiagram`). MediaPlaceholder reserves *still, author-supplied*
  assets only.
- **As decoration** — do not reserve a slot for a screen that does not
  actually need a visual to serve its intent.

## 4. Required structure

- `kind` — `'image'` or `'diagram'` (tunes label + glyph).
- `aspect` — `'W:H'` reserving the slot's shape; choose to suit the screen.
- `caption` — **required and specific**: what the finished asset must show,
  detailed enough that the author can source or brief it without guessing.
  "A medieval physician inspecting a urine flask by candlelight" — not "an
  image".
- Renders a dashed accent frame, a sentence-case "Image/Diagram coming soon"
  label (never uppercase), and the caption.
- Every placeholder has a matching **visual-assets manifest** entry (below).

## 5. Token rules

`RADII.medium` frame; `SPACING` padding/gaps; `TYPE.label` (sentence case) +
`TYPE.caption`; accent via `SUBJECTS[subject].accentRgb`. No raw px/hex.

## 6. Motion rules

Intentionally static — a placeholder does not animate. (When the real asset
lands, any motion belongs to the asset or its surrounding component.)

## 7. Gold example

`MediaPlaceholder.stories.jsx` → **Diagram slot** (the humoral-compass brief)
and **Image slot**; and the body slot of `TeachScreenShell.stories.jsx` →
Gold. Each carries a specific, sourceable caption.

## 8. Below-bar counterexample

- A vague caption ("a picture", "diagram here") that cannot be sourced.
- Generating a bespoke image or SVG instead of reserving a slot.
- A placeholder with no visual-assets manifest entry (or a manifest entry
  with no placeholder).

## 9. Review checks

- ⚙ `caption` is non-empty.
- ⚙ Every `MediaPlaceholder` has a manifest entry, and every manifest entry
  has a placeholder (`content-review` reconciles both ways).
- 👁 The caption is specific enough to source the asset.
- 👁 The `aspect` suits the screen and the intended asset.

---

## Visual-assets manifest

The concrete, per-episode realisation of the Image Manifest in
`docs/system/VISUAL_ASSET_SYSTEM.md` for reserved slots. One file per
episode at `docs/content/<subject>/<series>/<NN>_visual-assets.md` — the
author's shopping list of visuals to produce. Not seen by the learner.

Each `MediaPlaceholder` in the built episode has one row:

```markdown
# Episode <NN> <title> — visual assets

| Screen | Kind | Aspect | Category | Brief |
|--------|------|--------|----------|-------|
| 8 "The Theory of Opposites" | diagram | 4:3 | Functional | The four humours on hot–cold × wet–dry axes, arrow crossing to the opposite quadrant. |
| 2 "A patient arrives" | image | 16:9 | Supporting | A medieval physician inspecting a urine flask by candlelight. |
```

- **Category** is from `VISUAL_ASSET_SYSTEM.md` (Hero / Supporting /
  Interactive / Functional) so the reuse-vs-new and quality-tier decisions
  it governs still apply.
- **Brief** is the placeholder's `caption`, verbatim.
- `content-create` appends a row when it inserts a placeholder;
  `content-review` reconciles the manifest against the placeholders in the
  built episode.
