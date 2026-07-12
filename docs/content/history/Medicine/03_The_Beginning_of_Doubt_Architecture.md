# Episode 3: The Beginning of Doubt — Architecture

## 1. Identity (brief)

- **Episode number:** 3
- **Title:** The Beginning of Doubt
- **Build status:** Built as clean runtime `history-medicine-vesalius-beginning-doubt`; legacy bundled runtime remains hidden for compatibility.
- Content, Storyline, Specification requirements and the full Content reference pack: see `03_The_Beginning_of_Doubt_Content.md` in this directory.

### Runtime note

Episode 3 owns the first break with unquestioned authority: the Renaissance conditions that made challenge possible, Vesalius's human evidence, printing and the judgement that knowledge changed before treatment. Harvey and the wider Renaissance scientific movement belong to Episode 4; the Great Plague and everyday prevention/public-health response belong to Episode 5.

---

## Chapter narrative

For centuries, doctors trusted Galen's books, but Renaissance thinkers became more willing to question authority and test old ideas against direct observation. Vesalius used human dissection to expose errors in Galen's anatomy, showing that evidence could correct even the most respected authority — although treatments still changed much more slowly.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **Old certainties start to crack** — hook, medieval recall and learner roadmap.
2. **Why questioning became possible** — humanism, Reformation, anatomy theatres and printing.
3. **Vesalius looks for himself** — human dissection, Galen's errors and direct evidence.
4. **The evidence travels** — accurate illustration, printing and the spread of doubt.
5. **Knowledge changes before treatment** — change, continuity, significance and limits.
6. **Exam prep: Why could Vesalius challenge Galen?** — examiner teaching and assessed application.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap

- **Purpose:** Reactivate the authority and beliefs Vesalius was challenging; create tension around book knowledge versus visible evidence; orient the learner.
- **Required content:**
  - Hook: Galen's book says one thing; the human body shows something different.
  - PriorKnowledgeRecall: Galen, Four Humours, Church authority, bloodletting/purging.
  - You will learn: why questioning became easier; how Vesalius tested Galen; how printing spread evidence; why treatment changed slowly.
- **Recommended components:**
  - `ChapterHookScreen` or `CinematicRevealMoment` — book versus body tension.
  - `PriorKnowledgeRecall`.
  - `WhatYouWillLearn` / governed chapter-outcomes pattern.

### Section 2 — Why Questioning Became Possible

- **Purpose:** Teach the conditions that enabled challenge, not just define Renaissance vocabulary.
- **Required content:**
  - Renaissance as renewed learning and challenge to old ideas.
  - Humanism encouraged reason and direct study.
  - Reformation weakened some Church control over learning.
  - Anatomy theatres made observation public.
  - Printing made accurate ideas and images easier to spread.
- **Teaching rule:** Every factor must be expressed as **development → what changed → why that helped medical ideas develop**.
- **Recommended components:**
  - `ConceptReveal` — one enabling condition per step.
  - `QuickRecallScreen` — retrieve consequences, not definitions only.

### Section 3 — Vesalius Looks for Himself

- **Purpose:** Teach how human evidence exposed Galen's errors and why this mattered historically.
- **Required content:**
  - Vesalius's role and *On the Fabric of the Human Body* (1543).
  - Human dissection versus Galen's reliance on animal dissection.
  - Jaw, ribs and breastbone as memorable evidence cases.
  - Galen was not wrong about everything; Vesalius did not reject all Galenic ideas.
- **Recommended components:**
  - `KeyFigureReveal` — short cinematic introduction before detailed evidence.
  - **New comparison pattern: `SeeTheDifference`** — teach each case through:
    1. what Galen believed
    2. what Vesalius observed
    3. why Galen made the mistake
    4. why the correction mattered
  - `QuickRecallScreen` — retrieve Vesalius's method, 1543, one precise correction and the source of stronger evidence.
- **Component-gap note:** `TheoryCompare` can show two positions, but no current component fully supports claim → observation → source of error → historical significance. `SeeTheDifference` should be specified as a reusable teaching-first comparison pattern rather than a disguised true/false quiz.

### Section 4 — The Evidence Travels

