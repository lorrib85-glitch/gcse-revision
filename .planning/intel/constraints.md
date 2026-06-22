# Synthesized Constraints

Extracted from all SPEC-type classifications. Covers api-contract, schema, nfr, and protocol constraints.

---

## CON-01 — Button and Radius Token Contract

source: /home/user/gcse-revision/docs/system/BUTTON_RADII_SYSTEM.md
type: api-contract
scope: RADII tokens, BUTTONS tokens, ContinueCTA, CinematicContinueCTA, src/constants/buttons.js, src/constants/radii.js

### Content

Radius tokens (locked):
- RADII.small = 10px — small interactive elements, compact chips
- RADII.medium = 16px — secondary buttons, input fields, tags
- RADII.large = 22px — primary buttons, major interactive surfaces
- RADII.panel = 26px — cards, panels, atmospheric containers
- RADII.pill = 999px — progress bars, pills, tags, icon buttons

Button tokens (locked):
- BUTTONS.primary: height 74px, borderRadius RADII.large, pressScale 0.985
- BUTTONS.secondary: height 56px, borderRadius RADII.medium, pressScale 0.985
- BUTTONS.continue: height 56px, borderRadius RADII.large (not medium — distinct from secondary)
- BUTTONS.compact: height 44px, borderRadius RADII.small, pressScale 0.985
- BUTTONS.text: no height, opacity 0.46

Rules:
- Primary CTA buttons use RADII.large — never RADII.pill (jellybean anti-pattern)
- Never invent random radii
- All interactive elements: minimum tap target 44×44px (NOTE: BackButton ADR overrides this for back-navigation to 40×40 — see INGEST-CONFLICTS.md [INFO])
- pressScale is always 0.985 — never 0.97 or 0.96

Progression CTA System (locked — two patterns only, never invent a third):
1. Primary Progression CTA: `<ContinueCTA>` only. Label exactly "Continue" (or "Finish ✓" for final screen). Never "Next", "Keep going", "Moving on", "Your turn →".
2. Cinematic Reveal CTA: `<CinematicContinueCTA>` only. Label exactly "Continue →". Used only on full-screen cinematic screens.

Button colours always from SUBJECTS[subject].accent — never hardcoded.

---

## CON-02 — History Module Architecture (LOCKED structure)

source: /home/user/gcse-revision/docs/system/HISTORY_MODULE_ARCHITECTURE.md
type: protocol
scope: History modules, ModulePlayer, Section 1-6 structure, PriorKnowledgeRecall

### Content

All GCSE History modules must follow this fixed six-section structure. Only content changes between modules. Structure must not be reinterpreted or redesigned.

Section 1 — Intro, Recall and Roadmap (mandatory order):
1. Cinematic intro OR True/False opener
2. PriorKnowledgeRecall
3. WhatYouWillLearn

Rules: retrieval must happen before roadmap; no examiner content; not a teaching section.

Section 2 — Learning Chunk 1: at least one interaction, at least one retrieval, end with active participation.
Section 3 — Learning Chunk 2: include interleaving, active processing, end with retrieval or interaction.
Section 4 — Learning Chunk 3: human experience/stories/consequences/case studies; include interleaving; end with retrieval or interaction. Do not assume always "human experience".
Section 5 — Learning Chunk 4: significance/consequences/change and continuity; end with chapter-level retrieval; do not introduce examiner content.

Section 6 — Summary and Examiner (mandatory order):
1. Final summary (optional)
2. Examiner tips
3. Meet the Examiner / Exam practice
4. Chapter completion screen — module always ends here

Component Selection Hierarchy (teaching): VisualLearning > VisualNarrativeScreen > InteractiveHotspotImage > InteractiveCollectionExplorer > GuidedChoiceCarousel.
Component Selection Hierarchy (checking understanding): QuickRecallScreen > MatchingTask > ColSortBlock > GuidedChoiceCarousel.
Component Repetition Limit: no feature component used more than twice in a single chapter (exceptions: Section 1/6 mandatory components; QuickRecallScreen and PriorKnowledgeRecall which deliberately recur).

