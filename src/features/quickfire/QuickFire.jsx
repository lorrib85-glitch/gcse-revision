import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { SPACING }  from '../../constants/spacing.js'
import { RADII }    from '../../constants/radii.js'
import { TYPE }     from '../../constants/typography.js'
import { GENERAL }  from '../../constants/generalTheme.js'
import { MOTION }   from '../../constants/motion.js'
import { SOCIOLOGY_GROUPS } from '../../data/sociologyGroups.js'
import { CHEM_IMAGES } from '../../data/chemImages.js'
import { MEDICINE_2023_PAPER, J23_Q1, J23_Q2A, J23_Q2B, J23_Q3, J23_Q4, J23_Q5, J23_Q6 } from '../../data/medicineExamPapers.js'
import { FIGURES } from '../../figures.js'
import { getProgress, recordScore, getAllConfidenceRatings } from '../../progress.js'
import { getSuggestedQuestionType, logWrongAnswer, logCorrectAnswer } from '../../unifiedWeaknessTracker.js'
import { MODULES } from '../../modules.js'
import { TAG_MODULE_MAP, findTaggedScreen } from '../../data/tagModuleMap.js'
import { QUICK_QUIZ_QUESTIONS } from '../../data/quickQuizData.js'
import { StreakChip } from '../home/StreakChip.jsx'
import BackButton from '../../components/core/BackButton.jsx'
import ContinueCTA from '../../components/core/ContinueCTA.jsx'
import ExamQuestionFrame from '../../components/feedback/ExamQuestionFrame.jsx'
import ExamRoundDebrief from '../../components/feedback/ExamRoundDebrief.jsx'
import GuidedAnswerCoach from '../../components/learning/GuidedAnswerCoach.jsx'

// ─── Exam Mode question-bank loading ───────────────────────────────────────────
// The Maths/English/Sociology/Chemistry question banks and the exam-technique
// coach types are only needed inside Exam Mode (TestTab mode="exam") — load
// them on demand and share them via context so they're not in the main bundle.

const TestDataContext = createContext(null)

function useTestData() {
  return useContext(TestDataContext)
}

export function TestDataProvider({ children }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([
      import('../../data/mathsTopics.js'),
      import('../../data/englishTopics.js'),
      import('../../data/sociologyTopics.js'),
      import('../../data/chemistryTopics.js'),
      import('../../data/guidedAnswerCoach.js'),
    ]).then(([maths, english, sociology, chemistry, coach]) => {
      setData({
        MATHS_TOPIC_GROUPS: maths.MATHS_TOPIC_GROUPS,
        ALL_MATHS_QUESTIONS: maths.ALL_MATHS_QUESTIONS,
        FORMULA_SHEET: maths.FORMULA_SHEET,
        DIAGRAMS: maths.DIAGRAMS,
        ENGLISH_TOPIC_GROUPS: english.ENGLISH_TOPIC_GROUPS,
        ALL_ENGLISH_QUESTIONS: english.ALL_ENGLISH_QUESTIONS,
        SOCIOLOGY_TOPIC_GROUPS: sociology.SOCIOLOGY_TOPIC_GROUPS,
        ALL_SOCIOLOGY_QUESTIONS: sociology.ALL_SOCIOLOGY_QUESTIONS,
        CHEMISTRY_TOPIC_GROUPS: chemistry.CHEMISTRY_TOPIC_GROUPS,
        ALL_CHEMISTRY_QUESTIONS: chemistry.ALL_CHEMISTRY_QUESTIONS,
        GUIDED_COACH_TYPES: coach.GUIDED_COACH_TYPES,
      })
    })
  }, [])

  if (!data) return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: '#08090D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src="/logo.png" alt="" style={{ width: 64, height: 64, objectFit: 'contain', opacity: 0.5 }} />
    </div>
  )
  return <TestDataContext.Provider value={data}>{children}</TestDataContext.Provider>
}

// ─── Shared palette ──────────────────────────────────────────────────────────

const W = {
  bg:         '#070B1A',
  bgCard:     '#151720',
  border:     'rgba(255,255,255,0.1)',
  text:       '#F5F7FB',
  textMid:    '#C8D0E8',
  textMuted:  '#9CA8C7',
  textLight:  '#5A6480',
  gold:       '#F5B700',
  goldLight:  'rgba(245,183,0,.12)',
  green:      '#4DFF88',
  btnPrimary: 'linear-gradient(135deg, #F5B700, #C98719)',
}

const PULSE_GOLD = '#D2A24C'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ─── Shared "go" arrow used on task/mode cards across Home, Pulse and Exams.
function NavArrow({ color }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function hexToRgb(hex) {
  if (!hex || hex.length < 7) return '255,255,255'
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r},${g},${b}`
}


// ─── Test tab ─────────────────────────────────────────────────────────────────

const TEST_TOPICS = [
  {
    subject: 'History',
    icon: '📜',
    topics: [
      { id: 'th1',      label: 'Medieval Medicine c1250–c1500',        questions: 5,  available: true },
      { id: 'th2',      label: 'Renaissance & the Plague c1500–c1700', questions: 4,  available: true },
      { id: 'th3',      label: 'Surgery & Anatomy c1700–c1900',        questions: 4,  available: true },
      { id: 'th4',      label: 'Germ Theory c1850–c1900',              questions: 3,  available: true },
      { id: 'th5',      label: 'Public Health c1800–c1900',            questions: 3,  available: true },
      { id: 'th_wf',    label: 'Western Front 1914–18',                questions: 3,  available: true },
      { id: 'th_modern',label: 'Modern Medicine c1900–present',        questions: 1,  available: true },
    ]
  },
  {
    subject: 'Biology',
    icon: '🧬',
    topics: [
      { id: 'tb_cells',    label: 'Cells, microscopy & size calculations', questions: 6,  available: true },
      { id: 'tb_digest',   label: 'Digestion, enzymes & absorption',       questions: 9,  available: true },
      { id: 'tb_transp',   label: 'Transpiration, stomata & water loss',   questions: 8,  available: true },
      { id: 'tb_resp',     label: 'Respiration — aerobic & anaerobic',     questions: 6,  available: true },
      { id: 'tb_blood',    label: 'Blood, heart & circulatory system',     questions: 8,  available: true },
      { id: 'tb_immune',   label: 'Disease, immunity & drug testing',      questions: 11, available: true },
      { id: 'tb_osmosis',  label: 'Osmosis & water movement',              questions: 6,  available: true },
      { id: 'tb_photo',    label: 'Photosynthesis',                        questions: 6,  available: true },
      { id: 'tb_cells_div','label': 'Cell division, growth & mitosis',     questions: 4,  available: true },
    ]
  },
  { subject: 'Chemistry',          icon: '⚗️',  topics: [{ id: 'tc1',   label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'Physics',            icon: '⚡',  topics: [{ id: 'tp1',   label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'Maths',              icon: '📐',  topics: [{ id: 'tm1',   label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'Music',              icon: '🎵',  topics: [{ id: 'tmu1',  label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'Sociology',          icon: '👥',  topics: [{ id: 'ts1',   label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'English Literature', icon: '📚',  topics: [{ id: 'tel1',  label: 'Coming soon', questions: 0, available: false }] },
  { subject: 'English Language',   icon: '✍️',  topics: [{ id: 'tela1', label: 'Coming soon', questions: 0, available: false }] },
]


// ── Real AQA past paper questions with real mark schemes ──────────────────────
// Source: AQA 8464/B/1F June 2020 + Nov 2020

const PAST_PAPER_QS = {

  // ── HISTORY ──────────────────────────────────────────────────────────────────

  th1: [
    { q: `Describe two features of medieval hospitals. [4 marks]`, type: 'written', marks: 4, ms: `Award up to 2 marks per feature (1 for identifying, 1 for supporting detail). Features include: run by the Church/monks/nuns; focused on care and prayer rather than curing disease; St Bartholomew's Hospital founded 1123; patients prayed and received basic care; hospitals were places of rest not medical treatment; staffed by religious orders.` },
    { q: `Explain why the Church both helped and hindered medicine in the Middle Ages. [12 marks]`, type: 'written', marks: 12, ms: `Helped: preserved Galen's texts in universities; ran hospitals like St Bartholomew's (1123); provided care for sick; trained physicians. Hindered: discouraged dissection (body needed to be whole for resurrection); treated Galen's work as unquestionable; linked illness to sin/God's punishment; discouraged new thinking. Strong answers explain the mechanism, not just list.` },
    { q: `How far was the Black Death a turning point in the history of medicine? Explain your answer. [16 marks]`, type: 'written', marks: 16, ms: `Was a turning point: exposed limits of medieval medicine; prompted some public health action. Counter: beliefs and treatments barely changed; humours still dominant after 1349; no new understanding of disease. Strong answers need specific evidence (1348 arrival, 1/3 died, miasma/God's punishment blamed), explain why change/continuity happened, reach clear supported judgement.` },
    { q: `"The main reason medieval medicine made little progress was the influence of the Church." How far do you agree? Explain your answer. [16 marks]`, type: 'written', marks: 16, ms: `Agree: Church backed Galen, discouraged dissection, linked illness to God, trained physicians in outdated ideas. Disagree: other factors — lack of technology, four humours theory itself, tradition and conservatism, limited scientific method, Galen's own authority. Strong answers argue both sides with specific evidence, reach a clear judgement about which factor was most important and why.` },
    J23_Q3,
  ],
  th2: [
    { q: "Describe two features of Vesalius's contribution to medicine. [4 marks]", type: 'written', marks: 4, ms: `Award up to 2 marks per feature. Features: corrected over 300 of Galen's errors; used human dissection himself; published De Fabrica (1543); proved jaw is one bone; showed septum of heart had no holes; encouraged observation over ancient authority.` },
    { q: "Explain why Harvey's discovery of blood circulation did not immediately lead to better treatments. [12 marks]", type: 'written', marks: 12, ms: `Key points: Harvey proved blood circulates but could not explain what blood does; doctors still used bloodletting because they did not know what else to do; understanding does not automatically change treatment; conservative medical profession; lack of technology. Strong answers explain the mechanism — why understanding and treatment are separate things.` },
    { q: `How far did the Renaissance change medicine? Explain your answer. [16 marks]`, type: 'written', marks: 16, ms: `Changed: Vesalius corrected anatomy, Harvey proved circulation, Paré improved surgery, printing press spread ideas. Continuity: treatments barely changed, humours still used, bleeding/purging continued, Great Plague 1665 shows disease understanding remained poor. Strong answers: balanced argument with specific evidence, clear judgement on extent of change.` },
    J23_Q5,
  ],
  th3: [
    { q: `Describe two problems with surgery before the 1840s. [4 marks]`, type: 'written', marks: 4, ms: `Award up to 2 marks per problem. Problems: no anaesthetic so patients conscious and in pain; no antiseptics so infection was common; no blood transfusions so blood loss often fatal; dirty instruments spread infection; surgeons judged on speed not care.` },
    { q: `Explain why anaesthetics both helped and created new problems for surgery. [12 marks]`, type: 'written', marks: 12, ms: `Helped: removed pain, patients could stay still, surgeons could work more carefully, longer operations possible. Problems: longer operations increased infection risk; overconfidence led to more ambitious surgery before antiseptics; chloroform could be fatal if overdosed (Hannah Greener, 1848). Strong answers explain both effects with specific evidence.` },
    { q: "How important was Lister's use of antiseptics in improving surgery? [16 marks]", type: 'written', marks: 16, ms: `Important: carbolic acid dramatically reduced infection deaths; applied Pasteur's germ theory practically; changed surgical practice; aseptic surgery followed. Limits: other factors also improved surgery — anaesthetics (Simpson 1847), blood groups, aseptic methods went further; initial resistance from surgeons. Strong answers: weigh against other factors, reach supported judgement.` },
    J23_Q6,
  ],
  th4: [
    { q: "Describe two features of Pasteur's germ theory. [4 marks]", type: 'written', marks: 4, ms: `Award up to 2 marks per feature. Features: proved micro-organisms cause disease/decay; swan-neck flask experiment (1861); overturned spontaneous generation; showed microbes come from air; led to pasteurisation; opened door to vaccines and antiseptics.` },
    { q: "Explain why Koch's work was important for the development of medicine. [12 marks]", type: 'written', marks: 12, ms: `Key points: identified specific bacteria causing specific diseases (anthrax 1876, TB 1882, cholera 1883); developed staining techniques; made germ theory more convincing; enabled development of targeted treatments; built on Pasteur's general germ theory. Strong answers explain why specificity mattered.` },
    { q: `"Pasteur's germ theory was the most important development in medicine in the 19th century." How far do you agree? [16 marks]`, type: 'written', marks: 16, ms: `Agree: germ theory underpinned antiseptic surgery, vaccines, public health reform; changed direction of all medicine; Pasteur's swan-neck flask 1861 was pivotal. Disagree: other developments also important — anaesthetics (Simpson 1847), public health acts (1848, 1875), Koch's specific discoveries, Lister's antiseptics, Snow's waterborne cholera proof. Strong answers: weigh with specific evidence, clear supported judgement.` },
  ],
  th5: [
    { q: `Describe two features of the 1875 Public Health Act. [4 marks]`, type: 'written', marks: 4, ms: `Award up to 2 marks per feature. Features: compulsory clean water supply; compulsory sewage systems; local authorities had to appoint medical officers of health; made sanitation improvements mandatory; shift away from laissez-faire; built on the weaker 1848 Act.` },
    { q: `Explain why the government was slow to improve public health in the early 19th century. [12 marks]`, type: 'written', marks: 12, ms: `Key reasons: laissez-faire attitude (government should not interfere); cost — ratepayers did not want to pay; miasma theory meant people did not fully understand disease; vested interests (landlords, water companies); local not national responsibility; 1848 Act was optional not compulsory. Strong answers explain mechanism with evidence.` },
    { q: `How far was the Great Stink of 1858 a turning point in the history of public health? [16 marks]`, type: 'written', marks: 16, ms: `Was a turning point: Parliament directly affected so reform became urgent; led to Bazalgette's sewer system; reduced cholera outbreaks in London; showed engineering could solve public health. Not/other factors: Chadwick's 1842 report laid groundwork; Snow's 1854 pump handle removal proved waterborne spread; 1875 Act was arguably more significant nationally. Strong answers: balanced argument, specific evidence, clear judgement.` },
  ],

  // ── HISTORY — Western Front 1914–18 (Edexcel 1HI0/11) ────────────────────────

  th_wf: [ J23_Q1, J23_Q2A, J23_Q2B ],

  // ── HISTORY — Modern Medicine c1900–present (Edexcel 1HI0/11) ────────────────

  th_modern: [ J23_Q4 ],

  // ── BIOLOGY — Cells & microscopy ─────────────────────────────────────────────
  // Sources: Jun22 Q2, Jun23 Q7, Jun24 B1 Q1

  tb_cells: [
    {
      q: `What is the function of the nucleus in a cell? Tick ONE box.\n\n[ ] To contain a solution called cell sap\n[ ] To control the activities of the whole cell\n[ ] To control the movement of substances into the cell`,
      type: 'mc', marks: 1,
      options: ['To contain a solution called cell sap', 'To control the activities of the whole cell', 'To control the movement of substances into the cell'],
      correct: 1,
      ms: `To control the activities of the whole cell. [1 mark]`
    },
    {
      q: `What is the function of the mitochondria in a cell? Tick ONE box.\n\n[ ] To produce glucose during photosynthesis\n[ ] To produce proteins for the cell\n[ ] To release energy in respiration`,
      type: 'mc', marks: 1,
      options: ['To produce glucose during photosynthesis', 'To produce proteins for the cell', 'To release energy in respiration'],
      correct: 2,
      ms: `To release energy in respiration. [1 mark]`
    },
    {
      q: `A palisade cell image measured 28 mm in length when viewed at a magnification of ×400. Calculate the real length of the palisade cell in mm. Then convert to micrometres (µm). 1 mm = 1000 µm. [3 marks]\n\nUse: real length = image length ÷ magnification`,
      type: 'written', marks: 3,
      ms: `Real length = 28 ÷ 400 = 0.07 mm [2 marks for correct working and answer]. Conversion: 0.07 × 1000 = 70 µm [1 mark]. Allow ecf from incorrect real length calculation.`
    },
    {
      q: `Give ONE advantage of using an electron microscope compared with a light microscope. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Any one from: greater magnification; higher resolving power; can see (smaller) subcellular structures/parts; can see more detail inside cells; reference to 3-D images.`
    },
    {
      q: `Give ONE way you can tell that an animal cell is NOT a plant cell. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Any one from: does not have a cell wall; does not have a (large) vacuole; does not have chloroplasts. Ignore chlorophyll.`
    },
    {
      q: `Which part of a cell controls the movement of substances into and out of the cell? Tick ONE box.\n\n[ ] Cell membrane\n[ ] Cytoplasm\n[ ] Nucleus`,
      type: 'mc', marks: 1,
      options: ['Cell membrane', 'Cytoplasm', 'Nucleus'],
      correct: 0,
      ms: `Cell membrane. [1 mark]`
    },
  ],

  // ── BIOLOGY — Digestion & enzymes ─────────────────────────────────────────────
  // Sources: Jun20 Q6, Jun22 Q1, Jun23 Q2, Jun24 B1 Q6

  tb_digest: [
    {
      q: `What type of enzyme is produced in the stomach? Tick ONE box.\n\n[ ] Carbohydrase\n[ ] Lipase\n[ ] Protease`,
      type: 'mc', marks: 1,
      options: ['Carbohydrase', 'Lipase', 'Protease'],
      correct: 2,
      ms: `Protease. [1 mark]`
    },
    {
      q: `Which term describes the pH in the stomach? And give ONE reason why the stomach is this pH. [2 marks]\n\n[ ] Acidic  [ ] Alkaline  [ ] Neutral`,
      type: 'written', marks: 2,
      ms: `Acidic [1 mark]. Reason: any one from — produces (hydrochloric) acid; optimum/best condition for protease/enzyme to act; to kill microorganisms/bacteria/pathogens. [1 mark]`
    },
    {
      q: `Which organ produces bile? Tick ONE box.\n\n[ ] Large intestine\n[ ] Liver\n[ ] Mouth\n[ ] Pancreas`,
      type: 'mc', marks: 1,
      options: ['Large intestine', 'Liver', 'Mouth', 'Pancreas'],
      correct: 1,
      ms: `Liver. [1 mark]`
    },
    {
      q: `How does bile help in the digestion of foods? Tick ONE box.\n\n[ ] It increases the surface area of fats\n[ ] It is an enzyme that digests protein\n[ ] It makes the pH in the small intestine acidic`,
      type: 'mc', marks: 1,
      options: ['It increases the surface area of fats', 'It is an enzyme that digests protein', 'It makes the pH in the small intestine acidic'],
      correct: 0,
      ms: `It increases the surface area of fats. [1 mark] — bile emulsifies fats, breaking them into smaller droplets to increase surface area for lipase to act on.`
    },
    {
      q: `What molecules are produced when starch is digested? Tick ONE box.\n\n[ ] Amino acids\n[ ] Fatty acids\n[ ] Sugars`,
      type: 'mc', marks: 1,
      options: ['Amino acids', 'Fatty acids', 'Sugars'],
      correct: 2,
      ms: `Sugars. [1 mark] — amylase breaks starch down into maltose/glucose (sugars).`
    },
    {
      q: `What is the name of the enzyme that digests starch? [1 mark]`,
      type: 'written', marks: 1,
      ms: `Amylase. Allow phonetic spelling. Allow carbohydrase. Do NOT accept amylose.`
    },
    {
      q: `Where are most food molecules absorbed? Tick ONE box.\n\n[ ] Large intestine\n[ ] Liver\n[ ] Small intestine\n[ ] Stomach`,
      type: 'mc', marks: 1,
      options: ['Large intestine', 'Liver', 'Small intestine', 'Stomach'],
      correct: 2,
      ms: `Small intestine. [1 mark]`
    },
    {
      fig: 'nov20_villi',
      q: `Explain how villi are adapted for efficient absorption of sugar molecules. [4 marks]`,
      type: 'written', marks: 4,
      ms: `Level 2 (3–4): points identified in detail and logically linked. Level 1 (1–2): points stated simply, no linking.\n\nIndicative content: have (many) microvilli to increase surface area; wall of villus only one cell thick/thin so short diffusion pathway; capillaries close to surface; good blood supply to transport food molecules away and maintain diffusion gradient; cells have many mitochondria providing energy for active transport of sugar molecules. For Level 2 must link structure to function.`
    },
    {
      q: `Describe how protein and fat are digested. Include the enzymes involved and where they are produced. [6 marks]`,
      type: 'written', marks: 6,
      ms: `Level 2 (4–6): accurate detail forming a clear account. Level 1 (1–3): facts stated simply.\n\nProtein: protease enzyme; broken down into amino acids; produced in the stomach; produced in the pancreas; produced in the small intestine; hydrochloric acid provides correct pH for protease in stomach.\n\nFat: lipase enzyme; broken down into fatty acids and glycerol; produced by the pancreas; produced by the small intestine; bile produced by the liver, released from gall bladder; bile emulsifies fats (increases surface area for lipase); bile neutralises acid to provide correct pH.\n\nFor Level 2 must describe digestion of BOTH fat and protein linked to correct enzyme type for both.`
    },
  ],

  // ── BIOLOGY — Transpiration & stomata ─────────────────────────────────────────
  // Sources: Jun20 Q3, Jun23 Q3, Jun24 B1 Q2

  tb_transp: [
    {
      q: `What is the loss of water from a leaf called? Tick ONE box.\n\n[ ] Osmosis\n[ ] Respiration\n[ ] Transpiration`,
      type: 'mc', marks: 1,
      options: ['Osmosis', 'Respiration', 'Transpiration'],
      correct: 2,
      ms: `Transpiration. [1 mark]`
    },
    {
      q: `Which cells control the size of stomata? Tick ONE box.\n\n[ ] Guard cells\n[ ] Phloem cells\n[ ] Xylem cells`,
      type: 'mc', marks: 1,
      options: ['Guard cells', 'Phloem cells', 'Xylem cells'],
      correct: 0,
      ms: `Guard cells. [1 mark]`
    },
    {
      fig: 'nov20_leaf_experiment',
      q: `A leaf grease experiment showed: Leaf B (upper surface covered) lost 0.13 g of mass; Leaf C (lower surface covered) lost 0.05 g. What evidence does this give about where most water is lost from? [1 mark]`,
      type: 'written', marks: 1,
      ms: `Leaf B (upper surface covered) lost more mass/water than Leaf C (lower surface covered), so more water is lost from the lower surface. Allow: "lower surface lost 0.13 g and upper surface lost 0.05 g" with conclusion.`
    },
    {
      q: `Based on the leaf grease experiment, what do the results show about the number of stomata on leaf surfaces? Tick ONE box.\n\n[ ] There are more stomata on the lower surface\n[ ] There are more stomata on the upper surface\n[ ] There are the same number of stomata on both surfaces`,
      type: 'mc', marks: 1,
      options: ['There are more stomata on the lower surface', 'There are more stomata on the upper surface', 'There are the same number of stomata on both surfaces'],
      correct: 0,
      ms: `There are more stomata on the lower surface. [1 mark] — because more water was lost when the lower surface was uncovered (Leaf B vs Leaf C).`
    },
    {
      q: `A leaf investigation was done at 20°C. How would the mass of water lost be different at 25°C? Give a reason for your answer. [2 marks]`,
      type: 'written', marks: 2,
      ms: `More (mass/water) lost [1 mark] because evaporation/transpiration would be faster at higher temperature [1 mark].`
    },
    {
      q: `A student investigated loss of mass from leaves in different wind speeds. Results: fan off = 0.06 g, low = 0.15 g, medium = 0.23 g, high = 0.31 g.\n\nHow does increasing fan speed affect the loss of mass from the leaves? Use the results. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Loss of mass increases (as fan speed increases). Allow: more mass/water is lost; mass of leaves decreases more.`
    },
    {
      q: `Explain why the mass of leaves decreased at all fan speeds (including with the fan off). [3 marks]`,
      type: 'written', marks: 3,
      ms: `Loss of water [1 mark] because water evaporated [1 mark] from stomata/stoma [1 mark]. Allow: by transpiration; by diffusion. Ignore: from guard cells.`
    },
    {
      q: `What rate of water loss from a plant losing 9.0 g over 5 hours? Tick ONE box.\n\n[ ] 0.9 grams/hour\n[ ] 1.8 grams/hour\n[ ] 9.0 grams/hour`,
      type: 'mc', marks: 1,
      options: ['0.9 grams/hour', '1.8 grams/hour', '9.0 grams/hour'],
      correct: 1,
      ms: `1.8 grams/hour. [1 mark] — 9.0 ÷ 5 = 1.8 g/hour.`
    },
  ],

  // ── BIOLOGY — Respiration ─────────────────────────────────────────────────────
  // Sources: Jun20 Q1, Jun23 Q5

  tb_resp: [
    {
      q: `What is the equation for aerobic respiration? Tick ONE box.\n\n[ ] carbon dioxide + water → glucose + oxygen\n[ ] glucose + oxygen → carbon dioxide + water\n[ ] oxygen + water → glucose + carbon dioxide`,
      type: 'mc', marks: 1,
      options: ['carbon dioxide + water → glucose + oxygen', 'glucose + oxygen → carbon dioxide + water', 'oxygen + water → glucose + carbon dioxide'],
      correct: 1,
      ms: `glucose + oxygen → carbon dioxide + water. [1 mark]`
    },
    {
      q: `Give two health benefits of regular exercise. Do NOT refer to losing body mass. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: strengthens muscles; strengthens heart muscle; reduces risk of coronary heart disease; reduces blood pressure; reduces risk of Type 2 diabetes; improves mental health/mood; improves mobility; improves stamina; reduces blood cholesterol; strengthens bones; boosts immunity. Ignore: references to losing weight; immediate effects of exercise (e.g. increases heart rate); "makes you healthier" unqualified.`
    },
    {
      q: `Give two changes that happen in the body during aerobic exercise. Do NOT refer to increased breathing rate. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: deeper/heavier breathing; increased heart rate; increased body temperature; increased sweating; increased blood flow to skin/muscles; blood flows faster. Do NOT accept: lactic acid is produced (that is anaerobic).`
    },
    {
      q: `Muscles respire anaerobically during vigorous exercise. Complete the sentences.\n\nMuscles respire anaerobically if they do not have enough _______.\n\nAnaerobic respiration of glucose produces _______. [2 marks]`,
      type: 'written', marks: 2,
      ms: `First blank: oxygen (allow O₂). Second blank: lactic acid. [1 mark each] Word takes precedence over symbol.`
    },
    {
      q: `Explain the differences in the air breathed into the lungs and the air breathed out. (Oxygen in: 21%, out: 16%; Carbon dioxide in: 0.04%, out: 4%; Nitrogen: 78% both.) [4 marks]`,
      type: 'written', marks: 4,
      ms: `Level 2 (3–4): relevant points with logical linking. Level 1 (1–2): points stated simply, no linking.\n\nIndicative content: less oxygen in exhaled air because body has used some for respiration; more carbon dioxide in exhaled air because carbon dioxide is produced in respiration; no difference in nitrogen because nitrogen is not used by the body; more water vapour in air breathed out because water is produced in respiration; exhaled air is warmer because energy is transferred during respiration.\n\nFor Level 2: explanation(s) AND differences must be given.`
    },
    {
      q: `Give two ways the lungs are adapted for efficient gas exchange. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: many alveoli; large surface area; short diffusion distance; wall of alveolus only one cell thick/thin; wall of blood capillaries only one cell thick; good blood supply; well ventilated. Allow: short distance for gas to travel. Ignore: moist.`
    },
  ],

  // ── BIOLOGY — Blood & circulatory system ──────────────────────────────────────
  // Sources: Jun23 Q4, Jun24 B1 Q3

  tb_blood: [
    {
      q: `Which chamber of the heart pumps blood to the body? Tick ONE box.\n\n[ ] Left atrium\n[ ] Left ventricle\n[ ] Right atrium\n[ ] Right ventricle`,
      type: 'mc', marks: 1,
      options: ['Left atrium', 'Left ventricle', 'Right atrium', 'Right ventricle'],
      correct: 1,
      ms: `Left ventricle. [1 mark]`
    },
    {
      q: `What is the name of the blood vessel that carries blood to the heart muscle? Tick ONE box.\n\n[ ] Aorta\n[ ] Coronary artery\n[ ] Pulmonary artery`,
      type: 'mc', marks: 1,
      options: ['Aorta', 'Coronary artery', 'Pulmonary artery'],
      correct: 1,
      ms: `Coronary artery. [1 mark]`
    },
    {
      q: `Which type of blood vessel has valves? Tick ONE box.\n\n[ ] Artery\n[ ] Capillary\n[ ] Vein`,
      type: 'mc', marks: 1,
      options: ['Artery', 'Capillary', 'Vein'],
      correct: 2,
      ms: `Vein. [1 mark]`
    },
    {
      q: `What is the function of valves in the heart and veins? [1 mark]`,
      type: 'written', marks: 1,
      ms: `To stop blood flowing in the wrong direction. Allow: to stop blood flowing backwards; to stop backflow of blood; to keep blood flowing in the correct direction.`
    },
    {
      q: `Explain ONE way a capillary is adapted for its function. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Walls that are one cell thick [1 mark] so there is a short diffusion distance / substances can move quickly between blood and cells [1 mark]. OR large surface area to volume ratio [1 mark] for exchange of substances [1 mark]. Allow: thin walls / very narrow (so) close to cells.`
    },
    {
      q: `Explain why having more red blood cells will improve an athlete's performance. [3 marks]`,
      type: 'written', marks: 3,
      ms: `More oxygen can be transported/carried [1 mark]. Oxygen is needed for aerobic respiration [1 mark]. So more energy can be transferred/released (for muscle contraction) [1 mark]. Allow: so less anaerobic respiration. Do NOT accept: energy is made/produced/created.`
    },
    {
      q: `Which part of the blood causes blood to clot? Tick ONE box.\n\n[ ] Plasma\n[ ] Platelets\n[ ] Red blood cells`,
      type: 'mc', marks: 1,
      options: ['Plasma', 'Platelets', 'Red blood cells'],
      correct: 1,
      ms: `Platelets. [1 mark]`
    },
    {
      q: `A heart attack happens when plaques block a coronary artery. Explain how the blockage can lead to the death of muscle cells in the heart. [3 marks]`,
      type: 'written', marks: 3,
      ms: `Less/no blood flow [1 mark] so less/no oxygen to heart muscle/cells [1 mark] so less/no respiration (so less energy available) [1 mark]. Ignore reference to lactic acid.`
    },
  ],

  // ── BIOLOGY — Disease, immunity & drugs ───────────────────────────────────────
  // Sources: Jun20 Q2 & Q4, Jun22 Q3 & Q5, Jun23 Q6, Jun24 B1 Q4

  tb_immune: [
    {
      q: `Give two ways that the body prevents pathogens entering the body. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: skin (acts as a barrier); mucus in trachea/bronchi/nose; cilia in respiratory tract; hydrochloric acid in stomach; scab forms over wounds; tears. Allow: mucus in airways. Ignore: references to hairs; immune response.`
    },
    {
      q: `Describe how the immune system defends the body against disease. [6 marks]`,
      type: 'written', marks: 6,
      ms: `Level 2 (4–6): scientifically accurate detail with clear logical linking. Level 1 (1–3): facts listed without linking.\n\nIndicative content: white blood cells detect/identify foreign antigens; phagocytes engulf and digest/kill invading cells; lymphocytes produce antibodies which attach to and destroy/agglutinate pathogens; produce antitoxins to destroy toxins; produce memory cells so immune response to later exposure is faster.\n\nFor Level 2: must describe HOW white blood cells act, not just name them.`
    },
    {
      q: `Give ONE reason why antibiotics cannot be used to treat HIV infections. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Any one from: HIV is a virus; antibiotics do not kill viruses; antibiotics are used to kill bacteria. Allow: HIV is not a bacterium.`
    },
    {
      q: `Give two ways to prevent the spread of HIV. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: avoid sexual intercourse; use a condom; do not share needles; use antiretroviral drugs; screen blood for transfusions; have regular tests. Ignore: handwashing; social distancing; "use protection" unqualified.`
    },
    {
      q: `What type of pathogen causes rose black spot disease? Tick ONE box.\n\n[ ] Bacterium\n[ ] Fungus\n[ ] Protist\n[ ] Virus`,
      type: 'mc', marks: 1,
      options: ['Bacterium', 'Fungus', 'Protist', 'Virus'],
      correct: 1,
      ms: `Fungus. [1 mark]`
    },
    {
      q: `How is the malaria pathogen transferred to humans? [1 mark]`,
      type: 'written', marks: 1,
      ms: `By the bite of a mosquito/insect vector. Allow: through a mosquito bite.`
    },
    {
      q: `What is the name of the first antibiotic developed? [1 mark]`,
      type: 'written', marks: 1,
      ms: `Penicillin. [1 mark]`
    },
    {
      q: `Suggest why doctors do not give antibiotics to patients with minor infections. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Any one from: to prevent/reduce antibiotic resistance; overuse of antibiotics leads to resistant strains; minor infections are often caused by viruses (which antibiotics cannot treat); the immune system can deal with minor infections on its own.`
    },
    {
      q: `During Phase 1 clinical trials, a drug is tested on healthy volunteers using low doses. What is the main purpose of Phase 1 testing? Tick ONE box.\n\n[ ] To find the best dose to use\n[ ] To see if the drug is safe to use\n[ ] To see if the drug works`,
      type: 'mc', marks: 1,
      options: ['To find the best dose to use', 'To see if the drug is safe to use', 'To see if the drug works'],
      correct: 1,
      ms: `To see if the drug is safe to use. [1 mark]`
    },
    {
      q: `What is a placebo? [1 mark]`,
      type: 'written', marks: 1,
      ms: `A tablet/treatment that does not contain the drug/active ingredient. Allow: a sugar pill; a fake drug.`
    },
    {
      q: `Who knows which patients are given the placebo and which are given the drug in a double blind trial? Tick ONE box.\n\n[ ] Not the patients or the doctors\n[ ] The patients and the doctors\n[ ] The patients but not the doctors`,
      type: 'mc', marks: 1,
      options: ['Not the patients or the doctors', 'The patients and the doctors', 'The patients but not the doctors'],
      correct: 0,
      ms: `Not the patients or the doctors. [1 mark]`
    },
  ],

  // ── BIOLOGY — Osmosis & water movement ───────────────────────────────────────
  // Sources: Jun20 Q5, Jun24 B1 Q7

  tb_osmosis: [
    {
      q: `What is the independent variable in a potato osmosis investigation? Tick ONE box.\n\n[ ] Change in mass of the pieces of potato\n[ ] Concentration of the sugar solution\n[ ] Length of time the pieces of potato are in the solution\n[ ] Starting mass of the pieces of potato`,
      type: 'mc', marks: 1,
      options: ['Change in mass of the pieces of potato', 'Concentration of the sugar solution', 'Length of time the pieces of potato are in the solution', 'Starting mass of the pieces of potato'],
      correct: 1,
      ms: `Concentration of the sugar solution. [1 mark]`
    },
    {
      q: `A potato piece in 0.0 mol/dm³ sugar solution increased in mass. Explain why. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Gained water [1 mark] by osmosis [1 mark] because the concentration of water outside the potato is greater than inside the cells (allow: concentration of sugar solution inside the potato is greater than outside). Allow converse statements.`
    },
    {
      q: `A potato piece started at 7.96 g and ended at 8.21 g after being in 0.2 mol/dm³ sugar solution. Calculate the percentage change in mass to 3 significant figures.\n\nUse: percentage change = (change in mass ÷ mass at start) × 100 [3 marks]`,
      type: 'written', marks: 3,
      ms: `Change in mass = 8.21 − 7.96 = 0.25 g [1 mark]. Percentage change = (0.25 ÷ 7.96) × 100 [1 mark]. = 3.14% (to 3 significant figures) [1 mark]. Allow ecf from incorrect working.`
    },
    {
      fig: 'jun24_osmosis_tube',
      q: `In an osmosis investigation using sealed tubing in salt solutions, a student dried the outside of each tube before recording mass. Why was it important to dry the tubes? [1 mark]`,
      type: 'written', marks: 1,
      ms: `Water/solution on the tube would affect/increase the mass (making results invalid). Allow: the results would not be valid.`
    },
    {
      q: `In a sealed-tube osmosis experiment, the concentration of salt solution where the tube does not change mass is approximately 0.64–0.66 mol/dm³. What does this tell us? [1 mark]`,
      type: 'written', marks: 1,
      ms: `The concentration of solution Z (inside the tubes) is approximately 0.64–0.66 mol/dm³ — because at this concentration the solution inside equals the solution outside, so no net movement of water by osmosis.`
    },
    {
      q: `Calculate the percentage change in mass for a tube that started at 15.54 g and ended at 16.50 g after being in 0.0 mol/dm³ salt solution. Give your answer to 1 decimal place. [3 marks]\n\nUse: percentage change = (change in mass ÷ mass at start) × 100`,
      type: 'written', marks: 3,
      ms: `Change in mass = 16.50 − 15.54 = 0.96 g [1 mark]. Percentage change = (0.96 ÷ 15.54) × 100 [1 mark]. = 6.2% (to 1 decimal place) [1 mark]. Allow ecf from incorrect calculation.`
    },
  ],

  // ── BIOLOGY — Photosynthesis ───────────────────────────────────────────────────
  // Sources: Jun22 Q2, Jun24 B1 Q5

  tb_photo: [
    {
      q: `Complete the equation for photosynthesis. Choose from: nitrogen, oxygen, ethanol, water.\n\ncarbon dioxide + _______ → glucose + _______ [2 marks]`,
      type: 'written', marks: 2,
      ms: `First blank: water [1 mark]. Second blank: oxygen [1 mark]. Allow H₂O and O₂.`
    },
    {
      q: `What is the chemical formula for glucose? Tick ONE box.\n\n[ ] CO₂\n[ ] C₆H₁₂O₆\n[ ] H₂O\n[ ] O₂`,
      type: 'mc', marks: 1,
      options: ['CO₂', 'C₆H₁₂O₆', 'H₂O', 'O₂'],
      correct: 1,
      ms: `C₆H₁₂O₆. [1 mark]`
    },
    {
      q: `Give two ways plants use the glucose produced by photosynthesis. [2 marks]`,
      type: 'written', marks: 2,
      ms: `Any two from: respiration (for energy); to convert to starch (store); to produce fat/oil (store); to produce cellulose (cell walls); to produce amino acids/protein. Allow: energy source. Do NOT accept: energy produced/made/created; used for growth (too vague). Ignore: used for growth of the plant.`
    },
    {
      q: `Give ONE way that the palisade layer of a leaf is adapted for photosynthesis. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Any one from: contains many chloroplasts/chlorophyll to absorb light; cells are long and packed tightly to maximise light absorption; positioned near the top of the leaf to receive most light; large surface area for CO₂ absorption.`
    },
    {
      q: `A student investigated the effect of different colours of light on the rate of photosynthesis. Results: blue = 9 arbitrary units, green = 1, red = 8. What colour of light should be used to grow plants in a greenhouse? Tick ONE box.\n\n[ ] Blue  [ ] Green  [ ] Red`,
      type: 'mc', marks: 1,
      options: ['Blue', 'Green', 'Red'],
      correct: 0,
      ms: `Blue. [1 mark] — blue light gave the highest rate of photosynthesis (9 arbitrary units) so would produce the most growth.`
    },
    {
      fig: 'jun24_greenhouses',
      q: `Greenhouse B has a wood burner burning logs, while Greenhouse A does not. Both greenhouses have the same light intensity, water volume, and soil. Explain why plants in Greenhouse B grow faster. [4 marks]`,
      type: 'written', marks: 4,
      ms: `Higher/increased temperature [1 mark] OR more carbon dioxide (combustion/burning releases CO₂) [1 mark]. So more photosynthesis/faster photosynthesis [1 mark]. So more glucose/sugar made [1 mark]. So more protein/cellulose made [1 mark]. Award max 4 marks.`
    },
  ],

  // ── BIOLOGY — Cell division & growth ──────────────────────────────────────────
  // Sources: Jun22 Q6

  tb_cells_div: [
    {
      q: `Write these biological structures in correct order of size. Smallest to largest: cell, chromosome, gene, nucleus. [1 mark]`,
      type: 'written', marks: 1,
      ms: `gene → chromosome → nucleus → cell. Must be in this order for the mark.`
    },
    {
      q: `In humans a fertilised egg cell contains 23 pairs of chromosomes. How many chromosomes will there be in each of the embryo cells? [1 mark]`,
      type: 'written', marks: 1,
      ms: `46. Allow: 23 pairs (of chromosomes).`
    },
    {
      q: `How many cell divisions are needed to form a 16-cell embryo from the original fertilised egg cell? [1 mark]`,
      type: 'written', marks: 1,
      ms: `4 cell divisions. Allow 15 (if student has counted total cells including the original). The sequence is 1→2→4→8→16, which is 4 divisions.`
    },
    {
      q: `Give ONE way that cell division by mitosis is important in fully grown animals. [1 mark]`,
      type: 'written', marks: 1,
      ms: `Repair of tissues / replacement of cells. Allow: repair of organs; replacement of tissues. Ignore: growth; repair of cells; replacement of organs.`
    },
  ],

}


