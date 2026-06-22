# ROADMAP.md — RISE

Generated: 2026-06-22
Granularity: Standard
Coverage: 7/7 active requirements mapped

---

## Project State

This is an active codebase, not a greenfield build. The app shell, all navigation, progress tracking, Exam Mode, 90s Quiz, Today's Plan, and the first 9–14 History Medicine episodes are already live. The roadmap tracks what remains: documentation fixes, completing partially-built content, and expanding into unbuilt subject areas.

---

## Phases

- [x] **Phase 1: Documentation fix** - Resolve the Cormorant Garamond font conflict in canonical docs — DONE 2026-06-22
- [ ] **Phase 2: History Medicine — gaps filled** - Complete the three unfinished Medicine Through Time episodes
- [ ] **Phase 3: History USA 1954–75 — full build** - Build all 12 episodes using existing canonical files
- [ ] **Phase 4: History Spain and the New World — canonical files + build** - Generate canonical files then build all 10 Spain episodes
- [ ] **Phase 5: Biology and Chemistry — topic modules** - Build the 6 Biology topic-group modules and 4 Chemistry modules
- [ ] **Phase 6: Exam technique expansion** - Extend GuidedAnswerCoach beyond History

---

## Phase Details

### Phase 1: Documentation fix ✅ DONE 2026-06-22
**Goal**: The typography token conflict is resolved and canonical docs match the codebase.
**Depends on**: Nothing
**Requirements**: REQ-06
**Success Criteria** (all TRUE):
  1. `TYPOGRAPHY_SYSTEM.md` font table documents Manrope + Sora — Cormorant Garamond removed ✓
  2. `PRODUCT_UI_CONSTITUTION.md` font table and rules updated to Manrope + Sora ✓
  3. `CLAUDE.md` Fonts section updated — Outfit and IBM Plex Serif removed, Manrope listed ✓
  4. `src/constants/typography.js` confirmed: TYPE.cinematic = Manrope (no code changes needed) ✓
**Plans**: Complete

---

### Phase 2: History Medicine — gaps filled
**Goal**: Medicine Through Time is complete — every episode has full content and no stubs.
**Depends on**: Phase 1
**Requirements**: REQ-01
**Success Criteria** (what must be TRUE):
  1. Episode 5 "London's Year of Terror" is fully playable from Section 1 through Section 6
  2. Episode 6 "The boy, the cow and the cure" is fully playable (stub expanded to complete build)
  3. Episode 10 "The lady with the lamp" is fully playable from Section 1 through Section 6
  4. All three episodes pass the 9-point Module Completion Test (retrieval, interleaving, examiner section, completion screen)
  5. `screenCount` and `screenTags` in `src/modules.js` reflect the actual built screens for all three
**Plans**: TBD
**UI hint**: yes

---

### Phase 3: History USA 1954–75 — full build
**Goal**: A student can study any of the 12 USA episodes end-to-end, from Cold War context through the Vietnam withdrawal.
**Depends on**: Phase 2
**Requirements**: REQ-02
**Success Criteria** (what must be TRUE):
  1. All 12 USA episodes are playable — a student can open any episode and progress through all sections
  2. Each episode follows the locked 6-section History Module Architecture with no improvised structure
  3. Every episode includes a PriorKnowledgeRecall screen in Section 1 that feeds the weakness tracker
  4. Every episode ends with a ChapterCompleteScreen in Section 6
  5. `src/modules.js` screenCount values match actual screens for all 12 USA episodes
**Plans**: TBD
**UI hint**: yes

---

### Phase 4: History Spain and the New World — canonical files + build
**Goal**: A student can study Spain and the New World — all 10 episodes have content and canonical reference files exist for future auditing.
**Depends on**: Phase 3
**Requirements**: REQ-03
**Success Criteria** (what must be TRUE):
  1. Canonical content and architecture files exist for all 10 Spain episodes at `docs/content/history/Spain_New_World/`
  2. All 10 Spain episodes are playable end-to-end following the locked History Module Architecture
  3. Each episode passes the 9-point Module Completion Test
  4. `src/modules.js` screenCount and screenTags updated for all 10 episodes
**Plans**: TBD
**UI hint**: yes

---

### Phase 5: Biology and Chemistry — topic modules
**Goal**: Biology topic-group modules and all Chemistry modules are fully playable, with real content behind every card in the Subjects tab.
**Depends on**: Phase 1
**Requirements**: REQ-04, REQ-05
**Success Criteria** (what must be TRUE):
  1. All 6 Biology topic-group modules ("Building Life", "The Human Machine", "Disease Wars", "Control Systems", "Genetics & Evolution", "Ecosystems") are fully playable with 10+ screens each
  2. All 4 Chemistry modules ("Matter & Atoms", "Chemical Reactions", "Rates & Organic Chemistry", "Earth Chemistry") are fully playable
  3. Each module follows the locked Science Module Blueprint (Parts 1–6) — real-world hook first, definition never first
  4. Each module logs weaknesses to `unifiedWeaknessTracker.js` via at least one precision-check interaction
  5. `screenCount` and `screenTags` updated in `src/modules.js` for all 10 modules
**Plans**: TBD
**UI hint**: yes

---

### Phase 6: Exam technique expansion
**Goal**: Students studying subjects beyond History can access guided exam technique coaching in Exam Mode.
**Depends on**: Phase 5
**Requirements**: REQ-07
**Success Criteria** (what must be TRUE):
  1. At least one non-History GuidedAnswerCoach type is live and accessible from the Exam Mode chooser
  2. The new coach type uses the correct subject palette and exam board question format
  3. Exam technique patterns from the new subject log to `unifiedWeaknessTracker.js` via `logExamTechnique`
**Plans**: TBD
**UI hint**: yes

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Documentation fix | 1/1 | ✅ Complete | 2026-06-22 |
| 2. History Medicine gaps | 0/0 | Not started | - |
| 3. History USA | 0/0 | Not started | - |
| 4. History Spain | 0/0 | Not started | - |
| 5. Biology and Chemistry | 0/0 | Not started | - |
| 6. Exam technique expansion | 0/0 | Not started | - |

---

## Coverage

| Requirement | Phase |
|-------------|-------|
| REQ-01 | Phase 2 |
| REQ-02 | Phase 3 |
| REQ-03 | Phase 4 |
| REQ-04 | Phase 5 |
| REQ-05 | Phase 5 |
| REQ-06 | Phase 1 |
| REQ-07 | Phase 6 |

Mapped: 7/7 ✓
