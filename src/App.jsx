import LegacyApp from './app/LegacyApp.jsx'
import SaveFailureHost from './app/SaveFailureHost.jsx'

export default function App() {
  return (
    <>
      <LegacyApp />
      {/* App-wide governed notice for failed critical saves. Renders nothing
          until a save fails, so it is safe to keep mounted at the root. */}
      <SaveFailureHost />
    </>
  )
}
