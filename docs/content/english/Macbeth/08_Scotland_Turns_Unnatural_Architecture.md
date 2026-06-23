# Episode 8: Scotland turns unnatural — Architecture

## 1. Identity (brief)

- **Episode:** 8 of 12
- **Title:** Scotland turns unnatural
- **Primary acts:** Act 2 Scenes 3 and 4
- **Build status:** Not yet built

Content, Storyline, Specification requirements and the full Content reference pack: see `08_Scotland_Turns_Unnatural_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Surface existing knowledge; prime retrieval.
- **Proposed content:**
  - Retrieve from Episode 7: What happened immediately after the murder? What is the blood motif? What is the Neptune speech?
  - Hook: "If a king is murdered, what do you think the natural world would do?" (activates prior cultural intuition; primes the Great Chain of Being)
  - True/false: "The murder of Duncan is just a personal crime" / "The Porter scene is irrelevant to the themes" / "Duncan's murder causes unusual events in nature"
- **Suggested components:**
  - `ChapterHookScreen` — true/false targeting Great Chain of Being misconceptions
  - `PriorKnowledgeRecall` — retrieve blood motif quotes from Episode 7

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the scenes.
- **Proposed content:**
  - Act 2.3: The knocking; the Porter's comedy (who is at the gate of hell?); Macduff and Lennox enter; Macbeth greets them; Macduff discovers the body; alarm; Macbeth kills the grooms; Malcolm and Donalbain flee; Lady Macbeth faints
  - Macbeth kills the grooms before they can speak, claiming it was out of loyal fury. This is his first public act of deception after Duncan's murder and shows how quickly one murder creates the need for another
  - Act 2.4: The Old Man and Ross discuss the unnatural events; the falcon/owl; the horses; dark night; Macduff tells Ross that Macbeth has gone to Scone to be crowned
  - Macduff refuses to go to Scone for Macbeth's coronation, choosing instead to return to Fife. This quietly marks him as suspicious of Macbeth and begins his movement from observer to opponent
  - The Porter's equivocator reference: timing and significance
  - The dramatic structure: comedy (Porter) → discovery (Macduff) → chaos → flight → unnaturalness
- **Suggested components:**
  - `VisualNarrativeScreen` — scene sequence: knocking → Porter's comedy → discovery → chaos → unnaturalness
  - `ExplainReveal` — the Great Chain of Being: how regicide breaks every level of the hierarchy

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and AO3 context.
- **Proposed content:**
  - Theme: Natural order — for many Jacobean audience members, these events would not feel like simple metaphor; they would suggest that regicide had disturbed God's natural order
  - Theme: Religion and kingship — "most sacrilegious murder hath broke ope / The Lord's anointed temple"
  - Theme: Chaos — regicide creates chaos at every level: political (Malcolm flees), social (trust destroyed), natural (sun doesn't rise), animal (horses eat each other)
  - Theme: Dramatic irony — Lady Macbeth's faint; Macbeth's performance of grief
  - Context: Great Chain of Being — Jacobean cosmological hierarchy; regicide disrupts every level
  - Context: Divine right of kings — Duncan as God's anointed; his murder = sacrilege
  - Context: Equivocator reference (AO3) — Henry Garnet/Gunpowder Plot connection in the Porter scene
  - Context: Comic relief — the Porter scene's structural function (release of tension; moral framing)
  - AO2 clarification: This is bigger than ordinary pathetic fallacy. It is not just weather matching mood; Shakespeare presents the whole created order as damaged
- **Suggested components:**
  - `ExplainReveal` — the Great Chain of Being hierarchy and what each unnatural event signifies
  - `TheoryCompareBlock` — Jacobean interpretation of unnatural events (evidence of disturbed divine order) vs modern reading (symbolic/pathetic fallacy)
  - `ColSortBlock` — sort consequences: natural world / political world / social world / psychological

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis.
- **Proposed content:**
  - **"porter of hell-gate"**: AO2: the Porter's self-description positions Inverness as hell; comedy as moral framing; the audience laughs but the theological claim is precise
  - **"most sacrilegious murder hath broke ope / The Lord's anointed temple"**: AO2: "sacrilegious" elevates the crime to sin; "broke ope" = violent invasion; "temple" = Duncan's body as sacred space
  - **"dark night strangles the travelling lamp"**: AO2: personification ("strangles"); "travelling lamp" = the sun; the violence of the verb "strangles" mirrors the violence of the murder
  - **"'Tis unnatural / Even like the deed that's done"**: AO2: the word "like" makes the causal connection explicit; nature mirrors the moral state of Scotland's king
  - **"A falcon, tow'ring in her pride of place, / Was by a mousing owl hawk'd at and kill'd"**: AO2: the inversion of natural hierarchy (superior bird killed by inferior); reflects the political inversion (king killed by subject)
  - PQAC: students analyse "most sacrilegious murder hath broke ope the Lord's anointed temple" — the religious framing and what it implies about Macbeth's crime
- **Suggested components:**
  - `MatchingTask` — match unnatural event to the hierarchy level it represents (celestial / avian / mammalian)
  - `FillInTheBlanksBlock` — PQAC for "most sacrilegious murder" quote
  - `InteractiveCollectionExplorer` — browse nature imagery across the play

### Section 5 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness before the final exam-prep section.
- **Proposed content:**
  - Retrieve from Episode 1: What did the witches establish about disorder? How does the storm in 1.1 connect to the unnatural events in 2.4?
  - Retrieve from Episode 4: Duncan as "Lord's anointed" — how does his description in 1.4 ("I have begun to plant thee") make the "temple" image more resonant?
  - Whole-play link: How does Act 5.9 (Malcolm's restoration) reverse the unnaturalness established here?
  - Whole-play link: The equivocator reference in the Porter scene connects to Episodes 3, 11 (equivocation theme)
  - Whole-play link: Macduff's refusal to attend Scone begins his movement from observer to opponent
  - Quick quiz: 4 questions
- **Suggested components:**
  - `QuickRecallScreen` — 4 rapid-fire questions
  - `RecoveryQuizPlayer` — targeted recovery

### Section 6 — Exam Practice
- **Purpose:** Final AQA-style practice moment. The final navigation/progress dot must land on exam prep. AQA-style practice focused on AO3.
- **Proposed content:**
  - Question: "How does Shakespeare present the theme of order and disorder in Macbeth?" — Act 2.3–2.4 are the primary evidence for disorder's consequences
  - Key argument: Shakespeare presents disorder not as political instability alone but as a cosmic rupture; the unnatural events prove this
  - Model paragraph: analysis of the falcon/owl image — the Great Chain of Being inverted; AO3 context embedded (Jacobean belief in hierarchy); whole-play link to Act 5.9 (order restored)
  - AO3 integration drill: how to include the Great Chain of Being without writing a history essay about it (one sentence context; integrated into analysis)
  - Add contrast sentence: This is bigger than ordinary pathetic fallacy. It is not just weather matching mood; Shakespeare presents the whole created order as damaged
- **Suggested components:**
  - `GuidedExamResponse` — paragraph on order/disorder using the unnatural events
  - `ExaminerExplainsScreen` — how to integrate AO3 (one embedded sentence, not a paragraph of context)

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway (regicide is a cosmic rupture that breaks the entire natural and divine hierarchy, not just a personal crime) should be taught as the episode's primary argument in Section 3 and modelled in Section 6. Students who understand the Great Chain of Being score AO3 marks; students who can *apply* it to specific images score high AO2+AO3 marks.

2. **Section 3 — the Great Chain of Being must be taught explicitly, not assumed:** Many students have heard of "divine right of kings" but not the Great Chain of Being. The ExplainReveal chain (God → king → nobles → animals) should make the hierarchy visible and then show which level each unnatural event attacks.

3. **Section 2 — the Porter scene must not be skipped or dismissed:** Students often treat it as a "comic relief" footnote. It is thematically precise (hell-gate analogy, equivocator reference, AO3 context). The VisualNarrativeScreen should give it proper time.

4. **Section 4 — the falcon/owl image is one of the best AO2 teaching moments in the play:** The inversion of the natural hierarchy (inferior kills superior) is a perfect visual metaphor for regicide. Students who can identify this pattern and connect it to the Great Chain of Being are demonstrating Level 4 AO2/AO3 integration.

5. **Retrieval must connect back to Episode 1:** The disorder established by the witches in 1.1 finds its full expression in 2.4's unnatural events. This thematic continuity should be explicitly retrieved in Section 5.

6. **Macbeth's cover-up killing must be named:** The grooms' murder is Macbeth's first public act of deception after Duncan's murder and shows how quickly one murder creates the need for another. This should seed later episodes on Banquo and Macduff's family.

7. **Macduff's absence from Scone should be seeded:** His refusal to attend Macbeth's coronation quietly begins his movement from observer to opponent. This is useful later when his resistance becomes explicit.

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