Retrieval Rule: Recall → Teach → Apply → Recall. Avoid long passive sequences.
Weak Spot Recovery Rule: every module must deliberately revisit weak spots identified through PriorKnowledgeRecall, QuickRecallScreen, MatchingTask, FaceTheExaminer.
Interleaving Rule: previous learning must be deliberately revisited throughout the module.
One Screen = One Job: each screen has one primary purpose.
New Component Approval Rule: only create a new component when the mechanic is genuinely new, reusable across multiple modules, and existing components cannot achieve the same outcome.
History Brand Rules: antique brown, bronze, parchment, warm historical tones, dark cinematic backgrounds. No dashboard layouts, no glassmorphism, no neon.

Module Completion Test (all must pass before a History module is complete):
- Section 1 includes retrieval (PriorKnowledgeRecall)
- Weak spots are generated
- Every learning chunk includes interaction
- Every learning chunk includes retrieval
- Interleaving exists throughout
- Weak spots are revisited in-module
- Core chapter message is reinforced
- Examiner content appears only in Section 6
- Module ends with a completion screen
- No feature component is used more than twice in the module

PriorKnowledgeRecall scoring thresholds:
- 0.0-0.29 = weak (log to weakness tracker)
- 0.3-0.69 = partial (show as "revisit")
- 0.7-1.0 = secure (show as "recalled")

---

## CON-03 — Motion Token Contract

source: /home/user/gcse-revision/docs/system/MOTION_SYSTEM.md
type: api-contract
scope: MOTION tokens, animation, transitions, src/constants/motion.js

### Content

Duration tokens:
- MOTION.duration.instant = 120ms (button press, immediate state changes)
- MOTION.duration.fast = 180ms (hover states, micro-interactions, press transforms)
- MOTION.duration.standard = 280ms (most transitions, screen element appearances)
- MOTION.duration.slow = 420ms (page transitions, modal appearances)
- MOTION.duration.cinematic = 720ms (dramatic reveals, chapter hooks)
- MOTION.duration.atmospheric = 12000ms (ambient/looping atmosphere)

Easing tokens:
- MOTION.easing.standard = cubic-bezier(0.22, 1, 0.36, 1) (primary — deceleration into rest)
- MOTION.easing.gentle = ease-out (subtle transitions, element appearances)
- MOTION.easing.linear = linear (progress bars, opacity fades, looping animations)

Scale tokens:
- MOTION.scale.press = 0.985 (button press — never 0.97 or 0.96)
- MOTION.scale.subtle = 1.015 (hover lift — never 1.02 or 1.03)

Rules: never hardcode durations or easings. No bounce/spring physics. No confetti or particles. No arcade animations. No excessive hover motion. Entrance animations move content toward reader (translateY from below). Exit animations fade and optionally translateY upward.

---

## CON-04 — Spacing Token Contract

source: /home/user/gcse-revision/docs/system/SPACING_SYSTEM.md
type: api-contract
scope: SPACING tokens, layout rhythm, src/constants/spacing.js

### Content

Tokens:
- SPACING.micro = 8px (icon gaps, tight internal padding, small component gaps)
- SPACING.compact = 16px (card padding, stacked item gaps, safe-area minimums)
- SPACING.standard = 24px (screen horizontal padding, section gaps, standard margins)
- SPACING.separation = 42px (breathing room between major content blocks)
- SPACING.cinematic = 72px (dramatic vertical spacing, hero areas, progress bar clearance)
- SPACING.section = 96px (top-of-screen breathing, major section divisions)

Rules: never invent spacing values (no marginTop: 67, no padding: 13). Screen horizontal padding always SPACING.standard (24px). SPACING.micro and SPACING.compact for internal component gaps, not screen-level rhythm. Safe-area padding handled by ScreenShell via CSS env() — not SPACING tokens.

