import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import TopoPattern from '../components/art/TopoPattern'

export default function Dealers() {
  const [sent, setSent] = useState(false)

  return (
    <>
      <section className="page-hero">
        <TopoPattern className="page-hero-art" opacity={0.3} />
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>Dealers / Wholesale</span>
          </div>
          <span className="eyebrow">Trade Program</span>
          <h1>Dealers & Wholesale</h1>
          <p>
            Stock premium South African rally hardware in your shop. We support
            dealers, installers and specialist workshops with trade pricing, clear
            fitment data and dependable supply.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="proof-grid" style={{ marginBottom: 'var(--sp-8)' }}>
            <div className="proof">
              <Icon name="truck" size={30} className="proof-icon" />
              <h3>Dependable Supply</h3>
              <p>
                Clear lead times and honest stock status, so you can promise a
                fitting date and keep it.
              </p>
            </div>
            <div className="proof">
              <Icon name="file" size={30} className="proof-icon" />
              <h3>Fitment Data</h3>
              <p>
                Full compatibility, dimensions and install specs for every SKU —
                everything your counter needs.
              </p>
            </div>
            <div className="proof">
              <Icon name="cog" size={30} className="proof-icon" />
              <h3>Trade Pricing</h3>
              <p>
                Tiered wholesale pricing with support for display units and
                workshop installers.
              </p>
            </div>
          </div>

          <div className="contact-grid">
            <div className="prose">
              <h2 style={{ marginTop: 0 }}>Apply to become a dealer</h2>
              <p>
                Tell us about your shop and the platforms your customers ride.
                We'll follow up with a wholesale price list, terms and onboarding
                details.
              </p>
              <ul>
                <li>Motorcycle dealers and adventure specialists</li>
                <li>Independent workshops and installers</li>
                <li>Rally and roadbook outfitters</li>
              </ul>
              <p className="mono muted" style={{ fontSize: '0.82rem' }}>
                Prefer email? <a href="mailto:trade@karoomoto.com" style={{ color: 'var(--copper)' }}>trade@karoomoto.com</a>
              </p>
            </div>

            <div>
              {sent ? (
                <div className="form-success">
                  <span className="fs-icon">
                    <Icon name="check" size={40} />
                  </span>
                  <h3>Application received</h3>
                  <p className="muted" style={{ marginTop: 8 }}>
                    Thanks for your interest. We'll be in touch with trade pricing
                    and next steps. (Front-end demo — nothing was transmitted.)
                  </p>
                </div>
              ) : (
                <form
                  className="form-panel"
                  onSubmit={(e) => {
                    e.preventDefault()
                    setSent(true)
                  }}
                >
                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="d-shop">Business name</label>
                      <input id="d-shop" type="text" required placeholder="Shop / workshop" />
                    </div>
                    <div className="field">
                      <label htmlFor="d-contact">Contact name</label>
                      <input id="d-contact" type="text" required placeholder="Your name" />
                    </div>
                    <div className="field">
                      <label htmlFor="d-email">Email</label>
                      <input id="d-email" type="email" required placeholder="you@shop.com" />
                    </div>
                    <div className="field">
                      <label htmlFor="d-country">Country</label>
                      <input id="d-country" type="text" required placeholder="United States" />
                    </div>
                    <div className="field full">
                      <label htmlFor="d-msg">Tell us about your business</label>
                      <textarea
                        id="d-msg"
                        placeholder="Location, platforms you service, expected volume…"
                      />
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    type="submit"
                    style={{ marginTop: 'var(--sp-4)' }}
                  >
                    Submit Application <Icon name="arrow-right" size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
