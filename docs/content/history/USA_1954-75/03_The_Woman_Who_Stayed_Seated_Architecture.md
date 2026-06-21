# Episode 3: The Woman Who Stayed Seated — Architecture

## 1. Identity (brief)

- **Episode number:** 3
- **Title:** The Woman Who Stayed Seated
- **Build status:** Not yet built
- **Content reference:** Storyline, Specification requirements and full Content reference pack: see `03_The_Woman_Who_Stayed_Seated_Content.md` in this directory.

---

## 2. Navigation spine (6 parts)

These are the six progress-rail stages for this module. Each stage should become one tappable dot in the in-module progress bar. The dot should jump to the first screen of that stage. Do **not** use one dot per screen.

1. **The Seat That Started a Movement** — hook around Rosa Parks and the Montgomery Bus Boycott.
2. **Montgomery Before Parks** — bus segregation, local activism, Jo Ann Robinson, E. D. Nixon and the WPC.
3. **381 Days of Pressure** — boycott organisation, car pools, churches, arrests and economic pressure.
4. **King Becomes a Leader** — MLK, non-violent protest, the MIA and national media attention.
5. **Victory and Its Limits** — Supreme Court ruling, desegregated buses, white backlash and the model for later protest.
6. **Exam Prep: Why the Boycott Succeeded** — Q2 causation and leadership/mass action judgement.

**Progress rail rule:** render these as six dots only. Labels stay hidden unless tapped. The rail should appear on all normal learning pages and be hidden only on full-screen video/cinematic reveal moments.

---

## 3. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity; reactivate Episodes 1–2 knowledge; identify missing knowledge; preview the chapter.
- **Proposed content for this episode:**
  - Cinematic hook: 1 December 1955 — a woman stays seated on a bus in Montgomery, Alabama. What follows changes American history.
  - ChapterHookScreen (True/False): "Rosa Parks refused to move because she was exhausted from work" (False); "The bus boycott lasted over a year" (True); "Rosa Parks was the first Black person to refuse to give up her seat on a Montgomery bus" (False)
  - PriorKnowledgeRecall: concepts from Episodes 1–2 — `jim_crow`, `naacp`, `brown_v_board`, `little_rock`, `massive_resistance`, `white_citizens_councils`
  - WhatYouWillLearn: auto-generated from screen labels
- **Suggested component(s):**
  - `ChapterHookScreen` (True/False) — the "tired woman" misconception is the most common misconception about Rosa Parks; opening with it primes the more complex reality
  - `PriorKnowledgeRecall` — retrieval of Episodes 1–2; concepts: `jim_crow`, `naacp`, `brown_v_board`, `little_rock`, `massive_resistance`, `white_citizens_councils`

### Section 2 — Learning Chunk 1
- **Purpose:** Introduce Rosa Parks — who she really was, her arrest, and the context that made it the right moment.
- **Proposed content for this episode:**
  - Segregated buses in Montgomery: the rules, the humiliations, the drivers' power
  - Long-term causes: WPC had campaigned on bus discrimination since 1950; requests to bus company officials had been ignored
  - Claudette Colvin (March 1955): refused to move, arrested — why NAACP didn't use her case
  - Rosa Parks: NAACP secretary, Highlander Folk School training, her actual arrest (1 December 1955)
  - Jo Ann Gibson Robinson and the WPC: had been planning this for five years; overnight leaflets
- **Suggested component(s):**
  - `VisualNarrativeScreen` — beat-by-beat: segregated bus rules → WPC campaigning since 1950 → Claudette Colvin's arrest (March 1955, not used) → Rosa Parks's arrest (1 December 1955) → overnight leaflets → first day of boycott; establishes that this was planned, not spontaneous
  - `QuickRecallScreen` — retrieval of Jim Crow (Episode 1) interleaved with Parks/WPC facts just taught; connects the bus rules to the wider system of segregation

