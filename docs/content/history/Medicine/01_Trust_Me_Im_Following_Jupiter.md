# Episode 1: Trust Me, I'm Following Jupiter

## Scope note (read first)

This file is a **content-only knowledge source**, produced as a scale-test of
the `canonical-topic` skill's extraction pipeline (PDF → `pdftotext` →
keyword search → targeted read). Per explicit session instruction:

- **No comparison against `src/modules.js` was performed.** The "Current
  state & gap analysis" section (normally Section 4 of this template) is
  **omitted entirely** — this file does not assess what is or isn't already
  built.
- **Scope = Medieval Medicine c1250–1500, PLUS the Ancient Greek/Roman
  background that feeds into it** (Hippocrates, Galen and why their ideas
  still dominated 1000+ years later).
- **The Black Death (1348–49) is explicitly OUT OF SCOPE** — it is Episode
  2's case study ("The Day Everything Changed"). Anywhere source material
  discussed the Black Death specifically, it has been excluded from the
  content reference pack below and flagged inline as `EXCLUDED — Episode 2`.
  General concepts that the Black Death later *re-uses* (miasma, astrology,
  Four Humours, religious causation) ARE in scope here, because Episode 1 is
  where they are first established — Episode 2 then interleaves back to them.

## 1. Identity

- **Episode number:** 1
- **Title (series map):** Trust Me, I'm Following Jupiter
- **Subtitle / GCSE topic:** Medieval Medicine c1250–1500
- **Era:** c1250–c1500 (per Edexcel spec wording), with foundational
  background from Ancient Greece (Hippocrates, c460–370 BC) and Ancient Rome
  (Galen, c129–216 AD) whose ideas the spec says had "continuing influence...
  in England"
- **Key Topic reference:** N/A — Series 1 (Medicine Through Time) has no Key
  Topic numbering
- **Build status:** Not assessed in this file (see Scope note above)

## 2. Specification requirements

Drawn verbatim/near-verbatim from the Edexcel GCSE (9-1) History
specification (Issue 6, June 2024), Option 11 "Medicine in Britain,
c1250–present", strand **c1250–c1500: Medicine in medieval England**:

- **Strand 1 — Ideas about the cause of disease and illness**
  - Supernatural and religious explanations of the cause of disease.
  - Rational explanations: the Theory of the Four Humours and the miasma
    theory.
  - The continuing influence in England of Galen.
- **Strand 2 — Approaches to prevention and treatment**
  - Approaches to prevention and treatment, and their connection with ideas
    about disease and illness:
    - Religious actions.
    - Bloodletting and purging.
    - Purifying the air.
  - Medical training and traditional approaches to treatment and care for
    the sick:
    - The role of the physician, apothecary and barber surgeon.
    - The role of hospitals.
    - Care within the community and at home, including the use of herbal
      remedies.
- **Strand 3 — Case study** — Dealing with the Black Death, 1348–49;
  approaches to treatment and attempts to prevent its spread.
  - `EXCLUDED — Episode 2`. Not developed further in this file. Note for a
    future Episode 2 file: per the architecture doc's own worked example,
    Episode 2's `PriorKnowledgeRecall` should test exactly the concepts
    documented here (Church power, Four Humours, Miasma, Astrology, God and
    illness) as "previous chapter knowledge."

Additional spec framing that applies across the whole option (relevant to
how this episode should be built):

- Students should understand **patterns of change, trends and turning
  points**, and the influence of factors **inhibiting or encouraging
  change**. The key factors named by the spec are:
  - Individuals and institutions (Church and government)
  - Science and technology
  - Attitudes in society
- These factors map directly onto the "five agents of change" used across
  this app's Medicine Through Time series (War, Religion, Individuals,
  Government, Science & technology) — see Section 6 below for how each
  applies to this episode specifically.

No `MISSING:` sub-topics identified — the session-provided material covers
both spec strands (minus the excluded Black Death case study) in depth.

## 3. Architecture checklist (tailored)

Per `docs/system/HISTORY_MODULE_ARCHITECTURE.md` (LOCKED). This section maps
the content in Section 5 onto the fixed Section 1–6 structure. It is a
**content-placement proposal only** — it does not assess what currently
exists.

- **Section 1 — Intro, Recall & Roadmap**
  - Purpose: Create curiosity; reactivate previous chapter knowledge;
    identify missing knowledge; generate weak spots; preview the chapter.
  - Proposed content for this episode:
    - As the **first** Medicine Through Time episode, `PriorKnowledgeRecall`
      cannot recall a previous *chapter* in this series — instead it should
      recall general KS3/background knowledge: the power of the medieval
      Church over everyday life, the idea of the "Dark Ages" (c410–1066)
      losing Roman knowledge, low literacy.
    - True/False hook candidates drawn from the content reference pack:
      - "Galen lived in Ancient Rome, over 1,000 years before the period
        this chapter covers." (True)
      - "Medieval doctors saw sneezing as a sign something had gone wrong
        with treatment." (False — sneezing was seen as the body healthily
        expelling excess phlegm, i.e. the Four Humours self-correcting)
      - "The Church encouraged people to challenge old medical ideas."
        (False — challenging Galen risked challenging God; Roger Bacon was
        jailed for it)
  - Suggested component(s):
    - `ChapterHookScreen` (True/False) — for the candidate statements above.
    - `PriorKnowledgeRecall` — recall of general medieval-Church/Dark-Ages
      background knowledge, atmospheric/parchment styling per the locked
      component spec.

