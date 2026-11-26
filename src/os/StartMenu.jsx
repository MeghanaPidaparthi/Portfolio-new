import { useEffect, useRef } from 'react'
import { links } from '../content/links.js'
import { startMenu } from '../content/startMenu.js'
import { useWindowStore } from '../windows/windowStore.js'
import { avatarSrc } from './avatar.js'
import { getIconSource } from './icons.js'
import { launchById } from './launch.js'
import { useOsStore } from './osStore.js'

function MenuIcon({ name, label }) {
  const source = getIconSource(name)
  if (source) return <img className="sm-icon" src={source} alt="" draggable="false" />
  return (
    <span className="sm-icon sm-icon-fallback" aria-hidden="true">
      {label.charAt(0)}
    </span>
  )
}

function MenuItem({ entry, onRun, pinned = false }) {
  const link = entry.link ? links[entry.link] : undefined
  const isDisabled = Boolean(entry.link) && !link?.url
  const classes = ['sm-item']
  if (pinned) classes.push('is-pinned')
  if (entry.plain) classes.push('is-plain')
  if (entry.divider) classes.push('has-divider')

  return (
    <li role="none">
      <button
        className={classes.join(' ')}
        disabled={isDisabled}
        onClick={() => onRun(entry)}
        role="menuitem"
        title={isDisabled ? 'Link not added yet' : undefined}
        type="button"
      >
        <MenuIcon label={entry.label} name={entry.icon} />
        <span className="sm-text">
          <span className="sm-label">{entry.label}</span>
          {entry.sub && <span className="sm-sub">{entry.sub}</span>}
        </span>
      </button>
    </li>
  )
}

/** Start menu. Closes on outside click, Escape, or after launching anything. */
function StartMenu({ onClose }) {
  const setOsState = useOsStore((state) => state.setOsState)
  const openShutdownDialog = useOsStore((state) => state.openShutdownDialog)
  const openWindow = useWindowStore((state) => state.open)
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

  function run(entry) {
    onClose()
    if (entry.open) {
      launchById(entry.open)
    } else if (entry.app) {
      openWindow({ ...entry.app, icon: entry.icon })
    } else if (entry.link) {
      const url = links[entry.link]?.url
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  function logOff() {
    onClose()
    setOsState('login')
  }

  function turnOff() {
    onClose()
    openShutdownDialog()
  }

  return (
    <div className="sm" ref={menuRef} role="menu" aria-label="Start menu">
      <div className="sm-header">
        {avatarSrc ? (
          <img className="sm-avatar" src={avatarSrc} alt="" />
        ) : (
          <span className="sm-avatar sm-avatar-fallback" aria-hidden="true">
            {startMenu.userName.charAt(0)}
          </span>
        )}
        <span className="sm-name">{startMenu.userName}</span>
      </div>
      <div className="sm-line" />

      <div className="sm-body">
        <ul className="sm-left" role="none">
          {startMenu.pinned.map((entry) => (
            <MenuItem entry={entry} key={entry.id} onRun={run} pinned />
          ))}
          <li className="sm-sep" role="separator" />
          {startMenu.programs.map((entry) => (
            <MenuItem entry={entry} key={entry.id} onRun={run} />
          ))}
        </ul>
        <ul className="sm-right" role="none">
          {startMenu.places.map((entry) => (
            <MenuItem entry={entry} key={entry.id} onRun={run} />
          ))}
        </ul>
      </div>

      <div className="sm-footer">
        <button className="sm-footer-button" onClick={logOff} role="menuitem" type="button">
          <MenuIcon label={startMenu.logOffLabel} name="log-off" />
          {startMenu.logOffLabel}
        </button>
        <button className="sm-footer-button" onClick={turnOff} role="menuitem" type="button">
          <MenuIcon label={startMenu.turnOffLabel} name="turn-off" />
          {startMenu.turnOffLabel}
        </button>
      </div>
    </div>
  )
}

export default StartMenu