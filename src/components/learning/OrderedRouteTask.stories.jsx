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
  title: 'Rebuild the evacuation chain',
  subtitle: 'Drag each job to the correct stage in the order a wounded soldier would be treated.',
  backgroundImage: '/headers/history-medicine-trenches.png',
  stages: [
    { id: 's-frontline', icon: 'helmet', title: 'Front line',                       clue: 'In the trenches',             answerId: 'a-frontline' },
    { id: 's-rap',       icon: 'cross',  title: 'Regimental Aid Post',              clue: 'Close to the front',          answerId: 'a-rap'       },
    { id: 's-ads',       icon: 'hut',    title: 'Advanced / Main Dressing Station', clue: 'Further behind the front',    answerId: 'a-ads'       },
    { id: 's-ccs',       icon: 'train',  title: 'Casualty Clearing Station',        clue: 'Near railways',               answerId: 'a-ccs'       },
  ],
  answers: [
    { id: 'a-frontline', text: 'Carried wounded men from the front line' },
    { id: 'a-rap',       text: 'Basic first aid close to the front line' },
    { id: 'a-ads',       text: 'Treated more serious injuries around 400 metres behind the line' },
    { id: 'a-ccs',       text: 'Performed most surgery and triage, often near railways' },
  ],
}

export const Default = {
  name: 'Evacuation chain route',
  args: { screen: SCREEN, subject: 'History', onComplete: () => {} },
}
