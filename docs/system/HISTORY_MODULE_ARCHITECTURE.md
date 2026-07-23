# History Module Architecture (LOCKED)

This structure applies to all GCSE History modules unless explicitly overridden by the user.

**The architecture is fixed.**

**Only the content changes between modules.**

**Do not reinterpret sections as different teaching categories.**

**Do not redesign the structure.**

### Fixed Section Order

#### Section 1 — Intro, Recall & Roadmap

**Mandatory Order**

1. Cinematic intro OR True/False opener
2. PriorKnowledgeRecall*
3. WhatYouWillLearn

**Purpose**

- Create curiosity
- Reactivate previous chapter knowledge
- Identify missing knowledge
- Generate weak spots
- Preview the chapter

**Typical Components**

- `CinematicRevealMoment`
- `ChapterHookScreen` (True/False)
- `PriorKnowledgeRecall`
- (WhatYouWillLearn is auto-generated from screen labels)

**Rules**

- Retrieval must happen before the roadmap.
- Missing concepts must be sent to the existing weakness tracker.
- Do not introduce examiner content.
- Do not turn Section 1 into a teaching section.

**AMENDMENT: Series Openers and Chapter 1 Episodes**

For the **first chapter of any series** (e.g., "Trust me, I'm Following Jupiter" — Episode 1 of Medicine Through Time):

- `PriorKnowledgeRecall` is **omitted**.
- There is no previous chapter to recall.
- Section 1 may be shorter than subsequent chapters.
- The opening hook should instead establish the series narrative and foundational context that all following chapters will build upon.
- This is NOT an exception to the architecture — it is an application of the rule that adapts to context: you cannot recall what has not been taught.

For all **subsequent chapters** within a series:

- `PriorKnowledgeRecall` is **mandatory**.
- Students must retrieve the preceding chapter(s) before new content begins.

---

#### Section 2 — Learning Chunk 1

**Purpose**

Introduce the first major part of the topic.

**Typical Components**

- `VisualLearning`
- `TimelineChain` (`variant: 'reveal'`) — the retired `VisualNarrativeScreen`'s replacement
- `CinematicRevealMoment`
- `InteractiveHotspotImage` — `detail` (default) or `reveal` variant
- `GuidedChoiceCarousel`
- `MatchingTask`
- `QuickRecallScreen`

**Rules**

- Include at least one interaction.
- Include at least one retrieval opportunity.
- End the chunk with active participation.

---

#### Section 3 — Learning Chunk 2

**Purpose**

Develop understanding.

Introduce new knowledge while revisiting earlier learning.

**Typical Components**

- `VisualLearning`
- `TimelineChain` (`variant: 'reveal'`) — the retired `VisualNarrativeScreen`'s replacement
- `InteractiveHotspotImage` (`variant: 'reveal'`)
- `GuidedChoiceCarousel`
- `MatchingTask`
- `ExplainReveal`
- `QuickRecallScreen`

**Rules**

- Include interleaving.
- Include active processing.
- End with retrieval or interaction.

---

#### Section 4 — Learning Chunk 3

**Purpose**

Continue teaching.

This may include:

- Human experience
- Stories
- Consequences
- Case studies
- Deeper explanation

depending on the chapter.

**Typical Components**

- `VisualLearning`
- `TimelineChain` (`variant: 'reveal'`) — the retired `VisualNarrativeScreen`'s replacement
- `InteractiveHotspotImage`
- `GuidedChoiceCarousel`
- `MatchingTask`
- `ExplainReveal`
- `QuickRecallScreen`

**Rules**

- Do not assume Section 4 is always "human experience".
- Include interleaving.
- Include active participation.
- End with retrieval or interaction.

---

#### Section 5 — Learning Chunk 4

**Purpose**

Complete the chapter's teaching.

Often used for:

- Significance
- Consequences
- Change and continuity
- Final understanding

**Typical Components**

