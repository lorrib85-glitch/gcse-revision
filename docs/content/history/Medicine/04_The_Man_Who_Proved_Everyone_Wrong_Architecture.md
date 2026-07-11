# Episode 4: The Man Who Proved Everyone Wrong — Architecture

## 1. Identity (brief)

- **Episode number:** 4
- **Title:** The Man Who Proved Everyone Wrong
- **Build status:** Built as clean runtime `history-medicine-harvey-pare-renaissance-method`; Harvey is dominant and Paré has explicit supporting coverage.
- Content, Storyline, Specification requirements and the full Content reference pack: see `04_The_Man_Who_Proved_Everyone_Wrong_Content.md` in this directory.

### Runtime note
Episode 4 now has its own clean runtime. Harvey is the dominant narrative, with Paré included as explicit supporting evidence for Renaissance observation/trial in surgery. The older shared bundle is retained only as hidden legacy compatibility content.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **A Body Full of Questions** — intro hook, Vesalius recall and roadmap.
2. **The Old Blood Story** — Galen's ideas about blood, liver, heart and invisible pores.
3. **Harvey Follows the Evidence** — circulation, valves, experiments and observation.
4. **Why Proof Was Hard to Ignore** — mathematics, repeated testing and challenge to authority.
5. **A Discovery Ahead of Its Time** — significance, limits and continuity in treatment.
6. **Exam Prep: Proving Galen Wrong** — examiner traps, evidence chains and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall Vesalius and Galen; establish Harvey as the next challenge to old authority.
- **Proposed content for Episode 4:**
  - PriorKnowledgeRecall: Vesalius, Galen's errors, observation, dissection, printing press
  - Hook: What if the most respected doctor in history was wrong about how blood moved?
  - Roadmap: students should understand how Harvey used evidence to prove circulation but did not immediately transform treatment.
- **Suggested components:**
  - `CinematicRevealMoment` — Harvey studying a beating heart / pulse in a candlelit room
  - `PriorKnowledgeRecall`
  - `WhatYouWillLearn`

### Section 2 — Learning Chunk 1
- **Purpose:** Explain the old Galenic model Harvey challenged.
- **Proposed content for Episode 4:**
  - Galen believed blood was made in the liver and used up by the body
  - Galen believed blood passed through invisible pores in the septum of the heart
  - These ideas fitted older humoural thinking and long-standing authority
  - Students should see why challenging this was risky and significant
- **Suggested components:**
  - `VisualLearning` — old model of blood movement presented as a flawed map
  - `TheoryCompare` — Galen's model vs Harvey's model
  - `QuickRecallScreen`

### Section 3 — Learning Chunk 2
- **Purpose:** Teach Harvey's discovery and method.
- **Proposed content for Episode 4:**
  - Harvey discovered blood circulates around the body
  - Heart acts as a pump
  - Valves in veins show blood flows one way
  - Harvey used observation, dissection, experiments and calculation of blood volume
  - Published *An Anatomical Account of the Motion of the Heart and Blood* in 1628
- **Suggested components:**
  - `InteractiveHotspotImage` — heart/vein valve diagram with tappable evidence points
  - `ExplainReveal` — pump → one-way valves → too much blood to be constantly produced → circulation
  - `QuickRecallScreen`

### Section 4 — Learning Chunk 3
- **Purpose:** Show why Harvey's evidence mattered.
- **Proposed content for Episode 4:**
  - Scientific method: repeated observation and testing
  - Mathematical reasoning made Galen's model impossible
  - Renaissance climate made challenge more possible than in medieval period
  - But many doctors resisted because Galen still had authority
- **Suggested components:**
  - `GuidedChoiceCarousel` — choose the strongest evidence against Galen
  - `MatchingTask` — evidence point to conclusion
  - `QuickRecallScreen`

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — significance and limits.
- **Proposed content for Episode 4:**
  - Change: improved understanding of physiology and circulation
  - Continuity: treatments did not immediately improve; no blood transfusions or modern surgery yet
  - Limits: Harvey could not explain capillaries because microscopes were not yet powerful enough
  - Agents of change: Individuals, science & technology, Renaissance questioning
- **Suggested components:**
  - `ColSortBlock` — immediate impact vs later significance
  - `ExplainReveal` — why discovering circulation did not instantly cure disease
  - `QuickRecallScreen`

### Section 6 — Summary & Examiner
- **Purpose:** Exam application and module completion.
- **Proposed content for Episode 4:**
  - Common traps: saying Harvey improved treatment immediately; forgetting Galen's specific wrong idea; treating Vesalius and Harvey as the same discovery
  - Exam practice: explain why Harvey was significant / how far Renaissance medicine changed understanding of the body
  - Students should use evidence chain language: valves, pump, calculation, circulation, challenge to Galen
- **Suggested components:**
  - `ExaminerExplainsScreen`
  - `FaceTheExaminer`
  - `ChapterCompleteScreen`

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

Built inside `history-medicine-renaissance-medicine` (formerly `mod2`). Episode 4 should be split into its own module so Harvey's evidence chain is not crowded by Vesalius or Great Plague content.

**Audit priority:** confirm the module teaches Harvey's method, not just the headline discovery.

---

## 4. Build recommendations

1. **Teach the evidence chain visually:** Harvey is memorable when students see why Galen's model collapses.

2. **Protect the significance/limits distinction:** This is the main exam risk. Harvey changed understanding more than treatment.

3. **Interleave Vesalius:** Vesalius challenged anatomy; Harvey challenged physiology. Students need that contrast.

4. **Keep Part 6 exam-only:** No new Harvey content should appear in the final part.