const MARK_TIPS = {
  1:  { label: '1-mark question', tip: 'One clear, accurate point. No development needed. Be specific — vague answers score zero.' },
  2:  { label: '2-mark question', tip: 'Two separate, accurate points. If asked to "explain", you need the point AND the reason. If asked to "give two", each point must be distinct.' },
  3:  { label: '3-mark question', tip: 'Show your working clearly. Each step can earn a mark. Even if you get the final answer wrong, correct working gets credit.' },
  4:  { label: '4-mark question', tip: 'Two developed points, each with supporting detail. OR four separate points if listing. For "explain" questions: point → reason → link back.' },
  6:  { label: '6-mark question', tip: 'Level of response: Level 2 (4–6 marks) needs scientifically accurate detail with clear logical linking. Level 1 (1–3 marks) is just listing facts. Name the process, explain how it works, link to the function.' },
  12: { label: '12-mark question', tip: 'Three or four developed paragraphs. Each needs a clear point, specific evidence, and explanation of how it answers the question.' },
  16: { label: '16-mark question', tip: 'Argue both sides then reach a clear judgement. Specific evidence required. Avoid vague generalisations.' },
}

// ─── Formula sheet modal ──────────────────────────────────────────────────────
function FormulaSheet({ onClose }) {
  const { FORMULA_SHEET } = useTestData() || {}
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(0,0,0,.8)', backdropFilter:'blur(8px)', display:'flex', alignItems:'flex-end', justifyContent:'center' }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'#0E1330', border:'1px solid rgba(59,130,255,.3)', borderRadius:'20px 20px 0 0', padding:'20px 18px 40px', width:'100%', maxWidth:660, maxHeight:'82vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <div>
            <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'1.1rem', color:'#F5F7FB' }}>📐 AQA Formula Sheet</div>
            <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', color:'#5A6480', marginTop:2 }}>These are given in the exam — but worth knowing them cold</div>
          </div>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.08)', border:'1px solid #2A3552', borderRadius:8, padding:'6px 14px', color:'#9CA8C7', cursor:'pointer', fontFamily:'inherit', fontSize:'.82rem' }}>✕</button>
        </div>
        {(FORMULA_SHEET || []).map(cat => (
          <div key={cat.section} style={{ marginBottom:18 }}>
            <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', color:'#3B82FF', marginBottom:10 }}>{cat.section}</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {cat.formulae.map(item => (
                <div key={item.name} style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
                  <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.82rem', color:'#9CA8C7' }}>{item.name}</div>
                  <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.95rem', color:'#F5F7FB', flexShrink:0 }}>{item.f}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Inline diagram renderer ──────────────────────────────────────────────────
function MathsDiagram({ diagramKey }) {
  const { DIAGRAMS } = useTestData() || {}
  const svg = DIAGRAMS?.[diagramKey]
  if (!svg) return null
  return (
    <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:12, padding:'14px', marginBottom:14 }}>
      <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#3B82FF', marginBottom:8 }}>📐 Diagram — from AQA past paper</div>
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  )
}

// ─── Grade colours ────────────────────────────────────────────────────────────
const GRADE_COLOURS = {
  'Excellent':  { bg:'rgba(77,255,136,.08)', border:'rgba(77,255,136,.35)', text:'#4DFF88', badge:'#38D27A' },
  'Good':       { bg:'rgba(77,255,136,.05)', border:'rgba(77,255,136,.2)',  text:'#6BFFB0', badge:'#38D27A' },
  'Developing': { bg:'rgba(255,200,87,.08)', border:'rgba(255,200,87,.3)',  text:'#FFC857', badge:'#F5B700' },
  'Needs Work': { bg:'rgba(255,93,115,.08)', border:'rgba(255,93,115,.3)',  text:'#FF5D73', badge:'#FF5D73' },
}

// ─── API grading call ─────────────────────────────────────────────────────────
async function gradeWithAI(question, answer, marks, markScheme) {
  const res = await fetch('/api/grade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question,
      answer: answer.trim(),
      marks,
      markScheme,
    }),
  })
  if (!res.ok) throw new Error(`Server error ${res.status}`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data
}

