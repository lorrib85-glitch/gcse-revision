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
  - Retrieve from Episode 8: What unnatural events followed Duncan's murder? What is the Great Chain of Being? What happened to Malcolm and Donalbain?
  - Retrieve from Episode 7: What is the Neptune speech? What is the blood motif? What does "Macbeth does murder sleep" mean?
  - Hook: "You've got what you always wanted. Why does it feel like nothing?" (activates the psychological paradox at the heart of 3.1)
  - True/false: "Macbeth is now secure because he is king" / "Lady Macbeth plans the murder of Banquo" / "Macbeth murders Banquo because the witches tell him to"
- **Suggested components:**
  - `ChapterHookScreen` — true/false targeting the misconception that power = security
  - `PriorKnowledgeRecall` — retrieve "fruitless crown" and prior-episode quotes

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the scene.
- **Proposed content:**
  - Banquo's opening soliloquy: he suspects Macbeth but expects his own descendants to be kings ("Thou hast it now: king, Cawdor, Glamis, all / As the weird women promised")
  - Macbeth's soliloquy: "To be thus is nothing, but to be safely thus" — the crown is worthless without security
  - Macbeth's fear of Banquo: "Our fears in Banquo stick deep" — "fruitless crown" / "barren sceptre" — the Banquo line will inherit, not Macbeth's
  - "Mine eternal jewel / Given to the common enemy of man" — the soul traded for a barren sceptre
  - Macbeth recruits the murderers using emotional manipulation (the same technique Lady Macbeth used on him in 1.7)
  - Lady Macbeth is present but excluded from the plot: "Be innocent of the knowledge, dearest chuck"
  - The independent decision: this is the first murder Macbeth plans without Lady Macbeth's direction
- **Suggested components:**
  - `VisualNarrativeScreen` — sequence: Banquo's suspicion → Macbeth's soliloquy ("nothing") → fear of Banquo's line → manipulation of murderers → exclusion of Lady Macbeth
  - `ExplainReveal` — why the "fruitless crown" image is devastating: the agricultural imagery connects to Duncan's "plant thee" (1.4) but now in defeat

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and AO3 context.
- **Proposed content:**
  - Theme: Power — "to be thus is nothing" is the most direct statement that power without security is meaningless; ambition is self-defeating
  - Theme: Ambition — achieving the crown has not satisfied Macbeth but generated new fears; ambition as a cycle, not a destination
  - Theme: Tyranny — 3.1 is where Macbeth acts autonomously and orders murder without prompting; this is the birth of the tyrant
  - Theme: Guilt and fear — "Our fears in Banquo stick deep" shows fear is structural, not surface anxiety
  - Theme: Isolation — Macbeth begins excluding Lady Macbeth; their relationship begins to fracture
  - Context: Kingship and succession (AO3) — in Jacobean England, legitimate succession was everything; Macbeth's childlessness and Banquo's prophesied line are political crises, not just personal anxieties
  - Context: Banquo and James I (AO3) — James I claimed descent from Banquo; the prophecy that Banquo's descendants would be kings is a compliment to the king watching the play; Macbeth's attempt to murder that line makes his villainy explicit to the original audience
- **Suggested components:**
  - `ExplainReveal` — the Banquo/James I lineage context: how the prophesied line made Macbeth's villainy more pointed for a Jacobean audience
  - `TheoryCompareBlock` — Macbeth as influenced murderer (Acts 1–2) vs independent tyrant (Act 3 onwards)
  - `ColSortBlock` — sort consequences of becoming king: what Macbeth has gained / what he has lost / what he fears

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis.
- **Proposed content:**
  - **"To be thus is nothing, but to be safely thus"**: AO2: the repetition of "thus" creates a tautology (being king is only being king if it feels secure); "nothing" is devastating — achievement without safety is meaningless; technique: soliloquy reveals the gap between external success and internal despair
  - **"Our fears in Banquo stick deep"**: AO2: the verb "stick" is physical — fear embedded like a splinter; "deep" extends the image underground; the preposition "in" makes fear internal, not surface; contrast with Act 1 where his fears were moral, not political
  - **"Fruitless crown" / "barren sceptre"**: AO2: agricultural/fertility imagery; "fruitless" and "barren" both imply sterility; the phallic connotation of "sceptre" being "barren" reinforces the theme of impotent power; whole-play link: connects to Duncan's "plant thee" (1.4) now in reverse — the plant has not grown
  - **"Mine eternal jewel / Given to the common enemy of man"**: AO2: the soul described as a precious jewel — the value comparison makes the trade devastating; "common enemy of man" = the devil (conventional Jacobean phrase); the "given" implies a completed transaction; he has sold his soul
  - **"For Banquo's issue have I filed my mind"**: AO2: "filed" means defiled, contaminated; the anaphora of "for them" / "for Banquo's issue" performs the treadmill of paranoid logic — every crime benefits someone else; this is Macbeth's clearest statement of the futility of his ambition
  - PQAC: students analyse "To be thus is nothing, but to be safely thus" — what does this reveal about the nature of ambition and power?
