# Episode 1: Trust Me, I'm Following Jupiter — Architecture

## 1. Identity (brief)

- **Episode number:** 1
- **Title:** Trust Me, I'm Following Jupiter
- **Build status:** Built as `history-medicine-medieval-beliefs-causes`
- Content, Storyline, Specification requirements and the full Content reference pack: see `01_Trust_Me_Im_Following_Jupiter_Content.md` in this directory.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **Strange Ideas, Serious Medicine** — intro hook, prior recall and roadmap.
2. **What Made People Sick?** — religious, astrological, miasma and humoural explanations.
3. **Why Galen Ruled the Room** — Hippocrates, Galen, Church authority and book learning.
4. **The Medieval Treatment Toolkit** — physicians, barber surgeons, apothecaries, hospitals and prevention.
5. **Why the System Survived** — continuity, agents of change/continuity and the coherent-but-wrong system.
6. **Exam Prep: Explain the Grip of Galen** — examiner traps, mark-scheme thinking and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity, reactivate previous chapter knowledge, identify missing knowledge, generate weak spots, preview the chapter.
- **Proposed content for this episode:**
  - Hook: What do people typically believe killed people in the Middle Ages? (disease, not war — subverts expectation)
  - PriorKnowledgeRecall: first episode in series — recall acts as baseline capture of prior knowledge
  - Concepts to probe: Four Humours, God/sin causation, miasma, role of the Church, Galen
  - WhatYouWillLearn: previews the central tension ("everyone agreed. everyone was wrong. and nobody could say so.")
- **Suggested components:**
  - `CinematicRevealMoment` — medieval physician reading a star chart by candlelight; establishes atmosphere and curiosity
  - `ChapterHookScreen` (True/False) — e.g. "Physicians examined your urine to check if your humours were balanced." [TRUE]
  - `PriorKnowledgeRecall` — baseline recall for first episode

### Section 2 — Learning Chunk 1
- **Purpose:** Introduce the three causes of disease — religious, astrology/miasma, Four Humours.
- **Proposed content for this episode:**
  - Religious explanations: disease = punishment from God for sin / test of faith
  - Astrology: star charts in diagnosis; Church accepted it as extension of God's will
  - Miasma: bad air from swamps, corpses, rotting matter; endorsed by both Hippocrates and Galen
  - Four Humours: blood, phlegm, black bile, yellow bile; linked to seasons and personality; Theory of Opposites
  - Why all four reinforced each other (the "coherent system" argument)
- **Suggested components:**
  - `VisualLearning` — cinematic scenes showing each cause-of-disease belief with atmospheric medieval imagery
  - `InteractiveCollectionExplorer` — explore each humour, its season/trait/colour associations; learner selects and reveals
  - `QuickRecallScreen` — "What caused disease in medieval England? Choose all that apply."

### Section 3 — Learning Chunk 2
- **Purpose:** Develop understanding — why Galen and Hippocrates dominated.
- **Proposed content for this episode:**
  - Hippocrates (Ancient Greece): created Four Humours; encouraged observation
  - Galen (Ancient Rome): Theory of Opposites; believed in the soul (Church-compatible); dissected animals not humans → ~300 errors
  - Three Reasons why ancient thinking dominated: Church promotion, book learning culture, lack of alternatives (no dissection)
  - Dissection mostly illegal; criminals occasionally allowed; disagreements explained away
  - Printing press (1440): existed but not yet disruptive
- **Suggested components:**
  - `VisualNarrativeScreen` — narrative of how the Church made Galen's ideas the only ones available
  - `ExplainReveal` — three-step chain: Church controls books → Galen dominates → no alternatives → errors persist 1300 years
  - `MatchingTask` — match Galen's claims to true/false about human anatomy (sets up Vesalius contrast in Episode 3)

### Section 4 — Learning Chunk 3
- **Purpose:** Human experience — how medieval people were actually treated.
- **Proposed content for this episode:**
  - Treatments: religious (prayer, fasting, Mass, pilgrimages); supernatural (charms, amulets, incantations, astrology in timing of operations); humoural (blood-letting, purging, Theory of Opposites); herbal (theriaca); urine examination
  - Three types of medic: physician (expensive, diagnoses only), barber surgeon (small operations, experience-based), apothecary (herbal remedies, cheaper)
  - Hospitals: run by Church/monasteries; 500+ by 1400; care not cure; no physicians; infectious patients rejected
  - Home care: women; herbal remedies
  - Prevention: Regimen Sanitatis, stewes (public baths), sweet herbs/posy, local government action
