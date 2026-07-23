/// ── Group 1: CinematicCarousel ───────────────────────────────────────────────
// Shape: { title, intro, items:[{id,image,alt,name,facts?/fact?}] }
// Fixture: four cell organelles (Biology). Images use existing figures where
// available; MediaPlaceholder-style governed fallbacks handled inside component.
export const cinematicCarousel = {
  title: 'Inside the cell',
  intro: 'Four organelles. Four jobs.',
  items: [
    { id: 'nucleus',   label: 'Nucleus',        image: '/figures/biology/building-blocks/animal-cell-clean.png', alt: 'Nucleus',
      facts: ['Controls the cell and contains DNA', 'GCSE: holds the genetic material as chromosomes'] },
    { id: 'mito',      label: 'Mitochondria',   image: '/figures/biology/building-blocks/animal-cell-hotspot.png', alt: 'Mitochondria',
      facts: ['Site of aerobic respiration', 'GCSE: releases energy from glucose'] },
    { id: 'ribosomes', label: 'Ribosomes',      image: '/figures/biology/building-blocks/animal-cell-clean.png', alt: 'Ribosomes',
      facts: ['Where proteins are made', 'GCSE: site of protein synthesis'] },
    { id: 'membrane',  label: 'Cell membrane',  image: '/figures/biology/building-blocks/animal-cell-bg.png', alt: 'Cell membrane',
      facts: ['Controls what enters and leaves', 'GCSE: partially permeable barrier'] },
  ],
}

// ── Group 1: GraphView — scatter (Maths) ─────────────────────────────────────
// Shape: { graphType, title, caption, xLabel, yLabel, points:[{x,y}], lineOfBestFit, xMin.. }
export const graphViewScatter = {
  graphType: 'scatter',
  title: 'Revision vs test score',
  caption: 'Each point is one student.',
  xLabel: 'Hours revised',
  yLabel: 'Test score (%)',
  points: [
    { x: 1, y: 42 }, { x: 2, y: 48 }, { x: 3, y: 55 }, { x: 4, y: 61 },
    { x: 5, y: 64 }, { x: 6, y: 72 }, { x: 7, y: 75 }, { x: 8, y: 83 },
    { x: 9, y: 88 }, { x: 10, y: 91 },
  ],
  lineOfBestFit: { from: { x: 1, y: 44 }, to: { x: 10, y: 90 } },
  xMin: 0, xMax: 10, yMin: 0, yMax: 100,
}

// ── Group 1: GraphView — line (Biology) ──────────────────────────────────────
export const graphViewLine = {
  graphType: 'line',
  title: 'Enzyme activity vs temperature',
  caption: 'Each point is one temperature reading.',
  xLabel: 'Temperature (°C)',
  yLabel: 'Rate of reaction',
  points: [
    { x: 0, y: 2 }, { x: 10, y: 8 }, { x: 20, y: 20 }, { x: 30, y: 42 },
    { x: 37, y: 60 }, { x: 40, y: 52 }, { x: 45, y: 28 }, { x: 50, y: 6 }, { x: 60, y: 0 },
  ],
  xMin: 0, xMax: 60, yMin: 0, yMax: 65,
}

// ── Group 1: TimelineChain (History) ─────────────────────────────────────────
// Shape: { title, intro, steps:[{id,icon?,label,detail}] }
// Fixture emphasises causation (why each step led to the next), not dates.
export const timelineChain = {
  title: 'From germ theory to safe surgery',
  intro: 'Tap each step to see why it led to the next.',
  steps: [
    { id: 'pasteur', icon: '🔬', label: 'Pasteur proves germ theory',
      detail: 'Pasteur showed that microbes in the air caused decay and disease. For the first time there was a real cause to fight, not just bad air.' },
    { id: 'lister', icon: '🧴', label: 'Lister applies it to surgery',
      detail: 'If germs caused infection, killing them should prevent it. Lister used carbolic acid to kill microbes on wounds and instruments.' },
    { id: 'antiseptic', icon: '🩹', label: 'Antiseptic surgery cuts infection',
      detail: 'Deaths from infection after operations fell sharply. This proved germs — not miasma — caused surgical infection.' },
    { id: 'aseptic', icon: '🧼', label: 'Aseptic surgery develops',
      detail: 'Rather than kill germs during surgery, surgeons now kept them out entirely: sterilised instruments, gowns and gloves. Prevention replaced treatment.' },
  ],
}
// ── Group 2: OppositeQualitiesReveal (History) — reuses story shape ──────────
export const oppositeQualitiesReveal = {
  type: 'oppositeQualitiesReveal',
  title: 'Hot or cold?',
  copy: 'Doctors used symptoms to decide which quality was strongest.',
  visualPair: 'warmCool',
  backgroundImage: '/figures/history/medicine/medieval/opposite-qualities-background.svg',
  backgroundOpacity: 1,
  leftConcept: { label: 'Hot', icon: '☀', items: ['Fever', 'Red face', 'Flushed skin'] },
  rightConcept: { label: 'Cold', icon: '❄', items: ['Pale skin', 'Chills', 'Shivering'] },
  sequence: [
    { item: 'Fever', side: 'left' }, { item: 'Chills', side: 'right' },
    { item: 'Red face', side: 'left' }, { item: 'Pale skin', side: 'right' },
    { item: 'Flushed skin', side: 'left' }, { item: 'Shivering', side: 'right' },
  ],
  closingCaption: 'Doctors judged whether an illness seemed hot or cold, then treated with the opposite.',
}
// ── Group 2: TimelineCanvas (History) — production Episode-2 spatial journey ──
// Horizontal travel is part of the meaning here. TimelineChain remains the compact
// causal-sequence alternative.
export const timelineCanvas = {
  title: 'How the plague travelled',
  intro: 'Swipe to follow the plague’s journey from central Asia to England. Tap + to reveal why each stage mattered.',
  steps: [
    {
      id: 'central-asia',
      image: '/figures/history/medicine/black-death/trade-routes-map.png',
      label: 'It began in central Asia',
      detail: 'The Black Death began in central Asia, probably in the late 1330s. It spread west along trade routes that also carried spices, silk and grain.',
      stats: ['c.1338', 'Central Asia'],
    },
    {
      id: 'ship',
      image: '/figures/history/medicine/black-death/plague-dock.png',
      label: 'Trade ships carried it to England',
      detail: 'By 1347, the plague had devastated cities around the Mediterranean. Ships from infected ports sailed north with infected animals aboard. The Black Death reached England at Melcombe in June 1348.',
      stats: ['June 1348', 'Melcombe, Dorset'],
    },
    {
      id: 'spread-inland',
      image: '/figures/history/medicine/black-death/medieval-town.png',
      label: 'From the ports it followed the trade roads',
      detail: 'The plague moved inland along the same roads used for trade. It reached Bristol and London within months. Towns, monasteries and villages on these routes suffered most.',
      stats: ['Late 1348', 'Bristol and London'],
    },
    {
      id: 'england',
      image: '/figures/history/medicine/black-death/trade-routes-map.png',
      label: 'By 1350 it had reached Scotland',
      detail: 'From Melcombe, the plague swept across England and into Scotland. Historians estimate it killed one-third to one-half of England’s population by 1350 — the worst disaster in English history.',
      stats: ['By 1350', '~30–50% mortality'],
    },
  ],
}

