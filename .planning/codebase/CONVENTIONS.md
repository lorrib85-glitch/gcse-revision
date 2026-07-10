# Coding Conventions

**Analysis Date:** 2026-07-09

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `AnswerInteraction.jsx`, `BackButton.jsx`, `CircularTimer.jsx`)
- Stories: Same name as component with `.stories.jsx` suffix (e.g., `KeyPoint.stories.jsx`)
- Utilities/helpers: camelCase (e.g., `progress.js`, `storage.js`)
- Tests: Descriptive with `.test.js` suffix in matching hierarchy (e.g., `src/components/core/` → `tests/unit/*/`)

**Functions:**
- Regular functions: camelCase and descriptive (e.g., `recordScore`, `getProgress`, `buildDailyPlan`, `selectMainSubject`)
- React components: PascalCase (e.g., `CheckIcon`, `AnswerInteraction`)
- Callbacks: prefixed with `on` (e.g., `onComplete`, `onAnswered`, `onContinue`)
- Helper/internal functions: camelCase with leading underscore for "private" helpers (rare, prefer static functions in modules)
- Getter/finder functions: `get*` or `find*` (e.g., `getProgress`, `findTaggedScreen`)

**Variables:**
- Local state: camelCase (e.g., `selected`, `showHint`, `isComplete`)
- Boolean flags: `is*` or `has*` or `can*` prefix (e.g., `isComplete`, `hasError`, `canSubmit`)
- Constants in module scope: SCREAMING_SNAKE_CASE (e.g., `KEY`, `SCORES_KEY`, `WEAK_THRESHOLD`)
- Constants that are objects/data structures: SCREAMING_SNAKE_CASE (e.g., `MODULES`, `SUBJECTS`, `SPACING`)
- Temporary loop variables: Single letter acceptable only in reduce/map (otherwise spell out)

**Types & Objects:**
- Concept IDs: kebab-case with colons as namespace separators (e.g., `history:medicine:galen`, `bio:cell_division`)
- Subject names: PascalCase (e.g., `History`, `Biology`, `Maths`, `Chemistry`)
- Tag namespaces: kebab-case (e.g., `skill:*`, `misconception:*`)
- Data fixture objects: SCREAMING_SNAKE_CASE (e.g., `MACBETH_BLOCK`, `mockAuthUser`)

## Code Style

**Formatting:**
- No explicit Prettier configuration present; follows ESLint flat config recommendations
- Indentation: 2 spaces (consistent across codebase)
- Line length: No hard limit enforced, but keep under ~100 chars for readability
- Semicolons: Explicit semicolons required (enforced by ESLint)
- Quotes: Double quotes in JSX string attributes; single quotes in JS strings (standard Prettier defaults)

**Linting:**
- Tool: ESLint 9.39.4 (flat config format in `eslint.config.js`)
- Key rules enforced:
  - `react-hooks/rules-of-hooks`: error (React Hooks rules must be followed)
  - `react-hooks/exhaustive-deps`: warn (dependency arrays should be complete)
  - `no-unused-vars`: warn (unused variables flagged, `_`-prefixed ones ignored)
  - `no-empty`: error (except intentional `catch {}` for silent storage failures)
  - `react/prop-types`: off (PropTypes not used; TypeScript not in codebase)
  - `react/no-unescaped-entities`: off (JSX content is educational text, not HTML entities)
  - `jsx-a11y/click-events-have-key-events`: off (Cinematic full-screen `onClick` divs are intentional)
  - `jsx-a11y/no-static-element-interactions`: off (Same as above)
  - `custom-rules/no-hardcoded-design-tokens`: warn (Custom rule in `eslint-rules/no-hardcoded-design-tokens.js`)

**Custom ESLint Rule:**
- Rule: `no-hardcoded-design-tokens` (warns on hardcoded font sizes, spacing, button heights)
- Hardcoded values forbidden (examples):
  - Font sizes: `fontSize: '24px'` → use `sectionHeading()` or `TYPE.sectionTitle`
  - Button heights: `height: '56px'` → use `BUTTONS.secondary.height`
  - Spacing: `padding: '16px'` → use `SPACING.md`
- All design tokens must come from `src/constants/` files

## Import Organization

**Order:**
1. React & library imports (e.g., `import { useState } from 'react'`)
2. Sibling and parent imports from project (e.g., `from '../../progress.js'`)
3. Constants imports (e.g., `from '../../constants/typography.js'`)
4. Component imports (e.g., `from '../../components/...'`)
5. No separate CSS imports (styles via constants and inline style objects)

**Path Aliases:**
- No path aliases configured; all imports use relative paths (`../../`)
- Public assets accessed via `/public/` root path in `<img>` tags

## Error Handling

**Patterns:**
- Silent `catch {}` blocks: Intentional pattern for localStorage read/write failures (see `src/lib/storage.js`)
  - Catch block is empty by design (ESLint `no-empty` allows this via `allowEmptyCatch: true`)
  - Fallback values returned for read operations (e.g., `return fallback`)
  - Warning logged to console only for write failures (e.g., `console.warn('storage: failed...')`)
- Early returns: Validate inputs at function start, return early if invalid
  - Example: `if (!subject || possible === undefined) return` in `recordScore()`
- Null coalescing for defaults: `data.streak = (data.streak || 0) + 1`
- No explicit error classes or custom Error subclasses used; native try/catch only
- No error logging to external service (cold start assumption: logging only via console)

## Logging

**Framework:** `console` (no external logging framework)

