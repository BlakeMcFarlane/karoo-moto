// Simple line-icon set — consistent 1.5–2px stroke per the brand guide.
// Icons inherit `currentColor` and default to 24px.

interface IconProps {
  name: IconName
  size?: number
  className?: string
  strokeWidth?: number
}

export type IconName =
  | 'search'
  | 'cart'
  | 'user'
  | 'menu'
  | 'close'
  | 'arrow-right'
  | 'arrow-left'
  | 'chevron-right'
  | 'check'
  | 'plus'
  | 'minus'
  | 'compass'
  | 'shield'
  | 'bulb'
  | 'bag'
  | 'gauge'
  | 'tower'
  | 'wrench'
  | 'map-pin'
  | 'mail'
  | 'phone'
  | 'truck'
  | 'globe'
  | 'file'
  | 'play'
  | 'flag'
  | 'mountain'
  | 'bike'
  | 'star'
  | 'cog'
  | 'ruler'

const paths: Record<IconName, JSX.Element> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  cart: (
    <>
      <path d="M3 4h2l2.4 12.4a1 1 0 0 0 1 .8h9.3a1 1 0 0 0 1-.8L21 8H6" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="18" cy="20" r="1.3" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  menu: (
    <>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6L6 18" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  'arrow-left': (
    <>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </>
  ),
  'chevron-right': (
    <>
      <path d="M9 6l6 6-6 6" />
    </>
  ),
  check: (
    <>
      <path d="M4 12l5 5L20 6" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14M5 12h14" />
    </>
  ),
  minus: (
    <>
      <path d="M5 12h14" />
    </>
  ),
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.6.6 1 1.4 1 2.2V16h6v-.3c0-.8.4-1.6 1-2.2A6 6 0 0 0 12 3z" />
    </>
  ),
  bag: (
    <>
      <path d="M6 8h12l-1 12H7L6 8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 15a8 8 0 0 1 16 0" />
      <path d="M12 15l4-4" />
      <circle cx="12" cy="15" r="1" />
    </>
  ),
  tower: (
    <>
      <path d="M8 21V6l4-3 4 3v15" />
      <path d="M8 10h8M8 15h8" />
      <path d="M5 21h14" />
    </>
  ),
  wrench: (
    <>
      <path d="M15 5a4 4 0 0 0-5 5L4 16l4 4 6-6a4 4 0 0 0 5-5l-3 3-2-2 3-3z" />
    </>
  ),
  'map-pin': (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  phone: (
    <>
      <path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 5 5L20 12l2 5v3a1 1 0 0 1-1 1A17 17 0 0 1 4 4a1 1 0 0 1 1-1z" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 13h6M9 17h6" />
    </>
  ),
  play: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5l6 3.5-6 3.5v-7z" fill="currentColor" stroke="none" />
    </>
  ),
  flag: (
    <>
      <path d="M6 21V4M6 4h11l-2 4 2 4H6" />
    </>
  ),
  mountain: (
    <>
      <path d="M3 20l6-11 4 6 2-3 6 8z" />
    </>
  ),
  bike: (
    <>
      <circle cx="6" cy="16" r="3.2" />
      <circle cx="18" cy="16" r="3.2" />
      <path d="M6 16l4-7h5l2 4M9 9h5l3 7M9 9l-1-2H6" />
    </>
  ),
  star: (
    <>
      <path d="M12 3l2.6 5.5 6 .8-4.3 4.2 1 6-5.3-2.9L6.7 19.5l1-6L3.4 9.3l6-.8L12 3z" />
    </>
  ),
  cog: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3v3M12 18v3M5 5l2 2M17 17l2 2M3 12h3M18 12h3M5 19l2-2M17 7l2-2" />
    </>
  ),
  ruler: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="1" transform="rotate(0 12 12)" />
      <path d="M7 8v3M11 8v4M15 8v3M19 8v4" />
    </>
  ),
}

export default function Icon({
  name,
  size = 24,
  className,
  strokeWidth = 1.7,
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}