// ── Group 2: BeforeAfterImageSlider (History) — Episode 13's live screen ─────
export const beforeAfterImageSlider = {
  beforeSrc: '/figures/history/medicine/modern/lungs-healthy.png',
  afterSrc: '/figures/history/medicine/modern/lungs-cancer.png',
  beforeAlt: 'Healthy lungs',
  afterAlt: 'Lungs damaged by smoking',
  beforeLabel: 'Healthy lungs',
  afterLabel: 'Damaged lungs',
  heading: 'What does smoking do to your lungs?',
  revealText: 'Smoking is the biggest cause of lung cancer in the UK.',
  initial: 50,
}

// ── Group 2: OrderedRouteTask (History) — reuses story shape ─────────────────
export const evacuationChainRoute = {
  type: 'orderedRouteTask',
  tag: 'chain-of-evacuation-recall',
  title: 'Rebuild the evacuation chain',
  titleHighlight: 'evacuation chain',
  subtitle: 'Tap a job, then choose its stage.',
  prompt: 'Where did this happen?',
  weakGroup: 'Evacuation chain',
  completionText: 'Five stages, each one further from the fighting. Q1 often asks for two features of one stage — precise details like these win the marks.',
  backgroundImage: '/headers/history-medicine-trenches.png',
  stages: [
    { id: 's-bearers', icon: 'helmet', title: 'Stretcher bearers',                clue: 'From the front line',   answerId: 'a-bearers' },
    { id: 's-rap',     icon: 'cross',  title: 'Regimental Aid Post',              clue: 'Close to the front',    answerId: 'a-rap' },
    { id: 's-ads',     icon: 'hut',    title: 'Advanced / Main Dressing Station', clue: 'About 400 metres back', answerId: 'a-ads' },
    { id: 's-ccs',     icon: 'train',  title: 'Casualty Clearing Station',        clue: 'Near railways',         answerId: 'a-ccs' },
    { id: 's-base',    icon: 'ship',   title: 'Base Hospital',                    clue: 'On the French coast',   answerId: 'a-base' },
  ],
  answers: [
    { id: 'a-bearers', text: 'First to reach the wounded, carrying them out through mud and shellfire' },
    { id: 'a-rap',     text: 'Gave basic first aid so minor wounds could return to the fight' },
    { id: 'a-ads',     text: 'Treated more serious injuries in tents and abandoned buildings' },
    { id: 'a-ccs',     text: 'Performed most surgery on the Western Front and sorted the wounded by triage' },
    { id: 'a-base',    text: 'Gave longer-term treatment and sent the most serious cases back to Britain' },
  ],
}

// ── Group 2: SpotTheError (Biology) ──────────────────────────────────────────
// Shape: { id, statement, errorTarget, whatWasWrong, correctVersion,
//          examinerNote?, commonTrap?, missHeading?,
//          explanationCriteria?: { anyOf?, allOf?, supportingAnyOf? },
//          keyTerms? (legacy — treated as explanationCriteria.anyOf),
//          explanationHint?, explanationPraise?,
//          repairKeyTerms?, acceptableRepairs?, repairMustAvoid?,
//          minimumExplanationLength?, minimumRepairLength? }
export const spotTheError = {
  id: 'spot-photosynthesis',
  statement: 'Photosynthesis takes place in the mitochondria of plant cells, using carbon dioxide and water to produce glucose and oxygen.',
  errorTarget: 'mitochondria',
  whatWasWrong: 'Photosynthesis happens in the chloroplasts, not the mitochondria. Mitochondria are the site of respiration.',
  correctVersion: 'Photosynthesis takes place in the chloroplasts of plant cells, using carbon dioxide and water to produce glucose and oxygen.',
  explanationCriteria: { anyOf: ['chloroplast', 'chloroplasts'], supportingAnyOf: ['mitochondria', 'respiration'] },
  explanationHint: 'Your explanation needs to identify the chloroplast as the site of photosynthesis.',
  repairKeyTerms: ['chloroplast'],
  repairMustAvoid: ['mitochondria'],
  missHeading: 'Not quite — compare the two organelles.',
  commonTrap: 'Students often confuse the sites of photosynthesis and respiration.',
  examinerNote: 'Naming the correct organelle is worth an easy mark — do not throw it away.',
}

