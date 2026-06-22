# Codebase Concerns

**Analysis Date:** 2026-06-22

## Tech Debt

### Module Content Split — Incomplete Refactoring
**Issue:** Module content is split between `src/modules.js` (lightweight metadata only) and `src/modules/<subject>.js` (full content lazy-loaded). This is correct, but the split is incomplete and creates maintenance burden.

**Files:** 
- `src/modules.js` (894 lines)
- `src/modules/history.js` (7318 lines — largest file in codebase)
- `src/modules/biology.js` (1264 lines)
- `src/modules/sociology.js` (3722 lines)
- `src/modules/maths.js` (867 lines)
- `src/modules/chemistry.js` (module size not checked but follows pattern)

**Impact:** 
- `history.js` is a code smell — 7318 lines is unmaintainable as a single file
- Difficult to locate specific screen definitions or modules within History
- Editing History content requires careful navigation through deep nesting
- No clear separation between module structure and screen definitions
- All History modules load as one atomic chunk when any History module opens

**Fix approach:** 
1. Split `src/modules/history.js` by era/series: `src/modules/history/medicine.js`, `src/modules/history/elizabethan.js`, `src/modules/history/usaConflict.js`, `src/modules/history/spainNewWorld.js`
2. Create index file `src/modules/history/index.js` that re-exports all eras
3. Update `SUBJECT_MODULE_LOADERS` in `src/app/LegacyApp.jsx` to import from index
4. Apply same pattern to `sociology.js` (3722 lines) if it grows further
5. Set file size limit of 2000 lines in ESLint or build config

---

### Direct localStorage Access Outside Persistence Layer
**Issue:** Multiple files directly access `localStorage` instead of using the centralized `src/lib/storage.js` abstraction layer.

**Files with direct localStorage access:**
- `src/components/layout/ModulePlayer.jsx` — lines 101–106 (`getModuleState`, `saveModuleState`)
- `src/auth/authService.js` — lines 18, 22, 26
- `src/features/quickfire/QuickFire.jsx` — multiple direct reads/writes
- `src/todaysPlan.js` — direct reads/writes

**Impact:** 
- Changes to persistence strategy (e.g., moving to IndexedDB or remote storage) require changes across 5+ files instead of centralizing to 1
- Inconsistent error handling — some calls use try/catch, others don't
- No audit trail for when/where data is being persisted
- LocalStorage quota exhaustion warnings get scattered across codebase
- Hard to implement features like data encryption or backup strategy

**Fix approach:** 
1. Create new methods in `src/lib/storage.js` for module-specific and quiz-specific keys (e.g., `getModuleState(moduleId)`, `setModuleState(moduleId, state)`)
2. Create auth-specific storage wrapper in `src/auth/storageService.js` (to keep auth concerns separate)
3. Update all direct `localStorage` calls to route through appropriate wrapper
4. Add ESLint rule to forbid direct `localStorage` access outside `lib/` directory

---

### Synchronous JSON Parsing Without Validation
**Issue:** JSON parsing in storage reads uses `JSON.parse()` without schema validation. Corrupted localStorage data silently falls back to defaults, potentially losing user progress.

**Files:** 
- `src/lib/storage.js` — lines 6–14 (getJson helper)
- Multiple callers: `src/progress.js`, `src/unifiedWeaknessTracker.js`, `src/features/planner/dailyPlanner.js`

**Impact:** 
- If localStorage gets corrupted (browser bug, storage quota exceeded, manual user edit), `catch` silently returns fallback
- User loses all progress, scores, weakness tracking, and module state without warning
- No way to distinguish between "never used app before" and "data was corrupted"
- Recovery quiz state loss could lead to unexpected redundant testing
- Weakness tracker corruption means personalization becomes generic

**Fix approach:** 
1. Add data validation schemas using simple schema library (zod, yup, or custom validator)
2. Log corrupted data to browser console (development) or error tracking service (production)
3. Show toast notification to user: "We couldn't load your saved progress — starting fresh"
4. Implement data versioning: tag each storage key with schema version, handle migrations on read
5. Example: `{ _version: 1, streak: 5, ... }` to enable future schema evolution

---

