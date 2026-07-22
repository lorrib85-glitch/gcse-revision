# Phase 2 Context — History Medicine: Episodes 5, 6, and 10

Generated: 2026-06-22
Phase: Phase 2 — History Medicine gaps

---

## What this file is for

Downstream planning and execution agents read this file to understand locked decisions for Phase 2.
Do not ask the user to re-confirm anything recorded here.

---

## Episode inventory (confirmed)

| Episode | ID | Title | Current state | Action |
|---------|-----|-------|--------------|--------|
| 5 | `history-medicine-great-plague` | London's year of terror | `screenCount: 0`; **absent from history.js** | Build from scratch |
| 6 | `history-medicine-jenner-vaccination` | The boy, the cow and the cure | `screenCount: 1`; 1-screen stub in history.js at line 3297; `number: 5` in history.js (WRONG — must be 6) | Expand stub; fix number |
| 10 | `history-medicine-nightingale` | The lady with the lamp | `screenCount: 0`; **absent from history.js** | Build from scratch |

---

## Source files (read before building)

| Episode | Canonical content | Canonical architecture |
|---------|-----------------|----------------------|
| 5 | `docs/content/history/Medicine/05_Londons_Year_of_Terror_Content.md` | `docs/content/history/Medicine/05_Londons_Year_of_Terror_Architecture.md` |
| 6 | `docs/content/history/Medicine/06_The_Boy_the_Cow_and_the_Cure_Content.md` | `docs/content/history/Medicine/06_The_Boy_the_Cow_and_the_Cure_Architecture.md` |
| 10 | `docs/content/history/Medicine/10_The_Lady_with_the_Lamp_Content.md` | `docs/content/history/Medicine/10_The_Lady_with_the_Lamp_Architecture.md` |

Also read before building any episode:
- `docs/system/HISTORY_MODULE_ARCHITECTURE.md` — locked 6-section structure, component rules
- `CLAUDE.md` — development pipeline, constants, design rules
- `docs/system/PRODUCT_UI_CONSTITUTION.md` — supreme design law

---

## Files to change

1. **`src/modules/history.js`** — the main content file
   - Insert Episode 5 module object before the Jenner block (currently at line ~3296)
   - Expand Episode 6 from 1 screen to full episode; fix `number: 5` → `number: 6`
   - Insert Episode 10 module object between the `mod6` block (Ep9 surgery) and `mod7` block (Ep11 accidental miracle)

2. **`src/modules.js`** — metadata file
   - Episode 5: update `screenCount` from `0` to actual count; populate `screenTags`
   - Episode 6: update `screenCount` from `1` to actual count; populate `screenTags`
   - Episode 10: update `screenCount` from `0` to actual count; populate `screenTags`

No other files need to change. No new components. No new assets.

---

## Header images (already exist — no work needed)

| Episode | Image path |
|---------|-----------|
| 5 | `/headers/history-medicine-london-terror.png` |
| 6 | `/headers/history-medicine-jenner.png` (already in modules.js) |
| 10 | `/headers/history-medicine-lady-lamp.png` (already in modules.js) |

---

## Architecture (all three episodes)

All three episodes follow the **locked 6-section History Module Architecture** exactly:

| Section | Content |
|---------|---------|
| 1 | Cinematic intro OR True/False hook → `PriorKnowledgeRecall` → `WhatYouWillLearn` |
| 2 | Learning chunk 1 (at least 1 interaction + 1 retrieval) |
| 3 | Learning chunk 2 (interleaving + active processing + end with retrieval) |
| 4 | Learning chunk 3 (interleaving + active participation + end with retrieval) |
| 5 | Learning chunk 4 (chapter-level retrieval, reinforce core message) |
| 6 | Examiner content only → `ExaminerExplainsScreen` → `FaceTheExaminer` → `ChapterCompleteScreen` |

No examiner content in Sections 1–5. No major new content in Section 6.

---

## Screen count target (LOCKED)

Each episode should be built to approximately:
- 12–14 teaching/content screens
- 4–6 recall / interaction screens
- 1–2 exam technique / final challenge screens
- **Total: ~18–22 screens per episode**

This is a richer build than the shorter episodes (germ theory = 10, Great Stink = 7) and closer to the depth of the built medieval beliefs episode (~29) and Western Front episode (19).

---

## Decision: Jenner stub (Episode 6)

**USE as source material, NOT as fixed wording.**

The existing single-screen stub (`tag: 'vaccination'`) contains accurate exam content. Its strongest points should be integrated into the expanded build — probably in Section 2 (evidence) or Section 6 (exam practice). The final episode must feel like one coherent new build.

Do not preserve the stub screen as-is. Do not bolt extra screens onto the existing stub structure.

