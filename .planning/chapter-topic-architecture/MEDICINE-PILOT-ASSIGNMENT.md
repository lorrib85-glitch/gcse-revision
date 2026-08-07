# Medicine Chapter Topic pilot assignment

**Phase:** T1A — assignment and readiness pilot only  
**Pilot Chapter:** `history-medicine-medieval-beliefs-causes`  
**Status:** COMPLETE as a planning artefact. T1B metadata authoring is a separate phase.  
**Runtime baseline:** 34 Screens from `episode-01-medieval-beliefs-causes.runtime.js`  
**Behaviour change in this phase:** none

This document is the first real use of the Chapter Topic contract and the Chapter readiness audit. It records a pedagogical Screen-to-Topic assignment before any Topic metadata is authored.

It does **not** change Chapter copy, Screen order, `stageNavigation`, `screenTags`, learner progress, weakness routing or runtime behaviour.

---

## 1. Evidence used

### Repository authorities

- `docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter_Content.md`
- `docs/content/history/Medicine/01_Trust_Me_Im_Following_Jupiter_Architecture.md`
- `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js`
- `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js`
- `src/data/learningGraph/concepts/historyMedicine.js`
- `src/data/generated/componentPedagogyRegistry.js`
- `src/data/contentSupport/historyMedicineEpisode01.js`
- `src/curriculum-catalogue/records/chapters/history/medicine-britain.js`
- `src/curriculum-catalogue/records/modules/history-edexcel-medicine-britain.js`
- `docs/system/CHAPTER_TOPICS.md`
- `docs/system/CHAPTER_READINESS_AUDIT.md`

### Supplied Edexcel evidence checked

- `Edexcel-GCSE-History-Knowledge-Organiser-for-Medicine-in-Britain.pdf`
- Paper 1 Medicine sample / past-paper question material and mark schemes supplied for the project

The source pack supports the Chapter's main medieval curriculum areas: Four Humours, Hippocrates and Galen, religious explanations, miasma, astrology, practitioners, hospitals, care, prevention and continuity/change.

The Black Death is deliberately excluded from this assignment because the canonical Chapter content assigns it to Episode 2.

---

## 2. Runtime baseline — use this, not stale historical counts

The authored source contains a duplicate Four Humours reveal and no separate Galen cinematic intro. The runtime wrapper:

1. removes the duplicate Four Humours `conceptReveal`;
2. converts the Theory of Opposites teaching screen to the runtime infographic form;
3. composes the two opposite-quality reveals through the governed teaching route;
4. inserts a cinematic Galen introduction immediately before the Galen profile.

The net learner-facing sequence remains **34 Screens**.

Older architecture/review material mentioning 32 Screens, and the current hand-authored concept-support map's historical indices, must not be used as the Topic assignment authority.

Only 5 of the 34 runtime Screens currently carry legacy `screenTags`. Topic membership therefore cannot be derived mechanically from those tags.

---

# 3. Proposed Chapter Topics

The six Topics below are semantic revisitable learning units. They intentionally do **not** mirror the six `stageNavigation` progress-header sections.

Estimated minutes are provisional content-planning estimates for the Topic-sized work only. They are not learner analytics and should be revisited after real usage data exists.

| Topic ID | Learner title | Registered Concept IDs | Est. min | Runtime Screens | Standalone-context finding |
|---|---|---|---:|---|---|
| `hippocrates-and-four-humours` | Hippocrates and the four humours | `history:medicine:hippocrates`, `history:medicine:four-humours` | 8 | 1, 2, 3, 4, 5, 26 | Mostly self-contained. Screen 26 is deliberately spaced retrieval later in the Chapter. |
| `galen-and-opposites` | Galen and the theory of opposites | `history:medicine:galen`, `history:medicine:theory-of-opposites`, `history:medicine:four-humours`, `history:medicine:church-authority` | 10 | 6, 7, 8, 9, 10, 11, 12, 29 | Depends on learner already knowing the Four Humours. A future standalone refresher needs a short prerequisite recap or entry bridge. |
| `practitioners-diagnosis-and-care` | Practitioners, diagnosis and care | `history:medicine:physicians`, `history:medicine:barber-surgeons`, `history:medicine:apothecaries`, `history:medicine:medieval-hospitals`, `history:medicine:religious-hospitals` | 9 | 13, 16, 21, 22, 23 | Coherent as a care/practitioner unit, but several taught details have no granular registered Concept yet (for example uroscopy, home care and John Bradmore). |
| `miasma-and-prevention` | Miasma and medieval prevention | `history:medicine:miasma`, `history:medicine:four-humours`, `history:medicine:factors-in-change` | 6 | 14, 19, 20 | Strong future repair unit for miasma, but currently has no Topic-local assessed verification of miasma knowledge. |
| `religion-astrology-and-belief` | Religion, astrology and causes of disease | `history:medicine:astrology`, `history:medicine:religion`, `history:medicine:god-punishment`, `history:medicine:sin`, `history:medicine:prayer`, `history:medicine:pilgrimage` | 6 | 15, 17, 24 | Screen 17 refers to Thomas and assumes the earlier healer scenario. A future standalone route needs neutral context or a short bridge. |
| `why-medieval-medicine-changed-so-little` | Why medieval medicine changed so little | `history:medicine:factors-in-change`, `history:medicine:church-authority`, `history:medicine:galen` | 7 | 27, 28, 30 | Strong synthesis/revision Topic. It assumes the learner has already met the causal beliefs and is not suitable as first teaching of those beliefs. |

