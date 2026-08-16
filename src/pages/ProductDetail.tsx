import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import ProductArt from '../components/art/ProductArt'
import TopoPattern from '../components/art/TopoPattern'
import ProductCard from '../components/ProductCard'
import {
  productBySlug,
  relatedProducts,
  formatPrice,
} from '../data/products'
import { CATEGORY_MAP } from '../data/categories'
import { useCart } from '../context/CartContext'
import NotFound from './NotFound'

const STOCK: Record<string, { text: string; cls: string }> = {
  'in-stock': { text: 'In Stock', cls: 'tag-stock' },
  'low-stock': { text: 'Low Stock', cls: 'tag-mto' },
  'made-to-order': { text: 'Made to Order', cls: 'tag-mto' },
  backorder: { text: 'Backorder', cls: 'tag-mto' },
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const product = slug ? productBySlug(slug) : undefined
  const { add } = useCart()

  const [finish, setFinish] = useState(product?.finishes[0] ?? '')
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  if (!product) return <NotFound />

  const cat = CATEGORY_MAP[product.category]
  const stock = STOCK[product.stockStatus]
  const price = product.salePrice ?? product.price
  const related = relatedProducts(product)

  const addToCart = () => add(product, finish, qty)

  return (
    <>
      <section className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <Link to="/shop">Shop</Link>
          <span className="sep">/</span>
          <Link to={`/shop/${product.category}`}>{cat.name}</Link>
          <span className="sep">/</span>
          <span>{product.name}</span>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 'var(--sp-8)' }}>
        <div className="pdp">
          {/* -------- Gallery -------- */}
          <div className="pdp-gallery">
            <div className="pdp-main-img">
              <TopoPattern className="" opacity={0.12} stroke="#8b5e35" />
              <ProductArt kind={product.art} />
            </div>
            <div className="pdp-thumbs">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  className={`pdp-thumb ${activeImg === i ? 'active' : ''}`}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View ${['product', 'installed', 'detail', 'rider view'][i]}`}
                >
                  <ProductArt kind={product.art} />
                </button>
              ))}
            </div>
            <p className="mono muted" style={{ fontSize: '0.72rem', textAlign: 'center' }}>
              Placeholder renders — swap in studio & installed photography.
            </p>
          </div>

          {/* -------- Buy box (fitment first) -------- */}
          <div className="pdp-info">
            <span className="product-cat">{cat.name}</span>
            <h1>{product.name}</h1>
            <div className="pdp-sku">SKU · {product.sku}</div>

            <div className="pdp-meta-row" style={{ marginTop: 'var(--sp-3)' }}>
              <span className={`tag ${stock.cls}`}>{stock.text}</span>
              {product.bestSeller && <span className="tag tag-accent">Best Seller</span>}
              <span className="tag">{product.leadTime}</span>
            </div>

            <div className="pdp-price">
              {product.salePrice ? (
                <>
                  <span className="was">{formatPrice(product.price)}</span>{' '}
                  <span className="sale">{formatPrice(product.salePrice)}</span>
                </>
              ) : (
                formatPrice(product.price)
              )}
            </div>

            {/* Fitment callout — highest priority */}
            <div
              style={{
                border: '1px solid var(--line-bronze)',
                background: 'rgba(166,107,54,0.06)',
                borderRadius: 'var(--r-md)',
                padding: 'var(--sp-3) var(--sp-4)',
                marginBottom: 'var(--sp-5)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Icon name="bike" size={22} className="lc-icon" />
              <div style={{ fontSize: '0.9rem' }}>
                <strong>Fits {product.fitment.length} platform{product.fitment.length === 1 ? '' : 's'}.</strong>{' '}
                <span className="muted">
                  {product.fitment.map((f) => `${f.make} ${f.model}`).join(' · ')}
                </span>
              </div>
            </div>

            <p className="pdp-desc">{product.description}</p>

            {/* Finish selector */}
            <div className="pdp-finish">
              <div className="field-label">Finish · {finish}</div>
              <div className="finish-opts">
                {product.finishes.map((f) => (
                  <button
                    key={f}
                    className={`finish-opt ${finish === f ? 'active' : ''}`}
                    onClick={() => setFinish(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + add */}
            <div className="pdp-buy">
              <div className="qty" role="group" aria-label="Quantity">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Icon name="minus" size={16} />
                </button>
                <span aria-live="polite">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <button className="btn btn-primary" onClick={addToCart}>
                <Icon name="cart" size={18} /> Add to Cart · {formatPrice(price * qty)}
              </button>
            </div>

            {/* What's included */}
            <div className="info-block">
              <h3>
                <Icon name="check" size={20} className="lc-icon" /> What's Included
              </h3>
              <ul className="included-list">
                {product.includes.map((item) => (
                  <li key={item}>
                    <Icon name="check" size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping note */}
            <div
              className="mono muted"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginTop: 'var(--sp-4)',
                fontSize: '0.8rem',
              }}
            >
              <Icon name="truck" size={18} />
              International shipping available. Duties and taxes may apply by
              destination.
            </div>
          </div>
        </div>
      </section>

      {/* -------- Specs + fitment + install -------- */}
      <section className="section-sm section-graphite">
        <div className="container">
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div className="info-block" style={{ marginTop: 0 }}>
              <h3>
                <Icon name="ruler" size={20} className="lc-icon" /> Specifications
              </h3>
              <table className="spec-table">
                <tbody>
                  <tr><th>Material</th><td>{product.material}</td></tr>
                  <tr><th>Finish options</th><td>{product.finishes.join(', ')}</td></tr>
                  <tr><th>Weight</th><td>{product.weight}</td></tr>
                  <tr><th>Dimensions</th><td>{product.dimensions}</td></tr>
                  <tr><th>Warranty</th><td>{product.warranty}</td></tr>
                  <tr><th>Lead time</th><td>{product.leadTime}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="info-block" style={{ marginTop: 0 }}>
              <h3>
                <Icon name="wrench" size={20} className="lc-icon" /> Installation
              </h3>
              <table className="spec-table">
                <tbody>
                  <tr><th>Difficulty</th><td>{product.install.difficulty}</td></tr>
                  <tr><th>Estimated time</th><td>{product.install.time}</td></tr>
                  <tr><th>Tools required</th><td>{product.install.tools.join(', ')}</td></tr>
                </tbody>
              </table>
              <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-4)', flexWrap: 'wrap' }}>
                <span className="btn btn-secondary btn-sm">
                  <Icon name="file" size={16} /> Install Guide (PDF)
                </span>
                <span className="btn btn-secondary btn-sm">
                  <Icon name="play" size={16} /> Install Video
                </span>
              </div>
            </div>
          </div>

          {/* Fitment table */}
          <div className="info-block">
            <h3>
              <Icon name="bike" size={20} className="lc-icon" /> Compatibility
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="fit-table">
                <thead>
                  <tr>
                    <th>Make</th>
                    <th>Model</th>
                    <th>Years</th>
                    <th>Fitment</th>
                  </tr>
                </thead>
                <tbody>
                  {product.fitment.map((f, i) => (
                    <tr key={i}>
                      <td>{f.make}</td>
                      <td>{f.model}</td>
                      <td>{f.years}</td>
                      <td style={{ color: 'var(--copper)' }}>Direct fit</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mono muted" style={{ fontSize: '0.76rem', marginTop: 'var(--sp-3)' }}>
              Not sure? <Link to="/fitment" style={{ color: 'var(--copper)' }}>Use the fitment finder →</Link>
            </p>
          </div>
        </div>
      </section>

      {/* -------- Related -------- */}
      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Complete the Build</span>
              <h2 style={{ fontSize: 'clamp(1.6rem,3.5vw,2.4rem)' }}>
                Related mounts & accessories
              </h2>
            </div>
            <div className="grid grid-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* -------- Sticky mobile buy -------- */}
      <div className="sticky-buy">
        <span className="sb-price">{formatPrice(price * qty)}</span>
        <button className="btn btn-primary" onClick={addToCart}>
          <Icon name="cart" size={18} /> Add to Cart
        </button>
      </div>
    </>
  )
}
