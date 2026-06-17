# Episode 6: The Boy, the Cow and the Cure — Architecture

## 1. Identity (brief)

- **Episode number:** 6
- **Title:** The Boy, the Cow and the Cure
- **Build status:** Built as `history-medicine-jenner-vaccination` — but only 1 screen (tag: `vaccination`); effectively not yet substantively built.
- Content, Storyline, Specification requirements and the full Content reference pack: see `06_The_Boy_the_Cow_and_the_Cure_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall Episode 5 (Great Plague = no individual heroes, medicine helpless); set up Jenner as the first individual to *actually* prevent a disease.
- **Proposed content for Episode 6:**
  - PriorKnowledgeRecall: probe plague-explanations, miasma, quarantine from Episodes 2/5; germ-theory precursor awareness
  - Hook: "In 1665, London was helpless. But in 1796, a country doctor made an observation about cows that would save millions of lives."
- **Suggested components:**
  - `CinematicRevealMoment` — Jenner watching dairy maids at work; the observation that changes everything
  - `ChapterHookScreen` (True/False) — "Jenner knew why his vaccination worked." [FALSE — he knew it worked but not why]
  - `PriorKnowledgeRecall` — probe: miasma, quarantine, germ-theory (absent so far = relevant gap)

### Section 2 — Learning Chunk 1
- **Purpose:** Background — smallpox and inoculation; Jenner's observation.
- **Proposed content for Episode 6:**
  - Smallpox: major killer in 1700s Britain
  - Inoculation: existing method (pus from scab into cut); risky; could kill or spread disease
  - Jenner's key observation: dairy maids who had cowpox didn't get smallpox
  - The hypothesis: can cowpox protect against smallpox?
- **Suggested components:**
  - `VisualLearning` — contrast inoculation (risky, using the actual disease) vs Jenner's observation (mild cowpox confers protection)
  - `ExplainReveal` — chain: dairy maids + cowpox → immune to smallpox → Jenner forms hypothesis → tests on Phipps

### Section 3 — Learning Chunk 2
- **Purpose:** The experiment, opposition, and limitations.
- **Proposed content for Episode 6:**
  - The 1796 experiment: James Phipps, aged 8; cowpox → wait → smallpox → didn't catch it; "vaccination" coined
  - Opposition: Church (unnatural), inoculators (financial threat), London medical establishment (country doctor dismissed)
  - Jenner's limitation: couldn't explain why it worked → couldn't apply to other diseases
  - Timeline: 1840 government banned inoculation; 1853 compulsory vaccination
- **Suggested components:**
  - `KeyFigureReveal` — Edward Jenner: portrait, role, significance, key facts (1796 experiment, James Phipps, opposition, government support)
  - `MatchingTask` — match each source of opposition to its reason (Church → unnatural; inoculators → financial; medical establishment → dismissed country doctor)

### Section 4 — Learning Chunk 3
- **Purpose:** Government action — the critical enabler that made vaccination widespread.
- **Proposed content for Episode 6:**
  - 1840: government bans inoculation + free children's vaccinations
  - 1853: compulsory vaccination — a watershed moment in state responsibility for public health
  - Why government action was necessary: voluntary uptake too low; inoculators still operating illegally
  - 🏛️ Government agent as the factor that converted an individual discovery into a population health intervention
- **Suggested components:**
  - `VisualNarrativeScreen` — narrative of vaccination becoming law; the public resistance and government response
  - `QuickRecallScreen` — retrieval: 1840, 1853, Phipps, vacca, inoculation vs vaccination

### Section 5 — Learning Chunk 4
- **Purpose:** Significance — breakthrough or lucky observation?
- **Proposed content for Episode 6:**
  - Agree: first reliable disease prevention; government backed; eventually eradicated smallpox
  - Counter: couldn't explain why; couldn't replicate for other diseases; took Pasteur (1878) to explain
  - Agent review: 👤 Individuals (Jenner) + 🏛️ Government + (Pasteur bridging to 🔬 Science & technology)
  - Forward to Episode 7: Pasteur provides the explanation that Jenner couldn't give
- **Suggested components:**
  - `ColSortBlock` — sort evidence about Jenner's vaccination into "supports breakthrough claim" vs "challenges breakthrough claim"
  - `QuickRecallScreen` — final retrieval: Jenner, Phipps, cowpox, 1840, 1853, Pasteur's follow-on

### Section 6 — Summary & Examiner
- **Suggested components:**
  - `ExaminerExplainsScreen` — the "how far do you agree" vaccination question: agree and counter structure; the word "breakthrough" is the conceptual hinge
  - `FaceTheExaminer` — 16-mark "how far do you agree" question on Jenner's vaccination
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

`history-medicine-jenner-vaccination` exists in `src/modules.js` with 1 screen (tag: `vaccination`) and is effectively a stub. Full content needs building in `src/modules/history.js`.

---

## 4. Build recommendations

1. **Storyline integration (👤 Individuals + 🏛️ Government):** Core takeaway — Jenner opened a door he couldn't walk through himself — should thread as: Section 1 hook (the lucky observation), Section 3 limitation reveal (can't explain why), Section 5 ColSortBlock (breakthrough or lucky?). The tension between "revolutionary discovery" and "limited by ignorance of mechanism" is the episode's spine.

2. **The Phipps experiment (👤 Individuals):** The 1796 experiment is the most memorable moment in the episode. Give it a full cinematic beat — Jenner with the 8-year-old, the cowpox inoculation, the 6-week wait, the smallpox test. This is the kind of moment that sticks in memory and exam answers.

3. **Opposition to vaccination (⛪ Religion):** The Church's opposition is worth a dedicated MisconceptionCheck item — "vaccination was accepted because it worked" is a common student error. Opposition from three directions (Church, inoculators, medical establishment) should each be named with evidence.

4. **Government compulsion (🏛️ Government):** The 1840 and 1853 dates are both testable. Add a dedicated `vaccination-law` tagged screen covering both.

5. **Pasteur bridge (🔬 Science & technology):** Section 5 should explicitly name Pasteur as the person who later explained WHY vaccination works — this sets up Episode 7 naturally and prevents the learner from thinking Jenner's method was fully understood.

6. **Episode 7 handoff:** End of Episode 6: "Jenner's vaccine worked. But nobody knew why. In 1861, a French scientist would answer that question — and in doing so, change medicine forever." Sets up germ theory.