// ── Group 2: MedicalTheoryPrescription (History) — screen shape ───────────────
// Shape: { stage, label, contextName, openingPractitioner, theories:[{id,label,
//          shortLabel,icon,scenePrompt,introText,...}], finalMessage? }
export const medicalTheoryPrescription = {
  stage: 'Medieval treatments',
  label: 'What caused illness?',
  contextName: 'Thomas',
  openingPractitioner: 'priest',
  theories: [
    { id: 'god-sin', label: 'God & Sin', shortLabel: 'God & Sin',
      scenePrompt: "What does the priest think causes Thomas's illness?",
      introText: 'Different people had different explanations.',
      cause: 'God is punishing sin.', prescription: 'Prayer, confession and pilgrimage.',
      reveal: 'If God sent the illness, only repentance could lift it.' },
    { id: 'humours', label: 'Four humours', shortLabel: 'Humours',
      scenePrompt: 'What does the physician think is wrong?',
      introText: 'The physician trusts Galen.',
      cause: 'The four humours are out of balance.', prescription: 'Bloodletting and purging.',
      reveal: 'Removing "excess" blood was meant to restore balance.' },
    { id: 'miasma', label: 'Bad air', shortLabel: 'Miasma',
      scenePrompt: 'What does the townsperson blame?',
      introText: 'The streets smell foul.',
      cause: 'Bad air (miasma) spreads disease.', prescription: 'Burn sweet herbs and clean the streets.',
      reveal: 'Sweetening the air was thought to drive out the disease.' },
  ],
  finalMessage: 'Each explanation led to a different, logical-seeming treatment — none of which addressed the real cause.',
}

// ── Comparison: MatchingTask (History) — reuses shipped Episode-2 shape ───────
export const matchingTask = {
  type: 'matchingTask',
  title: 'Match belief to response',
  instruction: 'Match each belief to the response it made seem logical.',
  weakAreaCategory: 'Component Review (dev)',
  pairs: [
    { id: 'god-response',       term: 'God sent the plague',    answer: 'Prayer, confession and repentance.' },
    { id: 'miasma-response',    term: 'Bad air caused disease', answer: 'Burn herbs and clean streets.' },
    { id: 'astrology-response', term: 'Planets caused disease', answer: 'Consult astrological charts.' },
    { id: 'humours-response',   term: 'Humours out of balance', answer: 'Bloodletting and purging.' },
  ],
}

// ── Comparison: VisualLearning (History) — reuses shipped Episode-2 shape ─────
export const visualLearning = {
  scenes: [
    { headline: 'Why did people blame the wrong things?',
      body: 'Medieval explanations were not random. They fitted the ideas people already trusted.' },
    { headline: 'Religion gave meaning to disaster.',
      body: 'The Church taught that God could punish sin, so many believed the plague was divine punishment. Prayer and repentance followed logically.' },
    { headline: 'Bad smells seemed dangerous.',
      body: 'Plague towns smelled of rot and waste. Miasma theory said poisonous air caused illness, so burning herbs seemed sensible.' },
    { headline: 'The real cause was invisible.',
      body: 'Bacteria carried by fleas on rats spread the plague — but no one could see them for another 500 years.' },
  ],
}

// ── Comparison: GuidedChoiceCarousel (History) — reuses shipped Episode-1 shape
export const guidedChoiceCarousel = {
  headline: 'Thomas has a fever.\nHe’s coughing blood.',
  question: 'Who should he trust?',
  helperText: 'Swipe to explore your options.',
  options: [
    { title: 'Physician', sections: [
      { heading: 'Favourite methods', items: ['Astrology', 'Urine charts', 'Four Humours'] },
      { heading: 'Cost', items: ['💰💰💰💰💰'] },
    ] },
    { title: 'Wise woman', sections: [
      { heading: 'Favourite methods', items: ['Herbal remedies', 'Practical care'] },
      { heading: 'Cost', items: ['💰'] },
    ] },
    { title: 'Barber surgeon', sections: [
      { heading: 'Favourite methods', items: ['Bloodletting', 'Pulling teeth', 'Lancing boils'] },
      { heading: 'Cost', items: ['💰💰'] },
    ] },
  ],
}

// ── Comparison: TheoryCompareBlock (History) — reuses story shape ─────────────
export const theoryCompareBlock = {
  type: 'theoryCompare',
  oldLabel: 'What people believed',
  oldTitle: 'Three explanations',
  oldPoints: [
    'Cause — God’s punishment, bad air, or astrology',
    'Carrier — bad smells, sinful behaviour, unlucky planets',
    'Spread — poisoned air or divine judgement',
  ],
  newLabel: 'What was actually happening',
  newTitle: 'One real cause',
  newPoints: [
    'Cause — Yersinia pestis bacteria',
    'Carrier — fleas living on black rats',
    'Spread — flea bites, infected rats, trade routes',
  ],
  takeaway: 'They blamed God, miasma and the planets. The real cause was a bacterium carried by fleas on black rats.',
}

// ── Comparison: MisconceptionCheck (History) — reuses shipped Episode-2 shape ─
export const misconceptionCheck = {
  id: 'trap-medicine-changed',
  statements: [
    { statement: 'The Black Death changed medicine because people finally discovered what caused disease.',
      answer: false,
      reveal: 'The Black Death changed society, but not medical understanding. People kept using the same explanations — God, miasma, astrology and humours. No better theory replaced them for centuries.' },
  ],
}

// ─── Phase-5 additions: kept registered components (refine-in-one-place) ─────

// FactorWeb (History) — the ConnectionMap survivor. Mirrors the migrated
// Episode-1 "web of medieval belief" screen.
export const factorWeb = {
  type: 'factorWeb',
  title: 'The web of medieval belief',
  instruction: 'Explore each belief. Then decide which shaped medicine most.',
  mode: 'causes',
  centreLabel: 'Why people got ill',
  judgementTitle: 'Which belief shaped medicine most?',
  factors: [
    { id: 'supernatural', title: "God's punishment", subtitle: 'Divine retribution',
      whatItMeans: 'Most people believed sin angered God, who sent illness as punishment.',
      whyItMattered: 'It made prayer and pilgrimage — not medicine — the logical response.',
      linkedFactor: "The Church's authority made this the dominant explanation." },
    { id: 'astrology', title: 'Stars and planets', subtitle: 'Astrology',
      whatItMeans: 'Physicians believed the planets controlled bodily health.',
      whyItMattered: 'Doctors consulted zodiac charts before bloodletting or prescribing.',
      linkedFactor: 'Astrology decided when to rebalance the humours.' },
    { id: 'humours', title: 'Four humours', subtitle: "Galen's theory",
      whatItMeans: 'Illness meant the four humours were out of balance.',
      whyItMattered: 'Treatment aimed to restore balance through bloodletting and diet.',
      linkedFactor: "This was Galen's theory, protected by his authority." },
    { id: 'miasma', title: 'Bad air (miasma)', subtitle: 'Foul smells',
      whatItMeans: 'Foul-smelling air was thought to cause disease.',
      whyItMattered: 'It accidentally helped: clearing rubbish reduced real disease.',
      linkedFactor: 'Like the humours, it was a natural explanation.' },
    { id: 'galen', title: "Galen's authority", subtitle: 'Frozen knowledge',
      whatItMeans: 'The Church endorsed Galen as truth; schools taught only his texts.',
      whyItMattered: 'Challenging Galen risked punishment, freezing ideas for 1,000 years.',
      linkedFactor: 'His authority protected the four humours from question.' },
    { id: 'experience', title: 'Practical experience', subtitle: 'Folk cures',
      whatItMeans: 'Wise women used centuries of herbal knowledge alongside the theories.',
      whyItMattered: 'Some remedies genuinely worked — willow bark contains salicin.',
      linkedFactor: 'It worked through chemistry, not the physicians’ theories.' },
  ],
}

