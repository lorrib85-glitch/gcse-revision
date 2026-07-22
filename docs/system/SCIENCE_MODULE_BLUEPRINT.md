# Science Module Blueprint (LOCKED)

**SCIENCE MODULE BLUEPRINT — AQA GCSE Combined Science**

This applies to all Biology, Chemistry and Physics modules unless explicitly overridden by the user.

Science modules must feel like investigating how the real world works, not reading a textbook.

Science should be:

- visual
- practical
- real-world
- exam-aware
- precise with vocabulary
- built around systems, not isolated facts

The student should repeatedly experience:

```
Situation → Prediction → Investigation → Explanation → Application → Exam response
```

Never begin a science module with a definition. Begin with a phenomenon, problem, mystery, experiment, image, or scenario.

### Core Science Rule

Every science chapter must answer: **Why does this happen?**

Examples:

- Why do athletes breathe faster after sprinting?
- Why do root hair cells not contain chloroplasts?
- Why does iron rust?
- Why does a bulb get dimmer in some circuits?
- Why do leaves lose more water on windy days?

Definitions come after the student cares about the answer.

---

### Required Six-Part Science Structure

Every Science chapter must follow this six-part structure.

Use this for Biology, Chemistry and Physics.

#### PART 1 — Situation + prediction

**Purpose**

Hook curiosity and activate prior knowledge.

The chapter must always start with:

- a real-world situation or scenario
- a prediction question
- a short "You will learn" section

**Use components**

- `CinematicRevealMoment`
- `ChapterHookScreen`
- `RetrievalFrame` if recapping prior knowledge

**Pattern**

Show a cinematic image/video. Present a short situation. Ask the student to predict what is happening. Do not mark harshly. This is curiosity, not assessment.

Then show:

**You will learn**

- 2–4 short learning outcomes
- written in student-friendly language
- tied directly to the opening mystery

**Example — Biology**

```
Scenario: A root hair cell lives underground.
Prediction: Does it need chloroplasts?

You will learn:
- how plant and animal cells are different
- why chloroplasts are only useful in cells that photosynthesise
- how to avoid a common GCSE exam trap
```

---

#### PART 2 — Investigate the evidence

**Purpose**

Let the student explore before formal teaching. Science should feel like evidence gathering.

**Use components**

- `InteractiveHotspotImage`
- `VisualLearning`
- `TimelineChain` (`variant: 'reveal'`) — the retired `VisualNarrativeScreen`'s replacement
- `CardContainer`

**Pattern**

Use diagrams, images, microscopic views, circuits, particles, organs, graphs or lab set-ups. The student should tap, reveal, compare, observe or notice patterns. Keep text short. One visual idea per screen.

**Examples**

- Biology: tap parts of an animal cell, tap parts of a plant cell, explore a root hair cell, inspect a leaf cross-section
- Chemistry: inspect particles before and after a reaction, explore a rusting iron surface, compare atoms and ions
- Physics: explore a simple circuit, inspect forces acting on a moving object, follow energy transfers in a rollercoaster

---

#### PART 3 — Discover the science

**Purpose**

Teach the core concept clearly after the student has seen the evidence.

**Use components**

- `ConceptReveal`
- `ExplainReveal`
- `TheoryCompareBlock`
- `CardContainer`
- `KeyFigureReveal` where a scientist or discovery matters

**Pattern**

Teach in this order:

1. What is happening?
2. Why does it happen?
3. What is the precise GCSE term?
4. Where does this appear in real life?
5. What mistake do students often make?

Avoid long paragraphs. Use clear sentence chunks.

**Example**

Do not start with:

> Chloroplasts are organelles found in plant cells.

Better:

> Chloroplasts absorb light energy for photosynthesis.
> Cells that do not photosynthesise do not need them.
> That is why root hair cells usually do not contain chloroplasts.

---

#### PART 4 — Check precision

**Purpose**

Catch misconceptions before they become embedded. This is especially important in Science because students often overgeneralise correct facts.

**Use components**

- `MisconceptionCheck`
- `SpotTheError`
- `MatchingTask`
- `ColSortBlock`
- `FillInTheBlanksBlock`
- `QuickRecallScreen`

**Required approach**

Every chapter should include at least one short precision check. Use this after the main teaching section.

