// Single source of truth for the progress-status wording shown across the app.
// "Backs up" only ever applies to a real Google account (provider: 'google');
// the guest name-only flow is local-only and must never claim otherwise.
// syncStatus: 'ok' | 'error' — backup health from AuthContext. Errors use calm
// wording; technical Firebase detail never reaches students.
export function getProgressStatusText(user, syncStatus = 'ok') {
  if (user?.provider === 'google') {
    return syncStatus === 'error'
      ? 'Progress is saved on this device. Backup will retry when connection is available.'
      : 'Signed in — progress backs up to your account.'
  }
  return 'Using this device only. Sign in with Google to back up progress.'
}
