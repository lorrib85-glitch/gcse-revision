// ─── Component Review Lab — fixtures ─────────────────────────────────────────
//
// DEVELOPMENT-ONLY. Realistic GCSE fixture data for the Component Review Lab
// (src/dev/componentReview/ComponentReviewLab.jsx). Kept completely separate
// from production learning components and content files — nothing here is
// imported by the learner app, and this whole directory is tree-shaken out of
// production builds (see src/App.jsx dev-only gate).
//
// Each fixture follows the documented block/screen shape of its component so
// the component renders through its real API with no API changes.

// ── Group 1: GalensDiagnostic ────────────────────────────────────────────────
// Shape: { symptomsLabel, symptoms:[{id,label,qualities:{hot,cold,wet,dry}}],
//          qualityMeta:{q:{label,icon}}, treatments:{'temp-moist':{items:[{title,detail}]}},
//          theoryPrinciple, explanation, examTip }
// Fixture: red face, fever, dry skin, intense thirst → hot + dry → cold + wet.
export const galensDiagnostic = {
  symptomsLabel: "Choose the patient's symptoms",
  symptoms: [
    { id: 'red-face',   label: 'Red face',       qualities: { hot: 2, cold: 0, wet: 0, dry: 0 } },
    { id: 'fever',      label: 'Fever',          qualities: { hot: 2, cold: 0, wet: 0, dry: 0 } },
    { id: 'dry-skin',   label: 'Dry skin',       qualities: { hot: 0, cold: 0, wet: 0, dry: 2 } },
    { id: 'thirst',     label: 'Intense thirst', qualities: { hot: 1, cold: 0, wet: 0, dry: 2 } },
    { id: 'sweating',   label: 'Sweating',       qualities: { hot: 1, cold: 0, wet: 2, dry: 0 } },
    { id: 'chills',     label: 'Chills',         qualities: { hot: 0, cold: 2, wet: 0, dry: 0 } },
  ],
  qualityMeta: {
    hot:  { label: 'Hot',  icon: '☀' },
    cold: { label: 'Cold', icon: '❄' },
    wet:  { label: 'Wet',  icon: '〜' },
    dry:  { label: 'Dry',  icon: '✦' },
  },
  treatments: {
    'hot-dry': {
      items: [
        { title: 'Cool, moist foods', detail: 'Cucumber, melon and lettuce were thought to add cold and wet qualities.' },
        { title: 'Cold baths',        detail: 'Cooling the body was believed to draw out the excess heat.' },
        { title: 'Rest and fluids',   detail: 'Water and light broths restored the moisture the fever had burned away.' },
      ],
    },
    'hot-wet':  { items: [{ title: 'Cooling, drying foods', detail: 'Dry breads and bitter herbs to counter heat and moisture.' }] },
    'cold-wet': { items: [{ title: 'Warming, drying foods', detail: 'Spiced wine and dry grains to add heat and dryness.' }] },
    'cold-dry': { items: [{ title: 'Warming, moist foods',  detail: 'Warm broths and stewed fruit to add heat and moisture.' }] },
  },
  theoryPrinciple: 'Restore balance — treat with the opposite quality.',
  explanation: 'A red, feverish, dry, thirsty patient is dominated by HOT and DRY. Galen would prescribe the opposites: COLD and WET, to pull the body back into balance.',
  examTip: 'Examiners reward you for explaining the logic — that treatment aimed to restore the balance of the four humours, even though it did not treat the real cause.',
}

