# Episode 10: Can You Win a Guerrilla War? — Architecture

## 1. Identity (brief)

- **Episode number:** 10
- **Title:** Can You Win a Guerrilla War?
- **Build status:** Not yet built
- **Content reference:** Storyline, Specification requirements and full Content reference pack: see `10_Can_You_Win_a_Guerrilla_War_Content.md` in this directory.

---

## 2. Navigation spine (6 parts)

These are the six progress-rail stages for this module. Each stage should become one tappable dot in the in-module progress bar. The dot should jump to the first screen of that stage. Do **not** use one dot per screen.

1. **An enemy you cannot see** — hook around guerrilla warfare and why US power struggled.
2. **How the Vietcong fought** — tunnels, ambushes, booby traps, local support and no clear front line.
3. **How America tried to win** — Search and Destroy, body counts, bombing and Hearts and Minds.
4. **Tet changes the story** — the Tet Offensive as military defeat for the Vietcong but political disaster for the USA.
5. **Why methods backfired** — My Lai, the credibility gap, media impact and public trust collapsing.
6. **Exam prep: methods, Tet and turning points** — Q2 causation on why US methods failed and why Tet mattered.

**Progress rail rule:** render these as six dots only. Labels stay hidden unless tapped. The rail should appear on all normal learning pages and be hidden only on full-screen video/cinematic reveal moments.

---

## 3. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Create curiosity; reactivate Episode 9 knowledge; preview this chapter.
- **Proposed content for this episode:**
  - Cinematic hook: 30 January 1968. Tet — the Vietnamese new year. A truce is in place. And then: 80,000 fighters attack 100 cities at once.
  - ChapterHookScreen (True/False): "The Tet Offensive was a military victory for the Vietcong" (False — VC suffered 45,000 casualties and never recovered); "Walter Cronkite called the Vietnam War a 'stalemate' on national television" (True); "My Lai was reported immediately and caused instant public outrage" (False — covered up for 14 months)
  - PriorKnowledgeRecall: concepts from Episode 9 — `rolling_thunder`, `search_and_destroy`, `body_count`, `vietcong_tactics`, `ho_chi_minh_trail`, `escalation`, `credibility_gap`
  - WhatYouWillLearn: auto-generated from screen labels
- **Suggested component(s):**
  - `ChapterHookScreen` (True/False) — the "Tet = VC military victory" misconception is the most important to address; the My Lai cover-up question seeds the moral failure thread
  - `PriorKnowledgeRecall` — retrieval of Episode 9; concepts: `rolling_thunder`, `search_and_destroy`, `body_count`, `vietcong_tactics`, `ho_chi_minh_trail`, `credibility_gap`

### Section 2 — Learning Chunk 1
- **Purpose:** The Tet Offensive — what happened, military result, political result.
- **Proposed content for this episode:**
  - The set-up: existing credibility gap; Westmoreland's optimism; the truce; the coordinated attack on 100+ cities
  - Saigon: US Embassy breached; Westmoreland's press conference amid the fighting; the images
  - Hue: 25-day occupation; NVA mass executions; brutal urban fighting to retake it
  - Khe Sanh: 77-day siege; the comparison to Dien Bien Phu
  - Military result: VC suffered up to 45,000 killed; never recovered as independent force
  - Political result: Cronkite's broadcast (27 February); LBJ's "if I've lost Cronkite" moment; LBJ partial bombing halt, call for peace talks and withdrawal from election (31 March 1968)
- **Suggested component(s):**
  - `VisualNarrativeScreen` — beat-by-beat: existing credibility gap → Westmoreland's "we're winning" claim → truce announced → 80,000 attack simultaneously → US Embassy breached → Hue occupied → Cronkite's "stalemate" broadcast → LBJ announces bombing halt/peace talks and withdraws from election; the arc from false confidence to political collapse
  - `QuickRecallScreen` — retrieval of Rolling Thunder's failures (Episode 9), living room war (Episode 9) and Westmoreland's optimism (Episode 9) interleaved with Tet facts; connects the "we're winning" narrative to its collapse

### Section 3 — Learning Chunk 2
- **Purpose:** My Lai — the massacre, the cover-up, the revelation.
- **Proposed content for this episode:**
  - 16 March 1968: Charlie Company, My Lai; what Captain Medina ordered; what Calley's platoon did
  - Hugh Thompson: the helicopter pilot who stopped the killing; what he did; what happened to him afterwards
  - The cover-up: 14 months; Army buried the investigation
  - November 1969: Seymour Hersh's investigation; Ron Haeberle's photographs; *Life* magazine; national and international outrage
  - Calley's trial and Nixon's intervention
  - Interleaving: connect to free fire zones and body count culture (Episode 9) — My Lai was the product of the system, not just one bad officer
