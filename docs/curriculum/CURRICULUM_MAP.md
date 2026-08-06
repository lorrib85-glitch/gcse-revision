# Curriculum map

> **GENERATED FILE — do not edit.**
> Source: `src/curriculum-catalogue/records/`, rendered by
> `scripts/generate-curriculum-catalogue.mjs`. Run `pnpm curriculum:generate`
> after changing a record; `pnpm curriculum:check` fails if this file has drifted.

Boards, specifications, papers and assessment objectives live in
`SPECIFICATION_CATALOGUE.md`, generated from the same records.

**8** subjects · **14** study pathways · **36** modules · **65** chapters (**30** available, **35** planned)

**59** canonical content bindings — one generated loader for every chapter with a contentPath.

The canonical learner runtime is generated separately from these records plus
Learning Sequence configuration and derived Chapter screen metadata.

## Subjects

A subject is a stable academic discipline. It owns no specification, no module and
no chapter — coverage runs the other way. `themeKey` **references**
`src/constants/subjects.js`; the palette is not the identity, which is why two
subjects can share one theme.

| Subject | Title | Theme key | Status | Resolves persisted | Unattributed |
|---|---|---|---|---|---|
| `mathematics` | Maths | `Maths` | active | `Maths` | — |
| `biology` | Biology | `Biology` | active | `Biology` | — |
| `chemistry` | Chemistry | `Chemistry` | planned | `Chemistry` | — |
| `physics` | Physics | `Physics` | planned | `Physics` | — |
| `history` | History | `History` | active | `History` | — |
| `english-language` | English language | `English` | planned | — | `English` |
| `english-literature` | English literature | `English` | active | — | `English` |
| `sociology` | Sociology | `Sociology` | active | `Sociology` | — |

**Unattributed progress names** — `English`. Persisted before the subjects were separated, so no rule can recover which one a row
meant. Listed by every candidate subject precisely so all of them decline it: the
rows stay stored, stay readable and count toward no subject average. Guessing would
fabricate learner data, and fabricated progress is worse than absent progress.

## Study pathways

A pathway is the exact route a learner follows: one specification, one tier, and the
choices a school made. Tier lives here and nowhere else — moving Foundation → Higher
changes the pathway, and every chapter already finished keeps its progress.

| Pathway | Specification | Tier | Modules | Status |
|---|---|---|---:|---|
| `aqa-biology-8461-foundation` | GCSE Biology | foundation | 6 | ● active |
| `aqa-biology-8461-higher` | GCSE Biology | higher | 6 | ● active |
| `aqa-chemistry-8462-foundation` | GCSE Chemistry | foundation | 1 | ○ planned |
| `aqa-chemistry-8462-higher` | GCSE Chemistry | higher | 1 | ○ planned |
| `aqa-combined-science-8464-foundation` | GCSE Combined Science: Trilogy | foundation | 11 | ● active |
| `aqa-combined-science-8464-higher` | GCSE Combined Science: Trilogy | higher | 11 | ● active |
| `aqa-english-language-8700` | GCSE English Language | untiered | 4 | ○ planned |
| `aqa-english-literature-8702-macbeth-inspector` | GCSE English Literature | untiered | 2 | ● active |
| `aqa-maths-8300-foundation` | GCSE Mathematics | foundation | 6 | ● active |
| `aqa-maths-8300-higher` | GCSE Mathematics | higher | 7 | ● active |
| `aqa-physics-8463-foundation` | GCSE Physics | foundation | 5 | ○ planned |
| `aqa-physics-8463-higher` | GCSE Physics | higher | 5 | ○ planned |
| `aqa-sociology-8192` | GCSE Sociology | untiered | 6 | ● active |
| `pearson-edexcel-history-1hi0-medicine-spain-elizabethan-usa` | Pearson Edexcel Level 1/Level 2 GCSE (9–1) in History | untiered | 5 | ● active |

### Selections

The specification states what must be chosen; the pathway states what was chosen.
`—` is a **stated absence**: the group is required and nothing has been chosen for
it. An omitted row would be a forgotten question instead.

