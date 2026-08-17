import { useEffect, useState } from 'react'
import { RALLY_TOWER, PREORDER } from '../../data/rallyTower'
import { Link } from 'react-router-dom'
import { useTowerConfig } from './TowerConfig'
import { useScrollY, usePrefersReducedMotion } from '../../lib/motion'
import RallyIcon from './RallyIcon'

/**
 * The persistent purchase bar.
 *
 * Its real job is not the button — it is the line under the product name that
 * keeps the configured motorcycle in front of the customer for the whole page.
 * It appears once the hero is behind them and steps aside for the two sections
 * that already own the screen: the pre-order panel (which is the same
 * transaction, rendered larger) and the closing brand moment.
 */

/** Sections whose own content makes the sticky bar redundant or intrusive. */
/* The closing brand section was removed once the hero took its composition,
   so the purchase panel is the only thing left that makes the bar redundant. */
const YIELD_TO = ['preorder']

/** The hero occupies the viewport; reveal the bar once it is essentially past. */
const HERO_FRACTION = 0.85

const priceFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export default function BuyBar() {
  const { bikeLabel, isComplete, qty } = useTowerConfig()
  const reduced = usePrefersReducedMotion()
  const scrollY = useScrollY()
  const [viewportH, setViewportH] = useState(() =>
    typeof window === 'undefined' ? 0 : window.innerHeight,
  )
  const [yielding, setYielding] = useState(false)

  // Kept in state rather than read during render so the threshold never forces
  // a layout read on a scroll frame.
  useEffect(() => {
    const onResize = () => setViewportH(window.innerHeight)
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // One observer, two targets. Either being on screen suppresses the bar, so
  // the state is a set membership test rather than two booleans.
  useEffect(() => {
    const targets = YIELD_TO.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    if (targets.length === 0) return

    const onScreen = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) onScreen.add(entry.target)
          else onScreen.delete(entry.target)
        })
        setYielding(onScreen.size > 0)
      },
      // Shrink the root's bottom edge so the bar only yields once the section
      // is genuinely on screen, not the instant its first pixel appears.
      { rootMargin: '0px 0px -28% 0px' },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Visibility is a boolean, so the rendered attributes only change on the two
  // threshold crossings — the scroll value itself never reaches the DOM.
  const pastHero = viewportH > 0 && scrollY > viewportH * HERO_FRACTION
  const visible = pastHero && !yielding

  const total = priceFormat.format(RALLY_TOWER.price * qty)
  const ctaName = `${RALLY_TOWER.ctaLabel} the ${RALLY_TOWER.fullName}, ${total} — configure your motorcycle`

  const className = `rt-buybar${visible ? ' is-visible' : ''}${
    reduced ? ' rt-buybar--instant' : ''
  }`

  return (
    <div
      role="region"
      aria-label="Purchase"
      aria-hidden={!visible}
      // `visibility: hidden` alone leaves the CTA focusable for the length of
      // the slide-out, which pairs a focusable control with aria-hidden.
      // `inert` removes it from the tab order the instant the state flips.
      {...(visible ? {} : { inert: '' })}
      className={className}
    >
      <div className="rt-container rt-buybar__inner">
        <div className="rt-buybar__id">
          <p className="rt-buybar__name">{RALLY_TOWER.fullName}</p>

          {isComplete && bikeLabel ? (
            <p className="rt-buybar__bike rt-mono rt-mono--teal">
              <RallyIcon
                name="check"
                size={13}
                strokeWidth={2.4}
                className="rt-buybar__cue"
              />
              <span className="rt-buybar__bike-text">{bikeLabel}</span>
            </p>
          ) : (
            <p className="rt-buybar__bike rt-mono">
              <span className="rt-buybar__cue rt-buybar__dot" aria-hidden="true" />
              {/* Two strings, swapped by CSS: the full prompt truncated
                  mid-word on a phone, and an ellipsised call to action reads
                  as a fault rather than an instruction. */}
              <span className="rt-buybar__bike-text rt-buybar__prompt--full">
                {PREORDER.selectPrompt}
              </span>
              <span className="rt-buybar__bike-text rt-buybar__prompt--short">
                {PREORDER.selectPromptShort}
              </span>
            </p>
          )}
        </div>

        <div className="rt-buybar__act">
          <p className="rt-buybar__price">{total}</p>
          <Link
            to="/product"
            className="rt-btn rt-btn--primary rt-buybar__cta"
            aria-label={ctaName}
          >
            <span>{RALLY_TOWER.ctaLabel}</span>
            {/* Folded-in price for the narrowest phones, where a separate
                price column would crowd the bike line off the bar. */}
            <span className="rt-buybar__cta-price" aria-hidden="true">
              {total}
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
