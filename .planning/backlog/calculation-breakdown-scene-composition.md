# CalculationBreakdown — scene composition and wider equation shapes

**Status:** Discussion complete, awaiting scope lock — no code written
**Lane:** E (Big Build — new architecture pattern)
**Supersedes:** the internals freeze recorded in `docs/components/COMPONENT_REGISTRY.md`
(commit `0c06e99`). That entry must be revised as part of Phase 0 if this is built.

## The need

The four algebra presentations are currently four fixed multi-screen sequences.
A calculation gets all of a variant or none of it. The requirement is that each
scene be independently selectable and adaptable, that scenes be mixable across
families, and that the models describe more than two equation shapes.

## What is already in place

`CalculationVisualModel` is scene-agnostic. It consumes exactly eleven keys off
a scene descriptor — `id, label, heading, intro, announce, summary, reasoning,
initialState, requiresDecision, continueLabel, render` — and knows nothing about
variants beyond a four-entry lookup table. It will render any array of scene
descriptors from any source.

The render layer is therefore not the constraint. The constraints are:

1. **Selection is all-or-nothing.** `presentation.variant` picks a builder that
   returns a fixed array.
2. **Scenes are closure-bound.** Each builder derives `model`, `why`, `split`,
   `undoStages` once; every scene closes over them.
3. **No cross-family mixing.** Scene builders are keyed by variant.
4. **Scene copy is derived, not authorable** — only `reasoning` is overridable.

## Key insight — one model, not four

The four model shapes are already special cases of a single canonical form:

```js
{ variable: 'x', operations: [{ type, value }, …], result: <number> }
```

meaning "these operations were applied to the variable, in this order, giving
this result".

| Presentation | Today's model | As the canonical form |
|---|---|---|
| `algebraWhy` | `{ variable, coefficient, total }` | `operations: [{multiply, coefficient}]`, `result: total` |
| `groupSplit` | `{ variable, groupCount, total }` | identical to the above (`groupCount` ≡ `coefficient`) |
| `inverseMachine` | `{ variable, operations, result }` | already canonical |
| `balance` | authored display strings + operation token | derivable from the chain, one state per operation undone |

Everything else is derived, not stored: `solution` via `solveByUndoing`,
`coefficient` when the chain is exactly one multiply, group counts, and the
balance's left/right display strings.

### This widens the equation shapes for free

Verified against the existing helpers, unchanged:

| Equation | `operations` | Solves to | Forward replay |
|---|---|---|---|
| `3x = 18` | `[×3]` | 6 | OK |
| `3x + 4 = 19` | `[×3, +4]` | 5 | OK |
| `3x − 4 = 11` | `[×3, −4]` | 5 | OK |
| `x/3 = 6` | `[÷3]` | 18 | OK |
| `2(x + 3) = 14` | `[+3, ×2]` | 4 | OK |

`2(x + 3)` works because the model is ordered: add 3 first, then multiply by 2 —
which is exactly what the bracket means. No new maths is required for Phase 4;
it is content, validation range and tests.

**Explicitly out of scope:** variables on both sides (`3x − 4 = 2x + 7`). That
needs a different model entirely, and the standard walkthrough already covers it.

## Scene capability

Not every scene can run on every model, so each registered scene declares a
`supports(model)` predicate:

- `readAlgebra`, `shareIntoGroups` — require a chain of exactly one `multiply`
  whose division is exact, i.e. `ax = b` only.
- `chooseInverse`, `undoStep`, `replayCheck` — any chain.
- `balanceChoose`, `balanceApply` — any chain; one state per operation undone.

Validation checks each requested scene against the resolved model and refuses
with a precise reason, falling back to the standard walkthrough. This extends the
existing "refuse, do not approximate" rule rather than replacing it.

## Proposed contract

```js
// Preset — unchanged for every existing block and all 13 stories
presentation: { variant: 'algebraWhy', model: { variable: 'x', coefficient: 3, total: 18 } }

// Composed — new
presentation: {
  model: { variable: 'x', operations: [{ type: 'multiply', value: 3 }], result: 18 },
  scenes: [
    { type: 'readAlgebra' },
    { type: 'chooseInverse' },
    { type: 'shareIntoGroups' },
    { type: 'balanceApply' },      // cross-family mixing
    { type: 'revealAndCheck' },
  ],
}
```

`variant` is demoted to a preset that expands to a canonical scene list. Legacy
model shapes (`coefficient`/`total`, `groupCount`/`total`, `states`) are mapped
onto the canonical form by an adapter, so nothing authored today changes.

## Phasing

| Phase | Delivers | Risk |
|---|---|---|
| 0 | Revise the Registry freeze entry to say composition is in progress | None |
| 1 | Canonical model + derivations + legacy adapter; four presets still pass every existing test | Medium — the adapter is where backwards compatibility lives or dies |
| 2 | Scene registry: one entry per scene type with its own builder, model needs and `supports()` | Low — mostly moving existing builder bodies |
| 3 | `presentation.scenes` authoring, per-scene overrides, cross-scene consistency validation, refusal reasons | Medium |
| 4 | Widened shapes: stories, lab variants and tests for `3x − 4 = 11`, `x/3 = 6`, `2(x + 3) = 14` | Low — no new maths |

Phases 1–3 should land together or not at all; a half-migrated model is worse
than either end state. Phase 4 is genuinely separable.

## What survives untouched

The scene runner, all figures, `OperationChoice`, the verdict/reasoning split,
every pure maths helper, the reasoning rail's persistence, the keyboard-completable
group split, and CheckAnswerCTA/ContinueCTA governance.

## Decisions still open

1. Do per-scene `model` overrides merge onto the presentation model, or replace
   it? (Recommendation: merge, then cross-validate for contradiction.)
2. Does a composed sequence still require at least one `requiresDecision` scene?
   (Recommendation: yes — validation should refuse an all-passive sequence, since
   "commit to one decision before the answer appears" is a stated principle.)
3. Should presets remain authorable at all once composition exists, or become
   internal-only shorthand? (Recommendation: keep them — they carry the reviewed
   teaching sequences.)