// ConceptReveal (History) — tap-through atmospheric concept steps.
export const conceptReveal = {
  steps: [
    { mainText: 'The Renaissance was a “rebirth” of learning.',
      supportText: 'Old books were still respected. But people now wanted to test them, not just trust them.',
      backgroundImage: '/headers/history-medicine-through-time.webp' },
    { mainText: 'Humanism told people to use reason and study the world for themselves.',
      supportText: 'This made careful observation matter more. Blind trust in old books felt less safe.',
      backgroundImage: '/headers/history-medicine-through-time.webp' },
    { mainText: 'Universities now held dissection in public anatomy theatres.',
      supportText: 'Doctors and students could watch a real body and check old claims against what they saw.',
      backgroundImage: '/headers/history-medicine-through-time.webp' },
  ],
}

// ExplainReveal (History) — step-by-step reasoning chain.
export const explainReveal = {
  type: 'explainReveal',
  title: 'Why medieval treatments failed',
  intro: 'Build the chain of reasoning step by step.',
  steps: [
    { id: 'belief', statement: 'People believed disease spread through', emphasis: 'bad air.', detail: 'This was called miasma theory.', icon: '⚕' },
    { id: 'action', statement: 'So they tried to', emphasis: 'sweeten the air,', detail: 'burning herbs and carrying posies.' },
    { id: 'cause', statement: 'But the real cause was', emphasis: 'microbes,', detail: 'which no one could see or understand yet.' },
    { id: 'result', statement: 'So the treatments', emphasis: 'could not work,', detail: 'because they never addressed the real cause.' },
  ],
  reflectionPrompt: 'Can you explain why these treatments failed?',
}

// ColSortBlock (History) — sort items into labelled columns.
export const colSort = {
  type: 'colsort',
  columns: [
    { label: 'Changed', color: '#D4950A', bg: 'rgba(212,149,10,.07)' },
    { label: 'Continued', color: '#A89070', bg: 'rgba(168,144,112,.07)' },
  ],
  items: [
    { label: 'Human anatomy became more accurate', col: 0, explanation: 'Vesalius corrected Galen using real human bodies.' },
    { label: 'Observation could challenge ancient books', col: 0, explanation: 'Doctors could now trust what they saw.' },
    { label: 'Printed diagrams spread new evidence', col: 0, explanation: 'Printing carried accurate drawings across Europe.' },
    { label: 'The four humours still guided treatment', col: 1, explanation: 'Doctors still explained illness as imbalance.' },
    { label: 'Bloodletting and purging continued', col: 1, explanation: 'Everyday treatment barely changed.' },
  ],
}

// QuoteAnalyser (English) — tap-through analysis of a literary quote.
export const quoteAnalyser = {
  type: 'quoteAnalyser',
  quote: '"Stars, hide your fires; let not light see my black and deep desires."',
  location: 'Act I, Scene IV — Macbeth',
  items: [
    { id: 'word-focus', icon: 'search', heading: 'Word focus', explainer: 'Dissect key words',
      content: { title: 'Key words unpacked', body: 'The imperatives "hide" and "let not" show Macbeth commanding even the stars. "Black and deep desires" admits guilt before the act.', keyWords: ['hide', 'fires', 'black', 'desires'] } },
    { id: 'connotations', icon: 'feather', heading: 'Connotations', explainer: 'Implied meanings',
      content: { title: 'Connotations', body: '"Stars" and "fires" connote fate, light and divine order — ordering them to hide signals a violation of natural law.' } },
    { id: 'methods', icon: 'mask', heading: 'Methods', explainer: 'Literary devices',
      content: { title: 'Methods', body: 'Dark imagery and the apostrophe to the stars externalise Macbeth’s inner conflict.' } },
  ],
}

// AcronymMemorise (Biology) — tap-to-reveal SCARF mnemonic (five uses of glucose).
// Shape: { label?, items:[{ letter, word, detail }] }. From Plant Cells &
// Photosynthesis (sci_bio_w1), block type: acronymMemorise.
export const acronymMemorise = {
  label: 'SCARF — tap each letter to reveal',
  items: [
    { letter: 'S', word: 'Starch',
      detail: 'Glucose is converted to starch for storage. Starch is insoluble so it doesn’t affect osmosis. Stored in chloroplasts and other parts of the plant.' },
    { letter: 'C', word: 'Cellulose',
      detail: 'Used to make cellulose for cell walls. This gives the plant structural support. Wood is mostly cellulose.' },
    { letter: 'A', word: 'Amino acids',
      detail: 'Combined with nitrates from the soil to make amino acids, which are then used to build proteins. No nitrates = no proteins = stunted growth.' },
    { letter: 'R', word: 'Respiration',
      detail: 'Used in aerobic respiration to release energy for growth, reproduction, active transport and other cell processes.' },
    { letter: 'F', word: 'Fats and oils',
      detail: 'Some glucose is converted into lipids (fats and oils) for storage — especially in seeds. Seeds are often very high in fats.' },
  ],
}

