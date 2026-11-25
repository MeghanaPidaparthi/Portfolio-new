import { useId } from 'react'

/** Green bullet arrow from the design, with unique gradient ids so it can repeat. */
function GreenArrow() {
  const uid = useId().replace(/:/g, '')
  const fillPath =
    'M8.60372 4.86681C9.24179 5.25674 9.24179 6.18344 8.60372 6.57337L2.52145 10.2903C1.8551 10.6975 1 10.218 1 9.43704L1 2.00315C1 1.22222 1.8551 0.742652 2.52145 1.14987L8.60372 4.86681Z'
  return (
    <svg className="welcome-arrow" width="11" height="12" viewBox="0 0 11 12" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}a`} x1="-2" y1="-0.63076" x2="7.09489" y2="13.8905" gradientUnits="userSpaceOnUse">
          <stop offset="0.544307" stopColor="#69BD46" />
          <stop offset="0.698619" stopColor="#56AD2B" />
        </linearGradient>
        <radialGradient id={`${uid}b`} cx="0" cy="0" r="1" gradientTransform="matrix(4.08333 3.30556 -5.2598 2.88773 3.16667 3.97009)" gradientUnits="userSpaceOnUse">
          <stop offset="0.00244799" stopColor="white" />
          <stop offset="0.725962" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id={`${uid}f`} x="0" y="0.836823" width="9.76392" height="9.76654" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="bg" />
          <feBlend mode="normal" in="SourceGraphic" in2="bg" result="shape" />
          <feGaussianBlur stdDeviation="1" />
        </filter>
        <mask id={`${uid}m`} maskUnits="userSpaceOnUse" x="0" y="-0.779907" width="11" height="13">
          <rect fill="white" y="-0.779907" width="11" height="13" />
          <path d={fillPath} fill="black" />
        </mask>
      </defs>
      <path d={fillPath} fill={`url(#${uid}a)`} />
      <path
        d="M1 2.00315L1 9.43704C1 10.218 1.8551 10.6975 2.52145 10.2903L8.60372 6.57337C9.24179 6.18345 9.24179 5.25674 8.60372 4.86681L2.52145 1.14987C1.8551 0.742652 1 1.22222 1 2.00315Z"
        stroke="#3E722A"
        strokeWidth="2"
        mask={`url(#${uid}m)`}
      />
      <g filter={`url(#${uid}f)`}>
        <path
          d="M7.21114 4.82566C7.94819 5.19419 7.94819 6.246 7.21115 6.61452L3.44721 8.49649C2.78231 8.82894 2 8.34544 2 7.60206L2 3.83813C2 3.09474 2.78231 2.61125 3.44721 2.9437L7.21114 4.82566Z"
          fill={`url(#${uid}b)`}
          fillOpacity="0.75"
        />
      </g>
    </svg>
  )
}

export default GreenArrow