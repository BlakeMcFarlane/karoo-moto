import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import ProductArt from '../components/art/ProductArt'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'

export default function Cart() {
  const { lines, subtotal, setQty, remove, clear, count } = useCart()

  const SHIP_THRESHOLD = 450
  const shipping =
    lines.length === 0 || subtotal >= SHIP_THRESHOLD ? 0 : 35
  const total = subtotal + shipping

  if (lines.length === 0) {
    return (
      <section className="section">
        <div className="container container-narrow">
          <div className="empty">
            <span className="fs-icon" style={{ color: 'var(--copper)', display: 'inline-flex', marginBottom: 12 }}>
              <Icon name="cart" size={40} />
            </span>
            <h3>Your cart is empty</h3>
            <p className="muted">
              Start with a rally tower, then build out the cockpit.
            </p>
            <div style={{ marginTop: 'var(--sp-5)', display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/shop/rally-towers" className="btn btn-primary">
                Shop Towers <Icon name="arrow-right" size={18} />
              </Link>
              <Link to="/fitment" className="btn btn-secondary">
                Find Your Bike
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="row-between" style={{ marginBottom: 'var(--sp-6)' }}>
          <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', textTransform: 'uppercase' }}>
            Cart <span className="muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem' }}>· {count} item{count === 1 ? '' : 's'}</span>
          </h1>
          <button className="btn-ghost" onClick={clear}>
            Clear cart <Icon name="close" size={15} />
          </button>
        </div>

        <div className="cart-layout">
          <div>
            {lines.map((l) => (
              <div className="cart-item" key={`${l.slug}-${l.finish}`}>
                <Link to={`/product/${l.slug}`} className="cart-item-media">
                  <ProductArt kind={l.art} />
                </Link>
                <div>
                  <Link to={`/product/${l.slug}`} className="cart-item-name">
                    {l.name}
                  </Link>
                  <div className="cart-item-meta">
                    {l.sku} · {l.finish}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', marginTop: 'var(--sp-3)' }}>
                    <div className="qty" role="group" aria-label={`Quantity for ${l.name}`}>
                      <button onClick={() => setQty(l.slug, l.finish, l.qty - 1)} aria-label="Decrease">
                        <Icon name="minus" size={15} />
                      </button>
                      <span>{l.qty}</span>
                      <button onClick={() => setQty(l.slug, l.finish, l.qty + 1)} aria-label="Increase">
                        <Icon name="plus" size={15} />
                      </button>
                    </div>
                    <button className="cart-remove" onClick={() => remove(l.slug, l.finish)}>
                      Remove
                    </button>
                  </div>
                </div>
                <div className="price" style={{ alignSelf: 'flex-start' }}>
                  {formatPrice(l.price * l.qty)}
                </div>
              </div>
            ))}

            <Link to="/shop" className="btn-ghost" style={{ marginTop: 'var(--sp-5)', display: 'inline-flex' }}>
              <Icon name="arrow-left" size={16} /> Continue shopping
            </Link>
          </div>

          <aside className="summary">
            <h3>Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span className="mono">{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span className="mono">
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </span>
            </div>
            {shipping > 0 && (
              <div className="mono" style={{ fontSize: '0.76rem', color: 'var(--copper)', padding: '4px 0' }}>
                Add {formatPrice(SHIP_THRESHOLD - subtotal)} for free US shipping
              </div>
            )}
            <div className="summary-row">
              <span>Duties & taxes</span>
              <span className="mono muted">Calculated at checkout</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span className="mono">{formatPrice(total)}</span>
            </div>

            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: 'var(--sp-4)' }}
              onClick={() =>
                alert(
                  'Checkout is a placeholder in this front-end build. Stripe / payment integration comes next.',
                )
              }
            >
              <Icon name="check" size={18} /> Checkout
            </button>
            <p className="mono muted" style={{ fontSize: '0.72rem', textAlign: 'center', marginTop: 'var(--sp-3)' }}>
              Secure checkout · International shipping · USD
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
