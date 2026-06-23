# Episode 12: Out, damned spot — Architecture

## 1. Identity (brief)

- **Episode:** 12 of 12
- **Title:** Out, damned spot
- **Primary acts:** Act 5 Scenes 1, 3, 5, 8 and 9
- **Build status:** Not yet built

Content, Storyline, Specification requirements and the full Content reference pack: see `12_Out_Damned_Spot_Content.md` in this directory.

**Note:** Act 5 Scene 3 is the AQA June 2023 actual exam extract for the Macbeth as changing male character question. This episode is the final synthesis of the entire series.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Surface existing knowledge; prime retrieval.
- **Proposed content:**
  - Retrieve from Episode 7: What is the blood motif? What does "A little water clears us of this deed" mean? (the dramatic irony completes here in 5.1)
  - Retrieve from Episode 7: What is the sleep motif? "Macbeth does murder sleep" — how does this predict Lady Macbeth's sleepwalking?
  - Retrieve from Episode 5: What did Lady Macbeth invoke the spirits to do in 1.5? ("Take my milk for gall") — how does this connect to "Out, damned spot"?
  - Hook: "If you couldn't stop thinking about something you'd done wrong, what would eventually happen to you?" (primes the sleepwalking scene and the failure of suppression)
  - True/false: "Lady Macbeth feels no guilt throughout the play" / "The 'Tomorrow' speech shows Macbeth is grieving for Lady Macbeth" / "Macbeth dies in battle"
