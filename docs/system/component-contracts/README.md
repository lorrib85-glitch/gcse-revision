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
