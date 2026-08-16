import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import HeroArt from '../components/art/HeroArt'
import TopoPattern from '../components/art/TopoPattern'
import SceneArt from '../components/art/SceneArt'
import ProductArt from '../components/art/ProductArt'
import FitmentFinder from '../components/FitmentFinder'
import ProductCard from '../components/ProductCard'
import Newsletter from '../components/Newsletter'
import { CATEGORIES } from '../data/categories'
import { BIKES } from '../data/bikes'
import { featuredProducts, productBySlug } from '../data/products'

const CAT_ICON: Record<string, Parameters<typeof Icon>[0]['name']> = {
  'rally-towers': 'tower',
  navigation: 'compass',
  protection: 'shield',
  lighting: 'bulb',
  luggage: 'bag',
  cockpit: 'gauge',
  billet: 'cog',
}

const BUILDS = [
  { rider: 'Pieter — Western Cape', bike: 'KTM 500 EXC-F', seed: 0 },
  { rider: 'Anja — Namib Run', bike: 'Husqvarna 701', seed: 2 },
  { rider: 'Thabo — Sani Pass', bike: 'GasGas ES 500', seed: 1 },
  { rider: 'Marco — Baja Proto', bike: 'KTM 690', seed: 3 },
  { rider: 'Lena — Karoo Loop', bike: 'Husqvarna FE 501', seed: 0 },
]

