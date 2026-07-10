// Single source of truth for the progress-status wording shown across the app.
// "Backed up" only ever applies to a real Google account (provider: 'google');
// the guest name-only flow is local-only and must never claim otherwise.
// syncStatus: 'ok' | 'syncing' | 'error' | 'blocked' — backup health from
// AuthContext. Five distinct states, matched to what actually happened: saved
// on this device (guest), waiting to back up (a sync/backup is in flight),
// backed up (last attempt succeeded), failed (last attempt failed — retryable),
// or blocked (the cloud write was intentionally skipped because the snapshot
// was too large to back up safely — local progress is fine, but we never claim
// it was backed up). Calm wording only; no technical Firebase/Firestore/size
// detail ever reaches students.
export function getProgressStatusText(user, syncStatus = 'ok') {
  if (user?.provider !== 'google') {
    return 'Saved on this device. Sign in with Google to back it up.'
  }
  if (syncStatus === 'syncing') {
    return 'Waiting to back up…'
  }
  if (syncStatus === 'error') {
    return "We couldn't back up your latest progress yet — it's safe on this device, and we'll retry."
  }
  if (syncStatus === 'blocked') {
    return "Saved on this device — your progress is safe here, but we couldn't back up everything yet."
  }
  return 'Progress backed up to your account.'
}
