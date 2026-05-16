// ─── Full module content extracted from the 5 HTML modules ───────────────────
// Each module has: id, title, era, icon, color, screens[]
// Each screen has: label, kicker, heading, content (array of blocks)
// Block types: read, keypoint, quiz (mc), funfact, examtip, timeline, sort, reveal, flashcards

export const MODULES = [
  {
    id: 'mod1',
    title: 'Medieval Medicine',
    subtitle: 'Foundations',
    era: 'c1250–c1500',
    icon: '⚕️',
    color: '#7b3f00',
    colorLight: '#f5e6d3',
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
]
