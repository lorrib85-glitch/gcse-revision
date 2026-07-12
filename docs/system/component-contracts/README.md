# Component execution contracts

One page per component: the rules governing correct use, so the same
component is built to the same bar every time. Consumed by the
content-create and content-review skills and the Workflow C/E critique gate.

A contract governs *execution quality* — it never redefines the
component's API or overrides a LOCKED component's internals.

**Governed by `docs/system/PATTERN_GOVERNANCE.md`** — read it first. It
defines the taxonomy chain (learning objective → intent → component →
contract → example), the one-primary-intent hard rule, the intent→component
map, the render pass, and the review-to-rebuild pathway. This README only
covers the contract format.

Field 7 of each contract (**Gold example**) must name the same composed
runtime screen as that component's entry in
`docs/system/GOLD_SCREEN_REGISTER.md` — the register is the single calibration
source, verified at 390px, that reviews and rebuilds are measured against.

## Contract format — 9 fields

Every contract uses these fields (full definitions in `PATTERN_GOVERNANCE.md`):

1. **Purpose** · 2. **When to use** · 3. **When NOT to use** (the misuse
control) · 4. **Required structure** · 5. **Token rules** · 6. **Motion
rules** · 7. **Gold example** · 8. **Below-bar counterexample** ·
9. **Review checks** (each ⚙ machine-checkable or 👁 requires render pass).

The six existing learning-component contracts (read-blocks, theory-lab,
matching-task, key-figure-reveal, interactive-hotspot-image, quick-recall)
predate this format and use an earlier 3-part subset (bar / copy standards /
failure modes); they upgrade to the 9-field format opportunistically when
next touched. New contracts use all nine fields.

When content work repeatedly hits quality problems on an uncontracted
component, write its contract as part of that work (Lane G change).

## Required — composition classification

Every **new** contract must declare, near the top, the component's
composition classification — one authoritative line:

`**Composition classification:** <content | interaction-owned | cinematic | composition-route>`

- **content** (default) — rendered inside an approved composition route.
  Owns none of: the screen heading, viewport layout, screen-level spacing,
  progression chrome, full-screen typography.
- **interaction-owned** — Route B. Owns full-screen composition because its
  mechanic requires control of the whole screen. Requires an explicit
  ownership grant: the contract must state that the component **owns
  full-screen composition** and must justify why `TeachScreenShell` (or an
  existing approved screen-owned route) is insufficient.
- **cinematic** — Route C. A full-bleed visual/interaction experience that
  owns the viewport. Requires the same explicit **owns full-screen
  composition** grant plus justification, and (where it uses `CinematicShell`)
  the written shell justification.
- **composition-route** — the component *is* an approved route itself
  (`TeachScreenShell`), not a component rendered inside one.

`interaction-owned` and `cinematic` are the only classifications that grant
screen ownership, and only when the contract carries the explicit grant. A
component being interactive, distinctive or emotionally important is not by
itself sufficient — see `PATTERN_GOVERNANCE.md` → "Composition-ownership
rule". The declaration is machine-checked for new contracts by
`tests/architecture/screen-composition-governance.test.js`; the ten
pre-classification contracts are baselined there and add the line when next
touched (shrink-only).
