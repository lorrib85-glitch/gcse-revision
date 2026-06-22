# Testing Patterns

**Analysis Date:** 2026-06-22

## Test Framework

**Runner:**
- Vitest `^4.1.7`
- Config: `vitest.config.js` (merges with `vite.config.js`)

**Assertion Library:**
- Vitest built-in assertions (expect API)

**Run Commands:**
```bash
pnpm test                     # Run all test projects (unit, architecture, storybook)
pnpm test:architecture        # Run architecture tests only (via vitest run tests/architecture)
pnpm test -- tests/unit       # Run unit tests only
pnpm vitest                   # Interactive watch mode
pnpm vitest -- --ui           # Browser-based test UI
```

**Browser Testing:**
- Playwright provider for Storybook test integration (`@vitest/browser-playwright`)
- Headless Chromium execution
- Special handling for cloud sandboxes with pre-installed Chromium (see `vitest.config.js` lines 17–20)

## Test File Organization

**Location:**
- Architecture tests: `tests/architecture/`
- Unit tests: `tests/unit/`
- Storybook stories: co-located with components (`.stories.jsx` pattern referenced in `.storybook/main.js`)

**Naming:**
- Test files: `{name}.test.js` (e.g., `dailyPlanner.test.js`, `app-boundaries.test.js`)
- Storybook stories: `{component}.stories.jsx`

**Structure:**
```
tests/
├── architecture/
│   ├── app-boundaries.test.js
│   ├── module-metadata-integrity.test.js
│   ├── placeholder-module-safety.test.js
│   └── storage-boundary.test.js
└── unit/
    └── planner/
        └── dailyPlanner.test.js
```

## Test Structure

**Suite Organization:**
```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Setup mocks and fixtures BEFORE any imports that depend on them
const mockSetJson = vi.fn()
const mockGetArray = vi.fn(() => [])

vi.mock('../../../src/lib/storage.js', () => ({
  getArray: mockGetArray,
  getObject: mockGetObject,
  setJson: mockSetJson,
  removeKey: vi.fn(),
}))

// Import dependencies after mocks declared
const { buildWeekdayBlocks, buildDailyPlan } = await import('../../../src/features/planner/dailyPlanner.js')

// Fixtures at module level
const MONDAY = new Date('2026-06-22')

const emptyState = {
  scores: [],
  wrongAnswers: [],
  correctAnswers: [],
  moduleStates: {},
  rotationHistory: {},
  progress: {},
  weakPoints: [],
}

function makeWeakPoint(overrides = {}) {
  return {
    weakPointId: 'test_wp_1',
    subject: 'History',
    topic: 'germ_theory',
    // ... defaults
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

// Test suites organized by feature/function
describe('getPlanningMode', () => {
  it('returns "weekday" on Monday', () => {
    expect(getPlanningMode(MONDAY, {})).toBe('weekday')
  })

  it('returns "saturday" on Saturday', () => {
    expect(getPlanningMode(SATURDAY, {})).toBe('saturday')
  })
})
```

**Key Patterns:**
1. Mocks declared at top-level before imports (forces Vitest hoisting)
2. Dynamic imports used after mock setup: `const { fn } = await import('...')`
3. Fixtures as reusable factory functions (e.g., `makeWeakPoint()`)
4. `beforeEach(() => vi.clearAllMocks())` ensures clean state between tests
5. Descriptive test names using `it()` with complete statements (not abbreviations)

## Mocking

**Framework:** Vitest's built-in `vi` mock utilities

**Patterns:**

Storage mocking (most common):
```javascript
const mockSetJson = vi.fn()
const mockGetArray = vi.fn(() => [])
const mockGetObject = vi.fn(() => ({}))

vi.mock('../../../src/lib/storage.js', () => ({
  getArray: mockGetArray,
  getObject: mockGetObject,
  setJson: mockSetJson,
  removeKey: vi.fn(),
}))
```

