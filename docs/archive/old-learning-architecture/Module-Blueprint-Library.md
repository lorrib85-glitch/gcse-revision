# Module Blueprint Library

> **Superseded — retained for historical reference only.** This document predates and conflicts with the module architecture defined in `CLAUDE.md` ("History Module Architecture (LOCKED)" and "Science Module Blueprint (LOCKED)"). `CLAUDE.md` is the current authority for module structure — do not use this document for new module builds.

**Authority:** This document sits beneath the Product UI Constitution, Component Registry, and Brand guide. It governs how approved components are assembled into learning sequences. It does not define new components or modify any UI.

**Purpose:** Define reusable, flexible learning journey patterns for GCSE modules. These are assembly guides for existing components — not fixed templates. A blueprint tells you what kinds of screen to use and in what order; it does not specify exact content or word count.

---

## Universal Rules

These apply to every module regardless of blueprint type.

| Rule | Requirement |
|------|-------------|
| Opening sequence | ChapterHookScreen → ChapterOutcomeScreen → QuickRecallScreen (see below) |
| Passive run limit | Never more than 2 passive screens in a row |
| Attention reset | Any run of 5 or more screens without an interaction must be redesigned |
| Retrieval | Every module must contain at least one retrieval point |
| Exam application | Every module must contain at least one exam-application point |
| Memorable Moment | Every module (except Recovery) must contain at least one Memorable Moment |

---

## Universal Opening Sequence

All standard modules begin with this three-screen opener:

```
1. ChapterHookScreen     — provoke curiosity with a true/false challenge
2. ChapterOutcomeScreen  — set expectations; frame the chapter's learning goal
3. QuickRecallScreen     — activate prior knowledge before new content arrives
```

**Exception — Module 1 of a new subject:** Replace QuickRecallScreen with a Prior Knowledge Challenge. This is a future component candidate (not yet approved); use a FillInTheBlanksBlock or ConceptReveal as a temporary substitute and flag for future revision.

The opening sequence is not counted against passive run limits because ChapterHookScreen and QuickRecallScreen are both active.

---

## Passive vs Active Components

This classification makes the two-passive-screen rule enforceable.

### Passive — learner reads or watches; no response required

| Component | Notes |
|-----------|-------|
| CinematicRevealMoment | Atmospheric reveal; no learner input |
| ConceptReveal | Concept introduction; no learner input |
| ExplainReveal | Cause-and-effect chain; steps auto-advance or tap-to-reveal but no graded response |
| ChapterOutcomeScreen | Outcome display only |

### Active — learner must respond or interact

| Component | Notes |
|-----------|-------|
| ChapterHookScreen | True/false warm-up; graded |
| InteractiveHotspotImage | Learner taps hotspots to explore |
| FillInTheBlanksBlock | Cloze interaction; graded |
| QuickRecallScreen | Rapid-fire choice/connection; graded |
| FaceTheExaminer | Open written response |
| ExamQuestionFrame | Exam question + mark scheme reveal |
| RetrievalFrame | Cinematic retrieval wrapper; graded |
| RecoveryQuizPlayer | 3–4 targeted questions; graded |
| WeakSpotRecovery | Intervention screen; requires learner commitment |

ChapterCompleteScreen is neither — it is a terminal screen and does not count toward run limits.

---

## Energy Curve

Every blueprint should produce an alternating energy curve rather than a flat sequence of explanation screens. The five states are:

```
C  Curiosity      — provoke a question or create surprise
L  Learning       — deliver new information or explanation
I  Interaction    — require a learner response
R  Retrieval      — test memory of what was just learned
A  Application    — apply knowledge to an exam context
```

**Well-formed curve (Story-Led example):**
```
C → L → I → L → R → L → I → R → A
```

**Poorly-formed curve (avoid):**
```
C → L → L → L → L → I → A
```