- **Suggested components:**
  - `MatchingTask` — match quote to technique to theme to whole-play link
  - `FillInTheBlanksBlock` — PQAC frames for "fruitless crown / barren sceptre" and "eternal jewel"
  - `InteractiveCollectionExplorer` — browse ambition and power quotes across the play

### Section 5 — Exam Practice
- **Purpose:** AQA-style practice focused on tyranny and ambition.
- **Proposed content:**
  - Question: "How does Shakespeare present Macbeth as a tyrant in Macbeth?" — Act 3.1 is the primary evidence for autonomous tyranny; compare with the influenced murderer of Acts 1–2
  - Key argument: Act 3.1 is the moment when Macbeth becomes a tyrant rather than a victim of external forces; he acts alone, manipulates others, and demonstrates that achieving power only generates new fears
  - Model paragraph: "To be thus is nothing" as AO2 — technique (soliloquy; repetition of "thus"); effect (reveals the self-defeating nature of ambition); AO3 context (Jacobean succession anxieties; Banquo/James I); whole-play link (from "vaulting ambition" in 1.7 to "Tomorrow" in 5.5)
  - Alternative question: "How does Shakespeare present the theme of power in Macbeth?" — same core evidence; different framing
- **Suggested components:**
  - `GuidedExamResponse` — scaffolded paragraph on tyranny / the self-defeating nature of power
  - `ExaminerExplainsScreen` — how to integrate the Banquo/James I AO3 context without writing a history essay (one embedded sentence)

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness.
- **Proposed content:**
  - Retrieve from Episode 3: What was the prophecy about Banquo's descendants? How does the "fruitless crown" confirm Macbeth understood the prophecy all along?
  - Retrieve from Episode 6: How does Lady Macbeth's manipulation of Macbeth in 1.7 compare to his manipulation of the murderers in 3.1?
  - Whole-play link: Episode 11 (4.1) — the Banquo lineage confirmed in the eight kings apparition; Macbeth's murder of Banquo failed to stop the prophecy
  - Whole-play link: "To be thus is nothing" (3.1) ↔ "Tomorrow, and tomorrow, and tomorrow" (5.5) — the arc from hollow achievement to nihilism
  - Quick quiz: 4 questions
- **Suggested components:**
  - `QuickRecallScreen` — 4 rapid-fire questions on quotes, themes, context, techniques
  - `RecoveryQuizPlayer` — targeted recovery

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway (power is self-defeating; achieving the crown only generates new fears; Macbeth acts as a tyrant for the first time) should be stated in Section 2 as the episode's central argument and reinforced in Section 5. Students must understand that 3.1 is the transition point from influenced murderer to independent tyrant.

2. **Section 2 — the exclusion of Lady Macbeth must be highlighted:** "Be innocent of the knowledge, dearest chuck" is the moment when the partnership ends. This is not just a plot point — it is the structural explanation for why they deteriorate separately in Episode 10. The VisualNarrativeScreen should mark this as a pivot moment.

3. **Section 3 — the Banquo/James I context is one of the most accessible AO3 points in the play:** It requires no complex background and has immediate dramatic relevance (Macbeth's villainy is sharpened for an audience that knows James I is in the room). The ExplainReveal should make this chain clear and memorable.

4. **Section 4 — "fruitless crown / barren sceptre" is the episode's richest AO2 cluster:** The paired imagery of sterility is one of the most technically dense moments in the play. Students who can identify both terms, name the shared technique (agricultural/fertility metaphor), and connect to Duncan's "plant thee" (1.4) are demonstrating Level 4 AO2+AO1 integration.

5. **Section 6 — the "to be thus is nothing" → "Tomorrow" arc is the whole-play spine:** Students who can trace Macbeth's relationship with achievement from the hollow crown in 3.1 to nihilism in 5.5 are demonstrating the highest-level whole-play awareness. This connection should be seeded here and retrieved in Episode 12.

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
