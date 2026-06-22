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
    { id: 'part-3', title: 'How Medieval Minds Explained It', description: 'God, miasma, astrology and humoural beliefs.', screenIndex: 8 },
    { id: 'part-4', title: 'Treatments in a World Without Germs', description: 'Plague responses, treatments and prevention attempts.', screenIndex: 13 },
    { id: 'part-5', title: 'Changed by Disaster?', description: 'Social, economic and medical aftermath of the plague.', screenIndex: 17 },
    { id: 'part-6', title: 'Exam Prep: Crisis, Continuity and Change', description: 'Examiner traps, mark-scheme thinking and exam practice.', screenIndex: 22 },
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
      stage: 'The arrival',
      label: 'How the plague actually spread',
      kicker: 'The hidden chain',
      heading: 'How the plague actually spread',
      sub: 'Put together what you just explored on the dock.',
      blocks: [
        {
          type: 'timelineChain',
          intro: 'You explored the ship, the crew, the cargo, and the rats. Here is the chain connecting them — the one nobody in 1348 could see. Tap each step to reveal why it mattered.',
          steps: [
            {
              id: 'ship',
              icon: '🚢',
              image: '/figures/history/medicine/black-death/plague-dock.png', // placeholder — replace with a ship-specific image
              label: 'Trading ships carried infected cargo',
              detail: 'Hidden in the hold, alongside the cargo, travelled black rats — carried from infected Mediterranean ports.',
            },
            {
              id: 'rats',
              icon: '🐀',
              image: '/figures/history/medicine/black-death/plague-dock.png', // placeholder — replace with a rat-specific image
              label: 'The rats carried infected fleas',
              detail: 'No one suspected the rats — they were everywhere on every dock, and ignored. The fleas they carried were infected with Yersinia pestis bacteria.',
            },
            {
              id: 'fleas',
              icon: '🦟',
              image: '/figures/history/medicine/black-death/plague-dock.png', // placeholder — replace with a flea-specific image
              label: 'The fleas bit people when rats died',
              detail: 'A single bite passed the bacteria directly into a person\'s bloodstream.',
            },
            {
              id: 'spread',
              icon: '🏘️',
              image: '/figures/history/medicine/black-death/plague-dock.png', // placeholder — replace with a town-spread image
              label: 'The disease spread through towns and villages',
              detail: 'Within weeks of the ship docking at Melcombe, the surrounding area was dying.',
            },
          ],
          outro: 'This is the transmission chain: ship → rat → flea → person. Medieval people never made this connection — it would take another 500 years. Try explaining the chain in your own words.',
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
          body: 'Ships moving across the Mediterranean brought infected rats and fleas from port to port. By 1347, it had reached Sicily and southern Europe.',
        },
        {
          image: '/figures/history/medicine/black-death/medieval-town.png',
          headline: 'England, 1348.',
          body: 'Arriving through southern ports, the plague spread north. It reached London by autumn 1348 and had swept the country by 1350.',
        },
        {
          finalReveal: true,
          headline: 'Nowhere was safe.',
          body: 'The plague killed an estimated one-third of Europe\'s population — roughly 25 million people — in just four years. Picture every third person you know. Then picture them gone.',
        },
      ],
    },

    {
      type: 'visualLearning',
      stage: 'The arrival',
      label: 'The scale of the disaster',
      scenes: [
        {
          image: '/figures/history/medicine/black-death/empty-town.png',
          headline: 'In England, between one-third and one-half of the entire population died.',
          body: 'In some villages, no one survived. Whole communities ceased to exist.',
        },
        {
          image: '/figures/history/medicine/black-death/empty-town.png',
          headline: 'Bodies piled up faster than they could be buried.',
          body: 'Mass graves — plague pits — were dug outside towns. Normal burial rites became impossible.',
        },
        {
          image: '/figures/history/medicine/black-death/empty-town.png',
          headline: 'Three types. All deadly.',
          body: 'Bubonic (swellings in groin and armpit, spread by flea bites). Pneumonic (lung infection, spread through the air). Septicaemic (blood poisoning, almost always fatal).',
        },
        {
          finalReveal: true,
          headline: 'The symptoms were unmistakeable.',
          body: 'Egg-sized swellings. Fever. Blackened skin. Death within days. Medieval people had never seen anything like it.',
        },
      ],
    },

    {
      type: 'progressionTimeline',
      stage: 'The arrival',
      label: 'Symptoms of the plague',
      title: 'How the plague killed',
      description: 'Follow the progression of bubonic plague through the body.',
      image: '/figures/history/medicine/black-death/symptom-case-file.png',
      stages: [
        { day: '1–2',  label: 'Flea bite',        description: 'A flea carrying Yersinia pestis bacteria bites the skin. The bacteria enter the lymphatic system.' },
        { day: '3–5',  label: 'Buboes form',       description: 'Painful egg-sized swellings (buboes) appear in lymph nodes — groin, armpit, or neck.' },
        { day: '5–7',  label: 'High fever',        description: 'Severe fever, chills, headache and extreme exhaustion as the body fights a losing battle.' },
        { day: '7–10', label: 'Black patches',     description: 'Black patches of dead tissue appear on the skin. Internal bleeding causes dark discolouration.' },
        { day: '10+',  label: 'Death or survival', description: 'Most victims died within 10 days. A small number survived, possibly due to natural immunity.' },
      ],
    },

    // ── Section 3: Medieval explanations ────────────────────────────────────

    {
      type: 'guidedChoiceCarousel',
      stage: 'Medieval explanations',
      id: 'plague-belief-carousel',
      tag: 'plague-explanations',
      label: 'What would you believe?',
      headline: 'Agnes has the plague.\nHer village is terrified.',
      question: 'You have no microscope. No germ theory. What do you think caused this?',
      helperText: 'Swipe to explore the explanations.',
      promptVisual: { src: '/figures/history/medicine/black-death/medieval-town.png', alt: 'Medieval village during the plague' },
      options: [
        {
          title: 'God\'s punishment',
          image: '/headers/history-medicine-medieval-scripture.png',
          sections: [
            { heading: 'The logic',        items: ['Sin brings punishment', 'Only God can cure it', 'Repentance = recovery'] },
            { heading: 'Who believed this', items: ['Church', 'Most ordinary people', 'Priests'] },
            { heading: 'Belief → response', items: ['Sin caused it → so repent through prayer', 'Only God could lift it → so fast and go on pilgrimage', 'Suffering pleased God → so flagellants whipped themselves'] },
          ],
          reaction: '"The Lord is punishing us for our sins."',
          buttonText: 'Choose God\'s punishment',
          nextScreenId: 'plague-beliefs-reveal',
          revealLines: [
            'You chose God\'s punishment.',
            'To a medieval person, this was not superstition — it was logical.',
            'If God controls everything and the plague kills thousands, then God must have sent it.',
            'The response was prayer, fasting, pilgrimage, and confession.',
            'Some went further: flagellants marched through towns, whipping themselves publicly.',
            'None of it stopped the plague.',
          ],
        },
        {
          title: 'Miasma — bad air',
          image: '/figures/history/medicine/black-death/miasma.png',
          sections: [
            { heading: 'The logic',        items: ['Bad smells carry disease', 'Plague smells terrible', 'Clean the air = stop the plague'] },
            { heading: 'Who believed this', items: ['Physicians', 'Educated people', 'City authorities'] },
            { heading: 'Belief → response', items: ['Bad air carried it → so burn herbs to purify it', 'Pits and sewers smelled foul → so avoid them and carry flowers', 'Fresh air seemed safer → so open windows and air rooms out'] },
          ],
          reaction: '"The air near the plague pits reeks. It must be poisoned."',
          buttonText: 'Choose miasma',
          nextScreenId: 'plague-beliefs-reveal',
          revealLines: [
            'You chose miasma.',
            'This was the most scientific view available.',
            'People noticed plague was worse near sewers, rubbish heaps, and plague pits.',
            'They were right about the location. Wrong about the cause.',
            'It wasn\'t the smell — it was fleas and bacteria.',
            'People carried flowers, burned aromatic herbs indoors, and held sweet-smelling posies to the nose to "cleanse" the air.',
          ],
        },
        {
          title: 'Planetary alignment',
          image: '/headers/history-medicine-germ-bridge.png',
          sections: [
            { heading: 'The logic',        items: ['Planets influence health', 'Bad alignment = disease', 'Saturn, Jupiter, Mars'] },
            { heading: 'Who believed this', items: ['University physicians', 'Paris Medical Faculty', 'Astrologers'] },
            { heading: 'Belief → response', items: ['Stars controlled health → so consult astrological charts', 'Bad alignment poisoned the air → so avoid risky days', 'Only the stars could change it → so wait for better skies'] },
          ],
          reaction: '"Saturn, Jupiter and Mars aligned in Aquarius. This poisoned the air."',
          buttonText: 'Choose planetary alignment',
          nextScreenId: 'plague-beliefs-reveal',
          revealLines: [
            'You chose planetary alignment.',
            'In 1348, the Paris Medical Faculty officially blamed the plague on a triple conjunction of Saturn, Jupiter and Mars in Aquarius in 1345.',
            'This was mainstream medicine — the official view of Europe\'s most respected medical institution.',
            'If the stars caused the plague, you couldn\'t cure it by treating the body.',
            'You had to wait for the stars to change.',
          ],
        },
      ],
    },

    {
      type: 'visualLearning',
      id: 'plague-beliefs-reveal',
      stage: 'Medieval explanations',
      label: 'What medieval people believed',
      scenes: [
        {
          image: '/figures/history/medicine/black-death/plague-background.png',
          headline: 'Medieval people had three main explanations for the Black Death.',
          body: 'God\'s punishment, miasma — bad air — and planetary alignment. Each came with its own treatment.',
        },
        {
          image: '/headers/history-medicine-medieval-scripture.png',
          headline: 'God was punishing humanity for its sins.',
          body: 'This led to prayer, fasting, pilgrimage, and confession. Flagellants publicly whipped themselves to demonstrate suffering and seek mercy.',
        },
        {
          image: '/figures/history/medicine/black-death/miasma.png',
          headline: 'Miasma — the smell of disease.',
          body: 'Bad air from decaying matter was thought to carry the plague. People burned aromatic herbs and carried posies of flowers to counteract it.',
        },
        {
          image: '/headers/history-medicine-germ-bridge.png',
          headline: 'The stars were aligned in the wrong positions.',
          body: 'In 1348, the Paris Medical Faculty officially blamed the Black Death on a triple conjunction of Saturn, Jupiter, and Mars in Aquarius in 1345.',
        },
        {
          finalReveal: true,
          headline: 'All three explanations were wrong.',
          body: 'They were internally logical, given what was known. The actual cause would not be discovered for another 500 years.',
        },
      ],
    },

    {
      type: 'matchingTask',
      stage: 'Medieval explanations',
      label: 'Beliefs and responses',
      subject: 'History',
      title: 'Beliefs and responses',
      instruction: 'Match each plague explanation to its treatment.',
      weakAreaCategory: 'Black Death Beliefs',
      backgroundImage: '/figures/history/medicine/black-death/miasma.png',
      pairs: [
        { id: 'god-prayer',    term: 'God\'s punishment',      answer: 'Prayer, fasting, pilgrimage, and flagellation to seek God\'s forgiveness.' },
        { id: 'miasma-herbs',  term: 'Miasma — bad air',       answer: 'Burning aromatic herbs and carrying posies of flowers to counteract the smell.' },
        { id: 'stars-charts',  term: 'Planetary alignment',    answer: 'Consulting astrological charts and waiting for favourable star positions.' },
        { id: 'humours-blood', term: 'Imbalance of humours',   answer: 'Bloodletting and purging to restore balance between the Four Humours.' },
      ],
    },

    {
      type: 'visualLearning',
      stage: 'Medieval explanations',
      label: 'The actual cause',
      scenes: [
        {
          image: '/figures/history/medicine/black-death/plague-background.png',
          headline: 'The actual cause was invisible to medieval eyes.',
          body: 'Not God. Not bad air. Not the stars.',
        },
        {
          image: '/figures/history/medicine/black-death/trade-routes-map.png',
          headline: 'Black rats travelled on trading ships.',
          body: 'The ships that brought goods from Asia also carried black rats — and the fleas that lived on them.',
        },
        {
          image: '/figures/history/medicine/black-death/symptom-case-file.png',
          headline: 'Fleas carried the bacteria.',
          body: 'Fleas fed on infected rats. When the rats died, the fleas moved to human hosts. The bite transferred Yersinia pestis bacteria into the bloodstream.',
        },
        {
          finalReveal: true,
          headline: 'This would not be discovered until 1894.',
          body: 'Alexandre Yersin identified the bacteria in Hong Kong during a plague outbreak — almost 550 years after the Black Death hit England.',
        },
      ],
    },

    {
      type: 'quickRecall',
      stage: 'Medieval explanations',
      label: 'Causes and beliefs check',
      questions: [
        {
          type: 'choice',
          question: 'What did the Paris Medical Faculty blame for the Black Death?',
          options: ['A triple conjunction of Saturn, Jupiter and Mars', 'God\'s punishment for sin', 'Miasma from plague pits', 'Bad food and water'],
          correct: 0,
          explanation: 'The Paris Medical Faculty officially blamed the Black Death on the conjunction of Saturn, Jupiter and Mars in Aquarius in 1345.',
        },
        {
          type: 'choice',
          question: 'What actually caused the Black Death?',
          options: ['Yersinia pestis bacteria spread by fleas on rats', 'Bad air from rotting matter', 'God\'s punishment for sin', 'Imbalance of the Four Humours'],
          correct: 0,
          explanation: 'Yersinia pestis bacteria were carried by fleas that lived on black rats. When infected rats died, the fleas moved to human hosts.',
        },
        {
          type: 'choice',
          question: 'Why did people carry posies of flowers during the plague?',
          options: ['To ward off miasma — the bad air believed to cause disease', 'As offerings to God', 'Because flowers contained a natural remedy', 'To mark houses where plague had struck'],
          correct: 0,
          explanation: 'People believed miasma (bad air) spread the plague. Sweet-smelling flowers and herbs were thought to counteract the poisoned air.',
        },
      ],
    },

    // ── Section 4: Treatments ────────────────────────────────────────────────

    {
      type: 'collectionExplorer',
      stage: 'Treatments and prevention',
      label: 'Plague treatments',
      title: 'Plague treatments',
      description: 'Tap each item to discover what medieval people tried against the plague.',
      backgroundImage: '/figures/history/medicine/black-death/not-much-changed.png',
      items: [
        {
          id: 'flagellants',
          label: 'Flagellants',
          x: 18, y: 22,
          reveals: [
            { text: 'Flagellants were groups of people who marched between towns, whipping themselves publicly as an act of penance.' },
            { text: 'They believed God had sent the plague as punishment for sin. By suffering publicly, they hoped to show God their repentance and earn mercy.' },
            { text: 'The Church eventually condemned flagellant groups in 1349 — they had become too large and too independent of priestly authority.' },
          ],
        },
        {
          id: 'posies',
          label: 'Posies and herbs',
          x: 75, y: 18,
          reveals: [
            { text: 'People carried small bunches of sweet-smelling flowers and herbs — posies — because they believed miasma (bad air) carried the plague.' },
            { text: 'Breathing pleasant smells was thought to counteract the poisoned air. Rosemary, lavender and rue were popular choices.' },
            { text: 'Physicians told the sick to hold a sponge soaked in vinegar or sweet herbs close to the nose, believing this could block the poisoned air from entering the body.' },
          ],
        },
        {
          id: 'bloodletting',
          label: 'Bloodletting',
          x: 28, y: 60,
          reveals: [
            { text: 'Physicians continued to prescribe bloodletting during the plague — removing blood to restore the body\'s humoral balance.' },
            { text: 'Within the Four Humours system, this made sense: if the body was overwhelmed, excess of one humour might be responsible.' },
            { text: 'Bloodletting weakened already ill patients and almost certainly made their condition worse. The theory was wrong, but internally consistent.' },
          ],
        },
        {
          id: 'burning-fires',
          label: 'Burning fires',
          x: 72, y: 62,
          reveals: [
            { text: 'City authorities ordered large fires to be lit in streets and open spaces, believing the smoke would cleanse the air of miasma.' },
            { text: 'Aromatic wood such as oak was favoured. Some towns kept fires burning continuously during outbreaks.' },
            { text: 'This was a rational response given the miasma theory — but entirely useless against Yersinia pestis bacteria.' },
          ],
        },
        {
          id: 'fleeing',
          label: 'Fleeing the city',
          x: 50, y: 83,
          reveals: [
            { text: 'Wealthy people fled to the countryside when plague struck. Without understanding the real cause, this sometimes helped — they left the fleas behind.' },
            { text: 'But they could carry infected fleas with them, spreading the plague to new areas.' },
            { text: 'The poor could not afford to flee. They stayed in crowded conditions and died at much higher rates.' },
          ],
        },
      ],
      synthesis: {
        heading: 'What all these treatments had in common',
        points: [
          'Every treatment was based on a wrong understanding of the cause.',
          'None of them addressed Yersinia pestis bacteria or the fleas that carried it.',
          'Medieval people were not stupid — they were reasoning logically from wrong premises.',
        ],
        examTakeaway: 'Wrong cause → wrong treatment. Every time.',
      },
    },

    {
      type: 'matchingTask',
      stage: 'Treatments and prevention',
      label: 'Treatment to belief',
      subject: 'History',
      title: 'Treatment to belief',
      instruction: 'Match each plague treatment to the belief that drove it.',
      weakAreaCategory: 'Black Death Treatments',
      backgroundImage: '/figures/history/medicine/black-death/flagellants.png',
      pairs: [
        { id: 'flagellants-god',    term: 'Flagellants whipping themselves',  answer: 'God sent the plague as punishment — public suffering might earn His forgiveness.' },
        { id: 'posies-miasma',      term: 'Carrying posies of flowers',       answer: 'Miasma — sweet smells were thought to counteract the poisoned bad air.' },
        { id: 'bloodletting-hum',   term: 'Bloodletting',                     answer: 'Four Humours — removing blood was meant to restore the body\'s natural balance.' },
        { id: 'fires-miasma',       term: 'Burning fires in the streets',     answer: 'Miasma — smoke was thought to cleanse infected air and stop disease spreading.' },
      ],
    },

    // ── Section 5: Living through the plague ────────────────────────────────

    {
      type: 'visualNarrative',
      stage: 'Life during the plague',
      label: 'A village in 1349',
      beats: [
        {
          image: '/figures/history/medicine/black-death/medieval-town.png',
          label: 'ENGLAND, 1349',
          headline: 'A village at the edge of the epidemic.',
          body: 'Three months ago, everything was normal. Then a traveller arrived.',
        },
        {
          image: '/figures/history/medicine/black-death/empty-town.png',
          imageOpacity: 0.65,
          facts: [
            'The priest died first, then the blacksmith.',
            'Farmers abandoned their fields to flee.',
            'Landlords found no one to work their land.',
            'Church bells rang almost without stopping — too many dead for individual funerals.',
          ],
          conclusion: 'For a year, normal life stopped.\n\nThe world that emerged would look very different.',
        },
      ],
    },

    {
      type: 'visualLearning',
      stage: 'Life during the plague',
      label: 'Rich and poor',
      scenes: [
        {
          image: '/figures/history/medicine/black-death/rich-vs-poor.png',
          headline: 'The plague did not kill equally.',
          body: 'Wealthy people could flee to the countryside. The poor, crowded into towns and unable to leave, died in far greater numbers.',
        },
        {
          image: '/figures/history/medicine/black-death/empty-town.png',
          headline: 'Villages were abandoned.',
          body: 'Entire communities disappeared. Hundreds of settlements in England were deserted. The evidence survives today as earthwork humps in fields.',
        },
        {
          image: '/headers/history-medicine-medieval-scripture.png',
          headline: 'The Church was badly hit.',
          body: 'Priests and monks died in huge numbers — often because they stayed to care for the sick. In some areas, up to half of all clergy died.',
        },
        {
          finalReveal: true,
          headline: 'The scale of death was unlike anything in living memory.',
          body: 'England after 1350 was a fundamentally different place. The old social order had been shaken to its foundations.',
        },
      ],
    },

    // ── Section 6: The aftermath ─────────────────────────────────────────────

    {
      type: 'visualLearning',
      stage: 'The aftermath',
      label: 'What changed after the plague',
      scenes: [
        {
          image: '/figures/history/medicine/black-death/labour-shortage.png',
          headline: 'The Black Death created a labour shortage.',
          body: 'So many people died that there were not enough labourers to farm the land. For the first time, surviving peasants could demand higher wages.',
        },
        {
          image: '/figures/history/medicine/black-death/labour-shortage.png',
          headline: 'Wages rose. Conditions improved.',
          body: 'Landlords had to offer better pay and conditions to attract workers. Many peasants moved from one lord to another, seeking the best deal.',
        },
        {
          image: '/figures/history/medicine/black-death/flagellants.png',
          headline: 'The Church\'s authority weakened.',
          body: 'Prayers had not stopped the plague. Many people lost faith in the Church\'s ability to protect them. The Church\'s moral authority began to crack.',
        },
        {
          finalReveal: true,
          headline: 'The seeds of social change.',
          body: 'The combination of labour power, weakened Church authority and social disruption helped lay the groundwork for the Peasants\' Revolt of 1381.',
        },
      ],
    },

    {
      stage: 'The aftermath',
      label: 'The causal chain',
      kicker: 'Change and continuity',
      heading: 'Why the Black Death changed England',
      sub: 'Follow the chain of cause and effect.',
      blocks: [
        {
          type: 'explainReveal',
          intro: 'The Black Death didn\'t just kill people. It set in motion a chain of changes that reshaped English society.',
          atmosphereImage: '/figures/history/medicine/black-death/labour-shortage.png',
          steps: [
            {
              id: 'population-falls',
              statement: 'Between one-third and one-half of England\'s population died.',
              emphasis: 'That meant far fewer workers to farm the land.',
              detail: 'In some regions, entire villages disappeared. Landlords suddenly had too much land and too few people to work it.',
            },
            {
              id: 'labour-shortage',
              statement: 'The labour shortage gave surviving peasants rare bargaining power.',
              emphasis: 'For the first time, they could demand higher wages.',
              detail: 'This directly challenged the feudal system, in which peasants were bound to their lord and could not negotiate their conditions.',
            },
            {
              id: 'church-weakened',
              statement: 'The Church had promised that faith could protect the faithful.',
              emphasis: 'It hadn\'t. The Church lost credibility.',
              detail: 'Priests and monks died in huge numbers, often while tending to the sick. If God\'s own servants couldn\'t be protected, what did that say about God\'s power?',
            },
            {
              id: 'social-change',
              statement: 'A weaker Church and empowered peasants created instability.',
              emphasis: 'This contributed to the Peasants\' Revolt of 1381.',
              detail: 'When landlords tried to reimpose pre-plague labour conditions, the revolt showed how much England had changed. The old order could not simply be restored.',
            },
          ],
          reflectionPrompt: 'How did population decline lead to social and religious change?',
        },
      ],
    },

    {
      type: 'naturalSupernaturalSwipe',
      stage: 'The aftermath',
      label: 'Changed or stayed the same?',
      columns: [
        { label: 'CHANGED\nBy 1350',         color: '#4CAF7D', colorRgb: '76,175,125', bg: 'rgba(76,175,125,.07)', image: '/figures/history/medicine/black-death/aftermath-changed.png' },
        { label: 'STAYED THE SAME\nBy 1350', color: '#8C3A2A', colorRgb: '140,58,42',  bg: 'rgba(140,58,42,.07)',  image: '/figures/history/medicine/black-death/aftermath-unchanged.png' },
      ],
      items: [
        { label: 'Peasant wages — labourers could now demand higher pay',          col: 0, explanation: 'Changed — the labour shortage gave survivors real bargaining power for the first time.' },
        { label: 'Medical explanations — doctors still blamed miasma and God',     col: 1, explanation: 'Stayed the same — medieval doctors used exactly the same explanations after the plague as before. Medicine did not change.' },
        { label: 'Church authority — many people lost faith in its power',         col: 0, explanation: 'Changed — prayer had not stopped the plague. The Church\'s spiritual authority was visibly damaged.' },
        { label: 'The Four Humours — still taught in universities after 1350',     col: 1, explanation: 'Stayed the same — the humoral system remained the basis of medical teaching. The plague gave doctors no new tools.' },
        { label: 'Feudal labour obligations — many peasants refused to comply',    col: 0, explanation: 'Changed — surviving peasants used their scarcity to resist returning to pre-plague conditions.' },
        { label: 'Medical treatments — bloodletting, herbs and prayer continued', col: 1, explanation: 'Stayed the same — without understanding the real cause, treatments could not improve.' },
      ],
      explanation: 'The Black Death changed society dramatically — but it changed medicine almost not at all. The same theories and treatments continued for another 300 years.',
    },

    {
      type: 'cinematic',
      stage: 'The aftermath',
      label: 'Medicine stayed the same',
      fallbackImage: '/figures/history/medicine/black-death/not-much-changed.png',
      year: 'c.1350',
      paragraphs: [
        'The Black Death killed up to half of England.',
        'It weakened the Church. It empowered the poor. It destabilised the feudal system.',
        'But it did not change medicine.',
        'Doctors looked at the plague and saw exactly what they expected to see: God\'s punishment, miasma, bad planetary alignment.',
        'They already had their explanations. The plague just confirmed them.',
        'The real cause — bacteria spread by fleas on rats — would not be discovered for another 546 years.',
      ],
    },

    {
      type: 'quickRecall',
      stage: 'The aftermath',
      label: 'Aftermath check',
      questions: [
        {
          type: 'choice',
          question: 'Why did peasant wages rise after the Black Death?',
          options: ['There were not enough workers to farm the land', 'The king ordered wage increases', 'The Church paid workers more', 'Trade increased'],
          correct: 0,
          explanation: 'The population fall created a labour shortage. Surviving peasants could demand better wages because landowners needed workers and had to compete for them.',
        },
        {
          type: 'choice',
          question: 'How did the Black Death affect the Church\'s authority?',
          options: ['It weakened it — prayer had failed to stop the plague', 'It strengthened it — people prayed more', 'It had no effect', 'It made the Church wealthier'],
          correct: 0,
          explanation: 'Many people lost faith in the Church because prayer had not protected the faithful. Clergy died in large numbers, damaging the Church\'s image of spiritual power.',
        },
        {
          type: 'choice',
          question: 'What happened to medical theory after the Black Death?',
          options: ['It barely changed — the same explanations continued', 'Doctors discovered the true cause', 'Germ theory was developed', 'The Church banned the Four Humours theory'],
          correct: 0,
          explanation: 'Without microscopes or germ theory, medieval doctors continued using the same explanations after the plague as before. Medical thinking did not change.',
        },
      ],
    },

    // ── Section 6: Summary & Examiner ──────────────────────────────────────────

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
            placeholder: '…ships brought infected rats from Europe into English ports.',
          },
          {
            label: 'Your second way',
            starter: 'Another way it spread was…',
            placeholder: '…fleas living on rats bit people and passed on the disease.',
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
