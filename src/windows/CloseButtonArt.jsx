import { useId } from 'react'

/**
 * Close button artwork from the design. The 0.6 opacity version is the dimmed
 * look used on inactive windows and dialogs; the X itself is always solid.
 * @param {{ dimmed?: boolean }} props
 */
function CloseButtonArt({ dimmed = false }) {
  const uid = useId().replace(/:/g, '')
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" aria-hidden="true">
      <g opacity={dimmed ? 0.6 : 1}>
        <g filter={`url(#${uid}i)`}>
          <rect x="2" y="2" width="19" height="19" rx="2" fill={`url(#${uid}p0)`} />
        </g>
        <rect x="1.5" y="1.5" width="20" height="20" rx="2.5" stroke="white" />
        <rect
          x="2.5"
          y="2.5"
          width="18"
          height="18"
          rx="1.5"
          stroke={`url(#${uid}p1)`}
          strokeOpacity="0.5"
          style={{ mixBlendMode: 'color-burn' }}
        />
        <g filter={`url(#${uid}f)`}>
          <rect x="4" y="4" width="1" height="15" fill={`url(#${uid}p2)`} />
          <rect x="4" y="4" width="15" height="1" fill={`url(#${uid}p3)`} />
          <rect x="3" y="3" width="2" height="2" fill="white" />
        </g>
      </g>
      <path d="M7 16L16 7M7 7L16 16" strokeWidth="2" strokeLinecap="round" stroke="white" />
      <defs>
        <filter id={`${uid}i`} x="-1" y="-2" width="29" height="26" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feMorphology radius="2" operator="dilate" in="SourceAlpha" result="s1" />
          <feOffset dx="10" dy="2" />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="shape" result="s1b" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha2" />
          <feOffset dx="-2" dy="-3" />
          <feGaussianBlur stdDeviation="2.5" />
          <feComposite in2="hardAlpha2" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.666667 0 0 0 0 0.137255 0 0 0 0 0 0 0 0 1 0" />
          <feBlend mode="normal" in2="s1b" result="s2" />
        </filter>
        <filter id={`${uid}f`} x="0" y="0" width="22" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <linearGradient id={`${uid}p0`} x1="11.5" y1="2" x2="11.5" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E46446" />
          <stop offset="1" stopColor="#E65D32" />
        </linearGradient>
        <linearGradient id={`${uid}p1`} x1="2" y1="2" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E45F3E" />
          <stop offset="0.333822" stopColor="#EE3000" />
          <stop offset="1" stopColor="#4E1000" />
        </linearGradient>
        <linearGradient id={`${uid}p2`} x1="4.5" y1="4" x2="4.5" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}p3`} x1="4" y1="4.5" x2="19" y2="4.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default CloseButtonArt