# Episode 4: The Man Who Proved Everyone Wrong — Architecture

## 1. Identity (brief)

- **Episode number:** 4
- **Title:** The Man Who Proved Everyone Wrong
- **Build status:** Built as clean runtime `history-medicine-harvey-pare-renaissance-method`; Harvey remains dominant and the wider Renaissance-method content is supporting evidence.
- Content, Storyline, Specification requirements and the full Content reference pack: see `04_The_Man_Who_Proved_Everyone_Wrong_Content.md` in this directory.

### Runtime note

Episode 4 owns Harvey's discovery and the wider spread of Renaissance scientific method. Paré, Fracastoro, the Royal Society, Malpighi, Leeuwenhoek and Sydenham appear in chronological order as supporting evidence that observation, experiment, communication and correction were becoming more important. Wider changes in treatment and medical practice are synthesised here; Great Plague prevention and public-health response remain Episode 5 content.

---

## Chapter narrative

Harvey used observation, experiment and calculation to prove that the heart pumps blood around the body, directly overturning Galen's old model. His discovery did not transform treatment overnight, but alongside Paré, the Royal Society and other investigators it showed that Renaissance medicine was developing a repeatable method: observe, test, share and correct.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **A body full of questions** — Vesalius recall, hook and learner roadmap.
2. **The old blood story** — Galen's model of blood, liver, heart and invisible pores.
3. **Harvey follows the evidence** — circulation, valves, experiment and calculation.
4. **Evidence becomes a movement** — Paré, Fracastoro, Royal Society, Malpighi, Leeuwenhoek and Sydenham.
5. **New knowledge, uneven treatment** — practical improvement, wider medical change and strong continuity.
6. **Exam prep: Proving Galen wrong** — examiner teaching, evidence chains and assessed application.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap

- **Purpose:** Recall Vesalius and establish Harvey as the next challenge to Galen.
- **Required content:**
  - PriorKnowledgeRecall: Vesalius, human dissection, observation, printing and the knowledge-before-treatment judgement.
  - Hook: What if the most trusted doctor in history was wrong about how blood moved?
  - You will learn: Galen's model; Harvey's evidence; how scientific method spread; why treatment still changed slowly.
- **Recommended components:**
  - `CinematicRevealMoment` or chapter hook — Harvey examining pulse, valves or a beating heart in a restrained historical scene.
  - `PriorKnowledgeRecall`.
  - `WhatYouWillLearn` / governed chapter-outcomes pattern.

### Section 2 — The Old Blood Story

- **Purpose:** Make Galen's model understandable before Harvey disproves it.
- **Required content:**
  - Blood made in the liver and used up by the body.
  - Blood passing through invisible pores in the heart's septum.
  - The authority of Galen in medical education.
  - Why the model seemed plausible without better evidence.
- **Recommended components:**
  - `VisualLearning` — present Galen's model as a coherent but flawed map.
  - `TheoryCompare` or equivalent — old model versus the questions Harvey needed to answer.
  - `QuickRecallScreen`.

### Section 3 — Harvey Follows the Evidence

- **Purpose:** Teach the discovery through the evidence chain, not as a fact to memorise.
- **Required content:**
  - Heart acts as a pump.
  - Valves show one-way movement.
  - Blood-volume calculation makes constant production impossible.
  - Observation, dissection, experiment and mathematics.
  - Publication in 1628.
- **Recommended components:**
  - `InteractiveHotspotImage` or governed diagram interaction — heart, valves and evidence points.
  - `ExplainReveal` — pump → one-way valves → impossible blood volume → circulation.
  - `QuickRecallScreen`.

### Section 4 — Evidence Becomes a Movement

- **Purpose:** Show that Renaissance method spread beyond one individual and became increasingly collaborative and cumulative.
- **Required chronological sequence:**
  1. Paré, c1537–c1545 — observation overturns harmful wound treatment; ligatures improve amputation practice.
  2. Fracastoro, 1546 — "seeds" of disease as a promising but unproven idea.
  3. Royal Society, 1660 — organised experiment and exchange.
  4. Malpighi, 1661 — microscope reveals capillaries and completes Harvey's missing evidence.
  5. Royal Charter, 1662, and *Philosophical Transactions*, 1665 — credibility and wider scientific communication.
  6. Leeuwenhoek and Sydenham, 1676 — new observation at microscopic and patient level, but no complete theory of disease.
