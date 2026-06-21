# Episode 6: The Boy, the Cow and the Cure — Architecture

## 1. Identity (brief)

- **Episode number:** 6
- **Title:** The Boy, the Cow and the Cure
- **Build status:** Built as `history-medicine-jenner-vaccination`
- Content, Storyline, Specification requirements and the full Content reference pack: see `06_The_Boy_the_Cow_and_the_Cure_Content.md` in this directory.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **Smallpox: The Killer Everyone Feared** — intro hook, prior recall and roadmap.
2. **Before Jenner: Risky Protection** — inoculation, variolation and why prevention mattered.
3. **The Cowpox Clue** — Jenner, milkmaids, James Phipps and experimental evidence.
4. **From Experiment to Vaccination** — publication, opposition, religious/social resistance and government role.
5. **A Prevention Breakthrough** — significance, limits and change/continuity.
6. **Exam Prep: Why Vaccination Mattered** — examiner traps, causation chains and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall Renaissance change and establish smallpox as the problem.
- **Proposed content for Episode 6:**
  - PriorKnowledgeRecall: Galen, observation, evidence, public responses to plague
  - Hook: A deadly disease. A country milkmaid rumour. A boy used in an experiment.
  - Roadmap: why Jenner's vaccine mattered, why people resisted it, and why government action made it powerful.
- **Suggested components:** `CinematicRevealMoment`, `PriorKnowledgeRecall`, `WhatYouWillLearn`

### Section 2 — Learning Chunk 1
- **Purpose:** Teach the pre-Jenner context.
- **Proposed content for Episode 6:**
  - Smallpox was deadly and feared
  - Inoculation/variolation gave some protection but carried serious risks
  - Prevention before germ theory relied on observation and probability rather than full scientific understanding
- **Suggested components:** `VisualLearning`, `TheoryCompare`, `QuickRecallScreen`

### Section 3 — Learning Chunk 2
- **Purpose:** Teach Jenner's discovery and evidence.
- **Proposed content for Episode 6:**
  - Jenner noticed milkmaids who caught cowpox seemed protected from smallpox
  - 1796 experiment using cowpox material on James Phipps
  - Later exposure to smallpox did not cause disease
  - Jenner published findings in 1798
- **Suggested components:** `VisualNarrativeScreen`, `InteractiveHotspotImage`, `QuickRecallScreen`

### Section 4 — Learning Chunk 3
- **Purpose:** Explain spread, opposition and government role.
- **Proposed content for Episode 6:**
  - Opposition: fear, religious objections, distrust, anti-vaccination cartoons and medical rivalry
  - Government later promoted vaccination and made it free/compulsory in stages
  - Vaccination worked before doctors understood germs
- **Suggested components:** `GuidedChoiceCarousel`, `MatchingTask`, `QuickRecallScreen`

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — significance and limits.
- **Proposed content for Episode 6:**
  - Change: first effective vaccination; prevention became a powerful medical strategy
  - Continuity: no germ theory yet; resistance remained; treatment of disease still limited
  - Agents: individuals, government, science/technology, communication
- **Suggested components:** `ColSortBlock`, `ExplainReveal`, `QuickRecallScreen`

### Section 6 — Summary & Examiner
- **Purpose:** Exam application and module completion.
- **Proposed content for Episode 6:**
  - Common traps: saying Jenner discovered germs; ignoring government; overstating immediate acceptance
  - Exam practice: explain why Jenner was significant / explain opposition to vaccination
- **Suggested components:** `ExaminerExplainsScreen`, `FaceTheExaminer`, `ChapterCompleteScreen`

### Module Completion Test
- [ ] Section 1 includes retrieval (PriorKnowledgeRecall)
- [ ] Weak spots are generated
- [ ] Every learning chunk includes interaction
- [ ] Every learning chunk includes retrieval
- [ ] Interleaving exists throughout the module
- [ ] Weak spots are revisited in-module
- [ ] Core chapter message is reinforced
- [ ] Examiner content appears only in Section 6
- [ ] Module ends with a completion screen
- [ ] No feature component is used more than twice in the module

---

## 3. Current state & gap analysis

Built as `history-medicine-jenner-vaccination`. Audit against the six-part navigation spine and confirm the final part is exam prep, not passive summary.

---

## 4. Build recommendations

1. Keep the story focused on prevention before germ theory.
2. Make opposition specific, not vague.
3. Link Jenner to the five Medicine agents of change, especially individuals and government.
4. End with exam judgement: Jenner was significant, but acceptance and wider impact depended on later action.
