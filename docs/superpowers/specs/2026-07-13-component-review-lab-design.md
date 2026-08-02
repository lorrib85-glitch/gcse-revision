# Component Review Lab — design

**Date:** 2026-07-13
**Lane:** E (new app-level dev tool)
**Status:** approved-by-spec (user supplied an exhaustive requirements brief)

## Purpose

A temporary, development-only environment to **visually inspect** currently
unused, orphaned and one-off learning components using realistic GCSE content
on a ~390px mobile viewport, so the user can decide (later, separately) whether
to keep, repurpose, merge or delete them.

This is an **inspection environment, not a cleanup task**. It deletes nothing,
migrates nothing, changes no production module content, and makes no
architectural decision. It renders existing components through their existing
APIs with isolated fixtures.

## Access

> **⚠ SUPERSEDED — see "Addendum: the shipped access model (2026-08-02)" at the
> end of this document.** The DEV-gating described in this section was never
> shipped in this form. `src/App.jsx` reaches the lab in every build. The
> section below is retained as the original design intent.

- **Method:** `?componentReview=true` query flag, only honoured when
  `import.meta.env.DEV` is true.
- **Insertion point:** `src/App.jsx`. When the flag is present in DEV, `App`
  renders `<ComponentReviewLab />` **instead of** `<LegacyApp />`. This bypasses
  auth, onboarding, tabs and bottom-nav entirely — the lab is never a child of
  the learner tree and has no navigation into or out of the learner app.
- **Production exclusion:** the lab is referenced only through
  `import.meta.env.DEV ? lazy(() => import('./dev/componentReview/ComponentReviewLab.jsx')) : null`.
  In a production build `import.meta.env.DEV` is statically `false`, so the
  ternary folds to `null`, the dynamic `import()` inside the dead branch is
  never reached, and the lab chunk is not emitted. Production learners cannot
  reach it even by typing the flag.

## Learner-state isolation

Several reviewed components write to the weakness tracker on answer submission
(`DragToOrderTask`, `SpotTheError`, `MisconceptionCheck`, `EvacuationChainRoute`,
`MatchingTask`) via `unifiedWeaknessTracker.js` → `src/lib/storage.js`, which
namespaces every write under the **active account scope**.

The lab sets an isolated throwaway scope on mount:

```js
useEffect(() => {
  const prev = getActiveScope()
  setActiveScope('devreview')       // isolated namespace, never guest/uid
  return () => setActiveScope(prev)
}, [])
```

Consequences:
- Any interaction that logs a weakness writes to `devreview::…` physical keys.
- No `guest::` or `uid:…::` progress, weakness, mastery, planner or streak key
  is ever read or written while the lab is mounted.
- The `devreview` scope is never reconciled to Firestore — cloud sync
  (`progressSync`) only runs for signed-in `uid:` scopes via `AuthContext`,
  which the lab does not mount.
- No component API changes, no new logging code, no fake module registration.

The lab never calls any `save*` progress helper directly and registers no
modules in `MODULES`.

## Architecture

New directory `src/dev/componentReview/` (isolated from production learning code):

| File | Responsibility |
|------|----------------|
| `ComponentReviewLab.jsx` | Shell: index → single full-screen preview, prev/next, status filter, viewport indicator, reset/replay, scope isolation. |
| `reviewManifest.jsx` | Ordered array of review entries. Each entry carries review metadata **and** a `render(fixture, { onDone })` function that mounts the real component with correct prop wiring. Keeping wiring here means the shell stays component-agnostic and no component API is bent to fit a gallery. |
| `fixtures.js` | All fixture datasets (GCSE content), separate from production components and from metadata. |

### Manifest entry shape

```js
{
  id: 'galens-diagnostic',
  name: 'GalensDiagnostic',
  group: 'group1' | 'group2' | 'comparison',
  status: 'unused' | 'routed-unused' | 'one-off' | 'comparison',
  subject: 'History',            // drives accent of the info panel only
  function: 'Intended pedagogical function (one line).',
  usage: 'Current known usage (factual).',
  alternative: 'Closest existing alternative.',
  render: (fx, { onDone }) => <GalensDiagnostic block={fx} subject="History" onContinue={onDone} />,
  fixture: FIX.galensDiagnostic,
}
```

Review questions are the same seven for every component (per brief), rendered
from a shared constant — not duplicated per entry.

### Shell behaviour

- **Index view:** vertical list grouped by status, each row = component name +
  status chip + one-line function. Tap → preview.
- **Preview view:** fixed 390px-max column. Top: a compact **review info panel**
  (name, status, function, usage, closest alternative, the seven review
  questions in a collapsible block). Below: the live component preview in its
  own bounded frame. Prev/next move through the filtered list. Controls: back to
  index, reset preview state (remounts the component via a key bump), replay
  (same mechanism), viewport-width readout.
