// Lightweight landscape scenes for customer-build tiles and journal cards.
// Four seeded variants so a grid of them reads with variety. Placeholder for
// real rider photography (see README).

const VARIANTS = [
  { sky: ['#0c0a08', '#3a2717'], ridge: '#141009', bike: true },
  { sky: ['#0a0b0c', '#2b2a26'], ridge: '#101010', bike: true },
  { sky: ['#0d0906', '#4a2f18'], ridge: '#0e0a06', bike: true },
  { sky: ['#080a0b', '#243019'], ridge: '#0c0e08', bike: false },
]

function BikeGlyph({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#040302">
      <circle cx="0" cy="30" r="15" />
      <circle cx="60" cy="30" r="15" />
      <path d="M0 30 L26 12 L44 10 L52 22 L52 30 L34 30 Z" />
      <path d="M20 12 L24 -4 L44 -6 L50 8 L44 10 L26 12 Z" />
      <path d="M60 30 L50 -4 L56 -6 L70 30 Z" />
      <path d="M44 -6 C 58 -14, 74 -12, 80 -2 L74 2 C 66 -6, 54 -6, 48 -1 Z" />
      {/* standing rider */}
      <path d="M30 20 L26 -6 L40 -8 L46 16 Z" />
      <circle cx="34" cy="-14" r="7" />
    </g>
  )
}

export default function SceneArt({ seed = 0 }: { seed?: number }) {
  const v = VARIANTS[seed % VARIANTS.length]
  const gid = `sky-${seed}`
  return (
    <svg
      viewBox="0 0 480 300"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={v.sky[0]} />
          <stop offset="100%" stopColor={v.sky[1]} />
        </linearGradient>
      </defs>
      <rect width="480" height="300" fill={`url(#${gid})`} />
      <ellipse cx="240" cy="230" rx="230" ry="46" fill="#a66b36" opacity="0.08" />
      {/* distant range */}
      <path
        d="M0 210 L80 186 L160 206 L250 178 L340 208 L420 184 L480 206 L480 300 L0 300 Z"
        fill="#000"
        opacity="0.35"
      />
      {/* foreground ridge */}
      <path
        d="M0 236 C 120 220, 240 228, 360 222 C 420 219, 460 226, 480 222 L480 300 L0 300 Z"
        fill={v.ridge}
      />
      {v.bike && <BikeGlyph x={196} y={190} s={0.9} />}
      {/* thin contour accents */}
      <g fill="none" stroke="#a7a29a" strokeWidth="1" opacity="0.07">
        <path d="M-10 120 C 120 90, 260 140, 380 110 S 500 80, 500 120" />
        <path d="M-10 160 C 120 130, 260 180, 380 150 S 500 120, 500 160" />
      </g>
    </svg>
  )
}
