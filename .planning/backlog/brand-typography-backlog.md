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

**Status:** Backlog  
**Priority:** High  
**Area:** `src/constants/generalTheme.js`, `src/styles.css`, shared chrome, cross-subject screens, tests

### Context
Repeated dark colours are being used as general app chrome rather than subject identity. Current audit examples include:

- `#08090D` — 51 sites
- `#151720` — 24 sites
- `#0D0F14` — 12 sites
- `#0D1424` — 4 sites

Some are numerically close to subject palette tokens, but replacing them with Maths/Chemistry/Physics tokens would be semantically wrong. Example: `#0D1424` is numerically close to `Physics.background`, but its call sites are in `ModulePlayer.jsx`, `QuickFire.jsx`, and `MathsQuestion.jsx` — cross-subject and Maths-specific, not Physics. Distance-matching alone would create misleading token references and future palette coupling.

### Direction
Create deliberately named `GENERAL` tokens for shared dark surfaces, then migrate by meaning rather than by colour similarity.

Suggested token shape:

```js
GENERAL.background.app
GENERAL.background.surface
GENERAL.background.sunken
GENERAL.background.panel
```

Or, if the existing `GENERAL` object remains flatter:

```js
GENERAL.bgApp
GENERAL.bgSurface
GENERAL.bgSunken
GENERAL.bgPanel
```

### Rules
- Do not map general chrome colours to subject palettes just because the hex values are close.
- Do not use Physics/Maths/Chemistry tokens on cross-subject surfaces unless the surface is genuinely subject-scoped.
- Decide token names by semantic role: app background, raised surface, sunken surface, panel/chrome.
- Preserve intentional subject-specific backgrounds where they exist.
- Avoid a broad blind replace; inspect call sites and migrate in small batches.

### Acceptance criteria
- New `GENERAL` dark surface tokens exist with clear names.
- Repeated hardcoded general dark colours are migrated to those tokens where appropriate.
- Cross-subject surfaces no longer depend on subject-specific palette tokens.
- Architecture/brand tests catch reintroduction of high-frequency hardcoded dark surface values.
- Documented exceptions remain allowed only where a colour is intentionally bespoke or subject-specific.
