# Episode 10: The Lady with the Lamp? — Architecture

## 1. Identity (brief)

- **Episode number:** 10
- **Title:** The Lady with the Lamp?
- **Build status:** Not yet built — full rebuild from spec. Module `history-medicine-nightingale` exists in `src/modules.js` with 0 screens.
- Content, Storyline, Specification requirements and the full Content reference pack: see `10_The_Lady_with_the_Lamp_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall hospital conditions pre-Nightingale (Episodes 8–9 hospital context); create curiosity about Nightingale's achievement; set up the miasma nuance.
- **Proposed content for Episode 10:**
  - PriorKnowledgeRecall: probe miasma, germ-theory, antiseptic-surgery, john-snow — hospital context
  - Hook: "She went to one of the world's worst hospitals and cut the death rate by 95%. And she still believed disease came from bad air. How?"
- **Suggested components:**
  - `CinematicRevealMoment` — Nightingale arriving at Scutari: chaos, stench, overflowing wards; then the same space after her reforms: clean, ordered, ventilated
  - `ChapterHookScreen` (True/False) — "Florence Nightingale understood germ theory and used it to reduce infection." [FALSE — she believed in miasma]
  - `PriorKnowledgeRecall` — probe: miasma, antiseptic-surgery, hospital-conditions

### Section 2 — Learning Chunk 1
- **Purpose:** Hospitals before Nightingale — context of why Scutari was so bad.
- **Proposed content for Episode 10:**
  - Hospital history: 5 hospitals in England by 1700; new hospitals 1700s; admitted "deserving poor"
  - As hospitals expanded → dirtier; doctors moved between patients without washing; wards mixed infectious and non-infectious
  - Crimean War 1854: British army hospital at Scutari; dirty, smelly, 40% death rate
- **Suggested components:**
  - `VisualLearning` — cinematic contrast between hospital care at different periods: medieval (care not cure), 18th-century (better access, poorer sanitation as they expanded), Scutari (crisis)
  - `QuickRecallScreen` — "Why did hospitals become less sanitary as they expanded?" (doctors moved between patients without washing; wards mixed infectious)

### Section 3 — Learning Chunk 2
- **Purpose:** Nightingale's reforms at Scutari — what she did and how.
- **Proposed content for Episode 10:**
  - Nightingale and 38 nurses sent by government (Sidney Herbert) 1854
  - Focus: thorough cleaning, clean clothes/bedding, improved sanitation, good ventilation
  - Death rate: 40% → 2%
  - Based on miasma belief (clean air focus) → correct outcomes regardless
  - *Notes on Nursing* (1859); Nightingale School for Nurses (1860)
- **Suggested components:**
  - `KeyFigureReveal` — Florence Nightingale: portrait, Scutari arrival, four key reforms, death rate statistics, *Notes on Nursing*, Nightingale School
  - `ExplainReveal` — chain: Scutari (dirty → death rate 40%) → Nightingale's four reforms → death rate 2% → *Notes on Nursing* → nursing professionalised → pavilion hospitals built

### Section 4 — Learning Chunk 3
- **Purpose:** Hospital design and the pavilion plan; the miasma nuance.
- **Proposed content for Episode 10:**
  - Pavilion plan: long wards with windows at both ends; separate wards for infectious patients; embodies miasma theory (clean air) but correct design outcomes
  - Nursing professionalised: no longer untrained working-class women; Nightingale School graduates
  - Statistical charts: rose diagram; used data to advocate for policy change
  - The miasma nuance: she was wrong about the cause but right about the solution — parallel with Bazalgette (Ep 8)
- **Suggested components:**
  - `InteractiveHotspotImage` — pavilion hospital plan with hotspots: tap to reveal why each design feature was included and what it actually achieved
  - `MisconceptionCheck` — "Nightingale's hospitals were built with germ theory in mind" [FALSE — miasma logic]; "Nightingale invented nursing" [FALSE — she professionalised it]

### Section 5 — Learning Chunk 4
- **Purpose:** Significance — Nightingale's legacy and place in the series arc.
- **Proposed content for Episode 10:**
  - Agent review: 👤 Individuals (Nightingale); 🏛️ Government (sent by government, reported to government); 🔬 Science & technology (statistical charts = new kind of evidence)
  - The miasma theme: Bazalgette (Ep 8) built sewers based on miasma logic → correct outcome; Nightingale cleaned hospitals based on miasma logic → correct outcome. Both show that right actions can come from wrong reasons.
  - Forward: germ theory (Ep 7) eventually provides the *explanation* for why Nightingale's clean hospitals worked
- **Suggested components:**
  - `ColSortBlock` — sort Nightingale's achievements into "immediate impact at Scutari" vs "long-term impact on British medicine"
  - `QuickRecallScreen` — final retrieval: Scutari 40%→2%, 1859 Notes on Nursing, 1860 Nightingale School, pavilion plan, miasma belief

### Section 6 — Summary & Examiner
- **Suggested components:**
  - `ExaminerExplainsScreen` — examiner explains how to structure the "how far did Nightingale change hospital care?" — agree/counter structure; the miasma nuance as the key sophistication point
  - `FaceTheExaminer` — 12-mark "explain why Florence Nightingale was important" or 16-mark "how far did Nightingale change hospital care?"
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

Not yet built — full rebuild from spec.

`history-medicine-nightingale` in `src/modules.js` has 0 screens. Full content needs to be written in `src/modules/history.js`.

---

## 4. Build recommendations

1. **Storyline integration (👤 Individuals + 🏛️ Government):** Core takeaway — Nightingale reformed hospitals through administration and data, not science — should thread via: Section 1 hook ("how did she do it while believing bad air caused disease?"), Section 3 reform reveal (four changes → 40%→2%), Section 5 significance ColSortBlock. Every section should contrast the romance of the "Lady with the Lamp" legend with the harder, more interesting truth: a data-driven administrator who happened to believe the wrong thing about disease.

2. **The miasma nuance (⛪ Religion fading + miasma persisting):** This is the episode's most important exam sophistication point. The `MisconceptionCheck` in Section 4 is essential. Learners must understand: Nightingale was wrong about the mechanism (miasma) but right about the intervention (clean air, clean wards) — and her outcomes proved it.

3. **Statistical charts (🔬 Science & technology — unusual form):** Nightingale's rose diagram is one of the earliest uses of data visualisation for policy advocacy. This is genuinely interesting and historically significant — include it as a dedicated screen with the visual.

4. **The 40% → 2% figure:** These two statistics must be memorised. Give them a dedicated cinematic moment in Section 3 — not just mentioned in passing but treated with the weight they deserve.

5. **Mary Seacole gap:** If Mary Seacole is on the Edexcel specification for this episode, a future session must source her content. Current synthesis has nothing. Check the specification document directly.

6. **Episode 11 handoff:** End of Episode 10: "Nightingale had cleaned the hospitals. Lister had sterilised the instruments. But medicine still had no way to fight disease once it was inside the body — until a petri dish left by an open window in 1928 changed everything." Sets up penicillin (Episode 11).