The second pattern violates the attention reset rule (5+ screens without interaction) and delivers retrieval too late to consolidate learning. When reviewing a module sequence, plot it against these five states. Any run of three or more L states is a warning sign.

---

## Memorable Moment — Definition

Every module (except Recovery) must contain at least one Memorable Moment: a screen whose content a student is likely to recall and discuss after closing the app.

A Memorable Moment must be at least one of:

- **Surprising** — contradicts what the student assumed was true
- **Dramatic** — involves human consequence, conflict, or stakes
- **Counter-intuitive** — the real answer is the opposite of common sense
- **Visually striking** — an image or reveal that is genuinely arresting
- **Personally relatable** — connects the historical or abstract to something in the student's own experience

**Facts alone do not qualify.** "Over 25 million people died in the Black Death" is a fact. "One in three people you know would have been dead" is a Memorable Moment.

The Memorable Moment is usually carried by CinematicRevealMoment, ExplainReveal, or ConceptReveal — but the component matters less than whether the content itself meets the definition above.

---

## Component Vocabulary

| Component | Category | Passive/Active | Purpose |
|-----------|----------|----------------|---------|
| ChapterHookScreen | layout | Active | Opening true/false warm-up; sets curiosity |
| ChapterOutcomeScreen | layout | Passive | States the chapter's learning goal |
| ChapterCompleteScreen | layout | Terminal | End-of-chapter score and stats |
| CinematicRevealMoment | learning | Passive | Full-screen atmospheric image/video reveal |
| ConceptReveal | learning | Passive | Concept introduction with progressive reveal |
| ExplainReveal | learning | Passive | Cause-and-effect reasoning chain, step by step |
| InteractiveHotspotImage | learning | Active | Full-screen image with tappable hotspots |
| FillInTheBlanksBlock | learning | Active | Inline cloze interaction |
| QuickRecallScreen | learning | Active | Rapid-fire retrieval (choice + connection) |
| FaceTheExaminer | learning | Active | Open written response to an examiner question |
| ExamQuestionFrame | feedback | Active | Exam question with mark scheme reveal |
| RetrievalFrame *(locked)* | feedback | Active | Cinematic retrieval wrapper |
| RecoveryQuizPlayer | learning | Active | 3–4 focused recovery questions |
| WeakSpotRecovery | learning | Active | Full-screen intervention for struggling learners |

---

## Blueprint Selection Rules

Use this section to choose the right blueprint before assembling a module.

| If the module is primarily about… | Use |
|-----------------------------------|-----|
| A story with human decisions, conflict or consequence | Story-Led |
| An abstract idea that must be explained before it can be practised | Concept-Led |
| Something that requires spatial or visual understanding | Visual Exploration |
| A belief students commonly hold that is wrong | Misconception Reveal |
| Getting better at answering exam questions | Exam-Skill |
| Re-engaging a learner who has struggled with this topic | Recovery |

**When topics overlap:** A History module on Pasteur's germ theory has both story (Pasteur's rivalry with Koch) and concept (germ theory itself). Choose the dominant driver. If the exam marks are weighted toward understanding the concept, use Concept-Led. If the exam questions are primarily about the significance and impact of Pasteur's work, use Story-Led.

**Biology and Chemistry** often combine Visual Exploration with Concept-Led. Build the sequence as Concept-Led but insert InteractiveHotspotImage at the learning phase where the diagram is essential to understanding. Do not force a separate blueprint for the visual element.

---

## Blueprint 1 — Story-Led

### Purpose
Build understanding through narrative. The learner follows human decisions, consequences, and turning points. Content is anchored in cause and effect, not definition and recall.

### Best for
History, English Literature, Sociology, Drama. Any topic where understanding *why something happened* or *what it means for people* is the primary learning goal.

### Recommended sequence