- **Section 2 — Learning Chunk 1**
  - Purpose: Introduce the first major part of the topic.
  - Proposed content for this episode — **the Ancient foundations**:
    - Hippocrates (Ancient Greece): created the Theory of the Four Humours
      (blood, phlegm, black bile, yellow bile); healthy = balanced, ill =
      imbalanced.
    - Galen (Ancient Rome): developed Hippocrates' theory further; created
      the **Theory of Opposites** (treat an excess humour with its opposite
      quality — e.g. too much phlegm [cold/wet] → eat something hot, like
      pepper).
    - Humours linked to seasons (winter = wet/cold = too much phlegm) and
      personality (hot-tempered = too much yellow bile) and to star signs —
      a natural bridge into astrology (Section 3).
    - The "continuing influence in England of Galen" (spec's exact phrase) —
      why ideas over 1,000 years old still dominated: Church promotion,
      book-learning culture, lack of alternatives/dissection ban.
  - Suggested component(s):
    - `VisualNarrativeScreen` — "the story of two ancient doctors" framing
      Hippocrates → Galen as a single continuous tradition reaching into the
      Middle Ages.
    - `InteractiveCollectionExplorer` or `GuidedChoiceCarousel` — explore the
      four humours (element, season, personality trait, star sign for each).
    - `QuickRecallScreen` — retrieval pairing each humour with its Theory of
      Opposites treatment (interaction + retrieval to close the chunk).

- **Section 3 — Learning Chunk 2**
  - Purpose: Develop understanding; introduce new knowledge while revisiting
    earlier learning (interleaving).
  - Proposed content for this episode — **other medieval explanations of
    cause**:
    - Religious/supernatural: God sends disease as punishment for sin or a
      test of faith; the Devil; witchcraft, bad luck, superstition.
    - Astrology: alignment/movement of stars and planets affects health;
      physicians use star charts and zodiac signs in diagnosis; the Church
      was traditionally wary of astrology but increasingly accepted it
      (linking it back to "God controls everything, including the planets").
    - Miasma: bad/poisonous air from swamps, corpses, rotting matter — and
      crucially, **both Hippocrates and Galen wrote about miasma**, so this
      chunk should interleave directly back to Section 2's ancient
      foundations.
  - Suggested component(s):
    - `ExplainReveal` — step-by-step "why did people believe bad air caused
      disease?" cause chain (rotting matter → fumes → miasma → illness),
      explicitly crediting Hippocrates and Galen.
    - `MatchingTask` — match cause (God's punishment / astrology / miasma /
      Four Humours) to its "evidence" as medieval people saw it.
    - `QuickRecallScreen` — retrieval mixing this chunk's new causes with
      Section 2's Four Humours (interleaving).

- **Section 4 — Learning Chunk 3**
  - Purpose: Continue teaching — human experience, case studies, deeper
    explanation, depending on chapter.
  - Proposed content for this episode — **treatment and prevention**:
    - Humoural treatments: bloodletting/phlebotomy (cupping, leeches,
      cutting a vein), purging (emetics/laxatives), Theory of Opposites
      remedies, urine examination (uroscopy — colour/smell/taste).
    - Religious/supernatural treatments: prayer, fasting, paying for Mass,
      pilgrimages to shrines/relics, charms, amulets, incantations.
    - Herbal remedies: drunk/sniffed/bathed in (aloe vera, mint, saffron,
      theriaca); used by wise women and apothecaries.
    - Prevention: Regimen Sanitatis (physician-issued lifestyle advice —
      diet, exercise, bathing; expensive, used mainly by the rich; public
      baths called "stewes"); purifying the air (carrying sweet
      herbs/posies, ringing bells, local government efforts to keep towns
      clean).
    - "Choose your healer" framing: Physician vs Barber Surgeon vs Apothecary
      vs Wise Woman — each tied to a different cause-theory and price point.
  - Suggested component(s):
    - `MedicalTheoryPrescription` — cause → prescription → reveal, directly
      matching the Four Humours/Theory of Opposites/religious-cause →
      treatment logic.
    - `ColSortBlock` — sort treatments (bloodletting, prayer, herbal
      remedies, purifying air) by which cause-theory they target —
      reinforces interleaving with Sections 2–3.
    - `GuidedChoiceCarousel` — "Choose your healer" (Physician / Barber
      Surgeon / Apothecary / Wise Woman), each option showing training,
      cost, and what they'd actually do for you.

- **Section 5 — Learning Chunk 4**
  - Purpose: Complete the chapter's teaching — significance, consequences,
    change and continuity, final understanding.
  - Proposed content for this episode — **medical training, hospitals,
    surgery and public health (the "how much progress?" question)**:
    - Medics: physicians (university-trained 7 years on Hippocrates/Galen, no
      dissection, very expensive, carried a Vademecum), barber surgeons
      (untrained but experienced, cauterisation/bloodletting/trepanning/
      amputation, used "Wound Man" diagrams, cheapest), apothecaries (mixed
      remedies, disliked by physicians partly for giving poison — against
      the Hippocratic Oath), wise women (local, herbal + charms, could train
      as midwives with a bishop's permission, not allowed to be physicians).
    - Hospitals: first English hospital St Bartholomew's, London, 1123; over
      500 in England by 1400; mostly Church/monastery-run or
      endowment-funded; "care not cure"; rejected infectious/terminal
      patients; separate Lazar Houses for leprosy.
    - Surgery in wartime: barber surgeons gained real skill through war
      experience (e.g. John Bradmore treating Prince Henry V's wound); used
      wine as antiseptic, opium/hemlock as anaesthetic, honey on wounds; no
      understanding that dirt spreads infection → most surgical deaths from
      infection/blood loss.
    - Public health: London first city with piped water; 12 rakers clearing
      London's streets by 1370; Edward III's 1352 law banning littering;
      public latrines; Gloucester's lead pipes/aqueduct (rich only); night
      carts emptying cesspits in towns like Hull.
    - "How much change was there in the Middle Ages?" synthesis: little/no
      progress on *cause* (Four Humours/Galen unchallenged, life expectancy
      stayed ~35 throughout); genuine but limited progress on *surgery*
      (wartime-driven) and *some* public health (London/Hull/Gloucester
      initiatives) — government only acted at scale during crises.
  - Suggested component(s):
    - `InteractiveHotspotImage` — a medieval town/hospital scene with
      hotspots for rakers, latrines, piped water, animals in the street,
      Lazar house, etc.
    - `VisualNarrativeScreen` or `KeyFigureReveal` — John Bradmore / surgery
      in wartime as a human-experience case study.
    - `ExplainReveal` — "did medieval Britain make progress?" change vs
      continuity argument, split by cause / treatment / prevention strand.
    - `QuickRecallScreen` / `MatchingTask` — chapter-level retrieval mixing
      medics, hospitals, surgery and public health facts.

- **Section 6 — Summary & Examiner**
  - Purpose: No major new content; focus on application and exam technique;
    show improvement journeys; end with completion screen.
  - Proposed content for this episode — **the named exam-question types
    found in past papers for this strand** (see Section 5 "Exam angles"
    below for full detail):
    - 4-mark "explain one way X was similar/different between [medieval] and
      [modern/another period]" comparisons (e.g. role of the physician vs
      NHS doctor; hospital care c1250–1500 vs c1700–1900; prevention of
      illness medieval vs modern).
    - 12-mark "explain why" causation questions (e.g. "Explain why there was
      a lack of medical progress in the Middle Ages", stimulus: Hippocrates
      and Galen / a respect for tradition).
    - 16/20-mark "how far do you agree" judgement essays with two stimulus
      bullets + SPaG marks, e.g.:
      - "The main reason medical care and treatment was ineffective during
        the medieval period... was because medical knowledge was based on
        Galen's ideas." (stimulus: Theory of Opposites / hospitals)
      - "In the years c1250–c1500, the physician was the most important
        person providing care and treatment." (stimulus: medical training /
        herbal remedies)
      - "The role of the Church was the main reason why there was little
        change in care and treatment in the years c1250–c1500." (stimulus:
        medical training / herbal remedies)
  - Suggested component(s):
    - `ExaminerExplainsScreen` — teaching the "go beyond the stimulus
      points" rule that gates access to the top mark level (Level 4/4 on
      16/20-markers).
    - `FaceTheExaminer` — using one of the three 16/20-mark "how far do you
      agree" questions above, with the Level 1–4 descriptors as marking
      criteria.
    - `ChapterCompleteScreen` — end-of-chapter completion.

