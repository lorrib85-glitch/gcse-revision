# Episode 5: London's Year of Terror — Architecture

## 1. Identity (brief)

- **Episode number:** 5
- **Title:** London's Year of Terror
- **Build status:** Built (shared) as `mod2` — also covers Episodes 3 (Vesalius) and 4 (Harvey). Separate module `history-medicine-great-plague` exists in modules.js with 0 screens — not yet built as standalone.
- Content, Storyline, Specification requirements and the full Content reference pack: see `05_Londons_Year_of_Terror_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall Black Death responses (Episode 2); create curiosity about whether anything changed in 300 years; preview the episode.
- **Proposed content for Episode 5:**
  - PriorKnowledgeRecall: probe plague-explanations (Ep 2), miasma, four-humours, quarantine, flagellation — all will reappear
  - Hook: "It is 1665. A new plague strikes London. You've just learned about the Black Death of 1348. Have any of the treatments changed?"
- **Suggested components:**
  - `CinematicRevealMoment` — London street 1665; plague doctor walking in beaked mask; caption: "Three hundred years had passed. Nothing had changed."
  - `ChapterHookScreen` (True/False) — "People in 1665 blamed the Great Plague on bad air." [TRUE]
  - `PriorKnowledgeRecall` — target: plague-explanations, miasma, quarantine from Episode 2

### Section 2 — Learning Chunk 1
- **Purpose:** The Great Plague — context, scale, and beliefs about causes.
- **Proposed content for Episode 5:**
  - Great Plague 1665; spread across England; London worst affected
  - Beliefs: God's punishment, planetary alignment (October/November 1664), miasma from rubbish/sewage
  - Same as 1348 — the core continuity argument begins here
- **Suggested components:**
  - `VisualLearning` — cinematic London 1665 street scenes; contrast with 1348 imagery from Episode 2
  - `QuickRecallScreen` — "What did people in 1665 believe caused the plague?" (retrieval mirrors Episode 2 content)

### Section 3 — Learning Chunk 2
- **Purpose:** Treatments and prevention in 1665 — continuity and limited change.
- **Proposed content for Episode 5:**
  - Treatments: woolly clothes/fire to sweat out disease; transference (live chicken); herbal remedies; quack doctors
  - Prevention: pomanders (sweet herbs); bonfires; prayer; fasting; garlic diet; plague doctors (beaked masks, wax coats)
  - Government orders: quarantine, crowd bans, stray animals killed, searchers appointed, streets cleaned, red cross on doors
- **Suggested components:**
  - `InteractiveCollectionExplorer` — plague response categories: Religious / Purifying the air / Government / Medical; explore each
  - `MatchingTask` — match 1665 prevention measure to the belief it was based on (e.g. pomander → miasma)

### Section 4 — Learning Chunk 3
- **Purpose:** Comparing 1348 and 1665 — the signature exam skill.
- **Proposed content for Episode 5:**
  - Side-by-side: Black Death 1348 vs. Great Plague 1665
  - Similarities: same beliefs (miasma, God, astrology), same responses (prayer, herbs, running away), same quarantine (poorly enforced → better enforced)
  - Differences: 1665 government more systematic (searchers, animal killing, crowd bans); transference and quack doctors more prominent in 1665 sources
  - The exam framing: "How similar?" → judgement: overwhelmingly similar because beliefs unchanged
- **Suggested components:**
  - `TheoryCompareBlock` — side-by-side comparison: 1348 beliefs and responses vs. 1665 beliefs and responses; staggered reveal
  - `MisconceptionCheck` — "The Great Plague had very different responses from the Black Death" [FALSE]; "Plague doctors' masks were based on understanding of infection" [FALSE]

### Section 5 — Learning Chunk 4
- **Purpose:** The significance of continuity — what this tells us about the limits of Renaissance medicine.
- **Proposed content for Episode 5:**
  - Despite Vesalius (Ep 3) and Harvey (Ep 4), ordinary medicine in a crisis was unchanged
  - The one real change: government organisation (🏛️ Government agent) — more systematic public health measures
  - Forward link: this government action grows into Chadwick (1842) and the Public Health Acts (1848, 1875) in Episode 8
  - Agents absent: 🔬 Science & technology had no impact on the Great Plague; 👤 Individuals produced no heroes
- **Suggested components:**
  - `ExplainReveal` — chain: Renaissance discoveries (Vesalius/Harvey) → limited immediate impact on treatment → Great Plague 1665 = unchanged responses → only government organisation as meaningful development
  - `QuickRecallScreen` — final retrieval: 1665 vs 1348 comparison facts

### Section 6 — Summary & Examiner
- **Suggested components:**
  - `ExaminerExplainsScreen` — examiner explains how to structure the "how similar were reactions" answer (similarity first, then difference, then overall judgement)
  - `FaceTheExaminer` — source-comparison question: how similar were Black Death and Great Plague reactions?
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

Not yet built as standalone — full rebuild from spec.

`history-medicine-great-plague` exists in `src/modules.js` with 0 screens. The module metadata is ready; the content needs building from scratch in `src/modules/history.js`.

BUNDLING: Within `mod2`, Episode 5 content estimated at ~5 screens. No Great Plague–specific tags in `mod2`'s screenTags. Insufficient coverage.

---

## 4. Build recommendations

1. **Storyline integration (🏛️ Government agent):** Core takeaway — 1665 responses mirrored 1348 but government was more organised — should thread via: Section 1 hook ("have any of the treatments changed?"), Section 4 comparison reveal (TheoryCompareBlock), Section 5 government-as-the-one-change conclusion. Every section returns to the continuity question.

2. **The comparison is the episode (🏛️ vs ⛪):** More than any other episode, Episode 5 is built around a comparison. Every screen should either establish 1665 facts OR explicitly connect them back to 1348 equivalents. Do not teach 1665 in isolation.

3. **Plague doctor visual hook (⛪ Religion + miasma):** The beaked mask is the most iconic visual in this episode and one of the most memorable in the whole series. Use `CinematicRevealMoment` in Section 1 to land it with weight.

4. **Searchers screen (🏛️ Government):** The appointment of searchers — women specifically employed to inspect houses — is a commonly tested feature. Add a dedicated moment for this in Section 3.

5. **Connect to Episode 8 (🏛️ Government):** Section 5 should explicitly name the chain: 1348 quarantine → 1665 quarantine+searchers → 1842 Chadwick report → 1875 Public Health Act. This is the government-agent interleaving thread running through the whole series.

6. **Episode 6 handoff:** End of Episode 5: "In 1665, medicine still had nothing. But in 1796, something happened that would change that — not through understanding disease, but through a lucky observation about cows." Sets up Jenner (Episode 6).
