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
  - Retrieve from Episode 7: What is the blood motif? What does "A little water clears us of this deed" mean? How does the dramatic irony complete in 5.1?
  - Retrieve from Episode 7: What is the sleep motif? "Macbeth does murder sleep" — how does this predict Lady Macbeth's sleepwalking?
  - Retrieve from Episode 5: What did Lady Macbeth invoke the spirits to do in 1.5? How does this connect to "Out, damned spot"?
  - Retrieve from Episode 10: What does "I am in blood" reveal about Macbeth's belief that return is impossible?
  - Retrieve from Episode 11: What does equivocation mean? How do "Birnam Wood" and "none of woman born" resolve in Act 5?
  - Hook: "What if getting everything you wanted left you with nothing?" This primes the final ambition arc from crown to emptiness.
  - True/false: "Lady Macbeth feels no guilt throughout the play" / "The 'Tomorrow' speech is mainly Macbeth grieving for Lady Macbeth" / "Macbeth is redeemed because he dies fighting" / "Malcolm's final verdict is the whole truth about Macbeth and Lady Macbeth"
- **Suggested components:**
  - `ChapterHookScreen` — true/false targeting guilt, nihilism, redemption and Malcolm verdict misconceptions
  - `PriorKnowledgeRecall` — retrieve blood/sleep motif quotes, equivocation and Macbeth's Act 3–4 blood-cycle logic
  - `MisconceptionCheck` — Macbeth's final courage is complex, not full redemption

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens across the Act 5 scenes.
- **Proposed content:**
  - Act 5.1: Lady Macbeth sleepwalks; the Doctor and Gentlewoman witness it; she relives Duncan's murder and references Banquo and Lady Macduff
  - Act 5.1: Key sleepwalking quotes: "Out, damned spot", "Yet who would have thought the old man to have had so much blood in him?", "The Thane of Fife had a wife", "What, will these hands ne'er be clean?", "All the perfumes of Arabia"
  - Act 5.1: Doctor's verdict: "More needs she the divine than the physician" — her condition is spiritual/psychological, not physically curable
  - Act 5.2: Scottish nobles describe Macbeth's rule through sickness/medicine imagery; this prepares the Act 5.3 extract
  - Act 5.3: Macbeth at Dunsinane; defiant posture but inward collapse: "I am sick at heart", "My way of life / Is fall'n into the sere, the yellow leaf", "Honour, love, obedience... I must not look to have"
  - Act 5.3: Macbeth asks the Doctor to "minister to a mind diseased" and then rejects medicine when it cannot cure moral/spiritual disorder
  - Act 5.4–5: Malcolm's army camouflages with Birnam Wood branches; Lady Macbeth's death is reported; Macbeth gives the "Tomorrow" speech
  - Act 5.8: Macbeth meets Macduff; clings to "I bear a charmed life"; learns the equivocation about "none of woman born"; refuses to yield and chooses to fight
  - Act 5.9: Macduff announces "The time is free"; Malcolm's closing speech restores order; "this dead butcher and his fiend-like queen" gives the official verdict
  - Dramatic structure: parallel collapses — Lady Macbeth (suppression → sleepwalking → death) and Macbeth (false bravado → nihilism → soldier's death)
- **Suggested components:**
  - `VisualNarrativeScreen` — sequence: sleepwalking scene → sickness imagery → Dunsinane defiance → "Tomorrow" speech → Birnam Wood moves → Macduff's revelation → Macbeth's death → restoration
  - `ExplainReveal` — the parallel arc: Lady Macbeth's guilt returns through the body; Macbeth's guilt empties into nihilism
  - `TimelineChain` — Act 5 fulfilments: blood motif / sleep motif / Birnam Wood / none of woman born / kingship restored

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and complete the series arcs.
- **Proposed content:**
  - Theme: Guilt — Lady Macbeth's sleepwalking is the return of everything she suppressed; Macbeth's guilt has hardened into emotional numbness and nihilism
  - Theme: Ambition — "Tomorrow" is the endpoint of the ambition arc; achieving the crown brought not fulfilment but meaninglessness
  - Theme: Supernatural — the equivocal prophecies fulfil; the witches' trap closes exactly because Macbeth trusted their wording
  - Theme: Kingship and tyranny — Macbeth's rule is figured as sickness; Malcolm restores lawful succession and political health
  - Theme: Natural order restored — Malcolm's kingship restores the Great Chain of Being; the disruption that began with Duncan's murder ends with legitimate succession
  - Theme: Masculinity — Macbeth dies fighting but is not redeemed; Macduff's humane masculinity from 4.3 remains the moral counterpoint
  - Theme: Appearance vs reality — Macbeth's performance of bravery in Act 5 is undermined by "I am sick at heart"
  - Context: Tragic form and catharsis (AO3) — the audience's pity and fear are released at the tragic ending; moral order returns
  - Context: Divine justice (AO3) — Malcolm's restoration is framed as lawful and divinely sanctioned; Macbeth's death is moral consequence, not random defeat
  - Context: Conscience/sin/spiritual sickness (AO3) — the Doctor cannot cure Lady Macbeth because her sickness is moral and spiritual as well as psychological
  - Context: Malcolm's verdict as political simplification (AO3) — "this dead butcher and his fiend-like queen" is the official restoration narrative; high-level AQA answers identify the gap between this reductive verdict and Shakespeare's complexity
- **Suggested components:**
  - `ExplainReveal` — full blood motif arc: "A little water" → "Neptune's ocean" → "Out, damned spot" → "all the perfumes of Arabia"
  - `TheoryCompareBlock` — Malcolm's verdict vs Shakespeare's character complexity
  - `ColSortBlock` — sort Act 5's events: restores order / completes guilt arc / fulfils equivocation / shows Macbeth's change
  - `SwipeSort` — Macbeth's final courage: evidence for courage / evidence against redemption

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Final retrieval of the play's most important quotes — synthesis and motif completion.
- **Proposed content:**
  - **"Out, damned spot! out, I say!"**: AO2: imperative directed at imagined blood; "damned" invokes judgement; dramatic irony because she once said blood could be washed away
  - **"Yet who would have thought the old man to have had so much blood in him?"**: AO2: ordinary phrasing makes the horror blunt; Duncan returns through memory and guilt
  - **"The Thane of Fife had a wife. Where is she now?"**: AO2: short sentence and question form; Lady Macbeth's conscience includes later victims, not only Duncan
  - **"What, will these hands ne'er be clean?"**: AO2: rhetorical question; the hands motif completes; psychological guilt has become impossible cleansing
  - **"All the perfumes of Arabia will not sweeten this little hand"**: AO2: hyperbolic scale of "all the perfumes" contrasts with "little hand"; smell motif makes guilt sensory
  - **"More needs she the divine than the physician"**: AO3/AO2: spiritual sickness; the Doctor recognises medicine cannot cure conscience
  - **"I am sick at heart"**: AO2: sickness metaphor; links Macbeth's inner condition to Scotland's diseased state
  - **"My way of life / Is fall'n into the sere, the yellow leaf"**: AO2: autumn/nature imagery; withering and decay; contrast with Duncan's "plant thee"
  - **"Honour, love, obedience, troops of friends, / I must not look to have"**: AO2: list structure totals the human losses ambition has caused
  - **"Canst thou not minister to a mind diseased"**: AO2: displacement; Macbeth asks for Lady Macbeth but reveals his own psychological/spiritual condition
  - **"Tomorrow, and tomorrow, and tomorrow / Creeps in this petty pace"**: AO2: triple repetition; time as slow, empty and repetitive; nihilism as conclusion, not just grief
  - **"Life's but a walking shadow, a poor player"**: AO2: theatrical metaphor; life as performance without substance; self-referential because Macbeth is a stage character
  - **"Signifying nothing"**: AO2: final absolute negative; links back to "To be thus is nothing" and completes ambition's emptiness arc
  - **"I bear a charmed life"**: AO2: Macbeth still clings to the witches' wording; false security survives until the last possible moment
  - **"Macduff was from his mother's womb / Untimely ripped"**: AO2: brutal revelation of equivocation; the prophecy was technically true but designed to mislead
  - **"I will not yield" / "Yet I will try the last"**: AO2/AO1: final refusal; courage, pride and despair combine; soldierly identity returns without moral redemption
  - **"The time is free"**: AO2: liberation compressed into a simple phrase; tyranny is over
  - **"This dead butcher and his fiend-like queen"**: AO2: reductive nouns; politically necessary simplification; whole-play contrast with "valiant cousin"
  - PQAC: students analyse "Tomorrow, and tomorrow, and tomorrow" — how does Shakespeare use the theatrical metaphor to present nihilism?
  - PQAC extension: students analyse why "This dead butcher" is both true and too simple
- **Suggested components:**
  - `MatchingTask` — match Act 5 quotes to Act 1/2/3/4 counterparts
  - `FillInTheBlanksBlock` — PQAC for "Tomorrow", "Out, damned spot", "yellow leaf" and "dead butcher"
  - `InteractiveCollectionExplorer` — browse the full motif completion across the play
  - `QuoteLadder` — simple meaning → technique → whole-play link → high-grade interpretation

### Section 5 — Exam Practice
- **Purpose:** AQA-style practice — this episode contains the AQA Jun 2023 actual exam question.
- **Proposed content:**
  - **AQA Jun 2023 actual question:** "Starting with this conversation, explore how far Shakespeare presents Macbeth as a male character who changes during the play." Extract: Act 5 Scene 3
  - Full essay structure:
    1. Extract para 1: "I am sick at heart" and "My way of life / Is fall'n into the sere, the yellow leaf" — Macbeth in 5.3 is defeated and diminished; sickness and autumn replace heroic warrior language
    2. Extract para 2: "Honour, love, obedience, troops of friends" and "Canst thou not minister to a mind diseased" — Macbeth recognises what he has lost and displaces psychological sickness onto Lady Macbeth
    3. Whole play para 1: Act 1.7 — he had a full moral vocabulary ("He's here in double trust"); this has eroded by Act 5
    4. Whole play para 2: Act 5.8 — "I will not yield" / "Yet I will try the last"; he regains soldierly courage but not moral innocence
  - AQA Jun 2023 indicative content embedded:
    - AO1: comments on Macbeth in the extract, e.g. his despair; details about Macbeth at the end of the play
    - AO2: language used to present Macbeth's despair at this point; use of soliloquies to reveal Macbeth's character/inner thoughts
    - AO3: Macbeth's use of violence in war/to fulfil ambition; Macbeth's attitude to religious issues; kingship and expectations
  - Alternative exam prompts: guilt; ambition; kingship/tyranny; Lady Macbeth; supernatural/equivocation
  - SPaG: sentence structures for analysis; whole-play connective phrases ("By contrast, in Act 1..."; "Shakespeare traces this change through...")
- **Suggested components:**
  - `GuidedExamResponse` — full 4-paragraph structure with model opening sentences for the Jun 2023 question
  - `FaceTheExaminer` — students write the extract paragraph independently; compare with model; self-assess using AO1/AO2/AO3 criteria
  - `ExaminerExplainsScreen` — highest-level move: identifying the gap between Malcolm's verdict and Shakespeare's complexity
  - `GuidedAnswerCoach` — upgrade a basic "Macbeth changes from brave to evil" paragraph into a nuanced response about moral, psychological and social change

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Synthesis and retrieval of the whole series — this is the final episode.
- **Proposed content:**
  - Retrieve from Episode 5: What did Lady Macbeth ask the spirits to remove? How does that connect to her sleepwalking?
  - Retrieve from Episode 7: "A little water clears us of this deed" and "Macbeth does murder sleep" — how does Act 5 complete both motifs?
  - Retrieve from Episode 9: "To be thus is nothing" — how does this connect to "signifying nothing"?
  - Retrieve from Episode 10: "I am in blood" — how does this lead to Macbeth's Act 5 final fight?
  - Retrieve from Episode 11: "None of woman born" — how does 4.1 equivocation resolve in 5.8?
  - Whole-play arc summary: students state the endpoint of each major arc in one sentence: guilt / ambition / supernatural / kingship / masculinity / appearance and reality
  - Quick quiz: 8 questions — series-synthesis retrieval covering the whole play
- **Suggested components:**
  - `QuickRecallScreen` — 8 rapid-fire questions spanning the whole play, not just Act 5
  - `MatchingTask` — match beginning/end pairs: valiant cousin/dead butcher; little water/damned spot; plant thee/yellow leaf; safely thus/signifying nothing; are you a man/feel it as a man
  - `RecoveryQuizPlayer` — targeted recovery for any gaps in the whole-series synthesis

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

### Fixed content gaps in this revision

- Added fuller Lady Macbeth sleepwalking quote coverage: Duncan, Lady Macduff, clean hands and Arabia/perfume imagery.
- Added Act 5.2–5.3 sickness/medicine imagery as a stronger bridge into the AQA June 2023 extract.
- Added "Honour, love, obedience, troops of friends" as key evidence for Macbeth's losses.
- Added "I bear a charmed life", "I will not yield" and "Yet I will try the last" for Macbeth's final complexity.
- Added "The time is free" and "By the grace of Grace" to strengthen restoration and divine order.
- Strengthened the distinction between Macbeth's final soldierly courage and actual redemption.
- Strengthened final synthesis pairs so the episode works as a whole-play retrieval module, not just an Act 5 lesson.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway must state that every major arc completes in Act 5. Lady Macbeth's guilt returns through the body; Macbeth's guilt empties into nihilism; Malcolm restores political order but simplifies the moral story.

2. **Section 2 — the parallel collapses must be taught as structural design:** Lady Macbeth's arc (suppression → sleepwalking → death) and Macbeth's arc (bravado → nihilism → soldier's death) are separate trajectories that began with Duncan's murder and end apart.

3. **Section 4 — the motif completion pairs are the episode's richest AO2 teaching moments:** Teach these as pairs, not isolated quotes: "A little water" / "Out, damned spot"; Neptune / Arabia; "plant thee" / "yellow leaf"; "To be thus is nothing" / "signifying nothing"; "valiant cousin" / "dead butcher".

4. **Section 5 — use the AQA Jun 2023 actual exam question and extract:** Act 5.3 is the recent AQA extract for Macbeth as a changing male character. Students should use "I am sick at heart", "sere, the yellow leaf", "Honour, love, obedience" and "mind diseased" as core extract evidence.

5. **Section 5 — teach the Malcolm verdict move explicitly:** The highest-level analytical move on Act 5 is acknowledging Malcolm's verdict while showing Shakespeare's richer characterisation. Give students the sentence stem: "While Malcolm's verdict is politically necessary to restore order, Shakespeare has presented..."

6. **Section 6 — this is the synthesis retrieval episode:** The QuickRecallScreen should span the whole play. This is where the app should make students feel the series has locked together.

---

## 10-point Module Completion Test

- [ ] Students can narrate Act 5's key sequence from memory: sleepwalking → sickness imagery → Tomorrow speech → prophecies fulfilled → Macbeth's death → Malcolm restored
- [ ] Students can explain Lady Macbeth's sleepwalking as suppressed guilt returning
- [ ] Students can explain Macbeth's "Tomorrow" speech as nihilism rather than simple grief
- [ ] Students can analyse at least 4 Act 5 quotes using AO2
- [ ] Students can connect at least 4 Act 5 quotes to earlier motif pairs
- [ ] Students can explain the AQA Jun 2023 extract focus on Macbeth as a changing male character
- [ ] Students can explain why Macbeth's final courage is not full redemption
- [ ] Students can explain why Malcolm's verdict is politically useful but reductive
- [ ] Students have practised at least one AQA-style written response
- [ ] Students can state the endpoint of each major Macbeth arc: guilt, ambition, supernatural, kingship, masculinity and appearance/reality
