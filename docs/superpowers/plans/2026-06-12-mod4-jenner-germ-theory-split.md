# Mod4 Split (Jenner & Germ Theory) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the History module `mod4` ("Germ theory") into two standalone
modules matching `docs/content/history/HISTORY_SERIES_MAP.md` Episodes 6 and
7, renumber the five Medicine modules that follow, and update every
cross-file reference so nothing dangles.

**Architecture:** Reuses `mod4`'s existing simple `hook` / `outcomes` /
`recall` / `screens[].blocks[]` module schema — no new components, no new
architecture. Episode 6 (Jenner) gets exactly one new piece of content (a
cinematic true/false hook screen); its only `screens` entry is the existing
`vaccination` screen moved verbatim, with no `outcomes`/`recall` (both
confirmed optional — `ModulePlayer.jsx` defaults `wylDone`/`recallDone` to
`true` when absent). Episode 7 (germ theory) is `mod4` renamed/renumbered,
minus the `vaccination` screen, with `hook`/`outcomes`/`recall`/remaining
`screens` carried over verbatim.

**Tech Stack:** React + Vite. Plain JS data files (`src/modules.js`,
`src/data/tagModuleMap.js`, `src/contentIndex.js`), `src/App.jsx`, and one
Markdown doc. No test framework — verification is `vite build` plus manual
Playwright check at 390×844.

---

## Task 1: Replace `mod4` with two new modules in `src/modules.js`

**Files:**
- Modify: `src/modules.js:2839-3046` (the entire `mod4` object, from its
  opening `{` on line 2839 to its closing `},` on line 3045)

- [ ] **Step 1: Replace the `mod4` object with the two new module objects**

Open `src/modules.js`. Find the block starting at line 2839 with:

```js
  {
    id: 'mod4',
```

and ending at line 3045 with:

```js
    ]
  },
```

