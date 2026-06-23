# Episode 11: The Phone Rings Again — Architecture

## 1. Identity (brief)

- **Episode number:** 11
- **Title:** The phone rings again
- **Build status:** Not yet built — full build from spec
- **Header image:** `/English/An Inspector/aic-05-opening-structure-conclusion-header.png`
- **Content pointer:** see `11_The_Phone_Rings_Again_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Proposed content:** True/false: "Once the family discover the Inspector wasn't real, they are off the hook" (FALSE — Sheila's refusal proves the moral lesson stands); "The ending of the play proves the Inspector was a ghost" (FALSE — the ending is deliberately ambiguous); recall Episode 10 (the false relief and the generational split); recall the cyclical structure question from Episode 1 (the same scene, the same celebration, the same phone call)
- **Suggested component(s):** `ChapterHookScreen` (the cyclical hook: "the phone is ringing — again"); `PriorKnowledgeRecall` — Episode 10's moral vs legal split, Birling's panic-stricken response

### Section 2 — Plot & Dramatic Action
- **Proposed content:** The older generation celebrating the hoax; the second phone call arriving; the identical announcement ("a girl has just died — on her way to the Infirmary — after swallowing some disinfectant"); the announcement that "a police inspector is on his way here — to ask some questions"; Birling "panic-stricken"; the curtain falls before the inspector arrives; the cyclical structure confirmed
- **Suggested component(s):** `TimelineChain` — the final sequence from false relief to second phone call; `VisualNarrativeScreen` — the phone rings, the curtain falls, the audience is left

### Section 3 — Theme & Context
- **Proposed content:** Cyclical structure (the play's ending = its opening); the multiple interpretations of the Inspector (real detective, supernatural figure, collective conscience, Priestley's voice, time-loop figure, morality play allegorical figure); Priestley's interest in time: J.W. Dunne's 'An Experiment with Time' (1927); "time plays" (Time and the Conways, I Have Been Here Before); the name "Goole" rhyming with "ghoul"; AO3: morality play tradition; AO3: Priestley's 1945 purpose — the audience is the jury
- **Suggested component(s):** `TheoryCompareBlock` — the multiple interpretations of the Inspector side by side (real / supernatural / conscience / Priestley / time figure); `ExplainReveal` — why the ambiguity is deliberate; `ConceptReveal` — cyclical structure as a warning

### Section 4 — Quote Analysis (AO2)
- **Proposed content:** "a girl has just died — on her way to the Infirmary — after swallowing some disinfectant" (identical to the Act 1 announcement — the structural echo); "a police inspector is on his way here — to ask some questions" (the threat renewed); Birling "panic-stricken" (stage direction — fear not guilt, he has not changed); "Goole" / "ghoul" (phonological suggestion of the supernatural); the curtain falls (stagecraft — the audience is left in suspension); cyclical structure: the play begins and ends with the same imminent Inspector's arrival
- **Suggested component(s):** `InteractiveCollectionExplorer` — five extracts with technique, analysis, effect; `MisconceptionCheck` — "The Inspector is definitely a ghost" (FALSE: deliberate ambiguity); "The ending proves the Inspector's visit was real" (UNCERTAIN: Priestley leaves this unresolved); "The ending is optimistic" (DEBATABLE: warning + challenge simultaneously)

### Section 5 — Exam Practice
- **Proposed content:** Questions: "How effective is the ending of An Inspector Calls?"; "How does Priestley use structure to present his ideas?"; "What is the importance of the Inspector in An Inspector Calls?"; model paragraph on cyclical structure ("the curtain falls" + "panic-stricken" + 1945 context); whole-play link: the opening stage directions (celebration, confidence, self-satisfaction) vs the ending (the same scenario, the same Inspector, the same moral test — but the characters who have not changed are now "panic-stricken")
- **Suggested component(s):** `GuidedExamResponse` — "How does Priestley use the ending of An Inspector Calls?"; `FaceTheExaminer` — model paragraph on cyclical structure with AO3 integration; `ExaminerExplainsScreen` — how to argue multiple interpretations without just listing them

### Section 6 — Retrieval & Wider Play Links
- **Proposed content:** Retrieve the full series (Episodes 1–11): the complete chain of events, the generational split, the Inspector's methods and message; whole-play link: Episode 1 (the celebration the Inspector interrupts) mirrors the ending (the celebration the Inspector will interrupt again); whole-play link: Episode 9 ("fire and blood and anguish") — the cyclical ending confirms the Inspector's warning was true; whole-play link: Episode 10 (the false relief) — the ending destroys it
- **Suggested component(s):** `QuickRecallScreen` — the complete series key terms and quotes; `RecoveryQuizPlayer` — the ending, cyclical structure, multiple interpretations

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **The cyclical structure is the episode's architectural spine:** Every screen should reinforce that the ending is not a new event — it is the beginning repeated. The most effective teaching tool is the structural comparison: hold Act 1's opening against the final phone call. They are the same. The audience is invited to ask: why has nothing changed?

2. **Teach multiple interpretations as a skill, not as a list:** Students who list the interpretations without evaluating them score lower marks. Build a `TheoryCompareBlock` or `ExplainReveal` that gives each interpretation equal space, then models how to use ambiguity as an exam argument ("Priestley deliberately withholds resolution — this is the point").

3. **"Panic-stricken" is the most exam-efficient stage direction in the play:** It does more work than almost any line of dialogue. Birling is not guilty — he is afraid. His fear is of exposure, not of harm done. This single stage direction confirms, in two words, that he has not changed. Build a dedicated quote analysis beat around it.

4. **The curtain is Priestley's last tool:** "The curtain falls" before the inspector arrives. This is not an incomplete ending — it is the ending. The audience is left in Sheila and Eric's position: knowing what has happened, choosing what to do next. This is the exam insight that separates top from mid: Priestley makes the audience participants.

5. **AO3 integration here is high-value:** The 1945 audience had just survived "fire and blood and anguish." The cyclical ending was not a theatrical trick — it was a warning delivered to people who had already seen what happens when Birling's logic goes unchallenged. The more precisely this is integrated into the exam paragraph, the higher the mark.
