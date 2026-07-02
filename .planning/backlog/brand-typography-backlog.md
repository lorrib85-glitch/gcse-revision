# Brand and typography backlog

## Purpose
Track visual identity, typography, sentence case, layout consistency, and brand-system work separately from feature and architecture work.

Use this backlog for anything that changes how the app looks, feels, reads, or maintains its visual system.

---

## B1 — Enforce typography token usage across module screens

**Status:** Backlog  
**Priority:** High  
**Area:** `src/components/`, `src/features/`, `src/constants/typography.js`, tests

### Context
The app moved to a Manrope + Sora typography identity. Several screens have already been refactored away from deprecated aliases and hardcoded font weights, but future work must avoid drifting back.

### Rules
- Headings should use Manrope via approved typography tokens.
- UI/body text should use Sora via approved typography tokens.
- Do not hardcode font families inside components unless there is a documented intentional exception.
- Do not hardcode font weights where an existing `TYPE` token fits.
- Prefer token spreads over manual `fontFamily`, `fontSize`, `fontWeight` combinations.
- Preserve deliberate special cases, such as parchment/serif history styling, only where explicitly intended.

### Acceptance criteria
- No deprecated typography aliases are reintroduced.
- Screens use canonical `TYPE` tokens.
- New architecture tests or lint checks catch obvious hardcoded typography regressions.
- Visual output remains consistent across modules.

---

## B2 — Sentence case audit across app UI

**Status:** Backlog  
**Priority:** High  
**Area:** all UI text

### Context
The preferred app style is sentence case for UI. Random capitalisation makes the app feel less premium and less consistent.

### Rules
- Use sentence case for headings, labels, buttons and feedback where possible.
- Avoid all-caps labels unless they are a deliberate UI token style and visually small.
- Character/profile names and exam paper titles can keep proper capitalisation.
- Preserve official exam wording where needed.

### Acceptance criteria
- Module screens use sentence case.
- Quick Fire / Exam / planner / home UI copy is consistent.
- Tests or search checks catch obvious regressions where practical.

---

## B3 — Screen layout consistency using standard containers/components

**Status:** Backlog  
**Priority:** High  
**Area:** module screens, learning components, feature screens

### Context
Several screens became visually inconsistent when custom wrappers, manual padding, or bespoke positioning were introduced. The app should reuse established screen containers and layout components wherever possible.

### Rules
- Use existing screen containers/layout primitives before custom wrappers.
- Avoid manual full-screen layouts unless the interaction truly requires it.
- Avoid bespoke sticky/floating structures when a shared pattern exists.
- Do not remove global/floating progress behaviour from module screens.
- Keep mobile-first spacing and safe-area handling.

### Acceptance criteria
- Screens feel aligned without per-screen padding hacks.
- Module flow progress remains consistent.
- Continue buttons use standard app patterns unless the interaction requires a custom action.

---

## B4 — Cinematic subject-brand system refinement

**Status:** Backlog  
**Priority:** Medium  
**Area:** visual components, subject themes, module imagery

### Context
The app should feel cinematic, mature and subject-specific. It should not look like a generic neon AI dashboard.

### Rules
- Use dark backgrounds as atmosphere, not decoration.
- Neon/glow must be restrained and purposeful.
- Glow should signal active progress, selected state, streak energy or subject identity only.
- Avoid random cyan/purple gradients.
- Avoid excessive glass cards.
- Avoid childish gamification.
- Avoid dashboard-style clutter.
- Keep subject identity grounded in the actual content.

### Subject direction
- History: cinematic realism, parchment/linen where appropriate, historically grounded imagery.
- General app: teal/coral/gold accents used sparingly and consistently.
- Cross-subject features: use general app palette, not one subject palette.

### Acceptance criteria
- Screens feel premium and mobile-first.
- Subject modules remain visually distinct without becoming theme-park/cliche.
- Brand rules are documented enough for Claude prompts and future builds.

---

