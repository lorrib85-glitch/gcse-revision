# Episode 5: I Have a Dream — Architecture

## 1. Identity (brief)

- **Episode number:** 5
- **Title:** I Have a Dream
- **Build status:** Not yet built
- **Content reference:** Storyline, Specification requirements and full Content reference pack: see `05_I_Have_a_Dream_Content.md` in this directory.

---

## 2. Navigation spine (6 parts)

These are the six progress-rail stages for this module. Each stage should become one tappable dot in the in-module progress bar. The dot should jump to the first screen of that stage. Do **not** use one dot per screen.

1. **A dream on the steps** — hook around the March on Washington and King's speech.
2. **Why 1963 became a turning point** — Birmingham, Bull Connor, media attention and growing pressure.
3. **The march itself** — aims, organisation, scale, speakers and the symbolism of Washington.
4. **From protest to law** — Kennedy, Johnson, the Civil Rights Act 1964 and Voting Rights Act 1965.
5. **How much did peaceful protest achieve?** — progress, limits, opposition and the role of federal government.
6. **Exam prep: peaceful protest and legal change** — Q2 causation and Q3d interpretation judgement.

**Progress rail rule:** render these as six dots only. Labels stay hidden unless tapped. The rail should appear on all normal learning pages and be hidden only on full-screen video/cinematic reveal moments.

---

## 3. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity; reactivate Episodes 1–4 knowledge; preview this chapter.
- **Proposed content for this episode:**
  - Cinematic hook: 28 August 1963 — 250,000 people standing in front of the Lincoln Memorial. How did the movement get here? And what did it cost?
  - ChapterHookScreen (True/False): "MLK's 'I Have a Dream' was a fully scripted, prepared speech" (False); "Bull Connor used fire hoses on children during the Birmingham campaign" (True); "The 1964 Civil Rights Act gave Black Americans full voting rights" (False)
  - PriorKnowledgeRecall: concepts from Episodes 1–4 — `non_violent_direct_action`, `mlk`, `sclc`, `sncc`, `freedom_rides`, `brown_v_board`, `civil_rights_act_1957`
  - WhatYouWillLearn: auto-generated from screen labels
- **Suggested component(s):**
  - `ChapterHookScreen` (True/False) — the "speech was planned" misconception and the "Act gave voting rights" misconception bracket the episode's core argument
  - `PriorKnowledgeRecall` — retrieval of Episodes 1–4; concepts: `non_violent_direct_action`, `mlk`, `sclc`, `sncc`, `freedom_rides`, `brown_v_board`, `civil_rights_act_1957`

### Section 2 — Learning Chunk 1
- **Purpose:** Introduce Birmingham 1963 — why it was chosen, what Project C was, and what happened.
- **Proposed content for this episode:**
  - Why Birmingham: "Bombingham", Bull Connor, the deliberate choice to provoke
  - Project C: the strategy of sustained confrontation to fill jails and generate a violent reaction
  - Connor's response: fire hoses, police dogs, 3,000 arrests
  - Children's Crusade (2–5 May 1963): schoolchildren join the marches; Connor uses full force; images broadcast nationally
- **Suggested component(s):**
  - `VisualLearning` — cinematic sequence: SCLC chooses Birmingham → Project C (marches, sit-ins, jail) → Connor deploys fire hoses and dogs → Children's Crusade images → Kennedy addresses the nation; each scene shows the strategy and its outcome
  - `QuickRecallScreen` — retrieval of Bull Connor (Episode 4: Freedom Rides, Birmingham) and SCLC (Episode 3) interleaved with Project C facts; interleaving of the recurring Connor thread

### Section 3 — Learning Chunk 2
- **Purpose:** Kennedy's response and Medgar Evers — the political turning point.
- **Proposed content for this episode:**
  - Kennedy's 11 June 1963 speech: first time a president framed civil rights as a moral issue; announces plans for a civil rights bill
  - Medgar Evers assassinated 12 June 1963: the day after Kennedy's speech; the violence continues even as the law moves
  - Sixteenth Street Baptist Church bombing (15 September 1963): four girls killed; national anger
  - Interleaving: connect to Episode 1's theme that the system of violence continued regardless of political progress — the movement was winning laws faster than it was changing hearts
- **Suggested component(s):**
  - `VisualNarrativeScreen` — beat-by-beat: Kennedy's speech (11 June) → Evers assassinated (12 June) → March on Washington (28 August) → church bombing (15 September) → Kennedy assassination (22 November) → LBJ's pledge; the timeline of triumph and violence running in parallel
  - `QuickRecallScreen` — retrieval of NAACP (Episode 1: Medgar Evers context) and voting rights denial (Episode 1) interleaved with Kennedy speech facts; connects the political progress to the ongoing violence

### Section 4 — Learning Chunk 3
- **Purpose:** The March on Washington and "I Have a Dream" — the movement at its peak.
- **Proposed content for this episode:**
  - Organisation: A. Philip Randolph, Bayard Rustin; logistics of 250,000 people
  - Who came: 250,000 total, 40,000 white — multi-racial breadth; all major civil rights organisations
  - John Lewis's speech: toned down as too radical — a hint of the tensions to come (Black Power, Episode 6)
  - MLK's speech: scripted base; "I Have a Dream" improvised when Mahalia Jackson called out; why it became the movement's defining moment
