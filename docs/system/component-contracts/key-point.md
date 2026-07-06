# Contract — KeyPoint

> **Governed by `docs/system/PATTERN_GOVERNANCE.md`.** Uses the 9-field format.

**Component:** `src/components/core/KeyPoint.jsx` · intent: *land the takeaway*

## 1. Purpose

Land the single takeaway of a screen — the one rule the learner must leave
holding. It **summarises a rule**; it is the answer the screen was building
toward.

## 2. When to use

Once per teaching screen, for the one sentence the learner must remember:
the rule, principle or conclusion the screen exists to deliver.

## 3. When NOT to use

- **For ordinary body copy** — a KeyPoint is the takeaway, not a paragraph.
- **More than once per screen** — two "key" points means the screen is
  doing two jobs; split it (see the one-primary-intent rule).
- **To demonstrate a case** — walking a specific example is `WorkedExample`.
  `KeyPoint` states the rule; `WorkedExample` shows it applied. Never merge
  the two.
- **As a generic callout** for any text that wants emphasis — it is
  reserved for the screen's takeaway.

## 4. Required structure

- Accent-tinted box (`SUBJECTS[subject]` accent), sentence-case content,
  **no eyebrow**, at most one per screen, appears **last** in reading order.
- Emphasise at most one word by wrapping it in an accent-coloured span.
- Optional small leading `icon`; omit for a clean rule box.

## 5. Token rules

`RADII.medium` box; `SPACING.standard` padding, `SPACING.compact` icon gap;
`TYPE.body` (weight 500) text; accent via `SUBJECTS[subject].accentRgb`. No
raw px/hex.

## 6. Motion rules

Owns its reveal: a gradual fade-and-rise, slightly delayed
(`MOTION.duration.slow` / `MOTION.easing.gentle`, ~220ms), so it arrives as
a moment after the rest of the screen. Because KeyPoint self-reveals, its
container (e.g. `TeachScreenShell`'s keyPoint slot) must not also animate it.
`prefers-reduced-motion`: no animation, final state shown, still last.

## 7. Gold example

`KeyPoint.stories.jsx` → **Gold — the rule takeaway**: "The rule was simple:
treat every illness with its *opposite* quality." — the Galen screen's rule,
one crisp sentence, "opposite" in accent, no eyebrow. Also the keyPoint slot
of `TeachScreenShell.stories.jsx` → Gold.

## 8. Below-bar counterexample

- The same takeaway rendered as 14px, 55%-opacity centred footer text (the
  hierarchy inversion — the point styled as a caption).
- An ALL-CAPS "WORKED EXAMPLE" eyebrow stuck on top (violates the eyebrow
  and uppercase rules).
- The fever case ("too much blood → cool and dry") placed in a KeyPoint —
  that is a worked example, not a rule; it belongs in `WorkedExample`.

## 9. Review checks

- ⚙ At most one `KeyPoint` per screen.
- ⚙ No uppercase label / no eyebrow inside it.
- ⚙ Uses tokens, not raw values.
- 👁 Reveals gradually and last (render pass).
- 👁 It is genuinely the screen's takeaway *rule* — not body copy, not a
  worked example, not decoration.
