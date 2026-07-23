# Pattern governance

**Authority:** governs how every element is placed on a learning screen.
Sits above the component contracts (`docs/system/component-contracts/`) and
alongside `CONTENT_BUILD_TEMPLATE.md`. Where a component's contract and this
doc conflict, this doc wins. Enforced by the `content-create` and
`content-review` skills and the Workflow C/E critique gate.

This layer exists to **prevent misuse**, not to offer reusable boxes. Prose
rules drift; a governed chain and a one-sentence test do not.

## Visual-review authority hierarchy

For visual-quality review of in-module learning screens, use this precedence
when docs appear to conflict:

1. **Pattern Governance** — learning intent, screen structure, component
   selection, execution contracts, gold examples, and render-pass requirements.
2. **Product UI Constitution** — product-wide visual laws and interaction
   principles.
3. **Typography System** — type roles, hierarchy, font usage, label case,
   uppercase exceptions, and text presentation.
4. **Subject Theme System** — subject identity, approved accent use, colour
   budgets, and subject-specific presentation.
5. **Brand guidance** — supporting expression guidance and legacy reference;
   it must not override the canonical systems above.

The hierarchy reconciles existing systems; it does not create a new design
system or authorise new components, tokens, typography, colour palettes, or
visual language.

---

## The taxonomy chain

Every element a build session puts on a screen must resolve through one
chain — no ad-hoc `<div>` boxes for a job a pattern component owns:

**learning objective → screen intent → approved component → approved composition route → execution contract → gold example**

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
- **Approved composition route** — the sanctioned way the screen is
  *composed*: which shell owns structure and which route owns the learning
  hierarchy (heading, rhythm, focal point). Every screen resolves to exactly
  one of the three approved routes (see "Screen-composition routes" below)
  before implementation. A component that is not itself a composition route
  is rendered *inside* one.
- **Execution contract** — the 9-field rules governing correct use (below).
- **Gold example** — the reference implementation the contract points to,
  registered in `docs/system/GOLD_SCREEN_REGISTER.md`: the one composed
  runtime screen (verified at 390px) every review and rebuild is measured
  against, plus a named below-bar counterexample. A screen is named gold
  **only after its composed 390px render has been reviewed** — never from
  source alone; where none clears the bar the register says "No verified
  composed gold example yet" and treats creating one as explicit debt.

---

## Hard rule — one primary intent per screen

Every screen has **exactly one primary intent.** If a reviewer cannot state
that intent in a single sentence, the screen fails review and is split or
cut.

This is the top control against overloaded screens (the "teaching three
things" failure): one screen, one job, one sentence. Supporting elements (a
`MediaPlaceholder`, a single `MemoryHook`) are allowed only in service of the
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
| Land the takeaway / payoff of a screen | `MemoryHook` |
| Compose a teaching screen (rhythm + spacing) | `TeachScreenShell` |
| Reserve an image/diagram the author will supply | `MediaPlaceholder` |
| Present a captioned infographic / diagram screen (heading + intro + one media slot) | `Infographic` |
| Teach a concept, test-after-teach | `factorWeb` / `centreImageReveal` (per their contracts) |
| Introduce a key person | `keyFigureReveal` |
| Anchor one idea with a memorable analogy/mnemonic | `MemoryHook` |
| …(existing learning components) | per `component-contracts/` |

---

## Screen-composition routes

> **Primary rule.** Every new in-module screen must use an approved
> screen-composition route. It may not invent its own shell, heading
> treatment or vertical rhythm.
>
> `TeachScreenShell` is the default learning-composition route for teaching
> and explanation screens.
>
> A different composition route is permitted only where an approved
> component contract explicitly states that the component owns full-screen
> composition.

This rule governs **screens**, not every reusable component. Most components
are *content* rendered inside a route (see the composition-ownership rule
below). `TeachScreenShell` is a composition primitive, not a universal
wrapper — it does not wrap interaction engines, cinematic experiences, or
every nested learning component.

### Two complementary layers

Screen construction has two layers that are complementary, not competing:

