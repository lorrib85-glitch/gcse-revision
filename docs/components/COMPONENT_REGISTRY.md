# Component Registry

**Last updated:** 2026-07-28
**Scope:** The canonical human-readable registry for documented standalone
components in `src/components/`. Catalogue completeness is governed separately —
a component missing an entry here is a documentation gap, not evidence that the
component is defective or unusable.

**Authority:** This file is the only human-readable Component Registry. The
machine-readable pedagogical taxonomy is `src/data/componentFunctions.js`; the
authorable screen/block contract is `src/data/screenRegistry.js`; locked-component
rules are in `docs/components/LOCKED_COMPONENTS.md`.

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
**Used by:** every screen-to-screen "Continue" button across `src/components/learning/` and `src/components/feedback/`, plus `ChapterPlayer`'s bottom navigation (also covers the "Finish ✓" label via `label`)
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

### LearningToolbar — **LOCKED**

**File:** `src/components/core/LearningToolbar.jsx`
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


### AcronymMemorise

**File:** `src/components/learning/AcronymMemorise.jsx`
**What it is:** An interactive mnemonic component that introduces an acronym, lets the learner reveal what each letter represents and then switches into an unscored self-test mode in which the answers are hidden again. The learner is prompted to say each meaning before tapping to check it.
**Best used for:** Learning a short, stable set of related ideas that can be encoded naturally through their initial letters.
**Props:** `block`, `subject`
**Block shape:** `{ type: 'acronymMemorise', intro?, memoryTarget?, instruction?, showIntro?, readyText?, testInstruction?, testPrompt?, testCompleteText?, testCtaLabel?, learnCtaLabel?, testRowPrompt?, subject?, items: [{ id?, letter, word, detail }] }`
**Dependencies:** `GENERAL`, `SPACING`, `SUBJECTS`, `TYPE`, `ScreenIntro`

- **Decision**
  - **Use when:** a short set of related terms can be represented by a memorable acronym without distorting the subject knowledge. Choose it when recalling the initial letters genuinely helps the learner reconstruct the complete set.
  - **Do not use when:** the words have been awkwardly rewritten merely to force an acronym, the order has no stable meaning or each item requires substantial explanation. Do not use it for causal chains, chronological stages, independent question-and-answer pairs or every list the learner encounters.
  - **Choose instead:** use `MemoryHook` when one concept needs one analogy or association rather than a multi-letter mnemonic. Use `TimelineChain` or `OrderedRouteTask` when the sequence itself matters. Use `QuickRecallScreen` when recall should be objectively marked and recorded. Use `MatchingTask` when the learner must connect independent terms with corresponding meanings.
  - **Content shape:** normally three to seven letters forming a pronounceable, familiar or otherwise memorable acronym. Every letter must map clearly to one concise word or phrase, followed by a short explanation of why that item matters. The displayed words must remain academically accurate rather than being stretched to fit the letters. The test mode should require recall before reveal, not simply invite repeated tapping.
  - **Rhythm role:** teaching, retrieval.

**Governance rule:** the self-test is useful retrieval practice, but it is not scored evidence of mastery. Opening every item only shows that the learner checked the answers; it does not prove that they recalled them correctly. Do not feed completion of `AcronymMemorise` into the weakness tracker as a correct result.

---


### AngleExplore

