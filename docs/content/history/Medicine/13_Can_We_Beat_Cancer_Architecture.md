# Episode 13: Can We Beat Cancer? — Architecture

## 1. Identity (brief)

- **Episode number:** 13
- **Title:** Can We Beat Cancer?
- **Build status:** Built (shared) as `mod9` — also covers Episode 12
- Content, Storyline, Specification requirements and the full Content reference pack: see `13_Can_We_Beat_Cancer_Content.md` in this directory.

### Bundling note
`mod9` (10 screens, no tags) is shared between Episodes 12 and 13. The content split within mod9 is unverifiable without loading `history.js`. A rebuild must create a standalone module for Episode 13, separate from Episode 12's `mod8` + part-of-`mod9` content. Recommended new module ID: `history-medicine-modern-prevention`.

---

## 2. Architecture checklist (tailored)

### Section 1 — Intro, Recall & Roadmap
- **Purpose:** Recall the NHS (Ep 12) as the treatment infrastructure; set up the prevention problem as the next frontier — we can treat disease, but can we stop it happening at all?; create curiosity about why the government waited 57 years after the science was clear to ban smoking in workplaces.
- **Proposed content for Episode 13:**
  - PriorKnowledgeRecall: probe nhs, penicillin, vaccination, john-snow, public-health (the Chadwick → NHS arc of 🏛️ Government intervention)
  - Hook: "In 1950, scientists proved that smoking causes cancer. In 2007, the government finally banned smoking in workplaces. What took them 57 years?"
  - Roadmap: three arms of 20th-century prevention — mass vaccinations, government legislation, lifestyle campaigns — with lung cancer as the case study threading through all three
- **Suggested components:**
  - `ChapterHookScreen` (True/False) — "The government acted quickly once science proved smoking causes lung cancer." [FALSE — a 57-year delay from 1950 proof to 2007 workplace ban]
  - `PriorKnowledgeRecall` — probe: nhs, john-snow, penicillin, vaccination, public-health

### Section 2 — Learning Chunk 1
- **Purpose:** Mass vaccinations — the government's most direct tool for disease prevention.
- **Proposed content for Episode 13:**
  - First government vaccination campaign: diphtheria (1942); context = wartime air-raid shelters + epidemic risk; result: diphtheria cases plummeted
  - Polio vaccination (1950s): slow uptake at first
  - Jeff Hall: England footballer, young and fit, died of polio 1959; because anyone could catch it, this transformed public demand; extra supplies had to be flown from America
  - National campaigns for measles, COVID-19 (later examples)
  - Pattern: vaccines need public will to be effective — government campaigns alone are sometimes not enough
- **Suggested components:**
  - `VisualNarrativeScreen` — Jeff Hall arc: polio vaccine available (1950s) → slow uptake → Jeff Hall dies (1959) → demand surges → extra supplies flown from USA — the moment one person's death changed a public health campaign
  - `QuickRecallScreen` — retrieval: diphtheria 1942 (wartime shelters), polio 1950s/Jeff Hall 1959, demand surge, extra supplies from USA

### Section 3 — Learning Chunk 2
- **Purpose:** Government legislation — the direct intervention in behaviour through law.
- **Proposed content for Episode 13:**
  - Liberal government reforms 1906–14: free school meals (1906), medical checks in schools (1907), National Insurance Act (1911); Boer War context (one-third of volunteers rejected for poor health)
  - Clean Air Acts 1956 and 1968: London smog episodes
  - Smoking legislation timeline: 1965 (TV ban) → 2005 (complete ban) → 2007 (workplace ban + age raised from 16 to 18) → 2015 (cars with children)
  - The conflict of interest: 1985 — smoking deaths cost NHS £165m; tobacco tax earned government £4bn
  - Other legislation: food packaging must show dietary information; plain cigarette packaging
- **Suggested components:**
  - `TimelineChain` — smoking legislation timeline: 1950 (science proof) → 1965 (TV ban) → 2005 (full ban) → 2007 (workplace ban) → 2015 (cars); each step with why it happened and what it shows about government reluctance
  - `MisconceptionCheck` — "The government acted quickly once the science was clear about smoking" [FALSE — 57 years]; "Jeff Hall was a famous scientist" [FALSE — England footballer]