---

## CON-05 — Subject Theme Token Contract

source: /home/user/gcse-revision/docs/system/SUBJECT_THEME_SYSTEM.md
type: api-contract
scope: SUBJECTS constant, src/constants/subjects.js, subject palettes, accent colours

### Content

Import: `import { SUBJECTS } from '../../constants/subjects.js'`. Never duplicate palette maps locally. Never create local SUBJECT_ACCENTS objects. Never tweak subject colours per component.

Palette shape per subject: accent, accentSecondary, accentTertiary, background, backgroundSecondary, glow, glowStrong (where defined), overlay, progressFill (where defined), accentRgb, palette (optional extended named tokens).

Subjects defined: Maths, English, Physics, Biology, Chemistry, History, Sociology, Drama, Music.

Key accent values:
- Maths: #2CBFA3
- English: #6A343D (oxblood)
- Physics: #3DA5FF
- Biology: #6BAA5B (leafGreen)
- Chemistry: #8B4DFF
- History: #D69B45
- Sociology: #A79B8C (taupe)

Backwards-compatibility exports (legacy only — new components must use SUBJECTS directly): SUBJECT_ACCENTS, SUBJECT_PALETTES, hexToRgb.

---

## CON-06 — Typography Token Contract

source: /home/user/gcse-revision/docs/system/TYPOGRAPHY_SYSTEM.md
type: api-contract
scope: TYPE tokens, font families, src/constants/typography.js

### Content

Fonts: two fonts only — Manrope (cinematic display type — headings, titles, impact moments) and Sora (all other UI text — body copy, buttons, labels, navigation, metadata).

Conflict resolved 2026-06-22 (Phase 1): TYPOGRAPHY_SYSTEM.md and PRODUCT_UI_CONSTITUTION.md updated to match src/constants/typography.js. Cormorant Garamond and IBM Plex Serif references removed from all docs.

TYPE tokens (spread syntax: ...TYPE.hero — alias for TYPE.screenHeading):
- TYPE.screenHeading / TYPE.hero: Manrope, clamp(30px,8vw,42px), weight 800, lineHeight 1.02, letterSpacing -0.045em (chapter hooks, recovery titles, screen-level impact)
- TYPE.sectionHeading / TYPE.sectionTitle: Manrope, clamp(22px,6vw,30px), weight 700, lineHeight 1.08, letterSpacing -0.035em (section headings, module titles)
- TYPE.impactTitle: Manrope, clamp(28px,8vw,36px), weight 850, lineHeight 1.04, letterSpacing -0.045em (maximum-weight display moments)
- TYPE.cinematic / TYPE.overlayTitle: Manrope, clamp(24px,6.4vw,30px), weight 750, lineHeight 1.08, letterSpacing -0.035em (topic titles, overlay titles, cinematic reveals)
- TYPE.cardTitle: Manrope, 1.12rem, weight 700, lineHeight 1.18, letterSpacing -0.02em (card titles, prominent labels)
- TYPE.body / TYPE.bodyText: Sora, 0.95rem, weight 400, lineHeight 1.5, letterSpacing -0.005em (explanation copy)
- TYPE.bodyLarge: Sora, 1.02rem, weight 400, lineHeight 1.48, letterSpacing -0.006em (larger body passages)
- TYPE.bodySmall / TYPE.bodySmallText: Sora, 0.84rem, weight 400, lineHeight 1.45, letterSpacing -0.005em (supporting copy)
- TYPE.metadata / TYPE.metadataText: Sora, 0.72rem, weight 600, lineHeight 1.2, letterSpacing 0.10em (timing, question counts, progress labels)
- TYPE.buttonText: Sora, 0.92rem, weight 700, lineHeight 1.2, letterSpacing -0.005em (all button labels)

