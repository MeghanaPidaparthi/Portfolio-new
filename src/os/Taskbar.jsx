import { useState } from 'react'
import bootLogo from '../assets/icons/boot-logo.svg'
import hotplugIcon from '../assets/icons/hotplug.png'
import networkIcon from '../assets/icons/network-activity.png'
import overflowIcon from '../assets/icons/overflow-button.png'
import securityIcon from '../assets/icons/windows-security-center-ok.png'
import { useClock } from '../hooks/useClock.js'
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
  const [isStartOpen, setIsStartOpen] = useState(false)
  const [isTrayExpanded, setIsTrayExpanded] = useState(true)

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

      {/* Program tabs for open windows are added here by the window manager step. */}
      <div className="taskbar-tabs" />

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
          <SpeakerIcon muted={muted} />
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