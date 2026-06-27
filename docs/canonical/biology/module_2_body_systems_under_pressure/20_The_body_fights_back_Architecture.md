# Chapter 20: The body fights back — Architecture

## 1. Identity

- **Chapter:** 20
- **Module chapter:** Module 2, Chapter 10
- **Title:** The body fights back
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Canonical reviewed; not yet built
- **Content file:** `20_The_body_fights_back_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "A pathogen gets past your first defences. Now the body has to recognise, attack and remember it." Show barrier defences failing, then immune response activating.
- Prediction: "Which one makes antibodies: phagocytes or lymphocytes?"
- You will learn: barriers, white blood cells, vaccination, antibiotics, resistance and drug testing.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`, `PriorKnowledgeRecall`

---

### Part 2 — Investigate the evidence

- `VisualLearning`: non-specific barriers:
  - skin/scabs
  - nose hairs and mucus
  - trachea/bronchi mucus and cilia
  - stomach acid
- `StepSequence`: phagocytosis.
- `StepSequence`: antibody/memory cell response.
- `StepSequence`: vaccination response.

**Components:** `VisualLearning`, `StepSequence`, `CinematicCarousel`

---

### Part 3 — Discover the science

- `TheoryCompareBlock`: phagocytosis vs antibody production vs antitoxin production.
- `ConceptReveal`: antibody specificity — antibody shape matches antigen shape.
- `ConceptReveal`: vaccination chain — safe antigen → antibodies → memory cells → faster future response.
- `ConceptReveal`: herd immunity as reduced pathogen spread.
- `TheoryCompareBlock`: antibiotics vs painkillers.
- `ExplainReveal`: antibiotic resistance sequence.
- `VisualLearning`: drug testing stages: discovery → preclinical → clinical → placebo/double-blind → peer review.

**Components:** `TheoryCompareBlock`, `ConceptReveal`, `ExplainReveal`, `VisualLearning`

---

### Part 4 — Check precision

- `MisconceptionCheck`: "Antibiotics kill all pathogens." → false.
- `MisconceptionCheck`: "Phagocytes produce antibodies." → false.
- `MisconceptionCheck`: "Painkillers kill pathogens." → false.
- `MisconceptionCheck`: "The person becomes antibiotic resistant." → false; bacteria become resistant.
- `SpotTheError`: "Vaccination injects active disease." Correction: vaccines contain dead/inactive pathogen or antigens.
- `SpotTheError`: "Double-blind means the drug is tested twice." Correction: doctor and patient do not know who receives drug/placebo.

**Components:** `MisconceptionCheck`, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- `GuidedExamResponse`: "Explain how vaccination protects against future infection. (5 marks)"
- `GuidedExamResponse`: "Explain how antibiotic-resistant bacteria become more common. (5 marks)"
- `GuidedExamResponse`: "Explain why placebos and double-blind trials are used. (4 marks)"
- `MatchingTask`: immune term → definition.
- `MatchingTask`: drug testing term → meaning.
- `FillInTheBlanksBlock`: vaccination mechanism vocabulary.

**Components:** `GuidedExamResponse`, `MatchingTask`, `FillInTheBlanksBlock`

---

### Part 6 — Face the examiner + debrief

- `FaceTheExaminer`: student vaccination answer says "the body learns" but misses antigens, antibodies and memory cells. Mark commentary rebuilds full chain.
- `FaceTheExaminer`: student resistance answer says people become resistant. Mark commentary fixes natural selection wording.
- `FaceTheExaminer`: student drug trial answer says placebo is fake medicine but misses control/bias. Mark commentary adds comparison and double-blind bias reduction.
- Quick recall: barriers, phagocytosis, antibodies, antitoxins, vaccination, antibiotics, resistance, double-blind trials.

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `VisualLearning`: non-specific barriers
- `StepSequence`: phagocytosis
- `StepSequence`: antibody and memory cell response
- `StepSequence`: vaccination sequence
- `TheoryCompareBlock`: white blood cell roles
- `ConceptReveal`: antibody-antigen specificity
- `ConceptReveal`: herd immunity
- `TheoryCompareBlock`: antibiotics vs painkillers
- `ExplainReveal`: antibiotic resistance by natural selection
- `VisualLearning`: drug testing stages
- `MisconceptionCheck` × 4
- `SpotTheError` × 2
- `GuidedExamResponse`: vaccination mechanism
- `GuidedExamResponse`: antibiotic resistance
- `GuidedExamResponse`: placebo/double-blind trial
- `MatchingTask`: immune terms
- `MatchingTask`: drug testing terms
- `FaceTheExaminer`: vague vaccination answer
- `QuickRecallScreen`: 8 retrieval questions

---

## 4. Retrieval points

- Non-specific defences: skin, scabs, mucus, cilia, stomach acid
- Phagocytosis = white blood cell engulfs and digests pathogen
- Antibodies bind to specific antigens
- Antitoxins neutralise toxins
- Memory cells enable faster future response
- Vaccination: safe antigens → antibodies → memory cells → faster response later
- Antibiotics kill bacteria or stop bacterial growth, not viruses
- Painkillers relieve symptoms but do not kill pathogens
- Antibiotic resistance: resistant bacteria survive, reproduce and spread
- Drug testing checks toxicity, efficacy and dose
- Placebo = inactive treatment used for comparison
- Double-blind = neither doctor nor patient knows treatment group; reduces bias

---

## 5. Exam skill focus

- 3-mark describe: body barriers
- 5-mark explain: vaccination mechanism
- 3-mark explain: antibiotics treat bacteria not viruses
- 5-mark explain: antibiotic resistance sequence
- 4-mark explain/evaluate: placebo and double-blind trials
- Matching/classification: immune terms and drug testing terms

---

## 6. Build notes

This is the final Module 2 chapter, so it should feel like a consolidation of infection and response, not a loose list.

The highest-value chains are:

1. vaccine antigen → antibody production → memory cells → faster future response
2. mutation → resistant bacteria survive → reproduce → resistant strain spreads
3. placebo comparison + double-blind = reduced bias

Make students practise the complete chains. Vague answers like "the body learns" will not score well enough.

---

## 7. Chapter completion test

- [ ] Student can name at least three non-specific defences and their roles
- [ ] Student can describe phagocytosis
- [ ] Student can distinguish antibodies, antitoxins and antibiotics
- [ ] Student can explain vaccination using antigens, antibodies and memory cells
- [ ] Student can explain why antibiotics do not work on viruses
- [ ] Student can explain antibiotic resistance as bacterial natural selection
- [ ] Student can describe preclinical and clinical testing
- [ ] Student can explain placebo and double-blind trials
- [ ] Student has practised a 5-mark vaccination answer with mark commentary