## B5 — History Medicine card/image polish

**Status:** Backlog  
**Priority:** Medium  
**Area:** History Medicine modules/cards/images

### Context
Several History Medicine cards have gone through design iterations. The desired direction is cinematic, historically accurate, clean on mobile, and not visually fussy.

### Known preferences
- Avoid tiny details that do not read on mobile.
- Avoid unrealistic props or modern-looking elements.
- Avoid over-bright backgrounds that overpower the content.
- Use clearer visual hierarchy between image and navigation/content areas.
- Keep cards premium, not gamey.
- Remove labels that do not add learning value.
- Use one strong explanatory heading rather than scattered small labels.

### Acceptance criteria
- Medicine cards support learning, not just decoration.
- Images read clearly on mobile.
- Cards align with app typography and layout tokens.
- Important content remains visible and legible.

---

## B6 — Streak visual and animation polish

**Status:** Backlog  
**Priority:** Medium  
**Area:** streak feature, home/personalisation

### Context
The streak graphic should feel personal and energising without becoming childish or off-brand.

### Direction
- Use the general app palette rather than subject colours.
- Flame can carry coral energy.
- Keep the design lean: avoid repeated wording.
- Use Manrope for heading-like text and Sora for supporting text.
- Animation concept: flame spins, then days tick up one by one.
- Full-screen moment should appear once per visit per day only.

### Acceptance criteria
- Mature, cinematic, cross-subject visual.
- Works on mobile.
- Does not interrupt learning.
- Does not look like a generic game badge.

---

## B7 — Brand governance tests

**Status:** Backlog  
**Priority:** Medium  
**Area:** tests/architecture, constants, components

### Goal
Prevent brand and typography drift as more modules are generated.

### Possible checks
- No deprecated typography aliases.
- No direct `fontFamily` unless approved.
- No broad hardcoded font weights when a token exists.
- No random neon/glow styles outside approved components.
- No subject-specific palette leakage into cross-subject screens.
- No new one-off progress bar styles.

### Acceptance criteria
- Tests catch the most common styling regressions.
- Exceptions are documented and intentional.
- Tests do not become so strict that they block legitimate subject-specific design.

---

## B8 — Component-specific visual debt list

**Status:** Backlog  
**Priority:** Medium

### Items to revisit
- Quick Fire result/summary polish after question-bank/adaptive work settles.
- Exam mode landing and chooser visual hierarchy.
- History Medicine treatment/theory reveal cards.
- Face the Examiner question-first animation idea.
- Number-line/scoring feature polish.
- Remove any remaining cheap-looking scrollbars or awkward overflow states.
- Recheck typography/sentence case after future module generation.

### Acceptance criteria
- Visual debt is fixed after architecture is stable, not mixed into structural refactors.
- Each visual pass has a narrow scope and screenshots before/after where useful.

---

## B9 — General dark surface token gap

**Status:** In progress  
**Priority:** High  
**Area:** `src/constants/generalTheme.js`, `src/styles.css`, shared chrome, cross-subject screens, tests

### Context
Repeated dark colours are being used as general app chrome rather than subject identity. Current audit examples include:

- `#08090D` — 51 sites
- `#151720` — 24 sites
- `#0D0F14` — 12 sites
- `#0D1424` — 4 sites

Some are numerically close to subject palette tokens, but replacing them with Maths/Chemistry/Physics tokens would be semantically wrong. Example: `#0D1424` is numerically close to `Physics.background`, but its call sites are in `ModulePlayer.jsx`, `QuickFire.jsx`, and `MathsQuestion.jsx` — cross-subject and Maths-specific, not Physics. Distance-matching alone would create misleading token references and future palette coupling.

### Progress
- Added additive `GENERAL` tokens in `src/constants/generalTheme.js`:
  - `backgroundApp: '#08090D'`
  - `backgroundSurface: '#151720'`
  - `backgroundSunken: '#0D0F14'`
  - `backgroundPanel: '#0D1424'`