- **Suggested components:**
  - `ChapterHookScreen` — true/false targeting the guilt misconception, the "Tomorrow" nihilism vs grief misconception, and Macbeth's death
  - `PriorKnowledgeRecall` — retrieve blood/sleep motif quotes from Episodes 5 and 7; surface the series throughline before the final episode

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens across the Act 5 scenes.
- **Proposed content:**
  - Act 5.1: Lady Macbeth's sleepwalking; the Doctor and Gentlewoman witness it; she relives the murder, references Duncan, Banquo and Lady Macduff; "Out, damned spot"; "Here's the smell of the blood still"; "all the perfumes of Arabia will not sweeten this little hand"; the Doctor's verdict: "More needs she the divine than the physician"
  - Act 5.3: Macbeth at Dunsinane; defiant posture; "I am sick at heart"; "My way of life / Is fall'n into the sere, the yellow leaf"; asks the Doctor to minister to Lady Macbeth's "mind diseased"
  - Act 5.4–5: Birnam Wood begins to move (soldiers carry branches); Lady Macbeth's death reported; the "Tomorrow" speech; nihilism, not grief
  - Act 5.8: Macbeth meets Macduff; the equivocation revealed ("Macduff was from his mother's womb / Untimely ripped"); Macbeth's response is exhausted recognition, not terror; "Yet I will try the last" — he chooses to fight
  - Act 5.9: Malcolm's closing speech and restoration; "this dead butcher and his fiend-like queen" — the official verdict; the Great Chain of Being restored
  - Dramatic structure: the parallel collapses — Lady Macbeth (private guilt → public sleepwalking → death) and Macbeth (false bravado → nihilism → final soldier's death)
- **Suggested components:**
  - `VisualNarrativeScreen` — sequence: sleepwalking scene → Dunsinane defiance → "Tomorrow" speech → Birnam Wood moves → Macduff's revelation → Macbeth's death → restoration
  - `ExplainReveal` — the parallel arc: Lady Macbeth (suppressed guilt returns; she dies) / Macbeth (guilt hollowed into nihilism; he chooses death as a soldier)

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and complete the series arcs.
- **Proposed content:**
  - Theme: Guilt (completion) — Lady Macbeth's sleepwalking is the return of everything she suppressed from 1.5 onwards; "Out, damned spot" completes the blood motif and the dramatic irony of "A little water"; Macbeth's guilt has been emptied into nihilism
  - Theme: Ambition (completion) — "Tomorrow, and tomorrow, and tomorrow" is the endpoint of the ambition arc; achieving the crown brought not fulfilment but meaninglessness
  - Theme: Supernatural (completion) — the equivocal prophecies fulfil; "Birnam Wood" and "none of woman born" resolve; the witches' trap closes
  - Theme: Natural order restored — Malcolm's kingship restores the Great Chain of Being; the disruption that began with Duncan's murder ends with legitimate succession
  - Theme: Appearance vs reality (completion) — Macbeth's performance of bravery in Act 5 is as hollow as his performance of loyalty in Act 1; "I am sick at heart" undermines the military bravado
  - Context: Tragic form and catharsis (AO3) — Aristotelian catharsis: the audience's pity and fear are purged at the tragic ending; clarity about the consequences of ambition replaces the tension of watching the play
  - Context: Divine justice (AO3) — the restoration of Malcolm's legitimate kingship is the Jacobean God's justice; Macbeth's death is not just defeat but moral consequence; the play's moral framework is completed
  - Context: Malcolm's verdict as political simplification (AO3) — "this dead butcher and his fiend-like queen" is the official restoration narrative; high-level AQA answers identify the gap between this reductive verdict and the complexity Shakespeare has shown
- **Suggested components:**
  - `ExplainReveal` — the full arc of the blood motif: from "this is a sorry sight" (2.2) through "Out, damned spot" (5.1) — how the motif completes; dramatic irony of "A little water" finally resolved
  - `TheoryCompareBlock` — Malcolm's verdict ("this dead butcher and his fiend-like queen") vs what Shakespeare actually shows; why the gap between the verdict and the play's complexity is the highest-level analytical move
  - `ColSortBlock` — sort Act 5's events: what restores order / what shows each character's arc completing / what proves the equivocations were traps

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Final retrieval of the play's most important quotes — synthesis and motif completion.
- **Proposed content:**
  - **"Out, damned spot! out, I say!"**: AO2: the imperative directed at an imaginary spot; the word "damned" invokes theological damnation — she is in hell before she dies; technique: dramatic irony (she told Macbeth blood could be washed easily); whole-play link: completes the blood motif from Episodes 7 and 10
  - **"All the perfumes of Arabia will not sweeten this little hand"**: AO2: the hyperbolic scale of "all the perfumes of Arabia" contrasts with the smallness ("little hand") of the person who cannot escape; technique: hyperbole; contrast (scale vs smallness); whole-play link: completes the Neptune speech dramatic irony (both Macbeth and Lady Macbeth reach the same conclusion — blood cannot be cleansed)
  - **"Tomorrow, and tomorrow, and tomorrow / Creeps in this petty pace from day to day"**: AO2: the triple repetition of "tomorrow" mimics the endless sameness of time; "creeps" is both slow and low; "petty" is contemptible smallness; technique: repetition (anaphora); personification of time; nihilism as conclusion, not grief
  - **"Life's but a walking shadow, a poor player / That struts and frets his hour upon the stage / And then is heard no more"**: AO2: the theatrical metaphor; a "walking shadow" has no substance; "struts and frets" implies pompous anxiety — performing authority without having it; technique: extended metaphor; self-referential (Macbeth is himself a theatrical character); whole-play link: the performance metaphor echoes "False face" (1.7) — performance has been his mode throughout
  - **"My way of life / Is fall'n into the sere, the yellow leaf"**: AO2: autumn imagery; "sere" = dried up; the natural metaphor for moral decay; technique: nature imagery; contrast with Duncan's "plant thee" (1.4) — the cultivation language has become the language of autumn and withering
  - **"This dead butcher and his fiend-like queen"**: AO2: the reductive summary; the noun "butcher" strips Macbeth of complexity; technique: pejorative noun; politically necessary simplification; whole-play link: contrast with Duncan's description of Macbeth as "valiant cousin" (1.2) — the full arc in two phrases
  - PQAC: students analyse "Tomorrow, and tomorrow, and tomorrow" — how does Shakespeare use the theatrical metaphor to present nihilism?
- **Suggested components:**
  - `MatchingTask` — match Act 5 quotes to their Act 1/2 counterparts (motif completion pairs: "A little water" / "Out, damned spot"; "Neptune's ocean" / "all the perfumes of Arabia"; "plant thee" / "yellow leaf"; "valiant cousin" / "dead butcher")
  - `FillInTheBlanksBlock` — PQAC for "Tomorrow, and tomorrow, and tomorrow" and "Out, damned spot"
  - `InteractiveCollectionExplorer` — browse the full motif completion (blood, sleep, guilt, ambition) across the play

### Section 5 — Exam Practice
- **Purpose:** AQA-style practice — this episode contains the AQA Jun 2023 actual exam question.
- **Proposed content:**
  - **AQA Jun 2023 actual question:** "Starting with this conversation, explore how far Shakespeare presents Macbeth as a male character who changes during the play." Extract: Act 5 Scene 3
  - Full essay structure:
    1. Extract para 1: "I am sick at heart" and "My way of life / Is fall'n into the sere, the yellow leaf" — Macbeth in 5.3 is defeated, diminished; the language of sickness and autumn replaces the language of military action
    2. Extract para 2: "Canst thou not minister to a mind diseased" — displacement; he projects his own psychological state onto Lady Macbeth; this reveals his refusal to confront his own condition
    3. Whole play para 1 (change from the beginning): Act 1.7 — he had a full moral vocabulary ("He's here in double trust"); the precision of his moral reasoning has been entirely eroded by Act 5
    4. Whole play para 2 (change across Act 5): "Yet I will try the last" — despite the nihilism, he chooses to die as a soldier; this is both his most morally complex Act 5 moment and a symmetry with Act 1 (he began as a soldier; he ends as one)
  - AQA Jun 2023 indicative content embedded:
    - AO1: "comments on Macbeth in the extract, eg his despair"; "details about Macbeth at the end of the play"
    - AO2: "language used to present Macbeth's despair at this point"; "use of soliloquies to reveal Macbeth's character/inner thoughts"
    - AO3: "Macbeth's use of violence in the context of war/to fulfil his ambition"; "Macbeth's attitude to religious issues at different points"; "kingship and expectations thereof"
  - SPaG: sentence structures for analysis; whole-play connective phrases ("By contrast, in Act 1..."; "Shakespeare traces this change through...")
- **Suggested components:**
  - `GuidedExamResponse` — full 4-paragraph structure with model opening sentences for the Jun 2023 question
  - `FaceTheExaminer` — students write the extract paragraph independently; compare with model; self-assess using the AO1/AO2/AO3 criteria
  - `ExaminerExplainsScreen` — the highest-level move on this question: identifying the gap between Malcolm's verdict and Shakespeare's complexity; why students who do this reach Level 5/6

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Synthesis and retrieval of the whole series — this is the final episode.
- **Proposed content:**
  - Retrieve from Episode 5: What did Lady Macbeth invoke the spirits to do? How does "Take my milk for gall" (1.5) connect to "Out, damned spot" (5.1)?
  - Retrieve from Episode 7: "A little water clears us of this deed" (2.2) — dramatic irony completed in 5.1; "Macbeth does murder sleep" — Lady Macbeth's sleepwalking
  - Retrieve from Episode 9: "To be thus is nothing" (3.1) — how does this connect to "Tomorrow, and tomorrow, and tomorrow" (5.5)?
  - Retrieve from Episode 11: "None of woman born" — how does 4.1 equivocation resolve in 5.8?
  - Whole-play arc summary: Every theme completes in Act 5; students should be able to state the endpoint of each major arc (guilt / ambition / supernatural / natural order / masculinity) in one sentence each
  - Quick quiz: 5 questions — series-synthesis retrieval (covers the whole play)
- **Suggested components:**
  - `QuickRecallScreen` — 5 rapid-fire questions spanning the whole play (not just Act 5)
  - `RecoveryQuizPlayer` — targeted recovery for any gaps in the whole-series synthesis

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway (every arc completes in Act 5; both characters get the ending their choices have earned; Malcolm's verdict understates what Shakespeare has shown) must be stated explicitly in Section 2 and modelled in Section 5. Students leaving Episode 12 should be able to state the endpoint of every major theme in one sentence.

2. **Section 2 — the parallel collapses must be taught as structural design:** Lady Macbeth's arc (suppression → sleepwalking → death) and Macbeth's arc (bravado → nihilism → soldier's death) are two separate trajectories that begin at the same point (Duncan's murder) and end separately. The VisualNarrativeScreen should make this structural parallelism visible.

3. **Section 4 — the motif completion pairs are the episode's richest AO2 teaching moments:** "A little water" / "Out, damned spot"; Neptune speech / "all the perfumes of Arabia"; "plant thee" / "yellow leaf"; "valiant cousin" / "dead butcher" — these pairs allow students to demonstrate the highest-level whole-play AO2 analysis. The MatchingTask should build these pairs explicitly so students learn them as units.

4. **Section 5 — use the AQA Jun 2023 actual exam question and extract:** Act 5.3 is the most recent available AQA exam extract for Macbeth. The indicative content from the June 2023 mark scheme should be embedded in the GuidedExamResponse. Students who identify "My way of life / Is fall'n into the sere, the yellow leaf" as a key image from the extract and connect it to the agricultural language of Act 1 ("plant thee") are producing Level 4+ AO2 analysis.

5. **Section 5 — teach the Malcolm verdict move explicitly:** The highest-level analytical move on any Act 5 question is to acknowledge Malcolm's verdict ("this dead butcher and his fiend-like queen") while demonstrating that Shakespeare has shown something far more complex. The ExaminerExplainsScreen should name this as the Level 5/6 distinction and give students the language to make it ("While Malcolm's verdict is politically necessary to restore order, Shakespeare has presented...").

6. **Section 6 — this is the synthesis retrieval episode:** The QuickRecallScreen in Episode 12 should span the whole play, not just Act 5. Students who leave Episode 12 unable to retrieve key quotes from Episodes 1–11 have not consolidated the series. The 5-question retrieval should pull from across the arc.

---

## 10-point Module Completion Test

- [ ] Students can narrate the episode's plot from memory (Section 2)
- [ ] Students can name and explain at least 2 themes from the episode (Section 3)
- [ ] Students can identify at least 1 key AO3 context point and link it to the text (Section 3)
- [ ] Students have actively retrieved at least 4 key quotes from the episode (Section 4)
- [ ] Students can analyse each key quote using Point → Quote → Analysis → Context (Section 4)
- [ ] Students can identify and name at least 2 language/structural techniques from the episode (Section 4)
- [ ] Students have practised at least one AQA-style written response (Section 5)
- [ ] Students have been shown or produced a mark-scheme-aware paragraph (Section 5)
- [ ] Students have retrieved content from at least one earlier episode (Section 6)
- [ ] The episode's core takeaway (how it contributes to the series throughline) has been stated and practised (Section 3 or 5)