- `VisualLearning`
- `TimelineChain` (`variant: 'reveal'`) — the retired `VisualNarrativeScreen`'s replacement
- `CinematicRevealMoment`
- `ExplainReveal`
- `ColSortBlock`
- `MatchingTask`
- `QuickRecallScreen`

**Rules**

- End with chapter-level retrieval.
- Reinforce the chapter's core message.
- Do not introduce Meet The Examiner.

---

#### Section 6 — Summary & Examiner

**Mandatory Order**

1. Final summary (optional)
2. Examiner tips
3. Meet the Examiner / Exam practice
4. Chapter completion screen

**Typical Components**

- `ExaminerExplainsScreen`
- `FaceTheExaminer`
- `ChapterCompleteScreen`

**Rules**

- No major new content.
- Focus on application.
- Focus on exam technique.
- Show improvement journeys.
- End with a completion screen.

---

### PriorKnowledgeRecall Component

This is the standard retrieval component used at the beginning of every History chapter (except series openers — see Section 1 amendment).

**Purpose**

Ask students what they remember from the previous chapter.

**Visual Design**

This should feel like a continuation of the story.

**Do NOT style this as:**

- A worksheet
- A form
- A revision website
- A dashboard

**Instead use:**

- Cinematic history background
- Dark overlay
- Large parchment-style writing area
- Atmospheric presentation

**Think:**

"Returning to the story"

rather than

"Completing a form"

**Component Flow**

Screen A

- Prompt: "What do you remember about the previous chapter?"
- Student enters free text.

Screen B

- Analysis screen.
- Show: ✓ Secure concepts, ○ Concepts to revisit
- No grades. No percentages. No marks.

Example output:

```
Good recall.

You remembered:
✓ Church power
✓ Four Humours
✓ God and illness

Let's keep an eye on:
○ Miasma
○ Astrology

These will appear again during the chapter.
```

**Concept Structure**

```js
{
  tag: "miasma",
  label: "Miasma",
}
```

- Use `tag` and `label`
- Do not use keyword lists (content-based AI assessment instead)
- The API receives the actual module content as `sourceContent`

**Scoring**

Recommended thresholds:

- 0.0 – 0.29 = weak (log to weakness tracker)
- 0.3 – 0.69 = partial (show as "revisit")
- 0.7 – 1.0 = secure (show as "recalled")

**Weak Spot Handling**

- Use the existing weakness tracker.
- Do NOT create a separate store.
- Missing concepts should later reappear in: `QuickRecallScreen`, `MatchingTask`, `ColSortBlock`, `FaceTheExaminer`, recovery quizzes.

---

### Retrieval Rule

Whenever possible:

```
Recall
  ↓
Teach
  ↓
Apply
  ↓
Recall
```

Avoid long sequences of passive teaching screens.

---

### Weak Spot Recovery Rule

Every module must deliberately revisit weak spots identified during that module.

**AMENDMENT: Series Openers and Chapter 1 Episodes**

For the **first chapter of any series** (e.g., Episode 1 of Medicine Through Time):

- In-chapter weak spot recovery does **not apply**.
- Weak spots cannot meaningfully exist within Chapter 1 because there is no pre-existing base knowledge to revisit.
- Example: In Episode 1 "Trust me, I'm Following Jupiter", students encounter Four Humours, miasma, and astrology for the first time. A weak spot identified mid-Chapter 1 cannot be "recovered" — it can only be revisited in **subsequent chapters** when these concepts appear again in new contexts.
- Weak spot tracking still occurs (through `QuickRecallScreen`, `MatchingTask`, etc.), but recovery happens in **Chapter 2 onwards** when previous chapter concepts are reintroduced.

For all **subsequent chapters** within a series:

- Weak spots identified through `PriorKnowledgeRecall` (from the prior chapter) must be revisited in-module.
- Weak spots identified through `QuickRecallScreen`, `MatchingTask`, `FaceTheExaminer` should reappear later in the module.
- Weak spots should not remain hidden until a future chapter.

