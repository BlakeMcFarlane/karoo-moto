import { Link } from 'react-router-dom'
import Reveal from '../components/rally/Reveal'
import RallyIcon from '../components/rally/RallyIcon'
import ProductGallery from '../components/rally/ProductGallery'
import BuyPanel from '../components/rally/BuyPanel'
import { money } from '../context/CartContext'
import {
  FEATURES_SECTION,
  KEY_STATS,
  PREORDER,
  RALLY_TOWER,
  heroFeatures,
  materialFeatures,
  supportFeatures,
} from '../data/rallyTower'

/**
 * The product page — the commercial heart of the site.
 *
 * One product, one card: the object on the left, the transaction on the right,
 * collapsing to a single column at 900px. Everything below the card is the
 * detail a customer reads *after* they have understood what it costs and
 * whether it fits their motorcycle, so it is set as an editorial spec sheet
 * rather than a second sales pitch.
 *
 * This page has no hero, so the product name is the document's only <h1>.
 */
export default function Product() {
  const stagger = 90

  return (
    <div className="rt-page rt-product">
      <div className="rt-grain" aria-hidden="true" />

      <section
        className="rt-section rt-section--sm rt-product__lead"
        aria-labelledby="rt-product-title"
      >
        <div className="rt-container">
          <Reveal variant="fade" className="rt-product__masthead">
            <nav aria-label="Breadcrumb">
              <ol className="rt-mono rt-product__crumb-list">
                <li>
                  <Link to="/" className="rt-product__crumb-link">
                    KarooMoto
                  </Link>
                </li>
                <li aria-current="page">{RALLY_TOWER.name}</li>
              </ol>
            </nav>

            <div className="rt-product__title-row">
              <div className="rt-product__title-block">
                <h1 id="rt-product-title" className="rt-h1">
                  {RALLY_TOWER.name}
                </h1>
                <p className="rt-lede rt-product__tagline">
                  {RALLY_TOWER.tagline}
                </p>
              </div>

              <p className="rt-product__price">
                <span className="rt-product__price-value">
                  {money(RALLY_TOWER.price, RALLY_TOWER.currency)}
                </span>
                <span className="rt-mono rt-product__price-unit">
                  {RALLY_TOWER.currency} · {RALLY_TOWER.sku}
                </span>
              </p>
            </div>
          </Reveal>

          {/* The card. Two columns of one composition — the hairline between
              them is the only division, so it reads as one object rather than
              a media box next to a form. */}
          <Reveal
            variant="up"
            delay={stagger}
            className="rt-product__card"
            threshold={0.04}
          >
            <div className="rt-product__media">
              <ProductGallery />
            </div>
            <div className="rt-product__buy">
              <BuyPanel />
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="rt-section rt-section--panel"
        aria-labelledby="rt-product-detail-title"
      >
        <div className="rt-container">
          <Reveal className="rt-head rt-head--wide rt-head--split">
            <p className="rt-eyebrow">{FEATURES_SECTION.eyebrow}</p>
            <h2
              id="rt-product-detail-title"
              className="rt-h2 rt-h2--sentence"
            >
              {FEATURES_SECTION.title}
            </h2>
            <p className="rt-lede">{FEATURES_SECTION.lede}</p>
          </Reveal>

          <div className="rt-product__intro">
            <Reveal variant="up">
              <p className="rt-body-copy">{RALLY_TOWER.intro}</p>
              <p className="rt-body-copy">{RALLY_TOWER.construction}</p>
            </Reveal>

            <Reveal
              variant="up"
              delay={stagger}
              className="rt-product__stats rt-stack-ruled"
            >
              {KEY_STATS.map((s) => (
                <p className="rt-product__stat" key={s.label}>
                  <span className="rt-product__stat-figure">
                    {s.value}
                    {s.unit && (
                      <span className="rt-product__stat-unit">{s.unit}</span>
                    )}
                  </span>
                  <span className="rt-mono rt-product__stat-label">
                    {s.label}
                  </span>
                </p>
              ))}
            </Reveal>
          </div>

          <div className="rt-grid rt-grid--2 rt-product__heroes">
            {heroFeatures().map((f, i) => (
              <Reveal
                key={f.id}
                variant="up"
                delay={(i % 2) * stagger}
              >
                <article className="rt-card rt-card--interactive rt-product__feature">
                  <span className="rt-icon-plate">
                    <RallyIcon name={f.icon} size={22} />
                  </span>
                  <h3 className="rt-h4">{f.title}</h3>
                  <p className="rt-body-copy">{f.body}</p>
                  {f.spec && (
                    <p className="rt-mono rt-mono--teal rt-product__feature-spec">
                      {f.spec}
                    </p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        className="rt-section"
        aria-labelledby="rt-product-spec-title"
      >
        <div className="rt-container">
          <Reveal className="rt-head rt-head--wide">
            <h2 id="rt-product-spec-title" className="rt-h2 rt-h2--sentence">
              {FEATURES_SECTION.supportingTitle}
            </h2>
          </Reveal>

          <Reveal variant="up" className="rt-product__support">
            {supportFeatures().map((f) => (
              <article className="rt-product__line" key={f.id}>
                <span className="rt-product__line-icon">
                  <RallyIcon name={f.icon} size={20} />
                </span>
                <div className="rt-product__line-text">
                  <h3 className="rt-h4">{f.title}</h3>
                  <p className="rt-body-copy">{f.body}</p>
                </div>
                {f.spec && (
                  <span className="rt-mono rt-product__line-spec">{f.spec}</span>
                )}
              </article>
            ))}
          </Reveal>

          <Reveal variant="up" delay={stagger} className="rt-product__materials">
            <h3 className="rt-mono rt-product__sub">
              {FEATURES_SECTION.materialsTitle}
            </h3>
            <div className="rt-grid rt-grid--3">
              {materialFeatures().map((f) => (
                <article className="rt-card" key={f.id}>
                  <span className="rt-icon-plate">
                    <RallyIcon name={f.icon} size={20} />
                  </span>
                  <h4 className="rt-h4">{f.title}</h4>
                  <p className="rt-body-copy">{f.body}</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="rt-section rt-section--sm rt-section--bone"
        aria-labelledby="rt-product-box-title"
      >
        <div className="rt-container">
          <Reveal className="rt-head rt-head--wide">
            <h2 id="rt-product-box-title" className="rt-h2 rt-h2--sentence">
              {PREORDER.inTheBoxTitle}
            </h2>
          </Reveal>

          <Reveal variant="up" className="rt-product__box-list">
            {PREORDER.inTheBox.map((item, i) => (
              <p className="rt-product__box-item" key={item}>
                <span className="rt-mono rt-product__box-n">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="rt-product__box-text">{item}</span>
              </p>
            ))}
          </Reveal>
        </div>
      </section>
    </div>
  )
}
