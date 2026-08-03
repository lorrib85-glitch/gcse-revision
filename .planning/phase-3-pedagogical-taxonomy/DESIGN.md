# Phase 3 — design

## Authority direction

Pedagogical classification becomes a catalogue fact, authored on each
**authoring entry** (settled decision 1):

- catalogue records: `authoring.entries[].pedagogy`
- compatibility types: `pedagogy` on each `AUTHORING_COMPATIBILITY` entry
  (settled decision 2 — the compatibility entry *is* their authoring entry)

`src/data/componentFunctions.js` stops authoring taxonomy data and becomes a
thin compatibility API over a generated projection, exactly as
`screenRegistry.js` did in Phase 2. `contentQualityChecks.js`, the content
quality test, and the Lab manifest are untouched by the flip.

## Canonical schema

### Authoring entries (schema.js)

```js
pedagogy: {
  functions: ['sequence-process', 'apply'],   // ≥1, ordered, from the vocabulary
  interaction: 'assessed',                    // 'passive' | 'reveal' | 'assessed'
}
```

Required on **every** authoring entry — active, derived and renderer-owned
alike. Validation added to `validateAuthoringEntry`:

- `pedagogy` present and a plain object; only `functions` + `interaction` keys
- `functions`: non-empty array (matches the current test's `length > 0` floor),
  no duplicates, every value in the canonical vocabulary
- `interaction`: one of the three classes
- a record with `authoring: null` may not carry pedagogy anywhere (no orphan
  facts on non-authorable records)

### Vocabulary

`FUNCTION_TAGS` moves to a small authored build-time module,
`src/component-catalogue/pedagogyVocabulary.js` (nine tags, canonical order).
`schema.js` imports it for validation; the generator projects it verbatim so
the runtime export preserves today's exact order (the regression test asserts
the order literally).

### Compatibility entries (authoringCompatibility.js)

Same `pedagogy` shape added to each of the four entries, initial values copied
byte-for-byte from today's flat map (settled decision 3 — the legacy `assessed`
classifications migrate unchanged; their meaningfulness is D3, deferred).

### Non-authoring classifications

Pending D1. If approved, a third authored surface carries them:
`src/component-catalogue/migrations/nonAuthoringPedagogy.js`, one entry per
type with `type`, `pedagogy`, `reason`, `removalCondition` — mirroring the
compatibility registry's shrinking-set discipline. Expected content: exactly
`calculationBreakdown` (whose removal condition is Phase 4 giving the Lab a
manual interaction or an authoring route).

## Generated artifact

**`src/data/generated/componentPedagogyRegistry.js`** — a separate lean file,
NOT an extension of `componentAuthoringRegistry.js`. Reasons:

- the authoring registry feeds `screenRegistry.js`, which is on the learner
  path; pedagogy has **no learner-runtime consumer** (census §1), so putting it
  there would grow the learner bundle for nothing;
- keeping it separate means the cost lands only in chunks that import
  `componentFunctions.js` — today, the Lab chunk and build-time code.

Shape:

```js
export const FUNCTION_TAGS = Object.freeze([...])          // projected vocabulary
export const SCREEN_TYPE_PEDAGOGY = Object.freeze({ ... }) // per screen type
export const BLOCK_TYPE_PEDAGOGY = Object.freeze({ ... })  // per block type
export const NON_AUTHORING_PEDAGOGY = Object.freeze({ ... }) // D1-dependent
```

Same construction rules as Phase 2's projection: generated header, no imports,
no governance prose, frozen literals, sorted keys, deterministic bytes.
Generator: `scripts/generate-pedagogy-registry.mjs` with
`pnpm pedagogy:generate` / `pnpm pedagogy:check`, wired into `verify` beside
`authoring:check`.

### Flat-view construction and collision precedence

The generator also emits the merged flat map the compatibility API needs:

```js
export const SCREEN_TYPE_FUNCTIONS = Object.freeze({ ... }) // flat compatibility view
```

built as blocks ∪ screens ∪ non-authoring. For the four colliding types the
generator **asserts the two namespace facts are deep-equal and fails the build
if they ever diverge**. That makes precedence unnecessary while the flat view
exists, guarantees `getTypeInfo()` never silently picks a side, and turns
"first divergence" into a forced, visible migration of the flat view's
consumers to level-aware helpers. The flat view is exactly reproducible today
because both sides of every collision inherit the same flat value.

## Thin componentFunctions.js

```js
import {
  FUNCTION_TAGS, SCREEN_TYPE_FUNCTIONS,
  SCREEN_TYPE_PEDAGOGY, BLOCK_TYPE_PEDAGOGY,
} from './generated/componentPedagogyRegistry.js'

export { FUNCTION_TAGS, SCREEN_TYPE_FUNCTIONS }

export function getTypeInfo(type) { return SCREEN_TYPE_FUNCTIONS[type] ?? null }
export function isPassive(type) { return getTypeInfo(type)?.interaction === 'passive' }
export function isAssessed(type) { return getTypeInfo(type)?.interaction === 'assessed' }

// Level-aware helpers — the forward path; adopted by consumers in their own phases
export function getScreenTypeInfo(type) { return SCREEN_TYPE_PEDAGOGY[type] ?? null }
export function getBlockTypeInfo(type) { return BLOCK_TYPE_PEDAGOGY[type] ?? null }
```

