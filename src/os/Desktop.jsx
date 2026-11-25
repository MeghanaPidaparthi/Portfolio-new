import { useEffect, useState } from 'react'
import { desktopIcons } from '../content/desktopIcons.js'
import WindowLayer from '../windows/WindowLayer.jsx'
import { useWindowStore } from '../windows/windowStore.js'
import { WELCOME_SEEN_KEY } from '../apps/welcome/Welcome.jsx'
import { welcome } from '../content/welcome.js'
import { getIconSource } from './icons.js'
import { launchItem } from './launch.js'
import Taskbar from './Taskbar.jsx'

const wallpaperFiles = import.meta.glob('../assets/wallpaper/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})
const wallpaperSrc = Object.values(wallpaperFiles)[0]

function isTouchPointer() {
  return window.matchMedia('(pointer: coarse)').matches
}

function DesktopIcon({ item, selected, onSelect, onOpen }) {
  const source = getIconSource(item.icon)

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
  const openWindow = useWindowStore((state) => state.open)
  const closeAll = useWindowStore((state) => state.closeAll)

  // Leaving the desktop (log off, shut down) closes every window.
  useEffect(() => closeAll, [closeAll])

  // First desktop of the session opens the welcome window. Strict-mode safe: the flag
  // is only set once the window has actually rendered.
  useEffect(() => {
    let seen = false
    try {
      seen = Boolean(window.sessionStorage.getItem(WELCOME_SEEN_KEY))
    } catch {
      // Storage blocked: show the welcome window.
    }
    if (!seen) {
      openWindow({
        key: 'welcome',
        appId: 'welcome',
        title: welcome.windowTitle,
        icon: 'welcome',
        size: { w: 503, h: 392 },
        dialog: true,
        center: true,
      })
    }
  }, [openWindow])

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
              onOpen={launchItem}
              onSelect={setSelectedId}
              selected={selectedId === item.id}
            />
          </li>
        ))}
      </ul>

      <WindowLayer />
      <Taskbar />
    </main>
  )
}

export default Desktop