- **Structural shells** (`ContentShell`, `InteractionShell`, `CinematicShell`)
  own *viewport behaviour* — safe areas, scrolling, max-width, subject
  background, fixed-header clearance, fixed-CTA clearance. They do **not**
  decide the learning hierarchy.
- **Learning-composition routes** own *learning hierarchy* — heading
  treatment, screen-title token, vertical rhythm, content order, interaction
  layout, feedback placement, and the screen's one dominant focal point.

The two defaults live at different layers and do not conflict:

> **Default structural shell:** normally `ContentShell`, unless interaction
> or cinematic requirements justify another structural shell.
>
> **Default teaching composition:** `TeachScreenShell`.

Using `ContentShell` alone is **not** sufficient learning composition for a
new teaching screen — a `ContentShell` with an ad-hoc `ScreenTitle` and
hand-spaced `<div>`s bypasses the design system's rhythm and header token.
Full detail of the shell/route split lives in
`docs/system/SCREEN_SHELL_SYSTEM.md`.

### The three approved routes

**Route A — Teaching or explanation screen → `TeachScreenShell`.**
The default. Use for explaining a concept, cause → mechanism → consequence,
explaining evidence, preparing the learner before an interaction, teaching a
process, or any screen that is a heading + short framing line + teaching body
+ optional single key point. The shell owns the heading (`TYPE.displayScreen`,
never overridden locally), the vertical rhythm, and the slot order. Content
sets `shell: 'teach'` where the renderer requires it. Not optional where the
screen's purpose matches the shell's contract.

**Route B — Interaction-owned screen.** An interaction owns full-screen
composition *only* where its approved component contract explicitly grants
that responsibility. Existing approved examples: quiz/question screens,
`matchingTask`, interactive-image experiences, `factorWeb`, assessed
diagnostic interactions. Being interactive does **not** by itself earn
screen ownership — a small interaction embedded in a teaching screen stays a
content component inside `TeachScreenShell`. A screen-owning interaction
contract must define why normal teaching composition is unsuitable, plus its
heading ownership, structural-shell choice, typography-token ownership,
vertical rhythm, interaction-area layout, feedback placement, progression
control, mobile render checks, and reduced-motion behaviour where relevant.

**Route C — Cinematic / full-screen composition.** Use only an existing
approved cinematic/full-screen component (or one whose contract explicitly
owns complete screen composition): cinematic reveal moments, visual-learning
moments, chapter hooks, chapter outcomes, key-figure reveals, genuinely
full-bleed visual experiences. A cinematic route must have a real learning or
interaction reason to control the whole viewport. "Cinematic" is not a
loophole for bespoke heading typography, local spacing, decorative
full-screen treatment, avoiding `TeachScreenShell`, or minting a one-off
component because the content feels important. Where `CinematicShell` is the
structural shell, the written-justification comment it already requires still
applies.

### Composition-ownership rule (hard)

> A new component does not automatically earn the right to own screen layout.
>
> Full-screen composition ownership must be explicitly granted in an approved
> component contract.
>
> Without that approval, the component is treated as content rendered within
> an existing approved composition route — normally `TeachScreenShell` for
> teaching and explanation screens.

> Creating a new component solely to bypass an approved shell or obtain
> bespoke heading typography, spacing or visual hierarchy is a governance
> failure.

> A component being visually distinctive, interactive or emotionally
> important is not by itself sufficient reason for full-screen ownership.

### Route resolution and failure conditions (hard)

> Every screen must declare or resolve to one approved composition route
> before implementation.

> An in-module screen fails governance when it uses a generic shell, local
> screen-heading treatment or ad-hoc vertical rhythm despite an approved
> composition route already existing for its intent.

### Hierarchy is a render check, not a token check (hard)

> Valid typography-token use alone does not constitute a hierarchy pass. The
> rendered mobile screen must contain one clear typographic focal point, with
> supporting headings visibly subordinate.

A screen can spread every token correctly and still fail: two competing
headings, an intro heavier than the title, a card title the same size as the
screen title. Hierarchy is decided in the 390px render pass (👁), never from
source alone.

### Legacy screens

Many existing screens predate this governance and may use generic
composition, a direct `ScreenTitle`, local heading styles, bespoke rhythm, or
justified-or-unjustified full-screen ownership. They are **not** mass-migrated.

