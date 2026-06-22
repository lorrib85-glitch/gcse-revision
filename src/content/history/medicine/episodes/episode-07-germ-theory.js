// Episode file — owns the runtime teaching sequence for one episode.
//
// Actual image files live in public/history/medicine/.
// Asset path resolution lives in src/content/history/medicine/assets.js.
// Canonical content + architecture docs live in docs/content/history/medicine/.

export default {
  id: 'history-medicine-germ-theory',
  subject: 'History',
  number: 7,
  title: 'The invisible enemy',
  subtitle: 'Pasteur, Koch and germ theory',
  era: 'c1857–c1883',
  icon: '🦠',
  color: '#B06520',
  colorLight: 'rgba(176,101,32,.12)',
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],
  hook: {
    scenario: {
      location: 'Paris, 1857',
      hint: 'Pasteur is in his lab — staring at a bottle of wine that\'s gone bad.',
    },
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
  // TODO: module uses old-format screens without stages; screen indices are proportional estimates.
  stageNavigation: [
    { id: 'part-1', title: 'Something Smaller Than Sight', description: 'Context before germ theory: miasma and spontaneous generation.', screenIndex: 0 },
    { id: 'part-2', title: 'Before Germ Theory: Bad Air Still Rules', description: 'Why the old ideas persisted.', screenIndex: 0 },
    { id: 'part-3', title: 'Pasteur Finds the Enemy', description: 'Pasteur\'s wine experiments and the germ theory proof.', screenIndex: 1 },
    { id: 'part-4', title: 'Koch Hunts Specific Killers', description: 'Koch identifies anthrax, TB and cholera bacteria.', screenIndex: 2 },
    { id: 'part-5', title: 'Changing Medicine\'s Direction', description: 'Impact of germ theory on vaccines and treatments.', screenIndex: 6 },
    { id: 'part-6', title: 'Exam Prep: From Miasma to Microbes', description: 'Exam practice and final application.', screenIndex: 8 },
  ],
  screens: [
    {
      tag: 'germ-theory',
      label: 'Old Ideas',
      kicker: 'Before Germ Theory',
      heading: 'Old ideas refused to die',
      sub: 'Doctors did not just wake up one day and say "germs, obviously." Medicine had centuries of bad habits to unlearn.',
      blocks: [
        { type: 'read', label: '💨 Miasma', text: 'Disease was believed to be caused by bad air or foul smells. This seemed logical because disease was common in filthy places.' },
        { type: 'read', label: '🧪 Spontaneous Generation', text: 'People believed germs appeared naturally from decay or illness — as a symptom, not the cause. This is the opposite of germ theory.' },
        { type: 'examtip', label: '🗡️ Key Distinction', text: 'People knew microbes existed, but they did <strong>not</strong> believe microbes caused disease. They often thought germs appeared after illness had already started.' },
        { type: 'quiz', question: 'What did people believe about germs before germ theory?', options: [
          { text: 'Germs appeared as a result of disease, not the cause', correct: true },
          { text: 'Germs caused all disease', correct: false },
          { text: 'Germs were the same as the Four Humours', correct: false },
          { text: 'Germs came from bad surgery', correct: false },
        ], explanation: 'Spontaneous generation said germs appeared from decay — they were a symptom of illness, not its cause. Pasteur proved the opposite.' },
      ]
    },
    {
      tag: 'pasteur',
      label: 'Pasteur',
      kicker: '1861',
      heading: 'Louis Pasteur: the wine detective',
      headerImage: '/images/pasteur-1861.png',
      sub: 'Global breakthrough begins with someone\'s drink being ruined.',
      blocks: [
        { type: 'read', label: '📖 Core Knowledge', text: '<strong>Louis Pasteur</strong> was a French chemist. In the 1850s, he investigated why wine went bad. Using a microscope, he saw bacteria in the wine and believed they were causing it to spoil. He heated the wine to kill the bacteria — a process later called <strong>pasteurisation</strong>.' },
        { type: 'read', label: '🧪 Swan-Neck Flask (1861)', text: 'Pasteur boiled broth in swan-neck flasks to kill existing microbes. The sealed flask stayed fresh. The flask exposed to air went bad. This showed microbes came from the air and caused decay — they did not appear through spontaneous generation. He published his findings in <strong>1861</strong>.' },
        { type: 'keypoint', text: 'In <strong>1861</strong>, Pasteur published his work on <strong>germ theory</strong>. This changed understanding of disease and opened the door to vaccines, antiseptic surgery and later antibiotics.' },
        { type: 'quiz', question: 'Why was Pasteur studying wine?', options: [
          { text: 'A winemaker asked him to investigate why wine was going off', correct: true },
          { text: 'He was trying to invent anaesthetic', correct: false },
          { text: 'He was identifying blood groups', correct: false },
          { text: 'He was treating the Great Plague', correct: false },
        ], explanation: 'Classic history: global breakthrough begins with someone\'s drink being ruined. Pasteur saw bacteria, linked them to spoilage, then applied this to disease.' },
      ]
    },
    {
      tag: 'koch',
      label: 'Koch',
      kicker: 'Key Person 2',
      heading: 'Robert Koch: "Cool, but WHICH germ?"',
      sub: 'Pasteur showed microbes caused disease. Koch proved specific germs caused specific diseases.',
      blocks: [
        { type: 'read', label: '📖 Core Knowledge', text: '<strong>Robert Koch</strong> was a German doctor. He used <strong>industrial dyes</strong> to stain bacteria so they were easier to see under microscopes. He identified the bacteria behind three major killers — and each time, it made germ theory harder to ignore.' },
        { type: 'keypoint', text: 'Koch made germ theory more convincing because he linked <strong>specific bacteria</strong> to <strong>specific diseases</strong>. This was crucial for developing vaccines and treatments.' },
        { type: 'quiz', question: 'Why was Koch\'s work important?', options: [
          { text: 'He identified specific bacteria causing specific diseases, making germ theory more convincing', correct: true },
          { text: 'He proved miasma theory was correct', correct: false },
          { text: 'He invented the printing press', correct: false },
          { text: 'He performed the first operation under anaesthetic', correct: false },
        ], explanation: 'Pasteur proved microbes caused disease generally. Koch proved which specific microbe caused which specific disease — crucial for developing targeted treatments.' },
      ]
    },
    {
      label: 'Anthrax',
      kicker: '1876',
      heading: 'Koch identifies anthrax',
      sub: 'The first time a specific bacterium was definitively linked to a specific disease.',
      blocks: [
        { type: 'read', label: '🔬 The Discovery', text: '<strong>Robert Koch</strong> identified <em>Bacillus anthracis</em> — the bacterium causing anthrax — in 1876. He used industrial dyes to stain bacteria so they were visible under a microscope. This was the first time a specific microbe had been definitively linked to a specific disease, turning germ theory from an idea into a proven tool.' },
        { type: 'keypoint', text: 'Before Koch, germ theory was plausible. After 1876, it was <strong>proven</strong> — at least for anthrax. The method he used became the template for future discoveries.' },
      ]
    },
    {
      label: 'Tuberculosis',
      kicker: '1882',
      heading: 'Koch identifies TB',
      sub: 'TB killed one in seven people in Europe. Now they knew what caused it.',
      blocks: [
        { type: 'read', label: '🔬 The Discovery', text: 'In <strong>1882</strong>, Koch identified the bacterium causing <strong>tuberculosis (TB)</strong> — one of the biggest killers in Europe. This single discovery made germ theory widely accepted because TB was so visible and deadly. Doctors could no longer dismiss the idea that invisible microbes caused disease.' },
        { type: 'examtip', label: '🗡️ Exam Link', text: 'TB identification mattered for the <strong>development of later treatments</strong>. You cannot treat a specific disease if you do not know its specific cause.' },
      ]
    },
    {
      label: 'Cholera',
      kicker: '1883',
      heading: 'Koch identifies cholera',
      sub: 'Cholera had swept across Europe in waves. Koch found out why.',
      blocks: [
        { type: 'read', label: '🔬 The Discovery', text: 'In <strong>1883</strong>, Koch identified the bacterium causing <strong>cholera</strong>. This built on John Snow\'s earlier work — Snow had proved cholera spread through contaminated water (1854) without knowing why. Koch found the actual cause. Together their work transformed public health and disease prevention.' },
        { type: 'keypoint', text: 'By 1883, Koch had linked three major diseases to specific bacteria. The age of targeted medicine had begun.' },
      ]
    },
    {
      label: 'Vaccines',
      kicker: 'Chance + Science',
      heading: 'Chicken cholera: the holiday mistake',
      sub: 'Chance plays a role in science — but only when someone\'s there to recognise it.',
      blocks: [
        { type: 'funfact', label: '🐔 The Oops', text: 'In 1879, Pasteur\'s assistant <strong>Charles Chamberland</strong> left chicken cholera germs unrefrigerated before going on holiday. When the old germs were injected into chickens, they did not become ill. When fresh germs were injected later — still no illness. Pasteur had discovered a way to create vaccines using weakened germs.' },
        { type: 'read', label: '🐄 Link to Jenner', text: 'Jenner used cowpox to prevent smallpox, but did not fully understand why it worked. Pasteur understood weakened germs could produce immunity — so he could apply the process to other diseases. Later vaccines: anthrax and rabies.' },
        { type: 'quiz', question: "Why was Pasteur's chicken cholera discovery important?", options: [
          { text: 'It showed weakened germs could create immunity', correct: true },
          { text: 'It proved miasma was correct', correct: false },
          { text: 'It discovered blood groups', correct: false },
          { text: 'It invented chloroform', correct: false },
        ], explanation: 'Chance opened the door; Pasteur\'s scientific thinking made it useful. This shows how chance and individual genius work together.' },
      ]
    },
    {
      label: 'Impact',
      kicker: 'Why It Mattered',
      heading: 'Why germ theory was such a big deal',
      sub: 'It did not immediately cure everything. But it changed the direction of medicine permanently.',
      blocks: [
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
      ]
    },
    {
      type: 'factorWeb',
      label: 'Factor web',
      kicker: 'Why did ideas change?',
      question: 'Why did ideas about the causes of disease change in the nineteenth century?',
      mode: 'causes',
      tags: ['germ theory', 'miasma', 'Pasteur', 'Koch', 'causation', 'judgement', 'change over time'],
      factors: [
        {
          id: 'pasteur',
          title: 'Pasteur’s germ theory',
          subtitle: 'Linked microbes to disease',
          icon: '\u{1F52C}',
          whatItMeans: 'Louis Pasteur showed that microbes caused decay and could cause disease. His 1861 swan-neck flask experiment proved microbes came from the air, not spontaneous generation.',
          whyItMattered: 'This directly challenged miasma theory. It gave medicine a new scientific direction and opened the door to vaccines and antiseptic surgery.',
          linkedFactor: 'Better microscopes and experimental science helped make his evidence more convincing to the wider medical community.',
        },
        {
          id: 'koch',
          title: 'Koch’s research',
          subtitle: 'Identified specific bacteria',
          icon: '\u{1F9EB}',
          whatItMeans: 'Robert Koch identified the specific bacteria that caused anthrax (1876), tuberculosis (1882) and cholera (1883).',
          whyItMattered: 'This made germ theory more precise — particular microbes caused particular diseases. Doctors could no longer dismiss the idea.',
          linkedFactor: 'Koch built on Pasteur’s theory and strengthened it with clearer, repeatable experimental proof.',
        },
        {
          id: 'microscopes',
          title: 'Better microscopes',
          subtitle: 'Made microbes visible',
          icon: '\u{1F50D}',
          whatItMeans: 'Improved microscopes allowed scientists to observe and stain tiny organisms more clearly than ever before.',
          whyItMattered: 'Germ theory became easier to prove when microbes could be seen, studied and reliably linked to specific diseases.',
          linkedFactor: 'Technology supported the scientific method and made the experimental evidence far stronger.',
        },
        {
          id: 'scientific-method',
          title: 'Scientific method',
          subtitle: 'Evidence, not authority',
          icon: '⚗️',
          whatItMeans: 'Scientists increasingly used controlled experiments, careful observation and repeatable evidence rather than ancient authority like Galen.',
          whyItMattered: 'This made new explanations more convincing — ideas had to be tested and proved, not simply accepted.',
          linkedFactor: 'Pasteur and Koch both relied on rigorous experiments to prove their ideas beyond reasonable doubt.',
        },
        {
          id: 'communication',
          title: 'Communication of ideas',
          subtitle: 'Discoveries spread faster',
          icon: '\u{1F4F0}',
          whatItMeans: 'Scientific discoveries could be shared through lectures, journals, publications and international networks of scientists.',
          whyItMattered: 'New ideas spread more quickly across Europe, allowing Pasteur’s and Koch’s work to influence doctors and governments.',
          linkedFactor: 'Communication helped germ theory build momentum and become widely accepted before either scientist had finished their work.',
        },
        {
          id: 'miasma-limits',
          title: 'Problems with old ideas',
          subtitle: 'Miasma could not explain enough',
          icon: '\u{1F4A8}',
          whatItMeans: 'Miasma theory blamed bad smells and dirty air for disease, but could not accurately explain how specific diseases spread.',
          whyItMattered: 'Germ theory became more convincing because it explained disease more precisely than miasma ever could.',
          linkedFactor: 'As germ theory gained experimental evidence, miasma gradually lost its credibility with the scientific community.',
        },
      ],
      taskPrompt: 'Which factor mattered most in changing ideas about the causes of disease in the nineteenth century?',
      thinkingTip: 'Strong history answers do not just name discoveries. They explain why ideas changed, what helped the change happen, and why one factor mattered more than the others.',
    },
    {
      label: 'Flashcards',
      kicker: 'Final Recap',
      heading: 'Flashcards',
      sub: 'Tap to flip. Lock in the key facts.',
      blocks: [
        { type: 'flashcards', cards: [
          { front: 'Spontaneous generation', back: 'The belief that germs appeared naturally from decay — not as the cause of disease.' },
          { front: 'Pasteur', back: 'French chemist who proved microbes caused decay. Swan-neck flask, 1861.' },
          { front: 'Swan-neck flask', back: 'Showed microbes came from air; broth stayed fresh when microbes were trapped.' },
          { front: 'Koch', back: 'Identified specific bacteria causing specific diseases. Anthrax 1876, TB 1882, cholera 1883.' },
          { front: 'Chicken cholera discovery', back: 'Weakened germs could create immunity. Led to vaccines for anthrax and rabies.' },
          { front: 'Germ theory impact', back: 'Changed understanding first — then enabled antiseptic surgery, vaccines and public health reform.' },
        ]}
      ]
    },
  ]
}
