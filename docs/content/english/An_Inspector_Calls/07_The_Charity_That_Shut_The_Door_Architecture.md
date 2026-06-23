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
- **Purpose:** Retrieve Eva's chain and prime the question of charity, judgement and deservingness.
- **Proposed content:**
  - True/false: "Mrs Birling refused Eva for legitimate moral reasons" — FALSE/too simple: Eva's need was genuine
  - True/false: "Charity always means compassion" — FALSE: Priestley shows charity can become class gatekeeping
  - True/false: "The father alone is responsible for Eva's death" — FALSE: Eric has responsibility, but the whole chain matters
  - Recall Episodes 4–6: Eva's chain so far — factory → Milwards → Gerald → pregnancy/charity
  - Recall Episode 5: Sheila now sees patterns and warnings before others do
  - Hook question: "What happens when help is controlled by people who judge whether you deserve it?"
- **Suggested component(s):**
  - `ChapterHookScreen` — true/false on charity, deservingness and father-only responsibility
  - `PriorKnowledgeRecall` — Eva's chain so far
  - `MisconceptionCheck` — charity as compassion vs charity as gatekeeping

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach Mrs Birling's interrogation as the penultimate link in Eva's chain and build the Eric dramatic irony slowly.
- **Proposed content:**
  - Eva is pregnant and desperate after the earlier chain of events
  - Eva approaches the Brumley Women's Charity Organisation for help
  - She uses the name "Mrs Birling", offending Sybil Birling's class/status pride
  - Mrs Birling judges Eva's manner, class and sexual status rather than her need
  - She says Eva was "not a good case" and uses her influence to have the claim refused
  - Inspector reframes the act as having "slammed the door in her face"
  - Mrs Birling insists the father should be responsible
  - She demands that the father be made to confess publicly / be made an example of
  - Sheila becomes increasingly alarmed because she realises the father may be Eric
  - End-point: Eric's entrance/reveal is prepared; the audience sees Mrs Birling has condemned her own son
- **Suggested component(s):**
  - `VisualNarrativeScreen` — sequence: pregnancy → charity appeal → name offence → influence used → claim refused → father blamed → Sheila alarm → Eric setup
  - `ExplainReveal` — charity refusal as cause/effect chain
  - `TimelineChain` — Eva's chain: factory → Milwards → Gerald → Eric → charity refusal → death
  - `ConceptReveal` — dramatic irony: Mrs Birling thinks she is judging an outsider, but she is judging Eric

### Section 3 — Theme & Context
- **Purpose:** Connect the episode to class prejudice, charity hypocrisy, deserving poor, gender, responsibility and older-generation denial.
- **Proposed content:**
  - Theme: class prejudice — "girls of that class" / "girl of that sort"
  - Theme: charity hypocrisy — a charity organisation refuses the person most in need
  - Theme: responsibility — Mrs Birling transfers blame to the father to avoid her own role
  - Theme: gender — respectable woman judges vulnerable pregnant woman; sexual shame falls on Eva
  - Theme: older generation — Mrs Birling is certain of her own rightness and struggles to learn
  - Theme: dramatic irony — she condemns Eric before she knows he is the father
  - AO3: deserving poor — charity conditional on moral judgement
  - AO3: Victorian/Edwardian respectability — poor women judged for sexuality, manner and status
  - AO3: women's charity work — upper-class women could hold social power through charitable institutions
  - AO3: Priestley's post-war critique — private charity is not enough if it reinforces class judgement
- **Suggested component(s):**
  - `TheoryCompareBlock` — charity as compassion vs charity as class control
  - `ExplainReveal` — deserving poor context, kept lean and tied to Eva's case
  - `ColSortBlock` — sort Mrs Birling's language into class prejudice / euphemism / responsibility transfer / dramatic irony
  - `SwipeSort` — Mrs Birling's view vs Inspector/Priestley's view

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis of Mrs Birling quotes, with particular focus on euphemism, class language and dramatic irony.
- **Proposed content:**
  - **"rather cold woman"** — AO2: stage direction; emotional coldness encoded before dialogue
  - **"girls of that class"** — AO2: class noun phrase; Eva reduced to category
  - **"a girl of that sort"** — AO2: moral judgement hidden inside class language
  - **"I didn't like her manner"** — AO2: tone/manner judged above need
  - **"claiming elaborate fine feelings and scruples"** — AO2: dismisses working-class moral sensitivity as artificial
  - **"not a good case"** — AO2: bureaucratic euphemism; dehumanises desperate need
  - **"used my influence to have it refused"** — AO2: polite phrase for abuse of social power
  - **"slammed the door in her face"** — AO2: Inspector's concrete/direct language exposes cruelty
  - **"Go and look for the father of the child. It's his responsibility"** — AO2: responsibility transfer; partially true but morally evasive
  - **"make sure that he's compelled to confess in public his responsibility"** — AO2: dramatic irony; condemns Eric unknowingly
  - PQAC: analyse "girls of that class" as class prejudice
  - PQAC extension: compare "not a good case" with "slammed the door in her face"