**Topic-owned Screens:** 28  
**Deliberately Chapter-level Screens:** 6  
**Total accounted for:** 34 / 34

### Why these are not just the old stages

The progress-header stages are presentation ranges. They are useful for a Chapter journey but not stable adaptive identity.

Examples from this pilot:

- miasma is taught inside the old treatment stage, while the useful revisitable unit is **Miasma and medieval prevention**;
- Four Humours retrieval intentionally reappears much later than its initial teaching;
- Galen's authority explanation reaches into the Screen currently used as the start of the old treatment stage;
- synthesis and exam preparation are different learning jobs even though the current stage boundaries blur them.

A Chapter Topic therefore describes **what coherent learning can be revisited**, not which sixth of the progress bar a Screen happens to occupy.

---

## 4. Deliberately Chapter-level Screens

These Screens should omit `topic` in T1B.

| Screen | Label | Reason |
|---:|---|---|
| 0 | Ancient Authorities | Chapter opening and cross-Topic framing. Establishes why ancient authority matters before any one Topic. |
| 18 | Knowledge check | Broad retrieval across Galen, Four Humours, Theory of Opposites, practitioners, astrology and diagnosis. Assigning it to one Topic would misrepresent it. |
| 25 | Retrieval | Deliberate interleaving across diagnosis, practitioners and religious treatment. |
| 31 | What the examiner rewards | Chapter-wide exam-technique instruction rather than one content Topic. |
| 32 | Face the Examiner | Chapter-wide exam practice. It also contains an exam-format problem recorded below. |
| 33 | Write the big essay | Chapter-wide 16-mark judgement drawing evidence from several Topics. |

---

# 5. Complete runtime Screen inventory

Pedagogy below is **derived from the Component Pedagogy Registry**, not authored as new Topic metadata.

For composed Screens without a top-level authoring type, the governed block is shown.

