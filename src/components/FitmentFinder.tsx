import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { MAKES, modelsForMake, yearsFor } from '../data/bikes'
import { productsForBike } from '../data/products'

/**
 * Three-step Make → Model → Year selector. On the homepage it shows a live
 * count and links through to Shop; on its own page (`variant="page"`) the same
 * control drives an inline result grid handled by the parent via `onResult`.
 */
export default function FitmentFinder({
  onResult,
  compact = false,
}: {
  onResult?: (make: string, model: string, year: string) => void
  compact?: boolean
}) {
  const navigate = useNavigate()
  const [make, setMake] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')

  const models = useMemo(() => (make ? modelsForMake(make) : []), [make])
  const years = useMemo(
    () => (make && model ? yearsFor(make, model) : []),
    [make, model],
  )

  const matchCount = useMemo(
    () => (make && model ? productsForBike(make, model).length : 0),
    [make, model],
  )

  const ready = Boolean(make && model && year)

  const submit = () => {
    if (!ready) return
    if (onResult) {
      onResult(make, model, year)
    } else {
      const params = new URLSearchParams({ make, model, year })
      navigate(`/shop?${params.toString()}`)
    }
  }

  return (
    <div className={`fitment ${compact ? '' : 'fitment-hero'}`}>
      <div className="fitment-head">
        <Icon name="bike" size={22} className="muted" />
        <div>
          <div className="eyebrow">Bike Fitment Finder</div>
        </div>
      </div>

      <div className="fitment-grid">
        <div className="field">
          <label htmlFor="fit-make">Make</label>
          <select
            id="fit-make"
            value={make}
            onChange={(e) => {
              setMake(e.target.value)
              setModel('')
              setYear('')
            }}
          >
            <option value="">Select make</option>
            {MAKES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="fit-model">Model</label>
          <select
            id="fit-model"
            value={model}
            disabled={!make}
            onChange={(e) => {
              setModel(e.target.value)
              setYear('')
            }}
          >
            <option value="">{make ? 'Select model' : '—'}</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="fit-year">Year</label>
          <select
            id="fit-year"
            value={year}
            disabled={!model}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="">{model ? 'Select year' : '—'}</option>
            {years.map((y) => (
              <option key={y} value={String(y)}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" onClick={submit} disabled={!ready}>
          <Icon name="search" size={18} /> Find Parts
        </button>
      </div>

      {make && model && (
        <div className="fitment-result">
          <span className="count">
            <b>{matchCount}</b> product{matchCount === 1 ? '' : 's'} fit the{' '}
            {make} {model}
            {year ? ` (${year})` : ''}
          </span>
          {!year && (
            <span className="mono muted" style={{ fontSize: '0.8rem' }}>
              Select a year to continue
            </span>
          )}
        </div>
      )}
    </div>
  )
}