### Section 3 — Learning Chunk 2
- **Purpose:** The boycott in action — 381 days of community organisation and sacrifice.
- **Proposed content for this episode:**
  - MIA formation: in the days after Parks's arrest, activists organised the boycott; on 5 December 1955 the MIA was formed and MLK was elected leader (young, no enemies — a compromise candidate); his first mass meeting speech
  - 8 December meeting: MIA representatives met bus company officials; officials refused to change rules; MIA continued the boycott until victory
  - How the boycott worked: carpools involving over 300 cars, mule carts, walking miles; organised pick-up points; taxi drivers charged 10 cents
  - Reasons for success: organisation, commitment, publicity, economic pressure, legal challenge
  - White resistance: opposition from the mayor, bus company owners, white drivers, KKK and White Citizens' Councils; MLK's house bombed; 89 arrests under anti-boycott law; violence; MLK's "kitchen table experience"
  - Interleaving: connect White Citizens' Councils (Episode 2) to the white response in Montgomery — the same pattern of organised resistance
- **Suggested component(s):**
  - `InteractiveCollectionExplorer` — explore "How the boycott was organised" (Jo Ann Robinson / MIA car pools / church network / taxi drivers / walking pledges / publicity / legal strategy); colour-coded by type; makes the logistics tangible
  - `QuickRecallScreen` — retrieval of *Brown v Board* and Little Rock (Episodes 1–2) interleaved with MIA/boycott facts; interleaving of legal + direct action threads

### Section 4 — Learning Chunk 3
- **Purpose:** The legal route alongside the boycott — *Browder v Gayle*, the Supreme Court victory and the limited early federal response.
- **Proposed content for this episode:**
  - *Browder v Gayle*: four plaintiffs (not Parks); Thurgood Marshall argues; district court rules June 1956; Supreme Court affirms November 1956
  - Buses integrated 21 December 1956; MLK, Abernathy, and others ride the first integrated bus; some violence continues (snipers, bombings)
  - Why the dual strategy (boycott + legal challenge) worked: economic pressure + constitutional route converged
  - SCLC founded January 1957: church network, non-violent model, MLK as leader; blueprint for future campaigns
  - Civil Rights Act 1957: first federal civil rights law since Reconstruction; created Civil Rights Commission and investigated voting-rights abuses, but was weakened by Southern opposition and had limited impact
- **Suggested component(s):**
  - `ExplainReveal` — cause-and-effect chain: Parks's arrest → MIA boycott (economic pressure) + *Browder* legal case (constitutional route) → Supreme Court ruling → buses integrated → SCLC founded → limited federal action in 1957 → stronger legislation still needed; reveals the dual-strategy and early-law structure progressively
  - `MatchingTask` — match key people/laws to their role: (Rosa Parks → NAACP secretary, planned act of resistance), (Jo Ann Robinson → overnight leaflets, WPC), (MLK → MIA leader, first speech), (Thurgood Marshall → argued *Browder v Gayle*), (Civil Rights Act 1957 → weak early federal civil-rights law); active processing of the episode's cast and early federal response

### Section 5 — Learning Chunk 4
- **Purpose:** Significance and the takeaway — what the boycott proved for the movement, and why early federal action was not enough.
- **Proposed content for this episode:**
  - The model it created: non-violent direct action + legal challenge + church network + publicity/media coverage
  - MLK as national figure: the boycott launched his national career; SCLC gave him an institutional base
  - Economic pressure as a weapon: around 75% of bus passengers were Black — withdrawing patronage hit the bus company; a model that would return in sit-ins and Freedom Rides
  - GCSE success factors consolidated: organisation, commitment, publicity, economic pressure, legal challenge
  - Limited federal response: the 1957 Act showed federal government was beginning to move, but Southern politicians could still weaken reform
  - Limits: only one city; violence continued; broader segregation untouched; 1957 Act did not end voting discrimination; next step was sit-ins, Freedom Rides and stronger legislation
- **Suggested component(s):**
  - `ColSortBlock` — sort evidence into "Why the boycott mattered" vs "Why more action was still needed"; include organisation, commitment, publicity, economic pressure, legal challenge, SCLC, and the weak 1957 Act as named evidence; prepares students to evaluate the significance and limits for Q2/Q3(d)
  - `QuickRecallScreen` — retrieval of full episode content: Parks (NAACP, Highlander), Colvin, Jo Ann Robinson, WPC, MIA, 8 December meeting, MLK's kitchen table, *Browder v Gayle*, 381 days, SCLC, Civil Rights Act 1957

