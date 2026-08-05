# Stage 5 navigation decisions

Settled decisions carry the evidence that settled them. Open ones carry a
default and an owner, and are **not** implemented.

---

## Settled

### D-5-1 — a browser destination is not a subject

**Decided:** the browser destination is its own build-time entity, configured in
`src/curriculum-catalogue/navigation/`, outside the six curriculum types.

**Because:** canonical English is two subjects and the browser has one English
destination. Any subject-keyed projection produces either two English tiles (a
visible change) or one tile that merges two academic identities (a modelling lie
that would reach progress attribution, where `'English'` is already an
unattributed legacy string). Combined Science makes it worse in the other
direction: one pathway reaches three destinations.

**Rejected:** adding `browsable` to subject records — forbidden by OD-8 and by
the schema's `REJECTED_FIELDS` since Stage 0; visibility is derived, never
authored.

### D-5-2 — the browser is configured from pathways, not inferred from them

**Decided:** each entry names its `pathwayIds` explicitly.

**Because:** OD-8 requires "included in the navigation configuration", and there
was no configuration. Inferring from "any non-retired pathway" adds an eighth
tile — `aqa-english-language-8700` is `planned`, not retired, and holds four
`english-language` modules. Seven destinations must be preserved, so the
configuration is the artefact that preserves them.

### D-5-3 — the printed card number is browser presentation, carried verbatim

**Decided:** the projection carries the number the browser prints today, via an
explicit override table on the navigation entry. The default rule is *index
within the section, + 1*; 17 cards override it.

**Because — measured, not assumed:**

| Candidate rule | Cards it gets wrong |
|---|---|
| canonical `position + 1` | 24 of 71 |
| index within the section `+ 1` | 17 of 71 |

No rule reproduces it. `history-medicine-surgery-anaesthetics` prints `4` at
position 5; `soc6` prints `6` at position 1; `history-medicine-western-front`
prints `14` at position 0 of its own module; two cards print `4` in medicine and
two print `2` in Biology.

**This overrides the parent `DESIGN.md` §5.2**, which proposed deriving
`number` from `position + 1` and described that as *"retires the three
collisions of A-3"*. That is a **deliberate learner-visible correction**, and
Stage 5A is behaviour-preserving. It is therefore reported here rather than
silently taken, and deferred to D-5-6.

**Honest accounting:** these 17 values duplicate what
`compatibility/runtime-v1.js` holds in `chapterFields.number`. They are *not*
read from it — the navigation generator never imports the compatibility
projection, and the two die at different times. `chapterFields.number` dies at
Stage 6 with the legacy `CHAPTERS` row; the browser override dies when D-5-6 is
decided. Overlapping values with different owners and different death dates are
two facts, not one duplicated fact — but the overlap is the reason the override
table is declared temporary and must shrink to nothing.

### D-5-4 — the subject title and the tile title are different fields

**Decided:** subject record `title` stays `History`. The browser entry title is
`Medicine through time`.

**Because:** the tile names what is behind it; the subject names the discipline.
When Spain, Elizabethan England and the USA have content, the entry title
changes and the subject record does not. That divergence is the test that the
split is in the right place. Collapsing them would either rename the subject
(false) or rename the tile (a visible change).

### D-5-5 — three Physics card labels are carried as overrides

**Decided:** `Forces & Motion`, `Waves & Electricity` and `Matter & Particles`
are carried as explicit label overrides on their module cards.

**Because:** the canonical module titles are `Forces and motion`, `Waves and
electricity` and `Matter and particles`. Adopting them changes visible copy on
three cards, which Stage 5A forbids. `Energy` and `Space` need no override, and
all five subtitles already match the module `shortDescription` exactly.

Retirement: deleted when D-5-7 is decided.

### D-5-6 — Foundation and Higher may be merged only when identical

**Decided:** an entry may configure both tiers of a pathway pair. The generator
deduplicates identical module identities and **fails** if the two projected
module sequences differ.

**Applied:** Biology (6 modules, identical), Physics (5, identical) and
Chemistry (1, identical) configure both tiers. **Maths configures Foundation
only**, because `aqa-maths-8300-higher` adds `maths-aqa-higher-algebra-extension`
and the sequences diverge — showing the union would surface a Higher-only module
to a Foundation learner, and showing the intersection would hide it from a
Higher one. The generator refuses to guess; the configuration states the choice.

---

## Open — defaulted, not implemented

### OD-5-A — should the printed card number be corrected?

Correcting it moves 17 cards' numbers and removes two collisions. It is a
learner-visible copy change and belongs to its own reviewed commit, not to a
migration stage.

**Default until decided:** carry the current numbers (D-5-3).
**Owner:** product.

### OD-5-B — should the Physics card labels adopt the canonical module titles?

Three labels differ only in `&` versus `and` and in capitalisation.

**Default until decided:** carry the current labels (D-5-5).
**Owner:** product.

### OD-5-C — should the wrong English tab hero images be fixed?

The Macbeth tab shows the Medicine artwork and the An Inspector Calls tab shows
the Sociology family artwork (census A-9). Both are reproduced exactly, wrong
and all.

**Default until decided:** reproduce them.
**Owner:** product. This is a content decision made *visible* by the migration,
not caused by it.

### OD-5-D — should English Language become a second destination or a tab?

`aqa-english-language-8700` holds four `planned` modules with no chapters and no
browser presence.

**Default until decided:** not configured. Adding it later is `pathwayIds` plus
sections.
**Owner:** product.

---

## Explicitly not settled here, and not touched

These are the parent plan's open progress decisions. Navigation work does **not**
implement them, and no progress-writing behaviour changes in Stage 5A or 5B
until they are separately settled and authorised.

- **OD-2 — canonical subject ids in new score writes.** New writes continue to
  use the current strings. The navigation projection carries `subjectIds` for
  identity, and nothing reads it into a score write.
- **A-19 — `'Quick Fire'` as a persisted subject value.** It is not a subject,
  belongs to no subject record, and is deliberately absent from every
  `legacyProgressNames` list. It stays exactly as persisted.

The tile progress denominator (`CHAPTERS` filtered by subject, including the
hidden Renaissance row for History) is likewise unchanged — it is measured in
`CURRENT-BROWSER-CONTRACT.md` §1 and reproduced by the parity fixture, so
Stage 5B cannot move a percentage without failing.
