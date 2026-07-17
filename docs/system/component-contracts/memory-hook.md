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
Optional author image when a visual anchor genuinely helps recall.

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

- Accent-tinted card (`SUBJECTS[subject]` accent), sentence-case `label`
  (default "Memory hook") — **no uppercase eyebrow**.
- Optional square thumbnail on the leading edge; text-only without one.
- Hook body in calm body copy; a pencil edit button reveals an inline
  textarea with Save / Cancel. A personalised hook shows a "Your version"
  caption. Saving empty (or the default restored) clears the override.
- Personalisation persists only through `src/lib/storage.js`
  (`gcse_memory_hook_notes_v1`, keyed by `block.id || block.hook`) — never
  `localStorage` directly.

## 5. Token rules

`RADII.medium` card, `RADII.small` thumbnail/controls; `SPACING.standard`
padding, `SPACING.compact` gaps, `SPACING.cinematic` thumbnail side;
`TYPE.label` accent label, `TYPE.body` hook, `TYPE.caption` "Your version",
`TYPE.button` controls; accent + fill/border via
`SUBJECTS[subject].accent` / `.accentRgb`; surfaces/lines/`textOnAccent` via
`GENERAL`. No raw px/hex.

## 6. Motion rules

Restrained. The edit button uses a `MOTION.scale.press` press-scale over
`MOTION.duration.fast`; no entrance animation, bounce, or reward motion.
Respects `prefers-reduced-motion` by having no persistent animation to
suppress.

## 7. Gold example

`MemoryHook.stories.jsx` → **Gold**: the virus "hacker" analogy with
thumbnail and the learner-edit affordance, at 390px — matches the design
reference.

## 8. Below-bar counterexample

- An ALL-CAPS "MEMORY HOOK" eyebrow (violates the label-case rule).
- The screen's actual takeaway rule dropped into a MemoryHook instead of
  `KeyPoint` (intent inversion).
- Two hooks stacked on one screen, or a hook used as a generic bordered
  callout with no mnemonic value.

## 9. Review checks

- ⚙ Personalisation routes through `storage.js` (no direct `localStorage`).
- ⚙ Label renders sentence case (no uppercase eyebrow).
- ⚙ Uses tokens, not raw px/hex.
- ⚙ At most one MemoryHook per screen.
- 👁 It is genuinely a memorable *hook*, not the screen's rule, a worked
  example, or decoration (render pass).
- 👁 Text wraps cleanly beside a thumbnail at 390px.
