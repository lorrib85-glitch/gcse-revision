# MemoryHook — design

**Date:** 2026-07-17 · **Lane:** E (new reusable component) · **Status:** built and refined after mobile UX/token review

## User story

As a GCSE student, I want a small in-page memory hook — an analogy or mnemonic
for the idea I am learning — so the idea is easier to recall in the exam without
adding another task to complete.

## Visual reference

The reference uses a dark embedded panel with a substantial square image, a
small subject-colour label and lightweight analogy copy. Its strength comes from
the contrast between the visual anchor and a quiet near-black surface, not from
a bright coloured card or large typography.

The final component keeps that compact inline role while following the app's
sentence-case typography and restrained subject identity.

## Confirmed facts

- This is an inline **content component** (Route A). It sits within pages and
  never owns a screen. ModulePlayer block type: `memoryHook`.
- Its job is distinct from `KeyPoint`, `WorkedExample` and `AcronymMemorise`.
  It provides one memorable analogy or mnemonic, not a rule, demonstration or
  interaction.
- The uppercase eyebrow pattern is prohibited. The label renders sentence case.
- The component is deliberately passive. No editing, storage, completion state
  or progress behaviour is attached to it.
- All dimensions, surfaces and typography come from governed constants.

## Final decisions

1. **The image is the retrieval anchor.** When supplied, it uses
   `COMPONENT_SIZE.memoryHookImage` so it has enough presence to support recall
   rather than reading as a decorative thumbnail.
2. **The surface is quiet and near-black.** The card uses
   `GENERAL.backgroundSunken`, a faint neutral border and one narrow subject
   accent rail. There is no obvious subject-colour wash, glow or full accent
   outline.
3. **Typography remains lightweight.** The label uses `TYPE.label`; the analogy
   uses `TYPE.bodySmall`. The hook should read as a quick, clever aside rather
   than another teaching card.
4. **Subject colour is restrained.** Accent is reserved for the rail and label.
   The body copy stays neutral.
5. **The component remains compact.** It uses the governed compact inset and gap
   so the larger image does not turn it into a hero panel.
6. **Image remains optional.** Text-only hooks still render cleanly, but authors
   should only add an image when it genuinely strengthens retrieval.

## API

```jsx
<MemoryHook
  block={{
    hook: 'Think of a virus as …',
    image: '/figures/…',
    imageAlt: '…',
    label: 'Memory hook',
  }}
  subject="Biology"
/>
```

## Out of scope

- Learner editing or personalisation.
- Persistence, Firestore sync or weakness tracking.
- Auto-generating hooks or imagery.
- Any change to `AcronymMemorise`'s existing footer.

## Scope

- `src/components/learning/MemoryHook.jsx`
- `src/constants/spacing.js`
- `src/components/learning/MemoryHook.stories.jsx`
- `src/components/layout/ModulePlayer.jsx`
- `src/dev/componentReview/fixtures.js`
- `src/dev/componentReview/reviewManifest.jsx`
- `docs/components/COMPONENT_REGISTRY.md`
- `docs/system/component-contracts/memory-hook.md`
- `docs/system/PATTERN_GOVERNANCE.md`
- `CLAUDE.md`

## Verification plan

- `vite build`
- `vitest run tests/architecture`
- Story render at 390px for image and text-only variants
- Component Review Lab inline preview
