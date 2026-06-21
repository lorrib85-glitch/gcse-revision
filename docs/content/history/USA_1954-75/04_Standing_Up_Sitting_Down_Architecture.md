# Episode 4: Standing Up, Sitting Down — Architecture

## 1. Identity (brief)

- **Episode number:** 4
- **Title:** Standing Up, Sitting Down
- **Build status:** Not yet built
- **Content reference:** Storyline, Specification requirements and full Content reference pack: see `04_Standing_Up_Sitting_Down_Content.md` in this directory.

---

## 2. Navigation spine (6 parts)

These are the six progress-rail stages for this module. Each stage should become one tappable dot in the in-module progress bar. The dot should jump to the first screen of that stage. Do **not** use one dot per screen.

1. **A Protest That Refused to Move** — hook around sit-ins and Freedom Rides.
2. **Sitting In to Stand Up** — Greensboro, SNCC, student activism and disciplined non-violent protest.
3. **Testing the Law on Wheels** — Freedom Rides, CORE, interstate travel and deliberate confrontation.
4. **Violence, Cameras and Federal Pressure** — Anniston, Birmingham, Montgomery, media coverage and Kennedy's response.
5. **Direct Action Becomes a Weapon** — strengths, risks and limits of sit-ins/Freedom Rides.
6. **Exam Prep: Protest Methods Compared** — Q2 causation and similarity/difference exam preparation.

**Progress rail rule:** render these as six dots only. Labels stay hidden unless tapped. The rail should appear on all normal learning pages and be hidden only on full-screen video/cinematic reveal moments.

---

## 3. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity; reactivate Episodes 1–3 knowledge; preview this chapter.
- **Proposed content for this episode:**
  - Cinematic hook: what if the bravest thing you could do was sit down and refuse to move — even as someone pours food on you, burns a cigarette on your skin, and the police watch?
  - ChapterHookScreen (True/False): "The Greensboro sit-ins were spontaneous and unplanned" (False); "Freedom Riders were beaten by the KKK while police stood by" (True); "The Kennedy administration enthusiastically supported the Freedom Riders" (False)
  - PriorKnowledgeRecall: concepts from Episodes 1–3 — `montgomery_bus_boycott`, `naacp`, `mlk`, `non_violent_direct_action`, `brown_v_board`, `civil_rights_act_1957`
  - WhatYouWillLearn: auto-generated from screen labels
- **Suggested component(s):**
  - `ChapterHookScreen` (True/False) — the "spontaneous" misconception about sit-ins is the most common exam error; open with it
  - `PriorKnowledgeRecall` — retrieval of Episodes 1–3; concepts: `montgomery_bus_boycott`, `naacp`, `mlk`, `non_violent_direct_action`, `brown_v_board`, `civil_rights_act_1957`

### Section 2 — Learning Chunk 1
- **Purpose:** Introduce the sit-ins — what they were, how they spread, and how they were organised.
- **Proposed content for this episode:**
  - Greensboro Four (1 February 1960): who they were, what happened, training in non-violence
  - How the tactic spread: SNCC founded 15 April 1960; Ella Baker; 55 cities, 70,000 participants, 3,600 arrests
  - Non-violent training: what participants were told to do (sit quietly, absorb abuse, do not retaliate)
  - Economic impact: sit-ins cost businesses money; Woolworth's desegregated nationally by August 1961
- **Suggested component(s):**
  - `VisualLearning` — cinematic sequence: Woolworth's counter (1 Feb 1960) → 27 students (2 Feb) → 300 (3 Feb) → map of 55 cities → SNCC formation → Woolworth's desegregates; makes the scale and speed visceral
  - `QuickRecallScreen` — retrieval of Montgomery boycott (Episode 3) interleaved with Greensboro facts; connects economic pressure as a repeated tactic

### Section 3 — Learning Chunk 2
- **Purpose:** The Freedom Rides — what they challenged, what happened, and why the violence was the strategy.
- **Proposed content for this episode:**
  - Background: *Morgan v Virginia* (1946) and *Boynton v Virginia* (1960) — Supreme Court rulings ignored by Southern states
  - The first Freedom Ride: 13 riders, 4 May 1961, Greyhound and Trailways from Washington DC
  - Anniston: bus firebombed; riders beaten; photographs published internationally; Cold War timing (Kennedy about to meet Khrushchev)
  - Birmingham: Bull Connor's police allow KKK 15 minutes; Nashville SNCC students join to continue
  - Montgomery: beaten again; Robert Kennedy sends federal marshals
  - Interleaving: Bull Connor here (Birmingham) anticipates his role in Episode 5's Birmingham campaign — the same man, the same calculated brutality, the same media effect
- **Suggested component(s):**
  - `VisualNarrativeScreen` — beat-by-beat Freedom Ride narrative: Washington DC departure → Anniston firebombing (and photographs) → Birmingham beatings (Bull Connor/KKK) → Nashville students continue → Montgomery → federal marshals sent; powerful, cinematic, single throughline
  - `QuickRecallScreen` — retrieval of Cold War context (Episode 1: USA claiming to lead the "free world") interleaved with Freedom Ride facts; interleaving of the Cold War thread that runs through the series

### Section 4 — Learning Chunk 3
- **Purpose:** Federal response and significance — the ICC ruling, James Meredith, and what this generation of activists built.
- **Proposed content for this episode:**
  - Jackson, Mississippi: riders arrested; Parchman Farm; why it failed to break the movement — more students volunteered
  - 60+ rides, 400+ participants through summer 1961
  - Robert Kennedy petitions ICC → September 1961 ICC desegregation order → interstate travel facilities desegregated November 1961
  - James Meredith, University of Mississippi, 1962: Black air force veteran wins court case; Governor Ross Barnett resists; riots break out; Kennedy sends federal marshals and around 23,000 troops; Meredith enrols
  - SNCC as a new force: youth-led, more radical, less hierarchical than SCLC; will drive Freedom Summer (Episode 7) and shift toward Black Power (Episode 6)
