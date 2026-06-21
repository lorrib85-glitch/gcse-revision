# Episode 12: When Medicine Became Magic — Architecture

## 1. Identity (brief)

- **Episode number:** 12
- **Title:** When Medicine Became Magic
- **Build status:** Built across `mod8` and `mod9`
- Content, Storyline, Specification requirements and the full Content reference pack: see `12_When_Medicine_Became_Magic_Content.md` in this directory.

### Bundling note
Modern medicine and NHS/lifestyle disease content are currently split awkwardly across `mod8` and `mod9`. This episode should focus on modern diagnosis, treatment and access; Episode 13 should handle lung cancer/lifestyle disease.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **Medicine Starts Looking Inside** — intro hook, penicillin/germ theory recall and roadmap.
2. **Diagnosis Gets Powerful** — X-rays, scans, blood tests, DNA and early diagnosis.
3. **Treatment Becomes High-Tech** — transplants, dialysis, keyhole surgery and targeted medicine.
4. **The NHS Changes Access** — 1948, free healthcare, government responsibility and inequality.
5. **Progress With New Problems** — cost, access, lifestyle disease, resistance and ethics.
6. **Exam Prep: Modern Medicine's Big Leap** — examiner traps, factor judgement and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall antibiotics and germ theory; frame modern medicine as diagnosis, treatment and access.
- **Proposed content for Episode 12:** PriorKnowledgeRecall, cinematic scan/transplant hook, roadmap to technology, NHS and limits.
- **Suggested components:** `CinematicRevealMoment`, `PriorKnowledgeRecall`, `WhatYouWillLearn`

### Section 2 — Learning Chunk 1
- **Purpose:** Teach modern diagnosis.
- **Proposed content for Episode 12:** X-rays, CT/MRI/ultrasound, blood tests, DNA, screening and earlier diagnosis.
- **Suggested components:** `VisualLearning`, `InteractiveHotspotImage`, `QuickRecallScreen`

### Section 3 — Learning Chunk 2
- **Purpose:** Teach modern treatment.
- **Proposed content for Episode 12:** transplants, immunosuppressants, dialysis, radiotherapy/chemotherapy overview, keyhole surgery, targeted medicine.
- **Suggested components:** `VisualNarrativeScreen`, `MatchingTask`, `QuickRecallScreen`

### Section 4 — Learning Chunk 3
- **Purpose:** Teach NHS and access.
- **Proposed content for Episode 12:** founding of NHS in 1948, treatment free at point of use, government role, improved access, funding pressures.
- **Suggested components:** `GuidedChoiceCarousel`, `ExplainReveal`, `QuickRecallScreen`

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — significance and limits.
- **Proposed content for Episode 12:** modern medicine is powerful but expensive; prevention still matters; access is not equal; new ethical issues.
- **Suggested components:** `ColSortBlock`, `ExplainReveal`, `QuickRecallScreen`

### Section 6 — Summary & Examiner
- **Purpose:** Exam application and module completion.
- **Proposed content for Episode 12:** traps around "modern medicine solved everything"; explain why modern medicine improved; factor judgement on technology/government/science.
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

Built across `mod8` and `mod9`. Audit boundaries so this module does not drift into Episode 13 lung cancer content.

---

## 4. Build recommendations

1. Keep modern medicine organised as diagnosis, treatment and access.
2. Separate NHS/access from high-tech treatment.
3. Do not overclaim: modern medicine has cost, access and ethics limits.
4. Use Part 6 for factor judgement across technology, science and government.