| # | Runtime Screen | Topic / Chapter-level | Type / governed block | Derived learning function | Interaction | Readiness note |
|---:|---|---|---|---|---|---|
| 0 | Ancient Authorities | Chapter-level | `timelineChain` | sequence-process | reveal | Opening context across Hippocrates, Galen and Church authority. |
| 1 | The Germ Problem | `hippocrates-and-four-humours` | `conceptReveal` | teach-mechanism | reveal | Self-contained problem framing. |
| 2 | The search for answers | `hippocrates-and-four-humours` | `conceptReveal` | teach-mechanism | reveal | Introduces Hippocrates. |
| 3 | Hippocrates | `hippocrates-and-four-humours` | `keyFigureReveal` | introduce-figure | reveal | Core Hippocrates/Four Humours teaching. |
| 4 | Explore the Humours | `hippocrates-and-four-humours` | `interactiveImage` | teach-mechanism + apply | reveal | Applies humour qualities; no right/wrong evidence state. |
| 5 | Hippocrates — quick check | `hippocrates-and-four-humours` | `quickRecall` | retrieve | assessed | Direct retrieval check for Hippocrates/Four Humours. Exact weakness/evidence attribution requires separate wiring verification. |
| 6 | Introducing Galen | `galen-and-opposites` | runtime `conceptReveal` | teach-mechanism | reveal | Runtime-only cinematic bridge; context-safe only if Four Humours prerequisite is handled. |
| 7 | Galen | `galen-and-opposites` | `keyFigureReveal` | introduce-figure | reveal | Galen, animal dissection, authority, Four Humours and opposites. |
| 8 | The Theory of Opposites | `galen-and-opposites` | runtime `infographic` | teach-mechanism | passive | Explains opposite qualities. |
| 9 | Hot and cold symptoms | `galen-and-opposites` | `oppositeQualitiesReveal` | teach-comparison | reveal | Classification demonstrated, not assessed. |
| 10 | Wet and dry symptoms | `galen-and-opposites` | `oppositeQualitiesReveal` | teach-comparison | reveal | Classification demonstrated, not assessed. |
| 11 | Retrieval | `galen-and-opposites` | `quickRecall` | retrieve | assessed | Checks Theory of Opposites, religion/Church and humour qualities. |
| 12 | England, 1250 | `galen-and-opposites` | `visualLearning` | hook-tension + teach-mechanism | reveal | Teaches why Galen/old ideas survived; currently sits on an old navigation boundary. |
| 13 | Choose Your Healer | `practitioners-diagnosis-and-care` | `guidedChoiceCarousel` | apply | assessed | Compares practitioner choices and home/priest care. Some content lacks granular Concept IDs. |
| 14 | Miasma — The Poisoned Air Theory | `miasma-and-prevention` | `conceptReveal` | teach-mechanism | reveal | Strong direct miasma teaching; future weak-spot repair anchor. |
| 15 | Diagnose Like It's 1340 | `religion-astrology-and-belief` | `interactiveImage` | teach-mechanism + apply | reveal | Astrology/Zodiac Man teaching; no right/wrong evidence state. |
| 16 | The colour of your illness | `practitioners-diagnosis-and-care` | `timelineChain` | sequence-process | reveal | Uroscopy is taught but no canonical uroscopy Concept exists today. |
| 17 | What caused illness? | `religion-astrology-and-belief` | `centreImageReveal` | apply | assessed | Good causation/treatment application, but Thomas framing assumes Screen 13 context. |
| 18 | Knowledge check | Chapter-level | `matchingTask` | classify | assessed | Broad cross-Topic retrieval; keep unassigned. |
| 19 | Staying Well in 1400 | `miasma-and-prevention` | `interactiveImage` | teach-mechanism + apply | reveal | Connects prevention to miasma/Four Humours; Regimen Sanitatis lacks its own registered Concept. |
| 20 | Whose job was it to stay healthy? | `miasma-and-prevention` | composed `colsort` | classify | assessed | Applies public vs individual prevention; useful assessment but not narrowly miasma-only. |
| 21 | A Walk Through Medieval London | `practitioners-diagnosis-and-care` | `interactiveImage` | teach-mechanism + apply | reveal | Hospitals, care-not-cure, religious hospitals and endowments. |
| 22 | How John Bradmore saved a prince | `practitioners-diagnosis-and-care` | composed `explainReveal` | teach-mechanism | reveal | Practical surgery/experience; no John Bradmore Concept atom exists. |
| 23 | Words from a medieval medicine chest | `practitioners-diagnosis-and-care` | `matchingTask` | classify | assessed | Practitioner/hospital/public-health vocabulary retrieval; several terms lack granular Concept atoms. |
| 24 | Supernatural vs Natural Causes | `religion-astrology-and-belief` | `naturalSupernaturalSwipe` | classify | assessed | Strong classification across religion, astrology, humours and miasma. |
| 25 | Retrieval | Chapter-level | `quickRecall` | retrieve | assessed | Cross-Topic interleaving; keep unassigned. |
| 26 | Fill the Medieval Logic Gap | `hippocrates-and-four-humours` | composed `fillblanks` | retrieve | assessed | Spaced retrieval of core Four Humours logic. |
| 27 | Common traps | `why-medieval-medicine-changed-so-little` | composed `misconceptionCheck` | retrieve + exam-technique | assessed | Repairs key misconceptions before synthesis. |
| 28 | So how much actually changed? | `why-medieval-medicine-changed-so-little` | `conceptReveal` | teach-mechanism | reveal | Core continuity argument. |
| 29 | Who said what? | `galen-and-opposites` | `quickRecall` | retrieve | assessed | Spaced differentiation of Hippocrates vs Galen. |
| 30 | The web of medieval belief | `why-medieval-medicine-changed-so-little` | `factorWeb` | teach-comparison + apply | assessed | Chapter synthesis/judgement across causal beliefs and authority. |
| 31 | What the examiner rewards | Chapter-level | `examinerExplains` | exam-technique | passive | Correctly Chapter-wide. |
| 32 | Face the Examiner | Chapter-level | `faceExaminer` | exam-technique | assessed | **Readiness Fail:** authored as an 8-mark thematic Medicine question, which is not an Edexcel Section B thematic-study format. |
| 33 | Write the big essay | Chapter-level | `guidedExamResponse` | exam-technique | assessed | The 16-mark Church judgement question is a valid Edexcel Medicine form; current support should separately acknowledge the additional SPaG marks used on this question type. |

