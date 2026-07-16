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

export const Default = {
  name: 'Evacuation chain route',
  args: { screen: SCREEN, subject: 'History', onComplete: () => {} },
}
