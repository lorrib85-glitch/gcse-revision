# Episode 1: Separate and Unequal — Architecture

## 1. Identity (brief)

- **Episode number:** 1
- **Title:** Separate and Unequal
- **Build status:** Not yet built
- **Content reference:** Storyline, Specification requirements and full Content reference pack: see `01_Separate_and_Unequal_Content.md` in this directory.

---

## 2. Navigation spine (6 parts)

These are the six progress-rail stages for this module. Each stage should become one tappable dot in the in-module progress bar. The dot should jump to the first screen of that stage. Do **not** use one dot per screen.

1. **A Country Split in Two** — introduce 1950s America, Jim Crow and the contradiction between freedom claims and segregation.
2. **The Rules of Segregation** — Jim Crow, *Plessy v Ferguson*, federal vs state power and voting-rights barriers.
3. **Violence Without Justice** — KKK intimidation, Emmett Till and the failure of Southern justice.
4. **Resistance Before the Headlines** — NAACP, CORE, churches, local organisations and why federal action was limited.
5. **Why the Movement Was Ready to Grow** — Second World War, migration, media, Cold War embarrassment and organised resistance.
6. **Exam Prep: Why Civil Rights Grew** — Q2 causation and Q3d interpretation preparation.

**Progress rail rule:** render these as six dots only. Labels stay hidden unless tapped. The rail should appear on all normal learning pages and be hidden only on full-screen video/cinematic reveal moments.

---

## 3. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity; reactivate prior knowledge; identify missing knowledge; generate weak spots; preview the chapter.
- **Proposed content for this episode:**
  - Cinematic hook: America in 1954 — "land of the free" vs reality of Jim Crow
  - True/False opener (ChapterHookScreen): e.g. "Black and white Americans in the 1950s attended the same schools" (False); "The Supreme Court always supported Black Americans' rights" (False); "The US Constitution gave Black men the vote in 1870" (True)
  - PriorKnowledgeRecall: For Episode 1 (series opener), this is a prior knowledge recall of any pre-existing GCSE knowledge. Concepts to probe: Jim Crow laws, KKK, NAACP, Plessy v Ferguson, voting rights, Dixiecrats, federal vs state government
  - WhatYouWillLearn: auto-generated from screen labels
- **Suggested component(s):**
  - `CinematicRevealMoment` — opens on a segregated facility or a contemporary image of Jim Crow America; establishes the injustice cinematically before any teaching
  - `ChapterHookScreen` (True/False) — misconceptions about whether Black Americans had legal rights or whether the federal government protected them
  - `PriorKnowledgeRecall` — free-text recall of what learner already knows about segregation/civil rights; concepts: `jim_crow`, `kkk`, `naacp`, `plessy_v_ferguson`, `voting_rights`, `dixiecrats`, `federal_vs_state`

### Section 2 — Learning Chunk 1
- **Purpose:** Introduce the first major part of the topic — the legal structure of segregation.
- **Proposed content for this episode:**
  - Jim Crow laws: what they were, when enacted (1890–1910), which aspects of life they covered (schools, transport, restaurants, cinemas, toilets, libraries, parks, hotels)
  - *Plessy v Ferguson* (1896): "separate but equal" — legal precedent; reality that Black facilities were always inferior
  - Federal vs state government: why Southern states could pass segregation laws, why the Supreme Court mattered, and why federal enforcement became the battleground
  - Voting rights denial: poll taxes, literacy tests, grandfather clause, physical intimidation
  - NAACP and CORE: their roles, methods, geographic strengths; CORE tactics include boycotts, pickets, sit-ins and training activists in non-violent direct action
- **Suggested component(s):**
  - `VisualLearning` — cinematic sequence showing the span of Jim Crow (transport → schools → restaurants → courts), each scene revealing the scale of the system; fits the episode's need to make the totality of segregation visceral, not just listed
  - `ExplainReveal` — mini foundation chain: state laws maintain segregation → federal courts can overrule state laws → Southern politicians resist federal action → court victory alone is not enough without enforcement
  - `MatchingTask` — match the discrimination method (poll tax / literacy test / grandfather clause) to how it worked and who it targeted; active processing of the three barriers to voting

