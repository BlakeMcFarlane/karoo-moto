import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import TopoPattern from '../components/art/TopoPattern'

export default function NotFound() {
  return (
    <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <TopoPattern
        className=""
        opacity={0.14}
        stroke="#8b5e35"
      />
      <div
        className="container container-narrow"
        style={{ position: 'relative', textAlign: 'center', paddingBlock: 'var(--sp-8)' }}
      >
        <div className="mono" style={{ color: 'var(--copper)', letterSpacing: '0.3em', marginBottom: 'var(--sp-4)' }}>
          ERROR · 404
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(2.4rem,6vw,4rem)' }}>
          Off the map
        </h1>
        <p className="lede" style={{ maxWidth: '46ch', margin: 'var(--sp-4) auto 0' }}>
          The road ran out. This page doesn't exist — let's get you back to
          something solid.
        </p>
        <div style={{ marginTop: 'var(--sp-6)', display: 'flex', gap: 'var(--sp-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Icon name="arrow-left" size={18} /> Back Home
          </Link>
          <Link to="/shop" className="btn btn-secondary">
            Shop All
          </Link>
        </div>
      </div>
    </section>
  )
}
