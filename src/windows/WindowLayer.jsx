import { useIsMobile } from './useIsMobile.js'
import Window from './Window.jsx'
import { getActiveId, useWindowStore } from './windowStore.js'

/** Renders every open window above the desktop and below the taskbar. */
function WindowLayer() {
  const windows = useWindowStore((state) => state.windows)
  const isMobile = useIsMobile()
  const activeId = getActiveId(windows)

  return (
    <div className="window-layer">
      {windows.map((win) => (
        <Window
          active={win.id === activeId}
          isMobile={isMobile}
          key={win.id}
          visible={!win.minimised && (!isMobile || win.id === activeId)}
          win={win}
        />
      ))}
    </div>
  )
}

export default WindowLayer