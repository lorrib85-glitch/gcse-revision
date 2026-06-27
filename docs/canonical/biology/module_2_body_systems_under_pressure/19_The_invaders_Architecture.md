# Chapter 19: The invaders — Architecture

## 1. Identity

- **Chapter:** 19
- **Module chapter:** Module 2, Chapter 9
- **Title:** The invaders
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Canonical reviewed; not yet built
- **Content file:** `19_The_invaders_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "Not every microbe is an enemy. A pathogen is the one that causes disease." Show harmless microbes fading while named pathogens remain.
- Prediction: "Which pathogen type causes malaria — bacterium, virus, fungus or protist?"
- You will learn: pathogen types, how they cause disease, transmission routes and AQA named diseases.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`, `PriorKnowledgeRecall`

---

### Part 2 — Investigate the evidence

- `TheoryCompareBlock`: four pathogen types:
  - bacteria
  - viruses
  - fungi
  - protists
- `CinematicCarousel`: one card per named disease:
  - measles
  - HIV/AIDS
  - tobacco mosaic virus
  - salmonella
  - gonorrhoea
  - rose black spot
  - malaria
- Each disease card should show:
  - pathogen type
  - transmission
  - symptoms/effects
  - prevention/treatment/control

**Components:** `TheoryCompareBlock`, `CinematicCarousel`, `VisualLearning`

---

### Part 3 — Discover the science

- `ExplainReveal`: bacteria vs viruses:
  - bacteria reproduce rapidly and produce toxins
  - viruses reproduce inside cells and damage/destroy cells
- `ConceptReveal`: transmission routes: air, water/food, direct contact, body fluids, vectors.
- `ConceptReveal`: vector precision using malaria: protist causes disease; mosquito transmits it.
- `MatchingTask`: disease → pathogen type → spread route.
- `ConceptReveal`: antibiotics only work on bacteria; resistance means bacteria become resistant, not people.

**Components:** `ExplainReveal`, `ConceptReveal`, `MatchingTask`

---

### Part 4 — Check precision

- `MisconceptionCheck`: "All bacteria cause disease." → false.
- `MisconceptionCheck`: "Antibiotics treat viral infections." → false.
- `MisconceptionCheck`: "Malaria is caused by mosquitoes." → false; mosquitoes are vectors.
- `SpotTheError`: "Rose black spot is a viral disease treated with antibiotics." Correction: it is fungal; control with fungicides/removing infected leaves.
- `SpotTheError`: "TMV is a disease caused by smoking." Correction: TMV is a plant virus affecting leaves.

**Components:** `MisconceptionCheck`, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- `GuidedExamResponse`: "Explain how malaria is transmitted and how its spread can be reduced. (4 marks)"
- `GuidedExamResponse`: "Compare how bacteria and viruses cause disease. (4 marks)"
- `MatchingTask`: named disease → pathogen type.
- `MatchingTask`: named disease → transmission route.
- `FillInTheBlanksBlock`: malaria/vector and bacterial toxin vocabulary.

**Components:** `GuidedExamResponse`, `MatchingTask`, `FillInTheBlanksBlock`

---

### Part 6 — Face the examiner + debrief

- `FaceTheExaminer`: student answer says malaria is caused by mosquitoes and misses protist/vector language. Mark commentary repairs the chain.
- `FaceTheExaminer`: student says antibiotics treat measles. Mark commentary explains viral disease and antibiotics.
- Quick recall: pathogen definition; four types; named disease types; transmission routes; one prevention/control for each.

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `TheoryCompareBlock`: four pathogen types
- `CinematicCarousel`: named diseases
- `VisualLearning`: transmission routes
- `ExplainReveal`: bacteria vs viruses causing disease
- `ConceptReveal`: vector precision
- `ConceptReveal`: antibiotics and resistance
- `MisconceptionCheck` × 3
- `SpotTheError` × 2
- `GuidedExamResponse`: malaria transmission question
- `GuidedExamResponse`: bacteria vs virus comparison
- `MatchingTask`: disease → type
- `MatchingTask`: disease → transmission
- `FaceTheExaminer`: malaria vector misconception
- `QuickRecallScreen`: 7 retrieval questions

---

## 4. Retrieval points

- Pathogen = microorganism that causes disease
- Bacteria can reproduce rapidly and produce toxins
- Viruses reproduce inside cells and damage/destroy cells
- Measles: virus, droplets, rash/fever, vaccination
- HIV: virus, body fluids/sexual contact, immune system damage, antiretrovirals
- TMV: virus, plant disease, mosaic leaves, reduced photosynthesis
- Salmonella: bacterium, contaminated food, toxins, vomiting/diarrhoea
- Gonorrhoea: bacterium, sexual contact, antibiotics/resistance
- Rose black spot: fungus, wind/water, fungicide/remove leaves
- Malaria: protist, mosquito vector, nets/insecticides/remove standing water

---

## 5. Exam skill focus

- 5-mark recall/definition: pathogen and four types
- 4-mark compare: bacteria vs viruses causing disease
- 4-mark explain: malaria transmission and prevention
- 3-mark explain: why TMV reduces plant growth
- 3-mark explain: antibiotic resistance in gonorrhoea
- Matching/classification: disease → pathogen type → transmission

---

## 6. Build notes

This chapter can easily become a memory dump. Use repeated sorting and matching so the student actively retrieves pathogen type, transmission and control.

Malaria needs special handling because students often write "mosquitoes cause malaria". The precise chain is: protist causes malaria; mosquito is the vector; reducing mosquito contact or breeding reduces transmission.

Do not overcomplicate viruses being alive/not alive. The GCSE exam payoff is: viruses reproduce inside host cells, damage cells, and antibiotics do not work on them.

---

## 7. Chapter completion test

- [ ] Student can define pathogen and name bacteria, viruses, fungi and protists
- [ ] Student can explain how bacteria and viruses cause disease
- [ ] Student can identify pathogen type for all named diseases
- [ ] Student can identify transmission route for all named diseases
- [ ] Student can explain malaria using protist + mosquito vector language
- [ ] Student can explain why antibiotics do not treat viral diseases
- [ ] Student can explain why TMV reduces plant growth
- [ ] Student has practised a 4-mark malaria question with mark commentary
