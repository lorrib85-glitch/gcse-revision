# Component Registry

**Last updated:** 2026-07-24
**Scope:** All standalone components in `src/components/`

---

## How to Use This Registry

Before building anything new, check this registry. If a component already covers your use case — use it. If it doesn't quite fit, adapt it. Only build new components for genuinely distinct learning beats.

**Function tags:** every learning component's display type is mapped to
pedagogical function tags and an interaction class (`passive` / `reveal` /
`assessed`) in `src/data/componentFunctions.js` — the machine-readable
source of truth. Content builds select components by function, not by
name: see `docs/system/CONTENT_BUILD_TEMPLATE.md`. When adding a component,
register its display type there in the same change (the architecture test
fails otherwise once content uses it).

**Decision block:** selectable learning components carry a `Decision`
entry — the fast path for choosing between near-neighbour components while
planning a screen. Five fields, no more:

- **Use when** — the exact learning/content situation.
- **Do not use when** — the common misuse.
- **Choose instead** — nearest alternatives and the deciding difference.
- **Content shape** — what the content must look like to fit.
- **Rhythm role** — one of: opening, teaching, exploration, practice,
  retrieval, repair, closing.

Being rolled out incrementally — not every component has one yet.

---

## `src/components/core/`

Foundation components used by many others. Handle atomic UI concerns.

### AnswerInteraction — **LOCKED**

**File:** `src/components/core/AnswerInteraction.jsx`
**Purpose:** Universal answer UI for all question types (choice, connection, true/false). The single component that handles all answer logic across the product.
**Props:** `block`, `subject`, `onAnswer`, `onContinue`
**Lock reason:** Owns all answer interaction logic. Changing internals risks breaking answer flow across every question type.

---

### BackButton — **LOCKED**

**File:** `src/components/core/BackButton.jsx`
**Purpose:** The only back-navigation button allowed anywhere in the app. 40×40 pill, near-invisible fill/border, left chevron only, no label, identical hover/press opacity.
**Props:** `onClick`, `ariaLabel` (default `'Go back'`), `style` (layout overrides only — position/margin/zIndex)
**Lock reason:** Constitutional rule — every back-navigation control in the product must use this component. No inline back-button implementations are allowed.

---

### CardContainer — **LOCKED**

**File:** `src/components/core/CardContainer.jsx`
**Purpose:** Atmospheric content surface wrapper. Provides a consistent card shell with optional background image, subject glow, and cinematic atmosphere.
**Props:** `subject`, `backgroundImage`, `children`, `style`
**Lock reason:** Visual contract for all content surfaces. Changing it would cascade to all cards in the product.

---

### CinematicContinueCTA — **LOCKED**

**File:** `src/components/core/CinematicContinueCTA.jsx`
**Purpose:** The only Cinematic Reveal CTA implementation allowed anywhere in the app — see `docs/system/BUTTON_RADII_SYSTEM.md` "Progression CTA System". Plain centred "Continue →" text, fixed to the bottom of a full-screen cinematic moment, with a fade-in + idle pulse.
**Props:** `onClick`, `accent`, `animation` (default `'crm-fade 700ms ease both, crm-pulse 2.8s ease-in-out 900ms infinite'`), `style` (layout overrides only — position, animation, zIndex; never new typography, spacing or colour logic)
**Used by:** `CinematicRevealMoment`, `ExaminerExplainsScreen`
**Lock reason:** Constitutional rule — every cinematic "Continue →" prompt in the product must use this component. No inline implementations are allowed.

---

### ContinueCTA — **LOCKED**

**File:** `src/components/core/ContinueCTA.jsx`
**Purpose:** The only Primary Progression CTA implementation allowed anywhere in the app — see `docs/system/BUTTON_RADII_SYSTEM.md` "Progression CTA System". 56px tall, `RADII.large`, solid accent fill, `#0D0F14` text, "Continue" label, with built-in press-scale feedback.
**Props:** `onClick`, `label` (default `'Continue'`), `accent`, `disabled`, `disabledBackground`, `disabledColor`, `textColor`, `onMouseEnter`, `onMouseLeave`, `style` (layout overrides only — width/flex, margin, position, animation, transition; never new height, radius, font or colour logic)
**Used by:** every screen-to-screen "Continue" button across `src/components/learning/` and `src/components/feedback/`, plus `ModulePlayer`'s bottom navigation (also covers the "Finish ✓" label via `label`)
**Lock reason:** Constitutional rule — every Primary Progression CTA in the product must use this component. No inline implementations are allowed.

---

### CheckAnswerCTA

**File:** `src/components/core/CheckAnswerCTA.jsx`
**Story:** `src/components/core/CheckAnswerCTA.stories.jsx`
**Purpose:** The governed shared **non-progression** answer-submit / "check my thinking" action for assessed learning screens. Deliberately distinct from `ContinueCTA` (the progression CTA): uses the `BUTTONS.secondary` token (56px, `RADII.medium`) with a solid subject-accent fill, `GENERAL.textOnAccent` foreground, the governed disabled treatment, and focus-visible + press states — so a "check" step never visually competes with the final "Continue" that advances the flow.
**Props:** `onClick`, `label` (default `'Check my thinking'`), `accent`, `disabled`, `disabledBackground`, `disabledColor`, `textColor`, `style` (layout overrides only — width/flex/margin; never new height, radius, font or colour logic)
**Used by:** `SpotTheError`. Prefer this over rebuilding a bespoke check/submit button in any new assessed component.
**Dependencies:** `BUTTONS`, `MOTION`, `GENERAL`

---

### ExitButton — **LOCKED**

**File:** `src/components/core/ExitButton.jsx`
**Purpose:** The only exit-navigation button allowed anywhere in the app. 44×44, near-invisible "X" icon, opacity/scale press feedback.
**Props:** `onClick`, `ariaLabel` (default `'Exit chapter'`), `style` (layout overrides only — position/margin/zIndex)
**Lock reason:** Constitutional rule — every exit-navigation control in the product must use this component. No inline exit-button implementations are allowed.

---

### LearningHeader

**File:** `src/components/core/LearningHeader.jsx`
**Purpose:** Single-row floating capsule header shell for learning screens: `[back] [stage rail] [n/total] [exit]`. Composes `BackButton` (back navigation), `LearningProgressHeader` (stage rail) and `ExitButton` (exit navigation).
**Props:** `module`, `currentStage`, `onBack`, `onExit`, `visible`, `onJumpOpen`, `screenPos`
**Dependencies:** `BackButton`, `ExitButton`, `LearningProgressHeader`, `SUBJECT_ACCENTS`/`hexToRgb`

---

### LearningProgressHeader — **LOCKED**

**File:** `src/components/core/LearningProgressHeader.jsx`
**Purpose:** Progress rail and jump sheet display. Shows current position within a module. Display only — owns no interaction logic.
**Props:** `progress`, `currentStep`, `totalSteps`, `steps`
**Lock reason:** Core navigation affordance. Visual contract is established and relied upon across learning flow. This is also the only progress-bar implementation allowed for module screens — no inline progress bars.

---

### ModuleToolbar — **LOCKED**

**File:** `src/components/core/ModuleToolbar.jsx`
**Purpose:** Back and exit navigation buttons for learning screens. Navigation only — no learning logic. Delegates to `BackButton` and `ExitButton`.
**Props:** `onBack`, `onExit`
**Dependencies:** `BackButton`, `ExitButton`
**Lock reason:** Navigation contract. Changing button positions or behaviour breaks muscle memory.

---

### SaveFailureNotice

**File:** `src/components/core/SaveFailureNotice.jsx`
**Purpose:** The single governed learner-facing surface shown when a *critical* save fails (module progress, screen completion, quiz/exam scores, streaks, planner completion). Calm, subject-neutral, mobile-first; never claims progress was saved.
**Use for:** the app-wide save-failure notice only. Mounted once via `SaveFailureHost` at the app root — features do not render it themselves.
**Do NOT use for:** success confirmation, generic toasts, per-feature error banners.
**Props:** `open`, `retrying` (bool), `onRetry`, `onDismiss`
**Dependencies:** `GENERAL` theme, `TYPE`, `SPACING`, `RADII`, `BUTTONS` tokens; `createPortal`
**Architecture:** presentation only. Which saves are critical, dedupe and retry live in `src/lib/storage.js` (`saveCritical` + `subscribeSaveFailure`) and the pure `src/app/saveFailureController.js`; `src/app/SaveFailureHost.jsx` wires bus → controller → this component.
**Rule:** Do not add separate hardcoded save-error alerts or `window.alert` anywhere. Route critical persistence through `saveCritical` so this one notice handles it. No global success toast for normal saves.

---

### SequenceProgress — **LOCKED CORE UTILITY**