(the line before `mod5`'s opening `{` on line 3047). Replace that entire
block (lines 2839–3045) with the following two module objects:

```js
  {
    id: 'history-medicine-jenner-vaccination',
    subject: 'History',
    number: 5,
    title: 'The boy, the cow and the cure',
    subtitle: 'Edward Jenner and the birth of vaccination',
    era: 'c.1796–c.1853',
    icon: '🐄',
    color: '#BD7224',
    colorLight: 'rgba(189,114,36,.12)',
    hook: {
      scenario: { location: 'Gloucestershire, 1796', hint: 'Dr Jenner is in a farmyard, looking at a milkmaid\'s clear, unmarked skin.' },
      statement: 'Edward Jenner invented vaccination by studying how the immune system fights disease.',
      isTrue: false,
      accentWords: ['the immune system'],
      explanation: "Jenner had never heard of the immune system — that idea didn't exist for almost another century. He worked from a simple farmyard observation, decades before anyone understood why it worked.",
      wrongFeedback: 'Jenner had no idea the immune system existed. He worked purely from observation.',
      correctFeedback: 'Exactly — Jenner had no idea why it worked. He just noticed a pattern and tested it.',
      loadingText: 'Going back to the dairy farms…',
      bigQuestion: 'So how did a farmyard observation lead to the world\'s first vaccine?',
      revealHeader: 'It started with a milkmaid\'s clear skin.',
      revealItems: [
        { emoji: '🐄', label: 'The milkmaid clue', detail: 'Edward Jenner noticed that dairy workers who had caught cowpox — a mild disease passed from cattle — rarely caught smallpox, even during deadly outbreaks. He began to wonder if catching cowpox somehow protected people.', color: '#BD7224', bg: 'rgba(189,114,36,.08)' },
        { emoji: '💉', label: 'The 1796 experiment', detail: 'In 1796, Jenner took matter from a cowpox sore on milkmaid Sarah Nelmes and scratched it into the arm of eight-year-old James Phipps. Weeks later, he deliberately exposed Phipps to smallpox. The boy stayed healthy.', color: '#C47828', bg: 'rgba(196,120,40,.08)' },
        { emoji: '😨', label: 'Fear and backlash', detail: 'Many people were horrified — cartoons showed patients growing cow heads after vaccination, and the Church called it unnatural. It took decades, but by 1853 smallpox vaccination was made compulsory in England.', color: '#B06520', bg: 'rgba(176,101,32,.08)' },
      ],
      punchline: 'Jenner proved vaccination worked decades before anyone understood why — and his "observe, test, repeat" approach became the model for the medical breakthroughs that followed.',
    },
    screens: [
      { tag: 'vaccination', label: 'Jenner', kicker: '1796', heading: 'Jenner develops the smallpox vaccine.', headerImage: '/images/jenner-1796.png', sub: 'The first vaccine — discovered by observation, not by understanding germs.', blocks: [
        { type: 'read', label: '💉 What Happened', text: '<strong>Edward Jenner</strong> noticed that milkmaids who caught <strong>cowpox</strong> rarely got <strong>smallpox</strong>. In 1796 he deliberately infected James Phipps — a boy — with cowpox, then exposed him to smallpox. The boy did not get ill. The <strong>smallpox vaccine</strong> was born.' },
        { type: 'keypoint', text: '<strong>Critical exam point:</strong> Jenner did not know about germs or the immune system. He worked by observation and experiment — not by understanding why it worked. Pasteur later explained the mechanism. This shows how <strong>chance observation + scientific method</strong> can lead to breakthroughs.' },
        { type: 'funfact', label: '😨 Controversy', text: 'Many people were horrified. Cartoons showed patients growing cow heads after vaccination. The Church opposed it. Parliament eventually made smallpox vaccination compulsory in 1853 — the first compulsory vaccination law in England.' },
        { type: 'quiz', question: 'Why is Jenner\'s smallpox vaccine significant for understanding medical progress?', options: [
          { text: 'It proved that observation and experiment could produce breakthroughs even without understanding the cause', correct: true },
          { text: 'It proved that germ theory was correct', correct: false },
          { text: 'It showed that the Church supported scientific progress', correct: false },
        ], explanation: 'Jenner had no knowledge of germs or immunity — he used observation and careful experiment. His work paved the way for Pasteur, who later explained WHY vaccines work.' },
      ]},
    ]
  },

  {
    id: 'history-medicine-germ-theory',
    subject: 'History',
    number: 6,
    title: 'The invisible enemy',
    subtitle: 'Pasteur, Koch and germ theory',
    era: 'c1857–c1883',
    icon: '🦠',
    color: '#B06520',
    colorLight: 'rgba(176,101,32,.12)',
    hook: {
      scenario: { location: 'Paris, 1857', hint: 'Pasteur is in his lab — staring at a bottle of wine that\'s gone bad.' },
      statement: 'Louis Pasteur discovered germ theory by studying sick patients in hospitals.',
      isTrue: false,
      accentWords: ['sick patients in hospitals'],
      explanation: "Pasteur was a chemist, not a doctor. His breakthrough came from spoiled wine and sour beer — the biggest revolution in medical history started with a drinks problem.",
      wrongFeedback: 'He was a chemist, not a doctor. His breakthrough came from spoiled wine, not sick people.',
      correctFeedback: 'Exactly — it started with wine. The biggest medical revolution came from a drinks problem.',
      loadingText: 'Following the evidence…',
      bigQuestion: 'So how did wine lead to one of the biggest ideas in medical history?',
      revealHeader: 'It started with why wine went bad.',
      revealItems: [
        { emoji: '🍷', label: 'Wine → bacteria → disease', detail: 'Pasteur saw bacteria spoiling wine under a microscope. He realised microorganisms caused decay — and if they caused decay, maybe they caused disease too. He was right.', color: '#B06520', bg: 'rgba(176,101,32,.08)' },
        { emoji: '🧪', label: 'The swan-neck flask (1861)', detail: 'Pasteur boiled broth in a flask with a curved neck. Air got in — but dust and microbes didn\'t. The broth stayed fresh. This proved microbes came from outside, not from thin air.', color: '#C47828', bg: 'rgba(196,120,40,.08)' },
        { emoji: '🔬', label: 'Koch made it specific', detail: 'Pasteur proved microbes caused disease generally. Robert Koch went further — identifying the exact bacteria behind anthrax, TB and cholera. Suddenly medicine could target specific enemies.', color: '#D4950A', bg: 'rgba(212,149,10,.08)' },
      ],
      punchline: 'Germ theory changed everything — vaccines, antiseptics, antibiotics all follow from one chemist asking why his wine was off.',
    },
    outcomes: {
      intro: 'Two scientists, one idea, and the moment everything changed in medicine.',
      bullets: [
        "Explain Pasteur's germ theory in your own words",
        'Describe how Koch identified specific bacteria as disease causes',
        'See why this idea was so difficult for doctors to accept at first',
        'Link germ theory to the treatments and breakthroughs that followed',
      ],
    },
    recall: {
      questions: [
        { type: 'truefalse', question: 'Louis Pasteur was a trained doctor who worked in hospitals.', isTrue: false },
        { type: 'choice', question: 'Koch\'s biggest contribution was...', options: ['Creating the first vaccine', 'Linking specific bacteria to specific diseases', 'Disproving the germ theory'], correct: 1 },
        { type: 'connection', question: 'Germ theory transformed medicine because...', options: [
          { text: 'It immediately gave doctors new treatments', icon: 'flask' },
          { text: 'It explained WHY disease spread from person to person', icon: 'lightbulb' },
          { text: 'It replaced Galen overnight in hospitals', icon: 'book' },
        ], correct: 1 },
      ],
    },
    screens: [
      { tag: 'germ-theory', label: 'Old Ideas', kicker: 'Before Germ Theory', heading: 'Old ideas refused to die', sub: 'Doctors did not just wake up one day and say "germs, obviously." Medicine had centuries of bad habits to unlearn.', blocks: [
        { type: 'read', label: '💨 Miasma', text: 'Disease was believed to be caused by bad air or foul smells. This seemed logical because disease was common in filthy places.' },
        { type: 'read', label: '🧪 Spontaneous Generation', text: 'People believed germs appeared naturally from decay or illness — as a symptom, not the cause. This is the opposite of germ theory.' },
        { type: 'examtip', label: '🗡️ Key Distinction', text: 'People knew microbes existed, but they did <strong>not</strong> believe microbes caused disease. They often thought germs appeared after illness had already started.' },
        { type: 'quiz', question: 'What did people believe about germs before germ theory?', options: [
          { text: 'Germs appeared as a result of disease, not the cause', correct: true },
          { text: 'Germs caused all disease', correct: false },
          { text: 'Germs were the same as the Four Humours', correct: false },
          { text: 'Germs came from bad surgery', correct: false },
        ], explanation: 'Spontaneous generation said germs appeared from decay — they were a symptom of illness, not its cause. Pasteur proved the opposite.' },
      ]},
      { tag: 'pasteur', label: 'Pasteur', kicker: '1861', heading: 'Louis Pasteur: the wine detective', headerImage: '/images/pasteur-1861.png', sub: 'Global breakthrough begins with someone\'s drink being ruined.', blocks: [
        { type: 'read', label: '📖 Core Knowledge', text: '<strong>Louis Pasteur</strong> was a French chemist. In the 1850s, he investigated why wine went bad. Using a microscope, he saw bacteria in the wine and believed they were causing it to spoil. He heated the wine to kill the bacteria — a process later called <strong>pasteurisation</strong>.' },
        { type: 'read', label: '🧪 Swan-Neck Flask (1861)', text: 'Pasteur boiled broth in swan-neck flasks to kill existing microbes. The sealed flask stayed fresh. The flask exposed to air went bad. This showed microbes came from the air and caused decay — they did not appear through spontaneous generation. He published his findings in <strong>1861</strong>.' },
        { type: 'keypoint', text: 'In <strong>1861</strong>, Pasteur published his work on <strong>germ theory</strong>. This changed understanding of disease and opened the door to vaccines, antiseptic surgery and later antibiotics.' },
        { type: 'quiz', question: 'Why was Pasteur studying wine?', options: [
          { text: 'A winemaker asked him to investigate why wine was going off', correct: true },
          { text: 'He was trying to invent anaesthetic', correct: false },
          { text: 'He was identifying blood groups', correct: false },
          { text: 'He was treating the Great Plague', correct: false },
        ], explanation: 'Classic history: global breakthrough begins with someone\'s drink being ruined. Pasteur saw bacteria, linked them to spoilage, then applied this to disease.' },
      ]},
      { tag: 'koch', label: 'Koch', kicker: 'Key Person 2', heading: 'Robert Koch: "Cool, but WHICH germ?"', sub: 'Pasteur showed microbes caused disease. Koch proved specific germs caused specific diseases.', blocks: [
        { type: 'read', label: '📖 Core Knowledge', text: '<strong>Robert Koch</strong> was a German doctor. He used <strong>industrial dyes</strong> to stain bacteria so they were easier to see under microscopes. He identified the bacteria behind three major killers — and each time, it made germ theory harder to ignore.' },
        { type: 'keypoint', text: 'Koch made germ theory more convincing because he linked <strong>specific bacteria</strong> to <strong>specific diseases</strong>. This was crucial for developing vaccines and treatments.' },
        { type: 'quiz', question: 'Why was Koch\'s work important?', options: [
          { text: 'He identified specific bacteria causing specific diseases, making germ theory more convincing', correct: true },
          { text: 'He proved miasma theory was correct', correct: false },
          { text: 'He invented the printing press', correct: false },
          { text: 'He performed the first operation under anaesthetic', correct: false },
        ], explanation: 'Pasteur proved microbes caused disease generally. Koch proved which specific microbe caused which specific disease — crucial for developing targeted treatments.' },
      ]},
      { label: 'Anthrax', kicker: '1876', heading: 'Koch identifies anthrax', sub: 'The first time a specific bacterium was definitively linked to a specific disease.', blocks: [
        { type: 'read', label: '🔬 The Discovery', text: '<strong>Robert Koch</strong> identified <em>Bacillus anthracis</em> — the bacterium causing anthrax — in 1876. He used industrial dyes to stain bacteria so they were visible under a microscope. This was the first time a specific microbe had been definitively linked to a specific disease, turning germ theory from an idea into a proven tool.' },
        { type: 'keypoint', text: 'Before Koch, germ theory was plausible. After 1876, it was <strong>proven</strong> — at least for anthrax. The method he used became the template for future discoveries.' },
      ]},
      { label: 'Tuberculosis', kicker: '1882', heading: 'Koch identifies TB', sub: 'TB killed one in seven people in Europe. Now they knew what caused it.', blocks: [
        { type: 'read', label: '🔬 The Discovery', text: 'In <strong>1882</strong>, Koch identified the bacterium causing <strong>tuberculosis (TB)</strong> — one of the biggest killers in Europe. This single discovery made germ theory widely accepted because TB was so visible and deadly. Doctors could no longer dismiss the idea that invisible microbes caused disease.' },
        { type: 'examtip', label: '🗡️ Exam Link', text: 'TB identification mattered for the <strong>development of later treatments</strong>. You cannot treat a specific disease if you do not know its specific cause.' },
      ]},
      { label: 'Cholera', kicker: '1883', heading: 'Koch identifies cholera', sub: 'Cholera had swept across Europe in waves. Koch found out why.', blocks: [
        { type: 'read', label: '🔬 The Discovery', text: 'In <strong>1883</strong>, Koch identified the bacterium causing <strong>cholera</strong>. This built on John Snow\'s earlier work — Snow had proved cholera spread through contaminated water (1854) without knowing why. Koch found the actual cause. Together their work transformed public health and disease prevention.' },
        { type: 'keypoint', text: 'By 1883, Koch had linked three major diseases to specific bacteria. The age of targeted medicine had begun.' },
      ]},
      { label: 'Vaccines', kicker: 'Chance + Science', heading: 'Chicken cholera: the holiday mistake', sub: 'Chance plays a role in science — but only when someone\'s there to recognise it.', blocks: [
        { type: 'funfact', label: '🐔 The Oops', text: 'In 1879, Pasteur\'s assistant <strong>Charles Chamberland</strong> left chicken cholera germs unrefrigerated before going on holiday. When the old germs were injected into chickens, they did not become ill. When fresh germs were injected later — still no illness. Pasteur had discovered a way to create vaccines using weakened germs.' },
        { type: 'read', label: '🐄 Link to Jenner', text: 'Jenner used cowpox to prevent smallpox, but did not fully understand why it worked. Pasteur understood weakened germs could produce immunity — so he could apply the process to other diseases. Later vaccines: anthrax and rabies.' },
        { type: 'quiz', question: "Why was Pasteur's chicken cholera discovery important?", options: [
          { text: 'It showed weakened germs could create immunity', correct: true },
          { text: 'It proved miasma was correct', correct: false },
          { text: 'It discovered blood groups', correct: false },
          { text: 'It invented chloroform', correct: false },
        ], explanation: 'Chance opened the door; Pasteur\'s scientific thinking made it useful. This shows how chance and individual genius work together.' },
      ]},
      { label: 'Impact', kicker: 'Why It Mattered', heading: 'Why germ theory was such a big deal', sub: 'It did not immediately cure everything. But it changed the direction of medicine permanently.', blocks: [
        { type: 'read', label: '🧼 Surgery', text: 'Lister used germ theory to develop antiseptic surgery with carbolic acid.' },
        { type: 'read', label: '💉 Vaccines', text: 'Pasteur used the idea of weakened germs to develop vaccines for other diseases.' },
        { type: 'read', label: '🏙️ Public Health', text: 'If germs caused disease, then clean water, sewage systems and hygiene mattered more.' },
        { type: 'keypoint', text: '<strong>Germ theory changed understanding of disease before it changed treatment.</strong> Knowledge improved first, then practical treatments followed.' },
        { type: 'quiz', question: 'Which is the strongest judgement about germ theory?', options: [
          { text: 'Germ theory transformed understanding and allowed later improvements in surgery, vaccines and public health', correct: true },
          { text: 'Germ theory immediately cured all diseases', correct: false },
          { text: 'Germ theory proved miasma was correct', correct: false },
          { text: 'Germ theory was only useful for wine', correct: false },
        ], explanation: 'The best exam answers show germ theory changed understanding first, then enabled practical improvements.' },
      ]},
      { label: 'Flashcards', kicker: 'Final Recap', heading: 'Flashcards', sub: 'Tap to flip. Lock in the key facts.', blocks: [
        { type: 'flashcards', cards: [
          { front: 'Spontaneous generation', back: 'The belief that germs appeared naturally from decay — not as the cause of disease.' },
          { front: 'Pasteur', back: 'French chemist who proved microbes caused decay. Swan-neck flask, 1861.' },
          { front: 'Swan-neck flask', back: 'Showed microbes came from air; broth stayed fresh when microbes were trapped.' },
          { front: 'Koch', back: 'Identified specific bacteria causing specific diseases. Anthrax 1876, TB 1882, cholera 1883.' },
          { front: 'Chicken cholera discovery', back: 'Weakened germs could create immunity. Led to vaccines for anthrax and rabies.' },
          { front: 'Germ theory impact', back: 'Changed understanding first — then enabled antiseptic surgery, vaccines and public health reform.' },
        ]},
      ]},
    ]
  },
```

- [ ] **Step 2: Verify the replacement landed correctly**

Run:

```bash
grep -n "id: 'mod4'\|id: 'history-medicine-jenner-vaccination'\|id: 'history-medicine-germ-theory'\|id: 'mod5'" src/modules.js
```

Expected: no `id: 'mod4'` match; one match each for
`history-medicine-jenner-vaccination`, `history-medicine-germ-theory`, and
`mod5` (mod5 should immediately follow the germ-theory module's closing
`},`).

---

## Task 2: Renumber the five modules after the split (`mod5`–`mod9`)

**Files:**
- Modify: `src/modules.js` (five `number:` fields — exact line numbers will
  have shifted after Task 1; match by the unique `id`/`subject`/`number`
  block shown below for each)

Each module currently reads, e.g. for `mod5`:

```js
    id: 'mod5',
    subject: 'History',
    number: 6,
```

The two new modules from Task 1 now occupy `number: 5` and `number: 6`
(Jenner and germ theory). Each of `mod5`–`mod9`'s `number:` field must
shift up by 1 to keep the sequence contiguous.

- [ ] **Step 1: Renumber `mod5`**

Find:

```js
    id: 'mod5',
    subject: 'History',
    number: 6,
```

Replace with:

```js
    id: 'mod5',
    subject: 'History',
    number: 7,
```

- [ ] **Step 2: Renumber `mod6`**

Find:

```js
    id: 'mod6',
    subject: 'History',
    number: 7,
```

Replace with:

```js
    id: 'mod6',
    subject: 'History',
    number: 8,
```

- [ ] **Step 3: Renumber `mod7`**

Find:

```js
    id: 'mod7',
    subject: 'History',
    number: 8,
```

Replace with:

```js
    id: 'mod7',
    subject: 'History',
    number: 9,
```

- [ ] **Step 4: Renumber `mod8`**

Find:

```js
    id: 'mod8',
    subject: 'History',
    number: 9,
```

Replace with:

```js
    id: 'mod8',
    subject: 'History',
    number: 10,
```

- [ ] **Step 5: Renumber `mod9`**

Find:

```js
    id: 'mod9',
    subject: 'History',
    number: 10,
```

Replace with:

```js
    id: 'mod9',
    subject: 'History',
    number: 11,
```

- [ ] **Step 6: Verify all six History Medicine modules have unique sequential numbers**

Run:

```bash
grep -n "subject: 'History'" -A1 src/modules.js | grep "number:"
```

Expected output (in this order): `number: 1,` (medieval beliefs), `number:
2,` (black death), `number: 3,` (mod2), `number: 4,` (mod3), `number: 5,`
(Jenner), `number: 6,` (germ theory), `number: 7,` (mod5), `number: 8,`
(mod6), `number: 9,` (mod7), `number: 10,` (mod8), `number: 11,` (mod9).

---

## Task 3: Update `MODULE_GROUPS.chapterIds` in `src/App.jsx`

**Files:**
- Modify: `src/App.jsx:408`

- [ ] **Step 1: Replace `'mod4'` with the two new module ids**

Find (line 408):

```js
    chapterIds: ['history-medicine-medieval-beliefs-causes','history-medicine-black-death','mod2','mod3','mod4','mod5','mod6','mod7','mod8','mod9'],
```

Replace with:

```js
    chapterIds: ['history-medicine-medieval-beliefs-causes','history-medicine-black-death','mod2','mod3','history-medicine-jenner-vaccination','history-medicine-germ-theory','mod5','mod6','mod7','mod8','mod9'],
```

- [ ] **Step 2: Verify**

```bash
grep -n "chapterIds:" src/App.jsx | grep hist_medicine -A0
```

Or simply re-read line 408 and confirm `'mod4'` is gone and both new ids are
present in the Jenner → germ-theory order, between `'mod3'` and `'mod5'`.

---

## Task 4: Update `MODULE_HEADER_IMAGES` in `src/App.jsx`

**Files:**
- Modify: `src/App.jsx:1268-1278`

- [ ] **Step 1: Remove the `mod4` entry and add entries for the two new module ids**

Find:

```js
const MODULE_HEADER_IMAGES = {
  'history-medicine-medieval-beliefs-causes': '/headers/history-medicine-through-time.webp',
  'history-medicine-black-death': '/figures/history/medicine/black-death/plague-background.png',
  'mod2': '/headers/history-medicine-bloodletting.png',
  'mod3': '/headers/history-medicine-germ-bridge.png',
  'mod4': '/headers/history-medicine-medieval-scripture.png',
  'mod5': '/headers/history-medicine-through-time.webp',
```

Replace with:

```js
const MODULE_HEADER_IMAGES = {
  'history-medicine-medieval-beliefs-causes': '/headers/history-medicine-through-time.webp',
  'history-medicine-black-death': '/figures/history/medicine/black-death/plague-background.png',
  'mod2': '/headers/history-medicine-bloodletting.png',
  'mod3': '/headers/history-medicine-germ-bridge.png',
  'history-medicine-jenner-vaccination': '/headers/history-medicine-medieval-scripture.png',
  'history-medicine-germ-theory': '/headers/history-medicine-germ-bridge.png',
  'mod5': '/headers/history-medicine-through-time.webp',
```

- [ ] **Step 2: Verify**

```bash
grep -n "'mod4'\|history-medicine-jenner-vaccination\|history-medicine-germ-theory" src/App.jsx
```

Expected: no `'mod4'` match anywhere in `App.jsx`; both new ids appear in
`MODULE_HEADER_IMAGES`.

---

## Task 5: Fix the 90s Quiz bank entries in `src/App.jsx`

**Files:**
- Modify: `src/App.jsx:3950-3953`

Three entries currently reference `moduleId: 'mod4'`. The germ-theory and
Jenner questions need to point at their new module ids; the penicillin
question is a pre-existing mistag that belongs to `mod7` ("The accidental
miracle" — Episode 11, where penicillin/Fleming content lives, unaffected by
this split).

- [ ] **Step 1: Fix the germ theory question**

Find:

```js
  { q: 'Which scientist developed germ theory?', options: ['Louis Pasteur', 'Galen', 'Vesalius', 'Florence Nightingale'], correct: 0, subject: 'History', topic: 'Germ Theory', moduleId: 'mod4', ms: 'Louis Pasteur showed that germs cause decay and disease.', hint: 'This French scientist showed that tiny living organisms — not bad air — cause disease.' },
```

Replace with:

```js
  { q: 'Which scientist developed germ theory?', options: ['Louis Pasteur', 'Galen', 'Vesalius', 'Florence Nightingale'], correct: 0, subject: 'History', topic: 'Germ Theory', moduleId: 'history-medicine-germ-theory', ms: 'Louis Pasteur showed that germs cause decay and disease.', hint: 'This French scientist showed that tiny living organisms — not bad air — cause disease.' },
```

- [ ] **Step 2: Fix the Jenner/vaccination question**

Find:

```js
  { q: 'What did Jenner create a vaccine for?', options: ['Smallpox', 'Cholera', 'Tuberculosis', 'Typhoid'], correct: 0, subject: 'History', topic: 'Vaccination', moduleId: 'mod4', ms: 'Edward Jenner developed vaccination against smallpox.', hint: 'He noticed milkmaids who caught a mild disease from cows seemed protected from a much deadlier one.' },
```

Replace with:

```js
  { q: 'What did Jenner create a vaccine for?', options: ['Smallpox', 'Cholera', 'Tuberculosis', 'Typhoid'], correct: 0, subject: 'History', topic: 'Vaccination', moduleId: 'history-medicine-jenner-vaccination', ms: 'Edward Jenner developed vaccination against smallpox.', hint: 'He noticed milkmaids who caught a mild disease from cows seemed protected from a much deadlier one.' },
```

- [ ] **Step 3: Fix the mis-tagged penicillin question**

Find:

```js
  { q: 'Who discovered penicillin?', options: ['Alexander Fleming', 'Robert Koch', 'James Simpson', 'John Snow'], correct: 0, subject: 'History', topic: 'Modern Medicine', moduleId: 'mod4', ms: 'Alexander Fleming discovered penicillin in 1928.', hint: 'He noticed a mould had killed the bacteria growing around it on a petri dish he had left out.' },
```

Replace with:

```js
  { q: 'Who discovered penicillin?', options: ['Alexander Fleming', 'Robert Koch', 'James Simpson', 'John Snow'], correct: 0, subject: 'History', topic: 'Modern Medicine', moduleId: 'mod7', ms: 'Alexander Fleming discovered penicillin in 1928.', hint: 'He noticed a mould had killed the bacteria growing around it on a petri dish he had left out.' },
```

- [ ] **Step 4: Verify no `moduleId: 'mod4'` remains anywhere**

```bash
grep -rn "moduleId: 'mod4'" src/
```

Expected: no matches.

---

## Task 6: Update `src/data/tagModuleMap.js`

**Files:**
- Modify: `src/data/tagModuleMap.js:32-35`

- [ ] **Step 1: Repoint the germ-theory and vaccination tags**

Find:

```js
  // Germ Theory
  'pasteur':                'mod4',
  'germ-theory':            'mod4',
  'vaccination':            'mod4',
  'koch':                   'mod4',
```

Replace with:

```js
  // Germ Theory
  'pasteur':                'history-medicine-germ-theory',
  'germ-theory':            'history-medicine-germ-theory',
  'vaccination':            'history-medicine-jenner-vaccination',
  'koch':                   'history-medicine-germ-theory',
```

- [ ] **Step 2: Verify**

```bash
grep -n "'mod4'" src/data/tagModuleMap.js
```

Expected: no matches.

---

## Task 7: Update `src/contentIndex.js`

**Files:**
- Modify: `src/contentIndex.js:245`

- [ ] **Step 1: Repoint the `germ-theory` entry's `moduleId`**

Find:

```js
  // ── History: Germ Theory (mod4) ────────────────────────────────────────────
  'germ-theory': {
    sectionId: 'germ-theory',
    title: 'Germ Theory — Pasteur and Koch',
    subject: 'History',
    moduleId: 'mod4',
    screenLabel: 'Pasteur',
```

Replace with:

```js
  // ── History: Germ Theory (history-medicine-germ-theory) ───────────────────
  'germ-theory': {
    sectionId: 'germ-theory',
    title: 'Germ Theory — Pasteur and Koch',
    subject: 'History',
    moduleId: 'history-medicine-germ-theory',
    screenLabel: 'Pasteur',
```

- [ ] **Step 2: Verify**

```bash
grep -rn "moduleId: 'mod4'\|'mod4'" src/contentIndex.js src/data/tagModuleMap.js src/App.jsx src/modules.js
```

Expected: zero matches across all four files.

---

## Task 8: Update `docs/content/history/HISTORY_SERIES_MAP.md`

**Files:**
- Modify: `docs/content/history/HISTORY_SERIES_MAP.md` (Episode 6 row,
  Episode 7 row, and the `mod4` restructuring note)

- [ ] **Step 1: Update the Episode 6 row**

Find:

```
| 6 | The Boy, the Cow and the Cure | Jenner | `mod4` — "Germ theory" | Built, but `mod4` currently bundles Episodes 6–7 into one module (see below). |
```

Replace with:

```
| 6 | The Boy, the Cow and the Cure | Jenner | `history-medicine-jenner-vaccination` — "The boy, the cow and the cure" | Built and aligned — title now matches the spine. |
```

- [ ] **Step 2: Update the Episode 7 row**

Find:

```
| 7 | The Invisible Enemy | Pasteur & Koch | `mod4` (shared — see Episode 6) | |
```

Replace with:

```
| 7 | The Invisible Enemy | Pasteur & Koch | `history-medicine-germ-theory` — "The invisible enemy" | Built and aligned — title now matches the spine. |
```

- [ ] **Step 3: Update the restructuring note**

Find:

```
- **`mod4` → split into Episodes 6 and 7.** Jenner's vaccine (Ep 6) and
  Pasteur & Koch's germ theory (Ep 7) are currently one module.
```

Replace with:

```
- **`mod4` split into Episodes 6 and 7 — done.** Jenner's vaccine (Ep 6) now
  lives in `history-medicine-jenner-vaccination`, and Pasteur & Koch's germ
  theory (Ep 7) lives in `history-medicine-germ-theory`.
```

- [ ] **Step 4: Verify**

```bash
grep -n "mod4" docs/content/history/HISTORY_SERIES_MAP.md
```

Expected: no matches.

---

## Task 9: Build verification

- [ ] **Step 1: Run the production build**

```bash
./node_modules/.bin/vite build
```

Expected: build completes with no errors (warnings about chunk size are
pre-existing and fine).

---

## Task 10: Manual verification with the dev server (390×844, Playwright)

- [ ] **Step 1: Start the dev server**

```bash
./node_modules/.bin/vite &
```

Note the local URL it prints (typically `http://localhost:5173`).

- [ ] **Step 2: Seed test progress and open Subjects → Medicine Through Time**

Using Playwright at viewport 390×844, navigate to the dev URL, seed
`localStorage` with `riseUser` and `gcse_progress` (same seeding approach
used in prior session tasks), then go to Subjects → Medicine Through Time.

Confirm:
- A module card titled "The boy, the cow and the cure" appears with icon 🐄
  and the bronze (`#BD7224`) accent colour, positioned where `mod4` used to
  be (after "Surgery & anatomy"/mod3, before "The Great Stink"/mod5 — check
  against the actual card order rendered).
- A module card titled "The invisible enemy" appears with icon 🦠 and the
  `#B06520` accent colour, immediately after the Jenner card.
- "The Great Stink" (mod5) and the remaining Medicine cards still render
  with correct titles, in order, after the germ-theory card.

- [ ] **Step 3: Open the Jenner module and confirm the new hook + screen**

Tap into "The boy, the cow and the cure". Confirm:
- The cinematic true/false hook renders first, showing the statement
  "Edward Jenner invented vaccination by studying how the immune system
  fights disease." — selecting "False" should show the correct-feedback
  text and the three reveal items (milkmaid clue, 1796 experiment, fear and
  backlash).
- After the hook, the module proceeds directly to the "Jenner" screen
  (heading "Jenner develops the smallpox vaccine.") — there should be no
  "What you'll learn" outcomes screen and no recall screen in between.
- The Jenner screen's quiz can be answered and the module reaches a
  completion state.

- [ ] **Step 4: Open the germ theory module and confirm carried-over content**

Go back to Subjects → Medicine Through Time, tap into "The invisible enemy".
Confirm:
- The Pasteur/wine 1857 hook renders (statement about Pasteur studying sick
  patients in hospitals — false).
- The "What you'll learn" outcomes screen renders with the four bullets
  about Pasteur/Koch.
- The recall screen renders with its three questions.
- The screens proceed in order: Old Ideas → Pasteur → Koch → Anthrax →
  Tuberculosis → Cholera → Vaccines (Chicken cholera) → Impact → Flashcards
  — i.e. the same content as old `mod4` minus the Jenner/vaccination screen.

- [ ] **Step 5: Spot-check the 90s Quiz and tag-map links**

From the bottom nav, open 90s Quiz and play until the "Which scientist
developed germ theory?", "What did Jenner create a vaccine for?", and "Who
discovered penicillin?" questions appear (may require multiple plays/seeded
weak topics). Confirm none of them error out or link to a missing module —
each "fix this gap" / module link should land on `history-medicine-germ-theory`,
`history-medicine-jenner-vaccination`, and `mod7` respectively.

