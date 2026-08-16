import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import TopoPattern from '../components/art/TopoPattern'
import type { IconName } from '../components/Icon'

const RESOURCES: { icon: IconName; title: string; text: string; to: string; cta: string }[] = [
  {
    icon: 'file',
    title: 'Installation Manuals',
    text: 'Step-by-step PDF guides with torque values and parts diagrams for every product.',
    to: '/support',
    cta: 'Browse manuals',
  },
  {
    icon: 'play',
    title: 'Install Videos',
    text: 'Watch a full fitment start to finish before you pick up a tool.',
    to: '/support',
    cta: 'Watch videos',
  },
  {
    icon: 'ruler',
    title: 'Fitment & Compatibility',
    text: 'Confirm exact compatibility by make, model and year with the fitment finder.',
    to: '/fitment',
    cta: 'Check fitment',
  },
  {
    icon: 'wrench',
    title: 'Replacement Parts',
    text: 'Hardware kits, bushings and brackets to keep your build serviceable.',
    to: '/shop',
    cta: 'Find parts',
  },
]

const FAQ = [
  {
    q: 'How do I know a part fits my bike?',
    a: 'Use the fitment finder — pick Make, Model and Year and we show only the parts that fit. Every product page also lists a full compatibility table.',
  },
  {
    q: 'How hard is installation?',
    a: 'Each product lists difficulty (bolt-on, intermediate or advanced), estimated time and required tools. Most towers and mounts are a straightforward workshop-afternoon job.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes. We ship from South Africa to the United States and beyond. Duties and taxes may apply by destination and are shown at checkout where available.',
  },
  {
    q: 'What is the warranty?',
    a: 'Structural components carry a 3-year warranty; electronics and finish items carry 2 years. See the warranty policy for full details.',
  },
  {
    q: 'Something is missing or damaged — what now?',
    a: 'Contact us with your order number and photos. We keep hardware kits in stock and will make it right quickly.',
  },
]

export default function Support() {
  return (
    <>
      <section className="page-hero">
        <TopoPattern className="page-hero-art" opacity={0.3} />
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>Installation & Support</span>
          </div>
          <span className="eyebrow">Installation Confidence</span>
          <h1>Fit it right, ride it hard</h1>
          <p>
            Manuals, videos, torque specs and real human support — everything you
            need to install cleanly and get back on the trail.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <div className="grid grid-4">
            {RESOURCES.map((r) => (
              <Link key={r.title} to={r.to} className="link-card">
                <Icon name={r.icon} size={30} className="lc-icon" />
                <h3>{r.title}</h3>
                <p>{r.text}</p>
                <span className="lc-more">
                  {r.cta} <Icon name="arrow-right" size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-sm section-graphite">
        <div className="container container-narrow">
          <div className="section-head">
            <span className="eyebrow">Common Questions</span>
            <h2>Support FAQ</h2>
          </div>
          <div className="stack">
            {FAQ.map((f) => (
              <details
                key={f.q}
                style={{
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--r-lg)',
                  padding: 'var(--sp-4) var(--sp-5)',
                  background: 'rgba(255,255,255,0.015)',
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    listStyle: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 'var(--sp-3)',
                  }}
                >
                  {f.q}
                  <Icon name="chevron-right" size={18} className="muted" />
                </summary>
                <p className="muted" style={{ marginTop: 'var(--sp-3)' }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--sp-7)' }}>
            <p className="lede" style={{ marginBottom: 'var(--sp-4)' }}>
              Still stuck? Talk to people who ride and build these bikes.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Contact Support <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
