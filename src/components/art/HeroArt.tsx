// Karoo dawn mountain-pass scene, rendered as self-contained SVG so the site
// ships with no external photography. Deep blacks, warm earth tones, a low
// dawn sun and a standing dual-sport rider on the ridge — believable, not
// over-graded. Swap for real hero photography at launch (see README).

export default function HeroArt({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="A dual-sport motorcycle and standing rider on a mountain pass at dawn in the South African Karoo."
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#080808" />
          <stop offset="42%" stopColor="#100c0a" />
          <stop offset="72%" stopColor="#2a1c12" />
          <stop offset="88%" stopColor="#5a3a1f" />
          <stop offset="100%" stopColor="#8b5e35" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="#d69a56" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#a66b36" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a66b36" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="m3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a2a1c" />
          <stop offset="100%" stopColor="#241a12" />
        </linearGradient>
        <linearGradient id="m2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241811" />
          <stop offset="100%" stopColor="#160f0a" />
        </linearGradient>
        <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c0906" />
          <stop offset="100%" stopColor="#050403" />
        </linearGradient>
      </defs>

      {/* sky + dawn glow */}
      <rect width="1440" height="900" fill="url(#sky)" />
      <rect x="0" y="360" width="1440" height="540" fill="url(#sun)" />

      {/* faint contour lines in the sky */}
      <g fill="none" stroke="#a7a29a" strokeWidth="1" opacity="0.06">
        <path d="M-20 200 C 300 150, 600 250, 900 200 S 1400 130, 1460 210" />
        <path d="M-20 260 C 320 210, 620 310, 920 260 S 1420 190, 1460 270" />
        <path d="M-20 130 C 300 90, 600 180, 900 130 S 1400 70, 1460 150" />
      </g>

      {/* distant range */}
      <path
        d="M0 560 L120 520 L240 548 L360 500 L470 545 L600 505 L760 552 L900 512 L1040 548 L1200 508 L1320 545 L1440 520 L1440 900 L0 900 Z"
        fill="url(#m2)"
        opacity="0.85"
      />
      {/* mid range — flat-topped Karoo koppies */}
      <path
        d="M0 640 L160 640 L200 560 L360 560 L400 636 L560 636 L610 588 L740 588 L775 648 L980 648 L1010 596 L1150 596 L1185 652 L1440 652 L1440 900 L0 900 Z"
        fill="url(#m3)"
      />

      {/* foreground ridge the rider sits on */}
      <path
        d="M0 742 C 220 700, 430 712, 640 706 C 900 698, 1120 726, 1440 700 L1440 900 L0 900 Z"
        fill="url(#fg)"
      />

      {/* dust haze near horizon */}
      <ellipse cx="720" cy="690" rx="620" ry="60" fill="#a66b36" opacity="0.06" />

      {/* --- Rider + dual-sport motorcycle silhouette --- */}
      <g
        transform="translate(690 560) scale(1.05)"
        fill="#040302"
        stroke="none"
      >
        {/* wheels */}
        <g>
          <circle cx="0" cy="150" r="42" />
          <circle cx="0" cy="150" r="21" fill="#120d08" />
          <circle cx="176" cy="150" r="42" />
          <circle cx="176" cy="150" r="21" fill="#120d08" />
        </g>
        {/* tire knob ticks (subtle) */}
        <g stroke="#040302" strokeWidth="5">
          <line x1="0" y1="106" x2="0" y2="98" />
          <line x1="30" y1="120" x2="36" y2="114" />
          <line x1="42" y1="150" x2="50" y2="150" />
          <line x1="176" y1="106" x2="176" y2="98" />
          <line x1="206" y1="120" x2="212" y2="114" />
          <line x1="218" y1="150" x2="226" y2="150" />
        </g>

        {/* swingarm + engine + tank body */}
        <path d="M0 150 L70 108 L118 100 L150 118 L150 150 L96 150 Z" />
        <path d="M52 118 L60 78 L120 70 L138 96 L118 108 L70 112 Z" />
        {/* seat / subframe to rear */}
        <path d="M18 116 L58 84 L96 82 L84 104 L44 118 Z" />
        {/* rear guard */}
        <path d="M6 118 L40 92 L54 96 L26 122 Z" />

        {/* front forks (long travel) */}
        <path d="M176 150 L150 66 L160 62 L186 150 Z" />
        {/* high front fender */}
        <path d="M150 60 C 172 44, 210 48, 224 66 L214 74 C 200 60, 176 58, 158 70 Z" />
        {/* handlebar + rally tower nod */}
        <path d="M138 60 L156 44 L160 48 L146 62 Z" />
        <path d="M150 46 L150 20 L166 18 L164 46 Z" opacity="0.95" />

        {/* --- standing rider --- */}
        {/* boots on pegs */}
        <path d="M96 132 L118 128 L120 138 L98 142 Z" />
        {/* legs (bent, standing) */}
        <path d="M104 132 L96 96 L112 92 L120 128 Z" />
        {/* torso leaning forward */}
        <path d="M96 96 L92 56 L120 50 L128 84 L112 92 Z" />
        {/* arms to bars */}
        <path d="M118 62 L150 52 L154 62 L120 74 Z" />
        {/* helmet */}
        <circle cx="112" cy="40" r="16" />
        <path d="M124 34 L138 32 L138 42 L126 44 Z" />
      </g>

      {/* dawn rim-light on the rider's upper edge */}
      <g
        transform="translate(690 560) scale(1.05)"
        fill="none"
        stroke="#c98a4e"
        strokeWidth="2"
        opacity="0.55"
        strokeLinecap="round"
      >
        <path d="M96 24 A16 16 0 0 1 128 34" />
        <path d="M92 56 L120 50" />
        <path d="M150 20 L166 18" />
      </g>

      {/* subtle foreground vignette */}
      <rect
        width="1440"
        height="900"
        fill="url(#sky)"
        opacity="0"
      />
    </svg>
  )
}
