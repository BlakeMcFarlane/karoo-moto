import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import Reveal from './Reveal'
import { RIDER_FOCUSED } from '../../data/rallyTower'
import {
  easeInOut,
  mapRange,
  usePrefersReducedMotion,
  useScrollProgress,
} from '../../lib/motion'

const TITLE_ID = 'rt-steer-title'
const DIAGRAM_TITLE_ID = 'rt-steer-diagram-title'

/** Steering lock the scrubbed sweep runs between, in degrees. */
const LOCK = 26
/** Resting angle for the static composition — enough to read as "turned". */
const STATIC_ANGLE = 22
/** Below this the scene is composed statically instead of scrubbed. */
// Matches the CSS: below 1101px the scene is static, so the angle must rest
// at its demonstration pose rather than scrub in a layout that never pins.
const COMPACT_QUERY = '(max-width: 1100px)'

/**
 * A tall scrubbed sticky scene is a trap on a phone, so the diagram falls back
 * to a single composed frame below the tablet breakpoint. Tracked in JS rather
 * than CSS because the steering angle and the hint copy both change with it.
 */
function useCompactLayout(): boolean {
  const [compact, setCompact] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(COMPACT_QUERY).matches
      : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_QUERY)
    const onChange = () => setCompact(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return compact
}

/**
 * Rider-Focused Design — the page's central argument, made as a diagram rather
 * than a claim.
 *
 * The scene is a plan view of a front end. Scrolling steers it from full left
 * lock to full right lock; the ember beam is emitted by the tower and lives
 * inside the rotating group, so it tracks the bars, while the teal beam is
 * emitted by the frame and never moves. The contrast between the two is the
 * whole product story, so it is the only thing animating here.
 */
