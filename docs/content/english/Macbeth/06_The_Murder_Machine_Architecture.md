# Episode 6: The murder machine — Architecture

## 1. Identity (brief)

- **Episode:** 6 of 12
- **Title:** The murder machine
- **Primary acts:** Act 1 Scenes 6 and 7
- **Build status:** Not yet built

Content, Storyline, Specification requirements and the full Content reference pack: see `06_The_Murder_Machine_Content.md` in this directory.

**Note:** Act 1.7 is the AQA June 2024 actual exam extract for the Lady Macbeth question. This episode has the highest single-episode exam relevance in the series.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Surface existing knowledge; prime retrieval.
- **Proposed content:**
  - Retrieve from Episode 5: What is "unsex me here"? What is Lady Macbeth's strategy ("look like the innocent flower")?
  - Retrieve from Episode 4: What is "Stars, hide your fires"? What is the concealment motif?
  - Hook: "You know something is wrong. But someone important to you tells you to do it anyway. Do you?" (frames the moral choice at the heart of 1.7)
  - True/false: "Macbeth doesn't know killing Duncan is wrong" / "Lady Macbeth threatens Macbeth physically" / "Macbeth changes his mind before the murder"
- **Suggested components:**
  - `ChapterHookScreen` — true/false targeting the core moral awareness misconception
  - `PriorKnowledgeRecall` — retrieve Episode 5 quotes ("unsex me here", "look like the innocent flower")

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach what happens in the scenes.
- **Proposed content:**
  - Act 1.6: Duncan arrives at Inverness; praises the castle ("This castle hath a pleasant seat"); Lady Macbeth greets him with performed loyalty; dramatic irony maximum
  - Act 1 Scene 6 makes the murder more shocking because Duncan praises Inverness as pleasant and safe, while the audience knows Lady Macbeth is preparing betrayal. Shakespeare uses dramatic irony to make Duncan's trust feel tragic rather than foolish
  - Act 1.7: Macbeth slips away before the feast; the soliloquy — he lists every reason not to kill Duncan; arrives at "vaulting ambition" as the only motive; decides to stop
  - Lady Macbeth enters; she attacks his masculinity (was the hope drunk? Letting "I dare not" wait upon "I would")
  - The infanticide image — her extreme claim of ruthlessness
  - Macbeth caves: "If we should fail?" → "We fail? / But screw your courage to the sticking-place, and we'll not fail"
  - Final line: "False face must hide what the false heart doth know" — the concealment strategy is now his own
- **Suggested components:**
  - `TimelineChain` — sequence: Duncan arrives (1.6) → Macbeth's soliloquy (decides to stop) → Lady Macbeth enters → manipulation → agreement → "False face"
  - `ExplainReveal` — the mechanics of Lady Macbeth's manipulation: emotion → masculinity challenge → infanticide → practical plan

### Section 3 — Theme & Context
- **Purpose:** Connect to major themes and AO3 context.
- **Proposed content:**
  - Theme: Ambition — "vaulting ambition" as Macbeth's own diagnosis of his sole motive; the tragedy requires this self-knowledge
  - Theme: Masculinity — Lady Macbeth's challenge; Jacobean masculinity as courage-and-action; Macbeth's sense of identity tied to this definition
  - Theme: Guilt — Macbeth understands the moral weight completely ("deep damnation"); guilt is not retroactive; it begins here
  - Theme: Appearance vs reality — crystallised in "False face must hide what the false heart doth know"
  - Theme: Dramatic irony — Act 1.6 makes Duncan's trust feel tragic rather than foolish because the audience knows Inverness is unsafe while Duncan calls it pleasant
  - Context: Hospitality codes — host/guest bond is sacred in Jacobean society; to murder a guest under your own roof violates divine and social law simultaneously
  - Context: Divine right of kings — "He's here in double trust": Duncan trusts Macbeth in more than one role: as family, as subject and as host. Shakespeare makes the murder worse by stacking the broken duties
  - Context: Great Chain of Being — regicide disrupts the divinely ordained hierarchy
- **Suggested components:**
  - `TheoryCompareBlock` — Macbeth's moral reasoning in the soliloquy vs his decision at the end of the scene
  - `ColSortBlock` — Macbeth's reasons NOT to murder vs Lady Macbeth's arguments FOR; which "wins" and why
  - `ExplainReveal` — how Lady Macbeth's challenge works: identity attack → moral bypass

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis — this is the densest quote-analysis episode in the series.
- **Proposed content:**
  - **"This castle hath a pleasant seat"**: dramatic irony; Duncan reads Inverness as safe and welcoming while the audience knows Lady Macbeth is preparing betrayal; AO2: the pleasant sensory language makes Duncan's trust more tragic
  - **"He's here in double trust"**: "double trust" means Duncan trusts Macbeth in more than one role: as family, as subject and as host. Shakespeare makes the murder worse by stacking the broken duties
  - **"I have no spur / To prick the sides of my intent, but only / Vaulting ambition"**: AO2: extended horse metaphor; "only" = admission of sole motive; "vaulting" = excessive, self-defeating
  - **"We will proceed no further in this business"**: AO2: "business" is coldly transactional — the word's ordinariness contrasts with the gravity of what is being discussed; Macbeth briefly refuses
  - **"When you durst do it, then you were a man"**: AO2: the masculinity challenge; conditional "when" = he was more of a man before he hesitated; Lady Macbeth redefines manhood as willingness to kill
  - **"screw your courage to the sticking-place"**: AO2: the crossbow metaphor; "sticking-place" = the notch at maximum tension; she is asking Macbeth to hold himself at maximum murderous resolve
  - **"False face must hide what the false heart doth know"**: AO2: parallel construction (false face / false heart = surface and interior corrupted); couplet signals finality; whole-play link: this is now his guiding principle
  - PQAC: students analyse the infanticide image ("I would... have plucked my nipple from his boneless gums / And dashed the brains out") — why is this the most extreme image in the play?
