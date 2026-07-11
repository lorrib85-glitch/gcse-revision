import SymptomQualityDiagnostic from './SymptomQualityDiagnostic'

export default {
  component: SymptomQualityDiagnostic,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
    backgrounds: { default: 'dark', values: [{ name: 'dark', value: '#08090D' }] },
  },
}

// Gold — the Galen fever + phlegm cough case, matching the shipped Episode 1
// content (src/content/history/medicine/episodes/episode-01-medieval-beliefs-causes.js,
// Galen stage).
export const Gold = {
  name: 'Gold — fever and phlegm cough',
  args: {
    subject: 'History',
    onContinue: () => {},
    block: {
      qualities: [
        { quality: 'hot', symptoms: ['Fever', 'Red face', 'Flushed skin'] },
        { quality: 'cold', symptoms: ['Pale skin', 'Chills', 'Shivering'] },
        { quality: 'wet', symptoms: ['Sweating', 'Runny nose', 'Watery eyes'] },
        { quality: 'dry', symptoms: ['Cracked lips', 'Dry cough', 'Thirst'] },
      ],
      patient: {
        title: 'A patient arrives',
        symptoms: ['Fever', 'Phlegm cough'],
      },
      quadrantQuestion: 'Which qualities dominate?',
      quadrantOptions: [
        { label: 'Hot + wet', correct: true },
        { label: 'Hot + dry', correct: false },
        { label: 'Cold + wet', correct: false },
        { label: 'Cold + dry', correct: false },
      ],
      diagnosis: { label: 'Hot + wet' },
      treatmentQuestion: 'What would Galen prescribe to cool and dry this patient?',
      treatmentOptions: [
        {
          label: 'Cucumber and dry bread',
          correct: true,
          explanation: 'Cold and dry qualities pull the body back towards balance against the hot, wet excess.',
        },
        {
          label: 'Hot soup and warm wine',
          correct: false,
          explanation: 'Hot and wet — the same qualities causing the illness, not the opposite.',
        },
        {
          label: 'Warm blankets and a thick stew',
          correct: false,
          explanation: 'Still adds heat, when the patient needs cooling.',
        },
        {
          label: 'Cold milk and steamed vegetables',
          correct: false,
          explanation: "Cold is right, but this is still moist — it doesn't dry the body.",
        },
      ],
      oppositeRecall: { from: 'Hot + wet', to: 'Cold + dry', result: 'Balance' },
      closing: {
        worked: ['Rest', 'Fluids', 'Cooling foods'],
        limitation: 'Disease is not actually caused by an imbalance of the four humours.',
        verdict: 'Patients who rested, drank fluids and ate cooling foods often did recover. To Galen, and to the doctors who followed him, that recovery looked like proof the theory worked, even though the humours had nothing to do with it.',
        church: {
          heading: 'Supported by the Church',
          body: "Christians believed God created a perfect and balanced body. This matched Galen's ideas, so the Church preserved and promoted his work for centuries.",
        },
        significance: "That's why the Theory of Opposites survived for over 1,400 years. It wasn't blind faith. It was a theory that seemed to keep working, treatment after treatment, patient after patient.",
      },
    },
  },
}
