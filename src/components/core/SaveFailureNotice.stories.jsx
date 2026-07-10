import SaveFailureNotice from './SaveFailureNotice.jsx'

export default {
  component: SaveFailureNotice,
  tags: ['ai-generated'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
}

// The notice as a learner sees it when a critical save fails.
export const Default = {
  args: {
    open: true,
    retrying: false,
    onRetry: () => {},
    onDismiss: () => {},
  },
}

// Mid-retry: the primary action reflects the in-flight attempt.
export const Retrying = {
  args: {
    open: true,
    retrying: true,
    onRetry: () => {},
    onDismiss: () => {},
  },
}

// Closed — renders nothing (no toast, no residual chrome).
export const Closed = {
  args: {
    open: false,
    onRetry: () => {},
    onDismiss: () => {},
  },
}