- `src/app/LegacyApp.jsx` partially migrated: 5 of 6 raw `#08090D` sites (splash screen, module loading screen, login screen, onboarding screen, tab shell background) now use `GENERAL.backgroundApp`. One site (`OnboardingScreen` continue-button text colour, which reuses `#08090D` as a foreground colour rather than a background/surface role) was left as raw hex — ambiguous semantic role, not migrated. `#151720`, `#0D0F14`, `#0D1424` do not occur in this file.
- `src/app/BottomNav.jsx` audited: zero raw B9 target hexes present (already uses `GENERAL.teal`/`GENERAL.slate`/`GENERAL.neutral[0]`). No changes needed.
- `src/components/learning/SwipeSort.jsx` fully migrated: both raw `#08090D` sites (done-screen `CinematicShell` background, active game-screen `CinematicShell` background) now use `GENERAL.backgroundApp`. No other target hexes were present in this file, and no ambiguous cases needed skipping. `import { GENERAL } from '../../constants/generalTheme.js'` added.
- `src/components/learning/DragToOrderTask.jsx` partially migrated: the 1 clean full-screen `background: '#08090D'` container site now uses `GENERAL.backgroundApp`. The other site (`color: '#08090D'` foreground button text) was left as raw hex — foreground role, not migrated. `import { GENERAL } from '../../constants/generalTheme.js'` added.
- `src/components/learning/BeforeAfterImageSlider.jsx` partially migrated: the 1 clean full-screen `background: '#08090D'` container site now uses `GENERAL.backgroundApp`. The other 2 sites (`stroke="#08090D"` on two SVG chevron icon paths) were left as raw hex — SVG stroke/foreground role, not migrated. `import { GENERAL } from '../../constants/generalTheme.js'` added.
- `src/components/learning/TimelineCanvas.jsx` partially migrated: the 1 clean full-screen `CinematicShell` `background: '#08090D'` site now uses `GENERAL.backgroundApp`. The other 2 sites (`border: '6px solid #08090D'` decorative cutout-ring border, `color: isOpen ? '#08090D' : accent` foreground text) were left as raw hex — border/foreground role, not migrated. `import { GENERAL } from '../../constants/generalTheme.js'` added.
- Visual output in `LegacyApp.jsx`, `SwipeSort.jsx`, `DragToOrderTask.jsx`, `BeforeAfterImageSlider.jsx`, and `TimelineCanvas.jsx` is unchanged (token values match the replaced hex exactly).
- `src/components/feedback/ExamQuestionFrame.jsx` partially migrated: the 1 clean `background: '#0D0F14'` outer root card container site now uses `GENERAL.backgroundSunken`. The other site (`color: canSubmit ? '#0D0F14' : ...` foreground "Check answer" button text) was left as raw hex — foreground role, not migrated. No other target hexes were present in this file. `import { GENERAL } from '../../constants/generalTheme.js'` added.
- `src/components/layout/ChapterCompleteScreen.jsx` fully migrated: the 1 clean full-screen root container `background: '#08090D'` site now uses `GENERAL.backgroundApp`. No other target hexes were present in this file, and no ambiguous/foreground/border/SVG-stroke cases needed skipping. `import { GENERAL } from '../../constants/generalTheme.js'` added.
- `src/components/layout/ChapterHookScreen.jsx` fully migrated: the 1 clean `CinematicShell` `background: '#08090D'` site now uses `GENERAL.backgroundApp`. No other exact-hex target sites were present in this file (the `rgba(8,9,13,...)` gradient overlays are decorative and were left untouched, in scope with the skip rules for overlays). `import { GENERAL } from '../../constants/generalTheme.js'` added.
- `src/components/layout/ChapterOutcomeScreen.jsx` fully migrated: the 1 clean `CinematicShell` `background: '#08090D'` site now uses `GENERAL.backgroundApp`. No other exact-hex target sites were present in this file (the `rgba(8,9,13,...)` gradient overlays are decorative and were left untouched). `import { GENERAL } from '../../constants/generalTheme.js'` added.
- `src/components/learning/KeyFigureReveal.jsx` fully migrated: the 1 clean `CinematicShell` `background: '#08090D'` site now uses `GENERAL.backgroundApp`. No other exact-hex target sites were present in this file (the `rgba(8,9,13,...)` portrait scrim gradients are decorative and were left untouched). `import { GENERAL } from '../../constants/generalTheme.js'` added.

