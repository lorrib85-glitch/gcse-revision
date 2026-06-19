# Episode 3: The Woman Who Stayed Seated — Architecture

## 1. Identity (brief)

- **Episode number:** 3
- **Title:** The Woman Who Stayed Seated
- **Build status:** Not yet built
- **Content reference:** Storyline, Specification requirements and full Content reference pack: see `03_The_Woman_Who_Stayed_Seated_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity; reactivate Episodes 1–2 knowledge; identify missing knowledge; preview the chapter.
- **Proposed content for this episode:**
  - Cinematic hook: 1 December 1955 — a woman stays seated on a bus in Montgomery, Alabama. What follows changes American history.
  - ChapterHookScreen (True/False): "Rosa Parks refused to move because she was exhausted from work" (False); "The bus boycott lasted over a year" (True); "Rosa Parks was the first Black person to refuse to give up her seat on a Montgomery bus" (False)
  - PriorKnowledgeRecall: concepts from Episodes 1–2 — `jim_crow`, `naacp`, `brown_v_board`, `little_rock`, `massive_resistance`
  - WhatYouWillLearn: auto-generated from screen labels
- **Suggested component(s):**
  - `ChapterHookScreen` (True/False) — the "tired woman" misconception is the most common misconception about Rosa Parks; opening with it primes the more complex reality
  - `PriorKnowledgeRecall` — retrieval of Episodes 1–2; concepts: `jim_crow`, `naacp`, `brown_v_board`, `little_rock`, `massive_resistance`

### Section 2 — Learning Chunk 1
- **Purpose:** Introduce Rosa Parks — who she really was, her arrest, and the context that made it the right moment.
- **Proposed content for this episode:**
  - Segregated buses in Montgomery: the rules, the humiliations, the drivers' power
  - Claudette Colvin (March 1955): refused to move, arrested — why NAACP didn't use her case
  - Rosa Parks: NAACP secretary, Highlander Folk School training, her actual arrest (1 December 1955)
  - Jo Ann Gibson Robinson and the WPC: had been planning this for five years; overnight leaflets
- **Suggested component(s):**
  - `VisualNarrativeScreen` — beat-by-beat: segregated bus rules → Claudette Colvin's arrest (March 1955, not used) → Rosa Parks's arrest (1 December 1955) → overnight leaflets → first day of boycott; establishes that this was planned, not spontaneous
  - `QuickRecallScreen` — retrieval of Jim Crow (Episode 1) interleaved with Parks/WPC facts just taught; connects the bus rules to the wider system of segregation

### Section 3 — Learning Chunk 2
- **Purpose:** The boycott in action — 381 days of community organisation and sacrifice.
- **Proposed content for this episode:**
  - MIA formation; MLK elected (young, no enemies — a compromise candidate); his first mass meeting speech
  - How the boycott worked: carpools, mule carts, walking miles; 300+ pick-up stations; taxi drivers charged 10 cents
  - White resistance: MLK's house bombed; 89 arrests under anti-boycott law; violence; MLK's "kitchen table experience"
  - Interleaving: connect White Citizens' Councils (Episode 2) to the white response in Montgomery — the same pattern of organised resistance
- **Suggested component(s):**
  - `InteractiveCollectionExplorer` — explore "How the boycott was organised" (Jo Ann Robinson / MIA car pools / church network / taxi drivers / walking pledges); colour-coded by type; makes the logistics tangible
  - `QuickRecallScreen` — retrieval of *Brown v Board* and Little Rock (Episodes 1–2) interleaved with MIA/boycott facts; interleaving of legal + direct action threads

### Section 4 — Learning Chunk 3
- **Purpose:** The legal route alongside the boycott — *Browder v Gayle* and the Supreme Court victory.
- **Proposed content for this episode:**
  - *Browder v Gayle*: four plaintiffs (not Parks); Thurgood Marshall argues; district court rules June 1956; Supreme Court affirms November 1956
  - Buses integrated 21 December 1956; MLK, Abernathy, and others ride the first integrated bus; some violence continues (snipers, bombings)
  - Why the dual strategy (boycott + legal challenge) worked: economic pressure + constitutional route converged
  - SCLC founded January 1957: church network, non-violent model, MLK as leader; blueprint for future campaigns
- **Suggested component(s):**
  - `ExplainReveal` — cause-and-effect chain: Parks's arrest → MIA boycott (economic pressure) + *Browder* legal case (constitutional route) → Supreme Court ruling → buses integrated → SCLC founded → blueprint for future campaigns; reveals the dual-strategy structure progressively
  - `MatchingTask` — match key people to their role: (Rosa Parks → NAACP secretary, planned act of resistance), (Jo Ann Robinson → overnight leaflets, WPC), (MLK → MIA leader, first speech), (Thurgood Marshall → argued *Browder v Gayle*); active processing of the episode's cast

### Section 5 — Learning Chunk 4
- **Purpose:** Significance and the takeaway — what the boycott proved for the movement.
- **Proposed content for this episode:**
  - The model it created: non-violent direct action + legal challenge + church network + media coverage
  - MLK as national figure: the boycott launched his national career; SCLC gave him an institutional base
  - Economic pressure as a weapon: 75% of bus passengers were Black — withdrawing patronage hit the bus company; a model that would return in sit-ins and Freedom Rides
  - Limits: only one city; violence continued; broader segregation untouched; next step was sit-ins and nationwide action
- **Suggested component(s):**
  - `ColSortBlock` — sort evidence into "Boycott model: what worked" vs "Boycott model: what it couldn't do alone"; prepares students to evaluate the significance and limits for Q2/Q3(d)
  - `QuickRecallScreen` — retrieval of full episode content: Parks (NAACP, Highlander), Colvin, Jo Ann Robinson, MIA, MLK's kitchen table, *Browder v Gayle*, 381 days, SCLC

### Section 6 — Summary & Examiner
- **Purpose:** No major new content; apply knowledge to exam technique; end with completion screen.
- **Proposed content for this episode:**
  - Examiner explains the Q2 "Explain why" question type — "Why was the Montgomery Bus Boycott successful?" as the worked example; three-cause structure modelled: community organisation, legal challenge, media/economic pressure
  - Examiner tip: students who distinguish between what *caused* the boycott to start (Parks's arrest) and what *made it succeed* (dual strategy, 381-day commitment, *Browder*) score higher; they're separate Q2 questions
  - FaceTheExaminer: Q2-style question — "Explain why Rosa Parks's actions were important for the civil rights movement"
- **Suggested component(s):**
  - `ExaminerExplainsScreen` — animated explanation of the Q2 three-cause structure; uses boycott success as worked example; models distinction between cause-of-event vs cause-of-success
  - `FaceTheExaminer` — Q2 question: "Explain why Rosa Parks's actions were important for the civil rights movement"; marks against criteria; logs exam-technique patterns
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

1. **The "planned, not spontaneous" misconception as the episode's hook:** The Rosa Parks story is the most widely misunderstood moment in civil rights history. The ChapterHookScreen opens with the "tired" myth; every subsequent section reveals the planned, organised reality. This creates a revelation arc that feels like a documentary correcting the record — which is exactly the tone the VisualNarrativeScreen should hit in Section 2.

2. **Jo Ann Gibson Robinson as an under-taught hero:** The WPC's overnight leaflet print run is one of the most remarkable logistical feats of the whole movement and almost never appears in GCSE answers. The InteractiveCollectionExplorer in Section 3 is the right place to give it weight alongside the car pools and taxi drivers — making the organisational infrastructure visible rather than invisible.

3. **MLK's "kitchen table experience" as a humanising beat:** Section 3 should include this moment in the `InteractiveCollectionExplorer` or as a pull-quote in the `VisualNarrativeScreen`. It is private, human, and memorable — and it gives students something distinct to write that separates them from mid-range answers.

4. **Dual-strategy model as the episode's structural spine:** The boycott worked because of economic pressure AND legal challenge simultaneously. The `ExplainReveal` in Section 4 should make this explicit — not as two separate events but as a converging strategy. Students who can describe the dual strategy in Q2 answers earn higher marks.

5. **Claudette Colvin as an interleaving bridge:** Colvin (March 1955) is introduced in Section 2 and should be revisited briefly in Section 5's `ColSortBlock` — the fact that the NAACP chose their plaintiff carefully is evidence of how organised (not spontaneous) the movement was, and belongs in the "what the boycott model shows" column.

6. **Component count check:** ChapterHookScreen (S1 — mandatory), PriorKnowledgeRecall (S1 — mandatory), VisualNarrativeScreen (S2), QuickRecallScreen (S2, S3, S5 — retrieval rule), InteractiveCollectionExplorer (S3), ExplainReveal (S4), MatchingTask (S4), ColSortBlock (S5), ExaminerExplainsScreen (S6 — mandatory), FaceTheExaminer (S6 — mandatory), ChapterCompleteScreen (S6 — mandatory). No feature component exceeds twice.
