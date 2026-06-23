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
- **Purpose:** Make the value of the episode immediately clear: content is learned; now the student must turn it into marks.
- **Proposed content:**
  - Hook question: "What separates a Grade 6 essay from a Grade 8/9 essay?" Answer: a clear argument maintained throughout
  - True/false: "A longer essay always scores higher" — FALSE
  - True/false: "Context should have its own paragraph" — FALSE
  - True/false: "PEE automatically creates top-band writing" — FALSE
  - AQA recap: no extract, whole-play essay, 30 marks plus 4 SPaG
  - Self-assessment: choose strongest and weakest route from the ten essay routes
- **Suggested component(s):**
  - `ChapterHookScreen` — Grade 6 vs Grade 9 hook
  - `PriorKnowledgeRecall` — ten essay routes self-assessment
  - `MisconceptionCheck` — essay myths: length, context paragraph, quote quantity, PEE

### Section 2 — What Top Answers Do
- **Purpose:** Teach the difference between plot summary and argument.
- **Proposed content:**
  - Grade 4–6 habits: retelling, simple character labels, bolted-on AO3, technique spotting, long quotations
  - Grade 7–9 habits: thesis, whole-play range, embedded AO2, woven AO3, judgement and nuance
  - Worked comparison on one quote: "panic-stricken"
  - Weak version: "This shows Birling is scared"
  - Strong version: "By ending with Birling 'panic-stricken', Priestley shows that Birling has not developed guilt, only fear of exposure"
  - Explain why the second version scores better: AO1 argument, AO2 stage direction, structural judgement
- **Suggested component(s):**
  - `TheoryCompareBlock` — mid-band vs top-band paragraph side by side
  - `ExaminerExplainsScreen` — why the top paragraph scores higher
  - `ConceptReveal` — thesis first, evidence second, analysis third, context fourth

### Section 3 — Route Builder
- **Purpose:** Give students reusable thesis/evidence/context maps for the main AIC essay routes.
- **Proposed content:**
  - Ten routes shown as selectable cards:
    1. Responsibility
    2. Social class
    3. Mr Birling
    4. Inspector Goole
    5. Sheila
    6. Eva Smith
    7. Younger and older generations
    8. Gender inequality
    9. The ending
    10. Stagecraft / tension / structure
  - Each card includes:
    - one strong thesis
    - three whole-play moments
    - three flexible quotes
    - one AO3 lens
    - one common mistake
  - Priority practice routes: responsibility, Inspector, Sheila, generations, ending
- **Suggested component(s):**
  - `InteractiveCollectionExplorer` — ten route cards
  - `MatchingTask` — match quote to route
  - `ColSortBlock` — sort moments into beginning / middle / end
  - `SwipeSort` — strong thesis vs weak thesis

### Section 4 — Quote Machine / AO2 Practice
- **Purpose:** Drill the 20 most useful quotes and teach students to analyse phrases, not dump long quotations.
- **Proposed content:**
  - Master quote bank of 20 flexible quotations
  - Each quote should show:
    - exact wording
    - method
    - usable route(s)
    - embedded sentence model
    - one AO3 link where relevant
  - Practice examples:
    - embed "community and all that nonsense"
    - analyse "members of one body"
    - analyse "panic-stricken"
    - compare "cheap labour" with "people"
    - analyse "fire and blood and anguish"
- **Suggested component(s):**
  - `InteractiveCollectionExplorer` — master quote bank
  - `FillInTheBlanksBlock` — complete embedded analysis sentences
  - `MatchingTask` — quote → route → method
  - `QuoteLadder` — simple meaning → method → Priestley's purpose → context

### Section 5 — Guided Exam Practice
- **Purpose:** Turn the route builder and quote machine into timed paragraph/essay writing.
- **Proposed content:**
  - Student chooses one of three guided routes:
    - Responsibility
    - Inspector Goole
    - Younger and older generations
  - For each route:
    - question
    - thesis starter
    - three-moment plan
    - paragraph scaffold
    - model paragraph
    - examiner breakdown: AO1 / AO2 / AO3 / SPaG
  - One full model opening and one model analytical paragraph
  - Mini mark-check: does the paragraph answer the question, analyse method, use context and link whole play?
- **Suggested component(s):**
  - `GuidedExamResponse` — guided route practice
  - `FaceTheExaminer` — student writes an opening thesis and gets feedback
  - `ExaminerExplainsScreen` — mark scheme breakdown
  - `ExamRoundDebrief` — log weak technique areas for later retrieval

### Section 6 — Final Retrieval & Cold Challenge
- **Purpose:** End the series with independent transfer, not passive completion.
- **Proposed content:**
  - Rapid recall: ten routes, 20 quotes, five AO3 lenses, five top-band habits
  - SPaG quick screen: its/it's, there/their/they're, sentence control, title formatting, precise vocabulary
  - Final self-assessment: choose weakest route
  - Cold challenge:
    1. write one thesis sentence
    2. choose three whole-play moments
    3. write one paragraph with embedded quote, AO2 and AO3
  - Chapter completes only after submission
- **Suggested component(s):**
  - `QuickRecallScreen` — quote and route recall
  - `RecoveryQuizPlayer` — common essay mistakes
  - `MisconceptionCheck` — Grade 6 habits vs Grade 8/9 habits
  - `GuidedExamResponse` in reduced/no-hint mode — final cold paragraph

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

### Fixed content gaps in this revision

- Reframed the chapter as a practical exam-training engine rather than a long content recap.
- Removed risky overclaims about question types and welfare-state causation.
- Corrected route evidence to avoid quote/function slips.
- Strengthened AQA no-extract format and AO1/AO2/AO3/AO4 clarity.
- Added a cleaner essay machine method: thesis → moments → embedded quote → AO2 → woven AO3 → judgement.
- Added a 20-quote master bank and final cold paragraph challenge.

---

## 4. Build recommendations

1. **This is not a normal content chapter:** Every screen must improve exam writing. Cut any screen that only repeats content from earlier chapters without making the student practise technique.

2. **Make mid vs top comparison the anchor screen:** A side-by-side paragraph upgrade is the highest-value teaching moment. It shows the difference faster than explanation alone.

3. **Use the route builder as the navigation spine:** Students should choose routes and build essays, not scroll through a giant knowledge dump.

4. **Keep the master quote bank interactive:** The quote bank must be drilled through retrieval and embedding practice. A static list will not change exam performance.

5. **AO3 must be woven:** Model this repeatedly. The key rule: context explains Priestley's purpose or audience effect inside the paragraph.

6. **Do not over-scaffold the final task:** The final challenge should be a cold paragraph for the weakest route. That is the transfer test.

7. **Design:** Use an academic workshop feel: dark plum English palette, paper/ink/annotation motifs, subtle gold for selected route/progress. No dashboard, no AI-writing-generator vibe, no childish essay machine cogs.

---

## 10-point Module Completion Test

- [ ] Students can explain the AQA no-extract format
- [ ] Students can name AO1, AO2, AO3 and AO4 requirements
- [ ] Students can build a thesis for at least five routes
- [ ] Students can choose three whole-play moments for a route
- [ ] Students can embed a short quotation naturally
- [ ] Students can analyse language/form/structure without technique spotting
- [ ] Students can weave AO3 into analysis
- [ ] Students can identify and fix a Grade 6 paragraph habit
- [ ] Students have completed one guided paragraph
- [ ] Students have completed one cold paragraph for their weakest route
