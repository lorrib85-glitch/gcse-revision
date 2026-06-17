# Episode 2: The Day Everything Changed — Architecture

## 1. Identity (brief)

- **Episode number:** 2
- **Title:** The Day Everything Changed
- **Build status:** Built as `history-medicine-black-death` (27 screens)
- Content, Storyline, Specification requirements and the full Content reference pack: see `02_The_Day_Everything_Changed_Content.md` in this directory.

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
  - `CinematicRevealMoment` — open on a medieval street scene, people falling ill; narrator: "In 1348, something arrived in England that no physician had a name for."
  - `ChapterHookScreen` (True/False) — "The Black Death killed about one-third of England's population." [TRUE]
  - `PriorKnowledgeRecall` — probe miasma, Four Humours, astrology, God/sin causation from Episode 1

### Section 2 — Learning Chunk 1
- **Purpose:** Introduce the Black Death — arrival, symptoms, scale, and the beliefs applied.
- **Proposed content for this episode:**
  - Arrival: 1348, reached England from Europe via trade routes
  - Symptoms: buboes (painful swollen lymph nodes), fever, vomiting, bleeding under skin; most died within days
  - Scale: approximately one-third of England's population died
  - Beliefs about causes applied: God's punishment, planetary alignment 1345, miasma from cities, humoral imbalance
