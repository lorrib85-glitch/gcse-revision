# Episode 2: The Day Everything Changed — Architecture

## Scope note (read first)

This file is the **build/architecture mapping** for Episode 2. All facts,
storyline, specification requirements and the content reference pack live in
the companion file `02_The_Day_Everything_Changed_Content.md` in this
directory — read that file first for *what* this episode teaches.

Unlike Episode 1 (status: Not yet built, so its architecture file's "Current
state & gap analysis" was omitted entirely), **Episode 2 is "Built and
aligned"** — module `history-medicine-black-death`, `src/modules.js:1348–2325`,
26 screens. Section 3 below is therefore a **full screen-by-screen inventory
of the existing module**, not a placeholder, and Section 4's recommendations
are about *refining* a built module rather than building one from scratch.

## 1. Identity (brief)

- **Episode number:** 2
- **Title (series map):** The Day Everything Changed
- **Build status:** Built as `history-medicine-black-death`
  (`src/modules.js:1348`) — not shared with any other episode.
- Content, Storyline, Specification requirements and the full Content
  reference pack: see `02_The_Day_Everything_Changed_Content.md` in this
  directory.

## 2. Architecture checklist (tailored)

Per `docs/system/HISTORY_MODULE_ARCHITECTURE.md` (LOCKED). The six `stage`
groupings used inside the built module map cleanly onto the locked Section
1–6 structure:

| Built module `stage` | Locked architecture section |
|---|---|
| *(intro screens, no stage)* | Section 1 — Intro, Recall & Roadmap |
| "The arrival" | Section 2 — Learning Chunk 1 |
| "Medieval explanations" | Section 3 — Learning Chunk 2 |
| "Treatments and prevention" | Section 4 — Learning Chunk 3 |
| "Life during the plague" + "The aftermath" | Section 5 — Learning Chunk 4 |
| "Exam prep" | Section 6 — Summary & Examiner |

- **Section 1 — Intro, Recall & Roadmap**
  - Purpose: Create curiosity; reactivate previous chapter knowledge;
    identify missing knowledge; generate weak spots; preview the chapter.
  - Proposed content for this episode: per Episode 1's own Build
    recommendation #8, this episode's `PriorKnowledgeRecall` should test
    exactly **Church power, Four Humours, God and illness, Miasma,
    Astrology** — the concepts Episode 1 is responsible for teaching to
    "secure" level first.
  - Suggested component(s): `PriorKnowledgeRecall` (recall of Episode 1's
    concepts); `ChapterHookScreen`/cinematic (curiosity-generating "something
    is coming" opener).

- **Section 2 — Learning Chunk 1 ("The arrival")**
  - Purpose: Introduce the first major part of the topic.
  - Proposed content for this episode: the Black Death's arrival in England
    (Melcombe, June 1348), its origin and spread via trade routes, and the
    scale/symptoms of the disease itself.
  - Suggested component(s): `InteractiveHotspotImage` (explore a scene before
    being told what it means); `ExplainReveal` (step-by-step transmission
    chain); `VisualLearning` (origin/spread narrative, scale of disaster);
    `SymptomProgression` (day-by-day bubonic plague progression).

- **Section 3 — Learning Chunk 2 ("Medieval explanations")**
  - Purpose: Develop understanding; introduce new knowledge while revisiting
    earlier learning (interleaving).
  - Proposed content for this episode: the three medieval explanations for
    the Black Death (God's punishment, miasma, planetary alignment) — each of
    which is a direct reuse of an Episode 1 concept — followed by the actual
    cause.
  - Suggested component(s): `GuidedChoiceCarousel` (in-character "what would
    you believe?" decision); `VisualLearning` (recap/reveal); `MatchingTask`
    (belief → response); retrieval via `QuickRecallScreen`.

- **Section 4 — Learning Chunk 3 ("Treatments and prevention")**
  - Purpose: Continue teaching — human experience, case studies, deeper
    explanation.
  - Proposed content for this episode: medieval treatments and prevention
    attempts during the Black Death, and the belief each one was rooted in —
    directly serving the Strand 3 spec phrase "approaches to treatment and
    attempts to prevent its spread."
  - Suggested component(s): `InteractiveCollectionExplorer` (tap-to-reveal
    treatments + synthesis); `MatchingTask` (treatment → belief).

- **Section 5 — Learning Chunk 4 ("Life during the plague" + "The aftermath")**
  - Purpose: Complete the chapter's teaching — significance, consequences,
    change and continuity, final understanding.
  - Proposed content for this episode: the human experience of the plague
    (a village in 1349, rich vs poor), and its aftermath — labour shortage,
    weakened Church authority, the road to the Peasants' Revolt — culminating
    in the "society changed, medicine didn't" continuity argument.
  - Suggested component(s): `VisualNarrativeScreen` (village case study);
    `VisualLearning` (rich/poor, aftermath changes); `ExplainReveal` (causal
    chain of consequences); `SwipeSort`/`naturalSupernaturalSwipe` (changed vs
    stayed the same); `QuickRecallScreen` (aftermath retrieval).

- **Section 6 — Summary & Examiner**
  - Purpose: No major new content; focus on application and exam technique;
    show improvement journeys; end with completion screen.
  - Proposed content for this episode: the two Black-Death-specific exam
    questions identified in the Content file (4-mark "describe two ways it
    spread"; 4-mark "explain one way religious beliefs affected responses"),
    plus a recap of the whole chapter's story.
  - Suggested component(s): `VisualLearning` (recap); `ExaminerExplainsScreen`
    (exam technique tips); `FaceTheExaminer` (mark a sample answer);
    `GuidedExamResponse` (scaffolded own answer); `ChapterCompleteScreen`.

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

(Status against each point is assessed screen-by-screen in Section 3 below.)

## 3. Current state & gap analysis

Full screen-by-screen inventory of `history-medicine-black-death`
(`src/modules.js:1348–2325`, 26 screens), grouped by the Section 1–6 mapping
above. Each entry: screen type / id / label, the specific facts/concepts it
teaches, and its Section 1–6 slot.

### Section 1 — Intro, Recall & Roadmap

1. **`priorKnowledgeRecall`** — "Medieval medicine: beliefs and causes of
   disease" (`recallPrompts`: People, Theories, Causes, Treatments, Church).
   Tests 11 concepts: Hippocrates, Four Humours, Galen, Theory of Opposites,
   Miasma theory, God and sin, Astrology and the zodiac man, Bloodletting,
   Church's role in medicine, Supernatural vs natural causes, Why medieval
   ideas survived so long.
   - **Exactly matches** Episode 1's own Build recommendation #8 (Church
     power, Four Humours, God and illness, Miasma, Astrology) — plus extends
     it to cover Hippocrates/Galen/Theory of Opposites/bloodletting/"why
     ideas survived," all of which Episode 1 is also responsible for. ✅
2. **`cinematic`** — "The arrival" stage intro. Year 1348, headline "Something
   is coming," scene-setting: ships dock at Melcombe in Dorset, people begin
   to die, disease moves fast through towns/villages/monasteries, "no one
   knew what it was."
   - Pure curiosity-generation, no retrieval — appropriate for a
     `ChapterHookScreen`-style opener. ✅

**Module Completion Test — Section 1 includes retrieval (PriorKnowledgeRecall)**:
✅ satisfied (screen 1).

### Section 2 — Learning Chunk 1 ("The arrival")

3. **`interactiveImage`** (`id: 'plague-dock-hotspot'`) — "The dock at
   Melcombe." Five hotspots: the ship (Mediterranean trade routes already
   infected), the crew (sailors already symptomatic, Geoffrey le Baker
   quote), the dock (Melcombe Regis, June 1348 — first landing point), the
   cargo (miasma misconception re: "bad air" from goods), the rat ("everywhere
   but unnoticed").
4. **`explainReveal`** (custom block, no top-level `type`) — "How the plague
   actually spread" / kicker "The hidden chain." Four-step transmission chain:
   trading ships → rats carrying infected fleas → fleas bite humans after rat
   hosts die → person-to-person spread. `reflectionPrompt` states the chain
   explicitly: "ship → rat → flea → person."
   - **This is the screen whose redundancy/value was the original question
     motivating this canonical file** — see GAPS below.
5. **`visualLearning`** — "Where did it come from?" Four scenes: origin in
   central Asia (late 1330s), trade routes carrying death to Sicily/southern
   Europe (1347), arrival in England (1348, reached London by autumn 1348,
   swept the country by 1350), scale reveal (25 million dead across Europe,
   "every third person you know").
   - **Overlaps with screen 4** — both teach the trade-route/rat
     transmission story, in different formats (explainReveal step-chain vs.
     visualLearning slideshow). See GAPS below.
6. **`visualLearning`** — "The scale of the disaster." Four scenes: 1/3–1/2 of
   England's population died, plague pits for mass burial, the three plague
   types (bubonic/pneumonic/septicaemic) with their mechanisms, "the symptoms
   were unmistakeable" (egg-sized swellings, fever, blackened skin, death
   within days).
7. **`progressionTimeline`** (`SymptomProgression`) — "How the plague killed."
   Five day-staged symptoms: Day 1–2 flea bite → Day 3–5 buboes form → Day
   5–7 high fever → Day 7–10 black patches → Day 10+ death or survival.

**Module Completion Test — "Every learning chunk includes retrieval"**: ⚠️
**Section 2 has no `quickRecall` or `matchingTask`** — its five screens are
1 interaction (hotspot explore) + 1 reveal-chain (explainReveal) + 3 passive
slideshow/timeline screens (2× visualLearning + progressionTimeline). This is
the chunk with the *least* active retrieval relative to its length. See GAPS
below.

### Section 3 — Learning Chunk 2 ("Medieval explanations")

8. **`guidedChoiceCarousel`** (`id: 'plague-belief-carousel'`) — "What would
   you believe?" In-character framing: "Agnes has the plague. Her village is
   terrified." Three options, each interleaving an Episode 1 concept: God's
   punishment (logic/who believed/belief→response), Miasma (same structure),
   Planetary alignment (cites the Paris Medical Faculty's 1345 triple
   conjunction). Each option has a `revealLines` sequence.
   - **Strong interleaving** — directly reuses Episode 1's God-and-sin,
     miasma and astrology concepts in a fresh narrative frame. ✅
9. **`visualLearning`** (`id: 'plague-beliefs-reveal'`) — "What medieval
   people believed." Five scenes recapping the same three explanations (God's
   punishment → flagellants; miasma → posies/herbs; planetary alignment →
   Paris Medical Faculty 1345), then a `finalReveal`: "All three explanations
   were wrong... the actual cause would not be discovered for another 500
   years."
   - **Near-duplicate of screen 8's content** — screen 8 already delivers all
     three explanations interactively (carousel + revealLines); screen 9
     re-delivers the same three explanations passively immediately afterward.
     See GAPS below.
10. **`matchingTask`** — "Beliefs and responses" (`weakAreaCategory: 'Black
    Death Beliefs'`). Four pairs: God's punishment → prayer/fasting/
    pilgrimage/flagellation; Miasma → burning herbs/posies; Planetary
    alignment → astrological charts; **Imbalance of humours → bloodletting**
    (the only pair reusing the Four Humours rather than a Black-Death-specific
    belief — good interleaving).
11. **`visualLearning`** — "The actual cause." Four scenes: "not God, not bad
    air, not the stars" → black rats travelled on trading ships → fleas
    carried the bacteria, fed on infected rats, bit humans when rats died →
    `finalReveal`: not discovered until 1894 (Alexandre Yersin, Hong Kong,
    "almost 550 years" later).
    - **Third screen covering the rat→flea→Yersinia pestis mechanism**
      (alongside screens 4 and 5). See GAPS below.
12. **`quickRecall`** — "Causes and beliefs check." Three choice questions:
    Paris Medical Faculty's blame (planetary conjunction), actual cause
    (*Yersinia pestis* via fleas on rats), and why people carried posies
    (miasma).

**Module Completion Test — interleaving**: ✅ strongly satisfied (screens 8,
10, 12 all directly reuse Episode 1 concepts). **Retrieval**: ✅ satisfied
(screens 10, 12).

### Section 4 — Learning Chunk 3 ("Treatments and prevention")

13. **`collectionExplorer`** — "Plague treatments." Five tap-to-reveal items,
    each with 3 layers: flagellants (penance, Church condemns the *movement*
    in 1349), posies and herbs (miasma logic, vinegar/herb sponges),
    bloodletting (Four Humours logic — "internally consistent"), burning
    fires (miasma logic, aromatic wood), fleeing the city (wealth-dependent;
    could spread fleas further). `synthesis`: "Wrong cause → wrong treatment.
    Every time" — **this is the module's core takeaway, stated explicitly
    here for the first time**.
14. **`matchingTask`** — "Treatment to belief" (`weakAreaCategory: 'Black
    Death Treatments'`). Four pairs: flagellants → God's punishment, posies →
    miasma, bloodletting → Four Humours, burning fires → miasma.

**Module Completion Test — "every learning chunk includes interaction /
retrieval"**: ✅ satisfied (both screens are interactive; screen 14 is
retrieval-style).

**GAP**: per the Content file's Specification requirements (Section 3), the
spec phrase "attempts to prevent its spread" may extend to **organised/civic
or governmental** prevention measures, not just individual folk behaviours
(fleeing, posies, fires — all covered here). No such content currently
exists in this section. See `MISSING:` flag in the Content file.

### Section 5 — Learning Chunk 4 ("Life during the plague" + "The aftermath")

15. **`visualNarrative`** — "A village in 1349." Beats: a traveller arrives;
    the priest dies first, then the blacksmith; farmers abandon fields;
    landlords find no workers; church bells ring almost without stopping.
    Conclusion: "For a year, normal life stopped. The world that emerged would
    look very different." — the module's clearest human-experience case
    study.
16. **`visualLearning`** — "Rich and poor." Four scenes: the plague didn't
    kill equally (wealthy could flee, poor couldn't); villages abandoned
    (earthwork evidence survives today); the Church badly hit (up to half of
    clergy died in some areas); `finalReveal`: "the old social order had been
    shaken to its foundations."
17. **`visualLearning`** — "What changed after the plague." Four scenes:
    labour shortage; wages rose and conditions improved; the Church's
    authority weakened (prayers hadn't stopped the plague); `finalReveal`:
    "the seeds of social change" — explicitly names the Peasants' Revolt of
    1381.
18. **`explainReveal`** (custom block, no top-level `type`) — "The causal
    chain" / kicker "Change and continuity," heading "Why the Black Death
    changed England." Four-step chain: population falls (1/3–1/2 of England)
    → labour shortage gives peasants bargaining power → Church loses
    credibility (clergy died tending the sick) → weaker Church + empowered
    peasants → contributes to the Peasants' Revolt of 1381.
    `reflectionPrompt`: "How did population decline lead to social and
    religious change?"
    - **Overlaps with screens 16/17** — the population-fall → labour-shortage
      → wage-rise → Church-weakened → Peasants'-Revolt chain is stated across
      screens 16, 17 AND 18 (in slideshow form twice, then as an explainReveal
      chain). However, unlike Section 2's transmission-mechanism overlap, this
      repetition *culminates* in a single causal chain (screen 18) that ties
      the previous two slideshows together — closer to deliberate
      "spaced reinforcement before the chain" than pure redundancy. Noted as
      lower-priority than the Section 2/3 overlap.
19. **`naturalSupernaturalSwipe`** — "Changed or stayed the same?" Six items
    sorted into CHANGED (peasant wages, Church authority, feudal obligations)
    vs STAYED THE SAME (medical explanations — miasma/God; the Four Humours
    still taught; medical treatments — bloodletting/herbs/prayer continued).
    `explanation`: "The Black Death changed society dramatically — but it
    changed medicine almost not at all. The same theories and treatments
    continued for another 300 years."
    - **This screen is the clearest, most active expression of the module's
      core takeaway** — it makes the learner actively sort the very
      contrast (society vs medicine) that screens 13, 19, 20 and 26 all
      separately assert.
20. **`cinematic`** — "Medicine stayed the same" (year "c.1350"). Six-paragraph
    narrative summary: the plague killed up to half of England, weakened the
    Church, empowered the poor, destabilised feudalism — "but it did not
    change medicine." Doctors saw what they expected to see (God's punishment,
    miasma, planetary alignment); "the plague just confirmed them." Real cause
    not discovered for 546 years.
21. **`quickRecall`** — "Aftermath check." Three choice questions: why wages
    rose (labour shortage), how the Black Death affected Church authority
    (weakened it), what happened to medical theory afterwards (barely
    changed).

**Module Completion Test**: this section is the module's **strongest** —
human-experience case study (15), significance/consequences (16, 17, 18),
an explicit "change vs continuity" sorting interaction (19) that embodies the
core message, a cinematic restatement (20), and retrieval (21). Core chapter
message ("wrong cause → wrong treatment" / "society changed, medicine didn't")
is reinforced here for the second and third time (after screen 13).

### Section 6 — Summary & Examiner ("Exam prep")

22. **`visualLearning`** — "The story so far." Six scenes recapping the whole
    chapter: arrival (1348) → three medieval explanations → treatments that
    reflected those beliefs → society changed but medicine didn't →
    transition into "now let's make sure you can explain this, not just
    describe it" → "time to step into the examiner's seat."
23. **`examinerExplains`** — "How examiners think." Four tips: identify-then-
    explain; use precise evidence (e.g. "around one-third" not "lots");
    know the actual cause and contrast it with contemporary belief; separate
    social change from medical change (named as a common cause of lost marks
    on 8-mark questions).
24. **`faceExaminer`** (4-mark-explain) — "Face the Examiner." Question:
    *"Explain one way religious beliefs affected responses to the Black
    Death. [4 marks]"* Full mark scheme (Level 1/2), a 2/4 annotated sample
    answer, improvement prompts, and `criteriaOptions` for self/peer marking.
25. **`guidedExamResponse`** — "Write for the examiner." Question: *"Describe
    two ways the Black Death spread through England. (4 marks)"* Scaffolded
    two-section response (trade/shipping; rats/fleas), full mark scheme with
    Way A/Way B 1-mark/2-mark thresholds, exemplar 4/4 answer.
26. **`quickRecall`** — "Final chapter challenge." Six choice questions: year
    Black Death reached England (1348/Melcombe), definition of miasma, why
    people prayed, the actual cause (*Yersinia pestis*, 546 years), what
    changed (society), what stayed the same (medical beliefs).

**Module Completion Test — "Examiner content appears only in Section 6"**: ✅
satisfied — screens 23–25 (examiner-specific components) are all within the
"Exam prep" stage; screen 22 (recap) and screen 26 (final retrieval) bookend
them appropriately.

**Module Completion Test — "Module ends with a completion screen"**:
`UNCERTAIN:` the module's `screens` array ends at screen 26 (`quickRecall`,
`src/modules.js:2322`) with no explicit `ChapterCompleteScreen`-type entry. It
is not established in this session whether `ModulePlayer.jsx` renders a
completion screen automatically after the last content screen, or whether
each module's `screens` array is expected to include one explicitly. If the
latter, this is a GAP; if the former, no action needed. Flagged for
verification rather than asserted as a gap.

### Cross-cutting: Component Repetition Limit

Per `HISTORY_MODULE_ARCHITECTURE.md`'s Component Repetition Limit ("no
feature component used >2× per chapter, except Section 1/6 mandatory
components and `QuickRecallScreen`/`PriorKnowledgeRecall`"), component usage
across this module's 26 screens:

| Component / type | Count | Screens |
|---|---|---|
| `visualLearning` | **7** | 5, 6, 9, 11, 16, 17, 22 |
| `quickRecall` | 3 *(exempt)* | 12, 21, 26 |
| `matchingTask` | 2 | 10, 14 |
| `explainReveal` (block) | 2 | 4, 18 |
| `cinematic` | 2 | 2, 20 |
| `interactiveImage` / hotspot | 1 | 3 |
| `progressionTimeline` | 1 | 7 |
| `guidedChoiceCarousel` | 1 | 8 |
| `collectionExplorer` | 1 | 13 |
| `visualNarrative` | 1 | 15 |
| `naturalSupernaturalSwipe` | 1 | 19 |
| `priorKnowledgeRecall` | 1 *(exempt, Section 1)* | 1 |
| `examinerExplains` | 1 *(Section 6)* | 23 |
| `faceExaminer` | 1 *(Section 6)* | 24 |
| `guidedExamResponse` | 1 *(Section 6)* | 25 |

**GAP — `visualLearning` is used 7 times**, far beyond the 2× limit and not
covered by either named exemption. This is the single biggest structural
finding of this audit. Three of those seven instances (5, 11, and — in a
different format — explainReveal screen 4) cover **the same content**: the
rat → flea → *Yersinia pestis* → person transmission mechanism. A further two
(16, 17) cover **the same content** as explainReveal screen 18 (population
fall → labour shortage → Church weakened → social change), though screen 18
synthesises rather than purely repeats them.

## 4. Build recommendations

Numbered, prioritized. Each links to the "five agents of change" (War,
Religion, Individuals, Government, Science & technology) and to interleaving
opportunities, per the Interleaving Rule.

1. **Resolve the transmission-mechanism redundancy (Section 2/3, screens 4,
   5, 11) — this directly answers the question that motivated this canonical
   file.** Agent: **Science & technology** (the absence of it — "no one could
   see this for 546 years" is the actual exam-relevant point).
   - **The content itself is not optional**: screen 4's rat → flea → person
     chain, with the named detail *Yersinia pestis*, is exactly what's
     required for full marks on Way B of the built-in 4-mark "describe two
     ways the Black Death spread" question (screen 25). It should not simply
     be deleted.
   - **But three screens currently teach it**: screen 4 (explainReveal step
     chain), screen 5 (visualLearning, "trade routes carried death... by 1347
     it had reached Sicily"), and screen 11 (visualLearning, "black rats
     travelled on trading ships... fleas carried the bacteria... not
     discovered until 1894"). Screens 5 and 11 are also two of the module's
     seven `visualLearning` instances — the component most over-used relative
     to the Component Repetition Limit.
   - **Recommended shape**: make **one** screen — plausibly a redesigned
     version of screen 4 — the single, high-quality, interactive treatment of
     "how the plague actually spread," built to be memorable and exam-precise
     (this is the natural home for the Phase 4 "predict the chain, then watch
     it build" interaction concept discussed earlier in this session). Screen
     5 should keep its *origin/scale* content (central Asia → Sicily → England
     → 25 million dead) but drop or compress its rat/trade-route mechanism
     beats, since screen 4 now owns that. Screen 11's *origin/scale* framing
     ("not God, not bad air, not the stars") could be folded into the belief
     reveal (screen 9) as the natural payoff to "all three explanations were
     wrong," with its mechanism beats removed for the same reason.
   - Net effect: removes 1–2 of the 7 `visualLearning` instances, resolves the
     Component Repetition Limit breach, and concentrates redesign effort on
     the one screen that's both exam-critical and (per the earlier brainstorm
     in this session) currently the weakest *experience* in the module.

2. **Add organised/civic prevention measures to Section 4 (screens 13–14).**
   Agent: **Government**. The Strand 3 spec phrase "attempts to prevent its
   spread" is currently only evidenced by individual/folk behaviours
   (fleeing, posies, fires). `MISSING:` sourcing on whether contemporary
   civic/government measures existed for the Black Death specifically (e.g.
   burial ordinances, restrictions on movement/gatherings) — if sourced, this
   would also begin to fill the "Government" agent-of-change gap noted in the
   Content file (currently almost entirely absent from this episode), and
   would interleave forward to later episodes' "how does government respond
   to health crises?" thread.

3. **Source a named contemporary individual for the "Individuals" agent of
   change.** Currently this episode's only named figures are Geoffrey le
   Baker (a single chronicler quote) and Alexandre Yersin (1894, outside the
   period). Episode 1 is anchored by Hippocrates/Galen as named individuals;
   Episode 2 has no equivalent. `MISSING:` sourcing — even a single named
   chronicler, physician, or official whose personal account or action
   threads through 2–3 screens (e.g. the dock hotspot → a treatments screen →
   the aftermath) would strengthen narrative continuity without adding new
   screens.

4. **Consider whether screens 16–18's three-times-stated "population fall →
   labour shortage → Church weakened → social change" chain needs trimming.**
   Agent: **Religion** (Church authority) interleaving with **Government**
   (feudal system breakdown, seeds of the Peasants' Revolt of 1381). Lower
   priority than recommendation 1 — screen 18's explainReveal chain
   *synthesises* screens 16/17 rather than purely duplicating them, and this
   section already strongly satisfies the Module Completion Test. If
   recommendation 1 is implemented first and the resulting screen 4 redesign
   establishes a strong "predict → reveal chain" pattern, screens 16–18 are a
   natural candidate for a *similar* treatment in a future pass — but not
   urgent.

5. **Verify the "module ends with a completion screen" Module Completion Test
   point.** Not Black-Death-specific — applies to every module. If
   `ModulePlayer.jsx` does not render a completion screen automatically, this
   episode (and likely others) would need an explicit `ChapterCompleteScreen`
   entry appended to `screens`. Quick to check, not urgent to fix unless the
   answer is "no."

6. **Interleaving forward**: this episode's "society changed, medicine didn't"
   thesis (screen 19's `naturalSupernaturalSwipe`, screen 20's cinematic) is
   the direct setup for Episode 3 (Renaissance & the Plague) — whose own hook
   already states "Renaissance medicine changed knowledge, not treatment...
   Galen still dominated universities" and explicitly references "the Great
   Plague (1665)" as proof of the limits of Renaissance progress
   (`src/modules.js:2327–2386`, module `mod2`). No action needed here, but
   future work on Episode 3's `PriorKnowledgeRecall` should explicitly recall
   Episode 2's "medicine stayed the same" conclusion as its starting point —
   confirming the interleaving chain (Episode 1 → Episode 2 → Episode 3) is
   intact at the data level, even though Episode 3's canonical file has not
   been built.
