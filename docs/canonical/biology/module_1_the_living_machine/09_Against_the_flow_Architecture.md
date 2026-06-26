# Chapter 9: Against the flow — Architecture

## 1. Identity (brief)

- **Chapter number:** 9
- **Title:** Against the flow
- **Subject:** AQA GCSE Combined Science Trilogy — Biology
- **Module:** Module 1 — The living machine
- **Build status:** Not yet built

Content, Core argument, Specification requirements and the full Content reference pack: see `09_Against_the_flow_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### PART 1 — Situation + prediction

**Purpose:** Hook with the apparent paradox — how can a cell absorb something when the concentration is already higher inside?

**Proposed content:**
- Hook: "The soil around a plant's roots has almost no nitrate in it. Inside the root hair cells, there's already more nitrate than in the soil. Diffusion would push the nitrate OUT. So how does the plant absorb it at all?"
- Prediction: "Does absorbing mineral ions against the concentration gradient require energy? Yes / No / Don't know"
- You will learn: (1) what active transport is and how it differs from diffusion; (2) why root hair cells need many mitochondria; (3) how glucose absorption in the gut works; (4) the three-way comparison: diffusion / osmosis / active transport

**Suggested components:**
- `CinematicRevealMoment` — close-up root hair cell in soil; particles being pumped in against arrows showing the concentration gradient
- `ChapterHookScreen` — energy prediction (yes / no / don't know)

---

### PART 2 — Investigate the evidence

**Purpose:** Present the evidence that diffusion alone cannot explain root absorption before defining active transport.

**Proposed content:**
- Experiment context: if you block aerobic respiration (with cyanide or low oxygen), root cells stop absorbing mineral ions — but diffusion continues
- This is the proof that ion uptake requires metabolic energy = active transport
- Gut glucose absorption continues even when blood glucose > gut glucose — impossible by diffusion alone

**Suggested components:**
- `VisualNarrativeScreen` — two-beat narrative: (1) root cells absorbing minerals even when soil concentration is lower; (2) gut still absorbing glucose after concentration reverses — sets up the "something else is needed" conclusion
- `CardContainer` — "Evidence that mineral uptake isn't just diffusion": three cards showing the evidence (concentration data; energy-blocking experiments; mitochondria density in root hair cells)

---

### PART 3 — Discover the science

**Purpose:** Formal teaching of active transport; applications in roots and gut; three-way comparison.

**Proposed content:**
- Active transport definition: low → high concentration; against gradient; requires energy (ATP from respiration); requires carrier proteins
- Mechanism: carrier protein in membrane + ATP → substance moved against gradient
- Root hair cells: mineral ion concentration in soil < inside cell → active transport required → carrier proteins + mitochondria
- Gut epithelial cells: glucose absorption by diffusion then active transport → many mitochondria
- Three-way comparison table: diffusion / osmosis / active transport (direction; energy; carrier proteins; examples)

**Suggested components:**
- `ExplainReveal` — active transport chain: low concentration outside → gradient would push substance out → carrier protein + ATP from mitochondria → substance pumped in against gradient → high concentration inside
- `TheoryCompareBlock` — active transport vs diffusion (2-column); key distinctions highlighted: direction / energy / carrier proteins
- `ConceptReveal` — three-way comparison table reveal (diffusion → osmosis → active transport); reveals how they relate and differ
- `KeyFigureReveal` — optional: could focus on the root hair cell as the "most active" cell in the plant, or on mitochondria density as evidence of high energy demand

---

### PART 4 — Check precision

**Purpose:** Target the direction error and the "active = faster diffusion" misconception.

**Proposed content:**
- Misconception 1: "Active transport is just faster diffusion" → FALSE (opposite direction; different mechanism)
- Misconception 2: "Active transport moves things from high to low concentration" → FALSE (low to HIGH = against gradient)
- Misconception 3: "Root hair cells have chloroplasts to provide energy for active transport" → FALSE (mitochondria; not chloroplasts; underground)
- SpotTheError: "Active transport is the movement of particles from high to low concentration. Unlike diffusion, it uses energy." (error: direction is wrong — active transport is low → high)
- Matching: three processes matched to: direction / energy required / carrier proteins / examples

**Suggested components:**
- `MisconceptionCheck` × 3 — one per misconception listed above
- `SpotTheError` — direction error in active transport definition
- `MatchingTask` — 3 transport processes × 4 features (direction, energy, carrier proteins, example); complex but high-value

---

### PART 5 — Apply to a real GCSE-style task

**Purpose:** Exam practice for the compare, explain, and application question formats.

**Proposed content:**
- Q1: "Explain what is meant by active transport." (2 marks)
- Q2: "Explain why root hair cells have many mitochondria." (2 marks)
- Q3: "Compare diffusion and active transport. Include in your answer: direction of movement, energy requirements, and an example of each." (4 marks)
- Q4: "Explain how glucose is absorbed in the small intestine. Use ideas about concentration gradients in your answer." (3 marks)

**Suggested components:**
- `GuidedExamResponse` — Q3 (compare question; scaffold: Diffusion: direction ___, energy ___, example ___. Active transport: direction ___, energy ___, example ___. Key difference: ___)
- `ExamQuestionFrame` — Q1, Q2, Q4
- `FillInTheBlanksBlock` — Q1 definition fill-in (blank: "low concentration"; "high concentration"; "energy from respiration"; "carrier proteins")

---

### PART 6 — Face the examiner + debrief

**Purpose:** Examiner commentary on the comparison question; seal with retrieval.

**Proposed content:**
- Return to opening: "Can you now explain how the plant absorbs nitrate ions even though there's more nitrate inside the root cell than in the soil?"
- Examiner contrast: weak ("Active transport uses energy so it can absorb things") vs strong ("Mineral ions are at a lower concentration in the soil than inside the root hair cell, so they cannot be absorbed by diffusion. Instead, active transport uses energy from aerobic respiration (via mitochondria) to move mineral ions through carrier proteins in the cell membrane against the concentration gradient.")
- Mark commentary: "Three marks, three ideas: (1) concentration in soil < inside cell; (2) energy from respiration/mitochondria; (3) against the concentration gradient through carrier proteins."
- Retrieval questions (5):
  1. Define active transport.
  2. Why do root hair cells need many mitochondria?
  3. Name one substance absorbed by active transport in the gut.
  4. Give one difference between active transport and diffusion.
  5. Why does blocking aerobic respiration stop active transport but not diffusion?
- Interleave from Ch 8: "Which process — osmosis, diffusion or active transport — is used to absorb water in root hair cells?" (osmosis — reinforces the distinction between the three processes)

**Suggested components:**
- `FaceTheExaminer` — weak vs strong answer to mineral ion uptake question
- `ExaminerExplainsScreen` — "Three marks: concentration gradient reasoning + energy source + carrier proteins / against gradient. Each is a separate marking point."
- `QuickRecallScreen` — 5 retrieval questions
- `ChapterCompleteScreen`

---

### Module Completion Test

- [ ] Students can define active transport (low → high concentration; against gradient; energy from respiration; carrier proteins)
- [ ] Students can explain why mineral ions are absorbed by active transport not diffusion in root hair cells
- [ ] Students can explain why root hair cells have many mitochondria (energy for active transport)
- [ ] Students can explain how glucose is absorbed in the small intestine (diffusion then active transport)
- [ ] Students can list three differences between diffusion and active transport (direction; energy; carrier proteins)
- [ ] Students can add active transport to the three-way comparison table (direction; energy; examples)
- [ ] Students can explain why blocking aerobic respiration stops active transport but not diffusion
- [ ] Students can identify the carrier protein's role in active transport
- [ ] Students have written a full "explain why active transport is needed for mineral ion uptake" response that scores 3/3
- [ ] Students can distinguish which transport process (diffusion / osmosis / active transport) applies in each biological context

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Core argument integration:** "Going uphill requires energy" — this should thread from Part 1 (the paradox: soil has less nitrate than the root) through Part 3 (carrier proteins + ATP = the uphill pump) to Part 6 (the answer to the opening question). The "blocking respiration stops active transport" evidence is the strongest thread for the science-serious tone — it should be prominent in Part 2.

2. **MatchingTask for three-way comparison:** The Module 1 boss level (Ch 10) requires students to compare all three transport processes. The MatchingTask in Part 4 (3 processes × 4 features) is the highest-value activity in this chapter — it builds the comparison table from working memory rather than presenting it passively. Priority build item.

3. **TheoryCompareBlock active vs diffusion:** The two-column comparison (direction / energy / carrier proteins / examples) should be the centrepiece of Part 3. Students who can fill in this table without prompting will score 3–4 marks on comparison questions.

4. **GuidedExamResponse for the comparison question:** The 4-mark compare question (diffusion vs active transport) requires structured reasoning. The scaffold should model the six-point structure: direction of diffusion; energy of diffusion; example of diffusion; direction of AT; energy of AT; example of AT. Two points per process = 4 marks.

5. **Interleaving to Ch 7 and Ch 8:** Part 6 retrieval should explicitly revisit Ch 7 (diffusion direction; passive) and Ch 8 (osmosis; water only; passive) alongside Ch 9 content. This builds the three-way comparison that Ch 10 requires.

6. **Forward link to Ch 24 (aerobic respiration):** In Part 3, note: "ATP comes from aerobic respiration — we'll cover that in detail in Chapter 24." This plants the connection without teaching it prematurely.
