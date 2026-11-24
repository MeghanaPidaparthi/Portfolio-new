import { useEffect, useRef } from 'react'
import { system } from '../content/system.js'
import { useOsStore } from './osStore.js'

/**
 * Temporary Start menu with only the actions that already work.
 * The full menu (programs, folders, Rover) replaces this once the design is final.
 */
function StartMenu({ onClose }) {
  const setOsState = useOsStore((state) => state.setOsState)
  const openShutdownDialog = useOsStore((state) => state.openShutdownDialog)
  const menuRef = useRef(null)

  useEffect(() => {
    function handlePointerDown(event) {
      if (menuRef.current?.contains(event.target)) return
      if (event.target.closest?.('.start-button')) return
      onClose()
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  function logOff() {
    onClose()
    setOsState('login')
  }

  function turnOff() {
    onClose()
    openShutdownDialog()
  }

  return (
    <div className="start-menu" ref={menuRef} role="menu" aria-label="Start menu">
      <div className="start-menu-header">{system.displayName}</div>
      <div className="start-menu-footer">
        <button className="start-menu-item" onClick={logOff} role="menuitem" type="button">
          Log Off
        </button>
        <button className="start-menu-item" onClick={turnOff} role="menuitem" type="button">
          Turn Off Computer
        </button>
      </div>
    </div>
  )
}

export default StartMenu