- **Suggested components:**
  - `GuidedChoiceCarousel` — learner plays medieval physician; presented with symptoms and humour assessment; chooses treatment using Theory of Opposites
  - `InteractiveHotspotImage` — medieval hospital scene with hotspots; tap to reveal who is treated and who is turned away
  - `QuickRecallScreen` — "Which was NOT a job of a medieval physician?"

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — significance, change/continuity, reinforce core message.
- **Proposed content for this episode:**
  - Change and continuity: what stays the same into the Renaissance (Four Humours, miasma, herbal remedies)
  - Three Agents of Continuity: Religion ⛪ (primary), Individuals 👤 (Galen/Hippocrates), Science & technology 🔬 (printing press not yet disruptive)
  - The "logical coherence" argument: medieval medicine was wrong but internally consistent
  - Interleaving retrieval: revisit Four Humours, astrology, miasma
- **Suggested components:**
  - `ColSortBlock` — sort beliefs and practices into "Continuity into Renaissance" vs "Medieval only"
  - `ExplainReveal` — "Why couldn't anyone challenge Galen?" — layered reveal showing convergence of Church, economics, epistemology
  - `QuickRecallScreen` — final retrieval across all episode concepts

### Section 6 — Summary & Examiner
- **Purpose:** Exam application, misconceptions, module completion.
- **Proposed content for this episode:**
  - Common traps: "medieval people were ignorant" (wrong — system was coherent); "Church prevented all medicine" (wrong — Church ran hospitals)
  - Exam question: "Explain why Galen had such a big influence on medieval medicine" — Three Reasons model
  - MisconceptionCheck: "The Church ran hospitals to help cure disease" [FALSE]; "Physicians performed operations like bloodletting" [FALSE]
- **Suggested components:**
  - `ExaminerExplainsScreen` — examiner explains the Three Reasons model with mark-scheme language
  - `FaceTheExaminer` — 12-mark "explain why" question on Galen's influence
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

Built as `history-medicine-medieval-beliefs-causes` — 32 screens.

Known screen tags from `src/modules.js`: `four-humours` (s4), `galen` (s9), `medieval-practitioners` (s12), `miasma` (s13), `core-takeaway` (s31).

**Inventory (tags only — full screen content lives in `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js`):**
- s4 `four-humours` → Section 2 ✓
- s9 `galen` → Section 3 ✓
- s12 `medieval-practitioners` → Section 4 (physicians/barber surgeons/apothecaries) ✓
- s13 `miasma` → Section 2 ✓
- s31 `core-takeaway` → Section 5 ✓

**GAPS (proposed content not confirmed by existing tags):**
- No `astrology` tag — astrology-as-cause coverage unconfirmed
- No `hospital-care` tag — medieval hospitals as a standalone screen unconfirmed
- No `prevention` or `regimen-sanitatis` tag
- No `theory-of-opposites` tag
- No `church-influence` standalone tag
- Section 1 and Section 6 screen tags absent — PriorKnowledgeRecall and FaceTheExaminer presence unconfirmed

---

## 4. Build recommendations

1. **Storyline integration (⛪ Religion agent):** The Core takeaway — the system was coherent and self-reinforcing — should thread as a recurring motif: Section 1 hook, Section 3 Three Reasons reveal, Section 5 ColSortBlock. Verify `core-takeaway` at s31 explicitly names the Church/Religion agent as the primary mechanism. If not, update that screen.

2. **Astrology screen audit (⛪ Religion):** If no screen covers astrology as a cause, add a dedicated beat in the Section 2 VisualLearning. Astrology appears in past-paper questions and mark schemes.

3. **Hospitals screen (🏛️ Government):** "Describe two features of hospitals in medieval England" is a common 2-mark question. Verify `medieval-practitioners` screen covers hospitals, or add a dedicated `hospital-care` tagged screen in Section 4.

4. **FaceTheExaminer in Section 6 (Exam technique):** "Explain why Galen had such a big influence" is one of the most predictable exam questions for this period. Confirm this question is present in Section 6.

5. **Interleaving check:** The `core-takeaway` at s31 is late. Confirm Four Humours concepts also recur in Section 3 and 4 retrieval screens — the s4 tag (four-humours) is early Section 2; it should reappear in later QuickRecallScreen and MatchingTask.

6. **Episode 2 handoff:** End of Episode 1 should tease the Black Death — the Black Death is where the "coherent system meets its greatest test" narrative begins. Agents: ⛪ Religion (people pray harder) + 👤 Individuals (no individual can save them).
