# Testing Patterns

**Analysis Date:** 2026-07-09

## Test Framework

**Runner:**
- Vitest 4.1.7
- Config: `vitest.config.js` (merged with `vite.config.js`)
- Multiple test projects (separated by environment and purpose)

**Assertion Library:**
- Vitest's built-in `expect()` API (compatible with Jest)

**Run Commands:** (pnpm is the package manager — see `package.json`
`"packageManager"` + `pnpm-lock.yaml`)
```bash
pnpm test                  # Run all tests (architecture + unit + storybook), watch mode
pnpm test:architecture     # Run architecture tests only
pnpm test:unit             # Run unit tests only
pnpm test:storybook        # Run Storybook/browser (Playwright) tests only
pnpm test:rules            # Run Firestore security-rule tests (needs the emulator; separate from `verify`)
pnpm lint                  # Run ESLint
pnpm verify                # lint + test:architecture + test:unit + test:storybook + build — the authoritative local gate; see DEVELOPMENT_WORKFLOW.md
```

## Test Projects

Vitest is configured with three independent test projects in `vitest.config.js`:

### 1. Architecture Tests
- **Directory:** `tests/architecture/`
- **Environment:** Node (no DOM)
- **Purpose:** Verify codebase structure, learning graph integrity, module purity
- **Examples:**
  - `learning-graph.test.js` — concept registry, tag validation, circular import detection
  - `placeholder-module-safety.test.js` — guard clauses for unimplemented modules
  - `content-support-episode01.test.js` — content model validation

### 2. Unit Tests
- **Directory:** `tests/unit/`
- **Environment:** Node (no DOM)
- **Purpose:** Logic unit tests with mocked dependencies
- **Examples:**
  - `tests/unit/planner/dailyPlanner.test.js` — 1100+ lines, comprehensive test suite
  - `tests/unit/auth/authService.test.js` — Firebase mocking, localStorage stubbing
  - `tests/unit/quickfire/masteryRecorder.test.js` — learning state mutations

### 3. Storybook Tests
- **Directory:** Storybook story files (`.stories.jsx`)
- **Environment:** Browser (Chromium via Playwright)
- **Purpose:** Visual regression and interaction testing via Storybook addon
- **Framework:** `@storybook/addon-vitest` with `@vitest/browser-playwright`
- **Command:** `pnpm test:storybook` — runs all `.stories.jsx` files as browser tests

### 4. Firestore Security-Rule Tests
- **Directory:** `tests/rules/`
- **Environment:** Node, against the Firebase Firestore emulator
- **Purpose:** Prove `firestore.rules` enforces account isolation
  independently of the client (owner read/write, cross-learner denial,
  payload-spoofing rejection, deny-by-default)
- **Command:** `pnpm test:rules` — wraps `vitest run --config
  vitest.rules.config.js` in `firebase emulators:exec`; a `demo-`-prefixed
  project id, so it never touches live Firebase and needs no production
  credentials. Kept out of `pnpm verify` (needs Java + the emulator), but
  runs as its own CI job on every push/PR. See `docs/system/AUTH_SETUP.md`.

## Test File Organization

**Location:**
- Unit tests: `tests/unit/<feature>/<name>.test.js` mirrors `src/<feature>/<name>.js`
- Architecture tests: `tests/architecture/<check>.test.js`
- Component stories: `src/components/<path>/<ComponentName>.stories.jsx` (co-located with component)

**Naming:**
- Test files: `<functionality>.test.js` (e.g., `dailyPlanner.test.js`, `authService.test.js`)
- Test suites: `describe('<feature description>', () => { ... })`
- Test cases: `it('<assertion>', () => { ... })`
- Story files: `<ComponentName>.stories.jsx` (same stem as component)

**Structure:**
```
tests/
├── architecture/
│   ├── learning-graph.test.js
│   ├── placeholder-module-safety.test.js
│   └── content-support-episode01.test.js
└── unit/
    ├── planner/
    │   └── dailyPlanner.test.js
    ├── auth/
    │   ├── authService.test.js
    │   ├── progressStatus.test.js
    │   └── authServiceDisabled.test.js
    ├── quickfire/
    │   ├── masteryRecorder.test.js
    │   ├── questionId.test.js
    │   └── quickFireSelector.test.js
    └── [other features]/
```

## Test Structure

