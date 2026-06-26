# Chapter 2: Zooming into the invisible — Architecture

## 1. Identity (brief)

- **Chapter number:** 2
- **Title:** Zooming into the invisible
- **Subject:** AQA GCSE Combined Science Trilogy — Biology
- **Module:** Module 1 — The living machine
- **Build status:** Not yet built

Content, Core argument, Specification requirements and the full Content reference pack: see `02_Zooming_into_the_invisible_Content.md` in this directory.

---

## 2. Architecture checklist (tailored)

### PART 1 — Situation + prediction

**Purpose:** Hook curiosity around scale and the limits of the eye.

**Proposed content:**
- Opening scenario: "The cells in Chapter 1 are real. But they're so small that 40 of them would fit across a human hair. How do scientists actually see them?"
- Hook image: side-by-side — a blurry light micrograph of mitochondria vs a sharp electron micrograph of the same organelle
- Prediction: "Which of these images was taken with a light microscope? Which was taken with an electron microscope? What's the difference?"
- You will learn: (1) how light and electron microscopes work differently; (2) what magnification and resolution mean; (3) how to calculate actual cell size from a microscope image

**Suggested components:**
- `CinematicRevealMoment` — side-by-side micrograph comparison as the hook
- `ChapterHookScreen` — prediction (light / electron / can't tell)

---

### PART 2 — Investigate the evidence

**Purpose:** Let students compare the two microscope types before formal comparison.

**Proposed content:**
- Light microscope image gallery: cheek cells, onion skin cells, blood cells — all in colour, visible but limited detail
- Electron micrograph gallery: same organelles at vastly higher resolution — mitochondria cristae, ribosome clusters, nuclear pore detail
- Scale bar exploration: measure a scale bar on a micrograph, work out what the magnification must be

**Suggested components:**
- `VisualLearning` — cinematic sequence showing the "zoom in" from naked eye → light microscope → electron microscope, with scale labels at each level
- `CardContainer` — one card per microscope type showing key specs (magnification, resolution, living/dead, colour/B&W, cost)

---

### PART 3 — Discover the science

**Purpose:** Formal teaching of microscopy concepts and the magnification formula.

**Proposed content:**
- Light vs electron microscope comparison: radiation used, magnification, resolution, specimen state, colour
- Resolution concept: the ability to distinguish two separate points — why wavelength determines this
- Magnification formula: M = I/A introduced with a worked example
- Unit ladder: m → mm → µm → nm with conversion factors
- Scale bar method: step-by-step worked example
- Common calculation traps: mixing units, multiplying instead of dividing

**Suggested components:**
- `TheoryCompareBlock` — light vs electron microscope (2-column); focused on: radiation, magnification, resolution, living specimen?, colour, cost
- `ExplainReveal` — resolution chain: shorter wavelength → higher resolution → more detail → ultrastructure discovered
- `ConceptReveal` — magnification formula with the triangle (M, I, A) — visual mnemonic
- `CardContainer` — worked examples of magnification calculations (2–3 examples with increasing difficulty)

---

### PART 4 — Check precision

**Purpose:** Target the magnification/resolution confusion and calculation errors.

**Proposed content:**
- Misconception: "Electron microscopes are just more powerful light microscopes" → FALSE (different radiation, different principle)
- Misconception: "Higher magnification always means more detail" → FALSE (resolution is the limiting factor)
- Calculation SpotTheError: student calculates 8 mm × 400 = 3,200 µm instead of 8 mm ÷ 400 = 20 µm
- Unit conversion practice: express 0.05 mm in µm; express 250 nm in µm

**Suggested components:**
- `MisconceptionCheck` × 2 — magnification vs resolution; electron microscope = just bigger
- `SpotTheError` — the ×÷ calculation error
- `FillInTheBlanksBlock` — unit conversion drill (mm → µm → nm)

---

### PART 5 — Apply to a real GCSE-style task

**Purpose:** Calculation practice under exam conditions.

**Proposed content:**
- Q1: "A cell image is 30 mm long. The actual cell is 0.06 mm long. Calculate the magnification." (2 marks)
- Q2: "A scale bar on a micrograph represents 10 µm and measures 25 mm. A structure on the same image measures 5 mm. Calculate the actual size of the structure in µm." (3 marks)
- Q3 (explain): "Explain why electron microscopes can show more detail than light microscopes." (2 marks)
- Q4: "Give one advantage and one disadvantage of using a light microscope to study cells." (2 marks)

**Suggested components:**
- `GuidedExamResponse` × 2 — Q1 (scaffolded magnification calculation) and Q3 (scaffolded explain question with key term prompts: resolution, wavelength, electrons)
- `ExamQuestionFrame` — Q2 (scale bar) and Q4 (advantage/disadvantage)

---

### PART 6 — Face the examiner + debrief

**Purpose:** Seal the chapter with examiner commentary and retrieval.

**Proposed content:**
- Return to opening: "Can you now explain why the electron micrograph showed more detail?"
- Examiner contrast: weak ("because electron microscopes are more powerful") vs strong ("electron microscopes use electrons which have a much shorter wavelength than light, giving higher resolution — the ability to distinguish two separate points")
- Mark commentary: "Saying 'more powerful' gets 0 marks. The examiner needs 'higher resolution' and the reason: shorter wavelength."
- Retrieval questions (5):
  1. What is the formula for magnification?
  2. What is resolution?
  3. Give one advantage of a light microscope over an electron microscope.
  4. Convert 0.025 mm into µm.
  5. A cell image measures 60 mm. Magnification is ×3,000. What is the actual cell size in µm?
- Interleave: "In the next chapter, you'll use a microscope yourself — preparing and viewing a real slide."

**Suggested components:**
- `FaceTheExaminer` — weak vs strong response to "explain why electron microscopes show more detail"
- `ExaminerExplainsScreen` — "resolution vs magnification — the examiner tests this distinction every year"
- `QuickRecallScreen` — 5 questions (mix of definition recall and calculation)
- `ChapterCompleteScreen`

---

### Module Completion Test

- [ ] Students can state what a light microscope uses and its maximum magnification (~×1,500)
- [ ] Students can state what an electron microscope uses and its maximum magnification (~×2,000,000)
- [ ] Students can define resolution as the ability to distinguish two separate points
- [ ] Students can explain why electron microscopes have higher resolution (shorter wavelength of electrons)
- [ ] Students can state that electron microscopes require dead specimens (vacuum)
- [ ] Students can apply M = I/A correctly with matching units
- [ ] Students can use a scale bar to calculate actual size of a cell or organelle
- [ ] Students can convert between mm, µm and nm
- [ ] Students can distinguish magnification from resolution
- [ ] Students can answer a 2-mark "explain why electron microscopes show more detail" question with resolution + wavelength

---

## 3. Current state & gap analysis

Not yet built — full build from spec.

---

## 4. Build recommendations

1. **Core argument integration:** The "tool reveals structure" narrative should thread from Part 1 (we need tools to see cells) through Part 3 (resolution is why electrons beat light) to Part 6 (return to the opening micrograph comparison). The comparison in Part 1 and Part 6 should be the same pair of images — a deliberate before/after bookend.

2. **Calculation scaffolding priority:** Magnification calculations are among the most reliably examined items in AQA Biology Paper 1. Part 5's `GuidedExamResponse` for the magnification calculation should include: (a) a visual of the formula triangle, (b) worked step showing unit matching, (c) the answer with correct unit, (d) an examiner warning about the ×÷ swap error.

3. **MisconceptionCheck ordering:** Magnification vs resolution should come BEFORE the calculation practice — if students conflate them, calculations will feel arbitrary. Establish the conceptual distinction first in Part 4, then practice calculations in Part 5.

4. **Visual asset needed:** Side-by-side light micrograph / electron micrograph of the same cell or organelle (e.g. mitochondrion at light level vs TEM level). This is the centrepiece of Parts 1 and 6. Flag for visual asset planning.

5. **Interleaving to Ch 1:** Part 2's gallery should include organelles from Ch 1 — students should recognise nucleus, chloroplasts, cell wall from the hotspot diagrams. This reinforces Ch 1 vocabulary while teaching Ch 2 tool concepts.

6. **Interleaving forward to Ch 3:** Part 6 should explicitly name "next chapter: you'll do this yourself in the microscope practical." Seeds Ch 3 without teaching it.
