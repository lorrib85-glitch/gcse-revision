# Episode 6: Daisy Renton and the Gentleman Rescuer — Architecture

## 1. Identity (brief)

- **Episode number:** 6
- **Title:** Daisy Renton and the gentleman rescuer
- **Build status:** Not yet built — full build from spec
- **Header image:** `/English/An Inspector/aic-03-character-essay-main-body-header.png`
- **Content pointer:** see `06_Daisy_Renton_And_The_Gentleman_Rescuer_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Proposed content:** True/false: "Gerald is the most moral character in the play because he tried to help Eva" (FALSE/UNCERTAIN); recall Eva's journey so far (factory → Milwards → ???)
- **Suggested component(s):** `ChapterHookScreen`; `PriorKnowledgeRecall` — Eva's chain of events so far

### Section 2 — Plot & Dramatic Action
- **Proposed content:** Gerald's reaction to "Daisy Renton"; how they met (Palace bar); the affair; Morgan Terrace; ending the relationship; Sheila's response; engagement ring returned
- **Suggested component(s):** `VisualNarrativeScreen` — Gerald's confession beats; `ConceptReveal` — power imbalance in "keeping" someone

### Section 3 — Theme & Context
- **Proposed content:** Gender double standards 1912; "fallen women"; the Fairy Prince irony; AO3: Victorian double standards; AO3: class power in intimate relationships
- **Suggested component(s):** `TheoryCompareBlock` — Gerald's self-image ("I helped her") vs the reality (he used her); `ExplainReveal` — power imbalance chain

### Section 4 — Quote Analysis (AO2)
- **Proposed content:** "young and fresh and charming" (objectification); "kept her" (euphemism/power); "the wonderful Fairy Prince" (irony); "respect myself" (self-centred framing); "everything's all right now, Sheila" (Act 3 reversion)
- **Suggested component(s):** `MatchingTask` — match Gerald quote to the theme it reveals (gender/class/self-interest); `InteractiveCollectionExplorer` — five quotes with analysis

### Section 5 — Exam Practice
- **Proposed content:** Question: "How does Priestley present gender inequality in An Inspector Calls?"; model paragraph using "kept her"; whole-play link: Gerald's Act 3 reversion vs Sheila's continued moral awareness
- **Suggested component(s):** `GuidedExamResponse`; `ExaminerExplainsScreen` — how to handle nuanced characters (neither simply good nor bad)

### Section 6 — Retrieval & Wider Play Links
- **Proposed content:** Retrieve Episodes 1–5; whole-play link: Gerald's return in Act 3 and his role in the "hoax" investigation; forward-link to Episode 10
- **Suggested component(s):** `QuickRecallScreen` — Gerald's timeline with Eva; `RecoveryQuizPlayer`

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Nuance over simplicity:** This is the play's most morally complex episode. Resist the temptation to make Gerald simply "bad" or simply "good." The exam rewards students who can see his complexity — he did help Eva, AND he exploited her. Both are true.

2. **"Kept her" is the key word:** The euphemism reveals everything about the power structure. Make it the centrepiece of Section 4's quote analysis.

3. **Sheila's "Fairy Prince" is the episode's sharpest moment:** It deflates Gerald's romantic self-image in four words. Use it in Section 2 to show that even at this point Sheila can see clearly when others can't.

4. **AO3 on gender must be specific:** The relevant context is: in 1912, men could have mistresses with social impunity; women who became mistresses were "fallen women"; the legal and social consequences fell entirely on the woman. Name this asymmetry directly.
