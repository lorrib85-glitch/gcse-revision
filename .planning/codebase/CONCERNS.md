# Codebase Concerns

**Analysis Date:** 2026-07-09

## Tech Debt

**Unbuilt module stubs blocking learner experience:**
- Issue: 30+ modules across multiple subjects have `screenCount: 0` and placeholder files. Learners can see these in the UI but cannot access content. Includes entire subject trees (Chemistry 4 stubs, Biology 7 stubs, Spain & New World 10 stubs, USA 12 stubs) plus History Medicine modules (Great Plague, Nightingale).
- Files: `src/modules.js` (37 stub entries), `src/content/moduleContentRegistry.js`, all `src/content/*/episodes/*-stub` files
- Impact: Creates broken UI experience. Learners see locked/clickable modules with no content. Stubs must be built or hidden before release.
- Fix approach: Either (1) remove stub entries from `src/modules.js` and `moduleContentRegistry.js` entirely, or (2) implement a "coming soon" state in ModulesTab that hides or clearly marks unbuilt modules. Run `/module-creation <id>` workflow to build each module fully before adding to MODULES.

**Legacy per-subject module loading still in use:**
- Issue: `SUBJECT_MODULE_LOADERS` pattern (loads entire `biology.js`, `maths.js`, `sociology.js`, `chemistry.js`, `english.js` files at once) was intended to be deprecated but Biology, Maths, and Sociology still use it. Newer History and Maths modules use per-module files via `MODULE_CONTENT_LOADERS`. Mixed patterns create confusion and inconsistent bundle strategy.
- Files: `src/app/LegacyApp.jsx` (lines ~110–150), `src/modules.js`, legacy subject files under `src/content/`
- Impact: Migrating a subject loads unnecessary module content into memory. Learning graph metadata and per-module file strategy are architecture rules not yet enforced consistently.
- Fix approach: Migrate Biology, Maths, and Sociology to per-module files using `/module-creation <id>` workflow. Add `MODULE_CONTENT_LOADERS` entries for each, then remove old subject file entries from `LegacyApp.jsx` and `SUBJECT_MODULE_LOADERS` constant.

**Direct localStorage access scattered throughout codebase:**
- Issue: `localStorage` is called directly in 25+ places across `todaysPlan.js`, `auth/authService.js`, `progress.js`, `ModulePlayer.jsx`, `QuickFireMode.jsx`, `ExamMode.jsx`, and others. This bypasses the unified abstraction layer `src/lib/storage.js`, making it harder to add persistence features like encryption, sync, or offline mode later.
- Files: `src/todaysPlan.js:14,18`, `src/auth/authService.js:26,30,34`, `src/components/layout/ModulePlayer.jsx:81,84`, `src/features/quickfire/modes/QuickFireMode.jsx:103,130,197,206,214`, `src/features/quickfire/modes/ExamMode.jsx:133,589`, and others
- Impact: Storage layer is not centralized. Debugging data corruption, adding sync, or migrating to IndexedDB requires touching many files. Learner data (riseUser, module state, scores, preferences) is not protected by a single boundary.
- Fix approach: Add all storage keys to `src/lib/storage.js` with typed getters/setters. Replace all direct `localStorage` calls with storage.js functions. Run architecture test `storage-boundary.test.js` to enforce the boundary.

**Large monolithic data files:**
- Issue: `src/data/quickQuizData.js` (1927 lines), `physicsTopics.js` (972 lines), `mathsTopics.js` (789 lines), `sociologyTopics.js` (762 lines) are single-file question banks. Very long files become hard to search, edit, and version-control. Question deletions or edits touch many unrelated questions in the same file.
- Files: `src/data/quickQuizData.js`, `src/data/physicsTopics.js`, `src/data/mathsTopics.js`, `src/data/sociologyTopics.js`
- Impact: Code review of a single question change affects 1900+ lines of noise. Adding or removing a question requires careful merging if multiple branches touch the same file. Lazy-loading per-question is not possible.
- Fix approach: Split into per-topic or per-difficulty sub-files and re-export from a single index. Use the per-module file strategy already established for content. Loader registry in `moduleContentRegistry.js` provides the pattern.