### Section 3 — Learning Chunk 2
- **Purpose:** Develop understanding by introducing the human reality of violence and impunity, with interleaving of the legal structure from Section 2.
- **Proposed content for this episode:**
  - KKK: origins (1865), methods (lynching, intimidation, cross-burning), overlap with law enforcement, secrecy, who they targeted (Black Americans, Jews, Catholics, liberals)
  - Emmett Till case (1955): the murder, the open-coffin funeral, the trial, the acquittal, the later confession, the media impact nationally
  - The failure of Southern justice: Black Americans not on juries; judges often KKK-sympathetic; NAACP response ("M is for Mississippi and Murder")
  - Interleaving: connect KKK impunity back to voting-rights denial from Section 2 — the same system that denied the vote also denied justice
- **Suggested component(s):**
  - `VisualNarrativeScreen` — tells Emmett Till's story beat by beat (the trip to Mississippi → the accusation → the murder → the open coffin → the acquittal → the confession); powerful, cinematic, single throughline
  - `QuickRecallScreen` — retrieval of Jim Crow and *Plessy* facts from Section 2, interleaved with Till questions; locks in the legal + human reality together

### Section 4 — Learning Chunk 3
- **Purpose:** Deepen understanding — the situation for Black Americans in the North vs South; why the federal government failed to act; the existing resistance infrastructure.
- **Proposed content for this episode:**
  - Life in the North: de facto rather than de jure segregation; ghettos; lower wages; higher unemployment; some voting rights but economic disadvantage
  - Why presidents and Congress didn't act: needed Dixiecrat votes; Southern politicians blocked legislation; White Citizens' Councils; *Plessy* gave legal cover
  - NAACP: legal strategy; integrated membership; success in the North; already building toward *Brown*
  - CORE: non-violent direct action as early philosophy; boycotts, pickets, sit-ins and disciplined activist training; smaller but important in the North
  - Churches, local organisations, universities and groups such as the Regional Council of Negro Leadership: organising meetings, education, rallies, voter-registration campaigns and community support
  - Interleaving: link back to Emmett Till — the federal government's failure to prosecute his killers illustrates the political reason
