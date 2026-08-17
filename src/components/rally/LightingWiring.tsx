import type { CSSProperties } from 'react'
import Reveal from './Reveal'
import RallyIcon from './RallyIcon'
import { useInView } from '../../lib/motion'
import { RALLY_TOWER, WIRING } from '../../data/rallyTower'

const HEADING_ID = 'rt-wiring-title'

/** Spoken description of the circuit — the only thing a screen reader gets. */
const SCHEMATIC_TITLE =
  'Wiring schematic. The motorcycle battery feeds an in-line fuse, the fuse feeds the supplied loom, and the loom runs to the Rally Tower. Inside the tower, two waterproof switches control the white riding light and the yellow dust light.'

type NodeTone = 'strong' | 'accent'

interface NodeCopy {
  label: string
  sub: string
  /** Position in the draw order — nodes and connectors share one scale. */
  stage: number
  tone?: NodeTone
}

interface NodeBox extends NodeCopy {
  id: string
  x: number
  y: number
  w: number
  h: number
}

interface Edge {
  id: string
  /** Orthogonal run — H and V commands only, never a curve. */
  d: string
  /** Path length in user units, so every line draws at the same rate. */
  len: number
  stage: number
  /** Switched output rather than supply run. */
  accent?: boolean
}

interface Layout {
  key: 'wide' | 'stacked'
  viewBox: string
  nodes: NodeBox[]
  edges: Edge[]
  /** Where the feed splits to the two switches. */
  junction: { x: number; y: number }
}

// The circuit is described once — labels, sub-labels and draw order — then
// given coordinates twice: a left-to-right routing for desktop and a vertical
// one for phones. Only the geometry changes, never the story.
const COPY: Record<string, NodeCopy> = {
  battery: { label: 'Battery', sub: 'Direct feed', stage: 0 },
  fuse: { label: 'Fuse', sub: 'In-line', stage: 1 },
  loom: { label: 'Loom', sub: 'Supplied', stage: 2 },
  tower: { label: 'Rally Tower', sub: RALLY_TOWER.sku, stage: 3, tone: 'strong' },
  swWhite: { label: 'Switch 01', sub: 'Waterproof', stage: 4 },
  swYellow: { label: 'Switch 02', sub: 'Waterproof', stage: 4 },
  lightWhite: { label: 'White', sub: 'Riding light', stage: 5, tone: 'accent' },
  lightYellow: { label: 'Yellow', sub: 'Dust light', stage: 5, tone: 'accent' },
}

const node = (id: string, x: number, y: number, w: number, h: number): NodeBox => ({
  id,
  ...COPY[id],
  x,
  y,
  w,
  h,
})

const WIDE: Layout = {
  key: 'wide',
  viewBox: '0 0 936 226',
  nodes: [
    node('battery', 8, 88, 120, 50),
    node('fuse', 163, 88, 120, 50),
    node('loom', 318, 88, 120, 50),
    node('tower', 473, 88, 120, 50),
    node('swWhite', 656, 12, 120, 50),
    node('swYellow', 656, 164, 120, 50),
    node('lightWhite', 808, 12, 120, 50),
    node('lightYellow', 808, 164, 120, 50),
  ],
  edges: [
    { id: 'e1', d: 'M128 113 H163', len: 35, stage: 0 },
    { id: 'e2', d: 'M283 113 H318', len: 35, stage: 1 },
    { id: 'e3', d: 'M438 113 H473', len: 35, stage: 2 },
    { id: 'e4', d: 'M593 113 H624 V37 H656', len: 139, stage: 3 },
    { id: 'e5', d: 'M593 113 H624 V189 H656', len: 139, stage: 3 },
    { id: 'e6', d: 'M776 37 H808', len: 32, stage: 4, accent: true },
    { id: 'e7', d: 'M776 189 H808', len: 32, stage: 4, accent: true },
  ],
  junction: { x: 624, y: 113 },
}

const STACKED: Layout = {
  key: 'stacked',
  viewBox: '0 0 260 508',
  nodes: [
    node('battery', 6, 0, 248, 48),
    node('fuse', 6, 82, 248, 48),
    node('loom', 6, 164, 248, 48),
    node('tower', 6, 246, 248, 48),
    node('swWhite', 6, 346, 118, 48),
    node('swYellow', 136, 346, 118, 48),
    node('lightWhite', 6, 444, 118, 54),
    node('lightYellow', 136, 444, 118, 54),
  ],
  edges: [
    { id: 'e1', d: 'M130 48 V82', len: 34, stage: 0 },
    { id: 'e2', d: 'M130 130 V164', len: 34, stage: 1 },
    { id: 'e3', d: 'M130 212 V246', len: 34, stage: 2 },
    { id: 'e4', d: 'M130 294 V320 H65 V346', len: 117, stage: 3 },
    { id: 'e5', d: 'M130 294 V320 H195 V346', len: 117, stage: 3 },
    { id: 'e6', d: 'M65 394 V444', len: 50, stage: 4, accent: true },
    { id: 'e7', d: 'M195 394 V444', len: 50, stage: 4, accent: true },
  ],
  junction: { x: 130, y: 320 },
}

/** Stagger is one token multiplied by the draw order — see `wiring.css`. */
const stage = (n: number): CSSProperties =>
  ({ '--rt-wire-stage': String(n) }) as CSSProperties

