# Episode 9: The Day Surgery Changed Forever — Architecture

## 1. Identity (brief)

- **Episode number:** 9
- **Title:** The Day Surgery Changed Forever
- **Build status:** Built across `mod3` + `mod6` (21 screens total; `mod3` tags: `anaesthetics`, `antiseptic-surgery`; `mod6` tags: none)
- Content, Storyline, Specification requirements and the full Content reference pack: see `09_The_Day_Surgery_Changed_Forever_Content.md` in this directory.

### Bundling note
`mod3` and `mod6` together form Episode 9. The series map suggests these may eventually be merged into a single Episode 9 module. Currently `mod3` (in modules.js) covers pre-1840 surgery problems + anaesthetics, and `mod6` covers antiseptics + aseptic surgery.

ALERT: `mod3` in modules.js is numbered 4 and titled "The man who proved everyone wrong" (William Harvey) — this appears to be a misalignment between the series map episode numbering and the modules.js numbering. The series map calls `mod3` + `mod6` = Episode 9, but `mod3` in modules.js has a Harvey-related number (4) and subtitle. The `anaesthetics` and `antiseptic-surgery` tags suggest the content is about surgery. Recommend confirming actual content of `mod3` in `src/modules/history.js` before building.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall germ theory (Ep 7); set up the surgery problem as the next frontier; create curiosity about how surgery changed.
- **Proposed content for Episode 9:**
  - PriorKnowledgeRecall: probe germ-theory, pasteur, antiseptic-surgery, anaesthetics
  - Hook: "In 1840, a surgeon's greatest skill was speed. By 1900, the operating theatre looked like a different world. What happened in between?"
