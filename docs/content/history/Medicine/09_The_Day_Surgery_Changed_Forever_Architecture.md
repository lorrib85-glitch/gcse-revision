# Episode 9: The Day Surgery Changed Forever — Architecture

## 1. Identity (brief)

- **Episode number:** 9
- **Title:** The Day Surgery Changed Forever
- **Build status:** Built across `mod3` and `mod6`
- Content, Storyline, Specification requirements and the full Content reference pack: see `09_The_Day_Surgery_Changed_Forever_Content.md` in this directory.

### Bundling note
Surgery is currently split across two built modules. The clean Medicine spine should either merge them into one Episode 9 module or make the two halves feel like one coherent surgery journey.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **The Three Enemies of Surgery** — intro hook, germ theory/anatomy recall and roadmap.
2. **Pain: The Patient's Nightmare** — anaesthetics, ether, chloroform and Simpson.
3. **Infection: The Invisible Killer** — antiseptics, Lister and carbolic acid.
4. **Blood Loss and Better Technique** — remaining problems, transfusion limits and improved surgical practice.
5. **From Last Resort to Real Treatment** — significance, opposition and change/continuity.
6. **Exam Prep: Why Surgery Improved** — examiner traps, factor judgement and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall anatomy/germ theory and frame surgery around pain, infection and blood loss.
- **Proposed content for Episode 9:** PriorKnowledgeRecall, dramatic surgery hook, roadmap to anaesthetics, antiseptics and limits.
- **Suggested components:** `CinematicRevealMoment`, `PriorKnowledgeRecall`, `WhatYouWillLearn`

### Section 2 — Learning Chunk 1
- **Purpose:** Teach the problem of pain and anaesthetic breakthrough.
- **Proposed content for Episode 9:** pre-anaesthetic speed surgery, ether, chloroform, Simpson, Queen Victoria, opposition and dosage risks.
- **Suggested components:** `VisualLearning`, `GuidedChoiceCarousel`, `QuickRecallScreen`

### Section 3 — Learning Chunk 2
- **Purpose:** Teach infection and antiseptics.
- **Proposed content for Episode 9:** germ theory link, Lister, carbolic acid spray, reduced infection rates, resistance from surgeons.
- **Suggested components:** `VisualNarrativeScreen`, `InteractiveHotspotImage`, `QuickRecallScreen`

### Section 4 — Learning Chunk 3
- **Purpose:** Teach remaining limits.
- **Proposed content for Episode 9:** blood loss, transfusion problems, lack of blood groups until 1901, aseptic surgery, cleaner operating environments.
- **Suggested components:** `MatchingTask`, `ExplainReveal`, `QuickRecallScreen`

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — significance and factors.
- **Proposed content for Episode 9:** surgery became safer and more ambitious; change depended on science, individuals, technology and acceptance.
- **Suggested components:** `ColSortBlock`, `ExplainReveal`, `QuickRecallScreen`

### Section 6 — Summary & Examiner
- **Purpose:** Exam application and module completion.
- **Proposed content for Episode 9:** traps around anaesthetic vs antiseptic; explain why surgery improved; how far science/individuals mattered.
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

Built across `mod3` and `mod6`. Audit that pain, infection and blood loss all appear clearly and that the final section is exam prep.

---

## 4. Build recommendations

1. Keep pain, infection and blood loss as the organising mental model.
2. Separate Simpson and Lister clearly.
3. Do not imply all surgical problems were solved at once.
4. Use Part 6 for factor judgement and causation chains.