const wire = (e: Edge): CSSProperties =>
  ({
    '--rt-wire-stage': String(e.stage),
    '--rt-wire-len': String(e.len),
  }) as CSSProperties

interface SchematicProps {
  layout: Layout
}

/**
 * One routing of the circuit. Both routings are rendered and swapped with
 * `display` at 1000px, so exactly one is ever in the accessibility tree — the
 * hidden one is removed from it outright.
 */
function Schematic({ layout }: SchematicProps) {
  const titleId = `rt-wire-schematic-${layout.key}`

  return (
    <svg
      className={`rt-wire__svg rt-wire__svg--${layout.key}`}
      viewBox={layout.viewBox}
      role="img"
      aria-labelledby={titleId}
      focusable="false"
    >
      <title id={titleId}>{SCHEMATIC_TITLE}</title>

      {layout.edges.map((e) => (
        <path
          key={e.id}
          className={`rt-wire__edge${e.accent ? ' rt-wire__edge--accent' : ''}`}
          d={e.d}
          style={wire(e)}
        />
      ))}

      <circle
        className="rt-wire__dot"
        cx={layout.junction.x}
        cy={layout.junction.y}
        r={3}
        style={stage(3)}
      />

      {layout.nodes.map((n) => (
        <g
          key={n.id}
          className={`rt-wire__node${n.tone ? ` rt-wire__node--${n.tone}` : ''}`}
          style={stage(n.stage)}
        >
          <rect
            className="rt-wire__box"
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            rx="2"
          />
          <text className="rt-wire__label" x={n.x + 12} y={n.y + n.h * 0.43}>
            {n.label}
          </text>
          <text className="rt-wire__sub" x={n.x + 12} y={n.y + n.h * 0.74}>
            {n.sub}
          </text>
        </g>
      ))}
    </svg>
  )
}

/**
 * Lighting & wiring — the bone section.
 *
 * The schematic is the argument: seeing the whole circuit on one sheet is what
 * makes the install feel ordinary rather than daunting. It draws itself in
 * connector by connector, in the order you would actually wire it, which is why
 * the motion is here at all. Everything resolves inside 1.2s and shows complete
 * under reduced motion.
 */
export default function LightingWiring() {
  const [figureRef, figureIn] = useInView<HTMLElement>({ threshold: 0.2 })

  return (
    <section
      id={WIRING.id}
      className="rt-section rt-section--bone rt-wire"
      aria-labelledby={HEADING_ID}
    >
      <div className="rt-container">
        <div className="rt-wire__head">
          <Reveal className="rt-head rt-head--wide" variant="up">
            <p className="rt-eyebrow">{WIRING.eyebrow}</p>
            <h2 className="rt-h2" id={HEADING_ID}>
              {WIRING.title}
            </h2>
          </Reveal>
          <Reveal
            as="p"
            className="rt-lede rt-wire__lede"
            variant="up"
            delay={110}
          >
            {WIRING.lede}
          </Reveal>
        </div>

        <figure
          ref={figureRef}
          className={`rt-wire__figure${figureIn ? ' is-in' : ''}`}
        >
          <div className="rt-wire__plate">
            <Schematic layout={WIDE} />
            <Schematic layout={STACKED} />
          </div>
          <figcaption className="rt-wire__caption">
            <p className="rt-wire__caption-text">
              <span className="rt-mono rt-wire__fig">Fig. 01</span>
              How the supplied loom runs, end to end.
            </p>
            <ul className="rt-wire__legend" role="list">
              <li className="rt-mono rt-wire__legend-item">Supplied loom</li>
              <li className="rt-mono rt-wire__legend-item rt-wire__legend-item--accent">
                Switched output
              </li>
            </ul>
          </figcaption>
        </figure>

        <div className="rt-grid rt-grid--2 rt-wire__paths">
          {WIRING.paths.map((path, i) => (
            <Reveal
              key={path.id}
              variant="up"
              delay={i * 110}
              className={`rt-card rt-wire__path ${
                path.ready ? 'rt-wire__path--primary' : 'rt-wire__path--secondary'
              }`}
            >
              <div className="rt-wire__path-top">
                <span
                  className={
                    path.ready
                      ? 'rt-chip rt-chip--ember rt-wire__chip'
                      : 'rt-chip rt-wire__chip--muted'
                  }
                >
                  {path.ready && <span className="rt-chip__dot" />}
                  {path.badge}
                </span>
                <span className="rt-mono rt-wire__path-index">{`0${i + 1}`}</span>
              </div>

              <h3 className="rt-h3">{path.title}</h3>
              <p className="rt-body-copy">{path.body}</p>

              <ul
                className={`rt-wire__points ${
                  path.ready ? 'rt-wire__points--checked' : 'rt-wire__points--plain'
                }`}
                role="list"
              >
                {path.points.map((point) => (
                  <li key={point} className="rt-wire__point">
                    {path.ready && (
                      <RallyIcon name="check" size={15} className="rt-wire__tick" />
                    )}
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <Reveal className="rt-wire__note" variant="fade" delay={220}>
          <span className="rt-icon-plate rt-wire__note-plate">
            <RallyIcon name="loom" size={22} />
          </span>
          <div className="rt-wire__note-body">
            <p className="rt-mono rt-wire__note-kicker">In development</p>
            <p className="rt-body-copy">{WIRING.footnote}</p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
