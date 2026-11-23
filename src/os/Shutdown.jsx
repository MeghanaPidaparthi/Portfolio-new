import { useEffect } from 'react'
import { system } from '../content/system.js'
import { play, unlockAudio } from './audio.js'
import { useOsStore } from './osStore.js'

function clearSession() {
  try {
    window.sessionStorage.removeItem('os-session')
  } catch {
    // Restart still works if browser storage is unavailable.
  }
}

function Shutdown() {
  const osState = useOsStore((state) => state.osState)
  const isShutdownDialogOpen = useOsStore((state) => state.isShutdownDialogOpen)
  const closeShutdownDialog = useOsStore((state) => state.closeShutdownDialog)
  const setOsState = useOsStore((state) => state.setOsState)

  useEffect(() => {
    if (!isShutdownDialogOpen) return undefined

    function handleKeyDown(event) {
      if (event.key === 'Escape') closeShutdownDialog()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closeShutdownDialog, isShutdownDialogOpen])

  function restart() {
    clearSession()
    closeShutdownDialog()
    setOsState('boot')
  }

  function turnOff() {
    clearSession()
    unlockAudio()
    void play('shutdown')
    closeShutdownDialog()
    setOsState('shutdown')
  }

  if (osState === 'shutdown') {
    return (
      <button className="os-shell shutdown-screen" onClick={restart} type="button">
        <span className="shutdown-message">{system.shutdownText}</span>
        <span className="shutdown-restart-hint">{system.restartText}</span>
      </button>
    )
  }

  if (osState !== 'desktop' || !isShutdownDialogOpen) return null

  return (
    <div
      className="shutdown-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeShutdownDialog()
      }}
    >
      <section
        aria-labelledby="shutdown-title"
        aria-modal="true"
        className="shutdown-dialog"
        role="dialog"
      >
        <header className="shutdown-dialog-titlebar">
          <h2 id="shutdown-title">Turn off computer</h2>
          <button aria-label="Close dialog" onClick={closeShutdownDialog} type="button">×</button>
        </header>
        <div className="shutdown-dialog-content">
          <p>What do you want the computer to do?</p>
          <div className="shutdown-actions">
            <button className="shutdown-action" onClick={turnOff} type="button">
              <span className="shutdown-action-icon turnoff-icon" aria-hidden="true" />
              Turn Off
            </button>
            <button className="shutdown-action" onClick={restart} type="button">
              <span className="shutdown-action-icon restart-icon" aria-hidden="true" />
              Restart
            </button>
          </div>
          <div className="shutdown-dialog-footer">
            <button className="xp-dialog-button" onClick={closeShutdownDialog} type="button">Cancel</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Shutdown



