import { useEffect } from 'react'
import { system } from '../content/system.js'
import bootLogo from '../assets/icons/boot-logo.svg'
import { useOsStore } from './osStore.js'

const BOOT_DURATION_MS = 3500
const REDUCED_MOTION_DURATION_MS = 180

function getBootDuration() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? REDUCED_MOTION_DURATION_MS
    : BOOT_DURATION_MS
}

function markBootSeen() {
  try {
    window.sessionStorage.setItem('os-session', 'booted')
  } catch {
    // Continue to login if browser storage is unavailable.
  }
}

function Boot() {
  const setOsState = useOsStore((state) => state.setOsState)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      markBootSeen()
      setOsState('login')
    }, getBootDuration())

    return () => window.clearTimeout(timer)
  }, [setOsState])

  return (
    <main className="os-shell boot-screen" aria-label="Portfolio boot screen">
      <section className="boot-brand" aria-label="My Portfolio XP">
        <img className="boot-logo" src={bootLogo} alt="" />
        <div className="boot-wordmark" aria-label={`${system.bootWordmarkTop} ${system.bootWordmarkMain} ${system.bootWordmarkSuffix}`}>
          <span className="boot-my">{system.bootWordmarkTop}</span>
          <span className="boot-portfolio">{system.bootWordmarkMain}</span>
          <span className="boot-xp">{system.bootWordmarkSuffix}</span>
        </div>
      </section>

      <div
        className="boot-progress"
        role="progressbar"
        aria-label={system.bootText}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <span className="boot-progress-segments" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </div>

      <footer className="boot-footer">
        <span>{system.siteName}</span>
      </footer>
    </main>
  )
}

export default Boot
