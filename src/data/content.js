export const TOPICS = [
  {
    id: 'medieval',
    era: 'c1250–c1500',
    title: 'Medieval Medicine',
    subtitle: 'Theory, religion & the four humours',
    icon: '⚕️',
    color: '#7b3f00',
    colorLight: '#f5e6d3',
  },
  {
    id: 'renaissance',
    era: 'c1500–c1700',
    title: 'Renaissance Medicine',
    subtitle: 'Vesalius, Harvey & challenging the ancients',
    icon: '🔬',
    color: '#1a3a5c',
    colorLight: '#ddeeff',
  },
  {
    id: 'industrial',
    era: 'c1700–c1900',
    title: 'Industrial Revolution',
    subtitle: 'Germ theory, anaesthetics & public health',
    icon: '🏭',
    color: '#4a3000',
    colorLight: '#fff8e1',
  },
  {
    id: 'modern',
    era: 'c1900–present',
    title: 'Modern Medicine',
    subtitle: 'NHS, antibiotics & high-tech treatments',
    icon: '🏥',
    color: '#0d3b5e',
    colorLight: '#e3f2fd',
  },
]

export const TOPIC_DATA = {
  medieval: {
    facts: [
      { id: 'f1', keyTerm: 'Four Humours', text: 'Medieval doctors believed illness was caused by an imbalance in the four humours: blood, phlegm, yellow bile, and black bile — a theory from Hippocrates.' },
      { id: 'f2', keyTerm: 'Galen', text: 'Galen, a Roman physician, built on Hippocrates and dominated medicine for 1,000+ years. He wrongly thought blood was made in the liver and that the heart septum had holes in it.' },
      { id: 'f3', keyTerm: 'The Church', text: 'The Church ran hospitals (e.g. St Bartholomew\'s, 1123) but discouraged dissection, slowing anatomical knowledge. Religion was both a help and a hindrance.' },
      { id: 'f4', keyTerm: 'Black Death', text: 'The Black Death (1348–49) killed roughly one third of England\'s population. Causes blamed included bad air (miasma), God\'s punishment, and planetary alignment — all wrong.' },
      { id: 'f5', keyTerm: 'Barber-surgeon', text: 'Most people couldn\'t afford physicians. They relied on wise women, apothecaries, or barber-surgeons who combined shaving with bloodletting and minor surgery.' },
    ],
    keyDates: [
      { year: '1123', event: "St Bartholomew's Hospital founded in London" },
      { year: '1348', event: 'Black Death arrives in England' },
      { year: '1349', event: 'Black Death kills ~1/3 of England\'s population' },
    ],
    questions: [
      { id: 'q1', question: 'What were the four humours?', options: ['Blood, phlegm, yellow bile, black bile', 'Fire, water, earth, air', 'Blood, water, bile, pus', 'Phlegm, spit, sweat, tears'], correctIndex: 0, explanation: 'Hippocrates developed the four humours theory. Treatment meant restoring balance — e.g. bloodletting to reduce excess blood.' },
      { id: 'q2', question: "Which ancient physician's ideas dominated European medicine for over 1,000 years?", options: ['Hippocrates', 'Galen', 'Vesalius', 'Pasteur'], correctIndex: 1, explanation: "Galen (c.129–216 AD) built on Hippocrates. His works were preserved by the Church and his authority was rarely questioned." },
      { id: 'q3', question: 'Why did the Church discourage dissection of human bodies?', options: ['It was too expensive', 'Physicians already knew everything from Galen', 'The body was sacred and needed to be whole for resurrection', "Dissection tools didn't exist yet"], correctIndex: 2, explanation: 'Christian belief in bodily resurrection meant disturbing a corpse was seen as interfering with God\'s plan, limiting anatomical knowledge.' },
      { id: 'q4', question: 'What year did the Black Death arrive in England?', options: ['1215', '1298', '1348', '1381'], correctIndex: 2, explanation: 'The Black Death arrived in 1348 and killed roughly one third of England\'s population by 1349. It returned in waves throughout the century.' },
      { id: 'q5', question: 'Which was a common medieval treatment for illness?', options: ['Vaccination', 'Bloodletting to restore humour balance', 'Antibiotics made from mould', 'Surgery under anaesthetic'], correctIndex: 1, explanation: 'Bloodletting (removing blood by cutting a vein or applying leeches) aimed to reduce excess blood and restore balance.' },
      { id: 'q6', question: 'What was the role of a barber-surgeon?', options: ['A trained physician who studied at university', 'A monk who copied medical texts', 'A tradesman who performed basic surgery and bloodletting', 'A Church official who ran hospitals'], correctIndex: 2, explanation: 'Barber-surgeons were lower status than physicians, doing practical work like pulling teeth, treating wounds, and bloodletting.' },
      { id: 'q7', question: 'What did medieval people NOT blame the Black Death on?', options: ['Bad air (miasma)', "God's punishment for sin", 'Bacteria spread by fleas on rats', 'Planetary alignment'], correctIndex: 2, explanation: "Germ theory wasn't developed until the 1860s. Nobody in 1348 knew about bacteria, fleas, or rats spreading disease." },
      { id: 'q8', question: 'Which hospital, founded in 1123, is one of the oldest in England?', options: ["Guy's Hospital", "St Thomas' Hospital", "St Bartholomew's Hospital", 'The Royal London Hospital'], correctIndex: 2, explanation: "St Bartholomew's was founded in 1123 and still exists today. Medieval hospitals focused on care and prayer, not curing disease." },
      { id: 'q9', question: 'Galen wrongly believed blood was made in which organ?', options: ['The heart', 'The kidneys', 'The liver', 'The lungs'], correctIndex: 2, explanation: 'Galen thought the liver produced blood continuously. Harvey later proved (1628) that blood circulates — the same blood going round and round.' },
      { id: 'q10', question: "What was 'miasma theory'?", options: ['The idea that germs cause disease', 'The belief that bad air from rotting matter caused illness', 'A Greek word for the four humours', 'A Church-approved treatment using prayer'], correctIndex: 1, explanation: 'Miasma (bad air) was widely held. Though wrong, it led to useful public health actions like clearing rubbish, which actually did reduce disease.' },
    ],
    interactiveFacts: [
      {
        type: 'humours',
        quiz: {
          question: 'A medieval doctor sees a patient with a fever and bad temper. Which humour do they blame?',
          options: ['Too much blood', 'Too much phlegm', 'Too much yellow bile', 'Too much black bile'],
          correctIndex: 2,
          explanation: 'Yellow bile was linked to fire, summer, anger and fever. A doctor would try to reduce it — possibly by purging or changing diet.',
        },
      },
      {
        type: 'galen',
        comparisons: [
          { claim: 'The heart pumps blood around the body', wasRight: false, verdict: 'Wrong. Galen thought the liver made new blood constantly. Harvey proved circulation in 1628.' },
          { claim: 'The body has four humours that affect health', wasRight: true, verdict: 'Right — by the standards of his time. The humours theory was the foundation of all medical thinking.' },
          { claim: 'The jaw bone is made of two separate bones', wasRight: false, verdict: 'Wrong. He dissected animals, not humans. Vesalius proved the jaw is one bone in 1543.' },
          { claim: 'Doctors should use observation and experiment', wasRight: true, verdict: 'Right. Galen genuinely advanced the idea of testing ideas — even if his conclusions were often wrong.' },
        ],
        quiz: {
          question: "Why did Galen's wrong ideas survive unchallenged for so long?",
          options: [
            'Nobody had access to his books',
            'The Church backed his authority and discouraged questioning him',
            'Everyone could see his ideas were correct',
            'Physicians kept their discoveries secret',
          ],
          correctIndex: 1,
          explanation: "The Church preserved Galen's texts and treated them as near-sacred. Questioning Galen meant questioning the Church itself.",
        },
      },
      {
        type: 'church',
        statements: [
          { text: "Ran hospitals like St Bartholomew's (1123)", emoji: '🏥', correct: 'helped' },
          { text: 'Cared for the sick and dying', emoji: '🙏', correct: 'helped' },
          { text: 'Discouraged dissection of human bodies', emoji: '⛔', correct: 'hindered' },
          { text: 'Slowed the spread of new anatomical knowledge', emoji: '📚', correct: 'hindered' },
          { text: 'Preserved ancient texts including Galen', emoji: '📜', correct: 'helped' },
          { text: "Taught that illness was God's punishment", emoji: '⚡', correct: 'hindered' },
        ],
      },
      {
        type: 'blackdeath',
        beliefs: [
          { belief: 'Bad air (miasma) from rotting matter', emoji: '💨', context: 'The most "scientific" explanation available. It led to some useful actions like burning herbs — but for entirely the wrong reasons.' },
          { belief: "God's punishment for sin", emoji: '✝️', context: 'Very common. Some people flagellated themselves publicly to show repentance and beg God to stop the plague.' },
          { belief: 'Planetary alignment of Saturn, Jupiter & Mars', emoji: '🪐', context: 'The Paris Medical Faculty officially blamed a triple conjunction of planets in 1345 for poisoning the air. Astrology was taken very seriously.' },
        ],
        quiz: {
          question: 'What actually caused the Black Death?',
          options: [
            'Bad air from the Thames',
            "God's punishment for sin",
            'Bubonic plague — bacteria spread by fleas on rats',
            'Poisoned water supplies',
          ],
          correctIndex: 2,
          explanation: 'Yersinia pestis bacteria, carried by fleas on black rats. Nobody knew this — germ theory was 500+ years away.',
        },
      },
      {
        type: 'dates',
        keyDates: [
          { year: '1123', event: "St Bartholomew's Hospital founded — Church-run care" },
          { year: '1348', event: 'Black Death arrives in England' },
          { year: '1349', event: "Black Death kills ~1/3 of England's population" },
        ],
      },
    ],
  },

  renaissance: {
    facts: [
      { id: 'f1', keyTerm: 'Vesalius', text: "Andreas Vesalius (1514–1564) challenged Galen by carrying out public dissections. His 1543 book 'De Fabrica' corrected over 300 of Galen's errors, including the claim that the jaw is made of two bones." },
      { id: 'f2', keyTerm: 'Harvey — circulation of blood', text: 'William Harvey (1578–1657) proved the heart pumps blood around the body in a continuous circuit. Published in 1628, this overturned Galen\'s idea that the liver made new blood constantly.' },
      { id: 'f3', keyTerm: 'Printing press', text: "The printing press (invented c.1440) meant new discoveries could spread rapidly across Europe, speeding up the challenge to Galen's authority." },
      { id: 'f4', keyTerm: 'Ambroise Paré', text: 'French surgeon Paré (1510–1590) stopped using boiling oil on gunshot wounds when he ran out during battle. He used a soothing ointment instead and patients healed better. He also designed artificial limbs.' },
      { id: 'f5', keyTerm: 'Limits of Renaissance medicine', text: "Despite better understanding, treatments remained limited. Harvey's discovery didn't immediately change treatment because he couldn't explain what blood actually did." },
    ],
    keyDates: [
      { year: '1440', event: 'Printing press invented — ideas spread faster' },
      { year: '1543', event: "Vesalius publishes De Fabrica, correcting Galen's anatomy" },
      { year: '1628', event: 'Harvey publishes proof of blood circulation' },
    ],
    questions: [
      { id: 'q1', question: "What did Vesalius's 1543 book 'De Fabrica' mainly achieve?", options: ['It proved that germs cause disease', "It corrected over 300 of Galen's anatomical errors through dissection", 'It introduced anaesthetics into surgery', 'It disproved the four humours theory entirely'], correctIndex: 1, explanation: 'Vesalius showed Galen had made many mistakes — e.g. the jaw is one bone, not two. He proved the importance of doing dissections, not just reading ancient texts.' },
      { id: 'q2', question: 'What did William Harvey prove in 1628?', options: ['That the liver produces blood continuously', 'That blood circulates continuously around the body pumped by the heart', 'That the heart has four chambers', 'That bacteria cause blood diseases'], correctIndex: 1, explanation: "Harvey used experiments and maths to show the heart pumps blood in a loop. The volume pumped per hour is too large to be continuously produced, so it must circulate." },
      { id: 'q3', question: 'How did the printing press help medical progress?', options: ['It allowed surgeons to print prescriptions', 'It spread new medical discoveries quickly across Europe', 'It replaced the need for universities', 'It was used to print diagrams of the four humours'], correctIndex: 1, explanation: "Before printing, books were copied by hand — slow and expensive. Printed books meant Vesalius's ideas reached physicians across Europe rapidly." },
      { id: 'q4', question: 'Ambroise Paré discovered a better treatment for gunshot wounds by accident. What did he use instead of boiling oil?', options: ['Garlic and vinegar', 'Cold water and bandages', 'A soothing ointment of egg yolk, rose oil and turpentine', 'Alcohol and clean cloth'], correctIndex: 2, explanation: "When Paré ran out of boiling oil he improvised with a gentler ointment. Patients healed better — a classic case of chance playing a role in medical progress." },
      { id: 'q5', question: "Why did Harvey's proof of blood circulation NOT immediately improve treatments?", options: ['Nobody believed him', 'The Church banned his book', "He couldn't explain what blood actually did, so doctors didn't know what to change", 'Bloodletting was made compulsory by law'], correctIndex: 2, explanation: 'Key AQA exam point: improved understanding does not automatically lead to better treatment. Harvey knew blood circulated but not why — so physicians kept using old treatments.' },
    ],
  },

  industrial: {
    facts: [
      { id: 'f1', keyTerm: 'Pasteur — Germ Theory', text: 'Louis Pasteur proved in 1861 that germs (micro-organisms) cause disease. This overturned miasma theory and opened the door to vaccines, antiseptics, and antibiotics.' },
      { id: 'f2', keyTerm: 'Robert Koch', text: 'Robert Koch identified the specific bacteria that cause tuberculosis (1882) and cholera (1883). He developed techniques to stain and photograph bacteria, making germ theory undeniable.' },
      { id: 'f3', keyTerm: 'Lister — antiseptic surgery', text: 'Joseph Lister used carbolic acid as an antiseptic during surgery from 1867, dramatically reducing deaths from infection. He was directly inspired by Pasteur\'s germ theory.' },
      { id: 'f4', keyTerm: 'Simpson — chloroform', text: "James Simpson discovered chloroform as an anaesthetic in 1847, allowing painless surgery. Initial opposition came from the Church (pain was God's will) and doctors who feared patients moving less would lead to worse surgery." },
      { id: 'f5', keyTerm: 'John Snow — Broad Street pump', text: 'John Snow proved cholera was waterborne (not airborne) by mapping deaths in the 1854 Broad Street pump outbreak in London and removing the pump handle — a landmark in epidemiology.' },
    ],
    keyDates: [
      { year: '1847', event: 'Simpson uses chloroform as first effective anaesthetic' },
      { year: '1854', event: 'John Snow maps the Broad Street cholera outbreak' },
      { year: '1861', event: 'Pasteur publishes Germ Theory' },
      { year: '1867', event: 'Lister publishes results of antiseptic surgery' },
      { year: '1875', event: 'Public Health Act — councils must improve sanitation' },
      { year: '1882', event: 'Koch identifies the TB bacterium' },
    ],
    questions: [
      { id: 'q1', question: 'What did Pasteur\'s Germ Theory (1861) prove?', options: ['That bad air causes cholera', 'That micro-organisms (germs) cause disease', 'That the body has natural immunity to all disease', 'That bloodletting cures bacterial infection'], correctIndex: 1, explanation: "Pasteur's swan-neck flask experiment showed micro-organisms in the air caused decay. Everything that followed — Lister, vaccines, antibiotics — depended on this." },
      { id: 'q2', question: "Joseph Lister's antiseptic surgery used which substance?", options: ['Alcohol', 'Chloroform', 'Carbolic acid', 'Iodine'], correctIndex: 2, explanation: 'Lister sprayed carbolic acid (phenol) onto wounds and instruments. Death rates from post-surgical infection dropped dramatically.' },
      { id: 'q3', question: 'How did John Snow help stop the 1854 Broad Street cholera outbreak?', options: ['He prescribed quinine to all residents', 'He identified the infected water pump and had its handle removed', 'He proved cholera was caused by miasma from the Thames', 'He vaccinated residents with a cholera vaccine'], correctIndex: 1, explanation: 'Snow mapped deaths door by door, found they clustered around the Broad Street pump, and had its handle removed — stopping people drinking contaminated water.' },
      { id: 'q4', question: "What was one key objection to Simpson's use of chloroform anaesthetic?", options: ['It was too expensive for hospitals', "The Church argued that pain was God's will and should not be removed", 'Patients always died from chloroform overdoses', "Surgeons couldn't work with an unconscious patient"], correctIndex: 1, explanation: "Acceptance grew after Queen Victoria used chloroform during the birth of Prince Leopold in 1853 — royal approval helped overcome religious opposition." },
      { id: 'q5', question: 'The 1875 Public Health Act forced local councils to do which of the following?', options: ['Build new hospitals in every town', 'Provide free vaccination against smallpox', 'Ensure clean water, sewers, and rubbish collection', 'Train a minimum number of physicians per district'], correctIndex: 2, explanation: 'The 1875 Act made sanitation improvements compulsory — councils had to provide clean water, proper sewers, and refuse collection, dramatically reducing disease.' },
    ],
  },

  modern: {
    facts: [
      { id: 'f1', keyTerm: 'Penicillin — Fleming, Florey & Chain', text: "Alexander Fleming discovered penicillin in 1928 by accident — a mould contaminated a petri dish and killed surrounding bacteria. Florey and Chain developed it into a usable antibiotic by 1942, saving millions in WWII." },
      { id: 'f2', keyTerm: 'NHS — 1948', text: 'The National Health Service was founded in 1948, providing free healthcare for all at the point of use. Proposed by Beveridge (1942) and created by Aneurin Bevan, it was funded by taxation and National Insurance.' },
      { id: 'f3', keyTerm: 'DNA — Watson & Crick, 1953', text: 'The double helix structure of DNA was discovered by Watson and Crick in 1953, using X-ray data from Rosalind Franklin. This opened the door to gene therapies and personalised medicine.' },
      { id: 'f4', keyTerm: 'High-tech treatments', text: 'Modern treatments include CT and MRI scanners, keyhole surgery, organ transplants, and targeted cancer treatments like radiotherapy and immunotherapy.' },
      { id: 'f5', keyTerm: 'Human Genome Project', text: 'The Human Genome Project (completed 2003) mapped all human genes, promising future treatments for genetic diseases. However, turning genetic knowledge into cures remains a major challenge.' },
    ],
    keyDates: [
      { year: '1928', event: 'Fleming discovers penicillin' },
      { year: '1942', event: 'Florey & Chain produce penicillin for mass use in WWII' },
      { year: '1948', event: 'NHS founded — free healthcare for all' },
      { year: '1953', event: 'Watson & Crick discover DNA double helix structure' },
      { year: '2003', event: 'Human Genome Project completed' },
    ],
    questions: [
      { id: 'q1', question: 'Who discovered penicillin, and in what year?', options: ['Florey, 1942', 'Fleming, 1928', 'Koch, 1895', 'Pasteur, 1882'], correctIndex: 1, explanation: "Fleming noticed a mould had killed bacteria on a petri dish in 1928. He published his findings but couldn't develop it into a drug — Florey and Chain did that in the 1940s." },
      { id: 'q2', question: 'The NHS was launched in 1948. Which minister was responsible for setting it up?', options: ['William Beveridge', 'Winston Churchill', 'Aneurin Bevan', 'Clement Attlee'], correctIndex: 2, explanation: "Aneurin (Nye) Bevan was Health Minister. Beveridge had proposed a welfare state in 1942, but Bevan turned it into reality against significant opposition from doctors." },
      { id: 'q3', question: 'What did Watson and Crick discover in 1953?', options: ['The cause of cancer', 'The structure of DNA (the double helix)', 'How to clone human cells', 'The first effective vaccine for influenza'], correctIndex: 1, explanation: "Their model explained how genetic information is stored and copied. It drew on X-ray images taken by Rosalind Franklin, whose contribution was long underacknowledged." },
      { id: 'q4', question: 'Which best describes how the NHS is funded?', options: ['By patient fees at the point of use', 'Entirely by private insurance companies', 'Through taxation and National Insurance contributions', 'Through charitable donations'], correctIndex: 2, explanation: "The NHS is based on healthcare being free at the point of use, funded collectively through taxation. This was radical in 1948 — most people had previously had to pay for treatment." },
      { id: 'q5', question: 'What was the significance of the Human Genome Project (completed 2003)?', options: ['It cured all known genetic diseases', 'It mapped all human genes, opening the door to personalised medicine', 'It proved evolution by natural selection', 'It created the first genetically modified vaccine'], correctIndex: 1, explanation: "The HGP gave scientists a complete map of human DNA. Turning this knowledge into cures has proved slow — a reminder that discovery doesn't equal treatment." },
    ],
  },
}