| Pathway | Selection group | Chosen |
|---|---|---|
| `Literature` | `shakespeare-text` | `macbeth` |
| `Literature` | `nineteenth-century-novel` | — |
| `Literature` | `modern-text` | `an-inspector-calls` |
| `Literature` | `poetry-anthology-cluster` | — |
| `History` | `thematic-study-and-historic-environment` | `medicine-and-western-front` |
| `History` | `period-study` | `spain-new-world` |
| `History` | `british-depth-study` | `early-elizabethan-england` |
| `History` | `modern-depth-study` | `usa-conflict` |

## Module reuse

A module is defined once and **referenced**. Two pathways using it is never a reason
to define it twice, and a module mapped into two specifications is how Combined
Science and Triple Science share the same Biology teaching without either owning it.

| Module | Referenced by | Mapped into |
|---|---|---|
| `biology-aqa-cell-biology` | Biology (F), Biology (H), Combined (F), Combined (H) | GCSE Combined Science: Trilogy · GCSE Biology |
| `biology-aqa-ecology` | Biology (F), Biology (H), Combined (F), Combined (H) | GCSE Combined Science: Trilogy · GCSE Biology |
| `biology-aqa-homeostasis` | Biology (F), Biology (H), Combined (F), Combined (H) | GCSE Combined Science: Trilogy · GCSE Biology |
| `biology-aqa-infection-and-response` | Biology (F), Biology (H), Combined (F), Combined (H) | GCSE Combined Science: Trilogy · GCSE Biology |
| `biology-aqa-inheritance-variation-evolution` | Biology (F), Biology (H), Combined (F), Combined (H) | GCSE Combined Science: Trilogy · GCSE Biology |
| `biology-aqa-organisation` | Biology (F), Biology (H), Combined (F), Combined (H) | GCSE Combined Science: Trilogy · GCSE Biology |
| `chemistry-aqa-atomic-structure` | Chemistry (F), Chemistry (H), Combined (F), Combined (H) | GCSE Combined Science: Trilogy · GCSE Chemistry |
| `maths-aqa-algebra` | Maths (F), Maths (H) | GCSE Mathematics |
| `maths-aqa-geometry-measures` | Maths (F), Maths (H) | GCSE Mathematics |
| `maths-aqa-number` | Maths (F), Maths (H) | GCSE Mathematics |
| `maths-aqa-probability` | Maths (F), Maths (H) | GCSE Mathematics |
| `maths-aqa-ratio-proportion` | Maths (F), Maths (H) | GCSE Mathematics |
| `maths-aqa-statistics` | Maths (F), Maths (H) | GCSE Mathematics |
| `physics-aqa-energy` | Combined (F), Combined (H), Physics (F), Physics (H) | GCSE Combined Science: Trilogy · GCSE Physics |
| `physics-aqa-forces-motion` | Combined (F), Combined (H), Physics (F), Physics (H) | GCSE Combined Science: Trilogy · GCSE Physics |
| `physics-aqa-matter-particles` | Combined (F), Combined (H), Physics (F), Physics (H) | GCSE Combined Science: Trilogy · GCSE Physics |
| `physics-aqa-space` | Physics (F), Physics (H) | GCSE Physics |
| `physics-aqa-waves-electricity` | Combined (F), Combined (H), Physics (F), Physics (H) | GCSE Combined Science: Trilogy · GCSE Physics |

## Modules and chapters

Ordering lives on the **relationship**, never on the entity: a chapter's position is
a property of the module reference that includes it. `●` available · `○` planned.

**Status and content are independent columns because they answer different**
**questions.** Status is whether a learner may open the chapter; content is whether a
source file exists for it today. Most planned chapters below have a real content file
that currently returns zero screens — that is why the loader registry has more
entries than there are available chapters. A file appearing never promotes a chapter;
only its status does.

### Maths

#### ● Number

`maths-aqa-number` · active · 8 chapters (8 available)

Place value, the four operations, negatives, BIDMAS, rounding, factors, powers and fractions.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | Place value and number sense | `math1` | ● available | `src/content/maths/foundations/episodes/math1.js` |
| 2 | The four operations | `math2` | ● available | `src/content/maths/foundations/episodes/math2.js` |
| 3 | Negative numbers without panic | `math3` | ● available | `src/content/maths/foundations/episodes/math3.js` |
| 4 | BIDMAS and calculator control | `math4` | ● available | `src/content/maths/foundations/episodes/math4.js` |
| 5 | Rounding, estimating and checking | `math5` | ● available | `src/content/maths/foundations/episodes/math5.js` |
| 6 | Factors, multiples and primes | `math6` | ● available | `src/content/maths/foundations/episodes/math6.js` |
| 7 | Powers, roots and standard form | `math7` | ● available | `src/content/maths/foundations/episodes/math7.js` |
| 8 | Fractions that actually make sense | `math8` | ● available | `src/content/maths/foundations/episodes/math8.js` |

