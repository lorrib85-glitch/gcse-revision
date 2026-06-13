# Episode 2: The Day Everything Changed — Content

## Scope note (read first)

This file is a **content-only knowledge source** (facts, narrative, exam
material). Build/architecture mapping — including the full screen-by-screen
inventory of the already-built module — lives in the companion file
`02_The_Day_Everything_Changed_Architecture.md` in this directory.

- **Scope = the Black Death case study, 1348–49** (Edexcel Strand 3:
  "Dealing with the Black Death, 1348–49; approaches to treatment and
  attempts to prevent its spread"), plus its **aftermath/significance**
  (labour shortage, weakened Church authority, the road to the Peasants'
  Revolt of 1381) and the "did medicine actually change?" continuity
  question.
- This episode is the **stress test** of Episode 1's concepts. Four Humours,
  miasma, astrology, God-and-sin, and the Church's authority are all
  established in Episode 1 (Medieval Medicine c1250–1500) — Episode 2 takes
  those same beliefs and shows what happens when they meet a catastrophe.
  Per the Interleaving Rule in `HISTORY_MODULE_ARCHITECTURE.md`, these
  concepts should **reappear**, not be retaught from scratch.
- **Sourcing for this file**: Episode 2 is marked **"Built and aligned"** in
  `HISTORY_SERIES_MAP.md` (module `history-medicine-black-death`,
  `src/modules.js:1348–2325`, 26 screens). The primary content reference pack
  below is drawn directly from that already-built module — which itself
  already contains two fully-specified Edexcel-style exam questions with mark
  schemes (see Exam angles) — cross-referenced against the Edexcel spec
  wording for Strand 3 quoted in Episode 1's content file
  (`01_Trust_Me_Im_Following_Jupiter_Content.md`, Section 3). **No additional
  session-provided source material** (new past papers, revision guides, or
  spec excerpts specific to Episode 2) was supplied in this session. Gaps
  against the spec are flagged `MISSING:` below — these are the sourcing
  checklist for a future session if a deeper rebuild of this episode is ever
  undertaken.

## 1. Identity

- **Episode number:** 2
- **Title (series map):** The Day Everything Changed
- **Subtitle / GCSE topic:** The Black Death, 1348–1349
- **Era:** c.1348–c.1350 (per the built module's `era` field)
- **Key Topic reference:** N/A — Series 1 (Medicine Through Time) has no Key
  Topic numbering
- **Build status:** Built as `history-medicine-black-death`
  (`src/modules.js:1348`) — not shared with any other episode. (Confirmed:
  this module id appears in exactly one row of the Series 1 episode table —
  Episode 2 — and is referenced nowhere else in `src/modules.js` outside this
  module's own screens/assets.)

## 2. Storyline

### Core takeaway (as embodied by the built module)

> Wrong cause → wrong treatment. Every time.
>
> The Black Death changed society dramatically — but it changed medicine
> almost not at all.

This is the direct continuation of Episode 1's thesis ("people weren't
stupid; their ideas were logical given what they knew; powerful institutions
and respect for authority stopped those ideas being challenged"). The Black
Death is the moment those same ideas are tested against a catastrophe — and
they hold completely firm, with catastrophic human cost, while **society**
(not medicine) is transformed.

### Evidence for the takeaway

**"Wrong cause → wrong treatment. Every time":**

- Every plague treatment shown in the module (flagellation, posies/herbs,
  bloodletting, burning fires, fleeing) targets one of Episode 1's
  established causes (God's punishment, miasma, the Four Humours) — none of
  them addresses *Yersinia pestis* or the fleas that carried it, because
  nobody could see that cause.
- The module's own synthesis line for the treatments screen states this
  directly: *"Medieval people were not stupid — they were reasoning
  logically from wrong premises."*
- Bloodletting during the plague is explicitly framed as **internally
  consistent** with Four Humours logic ("if the body was overwhelmed, excess
  of one humour might be responsible") even though it "almost certainly made
  their condition worse" — reinforcing Episode 1's "logical but wrong" frame
  rather than mocking medieval reasoning.
- The actual cause (*Yersinia pestis* bacteria, carried by fleas on black
  rats) was not discovered until **1894** — by Alexandre Yersin, in Hong
  Kong — independently confirming that no medieval explanation could have
  been correct; the gap is variously described in the module as "another 500
  years," "almost 550 years," and (in the final quickRecall) precisely "546
  years" (1348 → 1894). `NOTE:` this is a rounding inconsistency across
  screens, not a factual conflict — 546 is the exact figure.

**"Society changed dramatically — medicine changed almost not at all":**

- Population fell by one-third to one-half in England → labour shortage →
  surviving peasants could demand higher wages for the first time → directly
  challenged the feudal system → contributed to the conditions behind the
  **Peasants' Revolt of 1381**.
- The Church's promise that faith offered protection visibly failed — up to
  half of clergy died in some areas, often because they stayed to tend the
  sick — and many people lost faith in the Church's spiritual authority as a
  result.
- Meanwhile, **medical theory and treatment did not change**: the Four
  Humours remained the basis of university medical teaching after 1350;
  bloodletting, herbal remedies and prayer continued exactly as before;
  doctors "looked at the plague and saw exactly what they expected to see."
- The module's `naturalSupernaturalSwipe` screen makes this an explicit
  sorting exercise: wages, Church authority and feudal obligations go in
  "CHANGED by 1350"; medical explanations, the Four Humours, and medical
  treatments go in "STAYED THE SAME by 1350."

### Series throughline / five agents of change

Medicine Through Time's five "agents of change" are **War, Religion,
Individuals, Government, and Science & technology** (per
`HISTORY_SERIES_MAP.md`). How Episode 2 currently uses each:

- **Religion** — the dominant agent in this episode. The Church's authority
  is directly damaged by the plague (clergy deaths, failed prayers,
  flagellant groups eventually condemned by the Church itself in 1349). This
  sets up Episode 3+'s "Renaissance challenges to Galen" by showing the
  Church's grip already weakening for non-medical reasons.
- **Individuals** — comparatively thin in the *built* module. Geoffrey le
  Baker (a chronicler) is quoted once, and Alexandre Yersin appears only as
  the 1894 discoverer of *Yersinia pestis* (i.e. outside the episode's actual
  period). `MISSING:` no named medieval individual (doctor, official,
  chronicler beyond le Baker) currently anchors this episode's narrative the
  way Hippocrates/Galen anchor Episode 1 — flagged for Build recommendations.
- **Government** — almost entirely absent from the built module. The only
  government-adjacent fact is retrospective: Edward III's 1352 anti-littering
  law belongs to Episode 1 (general public health), not specifically to a
  Black Death government *response*. `MISSING:` any contemporary government
  or civic response to the Black Death itself (e.g. quarantine measures,
  burial regulations, royal/civic ordinances) — Episode 1's content file
  notes the general pattern "government only acts on public health at scale
  during crises... the Black Death... tests this," but the built module does
  not currently show *what* that crisis-driven government action (if any)
  looked like.
- **Science & technology** — explicitly shown as **absent as a force for
  change** in this period, which is itself the examinable point: the real
  cause existed but was undiscoverable with available tools, and stayed
  undiscovered for 546 years. This directly continues Episode 1's "science &
  technology contributes almost nothing in this period" thread.
- **War** — not present in the built module's Black Death content (distinct
  from Episode 1, where war drove surgical progress). Trade, not war, is the
  transmission vector here. This is a legitimate absence (the spec does not
  require a war angle for this case study) rather than a gap.

### Exam framing

The built module already contains **two fully-specified, Edexcel-style exam
questions with complete mark schemes** — see "Exam angles" below for full
detail:

1. **`guidedExamResponse`** — *"Describe two ways the Black Death spread
   through England. (4 marks)"* — scaffolded two-part answer (trade/shipping;
   rats/fleas), full mark scheme with 1-mark vs 2-mark thresholds, named
   exemplar 4/4 answer.
2. **`faceExaminer`** (4-mark-explain type) — *"Explain one way religious
   beliefs affected responses to the Black Death. [4 marks]"* — annotated
   2/4 sample answer, Level 1/2 mark scheme, improvement prompts for each
   weak annotation.

Both questions test content that is taught earlier in the same module
(interleaving within the chapter, per the Retrieval Rule: Recall → Teach →
Apply → Recall).

`MISSING:` any 12-mark "explain why" or 16/20-mark "how far do you agree"
essay question **specifically about the Black Death**. Episode 1's three
identified 16/20-mark essays (Galen's ideas / the physician's importance /
the Church's role in lack of change) are about Strand 1–2 medieval medicine
generally and do not name the Black Death. If a future session wants to add a
higher-tariff essay to this episode, a plausible Edexcel-style stem (not yet
sourced/confirmed) would be in the family of *"The Black Death had a greater
impact on English society than on English medicine. How far do you agree?"*
— this is a **suggestion for sourcing**, not a confirmed past-paper question,
and must be verified against a real mark scheme before use.

## 3. Specification requirements

The only spec wording captured so far (from Episode 1's content file, itself
drawn from the Edexcel GCSE (9-1) History specification, Issue 6, June 2024,
Option 11 "Medicine in Britain, c1250–present") is the strand heading itself:

- **Strand 3 — Case study**: *"Dealing with the Black Death, 1348–49;
  approaches to treatment and attempts to prevent its spread."*

This is the full text captured for this strand — no further official spec
sub-bullets have been sourced in this session.

Sub-topics implied by this strand heading, cross-checked against what the
built module actually covers:

- **The arrival and spread of the Black Death in England, 1348–49**
  - Covered: ships docking at Melcombe (Dorset), June 1348; spread north to
    London by autumn 1348, swept the country by 1350, reached Scotland by
    1350; trade-route origin in central Asia (late 1330s) via Sicily/southern
    Europe (1347).
  - Covered: the actual transmission mechanism (trade ships → black rats →
    infected fleas → human bites → *Yersinia pestis*).
- **Contemporary (medieval) explanations of the cause of the Black Death**
  - Covered, and explicitly interleaved with Episode 1: God's punishment for
    sin, miasma (bad air), and planetary alignment (the Paris Medical
    Faculty's 1345 triple conjunction of Saturn, Jupiter and Mars).
- **Approaches to treatment during the Black Death**
  - Covered: bloodletting (Four Humours logic), prayer/fasting/confession,
    flagellation, burning aromatic herbs/posies (miasma logic).
- **Attempts to prevent its spread**
  - Covered (informally, as individual/folk responses): fleeing to the
    countryside (wealthy only), burning fires in streets, carrying posies.
  - `MISSING:` any **organised/civic or governmental** prevention measures
    (e.g. closing of public spaces, burial ordinances, restrictions on
    movement) — see "Government" gap in the Storyline section above. The
    spec phrase "attempts to prevent its spread" may extend beyond individual
    behaviours to institutional ones; this needs sourcing.
- **Significance / consequences of the Black Death**
  - Covered in depth: demographic collapse (1/3–1/2 of England's population),
    labour shortage → rising wages → challenge to feudalism → groundwork for
    the Peasants' Revolt of 1381; weakened Church authority; explicit
    "medicine barely changed" continuity argument.
  - `NOTE:` this consequences/significance material sits slightly outside the
    strict "approaches to treatment and prevention" wording of Strand 3 as
    captured — but it is exactly the kind of "patterns of change... factors
    inhibiting or encouraging change" content the spec requires across the
    whole option (per Episode 1's content file, "Additional spec framing"),
    and gives this episode its strongest essay material. Treat as core, not
    enrichment.

No `CONFLICT:` items identified. The `MISSING:` items above (organised
prevention measures; a named contemporary individual; a Black-Death-specific
higher-tariff essay question) are the sourcing checklist for a future
session.

## 4. Content reference pack

### Dates & timeline

- **1345** — the Paris Medical Faculty blames a triple conjunction of Saturn,
  Jupiter and Mars in Aquarius for the coming plague *(established in Episode
  1; re-used here as one of the three medieval explanations)*.
- **Late 1330s** — the Black Death possibly begins in central Asia.
- **1347** — the plague reaches Sicily and southern Europe via Mediterranean
  trade routes.
- **June 1348** — ships dock at **Melcombe** (Melcombe Regis, Dorset) —
  traditionally the first recorded landing point of the Black Death in
  England.
- **Autumn 1348** — the plague reaches London.
- **1349** — flagellant groups, having marched between towns publicly
  whipping themselves, are **condemned by the Church** for becoming "too
  large and too independent of priestly authority."
- **By 1350** — the plague has swept the whole of England and reached
  Scotland.
- **1348–1350 (overall)** — between one-third and one-half of England's
  population dies; an estimated 25 million people die across Europe (roughly
  one-third of its population) in around four years.
- **1381** — the Peasants' Revolt (downstream consequence of the labour
  shortage and weakened Church authority; not itself "taught" in this module
  but named as the outcome of the chain of effects).
- **1894** — Alexandre Yersin identifies *Yersinia pestis* in Hong Kong — 546
  years after the Black Death reached England, and the first time the actual
  cause is known.

### Key people

- **Geoffrey le Baker** — medieval chronicler. Quoted describing plague
  sailors arriving "with disease in their bodies"; used as a primary-source
  voice for the dock/arrival scene. Witnesses reported that those who spoke
  to or touched the sick quickly fell ill themselves.
- **Alexandre Yersin** — identified the *Yersinia pestis* bacterium in Hong
  Kong in 1894, ending 546 years of medieval (and post-medieval) ignorance
  about the true cause of the Black Death. Appears only as the "answer" to
  the chapter's central mystery, not as a medieval figure.
- **The Paris Medical Faculty** — *(established in Episode 1, reused here)*
  Europe's most respected medical institution officially blamed the 1345
  triple planetary conjunction for the plague — used to show that "planetary
  alignment" was mainstream, high-status medicine, not folk superstition.
- `MISSING:` any named medieval English individual (monarch, official,
  physician, or further chronicler) specific to the Black Death's arrival,
  spread, or societal aftermath in England. This is the clearest content gap
  for the "Individuals" agent of change in this episode.

### Key terms & definitions

- **Black Death** — the name given to the 1346–53 plague pandemic; in England
  specifically, the outbreak of 1348–50.
- ***Yersinia pestis*** — the bacterium that causes plague; carried by fleas
  that live on black rats; identified in 1894.
- **Bubonic plague** — swellings (buboes) in the groin and armpit, spread by
  flea bites. The most commonly depicted form in the module.
- **Pneumonic plague** — a lung infection, spread through the air (coughing).
- **Septicaemic plague** — blood poisoning; almost always fatal.
- **Buboes** — egg-sized, painful swellings in the lymph nodes (groin,
  armpit, or neck) — the hallmark visible symptom.
- **Miasma** — *(established in Episode 1)* bad/poisonous air believed to
  cause disease; reused here as the logic behind posies, burning fires, and
  avoiding "stinking" areas like plague pits.
- **Flagellants** — groups who marched between towns publicly whipping
  themselves as an act of penance, believing public suffering might earn
  God's forgiveness and lift the plague; the Church condemned flagellant
  groups in 1349 once they grew too large and independent.
- **Posies** — small bunches of sweet-smelling flowers/herbs (rosemary,
  lavender, rue were popular) carried to "counteract" miasma; physicians also
  recommended a vinegar- or herb-soaked sponge held to the nose.
- **Plague pits** — mass graves dug outside towns once normal burial rites
  became impossible due to the sheer number of dead.
- **Melcombe (Melcombe Regis)** — the Dorset port traditionally identified as
  the Black Death's first landing point in England, June 1348.
- **Feudal system / feudal labour obligations** — *(context for the
  aftermath)* the system binding peasants to a lord, unable to negotiate
  their own conditions — directly challenged once the labour shortage gave
  surviving peasants bargaining power.

### Case studies / named examples

- **"The dock at Melcombe" (interactive hotspot scene)** — five hotspots,
  each pairing a visible medieval detail with the hidden truth nobody could
  see at the time:
  - *The ship* — sailed from already-infected Mediterranean ports; trade
    routes connected England directly to the outbreak.
  - *The crew* — some sailors already showing symptoms (swellings, fever,
    blackened skin) on arrival; Geoffrey le Baker's "disease in their bodies"
    quote.
  - *The dock (Melcombe Regis, June 1348)* — the actual first-landing point;
    from here the plague spread to London by 1349 and Scotland by 1350.
  - *The cargo* — spices/cloth/silks from the east, blamed (via miasma) for
    "bad air," but really carrying something else entirely.
  - *The rat* — "everywhere but unnoticed"; no one connected dead rats to the
    sickness that followed; the true mechanism would stay hidden for another
    500 years.
- **"What would you believe?" (Agnes scenario, belief carousel)** — a
  first-person framing device: Agnes has the plague, her village is
  terrified, and the learner must pick an explanation with no microscope or
  germ theory available. Three options, each with its own internal logic, who
  believed it, and belief→response chain:
  - *God's punishment* → prayer, fasting, pilgrimage, flagellation.
  - *Miasma* → burning herbs, avoiding pits/sewers, carrying posies, opening
    windows.
  - *Planetary alignment* → consulting astrological charts, waiting for
    favourable star positions (cites the Paris Medical Faculty's 1345
    judgement).
- **"Plague treatments" (collection explorer)** — five tappable items, each
  with three layers of reveal: flagellants, posies and herbs, bloodletting,
  burning fires, fleeing the city. Synthesis: *"Every treatment was based on
  a wrong understanding of the cause... Wrong cause → wrong treatment. Every
  time."*
- **"A village in 1349" (visual narrative)** — a small-scale human-experience
  case study: a traveller arrives, the priest dies first, then the
  blacksmith; farmers abandon fields; landlords find no one to work the land;
  church bells ring almost without stopping because there are too many dead
  for individual funerals. Conclusion: *"For a year, normal life stopped. The
  world that emerged would look very different."*
- **Rich vs poor** — wealthy people could flee to the countryside (and
  sometimes escaped the fleas, though they could also carry infected fleas to
  new areas); the poor, crowded into towns and unable to leave, died in far
  greater numbers. Hundreds of English settlements were deserted entirely —
  evidence survives today as earthwork humps in fields.

### Causes & effects

- Trading ships from infected Mediterranean ports → carried black rats
  (with infected fleas hidden in cargo holds) → fleas bit humans once their
  rat hosts died → *Yersinia pestis* entered the human bloodstream → bubonic
  plague spread person to person through towns and villages.
- Bubonic plague progression (by day, per the module's `progressionTimeline`):
  Day 1–2 flea bite → Day 3–5 buboes form in lymph nodes → Day 5–7 high fever,
  chills, exhaustion → Day 7–10 black patches of dead tissue / internal
  bleeding → Day 10+ death (most victims) or survival (a small number,
  possibly natural immunity).
- Belief that disease = God's punishment for sin → flagellation, prayer,
  fasting, pilgrimage as responses → flagellant groups grow large enough that
  the Church itself condemns them in 1349 (the Church polices its *own*
  doctrine even mid-crisis).
- Belief in miasma *(Episode 1 concept, reused)* → posies/herbs carried, fires
  burned in streets, plague pits and sewers avoided.
- Belief in the Four Humours *(Episode 1 concept, reused)* → bloodletting
  continued during the plague, on the logic that "if the body was
  overwhelmed, excess of one humour might be responsible" — internally
  consistent, but weakened already-ill patients further.
- Wealth → ability to flee to the countryside → sometimes escaped infected
  fleas (helped by accident, not understanding) — but could also carry
  infected fleas to previously unaffected areas, spreading the plague
  further.
- Poverty → inability to flee → crowded conditions in towns → much higher
  death rates among the poor than the wealthy.
- One-third to one-half of England's population dies → severe labour
  shortage → surviving peasants gain bargaining power for the first time →
  peasants demand (and receive) higher wages and better conditions, moving
  between lords seeking the best deal → directly challenges the feudal system
  → contributes to the conditions behind the Peasants' Revolt of 1381.
- Clergy die in very high numbers (up to half in some areas), often because
  they stayed to tend the sick → the Church's promise that faith brings
  protection visibly fails → many people lose faith in the Church's spiritual
  authority → the Church's moral/institutional authority begins to crack
  (continuity point into later episodes' "challenges to old authority"
  theme).
- No germ theory / no understanding that fleas and rats were responsible →
  every treatment (prayer, posies, bloodletting, fires, flight) targets the
  *wrong* cause → none of it slows the plague → "wrong cause → wrong
  treatment, every time."
- Despite the scale of social change, medical theory after 1350 remains
  unchanged: the Four Humours stay the basis of university teaching;
  bloodletting, herbal remedies and prayer continue exactly as before → "the
  same theories and treatments continued for another 300 years" (continuity
  into the Renaissance, Episode 3+).

### Exam angles

**Two fully mark-schemed questions are already built into this module:**

1. **`guidedExamResponse` — "Describe two ways the Black Death spread through
   England. (4 marks)"**
   - Scaffolded into two sections: "Your first way" (starter: *"One way the
     Black Death spread through England was…"*) and "Your second way"
     (starter: *"Another way it spread was…"*).
   - Mark scheme: up to 2 marks per valid way, maximum 2 ways.
     - **Way A — Trade and shipping**: 1 mark for "ships brought the disease
       to England / it came from Europe by trade"; 2 marks for showing the
       mechanism with a named route/port, e.g. *"Trading ships arriving from
       Europe brought infected rats into English ports such as Melcombe."*
     - **Way B — Rats and fleas (biological transmission)**: 1 mark for
       "rats spread it / fleas bit people and made them ill"; 2 marks for the
       full flea→rat→human-bite chain with named detail (black rats /
       bacteria / *Yersinia pestis*), e.g. *"Fleas living on black rats
       carried the plague bacteria and passed it to humans through bites."*
     - **Other valid ways** (same 1/2 basis if developed with equivalent
       specific detail): person-to-person contact in crowded
       towns/markets/fairs; pneumonic spread via coughing/breathing infected
       air; overcrowding/poor sanitation **only if** linked to a specific
       transmission mechanism (not vague "dirtiness").
     - **Do NOT credit**: vague claims with no named mechanism ("people were
       dirty", "it spread quickly"); two restatements of the same method
       (counts as one way); generic "germs"/"disease" with no transmission
       route described.
     - **Exemplar 4/4 answer** (in module): *"Trading ships arriving from
       Europe brought infected rats into English ports such as Melcombe.
       Fleas living on black rats carried the plague bacteria and passed it
       to humans through bites."*

2. **`faceExaminer` (4-mark-explain) — "Explain one way religious beliefs
   affected responses to the Black Death. [4 marks]"**
   - Mark scheme: Level 2 (3–4 marks) = developed explanation linking
     religious belief to a specific treatment/response, with the full chain
     (belief → response → why it followed logically). Level 1 (1–2 marks) =
     simple identification of a religious response with little/no
     explanation of why it was chosen.
   - Creditable responses (any, if explained): prayer/fasting/pilgrimage
     (must explain *why* — belief that illness = God's punishment for sin);
     flagellants (must explain the religious logic — public suffering to earn
     God's mercy); priests tending the sick (must link to Christian duty and
     belief in God's will).
   - **Do NOT award** for identifying practices without explaining the
     religious reasoning.
   - Sample answer provided is a **2/4** ("partial") answer: *"People prayed
     during the Black Death because they thought God was angry with them.
     They believed praying would help stop the plague."* — annotated to show
     where it stays vague ("angry with them" → should be "God's punishment
     for humanity's sins"; "praying would help stop the plague" → restates
     rather than explains the logic of repentance/forgiveness).
   - `criteriaOptions` provided for self/peer marking: Named the response /
     Explained the belief / Linked belief to treatment / Used specific
     evidence / Developed explanation / Too vague / Repeats the question /
     Missing explanation.

**Built-in `examinerExplains` tips** (general exam technique, framed for this
episode specifically):

- *Identify, then explain* — a weak answer just names something ("people
  prayed", "wages went up"); a strong answer keeps going ("this meant
  that... which led to...").
- *Use precise evidence* — replace "lots of people died" with "around
  one-third of England's population died."
- *Know the actual cause — and contrast it* — examiners credit students who
  know *Yersinia pestis*/fleas/rats AND can contrast this with what medieval
  people actually believed at the time.
- *Separate social change from medical change* — the plague changed society
  (wages, Church authority) but barely changed medicine; mixing these up is
  named as "one of the most common ways students lose marks on 8-mark
  questions."

**Misconceptions worth a `MisconceptionCheck`** (each precise enough to write
a true/false statement from):

- "Medieval people knew that rats and fleas spread the Black Death." →
  **False** — the true mechanism was not discovered until 1894, 546 years
  later. Medieval people blamed God, miasma, or the stars.
- "Bloodletting and miasma-based responses were recognised as useless at the
  time." → **False** — *(reinforces an Episode 1 misconception)* these
  responses were logical and internally consistent given the Four
  Humours/miasma theories; they were not seen as failures by contemporaries.
- "The Black Death changed medicine significantly." → **False** — medicine
  (theory and treatment) stayed essentially the same for another ~300 years;
  it was **society** (wages, feudal relations, Church authority) that changed
  dramatically.
- "The Church approved of the flagellants." → **Needs nuance** — flagellant
  groups acted on mainstream "God's punishment" logic, but the Church
  condemned flagellant groups in 1349 once they grew too large and
  independent of priestly authority — i.e. the *belief* was orthodox, the
  *organised movement* was not tolerated.
- "Fleeing the city was a straightforwardly sensible response." → **Needs
  nuance** — it sometimes worked by accident (leaving fleas behind), but
  fleeing people could also carry infected fleas with them and spread the
  plague to new, previously unaffected areas. The poor could not flee at all,
  and died at far higher rates.

### Sourcing notes

- All facts above are drawn from the already-built `history-medicine-black-
  death` module (`src/modules.js:1348–2325`), which is marked "Built and
  aligned" in `HISTORY_SERIES_MAP.md`.
- The only directly-quoted Edexcel spec text is the Strand 3 heading, captured
  in Episode 1's content file (`01_Trust_Me_Im_Following_Jupiter_Content.md`,
  Section 3): *"Dealing with the Black Death, 1348–49; approaches to treatment
  and attempts to prevent its spread."*
- No PDF/past-paper extraction was performed for this episode in this
  session (unlike Episode 1, which used `pdftotext -layout` against several
  source PDFs). The three `MISSING:` items flagged in Section 3 above
  (organised/governmental prevention measures; a named contemporary
  individual; a Black-Death-specific higher-tariff essay question) are the
  sourcing checklist for a future session, should a deeper rebuild of this
  episode be undertaken.
