# Episode 7: Blood will have blood — Architecture

## 1. Identity (brief)

- **Episode:** 7 of 12
- **Title:** Blood will have blood
- **Primary acts:** Act 2 Scenes 1 and 2
- **Build status:** Not yet built

Content, Storyline, Specification requirements and the full Content reference pack: see `07_Blood_Will_Have_Blood_Content.md` in this directory.

**Note:** Act 2.2 is the AQA November 2021 actual exam extract for the Macbeth/Lady Macbeth relationship question.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Surface existing knowledge; prime retrieval.
- **Proposed content:**
  - Retrieve from Episode 6: What is Macbeth's sole motive ("vaulting ambition")? What is the "False face" strategy?
  - Retrieve from Episode 5: What was Lady Macbeth's plan? ("Come, you spirits"; "Leave all the rest to me")
  - Hook question: "What do you think Macbeth will feel immediately after murdering Duncan?" (surfaces misconceptions)
  - True/false: "Macbeth is calm after the murder" / "Lady Macbeth committed the murder" / "The murder happens on stage"
- **Suggested components:**
  - `ChapterHookScreen` — true/false targeting offstage murder and guilt misconceptions
  - `PriorKnowledgeRecall` — retrieve Episode 6 quotes

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the scenes.
- **Proposed content:**
  - Act 2.1: Midnight; Banquo cannot sleep; Macbeth prepares; the dagger hallucination; "I go, and it is done"
  - The structural significance of the murder being offstage: the audience's imagination; the moral weight
  - Act 2.2: Macbeth returns with the daggers (wrong — he should have left them); Lady Macbeth takes charge
  - Macbeth's "Amen" moment; "Macbeth does murder sleep"; the Neptune speech
  - Lady Macbeth returns the daggers; "A little water clears us of this deed"
  - The knocking at the south gate; "To know my deed, 'twere best not know myself"