**File:** `src/components/core/SequenceProgress.jsx`
**Purpose:** Local sequence progress through a short sequence inside a learning component. Provides consistent dot and sash indicators for carousels, image sets, swipe cards, mini-steps, and question sets.
**Use for:** carousels, image sets, swipe cards, multi-question task progress, mini-step progress inside a learning component, small viewed/current/remaining indicators
**Do NOT use for:** top module progress rail, chapter navigation, global app progress (use `LearningProgressHeader` for those)
**Props:** `total`, `current` (zero-based, default 0), `completed` (count, default 0), `viewed` (index array for non-linear flows, default []), `accent`, `accentRgb`, `variant` (`'dots'` | `'sash'`, default `'dots'`), `compact` (boolean, default false), `ariaLabel`
**Approved variants:**
- `dots` — default. 20×8px accent pill for current, 8px muted-accent circle for done/viewed, 8px muted-white for future. `compact` reduces to 16×6px pill and 6px circles.
- `sash` — thin horizontal segments (3px, or 2px when compact). Accent for current, muted accent for done/viewed, muted white for future. Use where dots are too subtle (longer flows, step interactions).
**Behaviour:** display only — no navigation. `viewed` array takes priority over `completed` count when supplied. `current` is zero-based.
**Hard rule:** Never renders numbers, labels, counters, percentages, or "x of y" — no exceptions.
**Rule:** Do not create local `ProgressDots` or one-off carousel dots anywhere in the codebase. Use this component instead.
**Used by:** `QuickRecallScreen`, `CinematicCarousel`, `VisualLearning`, `GuidedChoiceCarousel`

---

## `src/components/learning/`

Screen-level learning interaction components. Each is a distinct learning beat.

### FactorWeb — **LOCKED**

**File:** `src/components/learning/FactorWeb.jsx`
**What it is:** Mobile-first factor exploration and judgement component. It places four to six concise factors in balanced left/right columns around one chapter-owned centre image or governed placeholder, then unlocks a supported relative-importance judgement after all factors are explored.
**Best used for:** Causal or thematic GCSE History questions where learners must explain several plausible factors and judge which mattered most.
**Contract:** `docs/system/component-contracts/factor-web.md`
**Lock:** See `docs/components/LOCKED_COMPONENTS.md`.

---


### AngleExplore

