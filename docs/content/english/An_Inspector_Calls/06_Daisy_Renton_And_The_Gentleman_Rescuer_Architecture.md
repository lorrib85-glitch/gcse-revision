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
- **Purpose:** Retrieve Eva's chain so far and prime Gerald as morally complex, not simply good/bad.
- **Proposed content:**
  - True/false: "Gerald is innocent because he helped Eva" — TOO SIMPLE: help and exploitation can coexist
  - True/false: "Daisy Renton is a totally different person from Eva Smith" — FALSE: same woman, new survival identity
  - True/false: "Gerald is exactly the same as Mr Birling" — TOO SIMPLE: he is more emotionally complex but still protected by privilege
  - Recall Episode 1: engagement facade and Gerald as "well-bred young man-about-town"
  - Recall Episode 5: Eva leaves Milwards after Sheila's complaint; Sheila returns to this episode with clearer moral sight
  - Hook question: "Can a rescue still be exploitative?"
- **Suggested component(s):**
  - `ChapterHookScreen` — true/false on Gerald's innocence, Daisy/Eva identity and moral complexity
  - `PriorKnowledgeRecall` — Eva's chain: factory → Milwards → Palace bar
  - `MisconceptionCheck` — temporary help vs responsibility

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach Gerald's confession as a sequence: reaction to Daisy, Palace bar, rescue, dependency, affair, ending, Sheila's ring response.
- **Proposed content:**
  - Gerald reacts to the name "Daisy Renton" and gives himself away
  - Eva has changed identity after losing factory and shop work
  - Gerald meets Daisy at the Palace bar, a risky male space associated with sexual/economic vulnerability
  - Gerald describes her as "young and fresh and charming" — Daisy through his gaze
  - He helps her leave immediate danger and places her in rooms at Morgan Terrace
  - Daisy becomes emotionally and financially dependent: "I became at once the most important person in her life"
  - Relationship becomes sexual/socially unequal: "She became my mistress" / "kept her"
  - Gerald ends the relationship in autumn and gives her money to "go on for a while"
  - Sheila's response: she respects his honesty but returns/refuses the ring — the engagement facade is broken
  - Act 3 forward link: Gerald returns with hoax evidence and says "everything's all right now, Sheila"
- **Suggested component(s):**
  - `VisualNarrativeScreen` — sequence: Daisy name → Palace bar → Morgan Terrace → mistress/kept → ending → ring refusal → Act 3 return
  - `ConceptReveal` — power imbalance: money + housing + status vs vulnerability
  - `TimelineChain` — Eva's chain: factory → Milwards → Daisy Renton → Gerald → Eric

### Section 3 — Theme & Context
- **Purpose:** Connect Gerald/Daisy to gender double standards, class power, male privilege, responsibility and Sheila's clearer vision.
- **Proposed content:**
  - Theme: gender inequality — men can have affairs with limited social damage; women risk ruin
  - Theme: class power — Gerald has old-money respectability, money and housing; Daisy has dependence
  - Theme: exploitation disguised as kindness — the rescue is real but temporary and unequal
  - Theme: appearance vs reality — gentlemanly charm hides structural power
  - Theme: responsibility — Gerald wants credit for kindness but must still face consequences
  - Theme: Sheila's change — she sees through the Fairy Prince narrative and refuses to resume the old engagement immediately
  - AO3: Edwardian double standards — mistress/fallen woman stigma lands on the woman
  - AO3: old money/status — Gerald's family protects him in ways Eva/Daisy can never access
  - AO3: 1945 audience — Priestley's audience is invited to question respectable male privilege
- **Suggested component(s):**
  - `TheoryCompareBlock` — Gerald's self-image: rescuer/gentleman vs reality: temporary support/power imbalance
  - `ExplainReveal` — gender double standard: what happens to a man vs what happens to a woman
  - `ColSortBlock` — sort evidence into help / exploitation / self-protection / Sheila's clarity
  - `SwipeSort` — sympathetic evidence vs critical evidence about Gerald

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis of Gerald/Daisy quotes with nuanced judgement.
- **Proposed content:**
  - **"Daisy Renton"** — AO2: name-change as survival identity; Eva becomes whatever society forces her to become
  - **"well-bred young man-about-town"** — AO2: class charm and social ease; respectable masculine image
  - **"young and fresh and charming"** — AO2: male gaze/objectification; Daisy aestheticised through Gerald's description
  - **"I didn't feel about her as she felt about me"** — AO2: emotional imbalance; honesty but also unequal feeling
  - **"I became at once the most important person in her life"** — AO2: superlative/importance shows dependence and power
  - **"She became my mistress"** — AO2/AO3: blunt admission of sexual/social status and gendered vulnerability
  - **"kept her"** — AO2: euphemism; financial support disguised as softer language
  - **"the wonderful Fairy Prince"** — AO2: Sheila's irony; punctures Gerald's rescue story
  - **"I rather respect you more than I've ever done before"** — AO2: nuanced Sheila response; honesty matters but does not erase harm
  - **"No, not yet. It's too soon"** — AO2: ring refusal; changed standards and broken engagement facade
  - **"everything's all right now, Sheila"** — AO2: Act 3 regression; procedural doubt used as moral escape
  - PQAC: analyse "kept her" as euphemism and power imbalance
  - PQAC extension: analyse "Fairy Prince" as Sheila's critique of Gerald's self-image