- **Suggested component(s):**
  - `VisualNarrativeScreen` — beat-by-beat: My Lai (16 March 1968) → Thompson intervenes → report filed and buried → 14 months pass → Hersh's story (November 1969) → photographs in *Life* → outrage → Calley convicted → Nixon releases him; the moral arc of the episode's darkest content, with public impact clearly tied to 1969 revelation
  - `QuickRecallScreen` — retrieval of Search and Destroy and free fire zones (Episode 9) interleaved with My Lai facts; makes explicit that My Lai was the product of a system, not an aberration

### Section 4 — Learning Chunk 3
- **Purpose:** The political consequences — how Tet and My Lai changed the war.
- **Proposed content for this episode:**
  - LBJ's withdrawal from the 1968 election: the political cost of the credibility gap
  - Partial bombing halt and Paris peace talks: Tet increased pressure for negotiation; talks opened May 1968 but progress was slow
  - 1968 crisis context: MLK assassinated in April, Robert Kennedy assassinated in June, urban unrest, anti-war movement rising
  - Nixon elected 1968: "peace with honour" platform; what Vietnamization meant (Episode 12)
  - Westmoreland replaced: the end of Search and Destroy as the primary strategy
  - Public opinion shift: the majority of Americans now believed the war was a mistake
  - The "credibility gap" as a permanent feature: the government could no longer claim the war was being won and be believed
  - Interleaving: connect to series through-line — "one nation fighting two battles"; the war at home (civil rights) and the war abroad (Vietnam) are both going badly simultaneously in 1968
- **Suggested component(s):**
  - `ExplainReveal` — cause-and-effect chain: Tet → credibility gap exposed → Cronkite editorial → LBJ bombing halt/peace-talk call + withdrawal from election → Paris peace talks open → Nixon elected on "ending the war" platform → Vietnamization announced → drawdown begins (Episode 12); reveals the political consequences progressively
  - `MatchingTask` — match event to consequence: (Tet Offensive → LBJ withdraws from election), (Tet → partial bombing halt/Paris peace talks), (My Lai cover-up revealed → national moral outrage), (Cronkite "stalemate" broadcast → public opinion majority against the war), (Nixon elected → Vietnamization policy), (RFK assassination → 1968 crisis deepens); active processing of the political fallout

### Section 5 — Learning Chunk 4
- **Purpose:** Assessment — what Tet and My Lai mean for how we understand the war.
- **Proposed content for this episode:**
  - Tet's paradox: a military defeat for the VC but a political defeat for the USA — the distinction that Q2 answers must make
  - Credibility gap: existed before Tet, but Tet made it undeniable
  - My Lai's legacy: happened March 1968, public impact after 1969 revelation; war crimes trial, accountability question, 30-year delay before Thompson was honoured
  - 1968 as national crisis: Tet, MLK assassination, RFK assassination, riots and anti-war protests create a sense of national breakdown
  - What the answer to the episode's question is: can you win a guerrilla war? Not the way the US fought this one. The political war (winning South Vietnamese hearts and minds) was lost at the same time as the military campaign was failing.
  - Consolidation retrieval: key facts, dates, terms from the whole episode
- **Suggested component(s):**
  - `ColSortBlock` — sort evidence into "Tet was a US/ARVN military success" vs "Tet was a US political disaster" — directly prepares students for the Q2 question about Tet as a "turning point" (where they must address both dimensions); include Paris peace talks and LBJ withdrawal as political consequences
  - `QuickRecallScreen` — retrieval of full episode content: Tet dates, Saigon Embassy, Hue, Khe Sanh, VC casualties, credibility gap, Cronkite, LBJ withdrawal, Paris peace talks, 1968 crisis, My Lai (date, Calley, Thompson, cover-up, revelation), Nixon election

### Section 6 — Summary & Examiner
- **Purpose:** No major new content; apply knowledge to exam technique; end with completion screen.
- **Proposed content for this episode:**
  - Examiner explains Q2 "Explain why" — "Why was the Tet Offensive a significant turning point?" as worked example; the military/political distinction is the key exam skill here
  - Examiner tip: the most common error is describing Tet as a VC military victory; the best answers explain WHY a military defeat for the VC was a political catastrophe for the USA (Westmoreland's false optimism, credibility gap, Cronkite, LBJ's withdrawal, peace talks)
  - Examiner tip: don't say My Lai caused immediate public outrage in March 1968; it was revealed in 1969 after a cover-up
  - FaceTheExaminer: Q2-style question — "Explain why the Tet Offensive was an important turning point in the Vietnam War"