```
1.  ChapterHookScreen          [Active]   Open on a human moment — a decision, a claim, a dramatic event
2.  ChapterOutcomeScreen       [Passive]  Frame: what the chapter will prove or explain
3.  QuickRecallScreen          [Active]   Activate prior knowledge before the narrative begins
4.  CinematicRevealMoment      [Passive]  Establish the world — atmosphere, context, stakes
5.  ExplainReveal              [Passive]  First cause-and-effect chain — build the story
6.  RetrievalFrame             [Active]   Test the core cause before moving to consequence
7.  ExplainReveal              [Passive]  The consequence — what happened next, and why it matters
8.  QuickRecallScreen          [Active]   Consolidate the full narrative arc
9.  FaceTheExaminer            [Active]   Write a response to an examiner question about significance or causation
10. ExamQuestionFrame          [Active]   Compare to the mark scheme; see what a top-band answer does
11. ChapterCompleteScreen      [Terminal] Score, stats, next step
```

**Energy curve:** C → L → I → C+L → L → R → L → R → A → A

Steps 4 and 5 are both passive. This is the only permitted passive run in this blueprint; keep it short and ensure CinematicRevealMoment is genuinely atmospheric rather than decorative.

### Required retrieval points
Minimum 2: RetrievalFrame at step 6, QuickRecallScreen at step 8.

### Required exam application point
FaceTheExaminer + ExamQuestionFrame (steps 9–10). These must appear together; FaceTheExaminer without a mark scheme reveal is incomplete.

### Memorable Moment requirement
Must appear at step 4 or 5. The CinematicRevealMoment or the opening beat of ExplainReveal should contain the dramatic or counter-intuitive idea that anchors the story. If no single moment in the chapter qualifies, reconsider the content structure — not the blueprint.

### Anti-patterns
- Do not use two ExplainReveal screens in a row without an active screen between them
- Do not open with a fact dump before the hook is established
- Do not place FaceTheExaminer before the learner has processed the narrative through at least one retrieval point
- Do not use CinematicRevealMoment as decoration — if it carries no Memorable Moment it should be removed

### Example — Black Death, 1348 (History: Medicine Through Time)

```
1.  ChapterHookScreen          "A ship arriving in an English port in 1348 could be turned away by the authorities."
                               (True — but it never was. Why?)
2.  ChapterOutcomeScreen       "Understand why medieval medicine failed in the face of the Black Death."
3.  QuickRecallScreen          Recall: Four Humours, miasma theory, religious belief in medicine
4.  CinematicRevealMoment      [MEMORABLE MOMENT] A port town in 1348. One in three people you pass
                               on this street will be dead within a year.
5.  ExplainReveal              Why medieval doctors believed what they believed — and why every
                               treatment they tried made things worse
6.  RetrievalFrame             "What did medieval doctors believe caused the Black Death?"
7.  ExplainReveal              The consequence: how the Black Death changed medicine forever
                               (flagellants, Jewish persecution, the eventual questioning of Galen)
8.  QuickRecallScreen          Full arc: cause → response → consequence
9.  FaceTheExaminer            "Explain why the Black Death had little impact on medical understanding
                               in the short term." (8 marks)
10. ExamQuestionFrame          Mark scheme reveal — what distinguishes Level 2 from Level 3
11. ChapterCompleteScreen
```

---

## Blueprint 2 — Concept-Led

### Purpose
Scaffold understanding of an abstract idea before practising it. The learner needs the concept to be clear before retrieval is meaningful.

### Best for
History (Four Humours, germ theory), Maths (algebraic manipulation, probability), Physics (electricity, forces), Sociology (socialisation, social control), English (language analysis frameworks).

### Recommended sequence

```
1.  ChapterHookScreen          [Active]   Open on a misconception or puzzling claim about the concept
2.  ChapterOutcomeScreen       [Passive]  State the concept clearly; frame what understanding looks like
3.  QuickRecallScreen          [Active]   Activate any prior knowledge the concept builds on
4.  ConceptReveal              [Passive]  Introduce the concept: definition, analogy, example
5.  FillInTheBlanksBlock       [Active]   Embed the core definition through active recall
6.  ConceptReveal              [Passive]  Extend: a harder example, an edge case, or a "what about…" case
7.  QuickRecallScreen          [Active]   Test both the core and extended concept
8.  ExamQuestionFrame          [Active]   Apply the concept to an exam question; reveal the mark scheme
9.  ChapterCompleteScreen      [Terminal]
```