- **Suggested component(s):**
  - `MatchingTask` — match quote to theme: gender / class / self-protection / Sheila's clarity
  - `InteractiveCollectionExplorer` — Gerald quote bank with nuanced evidence for/against sympathy
  - `ColSortBlock` — sympathetic Gerald evidence vs critical Gerald evidence
  - `QuoteLadder` — simple meaning → method → context → balanced judgement

### Section 5 — Exam Practice
- **Purpose:** Practise AQA whole-play writing on Gerald, gender inequality and nuanced judgement.
- **Proposed content:**
  - Format reminder: AIC is AQA Paper 2 Section A; one whole-play essay, no printed extract
  - Question: "How does Priestley present Gerald Croft in *An Inspector Calls*?"
  - Alternative question: "How does Priestley present gender inequality in *An Inspector Calls*?"
  - Alternative question: "How does Priestley present Eva Smith/Daisy Renton as a victim of society?"
  - Model paragraph: "kept her" → euphemism → power imbalance → AO3 mistress/fallen woman double standard → whole-play link to Eric's later exploitation and Gerald's Act 3 regression
  - Model paragraph: "Fairy Prince" → Sheila's irony → she sees through rescue narrative → whole-play link to Sheila's changed standards
  - Guided write: student writes one balanced paragraph: Gerald helped Eva, but Priestley still critiques the power structure
  - Examiner explains: Grade 7–9 move is both/and judgement, not either/or
- **Suggested component(s):**
  - `GuidedExamResponse` — balanced Gerald paragraph scaffold
  - `ExaminerExplainsScreen` — how to handle nuanced characters without fence-sitting
  - `FaceTheExaminer` — upgrade "Gerald was nice to Eva" into a paragraph about gender/class power

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Retrieve Episodes 1–5 and build forward links to Eric and Act 3.
- **Proposed content:**
  - Retrieve Episode 1: engagement facade and Croft/Birling status alliance
  - Retrieve Episode 5: Sheila returns/refuses ring after Gerald's confession; contrast with opening excitement
  - Whole-play link Episode 8: Eric's exploitation is more obviously abusive, but Gerald prepares the gender-power theme
  - Whole-play link Episode 9: Inspector's "millions and millions" speech turns Daisy from individual case into social pattern
  - Whole-play link Episode 10: Gerald's Act 3 return shows relief and self-protection rather than sustained responsibility
  - Quick recall: Where did Gerald meet Daisy? Where did he house her? What word describes their relationship? What does Sheila do with the ring?
- **Suggested component(s):**
  - `QuickRecallScreen` — Gerald/Daisy timeline and quote completion
  - `MatchingTask` — Gerald event → theme → later whole-play link
  - `RecoveryQuizPlayer` — misconceptions around rescue, exploitation, Daisy/Eva identity and gender double standards

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

### Fixed content gaps in this revision

- Added clearer Croft/old-money status and why that protects Gerald.
- Strengthened Daisy Renton as survival identity rather than a separate person.
- Added Palace bar as risky gender/class setting.
- Added Gerald's emotional imbalance quotes: "I didn't feel about her as she felt about me" and "most important person in her life".
- Added clearer mistress/kept woman context and ring symbolism.
- Strengthened Sheila's response as nuanced: she respects honesty but refuses to reset the engagement.
- Strengthened Gerald's Act 3 regression through "everything's all right now, Sheila".
- Added explicit AQA whole-play/no-extract paragraph practice.

---

## 4. Build recommendations

1. **Nuance over simplicity:** This is one of the most morally complex chapters. Keep the both/and line: Gerald helps Daisy and exploits her vulnerability.

2. **Section 2 — make power visible:** The learner needs to see that money, housing and respectability are not neutral. They create dependency.

3. **Section 3 — AO3 must be specific:** Do not just say "women had fewer rights". Say: in 1912, a man's affair might be socially tolerated, while the woman could be labelled fallen and lose respectability.

4. **Section 4 — prioritise "kept her":** This is the central AO2 quote because the euphemism hides the power imbalance.

5. **Section 5 — teach balanced judgement:** The weak paragraph says either "Gerald is kind" or "Gerald is evil". The stronger paragraph says Priestley uses Gerald to show exploitation can look civilised.

6. **Design:** Avoid making this romantic. Use a dark, elegant but uneasy tone: Palace bar shadows, private room key/Morgan Terrace motif, ring returned. No glamorous affair aesthetic.

---

## 10-point Module Completion Test

- [ ] Students can explain why Eva becomes Daisy Renton
- [ ] Students can describe the Palace bar and why it matters
- [ ] Students can explain how Gerald helped Daisy
- [ ] Students can explain how Gerald exploited Daisy's vulnerability
- [ ] Students can analyse "kept her" as euphemism
- [ ] Students can analyse "Fairy Prince" as irony
- [ ] Students can explain gender double standards in 1912
- [ ] Students can link Gerald to Sheila's change and Eric's later exploitation
- [ ] Students have written or improved one balanced AQA-style paragraph
- [ ] Students can avoid both weak extremes: "Gerald is nice" / "Gerald is evil"