export default function RiderFocused() {
  const reduced = usePrefersReducedMotion()
  const compact = useCompactLayout()
  const [sceneRef, progress] = useScrollProgress<HTMLDivElement>({
    mode: 'through',
    // Keep the reader's place in the scrub when the window is resized.
    anchorOnResize: true,
  })

  const isStatic = reduced || compact
  const angle = isStatic
    ? STATIC_ANGLE
    : mapRange(easeInOut(progress), 0, 1, -LOCK, LOCK)

  // One small text node driven from React; the rotation itself is CSS.
  const whole = Math.round(angle)
  const readout =
    whole === 0 ? '0°' : `${whole < 0 ? '−' : '+'}${Math.abs(whole)}°`

  const svgStyle = {
    '--rt-steer-angle': `${angle.toFixed(2)}deg`,
  } as CSSProperties

  return (
    <section
      id={RIDER_FOCUSED.id}
      className="rt-section rt-section--panel rt-steer"
      aria-labelledby={TITLE_ID}
    >
      <div className="rt-container">
        <div
          className={`rt-steer__scene${isStatic ? ' rt-steer__scene--static' : ''}`}
          ref={sceneRef}
        >
          <div className="rt-steer__inner">
            <div className="rt-steer__copy">
              <Reveal className="rt-head rt-head--wide" variant="up">
                <p className="rt-eyebrow">{RIDER_FOCUSED.eyebrow}</p>
                <h2 id={TITLE_ID} className="rt-h2 rt-h2--sentence">
                  {RIDER_FOCUSED.title}
                </h2>
              </Reveal>

              <Reveal variant="up" delay={100} className="rt-steer__prose">
                {RIDER_FOCUSED.body.map((paragraph) => (
                  <p key={paragraph} className="rt-body-copy">
                    {paragraph}
                  </p>
                ))}
              </Reveal>

              <Reveal variant="up" delay={200}>
                <ul className="rt-steer__legend">
                  <li className="rt-steer__legend-row">
                    <span
                      className="rt-steer__swatch rt-steer__swatch--turning"
                      aria-hidden="true"
                    />
                    <span className="rt-steer__legend-label">
                      {RIDER_FOCUSED.diagram.turning}
                    </span>
                  </li>
                  <li className="rt-steer__legend-row">
                    <span
                      className="rt-steer__swatch rt-steer__swatch--fixed"
                      aria-hidden="true"
                    />
                    <span className="rt-steer__legend-label">
                      {RIDER_FOCUSED.diagram.fixed}
                    </span>
                  </li>
                </ul>
              </Reveal>
            </div>

            <div className="rt-steer__stage">
              <svg
                className="rt-steer__svg"
                viewBox="0 0 520 680"
                preserveAspectRatio="xMidYMid meet"
                role="img"
                aria-labelledby={DIAGRAM_TITLE_ID}
                style={svgStyle}
              >
                <title id={DIAGRAM_TITLE_ID}>
                  A motorcycle front end seen from above. The Rally Tower is
                  mounted to the triple clamp, so its light beam swings with the
                  handlebars into the turn, while a frame-mounted beam stays
                  pointed straight ahead.
                </title>

                <defs>
                  {/* Both gradients run apex → far end of their cone. They sit
                      inside the shape's own user space, so the ember one
                      rotates with the steering group for free. */}
                  <linearGradient id="rtSteerBeam" x1="0" y1="1" x2="0" y2="0">
                    <stop className="rt-steer__stop-beam-a" offset="0" />
                    <stop className="rt-steer__stop-beam-b" offset="0.42" />
                    <stop className="rt-steer__stop-beam-c" offset="1" />
                  </linearGradient>
                  <linearGradient id="rtSteerFixed" x1="0" y1="1" x2="0" y2="0">
                    <stop className="rt-steer__stop-fixed-a" offset="0" />
                    <stop className="rt-steer__stop-fixed-b" offset="0.5" />
                    <stop className="rt-steer__stop-fixed-c" offset="1" />
                  </linearGradient>
                </defs>

                {/* Steering geometry: sweep arcs, lock marks, straight-ahead datum. */}
                <g className="rt-steer__guides">
                  <path d="M135 173.5A250 250 0 0 1 385 173.5" />
                  <path d="M177.5 247.1A165 165 0 0 1 342.5 247.1" />
                  <path d="M325.8 255.2 378.4 147.3" />
                  <path d="M194.2 255.2 141.6 147.3" />
                  <path d="M260 250V120" />
                </g>

                {/* Conventional frame-mounted beam — drawn under everything so
                    the rotating assembly reads on top of it. */}
                <path
                  className="rt-steer__cone rt-steer__cone--fixed"
                  d="M246 436 125 20H395L274 436Z"
                  fill="url(#rtSteerFixed)"
                />

                {/* Static chassis: rear wheel, spine, frame-mounted lamp. */}
                <g className="rt-steer__chassis">
                  <rect x="250" y="560" width="20" height="75" rx="9" />
                  <path d="M260 560V392" />
                  <path d="M232 470h56" />
                  <path d="M243 524h34" />
                  <rect x="242" y="428" width="36" height="12" rx="3" />
                </g>

                <g className="rt-steer__rotor">
                  {/* Pins the group's fill-box to the full viewBox so the CSS
                      transform-origin can be given in diagram coordinates. */}
                  <rect
                    className="rt-steer__extent"
                    x="0"
                    y="0"
                    width="520"
                    height="680"
                    fill="none"
                  />

                  <path
                    className="rt-steer__cone rt-steer__cone--turning"
                    d="M244 306 169 20H351L276 306Z"
                    fill="url(#rtSteerBeam)"
                  />

                  {/* Front wheel, triple clamp, fork tubes, bars. */}
                  <g className="rt-steer__rig">
                    <rect x="250" y="290" width="20" height="120" rx="9" />
                    <rect x="226" y="370" width="68" height="18" rx="4" />
                    <circle cx="236" cy="379" r="4.5" />
                    <circle cx="284" cy="379" r="4.5" />
                    <path d="M260 388v24" />
                    <path className="rt-steer__bar" d="M152 412h216" />
                    <path className="rt-steer__grip" d="M156 412h38" />
                    <path className="rt-steer__grip" d="M326 412h38" />
                  </g>

                  {/* The tower itself: faceted plate, wrapped polycarbonate
                      screen, round riding light, quad-optic dust light. */}
                  <g className="rt-steer__tower">
                    <path
                      className="rt-steer__plate"
                      d="M212 360 206 334 224 310 244 302H276L296 310 314 334 308 360Z"
                    />
                    <path className="rt-steer__arm" d="M238 360l6 12M282 360l-6 12" />
                    <path className="rt-steer__screen" d="M210 322Q260 258 310 322" />
                    <circle className="rt-steer__lamp" cx="260" cy="322" r="9" />
                    <g className="rt-steer__optic">
                      <circle cx="249" cy="341" r="4" />
                      <circle cx="271" cy="341" r="4" />
                      <circle cx="249" cy="352" r="4" />
                      <circle cx="271" cy="352" r="4" />
                    </g>
                  </g>
                </g>

                {/* Steering axis — the point everything above turns about. */}
                <g className="rt-steer__axis">
                  <circle cx="260" cy="390" r="4.5" />
                  <path d="M260 376v-9M260 404v9M246 390h-9M274 390h9" />
                </g>

                <text className="rt-steer__axis-label" x="16" y="620" fontSize="18">
                  Steering angle
                </text>
                <text
                  className="rt-steer__readout"
                  x="16"
                  y="658"
                  fontSize="30"
                  aria-hidden="true"
                >
                  {readout}
                </text>
              </svg>

              <p className="rt-mono rt-steer__hint">
                {isStatic
                  ? RIDER_FOCUSED.diagram.staticHint
                  : RIDER_FOCUSED.diagram.hint}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
