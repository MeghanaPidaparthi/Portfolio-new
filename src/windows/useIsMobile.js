import { useEffect, useState } from 'react'

const QUERY = '(max-width: 767px)'

/** True on phone-sized screens, where windows open maximised and cannot be dragged. */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    function handleChange(event) {
      setIsMobile(event.matches)
    }
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  return isMobile
}