# Episode 10: A mind full of scorpions — Architecture

## 1. Identity (brief)

- **Episode:** 10 of 12
- **Title:** A mind full of scorpions
- **Primary acts:** Act 3 Scenes 2 and 4
- **Build status:** Not yet built

Content, Storyline, Specification requirements and the full Content reference pack: see `10_A_Mind_Full_Of_Scorpions_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Surface existing knowledge; prime retrieval.
- **Proposed content:**
  - Retrieve from Episode 9: What is the "fruitless crown"? Why does Macbeth fear Banquo and Fleance? What does "eternal jewel" mean?
  - Retrieve from Episode 7: What is Macbeth's dagger hallucination? What is the blood motif? What is the Neptune speech?
  - Retrieve from Episode 6: How did Lady Macbeth use masculinity to control Macbeth in 1.7?
  - Hook: "If you were pretending to be fine at a public event while your life was falling apart, what would give you away?" This primes the banquet scene's public/private collapse.
  - True/false: "Banquo's ghost is visible to all the lords at the banquet" / "Lady Macbeth is still in control of Macbeth in Act 3" / "Macbeth tells Lady Macbeth everything" / "Fleance's escape matters because of succession"
- **Suggested components:**
  - `ChapterHookScreen` — true/false targeting the ghost ambiguity, power reversal and Fleance misconceptions
  - `PriorKnowledgeRecall` — retrieve "fruitless crown", Banquo/Fleance threat, dagger vision, blood motif and masculinity pressure
  - `MisconceptionCheck` — Macbeth's public power does not equal internal control

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the scenes.
- **Proposed content:**
  - Act 3.2: Lady Macbeth privately voices the futility of what they achieved: "Nought's had, all's spent"
  - Act 3.2: Macbeth envies Duncan's peace: "Better be with the dead"
  - Act 3.2: Macbeth describes his mind as "full of scorpions" and excludes Lady Macbeth: "Be innocent of the knowledge, dearest chuck"
  - Act 3.2: Macbeth calls on darkness — "Come, seeling night" — and recognises escalation: "Things bad begun make strong themselves by ill"
  - **Accuracy guardrail:** Do not use "Something wicked this way comes" as Macbeth's 3.2 line. That phrase belongs to Act 4 Scene 1 and is spoken by a witch.
  - Act 3.4: The banquet should display legitimate kingship, hospitality and order
  - Act 3.4: Macbeth is told Banquo is dead but Fleance escaped; his fear returns: "cabined, cribbed, confined"
  - Act 3.4: Banquo's ghost appears at Macbeth's seat; Macbeth speaks to the ghost; usually only Macbeth and the audience see it
  - Act 3.4: Lady Macbeth attempts to manage the situation: "Are you a man?", "This is the very painting of your fear", "My worthy lord, / Your noble friends do lack you"
  - Act 3.4: The guests leave; Macbeth reflects on the cycle of violence: "Blood will have blood" and "I am in blood / Stepp'd in so far"
  - Dramatic structure: the banquet that should prove kingship reveals its impossibility
- **Suggested components:**
  - `VisualNarrativeScreen` — sequence: 3.2 private dissatisfaction → Macbeth excludes Lady Macbeth → banquet staging → Fleance escapes → ghost appears → Lady Macbeth's damage control → lords leave → blood-cycle realisation
  - `ExplainReveal` — stagecraft: why Banquo's ghost is usually visible to audience but not to lords; the occupied seat as a visual metaphor
  - `TheoryCompareBlock` — private guilt vs public collapse

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and AO3 context.
- **Proposed content:**
  - Theme: Guilt — Banquo's ghost externalises guilt; it makes Macbeth's private suffering public; contrast with Lady Macbeth's public composure and private admission in 3.2
  - Theme: Appearance vs reality — the banquet is designed to display legitimate kingship but reveals the opposite; Macbeth's performance collapses
  - Theme: Macbeth and Lady Macbeth relationship — power has reversed; she is now damage controller, not motivator; the "Are you a man?" challenge is recycled but ineffective
  - Theme: Violence cycle — "blood will have blood" and "I am in blood" show Macbeth accepting that violence keeps generating further violence
  - Theme: Kingship and tyranny — a legitimate king should perform hospitality, ceremony and control; Macbeth's banquet failure exposes him as an insecure tyrant
  - Theme: Fate and security — Fleance's escape proves Macbeth cannot control succession or the future
  - Context: Ghost beliefs in Jacobean England (AO3) — Protestant theology could interpret ghosts as demonic illusions or psychological projections; Catholic theology allowed ideas of souls/purgatory; Shakespeare exploits uncertainty
  - Context: Public kingship (AO3) — a Jacobean king was expected to display ceremony, composure and legitimacy publicly; Macbeth's breakdown at the banquet is political, not just personal
  - Context: Masculine performance (AO3) — Lady Macbeth's challenge relies on gender expectations, but its failure shows her influence collapsing
- **Suggested components:**
  - `TheoryCompareBlock` — Lady Macbeth in 1.7 (motivating Macbeth to act) vs Lady Macbeth in 3.4 (trying to stop him from speaking/acting); same tactic, opposite function
  - `ExplainReveal` — Jacobean ghost theology: Protestant vs Catholic belief; why Shakespeare's ambiguity about the ghost matters
  - `ColSortBlock` — sort banquet events: things that reveal Macbeth's guilt / things Lady Macbeth does to conceal it / things the lords notice
  - `SwipeSort` — legitimate king vs tyrant behaviours at the banquet

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis — this episode's quote cluster is some of the richest in the play.
- **Proposed content:**
  - **"Nought's had, all's spent / Where our desire is got without content"**: AO2: contrast between "nought" and "all"; ambition has produced emptiness, not satisfaction; whole-play link to "To be thus is nothing" and "Tomorrow"
  - **"Better be with the dead"**: AO2: Macbeth envies Duncan's peace; death becomes preferable to guilty kingship; this reverses the promise of ambition
  - **"O, full of scorpions is my mind"**: AO2: plural "scorpions" implies multiple anxieties; the metaphor is venomous, stinging and internal; the mind becomes a place of attack
  - **"Be innocent of the knowledge, dearest chuck"**: AO2: affectionate language contrasts with exclusion; "innocent" is ironic; the relationship shifts from partnership to concealment
  - **"Come, seeling night"**: AO2: seeling = stitching shut a hawk's eyelids; Macbeth wants darkness to blind the world; night becomes active concealment
  - **"Things bad begun make strong themselves by ill"**: AO2/AO1: Macbeth recognises escalation; evil strengthens itself through further evil
  - **"There the grown serpent lies; the worm that's fled"**: AO2: Banquo is the grown serpent, Fleance the young threat; animal imagery makes succession feel predatory and unfinished
  - **"Cabined, cribbed, confined, bound in"**: AO2: compressed alliteration and listing create claustrophobia; Macbeth has power but feels trapped
  - **"Thou canst not say I did it"**: AO2: denial becomes accidental confession; Macbeth answers an accusation no one else has spoken
  - **"Never shake thy gory locks at me"**: AO2: the ghost's silence becomes accusation; Macbeth tries to command what he cannot control
  - **"Are you a man?"**: AO2: direct echo of 1.7; recycled challenge shows Lady Macbeth has only one tool; it now fails
  - **"This is the very painting of your fear"**: AO2: Lady Macbeth links the ghost to the dagger; visions become repeated signs of guilty imagination
  - **"Blood will have blood"**: AO2: proverbial circular structure; repeated "blood" makes violence self-perpetuating
  - **"I am in blood / Stepp'd in so far"**: AO2: extended blood metaphor; Macbeth imagines himself physically wading through guilt and violence; returning seems as difficult as continuing
  - PQAC: students analyse "Full of scorpions is my mind" — how does Shakespeare use the scorpion image to present Macbeth's psychological state?
  - PQAC extension: students compare "Are you a man?" in 1.7 and 3.4
- **Suggested components:**
  - `MatchingTask` — match quote to speaker to technique to whole-play link
  - `FillInTheBlanksBlock` — PQAC for "Nought's had", "full of scorpions", "cabined, cribbed, confined" and "I am in blood"
  - `InteractiveCollectionExplorer` — browse guilt, blood, relationship and kingship quotes across the play
  - `QuoteLadder` — simple meaning → technique → whole-play link → Grade 7–9 interpretation

### Section 5 — Exam Practice
- **Purpose:** AQA-style practice, with explicit connection to the Nov 2021 past paper question.
- **Proposed content:**
  - AQA-style question: "Starting with this extract, explore how Shakespeare presents Macbeth's guilt and fear. Write about how Shakespeare presents Macbeth's guilt and fear in this extract and in the play as a whole."
  - Alternative AQA-style question: "Starting with this conversation, explore how Shakespeare presents the relationship between Macbeth and Lady Macbeth."
  - **AQA Nov 2021 whole-play component:** The whole-play paragraphs for the relationship question require this episode; the relationship reversal in 3.4 and exclusion in 3.2 are essential
  - Relationship arc for the essay:
    1. 1.5/1.7: Lady Macbeth dominant ("Leave all the rest to me")
    2. 2.2: Lady Macbeth manages the aftermath; she is capable, he is paralysed
    3. 3.2: She is excluded from Banquo/Fleance plot ("Be innocent of the knowledge")
    4. 3.4: She attempts damage control; she fails; their partnership is effectively over
    5. 5.1: She collapses alone; Macbeth is distant; they do not face their ends together
  - Key argument: The relationship reversal is the structural spine of the play; what begins as Lady Macbeth in control ends with both characters separately destroyed
  - AQA Nov 2021 indicative content embedded: tracking the change in the relationship; almost switching roles; gender issues and shifts of power/control
  - Examiner warning: do not retell the banquet; explain how Shakespeare uses it to expose Macbeth's guilt and failed kingship
- **Suggested components:**
  - `GuidedExamResponse` — whole-play paragraph plan for the relationship question; scaffold the 3.2/3.4 evidence into a whole-play paragraph
  - `FaceTheExaminer` — students write one whole-play paragraph about the relationship; compare with model
  - `ExaminerExplainsScreen` — show why "ghost = guilt made visible" is stronger than "Macbeth sees a ghost and is scared"
  - `GuidedAnswerCoach` — build one paragraph from quote → technique → effect → context → whole-play link

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness.
- **Proposed content:**
  - Retrieve from Episode 7: What is the dagger hallucination? How does Banquo's ghost (3.4) connect to it as a manifestation of guilt?
  - Retrieve from Episode 6: What did Lady Macbeth's masculinity challenge achieve in 1.7? Why does the same challenge fail in 3.4?
  - Retrieve from Episode 9: Why does Fleance's escape matter for Macbeth's "fruitless crown" fear?
  - Whole-play link: "Nought's had, all's spent" (3.2) ↔ "To be thus is nothing" (3.1) — both characters reach the same conclusion about hollow achievement independently
  - Whole-play link: "Blood will have blood" (3.4) ↔ "Will all great Neptune's ocean" (2.2) — the blood motif shifts from shock to inevitability
  - Whole-play link: Lady Macbeth's banquet failure (3.4) ↔ Lady Macbeth's sleepwalking (5.1) — the private guilt she managed publicly in 3.4 becomes uncontrollable by 5.1
  - Whole-play link: "I am in blood" (3.4) ↔ Macbeth's tyranny in 4.2 — once he believes return is impossible, violence escalates
  - Quick quiz: 6 questions covering quote, speaker, technique, theme, context and whole-play link
- **Suggested components:**
  - `QuickRecallScreen` — 6 rapid-fire questions: quotes / character / themes / context / whole-play links
  - `MatchingTask` — match 3.2/3.4 quotes to earlier/later whole-play links
  - `RecoveryQuizPlayer` — targeted recovery for misconceptions about the ghost, Lady Macbeth's control and Fleance's escape

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

### Fixed content gaps in this revision

- Corrected the inaccurate Act 3 Scene 2 reference to "Something wicked this way comes". That phrase belongs to Act 4 Scene 1 and is spoken by a witch.
- Added Macbeth's "Better be with the dead" as a key guilt/mental-state quote.
- Added "Come, seeling night" and "Things bad begun make strong themselves by ill" to strengthen Act 3 Scene 2.
- Added Fleance's escape as the reason Macbeth's fear survives after Banquo's death.
- Added "cabined, cribbed, confined" as a high-value quote for insecurity, power and claustrophobia.
- Added "I am in blood / Stepp'd in so far" as essential evidence for the blood motif, violence cycle and Macbeth's moral entrapment.
- Strengthened kingship/hospitality context so the banquet is taught as political failure, not just a ghost scene.
- Strengthened AQA extract-to-whole-play practice for guilt, fear and relationship questions.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway must be stated in Section 2 as the episode's structural argument: both characters recognise hollow achievement; Macbeth excludes Lady Macbeth; the banquet makes private guilt public; Lady Macbeth can no longer manage him.

2. **Section 2 — keep Act 3 Scene 2 accurate:** Do not use "Something wicked this way comes" as Macbeth's line. Use "Come, seeling night" and "Things bad begun make strong themselves by ill" for Macbeth's movement towards further darkness.

3. **Section 2 — Fleance's escape must be included:** Without Fleance, the banquet scene loses its succession logic. Macbeth's fear is not solved by Banquo's death because Fleance represents the future.

4. **Section 2 — the banquet must be taught as a structural device, not just a plot event:** The banquet is a ceremony of legitimate kingship; Macbeth's collapse at it proves that he cannot perform kingship. The ghost occupying Macbeth's seat is a staging metaphor students should be able to describe.

5. **Section 3 — the Jacobean ghost theology context is useful but must stay attached to the text:** Students should not write a detached history paragraph. They should use context to explain why Shakespeare leaves the ghost ambiguous and why a Jacobean audience would find it disturbing.

6. **Section 4 — "Are you a man?" in 3.4 only works if students remember 1.7:** The recycled challenge is the most efficient demonstration of the power reversal in the play. The MatchingTask should pair the 1.7 usage (motivation) with the 3.4 usage (damage control).

7. **Section 4 — include both blood-cycle quotes:** "Blood will have blood" shows the law of violence; "I am in blood" shows Macbeth's personal sense of being trapped inside it. Together they are stronger than either alone.

8. **Section 5 — use the AQA Nov 2021 whole-play arc explicitly:** This episode's content (3.2 exclusion; 3.4 reversal) is essential evidence for the whole-play section of relationship questions. Students who can trace the relationship from 1.5 to 5.1 through these pivot points are demonstrating high-level whole-play awareness.

---

## 10-point Module Completion Test

- [ ] Students can narrate the episode's plot from memory, including 3.2 private conversation, Fleance's escape, the ghost, Lady Macbeth's damage control and Macbeth's blood-cycle realisation (Section 2)
- [ ] Students can name and explain at least 2 themes from the episode (Section 3)
- [ ] Students can identify at least 1 key AO3 context point and link it to the text (Section 3)
- [ ] Students have actively retrieved at least 4 key quotes from the episode (Section 4)
- [ ] Students can analyse each key quote using Point → Quote → Analysis → Context (Section 4)
- [ ] Students can identify and name at least 2 language/structural techniques from the episode (Section 4)
- [ ] Students know that "Something wicked this way comes" is Act 4 Scene 1, not Macbeth in 3.2 (Section 2 or 6)
- [ ] Students have practised at least one AQA-style written response (Section 5)
- [ ] Students have been shown or produced a mark-scheme-aware paragraph (Section 5)
- [ ] Students can connect 3.2/3.4 to at least four wider-play moments: 1.7, 2.1, 2.2, 3.1, 4.1, 5.1 or 5.5 (Section 6)