**Large component files with mixed responsibilities:**
- Issue: `ModulePlayer.jsx` (2414 lines) orchestrates all screen types, handles lifecycle, state management, and rendering. `dailyPlanner.js` (1320 lines) builds planning logic and UI state in one place. These violate single-responsibility principle and make testing hard.
- Files: `src/components/layout/ModulePlayer.jsx`, `src/features/planner/dailyPlanner.js`
- Impact: Complex components are hard to test, reuse, and debug. ModulePlayer imports 40+ child components statically, adding to initial render work. dailyPlanner's pure logic is intertwined with storage I/O.
- Fix approach: Extract pure logic (screen routing, state machines) into separate utility files. Use composition to break ModulePlayer into smaller sub-shells (e.g., ScreenShell, InteractionShell, CompleteShell). Separate dailyPlanner's pure functions from its storage layer.

## Known Bugs

**Module content loading uses proportional screen index estimates:**
- Symptoms: Episode files include TODO comments like "module uses old-format screens without stages; screen indices are proportional estimates" (episode-07-germ-theory.js:63, episode-04-surgery-anaesthetics.js:70). These modules' stage navigation and weak-spot routing rely on estimated screen positions, not actual counts.
- Files: `src/content/history/medicine/episodes/episode-04-surgery-anaesthetics.js:70`, `episode-07-germ-theory.js:63`, `episode-03-renaissance-medicine.js:90`
- Trigger: Opening one of these modules and attempting to jump to a weak-spot screen (e.g., via "fix this gap" from recovery quiz) may land on the wrong screen because the index math is wrong.
- Workaround: No workaround — the modules must be rebuilt with correct stage navigation. Mark these as requiring build completion before launch.

**Missing image assets for history-medicine-western-front:**
- Symptoms: Episode-14 includes TODOs for missing diagram images: `/figures/history/medicine/western-front/trench-system.webp`, `/figures/history/medicine/western-front/wounded-evacuation.webp`, `/figures/history/medicine/western-front/medical-post.webp` (lines 101, 106, 111). Fallback to .png files is in place, but the higher-quality .webp versions are not yet provided.
- Files: `src/content/history/medicine/episodes/episode-14-western-front.js:101,106,111`, `/public/figures/` missing 3 .webp files
- Impact: Learners see lower-quality images in this module. Performance is slightly worse on supported browsers.
- Workaround: None — must generate or source the .webp diagram images. Add to visual asset production pipeline.

**Chemistry QuickFire question bank not migrated:**
- Symptoms: Chemistry exam mode (Exam Mode, QuickFire) references `ALL_CHEMISTRY_QUESTIONS` in the test data provider, but no question bank exists yet. Code comment (QuickFireMode.jsx:41) notes "Chemistry quickfire questions have no module bank yet — migrate when Chemistry is designed".
- Files: `src/features/quickfire/modes/QuickFireMode.jsx:41`, `src/App.jsx` (TestDataProvider)
- Impact: Chemistry appears in the Exams tab with no practise questions available. Learners cannot test their Chemistry knowledge via QuickFire.
- Workaround: Hide Chemistry from Exam Mode tab until question bank is ready, or use recoveryQuizzes as placeholder. Better: build Chemistry question bank following `src/data/mathsTopics.js` pattern and add `chemistryTopics.js`.

## Security Considerations

**Firebase configuration depends entirely on environment variables:**
- Risk: If `VITE_FIREBASE_*` env vars are not set, Firebase silently disables (firebaseEnabled = false) and Google sign-in becomes unavailable. This is caught in tests and Storybook, but misconfig in production could break auth silently without errors.
- Files: `src/auth/firebaseClient.js:7–21`, `src/app/LegacyApp.jsx:138` (TODO comment about Firebase readiness)
- Current mitigation: Code throws clear error if sign-in is attempted without config. Dev env check shows which keys are missing. .env.example documents required vars.
- Recommendations: (1) Add startup validation that checks all required Firebase keys exist and are non-empty, warn in console if missing. (2) Add telemetry to detect silent Firebase failures in production. (3) Document Firebase security rules and CORS configuration in DEVOPS.md.