### Direction
Migrate repeated raw values to the new deliberately named `GENERAL` tokens by meaning rather than by colour similarity.

### Rules
- Do not map general chrome colours to subject palettes just because the hex values are close.
- Do not use Physics/Maths/Chemistry tokens on cross-subject surfaces unless the surface is genuinely subject-scoped.
- Decide token names by semantic role: app background, raised surface, sunken surface, panel/chrome.
- Preserve intentional subject-specific backgrounds where they exist.
- Avoid a broad blind replace; inspect call sites and migrate in small batches.

### Remaining work
- Migrate one area at a time, not all ~91 call sites in one pass. `LegacyApp.jsx`, `SwipeSort.jsx`, `DragToOrderTask.jsx`, `BeforeAfterImageSlider.jsx`, `TimelineCanvas.jsx`, `ExamQuestionFrame.jsx`, `ChapterCompleteScreen.jsx`, `ChapterHookScreen.jsx`, `ChapterOutcomeScreen.jsx`, and `KeyFigureReveal.jsx` are done (each bar their ambiguous/foreground-colour/SVG-stroke/border/overlay sites); `BottomNav.jsx` needed no changes. Remaining files (`ModulePlayer.jsx`, `QuickFire.jsx`, `Subjects.jsx`, and others with raw `#08090D`/`#151720`/`#0D0F14`/`#0D1424`) are still unmigrated and each needs its own narrow, scoped pass — this is not a signal to broaden scope to a repo-wide migration.
- Prioritise low-risk shared chrome after ModulePlayer architecture work settles.
- Add tests or search checks once migration patterns are proven.

### Acceptance criteria
- New `GENERAL` dark surface tokens exist with clear names.
- Repeated hardcoded general dark colours are migrated to those tokens where appropriate.
- Cross-subject surfaces no longer depend on subject-specific palette tokens.
- Architecture/brand tests catch reintroduction of high-frequency hardcoded dark surface values.
- Documented exceptions remain allowed only where a colour is intentionally bespoke or subject-specific.

---

## B10 — Semantic feedback colour token gap

**Status:** In progress  
**Priority:** High  
**Area:** `src/constants/generalTheme.js`, feedback states, quizzes, Quick Fire, question components, tests

### Context
Correct/incorrect feedback colours are repeated across the app, but there was no clearly approved semantic `GENERAL.success` / `GENERAL.error` token pair.

Current audit examples include:

- Correct/success greens: `#4DFF88`, `#38D27A`
- Incorrect/error reds: `#FF5D73`, `#FF5C7A`

These should not be treated as subject colours. They represent semantic feedback states that can appear in any subject: correct answer, success state, wrong answer, error state, validation failure, or feedback glow.

### Progress
- Added additive `GENERAL` feedback tokens in `src/constants/generalTheme.js`:
  - `success: '#4DFF88'`
  - `successSoft: '#38D27A'`
  - `error: '#FF5D73'`
  - `errorSoft: '#FF5C7A'`
- Migrated clear QuickFire answer-feedback uses in:
  - `src/features/quickfire/QuickFire.jsx`
  - `src/features/quickfire/modes/MathsQuestion.jsx`
  - `src/features/quickfire/utils.js`
- Left non-feedback uses untouched, including calculator badges, Sociology accent colour, Paper 1/Paper 2 filter-pill state, diagram labels, and exam countdown urgency colour.