### Module Completion Test (reproduced verbatim)

- [ ] Section 1 includes retrieval (PriorKnowledgeRecall)
- [ ] Weak spots are generated
- [ ] Every learning chunk includes interaction
- [ ] Every learning chunk includes retrieval
- [ ] Interleaving exists throughout the module
- [ ] Weak spots are revisited in-module
- [ ] Core chapter message is reinforced
- [ ] Examiner content appears only in Section 6
- [ ] Module ends with a completion screen

## 4. Current state & gap analysis

**Omitted for this file** — per explicit session instruction, no comparison
against `src/modules.js` was performed. See Scope note at the top of this
file.

## 5. Content reference pack

### Dates & timeline

- **c460–370 BC** — Hippocrates (Ancient Greece): creates the Theory of the
  Four Humours.
- **c129–216 AD** — Galen (Ancient Rome): develops Hippocrates' Four Humours
  further; adds the Theory of Opposites; writes 300+ medical books.
- **410–1066** — the "Dark Ages": much knowledge from the Roman Empire is
  lost; most people work in agriculture; few can read.
- **1123** — St Bartholomew's Hospital founded in London — the first
  hospital in England.
- **c1250–c1500** — the Edexcel spec period for this episode (Medieval
  medicine).
- **1352** — Edward III passes a law banning littering in the streets
  (London).