- **Suggested component(s):**
  - `ExaminerExplainsScreen` — animated Q2 structure; "Why was Tet a turning point?" as worked example; models the military vs political distinction and how to use both in a Q2 answer; includes peace-talk bridge
  - `FaceTheExaminer` — Q2 question: "Explain why the Tet Offensive was an important turning point in the Vietnam War"; marks against criteria; logs exam-technique patterns
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

1. **The Tet paradox as the episode's central exam skill:** The most important conceptual move in this episode is the military/political distinction: VC were destroyed militarily, but the political war was lost. This distinction must appear explicitly in the `VisualNarrativeScreen` (Section 2), the `ColSortBlock` (Section 5), and the `ExaminerExplainsScreen` (Section 6). Students who can make this distinction in Q2 answers move from the middle to the top band.

2. **Peace talks as the bridge to Episode 12:** Add the chain: Tet → LBJ partial bombing halt/call for talks → Paris peace talks open May 1968 → Nixon promises peace with honour → Vietnamization. This keeps the end-of-war storyline coherent.

3. **Hugh Thompson as the episode's moral counterpoint:** Thompson is the antidote to both Calley (who killed) and the Army (which covered it up). The `VisualNarrativeScreen` in Section 3 should give him a dedicated beat — what he did, why it took 30 years for him to be recognised, and what that delay says about the institution. Students who include Thompson in Q2/Q3 answers about My Lai demonstrate depth of knowledge.

4. **My Lai as a product of a system, not just one man:** The `QuickRecallScreen` interleaving in Section 3 (connecting to Episode 9's free fire zones and body count culture) is essential. Examiners reward answers that contextualise My Lai within the broader failure of US strategy rather than treating it as an isolated incident. The `ExplainReveal` in Section 4 should make this connection explicit.

5. **Clarify My Lai timing:** The massacre happened in March 1968, but public outrage came after the 1969 revelation. This distinction should appear in the ChapterHookScreen, Section 3, and Examiner tip because it is an easy chronology trap.

6. **Series bridge: 1968 as the worst year of the decade:** Section 4 should note that 1968 was also the year of MLK's assassination (April) and Robert Kennedy's assassination (June) — the civil rights and Vietnam threads converging in a single catastrophic year. This is the series through-line made visible without front-loading Episode 11's content.

7. **Credibility gap needs a before/after:** Teach it as already growing before Tet, then made undeniable by Tet. This helps students avoid writing as if Cronkite alone changed everything.

8. **Claude build detail — exact implementation requirements:**
   - Section 2 must explicitly label Tet as a "military defeat for the VC but political disaster for the USA". This exact distinction should appear again in Section 5 and Section 6.
   - The `VisualNarrativeScreen` should build suspense from false confidence to collapse: Westmoreland says progress → Tet erupts → Embassy images shock viewers → Cronkite says stalemate → LBJ changes course.
   - Include Paris peace talks as a bridge, not a full Episode 12 lesson: one clear causal chain from Tet to bombing halt to Paris talks to Nixon/Vietnamization.
   - My Lai must be taught with two dates: 16 March 1968 = massacre; November 1969 = public revelation. Do not imply immediate public outrage.
   - Hugh Thompson must be a named moral counterpoint, but avoid graphic visual detail. Focus on his helicopter landing, protection of civilians, report being buried, and delayed recognition.
   - Add one retrieval item that asks: "Why can something be a military defeat for one side but still a political victory?" Correct answer should reference Tet.
   - Add one misconception item: "My Lai caused public outrage immediately in March 1968" = false, because it was covered up until 1969.
   - Keep visuals cinematic but restrained: embassy chaos, newsroom, maps, empty village aftermath, helicopter silhouette. No gore, no explicit bodies.

9. **Component count check:** ChapterHookScreen (S1 — mandatory), PriorKnowledgeRecall (S1 — mandatory), VisualNarrativeScreen (S2, S3 — used twice; allowed under the component repetition limit for "feature" components; check: VisualNarrativeScreen appears twice — at the limit), QuickRecallScreen (S2, S3, S5 — retrieval rule), ExplainReveal (S4), MatchingTask (S4), ColSortBlock (S5), ExaminerExplainsScreen (S6 — mandatory), FaceTheExaminer (S6 — mandatory), ChapterCompleteScreen (S6 — mandatory). VisualNarrativeScreen used twice — within the limit. No other feature component exceeds twice.
