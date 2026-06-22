export const episode = {
  id: 'history-medicine-great-stink',
  subject: 'History',
  number: 8,
  title: 'The Great Stink',
  subtitle: 'Cities, sewers & slow progress',
  era: 'c1800–c1900',
  icon: '🏭',
  color: '#9A5A18',
  colorLight: 'rgba(154,90,24,.12)',
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],
  hook: {
    scenario: {
      location: 'London, 1854',
      hint: 'People are drawing water from a pump on Broad Street. Several neighbours have died this week.',
    },
    statement: 'Victorian Londoners knew that drinking from the Thames could spread cholera.',
    isTrue: false,
    accentWords: ['Thames', 'cholera'],
    explanation: "Most people blamed miasma — the smell of the river. It took one doctor, John Snow, to map deaths door-by-door in 1854 and prove the water itself was the killer.",
    wrongFeedback: 'Most people still blamed miasma — bad air from the river. The water itself seemed fine.',
    correctFeedback: 'Right — even as people died, most blamed smell, not water. It took one doctor to prove otherwise.',
    loadingText: 'Tracing the outbreak…',
    bigQuestion: 'So how did anyone figure out the water was the problem?',
    revealHeader: 'John Snow mapped every death.',
    revealItems: [
      { emoji: '🗺️', label: 'Snow\'s map changed medicine', detail: 'Dr John Snow plotted every cholera death on a street map of Soho. They clustered around one water pump on Broad Street. He removed the handle — the outbreak stopped. Data beat dogma.', color: '#9A5A18', bg: 'rgba(154,90,24,.08)' },
      { emoji: '🏙️', label: 'Cities were death traps', detail: 'Industrial towns packed thousands into slums with no sewage, shared privies and water drawn from rivers full of waste. Life expectancy in Manchester in 1840 was 28 years for labourers.', color: '#B06520', bg: 'rgba(176,101,32,.08)' },
      { emoji: '🚧', label: 'Government had to act — but didn\'t want to', detail: 'Laissez-faire politics meant the government resisted spending on sewers. It took the Great Stink of 1858 — when Parliament itself smelled the Thames — to force Bazalgette\'s sewer system through.', color: '#C47828', bg: 'rgba(196,120,40,.08)' },
    ],
    punchline: 'Public health improved not because government wanted to act — but because the smell reached Parliament.',
  },
  intro: {
    learningGoals: [
      'Explain why public health was so poor in industrial towns',
      'Describe Chadwick\'s 1842 report and why the government was slow to act',
      'Explain John Snow\'s role in proving cholera was waterborne',
      'Describe the 1875 Public Health Act and why it was a genuine turning point',
    ],
  },
  outcomes: {
    intro: "Knowing what causes disease is useless if society won't act on it. This chapter shows why change is always slower than science.",
    bullets: [
      'Explain why 19th-century cities were genuine death traps',
      'Describe the cholera outbreaks and what they finally revealed',
      'See why governments were so reluctant to improve public health',
      "Link Snow's map and the Broad Street pump to the birth of epidemiology",
    ],
  },

  recall: {
    questions: [
      { type: 'truefalse', question: 'John Snow proved cholera spread through water in 1854.', isTrue: true },
      { type: 'choice', question: 'Why did governments resist improving public health?', options: ['Scientists disagreed about the causes', 'It was costly and meant government interference', 'People refused to use sewers'], correct: 1 },
      { type: 'connection', question: 'The Great Stink of 1858 mattered because...', options: [
        { text: 'It killed enough MPs to force a vote', icon: 'warning' },
        { text: 'It forced Parliament to fund Bazalgette\'s sewer system', icon: 'people' },
        { text: 'It proved miasma theory was correct after all', icon: 'leaf' },
      ], correct: 1 },
    ],
  },
  stageNavigation: [
    { id: 'part-1', title: 'A City That Could Not Breathe', description: 'Industrial towns, overcrowding and the public health crisis.', screenIndex: 0 },
    { id: 'part-2', title: 'Cholera, Crowding and Filth', description: 'Cholera outbreaks and why cities were death traps.', screenIndex: 1 },
    { id: 'part-3', title: 'Miasma Meets Evidence', description: 'Chadwick\'s report and John Snow\'s map.', screenIndex: 2 },
    { id: 'part-4', title: 'The Government Finally Moves', description: 'From laissez-faire to the 1875 Public Health Act.', screenIndex: 4 },
    { id: 'part-5', title: 'Prevention Becomes Public', description: 'The Great Stink, Bazalgette\'s sewers and lasting change.', screenIndex: 5 },
    { id: 'part-6', title: 'Exam Prep: Why Public Health Changed', description: 'Exam practice and final application.', screenIndex: 6 },
  ],
  screens: [
    {
      label: 'Cities Explode',
      kicker: 'Cause of the Problem',
      heading: 'Industrialisation: cities exploded',
      sub: 'From 1750, people moved from rural areas into towns and cities. The cities were not ready. Not even slightly.',
      blocks: [
        { type: 'read', label: '📖 Core Knowledge', text: 'Urban populations grew hugely, but public health systems did not grow with them. More people meant more waste, more overcrowding and faster disease spread. <strong>London</strong> grew from 1.09m to 5.57m between 1801 and 1901. Manchester, Birmingham and Glasgow saw similar explosions.' },
        { type: 'examtip', label: '🗡️ Exam Assassin', phrases: ['rapid urbanisation'], tip: 'Industrialisation caused towns to grow faster than housing, water supplies and sewage systems could cope.' },
        { type: 'read', label: '☠️ Six Ways Cities Killed You', text: '<strong>Cramped housing</strong> spread disease. <strong>Shared toilets</strong> and poor drainage built up waste near homes. <strong>Cesspits</strong> leaked into drinking water. <strong>Street pumps</strong> supplied contaminated water. <strong>Coal smoke</strong> damaged lungs. All of these worked together to spread disease rapidly.' },
        { type: 'quiz', question: 'Why did industrialisation cause a public health crisis?', options: [
          { text: 'Cities grew faster than housing, sanitation and water systems could cope', correct: true },
          { text: 'People chose to be unhealthy', correct: false },
          { text: 'Germ theory caused the problem', correct: false },
          { text: 'The government banned clean water', correct: false },
        ], explanation: 'Rapid urbanisation overwhelmed public health systems, causing disease to spread through overcrowding, poor sanitation and contaminated water.' },
      ]
    },
    {
      label: 'Cholera',
      kicker: 'Disease',
      heading: 'Cholera: the killer nobody understood',
      sub: 'Cholera spread fast and killed through severe dehydration. People still blamed bad air.',
      blocks: [
        { type: 'read', label: '☠️ Cholera', text: 'Cholera first arrived in England in <strong>1831</strong>. It caused vomiting, diarrhoea, dehydration and often death. Major epidemics happened in <strong>1831, 1848, 1854 and 1866</strong>. Even during outbreaks, many people still believed <strong>miasma</strong> caused disease — which slowed acceptance of the waterborne explanation.' },
        { type: 'quiz', question: 'How was cholera actually spread?', options: [
          { text: 'Through contaminated food or water', correct: true },
          { text: 'By bad smells only', correct: false },
          { text: 'By too much coal smoke', correct: false },
          { text: 'By four humours becoming unbalanced', correct: false },
        ], explanation: 'Cholera was waterborne. The continuing belief in miasma slowed understanding of this — a key continuity point.' },
      ]
    },
    {
      label: 'Chadwick',
      kicker: 'Key Person 1',
      heading: 'Edwin Chadwick: "Please clean literally anything"',
      sub: 'Chadwick investigated living conditions and used evidence to push for public health reform.',
      blocks: [
        { type: 'read', label: '📖 Core Knowledge', text: '<strong>Edwin Chadwick</strong> was a lawyer and social reformer. In <strong>1842</strong> he published the <em>Report on the Sanitary Conditions of the Labouring Population of Great Britain</em>. It showed that poor sanitation and poverty were linked to low life expectancy. Manchester labourers lived to 15–19; rural professionals lived to around 52.' },
        { type: 'keypoint', text: 'Chadwick still believed in <strong>miasma</strong> — his reasoning was partly wrong. But the reforms he wanted (clean water, drainage, sewers) would still save lives. <strong>Correct outcome from partly incorrect reasoning.</strong>' },
        { type: 'quiz', question: "Why is Chadwick's work a good exam example?", options: [
          { text: 'He used evidence to push for reforms that would save lives, even though his miasma reasoning was wrong', correct: true },
          { text: 'He proved germ theory first', correct: false },
          { text: 'He built the London sewer system', correct: false },
          { text: 'He invented the cholera vaccine', correct: false },
        ], explanation: 'Chadwick helped public health without understanding germ theory. Correct outcome from partly incorrect reasoning is a classic exam nuance.' },
      ]
    },
    {
      tag: 'john-snow',
      label: 'John Snow',
      kicker: 'Key Person 2',
      heading: 'John Snow: the Soho water mystery',
      sub: 'Snow worked like a detective. He mapped deaths, followed the evidence and challenged miasma.',
      blocks: [
        { type: 'read', label: '📖 Core Knowledge', text: 'During the <strong>1854 cholera outbreak</strong> in Soho, London, <strong>John Snow</strong> plotted cholera deaths on a map. He found they clustered around the <strong>Broad Street pump</strong>. He believed sewage from a nearby cesspit had contaminated the water. He had the pump handle removed, helping stop the outbreak.' },
        { type: 'funfact', label: '🍺 The Beer Drinkers Lived', text: 'Workers at a nearby brewery did not get cholera because they drank beer instead of water from the pump. History revision officially sponsored by weird but useful details.' },
        { type: 'keypoint', text: 'Snow proved cholera was <strong>waterborne</strong>, but could not yet explain germs scientifically. Many people continued to believe miasma until Pasteur\'s germ theory gave stronger evidence later.' },
        { type: 'quiz', question: "How did John Snow help stop the 1854 cholera outbreak?", options: [
          { text: 'He mapped deaths and had the Broad Street pump handle removed', correct: true },
          { text: 'He invented the cholera vaccine', correct: false },
          { text: 'He proved miasma caused cholera', correct: false },
          { text: 'He built the London sewers', correct: false },
        ], explanation: 'Snow\'s detective work showed the cluster around the pump. Removing the handle stopped people drinking contaminated water.' },
      ]
    },
    {
      tag: 'public-health',
      label: 'Government Acts',
      kicker: 'Government Action',
      heading: 'Public health acts: 1848 and 1875',
      sub: 'From optional and underfunded to compulsory. Progress was slow.',
      blocks: [
        { type: 'read', label: '📖 1848 Public Health Act', text: 'Created a <strong>Central Board of Health</strong>. Local authorities <em>could</em> set up local boards of health — but they were usually not compulsory. Areas with a mortality rate above 23 per 1,000 had to set one up. Funding was weak. Many councils did nothing.' },
        { type: 'read', label: '📖 1875 Public Health Act', text: 'Much stronger. Local authorities <strong>had to</strong>: provide clean water, build sewerage systems, and appoint medical officers to oversee public health. This showed a clear move away from laissez-faire attitudes.' },
        { type: 'examtip', label: '🗡️ Exam Assassin', text: '<strong>Laissez-faire</strong> means limited government interference. Many Victorians opposed public health laws because they disliked taxes, central control and being told what to do. The Times in 1852: "We prefer to take our chance with cholera than be bullied into health."' },
        { type: 'quiz', question: 'What was the key difference between the 1848 and 1875 Acts?', options: [
          { text: '1875 made local authorities take stronger compulsory action', correct: true },
          { text: '1848 was compulsory and 1875 was optional', correct: false },
          { text: '1875 banned microscopes', correct: false },
          { text: '1848 discovered cholera bacteria', correct: false },
        ], explanation: '1848 was important but weak and largely optional. 1875 was compulsory — a clear shift away from laissez-faire.' },
      ]
    },
    {
      label: 'Great Stink & Sewers',
      kicker: 'Turning Point',
      heading: 'The Great Stink & Bazalgette\'s sewers',
      sub: 'In 1858, the Thames smelled so bad that Parliament shut down. Reform suddenly became urgent.',
      blocks: [
        { type: 'funfact', label: '🤢 1858', text: 'The river smelled so bad Parliament shut down. Poor people had suffered from filthy conditions for years. But once politicians personally had to smell the Thames, reform suddenly became urgent. Peak human behaviour.' },
        { type: 'read', label: '📖 Joseph Bazalgette', text: '<strong>Joseph Bazalgette</strong> designed London\'s new sewerage system after the Great Stink. Designed in <strong>1858</strong>, completed in <strong>1875</strong>. It removed sewage from the city and helped end major cholera outbreaks in London. Bazalgette was not a doctor — this shows public health improved through <strong>engineering and infrastructure</strong>.' },
        { type: 'keypoint', text: 'Public health improved through multiple factors: <strong>science, engineering, government action and evidence</strong> all mattered.' },
        { type: 'quiz', question: 'Why was the Great Stink a turning point?', options: [
          { text: 'When Parliament was directly affected by the smell, they finally acted on sewer reform', correct: true },
          { text: 'It proved miasma was correct', correct: false },
          { text: 'It killed half of London', correct: false },
          { text: 'It was caused by germ theory', correct: false },
        ], explanation: 'Poor people had suffered for years. The Great Stink shows how reform accelerated when elites were directly affected.' },
      ]
    },
    {
      label: 'Flashcards',
      kicker: 'Final Recap',
      heading: 'Flashcards',
      sub: 'Tap to flip. Lock in the key facts.',
      blocks: [
        { type: 'flashcards', cards: [
          { front: 'Rapid urbanisation', back: 'Cities grew faster than housing, water and sanitation could cope.' },
          { front: 'Edwin Chadwick', back: '1842 report linked poor sanitation to low life expectancy. Still believed in miasma.' },
          { front: 'Laissez-faire', back: 'Limited government interference. Many Victorians opposed public health laws.' },
          { front: '1848 Public Health Act', back: 'Created boards of health, but mostly optional and underfunded.' },
          { front: 'John Snow', back: 'Mapped 1854 Broad Street cholera deaths. Proved waterborne spread. Removed pump handle.' },
          { front: '1875 Public Health Act', back: 'Compulsory clean water, sewers and medical officers. Move away from laissez-faire.' },
          { front: 'Joseph Bazalgette', back: 'Designed London\'s sewer system after the Great Stink. Engineering saved lives.' },
          { front: 'Great Stink 1858', back: 'Parliament smelled the Thames. Led to sewer reform. Shows elites accelerate reform.' },
        ]}
      ]
    },
  ]
}

export default episode
