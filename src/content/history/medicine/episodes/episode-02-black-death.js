// Episode file — owns the runtime teaching sequence for one episode.
//
// Actual image files live in public/history/medicine/.
// Asset path resolution lives in src/content/history/medicine/assets.js.
// Canonical content + architecture docs live in docs/content/history/medicine/.

export default {
  id: 'history-medicine-black-death',
  subject: 'History',
  number: 2,
  title: 'The day everything changed',
  subtitle: 'The Black Death, 1348–1349',
  era: 'c.1348–c.1350',
  icon: '☠️',
  color: '#8C3A2A',
  colorLight: 'rgba(140,58,42,0.12)',
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],

  hook: {
    statement: 'Medieval doctors had no useful treatment for the Black Death.',
    isTrue: true,
    accentWords: ['no useful treatment'],
    backgroundImage: '/figures/history/medicine/black-death/plague-background.png',
    explanation: 'True. Medieval doctors tried everything they knew — bloodletting, purging, prayer, burning herbs. None of it worked. The actual cause would not be discovered for another 500 years.',
    revealBeats: [
      'True.',
      'Medieval doctors tried everything they knew.',
      'Bloodletting. Purging. Prayer. Burning aromatic herbs against the smell.',
      'None of it worked.',
      'The actual cause would not be discovered for another 500 years.',
    ],
  },

  outcomes: {
    bullets: [
      { text: 'Where the Black Death came from and how it spread',  icon: 'map'      },
      { text: 'What medieval people believed caused it',            icon: 'question' },
      { text: 'Why those beliefs led to useless treatments',        icon: 'medicine' },
      { text: 'How the plague changed England forever',             icon: 'legacy'   },
    ],
  },

  stageNavigation: [
    { id: 'part-1', title: 'The Ship That Changed England', description: 'Intro hook, prior recall and roadmap.', screenIndex: 0 },
    { id: 'part-2', title: 'What Was the Black Death?', description: 'Arrival, spread and symptoms of the plague.', screenIndex: 1 },
    { id: 'part-3', title: 'How Medieval Minds Explained It', description: 'God, miasma, astrology and humoural beliefs.', screenIndex: 7 },
    { id: 'part-4', title: 'Treatments in a World Without Germs', description: 'Plague responses, treatments and prevention attempts.', screenIndex: 11 },
    { id: 'part-5', title: 'Changed by Disaster?', description: 'Social, economic and medical aftermath of the plague.', screenIndex: 15 },
    { id: 'part-6', title: 'Exam Prep: Crisis, Continuity and Change', description: 'Examiner traps, mark-scheme thinking and exam practice.', screenIndex: 19 },
  ],

  screens: [

    // ── Section 1: Intro / Recall / Roadmap ─────────────────────────────────

    {
      type: 'priorKnowledgeRecall',
      chapterTitle: 'Medieval medicine: beliefs and causes of disease',
      recallPrompts: ['People', 'Theories', 'Causes', 'Treatments', 'Church'],
      backgroundImage: '/figures/history/medicine/black-death/plague-background.png',
      sourceContent: `GCSE History: Medieval Medicine — Beliefs and Causes of Disease (c.1250–c.1500)

Key figures:
Hippocrates (ancient Greek doctor) argued illness had natural causes, not punishment from gods. He promoted observation of symptoms, recording of cases, and logical reasoning. His Four Humours theory said health depended on balance between four bodily fluids: blood, phlegm, yellow bile, and black bile. Imbalance caused disease.

Galen (Roman doctor, c.129–216 AD) built on Hippocrates. He treated gladiators, dissected animals, and wrote medical books copied and taught in universities for over 1,400 years. His Theory of Opposites: treat illness with its opposite quality — a hot, feverish illness with cold remedies; a cold, wet condition with warm, dry treatments. Galen made errors (blood made in liver; heart septum had holes), but the Church backed his authority so he was rarely questioned.

Causes of disease — four main theories:
1. Four Humours: disease caused by imbalance of blood, phlegm, yellow bile, or black bile.
2. God and sin: illness was God's punishment for sin, or a test of faith. Treatments: prayer, confession, repentance, pilgrimage, fasting, visiting holy relics.
3. Miasma: bad air from rotting matter, sewers, marshes caused disease. The smell itself was believed to carry illness.
4. Astrology: planets and zodiac signs influenced the body. Physicians used the Zodiac Man diagram and astrological calendars to time treatments. The Paris Medical Faculty blamed the Black Death on a triple conjunction of Saturn, Jupiter, and Mars in 1345.

Medical practitioners:
- Physician: university-trained, expensive, used Latin, diagnosed via uroscopy (examining urine colour using a jordan flask and urine charts) and astrological charts.
- Barber surgeon: practical tradesman, moderate cost, performed bloodletting (removing blood by cutting a vein or applying leeches), tooth-pulling, and minor surgery.
- Wise woman: no formal training, cheapest option, used herbal remedies and poultices. Most accessible to ordinary people in villages.
- Priest: offered spiritual treatment — prayer, blessing, repentance. Believed illness began with sin.

Treatments:
- Bloodletting: removing blood (by cutting or leeches) to restore humoral balance.
- Purging: inducing vomiting or diarrhoea to expel excess humours.
- Herbal remedies, diet change, rest: cooling foods (cucumber) for fever; dry foods for cold conditions.
- Prayer, pilgrimage, confession, fasting: for illness believed to be caused by God.

The Church's role:
The Church ran hospitals (St Bartholomew's, founded 1123) and copied ancient medical texts in monasteries. It preserved and promoted Galen's work because his ideas of bodily balance fitted Christian views of perfect divine design. The Church discouraged human dissection (belief in bodily resurrection) and made questioning Galen's authority difficult. This slowed medical progress significantly.

Why medieval ideas survived so long:
The Church preserved ancient texts and backed Galen's authority. Without microscopes or germ theory, no better explanation existed. Humoral logic was internally consistent — wrong premises, logical conclusions. Some treatments accidentally helped (rest, fluids, herbal remedies), making the flawed theory seem credible. Multiple explanations coexisted — people believed God, humours, miasma, and astrology simultaneously.`,
      concepts: [
        { tag: 'hippocrates',             label: 'Hippocrates' },
        { tag: 'four-humours',            label: 'Four humours' },
        { tag: 'galen',                   label: 'Galen' },
        { tag: 'theory-of-opposites',     label: 'Theory of Opposites' },
        { tag: 'miasma',                  label: 'Miasma theory' },
        { tag: 'god-punishment',          label: 'God and sin' },
        { tag: 'astrology',               label: 'Astrology and the zodiac man' },
        { tag: 'bloodletting',            label: 'Bloodletting' },
        { tag: 'church-role',             label: 'Church\'s role in medicine' },
        { tag: 'supernatural-vs-natural', label: 'Supernatural vs natural causes' },
        { tag: 'why-ideas-survived',      label: 'Why medieval ideas survived so long' },
      ],
    },

    {
      type: 'cinematic',
      stage: 'The arrival',
      label: 'ENGLAND, 1348',
      videoSrc: '/videos/black-death-intro.mp4',
      fallbackImage: '/figures/history/medicine/black-death/plague-background.png',
      year: '1348',
      headline: 'Something is coming.',
      body: 'In June 1348, ships docked at Melcombe in Dorset.\n\nWithin weeks, people began to die.\n\nThe disease moved fast — through towns, villages, and monasteries.\n\nNo one knew what it was. No one knew how to stop it.',
    },

    // ── Section 2: The arrival ───────────────────────────────────────────────

    {
      type: 'interactiveImage',
      stage: 'The arrival',
      id: 'plague-dock-hotspot',
      label: 'The dock at Melcombe, 1348',
      title: 'The dock at Melcombe',
      introText: 'A trading ship has just arrived from the continent. Tap each glowing point to explore what was here — and what no one yet understood.',
      image: '/figures/history/medicine/black-death/plague-dock.png',
      imageAlt: 'A medieval harbour with a trading ship, barrels, sacks of goods, and rats on the dock',
      ctaLabel: 'Explore the dock',
      hotspots: [
        {
          id: 'ship',
          x: 47, y: 17,
          shortLabel: 'The ship', title: 'The trading ship',
          icon: '⚓',
          description: 'This ship sailed from ports on the Mediterranean where the Black Death was already killing thousands. Trade routes connected England to the infected regions of Europe and Asia.',
          extraFact: 'The plague had already wiped out entire towns in Italy and France before reaching England. Some ports tried to refuse docking ships — but it was already too late.',
        },
        {
          id: 'crew',
          x: 68, y: 29,
          shortLabel: 'The crew', title: 'The sailors',
          icon: '🧑‍✈️',
          description: 'By the time the ship docked, some of the crew were already dying. The passengers showed the signs — swellings, fever, blackened skin. Onlookers had no idea what they were seeing.',
          extraFact: 'The chronicler Geoffrey le Baker described sailors arriving "with disease in their bodies." Witnesses reported that those who spoke to or touched the sick quickly fell ill themselves.',
        },
        {
          id: 'dock',
          x: 44, y: 56,
          shortLabel: 'The dock', title: 'Melcombe Regis, June 1348',
          icon: '📍',
          description: 'This is where the Black Death first reached England — the port of Melcombe in Dorset, June 1348. Within weeks, the surrounding towns and villages were dying.',
          extraFact: 'From Dorset, the plague spread rapidly north and east. By 1349 it had reached London. By 1350, it reached Scotland. No one could stop it.',
        },
        {
          id: 'cargo',
          x: 62, y: 51,
          shortLabel: 'The cargo', title: 'Goods from the east',
          icon: '📦',
          description: 'Trading ships carried spices, cloth, and silks from the east. They also carried something no one could see. The same trade routes that made merchants wealthy were spreading death across the continent.',
          extraFact: 'Medieval people blamed miasma — bad air from rotting goods — for the spread of disease. They were partly right that filth was connected to illness, but completely wrong about why.',
        },
        {
          id: 'rat',
          x: 35, y: 73,
          shortLabel: 'The rat', title: 'Everywhere — but unnoticed',
          icon: '🐀',
          description: 'Rats were common at every dock in England. No one thought twice about them. No one noticed the dead rats before the sick people appeared. No one made the connection.',
          extraFact: 'Medieval people had no idea rats were involved. They blamed the planets, bad air, and God\'s punishment. The true explanation would remain hidden for another 500 years.',
        },
      ],
    },

    {
      type: 'timelineCanvas',
      stage: 'The arrival',
      label: 'The chain, scroll by scroll',
      title: 'How it spread',
      intro: 'Scroll to follow the infection.',
      steps: [
        {
          id: 'ship',
          image: '/figures/history/medicine/black-death/plague-dock.png', // placeholder — replace with a ship-specific image
          label: 'Trade ships docked at English ports',
          detail: 'Genoese and other Mediterranean trading ships carried grain, cloth and wine into English ports — and, hidden in the hold, black rats infested with fleas. The Black Death reached England via the port of Melcombe (modern Weymouth) in June 1348.',
          stats: ['June 1348', 'Melcombe, Dorset'],
        },
        {
          id: 'rats',
          image: '/figures/history/medicine/black-death/medieval-town.png', // placeholder — replace with a rat-specific image
          label: 'Black rats lived alongside humans',
          detail: 'Rats nested in grain stores, ships’ holds and crowded housing. Nobody connected the rats to illness — medieval explanations focused on miasma (bad air) and God’s punishment, not animals.',
          stats: ['Rattus rattus', 'Vector species'],
        },
        {
          id: 'fleas',
          image: '/figures/history/medicine/black-death/plague-background.png', // placeholder — replace with a flea-specific image
          label: 'Fleas carried Yersinia pestis',
          detail: 'When an infected rat died, its fleas jumped to the nearest warm body — often human. A single bite transferred the bacterium Yersinia pestis into the bloodstream, causing bubonic plague.',
          stats: ['Yersinia pestis', 'Bubonic plague'],
        },
        {
          id: 'spread',
          image: '/figures/history/medicine/black-death/trade-routes-map.png', // placeholder — replace with a town-spread image
          label: 'The disease spread along trade and travel routes',
          detail: 'From Melcombe, the plague spread along roads and waterways used for trade — reaching Bristol and London within months. By 1350, it had killed an estimated one-third to one-half of England’s population.',
          stats: ['By 1350', '~30–50% mortality'],
        },
      ],
    },

    {
      type: 'visualLearning',
      stage: 'The arrival',
      label: 'Where did it come from?',
      scenes: [
        {
          image: '/figures/history/medicine/black-death/trade-routes-map.png',
          headline: 'It began in central Asia.',
          body: 'Possibly in the late 1330s. From there, it moved west along the trade routes that connected Asia to Europe.',
        },
        {
          image: '/figures/history/medicine/black-death/trade-routes-map.png',
          headline: 'Trade routes carried death.',
          body: 'Ships moving across Asia and Europe carried infected fleas and rats. Merchants did not know they were carrying disease with them.',
        },
        {
          image: '/figures/history/medicine/black-death/plague-dock.png',
          headline: 'It reached England by sea.',
          body: 'In June 1348, ships docked at Melcombe in Dorset. The disease moved from ports into towns, villages and monasteries.',
        },
      ],
    },

    {
      type: 'theoryCompare',
      stage: 'The arrival',
      label: 'What was really happening?',
      title: 'What they saw vs what was true',
      image: '/figures/history/medicine/black-death/dead-rat.png',
      prompt: 'Medieval people saw illness spreading fast. They tried to explain it using the ideas they already trusted.',
      leftTitle: 'What people believed',
      rightTitle: 'What was actually happening',
      revealText: 'They blamed God, miasma and the planets. The real cause was a bacterium carried by fleas on black rats.',
      comparisons: [
        {
          label: 'Cause',
          left: 'God’s punishment, bad air, or astrology',
          right: 'Yersinia pestis bacteria',
        },
        {
          label: 'Carrier',
          left: 'Bad smells, sinful behaviour, unlucky planets',
          right: 'Fleas living on black rats',
        },
        {
          label: 'Spread',
          left: 'Poisoned air or divine judgement spreading through communities',
          right: 'Flea bites, infected rats, travel and trade routes',
        },
      ],
    },

    {
      type: 'progressionTimeline',
      stage: 'The arrival',
      label: 'How the disease killed',
      title: 'How the plague killed',
      description: 'Follow the progression of bubonic plague through the body.',
      image: '/figures/history/medicine/black-death/symptom-case-file.png',
      stages: [
        {
          day: '1–2',
          label: 'Flea bite',
          description: 'A flea carrying Yersinia pestis bacteria bites the skin. The bacteria enter the lymphatic system.',
        },
        {
          day: '3–5',
          label: 'Buboes form',
          description: 'Painful egg-sized swellings (buboes) appear in lymph nodes — groin, armpit, or neck.',
        },
        {
          day: '5–6',
          label: 'Fever and weakness',
          description: 'The immune system is overwhelmed. Fever, shivering, vomiting and exhaustion develop rapidly.',
        },
        {
          day: '6+',
          label: 'Blood poisoning',
          description: 'The bacteria spread through the bloodstream. Skin can darken from internal bleeding, giving the "Black Death" its later name.',
        },
      ],
    },

    {
      type: 'knowledgeCheck',
      stage: 'The arrival',
      label: 'Quick check',
      prompt: 'What was the actual cause of bubonic plague?',
      correctAnswer: 'Yersinia pestis bacteria carried by fleas on black rats',
      acceptedAnswers: [
        'yersinia pestis',
        'bacteria carried by fleas',
        'fleas on black rats',
        'plague bacteria',
      ],
      hint: 'It was not miasma, astrology or God’s punishment. Think of the tiny carrier living on rats.',
      explanation: 'Bubonic plague was caused by Yersinia pestis bacteria, carried by fleas living on black rats. Medieval people did not know this because they had no microscopes or germ theory.',
    },

    {
      type: 'accordion',
      stage: 'Explanations',
      label: 'Why did medieval people get it wrong?',
      title: 'Why did people blame the wrong things?',
      intro: 'Medieval explanations were not random. They fitted the ideas people already trusted.',
      panels: [
        {
          title: 'Religion gave meaning to disaster',
          body: 'The Church taught that God could punish sin. So when the plague killed thousands, many believed God was angry. Prayer, confession and repentance made sense if illness was divine punishment.',
        },
        {
          title: 'Bad smells seemed dangerous',
          body: 'Plague towns smelled of rotting bodies, waste and smoke. Miasma theory said poisonous air caused illness. Burning herbs or carrying sweet-smelling pomanders seemed logical.',
        },
        {
          title: 'Astrology looked scientific',
          body: 'Physicians believed the planets influenced the body. The Paris Medical Faculty blamed the plague on an unusual alignment of Saturn, Jupiter and Mars in 1345. To educated people, this sounded like serious medical explanation.',
        },
        {
          title: 'They had no way to see bacteria',
          body: 'No microscopes. No germ theory. No understanding of fleas carrying bacteria. So even careful observation led people to the wrong cause.',
        },
      ],
    },

    {
      type: 'sorting',
      stage: 'Explanations',
      label: 'Cause sort',
      title: 'Sort the causes',
      prompt: 'Which were medieval beliefs — and which was the actual cause?',
      categories: ['Medieval belief', 'Actual cause'],
      items: [
        { text: 'God punishing sin', category: 'Medieval belief' },
        { text: 'Miasma or bad air', category: 'Medieval belief' },
        { text: 'Planetary alignment', category: 'Medieval belief' },
        { text: 'Yersinia pestis bacteria', category: 'Actual cause' },
        { text: 'Fleas on black rats', category: 'Actual cause' },
      ],
    },

    {
      type: 'multiTheoryScenario',
      stage: 'Explanations',
      label: 'Multiple beliefs at once',
      title: 'One disaster. Several explanations.',
      scenario: 'A family in 1349 has lost two children to the plague. They want to know why it happened — and what they should do next.',
      theories: [
        {
          id: 'god',
          title: 'God and sin',
          cause: 'God is punishing the community for sin.',
          response: 'Confess, pray, fast, go on pilgrimage.',
        },
        {
          id: 'miasma',
          title: 'Miasma',
          cause: 'Poisonous air is spreading disease.',
          response: 'Burn herbs, clean streets, carry sweet-smelling herbs.',
        },
        {
          id: 'astrology',
          title: 'Astrology',
          cause: 'The planets are creating dangerous conditions in the body.',
          response: 'Avoid treatment on unlucky days, consult astrology charts.',
        },
        {
          id: 'humours',
          title: 'Four humours',
          cause: 'The body’s humours are badly out of balance.',
          response: 'Bloodletting, purging, diet changes.',
        },
      ],
    },

    {
      type: 'theoryPrescription',
      stage: 'Responses',
      label: 'Treatment logic',
      title: 'Treatment followed belief',
      prompt: 'Choose the belief. Then choose the response that would seem logical to a medieval person.',
      options: [
        {
          id: 'god',
          label: 'God sent the plague',
          cause: 'The plague is punishment for sin.',
          correctTreatment: 'Prayer and repentance',
          wrongTreatments: ['Bloodletting', 'Burning herbs'],
          explanation: 'If God sent the plague, prayer, confession, fasting and repentance made sense. People hoped God would forgive them and end the disease.',
        },
        {
          id: 'miasma',
          label: 'Bad air is poisoning people',
          cause: 'Miasma — poisonous air from rotting matter — is causing disease.',
          correctTreatment: 'Burn herbs and clean foul smells',
          wrongTreatments: ['Pilgrimage', 'Purging'],
          explanation: 'If bad air caused disease, then removing or overpowering foul smells seemed logical. People burned herbs, cleaned streets and carried sweet-smelling pomanders.',
        },
        {
          id: 'astrology',
          label: 'The planets are dangerous',
          cause: 'The alignment of planets is disturbing the body.',
          correctTreatment: 'Consult astrological charts',
          wrongTreatments: ['Quarantine rules', 'Antibiotics'],
          explanation: 'If planets influenced the body, treatment needed to be timed carefully. Physicians used astrological charts and Zodiac Man diagrams to decide when treatment was safe.',
        },
        {
          id: 'humours',
          label: 'The humours are out of balance',
          cause: 'Disease is caused by imbalance between blood, phlegm, yellow bile and black bile.',
          correctTreatment: 'Bloodletting or purging',
          wrongTreatments: ['Vaccination', 'Clean water'],
          explanation: 'If disease came from too much of one humour, removing fluid through bloodletting, vomiting or diarrhoea seemed logical.',
        },
      ],
    },

    {
      type: 'matching',
      stage: 'Responses',
      label: 'Belief → response',
      title: 'Match belief to response',
      prompt: 'Drag each treatment to the belief that made it seem logical.',
      pairs: [
        { left: 'God sent the plague', right: 'Prayer, confession and repentance' },
        { left: 'Bad air caused disease', right: 'Burn herbs and clean streets' },
        { left: 'Planets caused disease', right: 'Consult astrological charts' },
        { left: 'Humours out of balance', right: 'Bloodletting and purging' },
      ],
    },

    {
      type: 'visualLearning',
      stage: 'Responses',
      label: 'Why treatments failed',
      scenes: [
        {
          image: '/figures/history/medicine/black-death/flagellant-procession.png',
          headline: 'Prayer and flagellation targeted sin.',
          body: 'If the plague was God’s punishment, the solution was repentance. Some flagellants whipped themselves publicly to show sorrow and earn God’s mercy.',
        },
        {
          image: '/figures/history/medicine/black-death/burning-herbs.png',
          headline: 'Burning herbs targeted bad air.',
          body: 'If disease travelled through miasma, overpowering foul smells seemed sensible. People burned herbs, carried flowers, or cleaned streets.',
        },
        {
          image: '/figures/history/medicine/black-death/bloodletting.png',
          headline: 'Bloodletting targeted the humours.',
          body: 'If disease came from humour imbalance, removing blood seemed logical. But it weakened patients further.',
        },
        {
          image: '/figures/history/medicine/black-death/not-much-changed.png',
          headline: 'None targeted the real cause.',
          body: 'The real cause was bacteria carried by fleas on rats. Medieval treatments did not kill bacteria, stop fleas, or break the transmission chain.',
        },
      ],
    },

    {
      type: 'misconceptionCheck',
      stage: 'Responses',
      label: 'Trap check',
      title: 'Trap: did the Black Death change medicine?',
      misconception: 'The Black Death changed medicine because people finally discovered what caused disease.',
      correctIdea: 'The Black Death changed society, but it did not transform medical understanding.',
      explanation: 'Medieval people did not discover bacteria, fleas or germ theory. They mostly continued to use the same explanations: God, miasma, astrology and humours. Many treatments failed, but no better theory replaced them.',
    },

    {
      type: 'timelineReveal',
      stage: 'Impact',
      label: 'Aftermath',
      title: 'What changed after so many died?',
      intro: 'The plague killed so many people that England could not simply return to normal.',
      events: [
        { year: '1348–49', title: 'Black Death in England', body: 'Between one-third and one-half of the population died.' },
        { year: '1349', title: 'Labour shortage', body: 'There were fewer workers. Peasants demanded higher wages.' },
        { year: '1351', title: 'Statute of Labourers', body: 'The government tried to cap wages and force workers back to pre-plague conditions.' },
        { year: '1381', title: 'Peasants’ Revolt', body: 'Resentment over wages, rights and taxes contributed to rebellion.' },
      ],
    },

    {
      type: 'conceptReveal',
      stage: 'Impact',
      label: 'Change and continuity',
      concept: 'Change ≠ progress',
      definition: 'The Black Death changed society — but it did not lead to a breakthrough in medical understanding.',
      visual: '/figures/history/medicine/black-death/not-much-changed.png',
      explanation: 'A huge event can change life, work and power without changing medical knowledge. Doctors still blamed God, miasma, astrology and humours.',
    },

    {
      type: 'changeContinuityLens',
      stage: 'Impact',
      label: 'What changed? What stayed the same?',
      title: 'Changed by disaster?',
      prompt: 'Sort each consequence into change or continuity.',
      categories: ['Changed', 'Stayed the same'],
      items: [
        { text: 'Labour shortages gave peasants more bargaining power', category: 'Changed' },
        { text: 'Wages rose for many workers', category: 'Changed' },
        { text: 'The Church’s authority was questioned more', category: 'Changed' },
        { text: 'Doctors still blamed God, miasma and humours', category: 'Stayed the same' },
        { text: 'Bloodletting and prayer were still used', category: 'Stayed the same' },
      ],
    },

    {
      type: 'examinerTrap',
      stage: 'Exam prep',
      label: 'Most common trap',
      title: 'The trap: saying it changed medicine',
      trap: 'The Black Death was so terrible that people must have discovered what caused disease afterwards.',
      whyWrong: 'It sounds logical — but it is wrong. People did not discover bacteria, fleas or germ theory. Medical ideas mostly stayed the same.',
      fix: 'Say: it changed society dramatically, but medical understanding changed very little.',
      example: 'Although the Black Death changed wages, labour and confidence in the Church, doctors continued to explain disease through God, miasma, astrology and the Four Humours.',
    },

    {
      type: 'visualLearning',
      stage: 'Exam prep',
      label: 'The story so far',
      scenes: [
        {
          image: '/figures/history/medicine/black-death/plague-background.png',
          headline: 'The Black Death reached England in 1348.',
          body: 'People did not know what caused it.',
        },
        {
          image: '/figures/history/medicine/black-death/miasma.png',
          headline: 'Medieval people blamed three things.',
          body: 'God — as punishment for sin. Miasma — poisonous air. Astrology — planetary alignment.',
        },
        {
          image: '/figures/history/medicine/black-death/labour-shortage.png',
          headline: 'Their treatments reflected those beliefs.',
          body: 'Prayer, flagellation, burning herbs, bloodletting. None of it worked.',
        },
        {
          image: '/figures/history/medicine/black-death/not-much-changed.png',
          headline: 'The Black Death changed society dramatically.',
          body: 'Labour shortage, higher wages, weaker Church authority. But medicine changed very little.',
        },
        {
          image: '/figures/history/medicine/black-death/examiner-marked-answer.png',
          headline: 'Now let\'s make sure you can explain this — not just describe it.',
          body: 'The examiner rewards explanation. Not description.',
        },
        {
          finalReveal: true,
          headline: 'Time to step into the examiner\'s seat.',
          body: 'You\'ll mark real answers, then build your own from 2 marks to full marks.',
        },
      ],
    },

    {
      type: 'examinerExplains',
      stage: 'Exam prep',
      label: 'How examiners think',
      examinerExplains: {
        opening: 'Most students lose marks for the same reason: they describe what happened, but never explain why it mattered. Here is what separates a weak answer from a strong one.',
        tips: [
          {
            heading: 'Identify, then explain',
            body: 'A weak answer just names something — "people prayed", "wages went up". A strong answer keeps going: this meant that... which led to... Each link builds the chain examiners reward.',
          },
          {
            heading: 'Use precise evidence',
            body: 'Replace vague phrases like "lots of people died" with "around one-third of England\'s population died". Precision signals a secure, top-band answer.',
          },
          {
            heading: 'Know the actual cause — and contrast it',
            body: 'Yersinia pestis bacteria, spread by fleas on black rats, was the real cause. Examiners credit students who know this AND can contrast it with what medieval people believed at the time.',
          },
          {
            heading: 'Separate social change from medical change',
            body: 'The plague changed society — wages, the Church\'s authority — but barely changed medicine at all. Mixing these up is one of the most common ways students lose marks on 8-mark questions.',
          },
        ],
        closing: 'Identify it. Then explain it.',
      },
    },

    {
      type: 'faceExaminer',
      stage: 'Exam prep',
      label: 'Face the Examiner',
      examiner: {
        type: '4-mark-explain',
        board: 'edexcel',
        subject: 'history',
        topic: 'black-death',
        difficulty: 'standard',

        question: 'Explain one way religious beliefs affected responses to the Black Death. [4 marks]',
        marks: 4,
        mark: 2,
        summary: 'A partial answer. It correctly identifies prayer as a response and gestures at a reason — but the religious belief behind it stays vague, so the chain stalls before reaching the top band.',

        markScheme: `Level 2 (3–4 marks): Developed explanation linking religious belief to a specific treatment or response, with the full chain (belief → response → why it followed logically).
Level 1 (1–2 marks): Simple identification of a religious response with little or no explanation of why it was chosen.
Award marks for any explained response including:
- Prayer, fasting or pilgrimage — must explain why (belief that illness = God's punishment for sin)
- Flagellants — must explain the religious logic (public suffering to earn God's mercy)
- Priests tending the sick — must link to Christian duty and belief in God's will
Do NOT award for identifying practices without explaining the religious reasoning.`,

        sampleAnswer: `People prayed during the Black Death because they thought God was angry with them. They believed praying would help stop the plague.`,

        annotations: [
          {
            id: 'ann1',
            target: 'People prayed during the Black Death',
            occurrence: 1,
            type: 'strong',
            comment: 'A valid response, named clearly — a sound place to start.',
          },
          {
            id: 'ann2',
            target: 'because they thought God was angry with them.',
            occurrence: 1,
            type: 'weak',
            comment: 'The right idea, but vague. "Angry with them" needs to become the precise GCSE belief: that the plague was God\'s punishment for humanity\'s sins.',
          },
          {
            id: 'ann3',
            target: 'They believed praying would help stop the plague.',
            occurrence: 1,
            type: 'weak',
            comment: 'This restates the response rather than explaining the religious logic. Why would prayer work, if God had sent the plague? Link it to repentance and seeking forgiveness.',
          },
        ],

        improvementPrompts: {
          ann2: {
            prompt: '+ Sharpen the belief',
            placeholder: 'e.g. ...because they believed the plague was God\'s punishment for humanity\'s sins...',
          },
          ann3: {
            prompt: '+ Explain the religious logic',
            placeholder: 'e.g. ...so praying, fasting and going on pilgrimage were ways of asking God for forgiveness, in the hope that He would lift the plague...',
          },
        },

        criteriaOptions: [
          'Named the response',
          'Explained the belief',
          'Linked belief to treatment',
          'Used specific evidence',
          'Developed explanation',
          'Too vague',
          'Repeats the question',
          'Missing explanation',
        ],
      },
    },

    {
      type: 'guidedExamResponse',
      stage: 'Exam prep',
      label: 'Write for the examiner',
      exam: {
        board: 'edexcel',
        subject: 'history',
        topic: 'black-death',

        question: 'Describe two ways the Black Death spread through England. (4 marks)',
        marks: 4,

        sections: [
          {
            label: 'Your first way',
            starter: 'One way the Black Death spread through England was…',
            placeholder: 'Think: how did it first enter England?',
          },
          {
            label: 'Your second way',
            starter: 'Another way it spread was…',
            placeholder: 'Think: what carried the infection from animals to people?',
          },
        ],

        markScheme: `Total: 4 marks. Award up to 2 marks per valid way described, maximum 2 ways.
- 1 mark: simple identification of a valid method of spread (named but not explained)
- 2 marks: identification + specific detail showing HOW that method worked

Way A — Trade and shipping
1 mark: "Ships brought the disease to England" / "It came from Europe by trade"
2 marks: shows the mechanism, e.g. "Trading ships arriving from Europe brought infected rats into English ports such as Melcombe" — names the route (Europe → English ports), the carrier, ideally a named port (Melcombe/Weymouth, where the plague is traditionally first recorded landing in England, 1348)

Way B — Rats and fleas (biological transmission)
1 mark: "Rats spread it" / "Fleas bit people and made them ill"
2 marks: shows the chain, e.g. "Fleas living on black rats carried the plague bacteria and passed it to humans through bites" — must show flea → rat → human-bite chain; credit named detail (black rats / bacteria / Yersinia pestis)

Other valid ways (mark on the same 1/2 basis if developed with equivalent specific detail):
- Person-to-person contact in crowded towns, markets, fairs
- Pneumonic spread via coughing/breathing infected air
- Overcrowding/poor sanitation — ONLY if linked to a specific transmission mechanism, not vague "dirtiness"

Do NOT credit:
- Vague claims with no named mechanism ("people were dirty", "it spread quickly")
- Two restatements of the same method (counts as one way)
- Generic "germs"/"disease" with no transmission route described

Exemplar 4/4 answer: "Trading ships arriving from Europe brought infected rats into English ports such as Melcombe. Fleas living on black rats carried the plague bacteria and passed it to humans through bites."`,
      },
    },

    {
      type: 'quickRecall',
      stage: 'Exam prep',
      label: 'Final chapter challenge',
      questions: [
        {
          type: 'choice',
          question: 'What year did the Black Death reach England?',
          options: ['1348', '1350', '1345', '1381'],
          correct: 0,
          explanation: '1348 — ships arrived at Melcombe in Dorset in June 1348, bringing the plague to England.',
        },
        {
          type: 'choice',
          question: 'What was miasma?',
          options: ['Poisonous air believed to cause disease', 'Bacteria carried by fleas', 'God\'s punishment for sin', 'An imbalance of the Four Humours'],
          correct: 0,
          explanation: 'Miasma meant poisonous air from rotting matter. Not germs — the smell itself was thought to carry disease.',
        },
        {
          type: 'choice',
          question: 'Why did people pray during the Black Death?',
          options: ['They believed God had sent the disease as punishment for sin', 'Prayer was proven to cure plague', 'The Church ordered everyone to pray', 'They had no other option'],
          correct: 0,
          explanation: 'If illness was God\'s punishment, prayer and repentance were the logical response — they hoped God would forgive humanity and end the plague.',
        },
        {
          type: 'choice',
          question: 'What actually caused the Black Death?',
          options: ['Plague bacteria (Yersinia pestis) carried by fleas on rats', 'Poisonous air from plague pits', 'God\'s punishment for sin', 'Planetary alignment'],
          correct: 0,
          explanation: 'Yersinia pestis bacteria, carried by fleas on black rats. This was not discovered until 1894 — 546 years after the Black Death.',
        },
        {
          type: 'choice',
          question: 'What changed significantly after the Black Death?',
          options: ['Society — labour shortages led to higher wages', 'Medicine — doctors discovered the real cause', 'The Church — it became more powerful', 'Astrology — people stopped using it'],
          correct: 0,
          explanation: 'Society changed dramatically — labour shortages, higher wages, weakened Church authority. But medicine barely changed at all.',
        },
        {
          type: 'choice',
          question: 'What stayed the same after the Black Death?',
          options: ['Medical beliefs — the same explanations continued', 'Peasant wages — they stayed low', 'The Church\'s authority — it remained strong', 'Village populations — they recovered quickly'],
          correct: 0,
          explanation: 'Medical beliefs stayed the same — doctors continued to blame God, miasma, and humoral imbalance. The actual cause was not discovered until 1894.',
        },
      ],
    },

  ],
}
