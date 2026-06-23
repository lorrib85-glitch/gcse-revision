# History series map

This is the canonical content spine for GCSE History — the four
Edexcel series, their episode breakdown, the specification topic each
episode covers, and (where it exists) the `src/modules.js` entry that
currently delivers that content.

**Use this document when:**

- Planning a new History module — find the episode, build to that brief.
- Deciding whether a new episode needs a new module or extends an
  existing one.
- Retitling or restructuring an existing module to align with the spine.

This spine sits *above* `docs/system/HISTORY_MODULE_ARCHITECTURE.md`,
which governs the internal Section 1–6 structure of every module. This
document governs **which modules exist** and **what each one covers** —
the architecture doc governs how each one is built.

---

## The five agents of change

*(Medicine Through Time only)*

- ⚔️ War
- ⛪ Religion
- 👤 Individuals
- 🏛️ Government
- 🔬 Science & technology

These five recurring "agents of change" explain *why* medicine changed
when it did. They should be revisited repeatedly throughout every
Medicine Through Time module and explicitly linked to "explain why"
exam questions (the `explain-why` `GuidedAnswerCoach` type).

---

## Series 1 — Medicine Through Time

### Core through-line

Medicine is the story of people trying to explain the unknown with the
best evidence they had available. Progress did not happen by accident —
it happened because of recurring agents of change.

### Episode map

| # | Episode | GCSE topic | Current module | Notes |
|---|---------|-----------|-----------------|-------|
| 1 | Trust Me, I'm Following Jupiter | Medieval Medicine c1250–1500 | `history-medicine-medieval-beliefs-causes` — "Trust me, I'm Following Jupiter" | Built and aligned — title already matches. |
| 2 | The Day Everything Changed | Black Death | `history-medicine-black-death` — "The day everything changed" | Built and aligned — title now matches the spine. |
| 3 | The Beginning of Doubt | Medical Renaissance | `history-medicine-renaissance-medicine` (formerly `mod2`) — "The beginning of doubt" | Built, but this module currently bundles Episodes 3–5 into one module (see below). |
| 4 | The Man Who Proved Everyone Wrong | William Harvey | `history-medicine-renaissance-medicine` (shared — see Episode 3) | Harvey's circulation theory is taught inside this module, not as its own module. |
| 5 | London's Year of Terror | Great Plague | `history-medicine-renaissance-medicine` (shared — see Episode 3) | The 1665 Great Plague currently appears inside this module as a "continuity" case study. |
| 6 | The Boy, the Cow and the Cure | Jenner | `history-medicine-jenner-vaccination` — "The boy, the cow and the cure" | Built and aligned — title now matches the spine. |
| 7 | The Invisible Enemy | Pasteur & Koch | `history-medicine-germ-theory` — "The invisible enemy" | Built and aligned — title now matches the spine. |
| 8 | The Great Stink | Public Health | `mod5` — "The Great Stink" | Built and aligned — title now matches the spine. |
| 9 | The Day Surgery Changed Forever | Anaesthetics & Antiseptics | `history-medicine-surgery-anaesthetics` + `history-medicine-surgery-revolution` (formerly `mod3` + `mod6`) — "Surgery & anatomy" / "The surgery revolution" | Built as a two-part story: the first module sets up the problem (pain, infection, blood loss before 1840), the second delivers the revolution (anaesthetics, antiseptics, Lister). |
| 10 | The Lady with the Lamp? | Florence Nightingale | — | Not yet built. Nightingale currently appears only as a comparison point in `history-medicine-renaissance-medicine`'s learning objectives. |
| 11 | The Accidental Miracle | Penicillin | `history-medicine-accidental-miracle` (formerly `mod7`) — "The accidental miracle" | Built and aligned — title now matches the spine. |
| 12 | When Medicine Became Magic | NHS & Modern Medicine | `history-medicine-modern-medicine` + `history-medicine-cancer` (formerly `mod8` + `mod9`) — "When medicine became magic" / "Can we beat cancer?" | Built, but split awkwardly: the first module covers the "magic" half (scans, transplants, DNA), the second opens with the 1948 NHS founding then drifts into Episode 13 content (see below). |
| 13 | Can We Beat Cancer? | Lung Cancer | `history-medicine-cancer` (shared — see Episode 12) | Lifestyle-disease/lung-cancer content currently lives in the back half of this module, with no clear break from the NHS content. |
| 14 | Hell in the Trenches | Western Front | — | Not yet built. This is Edexcel's Historic Environment topic (the British sector of the Western Front, 1914–18). |

