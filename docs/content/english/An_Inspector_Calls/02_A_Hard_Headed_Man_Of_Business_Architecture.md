# Episode 2: A Hard-Headed Man of Business — Architecture

## 1. Identity (brief)

- **Episode number:** 2
- **Title:** A hard-headed man of business
- **Build status:** Not yet built — full build from spec
- **Content pointer:** Content, Storyline, Specification requirements and the full Content reference pack: see `02_A_Hard_Headed_Man_Of_Business_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### Section 1 — Hook & Prior Recall
- **Purpose:** Prime retrieval of Episode 1's setting and opening; create curiosity about Birling's character; set up the dramatic irony trap.
- **Proposed content:**
  - True/false hook: "Mr Birling is presented as a wise and reliable figure whose views we should trust" (FALSE)
  - Recall from Episode 1: what was the mood at the opening dinner? who was there? what was the lighting?
  - Misconception trap: "Birling's predictions about the future show he is a man of the world" (FALSE — all his predictions were wrong)
- **Suggested component(s):**
  - `ChapterHookScreen` — true/false using the Birling-as-reliable-narrator misconception
  - `PriorKnowledgeRecall` — recall the room, the occasion, the characters from Episode 1

### Section 2 — Plot & Dramatic Action
- **Purpose:** Teach Birling's speeches scene by scene: the prosperity speech, the Titanic, the war prediction, and the self-interest speech. Show how each speech sets up dramatic irony.
- **Proposed content:**
  - The engagement toast: Birling uses the occasion to lecture Gerald and Eric
  - "Steadily increasing prosperity" speech — forward-prediction immediately undercut
  - The Titanic speech — "absolutely unsinkable" — the moment of peak dramatic irony
  - The war speech — "the Germans don't want war" — second layer of irony
  - The self-interest speech — "a man has to look after himself"
  - The dismissal of community — "community and all that nonsense"
  - The "lower costs and higher prices" reveal — the engagement as business deal
- **Suggested component(s):**
  - `ExplainReveal` — Birling says X → audience in 1945 knows Y → Priestley's purpose is Z (chain of dramatic irony)
  - `VisualNarrativeScreen` — beat sequence through the speeches, with audience reaction notes

### Section 3 — Theme & Context
- **Purpose:** Name and explain capitalism, dramatic irony, and the 1912/1945 split; connect Birling's speeches to Priestley's political message.
- **Proposed content:**
  - Theme: capitalism — "a man has to look after himself" = the capitalist creed
  - Theme: dramatic irony — how the 1945 audience's knowledge reverses Birling's authority
  - Theme: arrogance / class — Birling's "portentous" manner; his anxiety about the Crofts
  - AO3: 1912 Liberal government / laissez-faire economics — why Birling's worldview was mainstream in 1912
  - AO3: Priestley's socialism — writing in 1945, after two wars proved Birling wrong on every count
  - AO3: the Titanic as symbol — capitalism's hubris (claiming unsinkability) vs reality
  - AO3: new money vs old money — Birling's social anxiety about Gerald's family
- **Suggested component(s):**
  - `TheoryCompareBlock` — capitalism (Birling's worldview) vs socialism (Inspector's worldview) side-by-side
  - `MisconceptionCheck` — "Is Birling presented sympathetically?" (clear answer: no)

### Section 4 — Quote Analysis (AO2)
- **Purpose:** Active retrieval and analysis of 5–6 key Birling quotes.
- **Proposed content:**
  - "hard-headed practical man of business" (×3) — repetition; comic pomposity; self-description undercut by irony
  - "absolutely unsinkable" — the adverb; symbol of capitalism's false confidence
  - "a man has to make his own way — has to look after himself" — the capitalist creed; the dash = self-interruption showing even he is unconvinced?
  - "community and all that nonsense" — dismissal; the noun "nonsense" makes the Inspector's counter-thesis the play's moral answer
  - "lower costs and higher prices" — capitalism colonises personal relationships; people are commodities
  - "interests of Capital" — equates personal interests with capitalist system; profit IS his identity
- **Suggested component(s):**
  - `MatchingTask` — match quote to technique + effect
  - `InteractiveCollectionExplorer` — six Birling quotes, each with technique, analysis, context link
  - `ColSortBlock` — sort Birling quotes by theme (capitalism / dramatic irony / class / self-interest)

### Section 5 — Exam Practice
- **Purpose:** Write an AQA-style paragraph on Birling using dramatic irony, with a whole-play link.
- **Proposed content:**
  - Question: "How does Priestley present Arthur Birling in An Inspector Calls?"
  - Model paragraph: "absolutely unsinkable" → dramatic irony technique → effect on 1945 audience → whole-play link: Birling remains unchanged; the phone call at the end is the Titanic's iceberg
  - Guided write: student drafts their own paragraph
  - Examiner explains: difference between identifying dramatic irony and analysing its effect
- **Suggested component(s):**
  - `GuidedExamResponse` — paragraph scaffold on Birling
  - `ExaminerExplainsScreen` — what AO3 on dramatic irony looks like at Level 4 vs Level 5

### Section 6 — Retrieval & Wider Play Links
- **Purpose:** Retrieve Episode 1 content; introduce forward-links to later episodes where Birling will be seen again.
- **Proposed content:**
  - Retrieval from Episode 1: the lighting change; "not cosy and homelike"; the engagement dinner setting
  - Forward-link: Birling's self-interest speech will be tested when Eva's story is told in Episodes 4, 8, 9
  - Whole-play link: Birling's "knighthood" anxiety surfaces in Act 3 — his first concern after the Inspector leaves is not Eva's death but his public reputation
  - Quick recall: what three things does Birling get catastrophically wrong in his speeches?
- **Suggested component(s):**
  - `QuickRecallScreen` — three Birling predictions (Titanic, war, prosperity) + what really happened
  - `PriorKnowledgeRecall` — retrieve Episode 1 key quotes ("pink and intimate", "not a home")

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Storyline integration:** The dramatic irony is this episode's engine. Every screen in Section 2 should show Birling saying something, then immediately show the 1945 audience's knowledge that it's wrong. The `ExplainReveal` chain (Birling says → audience knows → Priestley's purpose is) is the right mechanic for this.

2. **Section 2 — sequence matters:** Don't teach all speeches at once. Build the dramatic irony cumulatively: prosperity → Titanic → war. By the third false prediction, learners should feel the comic/tragic weight of Birling's confidence.

3. **Section 3 — capitalism as a concept:** Learners need a brief, clear definition of capitalism (profit-driven, self-interest, workers as cheap labour) before the Inspector's socialist counter-argument lands. `TheoryCompareBlock` (capitalism vs socialism side-by-side) at this stage primes the whole series' thematic framework.

4. **Section 4 — six quotes is manageable:** All six are high-frequency exam quotes. Use `ColSortBlock` to sort them by theme first (so learners understand what each quote proves), then `MatchingTask` for technique identification.

5. **Section 5 — reinforce whole-play habit:** Even at Episode 2, the exam paragraph must link beyond this scene. The Birling "knighthood" line in Act 3 is the natural whole-play link — it shows his priorities have not changed.

6. **Avoid:** making this a "Birling is bad" episode. Priestley's technique is subtler — he makes Birling seem credible and then exposes him. The learner should feel the irony, not just be told Birling is wrong.
