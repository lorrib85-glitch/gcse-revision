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
- **Purpose:** Retrieve Eva's chain and Mrs Birling's dramatic irony; prime Eric as guilty but remorseful.
- **Proposed content:**
  - True/false: "Eric's drinking excuses what he did" — FALSE: it explains context but does not excuse exploitation
  - True/false: "Eric is just like his father" — TOO SIMPLE: both cause harm, but Eric shows remorse and shared responsibility
  - True/false: "The stolen money is the main problem" — FALSE: Arthur thinks this, but Priestley shows moral harm matters more
  - Recall Episode 1: Eric was "not quite at ease, half shy, half assertive"
  - Recall Episode 7: Mrs Birling condemned the unknown father; Sheila realised the danger before Sybil did
  - Recall Eva's chain so far: factory → Milwards → Gerald/Daisy → Eric → charity
  - Hook question: "Can someone be guilty and still be more capable of change than the people judging them?"
- **Suggested component(s):**
  - `ChapterHookScreen` — true/false on drunkenness, Eric vs Arthur and money vs morality
  - `PriorKnowledgeRecall` — complete Eva's chain and retrieve Mrs Birling's father-responsibility line
  - `MisconceptionCheck` — guilty vs remorseful vs excused

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach Eric's confession as the final link in the chain, with mature handling of sexual exploitation and clear focus on responsibility.
- **Proposed content:**
  - Eric returns; Mrs Birling's dramatic irony becomes reality
  - Eric's Act 1 unease and two years of drinking are reinterpreted as warning signs
  - Eric explains the encounter with Eva carefully using the text: "she didn't want me to go in" and "a chap easily turns nasty"
  - Safeguarding tone: name this as sexual exploitation/abuse of vulnerability; do not graphicise or linger
  - Eva becomes pregnant; Eric attempts to help by giving money
  - Eric stole around fifty pounds from his father's office
  - Eva refuses the money when she discovers it was stolen — her moral integrity matters
  - Eva approaches Mrs Birling's charity after refusing stolen money
  - Eric confronts Mrs Birling: "you killed them both"
  - Arthur focuses on the stolen money; Eric says "the money's not the important thing"
  - Eric accepts shared responsibility: "we did her in all right"
- **Suggested component(s):**
  - `VisualNarrativeScreen` — sequence: Eric returns → confession → pregnancy → stolen money → Eva refuses → charity refusal → parental confrontation
  - `ConceptReveal` — guilty but remorseful: harm is not erased, but moral recognition matters
  - `TimelineChain` — complete Eva's chain: factory → Milwards → Gerald → Eric → charity → death
  - `ExplainReveal` — Eva's moral integrity: she refuses stolen money even in desperation

### Section 3 — Theme & Context
- **Purpose:** Connect Eric to gender inequality, Edwardian masculinity, family failure, Eva's integrity, responsibility and young/old contrast.
- **Proposed content:**
  - Theme: gender inequality — male entitlement and sexual double standards harm Eva
  - Theme: family failure — Eric cannot go to Arthur when in trouble; problems are hidden not addressed
  - Theme: young vs old — Eric and Sheila are guilty but remorseful; Arthur/Sybil deny and deflect
  - Theme: responsibility — Eric understands "we" responsibility before his parents do
  - Theme: money vs morality — Arthur focuses on theft; Eric focuses on death and consequence
  - Theme: Eva's integrity — she refuses stolen money, complicating the idea of passive victimhood
  - AO3: Edwardian masculinity — drinking, male entitlement and emotional repression could be normalised
  - AO3: sexual double standards — men protected by reputation; women bear social/economic consequences
  - AO3: patriarchal family structure — sons may be financially supported but emotionally unsupported
  - AO3: Priestley's 1945 purpose — younger generation as potential moral change, but not innocence
- **Suggested component(s):**
  - `SwipeSort` — guilty but remorseful / guilty and denying / not guilty but morally aware
  - `TheoryCompareBlock` — Eric vs Arthur: money/reputation vs moral consequence
  - `ExplainReveal` — Edwardian masculinity without excusing Eric
  - `ColSortBlock` — Eric evidence into exploitation / remorse / family failure / Eva integrity

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis of Eric quotes with mature, precise language.
- **Proposed content:**
  - **"not quite at ease, half shy, half assertive"** — AO2: stage direction plants instability early
  - **"steadily drinking too much for the last two years"** — AO2: adverb "steadily" suggests ongoing ignored problem
  - **"she didn't want me to go in"** — AO2: direct clarity; lack of consent must be recognised
  - **"I was in that state when a chap easily turns nasty"** — AO2: euphemistic/colloquial confession; "chap" generalises male entitlement
  - **"you're not the kind of father a chap could go to"** — AO2: direct accusation; family failure and emotional distance
  - **"my child"** — AO2: possessive pronoun accepts connection/responsibility
  - **"you killed them both"** — AO2: blunt accusation; "both" includes Eva and unborn child
  - **"the money's not the important thing"** — AO2: moral priority over financial scandal
  - **"we did her in all right"** — AO2: collective pronoun; shared responsibility; colloquial bluntness
  - PQAC: analyse "you're not the kind of father a chap could go to" as family failure
  - PQAC extension: analyse "we did her in all right" as shared responsibility and the completed chain
