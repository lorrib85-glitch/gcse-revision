# Episode 2: The Girl Who Walked Into History — Architecture

## 1. Identity (brief)

- **Episode number:** 2
- **Title:** The Girl Who Walked Into History
- **Build status:** Not yet built
- **Content reference:** Storyline, Specification requirements and full Content reference pack: see `02_The_Girl_Who_Walked_Into_History_Content.md` in this directory.

---

## 2. Navigation spine (6 parts)

These are the six progress-rail stages for this module. Each stage should become one tappable dot in the in-module progress bar. The dot should jump to the first screen of that stage. Do **not** use one dot per screen.

1. **The Law Changes First** — hook around *Brown v Board* and the gap between legal victory and lived reality.
2. **Brown Breaks Plessy** — *Brown*, *Brown II*, Thurgood Marshall, 723 districts and the limits of court rulings.
3. **Elizabeth Faces the Mob** — Little Rock Nine, Elizabeth Eckford, Faubus and the media shock.
4. **Troops at the School Gate** — Eisenhower, the 101st Airborne, Ernest Green, the Lost Year and *Cooper v Aaron*.
5. **Progress Meets Backlash** — what Little Rock proved, what it did not settle, and why the federal government acted.
6. **Exam Prep: Brown, Little Rock and Significance** — Q2 causation and progress/limits judgement.

**Progress rail rule:** render these as six dots only. Labels stay hidden unless tapped. The rail should appear on all normal learning pages and be hidden only on full-screen video/cinematic reveal moments.

---

## 3. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity; reactivate Episode 1 knowledge; identify missing knowledge; preview this chapter.
- **Proposed content for this episode:**
  - Cinematic hook: a Supreme Court ruling says segregated schools are illegal — what happens next?
  - ChapterHookScreen (True/False): "After the Supreme Court banned school segregation, Southern schools quickly integrated" (False); "A US president personally sent troops to escort Black students into school" (True); "The Supreme Court ruling in 1954 was unanimous" (True)
  - PriorKnowledgeRecall: concepts from Episode 1 — `jim_crow`, `plessy_v_ferguson`, `naacp`, `voting_rights`, `emmett_till`, `federal_vs_state`
  - WhatYouWillLearn: auto-generated from screen labels
- **Suggested component(s):**
  - `ChapterHookScreen` (True/False) — opens on the gap between the law changing and reality changing; hooks the key misconception that legal victory = instant change
  - `PriorKnowledgeRecall` — retrieval of Episode 1 material; concepts: `jim_crow`, `plessy_v_ferguson`, `naacp`, `voting_rights`, `emmett_till`, `federal_vs_state`

### Section 2 — Learning Chunk 1
- **Purpose:** Introduce *Brown v Board* — the legal breakthrough and why it didn't immediately change anything.
- **Proposed content for this episode:**
  - *Brown v Board* (1954): unanimous ruling, Thurgood Marshall, overturning *Plessy*
  - *Brown II* (1955) — "all deliberate speed" loophole; no clear deadline for desegregation
  - Measurable progress: by 1957, 723 school districts had desegregated, especially outside the Deep South
  - Southern Manifesto (1956): 101 Congressmen signed; massive resistance organised; White Citizens' Councils
  - Negative effects/backlash: KKK membership grew, Black children and families faced threats, Black teachers lost jobs, some Black schools closed, some white families moved away to avoid integration
  - Why the law alone wasn't enough: no enforcement mechanism; states could delay; *Brown II* gave cover
- **Suggested component(s):**
  - `ExplainReveal` — cause-and-effect chain: NAACP legal strategy → *Brown* ruling → some progress (723 districts) → Southern Manifesto + massive resistance → "all deliberate speed" loophole → continued segregation → Little Rock as the crisis point; reveals each step progressively
  - `QuickRecallScreen` — retrieval of *Plessy v Ferguson* and NAACP from Episode 1 (interleaving); plus *Brown* facts just taught

### Section 3 — Learning Chunk 2
- **Purpose:** The human story of Little Rock — Elizabeth Eckford, the mob, the Nine.
- **Proposed content for this episode:**
  - The Little Rock Nine: who they were; how around 75 applicants became 25 accepted students, then 9 after intimidation; Daisy Bates's role
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
  - Ernest Green's graduation (1958): MLK attended; first Black graduate from Central High; white students refused to sit with him at the ceremony
  - Faubus closes all schools (1958–59): "The Lost Year"; White parents sent children to private segregationist academies; *Cooper v Aaron* ruling
- **Suggested component(s):**
  - `VisualLearning` — cinematic sequence: Eisenhower's reluctant decision → 101st Airborne deployed → Nine enter school under escort → Green's graduation and white students refusing to sit with him → Faubus closes all schools → Supreme Court strikes down closures; each scene shows the pattern of advance + resistance
  - `MatchingTask` — match cause to effect: (*Brown* ruling → massive resistance), (Elizabeth Eckford photos → international outrage), (Cold War pressure → Eisenhower acts), (Faubus closes schools → *Cooper v Aaron*); active processing of the episode's causal chains

