// ─── Full module content extracted from the 5 HTML modules ───────────────────
// Each module has: id, title, era, icon, color, screens[]
// Each screen has: label, kicker, heading, content (array of blocks)
// Block types: read, keypoint, quiz (mc), funfact, examtip, timeline, sort, reveal, flashcards

export const MODULES = [
  {
    id: 'mod1',
    subject: 'History',
    number: 1,
    title: 'Medieval Medicine',
    subtitle: 'Foundations',
    era: 'c1250–c1500',
    icon: '⚕️',
    color: '#F5B700',
    colorLight: '#f5e6d3',

    hook: {
      statement: 'Medieval doctors could cure the Black Death with garlic and prayer.',
      isTrue: false,
      storyLines: [
        'England, 1348. A ship docks at a southern port.',
        'Within weeks, people are dying in the streets.',
        'One third of the entire population will be dead within a year.',
        'The best doctors in England had a plan...',
      ],
      wrongFeedback: "They absolutely believed they could. But roughly 1 in 3 people died anyway.",
      correctFeedback: "Right. Nothing worked. And that tells us everything about medieval medicine.",
      bigQuestion: "Why couldn't the best doctors in the world stop it?",
      revealItems: [
        {
          emoji: '🩸',
          label: 'They thought blood caused it',
          detail: 'The Four Humours theory said illness was an imbalance in blood, phlegm, yellow bile or black bile. So they bled patients to remove "excess blood".',
          color: '#FF5D73',
          bg: 'rgba(255,93,115,.08)',
        },
        {
          emoji: '💨',
          label: 'They blamed the smell',
          detail: 'Miasma theory said bad air from rotting matter caused disease. Doctors carried posies of flowers to block the smell. It did nothing.',
          color: '#FFC857',
          bg: 'rgba(255,200,87,.08)',
        },
        {
          emoji: '🙏',
          label: 'They prayed for God to stop it',
          detail: "The Church taught illness was God's punishment for sin. People whipped themselves in public to show repentance. The plague kept spreading.",
          color: '#F5B700',
          bg: 'rgba(245,183,0,.08)',
        },
      ],
      punchline: 'Nobody knew about bacteria. Nobody knew about fleas on rats. This module explains why — and how medicine slowly changed.',
    },

    intro: {
      retrieval: {
        question: 'What were the Four Humours that medieval doctors believed controlled health?',
        options: [
          'Fire, water, earth and air',
          'Blood, phlegm, yellow bile and black bile',
          'Heart, liver, brain and lungs',
          'Hot, cold, wet and dry',
        ],
        correctIndex: 1,
        explanation: "The Four Humours (blood, phlegm, yellow bile, black bile) came from ancient Greek medicine. Illness meant imbalance — doctors tried to restore it by bleeding, purging or changing diet.",
      },
      learningGoals: [
        'Explain the four main causes medieval people gave for illness',
        "Describe at least three medieval treatments and why doctors used them",
        'Distinguish between rational and supernatural explanations',
        "Explain how and why Galen's ideas dominated medicine for 1,000 years",
        'Describe the Black Death and why nobody could stop it',
      ],
    },

    screens: [
      {
        label: 'Causes',
        kicker: 'Core Knowledge',
        heading: 'Why Did People Get Ill?',
        sub: 'Medieval medicine blamed four things. None of them were germs.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: 'Medieval people believed illness was caused by four main things: the <strong>Four Humours</strong> (blood, phlegm, yellow bile, black bile), <strong>miasma</strong> (bad air from rotting matter), <strong>God\'s punishment</strong> for sin, and <strong>astrology</strong> — the position of stars and planets.' },
          { type: 'keypoint', text: 'Medieval explanations were a mix of <strong>traditional beliefs</strong>, religious influence and limited scientific understanding.' },
          { type: 'funfact', label: '🤯 Crazy But True', text: 'People genuinely believed bad smells could cause disease. To be fair, if your street smelled like death soup, you might also panic-blame the air.' },
          { type: 'quiz', question: 'Would blood, phlegm and bile actually explain disease?', options: [
            { text: 'No — it was wrong, but it seemed logical because doctors believed health meant balance', correct: true },
            { text: 'Yes — humours are the same as germs', correct: false },
            { text: 'Yes — it proved blood caused every illness', correct: false },
            { text: 'No — but medieval doctors already understood bacteria', correct: false },
          ], explanation: 'The Four Humours were wrong, but they felt logical because doctors believed health meant balance inside the body.' },
        ]
      },
      {
        label: 'Treatments',
        kicker: 'What Did They Actually Do?',
        heading: 'Treatments: Would This Actually Help?',
        sub: 'Medieval treatments matched medieval beliefs. Wrong cause = wrong cure.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: 'Medieval treatments matched medieval beliefs. If illness came from humour imbalance, doctors used <strong>bloodletting</strong>, <strong>purging</strong> or fasting to rebalance the body. If illness came from sin, people used <strong>prayer</strong>, confession, pilgrimage or relics. <strong>Herbal remedies</strong> were common and sometimes soothing. <strong>Barber surgeons</strong> did practical work like bloodletting, tooth-pulling, cauterisation and basic surgery — often without anaesthetic.' },
          { type: 'keypoint', text: '<strong>Exam memory:</strong> treatments often failed because they were based on mistaken causes, but people trusted them because they fitted accepted beliefs.' },
          { type: 'funfact', label: '🤯 Crazy But True', text: 'Cauterisation meant burning a wound shut. Yes, with heat. No, you would not enjoy the customer experience survey afterwards.' },
          { type: 'examtip', label: '🗡️ Exam Assassin', phrases: ['limited understanding', 'traditional beliefs', 'religious influence'], tip: 'These phrases turn "they were wrong" into proper GCSE explanation.' },
          { type: 'quiz', question: 'Why did people use bloodletting?', options: [
            { text: 'They believed removing blood could rebalance the humours', correct: true },
            { text: 'It was required by law', correct: false },
            { text: 'They knew blood carried bacteria', correct: false },
            { text: 'It made patients immune to disease', correct: false },
          ], explanation: 'Removing blood was meant to rebalance the humours and restore health. It was based on a wrong theory, but made sense to people at the time.' },
        ]
      },
      {
        label: 'Rational vs Supernatural',
        kicker: 'Exam Thinking',
        heading: 'Rational or Supernatural?',
        sub: 'A key distinction examiners love. Rational does NOT mean correct.',
        blocks: [
          { type: 'examtip', label: '🗡️ Exam Shortcut', text: '<strong>Rational</strong> = based on observation, logic or experience. <strong>Supernatural</strong> = based on God, religion, magic or astrology. <strong>Miasma</strong> was considered rational because it used observation and logic about bad smells and disease. <strong>God\'s punishment</strong> was supernatural because it relied on religion and belief.' },
          { type: 'reveal', label: '⚡ Rapid Fire Sort', prompt: 'Sort each one: miasma / prayer / four humours / astrology / herbal remedies', answer: 'Miasma = rational. Prayer = supernatural. Four Humours = rational. Astrology = supernatural. Herbal remedies = rational/natural treatment.' },
          { type: 'quiz', question: 'Why was miasma considered rational even though it was incorrect?', options: [
            { text: 'It was based on observation and logical thinking about bad smells and disease spread, even though people had limited scientific understanding', correct: true },
            { text: 'Because it was proven in a laboratory', correct: false },
            { text: 'Because the Church approved it', correct: false },
            { text: 'Because miasma and germ theory said the same thing', correct: false },
          ], explanation: 'Rational means based on logic and observation — not necessarily correct. Miasma seemed to fit the evidence available.' },
        ]
      },
      {
        label: 'Galen & Church',
        kicker: 'Authority & Influence',
        heading: 'Hippocrates, Galen & the Church',
        sub: 'Why did wrong ideas last for 1,000 years? Authority, tradition and religion.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: '<strong>Hippocrates</strong> promoted observation and linked illness to imbalance in the Four Humours. <strong>Galen</strong> built on this with the <strong>Theory of Opposites</strong> and became hugely influential. People trusted them because ancient texts were respected, taught in universities and supported by the Church. These ideas lasted for centuries with very little change. This is called <strong>continuity</strong>.' },
          { type: 'keypoint', text: 'The Church helped keep Galen\'s ideas alive by teaching them in universities and discouraging dissection. <strong>This both helped medicine (preserved knowledge) and hindered it (discouraged challenge).</strong>' },
          { type: 'quiz', question: 'Why did Galen\'s ideas survive unchallenged for so long?', options: [
            { text: 'The Church preserved his works and discouraged questioning ancient authority', correct: true },
            { text: 'Galen was always completely correct', correct: false },
            { text: 'Dissection proved Galen right', correct: false },
            { text: 'Nobody read his books', correct: false },
          ], explanation: 'The Church treated Galen\'s texts almost like holy scripture. Questioning Galen meant questioning the Church — which was dangerous.' },
        ]
      },
      {
        label: 'Black Death',
        kicker: '1348',
        heading: 'The Black Death',
        sub: 'Roughly 1 in 3 people in England died. And nobody knew why.',
        blocks: [
          { type: 'read', label: '☠️ What Happened', text: 'The Black Death (bubonic plague) arrived in England in <strong>1348</strong> and killed roughly <strong>one third</strong> of the population by 1349. It returned in waves throughout the century. People blamed miasma, God\'s punishment and planetary alignment — none were correct.' },
          { type: 'examtip', label: '🗡️ Exam Key Point', text: 'The actual cause was <strong>Yersinia pestis</strong> bacteria, spread by fleas on black rats. Nobody knew this — germ theory was 500+ years away.' },
          { type: 'quiz', question: 'What did people NOT blame the Black Death on?', options: [
            { text: 'Bacteria spread by fleas on rats', correct: true },
            { text: 'Bad air (miasma)', correct: false },
            { text: "God's punishment", correct: false },
            { text: 'Planetary alignment', correct: false },
          ], explanation: 'Germ theory wasn\'t developed until the 1860s. Nobody in 1348 had any concept of bacteria, fleas, or rats spreading disease.' },
        ]
      },
      {
        label: 'Flashcards',
        kicker: 'Final Recap',
        heading: 'Flashcards',
        sub: 'Tap to flip. Lock in the key facts.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'Four Humours', back: 'Blood, phlegm, yellow bile and black bile. Imbalance = illness.' },
            { front: 'Miasma', back: 'Bad air or foul smells believed to cause disease.' },
            { front: 'Bloodletting', back: 'Removing blood to rebalance the humours.' },
            { front: 'Galen', back: 'Roman physician whose ideas dominated medicine for 1,000+ years.' },
            { front: 'The Black Death', back: '1348–49. Killed ~1/3 of England. Caused by bacteria on fleas on rats.' },
            { front: 'Continuity', back: 'When ideas or practices stay the same over a long period.' },
            { front: 'Rational', back: 'Based on observation and logic — not necessarily correct.' },
            { front: 'Barber-surgeon', back: 'Tradesman who performed basic surgery, bloodletting and tooth extraction.' },
          ]}
        ]
      },
    ]
  },

  {
    id: 'mod2',
    subject: 'History',
    number: 2,
    title: 'Renaissance & the Plague',
    subtitle: 'Challenge & Continuity',
    era: 'c1500–c1700',
    icon: '🔬',
    color: '#1a3a5c',
    colorLight: '#ddeeff',
    screens: [
      {
        label: 'Renaissance',
        kicker: 'New Thinking',
        heading: 'Renaissance Medicine: Challenging the Ancients',
        sub: 'The Renaissance encouraged people to question authority and look at evidence. Medicine slowly changed.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: 'The Renaissance (roughly 1400–1600) encouraged artists and scientists to question ancient authority. In medicine, this meant challenging <strong>Galen</strong>. Key developments: <strong>Vesalius</strong> used human dissection to correct anatomical errors. <strong>Harvey</strong> proved blood circulates. <strong>Paré</strong> improved surgical techniques. The <strong>printing press</strong> helped new ideas spread rapidly.' },
          { type: 'keypoint', text: '<strong>Renaissance medicine changed knowledge more than treatment.</strong> Vesalius, Harvey and Paré pushed observation and experiment forward — but the Great Plague shows disease causes and everyday cures stayed badly limited.' },
          { type: 'quiz', question: 'What did Vesalius and Harvey mainly improve?', options: [
            { text: 'Knowledge of anatomy and how the body worked', correct: true },
            { text: 'Pain control during surgery', correct: false },
            { text: 'Germ theory', correct: false },
            { text: 'Blood transfusions', correct: false },
          ], explanation: 'Renaissance discoveries improved knowledge before treatment became dramatically safer. Understanding came first; treatment improvements followed later.' },
        ]
      },
      {
        label: 'Key Figures',
        kicker: 'The Challengers',
        heading: 'Vesalius, Harvey & Paré',
        sub: 'Three people who dared to challenge 1,000 years of received wisdom.',
        blocks: [
          { type: 'read', label: '🔬 Vesalius (1543)', text: '<strong>Andreas Vesalius</strong> dissected human bodies himself and published <em>De Humani Corporis Fabrica</em> (1543). It corrected over 300 of Galen\'s errors — including the claim that the jaw is two bones and that the septum of the heart has holes. He proved the value of direct observation over trusting ancient authority.' },
          { type: 'read', label: '❤️ Harvey (1628)', text: '<strong>William Harvey</strong> proved that blood circulates continuously around the body, pumped by the heart. This overturned Galen\'s idea that the liver made new blood constantly. But: he couldn\'t explain what blood actually did — so treatments didn\'t immediately change.' },
          { type: 'read', label: '⚔️ Paré (1530s+)', text: '<strong>Ambroise Paré</strong> was a French military surgeon who ran out of boiling oil (used on gunshot wounds) during a battle. He improvised with a soothing ointment and found patients healed better. He also designed artificial limbs and tied blood vessels instead of cauterising.' },
          { type: 'quiz', question: 'Why did Harvey\'s discovery not immediately improve treatments?', options: [
            { text: 'He could not explain what blood actually did, so doctors kept using old treatments', correct: true },
            { text: 'Nobody believed him', correct: false },
            { text: 'The Church banned his book', correct: false },
            { text: 'Bloodletting was made compulsory by law', correct: false },
          ], explanation: 'Key AQA exam point: improved understanding does not automatically lead to better treatment.' },
        ]
      },
      {
        label: 'Great Plague',
        kicker: '1665',
        heading: 'The Great Plague of London',
        sub: 'Even after the Renaissance, people still had no idea what actually caused disease.',
        blocks: [
          { type: 'read', label: '☠️ What Happened', text: 'The Great Plague of 1665 killed around 100,000 people in London. Despite Renaissance advances in anatomy, people still blamed <strong>miasma</strong>, <strong>humours</strong> and <strong>God\'s punishment</strong>. The government\'s response was more organised than in 1348, but medical understanding was still badly limited.' },
          { type: 'funfact', label: '🐈 The Cat Disaster', text: 'The mayor ordered stray cats and dogs to be killed because people thought they spread plague. But cats killed rats. Fewer cats meant more rats, more fleas and more plague. A horror film with terrible pest control.' },
          { type: 'quiz', question: 'What was the real cause of the plague spreading?', options: [
            { text: 'Fleas on rats carrying plague bacteria', correct: true },
            { text: 'Bad smells directly poisoning people', correct: false },
            { text: 'Too much blood in the body', correct: false },
            { text: 'The Great Fire', correct: false },
          ], explanation: 'People blamed miasma, humours or God, but the real cause was bacteria spread by fleas on rats.' },
          { type: 'examtip', label: '🗡️ Exam Assassin', phrases: ['better government response', 'miasma continued', 'no germ theory'], tip: 'By 1665, government response was more organised than in 1348, but medical understanding was still badly limited because people did not know about germs.' },
        ]
      },
      {
        label: 'Change vs Continuity',
        kicker: 'The Big Picture',
        heading: 'Did Everything Suddenly Improve?',
        sub: 'No. History is annoying like that.',
        blocks: [
          { type: 'timeline', events: [
            { year: '1543', text: 'Vesalius publishes anatomy work. More accurate anatomy and challenge to Galen.' },
            { year: '1628', text: 'Harvey explains blood circulation. Better understanding of the body, but still limited treatment.' },
            { year: '1665', text: 'The Great Plague exposes weak disease knowledge. Government action was more organised, but people still blamed miasma, humours and God.' },
            { year: '1666', text: 'The Great Fire leads to rebuilding. Wider streets and better rebuilding reduced future outbreaks.' },
          ]},
          { type: 'keypoint', text: '<strong>Renaissance medicine changed knowledge more than treatment.</strong> Vesalius, Harvey, Paré and Hunter pushed observation and experiment forward, but the Great Plague shows disease causes and everyday cures stayed badly limited.' },
          { type: 'quiz', question: 'Which is the best judgement about Renaissance medicine?', options: [
            { text: 'There was important change in anatomy, but continuity in treatments and beliefs', correct: true },
            { text: 'Everything changed instantly', correct: false },
            { text: 'Nothing changed at all', correct: false },
            { text: 'Treatments improved before knowledge', correct: false },
          ], explanation: 'That balanced judgement is what examiners want: change and continuity, not cartoon history.' },
        ]
      },
      {
        label: 'Flashcards',
        kicker: 'Final Recap',
        heading: 'Flashcards',
        sub: 'Tap to flip. Lock in the key facts.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'Vesalius', back: 'Corrected 300+ of Galen\'s errors using human dissection. De Fabrica, 1543.' },
            { front: 'Harvey', back: 'Proved blood circulates around the body. 1628. Did not immediately change treatments.' },
            { front: 'Paré', back: 'French surgeon who improved wound treatment and designed artificial limbs. Chance discovery.' },
            { front: 'Printing press', back: 'Spread new medical ideas across Europe rapidly.' },
            { front: 'Great Plague 1665', back: 'Killed ~100,000 in London. Still blamed on miasma. More organised response than 1348.' },
            { front: 'Continuity', back: 'Renaissance improved knowledge more than treatment.' },
          ]}
        ]
      },
    ]
  },

  {
    id: 'mod3',
    subject: 'History',
    number: 3,
    title: 'Surgery & Anatomy',
    subtitle: 'Hold Him Down and Hope',
    era: 'c1700–c1900',
    icon: '🩺',
    color: '#5b1a1a',
    colorLight: '#fce8e8',
    screens: [
      {
        label: 'The Problem',
        kicker: 'Core Problem',
        heading: 'Why Was Surgery Terrifying?',
        sub: 'Before modern surgery, the method was basically: "hold him down and hope."',
        blocks: [
          { type: 'read', label: '❌ Before improvements', text: 'No anaesthetic. No antiseptics. No blood transfusions. Infection was common. Surgeons were judged partly on speed — <strong>Robert Liston</strong> could amputate a leg in under 40 seconds in the 1840s.' },
          { type: 'read', label: '✅ After improvements', text: 'Anaesthetics reduced pain, antiseptics and aseptic surgery reduced infection, and transfusions reduced blood loss. Surgery became slower, cleaner and more precise.' },
          { type: 'funfact', label: '🤢 Gross Fact', text: 'Some surgeons wore blood-stained coats as a badge of experience. Basically: "Look how filthy I am, trust me with your open wound."' },
          { type: 'keypoint', text: 'Doctors slowly solved three huge problems: <strong>pain</strong>, <strong>infection</strong> and <strong>bleeding</strong>.' },
        ]
      },
      {
        label: 'Pain',
        kicker: 'Problem 1 · Pain',
        heading: 'Anaesthetics: Finally, Less Screaming',
        sub: 'Anaesthetics reduced pain so surgeons could operate more carefully and attempt longer, more complex procedures.',
        blocks: [
          { type: 'timeline', events: [
            { year: '1799', text: '<strong>Humphry Davy</strong> discovers nitrous oxide could reduce pain — but it wasn\'t widely used at the time.' },
            { year: '1846', text: '<strong>William Morton</strong> successfully uses ether as an anaesthetic. It spread quickly to Britain, but was flammable.' },
            { year: '1847', text: '<strong>James Simpson</strong> discovers chloroform — a more effective general anaesthetic, allowing longer operations.' },
            { year: '1848', text: '<strong>Hannah Greener</strong>, aged 15, dies from too much chloroform — showing anaesthetics could be dangerous.' },
            { year: '1850s', text: '<strong>John Snow</strong> develops a chloroform inhaler to control dosage, making it much safer.' },
            { year: '1853', text: '<strong>Queen Victoria</strong> uses chloroform in childbirth — her endorsement reduced public and religious opposition.' },
          ]},
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
        label: 'Infection',
        kicker: 'Problem 2 · Infection',
        heading: 'Antiseptics: The Acid Febreze Era',
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
        heading: 'Aseptic Surgery: Stop Germs Getting In',
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
  },

  {
    id: 'mod4',
    subject: 'History',
    number: 4,
    title: 'Germ Theory',
    subtitle: 'Pasteur, Koch & the Invisible Enemy',
    era: 'c1850–c1900',
    icon: '🦠',
    color: '#065f46',
    colorLight: '#d1fae5',
    screens: [
      {
        label: 'Old Ideas',
        kicker: 'Before Germ Theory',
        heading: 'Old Ideas Refused To Die',
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
        label: 'Pasteur',
        kicker: 'Key Person 1',
        heading: 'Louis Pasteur: The Wine Detective',
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
        label: 'Koch',
        kicker: 'Key Person 2',
        heading: 'Robert Koch: "Cool, But WHICH Germ?"',
        sub: 'Pasteur showed microbes caused disease. Koch proved specific germs caused specific diseases.',
        blocks: [
          { type: 'read', label: '📖 Core Knowledge', text: '<strong>Robert Koch</strong> was a German doctor. He used <strong>industrial dyes</strong> to stain bacteria so they were easier to see under microscopes. In <strong>1876</strong>, he identified the bacteria that caused <strong>anthrax</strong> — the first time a specific bacterium had been linked to a specific disease.' },
          { type: 'timeline', events: [
            { year: '1876', text: 'Koch identifies the bacteria causing <strong>anthrax</strong>.' },
            { year: '1882', text: 'Koch identifies the bacteria causing <strong>tuberculosis (TB)</strong>.' },
            { year: '1883', text: 'Koch identifies the bacteria causing <strong>cholera</strong>.' },
          ]},
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
        label: 'Vaccines',
        kicker: 'Chance + Science',
        heading: 'Chicken Cholera: The Holiday Mistake',
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
        heading: 'Why Germ Theory Was Such A Big Deal',
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
  },

  {
    id: 'mod5',
    subject: 'History',
    number: 5,
    title: 'Public Health',
    subtitle: 'Cities, Sewers & Slow Progress',
    era: 'c1800–c1900',
    icon: '🏭',
    color: '#4a3000',
    colorLight: '#fff8e1',
    screens: [
      {
        label: 'Cities Explode',
        kicker: 'Cause of the Problem',
        heading: 'Industrialisation: Cities Exploded',
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
        heading: 'Cholera: The Killer Nobody Understood',
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
        heading: 'Edwin Chadwick: "Please Clean Literally Anything"',
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
        label: 'John Snow',
        kicker: 'Key Person 2',
        heading: 'John Snow: The Soho Water Mystery',
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
        label: 'Government Acts',
        kicker: 'Government Action',
        heading: 'Public Health Acts: 1848 and 1875',
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
        heading: 'The Great Stink & Bazalgette\'s Sewers',
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
  },


  // ─────────────────────────────────────────────────────────────────────────────
  // SOCIOLOGY — Education Module 1: Hidden Curriculum & Socialisation
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'soc_edu_1',
    subject: 'Sociology',
    number: 1,
    title: 'Hidden Curriculum & Socialisation',
    subtitle: 'School teaches way more than maths',
    era: 'Education',
    icon: '🏫',
    color: '#C47A32',
    colorLight: 'rgba(196,122,50,.15)',
    hook: {
      statement: 'Schools only exist to teach subjects.',
      isTrue: false,
      storyLines: [
        'Bell ringing. Students lining up.',
        '“Shirts tucked in please.”',
        'Exam desks. Corridor silence. Behaviour warning flashing briefly.',
        'A student whispers: “Can I go toilet?”',
      ],
      wrongFeedback: 'That is the official version. Sociologists would disagree.',
      correctFeedback: 'Exactly. The timetable is only part of what school teaches.',
      bigQuestion: 'What else is school teaching you?',
      loadingText: 'The corridor is getting quieter...',
      growLabel: 'School as a system',
      growSteps: [
        { label: 'Formal lessons', detail: 'The timetable says maths, science, English and history.', color: '#C47A32' },
        { label: 'Behaviour lessons', detail: 'The building teaches silence, punctuality, uniform and permission.', color: '#D29A5A' },
        { label: 'Sociological question', detail: 'If everyone learns the same rules, who benefits from that?', color: '#B8A088' },
      ],
      revealItems: [
        { emoji: '⏱️', label: 'Punctuality', detail: 'School repeatedly teaches that being on time matters.', color: '#C47A32', bg: 'rgba(196,122,50,.1)' },
        { emoji: '👔', label: 'Authority', detail: 'Students learn who gives instructions and who is expected to follow them.', color: '#D29A5A', bg: 'rgba(210,154,90,.1)' },
        { emoji: '🤫', label: 'Behaviour', detail: 'Silence, uniform, queues and permission become normal without appearing on the timetable.', color: '#B8A088', bg: 'rgba(184,160,136,.1)' },
      ],
      punchline: 'Schools teach maths and science. They also quietly teach behaviour, rules and expectations.',
    },

    screens: [
      {
        label: 'This Module',
        kicker: 'What You Will Learn',
        heading: 'This module',
        sub: 'By the end of this module you will start noticing school differently.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'hidden curriculum', back: 'Unofficial lessons hidden inside everyday school life.' },
            { front: 'socialisation', back: 'The process of learning norms and values.' },
            { front: 'norms', back: 'Expected ways to behave.' },
            { front: 'values', back: 'Ideas society thinks are important.' },
            { front: 'Functionalism', back: 'A view that schools help society run smoothly.' },
            { front: 'meritocracy', back: 'The idea that success comes from hard work, effort and ability.' },
          ]},
        ]
      },
      {
        label: 'Formal Curriculum',
        kicker: 'Official Lessons',
        heading: 'The formal curriculum',
        sub: 'Teacher writing equations. Exercise books open. Soft classroom lighting.',
        blocks: [
          { type: 'read', label: 'Definition', text: 'The formal curriculum is:<br /><strong>the official subjects schools teach.</strong><br /><br />Simple.' },
          { type: 'examtip', label: 'It includes', phrases: ['maths', 'science', 'English', 'history'], tip: 'These are the subjects schools openly say they teach.' },
          { type: 'quiz', question: 'Which of these belongs in the formal curriculum?', options: [
            { text: 'algebra', correct: true },
            { text: 'asking permission', correct: false },
            { text: 'silence in corridors', correct: false },
            { text: 'uniform rules', correct: false },
          ], explanation: 'Formal curriculum = official subjects. The other answers teach behaviour rather than academic knowledge.' },
        ]
      },
      {
        label: 'Hidden Curriculum',
        kicker: 'Unofficial Lessons',
        heading: 'The hidden curriculum',
        sub: 'Students walking silently through corridor. Teacher supervising.',
        blocks: [
          { type: 'read', label: 'Schools also teach', text: 'Schools also teach:<br /><strong>punctuality</strong><br /><strong>obedience</strong><br /><strong>discipline</strong><br /><strong>respect for authority</strong>' },
          { type: 'keypoint', text: 'Nobody officially teaches: <strong>“How to ask permission to go toilet.”</strong><br /><br />And yet somehow… every student learns.' },
          { type: 'read', label: 'Sociologists call this', text: 'Sociologists call these unofficial lessons:<br /><strong>the hidden curriculum.</strong><br /><br />Because the lessons are hidden inside everyday school life.' },
          { type: 'examtip', label: 'Hidden curriculum', phrases: ['sit still', 'ask permission', 'identical uniforms', 'silence'], tip: 'School: “Be creative!” Also school: sit still, ask permission, identical uniforms, silence.' },
        ]
      },
      {
        label: 'Formal or Hidden?',
        kicker: 'Sorting Check',
        heading: 'Formal or hidden?',
        sub: 'Is this teaching knowledge… or behaviour?',
        blocks: [
          { type: 'builder', label: 'Build the formal curriculum set', slots: [null, null, null, null], operators: ['+', '+', '+'], pieces: ['algebra', 'chemistry', 'essay writing', 'science experiments', 'punctuality', 'homework deadlines', 'silence', 'respecting authority', 'uniform rules'], answer: ['algebra', 'chemistry', 'essay writing', 'science experiments'], hint: 'Formal curriculum = official knowledge and subjects.', successText: 'Exactly. Algebra, chemistry, essay writing and science experiments teach official knowledge.' },
          { type: 'builder', label: 'Build the hidden curriculum set', slots: [null, null, null, null, null], operators: ['+', '+', '+', '+'], pieces: ['punctuality', 'homework deadlines', 'silence', 'respecting authority', 'uniform rules', 'algebra', 'chemistry', 'essay writing', 'science experiments'], answer: ['punctuality', 'homework deadlines', 'silence', 'respecting authority', 'uniform rules'], hint: 'Hidden curriculum = behaviour, rules and expectations.', successText: 'Exactly. Those are unofficial lessons about behaviour and authority.' },
        ]
      },
      {
        label: 'Socialisation',
        kicker: 'Assembly Hall',
        heading: 'Schools shape people',
        sub: 'Assembly hall. Rows of silent students.',
        blocks: [
          { type: 'read', label: 'Agents of socialisation', text: 'Sociologists describe schools as:<br /><strong>agents of socialisation.</strong><br /><br />That means schools help teach:<br /><strong>norms</strong><br /><strong>values</strong><br /><strong>expected behaviour</strong>' },
          { type: 'keypoint', text: 'You probably do not remember anyone formally teaching: <strong>“Don’t interrupt adults.”</strong><br /><br />But most students learn VERY quickly what happens if they do.' },
          { type: 'flashcards', cards: [
            { front: 'SOCIALISATION', back: 'The process of learning norms and values.' },
            { front: 'NORMS', back: 'Expected ways to behave.' },
            { front: 'VALUES', back: 'Ideas society thinks are important.' },
            { front: 'queueing', back: 'An example of a norm.' },
            { front: 'punctuality', back: 'A behaviour schools repeatedly reward.' },
            { front: 'respecting teachers', back: 'An authority expectation learned through school.' },
            { front: 'wearing uniform correctly', back: 'A visible rule about conformity.' },
          ]},
        ]
      },
      {
        label: 'Functionalists',
        kicker: 'Social Order',
        heading: 'Functionalists: “Schools help society run smoothly.”',
        sub: 'Assembly hall. School crest. Students in orderly rows.',
        blocks: [
          { type: 'read', label: 'Functionalist view', text: 'Functionalists believe schools help create:<br /><strong>social order</strong><br /><strong>cooperation</strong><br /><strong>shared values</strong><br /><br />They believe schools prepare students for adult life.' },
          { type: 'keypoint', text: 'Functionalists would probably look at school and think:<br /><strong>“Messy… but necessary.”</strong>' },
          { type: 'scenario', scenarios: [
            { situation: 'Assembly', options: ['shared values', 'revolution', 'segregation', 'deviance'], correctIndex: 0, explanation: 'Assembly can promote shared values.' },
            { situation: 'Deadlines', options: ['preparation for work', 'gender roles', 'deviance', 'labelling'], correctIndex: 0, explanation: 'Deadlines can prepare students for adult work routines.' },
            { situation: 'Behaviour systems', options: ['social order', 'segregation', 'revolution', 'deprivation'], correctIndex: 0, explanation: 'Behaviour systems are linked to social order.' },
          ]},
        ]
      },
      {
        label: 'Meritocracy',
        kicker: 'Exam Hall',
        heading: 'Is school fair?',
        sub: 'Rows of desks. Clock ticking.',
        blocks: [
          { type: 'read', label: 'Meritocracy', text: 'Many people believe schools are:<br /><strong>meritocratic.</strong><br /><br />That means success comes from:<br /><strong>hard work</strong><br /><strong>effort</strong><br /><strong>ability</strong>' },
          { type: 'keypoint', text: 'Sounds fair.<br /><br />Sociologists are not completely convinced.<br /><br />(We will come back to that later.)' },
          { type: 'reveal', label: 'Rank it', prompt: 'What affects success most: hard work, natural ability, confidence, money, family support, or school quality?', answer: 'There is no single correct answer here. The point is reflection: sociologists ask what “fair” really means.' },
        ]
      },
      {
        label: 'Quick Fire',
        kicker: 'Retrieval',
        heading: 'Quick fire',
        sub: 'Fast pace. Five checks.',
        blocks: [
          { type: 'quiz', question: '“The hidden curriculum teaches behaviour.”', options: [{ text: 'TRUE', correct: true }, { text: 'FALSE', correct: false }], explanation: 'True. The hidden curriculum teaches behaviour, rules and expectations.' },
          { type: 'quiz', question: 'Which belongs in the formal curriculum?', options: [{ text: 'algebra', correct: true }, { text: 'obedience', correct: false }, { text: 'punctuality', correct: false }, { text: 'silence', correct: false }], explanation: 'Algebra is an official subject.' },
          { type: 'quiz', question: 'Schools are agents of __________.', options: [{ text: 'socialisation', correct: true }, { text: 'capitalism', correct: false }, { text: 'deprivation', correct: false }, { text: 'segregation', correct: false }], explanation: 'Schools are agents of socialisation.' },
          { type: 'quiz', question: '“Norms are expected behaviours.”', options: [{ text: 'TRUE', correct: true }, { text: 'FALSE', correct: false }], explanation: 'True. Norms are expected ways to behave.' },
          { type: 'quiz', question: 'Which idea is linked to Functionalism?', options: [{ text: 'social order', correct: true }, { text: 'revolution', correct: false }, { text: 'deviance', correct: false }, { text: 'segregation', correct: false }], explanation: 'Functionalists focus on social order and shared values.' },
        ]
      },
      {
        label: 'Fill Gaps',
        kicker: 'Required Feature',
        heading: 'Fill in the gaps',
        sub: 'Correct answers glow and snap into place. Wrong answers return.',
        blocks: [
          { type: 'builder', label: 'Six key terms', slots: [null, null, null, null, null, null], operators: ['·', '·', '·', '·', '·'], pieces: ['hidden', 'subjects', 'socialisation', 'norms', 'order', 'meritocracy', 'formal', 'capitalist', 'patriarchal', 'streamed', 'deviant', 'sanctions', 'conformity', 'labelling', 'segregation', 'values', 'hierarchy', 'roles', 'inequality', 'deprivation'], answer: ['hidden', 'subjects', 'socialisation', 'norms', 'order', 'meritocracy'], hint: 'Use the exact terms from the module: hidden, subjects, socialisation, norms, order, meritocracy.', successText: 'The hidden curriculum teaches behaviour and rules. The formal curriculum teaches official subjects. Schools are agents of socialisation. Expected ways to behave are norms. Functionalists believe schools create social order. Success through hard work and ability is meritocracy.' },
        ]
      },
      {
        label: 'Who Agrees?',
        kicker: 'Perspectives',
        heading: 'Who would agree?',
        sub: 'Functionalist, Marxist or Feminist?',
        blocks: [
          { type: 'quiz', question: '“Schools help society run smoothly.”', options: [{ text: 'Functionalist', correct: true }, { text: 'Marxist', correct: false }, { text: 'Feminist', correct: false }], explanation: 'Functionalists believe schools help society run smoothly.' },
          { type: 'quiz', question: '“Schools teach shared values.”', options: [{ text: 'Functionalist', correct: true }, { text: 'Marxist', correct: false }, { text: 'Feminist', correct: false }], explanation: 'Functionalists focus on shared values.' },
          { type: 'quiz', question: '“Schools reinforce inequality.”', options: [{ text: 'Marxist', correct: true }, { text: 'Functionalist', correct: false }, { text: 'Feminist', correct: false }], explanation: 'Marxists focus on class inequality and who benefits.' },
          { type: 'quiz', question: '“Schools may reinforce gender expectations.”', options: [{ text: 'Feminist', correct: true }, { text: 'Functionalist', correct: false }, { text: 'Marxist', correct: false }], explanation: 'Feminists focus on gender expectations and inequality.' },
        ]
      },
      {
        label: 'Exam Skills',
        kicker: 'Better Answers',
        heading: 'How to sound smarter in exams',
        sub: 'Tiny bit of terminology. Massive mark difference.',
        blocks: [
          { type: 'read', label: 'Basic answer', text: '“Schools teach behaviour.”' },
          { type: 'keypoint', text: '<strong>Better answer:</strong><br />Sociologists argue schools are agents of socialisation.' },
          { type: 'examtip', label: 'Even better answer', text: 'Functionalists believe schools teach shared norms and values through the hidden curriculum.' },
        ]
      },
      {
        label: 'GCSE Practice',
        kicker: 'Practice Questions',
        heading: 'GCSE practice',
        sub: 'Use terminology, examples, explanation and application.',
        blocks: [
          { type: 'boss', tier: '🟢', question: 'Identify one feature of the hidden curriculum. [1 mark]', markPoints: 'Reward one valid feature of the hidden curriculum, such as obedience, punctuality, uniform rules, respect for authority, behaviour, rules or expectations. Do not reward vague opinions or unsupported claims.' },
          { type: 'boss', tier: '🟡', question: 'Describe two things taught through socialisation. [2 marks]', markPoints: 'Reward two things taught through socialisation, such as norms, values, expected behaviour, punctuality, respect for teachers, queueing, uniform expectations or not interrupting adults. Reward sociology terminology and examples.' },
          { type: 'boss', tier: '🟡', question: 'Explain one way schools prepare students for adult life. [4 marks]', markPoints: 'Reward explanation and application. Possible points: deadlines prepare students for work; behaviour systems encourage social order; authority structures prepare students for workplace hierarchy; punctuality prepares students for adult responsibilities.' },
          { type: 'boss', tier: '🔴', question: 'Describe one Functionalist view of education. [6 marks]', markPoints: 'Reward Functionalist terminology: social order, cooperation, shared values, socialisation, preparation for adult life, meritocracy as an introductory idea. Do not reward vague opinions or copied wording without explanation.' },
        ]
      },
      {
        label: 'Final Boss',
        kicker: 'Corridor Silence',
        heading: 'Final boss: What are schools really teaching?',
        sub: 'Bell echoing faintly. Rows of desks fading into darkness.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'hidden curriculum', back: 'Unofficial lessons about behaviour and expectations.' },
            { front: 'formal curriculum', back: 'Official subjects schools teach.' },
            { front: 'socialisation', back: 'Learning norms and values.' },
            { front: 'norms', back: 'Expected ways to behave.' },
            { front: 'values', back: 'Ideas society thinks are important.' },
            { front: 'meritocracy', back: 'Success through hard work, effort and ability.' },
          ]},
          { type: 'boss', tier: '🟡', question: 'Fix the error: “The formal curriculum teaches punctuality and obedience.”', markPoints: 'Correct answer should explain that the formal curriculum teaches official subjects. Punctuality and obedience are examples of the hidden curriculum.' },
          { type: 'boss', tier: '🟡', question: 'A student repeatedly receives detentions for speaking without permission. Which sociological idea links to this, and what behaviour is the school encouraging?', markPoints: 'Reward hidden curriculum and/or socialisation. The school is encouraging obedience, respect for authority, self-control, silence or following rules.' },
          { type: 'boss', tier: '🔴', question: 'Are schools only about education? Justify your answer using sociology terminology.', markPoints: 'No single correct answer. Reward reasoning, examples, sociology vocabulary and explanation. Strong answers use hidden curriculum, formal curriculum, socialisation, norms, values, Functionalist view and/or meritocracy.' },
        ]
      },
      {
        label: 'Complete',
        kicker: 'Confidence Tracker',
        heading: 'Module complete',
        sub: 'Schools teach much more than subjects.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'hidden curriculum', back: 'Rate your confidence before leaving the module.' },
            { front: 'formal curriculum', back: 'Rate your confidence before leaving the module.' },
            { front: 'norms & values', back: 'Rate your confidence before leaving the module.' },
            { front: 'socialisation', back: 'Rate your confidence before leaving the module.' },
            { front: 'Functionalism', back: 'Rate your confidence before leaving the module.' },
            { front: 'meritocracy', back: 'Rate your confidence before leaving the module.' },
          ]},
          { type: 'keypoint', text: 'Schools teach much more than subjects. Sociology asks us to notice the lessons nobody writes on the board.' },
          { type: 'read', label: 'Somewhere', text: 'Somewhere right now a teacher is saying: <strong>“You should know better by Year 10.”</strong>' },
        ]
      },
    ]
  },


  // ─────────────────────────────────────────────────────────────────────────────
  // SOCIOLOGY — Families Modules
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'soc_fam_1',
    subject: 'Sociology',
    number: 2,
    title: 'Families: Key Terms & Diversity',
    subtitle: 'The family is not one simple thing',
    era: 'Families',
    icon: '👨‍👩‍👧',
    color: '#FF5C7A',
    colorLight: 'rgba(255,92,122,.15)',
    screens: [
      {
        label: 'Key Terms',
        kicker: 'Families',
        heading: 'The family has its own vocabulary',
        sub: 'The exam rewards precision.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'Double shift', back: 'Women doing paid work and most domestic labour.' },
            { front: 'Canalization', back: 'Parents channel children towards gender-appropriate toys, games and activities.' },
            { front: 'Cohabitation', back: 'Partners living together without being married or in a civil partnership.' },
            { front: 'Matriarchal family', back: 'A family in which a woman holds power and authority.' },
            { front: 'Kinship', back: 'Social relationships based on blood ties, marriage, adoption or civil partnerships.' },
          ]},
          { type: 'quiz', question: 'What term describes women who have paid work and still do most housework?', options: [
            { text: 'Double shift', correct: true },
            { text: 'Dual career', correct: false },
            { text: 'Cohabitation', correct: false },
            { text: 'Canalization', correct: false },
          ], explanation: 'Double shift is the precise sociological term.' },
          { type: 'quiz', question: 'What term describes partners living together without being married?', options: [
            { text: 'Cohabitation', correct: true },
            { text: 'Commune', correct: false },
            { text: 'Conjugal roles', correct: false },
            { text: 'Kinship', correct: false },
          ], explanation: 'Cohabitation means living together as partners without marriage or civil partnership.' },
        ]
      },
      {
        label: 'Family Diversity',
        kicker: 'Describe Questions',
        heading: 'Not every family looks the same',
        sub: 'GCSE Sociology expects examples, not vague labels.',
        blocks: [
          { type: 'read', label: 'Commune', text: 'A commune is a group of people who share ownership of property and the division of labour. Examples include an Israeli kibbutz, Christiania in Copenhagen, the Bruderhof community, or Findhorn ecovillage.' },
          { type: 'read', label: 'Divorce consequences', text: 'Consequences can be financial, emotional, linked to co-parenting, or involve adjusting to step-families and new relationships.' },
          { type: 'read', label: 'Grandparents', text: 'Grandparents may provide childcare, economic support, emotional support, moral support, and pass on cultural traditions.' },
          { type: 'boss', tier: '🟡', question: 'Describe what sociologists mean by kinship. [3 marks]', markPoints: 'Reward coherent description. Kinship means social relationships derived from blood ties and marriage, including husbands, wives, siblings, aunts, uncles and cousins. Also accept adoption or civil partnerships.' },
        ]
      },
    ]
  },

  {
    id: 'soc_fam_2',
    subject: 'Sociology',
    number: 3,
    title: 'Families: Roles, Power & Inequality',
    subtitle: 'Who does what, and who benefits?',
    era: 'Families',
    icon: '🏠',
    color: '#FF5C7A',
    colorLight: 'rgba(255,92,122,.15)',
    screens: [
      {
        label: 'Oakley',
        kicker: 'Item Skills',
        heading: 'Oakley makes family life less cosy',
        sub: 'The numbers do not sound very symmetrical.',
        blocks: [
          { type: 'read', label: 'Oakley 1974', text: 'Ann Oakley studied 40 married women with young children. Half were working class and half middle class. She found little evidence of husbands sharing housework. Only 15% had a husband who shared domestic work to a significant level.' },
          { type: 'keypoint', text: 'A weakness: the sample was small, London-based, dated, and focused only on married couples with young children.' },
          { type: 'quiz', question: 'Which is a weakness of Oakley’s research?', options: [
            { text: 'The sample was only 40 women', correct: true },
            { text: 'It studied every family in Britain', correct: false },
            { text: 'It used no family data at all', correct: false },
            { text: 'It proved gender roles are equal', correct: false },
          ], explanation: 'A small sample is less representative, so findings cannot be generalised easily.' },
        ]
      },
      {
        label: 'Patriarchy',
        kicker: 'Conventional Family',
        heading: 'The conventional family had a power structure',
        sub: 'Oakley called attention to the inequality inside the “normal” image.',
        blocks: [
          { type: 'read', label: 'Oakley 1982', text: 'Oakley defined the conventional family as a nuclear family: a married couple and their children living together. Women were expected to do unpaid work inside the home. Men were expected to do paid work outside the home.' },
          { type: 'keypoint', text: 'The man’s economic power was linked to paid work. The woman’s dependence on the man’s wages was an aspect of inequality.' },
          { type: 'boss', tier: '🟡', question: 'From a feminist perspective, describe one way the conventional family can be patriarchal. [4 marks]', markPoints: 'Reward application to Oakley. Women expected to do unpaid domestic work; men linked to paid work and economic power; women’s dependence on men’s wages creates inequality.' },
        ]
      },
      {
        label: 'Capitalism',
        kicker: 'Zaretsky',
        heading: 'Families also buy things',
        sub: 'Marxists notice who benefits.',
        blocks: [
          { type: 'read', label: 'Zaretsky 1976', text: 'Zaretsky argued the nuclear family had an economic function that served capitalism. Families act as a key unit of consumption: they buy and consume products from the capitalist economy.' },
          { type: 'read', label: 'Reproduction of class', text: 'Zaretsky also argued the family reproduces social class. Bourgeois families pass down private property. Proletarian families reproduce the labour force.' },
          { type: 'quiz', question: 'Which perspective is Zaretsky linked to?', options: [
            { text: 'Marxist', correct: true },
            { text: 'Functionalist', correct: false },
            { text: 'New Right', correct: false },
            { text: 'Interactionist', correct: false },
          ], explanation: 'Zaretsky is used as a Marxist view of the family.' },
        ]
      },
    ]
  },

  {
    id: 'soc_fam_3',
    subject: 'Sociology',
    number: 4,
    title: 'Families: Methods & 12-Mark Arguments',
    subtitle: 'Evidence, evaluation and judgement',
    era: 'Families',
    icon: '⚖️',
    color: '#FF5C7A',
    colorLight: 'rgba(255,92,122,.15)',
    screens: [
      {
        label: 'Methods',
        kicker: 'Family Research',
        heading: 'Researching families is awkward',
        sub: 'Private life is not easy data.',
        blocks: [
          { type: 'flashcards', cards: [
            { front: 'Unstructured interviews', back: 'Rich detail, but hard to compare and time-consuming.' },
            { front: 'Postal questionnaires', back: 'Cheaper for large samples, but risk low response rates.' },
            { front: 'Mixed methods', back: 'Combines quantitative and qualitative data for a fuller picture.' },
            { front: 'Ethics', back: 'Consent, confidentiality, anonymity and avoidance of harm matter in family research.' },
          ]},
          { type: 'boss', tier: '🟡', question: 'Identify one ethical issue when investigating relationships within families and explain how you would deal with it. [4 marks]', markPoints: 'Reward ethical issue plus practical handling. Accept informed consent, confidentiality, anonymity or avoidance of harm. Apply to family relationships.' },
        ]
      },
      {
        label: '12-Mark Arguments',
        kicker: 'Discuss How Far',
        heading: '12-mark answers need balance',
        sub: 'Knowledge, application, evaluation. Then judgement.',
        blocks: [
          { type: 'examtip', label: 'Structure', phrases: ['Agree', 'Disagree', 'Evaluate', 'Judgement'], tip: 'For “Discuss how far”, give a balanced argument and then decide. Do not just list theories.' },
          { type: 'boss', tier: '🔴', question: 'Discuss how far sociologists would agree that gender roles are equal in families in Britain today. [12 marks]', markPoints: 'Reward Feminist perspectives such as Oakley, double shift/triple shift, domestic division of labour, plus challenge from symmetrical family/Young and Willmott. Reward evaluation and a clear judgement.' },
          { type: 'boss', tier: '🔴', question: 'Discuss how far sociologists would agree that the nuclear family is still considered the norm in Britain today. [12 marks]', markPoints: 'Reward Functionalism/New Right, family diversity, Rapoports, lone parent, same-sex and reconstituted families. Evaluate statistical norm versus cultural ideal. Clear conclusion required.' },
        ]
      },
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SCIENCE — Biology Week 1: Plant Cells & Photosynthesis
  // ─────────────────────────────────────────────────────────────────────────────
  {
    id: 'sci_bio_w1',
    subject: 'Biology',
    number: 1,
    title: 'Plant Cells & Photosynthesis',
    subtitle: 'Tiny factories, big chemistry',
    icon: '🌿',
    color: '#38D27A',
    colorLight: 'rgba(56,210,122,.15)',

    // ── Universal Hook ──────────────────────────────────────────────────────
    hook: {
      statement: 'The plant ate the soil.',
      isTrue: false,
      storyLines: [
        'Belgium, 1648. A scientist plants a tiny willow tree.',
        'He weighs everything — the tree, the soil, the pot.',
        'Five years later, the tree has gained 74 kg.',
        'The soil? Lost less than 60 grams.',
      ],
      wrongFeedback: "That's actually what most people think. But the numbers don't add up...",
      correctFeedback: "Right. So where on earth did 74 kg of tree come from?",
      bigQuestion: 'So where did 74 kg of tree come from?',
      revealItems: [
        {
          emoji: '💨',
          label: 'Carbon dioxide',
          detail: 'Absorbed from the air through tiny pores in leaves. This is the main building block.',
          color: '#38D27A',
          bg: 'rgba(56,210,122,.08)',
        },
        {
          emoji: '💧',
          label: 'Water',
          detail: 'Pulled up from the soil through the roots. Used in the chemical reaction.',
          color: '#34D5FF',
          bg: 'rgba(52,213,255,.08)',
        },
        {
          emoji: '☀️',
          label: 'Light energy',
          detail: "Absorbed by chlorophyll in the leaves. Powers the whole reaction. Without it — nothing.",
          color: '#FFC857',
          bg: 'rgba(255,200,87,.08)',
        },
      ],
      punchline: "Plants build themselves from thin air. Literally. This week you find out exactly how.",
    },

    // ── Universal Intro ─────────────────────────────────────────────────────
    intro: {
      retrieval: {
        question: 'Before we start — what do you think photosynthesis actually produces?',
        options: [
          'Oxygen and water',
          'Glucose and oxygen',
          'Carbon dioxide and glucose',
          'Energy and starch',
        ],
        correctIndex: 1,
        explanation: 'Photosynthesis produces glucose (stored chemical energy) and oxygen (released as a by-product). The glucose is what the plant uses to grow, respire and build everything else.',
      },
      learningGoals: [
        'Name every organelle in a plant cell and explain its job',
        'Write the photosynthesis equation correctly using exam language',
        'Describe five different things plants do with glucose (SCARF)',
        'Spot and correct the wording mistakes that lose marks in the exam',
        'Explain why plants build mass from air, not soil',
      ],
    },

    screens: [
      // ── SCREEN 0: Plant Cell Hotspot ───────────────────────────────────────
      {
        label: 'Cell Explorer',
        kicker: 'Plant Cell Structure',
        heading: 'Every Part Has A Job',
        sub: 'Tap every + to discover what each organelle actually does.',
        blocks: [
          {
            type: 'read',
            label: '🏭 The Factory Analogy',
            text: 'Think of a plant cell as a factory. It has <strong>managers</strong>, <strong>power generators</strong>, <strong>assembly lines</strong>, <strong>solar panels</strong>, a <strong>water tank</strong>, <strong>security</strong>, and <strong>outer walls</strong>. Every part has a specific job — and if one fails, the factory breaks down.',
          },
          {
            type: 'hotspot',
            label: 'Plant Cell — tap to explore each part',
            parts: ['cell_wall', 'cell_membrane', 'nucleus', 'chloroplast', 'vacuole', 'mitochondria', 'cytoplasm', 'ribosomes'],
          },
          {
            type: 'examtip',
            label: '🗡️ Exam Assassin — Animal vs Plant',
            text: 'Three things plant cells have that animal cells <strong>do NOT</strong>:',
            phrases: ['Cell wall', 'Chloroplasts', 'Large permanent vacuole'],
          },
        ]
      },

      // ── SCREEN 2: Quick Recall ──────────────────────────────────────────────
      {
        label: 'Quick Check',
        kicker: 'Retrieval',
        heading: 'What Did You Just Learn?',
        sub: 'No notes. No hints. Just you and what stuck.',
        blocks: [
          {
            type: 'quiz',
            question: 'Which organelle absorbs light energy for photosynthesis?',
            options: [
              { text: 'Nucleus', correct: false },
              { text: 'Mitochondria', correct: false },
              { text: 'Chloroplast', correct: true },
              { text: 'Vacuole', correct: false },
            ],
            explanation: 'Chloroplasts contain chlorophyll, which absorbs light energy. They\'re only in plant cells — and only in cells that are green (like leaf cells, not root cells).',
          },
          {
            type: 'quiz',
            question: 'Which organelle releases energy from glucose?',
            options: [
              { text: 'Chloroplast', correct: false },
              { text: 'Mitochondria', correct: true },
              { text: 'Ribosomes', correct: false },
              { text: 'Cell wall', correct: false },
            ],
            explanation: 'Mitochondria are the site of aerobic respiration. They release energy from glucose so the cell can do work — moving, growing, making proteins.',
          },
          {
            type: 'quiz',
            question: 'What gives a plant cell its rigid, fixed shape?',
            options: [
              { text: 'Cell membrane', correct: false },
              { text: 'Vacuole', correct: false },
              { text: 'Cytoplasm', correct: false },
              { text: 'Cell wall', correct: true },
            ],
            explanation: 'The cell wall is made of cellulose and gives the plant cell a strong, fixed shape. The cell membrane is present too but is flexible, not rigid.',
          },
          {
            type: 'quiz',
            question: 'A plant cell is wilting. Which organelle has likely shrunk?',
            options: [
              { text: 'Nucleus', correct: false },
              { text: 'Mitochondria', correct: false },
              { text: 'Large vacuole', correct: true },
              { text: 'Ribosomes', correct: false },
            ],
            explanation: 'The large vacuole is filled with cell sap and keeps the cell turgid (firm). When a plant loses water, the vacuole shrinks, the cell loses pressure and the plant wilts.',
          },
        ]
      },

      // ── SCREEN 3: Misconceptions ────────────────────────────────────────────
      {
        label: 'Mistake Lab',
        kicker: 'Common Mistakes',
        heading: 'Sounds Right. Loses Marks.',
        sub: 'These are the phrases examiners see every year — and penalise every year.',
        blocks: [
          {
            type: 'misconception',
            label: 'Tap to see why each one fails',
            mistakes: [
              {
                wrong: 'Plants get food from the soil.',
                right: 'Plants make glucose by photosynthesis.',
                reason: 'Soil provides minerals (like nitrates), not food. Plants manufacture their own glucose using light energy — they are autotrophs.',
              },
              {
                wrong: 'Chloroplasts make sunlight.',
                right: 'Chloroplasts absorb light energy.',
                reason: '"Make" sunlight is physically impossible. The correct word is "absorb" — chlorophyll inside the chloroplast captures light energy from the sun.',
              },
              {
                wrong: 'Plants create energy during photosynthesis.',
                right: 'Plants transfer light energy into chemical energy (glucose).',
                reason: 'Energy cannot be created or destroyed — it is transferred. Examiners specifically penalise "create" and "make" energy. Always say "transfer" or "store".',
              },
              {
                wrong: 'Only leaves have chloroplasts.',
                right: 'Only green parts of the plant contain chloroplasts.',
                reason: 'Any green part of a plant (stems, unripe fruit, green petals) has chloroplasts. Non-green parts (roots, white flowers) do not — they can\'t photosynthesise.',
              },
            ],
          },
        ]
      },

      // ── SCREEN 4: Photosynthesis Equation Builder ───────────────────────────
      {
        label: 'The Equation',
        kicker: 'Photosynthesis',
        heading: 'Build The Recipe',
        sub: 'Photosynthesis is just cooking — light is the heat, glucose is the meal.',
        blocks: [
          {
            type: 'read',
            label: '📖 The Big Idea',
            text: 'Photosynthesis converts <strong>light energy</strong> into <strong>chemical energy</strong> stored in glucose. The plant takes two raw materials (carbon dioxide and water) and uses light to combine them into glucose and oxygen.',
          },
          {
            type: 'builder',
            label: 'Build the photosynthesis equation',
            slots: [null, null, null, null],
            operators: ['+', '→', '+'],
            pieces: ['carbon dioxide', 'water', 'glucose', 'oxygen', 'nitrogen', 'starch'],
            answer: ['carbon dioxide', 'water', 'glucose', 'oxygen'],
            hint: 'Two things go IN (reactants), two things come OUT (products). Light energy drives the reaction.',
            successText: 'Carbon dioxide + water → glucose + oxygen. Light energy drives the reaction. This is the foundation of almost all life on Earth.',
          },
          {
            type: 'keypoint',
            text: 'The word equation: <strong>carbon dioxide + water → glucose + oxygen</strong>. Light energy is needed. Chlorophyll absorbs it. This happens in the chloroplasts.',
          },
          {
            type: 'examtip',
            label: '🗡️ Exam Trap',
            tip: 'Students often say water is produced in photosynthesis. It is NOT. Water is a <strong>reactant</strong> (goes in). Oxygen is the gas that comes out.',
            phrases: ['carbon dioxide + water → glucose + oxygen', 'light energy required', 'in the chloroplasts'],
          },
        ]
      },

      // ── SCREEN 5: Glucose Uses (SCARF) ─────────────────────────────────────
      {
        label: 'Glucose Uses',
        kicker: 'What Plants Do With Glucose',
        heading: 'SCARF: Five Things Plants Do With Glucose',
        sub: 'Students think glucose just gives energy. It does five different things.',
        blocks: [
          {
            type: 'funfact',
            label: '🤯 Actually Interesting',
            text: 'Wood is made from glucose. The tree trunk, every branch, every leaf — almost all of it built from sugar that the tree made from thin air using sunlight. You\'re basically looking at crystallised light.',
          },
          {
            type: 'scarf',
            label: 'SCARF — tap each letter to reveal',
            items: [
              { letter: 'S', word: 'Starch', detail: 'Glucose is converted to starch for storage. Starch is insoluble so it doesn\'t affect osmosis. Stored in chloroplasts and other parts of the plant.' },
              { letter: 'C', word: 'Cellulose', detail: 'Used to make cellulose for cell walls. This gives the plant structural support. Wood is mostly cellulose.' },
              { letter: 'A', word: 'Amino acids', detail: 'Combined with nitrates from the soil to make amino acids, which are then used to build proteins. No nitrates = no proteins = stunted growth.' },
              { letter: 'R', word: 'Respiration', detail: 'Used in aerobic respiration to release energy for growth, reproduction, active transport and other cell processes.' },
              { letter: 'F', word: 'Fats and oils', detail: 'Some glucose is converted into lipids (fats and oils) for storage — especially in seeds. Seeds are often very high in fats.' },
            ],
          },
          {
            type: 'reveal',
            label: '⚡ Exam Recall Check',
            prompt: 'Without looking up — what does SCARF stand for in terms of glucose uses?',
            answer: 'S = Starch (storage). C = Cellulose (cell walls). A = Amino acids (proteins). R = Respiration (energy). F = Fats and oils (seed storage).',
          },
        ]
      },

      // ── SCREEN 6: Glucose Decision Game ────────────────────────────────────
      {
        label: 'Decision Game',
        kicker: 'Apply Your Knowledge',
        heading: 'Where Should The Glucose Go?',
        sub: 'Six scenarios. One right answer each time. No hints.',
        blocks: [
          {
            type: 'scenario',
            label: 'Glucose Decision',
            completionText: 'You can now link glucose uses to plant needs — a favourite AQA exam style question.',
            scenarios: [
              {
                situation: 'The plant needs stronger cell walls to support a new branch.',
                options: ['Starch', 'Cellulose', 'Respiration', 'Fats'],
                correctIndex: 1,
                explanation: 'Cellulose is used to build cell walls. It gives structural strength.',
              },
              {
                situation: 'The plant needs to store energy underground for winter.',
                options: ['Amino acids', 'Cellulose', 'Starch', 'Respiration'],
                correctIndex: 2,
                explanation: 'Starch is insoluble and used for long-term storage — in potatoes, for example.',
              },
              {
                situation: 'The plant is growing rapidly and needs to make new proteins.',
                options: ['Amino acids', 'Starch', 'Fats', 'Cellulose'],
                correctIndex: 0,
                explanation: 'Glucose combines with nitrates to form amino acids, which are linked together to make proteins.',
              },
              {
                situation: 'The plant needs energy for active transport of minerals.',
                options: ['Cellulose', 'Starch', 'Respiration', 'Fats'],
                correctIndex: 2,
                explanation: 'Respiration releases energy from glucose. Active transport needs this energy to move minerals against the concentration gradient.',
              },
              {
                situation: 'A seed needs to store lots of energy in a compact, dense form.',
                options: ['Starch', 'Fats and oils', 'Amino acids', 'Cellulose'],
                correctIndex: 1,
                explanation: 'Fats contain more energy per gram than starch. Seeds (like sunflower seeds) store fats for the germinating seedling to use.',
              },
            ],
          },
        ]
      },

      // ── SCREEN 7: Exam Assassin ─────────────────────────────────────────────
      {
        label: 'Exam Assassin',
        kicker: 'Exam Technique',
        heading: 'How To Actually Score Marks',
        sub: 'These aren\'t tips. These are the specific phrases that win and lose marks.',
        blocks: [
          {
            type: 'examtip',
            label: '🗡️ Tip 1 — Absorb, Not Collect',
            tip: 'Say <strong>"absorbs light energy"</strong> — not "collects sunlight" or "uses light". Examiners want the word ABSORB.',
            phrases: ['absorbs light energy', 'chlorophyll', 'chloroplast'],
          },
          {
            type: 'examtip',
            label: '🗡️ Tip 2 — Glucose, Not Food',
            tip: 'Photosynthesis produces <strong>glucose</strong>. Never "food" or "sugar" — use the specific term.',
            phrases: ['glucose', 'not food', 'not sugar'],
          },
          {
            type: 'examtip',
            label: '🗡️ Tip 3 — Transfer, Not Create',
            tip: 'Light energy is <strong>transferred</strong> into chemical energy. Never say plants "make", "create" or "produce" energy. Energy is conserved, not created.',
            phrases: ['energy is transferred', 'light energy → chemical energy', 'stored in glucose'],
          },
          {
            type: 'quiz',
            question: 'Which answer would score the mark?',
            options: [
              { text: 'Chloroplasts collect sunlight to make food for the plant.', correct: false },
              { text: 'Chloroplasts absorb light energy to produce glucose by photosynthesis.', correct: true },
              { text: 'Chloroplasts create energy from sunlight.', correct: false },
              { text: 'Chloroplasts make sugar using the sun.', correct: false },
            ],
            explanation: 'Option B uses the correct command words: "absorb", "light energy", "glucose", "photosynthesis". Every other option uses vague or incorrect language.',
          },
        ]
      },

      // ── SCREEN 8: Boss Battle ───────────────────────────────────────────────
      {
        label: 'Boss Battle',
        kicker: 'Challenge',
        heading: '⚔️ Boss Battle: Apply Everything',
        sub: 'Three questions. Free text. Marked by AI. No skipping.',
        blocks: [
          {
            type: 'read',
            label: '🔥 Real answers only.',
            text: 'Write your answer in the box — then submit it. The AI examiner will mark it against the actual mark scheme, tell you what you got right, what you missed, and show you a model answer. <strong>You have to try before you can see the model answer.</strong>',
          },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Warm Up',
            question: 'A student says: "Plants get food from the soil." Explain why this is incorrect and give a better explanation.',
            markPoints: `- Plants do NOT get food/energy from the soil
- Plants make glucose through photosynthesis
- Photosynthesis uses carbon dioxide, water and light energy
- The soil only provides minerals/nitrates (not food/energy)
- Plants are producers/autotrophs — they make their own food`,
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Challenge',
            question: 'A plant has damaged chloroplasts. Explain why this would affect the plant\'s growth, even if it has plenty of water and carbon dioxide.',
            markPoints: `- Damaged chloroplasts cannot absorb light energy properly
- Less/no photosynthesis can occur
- Less glucose is produced
- Less glucose means less energy available for growth (via respiration)
- Less glucose means fewer building materials: less cellulose for cell walls, fewer amino acids for proteins
- Plant grows more slowly or stops growing`,
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Boss Mode',
            question: 'A gardener removes all the leaves from a healthy plant. Predict and explain what will happen to the plant over the following two weeks.',
            markPoints: `- Leaves contain chloroplasts — removing them stops photosynthesis
- No photosynthesis means no glucose being produced
- Plant cannot respire efficiently — less energy available
- Growth stops — no glucose for cellulose or protein synthesis
- Plant uses up stored starch reserves
- Plant weakens and may wilt or die
- Cannot replace damaged or dead cells
- Cannot produce new leaves without stored energy`,
          },
        ]
      },

      // ── SCREEN 9: Fast Recap ────────────────────────────────────────────────
      {
        label: 'Fast Recap',
        kicker: 'Final Retrieval',
        heading: 'Lock It In',
        sub: 'Tap every card. This is the stuff that will come up in Paper 1.',
        blocks: [
          {
            type: 'flashcards',
            cards: [
              { front: 'Chloroplast', back: 'Contains chlorophyll. Absorbs light energy for photosynthesis. Only in plant and algae cells.' },
              { front: 'Nucleus', back: 'Controls cell activities. Contains DNA (genetic instructions).' },
              { front: 'Mitochondria', back: 'Site of aerobic respiration. Releases energy from glucose.' },
              { front: 'Cell wall', back: 'Made of cellulose. Gives plant cells strength and a fixed shape.' },
              { front: 'Large vacuole', back: 'Filled with cell sap. Keeps cell turgid (firm). Not in animal cells.' },
              { front: 'Photosynthesis equation', back: 'carbon dioxide + water → glucose + oxygen. Light energy required. In chloroplasts.' },
              { front: 'SCARF', back: 'Starch · Cellulose · Amino acids · Respiration · Fats and oils. Five uses of glucose.' },
              { front: 'Ribosomes', back: 'Where proteins are made. Present in all cells. Too small for a light microscope.' },
              { front: 'Three things plant cells have that animal cells lack', back: 'Cell wall · Chloroplasts · Large permanent vacuole.' },
              { front: 'Energy in photosynthesis', back: 'Light energy is TRANSFERRED into chemical energy stored in glucose. Never "created".' },
            ]
          },
          {
            type: 'keypoint',
            text: '✅ <strong>You can now:</strong> name all plant cell organelles and their jobs, write the photosynthesis equation correctly, describe five uses of glucose using SCARF, and use the exact phrases that score marks in the exam.',
          },
        ]
      },
    ]
  },
]
