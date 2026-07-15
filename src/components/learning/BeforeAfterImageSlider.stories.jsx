import BeforeAfterImageSlider from './BeforeAfterImageSlider.jsx'
import { SUBJECT_ACCENTS } from '../../constants/subjects.js'

export default {
  title: 'Learning/BeforeAfterImageSlider',
  component: BeforeAfterImageSlider,
  parameters: { layout: 'fullscreen' },
}

export const Default = {
  args: {
    beforeSrc: '/figures/history/medicine/modern/lungs-healthy.png',
    afterSrc: '/figures/history/medicine/modern/lungs-cancer.png',
    beforeAlt: 'Healthy lungs',
    afterAlt: 'Lungs damaged by smoking',
    beforeLabel: 'Healthy lungs',
    afterLabel: 'Damaged lungs',
    heading: 'What does smoking do to your lungs?',
    revealText: 'Smoking is the biggest cause of lung cancer in the UK.',
    accent: SUBJECT_ACCENTS.History,
    initial: 50,
    onComplete: () => {},
  },
}