### Section 5 — Learning Chunk 4
- **Purpose:** Significance and the takeaway — what Little Rock proved and what it didn't settle.
- **Proposed content for this episode:**
  - What *Brown* proved: the Supreme Court could overturn segregation in law; 723 districts desegregated by 1957; NAACP legal strategy could work
  - What *Brown* also triggered: Southern Manifesto, White Citizens' Councils, intimidation, school closures, KKK growth, Black teachers losing jobs, white flight
  - What Little Rock proved: federal force could enforce court orders; international attention mattered; the Supreme Court's authority was real
  - What Little Rock didn't settle: Southern schools remained largely segregated for years; Faubus won re-election six more times; the lesson for the civil rights movement was that legal victories needed legislative follow-up
  - Cold War significance: Little Rock accelerated federal willingness to act on civil rights — the same dynamic will drive the 1964 Civil Rights Act
  - Civil Rights Act 1957 placement check: flag whether this is covered in another episode; if not, add here as an early federal law with limited impact
  - Consolidation retrieval: key facts, dates, terms from the whole episode
- **Suggested component(s):**
  - `ColSortBlock` — sort evidence into "Evidence of progress" vs "Evidence of limits/backlash" — active categorisation of the episode's dual interpretation; directly maps to Q3(d) exam question structure
  - `QuickRecallScreen` — retrieval of full episode content: *Brown*, *Brown II*, 723 districts, Southern Manifesto, Faubus, Elizabeth Eckford, 101st Airborne, Ernest Green, "Lost Year", *Cooper v Aaron*

### Section 6 — Summary & Examiner
- **Purpose:** No major new content; apply knowledge to exam technique; end with completion screen.
- **Proposed content for this episode:**
  - Examiner explains the Q2 "Explain why" question type — using "Why did Eisenhower send troops to Little Rock?" as the worked example; three-cause structure
  - Examiner tip: the Cold War context earns marks in Q2 if linked clearly to Eisenhower's motive — not just "it happened" but "it forced his hand"
  - Examiner tip: for *Brown* significance, students should use both progress evidence (overturned *Plessy*, 723 districts) and limits/backlash evidence (Southern Manifesto, delays, violence, school closures)
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

## 4. Current state & gap analysis

Not yet built — full rebuild from spec.

---

## 5. Build recommendations

1. **Elizabeth Eckford as central human throughline:** The 4 September 1957 moment is this episode's most powerful narrative beat — analogous to Emmett Till in Episode 1. The `VisualNarrativeScreen` in Section 3 is the right vehicle: beat-by-beat from the failed notification → arriving alone → the mob → photographs → Cold War humiliation.

2. **The law-to-reality gap as the episode's spine:** The episode's educational purpose is to show that *Brown* didn't end segregation. Every section should return to this — *Brown* was a victory (S2), but Southern resistance was fierce (S2/S3), and even after federal troops were deployed the schools were closed (S4). The Section 5 `ColSortBlock` seals this by making students categorise both sides.

3. **Balance progress with backlash:** Do not make this episode only a resistance story. Students need both sides for Q3(d): progress evidence includes *Plessy* overturned, 723 districts desegregated and federal troops used; limits/backlash includes the Southern Manifesto, White Citizens' Councils, intimidation, Black teachers losing jobs, school closures and slow integration.

4. **ColSortBlock for Q3(d) preparation:** The "progress vs limits/backlash" sort in Section 5 is a direct preparation for the "how far do you agree" interpretation question format. Make the sort categories explicit as exam language: "evidence of progress" / "evidence of limits to progress."

5. **Cold War motive — a recurring series thread:** This episode introduces the Cold War as a reason for federal action. Flag it explicitly as a recurring pattern — the same dynamic appears in Episode 7 (progress by 1975 accelerated by international reputation concerns). Students who spot this pattern across episodes score higher on Q2 multi-cause questions.

6. **Civil Rights Act 1957 placement check:** If no later chapter covers it, add it here or in Episode 4/7. It should be taught as early federal civil rights legislation: first since Reconstruction, voting-rights focus, Civil Rights Commission, but weakened by Southern opposition and limited in impact.

7. **Component count check:** ChapterHookScreen (S1 — mandatory), PriorKnowledgeRecall (S1 — mandatory), ExplainReveal (S2), QuickRecallScreen (S2, S3, S5 — allowed under retrieval rule), VisualNarrativeScreen (S3), VisualLearning (S4), MatchingTask (S4), ColSortBlock (S5), ExaminerExplainsScreen (S6 — mandatory), FaceTheExaminer (S6 — mandatory), ChapterCompleteScreen (S6 — mandatory). No feature component exceeds twice.
