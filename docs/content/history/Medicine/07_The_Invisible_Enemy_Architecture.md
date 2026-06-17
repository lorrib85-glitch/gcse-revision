# Episode 7: The Invisible Enemy — Architecture

## 1. Identity (brief)

- **Episode number:** 7
- **Title:** The Invisible Enemy
- **Build status:** Built as `history-medicine-germ-theory` (9 screens; tags: `germ-theory`, `pasteur`, `koch`)
- Content, Storyline, Specification requirements and the full Content reference pack: see `07_The_Invisible_Enemy_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall Episodes 1–6 (miasma as cause of disease, Jenner's unknown mechanism); create curiosity about what disease *actually* is.
- **Proposed content for Episode 7:**
  - PriorKnowledgeRecall: probe miasma, spontaneous-generation, vaccination (Jenner knew it worked but not why)
  - Hook: "For 600 years, people believed bad air caused disease. In 1861, a French scientist proved they were all wrong. But it took another 20 years for medicine to actually use what he found."
- **Suggested components:**
  - `CinematicRevealMoment` — microscope view zooming into bacteria; "For the first time in history, disease had a face."
  - `ChapterHookScreen` (True/False) — "Pasteur identified the specific bacteria that caused diseases like tuberculosis." [FALSE — that was Koch]
  - `PriorKnowledgeRecall` — probe: miasma, germ-theory (absent), vaccination, pasteur

### Section 2 — Learning Chunk 1
- **Purpose:** Spontaneous generation and why germ theory mattered.
- **Proposed content for Episode 7:**
  - Spontaneous generation: microbes created by decaying matter; still promoted by influential doctors after 1861
  - Pasteur's germ theory 1861: proved spontaneous generation wrong; something in the air causes decay; if germs cause decay, they might cause disease
  - Why limited immediate impact (four reasons)
- **Suggested components:**
  - `ExplainReveal` — chain: spontaneous generation (microbes from decay) → Pasteur disproves → germ theory → why most doctors ignore it (four-factor reveal)
  - `QuickRecallScreen` — "Why did Pasteur's germ theory have little immediate impact?" (four options, all correct)

### Section 3 — Learning Chunk 2
- **Purpose:** Koch — the practical breakthrough.
- **Proposed content for Episode 7:**
  - Koch's identification of specific disease-causing bacteria: anthrax (1876), tuberculosis (1882), cholera (1883)
  - Koch's method: jelly culture, purple dye, microscope photography
  - Koch's government funding advantage
  - Koch's method adopted worldwide → bacteriology as a science
- **Suggested components:**
  - `KeyFigureReveal` — Robert Koch: portrait, role, discoveries (anthrax/TB/cholera), method (jelly/dye/photography), government funding
  - `MatchingTask` — match each Koch discovery to its year and significance (anthrax 1876 → first specific bacterium identified; TB 1882 → major killer's cause found; cholera 1883 → Snow's theory confirmed)

### Section 4 — Learning Chunk 3
- **Purpose:** Pasteur and Koch compared; and why miasma persisted despite germ theory.
- **Proposed content for Episode 7:**
  - Pasteur vs Koch comparison: theory vs method; French vs German; vaccines vs bacteriology
  - Miasma's continued life: Great Stink 1858 seemed to confirm miasma even as germ theory was being published
  - Germ theory's long-term impact: Lister (Ep 9), magic bullets and penicillin (Ep 11), vaccines extended
- **Suggested components:**
  - `TheoryCompareBlock` — Pasteur vs Koch: side-by-side comparison of contributions, methods, impact
  - `MisconceptionCheck` — "Germ theory immediately replaced miasma in popular belief" [FALSE]; "Pasteur identified specific disease bacteria" [FALSE]

### Section 5 — Learning Chunk 4
- **Purpose:** Significance of germ theory across the series arc.
- **Proposed content for Episode 7:**
  - Germ theory as the "key that unlocked everything": antiseptics (Ep 9), magic bullets (Ep 11), antibiotics (Ep 11), vaccines (Jenner explained retroactively)
  - 🔬 Science & technology + 👤 Individuals as the dominant agents
  - 🏛️ Government: Koch's government funding as model for future research funding
- **Suggested components:**
  - `ColSortBlock` — sort things germ theory "made possible" into "immediate impact" vs "later impact"
  - `QuickRecallScreen` — final retrieval: Pasteur 1861, Koch three discoveries, why limited impact, Koch's method

### Section 6 — Summary & Examiner
- **Suggested components:**
  - `ExaminerExplainsScreen` — examiner explains why the Pasteur/Koch question requires understanding of both roles and why limited impact is important to address
  - `FaceTheExaminer` — 12-mark "explain why germ theory had little immediate impact" or "why was Koch important"
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

Built as `history-medicine-germ-theory` — 9 screens.

Known screen tags from `src/modules.js`: `germ-theory` (s1), `pasteur` (s2), `koch` (s3), remaining 6 screens with `null` tags.

**Inventory (tags only — full screen content in `src/modules/history.js`):**
- s1 `germ-theory` → Section 2 — covers Pasteur's germ theory ✓
- s2 `pasteur` → Section 2/3 — covers Pasteur's contribution ✓
- s3 `koch` → Section 3 — covers Koch's contribution ✓

**GAPS:**
- Only 9 screens for a topic that merits ~25 screens (vs Ep 1: 32 screens, Ep 2: 27 screens)
- No `spontaneous-generation` tag — context/contrast coverage unconfirmed
- No `miasma-persistence` tag — miasma persisting despite germ theory not confirmed covered
- No `limited-impact` tag — why germ theory had little immediate impact not confirmed covered
- No `bacteriology-method` tag — Koch's specific jelly/dye/photography method not confirmed covered
- Sections 1 and 6 (PriorKnowledgeRecall, FaceTheExaminer) unconfirmed — only 9 screens total suggests minimal coverage

---

## 4. Build recommendations

1. **Rebuild to full module length (highest priority):** At 9 screens, this module is severely underbuilt. The Pasteur/Koch topic is one of the most-tested in the paper. Target: 25–30 screens to match Episodes 1–2.

2. **Storyline integration (🔬 Science & technology dominant):** Core takeaway — germ theory unlocked everything that followed — should thread via: Section 1 hook, Section 2 limited-impact reveal (frustrating: correct theory, ignored), Section 5 "what germ theory made possible" ColSortBlock. Each section should return to: "the most important discovery in medical history was ignored for decades."

3. **Pasteur vs Koch distinction (👤 Individuals):** This is the most common student confusion. TheoryCompareBlock in Section 4 is essential — verify `pasteur` (s2) and `koch` (s3) screens already address the distinction; if not, add a dedicated comparison screen.

4. **Limited impact screen (⛪ Religion fading + miasma persisting):** The four reasons why germ theory had little immediate impact need a dedicated screen or ExplainReveal. Mark schemes specifically reward this.

5. **Series connection forward (🔬 Science & technology):** Section 5 should name the specific chain: germ theory → Lister antiseptics (1865, Ep 9) → magic bullets (1909, Ep 11) → penicillin (1928, Ep 11). This threading makes the series coherent and helps with "explain why" questions about 20th-century medicine.

6. **Episode 8 handoff:** End of Episode 7: "Germ theory explained disease. But what would it take for a city of millions to actually become healthier? The answer was sewers, not science." Sets up the Great Stink and Public Health (Episode 8).