---

# 6. Canonical coverage → Topic home

This is a Topic-placement check, not a replacement for the full two-way `content-review` coverage audit.

| Canonical area | Primary Topic / Chapter-level home | Pilot status |
|---|---|---|
| Hippocrates and natural explanations | `hippocrates-and-four-humours` | Pass |
| Four Humours: four fluids, balance/imbalance | `hippocrates-and-four-humours` | Pass |
| Galen and Theory of Opposites | `galen-and-opposites` | Pass |
| Why Galen/ancient authority remained dominant | `galen-and-opposites` + `why-medieval-medicine-changed-so-little` | Pass |
| Religious causes: God, sin, faith | `religion-astrology-and-belief` | Pass |
| Religious responses: prayer/pilgrimage/confession | `religion-astrology-and-belief` + practitioner/care material | Pass at Topic-placement level |
| Astrology and Zodiac diagnosis/timing | `religion-astrology-and-belief` | Pass |
| Miasma | `miasma-and-prevention` | Pass |
| Physicians, barber surgeons, apothecaries | `practitioners-diagnosis-and-care` | Pass |
| Home care / women / herbal treatment | Screen 13 inside `practitioners-diagnosis-and-care` | **Review — content exists, but registered Concept granularity is insufficient for precise Topic metadata/evidence attribution.** |
| Uroscopy / urine charts | Screen 16 inside `practitioners-diagnosis-and-care` | **Review — taught, but no registered uroscopy/urine-chart Concept.** |
| Hospitals / care not cure | `practitioners-diagnosis-and-care` | Pass |
| Medieval surgery / practical experience | Screen 22 inside `practitioners-diagnosis-and-care` | **Review — John Bradmore is taught without a dedicated medieval surgery/Bradmore Concept atom.** |
| Prevention: Regimen Sanitatis, miasma avoidance, town action | `miasma-and-prevention` | Pass at Topic-placement level; granular Concept coverage remains Review |
| Natural vs supernatural synthesis | `religion-astrology-and-belief` | Pass |
| Change/continuity and coherent-but-wrong system | `why-medieval-medicine-changed-so-little` | Pass |
| 16-mark judgement on Church / lack of change | Chapter-level Screen 33 | Pass for question form |
| Authentic Section B causation practice | Chapter-level exam section | **Fail — current Screen 32 uses an 8-mark format instead of a valid thematic Section B 4/12/16-mark format.** |

### Important source distinction

The supplied knowledge organiser describes dissection as **limited** and says the Church discouraged challenges to ancient ideas. Some current Chapter copy/canonical wording uses stronger language about the Church banning dissection. This pilot does not silently reconcile that wording. If the Chapter content is revised, `content-review` should check the precise claim against the chosen canonical/source authority.

---

# 7. Learner outcomes check

The Chapter currently promises four learner outcomes.

| Outcome | Planned Topic home | Demonstration / check | Status |
|---|---|---|---|
| Why removing blood seemed sensible | `hippocrates-and-four-humours` + `galen-and-opposites` | Screens 5, 11, 26 and broad later checks | Pass at planning level |
| Why doctors checked the stars | `religion-astrology-and-belief` | Screens 17/24 plus broad checks | Pass at planning level |
| Why praying was considered medicine | `religion-astrology-and-belief` | Screens 17/24 and Chapter-level 25/32 | Pass at planning level; Screen 32's exam form itself fails authenticity |
| Why intelligent people believed things that weren't true | `galen-and-opposites` + `why-medieval-medicine-changed-so-little` | Screens 27–30 and 33 | Pass at planning level |

---

# 8. Evidence, weak-spot reporting and recovery readiness

## What the Chapter does have

The Chapter contains substantial assessed activity: `quickRecall`, `guidedChoiceCarousel`, `centreImageReveal`, `matchingTask`, `colsort`, `naturalSupernaturalSwipe`, `fillblanks`, `misconceptionCheck`, `factorWeb`, `faceExaminer` and `guidedExamResponse` are assessed according to the Component Pedagogy Registry where applicable.

This means the Chapter has many opportunities to detect misunderstanding.

