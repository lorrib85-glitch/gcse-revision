# Episode 4: Black and deep desires — Architecture

## 1. Identity (brief)

- **Episode:** 4 of 12
- **Title:** Black and deep desires
- **Primary acts:** Act 1, Scene 4
- **Build status:** Not yet built

Content, Storyline, Specification requirements and the full Content reference pack: see `04_Black_And_Deep_Desires_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Surface existing knowledge; prime retrieval.
- **Proposed content:**
  - Retrieve from Episode 3: What are the three prophecies? What is Macbeth's first reaction? What is Banquo's warning?
  - Hook: "If there was only one person standing between you and what you wanted, what would you do?" (contextualises the Malcolm/Macbeth obstacle)
  - True/false: "Duncan knows that Macbeth is plotting against him" / "Malcolm is immediately named as the next king after the prophecies"
- **Suggested components:**
  - `ChapterHookScreen` — true/false with Episode 3 retrieval
  - `PriorKnowledgeRecall` — three prophecies recall; Macbeth's aside

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the scene.
- **Proposed content:**
  - Duncan announces the old Thane of Cawdor has been executed
  - Macbeth and Banquo arrive; Duncan praises them warmly
  - Duncan names Malcolm as Prince of Cumberland (the heir)
  - Macbeth's reaction — internal: "Stars, hide your fires"
  - Lady Macbeth not yet present; Macbeth is already planning
  - The mechanism of dramatic irony: Duncan says "There's no art to find the mind's construction in the face" immediately to Macbeth
- **Suggested components:**
  - `VisualNarrativeScreen` — Duncan's court; the ceremony of trust and naming; Macbeth's presence in both registers (public loyalty / private planning)
  - `ExplainReveal` — the dramatic irony chain: Duncan about Cawdor → immediately to Macbeth's face → audience understands

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and AO3 context.
- **Proposed content:**
  - Theme: Appearance vs reality — this scene is the fullest statement before the murder; Duncan cannot read Macbeth's face; the concealment motif begins
  - Theme: Kingship — Duncan as ideal king: generous, trusting, paternal; the agricultural metaphor ("I have begun to plant thee") shows his vision of nurturing loyalty
  - Theme: Betrayal — the Cawdor parallel: betrayed a trusted gentleman → Macbeth is the next trusted gentleman
  - Context: Divine right of kings — Duncan's authority is God-given; his trust is a virtue, not a flaw
  - Context: Gunpowder Plot — Everard Digby (a close friend of James I who became a conspirator) = the old Thane of Cawdor; James I watching the play recognised this immediately
- **Suggested components:**
  - `TheoryCompareBlock` — Duncan as ideal king vs Macbeth's later tyranny
  - `ExplainReveal` — Gunpowder Plot parallel: Cawdor → Digby → James I's recognition
  - `ColSortBlock` — sort features of "ideal kingship" vs "tyrant"

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis.
- **Proposed content:**
  - **"There's no art to find the mind's construction in the face"**: dramatic irony; AO2: said about Cawdor but addressed to Macbeth; "art" = skill; the irony is that the person who cannot be read is right in front of Duncan
  - **"He was a gentleman on whom I built an absolute trust"**: Duncan about Cawdor; AO2: the past tense "was"; the word "built" = construction/investment; whole-play link: the same phrase now applies to Macbeth
  - **"I have begun to plant thee"**: agricultural metaphor; AO2: Duncan as nurturing cultivator; irony: the "plant" (Macbeth) will destroy the gardener (Duncan)
  - **"Stars, hide your fires"**: darkness imagery; AO2: stars = providence/divine order; asking them to hide = asking God not to witness; whole-play link: Lady Macbeth's "Come thick night" in 1.5
  - **"black and deep desires"**: AO2: the colour "black" = moral darkness + concealment; "deep" = hidden, rooted; "desires" = ambition coded as desire/lust
  - PQAC: students analyse "Stars, hide your fires" — what does Macbeth want God not to see?
- **Suggested components:**
  - `MatchingTask` — quote to technique to theme to whole-play link
  - `FillInTheBlanksBlock` — complete PQAC for "There's no art to find the mind's construction in the face"

### Section 5 — Exam Practice
- **Purpose:** AQA-style practice.
- **Proposed content:**
  - Question: "How does Shakespeare present kingship in Macbeth?" — Act 1.4 is the primary evidence for Duncan as ideal king; contrast with Macbeth's tyranny in Acts 3–4
  - Key argument: Duncan's trust is a kingly virtue that makes his murder a greater tragedy; his goodness is what Macbeth is destroying
  - Model paragraph: analysis of "There's no art to find the mind's construction in the face" as dramatic irony + AO3 context (Duncan's absolute trust mirrors James I's experience with the Gunpowder Plot conspirators)
  - Paragraph planning frame: Claim + Quote + Technique + Effect + Context + Whole-play link
- **Suggested components:**
  - `GuidedExamResponse` — scaffolded paragraph on Duncan as ideal king
  - `ExaminerExplainsScreen` — how to integrate AO3 context without letting it take over the paragraph

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness.
- **Proposed content:**
  - Retrieve from Episode 3: What did Macbeth's aside in 1.3 reveal about his ambition?
  - Retrieve from Episode 2: How does the Captain's description of Macbeth in 1.2 set up the dramatic irony of Duncan's trust?
  - Whole-play link: How does Act 5.9 ("this dead butcher and his fiend-like queen") contrast with Duncan's description of Macbeth as a trusted loyal subject?
  - Forward link: What does Lady Macbeth do when she hears of Duncan's planned visit? (seeds Episode 5)
- **Suggested components:**
  - `QuickRecallScreen` — 4 rapid questions on quotes, themes, context, techniques
  - `RecoveryQuizPlayer` — targeted recovery

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway (Duncan's trust is both his virtue and his vulnerability; Macbeth begins concealing here) should be stated explicitly in Section 3 and practised in Section 5. The Section 3 comparison activity (ideal king vs tyrant) seeds the whole-play contrast every student needs.

2. **Section 2 — lead with the dramatic irony:** "There's no art to find the mind's construction in the face" said immediately before/to Macbeth is the scene's most powerful moment. It should be the narrative climax of the Section 2 teaching, not a footnote.

3. **Section 3 — teach the Gunpowder Plot parallel:** The Cawdor/Digby/James I connection is one of the most accessible AO3 points in the whole play and requires no difficult background to grasp. The ExplainReveal should make this chain explicit and memorable.

4. **Section 4 — the light/dark contrast is central:** "Stars, hide your fires" and "black and deep desires" both introduce the concealment-through-darkness motif. Students should understand that both Macbeth (Episode 4) and Lady Macbeth (Episode 5) independently invoke darkness to hide their plans — suggesting the plotting is mutual.

5. **The concealment motif must be named and tracked here:** This episode begins it; Episode 5 deepens it; Episode 6 crystallises it ("False face must hide what the false heart doth know"). Students should leave this episode knowing what the concealment motif is and that it starts here.

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
