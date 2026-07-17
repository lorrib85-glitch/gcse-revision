# MemoryHook — design

**Date:** 2026-07-17 · **Lane:** E (new reusable component) · **Status:** approved for build (explicit user request this session, with visual reference)

## User story

As a GCSE student, I want a small in-page "memory hook" reminder — an analogy or
mnemonic for the idea I'm learning — that I can rewrite in my own words, so the
idea sticks and I can recall it in the exam.

## Visual reference

Uploaded screenshot: a dark card with a square thumbnail on the left, a
"Memory hook" label and short analogy text on the right ("Think of a virus as a
tiny 'hacker' that sneaks in, takes over, and makes copies of itself."), and a
pencil edit button in the top-right corner, under a "Make it stick" section
label.

## Confirmed facts

- This is an inline **content component** (Route A) — it sits *within* pages,
  never owns a screen. Rendered inside composed screens / ModulePlayer content
  flow, block type `memoryHook`.
- Closest existing siblings: `AcronymMemorise` (its all-viewed footer already
  renders a one-off "Make it stick" memory-hook box — this component
  generalises that visual language into a standalone, reusable block) and
  `KeyPoint` (the takeaway rule box — a *different* pedagogical job).
- The uppercase eyebrow pattern in the reference visual is **prohibited** in
  this codebase (`TYPOGRAPHY_SYSTEM.md` — label case). Labels render sentence
  case via `TYPE.label`: "Memory hook".
- All values from tokens: `SPACING`, `RADII`, `MOTION`, `TYPE`, `BUTTONS`
  reference, `SUBJECTS` accent, `GENERAL` surfaces/lines. No raw px/hex.
- Persistence only via `src/lib/storage.js` (`getJson`/`setJson`) — enforced by
  `tests/architecture/storage-boundary.test.js`.

## Decisions

1. **Edit affordance = learner personalisation (generation effect).** The
   pencil opens an inline textarea where the learner rewrites the hook in
   their own words. Saved per hook under one storage key
   (`gcse_memory_hook_notes_v1`, an object keyed by `block.id || block.hook`).
   Saving an empty (or unchanged-default) value clears the override. When a
   personal version is showing, a small "Your version" caption appears.
   No weakness logging — this is not an assessment interaction.
2. **Image is optional and author-supplied.** `image`/`imageAlt` props render a
   square thumbnail (side `SPACING.cinematic`, `RADII.small`); without an
   image the card is text-only. The component never generates imagery.
3. **Visual language reuses the established make-it-stick treatment** from
   `AcronymMemorise`'s footer: accent-tinted card
   (`rgba(accentRgb, 0.07)` fill, `rgba(accentRgb, 0.20)` border),
   `RADII.medium`, `TYPE.label` accent label, calm body copy.
4. **Pedagogical distinctness** (registry justification): `KeyPoint` states
   the screen's rule; `WorkedExample` applies it; `AcronymMemorise` drills an
   acronym interactively; **`MemoryHook` anchors one hard idea with a
   memorable analogy/mnemonic the learner can personalise**. Reusable across
   all subjects "here and there" within pages.

## API

```jsx
<MemoryHook
  block={{ id: 'bio-virus-hacker', hook: 'Think of a virus as …', image: '/figures/…', imageAlt: '…', label: 'Memory hook' }}
  subject="Biology"
/>
```

## Out of scope

- Surfacing personalised hooks elsewhere (retrieval feeds, progress) — future.
- Auto-generating hooks; syncing hooks to Firestore beyond the normal scoped
  storage layer.
- Any change to `AcronymMemorise`'s existing footer.

## Scope lock

- **Files to edit:** `src/components/learning/MemoryHook.jsx` (new),
  `src/components/learning/MemoryHook.stories.jsx` (new),
  `src/components/layout/ModulePlayer.jsx` (route only),
  `src/dev/componentReview/fixtures.js`,
  `src/dev/componentReview/reviewManifest.jsx`,
  `docs/components/COMPONENT_REGISTRY.md`,
  `docs/system/component-contracts/memory-hook.md` (new),
  `docs/system/PATTERN_GOVERNANCE.md` (one intent-map row),
  `CLAUDE.md` (one learning-list line), this spec.
- **Files forbidden:** locked components, `AcronymMemorise.jsx`,
  `src/weaknessTracker.js`, module content files.
- **Components allowed (existing):** none composed in; token/constants imports only.
- **New components:** yes — `MemoryHook` (+ Component Registry entry).
- **New stories required:** yes — `MemoryHook.stories.jsx`.
- **Assets required:** no (story uses an existing `/figures/` image).
- **Verification plan:** `vite build`; `vitest run tests/architecture`;
  `vitest` story run for the new stories; review-lab entry renders.
