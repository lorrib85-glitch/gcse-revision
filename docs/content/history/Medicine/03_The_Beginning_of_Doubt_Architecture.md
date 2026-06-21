# Episode 3: The Beginning of Doubt — Architecture

## 1. Identity (brief)

- **Episode number:** 3
- **Title:** The Beginning of Doubt
- **Build status:** Built (shared) as `mod2` — also covers Episodes 4 (Harvey) and 5 (Great Plague)
- Content, Storyline, Specification requirements and the full Content reference pack: see `03_The_Beginning_of_Doubt_Content.md` in this directory.

### Bundling note
`mod2` currently covers Episodes 3, 4 and 5 in one module. The series map recommends splitting it. Until that split happens, this architecture file covers only Episode 3 content within `mod2`. Episode 4 and 5 content from `mod2` is assessed in their own architecture files.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **Old Certainties Start to Crack** — intro hook, prior recall and roadmap.
2. **The Renaissance Mindset Shift** — humanism, questioning and rediscovery of ancient texts.
3. **Vesalius Opens the Body** — anatomy, dissection, observation and Galen's errors.
4. **Printing Changes the Argument** — books, diagrams, universities and spread of ideas.
5. **Doubt Without Revolution** — what changed, what stayed the same and why progress was limited.
6. **Exam Prep: Why Did Ideas Begin to Change?** — examiner traps, change/continuity judgement and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall Episodes 1–2 knowledge; create curiosity about Renaissance change; preview the episode.
- **Proposed content for Episode 3:**
  - PriorKnowledgeRecall: probe Four Humours, miasma, Church dominance, Galen errors from Episodes 1–2
  - Hook: For 1300 years, Galen was treated like the answer. Then someone started cutting into bodies and looking properly.
  - Roadmap: students should understand why the Renaissance began to challenge old ideas, but did not instantly transform treatment.
- **Suggested components:**
  - `CinematicRevealMoment` — candlelit anatomy theatre; Vesalius looking from the book to the body
  - `PriorKnowledgeRecall`
  - `WhatYouWillLearn`

### Section 2 — Learning Chunk 1
- **Purpose:** Introduce why Renaissance medicine became more questioning.
- **Proposed content for Episode 3:**
  - Renaissance means rebirth of interest in learning, art, science and classical texts
  - Humanism encouraged observation and questioning rather than pure reliance on authority
  - Wealthy patrons, universities and printed books helped ideas spread
  - But most people still believed in Galen, Four Humours and miasma
- **Suggested components:**
  - `VisualLearning` — Renaissance study, books, anatomy sketches
  - `ExplainReveal` — why new thinking became possible
  - `QuickRecallScreen`

### Section 3 — Learning Chunk 2
- **Purpose:** Develop understanding of Vesalius and anatomy.
- **Proposed content for Episode 3:**
  - Andreas Vesalius used human dissection and direct observation
  - Published *On the Fabric of the Human Body* in 1543
  - Corrected some of Galen's anatomical errors because Galen had dissected animals
  - Accurate illustrations made anatomy clearer and easier to teach
- **Suggested components:**
  - `InteractiveHotspotImage` — anatomy theatre / book illustration hotspots
  - `MatchingTask` — Galen's claim vs Vesalius' correction
  - `QuickRecallScreen`

### Section 4 — Learning Chunk 3
- **Purpose:** Show why printing and communication mattered.
- **Proposed content for Episode 3:**
  - Printing press allowed identical diagrams and arguments to spread more widely
  - Scientists could compare, challenge and build on work
  - Vesalius' book made anatomical challenge visible
  - Communication changed faster than treatments did
- **Suggested components:**
  - `VisualNarrativeScreen` — idea travelling from dissection table to printed page to university
  - `GuidedChoiceCarousel` — choose which invention/condition helps ideas spread fastest
  - `QuickRecallScreen`

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — assess change and continuity.
- **Proposed content for Episode 3:**
  - Change: anatomy improved; Galen could be challenged; observation became more important
  - Continuity: treatments still relied heavily on Four Humours; Church and tradition still influential
  - Key judgement: Renaissance medicine changed knowledge more than everyday treatment at first
  - Agents of change: Science & technology, individuals, religion/Church influence decreasing slowly
- **Suggested components:**
  - `ColSortBlock` — change vs continuity
  - `ExplainReveal` — why better anatomy did not immediately mean better cures
  - `QuickRecallScreen`

### Section 6 — Summary & Examiner
- **Purpose:** Exam application, misconception correction and module completion.
- **Proposed content for Episode 3:**
  - Common traps: saying Vesalius disproved all of Galen; saying the Renaissance immediately cured disease; forgetting continuity
  - Exam practice: explain why medical knowledge improved in the Renaissance / how far Vesalius changed medicine
  - Students should use precise phrases: anatomy, dissection, observation, printing press, challenge to authority
- **Suggested components:**
  - `ExaminerExplainsScreen`
  - `FaceTheExaminer`
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

Built inside shared `mod2`. Episode 3 content should be separated from Harvey and Great Plague content when the Medicine spine is rebuilt into 14 clean modules.

**Audit priority:** confirm Vesalius/anatomy content has its own clear section and is not blurred with Harvey/circulation.

---

## 4. Build recommendations

1. **Keep the story as doubt, not instant revolution:** Vesalius starts a crack in old authority; he does not make modern medicine arrive overnight.

2. **Use Episode 1 interleaving:** Galen, Church authority and Four Humours must be recalled so students understand what Vesalius was challenging.

3. **Make printing press visible:** This is high-value exam content because it explains why ideas spread beyond one anatomy theatre.

4. **End with judgement:** Better knowledge of anatomy = major change in knowledge, limited immediate change in treatment.