// ── Group 1: TheoryLab ───────────────────────────────────────────────────────
// Shape: { title, theory:{heading,tagline,grid,explanation}, scenario:{title,image,
//          symptoms,question,options:[{label,correct}]}, outcome:{diagnosis,lines},
//          prescription:{question,options,reveal}, evaluation:{...} }
// Fixture: 19th-century cholera town by a foul river → miasma theory applied.
export const theoryLab = {
  title: 'Think like a Victorian sanitarian',
  theory: {
    heading: 'Miasma theory',
    tagline: 'Bad air causes disease.',
    explanation: 'Before germ theory, most doctors believed disease spread through miasma — poisonous, foul-smelling air rising from rotting waste, sewage and stagnant water.',
    grid: [
      { left: 'FOUL SMELL', right: 'DISEASE' },
      { left: 'CLEAN AIR',  right: 'HEALTH' },
    ],
  },
  scenario: {
    title: 'A town falls ill',
    symptoms: ['CHOLERA CASES', 'FOUL-SMELLING RIVER', 'OVERCROWDED SLUMS'],
    question: 'What would a miasma theorist blame?',
    options: [
      { label: 'The bad air rising from the river', correct: true },
      { label: 'Contaminated drinking water',       correct: false },
      { label: 'A bacterium in the gut',            correct: false },
    ],
  },
  outcome: {
    diagnosis: 'BAD AIR FROM THE RIVER',
    lines: ['The stench proves the air is poisoned.', 'Breathing it spreads the disease.'],
  },
  prescription: {
    question: 'What action follows from miasma theory?',
    options: [
      { label: 'Clear the waste and mask the smell', correct: true },
      { label: 'Boil all drinking water',            correct: false },
      { label: 'Isolate infected patients',          correct: false },
    ],
    reveal: 'Removing the smell was the logical action — clean the streets, remove refuse, improve drainage.',
  },
  evaluation: {
    transformation: { from: 'FOUL AIR', to: 'CLEAN AIR', result: 'FEWER CASES?' },
    worked: ['Cleaner streets', 'Better drainage', 'Less waste'],
    limitation: 'The real cause was cholera bacteria in the water, not the air. Cleaning drains sometimes helped by accident — it removed the contaminated water too.',
    verdict: 'Miasma theory led to real public-health improvements for the wrong reason. It took John Snow and, later, germ theory to explain what was really happening.',
    significance: 'This is why sanitary reform began before anyone understood germs — the belief was wrong, but the action of cleaning the environment often reduced disease anyway.',
  },
}

// ── Group 1: SymptomQualityDiagnostic ────────────────────────────────────────
// Shape: { qualities:[{quality,symptoms}], patient:{title,symptoms}, quadrantQuestion,
//          quadrantOptions, diagnosis, treatmentQuestion, treatmentOptions, oppositeRecall, closing }
// Fixture: fever + dry skin → hot + dry → cold + wet treatment.
export const symptomQualityDiagnostic = {
  qualities: [
    { quality: 'hot',  symptoms: ['Fever', 'Red face', 'Flushed skin'] },
    { quality: 'cold', symptoms: ['Pale skin', 'Chills', 'Shivering'] },
    { quality: 'wet',  symptoms: ['Sweating', 'Runny nose', 'Watery eyes'] },
    { quality: 'dry',  symptoms: ['Dry skin', 'Cracked lips', 'Thirst'] },
  ],
  patient: { title: 'A patient arrives', symptoms: ['Fever', 'Dry skin'] },
  quadrantQuestion: 'Which qualities dominate?',
  quadrantOptions: [
    { label: 'Hot + dry',  correct: true },
    { label: 'Hot + wet',  correct: false },
    { label: 'Cold + dry', correct: false },
    { label: 'Cold + wet', correct: false },
  ],
  diagnosis: { label: 'Hot + dry' },
  treatmentQuestion: 'What would Galen prescribe to cool and moisten this patient?',
  treatmentOptions: [
    { label: 'Cucumber and cool water', correct: true,
      explanation: 'Cold and wet qualities pull the body back towards balance against the hot, dry excess.' },
    { label: 'Hot soup and dry bread', correct: false,
      explanation: 'Hot and dry — the same qualities causing the illness, not the opposite.' },
    { label: 'Warm spiced wine', correct: false,
      explanation: 'Adds heat, when the patient needs cooling.' },
    { label: 'Dry toast and honey', correct: false,
      explanation: 'Still dry, when the patient needs moisture.' },
  ],
  oppositeRecall: { from: 'Hot + dry', to: 'Cold + wet', result: 'Balance' },
  closing: {
    worked: ['Rest', 'Cool fluids', 'Cooling foods'],
    limitation: 'Disease is not actually caused by an imbalance of the four humours.',
    verdict: 'Patients who rested and drank cool fluids often recovered anyway, which looked like proof the theory worked.',
    church: {
      heading: 'Supported by the Church',
      body: "Christians believed God created a perfectly balanced body, which matched Galen's ideas, so the Church preserved his work.",
    },
    significance: 'That is why the Theory of Opposites survived for over 1,400 years — it seemed to keep working, patient after patient.',
  },
}