---

### Interleaving Rule

Interleaving means deliberately revisiting previous learning.

Example: In the Black Death module, concepts like Church influence, Four Humours, Miasma, and Astrology should repeatedly reappear throughout activities.

Do not introduce a concept once and then abandon it.

---

### One Screen = One Job

Each screen should have one primary purpose.

**GOOD**

- Introduce miasma
- Match treatments
- Recall symptoms

**BAD**

- Teach miasma, teach astrology, explain treatments, ask questions all on the same screen

---

### History Storytelling Rule

History should feel like a story unfolding.

Prefer:

```
Question
  ↓
Discovery
  ↓
Explanation
  ↓
Retrieval
```

over:

```
Fact
  ↓
Fact
  ↓
Fact
  ↓
Fact
```

Create curiosity wherever possible.

---

### New Component Approval Rule

Do not create a new component because a screen needs different content.

Only create a new component when:

1. The interaction mechanic is genuinely new.
2. It is reusable across multiple modules.
3. Existing components cannot reasonably achieve the same outcome.

Default assumption: **Use an existing component.**

---

### Component Selection Hierarchy

**When teaching:**

1. `VisualLearning`
2. `TimelineChain` (`variant: 'reveal'`) — the retired `VisualNarrativeScreen`'s replacement
3. `InteractiveHotspotImage` — `detail` (default) or `reveal` variant
4. `GuidedChoiceCarousel`

**When checking understanding:**

1. `QuickRecallScreen`
2. `MatchingTask`
3. `ColSortBlock`
4. `GuidedChoiceCarousel`

**When explaining cause and effect:**

1. `ExplainReveal`
2. `TimelineChain` (`variant: 'reveal'`) — the retired `VisualNarrativeScreen`'s replacement

**When creating atmosphere:**

1. `CinematicRevealMoment`

---

### Component Repetition Limit

Within a single chapter, no feature component (the "Typical Components"
used for teaching, checking understanding, cause-and-effect, or atmosphere —
see Component Selection Hierarchy) should be used more than twice.

If a third use is needed, choose a different component from the same
hierarchy tier instead of repeating one.

This rule does not apply to:

- Section 1 and Section 6 mandatory-order components — each appears once by
  definition.
- `QuickRecallScreen` and `PriorKnowledgeRecall`, which deliberately recur
  under the Retrieval Rule and Weak Spot Recovery Rule.

Repeating the same feature component more than twice makes a chapter feel
repetitive, even when the content is different each time.

---

### History Brand Rules

Follow the History brand system.

**Use:**

- Antique brown
- Bronze
- Parchment
- Warm historical tones
- Dark cinematic backgrounds

**Avoid:**

- Dashboard layouts
- Generic quiz websites
- Excessive gamification
- Glassmorphism
- Neon UI
- One-off visual styles

History should feel premium, cinematic and immersive.

---

### Module Completion Test

Before a History module is considered complete, verify:

- ✓ Section 1 includes retrieval (PriorKnowledgeRecall) *OR is a series opener*
- ✓ Weak spots are generated (or tracked for later recovery if series opener)
- ✓ Every learning chunk includes interaction
- ✓ Every learning chunk includes retrieval
- ✓ Interleaving exists throughout the module (or deferred to later chapters if series opener)
- ✓ Weak spots are revisited in-module (or scheduled for recovery in subsequent chapters if series opener)
- ✓ Core chapter message is reinforced
- ✓ Examiner content appears only in Section 6
- ✓ Module ends with a completion screen
- ✓ No feature component is used more than twice in the module

If any of the above are missing, the module is incomplete.

**CLARIFICATION: Series Openers**

For Chapter 1 episodes (series openers), the weak spot recovery rule is **deferred, not waived**. Weak spots identified in Episode 1 will be revisited when those topics reappear in Episode 2 and beyond. This is a cascade effect across the series, not a gap in the architecture.