**Suite Organization:**
```javascript
// 1. Imports (test utils + application code)
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { functionUnderTest } from '../../src/module.js'

// 2. Mock declarations (before dynamic imports)
vi.mock('../../../src/lib/storage.js', () => ({
  getArray: vi.fn(() => []),
  setJson: vi.fn(),
}))

// 3. Dynamic import of code that depends on mocks
const { getProgress, recordScore } = await import('../../../src/progress.js')

// 4. Fixtures & helpers
const emptyState = { scores: [], wrongAnswers: [], ... }
function makeWeakPoint(overrides = {}) { ... }

// 5. beforeEach setup
beforeEach(() => {
  vi.clearAllMocks()
})

// 6. Test suites, organized by concern
describe('getProgress', () => {
  it('returns default state when no data exists', () => {
    expect(getProgress()).toEqual(emptyState)
  })

  it('merges stored data with defaults', () => {
    mockGetObject.mockReturnValue({ streak: 5 })
    expect(getProgress().streak).toBe(5)
  })
})
```

**Patterns:**

### Setup Pattern
```javascript
beforeEach(() => {
  vi.clearAllMocks()  // Reset mock call counts
})
```

### Teardown Pattern
None explicitly used; `beforeEach` cleanup is sufficient. Mocks are automatically cleared between tests.

### Assertion Pattern
```javascript
// Basic assertions
expect(value).toBe(expectedValue)
expect(array).toHaveLength(3)
expect(object).toEqual({ key: 'value' })
expect(array).toContain('item')

// Grouped assertions
expect(blocks.map(b => b.type)).toEqual(['pulse', 'mainProgress', 'weakRepair', 'examMove'])
expect(blocks.map(b => b.duration)).toEqual([8, 27, 12, 13])

// Negative assertions
expect(value).not.toBe(other)
expect(array).not.toContain('item')

// Custom error messages
expect(dupes, 'duplicate concept ids found').toEqual([])
```

## Mocking

**Framework:** Vitest's `vi` API (Jest-compatible)

**Module Mocking:**
```javascript
// Mock a module before import
vi.mock('../../../src/lib/storage.js', () => ({
  getArray: vi.fn(() => []),
  getObject: vi.fn(() => ({})),
  getJson: vi.fn((key, fallback) => fallback),
  setJson: vi.fn(),
  removeKey: vi.fn(),
}))

// Then dynamically import the module using the mocks
const { getProgress, recordScore } = await import('../../../src/progress.js')
```

**Environment Stubbing:**
```javascript
// Stub environment variables for test
vi.stubEnv('VITE_FIREBASE_API_KEY', 'test-key')
vi.stubEnv('VITE_FIREBASE_AUTH_DOMAIN', 'test.firebaseapp.com')
```

**DOM Mocks:**
```javascript
// Stub localStorage (Node environment has no localStorage)
function installLocalStorageStub() {
  const store = {}
  globalThis.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v) },
    removeItem: (k) => { delete store[k] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
  }
  return store
}

// Use in test
beforeEach(() => {
  installLocalStorageStub()
})
```

**Function Mocks:**
```javascript
// Create a mock function
const mockFn = vi.fn()

// Mock with return value
const mockGetArray = vi.fn(() => [])

// Mock with implementation
const mockFn = vi.fn((x) => x * 2)

// Assert mock was called
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith(expectedArg)
expect(mockFn).toHaveBeenCalledTimes(3)

// Clear mock state
vi.clearAllMocks()
```

**What to Mock:**
- Mutable module state (localStorage via `src/lib/storage.js`)
- External dependencies (Firebase in `src/auth/firebaseClient.js`)
- Dates/timers (where relevant)
- Do NOT mock pure functions being tested
- Do NOT mock test helpers/fixtures

**What NOT to Mock:**
- Pure logic functions being tested (e.g., `selectMainSubject`, `buildDailyPlan`)
- Constants and registries (e.g., `MODULES`, `CONCEPTS`)
- Helper functions that are simple wrappers

## Fixtures and Factories

**Test Data:**
```javascript
// Inline constant fixture (for small, single-use data)
const MONDAY = new Date('2026-06-22')

// Factory function (for reusable, customizable data)
function makeWeakPoint(overrides = {}) {
  return {
    weakPointId: 'test_wp_1',
    subject: 'History',
    topic: 'germ_theory',
    severity: 'medium',
    status: 'new',
    ...overrides,  // Allow caller to override any field
  }
}

// Empty state fixture (baseline for mutations)
const emptyState = {
  scores: [],
  wrongAnswers: [],
  correctAnswers: [],
  weakPoints: [],
}

// Usage in test
const state = { ...emptyState, wrongAnswers: [{ ... }] }
const wp = makeWeakPoint({ subject: 'Biology', timesFailed: 5 })
```