**`MisconceptionCheck`**

Use when a statement sounds true but needs careful thinking.

Examples:

- All plant cells contain chloroplasts.
- All cells are the same size.
- Mitochondria make energy.
- Diffusion only happens in living things.
- Current gets used up in a circuit.

Format:

- one statement
- true/false or agree/disagree
- short reveal
- explain the exception or correction

**`SpotTheError`**

Use when the student must identify exactly what is wrong.

The component should show:

- a sample statement, calculation or assertion
- selectable words, phrases, sentences or numbers
- a text box where the student explains why the selected part is wrong
- feedback that checks both selection and explanation

Examples:

- "All plant cells contain chloroplasts so they can photosynthesise all the time."
- "The image size is 40 µm and the real size is 800 µm, so magnification is 20."
- "Electrons are used up as they move around a circuit."

This should feel like detective work, not a normal quiz.

---

#### PART 5 — Apply to a real GCSE-style task

**Purpose**

Move from understanding to exam performance.

Science papers often test:

- diagrams
- tables
- graphs
- calculations
- practical methods
- unfamiliar scenarios
- precise vocabulary

**Use components**

- `GuidedExamResponse`
- `ExamQuestionFrame`
- `MatchingTask`
- `FillInTheBlanksBlock`
- `QuickRecallScreen`
- `RetrievalFrame`

**`GuidedExamResponse`**

Use when the student needs structure for a written answer.

It should provide:

- the exam question
- the number of marks
- a guided answer scaffold
- sentence starters where useful
- prompts for key terms
- model answer after attempt
- mark-by-mark breakdown

**Example**

```
Question: Explain two differences between plant cells and animal cells. (4 marks)

Guided structure:
Difference 1:
  Plant cells have ______.
  This is used for ______.
  Animal cells do not have this structure.

Difference 2:
  Plant cells have ______.
  This is used for ______.
  Animal cells do not have this structure.
```

Then reveal a full-mark answer.

---

#### PART 6 — Face the examiner + debrief

**Purpose**

Show how marks are won and lost. Every major Science chapter should end with examiner thinking.

**Use components**

- `FaceTheExaminer`
- `ExaminerExplainsScreen`
- `ExamQuestionFrame`
- `WeakSpotRecovery`
- `ChapterCompleteScreen`
- `QuickRecallScreen`

**Pattern**

Return to the opening situation. Ask: *Can you now explain what was really happening?*

Then show an exam-style response. Use `FaceTheExaminer` to compare:

- weak answer
- improved answer
- mark scheme reason
- missing key terms
- common trap

**Required examiner language**

Be explicit about marks. Use phrases like:

- "This gets 1 mark because…"
- "This does not get the second mark because…"
- "The examiner needs the function, not just the structure."
- "This answer is too vague."
- "This is risky because it says all plant cells."

Finish with:

- 3–5 quick retrieval questions
- one interleaved question from an earlier chapter
- weak areas logged if the student struggles

---

### Science Content Design Rules

**Rule 1 — Real world first**

Every chapter needs a believable real-world link.

Good examples: root hair cells underground, athletes breathing heavily, food tests in a kitchen/lab, batteries in phones, rusting bikes, limescale in kettles, radiation in medicine, electricity in chargers.

Avoid forced examples that feel childish.

**Rule 2 — One idea per screen**

Science becomes overwhelming quickly. Do not combine too many ideas on one screen.

Bad: animal cells + plant cells + mitochondria + chloroplasts + photosynthesis + respiration + exam question, all together.

Better: one visual, one question, one action, one reveal.

**Rule 3 — Use diagrams constantly**

AQA Science papers are highly visual. Modules should regularly include labelled diagrams, microscope images, circuits, organs, graphs, tables, apparatus, particle diagrams.

Use `InteractiveHotspotImage` wherever the student needs to understand structure and function.

**Rule 4 — Teach systems, not isolated facts**

Science topics should connect. Examples:

- Biology: cell membrane links to diffusion, osmosis, active transport and disease; mitochondria links to respiration, exercise and energy release; chloroplasts link to photosynthesis, leaf structure and plant growth
- Chemistry: atoms link to ions, bonding, electrolysis and reactivity; acids link to salts, neutralisation and pH; energy changes link to reactions, batteries and fuels
- Physics: current links to voltage, resistance and circuits; forces link to motion, stopping distance and energy transfer; density links to particles, floating and states of matter

