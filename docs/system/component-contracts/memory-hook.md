# Contract — MemoryHook

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** Uses the 9-field format.

**Composition classification:** `content`

**Component:** `src/components/learning/MemoryHook.jsx` · intent: *anchor one idea with a memorable hook*

## 1. Purpose

Give the learner a small, memorable handle on one hard idea — an analogy or
mnemonic — that sits *within* a page as a light recall aid. It is deliberately
passive and should be understood at a glance without adding another task.

## 2. When to use

Once, beside or after the content it reinforces, when a single idea benefits
from a memorable analogy or mnemonic the learner should carry into the exam.
Use the optional image only when it genuinely strengthens recall.

## 3. When NOT to use

- **To drill an acronym interactively** — that is `AcronymMemorise`.
- **As a generic emphasis box** for any text that wants a border.
- **More than once per screen** — a second hook competes for the one thing
  the learner should leave holding.

## 4. Required structure

- Compact, near-black neutral surface with a faint neutral hairline and one
  restrained subject-colour rail. No full accent outline, glow or obvious
  subject-colour wash.
- Sentence-case label (default "Memory hook") — no uppercase eyebrow.
- Optional square visual anchor on the leading edge; text-only without one.
- The image has enough presence to act as a retrieval cue rather than a tiny
  decorative thumbnail.
- Hook copy is calm, lightweight body text. It should feel like a quick aside,
  not a heading or assessment prompt.
- No learner interaction, persistence or progress behaviour.

## 5. Token rules

`RADII.medium` card and `RADII.small` image;
`SPACING.compact` padding/gap;
`COMPONENT_SIZE.memoryHookImage` image side;
`COMPONENT_SIZE.hairline` / `.accentRail` for strokes;
`TYPE.label` and `TYPE.bodySmall`;
`SUBJECTS[subject].accent` for the rail and label;
`GENERAL.backgroundSunken`, neutral lines and primary text for the surface.
No local px/hex/alpha recipes.

## 6. Motion rules

None. MemoryHook is a passive embedded aid and should not animate, pulse or
behave like a reward state.

## 7. Gold example

`MemoryHook.stories.jsx` → **Gold**: the virus "hacker" analogy with a strong
square visual anchor and lightweight copy at 390px.

## 8. Below-bar counterexample

- An ALL-CAPS "MEMORY HOOK" eyebrow.
- A fully tinted or glowing subject-colour card competing with the page.
- A tiny image that reads as decoration rather than a recall cue.
- Large or bold copy that makes the component feel like another teaching card.
- Two hooks stacked on one screen, or a hook used as a generic bordered callout.

## 9. Review checks

- ⚙ Label renders sentence case.
- ⚙ Uses governed dimensions and tokens, not local px/hex/alpha recipes.
- ⚙ At most one MemoryHook per screen.
- 👁 The surface remains darker and quieter than the surrounding teaching UI.
- 👁 The image is visually useful, not decorative.
- 👁 The hook is genuinely memorable rather than generic summary copy.
- 👁 Text wraps comfortably beside the image at 390px.
