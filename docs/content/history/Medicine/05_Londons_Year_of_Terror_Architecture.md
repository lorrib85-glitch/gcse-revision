# Episode 5: London's Year of Terror — Architecture

## 1. Identity (brief)

- **Episode number:** 5
- **Title:** London's Year of Terror
- **Build status:** Built (shared) as `history-medicine-renaissance-medicine` (formerly `history-medicine-renaissance-medicine`) — also covers Episodes 3 (Vesalius) and 4 (Harvey)
- Content, Storyline, Specification requirements and the full Content reference pack: see `05_Londons_Year_of_Terror_Content.md` in this directory.

### Bundling note
`history-medicine-renaissance-medicine` currently covers Episodes 3, 4 and 5 in one module. The series map recommends splitting the 1665 Great Plague into its own clear module so students can compare it properly with the Black Death.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **Plague Returns to the Capital** — intro hook, Black Death/Renaissance recall and roadmap.
2. **London Under Infection** — 1665 context, symptoms, spread and Bills of Mortality.
3. **Old Explanations, New City** — miasma, God, astrology and continuity from 1348.
4. **Shut the Door and Mark the House** — quarantine, searchers, watchmen, pest houses and public orders.
5. **More Organised, Still Not Modern** — change/continuity and government action.
6. **Exam Prep: Compare Two Plagues** — examiner traps, similarity/difference judgement and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall Black Death and Renaissance knowledge; frame 1665 as a comparison case.
- **Proposed content for Episode 5:**
  - PriorKnowledgeRecall: Black Death causes/treatments/prevention; Renaissance challenge to Galen
  - Hook: More than 300 years after the Black Death, plague returns — had medicine actually improved?
  - Roadmap: students compare continuity and change between 1348 and 1665.
- **Suggested components:**
  - `CinematicRevealMoment` — London street with shut-up houses and plague marks, restrained/no gore
  - `PriorKnowledgeRecall`
  - `WhatYouWillLearn`

### Section 2 — Learning Chunk 1
- **Purpose:** Establish the Great Plague context and scale.
- **Proposed content for Episode 5:**
  - 1665 outbreak in London
  - Symptoms and fear similar to earlier plague outbreaks
  - Bills of Mortality recorded deaths and made the crisis visible
  - Dense urban conditions helped disease spread
- **Suggested components:**
  - `VisualNarrativeScreen`
  - `InteractiveHotspotImage` — London street / Bills of Mortality clues
  - `QuickRecallScreen`

### Section 3 — Learning Chunk 2
- **Purpose:** Develop understanding of continuity in explanations.
- **Proposed content for Episode 5:**
  - Many people still blamed miasma, God or astrology
  - Germ theory did not yet exist
  - Some practical observations existed, but causes were still misunderstood
  - Link back to Black Death and medieval explanations
- **Suggested components:**
  - `TheoryCompare` — 1348 vs 1665 explanations
  - `MatchingTask` — belief to prevention/treatment response
  - `QuickRecallScreen`

### Section 4 — Learning Chunk 3
- **Purpose:** Teach public responses and prevention.
- **Proposed content for Episode 5:**
  - Shutting up infected houses
  - Watchmen, searchers and examiners
  - Killing cats/dogs, cleaning streets, lighting fires, carrying herbs
  - Pest houses and quarantine-type measures
  - Limits and cruelty of policies
- **Suggested components:**
  - `GuidedChoiceCarousel` — act as city official choosing plague responses
  - `ColSortBlock` — practical / miasma-based / religious responses
  - `QuickRecallScreen`

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — judge change and continuity.
- **Proposed content for Episode 5:**
  - Change: more organised local government response and recording of deaths
  - Continuity: causes still misunderstood; miasma and religion remained influential
  - Compared with Black Death: prevention more systematic, medicine still limited
  - Agents: Government, religion, science & technology not yet transformative
- **Suggested components:**
  - `ColSortBlock` — changed since 1348 / stayed the same
  - `ExplainReveal` — why better organisation did not mean medical understanding
  - `QuickRecallScreen`

### Section 6 — Summary & Examiner
- **Purpose:** Exam application, comparison skill and module completion.
- **Proposed content for Episode 5:**
  - Common traps: saying 1665 was medically modern; forgetting government role; confusing public health with cure
  - Exam practice: similarity/difference between Black Death and Great Plague responses; explain government action
  - Students should use comparative language: whereas, similarly, however, more organised, still limited
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

Built inside shared `history-medicine-renaissance-medicine`. Episode 5 needs a clean module boundary because comparison with the Black Death is a high-value exam skill.

**Audit priority:** confirm public-health measures are explicit and not just atmospheric background detail.

---

## 4. Build recommendations

1. **Make comparison unavoidable:** Navigation and retrieval should repeatedly connect 1348 and 1665.

2. **Separate public health from treatment:** Students need to understand that government action can improve prevention while medical causation remains wrong.

3. **Use Bills of Mortality carefully:** They are useful as evidence of organisation and fear, not proof of germ theory.

4. **Part 6 should train comparison answers:** This is the best exam payoff for the episode.
