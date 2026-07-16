import CheckAnswerCTA from './CheckAnswerCTA.jsx'
import { SUBJECTS } from '../../constants/subjects.js'

export default {
  title: 'Core/CheckAnswerCTA',
  component: CheckAnswerCTA,
  parameters: { layout: 'padded' },
}

export const Enabled = {
  args: {
    accent: SUBJECTS.Biology.accent,
    disabled: false,
    onClick: () => {},
  },
}

export const Disabled = {
  args: {
    accent: SUBJECTS.Biology.accent,
    disabled: true,
    onClick: () => {},
  },
}

export const HistoryAccent = {
  args: {
    accent: SUBJECTS.History.accent,
    label: 'Check my answer',
    disabled: false,
    onClick: () => {},
  },
}
