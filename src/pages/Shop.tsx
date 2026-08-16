import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import TopoPattern from '../components/art/TopoPattern'
import { PRODUCTS, formatPrice } from '../data/products'
import { CATEGORIES, CATEGORY_MAP } from '../data/categories'
import type { CategoryId, Product } from '../data/types'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name'

const AVAILABILITY = [
  { id: 'in-stock', label: 'In Stock' },
  { id: 'made-to-order', label: 'Made to Order' },
] as const

export default function Shop() {
  const { category } = useParams<{ category?: string }>()
  const [params, setParams] = useSearchParams()
  const [sort, setSort] = useState<SortKey>('featured')
  const [avail, setAvail] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(800)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const make = params.get('make') ?? ''
  const model = params.get('model') ?? ''
  const year = params.get('year') ?? ''
  const bikeFilter = Boolean(make && model)

  const activeCat = (category as CategoryId | undefined) ?? null
  const catMeta = activeCat ? CATEGORY_MAP[activeCat] : null

  const results = useMemo(() => {
    let list: Product[] = [...PRODUCTS]

    if (activeCat) list = list.filter((p) => p.category === activeCat)

    if (bikeFilter) {
      list = list.filter((p) =>
        p.fitment.some((f) => f.make === make && f.model === model),
      )
    }

    if (avail.length) {
      list = list.filter((p) => avail.includes(p.stockStatus))
    }

    list = list.filter((p) => (p.salePrice ?? p.price) <= maxPrice)

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price))
        break
      case 'price-desc':
        list.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price))
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        list.sort((a, b) => Number(b.featured ?? 0) - Number(a.featured ?? 0))
    }
    return list
  }, [activeCat, bikeFilter, make, model, avail, maxPrice, sort])

  const toggleAvail = (id: string) =>
    setAvail((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const clearBike = () => {
    const next = new URLSearchParams(params)
    next.delete('make')
    next.delete('model')
    next.delete('year')
    setParams(next)
  }

  const title = catMeta ? catMeta.name : 'Shop All'
  const subtitle = catMeta
    ? catMeta.blurb
    : 'The full Karoo Moto catalogue — rally towers, navigation, protection and the billet parts that finish a build.'

  return (
    <>
      <section className="page-hero">
        <TopoPattern className="page-hero-art" opacity={0.3} />
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">/</span>
            <Link to="/shop">Shop</Link>
            {catMeta && (
              <>
                <span className="sep">/</span>
                <span>{catMeta.name}</span>
              </>
            )}
          </div>
          <span className="eyebrow">Catalogue</span>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          {/* category chips */}
          <div className="chip-row">
            <Link to="/shop" className={`chip ${!activeCat ? 'active' : ''}`}>
              All
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={`/shop/${c.id}`}
                className={`chip ${activeCat === c.id ? 'active' : ''}`}
              >
                {c.short}
              </Link>
            ))}
          </div>

          {/* fitment banner */}
          {bikeFilter && (
            <div
              className="fitment-result"
              style={{
                border: '1px solid var(--line-bronze)',
                borderRadius: 'var(--r-lg)',
                padding: 'var(--sp-4) var(--sp-5)',
                marginBottom: 'var(--sp-5)',
                background: 'rgba(166,107,54,0.06)',
                marginTop: 0,
              }}
            >
              <span className="count" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                <Icon name="bike" size={20} className="muted" />
                Showing parts that fit the <b>&nbsp;{make} {model}{year ? ` (${year})` : ''}</b>
              </span>
              <button className="btn-ghost" onClick={clearBike}>
                Clear <Icon name="close" size={15} />
              </button>
            </div>
          )}

          <div className="shop-layout">
            {/* filters */}
            <aside className={`filters ${filtersOpen ? 'open' : ''}`} aria-label="Filters">
              <div className="filter-group">
                <h4>Category</h4>
                <Link
                  to="/shop"
                  className="filter-opt"
                  style={{ color: !activeCat ? 'var(--copper)' : undefined }}
                >
                  All products
                </Link>
                {CATEGORIES.map((c) => (
                  <Link
                    key={c.id}
                    to={`/shop/${c.id}`}
                    className="filter-opt"
                    style={{ color: activeCat === c.id ? 'var(--copper)' : undefined }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>

              <div className="filter-group">
                <h4>Availability</h4>
                {AVAILABILITY.map((a) => (
                  <label key={a.id} className="filter-opt">
                    <input
                      type="checkbox"
                      checked={avail.includes(a.id)}
                      onChange={() => toggleAvail(a.id)}
                    />
                    {a.label}
                  </label>
                ))}
              </div>

              <div className="filter-group">
                <h4>Max Price · {formatPrice(maxPrice)}</h4>
                <input
                  type="range"
                  min={80}
                  max={800}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--karoo-bronze)' }}
                  aria-label="Maximum price"
                />
                <div
                  className="mono"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem',
                    color: 'var(--text-low)',
                    marginTop: 4,
                  }}
                >
                  <span>$80</span>
                  <span>$800</span>
                </div>
              </div>
            </aside>

            {/* results */}
            <div>
              <div className="shop-toolbar">
                <button
                  className="btn btn-secondary btn-sm filter-toggle"
                  onClick={() => setFiltersOpen((v) => !v)}
                >
                  <Icon name="menu" size={16} /> Filters
                </button>
                <span className="shop-count">
                  {results.length} product{results.length === 1 ? '' : 's'}
                </span>
                <label
                  className="field"
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-low)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Sort
                  </span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    style={{ width: 190, height: 40 }}
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name">Name A–Z</option>
                  </select>
                </label>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-3">
                  {results.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <h3>No products match those filters</h3>
                  <p className="muted">
                    Try widening your price range or clearing the bike filter.
                  </p>
                  <div style={{ marginTop: 'var(--sp-4)' }}>
                    <Link to="/shop" className="btn btn-secondary btn-sm">
                      Reset filters
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
