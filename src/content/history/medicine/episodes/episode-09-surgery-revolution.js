// Episode file — owns the runtime teaching sequence for one episode.
//
// Actual image files live in public/history/medicine/.
// Asset path resolution lives in src/content/history/medicine/assets.js.
// Canonical content + architecture docs live in docs/content/history/medicine/.
//
export const episode = {
  id: 'history-medicine-surgery-revolution',
  subject: 'History',
  number: 9,
  title: 'The day surgery changed forever',
  subtitle: 'Anaesthetics and antiseptics',
  era: 'c.1840–c.1900',
  icon: '🔪',
  color: '#7A4515',
  colorLight: 'rgba(122,69,21,.12)',
  series: 'medicine-through-time',
  recallTags: [],
  examTags: [],
  assetKeys: [],
  hook: {
    atmosphericOpener: {
      heading: 'THE SURGEON WIPES HIS BLADE ON HIS APRON.',
      sub: 'The apron hasn\'t been washed in weeks. The crowd leans in. The patient is awake.',
      cta: 'STEP INTO THE THEATRE',
    },
    scenario: {
      location: 'A London operating theatre, 1840',
      hint: 'A surgeon is about to amputate a leg. He is wearing a blood-stained coat — a mark of experience. Spectators watch from tiered seats above. There is no anaesthetic. No antiseptic. Just speed, a saw, and luck.',
    },
    statement: 'Victorian surgeons often wore blood-covered coats with pride.',
    accentWords: ['blood-covered coats', 'pride'],
    explanation: "A filthy coat meant experience — the more blood, the more operations. Nobody knew this was also spreading infection. That changed with Lister and carbolic acid.",
    isTrue: true,
    wrongFeedback: 'It sounds shocking — but it\'s true. A filthy coat showed experience. The real danger wasn\'t the surgery. It was what came after.',
    correctFeedback: 'Correct. Many surgeons believed a dirty coat proved experience and toughness. The biggest killer wasn\'t the operation — it was infection afterwards.',
    loadingText: 'Examining the body of evidence…',
    bigQuestion: 'If surgery was this dangerous — why did anything ever improve?',
    revealHeader: 'Three revolutions changed surgery forever.',
    revealItems: [
      {
        emoji: '😴',
        label: 'Anaesthetics ended the screaming',
        detail: 'Before 1846, patients were awake for every cut. Speed was the only mercy. Ether and chloroform changed that — surgery became something patients could survive consciously.',
        color: '#9A5A18',
        bg: 'rgba(154,90,24,.08)',
      },
      {
        emoji: '🦠',
        label: 'Antiseptics ended the dying',
        detail: 'Anaesthetics saved pain but not lives. Patients still died of infection — gangrene, sepsis — after operations. Lister\'s carbolic acid spray, inspired by Pasteur, cut death rates dramatically.',
        color: '#9A5A18',
        bg: 'rgba(154,90,24,.08)',
      },
      {
        emoji: '⚡',
        label: 'Technology accelerated everything',
        detail: 'X-rays (1895), blood transfusions and sterile operating theatres turned surgery from a desperate last resort into a precise science. The transformation took just 60 years.',
        color: '#9A5A18',
        bg: 'rgba(154,90,24,.08)',
      },
    ],
    punchline: 'Modern surgery was hard-won. Three revolutions. Sixty years. Millions of lives.',
  },
  intro: {
    learningGoals: [
      'Explain why speed mattered in pre-anaesthetic surgery',
      'Describe the impact of anaesthetics on surgery (1846 onwards)',
      'Explain why infection — not pain — was the main killer',
      'Describe Lister\'s use of carbolic acid and its significance',
      'Distinguish antiseptic surgery from aseptic surgery',
      'Explain how X-rays and blood transfusions advanced medicine',
    ],
  },
  outcomes: {
    intro: 'Between 1840 and 1900, surgery transformed from butchery into medicine. This is exactly how it happened.',
    bullets: [
      'Explain why pain, infection and blood loss each limited surgery differently',
      "Describe Simpson's discovery — and why surgeons resisted it",
      "See why Lister's antiseptic approach eventually saved millions of lives",
      'Connect these three breakthroughs to the drop in operating-theatre deaths',
    ],
  },

  recall: {
    questions: [
      { type: 'truefalse', question: 'Joseph Lister was the first surgeon to use anaesthetics.', isTrue: false },
      { type: 'choice', question: 'Antiseptic surgery works by...', options: ['Numbing the patient during operations', 'Killing bacteria to prevent post-op infection', 'Stopping blood loss during surgery'], correct: 1 },
      { type: 'connection', question: 'Surgery survival rates improved most when...', options: [
        { text: 'Surgeons learned to work faster', icon: 'gear' },
        { text: 'Pain, infection and blood loss were each solved', icon: 'lightbulb' },
        { text: 'Hospitals were built larger and better lit', icon: 'house' },
      ], correct: 1 },
    ],
  },
  stageNavigation: [
    { id: 'part-1', title: 'The Three Enemies of Surgery', description: 'Pain, infection and blood loss before the 1840s.', screenIndex: 0 },
    { id: 'part-2', title: 'Pain: The Patient\'s Nightmare', description: 'Anaesthetics from Davy to Simpson.', screenIndex: 1 },
    { id: 'part-3', title: 'Infection: The Invisible Killer', description: 'Lister, carbolic acid and antiseptic surgery.', screenIndex: 2 },
    { id: 'part-4', title: 'Blood Loss and Better Technique', description: 'X-rays, blood transfusions and aseptic surgery.', screenIndex: 5 },
    { id: 'part-5', title: 'From Last Resort to Real Treatment', description: 'Source skills and the surgical transformation.', screenIndex: 6 },
    { id: 'part-6', title: 'Exam Prep: Why Surgery Improved', description: 'Exam practice and final application.', screenIndex: 7 },
  ],
  screens: [

    // Screen 1 — Speed Surgery
    {
      label: 'Speed Surgery',
      kicker: 'Before 1846',
      heading: 'The faster the surgeon, the better.',
      sub: 'Before anaesthetics, speed was the only mercy. This is what surgery looked like.',
      blocks: [
        {
          type: 'read',
          label: '🔪 Robert Liston: The Fastest Knife in the West End',
          text: 'Robert Liston was celebrated as Britain\'s greatest surgeon in the 1840s. He could amputate a leg in under 30 seconds. Spectators packed the viewing gallery above the operating theatre. Patients were held down by assistants. There was no anaesthetic. The louder you screamed, the longer it felt. Speed was mercy — it reduced the duration of agony.',
        },
        {
          type: 'funfact',
          label: '☠️ Very Bad Time To Be Alive',
          text: 'One of Liston\'s operations reportedly killed three people: the patient (from infection), his assistant (whose fingers Liston accidentally amputated in the rush), and a spectator who fainted and died of shock. The operation was technically a success. It had a 300% mortality rate.',
        },
        {
          type: 'quiz',
          question: 'Which problem made speed the most important skill in surgery before 1846?',
          options: [
            { text: 'Lack of gloves and protective equipment', correct: false },
            { text: 'Lack of anaesthetics — patients were fully conscious', correct: true },
            { text: 'Lack of microscopes to see inside the body', correct: false },
            { text: 'Lack of hospitals with enough space', correct: false },
          ],
          explanation: 'Without anaesthetics, patients were awake through every cut. The faster the operation, the less time they spent in agony. Speed was a surgical skill — not a risk.',
        },
        {
          type: 'keypoint',
          text: '🧠 <strong>Key Phrase:</strong> "Without anaesthetics, speed reduced suffering." — This is the phrase that explains pre-1846 surgery in AQA answers. Not: "surgeons were skilled." Use this.',
        },
        {
          type: 'examtip',
          label: '⚔️ Exam Assassin',
          tip: 'Precise contextual explanation scores more than dramatic description. Don\'t write "surgery was horrible." Write: "Without anaesthetics, patients were conscious throughout — so speed was critical to reduce the duration of pain."',
        },
      ],
    },

    // Screen 2 — Anaesthetics
    {
      label: 'Anaesthetics',
      kicker: '1846 onwards',
      heading: 'Patients could finally sleep through surgery.',
      sub: 'Ether and chloroform transformed what surgery could attempt. But they didn\'t solve everything.',
      blocks: [
        {
          type: 'read',
          label: '😴 The Transformation',
          text: '<strong>1846: Ether</strong> — an American dentist, William Morton, used ether as the first surgical anaesthetic. The news reached Britain within months.<br/><br/><strong>1847: Chloroform</strong> — James Simpson, a Scottish obstetrician, discovered chloroform was faster and more reliable than ether. He used it in childbirth.<br/><br/><strong>1853: Royal approval</strong> — Queen Victoria used chloroform during the birth of Prince Leopold. This removed religious objections and made anaesthetics socially acceptable.',
        },
        {
          type: 'keypoint',
          text: '⚡ <strong>The paradox of anaesthetics:</strong> Making surgery painless made it MORE dangerous in the short term. Surgeons could now attempt longer, more ambitious operations — but infection still killed. More surgery = more deaths from infection. The death rate initially <em>rose</em> after anaesthetics were introduced.',
        },
        {
          type: 'quiz',
          question: 'Which statement about the impact of anaesthetics is MOST accurate for an AQA answer?',
          options: [
            { text: 'Anaesthetics solved most surgical deaths', correct: false },
            { text: 'Anaesthetics made surgery painless but infection remained the main killer', correct: true },
            { text: 'Anaesthetics stopped surgical bleeding', correct: false },
            { text: 'Anaesthetics prevented post-operative gangrene', correct: false },
          ],
          explanation: 'Anaesthetics solved pain — not infection. Death rates from surgery didn\'t fall significantly until Lister tackled infection with antiseptics. This nuance is what AQA high-mark answers include.',
        },
        {
          type: 'examtip',
          label: '⚔️ Exam Assassin',
          tip: '"Improved pain control allowed surgeons to attempt more complex operations — but infection rates initially rose as a result." This nuance separates A-grade from B-grade answers.',
        },
      ],
    },

    // Screen 3 — Infection: The Real Killer
    {
      label: 'The Real Killer',
      kicker: 'Infection',
      heading: 'Patients survived surgery… then died afterwards.',
      sub: 'Pain wasn\'t the main killer. Infection was. And nobody knew why — yet.',
      blocks: [
        {
          type: 'read',
          label: '🦠 What Was Killing Patients?',
          text: 'In the 1840s–1860s, nearly half of patients who underwent major surgery died — not from the operation itself, but from infection in the days that followed. <strong>Gangrene</strong> (tissue death from bacterial infection), <strong>sepsis</strong> (blood poisoning) and <strong>pyaemia</strong> (pus in the blood) were the killers.<br/><br/>Surgeons had no idea why. They didn\'t wash hands between patients. They reused instruments without sterilising them. Some proudly wore the same apron all day — the more blood, the more experienced you appeared.',
        },
        {
          type: 'quiz',
          question: 'A patient survives an amputation but develops a fever and dies three days later. What is the MOST likely cause?',
          options: [
            { text: 'Pain — the operation was too stressful', correct: false },
            { text: 'Blood loss — they lost too much during surgery', correct: false },
            { text: 'Infection — bacteria entered the wound', correct: true },
            { text: 'Broken bones — from being restrained during surgery', correct: false },
          ],
          explanation: 'Infection was the primary cause of post-operative death throughout this period. Bacteria entered wounds through dirty instruments, unwashed hands and contaminated dressings. The patient surviving surgery was only half the battle.',
        },
        {
          type: 'funfact',
          label: '☠️ Very Bad Time To Be Alive',
          text: 'In some hospitals in the 1850s, a surgeon might operate on ten patients in a morning — using the same unwashed instruments throughout. The ward floors were caked in blood. Instruments were cleaned with sawdust at best. Surgeons sometimes operated with dried pus on their tools from the previous patient. The word "hospitalism" was coined to describe the epidemic of infection contracted in hospitals themselves.',
        },
        {
          type: 'keypoint',
          text: '🧠 <strong>Key Phrase:</strong> "Infection — not pain — was the main killer after surgery." Gangrene, sepsis and pyaemia killed more patients than the operations themselves. This is the central point of this entire module.',
        },
      ],
    },

    // Screen 4 — Lister vs Infection
    {
      label: 'Lister',
      kicker: '1867',
      heading: 'Joseph Lister changes surgery forever.',
      headerImage: '/images/lister-1865.png',
      sub: 'Lister applied Pasteur\'s germ theory directly to surgery. The results were dramatic.',
      blocks: [
        {
          type: 'read',
          label: '🧴 What Lister Did',
          text: '<strong>Joseph Lister</strong> read Pasteur\'s germ theory and made the connection: if microorganisms cause decay and disease, they must be causing post-operative infection too.<br/><br/>From 1865, Lister began spraying wounds with <strong>carbolic acid</strong> during and after surgery. He also soaked dressings, instruments and his own hands in carbolic solution.<br/><br/>The results were immediate. His ward\'s post-operative death rate fell from around 45% to below 15%. He published his findings in <em>The Lancet</em> in 1867.',
        },
        {
          type: 'fillblanks',
          sentences: [
            {
              before: 'Lister used',
              after: 'acid to kill germs during and after surgery.',
              answer: 'carbolic',
              hints: ['A chemical spray used to kill bacteria.', 'It begins with "c" — it\'s the acid derived from coal tar.'],
            },
            {
              before: 'Pasteur\'s',
              after: 'theory inspired Lister to apply germ-killing methods to surgery.',
              answer: 'germ',
              hints: ['What did Pasteur identify as the cause of disease?', 'Starts with "g" — microorganisms that cause disease.'],
            },
            {
              before: 'Lister\'s use of carbolic acid is called',
              after: 'surgery — killing germs that are already present.',
              answer: 'antiseptic',
              hints: ['Anti = against. Septic = relating to infection.', 'This type of surgery kills germs after they enter — starts with "a."'],
            },
          ],
          correctMsg: 'Good. Lister → carbolic acid → antiseptic surgery → link to Pasteur. This chain is worth marks.',
          wrongMsg: 'Think about what Lister used and why. Go back to the read section.',
        },
        {
          type: 'quiz',
          question: 'Why was Lister\'s work revolutionary for surgery?',
          options: [
            { text: 'He discovered that germs cause disease', correct: false },
            { text: 'He directly applied germ theory to surgery, dramatically reducing infection deaths', correct: true },
            { text: 'He invented anaesthetics for surgical procedures', correct: false },
            { text: 'He created X-rays to see inside patients\' bodies', correct: false },
          ],
          explanation: 'Lister didn\'t discover germ theory — Pasteur did. But Lister made the crucial leap: applying germ theory to surgery. This is the distinction AQA rewards. The link Pasteur → Lister is essential in high-mark answers.',
        },
        {
          type: 'examtip',
          label: '⚔️ Exam Assassin',
          tip: 'High-mark answers LINK individuals together. Don\'t just write "Lister used carbolic acid." Write: "Lister applied Pasteur\'s germ theory to surgery — recognising that the microorganisms Pasteur identified must be causing post-operative infection." That chain scores the top marks.',
        },
      ],
    },

    // Screen 5 — Aseptic Surgery
    {
      label: 'Aseptic Surgery',
      kicker: 'Prevention',
      heading: 'Stop germs entering. Don\'t just kill them after.',
      sub: 'Antiseptic surgery treated infection. Aseptic surgery prevented it. The difference saved millions.',
      blocks: [
        {
          type: 'read',
          label: '🏥 From Antiseptic to Aseptic',
          text: '<strong>Antiseptic surgery</strong> (Lister, 1867): kill germs that have already entered the wound. Use carbolic spray. Better than nothing — but carbolic acid was harsh on skin and tissue.<br/><br/><strong>Aseptic surgery</strong> (1880s–1900s): prevent germs entering in the first place. <strong>Steam sterilisation</strong> of all instruments. <strong>Rubber gloves</strong> (William Halsted, 1890). Surgical <strong>masks</strong> and <strong>gowns</strong>. Scrubbing hands and arms before surgery. Purpose-built, clean <strong>operating theatres</strong> with tiled walls that could be washed down.<br/><br/>The shift from antiseptic to aseptic represents surgery becoming genuinely modern.',
        },
        {
          type: 'quiz',
          question: 'Which improvement PREVENTED germs entering surgery rather than killing them once inside?',
          options: [
            { text: 'Carbolic acid spray — applied to open wounds during surgery', correct: false },
            { text: 'Chloroform — administered to unconscious patients before cutting', correct: false },
            { text: 'Rubber gloves — preventing skin bacteria from the surgeon\'s hands entering wounds', correct: true },
            { text: 'Ether — used to reduce pain during the operation', correct: false },
          ],
          explanation: 'Rubber gloves prevent contamination from entering — that is the definition of aseptic. Carbolic acid kills germs already present — that is antiseptic. Chloroform and ether are anaesthetics, not infection controls.',
        },
        {
          type: 'keypoint',
          text: '⚔️ <strong>Exam Assassin:</strong> "Antiseptic kills germs already in the wound. Aseptic prevents germs entering the wound in the first place." If you can explain this distinction with an example of each, you are scoring maximum marks on this topic.',
        },
        {
          type: 'colsort',
          question: 'Antiseptic or aseptic technique?',
          columns: [
            { label: 'ANTISEPTIC\nKills germs after entry', color: '#C47828', bg: 'rgba(196,120,40,.07)' },
            { label: 'ASEPTIC\nPrevents germs entering', color: '#4B90FF', bg: 'rgba(75,144,255,.07)' },
          ],
          items: [
            { label: 'Carbolic acid spray on an open wound', col: 0, explanation: 'Antiseptic — carbolic acid kills microorganisms already in contact with the wound. Lister\'s method.' },
            { label: 'Steam-sterilising surgical instruments before use', col: 1, explanation: 'Aseptic — sterilising before surgery prevents any bacteria being introduced via instruments.' },
            { label: 'Soaking bandages in carbolic solution', col: 0, explanation: 'Antiseptic — treating dressings with carbolic acid kills bacteria on contact with the wound.' },
            { label: 'Surgeon wearing rubber gloves', col: 1, explanation: 'Aseptic — gloves create a barrier that prevents the surgeon\'s skin bacteria entering the patient\'s wound.' },
            { label: 'Tiled, washable operating theatre walls', col: 1, explanation: 'Aseptic — a clean, sterilisable environment reduces the bacteria present before surgery even begins.' },
            { label: 'Washing wound with antiseptic solution after cutting', col: 0, explanation: 'Antiseptic — treating the wound after opening it kills bacteria that have already entered.' },
          ],
          explanation: 'Antiseptic = reactive (kill what\'s there). Aseptic = preventative (stop it getting in). Modern surgery relies on both.',
        },
      ],
    },

    // Screen 6 — Technology: X-Rays & Blood Transfusions
    {
      label: 'X-Rays & Blood',
      kicker: 'Technology',
      heading: 'Doctors could finally see inside the body.',
      sub: 'Two breakthroughs that changed what medicine could diagnose and treat.',
      blocks: [
        {
          type: 'read',
          label: '⚡ X-Rays (1895)',
          text: 'Wilhelm Röntgen discovered X-rays in 1895. Within a year, they were being used in hospitals across Europe. For the first time, surgeons could locate <strong>bullets, fractures and internal injuries</strong> without opening the body first. Operations became more precise — surgeons knew exactly what they were dealing with before the first cut.',
        },
        {
          type: 'read',
          label: '🩸 Blood Transfusions',
          text: 'Blood transfusions had been attempted since the 17th century but were unreliable and often fatal. The discovery of <strong>blood groups</strong> (ABO system, Karl Landsteiner, 1901) made safe transfusion possible. Surgeons could now replace blood lost during major operations — extending the range of surgery that patients could survive.',
        },
        {
          type: 'quiz',
          question: 'Which development MOST helped surgeons locate internal injuries without opening the body first?',
          options: [
            { text: 'Antiseptic carbolic spray — killed bacteria inside wounds', correct: false },
            { text: 'Blood transfusions — replaced blood lost during surgery', correct: false },
            { text: 'X-rays — revealed fractures, bullets and internal structures', correct: true },
            { text: 'Chloroform anaesthesia — kept patients unconscious longer', correct: false },
          ],
          explanation: 'X-rays allowed diagnosis without cutting — surgeons could see exactly what they needed to treat before operating. This made surgery more targeted, safer and more successful.',
        },
        {
          type: 'keypoint',
          text: '🧠 <strong>Technology Accelerated Progress:</strong><br/><br/>⚡ <strong>X-rays (1895)</strong> — internal diagnosis without surgery<br/>🩸 <strong>Blood groups (1901)</strong> — safe transfusions<br/>🏥 <strong>Purpose-built theatres</strong> — sterile environments<br/>🔬 <strong>Better microscopes</strong> — identifying specific pathogens<br/><br/>Each breakthrough built on the others. Progress was cumulative, not sudden.',
        },
      ],
    },

    // Screen 7 — Source Detective
    {
      label: 'Source Detective',
      kicker: 'Exam Skill',
      heading: 'What does this source REALLY suggest?',
      sub: 'AQA sources require inference — not description. Build the skill here.',
      blocks: [
        {
          type: 'read',
          label: '🔍 How to Analyse a Historical Source',
          text: 'AQA sources are not just there to be summarised. You must <strong>infer</strong> — what does the source suggest about conditions, attitudes or developments? Always link to your own knowledge to explain <strong>why</strong> the source shows what it shows.<br/><br/>A source showing a surgeon in a blood-stained coat doesn\'t just show you "it was dirty." It suggests that infection was not yet understood as a danger — otherwise, surgeons would have taken precautions.',
        },
        {
          type: 'quiz',
          question: 'A source shows a Victorian operating theatre: crowded spectators, a surgeon in a stained apron, no protective equipment, an unconscious patient. Which student gives the best historical inference?',
          options: [
            { text: 'Student A: "The source shows Lister invented surgery."', correct: false },
            { text: 'Student B: "The unconscious patient suggests anaesthetics were in use, but the absence of gloves or clean clothing indicates the germ theory of infection had not yet been applied to surgery."', correct: true },
            { text: 'Student C: "The surgeon looks experienced because his coat is dirty."', correct: false },
            { text: 'Student D: "The source tells us surgery was happening in a hospital."', correct: false },
          ],
          explanation: 'Student B uses the source as evidence — inferring from what IS and IS NOT present. The unconscious patient = anaesthetics used. No gloves/protective equipment = pre-Lister, pre-antiseptic era. This is how AQA top marks are earned.',
        },
        {
          type: 'examtip',
          label: '⚔️ Exam Assassin',
          tip: 'Never just describe what you can see. Always infer what it SUGGESTS — and explain WHY using your own knowledge. "The source suggests X because Y — this is supported by the fact that Z." That three-part structure scores maximum inference marks.',
        },
        {
          type: 'keypoint',
          text: '🧠 <strong>Source Analysis Formula:</strong><br/>"The source suggests [X] because [detail from source]. This is significant because [your own knowledge about the period]. However, the source cannot tell us [limitation]."',
        },
      ],
    },

    // Screen 8 — Timeline Challenge
    {
      label: 'Timeline Challenge',
      kicker: 'Interactive',
      heading: 'WHO DID WHAT?',
      sub: 'Match the person to their breakthrough.',
      blocks: [
        {
          type: 'timelinedrag',
          topicLabel: 'Medicine Through Time',
          heading: 'WHO DID WHAT?',
          sub: 'Drag each person to the achievement they are most famous for.',
          examTip: {
            title: 'EXAM ASSASSIN',
            body: 'Learn the individual + what changed.',
          },
          people: [
            { id: 'vesalius', name: 'ANDREAS VESALIUS', color: '#8B6914' },
            { id: 'harvey',   name: 'WILLIAM HARVEY',   color: '#6B4C9A' },
            { id: 'jenner',   name: 'EDWARD JENNER',    color: '#2D6A4F' },
            { id: 'simpson',  name: 'JAMES YOUNG SIMPSON', color: '#A63D2F' },
            { id: 'lister',   name: 'JOSEPH LISTER',    color: '#1A4A6B' },
          ],
          items: [
            {
              id: 'vesalius', date: '1543', icon: '📖',
              achievement: 'Wrote detailed anatomy books based on human dissection.',
              keyword: 'ANATOMY',
              answer: 'vesalius',
              reveal: 'Doctors began trusting direct observation instead of blindly following Galen.',
              hint: "Not them. 1543, anatomy books, proved Galen wrong. Think printing press + a man with a scalpel. 💀",
            },
            {
              id: 'harvey', date: '1628', icon: '🫀',
              achievement: 'Discovered the circulation of the blood.',
              keyword: 'CIRCULATION',
              answer: 'harvey',
              reveal: 'Understanding circulation transformed anatomy — but treatments took longer to catch up.',
              hint: "Wrong person. This slot is heart, pump, blood going round and round. 1628. Not anatomy books. 👀",
            },
            {
              id: 'jenner', date: '1796', icon: '💉',
              achievement: 'Developed the smallpox vaccine to prevent disease.',
              keyword: 'VACCINATION',
              answer: 'jenner',
              reveal: 'Vaccination became one of the biggest breakthroughs in medical history.',
              hint: "Nope. Milkmaids got cowpox, didn't get smallpox — someone noticed. Vaccines. Prevention. Not surgery. 💉",
            },
            {
              id: 'simpson', date: '1847', icon: '☠️',
              achievement: 'Pioneered the use of anaesthesia in surgery.',
              keyword: 'ANAESTHESIA',
              answer: 'simpson',
              reveal: 'Surgery became less terrifying because patients could be unconscious.',
              hint: "Not that one. This slot ended the screaming — patients out cold. Chloroform, 1847. Don't mix it up with the infection guy. 😴",
            },
            {
              id: 'lister', date: '1867', icon: '🧴',
              achievement: 'Introduced antiseptic surgery to prevent infection.',
              keyword: 'ANTISEPTIC SURGERY',
              answer: 'lister',
              reveal: 'Antiseptics massively reduced deadly post-surgery infections.',
              hint: "Wrong end. Carbolic acid. Sprayed it on wounds, on instruments, on surgeons. Last breakthrough on the timeline. 🧴",
            },
          ],
        },
      ],
    },

    // Screen 9 — Final Boss
    {
      label: 'Final Boss',
      kicker: 'Challenge',
      heading: '⚔️ Final Boss: Could This Patient Survive?',
      sub: 'Three questions. Written answers. AI examiner marks against AQA criteria.',
      blocks: [
        {
          type: 'read',
          label: '🔥 The Scenario',
          text: '1845: A patient needs a leg amputation. The theatre is unsterilised. The instruments were last used this morning. There is no anaesthetic. No antiseptic. No X-ray. Explain how surgery would change between 1845 and 1900 — and what those changes meant for this kind of patient.',
        },
        {
          type: 'boss',
          tier: '🟢',
          label: 'Round 1 — Core Knowledge',
          question: 'Explain why surgery before 1846 was so dangerous. Give at least TWO reasons.',
          markPoints: `- No anaesthetics: patients were conscious, causing severe pain and shock — surgeons had to operate as fast as possible
- No antiseptics or understanding of infection: dirty instruments, unwashed hands and contaminated dressings caused post-operative infection
- Infection (gangrene, sepsis, pyaemia) killed a high proportion of surgical patients
- No sterilisation of equipment — the same instruments used on multiple patients spread bacteria
- Speed was prioritised over precision — rushed surgery increased complications
- Award 1 mark per developed point (up to 4 marks)`,
        },
        {
          type: 'boss',
          tier: '🟡',
          label: 'Round 2 — Change and Causation',
          question: 'Explain how Lister\'s work transformed surgery between 1865 and 1900. Why does his connection to Pasteur matter for AQA marks?',
          markPoints: `- Lister applied Pasteur's germ theory to surgery: recognised microorganisms caused post-operative infection
- Introduced carbolic acid spray to wounds, instruments and dressings (antiseptic surgery) from 1865
- Published in The Lancet 1867 — spread the technique through the medical profession
- Post-operative death rate fell dramatically: from ~45% to below 15% on his ward
- Led eventually to aseptic surgery: sterilised instruments, rubber gloves, clean theatres, surgical gowns
- Link to Pasteur: Lister did not discover germ theory — he APPLIED it. The examiner rewards the chain: Pasteur → Lister → antiseptic surgery → aseptic surgery
- Award 1 mark per developed point (up to 6 marks)`,
        },
        {
          type: 'boss',
          tier: '🔴',
          label: 'Round 3 — Boss Mode',
          question: '"Anaesthetics were the most important development in surgery between 1840 and 1900." How far do you agree? Explain your answer.',
          markPoints: `- Agreement — anaesthetics were significant:
  - Ended conscious suffering during operations (ether 1846, chloroform 1847)
  - Allowed surgeons to attempt more complex, longer procedures
  - Removed a major barrier to surgical progress — patient movement and shock
  - Queen Victoria's use (1853) gave anaesthetics social respectability
- Disagreement — antiseptics/aseptics were more important:
  - Anaesthetics did NOT reduce death rates — infection still killed ~45% post-operatively
  - Death rates only fell when Lister introduced carbolic acid (1867)
  - Aseptic techniques completed the transformation — preventing germs rather than just killing them
  - Without tackling infection, surgery remained extremely dangerous despite being painless
- X-rays and blood transfusions: honourable mention — extended the range and safety of surgery but built on the antiseptic/aseptic foundations
- Strong conclusion: anaesthetics were a NECESSARY but INSUFFICIENT development. The most important shift was from dirty to clean surgery — Lister's antiseptics and the subsequent aseptic revolution. Anaesthetics enabled longer operations; antiseptics made them survivable.
- Award marks for: AO1 knowledge of both sides, AO2 using specific evidence, AO3 sustained argument with justified conclusion`,
        },
      ],
    },

    // Screen 10 — Retrieval + Reflection
    {
      label: 'Retrieval',
      kicker: 'Final Retrieval',
      heading: 'Lock it in. No notes.',
      sub: 'Six questions. Everything from this module. Answer before you check.',
      blocks: [
        {
          type: 'read',
          label: '🔁 Why This Matters',
          text: 'Retrieval practice — testing yourself without looking back — is the fastest way to build long-term memory. Do this seriously and these facts will still be there on exam day.',
        },
        {
          type: 'tieredquiz',
          tiers: [
            {
              label: 'Core Facts', emoji: '🟢',
              questions: [
                {
                  q: 'Why did speed matter so much in surgery before 1846?',
                  options: [
                    'Because patients were conscious and every second in pain — speed was the only mercy',
                    'Because hospitals had to clear operating theatres quickly for more patients',
                    'Because blood loss was faster in longer operations',
                    'Because anaesthetic gases were only available for short periods',
                  ],
                  correct: 0,
                  feedback: 'No anaesthetics meant every second of surgery was agony. Speed reduced the duration of conscious suffering — it was literally merciful to be fast.',
                  hint: 'What did patients not have in 1845 that they had in 1847?',
                },
                {
                  q: 'What did Lister use to combat infection after surgery?',
                  options: [
                    'Carbolic acid spray applied to wounds and instruments',
                    'Ether gas pumped into the operating theatre',
                    'Boiling water to clean all instruments before use',
                    'Chloroform soaked into surgical dressings',
                  ],
                  correct: 0,
                  feedback: 'Lister used carbolic acid (phenol) — sprayed on wounds, soaked into dressings, and applied to instruments. This was antiseptic surgery.',
                  hint: 'Think: what acid begins with "c" and was derived from coal tar?',
                },
                {
                  q: 'What is the difference between antiseptic and aseptic surgery?',
                  options: [
                    'Antiseptic kills germs in the wound; aseptic prevents germs entering in the first place',
                    'Antiseptic prevents all germs; aseptic uses chemicals to reduce infection',
                    'Antiseptic is a type of anaesthetic; aseptic is a sterilisation technique',
                    'Antiseptic is the modern approach; aseptic was the Victorian approach',
                  ],
                  correct: 0,
                  feedback: 'Antiseptic = kill germs already present (Lister\'s carbolic acid). Aseptic = prevent germs entering (sterilised instruments, rubber gloves, sterile theatres). Know this cold.',
                  hint: 'Think about what each word means. Anti-septic = against infection. A-septic = without infection.',
                },
              ],
            },
            {
              label: 'Application', emoji: '🟡',
              questions: [
                {
                  q: 'Why did death rates from surgery not fall immediately after anaesthetics were introduced in 1846?',
                  options: [
                    'Because infection still killed patients after operations — anaesthetics only addressed pain',
                    'Because anaesthetics were not widely used until the 1880s',
                    'Because patients were still conscious during surgery in many hospitals',
                    'Because blood transfusions were not yet available to replace blood loss',
                  ],
                  correct: 0,
                  feedback: 'Anaesthetics solved pain — not infection. Post-operative death rates from gangrene, sepsis and pyaemia remained high until Lister\'s antiseptic methods reduced them from the late 1860s onward.',
                  hint: 'What was the main cause of death after operations — not during them?',
                },
                {
                  q: 'A surgeon in 1855 wears a dirty apron, reuses unsterilised instruments and never washes his hands. Which development would MOST reduce his patients\' death rate?',
                  options: [
                    'Adopting Lister\'s carbolic acid spray and antiseptic technique',
                    'Learning to operate more quickly',
                    'Using ether before each operation',
                    'Moving to a larger hospital with more assistants',
                  ],
                  correct: 0,
                  feedback: 'Lister\'s antiseptic technique would directly address the cause of most post-operative deaths — infection from contaminated instruments, hands and dressings. Speed and anaesthetics don\'t tackle infection.',
                  hint: 'Which development in this module specifically targeted infection from dirty equipment?',
                },
              ],
            },
            {
              label: 'Exam Assassin', emoji: '🔴',
              questions: [
                {
                  q: 'Explain why linking Pasteur and Lister is important in a high-mark AQA answer about surgery.',
                  options: [
                    'Because Lister did not discover germ theory himself — he applied Pasteur\'s discovery to surgery. The chain shows how scientific understanding transferred into medical practice.',
                    'Because Pasteur and Lister were colleagues who worked together in the same laboratory.',
                    'Because Pasteur invented antiseptics and Lister was the first surgeon to use them in operations.',
                    'Because both men proved that germs cause disease independently of each other.',
                  ],
                  correct: 0,
                  feedback: 'The Pasteur → Lister link demonstrates that Lister\'s achievement was APPLICATION, not discovery. AQA rewards answers that show how scientific knowledge (germ theory) led to medical change (antiseptic surgery). That\'s cause and consequence — the core of historical thinking.',
                  hint: 'Who discovered germ theory? Who applied it to surgery? What was the relationship between those two events?',
                },
                {
                  q: 'Evaluate which was more important: the introduction of anaesthetics OR the introduction of antiseptics. Identify the strongest argument.',
                  options: [
                    'Antiseptics were more important because anaesthetics reduced pain but did not reduce death rates — only tackling infection made surgery survivable.',
                    'Anaesthetics were more important because without them, surgery could not be attempted at all.',
                    'Both were equally important — neither alone was sufficient to make surgery safe.',
                    'X-rays were the most important because they allowed diagnosis without cutting.',
                  ],
                  correct: 0,
                  feedback: 'This is the strongest argument for AQA evaluation: anaesthetics were NECESSARY but INSUFFICIENT. Death rates only fell when infection was addressed. Antiseptics (and later aseptics) were what made surgery survivable — not merely less painful. Option C is also defensible, but option A is the sharpest evaluation.',
                  hint: 'Which development actually reduced the death rate from surgery? Which only reduced pain?',
                },
              ],
            },
          ],
        },
        {
          type: 'keypoint',
          text: '🎓 <strong>You survived Victorian surgery.</strong> Statistically impressive.<br/><br/>You now understand one of the biggest turning points in medical history: why surgery was terrifying before 1840, how anaesthetics changed what was possible, why infection was the real killer, how Lister transformed surgery, the antiseptic/aseptic distinction, and how X-rays accelerated the revolution.<br/><br/>That\'s the Surgery Revolution done.',
        },
      ],
    },
  ],
}

export default episode