Rules: never introduce a third font family. Manrope is display/emotional only — never body copy or UI labels. Sora handles everything else. Section labels must be UPPERCASE. Each screen has one dominant text element, one supporting hierarchy, clear breathing room between levels.

---

## CON-07 — Screen Shell Layout Contract

source: /home/user/gcse-revision/docs/system/SCREEN_SHELL_SYSTEM.md
type: api-contract
scope: ContentShell, InteractionShell, CinematicShell, src/components/layout, ModulePlayer, LearningHeader

### Content

Three canonical shell primitives for all learning module screens:

ContentShell (default): for knowledge delivery screens (ConceptReveal, KeyFigureReveal, ExaminerExplainsScreen, etc.). Outer container position:fixed; inset:0. Max content width 420px horizontally centred. Horizontal padding SPACING.compact (16px) each side. Top clearance calc(80px + safe-area-inset-top). Bottom clearance calc(96px + safe-area-inset-bottom). Content overflow-y: auto. Props: subject, backgroundImage, backgroundOpacity (default 0.13), backgroundPosition, children.

InteractionShell: for screens where learner must complete an interaction before advancing (MatchingTask, QuickRecallScreen, etc.). Same as ContentShell except: bottom clearance is safe-area-inset only (interaction surface manages its own spacing); overflow hidden; flex column layout. Children needing full-bleed apply negative margins.

CinematicShell: last resort — only when ContentShell/InteractionShell would actively prevent required visual treatment. Requires a written comment in the consuming component explaining why neither alternative works. Provides only: position:fixed; inset:0; overflow:hidden. No background, padding, max-width, or safe-area handling — consuming component owns all of it.

Decision rule: default ContentShell. Use InteractionShell when screen has an answer mechanic needing to control its own scroll. Only use CinematicShell with written justification.

Shells must never: decide what component appears on screen, sequence module screens, calculate or display progress, own answer state, handle learning flow logic.

---

## CON-08 — Science Module Blueprint (LOCKED structure)

source: /home/user/gcse-revision/docs/system/SCIENCE_MODULE_BLUEPRINT.md
type: protocol
scope: Biology, Chemistry, Physics modules, AQA GCSE Combined Science, Part 1-6 structure

### Content

All Biology, Chemistry, and Physics modules follow this six-part structure. Science should feel like investigating how the real world works. Never begin with a definition — begin with a phenomenon, problem, mystery, experiment, image, or scenario.

Core Science Rule: every chapter must answer "Why does this happen?" Definitions come after the student cares about the answer.

Part 1 — Situation and prediction: hook curiosity, real-world scenario, prediction question, "You will learn" section (2-4 outcomes). Components: CinematicRevealMoment, ChapterHookScreen, RetrievalFrame.

Part 2 — Investigate the evidence: explore before formal teaching. Components: InteractiveHotspotImage, VisualLearning, VisualNarrativeScreen, CardContainer. One visual idea per screen.

Part 3 — Discover the science: teach core concept after evidence. Components: ConceptReveal, ExplainReveal, TheoryCompareBlock, CardContainer, KeyFigureReveal. Teach in order: what/why/precise GCSE term/real life/common mistake.

Part 4 — Check precision: catch misconceptions. Required: at least one short precision check per chapter. Components: MisconceptionCheck, SpotTheError, MatchingTask, ColSortBlock, FillInTheBlanksBlock, QuickRecallScreen.

Part 5 — Apply to real GCSE-style task. Components: GuidedExamResponse, ExamQuestionFrame, MatchingTask, FillInTheBlanksBlock, QuickRecallScreen, RetrievalFrame.

Part 6 — Face the examiner and debrief: return to opening situation, exam-style response, FaceTheExaminer with weak/improved answer and mark scheme. Finish: 3-5 quick retrieval questions, one interleaved from earlier chapter, weak areas logged. Components: FaceTheExaminer, ExaminerExplainsScreen, ExamQuestionFrame, WeakSpotRecovery, ChapterCompleteScreen, QuickRecallScreen.