- **By 1370** — 12 "rakers" employed to clear London's streets of waste.
- **By 1400** — over 500 hospitals exist across England.
- **1440** — the printing press is invented — but it has little effect on
  medicine until the Renaissance (a continuity point for this episode).
- **1348–49** — `EXCLUDED — Episode 2` (the Black Death). Used only as the
  chronological end-point of this episode's period.
- Throughout the period: **life expectancy remains around 35 years old** —
  used in sources as evidence that ideas about the cause of disease made
  essentially no progress.

### Key people

- **Hippocrates** — Ancient Greek physician/teacher. Created the **Theory of
  the Four Humours** (blood, phlegm, black bile, yellow bile — illness =
  these out of balance). Diagnostic logic: symptoms reveal which humour is in
  excess (e.g. a nosebleed = too much blood). Also wrote about miasma as a
  cause of disease. The Hippocratic Oath (ethical code for physicians) is
  named after him.
- **Galen** — Ancient Roman physician. Took Hippocrates' Four Humours and
  added the **Theory of Opposites** (an excess humour is treated with a
  remedy of the opposite quality — hot/cold/wet/dry). Wrote over 300 detailed,
  illustrated medical books. His ideas were promoted by the Church (partly
  because he believed in the soul) and became the near-exclusive basis of
  medical training for 1,000+ years — the spec specifically calls out "the
  continuing influence in England of Galen."
- **Roger Bacon** — English scientist; jailed for challenging the Church's
  views on medicine. `UNCERTAIN` — the source gives no date or further detail
  for this; useful as a brief example of how dangerous it was to challenge
  Galen/the Church, but needs verification before being used as an exam fact.
- **John Bradmore** — surgeon who treated Prince Henry V's battle wound
  (arrow injury); cited as an example of medieval surgical skill developing
  through wartime experience.
- **Edward III** (general, non–Black Death role) — passed a 1352 law banning
  littering in London's streets, an example of limited medieval government
  action on public health. (NB: Edward III also appears in Black Death
  sources ordering street-cleaning to "drive away miasma" — that specific
  framing is `EXCLUDED — Episode 2`.)