- **Teaching rule:** These are supporting examples, not six equal biographies. Each must answer: **What was observed or tested? What did it add? Why was its impact limited or important?**
- **Recommended components:**
  - `TimelineChain` or `VisualNarrativeScreen` — chronological growth of the method.
  - `MatchingTask` — investigator/institution → method → contribution.
  - `QuickRecallScreen` — focus on patterns, not trivia.

### Section 5 — New Knowledge, Uneven Treatment

- **Purpose:** Judge what changed in practical medicine and what remained traditional.
- **Required content:**
  - Genuine improvement: Paré's wound treatment and ligatures.
  - Wider change: New World remedies, medical chemistry, more treatment-focused hospitals, licensing and better anatomical training.
  - Limits: dangerous chemicals, slow adoption, persistent infection, unequal access and no correct theory of disease.
  - Continuity: transference, Four Humours, bloodletting and purging.
  - Charles II in 1685 as a memorable continuity case.
- **Recommended components:**
  - `ColSortBlock` — genuine improvement / mixed or uncertain change / clear continuity.
  - `MisconceptionCheck` — challenge "Renaissance treatment became modern" and "all new remedies worked".
  - Retrieval close on the judgement that method and knowledge advanced faster than routine treatment.

### Section 6 — Summary & Examiner

- **Purpose:** Apply Harvey and the wider Renaissance evidence without introducing new content.
- **Required content:**
  - Common traps: confusing Vesalius and Harvey; saying circulation immediately improved treatment; claiming Leeuwenhoek discovered germ theory; treating every Renaissance development as equally important.
  - Exam practice: explain why Harvey could make his discovery; explain why surgery improved; judge Renaissance progress.
  - Evidence chain language: pump, valves, calculation, circulation, capillaries, observation, experiment, publication, limited impact.
- **Recommended components:**
  - `ExaminerExplainsScreen`.
  - `GuidedExamResponse` or `FaceTheExaminer` as assessed exam-technique application.
  - `ChapterCompleteScreen`.

### Module Completion Test

- [ ] Section 1 includes retrieval (`PriorKnowledgeRecall`).
- [ ] A concise learner-facing "You will learn" roadmap is present.
- [ ] Harvey remains the dominant narrative and receives the deepest teaching.
- [ ] Galen's model is taught before it is challenged.
- [ ] Harvey's discovery is taught as an evidence chain, not a headline fact.
- [ ] The Section 4 supporting sequence is chronological.
- [ ] Supporting figures are taught through contribution and limitation, not biography dumps.
- [ ] Malpighi is explicitly linked to Harvey's missing capillary evidence.
- [ ] Royal Society communication is explicit.
- [ ] Wider treatment change and continuity are both taught.
- [ ] Every major taught idea is retrieved or applied.
- [ ] Examiner teaching is followed by assessed exam-technique application.
- [ ] No Great Plague prevention/public-health content is taught as a new Episode 4 objective.
- [ ] Module ends with a completion screen.
- [ ] No feature component is used more than twice.

---

## 3. Scope boundaries and gap analysis

### Owned here

- Harvey and circulation.
- Paré and practical evidence-led surgery.
- Fracastoro, Royal Society, Malpighi, Leeuwenhoek and Sydenham as the chronological spread of Renaissance method.
- Wider changes in treatment, hospitals, surgeons, apothecaries and medical practice.
- Strong continuity in humoural treatment.

### Explicitly owned by Episode 3

- Renaissance background, Vesalius, anatomy theatres, printing and the first challenge to Galen's anatomy.

### Explicitly owned by Episode 5

- Great Plague beliefs, treatments and prevention; wider prevention and public-health change; pest houses; local-government action; Black Death comparison.

### Learning-design risk

The supporting Renaissance sequence could become a list of names. The builder must organise it around one repeated question: **How did the way doctors found and shared knowledge change?** Harvey remains the emotional and conceptual centre; the other examples prove that his method was part of a wider movement.

---

## 4. Build recommendations

1. **Protect Harvey's dominance:** the chapter is not a Renaissance hall of fame.
2. **Teach the evidence chain visually:** valves and blood-volume calculation should make Galen's model collapse in front of the learner.
3. **Use supporting figures to show a pattern:** observe → test → share → correct.
4. **Keep chronology visible:** Paré and Fracastoro precede Harvey; Royal Society, Malpighi, Leeuwenhoek and Sydenham show the method becoming cumulative.
5. **Separate knowledge from treatment:** genuine improvements existed, but there was still no reliable theory of disease and old treatments remained common.
6. **End with a balanced judgement:** Renaissance medicine made major progress in method and understanding, but practical change was uneven and slow.