Content Design Rules:
1. Real world first — believable real-world link per chapter
2. One idea per screen
3. Use diagrams constantly (InteractiveHotspotImage wherever structure and function understanding needed)
4. Teach systems, not isolated facts (connect related concepts explicitly)
5. Precision beats volume (teach precise GCSE terms; use simple language first then attach the term)
6. Practical skills appear everywhere (independent variable, dependent variable, control variables, repeatability, method improvements, conclusions from data throughout — not saved for separate practical chapters)

Science Chapter Success Criteria (all must be achievable before chapter is complete): explain opening situation; recall key facts; use correct GCSE vocabulary; interpret a relevant diagram; avoid at least one common misconception; apply to a new example; answer an exam-style question; understand how examiner awards marks.

---

## CON-09 — Canonical Topic Skill Design Contract

source: /home/user/gcse-revision/docs/superpowers/specs/2026-06-12-topic-brief-skill-design.md
type: schema
scope: .claude/skills/canonical-topic/SKILL.md, docs/content/history/, canonical topic file schema

### Content

Output file schema — six mandatory sections:

1. Identity: episode number, title, subtitle, era, Key Topic reference, build status.
2. Specification requirements: exhaustive bulleted list per spec material; MISSING: bullet for any uncovered sub-topic; if no spec material, list MISSING: bullets for all implied sub-topics.
3. Architecture checklist (tailored): walk Section 1-6 from HISTORY_MODULE_ARCHITECTURE.md; propose content per slot; suggest component per section; reproduce 9-point Module Completion Test as unchecked checklist.
4. Current state and gap analysis: if built, map existing screens to Section 1-6 slots and list gaps; if not built, state "Not yet built — full rebuild from spec."
5. Content reference pack: dates and timeline, key people (name/role/significance), key terms and definitions, case studies/named examples, causes and effects (explicit X → Y bullets), exam angles (question types, mark scheme patterns, misconceptions).
6. Build recommendations: prioritised list combining gaps and suggestions, components per slot, interleaving links.

Content philosophy: completeness over brevity; structure over prose; never silently infer or invent (use MISSING/UNCERTAIN); flag conflicts (CONFLICT:), don't resolve them.

File naming: docs/content/<subject>/<Series>/<NN>_<Title_With_Underscores>.md. Existing files are overwritten on re-run. Files are permanent and committed.

---

## CON-10 — Home Redesign Visual and Navigation Contract

source: /home/user/gcse-revision/docs/superpowers/specs/2026-06-14-home-todays-plan-redesign.md
type: api-contract
scope: Home screen, TaskCarousel, TaskCard, buildTodaysPlan, navigation wiring

### Content

Task descriptor shape returned by buildTodaysPlan():
```js
{
  type: 'warmup' | 'revisit' | 'continue' | 'practice' | 'paper',
  kicker: string,
  title: string,
  reason: string,
  durationMinutes: number,
  onSelect: { ... }
}
```

Navigation wiring:
- Warm-up: setTab('quickfire')
- Revisit/continue: onOpenModule(mod, screenIndex) via openModulePlayer; revisit uses findTaggedScreen(mod, topic)
- Practice/paper: examAutoStart prop on TestTab, auto-calls startExamRound() in useEffect once TestDataProvider data has loaded

Duration sizing: warm-up 2min; revisit 5min; continue remainingScreens * 2.5 (rounded); practice questionCount * 1.5; target ~60 min total; exam practice question count clamped 6-15.

Weekend paper: subject via ISO week number mod list [Maths, English, Sociology, Chemistry, History]; durationMinutes ~50.

Build phases: Phase 1 — visual shell with mock data + Playwright screenshot at 390x844; Phase 2 — wire buildTodaysPlan() and engine logic.