- `UNCERTAIN` / possible enrichment — one AQA-aligned source (see "Sourcing
  notes" below) describes unnamed Islamic scholars associated with a "House
  of Wisdom" medical library in Baghdad: one is described as stressing close
  patient observation, being first to distinguish measles from smallpox, and
  writing 150+ books (consistent with **al-Razi/Rhazes**); another is
  described as writing an "encyclopaedia of medicine" listing 760 drugs and
  addressing anorexia/obesity (consistent with **Ibn Sina/Avicenna's Canon of
  Medicine**). The PDF extraction lost the actual name labels (likely
  image-based captions). The Edexcel spec's c1250–c1500 strand names only
  Galen — Islamic medicine is not an explicit Edexcel requirement for this
  episode. Flagged as enrichment only; do not let it displace core
  spec content (per CLAUDE.md's exam-first content design rule).

### Key terms & definitions

- **Four Humours** — the theory that the body contains four substances
  (blood, phlegm, black bile, yellow bile) which must stay balanced for
  health; illness = imbalance. Linked to seasons (winter/wet/cold = phlegm)
  and personality (hot-tempered = excess yellow bile) and to star signs.
- **Theory of Opposites** (Galen) — treat an excess humour with a remedy of
  the opposite quality (e.g. too much phlegm [cold/wet] → something hot, like
  pepper; too much blood [hot/wet] → something cool, like cucumber).
- **Miasma** (plural *miasmata*) — bad/poisonous air believed to come from
  swamps, corpses and rotting matter, and to cause disease. Written about by
  both Hippocrates and Galen.
- **Astrology** — the belief that the alignment/movement of stars and
  planets influences health and disease; physicians consulted star charts
  during diagnosis and to time treatments.
- **Regimen Sanitatis** (also seen as "Regimin Sanitis" — spelling varies
  across sources) — physician-issued lifestyle instructions on diet, exercise
  and bathing to stay healthy; expensive, so used mainly by the rich.
- **Stewes** — medieval public baths, available for free.
- **Theriaca** ("theriac") — a common spice-based herbal remedy mixture
  containing many ingredients, used for a wide range of illnesses.
- **Vademecum** — a book of diagnoses carried by physicians.
- **Purging** — making a patient vomit (using emetics) or empty their bowels
  (using laxatives), to remove excess humours; apothecaries sometimes used
  poisons for this.
- **Bloodletting / phlebotomy** — removing blood to rebalance the humours, via
  cupping (warmed cups drawing blood into the cup) or leeches.
- **Cauterisation** — burning a wound with a hot iron; stops bleeding (though
  surgeons did not understand *why* it worked).
- **Trepanning** — drilling a hole in the skull, originally to "release
  demons" believed to cause mental illness; also used in some genuine
  surgical contexts.
- **Uroscopy / urine charts** — examining a patient's urine (colour, smell,
  taste) to diagnose which humour was out of balance.
- **Wound Man** — an illustration used by surgeons showing how to treat
  different types of wound.
- **Hippocratic Oath** — ethical code for physicians; apothecaries giving
  poison (for purging) were seen by physicians as violating its spirit.
- **Lazar House** — a separate hospital for people with leprosy, run by the
  Church.
- **Endowment** — money left in a wealthy person's will to fund a hospital.
- **Tithe** — a tax-like payment everyone made to the Church.
- **Incantations** — spells/charms used as a supernatural treatment.
- **Rakers** — workers employed by towns (e.g. 12 in London by 1370) to clear
  streets of waste/litter.

### Case studies / named examples

- **"Choose your healer"** — the four medical options available in medieval
  England, each tied to a different cause-theory and price point:
  - *Physician* — university-trained for 7 years on Hippocrates/Galen, no
    dissection so limited real anatomical knowledge; diagnosed via pulse,
    urine charts and astrology; carried a Vademecum; very expensive (only
    ~100 male physicians in England); did not treat patients directly —
    referred to surgeons/apothecaries.
  - *Barber Surgeon* — untrained but experienced (skills > book-knowledge);
    performed cauterisation, bloodletting, trepanning, tooth-pulling, boil-
    lancing, amputations; used a "Wound Man" diagram; no anaesthetic or
    antiseptic, so low surgical success rate; the cheapest surgical option.
  - *Apothecary* — like a pharmacist; mixed herbal remedies from ingredients
    they understood well; disliked by physicians (cheaper competition, and
    sometimes supplied poisons for purging); cheaper than a physician.
  - *Wise Woman* — a local woman (sometimes "Lady of the Manor") with
    practical experience; used herbal remedies and charms/spells; often
    helped with childbirth and could train as a midwife with a bishop's
    permission; cheap; not allowed to become physicians.
- **St Bartholomew's Hospital (1123, London)** — England's first hospital.
  By 1400, over 500 hospitals existed nationally. Most were run by the Church
  in monasteries or funded by wealthy endowments. Focus was "care not cure" —
  food, warmth, prayer; infectious/terminal patients were generally turned
  away. Separate Lazar Houses existed for leprosy sufferers.
- **Surgery in wartime** — medieval surgeons (especially barber surgeons)
  gained real expertise through the "constant warfare" of the period —
  e.g. John Bradmore saving Prince Henry V. They could remove arrowheads, do
  amputations, treat cataracts, and even trepan skulls; used wine as an
  antiseptic and opium/hemlock as anaesthetics, honey to clean wounds. But
  with no germ theory, instruments/environments stayed filthy — most deaths
  from surgery came from resulting infection or blood loss, not the original
  injury.
- **London/Hull/Gloucester public health measures** — London became the
  first English city with piped water; 12 rakers cleared London's streets of
  waste by 1370; Edward III's 1352 law banned littering; public latrines were
  built in London (butchers had to remove waste from towns); Gloucester used
  lead pipes and an aqueduct to bring in fresh water (rich only); Hull used
  "night carts" to empty cesspits; Newcastle paved its streets for easier
  cleaning.
- **Monastery public health (AQA-aligned source — possible enrichment)** —
  monks bathed monthly and had a feet-washing ceremony twice weekly; rivers
  were redirected to monasteries with filtering pipes for clean water; monks
  grew their own vegetables on strict diets; monasteries were physically
  distant from towns (less infection exposure); monks had infirmaries, were
  trained in herbal remedies, had access to medical books, and had plenty of
  toilets so didn't need to share. Useful as a "did public health get *worse*
  everywhere?" counterpoint to the town-based problems above — but flagged as
  possibly AQA-sourced rather than core Edexcel content (see Sourcing notes).

### Causes & effects

- Church controls all education and books → Galen's ideas (which fit Church
  belief in the soul) are the *only* ideas widely taught → physicians trained
  exclusively on Hippocrates/Galen → Four Humours/Theory of Opposites go
  unchallenged for 1,000+ years.
- Church bans/restricts dissection (bodies must stay whole for the soul to
  reach heaven) → no anatomical evidence can contradict Galen → any
  dissection findings that *did* contradict Galen (from occasional dissection
  of criminals) were explained away as "an imperfect body."
- Church teaches disease = punishment for sin / test of faith from the Devil
  → religious treatments prioritised (prayer, fasting, paying for Mass,
  pilgrimage) → little motivation to search for "real" causes.
- Low literacy among ordinary people → a "well-read" physician (not an
  experienced one) is considered the best kind → respect for ancient written
  authority (Hippocrates/Galen) over hands-on experimentation.
- Printing press invented (1440) → potential to spread new ideas faster, BUT
  → little impact felt within this period — impact only arrives in the
  Renaissance (a "trap" continuity point for "how far do you agree" essays).
- Belief in miasma → prevention behaviours: carrying sweet herbs/posies,
  ringing bells to keep air moving, bathing, local government attempts to
  keep towns clean of rotting matter.
- Belief in astrology → physicians consult star charts/zodiac signs both to
  diagnose illness and to time treatments/operations.
