// ─── Quick Quiz Question Bank ──────────────────────────────────────────────────
// Types: mcq | truefalse | fillgap | matchpairs | sequence | dragdrop
// Difficulties: easy | medium | hard | exam
// Each question has: explanation (what the correct answer means),
//                    reasoning (why it's correct),
//                    misconception (common wrong idea, optional)

export const QUICK_QUIZ_QUESTIONS = [

  // ════════════════════════════════════════════════════════
  // HISTORY — Medicine Through Time
  // tag: thematic label used for adaptive weak-spot tracking.
  //      When a student answers wrong, their weakness is recorded
  //      against this tag so the app can surface relevant content.
  // ════════════════════════════════════════════════════════

  // ── Q1-8: Medieval period ─────────────────────────────

  {
    id: 'qq_h1', subject: 'History', topic: 'Medieval Medicine', tag: 'medieval-causes',
    difficulty: 'easy', type: 'mcq',
    question: 'What were the medieval explanations for disease?',
    options: ['Punishment from God, the Four Humours and miasma', 'Bacteria, viruses and parasites', 'Bad diet, lack of sleep and cold weather', 'Four Humours, germ theory and surgery'],
    correctIndex: 0,
    explanation: 'Medieval doctors blamed disease on God\'s punishment, imbalance of the Four Humours, and miasma (bad air).',
    reasoning: 'Without microscopes or modern science, medieval people relied on religion and ancient theories to explain illness.',
  },

  {
    id: 'qq_h2', subject: 'History', topic: 'Medieval Medicine', tag: 'four-humours',
    difficulty: 'medium', type: 'mcq',
    question: 'What was the Theory of the Four Humours?',
    options: ['Health depended on balancing blood, phlegm, black bile and yellow bile', 'Disease was caused by an imbalance of fire, water, earth and air', 'The body contained four organs that controlled all illness', 'Bloodletting restored balance between the heart, lungs, liver and brain'],
    correctIndex: 0,
    explanation: 'The Four Humours were blood, phlegm, yellow bile and black bile. Illness was caused by their imbalance.',
    reasoning: 'Based on Hippocrates and developed by Galen, this theory dominated medicine for over 1,400 years.',
    misconception: 'The four humours (body fluids) are different from the four elements (fire, water, earth, air).',
  },

  {
    id: 'qq_h3', subject: 'History', topic: 'Medieval Medicine', tag: 'miasma',
    difficulty: 'easy', type: 'truefalse',
    question: 'Miasma Theory was the belief that disease was caused by bad air.',
    correct: true,
    explanation: 'True — miasma theory held that foul-smelling air from rotting matter spread disease.',
    reasoning: 'This explained why crowded, dirty cities had more disease. It was wrong about the cause but led to useful clean-up actions.',
  },

  {
    id: 'qq_h4', subject: 'History', topic: 'Medieval Medicine', tag: 'galen',
    difficulty: 'hard', type: 'mcq',
    question: 'Why did Galen remain influential for over 1,400 years?',
    options: ['His ideas were proven correct by later experiments', 'His ideas matched Church teachings and were rarely challenged', 'He wrote in English so everyone could read his work', 'Kings and rulers ordered doctors to follow his methods'],
    correctIndex: 1,
    explanation: 'The Church backed Galen\'s theories because they fitted Christian ideas. Challenging Galen meant challenging the Church.',
    reasoning: 'This combination of religious and institutional authority made it almost impossible for doctors to question his work.',
    misconception: 'Galen made significant errors — e.g. believing the liver made blood — but these went unchallenged for centuries.',
  },

  {
    id: 'qq_h5', subject: 'History', topic: 'Medieval Medicine', tag: 'four-humours',
    difficulty: 'easy', type: 'mcq',
    question: 'What was bloodletting used for in medieval medicine?',
    options: ['Cleaning wounds to prevent infection', 'Removing blood to rebalance the humours', 'Testing patients for the presence of disease', 'Preparing the body for surgery'],
    correctIndex: 1,
    explanation: 'Bloodletting removed blood to restore the balance of the Four Humours — a core medieval treatment.',
    reasoning: 'If a patient had "too much blood" (fever, red face), removing blood was thought to bring the humours back into balance.',
  },

  {
    id: 'qq_h6', subject: 'History', topic: 'Medieval Medicine', tag: 'medieval-prevention',
    difficulty: 'medium', type: 'mcq',
    question: 'How did medieval people try to prevent disease?',
    options: ['Washing hands regularly and boiling water', 'Taking herbal medicines and vitamins', 'Prayer, fasting, purifying the air and religious actions', 'Quarantine, vaccination and isolation'],
    correctIndex: 2,
    explanation: 'Medieval prevention focused on religion (prayer, fasting) and miasma (purifying the air by burning herbs or carrying posies).',
    reasoning: 'Since disease was blamed on God and bad air, prevention focused on pleasing God and avoiding bad smells.',
  },

  {
    id: 'qq_h7', subject: 'History', topic: 'Medieval Medicine', tag: 'medieval-practitioners',
    difficulty: 'medium', type: 'mcq',
    question: 'What did physicians, apothecaries and barber-surgeons each do?',
    options: ['All three performed surgery, just at different skill levels', 'Physicians diagnosed, apothecaries made remedies, barber-surgeons carried out simple operations', 'Physicians made medicines, apothecaries diagnosed, barber-surgeons prayed for patients', 'All three were trained at the same university and did similar work'],
    correctIndex: 1,
    explanation: 'Physicians (university-trained) diagnosed; apothecaries made remedies; barber-surgeons performed practical procedures.',
    reasoning: 'Most people could only afford barber-surgeons. Physicians were expensive and for the wealthy.',
  },

  {
    id: 'qq_h8', subject: 'History', topic: 'Medieval Medicine', tag: 'black-death',
    difficulty: 'hard', type: 'mcq',
    question: 'How did people respond to the Black Death in 1348?',
    options: ['They isolated themselves and developed vaccines', 'Prayer, pilgrimages, flagellation, bloodletting and cleaning streets', 'They used antiseptic techniques and herbal antibiotics', 'They burned down infected buildings and moved to new towns'],
    correctIndex: 1,
    explanation: 'Responses reflected dominant theories: religious responses (prayer, flagellation) and miasma responses (cleaning streets).',
    reasoning: 'Since people believed in God\'s punishment and miasma, they tried to appease God and remove bad air — neither stopped plague bacteria.',
  },

  // ── Q9-14: Renaissance period ─────────────────────────

  {
    id: 'qq_h9', subject: 'History', topic: 'Renaissance Medicine', tag: 'scientific-method',
    difficulty: 'hard', type: 'mcq',
    question: 'What changed in Renaissance medicine compared to the medieval period?',
    options: ['Doctors stopped believing in the Four Humours', 'Observation and experimentation became more important', 'The Church stopped influencing medical education', 'Doctors began vaccinating patients against disease'],
    correctIndex: 1,
    explanation: 'The Renaissance brought a scientific revolution: doctors began to observe and test rather than accept ancient authority.',
    reasoning: 'This shift in method — from "trust Galen" to "test it yourself" — was more important than any single discovery.',
  },

  {
    id: 'qq_h10', subject: 'History', topic: 'Renaissance Medicine', tag: 'vesalius',
    difficulty: 'exam', type: 'mcq',
    question: 'Why was Vesalius important to the development of medicine?',
    options: ['He discovered that bacteria caused disease', 'He invented surgical anaesthetic to prevent pain', 'He corrected Galen through careful human dissection', 'He published the first medical textbook in English'],
    correctIndex: 2,
    explanation: 'Vesalius used direct observation through human dissection to show Galen had made over 300 errors in his anatomy.',
    reasoning: 'This was revolutionary — it showed that 1,400 years of authority could be wrong if you actually tested the evidence.',
    misconception: 'Vesalius did not discover the cause of disease; his contribution was to anatomy and scientific method.',
  },

  {
    id: 'qq_h11', subject: 'History', topic: 'Renaissance Medicine', tag: 'printing-press',
    difficulty: 'medium', type: 'mcq',
    question: 'Why was the printing press important for medical progress?',
    options: ['It allowed doctors to communicate instantly across Europe', 'It replaced the Church as the authority on medicine', 'It spread new medical knowledge faster', 'It made medical books cheaper to buy for patients'],
    correctIndex: 2,
    explanation: 'The printing press (1450s) meant Vesalius\' corrected anatomy spread across Europe rapidly rather than slowly by hand-copying.',
    reasoning: 'Before printing, new ideas were limited to a few copied manuscripts. Printing accelerated the sharing of knowledge.',
  },

  {
    id: 'qq_h12', subject: 'History', topic: 'Renaissance Medicine', tag: 'royal-society',
    difficulty: 'hard', type: 'mcq',
    question: 'What did the Royal Society (founded 1660) encourage?',
    options: ['Bloodletting and traditional medical treatments', 'Church control of all medical research', 'Publication, experimentation and sharing evidence', 'The training of more apothecaries and barber-surgeons'],
    correctIndex: 2,
    explanation: 'The Royal Society promoted scientific inquiry: publishing findings, running experiments and sharing evidence across Europe.',
    reasoning: 'This institutionalised the scientific method, making observation and testing the expected standard.',
  },

  {
    id: 'qq_h13', subject: 'History', topic: 'Renaissance Medicine', tag: 'harvey',
    difficulty: 'exam', type: 'mcq',
    question: 'Why was Harvey significant in the history of medicine?',
    options: ['He proved germs caused infectious disease', 'He proved blood circulates around the body', 'He invented the stethoscope to listen to the heart', 'He performed the first successful heart surgery'],
    correctIndex: 1,
    explanation: 'Harvey\'s 1628 discovery proved blood circulates — contradicting Galen\'s belief that the liver continuously made new blood.',
    reasoning: 'Though it did not immediately improve treatments, it showed the heart as a pump and laid groundwork for modern cardiovascular science.',
    misconception: 'Harvey\'s discovery did NOT immediately improve treatments — bloodletting continued for decades after.',
  },

  {
    id: 'qq_h14', subject: 'History', topic: 'Renaissance Medicine', tag: 'great-plague',
    difficulty: 'hard', type: 'mcq',
    question: 'How did London respond to the Great Plague of 1665?',
    options: ['They discovered the plague was caused by rat fleas', 'They developed the first effective vaccine against plague', 'Plague orders, shutting houses and controlling movement', 'The government built new hospitals to treat the sick'],
    correctIndex: 2,
    explanation: 'London\'s response included plague orders, shutting infected houses, controlling movement and mass graves.',
    reasoning: 'These measures reflected miasma and isolation thinking — not germ theory — but isolation did slow the spread.',
  },

  // ── Q15-24: 19th century ──────────────────────────────

  {
    id: 'qq_h15', subject: 'History', topic: '19th-Century Medicine', tag: 'pasteur',
    difficulty: 'exam', type: 'mcq',
    question: 'Why was Pasteur important in the history of medicine?',
    options: ['He invented the first antibiotic drug', 'He proved Galen\'s Four Humours theory was correct', 'He provided strong evidence for Germ Theory', 'He improved hospital sanitation after the Crimean War'],
    correctIndex: 2,
    explanation: 'Pasteur\'s 1861 experiments proved that microbes cause decay — providing the foundation for Germ Theory.',
    reasoning: 'This transformed medicine: if microbes cause disease, you can identify, target and prevent specific diseases.',
    misconception: 'Pasteur proposed the theory but it was Koch who identified specific bacteria causing specific diseases.',
  },

  {
    id: 'qq_h16', subject: 'History', topic: '19th-Century Medicine', tag: 'nightingale',
    difficulty: 'hard', type: 'mcq',
    question: 'How did Florence Nightingale improve hospitals?',
    options: ['She introduced the use of anaesthetics during surgery', 'Better hygiene, nursing standards and lower death rates at Scutari', 'She campaigned for the Public Health Acts of the 1870s', 'She discovered that bacteria caused infection in wounds'],
    correctIndex: 1,
    explanation: 'At Scutari during the Crimean War, Nightingale improved sanitation and nursing standards, dramatically reducing death rates.',
    reasoning: 'Her statistical evidence linking cleanliness to survival changed how hospitals were run across Britain.',
    misconception: 'Nightingale did not understand germ theory — she focused on cleanliness from a miasma perspective, but the results were the same.',
  },

  {
    id: 'qq_h17', subject: 'History', topic: '19th-Century Medicine', tag: 'anaesthetics',
    difficulty: 'medium', type: 'mcq',
    question: 'What problem did anaesthetics solve?',
    options: ['Post-operative infection from wounds', 'Blood loss during surgery', 'Pain during surgery', 'The spread of disease between patients'],
    correctIndex: 2,
    explanation: 'Anaesthetics (ether 1846, chloroform 1847) allowed surgeons to operate on patients without them being conscious and in pain.',
    reasoning: 'Before anaesthetics, surgeons worked with incredible speed. Anaesthetics allowed longer, more careful operations.',
    misconception: 'Anaesthetics solved pain, not infection. Infection remained a major killer until Lister\'s antiseptic methods.',
  },

  {
    id: 'qq_h18', subject: 'History', topic: '19th-Century Medicine', tag: 'antiseptic-surgery',
    difficulty: 'hard', type: 'mcq',
    question: 'Why was Lister\'s antiseptic surgery important?',
    options: ['It eliminated pain during operations for the first time', 'It proved that surgeons were the main cause of infection', 'Carbolic acid reduced infection during and after operations', 'It replaced the need for anaesthetics in surgery'],
    correctIndex: 2,
    explanation: 'Lister used carbolic acid spray to kill germs during surgery. Death rates from post-operative infection fell dramatically.',
    reasoning: 'Inspired by Pasteur\'s Germ Theory, Lister applied it practically — showing that controlling germs saves lives.',
    misconception: 'Antiseptics killed germs during surgery; aseptics (sterile technique) came later to prevent germs entering in the first place.',
  },

  {
    id: 'qq_h19', subject: 'History', topic: '19th-Century Medicine', tag: 'public-health',
    difficulty: 'hard', type: 'mcq',
    question: 'What did the Public Health Act of 1875 do?',
    options: ['It created the NHS and free healthcare for all', 'It banned miasma theory in medical education', 'It forced local authorities to improve sanitation and water supplies', 'It made vaccination against smallpox compulsory'],
    correctIndex: 2,
    explanation: 'The 1875 Act made it compulsory for local authorities to provide clean water, sewers and sanitation — unlike the voluntary 1848 Act.',
    reasoning: 'The shift from voluntary (1848) to compulsory (1875) is the key change. It ended the laissez-faire approach to public health.',
  },

  {
    id: 'qq_h20', subject: 'History', topic: '19th-Century Medicine', tag: 'vaccination',
    difficulty: 'hard', type: 'mcq',
    question: 'Why was Jenner\'s vaccination important?',
    options: ['It was the first cure for an infectious disease', 'It protected people against smallpox using cowpox', 'It proved that germs caused disease for the first time', 'It was the first government-funded medical programme'],
    correctIndex: 1,
    explanation: 'In 1796, Jenner showed that cowpox infection gave immunity to the deadly smallpox virus.',
    reasoning: 'Vaccination was a major breakthrough in prevention — stopping disease before it started rather than treating it after.',
    misconception: 'Jenner did not understand germ theory and could not explain WHY vaccination worked — he just showed that it did.',
  },

  {
    id: 'qq_h21', subject: 'History', topic: '19th-Century Medicine', tag: 'john-snow',
    difficulty: 'hard', type: 'mcq',
    question: 'Who was John Snow and why is he significant?',
    options: ['The doctor who invented chloroform anaesthetic', 'The doctor who linked cholera to contaminated water', 'The surgeon who first used carbolic acid antiseptic', 'The campaigner who forced the 1875 Public Health Act'],
    correctIndex: 1,
    explanation: 'John Snow mapped cholera cases around the Broad Street pump in 1854, linking cholera to contaminated water.',
    reasoning: 'His evidence-based approach challenged miasma theory and showed disease could spread through water, not just air.',
    misconception: 'Snow was right about water contamination but did not know about germ theory — it was not proven until 1861.',
  },

  {
    id: 'qq_h22', subject: 'History', topic: '19th-Century Medicine', tag: 'john-snow',
    difficulty: 'exam', type: 'mcq',
    question: 'What evidence did John Snow use to link cholera to contaminated water?',
    options: ['He injected cholera bacteria into laboratory animals', 'He proved miasma was absent near the Broad Street pump', 'Cholera cases clustered around the Broad Street pump on his map', 'He tested water samples under a microscope for bacteria'],
    correctIndex: 2,
    explanation: 'Snow mapped every cholera death and found they clustered around the Broad Street water pump. Removing the handle stopped the outbreak.',
    reasoning: 'This was epidemiology — using patterns and evidence, not laboratory proof. It was compelling even without germ theory to explain it.',
  },

  {
    id: 'qq_h23', subject: 'History', topic: '19th-Century Medicine', tag: 'pasteur',
    difficulty: 'hard', type: 'mcq',
    question: 'What evidence supported Germ Theory?',
    options: ['Lister\'s use of carbolic acid during surgery', 'John Snow\'s mapping of the cholera outbreak', 'Pasteur\'s experiments on microbes and decay', 'Nightingale\'s statistical data from Scutari'],
    correctIndex: 2,
    explanation: 'Pasteur\'s swan-neck flask experiments (1859-61) showed microbes cause decay — providing the basis for Germ Theory.',
    reasoning: 'His controlled experiments proved microbes come from outside and cause change, not that matter spontaneously generates germs.',
  },

  {
    id: 'qq_h24', subject: 'History', topic: '19th-Century Medicine', tag: 'germ-theory',
    difficulty: 'exam', type: 'mcq',
    question: 'How did microbiology change medicine?',
    options: ['It proved the Four Humours theory was basically correct', 'It identified specific disease-causing microbes', 'It allowed doctors to see inside the body without surgery', 'It replaced the need for surgery in most cases'],
    correctIndex: 1,
    explanation: 'Microbiology allowed scientists to identify the specific bacteria or viruses causing specific diseases.',
    reasoning: 'If you can identify the cause, you can develop targeted treatments, vaccines and prevention methods.',
  },

  // ── Q25-50: Modern medicine ───────────────────────────

  {
    id: 'qq_h25', subject: 'History', topic: 'Modern Medicine', tag: 'nhs',
    difficulty: 'medium', type: 'fillgap',
    question: 'The NHS was established in ___.',
    options: ['1928', '1939', '1948', '1960'],
    correctIndex: 2,
    explanation: 'The NHS was founded on 5 July 1948 by Minister of Health Aneurin Bevan.',
    reasoning: 'This date follows WWII (which proved government could run national healthcare) and the Beveridge Report (1942).',
    misconception: '1928 is when Fleming discovered penicillin — a different important date.',
  },

  {
    id: 'qq_h26', subject: 'History', topic: 'Modern Medicine', tag: 'nhs',
    difficulty: 'hard', type: 'mcq',
    question: 'Why was the NHS important when it was founded in 1948?',
    options: ['It introduced the first effective antibiotics', 'It improved access to healthcare for everyone', 'It trained more surgeons after wartime losses', 'It replaced all private hospitals with public ones'],
    correctIndex: 1,
    explanation: 'The NHS provided free healthcare at point of use for all — transforming access for those who previously could not afford treatment.',
    reasoning: 'Before 1948, many people avoided seeking medical care because they could not pay. Universal access changed life expectancy significantly.',
  },

  {
    id: 'qq_h27', subject: 'History', topic: 'Modern Medicine', tag: 'diagnosis',
    difficulty: 'medium', type: 'mcq',
    question: 'How did blood tests improve diagnosis?',
    options: ['They allowed surgeons to operate without pain', 'They revealed internal health conditions', 'They replaced the need for X-rays in hospitals', 'They identified which antibiotic to use for infection'],
    correctIndex: 1,
    explanation: 'Blood tests reveal a wide range of internal conditions — from anaemia to diabetes to infection markers — without invasive procedures.',
    reasoning: 'This shifted diagnosis from observation alone to laboratory evidence, making it more accurate and precise.',
  },

  {
    id: 'qq_h28', subject: 'History', topic: 'Modern Medicine', tag: 'diagnosis',
    difficulty: 'hard', type: 'mcq',
    question: 'How did scans (X-ray, MRI, CT) improve diagnosis?',
    options: ['They replaced the need for blood tests', 'They allowed doctors to see inside the body without surgery', 'They proved that tumours were caused by bacteria', 'They made it possible to perform surgery without anaesthetic'],
    correctIndex: 1,
    explanation: 'Imaging technology allows doctors to diagnose internal problems — broken bones, tumours, organ disease — without operating.',
    reasoning: 'Each step in imaging (X-ray 1895 → CT → MRI) reduced the risk of diagnosis while improving accuracy.',
  },

  {
    id: 'qq_h29', subject: 'History', topic: 'Modern Medicine', tag: 'lifestyle-factors',
    difficulty: 'easy', type: 'mcq',
    question: 'What are lifestyle factors in causing modern disease?',
    options: ['Bacteria, viruses, genetics and age', 'Weather, poverty, overcrowding and pollution', 'Diet, smoking, exercise, alcohol and stress', 'Work, education, housing and income'],
    correctIndex: 2,
    explanation: 'Lifestyle factors are personal choices and habits — diet, smoking, exercise, alcohol and stress — that influence disease risk.',
    reasoning: 'Understanding lifestyle factors shifted medicine towards prevention: advising people on behaviour that reduces cancer and heart disease risk.',
  },

  {
    id: 'qq_h30', subject: 'History', topic: 'Modern Medicine', tag: 'genetics',
    difficulty: 'hard', type: 'mcq',
    question: 'Why are genetics important in modern medicine?',
    options: ['They proved that all diseases are inherited', 'They replaced the need for drug treatments', 'They help explain inherited disease and risk', 'They showed that vaccination is unnecessary'],
    correctIndex: 2,
    explanation: 'Genetic understanding helps identify inherited conditions (like cystic fibrosis, BRCA mutations) and predict disease risk.',
    reasoning: 'Genetics represents a new frontier: rather than just treating disease, medicine can identify risk before symptoms appear.',
  },

  {
    id: 'qq_h31', subject: 'History', topic: 'Modern Medicine', tag: 'penicillin',
    difficulty: 'hard', type: 'mcq',
    question: 'How did Alexander Fleming discover penicillin in 1928?',
    options: ['He deliberately tested mould samples on bacteria in a controlled trial', 'He noticed mould killing bacteria on an accidentally contaminated Petri dish', 'He was asked by the government to find a cure for bacterial infection', 'He extracted the compound from a naturally occurring plant'],
    correctIndex: 1,
    explanation: 'Fleming noticed that Penicillium mould had killed the bacteria on a contaminated Petri dish he had left uncovered.',
    reasoning: 'This was chance (serendipity), but Fleming had the knowledge and curiosity to recognise what he was seeing.',
    misconception: 'Fleming discovered penicillin but could not develop it into a medicine. Florey and Chain made it into an effective drug in the 1940s.',
  },

  {
    id: 'qq_h32', subject: 'History', topic: 'Modern Medicine', tag: 'penicillin',
    difficulty: 'hard', type: 'mcq',
    question: 'Why was penicillin significant in the history of medicine?',
    options: ['It was the first drug to target cancer cells', 'It became the first widely used antibiotic', 'It proved that all diseases were caused by bacteria', 'It replaced vaccination as the main way to prevent disease'],
    correctIndex: 1,
    explanation: 'Penicillin was the first antibiotic used widely, treating bacterial infections that had previously been fatal.',
    reasoning: 'It transformed the danger of infection — conditions like sepsis and pneumonia that routinely killed people became treatable.',
  },

  {
    id: 'qq_h33', subject: 'History', topic: 'Modern Medicine', tag: 'magic-bullet',
    difficulty: 'hard', type: 'mcq',
    question: 'What was Ehrlich\'s "magic bullet" concept?',
    options: ['A new surgical technique that removed tumours without side effects', 'Salvarsan 606, a drug used to treat syphilis', 'A vaccine that targeted all bacterial infections at once', 'A radiation treatment for cancer developed in the 1900s'],
    correctIndex: 1,
    explanation: 'Ehrlich\'s idea was to find a chemical that would target and kill a specific disease without harming the patient. Salvarsan 606 targeted syphilis.',
    reasoning: 'This was the foundation of modern pharmacology — identifying and synthesising specific drugs for specific diseases.',
  },

  {
    id: 'qq_h34', subject: 'History', topic: 'Modern Medicine', tag: 'surgery',
    difficulty: 'exam', type: 'mcq',
    question: 'How did surgery improve in the 20th century?',
    options: ['Surgeons no longer needed anaesthetics due to training improvements', 'Better anaesthetics, antiseptics, imaging and technology', 'Blood transfusion made anaesthetic unnecessary for short operations', 'Surgery became less common as drugs replaced most operations'],
    correctIndex: 1,
    explanation: 'Surgery improved through safer anaesthetics, aseptic technique, blood transfusions, imaging and new technology such as keyhole surgery.',
    reasoning: 'Each development reduced a specific risk: anaesthetics removed pain, aseptics removed infection, transfusions managed blood loss.',
  },

  {
    id: 'qq_h35', subject: 'History', topic: 'Modern Medicine', tag: 'war-and-medicine',
    difficulty: 'hard', type: 'mcq',
    question: 'How did war accelerate medical progress?',
    options: ['Doctors had more patients to experiment on', 'It accelerated advances in surgery, transfusions and treatment due to urgent need', 'Governments banned old treatments and forced doctors to use new ones', 'Wartime shortages forced doctors to discover natural alternatives'],
    correctIndex: 1,
    explanation: 'War created urgent need for medical solutions: WWI accelerated blood transfusion and plastic surgery; WWII mass-produced penicillin.',
    reasoning: 'War is a "push factor" — the scale of casualties demanded rapid innovation and made governments fund research.',
  },

  {
    id: 'qq_h36', subject: 'History', topic: '19th-Century Medicine', tag: 'communication',
    difficulty: 'medium', type: 'mcq',
    question: 'Why is communication important in medical progress?',
    options: ['It helps patients describe their symptoms more clearly', 'It spreads new ideas quickly across countries', 'It allows governments to pass health legislation', 'It makes medical training cheaper and more accessible'],
    correctIndex: 1,
    explanation: 'Communication (printing press, journals, internet) allows medical discoveries to spread globally, speeding up progress.',
    reasoning: 'Without communication, each country reinvents discoveries independently. Good communication means knowledge builds on itself.',
  },

  {
    id: 'qq_h37', subject: 'History', topic: 'Medieval Medicine', tag: 'medieval-practitioners',
    difficulty: 'medium', type: 'mcq',
    question: 'What was the main role of medieval hospitals?',
    options: ['Performing surgery and treating injuries', 'Training doctors and apothecaries', 'Care and shelter rather than cure', 'Testing new treatments for the Church'],
    correctIndex: 2,
    explanation: 'Medieval hospitals (mostly Church-run) provided rest, prayer and care — not medical treatment in the modern sense.',
    reasoning: 'Since medieval medicine could not cure disease, hospitals offered spiritual care and comfortable conditions to help the body heal naturally.',
  },

  {
    id: 'qq_h38', subject: 'History', topic: 'Medieval Medicine', tag: 'four-humours',
    difficulty: 'hard', type: 'mcq',
    question: 'Why were medieval treatments often ineffective?',
    options: ['Doctors did not care about their patients', 'Governments refused to fund medical research', 'They relied on incorrect theories and limited knowledge', 'Medieval people were more vulnerable to disease than modern people'],
    correctIndex: 2,
    explanation: 'Medieval treatments were based on the Four Humours, miasma and religion — theories fundamentally wrong about the causes of disease.',
    reasoning: 'You cannot develop effective treatments without understanding the true cause. Wrong theories lead to wrong treatments.',
  },

  {
    id: 'qq_h39', subject: 'History', topic: 'Renaissance Medicine', tag: 'vesalius',
    difficulty: 'hard', type: 'mcq',
    question: 'What was a key Renaissance anatomy breakthrough?',
    options: ['The discovery of bacteria and viruses for the first time', 'More accurate human dissection showing Galen\'s errors', 'The invention of the microscope to study cells', 'Using X-rays to study skeletal structure'],
    correctIndex: 1,
    explanation: 'Renaissance anatomists, especially Vesalius, used direct human dissection to build accurate anatomical knowledge for the first time.',
    reasoning: 'Medieval anatomy was based on Galen who used animals. Dissection revealed major errors and created a new foundation.',
  },

  {
    id: 'qq_h40', subject: 'History', topic: '19th-Century Medicine', tag: 'germ-theory',
    difficulty: 'hard', type: 'mcq',
    question: 'What was one key result of Germ Theory being accepted?',
    options: ['Hospitals banned bloodletting and humour treatments', 'Greater focus on hygiene and sanitation', 'Governments immediately funded large hospitals', 'Medieval treatments were quickly replaced by antibiotics'],
    correctIndex: 1,
    explanation: 'Germ Theory showed that specific microbes cause disease, so preventing germ spread through hygiene and sanitation became a priority.',
    reasoning: 'This connected germ theory to practical public health: clean water, sewers and hospital cleanliness all became understood as germ-prevention.',
  },

  {
    id: 'qq_h41', subject: 'History', topic: '19th-Century Medicine', tag: 'john-snow',
    difficulty: 'exam', type: 'mcq',
    question: 'Why was the Broad Street pump important to the history of medicine?',
    options: ['It was the first public water supply in London', 'It proved that cholera spread through bad air', 'It provided evidence that cholera spread through water', 'It led directly to the passing of the 1848 Public Health Act'],
    correctIndex: 2,
    explanation: 'John Snow\'s 1854 investigation showed all cholera deaths centred around the Broad Street pump. Removing the handle stopped the outbreak.',
    reasoning: 'This was a landmark in epidemiology: evidence-based medicine challenging miasma theory through careful mapping.',
  },

  {
    id: 'qq_h42', subject: 'History', topic: '19th-Century Medicine', tag: 'vaccination',
    difficulty: 'medium', type: 'mcq',
    question: 'What does vaccination do?',
    options: ['Kills bacteria already causing an infection', 'Reduces pain and inflammation in the body', 'Creates immunity against a disease', 'Repairs damage caused by disease to organs'],
    correctIndex: 2,
    explanation: 'Vaccination introduces a weakened or harmless form of a pathogen, training the immune system to fight it without causing disease.',
    reasoning: 'This is prevention rather than treatment — stopping disease before it starts, the key principle behind immunisation programmes.',
  },

  {
    id: 'qq_h43', subject: 'History', topic: '19th-Century Medicine', tag: 'public-health',
    difficulty: 'hard', type: 'mcq',
    question: 'How did public health improve in the 19th century?',
    options: ['The government funded research into new medicines', 'Better sewers, clean water and sanitation', 'Hospitals were built in every major town', 'Vaccination was made compulsory for all citizens'],
    correctIndex: 1,
    explanation: 'Key improvements were infrastructure: Bazalgette\'s sewers (1858), clean piped water and legislation forcing councils to maintain sanitation.',
    reasoning: 'These reduced cholera, typhoid and waterborne diseases — mass deaths that vaccination or drugs could not address.',
  },

  {
    id: 'qq_h44', subject: 'History', topic: '19th-Century Medicine', tag: 'antiseptic-surgery',
    difficulty: 'hard', type: 'mcq',
    question: 'Why did some doctors resist using antiseptics?',
    options: ['Carbolic acid was too expensive for most hospitals', 'They had no access to the equipment needed', 'They resisted ideas that challenged existing practice', 'They thought anaesthetics were more important first'],
    correctIndex: 2,
    explanation: 'Many experienced surgeons resisted Lister\'s methods — they had built careers on existing techniques and found it hard to accept they were causing patient deaths.',
    reasoning: 'This is a pattern in medical history: even good ideas face resistance from those with status and practice invested in the old approach.',
    misconception: 'The resistance was not about cost or equipment — it was professional conservatism.',
  },

  {
    id: 'qq_h45', subject: 'History', topic: 'Modern Medicine', tag: 'wwi-medicine',
    difficulty: 'medium', type: 'mcq',
    question: 'What is triage in medicine?',
    options: ['The process of removing shrapnel from wounds', 'Prioritising patients according to injury severity and survival chances', 'Transporting injured soldiers from the battlefield', 'Using antiseptic on wounds to prevent infection'],
    correctIndex: 1,
    explanation: 'Triage prioritises treatment: treating those most likely to survive first rather than first-come-first-served.',
    reasoning: 'Developed on WWI battlefields, triage maximises lives saved when there are more casualties than medical capacity.',
  },

  {
    id: 'qq_h46', subject: 'History', topic: 'Modern Medicine', tag: 'wwi-medicine',
    difficulty: 'exam', type: 'mcq',
    question: 'Why was the First World War important for medical progress?',
    options: ['It proved that penicillin could treat bacterial infections', 'It accelerated surgery, transfusions, X-rays, plastic surgery and evacuation methods', 'It led directly to the founding of the NHS in 1918', 'It ended miasma theory by proving wounds were infected by germs'],
    correctIndex: 1,
    explanation: 'WWI forced rapid advances: blood transfusions, X-ray units (Marie Curie), plastic surgery (Harold Gillies), the Thomas Splint and systematic evacuation chains.',
    reasoning: 'The scale of casualties created urgent need. What might have taken decades of research happened in years under wartime pressure.',
  },

  {
    id: 'qq_h47', subject: 'History', topic: 'Modern Medicine', tag: 'koch',
    difficulty: 'exam', type: 'mcq',
    question: 'Who was Robert Koch and why was he significant?',
    options: ['He discovered penicillin by noticing mould killing bacteria', 'He proved blood circulates by pumping fluid through heart valves', 'He identified specific bacteria causing diseases such as TB and cholera', 'He invented the first effective vaccine against typhoid'],
    correctIndex: 2,
    explanation: 'Koch identified the bacteria causing tuberculosis (1882) and cholera (1883), proving specific germs cause specific diseases.',
    reasoning: 'This built on Pasteur\'s germ theory: Koch showed not just that germs cause disease, but which specific germ causes which disease.',
  },

  {
    id: 'qq_h48', subject: 'History', topic: '19th-Century Medicine', tag: 'anaesthetics',
    difficulty: 'hard', type: 'mcq',
    question: 'Why was James Simpson important?',
    options: ['He invented the smallpox vaccination using cowpox', 'He introduced chloroform as an anaesthetic', 'He developed antiseptic techniques using carbolic acid', 'He built the first hospital for the poor in Edinburgh'],
    correctIndex: 1,
    explanation: 'Simpson introduced chloroform as an anaesthetic in 1847, providing a more reliable alternative to ether.',
    reasoning: 'Chloroform was easier to administer than ether and allowed longer, more complex surgeries to be performed safely.',
  },

  {
    id: 'qq_h49', subject: 'History', topic: 'Modern Medicine', tag: 'factors-in-change',
    difficulty: 'exam', type: 'mcq',
    question: 'What is the overall pattern of medical progress across history?',
    options: ['Rapid and consistent improvement driven mainly by individual genius', 'Gradual change influenced by science, war, government, communication and individuals', 'Sudden leaps forward after each major war with long gaps between', 'Progress driven mainly by government investment and public demand'],
    correctIndex: 1,
    explanation: 'Medical progress is gradual, multi-causal and uneven. Multiple factors interact: science, war, government, communication and chance.',
    reasoning: 'No single factor explains all progress. Strong exam answers consider the interaction of factors rather than crediting one cause.',
  },

  {
    id: 'qq_h50', subject: 'History', topic: 'Modern Medicine', tag: 'factors-in-change',
    difficulty: 'easy', type: 'mcq',
    question: 'Which areas are most important to revise for Medicine Through Time?',
    options: ['Dates, statistics and the names of all hospitals', 'Key individuals, case studies, factors and chronological developments', 'The exact texts of every Public Health Act', 'The specific symptoms of each disease covered in the topic'],
    correctIndex: 1,
    explanation: 'Exam success requires knowing key people (Pasteur, Jenner, Snow), case studies (Black Death, WWI), factors and the sequence of developments.',
    reasoning: 'Edexcel exam questions focus on individuals, factors driving change, and continuity/change over time — not exhaustive factual lists.',
  },

  // ── Q51-70: Higher grade ──────────────────────────────

  {
    id: 'qq_h51', subject: 'History', topic: 'Renaissance Medicine', tag: 'scientific-method',
    difficulty: 'hard', type: 'mcq',
    question: 'Who was Thomas Sydenham and why was he known as the "English Hippocrates"?',
    options: ['He rewrote Galen\'s medical texts in English for the first time', 'He invented surgical tools used for over 200 years', 'He emphasised careful observation of patients and symptoms', 'He proved that bacteria caused most infectious diseases'],
    correctIndex: 2,
    explanation: 'Sydenham (1624-89) was called the "English Hippocrates" because he returned to careful clinical observation rather than relying on ancient theory.',
    reasoning: 'He classified diseases by symptoms and treated what he observed — this empirical approach helped move medicine away from dogma.',
  },

  {
    id: 'qq_h52', subject: 'History', topic: 'Renaissance Medicine', tag: 'scientific-method',
    difficulty: 'exam', type: 'mcq',
    question: 'Why was Sydenham important to the development of medicine?',
    options: ['He discovered the first effective treatment for malaria', 'He improved diagnosis by classifying diseases based on symptoms', 'He founded the Royal Society and promoted experimentation', 'He proved that the Four Humours theory was incorrect'],
    correctIndex: 1,
    explanation: 'Sydenham classified diseases based on careful symptom observation, improving diagnosis and moving away from theoretical explanations.',
    reasoning: 'His approach — observe, classify, treat — was a critical step in systematic clinical medicine, influencing doctors for centuries.',
  },

  {
    id: 'qq_h53', subject: 'History', topic: 'Renaissance Medicine', tag: 'vesalius',
    difficulty: 'hard', type: 'mcq',
    question: 'Who was William Hunter?',
    options: ['A physician who discovered the smallpox vaccine', 'An anatomist who improved understanding of human anatomy through dissection', 'The surgeon who first used antiseptics in operations', 'The doctor who built London\'s first public hospital'],
    correctIndex: 1,
    explanation: 'William Hunter (1718-83) was a leading Scottish anatomist who advanced knowledge of human anatomy through systematic dissection.',
    reasoning: 'Hunter built on Vesalius\' tradition of direct observation and trained many surgeons, spreading accurate anatomical knowledge widely.',
  },

  {
    id: 'qq_h54', subject: 'History', topic: 'Renaissance Medicine', tag: 'vesalius',
    difficulty: 'hard', type: 'mcq',
    question: 'Why was William Hunter significant for medicine?',
    options: ['He invented a new anaesthetic that made surgery painless', 'He trained surgeons and improved anatomical knowledge', 'He proved that blood types determine compatibility for transfusion', 'He developed a vaccine that protected against multiple diseases'],
    correctIndex: 1,
    explanation: 'Hunter trained many surgeons through his Great Windmill Street school, spreading accurate anatomical knowledge widely.',
    reasoning: 'Improving medical education was as important as making discoveries — trained surgeons with correct anatomy saved far more lives than one individual could.',
  },

  {
    id: 'qq_h55', subject: 'History', topic: 'Modern Medicine', tag: 'koch',
    difficulty: 'exam', type: 'mcq',
    question: 'What specific contribution did Robert Koch make to Germ Theory?',
    options: ['He proved that microbes exist by viewing them under a microscope', 'He showed that different diseases are caused by different microorganisms', 'He developed vaccines for tuberculosis and cholera', 'He proved that Pasteur\'s germ theory was wrong in several areas'],
    correctIndex: 1,
    explanation: 'Koch proved that different specific microorganisms cause different specific diseases — TB has one cause, cholera another.',
    reasoning: 'Pasteur showed microbes cause disease; Koch showed which microbe causes which disease, enabling targeted treatment and vaccination.',
    misconception: 'Koch did not disprove Pasteur — he extended and proved germ theory with specific, identifiable bacteria.',
  },

  {
    id: 'qq_h56', subject: 'History', topic: 'Modern Medicine', tag: 'koch',
    difficulty: 'exam', type: 'truefalse',
    question: 'Robert Koch proved that one type of germ can cause multiple different diseases.',
    correct: false,
    explanation: 'False — Koch proved the opposite: different diseases are caused by different specific microorganisms.',
    reasoning: 'This "one germ, one disease" principle is fundamental to modern medicine — it means you can target a specific pathogen to treat a specific disease.',
  },

  {
    id: 'qq_h57', subject: 'History', topic: 'Modern Medicine', tag: 'koch',
    difficulty: 'exam', type: 'mcq',
    question: 'Why was Koch important for developing Germ Theory further?',
    options: ['He replicated Pasteur\'s experiments and confirmed all his findings', 'He provided evidence linking specific microbes to specific diseases', 'He invented the microscope used to view bacteria', 'He showed that Pasteur had made errors in his original work'],
    correctIndex: 1,
    explanation: 'Koch isolated TB bacteria (1882) and cholera bacteria (1883), providing definitive proof that specific germs cause specific diseases.',
    reasoning: 'This moved medicine from "germs cause disease" (Pasteur) to "this specific germ causes this specific disease" (Koch) — enabling targeted diagnosis.',
  },

  {
    id: 'qq_h58', subject: 'History', topic: 'Modern Medicine', tag: 'magic-bullet',
    difficulty: 'hard', type: 'mcq',
    question: 'What was Salvarsan 606?',
    options: ['The 606th patient treated with Ehrlich\'s first antibiotic', 'Ehrlich\'s magic bullet drug used to treat syphilis', 'A vaccine against syphilis developed after 606 failed trials', 'The name of Ehrlich\'s laboratory where penicillin was discovered'],
    correctIndex: 1,
    explanation: 'Salvarsan 606 was Ehrlich\'s 606th compound tested — it successfully targeted syphilis bacteria without killing the patient.',
    reasoning: 'The name "606" reflects the systematic trial-and-error approach Ehrlich used, testing hundreds of compounds to find one that worked.',
  },

  {
    id: 'qq_h59', subject: 'History', topic: 'Modern Medicine', tag: 'magic-bullet',
    difficulty: 'exam', type: 'mcq',
    question: 'Why was Ehrlich\'s work on magic bullets important?',
    options: ['It showed that vaccination was unnecessary if drugs could cure disease', 'It showed diseases could be targeted with specific drugs', 'It proved that bacteria could be killed by mould compounds', 'It provided the foundation for the NHS drug funding model'],
    correctIndex: 1,
    explanation: 'Ehrlich showed it was possible to design a drug that targeted and killed a specific pathogen — the foundation of modern pharmacology.',
    reasoning: 'The "magic bullet" concept led directly to the development of antibiotics and chemotherapy: chemicals designed to destroy specific targets.',
  },

  {
    id: 'qq_h60', subject: 'History', topic: 'Modern Medicine', tag: 'wwi-medicine',
    difficulty: 'hard', type: 'mcq',
    question: 'What were the main causes of death and injury on the Western Front in WWI?',
    options: ['Gas attacks and starvation were the primary killers', 'Infection and disease were major threats alongside wounds', 'Blood loss from bullet wounds was responsible for most deaths', 'Cold and hypothermia killed more soldiers than combat injuries'],
    correctIndex: 1,
    explanation: 'Infected wounds (especially gas gangrene in trenches), diseases like dysentery and typhoid, and physical trauma all caused mass casualties.',
    reasoning: 'The scale and nature of WWI injuries created unprecedented medical challenges requiring treatment never before attempted at such scale.',
  },

  {
    id: 'qq_h61', subject: 'History', topic: 'Modern Medicine', tag: 'wwi-medicine',
    difficulty: 'exam', type: 'mcq',
    question: 'What was the Chain of Evacuation in WWI?',
    options: ['A supply line bringing medical equipment to field hospitals', 'A system moving wounded soldiers from battlefield to hospital', 'The process of evacuating civilians from bombed towns', 'A communication chain passing medical orders from generals to doctors'],
    correctIndex: 1,
    explanation: 'The Chain of Evacuation moved wounded soldiers: Regimental Aid Post → Field Ambulance → Casualty Clearing Station → Base Hospital → home.',
    reasoning: 'This progressive treatment system matched severity of treatment to severity of injury, getting soldiers into surgical care faster.',
  },

  {
    id: 'qq_h62', subject: 'History', topic: 'Modern Medicine', tag: 'wwi-medicine',
    difficulty: 'exam', type: 'mcq',
    question: 'Why was the Chain of Evacuation important?',
    options: ['It freed up battlefield commanders from making medical decisions', 'It improved survival rates by providing organised, progressive treatment', 'It reduced the cost of treating wounded soldiers', 'It allowed doctors to remain safe away from the front line'],
    correctIndex: 1,
    explanation: 'By organising treatment in stages from first aid to surgery to recovery, the Chain of Evacuation meant wounds were treated before they became fatal.',
    reasoning: 'Organisation and speed were key: a wound that would kill in hours if untreated could be survived if surgery reached the patient quickly.',
  },

  {
    id: 'qq_h63', subject: 'History', topic: 'Modern Medicine', tag: 'wwi-medicine',
    difficulty: 'hard', type: 'mcq',
    question: 'What role did X-rays play in WWI medicine?',
    options: ['They were used to diagnose shell shock and psychological trauma', 'They helped locate bullets and shrapnel inside the body', 'They were used to sterilise wounds and kill bacteria', 'They proved that gas gangrene spread through the blood'],
    correctIndex: 1,
    explanation: 'Marie Curie organised mobile X-ray units that could locate metal fragments inside wounded soldiers without exploratory surgery.',
    reasoning: 'Finding shrapnel before surgery saved time, reduced trauma and improved surgical success rates — accelerating X-ray adoption in peacetime medicine.',
  },

  {
    id: 'qq_h64', subject: 'History', topic: 'Modern Medicine', tag: 'wwi-medicine',
    difficulty: 'exam', type: 'mcq',
    question: 'Who was Harold Gillies and what did he contribute?',
    options: ['A general who developed the Chain of Evacuation system', 'The doctor who discovered blood types, enabling transfusions', 'A surgeon who pioneered plastic surgery during WWI', 'The physician who proved shell shock was a real medical condition'],
    correctIndex: 2,
    explanation: 'Harold Gillies developed plastic surgery techniques at Sidcup to repair severe facial injuries caused by WWI weapons, treating over 5,000 cases.',
    reasoning: 'His techniques — skin grafts, rebuilding facial structure — created the foundation for modern plastic and reconstructive surgery.',
  },

  {
    id: 'qq_h65', subject: 'History', topic: 'Modern Medicine', tag: 'wwi-medicine',
    difficulty: 'exam', type: 'mcq',
    question: 'What was the Thomas Splint and why was it important in WWI?',
    options: ['A surgical instrument used to extract shrapnel from wounds', 'A device used to stabilise fractured legs and reduce deaths', 'A stretcher designed to move patients without causing further injury', 'A breathing device used in chemical weapon attacks'],
    correctIndex: 1,
    explanation: 'The Thomas Splint stabilised fractured femurs, preventing fatal blood loss and shock. Death rates from fractured femurs fell from ~80% to ~20%.',
    reasoning: 'This single device saved thousands of lives by solving a specific problem: immobilising a broken leg without causing the movement that killed patients.',
  },

  {
    id: 'qq_h66', subject: 'History', topic: 'Modern Medicine', tag: 'wwi-medicine',
    difficulty: 'hard', type: 'mcq',
    question: 'Why was blood transfusion important in WWI?',
    options: ['It proved that blood could be stored and used later', 'It helped save severely wounded soldiers suffering blood loss', 'It allowed surgeons to operate without anaesthetic', 'It replaced the need for antiseptics to treat infected wounds'],
    correctIndex: 1,
    explanation: 'Blood transfusion saved soldiers who would otherwise die from blood loss. WWI also developed blood storage techniques for later use.',
    reasoning: 'The scale of WWI casualties forced rapid development of transfusion practice, creating the knowledge base for modern blood banks.',
  },

  {
    id: 'qq_h67', subject: 'History', topic: 'Modern Medicine', tag: 'lifestyle-factors',
    difficulty: 'hard', type: 'mcq',
    question: 'Why is lung cancer a significant case study in modern medicine?',
    options: ['It was the first cancer treated successfully with chemotherapy', 'It showed how lifestyle factors such as smoking can cause disease', 'It proved that genetics determines who gets cancer', 'It led to the creation of the NHS screening programme'],
    correctIndex: 1,
    explanation: 'The link between smoking and lung cancer (established from the 1950s) showed how personal behaviour choices cause specific diseases.',
    reasoning: 'This shifted medicine from treating disease to preventing it through lifestyle change — and drove major public health campaigns against smoking.',
  },

  {
    id: 'qq_h68', subject: 'History', topic: 'Modern Medicine', tag: 'genetics',
    difficulty: 'hard', type: 'mcq',
    question: 'How has understanding DNA improved medicine?',
    options: ['It has allowed doctors to replace surgery with gene editing', 'It helps identify inherited conditions and develop targeted treatments', 'It proved that all diseases are inherited through families', 'It made vaccines unnecessary for most infectious diseases'],
    correctIndex: 1,
    explanation: 'DNA knowledge allows medicine to identify inherited conditions (e.g. BRCA mutations for breast cancer) and develop targeted treatments.',
    reasoning: 'Genetic medicine represents a new frontier: treating disease at its source (the DNA code) rather than managing symptoms.',
  },

  {
    id: 'qq_h69', subject: 'History', topic: 'Modern Medicine', tag: 'genetics',
    difficulty: 'exam', type: 'mcq',
    question: 'What was the Human Genome Project?',
    options: ['A programme to test all UK citizens for inherited disease', 'A project to develop gene therapy for cancer treatment', 'An international project that mapped the complete human DNA code', 'A research project into the genetic causes of the Black Death'],
    correctIndex: 2,
    explanation: 'Completed in 2003, the Human Genome Project mapped all 3 billion base pairs of human DNA — providing a complete blueprint of the human genetic code.',
    reasoning: 'This foundation enables research into the genetic basis of disease, targeted drug development and personalised medicine.',
  },

  {
    id: 'qq_h70', subject: 'History', topic: 'Modern Medicine', tag: 'factors-in-change',
    difficulty: 'exam', type: 'mcq',
    question: 'Which factors have been most important in driving medical progress across history?',
    options: ['Science alone — all other factors are secondary', 'Government funding and public demand', 'Science and technology, individuals, government, war, communication and chance', 'War and chance discoveries, with science following after'],
    correctIndex: 2,
    explanation: 'Medical progress results from multiple interacting factors: science/technology, key individuals, government, war, communication and chance.',
    reasoning: 'No single factor can explain the history of medicine. Strong exam answers consider which factor mattered most in a specific context.',
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