#### ○ Algebra

`maths-aqa-algebra` · planned · 0 chapters

Expressions, equations, sequences and graphs.

_Planned. No chapters are invented to fill it._

#### ○ Ratio, proportion and rates of change

`maths-aqa-ratio-proportion` · planned · 0 chapters

Ratio, percentages, compound measures and direct and inverse proportion.

_Planned. No chapters are invented to fill it._

#### ○ Geometry and measures

`maths-aqa-geometry-measures` · planned · 0 chapters

Angles, shape properties, area and volume, transformations, Pythagoras and trigonometry.

_Planned. No chapters are invented to fill it._

#### ○ Probability

`maths-aqa-probability` · planned · 0 chapters

Probability scales, tree diagrams, Venn diagrams and relative frequency.

_Planned. No chapters are invented to fill it._

#### ○ Statistics

`maths-aqa-statistics` · planned · 0 chapters

Sampling, averages, spread and the charts that carry them.

_Planned. No chapters are invented to fill it._

#### ○ Higher algebra extension

`maths-aqa-higher-algebra-extension` · planned · 0 chapters

The algebra the Higher tier adds: algebraic fractions, iteration, functions and proof.

_Planned. No chapters are invented to fill it._

### Biology

#### ● Cell biology

`biology-aqa-cell-biology` · active · 3 chapters (2 available)

Cell structure, microscopy, transport and cell division.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | Building blocks | `bio_building_blocks` | ● available | `src/content/biology/cell-biology/episodes/bio_building_blocks.js` |
| 2 | Plant Cells & Photosynthesis | `sci_bio_w1` | ● available | `src/content/biology/cell-biology/episodes/sci_bio_w1.js` |
| 3 | Building Life | `bio_building_life` | ○ planned | `src/content/biology/organisation/episodes/bio_building_life.js` |

#### ○ Organisation

`biology-aqa-organisation` · planned · 1 chapter (0 available)

Tissues, organs and the digestive, circulatory and respiratory systems.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | The Human Machine | `bio_human_machine` | ○ planned | `src/content/biology/organisation/episodes/bio_human_machine.js` |

#### ○ Infection and response

`biology-aqa-infection-and-response` · planned · 1 chapter (0 available)

Pathogens, the immune response, vaccination and drug development.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | Disease Wars | `bio_disease_wars` | ○ planned | `src/content/biology/infection-and-response/episodes/bio_disease_wars.js` |

#### ○ Homeostasis and response

`biology-aqa-homeostasis` · planned · 1 chapter (0 available)

The nervous system, hormonal control and how the body holds itself steady.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | Control Systems | `bio_control_systems` | ○ planned | `src/content/biology/homeostasis/episodes/bio_control_systems.js` |

#### ○ Inheritance, variation and evolution

`biology-aqa-inheritance-variation-evolution` · planned · 1 chapter (0 available)

DNA, inheritance, variation, natural selection and selective breeding.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | Genetics & Evolution | `bio_genetics_evolution` | ○ planned | `src/content/biology/inheritance-variation-evolution/episodes/bio_genetics_evolution.js` |

#### ○ Ecology

`biology-aqa-ecology` · planned · 1 chapter (0 available)

Adaptation, food chains, cycles, biodiversity and human impact.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | Ecosystems | `bio_ecosystems_group` | ○ planned | `src/content/biology/ecology/episodes/bio_ecosystems_group.js` |

### Chemistry

#### ○ Atomic structure and the periodic table

`chemistry-aqa-atomic-structure` · planned · 0 chapters

Atoms, elements, compounds and the structure of the periodic table.

_Planned. No chapters are invented to fill it._

### Physics

#### ○ Energy

`physics-aqa-energy` · planned · 0 chapters

