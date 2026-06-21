# Episode 7: The Invisible Enemy — Architecture

## 1. Identity (brief)

- **Episode number:** 7
- **Title:** The Invisible Enemy
- **Build status:** Built as `history-medicine-germ-theory`
- Content, Storyline, Specification requirements and the full Content reference pack: see `07_The_Invisible_Enemy_Content.md` in this directory.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **Something Smaller Than Sight** — intro hook, Jenner/Renaissance recall and roadmap.
2. **Before Germ Theory: Bad Air Still Rules** — miasma and old explanations before Pasteur.
3. **Pasteur Finds the Enemy** — fermentation, microbes and the germ theory breakthrough.
4. **Koch Hunts Specific Killers** — staining, microscopes, culture dishes and specific bacteria.
5. **Changing Medicine's Direction** — impact on prevention, surgery and public health; limits.
6. **Exam Prep: From Miasma to Microbes** — examiner traps, causation chains and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall Jenner and older disease explanations; create curiosity about invisible causes.
- **Proposed content for Episode 7:**
  - PriorKnowledgeRecall: miasma, vaccination before germ theory, science/technology as an agent of change
  - Hook: People blamed bad air for centuries. What if the real enemy was alive and invisible?
  - Roadmap: students learn Pasteur, Koch and why germ theory changed the direction of medicine.
- **Suggested components:** `CinematicRevealMoment`, `PriorKnowledgeRecall`, `WhatYouWillLearn`

### Section 2 — Learning Chunk 1
- **Purpose:** Establish what germ theory replaced.
- **Proposed content for Episode 7:**
  - Miasma still dominated explanations
  - Spontaneous generation was believed by many
  - Industrial/public health problems made disease causation urgent
  - Jenner had worked without knowing about germs
- **Suggested components:** `TheoryCompare`, `VisualLearning`, `QuickRecallScreen`

### Section 3 — Learning Chunk 2
- **Purpose:** Teach Pasteur's breakthrough.
- **Proposed content for Episode 7:**
  - Pasteur's work on fermentation and microbes
  - Swan-neck flask experiment challenged spontaneous generation
  - Germ theory: microbes cause decay and disease
  - Initially more important for explanation than immediate treatment
- **Suggested components:** `VisualNarrativeScreen`, `InteractiveHotspotImage`, `QuickRecallScreen`

### Section 4 — Learning Chunk 3
- **Purpose:** Teach Koch's contribution and specific disease causation.
- **Proposed content for Episode 7:**
  - Koch developed methods to identify specific bacteria
  - Anthrax, tuberculosis and cholera
  - Staining, culturing bacteria and microscopy
  - Koch made germ theory more precise and persuasive
- **Suggested components:** `GuidedChoiceCarousel`, `MatchingTask`, `QuickRecallScreen`

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — significance and limits.
- **Proposed content for Episode 7:**
  - Change: disease causation transformed; prevention and surgery could improve
  - Limits: treatments lagged behind; antibiotics came later
  - Agents: science & technology, individuals, communication, government later
- **Suggested components:** `ColSortBlock`, `ExplainReveal`, `QuickRecallScreen`

### Section 6 — Summary & Examiner
- **Purpose:** Exam application and module completion.
- **Proposed content for Episode 7:**
  - Common traps: saying Pasteur invented vaccines generally; confusing Pasteur and Koch; claiming instant cures
  - Exam practice: explain why germ theory was important / compare Pasteur and Koch
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

Built as `history-medicine-germ-theory`. Audit against the six-part navigation spine and confirm the final part explicitly trains exam application.

---

## 4. Build recommendations

1. Keep Pasteur and Koch distinct: Pasteur explains germs; Koch identifies specific germs.
2. Revisit miasma repeatedly so the conceptual shift is obvious.
3. Do not imply instant cures — germ theory changes understanding first.
4. Use Part 6 to train cause/significance answers.
