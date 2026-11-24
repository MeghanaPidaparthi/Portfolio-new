import { useEffect, useState } from 'react'

const timeFormat = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
})
const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' })

/**
 * Live clock for the taskbar. Shows the visitor's real local time and updates
 * on the minute boundary of the system clock, so it never drifts.
 */
export function useClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    let timer = 0

    function tick() {
      setNow(new Date())
    }

    function schedule() {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        tick()
        schedule()
      }, 60000 - (Date.now() % 60000) + 20)
    }

    // Browsers throttle timers in background tabs, so re-sync when the tab returns.
    function handleVisibility() {
      if (document.visibilityState !== 'visible') return
      tick()
      schedule()
    }

    schedule()
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return {
    time: timeFormat.format(now).toUpperCase(),
    date: dateFormat.format(now),
    iso: now.toISOString(),
  }
}