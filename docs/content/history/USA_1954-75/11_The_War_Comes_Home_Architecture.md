# Episode 11: The War Comes Home — Architecture

## 1. Identity (brief)

- **Episode number:** 11
- **Title:** The War Comes Home
- **Build status:** Not yet built
- **Content reference:** Storyline, Specification requirements and full Content reference pack: see `11_The_War_Comes_Home_Content.md` in this directory.

---

## 2. Navigation spine (6 parts)

These are the six progress-rail stages for this module. Each stage should become one tappable dot in the in-module progress bar. The dot should jump to the first screen of that stage. Do **not** use one dot per screen.

1. **The war on the evening news** — hook around television, photographs and the credibility gap.
2. **Why opposition grew** — media, My Lai, the Pentagon Papers, draft inequality and moral shock.
3. **Media, My Lai and public trust** — how official claims collapsed when evidence reached American homes.
4. **Protest becomes national** — students, MLK, Muhammad Ali, veterans, Moratorium marches and the silent majority backlash.
5. **How protest pressured presidents** — Cambodia, Kent State, Jackson State and the repeal of the Gulf of Tonkin Resolution.
6. **Exam prep: why did Americans turn against the war?** — Q2 causation using linked causes rather than a protest list.

**Progress rail rule:** render these as six dots only. Labels stay hidden unless tapped. The rail should appear on all normal learning pages and be hidden only on full-screen video/cinematic reveal moments.

---

## 3. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity; reactivate Episodes 9–10 knowledge; preview this chapter.
- **Proposed content for this episode:**
  - Cinematic hook: 4 May 1970. Kent State University, Ohio. The National Guard opens fire on students protesting a war in Southeast Asia. Four are killed. The war has come home.
  - ChapterHookScreen (True/False): "The anti-war movement was mostly students and hippies" (False — veterans, religious leaders, MLK, senators all opposed the war); "Muhammad Ali was stripped of his boxing title for refusing military service" (True); "Kent State's shootings caused campuses to close and Congress to repeal the Gulf of Tonkin Resolution" (True)
  - PriorKnowledgeRecall: concepts from Episodes 9–10 — `rolling_thunder`, `search_and_destroy`, `tet_offensive`, `my_lai`, `credibility_gap`, `body_count`, `living_room_war`
  - WhatYouWillLearn: auto-generated from screen labels
- **Suggested component(s):**
  - `ChapterHookScreen` (True/False) — the "students and hippies" misconception is the most important to challenge; the Kent State sequence in the third question signals the episode's climax
  - `PriorKnowledgeRecall` — retrieval of Episodes 9–10; concepts: `rolling_thunder`, `search_and_destroy`, `tet_offensive`, `my_lai`, `credibility_gap`, `living_room_war`

### Section 2 — Learning Chunk 1
- **Purpose:** Television and the credibility gap — how the media turned public opinion.
- **Proposed content for this episode:**
  - Vietnam as the "living room war": the television images, what was shown (body bags, burning villages, napalm), what this did to the official narrative
  - Walter Cronkite's "stalemate" editorial (Episode 10 interleaving) — the moment television's most trusted voice gave up on the official narrative
  - Eddie Adams photograph (1 February 1968) and "Napalm Girl" (1972): the two photographs that defined the visual record of the war
  - My Lai revelation (November 1969): separate from the March 1968 massacre; the cover-up reinforced the belief that the government and army could not be trusted
  - Pentagon Papers (June 1971): confirmed systematic government deception; reinforced the credibility gap
  - Interleaving: connect to Westmoreland's optimism (Episode 10) and the Tet surprise — television made the gap between official claims and reality visible
- **Suggested component(s):**
  - `VisualLearning` — cinematic sequence: official "we're winning" broadcasts → body bag footage → Eddie Adams photograph (General Loan execution, 1968) → Cronkite "stalemate" editorial → My Lai photographs in *Life* → Pentagon Papers → public trust collapses; makes the cumulative media impact visible
  - `QuickRecallScreen` — retrieval of Tet Offensive and My Lai (Episode 10) interleaved with television/media facts; connects the events to their media representation