### Section 4 — Learning Chunk 3
- **Purpose:** Lung cancer case study — the full picture: diagnosis, treatment, and prevention.
- **Proposed content for Episode 13:**
  - Lung cancer = UK's second most common cancer; rise linked to rise in smoking (British Medical Research Council, 1950)
  - Diagnosing lung cancer: was hard (usually advanced when detected); X-rays were inaccurate; now: CT scans with dye (detailed image), bronchoscope (tissue sample)
  - Treating lung cancer: removing part/all of lung; lung transplant; radiotherapy (radiation shrinks tumour); chemotherapy (drugs shrink tumour); genetic research into cancer cell genes
  - Preventing lung cancer: government campaigns + legislation (see Section 3); anti-smoking advertising campaigns; dangers of smoking taught in schools; increased tobacco taxation
- **Suggested components:**
  - `ExplainReveal` — lung cancer chain: smoking (cause) → CT/bronchoscope (diagnosis) → surgery/radiotherapy/chemotherapy (treatment) → government campaigns + legislation (prevention)
  - `QuickRecallScreen` — retrieval: 1950 British MRC study, CT scan, bronchoscope, radiotherapy, chemotherapy, £165m vs £4bn (1985)

### Section 5 — Learning Chunk 4
- **Purpose:** Significance — government as active agent; the laissez-faire to intervention arc completed; agents of change.
- **Proposed content for Episode 13:**
  - Government lifestyle campaigns: Stoptober, Change4Life, advertising about smoking/drugs/alcohol/unprotected sex
  - The laissez-faire arc completed: from "government doesn't interfere" (before 1848, Ep 8) → Second Public Health Act 1875 → NHS 1948 → smoking bans 2007 — government now actively manages individual health choices
  - Agent review: 🏛️ Government (vaccination campaigns, legislation, lifestyle campaigns); 👤 Individuals (Jeff Hall — showed anyone could be affected); 🔬 Science & technology (British MRC study, CT scans, genetics research); ⚔️ War (diphtheria vaccine driven by WWII air-raid shelters; blood banks WWI)
  - The future challenge: antibiotic resistance (penicillin-resistant bacteria, Ep 11 echo); new diseases; ageing population
- **Suggested components:**
  - `ColSortBlock` — sort 20th-century government health interventions into "direct legislation" vs "education/campaigns" vs "free access" — shows the three arms of modern prevention
  - `QuickRecallScreen` — final retrieval across all episode facts: diphtheria 1942, Jeff Hall 1959, Liberal reforms 1906–14, Boer War context, Clean Air Acts, 1950 MRC study, 2007 smoking ban

### Section 6 — Summary & Examiner
- **Suggested components:**
  - `ExaminerExplainsScreen` — examiner explains how to answer "how far did government action improve public health in the 20th century?" — agree (NHS, vaccinations, smoking legislation, social reforms) / counter (slow on smoking due to financial conflict, National Insurance Act limited in scope). Key sophistication: the tobacco tax vs NHS cost conflict (1985) — the most powerful counter argument
  - `FaceTheExaminer` — 16-mark "how far did government action improve public health in the twentieth century?" or 12-mark "explain why the government introduced mass vaccination programmes"
  - `ChapterCompleteScreen`

### Module Completion Test
- [ ] Section 1 includes retrieval (PriorKnowledgeRecall)
- [ ] Weak spots are generated
- [ ] Every learning chunk includes interaction
- [ ] Every learning chunk includes retrieval
- [ ] Interleaving exists throughout the module
- [ ] Weak spots are revisited in-module
- [ ] Core chapter message is reinforced
- [ ] Examiner content appears only in Section 6
- [ ] Module ends with a completion screen
- [ ] No feature component is used more than twice in the module

---

## 3. Current state & gap analysis

Built (shared) as `mod9` — also covers Episode 12. `mod9` has 10 screens and no tags.

