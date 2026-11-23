import { useEffect } from 'react'
import { system } from './content/system.js'
import Boot from './os/Boot.jsx'
import Login from './os/Login.jsx'
import Shutdown from './os/Shutdown.jsx'
import { useOsStore } from './os/osStore.js'

const states = ['boot', 'login', 'desktop', 'shutdown']

function App() {
  const osState = useOsStore((state) => state.osState)
  const setOsState = useOsStore((state) => state.setOsState)
  const openShutdownDialog = useOsStore((state) => state.openShutdownDialog)

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem('os-session')) setOsState('login')
    } catch {
      // The boot flow remains available when browser storage is disabled.
    }
  }, [setOsState])

  return (
    <>
      {osState === 'boot' && <Boot />}
      {osState === 'login' && <Login />}
      {osState === 'desktop' && (
        <main className="os-shell desktop-placeholder">
          <h1>{system.siteName}</h1>
          <p>{system.desktopText}</p>
        </main>
      )}
      {(osState === 'shutdown' || osState === 'desktop') && <Shutdown />}

      {import.meta.env.DEV && (
        <nav className="dev-switcher" aria-label="Development OS state switcher">
          <span>DEV</span>
          {states.map((state) => (
            <button
              aria-pressed={osState === state}
              key={state}
              onClick={() => setOsState(state)}
              type="button"
            >
              {state}
            </button>
          ))}
          {osState === 'desktop' && (
            <button onClick={openShutdownDialog} type="button">Shutdown dialog</button>
          )}
        </nav>
      )}
    </>
  )
}

export default App