### Section 3 — Learning Chunk 2
- **Purpose:** The draft and inequality — who actually fought this war.
- **Proposed content for this episode:**
  - How the draft worked: Selective Service, deferments, local boards
  - Who was deferred: college students (overwhelmingly white, middle-class); essential workers; Muhammad Ali and conscientious objection
  - Who wasn't: Black Americans, poor and working-class men; early Black casualty rates disproportionately high
  - MLK's "Beyond Vietnam" (4 April 1967): the specific argument about Black men dying for democracy they were denied at home; the connection between the two series threads
  - Vietnam Veterans Against the War: returning veterans throwing medals at the Capitol; John Kerry's testimony; the most powerful anti-war voices were those who had been there
  - Interleaving: connect to Episodes 1–2 (Black Americans denied rights at home) and Episode 7 (continuing inequality by 1975); MLK's speech is the point where the two series threads converge
- **Suggested component(s):**
  - `VisualNarrativeScreen` — beat-by-beat: draft system (deferments, inequality) → Muhammad Ali refuses → MLK's "Beyond Vietnam" speech (4 April 1967, key quote: "we were taking the Black young men...") → Black casualty rates → VVAW veterans throw medals → John Kerry's testimony; the human cost and moral case converging
  - `QuickRecallScreen` — retrieval of Black Americans in the North (Episode 1) and civil rights vs Vietnam through-line (Episode 7) interleaved with draft inequality facts; the explicit series convergence moment

### Section 4 — Learning Chunk 3
- **Purpose:** The anti-war movement — its scale, its breadth, its opponents, and its impact.
- **Proposed content for this episode:**
  - SDS (Students for a Democratic Society): campus-based organising; teach-ins from 1965
  - Moratorium (October 1969): 250,000 in Washington DC; millions nationally; largest single-day US anti-war demonstration
  - Nixon's "silent majority" speech (3 November 1969): political framing; short-term effectiveness; what it revealed about Nixon's strategy
  - Silent majority / pro-war backlash: not all Americans opposed the war; some working-class, conservative and patriotic Americans saw protesters as ungrateful or un-American. Nixon deliberately appealed to this group to isolate the protest movement.
  - Second Moratorium (November 1969): 500,000 in Washington DC; Nixon's claim of a "silent majority" increasingly difficult to sustain
  - The breadth of opposition: not just students — religious leaders, veterans, civil rights figures, musicians, ordinary families
