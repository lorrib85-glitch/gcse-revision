# REQUIREMENTS.md — RISE

Generated: 2026-06-22
Source: Intel bootstrap ingest + codebase analysis

Note: This project is an active codebase, not a greenfield build. Requirements reflect the current state (what exists) plus the active development frontier (what's next). They are not feature wishlist items — they are the work the roadmap must account for.

---

## Delivered (no further action required)

These requirements are met by the current codebase.

| ID | Requirement | Status |
|----|-------------|--------|
| DONE-01 | App shell: 5-tab nav, dark theme, auth flow, lazy-loading | Done |
| DONE-02 | Progress tracking and unified weakness identification | Done |
| DONE-03 | History — Medicine Through Time: episodes 1–4 fully built (32/27/16/11 screens) | Done |
| DONE-04 | History — Medicine Through Time: episodes 7–9 built (10/7/10 screens) | Done |
| DONE-05 | History — Medicine Through Time: episodes 11–14 built (11/9/11/19 screens) | Done |
| DONE-06 | History — Medicine: all 14 canonical topic files generated | Done |
| DONE-07 | History — USA 1954–75: all 12 canonical topic files generated | Done |
| DONE-08 | Biology: "Building blocks" (13 screens) and "Plant Cells & Photosynthesis" (9 screens) built | Done |
| DONE-09 | Sociology: all 5 modules built (12–17 screens each) | Done |
| DONE-10 | Maths: both modules built (8 and 9 screens) | Done |
| DONE-11 | Exam Mode: multi-subject question banks, GuidedAnswerCoach (6 History types) | Done |
| DONE-12 | 90s Quiz (Pulse Tab): quickfire question bank live | Done |
| DONE-13 | Home: Today's Plan carousel built (`buildTodaysPlan()`, `TaskCarousel`, `TaskCard`) | Done |
| DONE-14 | `canonical-topic` skill: generates content + architecture files per episode | Done |
| DONE-15 | WeakSpotRecovery and RecoveryQuizPlayer integrated in module flow | Done |

---

## Active Requirements (v1)

These requirements represent the current development frontier.

### REQ-01 — History Medicine: complete stubs and gaps

ID: REQ-01
Category: CONTENT-MEDICINE
Priority: High

Complete the partially-built Medicine Through Time episodes:
- Episode 5 "London's Year of Terror": canonical file exists, 0 screens — needs full build
- Episode 6 "The boy, the cow and the cure": 1 stub screen — needs completion
- Episode 10 "The lady with the lamp": canonical file exists, 0 screens — needs full build

Acceptance criteria:
- Episodes 5, 6, and 10 each have complete screens following the locked 6-section History Module Architecture
- Each episode passes the 9-point Module Completion Test
- `screenCount` and `screenTags` in `src/modules.js` updated to match

### REQ-02 — History USA 1954–75: build all 12 episodes

ID: REQ-02
Category: CONTENT-USA
Priority: High

All 12 USA 1954–75 episodes have 0 screens. Canonical topic files exist for all 12. Build the full content for each episode following the locked History Module Architecture.

Acceptance criteria:
- All 12 episodes have complete screens (Section 1–6 structure)
- Each episode passes the 9-point Module Completion Test
- `screenCount` and `screenTags` in `src/modules.js` updated

### REQ-03 — History Spain and the New World: canonical files + build

ID: REQ-03
Category: CONTENT-SPAIN
Priority: Medium

10 episodes have 0 screens and no canonical topic files. Two-stage work: (1) run `/canonical-topic spain-new-world` to generate canonical files for all 10 episodes, then (2) build the episode content following History Module Architecture.

Acceptance criteria:
- Canonical files generated for all 10 Spain episodes (`docs/content/history/Spain_New_World/`)
- All 10 episodes built with complete Section 1–6 structure

### REQ-04 — Biology: complete the topic-group modules

ID: REQ-04
Category: CONTENT-BIOLOGY
Priority: Medium

Biology modules 3–8 are topic-group aggregators with 1 stub screen each ("Building Life", "The Human Machine", "Disease Wars", "Control Systems", "Genetics & Evolution", "Ecosystems"). Each needs full Science Blueprint content.

Acceptance criteria:
- Each of the 6 modules has complete screens following the locked Science Module Blueprint (Parts 1–6)
- Each module passes the Science Chapter Success Criteria
- `screenCount` and `screenTags` updated in `src/modules.js`

### REQ-05 — Chemistry: build all 4 modules

ID: REQ-05
Category: CONTENT-CHEMISTRY
Priority: Medium

All 4 Chemistry modules ("Matter & Atoms", "Chemical Reactions", "Rates & Organic Chemistry", "Earth Chemistry") have 1 stub screen each. Build full content per Science Blueprint.

Acceptance criteria:
- All 4 Chemistry modules have complete screens following Science Module Blueprint
- `screenCount` and `screenTags` updated in `src/modules.js`

### REQ-06 — Typography documentation fix

ID: REQ-06
Category: HOUSEKEEPING
Priority: Low

`TYPOGRAPHY_SYSTEM.md` and `PRODUCT_UI_CONSTITUTION.md` still reference Cormorant Garamond. CLAUDE.md is the operative authority (IBM Plex Serif replaces it). Update the two docs to remove the conflict.

Acceptance criteria:
- `TYPOGRAPHY_SYSTEM.md` TYPE.cinematic font updated to IBM Plex Serif
- `PRODUCT_UI_CONSTITUTION.md` font references updated to match
- `src/constants/typography.js` confirmed to use IBM Plex Serif

### REQ-07 — GuidedAnswerCoach: expand beyond History

ID: REQ-07
Category: EXAM-TECHNIQUE
Priority: Low

`GuidedAnswerCoach` currently has 6 History question types. The component supports Biology, Chemistry, Physics, Maths, English, and Sociology palettes. Add coach content for at least one additional subject.

Acceptance criteria:
- At least one non-History coach type added to `GUIDED_COACH_TYPES`
- Coach type uses correct subject palette and exam board format
- Accessible from Exam Mode chooser

---

## Deferred / Out of Scope

- English modules (topic bank exists; module content deferred)
- Physics modules (topic bank exists; module content deferred)
- Cross-subject weak-spot tag mappings (TAG_MODULE_MAP stays History-only)
- Bottom nav relabeling
- New weak→mastered tracking system
- Multi-user / teacher dashboard features

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| REQ-01 | Phase 2 | Pending |
| REQ-02 | Phase 3 | Pending |
| REQ-03 | Phase 4 | Pending |
| REQ-04 | Phase 5 | Pending |
| REQ-05 | Phase 5 | Pending |
| REQ-06 | Phase 1 | Pending |
| REQ-07 | Phase 6 | Pending |