AQA Physics · Topic 1

_Planned. No chapters are invented to fill it._

#### ○ Matter and particles

`physics-aqa-matter-particles` · planned · 0 chapters

AQA Physics · Topic 3 & 4

_Planned. No chapters are invented to fill it._

#### ○ Forces and motion

`physics-aqa-forces-motion` · planned · 0 chapters

AQA Physics · Topic 5 & 6

_Planned. No chapters are invented to fill it._

#### ○ Waves and electricity

`physics-aqa-waves-electricity` · planned · 0 chapters

AQA Physics · Topic 6 & 2

_Planned. No chapters are invented to fill it._

#### ○ Space

`physics-aqa-space` · planned · 0 chapters

AQA Physics · Topic 8

_Planned. No chapters are invented to fill it._

### History

#### ● Medicine through time

`history-edexcel-medicine-britain` · active · 14 chapters (13 available)

The thematic study: c1250 to the present, and what changed medicine at each turn.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | Trust me, I'm Following Jupiter | `history-medicine-medieval-beliefs-causes` | ● available | `src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.runtime.js` |
| 2 | The day everything changed | `history-medicine-black-death` | ● available | `src/content/history/medicine/episodes/episode-02-black-death.js` |
| 3 | The beginning of doubt | `history-medicine-vesalius-beginning-doubt` | ● available | `src/content/history/medicine/episodes/episode-03-vesalius-beginning-doubt.js` |
| 4 | The man who proved everyone wrong | `history-medicine-harvey-pare-renaissance-method` | ● available | `src/content/history/medicine/episodes/episode-04-harvey-pare-renaissance-method.js` |
| 5 | London's year of terror | `history-medicine-great-plague-1665` | ● available | `src/content/history/medicine/episodes/episode-05-great-plague-1665.js` |
| 6 | Surgery & anatomy | `history-medicine-surgery-anaesthetics` | ● available | `src/content/history/medicine/episodes/episode-04-surgery-anaesthetics.js` |
| 7 | The boy, the cow and the cure | `history-medicine-jenner-vaccination` | ● available | `src/content/history/medicine/episodes/episode-06-jenner-vaccination.js` |
| 8 | The invisible enemy | `history-medicine-germ-theory` | ● available | `src/content/history/medicine/episodes/episode-07-germ-theory.js` |
| 9 | The great stink | `history-medicine-great-stink` | ● available | `src/content/history/medicine/episodes/episode-08-great-stink.js` |
| 10 | The day surgery changed forever | `history-medicine-surgery-revolution` | ● available | `src/content/history/medicine/episodes/episode-09-surgery-revolution.js` |
| 11 | The lady with the lamp | `history-medicine-nightingale` | ○ planned | `src/content/history/medicine/episodes/episode-10-nightingale.js` |
| 12 | The accidental miracle | `history-medicine-accidental-miracle` | ● available | `src/content/history/medicine/episodes/episode-11-accidental-miracle.js` |
| 13 | When medicine became magic | `history-medicine-modern-medicine` | ● available | `src/content/history/medicine/episodes/episode-12-when-medicine-became-magic.js` |
| 14 | Can we beat cancer? | `history-medicine-cancer` | ● available | `src/content/history/medicine/episodes/episode-13-can-we-beat-cancer.js` |

#### ● The British sector of the Western Front

`history-edexcel-western-front` · active · 1 chapter (1 available)

The historic environment: injuries, treatment and the chain of evacuation, 1914–18.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | Hell in the trenches | `history-medicine-western-front` | ● available | `src/content/history/medicine/episodes/episode-14-western-front.js` |

#### ○ Spain and the new world, c1490–c1555

`history-edexcel-spain-new-world` · planned · 10 chapters (0 available)

