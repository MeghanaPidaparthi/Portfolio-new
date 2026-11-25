import { useState } from 'react'
import bootLogo from '../assets/icons/boot-logo.svg'
import hotplugIcon from '../assets/icons/hotplug.png'
import networkIcon from '../assets/icons/network-activity.png'
import overflowIcon from '../assets/icons/overflow-button.png'
import securityIcon from '../assets/icons/windows-security-center-ok.png'
import { useClock } from '../hooks/useClock.js'
import { getActiveId, useWindowStore } from '../windows/windowStore.js'
import { getIconSource } from './icons.js'
import { mute, unmute } from './audio.js'
import { useOsStore } from './osStore.js'
import StartMenu from './StartMenu.jsx'

function SpeakerIcon({ muted }) {
  return (
    <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true" focusable="false">
      <path d="M3 9h4l5-4v14l-5-4H3z" fill="#e8eef9" stroke="#5a6b8c" strokeWidth="1" strokeLinejoin="round" />
      {muted ? (
        <path d="M15 9l6 6M21 9l-6 6" stroke="#ff6a4d" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <>
          <path d="M15 9.5q2 2.5 0 5" fill="none" stroke="#e8eef9" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M17.5 7q4 5 0 10" fill="none" stroke="#e8eef9" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

function Taskbar() {
  const muted = useOsStore((state) => state.muted)
  const { time, date, iso } = useClock()
  const windows = useWindowStore((state) => state.windows)
  const focusWindow = useWindowStore((state) => state.focus)
  const minimiseWindow = useWindowStore((state) => state.minimise)
  const restoreWindow = useWindowStore((state) => state.restore)
  const activeId = getActiveId(windows)
  const volumeSource = getIconSource(muted ? 'volume-muted' : 'volume')
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isTrayExpanded, setIsTrayExpanded] = useState(true)

  function handleTabClick(win) {
    if (win.minimised) restoreWindow(win.id)
    else if (win.id === activeId) minimiseWindow(win.id)
    else focusWindow(win.id)
  }

  function toggleMute() {
    if (muted) unmute()
    else mute()
  }

  return (
    <footer className="taskbar">
      {isStartOpen && <StartMenu onClose={() => setIsStartOpen(false)} />}

      <button
        aria-expanded={isStartOpen}
        aria-haspopup="menu"
        className={`start-button${isStartOpen ? ' is-open' : ''}`}
        onClick={() => setIsStartOpen((open) => !open)}
        type="button"
      >
        <img className="start-logo" src={bootLogo} alt="" draggable="false" />
        <span>start</span>
      </button>

      <div className="taskbar-tabs" role="toolbar" aria-label="Open windows">
        {windows.map((win) => {
          const iconSource = win.icon ? getIconSource(win.icon) : undefined
          return (
            <button
              aria-pressed={win.id === activeId}
              className={`program-tab${win.id === activeId && !win.dialog ? ' is-active' : ''}`}
              key={win.id}
              onClick={() => handleTabClick(win)}
              title={win.title}
              type="button"
            >
              {iconSource && <img src={iconSource} alt="" draggable="false" />}
              <span>{win.title}</span>
            </button>
          )
        })}
      </div>

      <div className="tray" role="group" aria-label="Notification area">
        <button
          aria-expanded={isTrayExpanded}
          aria-label={isTrayExpanded ? 'Hide notification icons' : 'Show notification icons'}
          className="tray-overflow"
          onClick={() => setIsTrayExpanded((expanded) => !expanded)}
          type="button"
        >
          <img
            className={isTrayExpanded ? '' : 'is-flipped'}
            src={overflowIcon}
            alt=""
            draggable="false"
          />
        </button>
        {isTrayExpanded && (
          <>
            <img className="tray-icon" src={hotplugIcon} alt="" draggable="false" />
            <img className="tray-icon" src={securityIcon} alt="" draggable="false" />
            <img className="tray-icon" src={networkIcon} alt="" draggable="false" />
          </>
        )}
        <button
          aria-label={muted ? 'Unmute audio' : 'Mute audio'}
          aria-pressed={!muted}
          className="tray-button"
          onClick={toggleMute}
          type="button"
        >
          {volumeSource ? (
            <img src={volumeSource} alt="" draggable="false" />
          ) : (
            <SpeakerIcon muted={muted} />
          )}
        </button>
        {/* TODO (Phase 2): double click opens the Clock/Calendar app. */}
        <time className="tray-clock" dateTime={iso} title={date} aria-label={`${time}, ${date}`}>
          {time}
        </time>
      </div>
    </footer>
  )
}

export default Taskbar