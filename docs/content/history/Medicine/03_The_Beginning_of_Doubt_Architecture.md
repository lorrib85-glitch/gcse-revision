# Episode 3: The Beginning of Doubt — Architecture

## 1. Identity (brief)

- **Episode number:** 3
- **Title:** The Beginning of Doubt
- **Build status:** Built (shared) as `mod2` — also covers Episodes 4 (Harvey) and 5 (Great Plague)
- Content, Storyline, Specification requirements and the full Content reference pack: see `03_The_Beginning_of_Doubt_Content.md` in this directory.

### Bundling note
`mod2` currently covers Episodes 3, 4 and 5 in one module. The series map recommends splitting it. Until that split happens, this architecture file covers only Episode 3 content within `mod2`. Episode 4 and 5 content from `mod2` is assessed in their own architecture files.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall Episodes 1–2 knowledge; create curiosity about Renaissance change; preview the episode.
- **Proposed content for Episode 3:**
  - PriorKnowledgeRecall: probe Four Humours, miasma, Church dominance, Galen errors from Episodes 1–2
  - Hook: "It is 1543. A doctor in Padua has just proved the greatest authority in medicine has been wrong for 1300 years. What happens next?"
  - WhatYouWillLearn: preview the Renaissance context and Vesalius
- **Suggested components:**
  - `ChapterHookScreen` (True/False) — "Vesalius proved Galen wrong about the human body." [TRUE, ~300 errors]
  - `PriorKnowledgeRecall` — target: four-humours, galen, miasma, church-influence from Episodes 1–2

### Section 2 — Learning Chunk 1
- **Purpose:** Renaissance background — why change became possible.
- **Proposed content for Episode 3:**
  - Renaissance meaning "re-birth"; renewed interest in learning; secular thinking (humanism)
  - Reformation: Henry VIII breaks from Rome → Church authority declines → monasteries close
  - Printing press: ideas spread without Church control; anatomical drawings published widely
  - Royal Society (1660): shared experiments; *Philosophical Transactions*; Charles II's Royal Charter
- **Suggested components:**
  - `VisualLearning` — contrast: medieval scholar copying manuscripts in a monastery vs. Renaissance physician dissecting; the shift in approach
  - `ExplainReveal` — chain: Reformation → Church authority declines → Vesalius can challenge Galen without fear

### Section 3 — Learning Chunk 2
- **Purpose:** Vesalius — the breakthrough and its limits.
- **Proposed content for Episode 3:**
  - Vesalius: *On the Fabric of the Human Body* (1543); dissected executed criminals (not animals)
  - Found ~300 Galen errors: jawbone (one part not two), ribs (no difference between men/women), vena cava, breastbone
  - Encouraged empirical investigation; laid foundation for Harvey (Ep 4)
  - Limited immediate impact: physicians still used humoural treatments; medical training still dominated by Galen
  - Sydenham: observed patients; distinguished measles from scarlet fever; *Observationes Medicae* (1676)
  - Leeuwenhoek: observed "animalcules"; didn't connect to disease
- **Suggested components:**
  - `InteractiveHotspotImage` — anatomical diagram of the human body; hotspots reveal Vesalius corrections to Galen's errors
  - `MatchingTask` — match Galen's claim to Vesalius's correction (e.g. "jawbone in two parts" → "jawbone in one part")

### Section 4 — Learning Chunk 3
- **Purpose:** Treatment changes and continuities in the Renaissance.
- **Proposed content for Episode 3:**
  - New treatments: transference; chemical cures (mercury, antimony); New World herbs
  - Continuing treatments: humoural (bloodletting, purging) — Charles II received these in 1685
  - Hospital changes: pest houses; fewer hospitals due to monastery closures; more emphasis on curing; surgeons need licences
  - Prevention changes: government role increased; miasma still believed; bathing less fashionable (syphilis)
- **Suggested components:**
  - `ColSortBlock` — sort treatments into "Medieval" / "Renaissance" / "Both periods" (most humoural treatments sort to "Both")
  - `QuickRecallScreen` — retrieval on Vesalius's specific corrections to Galen