// BuilderBlock (Biology) — tap-to-fill equation builder with distractor pieces.
// Shape: { label?, slots, operators?, pieces, answer, hint, successText }. From
// Plant Cells & Photosynthesis (sci_bio_w1), block type: builder.
export const builderBlock = {
  layout: 'reaction',
  label: 'Build the photosynthesis equation',
  slots: [null, null, null, null],
  operators: ['+', '→', '+'],
  pieces: ['carbon dioxide', 'water', 'glucose', 'oxygen', 'nitrogen', 'starch'],
  answer: ['carbon dioxide', 'water', 'glucose', 'oxygen'],
  hint: 'Two things go IN (reactants), two things come OUT (products). Light energy drives the reaction.',
  successText: 'Carbon dioxide + water → glucose + oxygen. Light energy drives the reaction. This is the foundation of almost all life on Earth.',
}

export const builderMaths = {
  layout: 'equation',
  label: 'Complete the calculation',
  instruction: 'Choose the missing value.',
  template: '36 ÷ {{0}} = 6',
  slots: [null],
  pieces: [4, 6, 8, 12],
  answer: [6],
  hint: 'Use the inverse: which number multiplied by 6 gives 36?',
  successText: '36 ÷ 6 = 6, because 6 × 6 = 36.',
}

export const builderQuote = {
  layout: 'quote',
  label: 'Rebuild the quotation',
  instruction: 'Choose the missing words to restore Macbeth’s line.',
  template: '“Is this a {{0}} which I see before me,\nThe {{1}} toward my hand?”',
  slots: [null, null],
  pieces: ['dagger', 'handle', 'crown', 'blood'],
  answer: ['dagger', 'handle'],
  hint: 'Picture the object Macbeth thinks he can see and the part pointing towards him.',
  successText: 'The completed quotation is ready to use as evidence about Macbeth’s disturbed state of mind.',
}

// ChapterOutcomeScreen (Biology) — full-screen chapter-opening outcomes reveal.
// Shape: { chapterTitle, outcomes:[string] }. From Plant Cells & Photosynthesis
// (sci_bio_w1) outcomes.bullets.
export const chapterOutcome = {
  chapterTitle: 'Plant Cells & Photosynthesis',
  outcomes: [
    'Identify plant cell structures and explain their jobs',
    'Explain what the photosynthesis equation means',
    'Connect photosynthesis, respiration and food chains',
  ],
}

// ChapterCompleteScreen (History) — end-of-chapter completion screen with the
// checkmark ring, "Complete" headline, continue-to-next-chapter primary CTA,
// quick-quiz row and Return Home. Shape mirrors chapterCompleteData in LegacyApp.
export const chapterComplete = {
  completedChapter: 'The boy, the cow and the cure',
  supportingCopy: "That's another one locked in.",
  nextChapterNum: 8,
  nextChapterTitle: 'The invisible enemy',
  nextChapterLabel: 'Chapter',
}

// KeyFigureReveal (History) — scrollable portrait hero + knowledge sections.
export const keyFigureReveal = {
  portrait: '/figures/history/medicine/medieval/hippocrates-portrait.webp',
  name: 'Hippocrates',
  role: 'Ancient Greek doctor',
  sections: [
    { title: 'Who was he?', icon: 'ancient-figure',
      lines: ['One of the first doctors to argue that illness had natural causes, not just supernatural ones.'] },
    { title: 'Four humours', icon: 'medicine',
      lines: ['He suggested the body held four fluids — blood, phlegm, yellow bile and black bile.', 'Illness meant these were out of balance.'] },
    { title: 'Why he mattered', icon: 'legacy',
      lines: ['His idea of natural causes shaped Western medicine for the next 2,000 years.'] },
  ],
}

// MemoryHook (Biology) — in-page "make it stick" analogy/mnemonic reminder with
// a learner-edit affordance. Shape: { id?, label?, hook, image?, imageAlt? }.
// Block type: memoryHook.
export const memoryHook = {
  id: 'bio-virus-hacker',
  label: 'Memory hook',
  hook: "Think of a virus as a tiny 'hacker' that sneaks in, takes over, and makes copies of itself.",
  image: '/headers/bio-diseasewars.webp',
  imageAlt: 'Stylised virus particle in a dark, cinematic scene',
}

// InteractiveHotspotImage (History) — full-screen image with an intro → explore
// two-phase flow; tap glowing points to read each hotspot. Shape:
// { title, introText, image, imageAlt, ctaLabel, hotspots:[{id,x,y,shortLabel,title,icon,description,extraFact}] }.
// Fixture: Episode 1 "Tap the Four Humours" (type: interactiveImage).
export const interactiveHotspotImage = {
  title: 'Tap the Four Humours',
  introText: 'Medieval doctors believed the body contained four vital fluids. Each humour had its own qualities — and its own associated illness when it went out of balance.',
  image: '/figures/history/medicine/medieval/four-humours-body.webp',
  imageAlt: 'Medieval symbolic body diagram showing the positions of the Four Humours',
  ctaLabel: 'Explore the body',
  hotspots: [
    { id: 'blood', x: 18, y: 18, shortLabel: 'Blood', title: 'Blood', icon: '🩸',
      description: 'Linked with warmth, energy and a cheerful personality. Too much blood could be blamed for fever or a red face.',
      extraFact: 'If a physician diagnosed excess blood, they would use bloodletting — cutting a vein or applying leeches — to "restore balance."' },
    { id: 'phlegm', x: 82, y: 18, shortLabel: 'Phlegm', title: 'Phlegm', icon: '💧',
      description: 'Linked with coldness and calmness. Too much phlegm could be linked to coughs, colds and sluggishness.',
      extraFact: 'The word "phlegmatic" — meaning calm and unemotional — comes directly from this humour.' },
    { id: 'yellow_bile', x: 18, y: 82, shortLabel: 'Yellow Bile', title: 'Yellow Bile', icon: '🔥',
      description: 'Linked with heat and anger. Too much yellow bile could be blamed for fever or vomiting sickness.',
      extraFact: 'Someone described as "bilious" — irritable or short-tempered — is still using this ancient medical vocabulary today.' },
    { id: 'black_bile', x: 82, y: 82, shortLabel: 'Black Bile', title: 'Black Bile', icon: '🌙',
      description: 'Linked with sadness and melancholy. Too much black bile could be blamed for low mood or a wasting illness.',
      extraFact: 'The word "melancholy" comes from the Greek for "black bile." Medieval doctors thought depression was literally a bodily fluid problem.' },
  ],
}