- Humoural diagnosis (urine colour/smell/taste, pulse) → matched to either a
  Theory-of-Opposites remedy or a bloodletting/purging treatment to remove
  the excess humour.
- Frequent warfare in medieval Britain → barber surgeons gain real practical
  experience → genuine (if limited) surgical progress (cataract removal,
  trepanning, wound treatment, amputation) despite zero anatomical knowledge.
- No understanding that dirt/germs cause infection → unsterile surgical
  tools/environments → high death rate from infection and blood loss after
  surgery, even when the surgery itself "worked."
- Wealth → access to Regimen Sanitatis, physicians, private water supplies
  (e.g. Gloucester's lead pipes) → a real health inequality between rich and
  poor that persists as a recurring "attitudes in society" theme.
- Government focused on defence/keeping the peace, not interested in public
  health in normal times → only acts on public health at scale during crises
  (the Black Death — `EXCLUDED — Episode 2`, but the *pattern* — government
  inaction except in crisis — is established here).
- Hospitals run by Church/monasteries, funded by endowments → mission is
  "care not cure" / hospitality for the deserving poor, elderly and
  travellers → infectious or terminal patients are turned away because
  "nothing can be done" (consistent with the religious framing of illness).

### Exam angles

**Question types seen in past papers for this strand (Option 11, Section B):**

- **4-mark "explain one way X was similar/different between [period A] and
  [period B]"** — comparison questions, 2 marks AO1 / 2 marks AO2, Level 1
  (1–2, generalised) / Level 2 (3–4, specific supporting detail showing good
  knowledge of *both* periods). Seen variants directly relevant to this
  episode:
  - "Explain one way in which the role of the physician in the medieval
    period was similar to the role of the doctor in the NHS in the modern
    period." (Nov 2020) — model answer compares diagnosis (urine examination
    vs symptoms/technology) and prescribing (bleeding/apothecary-mixed
    medicine vs pharmacist-dispensed medicine/hospital referral).
  - "Explain one way in which care in hospitals in the years c1250–c1500 was
    different from care in hospitals in the years c1700–c1900." (2018) —
    model answer contrasts untrained monks/nuns vs trained
    doctors/Nightingale-trained nurses, and "care for minor illness via
    herbal remedies" vs "treat a wider range of illness including surgery."
  - "Explain one way in which ideas about prevention of illness in the
    medieval period were similar to ideas about the prevention of illness in
    the modern period." (June 2023) — model answer compares "keeping humours
    balanced" to modern healthy-living campaigns (e.g. 5-a-day), and
    isolating lepers to modern isolation of infectious patients (TB, Covid).
- **12-mark "explain why" causation questions** — e.g. "Explain why there was
  a lack of medical progress in the Middle Ages. You may use: Hippocrates and
  Galen / a respect for tradition. You must also use your own information."
  (from the mrthorntonteach revision guide's practice question set).
- **16/20-mark "how far do you agree" judgement essays** with two stimulus
  bullet points + up to 4 SPaG marks (AO2: 10, AO1: 6, SPaG: 4 where present).
  Three variants of this question have appeared targeting this exact strand:
  1. *"The main reason why medical care and treatment was ineffective during
     the medieval period, c1250–c1500, was because medical knowledge was
     based on Galen's ideas." How far do you agree?* — stimulus: Theory of
     Opposites / hospitals.
     - **For**: remedies based on Theory of Opposites treated symptoms not
       causes; Galen's Four Humours led to ineffective bleeding/purging;
       medical training based on Galen discouraged any challenge to his
       ideas.
     - **Against**: hospitals were ineffective for reasons unrelated to Galen
       (religious focus on care not cure, untrained staff); miasma/religious
       treatments were *also* ineffective and not Galen's fault; most
       treatment happened at home via herbal remedies (sometimes effective
       for minor illness, regardless of Galen); some remedies used unsuitable
       ingredients (theriac, powdered pearls) independent of Galen.
  2. *"In the years c1250–c1500, the physician was the most important person
     providing care and treatment." How far do you agree?* — stimulus:
     medical training / herbal remedies.
     - **For**: physicians were the only formally-trained medics, directed
       treatment given by surgeons/apothecaries (i.e. they controlled the
       system).
     - **Against**: Galen-based training meant their treatment was often not
       effective; most ordinary people were treated at home by women using
       herbal remedies; cost meant physicians were inaccessible to most
       people; apothecaries sold ready-mixed medicine directly to those who
       couldn't afford a physician — arguably *more* important for most
       people; monks/nuns ran an increasing number of hospitals.
  3. *"The role of the Church was the main reason why there was little change
     in care and treatment in the years c1250–c1500." How far do you agree?*
     — stimulus: medical training / herbal remedies.
     - **For**: Church controlled medical training (kept it Galen-based);
       physician treatment therefore stayed rooted in bleeding/purging/Theory
       of Opposites; Church taught illness was God-sent, discouraging the
       search for real causes; Church hospitals focused on care not cure.
     - **Against**: most people's treatment (women using herbal/folk
       remedies) had no link to the Church at all; some herbal remedies
       genuinely worked for minor illness; technology simply wasn't advanced
       enough yet for progress regardless of the Church; apothecaries'
       remedies were downstream of physician ideas, not directly Church
       output.
  - **Generic Level descriptors for these 16/20-mark questions** (consistent
    across all sampled mark schemes):
    - Level 1 (1–4): simple/generalised, lacks development; judgement
      missing or asserted.
    - Level 2 (5–8): limited analysis, some development but reasoning not
      sustained; judgement given but insecure. **Capped at 7/16 (or
      equivalent) if the answer does not go beyond the stimulus bullet
      points.**
    - Level 3 (9–12): some analysis mainly on the question's focus, generally
      sustained reasoning; judgement justified but some criteria implicit.
      **Capped at 11/16 if the answer does not go beyond the stimulus
      points.**
    - Level 4 (13–16): consistent, coherent, sustained analytical reasoning;
      wide-ranging precisely-selected knowledge; judgement fully justified.
      **No access to Level 4 without going beyond the stimulus points** — own
      additional knowledge is mandatory for top marks.
  - **SPaG marks** (where present, 4 extra marks): Threshold (1) / Intermediate
    (2–3) / High (4), based on accuracy of spelling/punctuation/grammar and
    range of specialist terminology used.

