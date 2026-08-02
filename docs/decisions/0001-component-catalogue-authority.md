# 0001 — One canonical component documentation source

**Status:** accepted
**Scope:** component governance — catalogue authority and component contracts

## The problem: one fact, many homes

A component's catalogue-level identity was authored in five independent places:

- `docs/components/COMPONENT_REGISTRY.md` — the human registry
- `docs/components/LOCKED_COMPONENTS.md` — the canonical lock list
- `CLAUDE.md` — per-component descriptions and `— LOCKED` reminders
- component source files — `LOCKED COMPONENT` banner comments
- `tests/architecture/component-registry-completeness.test.js` — a hardcoded
  list of family internals excluded from the completeness check

Nothing made them agree. `locked-component-registry.test.js` mirrored three of
the five in both directions, which is a symptom, not a fix: a mirror test is
what you build when you have accepted that the same fact is going to be written
down more than once. Every new component meant remembering five edits, and the
sixth place — the exclusion list in a test file — could hide a real standalone
component from the catalogue entirely.

## Decision 1 — one central, machine-readable catalogue

`src/component-catalogue/records/<stable-kebab-id>.js` is the single home for
every catalogue-level component fact: identity, source path, purpose, props,
data shape, dependencies, consumers, usage boundaries, lifecycle, selection
guidance and contract. One plain serialisable record per public component.

`schema.js` defines and validates the shape centrally, with closed enums for
`section`, `kind`, `lifecycle`, `criticality`, rhythm role and evidence kind. The
validator is small, explicit and tested rather than a new dependency — the repo
had no schema library, and adding one to validate fourteen fields would have
been a worse trade than the ~200 lines it replaces.

The directory is **build-time governance data**. Production source must never
import it, and the integrity test proves it does not by sweeping all of `src/**`
— derived from the filesystem, so a new top-level runtime folder is covered the
day it is created rather than the day someone remembers to list it.

`src/dev/**` is inside that boundary, not outside it. The Component Lab is
lazy-imported by `src/App.jsx` behind a query flag, so it ships as a real chunk
of the production build; learners simply never download it. "Rarely fetched" is
not "not bundled". When the Lab genuinely moves outside the production
application, that can be proved and the exclusion revisited.

## Decision 2 — the human registry is generated

`scripts/generate-component-catalogue.mjs` renders
`docs/components/COMPONENT_REGISTRY.md` deterministically from the records. It
has no clock, no environment reads and no absolute paths, so the same records
always produce the same bytes.

- `pnpm catalogue:generate` writes the document.
- `pnpm catalogue:check` regenerates in memory and compares byte-for-byte,
  failing without rewriting anything. It runs first in `pnpm verify` and in CI.

A generated document cannot drift from its source, which is the entire point.
The markdown is now a projection, not a second authority.

## Decision 3 — a record justifies its own location

Most components live under `src/components/**`. A few are governed but live
elsewhere — today exactly one, `HomeAtmosphere` in `src/features/home/Home.jsx`.

Each record carries a single nullable `outOfRootReason`, and the validator
derives the rest from the record's own `source` path: it must be null for
anything under `src/components/**`, and a real justification for anything
outside it. There is no allowlist anywhere, so adding a governed feature-level
component is one edit — the record — rather than a record plus a coordinated
edit to an architecture test. An allowlist in the test would have been the same
"one fact, two homes" pattern this decision exists to remove.

*Where* a component lives is not recorded, because `source` already says it, and
its semantic role is already carried by `section` and `kind`. An earlier draft
had `scope: { location, reason }`; the location repeated the path classification
across 83 records and gave the validator nothing to do but confirm the
redundancy.

## Decision 4 — internal file ownership moves into the owning record

The `FAMILY_INTERNALS` / `FILE_INTERNALS` maps that lived in a test now live in
each owner's `ownership` field. Every internal path must exist, must have
exactly one owner, and must carry a real reason. A directory ownership rule may
not hide a public standalone component.

This closes the worst failure mode of the old design: the exclusion list was
maintained by whoever was making the completeness test pass, not by whoever
owned the component family.