**File:** `src/components/learning/AngleExplore.jsx`
**What it is:** Configuration-driven GCSE angle diagram — the Maths sibling of `CircuitDiagram`. Shapes and angles render as inline SVG; one learner-controlled value (a draggable ray, or a triangle's draggable apex) drives live sector values, angle classifications and an angle-fact status line. Five registered presets — `angleTypes` (drag a ray, watch the value and its acute/right/obtuse/straight/reflex classification), `straightLine` (two angles summing to 180°), `aroundPoint` (three angles summing to 360°), `verticallyOpposite` (equal pairs sharing a colour), `triangle` (drag the apex, interior angles always total 180°) — plus a compatible-preset-object escape hatch. `interactive={false}` turns any preset into a static teaching or exam diagram at a fixed `value`. The drag handle is a keyboard-operable `role="slider"` (arrow keys / Home / End) with a ≥44px hit target; right angles render the GCSE square marker; values magnetise to 90°/180°/270°. Respects `prefers-reduced-motion` (and a `reducedMotion` prop override).
**Best used for:** Teaching and exploring AQA Foundation angle facts where seeing the relationship respond to movement is the point — angle types, angles on a straight line, angles around a point, vertically opposite angles, angles in a triangle. Page-level questions, predictions and marking stay outside the component (compose it like `CircuitDiagram`).
**Props:** `preset` (name or preset object, defaults to `angleTypes`), `value` (controlled), `defaultValue`, `onChange`, `interactive`, `disabled`, `subject` (defaults to `Maths`), `reducedMotion`, `label`, `showStatus`
**Screen type:** none yet — not routed in `ChapterPlayer.jsx` (new component pending review)
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
**Screen type:** none yet — not routed in `ChapterPlayer.jsx` (new component pending review)
**Dependencies:** `SUBJECTS`, `GENERAL` (via `areaPerimeter/areaPerimeterVisualRoles.js` semantic roles), `TYPE`, `SPACING`, `RADII`, `MOTION` (injected animation CSS via `ensureStyles()`, same pattern as `AngleExplore`/`CircuitDiagram`); neutral shared geometry in `geometry/shapeGeometry.js` (also used by `angle/`), presets in `areaPerimeter/areaPerimeterPresets.js`
**Closest alternatives:** `AngleExplore` (angle facts, not mensuration — do not add area/perimeter modes to it); `CalculationBreakdown` (carrying out a method step by step, not seeing why a formula holds); `GraphView` (interpreting data); a static figure image (when no interaction is needed and the diagram is one-off).

- **Decision**
  - **Use when:** the learning objective is what perimeter or area *is*, or why an area formula works — and manipulating the shape makes it visible: a sloping side changing while the perpendicular height does not, a fixed boundary enclosing different amounts of space, or an internal construction line helping the area but not the perimeter. Also use its static mode for any accurate, on-theme mensuration diagram inside teaching or exam content.
  - **Do not use when:** the learner must be assessed on a calculation (compose a question component around a static instance instead); the task is executing a multi-step method rather than understanding a measure (`CalculationBreakdown`); or the content is circles, circumference, sectors, surface area or volume — none are implemented, and surface area and volume are explicitly out of scope for this component.
  - **Content shape:** pick the preset matching the idea and set `focus` to the one measure being taught; optionally fix `value` for a specific worked example. One diagram per screen, one measure at a time — `compare` is for the moment the difference between the two measures *is* the lesson, not a way to teach both at once.
  - **Rhythm role:** teaching, exploration.

---


### FractionRatioExplore

**File:** `src/components/learning/FractionRatioExplore.jsx`
**What it is:** Configuration-driven GCSE part-whole diagram — the fractions, ratio, proportion and percentage sibling of `AngleExplore` and `AreaPerimeterExplore`. One visual grammar runs through every preset: **same whole** (every bar in a preset shares one x and width; only the number of parts changes), **divided parts** (bars, 2D grids, circle sectors or discrete counters), **linked representations** (curved connectors plus a real stacked fraction glyph with a rule line, never `3/4` as flat text), and **scaling both sides together** (rungs joining two parallel lines, driven by one shared multiplier). That shared grammar is the point of the component: it is what lets a learner recognise `3/4`, `3 : 1` and `75%` as one idea rather than three topics. Eight registered presets — `fractionBar` (numerator and denominator, with the same quantity shown as a bar, a circle and notation at once), `equivalentFractions` (one multiplier; both bars deliberately share a colour and a dashed alignment line proves the shaded lengths match), `fractionOperations` (five methods × short step sequences — add and subtract step through see-the-mismatch → common denominator → combine → check, with a sum past one whole continuing into a second whole rather than overflowing one bar; `multiply` is a 2D area model with the overlap hatched; `divide` lays divisor-sized pieces along the dividend and counts them before the reciprocal rule appears; `ofAmount` uses counters, one row per part), `ratioShare` (shares, total, simplification, and the same split restated as fractions), `doubleNumberLine` (direct proportion and unit rate, exactly one live rung), `percentageGrid` (100 squares with the percentage, fraction and decimal shown together), `proportionScale` (unit blocks, solid for the original recipe and dashed for the scaled copies, with the ratio held constant), `bestValue` (two packs drawn to scale, with a basis toggle proving price-per-amount and amount-per-pound reach the same verdict) — plus a compatible-preset-object escape hatch. Three interaction kinds, all keyboard-operable: drag handles (`role="slider"`, arrow keys / Home / End, ≥44px hit target), stepper rows (`−` / `+`, for small discrete counts where dragging on a phone would be cruel), and real buttons for discrete choice (`methods`, `steps`). `method` and `step` seed the diagram rather than locking it — the visible tabs and step buttons always move; `interactive={false}` is how you get a fixed teaching or exam figure. Respects `prefers-reduced-motion` (and a `reducedMotion` prop override).
**Best used for:** The whole part-whole spine — fractions, equivalent fractions, simplifying, comparing, adding and subtracting, fractions of amounts, ratio as shares, ratio simplification, direct proportion, percentages and fraction–decimal–percentage conversion. Use it when the connection between representations is the learning, or when a method needs its intermediate states shown rather than just its answer. Questions, predictions, marking, scores and weakness tracking stay outside the component (compose it like `AngleExplore`/`AreaPerimeterExplore`).
**Props:** `preset` (name or preset object, defaults to `fractionBar`), `method`, `step`, `value` (controlled values object), `defaultValue`, `onChange`, `onMethodChange`, `onStepChange`, `interactive`, `disabled`, `subject` (defaults to `Maths`), `reducedMotion`, `label`, `showStatus`
**Screen type:** none yet — not routed in `ChapterPlayer.jsx` (new component pending review)
**Dependencies:** `SUBJECTS`, `GENERAL` (via `fractionRatio/fractionRatioVisualRoles.js` semantic roles), `TYPE`, `SPACING`, `RADII`, `MOTION` (injected animation CSS via `ensureStyles()`, same pattern as `AngleExplore`/`AreaPerimeterExplore`); pure maths in `fractionRatio/fractionRatioMath.js`, pure layout in `fractionRatio/fractionRatioGeometry.js` (built on shared `geometry/shapeGeometry.js`), one file per preset under `fractionRatio/presets/`
**Closest alternatives:** `AreaPerimeterExplore` (mensuration — do not add fraction modes to it); `AngleExplore` (angle facts); `CalculationBreakdown` (executing a procedure step by step with a typed answer and marking, rather than seeing why a method works); `GraphView` (interpreting supplied data, including pie charts — not manipulating a whole).

- **Decision**
  - **Use when:** the learning objective is what a fraction, ratio, percentage or proportion *is*, or why a method works — and manipulating the whole makes it visible: parts multiplying while the shaded amount does not, two fractions whose parts are visibly different sizes, a total splitting into named shares, or two quantities that cannot move independently. Also use its static mode for any accurate, on-theme part-whole diagram inside teaching or exam content.
  - **Do not use when:** the learner must be assessed on a calculation (compose a question component around a static instance instead); the task is executing a multi-step method with marking (`CalculationBreakdown`); the content is percentage change, reverse percentages, compound interest or inverse proportion (none are implemented); or the data is a dataset to interpret rather than a whole to divide (`GraphView`).
  - **Content shape:** pick the preset matching the idea, and set `defaultValue` for a specific worked example. One diagram per screen, one idea at a time — `fractionOperations`' method tabs are a bank of related mechanics, not an invitation to teach five operations on one screen; set `method` to seed the one being taught.
  - **Rhythm role:** teaching, exploration.

---


### CoordinatePlaneExplore

**File:** `src/components/learning/CoordinatePlaneExplore.jsx`
**What it is:** Configuration-driven GCSE coordinate plane — the coordinate-geometry sibling of `AngleExplore`, `AreaPerimeterExplore`, `FractionRatioExplore` and `NumberLineExplore`. One visual grammar runs through every preset: **one plane** (every preset shares an axis system, tick treatment and grid density), **points that carry their coordinates** (a named point is drawn with its coordinate chip — reading a coordinate is never a separate mode), and **a rule made visible as geometry** (across-then-up guides, the rise/run triangle, the mirror line, the centre of rotation, the rays from a centre of enlargement). That third clause is why transformations live here rather than in a separate component: a reflection *is* a rule that moves coordinates, and the coordinate movement is the teaching mechanism, not a finished diagram. Nine registered presets — `plotPoint` (drag a point, with `plot`/`read`/`quadrants` focus modes naming the quadrant and its sign pair), `midpoint` (two draggable endpoints, with the x-values and y-values bracketed and averaged *separately* so the formula is read off the picture rather than recalled; a bracket is omitted when its two values coincide rather than collapsing to a stray dot), `straightLine` (steppers for *m* and *c*, gradient and y-intercept as the core teaching with the x-intercept optional; `focus="compare"` splits by `comparisonRule` into `parallel` — equal rise/run triangles on both lines, intercepts independent — `perpendicular` — the negative-reciprocal relationship, Higher tier only, which *refuses* rather than fabricating a second horizontal line when *m* = 0 — and `free`), `tableOfValues` (step through integer *x* values; the line follows a fixed teaching sequence — no line from one point, a provisional dashed line from two, a solid line from three where the third coordinate confirms the rule — with completed pairs persisting as a trail), `intersection` (two lines whose meeting point is substituted back into *both* equations, distinguishing one solution, none and infinitely many rather than misreading coincident lines as parallel), and the four transformations `translate` (positive, negative and zero vector components), `reflect` (vertical, horizontal and diagonal mirror lines), `rotate` (clockwise and anticlockwise, 90°/180°/270°, centre not necessarily at the origin, with the direction control withdrawn at 180° where a half-turn reaches the same image either way) and `enlarge` (¼, ½, 2, 3, −1 and −2, with the ray pointing at whichever end is further from the centre and crossing the centre for negative factors) — plus a compatible-preset-object escape hatch. **A three-tier annotation contract** governs density: *active geometry* (full coordinate chip, guide lines and rule geometry), *related geometry* (compact label only) and *context geometry* (visible but unannotated), with only one point active by default; transformation presets refuse `showGuides="all"` outright, since eight labelled points each carrying guide lines is unreadable on a phone. **Option selections live in the value model**, so `value`/`defaultValue`/`onChange` carry the complete state and a static exam figure can specify a reflection in `y = x` or an enlargement by −1. **Capabilities constrain state rather than hiding controls** — a pinned centre genuinely pins the figure — and controls that cannot affect the current state are absent rather than inert. Axis placement is resolved **per axis**, so positive-only *x* against signed *y* renders correctly. `interactive={false}` gives a static teaching or exam figure that still carries a descriptive `<desc>` of the actual figure state. Drag handles expose one semantic slider per control over one visual ring (Left/Right drives x, Up/Down drives y); discrete choices are real buttons. Respects `prefers-reduced-motion` (and a `reducedMotion` prop override).
**Best used for:** Coordinates and quadrants, midpoints, straight-line graphs and `y = mx + c`, tables of values, parallel and perpendicular gradients, solving simultaneous equations graphically, and all four transformations. Because axis labels, units and independent scales are part of the plane API, it also serves science graphs — `subject="Physics"` with `xAxis={{ label: 'Time', unit: 's', min: 0, max: 20 }}` gives a usable distance–time frame, not merely a recoloured Maths diagram. Questions, predictions, marking, scores and weakness tracking stay outside the component (compose it like `AngleExplore`/`AreaPerimeterExplore`).
**Props:** `preset` (name or preset object, defaults to `plotPoint`), `focus`, `comparisonRule`, `value` (controlled values object), `defaultValue`, `onChange`, `interactive`, `disabled`, `showGuides` (`'active' | 'all' | 'none'`), `difficultyCapabilities`, `xAxis`, `yAxis`, `grid`, `subject`, `reducedMotion`, `label`, `showStatus`
**Screen type:** none yet — not routed in `ChapterPlayer.jsx`; pending component review.
**Dependencies:** `SUBJECTS`, `GENERAL` (via `coordinatePlane/coordinatePlaneVisualRoles.js` semantic roles), `TYPE`, `SPACING`, `COMPONENT_SIZE`, `RADII`, `MOTION` (injected animation CSS via `ensureStyles()`, same pattern as `AngleExplore`/`AreaPerimeterExplore`); pure maths in `coordinatePlane/coordinatePlaneMath.js`, geometry and model-space clipping in `coordinatePlane/coordinatePlaneGeometry.js`, shared label placement in `coordinatePlane/pointLabelLayout.js`, capability and option resolution in `coordinatePlane/presets/optionState.js`, one file per preset under `coordinatePlane/presets/`
**Closest alternatives:** `GraphView` (interpreting supplied data as a chart — not manipulating a plane); `NumberLineExplore` (position in one dimension); `AngleExplore` (angle facts — do not add coordinate modes to it); `AreaPerimeterExplore` (mensuration); a static figure image (when no interaction is needed and the diagram is one-off).

- **Decision**
  - **Use when:** position, movement or a coordinate rule must be understood through one responsive plane—for example plotting, midpoints, straight-line relationships, intersections or transformations.
  - **Do not use when:** the learner is interpreting a supplied dataset rather than manipulating coordinates; the task is primarily calculating an answer; or a one-off static image communicates the complete figure without reusable behaviour.
  - **Choose instead:** use `GraphView` for charts and supplied datasets, `NumberLineExplore` for one-dimensional position, `AngleExplore` for angle facts, `AreaPerimeterExplore` for mensuration, or `CalculationBreakdown` for executing a numerical method.
  - **Content shape:** one preset and one primary coordinate relationship per screen. Configure the values, focus, capabilities and axes needed for that learning beat; place questions, marking and weakness tracking outside the component.
  - **Rhythm role:** teaching, exploration.

**Known design debt:** where both axes cross, a plotted point may cover an internal axis number. The coordinate chip still supplies the exact value, so nothing is unreadable, but relocating all axis numbering to the plot edges is a graph-system design decision rather than a safe renderer patch. Revisit when the wider graph system is next reviewed.

---


### BuilderBlock

**File:** `src/components/learning/BuilderBlock.jsx`
**What it is:** An assessed select-and-place reconstruction task. The learner chooses supplied pieces and places them into exact gaps to rebuild a known equation, reaction, quotation or short piece of text. After an incorrect check, correctly placed pieces remain locked while only the incorrect pieces return for repair.
**Best used for:** Supported reconstruction where understanding the structure and relationships matters, but fully independent recall would create unnecessary cognitive load.
**Props:** `block`, `subject`, `onComplete`
**Block shape:** `{ type: 'builder', label?, instruction?, layout?: 'reaction'|'expression'|'equation'|'calculation'|'text'|'cloze'|'sentence'|'quote', template?, slots?, pieces: Array<string|number|{ id?, label?, text? }>, answer: Array<string|number|{ label?, text? }>, operators?, groupLabels?, contextImage?, completionNoun? }`
**Block type:** `builder` — rendered inside a normal content screen in `ChapterPlayer.jsx`.
**Dependencies:** `SUBJECTS`, `GENERAL`, `BUTTONS`, `COMPONENT_SIZE`, `SPACING`, `RADII`, `TYPE`, `ContinueCTA`, `ScreenBody`, `ScreenTitle`

- **Decision**
  - **Use when:** the learner benefits from rebuilding a known structure while choosing from a finite bank of supplied pieces. Choose it for concise chemical reactions, equations, missing mathematical terms, high-value quotations, definitions or process statements where each piece has one defensible position.
  - **Do not use when:** the learner should generate the answer independently, pieces belong in broad categories rather than exact positions, several arrangements are equally valid or the response is too long to reconstruct comfortably on mobile.
  - **Choose instead:** use `FillInTheBlanksBlock` when the learner should type one missing answer without supplied choices. Use `MatchingTask` for independent one-to-one pairs. Use `ColSortBlock` for category grouping. Use `OrderedRouteTask` when ordered stages are the knowledge being tested. Use `CalculationBreakdown` when the learner needs to understand and execute a complete connected method.
  - **Content shape:** one concise structure with a finite bank of plausible pieces and one defensible arrangement. Every piece must contribute meaningful subject knowledge rather than acting as obvious filler. Keep the number of gaps manageable on mobile. Correctly placed pieces should remain locked after an unsuccessful check so the learner repairs only the unresolved gaps.
  - **Rhythm role:** practice, retrieval, repair.

---

### CalculationBreakdown

**File:** `src/components/learning/CalculationBreakdown.jsx`
**What it is:** A staged teaching-and-application component that helps the learner interpret one procedural calculation, choose a useful first move, follow worked transformations, complete part of the method themselves and see why the full solution works. It lives inside the standard interaction frame and owns only the local calculation sequence.
**Best used for:** Multi-step GCSE Maths or Science calculations where understanding the method matters as much as obtaining the final answer — including equations, rearranging formulae, fractions, percentages, substitution, geometry and scientific equations.
**Props:** `block`, `subject` (defaults to `Maths`), `accent`, `reducedMotion` (test/story override only), `onContinue`
**Block shape:** `{ title?, goalPrompt?, problem, understand: { heading?, intro?, whatsHappening?, goal?, whyGoal?, decision?, check? }, steps: [{ mode: 'worked'|'yourTurn', title, why?, transform: { from, leftOp?, rightOp?, to }, whyStep?, check?, answer?, resultExpr?, hint?, reasoning?, cta? }], solution: { celebrateTitle?, celebrateSubtitle?, result, rows?, why? }, presentation?, backgroundImage?, backgroundOpacity? }`
**Screen type:** `calculationBreakdown` — full-screen component currently available in the Component Lab but not yet routed in `ChapterPlayer.jsx`.
**Dependencies:** `GENERAL`, `SUBJECTS`, `TYPE`, `SPACING`, `RADII`, `MOTION`, `ContinueCTA`, `CheckAnswerCTA`, `InteractionShell`, `ScreenTitle`, `src/components/learning/calculationBreakdown/`

- **Decision**
  - **Use when:** a calculation contains several connected operations and the learner needs to understand both what to do and why each move is valid or useful. Choose it when the method should be explicitly modelled before the learner applies part of it.
  - **Do not use when:** only one simple operation is required, a visual model should establish the concept first, the learner is ready for independent exam practice, the content is primarily written analysis or the method varies so widely that one fixed sequence would be misleading.
  - **Choose instead:** use `FractionRatioExplore`, `AreaPerimeterExplore` or another visual exploration component when the learner first needs to see why the mathematics works. Use `BuilderBlock` when the learner should reconstruct a short equation from supplied pieces. Use `FillInTheBlanksBlock` for one missing value or term. Use `ExamQuestionFrame` when the learner should attempt the full calculation independently. Use `GuidedExamResponse` for an extended written response rather than a numerical method.
  - **Content shape:** one problem with a clear interpretation, a defined goal, a small number of purposeful steps, an explanation of why each move helps, at least one learner-completed step and a complete final solution with a check or explanation. Avoid breaking obvious arithmetic into patronising micro-steps. Scaffolding should become lighter when stronger learner evidence makes the full support unnecessary.
  - **Rhythm role:** teaching, practice, repair.

#### Optional algebra reasoning presentations

`CalculationBreakdown` remains **one generic calculation component**. `block.presentation` is an opt-in field that swaps the generic worked-step sequence for a scene sequence built for one specific teaching job — why an algebraic operation is valid, not just which operation to perform. These are **not separate components** and must not be registered, routed or documented as such; they share this component's public API, frame, title treatment, stage surface, navigation, CTAs and accessibility behaviour.

**Backwards compatibility is absolute:** a block with no `presentation` field (or `variant: 'standard'`) renders the existing walkthrough unchanged. Every existing algebra, percentage, geometry, fractions and science block is untouched.

```js
presentation: {
  variant: 'standard' | 'algebraWhy' | 'inverseMachine' | 'groupSplit' | 'balance',
  model: { /* per-variant, see below */ },
  reasoning?: { goal?, structure?, inverse?, equality?, check? },
}
```

| Variant | Teaching job | Model |
|---|---|---|
| `algebraWhy` | Builds a coefficient from repeated addition, names the goal, forces a decision against a live subtraction misconception, then divides both sides and checks by substitution | `{ variable, coefficient, total, solution? }` |
| `inverseMachine` | Multi-step equations as actions undone **in reverse order** — the reverse chain is derived from the forward operations, never authored | `{ variable, operations: [{ type, value }], result }` |
| `groupSplit` | Makes a coefficient concrete: the learner shares the total into equal groups by tap, keyboard or one "split" action | `{ variable, groupCount, total, solution? }` |
| `balance` | Why the same operation goes on **both** sides; the one-sided move is offered, refused and explained | `{ states: [{ left, right, operation, resultLeft, resultRight, misconception? }] }` |

**Rules for authoring a presentation:**

- **Never a parsed equation.** Visual models receive explicit numbers. The only string input is `operation`, read through a closed token grammar (`'÷ 3'`, `'+ 4'`) that rejects anything else; `left`/`right`/`resultLeft`/`resultRight` are display strings and are never parsed.
- **Invalid models are refused, not repaired.** `calculationBreakdownValidation.js` rejects inexact group splits, group counts outside 2–5, totals over 30, chains that do not solve to a whole number, no-op steps and division by zero. A rejected model logs its reasons in development and falls back to the standard walkthrough — it never draws misleading groups.
- **`reasoning` is optional everywhere.** Each variant derives all five explanations from its model; authored copy overrides individual fields. `step.reasoning` may also be supplied on a generic worked step, where it renders as the same "Why this works" panel.
- **Use operation language.** "Subtract 4 from both sides", never "move the 4 across and change the sign". The plain relationship comes first, the formal term second: "Division undoes multiplication. These are inverse operations."
- **Choreography is fixed:** predict → act → observe → explain → check. The learner commits to at least one decision before any final answer appears; wrong choices explain the misunderstanding and re-open immediately, with no scoring, streaks or progress tracker inside the component.

**Status — internals frozen (2026-07-29).** The algebra presentations are
architecture complete and pedagogically reviewed: the scene sequence, the
verdict/reasoning split, the concrete models and the copy were audited against
a 390px and 320px render pass and signed off. **Do not refactor, restyle or
re-sequence the internals of `src/components/learning/calculationBreakdown/`
speculatively.** Change them when real chapter use exposes a genuine learning
problem — not to tidy the structure, shorten a file or unify a pattern.

Specifically, these are settled decisions, not accidents:

- the concrete model stays on screen **through** each decision scene — do not
  reduce a choice screen back to a bare equation;
- the verdict panel ("What happened") is situational and the reasoning rail
  ("Rule to remember") is general — they must not share a heading or repeat a
  sentence;
- a one-sided balance move breaks the balance **immediately and visibly**, not
  behind an optional reveal;
- a decision scene carries one instruction, one question and the options — no
  support line that restates the question or eliminates a distractor in advance.

This is a scope freeze, not a `LOCKED_COMPONENTS.md` registration: the component
is not in the locked registry and does not carry a locked self-declaration.
Extending it with a *new* validated presentation variant remains in scope.

**Where the code lives:** `src/components/learning/calculationBreakdown/` — `calculationBreakdownMath.js` (pure operation maths), `calculationBreakdownValidation.js` (model validation and fallback), `calculationBreakdownVisualRoles.js` (semantic colour roles), `calculationBreakdownParts.jsx` / `calculationBreakdownControls.jsx` / `calculationBreakdownFigures.jsx` (shared display pieces), `CalculationVisualModel.jsx` (the scene runner) and one file per variant. Maths never lives in JSX; variant rendering is a lookup table, not a switch.

---


### CinematicCarousel

**File:** `src/components/learning/CinematicCarousel.jsx`
**What it is:** Full-screen "deep dive" carousel — one large image at a time (`objectFit: contain`, so any aspect ratio works), with glass prev/next arrow buttons either side. A name + key-facts panel below slides in to match the navigation direction (`key={index}` remount + direction-aware slide-in animation). Progress dots track which items have been viewed; Continue unlocks once every item has been seen at least once.
**Best used for:** Browsing a small related set of things in turn, each worth a focused look — e.g. the organelles inside a cell, the planets of the solar system, the stages of a specialised cell. Designed for cinematic single-item focus, not for scanning a large list.
**Props:** `block`, `subject` (defaults to `Biology`), `onContinue`
**Block shape:** `{ type: 'cinematicCarousel', title?, intro?, items: [{ id, image, label, facts: string[] }] }`
**Screen type:** `cinematicCarousel` (full-screen, routed directly in `ChapterPlayer.jsx` like `TimelineCanvas`)
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

**File:** `src/components/learning/FaceTheExaminer.jsx` (compatibility export for `faceTheExaminer/FaceTheExaminerContainer.jsx`)
**What it is:** A post-teaching examiner simulation built around one prepared sample answer. The learner reads the response, predicts its mark, identifies which criteria it meets, compares that judgement with the examiner's verdict, edits annotated weak sections and submits the improved answer for re-marking.
**Best used for:** Teaching how marks are awarded by making the learner judge and improve a realistic, imperfect response rather than simply reading a model answer.
**Props:** `module`, `examiner`, `onExit`, `onContinue`
**Examiner shape:** `{ question, marks, sampleAnswer, mark, markScheme, criteriaOptions?, annotations?, subject?, board?, type?, backgroundImage?, videoSrc? }`
**Screen type:** `faceTheExaminer`
**Dependencies:** `FaceTheExaminerIntro`, `FaceTheExaminerMain`, `FaceTheExaminerDone`, `SegmentedControl`, `ContinueCTA`, `SUBJECTS`, `GENERAL`, `/api/examiner`

- **Decision**
  - **Use when:** the learner needs to understand how an examiner applies criteria to a whole answer, distinguish genuine strengths from weaknesses and improve specific passages before seeing the answer re-marked. Choose it when judgement and revision of the response are the central learning jobs.
  - **Do not use when:** the learner should write their own answer from scratch, the sample is either perfect or completely unusable, the only feedback is generic advice such as “add more detail”, or there are no precise weak sections that can be meaningfully edited. Do not use it for one isolated factual error or as a decorative model-answer reveal.
  - **Choose instead:** use `ExamQuestionFrame` for independent exam-response practice. Use `WhatExaminersLookFor` for a short success-criteria briefing before writing. Use `GuidedExamResponse` when the learner needs substantial construction support. Use `SpotTheError` when one precise sentence-level error should be identified and repaired rather than the whole answer judged.
  - **Content shape:** one authentic exam-style question and one plausible, imperfect sample answer containing genuine strengths and a small number of improvable weaknesses. Supply an accurate original mark, learner-friendly criteria, precise annotations, editable weak passages and a defensible re-marking route. The answer must be good enough to reward careful judgement rather than being cartoonishly poor.
  - **Rhythm role:** practice, feedback, repair.

---

### FillInTheBlanksBlock

**File:** `src/components/learning/FillInTheBlanksBlock.jsx`
**What it is:** A short typed-recall activity. The learner supplies one missing word, phrase or numerical value inside meaningful context, receives a hint after the first incorrect attempt and sees the correct answer after a second unsuccessful attempt.
**Best used for:** Generative retrieval where the surrounding sentence provides a useful cue but the learner must still produce the missing answer rather than recognise it from options.
**Props:** `block`, `subject`, `onContinue`
**Block shape:** `{ type: 'fillblanks', sentences: [{ before?, after?, answer, acceptedAnswers?, matchMode?, hint?, hints?, feedback?, placeholder?, ariaLabel?, inputMode? }], wrongMsg?, correctMsg?, placeholder?, backgroundImage?, backgroundPosition?, backgroundOpacity?, backgroundFilter? }`
**Block type:** `fillblanks` — assessed retrieval rendered inside a normal content screen.
**Dependencies:** `SequenceProgress`, `CheckAnswerCTA`, `ContinueCTA`, `SUBJECTS`, subject backdrops, `GENERAL`, `COMPONENT_SIZE`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `fillInTheBlanksMatching`

- **Decision**
  - **Use when:** the surrounding sentence gives a useful retrieval cue, but the learner should independently generate and type one missing word, phrase or numerical value. Choose it for precise scientific terminology, a missing historical fact, a quotation fragment, a formula value or one essential word that changes a definition's meaning.
  - **Do not use when:** several supplied pieces must be arranged, multiple gaps form one larger structure, several answers could reasonably fit, grammar reveals the answer without subject knowledge or the learner needs an extended explanation.
  - **Choose instead:** use `BuilderBlock` when choices should be supplied and positioned. Use `QuickRecallScreen` for short objectively marked questions with answer options. Use `SpotTheError` when the learner must diagnose and repair incorrect wording. Use `GuidedExamResponse` when the response needs developed writing rather than one precise missing answer.
  - **Content shape:** usually three to six short independent sentences, each containing one meaningful gap and one defensible answer. The surrounding wording must test subject knowledge rather than provide an accidental grammatical clue. Use accepted alternatives only where they are genuinely equivalent, and provide a hint that narrows the concept without simply revealing the answer.
  - **Rhythm role:** retrieval, practice, repair.

### Guided construction family rule

Choose according to what the learner must produce:

- Select supplied pieces and rebuild an exact structure → `BuilderBlock`
- Generate and type one missing answer from context → `FillInTheBlanksBlock`
- Understand and execute a connected procedural method → `CalculationBreakdown`

These components form a graduated support pathway, but they are not interchangeable. Do not supply choices when independent recall is the learning goal, and do not reduce a multi-step method to disconnected missing-value questions.

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

Do not stack these components simply because they are cinematic. After the opening beat, move promptly into explanation, exploration, practice or retrieval. Do not place `CinematicRevealMoment`, `ConceptReveal`, `KeyFigureReveal` and `CinematicCarousel` consecutively; that creates passive spectacle rather than learning rhythm. `CinematicRevealMoment` should be the rarest of the four because it carries the least teaching content by itself. `ChapterHookScreen` is also tagged `cinematic`; when used, it fulfils the module's one cinematic-moment requirement.

---

### QuickRecallScreen

**File:** `src/components/learning/QuickRecallScreen.jsx`
**Purpose:** Rapid-fire retrieval screen for choice, connection and true/false questions. Presents one short question at a time through `UnifiedQuestionScreen`, gives immediate feedback and records supported question outcomes in the weakness tracker.
**Props:** `subject`, `chapterNum`, `chapterTitle`, `questions`, `onBack`, `onContinue`, `renderHeader`
**Dependencies:** `UnifiedQuestionScreen`, `unifiedWeaknessTracker`

- **Decision**
  - **Use when:** the learner needs a fast sequence of short, objectively marked questions that retrieves knowledge already taught. Choose it for low-friction checks of facts, definitions, simple connections, vocabulary or straightforward application.
  - **Do not use when:** the learner needs to generate knowledge freely, develop an explanation, repair a complex error or demonstrate extended exam reasoning. Do not use it to introduce new content, test a misconception that deserves targeted corrective feedback or turn a long question bank into a formal test.
  - **Choose instead:** use `PriorKnowledgeRecall` when the learner should retrieve an earlier topic without answer options. Use `MisconceptionCheck` when the incorrect belief itself is the learning target. Use `ChapterHookScreen` when one surprising true/false prediction should open a chapter. Use `ExamQuestionFrame` or another exam-practice component for mark-scheme application and developed responses. Use `SpotTheError` when the learner must diagnose and repair an error.
  - **Content shape:** usually three to six independent questions, each testing one clear retrieval target with one defensible correct answer, concise plausible options and useful immediate feedback. Questions should vary the recalled knowledge rather than repeatedly rephrase one fact. Avoid obscure trivia, confusing wording, oversized option sets and questions solvable through wording clues.
  - **Rhythm role:** retrieval, practice.

---

### PriorKnowledgeRecall

**File:** `src/components/learning/PriorKnowledgeRecall.jsx`
**Purpose:** Full-screen chapter-opening free-recall screen. The learner writes what they remember from an earlier topic; `/api/recall` evaluates the response against expected concepts and missing concepts feed the weakness tracker and future practice.
**Props:** `block`, `subject`, `onContinue`, `onBack`, `onExit`
**Block shape:** `{ type: 'priorKnowledgeRecall', chapterTitle, prompt?, previousTopic?, backgroundImage?, recallPrompts?, concepts: [{ tag, label, keywords[] }], sourceContent? }`
**Screen type:** `priorKnowledgeRecall`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `unifiedWeaknessTracker`, `/api/recall`

- **Decision**
  - **Use when:** the learner is beginning a chapter or connected section and needs to retrieve what they remember from an earlier topic without seeing possible answers. Choose it when that prior knowledge genuinely supports the new learning and the result can identify specific gaps for later practice.
  - **Do not use when:** the learner has not previously been taught the knowledge, the new chapter does not depend meaningfully on it or the task is being added as a routine opening ritual. Do not use it when answer options are needed, a weakness is already known or the response should be a precise exam answer.
  - **Choose instead:** use `QuickRecallScreen` for several short prompted questions about taught knowledge. Use `MisconceptionCheck` for a known false belief. Use `ChapterHookScreen` to create curiosity about the new chapter rather than diagnose prior knowledge. Use `WeakSpotRecovery` when the weakness is already known and needs targeted repair.
  - **Content shape:** one broad free-recall prompt linked to a clearly defined earlier topic, with a bounded set of important expected concepts carrying stable weakness tags. Optional nudges may name broad areas but must not reveal the answers. Avoid insignificant details, trick wording and concepts the system cannot use meaningfully in later practice.
  - **Rhythm role:** opening, retrieval.

### Retrieval family rule

Choose according to what the learner must do:

- generate earlier knowledge without options → `PriorKnowledgeRecall`
- answer several short prompted questions → `QuickRecallScreen`
- recognise and correct a known false belief → `MisconceptionCheck`
- make one curiosity-building prediction before new teaching → `ChapterHookScreen`
- present an embedded ordinary retrieval question consistently → `RetrievalFrame`, selected by implementation rather than by the content author

Do not use true/false interaction as a generic visual pattern. It must create a meaningful opening prediction, expose a damaging misconception or perform ordinary retrieval within an appropriate question sequence. Do not place substantial question-led components back-to-back; separate them with teaching, explanation, application or visual exploration.

---

### RecoveryQuizPlayer — **LOCKED**

**File:** `src/components/learning/RecoveryQuizPlayer.jsx`
**What it is:** A short, highly focused verification sequence used after targeted reteaching. It checks whether the learner can now apply the repaired understanding across several closely related questions.
**Best used for:** Testing whether a specific weak concept has improved after the learner has received an explanation, worked example, scaffold or other appropriate repair activity.
**Props:** `recoveryQuizId`, `onComplete`, `onBack`
**Data source:** `src/data/recoveryQuizzes.js`
**Quiz shape:** `{ id, subject, estimatedTime, topic, questions: [{ type, question, options, correct, explanation, hint? }] }`
**Dependencies:** `AnswerInteraction`, `recoveryQuizzes`, `SUBJECTS`, `SPACING`, `BackButton`, `SequenceProgress`, `TYPE`, `GENERAL`

- **Decision**
  - **Use when:** the learner has already received targeted reteaching for one evidenced weakness and now needs a short check showing whether the corrected understanding transfers across several examples. Choose it as the verification stage of recovery, not as the whole repair.
  - **Do not use when:** the weakness has only just been detected, the learner has not yet been shown why their thinking was wrong or the questions simply repeat the original item with different wording. Do not use it as a generic quiz, mix unrelated weak areas together or mark a weak spot as fixed merely because every question was attempted.
  - **Choose instead:** use `WeakSpotRecovery` to introduce the diagnosed weakness and offer the repair route. Use `ExplainReveal`, `CalculationBreakdown`, a worked example or another teaching component when the concept still needs to be rebuilt. Use `SpotTheError` when the learner must diagnose and correct a precise error. Use `QuickRecallScreen` for ordinary mixed retrieval outside a repair pathway.
  - **Content shape:** usually three to five tightly focused questions targeting the same underlying weakness through meaningfully different examples or representations. Begin with a simpler check, then test the idea in a changed context so success cannot come from memorising one answer. Every question needs useful corrective feedback. Include a defined success threshold and a fallback route when the learner is still struggling.
  - **Rhythm role:** repair, retrieval.

**Governance rule:** completion is not evidence of repair. The weakness status should change only when the learner meets the defined success threshold, ideally across more than one representation of the concept. An unsuccessful check should trigger simpler reteaching or a different repair strategy rather than repeating the same quiz unchanged.

**Outcome language:**

- successful evidence → “This is looking stronger”
- partial evidence → “One part still needs work”
- weak evidence → “Let's rebuild this another way”

Do not automatically display “Weak spot fixed”.

**Known implementation gap:** the current v1 completion screen still displays “Weak spot fixed” when the question sequence ends and does not yet apply a recovery threshold. Treat this as unresolved implementation work; the documentation does not claim that the behaviour is already compliant.

---

### WeakSpotRecovery — **LOCKED**

**File:** `src/components/learning/WeakSpotRecovery.jsx`
**What it is:** A calm intervention handoff shown after the weakness tracker has gathered enough behavioural evidence to identify one specific weak concept or recurring error pattern. It explains the diagnosed gap briefly and offers a direct route into an appropriate repair activity.
**Best used for:** Turning an evidenced weakness into an immediate, manageable next action without making the learner feel punished or overwhelmed.
**Props:** `block`, `subject`, `progress`, `onBack`, `onFixWeakSpot`, `onSkip`
**Block shape:** `{ type: 'weakSpotRecovery', subject, topicId, title, explanation, meta?, cta?, skipText?, recoveryQuizId? }`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `GENERAL`, `BackButton`, `ScreenTitle`

- **Decision**
  - **Use when:** the system has enough evidence to identify one specific weak concept, misconception or recurring error pattern and can offer a suitable next repair activity. Choose it when the learner needs a clear explanation of what is going wrong and one manageable action to address it.
  - **Do not use when:** the learner has made one isolated mistake, the weakness is still broad or uncertain, or the system cannot explain what the learner is confusing. Do not trigger it from self-reported confidence alone, use it as a generic encouragement screen or claim that a topic is weak without supporting evidence.
  - **Choose instead:** use `MisconceptionCheck` when a common false belief should be tested but has not yet been identified as this learner's weakness. Use `PriorKnowledgeRecall` when broad missing prior knowledge still needs diagnosing. Use `SpotTheError` when the learner should locate and repair one precise error. Use `QuickRecallScreen` when the goal is ordinary retrieval rather than targeted repair.
  - **Content shape:** exactly one specific weak spot with a concise, evidence-based diagnosis of what the learner is mixing up, missing or doing incorrectly. Include one realistic repair route, a short indication of what the activity involves and an optional skip route. Avoid vague labels such as “History” or “Algebra”, generic motivational copy and unsupported claims that the learner has mastered or failed a topic.
  - **Rhythm role:** repair.

**Governance rule:** `WeakSpotRecovery` starts a repair pathway. It does not teach enough content by itself and must not mark the weakness as resolved merely because the learner accepts or completes the suggested activity.

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

### WhatExaminersLookFor

**File:** `src/components/learning/WhatExaminersLookFor.jsx`
**What it is:** A short pre-question examiner briefing. It introduces the upcoming exam skill, progressively reveals up to three high-value priorities and closes with one practical takeaway the learner can use while writing. It does not mark, annotate or score an answer.
**Best used for:** Preparing the learner immediately before independent or guided exam practice by clarifying the small number of things the examiner will reward most.
**Props:** `subject`, `whatExaminersLookFor`, `examinerExplains`, `title`, `label`, `showBack`, `onBack`, `onContinue`
**Data shape:** `{ introduction?, context?, priorities?: [{ id?, title?, explanation? }], takeaway? }` — legacy `examinerExplains` data may still use `opening`, `tips` and `closing` while content migrates.
**Screen type:** `whatExaminersLookFor`; legacy `examinerExplains` remains compatibility-only.
**Dependencies:** `CinematicShell`, `BackButton`, `ContinueCTA`, `ScreenTitle`, `SUBJECTS`, `SUBJECT_BACKDROPS`, `GENERAL`, `TYPE`, `SPACING`, `MOTION`

- **Decision**
  - **Use when:** the learner is about to attempt an exam question and needs a concise reminder of the specific behaviours the examiner rewards, such as selecting precise evidence, explaining a link, analysing a method or supporting a judgement.
  - **Do not use when:** the learner has already completed the response, feedback must react to their actual writing, the advice is a generic revision tip or the success criteria require substantial teaching rather than a short briefing. Do not turn it into a dense mark-scheme dump.
  - **Choose instead:** use `ExamQuestionFrame` when the learner should now write independently. Use `FaceTheExaminer` when they should inspect and improve an existing answer. Use `GuidedExamResponse` when they need structured support while constructing the response. Use a normal teaching component when the exam skill itself has not yet been explained clearly enough for three priorities to be useful.
  - **Content shape:** one short introduction, usually two or three actionable priorities and one closing takeaway. Every priority must be specific enough to apply during the immediately following question and important enough to affect marks. Avoid vague encouragement, duplicated criteria and lengthy mark-scheme language.
  - **Rhythm role:** teaching, practice preparation.

> **`ExaminerExplainsScreen` is legacy compatibility only.**
> `src/components/learning/ExaminerExplainsScreen.jsx` re-exports `WhatExaminersLookFor` so existing routes and content do not break during migration. Do not register, select or author it as a separate learning component; new code and content must use `WhatExaminersLookFor`.

---

### GraphView

**File:** `src/components/learning/GraphView.jsx`
**What it is:** Embeddable SVG chart block — bar, line, scatter, or pie — rendered inline within a content screen.
**Best used for:** Displaying GCSE Maths/Science data (frequency tables, linear/real-life graphs, scatter graphs with line of best fit, proportion/probability pie charts) alongside a question elsewhere on the screen (e.g. an `ExamQuestionFrame`/`quiz` block that says "use the graph to find..."). Purely a data display — does not log to the weakness tracker itself.
**Props:** `block`, `subject` (defaults to `Maths`)
**Block shape:** `{ type: 'graphView', graphType: 'bar'|'line'|'scatter'|'pie', title?, caption?, xLabel?, yLabel?, data?: [{label, value}], points?: [{x, y}], lineOfBestFit?: {from: {x,y}, to: {x,y}}, xMin?, xMax?, yMin?, yMax? }`
**Screen type:** `graphView` (content block, rendered inside `Screen` in `ChapterPlayer.jsx`)
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
**What it is:** An unscored, full-screen choice experience where the learner browses a small set of visually distinct roles, perspectives or approaches, opens each card for more detail and then chooses one. The selected option is passed forward so later content can noticeably adapt its perspective, example, wording or route.
**Best used for:** Creating meaningful ownership before a scenario or personalised sequence when several defensible choices can lead to genuinely different subsequent content.
**Props:** `subject`, `headline`, `question`, `helperText`, `options`, `onBack`, `onContinue`
**Option shape:** `{ title, image?, frontItems?, backItems?, revealLines? }`
**Interaction class:** `reveal` — the choice is exploratory and unscored; no option is treated as right or wrong.
**Dependencies:** `InteractionShell`, `SequenceProgress`, `ContinueCTA`, `CinematicContinueCTA`, `SUBJECTS`, `GENERAL`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `usePrefersReducedMotion`

- **Decision**
  - **Use when:** the learner should adopt one of several plausible roles, perspectives, cases or routes and that choice will create a meaningful change in what follows. Choose it when browsing the alternatives first helps the learner understand their differences and the selected option gives the next teaching or scenario a clearer personal point of view.
  - **Do not use when:** one option is objectively correct, every option leads to effectively identical content, the choice changes only a name in the heading or the learner needs to compare all options simultaneously. Do not use it merely to make a passive screen feel interactive, and do not hide long paragraphs on the backs of cards.
  - **Choose instead:** use `CinematicCarousel` when the learner should explore every item without selecting one. Use `TheoryCompare` when two options need direct parallel comparison. Use `InteractiveHotspotImage` when the information belongs to locations within one shared image. Use `QuickRecallScreen` when there is a correct answer. Use a normal teaching screen when the downstream content will not genuinely change.
  - **Content shape:** usually three to five clearly distinct and defensible options. Each needs a concise title, one purposeful image and a small set of comparable facts or reveal details. Every option should offer a credible reason for selection; avoid one obviously superior “correct” card surrounded by weak or joke alternatives. The subsequent screen must make the consequence of the choice visible.
  - **Rhythm role:** opening, exploration.

**Governance rule:** do not offer fake agency. A selection must alter the subsequent perspective, example, wording or route in a way the learner can notice. If every option produces the same experience, use a reveal or comparison component instead.

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

> **`MedievalDiagnosisScene` is internal implementation only.**
> `src/components/learning/MedievalDiagnosisScene.jsx` is a Medicine-specific SVG child used inside the existing medieval diagnosis flow. It introduces Thomas and the four explanation zones, then mirrors the parent component's belief-selection state. It is not a standalone learning beat, content type or authoring choice.
>
> - Implementation may use it only as the scene owned by its current parent flow.
> - Do not register it independently, place it directly in module content or adapt it into a generic scene framework.
> - Content authors must choose the parent learning component that performs the required teaching job; they must never select `MedievalDiagnosisScene` directly.

---

### MemoryHook

**File:** `src/components/learning/MemoryHook.jsx`
**What it is:** A compact, passive memory aid embedded inside a normal teaching screen. It connects one difficult idea to one memorable analogy, mental image, word pattern or mnemonic so the learner has an easier way to retrieve it later. It does not own a full screen, ask a question or record progress.
**Best used for:** Giving the learner one memorable handle on an idea that is conceptually important but easy to confuse or forget.
**Props:** `block`, `subject`
**Block shape:** `{ type: 'memoryHook', label?, hook, image?, imageAlt? }`
**Dependencies:** `SUBJECTS`, `GENERAL`, `SPACING`, `COMPONENT_SIZE`, `RADII`, `TYPE`
**Block type:** `memoryHook` (routed in `ChapterPlayer`)
**Contract:** `docs/system/component-contracts/memory-hook.md` (composition classification: content)

- **Decision**
  - **Use when:** one already-explained idea would be easier to remember through a concise analogy, mental image, word association or mnemonic. Choose it beside or immediately after the teaching it reinforces, when the learner should leave holding one memorable connection.
  - **Do not use when:** the text is merely important, needs visual emphasis or summarises the preceding screen. Do not use it as a generic callout box, key point, definition card or decorative aside. Do not use it to teach several facts, drill an acronym or assess whether the learner can remember the idea.
  - **Choose instead:** use `AcronymMemorise` when several items are deliberately encoded through their initial letters and should be explored and self-tested. Use `KeyPoint` for an essential conclusion that does not need a mnemonic. Use `Infographic` when a visual system or relationship must be understood together. Use `QuickRecallScreen` when the learner should actively retrieve and submit an answer.
  - **Content shape:** exactly one memorable hook, normally one or two concise sentences. The connection must be accurate, easy to picture and genuinely useful for retrieval. An optional square image may be supplied only when it strengthens the same memory connection. Avoid generic summaries, forced humour, multiple competing comparisons and images that are merely decorative.
  - **Rhythm role:** teaching.

**Governance rule:** use no more than one `MemoryHook` on a screen. A second hook competes with the first and makes neither memorable. `MemoryHook` is deliberately passive: it has no editing, persistence, reveal, assessment or progress behaviour.

### Memory and self-testing family rule

Choose according to the structure of the memory aid:

- one difficult idea anchored by an analogy or association → `MemoryHook`
- one related set encoded through initial letters → `AcronymMemorise`
- objectively marked recall → `QuickRecallScreen`
- one-to-one relationships that the learner must connect → `MatchingTask`

Memory aids must reduce cognitive load. Do not force every topic into a mnemonic or acronym merely to create variety. A memory component should follow sufficient teaching for the content to make sense; it cannot replace explanation, worked examples or application. The normal maximum of two uses of the same component per module still applies, and `MemoryHook` should appear no more than once on an individual screen.

---


### NumberLineExplore

**File:** `src/components/learning/NumberLineExplore.jsx`
**What it is:** Configuration-driven GCSE number line — the shared visual foundation for number topics, and a sibling of `AngleExplore` and `AreaPerimeterExplore`. One line, one interaction model and one status voice cover what would otherwise be six near-identical single-purpose diagrams. The line, its shaded intervals, movement arcs and endpoints render as inline SVG in model space (values are never measured back from pixels); learner-controlled values drive a live status line. Seven registered presets — `orderNumbers` (slide one value between four pinned integers, a decimal and a fraction; the ordering statement re-sorts live, and landing on a pinned value shows the two forms sharing one point), `negativeMovement` (start and move as two independent handles, with an animated arc showing direction; adding a negative visibly lands where subtracting does), `roundingIntervals` (the two multiples a value sits between with the halfway point marked; precision switches between nearest 10, whole number and 1 d.p.), `inequalityRange` (endpoint, direction and open/closed toggles keeping symbol, diagram and interval notation tied together), `boundsInterval` (the error interval of a rounded value — lower bound included, upper excluded), `multiplyPattern` (multiplying by a negative as repeated equal jumps that only change direction), `estimateRange` (estimation as a sensible range rather than a single answer) — plus a compatible-preset-object escape hatch. `interactive={false}` turns any preset into a static teaching or exam diagram at fixed values. Draggable markers are keyboard-operable `role="slider"` elements (arrow keys / Home / End) with ≥44px hit targets; discrete choices (open/closed, direction, precision, jump size) are real buttons, never disguised sliders. Filled markers include an endpoint, open markers exclude it, and a line marker denotes a fixed reference another marker may legitimately sit on. Respects `prefers-reduced-motion` (and a `reducedMotion` prop override) — the arc's draw-in becomes an instantly finished arc.
**Best used for:** Teaching AQA Foundation number topics where position, direction and size are the point — place value, ordering integers/decimals/fractions, negative numbers, addition and subtraction as movement, multiplication patterns with negatives, rounding, estimation ranges, inequalities, upper and lower bounds, and scale reading. Use it when seeing where a number *lives* is the lesson. Questions, predictions, marking, scoring and weakness tracking stay outside the component (compose it like `AngleExplore`/`AreaPerimeterExplore`).
**Props:** `preset` (name or preset object, defaults to `orderNumbers`), `value` (controlled values object), `defaultValue`, `options` (initial discrete choices), `onChange`, `interactive`, `disabled`, `subject` (defaults to `Maths`), `reducedMotion`, `label`, `showStatus`
**Screen type:** none yet — not routed in `ChapterPlayer.jsx` (new component pending review)
**Dependencies:** `SUBJECTS`, `GENERAL` (via `numberLine/numberLineVisualRoles.js` semantic roles), `TYPE`, `SPACING`, `RADII`, `MOTION` (injected animation CSS via `ensureStyles()`, same pattern as `AngleExplore`/`AreaPerimeterExplore`); pure maths in `numberLine/numberLineGeometry.js` (which re-exports the neutral `geometry/shapeGeometry.js` helpers), presets in `numberLine/numberLinePresets.js`
**Closest alternatives:** `AngleExplore` (angle facts — do not add number-line modes to it); `AreaPerimeterExplore` (mensuration); `GraphView` (interpreting data, not number position); `CalculationBreakdown` (executing a method step by step); a static figure image (when no interaction is needed and the diagram is one-off).

- **Decision**
  - **Use when:** the learning objective is about where numbers sit relative to each other, or about a movement, interval or bound along the line — and moving a point makes the relationship visible: an ordering re-sorting, a jump landing left of zero, a value crossing a halfway point, an endpoint switching between included and excluded. Also use its static mode for any accurate, on-theme number-line diagram inside teaching or exam content.
  - **Do not use when:** the learner must be assessed on the answer (compose a question component around a static instance instead); the content is chart or data interpretation (`GraphView`); the task is carrying out a multi-step calculation (`CalculationBreakdown`); or the idea is not positional at all — a number line adds nothing to, say, factorising.
  - **Content shape:** pick the preset matching the idea; optionally fix `value` and `options` for a specific worked example. One line per screen — the component teaches one relationship at a time, and its option buttons switch between framings of that same relationship rather than adding a second lesson.
  - **Rhythm role:** teaching, exploration.

---

### MisconceptionCheck

**File:** `src/components/learning/MisconceptionCheck.jsx`
**What it is:** Full-screen true/false misconception checker. It presents one conceptual trap at a time, reveals the corrected understanding and can explain the related exam trap. Answers are recorded in the weakness tracker.
**Props:** `block`, `subject`, `onContinue`
**Block shape:** `{ type: 'misconceptionCheck', statements: [{ statement, answer: true|false, reveal, examTrap? }] }`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `BUTTONS`, `ContinueCTA`, `unifiedWeaknessTracker`

- **Decision**
  - **Use when:** the learner needs to confront a specific, common false belief that is likely to damage later understanding or cost marks in an exam. Choose it when recognising and correcting the misconception is more important than testing an ordinary isolated fact.
  - **Do not use when:** the statement is simply an ordinary fact written as true or false, the learner has not yet been taught enough to understand the correction or the answer depends on unstated context. Do not use it for minor slips, deceptive wording, debatable interpretations or a generic true/false quiz.
  - **Choose instead:** use `ChapterHookScreen` when one surprising statement should create curiosity without becoming a tracked weakness. Use `QuickRecallScreen` for ordinary factual retrieval. Use `SpotTheError` when the learner must locate, explain and repair the precise error. Use `ExplainReveal` when the reasoning that makes the belief wrong still needs teaching.
  - **Content shape:** one conceptual trap at a time, or a very small set of closely related traps. Each needs a concise unambiguous statement, one defensible answer, a clear explanation of what is wrong and what the learner should think instead, plus an optional exam-trap note. Avoid double negatives, technical loopholes and invented tricks.
  - **Rhythm role:** retrieval, repair.

---

### SpotTheError

**File:** `src/components/learning/SpotTheError.jsx`
**Scoring logic:** `src/components/learning/spotTheErrorScoring.js` (pure, unit-tested)
**Story:** `src/components/learning/SpotTheError.stories.jsx`
**What it is:** A three-stage diagnostic repair task in which the learner locates one inaccurate word or phrase, explains precisely why it is wrong and rewrites the statement correctly. The three stages are evaluated separately so the system can distinguish recognition, understanding and correction.
**Best used for:** Developing precision in scientific statements, historical explanations, mathematical working and exam answers where one specific error changes the meaning or loses marks.
**Props:** `block`, `subject`, `onContinue`
**Block shape:** `{ type: 'spotTheError', statement, errorTarget, whatWasWrong, correctVersion, examinerNote?, commonTrap?, explanationCriteria?, explanationHint?, explanationPraise?, repairKeyTerms?, acceptableRepairs?, repairMustAvoid?, minimumExplanationLength?, minimumRepairLength?, weaknessAreas? }`
**Dependencies:** `SUBJECTS`, `SPACING`, `MOTION`, `RADII`, `TYPE`, `GENERAL`, `CinematicShell`, `ContinueCTA`, `CheckAnswerCTA`, `unifiedWeaknessTracker`, `spotTheErrorScoring`

- **Decision**
  - **Use when:** one precise error within an otherwise plausible statement, calculation or exam response provides a valuable opportunity to practise identifying the problem, explaining its effect and repairing it accurately. Choose it when correction requires genuine subject understanding rather than simple recognition.
  - **Do not use when:** the whole answer is broadly wrong, several independent errors compete for attention or the correction is subjective or debatable. Do not use it for spelling mistakes, trivial slips, an ordinary true-or-false fact or content the learner has not yet been taught well enough to correct.
  - **Choose instead:** use `MisconceptionCheck` when the learner only needs to recognise and correct a common false belief. Use `ExplainReveal` when the reasoning behind the correct idea still needs teaching. Use `RecoveryQuizPlayer` when a repaired weakness should be verified across several examples. Use `CalculationBreakdown` when the learner needs to understand and execute an entire mathematical procedure. Use an exam-response component when the whole answer needs constructing rather than one error repairing.
  - **Content shape:** one concise statement, calculation or response containing one defensible target error. Supply an exact target range, clear criteria describing why it is wrong, one accurate corrected version and reasonable accepted alternatives. The explanation stage must require the learner to state the conceptual problem, not merely say that the selected words are incorrect. The repair must change the meaning accurately without introducing a new error.
  - **Rhythm role:** practice, repair.

**Assessment dimensions:**

- **Error identification:** did the learner locate the meaningful error?
- **Explanation precision:** did they explain why it is wrong using the relevant subject concept?
- **Error correction:** did they produce an accurate replacement?

These dimensions must remain separately tagged in the weakness tracker. A learner who spots the error but cannot explain or repair it has not demonstrated secure understanding.

### Weakness repair family rule

Choose according to the stage of repair:

- communicate one evidenced weakness and offer a manageable route → `WeakSpotRecovery`
- rebuild the missing idea → the appropriate teaching, worked-example or scaffold component
- practise precise diagnosis and correction → `SpotTheError`
- verify transfer after reteaching → `RecoveryQuizPlayer`

Detection, reteaching, practice and verification are separate jobs. Do not jump directly from a weakness notification to a few quiz questions and call the weakness fixed. Resolution requires evidence that the learner can apply the corrected understanding, preferably in a changed representation or context.

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
**Screen type:** `timelineCanvas` (full-screen, routed directly in `ChapterPlayer.jsx` like `TimelineChain`)
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
**Screen type:** `timelineChain` (full-screen, routed directly in `ChapterPlayer.jsx`). Legacy `type: 'visualNarrative'` screens are mapped to the reveal variant at render time via `src/data/visualNarrativeCompat.js`.
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
**Screen type:** `timelineChain` (content block, rendered inside `Screen` in `ChapterPlayer.jsx` — same block-type string as the full-screen variant's screen type, but checked on `block.type` rather than `screen.type`)
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
**Purpose:** Chapter-opening true/false prediction followed by a cinematic explanation or short sequence of reveal beats.
**Presentation tag:** `cinematic` — this component counts as the module's one cinematic moment. When it is used, do not add another cinematic component merely to satisfy the module-rhythm requirement.
**Props:** `subject`, `chapterNum`, `chapterTitle`, `statement`, `isTrue`, `accentWords`, `explanation`, `revealBeats`, `backgroundImage`, `onBack`, `onContinue`
**Dependencies:** `SUBJECTS`, `MOTION`, `RADII`, `GENERAL`, `SPACING`, `CinematicShell`, `BackButton`

- **Decision**
  - **Use when:** one striking true/false statement can open a chapter by creating curiosity, tension or surprise before revealing the central idea the learner is about to explore. Choose it when making an initial prediction gives the following teaching more meaning.
  - **Do not use when:** the purpose is to measure retained knowledge, diagnose a weakness or correct a misconception that should be tracked and revisited. Do not use it as a routine opening for every chapter, for a bland or obvious statement or when another component already owns the module's cinematic moment.
  - **Choose instead:** use `MisconceptionCheck` when recognising the false belief is an assessed retrieval and repair task. Use `PriorKnowledgeRecall` when the learner should retrieve knowledge from an earlier topic. Use `QuickRecallScreen` for several fast checks of taught material. Use `ConceptReveal` when one new idea needs introducing without a prediction. Use `CinematicRevealMoment` when an image or video can create the opening significance more effectively.
  - **Content shape:** one short, surprising but fair true/false statement connected directly to the chapter's central question, with one defensible answer and either one clear explanation or a short series of reveal beats. It must be understandable before the teaching and remain useful whether the learner predicts correctly or incorrectly. The response must not be logged as a weakness.
  - **Rhythm role:** opening.

---

### ChapterOutcomeScreen

**File:** `src/components/layout/ChapterOutcomeScreen.jsx`
**Purpose:** Chapter outcome reveal screen. Shows learner performance with cinematic context.
**Props:** `subject`, `chapterTitle`, `onContinue`, `onBack`
**Dependencies:** `SUBJECTS`

---

## Chapter runtime architecture

Two components make up the chapter runtime. Neither is an authoring choice —
they are named here so authors can recognise them and route around them.

### ChapterPlayer

**File:** `src/components/layout/ChapterPlayer.jsx`
**What it is:** The internal runtime for one authored chapter. It owns the
chapter lifecycle — opening gates (hook, what-you'll-learn, prior-knowledge
recall), navigation between screens, progress persistence to
`gcse_chapter_<chapterId>`, repair and examiner diversions, and completion.
**Props:** `chapter` (a chapter definition resolved through
`CHAPTER_CONTENT_LOADERS`), `onBack`, `onChapterComplete`
**Dependencies:** `ScreenRenderer`, `screenRegistry.js` schema validation,
`chapterNavigation.js`, `progress.js`, `MODULES`

- **Not an authoring choice.** Content authors never select `ChapterPlayer`
  as a screen or component, and never add a screen type to it. It resolves
  every screen through `ScreenRenderer`; it holds no component-routing
  branches of its own.

### ScreenRenderer

**File:** `src/components/layout/ScreenRenderer.jsx`
**What it is:** The sole runtime boundary mapping registered screen and block
types to approved components. `FULL_SCREEN_RENDERER_TYPES` and
`BLOCK_RENDERER_TYPES` are proved equal to the active entries of
`SCREEN_REGISTRY` / `BLOCK_REGISTRY` by
`tests/architecture/screen-registry.test.js`.
**Props:** `screen`, `chapter`, `chapterNum`, `subject`, plus the runtime
callbacks `ChapterPlayer` supplies.
**Dependencies:** `src/data/screenRegistry.js`, every routed learning and
feedback component

- **Not an authoring choice.** Authors select entries from
  `screenRegistry.js`, never `ScreenRenderer` directly.

### Chapter-building rule

A normal chapter is buildable by:

1. adding chapter metadata to `src/chapters.js`;
2. adding its content loader to `src/content/chapterContentRegistry.js`;
3. composing registered screens and blocks from `src/data/screenRegistry.js`;
4. adding the chapter id to exactly one parent module in `src/data/modules.js`;
5. passing schema and architecture tests.

Adding a normal chapter must **not** require editing `ChapterPlayer`,
`ScreenRenderer`, app navigation or progress persistence. Editing
`screenRegistry.js` and `ScreenRenderer` is permitted only when introducing a
genuinely new governed component type — never for ordinary chapter creation.
This is enforced by
`tests/architecture/chapter-authoring-boundary.test.js`.

---

## `src/components/feedback/`

Question feedback and exam practice components.

### ExamQuestionFrame

**File:** `src/components/feedback/ExamQuestionFrame.jsx`
**What it is:** The independent written exam-practice component. It presents an exam-style question with its mark allocation, command word, topic and optional source material, accepts a typed response and sends it to `/api/grade` for marking against the supplied mark scheme. Feedback can include marks awarded, achieved points, missed points, a summary and an examiner tip; the result can also feed the weakness tracker.
**Best used for:** Realistic GCSE written practice where the learner should construct a complete response independently and receive evidence-based feedback.
**Props:** `block`, `subject`, `mode` (default `'practice'`), `questionNum`, `onComplete`, `onSkip`
**Block shape:** `{ id?, questionText?|question, marks?, markPoints?|ms?, commandWord?, topic?, paper?, source?, sourceInstruction? }`
**Dependencies:** `SUBJECTS`, `GENERAL`, `SPACING`, `RADII`, `BUTTONS`, `TYPE`, `ContinueCTA`, `unifiedWeaknessTracker`, `/api/grade`

- **Decision**
  - **Use when:** the learner has already been taught the relevant knowledge and should independently attempt an authentic written question whose response needs mark-scheme judgement rather than simple right-or-wrong checking. Choose it for developed historical, literary, scientific or sociological responses and source-supported questions.
  - **Do not use when:** the learner still needs sentence-by-sentence construction support, the knowledge has not been taught, the task is ordinary factual retrieval, the response can be checked reliably through a simple objective interaction or the learning job is marking somebody else's answer.
  - **Choose instead:** use `GuidedExamResponse` when substantial scaffolding is needed. Use `WhatExaminersLookFor` immediately beforehand when the priorities need clarifying. Use `FaceTheExaminer` when the learner should judge and improve a prepared answer. Use `QuickRecallScreen` for short factual retrieval and `CalculationBreakdown` when a numerical method still needs teaching.
  - **Content shape:** one board-accurate exam-style question with a clear command word, defensible mark allocation, sufficient context, any required source or image, a usable mark scheme and stable topic metadata for feedback and weakness evidence. Avoid vague prompts, invented mark-scheme rules and questions that could be marked in several incompatible ways.
  - **Rhythm role:** practice, assessment.

### Exam practice and examiner feedback family rule

Choose according to the learner's stage:

- clarify what earns marks before writing → `WhatExaminersLookFor`
- construct and submit an independent response → `ExamQuestionFrame`
- judge, annotate and improve a prepared response → `FaceTheExaminer`

These components may form a sequence, but should not automatically be stacked around every exam question. Use `WhatExaminersLookFor` only when the priorities are not already secure, and use `FaceTheExaminer` as a deliberate examiner-literacy lesson rather than a compulsory post-question screen. `GuidedExamResponse` remains the alternative when the learner needs support during construction rather than before or after it.

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
**Screen type:** `quoteAnalyser` (full-screen, routed in `ChapterPlayer.jsx`)
**Animation:** word-by-word quote reveal via staggered `opacity` transitions; card entrance via `qa-card-in` CSS keyframe; seen-tick pop via `qa-tick-pop`; expanded overlay via `qa-slide-up`
**Dependencies:** `SUBJECTS`, `RADII`, `TYPE`, `ContinueCTA`

---

### RetrievalFrame — **LOCKED**

**File:** `src/components/feedback/RetrievalFrame.jsx`
**What it is:** Governed presentation infrastructure for an ordinary retrieval interaction embedded within a learning screen. It converts existing retrieval data for `AnswerInteraction` and provides contained, full-bleed or inline treatments; `AnswerInteraction` still owns all answer logic.
**Use by implementation when:** a normal multiple-choice retrieval question needs to be woven into a teaching screen with consistent interaction and feedback behaviour.
**Do not treat it as:** a selectable learning activity competing with `QuickRecallScreen`, a free-recall component, misconception repair, a true/false chapter hook, exam practice or a new content schema.
**Governance boundary:** content authors select the learning job. Implementation uses `RetrievalFrame` only where the surrounding screen contract calls for an embedded ordinary retrieval question. It does not handle `trueFalse`, does not replace `ChapterHookScreen` and does not count as the module's cinematic moment.
**Content shape:** one existing retrieval object with a concise question, a small answer set, one correct option, a useful explanation, an optional hint and any context required by the surrounding learning beat.
**Props:** `retrieval`, `variant` (`'contained' | 'fullBleed' | 'inline'`), `subject`, `topic`, `beatId`, `contextImage`, `contextText`, `label`, `mode`, `onInteractionComplete`, `onContinueReady`
**Lock reason:** Visual and interaction contract for embedded retrieval. Changing it risks inconsistency and duplication across question presentation.
**Dependencies:** `AnswerInteraction`, `SUBJECTS`, `SPACING`, `TYPE`

