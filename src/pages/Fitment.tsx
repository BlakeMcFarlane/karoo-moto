import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import TopoPattern from '../components/art/TopoPattern'
import FitmentFinder from '../components/FitmentFinder'
import ProductCard from '../components/ProductCard'
import { productsForBike } from '../data/products'
import { BIKES } from '../data/bikes'
import type { Product } from '../data/types'

export default function Fitment() {
  const [result, setResult] = useState<{
    make: string
    model: string
    year: string
    products: Product[]
  } | null>(null)

  const onResult = (make: string, model: string, year: string) => {
    setResult({ make, model, year, products: productsForBike(make, model) })
  }

  return (
    <>
      <section className="page-hero">
        <TopoPattern className="page-hero-art" opacity={0.3} />
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <span>Bike Fitment Finder</span>
          </div>
          <span className="eyebrow">Fitment First</span>
          <h1>Find your bike</h1>
          <p>
            Pick your platform and see exactly what fits — no cross-referencing
            part numbers, no guesswork. Fitment confidence is the whole point.
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <FitmentFinder onResult={onResult} compact />

          {result && (
            <div style={{ marginTop: 'var(--sp-7)' }}>
              <div className="row-between" style={{ marginBottom: 'var(--sp-5)' }}>
                <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>
                  {result.products.length} part
                  {result.products.length === 1 ? '' : 's'} fit your {result.make}{' '}
                  {result.model}
                </h2>
                <span className="mono muted">Model year {result.year}</span>
              </div>

              {result.products.length > 0 ? (
                <div className="grid grid-3">
                  {result.products.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <h3>No listed parts for that platform yet</h3>
                  <p className="muted">
                    We're adding fitments regularly. Tell us what you ride and
                    we'll let you know the moment it's supported.
                  </p>
                  <div style={{ marginTop: 'var(--sp-4)' }}>
                    <Link to="/contact" className="btn btn-secondary btn-sm">
                      Request a fitment
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {!result && (
        <section className="section-sm" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Supported Platforms</span>
              <h2 style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>
                What we build for today
              </h2>
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
                  <div className="blurb">Years {b.years[b.years.length - 1]}–{b.years[0]}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
