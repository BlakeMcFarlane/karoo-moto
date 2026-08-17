import type { CSSProperties } from 'react'
import Reveal from './Reveal'
import { useScrollProgress } from '../../lib/motion'
import { PROOF } from '../../data/rallyTower'
import towerOnBike from '../../assets/rally/tower-on-bike-full.jpeg'

const TITLE_ID = 'rt-proof-title'

/** Scroll progress is handed to CSS as a custom property, never as a transform. */
type SceneStyle = CSSProperties & Record<'--p', string>

/**
 * Proof — the "we actually rode this" section.
 *
 * A tall track holds a one-viewport sticky scene. Above 1000px the photograph
 * is a full-height portrait panel on the right — the negative is 3:4 and a
 * full-bleed `cover` crop of it throws away more than half the bike — with the
 * copy on clean ink beside it. As the track scrolls through, `--p` settles the
 * remaining 1.09 crop back to 1:1 and lifts the darkening veil. The scrub is
 * scale + opacity only.
 *
 * Below 560px — and for anyone with reduced motion — the track collapses and
 * the same markup lays itself out as a static composition (see proof.css); the
 * scroll value is simply ignored, and the hook pins it at its resting value.
 */
export default function ProvenInAfrica() {
  const [trackRef, progress] = useScrollProgress<HTMLDivElement>({
    mode: 'through',
    // Reduced motion pins the scene fully open: photo at 1:1, veil at its
    // lightest — the same picture the animation ends on.
    restingValue: 1,
    // Keep the reader's place in the scrub when the window is resized.
    anchorOnResize: true,
  })

  const sceneStyle: SceneStyle = { '--p': String(progress) }

  return (
    <section
      id={PROOF.id}
      className="rt-section rt-section--flush-top rt-section--flush-bottom rt-proof"
      aria-labelledby={TITLE_ID}
    >
      <div ref={trackRef} className="rt-proof__track" style={sceneStyle}>
        <div className="rt-proof__scene">
          <div className="rt-proof__media">
            <img
              src={towerOnBike}
              alt="A KTM 500 EXC-F on a stand with the KarooMoto Rally Tower fitted to the front end and the yellow dust light lit."
              width={1200}
              height={1600}
              loading="lazy"
              decoding="async"
            />
            <div className="rt-proof__veil" aria-hidden="true" />
            <div className="rt-proof__scrim" aria-hidden="true" />
          </div>

          <div className="rt-container rt-proof__inner">
            <div className="rt-proof__copy">
              <div className="rt-head rt-head--wide">
                <Reveal variant="up">
                  <p className="rt-eyebrow">{PROOF.eyebrow}</p>
                </Reveal>
                <Reveal variant="line" delay={90}>
                  <h2 id={TITLE_ID} className="rt-h2">
                    {PROOF.title}
                  </h2>
                </Reveal>
              </div>

              <Reveal variant="up" delay={180}>
                <p className="rt-proof__lede">{PROOF.lede}</p>
              </Reveal>

              <div className="rt-proof__body">
                {PROOF.body.map((para, i) => (
                  <Reveal key={para} variant="up" delay={270 + i * 90}>
                    <p className="rt-body-copy">{para}</p>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="rt-proof__foot">
              <Reveal variant="fade" delay={540} className="rt-proof__caption-wrap">
                <p className="rt-proof__caption">{PROOF.caption}</p>
              </Reveal>

              {/* Field data, not badges: label reads first for assistive tech,
                  column-reverse puts the value on top for the eye. */}
              <dl className="rt-proof__markers">
                {PROOF.markers.map((marker, i) => (
                  <Reveal
                    key={marker.label}
                    variant="up"
                    delay={330 + i * 90}
                    className="rt-proof__marker"
                  >
                    <dt className="rt-proof__marker-label">{marker.label}</dt>
                    <dd className="rt-proof__marker-value">{marker.value}</dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
