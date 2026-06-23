# Episode 9: To be safely thus — Architecture

## 1. Identity (brief)

- **Episode:** 9 of 12
- **Title:** To be safely thus
- **Primary acts:** Act 3 Scene 1
- **Build status:** Not yet built

Content, Storyline, Specification requirements and the full Content reference pack: see `09_To_Be_Safely_Thus_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Surface existing knowledge; prime retrieval.
- **Proposed content:**
  - Retrieve from Episode 8: What unnatural events followed Duncan's murder? What is the Great Chain of Being? Why does regicide break divine order?
  - Retrieve from Episode 7: What is the Neptune speech? What is the blood motif? What does "Macbeth does murder sleep" mean?
  - Retrieve from Episode 3: What did the witches predict for Banquo's descendants?
  - Hook: "You've got what you always wanted. Why does it feel like nothing?" This activates the psychological paradox at the heart of 3.1.
  - True/false: "Macbeth is now secure because he is king" / "Lady Macbeth plans the Banquo plot" / "Macbeth acts because the witches directly instruct him" / "Banquo has no interest in the prophecy anymore"
- **Suggested components:**
  - `ChapterHookScreen` — true/false targeting the misconception that power = security
  - `PriorKnowledgeRecall` — retrieve Banquo's prophecy, Duncan's murder, sleep/guilt and natural order
  - `MisconceptionCheck` — Macbeth chooses to act; the witches predict but do not instruct

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the scene.
- **Proposed content:**
  - Banquo's opening soliloquy: he suspects Macbeth — "Thou hast it now: king, Cawdor, Glamis, all" / "I fear / Thou play'dst most foully for't"
  - Banquo also remembers that the prophecy may benefit his own line — "May they not be my oracles as well"; he is morally better than Macbeth, but not ambition-free
  - Macbeth performs public kingship: he politely invites Banquo to the feast and calls him his "chief guest"
  - Macbeth's private soliloquy: "To be thus is nothing, but to be safely thus" — the crown is worthless without security
  - Macbeth's fear of Banquo: "Our fears in Banquo stick deep"; Banquo has moral courage, wisdom and a prophesied line
  - "Fruitless crown" / "barren sceptre" — the Banquo line will inherit, not Macbeth's
  - "Mine eternal jewel / Given to the common enemy of man" — Macbeth recognises the spiritual cost of what he has done
  - Macbeth recruits the murderers using grievance and masculinity: "Both of you / Know Banquo was your enemy" and "Ay, in the catalogue ye go for men"
  - Fleance matters because succession is the real threat; Banquo alone is not enough
  - **Accuracy note:** Lady Macbeth is not present in the 3.1 murder planning. "Be innocent of the knowledge, dearest chuck" belongs to Act 3 Scene 2 and should be used only as the follow-on relationship link.
  - The independent decision: this is the first later killing Macbeth plans without Lady Macbeth's direction
- **Suggested components:**
  - `VisualNarrativeScreen` — sequence: Banquo's suspicion → Macbeth's public mask → Macbeth's soliloquy ("nothing") → fear of Banquo's line → manipulation of murderers → Fleance as future threat
  - `ExplainReveal` — why the "fruitless crown" image is devastating: the agricultural/fertility imagery connects to Duncan's "plant thee" (1.4) but now in defeat
  - `TheoryCompareBlock` — Macbeth before crown vs Macbeth after crown

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and AO3 context.
- **Proposed content:**
  - Theme: Power — "to be thus is nothing" is the most direct statement that power without security is meaningless; ambition is self-defeating
  - Theme: Ambition — achieving the crown has not satisfied Macbeth but generated new fears; ambition as a cycle, not a destination
  - Theme: Tyranny — 3.1 is where Macbeth acts autonomously and orders violence without prompting; this is the birth of the tyrant
  - Theme: Appearance and reality — Macbeth publicly honours Banquo while privately plotting against him
  - Theme: Guilt and fear — "Our fears in Banquo stick deep" shows fear is structural, not surface anxiety
  - Theme: Masculinity — Macbeth now uses the same gender-pressure tactic Lady Macbeth used on him in 1.7
  - Theme: Isolation — Lady Macbeth is not part of the 3.1 plan; 3.2 later makes the split explicit
  - Context: Divine right and kingship (AO3) — a king should protect order; Macbeth uses kingship for private security, making him a tyrant rather than a legitimate ruler
  - Context: Succession (AO3) — in Jacobean England, legitimate succession was politically important; Macbeth's lack of an heir and Banquo's prophesied line make his kingship insecure
  - Context: Banquo and James I (AO3) — James I claimed descent from Banquo; the prophecy that Banquo's descendants would be kings is a compliment to the king watching the play; Macbeth's attack on that line sharpens his villainy for the original audience
- **Suggested components:**
  - `ExplainReveal` — the Banquo/James I lineage context: how the prophesied line made Macbeth's villainy more pointed for a Jacobean audience
  - `TheoryCompareBlock` — Macbeth as influenced murderer (Acts 1–2) vs independent tyrant (Act 3 onwards)
  - `ColSortBlock` — sort consequences of becoming king: what Macbeth has gained / what he has lost / what he fears
  - `SwipeSort` — legitimate king vs tyrant behaviours

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis.
- **Proposed content:**
  - **"Thou hast it now: king, Cawdor, Glamis, all" / "I fear / Thou play'dst most foully for't"**: AO2: list structure makes Macbeth's rise sound complete, but "fear" turns fulfilment into suspicion; Banquo becomes a moral witness
  - **"May they not be my oracles as well"**: AO2/AO1: Banquo thinks about his own promised future, which complicates him; he is a foil to Macbeth because he feels temptation but does not act in the same way
  - **"Fail not our feast" / "chief guest"**: AO2: dramatic irony; Macbeth's polite public language contrasts with the private plot
  - **"To be thus is nothing, but to be safely thus"**: AO2: repetition of "thus" creates a tautology; "nothing" makes kingship feel empty; soliloquy reveals the gap between external success and internal fear
  - **"Our fears in Banquo stick deep"**: AO2: the verb "stick" is physical — fear embedded like a splinter or wound; "deep" suggests something rooted and difficult to remove
  - **"Fruitless crown" / "barren sceptre"**: AO2: agricultural/fertility imagery; "fruitless" and "barren" imply sterility; the phallic connotation of "sceptre" being "barren" reinforces the theme of impotent power; whole-play link to Duncan's "plant thee" (1.4)
  - **"Mine eternal jewel / Given to the common enemy of man"**: AO2/AO3: the soul is described as a precious jewel; "common enemy of man" = the devil; Macbeth knows the spiritual cost of his crime
  - **"For Banquo's issue have I filed my mind"**: AO2: "filed" means defiled or polluted; the repeated "for them" logic shows Macbeth's paranoia that every crime benefits Banquo's descendants
  - **"Ay, in the catalogue ye go for men"**: AO2: Macbeth weaponises masculinity; the following animal catalogue reduces identity to rank and breed; whole-play link to Lady Macbeth's manipulation in 1.7
  - **"Fleance his son... must embrace the fate / Of that dark hour"**: AO1/AO2: Fleance represents the future; "dark hour" creates ominous secrecy
  - PQAC: students analyse "To be thus is nothing, but to be safely thus" — what does this reveal about the nature of ambition and power?
  - PQAC extension: students compare Lady Macbeth's "When you durst do it, then you were a man" with Macbeth's "Ay, in the catalogue ye go for men"
- **Suggested components:**
  - `MatchingTask` — match quote to technique to theme to whole-play link
  - `FillInTheBlanksBlock` — PQAC frames for "fruitless crown / barren sceptre", "eternal jewel" and masculinity manipulation
  - `InteractiveCollectionExplorer` — browse ambition, power, masculinity and Banquo quotes across the play
  - `QuoteLadder` — move from simple quote meaning to Grade 7–9 interpretive analysis

### Section 5 — Exam Practice
- **Purpose:** AQA-style practice focused on insecurity, tyranny and ambition.
- **Proposed content:**
  - AQA-style question: "Starting with this extract, explore how Shakespeare presents Macbeth as insecure after becoming king. Write about how Shakespeare presents Macbeth in this extract and in the play as a whole."
  - Alternative question: "How does Shakespeare present Macbeth as a tyrant in Macbeth?" — Act 3.1 is the primary evidence for autonomous tyranny; compare with the influenced murderer of Acts 1–2
  - Alternative question: "How does Shakespeare present the theme of power in Macbeth?" — same core evidence; different framing
  - Key argument: Act 3.1 is the moment when Macbeth becomes a tyrant rather than a victim of external forces; he acts alone, manipulates others, and demonstrates that achieving power only generates new fears
  - Model paragraph: "To be thus is nothing" as AO2 — technique (soliloquy; repetition of "thus"); effect (reveals the self-defeating nature of ambition); AO3 context (Jacobean succession anxieties; Banquo/James I); whole-play link (from "vaulting ambition" in 1.7 to "Tomorrow" in 5.5)
  - Examiner warning: do not write a context paragraph about James I detached from the quote; embed it in the argument about succession and Macbeth's villainy
  - SPaG nudge: use precise terms — tyrant, succession, soliloquy, dramatic irony, sterile imagery, Jacobean audience
- **Suggested components:**
  - `GuidedExamResponse` — scaffolded paragraph on insecurity / tyranny / the self-defeating nature of power
  - `ExaminerExplainsScreen` — how to integrate Banquo/James I AO3 context without writing a history essay
  - `FaceTheExaminer` — show why retelling the plot caps marks; analysis must connect extract and whole play
  - `GuidedAnswerCoach` — build one paragraph from Point → Quote → Analysis → Context → whole-play link

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness.
- **Proposed content:**
  - Retrieve from Episode 3: What was the prophecy about Banquo's descendants? How does the "fruitless crown" confirm Macbeth understood the prophecy all along?
  - Retrieve from Episode 6: How does Lady Macbeth's manipulation of Macbeth in 1.7 compare to Macbeth's manipulation of the murderers in 3.1?
  - Retrieve from Episode 7: How does "Macbeth does murder sleep" link to "To be thus is nothing"?
  - Whole-play link: Episode 10 (3.2–3.4) — Macbeth's paranoia becomes "O, full of scorpions is my mind" and then erupts publicly through Banquo's ghost
  - Whole-play link: Episode 11 (4.1) — the Banquo lineage is confirmed in the eight kings apparition; Macbeth's attempt to control succession fails
  - Whole-play link: Episode 12 (5.5) — "To be thus is nothing" ↔ "Tomorrow, and tomorrow, and tomorrow"; the arc from hollow achievement to nihilism
  - Quick quiz: 6 questions covering plot, quote, AO2, AO3, misconception, whole-play link
- **Suggested components:**
  - `QuickRecallScreen` — 6 rapid-fire questions on quotes, themes, context, techniques
  - `MatchingTask` — match 3.1 quotes to earlier/later whole-play links
  - `RecoveryQuizPlayer` — targeted recovery for misconceptions about witches, Lady Macbeth and Banquo

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

### Fixed content gaps in this revision

- Corrected the misplaced quote: "Be innocent of the knowledge, dearest chuck" is Act 3 Scene 2, not Act 3 Scene 1.
- Added Banquo's opening suspicion and his own awareness of the prophecy.
- Added Macbeth's public/private contrast with Banquo at the feast invitation.
- Added Fleance as the succession threat, not just Banquo.
- Added Macbeth's masculinity manipulation of the murderers and the link back to Lady Macbeth in 1.7.
- Added proxy violence as a key sign of developing tyranny.
- Strengthened AQA extract-to-whole-play practice and AO3 integration.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway (power is self-defeating; achieving the crown only generates new fears; Macbeth acts as a tyrant for the first time) should be stated in Section 2 as the episode's central argument and reinforced in Section 5. Students must understand that 3.1 is the transition point from influenced murderer to independent tyrant.

2. **Section 2 — keep Act 3 Scene 1 accurate:** Do not put "Be innocent of the knowledge" inside the main 3.1 plot sequence. Use it as a forward link to 3.2 only. In 3.1, the key relationship point is Lady Macbeth's absence from the Banquo plot.

3. **Section 2 — the public mask matters:** Macbeth's invitation to Banquo must be taught before the soliloquy. This lets students see Shakespeare's structure: public performance first, private paranoia second.

4. **Section 3 — the Banquo/James I context is one of the most accessible AO3 points in the play:** It requires no complex background and has immediate dramatic relevance. The ExplainReveal should make this chain clear and memorable: Banquo's descendants → James I → Macbeth attacking that line = sharpened villainy.

5. **Section 4 — "fruitless crown / barren sceptre" is the episode's richest AO2 cluster:** The paired imagery of sterility is one of the most technically dense moments in the play. Students who can identify both terms, name the shared technique, and connect to Duncan's "plant thee" (1.4) are demonstrating strong AO2/AO1 integration.

6. **Section 4 — masculinity manipulation is the best comparison point:** Macbeth's "catalogue" of men should be explicitly linked to Lady Macbeth's "When you durst do it". This gives students a strong whole-play pattern: manipulation → learned behaviour → tyranny.

7. **Section 6 — the "to be thus is nothing" → "Tomorrow" arc is the whole-play spine:** Students who can trace Macbeth's relationship with achievement from the hollow crown in 3.1 to nihilism in 5.5 are demonstrating high-level whole-play awareness. This connection should be seeded here and retrieved in Episode 12.

---

## 10-point Module Completion Test

- [ ] Students can narrate the episode's plot from memory, including Banquo's suspicion, Macbeth's public mask, the soliloquy and the hired murderers (Section 2)
- [ ] Students can name and explain at least 2 themes from the episode (Section 3)
- [ ] Students can identify at least 1 key AO3 context point and link it to the text (Section 3)
- [ ] Students have actively retrieved at least 4 key quotes from the episode (Section 4)
- [ ] Students can analyse each key quote using Point → Quote → Analysis → Context (Section 4)
- [ ] Students can identify and name at least 2 language/structural techniques from the episode (Section 4)
- [ ] Students understand that Lady Macbeth does not plan Banquo's murder in 3.1 (Section 2 or 6)
- [ ] Students have practised at least one AQA-style written response (Section 5)
- [ ] Students have been shown or produced a mark-scheme-aware paragraph (Section 5)
- [ ] Students can connect 3.1 to at least three wider-play moments: 1.3, 1.7, 3.2, 4.1 or 5.5 (Section 6)