- **Suggested component(s):**
  - `MatchingTask` — quote → theme: exploitation / family failure / remorse / responsibility / Eva's integrity
  - `FillInTheBlanksBlock` — paragraph scaffold with careful language for sensitive material
  - `InteractiveCollectionExplorer` — Eric quote bank with technique, effect, context and whole-play use
  - `QuoteLadder` — simple meaning → method → moral judgement → Priestley's purpose

### Section 5 — Exam Practice
- **Purpose:** Practise AQA whole-play writing on Eric, family, young/old and responsibility.
- **Proposed content:**
  - Format reminder: AIC is AQA Paper 2 Section A; one whole-play essay, no printed extract
  - Question: "How does Priestley present Eric Birling in *An Inspector Calls*?"
  - Alternative question: "How does Priestley present family relationships in *An Inspector Calls*?"
  - Alternative question: "How does Priestley present the younger generation?"
  - Model paragraph: "you're not the kind of father a chap could go to" → direct accusation → family failure → AO3 patriarchal/emotional repression → whole-play link to Birling's reputation/money response
  - Model paragraph: "we did her in all right" → collective pronoun → shared responsibility → link to Inspector's final speech
  - Guided write: student writes one paragraph showing Eric as guilty but remorseful
  - Examiner explains: Grade 7–9 move is to avoid both excuses and simplification
  - Safe essay language: use terms like "sexual exploitation", "abuse of vulnerability", "lack of consent"; avoid graphic expansion
- **Suggested component(s):**
  - `GuidedExamResponse` — balanced Eric paragraph scaffold
  - `ExaminerExplainsScreen` — how to handle sensitive content maturely in GCSE writing
  - `FaceTheExaminer` — upgrade "Eric is bad but sorry" into a nuanced argument about guilt, remorse and family failure

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Retrieve Episodes 1–7, complete the chain, and prepare for the Inspector's final speech.
- **Proposed content:**
  - Retrieve Episode 1: Eric's opening unease
  - Retrieve Episode 6: Gerald's exploitation as a comparison point
  - Retrieve Episode 7: Mrs Birling condemns the father before knowing it is Eric
  - Whole-play link Episode 9: Inspector's final speech explains the chain as social responsibility
  - Whole-play link Episode 10: Eric and Sheila remain changed when parents/Gerald seek a hoax escape
  - Quick recall: What did Eric do? What does Eva refuse? What does Eric say to Arthur? What does "we" show?
- **Suggested component(s):**
  - `QuickRecallScreen` — complete chain and quote recall
  - `MatchingTask` — Eric quote → whole-play link
  - `RecoveryQuizPlayer` — misconceptions around drinking, money, remorse, Eva's integrity and shared responsibility

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

### Fixed content gaps in this revision

- Added safer, clearer guidance on handling sexual exploitation: explicit but not graphic.
- Added "she didn't want me to go in" as essential consent evidence.
- Strengthened Eric as guilty but remorseful, not excused or redeemed.
- Strengthened Eva's integrity through her refusal of stolen money.
- Added "we did her in all right" as a key shared-responsibility quote.
- Strengthened family failure through "you're not the kind of father a chap could go to".
- Added explicit AQA whole-play/no-extract paragraph practice and safe essay wording.

---

## 4. Build recommendations

1. **Handle the sexual exploitation maturely:** Name it. Use the textual evidence. Do not sensationalise. Keep the focus on responsibility and Priestley's critique of male entitlement.

2. **Do not excuse Eric:** Drunkenness is context, not defence. The module must be clear on that.

3. **Do not flatten Eric:** He is guilty, but he is also remorseful and morally clearer than his parents by the end. That complexity is the exam value.

4. **Centre family failure:** "You're not the kind of father a chap could go to" should be the centrepiece quote for family relationships.

5. **Centre the completed chain:** This is the point where the whole chain becomes visible. Prepare for Episode 9's final speech.

6. **Design:** Keep tone serious and restrained. No melodrama. Use fractured family portrait / ledger / chain motif; avoid graphic or sensational visuals.

---

## 10-point Module Completion Test

- [ ] Students can explain Eric's role in Eva's chain
- [ ] Students can explain why drunkenness does not excuse Eric
- [ ] Students can discuss the encounter using mature, non-graphic language
- [ ] Students can explain Eva's refusal of stolen money as moral integrity
- [ ] Students can analyse "you're not the kind of father a chap could go to"
- [ ] Students can analyse "the money's not the important thing"
- [ ] Students can analyse "we did her in all right"
- [ ] Students can compare Eric's remorse with Arthur/Sybil's denial
- [ ] Students have written or improved one AQA-style whole-play paragraph
- [ ] Students can avoid weak extremes: "Eric is excused" / "Eric is just evil"