- [ ] **Step 6: Clean up**

Clear any seeded `localStorage` test data added for this verification, then
stop the dev server:

```bash
kill %1
```

(or the appropriate job/PID for the `vite` process started in Step 1).

---

## Task 11: Commit and push

- [ ] **Step 1: Review the full diff**

```bash
git status
git diff --stat
```

Expected changed files: `src/modules.js`, `src/App.jsx`,
`src/data/tagModuleMap.js`, `src/contentIndex.js`,
`docs/content/history/HISTORY_SERIES_MAP.md`.

- [ ] **Step 2: Commit**

```bash
git add src/modules.js src/App.jsx src/data/tagModuleMap.js src/contentIndex.js docs/content/history/HISTORY_SERIES_MAP.md
git commit -m "Split mod4 into Jenner vaccination and germ theory modules

Splits the combined 'Germ theory' module into Episode 6 ('The boy, the cow
and the cure' — Jenner/vaccination) and Episode 7 ('The invisible enemy' —
Pasteur & Koch/germ theory) per HISTORY_SERIES_MAP.md. Renumbers mod5-mod9,
updates MODULE_GROUPS/MODULE_HEADER_IMAGES/90s-quiz references in App.jsx,
tagModuleMap.js, and contentIndex.js, and fixes a pre-existing penicillin
quiz mistag (mod4 -> mod7)."
```

- [ ] **Step 3: Push**

```bash
git push -u origin main
```

- [ ] **Step 4: Confirm clean working tree**

```bash
git status
```

Expected: `nothing to commit, working tree clean`.
