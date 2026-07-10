// Single source of truth for the progress-status wording shown across the app.
// "Backed up" only ever applies to a real Google account (provider: 'google');
// the guest name-only flow is local-only and must never claim otherwise.
// syncStatus: 'ok' | 'syncing' | 'error' — backup health from AuthContext.
// Four distinct states, matched to what actually happened: saved on this
// device (guest), waiting to back up (a sync/backup is in flight), backed up
// (last attempt succeeded), or failed (last attempt failed — the learner is
// told plainly, never told it succeeded when it didn't). Calm wording only;
// no technical Firebase/Firestore detail ever reaches students.
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
  return 'Progress backed up to your account.'
}