- **Public API preserved exactly**: all five current exports keep their names,
  signatures and outputs, so `content-quality.test.js` passes unmodified — the
  unchanged-test acceptance criterion.
- `getTypeInfo` stays as the compatibility helper. Its answer is well-defined
  as long as the flat view exists, because the generator forbids divergence;
  the day a collision needs different facts per level, the generator fails,
  and the resolution is migrating `contentQualityChecks.js` (which mixes
  screen and block types in one list) to the level-aware helpers — a later,
  deliberate change, not part of Phase 3.
- The two new level-aware helpers ship in Phase 3 but gain consumers later
  (Phase 4 Lab, future level-aware quality checks).
- The file keeps its header prose free of `ChapterGateLayer` /
  `ChapterBottomNavigation` so the private-family text-scan test stays green.

## Runtime import boundary

Unchanged from Phase 2: production source never imports
`src/component-catalogue/**`; the projection imports nothing and carries no
governance prose; the same specifier-scoped guard covers the new generated
file automatically (it sweeps all of `src/`), plus an explicit no-import/no-prose
assertion mirroring the authoring projection's.

## Human registry projection

`generate-component-catalogue.mjs` renders pedagogy inside each existing
Authoring block:

```
- **Screen type:** `cinematic` — Cinematic reveal moment
  ...
  - Pedagogy: hook-tension · passive
```

and adds a Pedagogy column (functions · interaction) to the compatibility
appendix. If D1 keeps `calculationBreakdown`, the appendix gains a short
generated "non-authoring classifications" table with reason and removal
condition. The generator's line 79 ("answered by `componentFunctions.js`") and
lines 93-95 ("remaining phase boundary") are rewritten to describe the new
authority — the exact class of stale-generated-prose defect the Phase 2 seal
fixed; this time it goes in the flip itself.

## Parity architecture

Baselines captured at `5fd92ff` (census §6, committed under `baselines/`).

1. **Taxonomy parity** — a script regenerates the same structure from the
   post-flip API (`FUNCTION_TAGS` order, per-type functions order, interaction,
   all three helper outputs per type, unknown-type behaviour) and diffs it
   against `taxonomy-baseline.json`. Expected differences: exactly the D1-approved
   removals (`choice`, `truefalse`, `connection` if approved) and nothing else.
   Each approved difference is listed explicitly in the parity script, so an
   unexpected delta still fails.
   **Flat→namespaced mapping rule:** each old flat key maps to the namespace(s)
   where the type has an authoring entry; the four colliding keys map to both
   namespaces with identical values; non-authoring keys map to
   `NON_AUTHORING_PEDAGOGY` (D1).
2. **Consumer-visible quality parity** — re-run the baseline capture script
   post-flip and byte-compare against `quality-output-baseline.json` (all 60
   chapters: guardrail objects, fingerprints, passive-run/stage/exam-prep
   findings, sentence-case output). D1/D2 outcomes must not change this file at
   all: the removed keys are never consulted by quality checks, and D2's new
   coverage only affects types with zero authored uses.
3. **Unchanged-test criterion** — `tests/architecture/content-quality.test.js`
   passes with an empty diff. It is not edited for the migration.

## Guard architecture

New suite `tests/architecture/pedagogy-registry-integrity.test.js`, all guards
derived from the catalogue + compatibility registry + projection (no hardcoded
type lists). Each guard's mutation test is specified in
`IMPLEMENTATION-PLAN.md` §5.

1. every active screen authoring entry has exactly one `pedagogy`
2. every active block authoring entry has exactly one
3. every derived entry has exactly one
4. every compatibility entry has exactly one, in `authoringCompatibility.js`
5. no retired/unregistered type enters the projection (projected keys ⊆
   authoring entries ∪ compatibility ∪ approved non-authoring set)
6. screen and block namespaces are distinct objects; colliding keys carry
   independent facts; the flat view's divergence assertion holds
7. every `functions` value belongs to the projected vocabulary, which equals
   the authored vocabulary
8. every `interaction` is one of the three classes
9. no pedagogy fact exists without an owning authoring/compatibility entry,
   except the D1-approved non-authoring population, each member carrying a
   reason and removal condition
10. renderer-owned types carry pedagogy on ScreenRenderer's authoring entries;
    no fake component records exist for them
11. `componentFunctions.js` authors no taxonomy data (no object literals with
    `functions:`/`interaction:`; imports only the generated projection)
12. the generated projection has no imports and no governance prose
13. schema-level: an authoring entry without `pedagogy` fails validation
    (proved by mutating a real record in-memory, Phase 2 style)
14. a compatibility entry without `pedagogy` fails (same in-memory technique)
15. the human registry renders every canonical pedagogy fact exactly once
    (derived from entries, occurrence-counted in the markdown — the Phase 2
    seal-guard pattern)

## Bundle implications

`componentFunctions.js` is currently reachable only from the Lab chunk and
build-time code; the flip keeps that topology (the projection is imported only
by `componentFunctions.js`). Learner-path chunks must not grow: the
implementation plan's bundle check builds before/after and asserts the
pedagogy registry lands outside the entry chunk (`dist/assets/index-*.js`
content check), with total-size comparison recorded in the seal evidence.