**Location:**
- Fixtures defined at top of test file after imports
- Factories defined before `describe()` blocks
- No separate fixtures directory; keep fixtures with tests they support

## Coverage

**Requirements:** No explicit coverage thresholds enforced

**View Coverage:**
```bash
npm run test -- --coverage
```

**Coverage Tool:** `@vitest/coverage-v8`

**Current Status:** 
- Architecture tests: ~30 assertions covering critical codebase patterns
- Unit tests: ~1000+ assertions covering pure logic functions
- Browser tests: Storybook stories (interaction validation only, not coverage metrics)
- No minimum coverage threshold; focus on testing critical logic (planner, weakness tracking, learning graph)

## Test Types

**Unit Tests:**
- **Scope:** Pure functions with mocked dependencies
- **Approach:** Test input → output transformations
- **Examples:**
  - `buildDailyPlan()`: Given profile + state + date, verify block structure and duration math
  - `selectMainSubject()`: Given selected subjects + history, verify rotation logic
  - `getImprovements()`: Given score array, verify week-over-week calculation
- **Strategy:** Comprehensive happy path + edge cases (boundary conditions, empty state, missing data)

**Architecture Tests:**
- **Scope:** Codebase structure, module constraints, cross-cutting invariants
- **Approach:** Read source files and validate patterns
- **Examples:**
  - Learning graph purity: verify no React imports in `src/data/learningGraph/`
  - Concept registry uniqueness: verify all concept IDs are unique
  - Module safety: verify placeholder modules have guards before opening
- **Strategy:** Static analysis (regex, file I/O), no runtime execution

**Browser Tests (Storybook):**
- **Scope:** Component interaction and visual validation
- **Approach:** Playwright + Storybook addon; stories run as tests
- **Framework:** `@storybook/addon-vitest` with `@vitest/browser-playwright`
- **Strategy:** Stories provide render trees; addon runs stories in browser and verifies they render without error

## Common Patterns

**Async Testing:**
```javascript
// For async functions
it('returns a user profile from Firebase', async () => {
  const profile = await signInWithGoogle()
  expect(profile).toEqual(mockAuthUser)
})

// Wait for state updates (rarely needed; test logic, not timing)
it('shows error after 2 failed attempts', () => {
  choose(0)  // wrong answer
  expect(showHint).toBe(true)
  choose(1)  // still wrong
  expect(isComplete).toBe(true)
})
```

**Error Testing:**
```javascript
// For functions that return fallback on error
it('returns default state when storage read fails', () => {
  mockGetObject.mockImplementation(() => {
    throw new Error('Storage quota exceeded')
  })
  expect(getProgress()).toEqual(emptyState)
})

// For validation/guards
it('does not record score with invalid subject', () => {
  recordScore({ subject: null, earned: 1, possible: 1 })
  expect(mockSetJson).not.toHaveBeenCalled()
})
```

**Parameterized Testing:**
```javascript
// Test multiple inputs with same assertion
const days = [MONDAY, TUESDAY, WEDNESDAY, FRIDAY, SATURDAY, SUNDAY]
days.forEach(d => {
  expect(getPlanningMode(d, {})).not.toBe('weekend')
})

// Or using table-driven approach
[
  { input: MONDAY, expected: 'weekday' },
  { input: TUESDAY, expected: 'weekday' },
  { input: SATURDAY, expected: 'saturday' },
].forEach(({ input, expected }) => {
  it(`returns "${expected}" for ${input}`, () => {
    expect(getPlanningMode(input, {})).toBe(expected)
  })
})
```

**Mutation Testing:**
```javascript
// Verify side effects when function modifies shared state
const state = { ...emptyState, weakPoints: [] }
const newState = applyPulseResultToLearningState(state, result)
expect(newState.weakPoints).toHaveLength(1)
expect(newState.weakPoints[0].topic).toBe('germ_theory')

// Verify original state is not mutated (functional approach)
it('does not mutate the input state', () => {
  const original = { ...emptyState }
  const newState = applyPulseResultToLearningState(emptyState, result)
  expect(emptyState).toEqual(original)
  expect(newState).not.toBe(emptyState)
})
```