- **Status filter:** unused / one-off / comparison / all.
- One component is interactive at a time — never two side by side. Comparison is
  by fast prev/next between related entries, not simultaneous mounting.

### Theme

Dark cinematic, using `GENERAL` tokens for chrome and `SUBJECTS[subject].accent`
only for the per-component accent line in the info panel. No cyan/purple AI
styling, no glass stacks, no glow, no gamification, no desktop thumbnail grid.

## Components included

**Group 1 — unused / orphaned** (fixtures per brief): GalensDiagnostic,
TheoryLab, SymptomQualityDiagnostic, CinematicCarousel, GraphView (scatter +
line, two entries), TimelineChain, CircuitDiagram (open + closed in one
preview), DragToOrderTask (immune-response sequencing fixture).

**Group 2 — one-off:** ConnectionMap, OppositeQualitiesReveal, SymptomProgression,
TimelineCanvas, BeforeAfterImageSlider, EvacuationChainRoute, SpotTheError,
MedicalTheoryPrescription (representative fixtures / existing shapes).

**Comparison (not deletion candidates):** MatchingTask, VisualLearning,
GuidedChoiceCarousel, TheoryCompareBlock, MisconceptionCheck.

Fixtures reuse existing story/content shapes where they exist and are
GCSE-accurate; new fixtures (immune-response order, cholera/miasma TheoryLab,
organelle carousel, two GraphView datasets, germ-theory TimelineChain, circuit
states, symptom-quality) follow each component's documented block shape.

## Explicitly out of scope

No deletion, no route removal, no migrating invisible Medicine blocks, no
wiring `timelinedrag` to `DragToOrderTask`, no new/replacement components, no
redesign of reviewed components, no silent visual fixes, no deprecation calls,
no learner-facing navigation to the lab, no fake usage to inflate counts.

## Verification

`vite build`; `vitest run tests/architecture` (esp. storage-boundary — the lab
must not touch `localStorage` directly); browser walkthrough at 390px with
screenshots of the index and representative previews; `localStorage` snapshot
before/after interaction to confirm no `guest::`/`uid:` learner key changes;
console-error check; confirm normal Home loads without the flag.

---

## Addendum: the shipped access model (2026-08-02)

Recorded during the Phase 10 audit reconciliation. This addendum is authoritative
where it contradicts the "Access" section above.

### What actually ships

`src/App.jsx` contains **no `import.meta.env.DEV` gate**. The lab is:

- **reachable in every build, including production**, via either
  `?componentReview=true` or the "Component review lab" card in the History
  browser (`src/features/subjects/Subjects.jsx`);
- **lazily loaded** as its own chunk — `React.lazy(() => import('./dev/componentReview/ComponentReviewLab.jsx'))`
  behind `<Suspense>`, so a learner who never sets the flag never downloads it;
- **rendered instead of `<LegacyApp />`**, so it still bypasses auth,
  onboarding, tabs and bottom nav exactly as the original design required;
- still isolated to the throwaway `devreview` storage scope, so previews cannot
  touch real learner data.

This is deliberate: the lab is an owner-facing inspection tool that needs to work
against the deployed build, not only against a local dev server.

### The cost to keep watching

The emitted chunk is **`ComponentReviewLab-*.js` — 355.43 kB (105.73 kB gzip)**
as of `pnpm build` on 2026-08-02. The 2026-07-19 backlog note recorded ~88 kB /
26 kB gzip, so it has grown roughly fourfold as reference pages were added.

That is acceptable **only while it stays lazy**. Two rules follow:

1. Never import anything from `src/dev/componentReview/` from a learner-facing
   module — that would pull the lab into the main bundle.
2. Every new lab page grows this chunk. It is owner-facing weight, not learner
   weight, but it is still shipped and still served.

### Fonts decision — external Google Fonts retained

`index.html` loads its web fonts from `fonts.googleapis.com`. **Decision: keep
the external font link for now. Do not self-host in this phase.** Self-hosting
means committing font binaries and taking on a licensing/asset decision, which
belongs to a separate asset phase, not to an audit-hygiene phase.

Accurately recorded offline/proxied behaviour:

- In a network-restricted environment the stylesheet request fails
  (`ERR_CONNECTION_RESET` in the console) and the browser falls back to the
  next family in each CSS `font-family` stack, ending at the generic
  system font. Layout still renders; only the typeface changes.
- Nothing blocks: the link is a plain stylesheet with `display=swap`, so a
  failed font fetch never blocks first paint or interaction.
- The console noise is expected in that environment and is not a defect.

**Separately noted, not decided here:** the `index.html` font URL currently
requests **seven** families — Manrope, Sora, Outfit, Inter, Space Grotesk,
Caveat and IBM Plex Serif — while `docs/system/TYPOGRAPHY_SYSTEM.md` and
`CLAUDE.md` document only Manrope and Sora as the app's typefaces. Trimming the
request is a typography decision, tracked as **A13** in
`.planning/backlog/architecture-backlog.md`.