### Restructuring notes

- **`history-medicine-renaissance-medicine` → split into Episodes 3, 4 and 5.** Vesalius (Ep 3), Harvey
  and Paré (Ep 4), and the 1665 Great Plague (Ep 5) are currently one
  module and need separating to match the 14-episode spine.
- **`mod4` split into Episodes 6 and 7 — done.** Jenner's vaccine (Ep 6) now
  lives in `history-medicine-jenner-vaccination`, and Pasteur & Koch's germ
  theory (Ep 7) lives in `history-medicine-germ-theory`.
- **`history-medicine-surgery-anaesthetics` + `history-medicine-surgery-revolution` → realign as Episode 9's two halves**, or merge into
  a single Episode 9 module — currently named/positioned as separate
  modules (numbers 4 and 9) with a content gap between them.
- **`history-medicine-modern-medicine` + `history-medicine-cancer` → split into Episodes 12 and 13.** The NHS/modern
  medicine "magic" content (Ep 12) and the lung cancer/lifestyle disease
  content (Ep 13) need a clean module boundary.
- **Episodes 10 (Nightingale) and 14 (Western Front) are net-new builds.**

---

## Series 2 — Spain and the 'New World'

### Core through-line

An extraordinary story of ambition, faith, greed and conquest that
transformed both Spain and the Americas forever.

### Specification structure (Edexcel)

- **Key Topic 1** — Spain and the 'New World': motives for exploration,
  Columbus's voyages, first encounters with Native Americans.
- **Key Topic 2** — The conquest of Mexico: the conquistadors, Cortés,
  the fall of the Aztec Empire.
- **Key Topic 3** — The conquest of Peru: Pizarro, the Inca Empire,
  Atahualpa.
- **Key Topic 4** — The legacy of Spanish settlement: colonial rule,
  the encomienda system, silver and the Columbian Exchange.

### Episode map

| # | Episode | GCSE topic |
|---|---------|-----------|
| 1 | The Man Who Wanted to Sail West | Columbus and the motives for exploration (Key Topic 1) |
| 2 | A New World | First encounters with Native Americans in the Caribbean (Key Topic 1) |
| 3 | Gold, God and Empire | Spanish motives for conquest — God, glory and gold (Key Topic 1) |
| 4 | The Conquistadors | The conquistadors and Cortés's expedition (Key Topic 2) |
| 5 | The Fall of the Aztecs | The fall of Tenochtitlan and the Aztec Empire (Key Topic 2) |
| 6 | What the Spanish Left Behind | Immediate consequences of the conquest of Mexico (Key Topic 2) |
| 7 | The Last Inca Emperor | Atahualpa and the Inca Empire (Key Topic 3) |
| 8 | The Conquest of Peru | Pizarro's conquest of the Inca Empire (Key Topic 3) |
| 9 | How to Rule an Empire | Spanish colonial administration and the encomienda system (Key Topic 4) |
| 10 | Silver Changed Everything | Silver mining, Potosí and the Columbian Exchange (Key Topic 4) |

**Status:** no modules exist yet for this series — this map is the build
order.

---

## Series 3 — The USA, 1954–75: Conflict at Home and Abroad

### Core through-line

One nation fighting two battles at once: one for equality at home and
one for victory abroad.

### Specification structure (Edexcel)

- **Key Topic 1** — Reasons for the civil rights movement and early
  protests, 1954–62: segregation, Brown v Board, Montgomery Bus Boycott,
  Little Rock, sit-ins and Freedom Rides.