**Learner progress and personal data stored in localStorage without encryption:**
- Risk: Stored data (`riseUser`, `gcse_module_*`, `gcse_scores`) contains email, display name, and progress history in plain text. Browser dev tools expose all data. XSS attacks could exfiltrate data. Learner privacy is not protected by default.
- Files: `src/auth/authService.js:26–34`, `src/lib/storage.js`, `src/components/layout/ModulePlayer.jsx:81–84`
- Current mitigation: Data is only stored in single-user browser (no server sync). HTTPS ensures transport is secure. localStorage is domain-scoped by browser.
- Recommendations: (1) Consider encrypt-at-rest for sensitive keys (e.g., riseUser) using TweetNaCl.js or libsodium.js. (2) Add data retention policy — auto-clear localStorage after N days of inactivity. (3) Warn learners in onboarding that data is stored locally, not synced. (4) Add option to export/delete all personal data (GDPR compliance).

**No validation of module content before rendering:**
- Risk: Module content files can be modified to include arbitrary code or malicious data. There is no schema validation before a module's screens, questions, or outcomes are rendered. Injected data could execute code or display inappropriate content.
- Files: `src/components/layout/ModulePlayer.jsx` (screen routing), `src/app/LegacyApp.jsx` (module loading)
- Current mitigation: All content files are checked into version control. No user-generated content is loaded. Build process would detect syntax errors.
- Recommendations: (1) Add a JSON schema validator for module content shape (screens, questions, images, outcomes). Run on load in dev mode. (2) Add Zod or similar runtime validation for question/answer data before rendering. (3) Document content review process in CONTENT_AUTHORING.md.

## Performance Bottlenecks

**Large data files loaded as monolithic bundles:**
- Problem: `quickQuizData.js` (1927 lines, ~150KB uncompressed) is imported statically in test data provider but only needed in Exam Mode. If not lazy-loaded separately, it delays Exam tab first paint. Similarly, `physicsTopics.js` (972 lines) and `mathsTopics.js` (789 lines) are loaded together when any Maths/Physics exam question is needed.
- Files: `src/data/quickQuizData.js`, `src/data/physicsTopics.js`, `src/data/mathsTopics.js`, `src/App.jsx` (TestDataProvider)
- Cause: Data files are static imports, not dynamic. Bundle splitting cannot separate by question bank. Every exam question load pulls the whole bank.
- Improvement path: (1) Split data files into per-topic sub-bundles and lazy-load by topic selection. (2) Move all question banks to `MODULE_CONTENT_LOADERS` pattern with dynamic import so only selected exam topic downloads. (3) Implement pagination for large question sets in UI. (4) Add bundle size budgets in vitest.config.js.

**Only 11 components use useMemo/useCallback for optimization:**
- Problem: Most interactive components (MatchingTask, ColSortBlock, TimelineCanvas, SwipeSort, EvacuationChainRoute, CinematicCarousel, GalensDiagnostic, TheoryLab, GuidedChoiceCarousel, TieredQuizScreen, SpotTheError) do not memoize expensive calculations or child functions. When parent re-renders, all children re-render unnecessarily, causing animation jank and touch-response lag.
- Files: `src/components/learning/*.jsx` (most learning components)
- Cause: React optimization is performant by default for small trees, but cinematic animations and SVG interaction (TimelineCanvas, CircuitDiagram, MatchingTask) benefit from memoization. No performance audit was done.
- Improvement path: (1) Run production build and measure TTI (time to interactive) and FCP (first contentful paint) per screen type. (2) Profile with React DevTools Profiler on target device (iPhone SE 2, typical learner phone). (3) Memoize child components and callbacks in slow screens. (4) Add performance budgets and Lighthouse CI to build pipeline.

**Promise `.then()/.catch()` chains instead of async/await (95 occurrences):**
- Problem: Codebase mixes async patterns, making error handling inconsistent and stack traces harder to read. 95 `.then()` chains create nested callback style. Some async/await is used (authService.js, moduleNavigation.js), some `.then()` is used (progress.js, modulePlayer.jsx).
- Files: Scattered across `src/app/`, `src/auth/`, `src/components/`, `src/features/`
- Cause: Incremental development — older code used `.then()`, newer code uses async/await. No linter rule to enforce one pattern.
- Improvement path: (1) Add ESLint rule `no-floating-promises` and `prefer-promise-rejection-errors`. (2) Refactor all `.then()` chains to async/await in high-impact files (auth, data loading, storage). (3) Standardize error handling: all async functions should catch and log or throw, never silently fail.

