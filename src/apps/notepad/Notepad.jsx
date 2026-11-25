import { useEffect, useRef, useState } from 'react'
import { textFiles } from '../../content/files.js'
import { useWindowStore } from '../../windows/windowStore.js'

/** Read-only Notepad. Only menu items that work are shown. */
function Notepad({ windowId, file }) {
  const doc = textFiles[file]
  const close = useWindowStore((state) => state.close)
  const [wrap, setWrap] = useState(true)
  const [openMenu, setOpenMenu] = useState(null)
  const barRef = useRef(null)

  useEffect(() => {
    if (!openMenu) return undefined

    function handlePointerDown(event) {
      if (!barRef.current?.contains(event.target)) setOpenMenu(null)
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpenMenu(null)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [openMenu])

  function toggleMenu(name) {
    setOpenMenu((current) => (current === name ? null : name))
  }

  return (
    <div className="notepad">
      <div className="notepad-menubar" ref={barRef} role="menubar">
        <div className="notepad-menu">
          <button
            aria-expanded={openMenu === 'file'}
            aria-haspopup="menu"
            className={`notepad-menu-button${openMenu === 'file' ? ' is-open' : ''}`}
            onClick={() => toggleMenu('file')}
            role="menuitem"
            type="button"
          >
            File
          </button>
          {openMenu === 'file' && (
            <div className="notepad-dropdown" role="menu">
              <button onClick={() => close(windowId)} role="menuitem" type="button">
                Close
              </button>
            </div>
          )}
        </div>
        <div className="notepad-menu">
          <button
            aria-expanded={openMenu === 'format'}
            aria-haspopup="menu"
            className={`notepad-menu-button${openMenu === 'format' ? ' is-open' : ''}`}
            onClick={() => toggleMenu('format')}
            role="menuitem"
            type="button"
          >
            Format
          </button>
          {openMenu === 'format' && (
            <div className="notepad-dropdown" role="menu">
              <button
                aria-checked={wrap}
                onClick={() => {
                  setWrap((current) => !current)
                  setOpenMenu(null)
                }}
                role="menuitemcheckbox"
                type="button"
              >
                <span className="notepad-check">{wrap ? '\u2713' : ''}</span>
                Word Wrap
              </button>
            </div>
          )}
        </div>
      </div>
      <textarea
        aria-label={doc?.name ?? 'Text file'}
        className="notepad-text"
        readOnly
        spellCheck={false}
        value={doc?.text ?? ''}
        wrap={wrap ? 'soft' : 'off'}
      />
    </div>
  )
}

export default Notepad