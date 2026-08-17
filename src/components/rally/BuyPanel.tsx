import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTowerConfig } from './TowerConfig'
import { useCart, money } from '../../context/CartContext'
import BikeSelector from './BikeSelector'
import RallyIcon from './RallyIcon'
import {
  FITMENT_SECTION,
  PREORDER,
  RALLY_TOWER,
  TRUST,
} from '../../data/rallyTower'

/**
 * The transaction column.
 *
 * Price, availability, the compatibility selector, quantity and the one filled
 * button on the page. Nothing here uses `disabled`: a control that drops out of
 * the tab order mid-purchase sends focus to <body> and the customer loses their
 * place, so the blocked states are `aria-disabled` plus an explanation of what
 * is missing.
 */

/** The two assurances that have a policy document behind them. */
const ASSURANCE_LINKS: Record<string, string | undefined> = {
  shield: TRUST.guarantee.linkTo,
  check: TRUST.warranty.linkTo,
}

const GATE_ID = 'rt-buy-gate'

export default function BuyPanel() {
  const { qty, setQty, isComplete, addToCart, bikeLabel } = useTowerConfig()
  const { busy, error } = useCart()
  const [added, setAdded] = useState(false)

  // A different motorcycle is a different order line — the previous
  // confirmation no longer describes what the button would do.
  useEffect(() => {
    setAdded(false)
  }, [bikeLabel])

  const blocked = !isComplete || busy

  const onAdd = async () => {
    if (blocked) return
    const ok = await addToCart()
    if (ok) setAdded(true)
  }

  return (
    <div className="rt-buy">
      <div className="rt-buy__head">
        <p className="rt-buy__price">
          <span className="rt-buy__amount">
            {money(RALLY_TOWER.price, RALLY_TOWER.currency)}
          </span>
          <span className="rt-mono rt-buy__currency">
            {RALLY_TOWER.currency}
          </span>
        </p>
        <p className="rt-chip rt-chip--teal rt-buy__avail">
          <span className="rt-chip__dot" />
          {RALLY_TOWER.availability}
        </p>
      </div>

      <p className="rt-mono rt-buy__sku">{RALLY_TOWER.sku}</p>

      <hr className="rt-rule rt-buy__rule" />

      <BikeSelector />

      <hr className="rt-rule rt-buy__rule" />

      <div className="rt-buy__row">
        <div className="rt-buy__qty" role="group" aria-labelledby="rt-buy-qty">
          <span className="rt-mono rt-buy__qty-label" id="rt-buy-qty">
            {PREORDER.qtyLabel}
          </span>
          <div className="rt-buy__stepper">
            <button
              type="button"
              className="rt-buy__step"
              aria-label="Decrease quantity"
              aria-disabled={qty <= 1 || undefined}
              onClick={() => qty > 1 && setQty(qty - 1)}
            >
              <span aria-hidden="true">–</span>
            </button>
            {/* <output> is an implicit polite live region, so the new count is
                announced without a second announcement racing the selector. */}
            <output className="rt-buy__count">{qty}</output>
            <button
              type="button"
              className="rt-buy__step"
              aria-label="Increase quantity"
              aria-disabled={qty >= 9 || undefined}
              onClick={() => qty < 9 && setQty(qty + 1)}
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
        </div>

        <p className="rt-buy__total">
          <span className="rt-mono rt-buy__total-label">Total</span>
          <span className="rt-buy__total-value">
            {money(RALLY_TOWER.price * qty, RALLY_TOWER.currency)}
          </span>
        </p>
      </div>

      <div className="rt-buy__actions">
        <button
          type="button"
          className="rt-btn rt-btn--primary rt-btn--block"
          aria-disabled={blocked || undefined}
          aria-describedby={isComplete ? undefined : GATE_ID}
          onClick={onAdd}
        >
          {busy ? 'Adding…' : FITMENT_SECTION.result.addLabel}
        </button>

        {!isComplete && (
          <p className="rt-buy__gate" id={GATE_ID}>
            {FITMENT_SECTION.prompt}
          </p>
        )}

        {error && (
          <p className="rt-buy__error" role="alert">
            {error}
          </p>
        )}

        {added && (
          <div className="rt-buy__done">
            <p className="rt-buy__done-text">
              <span className="rt-dot rt-dot--teal" />
              <span>
                {RALLY_TOWER.name} added to your cart for {bikeLabel}.
              </span>
            </p>
            <Link
              className="rt-btn rt-btn--secondary rt-btn--block"
              to="/cart"
            >
              Go to cart
              <RallyIcon name="arrow" size={16} className="rt-btn__icon" />
            </Link>
          </div>
        )}
      </div>

      <ul className="rt-buy__assurances rt-stack-ruled">
        {PREORDER.assurances.map((a) => {
          const to = ASSURANCE_LINKS[a.icon]
          const inner = (
            <>
              <RallyIcon name={a.icon} size={18} />
              <span className="rt-buy__assure-label">{a.label}</span>
              {to && (
                <RallyIcon
                  name="chevron"
                  size={14}
                  className="rt-buy__assure-chevron"
                />
              )}
            </>
          )
          return (
            <li key={a.label}>
              {to ? (
                <Link className="rt-buy__assure-link" to={to}>
                  {inner}
                </Link>
              ) : (
                <span className="rt-buy__assure-link">{inner}</span>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
