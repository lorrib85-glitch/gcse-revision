import '../src/globals.css'
import '../src/styles.css'
import { AuthProvider } from '../src/auth/AuthContext'

// Seed realistic localStorage state so Home renders with content
function seedLocalStorage() {
  // Logged-in user
  if (!localStorage.getItem('riseUser')) {
    localStorage.setItem('riseUser', JSON.stringify({
      loggedIn: true,
      name: 'Lorri',
      onboardingComplete: true,
      createdAt: '2025-01-01T00:00:00.000Z',
    }))
  }

  // Progress on a History module so "Jump back in" shows
  if (!localStorage.getItem('gcse_module_history-medicine')) {
    localStorage.setItem('gcse_module_history-medicine', JSON.stringify({ screen: 4 }))
  }

  // Recent scores so streak + weak zone populate
  if (!localStorage.getItem('gcse_scores')) {
    const today = new Date()
    const scores = [
      { date: today.toISOString(), subject: 'History',   pct: 72 },
      { date: today.toISOString(), subject: 'Biology',   pct: 45 },
      { date: today.toISOString(), subject: 'Maths',     pct: 61 },
      { date: today.toISOString(), subject: 'English',   pct: 83 },
      { date: today.toISOString(), subject: 'Sociology', pct: 38 },
    ]
    localStorage.setItem('gcse_scores', JSON.stringify(scores))
  }
}

const preview = {
  decorators: [
    (Story) => {
      seedLocalStorage()
      return (
        <AuthProvider>
          <Story />
        </AuthProvider>
      )
    },
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export default preview
