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
      scenario: {
        location: 'England, 1348',
        hint: 'You wake up with a fever. Your neighbour died yesterday.',
        intro: 'You wake up with:',
        items: [
          'a fever',
          'painful swollen lumps under your arms',
          'your neighbour died yesterday',
          'the local doctor says the planets may be misaligned',
          'someone nearby is burning herbs to "clean the air"',
        ],
      },
      statement: 'Medieval doctors understood that germs caused disease.',
      isTrue: false,
      wrongFeedback: "Almost everyone thinks that — but it took another 500 years to figure out germs existed.",
      correctFeedback: "Exactly. Nobody knew. That's what makes this era so fascinating.",
      loadingText: 'The real story goes deeper…',
      bigQuestion: 'So what DID they think was causing it?',
      revealHeader: 'Nobody knew germs existed yet.',
      revealItems: [
        {
          emoji: '🌬️',
          label: 'Rational ideas — miasma and observation',
          detail: 'Doctors observed patterns: illness spread near rotting smells and dirty water. They were thinking logically — just working with the wrong theory.',
          color: '#FFC857',
          bg: 'rgba(255,200,87,.08)',
        },
        {
          emoji: '⛪',
          label: 'Supernatural ideas — God and astrology',
          detail: "The Church taught illness was God's punishment for sin. Astrologers blamed planetary alignment. These weren't stupid — they were the best available explanations at the time.",
          color: '#9D5CFF',
          bg: 'rgba(157,92,255,.08)',
        },
        {
          emoji: '🧠',
          label: 'People were trying to explain disease logically…',
          detail: 'Medieval medicine was a genuine attempt to make sense of a terrifying world — without microscopes, without germ theory, without any of the tools we take for granted.',
          color: '#38D27A',
          bg: 'rgba(56,210,122,.08)',
        },
      ],
      punchline: 'They just didn\'t have the right tools yet. This module explains how medicine slowly — very slowly — got better.',
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
        headerImage: '/images/black-death-1348.png',
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
    color: '#D4950A',
    colorLight: 'rgba(212,149,10,.12)',
    hook: {
      scenario: {
        location: 'Italy, 1543',
        hint: 'A patient is dying. Two doctors can\'t agree on how to treat him.',
        intro: 'A patient is seriously ill. Two doctors disagree.',
        quotes: [
          { role: 'One doctor says:', text: '"Balance the Four Humours."' },
          { role: 'Another says:', text: '"We should dissect the body properly and study anatomy."' },
        ],
        bulletHeading: 'Meanwhile:',
        items: [
          'plague spreads through crowded streets',
          'people still carry flowers against bad air',
          "Galen's textbooks still control universities",
          'Medicine is beginning to change...',
        ],
      },
      statement: 'By the Renaissance, doctors had completely abandoned medieval medical ideas.',
      isTrue: false,
      wrongFeedback: "It feels like that — Vesalius was correcting Galen! But at universities, it was business as usual.",
      correctFeedback: "Exactly. Change happened at the edges. The core stayed medieval for much longer.",
      loadingText: 'The history is more complicated than it looks…',
      bigQuestion: 'So what actually changed — and what stayed the same?',
      revealHeader: 'Change was slow. Very slow.',
      revealItems: [
        {
          emoji: '🔬',
          label: 'Anatomy improved — but treatments didn\'t',
          detail: 'Vesalius corrected 300+ of Galen\'s errors (1543). Harvey proved blood circulates (1628). But doctors still bled patients and used purging. New knowledge, same old cures.',
          color: '#D4950A',
          bg: 'rgba(212,149,10,.08)',
        },
        {
          emoji: '📚',
          label: 'Galen still dominated universities',
          detail: "Medieval ideas weren't swept away overnight. Most physicians still swore by Galen. The printing press spread new ideas — but also spread old ones further.",
          color: '#C47828',
          bg: 'rgba(196,120,40,.08)',
        },
        {
          emoji: '💀',
          label: 'The Great Plague (1665) proved the limits',
          detail: "London lost 100,000 people in one outbreak. Despite all the Renaissance progress, nobody could explain or stop the plague. The tools weren't there yet.",
          color: '#FF5D73',
          bg: 'rgba(255,93,115,.08)',
        },
      ],
      punchline: 'Renaissance medicine changed knowledge, not treatment. This module explains why that gap mattered.',
    },
    intro: {
      learningGoals: [
        'Describe what changed in medicine during the Renaissance',
        'Explain the contributions of Vesalius, Harvey and Paré',
        'Explain why the Great Plague showed the limits of Renaissance medicine',
        'Assess how far the Renaissance was a turning point in the history of medicine',
      ],
    },
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
        kicker: '1543',
        heading: 'Vesalius, Harvey & Paré',
        headerImage: '/images/vesalius-1543.png',
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
        label: 'Royal Society',
        kicker: '1660',
        heading: 'The Royal Society',
        headerImage: '/images/royal-society-1660.png',
        sub: 'Science became organised — and started demanding evidence.',
        blocks: [
          { type: 'read', label: '🔬 What Happened', text: 'The <strong>Royal Society</strong> was founded in 1660 — a formal scientific institution where experiments were shared, tested and debated. Its motto: <em>Nullius in Verba</em> ("take nobody\'s word for it"). It represented the shift from trusting ancient authority to demanding <strong>observable, repeatable evidence</strong>.' },
          { type: 'keypoint', text: '<strong>Why it matters for the exam:</strong> The Royal Society created a culture of scientific investigation. This directly enabled later breakthroughs — Harvey\'s ideas were published through such networks, and it set the stage for Jenner, Pasteur and Koch.' },
          { type: 'quiz', question: 'What was the significance of the Royal Society\'s motto "Nullius in Verba"?', options: [
            { text: 'It rejected ancient authority and demanded evidence from observation and experiment', correct: true },
            { text: 'It said that only noblemen could join', correct: false },
            { text: 'It meant that all medical cures needed royal approval', correct: false },
          ], explanation: '"Take nobody\'s word for it" — the motto symbolised the rejection of Galen and ancient texts in favour of direct observation and experiment.' },
        ],
      },
      {
        label: 'Great Plague',
        kicker: '1665',
        heading: 'The Great Plague of London',
        headerImage: '/images/great-plague-1665.png',
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
    color: '#C47828',
    colorLight: 'rgba(196,120,40,.12)',
    hook: {
      scenario: {
        location: 'London, 1840',
        hint: 'A surgeon is about to operate. He hasn\'t washed his hands once today.',
      },
      statement: 'Before the 1840s, surgeons washed their hands and wore clean coats to prevent infection.',
      isTrue: false,
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
        heading: 'Humphry Davy: Laughing Gas',
        sub: 'The first hint that pain in surgery could one day be solved.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: '<strong>Humphry Davy</strong> discovered that inhaling <strong>nitrous oxide</strong> (laughing gas) reduced the sensation of pain. He even suggested it could be used during surgery. But surgeons ignored him — partly because it made people giggle, and partly because no one believed patients needed to be unconscious.' },
          { type: 'funfact', label: '😂 Why It Was Ignored', text: 'Nitrous oxide was seen as a party trick. It was used at "laughing gas shows" for entertainment. Serious surgeons didn\'t want to be associated with circus antics — so a potential breakthrough sat unused for 47 years.' },
        ]
      },
      {
        label: 'Morton',
        kicker: '1846',
        heading: 'William Morton: Ether',
        sub: 'The first successful public demonstration of surgical anaesthesia.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: '<strong>William Morton</strong>, an American dentist, publicly demonstrated that <strong>ether</strong> could render a patient unconscious during surgery in 1846. The news spread to Britain rapidly. For the first time, surgeons could operate without a patient screaming — but ether was flammable and caused nausea.' },
          { type: 'keypoint', text: 'Morton\'s demonstration was the turning point that made pain-free surgery a reality. But ether had serious limitations — the search for something better began immediately.' },
        ]
      },
      {
        label: 'Simpson',
        kicker: '1847',
        heading: 'James Simpson: Chloroform',
        sub: 'Better than ether — and discovered over a dinner party.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: '<strong>James Simpson</strong>, a Scottish obstetrician, was searching for something better than ether. In 1847, he and two colleagues inhaled various chemicals at a dinner party. They woke up under the table having discovered <strong>chloroform</strong> — more powerful, faster acting, and less flammable than ether. It allowed much longer operations.' },
          { type: 'funfact', label: '🍽️ The Dinner Party Method', text: 'Simpson\'s approach to drug discovery: invite friends over, try inhaling random chemicals, see who passes out. Pioneering science or a Victorian dare? Both, probably.' },
        ]
      },
      {
        label: 'Greener',
        kicker: '1848',
        heading: 'Hannah Greener: A Warning',
        sub: 'The new wonder drug had a dangerous side.',
        blocks: [
          { type: 'read', label: '⚠️ What Happened', text: '<strong>Hannah Greener</strong>, aged 15, died from an overdose of chloroform in 1848 — one year after its discovery. She had been given too much. Her death showed that anaesthetics were not automatically safe. The problem was dosage: there was no precise way to control how much a patient received.' },
          { type: 'examtip', label: '🗡️ Exam Insight', text: 'Hannah Greener\'s death is useful evidence that <strong>new medical advances create new problems</strong>. Examiners love this nuance — progress isn\'t simply positive.' },
        ]
      },
      {
        label: 'Snow',
        kicker: '1850s',
        heading: 'John Snow: Safer Dosage',
        sub: 'The man who solved cholera also made chloroform much safer.',
        blocks: [
          { type: 'read', label: '🔬 The Improvement', text: '<strong>John Snow</strong> — best known for tracing the 1854 cholera outbreak to a water pump — developed an <strong>inhaler</strong> that allowed surgeons to control exactly how much chloroform a patient received. Controlled dosage dramatically reduced the risk of overdose and death. Chloroform became far more trusted as a result.' },
          { type: 'keypoint', text: 'Snow\'s inhaler is a classic example of <strong>technology improving a previous advance</strong>. The discovery (chloroform) only became safe when the method of administering it was controlled.' },
        ]
      },
      {
        label: 'Victoria',
        kicker: '1853',
        heading: 'Queen Victoria: Royal Seal of Approval',
        sub: 'When the Queen used it in childbirth, public resistance collapsed.',
        blocks: [
          { type: 'read', label: '👑 The Endorsement', text: '<strong>Queen Victoria</strong> used chloroform during the birth of her eighth child in 1853 — and praised it publicly. Until this point, many religious figures argued that pain in childbirth was God\'s will and should not be numbed. The Queen\'s endorsement silenced most opposition overnight. Chloroform use spread rapidly.' },
          { type: 'examtip', label: '🗡️ Exam Factor', text: 'Victoria\'s endorsement is evidence of <strong>government/authority as a factor</strong> in medical change. Not a scientific discovery — but it removed the social and religious barrier to adoption.' },
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
    color: '#B06520',
    colorLight: 'rgba(176,101,32,.12)',
    hook: {
      scenario: {
        location: 'Paris, 1857',
        hint: 'Pasteur is in his lab — staring at a bottle of wine that\'s gone bad.',
      },
      statement: 'Louis Pasteur discovered germ theory by studying sick patients in hospitals.',
      isTrue: false,
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
    intro: {
      learningGoals: [
        'Explain Pasteur\'s germ theory and the evidence behind it',
        'Describe Koch\'s specific contributions and why identifying bacteria mattered',
        'Explain how germ theory led to vaccines and targeted treatments',
        'Assess why Pasteur and Koch were rivals — and why it helped science',
      ],
    },
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
        label: 'Jenner',
        kicker: '1796',
        heading: 'Jenner develops the smallpox vaccine.',
        headerImage: '/images/jenner-1796.png',
        sub: 'The first vaccine — discovered by observation, not by understanding germs.',
        blocks: [
          { type: 'read', label: '💉 What Happened', text: '<strong>Edward Jenner</strong> noticed that milkmaids who caught <strong>cowpox</strong> rarely got <strong>smallpox</strong>. In 1796 he deliberately infected James Phipps — a boy — with cowpox, then exposed him to smallpox. The boy did not get ill. The <strong>smallpox vaccine</strong> was born.' },
          { type: 'keypoint', text: '<strong>Critical exam point:</strong> Jenner did not know about germs or the immune system. He worked by observation and experiment — not by understanding why it worked. Pasteur later explained the mechanism. This shows how <strong>chance observation + scientific method</strong> can lead to breakthroughs.' },
          { type: 'funfact', label: '😨 Controversy', text: 'Many people were horrified. Cartoons showed patients growing cow heads after vaccination. The Church opposed it. Parliament eventually made smallpox vaccination compulsory in 1853 — the first compulsory vaccination law in England.' },
          { type: 'quiz', question: 'Why is Jenner\'s smallpox vaccine significant for understanding medical progress?', options: [
            { text: 'It proved that observation and experiment could produce breakthroughs even without understanding the cause', correct: true },
            { text: 'It proved that germ theory was correct', correct: false },
            { text: 'It showed that the Church supported scientific progress', correct: false },
          ], explanation: 'Jenner had no knowledge of germs or immunity — he used observation and careful experiment. His work paved the way for Pasteur, who later explained WHY vaccines work.' },
        ],
      },
      {
        label: 'Pasteur',
        kicker: '1861',
        heading: 'Louis Pasteur: The Wine Detective',
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
        label: 'Koch',
        kicker: 'Key Person 2',
        heading: 'Robert Koch: "Cool, But WHICH Germ?"',
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
        heading: 'Koch Identifies Anthrax',
        sub: 'The first time a specific bacterium was definitively linked to a specific disease.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: '<strong>Robert Koch</strong> identified <em>Bacillus anthracis</em> — the bacterium causing anthrax — in 1876. He used industrial dyes to stain bacteria so they were visible under a microscope. This was the first time a specific microbe had been definitively linked to a specific disease, turning germ theory from an idea into a proven tool.' },
          { type: 'keypoint', text: 'Before Koch, germ theory was plausible. After 1876, it was <strong>proven</strong> — at least for anthrax. The method he used became the template for future discoveries.' },
        ]
      },
      {
        label: 'Tuberculosis',
        kicker: '1882',
        heading: 'Koch Identifies TB',
        sub: 'TB killed one in seven people in Europe. Now they knew what caused it.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: 'In <strong>1882</strong>, Koch identified the bacterium causing <strong>tuberculosis (TB)</strong> — one of the biggest killers in Europe. This single discovery made germ theory widely accepted because TB was so visible and deadly. Doctors could no longer dismiss the idea that invisible microbes caused disease.' },
          { type: 'examtip', label: '🗡️ Exam Link', text: 'TB identification mattered for the <strong>development of later treatments</strong>. You cannot treat a specific disease if you do not know its specific cause.' },
        ]
      },
      {
        label: 'Cholera',
        kicker: '1883',
        heading: 'Koch Identifies Cholera',
        sub: 'Cholera had swept across Europe in waves. Koch found out why.',
        blocks: [
          { type: 'read', label: '🔬 The Discovery', text: 'In <strong>1883</strong>, Koch identified the bacterium causing <strong>cholera</strong>. This built on John Snow\'s earlier work — Snow had proved cholera spread through contaminated water (1854) without knowing why. Koch found the actual cause. Together their work transformed public health and disease prevention.' },
          { type: 'keypoint', text: 'By 1883, Koch had linked three major diseases to specific bacteria. The age of targeted medicine had begun.' },
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
    color: '#9A5A18',
    colorLight: 'rgba(154,90,24,.12)',
    hook: {
      scenario: {
        location: 'London, 1854',
        hint: 'People are drawing water from a pump on Broad Street. Several neighbours have died this week.',
      },
      statement: 'Victorian Londoners knew that drinking from the Thames could spread cholera.',
      isTrue: false,
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
      showGrow: true,
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
  {
    id: 'math1',
    subject: 'Maths',
    number: 1,
    title: 'Maths Survival Basics',
    subtitle: 'Number sense, negatives, BIDMAS',
    era: 'Foundation',
    icon: '🔢',
    color: '#4B90FF',
    colorLight: 'rgba(75,144,255,.12)',
    hook: {
      scenario: {
        location: 'Any exam hall',
        hint: 'A student stares at −8 and −3 on a number line. Which is bigger?',
      },
      statement: 'Negative numbers are always smaller than positive numbers.',
      isTrue: false,
      wrongFeedback: 'Not quite. With negatives, think left and right — not just bigger digit.',
      correctFeedback: 'Right. −3 is bigger than −8 because it\'s further right on the number line.',
      loadingText: 'Let\'s see why on a number line…',
      bigQuestion: 'So how do we actually compare negative numbers?',
      revealHeader: 'Think left and right — not just bigger digit.',
      revealItems: [
        { emoji: '📍', label: 'Use a number line', detail: '−3 sits to the RIGHT of −8. Further right = bigger. Always.', color: '#4B90FF', bg: 'rgba(75,144,255,.08)' },
        { emoji: '🌡️', label: 'Real examples', detail: '−3°C is warmer than −8°C. £−3 means less debt than £−8. Position on the line tells you size.', color: '#4B90FF', bg: 'rgba(75,144,255,.08)' },
        { emoji: '⚠️', label: 'The common trap', detail: 'Students see −8 and think "8 is bigger than 3, so −8 is bigger." That\'s the trap. The minus flips it.', color: '#FF6B6B', bg: 'rgba(255,107,107,.08)' },
      ],
      punchline: 'Number line thinking beats digit thinking every time. That\'s the whole key.',
    },
    intro: {
      learningGoals: [
        'Move confidently on a number line — adding right, subtracting left',
        'Handle negative numbers without sign panic',
        'Use BIDMAS so calculations happen in the right order',
        'Estimate first, then check if calculator answers are sensible',
      ],
    },
    screens: [
      {
        label: 'Number Line',
        kicker: 'Core Skill 1',
        heading: 'Adding moves right.',
        sub: 'On a number line, right means bigger. Left means smaller.',
        blocks: [
          { type: 'read', label: '💸 Why This Matters', text: 'Used for <strong>temperatures</strong>, <strong>bank balances</strong>, <strong>scores</strong> and exam checking.' },
          {
            type: 'numberline',
            startAt: -3,
            operations: [
              { label: 'Add 8', delta: 8 },
              { label: 'Subtract 5', delta: -5 },
            ],
            quiz: {
              q: 'Where would −2 + 6 land?',
              options: ['−8', '4', '8'],
              correct: 1,
              explanation: 'Start at −2. Adding 6 moves right. You land on 4.',
            },
            hints: ['Start at −3.', 'Adding means move right.', 'Move 8 spaces to the right.', 'You land on 5.'],
          },
        ],
      },
      {
        label: 'Movement Rules',
        kicker: 'Active Recall',
        heading: 'Complete the movement rules.',
        sub: 'Lock in the rules that matter all year.',
        blocks: [
          { type: 'read', label: '🎯 Why This Matters', text: 'This is the rule that stops <strong>negative-number mistakes</strong> in every topic — fractions, algebra, percentages.' },
          {
            type: 'fillblanks',
            sentences: [
              { before: 'Adding moves', after: '.', answer: 'right', hints: ['Think number line direction.', 'Positive movement goes this way →'] },
              { before: 'Subtracting moves', after: '.', answer: 'left', hints: ['Opposite of adding.', 'Think ← direction.'] },
              { before: 'Numbers further right are', after: '.', answer: 'bigger', hints: ['Look at a number line.', '5 is to the right of 2. Which is bigger?'] },
              { before: '−3 is bigger than −8 because it is closer to', after: '.', answer: 'zero', hints: ['Think about position on the number line.', 'Which is further right?'] },
            ],
            correctMsg: 'Nice. That rule matters all year.',
            wrongMsg: 'Check the number line: adding moves right, subtracting moves left.',
          },
        ],
      },
      {
        label: 'BIDMAS',
        kicker: 'Core Skill 2',
        heading: 'Calculations happen in layers.',
        sub: 'Some parts of a calculation must happen before others.',
        blocks: [
          { type: 'read', label: '🧮 Why This Matters', text: 'Used whenever <strong>calculators</strong>, <strong>formulas</strong> or <strong>multi-step sums</strong> appear. BIDMAS prevents wrong answers.' },
          {
            type: 'bidmas',
            expression: '3 + 4 × 2',
            question: 'Which part should happen first?',
            options: ['3 + 4', '4 × 2', '3 × 2'],
            correct: 1,
            steps: [
              { highlight: '4 × 2', becomes: '8', newExpr: '3 + 8' },
              { highlight: '3 + 8', becomes: '11', newExpr: '11' },
            ],
            wrongPath: ['❌ 3 + 4 = 7', '7 × 2 = 14 ✗'],
            correctPath: ['✅ 4 × 2 = 8', '3 + 8 = 11 ✓'],
            examTip: 'Brackets change everything. Calculators follow order rules exactly.',
          },
        ],
      },
      {
        label: 'Quiz',
        kicker: 'Practice',
        heading: 'Test yourself.',
        sub: 'Three levels. Work through them in order.',
        blocks: [
          { type: 'read', label: '⚡ Why This Matters', text: 'Quick practice helps your brain <strong>recognise patterns faster</strong>.' },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Warm Up', emoji: '🟢',
                questions: [
                  { q: 'Which is bigger?', options: ['−7', '−2', 'They are equal'], correct: 1, feedback: '−2 is further right on the number line.', hint: 'Imagine a number line.' },
                  { q: 'Calculate: −4 + 9', options: ['−13', '5', '13'], correct: 1, feedback: 'Start at −4 and move right 9.', hint: 'Start at −4, adding means move right.' },
                  { q: 'What happens first in: 6 + 3 × 4', options: ['6 + 3', '3 × 4', '6 × 4'], correct: 1, feedback: 'Multiplication happens before addition (BIDMAS).', hint: 'Which operation has higher priority?' },
                ],
              },
              {
                label: 'Challenge', emoji: '🟡',
                questions: [
                  { q: 'Calculate: 12 − 19', options: ['7', '−7', '−31'], correct: 1, feedback: '12 − 12 = 0. Then 7 more left gives −7.', hint: 'You will cross zero going left.' },
                  { q: 'Calculate: 5 + 6²', options: ['121', '41', '66'], correct: 1, feedback: '6² = 36. Then 5 + 36 = 41. Powers before addition.', hint: 'Indices (powers) come before addition in BIDMAS.' },
                  { q: 'Estimate: 302 × 19 is closest to...', options: ['600', '6000', '60 000'], correct: 1, feedback: '302 ≈ 300, 19 ≈ 20. 300 × 20 = 6000.', hint: 'Round both numbers to 1 significant figure first.' },
                ],
              },
              {
                label: 'Boss Mode', emoji: '🔴',
                questions: [
                  { q: 'A calculator says: 12 × 4 = 0.48. What should you think?', options: ['Accept it', 'Impossible — should be about 50', 'Round it to 0.5'], correct: 1, feedback: '12 × 4 = 48. 0.48 is a decimal/place-value error.', hint: 'Estimate first: 12 × 4 is roughly 10 × 4 = 40.' },
                  { q: 'Which calculator input matches: 4(3 + 5)', options: ['4 × 3 + 5', '4 × (3 + 5)', '4 + 3 × 5'], correct: 1, feedback: 'Brackets force 3 + 5 to happen first.', hint: 'The brackets must be entered into the calculator too.' },
                  { q: 'Calculate: 2 × (7 + 3) − 4', options: ['10', '16', '24'], correct: 1, feedback: 'Brackets first: 7+3=10. Multiply: 2×10=20. Subtract: 20−4=16.', hint: 'Brackets first, then multiplication, then subtraction.' },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Checkpoint',
        kicker: 'True or False',
        heading: 'Is this calculator answer possible?',
        sub: 'Impossible answers are warning lights.',
        blocks: [
          { type: 'read', label: '🚨 Why This Matters', text: 'Used to catch answers that <strong>cannot possibly be right</strong> — the most common reason for lost marks.' },
          {
            type: 'tfcheckpoint',
            statement: '12 × 4 = 0.48 could be correct.',
            isTrue: false,
            revealHeader: 'FALSE.',
            revealSub: '12 × 4 should be around 50.',
            breakdown: [
              '12 × 4 = 48',
              '0.48 is less than 1',
              '12 lots of 4 cannot be less than 1',
              'So the calculator entry went wrong',
            ],
            wrongDisplay: '0.48',
            rightDisplay: '48',
          },
        ],
      },
      {
        label: 'Simulator',
        kicker: 'Apply It',
        heading: 'The calculator is not your boss.',
        sub: 'Estimate first. Then decide if the answer is sensible.',
        blocks: [
          { type: 'read', label: '🧾 Why This Matters', text: 'Used when <strong>shopping</strong>, <strong>budgeting</strong> and checking exam answers.' },
          {
            type: 'simulator',
            scenarios: [
              {
                scenario: '9 cinema tickets cost £7 each.',
                display: '£6.30',
                answer: 'impossible',
                hints: ['One ticket costs £7.', 'Nine tickets must cost more than £7.', '9 × 7 = 63.'],
                breakdown: ['9 × 7 = 63', 'Total should be £63', '£6.30 is 10 times too small', 'Likely mistake: decimal point error'],
              },
              {
                scenario: 'A notebook costs £2.75. Jay buys 6. Estimate: 6 × £3 ≈ £18.',
                display: '£16.50',
                answer: 'possible',
                hints: ['Estimate: 6 × £3 = £18.', '£16.50 is close to £18.'],
                breakdown: ['6 × £2.75 = £16.50', '£16.50 is close to the £18 estimate', 'Sensible answer ✓'],
              },
              {
                scenario: 'A rectangle is 12 cm by 5 cm. The calculator shows the area.',
                display: '0.6 cm²',
                answer: 'impossible',
                hints: ['Area = length × width.', '12 × 5 = ?'],
                breakdown: ['12 × 5 = 60', '0.6 is far too small', 'Likely decimal point error'],
              },
            ],
          },
        ],
      },
      {
        label: 'Exam Practice',
        kicker: 'Exam Style',
        heading: 'Exam Practice',
        sub: 'Answer the questions. Get feedback on method, not just the final answer.',
        blocks: [
          { type: 'read', label: '📝 Why This Matters', text: 'Used to turn practice into <strong>marks</strong>. Method matters as much as the answer.' },
          {
            type: 'boss',
            tier: '🟢',
            label: 'Q1 — Number Line',
            question: 'Calculate: −6 + 14',
            markPoints: [
              'Answer: 8',
              'Method: start at −6, move right 14',
              'Award 1 mark for correct answer',
            ],
          },
          {
            type: 'boss',
            tier: '🟡',
            label: 'Q2 — BIDMAS',
            question: 'Calculate: 10 + 2 × 5',
            markPoints: [
              'Answer: 20',
              'Method: multiplication first — 2 × 5 = 10, then 10 + 10 = 20',
              'Common error: adding first gives 12 × 5 = 60 (wrong)',
              'Award 1 mark for correct answer with correct order shown',
            ],
          },
          {
            type: 'boss',
            tier: '🔴',
            label: 'Q3 — Estimation (2 marks)',
            question: 'A student calculates: 302 × 19 = 5738. Use estimation to decide whether this is sensible. Show your working.',
            markPoints: [
              '1 mark: estimate shown — 300 × 20 = 6000 (or equivalent)',
              '1 mark: conclusion — 5738 is close to 6000 so the answer is sensible',
              'Must show the estimate, not just say yes',
            ],
          },
        ],
      },
      {
        label: 'Final Rewind',
        kicker: 'Retrieval',
        heading: 'Final Rewind',
        sub: 'Strong maths comes from retrieval, not rereading.',
        blocks: [
          { type: 'read', label: '🔁 Why This Matters', text: 'Retrieval practice <strong>builds long-term memory</strong> faster than re-reading notes.' },
          {
            type: 'quiz',
            question: 'Adding on a number line moves:',
            options: [
              { text: 'left', correct: false },
              { text: 'right', correct: true },
              { text: 'nowhere', correct: false },
            ],
            explanation: 'Adding always moves right on the number line.',
          },
          {
            type: 'quiz',
            question: 'Subtracting moves:',
            options: [
              { text: 'left', correct: true },
              { text: 'right', correct: false },
              { text: 'up', correct: false },
            ],
            explanation: 'Subtracting always moves left on the number line.',
          },
          {
            type: 'quiz',
            question: 'What happens first in: 3 + 5 × 2?',
            options: [
              { text: '3 + 5', correct: false },
              { text: '5 × 2', correct: true },
              { text: '3 × 2', correct: false },
            ],
            explanation: 'Multiplication before addition — BIDMAS.',
          },
          {
            type: 'quiz',
            question: 'Why should you estimate before using a calculator?',
            options: [
              { text: 'To make the answer exactly right', correct: false },
              { text: 'To check if the answer is sensible', correct: true },
              { text: 'Calculators don\'t need checking', correct: false },
            ],
            explanation: 'Estimation catches impossible answers — decimal errors, wrong operations, misread displays.',
          },
          { type: 'keypoint', text: '<strong>Module complete.</strong> You now have the survival tools: move on a number line · follow BIDMAS · estimate before trusting answers.' },
        ],
      },
    ],
  },

  // ── Maths Module 2 ────────────────────────────────────────────────────────
  {
    id: 'math2',
    subject: 'Maths',
    number: 2,
    title: 'Fraction Foundations',
    subtitle: 'Numerator, denominator, equivalent fractions',
    era: 'Foundation',
    icon: '🍕',
    color: '#4B90FF',
    colorLight: 'rgba(75,144,255,.12)',
    hook: {
      scenario: {
        location: 'Any maths lesson',
        hint: 'A student sees 1/10 on the paper. They think it\'s bigger than 1/2 because 10 > 2.',
      },
      statement: 'A bigger denominator means a bigger fraction.',
      isTrue: false,
      wrongFeedback: 'Think about slicing a pizza — more slices means each slice gets smaller, not bigger.',
      correctFeedback: '1/2 is bigger than 1/10. The denominator tells you piece size, not fraction size.',
      loadingText: 'Let\'s see why the bottom number is about piece size…',
      bigQuestion: 'So what does the denominator actually tell us?',
      revealHeader: 'Bigger denominator = smaller pieces.',
      revealVisual: 'denominatorBars',
      revealItems: [
        {
          emoji: '🍕',
          label: 'Denominator = piece size',
          detail: '1/2 has 2 pieces — each is huge. 1/10 has 10 pieces — each is tiny. Bigger denominator means more cuts, not more pizza.',
          color: '#4B90FF',
          bg: 'rgba(75,144,255,.08)',
        },
        {
          emoji: '📐',
          label: 'More cuts = tinier pieces',
          detail: 'Cutting a pizza into 10 slices makes each slice smaller than cutting into 2. The total pizza hasn\'t changed.',
          color: '#4B90FF',
          bg: 'rgba(75,144,255,.08)',
        },
        {
          emoji: '⚠️',
          label: 'The common trap',
          detail: 'Students see 10 and think "bigger number = bigger fraction." That\'s the trap. 10 just means 10 tinier pieces.',
          color: '#FF6B6B',
          bg: 'rgba(255,107,107,.08)',
        },
      ],
      punchline: 'The denominator is the piece size. Bigger denominator = smaller pieces.',
    },
    intro: {
      learningGoals: [
        'Read any fraction using numerator and denominator',
        'Understand why bigger denominators mean smaller pieces',
        'See that different fractions can show the same amount',
        'Simplify fractions without changing their value',
      ],
    },
    screens: [
      // Page 2 — What You'll Learn
      {
        label: 'Overview',
        kicker: 'Module Overview',
        heading: 'Fractions are sharing.',
        sub: 'They tell you how many equal parts exist — and how many are selected.',
        blocks: [
          {
            type: 'read',
            label: '🧠 Why This Matters',
            text: 'Fractions unlock <strong>percentages</strong>, <strong>ratio</strong> and <strong>algebra</strong> later. Everything connects back to this.',
          },
          {
            type: 'flipcards',
            cards: [
              {
                icon: '🔢',
                front: 'Numerator vs denominator',
                back: 'Top = selected parts. Bottom = total equal parts.',
                color: '#4B90FF',
              },
              {
                icon: '🔄',
                front: 'Equivalent fractions',
                back: 'Different fractions can show the same amount.',
                color: '#38D27A',
              },
              {
                icon: '✂️',
                front: 'Simplifying',
                back: 'Shrink the numbers without changing the amount.',
                color: '#F5B700',
              },
              {
                icon: '📏',
                front: 'Fraction size',
                back: 'Fractions are easier when you picture the pieces.',
                color: '#FF6B6B',
              },
            ],
          },
        ],
      },

      // Page 3 — Numerator & Denominator
      {
        label: 'The Parts',
        kicker: 'Core Skill 1',
        heading: 'The denominator splits. The numerator selects.',
        sub: 'Denominator first — it creates the equal pieces. Then numerator selects from them.',
        blocks: [
          {
            type: 'read',
            label: '🍫 Why This Matters',
            text: 'These words appear in <strong>every</strong> fraction question. Knowing them by sight saves time under pressure.',
          },
          {
            type: 'fracbar',
            fraction: { num: 3, den: 5 },
            quiz: {
              q: 'What does the denominator tell us?',
              options: ['selected parts', 'total equal parts', 'the biggest number'],
              correct: 1,
              explanation: 'The denominator tells us how many equal pieces the whole was split into.',
              hints: [
                'Look at the bottom number.',
                'The whole was split into this many pieces.',
                'The denominator shows total equal parts.',
              ],
            },
          },
        ],
      },

      // Page 4 — Fill In The Blanks
      {
        label: 'Rules',
        kicker: 'Active Recall',
        heading: 'Complete the fraction rules.',
        sub: 'Lock in the language before moving to visuals.',
        blocks: [
          {
            type: 'read',
            label: '🎯 Why This Matters',
            text: 'These words appear constantly in GCSE maths. <strong>Fluency with the terms</strong> stops you losing easy marks.',
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'The denominator tells us the total',
                after: 'parts.',
                answer: 'equal',
                hints: [
                  'All pieces must be the same size.',
                  'The whole is split into parts of identical size.',
                ],
              },
              {
                before: 'The numerator tells us the',
                after: 'parts.',
                answer: 'selected',
                hints: [
                  'It counts how many pieces are chosen.',
                  'Think: how many pieces are shaded?',
                ],
              },
              {
                before: 'A bigger denominator means',
                after: 'pieces.',
                answer: 'smaller',
                hints: [
                  'Think about slicing a pizza into more parts.',
                  'More slices means each slice gets…',
                ],
              },
              {
                before: '1/2 is bigger than 1/10 because the pieces are',
                after: '.',
                answer: 'larger',
                hints: [
                  '1/2 has only 2 pieces — each must be big.',
                  'Which pizza slice would you rather have: half, or one-tenth?',
                ],
              },
            ],
            correctMsg: 'Nice. You\'re learning to picture the fraction, not memorise it.',
            wrongMsg: 'Think visually. More denominator pieces means each piece shrinks.',
          },
        ],
      },

      // Page 5 — Equivalent Fractions
      {
        label: 'Equivalent',
        kicker: 'Core Skill 2',
        heading: 'Same amount. Different fraction.',
        sub: 'Equivalent fractions look different but show the same amount.',
        blocks: [
          {
            type: 'read',
            label: '🔄 Why This Matters',
            text: 'Used before <strong>adding fractions</strong> and converting to <strong>percentages</strong>. This is the key idea behind both.',
          },
          {
            type: 'fractionsplitter',
            predictionPrompt: 'What do you think will happen if we split every piece again?',
            levels: [
              { num: 1, den: 2 },
              { num: 2, den: 4 },
              { num: 4, den: 8 },
            ],
            examTip: 'The denominator is the piece size. Changing it changes piece size, not the amount.',
          },
        ],
      },

      // Page 6 — Short Quiz
      {
        label: 'Quiz',
        kicker: 'Practice',
        heading: 'Test yourself.',
        sub: 'Three levels. Work through them in order.',
        blocks: [
          {
            type: 'read',
            label: '⚡ Why This Matters',
            text: 'Quick retrieval builds <strong>long-term memory</strong> faster than rereading.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Warm Up', emoji: '🟢',
                questions: [
                  {
                    q: 'Which fraction is bigger?',
                    options: ['1/2', '1/8', 'They are equal'],
                    correct: 0,
                    feedback: 'Halves are larger pieces than eighths. 1/2 > 1/8.',
                    hint: 'Imagine cutting a pizza into 2 vs 8 slices. Which slice is bigger?',
                  },
                  {
                    q: 'What does denominator mean?',
                    options: ['selected parts', 'total equal parts', 'the biggest number'],
                    correct: 1,
                    feedback: 'Denominator = total equal parts the whole is split into.',
                    hint: 'It\'s the bottom number. It tells you how many pieces exist.',
                  },
                  {
                    q: 'Which fractions match?',
                    options: ['1/2 and 2/4', '1/2 and 1/4', '1/3 and 3/4'],
                    correct: 0,
                    feedback: '1/2 = 2/4. Both show the same amount — just split differently.',
                    hint: 'Think: which pair would shade the same amount on a fraction bar?',
                  },
                ],
              },
              {
                label: 'Challenge', emoji: '🟡',
                questions: [
                  {
                    q: 'Simplify: 6/8',
                    options: ['3/4', '6/4', '2/4'],
                    correct: 0,
                    feedback: '6÷2 = 3 and 8÷2 = 4. Divide both by 2 → 3/4.',
                    hint: 'What number divides into both 6 and 8?',
                  },
                  {
                    q: 'Which are equivalent?',
                    options: ['3/5 and 6/10', '3/5 and 3/10', '3/5 and 5/3'],
                    correct: 0,
                    feedback: '3×2=6 and 5×2=10. Both multiplied by 2 → 6/10 = 3/5.',
                    hint: 'Try multiplying numerator and denominator of 3/5 by 2.',
                  },
                  {
                    q: 'What happens when the denominator gets bigger?',
                    options: ['Pieces get smaller', 'Pieces get bigger', 'The fraction gets bigger'],
                    correct: 0,
                    feedback: 'More equal parts = each part is smaller. The whole hasn\'t changed.',
                    hint: 'Think about cutting something into more and more slices.',
                  },
                ],
              },
              {
                label: 'Boss Mode', emoji: '🔴',
                questions: [
                  {
                    q: 'Why does 1/2 = 2/4?',
                    options: [
                      'The pieces were split again but the amount stayed the same',
                      'Both numbers doubled so the fraction doubled',
                      'The denominator is bigger so it must be bigger',
                    ],
                    correct: 0,
                    feedback: 'Splitting pieces without changing the amount — that\'s the whole idea of equivalent fractions.',
                    hint: 'Picture a bar. Split each piece in half. Same shaded amount?',
                  },
                  {
                    q: 'Spot the mistake: 6/8 → 6/4',
                    options: [
                      'Only the denominator changed — both must divide by same number',
                      'The denominator should stay the same',
                      'You should multiply, not divide',
                    ],
                    correct: 0,
                    feedback: 'Simplifying means dividing BOTH numerator and denominator by the same number. Changing only one changes the value.',
                    hint: 'What happened to the numerator (6)? Did it change?',
                  },
                  {
                    q: 'Which is larger: 3/4 or 5/8?',
                    options: ['3/4', '5/8', 'They are equal'],
                    correct: 0,
                    feedback: '3/4 = 6/8. Compare: 6/8 > 5/8. So 3/4 is larger.',
                    hint: 'Convert 3/4 so both fractions have the same denominator.',
                  },
                ],
              },
            ],
          },
        ],
      },

      // Page 7 — True/False Checkpoint
      {
        label: 'Checkpoint',
        kicker: 'Checkpoint',
        heading: 'True or False?',
        sub: 'Catch fraction logic errors before the exam does.',
        blocks: [
          {
            type: 'read',
            label: '🚨 Why This Matters',
            text: 'Used to catch <strong>impossible fraction logic</strong> — the kind that loses marks silently.',
          },
          {
            type: 'tfcheckpoint',
            statement: '6/8 = 6/4',
            isTrue: false,
            revealHeader: 'Only the denominator changed.',
            revealSub: 'That changes the piece size AND the amount. Both numbers must change together.',
            breakdown: [
              '6/8 = 0.75 (three quarters of the whole)',
              '6/4 = 1.5 (one and a half — bigger than the whole!)',
              'Changing only the denominator changes the value entirely.',
            ],
            wrongDisplay: '6/4 = 1.5 ✗',
            rightDisplay: '6/8 = 3/4 ✓',
          },
        ],
      },

      // Page 8 — Fraction Builder Lab
      {
        label: 'Lab',
        kicker: 'Apply',
        heading: 'Build the same amount.',
        sub: 'Use the multiplier to create equivalent fractions.',
        blocks: [
          {
            type: 'read',
            label: '🧩 Why This Matters',
            text: 'This builds <strong>real fraction understanding</strong>, not memorised steps. You\'ll use this in simplifying and adding fractions.',
          },
          {
            type: 'fractionlab',
            tasks: [
              {
                label: 'Turn 1/2 into 2/4',
                from: { num: 1, den: 2 },
                to: { num: 2, den: 4 },
              },
              {
                label: 'Turn 2/3 into 4/6',
                from: { num: 2, den: 3 },
                to: { num: 4, den: 6 },
              },
              {
                label: 'Make a fraction equal to 1/2 using ×3',
                from: { num: 1, den: 2 },
                to: { num: 3, den: 6 },
              },
            ],
            hints: [
              'Multiply both the top AND bottom by the same number.',
              'The whole amount must stay identical — only the piece size changes.',
              'If ×2 doesn\'t work, try ×3 or ×4.',
            ],
          },
        ],
      },

      // Page 9 — Exam Practice
      {
        label: 'Exam',
        kicker: 'Exam Practice',
        heading: 'Exam Practice.',
        sub: 'Method matters as much as the answer.',
        blocks: [
          {
            type: 'read',
            label: '📝 Why This Matters',
            text: 'Used to turn understanding into <strong>GCSE marks</strong>. Knowing the method is what examiners reward.',
          },
          {
            type: 'examscored',
            questions: [
              {
                q: 'Simplify: 8/12',
                marks: 2,
                options: ['2/3', '4/6', '4/12', '8/6'],
                correct: 0,
                feedback: {
                  0: '✓ Both divided by 4 (the HCF). That\'s full simplification. (2 marks)',
                  1: 'You simplified partly — 4/6 still divides by 2. Try again: 4÷2=2, 6÷2=3 → 2/3. (1 mark)',
                  2: 'Only the denominator changed — both must divide by the same number.',
                  3: 'The denominator should get smaller when simplifying, not larger.',
                },
                modelAnswer: 'Find HCF of 8 and 12 (= 4). Divide both: 8÷4 = 2, 12÷4 = 3 → answer: 2/3',
              },
              {
                q: 'Which fraction is equivalent to 3/5?',
                marks: 1,
                options: ['6/10', '3/10', '5/3', '6/5'],
                correct: 0,
                feedback: {
                  0: '✓ 3×2=6 and 5×2=10. Same multiplier applied to both. (1 mark)',
                  1: 'Only the denominator was multiplied by 2. Both must multiply by the same number.',
                  2: 'That\'s the fraction flipped upside down — a completely different value.',
                  3: 'The numerator multiplied but the denominator didn\'t. Both must change together.',
                },
                modelAnswer: 'Multiply both by 2: 3×2/5×2 = 6/10. Check: 3/5 = 0.6 and 6/10 = 0.6 ✓',
              },
              {
                q: 'Explain why 1/2 = 2/4.',
                marks: 2,
                options: [
                  'The pieces were split again and the amount stayed the same',
                  'The numbers doubled so the fraction doubled',
                  'The denominator is bigger so it must be bigger',
                  'We added 1 to the top and 2 to the bottom',
                ],
                correct: 0,
                feedback: {
                  0: '✓ Splitting pieces without changing the amount — that\'s equivalent fractions. (2 marks)',
                  1: 'Both numbers doubled but the VALUE stayed the same — because the pieces were split too.',
                  2: 'Bigger denominator means smaller pieces, not bigger fraction.',
                  3: 'Adding different numbers to top and bottom changes the value — that\'s not simplifying or equivalence.',
                },
                modelAnswer: 'Both numerator and denominator were multiplied by 2. Each piece halved in size, but twice as many were selected — the shaded amount stays the same.',
              },
            ],
            examTip: 'Shrink the numbers, not the value. Simplifying changes the fraction label, not the amount.',
          },
        ],
      },

      // Page 10 — Final Rewind
      {
        label: 'Rewind',
        kicker: 'Retrieval',
        heading: 'Final Rewind.',
        sub: 'Strong maths comes from retrieval, not rereading.',
        blocks: [
          {
            type: 'read',
            label: '🔁 Why This Matters',
            text: 'Retrieval practice <strong>builds long-term memory</strong> faster than rereading notes.',
          },
          {
            type: 'quiz',
            question: 'What does denominator mean?',
            options: [
              { text: 'selected parts', correct: false },
              { text: 'total equal parts', correct: true },
              { text: 'the bottom number only', correct: false },
            ],
            explanation: 'Denominator = total equal parts the whole is split into. It defines the piece size.',
          },
          {
            type: 'quiz',
            question: 'Why are 1/2 and 2/4 equal?',
            options: [
              { text: 'Same amount, smaller pieces', correct: true },
              { text: 'The numbers doubled so the fraction doubled', correct: false },
              { text: 'Both have even numbers', correct: false },
            ],
            explanation: 'The pieces were halved in size but there are twice as many selected — the amount is identical.',
          },
          {
            type: 'quiz',
            question: 'What happens when the denominator gets bigger?',
            options: [
              { text: 'Pieces get smaller', correct: true },
              { text: 'Pieces get bigger', correct: false },
              { text: 'The fraction gets bigger', correct: false },
            ],
            explanation: 'More equal parts means each part must be smaller. The whole hasn\'t changed.',
          },
          {
            type: 'quiz',
            question: 'When simplifying a fraction, what changes?',
            options: [
              { text: 'Numbers change, amount stays same', correct: true },
              { text: 'Amount changes, numbers stay same', correct: false },
              { text: 'Both the numbers and amount change', correct: false },
            ],
            explanation: 'Simplifying changes the labels (numbers) but not the value. 6/8 and 3/4 are the same amount.',
          },
          {
            type: 'keypoint',
            text: '<strong>Module complete.</strong> You now understand: numerator vs denominator · equivalent fractions · simplifying · fraction size visually.',
          },
        ],
      },
    ],
  },

  // ── Sociology Module 1 ────────────────────────────────────────────────────
  {
    id: 'soc1',
    subject: 'Sociology',
    number: 1,
    title: 'What Even is Sociology?',
    subtitle: 'Culture, norms, values and socialisation',
    era: 'AQA GCSE',
    icon: '👥',
    color: '#D96030',
    colorLight: 'rgba(217,96,48,.12)',
    hook: {
      atmosphericOpener: {
        heading: 'YOU ARE SURROUNDED BY RULES.',
        sub: 'Most of them are invisible.',
        cta: 'START INVESTIGATING',
      },
      scenario: {
        location: 'Any classroom',
        hint: 'A child raised completely alone from birth. No family. No school. No contact with anyone.',
      },
      statement: 'If a baby grew up completely alone, they would naturally know how to behave in society.',
      isTrue: false,
      wrongFeedback: 'Think about it — where do we actually learn how to shake hands, queue, say please, go to school?',
      correctFeedback: 'Correct. Humans are not born understanding society. We learn behaviour from other people.',
      loadingText: 'Sociology studies exactly how this learning happens…',
      bigQuestion: 'So how DO humans learn to behave in society?',
      revealHeader: 'Humans are shaped by society.',
      revealItems: [
        {
          emoji: '🧠',
          label: 'We are not born socialised',
          detail: 'A child raised without social contact would not know how to speak, queue, shake hands or behave in school.',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
        {
          emoji: '👨‍👩‍👧',
          label: 'We learn from other people',
          detail: 'Family, school, friends and media all teach us the rules of society — usually without us even noticing.',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
        {
          emoji: '🔍',
          label: 'Sociology studies this process',
          detail: 'Sociology looks for patterns in human behaviour. Why do people in different societies behave differently? What invisible rules govern us?',
          color: '#D96030',
          bg: 'rgba(217,96,48,.08)',
        },
      ],
      punchline: 'Humans are shaped by society. Sociology studies how and why.',
    },
    intro: {
      learningGoals: [
        'Define sociology, culture, norms and values',
        'Explain socialisation and its agencies',
        'Distinguish primary from secondary socialisation',
        'Identify and apply sanctions to real scenarios',
      ],
    },
    screens: [
      // Screen 1 — What Is Sociology?
      {
        label: 'What is Sociology?',
        kicker: 'Core Concept',
        heading: 'Sociology studies human behaviour in society.',
        sub: 'Sociologists look for patterns — why do people behave the way they do?',
        blocks: [
          {
            type: 'read',
            label: '🔍 Why This Matters',
            text: 'Every other topic in GCSE Sociology builds on this. <strong>Humans are shaped by society</strong> — sociology asks how.',
          },
          {
            type: 'topicpicker',
            question: 'Which topics would interest a sociologist? Tap all that apply.',
            items: [
              { label: 'Crime rates', correct: true },
              { label: 'Gender behaviour', correct: true },
              { label: 'School achievement', correct: true },
              { label: 'Volcanoes', correct: false },
              { label: 'Friendship groups', correct: true },
              { label: 'Weather systems', correct: false },
              { label: 'Social media trends', correct: true },
              { label: 'Tectonic plates', correct: false },
            ],
            explanation: 'Sociology focuses on people, behaviour and society. Natural phenomena like volcanoes and weather are studied by scientists, not sociologists.',
          },
        ],
      },

      // Screen 2 — Culture
      {
        label: 'Culture',
        kicker: 'Key Term',
        heading: 'Culture is a society\'s way of life.',
        sub: 'Different societies have different cultures. There is no single "normal."',
        blocks: [
          {
            type: 'read',
            label: '🌍 Why This Matters',
            text: 'Culture appears in almost every GCSE Sociology topic. You need to <strong>identify examples instantly</strong>.',
          },
          {
            type: 'flipcards',
            cards: [
              {
                icon: '🍜',
                front: 'Food customs',
                back: 'In Japan, slurping noodles shows appreciation. In the UK, it\'s considered rude. Same action — different cultural meaning.',
                color: '#D96030',
              },
              {
                icon: '🙏',
                front: 'Religious rituals',
                back: 'Prayer, worship, fasting, celebrations — all vary between cultures. Each reflects a society\'s shared beliefs.',
                color: '#D96030',
              },
              {
                icon: '👗',
                front: 'Clothing and dress',
                back: 'From school uniforms to traditional dress — what you wear signals your culture, group and identity.',
                color: '#D96030',
              },
              {
                icon: '💬',
                front: 'Language and communication',
                back: 'Even within English: slang, dialect, formality levels all vary. Language carries cultural identity.',
                color: '#D96030',
              },
            ],
          },
          {
            type: 'keypoint',
            text: '📌 <strong>Exam Master</strong>: If asked to "identify one example of culture" — give ONE clear example only. Do not over-explain.',
          },
        ],
      },

      // Screen 3 — Norms vs Values
      {
        label: 'Norms & Values',
        kicker: 'Key Terms',
        heading: 'Norms are rules. Values are beliefs.',
        sub: 'Students often confuse these. The difference is critical for AQA questions.',
        blocks: [
          {
            type: 'read',
            label: '🎯 Why This Matters',
            text: '<strong>Norms</strong> and <strong>values</strong> appear in nearly every sociology question. Mix them up and you lose marks.',
          },
          {
            type: 'colsort',
            question: 'Sort each into the correct column.',
            columns: [
              { label: 'VALUES\nWhat society believes is important', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
              { label: 'NORMS\nExpected behaviour', color: '#D96030', bg: 'rgba(217,96,48,.07)' },
            ],
            items: [
              { label: 'Honesty', col: 0, explanation: 'Honesty is a VALUE — society believes it is morally important.' },
              { label: 'Saying thank you', col: 1, explanation: 'Saying thank you is a NORM — it is expected behaviour in social situations.' },
              { label: 'Hard work', col: 0, explanation: 'Hard work is a VALUE — it is widely held as something society believes matters.' },
              { label: 'Queuing', col: 1, explanation: 'Queuing is a NORM — it is an unwritten rule of expected behaviour in the UK.' },
              { label: 'Respecting elders', col: 0, explanation: 'Respecting elders is a VALUE — it reflects a moral belief about how to treat people.' },
              { label: 'Removing hats indoors', col: 1, explanation: 'Removing hats indoors is a NORM — a behavioural expectation in certain contexts.' },
            ],
            explanation: 'Values = what society believes is right. Norms = how people are expected to behave. Remember: beliefs vs behaviour.',
          },
          {
            type: 'keypoint',
            text: '🧠 <strong>Memory anchor:</strong> Values are beliefs. Norms are rules. "Society <em>believes</em> in honesty" — that\'s a value. "People <em>are expected</em> to queue" — that\'s a norm.',
          },
        ],
      },

      // Screen 4 — Fill in the Blanks
      {
        label: 'Key Terms',
        kicker: 'Active Recall',
        heading: 'Lock in the language.',
        sub: 'Sociology marks depend on using the right words precisely.',
        blocks: [
          {
            type: 'read',
            label: '🎯 Why This Matters',
            text: 'These exact terms appear in <strong>every AQA Sociology paper</strong>. Getting them wrong loses you marks even when you understand the concept.',
          },
          {
            type: 'fillblanks',
            sentences: [
              {
                before: 'Sociology studies human',
                after: 'in society.',
                answer: 'behaviour',
                hints: ['It\'s what people do — their actions and actions.', 'Sociologists look for patterns in how people act.'],
              },
              {
                before: 'Sociologists look for',
                after: 'in behaviour.',
                answer: 'patterns',
                hints: ['They don\'t study one person — they look for trends across groups.', 'Repeated trends across society.'],
              },
              {
                before: 'Culture is a society\'s',
                after: 'of life.',
                answer: 'way',
                hints: ['The full phrase is "a society\'s ___ of life."', 'Think: lifestyle, customs, traditions — summed up in one word.'],
              },
              {
                before: 'Norms are the',
                after: 'rules of society.',
                answer: 'unwritten',
                hints: ['They\'re not laws — nobody wrote them down officially.', 'Invisible, informal, expected.'],
              },
            ],
            correctMsg: 'Good. These terms will appear repeatedly throughout your exam.',
            wrongMsg: 'Think about what the term actually means — then find the word that fits.',
          },
        ],
      },

      // Screen 5 — Invisible Rules / Sanctions
      {
        label: 'Invisible Rules',
        kicker: 'Norms + Deviance',
        heading: 'Breaking the invisible rules.',
        sub: 'Most social rules are never written down — but breaking them has real consequences.',
        blocks: [
          {
            type: 'read',
            label: '🚨 Why This Matters',
            text: 'Understanding <strong>norms</strong> and <strong>sanctions</strong> is essential for explaining social control in your exam answers.',
          },
          {
            type: 'colsort',
            question: 'Is this illegal, or does it just break social norms?',
            columns: [
              { label: 'ILLEGAL\nBreaks the law', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
              { label: 'BREAKS NORMS\nSocially unacceptable', color: '#D96030', bg: 'rgba(217,96,48,.07)' },
            ],
            items: [
              { label: 'Staring at someone in a lift', col: 1, explanation: 'Staring in a lift breaks a social norm — it\'s awkward and rude, but not against the law.' },
              { label: 'Pyjamas at a wedding', col: 1, explanation: 'Wearing pyjamas to a wedding breaks dress-code norms, but isn\'t illegal.' },
              { label: 'Shoplifting', col: 0, explanation: 'Shoplifting is illegal — it breaks the law and can result in arrest.' },
              { label: 'Queue jumping', col: 1, explanation: 'Queue jumping is socially unacceptable in the UK — it breaks the norm of fair waiting.' },
              { label: 'Talking loudly in a cinema', col: 1, explanation: 'This breaks the norm of quiet respect during a film — very antisocial, but not illegal.' },
              { label: 'Assault', col: 0, explanation: 'Assault is a criminal offence — it breaks both legal and social rules.' },
            ],
            explanation: 'Norms are social rules — not laws. Breaking norms can still lead to negative sanctions (disapproval, exclusion) even without legal consequences.',
          },
        ],
      },

      // Screen 6 — Sanctions
      {
        label: 'Sanctions',
        kicker: 'Key Term',
        heading: 'How society controls behaviour.',
        sub: 'Positive sanctions reward conformity. Negative sanctions punish deviance.',
        blocks: [
          {
            type: 'read',
            label: '⚖️ Why This Matters',
            text: 'Sanctions are how society enforces <strong>norms and values</strong>. AQA regularly asks for examples of both types.',
          },
          {
            type: 'colsort',
            question: 'Positive or negative sanction?',
            columns: [
              { label: 'POSITIVE SANCTIONS\nRewards for following norms', color: '#4DFF88', bg: 'rgba(77,255,136,.07)' },
              { label: 'NEGATIVE SANCTIONS\nPunishments for breaking norms', color: '#FF5D73', bg: 'rgba(255,93,115,.07)' },
            ],
            items: [
              { label: 'Detention', col: 1, explanation: 'Detention is a negative sanction — a formal punishment for breaking school rules.' },
              { label: 'Praise from teacher', col: 0, explanation: 'Praise is a positive sanction — a reward that reinforces good behaviour.' },
              { label: 'Promotion at work', col: 0, explanation: 'Promotion is a positive sanction — rewarding someone for following workplace norms.' },
              { label: 'Prison', col: 1, explanation: 'Prison is a formal negative sanction — the most serious legal punishment.' },
              { label: 'Applause', col: 0, explanation: 'Applause is an informal positive sanction — social approval for behaviour that meets expectations.' },
              { label: 'Fine', col: 1, explanation: 'A fine is a formal negative sanction — a financial penalty for breaking rules.' },
            ],
            explanation: 'Positive sanctions encourage behaviour. Negative sanctions discourage it. Both enforce the norms and values of society.',
          },
          {
            type: 'keypoint',
            text: '📌 <strong>Exam tip:</strong> Always say whether a sanction is formal (official, e.g. law) or informal (social, e.g. disapproval). This adds detail examiners reward.',
          },
        ],
      },

      // Screen 7 — Socialisation
      {
        label: 'Socialisation',
        kicker: 'Core Concept',
        heading: 'Socialisation: learning to belong.',
        sub: 'The process by which we learn society\'s norms and values.',
        blocks: [
          {
            type: 'read',
            label: '🧠 Why This Matters',
            text: 'Socialisation is one of the most frequently tested concepts in AQA Sociology. <strong>Every agency, norm and value links back to it.</strong>',
          },
          {
            type: 'keypoint',
            text: '🔑 <strong>Socialisation</strong> is the process through which individuals learn the norms, values and culture of their society. It begins at birth and continues throughout life.',
          },
          {
            type: 'tfcheckpoint',
            statement: 'Socialisation only happens during childhood.',
            isTrue: false,
            revealHeader: 'Socialisation is lifelong.',
            revealSub: 'While it is most intense in childhood, socialisation continues throughout life — at work, in relationships, through media.',
            breakdown: [
              'Primary socialisation: early childhood, mainly through family',
              'Secondary socialisation: continues throughout life via school, peers, media, religion, work',
              'Even adults are socialised into new roles (e.g. becoming a parent or starting a job)',
            ],
          },
        ],
      },

      // Screen 8 — Primary vs Secondary
      {
        label: 'Primary vs Secondary',
        kicker: 'AQA Favourite',
        heading: 'Two phases. Same process.',
        sub: 'AQA regularly asks students to distinguish these — make the difference automatic.',
        blocks: [
          {
            type: 'read',
            label: '📋 Why This Matters',
            text: 'The distinction between primary and secondary socialisation is tested <strong>almost every year</strong> at GCSE. Get it automatic.',
          },
          {
            type: 'colsort',
            question: 'Primary or secondary socialisation?',
            columns: [
              { label: 'PRIMARY\nEarly childhood — mainly family', color: '#F5B700', bg: 'rgba(245,183,0,.07)' },
              { label: 'SECONDARY\nLater — wider society', color: '#D96030', bg: 'rgba(217,96,48,.07)' },
            ],
            items: [
              { label: 'Parents teaching manners', col: 0, explanation: 'Teaching manners is primary socialisation — done by family in early childhood.' },
              { label: 'TikTok trends', col: 1, explanation: 'TikTok is media — a key agency of secondary socialisation.' },
              { label: 'Learning language at home', col: 0, explanation: 'Language acquisition in the home is classic primary socialisation.' },
              { label: 'School rules', col: 1, explanation: 'School is an agency of secondary socialisation — it operates outside the family.' },
              { label: 'Friendship group pressure', col: 1, explanation: 'Peers are a secondary socialisation agency — they influence behaviour beyond the family.' },
              { label: 'Parents reading bedtime stories', col: 0, explanation: 'Family activities in early childhood = primary socialisation.' },
              { label: 'Workplace behaviour', col: 1, explanation: 'Learning workplace norms as an adult is secondary socialisation.' },
            ],
            explanation: 'Primary = early + family. Secondary = later + wider society (school, peers, media, religion, work). This contrast is the key AQA distinction.',
          },
          {
            type: 'keypoint',
            text: '🎯 <strong>Exam structure:</strong> "Primary socialisation happens in early childhood, usually through the family. Secondary socialisation occurs later and is influenced by wider society, such as school, peers and media."',
          },
        ],
      },

      // Screen 9 — Agencies of Socialisation
      {
        label: 'Agencies',
        kicker: 'Core Concept',
        heading: 'Who shapes us?',
        sub: 'Agencies of socialisation are the groups and institutions that teach us norms and values.',
        blocks: [
          {
            type: 'read',
            label: '👥 Why This Matters',
            text: 'AQA asks you to name, describe and apply agencies of socialisation. <strong>Every agency here has appeared on past papers.</strong>',
          },
          {
            type: 'agencywheel',
            agencies: [
              {
                icon: '👨‍👩‍👧',
                label: 'Family',
                reveals: [
                  'First and most powerful agency of socialisation',
                  'Teaches language, manners, values and basic norms',
                  'Primary socialisation — shapes identity from birth',
                ],
                examNote: 'Family = primary socialisation. Always the starting point.',
              },
              {
                icon: '🏫',
                label: 'School',
                reveals: [
                  'Teaches formal rules, academic expectations and social skills',
                  'Hidden curriculum: punctuality, conformity, respect for authority',
                  'Key agency of secondary socialisation',
                ],
                examNote: 'School = secondary socialisation + hidden curriculum.',
              },
              {
                icon: '👫',
                label: 'Peers',
                reveals: [
                  'Friendship groups become influential in adolescence',
                  'Peer pressure shapes fashion, language, behaviour and values',
                  'Can reinforce or challenge family norms',
                ],
                examNote: 'Peers = powerful secondary agency, especially for teenagers.',
              },
              {
                icon: '📱',
                label: 'Media',
                reveals: [
                  'TV, social media, music and advertising all shape norms',
                  'Creates beauty standards, gender expectations, trends',
                  'Increasingly dominant secondary socialisation agent',
                ],
                examNote: 'Media = secondary; always include examples (social media, TV, advertising).',
              },
              {
                icon: '🕌',
                label: 'Religion',
                reveals: [
                  'Teaches moral values, community norms and identity',
                  'Varies in influence depending on family religiosity',
                  'Can reinforce traditional gender roles and moral codes',
                ],
                examNote: 'Religion = secondary agent; most powerful when embedded in family life.',
              },
            ],
          },
        ],
      },

      // Screen 10 — Applied Sociology
      {
        label: 'Apply It',
        kicker: 'Application',
        heading: 'Spot the sociology.',
        sub: 'Apply your knowledge to real-world scenarios — exactly what AQA expects.',
        blocks: [
          {
            type: 'read',
            label: '🔬 Why This Matters',
            text: 'GCSE Sociology requires <strong>application</strong> — connecting concepts to real situations. This is where marks are won or lost.',
          },
          {
            type: 'appliedscenario',
            scenarios: [
              {
                scenario: 'Jake has started swearing because his friendship group think it\'s funny and impressive. His parents are shocked — he never used to do this at home.',
                question: 'Which agency of socialisation is influencing Jake\'s behaviour?',
                options: [
                  'Family',
                  'Peer group',
                  'Media',
                  'Religion',
                ],
                correct: 1,
                feedback: 'Correct. Jake\'s peer group is socialising his behaviour. Friends are an agency of secondary socialisation — they influence language, norms and values, especially in adolescence.',
                followUp: {
                  q: 'How does this show the difference between primary and secondary socialisation?',
                  answer: 'Jake\'s family (primary socialisation) taught him different norms. His peer group (secondary socialisation) is now contradicting those — showing that secondary agencies can challenge or override primary ones.',
                },
              },
              {
                scenario: 'Aisha receives a school award in assembly for working hard all term. Her classmates applaud and her teacher praises her publicly.',
                question: 'What type of sanction is Aisha receiving?',
                options: [
                  'Formal negative sanction',
                  'Informal negative sanction',
                  'Formal positive sanction',
                  'Informal positive sanction',
                ],
                correct: 2,
                feedback: 'The school award is a formal positive sanction — it\'s an official recognition (formal) that rewards behaviour following norms (positive). The applause is also informal positive reinforcement.',
                followUp: {
                  q: 'How does this sanction reinforce norms and values?',
                  answer: 'The sanction rewards Aisha for following the school\'s norm of hard work, which also reflects the wider social value placed on academic effort. This encourages other students to conform to the same expectations.',
                },
              },
              {
                scenario: 'In a traditional community, women are expected to dress modestly and take primary responsibility for childcare. Young women who deviate from this face disapproval from family and community members.',
                question: 'Which sociological concepts best explain what is happening here?',
                options: [
                  'Primary socialisation and formal sanctions',
                  'Culture, norms and negative sanctions',
                  'Secondary socialisation and positive sanctions',
                  'Values and formal sanctions',
                ],
                correct: 1,
                feedback: 'The community has its own culture with specific norms around gender behaviour. Women who deviate face informal negative sanctions (disapproval, exclusion). This shows how culture and norms are enforced through social control.',
                followUp: {
                  q: 'A sociologist would say behaviour here is socially constructed. What does this mean?',
                  answer: 'Socially constructed means the behaviour (women\'s roles) is not natural or inevitable — it has been created and maintained by society\'s norms and values over time. Different societies have very different norms about gender.',
                },
              },
            ],
          },
        ],
      },

      // Screen 11 — Exam Practice
      {
        label: 'Exam Practice',
        kicker: 'Exam Practice',
        heading: 'Exam Practice.',
        sub: 'Method and terminology matter as much as the answer.',
        blocks: [
          {
            type: 'read',
            label: '📝 Why This Matters',
            text: 'AQA rewards <strong>sociology terminology</strong>, <strong>clear examples</strong> and <strong>precise explanation</strong>. Generic answers lose marks.',
          },
          {
            type: 'examscored',
            questions: [
              {
                q: 'Identify one agency of secondary socialisation.',
                marks: 1,
                options: ['School', 'Family', 'Birth hospital', 'Genetics'],
                correct: 0,
                feedback: {
                  0: '✓ School is a key agency of secondary socialisation. (1 mark)',
                  1: 'Family is primary socialisation, not secondary. Secondary agencies operate outside the family.',
                  2: 'A birth hospital is not an agency of socialisation.',
                  3: 'Genetics are biological, not social. Sociology focuses on social influences.',
                },
                modelAnswer: 'School is an agency of secondary socialisation. (Media, peers or religion would also be accepted.)',
              },
              {
                q: 'Which statement best describes a social norm?',
                marks: 1,
                options: [
                  'A society\'s moral belief about what is important',
                  'An expected way of behaving in society',
                  'A legal rule enforced by the government',
                  'A personal preference about how to act',
                ],
                correct: 1,
                feedback: {
                  0: 'That\'s a value — what society believes is morally important. Norms are about behaviour, not beliefs.',
                  1: '✓ A norm is an expected way of behaving. It\'s a social rule, not necessarily a legal one. (1 mark)',
                  2: 'That\'s a law. Norms are social rules — breaking them leads to social sanctions, not necessarily legal ones.',
                  3: 'Personal preferences are not norms. Norms are shared social expectations, not individual choices.',
                },
                modelAnswer: 'A norm is an expected way of behaving in society — an unwritten social rule, such as queuing or saying thank you.',
              },
              {
                q: 'Describe one way schools socialise children. [2 marks]',
                marks: 2,
                options: [
                  'Schools teach children rules through rewards and punishments, reinforcing norms like punctuality and respect for authority.',
                  'Schools teach children reading and writing.',
                  'Schools are buildings where children go during the day.',
                  'Children learn from their parents before they go to school.',
                ],
                correct: 0,
                feedback: {
                  0: '✓ Identifies the mechanism (rules/sanctions), gives examples (punctuality, authority) and links to socialisation. (2 marks)',
                  1: 'This describes teaching, not socialisation. You need to explain how school teaches norms and values, not just academic skills.',
                  2: 'This is a description, not a sociological explanation. No sociology terminology used.',
                  3: 'This describes family (primary) socialisation, not school. Answer the question about school.',
                },
                modelAnswer: 'Schools socialise children by teaching them rules through sanctions — for example, detention for lateness reinforces the norm of punctuality. The hidden curriculum also teaches children to respect authority and conform to expectations.',
              },
            ],
            examTip: 'Always include: (1) the sociology term, (2) an example, (3) an explanation of how it works. This structure gets full marks.',
          },
        ],
      },

      // Screen 12 — Final Retrieval
      {
        label: 'Final Retrieval',
        kicker: 'Retrieval',
        heading: 'Final Retrieval Challenge.',
        sub: 'No topic headings. Mix everything. This is how real exams feel.',
        blocks: [
          {
            type: 'read',
            label: '🔁 Why This Matters',
            text: 'Mixing topics in retrieval is <strong>more effective</strong> than reviewing by subject. This is how AQA structures its papers.',
          },
          {
            type: 'tieredquiz',
            tiers: [
              {
                label: 'Definitions', emoji: '🟢',
                questions: [
                  {
                    q: 'What is socialisation?',
                    options: [
                      'The process of learning society\'s norms and values',
                      'Going out with friends',
                      'Teaching children to read',
                      'Following the law',
                    ],
                    correct: 0,
                    feedback: 'Socialisation is the process through which individuals learn the norms, values and culture of their society.',
                    hint: 'Think: how do we learn the invisible rules of society?',
                  },
                  {
                    q: 'Which of these is a positive sanction?',
                    options: ['Prison sentence', 'Detention', 'Public praise', 'A fine'],
                    correct: 2,
                    feedback: 'Praise is a positive sanction — a reward for conforming to norms.',
                    hint: 'Positive = reward. Which option rewards good behaviour?',
                  },
                  {
                    q: 'Peers are an agency of which type of socialisation?',
                    options: ['Primary', 'Secondary', 'Both equally', 'Neither'],
                    correct: 1,
                    feedback: 'Peers are a secondary socialisation agency — they influence behaviour outside the family environment.',
                    hint: 'Primary = family. Everything else is...',
                  },
                ],
              },
              {
                label: 'Application', emoji: '🟡',
                questions: [
                  {
                    q: 'A child learns table manners from their parents. Which concept does this illustrate?',
                    options: [
                      'Secondary socialisation through peers',
                      'Primary socialisation through family',
                      'Formal positive sanctions',
                      'Cultural deviance',
                    ],
                    correct: 1,
                    feedback: 'Table manners learned from parents = primary socialisation through the family.',
                    hint: 'Who is doing the teaching? What age/stage is this?',
                  },
                  {
                    q: '"Queuing is expected in the UK but not in all cultures." What sociological concept does this illustrate?',
                    options: [
                      'A formal sanction',
                      'A social value',
                      'A social norm',
                      'Primary socialisation',
                    ],
                    correct: 2,
                    feedback: 'Queuing is a norm — an expected behaviour. The fact it varies by culture shows norms are socially constructed.',
                    hint: 'Is it a belief (value) or a rule of behaviour (norm)?',
                  },
                  {
                    q: 'A student is suspended for fighting. Which sociological concept does this illustrate?',
                    options: [
                      'Positive informal sanction',
                      'Primary socialisation',
                      'Formal negative sanction',
                      'Cultural norm',
                    ],
                    correct: 2,
                    feedback: 'Suspension is a formal negative sanction — an official punishment for breaking school norms.',
                    hint: 'Is it reward or punishment? Is it official or informal?',
                  },
                ],
              },
              {
                label: 'Exam Assassin', emoji: '🔴',
                questions: [
                  {
                    q: 'Explain why sociologists argue that behaviour is socially constructed rather than natural.',
                    options: [
                      'Because different societies have different norms and values, showing behaviour is learned, not innate',
                      'Because humans are naturally good at following rules',
                      'Because laws are created by governments',
                      'Because babies are born knowing some behaviours instinctively',
                    ],
                    correct: 0,
                    feedback: 'Social construction means behaviour is shaped by society, not biology. Different cultures having different norms is the key evidence.',
                    hint: 'What does the existence of different cultures across the world tell us?',
                  },
                  {
                    q: 'Using sociological concepts, explain how the media acts as an agency of socialisation.',
                    options: [
                      'The media entertains people and keeps them informed about news',
                      'The media socialises people by transmitting norms, values and cultural expectations through content like advertising, TV and social media',
                      'The media is less important than family because it only reaches adults',
                      'The media teaches people academic skills',
                    ],
                    correct: 1,
                    feedback: 'Strong answer. The media transmits norms (e.g. beauty standards, gender roles) through its content — this is socialisation through a secondary agency.',
                    hint: 'How does what you watch/scroll shape what you think is normal?',
                  },
                ],
              },
            ],
          },
          {
            type: 'keypoint',
            text: '🎓 <strong>Module complete.</strong> You can now define sociology, culture, norms, values, socialisation and sanctions — and apply them to real scenarios. That\'s Module 1 of GCSE Sociology done.',
          },
        ],
      },
    ],
  },
]
