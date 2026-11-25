import { useRef } from 'react'
import { AppView } from '../apps/registry.jsx'
import { getIconSource } from '../os/icons.js'
import CloseButtonArt from './CloseButtonArt.jsx'
import { useWindowStore } from './windowStore.js'

const MIN_VISIBLE = 100

function Window({ win, active, visible, isMobile }) {
  const frameRef = useRef(null)
  const focus = useWindowStore((state) => state.focus)
  const close = useWindowStore((state) => state.close)
  const minimise = useWindowStore((state) => state.minimise)
  const toggleMaximise = useWindowStore((state) => state.toggleMaximise)
  const move = useWindowStore((state) => state.move)

  const iconSource = win.icon ? getIconSource(win.icon) : undefined
  const isDialog = Boolean(win.dialog)
  const isMaximised = !isDialog && (win.maximised || isMobile)

  function startDrag(event) {
    if (isMaximised || event.button !== 0) return

    const frame = frameRef.current
    const handle = event.currentTarget
    const startX = event.clientX
    const startY = event.clientY
    const taskbarHeight = document.querySelector('.taskbar')?.offsetHeight ?? 30
    let nextX = win.x
    let nextY = win.y

    handle.setPointerCapture(event.pointerId)

    function handleMove(moveEvent) {
      nextX = Math.min(
        window.innerWidth - MIN_VISIBLE,
        Math.max(MIN_VISIBLE - win.w, win.x + moveEvent.clientX - startX),
      )
      nextY = Math.min(
        window.innerHeight - taskbarHeight - 30,
        Math.max(0, win.y + moveEvent.clientY - startY),
      )
      frame.style.left = `${nextX}px`
      frame.style.top = `${nextY}px`
    }

    function endDrag() {
      handle.removeEventListener('pointermove', handleMove)
      handle.removeEventListener('pointerup', endDrag)
      handle.removeEventListener('pointercancel', endDrag)
      move(win.id, nextX, nextY)
    }

    handle.addEventListener('pointermove', handleMove)
    handle.addEventListener('pointerup', endDrag)
    handle.addEventListener('pointercancel', endDrag)
  }

  function stopDrag(event) {
    event.stopPropagation()
  }

  const style = {
    zIndex: win.z,
    ...(isMaximised ? {} : { left: win.x, top: win.y, width: win.w, height: win.h }),
  }

  return (
    <section
      aria-label={win.title}
      className={`xp-window${active ? ' is-active' : ''}${isMaximised ? ' is-maximised' : ''}${isDialog ? ' is-dialog' : ''}${visible ? '' : ' is-hidden'}`}
      onPointerDown={() => focus(win.id)}
      ref={frameRef}
      role="dialog"
      style={style}
    >
      <header
        className="xp-titlebar"
        onDoubleClick={() => !isMobile && !isDialog && toggleMaximise(win.id)}
        onPointerDown={startDrag}
      >
        {iconSource && <img className="xp-titlebar-icon" src={iconSource} alt="" draggable="false" />}
        <span className="xp-titlebar-text">{win.title}</span>
        <div className="xp-titlebar-buttons">
          {!isDialog && (
            <>
              <button
                aria-label="Minimize"
                className="xp-button"
                onClick={() => minimise(win.id)}
                onPointerDown={stopDrag}
                type="button"
              >
                <svg viewBox="0 0 12 12" aria-hidden="true"><rect x="2" y="8" width="7" height="2.5" fill="#fff" /></svg>
              </button>
              {!isMobile && (
                <button
                  aria-label={win.maximised ? 'Restore' : 'Maximize'}
                  className="xp-button"
                  onClick={() => toggleMaximise(win.id)}
                  onPointerDown={stopDrag}
                  type="button"
                >
                  <svg viewBox="0 0 12 12" aria-hidden="true">
                    <rect x="2" y="2" width="8" height="8" fill="none" stroke="#fff" strokeWidth="1.5" />
                    <rect x="2" y="2" width="8" height="2.5" fill="#fff" />
                  </svg>
                </button>
              )}
            </>
          )}
          <button
            aria-label="Close"
            className="xp-button xp-button-close"
            onClick={() => close(win.id)}
            onPointerDown={stopDrag}
            type="button"
          >
            <CloseButtonArt dimmed={isDialog || !active} />
          </button>
        </div>
      </header>
      <div className="xp-window-body">
        <AppView appId={win.appId} windowId={win.id} title={win.title} {...win.props} />
      </div>
    </section>
  )
}

export default Window