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
  - Retrieve from Episode 9: What is the "fruitless crown"? Why does Macbeth decide to murder Banquo? What does "eternal jewel" mean?
  - Retrieve from Episode 7: What is Macbeth's dagger hallucination? What is the blood motif? What is the Neptune speech?
  - Hook: "If you were pretending to be fine at a public event while your life was falling apart, what would give you away?" (primes the banquet scene's public/private collapse)
  - True/false: "Banquo's ghost is visible to all the lords at the banquet" / "Lady Macbeth is still in control of Macbeth in Act 3" / "Macbeth tells Lady Macbeth about the Banquo murder plot"
- **Suggested components:**
  - `ChapterHookScreen` — true/false targeting the ghost ambiguity and the power reversal misconceptions
  - `PriorKnowledgeRecall` — retrieve "nought's had, all's spent" and prior-episode quotes

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the scenes.
- **Proposed content:**
  - Act 3.2: Private conversation between Macbeth and Lady Macbeth; she voices the futility of what they have achieved ("Nought's had, all's spent"); Macbeth hints at further murders ("Something wicked this way..."); he excludes her ("Be innocent of the knowledge, dearest chuck")
  - Act 3.4: The banquet — a set piece of legitimate kingship; Macbeth is told Banquo is dead but Fleance escaped; Banquo's ghost appears at Macbeth's seat; Macbeth speaks to the ghost; only he (and the audience) can see it; Lady Macbeth attempts to explain his behaviour ("He has these fits from his youth")
  - "Are you a man?" — Lady Macbeth's challenge recycled from 1.7, now as damage control not motivation
  - "Never shake thy gory locks at me" / "Thou canst not say I did it" — Macbeth addresses the ghost
  - The lords' polite withdrawal: public trust begins to erode
  - "Blood will have blood" — Macbeth's acceptance of the violence cycle after the banquet
  - Dramatic structure: the banquet that should prove kingship reveals its impossibility
- **Suggested components:**
  - `VisualNarrativeScreen` — sequence: 3.2 private admission → banquet staging → ghost appears → Lady Macbeth's damage control → lords leave → "blood will have blood"
  - `ExplainReveal` — stagecraft: why Banquo's ghost is visible to audience but not to lords; the staging of the occupied seat as a visual metaphor (Banquo's rightful place stolen)

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and AO3 context.
- **Proposed content:**
  - Theme: Guilt — Banquo's ghost is the externalisation of guilt; it makes Macbeth's private suffering public; contrast with Lady Macbeth's public composure and private admission in 3.2
  - Theme: Appearance vs reality — the banquet is designed to display legitimate kingship but reveals the opposite; Macbeth's performance collapses; Lady Macbeth's attempted management fails
  - Theme: Macbeth and Lady Macbeth relationship — power has reversed; she is now damage controller, not motivator; the "Are you a man?" challenge is recycled but ineffective; their partnership is effectively over
  - Theme: Violence cycle — "blood will have blood" accepts that violence cannot stop; Macbeth is trapped in a cycle that can only end in his destruction
  - Context: Ghost beliefs in Jacobean England (AO3) — Protestant theology (ghosts = demonic illusions or psychological projections); Catholic theology (souls in purgatory); Shakespeare exploits the theological uncertainty to leave the ghost ambiguous; Jacobean audience would have been divided on whether the ghost is "real"
  - Context: Public kingship (AO3) — a Jacobean king was expected to display ceremony, composure and legitimacy publicly; Macbeth's breakdown at the banquet is a public failure of kingship, not just a personal psychological event
- **Suggested components:**
  - `TheoryCompareBlock` — Lady Macbeth in 1.7 (motivating Macbeth to act) vs Lady Macbeth in 3.4 (trying to stop him from speaking/acting); same tactics, opposite function
  - `ExplainReveal` — Jacobean ghost theology: Protestant vs Catholic belief; why Shakespeare's ambiguity about the ghost was deliberate and meaningful for its original audience
  - `ColSortBlock` — sort the banquet scene's events: things that reveal Macbeth's guilt / things Lady Macbeth does to conceal it / things the lords notice

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis — this episode's quote cluster is some of the richest in the play.
- **Proposed content:**
  - **"Nought's had, all's spent / Where our desire is got without content"**: AO2: chiasmus of "nought" (nothing) and "all's spent" (everything consumed); the murder has produced the opposite of what was planned; technique: contrast (got/nothing); whole-play link: Lady Macbeth's private self-knowledge here anticipates "Out, damned spot" in 5.1
  - **"Full of scorpions is my mind"**: AO2: the plural "scorpions" implies multiple sources of anxiety; the metaphor is visceral — stinging, venomous, internally consuming; "of my mind" makes the suffering psychological/physical simultaneously; technique: extended metaphor
  - **"Are you a man?"**: AO2: the direct echo of 1.7 is deliberate; the recycled challenge shows Lady Macbeth has only one tool; in 1.7 it motivated; here it is trying to contain; technique: repetition / intertextual echo within the play
  - **"Never shake thy gory locks at me"**: AO2: the adjective "gory" identifies the physical evidence of murder on the ghost; the imperative "never shake" is an attempt to command the ghost; the image of shaking locks implies accusation without words; technique: personification of the ghost's silence as accusation
  - **"Blood will have blood"**: AO2: the proverbial structure (subject + verb + subject) makes it sound like a law of nature; the cycle is self-sustaining; "will have" is inevitability; technique: repetition of "blood" (anaphora within a single clause); whole-play link: connects the blood motif from Episode 7 to its endpoint
  - PQAC: students analyse "Full of scorpions is my mind" — how does Shakespeare use the scorpion image to present Macbeth's psychological state?
