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

// ── Group 2: BeforeAfterImageSlider (History) — props, uses existing images ───
export const beforeAfterImageSlider = {
  beforeSrc: '/headers/history-medicine-through-time.webp',
  afterSrc: '/headers/history-elizabethan.webp',
  beforeAlt: 'Before treatment',
  afterAlt: 'After treatment',
  beforeLabel: 'Before',
  afterLabel: 'After',
  heading: 'Drag to compare',
  subheading: 'A before-and-after visual comparison.',
  revealText: 'The slider lets learners compare two states of the same image directly.',
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
    { id: 'a', text: 'Medicine changed quickly after the Black Death.', correct: false,
      explanation: 'Most beliefs and treatments stayed the same. People still relied on religion, miasma and the Four Humours.' },
    { id: 'b', text: 'The Black Death made people question the Church.', correct: true,
      explanation: 'Some people began to question why the Church could not explain or stop the disease.' },
    { id: 'c', text: 'Doctors discovered the real cause of the plague.', correct: false,
      explanation: 'The real cause — bacteria carried by fleas — was not understood until centuries later.' },
  ],
  prompt: 'Which statement is accurate?',
}