**File:** `src/components/learning/AngleExplore.jsx`
**What it is:** Configuration-driven GCSE angle diagram — the Maths sibling of `CircuitDiagram`. Shapes and angles render as inline SVG; one learner-controlled value (a draggable ray, or a triangle's draggable apex) drives live sector values, angle classifications and an angle-fact status line. Five registered presets — `angleTypes` (drag a ray, watch the value and its acute/right/obtuse/straight/reflex classification), `straightLine` (two angles summing to 180°), `aroundPoint` (three angles summing to 360°), `verticallyOpposite` (equal pairs sharing a colour), `triangle` (drag the apex, interior angles always total 180°) — plus a compatible-preset-object escape hatch. `interactive={false}` turns any preset into a static teaching or exam diagram at a fixed `value`. The drag handle is a keyboard-operable `role="slider"` (arrow keys / Home / End) with a ≥44px hit target; right angles render the GCSE square marker; values magnetise to 90°/180°/270°. Respects `prefers-reduced-motion` (and a `reducedMotion` prop override).
**Best used for:** Teaching and exploring AQA Foundation angle facts where seeing the relationship respond to movement is the point — angle types, angles on a straight line, angles around a point, vertically opposite angles, angles in a triangle. Page-level questions, predictions and marking stay outside the component (compose it like `CircuitDiagram`).
**Props:** `preset` (name or preset object, defaults to `angleTypes`), `value` (controlled), `defaultValue`, `onChange`, `interactive`, `disabled`, `subject` (defaults to `Maths`), `reducedMotion`, `label`, `showStatus`
**Screen type:** none yet — not routed in `ModulePlayer.jsx` (new component pending review)
**Dependencies:** `SUBJECTS`, `GENERAL` (via `angle/angleVisualRoles.js` semantic roles), `TYPE`, `SPACING`, `MOTION` (injected animation CSS via `ensureStyles()`, same pattern as `CircuitDiagram`/`GraphView`); pure geometry in `angle/angleGeometry.js`, presets in `angle/anglePresets.js`
**Closest alternatives:** `GraphView` (interpreting data, not angle facts); a static figure image (when no interaction is needed and the diagram is one-off).

- **Decision**
  - **Use when:** the learning objective is an angle fact or angle vocabulary, and manipulating the diagram makes the relationship visible — the sum staying fixed while parts trade, or a classification changing as the angle grows. Also use its static mode for any accurate, on-theme angle/triangle diagram inside teaching or exam content.
  - **Do not use when:** the learner must be assessed on a calculation (compose a question component around a static AngleExplore instead); the content is chart or data interpretation (`GraphView`); or the diagram is a construction/loci/bearings task the presets cannot express.
  - **Content shape:** pick the preset matching the angle fact; optionally fix `value` for a specific worked example. One diagram per screen — the component teaches one relationship at a time.
  - **Rhythm role:** teaching, exploration.

---


### AreaPerimeterExplore

**File:** `src/components/learning/AreaPerimeterExplore.jsx`
**What it is:** Configuration-driven GCSE area and perimeter diagram — the mensuration sibling of `AngleExplore`, and deliberately separate from it (`AngleExplore` stays focused on angle relationships). Shapes render as inline SVG in model space (whole centimetres mapped to pixels, never measured back from pixels); learner-controlled dimensions drive a live boundary trace, unit-square grids, decomposition pieces and a stable result → calculation → explanation status area. Six registered presets — `rectangle` (drag width and height independently, snapping to whole numbers, with a square state that marks equal sides and names side²), `fixedPerimeterRectangle` (perimeter pinned at 24 cm while area rises to a maximum at the square), `triangleArea` (slide the apex with the perpendicular height fixed; pair a rotated copy to earn ½ × base × perpendicular height), `parallelogramArea` (slant does not change area; a triggered cut-and-slide builds the equivalent rectangle), `trapeziumArea` (duplicate and rotate into a parallelogram of base a + b to derive ½ × (a + b) × h), `compositeShape` (L-shape with two valid decomposition splits plus a whole-minus-missing-corner method, and a perimeter mode that excludes internal lines and deduces missing outer lengths) — plus a compatible-preset-object escape hatch. `focus` selects `perimeter`, `area` or `compare` where the preset supports more than one. `interactive={false}` turns any preset into a static teaching or exam diagram. Drag handles are keyboard-operable `role="slider"` elements (arrow keys / Home / End) with ≥44px hit targets that never overlap in any reachable state; discrete choices (decomposition method, formula reveal) are real buttons, never disguised sliders. Respects `prefers-reduced-motion` (and a `reducedMotion` prop override).
**Best used for:** Teaching the conceptual difference between perimeter and area, and deriving AQA Foundation area formulae from visual reasoning — rectangles and squares, triangles, parallelograms, trapezia, quadrilaterals and composite rectilinear shapes. Use it when seeing the reasoning is the point: perimeter accumulating as edges are traced, area accumulating as square units are counted or rearranged, or the two measures changing differently as one dimension moves. Prediction questions, marking, hints, scores and weakness tracking stay outside the component (compose it like `AngleExplore`/`CircuitDiagram`).
**Props:** `preset` (name or preset object, defaults to `rectangle`), `focus` (`perimeter` | `area` | `compare`), `value` (controlled dimensions object), `defaultValue`, `onChange`, `interactive`, `disabled`, `subject` (defaults to `Maths`), `reducedMotion`, `label`, `showStatus`
**Screen type:** none yet — not routed in `ModulePlayer.jsx` (new component pending review)
**Dependencies:** `SUBJECTS`, `GENERAL` (via `areaPerimeter/areaPerimeterVisualRoles.js` semantic roles), `TYPE`, `SPACING`, `RADII`, `MOTION` (injected animation CSS via `ensureStyles()`, same pattern as `AngleExplore`/`CircuitDiagram`); neutral shared geometry in `geometry/shapeGeometry.js` (also used by `angle/`), presets in `areaPerimeter/areaPerimeterPresets.js`
**Closest alternatives:** `AngleExplore` (angle facts, not mensuration — do not add area/perimeter modes to it); `CalculationBreakdown` (carrying out a method step by step, not seeing why a formula holds); `GraphView` (interpreting data); a static figure image (when no interaction is needed and the diagram is one-off).

- **Decision**
  - **Use when:** the learning objective is what perimeter or area *is*, or why an area formula works — and manipulating the shape makes it visible: a sloping side changing while the perpendicular height does not, a fixed boundary enclosing different amounts of space, or an internal construction line helping the area but not the perimeter. Also use its static mode for any accurate, on-theme mensuration diagram inside teaching or exam content.
  - **Do not use when:** the learner must be assessed on a calculation (compose a question component around a static instance instead); the task is executing a multi-step method rather than understanding a measure (`CalculationBreakdown`); or the content is circles, circumference, sectors, surface area or volume — none are implemented, and surface area and volume are explicitly out of scope for this component.
  - **Content shape:** pick the preset matching the idea and set `focus` to the one measure being taught; optionally fix `value` for a specific worked example. One diagram per screen, one measure at a time — `compare` is for the moment the difference between the two measures *is* the lesson, not a way to teach both at once.
  - **Rhythm role:** teaching, exploration.

---


### CalculationBreakdown

**File:** `src/components/learning/CalculationBreakdown.jsx`
**What it is:** Full-screen, multi-phase maths walkthrough. It breaks one calculation into stages — understand the question, one or more worked steps (the transformation shown with a "do the same to both sides" grammar plus a "check this step"), a learner-applied step (typed answer with a hint), then a full solution with a "why this works" summary. A progress rail tracks the stages; understanding is checked before each advance.
**Best used for:** Any procedural GCSE Maths problem where the method matters as much as the answer — solving equations, rearranging formulae, multi-step arithmetic. Content lives entirely in the `block` prop so the mechanic is reusable across every Maths topic.
**Props:** `block`, `accent` (defaults to `GENERAL.teal`), `onContinue`
**Block shape:** `{ goalPrompt?, problem, understand: { whatsHappening?, goal?, check? }, steps: [{ mode: 'worked' | 'yourTurn', title, why?, transform: { from, leftOp?, rightOp?, to }, whyStep?, check?, answer?, resultExpr?, hint?, cta? }], solution: { celebrateTitle?, celebrateSubtitle?, result, rows?, why? } }` — a `check` is `{ question, options: string[], correct: index }`.
**Screen type:** `calculationBreakdown` (full-screen; not yet routed in `ModulePlayer.jsx` — new component pending review)
**Dependencies:** `GENERAL`, `TYPE`, `SPACING`, `RADII`, `MOTION`, `ContinueCTA`
**Closest alternatives:** `GuidedExamResponse` (written-answer scaffold, not a numeric procedure); `GraphView` (interpreting data, not carrying out a method).

---


### CinematicCarousel

**File:** `src/components/learning/CinematicCarousel.jsx`
**What it is:** Full-screen "deep dive" carousel — one large image at a time (`objectFit: contain`, so any aspect ratio works), with glass prev/next arrow buttons either side. A name + key-facts panel below slides in to match the navigation direction (`key={index}` remount + direction-aware slide-in animation). Progress dots track which items have been viewed; Continue unlocks once every item has been seen at least once.
**Best used for:** Browsing a small related set of things in turn, each worth a focused look — e.g. the organelles inside a cell, the planets of the solar system, the stages of a specialised cell. Designed for cinematic single-item focus, not for scanning a large list.
**Props:** `block`, `subject` (defaults to `Biology`), `onContinue`
**Block shape:** `{ type: 'cinematicCarousel', title?, intro?, items: [{ id, image, label, facts: string[] }] }`
**Screen type:** `cinematicCarousel` (full-screen, routed directly in `ModulePlayer.jsx` like `TimelineCanvas`)
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`

- **Decision**
  - **Use when:** the learner needs to explore a small related collection in which every item deserves its own image, name and focused set of facts. Choose it when viewing each item separately helps the learner notice or understand its individual features.
  - **Do not use when:** the items form a chronological or causal sequence, require direct side-by-side comparison, belong in assessed categories or could be understood more clearly when displayed together. Do not use it for one concept, one important person, a large catalogue or a general list of facts with decorative images.
  - **Choose instead:** use `TimelineChain` when order or causal progression matters. Use `TheoryCompare` when two items need developed parallel comparison. Use `KeyFigureReveal` when one important person requires deeper treatment. Use `InteractiveHotspotImage` when the information concerns different parts of one shared image or object. Use `Infographic` when the learner benefits from seeing the complete system or dataset together. Use `ColSortBlock` or `SwipeSort` when the learner must categorise the items themselves.
  - **Content shape:** usually three to six clearly related and visually distinct items. Every item needs one meaningful image, one concise label and a small number of focused facts. All items should answer the same broad learning question, but each must contribute something different. The order should not carry essential chronological or causal meaning. Avoid long paragraphs, repeated facts and items included only to increase the set size.
  - **Rhythm role:** teaching, exploration.

---

### CinematicRevealMoment

**File:** `src/components/learning/CinematicRevealMoment.jsx`
**Purpose:** Full-screen cinematic video or image reveal moment. Atmospheric, single-focus, high-emotion screen.
**Props:** `block`, `subject`, `onContinue`, `onBack`
**Dependencies:** `SUBJECTS`, `MOTION`

- **Decision**
  - **Use when:** one powerful image or video can create emotional weight, surprise, tension or a sense of significance that prepares the learner for the teaching that follows. Choose it for a genuine reveal or turning point, not simply because suitable media exists.
  - **Do not use when:** the learner needs detailed explanation, several facts, a person profile, a visual collection or an interaction that checks understanding. Do not use it as a substitute for teaching, as a generic chapter title screen or merely to make the module feel more cinematic.
  - **Choose instead:** use `ConceptReveal` when one new idea needs a clear conceptual introduction. Use `KeyFigureReveal` when the learner must understand an important person and their contribution. Use `CinematicCarousel` when several related images or objects need individual exploration. Use `InteractiveHotspotImage` when the learner should inspect meaningful locations within one image. Use a normal teaching component when the media does not materially improve understanding or emotional engagement.
  - **Content shape:** one exceptional image or video, one concise framing line and, where needed, one short impact statement. Text must remain minimal so the media retains focus. The next screen must explain, explore or apply why the moment matters; the cinematic reveal must not be left as an isolated spectacle.
  - **Rhythm role:** opening.

---

### CircuitDiagram

**File:** `src/components/learning/CircuitDiagram.jsx`
**Purpose:** Renders a GCSE Physics simple series circuit (battery, wire loop, bulb, switch) as inline SVG primitives — not a static image. Open vs closed is driven by a single `closed` prop: when closed the switch arm bridges both contacts, an animated cyan current overlay flows around the loop, and the bulb glows warm amber; when open the arm is raised, the current overlay is hidden, and the bulb is dim. Restrained Physics blue/cyan glow only; the moving current animation is disabled under `prefers-reduced-motion`.
**Props:** `closed` (boolean)
**Dependencies:** `SUBJECTS` (Physics palette); injects animation/glow CSS classes once via an `ensureStyles()` `<style>` block (same pattern as `GraphView`).

---

### ConceptReveal

**File:** `src/components/learning/ConceptReveal.jsx`
**Purpose:** Concept introduction with atmospheric reveal. Introduces a new idea cinematically before quiz questions.
**Props:** `block`, `subject`, `onContinue`, `onBack`
**Dependencies:** `SUBJECTS`, `MOTION`

- **Decision**
  - **Use when:** the learner needs a clear, memorable introduction to one important new concept before its details, examples or applications are developed. Choose it when the next section depends on the learner first grasping a single central idea.
  - **Do not use when:** the content concerns a specific person, several related items, a sequence of connected stages or a dramatic image that carries the emotional meaning by itself. Do not use it as a decorative title screen or repeat it every time a new subtopic begins.
  - **Choose instead:** use `KeyFigureReveal` when one important person and their contribution need to anchor the learning. Use `CinematicRevealMoment` when one image or video should create emotional significance before the teaching begins. Use `CinematicCarousel` when several related items each deserve individual visual focus. Use `ExplainReveal` when the learner needs to understand how several linked ideas lead from one to the next. Use `Read` or another standard teaching screen when the idea does not need a distinct conceptual reveal.
  - **Content shape:** one central concept expressed through a clear headline, a short framing explanation and one strong takeaway. Supporting visual material should strengthen the concept rather than merely decorate it. Avoid multiple competing ideas, detailed evidence, long paragraphs and lists of loosely related facts.
  - **Rhythm role:** opening, teaching.

---

### ExplainReveal

**File:** `src/components/learning/ExplainReveal.jsx`
**What it is:** Progressive step-by-step reasoning chain with tap-to-reveal steps.
**Best used for:** Teaching cause-and-effect logic (e.g., "Wrong belief → Wrong treatment → Patient harm"). Teaches the reasoning chain, not just facts.
**Props:** `block`, `subject`, `onContinue`, `onBack`
**Dependencies:** `SUBJECTS`, `MOTION`

- **Decision**
  - **Use when:** the learner needs to understand a short reasoning chain in which one idea leads directly to the next, such as belief → action → consequence or cause → mechanism → effect. Choose it when the important learning is the logic connecting the steps, not merely remembering their order.
  - **Do not use when:** the content is primarily a dated chronology, a series of distinct historical events or a practical process whose stages have their own identities. Do not use it when the learner should place the steps themselves or when the ideas do not form one clear chain.
  - **Choose instead:** use `TimelineChain` when the learner needs to explore a chronological, causal or procedural sequence made up of distinct events or stages. Use `OrderedRouteTask` when the sequence has already been taught and the learner must place known stages correctly. Use `TheoryCompare` when the relationship is a comparison rather than a chain. Use `ConceptReveal` when only one idea needs introducing rather than several linked steps.
  - **Content shape:** a single unbroken reasoning chain, usually three to six concise steps. Each step must clearly cause, explain or lead to the next. The chain should answer one central “how?” or “why?” question. Avoid branches, unrelated facts and stages that could be rearranged without changing the meaning.
  - **Rhythm role:** teaching.

---

### FaceTheExaminer

**File:** `src/components/learning/FaceTheExaminer.jsx`
**Purpose:** Examiner-style written question interaction. Presents a structured exam question with model answer reveal.
**Props:** `block`, `subject`, `onContinue`, `onBack`
**Dependencies:** `SUBJECTS`

---

### FillInTheBlanksBlock

**File:** `src/components/learning/FillInTheBlanksBlock.jsx`
**Purpose:** Inline fill-in-the-blanks interaction. Learner taps word slots and fills gaps from a word bank.
**Props:** `block`, `subject`, `onComplete`, `onBack`
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`

---

### Infographic

**File:** `src/components/learning/Infographic.jsx`
**Purpose:** Canonical screen for block type `infographic`: a single teaching heading and framing line (owned by the approved `TeachScreenShell`, Route A) then one governed infographic media slot (`MediaPlaceholder`). Owns no heading typography or screen rhythm of its own — it fixes the standard "title + intro + infographic" composition into one named screen so authoring `type: 'infographic'` has a clear build target. The media slot passes through to `MediaPlaceholder`, so the infographic can be a reserved diagram slot (`kind: 'diagram'`) or a progressive quadrant reveal (`kind: 'imageReveal'`).
**Props:** `subject`, `eyebrow`, `heading`, `intro`, `media` (`{ kind, aspect, caption }`)
**Dependencies:** `TeachScreenShell`, `MediaPlaceholder`

- **Decision**
  - **Use when:** the learner needs to understand a complete system, structure, relationship or summary through one coherent visual. Choose it when seeing the whole picture together is more useful than exploring separate items or reading several text screens. It may also be used for a short progressive visual reveal when the individual revealed parts combine into one meaningful whole.
  - **Do not use when:** the learner needs to inspect particular locations within the image, move through a sequence of separate scenes, compare two developed sides or interpret numerical data. Do not use it as a poster containing large amounts of tiny text or as a decorative image beneath a heading.
  - **Choose instead:** use `InteractiveHotspotImage` when information belongs to specific locations within one image. Use `VisualLearning` when understanding should build through a sequence of full-screen visual scenes. Use `CinematicCarousel` when several independent items require focused exploration. Use `GraphView` when the visual encodes numerical values, trends, correlation or proportion. Use `TimelineChain` when order or causal progression is the central learning.
  - **Content shape:** one clear teaching heading, one short framing line and one primary visual asset: a supplied diagram or infographic, a progressive image reveal whose sections combine into one whole, or a short explanatory clip. The asset must perform one clear learning job and remain legible on a mobile screen. Labels, symbols and relationships must be readable without zooming. Avoid dense poster layouts, long explanatory paragraphs inside the image, multiple unrelated diagrams and decorative imagery that adds no understanding.
  - **Rhythm role:** teaching.

---

### InteractiveHotspotImage

**File:** `src/components/learning/InteractiveHotspotImage.jsx`
**Purpose:** Full-screen image with tappable hotspots. Two-phase: intro reveal → explore hotspots. Two variants: `detail` (default — one card of labelled rows per hotspot) and `reveal` (pages through multiple pieces of information per hotspot, `reveals[]`). Optional `synthesis` shows a "collection complete" summary once all hotspots are explored.
**Props:** `subject`, `title`, `introText`, `image`, `imageAlt`, `hotspots`, `ctaLabel`, `variant`, `synthesis`, `onBack`, `onEnterExplore`, `onContinue`
**Dependencies:** `SUBJECTS`, `MOTION`

- **Decision**
  - **Use when:** the learner needs to explore several meaningful locations within one shared image, diagram, source or object. Choose it when understanding depends on connecting each piece of information to where it appears physically, such as parts of a cell, features of a building, evidence within a historical source or structures within an organ.
  - **Do not use when:** the information is not genuinely linked to locations in the image, the learner would understand it better by seeing all labels together or the image is merely decorative. Do not use it for a collection of separate objects, a chronological sequence, numerical data or a scored image-identification question.
  - **Choose instead:** use `Infographic` when the learner needs to see the complete labelled system or summary together. Use `VisualLearning` when several full-screen visual scenes should build a guided explanation in a fixed order. Use `CinematicCarousel` when several separate items each deserve individual visual focus. Use `GraphView` when the visual information is numerical. Pair the image with an assessed question component when the learner must give a right or wrong answer rather than simply explore.
  - **Content shape:** one clear, high-quality image with usually three to six meaningful hotspots. Every hotspot must be attached to a defensible physical location and reveal information that is specifically relevant to that location. Each hotspot should have a concise title and either a small set of clearly labelled detail rows or a short progressive series of reveals. Hotspots must not overlap so closely that they are difficult to select on mobile. Avoid arbitrary dot placement, long paragraphs, hidden trivia and information that could be moved to another location without changing its meaning. Use the optional synthesis only when exploring all hotspots leads to a useful overall conclusion.
  - **Rhythm role:** teaching, exploration.

---

### VisualLearning

**File:** `src/components/learning/VisualLearning.jsx`
**What it is:** A full-screen, tap-through sequence of image-led scenes. Each scene pairs one purposeful background image with a concise headline and short explanation; the sequence can end with a larger synthesis reveal. The learner advances through the scenes in a fixed order, with governed local progress and no scored answer.
**Props:** `block`, `subject`, `onComplete`
**Interaction class:** `reveal`
**Function tags:** `hook-tension`, `teach-mechanism`
**Screen type:** `visualLearning`
**Dependencies:** `SequenceProgress`, `SUBJECTS`, `CinematicShell`, `TYPE`, `GENERAL`, `usePrefersReducedMotion`

- **Decision**
  - **Use when:** the learner should move through a short, guided sequence of full-screen visual scenes that gradually builds one explanation, narrative or change in understanding. Choose it when each scene adds a new layer and the final scene can synthesise what the learner has just seen. The order should support the intended narrative, but the component is not intended to teach the formal order of named stages.
  - **Do not use when:** all the information belongs to different locations within one image, the items form a non-sequential collection or the order of the stages is itself the knowledge being taught. Do not use it for one isolated dramatic image, text-heavy teaching, free exploration or assessment.
  - **Choose instead:** use `InteractiveHotspotImage` when the learner should inspect different locations within one shared image. Use `CinematicCarousel` when several related but independent items can be explored individually and in either direction. Use `TimelineChain` when the identity, order or causal connection of distinct stages is the central learning. Use `CinematicRevealMoment` when only one powerful visual moment is required. Use `ConceptReveal` when one idea needs introducing without a multi-scene visual narrative.
  - **Content shape:** usually three to six full-screen scenes. Each regular scene needs one purposeful background image, one concise headline and one short explanatory statement. Each scene must advance the same central explanation rather than repeat it in different words. The final reveal should synthesise the scenes into one clear conclusion or changed understanding. Avoid long paragraphs, fact lists, decorative stock images and scenes that could be removed without weakening the narrative. Do not disguise an ordinary slideshow as visual learning: the images must carry meaningful explanatory or emotional work.
  - **Rhythm role:** opening, teaching.

---

### KeyFigureReveal

**File:** `src/components/learning/KeyFigureReveal.jsx`
**What it is:** A full-screen, portrait-led introduction to one important person. The learner meets the figure through their name and role, then swipes through focused sections covering their ideas, evidence, contribution, significance or impact. Sections may include concise explanation, supporting imagery, a quotation and a takeaway.
**Props:** `block`, `subject`, `onComplete`
**Interaction class:** `reveal`
**Function tag:** `introduce-figure`
**Screen type:** `keyFigureReveal`
**Dependencies:** `SUBJECTS`, `TYPE`, `SPACING`, `COMPONENT_SIZE`, `RADII`, `GENERAL`, `MOTION`, `CinematicShell`, `ContinueCTA`, `SequenceProgress`

- **Decision**
  - **Use when:** one person is important enough to organise the learner’s understanding of the topic, and the learner needs to know who they were, what they contributed and why they mattered. Choose it when the figure is a meaningful conceptual anchor rather than simply a name that appears in the specification.
  - **Do not use when:** the person is a minor factual detail, several people need equal coverage, two people need direct comparison or the main learning is a chronology of events rather than the significance of the individual. Do not use it just because a portrait is available.
  - **Choose instead:** use `TheoryCompare` when two people need developed parallel comparison. Use `CinematicCarousel` when several people each need a shorter introduction as members of one related set. Use `ConceptReveal` when the central learning is an idea rather than a person. Use `TimelineChain` when the important content is a chronological sequence of the person’s work or changing influence. Use a standard teaching screen when only a brief contribution or name needs mentioning.
  - **Content shape:** exactly one significant figure with a strong, relevant portrait, a clear role or identity line and usually two to four focused sections. Each section should have one distinct job, such as background, key idea, evidence, contribution or impact. Keep the sections concise and finish with a clear statement of why the person matters to the topic. Quotes and supporting images must add evidence or meaning rather than atmosphere alone.
  - **Rhythm role:** opening, teaching.

### Opening family rhythm rule

Choose one clear opening treatment according to the learning job:

- one concept → `ConceptReveal`
- one emotionally significant moment → `CinematicRevealMoment`
- one important person → `KeyFigureReveal`
- one related visual collection → `CinematicCarousel`

Do not stack these components simply because they are cinematic. After the opening beat, move promptly into explanation, exploration, practice or retrieval. Do not place `CinematicRevealMoment`, `ConceptReveal`, `KeyFigureReveal` and `CinematicCarousel` consecutively; that creates passive spectacle rather than learning rhythm. `CinematicRevealMoment` should be the rarest of the four because it carries the least teaching content by itself.

---

### QuickRecallScreen

**File:** `src/components/learning/QuickRecallScreen.jsx`
**Purpose:** Rapid-fire retrieval screen for choice and connection questions. Fast-paced sequence with immediate feedback.
**Props:** `block`, `subject`, `onComplete`, `onBack`
**Dependencies:** `SUBJECTS`, `AnswerInteraction`

---

### PriorKnowledgeRecall

**File:** `src/components/learning/PriorKnowledgeRecall.jsx`
**Purpose:** Full-screen chapter-opening recall screen. Student writes free-text recall of the previous chapter. Claude (via `/api/recall`) scores each expected concept 0.0–1.0. Missing concepts (score < 0.3) are logged to the weakness tracker, feeding `WeakSpotRecovery` and future retrieval. Results are shown in three colour-coded groups: recalled (teal), partial (amber), gaps (muted).
**Props:** `block`, `subject`, `onContinue`, `onBack`
**Block shape:** `{ type: 'priorKnowledgeRecall', chapterTitle, prompt?, backgroundImage?, concepts: [{ tag, label, keywords[] }] }`
**Screen type:** `priorKnowledgeRecall`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `weaknessTracker`, `/api/recall`

---

### RecoveryQuizPlayer

**File:** `src/components/learning/RecoveryQuizPlayer.jsx`
**Purpose:** Lightweight recovery quiz player (3–4 focused questions). Launched from WeakSpotRecovery for targeted remediation.
**Props:** `quizId`, `subject`, `onComplete`, `onBack`
**Dependencies:** `SUBJECTS`, `AnswerInteraction`, `recoveryQuizzes.js`

---

### WeakSpotRecovery

**File:** `src/components/learning/WeakSpotRecovery.jsx`
**Purpose:** Full-screen behavioural intervention screen shown when a learner struggles. Presents the weak topic with explanation and a recovery CTA. Calm, non-punitive.
**Props:** `block`, `subject`, `progress`, `onBack`, `onFixWeakSpot`, `onSkip`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`

---

### ColSortBlock

**File:** `src/components/learning/ColSortBlock.jsx`
**What it is:** Interactive categorisation task where learners sort items into labelled columns.
**Best used for:** Grouping concepts into categories (e.g., "Supernatural vs Natural causes", "Treatments vs Prevention methods"). Tap-to-select with visual feedback.
**Props:** `block`, `subject`, `onComplete`
**Dependencies:** `SUBJECTS`, `MOTION`

- **Decision**
  - **Use when:** the learner needs to place several short statements, examples or concepts into clearly labelled categories and benefit from seeing the completed groups together.
  - **Do not use when:** the learner has not yet been taught the distinction between the categories. Do not use it for one-to-one pairs, ordered stages, developed comparisons or items that could reasonably belong in more than one category.
  - **Choose instead:** use `SwipeSort` when the activity should feel faster and each item can be judged independently without needing to study the completed groups together. Use `MatchingTask` for one-to-one pairs. Use `OrderedRouteTask` when sequence matters. Use `TheoryCompare` when two approaches require developed explanation rather than learner classification. Use `OppositeQualitiesReveal` when the contrast is being taught through guided visual grouping rather than tested.
  - **Content shape:** two or more clearly labelled categories with several concise items. Every item must have one defensible destination. Category labels must represent meaningful conceptual groups, not arbitrary containers. Keep item wording short enough to scan and compare once placed.
  - **Rhythm role:** practice, retrieval.

---

### ExaminerExplainsScreen

**File:** `src/components/learning/ExaminerExplainsScreen.jsx`
**Purpose:** Full-screen explanatory screen with animated word-by-word text reveal and atmospheric background image. Used to deliver post-question insight in a cinematic way.
**Props:** `screen`, `subject`, `onContinue`
**Dependencies:** `SUBJECTS`, `MOTION`

---

### GraphView

**File:** `src/components/learning/GraphView.jsx`
**What it is:** Embeddable SVG chart block — bar, line, scatter, or pie — rendered inline within a content screen.
**Best used for:** Displaying GCSE Maths/Science data (frequency tables, linear/real-life graphs, scatter graphs with line of best fit, proportion/probability pie charts) alongside a question elsewhere on the screen (e.g. an `ExamQuestionFrame`/`quiz` block that says "use the graph to find..."). Purely a data display — does not log to the weakness tracker itself.
**Props:** `block`, `subject` (defaults to `Maths`)
**Block shape:** `{ type: 'graphView', graphType: 'bar'|'line'|'scatter'|'pie', title?, caption?, xLabel?, yLabel?, data?: [{label, value}], points?: [{x, y}], lineOfBestFit?: {from: {x,y}, to: {x,y}}, xMin?, xMax?, yMin?, yMax? }`
**Screen type:** `graphView` (content block, rendered inside `Screen` in `ModulePlayer.jsx`)
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `TYPE`, `CardContainer`

- **Decision**
  - **Use when:** the learner needs to see a numerical relationship represented visually, such as quantities across categories, change over time, correlation between variables or proportion of a whole. Choose it when a graph communicates the pattern more clearly than prose or a list of numbers. `GraphView` displays the data; it does not assess the learner by itself.
  - **Do not use when:** the information is qualitative, the values do not form a meaningful visual relationship or the graph is being added merely to make the screen appear academic. Do not use it for a conceptual system, a process diagram, a before-and-after image comparison or an activity that needs its own answer and scoring logic.
  - **Choose instead:** use `Infographic` for a conceptual model, labelled system or non-numerical summary. Use `TimelineChain` when stages or causal order matter more than numerical change. Use `BeforeAfterImageSlider` when the learner needs to inspect visual change between two states. Place `GraphView` alongside an appropriate quiz or exam-question component when the learner must interpret the data and submit a scored answer.
  - **Content shape:** one appropriate graph type: bar chart for comparing categories, line graph for continuous change or trends, scatter graph for relationships or correlation, or pie chart for proportions of a whole. Include a concise title and all labels, units, scales and legends needed to interpret the graph correctly. Keep the number of bars, points and labels manageable on mobile. Axes and intervals must be accurate and must not create a misleading impression. A line of best fit should appear only when it supports the intended scatter-graph learning. Pie-chart values must represent a coherent whole. Any interpretation prompt, calculation or scored response belongs to the surrounding learning or assessment component, not to `GraphView` itself.
  - **Rhythm role:** teaching.

---

### GuidedChoiceCarousel

**File:** `src/components/learning/GuidedChoiceCarousel.jsx`
**Purpose:** Horizontally scrollable single-choice carousel with atmospheric visual option cards. Used for healer/role selection scenes. The chosen option is passed to `onContinue` so downstream screens can personalise content.
**Props:** `subject`, `headline`, `question`, `helperText`, `promptVisual`, `options`, `onBack`, `onContinue(nextScreenId, selectedOption)`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`

---

### MatchingTask

**File:** `src/components/learning/MatchingTask.jsx`
**What it is:** Card-pair matching activity with visual connector lines.
**Best used for:** Linking terms to definitions, concepts to examples, or causes to effects (e.g., "Medieval beliefs" ↔ "Treatments"). Splits large sets into rounds. One-retry mechanism.
**Props:** `screen`, `subject`, `onComplete`
**Screen data shape:** `{ pairs: [{ id, term, answer, weakGroup }], backgroundImage }`
**Dependencies:** `MOTION`, `unifiedWeaknessTracker`

- **Decision**
  - **Use when:** the learner needs to connect each item with one corresponding partner, such as a term with its definition, a cause with its consequence, a person with their contribution or a quotation with its interpretation.
  - **Do not use when:** several items belong under the same category heading, the order between stages matters, an item could reasonably match more than one partner or the relationship requires developed explanation rather than a concise pairing.
  - **Choose instead:** use `ColSortBlock` when several items must be grouped beneath shared category headings. Use `SwipeSort` for a faster item-by-item classification check. Use `OrderedRouteTask` when the learner must place stages in sequence. Use `TheoryCompare` when two people, theories or approaches require a developed parallel comparison. Use `ExplainReveal` when the relationship forms a cause-and-effect reasoning chain that still needs to be taught.
  - **Content shape:** a set of clear one-to-one pairs. Each item must have one defensible partner and each partner should normally be used once. Both sides should be concise enough to scan while making meaningful connections rather than matching through superficial wording clues. Avoid oversized sets that turn the task into visual searching rather than retrieval.
  - **Rhythm role:** retrieval, practice.

---

### OrderedRouteTask

**File:** `src/components/learning/OrderedRouteTask.jsx`
**Screen type:** `orderedRouteTask`
**What it is:** Ordered chain activity — one job card is shown at a time beneath the heading; the learner taps the stage on the numbered vertical route it belongs to. Correct taps lock the job beneath that stage immediately; wrong taps show a persistent clue-based hint ("Not here — look for the stage near railways.") and allow another tap. Route line, nodes and surfaces derive from the supplied subject's accent.
**Best used for:** Recalling the steps or stages of a process in order — evacuation chains, scientific processes, historical sequences.
**Props:** `screen`, `subject`, `onComplete`
**Screen data shape:**
```js
{
  type: 'orderedRouteTask',
  title, titleHighlight?, subtitle?, prompt?, weakGroup?, completionText?, backgroundImage?,
  stages: [{ id, icon, title, clue, answerId }],  // icon: 'helmet'|'cross'|'hut'|'train'|'ship'
  answers: [{ id, text }],
}
```
**Interaction:** jobs are shuffled and presented one at a time; tap a stage row (a real button, keyboard-focusable) to place. First wrong attempt per job logs a weakness; a clean first-attempt placement logs a correct answer. After the final placement the rebuilt chain stays on screen with `completionText`, then the governed `ContinueCTA` reveals — completion is learner-controlled, never automatic.
**Dependencies:** `TYPE`, `SPACING`, `RADII`, `MOTION`, `SUBJECTS`, `CinematicShell`, `ContinueCTA`, `unifiedWeaknessTracker`

- **Decision**
  - **Use when:** the learner has already been taught a process or sequence and now needs to recall where each known event, action or stage belongs in the correct order.
  - **Do not use when:** the sequence is still being introduced, the learner has not yet seen the stages clearly or the relationship between the items is unordered. Do not use it for matching pairs, category grouping or a chronology where several answers could reasonably fit the same position.
  - **Choose instead:** use `TimelineChain` to teach or explore the sequence first. Use `ExplainReveal` when the learner still needs to understand why one step leads to the next. Use `MatchingTask` when items form one-to-one pairs but order does not matter. Use `ColSortBlock` or `SwipeSort` when items belong within shared categories rather than numbered stages.
  - **Content shape:** a known sequence with clearly defined stages and one defensible position for every item. Stage headings should provide enough meaning for the learner to reason rather than guess. Items must be concise and should test understanding of the sequence, not reading endurance. Avoid ambiguous placement and stages that overlap substantially.
  - **Rhythm role:** practice, retrieval.

---

### CentreImageReveal

**File:** `src/components/learning/CentreImageReveal.jsx`
**Purpose:** Three-phase cause → prescription → reveal flow. Learner selects a theory, fills inputs on a parchment surface (fuzzy-match validated), then sees correct treatments revealed. Personalises heading if a `selectedHealer` prop is passed from GuidedChoiceCarousel. Its select phase opens with the `MedievalDiagnosisScene` hero.
**Props:** `screen`, `selectedHealer`, `onComplete`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `TYPE`, `MedievalDiagnosisScene`

---

### MedievalDiagnosisScene

**File:** `src/components/learning/MedievalDiagnosisScene.jsx`
**Purpose:** Cinematic 9:16 SVG hero scene — "Medieval diagnosis chamber". Thomas sits at a candlelit table while the four medieval explanations of illness (God & sin, four humours, miasma, astrology) fade in around him one at a time, each with its treatment symbol, then settle into tappable zones and a calm idle loop (candle flicker, rotating star chart, drifting miasma). Sits above the belief selection in `CentreImageReveal`; zones drive the same selection as the cards. Reduced motion renders the static end state.
**Props:** `theories`, `completedIds`, `onSelectZone`, `playIntro`, `prefersReducedMotion`, `style`
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`, `TYPE`
**Do not use when:** The screen is not the medieval Medicine cause → treatment context — the scene content is Chapter 1 specific.

---

### MemoryHook

**File:** `src/components/learning/MemoryHook.jsx`
**Purpose:** In-page "make it stick" reminder block. Anchors one hard idea with a memorable analogy or mnemonic, optionally beside a small author-supplied thumbnail. A pencil affordance lets the learner rewrite the hook in their own words (generation effect); the personalised version persists per hook via `src/lib/storage.js` and shows a "Your version" caption.
**Best used for:** Dropping a light, memorable recall aid *within* a page "here and there", or landing a screen's takeaway — not for drilling an acronym interactively (use `AcronymMemorise`). Reusable across all subjects.
**Props:** `block` (`{ id?, label?, hook, image?, imageAlt? }`), `subject`
**Dependencies:** `SUBJECTS`, `GENERAL`, `SPACING`, `RADII`, `MOTION`, `TYPE`, `storage.js`
**Block type:** `memoryHook` (routed in `ModulePlayer`).
**Contract:** `docs/system/component-contracts/memory-hook.md` (composition classification: content).

---

### MisconceptionCheck

**File:** `src/components/learning/MisconceptionCheck.jsx`
**What it is:** Cinematic true/false misconception trap checker.
**Best used for:** Catching common false beliefs (e.g., "Galen was never wrong" — FALSE). Full-screen, one statement at a time. Calm, non-punitive reveals. Logs to weakness tracker.
**Props:** `block`, `subject`, `onContinue`
**Block shape:** `{ type: 'misconceptionCheck', statements: [{ statement, answer: true|false, reveal, examTrap? }] }`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `BUTTONS`, `unifiedWeaknessTracker`

---

### SpotTheError

**File:** `src/components/learning/SpotTheError.jsx`
**Scoring logic:** `src/components/learning/spotTheErrorScoring.js` (pure, unit-tested)
**Story:** `src/components/learning/SpotTheError.stories.jsx`
**What it is:** Three-stage diagnostic precision task — locate the wrong word/phrase (contiguous, keyboard-accessible selection), explain why it is wrong, then rewrite it correctly. Full-bleed (owns its own 100dvh scroll + safe-area) so the staged fields and actions stay reachable with the keyboard open.
**Best used for:** Precision-checking misconceptions or calculation errors. Teaches diagnosis and repair, not just recognition. Evaluates and gives specific feedback on all three stages independently, logging `Error identification`, `Scientific precision` and `Error correction` weaknesses.
**Props:** `block`, `subject`, `onContinue`
**Block shape:** `{ type: 'spotTheError', statement, errorTarget, whatWasWrong, correctVersion, examinerNote?, commonTrap?, missHeading?, explanationCriteria?: { anyOf?, allOf?, supportingAnyOf? }, keyTerms? (legacy — treated as explanationCriteria.anyOf), explanationHint?, explanationPraise?, repairKeyTerms?, acceptableRepairs?, repairMustAvoid?, minimumExplanationLength?, minimumRepairLength? }`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `GENERAL`, `CinematicShell`, `ContinueCTA`, `CheckAnswerCTA`, `unifiedWeaknessTracker`, `spotTheErrorScoring`

---

### SwipeSort

**File:** `src/components/learning/SwipeSort.jsx`
**What it is:** Swipe-gesture categorisation activity with cards dragged into zones.
**Best used for:** Binary or multi-way classification (e.g., "Supernatural vs Natural" causes). Mobile-friendly drag interaction. Fast-paced categorisation tasks.
**Props:** `block`, `subject`, `onComplete`
**Dependencies:** `SUBJECTS`, `MOTION`

- **Decision**
  - **Use when:** the learner needs a quick, energetic classification check where each short item can be judged independently and moved into one of a small number of clear categories.
  - **Do not use when:** the learner needs to compare all items at once, inspect the completed groups carefully, read substantial text, build a sequence or consider nuanced overlap between categories. Do not use it merely to add movement to the module.
  - **Choose instead:** use `ColSortBlock` when seeing the final grouped columns supports understanding or comparison. Use `MatchingTask` for one-to-one pairs. Use `OrderedRouteTask` when order matters. Use `OppositeQualitiesReveal` when the categories are still being taught rather than assessed.
  - **Content shape:** a stream of short, independently understandable items with two or a small number of unambiguous destinations. Each item should be readable at a glance. Avoid long explanations, compound statements and examples that require evidence elsewhere on the screen.
  - **Rhythm role:** retrieval, practice.

---

### TheoryCompare

**File:** `src/components/learning/TheoryCompare.jsx`
**Reveal logic:** `src/components/learning/theoryCompare.js` (pure)
**Story:** `src/components/learning/TheoryCompare.stories.jsx`
**Interaction class:** `reveal` (`teach-comparison`) — teaching-first and unassessed. Never a disguised quiz; no right/wrong judgement.
**Pedagogical purpose:** teach a meaningful comparison through progressive reveal, so the learner understands *why* two things differ before any retrieval is expected.
**Props:** `block`, `subject`, `onComplete?`

Side-by-side comparison of any two approaches, people or theories. Two labelled sides kept as compact headers with a central division; one comparison theme revealed at a time; a full-width teaching explanation beneath the columns where needed; example rows within a theme; a single closing takeaway. `emphasisSide` (`'left' | 'right' | 'none'`) gives one side restrained subject-accent emphasis (e.g. the evidence-backed side of a belief-versus-reality comparison); `'none'` keeps both sides visually equal for a neutral concept comparison. All colour derives from the subject accent token — content data carries no raw colours.

Portraits are optional. Supply `image`/`imageAlt` per side (and/or a `heroImage`) for a person-to-person comparison; when none are supplied the two portrait boxes render **empty**, ready for images to be added in future, and the labelled sides carry the comparison on their own.

- **Data shape:**
  ```
  {
    type: 'theoryCompare',
    title?,
    emphasisSide?,               // 'left' | 'right' | 'none' (default 'none')
    heroImage?, heroImageAlt?,   // optional cinematic dual-portrait banner (~30vh) that darkens into the screen; when omitted, two compact circular portrait boxes are used instead
    leftPerson:  { name, subtitle?, image?, imageAlt? },
    rightPerson: { name, subtitle?, image?, imageAlt? },
    comparisons: [
      // single-row theme
      { id, prompt?, left, right, explanation?, emphasisSide? },
      // multi-example theme (optional summary note)
      { id, prompt?, rows: [{ label, left, right }], note?, explanation?, emphasisSide? },
    ],
    takeaway?,
  }
  ```
- **Decision**
  - **Use when:** two approaches, people or models need developed parallel comparison.
  - **Do not use when:** isolated words or short examples are simply placed into opposing groups.
  - **Choose instead:** use `OppositeQualitiesReveal` for short examples being visually organised into two simple opposing groups. Use `ColSortBlock` or `SwipeSort` when the learner must classify items themselves. Use `TimelineChain` when the relationship is sequential or causal. Use `FactorWeb` when several plausible factors must be explored and weighed for relative importance.
  - **Content shape:** two labelled sides, one comparison theme revealed at a time as short parallel phrases, with a full-width `explanation` carrying any developed reasoning, closing on one takeaway; a person-to-person comparison must keep both sides historically fair.
  - **Rhythm role:** teaching.

**Accessibility expectations:** portraits carry meaningful `imageAlt`; each comparison cell exposes its person's name to screen readers via a visually-hidden prefix so the Galen/Vesalius relationship survives colour- and position-only cues; progression uses the governed `ContinueCTA` (keyboard-operable, visible focus); focus moves to the takeaway when it reveals; motion respects `prefers-reduced-motion`; DOM reading order is prompt → left → right → explanation.

**Galen / Vesalius example (Episode 3, "The beginning of doubt"):** compares Galen (animal dissection) and Vesalius (human dissection) across method, evidence-building, anatomical conclusions (jaw, ribs, breastbone) and impact, closing on *"Vesalius did not prove that everything Galen believed was wrong. He proved that old ideas should be checked against evidence."*

**Dependencies:** `SUBJECTS`, `TYPE`, `SPACING`, `RADII`, `MOTION`, `ContinueCTA`

---

### OppositeQualitiesReveal

**File:** `src/components/learning/OppositeQualitiesReveal.jsx`
**Contract:** `docs/system/component-contracts/opposite-qualities-reveal.md`
**Purpose:** Passive, guided reveal for two opposing concepts. Items appear centrally, travel toward the configured left or right concept, then remain grouped under the correct final heading.

- **Decision**
  - **Use when:** several short words, symptoms or qualities clearly belong to one of two opposites.
  - **Do not use when:** each side needs evidence, explanation or developed reasoning.
  - **Choose instead:** `TheoryCompare` for a substantial comparison.
  - **Content shape:** a handful of short items (words, symptoms, qualities) with no explanation attached, each cleanly belonging to one of two opposing concepts — e.g. Hot/Cold and Wet/Dry quality symptoms in Medicine Episode 1.
  - **Rhythm role:** teaching.

**Accessibility expectations:** Final DOM groups every item under its concept label; movement is decorative and not the only carrier of meaning; reduced motion renders the complete grouped state.

### TimelineCanvas

**File:** `src/components/learning/TimelineCanvas.jsx`
**What it is:** Full-screen "swipe to pan" canvas — natively horizontally-scrollable wide canvas of step cards connected by curved SVG paths and connector dots; the user pans with a 1:1 finger swipe. Each connector line draws itself in (and its dot lights up) as the pan position passes over it. A bouncing "Swipe to explore →" hint fades once panning begins. Tapping a card's "+" opens a "Why it mattered" detail panel below the canvas (gated continue, like `TimelineChain`).
**Best used for:** A deliberately different rhythm to `TimelineChain` — an occasional "jarring" interruption to vary pacing between chapter moments, reusing the same kind of causal-chain content. Not for routine use; the spring/bounce motion is an intentional one-off exception to the Motion Rules (documented in-file).
**Props:** `block`, `subject` (defaults to `History`), `onContinue`
**Block shape:** `{ type: 'timelineCanvas', title?, intro?, steps: [{ id?, icon?, image?, label, detail, stats?: [string, string] }] }`
**Screen type:** `timelineCanvas` (full-screen, routed directly in `ModulePlayer.jsx` like `TimelineChain`)
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`

- **Decision**
  - **Use when:** a particularly important sequence benefits from a wide spatial journey that the learner actively pans through, and the module needs an occasional change of pace from the standard screen rhythm.
  - **Do not use when:** a normal `TimelineChain` would communicate the sequence just as clearly. Do not use it for routine sequences, very short chains, dense explanations or simply to make the module feel more visually varied. It should remain an occasional high-impact interaction rather than the default timeline.
  - **Choose instead:** use `TimelineChain` for most chronological, causal and procedural sequences. Use `ExplainReveal` when the focus is a compact reasoning chain rather than distinct events or stages. Use `OrderedRouteTask` when the learner should demonstrate that they know the correct order.
  - **Content shape:** a visually distinct sequence, usually four to seven stages, that benefits from being experienced as a journey across a wider canvas. Each stage needs a short label, a concise explanation and a meaningful place in the overall progression. Avoid long paragraphs, minor facts and stages that are not visually or conceptually distinct.
  - **Rhythm role:** exploration.

---

### TimelineChain

**File:** `src/components/learning/TimelineChain.jsx`
**What it is:** Full-screen sequence component with two variants. **`interactive`** (default) — a horizontal scroll-snap chain of flip cards connected by a connector rail (line segments + dot per card). **`reveal`** — a passive vertical sequence that reveals one step at a time behind a "Reveal next" CTA, absorbing the behaviour of the former `VisualNarrativeScreen`.
**Best used for:**
- *Interactive:* A chapter's "big idea" causal sequence the learner explores at will (e.g. how the Black Death spread). Card fronts show a short step label; tapping flips a card to reveal why that step mattered. Continue only appears once every card has been flipped.
- *Reveal:* A short cause→effect narrative delivered one calm statement at a time (e.g. "bad air → sweeten the air → the real cause was microbes"). Each press reveals one more step; the standard `ContinueCTA` replaces "Reveal next" once all steps show; an optional accent takeaway closes it.
**Props:** `block`, `subject` (defaults to `History`), `onContinue`, `variant` (`'interactive'` | `'reveal'`; falls back to `block.variant`, then `'interactive'`)
**Block shape (interactive):** `{ type: 'timelineChain', title, intro?, steps: [{ id?, icon?, image?, label, detail }] }`
**Block shape (reveal):** `{ type: 'timelineChain', variant: 'reveal', title?, intro?, source?, steps: [{ id?, icon?, statement, detail? }], takeaway? }` — `statement`/`detail`/`takeaway` accept a plain string or an array of `{ text, highlight? }` segments for inline subject-accent highlighting. `statement` (not `label`) is the primary field so full-sentence copy is not scanned by the sentence-case heading guard.
**Screen type:** `timelineChain` (full-screen, routed directly in `ModulePlayer.jsx`). Legacy `type: 'visualNarrative'` screens are mapped to the reveal variant at render time via `src/data/visualNarrativeCompat.js`.
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `ContinueCTA`, `timelineChainReveal.js` (pure reveal logic)

- **Decision**
  - **Use when:** the learner needs to understand or explore a meaningful sequence of distinct events, stages or developments where the order or causal connection matters. Use the interactive variant when each stage is worth exploring individually. Use the reveal variant for a shorter, calmer narrative that unfolds one linked statement at a time.
  - **Do not use when:** the content is merely a list of related facts, the order can be changed without affecting the meaning or the main learning job is comparison, categorisation or relative importance. Do not use it to test whether the learner knows the order.
  - **Choose instead:** use `ExplainReveal` when the main learning is the reasoning that connects a short cause → mechanism → consequence chain. Use `OrderedRouteTask` when the sequence has already been taught and should now be assessed. Use `TimelineCanvas` only when an important sequence benefits from a deliberately different, spatial exploration rhythm. Use `TheoryCompare` when two sides need parallel comparison rather than sequential explanation.
  - **Content shape:** a clear chronological, causal or procedural sequence of distinct stages. Each stage needs a short identifying label or statement and a concise explanation of why it matters. Usually use three to seven stages. Every stage must earn its place in the chain and the sequence should lead towards a clear outcome or takeaway. For the interactive variant, each stage should make sense as an individually explored card. For the reveal variant, each statement should flow naturally into the next and form one calm narrative.
  - **Rhythm role:** teaching, exploration.

---

### TimelineChainBlock

**File:** `src/components/learning/TimelineChain.jsx` (named export, alongside `TimelineChain`)
**What it is:** Embedded variant of `TimelineChain` — the same flip-card chain with connector rail, scaled down to sit inline within a normal content screen instead of taking over the full screen. No completion gating; the screen's own Continue/Next controls progression.
**Best used for:** Slotting a short causal/sequence chain (2–5 steps) into an existing content screen alongside its heading/intro — e.g. recapping a transmission chain just explored elsewhere. Each card front can show a placeholder/illustrative `image` with an overlaid step number, plus a short label; tapping flips to reveal the "why it mattered" detail. An optional `outro` paragraph (e.g. a reflection prompt) renders below the chain.
**Props:** `block`, `subject` (defaults to `History`)
**Block shape:** `{ type: 'timelineChain', intro?, steps: [{ id?, icon?, image?, label, detail }], outro? }`
**Screen type:** `timelineChain` (content block, rendered inside `Screen` in `ModulePlayer.jsx` — same block-type string as the full-screen variant's screen type, but checked on `block.type` rather than `screen.type`)
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`

---

> **VisualNarrativeScreen — RETIRED. Do not recreate, restore, or register it.**
> Its beat-based progressive-reveal behaviour was absorbed into `TimelineChain`'s
> `reveal` variant (see above) — that variant is now the **sole** source of truth for
> this interaction pattern.
> - New progressive narrative / statement-sequence screens **must** use `TimelineChain`
>   with `variant: 'reveal'`.
> - Interactive ordering / causal-chain screens continue to use `TimelineChain`'s
>   default `interactive` variant.
> - Legacy `type: 'visualNarrative'` content is mapped to the reveal variant via
>   `src/data/visualNarrativeCompat.js` — this is **migration-only** compatibility code.
>   Never author new content as `visualNarrative`, and never build new features on the
>   compat mapper.
>
> Any older per-module architecture doc that lists `VisualNarrativeScreen` as a
> suggested component is superseded by this entry.

---

## `src/components/layout/`

Module-level orchestration and chapter framing screens.

### ChapterCompleteScreen

**File:** `src/components/layout/ChapterCompleteScreen.jsx`
**Purpose:** End-of-chapter completion screen with score and stats. Emotional beat — acknowledges progress without being childish.
**Props:** `subject`, `chapterTitle`, `score`, `totalQuestions`, `onContinue`, `onReview`
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`

---

### ChapterHookScreen

**File:** `src/components/layout/ChapterHookScreen.jsx`
**Purpose:** Chapter intro hook screen with a true/false warm-up statement. Sets the emotional context before the chapter begins.
**Props:** `subject`, `chapterNum`, `chapterTitle`, `statement`, `isTrue`, `accentWords`, `explanation`, `onBack`, `onContinue`
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`

---

### ChapterOutcomeScreen

**File:** `src/components/layout/ChapterOutcomeScreen.jsx`
**Purpose:** Chapter outcome reveal screen. Shows learner performance with cinematic context.
**Props:** `subject`, `chapterTitle`, `onContinue`, `onBack`
**Dependencies:** `SUBJECTS`

---

### ModulePlayer

**File:** `src/components/layout/ModulePlayer.jsx`
**Purpose:** In-module lesson flow orchestrator. Routes between all block types based on module screen data.
**Props:** `moduleId`, `onComplete`, `onBack`
**Dependencies:** All learning + feedback components

---

## `src/components/feedback/`

Question feedback and exam practice components.

### ExamQuestionFrame

**File:** `src/components/feedback/ExamQuestionFrame.jsx`
**Purpose:** Universal exam question component with mark scheme reveal. Presents structured exam questions with marks, model answers, and AQA-style formatting.
**Props:** `block`, `subject`, `onContinue`, `onBack`
**Dependencies:** `SUBJECTS`

---

---

## `src/components/learning/` (continued)

### QuoteAnalyser

**File:** `src/components/learning/QuoteAnalyser.jsx`
**What it is:** Full-screen quote analysis screen with a cinematic hero quote section (animated word-by-word reveal, optional background image), a ripped-seam SVG divider, and 5 tappable analysis item cards. Each card expands to a full-screen overlay; Continue only unlocks once all 5 items have been seen.
**Best used for:** English Literature close reading — any play, poem, or novel extract where the learner needs to explore word choice, connotations, literary methods, interpretations, and essay construction from a single quotation.
**Props:** `block`, `subject` (defaults to `'English'`), `onContinue`
**Block shape:**
```js
{
  type: 'quoteAnalyser',
  quote: string,            // full quote text including opening/closing marks
  location: string,         // e.g. 'Act I, Scene IV — Macbeth'
  backgroundImage?: string, // optional path for hero background
  items: [{
    id: string,
    icon: 'search' | 'feather' | 'mask' | 'bulb' | 'flame',
    heading: string,
    explainer: string,
    content: {
      title?: string,
      body: string,
      keyWords?: string[],  // renders as accent-coloured chips below body
    },
  }]
}
```
**Screen type:** `quoteAnalyser` (full-screen, routed in `ModulePlayer.jsx`)
**Animation:** word-by-word quote reveal via staggered `opacity` transitions; card entrance via `qa-card-in` CSS keyframe; seen-tick pop via `qa-tick-pop`; expanded overlay via `qa-slide-up`
**Dependencies:** `SUBJECTS`, `RADII`, `TYPE`, `ContinueCTA`

---

### RetrievalFrame — **LOCKED**

**File:** `src/components/feedback/RetrievalFrame.jsx`
**What it is:** Cinematic wrapper for spaced-retrieval practice questions.
**Best used for:** Testing knowledge recall in a low-pressure moment. Wraps any question type with atmospheric framing. No penalty for wrong answers.
**Props:** `block`, `subject`, `progress`, `onAnswer`, `onContinue`, `onBack`
**Lock reason:** Visual contract for all retrieval screens. Changing it risks inconsistency across all question presentations.
**Dependencies:** `AnswerInteraction`, `SUBJECTS`