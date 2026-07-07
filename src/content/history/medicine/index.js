// Medicine Through Time — series content registry.
//
// MEDICINE_EPISODES is the ordered list of all built episodes in this series.
// The app loads episodes individually via MODULE_CONTENT_LOADERS in LegacyApp.jsx —
// each episode ID maps directly to its own file, so opening one episode never
// downloads the others.
//
// To add a new episode:
//   1. Create src/content/history/medicine/episodes/episode-NN-<slug>.js
//   2. Import and append it to MEDICINE_EPISODES below (maintain number order)
//   3. Add a metadata entry in src/modules.js
//   4. Add a MODULE_CONTENT_LOADERS entry in src/app/LegacyApp.jsx
//   5. Run: vitest run tests/architecture

import episode01 from './episodes/episode-01-medieval-beliefs-causes.js'
import episode02 from './episodes/episode-02-black-death.js'
import episode03 from './episodes/episode-03-renaissance-medicine.js'
import episode04 from './episodes/episode-04-surgery-anaesthetics.js'
import episode06 from './episodes/episode-06-jenner-vaccination.js'
import episode07 from './episodes/episode-07-germ-theory.js'
import episode08 from './episodes/episode-08-great-stink.js'
import episode09 from './episodes/episode-09-surgery-revolution.js'
import episode11 from './episodes/episode-11-accidental-miracle.js'
import episode12 from './episodes/episode-12-when-medicine-became-magic.js'
import episode13 from './episodes/episode-13-can-we-beat-cancer.js'
import episode14 from './episodes/episode-14-western-front.js'

const sentenceCaseEpisode01Labels = new Map([
  ['Ancient Authorities', 'Ancient authorities'],
  ['ANCIENT AUTHORITIES', 'Ancient authorities'],
  ['The Germ Problem', 'The germ problem'],
  ['The Four Humours', 'The four humours'],
  ['Explore the Humours', 'Explore the humours'],
  ['Tap the Four Humours', 'Tap the four humours'],
  ['The Theory of Opposites', 'The theory of opposites'],
  ['Think Like Galen', 'Think like Galen'],
  ['A Patient Arrives', 'A patient arrives'],
  ['Supported by the Church', 'Supported by the Church'],
  ['Choose Your Healer', 'Choose your healer'],
  ['Miasma — The Poisoned Air Theory', 'Miasma — the poisoned air theory'],
  ["Diagnose Like It's 1340", "Diagnose like it's 1340"],
  ['The Zodiac Man', 'The Zodiac Man'],
  ['God & Sin', 'God & sin'],
  ['The Four Humours', 'The four humours'],
  ['Four Humours', 'Four humours'],
  ['Staying Well in 1400', 'Staying well in 1400'],
  ['A Walk Through Medieval London', 'A walk through medieval London'],
  ['Supernatural vs Natural Causes', 'Supernatural vs natural causes'],
  ['Fill the Gap', 'Fill the gap'],
  ['Four Humours', 'Four humours'],
  ['Fill the Medieval Logic Gap', 'Fill the medieval logic gap'],
  ['Face the Examiner', 'Face the examiner'],
])

const episode01QuestionHints = new Map([
  [
    'What did Hippocrates believe caused illness?',
    'Hippocrates was unusual because he looked for natural causes of illness, not supernatural ones.',
  ],
])

const episode01SentenceCaseStageTitles = [
  'Strange ideas, serious medicine',
  'What made people sick?',
  'Why Galen ruled the room',
  'The medieval treatment toolkit',
  'Why the system survived',
  'Exam prep: explain the grip of Galen',
]

function sentenceCaseEpisode01Screen(screen) {
  return {
    ...screen,
    label: sentenceCaseEpisode01Labels.get(screen.label) || screen.label,
    title: sentenceCaseEpisode01Labels.get(screen.title) || screen.title,
    heading: sentenceCaseEpisode01Labels.get(screen.heading) || screen.heading,
    beats: Array.isArray(screen.beats)
      ? screen.beats.map(beat => ({
          ...beat,
          label: sentenceCaseEpisode01Labels.get(beat.label) || beat.label,
        }))
      : screen.beats,
    questions: Array.isArray(screen.questions)
      ? screen.questions.map(question => ({
          ...question,
          hint: episode01QuestionHints.get(question.question || question.q) || question.hint,
        }))
      : screen.questions,
    theory: screen.theory
      ? {
          ...screen.theory,
          heading: sentenceCaseEpisode01Labels.get(screen.theory.heading) || screen.theory.heading,
        }
      : screen.theory,
    scenario: screen.scenario
      ? {
          ...screen.scenario,
          title: sentenceCaseEpisode01Labels.get(screen.scenario.title) || screen.scenario.title,
        }
      : screen.scenario,
    evaluation: screen.evaluation?.church
      ? {
          ...screen.evaluation,
          church: {
            ...screen.evaluation.church,
            heading: sentenceCaseEpisode01Labels.get(screen.evaluation.church.heading) || screen.evaluation.church.heading,
          },
        }
      : screen.evaluation,
  }
}

const sentenceCaseEpisode01 = {
  ...episode01,
  title: "Trust me, I'm following Jupiter",
  subtitle: 'Medieval medicine: beliefs and causes of disease',
  stageNavigation: episode01.stageNavigation.map((stage, index) => ({
    ...stage,
    title: episode01SentenceCaseStageTitles[index] || stage.title,
  })),
  screens: episode01.screens.map(sentenceCaseEpisode01Screen),
}

// Ordered registry — add future episodes here as they are extracted.
export const MEDICINE_EPISODES = [
  sentenceCaseEpisode01,
  episode02,
  episode03,
  episode04,
  // episode05: history-medicine-great-plague — unbuilt (screenCount 0), add when built
  episode06,
  episode07,
  episode08,
  episode09,
  // episode10: history-medicine-nightingale — unbuilt (screenCount 0), add when built
  episode11,
  episode12,
  episode13,
  episode14,
]