**Energy curve:** C → L → I → L → I → L → R → A

Steps 4 and 6 are both passive. This is the maximum permitted consecutive passive run. If a third ConceptReveal is needed, an active screen must precede it.

### Required retrieval points
Minimum 2: FillInTheBlanksBlock at step 5, QuickRecallScreen at step 7.

### Required exam application point
ExamQuestionFrame at step 8.

### Memorable Moment requirement
Carried by ConceptReveal at step 4 or 6. The Memorable Moment is usually the analogy or example that makes the abstract concrete — the moment the concept stops being words and becomes a mental image. If no analogy achieves this, the content needs revision.

### Anti-patterns
- Do not place the ExamQuestionFrame before the learner has completed at least one retrieval of the concept
- Do not introduce new vocabulary in ExamQuestionFrame — it should test understanding of what has already been taught
- Do not use ConceptReveal as a wall of text — if it requires more than three scrolls it should be split or redesigned as ExplainReveal

### Example — Four Humours (History: Medieval Medicine)

```
1.  ChapterHookScreen          "Medieval doctors thought eating too much cucumber could kill you."
                               (True — cucumbers were 'cold and wet', dangerous for a cold-humour patient)
2.  ChapterOutcomeScreen       "Understand the Four Humours theory and why medieval doctors believed it explained all illness."
3.  QuickRecallScreen          Recall: Hippocrates, Galen, the role of the Church in medicine
4.  ConceptReveal              [MEMORABLE MOMENT] The four humours: blood, phlegm, yellow bile, black bile.
                               Now imagine your doctor telling you the reason you're ill is that you have
                               too much of one of them — and the cure is to remove it. With a blade.
5.  FillInTheBlanksBlock       "The four humours are: ___, ___, ___ and ___. An imbalance of ___ humour
                               would be treated by ___."
6.  ConceptReveal              Edge case: why the four humours survived for 1,400 years despite being wrong
                               (Galen's authority, the Church, confirmation bias in treatment)
7.  QuickRecallScreen          Core + extension: name, balance, treatment, and why the theory persisted
8.  ExamQuestionFrame          "Describe the Four Humours theory of disease." (4 marks)
9.  ChapterCompleteScreen
```

---

## Blueprint 3 — Visual Exploration

### Purpose
Build understanding through spatial and visual engagement. The learner needs to see, locate, and interact with a diagram, map, or image before the content makes sense.

### Best for
Biology (cells, body systems, plant structures), History (Elizabethan theatre, trenches, ship cross-sections), Chemistry (atomic structure, apparatus diagrams), Geography (maps, physical features), Drama (stage layouts).

### Recommended sequence

```
1.  ChapterHookScreen          [Active]   Open on a visual claim or spatial puzzle
2.  ChapterOutcomeScreen       [Passive]  State the visual/spatial understanding goal
3.  QuickRecallScreen          [Active]   Activate prior knowledge (labels, terms, prior diagrams)
4.  CinematicRevealMoment      [Passive]  Reveal the image — establish its context and significance
5.  InteractiveHotspotImage    [Active]   Learner explores and identifies features by tapping
6.  FillInTheBlanksBlock       [Active]   Embed the labels/terms through cloze recall
7.  QuickRecallScreen          [Active]   Test spatial relationships and function, not just labels
8.  ExamQuestionFrame          [Active]   Diagram-based or descriptive exam question; mark scheme reveal
9.  ChapterCompleteScreen      [Terminal]
```

**Energy curve:** C → L → I → C+L → I → I → R → A

Steps 4 and 5 alternate passive/active immediately — the image reveal (passive) flows directly into exploration (active). No passive run violation.

