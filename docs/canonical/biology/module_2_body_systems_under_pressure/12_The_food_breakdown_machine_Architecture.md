# Chapter 12: The food breakdown machine — Architecture

## 1. Identity

- **Chapter:** 12
- **Title:** The food breakdown machine
- **Subject:** AQA GCSE Combined Science Trilogy — Biology Paper 1
- **Module:** Module 2 — Body systems under pressure
- **Build status:** Not yet built
- **Content file:** `12_The_food_breakdown_machine_Content.md`

---

## 2. Six-part structure mapping

### Part 1 — Situation + prediction

- Hook: "You've just eaten a sandwich. The bread and cheese will enter your bloodstream within hours — but only if the right things happen first." Show a loaf of bread shrinking down to a glucose molecule.
- Prediction: "What do you think breaks down food in the body — heat, acid, or something else?"
- You will learn: enzymes, the digestive organs, substrates and products, and the role of bile.

**Components:** `CinematicRevealMoment`, `ChapterHookScreen`

---

### Part 2 — Investigate the evidence

- Interactive digestive system diagram: organs labelled as hotspots — mouth (amylase), oesophagus (muscular), stomach (pepsin/acid), small intestine (lipase, protease, absorption), large intestine (water), pancreas (all three enzyme types), liver (bile), gall bladder (bile storage)
- Each hotspot: organ name → what it does → enzyme(s) or secretion produced

**Components:** `InteractiveHotspotImage`

---

### Part 3 — Discover the science

- Lock-and-key model: animated or visual reveal — active site, substrate, enzyme-substrate complex, products released
- TheoryCompareBlock: three enzymes side by side — carbohydrase (starch → sugars), protease (proteins → amino acids), lipase (fats → fatty acids + glycerol)
- Bile: emulsification vs digestion — theoryCompare or ConceptReveal to distinguish bile's physical action from enzyme chemical action

**Components:** `ExplainReveal`, `TheoryCompareBlock`, `ConceptReveal`

---

### Part 4 — Check precision

- MisconceptionCheck: "Bile is an enzyme that digests fat." → false (emulsification is a physical process)
- MisconceptionCheck: "All digestion happens in the stomach." → false
- SpotTheError: "Amylase breaks down proteins in the stomach." (two errors: wrong substrate, wrong organ, wrong pH)

**Components:** `MisconceptionCheck` × 2, `SpotTheError`

---

### Part 5 — Apply to a real GCSE-style task

- MatchingTask: enzyme → substrate → product (carbohydrase/amylase, protease, lipase)
- FillInTheBlanksBlock: "Proteins are broken down into ___ by ___. This enzyme is produced in the ___ and ___."
- GuidedExamResponse: "Explain the role of bile in digestion. (3 marks)"

**Components:** `MatchingTask`, `FillInTheBlanksBlock`, `GuidedExamResponse`

---

### Part 6 — Face the examiner + debrief

- FaceTheExaminer: student answer confuses bile with an enzyme; mark commentary explains the distinction
- QuickRecallScreen: 5 questions — name the substrate for amylase; what are the products of lipid digestion; where is bile made; where is bile stored; what is the lock-and-key model?

**Components:** `FaceTheExaminer`, `QuickRecallScreen`

---

## 3. Active learning interactions

- `InteractiveHotspotImage`: digestive system diagram
- `ExplainReveal`: lock-and-key enzyme action
- `TheoryCompareBlock`: three enzyme classes
- `ConceptReveal`: emulsification vs digestion
- `MisconceptionCheck` × 2: bile as enzyme; all digestion in stomach
- `SpotTheError`: amylase/protein error
- `MatchingTask`: enzyme → substrate → product
- `FillInTheBlanksBlock`: protease/amino acids sentence
- `GuidedExamResponse`: bile role question
- `FaceTheExaminer`: bile misconception answer
- `QuickRecallScreen`: 5 retrieval questions

---

## 4. Retrieval points

- Three enzyme classes and their substrates/products
- Where each enzyme is produced and where it acts
- Bile: produced in liver, stored in gall bladder, emulsifies fats, neutralises acid
- Lock-and-key model: active site, substrate, complementary shape, enzyme-substrate complex
- Digestion mainly in small intestine; absorption through villi

---

## 5. Exam skill focus

- 2-mark explain: explain what is meant by the lock-and-key model
- 3-mark explain: explain the role of bile in digestion
- 4-mark compare: compare the action of two digestive enzymes (substrate, product, where produced)

---

## 6. Build notes

The most common error in this topic is confusing bile with an enzyme. The distinction (emulsification = physical; enzymes = chemical) needs its own screen. The lock-and-key model is frequently examined as a 2-mark explain — a visual animated reveal is ideal. Do not teach all three enzyme classes simultaneously — teach them in sequence with a clear visual anchor for each.

---

## 7. Chapter completion test

- [ ] Student can name three digestive enzymes, their substrates and their products
- [ ] Student can state where each enzyme is produced and where it acts
- [ ] Student can explain the lock-and-key model in precise terms
- [ ] Student can explain the role of bile (emulsification + neutralisation) without calling it an enzyme
- [ ] Student can trace the journey of a piece of starch from mouth to absorption in the small intestine
- [ ] Student has practised a 3-mark exam question on bile