- **Suggested component(s):**
  - `ExplainReveal` — cause-and-effect chain: Southern politicians hold power in Congress → presidents need Dixiecrat votes → federal government won't act → states maintain Jim Crow → Black Americans have no legal recourse → violence goes unpunished; reveals each step progressively
  - `InteractiveCollectionExplorer` — explore "Tools of resistance" (NAACP legal strategy / CORE direct action / Women's Political Council / church networks / local organisations); colour-coded by method type

### Section 5 — Learning Chunk 4
- **Purpose:** Complete the chapter's teaching; focus on significance and the takeaway — why this was the necessary starting point.
- **Proposed content for this episode:**
  - The scale of the system: how total Jim Crow was — every aspect of public life, supported by law, courts, police, politicians
  - Factors behind the movement's growth in the 1950s: Second World War service, migration north, television/media, Cold War embarrassment, new research and growing civil rights infrastructure
  - The Cold War embarrassment angle: USA claimed to be the "free world" leader while denying rights to Black citizens — this gave the federal government a reason to eventually act
  - The movement was already organised: NAACP, CORE, churches and local organisations had been fighting for decades; the 1950s movement built on existing infrastructure
  - Consolidation retrieval: key facts, dates, terms from the whole episode
- **Suggested component(s):**
  - `ColSortBlock` — sort events/people into "Resisting segregation" vs "Maintaining segregation" — active categorisation of the dual forces; surfaces misconceptions
  - `QuickRecallScreen` — retrieval of full episode content (Jim Crow scope, *Plessy*, Till, KKK, NAACP/CORE, church/local organisations, federal vs state, voting denial methods, 1950s growth factors)

### Section 6 — Summary & Examiner
- **Purpose:** No major new content; apply knowledge to exam technique; end with completion screen.
- **Proposed content for this episode:**
  - Examiner explains the Q2 "Explain why" question type for this topic (explain why the civil rights movement emerged in the 1950s) — how to structure three causes with evidence
  - Examiner tip: the distinction between de jure (South) and de facto (North) segregation — examiners reward students who use both
  - Examiner tip: stronger Q2 answers use wider growth factors, not only examples of segregation — Second World War expectations, media/television, Cold War embarrassment and existing organisations
  - FaceTheExaminer: practise a Q2 "Explain why..." question — stimulus points (Emmett Till, NAACP), own knowledge expected
- **Suggested component(s):**
  - `ExaminerExplainsScreen` — animated explanation of how to approach a Q2 "explain why" question; uses this episode's content as the worked example
  - `FaceTheExaminer` — Q2-style question: "Explain why the civil rights movement grew in the USA in the 1950s"; marks against criteria; logs exam-technique patterns
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

1. **Storyline integration:** The DRAFT core takeaway ("the system of Jim Crow was total and deliberately constructed") should be threaded as a recurring thread:
   - Section 1 (CinematicRevealMoment): open on the *scale* of Jim Crow to establish the takeaway visually before teaching begins
   - Section 3 (VisualNarrativeScreen, Emmett Till): the Till case is the most powerful human proof of the takeaway — the system denied justice at every level
   - Section 5 (ColSortBlock): the categorisation activity consolidates the takeaway by showing learners just how many forces maintained the system
   - Section 6 (ExaminerExplainsScreen): the examiner explicitly links the takeaway to the Q2 cause question
   *Note: Core takeaway is DRAFT — confirm with user before finalising threading.*

2. **Federal vs state government must be taught as a foundation, not assumed:** Students need this before *Brown*, Little Rock and Eisenhower make sense. Add a short ExplainReveal in Section 2 showing why state laws could maintain segregation, why the Supreme Court could challenge them, and why enforcement was still difficult.

3. **Emmett Till as central human throughline:** Till's story is the episode's strongest narrative moment and should be given significant screen space in Section 3. The VisualNarrativeScreen is the right component — it can deliver the full sequence (murder → open coffin → acquittal → confession → national impact) as a cinematic beat-by-beat narrative.

4. **Misconception priority:** The misconception that "the North = equality" appears in past paper mark schemes (2021 interpretations). Ensure Section 4 gives North vs South comparison enough weight, and add a MisconceptionCheck or True/False moment around "Black Americans had equality in the North."

5. **Voting rights as a distinct teaching beat:** The three barriers to voting (poll tax, literacy test, grandfather clause) are frequently examined in Q2 questions. They need their own dedicated interaction — the MatchingTask in Section 2 is the right slot.

6. **Growth factors need their own consolidation moment:** Do not let "why the movement grew" become just a list. Section 5 should pull together Second World War, migration, media/television, Cold War embarrassment, new research, NAACP/CORE/churches/local organisations into one exam-ready causal pattern.

7. **Exam preparation (Q3d context):** The 2021 paper interpretations (Paterson et al. — "progress being made"; Farmer/Sanders — "inequality everywhere") map perfectly onto this episode's content. The FaceTheExaminer in Section 6 should be built to prepare learners for this interpretation-evaluation format as well as the Q2 causation format.

8. **Component count check:** CinematicRevealMoment (S1), ChapterHookScreen (S1), PriorKnowledgeRecall (S1), VisualLearning (S2), ExplainReveal (S2/S4), VisualNarrativeScreen (S3), InteractiveCollectionExplorer (S4), ColSortBlock (S5), QuickRecallScreen (S3, S5 — both allowed under the retrieval rule exception), MatchingTask (S2). No feature component exceeds twice.
