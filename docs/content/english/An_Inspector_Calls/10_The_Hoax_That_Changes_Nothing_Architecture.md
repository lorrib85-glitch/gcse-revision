# Episode 10: The Hoax That Changes Nothing — Architecture

## 1. Identity (brief)

- **Episode number:** 10
- **Title:** The hoax that changes nothing
- **Build status:** Not yet built — full build from spec
- **Header image:** `/English/An Inspector/aic-04-theme-based-questions-header.png`
- **Content pointer:** see `10_The_Hoax_That_Changes_Nothing_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Retrieve the Inspector's final speech and prime the hoax as a moral stress test, not a plot escape.
- **Proposed content:**
  - True/false: "If there was no real Inspector, the family did nothing wrong" — FALSE: moral guilt remains
  - True/false: "The hoax means the final speech does not matter" — FALSE: it tests who learned the speech
  - True/false: "Young people are perfect in the play" — FALSE: Sheila and Eric are guilty, but they learn
  - Recall Episode 9: "We are responsible for each other"
  - Recall complete chain: factory → Milwards → Gerald → Eric → charity
  - Hook question: "What do people do when they think they can get away with it?"
- **Suggested component(s):**
  - `ChapterHookScreen` — true/false on legal proof, moral responsibility and younger generation
  - `PriorKnowledgeRecall` — Inspector's final speech and complete chain
  - `MisconceptionCheck` — legal innocence vs moral innocence

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach the post-Inspector investigation as a sequence of false comfort and moral exposure.
- **Proposed content:**
  - Gerald returns after investigating Inspector Goole
  - Police station: no Inspector Goole at Brumley police
  - Arthur calls the infirmary: no suicide case has arrived
  - Older generation: relief, laughter, reputation/knighthood concerns return
  - Gerald tries to restore old comfort: "everything's all right now, Sheila"
  - Sheila refuses the reset: "You're pretending everything's just as it was before"
  - Sheila's judgement: "you don't seem to have learnt anything"
  - Eric sides with Sheila and remains appalled by his parents
  - The play structurally almost returns to the opening celebration
  - Build tension towards Episode 11's final phone call
- **Suggested component(s):**
  - `TimelineChain` — post-Inspector events: Gerald → police → infirmary → relief → Sheila/Eric refusal → phone-call setup
  - `ConceptReveal` — hoax as moral stress test
  - `VisualNarrativeScreen` — false reset: room tries to become comfortable again but cannot
  - `TheoryCompareBlock` — older conclusion vs younger conclusion

### Section 3 — Theme & Context
- **Purpose:** Connect the episode to morality vs legality, generational divide, self-deception, reversion and structural false resolution.
- **Proposed content:**
  - Theme: morality vs legality — legal uncertainty does not erase confessed harm
  - Theme: young vs old — Sheila/Eric learn; Arthur/Sybil/Gerald seek escape
  - Theme: self-deception — the older generation chooses the interpretation that comforts them
  - Theme: reversion — Gerald returns to old-world comfort; Birling returns to reputation
  - Theme: responsibility — the real question is who acts changed after the lesson
  - Theme: structure — false resolution makes the final phone call more powerful
  - AO3: post-war moral reckoning can be used briefly, but do not overload; focus on responsibility beyond punishment
  - AO3: Priestley's 1945 purpose — social responsibility must become internal, not just forced by fear
- **Suggested component(s):**
  - `TheoryCompareBlock` — legal proof vs moral truth
  - `ExplainReveal` — why no legal case does not equal no responsibility
  - `ColSortBlock` — character responses: learned / reverted / conflicted
  - `SwipeSort` — motive: responsibility, reputation, relief, self-deception

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis of Act 3 response quotes.
- **Proposed content:**
  - **"that man wasn't a police inspector"** — AO2: focus shifts from morality to status/procedure
  - **"no girl has died"** — AO2: factual relief used as moral escape
  - **"everything's all right now, Sheila"** — AO2: Gerald's reversion; desire to reset relationship/facade
  - **"You're pretending everything's just as it was before"** — AO2: "pretending" exposes conscious self-deception
  - **"you don't seem to have learnt anything"** — AO2: direct accusation; learning as the moral test
  - **"You began to learn something. And now you've stopped"** — AO2: stopped progress; failed moral growth
  - **"You don't understand anything. You never did"** — AO2: Eric's generational/family judgement
  - **Knighthood/reputation return** — AO2: motif reveals Birling's unchanged priorities
  - PQAC: analyse "you're pretending everything's just as it was before" as self-deception
  - PQAC extension: compare Gerald's "everything's all right" with Sheila's refusal
- **Suggested component(s):**
  - `MatchingTask` — quote → speaker → response type
  - `InteractiveCollectionExplorer` — Act 3 response quote bank
  - `ColSortBlock` — quotes into legal escape / moral responsibility / reputation / generational divide
  - `QuoteLadder` — quote → method → character response → Priestley's purpose

### Section 5 — Exam Practice
- **Purpose:** Practise AQA whole-play writing on young vs old, responsibility and ending structure.
- **Proposed content:**
  - Format reminder: AIC is AQA Paper 2 Section A; one whole-play essay, no printed extract
  - Question: "How does Priestley present the differences between the younger and older generations?"
  - Alternative question: "How does Priestley use the ending of *An Inspector Calls*?"
  - Alternative question: "How does Priestley present responsibility?"
  - Model paragraph: "you don't seem to have learnt anything" → direct accusation → young vs old → contrast with Inspector's final speech → final phone call setup
  - Model paragraph: "everything's all right now, Sheila" → Gerald's reversion → moral/legal confusion → Sheila's changed standards
  - Guided write: one paragraph arguing why the apparent hoax does not remove responsibility
  - Examiner explains: Grade 7–9 move is to explain structural purpose, not just plot twist
- **Suggested component(s):**
  - `GuidedExamResponse` — paragraph scaffold on young vs old / morality vs legality
  - `FaceTheExaminer` — upgrade "the Inspector was fake" into a moral-structure argument
  - `ExaminerExplainsScreen` — how to write about the ending without retelling the plot

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Retrieve Episodes 1–9 and prepare for the final phone call.
- **Proposed content:**
  - Retrieve Episode 1: opening comfort/facade
  - Retrieve Episode 2: Birling's knighthood/reputation concerns
  - Retrieve Episode 5/8: Sheila and Eric's capacity to learn
  - Retrieve Episode 9: Inspector's final speech
  - Whole-play link Episode 11: final phone call destroys the false resolution
  - Quick recall: who learns, who reverts, who investigates, what does Sheila say?
- **Suggested component(s):**
  - `QuickRecallScreen` — character response sorting
  - `MatchingTask` — character → post-hoax response → evidence
  - `RecoveryQuizPlayer` — morality vs legality, false resolution, Gerald's reversion, final phone call setup

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

### Fixed content gaps in this revision

- Reframed the apparent hoax as a moral stress test.
- Strengthened legal/procedural uncertainty vs moral responsibility.
- Tightened Gerald's Act 3 reversion and Sheila's refusal to reset.
- Added clearer structural false-resolution purpose before Episode 11.
- Kept AO3 lean and GCSE-useful, avoiding unnecessary external-history overload.
- Added explicit AQA no-extract whole-play paragraph practice.

---

## 4. Build recommendations

1. **Teach this as a moral stress test:** The question is not only "was the Inspector real?" but "who still accepts responsibility when escape seems possible?"

2. **Keep the structure clear:** False resolution first, final phone call next. The fake comfort makes the real ending land harder.

3. **Do not let Gerald off:** He is not identical to Arthur/Sybil, but his "everything's all right" shows regression.

4. **Use Sheila as the moral interpreter:** Her lines are the clearest student route into Grade 7–9 analysis.

5. **Avoid context overload:** For this episode, AO3 is less important than structural and thematic interpretation.

6. **Design:** Return the room almost to its opening warmth, but with visible cracks/unease. No detective-board styling; this is not a mystery game.

---

## 10-point Module Completion Test

- [ ] Students can explain what Gerald discovers
- [ ] Students can explain why the older generation feel relieved
- [ ] Students can explain morality vs legality
- [ ] Students can analyse "you're pretending everything's just as it was before"
- [ ] Students can analyse "you don't seem to have learnt anything"
- [ ] Students can explain Gerald's reversion
- [ ] Students can explain Birling's knighthood/reputation concern
- [ ] Students can explain the structural false resolution
- [ ] Students have written or improved one AQA-style paragraph
- [ ] Students can avoid the weak answer "the Inspector was fake so nothing mattered"
