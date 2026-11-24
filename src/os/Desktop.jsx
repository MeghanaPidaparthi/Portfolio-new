import { useEffect, useRef, useState } from 'react'
import { desktopIcons } from '../content/desktopIcons.js'
import Taskbar from './Taskbar.jsx'

const wallpaperFiles = import.meta.glob('../assets/wallpaper/desktop.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})
const wallpaperSrc = Object.values(wallpaperFiles)[0]

const iconFiles = import.meta.glob('../assets/icons/*.{png,svg,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})
const iconSources = Object.fromEntries(
  Object.entries(iconFiles).map(([path, url]) => [
    path.split('/').pop().replace(/\.[^.]+$/, ''),
    url,
  ]),
)

function isTouchPointer() {
  return window.matchMedia('(pointer: coarse)').matches
}

function DesktopIcon({ item, selected, onSelect, onOpen }) {
  const source = iconSources[item.icon]

  function handleClick(event) {
    event.stopPropagation()
    if (isTouchPointer()) onOpen(item)
    else onSelect(item.id)
  }

  function handleKeyDown(event) {
    if (event.key !== 'Enter') return
    event.preventDefault()
    onOpen(item)
  }

  return (
    <button
      className={`desktop-icon${selected ? ' is-selected' : ''}`}
      onClick={handleClick}
      onDoubleClick={() => onOpen(item)}
      onKeyDown={handleKeyDown}
      type="button"
    >
      {source ? (
        <img className="desktop-icon-image" src={source} alt="" draggable="false" />
      ) : (
        <span className="desktop-icon-placeholder" aria-hidden="true">
          {item.label.charAt(0)}
        </span>
      )}
      <span className="desktop-icon-label">{item.label}</span>
    </button>
  )
}

function Desktop() {
  const [selectedId, setSelectedId] = useState(null)
  const [devNote, setDevNote] = useState('')
  const noteTimer = useRef(0)

  useEffect(() => () => window.clearTimeout(noteTimer.current), [])

  function openItem(item) {
    // The window manager arrives in the next step. Until then, show a dev-only hint.
    if (!import.meta.env.DEV) return
    setDevNote(`"${item.label}" opens in the next step (window manager).`)
    window.clearTimeout(noteTimer.current)
    noteTimer.current = window.setTimeout(() => setDevNote(''), 2200)
  }

  return (
    <main
      className="os-shell desktop"
      onClick={() => setSelectedId(null)}
      style={wallpaperSrc ? { backgroundImage: `url(${wallpaperSrc})` } : undefined}
    >
      <ul className="desktop-icons" aria-label="Desktop shortcuts">
        {desktopIcons.map((item) => (
          <li key={item.id}>
            <DesktopIcon
              item={item}
              onOpen={openItem}
              onSelect={setSelectedId}
              selected={selectedId === item.id}
            />
          </li>
        ))}
      </ul>

      {import.meta.env.DEV && devNote && (
        <div className="dev-toast" role="status">{devNote}</div>
      )}

      <Taskbar />
    </main>
  )
}

export default Desktop