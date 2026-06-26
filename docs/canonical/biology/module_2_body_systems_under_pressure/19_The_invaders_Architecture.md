# Chapter 19: The invaders — Architecture

## 1. Identity

- **Chapter:** 19
- **Title:** The invaders
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Not yet built
- **Content file:** `19_The_invaders_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "Every hour, thousands of microorganisms enter your body — in the air you breathe, the food you eat, the surfaces you touch. Most never make you ill. What separates a harmless microbe from a pathogen?" Cinematic — microbes surrounding a human figure.
- Prediction: "Bacteria, viruses, fungi and protists can all cause disease. Which do you think causes the most common infectious diseases in humans?"
- You will learn: the four pathogen types and how each causes disease; transmission routes; six named diseases.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`

---

### Part 2 — Investigate the evidence

- CinematicCarousel or VisualLearning: one slide per named disease — name, type, transmission route, effect, prevention/treatment
- Cover: measles (virus, droplets, MMR), HIV (virus, body fluids, antiretrovirals), TMV (virus, contact, no cure), salmonella (bacteria, food, toxins), gonorrhoea (bacteria, sexual contact, antibiotics), rose black spot (fungus, wind/water, fungicide), malaria (protist, mosquito vector, antimalarials)

**Components:** `CinematicCarousel`, `VisualLearning`

---

### Part 3 — Discover the science

- ExplainReveal: how each pathogen type causes disease — bacteria → toxins; viruses → cell damage/destruction; fungi → invasion of tissue; protists → parasitic damage
- TheoryCompareBlock: the four pathogen types — type, cellular/non-cellular, example disease, how it causes harm
- ConceptReveal: vectors — malaria as the key example; female Anopheles mosquito as vector; Plasmodium as the protist; why preventing the vector prevents disease

**Components:** `ExplainReveal`, `TheoryCompareBlock`, `ConceptReveal`

---

### Part 4 — Check precision

- MisconceptionCheck: "All bacteria cause disease." → false (most bacteria are harmless or beneficial)
- MisconceptionCheck: "Viruses are living organisms." → false (not cellular, no independent metabolism — why antibiotics don't work against them)
- SpotTheError: "Rose black spot is a viral disease that is treated with antibiotics." (Two errors: rose black spot is fungal, not viral; antibiotics treat bacterial infections, not fungal ones — fungicides are used)

**Components:** `MisconceptionCheck` × 2, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- GuidedExamResponse: "Describe how malaria is transmitted and explain how this transmission can be prevented. (4 marks)"
- FillInTheBlanksBlock: "Bacteria cause disease by releasing ___. Viruses cause disease by replicating inside ___ and damaging them. The ___ mosquito is the vector for malaria."
- MatchingTask: disease → pathogen type → transmission route (all six named diseases)

**Components:** `GuidedExamResponse`, `FillInTheBlanksBlock`, `MatchingTask`

---

### Part 6 — Face the examiner + debrief

- FaceTheExaminer: student describes how malaria spreads without naming the vector or the protist; mark commentary insists on Anopheles mosquito + Plasmodium
- QuickRecallScreen: name one viral disease in plants; how does salmonella cause food poisoning; what is a vector; why do antibiotics not treat viral infections; name the organism that causes malaria?

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `CinematicCarousel`: named diseases — one per slide
- `VisualLearning`: transmission routes overview
- `ExplainReveal`: how each pathogen type causes disease
- `TheoryCompareBlock`: four pathogen types
- `ConceptReveal`: vectors and malaria transmission chain
- `MisconceptionCheck` × 2: all bacteria cause disease; viruses are living
- `SpotTheError`: rose black spot classified as viral/treated with antibiotics
- `GuidedExamResponse`: 4-mark malaria transmission question
- `FillInTheBlanksBlock`: pathogen mechanisms vocabulary
- `MatchingTask`: disease → type → transmission
- `FaceTheExaminer`: malaria answer missing vector name
- `QuickRecallScreen`: 5 retrieval questions

---

## 4. Retrieval points

- Four pathogen types: bacteria (toxins), viruses (cell damage), fungi (tissue invasion), protists (parasitic)
- Measles: virus; droplet; MMR vaccine
- HIV: virus; body fluids; antiretroviral drugs; leads to AIDS
- TMV: plant virus; contact; mottling; disrupts photosynthesis; no cure
- Salmonella: bacteria; contaminated food; toxins; vomiting and diarrhoea
- Gonorrhoea: bacteria; sexual contact; antibiotics; increasing resistance
- Rose black spot: fungus; wind and water; fungicide or remove affected leaves
- Malaria: protist Plasmodium; female Anopheles mosquito (vector); antimalarials; bed nets; drain standing water

---

## 5. Exam skill focus

- 4-mark describe + explain: describe malaria transmission and how to prevent it
- 2-mark describe: describe how bacteria cause disease
- 1-mark recall: name the vector for malaria / name the pathogen type for a named disease
- Classification question: identify pathogen type from a description

---

## 6. Build notes

The six named diseases must each be taught with all five details (name, pathogen type, transmission, effect, prevention/treatment) — AQA exam questions ask for these specifically. Malaria is the most complex named disease and the most frequently examined, requiring the full chain: Plasmodium → female Anopheles mosquito (vector) → bite. The rose black spot / viral confusion is a high-frequency error and needs its own SpotTheError. The distinction between viruses (not living, no cells) and bacteria (living, prokaryotic) explains why antibiotics only work on bacteria.

---

## 7. Chapter completion test

- [ ] Student can define pathogen and name the four types
- [ ] Student can name all six required diseases and state the pathogen type and transmission route for each
- [ ] Student can explain what a vector is and give malaria as an example (naming the mosquito species and the protist)
- [ ] Student can explain why antibiotics do not treat viral or fungal diseases
- [ ] Student knows the treatment/prevention for each named disease
- [ ] Student has practised a 4-mark malaria question with mark commentary
