import { expect, fn, userEvent, waitFor, within } from 'storybook/test'
import OrderedRouteTask from './OrderedRouteTask'

export default {
  component: OrderedRouteTask,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
}

const SCREEN = {
  type: 'orderedRouteTask',
  tag: 'chain-of-evacuation-recall',
  title: 'Rebuild the evacuation chain',
  titleHighlight: 'evacuation chain',
  subtitle: 'Tap a job, then choose its stage.',
  prompt: 'Where did this happen?',
  weakGroup: 'Evacuation chain',
  completionText: 'Five stages, each one further from the fighting. Q1 often asks for two features of one stage — precise details like these win the marks.',
  backgroundImage: '/headers/history-medicine-trenches.png',
  stages: [
    { id: 's-bearers', icon: 'helmet', title: 'Stretcher bearers',                 clue: 'From the front line',   answerId: 'a-bearers' },
    { id: 's-rap',     icon: 'cross',  title: 'Regimental Aid Post',               clue: 'Close to the front',    answerId: 'a-rap'     },
    { id: 's-ads',     icon: 'hut',    title: 'Advanced / Main Dressing Station',  clue: 'About 400 metres back', answerId: 'a-ads'     },
    { id: 's-ccs',     icon: 'train',  title: 'Casualty Clearing Station',         clue: 'Near railways',         answerId: 'a-ccs'     },
    { id: 's-base',    icon: 'ship',   title: 'Base Hospital',                     clue: 'On the French coast',   answerId: 'a-base'    },
  ],
  answers: [
    { id: 'a-bearers', text: 'First to reach the wounded, carrying them out through mud and shellfire' },
    { id: 'a-rap',     text: 'Gave basic first aid so minor wounds could return to the fight' },
    { id: 'a-ads',     text: 'Treated more serious injuries in tents and abandoned buildings' },
    { id: 'a-ccs',     text: 'Performed most surgery on the Western Front and sorted the wounded by triage' },
    { id: 'a-base',    text: 'Gave longer-term treatment and sent the most serious cases back to Britain' },
  ],
}

function getCurrentAnswer(canvasElement) {
  const liveRegion = canvasElement.querySelector('[aria-live="polite"]')
  return SCREEN.answers.find(answer => liveRegion?.textContent?.includes(answer.text))
}

function getStageButton(canvasElement, stage) {
  return [...canvasElement.querySelectorAll('button.ort-stage')].find(button =>
    button.getAttribute('aria-label')?.includes(stage.title),
  )
}

async function placeCurrentAnswer(canvasElement) {
  const currentAnswer = getCurrentAnswer(canvasElement)
  expect(currentAnswer).toBeDefined()

  const targetStage = SCREEN.stages.find(stage => stage.answerId === currentAnswer.id)
  const targetButton = getStageButton(canvasElement, targetStage)
  expect(targetButton).toBeDefined()

  await userEvent.click(targetButton)
  await waitFor(() => {
    expect(getCurrentAnswer(canvasElement)?.id).not.toBe(currentAnswer.id)
  })
}

export const Default = {
  name: 'Evacuation chain route',
  args: { screen: SCREEN, subject: 'History', onComplete: () => {} },
}

export const InteractionAndMobileCompletion = {
  name: 'Interaction and mobile completion QA',
  args: { screen: SCREEN, subject: 'History', onComplete: fn() },
  play: async ({ canvasElement, args }) => {
    args.onComplete.mockClear?.()
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', { name: 'Rebuild the evacuation chain' })
    const scrollRegion = heading.parentElement

    expect(scrollRegion).not.toBeNull()
    expect(scrollRegion.scrollWidth).toBeLessThanOrEqual(scrollRegion.clientWidth)
    await waitFor(() => expect(canvas.getByText('0/5 placed')).toBeVisible())
    expect(canvas.queryByRole('button', { name: 'Continue' })).toBeNull()

    const firstAnswer = getCurrentAnswer(canvasElement)
    const correctStage = SCREEN.stages.find(stage => stage.answerId === firstAnswer.id)
    const wrongStage = SCREEN.stages.find(stage => stage.id !== correctStage.id)
    const wrongButton = getStageButton(canvasElement, wrongStage)

    wrongButton.focus()
    await userEvent.keyboard('{Enter}')
    await expect(canvas.getByText(/^Not here —/)).toBeVisible()
    await waitFor(() => expect(canvas.getByText('0/5 placed')).toBeVisible())

    await userEvent.click(getStageButton(canvasElement, correctStage))
    await waitFor(() => expect(canvas.getByText('1/5 placed')).toBeVisible())

    for (let placed = 1; placed < SCREEN.answers.length; placed += 1) {
      await placeCurrentAnswer(canvasElement)
    }

    await waitFor(() => expect(canvas.getByText('Chain rebuilt')).toBeVisible())
    await waitFor(() => expect(canvas.getByText('Five stages, each one further from the fighting.')).toBeVisible())
    await waitFor(() => expect(canvas.getByText(/Exam takeaway:/)).toBeVisible())

    const continueButton = canvas.getByRole('button', { name: 'Continue' })
    const finalStageButton = getStageButton(canvasElement, SCREEN.stages.at(-1))

    await waitFor(() => {
      const continueRect = continueButton.getBoundingClientRect()
      expect(continueRect.top).toBeGreaterThanOrEqual(0)
      expect(continueRect.bottom).toBeLessThanOrEqual(window.innerHeight + 1)
    }, { timeout: 3000 })

    // The component smooth-scrolls the route to the bottom on completion —
    // wait for that scroll to settle before asserting the final stage sits
    // clear of the sticky Continue bar.
    await waitFor(() => {
      expect(finalStageButton.getBoundingClientRect().bottom)
        .toBeLessThanOrEqual(continueButton.getBoundingClientRect().top + 1)
    }, { timeout: 3000 })

    await userEvent.click(continueButton)
    await expect(args.onComplete).toHaveBeenCalledTimes(1)
  },
}