## What is **not** proven by that

An assessed interaction is not automatically valid adaptive evidence. T1A does not assume that every assessed Screen:

- emits a canonical Concept ID;
- reaches the mastery/evidence system;
- writes a useful weakness record;
- identifies the exact Topic a future repair should open.

Those claims require producer-level wiring evidence.

### Topic-level recovery readiness

| Topic | Existing assessed opportunities | Weak-spot / recovery finding |
|---|---|---|
| Hippocrates and Four Humours | Screens 5, 26; broad 18/25/27/29/30 | **Review:** strong checks exist, but exact canonical Concept attribution must be verified before adaptive use. |
| Galen and Opposites | Screen 11, 29; broad 18/27/30/33 | **Review:** multiple checks exist; standalone Topic also needs Four Humours prerequisite handling. |
| Practitioners, diagnosis and care | Screens 13, 23; broad 18/25/27/33 | **Review:** several assessed activities use broad weak groups rather than granular registered Concepts. |
| Miasma and prevention | Screen 20; broad 24/30 | **Review:** no miasma-specific right/wrong verification sits inside the Topic. Before T4, add or reuse a valid targeted verification route rather than assuming completion proves understanding. |
| Religion, astrology and belief | Screens 17, 24; broad 25/30/32 | **Review:** evidence opportunities exist; Screen 17 assumes earlier Thomas context and Screen 32's exam form is invalid. |
| Why medicine changed so little | Screens 27, 30; Chapter-level 33 | Pass as a synthesis target, but it is a prerequisite-heavy refresher rather than first-line factual repair. |

## Existing hand-authored support map is stale

`src/data/contentSupport/historyMedicineEpisode01.js` is marked `draft-human-review` and its Screen indices no longer match the 34-Screen runtime sequence after the duplicate removal / Galen intro runtime transformation and later Chapter edits.

Examples include historical mappings that place:

- the Hippocrates quick check at 6, while runtime 6 is now the Galen cinematic intro;
- England 1250 at 11, while runtime 11 is Galen retrieval and England 1250 is 12;
- later synthesis/exam Screens at indices that no longer match current runtime content.

The map is not imported as a learner-runtime Topic authority; architecture tests are its visible consumer today. T1A therefore **does not repair this hand-authored map**. Its drift is evidence for T2's planned generated Topic index, which should derive membership from Chapter content rather than duplicating indices by hand.

---

# 9. Metadata and navigation findings

## Pass

- canonical Chapter record exists;
- `contentPath` resolves through the runtime wrapper;
- the Chapter is `available`;
- exactly one parent Module (`history-edexcel-medicine-britain`) owns it at position 0;
- all proposed Topic Concept IDs above already exist in the Medicine Concept Registry;
- 34 / 34 runtime Screens are accounted for exactly once as Topic-owned or Chapter-level.

## Pre-existing navigation drift — Review / separate repair

The current `stageNavigation` indices are `[0, 1, 7, 12, 25, 28]`. Runtime transformation preserves those numbers, but the content has evolved around them.

Three obvious semantic mismatches are now visible:

1. **Runtime Screen 6** is the inserted Galen cinematic intro, but the progress-header “Why Galen Ruled the Room” section begins at 7.
2. **Runtime Screen 12** (`England, 1250`) teaches Church/book-learning/dissection reasons why Galen's ideas survived, yet it is also the current boundary for “The Medieval Treatment Toolkit”.
3. **The progress-header Exam Prep section begins at 28**, while Screens 28–30 are continuity/synthesis; the actual exam-technique Screens begin at 31.

T1B has a hard parity requirement that `stageNavigation` remain unchanged, so this debt must **not** be opportunistically fixed inside T1B. It should receive a separate reviewed Chapter-navigation/content correction if the user chooses to fix it.

---

# 10. Exam-readiness finding from the pilot

This is the strongest whole-Chapter readiness failure found during T1A.

The supplied/current Edexcel Paper 1 structure shows:

- Section A historic environment contains the source-based 8-mark question;
- Section B thematic study uses a 4-mark comparison question, a 12-mark `Explain why` question, and a 16-mark `How far do you agree?` judgement question (with additional SPaG marks on the judgement question in the standard paper structure).

Current runtime Screen 32 is configured as:

- `type: '8-mark-explain'`;
- question: `Explain two ways in which religion influenced medical treatment in medieval England. [8 marks]`.

That is not an authentic Medicine thematic-study Section B question form.

**Readiness outcome: Fail — exam-technique authenticity.**