// ── Group 1: CinematicCarousel ───────────────────────────────────────────────
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
  caption: 'Rate of reaction as temperature rises.',
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

// ── Group 1: DragToOrderTask (Biology) ───────────────────────────────────────
// Shape: props { items:[{id,label,description?}], subject, onComplete }
// The correct order is the array order. Fixture: infectious-disease response.
export const dragToOrderTask = [
  { id: 'enter',    label: 'Pathogen enters the body',            description: 'A bacterium or virus gets past the skin or lining.' },
  { id: 'recognise',label: 'White blood cells recognise it',      description: 'Lymphocytes detect the pathogen’s antigens as foreign.' },
  { id: 'produce',  label: 'Antibodies are produced',             description: 'Lymphocytes make antibodies specific to that antigen.' },
  { id: 'bind',     label: 'Antibodies bind to the pathogen',     description: 'They clump pathogens together and mark them for destruction.' },
  { id: 'memory',   label: 'Memory cells remain',                 description: 'Some cells stay behind for a faster response next time.' },
]

// ── Group 2: ConnectionMap (History) — reuses shipped Episode-1 shape ─────────
export const connectionMap = {
  type: 'connectionMap',
  title: 'The web of medieval belief',
  subtitle: 'How did medieval people explain illness?',
  instruction: 'Tap each belief to explore how it shaped medieval medicine',
  centreLabel: 'Why people got ill',
  nodes: [
    { id: 'supernatural', label: "God's punishment", shortLabel: "God's will",
      explanation: "Many medieval people believed illness was God's punishment for sin, so prayer, confession and pilgrimage were logical treatments.",
      retrievalQuestion: 'Why did medieval people think prayer could cure illness?',
      retrievalAnswer: "If illness was God's punishment for sin, prayer addressed the spiritual cause." },
    { id: 'astrology', label: 'Stars and planets', shortLabel: 'Astrology',
      explanation: 'Astrologers believed celestial movements controlled health. Doctors consulted zodiac charts to time treatments.',
      retrievalQuestion: 'How did astrology influence treatment?',
      retrievalAnswer: 'Doctors used star charts to decide when to perform bloodletting.' },
    { id: 'humours', label: 'Four humours', shortLabel: 'Humours',
      explanation: "Galen's four humours dominated medieval medicine. Illness meant an imbalance, treated by bloodletting, purging or diet.",
      retrievalQuestion: 'Name the four humours.',
      retrievalAnswer: 'Blood, phlegm, yellow bile and black bile.' },
    { id: 'miasma', label: 'Bad air (miasma)', shortLabel: 'Bad air',
      explanation: 'Miasma theory held that foul-smelling air caused disease, so people burned herbs and aromatics to purify the air.',
      retrievalQuestion: 'What did people do to protect against miasma?',
      retrievalAnswer: 'They carried posies and burned aromatics to sweeten the air.' },
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

// ── Group 2: SymptomProgression (History) — reuses shipped Episode-2 shape ────
export const symptomProgression = {
  title: 'How the plague killed',
  description: 'Follow bubonic plague through the body, from first contact to death.',
  stages: [
    { day: '1–2', label: 'Infection',     description: 'A flea carrying Yersinia pestis bites the skin. The bacteria enter the lymphatic system. The person feels nothing yet.' },
    { day: '3–5', label: 'Buboes form',   description: 'Painful swellings (buboes) appear in the groin, armpits and neck as lymph nodes fill with bacteria.' },
    { day: '5–6', label: 'Fever and pain',description: 'High fever, vomiting and severe pain set in as the infection spreads through the body.' },
    { day: '6–7', label: 'Death',         description: 'Without antibiotics, most victims died within a week as organs failed.' },
  ],
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
    { statement: 'The Black Death changed medicine because people finally discovered what caused disease.',
      answer: false,
      reveal: 'The Black Death changed society, but not medical understanding. People kept using the same explanations — God, miasma, astrology and humours. No better theory replaced them for centuries.' },
  ],
}