- **Purpose:** Explain how one anatomist's observations became a wider challenge to authority.
- **Required content:**
  - Human dissection produced the evidence.
  - Detailed illustration made the evidence visible.
  - Printing reproduced the argument consistently and at scale.
  - Doctors across Europe could compare Galen's claims with Vesalius's evidence.
- **Recommended components:**
  - `VisualNarrativeScreen` — dissection → illustration → printed book → wider comparison → growing doubt.
  - `FactorWeb` — why Vesalius could challenge Galen: individual skill, human dissection, anatomy theatres, humanism, weaker Church authority and printing; learner makes a supported judgement about the most important factor.

### Section 5 — Knowledge Changes Before Treatment

- **Purpose:** Secure the chapter's main historical judgement and repair overstatement.
- **Required content:**
  - Change: more accurate anatomy; observation gained authority; Galen could be corrected; evidence spread faster.
  - Continuity: Four Humours, miasma, bloodletting, purging and respect for Galen remained influential.
  - Vesalius changed knowledge and method more than treatment.
- **Recommended components:**
  - `ColSortBlock` — changed / continued.
  - `MisconceptionCheck` — challenge instant-cure, total-rejection and religion-disappeared claims.
  - Retrieval close focused on the final judgement.

### Section 6 — Summary & Examiner

- **Purpose:** Teach and assess an Edexcel explanation chain without introducing new content.
- **Required content:**
  - Examiner structure: **factor → precise evidence → explain how it enabled challenge**.
  - Model the difference between naming printing and explaining its effect.
  - Assessed question: **"Explain why Vesalius was able to challenge Galen's ideas during the Renaissance."**
- **Recommended components:**
  - `ExaminerExplainsScreen`.
  - `GuidedExamResponse` or `FaceTheExaminer` as the required assessed exam-technique application.
  - `ChapterCompleteScreen`.

### Module Completion Test

- [ ] Section 1 includes retrieval (`PriorKnowledgeRecall`).
- [ ] A concise learner-facing "You will learn" roadmap is present.
- [ ] Weak spots are generated.
- [ ] Every teaching stage includes an assessed interaction.
- [ ] Every major taught idea is retrieved or applied later.
- [ ] `SeeTheDifference` teaches before it asks the learner to judge or recall.
- [ ] Printing is taught as a mechanism of spread, not as the source of Vesalius's discovery.
- [ ] Change and continuity are both explicit.
- [ ] The chapter repeatedly reinforces **knowledge changed before treatment**.
- [ ] Examiner teaching is followed by assessed exam-technique application.
- [ ] No Episode 4 or 5 content is taught as a new learning objective.
- [ ] Module ends with a completion screen.
- [ ] No feature component is used more than twice.

---

## 3. Scope boundaries and gap analysis

### Owned here

- Renaissance conditions needed to understand Vesalius.
- Vesalius, human dissection and Galen's anatomical errors.
- Printing and the spread of anatomical evidence.
- Knowledge/method change versus treatment continuity.

### Explicitly owned by Episode 4

- Harvey, Paré, Royal Society, Fracastoro, Malpighi, Leeuwenhoek, Sydenham and wider Renaissance changes in treatment and medical practice.

### Explicitly owned by Episode 5

- Great Plague beliefs, treatments and prevention; wider prevention continuity/change; pest houses; organised local-government response; Black Death comparison.

### Current component gap

The chapter needs a teaching-first evidence comparison component. `SeeTheDifference` should support a short set of paired historical or scientific claims where the learner first understands both sides, then sees why the difference matters. It should not assume prior knowledge and should not reduce the interaction to repeated binary judgement.

---

## 4. Build recommendations

1. **Keep the story as doubt, not instant revolution:** Vesalius begins a crack in authority; he does not make modern medicine arrive overnight.
2. **Make the method visible:** every anatomical correction must end with what it proved about evidence and authority.
3. **Keep the three comparison cases purposeful:** jaw, ribs and breastbone are enough; do not turn the sequence into body-part trivia.
4. **Make printing causal:** show how evidence travelled from body to illustration to book to medical community.
5. **End with judgement:** better knowledge of anatomy was a major change; everyday treatment remained limited.
6. **Protect the boundary:** do not add Royal Society, Sydenham, Fracastoro, Leeuwenhoek, Paré or Great Plague detail back into this chapter.