- **Suggested components:**
  - `MatchingTask` — match quote to speaker to technique to whole-play link
  - `FillInTheBlanksBlock` — PQAC for "Nought's had, all's spent" (Lady Macbeth) and "blood will have blood"
  - `InteractiveCollectionExplorer` — browse guilt quotes and relationship quotes across the play

### Section 5 — Exam Practice
- **Purpose:** AQA-style practice, with explicit connection to the Nov 2021 past paper question.
- **Proposed content:**
  - **AQA Nov 2021 whole-play component:** "Starting with this conversation [Act 2.2], explore how Shakespeare presents the relationship between Macbeth and Lady Macbeth." — The whole-play paragraphs for this question require this episode; the relationship reversal in 3.4 and exclusion in 3.2 are essential
  - Relationship arc for the essay (whole-play evidence):
    1. 1.5/1.7: Lady Macbeth dominant ("Leave all the rest to me")
    2. 2.2: Lady Macbeth manages the aftermath; she is capable, he is paralysed
    3. 3.2: She is excluded from Banquo plot ("Be innocent of the knowledge")
    4. 3.4: She attempts damage control; she fails; their partnership is effectively over
    5. 5.1: She collapses alone; Macbeth is distant; they do not face their ends together
  - Key argument: The relationship reversal is the structural spine of the play; what begins as Lady Macbeth in control ends with both characters separately destroyed
  - AQA Nov 2021 indicative content embedded: "tracking the change in the relationship — almost switching roles"; "gender issues/roles within their relationship: shifts of power/control"
- **Suggested components:**
  - `GuidedExamResponse` — whole-play paragraph plan for the Nov 2021 relationship question; scaffold the 3.2/3.4 evidence into a "whole-play" paragraph
  - `FaceTheExaminer` — students write one whole-play paragraph about the relationship; compare with model

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness.
- **Proposed content:**
  - Retrieve from Episode 7: What is the dagger hallucination? How does Banquo's ghost (3.4) connect to it as a manifestation of guilt?
  - Retrieve from Episode 6: What did Lady Macbeth's masculinity challenge achieve in 1.7? Why does the same challenge fail in 3.4?
  - Whole-play link: "Nought's had, all's spent" (3.2) ↔ "To be thus is nothing" (3.1) — both characters reach the same conclusion about the hollowness of achievement independently
  - Whole-play link: Lady Macbeth's banquet failure (3.4) ↔ Lady Macbeth's sleepwalking (5.1) — the private guilt she managed publicly in 3.4 becomes uncontrollable by 5.1
  - Quick quiz: 5 questions (Very High retrieval priority)
- **Suggested components:**
  - `QuickRecallScreen` — 5 rapid-fire questions: quotes / character / themes / context / whole-play links
  - `RecoveryQuizPlayer` — targeted recovery

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway (both characters have independently recognised the hollowness of what they achieved; the banquet scene makes Macbeth's private collapse public; Lady Macbeth cannot manage it) must be stated in Section 2 as the episode's structural argument. The relationship reversal is the key exam-scoring insight for the Nov 2021 question.

2. **Section 2 — the banquet must be taught as a structural device, not just a plot event:** The banquet is a ceremony of legitimate kingship; Macbeth's collapse at it is the proof that he cannot be king. The VisualNarrativeScreen should frame it as: "this is what kings are supposed to do publicly — and what Macbeth cannot." The ghost occupying Macbeth's seat is a staging metaphor (Banquo's stolen place) that students should be able to describe.

3. **Section 3 — the Jacobean ghost theology context is underused in GCSE answers:** The Protestant/Catholic uncertainty about the nature of ghosts is one of the richest AO3 points in the play. Students who can say "a Protestant audience might see the ghost as a psychological projection of guilt; a Catholic audience might see it as a soul in purgatory" are demonstrating genuine contextual sophistication.

4. **Section 4 — "Are you a man?" in 3.4 is only powerful if students remember 1.7:** The recycled challenge is the most efficient demonstration of the power reversal in the play. The MatchingTask should pair the 1.7 usage (motivation) with the 3.4 usage (damage control) explicitly.

5. **Section 5 — use the AQA Nov 2021 whole-play arc explicitly:** This episode's content (3.2 exclusion; 3.4 reversal) is the essential evidence for the "whole-play" section of the Nov 2021 question (which used the 2.2 extract). Students who can trace the relationship from 1.5 to 5.1 through these four pivot points are demonstrating the highest-level whole-play awareness.

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
