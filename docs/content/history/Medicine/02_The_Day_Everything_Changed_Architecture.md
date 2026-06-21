# Episode 2: The Day Everything Changed — Architecture

## 1. Identity (brief)

- **Episode number:** 2
- **Title:** The Day Everything Changed
- **Build status:** Built as `history-medicine-black-death` (27 screens)
- Content, Storyline, Specification requirements and the full Content reference pack: see `02_The_Day_Everything_Changed_Content.md` in this directory.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **The Ship That Changed England** — intro hook, Episode 1 recall and roadmap.
2. **What Was the Black Death?** — arrival, spread, symptoms and scale of mortality.
3. **How Medieval Minds Explained It** — miasma, God, astrology and Four Humours under pressure.
4. **Treatments in a World Without Germs** — prayer, charms, bloodletting, fleeing and practical attempts.
5. **Changed by Disaster?** — consequences, continuity, prevention and public-health responses.
6. **Exam Prep: Crisis, Continuity and Change** — examiner traps, source thinking and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity, reactivate Episode 1 knowledge, generate weak spots, preview the chapter.
- **Proposed content for this episode:**
  - Hook: Something arrives in 1348 that kills one-third of England — what do you do when you have no idea what it is?
  - PriorKnowledgeRecall: Recall concepts from Episode 1 (Four Humours, miasma, astrology, role of the Church, three types of medic)
  - Concepts to probe: miasma, Four Humours, God/sin causation, astrology, quarantine
  - WhatYouWillLearn: preview the central question — "When the biggest crisis in medieval history arrived, did medicine rise to meet it?"
- **Suggested components:**
  - `CinematicRevealMoment` — plague ship arriving at a medieval English port; quiet dread, no gore
  - `ChapterHookScreen` (True/False) — e.g. "People in 1348 understood that rats and fleas spread the Black Death." [FALSE]
  - `PriorKnowledgeRecall` — pull forward causes/treatments from Episode 1

### Section 2 — Learning Chunk 1
- **Purpose:** Establish what the Black Death was and how it spread.
- **Proposed content for this episode:**
  - 1348 arrival in England; spread via trade and movement
  - Symptoms: buboes, fever, vomiting, black blotches; death often within days
  - Scale: around one-third to half of population died in parts of Europe/England
  - Modern explanation: bacteria carried by fleas on rats (but medieval people did not know this)
- **Suggested components:**
  - `VisualNarrativeScreen` — route from port to town; tension through movement, not gore
  - `InteractiveHotspotImage` — plague street/port image with tappable clues: rats, cargo, cramped houses, people fleeing
  - `QuickRecallScreen` — symptoms and spread retrieval

### Section 3 — Learning Chunk 2
- **Purpose:** Develop understanding — why medieval explanations made sense to people at the time.
- **Proposed content for this episode:**
  - Religious explanation: punishment from God; processions, prayer, confession
  - Miasma: bad air from rotting matter and foul smells
  - Astrology: unusual alignment of planets as a cause or warning
  - Four Humours: imbalance explaining sickness symptoms
  - Why these explanations fitted Episode 1's worldview
- **Suggested components:**
  - `TheoryCompare` — medieval explanation vs modern explanation
  - `MatchingTask` — match explanation to action/treatment
  - `ExplainReveal` — why wrong ideas felt logical

### Section 4 — Learning Chunk 3
- **Purpose:** Human experience — what people tried to do about the plague.
- **Proposed content for this episode:**
  - Treatments: prayer, fasting, flagellation, charms, bloodletting, lancing buboes, herbal remedies
  - Prevention: carry sweet-smelling herbs, clean streets, avoid bad air, quarantine/isolation, flee infected areas
  - Local government action: attempts to clean streets and limit spread
  - Limits: no germ theory, no antibiotics, no clear transmission model
- **Suggested components:**
  - `GuidedChoiceCarousel` — learner chooses medieval responses and sees why each made sense then
  - `ColSortBlock` — sort actions into religious / miasma / practical prevention
  - `QuickRecallScreen` — treatment and prevention retrieval

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — significance, consequences, change/continuity.
- **Proposed content for this episode:**
  - Continuity: reliance on religion, miasma and Four Humours remained strong
  - Change: greater urgency around public health, local action, quarantine-type thinking
  - Social/economic impact: labour shortage and disruption (only where useful for medical significance)
  - Core judgement: the Black Death exposed the limits of medieval medicine more than it transformed it
- **Suggested components:**
  - `ColSortBlock` — changed / stayed the same after the Black Death
  - `ExplainReveal` — "Why didn't such a huge disaster immediately change medicine?"
  - `QuickRecallScreen` — chapter-level retrieval

### Section 6 — Summary & Examiner
- **Purpose:** Exam application, source thinking, misconceptions, module completion.
- **Proposed content for this episode:**
  - Common traps: saying "nothing changed" too absolutely; assuming medieval people were stupid; mixing up cause, treatment and prevention
  - Exam practice: "Explain why attempts to treat the Black Death were limited" / "How far did the Black Death change medicine?"
  - Source-use angle: medieval images/accounts often show beliefs and responses, not scientific causes
- **Suggested components:**
  - `ExaminerExplainsScreen` — cause/treatment/prevention distinction
  - `FaceTheExaminer` — explain/change question using precise Edexcel language
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

Built as `history-medicine-black-death` — 27 screens.

**Audit priority:** verify that the existing built module maps cleanly to the six-section architecture above and that its final section is explicitly exam-prep, not just a summary.

---

## 4. Build recommendations

1. **Keep gore low and dread high:** The module should feel frightening because of uncertainty, speed and scale, not because of graphic imagery.

2. **Use Episode 1 interleaving:** Miasma, Four Humours, Church influence and astrology should repeatedly reappear so the student sees the Black Death as a stress-test of medieval medicine.

3. **Protect exam categories:** Keep causes, treatments and prevention visually and conceptually separate. Students often blur these in answers.

4. **End with judgement:** The core answer should be: the Black Death caused some public-health actions and urgency, but medical ideas largely continued.