> Existing screens remain supported until reviewed or materially edited. When
> an existing screen is touched during content review, classify it against
> the approved composition routes. Migrate it where the current route is
> clearly wrong, but do not rewrite a successful specialist interaction or
> cinematic experience solely for architectural uniformity.

> Legacy implementation is not precedent for new implementation.

A legacy screen that happens to use a generic shell is not a licence to copy
that pattern into new work — new screens resolve to an approved route.

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
Every **👁** review check requires **rendering and looking at the pixels** at
390px width. Two rules, both learned the hard way:

1. **Render the COMPOSED screen, in the real render path** — the screen as
   the learner actually sees it (drive the app, or mount the real screen
   renderer with real content). A component passing *its own Storybook
   story* is **not** evidence the screen is good: a component can look fine
   in isolation and compose into a heavy, mis-spaced, box-in-a-box screen.
   Green in isolation ≠ good in composition. The story checks the
   component; the render pass checks the *screen*.
2. **Compare critically, against a bar** — put the rendered screen beside
   its gold example and, for a change, beside the version it replaces, and
   answer in writing: *is this actually better, and where is it worse?*
   "Looks clean" is not a verdict; name what works and what doesn't.
   Declaring a screen good without this comparison is the failure that
   shipped a boxier, worse screen once already.

This is a first-class review step, not optional polish. Source-and-tests
review — and self-congratulatory render passes — are precisely what let
capitalisation drift, screens teaching three things, inverted hierarchy,
and a box-in-a-box teach screen through. It must not recur.

### Strengthened visual verdict

The render-pass comparison against the named gold example must answer **all**
of these in writing — "looks clean", "looks polished" and "more engaging" are
not verdicts:

- What is objectively better? What became worse?
- Does the learning objective land more quickly?
- Can a tired learner understand the screen's job and next action within
  three seconds?
- Is one element clearly dominant? Is the learner doing something
  cognitively meaningful?
- Does any element compete with the primary intent? Would removing any
  element improve clarity?
- Does the result meet or exceed the named gold example?
- Any clipping, density, hierarchy, spacing, image-relevance or
  CTA-visibility problem?

## Quality-preservation rule — no silent trade-offs

An amendment must never improve one dimension by silently damaging another.
The post-build review names any trade-off explicitly; an unnamed one is a
review failure. Check for each of:

- stronger visual design but weaker teaching
- simpler copy but lost GCSE precision
- more interaction but less meaningful thinking
- more cinematic imagery but poorer readability
- improved hierarchy but missing content
- reduced density but fragmented learning
- stronger story but weaker exam preparation

---

## The review-to-rebuild pathway

Reviews must not stop at diagnosis and then rely on ad-hoc amendments. Every
content change follows one pathway, end to end:

> **canonical objective → review decision → amendment brief →
> `content-create` implementation → composed render comparison →
> independent post-build approval**

### Three stages, never collapsed

- **Diagnose — `content-review`.** Audits, records evidence, assigns each
  screen one decision, writes an amendment brief for every Refine / Rebuild /
  Split, and stops for confirmation.
- **Implement — `content-create`.** Builds only the confirmed briefs, does not
  expand scope, renders the composed screens, records any unavoidable
  deviation. Output is *implemented*, not *approved*.
- **Approve — `content-review`, independently.** Re-audits the amended scope
  against before / after / gold; does not accept the builder's
  self-assessment. **The same output never treats "implemented" as
  "approved".**

### The screen decision — one per screen

Every reviewed screen gets exactly one: **Keep** (at bar), **Refine**
(targeted execution fix), **Rebuild** (right objective, wrong approach),
**Split** (more than one primary intent), or **Cut** (no objective / fails the
deletion test).

### The amendment brief

