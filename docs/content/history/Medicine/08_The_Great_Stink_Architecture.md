# Episode 8: The Great Stink — Architecture

## 1. Identity (brief)

- **Episode number:** 8
- **Title:** The Great Stink
- **Build status:** Built as `mod5` (7 screens; tags include `john-snow`, `public-health`)
- Content, Storyline, Specification requirements and the full Content reference pack: see `08_The_Great_Stink_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall Episodes 5–7 (Great Plague government response, germ theory); create curiosity about why cities are so unhealthy; preview the episode.
- **Proposed content for Episode 8:**
  - PriorKnowledgeRecall: probe quarantine (Eps 2/5), germ-theory, public-health, john-snow
  - Hook: "By 1850, London was the largest city in the world. And it was slowly poisoning itself. What does it take to make a government act?"
- **Suggested components:**
  - `CinematicRevealMoment` — Victorian London street scene; contrast between wealthy areas and slums; caption: "Two million people. One river. One enormous problem."
  - `ChapterHookScreen` (True/False) — "John Snow proved cholera was waterborne before germ theory was accepted." [TRUE]
  - `PriorKnowledgeRecall` — probe: quarantine, germ-theory, public-health

### Section 2 — Learning Chunk 1
- **Purpose:** Industrial Revolution context and the sanitation crisis.
- **Proposed content for Episode 8:**
  - Industrial Revolution → rapid urbanisation → overcrowded cities → poor sanitation
  - Chadwick 1842 report: linked poverty/sanitation/disease; compared northern cities vs Rutland life expectancy
  - First Public Health Act 1848: voluntary; ineffective; laissez-faire attitude
  - Cholera epidemics of 1831, 1848 as context
- **Suggested components:**
  - `VisualLearning` — industrial city scenes; contrast Rutland life expectancy vs Manchester; Chadwick's report as documentary evidence
  - `ExplainReveal` — chain: Industrial Revolution → overcrowding → poor sanitation → cholera epidemics → government pressure builds

### Section 3 — Learning Chunk 2
- **Purpose:** John Snow — the epidemiological detective.
- **Proposed content for Episode 8:**
  - Snow's Broad Street investigation (1854): mapping deaths, identifying pump, removing handle, cases fall
  - Snow found: pump contaminated by leaking cesspit
  - Snow presented to Parliament (1855); rejected by miasma believers
  - Snow's limited immediate impact; died 1858 before full vindication
  - Germ theory (1861) retroactively validates Snow's work
- **Suggested components:**
  - `InteractiveHotspotImage` — Snow's map of Broad Street cholera deaths; hotspots reveal pump location, death clusters, cesspit contamination point
  - `MatchingTask` — match each of Snow's actions to its outcome (map deaths → identifies pump cluster; removes handle → cases fall; presents to Parliament → initially rejected)

### Section 4 — Learning Chunk 3
- **Purpose:** The Great Stink and the political breakthrough.
- **Proposed content for Episode 8:**
  - Great Stink 1858: hot summer; Thames sewage; Parliament smells it directly
  - Political pressure → Bazalgette's sewer plan approved
  - Bazalgette's sewer system (1860s–70s): 83 miles; built for miasma removal; eliminated cholera as side effect
  - 1866 cholera epidemic: lower impact due to partial completion of sewers
- **Suggested components:**
  - `VisualNarrativeScreen` — narrative of the Great Stink: MPs in Parliament; the smell reaching the chamber; the political moment
  - `QuickRecallScreen` — retrieval: Chadwick 1842, Snow 1854, Great Stink 1858, Bazalgette's sewers, 1875 Act

### Section 5 — Learning Chunk 4
- **Purpose:** Second Public Health Act (1875) — the compulsory breakthrough; series significance.
- **Proposed content for Episode 8:**
  - Second Public Health Act 1875: compulsory; all cities must provide clean water, safe sewage, clean streets, proper housing, medical officer of health
  - Contrast with 1848 (voluntary) → 1875 (compulsory): key change
  - Agent review: 🏛️ Government is the dominant agent in this episode; 👤 Individuals (Snow, Chadwick, Bazalgette); 🔬 Science & technology (germ theory validates retrospectively)
  - Forward: NHS (Ep 12) and government lifestyle campaigns (Ep 13) continue this government public health chain
- **Suggested components:**
  - `ColSortBlock` — sort public health measures into "1848 Act" vs "1875 Act" vs "Both"
  - `QuickRecallScreen` — final retrieval: 1848 vs 1875, Snow's pump, Bazalgette, Chadwick

### Section 6 — Summary & Examiner
- **Suggested components:**
  - `ExaminerExplainsScreen` — examiner explains "how far do you agree" structure for the Great Stink question; and "how important was John Snow" — both require balancing individual vs. structural factors
  - `FaceTheExaminer` — 12-mark "explain why it took so long to improve public health in 19th-century Britain" or "how important was John Snow"
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

Built as `mod5` — 7 screens.

Known screen tags: `john-snow` (s4), `public-health` (s5), remaining 5 screens with `null` tags.

**Inventory (tags only — full content in `src/modules/history.js`):**
- s4 `john-snow` → Section 3 — covers Snow's Broad Street investigation ✓
- s5 `public-health` → Section 4 or 5 — covers Public Health Acts ✓

**GAPS:**
- Only 7 screens — far below the required 25–30 screens
- No `chadwick` tag — 1842 report coverage unconfirmed
- No `great-stink` tag — 1858 Great Stink as political catalyst unconfirmed
- No `bazalgette` tag — sewer construction coverage unconfirmed
- No `1875-act` or `1848-act` tags — detailed Act comparison unconfirmed
- No `laissez-faire` tag — why government was slow to act unconfirmed
- Section 1 and 6 (PriorKnowledgeRecall, FaceTheExaminer) unconfirmed at 7 screens

---

## 4. Build recommendations

1. **Rebuild to full module length (highest priority):** At 7 screens, this module is severely underbuilt. The public health topic is one of the most-tested and complex in the paper. Target: 25–30 screens.

2. **Storyline integration (🏛️ Government agent):** Core takeaway — government can improve health even when the science is incomplete — should thread as: Section 1 hook (what does it take for government to act?), Section 2 (laissez-faire explains inaction), Section 4 (Great Stink = political necessity overcomes ideological inaction), Section 5 (1875 Act = the proper solution). Every section should return to the government-as-actor theme.

3. **Snow's map (👤 Individuals + epidemiology):** The `InteractiveHotspotImage` with Snow's actual map is one of the most engaging interactive moments in the series. Verify `john-snow` screen at s4 uses an interactive map format, not just static text. If not, upgrade it.

4. **Chadwick and 1842 report (🏛️ Government):** If no screen covers Chadwick's report and the life expectancy comparison, add a dedicated `chadwick` tagged screen in Section 2. The life expectancy data (northern cities vs Rutland) is directly testable.

5. **1848 vs 1875 contrast (🏛️ Government):** The voluntary/compulsory distinction is consistently tested. Add a `public-health-acts` tagged screen that explicitly names both dates and the key differences.

6. **Episode 9 handoff:** End of Episode 8: "The government had cleaned up the cities. But inside the operating theatre, surgeons were still killing more patients than they saved — through infection. Something had to change." Sets up anaesthetics and antiseptics (Episode 9).