### Direction
Continue migrating semantic feedback uses in small scoped passes only where the meaning is clearly success/error feedback.

### Rules
- Do not map correct/incorrect colours to subject palettes.
- Do not use green/red hex values directly in quiz or answer feedback components once tokens exist.
- Keep semantic feedback separate from decorative brand accents.
- Treat success/error colours as functional UI states, not subject identity.
- Preserve accessibility and contrast when choosing final token values.
- Do not migrate visually similar colours unless the semantic role is clear.

### Remaining work
- Audit other quiz/answer-feedback components outside QuickFire.
- Add tests or search checks once more semantic feedback call sites have been migrated.
- Keep documented exceptions for non-feedback uses.

### Acceptance criteria
- Approved semantic success/error tokens exist in `GENERAL`.
- Correct/incorrect answer feedback uses these tokens consistently.
- Any alpha/soft background variants are derived from the semantic token or explicitly named.
- Tests or architecture checks catch reintroduced high-frequency hardcoded success/error hex values.
- Subject palettes do not govern cross-subject feedback states.

---

## B11 — Micro label and badge typography token gap

**Status:** Backlog  
**Priority:** Medium  
**Area:** `src/constants/typography.js`, exam chrome, badges, metadata labels, compact UI

### Context
A strict exact-match typography audit across `FactorWeb.jsx`, `ExamPaperDebrief.jsx`, and `ExamPaperQuestion.jsx` found no safe mechanical migrations to existing `TYPE` tokens. The small UI combinations use hand-tuned mixes of `fontFamily`, `fontSize`, `fontWeight`, `lineHeight`, and `letterSpacing`.

Examples include adjacent 11px/700 labels in `ExamPaperQuestion.jsx` with materially different letter-spacing values, both close to `TYPE.eyebrow` but not exact. Forcing these to existing tokens would silently alter compact UI rhythm and risk visual drift.

### Direction
Treat this as a design-system gap, not a cleanup task. Propose new micro typography tokens only if repeated semantic patterns are found and visually approved.

Possible token names:

```js
TYPE.microLabel
TYPE.badge
TYPE.statusLabel
TYPE.examMeta
```

### Rules
- Do not migrate typography by near-match.
- Do not change letter-spacing, line-height, or weight without visual review.
- Token names should describe the UI job, not only the size.
- Keep per-context sizing allowed where the existing governance test intentionally allows it.
- `Subjects.jsx` remains out of scope because the current governance test documents it as an intentional exception.

### Acceptance criteria
- Any new token proposal is based on repeated semantic use cases, not numeric similarity alone.
- Existing UI remains unchanged until token values are approved.
- Governance tests continue to avoid unsafe size/spacing judgment calls.
- If new tokens are added, migration is narrow, visual, and screenshot-reviewed.

---

## B12 — Local typography fragment object duplication

**Status:** Backlog  
**Priority:** Medium  
**Area:** `GalensDiagnostic.jsx`, `src/constants/typography.js`, typography governance tests

### Context
`GalensDiagnostic.jsx` defines local typography fragment objects such as `O` and `F`, including `fontFamily: "'Sora', sans-serif"`, even though `TYPE` is already imported in the same file.

This is real duplication, similar in shape to the `Subjects.jsx` local palette issue, but it should not be mechanically collapsed into existing `TYPE` tokens because the per-instance font sizes and weights do not exactly match current tokens.

### Direction
Separate the duplication problem from the token-fit problem.

### Rules
- Do not force the file's per-instance size/weight combinations onto near-matching existing tokens.
- Remove or reduce local font-family fragments only where it preserves visual output exactly.
- Consider B11 micro typography tokens before any broader migration.
- Preserve the current visual design unless a deliberate token proposal is accepted.

### Acceptance criteria
- Local typography fragments are documented and either removed safely or marked as intentional exceptions.
- Any migration preserves visual output or is approved as a deliberate design change.
- Governance tests can distinguish unsafe local font duplication from allowed per-context sizing.
