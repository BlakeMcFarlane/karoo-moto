import type { FeatureIcon } from '../../data/rallyTower'

/**
 * Technical line-icon set drawn specifically for the Rally Tower feature grid.
 *
 * Drawn on a 24 unit grid with a 1.5 stroke, square-ish geometry and no
 * decorative flourishes — the same visual register as the laser-cut plate and
 * the machined hardware in the product photography.
 */

export type RallyIconName = FeatureIcon | 'arrow' | 'check' | 'chevron' | 'shield'

const paths: Record<RallyIconName, JSX.Element> = {
  // High-output riding light: a round optic throwing a beam to the right.
  // (Drawn as a lamp, not a reflector-and-arcs — that reads as a loudspeaker.)
  beam: (
    <>
      <circle cx="8" cy="12" r="4.5" />
      <circle cx="8" cy="12" r="1.6" />
      <path d="M14.5 8.5h2.5M14.5 12h4M14.5 15.5h2.5" />
      <path d="M21 6.5v11" />
    </>
  ),
  // Yellow dust light: quad optic behind a haze band.
  dust: (
    <>
      <rect x="3.5" y="5.5" width="10" height="10" rx="1.5" />
      <circle cx="7" cy="9" r="1.4" />
      <circle cx="10.5" cy="9" r="1.4" />
      <circle cx="7" cy="12.5" r="1.4" />
      <circle cx="10.5" cy="12.5" r="1.4" />
      <path d="M17 7.5h4M16 10.5h5M17 13.5h4M15.5 18.5h5" />
    </>
  ),
  usb: (
    <>
      <path d="M11 21V6" />
      <path d="M8.5 6h5l-2.5-3z" />
      <path d="M11 15l4-3V8.5" />
      <rect x="13.5" y="5" width="3" height="3" rx="0.5" />
      <path d="M11 17.5l-4-3v-2.5" />
      <circle cx="7" cy="10.5" r="1.4" />
    </>
  ),
  gps: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2" />
      <path d="M9.5 9.5l7-2.5-2.5 7-1.4-3.1z" />
      <path d="M10.5 19h3" />
    </>
  ),
  volt: (
    <>
      <rect x="2.5" y="6.5" width="15" height="11" rx="1.5" />
      <path d="M17.5 10h2.5a1.5 1.5 0 0 1 0 4h-2.5" />
      <path d="M10.5 9l-2.5 4h4l-2.5 4" />
    </>
  ),
  switch: (
    <>
      <rect x="3.5" y="7" width="17" height="10" rx="3" />
      <circle cx="15.5" cy="12" r="3" />
      <path d="M6.5 12h3" />
    </>
  ),
  fuse: (
    <>
      <rect x="3" y="8" width="18" height="8" rx="1.5" />
      <path d="M7 8v8M17 8v8" />
      <path d="M7 12h10" />
      <path d="M12 4v4M12 16v4" />
    </>
  ),
  loom: (
    <>
      <path d="M4 5c5 0 5 7 10 7s6-7 6-7" />
      <path d="M4 12c5 0 5 7 10 7s6-7 6-7" />
      <circle cx="4" cy="5" r="1.4" />
      <circle cx="4" cy="12" r="1.4" />
      <circle cx="20" cy="19" r="1.4" />
    </>
  ),
  // Model-specific mount: fork tubes with a clamp across them.
  mount: (
    <>
      <path d="M7 3v18M17 3v18" />
      <rect x="3.5" y="9" width="17" height="5" rx="1.5" />
      <path d="M12 9v5" />
      <circle cx="9.5" cy="11.5" r="0.9" />
      <circle cx="14.5" cy="11.5" r="0.9" />
    </>
  ),
  // 4 mm polycarbonate screen: a windscreen seen edge-on, with the sheet
  // thickness called out by the doubled leading edge.
  screen: (
    <>
      <path d="M6.5 20.5c0-7 1.8-12 6-16.5" />
      <path d="M9.5 20.5c0-7 1.8-12 6-16.5" />
      <path d="M4 20.5h8" />
      <path d="M18.5 6.5v6" />
      <path d="M17 8l1.5-1.5L20 8" />
      <path d="M17 11l1.5 1.5L20 11" />
    </>
  ),
  // CNC-routed: a spinning cutter plunged into stock, chips lifting either side.
  cnc: (
    <>
      <path d="M10 2.5h4v7.5l-2 2.5-2-2.5z" />
      <path d="M10 5.5h4M10 8h4" />
      <path d="M3.5 15.5h17v5h-17z" />
      <path d="M8 15.5c0-1.2.8-2 1.8-2M16 15.5c0-1.2-.8-2-1.8-2" />
    </>
  ),
  // Powder coating: surface with a spray fan.
  coat: (
    <>
      <path d="M3.5 19h17" />
      <path d="M8 4.5h4v4H8z" />
      <path d="M12 6.5h3l3-2v6l-3-2h-3" />
      <path d="M6 15.5c2-2 10-2 12 0" />
    </>
  ),
  // 8.8-grade stainless bolt: hex head, shank, washer.
  bolt: (
    <>
      <path d="M8 3.5l4-2 4 2v4l-4 2-4-2z" />
      <path d="M10.5 9.5v9M13.5 9.5v9" />
      <path d="M7 18.5h10" />
      <path d="M12 4.5v3" />
    </>
  ),
  // Lightweight: a feather. Unambiguous at 24px in a way a scale beam is not.
  weight: (
    <>
      <path d="M19.5 4.5c-8 0-12 4.2-12 9.2 0 1.6.4 3 1.1 4.1" />
      <path d="M19.5 4.5c0 8-4.2 12-9.2 12-1.6 0-3-.4-4.1-1.1" />
      <path d="M13.8 4.9 4 20.5" />
      <path d="M16.4 9.2h-5.2M13.2 13.6H9" />
    </>
  ),
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  check: <path d="M4.5 12.5l4.5 4.5L19.5 6.5" />,
  chevron: <path d="M9 5l7 7-7 7" />,
  shield: (
    <>
      <path d="M12 2.5l8 3v6c0 5-3.4 9.1-8 11-4.6-1.9-8-6-8-11v-6z" />
      <path d="M8.5 12l2.5 2.5 4.5-5" />
    </>
  ),
}

interface RallyIconProps {
  name: RallyIconName
  size?: number
  className?: string
  strokeWidth?: number
}

export default function RallyIcon({
  name,
  size = 24,
  className,
  strokeWidth = 1.5,
}: RallyIconProps) {
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