- **Key Topic 2** — Protest, progress and radicalism, 1963–75: the March
  on Washington, the Civil Rights and Voting Rights Acts, Black Power,
  assessing progress by 1975.
- **Key Topic 3** — Reasons for US involvement in Vietnam, 1954–64.
- **Key Topic 4** — 1965–75: escalation, methods of warfare, the reaction
  in the USA, and the end of the war.

### Episode map

| # | Episode | GCSE topic |
|---|---------|-----------|
| 1 | Separate and Unequal | Segregation and the roots of the civil rights movement (Key Topic 1) |
| 2 | The Girl Who Walked Into History | The Little Rock Nine, 1957 (Key Topic 1) |
| 3 | The Woman Who Stayed Seated | Rosa Parks and the Montgomery Bus Boycott, 1955–56 (Key Topic 1) |
| 4 | Standing Up, Sitting Down | The sit-ins and Freedom Rides, 1960–61 (Key Topic 1) |
| 5 | I Have a Dream | The March on Washington, 1963 (Key Topic 2) |
| 6 | By Any Means Necessary | Malcolm X and Black Power (Key Topic 2) |
| 7 | How Much Had Really Changed? | Assessing civil rights progress by 1975 (Key Topic 2) |
| 8 | Why America Went to Vietnam | Reasons for US involvement in Vietnam (Key Topic 3) |
| 9 | America's War | Escalation — the USA commits combat troops, from 1965 (Key Topic 4) |
| 10 | Can You Win a Guerrilla War? | Methods of warfare and the Tet Offensive (Key Topic 4) |
| 11 | The War Comes Home | The anti-war movement and media coverage in the USA (Key Topic 4) |
| 12 | The Long Way Out | Vietnamization, withdrawal and the fall of Saigon, 1975 (Key Topic 4) |

**Status:** no modules exist yet for this series — this map is the build
order.

---

## Series 4 — Early Elizabethan England

### Core through-line

A young queen inherits a divided kingdom. For thirty years, plots,
rivals and Europe's greatest powers try to bring her down.

### Specification structure (Edexcel)

- **Key Topic 1** — Queen, government and religion, 1558–69: Elizabeth's
  character and court, the Religious Settlement, Puritans and Catholics,
  Mary Queen of Scots' arrival and the Northern Rebellion.
- **Key Topic 2** — Challenges to Elizabeth at home and abroad, 1569–88:
  plots against Elizabeth, the execution of Mary, relations with Spain
  and the Armada.
- **Key Topic 3** — Elizabethan society in the Age of Exploration,
  1558–88: education, leisure, poverty, and voyages of exploration.

### Episode map

| # | Episode | GCSE topic |
|---|---------|-----------|
| 1 | England's Most Unlikely Queen | Elizabeth's accession and the problems she inherited, 1558 (Key Topic 1) |
| 2 | The Queen Who Wouldn't Marry | The succession and marriage question (Key Topic 1) |
| 3 | One Country, Two Religions | The Religious Settlement, 1559 (Key Topic 1) |
| 4 | My Cousin Wants My Crown | Mary, Queen of Scots' arrival and the Northern Rebellion, 1568–69 (Key Topic 1) |
| 5 | Kill the Queen | Plots against Elizabeth — Ridolfi, Throckmorton, Babington (Key Topic 2) |
| 6 | The Hardest Decision | The execution of Mary, Queen of Scots, 1587 (Key Topic 2) |
| 7 | Drake: Pirate or Hero? | Drake, privateering and relations with Spain (Key Topic 2) |
| 8 | The Day Spain Came for England | The Spanish Armada, 1588 (Key Topic 2) |
| 9 | The World Gets Bigger | The Age of Exploration (Key Topic 3) |
| 10 | Raleigh's Impossible Dream | Raleigh and the Virginia/Roanoke colony (Key Topic 3) |
| 11 | Life Under Elizabeth | Elizabethan society — education, leisure and poverty (Key Topic 3) |

**Status:** no modules exist yet for this series — this map is the build
order.
