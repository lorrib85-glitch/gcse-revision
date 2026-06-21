# Episode 11: The Accidental Miracle — Architecture

## 1. Identity (brief)

- **Episode number:** 11
- **Title:** The Accidental Miracle
- **Build status:** Built as `mod7`
- Content, Storyline, Specification requirements and the full Content reference pack: see `11_The_Accidental_Miracle_Content.md` in this directory.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **The Mould That Shouldn't Matter** — intro hook, germ theory/surgery recall and roadmap.
2. **Before Antibiotics: Infection Wins** — limits of antiseptics, magic bullets and bacterial infection.
3. **Fleming Notices the Accident** — discovery of penicillin and why it stalled.
4. **Florey, Chain and Mass Production** — teamwork, funding, war and American industry.
5. **A New Age of Treatment** — significance, limits, resistance and change/continuity.
6. **Exam Prep: Accident or Team Effort?** — examiner traps, factor judgement and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall germ theory and surgery; frame penicillin as treatment breakthrough.
- **Proposed content for Episode 11:** PriorKnowledgeRecall, mould discovery hook, roadmap to Fleming, Florey/Chain, war and mass production.
- **Suggested components:** `CinematicRevealMoment`, `PriorKnowledgeRecall`, `WhatYouWillLearn`

### Section 2 — Learning Chunk 1
- **Purpose:** Teach the medical problem before antibiotics.
- **Proposed content for Episode 11:** bacterial infection, antiseptics limits, Ehrlich/magic bullets, Salvarsan, need for safer broad treatment.
- **Suggested components:** `VisualLearning`, `TheoryCompare`, `QuickRecallScreen`

### Section 3 — Learning Chunk 2
- **Purpose:** Teach Fleming's discovery and limits.
- **Proposed content for Episode 11:** 1928 mould observation, penicillin killing bacteria, Fleming could not purify/mass produce it.
- **Suggested components:** `VisualNarrativeScreen`, `InteractiveHotspotImage`, `QuickRecallScreen`

### Section 4 — Learning Chunk 3
- **Purpose:** Teach development and production.
- **Proposed content for Episode 11:** Florey and Chain, Oxford team, trials, Second World War urgency, US funding and pharmaceutical production.
- **Suggested components:** `GuidedChoiceCarousel`, `MatchingTask`, `QuickRecallScreen`

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — significance and limits.
- **Proposed content for Episode 11:** antibiotics transformed treatment; war/government/industry mattered; antibiotic resistance as modern limit.
- **Suggested components:** `ColSortBlock`, `ExplainReveal`, `QuickRecallScreen`

### Section 6 — Summary & Examiner
- **Purpose:** Exam application and module completion.
- **Proposed content for Episode 11:** traps around Fleming-only answers; explain why penicillin was developed; factor judgement on war, individuals, science and government.
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

Built as `mod7`. Audit that the module does not over-credit Fleming and that Part 6 trains factor judgement.

---

## 4. Build recommendations

1. Make penicillin a chain of events, not a single genius discovery.
2. Use war as an accelerator, not the original cause of discovery.
3. Include Florey, Chain, funding and mass production clearly.
4. Make Part 6 practise "explain why" and "how far" style judgement.