### Authentication — Placeholder Implementation
**Issue:** Login is mocked with a 700ms delay and generates fake UIDs. No real Firebase/OAuth integration exists. Production deployment will require replacing entire flow.

**Files:** 
- `src/auth/authService.js` — lines 11–15 (`signInWithGoogle`)
- `src/app/LegacyApp.jsx` — line 141 (TODO comment)

**Impact:** 
- All user data is stored locally only; no cloud backup, cross-device sync, or account recovery
- Authentication is fake; any production user will lose all data on browser clear or device change
- No way to verify user identity for support/disputes
- Offline-first app prevents multi-session consistency
- Migration to real auth later requires building user sync/merge logic

**Fix approach:** 
1. Implement Firebase Auth (or chosen provider) before production launch
2. Create migration strategy for existing localStorage user data
3. Build cloud sync layer that reconciles local and remote state on login
4. Implement account recovery flow: email verification, data restore
5. Add logout without data loss: persist to cloud before clearing local storage

---

### Data Persistence — Unbounded Growth
**Issue:** Multiple arrays in localStorage grow without bounds: wrong answers (capped at 500), correct answers (capped at 500), scores (capped at 200), but other arrays (question history, exam technique logs) have no limits.

**Files:** 
- `src/unifiedWeaknessTracker.js` — lines 58–59, 81 (caps at 500)
- `src/progress.js` — lines 85–88 (scores capped at 200)
- `src/features/quickfire/QuickFire.jsx` — question history stored with no apparent cap
- `src/features/planner/dailyPlanner.js` — rotation history retention is unclear

**Impact:** 
- Active learners over 1+ years could exhaust localStorage quota (~5–10MB on most browsers)
- Performance degrades as array lengths grow; filtering/sorting gets slower
- No clear policy for what's kept and what's deleted
- User data mysteriously vanishes when quota hit, with no recovery option

**Fix approach:** 
1. Add circular buffer wrapper to storage layer: `setJsonCapped(key, value, maxLength)`
2. Define retention policies per data type: wrong answers (500), scores (200), question history (100), technique logs (50)
3. Implement data archive strategy: move oldest entries to separate "archive_" key when cap hit, allow user to export/clear
4. Document size estimates: e.g., "500 wrong answers ≈ 200KB"
5. Monitor quota usage: add warning at 70% full, clear cache at 90%

---

## Known Bugs

### Test Data Context Timing Issue
**Issue:** `TestDataProvider` (used in Exam Mode) shows loading screen while dynamically importing question banks. If network is slow or browser is slow, the loading screen persists even if data is ready, creating false impression of stalling.

**Files:** 
- `src/features/quickfire/QuickFire.jsx` — lines 35–68 (`TestDataProvider`)
- `src/features/exams/ExamPractice.jsx` — wraps `TestTab` in provider

**Symptoms:** Exam Mode tab shows spinning logo for 1–5 seconds even on fast network; user might close app thinking it's broken

**Workaround:** None — user must wait

**Fix approach:** 
1. Add timeout: if data not ready in 3 seconds, show user a "Taking a moment..." message with manual retry button
2. Cache imports after first load: create `src/data/testDataCache.js` that keeps data in memory, only loads once per session
3. Preload question banks in background when app is idle (if user has previously opened Exam Mode)

---

### Module State Saved But Never Restored on Exit
**Issue:** When user closes a module and returns to Subjects tab, their current screen position is saved to localStorage (via `src/app/moduleNavigation.js`), but if they close the entire app and return days later, the module state is reset to screen 0.

**Files:** 
- `src/components/layout/ModulePlayer.jsx` — lines 101–106 (loads state, saves state)
- `src/app/LegacyApp.jsx` — doesn't restore saved state on module re-open