The period study: Columbus, the conquistadors, the fall of the Aztecs and the silver economy.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | The man who wanted to sail west | `spain-new-world-1` | ○ planned | `src/content/history/spain-new-world/episodes/spain-new-world-1.js` |
| 2 | A new world | `spain-new-world-2` | ○ planned | `src/content/history/spain-new-world/episodes/spain-new-world-2.js` |
| 3 | Gold, God and empire | `spain-new-world-3` | ○ planned | `src/content/history/spain-new-world/episodes/spain-new-world-3.js` |
| 4 | The Conquistadors | `spain-new-world-4` | ○ planned | `src/content/history/spain-new-world/episodes/spain-new-world-4.js` |
| 5 | The fall of the Aztecs | `spain-new-world-5` | ○ planned | `src/content/history/spain-new-world/episodes/spain-new-world-5.js` |
| 6 | What the Spanish left behind | `spain-new-world-6` | ○ planned | `src/content/history/spain-new-world/episodes/spain-new-world-6.js` |
| 7 | The last Inca Emperor | `spain-new-world-7` | ○ planned | `src/content/history/spain-new-world/episodes/spain-new-world-7.js` |
| 8 | The conquest of Peru | `spain-new-world-8` | ○ planned | `src/content/history/spain-new-world/episodes/spain-new-world-8.js` |
| 9 | How to rule an empire | `spain-new-world-9` | ○ planned | `src/content/history/spain-new-world/episodes/spain-new-world-9.js` |
| 10 | Silver changed everything | `spain-new-world-10` | ○ planned | `src/content/history/spain-new-world/episodes/spain-new-world-10.js` |

#### ○ Early Elizabethan England, 1558–88

`history-edexcel-early-elizabethan` · planned · 0 chapters

The British depth study: settlement, plots, Mary Queen of Scots and the Armada.

_Planned. No chapters are invented to fill it._

#### ○ The USA, 1954–75: conflict at home and abroad

`history-edexcel-usa-conflict` · planned · 12 chapters (0 available)

The modern depth study: civil rights at home and the war in Vietnam.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | Separate and unequal | `usa-segregation` | ○ planned | `src/content/history/usa/episodes/usa-segregation.js` |
| 2 | The girl who walked into history | `usa-brown-v-board` | ○ planned | `src/content/history/usa/episodes/usa-brown-v-board.js` |
| 3 | The woman who stayed seated | `usa-rosa-parks` | ○ planned | `src/content/history/usa/episodes/usa-rosa-parks.js` |
| 4 | Standing up, sitting down | `usa-sit-ins` | ○ planned | `src/content/history/usa/episodes/usa-sit-ins.js` |
| 5 | I have a dream | `usa-i-have-a-dream` | ○ planned | `src/content/history/usa/episodes/usa-i-have-a-dream.js` |
| 6 | By any means necessary | `usa-malcolm-x` | ○ planned | `src/content/history/usa/episodes/usa-malcolm-x.js` |
| 7 | How much had really changed? | `usa-how-much-changed` | ○ planned | `src/content/history/usa/episodes/usa-how-much-changed.js` |
| 8 | Why America went to Vietnam | `usa-why-vietnam` | ○ planned | `src/content/history/usa/episodes/usa-why-vietnam.js` |
| 9 | America's war | `usa-americas-war` | ○ planned | `src/content/history/usa/episodes/usa-americas-war.js` |
| 10 | Can you win a guerrilla war? | `usa-guerrilla-war` | ○ planned | `src/content/history/usa/episodes/usa-guerrilla-war.js` |
| 11 | The war comes home | `usa-war-comes-home` | ○ planned | `src/content/history/usa/episodes/usa-war-comes-home.js` |
| 12 | The long way out | `usa-long-way-out` | ○ planned | `src/content/history/usa/episodes/usa-long-way-out.js` |

### English language

#### ○ Reading fiction

`english-language-aqa-reading-fiction` · planned · 0 chapters

Reading an unseen literature-fiction extract for language, structure and effect.

_Planned. No chapters are invented to fill it._

#### ○ Creative writing

`english-language-aqa-creative-writing` · planned · 0 chapters

Descriptive and narrative writing to a prompt or an image.

_Planned. No chapters are invented to fill it._

#### ○ Reading non-fiction

`english-language-aqa-reading-non-fiction` · planned · 0 chapters

Comparing two unseen non-fiction texts from different centuries.

_Planned. No chapters are invented to fill it._

#### ○ Viewpoint writing

`english-language-aqa-viewpoint-writing` · planned · 0 chapters

Writing to present a point of view for a stated form, purpose and audience.

_Planned. No chapters are invented to fill it._

### English literature

#### ● Macbeth

`english-lit-aqa-macbeth` · active · 4 chapters (1 available)