### Section 6 — Summary & Examiner
- **Purpose:** No major new content; apply knowledge to exam technique; end with completion screen.
- **Proposed content for this episode:**
  - Examiner explains the Q2 "Explain why" question type — "Why was the Montgomery Bus Boycott successful?" as the worked example; five-cause structure modelled: organisation, commitment, publicity, economic pressure, legal challenge
  - Examiner tip: students who distinguish between what *caused* the boycott to start (Parks's arrest + long-term bus discrimination) and what *made it succeed* (dual strategy, 381-day commitment, publicity, economic pressure, *Browder*) score higher; they're separate Q2 questions
  - Examiner tip: the 1957 Act is useful as a contrast point — it was early federal action, but weak compared with 1964 and 1965 legislation
  - FaceTheExaminer: Q2-style question — "Explain why Rosa Parks's actions were important for the civil rights movement"
- **Suggested component(s):**
  - `ExaminerExplainsScreen` — animated explanation of the Q2 cause structure; uses boycott success as worked example; models distinction between cause-of-event vs cause-of-success; adds 1957 Act as a limitation/continuity point
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

## 4. Current state & gap analysis

Not yet built — full rebuild from spec.

---

## 5. Build recommendations

1. **The "planned, not spontaneous" misconception as the episode's hook:** The Rosa Parks story is the most widely misunderstood moment in civil rights history. The ChapterHookScreen opens with the "tired" myth; every subsequent section reveals the planned, organised reality. This creates a revelation arc that feels like a documentary correcting the record — which is exactly the tone the VisualNarrativeScreen should hit in Section 2.

2. **Jo Ann Gibson Robinson as an under-taught hero:** The WPC's overnight leaflet print run is one of the most remarkable logistical feats of the whole movement and almost never appears in GCSE answers. The InteractiveCollectionExplorer in Section 3 is the right place to give it weight alongside the car pools, taxi drivers, publicity and legal strategy — making the organisational infrastructure visible rather than invisible.

3. **The 8 December meeting should be used as the reason the protest became sustained:** This detail gives students a clean causal step: activists tried negotiation → bus officials refused → boycott continued. It is excellent for Q2 because it shows the boycott was not just emotional protest; it was strategic escalation.

4. **Civil Rights Act 1957 as the end-of-chapter bridge:** Do not over-teach it here, but include it as a concise bridge: Montgomery/SCLC/growing pressure → first federal civil-rights law since Reconstruction → weakened by Southern opposition → limited impact → stronger direct action and stronger federal legislation still needed. It prepares students for Chapter 5 and Chapter 7 without derailing the boycott story.

5. **MLK's "kitchen table experience" as a humanising beat:** Section 3 should include this moment in the `InteractiveCollectionExplorer` or as a pull-quote in the `VisualNarrativeScreen`. It is private, human, and memorable — and it gives students something distinct to write that separates them from mid-range answers.

6. **Dual-strategy model as the episode's structural spine:** The boycott worked because of economic pressure AND legal challenge simultaneously. The `ExplainReveal` in Section 4 should make this explicit — not as two separate events but as a converging strategy. Students who can describe the dual strategy in Q2 answers earn higher marks.

7. **Success factors need explicit GCSE labels:** Organisation, commitment, publicity, economic pressure and legal challenge should appear as named labels in Section 5 and the Examiner screen. This helps students avoid vague answers like "people worked together" and gives them ready-made paragraph categories.

8. **Claudette Colvin as an interleaving bridge:** Colvin (March 1955) is introduced in Section 2 and should be revisited briefly in Section 5's `ColSortBlock` — the fact that the NAACP chose their plaintiff carefully is evidence of how organised (not spontaneous) the movement was, and belongs in the "why the boycott succeeded" logic.

9. **Component count check:** ChapterHookScreen (S1 — mandatory), PriorKnowledgeRecall (S1 — mandatory), VisualNarrativeScreen (S2), QuickRecallScreen (S2, S3, S5 — retrieval rule), InteractiveCollectionExplorer (S3), ExplainReveal (S4), MatchingTask (S4), ColSortBlock (S5), ExaminerExplainsScreen (S6 — mandatory), FaceTheExaminer (S6 — mandatory), ChapterCompleteScreen (S6 — mandatory). No feature component exceeds twice.