// ─── Strip bracketed MC options from question text ────────────────────────────
// MC questions store options in q.options[] but some also embed them as
// "[ ] Option text" lines in q.q — this removes those duplicate lines.
function cleanQuestionText(q) {
  if (!q.q) return q.q
  const isMC = q.type === 'mc' || q.type === 'mc_multi'
  return q.q
    .split('\n')
    .filter(line => {
      const t = line.trim()
      // Strip marks label — shown in badge already: [8 marks], [20 marks] etc
      if (/^\[\d+ marks?\]$/.test(t)) return false
      // Strip inline source attribution — shown in extract card instead
      if (/^\(Source:/i.test(t)) return false
      // Strip "You could include the writer's choice of:" — instruction noise
      if (/^You could include/i.test(t)) return false
      if (!isMC) return true
      // Strip embedded MC option lines: [ ] ... or [x] ...
      if (/^\[.{0,2}\]/.test(t)) return false
      // Strip lettered option lines: A. / B. / A) etc
      if (/^[A-D][.)]\s/.test(t)) return false
      // Strip MC instruction lines redundant with button UI
      if (/^tick one box/i.test(t)) return false
      if (/^circle the (answer|correct)/i.test(t)) return false
      return true
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}


// ─── Single question view ─────────────────────────────────────────────────────
function MathsQuestion({ q, qIdx, total, topicLabel, topicColor, isCalc, onBack, onNext }) {
  const [answer, setAnswer]   = useState('')
  const [showTip, setTip]     = useState(false)
  const [grading, setGrading] = useState(false)
  const [feedback, setFB]     = useState(null)
  const [error, setError]     = useState(null)
  const [fmOpen, setFm]       = useState(false)
  // MC hint+retry state
  const [mcAttempts, setMcAttempts] = useState(0)
  const [mcHint, setMcHint]         = useState(false)   // show hint after 1st wrong MC
  const [mcLocked, setMcLocked]     = useState(false)   // lock after 2nd attempt or correct

  function reset() {
    setAnswer(''); setTip(false); setFB(null); setError(null); setGrading(false)
    setMcAttempts(0); setMcHint(false); setMcLocked(false)
  }

  async function grade() {
    const isMC = q.type === 'mc' || q.type === 'mc_multi'
    if (q.type === 'mc' && !answer) { setError('Pick an option first.'); return }
    if (q.type === 'mc_multi' && (!answer || (Array.isArray(answer) && answer.length === 0))) { setError('Select at least one option.'); return }
    if (!isMC && answer.trim().length < 1) { setError('Write something — even a rough attempt gets method marks!'); return }

    // MC: check inline without hitting the API
    if (isMC) {
      const isCorrect = q.type === 'mc'
        ? answer === q.options[q.correct]
        : Array.isArray(answer) && answer.length === q.marks &&
          answer.every(a => q.options.indexOf(a) !== -1 && q.correctIndices?.includes(q.options.indexOf(a)))
      const newAttempts = mcAttempts + 1
      setMcAttempts(newAttempts)
      if (isCorrect) {
        setMcLocked(true)
        setFB({ marksAwarded: q.marks, marksAvailable: q.marks, grade: 'Excellent',
          summary: 'Correct.', achieved: ['Right answer selected'], missed: [], examinerTip: q.ms || '' })
        recordScore({ subject: topicLabel.split(' ·')[0].split(' —')[0].trim(), earned: q.marks, possible: q.marks, source: 'test' })
      } else if (newAttempts === 1) {
        // First wrong — show hint, don't lock yet
        setMcHint(true)
        setAnswer('')  // clear selection so they can try again
      } else {
        // Second wrong — lock and show full explanation
        setMcLocked(true)
        const correctText = q.options[q.correct] || ''
        setFB({ marksAwarded: 0, marksAvailable: q.marks, grade: 'Needs Work',
          summary: 'The correct answer was: ' + correctText,
          achieved: [], missed: [q.ms || 'See mark scheme above'],
          examinerTip: 'Re-read the question carefully and look for key scientific terms.' })
        recordScore({ subject: topicLabel.split(' ·')[0].split(' —')[0].trim(), earned: 0, possible: q.marks, source: 'test' })
      }
      return
    }

    setGrading(true); setError(null)
    try {
      const result = await gradeWithAI(q.q, answer, q.marks, q.ms)
      setFB(result)
      // Record score for streak + improvement tracking
      if (result && result.marksAwarded !== undefined) {
        recordScore({
          subject: topicLabel.split(' ·')[0].split(' —')[0].trim(),
          earned: result.marksAwarded,
          possible: result.marksAvailable || q.marks,
          source: 'test',
        })
      }
    } catch (e) {
      setError('Could not reach the grading server. Check your connection and try again.')
    } finally {
      setGrading(false)
    }
  }

  const gs = feedback ? (GRADE_COLOURS[feedback.grade] || GRADE_COLOURS['Developing']) : null
  // Detect if this is a maths question (has M1/A1/B1 mark scheme) vs English/History (level-based)
  const isMathsQ = q.ms ? /\[M1|\[A1|\[B1|\[B2|\[B3/.test(q.ms) : false
  // Tips adapt based on whether this is maths or English/humanities
  const MARK_TIPS = isMathsQ ? {
    1: 'One specific correct answer. No working needed for 1 mark.',
    2: 'Show your method AND give the correct answer — both earn marks.',
    3: 'Show every step. Each line of working can earn a mark even if the final answer is wrong.',
    4: 'Full method with all steps shown clearly. Check your arithmetic at the end.',
    5: 'Five marks = five things to demonstrate. Show all working from start to finish.',
    6: 'Full method with sub-steps. Show all stages — do not skip steps.',
  } : {
    1: 'One clear, accurate point that directly answers the question.',
    2: 'Two separate, distinct points. Each must be a new idea — not the same point rephrased.',
    3: 'Three points OR one point with a well-developed explanation. Quote from the text.',
    4: 'Four separate points, OR two points each with a clear explanation and evidence.',
    6: 'Level of response: link your points together with evidence. Do not just list facts.',
    8: 'Use quotes, name techniques, explain effects. Aim for Level 3: "clear and relevant".',
    12: 'Analyse language choices in depth. Quote precisely, name the technique, explain the effect on the reader.',
    16: "Compare BOTH texts throughout. Link quotes to writer's methods and intentions.",
    20: 'Give your view first, then prove it. Engage critically with the statement — agree, disagree, or both.',
    40: 'Plan before you write. Strong opening, clear structure, ambitious vocabulary, accurate punctuation throughout.',
  }

  return (
    <div style={{ background:'#08090D', minHeight:'100vh', paddingBottom:90 }}>
      {fmOpen && <FormulaSheet onClose={() => setFm(false)} />}

      {/* Sticky header */}
      <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', backdropFilter:'blur(14px)', padding:'12px 16px' }}>
        <div style={{ maxWidth:660, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <BackButton onClick={() => { reset(); onBack() }} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:topicColor, flexShrink:0, boxShadow:`0 0 6px ${topicColor}` }} />
                <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:topicColor }}>{topicLabel}</span>
              </div>
              <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.9rem', color:'#F5F7FB' }}>
                Q{q.qNum} · {q.source}
              </div>
            </div>
            {isMathsQ && (<div style={{ display:'flex', gap:6, flexShrink:0 }}>{isCalc
                      ? <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(56,210,122,.1)', border:'1px solid rgba(56,210,122,.25)', borderRadius:8, padding:'4px 10px', fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, color:'#38D27A' }}>🖩 Calculator OK</div>
                      : <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,200,87,.07)', border:'1px solid rgba(255,200,87,.18)', borderRadius:8, padding:'4px 10px', fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, color:'#FFC857' }}>✏️ No Calculator</div>
              }
              <button onClick={() => setFm(true)} style={{ background:'rgba(59,130,255,.1)', border:'1px solid rgba(59,130,255,.22)', borderRadius:8, padding:'4px 10px', fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, color:'#70B8FF', cursor:'pointer' }}>📐 Formulae</button>
            </div>)}
          </div>
          {/* Progress */}
          <div style={{ height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${((qIdx+1)/total)*100}%`, background:`linear-gradient(90deg,${topicColor}88,${topicColor})`, borderRadius:99, transition:'width .4s ease' }} />
          </div>
          <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.62rem', color:'#4A5578', marginTop:5, textAlign:'right' }}>{qIdx+1} / {total}</div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px 20px' }}>
        {/* Marks badge */}
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:`${topicColor}18`, border:`1px solid ${topicColor}44`, borderRadius:99, padding:'4px 13px', marginBottom:14 }}>
          <span style={{ fontFamily:"'Sora', sans-serif", fontSize:'.78rem', fontWeight:700, color:topicColor }}>[{q.marks} mark{q.marks!==1?'s':''}]</span>
        </div>

        {/* Diagram */}
        {q.diagramKey && <MathsDiagram diagramKey={q.diagramKey} />}


        {/* Source extract or reference */}
        {q.extract && (() => {
          const isRealExtract = q.extract.startsWith('Lines') || q.extract.startsWith('"')
          return (
            <div style={{ background:'#0D1424', borderLeft:`3px solid ${topicColor}`, borderRadius:'0 12px 12px 0', padding:'14px 16px', marginBottom:14 }}>
              <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:topicColor, marginBottom:8 }}>
                {isRealExtract ? '📄 Source extract' : '📎 Where to find your source'}
              </div>
              <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.88rem', lineHeight:1.7, margin:0, color: isRealExtract ? '#C8D0E8' : '#9CA8C7', whiteSpace:'pre-wrap', maxHeight:240, overflowY:'auto', WebkitOverflowScrolling:'touch', paddingRight:4 }}>{q.extract}</p>
            </div>
          )
        })()}

        {/* Question */}
        <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:16, padding:'18px 18px', marginBottom:14 }}>
          <pre style={{ fontFamily:"'Outfit', sans-serif", fontSize:'1rem', lineHeight:1.7, margin:0, color:'#E0E6F0', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{cleanQuestionText(q)}</pre>
        </div>

        {/* Mark tip */}
        {!showTip
          ? <button onClick={() => setTip(true)} style={{ background:'transparent', border:'1px dashed #2A3552', borderRadius:10, padding:'9px 14px', cursor:'pointer', color:'#4A5578', fontSize:'.82rem', fontFamily:"'Outfit', sans-serif", width:'100%', marginBottom:14 }}>💡 {isMathsQ ? 'How many steps do I need to show?' : 'What does this question need from me?'}</button>
          : <div style={{ background:'rgba(255,200,87,.05)', border:'1px solid rgba(255,200,87,.18)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}>
              <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#FFC857', marginBottom:5 }}>{isMathsQ ? `${q.marks}-mark question` : `${q.marks} marks — what to write`}</div>
              <p style={{ fontFamily:"'Outfit', sans-serif", margin:0, fontSize:'.86rem', color:'#C8D0E8', lineHeight:1.55 }}>{MARK_TIPS[q.marks] || MARK_TIPS[3]}</p>
            </div>
        }

        {/* Answer area — only shown before feedback */}
        {!feedback && (
          q.type === 'mc' || q.type === 'mc_multi'
            ? <div style={{ marginBottom:16 }}>
                {q.type === 'mc_multi' && <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', color:'#5A6480', marginBottom:8 }}>Select all that apply ({q.marks} correct answers)</div>}
                {/* Hint card after first wrong MC attempt */}
                {mcHint && !mcLocked && (
                  <div style={{ background:'rgba(255,200,87,.06)', border:'1px solid rgba(255,200,87,.25)', borderRadius:12, padding:'12px 14px', marginBottom:12 }}>
                    <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'#FFC857', marginBottom:6 }}>💡 Hint — think about this</div>
                    <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.87rem', color:'#C8D0E8', margin:0, lineHeight:1.55 }}>
                      {q.hint || (q.ms ? q.ms.split('.')[0] + '.' : 'Look at the question again carefully — what does it specifically ask for?')}
                    </p>
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {q.options.map((opt, i) => {
                  const isMulti = q.type === 'mc_multi'
                  const sel = isMulti ? (Array.isArray(answer) && answer.includes(opt)) : answer === opt
                  const toggle = () => {
                    if (mcLocked) return
                    if (!isMulti) { setAnswer(opt); return }
                    const cur = Array.isArray(answer) ? answer : []
                    setAnswer(sel ? cur.filter(a => a !== opt) : [...cur, opt])
                  }
                  return (
                    <button key={i} onClick={toggle} disabled={mcLocked} style={{ background:sel?`${topicColor}18`:'#151720', border:`1.5px solid ${sel?topicColor:'rgba(255,255,255,0.08)'}`, borderRadius:12, padding:'14px 16px', cursor:mcLocked?'default':'pointer', textAlign:'left', fontFamily:"'Outfit', sans-serif", fontSize:'.93rem', color:sel?topicColor:'#C8D0E8', transition:'all .15s', display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ width:24, height:24, borderRadius:isMulti?'4px':'50%', border:`1.5px solid ${sel?topicColor:'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.75rem', fontWeight:700, color:sel?topicColor:'#4A5578', background:sel?`${topicColor}18`:'transparent' }}>{isMulti ? (sel ? '✓' : '') : String.fromCharCode(65+i)}</span>
                      {opt}
                    </button>
                  )
                })}
                </div>
              </div>
            : <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:14, padding:'14px', marginBottom:16 }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4A5578', marginBottom:8 }}>{isMathsQ ? 'Your working & answer' : 'Your answer'}</div>
                <textarea
                  value={answer}
                  onChange={e => setAnswer(e.target.value)}
                  placeholder={isMathsQ ? (q.marks >= 3 ? 'Show all your working here…' : 'Write your answer…') : 'Write your answer here. Use quotes from the extract where relevant…'}
                  style={{ width:'100%', border:'none', background:'transparent', resize:'none', fontFamily:"'Outfit', sans-serif", fontSize:'.95rem', color:'#E0E6F0', lineHeight:1.7, outline:'none', minHeight: q.marks >= 4 ? 170 : q.marks >= 2 ? 110 : 65 }}
                />
              </div>
        )}

        {/* Error */}
        {error && <div style={{ background:'rgba(255,93,115,.08)', border:'1px solid rgba(255,93,115,.3)', borderRadius:10, padding:'12px 14px', marginBottom:14 }}><p style={{ fontFamily:"'Outfit', sans-serif", margin:0, fontSize:'.86rem', color:'#FF5D73', lineHeight:1.5 }}>{error}</p></div>}

        {/* Feedback */}
        {feedback && gs && (
          <div className="fade-up">
            {/* Score card */}
            <div style={{ background:gs.bg, border:`2px solid ${gs.border}`, borderRadius:18, padding:'20px', marginBottom:12 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ fontFamily:"'Sora', sans-serif", fontSize:'2rem', fontWeight:800, color:gs.text, lineHeight:1 }}>
                  {feedback.marksAwarded}<span style={{ fontSize:'1.1rem', opacity:.5 }}>/{feedback.marksAvailable}</span>
                </div>
                <div style={{ background:gs.badge, color:'#000', borderRadius:99, padding:'5px 14px', fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.8rem' }}>{feedback.grade}</div>
              </div>
              <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.9rem', color:gs.text, margin:0, lineHeight:1.55, opacity:.9 }}>{feedback.summary}</p>
            </div>

            {/* What they got right */}
            {feedback.achieved?.length > 0 && (
              <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:13, padding:'14px', marginBottom:8 }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#4DFF88', marginBottom:10 }}>✓ What you got right</div>
                {feedback.achieved.map((a,i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom: i<feedback.achieved.length-1?8:0 }}>
                    <span style={{ color:'#4DFF88', flexShrink:0, fontSize:'.9rem' }}>✓</span>
                    <p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{a}</p>
                  </div>
                ))}
              </div>
            )}

            {/* What they missed */}
            {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && (
              <div style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:13, padding:'14px', marginBottom:8 }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#FF5D73', marginBottom:10 }}>→ Next time, also include</div>
                {feedback.missed.map((m,i) => (
                  <div key={i} style={{ display:'flex', gap:8, marginBottom: i<feedback.missed.length-1?8:0 }}>
                    <span style={{ color:'#FF5D73', flexShrink:0, fontSize:'.9rem' }}>→</span>
                    <p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{m}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Examiner tip */}
            {feedback.examinerTip && (
              <div style={{ background:'rgba(245,183,0,.05)', border:'1px solid rgba(245,183,0,.18)', borderRadius:13, padding:'14px', marginBottom:16 }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:'#F5B700', marginBottom:6 }}>🗡️ Examiner tip</div>
                <p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.88rem', color:'#C8D0E8', lineHeight:1.55 }}>{feedback.examinerTip}</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <button onClick={reset} style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:13, padding:'14px', fontFamily:"'Sora', sans-serif", fontWeight:700, cursor:'pointer', color:'#9CA8C7', fontSize:'.88rem' }}>↩ Try again</button>
              <ContinueCTA onClick={onNext} label={qIdx < total-1 ? 'Next \u2192' : 'Finish \u2713'} accent={topicColor} />
            </div>
          </div>
        )}

        {/* Submit button — hidden for locked MC (feedback already shown inline) */}
        {!feedback && !(mcLocked) && (
          <button onClick={grade} disabled={grading || (q.type === 'mc' && !answer) || (q.type === 'mc_multi' && (!answer || answer.length === 0))}
            style={{ width:'100%', background:grading?'rgba(255,255,255,0.08)':`linear-gradient(135deg,${topicColor}cc,${topicColor})`, color:grading?'#4A5578':'#fff', border:'none', borderRadius:13, padding:'16px', fontFamily:"'Sora', sans-serif", fontWeight:700, cursor:(grading||(q.type==='mc'&&!answer))?'default':'pointer', fontSize:'1rem', letterSpacing:'.01em', marginTop:4, boxShadow:grading?'none':`0 4px 20px ${topicColor}44`, transition:'all .2s',
              opacity: (q.type === 'mc' && !answer) ? 0.4 : 1 }}>
            {grading ? '⏳ Marking your answer…' : mcHint ? 'Check again →' : 'Check my answer →'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Topic question list ──────────────────────────────────────────────────────
function MathsTopicView({ group, onBack }) {
  const [qIdx, setQIdx] = useState(0)
  const qs = group.questions
  // Go straight into the question — no intermediate list screen
  return (
    <MathsQuestion
      key={qIdx}
      q={qs[qIdx]} qIdx={qIdx} total={qs.length}
      topicLabel={group.label} topicColor={group.color} isCalc={group.calculator}
      onBack={onBack}
      onNext={() => { const n=qIdx+1; if(n<qs.length){setQIdx(n);window.scrollTo({top:0,behavior:'smooth'})}else onBack() }}
    />
  )
}

function mathsTopicImg(id) {
  const n = id || ''
  if (['number','negatives','fractions','percentages','decimals','indices','surds','primes','bidmas','powers'].some(k => n.includes(k))) return '/headers/maths-numbers.webp'
  if (['algebra','equations','inequalities','sequences','quadratic','expression','formula'].some(k => n.includes(k))) return '/headers/maths-algebra.webp'
  if (['graph','gradient','coordinate','straight','linear_graph'].some(k => n.includes(k))) return '/headers/maths-algebra.webp'
  if (['angles','area','volume','similarity','transforms','pythagoras','trig','geometry','polygon','shape','circle','perimeter'].some(k => n.includes(k))) return '/headers/maths-geometry.webp'
  if (['statistics','probability','data','averages','mean','sampling','charts'].some(k => n.includes(k))) return '/headers/maths-data.webp'
  if (['ratio','proportion','speed','density','money','finance','units'].some(k => n.includes(k))) return '/headers/maths-realworld.webp'
  return '/headers/maths-main.webp'
}

function MathsBrowser({ onBack }) {
  const { MATHS_TOPIC_GROUPS } = useTestData() || {}
  const [activeGroup, setGroup] = useState(null)
  const [fmOpen, setFm]         = useState(false)
  const [filter, setFilter]     = useState('all')   // 'all' | 'calc' | 'noncalc'

  if (activeGroup) return <MathsTopicView group={activeGroup} onBack={() => setGroup(null)} />

  const totalQs = MATHS_TOPIC_GROUPS.reduce((s,g) => s + g.questions.length, 0)
  const filtered = filter === 'all' ? MATHS_TOPIC_GROUPS
    : filter === 'calc' ? MATHS_TOPIC_GROUPS.filter(g => g.calculator)
    : MATHS_TOPIC_GROUPS.filter(g => !g.calculator)

  return (
    <div style={{ background:'#08090D', minHeight:'100vh', paddingBottom:90 }}>
      {fmOpen && <FormulaSheet onClose={() => setFm(false)} />}

      {/* Header */}
      <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', backdropFilter:'blur(14px)', padding:'14px 16px' }}>
        <div style={{ maxWidth:660, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
          <BackButton onClick={onBack} />
          <img src="/headers/maths-main.webp" alt="Maths" style={{ width:32, height:32, borderRadius:8, objectFit:'cover', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'1rem', color:'#F5F7FB' }}>AQA Maths — Topics</div>
            <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.72rem', color:'#5A6480' }}>{MATHS_TOPIC_GROUPS.length} topics · {totalQs} questions · AI marked</div>
          </div>
          <button onClick={() => setFm(true)} style={{ background:'rgba(59,130,255,.1)', border:'1px solid rgba(59,130,255,.22)', borderRadius:10, padding:'7px 12px', fontFamily:"'Outfit', sans-serif", fontSize:'.73rem', fontWeight:700, color:'#70B8FF', cursor:'pointer', flexShrink:0 }}>📐 Formulae</button>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
        {/* Filter pills */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {[
            { id:'all',      label:`All (${totalQs})` },
            { id:'noncalc',  label:'✏️ No Calculator' },
            { id:'calc',     label:'🖩 Calculator allowed' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex:1, background:filter===f.id?'rgba(59,130,255,.15)':'#151720', border:`1px solid ${filter===f.id?'#3B82FF':'rgba(255,255,255,0.08)'}`, borderRadius:10, padding:'9px 6px', fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', fontWeight:600, color:filter===f.id?'#70B8FF':'#5A6480', cursor:'pointer', transition:'all .15s' }}>{f.label}</button>
          ))}
        </div>

        {/* Topic grid */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background:'#151720', border:`1px solid #1E2A40`, borderRadius:16, padding:'16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:14, transition:'border-color .15s, transform .12s', width:'100%' }}>
              <div style={{ width:46, height:46, borderRadius:13, flexShrink:0, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
                <img src={mathsTopicImg(group.id)} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>

              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.95rem', color:'#F5F7FB', marginBottom:3 }}>{group.label}</div>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', color:'#5A6480', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{group.description}</div>
                <div style={{ display:'flex', gap:8, marginTop:7, alignItems:'center' }}>
                  {/* Mini progress-style pill */}
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:'0%', background:group.color, borderRadius:99 }} />
                  </div>
                  <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.68rem', fontWeight:600, color:group.color, flexShrink:0 }}>{group.questions.length} Q{group.questions.length!==1?'s':''}</span>
                  {group.calculator
                    ? <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', color:'#38D27A', flexShrink:0 }}>🖩</span>
                    : <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', color:'#FFC857', flexShrink:0 }}>✗</span>
                  }
                </div>
              </div>

              <span style={{ color:'rgba(255,255,255,0.1)', fontSize:'1.1rem', flexShrink:0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── English topic view ───────────────────────────────────────────────────────
function EnglishTopicView({ group, onBack }) {
  const [qIdx, setQIdx] = useState(0)
  const qs = group.questions
  // Go straight into the question — no list, no picker
  return (
    <MathsQuestion
      key={qIdx}
      q={qs[qIdx]}
      qIdx={qIdx} total={qs.length}
      topicLabel={group.label} topicColor={group.color} isCalc={false}
      onBack={onBack}
      onNext={() => { const n=qIdx+1; if(n<qs.length){setQIdx(n);window.scrollTo({top:0,behavior:'smooth'})}else onBack() }}
    />
  )
}

// ─── English browser ──────────────────────────────────────────────────────────
function EnglishBrowser({ onBack }) {
  const { ENGLISH_TOPIC_GROUPS } = useTestData() || {}
  const [activeGroup, setGroup] = useState(null)
  const [filter, setFilter]     = useState('all')

  if (activeGroup) return <EnglishTopicView group={activeGroup} onBack={() => setGroup(null)} />

  const totalQs = ENGLISH_TOPIC_GROUPS.reduce((s,g) => s + g.questions.length, 0)
  const filters = [
    { id:'all',    label:`All (${totalQs})` },
    { id:'p1',     label:'Paper 1' },
    { id:'p2',     label:'Paper 2' },
    { id:'skills', label:'Skills' },
  ]

  const filtered = filter === 'all'    ? ENGLISH_TOPIC_GROUPS
    : filter === 'p1'     ? ENGLISH_TOPIC_GROUPS.filter(g => g.paper.includes('1') || g.paper.includes('Both'))
    : filter === 'p2'     ? ENGLISH_TOPIC_GROUPS.filter(g => g.paper.includes('2') || g.paper.includes('Both'))
    : ENGLISH_TOPIC_GROUPS.filter(g => g.paper === 'Skills practice')

  return (
    <div style={{ background:'#08090D', minHeight:'100vh', paddingBottom:90 }}>
      <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(8,12,26,.97)', borderBottom:'1px solid #1E2A40', backdropFilter:'blur(14px)', padding:'14px 16px' }}>
        <div style={{ maxWidth:660, margin:'0 auto', display:'flex', alignItems:'center', gap:12 }}>
          <BackButton onClick={onBack} />
          <img src="/headers/english-main.webp" alt="English" style={{ width:32, height:32, borderRadius:8, objectFit:'cover', flexShrink:0 }} />
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'1rem', color:'#F5F7FB' }}>AQA English Language</div>
            <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.72rem', color:'#5A6480' }}>Papers 1 & 2 · {ENGLISH_TOPIC_GROUPS.length} skill areas · {totalQs} questions · AI marked</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
        {/* Filter pills */}
        <div style={{ display:'flex', gap:8, marginBottom:20 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex:1, background:filter===f.id?'rgba(157,92,255,.15)':'#151720', border:`1px solid ${filter===f.id?'#9D5CFF':'rgba(255,255,255,0.08)'}`, borderRadius:10, padding:'9px 6px', fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', fontWeight:600, color:filter===f.id?'#C18CFF':'#5A6480', cursor:'pointer', transition:'all .15s' }}>{f.label}</button>
          ))}
        </div>

        {/* Topic cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background:'#151720', border:'1px solid #1E2A40', borderRadius:16, padding:'16px', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:14, width:'100%' }}>
              <div style={{ width:46, height:46, borderRadius:13, flexShrink:0, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)' }}>
                <img src="/headers/english-main.webp" alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.93rem', color:'#F5F7FB', marginBottom:3 }}>{group.label}</div>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.75rem', color:'#5A6480', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{group.description}</div>
                <div style={{ display:'flex', gap:8, marginTop:7, alignItems:'center' }}>
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,0.08)', borderRadius:99 }} />
                  <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.68rem', fontWeight:600, color:group.color, flexShrink:0 }}>{group.questions.length} Q{group.questions.length!==1?'s':''}</span>
                  <span style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', color:'#4A5578', flexShrink:0 }}>{group.marks}m</span>
                </div>
              </div>
              <span style={{ color:'rgba(255,255,255,0.1)', fontSize:'1.1rem', flexShrink:0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Sociology topic view ─────────────────────────────────────────────────────
function SociologyTopicView({ group, onBack }) {
  const [qIdx, setQIdx] = useState(0)
  const qs = group.questions
  return (
    <MathsQuestion
      key={qIdx}
      q={qs[qIdx]}
      qIdx={qIdx} total={qs.length}
      topicLabel={group.label} topicColor={group.color} isCalc={false}
      onBack={onBack}
      onNext={() => { const n=qIdx+1; if(n<qs.length){setQIdx(n);window.scrollTo({top:0,behavior:'smooth'})}else onBack() }}
    />
  )
}

// ─── Sociology browser ────────────────────────────────────────────────────────
function SociologyBrowser({ onBack, filterPrefix = null }) {
  const { SOCIOLOGY_TOPIC_GROUPS } = useTestData() || {}
  const [activeGroup, setGroup] = useState(null)
  const [filter, setFilter]     = useState('all')

  if (activeGroup) return <SociologyTopicView group={activeGroup} onBack={() => setGroup(null)} />

  const baseGroups = filterPrefix
    ? SOCIOLOGY_TOPIC_GROUPS.filter(g => g.id.startsWith(filterPrefix))
    : SOCIOLOGY_TOPIC_GROUPS

  const totalQs = baseGroups.reduce((s, g) => s + g.questions.length, 0)
  const filters = [
    { id: 'all', label: `All (${totalQs})` },
    { id: 'p1',  label: 'Paper 1' },
    { id: 'p2',  label: 'Paper 2' },
  ]
  const filtered = filter === 'all' ? baseGroups
    : filter === 'p1' ? baseGroups.filter(g => g.paper === 'Paper 1')
    : baseGroups.filter(g => g.paper === 'Paper 2')

  const socGroup = filterPrefix ? SOCIOLOGY_GROUPS.find(g => g.filterPrefix === filterPrefix) : null
  const headerTitle = socGroup ? socGroup.title : 'AQA Sociology'

  return (
    <div style={{ background: '#08090D', minHeight: '100vh', paddingBottom: 90 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(8,12,26,.97)', borderBottom: '1px solid #1E2A40', backdropFilter: 'blur(14px)', padding: '14px 16px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton onClick={onBack} />
          <img src={socGroup?.headerImage || '/headers/sociology-main.webp'} alt="Sociology" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#F5F7FB' }}>{headerTitle}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.72rem', color: '#5A6480' }}>
              {baseGroups.length} topic area{baseGroups.length !== 1 ? 's' : ''} · {totalQs} questions · AI marked
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 16px' }}>
        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              flex: 1, background: filter === f.id ? 'rgba(255,92,122,.15)' : '#151720',
              border: `1px solid ${filter === f.id ? '#FF5C7A' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 10, padding: '9px 6px',
              fontFamily: "'Outfit', sans-serif", fontSize: '.75rem', fontWeight: 600,
              color: filter === f.id ? '#FF8DA1' : '#5A6480', cursor: 'pointer',
            }}>{f.label}</button>
          ))}
        </div>

        {/* Topic cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{
              background: '#151720', border: '1px solid #1E2A40',
              borderRadius: 16, padding: '16px', cursor: 'pointer',
              textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, width: '100%',
            }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <img src={(() => {
                  const id = group.id
                  if (id.startsWith('soc_families'))     return '/headers/sociology-family.webp'
                  if (id.startsWith('soc_education'))    return '/headers/sociology-education.webp'
                  if (id.startsWith('soc_crime'))        return '/headers/sociology-crime.webp'
                  if (id.startsWith('soc_stratification')) return '/headers/sociology-stratification.webp'
                  return '/headers/sociology-main.webp'
                })()} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.93rem', color: '#F5F7FB', marginBottom: 3 }}>{group.label}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.75rem', color: '#5A6480', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 7, alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }} />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.68rem', fontWeight: 600, color: group.color, flexShrink: 0 }}>{group.questions.length} Q{group.questions.length !== 1 ? 's' : ''}</span>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.65rem', color: '#4A5578', flexShrink: 0 }}>{group.marks}m</span>
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.1rem', flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}





// ─── Chemistry image renderer ─────────────────────────────────────────────────
function ChemImage({ imageKey, caption }) {
  const src = CHEM_IMAGES[imageKey]
  if (!src) return null
  return (
    <div style={{ background: '#0D1424', border: '1px solid #1E2A40', borderRadius: 12, padding: '10px', marginBottom: 14 }}>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#38D27A', marginBottom: 8 }}>
        📐 Diagram — from AQA past paper
      </div>
      <img src={src} alt={caption || 'AQA Chemistry diagram'} style={{ maxWidth: '100%', height: 'auto', display: 'block', borderRadius: 8 }} />
    </div>
  )
}

// ─── Chemistry topic view ─────────────────────────────────────────────────────
function ChemistryTopicView({ group, onBack, qIdx: initialQIdx = 0, onQChange }) {
  const [qIdx, setQIdx] = useState(initialQIdx)
  const qs = group.questions

  // Wrap MathsQuestion but inject image rendering
  // We pass imageKey via q.imageKey — MathsQuestion already handles extract/diagram rendering
  // but Chemistry needs the CHEM_IMAGES lookup, so we use a thin wrapper
  const q = qs[qIdx]
  const [answer, setAnswer]   = useState('')
  const [showTip, setTip]     = useState(false)
  const [grading, setGrading] = useState(false)
  const [feedback, setFB]     = useState(null)
  const [error, setError]     = useState(null)

  function reset() { setAnswer(''); setTip(false); setFB(null); setError(null); setGrading(false) }
  function next()  { const n=qIdx+1; if(n<qs.length){ setQIdx(n); if(onQChange) onQChange(n); reset(); window.scrollTo({top:0,behavior:'smooth'}) } else { reset(); onBack() } }

  async function grade() {
    if (q.type === 'mc' && !answer) { setError('Select an option first.'); return }
    if (q.type !== 'mc' && !answer.trim()) { setError('Write something — even a rough attempt earns method marks.'); return }
    setGrading(true); setError(null)
    try {
      const result = await gradeWithAI(q.q, answer, q.marks, q.ms)
      setFB(result)
      if (result?.marksAwarded !== undefined) {
        recordScore({ subject: 'Chemistry', earned: result.marksAwarded, possible: result.marksAvailable || q.marks, source: 'test' })
      }
    } catch { setError('Could not reach the grading server. Check your connection.') }
    finally { setGrading(false) }
  }

  const gs = feedback ? (GRADE_COLOURS[feedback.grade] || GRADE_COLOURS['Developing']) : null
  const color = group.color
  const CHEM_TIPS = {
    1: 'One specific correct answer. No working needed.',
    2: 'Two points OR method + correct answer. Show any calculation.',
    3: 'Three separate marks — show each step or point clearly.',
    4: 'Show all working. Each correct step earns a mark even if final answer is wrong.',
  }

  return (
    <div style={{ background: '#08090D', minHeight: '100vh', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(8,12,26,.97)', borderBottom: '1px solid #1E2A40', backdropFilter: 'blur(14px)', padding: '12px 16px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <BackButton onClick={onBack} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.68rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color }}>Chemistry · {group.label}</span>
              </div>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.88rem', color: '#F5F7FB' }}>
                {q.source} · {q.marks} mark{q.marks !== 1 ? 's' : ''}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {group.calculator
                ? <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(56,210,122,.1)', border:'1px solid rgba(56,210,122,.25)', borderRadius:8, padding:'4px 10px', fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, color:'#38D27A' }}><span style={{fontSize:'.8rem'}}>🖩</span>Calculator OK</div>
                : <div style={{ display:'flex', alignItems:'center', gap:4, background:'rgba(255,200,87,.07)', border:'1px solid rgba(255,200,87,.18)', borderRadius:8, padding:'4px 10px', fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, color:'#FFC857' }}><span style={{fontSize:'.8rem'}}>✏️</span>No Calculator</div>
              }
            </div>
          </div>
          <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((qIdx+1)/qs.length)*100}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, borderRadius: 99, transition: 'width .4s' }} />
          </div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.62rem', color: '#4A5578', marginTop: 5, textAlign: 'right' }}>{qIdx+1} / {qs.length}</div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 16px 20px' }}>
        {/* Marks badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', background: `${color}18`, border: `1px solid ${color}44`, borderRadius: 99, padding: '4px 13px', marginBottom: 14 }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: '.78rem', fontWeight: 700, color }}>[{q.marks} mark{q.marks !== 1 ? 's' : ''}]</span>
        </div>

        {/* Chemistry diagram image */}
        {q.imageKey && <ChemImage imageKey={q.imageKey} />}

        {/* Question */}
        <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 16, padding: '18px', marginBottom: 14 }}>
          <pre style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1rem', lineHeight: 1.7, margin: 0, color: '#E0E6F0', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{q.q}</pre>
        </div>

        {/* Skill tip */}
        {!showTip
          ? <button onClick={() => setTip(true)} style={{ background: 'transparent', border: '1px dashed #2A3552', borderRadius: 10, padding: '9px 14px', cursor: 'pointer', color: '#4A5578', fontSize: '.82rem', fontFamily: "'Outfit', sans-serif", width: '100%', marginBottom: 14 }}>💡 How many marks do I need to earn?</button>
          : <div style={{ background: 'rgba(255,200,87,.05)', border: '1px solid rgba(255,200,87,.18)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#FFC857', marginBottom: 5 }}>{q.marks}-mark question</div>
              <p style={{ fontFamily: "'Outfit', sans-serif", margin: 0, fontSize: '.86rem', color: '#C8D0E8', lineHeight: 1.55 }}>{CHEM_TIPS[q.marks] || CHEM_TIPS[4]}</p>
            </div>
        }

        {/* Answer — MC or written */}
        {!feedback && (
          (q.type === 'mc' || q.type === 'mc_multi')
            ? <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => setAnswer(opt)} style={{ background: answer === opt ? `${color}18` : '#151720', border: `1.5px solid ${answer === opt ? color : 'rgba(255,255,255,0.08)'}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', textAlign: 'left', fontFamily: "'Outfit', sans-serif", fontSize: '.93rem', color: answer === opt ? color : '#C8D0E8', transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', border: `1.5px solid ${answer === opt ? color : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '.72rem', fontWeight: 700, color: answer === opt ? color : '#4A5578', background: answer === opt ? `${color}18` : 'transparent' }}>{String.fromCharCode(65+i)}</span>
                    {opt}
                  </button>
                ))}
              </div>
            : <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 14, padding: '14px', marginBottom: 16 }}>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#4A5578', marginBottom: 8 }}>Your answer</div>
                <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Write your answer here. Show any working…" style={{ width: '100%', border: 'none', background: 'transparent', resize: 'none', fontFamily: "'Outfit', sans-serif", fontSize: '.95rem', color: '#E0E6F0', lineHeight: 1.7, outline: 'none', minHeight: q.marks >= 4 ? 160 : q.marks >= 2 ? 100 : 65 }} />
              </div>
        )}

        {/* Error */}
        {error && <div style={{ background: 'rgba(255,93,115,.08)', border: '1px solid rgba(255,93,115,.3)', borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}><p style={{ fontFamily: "'Outfit', sans-serif", margin: 0, fontSize: '.86rem', color: '#FF5D73' }}>{error}</p></div>}

        {/* Feedback */}
        {feedback && gs && (
          <div className="fade-up">
            <div style={{ background: gs.bg, border: `2px solid ${gs.border}`, borderRadius: 18, padding: '20px', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', fontWeight: 800, color: gs.text, lineHeight: 1 }}>{feedback.marksAwarded}<span style={{ fontSize: '1.1rem', opacity: .5 }}>/{feedback.marksAvailable}</span></div>
                <div style={{ background: gs.badge, color: '#000', borderRadius: 99, padding: '5px 14px', fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.8rem' }}>{feedback.grade}</div>
              </div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.9rem', color: gs.text, margin: 0, lineHeight: 1.55, opacity: .9 }}>{feedback.summary}</p>
            </div>
            {feedback.achieved?.length > 0 && <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 13, padding: '14px', marginBottom: 8 }}><div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#4DFF88', marginBottom: 10 }}>✓ What you got right</div>{feedback.achieved.map((a,i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: '#4DFF88', flexShrink: 0 }}>✓</span><p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '.88rem', color: '#C8D0E8', lineHeight: 1.55 }}>{a}</p></div>)}</div>}
            {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && <div style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 13, padding: '14px', marginBottom: 8 }}><div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#FF5D73', marginBottom: 10 }}>→ Next time, also include</div>{feedback.missed.map((m,i) => <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}><span style={{ color: '#FF5D73', flexShrink: 0 }}>→</span><p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '.88rem', color: '#C8D0E8', lineHeight: 1.55 }}>{m}</p></div>)}</div>}
            {feedback.examinerTip && <div style={{ background: 'rgba(245,183,0,.05)', border: '1px solid rgba(245,183,0,.18)', borderRadius: 13, padding: '14px', marginBottom: 16 }}><div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.63rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', color: '#F5B700', marginBottom: 6 }}>🗡️ Examiner tip</div><p style={{ margin: 0, fontFamily: "'Outfit', sans-serif", fontSize: '.88rem', color: '#C8D0E8', lineHeight: 1.55 }}>{feedback.examinerTip}</p></div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <button onClick={reset} style={{ background: '#151720', border: '1px solid #2A3552', borderRadius: 13, padding: '14px', fontFamily: "'Sora', sans-serif", fontWeight: 700, cursor: 'pointer', color: '#9CA8C7', fontSize: '.88rem' }}>↩ Try again</button>
              <ContinueCTA onClick={next} label={qIdx < qs.length-1 ? 'Next →' : 'Finish ✓'} accent={color} />
            </div>
          </div>
        )}

        {/* Submit */}
        {!feedback && (
          <button onClick={grade} disabled={grading} style={{ width: '100%', background: grading ? 'rgba(255,255,255,0.08)' : `linear-gradient(135deg, ${color}cc, ${color})`, color: grading ? '#4A5578' : '#fff', border: 'none', borderRadius: 13, padding: '16px', fontFamily: "'Sora', sans-serif", fontWeight: 700, cursor: grading ? 'default' : 'pointer', fontSize: '1rem', marginTop: 4, boxShadow: grading ? 'none' : `0 4px 20px ${color}44`, transition: 'all .2s' }}>
            {grading ? '⏳ Marking your answer…' : 'Check my answer →'}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Chemistry browser ────────────────────────────────────────────────────────
function ChemistryBrowser({ onBack }) {
  const { CHEMISTRY_TOPIC_GROUPS } = useTestData() || {}
  const [activeGroup, setGroup] = useState(null)
  const [filter, setFilter]     = useState('all')
  const [chemQIdx, setChemQIdx] = useState(0)

  if (activeGroup) return <ChemistryTopicView key={chemQIdx} group={activeGroup} qIdx={chemQIdx} onQChange={setChemQIdx} onBack={() => { setGroup(null); setChemQIdx(0) }} />

  const totalQs = CHEMISTRY_TOPIC_GROUPS.reduce((s, g) => s + g.questions.length, 0)
  const filters = [
    { id: 'all',    label: `All (${totalQs})` },
    { id: 'p1',     label: 'Paper 1' },
    { id: 'p2',     label: 'Paper 2' },
    { id: 'calc',   label: '🖩 Calculator' },
  ]
  const filtered = filter === 'all'  ? CHEMISTRY_TOPIC_GROUPS
    : filter === 'p1'   ? CHEMISTRY_TOPIC_GROUPS.filter(g => g.paper.includes('1'))
    : filter === 'p2'   ? CHEMISTRY_TOPIC_GROUPS.filter(g => g.paper.includes('2'))
    : CHEMISTRY_TOPIC_GROUPS.filter(g => g.calculator)

  return (
    <div style={{ background: '#08090D', minHeight: '100vh', paddingBottom: 90 }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: 'rgba(8,12,26,.97)', borderBottom: '1px solid #1E2A40', backdropFilter: 'blur(14px)', padding: '14px 16px' }}>
        <div style={{ maxWidth: 660, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <BackButton onClick={onBack} />
          <img src="/headers/chem-logo.webp" alt="Chemistry" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#F5F7FB' }}>AQA Chemistry Foundation</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.72rem', color: '#5A6480' }}>Papers 1 & 2 · {CHEMISTRY_TOPIC_GROUPS.length} topics · {totalQs} questions · AI marked · Diagrams included</div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 660, margin: '0 auto', padding: '16px 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flex: 1, background: filter === f.id ? 'rgba(56,210,122,.15)' : '#151720', border: `1px solid ${filter === f.id ? '#38D27A' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '9px 6px', fontFamily: "'Outfit', sans-serif", fontSize: '.73rem', fontWeight: 600, color: filter === f.id ? '#38D27A' : '#5A6480', cursor: 'pointer' }}>{f.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(group => (
            <button key={group.id} onClick={() => setGroup(group)} style={{ background: '#151720', border: '1px solid #1E2A40', borderRadius: 16, padding: '16px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, width: '100%' }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                <img src={(() => {
                  const id = group.id || ''
                  if (['chem_atom','chem_periodic','chem_bonding','chem_giant','chem_matter','chem_ions'].some(k => id.startsWith(k))) return '/headers/chem-matteratoms.webp'
                  if (['chem_react','chem_acid','chem_electro','chem_energy','chem_calcul'].some(k => id.startsWith(k))) return '/headers/chem-reactions.webp'
                  if (['chem_rates','chem_revers','chem_hydro','chem_crack','chem_organic','chem_polymer'].some(k => id.startsWith(k))) return '/headers/chem-rates.webp'
                  if (['chem_earth','chem_atmos','chem_pollu','chem_resource'].some(k => id.startsWith(k))) return '/headers/chem-earth.webp'
                  return '/headers/chem-logo.webp'
                })()} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.93rem', color: '#F5F7FB', marginBottom: 3 }}>{group.label}</div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.75rem', color: '#5A6480', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{group.description}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 7, alignItems: 'center' }}>
                  <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }} />
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.68rem', fontWeight: 600, color: group.color, flexShrink: 0 }}>{group.questions.length} Q{group.questions.length !== 1 ? 's' : ''}</span>
                  <span style={{ background: group.calculator ? 'rgba(56,210,122,.12)' : 'rgba(255,200,87,.08)', border: group.calculator ? '1px solid rgba(56,210,122,.25)' : '1px solid rgba(255,200,87,.2)', borderRadius:6, padding:'2px 8px', fontFamily:"'Outfit', sans-serif", fontSize:'.6rem', fontWeight:700, color: group.calculator ? '#38D27A' : '#FFC857', flexShrink:0 }}>{group.calculator ? '🖩 Calc OK' : '✏️ No Calc'}</span>
                </div>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.1rem', flexShrink: 0 }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}



// Quick Fire's tap-to-grade UI needs an `options` array with a `correct`
// index — these quickQuizData.js types map onto that shape directly
// (truefalse becomes a True/False pair). matchpairs/sequence/dragdrop need a
// different interaction and are left for the 90s Pulse quiz only.
const QUICK_FIRE_BANK_TYPES = new Set(['mcq', 'truefalse', 'fillgap'])

function quickFireFromBank(q) {
  const isTrueFalse = q.type === 'truefalse'
  return {
    q: q.question,
    type: isTrueFalse ? 'truefalse' : 'mc',
    options: isTrueFalse ? ['True', 'False'] : q.options,
    correct: isTrueFalse ? (q.correct ? 0 : 1) : q.correctIndex,
    subject: q.subject,
    topic: q.topic,
    moduleId: TAG_MODULE_MAP[q.tag] || null,
    ms: q.explanation,
    hint: q.reasoning,
  }
}

const QUICK_FIRE_HANDWRITTEN_QUESTIONS = [
  { q: 'What theory said bad smells caused disease?', options: ['Miasma', 'Germ theory', 'Four humours', 'Natural selection'], correct: 0, subject: 'History', topic: 'Medieval Medicine', moduleId: 'history-medicine-medieval-beliefs-causes', ms: 'Miasma was the belief that bad air or smells caused disease.', hint: 'Think about what people believed travelled through bad-smelling air.' },
  { q: 'Who proved blood circulates around the body?', options: ['William Harvey', 'Edward Jenner', 'Louis Pasteur', 'Robert Koch'], correct: 0, subject: 'History', topic: 'Renaissance Medicine', moduleId: 'mod2', ms: 'William Harvey published his ideas about blood circulation in 1628.', hint: 'This 17th-century English doctor showed the heart pumps blood around the body in a continuous loop.' },
  { q: 'Which scientist developed germ theory?', options: ['Louis Pasteur', 'Galen', 'Vesalius', 'Florence Nightingale'], correct: 0, subject: 'History', topic: 'Germ Theory', moduleId: 'history-medicine-germ-theory', ms: 'Louis Pasteur showed that germs cause decay and disease.', hint: 'This French scientist showed that tiny living organisms — not bad air — cause disease.' },
  { q: 'What did Jenner create a vaccine for?', options: ['Smallpox', 'Cholera', 'Tuberculosis', 'Typhoid'], correct: 0, subject: 'History', topic: 'Vaccination', moduleId: 'history-medicine-jenner-vaccination', ms: 'Edward Jenner developed vaccination against smallpox.', hint: 'He noticed milkmaids who caught a mild disease from cows seemed protected from a much deadlier one.' },
  { q: 'What did Lister use as an antiseptic?', options: ['Carbolic acid', 'Penicillin', 'Ether', 'Aspirin'], correct: 0, subject: 'History', topic: 'Surgery & Anatomy', moduleId: 'mod3', ms: 'Joseph Lister used carbolic acid to reduce infection in surgery.', hint: 'This chemical was already used to treat sewage before Lister sprayed it on wounds and instruments.' },
  { q: 'Who discovered penicillin?', options: ['Alexander Fleming', 'Robert Koch', 'James Simpson', 'John Snow'], correct: 0, subject: 'History', topic: 'Modern Medicine', moduleId: 'mod7', ms: 'Alexander Fleming discovered penicillin in 1928.', hint: 'He noticed a mould had killed the bacteria growing around it on a petri dish he had left out.' },
  { q: 'What did John Snow remove in 1854?', options: ['A pump handle', 'A hospital ward', 'A sewer pipe', 'A microscope lens'], correct: 0, subject: 'History', topic: 'Public Health', moduleId: 'mod5', ms: 'John Snow removed the Broad Street pump handle during a cholera outbreak.', hint: 'He mapped cholera deaths around Broad Street and traced them back to a contaminated water source.' },
  { q: 'Which war helped plastic surgery develop?', options: ['First World War', 'Crimean War', 'Vietnam War', 'English Civil War'], correct: 0, subject: 'History', topic: 'Modern Surgery', moduleId: 'mod3', ms: 'The First World War created a need for reconstructive plastic surgery.', hint: 'Trench warfare caused huge numbers of severe facial injuries that needed reconstruction.' },
  { q: 'Which organ pumps blood?', options: ['Heart', 'Liver', 'Lung', 'Kidney'], correct: 0, subject: 'Biology', topic: 'Circulation', moduleId: null, ms: 'The heart pumps blood around the body.', hint: 'This muscular organ in your chest contracts to push blood around your body.' },
  { q: 'What is the control centre of a cell?', options: ['Nucleus', 'Ribosome', 'Cell wall', 'Cytoplasm'], correct: 0, subject: 'Biology', topic: 'Cells', moduleId: 'sci_bio_w1', ms: 'The nucleus contains genetic material and controls cell activities.', hint: 'This structure holds the genetic material that controls what the cell does.' },
  { q: 'What process moves water through a membrane?', options: ['Osmosis', 'Diffusion', 'Respiration', 'Transpiration'], correct: 0, subject: 'Biology', topic: 'Osmosis', moduleId: 'sci_bio_w1', ms: 'Osmosis is the movement of water through a partially permeable membrane.', hint: 'This is the movement of water — specifically — through a partially permeable membrane.' },
  { q: 'What gas do plants take in for photosynthesis?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], correct: 0, subject: 'Biology', topic: 'Photosynthesis', moduleId: 'sci_bio_w1', ms: 'Plants use carbon dioxide during photosynthesis.', hint: 'Plants take this gas in through their leaves and combine it with water using light energy.' },
  { q: 'What is 7 x 8?', options: ['56', '54', '64', '48'], correct: 0, subject: 'Maths', topic: 'Times Tables', moduleId: null, ms: '7 x 8 = 56.', hint: 'Think of 7 groups of 8. What is 8 × 7?' },
  { q: 'What is 15% of 200?', options: ['30', '15', '20', '35'], correct: 0, subject: 'Maths', topic: 'Percentages', moduleId: null, ms: '10% is 20 and 5% is 10, so 15% is 30.', hint: 'Find 10% first, then half of that for 5%, and add the two together.' },
  { q: 'What is the mean of 2, 4 and 9?', options: ['5', '6', '7', '15'], correct: 0, subject: 'Maths', topic: 'Averages', moduleId: null, ms: '(2 + 4 + 9) / 3 = 5.', hint: 'Add all the values together, then divide by how many numbers there are.' },
  { q: 'What word means a comparison using like or as?', options: ['Simile', 'Metaphor', 'Verb', 'Noun'], correct: 0, subject: 'English', topic: 'Language Devices', moduleId: null, ms: 'A simile compares using like or as.', hint: 'This device directly compares two things using a specific connecting word.' },
  { q: 'What is a word that describes a noun?', options: ['Adjective', 'Verb', 'Adverb', 'Pronoun'], correct: 0, subject: 'English', topic: 'Grammar', moduleId: null, ms: 'An adjective describes a noun.', hint: 'This word type gives extra information about a person, place or thing.' },
  { q: 'Which word means repeating the same starting sound?', options: ['Alliteration', 'Oxymoron', 'Personification', 'Zoomorphism'], correct: 0, subject: 'English', topic: 'Language Devices', moduleId: null, ms: 'Alliteration repeats the same initial sound.', hint: 'This device is about the sounds at the start of words, not their meaning.' },
  { q: 'What is the pH of a neutral solution?', options: ['7', '1', '14', '0'], correct: 0, subject: 'Chemistry', topic: 'Acids and Alkalis', moduleId: null, ms: 'Neutral solutions have pH 7.', hint: 'On the pH scale, this number sits exactly halfway between acidic and alkaline.' },
  { q: 'What particle has a negative charge?', options: ['Electron', 'Proton', 'Neutron', 'Nucleus'], correct: 0, subject: 'Chemistry', topic: 'Atomic Structure', moduleId: null, ms: 'Electrons have a negative charge.', hint: 'This subatomic particle orbits the nucleus and has a much smaller mass than a proton or neutron.' },
]

const QUICK_FIRE_QUESTIONS = [
  ...QUICK_FIRE_HANDWRITTEN_QUESTIONS,
  ...QUICK_QUIZ_QUESTIONS.filter(q => QUICK_FIRE_BANK_TYPES.has(q.type)).map(quickFireFromBank),
]

const QUICK_FIRE_MEMORY_KEY = 'gcse_quickfire_memory_v1'
const QF_QUESTION_HISTORY_KEY = 'gcse_qf_q_history'
const QF_PREV_SESSION_KEY = 'gcse_qf_prev_session'
const QF_BEST_KEY = 'gcse_qf_best'

function qfQuestionId(q) {
  return (q.subject || '') + '::' + (q.q || '').slice(0, 40)
}
function readQfQuestionHistory() {
  try { return JSON.parse(localStorage.getItem(QF_QUESTION_HISTORY_KEY) || '{}') } catch { return {} }
}
function updateQfQuestionHistory(q, isCorrect) {
  const id = qfQuestionId(q)
  if (!id) return
  const hist = readQfQuestionHistory()
  const prev = hist[id] || { attempts: 0, correct: 0, lastResult: null }
  hist[id] = { attempts: prev.attempts + 1, correct: prev.correct + (isCorrect ? 1 : 0), lastResult: isCorrect ? 'correct' : 'incorrect' }
  try { localStorage.setItem(QF_QUESTION_HISTORY_KEY, JSON.stringify(hist)) } catch {}
}
function wasQfPrevWrong(q) {
  return readQfQuestionHistory()[qfQuestionId(q)]?.lastResult === 'incorrect'
}
function readQfPrevSession() {
  try { return JSON.parse(localStorage.getItem(QF_PREV_SESSION_KEY) || 'null') } catch { return null }
}
function saveQfPrevSession(accuracy, answered) {
  try { localStorage.setItem(QF_PREV_SESSION_KEY, JSON.stringify({ accuracy, answered, date: new Date().toISOString() })) } catch {}
}
function readQfBest() {
  try { return JSON.parse(localStorage.getItem(QF_BEST_KEY) || 'null') } catch { return null }
}
function saveQfBestIfBeaten(correct, answered) {
  const best = readQfBest()
  if (!best || correct > best.correct) {
    try { localStorage.setItem(QF_BEST_KEY, JSON.stringify({ correct, answered, date: new Date().toISOString() })) } catch {}
  }
}

const QUICK_FIRE_SUBJECT_META = {
  History:    { icon: '🏛️', logo: '/headers/history-main.webp',    color: '#C89B6D', moduleId: 'history-medicine-medieval-beliefs-causes' },
  Maths:      { icon: '✖️', logo: '/headers/maths-main.webp',      color: '#2DD4BF', moduleId: null },
  Sociology:  { icon: '👥', logo: '/headers/sociology-main.webp',  color: '#FF5C7A', moduleId: null },
  Chemistry:  { icon: '⚗️', logo: '/headers/chem-logo.webp',       color: '#9B59E8', moduleId: null },
  Biology:    { icon: '🌿', logo: '/headers/bio-main.webp',         color: '#4F8A5B', moduleId: 'sci_bio_w1' },
  English:    { icon: '📘', logo: '/headers/english-main.webp',    color: '#B66DFF', moduleId: null },
  Physics:    { icon: '⚡', logo: '/headers/physics-main.webp',    color: '#3B82F6', moduleId: null },
  'Quick Fire': { icon: '⚡', logo: null,                          color: '#9D5CFF', moduleId: null },
}

function emptyQuickFireStats() {
  return { answered: 0, correct: 0, subjects: {}, topics: {} }
}

function bumpQuickFireBucket(buckets, key, isCorrect, extra = {}) {
  const next = { ...buckets }
  const current = next[key] || { answered: 0, correct: 0, ...extra }
  next[key] = {
    ...current,
    ...extra,
    answered: (current.answered || 0) + 1,
    correct: (current.correct || 0) + (isCorrect ? 1 : 0),
  }
  return next
}

function addQuickFireAnswer(stats, question, isCorrect) {
  const subject = question.subject || 'Quick Fire'
  const topic = question.topic || subject
  const topicKey = subject + '::' + topic
  return {
    answered: stats.answered + 1,
    correct: stats.correct + (isCorrect ? 1 : 0),
    subjects: bumpQuickFireBucket(stats.subjects || {}, subject, isCorrect, { subject }),
    topics: bumpQuickFireBucket(stats.topics || {}, topicKey, isCorrect, {
      key: topicKey,
      subject,
      topic,
      moduleId: question.moduleId || null,
    }),
  }
}

function readQuickFireMemory() {
  try {
    return JSON.parse(localStorage.getItem(QUICK_FIRE_MEMORY_KEY) || '{"subjects":{},"topics":{}}')
  } catch {
    return { subjects: {}, topics: {} }
  }
}

function mergeQuickFireBuckets(memoryBuckets = {}, roundBuckets = {}) {
  const merged = { ...memoryBuckets }
  Object.entries(roundBuckets).forEach(([key, value]) => {
    const current = merged[key] || { ...value, answered: 0, correct: 0 }
    merged[key] = {
      ...current,
      ...value,
      answered: (current.answered || 0) + (value.answered || 0),
      correct: (current.correct || 0) + (value.correct || 0),
    }
  })
  return merged
}

function saveQuickFireMemory(roundStats) {
  const memory = readQuickFireMemory()
  const next = {
    subjects: mergeQuickFireBuckets(memory.subjects, roundStats.subjects),
    topics: mergeQuickFireBuckets(memory.topics, roundStats.topics),
    updatedAt: new Date().toISOString(),
  }
  try { localStorage.setItem(QUICK_FIRE_MEMORY_KEY, JSON.stringify(next)) } catch {}
  return next
}

function bucketAccuracy(bucket) {
  return bucket?.answered ? Math.round((bucket.correct / bucket.answered) * 100) : 0
}

function rankedQuickFireSubjects(memory, roundStats) {
  const subjects = mergeQuickFireBuckets(memory.subjects, roundStats.subjects)
  return Object.entries(subjects)
    .map(([subject, bucket]) => ({
      subject,
      icon: QUICK_FIRE_SUBJECT_META[subject]?.icon || '📚',
      color: QUICK_FIRE_SUBJECT_META[subject]?.color || '#9CA8C7',
      moduleId: QUICK_FIRE_SUBJECT_META[subject]?.moduleId || null,
      answered: bucket.answered || 0,
      correct: bucket.correct || 0,
      accuracy: bucketAccuracy(bucket),
    }))
    .filter(item => item.answered > 0)
    .sort((a, b) => b.answered - a.answered)
}


function confidencePriorityForModule(moduleId) {
  if (!moduleId) return 0
  const rating = getAllConfidenceRatings().find(item => item.moduleId === moduleId)
  if (!rating) return 0
  if (rating.confidence === 'confused') return 4
  if (rating.confidence === 'clicking') return 2
  return 0
}

// Shuffle a quick-fire question's options so the correct answer isn't always at the same index
function withShuffledQfOptions(q) {
  const indexed = q.options.map((text, i) => ({ text, isCorrect: i === q.correct }))
  const shuffled = shuffle(indexed)
  return { ...q, options: shuffled.map(o => o.text), correct: shuffled.findIndex(o => o.isCorrect) }
}

function prioritizedQuickFireQuestions() {
  const memory = readQuickFireMemory()
  const qHist = readQfQuestionHistory()
  // Shuffle first so same-priority questions vary each round
  const shuffled = [...QUICK_FIRE_QUESTIONS].sort(() => Math.random() - 0.5)
  return shuffled
    .map(question => {
      const prevResult = qHist[qfQuestionId(question)]?.lastResult
      const subjectBucket = memory.subjects?.[question.subject]
      const topicBucket = memory.topics?.[question.subject + '::' + question.topic]
      const subjectWeakness = subjectBucket?.answered ? Math.max(0, 70 - bucketAccuracy(subjectBucket)) / 10 : 0
      const topicWeakness = topicBucket?.answered ? Math.max(0, 75 - bucketAccuracy(topicBucket)) / 8 : 0
      const confidenceBoost = confidencePriorityForModule(question.moduleId)
      // Previously wrong → higher priority; recently correct → slightly lower
      const wrongBoost = prevResult === 'incorrect' ? 3.5 : 0
      const correctPenalty = prevResult === 'correct' ? -1.0 : 0
      return { question, score: subjectWeakness + topicWeakness + confidenceBoost + wrongBoost + correctPenalty }
    })
    .sort((a, b) => b.score - a.score)
    .map(item => withShuffledQfOptions(item.question))
}

function pickQuickFireRecommendation(memory, roundStats) {
  const topics = mergeQuickFireBuckets(memory.topics, roundStats.topics)
  const weakTopic = Object.values(topics)
    .filter(topic => (topic.answered || 0) > 0)
    .sort((a, b) => {
      const accuracyGap = bucketAccuracy(a) - bucketAccuracy(b)
      if (accuracyGap !== 0) return accuracyGap
      return (b.answered || 0) - (a.answered || 0)
    })[0]

  if (weakTopic) {
    return {
      subject: weakTopic.subject,
      topic: weakTopic.topic,
      moduleId: weakTopic.moduleId || QUICK_FIRE_SUBJECT_META[weakTopic.subject]?.moduleId || null,
      accuracy: bucketAccuracy(weakTopic),
      answered: weakTopic.answered || 0,
    }
  }

  return { subject: 'Biology', topic: 'Photosynthesis', moduleId: 'sci_bio_w1', accuracy: 0, answered: 0 }
}



function getQuizWeaknesses() {
  try { return JSON.parse(localStorage.getItem('gcse_quiz_weaknesses') || '{}') } catch { return {} }
}

// ─── Quick Fire — circular countdown ────────────────────────────────────────
// Hero element of the Quick Fire header. Continuously updates, never pauses,
// never pulses or glows — see "90 Second Quick Fire" UX spec.
function CircularTimer({ seconds, totalSeconds }) {
  const size = 84
  const stroke = 4
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(1, totalSeconds ? seconds / totalSeconds : 0))
  const offset = circumference * (1 - pct)
  return (
    <div style={{ position:'relative', width:size, height:size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block', transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={GENERAL.teal} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition:`stroke-dashoffset ${MOTION.duration.standard} ${MOTION.easing.linear}` }}
        />
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <span style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'1.05rem', color:GENERAL.softWhite, lineHeight:1 }}>{seconds}</span>
        <span style={{ fontFamily:"'Sora', sans-serif", fontWeight:600, fontSize:'.5rem', letterSpacing:'.16em', color:GENERAL.slate, marginTop:3 }}>SEC</span>
      </div>
    </div>
  )
}

// ─── Quick Fire — question screen ───────────────────────────────────────────
// Implements the "90 Second Quick Fire" locked UX spec: tap-to-grade answer
// cards, retry-in-place on an incorrect tap, auto-advance on a correct one.
// Calm, monochrome, no badges/labels/progress bars — the timer is the only
// chrome. `onAnswer` fires once per question (first attempt only).
function QuickFireQuestionScreen({ q, timeLeft, totalSeconds, onExit, onAnswer, onAdvance }) {
  const [tapped, setTapped]         = useState(null)
  const [status, setStatus]         = useState(null) // null | 'correct' | 'incorrect'
  const [hintVisible, setHintVisible] = useState(false)
  const [retryTapped, setRetryTapped] = useState(null)
  const [retryStatus, setRetryStatus] = useState(null) // null | 'correct' | 'incorrect'
  const [entered, setEntered]       = useState(false)
  const [leaving, setLeaving]       = useState(false)
  const timersRef = useRef([])

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => {
      cancelAnimationFrame(raf)
      timersRef.current.forEach(clearTimeout)
    }
  }, [])

  if (!q) return null

  function advanceAfterHold() {
    const holdMs = parseInt(MOTION.duration.cinematic, 10)
    const outMs = parseInt(MOTION.duration.standard, 10)
    timersRef.current.push(setTimeout(() => {
      setLeaving(true)
      timersRef.current.push(setTimeout(onAdvance, outMs))
    }, holdMs))
  }

  function selectOption(opt) {
    if (status === null) {
      const isCorrect = opt === q.options[q.correct]
      setTapped(opt)
      setStatus(isCorrect ? 'correct' : 'incorrect')
      if (navigator.vibrate) navigator.vibrate(isCorrect ? 10 : 20)
      onAnswer(isCorrect)
      if (isCorrect || q.type === 'truefalse') {
        // True/false is binary — a wrong tap already reveals the answer, so
        // skip the hint and retry step and move straight on.
        advanceAfterHold()
      } else {
        const hintMs = parseInt(MOTION.duration.fast, 10)
        timersRef.current.push(setTimeout(() => setHintVisible(true), hintMs))
      }
      return
    }
    // One retry after the hint: picking a different answer marks it immediately
    if (status === 'incorrect' && hintVisible && retryStatus === null && opt !== tapped) {
      const isCorrect = opt === q.options[q.correct]
      setRetryTapped(opt)
      setRetryStatus(isCorrect ? 'correct' : 'incorrect')
      if (navigator.vibrate) navigator.vibrate(isCorrect ? 10 : 20)
      advanceAfterHold()
    }
  }

  function mark(kind) {
    if (kind !== 'correct') {
      return (
        <span aria-hidden="true" style={{ position:'absolute', right:18, top:'50%', transform:'translateY(-50%)', color:GENERAL.coral, fontSize:'1.15rem', fontWeight:700, animation:`qfMarkIn ${MOTION.duration.fast} ${MOTION.easing.standard} both` }}>
          ×
        </span>
      )
    }
    return (
      <span aria-hidden="true" style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', width:30, height:30 }}>
        <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:`rgba(${GENERAL.tealRgb}, 0.4)`, animation:`qfRingOut ${MOTION.duration.slow} ${MOTION.easing.standard} both` }} />
        <span style={{ position:'absolute', inset:0, borderRadius:'50%', background:GENERAL.teal, display:'flex', alignItems:'center', justifyContent:'center', animation:`qfMarkPop ${MOTION.duration.standard} ${MOTION.easing.standard} both` }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GENERAL.neutral[0]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" style={{ strokeDasharray:24, strokeDashoffset:24, animation:`qfCheckDraw ${MOTION.duration.standard} ${MOTION.easing.standard} ${MOTION.duration.instant} forwards` }} />
          </svg>
        </span>
      </span>
    )
  }

  return (
    <div style={{ background:GENERAL.neutral[0], minHeight:'100dvh', display:'flex', flexDirection:'column', color:GENERAL.softWhite }}>
      <style>{`
        @keyframes qfMarkIn { from { opacity:0; transform:translateY(-50%) scale(0.5); } to { opacity:1; transform:translateY(-50%) scale(1); } }
        @keyframes qfHintIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes qfMarkPop { 0% { transform:scale(0.4); opacity:0; } 65% { transform:scale(1.15); opacity:1; } 100% { transform:scale(1); opacity:1; } }
        @keyframes qfRingOut { 0% { transform:scale(0.6); opacity:0.45; } 100% { transform:scale(1.9); opacity:0; } }
        @keyframes qfCheckDraw { to { stroke-dashoffset:0; } }
      `}</style>

      <div style={{ padding:`${SPACING.compact}px 20px 0`, display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
        <div style={{ width:'100%', maxWidth:520, display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
          <button onClick={onExit} aria-label="Exit" style={{
            width:42, height:42, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.14)',
            background:'transparent', color:GENERAL.slate, fontSize:'1.2rem', lineHeight:1,
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', padding:0,
          }}>×</button>
          <CircularTimer seconds={timeLeft} totalSeconds={totalSeconds} />
        </div>
      </div>

      <div style={{
        flex:1, display:'flex', flexDirection:'column', justifyContent:'flex-start',
        padding:`${SPACING.compact}px 20px ${SPACING.standard}px`, maxWidth:520, width:'100%', margin:'0 auto', boxSizing:'border-box',
        opacity: entered && !leaving ? 1 : 0,
        transform: leaving ? 'translateY(-8px)' : entered ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity ${MOTION.duration.standard} ${MOTION.easing.standard}, transform ${MOTION.duration.standard} ${MOTION.easing.standard}`,
      }}>
        <p style={{
          fontFamily:"'IBM Plex Serif', serif", fontSize:26, lineHeight:1.25, fontWeight:600,
          letterSpacing:'-0.01em', margin:`0 0 ${SPACING.standard}px`, color:GENERAL.softWhite,
        }}>{q.q}</p>

        <div style={{ display:'flex', flexDirection:'column', gap:SPACING.micro }}>
          {q.options.map((opt, i) => {
            const isFirstTapped = tapped === opt
            const isRetryTapped = retryTapped === opt
            const isCorrectOpt = i === q.correct
            let opacity = 1
            let background = GENERAL.neutral[1]
            let border = '1px solid rgba(255,255,255,0.06)'

            if (status === 'incorrect' && isFirstTapped) opacity = 0.58
            if (status === 'correct' && isFirstTapped) {
              background = `rgba(${GENERAL.tealRgb}, 0.07)`
              border = `1px solid ${GENERAL.teal}`
            }
            if (isRetryTapped && retryStatus === null) {
              border = `1px solid rgba(${GENERAL.tealRgb}, 0.5)`
            }
            if (isRetryTapped && retryStatus === 'correct') {
              background = `rgba(${GENERAL.tealRgb}, 0.07)`
              border = `1px solid ${GENERAL.teal}`
            }
            if (isRetryTapped && retryStatus === 'incorrect') opacity = 0.58
            if (retryStatus === 'incorrect' && isCorrectOpt) {
              background = `rgba(${GENERAL.tealRgb}, 0.07)`
              border = `1px solid ${GENERAL.teal}`
            }

            const disabled = status === 'correct'
              ? true
              : status === 'incorrect'
                ? (retryStatus !== null || isFirstTapped || !hintVisible)
                : false

            return (
              <button key={i} onClick={() => selectOption(opt)} disabled={disabled} style={{
                position:'relative', width:'100%', textAlign:'left', background, border, borderRadius:RADII.large,
                padding:'14px 44px 14px 18px', cursor: disabled ? 'default' : 'pointer',
                ...TYPE.body, fontWeight:500, color:GENERAL.softWhite,
                opacity,
                transition:`opacity ${MOTION.duration.instant} ${MOTION.easing.gentle}, background ${MOTION.duration.instant} ${MOTION.easing.gentle}, border-color ${MOTION.duration.instant} ${MOTION.easing.gentle}`,
              }}>
                {opt}
                {status === 'incorrect' && isFirstTapped && mark('incorrect')}
                {status === 'correct' && isFirstTapped && mark('correct')}
                {isRetryTapped && retryStatus === 'correct' && mark('correct')}
                {isRetryTapped && retryStatus === 'incorrect' && mark('incorrect')}
                {retryStatus === 'incorrect' && isCorrectOpt && !isRetryTapped && mark('correct')}
              </button>
            )
          })}
        </div>

        {hintVisible && status === 'incorrect' && (
          <div style={{
            marginTop:SPACING.compact, background:GENERAL.neutral[1], borderRadius:RADII.large,
            borderLeft:`3px solid ${GENERAL.teal}`, padding:'12px 16px',
            display:'flex', gap:12, alignItems:'flex-start',
            animation:`qfHintIn ${MOTION.duration.fast} ${MOTION.easing.standard} both`,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color:GENERAL.slate, flexShrink:0, marginTop:3 }}>
              <path d="M9 18h6M10 21h4M12 2a6.5 6.5 0 0 0-4 11.6c.6.5 1 1.3 1 2.4h6c0-1.1.4-1.9 1-2.4A6.5 6.5 0 0 0 12 2z" />
            </svg>
            <div>
              <div style={{ ...TYPE.metadata, color:GENERAL.slate, marginBottom:6 }}>Hint</div>
              <p style={{ margin:0, ...TYPE.body, fontSize:'.92rem', color:GENERAL.softWhite }}>{q.hint || q.ms}</p>
              <p style={{ margin:'6px 0 0', ...TYPE.body, fontSize:'.8rem', color:GENERAL.teal, fontStyle:'italic' }}>Pick another answer — it'll mark straight away.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TestTab({ mode = 'test', onOpenModule, onExit, onOpenPulse, autoStart = false, examAutoStart = null, clearExamAutoStart } = {}) {
  const { ALL_MATHS_QUESTIONS, ALL_ENGLISH_QUESTIONS, ALL_SOCIOLOGY_QUESTIONS, ALL_CHEMISTRY_QUESTIONS, GUIDED_COACH_TYPES } = useTestData() || {}
  const [mathsOpen, setMathsOpen]   = useState(false)
  const [englishOpen, setEnglishOpen]     = useState(false)
  const [sociologyOpen, setSociologyOpen]     = useState(false)
  const [chemistryOpen, setChemistryOpen]     = useState(false)
  const [paperChooserOpen, setPaperChooserOpen] = useState(false)
  const [examTechniqueOpen, setExamTechniqueOpen] = useState(false)
  const [activeCoachType, setActiveCoachType] = useState(null)
  const [selected, setSelected]   = useState(null)
  const [qIdx, setQIdx]           = useState(0)
  const [answer, setAnswer]       = useState('')
  const [showTip, setTip]         = useState(false)
  const [grading, setGrading]     = useState(false)
  const [feedback, setFeedback]   = useState(null)
  const [error, setError]         = useState(null)
  const [testProgress, setTestProgress] = useState(() => { try { return getProgress() } catch { return { streak: 0 } } })
  const testStreak = testProgress.streak || 0
  const testStreakDots = Array.from({ length: 7 }, (_, i) => i < Math.min(7, testStreak))
  const isQuickFire = mode === 'quickfire'
  const isExamMode = mode === 'exam'
  const QUICK_FIRE_SECONDS = 90
  const [quickFireTimeLeft, setQuickFireTimeLeft] = useState(QUICK_FIRE_SECONDS)
  const [quickFireActive, setQuickFireActive] = useState(false)
  const [quickFireFinished, setQuickFireFinished] = useState(false)
  const [quickFireStats, setQuickFireStats] = useState(() => emptyQuickFireStats())
  const [quickFireQuestionSet, setQuickFireQuestionSet] = useState(QUICK_FIRE_QUESTIONS)
  const [quickFireSummary, setQuickFireSummary] = useState(null)
  const [quickFireCountdown, setQuickFireCountdown] = useState(null)
  const EXAM_SECONDS = 10 * 60
  const [examPhase, setExamPhase] = useState('landing')
  const [examCountdown, setExamCountdown] = useState(3)
  const [examConfig, setExamConfig] = useState(null)
  const [examQuestions, setExamQuestions] = useState([])
  const [examIdx, setExamIdx] = useState(0)
  const [examTimeLeft, setExamTimeLeft] = useState(EXAM_SECONDS)
  const [examAnswer, setExamAnswer] = useState('')
  const [examFeedback, setExamFeedback] = useState(null)
  const [examGrading, setExamGrading] = useState(false)
  const [examStats, setExamStats] = useState({ correct: 0, answered: 0, bySubject: {} })
  const [tqMcAttempts, setTqMcAttempts] = useState(0)
  const [tqMcHint, setTqMcHint]         = useState(false)
  const [tqMcLocked, setTqMcLocked]     = useState(false)
  const [qfConsecutiveWrong, setQfConsecutiveWrong] = useState(0)
  // Full-paper exam state
  const [examPaperAnswers,   setExamPaperAnswers]   = useState({})
  const [examPaperFeedbacks, setExamPaperFeedbacks] = useState({})
  const [examPaperGrading,   setExamPaperGrading]   = useState({})

  // Quickfire 3-2-1-GO countdown
  useEffect(() => {
    if (!isQuickFire || quickFireCountdown === null) return undefined
    if (quickFireCountdown === 'GO') {
      const t = setTimeout(() => { setQuickFireCountdown(null); setQuickFireActive(true) }, 650)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setQuickFireCountdown(v => v === 1 ? 'GO' : v - 1), 900)
    return () => clearTimeout(t)
  }, [isQuickFire, quickFireCountdown])

  useEffect(() => {
    if (!isQuickFire || !selected || !quickFireActive) return undefined
    const timer = setInterval(() => {
      setQuickFireTimeLeft(seconds => Math.max(0, seconds - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [isQuickFire, selected, quickFireActive])

  useEffect(() => {
    if (!isQuickFire || !selected || !quickFireActive || quickFireTimeLeft > 0) return
    setQuickFireActive(false)
    setQuickFireFinished(true)
    setError(null)
    finishQuickFireRound('time')
  }, [isQuickFire, selected, quickFireActive, quickFireTimeLeft])

  useEffect(() => {
    if (!isExamMode || examPhase !== 'countdown') return undefined
    const timer = setInterval(() => {
      setExamCountdown(value => {
        if (value === 'GO') {
          clearInterval(timer)
          setExamPhase('round')
          return 'GO'
        }
        if (value === 1) return 'GO'
        return value - 1
      })
    }, 900)
    return () => clearInterval(timer)
  }, [isExamMode, examPhase])

  useEffect(() => {
    if (!isExamMode || examPhase !== 'round' || !examConfig?.isTimedPaper) return undefined
    const timer = setInterval(() => {
      setExamTimeLeft(value => {
        if (value <= 1) {
          clearInterval(timer)
          setExamPhase('summary')
          return 0
        }
        return value - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isExamMode, examPhase, examConfig])

  // Auto-start quickfire when launched from Pulse tab
  const autoStartedRef = useRef(false)
  useEffect(() => {
    if (autoStart && isQuickFire && !autoStartedRef.current) {
      autoStartedRef.current = true
      startRandomQuestion()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-start an exam round when launched from Home's "Today's plan"
  const examAutoStartedRef = useRef(false)
  useEffect(() => {
    if (isExamMode && examAutoStart && !examAutoStartedRef.current) {
      examAutoStartedRef.current = true
      const { subject, ...opts } = examAutoStart
      startExamRound(subject, opts)
      clearExamAutoStart?.()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const examTime = Math.floor(examTimeLeft / 60) + ':' + String(examTimeLeft % 60).padStart(2, '0')


  function getExamScoreMemory() {
    let scores = []
    try { scores = JSON.parse(localStorage.getItem('gcse_scores') || '[]') } catch {}
    const subjects = {}
    scores.forEach(score => {
      if (!subjects[score.subject]) subjects[score.subject] = []
      subjects[score.subject].push(score.pct)
    })
    return Object.fromEntries(Object.entries(subjects).map(([subject, vals]) => [
      subject,
      Math.round(vals.slice(0, 12).reduce((sum, value) => sum + value, 0) / Math.max(1, vals.slice(0, 12).length)),
    ]))
  }

  function normaliseExamQuestion(question, subject, topicLabel, topicId) {
    const options = question.options || null
    return {
      id: question.id || question.q || Math.random().toString(36),
      subject,
      topicLabel: question.topicLabel || topicLabel || subject,
      topicId: question.topicId || topicId || subject.toLowerCase(),
      q: question.q,
      extract: question.extract,
      marks: question.marks || 1,
      ms: question.ms || 'Award marks fairly for a correct answer.',
      type: question.type || (options ? 'mc' : 'written'),
      options,
      correctIndex: question.correctIndex ?? question.correct,
      fig: question.fig,
      imageKey: question.imageKey,
      skillTip: question.skillTip,
    }
  }

  function allExamQuestions() {
    const fromTestTopics = TEST_TOPICS.flatMap(group => group.topics.flatMap(topic => (
      PAST_PAPER_QS[topic.id] || []
    ).map(question => normaliseExamQuestion(question, group.subject, topic.label, topic.id))))
    return [
      ...fromTestTopics,
      ...ALL_MATHS_QUESTIONS.map(q => normaliseExamQuestion(q, 'Maths', q.topicLabel, q.topicId)),
      ...ALL_ENGLISH_QUESTIONS.map(q => normaliseExamQuestion(q, 'English', q.topicLabel, q.topicId)),
      ...ALL_SOCIOLOGY_QUESTIONS.map(q => normaliseExamQuestion(q, 'Sociology', q.topicLabel, q.topicId)),
      ...ALL_CHEMISTRY_QUESTIONS.map(q => normaliseExamQuestion(q, 'Chemistry', q.topicLabel, q.topicId)),
    ].filter(question => question.q)
  }

  function adaptiveExamQuestions(subject = 'Random') {
    const memory = getExamScoreMemory()
    const base = allExamQuestions().filter(q => subject === 'Random' || q.subject === subject)
    const shuffled = shuffle(base)
    const scored = shuffled.map(question => {
      const avg = memory[question.subject]
      const weakness = avg === undefined ? 1 : Math.max(0, 75 - avg) / 10
      const strength = avg === undefined ? 1 : Math.max(0, avg - 70) / 10
      return { question, avg, weakness, strength }
    })
    const weak = scored.filter(item => item.avg === undefined || item.avg < 70).sort((a, b) => b.weakness - a.weakness).map(item => item.question)
    const strong = scored.filter(item => item.avg >= 70).sort((a, b) => b.strength - a.strength).map(item => item.question)
    const mixed = [...weak.slice(0, 6), ...strong.slice(0, 4)]
    const used = new Set(mixed.map(q => q.id))
    const fill = shuffled.filter(q => !used.has(q.id)).slice(0, 10 - mixed.length)
    return shuffle([...mixed, ...fill]).slice(0, 10)
  }

  function resetExamQuestion() {
    setExamAnswer('')
    setExamFeedback(null)
    setExamGrading(false)
    setError(null)
  }

  function startExamRound(subject = 'Random', { isTimedPaper = false, durationSeconds = EXAM_SECONDS, paperQuestions = null, title = null } = {}) {
    const questions = paperQuestions || adaptiveExamQuestions(subject)
    const derivedTitle = title || (subject === 'Random' ? 'Random Exam Challenge' : subject + ' Exam Sprint')
    setExamConfig({ subject, title: derivedTitle, isTimedPaper })
    setExamQuestions(questions)
    setExamIdx(0)
    setExamTimeLeft(durationSeconds)
    setExamCountdown(3)
    setExamStats({ correct: 0, answered: 0, bySubject: {} })
    resetExamQuestion()
    setExamPaperAnswers({})
    setExamPaperFeedbacks({})
    setExamPaperGrading({})
    setExamPhase('countdown')
  }

  function startMedicinePaper2023() {
    const paperQs = MEDICINE_2023_PAPER.questions.map(q => ({
      id: q.id,
      q: q.q,
      marks: q.marks,
      type: q.type,
      ms: q.ms,
      commandWord: q.commandWord,
      topic: q.topic,
      subject: q.subject,
      extract: q.extract,
      sectionHeader: q.sectionHeader,
      sectionNote: q.sectionNote,
      sourcesBooklet: q.sourcesBooklet,
      sourceRefs: q.sourceRefs,
      isChoice: q.isChoice,
      choiceHeader: q.choiceHeader,
      spagNote: q.spagNote,
      note: q.note,
    }))
    startExamRound('History', {
      isTimedPaper: true,
      durationSeconds: MEDICINE_2023_PAPER.timeMins * 60,
      paperQuestions: paperQs,
      title: MEDICINE_2023_PAPER.title,
    })
  }

  function addExamResult(question, earned, possible) {
    const correct = earned >= possible
    setExamStats(stats => {
      const current = stats.bySubject[question.subject] || { answered: 0, correct: 0 }
      return {
        answered: stats.answered + 1,
        correct: stats.correct + (correct ? 1 : 0),
        bySubject: {
          ...stats.bySubject,
          [question.subject]: {
            answered: current.answered + 1,
            correct: current.correct + (correct ? 1 : 0),
          },
        },
      }
    })
    recordScore({ subject: question.subject, earned, possible, source: 'exam' })
  }

  async function checkExamAnswer(question) {
    if (!question) return
    if (question.type === 'mc') {
      if (examAnswer === '') { setError('Pick an answer first.'); return }
      const picked = Number(examAnswer)
      const isCorrect = picked === question.correctIndex
      addExamResult(question, isCorrect ? question.marks : 0, question.marks)
      setExamFeedback({
        grade: isCorrect ? 'Excellent' : 'Needs Work',
        summary: isCorrect ? 'Correct.' : 'Not this time.',
        examinerTip: question.ms,
      })
      return
    }
    if (examAnswer.trim().length < 3) { setError('Write a little before submitting.'); return }
    setExamGrading(true)
    setError(null)
    try {
      const result = await gradeWithAI(question.q, examAnswer, question.marks, question.ms)
      const earned = result.marksAwarded ?? 0
      addExamResult(question, earned, result.marksAvailable || question.marks)
      setExamFeedback(result)
    } catch {
      setError('Could not mark right now. Try again in a moment.')
    } finally {
      setExamGrading(false)
    }
  }

  async function checkPaperAnswer(question, idx) {
    const ans = (examPaperAnswers[idx] ?? '').toString()
    if (examPaperFeedbacks[idx]) return
    if (question.type === 'mc') {
      if (ans === '') return
      const picked = Number(ans)
      const isCorrect = picked === question.correctIndex
      addExamResult(question, isCorrect ? question.marks : 0, question.marks)
      setExamPaperFeedbacks(prev => ({ ...prev, [idx]: {
        grade: isCorrect ? 'Correct' : 'Needs Work',
        summary: isCorrect ? 'Correct.' : `Correct answer: ${question.options[question.correctIndex]}`,
        correct: isCorrect,
      }}))
      return
    }
    if (ans.trim().length < 3) return
    setExamPaperGrading(prev => ({ ...prev, [idx]: true }))
    try {
      const result = await gradeWithAI(question.q, ans, question.marks, question.ms)
      const earned = result.marksAwarded ?? 0
      addExamResult(question, earned, result.marksAvailable || question.marks)
      setExamPaperFeedbacks(prev => ({ ...prev, [idx]: { ...result, correct: earned >= (result.marksAvailable || question.marks) } }))
    } catch {
      setExamPaperFeedbacks(prev => ({ ...prev, [idx]: { grade: 'Error', summary: 'Could not mark. Try again.' } }))
    } finally {
      setExamPaperGrading(prev => ({ ...prev, [idx]: false }))
    }
  }

  function nextExamQuestion() {
    if (examIdx < examQuestions.length - 1) {
      setExamIdx(i => i + 1)
      resetExamQuestion()
    } else {
      setExamPhase('summary')
    }
  }


  function resetQ() { setAnswer(''); setTip(false); setFeedback(null); setError(null); setGrading(false) }


  // Quickfire 3-2-1 countdown screen
  if (isQuickFire && quickFireCountdown !== null) {
    return (
      <div style={{ minHeight:'100vh', background:`radial-gradient(circle at 50% 25%, rgba(${GENERAL.tealRgb},0.10), transparent 45%), ${GENERAL.neutral[0]}`, display:'flex', alignItems:'center', justifyContent:'center', color:GENERAL.softWhite }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontFamily:"'Outfit', sans-serif", color:GENERAL.slate, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', fontSize:'.72rem', marginBottom:24 }}>90 Second Quick Fire</div>
          <div key={quickFireCountdown} style={{ fontFamily:"'Sora', sans-serif", fontSize: quickFireCountdown === 'GO' ? '5rem' : '7.5rem', fontWeight:900, color: quickFireCountdown === 'GO' ? GENERAL.teal : GENERAL.softWhite, textShadow: quickFireCountdown === 'GO' ? `0 0 32px rgba(${GENERAL.tealRgb},0.4)` : '0 0 32px rgba(255,255,255,0.2)', animation:'examPop .8s ease both' }}>{quickFireCountdown}</div>
          <div style={{ color:GENERAL.slate, marginTop:20, fontFamily:"'Outfit', sans-serif", fontSize:'.88rem' }}>Answer as many as you can.</div>
          <style>{'@keyframes examPop { 0%{opacity:0;transform:scale(.7)} 50%{opacity:1;transform:scale(1.1)} 100%{opacity:1;transform:scale(1)} }'}</style>
        </div>
      </div>
    )
  }

  if (isExamMode && examPhase !== 'landing') {
    const currentExamQuestion = examQuestions[examIdx]
    const examAccuracy = examStats.answered ? Math.round((examStats.correct / examStats.answered) * 100) : 0

    if (examPhase === 'countdown') {
      return (
        <div style={{ minHeight:'100vh', background:'radial-gradient(circle at 50% 20%, rgba(157,92,255,.2), transparent 38%), #050817', display:'flex', alignItems:'center', justifyContent:'center', color:'#F5F7FB', padding:24 }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:"'Outfit', sans-serif", color:'#AAB4D4', fontWeight:800, letterSpacing:'.18em', textTransform:'uppercase', fontSize:'.72rem', marginBottom:20 }}>{examConfig?.title || 'Exam Mode'}</div>
            <div key={examCountdown} style={{ fontFamily:"'Sora', sans-serif", fontSize: examCountdown === 'GO' ? '5rem' : '7rem', fontWeight:950, color: examCountdown === 'GO' ? '#38F27B' : '#C18CFF', textShadow:'0 0 42px rgba(157,92,255,.72)', animation:'examPop .85s ease both' }}>{examCountdown}</div>
            <div style={{ color:'#7C8DB0', marginTop:18, fontFamily:"'Outfit', sans-serif" }}>Breathe. Read the command word first.</div>
            <style>{'@keyframes examPop { 0%{opacity:0;transform:scale(.72)} 45%{opacity:1;transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }'}</style>
          </div>
        </div>
      )
    }

    if (examPhase === 'round') {
      return (
        <div style={{ minHeight:'100vh', background:'#08090D', color:'#F5F7FB' }}>
          {/* Sticky timer bar */}
          <div style={{ position:'sticky', top:0, zIndex:50, background:'rgba(8,9,13,0.96)', backdropFilter:'blur(16px)', borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'12px 16px', display:'flex', alignItems:'center', gap:12, boxSizing:'border-box' }}>
            <BackButton onClick={() => setExamPhase('summary')} />
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.95rem', color:'#F4EFE6' }}>{examConfig?.title}</div>
              <div style={{ color:'#4B5563', fontSize:'.72rem' }}>{examQuestions.length} questions · scroll to answer all</div>
            </div>
            {examConfig?.isTimedPaper && (
              <div style={{ background:examTimeLeft < 60 ? 'rgba(255,93,115,.18)' : 'rgba(139,92,246,.18)', border:'1px solid '+(examTimeLeft<60?'rgba(255,93,115,.5)':'rgba(139,92,246,.4)'), borderRadius:999, color:examTimeLeft<60?'#FF5D73':'#C4B5FD', fontFamily:"'Sora', sans-serif", fontWeight:900, padding:'7px 14px', fontSize:'1rem', flexShrink:0 }}>{examTime}</div>
            )}
          </div>

          {/* Scrollable paper */}
          <div style={{ padding:'16px 16px 130px', maxWidth:660, margin:'0 auto' }}>
            {examQuestions.map((q, idx) => {
              const block = {
                questionText: q.q,
                marks: q.marks || 4,
                markPoints: q.ms ? [q.ms] : [],
                source: q.extract ? { label: q.sourceRefs?.length > 1 ? 'Sources A and B' : 'Source', text: q.extract } : null,
                commandWord: q.commandWord || null,
                topic: q.topic || q.topicLabel || null,
                paper: examConfig?.title || 'EXAM PRACTICE',
              }
              return (
                <div key={idx} style={{ marginBottom: 32 }}>
                  {/* Section header */}
                  {q.sectionHeader && (
                    <div style={{ marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ fontFamily:"'Sora', sans-serif", fontWeight: 800, fontSize: '1rem', color: '#F4EFE6', marginBottom: 4 }}>{q.sectionHeader}</div>
                      {q.sectionNote && <div style={{ fontFamily:"'Outfit', sans-serif", fontSize: '.78rem', color: '#6B7A9A' }}>{q.sectionNote}</div>}
                    </div>
                  )}
                  {/* Sources booklet — shown inline before the first question that carries them */}
                  {q.sourcesBooklet && q.sourcesBooklet.map((src, si) => (
                    <div key={si} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 20px', marginBottom: 14 }}>
                      <div style={{ fontFamily:"'Sora', sans-serif", fontWeight: 700, fontSize: '.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: '#C89B6D', marginBottom: 8 }}>{src.label}</div>
                      <div style={{ fontFamily:"'Outfit', sans-serif", fontSize: '.8rem', fontStyle: 'italic', color: 'rgba(245,245,245,0.48)', marginBottom: 10, lineHeight: 1.5 }}>{src.attribution}</div>
                      <div style={{ fontFamily:"'Outfit', sans-serif", fontSize: '.9rem', color: 'rgba(245,245,245,0.82)', lineHeight: 1.7, whiteSpace: 'pre-wrap', maxHeight: 240, overflowY: 'auto', WebkitOverflowScrolling: 'touch', paddingRight: 4 }}>{src.text}</div>
                      {src.credit && <div style={{ fontFamily:"'Outfit', sans-serif", fontSize: '.7rem', color: 'rgba(245,245,245,0.3)', marginTop: 10, fontStyle: 'italic' }}>{src.credit}</div>}
                    </div>
                  ))}
                  {/* Choice / SPaG note */}
                  {q.choiceHeader && (
                    <div style={{ background: 'rgba(157,92,255,0.08)', border: '1px solid rgba(157,92,255,0.2)', borderRadius: 12, padding: '12px 16px', marginBottom: 14 }}>
                      <div style={{ fontFamily:"'Outfit', sans-serif", fontWeight: 700, fontSize: '.8rem', color: '#C4B5FD' }}>{q.choiceHeader}</div>
                    </div>
                  )}
                  {q.spagNote && (
                    <div style={{ fontFamily:"'Outfit', sans-serif", fontSize: '.76rem', color: '#6B7A9A', fontStyle: 'italic', marginBottom: 10, paddingLeft: 4 }}>{q.spagNote}</div>
                  )}
                  <ExamQuestionFrame
                    block={block}
                    subject={q.subject || 'History'}
                    mode="exam"
                    questionNum={idx + 1}
                    onComplete={(result) => {
                      setExamPaperFeedbacks(prev => ({
                        ...prev,
                        [idx]: {
                          marksAwarded: result.marksAwarded,
                          marks: result.marks ?? q.marks ?? 4,
                          grade: 'Submitted',
                          subject: q.subject || 'History',
                          topic: q.topic || q.topicLabel || null,
                          questionText: result.questionText ?? q.q,
                          markScheme: result.markScheme ?? q.ms ?? '',
                          answer: result.answer ?? '',
                          summary: result.summary ?? '',
                          achieved: result.achieved ?? [],
                          missed: result.missed ?? [],
                          examinerTip: result.examinerTip ?? null,
                        }
                      }))
                    }}
                  />
                </div>
              )
            })}
            <button onClick={()=>setExamPhase('summary')} style={{ width:'100%', background:'linear-gradient(135deg,#7C3AED,#9D5CFF)', border:'none', borderRadius:16, padding:16, color:'#fff', fontWeight:800, fontSize:'1rem', cursor:'pointer', marginTop:8 }}>Submit Paper</button>
          </div>
        </div>
      )
    }

    if (examPhase === 'summary') {
      return (
        <div style={{ minHeight:'100vh', background:'#08090D', color:'#F5F7FB', padding:'28px 20px 120px' }}>
          <div style={{ maxWidth:520, margin:'0 auto', textAlign:'center' }}>
            <div style={{ width:150, height:150, borderRadius:'50%', margin:'0 auto 22px', background:'conic-gradient(#38F27B ' + examAccuracy + '%, #172845 0)', display:'grid', placeItems:'center' }}><div style={{ width:122, height:122, borderRadius:'50%', background:'#071126', display:'grid', placeItems:'center' }}><div><div style={{ fontFamily:"'Sora', sans-serif", fontSize:'2.4rem', fontWeight:950 }}>{examAccuracy}%</div><div style={{ color:'#AAB4D4', fontWeight:800 }}>{examStats.correct}/{examStats.answered || 0}</div></div></div></div>
            <h1 style={{ fontFamily:"'Sora', sans-serif", fontSize:'2rem', margin:'0 0 8px' }}>Exam round complete</h1>
            <p style={{ color:'#AAB4D4', margin:'0 0 22px' }}>Adaptive questions mixed stronger areas with weak zones.</p>
            <div style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:18, padding:18, marginBottom:20, textAlign:'left' }}>
              {Object.entries(examStats.bySubject).map(([subject, stats]) => <div key={subject} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,.06)' }}><span>{subject}</span><strong>{stats.correct}/{stats.answered}</strong></div>)}
            </div>
            {(() => {
              const debriefResults = examQuestions
                .map((q, idx) => {
                  const fb = examPaperFeedbacks[idx]
                  if (!fb) return null
                  return {
                    subject: fb.subject || q.subject || examConfig?.subject || 'History',
                    topic: fb.topic || q.topic || q.topicLabel || null,
                    question: fb.questionText || q.q,
                    marks: fb.marks ?? q.marks ?? 4,
                    markScheme: fb.markScheme || q.ms || '',
                    answer: fb.answer || '',
                    marksAwarded: fb.marksAwarded ?? 0,
                    achieved: fb.achieved || [],
                    missed: fb.missed || [],
                  }
                })
                .filter(Boolean)
              if (debriefResults.length === 0) return null
              return <ExamRoundDebrief subject={examConfig?.subject} results={debriefResults} />
            })()}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop: 20 }}>
              <button onClick={() => setExamPhase('landing')} style={{ background:'#151720', border:'1px solid #2A3552', borderRadius:13, padding:14, color:'#9CA8C7', fontWeight:800, cursor:'pointer' }}>Back</button>
              <button onClick={() => startExamRound(examConfig?.subject || 'Random')} style={{ background:'linear-gradient(135deg,#38F27B,#2DD4A3)', border:'none', borderRadius:13, padding:14, color:'#03140B', fontWeight:950, cursor:'pointer' }}>Try again</button>
            </div>
          </div>
        </div>
      )
    }

  }

  const EXAM_SUBJECTS = [
    { logo: '/headers/sociology-main.webp', label: 'Sociology', color: '#FF5C7A', completed: 7,  total: 10, action: isExamMode ? () => startExamRound('Sociology') : () => setSociologyOpen(true) },
    { logo: '/headers/history-main.webp',   label: 'History',   color: '#C89B6D', completed: 6,  total: 12, action: isExamMode ? () => startExamRound('History') : () => startTopic({ topicId: 'medieval', label: 'History', subject: 'History' }) },
    { logo: '/headers/bio-main.webp',        label: 'Biology',   color: '#4F8A5B', completed: 1,  total: 7,  action: isExamMode ? () => startExamRound('Biology')    : () => startTopic({ topicId: 'tb_cells', label: 'Biology', subject: 'Biology' }) },
    { logo: '/headers/chem-logo.webp',       label: 'Chemistry', color: '#9B59E8', completed: 0,  total: 15, action: isExamMode ? () => startExamRound('Chemistry')  : () => setChemistryOpen(true) },
    { logo: '/headers/maths-main.webp',      label: 'Maths',     color: '#2DD4BF', completed: 0,  total: 20, action: isExamMode ? () => startExamRound('Maths') : () => setMathsOpen(true) },
    { logo: '/headers/english-main.webp',    label: 'English',   color: '#B66DFF', completed: 0,  total: 15, action: isExamMode ? () => startExamRound('English') : () => setEnglishOpen(true) },
    { logo: '/headers/physics-main.webp',    label: 'Physics',   color: '#3B82F6', completed: 0,  total: 15, action: isExamMode ? () => startExamRound('Physics')  : () => {} },
  ]

  // ── Exams landing (cinematic redesign) ──────────────────────────────────
  if (isExamMode && examPhase === 'landing') {

    // ── Guided answer coach (full-screen overlay) ──
    if (activeCoachType) {
      const coachType = GUIDED_COACH_TYPES.find(t => t.id === activeCoachType)
      if (coachType) {
        return (
          <GuidedAnswerCoach
            coachType={coachType}
            onExit={(target) => {
              setActiveCoachType(null)
              if (target !== 'chooser') setExamTechniqueOpen(false)
            }}
          />
        )
      }
    }

    // ── Exam technique chooser ──
    if (examTechniqueOpen) {
      const suggestedTypeId = getSuggestedQuestionType('History')
      return (
        <div style={{ minHeight: '100vh', background: GENERAL.neutral[0], paddingBottom: 110, boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 430, margin: '0 auto', padding: `0 ${SPACING.compact}px` }}>

            <div style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)', paddingBottom: SPACING.compact }}>
              <BackButton onClick={() => setExamTechniqueOpen(false)} />
            </div>

            <div style={{ ...TYPE.cinematic, fontSize: 32, color: GENERAL.softWhite, marginBottom: 6 }}>
              Nail exam technique<span style={{ color: GENERAL.teal }}>.</span>
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: GENERAL.slate, lineHeight: 1.5, marginBottom: SPACING.standard }}>
              Pick a question type and learn exactly what the examiner wants.
            </div>

            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: SPACING.standard, scrollbarWidth: 'none' }}>
              {EXAM_SUBJECTS.map((subj, i) => {
                const isHistory = subj.label === 'History'
                return (
                  <div key={i} style={{
                    flexShrink: 0, whiteSpace: 'nowrap', padding: '8px 14px', borderRadius: RADII.pill,
                    fontFamily: "'Sora', sans-serif", fontSize: 12.5, fontWeight: 600,
                    background: isHistory ? 'rgba(200,155,109,0.14)' : GENERAL.neutral[1],
                    border: isHistory ? '1px solid #C89B6D' : '1px solid rgba(255,255,255,0.06)',
                    color: isHistory ? '#C89B6D' : 'rgba(168,176,178,0.45)',
                  }}>
                    {subj.label}
                    {!isHistory && (
                      <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(168,176,178,0.35)' }}>
                        Soon
                      </span>
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {GUIDED_COACH_TYPES.map(coachType => (
                <button key={coachType.id} onClick={() => setActiveCoachType(coachType.id)} style={{
                  position: 'relative',
                  display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                  padding: '14px 16px', cursor: 'pointer', borderRadius: RADII.large,
                  background: GENERAL.neutral[1], border: '1px solid rgba(255,255,255,0.06)',
                  borderLeft: `2px solid ${coachType.accent}`,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: coachType.accent, marginBottom: 4 }}>
                      {coachType.marksLabel}
                    </div>
                    <div style={{ ...TYPE.cinematic, fontSize: 18, color: GENERAL.softWhite, marginBottom: 4 }}>{coachType.title}</div>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 12.5, lineHeight: 1.45, color: GENERAL.slate }}>{coachType.shortDesc}</div>
                  </div>
                  <NavArrow color={coachType.accent} />
                  {coachType.id === suggestedTypeId && (
                    <div style={{
                      position: 'absolute', top: 10, right: 12,
                      fontFamily: "'Sora', sans-serif", fontSize: 9, fontWeight: 700,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: GENERAL.teal, background: 'rgba(42,157,143,0.12)',
                      border: '1px solid rgba(42,157,143,0.3)', borderRadius: RADII.pill,
                      padding: '3px 8px',
                    }}>
                      Suggested
                    </div>
                  )}
                </button>
              ))}
            </div>

          </div>
        </div>
      )
    }

    // ── Paper chooser ──
    if (paperChooserOpen) {
      return (
        <div style={{ minHeight: '100vh', background: GENERAL.neutral[0], paddingBottom: 110, boxSizing: 'border-box' }}>
          <div style={{ maxWidth: 430, margin: '0 auto', padding: `0 ${SPACING.compact}px` }}>

            <div style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 14px)', paddingBottom: SPACING.compact }}>
              <BackButton onClick={() => setPaperChooserOpen(false)} />
            </div>

            <div style={{ ...TYPE.cinematic, fontSize: 32, color: GENERAL.softWhite, marginBottom: 6 }}>
              Sit a full paper<span style={{ color: GENERAL.teal }}>.</span>
            </div>
            <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: GENERAL.slate, lineHeight: 1.5, marginBottom: SPACING.standard }}>
              Real timings, real conditions — pick a full paper or practise by subject.
            </div>

            <div style={{
              fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 10,
            }}>
              Real exam papers
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: SPACING.standard }}>
              {/* Edexcel History Paper 1 — June 2023 */}
              <button onClick={() => { setPaperChooserOpen(false); startMedicinePaper2023() }} style={{
                display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                padding: '14px 16px', cursor: 'pointer', borderRadius: RADII.large,
                background: GENERAL.neutral[1], border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: '2px solid #C89B6D',
              }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', flexShrink: 0, border: '1.5px solid #C89B6D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C89B6D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C89B6D', marginBottom: 4 }}>Timed</div>
                  <div style={{ ...TYPE.cinematic, fontSize: 18, color: GENERAL.softWhite, marginBottom: 4 }}>Edexcel history paper 1 — June 2023</div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 12.5, lineHeight: 1.45, color: GENERAL.slate }}>1HI0/11 · 52 marks · 75 min · medicine in Britain & Western Front</div>
                </div>
                <NavArrow color="#C89B6D" />
              </button>

              {/* Generic timed practice */}
              <button onClick={() => { setPaperChooserOpen(false); startExamRound('Random', { isTimedPaper: true }) }} style={{
                display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                padding: '14px 16px', cursor: 'pointer', borderRadius: RADII.large,
                background: GENERAL.neutral[1], border: '1px solid rgba(255,255,255,0.06)',
                borderLeft: `2px solid ${GENERAL.teal}`,
              }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', flexShrink: 0, border: `1.5px solid ${GENERAL.teal}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GENERAL.teal} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5" /><path d="M9 1h6" /></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: GENERAL.teal, marginBottom: 4 }}>Timed</div>
                  <div style={{ ...TYPE.cinematic, fontSize: 18, color: GENERAL.softWhite, marginBottom: 4 }}>Timed mixed practice</div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 12.5, lineHeight: 1.45, color: GENERAL.slate }}>10 questions · 10 min · all subjects</div>
                </div>
                <NavArrow color={GENERAL.teal} />
              </button>
            </div>

            <div style={{
              fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase', color: GENERAL.slate, marginBottom: 10,
            }}>
              By subject
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {EXAM_SUBJECTS.map((subj, i) => (
                <button key={i} onClick={() => { setPaperChooserOpen(false); subj.action() }} style={{
                  position: 'relative', height: 112, borderRadius: RADII.medium, overflow: 'hidden',
                  border: `1px solid ${subj.color}28`, cursor: 'pointer', padding: 0,
                  background: GENERAL.neutral[1],
                  boxShadow: '0 4px 16px rgba(0,0,0,0.45)',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${subj.logo})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'saturate(0.75) brightness(0.72)',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(5,7,11,0.10) 0%, rgba(5,7,11,0.72) 58%, rgba(5,7,11,0.96) 100%)',
                  }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 10px 10px', textAlign: 'left' }}>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14, color: '#F5F7FF', lineHeight: '18px', letterSpacing: '-0.01em' }}>{subj.label}</div>
                  </div>
                  <div style={{ position: 'absolute', top: 9, left: 9, width: 6, height: 6, borderRadius: '50%', background: subj.color, boxShadow: `0 0 8px ${subj.color}` }} />
                </button>
              ))}
            </div>

          </div>
        </div>
      )
    }

    // ── Landing ──
    const examWeekStats = (() => {
      try {
        const scores = JSON.parse(localStorage.getItem('gcse_scores') || '[]')
        const d = new Date(); d.setDate(d.getDate() - 7)
        const cutoff = d.toISOString().slice(0, 10)
        const week = scores.filter(s => s.source === 'exam' && s.date > cutoff)
        if (!week.length) return null
        return { count: week.length, avgPct: Math.round(week.reduce((sum, s) => sum + s.pct, 0) / week.length) }
      } catch { return null }
    })()

    const EXAM_MODE_CARDS = [
      {
        id: 'weak', accent: GENERAL.teal, kicker: 'Start', title: 'Practice a weak spot',
        lines: ['Adaptive questions based on', "where you're struggling most."],
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="8.5" stroke={GENERAL.teal} strokeWidth="1.5" />
            <circle cx="12" cy="12" r="3" fill={GENERAL.teal} />
          </svg>
        ),
        onClick: () => startExamRound('Random', { title: 'Weak spot practice' }),
      },
      {
        id: 'technique', accent: PULSE_GOLD, kicker: 'Coach', title: 'Nail exam technique',
        lines: ['Learn exactly how top answers are built', 'before writing your own.'],
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PULSE_GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        ),
        onClick: () => setExamTechniqueOpen(true),
      },
      {
        id: 'paper', accent: GENERAL.coral, kicker: 'Challenge', title: 'Sit a full paper',
        lines: ['Real timings. Real conditions.', 'No hints.'],
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={GENERAL.coral} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 2.5" />
            <path d="M9 1h6" />
          </svg>
        ),
        onClick: () => setPaperChooserOpen(true),
      },
    ]

    return (
      <div style={{ minHeight: '100vh', background: GENERAL.neutral[0], paddingBottom: 110, overflowX: 'hidden' }}>

        {/* ── Hero ── */}
        <div style={{ position: 'relative', width: '100%', height: '34vh', minHeight: 260, maxHeight: 340, overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/headers/exam-summit.png)',
            backgroundSize: 'cover', backgroundPosition: 'center 30%',
            filter: 'saturate(0.9)',
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, rgba(13,15,16,0.5) 0%, rgba(13,15,16,0.1) 28%, rgba(13,15,16,0.25) 58%, ${GENERAL.neutral[0]} 100%)`,
          }} />

          {/* Top row — streak */}
          <div style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 14px)', right: SPACING.compact, zIndex: 2 }}>
            <StreakChip />
          </div>

          {/* Headline */}
          <div style={{ position: 'absolute', left: SPACING.compact, right: SPACING.compact, bottom: SPACING.standard, zIndex: 2 }}>
            <div style={{ ...TYPE.cinematic, fontSize: 46, color: GENERAL.softWhite }}>
              Exams<span style={{ color: GENERAL.teal }}>.</span>
            </div>
            <div style={{
              marginTop: 10, fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600,
              letterSpacing: '0.22em', textTransform: 'uppercase', color: GENERAL.teal,
            }}>
              Practise like it's the real thing.
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 430, margin: '0 auto', padding: `0 ${SPACING.compact}px` }}>

          {/* Section label */}
          <div style={{
            marginTop: SPACING.compact + 4, marginBottom: 10,
            fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 600,
            letterSpacing: '0.18em', textTransform: 'uppercase', color: GENERAL.slate,
          }}>
            Choose your next step.
          </div>

          {/* Mode cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {EXAM_MODE_CARDS.map(card => (
              <button key={card.id} onClick={card.onClick} disabled={card.disabled} style={{
                display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
                padding: '14px 16px', cursor: card.disabled ? 'default' : 'pointer',
                borderRadius: RADII.large, background: GENERAL.neutral[1],
                border: '1px solid rgba(255,255,255,0.06)', borderLeft: `2px solid ${card.accent}`,
                opacity: card.disabled ? 0.55 : 1,
              }}>
                <div style={{
                  width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                  border: `1.5px solid ${card.accent}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {card.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Sora', sans-serif", fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.2em', textTransform: 'uppercase', color: card.accent, marginBottom: 4,
                  }}>
                    {card.kicker}
                  </div>
                  <div style={{ ...TYPE.cinematic, fontSize: 22, color: GENERAL.softWhite, marginBottom: 4 }}>
                    {card.title}
                  </div>
                  {card.lines.map((line, i) => (
                    <div key={i} style={{ fontFamily: "'Sora', sans-serif", fontSize: 12.5, lineHeight: 1.45, color: GENERAL.slate }}>
                      {line}
                    </div>
                  ))}
                </div>
                {!card.disabled && (
                  <NavArrow color={card.accent} />
                )}
              </button>
            ))}
          </div>

          {/* Progress stat card */}
          {examWeekStats ? (
            <button onClick={onOpenPulse} style={{
              display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left',
              marginTop: SPACING.standard, padding: '14px 16px', cursor: 'pointer',
              borderRadius: RADII.large, background: GENERAL.neutral[1],
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                background: `conic-gradient(${GENERAL.teal} ${examWeekStats.avgPct}%, ${GENERAL.neutral[2]} 0)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', background: GENERAL.neutral[1],
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Sora', sans-serif", fontSize: 11, fontWeight: 700, color: GENERAL.softWhite,
                }}>
                  {examWeekStats.avgPct}%
                </div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 13, color: GENERAL.softWhite, lineHeight: 1.4, marginBottom: 4 }}>
                  You've answered {examWeekStats.count} exam question{examWeekStats.count === 1 ? '' : 's'} this week.
                </div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 12, fontWeight: 600, color: GENERAL.teal }}>
                  View your progress →
                </div>
              </div>
            </button>
          ) : (
            <div style={{
              marginTop: SPACING.standard, padding: '14px 16px',
              borderRadius: RADII.large, background: GENERAL.neutral[1],
              border: '1px solid rgba(255,255,255,0.06)',
              fontFamily: "'Sora', sans-serif", fontSize: 13, color: GENERAL.slate, lineHeight: 1.5,
            }}>
              Sit your first paper to start tracking progress.
            </div>
          )}

        </div>
      </div>
    )
  }

  if (mathsOpen)   return <MathsBrowser   onBack={() => setMathsOpen(false)} />
  if (englishOpen)   return <EnglishBrowser   onBack={() => setEnglishOpen(false)} />
  if (sociologyOpen)  return <SociologyBrowser  onBack={() => setSociologyOpen(false)} />
  if (chemistryOpen) return <ChemistryBrowser onBack={() => setChemistryOpen(false)} />

  const GRADE_STYLE = {
    'Excellent':  { bg:`rgba(${GENERAL.tealRgb},.10)`,  border:`rgba(${GENERAL.tealRgb},.35)`,  text:GENERAL.teal, badge:GENERAL.teal },
    'Good':       { bg:`rgba(${GENERAL.tealRgb},.06)`,  border:`rgba(${GENERAL.tealRgb},.22)`,  text:GENERAL.teal, badge:GENERAL.teal },
    'Developing': { bg:`rgba(${hexToRgb(PULSE_GOLD)},.08)`,  border:`rgba(${hexToRgb(PULSE_GOLD)},.3)`,  text:PULSE_GOLD, badge:PULSE_GOLD },
    'Needs Work': { bg:`rgba(${GENERAL.coralRgb},.08)`,  border:`rgba(${GENERAL.coralRgb},.3)`,  text:GENERAL.coral, badge:GENERAL.coral },
  }
  const MARK_TIPS = {
    1:'One clear specific point.',
    2:'Two separate points, or one point plus a reason.',
    3:'Show all working — each step can earn a mark.',
    4:'Two developed points with explanation.',
    6:'Level of response — link facts, not just list them.',
    12:'Three or four developed paragraphs with specific evidence.',
    16:'Argue both sides then reach a clear judgement with evidence.',
  }

  async function gradeAnswer(q) {
    if (answer.trim().length < 3) { setError('Write a bit more before submitting.'); return }
    setGrading(true); setError(null)
    try {
      const d = await gradeWithAI(q.q, answer, q.marks, q.ms)
      setFeedback(d)
    } catch { setError('Could not grade right now. Check your connection.') }
    finally { setGrading(false) }
  }

  function nextQuestion(total) {
    if (qIdx < total - 1) { setQIdx(qIdx+1); resetQ() }
    else { setSelected(null); setQIdx(0); resetQ() }
  }

  function fullResetQ() {
    resetQ()
    setTqMcAttempts(0); setTqMcHint(false); setTqMcLocked(false)
  }

  function startTopic(selection) {
    setSelected(selection)
    setQIdx(0)
    fullResetQ()
    if (isQuickFire) {
      setQuickFireTimeLeft(QUICK_FIRE_SECONDS)
      setQuickFireActive(false)
      setQuickFireFinished(false)
      setQuickFireStats(emptyQuickFireStats())
      setQuickFireQuestionSet(prioritizedQuickFireQuestions())
      setQuickFireSummary(null)
      setQuickFireCountdown(3)
      setQfConsecutiveWrong(0)
    }
  }

  function finishQuickFireRound(reason = 'exit') {
    setQuickFireActive(false)
    setQuickFireFinished(true)
    const memory = saveQuickFireMemory(quickFireStats)
    const accuracy = quickFireStats.answered ? Math.round((quickFireStats.correct / quickFireStats.answered) * 100) : 0
    const prevSession = readQfPrevSession()
    if (quickFireStats.answered > 0) {
      saveQfPrevSession(accuracy, quickFireStats.answered)
      saveQfBestIfBeaten(quickFireStats.correct, quickFireStats.answered)
    }
    setQuickFireSummary({
      reason,
      answered: quickFireStats.answered,
      correct: quickFireStats.correct,
      timeUsed: QUICK_FIRE_SECONDS - quickFireTimeLeft,
      timeLeft: quickFireTimeLeft,
      subjects: rankedQuickFireSubjects(memory, quickFireStats),
      recommendation: pickQuickFireRecommendation(memory, quickFireStats),
      prevAccuracy: (prevSession?.answered >= 3) ? prevSession.accuracy : null,
    })
  }

  function exitTestTopic() {
    setSelected(null)
    setQIdx(0)
    fullResetQ()
    setQuickFireActive(false)
    setQuickFireFinished(false)
    setQuickFireTimeLeft(QUICK_FIRE_SECONDS)
    setQuickFireSummary(null)
    setQuickFireCountdown(null)
  }

  function startRandomQuestion() {
    if (isQuickFire) {
      startTopic({ topicId: 'quickfire', label: '90s Quick Fire', subject: 'Quick Fire' })
      return
    }
    if (isExamMode) {
      startExamRound('Random')
      return
    }
    const allT = TEST_TOPICS.filter(s => s.topics.some(t => t.available))
    const rs = allT[Math.floor(Math.random() * allT.length)]
    const av = rs.topics.filter(t => t.available)
    const rt = av[Math.floor(Math.random() * av.length)]
    startTopic({ topicId: rt.id, label: rt.label, subject: rs.subject })
  }

  function tqNextQuestion(total) {
    if (qIdx < total - 1) { setQIdx(qIdx+1); fullResetQ() }
    else if (isQuickFire) { finishQuickFireRound('complete') }
    else { exitTestTopic() }
  }

  function handleTqCheck(q) {
    if (q.type === 'mc') {
      if (!answer) { setError('Pick an option first.'); return }
      const isCorrect = answer === q.options[q.correct]
      const newAttempts = tqMcAttempts + 1
      setTqMcAttempts(newAttempts)
      if (isCorrect) {
        setTqMcLocked(true)
        setFeedback({ marksAwarded: q.marks, marksAvailable: q.marks, grade: 'Excellent',
          summary: "That's the one. Well done for getting it.", achieved: ['Correct answer selected'], missed: [], examinerTip: '' })
        recordScore({ subject: selected.subject, earned: q.marks, possible: q.marks, source: 'test' })
      } else if (newAttempts === 1) {
        setTqMcHint(true)
        setAnswer('')
        setError('')
      } else {
        setTqMcLocked(true)
        const correctText = q.options[q.correct] || ''
        setFeedback({ marksAwarded: 0, marksAvailable: q.marks, grade: 'Needs Work',
          summary: 'The correct answer was: ' + correctText + '. Read the explanation below and it will stick next time.',
          achieved: [], missed: [q.ms || ''], examinerTip: "Go back to this topic — one question doesn't define you." })
        recordScore({ subject: selected.subject, earned: 0, possible: q.marks, source: 'test' })
      }
      return
    }
    gradeAnswer(q)
  }

  if (quickFireSummary) {
    const accuracy = quickFireSummary.answered ? Math.round((quickFireSummary.correct / quickFireSummary.answered) * 100) : 0
    const summarySubjects = quickFireSummary.subjects?.length
      ? quickFireSummary.subjects
      : rankedQuickFireSubjects(readQuickFireMemory(), emptyQuickFireStats())
    const recommendation = quickFireSummary.recommendation || pickQuickFireRecommendation(readQuickFireMemory(), emptyQuickFireStats())
    const recommendedModule = recommendation?.moduleId ? MODULES.find(m => m.id === recommendation.moduleId) : null
    const recommendationMeta = QUICK_FIRE_SUBJECT_META[recommendation?.subject] || QUICK_FIRE_SUBJECT_META.Biology
    const prevAcc = quickFireSummary.prevAccuracy
    const improvement = (prevAcc !== null && quickFireSummary.answered >= 3) ? accuracy - prevAcc : null
    const improvementText = improvement === null ? null
      : improvement > 0 ? `+${improvement}% better than last time`
      : improvement < 0 ? `${Math.abs(improvement)}% lower than last time`
      : 'Same as last time'
    const improvementColor = improvement > 0 ? GENERAL.teal : improvement < 0 ? GENERAL.coral : GENERAL.slate
    const headlineText = improvement !== null && improvement > 0
      ? `${improvement}% improvement`
      : accuracy >= 60 ? 'Great work!' : 'Keep going!'

    const gapModules = Object.entries(getQuizWeaknesses())
      .map(([key, v]) => {
        const t = v.c + v.i
        return { key, tag: key.split('/')[1], total: t, rate: t > 0 ? v.i / t : 0 }
      })
      .filter(x => x.total >= 2 && x.rate > 0.4)
      .sort((a, b) => b.rate - a.rate)
      .reduce((acc, w) => {
        const modId = TAG_MODULE_MAP[w.tag]
        if (!modId) return acc
        const mod = MODULES.find(m => m.id === modId)
        if (!mod || acc.some(a => a.mod.id === modId)) return acc
        acc.push({ mod, tag: w.tag, rate: w.rate })
        return acc
      }, [])
      .slice(0, 3)

    return (
      <div style={{ background:`radial-gradient(circle at 50% -10%, rgba(${GENERAL.tealRgb},.08), transparent 42%), ${GENERAL.neutral[0]}`, minHeight:'100vh', padding:'18px 20px calc(150px + env(safe-area-inset-bottom))', color:GENERAL.softWhite }}>
        <div style={{ maxWidth:480, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <BackButton onClick={exitTestTopic} />
            <button aria-label="Share" style={{ width:42, height:42, borderRadius:'50%', border:'none', background:'rgba(255,255,255,0.06)', color:GENERAL.softWhite, fontSize:'1rem', cursor:'pointer' }}>⇧</button>
          </div>

          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{
              width:168, height:168, borderRadius:'50%', margin:'0 auto 18px',
              background:`conic-gradient(${GENERAL.teal} ` + accuracy + `%, ${GENERAL.neutral[2]} 0)`,
              display:'grid', placeItems:'center',
            }}>
              <div style={{ width:142, height:142, borderRadius:'50%', background:GENERAL.neutral[1], display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <div style={{ fontFamily:"'Sora', sans-serif", fontSize:'2.65rem', fontWeight:900, lineHeight:1 }}>{accuracy}%</div>
                <div style={{ color:GENERAL.slate, fontSize:'.9rem', fontWeight:700, marginTop:5 }}>{quickFireSummary.correct} / {quickFireSummary.answered || 0}</div>
                <div style={{ color:GENERAL.teal, fontSize:'.86rem', fontWeight:900, marginTop:4 }}>Correct</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:9 }}>
              <h1 style={{ fontFamily:"'Sora', sans-serif", fontSize:'2.1rem', lineHeight:1.05, margin:0, color:GENERAL.softWhite }}>{headlineText}</h1>
              {improvement > 0 && <span style={{ color:GENERAL.teal, fontSize:'1.45rem' }}>↑</span>}
            </div>
            {improvementText && (
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background: improvement > 0 ? `rgba(${GENERAL.tealRgb},.12)` : improvement < 0 ? `rgba(${GENERAL.coralRgb},.10)` : 'rgba(255,255,255,.06)', border:'1px solid ' + (improvement > 0 ? `rgba(${GENERAL.tealRgb},.35)` : improvement < 0 ? `rgba(${GENERAL.coralRgb},.3)` : 'rgba(255,255,255,.1)'), borderRadius:999, padding:'6px 14px', marginTop:10 }}>
                <span style={{ color:improvementColor, fontFamily:"'Sora', sans-serif", fontWeight:800, fontSize:'.9rem' }}>{improvementText}</span>
              </div>
            )}
            {!improvementText && (
              <p style={{ color:GENERAL.slate, fontSize:'.96rem', margin:'10px 0 0', lineHeight:1.45 }}>{accuracy >= 80 ? 'Excellent recall.' : accuracy >= 60 ? 'Strong session.' : 'Good start — now sharpen the weak spots.'}</p>
            )}
          </div>

          <div style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:'18px 18px 14px', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:800, fontSize:'1rem' }}>Performance by subject</div>
              <button onClick={exitTestTopic} style={{ border:'none', background:'transparent', color:GENERAL.slate, fontSize:'.8rem', cursor:'pointer' }}>View all ›</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {summarySubjects.slice(0, 5).map(item => (
                <div key={item.subject} style={{ display:'grid', gridTemplateColumns:'40px 1fr 54px 48px', alignItems:'center', gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:'50%', overflow:'hidden', flexShrink:0 }}>
                    {item.logo
                      ? <img src={item.logo} alt={item.subject} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <div style={{ width:'100%', height:'100%', background:`rgba(${GENERAL.tealRgb},0.12)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.12rem', color:GENERAL.teal }}>{item.icon}</div>
                    }
                  </div>
                  <div>
                    <div style={{ color:GENERAL.softWhite, fontWeight:850, fontSize:'.86rem', marginBottom:7 }}>{item.subject}</div>
                    <div style={{ height:5, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden' }}>
                      <div style={{ width:item.accuracy + '%', height:'100%', borderRadius:99, background:GENERAL.teal }} />
                    </div>
                  </div>
                  <div style={{ color:GENERAL.slate, fontWeight:800, fontSize:'.86rem', textAlign:'right' }}>{item.correct} / {item.answered}</div>
                  <div style={{ justifySelf:'end', color:GENERAL.slate, background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.10)', borderRadius:8, padding:'4px 7px', fontWeight:900, fontSize:'.76rem' }}>{item.accuracy}%</div>
                </div>
              ))}
            </div>
          </div>

          {gapModules.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:11 }}>
                <span style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:GENERAL.slate }}>
                  {gapModules.length === 1 ? 'Your biggest gap' : 'Your biggest gaps'}
                </span>
              </div>
              {gapModules.map(({ mod, tag }) => {
                const screenIdx = findTaggedScreen(mod, tag)
                return (
                  <button
                    key={mod.id}
                    onClick={() => onOpenModule && onOpenModule(mod, screenIdx)}
                    style={{ width:'100%', textAlign:'left', marginBottom:10, background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'center', gap:13, cursor:'pointer' }}
                  >
                    <div style={{ width:44, height:44, borderRadius:12, flexShrink:0, background:`rgba(${GENERAL.tealRgb},0.10)`, border:`1px solid rgba(${GENERAL.tealRgb},0.25)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem' }}>
                      {mod.icon || '📚'}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'.87rem', fontWeight:700, color:GENERAL.softWhite, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {mod.title}
                      </div>
                      <div style={{ fontSize:'.72rem', color:GENERAL.teal, textTransform:'capitalize' }}>
                        {tag.replace(/-/g, ' ')}
                      </div>
                    </div>
                    <span style={{ color:GENERAL.slate, fontSize:'1rem', flexShrink:0 }}>›</span>
                  </button>
                )
              })}
            </div>
          )}

          <button onClick={() => recommendedModule && onOpenModule ? onOpenModule(recommendedModule) : exitTestTopic()} style={{ width:'100%', background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:18, padding:'18px', marginBottom:20, display:'flex', alignItems:'center', gap:16, textAlign:'left', cursor:'pointer' }}>
            <div style={{ width:54, height:54, borderRadius:'50%', overflow:'hidden', flexShrink:0 }}>
              {recommendationMeta.logo
                ? <img src={recommendationMeta.logo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <div style={{ width:'100%', height:'100%', background:`rgba(${GENERAL.tealRgb},0.12)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', color:GENERAL.teal }}>{recommendationMeta.icon}</div>
              }
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <div style={{ fontFamily:"'Sora', sans-serif", color:GENERAL.softWhite, fontWeight:850, fontSize:'1rem' }}>Recommended next</div>
                <span style={{ background:`rgba(${GENERAL.coralRgb},.14)`, color:GENERAL.coral, borderRadius:999, padding:'5px 10px', fontSize:'.7rem', fontWeight:900 }}>Priority</span>
              </div>
              <div style={{ color:GENERAL.softWhite, fontWeight:850, fontSize:'.95rem' }}>{recommendation.subject} – {recommendation.topic}</div>
              <div style={{ color:GENERAL.slate, fontSize:'.84rem', marginTop:4, lineHeight:1.35 }}>You struggled with questions and keywords here. {recommendedModule ? 'Open the module to strengthen it.' : 'Focus your next quick practice here.'}</div>
            </div>
            <span style={{ color:GENERAL.slate, fontSize:'1.6rem' }}>›</span>
          </button>

          <button onClick={startRandomQuestion} style={{ width:'100%', border:'none', borderRadius:17, background:GENERAL.teal, color:GENERAL.neutral[0], padding:'20px 22px', display:'flex', alignItems:'center', gap:18, cursor:'pointer', marginBottom:18 }}>
            <span style={{ fontSize:'2rem', lineHeight:1 }}>↻</span>
            <span style={{ textAlign:'left' }}>
              <span style={{ display:'block', fontFamily:"'Sora', sans-serif", fontSize:'1.25rem', fontWeight:950, letterSpacing:'.02em' }}>Try again</span>
              <span style={{ display:'block', fontSize:'.86rem', fontWeight:750, marginTop:3 }}>Focus on {recommendation.subject} & {recommendation.topic} · ~3 mins</span>
            </span>
          </button>
        </div>
      </div>
    )
  }

  if (selected) {
    const questions = isQuickFire ? quickFireQuestionSet : (PAST_PAPER_QS[selected.topicId] || [])

    if (isQuickFire) {
      const qfQ = questions[qIdx] ? { type: 'mc', marks: 1, ...questions[qIdx] } : null
      return (
        <QuickFireQuestionScreen
          key={qIdx}
          q={qfQ}
          timeLeft={quickFireTimeLeft}
          totalSeconds={QUICK_FIRE_SECONDS}
          onExit={() => finishQuickFireRound('exit')}
          onAnswer={(isCorrect) => {
            setQuickFireStats(stats => addQuickFireAnswer(stats, qfQ, isCorrect))
            updateQfQuestionHistory(qfQ, isCorrect)
            if (qfQ.type === 'truefalse') {
              const log = isCorrect ? logCorrectAnswer : logWrongAnswer
              log({
                subject: qfQ.subject,
                topic: qfQ.topic,
                questionText: qfQ.q,
                source: 'quiz',
                questionType: 'truefalse',
              })
            }
            recordScore({ subject: selected.subject, earned: isCorrect ? qfQ.marks : 0, possible: qfQ.marks, source: 'test' })
            if (isCorrect) {
              setQfConsecutiveWrong(0)
            } else {
              const newConsecutive = qfConsecutiveWrong + 1
              setQfConsecutiveWrong(newConsecutive)
              if (newConsecutive >= 3) {
                setQfConsecutiveWrong(0)
                const revisitCandidate = quickFireQuestionSet.slice(qIdx + 2).find(qItem => wasQfPrevWrong(qItem))
                if (revisitCandidate) {
                  setQuickFireQuestionSet(prev => {
                    const next = [...prev]
                    next.splice(qIdx + 1, 0, { ...revisitCandidate, _retryPrevWrong: true })
                    return next
                  })
                }
              }
            }
          }}
          onAdvance={() => tqNextQuestion(questions.length)}
        />
      )
    }

    const q = questions[qIdx]
    const gs = feedback ? (GRADE_STYLE[feedback.grade] || GRADE_STYLE['Developing']) : null
    const isMC = q?.type === 'mc'
    return (
      <div style={{ background:GENERAL.neutral[0], minHeight:'100vh', paddingBottom:90 }}>
        <div style={{ background:`rgba(${hexToRgb(GENERAL.neutral[0])},0.96)`, borderBottom:'1px solid rgba(255,255,255,0.06)', padding:'12px 16px', position:'sticky', top:0, zIndex:10, backdropFilter:'blur(12px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, maxWidth:660, margin:'0 auto' }}>
            <BackButton onClick={exitTestTopic} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.9rem', color:GENERAL.softWhite, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{selected.label}</div>
              <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.7rem', color:GENERAL.slate }}>Question {qIdx+1} of {questions.length}</div>
            </div>
          </div>
          <div style={{ height:3, background:'rgba(255,255,255,0.08)', borderRadius:99, overflow:'hidden', marginTop:10, maxWidth:660, margin:'10px auto 0' }}>
            <div style={{ height:'100%', width:`${((qIdx+1)/questions.length)*100}%`, background:'rgba(241,250,238,0.30)', borderRadius:99, transition:'width .3s' }} />
          </div>
        </div>
        <div style={{ maxWidth:660, margin:'0 auto', padding:'16px 16px' }}>
          {q && <>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:`rgba(${GENERAL.tealRgb},.10)`, border:`1px solid rgba(${GENERAL.tealRgb},.25)`, borderRadius:99, padding:'4px 12px', marginBottom:14 }}>
              <span style={{ fontFamily:"'Sora', sans-serif", fontSize:'.75rem', fontWeight:700, color:GENERAL.teal }}>[{q.marks} mark{q.marks!==1?'s':''}]</span>
            </div>
            {q.fig && FIGURES[q.fig] && (
              <div style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'12px', marginBottom:14, textAlign:'center' }}>
                <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:GENERAL.slate, marginBottom:8 }}>Figure — from AQA past paper</div>
                <img src={FIGURES[q.fig]} alt="AQA exam figure" style={{ maxWidth:'100%', height:'auto', borderRadius:8 }} />
              </div>
            )}
            <div style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'16px', marginBottom:14 }}>
              <pre style={{ fontFamily:"'Outfit', sans-serif", fontSize:'1rem', lineHeight:1.65, margin:0, color:GENERAL.softWhite, whiteSpace:'pre-wrap', wordBreak:'break-word' }}>{cleanQuestionText(q)}</pre>
            </div>
            {!showTip
              ? <button onClick={() => setTip(true)} style={{ background:'none', border:`1px dashed ${GENERAL.coral}`, borderRadius:10, padding:'9px 14px', cursor:'pointer', color:GENERAL.coral, fontSize:'.82rem', fontFamily:"'Outfit', sans-serif", width:'100%', marginBottom:14, fontWeight:600 }}>Show mark tip</button>
              : <div style={{ background:`rgba(${GENERAL.tealRgb},.06)`, border:`1px solid rgba(${GENERAL.tealRgb},.2)`, borderRadius:10, padding:'11px 14px', marginBottom:14 }}>
                  <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.68rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:GENERAL.teal, marginBottom:5 }}>{q.marks}-mark question</div>
                  <p style={{ fontFamily:"'Outfit', sans-serif", margin:0, fontSize:'.85rem', color:GENERAL.slate }}>{MARK_TIPS[q.marks] || MARK_TIPS[3]}</p>
                </div>
            }
            {!feedback && !tqMcLocked && (
              isMC
                ? <div style={{ marginBottom:14 }}>
                    {/* Hint card after first wrong MC */}
                    {tqMcHint && (
                      <div style={{ background:`rgba(${GENERAL.tealRgb},.06)`, border:`1px solid rgba(${GENERAL.tealRgb},.28)`, borderRadius:14, padding:'14px 16px', marginBottom:12 }}>
                        <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.63rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:GENERAL.teal, marginBottom:8 }}>Have another look</div>
                        <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.88rem', color:GENERAL.slate, margin:'0 0 4px', lineHeight:1.55 }}>
                          {q.hint || (q.ms ? q.ms.split('.')[0] + '.' : 'Think carefully — what is the question specifically asking about?')}
                        </p>
                        <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.78rem', color:GENERAL.teal, margin:0, fontStyle:'italic' }}>
                          You have one more try — you can get this.
                        </p>
                      </div>
                    )}
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {q.options.map((opt,i) => (
                        <button key={i} onClick={() => setAnswer(opt)} style={{ background:answer===opt?`rgba(${GENERAL.tealRgb},.10)`:GENERAL.neutral[1], border:`1.5px solid ${answer===opt?GENERAL.teal:'rgba(255,255,255,0.08)'}`, borderRadius:12, padding:'13px 16px', cursor:'pointer', textAlign:'left', fontFamily:"'Outfit', sans-serif", fontSize:'.93rem', color:answer===opt?GENERAL.teal:GENERAL.softWhite, transition:'all .15s', display:'flex', alignItems:'center', gap:10 }}>
                          <span style={{ width:22, height:22, borderRadius:'50%', border:`1.5px solid ${answer===opt?GENERAL.teal:'rgba(255,255,255,0.12)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'.72rem', fontWeight:700, color:answer===opt?GENERAL.teal:GENERAL.slate, background:answer===opt?`rgba(${GENERAL.tealRgb},.10)`:'transparent' }}>{String.fromCharCode(65+i)}</span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                : <div style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:14, padding:'14px', marginBottom:14 }}>
                    <div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:GENERAL.slate, marginBottom:8 }}>Your answer</div>
                    <textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Write your answer here…" style={{ width:'100%', border:'none', background:'transparent', resize:'none', fontFamily:"'Outfit', sans-serif", fontSize:'.92rem', color:GENERAL.softWhite, lineHeight:1.65, outline:'none', minHeight:q.marks>=6?180:q.marks>=3?120:80 }} />
                  </div>
            )}
            {error && <div style={{ background:`rgba(${GENERAL.coralRgb},.08)`, border:`1px solid rgba(${GENERAL.coralRgb},.3)`, borderRadius:10, padding:'11px 14px', marginBottom:14 }}><p style={{ fontFamily:"'Outfit', sans-serif", margin:0, fontSize:'.86rem', color:GENERAL.coral }}>{error}</p></div>}
            {feedback && gs && (
              <div className="fade-up">
                <div style={{ background:gs.bg, border:`2px solid ${gs.border}`, borderRadius:16, padding:'18px', marginBottom:12 }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                    <div style={{ fontFamily:"'Sora', sans-serif", fontSize:'1.8rem', fontWeight:800, color:gs.text, lineHeight:1 }}>{feedback.marksAwarded}<span style={{ fontSize:'1rem', opacity:.6 }}>/{feedback.marksAvailable}</span></div>
                    <div style={{ background:gs.badge, color:'#000', borderRadius:99, padding:'5px 14px', fontFamily:"'Sora', sans-serif", fontWeight:700, fontSize:'.82rem' }}>{feedback.grade}</div>
                  </div>
                  <p style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.9rem', color:gs.text, margin:0, opacity:.85 }}>{feedback.summary}</p>
                </div>
                {feedback.achieved?.length > 0 && feedback.achieved[0] !== 'Correct answer selected' && <div style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'13px 14px', marginBottom:8 }}><div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:GENERAL.teal, marginBottom:8 }}>✓ What you got right</div>{feedback.achieved.map((a,i)=><div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:GENERAL.teal, flexShrink:0 }}>✓</span><p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.87rem', color:GENERAL.slate }}>{a}</p></div>)}</div>}
                {feedback.missed?.length > 0 && feedback.missed[0] !== 'No answer provided' && feedback.missed[0] !== '' && <div style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.06)', borderRadius:12, padding:'13px 14px', marginBottom:8 }}><div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:GENERAL.slate, marginBottom:8 }}>→ Worth knowing</div>{feedback.missed.map((m,i)=><div key={i} style={{ display:'flex', gap:8, marginBottom:6 }}><span style={{ color:GENERAL.slate, flexShrink:0 }}>→</span><p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.87rem', color:GENERAL.slate }}>{m}</p></div>)}</div>}
                {feedback.examinerTip && feedback.examinerTip !== '' && <div style={{ background:`rgba(${GENERAL.tealRgb},.06)`, border:`1px solid rgba(${GENERAL.tealRgb},.2)`, borderRadius:12, padding:'13px 14px', marginBottom:14 }}><div style={{ fontFamily:"'Outfit', sans-serif", fontSize:'.65rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', color:GENERAL.teal, marginBottom:6 }}>Examiner tip</div><p style={{ margin:0, fontFamily:"'Outfit', sans-serif", fontSize:'.87rem', color:GENERAL.slate }}>{feedback.examinerTip}</p></div>}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  <button onClick={fullResetQ} style={{ background:GENERAL.neutral[1], border:'1px solid rgba(255,255,255,0.10)', borderRadius:12, padding:'13px', fontFamily:"'Sora', sans-serif", fontWeight:700, cursor:'pointer', color:GENERAL.slate, fontSize:'.88rem' }}>↩ Try again</button>
                  <ContinueCTA onClick={()=>tqNextQuestion(questions.length)} label={qIdx<questions.length-1?'Next →':'Finish ✓'} accent={GENERAL.teal} textColor={GENERAL.neutral[0]} />
                </div>
              </div>
            )}
            {!feedback && !tqMcLocked && (
              <button onClick={() => handleTqCheck(q)} disabled={grading || (isMC && !answer)}
                style={{ width:'100%', background:grading?'rgba(255,255,255,0.08)':GENERAL.teal, color:grading?GENERAL.slate:GENERAL.neutral[0], border:'none', borderRadius:12, padding:'15px', fontFamily:"'Sora', sans-serif", fontWeight:700, cursor:(grading||(isMC&&!answer))?'default':'pointer', fontSize:'.97rem', marginTop:4, opacity:(isMC&&!answer)?0.4:1 }}>
                {grading ? 'Marking…' : tqMcHint ? 'Check again — you can do this →' : 'Check my answer →'}
              </button>
            )}
          </>}
        </div>
      </div>
    )
  }


  return (
    <div style={{ background: '#08090D', minHeight: '100vh', paddingBottom: 90 }}>

      {/* ── Header — 60px ── */}
      <div style={{ height: 60, padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div>
          <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1rem', color: '#F4EFE6' }}>
            {isQuickFire ? '90s Quick Fire' : 'Practice Test'}
          </div>
        </div>
        <StreakChip />
      </div>

      <div style={{ padding: '8px 20px 0' }}>

        {/* ── QUICK FIRE CTA ── */}
        <button onClick={startRandomQuestion} style={{
          width: '100%', boxSizing: 'border-box', cursor: 'pointer',
          background: 'linear-gradient(140deg, #0A1A14 0%, #081209 55%, #060E07 100%)',
          border: '1px solid rgba(101,230,198,0.22)', borderRadius: 22,
          padding: '22px 22px 20px', display: 'flex', alignItems: 'center', gap: 20,
          marginBottom: 28, textAlign: 'left',
          boxShadow: '0 0 40px rgba(101,230,198,0.06), 0 8px 32px rgba(0,0,0,0.5)',
        }}>
          <div style={{
            width: 62, height: 62, borderRadius: 18, flexShrink: 0,
            background: 'linear-gradient(135deg, #1B4A36, #2A7A58)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', boxShadow: '0 0 18px rgba(101,230,198,0.22)',
          }}>⚡</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#F4EFE6', lineHeight: 1.15, marginBottom: 5 }}>
              {isQuickFire ? '90s Quick Fire' : 'Random Quick Fire'}
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.78rem', color: '#65E6C6', fontWeight: 600, marginBottom: 4 }}>
              {isQuickFire ? '90 seconds · Answer fast' : '90 seconds · All subjects · Mixed'}
            </div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.72rem', color: '#5A6A50', lineHeight: 1.4 }}>
              Random questions from across your GCSE subjects — you never know what's coming.
            </div>
          </div>
          <div style={{ flexShrink: 0, background: 'linear-gradient(135deg, #3D7A5E, #65E6C6)', borderRadius: 18, padding: '0 20px', height: 58, display: 'flex', alignItems: 'center', fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 20, letterSpacing: '-0.01em', color: '#051209', whiteSpace: 'nowrap' }}>
            {isQuickFire ? 'Start ⚡' : 'Go →'}
          </div>
        </button>

        {/* ── SELECT A TOPIC label ── */}
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7A7670', marginBottom: 14 }}>
          Or select a topic
        </div>

        {/* ── SUBJECT GRID — 3 columns ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
          {EXAM_SUBJECTS.map((subj, i) => (
            <button key={i} onClick={subj.action} style={{
              position: 'relative', height: 112, borderRadius: 16, overflow: 'hidden',
              border: `1px solid ${subj.color}28`, cursor: 'pointer', padding: 0,
              background: '#0D0E10',
              boxShadow: `0 4px 16px rgba(0,0,0,0.45)`,
            }}>
              {/* cinematic background image */}
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${subj.logo})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'saturate(0.75) brightness(0.72)',
              }} />
              {/* bottom gradient */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, rgba(5,7,11,0.10) 0%, rgba(5,7,11,0.72) 58%, rgba(5,7,11,0.96) 100%)',
              }} />
              {/* label */}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 10px 10px', textAlign: 'left' }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 14, color: '#F5F7FF', lineHeight: '18px', letterSpacing: '-0.01em' }}>{subj.label}</div>
              </div>
              {/* accent top-left dot */}
              <div style={{ position: 'absolute', top: 9, left: 9, width: 6, height: 6, borderRadius: '50%', background: subj.color, boxShadow: `0 0 8px ${subj.color}` }} />
            </button>
          ))}
        </div>

        {/* ── REAL EXAM PAPERS ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#4A5578', marginBottom: 12 }}>Real Exam Papers</div>

          {/* Edexcel History Paper 1 — June 2023 */}
          <button onClick={startMedicinePaper2023} style={{ width: '100%', boxSizing: 'border-box', background: '#0E1122', border: '1px solid rgba(200,155,109,0.22)', borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left', marginBottom: 10 }}>
            <div style={{ width: 54, height: 54, borderRadius: 15, background: 'rgba(200,155,109,0.1)', border: '1px solid rgba(200,155,109,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C89B6D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.9rem', color: '#F0F3FA', lineHeight: 1.25, marginBottom: 3 }}>Edexcel History Paper 1 — June 2023</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.72rem', color: '#C89B6D', fontWeight: 600, marginBottom: 2 }}>1HI0/11 · 52 marks · 75 min timer</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.7rem', color: '#4A5578' }}>Medicine in Britain & Western Front 1914–18</div>
            </div>
            <div style={{ background: 'rgba(200,155,109,0.15)', border: '1px solid rgba(200,155,109,0.3)', borderRadius: 8, padding: '5px 10px', flexShrink: 0 }}>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.72rem', color: '#C89B6D', letterSpacing: '.04em', textTransform: 'uppercase' }}>Timed</span>
            </div>
          </button>

          {/* Generic timed practice */}
          <button onClick={() => startExamRound('Random', { isTimedPaper: true })} style={{ width: '100%', boxSizing: 'border-box', background: '#0E1628', border: '1px solid #1E2A40', borderRadius: 24, padding: 20, display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 54, height: 54, borderRadius: 15, background: 'rgba(59,130,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>📋</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '.92rem', color: '#F0F3FA' }}>Timed mixed practice</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '.73rem', color: '#4A5578', marginTop: 3 }}>10 questions · 10 min timer · All subjects</div>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '1.05rem', flexShrink: 0 }}>›</span>
          </button>
        </div>

      </div>
    </div>
  )
}

export { readQfBest }
export default TestTab