The Shakespeare text: power, ambition, guilt, fate and appearance against reality.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | Power and ambition | `english-macbeth-power-ambition` | ● available | `src/content/english/macbeth/episodes/english-macbeth-power-ambition.js` |
| 2 | Out, damned spot | `english-macbeth-guilt-consequence` | ○ planned | — |
| 3 | Double, double, toil and trouble | `english-macbeth-witches-fate` | ○ planned | — |
| 4 | Fair is foul, foul is fair | `english-macbeth-appearance-reality` | ○ planned | — |

#### ○ An Inspector Calls

`english-lit-aqa-inspector-calls` · planned · 3 chapters (0 available)

Priestley's modern text: social responsibility, denial and consequence.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | We are members of one body | `english-inspector-calls-social-message` | ○ planned | — |
| 2 | I accept no blame | `english-inspector-calls-responsibility-denial` | ○ planned | — |
| 3 | Fire, blood and anguish | `english-inspector-calls-consequences-resolution` | ○ planned | — |

### Sociology

#### ● Key concepts and approaches

`sociology-aqa-key-concepts` · active · 3 chapters (3 available)

Culture, norms, values, socialisation and the sociological approaches that run through both papers.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | What Even is Sociology? | `soc1` | ● available | `src/content/sociology/families/episodes/soc1.js` |
| 2 | Marxism vs Functionalism | `soc2` | ● available | `src/content/sociology/families/episodes/soc2.js` |
| 3 | Feminism, Power & Life Chances | `soc3` | ● available | `src/content/sociology/families/episodes/soc3.js` |

#### ● Families

`sociology-aqa-families` · active · 2 chapters (2 available)

Family forms, roles, relationships and the researchers who disagree about them.

| # | Chapter | Id | Status | Content |
|---:|---|---|---|---|
| 1 | Family & Households | `soc4` | ● available | `src/content/sociology/families/episodes/soc4.js` |
| 2 | Family Researchers & Theory Battles | `soc6` | ● available | `src/content/sociology/families/episodes/soc6.js` |

#### ○ Education

`sociology-aqa-education` · planned · 0 chapters

The role of education, achievement and the processes inside schools.

_Planned. No chapters are invented to fill it._

#### ○ Crime and deviance

`sociology-aqa-crime-deviance` · planned · 0 chapters

Explanations of crime, social control and the patterns in who is criminalised.

_Planned. No chapters are invented to fill it._

#### ○ Social stratification

`sociology-aqa-social-stratification` · planned · 0 chapters

Class, wealth, power, life chances and social mobility.

_Planned. No chapters are invented to fill it._

#### ○ Research methods

`sociology-aqa-research-methods` · planned · 0 chapters

Sampling, methods, ethics and evaluating a study — assessed across both papers.

_Planned. No chapters are invented to fill it._

## Legacy and placeholder treatment

### Placeholder cards that became chapters

These were coming-soon cards synthesised by the browser. They are now planned
canonical Chapter records with stable semantic ids. No progress alias exists because
the old cards were never openable and therefore never stored learner progress.

| Retired card | Canonical chapter | Title |
|---|---|---|
| `cs_macbeth_2` | `english-macbeth-guilt-consequence` | Out, damned spot |
| `cs_macbeth_3` | `english-macbeth-witches-fate` | Double, double, toil and trouble |
| `cs_macbeth_4` | `english-macbeth-appearance-reality` | Fair is foul, foul is fair |
| `cs_inspector_1` | `english-inspector-calls-social-message` | We are members of one body |
| `cs_inspector_2` | `english-inspector-calls-responsibility-denial` | I accept no blame |
| `cs_inspector_3` | `english-inspector-calls-consequences-resolution` | Fire, blood and anguish |

### Superseded Renaissance progress ids

The former hidden bundle is no longer a Chapter or loader. Both historical ids map
directly to the real canonical replacement, preserving old learner progress without
keeping a compatibility-shaped curriculum row.

- `mod2` → `history-medicine-vesalius-beginning-doubt`
- `history-medicine-renaissance-medicine` → `history-medicine-vesalius-beginning-doubt`

Every other historical Chapter id is preserved verbatim because it backs a live
`gcse_chapter_<id>` progress key. A tidier id is not worth a learner’s progress.

