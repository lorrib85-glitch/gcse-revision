# Episode 7: The Charity That Shut the Door — Architecture

## 1. Identity (brief)

- **Episode number:** 7
- **Title:** The charity that shut the door
- **Build status:** Not yet built — full build from spec
- **Header image:** `/English/An Inspector/aic-07-mrs-birling-characterisation-header.png`
- **Content pointer:** see `07_The_Charity_That_Shut_The_Door_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Proposed content:** True/false: "Mrs Birling refused to help Eva for legitimate reasons" (FALSE); recall Episodes 4–6: Eva's chain of misfortunes so far
- **Suggested component(s):** `ChapterHookScreen`; `PriorKnowledgeRecall` — Eva's chain (factory → Milwards → Gerald → ???)

### Section 2 — Plot & Dramatic Action
- **Proposed content:** Eva's approach to the charity; Mrs Birling's decision; "used my influence"; "not a good case"; her demand about the father; Sheila's growing alarm; the dramatic irony building
- **Suggested component(s):** `ExplainReveal` — Mrs Birling's refusal chain; `VisualNarrativeScreen` — the charity committee scene

### Section 3 — Theme & Context
- **Proposed content:** Class prejudice; hypocrisy (charity that excludes); Victorian "deserving poor" concept; morality vs legality; AO3: Victorian charity traditions; AO3: what "influence" meant in 1912
- **Suggested component(s):** `TheoryCompareBlock` — what Mrs Birling says she did vs what she actually did; `MisconceptionCheck` — "She was right to refuse Eva" (false)

### Section 4 — Quote Analysis (AO2)
- **Proposed content:** "cold woman" (stage direction, single adjective); "girls of that class" (class prejudice); "not a good case" (euphemism for abandonment); "used my influence to have it refused" (power without accountability); "slammed the door in her face" (Inspector's phrase — names the reality)
- **Suggested component(s):** `MatchingTask` — match quote to technique + theme; `InteractiveCollectionExplorer` — five quotes with analysis

### Section 5 — Exam Practice
- **Proposed content:** Question: "How does Priestley present Mrs Birling in An Inspector Calls?"; model paragraph on "girls of that class"; whole-play link: dramatic irony of "go and look for the father" / Eric's reveal
- **Suggested component(s):** `GuidedExamResponse`; `FaceTheExaminer`

### Section 6 — Retrieval & Wider Play Links
- **Proposed content:** Retrieve Episodes 1–6; whole-play link: Mrs Birling's refusal is the penultimate link in Eva's chain; forward-link to Episode 8 (Eric's reveal)
- **Suggested component(s):** `QuickRecallScreen` — Eva's complete chain so far; `RecoveryQuizPlayer`

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **The dramatic irony is this episode's climax:** Build to "go and look for the father" in Section 2 carefully — let it land. The learner should feel the irony before it's named. Then Section 3 names it.

2. **"Slammed the door in her face" vs her own account:** Mrs Birling's euphemistic language vs the Inspector's direct language is one of the play's most instructive contrasts for AO2. Make this a dedicated quote analysis in Section 4.

3. **Victorian charity context must be specific:** The "deserving poor" concept is essential here. In 1912, charity was conditional on the recipient proving they merited it morally. Mrs Birling isn't behaving unusually for her class — that is Priestley's point: the system itself is what he's attacking.

4. **Don't flatten Mrs Birling into pure villainy:** She believes she is doing what is right. That is what makes her dangerous — not malice but conviction. The exam rewards students who can articulate this distinction.