- **Suggested component(s):**
  - `MatchingTask` — quote → technique + theme
  - `InteractiveCollectionExplorer` — Mrs Birling quote bank with AO2 and AO3 links
  - `ColSortBlock` — Mrs Birling's euphemism vs Inspector's direct language
  - `QuoteLadder` — simple meaning → method → dramatic irony → Priestley's purpose

### Section 5 — Exam Practice
- **Purpose:** Practise AQA whole-play writing on Mrs Birling, dramatic irony, social class and responsibility.
- **Proposed content:**
  - Format reminder: AIC is AQA Paper 2 Section A; one whole-play essay, no printed extract
  - Question: "How does Priestley present Mrs Birling in *An Inspector Calls*?"
  - Alternative question: "How does Priestley present social class in *An Inspector Calls*?"
  - Alternative question: "How does Priestley use dramatic irony in *An Inspector Calls*?"
  - Model paragraph: "girls of that class" → class noun phrase → Eva categorised before understood → AO3 deserving poor/charity gatekeeping → whole-play link to Inspector's final speech
  - Model paragraph: "make sure that he's compelled to confess in public" → dramatic irony → condemns Eric → exposes older-generation certainty
  - Guided write: student writes one paragraph using one Mrs Birling quote and one whole-play link to Eric/Inspector final speech
  - Examiner explains: Grade 7–9 move is to show Mrs Birling as institutional class prejudice, not just personal cruelty
- **Suggested component(s):**
  - `GuidedExamResponse` — paragraph scaffold on Mrs Birling/class prejudice
  - `FaceTheExaminer` — upgrade "Mrs Birling is mean" into institutional critique
  - `ExaminerExplainsScreen` — using dramatic irony without simply retelling Eric's reveal

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Retrieve Episodes 1–6 and set up Eric's reveal in Episode 8.
- **Proposed content:**
  - Retrieve Episode 4: Eva as worker and Birling's refusal of responsibility
  - Retrieve Episode 5: Sheila's moral vision and growing ability to see danger
  - Retrieve Episode 6: Daisy/Gerald and gender double standards
  - Whole-play link Episode 8: Eric is the father Mrs Birling condemns
  - Whole-play link Episode 9: Inspector's final speech corrects Mrs Birling's responsibility transfer
  - Whole-play link Episode 10: Mrs Birling remains among the least changed older-generation characters
  - Quick recall: What organisation? What name did Eva use? What phrase shows class prejudice? Who does Mrs Birling unknowingly condemn?
- **Suggested component(s):**
  - `QuickRecallScreen` — charity plot, quotes and dramatic irony
  - `MatchingTask` — Mrs Birling quote → later payoff
  - `RecoveryQuizPlayer` — deserving poor, father-only responsibility, charity hypocrisy, class language

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

### Fixed content gaps in this revision

- Added fuller Eva pregnancy/desperation context before the charity appeal.
- Added "I didn't like her manner", "a girl of that sort", and "claiming elaborate fine feelings and scruples" as high-value class/gender prejudice evidence.
- Strengthened "deserving poor" as charity gatekeeping rather than generic charity context.
- Added Sheila's alarm as structural foreshadowing before Eric's reveal.
- Strengthened the exact dramatic irony: Mrs Birling demands public responsibility from the unknown father, who is Eric.
- Added explicit AQA whole-play/no-extract paragraph practice.

---

## 4. Build recommendations

1. **Build the dramatic irony slowly:** Do not reveal Eric too early. Let Mrs Birling's responsibility-transfer logic trap her first.

2. **Section 3 — avoid history dump:** Deserving poor context is essential, but keep it tied to Eva: charity is conditional on moral approval by the powerful.

3. **Section 4 — prioritise language contrast:** Mrs Birling says "not a good case"; the Inspector says "slammed the door in her face". That contrast is the best AO2 route.

4. **Section 5 — institutional critique:** Weak answer: "Mrs Birling is horrible." Strong answer: Priestley uses Mrs Birling to criticise a class system where the rich control whether the poor are considered worthy of help.

5. **Whole-play link requirement:** Every paragraph should link to Eric's reveal, the Inspector's final speech, or Mrs Birling's Act 3 refusal to learn.

6. **Design:** Use charity ledger/door/committee table imagery. Keep it cold and respectable, not horror-themed. The point is polite cruelty.

---

## 10-point Module Completion Test

- [ ] Students can explain why Eva went to the charity
- [ ] Students can explain why Mrs Birling refused her
- [ ] Students can define deserving poor
- [ ] Students can analyse "girls of that class"
- [ ] Students can compare "not a good case" with "slammed the door in her face"
- [ ] Students can explain how Mrs Birling transfers responsibility to the father
- [ ] Students can explain the dramatic irony around Eric
- [ ] Students can link Mrs Birling to the older generation's refusal to learn
- [ ] Students have written or improved one AQA-style whole-play paragraph
- [ ] Students can avoid the weak answer "Mrs Birling is just evil" and explain institutional class prejudice
