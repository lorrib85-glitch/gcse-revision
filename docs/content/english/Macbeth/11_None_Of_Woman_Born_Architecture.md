# Episode 11: None of woman born — Architecture

## 1. Identity (brief)

- **Episode:** 11 of 12
- **Title:** None of woman born
- **Primary acts:** Act 4 Scenes 1, 2 and 3
- **Build status:** Not yet built

Content, Storyline, Specification requirements and the full Content reference pack: see `11_None_Of_Woman_Born_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Surface existing knowledge; prime retrieval.
- **Proposed content:**
  - Retrieve from Episode 3: What was Banquo's warning about the witches? ("instruments of darkness... win us with honest trifles, to betray's in deepest consequence") — this is exactly what happens in Episode 11
  - Retrieve from Episode 1: What is the witches' first paradox? ("Fair is foul, and foul is fair") — the equivocal prophecies are the same principle applied to fate
  - Hook: "If someone told you the truth in a way that was designed to trick you, is it still a lie?" (primes the concept of equivocation before the apparitions)
  - True/false: "The witches tell Macbeth he cannot be killed" / "Macduff was born by Caesarean section" / "Macbeth kills Macduff's family on the witches' orders"
- **Suggested components:**
  - `ChapterHookScreen` — true/false targeting equivocation misconceptions and the nature of the witches' prophecies
  - `PriorKnowledgeRecall` — retrieve Banquo's warning from Episode 3 and the witches' paradoxes from Episode 1

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the three scenes.
- **Proposed content:**
  - Act 4.1: Macbeth seeks out the witches (reversal of 1.3 — he approaches them, not vice versa); the three apparitions: armed head (beware Macduff) / bloody child (none of woman born) / crowned child with tree (safe until Birnam Wood comes to Dunsinane); the eighth king — Banquo's line continuing; Macbeth's overconfidence; he learns Macduff has fled to England and decides to "seize upon Fife"
  - Act 4.2: Lady Macduff and her son; her husband's absence discussed; the murderers arrive; mother and children are killed (the most clearly tyrannical act in the play — no strategic necessity)
  - Act 4.3: Malcolm and Macduff in England; Malcolm tests Macduff's loyalty by falsely claiming vices (a device to verify loyalty to Scotland, not personal ambition); Macduff learns of his family's murder; "All my pretty ones?"; the English army prepares
  - "Something wicked this way comes" — the first witch's description of Macbeth before he arrives; the reversal is the clearest sign of his transformation
  - "The firstlings of my heart shall be / The firstlings of my hand" — Macbeth has eliminated the gap between impulse and action; the moral deliberation of Acts 1–2 is gone
- **Suggested components:**
  - `VisualNarrativeScreen` — sequence: Macbeth seeks out witches → three apparitions (equivocal) → Macduff's family killed → Macduff's grief in England → army prepares
  - `ExplainReveal` — the three apparitions one by one: what Macbeth hears vs what each one actually means (the gap is the equivocation)

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and AO3 context.
- **Proposed content:**
  - Theme: Supernatural — the witches' second visit is more sophisticated and more fatal than the first; equivocation as structural principle; Macbeth now seeks them out (agency reversed)
  - Theme: Tyranny — the murder of Macduff's family is the clearest act of tyranny in the play; killing children has no strategic value; it is pure cruelty
  - Theme: Ambition → overconfidence — the equivocal prophecies confirm Macbeth in false security; his "moral collapse" (eliminating the gap between impulse and action) is complete
  - Theme: Macduff as moral foil — his motivation is love and loss, not ambition; his grief is genuine; this is what legitimate use of violence looks like contrasted with Macbeth's
  - Context: Equivocation and Henry Garnet (AO3) — the Jesuit doctrine of equivocation; Henry Garnet used it as a defence in the Gunpowder Plot trial (1606); executed; the Porter references equivocation in 2.3; the witches embody it structurally throughout the play
  - Context: Caesarean birth in Jacobean England (AO3) — performed only when the mother was dead or dying; "untimely ripped" means surgically removed; not supernatural, but outside normal birth — the literal truth of the equivocation
  - Context: Tyranny and Jacobean kingship (AO3) — what distinguishes a king from a tyrant; James I's Basilikon Doron describes the good king; Macbeth's Act 4 behaviour defines the tyrant by negative example
- **Suggested components:**
  - `ExplainReveal` — equivocation in action: how each prophecy is literally true and fatally misleading; Henry Garnet connection; the Porter scene reference (Episode 8)
  - `TheoryCompareBlock` — Macbeth's first visit to the witches (1.3: witches approach him; he is reluctant) vs second visit (4.1: he seeks them out; he demands information); agency reversed
  - `ColSortBlock` — sort the three apparitions: what each one seems to promise / what it actually means / how it is fulfilled in Act 5

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis — the equivocation quotes require careful AO2 analysis.
- **Proposed content:**
  - **"Something wicked this way comes"**: AO2: the witches' description of Macbeth before he arrives; the reversal from 1.3 (where they were the wicked ones approaching him) is the episode's most powerful structural irony; technique: dramatic irony + character reversal; whole-play link: tracks Macbeth's transformation across the play
  - **"None of woman born / Shall harm Macbeth"**: AO2: the ambiguity in "of woman born" — Macbeth hears "no person born of a woman"; the equivocation is in the word "of" (born by normal means); technique: equivocation; whole-play link: the trap completes in 5.8 ("Macduff was from his mother's womb / Untimely ripped")
  - **"All my pretty ones? / Did you say all? O hell-kite! All?"**: AO2: the repetition of "all" (three times) performs the mind trying to absorb incomprehensible loss; the rhetorical question "Did you say all?" refuses to accept the information; "hell-kite" — Macbeth as a bird of prey destroying an innocent nest; technique: rhetorical question; repetition; avian metaphor
  - **"The firstlings of my heart shall be / The firstlings of my hand"**: AO2: the elimination of the gap between impulse and action; "firstlings" emphasises the immediacy — the first thought becomes the first action; technique: antithesis (heart/hand); repetition of "firstlings"; whole-play link: contrast with the lengthy moral deliberation of 1.7
  - **"Give sorrow words; the grief that does not speak / Whispers the o'erfraught heart and bids it break"**: AO2: Malcolm's advice to Macduff; the contrast between spoken grief (healthy) and suppressed grief (destructive); technique: personification of grief; contrast; whole-play link: Lady Macbeth's suppressed guilt (1.5, 5.1) — suppression destroys
  - PQAC: students analyse "Something wicked this way comes" — how does this single line demonstrate Macbeth's transformation across the play?
- **Suggested components:**
  - `MatchingTask` — match each apparition to: what Macbeth hears / what it actually means / how it is fulfilled
  - `FillInTheBlanksBlock` — PQAC frames for "none of woman born" and "All my pretty ones"
  - `InteractiveCollectionExplorer` — browse supernatural and tyranny quotes across the play

### Section 5 — Exam Practice
- **Purpose:** AQA-style practice focused on the supernatural and on Macduff.
- **Proposed content:**
  - Question: "How does Shakespeare present the supernatural in Macbeth?" — key argument: compare 1.3 (witches tempt) with 4.1 (witches trap through false security via equivocation); the second visit is more sophisticated and more fatal
  - Key argument: The witches' equivocal prophecies are designed to be misread; the gap between what Macbeth hears and what the prophecies mean is the trap; equivocation as structural principle
  - Model paragraph: analysis of "None of woman born" as equivocation — AO2 (technique); AO3 (Henry Garnet / Gunpowder Plot; Caesarean birth); whole-play link (fulfilled in 5.8)
  - Alternative question: "How does Shakespeare present Macduff?" — 4.2 (innocent family) and 4.3 (grief and resolve) as the evidence; contrast with Macbeth's tyranny
- **Suggested components:**
  - `GuidedExamResponse` — paragraph on the supernatural (equivocation) with AO2+AO3 integration modelled
  - `ExaminerExplainsScreen` — how to analyse equivocal language: spot the double meaning, name the technique, identify the effect on Macbeth and the dramatic effect on the audience

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness.
- **Proposed content:**
  - Retrieve from Episode 1: What is the witches' first paradox? ("Fair is foul, and foul is fair") — how does this predict the equivocal prophecies in 4.1?
  - Retrieve from Episode 3: What was Banquo's warning? ("instruments of darkness... win us with honest trifles, to betray's in deepest consequence") — does this describe exactly what happens in 4.1?
  - Whole-play link: "None of woman born" (4.1) → "Macduff was from his mother's womb / Untimely ripped" (5.8) — the equivocation completes; retrieve this for Episode 12
  - Whole-play link: "Something wicked this way comes" (4.1) ↔ Macbeth as "valiant cousin" (1.2) — the full arc of his transformation in a single comparison
  - Quick quiz: 4 questions
- **Suggested components:**
  - `QuickRecallScreen` — 4 rapid-fire questions: apparitions / equivocation / Macduff / context
  - `RecoveryQuizPlayer` — targeted recovery

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway (the witches complete the trap begun in Act 1; equivocation is the structural principle; Macduff emerges as the moral foil motivated by love not ambition) must be stated in Section 2 and modelled in Section 5. Students who understand equivocation can score AO3 marks on virtually any supernatural question.

2. **Section 2 — the three apparitions must be taught one by one with the gap explained:** The standard GCSE error is to say "the witches tell Macbeth he can't be killed." The correct analysis is: they give him prophecies that are literally true but designed to mislead. The VisualNarrativeScreen or ExplainReveal should teach each apparition as: what it says → what Macbeth hears → what it actually means.

3. **Section 3 — equivocation is the episode's most teachable AO3 point:** Henry Garnet and the Gunpowder Plot connection (already introduced in Episode 8's Porter scene) reaches its climax here. Students who can write "Shakespeare exploits the Jacobean context of equivocation — associated with Gunpowder Plot conspirator Henry Garnet — to show the witches' language is not just ambiguous but morally corrupt" are demonstrating Level 5 AO3 integration.

4. **Section 4 — "Something wicked this way comes" is the most efficient demonstration of Macbeth's arc:** A single line that compresses the entire transformation from victim to agent of evil. Students should be able to explain why this reversal is so significant and connect it to Act 1.

5. **Section 6 — retrieve Banquo's warning from Episode 3 explicitly:** The warning in 1.3 ("instruments of darkness... win us with honest trifles, to betray's in deepest consequence") is exactly what the witches do to Macbeth in 4.1. Students who make this connection are demonstrating that Banquo was right and Macbeth was warned. This is one of the best whole-play retrieval moves available.

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