**No lazy loading of learning/feedback components in ModulePlayer:**
- Problem: `ModulePlayer.jsx` imports 40+ learning and feedback components statically (lines 10–65). Every module open loads all component code, even if the module only uses 3–5 of them. Chemistry, Physics, Maths modules share different interaction types (GraphView, MathsDiagram, CircuitDiagram), but all code is in the bundle.
- Files: `src/components/layout/ModulePlayer.jsx:10–65`
- Cause: Dynamic imports of components is not wired up. `ModulePlayer` decides which component to render based on `screen.type`, but all types are imported upfront.
- Improvement path: (1) Create a `screenTypeMap` object that maps `screen.type` to lazy-loaded component. (2) Use `React.lazy()` + `Suspense` for each type, like `const componentMap = { 'concept-reveal': lazy(() => import('...ConceptReveal.jsx')) }`. (3) Measure chunk size reduction after refactor. (4) Add bundle size check to CI.

## Fragile Areas

**Component-level test coverage gap — most learning/feedback components untested:**
- Files: No unit tests for `RetrievalFrame.jsx`, `ExamRoundDebrief.jsx`, `ExamQuestionFrame.jsx`, `ChapterCompleteScreen.jsx`, `ChapterHookScreen.jsx`, `ChapterOutcomeScreen.jsx`, `MatchingTask.jsx`, `ColSortBlock.jsx`, `TimelineCanvas.jsx`, `SwipeSort.jsx`, `EvacuationChainRoute.jsx`, `CinematicCarousel.jsx`, `GalensDiagnostic.jsx`, `TheoryLab.jsx`, `InteractiveHotspotImage.jsx`, `GuidedChoiceCarousel.jsx`, `VisualNarrativeScreen.jsx`, `FaceTheExaminer.jsx`, `GuidedExamResponse.jsx`, `ExaminerExplainsScreen.jsx`, and 40+ others.
- Why fragile: Bug fixes to answer validation, state transitions, or event handlers have no regression tests. Changing a condition in `AnswerInteraction.jsx` or `RetrievalFrame.jsx` could silently break exam scoring across all modules without any test catching it. Component behavior is only verified by manual testing or browser Storybook tests (which are fragile and don't scale).
- Safe modification: Before changing any learning component, (1) write a unit test using Vitest + jsdom that exercises the intended behavior, (2) run test before and after change to confirm it catches the bug, (3) add test to `tests/unit/components/` to prevent regression.
- Test coverage: Architecture tests cover data flow (content-loading-boundary.test.js, storage-boundary.test.js, learning-graph.test.js) but not component logic. Unit test suite exists but is sparse.

**Module content loading relies on registry staying in sync:**
- Files: `src/content/moduleContentRegistry.js` (loader map), `src/modules.js` (metadata), content files in `src/content/*/episodes/`
- Why fragile: Every module ID in `MODULES` must have a corresponding entry in `MODULE_CONTENT_LOADERS` and a content file on disk. If a developer creates a new module in `modules.js` but forgets the registry entry or content file, the app crashes at runtime with "Cannot read property 'screens' of undefined". No sync validation happens until the module is opened.
- Safe modification: Use `/module-creation <id>` skill to scaffold new modules — it auto-generates both registry and content file, keeping them in sync. Never edit `moduleContentRegistry.js` manually. Run `tests/architecture/content-registry.test.js` before commit to detect mismatches.
- Test coverage: `content-registry.test.js` checks all IDs exist, but doesn't check content shape. Add stricter Zod validation to catch missing required fields (screens, hook, outcomes) on load.

**Screen index calculations for weak-spot routing may miss target screen:**
- Files: `src/data/tagModuleMap.js` (findTaggedScreen function), modules with `screenTags: [...]` in `src/modules.js`, episodes with `// TODO` comments about proportional estimates
- Why fragile: When a learner is weak on a concept (logged by `unifiedWeaknessTracker.js`), the app calls `findTaggedScreen(mod, tag)` to jump to a relevant screen. This function searches `mod.screenTags` for the tag and returns the screen index. But if `screenTags` is incomplete or estimates are wrong (common in older episodes), the learner lands on the wrong screen — confusing and pedagogically harmful.
- Safe modification: (1) Every module must have `screenTags` fully specified (no nulls unless screen has no tag). (2) Regenerate screenTags by actually counting screens in the content file, not estimating. (3) Add test: for each module, verify screenTags.length === screenCount and all tagged screens exist. (4) Document that missing tags break weak-spot routing in HISTORY_MODULE_ARCHITECTURE.md.
- Test coverage: `placeholder-module-safety.test.js` checks stub modules, but doesn't validate screenTags completeness or accuracy.

**Weakness tracker feeds weak-spot routing but is hard to debug:**
- Files: `src/unifiedWeaknessTracker.js` (canonical tracker), `src/data/tagModuleMap.js` (routing), `tests/architecture/learning-graph.test.js` (concept validation)
- Why fragile: When a learner logs a weakness via `logWrongAnswer(tag, ...)`, the tag is expected to exist in the learning graph and resolve to a module/screen via `TAG_MODULE_MAP`. If a tag is misspelled or the map entry is missing, the learner's weakness is logged but recovery routing silently fails. The "fix this gap" link doesn't appear and the learner's gap is never addressed.
- Safe modification: (1) Every weakness tag must be in the learning graph registry (`src/data/learningGraph/concepts/`). (2) Run `learning-graph.test.js` in CI to catch new tags not registered. (3) Add debug logging to TAG_MODULE_MAP lookups so missing entries are caught in QA. (4) Document tag conventions in LEARNING_GRAPH.md.
- Test coverage: `learning-graph.test.js` validates concept registry, but doesn't check that all weaknesses logged in production are routable.

## Scaling Limits

**localStorage size limit (typically 5–10MB) will be reached with accumulated learner progress:**
- Current capacity: Estimate ~50KB per learner (riseUser + 30 modules × ~1.5KB state each + scores). At 5MB limit, ~100 learners per device before out-of-space errors.
- Limit: When localStorage is full, `localStorage.setItem()` throws `QuotaExceededError`. Current code catches this silently (try/catch with empty handler), so learner progress silently stops saving. Learners think they're making progress but it's not persisting.
- Scaling path: (1) Implement data cleanup: archive old session results (> 30 days) and delete completed modules' full state (keep only metadata). (2) Compress state objects before storing. (3) Migrate to IndexedDB for unlimited storage (async, supports structured data). (4) Add server sync to back up learner data to cloud (future phase). (5) Monitor storage usage in production — add telemetry to alert when learner hits >80% quota.

**Module bank growth — no strategy for organizing 100+ modules:**
- Current: 30 modules built/stubbed across History, Sociology, Maths, Biology, Chemistry, Physics, English. TabIndex, modulesTab card grid, and progress tracking assume flat list or simple grouping by subject.
- Limit: UI will become unusable at 100+ modules. Card grid becomes infinitely scrolling. Learners cannot find specific modules. Search/filter is not implemented.
- Scaling path: (1) Add subject-level detail pages (TapHistorySubject, Sociology overview, etc.) instead of flat grid. (2) Implement search/filter by topic, difficulty, time-to-complete. (3) Add "personalized module recommendations" to Home based on weak spots. (4) Implement module tagging for cross-subject connections (e.g., "graph interpretation" used in Maths, Physics, Geography). (5) Consider topic-based browsing (e.g., "disease and immunity" across Biology, Chemistry, History).

**Question bank growth — 1927 quick quiz questions, 972 physics questions — bundle size risk:**
- Current: ~150KB uncompressed for quickQuizData.js alone. Compressed ~30KB in gzip. Total question banks across all subjects ~7.5MB uncompressed.
- Limit: At 500+ questions per subject bank, search/filter becomes slow. Rendering large lists (e.g., "show all Maths questions") requires pagination or virtualization. Network download time for exam mode increases.
- Scaling path: (1) Implement per-topic lazy loading — only download questions for selected topic, not entire bank. (2) Add client-side search index (using Lunr.js or similar) cached in IndexedDB so searches are instant even with 5000+ questions. (3) Implement adaptive question selection — don't load all questions, select based on learner's weakness tags and difficulty. (4) Add CDN + CloudFlare cache for question bank files.

## Dependencies at Risk

**Firebase ^12.15.0 — major version locked:**
- Risk: Firebase SDK is not pinned to minor/patch version (^12.15.0 allows up to <13.0). Major version upgrades could introduce breaking changes in auth, storage, or config APIs. If a new Firebase 13 is released with auth flow changes, app would need refactoring.
- Impact: Security updates in Firebase may require code changes beyond dependency update. Build could fail unexpectedly if Firebase 13 removes deprecated APIs (e.g., `signInWithPopup` signature change).
- Migration plan: (1) Pin to exact version `firebase@12.15.0` until major version bump is thoroughly tested. (2) When Firebase 13 is released, dedicate a phase to audit breaking changes. (3) Consider Firebase alternative (Supabase Auth, Clerk) if Firebase makes disruptive changes. (4) Document Firebase setup steps in DEVOPS.md in case migration is needed.

**motion (animation library) ^12.40.0 — indirect dependency:**
- Risk: Motion is used for animations but is not a core dependency — it's only imported in specific animation utilities. If motion makes breaking changes or is unmaintained, animations break but app logic survives. No alternative is documented.
- Impact: Animations (e.g., in HomeAtmosphere, VisualLearning, TimelineChain) could become non-functional. Learner experience degrades but core revision features remain.
- Migration plan: (1) If motion becomes unmaintained, switch to Framer Motion (battle-tested, widely used). (2) Document animation patterns in MOTION_SYSTEM.md so a future rewrite is easier. (3) Audit motion usage and create an AnimationLibrary abstraction layer so library swap is localized to one file.

**No package-lock.json or pnpm-lock.yaml in git history:**
- Risk: `package.json` alone doesn't guarantee reproducible installs. Different developers or CI environments could install different transitive dependency versions, leading to "works on my machine but not CI" issues.
- Impact: Build non-determinism could hide bugs that only appear in CI. Security patches in transitive deps might not be installed consistently.
- Migration plan: Commit `pnpm-lock.yaml` (or npm/yarn lock file) to git. Ensure CI installs with `--frozen-lockfile` flag to enforce exact versions.

## Missing Critical Features

**No offline mode or data sync strategy:**
- Problem: Learners can only use the app when online. If network drops mid-revision, learner sees stale data. No mechanism to queue changes and sync when online again. If device storage is cleared, learner progress is lost forever.
- Blocks: (1) Multi-device learner use (start on desktop, continue on phone). (2) Reliable progress backup. (3) Airplane mode / public transit revision.
- Implementation path: (1) Add service worker to cache content bundles and serve offline. (2) Implement IndexedDB-backed sync engine: queue all progress changes (questions answered, modules started, scores) and sync to server when online. (3) Add cloud backup — periodically upload learner progress to Firebase Realtime DB or Cloud Firestore. (4) Implement conflict resolution (e.g., last-write-wins) if learner revises on multiple devices.

**No API or import format for adding new question types:**
- Problem: Every new question type (mcq, truefalse, fillgap, dragdrop, etc.) requires editing multiple files: question bank (quickQuizData.js), UnifiedQuestionScreen.jsx routing, AnswerInteraction.jsx answer logic. There is no plugin system or schema — developers must know the internal architecture.
- Blocks: Third-party content authors cannot create custom question types. Subject matter experts cannot add questions without learning React.
- Implementation path: (1) Design a Question Type Registry — each type registers handlers (validate, score, render). (2) Create a JSON schema for question types and question instances. (3) Build a content import tool that validates external JSON and converts to internal format. (4) Document plugin architecture in CONTENT_AUTHORING.md.

**No learner data export / GDPR compliance tooling:**
- Problem: Learner personal data (email, progress, weakness history) is scattered across localStorage, Firestore (if synced), and server logs. No way for learners to download their data or request deletion. GDPR (EU) and CCPA (US) require this.
- Blocks: Legal compliance in regulated markets. Learner trust and transparency.
- Implementation path: (1) Add "Download my data" button in Settings → exports learner progress, weakness history, scores as JSON. (2) Add "Delete my account" button → clears localStorage, Firebase account, and server records. (3) Implement data retention policy: auto-delete accounts after 12 months of inactivity. (4) Document GDPR compliance in PRIVACY_POLICY.md.

**No built-in question difficulty/adaptive selection strategy:**
- Problem: Quick Quiz and Exam Mode offer questions in fixed order or random selection, not adaptive. Learners weak on a topic see the same medium-difficulty questions repeatedly, not ramping up. Strong learners are not challenged with exam-difficulty questions.
- Blocks: Personalized learning experience. Efficient time use for learners preparing for exams.
- Implementation path: (1) Implement IRT (Item Response Theory) or similar: track learner's ability on each concept, select next question to target 50% success rate. (2) Add question difficulty calibration: run user study to verify difficulty labels match actual learner performance. (3) Implement spaced repetition for weak concepts. (4) Add "exam blast" mode: 3 exam-difficulty questions on learner's top weakness — learner either masters or gets targeted recovery.

## Test Coverage Gaps

**No component unit tests for most learning interactions:**
- What's not tested: MatchingTask, ColSortBlock, TimelineCanvas, SwipeSort, EvacuationChainRoute, CinematicCarousel, GalensDiagnostic, TheoryLab, InteractiveHotspotImage, GuidedChoiceCarousel, VisualNarrativeScreen, FaceTheExaminer (40+ total).
- Files: `src/components/learning/*.jsx`, `src/components/feedback/*.jsx`, `src/components/layout/ModulePlayer.jsx`
- Risk: Changes to screen routing, answer logic, event handlers, or state transitions in learning components are not caught by tests. Bugs in specific modules (e.g., "matching connections don't highlight correctly in MatchingTask") are only found during manual QA or after launch when learners report them.
- Priority: High — learning components are the core value of the app. A broken MatchingTask or FaceTheExaminer costs learner learning time and trust.

**No E2E tests for complete module journeys:**
- What's not tested: Learner opens module → completes chapter → weak spot recorded → recovery quiz suggested → weak spot fixed. Full learner workflow from Home → module selection → in-module learning → progress tracking → exam practice.
- Files: All test files; no tests in `tests/e2e/`
- Risk: Integration bugs between components, data flow, and state management are not caught. Example: learner answers incorrectly, weakness is logged, but recovery quiz never fires because test data isn't wired. Or learner completes module but progress doesn't update.
- Priority: Medium — architecture tests catch data shape issues, but functional correctness requires E2E. Recommend browser-based E2E tests using Playwright (already in devDependencies).

**Accessibility (a11y) tests missing:**
- What's not tested: Screen readers can identify buttons/headings (missing alt text on images, role attributes, aria-labels). Touch targets are >= 44px. Color contrast is WCAG AA compliant (especially important for dark cinematic theme). Keyboard navigation works (Tab, Enter, Escape).
- Files: Core components (BackButton, ExitButton, AnswerInteraction) have some aria attributes (24 total occurrences in grep), but no comprehensive audit.
- Risk: Learners with visual or motor impairments cannot use the app. Legal risk under ADA (US), EN 301 549 (EU). Blind learner cannot navigate module screens or answer questions if interactions aren't accessible.
- Priority: Medium-High — not tested but should be. Add axe-core audit to Storybook via addon-a11y (already in devDependencies). Create ACCESSIBILITY.md with guidelines.

---

## Remediation update — 2026-07-10

Acting on the highest-value verified findings above. This section records what
was fixed, what was inaccurate, and what was deliberately deferred. Where a
finding here contradicts the original audit text above, this section is
current.

### Fixed (second pass)

- **Save failures were only a console warning.** Added `saveCritical` +
  a save-failure bus in `storage.js`, a pure controller, and one governed
  `SaveFailureNotice` (mounted app-wide via `SaveFailureHost`). Critical
  completion/score/streak/module/planner saves route through it, so a failed
  save can no longer appear successful. No `window.alert`, no success toast.
- **Two lockfiles / split package-manager contract.** Standardised on pnpm
  (`packageManager` field, CI migrated to `pnpm install --frozen-lockfile`,
  `package-lock.json` removed). See STACK.md.
- **QuickFire weaknesses were unroutable.** QuickFire now records a canonical
  `conceptTag` (the `TAG_MODULE_MAP` key, forwarded through
  `quickFireFromBank`) alongside the human `topic`, for every answer type — not
  just true/false. `getBiggestWin` routes by `conceptTag` (fail-safe fallback
  to a slug-topic; human labels never mis-route) and returns it so callers land
  on the exact tagged screen. Backward-compatible: legacy entries without a
  `conceptTag` stay readable and safe.
- **Stale ConceptReveal contract tests.** Repaired to validate governed
  behaviour (final continue only, taps don't leave, eyebrow opt-in) via
  function-body extraction rather than obsolete source strings.

### Fixed

- **Direct localStorage access scattered (Tech Debt).** All learner-data
  reads/writes now route through `src/lib/storage.js`. The former grandfathered
  call sites (`todaysPlan.js`, `auth/authService.js`, `LegacyApp.jsx`,
  `ModulePlayer.jsx`, `QuickFireMode.jsx`, `ExamMode.jsx`, `StreakChip.jsx`,
  `moduleNavigation.js`) were migrated to typed helpers. The
  `storage-boundary.test.js` allowlist is now just `storage.js`.
- **Silent write failures (Scaling Limits — QuotaExceededError).** `setJson`
  now returns `true`/`false` and emits an explicit "progress is NOT being
  saved" warning on quota errors instead of swallowing them. `progress.js`
  gained `saveModuleState()` returning the same signal.
- **Weak-spot routing may miss target screen (Fragile Areas).** Every maths
  recovery tag pointed at a non-existent module id (`maths-place-value`, …);
  repointed to the real `math1`–`math8`. Realigned drifting `screenTags`
  (`math2/3/5/6/7/8`) to the actual loaded content. Guarded by the new
  `recovery-routing-integrity.test.js`.
- **Unbuilt module stubs blocking learner experience (Tech Debt).**
  Introduced governed availability (`getModuleAvailability` /
  `isModuleAvailable` in `src/modules.js`). The planner and `getContinueModule`
  now skip non-available modules; weak-spot recovery only targets available
  modules. Guarded by `module-availability.test.js`.
- **Registry/metadata desync (Fragile Areas).** Removed four orphan Chemistry
  loader entries (empty stubs) and the fully-dangling `chem_core` MODULE_GROUP;
  added the missing `english-macbeth-power-ambition` metadata row (content +
  loader + browser wiring already existed).
- **No E2E for complete module journeys (Test Coverage Gaps).** Added
  `tests/unit/journeys/learnerJourneys.test.js` covering progress-survives-
  refresh, weakness-repair routing, chapter completion, and the cloud-restore
  reconciliation seam (integration-level, deterministic — no live OAuth).

### Inaccurate / outdated findings (left code alone)

- **"No package-lock.json or pnpm-lock.yaml in git history" (Dependencies at
  Risk).** Both `package-lock.json` and `pnpm-lock.yaml` are present and
  committed. No action needed.
- **"Module content loading uses proportional screen index estimates" (Known
  Bugs).** The proportional `stageNavigation` indices in
  `episode-07-germ-theory.js` feed only the in-module progress rail, **not**
  weak-spot recovery. Recovery routing uses `screenTags` via
  `findTaggedScreen`, which are exact for the tagged screens (verified by
  `recovery-routing-integrity.test.js`). The stage-rail polish remains a
  content task, not a routing-correctness bug.

### Deliberately deferred (out of scope / higher risk)

- **IndexedDB / encryption / data-model redesign.** Explicitly out of scope.
- **ModulePlayer decomposition.** The safe pure-logic extraction (persistence
  helpers) was completed; all other candidates were already extracted into
  `src/app/moduleNavigation.js`. No further split is low-risk enough to justify.

---

*Concerns audit: 2026-07-09; remediation update: 2026-07-10*