Make these connections explicit.

**Rule 5 — Precision beats volume**

Science exam marks often depend on exact wording. Always teach precise terms.

Examples:

- "release energy" not "make energy"
- "control the activities of the cell" for nucleus
- "controls movement in and out of the cell" for cell membrane
- "site of photosynthesis" for chloroplasts
- "from high concentration to low concentration" for diffusion
- "independent variable" not "thing you change" once the idea is understood

Use simple language first, then attach the GCSE term.

**Rule 6 — Practical skills appear everywhere**

Science modules should regularly train: independent variable, dependent variable, control variables, repeatability, risk/safety, method improvements, drawing conclusions from data, spotting invalid conclusions.

Do not save practical skills for separate practical-only chapters.

---

### Component Expectations

**`CinematicRevealMoment`**

Use for: opening mysteries, major reveals, dramatic science phenomena.

Keep: full-screen, cinematic, minimal text, subject palette, dark atmospheric background.

Avoid: random neon, dashboard layouts, childish gamification, too much text.

**`InteractiveHotspotImage`**

Use for: cells, organs, circuits, microscope parts, leaf structure, particle diagrams, apparatus.

Each hotspot should reveal: name, function, why it matters, one exam phrase if relevant.

**`TheoryCompareBlock`**

Use for: plant vs animal cells, aerobic vs anaerobic respiration, diffusion vs osmosis vs active transport, series vs parallel circuits, ionic vs covalent bonding, exothermic vs endothermic reactions.

Comparison must be concise and visually clear.

**`MatchingTask`**

Use for: structure → function, term → definition, reagent → food molecule, circuit symbol → component, variable → meaning, graph feature → interpretation.

Avoid making matching too easy. Include distractors where appropriate.

**`FillInTheBlanksBlock`**

Use for: key terms, equations, short factual recall, exam phrasing.

Do not overuse. It should reinforce precise vocabulary.

**`GuidedExamResponse`**

Use for: 2-mark explain questions, 3-mark explain questions, 4-mark compare questions, 6-mark extended responses.

Should include: scaffold, attempt area, model answer, mark-by-mark explanation, examiner warning.

**`FaceTheExaminer`**

Use near the end of every major chapter. Must show: weak student response, mark awarded, why marks were lost, stronger response, examiner takeaway.

For Science, focus heavily on: vague wording, missing key terms, contradictions, overgeneralisation, not using data, not answering the command word.

**`SpotTheError`** — built (`src/components/learning/SpotTheError.jsx`)

**Purpose**

Train students to identify incorrect reasoning, incorrect calculations, inaccurate statements and exam mistakes, and to explain *why* something is wrong. This is more powerful than multiple choice because it forces diagnosis, not recognition.

**Core interaction**

The student is shown a statement, calculation, graph interpretation, paragraph or exam answer with an error hidden inside it. They must:

1. **Tap** the incorrect part.
2. **Explain** why it's wrong.
3. **Repair** it — rewrite the statement so it's accurate.

The repair step matters most: most students can spot errors, fewer can fix them.

**Visual structure**

- No "Spot the error" title — too game-like. Use a small, plain, subtle opener: *"Something isn't right."* / *"Look closely."* / *"Check the reasoning."*
- The statement dominates the screen in a large, lightly-bordered, dark translucent card (`RADII.large`, `SPACING.standard` padding).
- **Every** word is individually selectable — never pre-chunk into obvious phrases like `[plant cells]` `[chloroplasts]`, or the answer becomes obvious. The student builds a selection by tapping words, phrases, numbers or clauses.
- Selected text gets a subtle subject-coloured glow, a 1px outline and slightly brighter text — never giant green boxes — plus a single one-shot pulse (`MOTION.scale.subtle`, no looping/permanent animation).
- The "Why is this incorrect?" explanation box slides up only after a selection is made — never shown upfront. Minimum height ~120px, placeholder *"Explain what is wrong..."*, character count hidden until typing starts.
- The "Rewrite the statement correctly" repair box appears only once the explanation has content.
- Submit button reads **"Check my thinking"** (sentence case per brand rules) and stays disabled until an error is selected and an explanation is entered.