- **Suggested components:**
  - `MatchingTask` — match quote to technique to effect to whole-play link
  - `FillInTheBlanksBlock` — two PQAC frames: "vaulting ambition" and "When you durst do it, then you were a man"
  - `InteractiveCollectionExplorer` — browse quotes by character: Macbeth's moral reasoning / Lady Macbeth's manipulation

### Section 5 — Retrieval & Wider Play Links
- **Purpose:** Interleave; build whole-play awareness before the final exam-prep section.
- **Proposed content:**
  - Retrieve from Episodes 4 and 5: concealment motif / "Stars, hide your fires" / "look like the innocent flower" → "False face must hide" (Episode 6) as the third statement of this motif
  - Retrieve from Episode 3: What was Macbeth's moral awareness in the aside? How does the 1.7 soliloquy deepen this?
  - Whole-play link: Act 3.4 (banquet) — the "False face" strategy collapses publicly
  - Whole-play link: Act 5.1 (sleepwalking) — Lady Macbeth's guilt completes the arc begun here
  - Quick quiz: 5 questions (Very High retrieval priority)
- **Suggested components:**
  - `QuickRecallScreen` — 5 rapid-fire questions: quotes / techniques / themes / context / whole-play links
  - `RecoveryQuizPlayer` — targeted recovery

### Section 6 — Exam Practice
- **Purpose:** Final AQA-style practice moment. The final navigation/progress dot must land on exam prep. This episode is the 2024 actual exam question.
- **Proposed content:**
  - **AQA Jun 2024 actual question:** "Starting with this conversation, explore how far Shakespeare presents Lady Macbeth as a strong female character." Extract: Act 1.7 (Lady Macbeth's manipulation of Macbeth)
  - Full essay structure:
    1. Extract para 1: Her interrogatives and masculinity challenge demonstrate strength; repeated questions control the conversation
    2. Extract para 2: The infanticide image is her most extreme manipulation — she inverts maternal instinct; but this extreme is needed because her persuasion needs to be total
    3. Whole play para 1: Her strength erodes from Act 3 — excluded from Banquo plot; fails at banquet
    4. Whole play para 2: Act 5.1 — the suppressed conscience returns; she cannot sleep; her "strength" was suppression, not absence of conscience
  - Act 1.6 whole-play/context link: Duncan's praise of Inverness and Lady Macbeth's performed welcome make the coming murder more shocking because Shakespeare makes Duncan's trust feel tragic rather than foolish
  - AQA Jun 2024 MS indicative content embedded in the modelled answer
  - SPaG tips: sentence structures for analysis; connectives for whole-play movement
- **Suggested components:**
  - `GuidedExamResponse` — full 4-paragraph plan with model sentences
  - `FaceTheExaminer` — students write one paragraph independently; see model version; self-assess
  - `ExaminerExplainsScreen` — level descriptors: what a Level 3 vs Level 4 vs Level 5 answer looks like on this question

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Storyline integration:** The core takeaway (Macbeth knows the murder is wrong in every dimension and chooses it anyway) must be stated explicitly in Section 2 (the soliloquy teaching) and practised in Section 6. This is the scene that proves Macbeth is not a victim of external forces — he is a fully moral agent making a catastrophically wrong choice.

2. **Section 2 — the soliloquy sequence must be taught as a moral argument, not just a plot event:** Use the TimelineChain to show the structure of the soliloquy: obligation → consequence → conclusion ("vaulting ambition") → reversal through manipulation. Students need to see the argument, not just the summary.

3. **Section 3 — the hospitality codes context is non-negotiable for AO3:** The host/guest bond violation is one of the clearest AO3 context points in the play. It explains why Duncan's trust is not naivety but a sacred social compact. Students who include this in essays move from Level 3 to Level 4.

4. **Section 6 — use the actual 2024 past paper question and extract:** This is the single highest-value exam practice opportunity in the series. The GuidedExamResponse should model a 4-paragraph structure explicitly. Students should see both the model paragraph and the mark scheme language.

5. **Section 4 — the infanticide image needs careful teaching:** It is the most shocking image in the play and students often either avoid it or over-simplify it. The PQAC frame for this quote should ask: why is this *necessary* for Lady Macbeth's argument? (She needs to demonstrate total ruthlessness; ordinary arguments have failed.)

6. **Do not make Macbeth sound automatic or mindless:** The title is memorable, but the teaching must keep reinforcing that this is not a machine with no choice. It is a human being choosing to turn moral reasoning into action.

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