### Section 5 — Learning Chunk 4
- **Purpose:** Significance and "how far" judgement — was the Renaissance real progress?
- **Proposed content for Episode 3:**
  - What changed: anatomy (Vesalius); empirical method as an approach; printing press; Royal Society; government role
  - What stayed the same: most treatment (humoural); miasma belief; Four Humours for ordinary people; religion in epidemics
  - The core argument: progress was in *method* not immediate treatment; significance = long-term enablement
  - Agent check: 🔬 Science & technology + 👤 Individuals = the drivers here; ⛪ Religion = declining but not absent
- **Suggested components:**
  - `ExplainReveal` — "Why did Vesalius change medicine less than you'd expect?" — reveal chain showing limited immediate impact
  - `QuickRecallScreen` — final retrieval: Vesalius facts, Royal Society, changes/continuities

### Section 6 — Summary & Examiner
- **Purpose:** Exam application — "how far do you agree" Renaissance question.
- **Proposed content for Episode 3:**
  - "How far do you agree that there was little progress in the Renaissance?" — balanced answer structure
  - Mark scheme language: agree = anatomy not treatment, Galen still in medical training; disagree = Vesalius proved Galen wrong, printing press, Royal Society
- **Suggested components:**
  - `ExaminerExplainsScreen` — examiner walks through the balanced argument structure for the 16-mark Renaissance question
  - `FaceTheExaminer` — 16-mark Renaissance progress question
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

Built (shared) as `mod2` — 16 screens total; also covers Episodes 4 and 5.

Known screen tags from `src/modules.js`: `vesalius` (s5), remaining 15 screens have `null` tags.

**Inventory (Episode 3 content only — based on tag `vesalius` at s5):**
- s5 `vesalius` → likely Section 3 (Vesalius's corrections to Galen) ✓

**GAPS for Episode 3 within `mod2`:**
- No `renaissance-background` tag — whether Reformation/printing press/Royal Society background is covered unconfirmed
- No `sydenham` or `leeuwenhoek` tag — these individuals' coverage unconfirmed
- No `renaissance-treatments` tag — treatment changes unconfirmed
- With only 16 total screens across 3 bundled episodes, coverage of Episode 3 is likely only 5–6 screens

BUNDLING: `mod2` currently covers:
- Episode 3 (Renaissance/Vesalius): s1–~s5
- Episode 4 (Harvey): ~s6–~s10 (covered in Episode 4 architecture file)
- Episode 5 (Great Plague 1665): ~s11–~s16 (covered in Episode 5 architecture file)

---

## 4. Build recommendations

1. **Storyline integration (🔬 Science & technology + 👤 Individuals):** Core takeaway — Vesalius proved Galen wrong through empirical observation — should thread via: Section 1 hook, Section 3 `InteractiveHotspotImage`, Section 5 `ExplainReveal`. Key: always contrast *method* (looking/observing) vs *authority* (book-learning from Galen).

2. **Split `mod2` into Episodes 3, 4 and 5 (highest priority):** The series map explicitly recommends this split. At 16 screens across 3 episodes, each episode gets only ~5 screens — far below the 25–32 screens of built modules (Ep 1: 32, Ep 2: 27). A rebuild is needed. This recommendation applies across all three bundled episodes.

3. **Vesalius errors screen (👤 Individuals):** The `vesalius` tag at s5 likely covers this, but verify it includes all four named errors (jawbone, ribs, vena cava, breastbone) — all four appear in past-paper questions.

4. **Renaissance background screen (⛪ Religion declining + 🏛️ Government):** The Reformation and printing press are the *enabling factors* for Vesalius. A dedicated screen covering these should appear before the Vesalius reveal.

5. **Interleaving from Episodes 1–2:** The `ColSortBlock` (sort treatments into Medieval/Renaissance/Both) is particularly effective here because it forces learners to recall Episode 1 content (bloodletting, purging, herbal remedies) in the context of Episode 3 change/continuity.

6. **Episode 4 handoff:** End of Episode 3 should bridge to Harvey — "Vesalius rebuilt the map of the body. But he couldn't answer one fundamental question: what does the heart actually do?" Agent: 👤 Individuals + 🔬 Technology.
