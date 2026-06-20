# Episode 7: How Much Had Really Changed? — Architecture

## 1. Identity (brief)

- **Episode number:** 7
- **Title:** How Much Had Really Changed?
- **Build status:** Not yet built
- **Content reference:** Storyline, Specification requirements and full Content reference pack: see `07_How_Much_Had_Really_Changed_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity; reactivate Episodes 1–6 knowledge; preview this chapter.
- **Proposed content for this episode:**
  - Cinematic hook: 1975 — twenty years since Rosa Parks was arrested. Laws have changed. Juries are integrated. Seven hundred Black Americans hold elected office in the South. But the median Black family earns 61 cents for every dollar a white family earns. So — how much had really changed?
  - ChapterHookScreen (True/False): "The 1965 Voting Rights Act immediately gave all Black Americans in the South the vote" (False — registration transformed but economic coercion and violence continued); "By 1975 there were over 700 Black elected officials in the South" (True); "Black and white Americans had equal incomes by 1975" (False)
  - PriorKnowledgeRecall: concepts from Episodes 1–6 — `voting_rights`, `civil_rights_act_1964`, `black_power`, `kerner_report`, `naacp`, `selma`
  - WhatYouWillLearn: auto-generated from screen labels
- **Suggested component(s):**
  - `ChapterHookScreen` (True/False) — the "equal by 1975" misconception is the most important to address before the chapter begins
  - `PriorKnowledgeRecall` — retrieval of Episodes 1–6; concepts: `voting_rights`, `civil_rights_act_1964`, `black_power`, `kerner_report`, `naacp`, `selma`

### Section 2 — Learning Chunk 1
- **Purpose:** The Selma to Montgomery marches and the Voting Rights Act — the final legislative peak.
- **Proposed content for this episode:**
  - Why Selma: ongoing voter registration campaign; Sheriff Jim Clark's brutal response; SCLC/SNCC decision to march
  - Bloody Sunday (7 March 1965): Edmund Pettus Bridge; clubs, tear gas, horses; national television; LBJ's "We Shall Overcome"
  - Third march (21–24 March): 25,000 reach Montgomery; MLK's "How Long, Not Long" speech
  - Voting Rights Act signed 6 August 1965: what it did; transformation of Black voter registration
- **Suggested component(s):**
  - `VisualNarrativeScreen` — beat-by-beat: Selma voter registration campaign → Bloody Sunday (7 March) → national outrage → LBJ's address to Congress → third march → Voting Rights Act signed; the arc from the bridge to the law
  - `QuickRecallScreen` — retrieval of poll taxes and literacy tests (Episode 1) interleaved with Selma/Voting Rights Act facts; connects the Episode 1 system of voting denial to its legislative dismantlement

### Section 3 — Learning Chunk 2
- **Purpose:** Measuring progress by 1975 — the evidence on both sides.
- **Proposed content for this episode:**
  - Progress: 700+ Black elected officials in the South; Maynard Jackson (Atlanta, 1973); affirmative action; 1968 Fair Housing Act; Black voter registration transformed; growing Black middle class
  - Limits: median income 61% of white; poverty rate ≈3× white; housing segregation continued despite 1968 Act; Northern schools re-segregated through white flight; Nixon's Southern Strategy
  - The gap between law and lived reality: laws changed faster than economic and social structures
  - Interleaving: connect to Kerner Report (Episode 6) — its recommendations were never implemented; the report's "two societies" prediction had largely come true
- **Suggested component(s):**
  - `InteractiveCollectionExplorer` — explore "Progress by 1975" (Voting Rights Act impact / Maynard Jackson / affirmative action / median income gap / housing segregation / Nixon's Southern Strategy); colour-coded by type (progress vs limits); directly prepares the Q3(d) framework
  - `QuickRecallScreen` — retrieval of Kerner Report (Episode 6), 1964 Civil Rights Act limits (Episode 5) interleaved with 1975 progress/limits facts; interleaving that links the promised change to the delivered change

### Section 4 — Learning Chunk 3
- **Purpose:** Northern resistance — busing crisis and white flight as proof that legal equality didn't equal social equality.
- **Proposed content for this episode:**
  - School busing: court-ordered; designed to integrate schools when residential segregation produced de facto segregated neighbourhood schools
  - Boston busing crisis (1974–75): bottles, bricks, racial slurs at Black children on buses; fierce white resistance; violence in schools
  - White flight: white families moved to suburbs to avoid integration → schools effectively re-segregated → the structural problem of residential segregation deepened
  - Nixon's Southern Strategy: appealed to white conservatives; weakened EEOC; slowed enforcement; represents the political retreat from civil rights
  - Interleaving: connect to Episode 1's "life in the North" — de facto segregation, ghettos, economic disadvantage; the busing crisis shows these structures were still in place in 1975
- **Suggested component(s):**
  - `ExplainReveal` — cause-and-effect chain: residential segregation → neighbourhood schools segregated → courts order busing → white resistance (Boston) → white flight → schools re-segregated; shows how the legal tool (busing) was undermined by the structural problem it was trying to fix
  - `MatchingTask` — match progress/limits evidence to category: (700 Black elected officials → political progress), (median income 61% of white → economic limit), (Boston busing crisis → Northern resistance), (Nixon's Southern Strategy → political retreat from civil rights); active processing of the evaluation framework

### Section 5 — Learning Chunk 4
- **Purpose:** Final assessment — what the movement achieved and what remained; setting up the series conclusion.
- **Proposed content for this episode:**
  - MLK's assassination (4 April 1968) and its aftermath: 120 cities rioted; 1968 Civil Rights Act passed within a week; but the movement lost its most unifying figure
  - Fred Hampton (December 1969): the federal government was still killing Black leaders even after the legislation was passed
  - Series through-line: one nation fighting two battles — by 1975, both the civil rights struggle and the Vietnam War had cost enormous human and political capital without full victory; Episodes 8–12 develop the Vietnam side
  - Overall verdict: legal framework transformed; economic and social equality still distant; the movement's work was unfinished in 1975
  - Consolidation retrieval: key facts, dates, terms from the whole episode
- **Suggested component(s):**
  - `ColSortBlock` — sort evidence into "Civil rights progress by 1975" vs "Civil rights limits by 1975" — this is the direct exam preparation for Q3(d); students who can sort these accurately can write the evaluation essay
  - `QuickRecallScreen` — retrieval of full episode content: Bloody Sunday, Voting Rights Act, Maynard Jackson, median income, Boston busing, Nixon, MLK assassination, Fred Hampton

### Section 6 — Summary & Examiner
- **Purpose:** No major new content; apply knowledge to exam technique; end with completion screen.
- **Proposed content for this episode:**
  - Examiner explains the Q3(d) "How far do you agree" question — using a 1975 civil rights progress interpretation as the worked example; agree/disagree/overall judgement structure
  - Examiner tip: the most common error is listing evidence without connecting it to the interpretation; the best answers say "this interpretation is supported by X because..." and "this interpretation is challenged by Y because..."
  - FaceTheExaminer: Q3(d)-style question — "How far do you agree that, by 1975, Black Americans had achieved equality with white Americans?"
- **Suggested component(s):**
  - `ExaminerExplainsScreen` — animated Q3(d) structure explanation; 1975 progress/limits as worked example; models "supported by... because... / challenged by... because... / overall..." structure
  - `FaceTheExaminer` — Q3(d) question: "How far do you agree that, by 1975, Black Americans had achieved equality with white Americans?"; marks against criteria; logs exam-technique patterns
  - `ChapterCompleteScreen`

### Module Completion Test (from Architecture Doc)

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

---

## 4. Build recommendations

1. **The 61% income figure as the episode's anchor statistic:** Median Black family income at 61% of white median is the single most powerful statistic in this episode for Q3(d) answers. It should appear in multiple places: the `ChapterHookScreen`, the `InteractiveCollectionExplorer`, and the `ColSortBlock`. Students who can use specific statistics in Q3(d) answers score in the highest bands.

2. **Bloody Sunday for Q2 practice:** The `VisualNarrativeScreen` in Section 2 should be emotionally and narratively powerful — John Lewis being beaten on the Edmund Pettus Bridge is as strong a narrative moment as Emmett Till (Episode 1). It's also directly causally linked to the Voting Rights Act, making it ideal Q2 material. The Section 6 `FaceTheExaminer` should have an alternative Q2 question about Selma as a back-up option.

3. **The Q3(d) framework as the episode's educational purpose:** This episode exists to give students the balanced factual base for Q3(d) "how far do you agree" questions about progress. The `ColSortBlock` in Section 5 and the `ExaminerExplainsScreen` in Section 6 are the episode's exam-preparation core. Every section should build toward the ability to sort evidence into the two columns.

4. **Boston busing as a Northern mirror of the Southern story:** Students often think civil rights was only a Southern story. The Boston busing crisis (Section 4) shows that Northern white resistance to integration was just as fierce as Southern resistance — and that by 1974–75 it was still ongoing. The `ExplainReveal` in Section 4 should draw this connection explicitly.

5. **Series bridge at the end of Section 5:** This episode closes KT1/KT2. Section 5 should include a brief forward-flag: "the same nation that couldn't deliver full equality at home was also fighting — and losing — a war abroad. From Episode 8, we turn to Vietnam." This is the series through-line made explicit at the bridge point.

6. **Component count check:** ChapterHookScreen (S1 — mandatory), PriorKnowledgeRecall (S1 — mandatory), VisualNarrativeScreen (S2), QuickRecallScreen (S2, S3, S5 — retrieval rule), InteractiveCollectionExplorer (S3), ExplainReveal (S4), MatchingTask (S4), ColSortBlock (S5), ExaminerExplainsScreen (S6 — mandatory), FaceTheExaminer (S6 — mandatory), ChapterCompleteScreen (S6 — mandatory). No feature component exceeds twice.