**A worked model-answer structure** (from the mrthorntonteach guide, for "How
much change was there in the Middle Ages?" / "There was no progress in
medicine during the Medieval Period (1250–1500). How far do you agree?",
stimulus: Medieval Surgery / The Four Humours) — useful as a `FaceTheExaminer`
or `GuidedAnswerCoach` exemplar:

- *No progress (cause)*: Church-taught religious explanation of disease
  unchallenged; Four Humours unchanged for 1,000+ years; Hippocrates/Galen
  "failed to clearly identify the cause of disease" and were never
  challenged.
- *Some progress (treatment/surgery)*: hospitals grew in number (1123 →
  500+ by 1400, though "care not cure"); surgery improved via wartime barber
  surgeons (cataract removal, basic anaesthetic/antiseptic — opium, honey);
  herbal remedies (e.g. mint, used by wise women) sometimes worked.
- *No progress (treatment, continued)*: hospitals still banned infectious
  patients and relied on God; ~50% of surgical patients died from infection
  (no equipment cleaning, no anatomy knowledge beyond "Wound Man");
  bleeding/leeching/purging "often made patients worse."
- *Some progress (prevention)*: London rakers (12 by 1370), Hull aqueducts,
  Edward III's 1352 littering law, Regimen Sanitatis (common-sense diet and
  exercise advice for the rich).
- *No progress (prevention, continued)*: towns remained filthy (a key reason
  the Black Death spread so fast); government only acted during the Black
  Death; amulets/charms/sweet herbs "didn't" actually prevent disease.
- *Exam-tip framing for Level 4*: balance the argument explicitly within a
  paragraph — "Historians would agree that there was little progress in the
  Middle Ages, for example in Public Health as... However, you could argue
  that there was some partial progress in Public Health as..."

**Misconceptions worth a `MisconceptionCheck`** (each precise enough to
write a true/false statement from):

- "Hippocrates invented the Theory of Opposites." → **False** — Hippocrates
  created the Theory of the Four Humours; Galen developed the Theory of
  Opposites.
- "Medieval people believed illness was caused *only* by religion." →
  **False** — religious/supernatural AND "rational" explanations (Four
  Humours, miasma, astrology) coexisted and were often presented as mutually
  reinforcing (e.g. astrology = God controlling the planets).
- "Bloodletting and purging were known to be useless even at the time." →
  **False** — medieval people believed these treatments were logical and
  showed visible "evidence" of working (e.g. sneezing = the body expelling
  excess phlegm). They were not viewed as failures by contemporaries — this
  matters for "explain why X was believed" questions.
- "Medieval hospitals existed to cure the sick." → **False** — the focus was
  "care not cure"; many also explicitly rejected infectious or terminal
  patients.
- "Only poor people used herbal remedies; only rich people saw physicians." →
  **Needs nuance** — most people of *all* classes were primarily treated at
  home by women using herbal remedies; physicians were the single most
  expensive option (used mainly by the rich); apothecaries and wise women
  were cheaper alternatives available to more people.
- "There was zero medical progress anywhere in the Middle Ages." → **Needs
  nuance** — ideas about the *cause* of disease showed essentially no
  progress (continuity dominates: life expectancy stayed ~35 throughout), but
  *surgery* (wartime-driven) and *some* public health measures (London,
  Hull, Gloucester) showed limited genuine progress. Strong answers must
  separate the cause / treatment / prevention strands rather than treating
  "medicine" as one undifferentiated thing.
- "The printing press (1440) transformed medieval medicine." → **False for
  this period** — invented within the period but had no major effect until
  the Renaissance; a deliberate "trap" continuity point.
- "The Church rejected astrology as unscientific." → **Needs nuance** — the
  Church was traditionally wary of astrology but became more accepting of it
  over time, partly because God was believed to control the stars and planets
  too, making astrology "an extension of God's will."

