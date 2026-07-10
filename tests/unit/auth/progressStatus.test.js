import { describe, it, expect } from 'vitest'
import { getProgressStatusText } from '../../../src/auth/progressStatus.js'

describe('getProgressStatusText', () => {
  it('invites sign-in when logged out', () => {
    expect(getProgressStatusText(null)).toBe(
      'Saved on this device. Sign in with Google to back it up.'
    )
  })

  it('invites sign-in for the guest name-only flow', () => {
    expect(getProgressStatusText({ loggedIn: true, provider: 'guest', name: 'Sam' })).toBe(
      'Saved on this device. Sign in with Google to back it up.'
    )
  })

  it('reports a pending backup while a sync/backup is in flight', () => {
    expect(getProgressStatusText({ loggedIn: true, provider: 'google', name: 'Sam' }, 'syncing')).toBe(
      'Waiting to back up…'
    )
  })

  it('reports active backup for a Google user with healthy sync', () => {
    expect(getProgressStatusText({ loggedIn: true, provider: 'google', name: 'Sam' }, 'ok')).toBe(
      'Progress backed up to your account.'
    )
  })

  it('uses calm retry wording on sync error — no technical detail, and never claims success', () => {
    const text = getProgressStatusText({ loggedIn: true, provider: 'google', name: 'Sam' }, 'error')
    expect(text).toBe("We couldn't back up your latest progress yet — it's safe on this device, and we'll retry.")
    expect(text).not.toMatch(/firebase|firestore|auth\/|snapshot|payload|conflict|database/i)
    expect(text).not.toMatch(/backed up\b/i)
  })

  it('reports an honest "saved on device" state when a backup is blocked by the size budget — never claims success, no technical detail', () => {
    const text = getProgressStatusText({ loggedIn: true, provider: 'google', name: 'Sam' }, 'blocked')
    expect(text).toBe("Saved on this device — your progress is safe here, but we couldn't back up everything yet.")
    expect(text).not.toMatch(/firebase|firestore|byte|size|quota|payload|document|limit/i)
    expect(text).not.toMatch(/backed up\b/i)
  })

  it('the five states are all distinct wording', () => {
    const google = { loggedIn: true, provider: 'google', name: 'Sam' }
    const texts = new Set([
      getProgressStatusText(null),
      getProgressStatusText(google, 'syncing'),
      getProgressStatusText(google, 'ok'),
      getProgressStatusText(google, 'error'),
      getProgressStatusText(google, 'blocked'),
    ])
    expect(texts.size).toBe(5)
  })
})
