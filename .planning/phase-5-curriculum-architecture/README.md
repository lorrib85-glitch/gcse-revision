# Phase 5A — canonical curriculum architecture

**Planning and measurement only.** No production behaviour, authored curriculum
content, learner-facing UI, progress storage, component routing or generated
runtime registry was changed.

Baseline SHA: `9dc4e875a146fbe4ea44992fb31bc5a81023e765` (`main`).

---

## Read in this order

| Document | What it is |
|---|---|
| [`CENSUS.md`](CENSUS.md) | The evidence. Baseline counts, verification status, the authority and duplication matrix, and 20 recorded anomalies. |
| [`DESIGN.md`](DESIGN.md) | The design. Domain boundary, the relational upper model, entity definitions, ID rules, the ownership table, catalogue boundaries. |
| [`MODELS.md`](MODELS.md) | Eleven target qualifications modelled in the entity shapes — architecture tests written as documents. |
| [`DECISIONS.md`](DECISIONS.md) | 13 architectural decisions settled in Phase 5A; 5 product decisions settled before Stage 0 (OD-1, OD-4, OD-5, OD-7, OD-8); 5 still open with an owner, a default and what happens meanwhile. |
| [`IMPLEMENTATION-PLAN.md`](IMPLEMENTATION-PLAN.md) | The six-stage compatibility migration. Nothing in it runs in this phase. |
| [`../../docs/decisions/0002-canonical-curriculum-architecture.md`](../../docs/decisions/0002-canonical-curriculum-architecture.md) | The ADR. |

## Generated artefacts

| Path | Regenerate with |
|---|---|
| `baselines/current-curriculum-baseline.json` | `node .planning/phase-5-curriculum-architecture/scripts/generate-curriculum-baseline.mjs` |
| `census/migration-census.json`, `census/MIGRATION_CENSUS.md` | `node .planning/phase-5-curriculum-architecture/scripts/generate-migration-census.mjs` |

Both accept `--check`, which regenerates in memory and compares byte-for-byte
without writing. Neither reads a clock, an environment variable or an absolute
path, so the same tree always produces the same bytes.

`census/entity-classifications.js` is the **authored** input to the second
generator. The generator fails if a live entity is unclassified, if a
classification names an entity that no longer exists, or if any entry carries an
empty note — which is what makes "nothing is left to inference during
implementation" a checked property rather than a promise.

Neither script is wired into `pnpm verify`. They are planning tooling, not
governance, and they import `src/**` read-only.

## Headline findings

- **60 chapters** (30 available, 29 coming soon, 1 hidden), **7 modules**,
  **60 loaders**, **87 concepts**, **9 theme keys**, **12 synthetic cards**.
- `pnpm verify` runs **9 steps**, checks **4 generated artefacts**, and **all
  four are component-domain**. No curriculum fact is generated or checked today.
- Of the curriculum facts in the system: **3** have one owner with a test that
  enforces it, **6** are authored twice with a drift test, and **11** are
  authored more than once with no test across the boundary at all.
- **171 entities** classified, no gaps.
- **20 anomalies** recorded, none normalised and none fixed.

## What was not done, on purpose

- Component Platform v1 was read, not reassessed.
- No anomaly was corrected — including the two that are one-line fixes.
- `docs/system/CONTENT_HIERARCHY.md` was not edited, including the statement
  recorded as A-17 that the code does not support. Rewriting active governance
  is not a planning-phase change.
- No production curriculum catalogue, no replacement of `MODULES` or `CHAPTERS`,
  no generated chapter loader registry, no UI change, no progress-key change,
  no content rewrite, no renaming.
