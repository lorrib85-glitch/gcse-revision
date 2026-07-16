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
// ── Group 2: OppositeQualitiesReveal (History) — reuses story shape ─────────
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
// ── Group 2: TimelineCanvas (History) — production Episode 2 journey ─────────
// TimelineCanvas is for a spatial route or process where horizontal travel is part
// of the meaning. TimelineChain remains the compact causal-sequence alternative.
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

// ── Group 2: EvacuationChainRoute (History) — reuses story shape ─────────────
export const evacuationChainRoute = {
  type: 'evacuationChainRoute',
  title: 'Rebuild the evacuation chain',
  subtitle: 'Tap a job card, then tap the stage it belongs to.',
  stages: [
    { id: 's-frontline', icon: 'helmet', title: 'Front line',                       clue: 'In the trenches',          answerId: 'a-frontline' },
    { id: 's-rap',       icon: 'cross',  title: 'Regimental Aid Post',              clue: 'Close to the front',       answerId: 'a-rap' },
    { id: 's-ads',       icon: 'hut',    title: 'Advanced / Main Dressing Station', clue: 'Behind the front',         answerId: 'a-ads' },
    { id: 's-ccs',       icon: 'train',  title: 'Casualty Clearing Station', clue: 'Near railways', answerId: 'a-ccs' },
  ],
}
