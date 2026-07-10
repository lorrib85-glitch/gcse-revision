import { useEffect, useRef, useState } from 'react'
import { subscribeSaveFailure } from '../lib/storage.js'
import { createSaveFailureController } from './saveFailureController.js'
import SaveFailureNotice from '../components/core/SaveFailureNotice.jsx'

// Mounted once at the app shell. Subscribes to the storage boundary's critical
// save-failure bus, funnels events through the pure controller (dedupe / retry
// / dismiss), and renders the single governed notice. Keeping this in one place
// is what lets every feature call saveCritical() without repeating error-state
// logic of its own.

export default function SaveFailureHost() {
  const [state, setState] = useState({ open: false, retrying: false, pendingCount: 0 })
  const controllerRef = useRef(null)
  if (!controllerRef.current) controllerRef.current = createSaveFailureController(setState)

  useEffect(() => subscribeSaveFailure(detail => controllerRef.current.reportFailure(detail)), [])

  const controller = controllerRef.current
  return (
    <SaveFailureNotice
      open={state.open}
      retrying={state.retrying}
      onRetry={() => controller.retry()}
      onDismiss={() => controller.dismiss()}
    />
  )
}