- **Suggested components:**
  - `CinematicRevealMoment` — before/after: surgeon racing against a conscious screaming patient (1840) vs. calm sterile operating theatre (1900)
  - `ChapterHookScreen` (True/False) — "Joseph Lister's antiseptic spray worked because he understood germ theory." [TRUE — he connected it to Pasteur's work]
  - `PriorKnowledgeRecall` — probe: germ-theory, pasteur, anaesthetics

### Section 2 — Learning Chunk 1
- **Purpose:** The three problems with surgery before 1840; pain and the chloroform solution.
- **Proposed content for Episode 9:**
  - Three problems: pain, infection, bleeding
  - Ether: used in America; made patients vomit/cough; not ideal
  - Simpson 1847: discovered chloroform; self-experimented; effective anaesthetic
  - Queen Victoria uses chloroform (1853): social acceptance; religious objections overcome
  - New problem: complex operations → more infection
- **Suggested components:**
  - `ExplainReveal` — three-part chain: pain (problem) → ether (partial solution) → chloroform (full solution) → new problem (more infection)
  - `KeyFigureReveal` — James Simpson: portrait, 1847, chloroform discovery, Queen Victoria connection

### Section 3 — Learning Chunk 2
- **Purpose:** Lister's antiseptics — the infection solution.
- **Proposed content for Episode 9:**
  - Pre-antiseptic: patients survived operations but died from gangrene/sepsis; surgeons moved between patients without washing
  - Lister connects infected wounds to Pasteur's germ theory
  - 1865: carbolic acid bandage for broken leg; also spray during operations
  - Slow acceptance: science not understood; hands dried out from spray
  - Evolution to aseptic surgery by 1900
- **Suggested components:**
  - `VisualNarrativeScreen` — Lister's thinking process: observing infected wounds → reading Pasteur → making the connection → the 1865 broken leg experiment
  - `MatchingTask` — match each surgery problem to its solution and its key figure (pain/Simpson/chloroform; infection/Lister/carbolic acid; bleeding/not yet solved/20th century)

### Section 4 — Learning Chunk 3
- **Purpose:** Why antiseptics were slow to catch on; the transition to aseptic surgery.
- **Proposed content for Episode 9:**
  - Two reasons for slow adoption: science not understood + carbolic spray uncomfortable
  - Lister's approach: focused on spray, not explaining why — made it harder to convince colleagues
  - Aseptic surgery: steam sterilisation, gloves, gowns, masks — by 1900 commonplace
  - Impact: surgery death rates fall dramatically; surgery moves from last resort to standard treatment
- **Suggested components:**
  - `MisconceptionCheck` — "Antiseptic surgery was immediately accepted by all surgeons" [FALSE]; "Lister's work solved all three surgery problems" [FALSE — bleeding remained unsolved]
  - `QuickRecallScreen` — retrieval: Simpson 1847, chloroform, Queen Victoria 1853, Lister 1865, carbolic acid, aseptic surgery

### Section 5 — Learning Chunk 4
- **Purpose:** Significance and agents of change for this episode.
- **Proposed content for Episode 9:**
  - Agent review: 🔬 Science & technology (germ theory enables antiseptics; chemical experimentation enables chloroform); 👤 Individuals (Simpson, Lister); 🏛️ Government (royal patronage — Queen Victoria)
  - The Pasteur → Lister connection: clearest science-to-practice chain in the series
  - Still not solved: bleeding (connects to Episode 12 — blood transfusions in WWI/20th century)
- **Suggested components:**
  - `ColSortBlock` — sort surgery developments into "solved by 19th century" vs "remained unsolved into 20th century" (pain and infection solved; bleeding not)
  - `QuickRecallScreen` — final retrieval across all episode facts

### Section 6 — Summary & Examiner
- **Suggested components:**
  - `ExaminerExplainsScreen` — examiner walks through how to explain Lister's slow adoption (science not understood + practical discomfort); and the germ theory → surgery link
  - `FaceTheExaminer` — 12-mark "explain why antiseptic surgery was slow to be accepted" or "how important was germ theory in improving surgery"
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

Built across `mod3` (11 screens, tags: `anaesthetics` s2, `antiseptic-surgery` s9) + `mod6` (10 screens, no tags).

**Inventory (tags only):**
- `mod3` s2 `anaesthetics` → Section 2 — covers chloroform/anaesthetics ✓
- `mod3` s9 `antiseptic-surgery` → Section 3 — covers Lister/carbolic acid ✓
- `mod6` — 10 screens with no tags; content not determinable without loading `history.js`

ALERT on `mod3` numbering: modules.js shows `mod3` at position 4 with subtitle "William Harvey and the circulation of blood" — this conflicts with the series map assignment of `mod3` as part of Episode 9. Either the subtitle is wrong or the module numbering is inconsistent. Must audit `src/modules/history.js` before rebuilding.

**GAPS:**
- No `three-surgery-problems` tag — pre-1840 surgery problems overview unconfirmed
- No `aseptic-surgery` tag (distinct from `antiseptic-surgery`) — transition to aseptic practices unconfirmed
- No `lister-slow-adoption` tag — why antiseptics were slow to catch on unconfirmed
- No `queen-victoria-chloroform` tag — royal endorsement of chloroform unconfirmed as a dedicated screen

---

## 4. Build recommendations

1. **Resolve `mod3` identity conflict (immediate priority):** The `mod3` module in modules.js has a Harvey subtitle but `anaesthetics` and `antiseptic-surgery` tags. This must be resolved before any rebuild — either the subtitle is wrong or the module has mixed content. Load `src/modules/history.js` and audit what `mod3` actually contains.

2. **Storyline integration (🔬 Science & technology → 👤 Individuals):** Core takeaway — germ theory unlocked antiseptics; royal endorsement unlocked chloroform — should thread as: Section 1 hook (before/after operating theatre), Section 3 Lister's thinking process connecting Pasteur, Section 5 "what remained unsolved" ColSortBlock. The Pasteur → Lister connection is the most teachable cause-effect in the series.

3. **Three problems framing (Section 2):** Every learner should memorise the three problems (pain/infection/bleeding) and which one was solved when (pain 1847 → infection 1865 → bleeding not until 20th century). A dedicated `three-surgery-problems` tagged screen is needed.

4. **Slow adoption of antiseptics (Section 4):** The two reasons (science not understood + carbolic spray uncomfortable) are explicitly tested. Verify `antiseptic-surgery` at `mod3` s9 covers both reasons, not just Lister's initial use.

5. **Connection to Episode 7 (Pasteur → Lister) and Episode 10 (Nightingale):** Section 3 should explicitly name: "Lister read Pasteur's work and made the connection." Episode 10 (Nightingale) runs in parallel — Nightingale improved hospital cleanliness through better ventilation (miasma logic); Lister improved surgery through antiseptics (germ theory logic). Both led to the same outcome.

6. **Episode 10 handoff:** End of Episode 9: "Lister was transforming surgery. But in the same decade, another figure was transforming the very hospitals those surgeons worked in." Sets up Nightingale (Episode 10).