A Refine / Rebuild / Split decision authorises nothing on its own — the review
produces a structured amendment brief first, and that brief is what
`content-create` implements. The brief names: module ID, screen index, current
component, decision, canonical learning objective, one primary intent, exact
learner misunderstanding/need, approved replacement component, why the
component matches the content shape, named contract, named gold example,
required content/evidence, required learner action, intended learning payoff,
elements that must not appear, 390px acceptance criteria, retained elements,
and known risks (content loss, repetition, density). The full field list and
the ban on vague recommendations ("make this more engaging", "improve
hierarchy", "add interactivity", "make it more cinematic") live in the
`content-review` skill.

## Composition controls

Structural rules a composed screen must satisfy; checked in the render pass
(👁) and by the reviewer:

- **One resolved composition route.** The screen resolves to exactly one of
  the three approved routes (above) before implementation. A generic shell
  with an ad-hoc heading and hand-spaced `<div>`s is not a route.
- **Teach screens compose through `TeachScreenShell`.** A teaching screen
  rendered via the generic block shell (its heading through `ScreenTitle`,
  its spacing ad-hoc) bypasses the design system's rhythm and header token —
  that is a failure. Set `shell: 'teach'` so the shell owns the header
  (`TYPE.displayScreen`) and the vertical rhythm.
- **One header token.** A teach-screen heading uses the shell's
  `TYPE.displayScreen`, never `ScreenTitle` or an ad-hoc size. Two screens
  of the same kind must not have different header sizes.
- **No box-in-a-box.** A content component must not nest an accent/callout
  box inside another content card. One container level per content surface.
- **One emphasis box per screen.** At most one payoff box (the
  `MemoryHook`'s role). A component must not introduce a second accent
  box that competes with it for "the point."
- **Let it breathe.** Prefer negative space over stacked containers. If a
  screen reads as two or more heavy boxes crammed together, it fails.

Machine-checked structural and semantic floors live alongside this render
pass. Architecture tests enumerate built modules from `MODULES` +
`MODULE_CONTENT_LOADERS`, collect nested learner-facing text for readability,
enforce exam-prep follow-through using registered `exam-technique`
functions, verify recovery tags against loaded runtime screens, and reject
new raw presentation fields (`color`, `colorRgb`, `bg`, `colorLight`) in
screen/reveal/interaction data. Known debt lives in explicit fixtures:
readability has both a stable location fingerprint and a maximum grade
budget, and sentence-case debt is keyed to exact content locations instead
of whole modules. Asset-specific image treatment may be documented as an
exact exception, but never as a broad colour allowlist.

Do not confuse those checks with visual or editorial judgement. The 390px
render pass decides hierarchy, rhythm, density, and whether the component
looks like its gold example. Human review decides story, teaching clarity,
exam usefulness, and emotional engagement; these dimensions must stay
explicit review findings, not fragile regex proxies.

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
- **Sentence case by default** — learning-screen titles, section headings,
  instructional copy, key points and decorative labels use sentence case.
- **No decorative uppercase** — `text-transform: uppercase` / ALL-CAPS on
  headings or key-point labels is a failure; caps are for genuine compact
  scanning or notation only (approved metadata, navigation, short chips,
  diagram labels, axes, or established abbreviations). Uppercase must not be
  introduced merely to make ordinary headings or labels feel more important.
- **Points land in a box, not as caption text** — a key takeaway rendered as
  small muted footer text is a hierarchy inversion; it belongs in
  `MemoryHook`.
- **Gradual key-point reveal** — payoff boxes reveal gradually, never static
  all-at-once. (`MOTION_SYSTEM.md` → Key-point reveal.)

---

## How this is enforced

- **`content-create`** implements confirmed amendment briefs (or a new-build
  spec) only — it does not diagnose or approve. For every screen it resolves
  the full build chain (learning objective → primary intent → learner need →
  approved component → contract → named gold example → content structure →
  render acceptance criteria) before choosing a component, reserves visuals
  with `MediaPlaceholder` + manifest, runs the composed render pass, and
  records any unavoidable deviation from the brief. Its output is
  *implemented*, not *approved*.
- **`content-review`** states each screen's one primary intent in a sentence
  (fails the screen if it can't), checks the component advances the learning
  objective, scores against the 9-field contracts and the intent→component
  map, runs every 👁 check via the render pass against the gold register,
  assigns each screen a Keep / Refine / Rebuild / Split / Cut decision, writes
  an amendment brief for every Refine / Rebuild / Split, and — after
  `content-create` builds — re-audits the amended scope independently, naming
  any quality trade-off.
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
