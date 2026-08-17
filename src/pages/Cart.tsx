import { useCallback, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/rally/Reveal'
import RallyIcon from '../components/rally/RallyIcon'
import TermsModal from '../components/rally/TermsModal'
import {
  useCart,
  money,
  type CartLine,
  type LineProperties,
} from '../context/CartContext'
import { RALLY_TOWER, TRUST } from '../data/rallyTower'
import { TERMS_ACCEPT } from '../data/terms'
import towerStudio from '../assets/rally/tower-studio-01.jpeg'

/**
 * Cart — the last screen we own before Shopify.
 *
 * Two things have to be unambiguous here: what the customer is buying, and
 * what happens when they press Checkout.
 *
 * The first is why the configuration (motorcycle + mounting kit) is set as a
 * labelled read-out on every row rather than as fine print — it is the part of
 * the order that cannot be corrected once the crate is packed, so it gets the
 * technical teal treatment the rest of the page reserves for fitment data, and
 * an escape hatch back to the configurator.
 *
 * The second is why this page never fakes a checkout. Money, shipping, duties
 * and taxes are Shopify's; when Shopify is not connected the button says so
 * plainly instead of leading somewhere that pretends to be a checkout.
 *
 * Both are also why the Terms & Conditions are accepted HERE rather than
 * somewhere in Shopify's flow: this is the last screen we own, and the
 * document is read in place (see TermsModal) so agreeing to it never costs
 * the customer the cart they are standing in.
 */

/* Short connective microcopy — the data module supplies the sentence and the
   error, but not the "you have not read it yet" state. */
const READ_FIRST = 'Read the Terms & Conditions to the end before accepting.'

/** A quantity cap, so a held-down "+" cannot walk the order into nonsense. */
/* The same ceiling the product page enforces. Two different limits let a
   customer build a line the cart itself considered illegal. */
const MAX_QTY = RALLY_TOWER.maxQty

/**
 * The two attributes that decide which tower gets built lead the read-out;
 * anything else Shopify hands back keeps its own order behind them.
 */
const SPEC_ORDER = ['Motorcycle', 'Mounting kit', 'Configuration']

const rank = (key: string): number => {
  const i = SPEC_ORDER.indexOf(key)
  return i === -1 ? SPEC_ORDER.length : i
}

const orderedSpecs = (props: LineProperties): [string, string][] =>
  Object.entries(props)
    .filter(([, value]) => value.trim().length > 0)
    .sort(([a], [b]) => rank(a) - rank(b))

function StepGlyph({ plus = false }: { plus?: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" />
      {plus && <path d="M12 5v14" />}
    </svg>
  )
}

interface CartRowProps {
  line: CartLine
  /** A mutation is in flight somewhere on the page. */
  locked: boolean
  /** This row is the one waiting on the store. */
  pending: boolean
  onQty: (line: CartLine, qty: number) => void
  onRemove: (line: CartLine) => void
}

function CartRow({ line, locked, pending, onQty, onRemove }: CartRowProps) {
  const specs = orderedSpecs(line.properties)
  /* Every line is the same product, so the product name alone gives two rows
     byte-identical headings and control names. The configured motorcycle is
     the only thing that tells them apart — and it is the whole point of this
     page — so it goes into the accessible name of every control on the row. */
  const bike = line.properties.Motorcycle
  const rowName = bike ? `${line.name}, ${bike}` : line.name
  const atMin = line.qty <= 1
  const atMax = line.qty >= MAX_QTY

  return (
    <li
      className="rt-card rt-cart__line"
      data-pending={pending ? 'true' : undefined}
      aria-busy={pending || undefined}
    >
      {/* Feathered: the studio shots were photographed against a light grey
          wall and sit as bright rectangles on the ink ground otherwise. */}
      <div className="rt-media rt-media--feather rt-cart__media">
        <img
          src={line.image ?? towerStudio}
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="rt-cart__body">
        <h2 className="rt-h3 rt-cart__name">
          {line.name}
          {bike && <span className="rt-sr">, {bike}</span>}
        </h2>
        {line.sku && <p className="rt-mono rt-cart__sku">{line.sku}</p>}

        {specs.length > 0 && (
          <div className="rt-cart__spec">
            <p className="rt-mono rt-cart__spec-title">Built for</p>
            <dl className="rt-cart__spec-list">
              {specs.map(([key, value]) => (
                <div className="rt-cart__spec-row" key={key}>
                  <dt className="rt-cart__spec-key">{key}</dt>
                  <dd className="rt-cart__spec-val">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <p className="rt-cart__edit">
          <Link className="rt-link rt-link--quiet rt-link--hit rt-cart__edit-link" to="/product">
            Change motorcycle
            <RallyIcon name="arrow" size={13} />
          </Link>
        </p>
      </div>

      <p className="rt-cart__price">
        <span className="rt-cart__amount">
          {money(line.price * line.qty, line.currency)}
        </span>
        <span className="rt-mono rt-cart__unit">
          {money(line.price, line.currency)} each
        </span>
      </p>

      <div className="rt-cart__ctl">
        <div
          className="rt-cart__qty"
          role="group"
          aria-label={`Quantity, ${rowName}`}
        >
          {/* aria-disabled, not disabled: a control that leaves the tab order
              the moment it reaches its bound drops the focus ring with it. */}
          <button
            type="button"
            className="rt-cart__step"
            aria-disabled={atMin || locked}
            aria-label={`Decrease quantity of ${rowName}`}
            onClick={() => {
              if (atMin || locked) return
              onQty(line, line.qty - 1)
            }}
          >
            <StepGlyph />
          </button>

          <span
            className="rt-cart__qty-val"
            aria-live="polite"
            aria-atomic="true"
          >
            <span className="rt-sr">Quantity: </span>
            {line.qty}
          </span>

          <button
            type="button"
            className="rt-cart__step"
            aria-disabled={atMax || locked}
            aria-label={
              atMax
                ? `Increase quantity of ${rowName} — maximum reached`
                : `Increase quantity of ${rowName}`
            }
            onClick={() => {
              if (atMax || locked) return
              onQty(line, line.qty + 1)
            }}
          >
            <StepGlyph plus />
          </button>
        </div>

        <button
          type="button"
          className="rt-cart__remove"
          aria-disabled={locked}
          aria-label={`Remove ${rowName} from cart`}
          onClick={() => {
            if (locked) return
            onRemove(line)
          }}
        >
          Remove
        </button>
      </div>
    </li>
  )
}

export default function Cart() {
  const {
    lines,
    count,
    subtotal,
    currency,
    busy,
    error,
    usingShopify,
    checkoutUrl,
    setQty,
    remove,
    dismissError,
  } = useCart()

  const [pendingId, setPendingId] = useState<string | null>(null)
  // A ref, not the state flag: two clicks inside one React batch would both
  // read the old state and queue a second mutation against a stale cart.
  const inFlight = useRef(false)

  /* --- Terms acceptance --------------------------------------------------
     Component state only, and deliberately never written to storage: consent
     is given for this order, in this session, by this person. A remembered
     tick is an acceptance nobody made. */
  const [accepted, setAccepted] = useState(false)
  const [termsRead, setTermsRead] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [gateError, setGateError] = useState(false)
  const boxRef = useRef<HTMLInputElement>(null)
  const gateId = useId()
  const hintId = `${gateId}-hint`
  const errorId = `${gateId}-error`

  const openTerms = useCallback(() => setTermsOpen(true), [])
  // Stable, so opening the modal does not re-run its focus-trap effect and
  // yank focus back to the close button mid-read.
  const closeTerms = useCallback(() => setTermsOpen(false), [])
  const markRead = useCallback(() => setTermsRead(true), [])
  const acceptTerms = useCallback(() => {
    setAccepted(true)
    setGateError(false)
  }, [])

  const run = useCallback(async (id: string, op: () => Promise<void>) => {
    if (inFlight.current) return
    inFlight.current = true
    setPendingId(id)
    try {
      await op()
    } finally {
      inFlight.current = false
      setPendingId(null)
    }
  }, [])

  const onQty = useCallback(
    (line: CartLine, qty: number) => {
      /* Clamp, never reject. Rejecting made the minus button silently dead on
         any line that had somehow exceeded the ceiling — the control rendered
         enabled, and clicking it did nothing at all. */
      const next = Math.min(MAX_QTY, Math.max(0, qty))
      if (next === line.qty) return
      void run(line.id, () => setQty(line.id, next))
    },
    [run, setQty],
  )

  const onRemove = useCallback(
    (line: CartLine) => {
      void run(line.id, () => remove(line.id))
    },
    [run, remove],
  )

  const locked = busy || pendingId !== null
  const empty = lines.length === 0
  // A checkout URL only exists once Shopify has actually created a cart.
  const canCheckout = usingShopify && checkoutUrl !== null

  return (
    <div className="rt-page rt-cart">
      <div className="rt-grain" aria-hidden="true" />

      <section
        className="rt-section rt-cart__section"
        aria-labelledby="rt-cart-title"
      >
        <div className="rt-container">
          <Reveal className="rt-head rt-cart__head">
            <p className="rt-eyebrow">Review &amp; checkout</p>
            <h1 id="rt-cart-title" className="rt-h1 rt-cart__title">
              Cart
            </h1>
            <p className="rt-mono rt-cart__count">
              {empty ? 'No items' : `${count} ${count === 1 ? 'item' : 'items'}`}
            </p>
          </Reveal>

          {error && (
            <div className="rt-cart__error" role="alert">
              <span className="rt-dot rt-cart__error-dot" aria-hidden="true" />
              <p className="rt-cart__error-text">{error}</p>
              <button
                type="button"
                className="rt-cart__error-x"
                onClick={dismissError}
                aria-label="Dismiss this message"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          )}

          {empty ? (
            <div className="rt-cart__empty">
              <Reveal className="rt-cart__empty-copy" delay={90}>
                <p className="rt-eyebrow rt-cart__empty-tag">Nothing in it yet</p>
                <h2 className="rt-h2 rt-h2--sentence rt-cart__empty-title">
                  Pick your motorcycle, and we build to it.
                </h2>
                <p className="rt-lede rt-cart__empty-lede">
                  {RALLY_TOWER.tagline}
                </p>
                <Link className="rt-btn rt-btn--primary" to="/product">
                  Configure your Rally Tower
                  <RallyIcon name="arrow" size={16} className="rt-btn__icon" />
                </Link>
                <p className="rt-mono rt-cart__empty-spec">
                  {RALLY_TOWER.fullName} · {RALLY_TOWER.sku} ·{' '}
                  {money(RALLY_TOWER.price, RALLY_TOWER.currency)}
                </p>
              </Reveal>

              <Reveal
                variant="clip"
                delay={180}
                className="rt-media rt-media--feather rt-cart__empty-media"
              >
                <img
                  src={towerStudio}
                  alt="The KarooMoto Rally Tower, three-quarter view, with screen, lights and switches fitted."
                  width={1080}
                  height={1430}
                  loading="lazy"
                  decoding="async"
                />
              </Reveal>
            </div>
          ) : (
            <div className="rt-cart__layout">
              <ul className="rt-cart__lines" aria-busy={locked || undefined}>
                {lines.map((line) => (
                  <CartRow
                    key={line.id}
                    line={line}
                    locked={locked}
                    pending={pendingId === line.id}
                    onQty={onQty}
                    onRemove={onRemove}
                  />
                ))}
              </ul>

              <aside className="rt-cart__summary" aria-labelledby="rt-cart-sum">
                <div className="rt-panel rt-cart__sum">
                  <h2 id="rt-cart-sum" className="rt-h3 rt-cart__sum-title">
                    Summary
                  </h2>

                  <dl className="rt-cart__sum-rows">
                    <div className="rt-cart__sum-row">
                      <dt>Subtotal</dt>
                      <dd>{money(subtotal, currency)}</dd>
                    </div>
                    <div className="rt-cart__sum-row rt-cart__sum-row--quiet">
                      <dt>Items</dt>
                      <dd>{count}</dd>
                    </div>
                  </dl>

                  <p className="rt-mono rt-cart__note">
                    Shipping, duties and taxes are calculated at checkout by
                    Shopify.
                  </p>

                  {/* The gate. It sits above BOTH checkout states: the terms
                      are part of buying from this store however the store is
                      wired, and the document has to stay readable even when
                      payment cannot be taken. The two blocked states never
                      argue with each other, because the "please accept" alert
                      is only ever raised on the real checkout path — pressing
                      the unconnected button leaves its own explanation as the
                      single reason on screen. */}
                  <div className="rt-cart__gate">
                    <div className="rt-cart__gate-row">
                      {/* A real checkbox with a real label: Space toggles it,
                          the focus ring is the page's, and the whole sentence
                          — link text included — is its accessible name. */}
                      <input
                        ref={boxRef}
                        id={gateId}
                        type="checkbox"
                        className="rt-cart__gate-box"
                        checked={accepted}
                        aria-disabled={!termsRead || undefined}
                        aria-invalid={gateError || undefined}
                        aria-describedby={
                          [
                            gateError ? errorId : '',
                            termsRead ? '' : hintId,
                          ]
                            .filter(Boolean)
                            .join(' ') || undefined
                        }
                        onClick={(e) => {
                          if (termsRead) return
                          // Cancelling the click restores the previous checked
                          // state, so nothing is accepted unread — and the
                          // press opens the document rather than doing
                          // nothing, which would be a dead end.
                          e.preventDefault()
                          openTerms()
                        }}
                        onChange={(e) => {
                          if (!termsRead) return
                          setAccepted(e.target.checked)
                          if (e.target.checked) setGateError(false)
                        }}
                      />

                      <label className="rt-cart__gate-label" htmlFor={gateId}>
                        {TERMS_ACCEPT.before}
                        {/* A button, not an anchor: leaving the cart to read
                            the terms is exactly what we are avoiding. The
                            label does not forward activation to the checkbox
                            for clicks on an interactive descendant, so this
                            opens the document without ticking anything. */}
                        <button
                          type="button"
                          className="rt-link rt-link--quiet rt-cart__gate-link"
                          aria-haspopup="dialog"
                          onClick={openTerms}
                        >
                          {TERMS_ACCEPT.linkLabel}
                        </button>
                        {TERMS_ACCEPT.after}
                      </label>
                    </div>

                    {!termsRead && (
                      <p id={hintId} className="rt-mono rt-cart__gate-hint">
                        {READ_FIRST}
                      </p>
                    )}

                    {gateError && (
                      <p
                        id={errorId}
                        className="rt-cart__gate-error"
                        role="alert"
                      >
                        <span
                          className="rt-dot rt-cart__gate-error-dot"
                          aria-hidden="true"
                        />
                        {TERMS_ACCEPT.required}
                      </p>
                    )}
                  </div>

                  {canCheckout && checkoutUrl ? (
                    <>
                      <a
                        className="rt-btn rt-btn--primary rt-btn--block rt-cart__checkout"
                        href={checkoutUrl}
                        aria-label={`Checkout on Shopify — subtotal ${money(
                          subtotal,
                          currency,
                        )}`}
                        // aria-disabled, not the disabled attribute: a control
                        // nobody can focus is a control nobody can ask why.
                        aria-disabled={locked || !accepted || undefined}
                        aria-describedby={gateError ? errorId : undefined}
                        onClick={(e) => {
                          // Mid-update: the hosted checkout would open on a
                          // subtotal that is about to change.
                          if (locked) {
                            e.preventDefault()
                            return
                          }
                          if (!accepted) {
                            e.preventDefault()
                            setGateError(true)
                            boxRef.current?.focus()
                          }
                        }}
                      >
                        {locked ? 'Updating' : 'Checkout'}
                        <RallyIcon
                          name="arrow"
                          size={16}
                          className="rt-btn__icon"
                        />
                      </a>
                      <p className="rt-mono rt-cart__secure">
                        <span
                          className="rt-dot rt-dot--teal"
                          aria-hidden="true"
                        />
                        You’ll complete payment securely on Shopify
                      </p>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="rt-btn rt-btn--primary rt-btn--block rt-cart__checkout"
                        aria-disabled="true"
                        aria-describedby="rt-cart-offline"
                        onClick={(e) => e.preventDefault()}
                      >
                        Checkout
                      </button>
                      <p id="rt-cart-offline" className="rt-cart__offline">
                        This store is not connected to Shopify yet, so payment
                        cannot be taken here. Your cart and the configuration on
                        it stay saved in this browser.
                      </p>
                    </>
                  )}

                  {/* Rendered empty rather than conditionally, so the live
                      region exists before the first mutation. */}
                  <p className="rt-cart__status" role="status">
                    {locked ? 'Updating cart…' : ''}
                  </p>

                  <ul className="rt-stack-ruled rt-cart__trust" role="list">
                    <li className="rt-cart__trust-row">
                      <RallyIcon
                        name="check"
                        size={15}
                        className="rt-cart__trust-icon"
                      />
                      <Link
                        className="rt-link rt-link--quiet rt-link--hit rt-cart__trust-link"
                        to={TRUST.guarantee.linkTo}
                      >
                        {TRUST.guarantee.title}
                      </Link>
                    </li>
                    <li className="rt-cart__trust-row">
                      <RallyIcon
                        name="shield"
                        size={15}
                        className="rt-cart__trust-icon"
                      />
                      <Link
                        className="rt-link rt-link--quiet rt-link--hit rt-cart__trust-link"
                        to={TRUST.warranty.linkTo}
                      >
                        {TRUST.warranty.title}
                      </Link>
                    </li>
                  </ul>

                  <p className="rt-cart__back">
                    <Link className="rt-link rt-link--quiet rt-link--hit" to="/product">
                      Continue shopping
                    </Link>
                  </p>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      {/* Portalled to <body> by the component: `.rt-page` isolates a stacking
          context, and an overlay rendered inside it would sit UNDER the fixed
          navigation however high its z-index. */}
      {termsOpen && (
        <TermsModal
          accepted={accepted}
          read={termsRead}
          onRead={markRead}
          onAccept={acceptTerms}
          onClose={closeTerms}
        />
      )}
    </div>
  )
}
