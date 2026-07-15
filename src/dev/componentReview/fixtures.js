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
// ── Group 2: TimelineCanvas (History) — reuses shipped Episode-2 shape ────────
export const timelineCanvas = {
  title: 'How the Black Death spread',
  intro: 'Swipe to explore the chain. Tap + on each card to reveal why it mattered.',
  steps: [
    { id: 'trade', label: 'Trade ships carried rats', detail: 'Ships from Asia carried black rats in their cargo holds along busy trade routes.', stats: ['Trade routes'] },
    { id: 'fleas', label: 'Fleas lived on the rats',  detail: 'Fleas feeding on infected rats picked up the plague bacteria.', stats: ['Yersinia pestis'] },
    { id: 'bites', label: 'Fleas bit humans',         detail: 'When rats died, fleas jumped to humans and bit them, passing on the infection.', stats: ['Flea bites'] },
    { id: 'spread',label: 'Disease spread town to town', detail: 'People fleeing outbreaks carried the disease with them, spreading it across Europe.', stats: ['1348 England'] },
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

// ── Group 2: EvacuationChainRoute (History) — reuses story shape ─────────────
export const evacuationChainRoute = {
  type: 'evacuationChainRoute',
  title: 'Rebuild the evacuation chain',
  subtitle: 'Tap a job card, then tap the stage it belongs to.',
  stages: [
    { id: 's-frontline', icon: 'helmet', title: 'Front line',                       clue: 'In the trenches',          answerId: 'a-frontline' },
    { id: 's-rap',       icon: 'cross',  title: 'Regimental Aid Post',              clue: 'Close to the front',       answerId: 'a-rap' },
    { id: 's-ads',       icon: 'hut',    title: 'Advanced / Main Dressing Station', clue: 'Behind the front',         answerId: 'a-ads' },
    { id: 's-ccs',       icon: 'train',  title: 'Casualty Clearing Station',        clue: 'Near railways',            answerId: 'a-ccs' },
  ],
  answers: [
    { id: 'a-frontline', text: 'Carried wounded men from the front line' },
    { id: 'a-rap',       text: 'Basic first aid close to the front line' },
    { id: 'a-ads',       text: 'Treated more serious injuries behind the line' },
    { id: 'a-ccs',       text: 'Performed most surgery and triage, near railways' },
  ],
}

// ── Group 2: SpotTheError (Biology) ──────────────────────────────────────────
// Shape: { id, prompt, statement, errorTarget, whatWasWrong, correctVersion,
//          keyTerms?, commonTrap?, examinerNote? }
export const spotTheError = {
  id: 'spot-photosynthesis',
  prompt: 'Find the error in this exam answer.',
  statement: 'Photosynthesis takes place in the mitochondria of plant cells, using carbon dioxide and water to produce glucose and oxygen.',
  errorTarget: 'mitochondria',
  whatWasWrong: 'Photosynthesis happens in the chloroplasts, not the mitochondria. Mitochondria are the site of respiration.',
  correctVersion: 'Photosynthesis takes place in the chloroplasts of plant cells, using carbon dioxide and water to produce glucose and oxygen.',
  keyTerms: ['chloroplast', 'mitochondria', 'respiration'],
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

// VisualNarrativeScreen (History) — beat-based narrative.
export const visualNarrative = {
  beats: [
    { image: '/headers/history-medicine-through-time.webp', headline: 'The body', body: 'Human dissection gave Vesalius direct evidence about the human body.' },
    { image: '/headers/history-medicine-through-time.webp', headline: 'The book', body: 'His printed drawings let doctors across Europe check the evidence for themselves.' },
    { image: '/headers/history-medicine-through-time.webp', headline: 'The challenge', body: 'For the first time, careful observation could openly correct Galen.' },
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
  label: 'Build the photosynthesis equation',
  slots: [null, null, null, null],
  operators: ['+', '→', '+'],
  pieces: ['carbon dioxide', 'water', 'glucose', 'oxygen', 'nitrogen', 'starch'],
  answer: ['carbon dioxide', 'water', 'glucose', 'oxygen'],
  hint: 'Two things go IN (reactants), two things come OUT (products). Light energy drives the reaction.',
  successText: 'Carbon dioxide + water → glucose + oxygen. Light energy drives the reaction. This is the foundation of almost all life on Earth.',
}

// ChapterOutcomeScreen (Biology) — full-screen chapter-opening outcomes reveal.
// Shape: { chapterTitle, outcomes:[string] }. From Plant Cells & Photosynthesis
// (sci_bio_w1) outcomes.bullets.
export const chapterOutcome = {
  chapterTitle: 'Plant Cells & Photosynthesis',
  outcomes: [
    'Describe the key parts of a plant cell and what each one does',
    'Explain the photosynthesis equation and what it actually means',
    'See why chlorophyll is the molecule that makes life possible',
    'Connect photosynthesis to respiration and energy flow in ecosystems',
  ],
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