With no tags and no `history.js` audit, the content distribution between the 10 screens in `mod9` is unverifiable. The shared status with Episode 12 means some of these 10 screens may contain Episode 12 content (modern medicine, NHS, genetics) mixed with Episode 13 content (prevention, lung cancer).

**BUNDLING:**
The highest priority action is splitting mod9 into two separate modules. Until this is done, Episode 13 cannot be assessed as a coherent learning unit.

**GAPS (all, given no tags):**
- No `diphtheria-vaccination` tag — 1942 first vaccination campaign unconfirmed
- No `polio-jeff-hall` tag — Jeff Hall 1959 case study unconfirmed
- No `liberal-reforms` tag — Liberal government 1906–14 social reforms unconfirmed
- No `boer-war-health` tag — Boer War context for Liberal reforms unconfirmed
- No `clean-air-act` tag — 1956/1968 Clean Air Acts unconfirmed
- No `smoking-legislation` tag — 1950→2007 smoking legislation timeline unconfirmed
- No `lung-cancer-case-study` tag — lung cancer diagnosis/treatment/prevention case study unconfirmed
- No `lifestyle-campaigns` tag — Stoptober/Change4Life/advertising campaigns unconfirmed
- No `prior-knowledge-recall` tag — Section 1 PriorKnowledgeRecall absent
- No `chapter-complete` tag — ChapterCompleteScreen absent

---

## 4. Build recommendations

1. **Storyline integration (🏛️ Government arc completion):** Core takeaway — government prevention is slower and harder than government cure because it requires overriding commercial interests and individual freedom — should thread as: Section 1 hook (57-year delay from proof to ban), Section 2 (Jeff Hall = individual death doing what government campaigns couldn't), Section 3 (1985 conflict of interest — £165m vs £4bn), Section 4 (lung cancer case study = science enabling prevention), Section 5 (laissez-faire arc completed). Each section adds one complication to the "government as prevention agent" story.

2. **Resolve mod9 bundling (highest priority — same as Episode 12):** Create a new standalone module `history-medicine-modern-prevention` for Episode 13. Move all prevention/lung cancer/vaccination content into it. This is blocked until someone audits `src/modules/history.js` to see what mod9 currently contains.

3. **Jeff Hall case study (Section 2 — highest exam priority):** The Jeff Hall story is one of the most memorable in the series — a young, fit, famous footballer dying of a disease that people thought mainly affected children. The specific details (1959, England footballer, extra supplies from America) are exam-testable and should receive a dedicated `VisualNarrativeScreen` or `KeyFigureReveal`.

4. **The tobacco tax conflict of interest (Section 3):** The £165m vs £4bn contrast (1985) is the most powerful single piece of evidence for the exam counter-argument in any government intervention question. It must be taught explicitly and with the specific numbers — not just mentioned. A `CinematicRevealMoment` or dedicated `QuickRecallScreen` is appropriate.

5. **Liberal government reforms and Boer War interleaving (Section 3):** The Boer War connection to Liberal reforms 1906–14 is an excellent interleaving opportunity: the war (⚔️) exposed poor national health → government acted on prevention. This parallels WWI → blood banks → transfusions (Ep 12) and WWII → NHS (Ep 12). The ⚔️ War → 🏛️ Government intervention pattern is one of the series' strongest recurring themes.

6. **Lung cancer case study as thread (Sections 3–5):** The lung cancer case study should thread across Sections 3–4 rather than appearing only once — use it as the running example throughout. Smoking legislation (Section 3) → diagnosis and treatment (Section 4) → prevention campaigns (Section 5). This gives the episode narrative coherence that matches its title "Can We Beat Cancer?"

7. **Episode 14 handoff:** End of Episode 13: "By the 21st century, Britain had vaccination programmes, anti-smoking campaigns, and the NHS. But we haven't always had the luxury of planning ahead. A hundred years earlier, thousands of young men were dying not in hospital wards but in the mud of northern France — and the doctors who treated them had to improvise everything." Sets up the Western Front (Episode 14).

