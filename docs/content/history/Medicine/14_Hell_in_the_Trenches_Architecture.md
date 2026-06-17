# Episode 14: Hell in the Trenches — Architecture

## 1. Identity (brief)

- **Episode number:** 14
- **Title:** Hell in the Trenches
- **Build status:** Not yet built — full rebuild from spec. Module `history-medicine-western-front` exists in `src/modules.js` with 0 screens.
- Content, Storyline, Specification requirements and the full Content reference pack: see `14_Hell_in_the_Trenches_Content.md` in this directory.

### Critical note: dual purpose module
Episode 14 serves two distinct functions:
1. **Factual content:** Teach trench conditions, chain of evacuation, and medical developments (standard learning component structure)
2. **Source skills:** Teach how to evaluate sources for the Paper 1 Section A exam questions (Q1 "describe two features", Q2a source utility, Q2b source follow-up) — a skill-based component unlike any other episode in the series

The architecture must address both. The ExaminerExplainsScreen in Section 6 is particularly important here because the source skill questions have a specific structure that differs from the thematic study's "explain why"/"how far" questions.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall surgery problems from Episode 9 (particularly the unresolved bleeding problem) and penicillin from Episode 11 (WWII mass production driven by war); set up the Western Front as both a historical event and an exam component; create curiosity about how medicine survived conditions that seem incompatible with any kind of care.
- **Proposed content for Episode 14:**
  - PriorKnowledgeRecall: probe antiseptic-surgery, penicillin, anaesthetics — the surgery toolkit available to WWI doctors
  - Hook: "In 1916, on the first day of the Battle of the Somme, 57,000 British soldiers were wounded in a single day. The doctors had to improvise everything. And some of what they invented changed medicine forever."
  - Dual-purpose frame: "This episode covers both the historical content and the exam questions you'll face in Section A of the paper."
  - Roadmap: three threads — trench conditions; chain of evacuation; medical breakthroughs
- **Suggested components:**
  - `ChapterHookScreen` (True/False) — "The Thomas splint was invented during the First World War to treat leg fractures." [FALSE — designed pre-war by Hugh Owen Thomas; introduced on the Western Front but not invented there]
  - `PriorKnowledgeRecall` — probe: antiseptic-surgery, anaesthetics, penicillin, blood-transfusions

### Section 2 — Learning Chunk 1
- **Purpose:** The Western Front — trench system, conditions, and injuries.
- **Proposed content for Episode 14:**
  - Geography: northern France and Belgium; British, French, Belgian vs German
  - Trench system: front line → support (~60–90m back) → reserve → communication trenches
  - Conditions: mud/waterlogging (Passchendaele), body lice, cold, rotation between front/support/reserve
  - Trench injuries and illnesses:
    - Trench foot: cold/wet conditions → gangrene → amputation; whale oil prevention; foot inspections
    - Trench fever: body lice → flu-like symptoms
    - Shell shock: combat stress → anxiety/tremors/nightmares; court-martialled vs recognised as medical; first step toward PTSD
    - Gas attacks: chlorine/phosgene/mustard gas → burns/blindness/lung damage; masks developed
    - New weapons: machine guns, artillery, gas → new injury types requiring new techniques
    - Shrapnel wounds: shell explosions → deep infection risk; gunshot wounds: high-velocity bullets
    - Head injuries: steel helmets from 1915 (reduced skull deaths but brain injuries remained)
- **Suggested components:**
  - `VisualLearning` — cinematic sequence: the trench world — geography (map), conditions (mud, gas, cold), new weapons, new injuries
  - `QuickRecallScreen` — retrieval: trench foot (gangrene, whale oil), trench fever (lice), shell shock (court-martialled vs recognised), gas attacks, steel helmets 1915

### Section 3 — Learning Chunk 2
- **Purpose:** The chain of evacuation — five stages, key organisations, source skill introduction.
- **Proposed content for Episode 14:**
  - Five-stage chain: stretcher bearers → RAP → ADS/MDS → CCS → Base Hospital
  - Each stage: location, staffing, what they treated, limitations
  - Dressing stations: short distance behind trenches; abandoned buildings or tents; medical officers + orderlies + stretcher bearers; nurses after 1915; minor injuries treated (return to fight); severe cases passed on
  - FANY: women driving ambulances along the chain
  - RAMC: military medical corps; all provision; grew from ~3,000 to ~13,000 medical workers 1914–1918
  - Source skill connection: the chain of evacuation is one of the most common topics for Q1 and Q2 source questions
- **Suggested components:**
  - `TimelineChain` — the five evacuation stages as a chain: stretcher bearer → RAP → ADS/MDS → CCS → Base Hospital; each stage with location, staffing, purpose, and limitation
  - `MatchingTask` — match each evacuation stage to its key features (location / staffing / type of injury treated)

### Section 4 — Learning Chunk 3
- **Purpose:** Medical developments on the Western Front — four key breakthroughs.
- **Proposed content for Episode 14:**
  - Thomas splint: pre-war design; deployed on Western Front; femur fracture deaths 80% → 20%; the most dramatic single intervention of the war
  - Blood transfusions: donor present → storage methods (Lewisohn/Weil/Rous/Turner) → blood depot before Battle of Cambrai 1917; Robertson pioneers systematic use; connects to Episode 12 (blood banks → organ transplants)
  - Mobile X-rays: locate bullets/shrapnel without surgery near front line
  - Harold Gillies and plastic surgery: facial injuries common; skin grafts at Queen Mary's Hospital, Sidcup; foundation of modern plastic surgery
  - Aseptic surgery: applied under battlefield conditions; reduced post-operative infection
  - Shell shock: gradual recognition as genuine medical condition; primitive treatment but conceptual breakthrough
