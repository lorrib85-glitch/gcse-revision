// Episode file — owns the runtime teaching sequence for one episode.
//
// Actual image files live in public/history/medicine/.
// Asset path resolution lives in src/content/history/medicine/assets.js.
// Canonical content + architecture docs live in docs/content/history/medicine/.
//
export const episode = {
  id: 'history-medicine-surgery-anaesthetics',
  subject: 'History',
  number: 4,
  title: 'Surgery & anatomy',
  subtitle: 'Hold him down and hope',
  era: 'c.1700–c.1900',
  icon: '🩺',
  color: '#C47828',
  colorLight: 'rgba(196,120,40,.12)',
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],
  hook: {
    scenario: {
      location: 'London, 1840',
      hint: 'A surgeon is about to operate. He hasn\'t washed his hands once today.',
    },
    statement: 'Before the 1840s, surgeons washed their hands and wore clean coats to prevent infection.',
    isTrue: false,
    accentWords: ['washed their hands', 'clean coats'],
    explanation: "Blood-stained coats were worn with pride — proof of experience. Nobody had discovered germ theory yet. Dirty hands killed more patients than the knife.",
    wrongFeedback: 'Actually, blood-stained coats were a badge of honour — experience, not hygiene.',
    correctFeedback: 'Right. Germs weren\'t even discovered yet. Nobody knew dirty hands were dangerous.',
    loadingText: 'The real operating theatre was horrifying…',
    bigQuestion: 'So what actually made surgery so deadly?',
    revealHeader: 'Three killers: pain, infection, blood loss.',
    revealItems: [
      { emoji: '😱', label: 'Pain — patients were fully conscious', detail: 'No anaesthetic meant patients screamed through every cut. Surgeons were judged on speed — Robert Liston could amputate a leg in 40 seconds.', color: '#C47828', bg: 'rgba(196,120,40,.08)' },
      { emoji: '🦠', label: 'Infection — nobody knew why wounds went bad', detail: 'Blood-stained coats, unwashed hands, unsterilised instruments. Surgeons carried bacteria from patient to patient without knowing it. Most patients died of post-op infection.', color: '#D4950A', bg: 'rgba(212,149,10,.08)' },
      { emoji: '🩸', label: 'Blood loss — no transfusions existed', detail: 'Major operations killed through blood loss alone. There were no blood groups, no transfusion techniques, no way to replace what was lost on the table.', color: '#B06520', bg: 'rgba(176,101,32,.08)' },
    ],
    punchline: 'Surgery improved because three separate problems were solved — pain, infection, bleeding — each by a different person.',
  },
  intro: {
    learningGoals: [
      'Explain why surgery before the 1840s was so dangerous',
      'Describe how anaesthetics changed surgery — and why they also created new problems',
      'Explain Lister\'s use of antiseptics and why surgeons resisted it at first',
      'Assess the relative importance of Simpson, Lister and Nightingale',
    ],
  },
  outcomes: {
    intro: 'Surgery before anaesthetics was essentially a horror show. This chapter explains how it became something close to medicine.',
    bullets: [
      'Describe what surgery was actually like before 1846',
      'Explain how anaesthetics changed the game — and created new problems',
      "See why Lister's carbolic acid was revolutionary and controversial at the same time",
      'Connect pain, infection and blood loss to surgical survival rates',
    ],
  },
  recall: {
    questions: [
      { type: 'truefalse', question: 'Before 1846, surgeons operated on fully conscious patients.', isTrue: true },
      { type: 'choice', question: 'Simpson discovered that chloroform could...', options: ['Kill bacteria during surgery', 'Make patients unconscious for operations', 'Speed up the healing of wounds'], correct: 1 },
      { type: 'connection', question: 'Lister used carbolic acid to...', options: [
        { text: 'Speed up the operating process', icon: 'gear' },
        { text: 'Kill the bacteria causing post-op infections', icon: 'germ' },
        { text: 'Numb patients before operations', icon: 'heart' },
      ], correct: 1 },
    ],
  },
  // TODO: history-medicine-surgery-anaesthetics lacks blood loss and dedicated exam prep screens; indices 9–10 are approximate.
  stageNavigation: [
    { id: 'part-1', title: 'The Three Enemies of Surgery', description: 'Pain, infection and blood loss before the 1840s.', screenIndex: 0 },
    { id: 'part-2', title: 'Pain: The Patient\'s Nightmare', description: 'Anaesthetics from Davy to Simpson.', screenIndex: 1 },
    { id: 'part-3', title: 'Infection: The Invisible Killer', description: 'Lister, antiseptics and aseptic surgery.', screenIndex: 8 },
    { id: 'part-4', title: 'Blood Loss and Better Technique', description: 'Aseptic surgery and improving surgical outcomes.', screenIndex: 9 },
    { id: 'part-5', title: 'From Last Resort to Real Treatment', description: 'How surgery became safer and more routine.', screenIndex: 9 },
    { id: 'part-6', title: 'Exam Prep: Why Surgery Improved', description: 'Exam practice and final application.', screenIndex: 10 },
  ],
  screens: [
    {
      label: 'The Problem',
      kicker: 'Core Problem',
      heading: 'Why was surgery terrifying?',
      sub: 'Before modern surgery, the method was basically: "hold him down and hope."',
      blocks: [
        { type: 'read', label: '❌ Before improvements', text: 'No anaesthetic. No antiseptics. No blood transfusions. Infection was common. Surgeons were judged partly on speed — <strong>Robert Liston</strong> could amputate a leg in under 40 seconds in the 1840s.' },
        { type: 'read', label: '✅ After improvements', text: 'Anaesthetics reduced pain, antiseptics and aseptic surgery reduced infection, and transfusions reduced blood loss. Surgery became slower, cleaner and more precise.' },
        { type: 'funfact', label: '🤢 Gross Fact', text: 'Some surgeons wore blood-stained coats as a badge of experience. Basically: "Look how filthy I am, trust me with your open wound."' },
        { type: 'keypoint', text: 'Doctors slowly solved three huge problems: <strong>pain</strong>, <strong>infection</strong> and <strong>bleeding</strong>.' },
      ]
    },
    {
      tag: 'anaesthetics',
      label: 'Pain',
      kicker: 'Problem 1 · Pain',
      heading: 'Anaesthetics: finally, less screaming',
      sub: 'Anaesthetics reduced pain so surgeons could operate more carefully and attempt longer, more complex procedures.',
      blocks: [
        { type: 'examtip', label: '🗡️ Exam Trap', text: '<strong>Anaesthetics did not fix surgery by themselves.</strong> They reduced pain, but longer operations could increase infection risk if surgeons still had dirty hands, tools and theatres.' },
        { type: 'quiz', question: 'Which detail best explains why chloroform became safer?', options: [
          { text: "John Snow's inhaler helped control how much chloroform patients received", correct: true },
          { text: 'People stopped caring about dosage', correct: false },
          { text: 'Ether was flammable', correct: false },
          { text: 'Robert Liston operated faster', correct: false },
        ], explanation: "Snow's inhaler is a strong technology factor: safer dosage increased trust." },
      ]
    },
    {
      label: 'Davy',
      kicker: '1799',
      heading: 'Humphry Davy: laughing gas',
      sub: 'The first hint that pain in surgery could one day be solved.',
      blocks: [
        { type: 'read', label: '🔬 The Discovery', text: '<strong>Humphry Davy</strong> discovered that inhaling <strong>nitrous oxide</strong> (laughing gas) reduced the sensation of pain. He even suggested it could be used during surgery. But surgeons ignored him — partly because it made people giggle, and partly because no one believed patients needed to be unconscious.' },
        { type: 'funfact', label: '😂 Why It Was Ignored', text: 'Nitrous oxide was seen as a party trick. It was used at "laughing gas shows" for entertainment. Serious surgeons didn\'t want to be associated with circus antics — so a potential breakthrough sat unused for 47 years.' },
      ]
    },
    {
      label: 'Morton',
      kicker: '1846',
      heading: 'William Morton: ether',
      sub: 'The first successful public demonstration of surgical anaesthesia.',
      blocks: [
        { type: 'read', label: '🔬 The Discovery', text: '<strong>William Morton</strong>, an American dentist, publicly demonstrated that <strong>ether</strong> could render a patient unconscious during surgery in 1846. The news spread to Britain rapidly. For the first time, surgeons could operate without a patient screaming — but ether was flammable and caused nausea.' },
        { type: 'keypoint', text: 'Morton\'s demonstration was the turning point that made pain-free surgery a reality. But ether had serious limitations — the search for something better began immediately.' },
      ]
    },
    {
      label: 'Simpson',
      kicker: '1847',
      heading: 'James Simpson: chloroform',
      sub: 'Better than ether — and discovered over a dinner party.',
      blocks: [
        { type: 'read', label: '🔬 The Discovery', text: '<strong>James Simpson</strong>, a Scottish obstetrician, was searching for something better than ether. In 1847, he and two colleagues inhaled various chemicals at a dinner party. They woke up under the table having discovered <strong>chloroform</strong> — more powerful, faster acting, and less flammable than ether. It allowed much longer operations.' },
        { type: 'funfact', label: '🍽️ The Dinner Party Method', text: 'Simpson\'s approach to drug discovery: invite friends over, try inhaling random chemicals, see who passes out. Pioneering science or a Victorian dare? Both, probably.' },
      ]
    },
    {
      label: 'Greener',
      kicker: '1848',
      heading: 'Hannah Greener: a warning',
      sub: 'The new wonder drug had a dangerous side.',
      blocks: [
        { type: 'read', label: '⚠️ What Happened', text: '<strong>Hannah Greener</strong>, aged 15, died from an overdose of chloroform in 1848 — one year after its discovery. She had been given too much. Her death showed that anaesthetics were not automatically safe. The problem was dosage: there was no precise way to control how much a patient received.' },
        { type: 'examtip', label: '🗡️ Exam Insight', text: 'Hannah Greener\'s death is useful evidence that <strong>new medical advances create new problems</strong>. Examiners love this nuance — progress isn\'t simply positive.' },
      ]
    },
    {
      label: 'Snow',
      kicker: '1850s',
      heading: 'John Snow: safer dosage',
      sub: 'The man who solved cholera also made chloroform much safer.',
      blocks: [
        { type: 'read', label: '🔬 The Improvement', text: '<strong>John Snow</strong> — best known for tracing the 1854 cholera outbreak to a water pump — developed an <strong>inhaler</strong> that allowed surgeons to control exactly how much chloroform a patient received. Controlled dosage dramatically reduced the risk of overdose and death. Chloroform became far more trusted as a result.' },
        { type: 'keypoint', text: 'Snow\'s inhaler is a classic example of <strong>technology improving a previous advance</strong>. The discovery (chloroform) only became safe when the method of administering it was controlled.' },
      ]
    },
    {
      label: 'Victoria',
      kicker: '1853',
      heading: 'Queen Victoria: royal seal of approval',
      sub: 'When the Queen used it in childbirth, public resistance collapsed.',
      blocks: [
        { type: 'read', label: '👑 The Endorsement', text: '<strong>Queen Victoria</strong> used chloroform during the birth of her eighth child in 1853 — and praised it publicly. Until this point, many religious figures argued that pain in childbirth was God\'s will and should not be numbed. The Queen\'s endorsement silenced most opposition overnight. Chloroform use spread rapidly.' },
        { type: 'examtip', label: '🗡️ Exam Factor', text: 'Victoria\'s endorsement is evidence of <strong>government/authority as a factor</strong> in medical change. Not a scientific discovery — but it removed the social and religious barrier to adoption.' },
      ]
    },
    {
      tag: 'antiseptic-surgery',
      label: 'Infection',
      kicker: 'Problem 2 · Infection',
      heading: 'Antiseptics: the acid Febreze era',
      sub: 'Anaesthetics helped pain, but created a new problem: longer operations meant more chance for infection.',
      blocks: [
        { type: 'read', label: '🦠 Pasteur → Lister', text: '<strong>Louis Pasteur\'s germ theory</strong> showed microorganisms caused decay and disease. <strong>Joseph Lister</strong> applied that idea to surgery in the 1860s by using <strong>carbolic acid</strong> to clean wounds, instruments, bandages and operating theatres.' },
        { type: 'funfact', label: '🤢 Horrible Histories Moment', text: 'Victorian surgeons after discovering carbolic acid: "What if we sprayed absolutely EVERYTHING with acid?" Patients. Bandages. Tables. Probably nearby pigeons.' },
        { type: 'keypoint', text: '<strong>Lister mattered because he used germ theory practically.</strong> He did not just know germs existed — he changed surgical methods to reduce infection.' },
        { type: 'quiz', question: "Why did Lister's methods matter?", options: [
          { text: 'He used carbolic acid to reduce infection using ideas from germ theory', correct: true },
          { text: 'He discovered ether', correct: false },
          { text: 'He invented blood groups', correct: false },
          { text: 'He proved pain was useful', correct: false },
        ], explanation: 'Pasteur gave the scientific idea; Lister turned it into surgical practice.' },
      ]
    },
    {
      label: 'Aseptic',
      kicker: 'Infection Gets Smarter',
      heading: 'Aseptic surgery: stop germs getting in',
      sub: 'Antiseptics killed germs afterwards. Aseptic surgery aimed to stop germs entering in the first place.',
      blocks: [
        { type: 'read', label: '🧴 Antiseptic vs Aseptic', text: '<strong>Antiseptic</strong>: kill germs after they appear. Lister\'s carbolic acid was antiseptic — useful but still messy. <strong>Aseptic</strong>: prevent germs entering in the first place. Surgeons began sterilising instruments, wearing gloves and masks, and using clean operating theatres.' },
        { type: 'examtip', label: '🗡️ Exam Sentence', text: 'Surgery became safer when science and technology worked together: anaesthetics reduced pain, antiseptics and aseptic surgery reduced infection, and blood groups made transfusions safer.' },
        { type: 'quiz', question: 'Which answer best explains how surgery became safer?', options: [
          { text: 'Pain, infection and blood loss were solved gradually through anaesthetics, antiseptics/aseptic methods and safer transfusions', correct: true },
          { text: 'Anaesthetics fixed every problem immediately', correct: false },
          { text: 'Surgery became safer because doctors stopped doing operations', correct: false },
          { text: 'Galen discovered blood groups', correct: false },
        ], explanation: 'Strong GCSE answer: surgery improved because several problems were solved in stages, not because of one magic discovery.' },
      ]
    },
    {
      label: 'Flashcards',
      kicker: 'Final Recap',
      heading: 'Flashcards',
      sub: 'Tap to flip. Lock in the key facts.',
      blocks: [
        { type: 'flashcards', cards: [
          { front: 'Anaesthetic', back: 'A substance that removes pain during surgery.' },
          { front: 'James Simpson', back: 'Discovered chloroform as a general anaesthetic (1847).' },
          { front: 'Hannah Greener', back: 'Died from chloroform overdose in 1848 — showed dosage danger.' },
          { front: 'Antiseptic', back: 'Kills germs that are already present. Lister used carbolic acid from 1867.' },
          { front: 'Aseptic', back: 'Prevents germs getting in. Sterilised instruments, gloves, clean theatres.' },
          { front: 'Joseph Lister', back: 'Applied germ theory to surgery using carbolic acid to fight infection.' },
          { front: 'Three surgery problems', back: 'Pain, infection, and bleeding — each solved separately.' },
        ]}
      ]
    },
  ]
}

export default episode
