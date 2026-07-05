import { describe, it, expect } from 'vitest'
import { getProgressStatusText } from '../../../src/auth/progressStatus.js'

describe('getProgressStatusText', () => {
  it('invites sign-in when logged out', () => {
    expect(getProgressStatusText(null)).toBe(
      'Using this device only. Sign in with Google to back up progress.'
    )
  })

  it('invites sign-in for the guest name-only flow', () => {
    expect(getProgressStatusText({ loggedIn: true, provider: 'guest', name: 'Sam' })).toBe(
      'Using this device only. Sign in with Google to back up progress.'
    )
  })

  it('reports active backup for a Google user with healthy sync', () => {
    expect(getProgressStatusText({ loggedIn: true, provider: 'google', name: 'Sam' }, 'ok')).toBe(
      'Signed in — progress backs up to your account.'
    )
  })

  it('uses calm retry wording on sync error — no technical detail', () => {
    const text = getProgressStatusText({ loggedIn: true, provider: 'google', name: 'Sam' }, 'error')
    expect(text).toBe('Progress is saved on this device. Backup will retry when connection is available.')
    expect(text).not.toMatch(/firebase|firestore|auth\//i)
  })
})