- **Suggested component(s):**
  - `InteractiveCollectionExplorer` — explore "The anti-war movement" (SDS and students / Vietnam Veterans Against the War / religious leaders and MLK / Muhammad Ali / Moratorium marches / Pentagon Papers / Nixon's silent majority and pro-war backlash); colour-coded by group type; makes the breadth of opposition visible beyond the "student protestor" stereotype while avoiding the false impression that every American opposed the war
  - `MatchingTask` — match anti-war figure/event to significance: (MLK "Beyond Vietnam" → connected civil rights and anti-war); (Muhammad Ali → draft resistance icon, stripped of title); (Moratorium October 1969 → millions protesting, 250,000 in DC); (VVAW / John Kerry → veterans as the most credible anti-war voices); (silent majority → Nixon's appeal to Americans who saw protest as unpatriotic); active processing of who opposed the war, who resisted the anti-war movement, and why it mattered

### Section 5 — Learning Chunk 4
- **Purpose:** Cambodia, Kent State and the Gulf of Tonkin repeal — when the war came home.
- **Proposed content for this episode:**
  - Nixon's Cambodia invasion (30 April 1970): Nixon said he was attacking communist bases and supply routes, but many Americans saw this as an expansion of the war into another country after he had promised "peace with honour"
  - Why Cambodia caused anger: the public had been told the war was being wound down, so widening the war looked like betrayal; it also reinforced the credibility gap and fears of presidential overreach
  - Kent State (4 May 1970): what happened; the four students (Allison Krause, Jeffrey Miller, Sandra Scheuer, William Schroeder); John Filo's photograph; 450 campuses closed
  - Jackson State (14 May 1970): two Black students killed; less coverage — the race dimension
  - Congress repeals the Gulf of Tonkin Resolution (June 1970): the legislative consequence; the blank cheque cancelled
  - Pentagon Papers (June 1971): the confirmation of everything opponents had claimed
  - Consolidation retrieval: key facts, dates, terms from the whole episode
- **Suggested component(s):**
  - `ColSortBlock` — sort evidence into "Factors that caused opposition to grow" vs "Government attempts to suppress or outflank opposition" — prepares students for Q2 "explain why opposition grew" and also shows the two-sided nature of the conflict between protesters and the state. Include Cambodia as the trigger for Kent State and silent majority as Nixon's counter-frame.
  - `QuickRecallScreen` — retrieval of full episode content: Cronkite, Pentagon Papers, draft deferments, Black casualty rates, MLK's speech, Ali, Moratorium, silent majority, Cambodia invasion, Kent State (date, four names, 450 campuses), Jackson State, Gulf of Tonkin repeal

### Section 6 — Summary & Examiner
- **Purpose:** No major new content; apply knowledge to exam technique; end with completion screen.
- **Proposed content for this episode:**
  - Examiner explains Q2 "Explain why" — "Why did opposition to the Vietnam War grow in the USA?" as worked example (2022 paper Q2); three-cause structure
  - Examiner tip: the best answers link causes together — TV showed the reality (cause 1) that contradicted official claims (making the draft's unfairness more visible, cause 2), Cambodia made it look like Nixon was widening rather than ending the war, and when Kent State showed the government shooting students (cause 3), opposition became more mainstream
  - Examiner balance point: not all Americans opposed the war; Nixon's silent majority argument is useful for explaining why the USA was divided, but the growth of opposition still forced political change
  - FaceTheExaminer: Q2-style question — "Explain why opposition to the Vietnam War grew in the USA between 1965 and 1970"
- **Suggested component(s):**
  - `ExaminerExplainsScreen` — animated Q2 structure; "Why did opposition grow?" as worked example; models the three-cause chain with links between causes (TV → credibility gap → draft inequality → Cambodia/Kent State → opposition mainstream) while briefly acknowledging silent majority backlash
  - `FaceTheExaminer` — Q2 question: "Explain why opposition to the Vietnam War grew in the USA between 1965 and 1970"; marks against criteria; logs exam-technique patterns
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

1. **MLK's "Beyond Vietnam" as the series convergence moment:** This is the most important interleaving in the entire series — the two threads (civil rights and Vietnam) collide in a single speech. Section 3's `VisualNarrativeScreen` should give this speech a dedicated beat with the direct quote about Black men dying for democracy they were denied at home. Students who can cite this speech in either a KT2 or a KT4 exam answer demonstrate a rare level of series-level command.

2. **Jackson State alongside Kent State:** Kent State gets far more attention but Jackson State (two Black students killed, less media coverage) makes a point that matters for this series: the value placed on Black and white lives was still unequal in 1970. Include Jackson State in Section 5's content and the `ColSortBlock`. Students who cite both are demonstrating exactly the kind of critical analysis the Q3(d) format rewards.

3. **The four Kent State students by name:** Allison Krause, Jeffrey Miller, Sandra Scheuer, William Schroeder. Students who know the names (and that Scheuer was simply walking to class) write qualitatively different answers. Section 5 should include all four names in the `QuickRecallScreen`.

4. **Muhammad Ali as a bridge between KT2 and KT4:** Ali was a Black American athlete at the height of his powers who refused to fight in a war and paid a severe personal cost. He belongs in both the civil rights story (Episode 6 connections: Black Power's rejection of American institutions) and the anti-war story (Episode 11). The `InteractiveCollectionExplorer` in Section 4 should give him a dedicated card that makes both connections.

5. **The "breadth" argument for Q2 answers:** The 2022 Q2 mark scheme rewards answers that show opposition was not just student/fringe — it included veterans, religious figures, civil rights leaders, senators. The `InteractiveCollectionExplorer` in Section 4 is directly structured to build this breadth argument.

6. **Cambodia as the Kent State trigger:** Claude must not jump from "Nixon" to "Kent State" without explaining the trigger. Nixon's Cambodia invasion angered students because it looked like escalation, not withdrawal, and contradicted the promise of "peace with honour". This is the causal bridge students need for Q2.

7. **Silent majority as balance, not derailment:** Include Nixon's silent majority and pro-war backlash to avoid the false impression that all Americans opposed the war by 1970. Keep it brief: it explains division and Nixon's strategy, but the module's main argument remains about why opposition grew.

8. **Claude build detail — exact implementation requirements:**
   - Do not make this module feel like a generic protest timeline. The core idea is: opposition grew because the war became visible, personal and morally indefensible.
   - Section 2 should teach "Living Room War" as a media mechanism: images entered the home → contradicted official optimism → widened the credibility gap → made opposition more mainstream. Keep visual treatment restrained: newsroom, TV glow, newspapers, silhouettes, not gore.
   - The media sequence must distinguish event from publication: Tet happened in January 1968; My Lai happened March 1968 but was revealed November 1969; Pentagon Papers were published June 1971.
   - Section 3 must make the draft feel unfair in a concrete way: college deferments protected many white middle-class men while poorer men and Black Americans were more exposed to combat. Include Ali as a named human example.
   - Section 3 should include one explicit series-bridge retrieval question: "Why did MLK argue the Vietnam War was connected to civil rights?" Correct answer: Black Americans were asked to fight for democracy abroad while denied equality at home, and war spending damaged anti-poverty programmes.
   - Section 4 `InteractiveCollectionExplorer` must have at least six cards: Students/SDS, MLK/religious leaders, Muhammad Ali, Vietnam Veterans Against the War, Moratorium marches, Nixon's silent majority/pro-war backlash. Optional seventh: Pentagon Papers / Daniel Ellsberg.
   - Section 5 must include Cambodia → Kent State as a cause chain: Nixon invades Cambodia → students see expansion/betrayal → protests grow → National Guard shoots four students → 450 campuses close → Congress repeals Gulf of Tonkin Resolution.
   - Section 5 must include Kent State and Jackson State together. Do not let Jackson State become a tiny footnote; use it to show race and media attention were still unequal.
   - Include one misconception check: "The anti-war movement was just students and hippies" = false; it included veterans, civil rights leaders, religious figures, senators, athletes and ordinary families.
   - Include one balance check: "By 1970, everyone in America opposed the war" = false; Nixon appealed to a silent majority who saw protesters as unpatriotic.
   - In the Examiner model answer, use three linked paragraphs: media/credibility gap; draft inequality; Cambodia/Kent State/My Lai/Pentagon Papers as moments that made opposition mainstream.
   - Avoid excessive protest-poster styling. Keep it cinematic-history: television newsrooms, campus steps, newspaper rooms, courtroom/congress atmosphere, candlelit vigils, not neon protest collage.

9. **Component count check:** ChapterHookScreen (S1 — mandatory), PriorKnowledgeRecall (S1 — mandatory), VisualLearning (S2), QuickRecallScreen (S2, S3, S5 — retrieval rule), VisualNarrativeScreen (S3), InteractiveCollectionExplorer (S4), MatchingTask (S4), ColSortBlock (S5), ExaminerExplainsScreen (S6 — mandatory), FaceTheExaminer (S6 — mandatory), ChapterCompleteScreen (S6 — mandatory). No feature component exceeds twice.
