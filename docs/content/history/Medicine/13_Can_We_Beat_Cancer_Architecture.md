# Episode 13: Can We Beat Cancer? — Architecture

## 1. Identity (brief)

- **Episode number:** 13
- **Title:** Can We Beat Cancer?
- **Build status:** Built (shared) in `history-medicine-cancer` (formerly `mod9`)
- Content, Storyline, Specification requirements and the full Content reference pack: see `13_Can_We_Beat_Cancer_Content.md` in this directory.

### Bundling note
Cancer/lifestyle disease content currently sits with NHS/modern medicine. It should become its own focused module so students can handle modern prevention, diagnosis and treatment without blurring it with the NHS founding story.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **The Disease Modern Medicine Still Fights** — intro hook, modern medicine recall and roadmap.
2. **What Makes Lung Cancer Different?** — risk factors, smoking, lifestyle disease and causation.
3. **Finding Cancer Earlier** — scans, screening, symptoms, diagnosis and public health campaigns.
4. **Treating the Hard Cases** — surgery, radiotherapy, chemotherapy, targeted treatment and limits.
5. **Prevention, Choice and Society** — government action, individual behaviour, inequality and judgement.
6. **Exam Prep: Lifestyle Disease and Modern Limits** — examiner traps, factor judgement and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall modern diagnosis/treatment and frame cancer as a continuing challenge.
- **Proposed content for Episode 13:** PriorKnowledgeRecall, lung/cancer hook, roadmap to risk, diagnosis, treatment and prevention.
- **Suggested components:** `CinematicRevealMoment`, `PriorKnowledgeRecall`, `WhatYouWillLearn`

### Section 2 — Learning Chunk 1
- **Purpose:** Teach causes and risk factors.
- **Proposed content for Episode 13:** lung cancer, smoking, lifestyle disease, environmental factors, correlation vs causation, Richard Doll.
- **Suggested components:** `VisualLearning`, `TheoryCompare`, `QuickRecallScreen`

### Section 3 — Learning Chunk 2
- **Purpose:** Teach diagnosis and detection.
- **Proposed content for Episode 13:** X-rays/scans, biopsies, blood tests, symptom awareness, screening where relevant, earlier diagnosis.
- **Suggested components:** `VisualNarrativeScreen`, `InteractiveHotspotImage`, `QuickRecallScreen`

### Section 4 — Learning Chunk 3
- **Purpose:** Teach treatment.
- **Proposed content for Episode 13:** surgery, radiotherapy, chemotherapy, immunotherapy/targeted therapy overview, side effects and survival limits.
- **Suggested components:** `GuidedChoiceCarousel`, `MatchingTask`, `QuickRecallScreen`

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — prevention and society.
- **Proposed content for Episode 13:** anti-smoking campaigns, advertising bans, taxation, individual behaviour, inequality, government vs individual responsibility.
- **Suggested components:** `ColSortBlock`, `ExplainReveal`, `QuickRecallScreen`

### Section 6 — Summary & Examiner
- **Purpose:** Exam application and module completion.
- **Proposed content for Episode 13:** traps around blaming individuals only; explain modern disease prevention; how far government/technology/individuals improved cancer outcomes.
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

Built in shared `history-medicine-cancer` (formerly `mod9`). Audit that lung cancer/lifestyle disease becomes a clean episode and is not buried after NHS content.

---

## 4. Build recommendations

1. Keep this as a modern prevention and limits module, not just a cancer treatment explainer.
2. Include Richard Doll/smoking evidence if the content file specifies it.
3. Balance individual lifestyle with government, industry and inequality.
4. Use Part 6 for factor judgement and causation answers.
