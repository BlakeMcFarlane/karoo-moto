import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import TopoPattern from '../components/art/TopoPattern'
import SceneArt from '../components/art/SceneArt'
import Newsletter from '../components/Newsletter'

const ARTICLES = [
  {
    tag: 'Build',
    title: 'A KTM 500 set up for the Karoo Loop',
    date: 'Jul 2026',
    excerpt:
      'Rally tower, Karoo Dash and HD skid plate — how one rider spec\'d a lightweight bike for a week off the tar.',
    seed: 0,
  },
  {
    tag: 'How-To',
    title: 'Wiring auxiliary lighting to the tower',
    date: 'Jun 2026',
    excerpt:
      'A clean, fused install using the billet switch panel and a Deutsch-connectorised harness. No cut factory looms.',
    seed: 1,
  },
  {
    tag: 'Field Notes',
    title: 'Why anti-vibration mounting matters',
    date: 'Jun 2026',
    excerpt:
      'High-frequency buzz is what actually kills GPS units and roadbooks. Here\'s how isolation bushings fix it.',
    seed: 3,
  },
  {
    tag: 'Build',
    title: 'Husqvarna 701 — long-range dual-sport',
    date: 'May 2026',
    excerpt:
      'Rear rack, side carriers and comms mount for a bike built to eat highway miles and then leave the road.',
    seed: 2,
  },
  {
    tag: 'How-To',
    title: 'Torque values that keep towers tight',
    date: 'May 2026',
    excerpt:
      'The difference between a rattle at 200 km and a rock-solid cockpit is a torque wrench and thread locker.',
    seed: 0,
  },
  {
    tag: 'Field Notes',
    title: 'Packing soft luggage that stays put',
    date: 'Apr 2026',
    excerpt:
      'Keep the load narrow, low and close to the bike. A quick guide to loading the side carrier set.',
    seed: 1,
  },
]

export default function Journal() {
  const [feature, ...rest] = ARTICLES
  return (
    <>
      <section className="page-hero">
        <TopoPattern className="page-hero-art" opacity={0.3} />
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>Journal / Builds</span>
          </div>
          <span className="eyebrow">Built, not bought</span>
          <h1>The Journal</h1>
          <p>
            Rider builds, install how-tos and field notes from the workshop and
            the trail. Real bikes, real setups.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          {/* Featured article */}
          <Link
            to="/journal"
            className="article-card"
            style={{ marginBottom: 'var(--sp-6)' }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr' }} className="feature-article">
              <div className="article-media" style={{ aspectRatio: 'auto', minHeight: 320 }}>
                <SceneArt seed={feature.seed} />
              </div>
              <div className="article-body" style={{ justifyContent: 'center', padding: 'var(--sp-7)' }}>
                <span className="article-date">
                  {feature.tag} · {feature.date}
                </span>
                <h3 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)' }}>{feature.title}</h3>
                <p style={{ fontSize: '1rem' }}>{feature.excerpt}</p>
                <span className="lc-more" style={{ marginTop: 'var(--sp-3)' }}>
                  Read build <Icon name="arrow-right" size={15} />
                </span>
              </div>
            </div>
          </Link>

          <div className="grid grid-3">
            {rest.map((a) => (
              <Link key={a.title} to="/journal" className="article-card">
                <div className="article-media">
                  <SceneArt seed={a.seed} />
                </div>
                <div className="article-body">
                  <span className="article-date">
                    {a.tag} · {a.date}
                  </span>
                  <h3>{a.title}</h3>
                  <p>{a.excerpt}</p>
                  <span className="lc-more">
                    Read <Icon name="arrow-right" size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <Newsletter />
        </div>
      </section>
    </>
  )
}
