# Episode 3: The Beginning of Doubt — Visual assets manifest

Governs every image the runtime module `history-medicine-vesalius-beginning-doubt`
depends on. Maintained per `docs/system/PATTERN_GOVERNANCE.md` →
"MediaPlaceholder + visual-assets manifest".

## Status of MediaPlaceholder reservations

**No open `MediaPlaceholder` reservations.** Every rebuilt screen uses a
component that consumes imagery directly (a full-screen background layer or a
portrait/hero), not an inline `MediaPlaceholder` block:

- `KeyFigureReveal` (screen 3) → `portrait`
- `theoryCompare` people variant (screen 4) → `heroImage` + two person portraits
- `visualNarrative` (screen 6) → per-beat background `image`
- `conceptReveal` / `priorKnowledgeRecall` → atmospheric `backgroundImage`

Because these components have no `MediaPlaceholder` slot, missing dedicated
visuals cannot be reserved with a placeholder inside the content. They are
tracked here as **recommended future assets** instead, and swapped into the
existing `image` / `backgroundImage` fields when supplied. This is recorded as
a deviation in `03_Review_Log.md`.

## Assets in use (existing repository files)

| Screen | Field | Asset | Fit |
|---|---|---|---|
| 0 | backgroundImage | `/headers/history-medicine-through-time.png` | Medieval authority atmosphere for the recall. |
| 1 | step backgrounds | `/headers/history-medicine-renaissance.png`, `/headers/history-medicine-through-time.png`, `/headers/history-medicine-medieval-scripture.png` | Renaissance / learning / Church backdrops, one condition per reveal. |
| 3 | portrait | `/images/vesalius-1543.png` | Established Vesalius portrait. |
| 4 | heroImage | `/figures/history/medicine/renaissance/galen-vesalius-hero.webp` | Galen ↔ Vesalius back-to-back comparison hero. |
| 4 | leftPerson.image | `/figures/history/medicine/medieval/galen-portrait.png` | Canonical Galen portrait already used in the Medicine series. |
| 4 | rightPerson.image | `/images/vesalius-1543.png` | Vesalius portrait (reused as compact header). |
| 6 | beat 0 image | `/headers/history-medicine-renaissance.png` | "The body" — Renaissance observation atmosphere. |
| 6 | beat 1 image (beats 1–4) | `/headers/history-medicine-medieval-scripture.png` | Written record → book/printing motif for the spread beats. |

## Recommended dedicated assets (future improvement, not blocking)

Portrait, mobile-first, non-graphic, historically grounded, no baked-in text,
legible at 390px. Priority order:

1. **Renaissance anatomy theatre / public human observation** — for screen 6
   beat 0 (currently the generic Renaissance header). Strong focal hierarchy,
   a body being observed by students.
2. **Printing press producing anatomical pages** — for screen 6 beats 3–4
   (currently the manuscript/scripture header). Show consistent reproduction
   of evidence, not generic floating parchment.
3. **Detailed Renaissance anatomical illustration** — could strengthen the
   screen 4 hero or a screen 6 beat; visually legible, no learner text.
4. **Scholars comparing printed anatomical evidence** — for a screen 6 spread
   beat; communicate reach and scrutiny, not a generic library scene.

Each recommended asset, when supplied, replaces the corresponding existing
`image` field above; no content-structure change is required.

Do not generate imagery inside the build. New portraits of Galen or Vesalius
must reuse the canonical paths above — do not regenerate them.