- **Suggested component(s):**
  - `ExplainReveal` — cause-and-effect chain: riders arrested at Jackson → Parchman Farm (attempt to break movement) → more volunteers joined → 60+ rides → Robert Kennedy petitions ICC → September ICC order → interstate travel desegregated → Meredith crisis shows the same federal-enforcement pattern; reveals the mechanism of how non-violent persistence forced federal action
  - `MatchingTask` — match tactic/crisis to outcome: (Greensboro sit-ins → Woolworth's desegregated), (Anniston firebombing → international media coverage), (Parchman Farm → more riders volunteered), (ICC petition → interstate travel desegregated), (James Meredith → federal troops enforce university integration); active processing of the episode's cause-effect chains

### Section 5 — Learning Chunk 4
- **Purpose:** Significance and the takeaway — what this generation proved about how to fight segregation.
- **Proposed content for this episode:**
  - The strategy proved: provoke a violent reaction → get media coverage → embarrass the federal government → force action; this is the same mechanism as Birmingham 1963 and Selma 1965
  - SNCC's role: created a new generation of activists who would push harder and further than the SCLC generation
  - Federal intervention pattern: Kennedy administration often acted reluctantly, but the Freedom Rides and Meredith crisis forced stronger enforcement than the weak 1957 Act
  - Limits: lunch counters, interstate travel and one university; broader segregation and voting rights untouched; needed legislation — which KT2 will deliver
  - Consolidation retrieval: key facts, dates, terms from the whole episode
- **Suggested component(s):**
  - `ColSortBlock` — sort evidence into "Direct action worked because..." vs "Direct action had limits because..."; include Meredith as evidence that federal enforcement could work but required crisis and troops; consolidates the episode's dual message
  - `QuickRecallScreen` — retrieval of full episode content: Greensboro Four, SNCC/Ella Baker, Anniston, Bull Connor, Parchman Farm, ICC ruling, James Meredith

### Section 6 — Summary & Examiner
- **Purpose:** No major new content; apply knowledge to exam technique; end with completion screen.
- **Proposed content for this episode:**
  - Examiner explains the Q2 "Explain why" structure — "Why were the Freedom Rides significant?" as worked example; three-cause structure
  - Examiner tip: the most common student error is writing about the violence as if it made the Freedom Rides a failure — need to explain that the violence *was the strategy* (it attracted media coverage and forced federal action)
  - Examiner tip: James Meredith is key own knowledge for questions on civil rights progress in 1961–65; use him as evidence of federal enforcement, not just as a biographical story
  - FaceTheExaminer: Q2-style question — "Explain why non-violent direct action was effective in the early civil rights movement (1955–62)"
- **Suggested component(s):**
  - `ExaminerExplainsScreen` — animated explanation of Q2 structure; uses "Why were Freedom Rides significant?" as worked example; models how to turn "violence happened" into a causal argument and how to use Meredith as extra evidence
  - `FaceTheExaminer` — Q2 question: "Explain why non-violent direct action was effective in the early civil rights movement (1955–62)"; marks against criteria; logs exam-technique patterns
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

1. **"The violence was the strategy" as the episode's central insight:** The most common student error in Q2 answers about the Freedom Rides is treating the violence as evidence of failure. The `ExplainReveal` in Section 4 and the `ExaminerExplainsScreen` in Section 6 should both address this explicitly: the riders intended to provoke the reaction because they knew it would generate media coverage and force federal attention.

2. **James Meredith as the missing federal-intervention bridge:** Meredith belongs in this chapter because he strengthens the Kennedy/federal enforcement pattern begun with the Freedom Rides. Teach him as: legal victory → Southern state resistance → violence → Kennedy sends federal marshals/troops → integration enforced. This is very exam-useful for Q2 progress questions.

3. **Bull Connor as a recurring thread:** Connor appears here (Birmingham, May 1961) and again in Episode 5 (Birmingham campaign, April 1963). Flag him here explicitly — "you will see this man again." The `VisualNarrativeScreen` in Section 3 should name Connor and note that his calculated violence against protesters will have the same effect two years later on a larger scale.

4. **Cold War interleaving from Episode 1:** The Cold War embarrassment angle runs through Episodes 1, 2, 3 and 4. In Section 3's `QuickRecallScreen`, interleave a Cold War context question from Episode 1 alongside the Anniston firebombing content — the juxtaposition of "USA claims to lead the free world" with the burning bus photograph makes the irony vivid.

5. **SNCC as a bridge to Episode 6:** SNCC's founding in Section 2 should include a brief forward flag: Stokely Carmichael, who rides in this episode, will later become SNCC chair and coin "Black Power." This seeds Episode 6's content without front-loading it.

6. **Component count check:** ChapterHookScreen (S1 — mandatory), PriorKnowledgeRecall (S1 — mandatory), VisualLearning (S2), QuickRecallScreen (S2, S3, S5 — retrieval rule), VisualNarrativeScreen (S3), ExplainReveal (S4), MatchingTask (S4), ColSortBlock (S5), ExaminerExplainsScreen (S6 — mandatory), FaceTheExaminer (S6 — mandatory), ChapterCompleteScreen (S6 — mandatory). No feature component exceeds twice.
