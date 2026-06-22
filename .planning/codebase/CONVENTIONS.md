# Coding Conventions

**Analysis Date:** 2026-06-22

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `CinematicCarousel.jsx`, `AnswerInteraction.jsx`)
- Utility/helper modules: camelCase (e.g., `dailyPlanner.js`, `moduleNavigation.js`, `storage.js`)
- Constants modules: camelCase (e.g., `spacing.js`, `motion.js`, `buttons.js`)
- Test files: `{filename}.test.js` (e.g., `dailyPlanner.test.js`)

**Functions:**
- Regular functions: camelCase (e.g., `recordActivity()`, `buildWeekdayBlocks()`, `normalisePulseDuration()`)
- React component functions: PascalCase (e.g., `function AnswerInteraction({ ... })`)
- Event handlers: prefix with action verb in camelCase (e.g., `handleMissedDay()`, `selectMainSubject()`)
- Helper functions prefixed by action: `get*()`, `set*()`, `calculate*()`, `select*()`, `build*()`, `apply*()`, `create*()`, `classify*()`

**Variables:**
- Constants (module-level): SCREAMING_SNAKE_CASE (e.g., `KEY`, `SCORES_KEY`, `MASTERY_ERROR_RATE_MAX`)
- Local constants inside functions: camelCase (e.g., `emptyState`, `defaultProfile`)
- State variables: camelCase (e.g., `selected`, `shakeIdx`, `attempts`, `isComplete`)
- Arrays/collections: plural camelCase (e.g., `blocks`, `items`, `weakPoints`, `selectedSubjects`)
- Maps/lookups: camelCase or descriptive (e.g., `subjectLookup`, `subjectBoosts`)
- Booleans: prefix with is/has (e.g., `isComplete`, `hasMetadata`, `allViewed`)

**Types & Objects:**
- Object keys in data structures: camelCase (e.g., `timesFailed`, `firstSeenAt`, `questionId`)
- Enum/const object keys: SCREAMING_SNAKE_CASE when representing states (e.g., `'WEAK_POINT_INJECTION'`, `'INTERLEAVE_CROSS_SUBJECT'`)
- Subject names: PascalCase (e.g., 'History', 'Biology', 'Maths', 'Chemistry', 'Sociology')
- Topic/skill identifiers: snake_case or simple identifiers (e.g., `'germ_theory'`, `'fractions'`, `'cell_division'`)

## Code Style

**Formatting:**
- No dedicated Prettier config file; linting via ESLint handles style
- Import/export statements with clean grouping by category
- Lines typically kept under 100 characters for readability
- Consistent spacing with design tokens (via SPACING, MOTION, RADII constants)

**Linting:**
- ESLint with React and React Hooks plugins (`eslint.config.js`)
- Custom rule: `no-hardcoded-design-tokens` warns against hardcoded spacing/motion values
- Empty `catch {}` blocks intentionally allowed (silent storage failures are an established pattern)
- Unused variable warning with pattern `_` prefix ignored (e.g., `const _ = value`)
- No PropTypes required — all props used without type checking

**Ignores/Exemptions:**
- `react/no-unescaped-entities`: Off — natural-language educational text content doesn't need HTML entity escaping
- `react/prop-types`: Off — component props not type-checked via PropTypes
- `jsx-a11y/click-events-have-key-events`, `jsx-a11y/no-static-element-interactions`: Off — cinematic full-screen `onClick` divs are the primary interaction pattern, not buttons

## Import Organization

**Order:**
1. React imports (React, hooks like `useState`, `useEffect`)
2. Radix UI or third-party component imports
3. Internal feature/app imports (features, pages, layouts)
4. Internal component imports (from `src/components/`)
5. Constants imports (from `src/constants/`)
6. Utility/helper imports (from `src/lib/`, `src/data/`, etc.)
7. Type/data structure imports (if any)

**Example from `src/app/LegacyApp.jsx`:**
```javascript
import { useEffect, useRef, useState, lazy, Suspense } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import { getProgress, recordActivity, getModuleState as safeGetModuleState } from '../progress.js'
import { buildChapterCompletePayload, prepareModuleScreenState, resolveTaskDestination } from './moduleNavigation.js'
import TestTab, { readQfBest } from '../features/quickfire/QuickFire.jsx'
import Home from '../features/home/Home.jsx'
// ... then lazy imports
const ModulePlayer = lazy(() => import('../components/layout/ModulePlayer.jsx'))
```

**Path Aliases:**
- Relative imports use `./` and `../` throughout
- No path aliases configured (no `@/`, `~`, etc.)

**Constants Module Imports:**
- Always import from canonical locations: `src/constants/{domain}.js`
- Common pattern: `import { SPACING } from '../../constants/spacing.js'`
- Never redefine locally; use spread syntax for multi-property objects (e.g., `...TYPE.hero`)

## Error Handling

**Patterns:**
- Empty `catch {}` blocks intentionally used for silent storage read/write failures (`src/lib/storage.js`)
  - Pattern: try `localStorage.getItem()` → catch silently and return fallback
  - Logged softly if critical: `console.warn('storage: failed to ...')`