**Fix the number mismatch:** Change `number: 5` → `number: 6` in the module object in history.js.

The existing `stageNavigation` in the stub (all `screenIndex: 0`) is a placeholder — replace it entirely with the correct 6-part navigation structure.

---

## Decision: Jenner / Pasteur boundary (Episode 6)

Episode 6 focuses on:
- Smallpox context and inoculation (pre-Jenner)
- Jenner's farmyard observation and the James Phipps experiment (1796)
- Opposition and resistance
- Government role (vaccination compulsory 1853, inoculation banned 1840)
- Significance and limits

**Pasteur appears ONLY as a forward pointer in Section 5:**
> "Jenner couldn't explain why vaccination worked. That explanation came 80 years later, from Louis Pasteur's germ theory. Episode 7 covers what Pasteur discovered."

Do NOT teach Pasteur's germ theory inside Episode 6. It belongs in Episode 7 (`history-medicine-germ-theory`).

---

## Decision: Mary Seacole scope (Episode 10)

Seacole gets exactly:
1. **One dedicated `TimelineChain` (`variant: 'reveal'`)** in Section 5 — who she was, what she did, why she was rejected and how she responded
2. **One comparison interaction** (preferably `ColSortBlock`) in Section 5 — Nightingale vs Seacole across: nursing approach, funding/backing, battlefield vs hospital, legacy/recognition, barriers faced

Keep Nightingale as the primary arc of the episode. Seacole is a comparison/sophistication point for high-mark exam answers, not a co-equal protagonist.

Do NOT weave Seacole through multiple sections. Her material is confined to Section 5.

---

## Component rules

**Allowed (use from existing registry):**
- `CinematicRevealMoment`, `PriorKnowledgeRecall` — Section 1
- `VisualLearning`, `TimelineChain` (`variant: 'reveal'`), `InteractiveHotspotImage`, `InteractiveCollectionExplorer`, `GuidedChoiceCarousel` — teaching
- `QuickRecallScreen`, `MatchingTask`, `ColSortBlock` — retrieval/interaction
- `ExplainReveal` — cause-and-effect chains
- `TheoryCompareBlock` — side-by-side comparisons
- `MisconceptionCheck` — pre-exam misconception testing
- `ExaminerExplainsScreen`, `FaceTheExaminer`, `ChapterCompleteScreen` — Section 6

**Component repetition limit:** No feature component used more than twice per episode (does not apply to `QuickRecallScreen` and `PriorKnowledgeRecall`).

**No new components.** If a teaching need isn't met by the above list, adapt the closest existing component.

---

## Episode-specific content notes

### Episode 5: London's year of terror

**Core takeaway:** 300 years of Renaissance thinking changed almost nothing about how people understood epidemic disease. Beliefs in 1665 mirrored beliefs in 1348 — God, miasma, astrology. The one meaningful change: government response was more organised (watchmen, searchers, quarantine enforced, stray animals killed). This is the key exam insight: more administration, not more medicine.

**PriorKnowledgeRecall concepts:** Black Death causes (God, miasma, astrology), Black Death treatments (prayer, herbs, flagellants), Great Plague returning, Renaissance challenge to Galen — specifically: recall Episodes 1–4 content

**Key Section 3 content:** Comparison of 1348 vs 1665 — `TheoryCompareBlock` is ideal here (two columns, same beliefs vs slightly more organised response)

**Key Section 4 content:** Government orders — quarantine, watchmen, searchers, stray animals killed, red crosses, crowd bans — `GuidedChoiceCarousel` works well (act as city official)

**Key exam questions (Section 6):**
- "How similar were people's reactions to the Black Death (1348) and the Great Plague (1665)?"
- "Describe two features of people's response to the Great Plague" (2 × 2 marks)
- `FaceTheExaminer` exam question: the similarity/difference comparison (highest-frequency exam question for this period)

**Misconceptions to trap:** "1665 responses were very different from 1348" (FALSE — overwhelmingly similar), "Plague doctors understood infection control" (FALSE — beaked masks filtered miasma, based on wrong theory), "Government did nothing" (FALSE — quarantine, watchmen, searchers)

---

### Episode 6: The boy, the cow and the cure

**Core takeaway:** Jenner's vaccine was the first safer and more reliable method of preventing a deadly disease. But Jenner couldn't explain why it worked, so it couldn't be applied to other diseases. The method spread because government eventually forced it. The limitation — and the forward pointer to Pasteur — is the key exam nuance.

**Stub content to absorb:** The existing 1-screen content (observation → Phipps experiment → Church/Parliament controversy → the exam point about observation without understanding) should be disaggregated across Sections 2–5. Strongest exam point to preserve: "Jenner had no knowledge of germs or immunity — he used observation and careful experiment." This belongs in Section 5 (significance + limits) or Section 6 (exam practice).