The 16-mark Church judgement at Screen 33 is a valid Edexcel form and closely matches a real past-paper medieval Medicine question. Its learner-facing marking/support should nevertheless make the additional SPaG expectation explicit when the current Edexcel paper format requires it.

This failure is pre-existing and unrelated to inert Topic metadata. T1A records it; T1B must not silently bundle a content rewrite into a behaviour-preserving migration.

---

# 11. Pacing / cognitive-load review

The six proposed Topic estimates total roughly **46 minutes** before the six Chapter-level opening/interleaving/exam Screens are added. The full Chapter therefore remains substantially longer than one short revision burst.

**Readiness outcome: Review, not Fail.**

The Topic layer improves this situation because future planner/refresher consumers can schedule coherent 6–10 minute units rather than forcing the whole Chapter. Do not invent a universal Chapter-duration limit from this single pilot; measure actual learner completion before setting thresholds.

---

# 12. Standalone-T4 blockers discovered

T4 should not simply slice these Screens and assume they read naturally in isolation.

| Topic | Blocker / assumption | T4 treatment to evaluate later |
|---|---|---|
| `hippocrates-and-four-humours` | Minimal | Likely usable almost directly; verify opening feels natural without Chapter Screen 0. |
| `galen-and-opposites` | Assumes Four Humours already known | Add/reuse a very short prerequisite recap or step-down route when needed. |
| `practitioners-diagnosis-and-care` | Mixed practitioner, uroscopy, hospital and surgery detail; some missing Concept atoms | Validate the Topic's start point and Concept attribution before adaptive routing. |
| `miasma-and-prevention` | Prevention Screens also refer back to Four Humours; no miasma-specific verification | Add/reuse targeted verification and ensure miasma is the clear repair target. |
| `religion-astrology-and-belief` | Screen 17 assumes the Thomas/healer narrative introduced in Screen 13 | Neutralise or supply context when entered standalone. |
| `why-medieval-medicine-changed-so-little` | Requires several earlier Topics | Treat as synthesis/stretched repair, not first-line factual remediation. |

No prerequisite metadata is added in v1. These are review findings for future T4 routing logic/content handling.

---

# 13. T1A readiness summary

## Topic-assignment scope

| Check | Result |
|---|---|
| Runtime baseline established | Pass — 34 Screens |
| Every runtime Screen accounted for exactly once | Pass — 34 / 34 |
| Topic IDs semantic, not positional | Pass |
| Topic titles learner-facing | Pass |
| Topic Concept IDs registered | Pass |
| Estimated minutes supplied | Pass — provisional estimates recorded |
| Chapter-level Screens deliberately identified | Pass — 6 |
| Assignment derived pedagogically rather than from legacy tags | Pass |
| Standalone-context assumptions recorded | Pass |
| Source/runtime content changed by T1A | Pass — none |

**T1A assignment result: COMPLETE.**

## Whole-Chapter readiness exposed by the pilot

- **Fail:** Screen 32 uses a non-authentic 8-mark thematic Medicine exam format.
- **Review:** 16-mark support should explicitly account for current SPaG expectations.
- **Review:** `stageNavigation` semantic boundaries have drifted from the current runtime sequence.
- **Review:** hand-authored concept-support indices are stale; do not treat them as Topic authority.
- **Review:** several important taught details have no granular Concept atoms.
- **Review:** assessed interactions exist, but exact canonical evidence/weakness wiring is not proven for every Topic.
- **Review:** full Chapter duration is long; Topic-sized revisiting is likely valuable but thresholds should be evidence-led.

**Whole-Chapter result: NOT READY FOR A CLAIM OF FULL CONTENT APPROVAL.**

That does not invalidate T1A. It demonstrates why the readiness audit exists: a behaviour-preserving Topic assignment can be sound while the existing Chapter still contains separate quality debt.

---

# 14. Gate to T1B

T1B may author **only**:

1. the six `topics` records above; and
2. `topic` back-references on the 28 assigned Screens.

T1B must preserve:

- 34 runtime Screens;
- Screen order;
- authored copy;
- derived `screenTags`;
- current `stageNavigation`;
- Chapter open/progress/complete behaviour;
- learner progress keys;
- 390px rendered behaviour.

The exam-format failure, stage-navigation drift, stale support map and Concept-registry gaps are explicitly **not licence to expand T1B scope**. They should be fixed in separately reviewed work.

T1B should not begin merely because this file exists; it begins only when the user authorises the metadata phase.
