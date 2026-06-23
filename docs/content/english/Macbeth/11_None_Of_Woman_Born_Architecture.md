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
  - Retrieve from Episode 10: Why does Fleance's escape keep Macbeth insecure? What does "I am in blood" suggest about Macbeth's next choices?
  - Hook: "If someone told you the truth in a way that was designed to trick you, is it still a lie?" This primes the concept of equivocation before the apparitions
  - True/false: "The witches tell Macbeth he cannot be killed" / "Macduff was born outside the normal process" / "Macbeth attacks Macduff's household on the witches' orders" / "Malcolm's testing scene defines good kingship"
- **Suggested components:**
  - `ChapterHookScreen` — true/false targeting equivocation, Macduff and Malcolm misconceptions
  - `PriorKnowledgeRecall` — retrieve Banquo's warning, witches' paradoxes, Fleance's escape and Macbeth's blood-cycle logic
  - `MisconceptionCheck` — the witches do not lie plainly; Macbeth misreads technically truthful language

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the three scenes.
- **Proposed content:**
  - Act 4.1: Macbeth seeks out the witches; this reverses 1.3 because he approaches them, not vice versa
  - Act 4.1: The three apparitions: armed head (beware Macduff and foreshadowing violent conflict) / bloody child (none of woman born; links to Macduff's birth) / crowned child with tree (Birnam Wood; links to Malcolm and restoration)
  - Act 4.1: The show of kings confirms Banquo's line will continue; Macbeth has failed to control the future
  - Act 4.1: Macbeth learns Macduff has fled to England and decides to "seize upon Fife"
  - Act 4.1: "The firstlings of my heart shall be / The firstlings of my hand" — Macbeth has eliminated the gap between impulse and action
  - Act 4.2: Lady Macduff and her son; her husband's absence discussed; the scene humanises the household before Macbeth's tyranny reaches them
  - Act 4.3: Malcolm and Macduff in England; Malcolm tests Macduff's loyalty by falsely claiming vices; this proves Macduff's loyalty is to Scotland, not personal ambition
  - Act 4.3: Malcolm defines good kingship through the "king-becoming graces"
  - Act 4.3: Macduff learns what has happened to his family; "All my pretty ones?"; he must "feel it as a man" before turning grief into just action
  - "Something wicked this way comes" — the first witch's description of Macbeth before he arrives; the reversal is the clearest sign of his transformation
- **Suggested components:**
  - `VisualNarrativeScreen` — sequence: Macbeth seeks out witches → three apparitions → show of kings → firstlings decision → Lady Macduff and son → Malcolm tests Macduff → Macduff's grief → army prepares
  - `ExplainReveal` — the three apparitions one by one: what Macbeth hears vs what each one actually means
  - `TimelineChain` — Act 4 cause/effect: false security → impulsive tyranny → grief → resistance

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and AO3 context.
- **Proposed content:**
  - Theme: Supernatural — the witches' second visit is more sophisticated and more fatal than the first; equivocation as structural principle; Macbeth now seeks them out, so agency has reversed
  - Theme: Tyranny — Macbeth's Act 4 choices show rule through fear and private revenge; tyranny now damages innocent households as well as political enemies
  - Theme: Ambition → overconfidence — the equivocal prophecies create false security; Macbeth believes language has guaranteed his future
  - Theme: Macduff as moral foil — his motivation is love, grief and Scotland, not ambition; his response contrasts with Macbeth's emotional numbness and violence
  - Theme: Masculinity — Macduff's "I must also feel it as a man" challenges the brutal masculinity used by Lady Macbeth and Macbeth earlier in the play
  - Theme: Kingship — Malcolm's testing scene defines moral fitness to rule; good kingship requires virtues Macbeth lacks
  - Theme: Scotland as wounded body — "Bleed, bleed, poor country" and "blisters our tongues" present Macbeth's rule as national disease
  - Context: Equivocation and Henry Garnet (AO3) — the Jesuit doctrine of equivocation; Henry Garnet used it as a defence in the Gunpowder Plot trial; the Porter references equivocation in 2.3; the witches embody it structurally throughout the play
  - Context: Caesarean / unusual birth in Jacobean England (AO3) — "untimely ripped" makes Macduff outside the normal birth process; not magical, but enough to fulfil the prophecy's exact wording
  - Context: Tyranny and Jacobean kingship (AO3) — what distinguishes a king from a tyrant; Macbeth's Act 4 behaviour defines the tyrant by negative example, while Malcolm lists the "king-becoming graces"
- **Suggested components:**
  - `ExplainReveal` — equivocation in action: how each prophecy is literally true and fatally misleading; Henry Garnet connection; Porter scene retrieval
  - `TheoryCompareBlock` — Macbeth's first visit to the witches (1.3: witches approach him) vs second visit (4.1: he seeks them out and demands answers)
  - `ColSortBlock` — sort the three apparitions: what each one seems to promise / what it actually means / how it is fulfilled in Act 5
  - `SwipeSort` — Macbeth's tyranny vs Malcolm's good kingship virtues
  - `TheoryCompareBlock` — Macbeth's model of masculinity vs Macduff's humane masculinity

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis — the equivocation and foil quotes require careful AO2 analysis.
- **Proposed content:**
  - **"Something wicked this way comes"**: AO2: the witches' description of Macbeth before he arrives; reversal from 1.3 where they were the wicked figures approaching him; technique: structural irony + character reversal
  - **"Beware Macduff"**: AO2: blunt imperative; this is the direct warning Macbeth half-ignores because the later prophecies create false confidence
  - **"None of woman born / Shall harm Macbeth"**: AO2: ambiguity in "of woman born"; Macbeth hears "no human can harm me"; the trap is in the exact wording; technique: equivocation
  - **"Macbeth shall never vanquished be until / Great Birnam Wood... shall come against him"**: AO2: impossible-sounding condition; the word "until" creates a hidden possibility Macbeth refuses to imagine
  - **The show of kings:** AO2/stagecraft: repeated royal figures create a visual future Macbeth cannot control; the prophecy about Banquo's line survives
  - **"The firstlings of my heart shall be / The firstlings of my hand"**: AO2: repetition of "firstlings" creates speed and immediacy; heart/hand contrast collapses thought into action; whole-play link to Macbeth's long hesitation in 1.7
  - **"He wants the natural touch"**: AO2/AO1: Lady Macduff frames Macduff's absence as unnatural; this complicates him and links family order to natural order
  - **"Poor bird! thou'dst never fear the net nor lime"**: AO2: bird trap imagery makes Lady Macduff's son vulnerable and innocent; domestic innocence is caught in political tyranny
  - **"Bleed, bleed, poor country"**: AO2: personification of Scotland as wounded body; repetition intensifies suffering
  - **"This tyrant, whose sole name blisters our tongues"**: AO2: disease/burning imagery; Macbeth's name has become physically painful
  - **"Fit to govern? No, not to live"**: AO2/AO1: Macduff rejects morally unfit rule; the sharp correction shows his loyalty to Scotland's wellbeing
  - **"The king-becoming graces"**: AO3/AO1: Malcolm's list defines legitimate kingship by virtues Macbeth lacks
  - **"All my pretty ones? / Did you say all? O hell-kite! All?"**: AO2: repetition of "all" performs disbelief; rhetorical questions show grief struggling to process loss; "hell-kite" casts Macbeth as a predatory destroyer
  - **"He has no children"**: AO2: compressed ambiguity; Macbeth may lack parental understanding, and revenge cannot equal Macduff's loss
  - **"Give sorrow words; the grief that does not speak..."**: AO2: personification of grief; contrast between expressed grief and destructive suppression
  - **"I must also feel it as a man"**: AO2/AO1: Macduff redefines masculinity as emotional honesty plus action, not emotional denial
  - PQAC: students analyse "Something wicked this way comes" — how does this single line demonstrate Macbeth's transformation across the play?
  - PQAC extension: students analyse "I must also feel it as a man" as a challenge to the play's earlier ideas about masculinity
- **Suggested components:**
  - `MatchingTask` — match each apparition to what Macbeth hears / what it actually means / how it is fulfilled
  - `FillInTheBlanksBlock` — PQAC frames for "none of woman born", "All my pretty ones", "I must also feel it as a man" and "king-becoming graces"
  - `InteractiveCollectionExplorer` — browse supernatural, tyranny, kingship, Macduff and masculinity quotes across the play
  - `QuoteLadder` — equivocation quote → literal meaning → Macbeth's misreading → audience effect → whole-play fulfilment

### Section 5 — Exam Practice
- **Purpose:** AQA-style practice focused on the supernatural, Macduff, masculinity and kingship.
- **Proposed content:**
  - Question: "How does Shakespeare present the supernatural in Macbeth?" — key argument: compare 1.3 (witches tempt) with 4.1 (witches trap through false security via equivocation)
  - Key argument: The witches' equivocal prophecies are designed to be misread; the gap between what Macbeth hears and what the prophecies mean is the trap; equivocation as structural principle
  - Model paragraph: analysis of "None of woman born" as equivocation — AO2 (technique); AO3 (Henry Garnet / Gunpowder Plot; unusual birth context); whole-play link (fulfilled in 5.8)
  - Alternative question: "How does Shakespeare present Macduff?" — 4.2 complicates him through absence; 4.3 shows grief, loyalty and moral courage
  - Alternative question: "How does Shakespeare present kingship?" — use Malcolm's "king-becoming graces" and Macbeth's tyranny as the contrast
  - Alternative question: "How does Shakespeare present masculinity?" — contrast Lady Macbeth/Macbeth's brutal masculinity with Macduff's "feel it as a man"
  - Examiner warning: do not say the witches are wrong. Say their language is literally true but designed to mislead.
- **Suggested components:**
  - `GuidedExamResponse` — paragraph on the supernatural/equivocation with AO2+AO3 integration modelled
  - `ExaminerExplainsScreen` — how to analyse equivocal language: spot the double meaning, name the technique, identify the effect on Macbeth and the audience
  - `GuidedAnswerCoach` — paragraph comparing Macbeth and Macduff as foils
  - `FaceTheExaminer` — students identify why "Macduff is sad and wants revenge" is too simple, then upgrade it to grief + justice + masculinity + Scotland

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness.
- **Proposed content:**
  - Retrieve from Episode 1: What is the witches' first paradox? ("Fair is foul, and foul is fair") — how does this predict the equivocal prophecies in 4.1?
  - Retrieve from Episode 3: What was Banquo's warning? ("instruments of darkness... win us with honest trifles, to betray's in deepest consequence") — does this describe exactly what happens in 4.1?
  - Retrieve from Episode 8: How does the Porter scene introduce equivocation after Duncan's murder?
  - Retrieve from Episode 10: How does "I am in blood" explain Macbeth's faster and more impulsive behaviour in Act 4?
  - Whole-play link: "None of woman born" (4.1) → "Macduff was from his mother's womb / Untimely ripped" (5.8) — the equivocation completes; retrieve this for Episode 12
  - Whole-play link: "Something wicked this way comes" (4.1) ↔ Macbeth as "valiant cousin" (1.2) — the full arc of his transformation in a single comparison
  - Whole-play link: "I must also feel it as a man" (4.3) ↔ "Are you a man?" (1.7/3.4) — Shakespeare revises the play's model of masculinity
  - Whole-play link: Malcolm's "king-becoming graces" ↔ Duncan's legitimate kingship ↔ Macbeth's tyranny
  - Quick quiz: 6 questions covering apparitions, equivocation, Macduff, Malcolm, context and whole-play links
- **Suggested components:**
  - `QuickRecallScreen` — 6 rapid-fire questions: apparitions / equivocation / Macduff / Malcolm / context / whole-play links
  - `MatchingTask` — match Act 4 quotes to earlier and later whole-play moments
  - `RecoveryQuizPlayer` — targeted recovery for misconceptions about witches, Macduff, Malcolm and masculinity

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

### Fixed content gaps in this revision

- Strengthened the show of kings as a stage image proving Banquo's line survives.
- Made the apparition symbolism less reductive: armed head, bloody child and crowned child/tree now each carry symbolic meaning.
- Added Lady Macduff and her son as more than plot victims: their scene now teaches innocence, domestic order and Macduff's complication.
- Added Malcolm's testing scene as a kingship lesson, not a slow side-scene.
- Added "king-becoming graces", "Bleed, bleed, poor country", "This tyrant... blisters our tongues" and "Fit to govern? No, not to live".
- Added Macduff's masculinity correction: "I must also feel it as a man".
- Strengthened AQA routes for kingship, masculinity and Scotland, not just supernatural/tyranny.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway must include three linked movements: the witches trap Macbeth through equivocation; Macbeth acts faster and more tyrannically; Macduff and Malcolm define the moral alternative.

2. **Section 2 — the three apparitions must be taught one by one with the gap explained:** The standard GCSE error is to say "the witches tell Macbeth he can't be killed." The correct analysis is: they give him prophecies that are literally true but designed to mislead.

3. **Section 2 — the show of kings must not be skipped:** It is the direct payoff to Episode 9's "fruitless crown" anxiety. Macbeth's violence has not stopped Banquo's future.

4. **Section 3 — Malcolm is not optional:** The testing scene is essential for kingship questions because it defines moral fitness to rule. Build it as a fast, clear contrast: Macbeth = tyrant; Malcolm = tested legitimate ruler.

5. **Section 3 — equivocation is the episode's most teachable AO3 point:** Henry Garnet and the Gunpowder Plot connection reaches its climax here. Keep it embedded in language analysis, not as a detached history paragraph.

6. **Section 4 — "Something wicked this way comes" is the most efficient demonstration of Macbeth's arc:** A single line compresses the transformation from celebrated warrior to active evil.

7. **Section 4 — Macduff's grief is a masculinity lesson:** "I must also feel it as a man" should be directly compared with Lady Macbeth's earlier use of "manhood" as emotional suppression and violence.

8. **Section 6 — retrieve Banquo's warning from Episode 3 explicitly:** The warning in 1.3 is exactly what the witches do to Macbeth in 4.1. This is one of the strongest whole-play retrieval moves available.

---

## 10-point Module Completion Test

- [ ] Students can narrate Act 4.1, 4.2 and 4.3 from memory (Section 2)
- [ ] Students can explain all three apparitions as equivocal language (Section 2 or 4)
- [ ] Students can explain the show of kings and link it to Banquo's line (Section 2 or 6)
- [ ] Students can name and explain at least 2 themes from the episode (Section 3)
- [ ] Students can identify at least 1 key AO3 context point and link it to the text (Section 3)
- [ ] Students have actively retrieved at least 4 key quotes from the episode (Section 4)
- [ ] Students can analyse each key quote using Point → Quote → Analysis → Context (Section 4)
- [ ] Students can explain why Malcolm's testing scene matters for kingship (Section 3 or 5)
- [ ] Students have practised at least one AQA-style written response (Section 5)
- [ ] Students can connect Act 4 to at least four wider-play moments: 1.2, 1.3, 2.3, 3.1, 3.4, 5.8 (Section 6)
