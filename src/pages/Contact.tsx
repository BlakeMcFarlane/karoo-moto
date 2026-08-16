import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import TopoPattern from '../components/art/TopoPattern'

export default function Contact() {
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <>
      <section className="page-hero">
        <TopoPattern className="page-hero-art" opacity={0.3} />
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>Contact</span>
          </div>
          <span className="eyebrow">Talk to a Rider</span>
          <h1>Get in touch</h1>
          <p>
            Fitment questions, build advice or order help — reach the people who
            ride and build these bikes.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-methods">
              <div className="contact-method">
                <Icon name="mail" size={24} className="cm-icon" />
                <div>
                  <h4>Email</h4>
                  <p>
                    <a href="mailto:support@karoomoto.com">support@karoomoto.com</a>
                  </p>
                  <p className="mono muted" style={{ fontSize: '0.8rem' }}>
                    Replies within 1 business day
                  </p>
                </div>
              </div>
              <div className="contact-method">
                <Icon name="bike" size={24} className="cm-icon" />
                <div>
                  <h4>Fitment Help</h4>
                  <p>
                    Not sure what fits? Send your make, model and year and we'll
                    confirm compatibility.
                  </p>
                  <p>
                    <Link to="/fitment" style={{ color: 'var(--copper)' }}>
                      Open the fitment finder →
                    </Link>
                  </p>
                </div>
              </div>
              <div className="contact-method">
                <Icon name="globe" size={24} className="cm-icon" />
                <div>
                  <h4>Shipping</h4>
                  <p>
                    Shipping from South Africa to the USA and worldwide. Duties and
                    taxes may apply by destination.
                  </p>
                </div>
              </div>
              <div className="contact-method">
                <Icon name="user" size={24} className="cm-icon" />
                <div>
                  <h4>Dealers & Workshops</h4>
                  <p>
                    <Link to="/dealers" style={{ color: 'var(--copper)' }}>
                      Apply for wholesale pricing →
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <div>
              {sent ? (
                <div className="form-success">
                  <span className="fs-icon">
                    <Icon name="check" size={40} />
                  </span>
                  <h3>Message sent</h3>
                  <p className="muted" style={{ marginTop: 8 }}>
                    Thanks — we'll get back to you within one business day. This is
                    a front-end demo, so nothing was actually transmitted.
                  </p>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 'var(--sp-4)' }}
                    onClick={() => setSent(false)}
                  >
                    Send another
                  </button>
                </div>
              ) : (
                <form className="form-panel" onSubmit={submit}>
                  <div className="form-grid">
                    <div className="field">
                      <label htmlFor="c-name">Name</label>
                      <input id="c-name" type="text" required placeholder="Your name" />
                    </div>
                    <div className="field">
                      <label htmlFor="c-email">Email</label>
                      <input id="c-email" type="email" required placeholder="you@example.com" />
                    </div>
                    <div className="field full">
                      <label htmlFor="c-bike">Bike (optional)</label>
                      <input id="c-bike" type="text" placeholder="e.g. KTM 500 EXC-F 2022" />
                    </div>
                    <div className="field full">
                      <label htmlFor="c-msg">Message</label>
                      <textarea id="c-msg" required placeholder="How can we help?" />
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-block"
                    type="submit"
                    style={{ marginTop: 'var(--sp-4)' }}
                  >
                    Send Message <Icon name="arrow-right" size={18} />
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