// CinematicRevealMoment (History) — full-screen video that plays, then reveals
// staggered text over a darkening still. Shape:
// { label, videoSrc, fallbackImage, year, headline, body }.
// Fixture: Episode 2 Black Death opening (type: cinematic). This exact label +
// headline + body triggers the component's refined "June 1348." reveal copy.
export const cinematicRevealMoment = {
  label: 'ENGLAND, 1348',
  videoSrc: '/videos/black-death-intro.mp4',
  fallbackImage: '/figures/history/medicine/black-death/plague-background.png',
  year: '1348',
  headline: 'Something is coming.',
  body: 'In June 1348, ships docked at Melcombe in Dorset.\n\nWithin weeks, people began to die.\n\nThe disease moved fast — through towns, villages, and monasteries.\n\nNo one knew what it was. No one knew how to stop it.',
}

// Infographic (History) — heading + intro (TeachScreenShell) then one governed
// infographic media slot (MediaPlaceholder). Shape: { heading, intro, media }.
// Fixture: Episode 1 "Galen treated with opposites" as a progressive quadrant
// reveal (media.kind: imageReveal), matching the built screen.
export const infographic = {
  heading: 'Galen treated with opposites',
  intro: "Galen took Hippocrates' theory of the Four Humours one step further. He believed illness happened when one humour became too dominant — so treatment should use the opposite qualities to restore balance.",
  media: {
    kind: 'imageReveal',
    aspect: '1:1',
    caption: {
      interval: 1500,
      images: {
        topLeft: '/figures/history/medicine/medieval/four-humours-blood.webp',
        topRight: '/figures/history/medicine/medieval/four-humours-yellow-bile.webp',
        bottomLeft: '/figures/history/medicine/medieval/four-humours-phlegm.webp',
        bottomRight: '/figures/history/medicine/medieval/four-humours-black-bile.webp',
      },
      alt: 'The four humours revealed one quadrant at a time: blood (hot and wet), yellow bile (hot and dry), phlegm (cold and wet) and black bile (cold and dry), with arrows crossing the centre to link each humour to its opposite',
      parts: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
      opposites: [
        ['topLeft', 'bottomRight'],
        ['topRight', 'bottomLeft'],
      ],
      finished: 'Hot was treated with cold. Wet was treated with dry. The aim was to restore balance.',
    },
  },
}

// ── FaceTheExaminer (History) ────────────────────────────────────────────────
// Shape: { type, board, subject, question, marks, mark, summary, markScheme,
//          sampleAnswer, annotations:[{id,target,occurrence,type,comment}],
//          improvementPrompts, criteriaOptions }
// Fixture: an 8-mark Edexcel "explain two ways" answer marked at 5/8 with a
// mix of weak/strong/irrelevant annotations, so the mark → criteria → reveal →
// improve → re-mark flow is fully exercised. The re-mark step calls /api/examiner
// (no-ops in the lab). Mirrors the module-level examiner from Episode 1.
export const faceTheExaminer = {
  type: '8-mark-explain',
  board: 'edexcel',
  subject: 'history',
  topic: 'medieval-medicine',
  difficulty: 'standard',

  question: 'Explain two ways in which religion influenced medical treatment in medieval England. [8 marks]',
  marks: 8,
  mark: 5,
  summary: 'Some understanding of religious influence shown, but both points need more developed explanation to reach Level 3.',

  markScheme: `Level 3 (6–8 marks): Detailed explanation of two ways with developed reasoning linking religious belief to specific treatments or practices.
Level 2 (3–5 marks): Some explanation of religious influence, but at least one point lacks development.
Level 1 (1–2 marks): Simple identification of religious practices with little or no explanation.
Award marks for any two of (each requiring explanation not just identification):
- Church controlled hospitals/monasteries — explanation must include WHY (belief in Christian duty/God's will/charity)
- Prayer, fasting, pilgrimage as treatments — must link to belief that sin caused disease
- Four Humours theory endorsed by Church — must show HOW this influenced practical treatment
- Physicians trained in Church schools, only Church-approved ideas studied
Do NOT award marks for identifying practices without explaining the religious reasoning.`,

  sampleAnswer: `Religion had a big influence on medical treatment in medieval England. Firstly, the Church ran hospitals and monasteries where sick people could go to get help. Monks and nuns would look after the sick because they believed it was their Christian duty to help others. Secondly, doctors in medieval times believed that illness was caused by God as punishment for sins. This meant that treatments often involved prayer and going on pilgrimages to holy sites, because people thought that if they showed their faith to God, He would cure them. Some people also fasted or confessed their sins as a form of treatment.`,

  annotations: [
    { id: 'ann1', target: 'the Church ran hospitals and monasteries where sick people could go to get help.', occurrence: 1, type: 'weak',
      comment: 'Identified but underdeveloped — WHY did the Church do this?' },
    { id: 'ann2', target: 'Monks and nuns would look after the sick because they believed it was their Christian duty to help others.', occurrence: 1, type: 'strong',
      comment: 'Good — links practice to religious belief.' },
    { id: 'ann3', target: 'illness was caused by God as punishment for sins.', occurrence: 1, type: 'strong',
      comment: 'Accurate causal link.' },
    { id: 'ann4', target: 'because people thought that if they showed their faith to God, He would cure them.', occurrence: 1, type: 'weak',
      comment: 'Vague — needs a specific named example (e.g. Canterbury).' },
    { id: 'ann5', target: 'Some people also fasted or confessed their sins as a form of treatment.', occurrence: 1, type: 'irrelevant',
      comment: 'Third point — only two ways required; this adds no new marks.' },
  ],

  improvementPrompts: {
    ann1: {
      prompt: '+ Explain WHY the Church ran hospitals',
      placeholder: 'e.g. The Church believed caring for the sick was a religious duty — a way of serving God and earning salvation...',
    },
    ann4: {
      prompt: '+ Add a specific example of pilgrimage as treatment',
      placeholder: 'e.g. Pilgrims travelled to the shrine of Thomas Becket at Canterbury Cathedral, believing holy relics could cure disease...',
    },
  },

  criteriaOptions: [
    'Accurate knowledge',
    'Two clear ways',
    'Specific evidence',
    'Explains the impact',
    'Developed explanation',
    'Too vague',
    'Repeats the point',
    'Missing second way',
  ],
}

