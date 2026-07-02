import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import './globals.css'
import './styles.css'
import './scrollbars.css'

const CHUNK_LOAD_ERROR = /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|ChunkLoadError|Loading chunk|dynamically imported module/i
const RELOAD_FLAG = 'gcse-revision:chunk-reload-attempted'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, isChunkError: false }
  }
  static getDerivedStateFromError(error) {
    const message = error.message || String(error)
    return { error: message, isChunkError: CHUNK_LOAD_ERROR.test(message) }
  }
  componentDidMount() {
    // A clean mount means the current index.html and chunk hashes are good —
    // clear the guard so a genuine future deploy can still trigger one reload.
    if (!this.state.error) sessionStorage.removeItem(RELOAD_FLAG)
  }
  componentDidCatch(error) {
    const message = error.message || String(error)
    if (CHUNK_LOAD_ERROR.test(message) && !sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1')
      window.location.reload()
    }
  }
  render() {
    if (this.state.isChunkError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32, minHeight: '100vh', textAlign: 'center', fontFamily: 'sans-serif', background: '#fff' }}>
          <p style={{ fontSize: 17, color: '#333', margin: 0 }}>The app has updated. Please refresh the page.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', fontSize: 15, cursor: 'pointer' }}>
            Refresh
          </button>
        </div>
      )
    }
    if (this.state.error) {
      return (
        <div style={{ padding: 32, fontFamily: 'monospace', background: '#fff', minHeight: '100vh' }}>
          <h2 style={{ color: '#c0392b', marginBottom: 16 }}>Something went wrong</h2>
          <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8, whiteSpace: 'pre-wrap', fontSize: 13 }}>
            {this.state.error}
          </pre>
          <p style={{ marginTop: 16, color: '#666' }}>Copy the error above and share it.</p>
        </div>
      )
    }
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