### Required retrieval points
Minimum 2: FillInTheBlanksBlock at step 6, QuickRecallScreen at step 7.

### Required exam application point
ExamQuestionFrame at step 8. Should ask about function or significance, not just identification (e.g. "Explain how the position of the Globe Theatre's stage affected the audience experience", not "Label the stage").

### Memorable Moment requirement
Carried by CinematicRevealMoment at step 4 or the first revelation in InteractiveHotspotImage at step 5. The moment must be visually striking or produce genuine surprise — not simply "here is a diagram". A cell diagram is not a Memorable Moment. "This is what 40 trillion cells look like when they work together to keep you alive" is a Memorable Moment.

### Anti-patterns
- Do not use InteractiveHotspotImage as a passive slideshow — if learners are not required to tap and respond, it belongs in CinematicRevealMoment instead
- Do not follow InteractiveHotspotImage with another passive screen — it must be followed by FillInTheBlanksBlock or QuickRecallScreen
- Do not omit the function-level exam question — labelling diagrams is Level 1; understanding function is examined at Level 2 and above

### Example — The Globe Theatre (English: An Inspector Calls context / Drama)

```
1.  ChapterHookScreen          "The design of Shakespeare's Globe Theatre was an accident of budget constraints."
                               (False — it was carefully designed to create specific audience dynamics)
2.  ChapterOutcomeScreen       "Understand the layout of the Elizabethan theatre and how it shaped drama."
3.  QuickRecallScreen          Recall: groundlings, thrust stage, soliloquy, aside
4.  CinematicRevealMoment      [MEMORABLE MOMENT] An aerial reconstruction of the Globe, 1599.
                               Three thousand people. No microphones. Every word audible from the pit
                               to the upper galleries.
5.  InteractiveHotspotImage    Tap: stage, tiring house, pit, galleries, heavens, trapdoor — each reveals
                               its function and its dramatic significance
6.  FillInTheBlanksBlock       "The ___ stage extended into the pit, meaning the audience surrounded the
                               action on ___ sides. The ___ was used for supernatural entrances."
7.  QuickRecallScreen          Spatial relationships: which features created intimacy, which created spectacle
8.  ExamQuestionFrame          "Explain how the design of the Elizabethan stage influenced dramatic performance."
9.  ChapterCompleteScreen
```

---

## Blueprint 4 — Misconception Reveal

### Purpose
Identify a belief students commonly hold, confront it with evidence, replace it with the accurate model, and test the corrected understanding. This blueprint only works if the hook is genuinely based on a real, common misconception — not a trivial factual error.

