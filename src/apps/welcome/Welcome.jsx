import { useEffect } from 'react'
import { welcome } from '../../content/welcome.js'
import { launchById } from '../../os/launch.js'
import { useWindowStore } from '../../windows/windowStore.js'
import GreenArrow from './GreenArrow.jsx'

const bannerFiles = import.meta.glob('../../assets/welcome/banner.{png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})
const bannerSrc = Object.values(bannerFiles)[0]

export const WELCOME_SEEN_KEY = 'welcome-seen'

function Welcome({ windowId }) {
  const close = useWindowStore((state) => state.close)

  useEffect(() => {
    try {
      window.sessionStorage.setItem(WELCOME_SEEN_KEY, '1')
    } catch {
      // Storage can be blocked. The welcome window then simply shows again next login.
    }
  }, [])

  function handleNext() {
    close(windowId)
    launchById(welcome.nextOpens)
  }

  return (
    <div className="welcome">
      <div className="welcome-main">
        <div className="welcome-banner" aria-hidden="true">
          {bannerSrc && <img src={bannerSrc} alt="" draggable="false" />}
        </div>
        <div className="welcome-content">
          <h1>{welcome.heading}</h1>
          <p className="welcome-intro">{welcome.intro}</p>
          <ul className="welcome-list">
            {welcome.items.map((item) => (
              <li key={item.label}>
                <GreenArrow />
                {item.open ? (
                  <button className="welcome-link" onClick={() => launchById(item.open)} type="button">
                    {item.label}
                  </button>
                ) : (
                  <span>{item.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="welcome-footer">
        <button className="xp-btn" disabled type="button">
          &lt; Previous
        </button>
        <button className="xp-btn is-default" onClick={handleNext} type="button">
          Next &gt;
        </button>
        <button className="xp-btn" onClick={() => close(windowId)} type="button">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default Welcome