- **Suggested components:**
  - `VisualNarrativeScreen` — narrative of the Black Death's arrival and spread; dramatic but historically accurate
  - `ExplainReveal` — chain: Black Death arrives → people apply existing beliefs → religion / miasma / astrology / humours → each leads to a different (failed) response
  - `QuickRecallScreen` — "What did medieval people think caused the Black Death?" (multiple correct: God's punishment, bad air/miasma, planetary alignment)

### Section 3 — Learning Chunk 2
- **Purpose:** Develop understanding — the specific treatments and prevention attempts; why they failed.
- **Proposed content for this episode:**
  - Treatments: prayer/confession, flagellation, humoural (purging, bleeding), lancing buboes, transference (live chicken), herbal remedies, quack cures
  - Prevention: carrying posies, bonfires, running away (which spread plague), pilgrimages, flagellation
  - Government quarantine: laws existed but Church and rich people undermined enforcement
  - Real cause revealed: Yersinia pestis, flea bites from black rats — not discovered until 1894
- **Suggested components:**
  - `GuidedChoiceCarousel` — learner plays a medieval physician responding to a Black Death patient; selects treatments; all treatments revealed as ineffective; real cause revealed at end
  - `MatchingTask` — match each medieval belief about cause to the treatment it produced; then match to whether it had any effect
  - `QuickRecallScreen` — retrieval on treatments and their ineffectiveness

### Section 4 — Learning Chunk 3
- **Purpose:** Human experience — the social and religious response; the failure of institutions.
- **Proposed content for this episode:**
  - Flagellants: groups walking between towns, whipping themselves publicly to atone for sin
  - Government quarantine: laws passed; enforcement impossible; rich moved freely; Church ran normally
  - Running away: paradoxically spread the plague to rural areas
  - No individual could make a difference — contrast with Episodes 3–7 where individuals do matter (sets up series arc)
- **Suggested components:**
  - `VisualLearning` — scenes of flagellant processions, deserted streets, plague doctors in beaked masks
  - `MisconceptionCheck` — "The Black Death immediately changed medieval medicine." [FALSE]; "Quarantine was not used until 1665." [FALSE]
  - `QuickRecallScreen` — retrieval on government response and its limitations

### Section 5 — Learning Chunk 4
- **Purpose:** Significance — what the Black Death reveals about medieval medicine and the system's resilience.
- **Proposed content for this episode:**
  - The core argument: the belief system had no mechanism for self-correction
  - Medicine remained essentially unchanged after 1348 — continuity, not change
  - Contrast: one-third of England died vs. zero medical progress resulted
  - The agents of change that are ABSENT here: 🔬 Science & technology, 🏛️ Government (present but impotent), 👤 Individuals (no individual could help) — only ⛪ Religion and ⚔️ War (indirect) are present
  - Forward link to Ep 3: change comes not from catastrophe but from the Reformation and printing press
- **Suggested components:**
  - `ColSortBlock` — sort responses to the Black Death into "same as before the plague" vs "new response" (most will sort to "same as before")
  - `ExplainReveal` — chain: catastrophe (one-third of England dies) → no mechanism for self-correction → medicine unchanged → continuity
  - `QuickRecallScreen` — final retrieval across all episode concepts

### Section 6 — Summary & Examiner
- **Purpose:** Exam application — comparison questions, misconception correction, module completion.
- **Proposed content for this episode:**
  - Exam technique: how to answer "how similar" source-comparison questions (find similarity + difference + overall judgement)
  - Question type: compare Black Death 1348 with Great Plague 1665 (Episode 5) — similarity high; slight increase in government enforcement 1665
  - MisconceptionCheck items from above
- **Suggested components:**
  - `ExaminerExplainsScreen` — examiner explains how to structure a "how similar were reactions" answer
  - `FaceTheExaminer` — source-comparison question on Black Death responses
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

Known screen tags from `src/modules.js`: `plague-explanations` (s9), remaining 26 screens have `null` tags.

**Inventory (tags only — full screen content in `src/modules/history.js`):**
- s9 `plague-explanations` → Section 2 or 3 — covers beliefs about causes ✓

**GAPS (proposed content not confirmed by existing tags):**
- No `flagellants` or `flagellation` tag — self-flagellation response coverage unconfirmed
- No `quarantine` tag — government quarantine response unconfirmed
- No `black-death-treatments` tag — treatment coverage unconfirmed
- No `real-cause` or `yersinia` tag — reveal of actual cause unconfirmed
- No `continuity` or `no-change` tag — the core argument (medicine unchanged by Black Death) unconfirmed
- Section 1 tags absent — PriorKnowledgeRecall targeting Ep 1 concepts unconfirmed

---

## 4. Build recommendations

1. **Storyline integration (⛪ Religion + 🏛️ Government agents):** The Core takeaway — "the Black Death didn't change medieval medicine" — should be threaded as: Section 1 hook creates expectation of change; Section 3 reveals treatments failed; Section 5 delivers the payoff ("and yet nothing changed"). Verify s9 `plague-explanations` explicitly sets up the "beliefs applied to crisis" framing, not just lists the beliefs.

2. **Real cause reveal (🔬 Science & technology agent — ABSENT):** There should be a moment when the real cause (flea/rat/Yersinia pestis, identified 1894) is revealed cinematically — this is the most dramatic "aha" moment in the episode. The contrast between what medieval people believed and what was actually happening should land with weight. Add a dedicated `real-cause` tagged screen if not present.

3. **Government quarantine screen (🏛️ Government):** Government quarantine in 1348 is directly compared to 1665 in exam questions. Needs a dedicated screen covering: laws passed, Church ran normally, rich moved freely, quarantine failed. Tag: `quarantine-1348`.

4. **Interleaving from Episode 1 (⛪ Religion):** PriorKnowledgeRecall should explicitly target `four-humours`, `miasma`, and `galen` tags from Episode 1 — the weakness tracker should feed forward so learners who struggled with Ep 1 concepts get recovery before they're applied in crisis context.

5. **Core takeaway reinforcement at end (Section 5):** The "medicine didn't change" argument needs a dedicated `continuity` tagged screen — ideally a `ColSortBlock` or `ExplainReveal` that makes learners explicitly articulate this before Section 6.

6. **Episode 5 handoff (Great Plague comparison):** End of Episode 2 should note: "Three hundred years later, London will face another plague. The question is — will anything have changed?" Sets up Episode 5 and the source-comparison exam question.
