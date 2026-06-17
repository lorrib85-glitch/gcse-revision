# Episode 12: When Medicine Became Magic — Architecture

## 1. Identity (brief)

- **Episode number:** 12
- **Title:** When Medicine Became Magic
- **Build status:** Built across `mod8` + `mod9` (mod8: 9 screens, no tags; mod9: 10 screens, no tags)
- Content, Storyline, Specification requirements and the full Content reference pack: see `12_When_Medicine_Became_Magic_Content.md` in this directory.

### Bundling note
`mod9` is shared between Episodes 12 and 13 (per the series map). The content split — "modern medicine" (Ep 12 = mod8 + mod9) vs "prevention and lung cancer" (Ep 13 = mod9 only) — must be resolved. Neither mod8 nor mod9 has any screen tags, so the actual content distribution between them is unverifiable without loading `history.js`. Splitting mod9 into two separate modules is the highest priority build action for these episodes.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall penicillin/antibiotics (Ep 11) and public health (Ep 8); set up the two transformations of 20th-century medicine — the individual scientific breakthroughs AND the systemic change (NHS); create curiosity about which matters more.
- **Proposed content for Episode 12:**
  - PriorKnowledgeRecall: probe antiseptic-surgery, penicillin, magic-bullet, public-health (three surgery problems from Ep 9 — bleeding still unsolved)
  - Hook: "By 1900, medicine had germ theory, antiseptics and vaccines. But if you were poor and got ill, you still had to pay — or die. What changed everything wasn't a discovery. It was a decision."
  - The unresolved surgery problem from Episode 9 (bleeding) as the opening interleave: "Remember the three problems of surgery? Pain solved by Simpson. Infection solved by Lister. But bleeding? That's where we start today."
