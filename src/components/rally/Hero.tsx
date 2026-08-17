import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { useScrollProgress } from '../../lib/motion'
import { CLOSING, HERO, RALLY_TOWER } from '../../data/rallyTower'
import backsplash from '../../assets/rally/backsplash.jpg'
import badge from '../../assets/rally/logo-badge-720.jpg'

/**
 * Entrance choreography, in milliseconds.
 *
 * The hero is on screen at mount, so these are the start offsets of one
 * continuous cascade rather than scroll triggers — the observer inside
 * <Reveal> resolves on the first frame. The badge leads, then the three
 * statement lines rise out of their own baselines in sequence, one
 * --rt-stagger step apart, so the last thing to move starts at 450ms and the
 * whole hero is settled inside ~1.2s.
 */
const CUE = {
  badge: 0,
  line: 90, // + one step per statement line
  signoff: 360,
  actions: 450,
}

/**
 * The brand moment, and the whole of the first screen.
 *
 * The badge, the KarooMoto statement, the sign-off and the two things a
 * customer can do about it, centred over the Karoo sunset. There is no product
 * shot and no stat rail here — the landing page makes those arguments in the
 * sections below; this one only has to be true.
 */
export default function Hero() {

  // Drives the ground plate's push-in. `start: 0, end: -1` measures the hero
  // LEAVING: progress is (0 - rect.top) / vh, so it is 0 while the hero sits at
  // the top of the document and reaches 1 once a full viewport has scrolled
  // past. The `start: 1, end: 0.1` configuration used by blocks further down
  // the page measures an element ENTERING, and would pin at 1 here forever —
  // the hero begins life at rect.top === 0, already past its own start.
  // Written to --rt-hero-p and consumed by a calc() in hero.css; React never
  // builds a transform string on a scroll frame. `restingValue: 1` parks
  // reduced-motion users on the settled framing.
  const [heroRef, progress] = useScrollProgress<HTMLElement>({
    start: 0,
    end: -1,
    // 1, not 0: reduced-motion users get the SETTLED framing — the open,
    // pulled-back crop the zoom resolves to — rather than being parked on the
    // punched-in start of a gesture they will never see play.
    restingValue: 1,
  })

  return (
    <section
      ref={heroRef}
      className="rt-hero"
      aria-labelledby="rt-hero-title"
      style={{ '--rt-hero-p': progress } as CSSProperties}
    >
      <div className="rt-hero__ground" aria-hidden="true">
        {/* An <img> rather than a CSS background so it can carry fetch priority
            and a deliberate crop — the wide vista, rider left, sun right. */}
        <img
          className="rt-hero__sky"
          src={backsplash}
          alt=""
          width={1717}
          height={916}
          loading="eager"
          // React 18 does not map the camelCase prop; the lowercase attribute
          // is what the browser reads anyway.
          {...{ fetchpriority: 'high' }}
          decoding="async"
        />
        <span className="rt-hero__grade" />
      </div>

      <div className="rt-container rt-hero__stage">
        <Reveal
          className="rt-hero__badge"
          variant="scale"
          delay={CUE.badge}
          threshold={0}
          rootMargin="0px"
        >
          {/* Eager and unlazy: this is above the fold on every viewport. */}
          <img
            className="rt-hero__badge-img"
            src={badge}
            alt=""
            width={720}
            height={720}
            loading="eager"
            decoding="async"
          />
        </Reveal>

        {/* The page's only <h1>. Every section below opens on an <h2>, so the
            document outline runs h1 → h2 → h3 with no skips. */}
        <h1
          id="rt-hero-title"
          className="rt-h1 rt-h1--sentence rt-hero__statement"
        >
          {CLOSING.lines.map((line, i) => (
            <Reveal
              key={line}
              as="span"
              variant="line"
              className="rt-hero__line"
              delay={CUE.line + i * 90}
              threshold={0}
              rootMargin="0px"
            >
              <span>{i > 0 ? ' ' : ''}{line}</span>
            </Reveal>
          ))}
          {/* Each line is its own mask element with no whitespace between,
              so textContent (and anything copied out of the page) reads
              "...matters.Lightweight...". */}{' '}
          <Reveal
            as="span"
            variant="line"
            className="rt-hero__line rt-hero__line--emphasis"
            delay={CUE.line + CLOSING.lines.length * 90}
            threshold={0}
            rootMargin="0px"
          >
            <span>{CLOSING.emphasis}</span>
          </Reveal>
        </h1>

        <Reveal
          className="rt-hero__signoff"
          variant="up"
          delay={CUE.signoff}
          threshold={0}
          rootMargin="0px"
        >
          <hr className="rt-rule rt-rule--draw rt-hero__spark" />
          <p className="rt-hero__signoff-text">{CLOSING.signoff}</p>
          <p className="rt-mono rt-hero__coords">{CLOSING.coords}</p>
        </Reveal>

        <Reveal
          className="rt-hero__actions"
          variant="up"
          delay={CUE.actions}
          threshold={0}
          rootMargin="0px"
        >
          {/* The landing page sells; the product page transacts. Both CTAs lead
              there rather than trying to complete a purchase from a page that
              has no configurator on it. */}
          <Link to="/product" className="rt-btn rt-btn--primary">
            {RALLY_TOWER.ctaLabel}
          </Link>
          <Link to="/product" className="rt-btn rt-btn--glass">
            {HERO.secondaryCta}
          </Link>
        </Reveal>
      </div>

      {/* The top of a long page has to say so. Kept on the lockup's own centre
          line so it reads as the last mark of the composition rather than
          something dropped in a gutter. */}
      <div
        className={`rt-hero__cue${progress > 0.02 ? ' is-gone' : ''}`}
        aria-hidden="true"
      >
        <span className="rt-hero__cue-label">{HERO.scrollCue}</span>
        <span className="rt-hero__cue-track">
          <span className="rt-hero__cue-spark" />
        </span>
      </div>
    </section>
  )
}