### Best for
Any subject where a durable wrong belief interferes with exam performance. Common examples: History (Medieval medicine was entirely superstitious — actually, Galen's model was sophisticated and internally consistent), Biology (we only use 10% of our brains), Sociology (meritocracy means everyone succeeds on merit alone), English (Shakespeare wrote alone).

### Recommended sequence

```
1.  ChapterHookScreen          [Active]   State the misconception as the hook — let learners commit to it
2.  ChapterOutcomeScreen       [Passive]  Frame the chapter as "here's what's actually true"
3.  QuickRecallScreen          [Active]   Activate what the learner already knows that will conflict with the misconception
4.  ConceptReveal              [Passive]  Reveal the accurate model — replace, don't just negate
5.  ExplainReveal              [Passive]  Explain why the misconception exists and why it feels true
6.  RetrievalFrame             [Active]   Test the corrected model before consolidation
7.  FaceTheExaminer            [Active]   Use the corrected model to answer an exam question
8.  ChapterCompleteScreen      [Terminal]
```

**Energy curve:** C → L → I → L → L → R → A

Steps 4 and 5 are both passive — the maximum permitted run. The corrected model (4) must be followed immediately by the explanation of why the misconception felt true (5), then broken by RetrievalFrame (6). Do not insert a third passive screen.

### Required retrieval points
Minimum 1: RetrievalFrame at step 6. Add QuickRecallScreen between steps 5 and 6 if the corrected model has multiple components.

### Required exam application point
FaceTheExaminer at step 7. This is the proof of transfer — can the learner apply the corrected model under exam conditions?

### Memorable Moment requirement
Carried by ConceptReveal at step 4. The reveal must be genuinely surprising — the moment the learner realises the gap between what they believed and what is true. This is the heart of the blueprint. If the misconception is too easily surrendered, the reveal lacks impact; reframe the hook (step 1) to make learners commit more firmly before the correction arrives.

### Anti-patterns
- Do not use this blueprint for simple factual errors — "students think the Battle of Hastings was in 1067" is a mistake, not a misconception. A misconception is a coherent wrong model.
- Do not negate without replacing — "that's wrong" without offering an alternative model leaves learners with nothing
- Do not introduce the accurate model before learners have committed to the misconception — the hook must land first

### Example — Medieval Medicine and Galen (History: Medicine Through Time)

```
1.  ChapterHookScreen          "Medieval doctors had no real understanding of the human body and relied
                               entirely on superstition." (False)
2.  ChapterOutcomeScreen       "Understand that Galen's medical model was sophisticated — and why that
                               made it more dangerous, not less."
3.  QuickRecallScreen          What do you already know about Galen? About the Four Humours?
4.  ConceptReveal              [MEMORABLE MOMENT] Galen dissected animals and produced detailed anatomical
                               diagrams. Medieval doctors were not guessing — they were following a
                               highly systematic 1,400-year-old scientific framework. The problem was that
                               it was wrong in exactly the ways that mattered most.
5.  ExplainReveal              Why Galen's authority was so durable: the Church, confirmation bias,
                               the lack of dissection of human bodies, and the social cost of disagreement
6.  RetrievalFrame             "Why did medieval doctors continue to use Galen's methods despite
                               evidence that treatments were failing?"
7.  FaceTheExaminer            "Explain why Galen's influence made it harder for medicine to progress
                               in the medieval period." (8 marks)
8.  ChapterCompleteScreen
```

---

## Blueprint 5 — Exam-Skill

### Purpose
Improve the quality of exam answers directly. The module is not primarily about new content — it is about teaching the learner to use content they already have more effectively in exam conditions.

### Best for
Source analysis (History), quote and language analysis (English), evaluation questions (Sociology, Science), command word practice, mark scheme literacy, extended writing, 8- and 12-mark exam questions.

### Recommended sequence

```
1.  ChapterHookScreen          [Active]   Hook on an exam skill claim ("A good analysis quote just
                               needs to say what it means" — False)
2.  ChapterOutcomeScreen       [Passive]  State the skill explicitly; show the mark scheme criteria
3.  ExplainReveal              [Passive]  Deconstruct a worked example of a top-band answer —
                               annotate what it does step by step
4.  FaceTheExaminer            [Active]   Attempt 1 — learner writes a response under time pressure
5.  ExamQuestionFrame          [Active]   Compare attempt 1 to the mark scheme; identify the gap
6.  FaceTheExaminer            [Active]   Attempt 2 — a harder or different question using the same skill
7.  ExamQuestionFrame          [Active]   Compare attempt 2; consolidate the improvement
8.  ChapterCompleteScreen      [Terminal]
```

**Energy curve:** C → L → L → I → R → I → R

Steps 2 and 3 are both passive — the only permitted passive run. The mark scheme framing (2) and the worked example (3) must flow together. Step 3 must then be broken immediately by FaceTheExaminer (4).

### Required retrieval points
FaceTheExaminer at steps 4 and 6 are both retrieval under exam conditions — they count. No additional QuickRecallScreen required unless the skill involves recalling a framework (e.g. PEE, PEEL, PEEE) that learners may not have retained.

### Required exam application point
ExamQuestionFrame at steps 5 and 7. Both mark scheme reveals are required — the first shows the gap, the second confirms the improvement.

### Memorable Moment requirement
Carried by ExplainReveal at step 3. The Memorable Moment is the annotated worked example — the moment the learner sees, concretely, what a top-band answer actually does that a mid-band answer does not. This is not a fact — it is a demonstration. It must be specific, not general ("notice how this sentence uses the source's date to question its reliability" — not "good answers use evidence").

### Anti-patterns
- Do not introduce new content in this blueprint — all content should be material the learner has already encountered
- Do not use a single FaceTheExaminer — one attempt without comparison to the mark scheme does not build the skill
- Do not reveal the mark scheme before the learner has attempted the question
- Do not place ExamQuestionFrame at the end as a final test — it is a mid-sequence feedback tool in this blueprint

### Example — Source Utility (History: Elizabethan England)

```
1.  ChapterHookScreen          "A source is useful if it tells us accurate information about the period."
                               (False — utility is about purpose and context, not accuracy alone)
2.  ChapterOutcomeScreen       "Learn to write a Level 3 source utility answer using NOP: Nature,
                               Origin, Purpose. Mark scheme: L1 identifies, L2 explains, L3 analyses
                               utility in context."
3.  ExplainReveal              [MEMORABLE MOMENT] Annotated worked example: a mid-band answer next to
                               a top-band answer about the same source. The top-band answer uses the
                               same quote — but asks "why would the author choose to say this?" not
                               "what does this tell us?"
4.  FaceTheExaminer            Attempt 1: "How useful is Source A for an enquiry into Elizabethan
                               religious tensions?" (8 marks, 6 minutes)
5.  ExamQuestionFrame          Mark scheme reveal: where did attempt 1 sit? What word or phrase
                               would have moved it up a level?
6.  FaceTheExaminer            Attempt 2: a different source, same skill — slightly harder provenance
7.  ExamQuestionFrame          Mark scheme reveal: confirm the improvement
8.  ChapterCompleteScreen
```

---

## Blueprint 6 — Recovery

### Purpose
Re-engage a learner who has struggled with a topic. Triggered by the app after detecting repeated failure on specific questions. This blueprint prioritises confidence restoration over content coverage. It is shorter than standard modules.

### Best for
Any topic where the app has detected a weak spot. Content is not new — it is a targeted re-visit of something the learner already attempted and struggled with.

### Recommended sequence

```
1.  WeakSpotRecovery           [Active]   Full-screen intervention; acknowledge the struggle directly
                               and frame this as a focused recovery session
2.  RecoveryQuizPlayer         [Active]   3–4 targeted questions on the specific weak concept —
                               start easier than the questions that caused the failure
3.  RetrievalFrame             [Active]   One cinematic retrieval question at the level of the
                               original failure — rebuild confidence before application
4.  ExamQuestionFrame          [Active]   A single, low-stakes exam question with full mark scheme;
                               show that the concept appears in real exams
5.  ChapterCompleteScreen      [Terminal] Celebratory — acknowledge the recovery explicitly
```

**Energy curve:** I → R → R → A

There are no passive screens in the Recovery blueprint. This is intentional — the learner does not need more explanation of content they have already seen. They need guided practice.

### Required retrieval points
RecoveryQuizPlayer (step 2) and RetrievalFrame (step 3) — both required.

### Required exam application point
ExamQuestionFrame at step 4.

### Memorable Moment requirement
Not required. Recovery is not the place for new surprising ideas. Focus is entirely on rebuilding the learner's relationship with content they already encountered. A moment of genuine success — getting a question right that they previously failed — is the intended outcome.

### Anti-patterns
- Do not introduce new content — every question must be a variant of what the learner has already seen
- Do not start with a question at the same difficulty level as the failure — begin easier and build
- Do not omit RetrievalFrame — RecoveryQuizPlayer alone is not sufficient to rebuild confidence before an exam question
- Do not make the tone punishing — WeakSpotRecovery copy must be encouraging, never shame-based

### Example — Germ Theory (History: Medicine Through Time)

```
1.  WeakSpotRecovery           "You've found this one tricky. That's fine — it's one of the most
                               important turning points in the whole paper. Let's go again."
2.  RecoveryQuizPlayer         Q1: "Who developed germ theory?" (easier — recall)
                               Q2: "What did germ theory disprove?" (medium — application)
                               Q3: "Why did germ theory face resistance despite being correct?" (harder)
3.  RetrievalFrame             "Explain the significance of Pasteur's germ theory for the development
                               of medicine." — this was the question that caused the original failure
4.  ExamQuestionFrame          "Describe germ theory." (4 marks) — mark scheme reveals what
                               examiners are looking for and confirms the learner now knows it
5.  ChapterCompleteScreen      Acknowledge: "You've got this now."
```

---

## Sequence Constraints — Summary Table

| Blueprint | Max passive run | Min retrieval points | Attention reset (5 screens without interaction) | Memorable Moment required | Exam component required |
|-----------|----------------|---------------------|------------------------------------------------|--------------------------|------------------------|
| Story-Led | 2 (steps 4–5) | 2 | Yes | Yes | FaceTheExaminer + ExamQuestionFrame |
| Concept-Led | 2 (steps 4–6) | 2 | Yes | Yes | ExamQuestionFrame |
| Visual Exploration | 1 (step 4) | 2 | Yes | Yes | ExamQuestionFrame |
| Misconception Reveal | 2 (steps 4–5) | 1 (+ FaceTheExaminer) | Yes | Yes | FaceTheExaminer |
| Exam-Skill | 2 (steps 2–3) | 2 (FaceTheExaminer ×2) | Yes | Yes | ExamQuestionFrame ×2 |
| Recovery | 0 | 2 | Yes | No | ExamQuestionFrame |

---

## Global Anti-Patterns

These apply to all blueprints and override blueprint-specific guidance.

**Do not stack explanation screens.**
Two ExplainReveal or ConceptReveal screens in sequence are permitted. Three or more without an active screen between them violate the passive run limit and the attention reset rule. Split the content or restructure the sequence.

**Do not introduce new content immediately before an exam question.**
ExamQuestionFrame and FaceTheExaminer must only test content the learner has already processed and retrieved. Any concept introduced in the screen immediately before an exam question is not yet embedded — the learner will fail and not understand why.

**Do not end a chapter without retrieval.**
ChapterCompleteScreen may not immediately follow a passive screen. The final active screen before ChapterCompleteScreen must be a graded interaction — ExamQuestionFrame, FaceTheExaminer, RetrievalFrame, or QuickRecallScreen.

**Do not use CinematicRevealMoment as decoration.**
If CinematicRevealMoment does not carry a Memorable Moment, it adds passive load without benefit. Remove it and use the slot for an active screen instead.

**Do not treat the Memorable Moment as a fun fact.**
A surprising statistic is not a Memorable Moment unless it is framed to create personal connection, narrative consequence, or genuine counter-intuition. "25 million people died in the Black Death" is a fact. "If you lived in an English village in 1349, you would watch one in three of your neighbours die this year" is a Memorable Moment.

---

## Future Component Candidates

The following screen types emerged as gaps from blueprint analysis. They are **not yet approved** and must not be implemented without explicit sign-off. They are recorded here to inform future component development.

**Prior Knowledge Challenge**
A structured opening screen for Module 1 of a new subject that surfaces and records what the learner already knows — not a simple recall quiz, but a diagnostic that shapes subsequent pacing. Currently substituted with FillInTheBlanksBlock or ConceptReveal.

**Worked Example Walk-Through**
A step-by-step annotated model answer that learners move through at their own pace, with each annotation revealed in sequence. Currently approximated using ExplainReveal, but ExplainReveal is designed for cause-and-effect chains rather than exam answer annotation. Needed most by Exam-Skill blueprint (step 3).