**Property Testing:**
```javascript
// Verify mathematical properties hold across ranges
it('durations sum to 60 for weekday blocks', () => {
  const blocks = buildWeekdayBlocks('History', 'Biology', emptyState, defaultProfile)
  const total = blocks.reduce((sum, b) => sum + b.duration, 0)
  expect(total).toBe(60)
})

// Verify set membership
it('weekday plan only uses subjects from selectedSubjects', () => {
  const profile = { ...defaultProfile, selectedSubjects: ['History', 'Biology'] }
  const plan = buildDailyPlan(profile, emptyState, MONDAY)
  const usedSubjects = new Set(plan.blocks.map(b => b.subject))
  usedSubjects.forEach(s => {
    expect(['History', 'Biology']).toContain(s)
  })
})
```

## Best Practices

**Do:**
- ✓ Test behavior, not implementation
- ✓ Use descriptive test names that read as sentences
- ✓ Keep tests small and focused (one assertion per test is ideal; 2–3 is OK)
- ✓ Use factory functions for reusable test data
- ✓ Mock external dependencies (storage, Firebase)
- ✓ Test edge cases (empty state, boundary values, off-by-one)
- ✓ Clean up mocks in `beforeEach()`

**Don't:**
- ✗ Test implementation details (how function works internally)
- ✗ Use hardcoded magic numbers without context
- ✗ Create snapshots of complex objects (no snapshot tests in use)
- ✗ Test private/internal functions directly
- ✗ Mock everything (mock only external dependencies, not pure functions)
- ✗ Skip async/await; properly await async operations
- ✗ Leave test data files across test runs; use `beforeEach` cleanup

## Storybook Stories

**File Pattern:**
- Stories are `.stories.jsx` files placed alongside components
- Example: `src/components/learning/QuoteAnalyser.jsx` → `src/components/learning/QuoteAnalyser.stories.jsx`

**Story Structure:**
```javascript
// Default export: component metadata
export default {
  component: QuoteAnalyser,
  tags: ['ai-generated'],  // Optional: tag stories for filtering
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
}

// Named exports: story variants
export const MacbethQuote = {
  args: {
    block: MACBETH_BLOCK,
    subject: 'English',
    onContinue: () => console.log('continue'),
  },
}

export const ShakespeareQuote = {
  args: { ... },
}
```

**Story Naming:**
- Export name uses PascalCase (e.g., `MacbethQuote`, `DefaultBehavior`)
- Multiple variants per component allowed

## Running Tests During Development

```bash
# Run all tests once (architecture + unit + storybook)
pnpm test -- run

# Run architecture / unit / storybook tests only
pnpm test:architecture
pnpm test:unit
pnpm test:storybook

# Run specific test file
pnpm test -- run tests/unit/planner/dailyPlanner.test.js

# Watch mode (re-run on file change) — the default for `pnpm test`
pnpm test

# Debug a single test
pnpm test -- run --inspect-brk tests/unit/auth/authService.test.js

# Generate coverage report
pnpm test -- run --coverage
```

---

## Added 2026-07-10 — reliability & journey coverage

New tests protecting learner-trust seams:

- `tests/unit/storage/storage.test.js` — malformed-JSON fallback, quota-error
  visibility, and failed-write results for the `src/lib/storage.js` boundary.
- `tests/architecture/recovery-routing-integrity.test.js` — every
  `TAG_MODULE_MAP` target is a real, available module; mapped screen indices are
  in range and exact (the landed screen actually carries the tag); null targets
  are intentional.
- `tests/architecture/module-availability.test.js` — availability derivation +
  override, available-modules-have-content, no dangling `MODULE_GROUP` ids, and
  recovery never targeting a non-available module.
- `tests/unit/journeys/learnerJourneys.test.js` — four end-to-end learner
  journeys (progress survives refresh, weakness repair routing, chapter
  completion, cloud-restore reconciliation) exercised through the real logic
  modules and storage boundary.

---

*Testing analysis: 2026-07-09; coverage update: 2026-07-10; verification
debt cleanup: 2026-07-11 — `tests/architecture/concept-reveal-contract.test.js`
(7 cases) passes; repo-wide lint is at 0 errors; `pnpm verify` is the
authoritative local gate; Firestore rules run in CI.*
