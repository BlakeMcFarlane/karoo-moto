import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import TopoPattern from '../components/art/TopoPattern'
import SceneArt from '../components/art/SceneArt'

export default function About() {
  return (
    <>
      <section className="page-hero">
        <TopoPattern className="page-hero-art" opacity={0.3} />
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>About</span>
          </div>
          <span className="eyebrow">Made in South Africa</span>
          <h1>Engineered where the terrain is the test</h1>
          <p>
            Karoo Moto brings premium South African adventure-motorcycle hardware
            to riders in the United States — the same rally towers and cockpit
            systems trusted on home terrain, now shipping across the Atlantic.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature">
            <div className="prose">
              <h2 style={{ marginTop: 0 }}>Born from the Karoo</h2>
              <p>
                The Karoo is vast, dry and unforgiving. It rewards preparation and
                punishes shortcuts. That landscape shaped a simple standard: build
                hardware that installs cleanly, holds its geometry over
                corrugations, and still looks considered years later.
              </p>
              <p>
                We work with a specialist South African manufacturer whose towers,
                mounts and billet components are designed, machined and assembled
                locally. Our role is to bring that quality to the American market
                without watering it down — clear fitment, honest specs and real
                support.
              </p>
              <h2>What we stand for</h2>
              <ul>
                <li>Rugged hardware that survives real remote travel.</li>
                <li>Precise fitment, so parts index cleanly the first time.</li>
                <li>Premium fabrication that reads factory-quality up close.</li>
                <li>Straight talk — no invented claims, no empty superlatives.</li>
              </ul>
            </div>
            <div className="feature-media">
              <SceneArt seed={2} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm section-graphite">
        <div className="container">
          <div className="stat-row">
            <div className="stat">
              <div className="num">100%</div>
              <div className="lbl">Made in South Africa</div>
            </div>
            <div className="stat">
              <div className="num">5</div>
              <div className="lbl">Supported platforms</div>
            </div>
            <div className="stat">
              <div className="num">3-yr</div>
              <div className="lbl">Structural warranty</div>
            </div>
            <div className="stat">
              <div className="num">USA</div>
              <div className="lbl">Now shipping</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">The Process</span>
            <h2>From billet to bushveld</h2>
          </div>
          <div className="proof-grid">
            <div className="proof">
              <Icon name="ruler" size={30} className="proof-icon" />
              <h3>Designed</h3>
              <p>
                Every part starts as a fitment problem: hold this device, on this
                bike, through this terrain. Geometry first, then the material.
              </p>
            </div>
            <div className="proof">
              <Icon name="cog" size={30} className="proof-icon" />
              <h3>Machined & Welded</h3>
              <p>
                Laser-cut stainless and billet aluminium, TIG-welded and finished
                by hand. Inspected before it earns a part number.
              </p>
            </div>
            <div className="proof">
              <Icon name="flag" size={30} className="proof-icon" />
              <h3>Trail Tested</h3>
              <p>
                Fitted to real bikes and ridden hard on Karoo two-track before it
                ships. The terrain has the final say.
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 'var(--sp-7)' }}>
            <Link to="/shop/rally-towers" className="btn btn-primary">
              Shop the Towers <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