**Feedback**

Never a bare "✗ Wrong". Use a calm headline — *"Good catch."* / *"Almost."* — followed by: what was wrong, why examiners care, the correct version, and the common GCSE trap it represents.

**Weak area integration**

Automatically logs **"Error identification"** and **"Scientific precision"** as separate weaknesses via `logWrongAnswer`/`logCorrectAnswer` (`src/unifiedWeaknessTracker.js`) — error identification is scored by how closely the selection overlaps the authored error span; scientific precision is scored against the explanation's use of the block's key GCSE terms.

**Block shape**

```js
{
  type: 'spotTheError',
  prompt?: string,            // overrides the default opener line
  statement: string,
  errorTarget: string,        // substring of `statement` marking the error
  whatWasWrong: string,
  examinerNote: string,
  correctVersion: string,
  commonTrap: string,
  keyTerms?: string[],        // used to judge explanation precision
}
```

**Universal across subjects** — Biology (*"All plant cells contain chloroplasts."*), Chemistry (*"Atoms gain electrons to form positive ions."*), Physics (*"Current is used up in a circuit."*), and equally usable in Maths, History and English with subject-appropriate statements.

**Layout rules:** mobile-first, max content width 720px, one error per screen, never reveal answer options — the student must diagnose independently. Subject imagery (if any) at 10–15% opacity only; focus stays on the statement. Should feel like an examiner handing the student a flawed piece of work and saying *"find the problem"* — not a quiz.

**`MisconceptionCheck`**

Use for: quick conceptual traps.

Should be: full-screen or near full-screen, cinematic, one statement at a time, minimal chrome, not a generic quiz card.

---

### Science Subject Playbooks

These do not replace the shared blueprint. They guide tone, examples and imagery.

**Biology Playbook**

Biology should feel alive, microscopic and system-based.

- Common hooks: illness, exercise, plants growing, cuts healing, cells working, survival, food and digestion, inheritance
- Visuals: cells, tissues, organs, blood, roots, leaves, microorganisms, ecosystems
- Use lots of: hotspots, diagrams, comparison blocks, misconception checks, guided exam responses
- Common exam traps: saying all plant cells have chloroplasts, confusing respiration and breathing, saying mitochondria make energy, confusing diffusion/osmosis/active transport, vague organelle functions, not using data from a graph or table

**Chemistry Playbook**

Chemistry should feel like hidden transformations.

- Common hooks: rusting, burning, batteries, explosions, cooking, cleaning products, metals reacting, electrolysis, colour changes
- Visuals: particles, atoms, ions, molecular structures, reaction vessels, flames, precipitates, electrodes, energy profiles
- Use lots of: before/after comparisons, particle animations, practical method tasks, spot-the-error equations, matching reagents/products, guided calculations
- Common exam traps: confusing atoms and ions, forgetting charges, weak state symbol understanding, describing observations vaguely, not balancing equations, not linking reactivity to electron loss/gain

**Physics Playbook**

Physics should feel like solving how the universe behaves.

- Common hooks: phones charging, rollercoasters, cars braking, electricity bills, sports motion, space, radiation in medicine, sound and light, circuits
- Visuals: circuits, forces, arrows, graphs, waves, machines, space, energy transfer diagrams
- Use lots of: prediction tasks, calculations, graph interpretation, variable changes, circuit interaction, spot-the-error calculations, guided equation responses
- Common exam traps: not showing working, wrong units, confusing mass and weight, thinking current is used up, confusing energy stores and transfers, describing graphs without using values

---

### Exam Reality

AQA Combined Science rewards: accurate recall, application to unfamiliar examples, diagrams and visual interpretation, practical method knowledge, graph/table interpretation, calculations with working, precise scientific vocabulary.

A strong module must train all of these.

A beautiful module that does not prepare students for exam questions is incomplete.

---

### Science Chapter Success Criteria

A Science chapter is complete only if the student can:

- explain the opening situation
- recall the key facts
- use the correct GCSE vocabulary
- interpret a relevant diagram
- avoid at least one common misconception
- apply the idea to a new example
- answer an exam-style question
- understand how the examiner awards marks

If any of these are missing, revise the chapter before building.