- **Suggested components:**
  - `VisualLearning` — cinematic sequence: dagger hallucination → murder offstage → Macbeth returns → "Amen" → Neptune → knocking
  - `ExplainReveal` — why the murder is offstage (Shakespeare's structural choice)

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and AO3 context.
- **Proposed content:**
  - Theme: Guilt — immediate; overwhelming; permanent; the murder damages Macbeth before the body is cold
  - Theme: Blood motif — blood as guilt introduced here; runs to 5.1
  - Theme: Sleep motif — sleep as God's gift; "Macbeth does murder sleep" = murders innocence itself
  - Theme: Conscience — Macbeth cannot say "Amen"; Macbeth feels spiritually cut off from God's blessing and forgiveness
  - Theme: Macbeth/Lady Macbeth relationship — the first role reversal; she is more capable of action; he is paralysed
  - Context: Jacobean religion — sin, damnation, God's mercy; Macbeth experiences the murder as spiritual rupture
  - Context: Sleep in Jacobean belief — God's restorative; murderers cannot sleep (a common belief)
- **Suggested components:**
  - `TheoryCompareBlock` — Macbeth's response vs Lady Macbeth's response to the same situation
  - `ExplainReveal` — blood as a theological symbol (guilt cannot be washed; it is permanent)
  - `ColSortBlock` — sort consequences: physical / psychological / spiritual / relational

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis — quote-rich episode.
- **Proposed content:**
  - **"Is this a dagger which I see before me?"**: AO2: rhetorical question; hallucination as dramatic technique; the repeated soft /s/ sounds create a whispering, uncertain rhythm; Macbeth seems to be testing reality as he speaks; "heat-oppressed brain" — Macbeth attempts rational explanation; ambiguity: real or psychological?
  - **"I could not say 'Amen'"**: AO2: brevity and simplicity; the gravity conveyed through what is *not* said; "could not" = inability, not unwillingness; spiritual severance
  - **"Macbeth does murder sleep"**: AO2: the voice as external conscience; the generalisation (not "murdered Duncan" but "murdered sleep" = murdered universal human peace); personification of sleep
  - **"Will all great Neptune's ocean wash this blood clean from my hand?"**: AO2: hyperbole (Neptune = the sea); "all great" maximises the scale; the ocean as an immense natural force that still cannot cleanse Macbeth's guilt; the implicit answer is "no" (confirmed in 5.1)
  - **"A little water clears us of this deed"**: AO2: contrast with the Neptune speech; the dismissal of blood's significance; dramatic irony (proven wrong in 5.1)
  - **"To know my deed, 'twere best not know myself"**: AO2: the paradox of self-knowledge; Macbeth knows that to fully understand what he has done would destroy his sense of self
  - PQAC: students analyse "Will all great Neptune's ocean wash this blood clean from my hand?" — connect to "A little water" (Lady Macbeth) and "Out, damned spot" (5.1)
- **Suggested components:**
  - `MatchingTask` — match quote to character to theme to 5.1 counterpart
  - `FillInTheBlanksBlock` — PQAC for "I could not say Amen" (spiritual context) and Neptune speech
  - `InteractiveCollectionExplorer` — browse blood motif quotes across the whole play

### Section 5 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness before the final exam-prep section.
- **Proposed content:**
  - Retrieve from Episode 6: What is Macbeth's "double trust"? How does the guilt here connect to what he already knew in the soliloquy?
  - Retrieve from Episode 5: Lady Macbeth invoked spirits to suppress her conscience; why does her dismissal of guilt in 2.2 prove this suppression is working (temporarily)?
  - Whole-play link: "A little water clears us of this deed" ↔ "Out, damned spot" (5.1)
  - Whole-play link: "Macbeth does murder sleep" ↔ Lady Macbeth's sleepwalking (5.1)
  - Quick quiz: 5 questions
- **Suggested components:**
  - `QuickRecallScreen` — 5 rapid-fire retrieval questions
  - `RecoveryQuizPlayer` — targeted recovery

### Section 6 — Exam Practice
- **Purpose:** Final AQA-style practice moment. The final navigation/progress dot must land on exam prep. This episode is the 2021 actual exam question.
- **Proposed content:**
  - **AQA Nov 2021 actual question:** "Starting with this conversation, explore how Shakespeare presents the relationship between Macbeth and Lady Macbeth." Extract: Act 2.2
  - Essay structure:
    1. Extract para 1: The contrast in language — Macbeth's fragmented, hallucinatory speech vs Lady Macbeth's imperatives ("Give me the daggers")
    2. Extract para 2: The role reversal — she is more capable of action; he is morally paralysed; "Infirm of purpose" echoes her Act 1.7 masculinity challenges
    3. Whole play para 1: Before this (Act 1.7) — she was in control; here she is managing; later (3.2–3.4) she loses control entirely
    4. Whole play para 2: Act 5.1 — her suppressed guilt returns; the "little water" she dismissed is now the source of obsessive sleepwalking
  - AQA Nov 2021 MS indicative content embedded
- **Suggested components:**
  - `GuidedExamResponse` — 4-paragraph structure with model opening sentences
  - `FaceTheExaminer` — students write the extract paragraph independently; see model

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway (the murder damages the murderers immediately and permanently) should be stated in Section 2 as part of the narrative teaching and reinforced in Section 6's essay structure. Students must understand that Act 2.2 is where guilt begins, not where it ends.

2. **Section 2 — teach the offstage murder as a structural decision:** Why does Shakespeare not show it? The question is exam-ready: the audience's imagination; the moral weight; the focus on Macbeth's psychological response rather than the act itself. This is AO2 (structural choice) + AO1 (character focus).

3. **Section 4 — the blood/water contrast is the episode's richest AO2 teaching moment:** The contrast between Macbeth's Neptune speech (blood is permanent, the ocean cannot cleanse it) and Lady Macbeth's "A little water" dismissal (blood is trivial, easily washed) is the irony that Act 5 resolves. This should be taught as a pair, with the 5.1 completion made explicit.

4. **Section 6 — use the actual 2021 past paper question:** The AQA Nov 2021 extract from 2.2 is an ideal exam practice vehicle. Use the mark scheme indicative content explicitly. The role reversal demonstrated in this scene (Lady Macbeth as capable manager; Macbeth as paralysed) is the AO2 move that reaches Level 4.

5. **The sleep motif must be tracked here and forward:** "Macbeth does murder sleep" is one of the most important motif moments in the play. Students should know it connects forward to Lady Macbeth's sleepwalking (5.1). The InteractiveCollectionExplorer browsing the blood/sleep motifs across the play is essential for building whole-play awareness.

6. **Soften religious certainty while keeping AO3 clear:** Teach Macbeth as feeling spiritually cut off from God's blessing and forgiveness; avoid absolute claims that he is outside God's mercy.

---

## 10-point Module Completion Test

- [ ] Students can narrate the episode's plot from memory (Section 2)
- [ ] Students can name and explain at least 2 themes from the episode (Section 3)
- [ ] Students can identify at least 1 key AO3 context point and link it to the text (Section 3)
- [ ] Students have actively retrieved at least 4 key quotes from the episode (Section 4)
- [ ] Students can analyse each key quote using Point → Quote → Analysis → Context (Section 4)
- [ ] Students can identify and name at least 2 language/structural techniques from the episode (Section 4)
- [ ] Students have retrieved content from at least one earlier episode (Section 5)
- [ ] Students have practised at least one AQA-style written response (Section 6)
- [ ] Students have been shown or produced a mark-scheme-aware paragraph (Section 6)
- [ ] The episode's core takeaway (how it contributes to the series throughline) has been stated and practised (Section 3 or 6)
