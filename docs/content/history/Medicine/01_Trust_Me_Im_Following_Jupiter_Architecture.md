# Episode 1: Trust Me, I'm Following Jupiter — Architecture

## Scope note (read first)

This file is the **build/architecture mapping** for Episode 1, produced as a
scale-test of the `canonical-topic` skill's extraction pipeline (PDF →
`pdftotext` → keyword search → targeted read). All facts, narrative and exam
material live in the companion content file
`01_Trust_Me_Im_Following_Jupiter_Content.md` in this directory — read that
file first.

- **No comparison against `src/modules.js` was performed.** The "Current
  state & gap analysis" section (Section 3 below) is **omitted entirely** —
  this file does not assess what is or isn't already built.

## 1. Identity (brief)

- **Episode number:** 1
- **Title (series map):** Trust Me, I'm Following Jupiter
- **Build status:** Not assessed in this file (see Scope note above)
- Content, Storyline, Specification requirements and the full Content
  reference pack: see `01_Trust_Me_Im_Following_Jupiter_Content.md` in this
  directory.

## 2. Architecture checklist (tailored)

Per `docs/system/HISTORY_MODULE_ARCHITECTURE.md` (LOCKED). This section maps
the content in the content file's Section 4 (Content reference pack) onto the
fixed Section 1–6 structure. It is a **content-placement proposal only** — it
does not assess what currently exists.

- **Section 1 — Intro, Recall & Roadmap**
  - Purpose: Create curiosity; reactivate previous chapter knowledge;
    identify missing knowledge; generate weak spots; preview the chapter.
  - Proposed content for this episode:
    - As the **first** Medicine Through Time episode, `PriorKnowledgeRecall`
      cannot recall a previous *chapter* in this series — instead it should
      recall general KS3/background knowledge: the power of the medieval
      Church over everyday life, the idea of the "Dark Ages" (c410–1066)
      losing Roman knowledge, low literacy.
    - True/False hook candidates drawn from the content file's Section 4:
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
    found in past papers for this strand** (see the content file's Section 4
    "Exam angles" for full detail):
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

## 3. Current state & gap analysis

**Omitted for this file** — per explicit session instruction, no comparison
against `src/modules.js` was performed. See Scope note at the top of this
file.

## 4. Build recommendations

Numbered, prioritized. Each links to the "five agents of change" (War,
Religion, Individuals, Government, Science & technology) and to interleaving
opportunities with later episodes, per the Interleaving Rule.

1. **Storyline integration.** The content file's Section 2 Core takeaway —
   "People weren't stupid. Their ideas were logical based on the knowledge
   they had. The biggest reason medicine changed so slowly was that powerful
   institutions and respect for authority stopped old ideas being
   challenged." — should be threaded through the module as a recurring
   interleaving thread, not taught once and dropped:
   - Section 2 (Hippocrates/Galen): introduce the Four Humours/Theory of
     Opposites as *internally consistent and evidence-based for their time*
     — not as "wrong ideas medieval people believed because they were
     unsophisticated." This plants half of the Core takeaway ("their ideas
     were logical") immediately.
   - Section 3 (other causes): show astrology and miasma as further logical
     extensions of available evidence/worldview (sneeze = body fixing
     itself; smell = disease cause), reinforcing "people weren't stupid"
     with a second, independent example before moving on.
   - Sections 4–5 (treatment, medics, hospitals, public health): each new
     piece of evidence should explicitly revisit the second half of the
     takeaway — "why wasn't this challenged?" — via the Church's control of
     education, the dissection ban, and low literacy, so the "institutions/
     respect for authority blocked challenge" argument accumulates evidence
     across the whole module rather than appearing only once.
   - Section 6 (examiner): explicitly teach the Core takeaway as the model
     judgement for all three identified 16/20-mark essays (content file
     Section 2, "Exam framing"). The Level 4 differentiator for each is
     making *both* halves of the takeaway explicit — weaker answers make
     only one half (either "ideas were logical" OR "the Church blocked
     change," rarely both, and rarely the causal link between them).
   - This directly satisfies the Module Completion Test's "Core chapter
     message is reinforced" and "Interleaving exists throughout the module"
     points.
2. **Establish Hippocrates → Galen as the episode's spine (Section 2).**
   Agent: **Individuals**. Every later concept in this episode (and in
   Episodes 2–3) traces back to these two names — get the
   Four-Humours/Theory-of-Opposites pairing rock-solid with retrieval before
   moving on. Interleaving: Episode 2 (Black Death) explicitly reuses Four
   Humours/miasma/astrology per the architecture doc's own
   `PriorKnowledgeRecall` example; Episode 3 (Renaissance) is built around
   *challenges* to Galen (Sydenham, Vesalius) — so the stronger this
   foundation, the more "change vs continuity" payoff in Episode 3.
3. **Use Religion as the connective thread across Sections 2–5, not a single
   isolated screen.** Agent: **Religion**. The Church appears as the cause of
   *why* Galen dominated (Section 2), as a cause of disease itself (Section
   3), as a source of treatments AND of hospitals (Sections 4–5), and as the
   central pillar of the "how far do you agree" exam questions (Section 6).
   Build it as a recurring thread that gets revisited with new evidence each
   time, not a one-off "the Church was powerful" screen — directly serves the
   "Do not introduce a concept once and then abandon it" Interleaving Rule,
   and is the architectural backbone for recommendation 1's "institutions
   blocked challenge" half of the Core takeaway.
4. **"Choose your healer" as the Section 4 interaction.** Agent: **Individuals
   / Government** (training and regulation differences between physician,
   barber surgeon, apothecary, wise woman). A `GuidedChoiceCarousel` here
   gives the learner an active decision tied directly to cost/training/cause-
   theory — strong candidate for "one screen = one job."
5. **Surgery-in-wartime as the human-experience beat of Section 5.** Agent:
   **War**. John Bradmore/Prince Henry V gives a concrete, narrative-friendly
   example of real (if limited) progress — useful counterweight to the
   "everything was hopeless" framing elsewhere, and sets up "how much change?"
   essay nuance for Section 6.
6. **Public health as the Section 5 "some progress" counterpoint.** Agent:
   **Government / Science & technology** (the latter largely *absent* here —
   useful to make explicit that science/technology contributes almost nothing
   in this period, which is itself an exam point). London/Hull/Gloucester
   examples give concrete, locatable facts for the 4-mark comparison
   questions.
7. **Build Section 6 around the three identified 16/20-mark "how far do you
   agree" questions**, using the worked model-answer structure in the content
   file's Section 4 as `GuidedAnswerCoach`/`FaceTheExaminer` content. All
   three questions double as final retrieval of this episode's core content
   (Galen, physician's role, the Church) — directly satisfies "reinforce the
   chapter's core message" for Sections 5/6 and "Examiner content appears
   only in Section 6."
8. **Flag for a future Episode 2 build session**: the
   `PriorKnowledgeRecall` concept tags for Episode 2 (Black Death) should be
   exactly: Church power, Four Humours, God and illness, Miasma, Astrology —
   all of which this episode (Episode 1) is responsible for teaching to
   "secure" level first.
