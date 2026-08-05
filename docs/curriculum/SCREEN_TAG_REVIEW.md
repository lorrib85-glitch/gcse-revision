# screenTags — review report

> **GENERATED FILE — do not edit.**
> Written by `scripts/generate-curriculum-projections.mjs`.
> Run `pnpm curriculum:projections:report` to refresh it.

**This report changes nothing.** The Stage 3 projection derives `screenTags` from
the content files exactly, and is byte-equal to the hand-authored runtime. What
follows is a list of *potential* corrections for review.

Applying any of them would move a recovery route from one screen to another,
which a learner sees. That belongs to the Topic/recovery migration, not to a
stage whose promise is that behaviour is preserved.

**60** projected chapters · **21** carry at least one screen tag · **60** distinct tags

## 1. Chapters with content but no recovery route

Every screen tag is `null`, so nothing can route into these chapters. A weakness
in one of them has no "fix this gap" destination beyond screen 0.

| Chapter | Subject | Screens |
|---|---|---|
| `history-medicine-surgery-revolution` | History | 10 |
| `history-medicine-modern-medicine` | History | 9 |
| `history-medicine-cancer` | History | 11 |
| `bio_building_blocks` | Biology | 14 |
| `sci_bio_w1` | Biology | 9 |
| `soc1` | Sociology | 12 |
| `soc2` | Sociology | 17 |
| `soc3` | Sociology | 12 |
| `soc4` | Sociology | 12 |
| `soc6` | Sociology | 12 |

## 2. Tags claimed by more than one chapter

A route resolving to two chapters resolves to neither in a stable way — the
destination depends on iteration order.

| Tag | Chapters |
|---|---|
| `plague-explanations` | `history-medicine-black-death`, `history-medicine-great-plague-1665` |
| `vesalius` | `history-medicine-renaissance-medicine`, `history-medicine-vesalius-beginning-doubt` |

## 3. Tags repeated within one chapter

The first occurrence wins, so every later screen carrying the tag is unreachable
by that route.

| Chapter | Tag | Screens |
|---|---|---|
| `history-medicine-western-front` | `source-follow-up` | 2 |
| `history-medicine-western-front` | `describe-two-features` | 2 |
| `history-medicine-western-front` | `source-utility-exam` | 2 |
| `math1` | `maths:place-value` | 4 |
| `math1` | `maths:ordering-numbers` | 3 |
| `math2` | `maths:four-operations` | 6 |
| `math2` | `maths:written-methods` | 2 |
| `math3` | `maths:negative-numbers` | 7 |
| `math3` | `maths:ordering-negatives` | 2 |
| `math4` | `maths:bidmas` | 6 |
| `math4` | `maths:calculator-control` | 2 |
| `math5` | `maths:significant-figures` | 3 |
| `math5` | `maths:rounding` | 4 |
| `math5` | `maths:estimation` | 3 |
| `math6` | `maths:prime-numbers` | 3 |
| `math6` | `maths:prime-factorisation` | 2 |
| `math6` | `maths:hcf-lcm` | 4 |
| `math7` | `maths:standard-form` | 6 |
| `math7` | `maths:indices` | 2 |
| `math8` | `maths:equivalent-fractions` | 2 |
| `math8` | `maths:simplifying-fractions` | 3 |
| `math8` | `maths:fractions-of-amounts` | 3 |

## 4. Vocabulary split

Two spellings are in use. Namespaced tags (`maths:indices`) can be matched to a
learning-graph concept; bare tags (`four-humours`) cannot, so they can only be
routed by the hand-maintained `tagChapterMap`, which Stage 6 deletes.

- **22** namespaced · **38** bare

Bare tags, alphabetically:

- `anaesthetics`
- `antiseptic-surgery`
- `blood-transfusions`
- `chain-of-evacuation`
- `chain-of-evacuation-recall`
- `core-takeaway`
- `describe-two-features`
- `four-humours`
- `galen`
- `germ-theory`
- `great-plague`
- `harvey`
- `john-snow`
- `koch`
- `magic-bullet`
- `medical-developments`
- `medical-developments-recall`
- `medieval-practitioners`
- `miasma`
- `pare`
- `pasteur`
- `penicillin`
- `plague-comparison`
- `plague-explanations`
- `printing-press`
- `prior-knowledge-western-front`
- `public-health`
- `source-follow-up`
- `source-utility`
- `source-utility-exam`
- `thomas-splint`
- `trench-conditions`
- `trench-conditions-recall`
- `vaccination`
- `vesalius`
- `western-front-context`
- `western-front-core-recall`
- `wwi-medicine`