**Fix required:** Change `number: 5` → `number: 6` in the module object.

**PriorKnowledgeRecall concepts:** Great Plague miasma belief, government response to plague 1665, Renaissance observation and experiment

**Key Section 2 content:** Smallpox and inoculation — the pre-Jenner context. Inoculation vs vaccination table is exam-essential.

**Key Section 3 content:** Jenner's observation + the Phipps experiment. `TimelineChain` (`variant: 'reveal'`) or `InteractiveHotspotImage` for the farmyard / experiment steps.

**Key Section 4 content:** Opposition (Church, inoculators, London establishment) + government role (1840 ban on inoculation, 1853 compulsory vaccination). `GuidedChoiceCarousel` or `MatchingTask`.

**Key Section 5:** Significance + limits. Pasteur forward pointer (one sentence). `ColSortBlock` or `ExplainReveal` for change/continuity.

**Key exam questions (Section 6):**
- "'Jenner's vaccination against smallpox was a major breakthrough.' How far do you agree?" (16 marks)
- "Explain why Jenner's vaccination was not immediately accepted" (12 marks)

**Misconceptions:** "Jenner understood how vaccination worked" (FALSE), "Vaccination was immediately accepted" (FALSE), "Jenner was a famous London doctor" (FALSE — country doctor, Gloucestershire)

---

### Episode 10: The lady with the lamp

**Core takeaway:** Nightingale revolutionised hospital care through cleaning, organisation, professional nursing and statistical advocacy — while still believing in miasma. Her significance is administrative and systemic, not scientific. She proved that data and organisation could save more lives than individual medical breakthroughs.

**PriorKnowledgeRecall concepts:** public health 1800–1900, John Snow and cholera, surgery and antiseptics — recall Episodes 8–9 content

**Key Section 2 content:** Hospitals before Nightingale — voluntary hospitals, cottage hospitals, poor conditions, low nursing status. `VisualLearning` or `InteractiveHotspotImage`.

**Key Section 3 content:** Scutari — what Nightingale found, what she changed, death rate 40% → 2%. `TimelineChain` (`variant: 'reveal'`) + `ExplainReveal` for the cause-effect chain.

**Key Section 4 content:** Nightingale's long-term impact — Nightingale School for Nurses (1860), pavilion plan hospital design, *Notes on Nursing* (1859). `MatchingTask` or `GuidedChoiceCarousel`.

**Key Section 5 content:**
- `TimelineChain` (`variant: 'reveal'`) — Mary Seacole (dedicated screen: who she was, what she did, why she was rejected, her self-funded journey)
- `ColSortBlock` — Nightingale vs Seacole comparison (nursing approach / funding/backing / battlefield vs hospital / legacy and recognition / barriers faced)
- `QuickRecallScreen` — reinforce chapter core message

**Key exam questions (Section 6):**
- "Explain why Florence Nightingale was important in improving medicine" (12 marks)
- "How far did Florence Nightingale change hospital care in Britain?" (16 marks)

**Misconceptions:** "Nightingale understood germ theory" (FALSE — she believed miasma), "Nightingale invented nursing" (PARTLY FALSE — she professionalised it, not invented it), "Seacole was part of Nightingale's nursing team" (FALSE — Seacole was rejected and self-funded)

---

## Module Completion Test (all three episodes must pass before Phase 2 is done)

- [ ] Section 1 includes retrieval (`PriorKnowledgeRecall`)
- [ ] Weak spots are generated
- [ ] Every learning chunk includes interaction
- [ ] Every learning chunk includes retrieval
- [ ] Interleaving exists throughout the module
- [ ] Weak spots are revisited in-module
- [ ] Core chapter message is reinforced
- [ ] Examiner content appears only in Section 6
- [ ] Module ends with a completion screen (`ChapterCompleteScreen`)
- [ ] No feature component used more than twice in the module
- [ ] `screenCount` and `screenTags` in `src/modules.js` match actual built screens

---

## What Phase 2 does NOT include

- Recovery quiz entries in `src/data/recoveryQuizzes.js` — no new recovery quizzes needed in this phase
- New components — all required components already exist
- New header images — all three already exist
- Any changes to `src/modules.js` fields other than `screenCount` and `screenTags`
- Any changes to Episodes 1–4 or 7–9 or 11–14

---

## Deferred ideas (out of scope for Phase 2)

These came up during discussion but are not part of this phase:

- Full USA 1954–75 build (Phase 3)
- Spain and the New World canonical files + build (Phase 4)
- Biology and Chemistry topic modules (Phase 5)
- Exam technique expansion beyond History (Phase 6)
