# System Index

**Version:** v1 — Locked Foundation  
**Scope:** All design and development decisions in this codebase

> **Process note:** This index governs *what* gets built and how it must
> look. For *how work is approached* — pipeline selection, planning, review
> and verification steps — see `docs/system/DEVELOPMENT_WORKFLOW.md`.

---

## Order of Authority

Consult documents in this order before making any UI change.

---

### 1. Product UI Constitution

`docs/system/PRODUCT_UI_CONSTITUTION.md`

The product's supreme design law. Defines product identity, global colour tokens, layout constraints, typography rules, and the final build standard. **All decisions trace back here.** If it contradicts anything else, the Constitution wins.

---

### 1b. General App UI Constitution (Non-Subject Pages)

`docs/system/GENERAL_APP_UI_CONSTITUTION.md`

Governs Home, the Subjects/Modules browser, Progress, Exam landing/navigation, onboarding, and the bottom navigation shell — every screen that is not in-module subject content. Sets the tone for these pages: editorial, restrained, composition over containers, typography-led CTAs, and intelligent personalisation copy. In-module subject content remains governed by the Product UI Constitution and the Subject Theme System.

---

### 1c. Content Hierarchy

`docs/system/CONTENT_HIERARCHY.md`

The canonical structural contract for `Subject → Module → Chapter → Screen → Component`. Defines what each level owns, the chapter-authoring boundary, relationship rules, stable progress identity, and the final canonical ownership boundaries for modules, chapters, screens and components. Read before changing content metadata, chapter runtime, navigation, discovery, progress or component routing.

---

### 1c.1. Governed Screen Registry

`docs/system/SCREEN_REGISTRY.md`

The canonical chapter authoring and runtime-routing contract. Defines the registered screen/block catalogue, required data validation, ScreenRenderer boundary, development failure behaviour and legacy-type shrink-only rules. Read before adding a screen type or changing ChapterPlayer component routing.

---

### 1d. Subject Module Architecture (History & Science)

`docs/system/HISTORY_MODULE_ARCHITECTURE.md`
`docs/system/SCIENCE_MODULE_BLUEPRINT.md`

Locked chapter/module structure rules for History and Science (Biology, Chemistry, Physics) content. Loaded on demand — see "Subject Module Architecture" in `CLAUDE.md` for when each applies. Do not build or edit subject module content without reading the relevant file first.

---

### 1e. Content Build Template

`docs/system/CONTENT_BUILD_TEMPLATE.md`

Story-unit rhythm and machine-checked quality floor for all module content. Layers inside the locked module architectures in 1d — those docs own section structure; this doc owns the rhythm and quality floor inside the sections.

---

### 1f. Pattern Governance

`docs/system/PATTERN_GOVERNANCE.md`

Governs how every element is placed on a learning screen: the taxonomy chain (learning objective → screen intent → approved component → execution contract → gold example), the one-primary-intent hard rule, the intent→component map, the 9-field contract format, the mandatory render pass, and the review-to-rebuild pathway. Sits above `docs/system/component-contracts/`. Enforced by the content-create/content-review skills and the Workflow C/E critique gate.

---

### 1g. Gold Screen Register

`docs/system/GOLD_SCREEN_REGISTER.md`

The calibration layer under Pattern Governance and the component contracts. For each governed component it names the one composed runtime screen — verified at 390px in the real render path — that every content review and rebuild is measured against, plus a below-bar counterexample. A screen may only be named gold after its composed render has been reviewed; where none clears the bar the register says "No verified composed gold example yet" and treats creating one as explicit debt. Consumed by the content-create build chain and the content-review render pass.

---

### 2. Component Authoring Rules

`docs/system/COMPONENT_AUTHORING_RULES.md`

Mandatory rules for creating, editing, and migrating any component. Required imports, forbidden patterns, no-redesign-during-refactor rule, and locked component protocols. Must be read before touching any component file.

---

### 3. Foundation Systems

Locked constant layers. Every component must import tokens from these files. No local duplication is permitted.

| System | Doc | Source file |
|--------|-----|-------------|
| Spacing | `docs/system/SPACING_SYSTEM.md` | `src/constants/spacing.js` |
| Subject Themes | `docs/system/SUBJECT_THEME_SYSTEM.md` | `src/constants/subjects.js` |
| Buttons & Radii | `docs/system/BUTTON_RADII_SYSTEM.md` | `src/constants/buttons.js` + `src/constants/radii.js` |
| Motion | `docs/system/MOTION_SYSTEM.md` | `src/constants/motion.js` |
| Typography | `docs/system/TYPOGRAPHY_SYSTEM.md` | `src/constants/typography.js` |
| Screen Shells | `docs/system/SCREEN_SHELL_SYSTEM.md` | `src/components/layout/ContentShell.jsx` + `InteractionShell.jsx` + `CinematicShell.jsx` (structural), `src/components/core/TeachScreenShell.jsx` (teaching composition) |