export default function Home() {
  const dash = productBySlug('karoo-dash')
  const featured = featuredProducts()

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="hero">
        <div className="hero-art">
          <HeroArt />
        </div>
        <div className="hero-scrim" />
        <div className="container hero-inner">
          <span className="eyebrow">Premium Rally Hardware · South Africa → USA</span>
          <h1 className="display">
            Engineered in South Africa.
            <br />
            Built for <span className="accent">Adventure.</span>
          </h1>
          <p className="hero-sub">
            Precision-made motorcycle rally towers and mounting systems, built for
            clean integration, harsh terrain and serious adventure — now landing
            in the American market.
          </p>
          <div className="hero-cta">
            <Link to="/shop/rally-towers" className="btn btn-primary">
              Shop Towers <Icon name="arrow-right" size={18} />
            </Link>
            <Link to="/fitment" className="btn btn-secondary">
              Find Your Bike
            </Link>
          </div>
          <div className="hero-trust">
            <span /> Engineered, tested and assembled in South Africa
          </div>
        </div>
      </section>

      {/* ======================= FITMENT FINDER ======================= */}
      <section className="section-sm" style={{ paddingTop: 0 }}>
        <div className="container">
          <FitmentFinder />
        </div>
      </section>

      {/* ===================== SHOP BY MOTORCYCLE ===================== */}
      <section className="section-sm">
        <div className="container">
          <div className="row-between" style={{ marginBottom: 'var(--sp-6)' }}>
            <div className="stack" style={{ gap: 'var(--sp-2)' }}>
              <span className="eyebrow">Shop by Motorcycle</span>
              <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>
                Built for your platform
              </h2>
            </div>
            <Link to="/fitment" className="btn-ghost">
              All platforms <Icon name="arrow-right" size={16} />
            </Link>
          </div>

          <div className="bike-rail">
            {BIKES.map((b) => (
              <Link
                key={b.label}
                to={`/shop?make=${encodeURIComponent(b.make)}&model=${encodeURIComponent(b.model)}`}
                className="bike-chip"
              >
                <Icon name="bike" size={30} className="bike-icon" />
                <div>
                  <div className="make">{b.make}</div>
                  <div className="model">{b.label.replace(`${b.make} `, '')}</div>
                </div>
                <div className="blurb">{b.blurb}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURED CATEGORIES ==================== */}
      <section className="section section-graphite">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Featured Categories</span>
            <h2>Everything the cockpit needs</h2>
            <p className="lede">
              One system, cleanly integrated. Start at the tower and build out.
            </p>
          </div>

          <div className="grid grid-3">
            {CATEGORIES.map((c) => (
              <Link key={c.id} to={`/shop/${c.id}`} className="cat-tile">
                <TopoPattern className="cat-art" opacity={0.28} />
                <div
                  style={{
                    position: 'absolute',
                    top: 'var(--sp-5)',
                    right: 'var(--sp-5)',
                    color: 'var(--copper)',
                    opacity: 0.9,
                    zIndex: 2,
                  }}
                >
                  <Icon name={CAT_ICON[c.id]} size={30} />
                </div>
                <div className="cat-tile-body">
                  <h3>{c.name}</h3>
                  <p>{c.blurb}</p>
                  <div
                    style={{
                      marginTop: 'var(--sp-4)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      color: 'var(--copper)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    Explore <Icon name="arrow-right" size={16} className="arrow" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== FEATURED PRODUCTS ==================== */}
      <section className="section">
        <div className="container">
          <div className="row-between" style={{ marginBottom: 'var(--sp-6)' }}>
            <div className="stack" style={{ gap: 'var(--sp-2)' }}>
              <span className="eyebrow">Featured Products</span>
              <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)' }}>
                Rider favourites
              </h2>
            </div>
            <Link to="/shop" className="btn-ghost">
              Shop all <Icon name="arrow-right" size={16} />
            </Link>
          </div>

          <div className="grid grid-3">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* =================== FEATURED PRODUCT SPOTLIGHT ============== */}
      {dash && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="spotlight">
              <div className="spotlight-media">
                <TopoPattern
                  className=""
                  opacity={0.16}
                  stroke="#8b5e35"
                />
                <ProductArt kind="dash" />
              </div>
              <div className="spotlight-body">
                <span className="eyebrow">Featured Product</span>
                <h2>Karoo Dash</h2>
                <p className="spotlight-quote">
                  “Designed for riders who demand factory-quality navigation
                  solutions.”
                </p>
                <p className="muted">
                  A billet-framed navigation dash that carries roadbook, GPS and a
                  rally computer on one vibration-isolated platform — with cable
                  channels that keep the wiring clean and serviceable.
                </p>
                <div className="hero-cta" style={{ marginTop: 'var(--sp-3)' }}>
                  <Link to="/product/karoo-dash" className="btn btn-primary">
                    View Karoo Dash <Icon name="arrow-right" size={18} />
                  </Link>
                  <Link to="/shop/navigation" className="btn btn-secondary">
                    All Navigation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================= WHY KAROO ======================== */}
      <section className="section section-graphite">
        <div className="container">
          <div className="section-head center">
            <span className="eyebrow">Why Karoo</span>
            <h2>Serious hardware, honestly built</h2>
          </div>
          <div className="proof-grid">
            <div className="proof">
              <Icon name="map-pin" size={30} className="proof-icon" />
              <h3>Engineered in South Africa</h3>
              <p>
                Designed, machined and assembled where the terrain is the test
                bench. Every tower is born from real Karoo riding conditions.
              </p>
            </div>
            <div className="proof">
              <Icon name="flag" size={30} className="proof-icon" />
              <h3>Trail Tested</h3>
              <p>
                Corrugations, rock gardens and long dirt transits before anything
                ships. If it rattles or cracks, it does not leave the workshop.
              </p>
            </div>
            <div className="proof">
              <Icon name="cog" size={30} className="proof-icon" />
              <h3>Premium CNC Components</h3>
              <p>
                Billet aluminium, laser-cut stainless and clean welds. Details that
                read factory-quality the moment you pick them up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== TECHNICAL FEATURE ===================== */}
      <section className="section">
        <div className="container">
          <div className="feature">
            <div className="feature-media">
              <TopoPattern className="" opacity={0.14} stroke="#8b5e35" />
              <ProductArt kind="tower" />
            </div>
            <div>
              <span className="eyebrow">Karoo Rally Tower Pro</span>
              <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', margin: '12px 0 20px' }}>
                A cockpit built like a chassis
              </h2>
              <div className="callout-list">
                <div className="callout">
                  <span className="dot">01</span>
                  <div>
                    <h4>Laser-cut stainless structure</h4>
                    <p>
                      3CR12 stainless, folded and TIG-welded for rigidity that
                      holds mounting geometry over the roughest terrain.
                    </p>
                  </div>
                </div>
                <div className="callout">
                  <span className="dot">02</span>
                  <div>
                    <h4>Anti-vibration mounting</h4>
                    <p>
                      Isolation bushings protect your GPS, roadbook and comms from
                      the high-frequency buzz that kills electronics.
                    </p>
                  </div>
                </div>
                <div className="callout">
                  <span className="dot">03</span>
                  <div>
                    <h4>Clean cable routing</h4>
                    <p>
                      Integrated channels keep power and signal leads tidy,
                      protected and serviceable — no zip-tie spaghetti.
                    </p>
                  </div>
                </div>
                <div className="callout">
                  <span className="dot">04</span>
                  <div>
                    <h4>One tower, every mount</h4>
                    <p>
                      Roadbook, GPS, switch panel and auxiliary lighting all index
                      off a single rigid platform.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                to="/product/karoo-rally-tower-pro"
                className="btn btn-primary"
                style={{ marginTop: 'var(--sp-5)' }}
              >
                Explore the Tower <Icon name="arrow-right" size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= BRAND STORY ===================== */}
      <section className="section section-graphite">
        <div className="container">
          <div className="feature">
            <div>
              <span className="eyebrow">Made in South Africa</span>
              <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', margin: '12px 0 20px' }}>
                Born where the road disappears
              </h2>
              <div className="prose" style={{ maxWidth: 'none' }}>
                <p>
                  The Karoo is vast, dry and unforgiving — a place that finds the
                  weak point in any build. That is where our hardware is designed,
                  and that is the standard it has to meet.
                </p>
                <p>
                  We partner with a specialist South African manufacturer to bring
                  premium rally towers and cockpit systems to riders in the United
                  States — the same parts trusted on home terrain, now shipping
                  across the Atlantic.
                </p>
              </div>
              <Link
                to="/about"
                className="btn btn-secondary"
                style={{ marginTop: 'var(--sp-4)' }}
              >
                Our Story
              </Link>
            </div>
            <div className="feature-media">
              <SceneArt seed={0} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= INSTALLATION CONFIDENCE ================= */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Installation Confidence</span>
            <h2>Everything you need to fit it right</h2>
            <p className="lede">
              Clear manuals, torque specs and parts lists ship with every order —
              and live here whenever you need them.
            </p>
          </div>
          <div className="grid grid-4">
            {[
              { icon: 'file', title: 'Install Guides', text: 'Step-by-step PDF manuals with torque values.', to: '/support' },
              { icon: 'play', title: 'Install Videos', text: 'Watch the fitment before you turn a bolt.', to: '/support' },
              { icon: 'ruler', title: 'Parts & Fitment', text: 'Exact compatibility by make, model and year.', to: '/fitment' },
              { icon: 'wrench', title: 'Rider Support', text: 'Talk to people who ride and build these bikes.', to: '/contact' },
            ].map((c) => (
              <Link key={c.title} to={c.to} className="link-card">
                <Icon name={c.icon as never} size={30} className="lc-icon" />
                <h3>{c.title}</h3>
                <p>{c.text}</p>
                <span className="lc-more">
                  Open <Icon name="arrow-right" size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= CUSTOMER BUILDS ================== */}
      <section className="section section-graphite">
        <div className="container">
          <div className="row-between" style={{ marginBottom: 'var(--sp-6)' }}>
            <div className="stack" style={{ gap: 'var(--sp-2)' }}>
              <span className="eyebrow">Customer Builds</span>
              <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}>Built, not bought.</h2>
            </div>
            <Link to="/journal" className="btn-ghost">
              See more builds <Icon name="arrow-right" size={16} />
            </Link>
          </div>

          <div className="builds-grid">
            {BUILDS.map((b, i) => (
              <div key={i} className="build">
                <SceneArt seed={b.seed} />
                <div className="build-cap">
                  <div className="rider">{b.rider}</div>
                  <div className="bike">{b.bike}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= NEWSLETTER ===================== */}
      <section className="section">
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </>
  )
}
