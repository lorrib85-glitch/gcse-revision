# Episode 8: The Son They Refused to See — Architecture

## 1. Identity (brief)

- **Episode number:** 8
- **Title:** The son they refused to see
- **Build status:** Not yet built — full build from spec
- **Header image:** `/English/An Inspector/aic-03-character-essay-main-body-header.png`
- **Content pointer:** see `08_The_Son_They_Refused_To_See_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Proposed content:** True/false: "The family were unaware that Eric had any problems before the Inspector arrived" (FALSE — Sheila knew he'd been drinking heavily); recall Episode 7's dramatic irony (Mrs Birling condemned "the father"); recall Eva's complete chain
- **Suggested component(s):** `ChapterHookScreen`; `PriorKnowledgeRecall` — Eva's complete chain (factory → Milwards → Gerald → Eric → charity)

### Section 2 — Plot & Dramatic Action
- **Proposed content:** Eric returns; his confession; Eva and the money; Eva's moral code (refused stolen money); "you killed them both"; Birling's reaction (the fifty pounds); Eric vs Birling on what matters
- **Suggested component(s):** `VisualNarrativeScreen` — Eric's confession beats; `ConceptReveal` — Eva's moral code vs the family's
- **Sensitive topic handling:** The sexual exploitation must be taught clearly but without graphic detail; use the exact text ("I was in that state when a chap easily turns nasty") and name it as exploitation without dwelling on it

### Section 3 — Theme & Context
- **Proposed content:** Young vs old (Eric's remorse vs parents' denial); Edwardian masculinity; family failure as social failure; AO3: how drinking and male entitlement were normalised for upper-class men in 1912
- **Suggested component(s):** `SwipeSort` — sort characters: genuinely remorseful vs refuses responsibility; `ExplainReveal` — Eric's chain of failures and their causes

### Section 4 — Quote Analysis (AO2)
- **Proposed content:** "not quite at ease" (Act 1 stage direction — seeds the reveal); "squiffy" (colloquial minimisation + exposure); "you're not the kind of father a chap could go to" (indictment of Birling as father); "you killed them both" (direct accusation); "the money's not the important thing" (moral clarity vs Birling's priorities)
- **Suggested component(s):** `MatchingTask` — match Eric quote to theme; `FillInTheBlanksBlock` — paragraph analysis scaffold

### Section 5 — Exam Practice
- **Proposed content:** Question: "How does Priestley present Eric Birling in An Inspector Calls?"; model paragraph on "you're not the kind of father a chap could go to"; whole-play link: contrast Eric's remorse with Birling's response to the phone call in Episode 11
- **Suggested component(s):** `GuidedExamResponse`; `ExaminerExplainsScreen` — how to handle complexity (guilty but remorseful)

### Section 6 — Retrieval & Wider Play Links
- **Proposed content:** Retrieve Episodes 5–7; whole-play link: the complete chain is now revealed — factory, Milwards, Gerald, Eric, charity; forward-link to Episode 9 (the Inspector's final speech names the chain)
- **Suggested component(s):** `QuickRecallScreen` — the complete five-stage chain against Eva; `RecoveryQuizPlayer`

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Handle the sexual exploitation with care:** Do not sensationalise or avoid. Use the text precisely. Name it as exploitation. Move on to the moral argument quickly. The GCSE exam expects students to engage with this; the screen should model how to discuss it maturely.

2. **"You're not the kind of father a chap could go to" is the episode's most important line:** It indicts Birling's parenting, his capitalism, and his failure as a human being in nine words. Make it the centrepiece of Section 4.

3. **Eva's moral code:** Don't miss this. Eva refusing the stolen money is Priestley's most explicit tribute to her integrity. It is also what drives her to the charity. Teach it as evidence of her character, not just a plot point.

4. **Young vs old divide:** This episode completes the argument. Eric (young, flawed but remorseful) vs Birling (old, unrepentant). Section 3's `SwipeSort` should make this visible.