- **Suggested component(s):**
  - `InteractiveCollectionExplorer` — explore "The March on Washington" (A. Philip Randolph's history / Bayard Rustin's logistics / John Lewis's toned-down speech / MLK's improvised dream / the 40,000 white participants); colour-coded; makes the event's complexity visible beyond the famous speech
  - `MatchingTask` — match person to role/act: (Bayard Rustin → chief logistical organiser), (John Lewis → SNCC, speech toned down), (Mahalia Jackson → "Tell them about the dream"), (LBJ → pledged Civil Rights Act after Kennedy's assassination); active processing of the episode's key figures

### Section 5 — Learning Chunk 4
- **Purpose:** The Civil Rights Act 1964 — what it achieved, what it didn't, and why it leads to Selma.
- **Proposed content for this episode:**
  - What the Act did: outlawed discrimination in public places and employment; EEOC created; federal enforcement power
  - Legislative comparison: stronger than the weak Civil Rights Act 1957, which mainly investigated voting-rights abuses and had limited enforcement
  - What the Act didn't do: voting rights (needing 1965 Voting Rights Act), housing (1968 Act), economic inequality (never fully addressed)
  - Why it was passed: Birmingham + march + Kennedy assassination + LBJ's political commitment — the convergence of factors
  - Bridge line: the 1964 Act attacked public segregation and employment, but did not solve voting rights; that gap leads directly to Selma and the Voting Rights Act 1965
  - Consolidation retrieval: key facts, dates, terms from the whole episode
- **Suggested component(s):**
  - `ColSortBlock` — sort evidence into "What the 1964 Civil Rights Act achieved" vs "What it left unaddressed"; include voting rights as the key unresolved gap; directly prepares students for Q2 significance questions and the progress/limits structure
  - `QuickRecallScreen` — retrieval of full episode content: Project C, Bull Connor, Children's Crusade, Kennedy's speech, Evers assassination, March on Washington, Sixteenth Street Baptist Church bombing, LBJ, Civil Rights Act 1964, voting-rights gap

### Section 6 — Summary & Examiner
- **Purpose:** No major new content; apply knowledge to exam technique; end with completion screen.
- **Proposed content for this episode:**
  - Examiner explains the Q2 "Explain why" structure — "Why was the Civil Rights Act (1964) passed?" as worked example; three-cause structure: Birmingham/media, March on Washington, Kennedy assassination + LBJ
  - Examiner tip: students who name all three causes AND link them causally (rather than listing) score in the higher bands; the chain from Birmingham images → Kennedy's speech → march pressure → Kennedy assassination → LBJ's pledge → Act is the full causal argument
  - Examiner tip: do not claim the 1964 Act gave voting rights. Use it as a progress-and-limits point: public discrimination/employment = addressed; voting rights = unresolved until 1965
  - FaceTheExaminer: Q2-style question — "Explain why the Birmingham campaign was important for the civil rights movement"
- **Suggested component(s):**
  - `ExaminerExplainsScreen` — animated Q2 structure explanation; "Why was the 1964 Civil Rights Act passed?" as worked example; models three-cause linked structure and the bridge to 1965
  - `FaceTheExaminer` — Q2 question: "Explain why the Birmingham campaign was important for the civil rights movement"; marks against criteria; logs exam-technique patterns
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

1. **Birmingham as deliberate strategy — not reactive:** The most important conceptual point in this episode is that Birmingham was chosen because Bull Connor was predictably brutal and the cameras were already there. The `VisualLearning` in Section 2 should make the SCLC's strategic calculation explicit before showing Connor's response — otherwise students describe what happened without explaining the strategy behind it.

2. **The parallel timeline of violence and progress:** The VisualNarrativeScreen in Section 3 should make the tight chronology vivid: Kennedy's speech on 11 June, Evers shot on 12 June, the march on 28 August, the church bombing on 15 September, Kennedy shot on 22 November. These events happened within six months of each other. The compression matters — students who can trace this sequence in exam answers demonstrate genuine command of the material.

3. **The improvised "I Have a Dream" as a memorable hook:** The Mahalia Jackson detail is the most memorable and distinctive piece of knowledge in this episode — most students think the speech was fully scripted. The `InteractiveCollectionExplorer` in Section 4 should include it as one of the explorable cards with enough detail to stick.

4. **John Lewis's toned-down speech as a bridge to Episode 6:** Lewis's original speech called for more radical action ("We will march through the heart of Dixie the way Sherman did"). The fact that it was toned down before delivery is the first visible crack in movement unity — a forward flag for Episode 6's Black Power challenge. Include this detail in the `InteractiveCollectionExplorer` Section 4.

5. **The 1964 Act's limits as exam-prep content:** Section 5's `ColSortBlock` maps directly onto Q3(d) interpretation questions about the extent of civil rights progress. Make the column labels explicitly exam-language: "evidence of significant progress" / "evidence of limited progress" — training students in the vocabulary they need for a 16-mark evaluation.

6. **Bridge from 1964 to 1965:** Add a clear, repeated line that the 1964 Act was stronger than 1957 but did not solve voting rights. This sets up Episode 7 cleanly and prevents the common misconception that the 1964 Act finished civil rights law.

7. **Component count check:** ChapterHookScreen (S1 — mandatory), PriorKnowledgeRecall (S1 — mandatory), VisualLearning (S2), QuickRecallScreen (S2, S3, S5 — retrieval rule), VisualNarrativeScreen (S3), InteractiveCollectionExplorer (S4), MatchingTask (S4), ColSortBlock (S5), ExaminerExplainsScreen (S6 — mandatory), FaceTheExaminer (S6 — mandatory), ChapterCompleteScreen (S6 — mandatory). No feature component exceeds twice.