---

### 4. Component catalogue

`src/component-catalogue/records/` — authored · `docs/components/COMPONENT_REGISTRY.md` — generated

The single home for every catalogue-level component fact: identity, source path, purpose, props, dependencies, lifecycle, selection guidance and contract. One record per public component; private family internals are owned by their public record. Check here before building anything new.

`docs/components/COMPONENT_REGISTRY.md` is generated from the records by `pnpm catalogue:generate` and must never be hand-edited; `pnpm catalogue:check` fails if it drifts. Integrity is enforced by `tests/architecture/component-catalogue-integrity.test.js`.

The authorable screen/block contract is a catalogue fact: each record's `authoring` block declares the types its component implements, and `src/data/generated/componentAuthoringRegistry.js` is projected from those blocks plus `src/component-catalogue/migrations/authoringCompatibility.js`. `src/data/screenRegistry.js` re-exports that projection and owns only the handwritten helpers. The machine-readable pedagogical taxonomy is still deliberately not duplicated in the catalogue: it stays in `src/data/componentFunctions.js` until its own migration phase.

---

### 4b. Component contracts

There are no locked components. A rule can be constitutional; a whole component file cannot.

Each catalogue record carries a contract: `criticality` (`standard` or `critical`), invariants with evidence, an optional app-wide `exclusivity` rule, and the *changes* that require a product decision. Internal changes preserving a documented contract are ordinary development work. Read the record before changing a component.

---

### 5. Individual Component Specs

`docs/components/` · `docs/system/component-contracts/` · `docs/system/CONCEPT_REVEAL_CONTRACT.md`

Per-component documentation and execution contracts, added as components are created or significantly updated. Component contracts sit under `PATTERN_GOVERNANCE.md` (1f). `CONCEPT_REVEAL_CONTRACT.md` is a locked design contract governed outside the locked-component registry, enforced by `tests/architecture/concept-reveal-contract.test.js`.

---

## Supporting references

Active documentation that is not part of the UI order of authority above. Read
when working in the named area; none of it overrides sections 1–5.

**Implemented systems — authoritative for their own area:**

| Doc | Area | Enforcement |
|-----|------|-------------|
| `docs/system/QUESTION_BANK_CONTRACT.md` | question metadata contract, `type` vs `format`, difficulty scale | `tests/architecture/question-bank-schema.test.js` |
| `docs/system/LEARNING_GRAPH.md` | concept vocabulary, facet tags, tag inheritance | `tests/architecture/learning-graph.test.js` |
| `docs/system/MASTERY_ENGINE.md` | per-concept evidence, derived mastery, consumer allowlist | `tests/architecture/mastery-engine.test.js` |
| `docs/system/PROGRESS_SYNC_ARCHITECTURE.md` | account scoping, guest claims, storage boundary | `tests/architecture/storage-boundary.test.js` |
| `docs/system/AUTH_SETUP.md` | Google sign-in, Firestore progress backup | Firestore rules tests |

**Design-only — describes an intended layer, authorises no implementation:**

- `docs/system/PEDAGOGICAL_MODEL.md`
- `docs/system/EVIDENCE_MODEL.md`
- `docs/system/LEARNING_OBJECTIVE_LAYER.md`
- `docs/system/ADAPTIVE_TUTOR_DECISION_LOGIC.md`
- `docs/system/AI_INTERPRETATION_BOUNDARY.md`

Each of these carries a **Status: Design only** header. Reading one is not
permission to build it; that needs an explicit request.

---

## Archive

`docs/archive/` is searchable history. It contains retired workflow docs,
superseded architecture specs, and one-off fix summaries. The archive is
**not authoritative** — it must never override `docs/system/`, `CLAUDE.md`,
or `docs/components/`. When an archived file conflicts with an active system
doc, the active doc wins. Do not treat archive content as current guidance.

---

## Pre-Change Checklist

Before making any UI change, confirm:

1. **Philosophy** — does this respect the product identity in `PRODUCT_UI_CONSTITUTION.md`?
2. **Hierarchy** — does this preserve `Subject → Module → Chapter → Screen → Component` as defined in `CONTENT_HIERARCHY.md`?
3. **Rules** — does this follow all authoring rules in `COMPONENT_AUTHORING_RULES.md`?
4. **Tokens** — am I using tokens from the relevant Foundation System doc?
5. **Existing components** — does something in the component catalogue already cover this?
6. **Contracts** — read the component's catalogue record: does this change touch a documented invariant, exclusivity rule or public API?

**When in doubt: go simpler, darker, calmer, and less decorated.**