## Decision 5 — there are no locked components

A rule can be constitutional; a whole component file cannot. "Locked" answered
the wrong question — it gated *which file you touched*, not *what you changed* —
so an import-path fix and a redesign of the answer flow needed the same
ceremony, and the ceremony was therefore ignored.

Each record now carries a **contract**:

- `criticality` — `standard` or `critical`.
- `rationale` — why accidental change is costly (critical only).
- `invariants` — precise behavioural or product rules, each with a stable id and
  at least one honest evidence item.
- `exclusivity` — nullable. Where a component is the sole implementation of an
  app-wide pattern (`back-navigation`, `primary-progression-cta`,
  `cinematic-reveal-cta`, `exit-navigation`, `chapter-progress-rail`,
  `local-sequence-progress`, `save-failure-surface`), naming the prohibited
  alternatives. `ScreenText` is deliberately `critical` *without* exclusivity:
  `TeachScreenShell` is a second canonical screen-heading owner in the same
  governed set, so claiming sole implementation would be false.
- `requiresProductDecision` — the *changes* that need sign-off.

The `standard` shape is deliberately empty: a component that genuinely needs an
invariant or an exclusivity rule is `critical`, and the schema enforces that
split rather than letting a middle tier accumulate. That rule cuts both ways — a
hard rule left sitting in free-text `documentation.governanceRules` is invisible
to tooling, indistinguishable from an ordinary note. `SaveFailureNotice`,
`ScreenText` and `CalculationBreakdown` each carried an already-made decision in
prose and are now structurally `critical`: their invariants were decided when
the rule was written, not deferred to a future review.

### Evidence must be honest

An invariant's evidence is `test`, `story` or `review`. Most of these contracts
are visual or behavioural rules that no current test asserts, so they carry
`review` evidence naming the specific check a reviewer must run. Claiming
automated enforcement that does not exist would be worse than admitting the gap:
it would let a reviewer skip the check believing CI had it covered.

## Decision 6 — the gate is on what changes, not which file is touched

Product approval is required only when a change affects a documented invariant,
an exclusivity rule, the public API, a learner flow, or product identity.
Internal implementation changes that preserve a component's documented contract
are ordinary development work.

## Phase boundaries — what this deliberately does not do

**Runtime authoring and pedagogical projections are not migrated.** Authorable
screen and block types stay in `src/data/screenRegistry.js`; function tags and
interaction classes stay in `src/data/componentFunctions.js`; routing stays in
`ScreenRenderer.jsx`; the Component Lab manifests stay as they are. None of
those facts are copied into the catalogue.

Copying them now would have recreated the problem this decision exists to solve:
two homes for one fact, with a generator making the duplication feel safe. They
are genuinely different questions — *what is this component* versus *may an
author place it in a `screens` array* — and the second one has live runtime
consumers and its own architecture test. Migrating it needs its own phase, with
its own guard, moving the authority rather than mirroring it.

**Component Lab access is parked.** `src/App.jsx`,
`src/features/subjects/Subjects.jsx`, `src/dev/componentReview/**` and the
Storybook configuration are untouched. The Lab's own `LOCKED.` labels in
`ButtonsAndProgressPage.jsx` are the one place the old vocabulary survives; they
move when the Lab does.

**Retired components get no tombstones.** The active catalogue contains current
components only. `VisualNarrativeScreen` stays retired in `CLAUDE.md`, and the
`visualNarrative` compatibility mapper is untouched.

## Consequences

- Adding a component means adding one record and regenerating. The integrity
  test fails if the record is missing, and `catalogue:check` fails if the
  registry is stale.
- `docs/components/LOCKED_COMPONENTS.md` is deleted.
  `component-registry-completeness.test.js` and
  `locked-component-registry.test.js` are replaced by
  `component-catalogue-integrity.test.js`.
- `CLAUDE.md` describes layers, not individual components, and points at the
  catalogue.
- Contracts that current governance stated too vaguely to turn into an honest
  invariant were not invented. Where a Decision block would need a product-level
  pedagogical judgement current sources do not settle, it is recorded as
  `pending` with a reason.
