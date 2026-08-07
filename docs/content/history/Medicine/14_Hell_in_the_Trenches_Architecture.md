# Episode 14: Hell in the Trenches — Architecture

## 1. Identity (brief)

- **Episode number:** 14
- **Title:** Hell in the Trenches
- **Build status:** Built as `history-medicine-western-front` (19 screens); full Issue 6 parity requires the downstream audit below
- Content, Storyline, Specification requirements and the full Content reference pack: see `14_Hell_in_the_Trenches_Content.md` in this directory.

---

## Navigation spine (6 parts)

Every Medicine module must be built as six clear navigation parts. These titles should appear in the module journey/progress navigation so the student always knows where they are in the story.

1. **Medicine Under Fire** — intro hook, surgery/public health recall and roadmap.
2. **Why the Western Front Was So Deadly** — trenches, weapons, terrain, infection and evacuation problems.
3. **From Trench to Treatment** — RAPs, ADS, CCS, base hospitals and the evacuation chain.
4. **New Problems, New Methods** — wounds, shell shock, gas, blood transfusion, X-rays and triage.
5. **War Speeds Up Medicine** — significance, limits and links to the whole Medicine course.
6. **Exam Prep: Historic Environment Mastery** — source utility, follow-up question, features and exam practice.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall surgery, infection and public health; frame the Western Front as the Historic Environment case study.
- **Proposed content for Episode 14:** PriorKnowledgeRecall, trench medical emergency hook, roadmap to conditions, evacuation, treatment and exam source skills.
- **Suggested components:** `CinematicRevealMoment`, `PriorKnowledgeRecall`, `WhatYouWillLearn`

### Section 2 — Learning Chunk 1
- **Purpose:** Teach the environment and why injuries were difficult to treat.
- **Proposed content for Episode 14:** Flanders and northern France; Ypres salient, Somme, Arras and Cambrai; trench organisation; terrain; damaged/overloaded transport and communications; mud, rats, lice, gas, rifles/explosives, shrapnel, infection and head injuries.
- **Required link:** named places must carry medical meaning, not appear as a detached list — terrain and infrastructure affect evacuation/treatment; Arras owns the underground hospital; Cambrai owns the prepared blood bank.
- **Suggested components:** `VisualLearning`, `InteractiveHotspotImage`, `QuickRecallScreen`

### Section 3 — Learning Chunk 2
- **Purpose:** Teach the evacuation and treatment chain.
- **Proposed content for Episode 14:** stretcher bearers; horse and motor ambulances; the field ambulance as a mobile RAMC unit; Regimental Aid Post; Advanced/Main Dressing Station; Casualty Clearing Station; base hospital; ambulance trains/barges; nurses and FANY; underground hospital at Arras.
- **Required distinction:** a field ambulance is a medical unit, not simply an ambulance vehicle.
- **Suggested components:** `VisualNarrativeScreen`, `MatchingTask`, `QuickRecallScreen`

### Section 4 — Learning Chunk 3
- **Purpose:** Teach medical developments and specific injuries.
- **Proposed content for Episode 14:** wound excision/debridement and Carrel–Dakin infection treatment; triage; Thomas splint; mobile X-rays; gas injuries; shell shock; direct transfusion and blood storage; Lawrence Bruce Robertson versus Oswald Hope Robertson; Cambrai blood depot.
- **Required historical context:** separate pre-war foundations (aseptic surgery, x-rays, transfusion, blood groups and splint design) from wartime experiment, adaptation and scale-up.
- **Suggested components:** `GuidedChoiceCarousel`, `ExplainReveal`, `QuickRecallScreen`

### Section 5 — Learning Chunk 4
- **Purpose:** Complete teaching — significance and limits.
- **Proposed content for Episode 14:** war accelerated surgery, transport and organisation; limits of conditions, infection, scale and psychological trauma; links to surgery, public health and technology.
- **Suggested components:** `ColSortBlock`, `ExplainReveal`, `QuickRecallScreen`

### Section 6 — Summary & Examiner
- **Purpose:** Historic Environment exam application and module completion.
- **Proposed content for Episode 14:** two separate 2-mark Q1 "describe one feature" prompts; Q2(a) source utility; Q2(b) follow-up; national versus local source types; strengths/weaknesses for a specific enquiry; enquiry-question framing; selection of an appropriate source and explanation of how it would help.
- **Exam boundary:** do not present a Q3 significance question as part of Section A. The supplied 2025 SAM ends the Historic Environment at Q2(b).
- **Suggested components:** `ExaminerExplainsScreen`, `FaceTheExaminer`, `ChapterCompleteScreen`

### Module Completion Test
- [ ] Section 1 includes retrieval (PriorKnowledgeRecall)
- [ ] Weak spots are generated
- [ ] Every learning chunk includes interaction
- [ ] Every learning chunk includes retrieval
- [ ] Interleaving exists throughout the module
- [ ] Weak spots are revisited in-module
- [ ] Core chapter message is reinforced
- [ ] Ypres salient, Somme, Arras and Cambrai are linked to their medical context
- [ ] Terrain plus transport/communications problems are explicit
- [ ] Horse/motor ambulances, field ambulance and the underground hospital at Arras appear in the evacuation/treatment sequence
- [ ] Wound/infection techniques and the early-twentieth-century medical context are explicit
- [ ] National/local sources, enquiry framing and appropriate source selection are assessed
- [ ] Section A uses the current Q1(a), Q1(b), Q2(a) and Q2(b) structure only
- [ ] Examiner content appears only in Section 6
- [ ] Module ends with a completion screen
- [ ] No feature component is used more than twice in the module

---

## 3. Current state & gap analysis

Built as a 19-screen runtime. Canonical inspection on 7 August 2026 found coverage of the trench environment, evacuation chain, Thomas splint, mobile X-rays, blood transfusion/Cambrai and source utility, but did not find explicit ownership of every Issue 6 setting, Arras underground hospital, field-ambulance/horse-ambulance detail or the complete national/local source-selection strand. The runtime also combines Lawrence Robertson with the Cambrai blood-bank story and must distinguish Lawrence Bruce Robertson (direct transfusion) from Oswald Hope Robertson (stored-blood depot).

This documentation amendment is not runtime approval. Re-audit all 19 screens against the completion checks above before calling the chapter syllabus-complete.

---

## 4. Build recommendations

1. Treat this as both content and exam-technique chapter: the Historic Environment questions need deliberate practice.
2. Use the four named places as anchors: Ypres/Somme for terrain and casualty context, Arras for the underground hospital, Cambrai for stored blood.
3. Keep the evacuation chain visually clear and repeatedly retrieved, including transport methods and the field-ambulance/unit distinction.
4. Distinguish Lawrence Bruce Robertson from Oswald Hope Robertson; the current runtime needs this factual correction.
5. Include the complete source-enquiry sequence in Part 6: national/local source knowledge → strengths/weaknesses for the enquiry → focused question → appropriate source selection → how it helps.
6. Coach the supplied 2025 SAM structure: Q1(a), Q1(b), Q2(a), Q2(b); no Historic Environment Q3.
7. Use links back to surgery, infection, public health and technology so this feels like the course finale.