Function mocking within a module:
```javascript
const mock = vi.fn(() => expectedValue)
// Use mock() in test, assert mock.toHaveBeenCalled(), mock.toHaveBeenCalledWith(args)
```

**What to Mock:**
- External I/O boundaries (`localStorage`, API calls, filesystem reads)
- Date-dependent functions (mock `Date` if testing time-sensitive logic)
- Complex dependencies if testing in isolation (e.g., mock a calculation function to test dependent logic)

**What NOT to Mock:**
- Pure functions (directly test with real inputs)
- State transformations (use real data structures, test the transformation logic)
- Core business logic (test integration, not mocks)
- Design/presentation (Storybook tests handle visual verification)

Example: `dailyPlanner.test.js` mocks `storage.js` but does NOT mock:
- Date objects used as test fixtures (they're data, not behavior)
- Weak point creation logic (core business logic tested directly)
- Subject selection (interleaving logic tested with real state)

## Fixtures and Factories

**Test Data:**

Fixtures are immutable base structures with factory functions for variation:

```javascript
const emptyState = {
  scores: [],
  wrongAnswers: [],
  correctAnswers: [],
  moduleStates: {},
  rotationHistory: {},
  progress: {},
  weakPoints: [],
}

const defaultProfile = {
  selectedSubjects: ['History', 'Biology', 'Sociology'],
  weekdayMinutes: 60,
  saturdayMinutes: 90,
  sundayMinutes: 60,
  name: 'Test User',
}

function makeWeakPoint(overrides = {}) {
  return {
    weakPointId: 'test_wp_1',
    subject: 'History',
    topic: 'germ_theory',
    skillTag: null,
    misconceptionTag: null,
    errorType: null,
    severity: 'medium',
    firstSeenAt: '2026-06-15',
    lastSeenAt: '2026-06-20',
    timesFailed: 3,
    timesCorrectAfter: 0,
    status: 'new',
    nextReviewAt: '2026-06-21',
    ...overrides,
  }
}

// Usage in test:
const state = { ...emptyState, weakPoints: [makeWeakPoint({ topic: 'algebra' })] }
```

**Location:**
- Fixtures defined at top of test file alongside imports (module scope)
- Reusable across multiple test suites within same file

**Date Fixtures:**
```javascript
const MONDAY    = new Date('2026-06-22')  // day 1 of week
const TUESDAY   = new Date('2026-06-23')  // day 2
const SATURDAY  = new Date('2026-06-20')  // day 6
const SUNDAY    = new Date('2026-06-21')  // day 0
```

## Coverage

**Requirements:** Not enforced (no coverage threshold configured)

**View Coverage:**
```bash
pnpm vitest -- --coverage
```

## Test Types

**Unit Tests:**
- Scope: Pure functions with no external dependencies
- Approach: Test input → output transformations
- Example: `tests/unit/planner/dailyPlanner.test.js` tests `buildWeekdayBlocks()`, `selectMainSubject()`, `calculatePaperMistakeSeverity()` with mocked storage
- Pattern: Given state + inputs → assert outputs match expected structure/values

**Architecture Tests:**
- Scope: Codebase boundaries and structural invariants (not business logic)
- Approach: File system inspection, static analysis, metadata verification
- Examples:
  - `app-boundaries.test.js`: Verifies `src/App.jsx` imports `./app/LegacyApp.jsx` and feature files exist
  - `storage-boundary.test.js`: Enforces only approved files access `localStorage` directly
  - `module-metadata-integrity.test.js`: Validates metadata in `src/modules.js` matches full content in `src/modules/<subject>.js`
  - `placeholder-module-safety.test.js`: Placeholder modules (screenCount === 0) cannot have been accidentally promoted

**Storybook Browser Tests:**
- Scope: Visual component rendering and interaction
- Approach: Playwright browser automation against Storybook stories
- Framework: `@storybook/addon-vitest` integration (runs stories as vitest browser tests)
- Pattern: Vitest browser project executes stories, assertion library in browser context
- Coverage: Accessibility checks via `@storybook/addon-a11y`, visual regression via Chromatic

**E2E Tests:**
- Framework: None configured (full app integration tested manually via `pnpm dev`)

## Common Patterns

**Async Testing:**
```javascript
// Vitest supports async test functions directly
it('async function returns expected value', async () => {
  const result = await someAsyncFunction()
  expect(result).toBe('expected')
})

// Dynamic imports (common in this codebase):
const { buildDailyPlan } = await import('../../../src/features/planner/dailyPlanner.js')
// Import after mocks are hoisted to ensure mock is used, not real module
```

**Error Testing:**
```javascript
// Testing that errors are caught and handled gracefully
it('storage read failure returns fallback', () => {
  const mockGetObject = vi.fn(() => { throw new Error('storage') })
  vi.mock('...', () => ({ getObject: mockGetObject }))
  
  // In the tested module, try-catch returns fallback
  const result = safeGetProgress()
  expect(result).toEqual({ streak: 0, topicProgress: {} })
})
```

**State Immutability Testing:**
```javascript
it('does not mutate input state', () => {
  const original = { ...emptyState }
  const newState = applyPulseResultToLearningState(original, result)
  
  // Original unchanged
  expect(original).toEqual(emptyState)
  // New state has the change
  expect(newState.weakPoints.length).toBeGreaterThan(original.weakPoints.length)
})
```

**Storage Side Effect Testing:**
```javascript
it('DOES call setJson when options.persistRotation is true', () => {
  buildDailyPlan(defaultProfile, emptyState, MONDAY, { persistRotation: true })
  expect(mockSetJson).toHaveBeenCalled()
})

it('does NOT call setJson when options.persistRotation is absent', () => {
  buildDailyPlan(defaultProfile, emptyState, MONDAY)
  expect(mockSetJson).not.toHaveBeenCalled()
})
```

**Boundary/Constraint Testing:**
```javascript
it('durations sum to 60', () => {
  const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
  const total = blocks.reduce((sum, b) => sum + b.duration, 0)
  expect(total).toBe(60)
})

it('unselected subjects never appear in generated plans', () => {
  const profile = { ...defaultProfile, selectedSubjects: ['History', 'Sociology'] }
  const plan = buildDailyPlan(profile, emptyState, MONDAY)
  const forbidden = ['Biology', 'Maths', 'Chemistry']
  plan.blocks.forEach(b => {
    expect(forbidden).not.toContain(b.subject)
  })
})
```

## Test Organization by Scale

### Architecture Tests (Lightweight)
- Files: `tests/architecture/*.test.js` — run via `pnpm test:architecture`
- Run in Node environment (no browser)
- Fast (~<100ms each)
- Verify codebase structure, not behavior

### Unit Tests (Medium)
- Files: `tests/unit/**/*.test.js`
- Pure functions tested in Node environment
- Mocks for I/O boundaries (storage, dates)
- Slower than architecture (~100-500ms per suite)
- Example: `dailyPlanner.test.js` has 1106 lines, 100+ individual tests

### Browser/Storybook Tests (Heavyweight)
- Stories run in Playwright Chromium
- Slowest (~5-20 seconds per story)
- Integration with visual/accessibility checks
- Run on demand (included in `pnpm test` but optional in workflow)

## Key Files

**Test Configuration:**
- `vitest.config.js`: Three test projects (architecture, unit, storybook)
- `.storybook/main.js`: Storybook addon registration
- `.storybook/preview.jsx`: Story runtime setup

**Test Utilities:**
- No shared test utilities/helpers file (each test file self-contained)
- Fixtures and factories defined per test file

**Coverage Gaps:**
- No tests for React components (only Storybook stories)
- No tests for UI interactions beyond Storybook
- No API integration tests
- No end-to-end browser automation tests beyond Storybook

---

*Testing analysis: 2026-06-22*