**Patterns:**
- `console.warn()` for recoverable errors (storage write failures, missing data)
- `console.log()` rare; used only in stories/storybook for demonstration (e.g., `onContinue: () => console.log('continue')`)
- No `console.error()` calls observed; errors either silently fail or are fatal
- No structured logging; simple message strings only

## Comments

**When to Comment:**
- Header comment above locked/critical components explaining rules and invariants
  - Example: `// ── AnswerInteraction v1 — LOCKED COMPONENT ────────────────────────────────────`
- Section separators using `─────` visual dividers for major code sections
  - Example: `// ─── Core progress store ───────────────────────────────────────────`
- Inline comments explaining *why*, not *what* the code does
  - Example: `// Keep last 200 entries — enough for meaningful improvement calculations`
- JSDoc-style comments above functions describing parameters and return values
  - Use sparingly; codebase does not enforce JSDoc format

**Pattern:**
```javascript
// ─── Section Name ─────────────────────────────────────────

/**
 * Descriptive function purpose
 * @param {Type} paramName - what it does
 * @returns {Type} what is returned
 */
export function functionName(paramName) {
  // Implementation
}
```

## Function Design

**Size:** 
- Prefer short, single-responsibility functions (typical range: 10–50 lines)
- Complex planner logic split into many small functions (100+ total lines for `dailyPlanner.js`, but each function 20–40 lines)
- React components: typically 100–200 lines (logic + JSX)

**Parameters:**
- Max 4–5 positional parameters; use object destructuring for optional or complex parameters
  - Example: `buildDailyPlan(profile, state, date, { persistRotation } = {})`
- Callbacks as props: use `on*` naming convention
- Config/options objects: passed as final parameter, optional with default `{}`

**Return Values:**
- Functions return what they compute; side effects via callbacks or module-level writes
- Array-returning functions: return empty array `[]` if no results (not `null`)
- Object-returning functions: return empty object `{}` if no data (not `null`)
- Boolean predicates: return `true`/`false`, never truthy/falsy
- Null: returned only when absence of data is meaningful (e.g., `getConcept('unknown') returns null`)

## Module Design

**Exports:**
- Named exports for utilities (`export function functionName()`)
- Default export for React components (`export default function ComponentName()`)
- No mixed default + named exports on same file
- Constants exported as named exports (`export const KEY = 'key'`)

**Barrel Files:**
- No barrel index files (e.g., no `src/components/index.js`)
- Each component imported directly: `from '../../components/core/BackButton.jsx'`

**Module Scope Patterns:**
- Storage is accessed via `src/lib/storage.js` — no direct `localStorage` calls in other modules
  - Exception: tests that stub localStorage (e.g., `installLocalStorageStub()`)
  - Enforced by `tests/architecture/storage-boundary.test.js` (allowlist = `storage.js` only)
  - `src/data/progressSync/accountScope.js` and `progressSync.js` are not
    exceptions to this — they only ever call `storage.js`'s exported
    primitives (including the account-scoped `*ForScope`/raw variants),
    never `localStorage` directly. They're the account-ownership
    orchestration layer built *on* the boundary, not inside it — see
    `docs/system/PROGRESS_SYNC_ARCHITECTURE.md`
- **Critical saves** (progress, screen completion, quiz/exam scores, streaks, planner
  completion — anything shown to the learner as *done*) persist via `saveCritical()`,
  not `setJson()`. On failure `saveCritical` returns `false` **and** emits on the
  save-failure bus (`subscribeSaveFailure`), which the app-wide `SaveFailureHost` turns
  into one governed `SaveFailureNotice`. Never surface a bespoke save-error alert or
  `window.alert`; never show a global success toast for a normal save.
- **Weakness→recovery routing identity.** Weakness log entries
  (`unifiedWeaknessTracker`) carry a human-readable `topic` (for UI) *and* an
  optional canonical `conceptTag` — a `TAG_MODULE_MAP` key. Recovery routing
  (`getBiggestWin`) resolves modules via `conceptTag`, falling back to `topic`
  only when the topic string is itself a registered routing key. Log the
  canonical tag (e.g. a bank row's `tag`) when one exists; never route a
  free-text label. `getBiggestWin` returns `conceptTag` so callers resolve the
  exact tagged screen with `findTaggedScreen`.
- Learning graph is pure: no React, no localStorage, no circular imports within `src/data/learningGraph/`
  - Enforced by architecture tests in `tests/architecture/learning-graph.test.js`
- Feature modules are isolated: all state passed as parameters, side effects explicit

## State Management

**React Components:**
- `useState` only (no Redux, Context, Zustand, etc.)
- State lifted to parent when sharing between siblings
- Props drilled as needed (no prop drilling library used)

**Module State:**
- Pure functions preferred; state passed as parameters
- Module-level data (constants, registries) are immutable and read-only
- Mutable state goes through `src/lib/storage.js` only (localStorage wrapper)

## Naming Conventions Summary Table

| Type | Pattern | Example |
|------|---------|---------|
| React component | PascalCase | `AnswerInteraction`, `BackButton` |
| Function | camelCase | `recordScore`, `getProgress` |
| Callback prop | `on` + PascalCase | `onComplete`, `onAnswered` |
| Constant | SCREAMING_SNAKE_CASE | `KEY`, `SPACING`, `MODULES` |
| File (component) | PascalCase | `AnswerInteraction.jsx` |
| File (utility) | camelCase | `progress.js`, `storage.js` |
| Boolean variable | `is`/`has`/`can` prefix | `isComplete`, `hasError` |
| Subject name | PascalCase | `History`, `Biology`, `Maths` |
| Concept tag | `subject:course:concept` | `history:medicine:galen` |

---

*Convention analysis: 2026-07-09*
