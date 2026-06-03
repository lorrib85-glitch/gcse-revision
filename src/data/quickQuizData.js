// ─── Quick Quiz Question Bank ──────────────────────────────────────────────────
// Types: mcq | truefalse | fillgap | matchpairs | sequence | dragdrop
// Difficulties: easy | medium | hard | exam
// Each question has: explanation (what the correct answer means),
//                    reasoning (why it's correct),
//                    misconception (common wrong idea, optional)

export const QUICK_QUIZ_QUESTIONS = [

  // ════════════════════════════════════════════════════════
  // HISTORY — Medieval Medicine
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_h1', subject: 'History', topic: 'Medieval Medicine',
    difficulty: 'easy', type: 'mcq',
    question: 'What were the four humours according to medieval doctors?',
    options: ['Blood, phlegm, yellow bile, black bile', 'Fire, water, earth, air', 'Blood, water, bile, pus', 'Phlegm, spit, sweat, tears'],
    correctIndex: 0,
    explanation: 'The four humours were blood, phlegm, yellow bile, and black bile.',
    reasoning: 'Medieval doctors believed illness was caused by an imbalance of these four bodily fluids, based on Hippocrates\' theory.',
    misconception: 'People often confuse the four humours with the four elements (fire, water, earth, air) — these are different concepts.',
  },

  {
    id: 'qq_h2', subject: 'History', topic: 'Medieval Medicine',
    difficulty: 'easy', type: 'truefalse',
    question: 'The Church ran hospitals like St Bartholomew\'s in medieval England.',
    correct: true,
    explanation: 'True — the Church ran hospitals including St Bartholomew\'s, founded in 1123.',
    reasoning: 'Religious orders cared for the sick as an act of Christian charity, providing rest and prayer.',
    misconception: 'Some assume the Church only hindered medicine — but it also provided care and preserved medical texts.',
  },

  {
    id: 'qq_h3', subject: 'History', topic: 'Medieval Medicine',
    difficulty: 'easy', type: 'mcq',
    question: 'Which ancient physician\'s ideas dominated European medicine for over 1,000 years?',
    options: ['Hippocrates', 'Galen', 'Vesalius', 'Pasteur'],
    correctIndex: 1,
    explanation: 'Galen (c.129–216 AD) built on Hippocrates and his works were treated as near-sacred by the Church.',
    reasoning: 'Because the Church preserved and backed his texts, questioning Galen meant questioning the Church itself.',
    misconception: 'Hippocrates came first and developed the humours theory, but it was Galen whose specific ideas dominated medieval medicine.',
  },

  {
    id: 'qq_h4', subject: 'History', topic: 'Medieval Medicine',
    difficulty: 'easy', type: 'truefalse',
    question: 'Medieval doctors understood that bacteria caused the Black Death.',
    correct: false,
    explanation: 'False — germ theory wasn\'t developed until the 1860s by Pasteur.',
    reasoning: 'In 1348, people blamed the Black Death on bad air (miasma), God\'s punishment, or planetary alignment.',
    misconception: 'Modern hindsight makes it easy to assume past people "should have known" about germs, but the technology to see bacteria didn\'t exist.',
  },

  {
    id: 'qq_h5', subject: 'History', topic: 'Medieval Medicine',
    difficulty: 'easy', type: 'fillgap',
    question: 'The Black Death arrived in England in ___.',
    options: ['1215', '1298', '1348', '1381'],
    correctIndex: 2,
    explanation: 'The Black Death arrived in England in 1348 and killed roughly one third of the population.',
    reasoning: 'The plague spread via trade routes from Asia, arriving in English ports in 1348.',
    misconception: '1381 was the Peasants\' Revolt — a different major medieval event that\'s easy to confuse.',
  },

  {
    id: 'qq_h6', subject: 'History', topic: 'Medieval Medicine',
    difficulty: 'medium', type: 'fillgap',
    question: 'Galen wrongly believed that blood was made in the ___.',
    options: ['Heart', 'Lungs', 'Liver', 'Brain'],
    correctIndex: 2,
    explanation: 'Galen thought the liver continuously produced new blood. Harvey later proved blood circulates in 1628.',
    reasoning: 'Galen dissected animals rather than humans, leading to errors he applied to human anatomy.',
    misconception: 'Students often think Galen got the heart wrong — but his liver error is the key one to remember.',
  },

  {
    id: 'qq_h7', subject: 'History', topic: 'Medieval Medicine',
    difficulty: 'medium', type: 'dragdrop',
    question: 'Sort each statement into the correct category for the Church\'s role in medieval medicine:',
    categories: ['Helped medicine', 'Hindered medicine'],
    items: [
      { text: 'Ran hospitals like St Bartholomew\'s (1123)', category: 0 },
      { text: 'Discouraged human dissection', category: 1 },
      { text: 'Preserved Galen\'s medical texts in universities', category: 0 },
      { text: 'Backed Galen\'s authority and discouraged questioning', category: 1 },
    ],
    explanation: 'The Church both helped and hindered medicine — a key theme in this topic.',
    reasoning: 'Hospitals and text preservation were positive; however, backing Galen uncritically and banning dissection slowed progress.',
    misconception: 'It\'s a common mistake to say the Church only hindered medicine. Balance is essential for full marks.',
  },

  {
    id: 'qq_h8', subject: 'History', topic: 'Medieval Medicine',
    difficulty: 'medium', type: 'mcq',
    question: 'Why did the Church discourage dissection of human bodies?',
    options: [
      'It was too expensive and time-consuming',
      'Physicians already knew everything from Galen',
      'The body was sacred and needed to be whole for resurrection',
      'Dissection tools did not yet exist',
    ],
    correctIndex: 2,
    explanation: 'Christian belief in bodily resurrection meant disturbing a corpse was seen as interfering with God\'s plan.',
    reasoning: 'This restricted anatomical knowledge — Galen\'s errors went unchallenged because nobody could verify them through dissection.',
    misconception: 'Dissection was not physically impossible — it was a Church restriction, not a technical one.',
  },

  // ════════════════════════════════════════════════════════
  // HISTORY — Renaissance Medicine
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_h9', subject: 'History', topic: 'Renaissance Medicine',
    difficulty: 'medium', type: 'matchpairs',
    question: 'Match each person to their key contribution to medicine:',
    pairs: [
      { left: 'Vesalius', right: 'Corrected over 300 of Galen\'s anatomical errors' },
      { left: 'Harvey', right: 'Proved that blood circulates around the body' },
      { left: 'Paré', right: 'Improved surgical techniques; used ligatures instead of boiling oil' },
      { left: 'Pasteur', right: 'Proved micro-organisms cause disease (germ theory)' },
    ],
    explanation: 'Each made a distinct breakthrough — it\'s vital to attribute the right discovery to the right person.',
    reasoning: 'Vesalius (1543), Harvey (1628), Paré (16th C), Pasteur (1861) each advanced medicine in different fields.',
    misconception: 'Students sometimes confuse Harvey and Vesalius — Vesalius was about anatomy, Harvey was about circulation.',
  },

  {
    id: 'qq_h10', subject: 'History', topic: 'Renaissance Medicine',
    difficulty: 'medium', type: 'truefalse',
    question: 'Harvey\'s discovery of blood circulation immediately improved treatments for patients.',
    correct: false,
    explanation: 'False — understanding the circulation did not immediately change treatment. Doctors still bled patients.',
    reasoning: 'Knowing how the body works and knowing how to treat illness are different things. Bloodletting continued for decades.',
    misconception: 'Students assume scientific discoveries automatically lead to better medicine — but theory and practice often lag behind each other.',
  },

  {
    id: 'qq_h11', subject: 'History', topic: 'Renaissance Medicine',
    difficulty: 'hard', type: 'mcq',
    question: 'The printing press contributed to Renaissance medicine primarily by:',
    options: [
      'Allowing doctors to perform surgery more quickly',
      'Spreading new ideas like Vesalius\' discoveries across Europe rapidly',
      'Replacing the Church as the authority on medicine',
      'Training more physicians in universities',
    ],
    correctIndex: 1,
    explanation: 'The printing press (mid-15th century) meant that Vesalius\' corrected anatomy could spread quickly across Europe.',
    reasoning: 'Before printing, books were hand-copied and rare. New ideas spread slowly. Printing accelerated the sharing of knowledge.',
    misconception: 'The printing press didn\'t replace the Church — it made ideas harder to suppress, but Church influence continued for centuries.',
  },

  {
    id: 'qq_h12', subject: 'History', topic: 'Renaissance Medicine',
    difficulty: 'hard', type: 'mcq',
    question: 'Why did Vesalius\' work represent a significant change in how medicine developed?',
    options: [
      'He discovered the cause of the plague',
      'He showed doctors should observe and test rather than accept ancient authority',
      'He proved the four humours were correct',
      'He invented the first surgical instruments',
    ],
    correctIndex: 1,
    explanation: 'Vesalius demonstrated that Galen (over 1,000 years of authority) was wrong — observation beat inherited knowledge.',
    reasoning: 'This shift from "trust ancient authority" to "test and observe" was a fundamental change in scientific thinking.',
    misconception: 'Vesalius didn\'t discover the cause of disease — his contribution was to anatomy and the method of observation.',
  },

  // ════════════════════════════════════════════════════════
  // HISTORY — Industrial Revolution
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_h13', subject: 'History', topic: 'Industrial Revolution',
    difficulty: 'medium', type: 'sequence',
    question: 'Put these medical developments in chronological order (earliest first):',
    items: ['Pasteur\'s germ theory (1861)', 'Black Death arrives in England (1348)', 'Vesalius publishes De Fabrica (1543)', 'Fleming discovers penicillin (1928)'],
    correctOrder: ['Black Death arrives in England (1348)', 'Vesalius publishes De Fabrica (1543)', 'Pasteur\'s germ theory (1861)', 'Fleming discovers penicillin (1928)'],
    explanation: 'Correct order: Black Death (1348) → De Fabrica (1543) → Germ theory (1861) → Penicillin (1928)',
    reasoning: 'Understanding the sequence of discoveries helps you write stronger "change and continuity" exam answers.',
  },

  {
    id: 'qq_h14', subject: 'History', topic: 'Industrial Revolution',
    difficulty: 'medium', type: 'mcq',
    question: 'What was the significance of the 1875 Public Health Act compared to the 1848 Act?',
    options: [
      'The 1875 Act was also voluntary, but had more recommendations',
      'The 1875 Act made improvements to water and sewage systems compulsory, not optional',
      'The 1875 Act focused only on London, not the whole country',
      'The 1875 Act was passed in response to the Great Stink of 1858',
    ],
    correctIndex: 1,
    explanation: 'The 1875 Act made clean water and sewage systems compulsory — the 1848 Act was optional and largely ignored.',
    reasoning: 'The shift from voluntary to compulsory action is the key change. It marked the end of the laissez-faire attitude to public health.',
    misconception: 'The Great Stink (1858) led to Bazalgette\'s sewers but preceded the 1875 Act. Don\'t confuse the timeline.',
  },

  {
    id: 'qq_h15', subject: 'History', topic: 'Industrial Revolution',
    difficulty: 'hard', type: 'mcq',
    question: 'Why was the government slow to improve public health in the early 19th century?',
    options: [
      'They did not know about the cholera epidemic',
      'Laissez-faire attitudes and the belief government should not interfere',
      'The medical profession opposed all government involvement',
      'Parliament had no legal power to pass health laws',
    ],
    correctIndex: 1,
    explanation: 'Laissez-faire (non-interference) was the dominant political view — ratepayers didn\'t want to pay for improvements.',
    reasoning: 'Vested interests (landlords, water companies) also resisted change. The 1848 Act being optional reflects this reluctance.',
    misconception: 'The government did know about cholera outbreaks — the issue was political will, not knowledge.',
  },

  {
    id: 'qq_h16', subject: 'History', topic: 'Industrial Revolution',
    difficulty: 'hard', type: 'truefalse',
    question: 'The 1848 Public Health Act was compulsory for all local authorities to follow.',
    correct: false,
    explanation: 'False — the 1848 Act was optional. Local authorities could choose whether to act.',
    reasoning: 'This is why it largely failed. Only the compulsory 1875 Act brought real nationwide improvement.',
    misconception: 'Students who know about the 1848 Act sometimes assume it worked — but its voluntary nature made it ineffective.',
  },

  {
    id: 'qq_h17', subject: 'History', topic: 'Industrial Revolution',
    difficulty: 'exam', type: 'mcq',
    question: '"Pasteur\'s germ theory was the most important development in 19th-century medicine." Which argument BEST challenges this claim?',
    options: [
      'Germ theory happened too late in the century to matter',
      'Anaesthetics (1847) and public health reforms also transformed medicine and were equally or more practically impactful',
      'Pasteur\'s theory was rejected by most doctors at the time',
      'Koch\'s work was more important because it identified specific bacteria',
    ],
    correctIndex: 1,
    explanation: 'A strong counter-argument acknowledges other major developments: anaesthetics transformed surgery; public health acts saved thousands of lives.',
    reasoning: 'Exam-style questions require you to weigh germ theory against other factors — anaesthetics, public health, and Koch\'s specific discoveries all transformed medicine.',
    misconception: 'Koch\'s work built ON germ theory, not against it — it\'s better used to develop the argument, not challenge it.',
  },

  // ════════════════════════════════════════════════════════
  // HISTORY — Modern Medicine
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_h18', subject: 'History', topic: 'Modern Medicine',
    difficulty: 'easy', type: 'mcq',
    question: 'When was the National Health Service (NHS) founded?',
    options: ['1928', '1939', '1948', '1956'],
    correctIndex: 2,
    explanation: 'The NHS was founded on 5 July 1948 by Minister of Health Aneurin Bevan.',
    reasoning: 'The NHS provided free healthcare for all at the point of need — a major change from paying for every treatment.',
    misconception: '1928 is when penicillin was discovered by Fleming — a different major event.',
  },

  {
    id: 'qq_h19', subject: 'History', topic: 'Modern Medicine',
    difficulty: 'medium', type: 'mcq',
    question: 'Fleming discovered penicillin in 1928, yet it wasn\'t available as a treatment until the 1940s. Why?',
    options: [
      'The government banned its use until it was fully tested',
      'Fleming couldn\'t find a way to produce it in large enough quantities',
      'It was kept secret during World War II',
      'Other scientists thought his discovery was wrong',
    ],
    correctIndex: 1,
    explanation: 'Fleming could not mass-produce penicillin. Florey and Chain solved this in the early 1940s, driven by wartime need.',
    reasoning: 'This shows how a scientific discovery and a practical treatment can be separated by years — the production problem was the barrier.',
    misconception: 'The government didn\'t ban it — the barrier was purely a manufacturing and funding challenge.',
  },

  {
    id: 'qq_h20', subject: 'History', topic: 'Modern Medicine',
    difficulty: 'exam', type: 'mcq',
    question: 'Which factor was MOST important in the development of the NHS in 1948?',
    options: [
      'Medical advances making treatment more effective',
      'The experience of World War II showing government could organise healthcare nationally',
      'Public demand for free healthcare after years of poverty',
      'New drugs like penicillin making treatment cheaper',
    ],
    correctIndex: 1,
    explanation: 'WWII proved the government could organise healthcare nationally (Emergency Medical Service). Combined with Beveridge Report (1942), this created political momentum.',
    reasoning: 'While all factors matter, WWII provided both the model (EMS) and the political will. Strong exam answers consider multiple factors before reaching a judgement.',
    misconception: 'Penicillin made treatment more effective, not cheaper — it was expensive to produce early on.',
  },

  // ════════════════════════════════════════════════════════
  // BIOLOGY — Cell Structure
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_b1', subject: 'Biology', topic: 'Cell Structure',
    difficulty: 'easy', type: 'mcq',
    question: 'What is the function of the nucleus in a cell?',
    options: [
      'To release energy through respiration',
      'To control the activities of the whole cell',
      'To allow substances to move in and out',
      'To produce food using light energy',
    ],
    correctIndex: 1,
    explanation: 'The nucleus contains DNA and controls all cell activities by determining which proteins are made.',
    reasoning: 'DNA carries the instructions for making proteins — proteins carry out all the cell\'s functions.',
    misconception: 'The cell membrane controls what moves in and out; the nucleus controls what the cell does.',
  },

  {
    id: 'qq_b2', subject: 'Biology', topic: 'Cell Structure',
    difficulty: 'easy', type: 'truefalse',
    question: 'Plant cells have a cell wall made of cellulose.',
    correct: true,
    explanation: 'True — plant cells have a cellulose cell wall that provides rigid support.',
    reasoning: 'The cell wall keeps the cell\'s shape and allows turgor pressure to build up, which supports the plant.',
    misconception: 'Animal cells do NOT have a cell wall — this is a key difference between plant and animal cells.',
  },

  {
    id: 'qq_b3', subject: 'Biology', topic: 'Cell Structure',
    difficulty: 'easy', type: 'truefalse',
    question: 'Red blood cells contain a nucleus.',
    correct: false,
    explanation: 'False — red blood cells have no nucleus, giving more space to carry haemoglobin and oxygen.',
    reasoning: 'The lack of a nucleus is an adaptation that allows red blood cells to carry maximum oxygen.',
    misconception: 'Most human cells have a nucleus — red blood cells are a notable exception.',
  },

  {
    id: 'qq_b4', subject: 'Biology', topic: 'Cell Structure',
    difficulty: 'medium', type: 'matchpairs',
    question: 'Match each cell organelle to its function:',
    pairs: [
      { left: 'Mitochondria', right: 'Site of aerobic respiration — releases energy' },
      { left: 'Ribosome', right: 'Site of protein synthesis' },
      { left: 'Chloroplast', right: 'Site of photosynthesis in plant cells' },
      { left: 'Cell membrane', right: 'Controls what enters and leaves the cell' },
    ],
    explanation: 'Each organelle has a specific function — these are essential to know for exams.',
    reasoning: 'Organelles work together: ribosomes make proteins needed by mitochondria; chloroplasts produce glucose used in respiration.',
    misconception: 'Students often confuse mitochondria (energy release via respiration) with chloroplasts (energy capture via photosynthesis).',
  },

  {
    id: 'qq_b5', subject: 'Biology', topic: 'Cell Structure',
    difficulty: 'medium', type: 'fillgap',
    question: 'The process by which substances move from high to low concentration without using energy is called ___.',
    options: ['Osmosis', 'Active transport', 'Diffusion', 'Transpiration'],
    correctIndex: 2,
    explanation: 'Diffusion is the passive movement of particles from high to low concentration.',
    reasoning: 'It requires no energy because particles naturally spread out. Active transport moves substances AGAINST a concentration gradient and DOES require energy.',
    misconception: 'Osmosis is specifically the diffusion of WATER through a semi-permeable membrane — diffusion is the broader term.',
  },

  // ════════════════════════════════════════════════════════
  // BIOLOGY — Osmosis & Water Movement
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_b6', subject: 'Biology', topic: 'Osmosis',
    difficulty: 'medium', type: 'mcq',
    question: 'A plant cell is placed in a concentrated salt solution. What happens to the cell?',
    options: [
      'Water moves into the cell and it swells',
      'Water moves out of the cell and it becomes plasmolysed',
      'Salt moves into the cell',
      'The cell stays the same because it has a cell wall',
    ],
    correctIndex: 1,
    explanation: 'Water moves out by osmosis (to the more concentrated solution), causing the cell to become plasmolysed (shrunken).',
    reasoning: 'Water always moves from dilute solution to concentrated solution through a semi-permeable membrane — osmosis.',
    misconception: 'The cell wall prevents the cell from bursting in dilute solution, but it cannot stop water leaving in concentrated solution.',
  },

  {
    id: 'qq_b7', subject: 'Biology', topic: 'Osmosis',
    difficulty: 'hard', type: 'mcq',
    question: 'A student cuts identical cylinders of potato and places them in solutions of different concentrations. Which result is expected for a cylinder placed in pure water?',
    options: [
      'The cylinder will decrease in mass as water leaves',
      'The cylinder will increase in mass as water enters by osmosis',
      'The cylinder will stay the same mass as it is already pure water',
      'The cylinder will dissolve because water breaks down starch',
    ],
    correctIndex: 1,
    explanation: 'The potato cells have a higher solute concentration than pure water, so water moves IN by osmosis — the cylinder gains mass.',
    reasoning: 'Osmosis always moves water from the less concentrated (pure water) to the more concentrated (potato cell) solution.',
    misconception: 'Students often think "pure water = nothing changes" — but the potato\'s internal concentration means water still moves into it.',
  },

  // ════════════════════════════════════════════════════════
  // BIOLOGY — Respiration
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_b8', subject: 'Biology', topic: 'Respiration',
    difficulty: 'easy', type: 'mcq',
    question: 'What is the word equation for aerobic respiration?',
    options: [
      'Carbon dioxide + Water → Glucose + Oxygen',
      'Glucose + Oxygen → Carbon dioxide + Water (+ energy)',
      'Glucose → Carbon dioxide + Ethanol (+ energy)',
      'Carbon dioxide + Water → Glucose (+ energy)',
    ],
    correctIndex: 1,
    explanation: 'Aerobic respiration: Glucose + Oxygen → Carbon dioxide + Water, releasing energy.',
    reasoning: 'Glucose is broken down using oxygen. The energy released is used for all body processes.',
    misconception: 'Option C is anaerobic respiration (in yeast) — anaerobic produces ethanol and CO2 without oxygen.',
  },

  {
    id: 'qq_b9', subject: 'Biology', topic: 'Respiration',
    difficulty: 'medium', type: 'truefalse',
    question: 'Anaerobic respiration produces more energy per glucose molecule than aerobic respiration.',
    correct: false,
    explanation: 'False — aerobic respiration releases much more energy per glucose molecule than anaerobic.',
    reasoning: 'Aerobic fully breaks down glucose using oxygen; anaerobic is incomplete, producing lactic acid (in animals) and less energy.',
    misconception: 'Anaerobic happens when oxygen is unavailable — it\'s less efficient, not more.',
  },

  // ════════════════════════════════════════════════════════
  // BIOLOGY — Photosynthesis
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_b10', subject: 'Biology', topic: 'Photosynthesis',
    difficulty: 'easy', type: 'fillgap',
    question: 'Photosynthesis takes place mainly in the ___ of plant cells.',
    options: ['Mitochondria', 'Nucleus', 'Chloroplasts', 'Ribosomes'],
    correctIndex: 2,
    explanation: 'Chloroplasts contain chlorophyll, the pigment that absorbs light energy for photosynthesis.',
    reasoning: 'Chloroplasts are found mainly in leaf cells — the wide, flat shape of leaves maximises light absorption.',
    misconception: 'Mitochondria are where energy is RELEASED (respiration), not captured. Chloroplasts capture energy from light.',
  },

  {
    id: 'qq_b11', subject: 'Biology', topic: 'Photosynthesis',
    difficulty: 'medium', type: 'mcq',
    question: 'A plant is kept in the dark for 24 hours. What would you expect?',
    options: [
      'The plant would stop both photosynthesis and respiration',
      'The plant would continue respiring but stop photosynthesising',
      'The plant would continue photosynthesising at a slower rate',
      'The plant would produce oxygen from stored carbon dioxide',
    ],
    correctIndex: 1,
    explanation: 'Respiration happens continuously (day and night). Photosynthesis requires light — it stops in darkness.',
    reasoning: 'Without light, chlorophyll cannot capture energy, so photosynthesis stops. But cells still need energy, so respiration continues.',
    misconception: 'Plants don\'t stop respiring at night — they just can\'t photosynthesise without light.',
  },

  // ════════════════════════════════════════════════════════
  // BIOLOGY — Circulatory System
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_b12', subject: 'Biology', topic: 'Circulatory System',
    difficulty: 'medium', type: 'mcq',
    question: 'Why are red blood cells biconcave (disc-shaped with a dent on each side)?',
    options: [
      'To allow them to pass through the smallest veins',
      'To increase surface area for oxygen absorption',
      'To prevent them from clotting together',
      'To make them easier to produce in bone marrow',
    ],
    correctIndex: 1,
    explanation: 'The biconcave shape increases surface area, allowing more haemoglobin to bind oxygen more quickly.',
    reasoning: 'Maximum surface area = maximum oxygen-carrying capacity. This is an adaptation for efficient gas exchange.',
    misconception: 'Red blood cells pass through capillaries (smallest vessels) not veins — but shape is about oxygen capacity, not just fitting.',
  },

  {
    id: 'qq_b13', subject: 'Biology', topic: 'Circulatory System',
    difficulty: 'hard', type: 'sequence',
    question: 'Put the path of blood through the heart in the correct order (starting from the body):',
    items: ['Right atrium', 'Left ventricle pumps to body', 'Lungs (to pick up oxygen)', 'Left atrium', 'Right ventricle pumps to lungs'],
    correctOrder: ['Right atrium', 'Right ventricle pumps to lungs', 'Lungs (to pick up oxygen)', 'Left atrium', 'Left ventricle pumps to body'],
    explanation: 'Blood: body → right atrium → right ventricle → lungs → left atrium → left ventricle → body.',
    reasoning: 'The right side pumps deoxygenated blood to the lungs; the left side pumps oxygenated blood to the body.',
    misconception: 'Students confuse "right" and "left" — remember, right side = lungs (pulmonary circuit); left side = body (systemic circuit).',
  },

  // ════════════════════════════════════════════════════════
  // BIOLOGY — Disease & Immunity
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_b14', subject: 'Biology', topic: 'Disease & Immunity',
    difficulty: 'easy', type: 'mcq',
    question: 'What type of pathogen causes tuberculosis (TB)?',
    options: ['Virus', 'Bacterium', 'Fungus', 'Parasite'],
    correctIndex: 1,
    explanation: 'TB is caused by the bacterium Mycobacterium tuberculosis.',
    reasoning: 'Knowing whether a disease is bacterial or viral matters because antibiotics only work on bacteria, not viruses.',
    misconception: 'Students confuse bacteria and viruses. Viral diseases (like flu, COVID) are NOT treated with antibiotics.',
  },

  {
    id: 'qq_b15', subject: 'Biology', topic: 'Disease & Immunity',
    difficulty: 'medium', type: 'dragdrop',
    question: 'Sort these diseases into the correct category:',
    categories: ['Caused by bacteria', 'Caused by viruses'],
    items: [
      { text: 'Tuberculosis (TB)', category: 0 },
      { text: 'Influenza (flu)', category: 1 },
      { text: 'Salmonella food poisoning', category: 0 },
      { text: 'HIV/AIDS', category: 1 },
    ],
    explanation: 'TB and Salmonella are bacterial; flu and HIV are viral.',
    reasoning: 'This distinction is clinically crucial: bacterial infections can be treated with antibiotics; viral infections cannot.',
    misconception: 'HIV cannot be treated with antibiotics — it requires antiretroviral drugs that target the virus specifically.',
  },

  // ════════════════════════════════════════════════════════
  // CHEMISTRY — Atomic Structure
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_c1', subject: 'Chemistry', topic: 'Atomic Structure',
    difficulty: 'easy', type: 'mcq',
    question: 'What is the charge on a proton?',
    options: ['+1', '-1', '0', '+2'],
    correctIndex: 0,
    explanation: 'Protons have a charge of +1. Neutrons are neutral (0) and electrons are -1.',
    reasoning: 'In a neutral atom, the number of protons (positive) equals the number of electrons (negative) — so charges cancel.',
    misconception: 'Students sometimes confuse protons and electrons. Proton = positive; electron = negative; neutron = neutral.',
  },

  {
    id: 'qq_c2', subject: 'Chemistry', topic: 'Atomic Structure',
    difficulty: 'easy', type: 'fillgap',
    question: 'The ___ number of an element equals the number of protons in its nucleus.',
    options: ['Mass', 'Atomic', 'Group', 'Period'],
    correctIndex: 1,
    explanation: 'The atomic number is unique to each element and tells you the number of protons (and electrons in a neutral atom).',
    reasoning: 'Atomic number defines the element — change the number of protons and you have a different element.',
    misconception: 'Mass number = protons + neutrons; atomic number = protons only. Don\'t confuse them.',
  },

  {
    id: 'qq_c3', subject: 'Chemistry', topic: 'Atomic Structure',
    difficulty: 'easy', type: 'truefalse',
    question: 'Neutrons have a negative charge.',
    correct: false,
    explanation: 'False — neutrons have no charge (they are neutral, hence the name).',
    reasoning: 'The nucleus contains protons (+) and neutrons (0). Electrons (-) orbit the nucleus.',
    misconception: 'The "neut-" in neutron is a clue — it means neutral.',
  },

  {
    id: 'qq_c4', subject: 'Chemistry', topic: 'Atomic Structure',
    difficulty: 'medium', type: 'mcq',
    question: 'Potassium loses one electron to form an ion. What is the charge of this ion?',
    options: ['-1', '0', '+1', '+2'],
    correctIndex: 2,
    explanation: 'Potassium has 19 protons (+) and loses 1 electron, leaving 18 electrons (-). Net charge = 19 - 18 = +1.',
    reasoning: 'When atoms lose electrons, they become positively charged ions (cations). Gaining electrons forms negative ions (anions).',
    misconception: 'Students often get confused about which way the charge goes — losing electrons = positive; gaining electrons = negative.',
  },

  {
    id: 'qq_c5', subject: 'Chemistry', topic: 'Periodic Table',
    difficulty: 'easy', type: 'mcq',
    question: 'What name is given to the elements in Group 1 of the periodic table?',
    options: ['Halogens', 'Noble gases', 'Alkali metals', 'Transition metals'],
    correctIndex: 2,
    explanation: 'Group 1 elements (Li, Na, K, Rb, Cs, Fr) are called alkali metals.',
    reasoning: 'They react with water to form alkaline solutions — hence "alkali" metals.',
    misconception: 'Halogens are Group 7; Noble gases are Group 0/8. Don\'t mix up group names.',
  },

  {
    id: 'qq_c6', subject: 'Chemistry', topic: 'Periodic Table',
    difficulty: 'medium', type: 'truefalse',
    question: 'Group 1 elements become less reactive as you go down the group.',
    correct: false,
    explanation: 'False — Group 1 elements become MORE reactive going down the group.',
    reasoning: 'Further down, the outer electron is further from the nucleus, less strongly attracted, and easier to lose — reactivity increases.',
    misconception: 'This is the opposite of Group 7 (halogens), which become LESS reactive down the group — students often get these confused.',
  },

  {
    id: 'qq_c7', subject: 'Chemistry', topic: 'Bonding',
    difficulty: 'medium', type: 'mcq',
    question: 'What type of bond forms between a metal and a non-metal?',
    options: ['Covalent bond', 'Ionic bond', 'Metallic bond', 'Hydrogen bond'],
    correctIndex: 1,
    explanation: 'Ionic bonds form when a metal transfers electrons to a non-metal, forming oppositely charged ions.',
    reasoning: 'Metals lose electrons (form + ions); non-metals gain electrons (form - ions). The opposite charges attract strongly.',
    misconception: 'Covalent bonds form between two non-metals (sharing electrons). Ionic bonds involve electron transfer, not sharing.',
  },

  {
    id: 'qq_c8', subject: 'Chemistry', topic: 'Chemical Reactions',
    difficulty: 'hard', type: 'mcq',
    question: 'Why does increasing temperature increase the rate of a chemical reaction?',
    options: [
      'It increases the concentration of reactants',
      'It makes the particles larger',
      'It gives particles more energy so they collide more frequently and with more energy',
      'It lowers the activation energy needed',
    ],
    correctIndex: 2,
    explanation: 'Higher temperature means particles move faster, collide more often, and with more energy — more successful collisions per second.',
    reasoning: 'Collision theory: reactions happen when particles collide with enough energy (activation energy). Temperature increases both frequency and energy of collisions.',
    misconception: 'Temperature doesn\'t lower activation energy — that\'s what catalysts do. Temperature just gives more particles enough energy to reach it.',
  },

  {
    id: 'qq_c9', subject: 'Chemistry', topic: 'Chemical Reactions',
    difficulty: 'medium', type: 'dragdrop',
    question: 'Sort these changes into the correct category:',
    categories: ['Physical change', 'Chemical change'],
    items: [
      { text: 'Ice melting into water', category: 0 },
      { text: 'Wood burning', category: 1 },
      { text: 'Iron rusting', category: 1 },
      { text: 'Water evaporating', category: 0 },
    ],
    explanation: 'Physical changes are reversible and no new substance forms. Chemical changes are irreversible and new substances form.',
    reasoning: 'Burning and rusting produce new compounds (CO2, Fe2O3). Melting and evaporating only change the state — the substance remains the same.',
    misconception: 'Ice melting looks dramatic but is purely physical — the water molecules are unchanged.',
  },

  {
    id: 'qq_c10', subject: 'Chemistry', topic: 'Atomic Structure',
    difficulty: 'exam', type: 'mcq',
    question: 'An atom of chlorine has an atomic number of 17 and a mass number of 35. How many neutrons does it have?',
    options: ['17', '18', '35', '52'],
    correctIndex: 1,
    explanation: 'Neutrons = mass number − atomic number = 35 − 17 = 18.',
    reasoning: 'Mass number counts protons + neutrons. Atomic number counts protons only. Subtract to find neutrons.',
    misconception: 'Students often give the mass number (35) as the answer, or forget to subtract.',
  },

  // ════════════════════════════════════════════════════════
  // MATHS
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_m1', subject: 'Maths', topic: 'Percentages',
    difficulty: 'easy', type: 'mcq',
    question: 'What is 25% of 80?',
    options: ['10', '20', '25', '40'],
    correctIndex: 1,
    explanation: '25% of 80 = 80 ÷ 4 = 20.',
    reasoning: '25% = one quarter. Dividing by 4 is the quickest method.',
    misconception: 'Students sometimes calculate 25% of 80 as 25 × 80 ÷ 100 = 20 (correct) but get confused with 80% of 25.',
    steps: [
      'Convert 25% to a fraction: 25% = 25/100 = 1/4',
      'Divide 80 by 4: 80 ÷ 4 = 20',
      'Answer: 20',
    ],
  },

  {
    id: 'qq_m2', subject: 'Maths', topic: 'Fractions',
    difficulty: 'easy', type: 'mcq',
    question: 'Simplify the fraction 12/16.',
    options: ['2/3', '3/4', '4/5', '6/8'],
    correctIndex: 1,
    explanation: '12/16 = 3/4 (divide both by 4, the highest common factor).',
    reasoning: 'HCF of 12 and 16 is 4. 12÷4 = 3; 16÷4 = 4.',
    misconception: '6/8 is also a simplification but NOT in its simplest form. Always find the HCF.',
    steps: [
      'Find a common factor of 12 and 16 — both divide by 2: 6/8',
      'Check if 6 and 8 share another factor — both divide by 2 again: 3/4',
      'Check 3 and 4 share no common factor — 3/4 is fully simplified',
      'Shortcut: find the HCF of 12 and 16 (which is 4), then divide both by 4 in one step',
    ],
  },

  {
    id: 'qq_m3', subject: 'Maths', topic: 'Algebra',
    difficulty: 'medium', type: 'mcq',
    question: 'Solve: 3x + 7 = 22',
    options: ['x = 3', 'x = 5', 'x = 7', 'x = 9'],
    correctIndex: 1,
    explanation: '3x + 7 = 22 → 3x = 15 → x = 5.',
    reasoning: 'Subtract 7 from both sides first, then divide by 3.',
    misconception: 'Students sometimes subtract before dividing incorrectly — always isolate the variable step by step.',
    steps: [
      'Start: 3x + 7 = 22',
      'Subtract 7 from both sides: 3x = 22 − 7 = 15',
      'Divide both sides by 3: x = 15 ÷ 3 = 5',
      'Check: 3(5) + 7 = 15 + 7 = 22 ✓',
    ],
  },

  {
    id: 'qq_m4', subject: 'Maths', topic: 'Geometry',
    difficulty: 'medium', type: 'fillgap',
    question: 'The area of a rectangle with length 9 cm and width 4 cm is ___ cm².',
    options: ['26', '36', '13', '45'],
    correctIndex: 1,
    explanation: 'Area = length × width = 9 × 4 = 36 cm².',
    reasoning: 'Area of a rectangle is simply length multiplied by width.',
    misconception: 'Students sometimes confuse area with perimeter. Perimeter = 2(l + w) = 26 cm.',
    steps: [
      'Formula: Area = length × width',
      'Substitute: Area = 9 × 4',
      'Calculate: 9 × 4 = 36',
      'Units: area is always in square units → 36 cm²',
    ],
  },

  {
    id: 'qq_m5', subject: 'Maths', topic: 'Ratio & Proportion',
    difficulty: 'medium', type: 'mcq',
    question: 'Divide £120 in the ratio 2:3.',
    options: ['£40 and £80', '£48 and £72', '£50 and £70', '£60 and £60'],
    correctIndex: 1,
    explanation: '2:3 means 5 parts total. Each part = £120 ÷ 5 = £24. So: 2×£24 = £48 and 3×£24 = £72.',
    reasoning: 'First find the total number of parts, then find one part\'s value, then multiply for each share.',
    misconception: 'Students often just divide by 2 and 3 separately — but you must find the total number of shares first.',
    steps: [
      'Add the parts of the ratio: 2 + 3 = 5 parts in total',
      'Find the value of one part: £120 ÷ 5 = £24',
      'Work out the first share: 2 × £24 = £48',
      'Work out the second share: 3 × £24 = £72',
      'Check: £48 + £72 = £120 ✓',
    ],
  },

  {
    id: 'qq_m6', subject: 'Maths', topic: 'Number',
    difficulty: 'easy', type: 'truefalse',
    question: 'A prime number has exactly two factors: 1 and itself.',
    correct: true,
    explanation: 'True — this is the definition of a prime number.',
    reasoning: 'For example, 7 is prime (factors: 1, 7). 9 is not prime (factors: 1, 3, 9).',
    misconception: '1 is NOT a prime number because it has only one factor (itself). This is a common exam catch.',
  },

  {
    id: 'qq_m7', subject: 'Maths', topic: 'Algebra',
    difficulty: 'hard', type: 'mcq',
    question: 'Expand and simplify: (x + 3)(x − 2)',
    options: ['x² + x − 6', 'x² − x − 6', 'x² + 5x − 6', 'x² + x + 6'],
    correctIndex: 0,
    explanation: '(x + 3)(x − 2) = x² − 2x + 3x − 6 = x² + x − 6.',
    reasoning: 'Use FOIL: First (x·x), Outer (x·−2), Inner (3·x), Last (3·−2). Collect like terms.',
    misconception: 'Students often forget the "Last" (3 × −2 = −6) or get the middle term wrong — always do all four parts of FOIL.',
    steps: [
      'FOIL — First: x × x = x²',
      'FOIL — Outer: x × (−2) = −2x',
      'FOIL — Inner: 3 × x = +3x',
      'FOIL — Last: 3 × (−2) = −6',
      'Collect like terms: x² + (−2x + 3x) − 6 = x² + x − 6',
    ],
  },

  {
    id: 'qq_m8', subject: 'Maths', topic: 'Statistics',
    difficulty: 'medium', type: 'mcq',
    question: 'The ages of 5 students are: 14, 15, 14, 16, 16. What is the median?',
    options: ['14', '15', '15.5', '16'],
    correctIndex: 1,
    explanation: 'Ordered: 14, 14, 15, 16, 16. The middle value (3rd of 5) is 15.',
    reasoning: 'Median = middle value when data is in order. For 5 values, the 3rd value is the median.',
    misconception: 'Students often forget to ORDER the data first before finding the median.',
    steps: [
      'Write the values in order from smallest to largest: 14, 14, 15, 16, 16',
      'Count the values: there are 5',
      'Find the middle position: (5 + 1) ÷ 2 = 3rd value',
      'The 3rd value in the ordered list is 15',
    ],
  },

  {
    id: 'qq_m9', subject: 'Maths', topic: 'Geometry',
    difficulty: 'hard', type: 'mcq',
    question: 'A triangle has angles of 47° and 65°. What is the third angle?',
    options: ['58°', '68°', '78°', '88°'],
    correctIndex: 1,
    explanation: 'Angles in a triangle sum to 180°. Third angle = 180 − 47 − 65 = 68°.',
    reasoning: 'This is a fundamental property of triangles — always starts with "angles in a triangle sum to 180°".',
    misconception: 'Students sometimes add the two given angles but forget to subtract from 180, getting 112° instead.',
    steps: [
      'Rule: angles in a triangle always add up to 180°',
      'Add the two known angles: 47 + 65 = 112°',
      'Subtract from 180: 180 − 112 = 68°',
      'The third angle is 68°',
    ],
  },

  {
    id: 'qq_m10', subject: 'Maths', topic: 'Algebra',
    difficulty: 'exam', type: 'mcq',
    question: 'Factorise: x² + 5x + 6',
    options: ['(x + 2)(x + 3)', '(x + 1)(x + 6)', '(x + 2)(x − 3)', '(x − 2)(x − 3)'],
    correctIndex: 0,
    explanation: 'Find two numbers that multiply to 6 and add to 5: these are 2 and 3. So: (x + 2)(x + 3).',
    reasoning: 'Factorising reverses expanding. Think: what two numbers multiply to give the constant (6) and add to give the middle coefficient (5)?',
    misconception: 'Students try 1×6 first — but 1+6 = 7 ≠ 5. Always check both conditions (product AND sum).',
    steps: [
      'Look at the constant (6) — find two numbers that multiply to make 6: options are 1×6 or 2×3',
      'Check which pair also adds to the middle coefficient (5): 1+6 = 7 ✗, 2+3 = 5 ✓',
      'Write the factorised form: (x + 2)(x + 3)',
      'Check by expanding: x² + 3x + 2x + 6 = x² + 5x + 6 ✓',
    ],
  },

  // ════════════════════════════════════════════════════════
  // SOCIOLOGY
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_s1', subject: 'Sociology', topic: 'Socialisation',
    difficulty: 'easy', type: 'mcq',
    question: 'What is "primary socialisation"?',
    options: [
      'Socialisation that happens in schools and workplaces',
      'The process of learning norms and values in the family during early childhood',
      'Socialisation through peer groups and media',
      'The government\'s role in teaching citizens how to behave',
    ],
    correctIndex: 1,
    explanation: 'Primary socialisation occurs in the family in early childhood — it\'s where we first learn norms, values, and expected behaviours.',
    reasoning: 'The family is the primary agent of socialisation. Schools, media, and peers come later and are secondary agents.',
    misconception: '"Primary" refers to the first/earliest stage, not the most important or school-based learning.',
  },

  {
    id: 'qq_s2', subject: 'Sociology', topic: 'Family',
    difficulty: 'easy', type: 'truefalse',
    question: 'A nuclear family consists of two parents and their dependent children.',
    correct: true,
    explanation: 'True — a nuclear family is the most basic unit: two parents (traditionally married) and their children.',
    reasoning: 'Other family types include extended (+ grandparents/relatives), lone-parent, reconstituted (step-families), and same-sex couples.',
    misconception: 'Students sometimes include grandparents in the nuclear family definition — but that\'s an extended family.',
  },

  {
    id: 'qq_s3', subject: 'Sociology', topic: 'Social Class',
    difficulty: 'medium', type: 'mcq',
    question: 'What do Marxists argue is the main purpose of education?',
    options: [
      'To develop individual talents and abilities',
      'To reproduce class inequality by passing advantages to the wealthy',
      'To create social mobility for working-class students',
      'To prepare students for democratic participation',
    ],
    correctIndex: 1,
    explanation: 'Marxists (e.g. Bowles and Gintis) argue education reproduces capitalism by socialising working-class students to accept subordination.',
    reasoning: 'The "hidden curriculum" teaches obedience and punctuality — preparing workers, not thinkers.',
    misconception: 'Functionalists argue education creates meritocracy and social mobility — this is the opposing view to Marxism.',
  },

  {
    id: 'qq_s4', subject: 'Sociology', topic: 'Research Methods',
    difficulty: 'medium', type: 'mcq',
    question: 'What is a strength of using official statistics in sociological research?',
    options: [
      'They give access to people\'s private feelings and motivations',
      'They are already collected, large-scale, and allow trends over time to be identified',
      'They are always accurate because they are produced by the government',
      'They allow sociologists to discover unexpected findings',
    ],
    correctIndex: 1,
    explanation: 'Official statistics are cheap to use (already collected), cover large populations, and allow historical trends to be compared.',
    reasoning: 'They are practical and quantitative — but they measure what governments choose to measure, which may not capture all social reality.',
    misconception: 'Official statistics are NOT always accurate — crime statistics, for example, miss unreported crime. Interpretivist sociologists are critical of them.',
  },

  {
    id: 'qq_s5', subject: 'Sociology', topic: 'Gender',
    difficulty: 'medium', type: 'truefalse',
    question: 'Feminists argue that gender inequality in families is mainly caused by biological differences between men and women.',
    correct: false,
    explanation: 'False — feminists argue gender inequality is socially constructed, not biological.',
    reasoning: 'Feminists see the patriarchal family as a social institution that oppresses women — through unpaid domestic work and the "dual burden".',
    misconception: 'Biological arguments (women are "naturally" carers) are those feminists REJECT, not support.',
  },

  {
    id: 'qq_s6', subject: 'Sociology', topic: 'Education',
    difficulty: 'hard', type: 'mcq',
    question: 'Paul Willis studied working-class boys in school. What did he find?',
    options: [
      'Working-class boys achieved highly because of strong family support',
      '"The Lads" formed a counter-school culture that ultimately reproduced their class position',
      'Schools successfully created meritocracy for all social classes',
      'Middle-class boys were most likely to form anti-school subcultures',
    ],
    correctIndex: 1,
    explanation: '"The Lads" (Willis 1977) rejected school values, saw conforming as "effeminate," and ended up in manual labour — reproducing working-class status.',
    reasoning: 'Willis showed that class reproduction isn\'t just imposed from above — working-class students actively resist but in ways that trap them.',
    misconception: 'Willis\'s findings are often misread as showing schools fail working-class students — the key point is that they reject school actively.',
  },

  {
    id: 'qq_s7', subject: 'Sociology', topic: 'Crime',
    difficulty: 'hard', type: 'mcq',
    question: 'What does the "dark figure of crime" refer to?',
    options: [
      'Crimes committed at night',
      'Crimes committed by anonymous offenders',
      'The gap between official crime statistics and actual crime levels',
      'The number of criminals who are never caught',
    ],
    correctIndex: 2,
    explanation: 'The "dark figure" is all crime that is unreported, unrecorded, or not prosecuted — official statistics massively undercount real crime.',
    reasoning: 'Victim surveys (like the Crime Survey for England and Wales) reveal far more crime than police statistics, highlighting the dark figure.',
    misconception: 'It\'s not about unknown criminals — it\'s about crimes that are committed but never appear in official data.',
  },

  {
    id: 'qq_s8', subject: 'Sociology', topic: 'Social Class',
    difficulty: 'exam', type: 'mcq',
    question: 'A sociologist wants to understand why working-class students underachieve at school. Which research method would BEST reveal this?',
    options: [
      'Official statistics on GCSE results by social class',
      'Structured questionnaires with students',
      'Unstructured interviews and participant observation in schools',
      'Content analysis of textbooks',
    ],
    correctIndex: 2,
    explanation: 'Unstructured interviews and participant observation reveal the meanings, motivations, and experiences that statistics cannot capture.',
    reasoning: 'Interpretivist methods give rich, qualitative data about why underachievement happens. Willis used exactly this method.',
    misconception: 'Statistics show THAT there is underachievement — but to understand WHY, you need qualitative methods that access people\'s perspectives.',
  },

  // ════════════════════════════════════════════════════════
  // ENGLISH LANGUAGE
  // ════════════════════════════════════════════════════════

  {
    id: 'qq_e1', subject: 'English', topic: 'Language Techniques',
    difficulty: 'easy', type: 'mcq',
    question: 'What is alliteration?',
    options: [
      'Giving human qualities to non-human things',
      'The repetition of the same initial consonant sound in nearby words',
      'Using the same vowel sound in nearby words',
      'Describing something as if it were something else (saying it IS)',
    ],
    correctIndex: 1,
    explanation: 'Alliteration is the repetition of initial consonant sounds, e.g. "Peter Piper picked a peck."',
    reasoning: 'Alliteration creates rhythm, draws attention to key phrases, and can reinforce meaning through sound.',
    misconception: 'Assonance is the vowel version; alliteration is consonants. Metaphor says something IS something else.',
  },

  {
    id: 'qq_e2', subject: 'English', topic: 'Language Techniques',
    difficulty: 'easy', type: 'mcq',
    question: 'What is personification?',
    options: [
      'Comparing two things using "like" or "as"',
      'Exaggerating for dramatic effect',
      'Giving human qualities or attributes to non-human things',
      'Using one word that sounds like its meaning',
    ],
    correctIndex: 2,
    explanation: 'Personification attributes human qualities to objects, nature, or ideas, e.g. "The wind screamed through the trees."',
    reasoning: 'It creates vivid imagery and can evoke emotion by making abstract or inanimate things relatable.',
    misconception: 'A simile compares using "like" or "as"; metaphor says IS; personification specifically gives HUMAN qualities.',
  },

  {
    id: 'qq_e3', subject: 'English', topic: 'Language Techniques',
    difficulty: 'medium', type: 'matchpairs',
    question: 'Match each language technique to its definition:',
    pairs: [
      { left: 'Simile', right: 'Comparing two things using "like" or "as"' },
      { left: 'Metaphor', right: 'Saying something IS something else (direct comparison)' },
      { left: 'Hyperbole', right: 'Deliberate exaggeration for dramatic effect' },
      { left: 'Onomatopoeia', right: 'A word that sounds like what it describes (e.g. "buzz")' },
    ],
    explanation: 'These are the core language techniques — being precise about definitions gains marks.',
    reasoning: 'Saying "it\'s a metaphor because it compares two things" is not enough — you must explain what effect it creates and why the writer chose it.',
    misconception: 'A simile uses "like" or "as" — without those words, it\'s a metaphor. Don\'t call all comparisons similes.',
  },

  {
    id: 'qq_e4', subject: 'English', topic: 'Reading Skills',
    difficulty: 'medium', type: 'mcq',
    question: 'What is the effect of a writer using a very short sentence?',
    options: [
      'It confuses the reader',
      'It slows the pace down and creates a reflective tone',
      'It creates impact, emphasis, or tension',
      'It always shows the character is angry',
    ],
    correctIndex: 2,
    explanation: 'Short sentences create impact, emphasise a point, or build tension — especially when following longer sentences.',
    reasoning: 'The contrast between long and short sentences is what creates the effect. A short sentence after long ones hits harder.',
    misconception: 'Short sentences don\'t always mean anger — context matters. The key is the emphasis and pace change they create.',
  },

  {
    id: 'qq_e5', subject: 'English', topic: 'Reading Skills',
    difficulty: 'hard', type: 'mcq',
    question: 'In AQA English Language Paper 1 Q4, you must evaluate how the writer creates a particular effect. What is the BEST way to structure your response?',
    options: [
      'Quote the technique, name it, and say if you liked it',
      'State your view on the writer\'s success, then analyse specific language choices and explain how they create effects',
      'Summarise the whole passage, then explain the techniques at the end',
      'List every technique you can find with one-line comments on each',
    ],
    correctIndex: 1,
    explanation: 'Q4 asks for critical evaluation. Lead with a clear view, use evidence, and analyse the effect — not just identify techniques.',
    reasoning: 'Evaluation means judging how effectively the writer achieves their purpose. Evidence and analysis support that judgement.',
    misconception: 'Simply listing techniques ("There is alliteration... there is a metaphor...") gains few marks. You need analysis of effect.',
  },

  {
    id: 'qq_e6', subject: 'English', topic: 'Writing Skills',
    difficulty: 'medium', type: 'truefalse',
    question: 'In descriptive writing, using all five senses makes your writing more effective.',
    correct: true,
    explanation: 'True — engaging sight, sound, smell, taste, and touch creates an immersive, vivid description.',
    reasoning: 'Readers connect with sensory details because they activate personal memory and experience. Abstract description feels distant; sensory description feels real.',
    misconception: 'Students often only describe what they see — but smell and sound are often the most powerful and memorable senses.',
  },
]
