# Episode 12: Build the Essay Machine — Architecture

## 1. Identity (brief)

- **Episode number:** 12
- **Title:** Build the essay machine
- **Build status:** Not yet built — full build from spec
- **Header image:** `/English/An Inspector/aic-02-grade-9-essay-structure-header.png`
- **Content pointer:** see `12_Build_The_Essay_Machine_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Proposed content:** Hook question: "What's the one thing that separates a Grade 6 and a Grade 9 essay on An Inspector Calls?" (answer: the thesis — an argument throughout vs a series of points); quick recall of the ten essay routes; prior knowledge check — which themes, characters, and quotes from Episodes 1–11 the student feels most and least confident about; AQA Paper 2 Section A format recap (30 + 4 SPaG; AO split)
- **Suggested component(s):** `ChapterHookScreen` (the "what separates a 6 from a 9?" hook — makes the episode's value immediately clear); `PriorKnowledgeRecall` — the ten essay routes as a self-assessment checklist

### Section 2 — Plot & Dramatic Action
- **Proposed content:** This section covers essay structure rather than plot. Content: what a top-band essay does (thesis stated in para 1; argument maintained throughout; AO2 embedded; AO3 woven in; whole-play range; counter-argument); what a mid-band essay looks like (plot retelling; AO2 named not embedded; AO3 separate paragraph; evidence from one act); a worked example of the structural difference on the question "How does Priestley present responsibility?"
- **Suggested component(s):** `ExaminerExplainsScreen` — the grade boundary explained beat by beat; `ConceptReveal` — the five structural differences between Grade 6 and Grade 9; `TheoryCompareBlock` — mid-band paragraph vs top-band paragraph side by side (same quote, different technique)

### Section 3 — Theme & Context
- **Proposed content:** The ten essay routes with thesis statements; how AO3 works in practice (woven into analysis, not separate); the three AO3 lenses that unlock the most marks (1912 capitalism vs 1945 socialism; morality play tradition; Priestley's political biography); how to use dramatic irony as an AO3 + AO2 combined move; how to argue multiple interpretations of the Inspector without just listing them
- **Suggested component(s):** `InteractiveCollectionExplorer` — the ten routes with thesis, key evidence (3 quotes), and AO3 link; `ExplainReveal` — how to weave AO3 into an analytical paragraph step by step; `TheoryCompareBlock` — Birling's worldview vs the Inspector's (the central opposition that answers most AIC questions)

### Section 4 — Quote Analysis (AO2)
- **Proposed content:** The master quote bank: the 20 most exam-efficient quotes across all ten routes, with technique named, embedded analysis modelled, and AO3 link; how to select quotes for a whole-play essay (spread across acts; quotation length — phrase rather than sentence; embed rather than introduce); five worked embedding examples showing mid vs top technique
- **Suggested component(s):** `InteractiveCollectionExplorer` — the 20-quote master bank with embedded analysis modelled for each; `FillInTheBlanksBlock` — students complete the embedded analysis for five key quotes; `MatchingTask` — match quote to essay route (which routes does this quote serve?)

### Section 5 — Exam Practice
- **Proposed content:** Three timed essay practice options (student selects): Route 1 (responsibility), Route 7 (generations), Route 4 (the Inspector); each with: thesis prompt, paragraph scaffold, model paragraph, mark-scheme breakdown; a full-length model essay (Route 1 or Route 5) annotated with AO1/AO2/AO3 marginal notes; a self-mark checklist: thesis maintained? AO2 embedded? AO3 woven in? Whole-play range? Counter-argument?
- **Suggested component(s):** `GuidedExamResponse` — the full scaffold for one route (question → marks → scaffold → model → mark-by-mark breakdown); `FaceTheExaminer` — free-write an opening paragraph, then examiner feedback; `ExamRoundDebrief` — consolidate performance across the three practice options and log recurring technique weaknesses

### Section 6 — Retrieval & Wider Play Links
- **Proposed content:** The complete series retrieval: all 11 episodes mapped to the ten essay routes (which quotes and moments serve which route); a final self-assessment: which routes feel confident, which need more retrieval; the three most commonly dropped marks on AIC essays and how to fix each; a closing challenge: "Write the thesis for whichever route you feel least confident about — then build the first paragraph from scratch"
- **Suggested component(s):** `QuickRecallScreen` — the 20 key quotes rapid recall; `RecoveryQuizPlayer` — the ten essay routes with thesis recall questions; `MisconceptionCheck` — the five most common Grade 6 essay habits (stated as true/false)

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **This episode is not a content episode — it is a technique episode:** Every screen must be exam-facing. The question every screen should answer is: "will this make the student write a better essay in the exam?" If a screen teaches only content that was already covered in Episodes 1–11, cut it or redirect it toward technique.

2. **The mid vs top comparison is the episode's most valuable single screen:** Build a side-by-side of two paragraphs — same quote ("panic-stricken"), same question ("How does Priestley present Birling?"), different technique. The difference between Grade 6 and Grade 9 is immediately visible. This is the screen students will return to.

3. **The master quote bank is the episode's most valuable asset:** 20 quotes, each with: the exact text, the technique it demonstrates, an embedded analysis model, and the essay routes it serves. Students who internalize this bank can construct paragraphs under exam conditions without freezing. Drill it with `FillInTheBlanksBlock` and `MatchingTask` before moving to free writing.

4. **Route selection matters:** Do not build all ten routes equally in Section 5. Routes 1 (responsibility), 4 (the Inspector), 5 (Sheila), and 7 (generations) are the four most frequently examined. Build these as the primary practice targets. Routes 9 (ending) and 10 (stagecraft) are slightly less common but have specific mark scheme rewards — include them in Section 3's `InteractiveCollectionExplorer` but not in the full `GuidedExamResponse` scaffold.

5. **The AO3 integration problem is the single biggest source of lost marks:** Students write a context paragraph. Examiners can't credit it as AO3 because it isn't linked to analysis. The solution is explicit instruction: "Your AO3 sentence should be inside your analytical sentence, not in a separate paragraph." Model this three times before asking students to try it. `ExplainReveal` (step by step: here is the analysis → now add the context → here is the integrated version) is the right component for this.

6. **SPaG (AO4) is worth 4 marks — worth one brief screen:** Students often leave 2–3 SPaG marks on the table through carelessness. One screen naming the three most common SPaG errors in exam essays (apostrophes in "it's/its", run-on sentences, "their/they're/there") and three correctable example sentences will secure these marks. This is a quick win and should not take more than one screen.

7. **Close with a closing challenge, not a completion screen:** The final screen should prompt the student to write a cold-start paragraph for whichever route they feel least confident about. No scaffold. No hints. This is the test of whether the machinery works. The chapter-complete screen appears after they submit it — the act of submitting closes the episode.