// GuidedExamResponse `exam` shape — mirrors Episode 3 screen 11 (the Vesalius
// 12-marker) so the lab shows the real independent-write scaffold: dark beat →
// "your turn" intro → section-by-section writing (Reason 1 / Reason 2).
export const guidedExamResponse = {
  board: 'edexcel',
  subject: 'history',
  topic: 'renaissance-medicine',
  beatText: 'Now write it yourself. Two developed reasons.',
  question: 'Explain why Vesalius was able to challenge Galen’s ideas during the Renaissance. (12 marks)',
  marks: 12,
  sections: [
    {
      label: 'Reason 1',
      starter: 'One reason Vesalius could challenge Galen was...',
      placeholder: '...human dissection let him study real bodies. He could compare Galen’s claims with human anatomy, and show errors such as the jaw being one bone...',
    },
    {
      label: 'Reason 2',
      starter: 'A second reason was...',
      placeholder: '...printing. His 1543 book and drawings could be copied and shared widely. This meant more doctors could compare Galen with his evidence...',
    },
  ],
  markScheme: `Total: 12 marks (Edexcel "Explain why" — AO1 knowledge and AO2 explanation). Reward developed reasons, not a list of factors.

Valid reasons (any two developed fully):
- Human dissection — Vesalius studied real human bodies and could test Galen’s claims directly.
- Anatomy theatres — public dissection made observation a normal part of medical study.
- Humanism — reason and direct study made people more willing to question old authority.
- Reformation / weaker Church control — old authority felt less certain, creating space to challenge Galen.
- Vesalius’s individual skill and confidence — he had the ability to dissect, compare and publish.
- Printing — his 1543 book and drawings could be copied accurately and spread widely.

Level 1 (1–4): simple statements, factors listed with little explanation.
Level 2 (5–8): some explanation, but at least one reason is undeveloped.
Level 3 (9–12): two developed reasons, each using precise evidence and explaining how it enabled the challenge.`,
}

// ─── Simple-batch fixtures — fixture-only components added to the lab ─────────

// ChapterHookScreen (History) — chapter-opening true/false warm-up.
// Shape: { chapterNum, chapterTitle, statement, isTrue, accentWords, explanation }.
export const chapterHook = {
  chapterNum: 1,
  chapterTitle: 'A world without germs',
  statement: 'In 1348, most people believed the Black Death was sent by God.',
  isTrue: true,
  accentWords: ['God'],
  explanation: 'Religious explanations dominated. With no knowledge of germs, illness was widely seen as divine punishment for sin.',
}

// FillInTheBlanksBlock (Biology) — inline typed-gap block.
// Shape: { sentences:[{before, after, answer, hints}], correctMsg, wrongMsg }.
export const fillInTheBlanks = {
  type: 'fillblanks',
  sentences: [
    { before: 'The structure of DNA was described as a', after: 'helix.', answer: 'double',
      hints: ['It has two strands twisted together — a double…', 'Two spiralling strands. Double…'] },
    { before: 'Watson and Crick published their DNA model in', after: '.', answer: '1953',
      hints: ['Mid-20th century, after WWII.', 'Two years before the NHS turned seven.'] },
    { before: 'Understanding DNA helped explain how diseases can be', after: 'through families.', answer: 'inherited',
      hints: ['Passed from parent to child — like traits and conditions.', 'Think: family history of cancer, heart disease…'] },
  ],
  correctMsg: 'Good. DNA → double helix → 1953 → inherited disease. That chain scores marks.',
  wrongMsg: 'Look back at the DNA content and try again with the exact term.',
}

// SwipeSort (History) — swipe items into one of two columns.
// Shape: { columns:[{label,color,colorRgb,bg}], items:[{label,col,explanation}], label, explanation }.
export const swipeSort = {
  type: 'naturalSupernaturalSwipe',
  label: '1348 vs 1665',
  columns: [
    { label: 'Changed by 1665', color: '#9A4820', colorRgb: '154,72,32', bg: 'rgba(154,72,32,.07)' },
    { label: 'Still similar', color: '#A89070', colorRgb: '168,144,112', bg: 'rgba(168,144,112,.07)' },
  ],
  items: [
    { label: 'Death bills counted deaths', col: 0, explanation: 'Officials tracked the crisis better.' },
    { label: 'Watchmen guarded houses', col: 0, explanation: 'Government acted in a more organised way.' },
    { label: 'People blamed miasma', col: 1, explanation: 'Bad air was still a major explanation.' },
    { label: 'People prayed', col: 1, explanation: 'Religious ideas continued.' },
    { label: 'No germ theory', col: 1, explanation: 'The real cause was still unknown.' },
  ],
  explanation: 'The Great Plague shows better public action, but not modern medicine.',
}