**Symptoms:** User completes 5 screens of a 15-screen module, leaves the app, returns next day, module shows screen 0 again (but progress bar shows they've completed some screens — conflicting UI)

**Impact:** Frustrates learners; they re-do content they've already learned, reducing efficiency

**Fix approach:** 
1. In `App.jsx`'s `openModulePlayer()`, after loading module content, call `getModuleState(mod.id)` and restore `screenIndex` if saved
2. Ensure `ModulePlayer` initializes to restored screen index, not always 0
3. Test: complete 3 screens, close app, reopen module — should resume at screen 3

---

### WeakSpot Recovery Triggered Multiple Times Per Topic
**Issue:** `WeakSpotRecovery` component is shown when learner fails a question, but if they get 2+ questions wrong on the same topic in one session, the component may trigger multiple times with different recovery quizzes, overwhelming the learner.

**Files:** 
- `src/components/learning/WeakSpotRecovery.jsx` (component triggered on wrong answer)
- `src/unifiedWeaknessTracker.js` (logs every wrong answer)

**Symptoms:** User gets Biology question wrong → sees recovery quiz → returns to test → gets another Biology question wrong → sees recovery quiz again → frustrated

**Impact:** Interrupts test flow; creates redundant recovery experiences; poor UX

**Fix approach:** 
1. Add "recent recovery" tracking: don't show recovery for a topic if one was shown in the last 24 hours
2. Batch multiple wrong answers in same session: show one recovery quiz covering all weak topics at end of session
3. Add "skip recovery" option: let advanced learners bypass recovery and continue testing

---

### dangerouslySetInnerHTML Content Not Sanitized
**Issue:** Block content from modules (read/keypoint/fun fact blocks) use `dangerouslySetInnerHTML` to render HTML-formatted text. If module content ever contains user-generated or untrusted content, XSS vulnerability exists.

**Files:** 
- `src/components/layout/ModulePlayer.jsx` — lines 122, 138 (ReadBlock, KeypointBlock)
- `src/features/quickfire/QuickFire.jsx` — line 2000+ (SVG rendering via `dangerouslySetInnerHTML`)

**Impact:** 
- Currently low risk because content is authored by curriculum team, not users
- If content pipeline ever accepts user input or third-party content, XSS attack surface opens
- SVG rendering via innerHTML could inject malicious scripts
- Future team might not realize the risk

**Fix approach:** 
1. For block content: create sanitization function using DOMPurify, sanitize on read if content source changes
2. For SVG: move away from `dangerouslySetInnerHTML` — render SVG as React component or `<img>` tag
3. Add ESLint rule warning on `dangerouslySetInnerHTML` usage; require security review before adding new uses
4. Document: "Only use dangerouslySetInnerHTML for trusted content authored by curriculum team"

---

## Security Considerations

### No API Request Authentication
**Issue:** All fetch requests to `/api/grade`, `/api/recall`, `/api/examiner`, etc. include no authentication headers. If backend is exposed to internet, anyone can call these endpoints.

**Files:** 
- `src/components/feedback/ExamQuestionFrame.jsx` — lines 81–90 (fetch to /api/grade)
- `src/components/learning/GuidedExamResponse.jsx` (similar pattern)
- `src/components/learning/FaceTheExaminer.jsx` (similar pattern)
- `src/components/learning/PriorKnowledgeRecall.jsx` (similar pattern)
- `src/features/quickfire/QuickFire.jsx` (similar pattern)

**Current mitigation:** API endpoints are presumably backend-only (not publicly routed)

**Recommendations:** 
1. Add JWT or session token to all API requests: `Authorization: Bearer {token}`
2. Token should be obtained during login/onboarding
3. Implement request signing if HMAC is preferred over JWT
4. Rate limit API endpoints to prevent abuse (e.g., 100 grading calls/min per session)
5. Log all API calls with timestamp, user ID, endpoint, for audit trail
6. Add CSRF token to POST requests if backend uses cookies

---

### localStorage Data Exposure on Shared Devices
**Issue:** All user data (progress, weakness tracking, confidence ratings, question history) is stored in plain-text localStorage. On a shared device or public computer, another user can open browser console and read all learner's progress and private data.

**Files:** All storage operations via `src/lib/storage.js` and direct localStorage access

**Current mitigation:** None

**Recommendations:** 
1. Add password-protected local "vault" for sensitive data (could be encrypted with user's password)
2. Implement session timeout: clear sensitive data from memory after 15 minutes of inactivity
3. Add "Clear on exit" option: automatically clear localStorage when app is closed (if supported by browser)
4. Never store exact answers or mark schemes in localStorage (only aggregate stats)
5. If deployed as progressive web app (PWA), use `sessionStorage` for temporary session data instead of `localStorage`

---

### No Input Validation on API Responses
**Issue:** API responses are consumed directly without validation. If backend is compromised or returns malformed data, frontend could crash or behave unexpectedly.

**Files:** 
- `src/components/feedback/ExamQuestionFrame.jsx` — lines 92–100 (trusts data shape)
- `src/components/learning/PriorKnowledgeRecall.jsx` (similar)
- `src/components/feedback/ExamRoundDebrief.jsx` (similar)

**Impact:** 
- Malformed response (e.g., `marksAwarded` is a string instead of number) could cause NaN bugs
- Missing fields silently default to undefined, breaking downstream logic
- Frontend could be exploited if backend code is compromised

**Fix approach:** 
1. Create response validator functions using schema validation library (zod, yup)
2. Define expected shapes: `GradeResponse`, `RecallAnalysisResponse`, `DebriefResponse`
3. Validate all API responses on receipt; throw error if shape mismatch
4. Log validation failures to error tracking service
5. Example: `const gradeResponse = GradeResponseSchema.parse(data)`

---

## Performance Bottlenecks

### Large Module Content File Blocks Rendering
**Issue:** When user opens a History module, the entire `src/modules/history.js` (7318 lines) must download and parse before `ModulePlayer` can render. On slow 3G networks, this could delay content display by 2–5 seconds.

**Files:** 
- `src/app/LegacyApp.jsx` — lines 82–88, 90–95 (loadModuleContent)
- `src/modules/history.js` (7318 lines)

**Current mitigation:** `ModuleLoadingScreen` shown while content loads

**Impact:** 
- Perceived app slowness on slow networks or older devices
- Battery drain on mobile from prolonged JavaScript parsing
- Some users may give up before module loads

**Fix approach:** (See Tech Debt section above for module split)

1. Split `history.js` into per-series files
2. Split `sociology.js` if it approaches 2000 lines
3. Implement dynamic code splitting: load only the currently-viewing era/topic, not entire subject
4. Add Service Worker caching so repeated opens are instant
5. Benchmark: measure parse time on mid-range Android device; target <1s load

---

### Weakness Tracker Filtering Is O(n) Per Query
**Issue:** `getWeakTopics()` in `src/unifiedWeaknessTracker.js` scans all wrong and correct answer arrays every time it's called. With 500 wrong answers + 500 correct answers, this is O(1000) per call.

**Files:** 
- `src/unifiedWeaknessTracker.js` — lines 90–130 (`getWeakTopics`)
- Called by: `ExamRoundDebrief.jsx`, `WeakSpotRecovery.jsx`, `dailyPlanner.js`

**Impact:** 
- Called multiple times during quiz feedback (O(n) * 3–5 calls = O(5n) per quiz round)
- After 1 year of daily use (250 quizzes * 5 calls = 1250 calls), cumulative time could be 2–5 seconds
- Noticeable UI lag when weak topics list is generated
- If weakness tracking is ever used for real-time suggestions, lag becomes user-facing

**Fix approach:** 
1. Cache weak topics list for 1 hour: build it once per session start, update only on new wrong answer
2. Use pre-computed index structure: maintain `topicCounts` and `correctCounts` in memory, update incrementally
3. Lazy-compute: only call `getWeakTopics()` when user explicitly opens "Weak Areas" page, not on every answer
4. Consider: if weakness tracking grows beyond 500 entries, move to IndexedDB for faster queries

---

### TestDataProvider Loads All Question Banks Regardless of Choice
**Issue:** `TestDataProvider` uses `Promise.all()` to load Maths, English, Sociology, Chemistry, and Coach question banks when Exam Mode tab opens, even if user only wants to do Maths practice.

**Files:** 
- `src/features/quickfire/QuickFire.jsx` — lines 38–59 (TestDataProvider)

**Impact:** 
- Wastes bandwidth loading unused question banks
- Increases chunk sizes: ~50KB additional for English/Sociology/Chemistry if only using Maths
- Slows down Exam Mode tab opening

**Fix approach:** 
1. Lazy-load question banks per subject: only import chosen subject's bank
2. Use a subject selector before loading: "Choose subject for this exam" → then load only that bank
3. Cache each bank separately: `mathsTopics: null`, `englishTopics: null` — only fetch on first access
4. Keep coach types loaded (they're small) since they're meta-subject

---

## Fragile Areas

### Module Navigation State Machine Is Not Formally Defined
**Issue:** Module progression (screen index, chapter completion, hook/outcome display) relies on informal state management. If state gets out of sync (screen index > screenCount, completed flag set but screens not done), recovery is unclear.

**Files:** 
- `src/components/layout/ModulePlayer.jsx` (2382 lines — orchestrates all navigation)
- `src/app/moduleNavigation.js` (state building)
- `src/progress.js` (module state reads/writes)

**Why fragile:** 
- Large file (2382 lines) makes it hard to trace state transitions
- No explicit state machine definition; logic is spread across event handlers
- Edge cases: what if user navigates to screen 50 when module only has 30 screens? What if completed=true but hookDone=false?
- Test coverage likely incomplete for edge cases

**Safe modification:** 
1. Define explicit state machine: `idle → hook → screens → outcome → complete`
2. Add state validation on load: ensure `screen <= screenCount`, `completed` implies `screen === screenCount`
3. Add error logging: if state is invalid, log it and reset to safe state (screen 0)
4. Extract navigation logic into pure functions testable outside React
5. Consider TypeScript for type safety on state shape

**Test coverage gaps:** 
- Manual testing: navigating forward/backward through all screen types
- Edge case: force screenIndex > screenCount, verify no crash
- Edge case: rapid back/forward navigation, verify state consistency
- Edge case: manually clear localStorage while module open, reopen module, verify graceful recovery

---

### Recovery Quiz Selection Has No Fallback
**Issue:** When weakness is detected, app looks up recovery quiz in `recoveryQuizzes.js` by ID. If quiz doesn't exist or ID is wrong, component gets `undefined` and likely crashes.

**Files:** 
- `src/components/learning/WeakSpotRecovery.jsx` (retrieves recovery quiz by ID)
- `src/data/recoveryQuizzes.js` (207 lines — recovery quiz definitions)

**Why fragile:** 
- No null check if quiz doesn't exist
- If new weakness tag is added but recovery quiz not created, app breaks
- Weakness tagger and quiz creator are separate systems; easy to get out of sync

**Safe modification:** 
1. Add recovery quiz existence check: `if (!quiz) return <GenericRecoveryFallback />`
2. Implement generic fallback: show 2–3 related questions from module content
3. Log missing quizzes to error tracking: "Requested recoveryQuizId 'xyz123' not found"
4. Add build-time validation: script that checks all logged weakness tags have corresponding recovery quizzes

**Test coverage gaps:** 
- Test: trigger weakness with no recovery quiz defined, verify graceful fallback
- Test: delete recovery quiz, open app, trigger that weakness, verify no crash

---

### AnswerInteraction Timeout-Based State Updates
**Issue:** `AnswerInteraction` uses `setTimeout()` to delay completion callbacks (lines 57–58, 67, etc). If user rapidly clicks back button or navigates away during timeout, callback fires in unmounted component.

**Files:** 
- `src/components/core/AnswerInteraction.jsx` — lines 57–58, 67 (setTimeout to onComplete)

**Why fragile:** 
- Component unmounts while setTimeout is pending → callback tries to `setState` in unmounted component (React warning)
- No cleanup: setTimeout never cancelled if component unmounts
- Race condition: if two questions are answered very quickly, timeouts may interleave

**Safe modification:** 
1. Store timeout IDs in useRef: `const timeoutId = useRef(null)`
2. Cancel on unmount: `useEffect(() => return () => clearTimeout(timeoutId.current), [])`
3. Or: use `useTransition` (React 18) instead of setTimeout for state updates
4. Add warning logging if callback fires on unmounted component

**Test coverage gaps:** 
- Test: answer question, immediately navigate away, verify no React warning
- Test: rapid-fire multiple questions, verify no state race conditions

---

### Quiz History Storage Has No Duplicate Protection
**Issue:** Quick Fire quiz results are stored in `QF_QUESTION_HISTORY_KEY` with automatic incremental saves. If user answers the same question twice in same session, both attempts are stored, potentially skewing statistics.

**Files:** 
- `src/features/quickfire/QuickFire.jsx` — question history tracking (line ~1000+)

**Why fragile:** 
- No check for duplicate question IDs in same session
- History could contain the same question 10+ times if user keeps retrying
- Weak topic calculations may over-weight repeated questions

**Safe modification:** 
1. Use Set of `questionId` to detect re-attempts in current session
2. On re-attempt, update existing entry instead of adding new one
3. Add validation when loading history: deduplicate by session + question ID

---

## Scaling Limits

### localStorage Quota — No Mitigation
**Issue:** Browser localStorage has a 5–10MB limit (varies by browser). Active learner with 2+ years of data could hit quota.

**Current capacity:** 
- 500 wrong answers × 400B each = 200KB
- 500 correct answers × 150B each = 75KB
- 200 scores × 100B each = 20KB
- Module states (30 modules × 200B) = 6KB
- Weakness tracking = 50KB (estimated)
- Question history = 100KB (estimated)
- **Total: ~450KB** — well under 5MB limit

**Scaling path:** 
- At current growth (~100KB/year), quota exhausted after ~10 years
- However, if question history isn't capped, could hit limit faster
- Mobile browsers (iOS Safari) have tighter quota (~5MB shared across all sites)

**Recommendations:** 
1. Implement hard cap on all history arrays (done for some, not others)
2. Archive old data: move >1 year old entries to separate "archive_" storage
3. Plan migration to IndexedDB (50MB–1GB) before quota becomes issue
4. Monitor quota usage: add telemetry to track % of storage used
5. Give user option to export/backup data before clearing

---

### Module Count Growing Without Bounds
**Issue:** `src/modules.js` imports `MODULES` array, which grows larger as more modules are added. Currently ~30 modules; at this scale, no problem. At 100+ modules, loading/parsing time could become significant.

**Current capacity:** 30 modules × ~30B metadata each = ~900B — negligible

**Scaling path:** 
- At 100 modules: ~3KB (no issue)
- At 500 modules: ~15KB (no issue)
- At 1000+ modules: consider lazy-loading module list or pagination
- But also: UI (Subjects browser) can only display ~20–30 modules per subject at once, so pagination needed before scaling to 500

**Recommendations:** 
1. Implement pagination/filtering in ModulesTab for browsing (when adding next 30 modules)
2. Lazy-load module metadata by subject/era to avoid parsing all at once
3. Use virtualization (react-window) for module lists if >100 modules in browser at once

---

### Daily Planner Calculation Complexity
**Issue:** `buildDailyPlan()` in `src/features/planner/dailyPlanner.js` runs every time Home/Pulse tab opens. Algorithm involves:
- Iterating over rotation history (14 days)
- Analyzing weak points across all subjects
- Scoring each available module
- Ranking and selecting optimal subject + blocks

**Current capacity:** 
- 14-day rotation history, 5 subjects, ~30 modules = O(14 × 5 × 30) = O(2100) operations
- Weak points: 30 topics max = O(30) per subject analysis
- Total: O(5000) operations per call — negligible on modern devices

**Scaling path:** 
- If retention window increases to 6 months (180 days): O(180 × 5 × 30) = O(27000) — still fine
- If module count grows to 100: O(100 × 5 × 14) = O(7000) — still fine
- If weak points grow to 500: O(500) per analysis — still fine
- **No immediate scaling concern**, but should monitor if planner is called on every navigation

**Recommendations:** 
1. Cache daily plan for 24 hours: don't recalculate if it's the same day
2. Move expensive calculations to Service Worker if available
3. Add perf monitoring: log execution time of buildDailyPlan

---

## Dependencies at Risk

### Exam Data Hardcoded in Codebase
**Issue:** AQA past-paper questions and mark schemes are hardcoded in `src/features/quickfire/QuickFire.jsx` (lines ~150–200+) and `src/data/medicineExamPapers.js`. If exam board updates papers or copyrights require removal, large refactoring needed.

**Files:** 
- `src/features/quickfire/QuickFire.jsx` (PAST_PAPER_QS object, 1000+ lines)
- `src/data/medicineExamPapers.js` (exam questions)

**Risk:** 
- Copyright claims could force content removal on short notice
- Exam boards release new papers every year; adding them requires codebase update
- Can't dynamically fetch new papers without backend

**Mitigation:** 
1. Move exam content to separate JSON file: `src/data/exams.json`
2. Build backend service to manage exam content separately from app code
3. Add version control: track which exam board/year each question is from
4. License compliance: ensure licensing is documented (AQA, Edexcel terms)

---

### Hardcoded API Endpoints
**Issue:** All API endpoints are hardcoded as strings (`/api/grade`, `/api/recall`, `/api/examiner`, etc.). If backend URL changes, requires code recompilation.

**Files:** 
- `src/components/feedback/ExamQuestionFrame.jsx` (line 81)
- `src/components/learning/GuidedExamResponse.jsx`
- `src/components/learning/FaceTheExaminer.jsx`
- `src/components/learning/PriorKnowledgeRecall.jsx`
- `src/features/quickfire/QuickFire.jsx`

**Impact:** 
- Deploying to different environments (dev/staging/production) requires env variables
- Currently no `.env` file or environment config

**Recommendations:** 
1. Create `src/config/api.js`: centralize all API endpoints
2. Load from environment: `const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'`
3. Set via `.env.local` (development) and environment variables (production)
4. Example:
   ```js
   export const API = {
     grade: `${API_BASE}/api/grade`,
     recall: `${API_BASE}/api/recall`,
     examiner: `${API_BASE}/api/examiner`,
   }
   ```

---

## Missing Critical Features

### No Data Export or Backup
**Feature gap:** User has no way to export their progress, scores, or weakness tracking. If device is lost or browser data is cleared, all learning data is gone.

**Blocks:** 
- User anxiety about data loss
- Device migration (switching phones)
- Data portability (moving to different app)
- Compliance (GDPR right to access)

**Implementation path:** 
1. Add "Export my data" button in Settings: downloads `.json` file with all localStorage data
2. Add "Import data" for restore after device loss
3. Add "Clear all data" button with confirmation
4. If backend exists, add cloud backup: sync localStorage to server periodically

---

### No Session Recovery
**Feature gap:** If browser tab crashes or user accidentally closes the app mid-module, no way to resume from last state. They must start module over.

**Blocks:** 
- Learner frustration on mobile (apps can be killed by OS memory pressure)
- Energy loss on slow networks (have to re-download large module)

**Implementation path:** 
1. Implement session persistence: save current screen + state every 10 seconds
2. On app open, show toast: "Resume module X from screen 5?" with [Resume] [Start Over] buttons
3. If module was open and crashed, auto-restore on next open (with option to reset)

---

### No Offline Mode
**Feature gap:** App requires API for question grading (`/api/grade`, `/api/recall`, `/api/examiner`). If offline, learner can view content but can't submit answers.

**Blocks:** 
- Learners studying on flights, trains, or in areas with spotty network
- Reduced usage in developing regions with unreliable connectivity

**Implementation path:** 
1. Implement offline question processing: basic questions (MCQ, true/false) work offline using client-side logic
2. Cache mark schemes locally for offline grading
3. Queue written answers for server grading; sync when back online
4. Add "offline mode" badge to indicate limited functionality

---

### No Progress Syncing Across Devices
**Feature gap:** Student starts module on tablet at school, goes home and opens app on phone — phone shows zero progress. Each device has separate localStorage.

**Blocks:** 
- Learners expect seamless experience across devices
- No incentive to use app on multiple devices
- Progress tracking is fragmented

**Implementation path:** (Requires backend)
1. On login, fetch last-known progress from cloud
2. Merge: use most recent state from any device
3. Periodic sync: save progress every 5 minutes to cloud
4. Conflict resolution: if user is on two devices simultaneously, last-write-wins or merge strategies

---

## Test Coverage Gaps

### No Tests for State Persistence Edge Cases
**Untested area:** Module state save/restore when using browser storage

**Files:** 
- `src/components/layout/ModulePlayer.jsx` (saveModuleState, getModuleState)
- `src/app/moduleNavigation.js` (state building)

**What's not tested:** 
- Navigate to screen 5, close app, reopen module → should resume at screen 5
- Edit localStorage manually, reload app → should gracefully handle corruption
- Exceed localStorage quota → should handle gracefully, not crash

**Risk:** 
- Silent data loss: user progress saved but never restored
- Corruption: if localStorage is edited or corrupted, state machine breaks
- Device-specific bugs: iOS Safari may handle storage differently than Chrome

**Priority:** High — progress persistence is core to app value

**Test plan:** 
1. Unit: test saveModuleState/getModuleState with valid and invalid data
2. Integration: navigate module, close tab, reopen, verify state restored
3. Edge case: corrupt localStorage entry, reload, verify graceful recovery
4. Stress: navigate rapidly, save frequently, verify no lost updates

---

### No Tests for API Error Handling
**Untested area:** How the app behaves when `/api/grade`, `/api/recall`, `/api/examiner` endpoints fail

**Files:** 
- `src/components/feedback/ExamQuestionFrame.jsx` (catch at line 137–140)
- `src/components/learning/PriorKnowledgeRecall.jsx` (error handling)
- `src/components/learning/GuidedExamResponse.jsx`

**What's not tested:** 
- Server returns 500: does user see error message or does app crash?
- Server returns malformed JSON: does app handle gracefully?
- Request times out: does user get timeout message or hang forever?
- Network goes down mid-request: what happens to in-flight state?

**Risk:** 
- User submits answer, network drops, state becomes inconsistent (answer recorded in UI but not saved)
- Malformed API response causes runtime error instead of user-facing error
- Timeout with no feedback leaves user hanging

**Priority:** High — API reliability is critical to UX

**Test plan:** 
1. Mock fetch to return 500, verify error message shown
2. Mock fetch to return malformed JSON, verify error handling
3. Mock fetch to timeout, verify timeout message shown
4. Test: answer submitted, network cut, verify state consistency

---

### No Tests for Weakness Tracking Edge Cases
**Untested area:** Wrong answer logging, weak topic detection, recovery quiz selection

**Files:** 
- `src/unifiedWeaknessTracker.js` (core logic)
- `src/components/learning/WeakSpotRecovery.jsx` (trigger)

**What's not tested:** 
- Same question answered wrong twice in same session → weakness logged twice or once?
- Topic weak after 2 wrong answers, then 3 correct answers → still marked weak?
- Recovery quiz for topic doesn't exist → app crashes or graceful fallback?
- Weakness tracking disabled by user → does logging stop?

**Risk:** 
- Over/under-counting weaknesses leads to wrong recovery recommendations
- App crashes when recovery quiz missing
- Learner sees recovery content they've already mastered

**Priority:** Medium — weakness tracking is personalization layer

**Test plan:** 
1. Unit: test getWeakTopics with various wrong/correct answer ratios
2. Unit: test logWrongAnswer/logCorrectAnswer, verify deduplication
3. Integration: complete questions, verify weakness detected at right threshold
4. Edge case: missing recovery quiz, verify graceful fallback

---

### No E2E Tests for Quiz Flow
**Untested area:** Complete quiz experience: select topic → answer questions → see feedback → check weak areas

**Files:** 
- `src/features/quickfire/QuickFire.jsx` (quiz orchestration)
- Multiple feedback components

**What's not tested:** 
- Complete 5-question quiz, verify all results persisted
- Navigate away mid-quiz, return → quiz state preserved or reset?
- Grade API slow → does UI freeze or show loading state?
- Wrong answer marked correct → weakness not logged correctly

**Risk:** 
- Quiz results lost
- Learner frustration if state isn't preserved
- Weakness tracking corruption from grading errors

**Priority:** High — quiz is primary learner activity

**Test plan:** 
1. E2E: open Exam Mode, select History topic, answer 5 questions, verify scores saved
2. E2E: mid-quiz, navigate to Subjects tab, return to Exam Mode, verify state preserved
3. E2E: grade API returns error, verify retry mechanism works

---

*Concerns audit: 2026-06-22*
