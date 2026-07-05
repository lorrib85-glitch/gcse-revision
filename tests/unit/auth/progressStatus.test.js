import { describe, it, expect } from 'vitest'
import { getProgressStatusText } from '../../../src/auth/progressStatus.js'

describe('getProgressStatusText', () => {
  it('reports local-only when logged out', () => {
    expect(getProgressStatusText(null)).toBe('Progress saved on this device')
  })

  it('reports local-only for the guest name-only flow', () => {
    expect(getProgressStatusText({ loggedIn: true, provider: 'guest', name: 'Sam' })).toBe(
      'Progress saved on this device'
    )
  })

  it('reports signed-in-not-synced for a Google user with no sync flag', () => {
    expect(getProgressStatusText({ loggedIn: true, provider: 'google', name: 'Sam' })).toBe(
      'Signed in — progress still saved on this device'
    )
  })

  it('only claims synced when explicitly flagged by a future sync layer', () => {
    expect(
      getProgressStatusText({ loggedIn: true, provider: 'google', name: 'Sam', synced: true })
    ).toBe('Progress saved to your account')
  })
})