- **Suggested components:**
  - `ChapterHookScreen` (True/False) — "The NHS was free to everyone from day one because the government had updated all the hospitals before it launched." [FALSE — access improved immediately but hospitals weren't updated initially]
  - `PriorKnowledgeRecall` — probe: penicillin, antiseptic-surgery, germ-theory, john-snow, public-health

### Section 2 — Learning Chunk 1
- **Purpose:** The causes revolution — genetics, DNA, lifestyle, and modern diagnosis.
- **Proposed content for Episode 12:**
  - Genetics: Mendel (by 1900, gene pairs); Watson and Crick 1953 (DNA double helix); Franklin and Wilkins's X-ray images; the Human Genome Project (1990)
  - Genetic medicine: identifying hereditary disease markers (breast cancer gene example)
  - Lifestyle factors: smoking → cancer/high blood pressure; diet → diabetes; tanning → skin cancer; drug use; unprotected sex
  - Modern diagnosis technologies: X-rays (1890s), ECGs (1900s), endoscopes (1900s), blood tests (1930s), ultrasound (1940s), CT scans (1970s), MRI scans (1970s)
  - The shift: doctors no longer need surgery to diagnose disease
- **Suggested components:**
  - `TimelineChain` — causes revolution: Mendel (1900) → Watson/Crick DNA (1953) → Human Genome Project (1990); each step revealing what it enabled for medicine
  - `MatchingTask` — match each diagnostic technology to its decade, its method, and what it diagnoses

### Section 3 — Learning Chunk 2
- **Purpose:** The treatment revolution — modern drugs and surgery.
- **Proposed content for Episode 12:**
  - Modern drugs: drug trials now take years (slower but safer); thalidomide failure (morning sickness → birth defects, 1960s); mass production + capsule tablets + hypodermic needle made drugs widely accessible
  - Prontosil 1932 (Domagk): first sulphonamide — bridges Episode 11's magic bullet story
  - Blood transfusions: Landsteiner blood groups (1900); blood banks in WWI; solves the bleeding problem from Episode 9
  - Organ transplants: kidney 1956, lung 1963, liver 1967, heart 1967
  - Keyhole and robotic surgery; injected anaesthetics (safer, since 1930s)
- **Suggested components:**
  - `ExplainReveal` — surgery chain: Landsteiner blood groups (1900) → blood banks WWI → safe transfusions → surgery's third problem SOLVED → organ transplants become possible
  - `MisconceptionCheck` — "Watson and Crick discovered DNA alone" [FALSE — Franklin/Wilkins essential]; "The NHS immediately provided high-quality care to everyone" [FALSE — quality improvements came in the 1960s]

### Section 4 — Learning Chunk 3
- **Purpose:** The NHS — the systemic revolution that made everything above available to everyone.
- **Proposed content for Episode 12:**
  - Context: before 1948, poor people could not afford doctors; access was conditional on wealth
  - Beveridge Report 1942: "5 Evils"; post-WWII will to rebuild society; evacuees exposed urban poverty
  - 1948 NHS: free at point of delivery; National Insurance funded; Aneurin Bevan; took over existing hospitals and surgeries
  - Short-term limitation: access improved immediately; care itself did not (government couldn't afford to update hospitals)
  - 1960s: more hospitals built; GP's charter 1966 improved standards
  - Long-term pressure: increased life expectancy → longer waits; increased costs
- **Suggested components:**
  - `KeyFigureReveal` — Aneurin Bevan: portrait, Minister of Health, NHS 1948, Beveridge Report context, free at point of delivery, short-term limitation, 1966 improvement
  - `QuickRecallScreen` — retrieval: 1942 Beveridge, 1948 NHS, Bevan, National Insurance, free at point of delivery, GP's charter 1966

### Section 5 — Learning Chunk 4
- **Purpose:** Significance — agents of change in 20th-century medicine; the delivery vs discovery distinction.
- **Proposed content for Episode 12:**
  - Agent review: 🔬 Science & technology (genetics, diagnosis, surgery); 👤 Individuals (Watson/Crick/Franklin, Landsteiner, Bevan); 🏛️ Government (NHS, Beveridge Report); ⚔️ War (blood banks in WWI → transfusions; WWII evacuees → NHS political will)
  - The delivery vs discovery distinction: science provided the discoveries; the NHS provided the delivery mechanism — without the NHS, all these breakthroughs would only have reached the wealthy
  - The resolution of the bleeding problem (three surgery problems from Ep 9, now all resolved)
- **Suggested components:**
  - `ColSortBlock` — sort 20th-century medical developments into "discovery" vs "delivery system" — shows that discoveries alone aren't enough
  - `QuickRecallScreen` — final retrieval: DNA 1953, Human Genome Project 1990, blood groups 1900, transplants (four dates), NHS 1948, Bevan, Beveridge, thalidomide

### Section 6 — Summary & Examiner
- **Suggested components:**
  - `ExaminerExplainsScreen` — examiner explains how to answer "how far did science and technology improve medicine in the 20th century?" — agree (genetics, diagnosis, surgery) then counter (NHS as the delivery mechanism that science alone couldn't provide); the best answer shows both working together
  - `FaceTheExaminer` — 16-mark "how far did the development of science and technology improve medicine in the twentieth century?" or 12-mark "explain why the NHS was important"
  - `ChapterCompleteScreen`

### Module Completion Test
- [ ] Section 1 includes retrieval (PriorKnowledgeRecall)
- [ ] Weak spots are generated
- [ ] Every learning chunk includes interaction
- [ ] Every learning chunk includes retrieval
- [ ] Interleaving exists throughout the module
- [ ] Weak spots are revisited in-module
- [ ] Core chapter message is reinforced
- [ ] Examiner content appears only in Section 6
- [ ] Module ends with a completion screen
- [ ] No feature component is used more than twice in the module

---

## 3. Current state & gap analysis

Built across `mod8` + `mod9` (mod8: 9 screens; mod9: 10 screens). Neither module has any screen tags. With no tags and no `history.js` audit, content distribution within the 19 screens is unverifiable.

**BUNDLING:**
`mod9` is shared between Episode 12 and Episode 13. The series map places `mod9` as covering both episodes. A rebuild must separate mod9's content into: (a) content belonging to Episode 12 (modern medicine) and (b) content belonging to Episode 13 (prevention / lung cancer). Until this is done, both episodes are untestable as coherent learning units.

**GAPS (all, given no tags):**
- No `genetics-dna` tag — Watson/Crick/DNA content unconfirmed
- No `human-genome-project` tag — 1990 project unconfirmed
- No `lifestyle-health` tag — smoking/diet/tanning lifestyle factors unconfirmed
- No `modern-diagnosis` tag — X-ray/CT/MRI technology table unconfirmed
- No `blood-transfusions` tag — Landsteiner blood groups / surgery's bleeding problem resolution unconfirmed
- No `organ-transplants` tag — four transplant dates (kidney/lung/liver/heart) unconfirmed
- No `nhs` tag — NHS 1948 launch unconfirmed
- No `beveridge-report` tag — Beveridge 1942 "5 Evils" unconfirmed
- No `aneurin-bevan` tag — key figure reveal unconfirmed
- No `thalidomide` tag — drug trial failure example unconfirmed
- No `prior-knowledge-recall` tag — Section 1 PriorKnowledgeRecall absent
- No `chapter-complete` tag — ChapterCompleteScreen absent

---

## 4. Build recommendations

1. **Storyline integration (🏛️ Government + 🔬 Science & technology):** Core takeaway — the NHS was the delivery mechanism that made all scientific discoveries available to everyone — should thread as: Section 1 hook ("it wasn't a discovery, it was a decision"), Section 3 (blood transfusions solve Ep 9's bleeding problem — science delivering), Section 4 (NHS = access for all regardless of ability to pay), Section 5 (ColSortBlock: discovery vs delivery). Each section adds one dimension to the "delivery matters as much as discovery" argument.

2. **Resolve mod8/mod9 bundling (highest priority):** This is the most urgent rebuild action. Split mod9 into: Episode 12 (modern medicine) and Episode 13 (prevention/lung cancer). Without this split, learners encountering "Episode 12" get a mixed-topic module with no coherent learning arc. Create separate module IDs (`history-medicine-modern-medicine` and `history-medicine-modern-prevention`) and move content accordingly.

3. **Interleave the surgery bleeding problem from Episode 9:** The "three problems of surgery" left the bleeding problem unsolved (blood transfusions = 20th century). Landsteiner blood groups (1900) → blood banks (WWI) → blood transfusions = the resolution. This interleave is one of the strongest cause-effect completions in the series — give it a cinematic moment (e.g. `CinematicRevealMoment`).

4. **Watson/Crick/Franklin credit nuance (Section 2):** The DNA discovery is standard GCSE content, but the Franklin/Wilkins contribution is the exam sophistication point — "Watson and Crick didn't do it alone" should be explicitly taught and tested via `MisconceptionCheck` or `ChapterHookScreen`.

5. **Organ transplant dates as retrieval targets (Section 3):** Four dates (1956, 1963, 1967, 1967) are individually testable. Include a `QuickRecallScreen` or `MatchingTask` that requires learners to match the organ to the year.

6. **NHS short-term vs long-term distinction (Section 4):** The standard exam trap is treating the 1948 NHS launch as an immediate improvement in care quality. The nuance — access improved; care quality came later (1960s hospitals, 1966 GP's charter) — is exam-testable and should be explicitly framed in a `MisconceptionCheck`.

7. **Episode 13 handoff:** End of Episode 12: "Medicine could now treat almost any disease. The challenge now was not cure — it was prevention. Because if smoking causes lung cancer, why is the government still collecting £4 billion in tobacco tax? And how do you stop a disease before it starts?" Sets up Episode 13 (prevention and lung cancer case study).

