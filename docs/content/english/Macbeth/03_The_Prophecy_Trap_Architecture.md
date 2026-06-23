# Episode 3: The prophecy trap — Architecture

## 1. Identity (brief)

- **Episode:** 3 of 12
- **Title:** The prophecy trap
- **Primary acts:** Act 1, Scene 3
- **Build status:** Not yet built

Content, Storyline, Specification requirements and the full Content reference pack: see `03_The_Prophecy_Trap_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Surface existing knowledge, create narrative tension, prime retrieval.
- **Proposed content for this episode:**
  - Retrieval from Episodes 1 and 2: What is equivocation? What did the witches establish? What is Macbeth's reputation so far?
  - Hook: "If someone told you that you were going to be king, what would you do?" (engagement)
  - True/false: "The witches give Macbeth a direct command to kill Duncan" / "Banquo reacts to the prophecies the same way as Macbeth"
- **Suggested components:**
  - `ChapterHookScreen` — true/false with the critical misconception (witches command Macbeth) targeted first
  - `PriorKnowledgeRecall` — retrieve Episode 1 and 2 content

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the scene.
- **Proposed content:**
  - The witches wait on the heath; they talk about their power (one has followed a sailor)
  - Macbeth and Banquo arrive; the witches' triple address to Macbeth
  - Three prophecies: Glamis (true), Cawdor (about to be confirmed), King (future)
  - Banquo's paradoxical prophecies: "Lesser than Macbeth, and greater / Not so happy, yet much happier"
  - Ross and Angus arrive: confirm the Cawdor title → first prophecy immediately true
  - The trap mechanism: one prophecy true already + one confirmed = why wouldn't the third be true?
  - Macbeth's aside: "horrid image" — the murderous thought is already present
- **Suggested components:**
  - `TimelineChain` — sequence: witches wait → Macbeth and Banquo arrive → prophecies delivered → Ross confirms Cawdor → Macbeth's aside → decision not yet made
  - `ExplainReveal` — the mechanics of the prophecy trap: why Macbeth is susceptible

### Section 3 — Theme & Context
- **Purpose:** Connect the scene to major themes and AO3 context.
- **Proposed content:**
  - Theme: Fate vs free will — the central tension of the scene; Macbeth's aside proves the choice is his
  - Theme: Supernatural — the witches as tempters, not controllers; the ambiguity of their nature
  - Theme: Ambition — the aside reveals pre-existing ambition; the witches reveal, not create it
  - Context: King James I's *Daemonologie*; genuine Jacobean fear of witchcraft; temptation theology
  - Context: Equivocation — introduced through the witches' paradoxical prophecies; connection to Gunpowder Plot context
  - Banquo as foil: his scepticism ("instruments of darkness") reveals that Macbeth's response is a character choice
- **Suggested components:**
  - `TheoryCompareBlock` — Macbeth's response vs Banquo's response to identical information
  - `ColSortBlock` — "fatally tempted" vs "wisely sceptical" — sort statements about each character
  - `SwipeSort` — sort claims: "The witches control Macbeth" vs "Macbeth controls himself" — natural/supernatural

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis of key quotes.
- **Proposed content:**
  - **"All hail, Macbeth, that shalt be king hereafter"**: the climactic third prophecy; "hereafter" = in the future (not now); AO2: the temporal ambiguity is the trap
  - **"Instruments of darkness tell us truths"**: Banquo's warning; AO2: metaphor ("instruments" = tools); "truths" (plural) = small truths used to betray in large ways; whole-play link: exactly what happens in 4.1
  - **"horrid image"**: Macbeth's aside; the word "horrid" signals moral revulsion that does not prevent action; AO2: aside as dramatic technique — the audience knows what Macbeth is thinking before any other character does
  - **"nothing is but what is not"**: syntactical inversion; reality and imagination have merged; AO2: the grammar performs the psychological fragmentation
  - **"Cannot be ill, cannot be good"**: moral paralysis stated plainly; AO2: chiasmus; the neat balance of the phrase contrasts with the psychological chaos it describes
  - PQAC: students analyse "instruments of darkness" — full Point → Quote → Analysis → Context frame
- **Suggested components:**
  - `MatchingTask` — match quote to speaker to technique to theme
  - `FillInTheBlanksBlock` — complete PQAC for "instruments of darkness" or "horrid image"
  - `InteractiveCollectionExplorer` — browse quotes by theme: fate vs free will / supernatural / ambition

### Section 5 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness before the final exam-prep section.
- **Proposed content:**
  - Retrieve from Episode 1: What is "Fair is foul"? How does the paradox connect to the witches' prophecies in 1.3?
  - Retrieve from Episode 2: How does the Captain's description of Macbeth in Act 1.2 make the aside in 1.3 more significant? (ambition was already embedded in the violence)
  - Wider link: Where does Banquo's warning ("instruments of darkness") prove true? (Episode 11, 4.1)
  - Quick quiz: 4 questions on quotes, themes, techniques and context from this episode
- **Suggested components:**
  - `QuickRecallScreen` — 4 rapid-fire retrieval questions
  - `RecoveryQuizPlayer` — targeted recovery for weak items

### Section 6 — Exam Practice
- **Purpose:** Final AQA-style practice moment. The final navigation/progress dot must land on exam prep.
- **Proposed content:**
  - Question: "How does Shakespeare present the supernatural?" (extract from Act 1.3)
  - Key argument: the supernatural in 1.3 does not plant the idea of murder — it *reveals* pre-existing ambition (the aside proves this)
  - Model paragraph: Banquo's "instruments of darkness" speech — use it to argue that Shakespeare presents the supernatural as exploiting weakness, not creating it
  - Second paragraph planning: the contrast with 4.1 (where Macbeth actively seeks supernatural reassurance) shows the relationship between Macbeth and the witches reversing
- **Suggested components:**
  - `GuidedExamResponse` — staged response: identify the argument; choose the quote; write the analysis; add context
  - `FaceTheExaminer` — students write a paragraph independently, then see the mark scheme framing

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway (the prophecies reveal, not create, Macbeth's ambition; Banquo's contrast proves Macbeth's response is a choice) must be the spine of Section 3 and Section 6. The Section 3 contrast activity (Macbeth vs Banquo) should crystallise this explicitly. Section 6's model paragraph should demonstrate the argument, not just quote analysis.

2. **Section 1 — lead with the primary misconception:** "The witches made Macbeth commit murder" is the most damaging misconception in Macbeth study. The ChapterHookScreen must target it immediately. The reveal must use the aside as evidence.

3. **Section 2 — the trap mechanism must be taught explicitly:** Students need to understand *why* Macbeth is susceptible (the immediate confirmation of the first two prophecies). This is not just plot — it is the mechanics of equivocation. A VisualLearning or ExplainReveal sequence should make this explicit.

4. **Section 4 — prioritise "instruments of darkness" and the aside:** These two quotes carry the episode's core argument. The "instruments of darkness" quote is Banquo's most important speech; the aside is the most important evidence of Macbeth's pre-existing ambition. Both require full PQAC treatment.

5. **This is a Very High retrieval priority episode:** Section 5 retrieval should be substantial. Consider a 5-question QuickRecallScreen rather than 3, given the density of this episode's exam value.

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
