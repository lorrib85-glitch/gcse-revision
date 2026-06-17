# Episode 4: The Man Who Proved Everyone Wrong — Architecture

## 1. Identity (brief)

- **Episode number:** 4
- **Title:** The Man Who Proved Everyone Wrong
- **Build status:** Built (shared) as `mod2` — also covers Episodes 3 (Vesalius) and 5 (Great Plague)
- Content, Storyline, Specification requirements and the full Content reference pack: see `04_The_Man_Who_Proved_Everyone_Wrong_Content.md` in this directory.

### Bundling note
`mod2` currently covers Episodes 3, 4 and 5 in one 16-screen module. Harvey content within `mod2` is estimated at ~5 screens. The series map recommends splitting into three separate modules.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall Episodes 1–3 knowledge; create curiosity about Harvey's discovery; preview episode.
- **Proposed content for Episode 4:**
  - PriorKnowledgeRecall: probe four-humours (Galen's liver-makes-blood theory), vesalius (anatomy can be tested empirically), church-influence (declining)
  - Hook: "It is 1628. A doctor claims the heart is just a pump — and everyone laughed. How do you prove something no one will believe?"
- **Suggested components:**
  - `CinematicRevealMoment` — anatomist watching a beating heart; realises it's pumping, not just filtering
  - `ChapterHookScreen` (True/False) — "William Harvey used a water pump to explain how the heart works." [TRUE]
  - `PriorKnowledgeRecall` — probe: four-humours, vesalius, galen

### Section 2 — Learning Chunk 1
- **Purpose:** Harvey's discovery — what he found and how.
- **Proposed content for Episode 4:**
  - The heart acts as a pump; blood circulates in a one-way system
  - Published *An Anatomical Account of the Motion of the Heart and Blood* (1628)
  - Method: observation, measurement, experiment — not book learning
  - Directly disproved Galen's liver-makes-blood model
  - The water pump inspiration (technology enabling the conceptual breakthrough)
- **Suggested components:**
  - `VisualNarrativeScreen` — Harvey's experimental process; from observation of live animal hearts to calculation of blood volume
  - `ExplainReveal` — Galen's model (blood made in liver, burned up) → Harvey's challenge (impossible — volume too large) → Harvey's model (one-way circulation with pump)

### Section 3 — Learning Chunk 2
- **Purpose:** Why Harvey could make this discovery — five enabling factors.
- **Proposed content for Episode 4:**
  - Individual: Harvey's own abilities as doctor and anatomist
  - Government: employed by Charles I → credibility and resources
  - Technology: mechanical water pump as conceptual model
  - Scientific breakthroughs: dissections more commonplace (Vesalius's legacy)
  - Attitudes in society: interest in science; willingness for rational explanation
- **Suggested components:**
  - `InteractiveCollectionExplorer` — five factors displayed as an explorer; tap each to reveal how it contributed to Harvey's success
  - `MatchingTask` — match each enabling factor to its evidence (e.g. "Government" → "Charles I employed Harvey as royal physician")

### Section 4 — Learning Chunk 3
- **Purpose:** Limited impact — why Harvey's correct discovery didn't change medicine.
- **Proposed content for Episode 4:**
  - Theory correct but offered no practical use in treatment → physicians ignored or criticised it
  - Charles II (1685) still received bloodletting — 57 years after Harvey's publication
  - Continuity: humoural treatments persisted regardless of Harvey's discovery
  - Why this pattern repeats: physicians paid by patients who want known treatments, not experiments
- **Suggested components:**
  - `MisconceptionCheck` — "Harvey's discovery immediately changed how doctors treated patients." [FALSE]
  - `QuickRecallScreen` — retrieval on Harvey's five enabling factors

### Section 5 — Learning Chunk 4
- **Purpose:** Significance — the long-term importance of Harvey's method.
- **Proposed content for Episode 4:**
  - Harvey's method (empirical, experimental) is more important than the single discovery
  - Long-term chain: Harvey's circulation model → blood transfusion research → modern surgery (Episodes 9, 12)
  - Agents of change review for this episode: 👤 Individuals + 🏛️ Government + 🔬 Technology — all three contributed; ⛪ Religion receding
- **Suggested components:**
  - `ColSortBlock` — sort evidence about Harvey into "immediate impact" vs "long-term significance" (most sorts to "long-term")
  - `QuickRecallScreen` — final retrieval: Harvey facts and five enabling factors

### Section 6 — Summary & Examiner
- **Suggested components:**
  - `ExaminerExplainsScreen` — explain why Harvey's question requires agents-of-change structure
  - `FaceTheExaminer` — 12-mark "explain why Harvey was able to make his discovery"
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

Built (shared) as `mod2` — 16 screens total; mod3 in modules.js is actually labeled as "The man who proved everyone wrong" (Harvey) with `anaesthetics` and `antiseptic-surgery` tags, which belongs to Episode 9. The series mapping is confused.

BUNDLING: `mod2` covers Episodes 3, 4 and 5. Harvey content estimated ~5 screens. No Harvey-specific tags present in `mod2`'s screenTags.

Not yet built — full rebuild from spec as standalone Episode 4 module.

---

## 4. Build recommendations

1. **Storyline integration (👤 Individuals + 🏛️ Government):** Core takeaway — Harvey's method > Harvey's discovery — should thread via: Section 1 hook, Section 3 five-factors reveal, Section 5 ColSortBlock. Each section should return to "how did he *prove* it, not just *claim* it."

2. **Split `mod2` (highest priority):** Harvey needs its own 25–30 screen module. Currently sharing 16 screens with Vesalius and the Great Plague; Harvey's content is severely compressed. Rebuild as `history-medicine-harvey` (or similar id).

3. **Five-factor model (🏛️ Government + 🔬 Technology):** The five enabling factors are explicitly on the spec and appear in mark schemes. Ensure all five are covered with specific evidence: don't just name them — show how each contributed.

4. **Limited impact screen (⛪ Religion receding but continuity persists):** A dedicated `no-immediate-impact` tagged screen showing Charles II's 1685 bloodletting is essential. This is the "twist" of Episode 4 — Harvey was right and nobody cared.

5. **Connection to Vesalius (Episode 3 interleaving):** Harvey's work builds on Vesalius — Vesalius gave accurate anatomy; Harvey gave accurate physiology. Section 3 should explicitly name this connection.

6. **Episode 5 handoff:** End of Episode 4 should pivot: "Harvey had proved the heart was a pump. But in 1665, a new plague swept London. And once again, medicine had nothing to offer." Sets up Episode 5's continuity argument.