- Try-catch in critical paths before external calls:
  - Example: `src/app/LegacyApp.jsx` wraps `getProgress()` in `safeGetProgress()` function
  - Prevents UI crashes from corrupted stored data
- Fallback values always provided:
  - Empty arrays: `return getArray(key)` defaults to `[]`
  - Empty objects: `return getObject(key)` defaults to `{}`
  - Defensive merges: `{ ...defaultStructure, ...read(KEY) }`

**Storage Layer Protection:**
- Central boundary file: `src/lib/storage.js`
- Only approved files access localStorage directly (enforced by architecture test)
- All reads/writes wrapped in try-catch
- Warnings logged on failure but never throw to UI

**User-Facing Errors:**
- No errors surfaced to user in normal operation
- Silent degradation: missing data → fallback structure used
- Logging via `console.warn()` for debugging

## Logging

**Framework:** Console (no external logging service)

**Patterns:**
- Informational logs via `console.warn()` for recoverable issues
- Example: `console.warn('storage: failed to write "key"')`
- No `console.log()` in production code (use only during debugging)
- Debug statements removed before commit

**When to Log:**
- Storage failures (catchable but notable)
- Feature flag boundaries (when testing different modes)
- Development warnings from ESLint config

## Comments

**When to Comment:**
- Architectural decisions (why the codebase is structured this way)
- Non-obvious algorithms or complex logic
- Boundary explanations (e.g., "empty catch blocks are intentional")
- Section headers using separator lines: `// ─── Section Name ────────────────`

**JSDoc/TSDoc:**
- Minimal use; no enforced convention
- Found in pure functions with complex signatures:
  - Example in `src/unifiedWeaknessTracker.js`: documents `logWrongAnswer()` with param object shape
- Format: `@param`, `@returns` tags where helpful

**Example Header Comment:**
```javascript
// ─── AnswerInteraction v1 — LOCKED COMPONENT ────────────────────────────────
// Reusable answer submission and feedback component for all non-timed learning activities.
// Supports: MCQ, short/long free text, fill-in-the-blanks, connection questions.
// Owns: input/options, submission, attempt count, checking state, hint display.
// Does not own: question title, module toolbar, progress header, navigation.
```

## Function Design

**Size:**
- Component functions: typically 50–150 lines (some reach 200+ for complex orchestration)
- Pure helper functions: aim for <50 lines where possible
- Exception: `dailyPlanner.js` contains complex multi-step functions up to 100+ lines justified by logical cohesion

**Parameters:**
- React components: destructure props (e.g., `{ block, onAnswered, onComplete, subject, mode = 'learning' }`)
- Utility functions: accept objects when >3 params needed (e.g., `createOrUpdateWeakPoint(state, result)`)
- Default parameters used for optional values (e.g., `subject = 'Biology'`)

**Return Values:**
- Components: always return JSX or null
- Utilities: return new objects/arrays (immutable), never mutate inputs
- Queries return data; state mutations return new state
- Example: `const newState = applyPulseResultToLearningState(state, result)`

## Module Design

**Exports:**
- Default export for single primary component:
  ```javascript
  export default function CinematicCarousel({ block, subject, onContinue }) { ... }
  ```
- Named exports for utilities:
  ```javascript
  export function buildWeekdayBlocks(...) { ... }
  export function buildSaturdayBlocks(...) { ... }
  export const PULSE_DURATIONS = [...]
  ```

**Barrel Files:**
- Not used; each module explicitly imports what it needs
- `src/modules.js` holds only metadata; full content in `src/modules/<subject>.js`
- `src/App.jsx` minimal wrapper; main app in `src/app/LegacyApp.jsx`

**Module Organization:**
- One component per file (rare exceptions for nested inline components)
- Utilities grouped by domain in single files
- Data files named by subject (`history.js`, `biology.js`, `maths.js`, etc.)
- Constants files by domain (`spacing.js`, `motion.js`, `buttons.js`, `subjects.js`, `typography.js`, `radii.js`)

## Design Tokens & Constants

**Never hardcode:**
- Spacing values (use `SPACING` from `src/constants/spacing.js`)
- Animation durations (use `MOTION` from `src/constants/motion.js`)
- Button dimensions (use `BUTTONS` from `src/constants/buttons.js`)
- Typography scales (use `TYPE` from `src/constants/typography.js`)
- Corner radii (use `RADII` from `src/constants/radii.js`)
- Subject colours (import `SUBJECTS` or `SUBJECT_ACCENTS` from `src/constants/subjects.js`)

**Custom rule enforcement:**
- ESLint rule `custom-rules/no-hardcoded-design-tokens` warns when magic numbers appear in style contexts
- Refactor violations into token usage

## Async & Promises

**Pattern:**
- React state updates for async operations:
  ```javascript
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    // dynamic import on mount
  }, [])
  ```
- Dynamic imports wrapped in lazy + Suspense:
  ```javascript
  const ModulePlayer = lazy(() => import('../components/layout/ModulePlayer.jsx'))
  <Suspense fallback={<ModuleLoadingScreen />}>
    <ModulePlayer />
  </Suspense>
  ```
- No explicit Promise chaining; hooks handle async lifecycle

---

*Convention analysis: 2026-06-22*
