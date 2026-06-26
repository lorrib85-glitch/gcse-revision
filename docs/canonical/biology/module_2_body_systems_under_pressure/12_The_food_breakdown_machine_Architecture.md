# Chapter 12: The food breakdown machine — Architecture

## 1. Identity

- **Chapter:** 12
- **Module chapter:** Module 2, Chapter 2
- **Title:** The food breakdown machine
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Canonical reviewed; not yet built
- **Content file:** `12_The_food_breakdown_machine_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "You've just eaten a sandwich. The bread, cheese and butter cannot enter your blood as sandwich. They have to be dismantled first." Show a sandwich breaking into glucose/sugars, amino acids, fatty acids and glycerol.
- Prediction: "What actually breaks food down — teeth, acid, enzymes, or bile?"
- You will learn: digestive organs, digestion, enzymes, lock-and-key model, substrates/products, absorption and bile.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`, `PriorKnowledgeRecall`

---

### Part 2 — Investigate the evidence

- Interactive digestive system diagram with organ hotspots:
  - mouth → chewing and amylase in saliva
  - oesophagus → moves food to stomach
  - stomach → churning, acid, protease/protein digestion
  - pancreas → produces amylase, protease and lipase
  - liver → produces bile
  - gall bladder → stores bile
  - small intestine → digestion completed and absorption happens
  - large intestine → water absorption
- Each hotspot should use the rhythm: organ → what happens there → what GCSE mark phrase matters.

**Components:** `InteractiveHotspotImage`, `VisualNarrative`

---

### Part 3 — Discover the science

- `ExplainReveal`: digestion = large insoluble molecules → small soluble molecules.
- `ExplainReveal`: mechanical digestion vs chemical digestion.
- Lock-and-key visual reveal:
  - enzyme
  - active site
  - substrate
  - complementary shape
  - enzyme-substrate complex
  - products released
  - enzyme reused
- `TheoryCompareBlock`: three enzyme classes:
  - carbohydrase/amylase: starch/carbohydrates → sugars
  - protease: proteins → amino acids
  - lipase: lipids/fats → fatty acids + glycerol
- `ConceptReveal`: bile is not an enzyme. Emulsification is physical; enzyme digestion is chemical.
- `ConceptReveal`: villi in the small intestine increase surface area for absorption.

**Components:** `ExplainReveal`, `TheoryCompareBlock`, `ConceptReveal`

---

### Part 4 — Check precision

- `MisconceptionCheck`: "Bile is an enzyme that digests fat." → false; bile emulsifies fats and neutralises acid.
- `MisconceptionCheck`: "All digestion happens in the stomach." → false; much digestion and absorption happen in the small intestine.
- `MisconceptionCheck`: "The large intestine absorbs digested food molecules." → false; the small intestine absorbs soluble products, while the large intestine mainly absorbs water.
- `SpotTheError`: "Amylase breaks down proteins in the stomach." Correction: amylase breaks starch/carbohydrate into sugars and acts in the mouth/small intestine.

**Components:** `MisconceptionCheck`, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- `MatchingTask`: enzyme → substrate → product.
- `MatchingTask`: organ → function.
- `FillInTheBlanksBlock`: "Proteins are broken down into ___ by ___."
- `GuidedExamResponse`: "Explain the role of bile in digestion. (3 marks)"
- `GuidedExamResponse`: "Explain how the small intestine is adapted for absorption. (4 marks)"

**Components:** `MatchingTask`, `FillInTheBlanksBlock`, `GuidedExamResponse`

---

### Part 6 — Face the examiner + debrief

- `FaceTheExaminer`: student answer says "Bile digests fat because it is an enzyme." Mark commentary explains:
  - bile is not an enzyme
  - bile emulsifies fats
  - emulsification increases surface area
  - lipase chemically digests lipids
- `FaceTheExaminer`: student answer says "The stomach absorbs all digested food." Mark commentary redirects to small intestine/villi.
- Quick recall: enzyme definition; lock-and-key; enzyme/substrate/product table; where bile is made/stored; what villi do.

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `InteractiveHotspotImage`: digestive system organs
- `ExplainReveal`: digestion definition
- `ExplainReveal`: lock-and-key enzyme action
- `TheoryCompareBlock`: three enzyme classes
- `ConceptReveal`: emulsification vs digestion
- `ConceptReveal`: villi and absorption
- `MisconceptionCheck` × 3: bile as enzyme; all digestion in stomach; large intestine absorption misconception
- `SpotTheError`: amylase/protein/stomach error
- `MatchingTask`: enzyme → substrate → product
- `MatchingTask`: organ → function
- `FillInTheBlanksBlock`: protease/amino acids sentence
- `GuidedExamResponse`: bile role question
- `GuidedExamResponse`: small intestine adaptation question
- `FaceTheExaminer`: bile misconception answer
- `FaceTheExaminer`: stomach absorption misconception answer
- `QuickRecallScreen`: 6 retrieval questions

---

## 4. Retrieval points

- Digestion = large insoluble molecules → small soluble molecules
- Enzyme = biological catalyst; not used up
- Lock-and-key model: active site, substrate, complementary shape, products released, enzyme reused
- Amylase/carbohydrase: starch/carbohydrates → sugars
- Protease: proteins → amino acids
- Lipase: lipids → fatty acids and glycerol
- Where enzymes are produced: salivary glands, stomach, pancreas, small intestine
- Bile: produced in liver, stored in gall bladder, released into small intestine, neutralises acid and emulsifies fats
- Small intestine: villi, large surface area, thin surface, good blood supply

---

## 5. Exam skill focus

- 2-mark definition: digestion
- 2-mark explain: lock-and-key model
- 3-mark explain: role of bile
- 4-mark explain: small intestine adaptations
- 4-mark correction: why "all digestion happens in the stomach" is wrong
- Table completion: enzyme → substrate → product

---

## 6. Build notes

The most common error in this topic is confusing bile with an enzyme. Give bile its own screen. The second common error is thinking the stomach does everything. Keep repeating: stomach starts some digestion; small intestine completes digestion and absorbs soluble products.

Do not overload with enzyme practical detail here. Chapter 13 handles food tests and Chapter 14 handles the amylase pH practical. This chapter should build the conceptual foundation.

---

## 7. Chapter completion test

- [ ] Student can define digestion precisely
- [ ] Student can name three digestive enzyme groups, their substrates and their products
- [ ] Student can state where each enzyme is produced and where it acts
- [ ] Student can explain the lock-and-key model in precise terms
- [ ] Student can explain the role of bile without calling it an enzyme
- [ ] Student can explain how villi help absorption
- [ ] Student can trace starch digestion from mouth to absorption in the small intestine
- [ ] Student has practised a 3-mark exam question on bile
