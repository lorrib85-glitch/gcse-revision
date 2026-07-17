# MemoryHook — design

**Date:** 2026-07-17 · **Lane:** E (new reusable component) · **Status:** built and refined after mobile UX/token review

## User story

As a GCSE student, I want a small in-page "memory hook" reminder — an analogy or
mnemonic for the idea I'm learning — that I can rewrite in my own words, so the
idea sticks and I can recall it in the exam.

## Visual reference

Uploaded screenshot: a dark card with a square thumbnail on the left, a
"Memory hook" label and short analogy text on the right ("Think of a virus as a
tiny 'hacker' that sneaks in, takes over, and makes copies of itself."), and a
pencil edit action in the top-right corner, under a "Make it stick" section
label.

The final component keeps the compact inline shape but deliberately avoids
copying the reference's uppercase eyebrow, heavy tinting and oversized image.

## Confirmed facts

- This is an inline **content component** (Route A) — it sits *within* pages,
  never owns a screen. Rendered inside composed screens / ModulePlayer content
  flow, block type `memoryHook`.
- Closest existing siblings: `AcronymMemorise` and `KeyPoint`, but neither does
  the same job. `MemoryHook` anchors one difficult idea using a memorable analogy
  the learner can personalise.
- The uppercase eyebrow pattern in the reference visual is **prohibited** in
  this codebase (`TYPOGRAPHY_SYSTEM.md` — label case). Labels render sentence
  case via `TYPE.label`.
- All dimensions, surfaces, typography, motion and subject identity come from
  governed constants. Persistence only routes through `src/lib/storage.js`.

## Refined decisions

1. **The hook sentence owns the hierarchy.** It uses `TYPE.bodyStrong` and
   primary text. The label and frame remain quieter so the learner remembers the
   analogy, not the card decoration.
2. **Neutral surface, restrained subject identity.** The component uses a dark
   neutral surface and neutral hairline with one narrow subject-colour rail.
   No full accent outline, glow or locally invented accent-alpha tint.
3. **Personalisation must be discoverable.** The initial action is visibly
   labelled **Make it mine**, rather than relying on an ambiguous pencil icon.
   After saving, the label becomes **Your memory hook** and the action becomes
   **Edit**.
4. **Stable ids are required for editable hooks.** `block.id` is the persistence
   key. Without it, the component warns in development and renders as a static
   hook; authored copy is never used as an unstable storage key.
5. **Editing stays compact and bounded.** The inline field uses a governed
   character cap, grows only to the maximum content height, and offers Save,
   Cancel and (for personalised hooks) **Use original**.
6. **Mobile interaction is governed.** Every action uses the shared minimum
   touch size, focus-visible subject ring, restrained press scale and
   reduced-motion handling.
7. **Image remains optional.** A small square thumbnail is used only where it
   strengthens retrieval. The media size has a semantic component token rather
   than borrowing a spacing token directly at the call site.

## API

```jsx
<MemoryHook
  block={{
    id: 'bio-virus-hacker',
    hook: 'Think of a virus as …',
    image: '/figures/…',
    imageAlt: '…',
    label: 'Memory hook',
  }}
  subject="Biology"
/>
```

`id` is required to expose learner personalisation. Without an id, the authored
hook still renders but the edit action does not.

## Out of scope

- Surfacing personalised hooks elsewhere (retrieval feeds, progress) — future.
- Auto-generating hooks; syncing hooks to Firestore beyond the normal scoped
  storage layer.
- Any change to `AcronymMemorise`'s existing footer.

## Scope

- `src/components/learning/MemoryHook.jsx`
- `src/constants/spacing.js` semantic component-size/content-limit aliases
- `src/components/learning/MemoryHook.stories.jsx`
- `src/components/layout/ModulePlayer.jsx` route
- `src/dev/componentReview/fixtures.js`
- `src/dev/componentReview/reviewManifest.jsx`
- `docs/components/COMPONENT_REGISTRY.md`
- `docs/system/component-contracts/memory-hook.md`
- `docs/system/PATTERN_GOVERNANCE.md`
- `CLAUDE.md`

## Verification plan

- `vite build`
- `vitest run tests/architecture`
- Story render at 390px, including edit/save/use-original states
- Component Review Lab inline preview
