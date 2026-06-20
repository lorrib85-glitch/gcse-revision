# Episode 2: The Girl Who Walked Into History — Architecture

## 1. Identity (brief)

- **Episode number:** 2
- **Title:** The Girl Who Walked Into History
- **Build status:** Not yet built
- **Content reference:** Storyline, Specification requirements and full Content reference pack: see `02_The_Girl_Who_Walked_Into_History_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity; reactivate Episode 1 knowledge; identify missing knowledge; preview this chapter.
- **Proposed content for this episode:**
  - Cinematic hook: a Supreme Court ruling says segregated schools are illegal — what happens next?
  - ChapterHookScreen (True/False): "After the Supreme Court banned school segregation, Southern schools quickly integrated" (False); "A US president personally sent troops to escort Black students into school" (True); "The Supreme Court ruling in 1954 was unanimous" (True)
  - PriorKnowledgeRecall: concepts from Episode 1 — `jim_crow`, `plessy_v_ferguson`, `naacp`, `voting_rights`, `emmett_till`
  - WhatYouWillLearn: auto-generated from screen labels
- **Suggested component(s):**
  - `ChapterHookScreen` (True/False) — opens on the gap between the law changing and reality changing; hooks the key misconception that legal victory = instant change
  - `PriorKnowledgeRecall` — retrieval of Episode 1 material; concepts: `jim_crow`, `plessy_v_ferguson`, `naacp`, `voting_rights`, `emmett_till`

### Section 2 — Learning Chunk 1
- **Purpose:** Introduce *Brown v Board* — the legal breakthrough and why it didn't immediately change anything.
- **Proposed content for this episode:**
  - *Brown v Board* (1954): unanimous ruling, Thurgood Marshall, overturning *Plessy*; *Brown II* (1955) — "all deliberate speed" loophole
  - Southern Manifesto (1956): 101 Congressmen signed; massive resistance organised; White Citizens' Councils
  - Why the law alone wasn't enough: no enforcement mechanism; states could delay; *Brown II* gave cover
- **Suggested component(s):**
  - `ExplainReveal` — cause-and-effect chain: NAACP legal strategy → *Brown* ruling → Southern Manifesto + massive resistance → "all deliberate speed" → continued segregation → Little Rock as the crisis point; reveals each step progressively
  - `QuickRecallScreen` — retrieval of *Plessy v Ferguson* and NAACP from Episode 1 (interleaving); plus *Brown* facts just taught

### Section 3 — Learning Chunk 2
- **Purpose:** The human story of Little Rock — Elizabeth Eckford, the mob, the Nine.
- **Proposed content for this episode:**
  - The Little Rock Nine: who they were, how 75 became 9, Daisy Bates's role
  - Faubus sends the National Guard: 4 September 1957; Elizabeth Eckford arrives alone; the mob; the photographs; international media
  - The Cold War dimension: USSR broadcasts the photographs; the US's international reputation at stake
  - Interleaving: connect to Episode 1's Cold War embarrassment angle — the federal government had *another* reason to act beyond civil rights conviction
- **Suggested component(s):**
  - `VisualNarrativeScreen` — beat-by-beat narrative of 4 September 1957: the plan to arrive together → Elizabeth alone → the mob → the photographs → international press coverage → Cold War propaganda; powerful, cinematic throughline
  - `QuickRecallScreen` — retrieval of *Brown* facts from Section 2 plus Elizabeth Eckford moment; locks in the law-to-reality gap

### Section 4 — Learning Chunk 3
- **Purpose:** Federal intervention — Eisenhower, the 101st Airborne, and the aftermath.
- **Proposed content for this episode:**
  - Eisenhower's reluctance: personal views; acted because Faubus defied federal authority and Cold War pressure; not from civil rights conviction
  - 101st Airborne: 24 September 1957; Nine enter school; military escorts; what daily life was like for the Nine inside (harassment, isolation)
  - Ernest Green's graduation (1958): MLK attended; first Black graduate from Central High
  - Faubus closes all schools (1958–59): "The Lost Year"; White parents sent children to private segregationist academies; *Cooper v Aaron* ruling
- **Suggested component(s):**
  - `VisualLearning` — cinematic sequence: Eisenhower's reluctant decision → 101st Airborne deployed → Nine enter school under escort → Green's graduation → Faubus closes all schools → Supreme Court strikes down closures; each scene shows the pattern of advance + resistance
  - `MatchingTask` — match cause to effect: (*Brown* ruling → massive resistance), (Elizabeth Eckford photos → international outrage), (Cold War pressure → Eisenhower acts), (Faubus closes schools → *Cooper v Aaron*); active processing of the episode's causal chains

### Section 5 — Learning Chunk 4
- **Purpose:** Significance and the takeaway — what Little Rock proved and what it didn't settle.
- **Proposed content for this episode:**
  - What Little Rock proved: federal force could enforce court orders; international attention mattered; the Supreme Court's authority was real
  - What Little Rock didn't settle: Southern schools remained largely segregated for years; Faubus won re-election six more times; the lesson for the civil rights movement was that legal victories needed legislative follow-up
  - Cold War significance: Little Rock accelerated federal willingness to act on civil rights — the same dynamic will drive the 1964 Civil Rights Act
  - Consolidation retrieval: key facts, dates, terms from the whole episode
- **Suggested component(s):**
  - `ColSortBlock` — sort evidence into "Little Rock showed progress" vs "Little Rock showed limits" — active categorisation of the episode's dual interpretation; directly maps to Q3(d) exam question structure
  - `QuickRecallScreen` — retrieval of full episode content: *Brown*, Southern Manifesto, Faubus, Elizabeth Eckford, 101st Airborne, Ernest Green, "Lost Year", *Cooper v Aaron*

### Section 6 — Summary & Examiner
- **Purpose:** No major new content; apply knowledge to exam technique; end with completion screen.
- **Proposed content for this episode:**
  - Examiner explains the Q2 "Explain why" question type — using "Why did Eisenhower send troops to Little Rock?" as the worked example; three-cause structure
  - Examiner tip: the Cold War context earns marks in Q2 if linked clearly to Eisenhower's motive — not just "it happened" but "it forced his hand"
  - FaceTheExaminer: Q2-style question — "Explain why *Brown v Board* was important for the civil rights movement"
- **Suggested component(s):**
  - `ExaminerExplainsScreen` — animated explanation of how to approach a Q2 "explain why" question; uses Eisenhower/Little Rock as worked example; three-cause structure modelled
  - `FaceTheExaminer` — Q2 question: "Explain why *Brown v Board of Education* was an important turning point for the civil rights movement"; marks against criteria; logs exam-technique patterns
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

1. **Elizabeth Eckford as central human throughline:** The 4 September 1957 moment is this episode's most powerful narrative beat — analogous to Emmett Till in Episode 1. The `VisualNarrativeScreen` in Section 3 is the right vehicle: beat-by-beat from the failed notification → arriving alone → the mob → photographs → Cold War humiliation.

2. **The law-to-reality gap as the episode's spine:** The episode's educational purpose is to show that *Brown* didn't end segregation. Every section should return to this — *Brown* was a victory (S2), but Southern resistance was fierce (S2/S3), and even after federal troops were deployed the schools were closed (S4). The Section 5 `ColSortBlock` seals this by making students categorise both sides.

3. **ColSortBlock for Q3(d) preparation:** The "progress vs limits" sort in Section 5 is a direct preparation for the "how far do you agree" interpretation question format. Make the sort categories explicit as exam language: "evidence of progress" / "evidence of limits to progress."

4. **Cold War motive — a recurring series thread:** This episode introduces the Cold War as a reason for federal action. Flag it explicitly as a recurring pattern — the same dynamic appears in Episode 7 (progress by 1975 accelerated by international reputation concerns). Students who spot this pattern across episodes score higher on Q2 multi-cause questions.

5. **Component count check:** ChapterHookScreen (S1 — mandatory), PriorKnowledgeRecall (S1 — mandatory), ExplainReveal (S2), QuickRecallScreen (S2, S3, S5 — allowed under retrieval rule), VisualNarrativeScreen (S3), VisualLearning (S4), MatchingTask (S4), ColSortBlock (S5), ExaminerExplainsScreen (S6 — mandatory), FaceTheExaminer (S6 — mandatory), ChapterCompleteScreen (S6 — mandatory). No feature component exceeds twice.
