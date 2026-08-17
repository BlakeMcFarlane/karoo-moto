import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import RallyIcon from './RallyIcon'
import { TRUST } from '../../data/rallyTower'

/**
 * Trust — the reassurance moment before the disclosure.
 *
 * Two promises, two numbers. The figure is the whole argument here (45 days,
 * 12 months), so it is pulled out of the body copy and set at display size;
 * the sentence that actually removes the hesitation — that installing the
 * tower does not forfeit the return — is lifted out of the paragraph and given
 * its own ember rule.
 */

/** The shape shared by TRUST.guarantee and TRUST.warranty. */
interface TrustPromise {
  badge: string
  title: string
  body: string
  highlight: string
  linkLabel: string
  linkTo: string
}

interface TrustCardProps {
  promise: TrustPromise
  /** 0 or 1 — drives the card stagger and the later numeral entrance. */
  index: number
}

/** Card stagger, inside the 80–120ms-per-step band once the head is counted. */
const STAGGER = 140

/** The numeral lands after its own card has settled. */
const NUMERAL_OFFSET = 220

/**
 * Badge strings are "<numeral> <unit>" — "45 days", "12 months". Splitting on
 * the first space lets the number carry the card without restating a figure
 * that isn't in the data module.
 */
function splitBadge(badge: string): { numeral: string; unit: string } {
  const at = badge.indexOf(' ')
  if (at === -1) return { numeral: badge, unit: '' }
  return { numeral: badge.slice(0, at), unit: badge.slice(at + 1) }
}

function TrustCard({ promise, index }: TrustCardProps) {
  const { numeral, unit } = splitBadge(promise.badge)
  const delay = STAGGER * (index + 1)

  return (
    <Reveal className="rt-trust__cell" delay={delay} threshold={0.08}>
      <article className="rt-card rt-card--interactive rt-trust__card">
        {/* The figure restates the heading below it, so it is decoration
            for assistive tech rather than a second announcement. */}
        <div className="rt-trust__badge" aria-hidden="true">
          <Reveal
            variant="line"
            className="rt-trust__numeral-mask"
            delay={delay + NUMERAL_OFFSET}
          >
            <span className="rt-trust__numeral">{numeral}</span>
          </Reveal>
          <span className="rt-mono rt-trust__unit">{unit}</span>
        </div>

        <span className="rt-trust__hr rt-rule--draw" aria-hidden="true" />

        <h3 className="rt-h3 rt-trust__title">{promise.title}</h3>
        <p className="rt-body-copy rt-trust__body">{promise.body}</p>

        <p className="rt-trust__highlight">{promise.highlight}</p>

        <p className="rt-trust__foot">
          <Link className="rt-link" to={promise.linkTo}>
            {promise.linkLabel}
            <RallyIcon name="arrow" size={14} />
          </Link>
        </p>
      </article>
    </Reveal>
  )
}

export default function Trust() {
  const headingId = `${TRUST.id}-title`

  return (
    <section
      id={TRUST.id}
      className="rt-section rt-section--bone rt-trust"
      aria-labelledby={headingId}
    >
      <div className="rt-container">
        <Reveal className="rt-head rt-head--center rt-trust__head">
          <p className="rt-eyebrow rt-eyebrow--center">{TRUST.eyebrow}</p>
          <h2 id={headingId} className="rt-h2 rt-h2--sentence rt-trust__heading">
            {TRUST.title}
          </h2>
          <p className="rt-lede rt-trust__lede">{TRUST.lede}</p>
        </Reveal>

        <div className="rt-trust__grid">
          <TrustCard promise={TRUST.guarantee} index={0} />
          <TrustCard promise={TRUST.warranty} index={1} />
        </div>
      </div>
    </section>
  )
}