- **Suggested components:**
  - `ExplainReveal` — Thomas splint chain: problem (80% death rate from femur fractures) → Thomas splint introduced → 20% death rate; then blood transfusions chain: soldiers dying from blood loss → donor present → storage methods → Cambrai blood depot → blood banking invented (→ Episode 12 surgery revolution)
  - `MisconceptionCheck` — "The Thomas splint was invented during WWI" [FALSE — designed pre-war]; "Blood transfusions were straightforward" [FALSE — donor had to be present initially; storage was a new problem]; "Shell shock was well-treated on the Western Front" [FALSE — often court-martialled; recognition was the first step]

### Section 5 — Learning Chunk 4
- **Purpose:** Source skills — how to evaluate historical sources for the Q2(a) and Q2(b) exam questions.
- **Proposed content for Episode 14:**
  - Source utility framework: three criteria — content (what does it show?), provenance (nature/origin/purpose — who, why, when?), contextual knowledge (what do we know that supports or qualifies the source?)
  - Provenance types on the Western Front: private diary (Robertson) vs official record; medical professional (expert witness) vs civilian observer (chaplain, less clinical experience); photograph (accurate but possibly staged/selected)
  - Common provenance considerations: purpose affects what is shown; date affects what the person knew; role affects what they observed
  - Q2(b) technique: select a specific detail → formulate a question → identify a source type → explain how it would help answer the question. The question must be linked to the source detail, not generic.
  - Agents of change review: ⚔️ War as the dominant agent; 👤 Individuals (Thomas, Robertson, Gillies); 🏛️ Government (RAMC as military medical administration); 🔬 Science & technology (mobile X-rays, blood storage chemistry, skin grafts)
- **Suggested components:**
  - `ExaminerExplainsScreen` — source utility: the three-part framework for Q2(a); provenance types on the Western Front; why generic provenance comments score no marks; worked example with Robertson's diary
  - `FaceTheExaminer` — Q2(a) practice: "How useful are Sources A and B for an enquiry into [blood transfusions/chain of evacuation/trench conditions]?" — apply the three-part framework

### Section 6 — Summary & Examiner
- **Suggested components:**
  - `ExaminerExplainsScreen` — Q1 "describe two features" technique: each feature needs one statement + one supporting detail; common pitfalls (giving two details for one feature, giving unsupported features); plus Q2(b) follow-up technique walkthrough (detail → question → source type → how it helps)
  - `FaceTheExaminer` — Q1 practice: "Describe two features of dressing stations" or "Describe two features of blood transfusions on the Western Front"
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

Not yet built — full rebuild from spec.

`history-medicine-western-front` in `src/modules.js` has 0 screens. Full content needs to be written in `src/modules/history.js`.

---

## 4. Build recommendations

1. **Storyline integration (⚔️ War as primary agent):** Core takeaway — war is medicine's worst driver but most effective — should thread as: Section 1 hook (57,000 casualties in one day → improvisation), Section 4 (Thomas splint 80%→20% = the most dramatic single number; blood banking = the invention that lasted beyond the war), Section 5 (agents review: war created the urgency; individuals found the solutions), Section 6 (Q1 "describe two features" = the exam tests specific knowledge, so the dramatic statistics must be memorised). The takeaway at each section: impossible conditions → innovation → lasting legacy.

2. **Dual-purpose design (content + source skills):** This is the only module in the Medicine series that must also teach source evaluation skills. The source skill component should build gradually: Section 3 (chain of evacuation, with a note that these are Q1 topics), Section 5 (dedicated source skills section — the three-part utility framework), Section 6 (dedicated ExaminerExplainsScreen for Q1 + Q2b). Do not conflate content learning and source skill in the same screen — they are different cognitive tasks.

3. **The five evacuation stages as a retrieval target (Section 3):** All five stages (stretcher bearers/RAP/ADS/CCS/Base Hospital) with their locations, staffing, and limitations must be individually memorised. The `TimelineChain` is the right component here — one card per stage, with the specific details on each card (what it treated, who staffed it, where it was located). This is directly Q1-testable.

4. **The Thomas splint as the episode's centrepiece (Section 4):** 80% → 20% is the most memorable number in the episode. It should receive a dedicated `CinematicRevealMoment` — the before (80% dying from a broken leg) and after (20% with a simple splint). The pre-war origin (Hugh Owen Thomas, unused in peacetime) is the sophistication point.

5. **Blood transfusion story as series interleave (Section 4):** The blood transfusion development (donor present → storage → Cambrai blood depot 1917) is the direct answer to Episode 9's unresolved "bleeding" surgery problem. This must be explicitly named: "In Episode 9, we said bleeding remained unsolved. On the Western Front, the solution was found." Then connect forward to Episode 12 (blood banks → organ transplants). This is the series' most important interleaving link.

6. **Source skill scaffolding (Section 5):** The three-part source utility framework (content / provenance / contextual knowledge) should be taught with a worked example using a specific source type (Robertson's diary is ideal — it appears in both the 2025 SAMs and allows discussion of "expert witness" vs "private record" vs "written during the war"). The framework should be presented as a checklist, not as prose, so it is transferable.

7. **Shell shock as exam sophistication point:** Shell shock is the episode's most complex topic — it was not well-understood, not well-treated, and some sufferers were court-martialled. This is the `MisconceptionCheck` trap ("shell shock was well-treated") and the sophistication point in any "how far did medicine improve on the Western Front?" question. It must be taught explicitly as a limitation of the wartime medical system.

8. **No preceding episode handoff needed:** Episode 14 is the final episode in the Medicine Through Time series. The `ChapterCompleteScreen` should reference the series arc completion: from the Four Humours (Episode 1, where supernatural belief dominated medicine) to the Western Front (Episode 14, where science, government and individuals working together saved thousands of lives in impossible conditions).

