# Pattern governance

**Authority:** governs how every element is placed on a learning screen.
Sits above the component contracts (`docs/system/component-contracts/`) and
alongside `CONTENT_BUILD_TEMPLATE.md`. Where a component's contract and this
doc conflict, this doc wins. Enforced by the `content-create` and
`content-review` skills and the Workflow C/E critique gate.

This layer exists to **prevent misuse**, not to offer reusable boxes. Prose
rules drift; a governed chain and a one-sentence test do not.

---

## The taxonomy chain

Every element a build session puts on a screen must resolve through one
chain — no ad-hoc `<div>` boxes for a job a pattern component owns:

**learning objective → screen intent → approved component → execution contract → gold example**

- **Learning objective** — the GCSE thing the learner should be able to do
  after this screen, taken from the episode's canonical file / spec (e.g.
  "explain why medieval treatments followed the Theory of Opposites"). Every
  screen serves an objective; a screen that serves none is cut.
  The review's **first** question is always: *does this component actually
  advance the learning objective?* A well-built component on the wrong
  objective still fails.
- **Screen intent** — the single communicative job that serves the
  objective ("land a takeaway", "reserve a visual", "walk a worked
  example", "teach a concept", "introduce a figure"). Named and finite.
- **Approved component** — the one sanctioned component for that intent. If
  an intent has an approved component, using anything else is a review
  failure.
- **Execution contract** — the 9-field rules governing correct use (below).
- **Gold example** — the reference implementation the contract points to (a
  Storybook story plus a real on-screen use).

---

## Hard rule — one primary intent per screen

Every screen has **exactly one primary intent.** If a reviewer cannot state
that intent in a single sentence, the screen fails review and is split or
cut.

This is the top control against overloaded screens (the "teaching three
things" failure): one screen, one job, one sentence. Supporting elements (a
`MediaPlaceholder`, a single `KeyPoint`) are allowed only in service of the
one primary intent — they are never second and third intents smuggled in.

`content-review` and the critique gate run this test **first**, before
contracts or anything else.

---

## Intent → approved component map

Seed map; extended as new intents are named. An intent listed here has
exactly one approved component — reach for anything else and the review
fails.

| Screen intent | Approved component |
|---|---|
| Land the takeaway / payoff of a screen | `KeyPoint` |
| Walk a concrete worked example | `WorkedExample` |
| Compose a teaching screen (rhythm + spacing) | `TeachScreenShell` |
| Reserve an image/diagram the author will supply | `MediaPlaceholder` |
| Teach a concept, test-after-teach | `theoryLab` (per its contract) |
| Introduce a key person | `keyFigureReveal` |
| …(existing learning components) | per `component-contracts/` |

**`KeyPoint` and `WorkedExample` are deliberately separate and must never be
merged.** `KeyPoint` *summarises a rule* (the takeaway the learner must
hold); `WorkedExample` *demonstrates its application* (the rule run through
one concrete case). Collapsing them into one moded component blurs that
distinction and is a governance failure, not a simplification.

---

## The 9-field contract format

Every component contract uses these nine fields. The older 3-part format
(bar / copy standards / failure modes) is a subset; the existing six
learning-component contracts upgrade to this format opportunistically when
next touched.

1. **Purpose** — the one intent this component serves.
2. **When to use** — the trigger conditions.
3. **When NOT to use** — the misuse control. The cases where a build
   session would reach for this but must not, each with the correct
   alternative. Mandatory; the field the reviewer checks hardest.
4. **Required structure** — mandatory props/children, required order, and
   what may never appear (e.g. "no eyebrow", "exactly one per screen").
5. **Token rules** — the `SPACING` / `TYPE` / `RADII` / `MOTION` tokens it
   must use; no raw pixel/hex/ms values. (⚙ via token-governance tests.)
6. **Motion rules** — required entrance/reveal behaviour and reduced-motion
   fallback, in `MOTION` tokens.
7. **Gold example** — named story + named on-screen use, and why it is the
   bar.
8. **Below-bar counterexample** — a named real (or realistic) misuse and
   why it fails.
9. **Review checks** — the explicit checks `content-review` runs, each
   marked **⚙** (machine-checkable — becomes an architecture test) or **👁**
   (requires the render pass).

---

## The mandatory render pass

`content-review` and the critique gate do not pass on source + tests alone.
Every **👁** review check requires **rendering the screen and looking at the
pixels** — the component's Storybook story or an isolated mount, screenshot
at 390px width.

This is a first-class review step, not optional polish. Source-and-tests
review is precisely what let capitalisation drift, screens teaching three
things, and inverted hierarchy through the first time; it must not recur.

---

## MediaPlaceholder + visual-assets manifest

Build sessions never generate bespoke imagery or diagrams. When a screen
needs a visual:

1. Insert `MediaPlaceholder` with a `caption` briefing exactly what the
   asset should depict.
2. Append an entry to the episode's visual-assets manifest at
   `docs/content/<subject>/<series>/<NN>_visual-assets.md`: kind, aspect,
   the brief, and the screen it sits on.

The manifest is the author's shopping list of visuals to supply.
`content-review` checks that every placeholder has a manifest entry and
every manifest entry has a placeholder.

---

## Design-rule review checks

These design-system rules are checked on every screen (sources in brackets):

- **No decorative eyebrow** — an eyebrow that restates or categorises its
  heading is a failure. (`TYPOGRAPHY_SYSTEM.md` → Eyebrows and label case.)
- **No decorative uppercase** — `text-transform: uppercase` / ALL-CAPS on
  headings or key-point labels is a failure; caps are for scanning data
  only (nav, metadata chips, axis/diagram labels).
- **Points land in a box, not as caption text** — a key takeaway rendered as
  small muted footer text is a hierarchy inversion; it belongs in
  `KeyPoint`.
- **Gradual key-point reveal** — payoff boxes reveal gradually, never static
  all-at-once. (`MOTION_SYSTEM.md` → Key-point reveal.)

---

## How this is enforced

- **`content-create`** names each screen's learning objective and its single
  primary intent (one sentence) before choosing a component, resolves every
  element through the taxonomy chain, uses the approved component per intent,
  reserves visuals with `MediaPlaceholder` + manifest, and runs the render
  pass in self-critique.
- **`content-review`** states each screen's one primary intent in a sentence
  (fails the screen if it can't), checks the component advances the learning
  objective, then scores against the 9-field contracts and the
  intent→component map, runs every 👁 check via the render pass, and
  reconciles the visual-assets manifest.
- **Workflow C/E critique gate** runs the render pass, the
  one-primary-intent test, the objective-match check, and the taxonomy-chain
  check before any content work is presented.

---

## Relationship to the rest of the system

- `src/data/componentFunctions.js` — the machine-readable function-tag
  taxonomy (which display types serve which function, and their interaction
  class). This doc adds the human governance layer above it.
- `CONTENT_BUILD_TEMPLATE.md` — owns the story-unit rhythm and the
  machine-checked hard floor inside a section; this doc owns which component
  serves which intent and the one-intent rule.
- `docs/system/component-contracts/` — the per-component 9-field contracts
  this doc's chain points to.