### Sourcing notes

- Primary sources used (all extracted via `pdftotext -layout` to
  `/tmp/canonical-topic/`):
  - `gcse91historyspecification.txt` — Edexcel GCSE (9-1) History
    specification, Issue 6, June 2024 (official spec wording for Section 2).
  - `Paper1MedicinethroughTimeRevisionGuide1_1.txt` — Edexcel-aligned revision
    guide (mrthorntonteach), the richest source for medieval-specific content
    and exam-practice question framing.
  - `paper_1_medicine_through_time_revision_book.txt` — a second
    Edexcel-aligned revision book; Theme 1 ("Medicine in the Middle Ages,
    c1250–1500") closely mirrors the spec strands and was the source for most
    of the Key terms/definitions above, plus the Black Death case study
    (excluded).
  - `Medicine_Through_Time_Essay_Plans_and_Template.txt` — essay-plan exemplar
    for the "Galen's ideas made medical care ineffective" 20-mark question
    (For/Against/Conclusion structure), reused in the Exam angles section.
  - `gcsepaper2revisionguide2018part12.txt` — an **AQA-aligned** revision
    guide. Most content overlaps with the Edexcel strands (Four
    Humours/Galen, bloodletting/purging, physicians/wise
    women/hospitals/Lazar Houses, public health problems). The Islamic
    medicine content (House of Wisdom, unnamed scholars) and the detailed
    monastery-hygiene content do not map onto named Edexcel spec bullet
    points for this strand — flagged as enrichment/possible cross-board
    content rather than core requirements.
  - Past papers (`past-papers/*.txt`, Edexcel Option 11, series 2018–2023) —
    source for all exam-angle question text and mark-scheme indicative
    content above.
- `Renaissance_Medicine_Section_of_Textbook.pdf` produced **0 lines** of text
  on extraction (likely a scanned PDF with no text layer — would need OCR).
  Not used; out of scope for this episode anyway (Renaissance = Episode 3+).

## 6. Build recommendations

Numbered, prioritized. Each links to the "five agents of change" (War,
Religion, Individuals, Government, Science & technology) and to interleaving
opportunities with later episodes, per the Interleaving Rule.

1. **Establish Hippocrates → Galen as the episode's spine (Section 2).**
   Agent: **Individuals**. Every later concept in this episode (and in
   Episodes 2–3) traces back to these two names — get the
   Four-Humours/Theory-of-Opposites pairing rock-solid with retrieval before
   moving on. Interleaving: Episode 2 (Black Death) explicitly reuses Four
   Humours/miasma/astrology per the architecture doc's own
   `PriorKnowledgeRecall` example; Episode 3 (Renaissance) is built around
   *challenges* to Galen (Sydenham, Vesalius) — so the stronger this
   foundation, the more "change vs continuity" payoff in Episode 3.
2. **Use Religion as the connective thread across Sections 2–5, not a single
   isolated screen.** Agent: **Religion**. The Church appears as the cause of
   *why* Galen dominated (Section 2), as a cause of disease itself (Section
   3), as a source of treatments AND of hospitals (Sections 4–5), and as the
   central pillar of the "how far do you agree" exam questions (Section 6).
   Build it as a recurring thread that gets revisited with new evidence each
   time, not a one-off "the Church was powerful" screen — directly serves the
   "Do not introduce a concept once and then abandon it" Interleaving Rule.
3. **"Choose your healer" as the Section 4 interaction.** Agent: **Individuals
   / Government** (training and regulation differences between physician,
   barber surgeon, apothecary, wise woman). A `GuidedChoiceCarousel` here
   gives the learner an active decision tied directly to cost/training/cause-
   theory — strong candidate for "one screen = one job."
4. **Surgery-in-wartime as the human-experience beat of Section 5.** Agent:
   **War**. John Bradmore/Prince Henry V gives a concrete, narrative-friendly
   example of real (if limited) progress — useful counterweight to the
   "everything was hopeless" framing elsewhere, and sets up "how much change?"
   essay nuance for Section 6.
5. **Public health as the Section 5 "some progress" counterpoint.** Agent:
   **Government / Science & technology** (the latter largely *absent* here —
   useful to make explicit that science/technology contributes almost nothing
   in this period, which is itself an exam point). London/Hull/Gloucester
   examples give concrete, locatable facts for the 4-mark comparison
   questions.
6. **Build Section 6 around the three identified 16/20-mark "how far do you
   agree" questions**, using the worked model-answer structure in Section 5
   as `GuidedAnswerCoach`/`FaceTheExaminer` content. All three questions
   double as final retrieval of this episode's core content (Galen,
   physician's role, the Church) — directly satisfies "reinforce the
   chapter's core message" for Section 5/6 and "Examiner content appears only
   in Section 6."
7. **Flag for a future Episode 2 build session**: the
   `PriorKnowledgeRecall` concept tags for Episode 2 (Black Death) should be
   exactly: Church power, Four Humours, God and illness, Miasma, Astrology —
   all of which this episode (Episode 1) is responsible for teaching to
   "secure" level first.
