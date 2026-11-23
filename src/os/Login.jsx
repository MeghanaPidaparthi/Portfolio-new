import { useEffect, useRef, useState } from 'react'
import { system } from '../content/system.js'
import { play, unlockAudio } from './audio.js'
import { useOsStore } from './osStore.js'

const avatarFiles = import.meta.glob('../assets/photos/avatar.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})
const avatarSrc = Object.values(avatarFiles)[0]

function getTransitionDuration() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 1000
}

function markSessionStarted() {
  try {
    window.sessionStorage.setItem('os-session', '1')
  } catch {
    // Continue to desktop if browser storage is unavailable.
  }
}

function Login() {
  const setOsState = useOsStore((state) => state.setOsState)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const transitionTimer = useRef(0)

  useEffect(() => () => window.clearTimeout(transitionTimer.current), [])

  function logIn() {
    if (isLoggingIn) return

    unlockAudio()
    void play('login')
    setIsLoggingIn(true)
    transitionTimer.current = window.setTimeout(() => {
      markSessionStarted()
      setOsState('desktop')
    }, getTransitionDuration())
  }

  return (
    <main className={`os-shell login-screen${isLoggingIn ? ' is-transitioning' : ''}`}>
      <header className="login-top-band" />

      <div className="login-stage">
        <section className="login-brand" aria-label="My Portfolio XP">
          <div
            className="boot-wordmark"
            aria-label={`${system.bootWordmarkTop} ${system.bootWordmarkMain} ${system.bootWordmarkSuffix}`}
          >
            <span className="boot-my">{system.bootWordmarkTop}</span>
            <span className="boot-portfolio">{system.bootWordmarkMain}</span>
            <span className="boot-xp">{system.bootWordmarkSuffix}</span>
          </div>
          <p className="login-welcome">{system.loginWelcomeText}</p>
        </section>

        <div className="login-divider" aria-hidden="true" />

        <section className="login-account" aria-label="User account">
          <button
            className="account-button"
            onClick={logIn}
            type="button"
            disabled={isLoggingIn}
            aria-label={`Log in as ${system.displayName}`}
          >
            {avatarSrc ? (
              <img className="account-avatar" src={avatarSrc} alt="" width="110" height="110" />
            ) : (
              <span className="account-avatar account-avatar-placeholder" aria-hidden="true">
                <svg viewBox="0 0 64 64" focusable="false">
                  <circle cx="32" cy="23" r="12" />
                  <path d="M10 58c1.8-12.2 10.6-19 22-19s20.2 6.8 22 19" />
                </svg>
              </span>
            )}
            <span className="account-name">{system.displayName}</span>
          </button>
        </section>
      </div>

      <footer className="login-bottom-band" />
    </main>
  )
}

export default Login