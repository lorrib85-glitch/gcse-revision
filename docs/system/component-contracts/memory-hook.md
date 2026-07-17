# Contract — MemoryHook

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** Uses the 9-field format.

**Composition classification:** `content`

**Component:** `src/components/learning/MemoryHook.jsx` · intent: *anchor one idea with a memorable hook*

## 1. Purpose

Give the learner a small, memorable handle on one hard idea — an analogy or
mnemonic — that sits *within* a page as a light recall aid. The learner can
rewrite the hook in their own words (the generation effect), which is the
component's pedagogical reason to exist beyond a static callout.

## 2. When to use

Once, beside or after the content it reinforces, when a single idea benefits
from a memorable analogy/mnemonic the learner should carry into the exam.
Optional author image only when it genuinely strengthens recall.

## 3. When NOT to use

- **To state the screen's rule / takeaway** — that is `KeyPoint`. A memory
  hook is a mnemonic *aid*, not the conclusion the screen was building toward.
- **To demonstrate a rule on a case** — that is `WorkedExample`.
- **To drill an acronym interactively** (tap each letter) — that is
  `AcronymMemorise`.
- **As a generic emphasis box** for any text that wants a border.
- **More than once per screen** — a second hook competes for the one thing
  the learner should leave holding.

## 4. Required structure

- Compact neutral dark surface with a neutral hairline and one restrained
  subject-colour rail. Sentence-case label (default "Memory hook") — **no
  uppercase eyebrow, glow or full accent outline**.
- Optional square thumbnail on the leading edge; text-only without one.
- The hook is the strongest text in the component (`TYPE.bodyStrong`, primary
  text colour), not muted supporting copy.
- A visible **Make it mine** action reveals an inline textarea with Save /
  Cancel. After personalisation, the label becomes **Your memory hook**, the
  action becomes **Edit**, and **Use original** clears the override.
- Personalisation is enabled only when `block.id` is a stable non-empty string.
  Missing ids produce a development warning and render a static hook rather
  than pretending the edit will persist.
- Personalisation persists only through `src/lib/storage.js`
  (`gcse_memory_hook_notes_v1`, keyed by `block.id`) — never `localStorage`
  directly.
- Learner copy is capped at `CONTENT_LIMITS.memoryHook` and the textarea grows
  only up to the governed maximum height.

## 5. Token rules

`RADII.medium` card and `RADII.small` thumbnail/controls;
`SPACING.compact` padding/gaps; `COMPONENT_SIZE.thumbnail` image side;
`COMPONENT_SIZE.touchTarget` minimum interactive height;
`COMPONENT_SIZE.hairline` / `.accentRail` / focus metrics for strokes;
`TYPE.label`, `TYPE.bodyStrong`, `TYPE.button`, `TYPE.caption`;
`SUBJECTS[subject].accent`; neutral surfaces/lines/primary text via `GENERAL`.
No local colour values, invented control sizes or subject-alpha recipes.

## 6. Motion rules

Restrained. Interactive controls use `MOTION.scale.press` over
`MOTION.duration.fast`; focus-visible uses the governed subject-colour ring.
The control transition is removed for `prefers-reduced-motion`. No entrance
animation, bounce, pulse or reward motion.

## 7. Gold example

`MemoryHook.stories.jsx` → **Gold**: the virus "hacker" analogy with thumbnail
and visible learner-personalisation action at 390px.

## 8. Below-bar counterexample

- An ALL-CAPS "MEMORY HOOK" eyebrow (violates the label-case rule).
- The screen's actual takeaway rule dropped into a MemoryHook instead of
  `KeyPoint` (intent inversion).
- A fully tinted or glowing subject-colour card competing with the page.
- An icon-only pencil with no visible explanation of the learner action.
- Two hooks stacked on one screen, or a hook used as a generic bordered
  callout with no mnemonic value.

## 9. Review checks

- ⚙ Personalisation routes through `storage.js` (no direct `localStorage`).
- ⚙ Editable hooks have stable authored ids; missing ids remain static.
- ⚙ Label renders sentence case (no uppercase eyebrow).
- ⚙ Uses governed dimensions and tokens, not local px/hex/alpha recipes.
- ⚙ Every action has a comfortable mobile touch target and focus-visible state.
- ⚙ At most one MemoryHook per screen.
- 👁 The hook sentence has stronger hierarchy than the label and framing.
- 👁 It is genuinely a memorable *hook*, not the screen's rule, a worked
  example, or decoration (render pass).
- 👁 Text wraps cleanly beside a thumbnail at 390px.
