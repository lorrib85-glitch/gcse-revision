// Single source of truth for the progress-status wording shown across the app.
// "Signed in" only ever means a real Google account (provider: 'google') —
// the guest name-only flow is local-only and must never claim otherwise.
// "Synced" is reserved for a future cloud-sync pass; until user.synced is
// actually set by that layer, this never returns the synced string.
export function getProgressStatusText(user) {
  if (user?.provider === 'google') {
    return user.synced
      ? 'Progress saved to your account'
      : 'Signed in — progress still saved on this device'
  }
  return 'Progress saved on this device'
}