// InteractiveCollectionExplorer (History) — themed sheets with staged reveals.
// Shape: { title, description, backgroundImage, items:[{id,x,y,label,reveals:[{text}]}], synthesis }.
export const collectionExplorer = {
  title: 'Staying well in 1400',
  description: 'Tap each object to find out how people tried to stay healthy — before anyone knew about germs.',
  backgroundImage: '/figures/history/medicine/medieval/medieval-street.webp',
  items: [
    {
      id: 'regimen-sanitatis', x: 30, y: 42, label: "A physician's lifestyle chart",
      reveals: [
        { text: "A wealthy merchant keeps a written chart pinned to his wall — instructions for exactly how to eat, sleep and bathe." },
        { text: "This is a Regimen Sanitatis: a physician's guide to diet, exercise, sleep and bathing, written to keep a patient's humours in balance." },
        { text: "Prevention followed the same logic as treatment. If the Four Humours explained illness, keeping them balanced through daily habits should stop illness before it started." },
      ],
    },
    {
      id: 'purifying-air', x: 68, y: 60, label: 'A bunch of dried herbs',
      reveals: [
        { text: "A woman walking through town presses a small bunch of dried flowers to her nose." },
        { text: 'This is "purifying the air" — carrying sweet-smelling herbs and ringing bells to keep the air moving, both believed to protect against miasma.' },
        { text: "If bad-smelling air carried disease, then good smells and moving air should push it away. A direct application of miasma theory to daily life." },
      ],
    },
  ],
  synthesis: {
    heading: 'Prevention followed belief',
    points: [
      'A Regimen Sanitatis followed the Four Humours — diet, sleep and bathing kept the body in balance.',
      'Sweet herbs and ringing bells followed miasma theory — pushing away the bad air believed to carry disease.',
    ],
    examTakeaway: 'Every prevention method connects back to a belief about the cause of disease. The belief determined the prevention.',
  },
}

// MedievalDiagnosisScene (History) — tappable four-explanations SVG scene.
// Shape: { theories:[{id}] } — ids map to the component's built-in zones.
export const medievalDiagnosisScene = {
  theories: [{ id: 'god-sin' }, { id: 'four-humours' }, { id: 'miasma' }, { id: 'astrology' }],
}

// QuickRecallScreen (History) — rapid-fire choice retrieval.
// Shape: { chapterTitle, questions:[{type:'choice', question, options:[str], correct, explanation}] }.
export const quickRecall = {
  chapterNum: 5,
  chapterTitle: 'Great Plague retrieval',
  questions: [
    { type: 'choice', question: 'What changed most between 1348 and 1665?',
      options: ['Government organisation', 'Knowledge of bacteria', 'Use of antibiotics', 'Vaccination against plague'],
      correct: 0, explanation: 'Government acted in a more organised way in 1665.' },
    { type: 'choice', question: 'What stayed similar?',
      options: ['Belief in miasma and religious causes', 'Use of germ theory', 'Modern hospitals', 'Antibiotic treatment'],
      correct: 0, explanation: 'People still blamed bad air and God’s punishment.' },
    { type: 'choice', question: 'What is the best judgement about 1665?',
      options: ['More organised, still not medically modern', 'Fully modern medicine', 'No change at all', 'Germ theory in action'],
      correct: 0, explanation: 'In 1665, public action improved before people knew the real cause.' },
  ],
}

// ExaminerExplainsScreen (History) — how-examiners-think reveal.
// Shape: { opening, tips:[{heading, body}], closing } (passed as examinerExplains prop).
export const examinerExplains = {
  opening: 'Great Plague answers compare two outbreaks.',
  tips: [
    { heading: 'Say what was similar', body: 'People in both years blamed bad air and God.' },
    { heading: 'Say what changed', body: 'In 1665, officials used watchmen and death records.' },
    { heading: 'Keep the judgement clear', body: 'Public action improved. Medical ideas stayed weak.' },
  ],
  closing: 'Compare beliefs and actions.',
}

// UnifiedQuestionScreen (History) — single full-screen choice question.
// Shape: { question, type, options:[str], correct, hint, explanation }.
export const unifiedQuestion = {
  question: 'What did most people in 1348 believe caused the Black Death?',
  type: 'choice',
  options: ['God’s punishment and bad air', 'Bacteria spread by fleas', 'Contaminated drinking water', 'A virus passed by touch'],
  correct: 0,
  hint: 'Think about what people could and could not know in 1348.',
  explanation: 'Without germ theory, illness was explained through religion (God’s punishment) and miasma (bad air).',
}

// TieredQuizScreen (History) — pick a difficulty tier, then answer its questions.
// Shape: { tiers:[{emoji, label, questions:[{q, type, options:[str], correct, explanation}]}] }.
export const tieredQuiz = {
  tiers: [
    {
      emoji: '🟢', label: 'Warm up',
      questions: [
        { q: 'Who did people in 1348 often blame for the plague?', type: 'choice',
          options: ['God', 'Bacteria', 'Viruses', 'Doctors'], correct: 0,
          explanation: 'Religious explanation dominated in 1348.' },
      ],
    },
    {
      emoji: '🔵', label: 'Exam standard',
      questions: [
        { q: 'What was the biggest change in the response to plague by 1665?', type: 'choice',
          options: ['More organised government action', 'Use of antibiotics', 'Germ theory', 'Vaccination'], correct: 0,
          explanation: 'Watchmen and death bills show more organised public action.' },
      ],
    },
  ],
}

// WeakSpotRecovery (History) — behavioural intervention screen.
// Shape: { title, explanation, meta, recoveryQuizId, cta, skipText }.
export const weakSpotRecovery = {
  title: 'Let’s close a gap',
  explanation: 'You’ve slipped on miasma theory a couple of times. A short recovery quiz will lock it back in before you move on.',
  meta: 'Miasma theory · 3 questions',
  recoveryQuizId: 'history-miasma-recovery-1',
  cta: 'Fix this weak spot',
  skipText: 'Skip for now',
}

// RecoveryQuizPlayer (History) — looks up a real recovery quiz by id.
// Shape: a valid key from src/data/recoveryQuizzes.js.
export const recoveryQuizId = 'history-four-humours-recovery-1'

// KeyPoint (History) — inline rule takeaway block.
// Shape: { text, emphasis:[word] }.
export const keyPoint = {
  text: 'The rule was simple: treat every illness with its opposite quality.',
  emphasis: ['opposite'],
}

// WorkedExample (History) — inline case → apply → result block.
// Shape: { chips:[str], scenario, working, result }.
export const workedExample = {
  chips: ['Fever', 'Red face', 'Sweating'],
  scenario: 'A patient arrives with a fever, a red face and heavy sweating.',
  working: 'Heat and wetness point to one humour in excess: too much blood, which is hot and wet.',
  result: 'So the cure is to cool and dry the body — the opposite qualities.',
}
